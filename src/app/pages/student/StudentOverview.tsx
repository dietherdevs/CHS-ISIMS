import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BookMarked, Award, ClipboardList, CalendarDays,
  Clock, AlertTriangle, CheckCircle, ChevronRight,
  Star, Flame, Target, Megaphone, X,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { isAnnouncementForStudents } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const deadlines = [
  { id: 1, title: 'Math – Integration Problem Set',  subject: 'Mathematics',        due: 'Today, 11:59 PM',   status: 'urgent' as const },
  { id: 2, title: 'Physics Lab Report – Optics',     subject: 'Physics',            due: 'Tomorrow, 9:00 AM', status: 'warning' as const },
  { id: 3, title: 'English Essay – Shakespeare',     subject: 'English Literature', due: 'Mar 26, 11:59 PM',  status: 'normal' as const },
  { id: 4, title: 'History Research Paper',          subject: 'World History',      due: 'Mar 28, 11:59 PM',  status: 'normal' as const },
];

const dlColors = {
  urgent:  { bg: C.dangerBg,  border: '#FCA5A5', text: C.danger,  icon: AlertTriangle },
  warning: { bg: C.warningBg, border: '#FDE68A', text: C.warning, icon: Clock },
  normal:  { bg: C.offWhite,  border: C.border,  text: C.medGray, icon: Clock },
};

const schedule = [
  { time: '08:00', subject: 'Mathematics',       room: 'Room 204', done: true,  teacher: 'Prof. Wilson' },
  { time: '09:30', subject: 'Computer Science',  room: 'Lab 01',   done: true,  teacher: 'Dr. Patel' },
  { time: '11:00', subject: 'Physics',           room: 'Room 105', done: false, active: true, teacher: 'Dr. Reed' },
  { time: '12:30', subject: 'Lunch Break',       room: '',         done: false, break: true },
  { time: '13:30', subject: 'English Literature', room: 'Room 301', done: false, teacher: 'Ms. Thompson' },
  { time: '15:00', subject: 'Biology',           room: 'Lab 02',   done: false, teacher: 'Ms. Park' },
];

function GPARing({ gpa = 3.7, maxGpa = 4.0 }) {
  const pct  = (gpa / maxGpa) * 100;
  const size = 154, stroke = 13;
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.paleMint} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.forestGreen} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '28px', fontWeight: '800', color: C.forestGreen, lineHeight: '1' }}>{gpa}</span>
        <span style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>GPA</span>
        <span style={{ fontSize: '10px', color: C.lightMint, marginTop: '1px' }}>/ {maxGpa}</span>
      </div>
    </div>
  );
}

