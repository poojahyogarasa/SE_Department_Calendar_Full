import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Beaker, Wifi, Info, MessageCircle } from 'lucide-react';

const labOccupancy = { current: 210, total: 350 };
const availableSlots = { current: 140, total: 350 };

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
  {
    id: '4',
    type: 'update' as const,
    badge: 'Update',
    badgeColor: 'bg-teal-500',
    message: 'Chemistry Lab Session for 2024-07-05 has been rescheduled to 2024-07-07 due to instructor availability.',
    time: '5 days ago',
    action: null,
  },
];

// Dates with events (dots) for demo
const eventDates = [5, 12, 15, 17, 18, 22];

function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Day of week of month start (0=Sun, adjust to Mon-start)
  const startDow = (getDay(monthStart) + 6) % 7; // Mon=0

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasEvent = (day: Date) =>
    eventDates.includes(day.getDate()) && isSameMonth(day, currentMonth);

  return (
    <div>
      {/* Month navigation */}
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

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Leading empty cells */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const isToday_ = isSameDay(day, today);
          const hasEv = hasEvent(day);

          return (
            <div key={day.toString()} className="flex flex-col items-center py-1">
              <span
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors ${
                  isToday_
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
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

function StatCard({ label, current, total, icon }: {
  label: string; current: number; total: number; icon: React.ReactNode;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <p className="text-4xl font-bold text-gray-900 mb-1">{current}</p>
      <p className="text-sm text-gray-500 mb-3">Total capacity: {total}</p>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const AlertIcon = ({ type }: { type: string }) => {
  if (type === 'urgent') return <MessageCircle className="w-5 h-5 text-red-500" />;
  if (type === 'info')   return <Info className="w-5 h-5 text-blue-500" />;
  return <Wifi className="w-5 h-5 text-teal-500" />;
};

export default function TODashboard() {
  const userName = 'John';

  return (
    <div className="p-6">
      {/* Welcome header */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your lab management dashboard.</p>
        </div>
        <Beaker className="w-8 h-8 text-primary opacity-60" />
      </div>

      {/* Calendar + Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lab Sessions Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Lab Sessions Calendar</h2>
          <MiniCalendar />
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <StatCard
            label="Current Lab Occupancy"
            current={labOccupancy.current}
            total={labOccupancy.total}
            icon={<Beaker className="w-5 h-5" />}
          />
          <StatCard
            label="Available Lab Slots"
            current={availableSlots.current}
            total={availableSlots.total}
            icon={<Wifi className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Alerts & Messages */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Alerts &amp; Messages</h2>
        <div className="space-y-0 divide-y divide-gray-100">
          {alerts.map(alert => (
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
                  <button className="text-sm text-primary font-medium mt-2 hover:text-primary-600 transition-colors">
                    {alert.action}
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
