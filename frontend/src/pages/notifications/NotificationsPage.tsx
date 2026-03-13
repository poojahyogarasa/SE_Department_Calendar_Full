import { useState, useEffect } from 'react';
import { BellOff, Check, Pencil, Trash2, X, Save } from 'lucide-react';
import { notificationsAPI } from '../../services/api';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const STORAGE_KEY = 'notifications_read_ids';

const getPersistedReadIds = (): string[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const BASE_NOTIFICATIONS: Notification[] = [
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
];

const isBackendId = (id: string) => id.startsWith('backend-');
const extractBackendId = (id: string) => id.replace('backend-', '');

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const readIds = getPersistedReadIds();
    return BASE_NOTIFICATIONS.map(n => ({
      ...n,
      read: n.read || readIds.includes(n.id),
    }));
  });

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // M3: Load notifications from backend on mount, merge with base
  useEffect(() => {
    notificationsAPI.getAll()
      .then((res: { data: any[] }) => {
        const backendNotifs: Notification[] = res.data.map((n: any) => ({
          id: `backend-${n.notification_id}`,
          title: (n.notification_type || 'NOTIFICATION').replace(/_/g, ' '),
          description: n.message || '',
          time: n.sent_at ? new Date(n.sent_at).toLocaleDateString() : 'Recently',
          read: n.is_read === 1 || n.is_read === true,
          type: 'info' as const,
        }));

        // Merge: backend notifications first, then local base notifications not duplicated
        setNotifications(prev => {
          const baseWithRead = prev.filter(n => !isBackendId(n.id));
          return [...backendNotifs, ...baseWithRead];
        });
      })
      .catch(() => {
        // Backend unavailable — keep localStorage-based state
      });
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    // Persist for non-backend notifications
    if (!isBackendId(id)) {
      const readIds = getPersistedReadIds();
      if (!readIds.includes(id)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds, id]));
    } else {
      notificationsAPI.markAsRead(extractBackendId(id)).catch(() => {});
    }
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.map(n => n.id)));
    notificationsAPI.markAllAsRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBackendId(id)) {
      notificationsAPI.deleteNotification(extractBackendId(id)).catch(() => {});
    } else {
      const readIds = getPersistedReadIds().filter((rid: string) => rid !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const startEdit = (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(n.id);
    setEditTitle(n.title);
    setEditDescription(n.description);
  };

  const saveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, title: editTitle.trim() || n.title, description: editDescription.trim() || n.description }
          : n
      )
    );
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
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
            filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Unread
        </button>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Mark all as read
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
              className={`p-4 rounded-xl border transition-all ${
                notification.read
                  ? 'bg-white border-gray-200 hover:bg-gray-50'
                  : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
              } ${editingId === notification.id ? '' : 'cursor-pointer'}`}
              onClick={() => editingId !== notification.id && markAsRead(notification.id)}
            >
              {editingId === notification.id ? (
                /* Inline Edit Mode */
                <div onClick={e => e.stopPropagation()}>
                  <input
                    className="w-full text-sm font-semibold border border-gray-300 rounded-lg px-3 py-1.5 mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Notification title"
                  />
                  <textarea
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    rows={3}
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => saveEdit(notification.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal View */
                <div className="flex items-start gap-4">
                  <div className="pt-1.5">
                    {!notification.read ? (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                    ) : (
                      <span className="w-2.5 h-2.5 block" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 ml-4 flex-shrink-0">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={(e) => startEdit(notification, e)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      title="Modify notification"
                    >
                      <Pencil className="w-4 h-4 text-gray-400 hover:text-primary" />
                    </button>
                    <button
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
