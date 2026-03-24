import React from 'react';
import { Outlet } from 'react-router';
import { BookOpen, ClipboardList, CheckSquare, CalendarDays } from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import { usePortal } from '../context/PortalContext';

const navItems: NavItem[] = [
  { icon: BookOpen,      label: 'My Classes',     path: '/teacher' },
  { icon: ClipboardList, label: 'Grading System', path: '/teacher/grades' },
  { icon: CheckSquare,   label: 'Attendance',     path: '/teacher/attendance' },
  { icon: CalendarDays,  label: 'Schedule',       path: '/teacher/schedule' },
];

export default function TeacherLayout() {
  const { gradesSubmitted } = usePortal();

  const enhancedNav = navItems.map(item =>
    item.path === '/teacher/grades'
      ? { ...item, badge: gradesSubmitted ? 0 : 12 }
      : item
  );

  return (
    <DashboardLayout
      role="teacher"
      navItems={enhancedNav}
      userName="Prof. James Wilson"
      userTitle="Mathematics Dept."
      notificationCount={2}
    >
      <Outlet />
    </DashboardLayout>
  );
}
