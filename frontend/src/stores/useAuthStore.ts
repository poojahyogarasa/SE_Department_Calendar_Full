import { create } from 'zustand';
import axios from 'axios';
import type { AuthState, User, UserRole } from '../types';
import { getCurrentUser, setCurrentUser, clearSession } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getCurrentUser(),
  isAuthenticated: !!getCurrentUser(),

  // ==============================
  // 🔐 LOGIN
  // ==============================
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: backendUser } = response.data;

      const user: User = {
        id: String(backendUser.id),
        name: `${backendUser.first_name ?? ''} ${backendUser.last_name ?? ''}`.trim(),
        email: backendUser.email,
        role: backendUser.role as UserRole,
        department: backendUser.department,
      };

      localStorage.setItem('token', token);
      setCurrentUser(user);
      set({ user, isAuthenticated: true });

      return true;
    } catch {
      return false;
    }
  },

  // ==============================
  // 🔐 ACTIVATE ACCOUNT (Controlled Registration)
  // ==============================
  register: async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // UI still sends name → split if needed (backend ignores it anyway)
      const nameParts = (userData.name || '').trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      await axios.post(`${API_URL}/auth/activate`, {
        email: userData.email,
        password: userData.password,
        first_name,  // optional (ignored by backend)
        last_name    // optional (ignored by backend)
      });

      return true;

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Activation failed');
      }
      throw err;
    }
  },

  // ==============================
  // 🔐 LOGOUT
  // ==============================
  logout: () => {
    localStorage.removeItem('token');
    clearSession();
    set({ user: null, isAuthenticated: false });
  },

  // ==============================
  // 👤 SET USER
  // ==============================
  setUser: (user: User) => {
    setCurrentUser(user);
    set({ user, isAuthenticated: true });
  },

  // ==============================
  // 🔄 SWITCH ROLE (For Admin Testing)
  // ==============================
  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    set({ user: updatedUser });
  },
}));
