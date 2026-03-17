import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  activate: (data: { email: string; password: string; first_name?: string; last_name?: string }) =>
    api.post('/auth/activate', data),

  updateProfile: (data: { first_name: string; last_name: string; department?: string }) =>
    api.put('/auth/profile', data),
};

export const eventsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/events', { params }),

  getOne: (id: string) =>
    api.get(`/events/${id}`),

  create: (data: Record<string, unknown>) =>
    api.post('/events', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/events/${id}`, data),

  delete: (id: string) =>
    api.delete(`/events/${id}`),
};

export const hodAPI = {
  getPendingEvents: () =>
    api.get('/hod/pending-events'),

  approveEvent: (eventId: string) =>
    api.put(`/hod/approve/${eventId}`),

  rejectEvent: (eventId: string, reason: string) =>
    api.put(`/hod/reject/${eventId}`, { reason }),
};

export const notificationsAPI = {
  getAll: () =>
    api.get('/notifications'),

  getUnreadCount: () =>
    api.get('/notifications/count'),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch('/notifications/read-all'),

  deleteNotification: (id: string) =>
    api.delete(`/notifications/${id}`),
};

export const todosAPI = {
  getAll: () =>
    api.get('/todos'),

  create: (data: Record<string, unknown>) =>
    api.post('/todos', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/todos/${id}`, data),

  toggle: (id: string) =>
    api.patch(`/todos/${id}/toggle`),

  delete: (id: string) =>
    api.delete(`/todos/${id}`),
};

export const auditAPI = {
  log: (data: Record<string, unknown>) =>
    api.post('/audit', data),
};

export const usersAPI = {
  getByRoles: (roles: string[]) =>
    api.get<{ id: number; name: string; email: string; role: string }[]>(
      `/auth/users?roles=${roles.join(',')}`
    ),
};

export default api;
