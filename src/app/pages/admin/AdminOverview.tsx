import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  GraduationCap, BookOpen, UserPlus, TrendingUp,
  Activity, Clock, CheckCircle, AlertCircle, MoreVertical,
  Download, Filter, Plus, Megaphone,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const enrollmentData = [
  { day: 'Mon', students: 45, teachers: 5 },
  { day: 'Tue', students: 62, teachers: 8 },
  { day: 'Wed', students: 38, teachers: 4 },
  { day: 'Thu', students: 78, teachers: 7 },
  { day: 'Fri', students: 55, teachers: 9 },
  { day: 'Sat', students: 28, teachers: 3 },
  { day: 'Sun', students: 18, teachers: 1 },
];

const activityFeed = [
  { id: 1, icon: UserPlus,    text: 'New student Mia Chen registered',        time: '5m ago',  color: C.emerald },
  { id: 2, icon: CheckCircle, text: 'Prof. Wilson submitted grades Calc 11-A', time: '22m ago', color: C.success },
  { id: 3, icon: AlertCircle, text: 'System maintenance scheduled Sunday',     time: '1h ago',  color: C.warning },
  { id: 4, icon: Activity,    text: 'Monthly report exported successfully',    time: '2h ago',  color: C.mediumGreen },
  { id: 5, icon: UserPlus,    text: 'Teacher account created: Dr. Silva',      time: '3h ago',  color: C.emerald },
  { id: 6, icon: CheckCircle, text: 'Grade submission deadline extended',      time: '5h ago',  color: C.success },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.white, borderRadius: radius.md, padding: '10px 14px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <p style={{ fontWeight: '600', color: C.darkSlate, marginBottom: '6px', fontSize: '13px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: '12px', color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminOverview() {
  const navigate = useNavigate();
  const { registeredUsers, registerUser, announcements, postAnnouncement } = usePortal();
  const [showRegister, setShowRegister] = useState(false);
  const [regName,  setRegName]  = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole,  setRegRole]  = useState('Student');

  const totalStudents = 1248 + registeredUsers.filter(u => u.role === 'Student').length;
  const totalTeachers = 84   + registeredUsers.filter(u => u.role === 'Teacher').length;

  const metrics = [
    { label: 'Total Students',  value: totalStudents.toLocaleString(), change: '+12 this week', up: true,  icon: GraduationCap, iconBg: C.paleMint,   iconColor: C.forestGreen },
    { label: 'Total Teachers',  value: totalTeachers.toString(),       change: '+2 this month', up: true,  icon: BookOpen,      iconBg: '#E0F2FE',   iconColor: '#0369A1' },
    { label: 'Active Sessions', value: '347',                          change: 'Right now',     up: null,  icon: Activity,      iconBg: '#FCE7F3',   iconColor: '#9D174D' },
    { label: 'Active Courses',  value: '56',                           change: '4 new this term', up: true, icon: TrendingUp,   iconBg: '#FEF3C7',   iconColor: '#92400E' },
  ];

  const recentUsers = [
    { id: 1, name: 'Sophia Williams', role: 'Student', grade: '10-A',    joined: 'Mar 24, 2026', status: 'active' },
    { id: 2, name: 'Dr. Marcus Reed',  role: 'Teacher', grade: 'Physics', joined: 'Mar 23, 2026', status: 'active' },
    { id: 3, name: 'Ethan Parker',     role: 'Student', grade: '11-B',    joined: 'Mar 23, 2026', status: 'pending' },
    { id: 4, name: 'Isabella Chen',    role: 'Student', grade: '9-C',     joined: 'Mar 22, 2026', status: 'active' },
    { id: 5, name: 'Prof. Laura Kim',  role: 'Teacher', grade: 'Math',    joined: 'Mar 21, 2026', status: 'active' },
    ...registeredUsers.slice(0, 3).map((u, i) => ({
      id: 100 + i, name: u.name, role: u.role, grade: '—', joined: 'Just now', status: 'pending' as const,
    })),
  ];

  const handleRegister = () => {
    if (!regName.trim() || !regEmail.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    registerUser({ name: regName, role: regRole, email: regEmail });
    toast.success('User registered successfully!', {
      description: `${regName} has been added as a ${regRole}.`,
      duration: 4000,
    });
    setShowRegister(false);
    setRegName(''); setRegEmail(''); setRegRole('Student');
  };

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>Admin Dashboard</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>
            Tuesday, March 24, 2026 · Welcome back, Dr. Mitchell
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/admin/announcements')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: radius.md,
              background: C.offWhite, color: C.forestGreen,
              border: `1.5px solid ${C.lightMint}`, cursor: 'pointer',
              fontSize: '14px', fontWeight: '600', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.paleMint; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.offWhite; }}
          >
            <Megaphone size={16} /> Post Announcement
          </button>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: radius.md,
              background: C.forestGreen, color: 'white', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              boxShadow: `0px 4px 12px rgba(27,94,59,0.3)`, transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#154d30'; e.currentTarget.style.boxShadow = '0px 6px 16px rgba(27,94,59,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.forestGreen; e.currentTarget.style.boxShadow = '0px 4px 12px rgba(27,94,59,0.3)'; }}
          >
            <Plus size={16} /> Register New User
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginBottom: '24px' }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              style={{
                background: C.white, borderRadius: radius.lg, padding: '24px',
                boxShadow: shadow.card, border: `1px solid ${C.border}`,
                cursor: 'default', transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              whileHover={{ y: -2, boxShadow: '0px 8px 24px rgba(0,0,0,0.09)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: C.medGray, marginBottom: '6px' }}>{m.label}</p>
                  <p style={{ fontSize: '30px', fontWeight: '800', color: C.darkSlate, lineHeight: '1' }}>{m.value}</p>
                </div>
                <div style={{ width: '46px', height: '46px', borderRadius: radius.md, background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={m.iconColor} />
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                color: m.up === true ? C.success : m.up === false ? C.danger : C.medGray,
                background: m.up === true ? C.successBg : m.up === false ? C.dangerBg : C.offWhite,
                borderRadius: radius.sm, padding: '4px 10px',
              }}>
                {m.up === true && <TrendingUp size={12} />}
                {m.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '20px' }}>
        {/* Area Chart */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>New Registrations</h3>
              <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>Last 7 days · Students & Teachers</p>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
              borderRadius: radius.sm, border: `1px solid ${C.lightGray}`,
              background: C.offWhite, cursor: 'pointer', fontSize: '12px', color: C.medGray,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
              onMouseLeave={e => (e.currentTarget.style.background = C.offWhite)}
            >
              <Download size={13} /> Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollmentData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs key="defs">
                <linearGradient id="gradSt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.emerald} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0369A1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0369A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 12, fill: C.medGray }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 12, fill: C.medGray }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Legend key="legend" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Area key="area-students" type="monotone" dataKey="students" name="Students" stroke={C.emerald} strokeWidth={2.5} fill="url(#gradSt)" dot={{ r: 3, fill: C.emerald }} />
              <Area key="area-teachers" type="monotone" dataKey="teachers" name="Teachers"  stroke="#0369A1" strokeWidth={2.5} fill="url(#gradTc)" dot={{ r: 3, fill: '#0369A1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Recent Activity</h3>
            <span style={{ fontSize: '11px', color: C.emerald, fontWeight: '600', cursor: 'pointer' }}>View all</span>
          </div>
          {activityFeed.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.id} style={{
                display: 'flex', gap: '12px',
                paddingBottom: i < activityFeed.length - 1 ? '14px' : '0',
                marginBottom: i < activityFeed.length - 1 ? '14px' : '0',
                borderBottom: i < activityFeed.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: radius.sm, flexShrink: 0, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color={item.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12.5px', color: C.charcoal, lineHeight: '1.4', marginBottom: '2px' }}>{item.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} color={C.medGray} />
                    <span style={{ fontSize: '11px', color: C.medGray }}>{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Recently Registered Users</h3>
            <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>Latest additions to the system</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: radius.sm, border: `1px solid ${C.lightGray}`, background: C.offWhite, cursor: 'pointer', fontSize: '12px', color: C.medGray, transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
              onMouseLeave={e => (e.currentTarget.style.background = C.offWhite)}
            ><Filter size={13} /> Filter</button>
            <button
              onClick={() => navigate('/admin/users')}
              style={{ padding: '7px 14px', borderRadius: radius.sm, background: C.paleMint, color: C.forestGreen, border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.lightMint)}
              onMouseLeave={e => (e.currentTarget.style.background = C.paleMint)}
            >View All</button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {['Name', 'Role', 'Class / Dept.', 'Date Joined', 'Status', ''].map(col => (
                <th key={col} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: '700', color: C.medGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.slice(0, 7).map((user, i) => (
              <tr
                key={user.id}
                style={{ borderBottom: i < 6 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: radius.full, background: C.paleMint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: C.forestGreen }}>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: radius.full, fontSize: '11.5px', fontWeight: '600', background: user.role === 'Teacher' ? '#E0F2FE' : C.paleMint, color: user.role === 'Teacher' ? '#0369A1' : C.forestGreen }}>{user.role}</span>
                </td>
                <td style={{ padding: '14px 12px', fontSize: '13px', color: C.medGray }}>{user.grade}</td>
                <td style={{ padding: '14px 12px', fontSize: '13px', color: C.medGray }}>{user.joined}</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: radius.full, fontSize: '11.5px', fontWeight: '600', background: user.status === 'active' ? C.successBg : C.warningBg, color: user.status === 'active' ? C.success : C.warning }}>
                    {user.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, padding: '4px', borderRadius: radius.sm, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  ><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}
          onClick={() => setShowRegister(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22 }}
            style={{ background: C.white, borderRadius: radius.xl, padding: '32px', width: '460px', boxShadow: shadow.modal }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: C.darkSlate }}>Register New User</h2>
              <button onClick={() => setShowRegister(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, fontSize: '18px', lineHeight: 1, padding: '4px 6px', borderRadius: radius.sm }}
                onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >✕</button>
            </div>
            {[
              { label: 'Full Name',      value: regName,  set: setRegName,  placeholder: 'Enter full name',     type: 'text' },
              { label: 'Email Address',  value: regEmail, set: setRegEmail, placeholder: 'Enter email address', type: 'email' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.charcoal, marginBottom: '6px' }}>{f.label}</label>
                <input
                  type={f.type} value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '14px', color: C.charcoal, outline: 'none', background: C.offWhite, boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = C.emerald)}
                  onBlur={e  => (e.target.style.borderColor = C.lightGray)}
                />
              </div>
            ))}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.charcoal, marginBottom: '6px' }}>Role</label>
              <select value={regRole} onChange={e => setRegRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '14px', color: C.charcoal, outline: 'none', background: C.offWhite, boxSizing: 'border-box' }}>
                <option>Student</option><option>Teacher</option><option>Administrator</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowRegister(false)} style={{ flex: 1, padding: '11px', borderRadius: radius.md, border: `1.5px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', fontSize: '14px', color: C.medGray, fontWeight: '600', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >Cancel</button>
              <button onClick={handleRegister} style={{ flex: 1, padding: '11px', borderRadius: radius.md, border: 'none', background: C.forestGreen, color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#154d30')}
                onMouseLeave={e => (e.currentTarget.style.background = C.forestGreen)}
              >Create Account</button>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}