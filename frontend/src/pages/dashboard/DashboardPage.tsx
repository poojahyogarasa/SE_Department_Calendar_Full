import { useAuthStore } from '../../stores/useAuthStore';
import { useEventStore } from '../../stores/useEventStore';
import { canApproveEvents } from '../../utils/permissions';
import { format, isToday, isThisWeek } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Download
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { events, calendars } = useEventStore();

  // Get today's events
  const todayEvents = events
    .filter(event => isToday(new Date(event.start)))
    .sort(
      (a, b) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    );

  // Get upcoming events this week
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      return isThisWeek(eventDate) && !isToday(eventDate);
    })
    .slice(0, 5);

  // Mock pending approvals (HOD/Admin only)
  const pendingApprovals = [
    {
      id: '1',
      title: 'Student Thesis Defense',
      requester: 'Dr. Emily Watson',
      sla: 'Due in 2 days'
    },
    {
      id: '2',
      title: 'Lab Equipment Purchase',
      requester: 'Prof. David Lee',
      sla: 'Due in 5 days'
    },
    {
      id: '3',
      title: 'Course Enrollment Override',
      requester: 'Alice Smith (STU001)',
      sla: 'Due in 1 day'
    }
  ];

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New Grade Posted: COMP301',
      description:
        'Your final grade for Operating Systems has been posted.',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: '2',
      title: 'Software Update Available',
      description:
        'Important security updates for academic software suite.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      title: 'Upcoming Holiday: Labour Day',
      description:
        'The university will be closed on September 2nd.',
      time: 'Yesterday',
      unread: false
    }
  ];

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6366F1';
  };

  const getEventCategory = (category: string) => {
    const categories: Record<
      string,
      { label: string; color: string }
    > = {
      LECTURE: { label: 'Lecture', color: 'bg-blue-100 text-blue-700' },
      LAB: { label: 'Lab', color: 'bg-emerald-100 text-emerald-700' },
      EXAM: { label: 'Exam', color: 'bg-red-100 text-red-700' },
      SEMINAR: { label: 'Seminar', color: 'bg-purple-100 text-purple-700' },
      MEETING: { label: 'Meeting', color: 'bg-orange-100 text-orange-700' },
      OTHER: { label: 'Other', color: 'bg-gray-100 text-gray-700' }
    };

    return categories[category] || categories.OTHER;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {format(new Date(), 'EEEE, dd MMMM yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="btn-outline">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link to="/calendar" className="btn-primary">
            <Calendar className="w-4 h-4" />
            Open Calendar
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                Today's Schedule
              </h2>
              <Link
                to="/calendar"
                className="text-sm text-primary hover:text-primary-600"
              >
                View all
              </Link>
            </div>

            {todayEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No events scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-1 min-h-[60px] rounded-full"
                        style={{
                          backgroundColor: getCalendarColor(
                            event.calendarId
                          )
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {event.title}
                        </h3>

                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {format(
                            new Date(event.start),
                            'h:mm a'
                          )}{' '}
                          -{' '}
                          {format(
                            new Date(event.end),
                            'h:mm a'
                          )}
                        </div>

                        {event.location && (
                          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </div>
                        )}

                        <div className="mt-2 flex gap-2">
                          <span
                            className={`badge ${
                              getEventCategory(event.category)
                                .color
                            }`}
                          >
                            {
                              getEventCategory(event.category)
                                .label
                            }
                          </span>
                          {event.courseCode && (
                            <span className="badge-gray">
                              {event.courseCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pending Approvals - ONLY HOD / ADMIN */}
          {canApproveEvents(user) && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  Pending Approvals
                </h2>
                <Link
                  to="/approvals"
                  className="text-sm text-primary hover:text-primary-600"
                >
                  Open
                </Link>
              </div>

              <div className="space-y-3">
                {pendingApprovals.map(approval => (
                  <div
                    key={approval.id}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {approval.title}
                      </h3>
                      <span className="status-pending">
                        Pending
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Requester: {approval.requester}
                    </p>
                    <p className="text-sm text-gray-500">
                      SLA: {approval.sla}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button className="btn-success btn-sm flex-1">
                        Approve
                      </button>
                      <button className="btn-outline btn-sm flex-1">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Upcoming This Week
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No upcoming events this week
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {format(new Date(event.start), 'dd')}
                      </span>
                      <span className="text-xs text-primary">
                        {format(new Date(event.start), 'MMM')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(event.start),
                          'h:mm a'
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Notifications
            </h2>

            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.unread
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
