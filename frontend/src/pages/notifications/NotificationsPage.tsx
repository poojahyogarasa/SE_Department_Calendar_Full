import { useState } from 'react';
import { BellOff, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Grade Posted: COMP301',
      description: 'Your final grade for Operating Systems has been posted. View details in the academic portal.',
      time: '5 minutes ago',
      read: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'Software Update Available',
      description: 'Important security updates for academic software suite are now available. Please install at your earliest convenience.',
      time: '1 hour ago',
      read: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Upcoming Holiday: Labour Day',
      description: 'The university will be closed on September 2nd for Labour Day. Classes will resume on September 3rd.',
      time: 'Yesterday',
      read: true,
      type: 'info',
    },
    {
      id: '4',
      title: 'New Research Grant Opportunity',
      description: 'A new grant opportunity in Quantum Computing is now open for applications. Deadline: Oct 15.',
      time: '2 days ago',
      read: true,
      type: 'info',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Notifications</h1>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Unread
        </button>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Mark as read
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-20">
          <BellOff className="w-14 h-14 mx-auto mb-4 text-gray-400" />
          <h3 className="text-base font-semibold text-gray-800 mb-1">No Notifications Found</h3>
          <p className="text-sm text-gray-500">
            It looks like your inbox is empty. Check back later for updates or adjust your filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                notification.read
                  ? 'bg-white border-gray-200 hover:bg-gray-50'
                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                {/* Unread indicator */}
                <div className="pt-1.5">
                  {!notification.read ? (
                    <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                  ) : (
                    <span className="w-2.5 h-2.5 block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-4 flex-shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>

                {/* Mark as read */}
                {!notification.read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
