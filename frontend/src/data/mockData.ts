import type { User, Calendar, Event, Resource, AuditLog } from '../types';
import { addDays, startOfMonth, setHours, setMinutes, addWeeks } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@uoj.lk',
    role: 'ADMIN',
    department: 'Computer Engineering',
  },
  {
    id: 'user-2',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@uoj.lk',
    role: 'LECTURER',
    department: 'Computer Engineering',
  },
  {
    id: 'user-3',
    name: 'Ms. Priya Silva',
    email: 'priya@uoj.lk',
    role: 'INSTRUCTOR',
    department: 'Computer Engineering',
  },
  {
    id: 'user-4',
    name: 'Arun Selvam',
    email: 'arun@student.uoj.lk',
    role: 'STUDENT',
    department: 'Computer Engineering',
    year: 3,
    semester: 1,
    group: 'A',
  },
  {
    id: 'user-5',
    name: 'Nisha Thamilarasan',
    email: 'nisha@student.uoj.lk',
    role: 'STUDENT',
    department: 'Computer Engineering',
    year: 3,
    semester: 1,
    group: 'A',
  },
  {
    id: 'user-6',
    name: 'Kavin Murugan',
    email: 'kavin@student.uoj.lk',
    role: 'STUDENT',
    department: 'Computer Engineering',
    year: 2,
    semester: 2,
    group: 'B',
  },
  {
    id: 'user-7',
    name: 'Prof. Sanjay Patel',
    email: 'hod@uoj.lk',
    role: 'HOD',
    department: 'Computer Engineering',
  },
  {
    id: 'user-8',
    name: 'Dr. Amara Perera',
    email: 'amara@uoj.lk',
    role: 'LECTURER',
    department: 'Computer Engineering',
  },
  {
    id: 'user-9',
    name: 'Mr. Suresh Nair',
    email: 'suresh@uoj.lk',
    role: 'INSTRUCTOR',
    department: 'Computer Engineering',
  },
  {
    id: 'user-10',
    name: 'Mr. Dinesh Fernando',
    email: 'dinesh@uoj.lk',
    role: 'TECHNICAL_OFFICER',
    department: 'Computer Engineering',
  },
];

// Credentials are managed in the backend database.
// Use the backend API to authenticate.

// Mock Calendars
export const mockCalendars: Calendar[] = [
  {
    id: 'cal-1',
    name: 'Academic Calendar',
    color: '#2563eb', // blue-600
    visibility: 'PUBLIC',
    managers: ['user-1', 'user-2', 'user-7', 'user-8'],
    description: 'Official academic events and deadlines',
    isActive: true,
  },
  {
    id: 'cal-2',
    name: 'Examinations',
    color: '#dc2626', // red-600
    visibility: 'PUBLIC',
    managers: ['user-1', 'user-7'],
    description: 'Exam schedules and assessments',
    isActive: true,
  },
  {
    id: 'cal-3',
    name: 'Seminars & Workshops',
    color: '#7c3aed', // violet-600
    visibility: 'PUBLIC',
    managers: ['user-1', 'user-2', 'user-8'],
    description: 'Guest lectures, seminars, and workshops',
    isActive: true,
  },
  {
    id: 'cal-4',
    name: 'Staff Meetings',
    color: '#ea580c', // orange-600
    visibility: 'STAFF_ONLY',
    managers: ['user-1', 'user-7', 'user-2'],
    description: 'Internal staff meetings and discussions',
    isActive: true,
  },
  {
    id: 'cal-5',
    name: 'Lab Bookings',
    color: '#059669', // emerald-600
    visibility: 'PUBLIC',
    managers: ['user-1', 'user-3', 'user-9'],
    description: 'Computer lab and equipment bookings',
    isActive: true,
  },
];

