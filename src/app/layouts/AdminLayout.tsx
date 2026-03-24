import React from 'react';
import { Outlet } from 'react-router';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Megaphone, Settings,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import { usePortal } from '../context/PortalContext';

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/admin' },
  { icon: Users,           label: 'User Management', path: '/admin/users' },
  { icon: GraduationCap,   label: 'Students',        path: '/admin/students' },
  { icon: BookOpen,        label: 'Teachers',        path: '/admin/teachers' },
  { icon: Megaphone,       label: 'Announcements',   path: '/admin/announcements' },
  { icon: Settings,        label: 'System Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const { announcements } = usePortal();
  const enhancedNav = navItems.map(item =>
    item.path === '/admin/announcements'
      ? { ...item, badge: announcements.length > 2 ? announcements.length - 2 : 0 }
      : item
  );

  return (
    <DashboardLayout
      role="admin"
      navItems={enhancedNav}
      userName="Dr. Sarah Mitchell"
      userTitle="System Administrator"
      notificationCount={3}
    >
      <Outlet />
    </DashboardLayout>
  );
}
