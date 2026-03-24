import React from 'react';
import { Outlet } from 'react-router';
import { BookMarked, Award, ClipboardList, CalendarDays } from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';

const navItems: NavItem[] = [
  { icon: BookMarked,    label: 'My Subjects',  path: '/student' },
  { icon: Award,         label: 'Grades',       path: '/student/grades' },
  { icon: ClipboardList, label: 'Assignments',  path: '/student/assignments', badge: 4 },
  { icon: CalendarDays,  label: 'Schedule',     path: '/student/schedule' },
];

export default function StudentLayout() {
  return (
    <DashboardLayout
      role="student"
      navItems={navItems}
      userName="Emma Johnson"
      userTitle="Grade 11 – Section A"
      notificationCount={4}
    >
      <Outlet />
    </DashboardLayout>
  );
}
