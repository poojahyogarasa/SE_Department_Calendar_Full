import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import {
  format,
  addDays, subDays,
  addWeeks, subWeeks,
  addMonths, subMonths,
  startOfWeek, endOfWeek
} from 'date-fns';
import { useCalendarStore } from '../../stores/useCalendarStore';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getEventPermissions, getEventDisplayText, canCreateEvent } from '../../utils/permissions';
import type { EventCategory } from '../../types';
import MiniCalendar from '../../components/calendar/MiniCalendar';
import DayView from '../../components/calendar/DayView';
import WeekView from '../../components/calendar/WeekView';
import MonthView from '../../components/calendar/MonthView';
import EventModal from '../../components/modals/EventModal';
import EventDetailsModal from '../../components/modals/EventDetailsModal';
import type { Event } from '../../types';

const ALL_CATEGORIES: EventCategory[] = ['LECTURE', 'LAB', 'EXAM', 'SEMINAR', 'MEETING', 'OTHER'];

export default function CalendarPage() {
  const navigate = useNavigate();
  const { currentDate, viewType, setCurrentDate, setViewType } = useCalendarStore();
  const { events, calendars, deleteEvent } = useEventStore();
  const { user } = useAuthStore();
  // BUG_028,029,030: read display settings
  const { showDescriptions, use24Hour, firstDayOfWeek } = useSettingsStore();

  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  // BUG_018: Filter panel state
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>([...ALL_CATEGORIES]);

  // Check if the current user can create events in any calendar
  const userCanCreate = useMemo(
    () => calendars.some(cal => canCreateEvent(user, cal)),
    [user, calendars]
  );

  // BUG_018: Toggle category filter
  const toggleCategory = (cat: EventCategory) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  /**
   * Filter & transform the raw event list through the permission layer.
   * - HIDDEN events are removed entirely.
   * - BUSY / STAFF_EVENT events have their title/description/location masked.
   */
  const visibleEvents = useMemo(() => {
    return events.flatMap((event) => {
      const calendar = calendars.find(c => c.id === event.calendarId);
      if (!calendar) return [];

      const perms = getEventPermissions(event, user, calendar);
      if (!perms.canView) return [];

      if (perms.viewMode === 'FULL') return [event];

      // Mask event details for BUSY / STAFF_EVENT view modes
      const display = getEventDisplayText(event, perms.viewMode);
      return [{
        ...event,
        title: display.title,
        description: display.description,
        location: display.location,
      }];
    });
  }, [events, calendars, user]);

  // BUG_018: Apply category filter on top of permission-filtered events
  const filteredEvents = useMemo(
    () => visibleEvents.filter(e => activeCategories.includes(e.category)),
    [visibleEvents, activeCategories]
  );

  const handlePrevious = () => {
    switch (viewType) {
      case 'DAY': setCurrentDate(subDays(currentDate, 1)); break;
      case 'WEEK': setCurrentDate(subWeeks(currentDate, 1)); break;
      case 'MONTH': setCurrentDate(subMonths(currentDate, 1)); break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case 'DAY': setCurrentDate(addDays(currentDate, 1)); break;
      case 'WEEK': setCurrentDate(addWeeks(currentDate, 1)); break;
      case 'MONTH': setCurrentDate(addMonths(currentDate, 1)); break;
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  const getDateRangeText = () => {
    switch (viewType) {
      case 'DAY': return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'WEEK': {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(weekStart, 'MMMM d')} - ${format(weekEnd, 'MMMM d, yyyy')}`;
      }
      case 'MONTH': return format(currentDate, 'MMMM yyyy');
    }
  };

  const handleEventClick = (clickedEvent: Event) => {
    // Always look up the real (unmasked) event from the store
    const realEvent = events.find(e => e.id === clickedEvent.id);
    if (!realEvent) return;

    const calendar = calendars.find(c => c.id === realEvent.calendarId);
    if (!calendar) return;

    const perms = getEventPermissions(realEvent, user, calendar);

    // Always show details first (for any visible, non-masked event)
    // Edit/delete actions are available via buttons inside EventDetailsModal
    if (perms.canView && perms.viewMode === 'FULL') {
      setSelectedEvent(realEvent);
      setShowDetailsModal(true);
    }
    // BUSY / STAFF_EVENT / HIDDEN modes → no click action
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleDateSelect = (date: Date) => setCurrentDate(date);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col flex-shrink-0">
          {/* New Event — only for roles that can create events */}
          {userCanCreate && (
            <button onClick={handleNewEvent} className="btn-primary w-full mb-4">
              <Plus className="w-4 h-4" />
              New Event
            </button>
          )}

          {/* Mini Calendar */}
          <MiniCalendar selectedDate={currentDate} onDateSelect={handleDateSelect} />

          {/* Calendar List */}
          <div className="mt-6 flex-1">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">My Calendars</h3>
            <div className="space-y-2">
              {calendars.map((calendar) => (
                <label
                  key={calendar.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                  <span className="text-sm text-gray-700">{calendar.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 ml-2">{getDateRangeText()}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['DAY', 'WEEK', 'MONTH'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewType(view)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewType === view ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view.charAt(0) + view.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {/* BUG_018: Filter button toggles filter panel */}
            <button
              onClick={() => setShowFilter(f => !f)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${showFilter ? 'bg-primary/10 text-primary' : ''}`}
              title="Filter events"
            >
              <Filter className="w-5 h-5" />
            </button>
            {/* BUG_019: Help icon navigates to help page */}
            <button
              onClick={() => navigate('/help')}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* BUG_018: Category filter panel */}
        {showFilter && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter by category:</span>
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeCategories.includes(cat)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
            <button
              onClick={() => setActiveCategories([...ALL_CATEGORIES])}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          </div>
        )}

        {/* Calendar View — permission-filtered + category-filtered events passed here */}
        <div className="flex-1 overflow-auto bg-white">
          {viewType === 'DAY' && (
            <DayView date={currentDate} events={filteredEvents} calendars={calendars} onEventClick={handleEventClick} />
          )}
          {viewType === 'WEEK' && (
            <WeekView
              date={currentDate}
              events={filteredEvents}
              calendars={calendars}
              onEventClick={handleEventClick}
              use24Hour={use24Hour}
              firstDayOfWeek={firstDayOfWeek}
            />
          )}
          {viewType === 'MONTH' && (
            <MonthView
              date={currentDate}
              events={filteredEvents}
              calendars={calendars}
              onEventClick={handleEventClick}
              onDateClick={handleDateSelect}
              showDescriptions={showDescriptions}
              firstDayOfWeek={firstDayOfWeek}
            />
          )}
        </div>
      </div>

      {/* Edit / Create Modal (staff / admin / lecturer / instructor) */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => { setShowEventModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          initialDate={currentDate}
        />
      )}

      {/* Details Modal — always shown first on event click */}
      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => { setShowDetailsModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onEdit={() => { setShowDetailsModal(false); setShowEventModal(true); }}
          onCancel={() => {
            if (selectedEvent) {
              deleteEvent(selectedEvent.id);
              setShowDetailsModal(false);
              setSelectedEvent(null);
            }
          }}
        />
      )}
    </div>
  );
}
