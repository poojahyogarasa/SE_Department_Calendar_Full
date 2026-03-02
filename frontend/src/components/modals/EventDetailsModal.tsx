import { X, Calendar, Clock, MapPin, User, Tag, FileText, CheckCircle, Pencil, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventStore } from '../../stores/useEventStore';
import { getEventPermissions } from '../../utils/permissions';
import type { Event } from '../../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onCancel
}: EventDetailsModalProps) {
  const { user } = useAuthStore();
  const { calendars } = useEventStore();

  if (!isOpen) return null;

  const calendar = calendars.find(c => c.id === event.calendarId);
  const perms = calendar ? getEventPermissions(event, user, calendar) : null;
  const canEdit = perms?.canEdit ?? false;
  const canDelete = perms?.canDelete ?? false;

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      LECTURE: 'Lecture',
      LAB: 'Lab Session',
      EXAM: 'Exam',
      SEMINAR: 'Academic Seminar',
      MEETING: 'Meeting',
      OTHER: 'Other',
    };
    return map[category] || 'Other';
  };

  const getStatusBadge = () => {
    switch (event.status) {
      case 'APPROVED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">Rejected</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">Pending Approval</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Scheduled</span>;
    }
  };

  // Student count is shown to TOs, Instructors, Admin, HOD for LAB events
  const showStudentCount =
    event.category === 'LAB' &&
    event.studentCount !== undefined &&
    (user?.role === 'TECHNICAL_OFFICER' ||
      user?.role === 'ADMIN' ||
      user?.role === 'HOD' ||
      user?.role === 'INSTRUCTOR');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-xl mx-4 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: calendar?.color ?? '#6366f1' }}
            />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {calendar?.name ?? 'Calendar'}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>
          <p className="text-gray-500 text-sm mb-6">{getCategoryLabel(event.category)}</p>

          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-gray-900">{format(new Date(event.start), 'MMMM d, yyyy')}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-gray-900">
                  {format(new Date(event.start), 'h:mm a')} – {format(new Date(event.end), 'h:mm a')}
                </p>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              </div>
            )}

            {/* Student Count — visible to TO / Instructor / Admin for LAB events */}
            {showStudentCount && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Expected Students</p>
                  <p className="text-gray-900 font-medium">{event.studentCount}</p>
                </div>
              </div>
            )}

            {/* Event Type */}
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Event Type</p>
                <p className="text-gray-900">{getCategoryLabel(event.category)}</p>
              </div>
            </div>

            {/* Course info */}
            {event.courseCode && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="text-gray-900">
                    {event.courseCode}
                    {event.courseYear && ` · Year ${event.courseYear}`}
                    {event.courseGroup && ` · Group ${event.courseGroup}`}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-gray-900">{event.description}</p>
                </div>
              </div>
            )}

            {/* Status (real, from event data) */}
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                {getStatusBadge()}
                {event.status === 'REJECTED' && event.rejectionReason && (
                  <p className="text-xs text-red-600 mt-1">Reason: {event.rejectionReason}</p>
                )}
              </div>
            </div>

            {/* Reminder */}
            {event.notificationMinutes !== undefined && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Reminder</p>
                  <p className="text-gray-900">
                    {event.notificationMinutes >= 60
                      ? `${event.notificationMinutes / 60} hour${event.notificationMinutes / 60 > 1 ? 's' : ''} before`
                      : `${event.notificationMinutes} minutes before`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions — only shown when the caller provided handlers AND user has permission */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {canEdit && onEdit && (
            <button onClick={onEdit} className="btn-primary">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {canDelete && onCancel && (
            <button onClick={onCancel} className="btn-danger">
              <X className="w-4 h-4" />
              Cancel Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
