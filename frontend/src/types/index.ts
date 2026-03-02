// User and Role Types
export type UserRole =
  | 'STUDENT'
  | 'LECTURER'
  | 'INSTRUCTOR'
  | 'TECHNICAL_OFFICER'
  | 'HOD'
  | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: number;
  semester?: number;
  group?: string;
}

// Calendar Types
export type CalendarVisibility = 'PUBLIC' | 'STAFF_ONLY' | 'PRIVATE';

export interface Calendar {
  id: string;
  name: string;
  color: string;
  visibility: CalendarVisibility;
  managers: string[]; // Array of user IDs who can manage this calendar
  description?: string;
  isActive: boolean;
}

// Event Types
export type EventVisibility = 'PUBLIC' | 'STAFF_ONLY' | 'PRIVATE' | 'BUSY_ONLY';
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type EventCategory = 'LECTURE' | 'LAB' | 'EXAM' | 'SEMINAR' | 'MEETING' | 'OTHER';
export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // Every N days/weeks/months
  endDate?: Date;
  count?: number; // Number of occurrences
}

export interface Event {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  visibility: EventVisibility;
  category: EventCategory;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  recurrence?: RecurrenceRule;
  color?: string; // Override calendar color
  // Room/Resource booking
  resourceId?: string;
  // Course specific fields
  courseCode?: string;
  courseYear?: number;
  courseGroup?: string;
  // Approval workflow
  status?: EventStatus;
  rejectionReason?: string;
  // Lab session details (for Technical Officers)
  studentCount?: number;
  // Notification preference (minutes before event)
  notificationMinutes?: number;
}

// Resource Types (for room/lab booking)
export type ResourceType = 'ROOM' | 'LAB' | 'HALL' | 'EQUIPMENT';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity?: number;
  location?: string;
  facilities?: string[];
  isActive: boolean;
}

// Audit Log Types
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type AuditEntityType = 'EVENT' | 'CALENDAR' | 'USER' | 'RESOURCE';

export interface AuditLog {
  id: string;
  actorId: string; // User who performed the action
  actorName: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName: string;
  timestamp: Date;
  diffSummary: string; // Human-readable summary of what changed
  details?: Record<string, any>; // Detailed changes
}

// Personal Task Types (for Students and Instructors)
export type TaskList = 'my-day' | 'important' | 'planned' | 'tasks';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  userId: string; // owner
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority?: TaskPriority;
  list: TaskList;
  createdAt: Date;
}

// View Types
export type CalendarView = 'DAY' | 'WEEK' | 'MONTH';

// Filter Types
export interface CalendarFilters {
  calendars: Set<string>; // Calendar IDs
  categories: Set<EventCategory>;
  courseYears: Set<number>;
  courseGroups: Set<string>;
  showPrivate: boolean;
}

// Permission Helper Types
export interface EventPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  viewMode: 'FULL' | 'STAFF_EVENT' | 'BUSY' | 'HIDDEN';
}

// Conflict Detection Types
export interface EventConflict {
  eventId: string;
  eventTitle: string;
  conflictType: 'TIME_OVERLAP' | 'RESOURCE_CONFLICT';
  message: string;
}

// Store State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

export interface CalendarState {
  currentDate: Date;
  viewType: CalendarView;
  selectedCalendars: Set<string>;
  filters: CalendarFilters;
  setCurrentDate: (date: Date) => void;
  setViewType: (view: CalendarView) => void;
  goToToday: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  toggleCalendar: (calendarId: string) => void;
  selectAllCalendars: () => void;
  deselectAllCalendars: () => void;
  setFilters: (filters: Partial<CalendarFilters>) => void;
}

export interface EventState {
  events: Event[];
  calendars: Calendar[];
  resources: Resource[];
  auditLogs: AuditLog[];
  // Event operations
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  getEvent: (eventId: string) => Event | undefined;
  getEventsByDateRange: (start: Date, end: Date) => Event[];
  // Calendar operations
  addCalendar: (calendar: Omit<Calendar, 'id'>) => string;
  updateCalendar: (calendarId: string, updates: Partial<Calendar>) => void;
  deleteCalendar: (calendarId: string) => void;
  // Resource operations
  addResource: (resource: Omit<Resource, 'id'>) => string;
  updateResource: (resourceId: string, updates: Partial<Resource>) => void;
  deleteResource: (resourceId: string) => void;
  checkResourceAvailability: (resourceId: string, start: Date, end: Date, excludeEventId?: string) => boolean;
  // Conflict detection
  checkEventConflicts: (event: Partial<Event> & { start: Date; end: Date; resourceId?: string }, excludeEventId?: string) => EventConflict[];
  // Audit
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

// UI Component Props Types
export interface EventCardProps {
  event: Event;
  calendar: Calendar;
  viewMode: 'FULL' | 'STAFF_EVENT' | 'BUSY' | 'HIDDEN';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  initialDate?: Date;
  initialCalendarId?: string;
}

export interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
