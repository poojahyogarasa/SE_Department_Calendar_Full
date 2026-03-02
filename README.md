# SE Department Academic Calendar

A full-stack academic calendar management system built for the **Department of Computer Engineering, Faculty of Engineering, University of Jaffna**. It supports role-based event management, approval workflows, notifications, and resource booking.

---

## Project Structure

```
SE-Department-Academic-Calendar/
├── frontend/    # React 19 + TypeScript + Vite
└── backend/     # Node.js + Express + MySQL
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool |
| Zustand | State management |
| Tailwind CSS | Styling |
| date-fns | Date manipulation |
| React Router v6 | Routing |
| Axios + TanStack Query | API communication |
| @dnd-kit | Drag-and-drop |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MySQL2 | Database |
| JWT + bcryptjs | Authentication |
| Nodemailer | Email notifications |
| Zod | Validation |
| express-rate-limit | Rate limiting |

---

## User Roles

| Role | Description |
|---|---|
| `STUDENT` | View-only access to approved events |
| `LECTURER` | Create and manage lecture events |
| `INSTRUCTOR` | Create and manage lab/practical events |
| `TECHNICAL_OFFICER` | Manage technical resources and bookings |
| `HOD` | Approve/reject events, full calendar access |
| `ADMIN` | Full system access, user management |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@uoj.lk` | `admin123` |
| Head of Department | `hod@uoj.lk` | `hod123` |
| Lecturer | `rajesh@uoj.lk` | `staff123` |
| Instructor | `priya@uoj.lk` | `staff123` |
| Technical Officer | `dinesh@uoj.lk` | `to123` |
| Student | `arun@student.uoj.lk` | `student123` |

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- MySQL 8.x (for backend)

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

**Build for production:**
```bash
npm run build
npm run preview
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=se_calendar
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the server:
```bash
npm run dev      # development (nodemon)
npm start        # production
```

API runs at: `http://localhost:5000`

---

## Features

### Calendar Views
- **Day View** — hourly time grid with drag-and-drop
- **Week View** — 7-day column layout
- **Month View** — standard month grid with event badges

### Event Management
- Create, edit, and delete events
- Event categories: Lecture, Lab, Exam, Meeting, Other
- All-day and timed events
- Recurring events (Daily, Weekly, Monthly)
- Student count and notification reminders

### Approval Workflow
- Events created by staff go to `PENDING` status
- HOD or Admin can **Approve** or **Reject** with a reason
- Approved events are visible to students

### Resource Booking
- Book rooms, labs, and equipment
- Conflict detection prevents double-booking

### Notifications
- In-app notification centre
- Email reminders via Nodemailer

### Task Management
- Per-user persistent task/to-do list

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/api/approvals` | Pending approvals (HOD/Admin) |
| PUT | `/api/approvals/:id` | Approve or reject event |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/todos` | Get user tasks |
| GET | `/api/dashboard` | Dashboard stats |

---

## Troubleshooting

**Port already in use (frontend):**
```typescript
// vite.config.ts
server: { port: 3000 }
```

**Clear localStorage (frontend):**
```javascript
localStorage.clear();
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## License

MIT License — Free for educational use.

---

## Credits

Built for the **Department of Computer Engineering**
Faculty of Engineering, University of Jaffna, Sri Lanka
