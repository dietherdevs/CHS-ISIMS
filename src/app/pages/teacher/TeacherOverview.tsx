import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BookOpen, ClipboardList, TrendingUp, AlertCircle, ChevronRight, Clock, Award, Users, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { motion } from 'motion/react';
import { usePortal, isAnnouncementForTeachers } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const todaysClasses = [
  { id: 1, subject: 'Advanced Calculus', grade: 'Grade 11 – Section A', time: '08:30 – 09:45', room: 'Room 204', students: 28, color: C.forestGreen, light: C.paleMint },
  { id: 2, subject: 'Linear Algebra',    grade: 'Grade 10 – Section B', time: '11:00 – 12:15', room: 'Room 108', students: 31, color: '#0369A1', light: '#E0F2FE' },
  { id: 3, subject: 'Statistics 101',    grade: 'Grade 9 – Section C',  time: '14:00 – 15:15', room: 'Lab 03',   students: 25, color: '#7C3AED', light: '#F3E8FF' },
];

const attendanceData = [
  { class: 'Calc 11A', rate: 93, students: 28 },
  { class: 'Alg 10B',  rate: 86, students: 31 },
  { class: 'Stats 9C', rate: 91, students: 25 },
  { class: 'Math 8D',  rate: 78, students: 29 },
];

const pendingAssignments = [
  { id: 1, title: 'Calculus – Integration by Parts',    class: 'Grade 11-A', submitted: 24, total: 28, due: 'Mar 24', urgent: true },
  { id: 2, title: 'Linear Algebra – Matrix Operations', class: 'Grade 10-B', submitted: 18, total: 31, due: 'Mar 25', urgent: false },
  { id: 3, title: 'Statistics – Probability Problems',  class: 'Grade 9-C',  submitted: 21, total: 25, due: 'Mar 26', urgent: false },
  { id: 4, title: 'Calculus – Midterm Exam',            class: 'Grade 11-A', submitted: 28, total: 28, due: 'Mar 27', urgent: false },
];

const scheduleTimeline = [
  { time: '08:30', label: 'Advanced Calculus', room: 'Room 204', done: true },
  { time: '09:45', label: 'Break',             room: '',         done: true },
  { time: '11:00', label: 'Linear Algebra',    room: 'Room 108', done: false, active: true },
  { time: '12:15', label: 'Lunch Break',       room: '',         done: false },
  { time: '14:00', label: 'Statistics 101',    room: 'Lab 03',   done: false },
  { time: '15:15', label: 'Office Hours',      room: 'Office 2', done: false },
];

const getBarColor = (rate: number) => rate >= 90 ? C.emerald : rate >= 80 ? C.warning : C.danger;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.white, borderRadius: radius.md, padding: '10px 14px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <p style={{ fontWeight: '600', color: C.darkSlate, fontSize: '13px', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: C.medGray }}>Attendance: <strong style={{ color: C.forestGreen }}>{payload[0].value}%</strong></p>
      </div>
    );
  }
  return null;
};

