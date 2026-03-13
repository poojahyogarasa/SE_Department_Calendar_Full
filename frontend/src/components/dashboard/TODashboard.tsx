import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  isSameDay, isSameMonth, isToday, isThisWeek, startOfWeek, endOfWeek, addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Beaker, Wifi, Info, MessageCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import EventDetailsModal from '../modals/EventDetailsModal';
import type { Event } from '../../types';

const alerts = [
  {
    id: '1',
    type: 'urgent' as const,
    badge: 'Urgent',
    badgeColor: 'bg-red-500',
    message: 'Lab B203 equipment failure detected. Emergency shutdown initiated. Please investigate.',
    time: '2 hours ago',
    action: 'Acknowledge',
  },
  {
    id: '2',
    type: 'update' as const,
    badge: 'Update',
    badgeColor: 'bg-teal-500',
    message: 'Upcoming server maintenance on 2024-08-25. Labs will be unavailable from 01:00 AM to 04:00 AM.',
    time: 'Yesterday',
    action: 'View Details',
  },
  {
    id: '3',
    type: 'info' as const,
    badge: 'Information',
    badgeColor: 'bg-blue-500',
    message: 'New lab safety protocols released. All personnel must review by end of month.',
    time: '3 days ago',
    action: 'Read Policy',
  },
];

const AlertIcon = ({ type }: { type: string }) => {
  if (type === 'urgent') return <MessageCircle className="w-5 h-5 text-red-500" />;
  if (type === 'info')   return <Info className="w-5 h-5 text-blue-500" />;
  return <Wifi className="w-5 h-5 text-teal-500" />;
};

function MiniCalendar({ labEvents }: { labEvents: Event[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDow = (getDay(monthStart) + 6) % 7; // Mon=0
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasLabEvent = (day: Date) =>
    isSameMonth(day, currentMonth) &&
    labEvents.some(e => isSameDay(new Date(e.start), day));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const isToday_ = isSameDay(day, today);
          const hasEv = hasLabEvent(day);
          return (
            <div key={day.toString()} className="flex flex-col items-center py-1">
              <span
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors ${
                  isToday_ ? 'bg-primary text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {format(day, 'd')}
              </span>
              {hasEv && (
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday_ ? 'bg-white' : 'bg-primary'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TODashboard() {
  const { events, deleteEvent } = useEventStore();
  const { user } = useAuthStore();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  // Lab sessions only (TO manages labs)
  const labEvents = events.filter(e => e.category === 'LAB');

  // Today's lab sessions
  const todayLabs = labEvents
    .filter(e => isToday(new Date(e.start)))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Upcoming lab sessions this week (excluding today)
  const upcomingLabs = labEvents
    .filter(e => {
      const d = new Date(e.start);
      return isThisWeek(d) && !isToday(d) && d > new Date();
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // Pending lab sessions (awaiting approval)
  const pendingLabs = labEvents.filter(e => e.status === 'PENDING').length;

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const labsThisWeek = labEvents.filter(e => {
    const d = new Date(e.start);
    return d >= weekStart && d <= weekEnd;
  }).length;

  const userName = user?.name?.split(' ')[0] || 'there';

  const visibleAlerts = alerts.filter(a => !acknowledgedAlerts.includes(a.id));

  return (
    <div className="p-6">
      {/* Welcome header */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(), 'EEEE, dd MMMM yyyy')} — Lab Management Overview
          </p>
        </div>
        <Beaker className="w-8 h-8 text-primary opacity-60" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Lab Sessions Today',   value: todayLabs.length,  icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
          { label: 'Labs This Week',       value: labsThisWeek,      icon: <Beaker className="w-5 h-5" />,   color: 'bg-teal-100 text-teal-600' },
          { label: 'Pending Approval',     value: pendingLabs,       icon: <Wifi className="w-5 h-5" />,     color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Total Lab Sessions',   value: labEvents.length,  icon: <Info className="w-5 h-5" />,     color: 'bg-purple-100 text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar + Upcoming labs row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lab Sessions Calendar (real events) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Lab Sessions Calendar</h2>
          <MiniCalendar labEvents={labEvents} />
          {labEvents.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-3">
              No lab sessions scheduled yet. Lab sessions created by Instructors will appear here.
            </p>
          )}
        </div>

        {/* Upcoming Lab Sessions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Labs</h2>
          {upcomingLabs.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <Beaker className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No upcoming labs this week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingLabs.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => { setSelectedEvent(ev); setShowDetails(true); }}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <p className="font-medium text-sm text-gray-900 truncate">{ev.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(ev.start), 'EEE d MMM')} • {format(new Date(ev.start), 'HH:mm')}–{format(new Date(ev.end), 'HH:mm')}
                  </p>
                  {ev.location && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{ev.location}
                    </p>
                  )}
                  {ev.studentCount && (
                    <p className="text-xs text-teal-600 mt-0.5">👥 {ev.studentCount} students expected</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts & Messages */}
      {visibleAlerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alerts &amp; Messages</h2>
          <div className="space-y-0 divide-y divide-gray-100">
            {visibleAlerts.map(alert => (
              <div key={alert.id} className="py-4 flex items-start gap-4">
                <AlertIcon type={alert.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${alert.badgeColor}`}>
                      {alert.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{alert.message}</p>
                  {alert.action && (
                    <button
                      className="text-sm text-primary font-medium mt-2 hover:text-primary-600 transition-colors"
                      onClick={() => setAcknowledgedAlerts(prev => [...prev, alert.id])}
                    >
                      {alert.action}
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <EventDetailsModal
          isOpen={showDetails}
          onClose={() => { setShowDetails(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onCancel={() => {
            if (selectedEvent) {
              deleteEvent(selectedEvent.id);
              setShowDetails(false);
              setSelectedEvent(null);
            }
          }}
        />
      )}
    </div>
  );
}
