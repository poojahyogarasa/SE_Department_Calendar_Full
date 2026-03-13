import type { Event, Calendar, User, AuditLog, Resource, Task } from '../types';
import { mockEvents, mockCalendars, mockUsers, mockAuditLogs, mockResources } from '../data/mockData';

const STORAGE_KEYS = {
  EVENTS: 'dce_calendar_events',
  CALENDARS: 'dce_calendar_calendars',
  USERS: 'dce_calendar_users',
  AUDIT_LOGS: 'dce_calendar_audit_logs',
  RESOURCES: 'dce_calendar_resources',
  CURRENT_USER: 'dce_calendar_current_user',
  INITIALIZED: 'dce_calendar_initialized',
  TASKS_PREFIX: 'dce_calendar_tasks_', // per-user tasks key prefix
};

/**
 * Serialize dates in objects before storing
 */
const serialize = <T>(data: T): string => {
  return JSON.stringify(data, (_key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value) };
    }
    return value;
  });
};

/**
 * Deserialize dates when retrieving
 */
const deserialize = <T>(data: string): T => {
  return JSON.parse(data, (_key, value) => {
    if (value && typeof value === 'object') {
      if (value.__type === 'Date') {
        return new Date(value.value);
      }
      if (value.__type === 'Set') {
        return new Set(value.value);
      }
    }
    return value;
  });
};

// Bump this version whenever the mock data schema changes to force re-initialisation
const DATA_VERSION = '2';

/**
 * Initialize storage with mock data on first run (or after a version bump)
 */
export const initializeStorage = (): void => {
  const storedVersion = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (storedVersion !== DATA_VERSION) {
    // Re-seed mock data but preserve the active user session
    localStorage.setItem(STORAGE_KEYS.EVENTS, serialize(mockEvents));
    localStorage.setItem(STORAGE_KEYS.CALENDARS, serialize(mockCalendars));
    localStorage.setItem(STORAGE_KEYS.USERS, serialize(mockUsers));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, serialize(mockAuditLogs));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, serialize(mockResources));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, DATA_VERSION);
  }
};

/**
 * Reset storage to initial mock data
 */
export const resetStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeStorage();
};

// Events
export const getStoredEvents = (): Event[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? deserialize<Event[]>(data) : [];
};

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, serialize(events));
};

// Calendars
export const getStoredCalendars = (): Calendar[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CALENDARS);
  return data ? deserialize<Calendar[]>(data) : [];
};

export const saveCalendars = (calendars: Calendar[]): void => {
  localStorage.setItem(STORAGE_KEYS.CALENDARS, serialize(calendars));
};

// Users
export const getStoredUsers = (): User[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? deserialize<User[]>(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, serialize(users));
};

// Audit Logs
export const getStoredAuditLogs = (): AuditLog[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return data ? deserialize<AuditLog[]>(data) : [];
};

export const saveAuditLogs = (logs: AuditLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, serialize(logs));
};

// Resources
export const getStoredResources = (): Resource[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  return data ? deserialize<Resource[]>(data) : [];
};

export const saveResources = (resources: Resource[]): void => {
  localStorage.setItem(STORAGE_KEYS.RESOURCES, serialize(resources));
};

// Current User
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? deserialize<User>(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, serialize(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

/**
 * Clear all current session data (logout)
 */
export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Export all data (for backup/debugging)
 */
export const exportAllData = () => {
  return {
    events: getStoredEvents(),
    calendars: getStoredCalendars(),
    users: getStoredUsers(),
    auditLogs: getStoredAuditLogs(),
    resources: getStoredResources(),
  };
};

// Tasks (per user)
export const getStoredTasks = (userId: string): Task[] => {
  const key = STORAGE_KEYS.TASKS_PREFIX + userId;
  const data = localStorage.getItem(key);
  return data ? deserialize<Task[]>(data) : [];
};

export const saveTasks = (userId: string, tasks: Task[]): void => {
  const key = STORAGE_KEYS.TASKS_PREFIX + userId;
  localStorage.setItem(key, serialize(tasks));
};
