import React from 'react';
import {
  BookOpen, ClipboardList, CheckSquare, CalendarDays,
  Users, Clock, TrendingUp, AlertCircle, ChevronRight,
  Star, Award,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import { C, shadow, radius } from '../components/theme';

const navItems: NavItem[] = [
  { icon: BookOpen,      label: 'My Classes',      path: '/teacher' },
  { icon: ClipboardList, label: 'Grading System',  path: '/teacher/grades', badge: 12 },
  { icon: CheckSquare,   label: 'Attendance',       path: '/teacher/attendance' },
  { icon: CalendarDays,  label: 'Schedule',         path: '/teacher/schedule' },
];

const todaysClasses = [
  { id: 1, subject: 'Advanced Calculus',  grade: 'Grade 11 – Section A', time: '08:30 – 09:45', room: 'Room 204', students: 28, color: C.forestGreen, light: C.paleMint },
  { id: 2, subject: 'Linear Algebra',    grade: 'Grade 10 – Section B', time: '11:00 – 12:15', room: 'Room 108', students: 31, color: '#0369A1', light: '#E0F2FE' },
  { id: 3, subject: 'Statistics 101',    grade: 'Grade 9 – Section C',  time: '14:00 – 15:15', room: 'Lab 03',   students: 25, color: '#7C3AED', light: '#F3E8FF' },
];

const attendanceData = [
  { class: 'Calc 11A', rate: 93, students: 28 },
  { class: 'Algebra 10B', rate: 86, students: 31 },
  { class: 'Stats 9C', rate: 91, students: 25 },
  { class: 'Math 8D', rate: 78, students: 29 },
];

const pendingAssignments = [
  { id: 1, title: 'Calculus – Integration by Parts',   class: 'Grade 11-A', submitted: 24, total: 28, due: 'Mar 24', urgent: true },
  { id: 2, title: 'Linear Algebra – Matrix Operations', class: 'Grade 10-B', submitted: 18, total: 31, due: 'Mar 25', urgent: false },
  { id: 3, title: 'Statistics – Probability Problems',  class: 'Grade 9-C',  submitted: 21, total: 25, due: 'Mar 26', urgent: false },
  { id: 4, title: 'Calculus – Midterm Exam',           class: 'Grade 11-A', submitted: 28, total: 28, due: 'Mar 27', urgent: false },
];

const scheduleTimeline = [
  { time: '08:30', label: 'Advanced Calculus', room: 'Room 204', done: true },
  { time: '09:45', label: 'Break',             room: '',         done: true },
  { time: '11:00', label: 'Linear Algebra',    room: 'Room 108', done: false, active: true },
  { time: '12:15', label: 'Lunch Break',       room: '',         done: false },
  { time: '14:00', label: 'Statistics 101',    room: 'Lab 03',   done: false },
  { time: '15:15', label: 'Office Hours',      room: 'Office 2', done: false },
];

const getBarColor = (rate: number) => {
  if (rate >= 90) return C.emerald;
  if (rate >= 80) return C.warning;
  return C.danger;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: C.white, borderRadius: radius.md, padding: '10px 14px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <p style={{ fontWeight: '600', color: C.darkSlate, fontSize: '13px', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: C.medGray }}>Attendance: <strong style={{ color: C.forestGreen }}>{payload[0].value}%</strong></p>
      </div>
    );
  }
  return null;
};

