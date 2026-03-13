import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import type { Event, EventCategory, EventVisibility } from '../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  initialDate?: Date;
}

export default function EventModal({ isOpen, onClose, event, initialDate }: EventModalProps) {
  const { calendars, addEvent, updateEvent, deleteEvent, checkEventConflicts } = useEventStore();
  const { user } = useAuthStore();

  const isInstructor = user?.role === 'INSTRUCTOR';
  const isLecturer = user?.role === 'LECTURER';
  const needsApproval = isLecturer || isInstructor;

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventCategory>(isInstructor ? 'LAB' : 'LECTURE');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [notificationTime, setNotificationTime] = useState('30');
  const [studentCount, setStudentCount] = useState<string>('');
  const [calendarId, setCalendarId] = useState(calendars[0]?.id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [overrideConflict, setOverrideConflict] = useState(false);

  const isEditing = !!event;

  // Role-based event type options
  const eventTypes: { value: EventCategory; label: string }[] = isInstructor
    ? [{ value: 'LAB', label: 'Lab Session' }]
    : [
        { value: 'LECTURE', label: 'Lecture' },
        { value: 'EXAM', label: 'Exam' },
        { value: 'SEMINAR', label: 'Seminar' },
        { value: 'MEETING', label: 'Meeting' },
        { value: 'OTHER', label: 'Other' },
      ];

  // No 'Faculty' in target audience
  const audiences = ['Students', 'Staff', 'All'];

  const notificationOptions = [
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '1440', label: '1 day before' },
  ];

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setEventType(event.category);
      setDate(format(new Date(event.start), 'yyyy-MM-dd'));
      setStartTime(format(new Date(event.start), 'HH:mm'));
      setEndTime(format(new Date(event.end), 'HH:mm'));
      setLocation(event.location || '');
      setDescription(event.description || '');
      setCalendarId(event.calendarId);
      setNotificationTime(event.notificationMinutes?.toString() ?? '30');
      setStudentCount(event.studentCount?.toString() ?? '');
    } else if (initialDate) {
      setDate(format(initialDate, 'yyyy-MM-dd'));
    }
    // Reset conflict state when event changes
    setConflictWarning(null);
    setOverrideConflict(false);
  }, [event, initialDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!eventType) newErrors.eventType = 'Event type is required';
    if (!date) newErrors.date = 'Please pick a date for the event';
    if (!startTime || !endTime) newErrors.time = 'Start and end time are required';
    if (startTime >= endTime) newErrors.time = 'End time cannot be earlier than start time';
    if (!description.trim()) newErrors.description = 'Description is required, provide full details';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Check for conflicts (skip if user already chose to override)
    if (!overrideConflict) {
      const conflicts = checkEventConflicts(
        { start: startDateTime, end: endDateTime, calendarId },
        isEditing && event ? event.id : undefined
      );
      if (conflicts.length > 0) {
        setConflictWarning(conflicts.map(c => `• ${c.message}`).join('\n'));
        return;
      }
    }

    setConflictWarning(null);
    setOverrideConflict(false);

    const eventData = {
      title,
      description,
      location,
      start: startDateTime,
      end: endDateTime,
      allDay: false,
      visibility: 'PUBLIC' as EventVisibility,
      category: eventType,
      calendarId,
      createdBy: user?.id || '',
      notificationMinutes: notificationTime ? parseInt(notificationTime, 10) : undefined,
      studentCount: studentCount ? parseInt(studentCount, 10) : undefined,
      // Lecturer / Instructor events go through HOD approval
      status: (!isEditing && needsApproval) ? 'PENDING' as const : undefined,
    };

    if (isEditing && event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (event && window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(true);
      deleteEvent(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-2xl mx-4 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary font-semibold">Department Calendar</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              Please fix the highlighted errors
            </div>
          )}

          {/* Pending approval info */}
          {!isEditing && needsApproval && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Your event will be submitted for HOD approval before appearing on the calendar.</span>
            </div>
          )}

          {/* Conflict Warning */}
          {conflictWarning && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-800 text-sm">Scheduling Conflict Detected</p>
                  <pre className="text-sm text-orange-700 mt-1 whitespace-pre-wrap font-sans">{conflictWarning}</pre>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConflictWarning(null)}
                  className="px-3 py-1.5 text-sm font-medium bg-white border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50"
                >
                  Go back and fix
                </button>
                <button
                  type="button"
                  onClick={() => { setOverrideConflict(true); setConflictWarning(null); }}
                  className="px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Override & save anyway
                </button>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Event' : 'Add New Calendar Event'}
          </h2>

          <div className="space-y-4">
            {/* Event Title */}
            <div>
              <label className="input-label">Event Title</label>
              <div className="input-group">
                <Tag className="input-icon w-5 h-5" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setEventType(e.target.value as EventCategory)}
                className={`input-field ${errors.eventType ? 'border-red-500' : ''}`}
                disabled={isInstructor}
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {isInstructor && (
                <p className="text-xs text-gray-500 mt-1">Instructors can only schedule Lab sessions.</p>
              )}
              {errors.eventType && <p className="input-error">{errors.eventType}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="input-label">Date</label>
              <div className="input-group">
                <Calendar className="input-icon w-5 h-5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`input-field input-with-icon ${errors.date ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.date && <p className="input-error">{errors.date}</p>}
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Start Time</label>
                <div className="input-group">
                  <Clock className="input-icon w-5 h-5" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`input-field input-with-icon ${errors.time ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">End Time</label>
                <div className="input-group">
                  <Clock className="input-icon w-5 h-5" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`input-field input-with-icon ${errors.time ? 'border-red-500' : ''}`}
                  />
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
                  onChange={(e) => setLocation(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the event, objectives, and any prerequisites..."
                rows={4}
                className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="input-error">{errors.description}</p>}
            </div>

            {/* Target Audience */}
            <div>
              <label className="input-label">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="input-field"
              >
                <option value="">Select Audience</option>
                {audiences.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Count — only for LAB sessions */}
            {eventType === 'LAB' && (
              <div>
                <label className="input-label">Expected Student Count</label>
                <input
                  type="number"
                  min="1"
                  value={studentCount}
                  onChange={(e) => setStudentCount(e.target.value)}
                  placeholder="e.g. 30"
                  className="input-field"
                />
              </div>
            )}

            {/* Notification Time */}
            <div>
              <label className="input-label">Reminder Notification</label>
              <select
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="input-field"
              >
                <option value="">No reminder</option>
                {notificationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger mr-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Event' : needsApproval ? 'Submit for Approval' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
