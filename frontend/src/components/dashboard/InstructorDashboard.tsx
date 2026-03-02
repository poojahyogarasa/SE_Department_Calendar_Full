import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';

const mockPendingApprovals = [
  { id: '1', title: 'CS302 Exam (Room override)', requester: 'LEC08', sla: 'Today 16:00' },
  { id: '2', title: 'LabA booking (weekend)',      requester: 'INS01', sla: 'Tomorrow 10:00' },
];

const mockNotifications = [
  { id: '1', title: 'Event Updated: CS101 Lecture',    desc: 'Location changed to Room R3.',         time: '10 min ago',  unread: true },
  { id: '2', title: 'Approval Needed: Lab overtime',   desc: 'Please review request APR-102.',       time: '1 hr ago',    unread: true },
  { id: '3', title: 'Reminder: CS101 Lab starts in 1 hour', desc: 'LabA, 13:00.',                   time: 'Yesterday',   unread: false },
];

const demoTips = [
  'Go to Calendar → click an event',
  'Try + New → Publish',
  'Open Approvals (if role allows)',
];

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-green-100 text-green-700',
  PENDING:   'bg-yellow-100 text-yellow-700',
  APPROVED:  'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function InstructorDashboard({ onCreateEvent }: { onCreateEvent?: () => void }) {
  const { events, calendars } = useEventStore();
  const { user } = useAuthStore();

  const todayEvents = events
    .filter(e => isToday(new Date(e.start)))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const getCalendarColor = (calendarId: string) =>
    calendars.find(c => c.id === calendarId)?.color || '#6366F1';

  const getStatusLabel = (status?: string) =>
    status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Scheduled';

  const getStatusColor = (status?: string) =>
    STATUS_COLORS[status || 'SCHEDULED'] || STATUS_COLORS.SCHEDULED;

  const getCategoryBadge = (cat: string) => {
    const map: Record<string, string> = {
      LECTURE:  'bg-blue-50 text-blue-600',
      LAB:      'bg-teal-50 text-teal-600',
      EXAM:     'bg-red-50 text-red-600',
      SEMINAR:  'bg-purple-50 text-purple-600',
      MEETING:  'bg-orange-50 text-orange-600',
      OTHER:    'bg-gray-100 text-gray-600',
    };
    return map[cat] || map.OTHER;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Today overview, alerts, and quick actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/calendar" className="btn-outline flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Open Calendar
          </Link>
          <button onClick={onCreateEvent} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
            <Link to="/calendar" className="text-sm text-primary hover:text-primary-600">View</Link>
          </div>

          {todayEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No events today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map(event => (
                <div key={event.id} className="p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full min-h-[50px] rounded-full flex-shrink-0" style={{ backgroundColor: getCalendarColor(event.calendarId) }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{event.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(event.start), 'EEE')} • {format(new Date(event.start), 'HH:mm')}–{format(new Date(event.end), 'HH:mm')}
                        {event.location ? ` • ${event.location}` : ''}
                      </p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryBadge(event.category)}`}>
                          {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
                        </span>
                        {event.courseCode && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{event.courseCode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Demo schedule items when no real events */}
          {todayEvents.length === 0 && (
            <div className="mt-3 space-y-3">
              {[
                { title: 'CS101 Lecture', time: 'Mon • 08:00–10:00 • Room R2', tags: ['Lecture', 'CS101', 'Semester1'] },
                { title: 'CS101 Lab',     time: 'Wed • 13:00–15:00 • LabA',    tags: ['Lab', 'CS101'] },
                { title: 'LabB Maintenance', time: 'Thu • 09:00–11:00 • LabB', tags: ['Maintenance'] },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-gray-900">{item.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Scheduled</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
            <Link to="/approvals" className="text-sm text-primary hover:text-primary-600">Open</Link>
          </div>
          <div className="space-y-3">
            {mockPendingApprovals.map(ap => (
              <div key={ap.id} className="p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900">{ap.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Pending</span>
                </div>
                <p className="text-xs text-gray-500">Requester: {ap.requester}</p>
                <p className="text-xs text-gray-500">SLA: {ap.sla}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            <Link to="/notifications" className="text-sm text-primary hover:text-primary-600">Latest</Link>
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

      {/* Demo tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Demo tips</p>
        <ul className="space-y-1">
          {demoTips.map((tip, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