export default function TeacherOverview() {
  const navigate = useNavigate();
  const { gradesSubmitted, announcements } = usePortal();
  const [dismissedAnn, setDismissedAnn] = useState<number[]>([]);

  const visibleAnn = announcements
    .filter(a => isAnnouncementForTeachers(a.audience) && !dismissedAnn.includes(a.id))
    .slice(0, 2);

  return (
    <PageTransition>
      {/* ── Admin Announcement Banners ── */}
      {visibleAnn.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {visibleAnn.map(ann => {
            const priorityColors = {
              high:   { gradient: `linear-gradient(135deg, #991B1B, #DC2626)`, icon: '🚨' },
              medium: { gradient: `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`, icon: '📢' },
              low:    { gradient: `linear-gradient(135deg, ${C.emerald}, ${C.mediumGreen})`, icon: '📌' },
            };
            const pc = priorityColors[ann.priority];
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26 }}
              >
                <div style={{
                  background: pc.gradient, borderRadius: radius.md, padding: '14px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: `0px 4px 14px rgba(27,94,59,0.2)`,
                }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: radius.sm, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                    {pc.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', margin: '0 0 2px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                      Administration · {ann.audience}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 2px' }}>
                      <p style={{ color: 'white', fontSize: '14px', fontWeight: '700', margin: 0 }}>{ann.title}</p>
                      {ann.editedAt && (
                        <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: radius.full, fontSize: '9px', fontWeight: '700', padding: '2px 7px', letterSpacing: '0.4px', flexShrink: 0 }}>UPDATED</span>
                      )}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12.5px', margin: 0, lineHeight: '1.4' }}>{ann.content}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: '5px 0 0' }}>
                      {ann.editedAt ? `Edited ${ann.editedAt}` : ann.postedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => setDismissedAnn(d => [...d, ann.id])}
                    style={{ background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', color: 'white', padding: '5px', borderRadius: radius.sm, display: 'flex', transition: 'background 0.15s', flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Welcome Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.forestGreen} 0%, ${C.emerald} 100%)`,
        borderRadius: radius.lg, padding: '28px 32px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: `0px 8px 24px rgba(27,94,59,0.25)`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '6px' }}>Tuesday, March 24, 2026</p>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Welcome back, Professor Wilson 👋</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
            You have <strong style={{ color: 'white' }}>3 classes</strong> today.
            {!gradesSubmitted
              ? <> <strong style={{ color: '#FDE68A' }}>12 assignments</strong> pending review.</>
              : <> <strong style={{ color: '#A7F3D0' }}>Grades submitted ✓</strong> — Students notified.</>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Today's Classes", value: '3',    icon: BookOpen },
            { label: 'Pending Grades',  value: gradesSubmitted ? '0' : '12', icon: ClipboardList },
            { label: 'Avg Attendance',  value: '87%',  icon: TrendingUp },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: radius.md, padding: '14px 18px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Icon size={18} color="rgba(255,255,255,0.8)" />
                <p style={{ color: 'white', fontSize: '22px', fontWeight: '700', lineHeight: '1.2', margin: '6px 0 0' }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '4px 0 0' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Classes */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: C.darkSlate, marginBottom: '14px' }}>Today's Classes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {todaysClasses.map(cls => (
          <div key={cls.id} style={{
            background: C.white, borderRadius: radius.lg, padding: '20px',
            boxShadow: shadow.card, border: `1px solid ${C.border}`,
            borderTop: `4px solid ${cls.color}`, cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.card; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ background: cls.light, borderRadius: radius.sm, padding: '5px 10px' }}>
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
            <button
              onClick={() => navigate('/teacher/attendance')}
              style={{ marginTop: '12px', width: '100%', padding: '8px', borderRadius: radius.sm, background: cls.light, color: cls.color, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Take Attendance <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: '20px' }}>
        {/* Attendance Chart */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 4px' }}>Class Attendance Rates</h3>
          <p style={{ fontSize: '12px', color: C.medGray, margin: '0 0 20px' }}>Current term average by class</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis key="xaxis" dataKey="class" tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" domain={[60, 100]} tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Bar key="bar-rate" dataKey="rate" radius={[5, 5, 0, 0]}>
                {attendanceData.map((e, i) => <Cell key={`bar-${e.class}-${i}`} fill={getBarColor(e.rate)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[{ color: C.emerald, label: '≥ 90%' }, { color: C.warning, label: '80–89%' }, { color: C.danger, label: '< 80%' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color }} />
                <span style={{ fontSize: '10.5px', color: C.medGray }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grading */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Pending Grading</h3>
              <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>Assignments awaiting review</p>
            </div>
            {!gradesSubmitted
              ? <span style={{ background: C.warningBg, color: C.warning, borderRadius: radius.full, fontSize: '12px', fontWeight: '700', padding: '3px 10px' }}>12 pending</span>
              : <span style={{ background: C.successBg, color: C.success, borderRadius: radius.full, fontSize: '12px', fontWeight: '700', padding: '3px 10px' }}>✓ Submitted</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingAssignments.map(a => {
              const pct = Math.round((a.submitted / a.total) * 100);
              return (
                <div key={a.id} style={{ padding: '12px 14px', borderRadius: radius.md, background: a.urgent ? C.warningBg : C.offWhite, border: `1px solid ${a.urgent ? '#FDE68A' : C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                      <p style={{ fontSize: '11px', color: C.medGray, marginTop: '2px' }}>{a.class}</p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      {a.urgent && <AlertCircle size={13} color={C.warning} />}
                      <span style={{ display: 'block', fontSize: '10.5px', color: C.medGray }}>Due {a.due}</span>
                    </div>
                  </div>
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
          <button
            onClick={() => navigate('/teacher/grades')}
            style={{ marginTop: '14px', width: '100%', padding: '10px', borderRadius: radius.md, background: C.forestGreen, color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.18s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#154d30')}
            onMouseLeave={e => (e.currentTarget.style.background = C.forestGreen)}
          >
            Open Grading System →
          </button>
        </div>

        {/* Timeline */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 18px' }}>Today's Timeline</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '8px', bottom: '8px', width: '1.5px', background: C.border }} />
            {scheduleTimeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < scheduleTimeline.length - 1 ? '16px' : '0', position: 'relative' }}>
                <div style={{
                  width: '29px', height: '29px', borderRadius: radius.full, flexShrink: 0,
                  background: item.active ? C.forestGreen : item.done ? C.lightMint : C.offWhite,
                  border: `2px solid ${item.active ? C.forestGreen : item.done ? C.mediumGreen : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                }}>
                  {item.done ? <Award size={13} color={C.emerald} /> : item.active ? <Clock size={13} color="white" /> : <Clock size={13} color={C.medGray} />}
                </div>
                <div style={{ paddingTop: '4px', flex: 1 }}>
                  <p style={{ fontSize: '10.5px', color: C.medGray, margin: 0 }}>{item.time}</p>
                  <p style={{ fontSize: '13px', fontWeight: item.active ? '700' : '500', color: item.active ? C.forestGreen : item.done ? C.medGray : C.charcoal, margin: '2px 0 0' }}>{item.label}</p>
                  {item.room && <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>{item.room}</p>}
                </div>
                {item.active && (
                  <span style={{ position: 'absolute', right: 0, top: '6px', background: C.paleMint, color: C.forestGreen, borderRadius: radius.full, fontSize: '9px', fontWeight: '800', padding: '2px 7px' }}>NOW</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}