export default function StudentOverview() {
  const navigate = useNavigate();
  const { announcements, studentGrades, gradesSubmitted } = usePortal();
  const [dismissedAnn, setDismissedAnn] = useState<number[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(null);

  const subjects = Object.values(studentGrades).map((g, i) => {
    const colors = [
      { color: C.forestGreen, light: C.paleMint },
      { color: '#0369A1', light: '#E0F2FE' },
      { color: '#7C3AED', light: '#F3E8FF' },
      { color: '#92400E', light: '#FEF3C7' },
      { color: '#065F46', light: '#ECFDF5' },
      { color: '#9D174D', light: '#FCE7F3' },
    ];
    return { ...g, ...colors[i % colors.length] };
  });

  const radarData = subjects.map(s => ({ subject: s.subject.slice(0, 4), score: s.score }));

  // Only show announcements targeted at students, not dismissed ones
  const visibleAnn = announcements
    .filter(a => isAnnouncementForStudents(a.audience) && !dismissedAnn.includes(a.id))
    .slice(0, 2);

  return (
    <PageTransition>
      {/* Announcement Banners (cross-role sync from Admin) */}
      <AnimatePresence>
        {visibleAnn.map(ann => {
          const priorityColors = {
            high:   { gradient: `linear-gradient(135deg, #991B1B, #DC2626)`,   icon: '🚨' },
            medium: { gradient: `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`, icon: '📢' },
            low:    { gradient: `linear-gradient(135deg, ${C.emerald}, ${C.mediumGreen})`, icon: '📌' },
          };
          const pc = priorityColors[ann.priority];
          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: -16, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.28 }}
              style={{ marginBottom: '12px', overflow: 'hidden' }}
            >
              <div style={{
                background: pc.gradient,
                borderRadius: radius.md, padding: '14px 20px',
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                boxShadow: `0px 4px 12px rgba(27,94,59,0.2)`,
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: radius.sm, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                  {pc.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', margin: '0 0 2px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                    Administration Announcement · {ann.audience}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 2px' }}>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '700', margin: 0 }}>{ann.title}</p>
                    {ann.editedAt && (
                      <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: radius.full, fontSize: '9px', fontWeight: '700', padding: '2px 7px', letterSpacing: '0.4px', flexShrink: 0 }}>UPDATED</span>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12.5px', margin: 0, lineHeight: '1.4' }}>{ann.content}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', margin: '5px 0 0' }}>
                    {ann.editedAt ? `Edited ${ann.editedAt}` : ann.postedAt}
                  </p>
                </div>
                <button
                  onClick={() => setDismissedAnn(d => [...d, ann.id])}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', padding: '5px', borderRadius: radius.sm, display: 'flex', transition: 'background 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Grade Updated Banner (cross-role sync from Teacher) */}
      <AnimatePresence>
        {gradesSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '16px' }}
          >
            <div style={{ background: C.successBg, border: `1px solid #A7F3D0`, borderRadius: radius.md, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={16} color={C.success} />
              <p style={{ fontSize: '13.5px', color: C.success, margin: 0, fontWeight: '600' }}>
                🎉 Prof. Wilson just submitted your Math grade! Check your updated scores in{' '}
                <button onClick={() => navigate('/student/grades')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.forestGreen, fontWeight: '700', textDecoration: 'underline', fontSize: '13.5px', padding: 0 }}>Grades →</button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '24px', alignItems: 'stretch' }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald} 60%, ${C.mediumGreen})`,
          borderRadius: radius.lg, padding: '28px 32px',
          boxShadow: `0px 8px 24px rgba(27,94,59,0.25)`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', width: '180px', height: '180px', border: '2px solid rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '8px' }}>Tuesday, March 24, 2026</p>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 10px' }}>Hello, Emma! 👋</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0 0 20px' }}>
            You have <strong style={{ color: 'white' }}>2 assignments</strong> due today and <strong style={{ color: 'white' }}>Physics</strong> class in 45 minutes.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Streak',       value: '14 days', icon: Flame },
              { label: 'Rank in Class', value: '#3',     icon: Star },
              { label: 'Completed',    value: '87%',     icon: Target },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: radius.md, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon size={15} color="rgba(255,255,255,0.85)" />
                  <div>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '700', margin: 0 }}>{stat.value}</p>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', margin: '2px 0 0' }}>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GPA Ring */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px 28px', boxShadow: shadow.card, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '200px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: C.medGray, marginBottom: '12px' }}>Academic Standing</p>
          <GPARing gpa={3.7} maxGpa={4.0} />
          <span style={{ marginTop: '14px', background: C.paleMint, color: C.forestGreen, borderRadius: radius.full, fontSize: '12px', fontWeight: '700', padding: '4px 14px' }}>
            High Honors ✓
          </span>
          <div style={{ display: 'flex', gap: '20px', marginTop: '14px' }}>
            {[{ l: 'Credits', v: '28' }, { l: 'Rank', v: '#3/31' }].map(i => (
              <div key={i.l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>{i.v}</p>
                <p style={{ fontSize: '11px', color: C.medGray, marginTop: '2px' }}>{i.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 280px', gap: '20px' }}>
        {/* Subjects */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>My Subjects</h3>
            <button onClick={() => navigate('/student/grades')} style={{ fontSize: '12px', color: C.emerald, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.forestGreen)}
              onMouseLeave={e => (e.currentTarget.style.color = C.emerald)}
            >View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subjects.map((sub, i) => (
              <div
                key={i}
                onClick={() => setActiveSubject(activeSubject === i ? null : i)}
                style={{
                  padding: '14px 16px', borderRadius: radius.md,
                  background: activeSubject === i ? C.paleGreen : C.offWhite,
                  border: `1px solid ${activeSubject === i ? C.lightMint : C.border}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: radius.sm, flexShrink: 0, background: sub.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: sub.color }}>{sub.grade}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>{sub.subject}</p>
                        {sub.recentlyUpdated && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ background: C.paleMint, color: C.forestGreen, borderRadius: radius.full, fontSize: '9px', fontWeight: '700', padding: '2px 6px' }}
                          >UPDATED</motion.span>
                        )}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: sub.color }}>{sub.score}%</span>
                    </div>
                    <div style={{ height: '5px', background: C.lightGray, borderRadius: radius.full }}>
                      <div style={{ width: `${sub.score}%`, height: '100%', background: sub.color, borderRadius: radius.full }} />
                    </div>
                    {activeSubject === i && (
                      <p style={{ fontSize: '11px', color: C.medGray, marginTop: '6px' }}>Instructor: {sub.teacher}</p>
                    )}
                  </div>
                  <ChevronRight size={14} color={C.medGray} style={{ flexShrink: 0, transform: activeSubject === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Upcoming Deadlines</h3>
            <span style={{ background: C.dangerBg, color: C.danger, borderRadius: radius.full, fontSize: '11px', fontWeight: '700', padding: '3px 9px' }}>4 due</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deadlines.map(dl => {
              const cfg = dlColors[dl.status];
              const Icon = cfg.icon;
              return (
                <div key={dl.id} style={{ padding: '14px', borderRadius: radius.md, background: cfg.bg, border: `1px solid ${cfg.border}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Icon size={15} color={cfg.text} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, margin: '0 0 3px', lineHeight: '1.3' }}>{dl.title}</p>
                      <p style={{ fontSize: '11px', color: C.medGray, margin: '0 0 6px' }}>{dl.subject}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} color={cfg.text} />
                        <span style={{ fontSize: '11px', color: cfg.text, fontWeight: '600' }}>{dl.due}</span>
                      </div>
                    </div>
                  </div>
                  {dl.status === 'urgent' && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                      <button style={{ flex: 1, padding: '6px', borderRadius: radius.sm, background: C.danger, color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', transition: 'opacity 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        onClick={() => navigate('/student/assignments')}
                      >Submit Now</button>
                      <button style={{ padding: '6px 10px', borderRadius: radius.sm, background: 'none', color: C.danger, border: `1px solid ${C.danger}`, cursor: 'pointer', fontSize: '11px', fontWeight: '600', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.dangerBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >View</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule + Radar */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 18px' }}>Today's Schedule</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '8px', bottom: '8px', width: '1.5px', background: C.border }} />
            {schedule.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < schedule.length - 1 ? '14px' : '0', position: 'relative' }}>
                <div style={{
                  width: '29px', height: '29px', borderRadius: radius.full, flexShrink: 0,
                  background: item.active ? C.forestGreen : item.done ? C.lightMint : C.offWhite,
                  border: `2px solid ${item.active ? C.forestGreen : item.done ? C.mediumGreen : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                }}>
                  {item.done ? <CheckCircle size={13} color={C.emerald} /> : item.active ? <Clock size={13} color="white" /> : item.break ? <span style={{ fontSize: '10px' }}>☕</span> : <Clock size={13} color={C.medGray} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10.5px', color: C.medGray, margin: 0 }}>{item.time}</p>
                  <p style={{ fontSize: '13px', fontWeight: item.active ? '700' : item.done ? '400' : '600', color: item.active ? C.forestGreen : item.done ? C.medGray : C.charcoal, margin: '2px 0 0' }}>{item.subject}</p>
                  {item.room && <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>{item.room}</p>}
                </div>
                {item.active && <span style={{ position: 'absolute', right: 0, top: '4px', background: C.paleMint, color: C.forestGreen, borderRadius: radius.full, fontSize: '9px', fontWeight: '800', padding: '2px 7px' }}>LIVE</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, marginBottom: '10px' }}>Performance Radar</p>
            <ResponsiveContainer width="100%" height={140}>
              <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <PolarGrid key="polar-grid" stroke={C.border} />
                <PolarAngleAxis key="polar-axis" dataKey="subject" tick={{ fontSize: 10, fill: C.medGray }} />
                <Radar key="radar-score" dataKey="score" stroke={C.emerald} fill={C.emerald} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip key="tooltip" formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}