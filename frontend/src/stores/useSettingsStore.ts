import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  darkMode: boolean;
  showDescriptions: boolean;
  use24Hour: boolean;
  firstDayOfWeek: 'sunday' | 'monday';
  setDarkMode: (v: boolean) => void;
  setShowDescriptions: (v: boolean) => void;
  setUse24Hour: (v: boolean) => void;
  setFirstDayOfWeek: (v: 'sunday' | 'monday') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      showDescriptions: false,
      use24Hour: false,
      firstDayOfWeek: 'sunday',
      setDarkMode: (darkMode) => {
        document.documentElement.classList.toggle('dark', darkMode);
        set({ darkMode });
      },
      setShowDescriptions: (showDescriptions) => set({ showDescriptions }),
      setUse24Hour: (use24Hour) => set({ use24Hour }),
      setFirstDayOfWeek: (firstDayOfWeek) => set({ firstDayOfWeek }),
    }),
    { name: 'dept-calendar-settings' }
  )
);

// Apply dark mode on initial page load from persisted state
const stored = localStorage.getItem('dept-calendar-settings');
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    if (state?.darkMode) document.documentElement.classList.add('dark');
  } catch { /* ignore */ }
}
