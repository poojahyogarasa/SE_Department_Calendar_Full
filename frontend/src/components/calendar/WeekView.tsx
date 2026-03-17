import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  getHours,
  getMinutes,
  isToday as isTodayFn,
} from 'date-fns';
import type { Event, Calendar } from '../../types';

interface WeekViewProps {
  date: Date;
  events: Event[];
  calendars: Calendar[];
  onEventClick: (event: Event) => void;
  // BUG_029 & BUG_030: settings props
  use24Hour?: boolean;
  firstDayOfWeek?: 'sunday' | 'monday';
}

export default function WeekView({ date, events, calendars, onEventClick, use24Hour = false, firstDayOfWeek = 'sunday' }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // BUG_030: respect firstDayOfWeek setting
  const weekStartsOn = firstDayOfWeek === 'monday' ? 1 : 0;
  const weekStart = startOfWeek(date, { weekStartsOn: weekStartsOn as 0 | 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find((c) => c.id === calendarId);
    return calendar?.color || '#6366F1';
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  const getEventPosition = (event: Event) => {
    const startHour = getHours(new Date(event.start));
    const startMinute = getMinutes(new Date(event.start));
    const endHour = getHours(new Date(event.end));
    const endMinute = getMinutes(new Date(event.end));

    const top = (startHour + startMinute / 60) * 60;
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;

    return { top, height: Math.max(height, 30) };
  };

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return (
    <div className="flex flex-col h-full">
      {/* Week Header */}
      <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="w-20 flex-shrink-0" />
        {weekDays.map((day, index) => {
          const isToday = isTodayFn(day);
          return (
            <div
              key={index}
              className="flex-1 py-3 text-center border-l border-gray-200"
            >
              <p className="text-sm text-gray-500">{format(day, 'EEE')}</p>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                isToday ? 'bg-primary text-white' : ''
              }`}>
                <span className={`text-xl font-semibold ${isToday ? '' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex">
          {/* Time Labels */}
          <div className="w-20 flex-shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-gray-100 text-right pr-3 text-xs text-gray-500"
              >
                {/* BUG_017: Skip rendering 12 AM label at hour 0 to avoid clipping */}
                {/* BUG_029: use 24h format if setting is enabled */}
                {hour !== 0 && (
                  <span className="-mt-2 block">
                    {format(new Date().setHours(hour, 0), use24Hour ? 'HH:mm' : 'h a')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isTodayFn(day);

            return (
              <div key={dayIndex} className="flex-1 relative border-l border-gray-200">
                {/* Hour Lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`h-[60px] border-b border-gray-100 ${
                      isToday ? 'bg-blue-50/30' : ''
                    }`}
                  />
                ))}

                {/* Current Time Indicator */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 flex items-center z-20"
                    style={{ top: `${(currentHour + currentMinute / 60) * 60}px` }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5" />
                    <div className="flex-1 h-0.5 bg-red-500" />
                  </div>
                )}

                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="absolute left-1 right-1 rounded-lg px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: getCalendarColor(event.calendarId),
                      }}
                    >
                      <p className="text-white text-xs font-medium truncate">{event.title}</p>
                      {/* BUG_029: use 24h format if setting is enabled */}
                      {height > 40 && (
                        <p className="text-white/80 text-xs">
                          {format(new Date(event.start), use24Hour ? 'HH:mm' : 'h:mm a')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