// Mock Resources (Rooms/Labs)
export const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: 'Computer Lab 1',
    type: 'LAB',
    capacity: 40,
    location: 'Building A, Floor 2',
    facilities: ['40 Computers', 'Projector', 'Air Conditioning'],
    isActive: true,
  },
  {
    id: 'res-2',
    name: 'Computer Lab 2',
    type: 'LAB',
    capacity: 30,
    location: 'Building A, Floor 2',
    facilities: ['30 Computers', 'Whiteboard', 'Air Conditioning'],
    isActive: true,
  },
  {
    id: 'res-3',
    name: 'Lecture Hall 1',
    type: 'HALL',
    capacity: 200,
    location: 'Building B, Floor 1',
    facilities: ['Projector', 'Audio System', 'Air Conditioning'],
    isActive: true,
  },
  {
    id: 'res-4',
    name: 'Seminar Room',
    type: 'ROOM',
    capacity: 50,
    location: 'Building A, Floor 3',
    facilities: ['Projector', 'Whiteboard', 'Video Conferencing'],
    isActive: true,
  },
  {
    id: 'res-5',
    name: 'Meeting Room 201',
    type: 'ROOM',
    capacity: 15,
    location: 'Building A, Floor 2',
    facilities: ['Whiteboard', 'Video Conferencing'],
    isActive: true,
  },
];