export default function TeacherDashboard() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = 'Tuesday, March 24, 2026';

  return (
    <DashboardLayout
      role="teacher"
      navItems={navItems}
      userName="Prof. James Wilson"
      userTitle="Mathematics Dept."
      notificationCount={2}
    >
      {/* Welcome Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.forestGreen} 0%, ${C.emerald} 100%)`,
        borderRadius: radius.lg, padding: '28px 32px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: `0px 8px 24px rgba(27,94,59,0.25)`, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '40px', top: '-60px', width: '160px', height: '160px', border: '2px solid rgba(255,255,255,0.07)', borderRadius: '50%' }} />

        <div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '6px' }}>{dateStr} · {timeStr}</p>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>
            Welcome back, Professor Wilson 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
            You have <strong style={{ color: 'white' }}>3 classes</strong> today and <strong style={{ color: 'white' }}>12 assignments</strong> pending review.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Today's Classes", value: '3', icon: BookOpen },
            { label: 'Pending Grades', value: '12', icon: ClipboardList },
            { label: 'Avg Attendance', value: '87%', icon: TrendingUp },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: radius.md,
                padding: '14px 18px', textAlign: 'center', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <Icon size={18} color="rgba(255,255,255,0.8)" style={{ margin: '0 auto 6px' }} />
                <p style={{ color: 'white', fontSize: '22px', fontWeight: '700', lineHeight: '1' }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Classes */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: C.darkSlate, marginBottom: '14px' }}>
          Today's Classes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {todaysClasses.map(cls => (
            <div key={cls.id} style={{
              background: C.white, borderRadius: radius.lg, padding: '20px',
              boxShadow: shadow.card, border: `1px solid ${C.border}`,
              borderTop: `4px solid ${cls.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  background: cls.light, borderRadius: radius.sm,
                  padding: '6px 10px',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: cls.color }}>{cls.room}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} color={C.medGray} />
                  <span style={{ fontSize: '12px', color: C.medGray }}>{cls.students}</span>
                </div>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: C.darkSlate, margin: '0 0 4px' }}>{cls.subject}</h3>
              <p style={{ fontSize: '12px', color: C.medGray, margin: '0 0 14px' }}>{cls.grade}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.offWhite, borderRadius: radius.sm, padding: '8px 10px' }}>
                <Clock size={13} color={cls.color} />
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: C.charcoal }}>{cls.time}</span>
              </div>
              <button style={{
                marginTop: '12px', width: '100%', padding: '8px', borderRadius: radius.sm,
                background: cls.light, color: cls.color, border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                Take Attendance <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: '20px' }}>

        {/* Attendance BarChart */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Class Attendance Rates</h3>
            <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>Current term average by class</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="class" tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" radius={[5, 5, 0, 0]}>
                {attendanceData.map((entry, i) => (
                  <Cell key={`bar-${entry.class}-${i}`} fill={getBarColor(entry.rate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            {[{ color: C.emerald, label: '≥ 90% Excellent' }, { color: C.warning, label: '80–89% Good' }, { color: C.danger, label: '< 80% Needs Attention' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: '10.5px', color: C.medGray }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Pending Grading</h3>
              <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>Assignments awaiting review</p>
            </div>
            <span style={{
              background: C.warningBg, color: C.warning, borderRadius: radius.full,
              fontSize: '12px', fontWeight: '700', padding: '3px 10px',
            }}>12 pending</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingAssignments.map(a => {
              const pct = Math.round((a.submitted / a.total) * 100);
              return (
                <div key={a.id} style={{
                  padding: '12px 14px', borderRadius: radius.md,
                  background: a.urgent ? C.warningBg : C.offWhite,
                  border: `1px solid ${a.urgent ? '#FDE68A' : C.border}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                      <p style={{ fontSize: '11px', color: C.medGray, marginTop: '2px' }}>{a.class}</p>
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      {a.urgent && <AlertCircle size={13} color={C.warning} />}
                      <span style={{ fontSize: '10.5px', color: C.medGray }}>Due {a.due}</span>
                    </div>
                  </div>
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '5px', background: C.lightGray, borderRadius: radius.full }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? C.success : C.emerald, borderRadius: radius.full }} />
                    </div>
                    <span style={{ fontSize: '10.5px', color: C.medGray, flexShrink: 0 }}>{a.submitted}/{a.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Timeline */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 18px' }}>Today's Timeline</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '19px', top: '8px', bottom: '8px', width: '1px', background: C.border }} />
            {scheduleTimeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < scheduleTimeline.length - 1 ? '16px' : '0', position: 'relative' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: radius.full, flexShrink: 0,
                  background: item.active ? C.forestGreen : item.done ? C.paleMint : C.offWhite,
                  border: `2px solid ${item.active ? C.forestGreen : item.done ? C.lightMint : C.lightGray}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                }}>
                  {item.done
                    ? <Award size={15} color={C.emerald} />
                    : item.active
                    ? <Clock size={15} color="white" />
                    : <Clock size={15} color={C.medGray} />
                  }
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <p style={{ fontSize: '11px', color: C.medGray, margin: 0 }}>{item.time}</p>
                  <p style={{ fontSize: '13px', fontWeight: item.active ? '700' : '500', color: item.active ? C.forestGreen : item.done ? C.medGray : C.charcoal, margin: '2px 0 0' }}>{item.label}</p>
                  {item.room && <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>{item.room}</p>}
                </div>
                {item.active && (
                  <span style={{
                    position: 'absolute', right: 0, top: '8px',
                    background: C.paleMint, color: C.forestGreen, borderRadius: radius.full,
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                  }}>NOW</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}