import type { User, Event, Calendar, EventPermissions } from '../types';

/** Roles that have staff-level or higher access */
const STAFF_LIKE_ROLES = [
  'LECTURER',
  'INSTRUCTOR',
  'TECHNICAL_OFFICER',
  'HOD',
  'ADMIN'
] as const;

const ELEVATED_ROLES = ['HOD', 'ADMIN'] as const;

/**
 * Determines what permissions a user has for a given event
 */
export const getEventPermissions = (
  event: Event,
  user: User | null,
  calendar: Calendar
): EventPermissions => {
  if (!user) {
    return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };
  }

  // Admin and HOD have full access to everything
  if (user.role === 'ADMIN' || user.role === 'HOD') {
    return { canView: true, canEdit: true, canDelete: true, viewMode: 'FULL' };
  }

  const isManager = calendar.managers.includes(user.id);
  const isCreator = event.createdBy === user.id;

  if (user.role === 'LECTURER') {
    const canModify = isManager || isCreator;

    switch (event.visibility) {
      case 'PRIVATE':
        if (isCreator)
          return { canView: true, canEdit: true, canDelete: true, viewMode: 'FULL' };
        return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };

      case 'STAFF_ONLY':
      case 'BUSY_ONLY':
      case 'PUBLIC':
      default:
        return {
          canView: true,
          canEdit: canModify,
          canDelete: canModify,
          viewMode: 'FULL'
        };
    }
  }

  if (user.role === 'INSTRUCTOR') {
    const canModify = isCreator || isManager;

    switch (event.visibility) {
      case 'PRIVATE':
        if (isCreator)
          return { canView: true, canEdit: true, canDelete: true, viewMode: 'FULL' };
        return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };

      case 'STAFF_ONLY':
      case 'BUSY_ONLY':
      case 'PUBLIC':
      default:
        return {
          canView: true,
          canEdit: canModify,
          canDelete: canModify,
          viewMode: 'FULL'
        };
    }
  }

  if (user.role === 'TECHNICAL_OFFICER') {
    switch (event.visibility) {
      case 'PRIVATE':
        return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };

      case 'STAFF_ONLY':
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'FULL' };

      case 'BUSY_ONLY':
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'BUSY' };

      case 'PUBLIC':
      default:
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'FULL' };
    }
  }

  if (user.role === 'STUDENT') {
    switch (event.visibility) {
      case 'PRIVATE':
        return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };

      case 'STAFF_ONLY':
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'STAFF_EVENT' };

      case 'BUSY_ONLY':
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'BUSY' };

      case 'PUBLIC':
      default:
        return { canView: true, canEdit: false, canDelete: false, viewMode: 'FULL' };
    }
  }

  return { canView: false, canEdit: false, canDelete: false, viewMode: 'HIDDEN' };
};

/**
 * Checks if user can create events in a calendar
 */
export const canCreateEvent = (user: User | null, calendar: Calendar): boolean => {
  if (!user) return false;

  if (user.role === 'ADMIN' || user.role === 'HOD') return true;

  if (
    (user.role === 'LECTURER' || user.role === 'INSTRUCTOR') &&
    calendar.managers.includes(user.id)
  ) return true;

  return false;
};

/**
 * Checks if user can manage a calendar
 */
export const canManageCalendar = (user: User | null, calendar: Calendar): boolean => {
  if (!user) return false;

  if (user.role === 'ADMIN' || user.role === 'HOD') return true;

  if (
    (user.role === 'LECTURER' || user.role === 'INSTRUCTOR') &&
    calendar.managers.includes(user.id)
  ) return true;

  return false;
};

/**
 * Checks if user can approve/reject events
 */
export const canApproveEvents = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'HOD';
};

/**
 * Checks if user can view admin pages
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'HOD';
};

/**
 * Checks if user has staff-level or higher access
 */
export const isStaffOrAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return (STAFF_LIKE_ROLES as readonly string[]).includes(user.role);
};

/**
 * Checks if user has elevated access
 */
export const isElevated = (user: User | null): boolean => {
  if (!user) return false;
  return (ELEVATED_ROLES as readonly string[]).includes(user.role);
};

/**
 * Filters calendars based on user role
 */
export const getVisibleCalendars = (
  calendars: Calendar[],
  user: User | null
): Calendar[] => {
  if (!user) return calendars.filter(cal => cal.visibility === 'PUBLIC');

  if (user.role === 'ADMIN' || user.role === 'HOD') return calendars;

  if (isStaffOrAdmin(user)) {
    return calendars.filter(
      cal => cal.visibility === 'PUBLIC' || cal.visibility === 'STAFF_ONLY'
    );
  }
  return calendars.filter(cal => cal.visibility === 'PUBLIC');
};

/**
 * Gets display text for event
 */
export const getEventDisplayText = (
  event: Event,
  viewMode: EventPermissions['viewMode']
): { title: string; description: string; location: string } => {
  switch (viewMode) {
    case 'HIDDEN':
      return { title: '', description: '', location: '' };

    case 'BUSY':
      return { title: 'Busy', description: '', location: '' };

    case 'STAFF_EVENT':
      return { title: 'Staff Event', description: '', location: '' };

    case 'FULL':
    default:
      return {
        title: event.title,
        description: event.description || '',
        location: event.location || '',
      };
  }
};
