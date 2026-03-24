import { createBrowserRouter } from 'react-router';

// Root layout (provides PortalContext inside the router tree)
import RootLayout from './layouts/RootLayout';

// Shared Login
import LoginPage from './pages/LoginPage';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import UserManagementPage from './pages/admin/UserManagementPage';
import AnnouncementsPage from './pages/admin/AnnouncementsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

// Teacher Pages
import TeacherOverview from './pages/teacher/TeacherOverview';
import GradingPage from './pages/teacher/GradingPage';
import AttendancePage from './pages/teacher/AttendancePage';
import TeacherSchedulePage from './pages/teacher/TeacherSchedulePage';

// Student Pages
import StudentOverview from './pages/student/StudentOverview';
import StudentGradesPage from './pages/student/StudentGradesPage';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentSchedulePage from './pages/student/StudentSchedulePage';

export const router = createBrowserRouter([
  {
    // RootLayout wraps ALL routes so PortalProvider is inside the router tree
    Component: RootLayout,
    children: [
      // ── Login ────────────────────────────────────────────────
      { path: '/', Component: LoginPage },

      // ── Admin ────────────────────────────────────────────────
      {
        path: '/admin',
        Component: AdminLayout,
        children: [
          { index: true,           Component: AdminOverview },
          { path: 'users',         Component: UserManagementPage },
          { path: 'students',      Component: UserManagementPage },
          { path: 'teachers',      Component: UserManagementPage },
          { path: 'announcements', Component: AnnouncementsPage },
          { path: 'settings',      Component: SystemSettingsPage },
        ],
      },

      // ── Teacher ──────────────────────────────────────────────
      {
        path: '/teacher',
        Component: TeacherLayout,
        children: [
          { index: true,        Component: TeacherOverview },
          { path: 'grades',     Component: GradingPage },
          { path: 'attendance', Component: AttendancePage },
          { path: 'schedule',   Component: TeacherSchedulePage },
        ],
      },

      // ── Student ──────────────────────────────────────────────
      {
        path: '/student',
        Component: StudentLayout,
        children: [
          { index: true,         Component: StudentOverview },
          { path: 'grades',      Component: StudentGradesPage },
          { path: 'assignments', Component: StudentAssignmentsPage },
          { path: 'schedule',    Component: StudentSchedulePage },
        ],
      },

      // ── Fallback ─────────────────────────────────────────────
      { path: '*', Component: LoginPage },
    ],
  },
]);
