import { create } from 'zustand';
import type { EventState, Event, Calendar, Resource, AuditLog, EventConflict } from '../types';
import {
  getStoredEvents,
  saveEvents,
  getStoredCalendars,
  saveCalendars,
  getStoredResources,
  saveResources,
  getStoredAuditLogs,
  saveAuditLogs,
} from '../utils/storage';
import { areIntervalsOverlapping } from 'date-fns';
import { auditAPI } from '../services/api';

export const useEventStore = create<EventState>((set, get) => ({
  events: getStoredEvents(),
  calendars: getStoredCalendars(),
  resources: getStoredResources(),
  auditLogs: getStoredAuditLogs(),

  // Event operations
  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const events = [...get().events, newEvent];
    saveEvents(events);
    set({ events });

    // Add audit log
    get().addAuditLog({
      actorId: newEvent.createdBy,
      actorName: 'User', // Should get from auth store
      action: 'CREATE',
      entityType: 'EVENT',
      entityId: newEvent.id,
      entityName: newEvent.title,
      diffSummary: `Created new event: ${newEvent.title}`,
      details: { category: newEvent.category, visibility: newEvent.visibility },
    });

    return newEvent.id;
  },

  updateEvent: (eventId, updates) => {
    const events = get().events.map((event) =>
      event.id === eventId
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    );

    saveEvents(events);
    set({ events });

    // Add audit log
    const updatedEvent = events.find(e => e.id === eventId);
    if (updatedEvent) {
      get().addAuditLog({
        actorId: updatedEvent.createdBy,
        actorName: 'User',
        action: 'UPDATE',
        entityType: 'EVENT',
        entityId: eventId,
        entityName: updatedEvent.title,
        diffSummary: `Updated event: ${updatedEvent.title}`,
        details: updates,
      });
    }
  },

  deleteEvent: (eventId) => {
    const eventToDelete = get().events.find(e => e.id === eventId);
    const events = get().events.filter((event) => event.id !== eventId);

    saveEvents(events);
    set({ events });

    // Add audit log
    if (eventToDelete) {
      get().addAuditLog({
        actorId: eventToDelete.createdBy,
        actorName: 'User',
        action: 'DELETE',
        entityType: 'EVENT',
        entityId: eventId,
        entityName: eventToDelete.title,
        diffSummary: `Deleted event: ${eventToDelete.title}`,
      });
    }
  },

  getEvent: (eventId) => {
    return get().events.find((event) => event.id === eventId);
  },

  getEventsByDateRange: (start, end) => {
    return get().events.filter((event) => {
      // Check if event overlaps with the date range
      return areIntervalsOverlapping(
        { start: new Date(event.start), end: new Date(event.end) },
        { start, end },
        { inclusive: true }
      );
    });
  },

  // Calendar operations
  addCalendar: (calendarData) => {
    const newCalendar: Calendar = {
      ...calendarData,
      id: `cal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const calendars = [...get().calendars, newCalendar];
    saveCalendars(calendars);
    set({ calendars });

    return newCalendar.id;
  },

  updateCalendar: (calendarId, updates) => {
    const calendars = get().calendars.map((calendar) =>
      calendar.id === calendarId ? { ...calendar, ...updates } : calendar
    );

    saveCalendars(calendars);
    set({ calendars });
  },

  deleteCalendar: (calendarId) => {
    const calendars = get().calendars.filter((calendar) => calendar.id !== calendarId);
    // Also delete all events in this calendar
    const events = get().events.filter((event) => event.calendarId !== calendarId);

    saveCalendars(calendars);
    saveEvents(events);
    set({ calendars, events });
  },

  // Resource operations
  addResource: (resourceData) => {
    const newResource: Resource = {
      ...resourceData,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const resources = [...get().resources, newResource];
    saveResources(resources);
    set({ resources });

    return newResource.id;
  },

  updateResource: (resourceId, updates) => {
    const resources = get().resources.map((resource) =>
      resource.id === resourceId ? { ...resource, ...updates } : resource
    );

    saveResources(resources);
    set({ resources });
  },

  deleteResource: (resourceId) => {
    const resources = get().resources.filter((resource) => resource.id !== resourceId);

    saveResources(resources);
    set({ resources });
  },

  checkResourceAvailability: (resourceId, start, end, excludeEventId) => {
    const events = get().events.filter(
      (event) =>
        event.resourceId === resourceId &&
        event.id !== excludeEventId &&
        areIntervalsOverlapping(
          { start: new Date(event.start), end: new Date(event.end) },
          { start, end },
          { inclusive: true }
        )
    );

    return events.length === 0;
  },

  // Conflict detection
  checkEventConflicts: (event, excludeEventId) => {
    const conflicts: EventConflict[] = [];

    // Check resource conflicts
    if (event.resourceId) {
      const resourceEvents = get().events.filter(
        (e) =>
          e.resourceId === event.resourceId &&
          e.id !== excludeEventId &&
          areIntervalsOverlapping(
            { start: new Date(e.start), end: new Date(e.end) },
            { start: event.start, end: event.end },
            { inclusive: true }
          )
      );

      resourceEvents.forEach((conflictingEvent) => {
        const resource = get().resources.find(r => r.id === event.resourceId);
        conflicts.push({
          eventId: conflictingEvent.id,
          eventTitle: conflictingEvent.title,
          conflictType: 'RESOURCE_CONFLICT',
          message: `Resource "${resource?.name}" is already booked for this time`,
        });
      });
    }

    // Check time overlaps for same calendar (optional warning)
    if (event.calendarId) {
      const calendarEvents = get().events.filter(
        (e) =>
          e.calendarId === event.calendarId &&
          e.id !== excludeEventId &&
          areIntervalsOverlapping(
            { start: new Date(e.start), end: new Date(e.end) },
            { start: event.start, end: event.end },
            { inclusive: true }
          )
      );

      if (calendarEvents.length > 0) {
        calendarEvents.forEach((conflictingEvent) => {
          conflicts.push({
            eventId: conflictingEvent.id,
            eventTitle: conflictingEvent.title,
            conflictType: 'TIME_OVERLAP',
            message: `Time overlaps with "${conflictingEvent.title}"`,
          });
        });
      }
    }

    return conflicts;
  },

  // Audit operations
  addAuditLog: (logData) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    const auditLogs = [newLog, ...get().auditLogs];
    saveAuditLogs(auditLogs);
    set({ auditLogs });

    // L2: Persist audit log to backend (fire-and-forget)
    auditAPI.log({
      actorId: logData.actorId,
      actorName: logData.actorName,
      action: logData.action,
      entityType: logData.entityType,
      entityId: logData.entityId,
      entityName: logData.entityName,
      diffSummary: logData.diffSummary,
      details: logData.details,
    }).catch(() => {});
  },
}));
