import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, BookOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import type { EventCategory } from '../../types';

const eventTypes: { value: EventCategory; label: string }[] = [
  { value: 'LECTURE',  label: 'Lecture' },
  { value: 'LAB',      label: 'Lab' },
  { value: 'EXAM',     label: 'Exam' },
  { value: 'SEMINAR',  label: 'Seminar' },
  { value: 'MEETING',  label: 'Meeting' },
  { value: 'OTHER',    label: 'Other' },
];

const audiences = ['Students', 'Staff', 'Faculty', 'All'];

const notificationOptions = [
  { value: '15',   label: '15 minutes before' },
  { value: '30',   label: '30 minutes before' },
  { value: '60',   label: '1 hour before' },
  { value: '1440', label: '1 day before' },
];

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, updateEvent, deleteEvent } = useEventStore();

  const event = events.find(e => e.id === id);

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventCategory>('LECTURE');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('Students');
  const [notificationTime, setNotificationTime] = useState('30');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!event) { navigate('/calendar'); return; }
    setTitle(event.title);
    setEventType(event.category);
    setDate(format(new Date(event.start), 'yyyy-MM-dd'));
    setStartTime(format(new Date(event.start), 'HH:mm'));
    setEndTime(format(new Date(event.end), 'HH:mm'));
    setLocation(event.location || '');
    setDescription(event.description || '');
    setNotificationTime(event.notificationMinutes?.toString() ?? '30');
  }, [event, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())             e.title = 'Event title is required';
    if (!date)                     e.date = 'Please pick a date';
    if (!startTime || !endTime)    e.time = 'Start and end time are required';
    else if (startTime >= endTime) e.time = 'End time must be after start time';
    if (!description.trim())       e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !event) return;
    updateEvent(event.id, {
      title,
      description,
      location,
      start: new Date(`${date}T${startTime}`),
      end:   new Date(`${date}T${endTime}`),
      category: eventType,
      notificationMinutes: notificationTime ? parseInt(notificationTime, 10) : undefined,
    });
    navigate(`/event/${event.id}`);
  };

  const handleDelete = () => {
    if (!event) return;
    if (window.confirm('Delete this event permanently?')) {
      deleteEvent(event.id);
      navigate('/calendar');
    }
  };

  if (!event) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <span className="text-primary font-semibold">Department Calendar</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-sm">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'User'}</span>
        </div>
      </header>

      {/* Form — inside a card */}
      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>

          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              Please fix the highlighted errors.
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Event Title */}
            <div>
              <label className="input-label">Event Title</label>
              <div className="input-group">
                <BookOpen className="input-icon w-5 h-5" />
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Quantum Physics"
                  className={`input-field input-with-icon ${errors.title ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.title && <p className="input-error">{errors.title}</p>}
            </div>

            {/* Event Type */}
            <div>
              <label className="input-label">Event Type</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as EventCategory)}
                className="input-field"
              >
                {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="input-label">Date</label>
              <div className="input-group">
                <Calendar className="input-icon w-5 h-5" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className={`input-field input-with-icon ${errors.date ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.date && <p className="input-error">{errors.date}</p>}
            </div>

            {/* Start / End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Start Time</label>
                <div className="input-group">
                  <Clock className="input-icon w-5 h-5" />
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    className={`input-field input-with-icon ${errors.time ? 'border-red-500' : ''}`} />
                </div>
              </div>
              <div>
                <label className="input-label">End Time</label>
                <div className="input-group">
                  <Clock className="input-icon w-5 h-5" />
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    className={`input-field input-with-icon ${errors.time ? 'border-red-500' : ''}`} />
                </div>
              </div>
            </div>
            {errors.time && <p className="input-error">{errors.time}</p>}

            {/* Location */}
            <div>
              <label className="input-label">Location / Venue</label>
              <div className="input-group">
                <MapPin className="input-icon w-5 h-5" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., Science Building, Room 201"
                  className="input-field input-with-icon"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="input-label">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide detailed information about the event..."
                rows={4}
                className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="input-error">{errors.description}</p>}
            </div>

            {/* Target Audience */}
            <div>
              <label className="input-label">Target Audience</label>
              <select value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="input-field">
                {audiences.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Notification Time */}
            <div>
              <label className="input-label">Notification Time</label>
              <select value={notificationTime} onChange={e => setNotificationTime(e.target.value)} className="input-field">
                <option value="">No reminder</option>
                {notificationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="btn-danger flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
              <button type="submit" className="btn-primary ml-auto">
                Update Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