// Helper function to create events for the current month and next month
const generateMockEvents = (): Event[] => {
  const now = new Date();
  const events: Event[] = [];

  // Recurring Lectures - Week 1
  const lectureStartDate = startOfMonth(now);

  // Monday - Data Structures Lecture
  events.push({
    id: 'evt-1',
    calendarId: 'cal-1',
    title: 'Data Structures & Algorithms',
    description: 'Lecture on Tree Data Structures and Traversal Algorithms',
    location: 'Lecture Hall 1',
    start: setMinutes(setHours(addDays(lectureStartDate, 1), 9), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 1), 11), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LECTURE',
    createdBy: 'user-2',
    createdAt: addDays(now, -30),
    updatedAt: addDays(now, -30),
    resourceId: 'res-3',
    courseCode: 'CE3201',
    courseYear: 3,
    courseGroup: 'A',
  });

  // Monday - Database Lab
  events.push({
    id: 'evt-2',
    calendarId: 'cal-5',
    title: 'Database Systems Lab',
    description: 'Practical session on SQL queries and normalization',
    location: 'Computer Lab 1',
    start: setMinutes(setHours(addDays(lectureStartDate, 1), 14), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 1), 17), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LAB',
    createdBy: 'user-3',
    createdAt: addDays(now, -25),
    updatedAt: addDays(now, -25),
    resourceId: 'res-1',
    courseCode: 'CE3202',
    courseYear: 3,
    courseGroup: 'A',
    status: 'APPROVED',
    studentCount: 38,
  });

  // Tuesday - Operating Systems
  events.push({
    id: 'evt-3',
    calendarId: 'cal-1',
    title: 'Operating Systems',
    description: 'Process Scheduling Algorithms',
    location: 'Lecture Hall 1',
    start: setMinutes(setHours(addDays(lectureStartDate, 2), 10), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 2), 12), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LECTURE',
    createdBy: 'user-2',
    createdAt: addDays(now, -28),
    updatedAt: addDays(now, -28),
    resourceId: 'res-3',
    courseCode: 'CE3203',
    courseYear: 3,
  });

  // Wednesday - Computer Networks
  events.push({
    id: 'evt-4',
    calendarId: 'cal-1',
    title: 'Computer Networks',
    description: 'Network Layer and Routing Protocols',
    location: 'Lecture Hall 1',
    start: setMinutes(setHours(addDays(lectureStartDate, 3), 9), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 3), 11), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LECTURE',
    createdBy: 'user-2',
    createdAt: addDays(now, -27),
    updatedAt: addDays(now, -27),
    resourceId: 'res-3',
    courseCode: 'CE3204',
    courseYear: 3,
  });

  // Thursday - Software Engineering
  events.push({
    id: 'evt-5',
    calendarId: 'cal-1',
    title: 'Software Engineering',
    description: 'Agile Methodologies and Scrum Framework',
    location: 'Seminar Room',
    start: setMinutes(setHours(addDays(lectureStartDate, 4), 10), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 4), 12), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LECTURE',
    createdBy: 'user-3',
    createdAt: addDays(now, -26),
    updatedAt: addDays(now, -26),
    resourceId: 'res-4',
    courseCode: 'CE3205',
    courseYear: 3,
  });

  // Friday - Machine Learning Workshop
  events.push({
    id: 'evt-6',
    calendarId: 'cal-3',
    title: 'Introduction to Machine Learning',
    description: 'Guest lecture by industry expert on ML fundamentals and applications',
    location: 'Seminar Room',
    start: setMinutes(setHours(addDays(lectureStartDate, 5), 14), 0),
    end: setMinutes(setHours(addDays(lectureStartDate, 5), 16), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'SEMINAR',
    createdBy: 'user-2',
    createdAt: addDays(now, -20),
    updatedAt: addDays(now, -20),
    resourceId: 'res-4',
  });

  // This week - Staff Meeting
  const thisWeek = addWeeks(now, 0);
  events.push({
    id: 'evt-7',
    calendarId: 'cal-4',
    title: 'Department Meeting',
    description: 'Monthly department review and planning',
    location: 'Meeting Room 201',
    start: setMinutes(setHours(addDays(thisWeek, 2), 15), 0),
    end: setMinutes(setHours(addDays(thisWeek, 2), 17), 0),
    allDay: false,
    visibility: 'STAFF_ONLY',
    category: 'MEETING',
    createdBy: 'user-1',
    createdAt: addDays(now, -10),
    updatedAt: addDays(now, -10),
    resourceId: 'res-5',
  });

  // Next week - Midterm Exam
  const nextWeek = addWeeks(now, 1);
  events.push({
    id: 'evt-8',
    calendarId: 'cal-2',
    title: 'Data Structures Midterm Exam',
    description: 'Written exam covering trees, graphs, and sorting algorithms',
    location: 'Lecture Hall 1',
    start: setMinutes(setHours(addDays(nextWeek, 3), 9), 0),
    end: setMinutes(setHours(addDays(nextWeek, 3), 12), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'EXAM',
    createdBy: 'user-2',
    createdAt: addDays(now, -15),
    updatedAt: addDays(now, -15),
    resourceId: 'res-3',
    courseCode: 'CE3201',
    courseYear: 3,
  });

  // Next week - Private Staff Event
  events.push({
    id: 'evt-9',
    calendarId: 'cal-4',
    title: 'Performance Reviews',
    description: 'Annual performance review sessions',
    location: 'Meeting Room 201',
    start: setMinutes(setHours(addDays(nextWeek, 4), 10), 0),
    end: setMinutes(setHours(addDays(nextWeek, 4), 16), 0),
    allDay: false,
    visibility: 'PRIVATE',
    category: 'MEETING',
    createdBy: 'user-1',
    createdAt: addDays(now, -5),
    updatedAt: addDays(now, -5),
    resourceId: 'res-5',
  });

  // Today - Lab Session
  events.push({
    id: 'evt-10',
    calendarId: 'cal-5',
    title: 'Web Development Lab',
    description: 'Hands-on session with React and Node.js',
    location: 'Computer Lab 2',
    start: setMinutes(setHours(now, 14), 0),
    end: setMinutes(setHours(now, 17), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LAB',
    createdBy: 'user-3',
    createdAt: addDays(now, -3),
    updatedAt: addDays(now, -3),
    resourceId: 'res-2',
    courseCode: 'CE3206',
    courseYear: 3,
    courseGroup: 'B',
    status: 'APPROVED',
    studentCount: 28,
  });

  // Tomorrow - All Day Event
  events.push({
    id: 'evt-11',
    calendarId: 'cal-1',
    title: 'University Day Celebrations',
    description: 'Annual university day festivities and cultural programs',
    location: 'Main Auditorium',
    start: addDays(now, 1),
    end: addDays(now, 1),
    allDay: true,
    visibility: 'PUBLIC',
    category: 'OTHER',
    createdBy: 'user-1',
    createdAt: addDays(now, -40),
    updatedAt: addDays(now, -40),
  });

  // Next month - Tech Talk
  events.push({
    id: 'evt-12',
    calendarId: 'cal-3',
    title: 'Tech Talk: Cloud Computing',
    description: 'Industry expert discussing AWS and Azure cloud platforms',
    location: 'Seminar Room',
    start: setMinutes(setHours(addDays(now, 20), 15), 0),
    end: setMinutes(setHours(addDays(now, 20), 17), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'SEMINAR',
    createdBy: 'user-2',
    createdAt: addDays(now, -8),
    updatedAt: addDays(now, -8),
    resourceId: 'res-4',
  });

  // Busy-only event for students
  events.push({
    id: 'evt-13',
    calendarId: 'cal-4',
    title: 'Curriculum Planning Session',
    description: 'Staff meeting to plan next semester curriculum',
    location: 'Meeting Room 201',
    start: setMinutes(setHours(addDays(now, 7), 10), 0),
    end: setMinutes(setHours(addDays(now, 7), 12), 0),
    allDay: false,
    visibility: 'BUSY_ONLY',
    category: 'MEETING',
    createdBy: 'user-2',
    createdAt: addDays(now, -12),
    updatedAt: addDays(now, -12),
    resourceId: 'res-5',
    status: 'APPROVED',
  });

  // Pending approval - AI Workshop (submitted by lecturer, awaiting HOD)
  events.push({
    id: 'evt-14',
    calendarId: 'cal-3',
    title: 'AI & Machine Learning Workshop',
    description: 'Full-day workshop on AI applications in engineering. Guest speaker from industry.',
    location: 'Seminar Room',
    start: setMinutes(setHours(addDays(now, 14), 9), 0),
    end: setMinutes(setHours(addDays(now, 14), 17), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'SEMINAR',
    createdBy: 'user-8',
    createdAt: addDays(now, -2),
    updatedAt: addDays(now, -2),
    resourceId: 'res-4',
    status: 'PENDING',
  });

  // Pending lab booking - submitted by instructor
  events.push({
    id: 'evt-15',
    calendarId: 'cal-5',
    title: 'Advanced Networking Lab',
    description: 'Lab session covering subnetting and routing configuration',
    location: 'Computer Lab 1',
    start: setMinutes(setHours(addDays(now, 10), 13), 0),
    end: setMinutes(setHours(addDays(now, 10), 16), 0),
    allDay: false,
    visibility: 'PUBLIC',
    category: 'LAB',
    createdBy: 'user-9',
    createdAt: addDays(now, -1),
    updatedAt: addDays(now, -1),
    resourceId: 'res-1',
    courseCode: 'CE3204',
    courseYear: 3,
    courseGroup: 'B',
    status: 'PENDING',
    studentCount: 35,
  });

  return events;
};

export const mockEvents: Event[] = generateMockEvents();

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'user-1',
    actorName: 'Admin User',
    action: 'CREATE',
    entityType: 'CALENDAR',
    entityId: 'cal-1',
    entityName: 'Academic Calendar',
    timestamp: addDays(new Date(), -30),
    diffSummary: 'Created new calendar: Academic Calendar',
    details: { color: '#2563eb', visibility: 'PUBLIC' },
  },
  {
    id: 'log-2',
    actorId: 'user-2',
    actorName: 'Dr. Rajesh Kumar',
    action: 'CREATE',
    entityType: 'EVENT',
    entityId: 'evt-1',
    entityName: 'Data Structures & Algorithms',
    timestamp: addDays(new Date(), -28),
    diffSummary: 'Created new lecture event',
    details: { location: 'Lecture Hall 1', courseCode: 'CE3201' },
  },
  {
    id: 'log-3',
    actorId: 'user-3',
    actorName: 'Ms. Priya Silva',
    action: 'UPDATE',
    entityType: 'EVENT',
    entityId: 'evt-2',
    entityName: 'Database Systems Lab',
    timestamp: addDays(new Date(), -20),
    diffSummary: 'Changed lab location from Computer Lab 2 to Computer Lab 1',
    details: { oldLocation: 'Computer Lab 2', newLocation: 'Computer Lab 1' },
  },
  {
    id: 'log-4',
    actorId: 'user-1',
    actorName: 'Admin User',
    action: 'CREATE',
    entityType: 'USER',
    entityId: 'user-4',
    entityName: 'Arun Selvam',
    timestamp: addDays(new Date(), -60),
    diffSummary: 'Registered new student account',
    details: { role: 'STUDENT', year: 3 },
  },
  {
    id: 'log-5',
    actorId: 'user-2',
    actorName: 'Dr. Rajesh Kumar',
    action: 'DELETE',
    entityType: 'EVENT',
    entityId: 'evt-old-1',
    entityName: 'Old Seminar',
    timestamp: addDays(new Date(), -15),
    diffSummary: 'Deleted cancelled seminar event',
  },
];

