import type { User, Calendar, Event, Resource, AuditLog } from '../types';

// No mock users — all users are managed in the backend database
export const mockUsers: User[] = [];

// Default calendars — these are the system calendars used to categorise events
export const mockCalendars: Calendar[] = [
  {
    id: 'cal-1',
    name: 'Academic Calendar',
    color: '#2563eb',
    visibility: 'PUBLIC',
    managers: [],
    description: 'Official academic events and deadlines',
    isActive: true,
  },
  {
    id: 'cal-2',
    name: 'Examinations',
    color: '#dc2626',
    visibility: 'PUBLIC',
    managers: [],
    description: 'Exam schedules and assessments',
    isActive: true,
  },
  {
    id: 'cal-3',
    name: 'Seminars & Workshops',
    color: '#7c3aed',
    visibility: 'PUBLIC',
    managers: [],
    description: 'Guest lectures, seminars, and workshops',
    isActive: true,
  },
  {
    id: 'cal-4',
    name: 'Staff Meetings',
    color: '#ea580c',
    visibility: 'STAFF_ONLY',
    managers: [],
    description: 'Internal staff meetings and discussions',
    isActive: true,
  },
  {
    id: 'cal-5',
    name: 'Lab Bookings',
    color: '#059669',
    visibility: 'PUBLIC',
    managers: [],
    description: 'Computer lab and equipment bookings',
    isActive: true,
  },
];

// No mock resources — kept minimal for type compatibility
export const mockResources: Resource[] = [];

// No mock events — all events are created by users
export const mockEvents: Event[] = [];

// No mock audit logs — all audit entries are generated at runtime
export const mockAuditLogs: AuditLog[] = [];
