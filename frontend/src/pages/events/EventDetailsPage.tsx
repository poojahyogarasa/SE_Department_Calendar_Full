import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Tag, FileText, CheckCircle, Pencil, X, ArrowLeft, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { getEventPermissions } from '../../utils/permissions';
import CancelEventModal from '../../components/modals/CancelEventModal';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, calendars, updateEvent } = useEventStore();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const event = events.find(e => e.id === id);
  const calendar = event ? calendars.find(c => c.id === event.calendarId) : null;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Event not found.</p>
          <Link to="/calendar" className="text-primary hover:underline text-sm">Back to Calendar</Link>
        </div>
      </div>
    );
  }

  const perms = calendar ? getEventPermissions(event, user, calendar) : null;
  const canEdit   = perms?.canEdit   ?? false;
  const canDelete = perms?.canDelete ?? false;

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      LECTURE: 'Lecture',
      LAB:     'Lab Session',
      EXAM:    'Exam',
      SEMINAR: 'Academic Seminar',
      MEETING: 'Meeting',
      OTHER:   'Other',
    };
    return map[cat] || 'Other';
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

  const showStudentCount =
    event.category === 'LAB' &&
    event.studentCount !== undefined &&
    ['TECHNICAL_OFFICER', 'ADMIN', 'HOD', 'INSTRUCTOR'].includes(user?.role || '');

  const handleCancelEvent = (reason: string) => {
    updateEvent(event.id, { status: 'REJECTED', rejectionReason: reason || 'Event cancelled' });
    navigate('/calendar');
  };

  const detailRows = [
    {
      icon: <Calendar className="w-5 h-5 text-gray-400" />,
      label: 'Date:',
      content: format(new Date(event.start), 'MMMM d, yyyy'),
    },
    {
      icon: <Clock className="w-5 h-5 text-gray-400" />,
      label: 'Time:',
      content: `${format(new Date(event.start), 'h:mm a')} - ${format(new Date(event.end), 'h:mm a')}`,
    },
    event.location ? {
      icon: <MapPin className="w-5 h-5 text-gray-400" />,
      label: 'Location:',
      content: event.location,
    } : null,
    showStudentCount ? {
      icon: <Users className="w-5 h-5 text-gray-400" />,
      label: 'Students:',
      content: `${event.studentCount} expected`,
    } : null,
    {
      icon: <User className="w-5 h-5 text-gray-400" />,
      label: 'Created by:',
      content: event.createdBy,
    },
    {
      icon: <Tag className="w-5 h-5 text-gray-400" />,
      label: 'Event Type:',
      content: getCategoryLabel(event.category),
    },
    event.description ? {
      icon: <FileText className="w-5 h-5 text-gray-400" />,
      label: 'Description:',
      content: event.description,
    } : null,
    {
      icon: <CheckCircle className="w-5 h-5 text-gray-400" />,
      label: 'Status:',
      content: null,
      badge: getStatusBadge(),
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; content: string | null; badge?: React.ReactNode }[];

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>
          <p className="text-sm text-gray-400 mb-6">{getCategoryLabel(event.category)}</p>

          {/* Detail rows */}
          <div className="space-y-4 mb-8">
            {detailRows.map((row, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{row.icon}</div>
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="text-sm text-gray-500 font-medium w-28 flex-shrink-0">{row.label}</span>
                  {row.badge ? (
                    row.badge
                  ) : (
                    <span className="text-sm text-gray-900 leading-relaxed">{row.content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-100 flex-wrap">
            <button
              onClick={() => navigate('/calendar')}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Calendar
            </button>

            <div className="ml-auto flex items-center gap-3">
              {canEdit && (
                <button
                  onClick={() => navigate(`/edit-event/${event.id}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn-danger flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <CancelEventModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelEvent}
        eventTitle={event.title}
        eventDateTime={`${format(new Date(event.start), 'EEEE, MMMM d, yyyy')} at ${format(new Date(event.start), 'h:mm a')} – ${format(new Date(event.end), 'h:mm a')} EST`}
      />
    </>
  );
}
