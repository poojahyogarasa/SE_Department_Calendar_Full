import { z } from 'zod';

// ===============================
// Shared / primitives
// ===============================

export const MessageResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
});

// ===============================
// Auth
// ===============================

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const SignupRequestSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export const BackendUserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(['ADMIN', 'HOD', 'LECTURER', 'STUDENT', 'TO', 'INSTRUCTOR', 'TECHNICAL_OFFICER', 'HOD']),
  department: z.string().optional().nullable(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  token: z.string(),
  user: BackendUserSchema,
});

// ===============================
// Events
// ===============================

export const BackendEventSchema = z.object({
  event_id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  event_type: z.string(),
  location: z.string().nullable().optional(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  created_by: z.number().optional().nullable(),
  created_at: z.string().optional().nullable(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
});

export const CreateEventRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  event_type: z.string().min(1),
  location: z.string().min(1),
  start_datetime: z.string(),
  end_datetime: z.string(),
});

export const UpdateEventRequestSchema = CreateEventRequestSchema;

// ===============================
// Notifications
// ===============================

export const BackendNotificationSchema = z.object({
  notification_id: z.number(),
  event_id: z.number().nullable().optional(),
  user_id: z.number().optional(),
  message: z.string(),
  notification_type: z.enum(['APPROVAL_REQUEST', 'APPROVED', 'REJECTED']).optional(),
  sent_at: z.string().optional().nullable(),
  is_read: z.union([z.literal(0), z.literal(1), z.boolean()]),
});

export const NotificationCountSchema = z.object({
  unread_count: z.number(),
});

export const MarkAllReadResponseSchema = z.object({
  message: z.string(),
  updated: z.number().optional(),
});

// ===============================
// Todos
// ===============================

export const BackendTodoSchema = z.object({
  todo_id: z.number(),
  user_id: z.number().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  is_done: z.union([z.literal(0), z.literal(1), z.boolean()]),
  created_at: z.string().optional().nullable(),
});

export const CreateTodoRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export const UpdateTodoRequestSchema = CreateTodoRequestSchema;

export const CreateTodoResponseSchema = z.object({
  message: z.string(),
  todoId: z.number().optional(),
});

// ===============================
// Dashboard
// ===============================

export const LecturerDashboardSchema = z.object({
  role: z.literal('LECTURER'),
  total_events: z.number(),
  pending_events: z.number(),
  approved_events: z.number(),
  rejected_events: z.number(),
  unread_notifications: z.number(),
});

export const HodDashboardSchema = z.object({
  role: z.literal('HOD'),
  total_events: z.number(),
  pending_events: z.number(),
  approved_events: z.number(),
  rejected_events: z.number(),
});

export const StudentDashboardSchema = z.object({
  role: z.literal('STUDENT'),
  total_approved: z.number(),
  upcoming_events: z.number(),
});

export const AdminDashboardSchema = z.object({
  role: z.literal('ADMIN'),
  total_users: z.number(),
  total_events: z.number(),
  pending_events: z.number(),
  approved_events: z.number(),
  rejected_events: z.number(),
});

export const ToDashboardSchema = z.object({
  role: z.literal('TO'),
  message: z.string(),
  system_status: z.string(),
});

export const DashboardSummarySchema = z.discriminatedUnion('role', [
  LecturerDashboardSchema,
  HodDashboardSchema,
  StudentDashboardSchema,
  AdminDashboardSchema,
  ToDashboardSchema,
]);

// ===============================
// Admin Users
// ===============================

export const BackendAdminUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role: z.string(),
  created_at: z.string().optional().nullable(),
});

// ===============================
// HOD
// ===============================

export const RejectEventRequestSchema = z.object({
  reason: z.string().optional(),
});

export const PendingEventsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(BackendEventSchema),
});

export const HodNotificationsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(BackendNotificationSchema),
});

// ===============================
// Type exports (inferred from schemas)
// ===============================

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type BackendUser = z.infer<typeof BackendUserSchema>;
export type BackendEvent = z.infer<typeof BackendEventSchema>;
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;
export type BackendNotification = z.infer<typeof BackendNotificationSchema>;
export type BackendTodo = z.infer<typeof BackendTodoSchema>;
export type CreateTodoRequest = z.infer<typeof CreateTodoRequestSchema>;
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type BackendAdminUser = z.infer<typeof BackendAdminUserSchema>;
