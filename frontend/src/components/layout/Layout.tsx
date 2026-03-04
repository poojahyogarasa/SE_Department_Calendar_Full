import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventStore } from '../../stores/useEventStore';
import { canCreateEvent } from '../../utils/permissions';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showEventModal, setShowEventModal] = useState(false);
  const { user } = useAuthStore();
  const { calendars } = useEventStore();

  // BUG_007: Only show +New button for roles that can create events
  const userCanCreate = useMemo(
    () => calendars.some(cal => canCreateEvent(user, cal)),
    [user, calendars]
  );

  const handleNewEvent = () => {
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewEvent={userCanCreate ? handleNewEvent : undefined} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children || <Outlet context={{ showEventModal, setShowEventModal }} />}
        </main>
      </div>
    </div>
  );
}
