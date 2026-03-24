import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Shield, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const baseUsers = [
  { id: 1,  name: 'Emma Johnson',     role: 'Student', dept: 'Grade 11-A', email: 'emma.j@eduportal.edu',     joined: 'Sep 2024', status: 'active' },
  { id: 2,  name: 'Lucas Park',       role: 'Student', dept: 'Grade 11-A', email: 'lucas.p@eduportal.edu',    joined: 'Sep 2024', status: 'active' },
  { id: 3,  name: 'Sophia Williams',  role: 'Student', dept: 'Grade 10-A', email: 'sophia.w@eduportal.edu',   joined: 'Mar 2026', status: 'active' },
  { id: 4,  name: 'Ethan Parker',     role: 'Student', dept: 'Grade 11-B', email: 'ethan.p@eduportal.edu',    joined: 'Mar 2026', status: 'pending' },
  { id: 5,  name: 'Prof. James Wilson', role: 'Teacher', dept: 'Mathematics', email: 'j.wilson@eduportal.edu', joined: 'Aug 2022', status: 'active' },
  { id: 6,  name: 'Dr. Marcus Reed',   role: 'Teacher', dept: 'Physics',     email: 'm.reed@eduportal.edu',   joined: 'Mar 2026', status: 'active' },
  { id: 7,  name: 'Ms. Laura Kim',     role: 'Teacher', dept: 'Mathematics', email: 'l.kim@eduportal.edu',    joined: 'Mar 2026', status: 'active' },
  { id: 8,  name: 'Dr. Sarah Mitchell', role: 'Admin', dept: 'Administration', email: 's.mitchell@eduportal.edu', joined: 'Jan 2020', status: 'active' },
];

const roleIcon = { Student: GraduationCap, Teacher: BookOpen, Admin: Shield };
const roleStyle = {
  Student: { bg: C.paleMint,  color: C.forestGreen },
  Teacher: { bg: '#E0F2FE',   color: '#0369A1' },
  Admin:   { bg: '#F3E8FF',   color: '#7C3AED' },
};

export default function UserManagementPage() {
  const { registeredUsers } = usePortal();
  const [filter, setFilter] = useState<'All' | 'Student' | 'Teacher' | 'Admin'>('All');
  const [search, setSearch] = useState('');

  const allUsers = [
    ...baseUsers,
    ...registeredUsers.map((u, i) => ({
      id: 1000 + i, name: u.name, role: u.role, dept: '—', email: u.email, joined: 'Just now', status: 'pending' as const,
    })),
  ];

  const filtered = allUsers.filter(u => {
    const matchRole = filter === 'All' || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = { All: allUsers.length, Student: allUsers.filter(u => u.role === 'Student').length, Teacher: allUsers.filter(u => u.role === 'Teacher').length, Admin: allUsers.filter(u => u.role === 'Admin').length };

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>User Management</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>Manage all system users · {allUsers.length} total accounts</p>
        </div>
        <button
          onClick={() => toast.info('Use the Register New User button on the Dashboard.')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: radius.md, background: C.forestGreen, color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: `0px 4px 12px rgba(27,94,59,0.3)`, transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#154d30'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.forestGreen; }}
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: C.white, borderRadius: radius.lg, padding: '20px 24px', boxShadow: shadow.card, border: `1px solid ${C.border}`, marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['All', 'Student', 'Teacher', 'Admin'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: radius.full,
                border: `1.5px solid ${filter === f ? C.forestGreen : C.lightGray}`,
                background: filter === f ? C.forestGreen : 'white',
                color: filter === f ? 'white' : C.medGray,
                cursor: 'pointer', fontSize: '13px', fontWeight: filter === f ? '600' : '400',
                transition: 'all 0.18s',
              }}
            >
              {f} <span style={{ opacity: 0.7, fontSize: '11px' }}>({counts[f]})</span>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: C.medGray }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            style={{ paddingLeft: '32px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '13px', outline: 'none', width: '220px', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = C.emerald)}
            onBlur={e  => (e.target.style.borderColor = C.lightGray)}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.offWhite, borderBottom: `2px solid ${C.border}` }}>
              {['User', 'Role', 'Department', 'Email', 'Joined', 'Status', ''].map(col => (
                <th key={col} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: C.medGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const RoleIcon = roleIcon[user.role as keyof typeof roleIcon] || Shield;
              const rs = roleStyle[user.role as keyof typeof roleStyle] || roleStyle.Admin;
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: radius.full, background: rs.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: rs.color, flexShrink: 0 }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: radius.full, fontSize: '11.5px', fontWeight: '600', background: rs.bg, color: rs.color }}>
                      <RoleIcon size={11} />{user.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.medGray }}>{user.dept}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color={C.medGray} />
                      <span style={{ fontSize: '13px', color: C.medGray }}>{user.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.medGray }}>{user.joined}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: radius.full, fontSize: '11.5px', fontWeight: '600', background: user.status === 'active' ? C.successBg : C.warningBg, color: user.status === 'active' ? C.success : C.warning }}>
                      {user.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, padding: '4px', borderRadius: radius.sm, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      onClick={() => toast.info(`Edit user: ${user.name}`)}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: C.medGray, fontSize: '14px' }}>No users found matching your search.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
