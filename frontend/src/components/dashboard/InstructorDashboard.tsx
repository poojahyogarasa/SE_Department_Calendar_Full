import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import EventDetailsModal from '../modals/EventDetailsModal';
import EventModal from '../modals/EventModal';
import type { Event } from '../../types';

// BUG_032: Sync unread state from localStorage
const getReadIds = (): string[] => { try { return JSON.parse(localStorage.getItem('notifications_read_ids') || '[]'); } catch { return []; } };
const BASE_NOTIFICATIONS = [
  { id: '1', title: 'Event Updated: CS101 Lecture',         desc: 'Location changed to Room R3.',   time: '10 min ago' },
  { id: '2', title: 'Approval Needed: Lab overtime',        desc: 'Please review request APR-102.', time: '1 hr ago'   },
  { id: '3', title: 'Reminder: CS101 Lab starts in 1 hour', desc: 'LabA, 13:00.',                  time: 'Yesterday'  },
];

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-green-100 text-green-700',
  PENDING:   'bg-yellow-100 text-yellow-700',
  APPROVED:  'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REJECTED:  'bg-red-100 text-red-700',
};

export default function InstructorDashboard({ onCreateEvent }: { onCreateEvent?: () => void }) {
  const { events, calendars, deleteEvent } = useEventStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // BUG_031: fallback to /calendar if no handler passed from parent
  const handleCreateEvent = onCreateEvent ?? (() => navigate('/calendar'));

  const isInstructor = user?.role === 'INSTRUCTOR';

  // Today's events — Instructor sees only LAB events
  const todayEvents = events
    .filter(e => {
      if (!isToday(new Date(e.start))) return false;
      if (isInstructor) return e.category === 'LAB';
      return true;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // User's own events awaiting HOD approval
  const myPendingEvents = events
    .filter(e => e.status === 'PENDING' && e.createdBy === user?.id)
    .slice(0, 4);

  const readIds = getReadIds();
  const mockNotifications = BASE_NOTIFICATIONS.map(n => ({ ...n, unread: !readIds.includes(n.id) }));

  const getCalendarColor = (calendarId: string) =>
    calendars.find(c => c.id === calendarId)?.color || '#6366F1';

  const getStatusLabel = (status?: string) =>
    status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Scheduled';

  const getStatusColor = (status?: string) =>
    STATUS_COLORS[status || 'SCHEDULED'] || STATUS_COLORS.SCHEDULED;

  const getCategoryBadge = (cat: string) => {
    const map: Record<string, string> = {
      LECTURE: 'bg-blue-50 text-blue-600',
      LAB:     'bg-teal-50 text-teal-600',
      EXAM:    'bg-red-50 text-red-600',
      SEMINAR: 'bg-purple-50 text-purple-600',
      MEETING: 'bg-orange-50 text-orange-600',
      OTHER:   'bg-gray-100 text-gray-600',
    };
    return map[cat] || map.OTHER;
  };

  const handleEventClick = (ev: Event) => {
    setSelectedEvent(ev);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/calendar" className="btn-outline flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Open Calendar
          </Link>
          <button onClick={handleCreateEvent} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isInstructor ? 'Schedule Lab' : 'Create Event'}
          </button>
        </div>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              {isInstructor ? "Today's Lab Sessions" : "Today's Schedule"}
            </h2>
            <Link to="/calendar" className="text-sm text-primary hover:text-primary-600">View</Link>
          </div>

          {todayEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{isInstructor ? 'No lab sessions today' : 'No events today'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => handleEventClick(ev)}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full min-h-[50px] rounded-full flex-shrink-0" style={{ backgroundColor: getCalendarColor(ev.calendarId) }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{ev.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getStatusColor(ev.status)}`}>
                          {getStatusLabel(ev.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(ev.start), 'HH:mm')}–{format(new Date(ev.end), 'HH:mm')}
                        {ev.location && <><MapPin className="w-3 h-3 ml-1" />{ev.location}</>}
                      </p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryBadge(ev.category)}`}>
                          {ev.category.charAt(0) + ev.category.slice(1).toLowerCase()}
                        </span>
                        {ev.courseCode && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{ev.courseCode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* My Pending Events (awaiting HOD approval) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Awaiting Approval</h2>
            <Link to="/calendar" className="text-sm text-primary hover:text-primary-600">Calendar</Link>
          </div>

          {myPendingEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No pending submissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPendingEvents.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => handleEventClick(ev)}
                  className="w-full text-left p-3 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">{ev.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 font-medium flex-shrink-0 ml-2">Pending</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(ev.start), 'EEE d MMM')} • {format(new Date(ev.start), 'HH:mm')}–{format(new Date(ev.end), 'HH:mm')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Awaiting HOD approval</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            <Link to="/notifications" className="text-sm text-primary hover:text-primary-600">View all</Link>
          </div>
          <div className="space-y-3">
            {mockNotifications.map(n => (
              <div key={n.id} className={`p-3 rounded-lg border ${n.unread ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                  </div>
                  {n.unread && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => { setShowDetailsModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onEdit={() => { setShowDetailsModal(false); setShowEditModal(true); }}
          onCancel={() => {
            if (selectedEvent) {
              deleteEvent(selectedEvent.id);
              setShowDetailsModal(false);
              setSelectedEvent(null);
            }
          }}
        />
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <EventModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
