import React, { useState } from 'react';
import {
  BookMarked, Award, ClipboardList, CalendarDays,
  Clock, AlertTriangle, CheckCircle, ChevronRight,
  Star, Flame, Target,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { DashboardLayout, NavItem } from '../components/DashboardLayout';
import { C, shadow, radius } from '../components/theme';

const navItems: NavItem[] = [
  { icon: BookMarked,    label: 'My Subjects',  path: '/student' },
  { icon: Award,         label: 'Grades',        path: '/student/grades' },
  { icon: ClipboardList, label: 'Assignments',   path: '/student/assignments', badge: 4 },
  { icon: CalendarDays,  label: 'Schedule',      path: '/student/schedule' },
];

const subjects = [
  { name: 'Mathematics',       teacher: 'Prof. Wilson',  grade: 'A',  score: 94, color: C.forestGreen, light: C.paleMint },
  { name: 'Physics',           teacher: 'Dr. Reed',      grade: 'A−', score: 88, color: '#0369A1', light: '#E0F2FE' },
  { name: 'English Literature', teacher: 'Ms. Thompson', grade: 'B+', score: 85, color: '#7C3AED', light: '#F3E8FF' },
  { name: 'World History',     teacher: 'Mr. Garcia',   grade: 'B',  score: 81, color: '#92400E', light: '#FEF3C7' },
  { name: 'Computer Science',  teacher: 'Dr. Patel',    grade: 'A+', score: 97, color: '#065F46', light: '#ECFDF5' },
  { name: 'Biology',           teacher: 'Ms. Park',     grade: 'A−', score: 89, color: '#9D174D', light: '#FCE7F3' },
];

const deadlines = [
  { id: 1, title: 'Math – Integration Problem Set',    subject: 'Mathematics',        due: 'Today, 11:59 PM',   status: 'urgent', icon: AlertTriangle },
  { id: 2, title: 'Physics Lab Report – Optics',       subject: 'Physics',            due: 'Tomorrow, 9:00 AM', status: 'warning', icon: Clock },
  { id: 3, title: 'English Essay – Shakespeare',       subject: 'English Literature', due: 'Mar 26, 11:59 PM',  status: 'normal', icon: Clock },
  { id: 4, title: 'History Research Paper',            subject: 'World History',      due: 'Mar 28, 11:59 PM',  status: 'normal', icon: Clock },
];

const schedule = [
  { time: '08:00', subject: 'Mathematics',       room: 'Room 204', done: true, teacher: 'Prof. Wilson' },
  { time: '09:30', subject: 'Computer Science',  room: 'Lab 01',   done: true, teacher: 'Dr. Patel' },
  { time: '11:00', subject: 'Physics',           room: 'Room 105', done: false, active: true, teacher: 'Dr. Reed' },
  { time: '12:30', subject: 'Lunch Break',       room: '',         done: false, break: true },
  { time: '13:30', subject: 'English Literature', room: 'Room 301', done: false, teacher: 'Ms. Thompson' },
  { time: '15:00', subject: 'Biology',           room: 'Lab 02',   done: false, teacher: 'Ms. Park' },
];

const radarData = [
  { subject: 'Math',    score: 94 },
  { subject: 'Physics', score: 88 },
  { subject: 'English', score: 85 },
  { subject: 'History', score: 81 },
  { subject: 'CS',      score: 97 },
  { subject: 'Biology', score: 89 },
];

const deadlineColors = {
  urgent:  { bg: C.dangerBg,  border: '#FCA5A5', text: C.danger,  iconColor: C.danger },
  warning: { bg: C.warningBg, border: '#FDE68A', text: C.warning, iconColor: C.warning },
  normal:  { bg: C.offWhite,  border: C.border,  text: C.medGray, iconColor: C.medGray },
};

function GPARing({ gpa = 3.7, maxGpa = 4.0 }) {
  const pct = (gpa / maxGpa) * 100;
  const size = 154;
  const stroke = 13;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.paleMint} strokeWidth={stroke} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={C.forestGreen} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '28px', fontWeight: '800', color: C.forestGreen, lineHeight: '1' }}>{gpa}</span>
        <span style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>GPA</span>
        <span style={{ fontSize: '10px', color: C.lightMint, marginTop: '1px' }}>/ {maxGpa}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ flex: 1, height: '6px', background: C.lightGray, borderRadius: radius.full }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: radius.full, transition: 'width 0.6s ease' }} />
    </div>
  );
}

export default function StudentDashboard() {
  const [activeSubject, setActiveSubject] = useState<number | null>(null);

  return (
    <DashboardLayout
      role="student"
      navItems={navItems}
      userName="Emma Johnson"
      userTitle="Grade 11 – Section A"
      notificationCount={4}
    >
      {/* Welcome Row */}
      <div className="student-welcome-grid">

        {/* Welcome Card */}
        <div style={{
          background: `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald} 60%, ${C.mediumGreen})`,
          borderRadius: radius.lg, padding: '28px 32px',
          boxShadow: `0px 8px 24px rgba(27,94,59,0.25)`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', width: '180px', height: '180px', border: '2px solid rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: '60px', bottom: '-50px', width: '130px', height: '130px', border: '2px solid rgba(255,255,255,0.06)', borderRadius: '50%' }} />

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '8px' }}>
            Tuesday, March 24, 2026
          </p>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 10px' }}>
            Hello, Emma! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0 0 20px' }}>
            You have <strong style={{ color: 'white' }}>2 assignments</strong> due today and <strong style={{ color: 'white' }}>Physics</strong> class in 45 minutes.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Streak',         value: '14 days', icon: Flame },
              { label: 'Rank in Class',  value: '#3',      icon: Star },
              { label: 'Completed',      value: '87%',     icon: Target },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{
                  background: 'rgba(255,255,255,0.15)', borderRadius: radius.md,
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Icon size={15} color="rgba(255,255,255,0.85)" />
                  <div>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '700', margin: 0, lineHeight: '1' }}>{stat.value}</p>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', margin: '2px 0 0' }}>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GPA Ring Card */}
        <div style={{
          background: C.white, borderRadius: radius.lg, padding: '24px 28px',
          boxShadow: shadow.card, border: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minWidth: '200px',
        }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: C.medGray, marginBottom: '12px' }}>Academic Standing</p>
          <GPARing gpa={3.7} maxGpa={4.0} />
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <span style={{
              background: C.paleMint, color: C.forestGreen, borderRadius: radius.full,
              fontSize: '12px', fontWeight: '700', padding: '4px 14px',
            }}>High Honors ✓</span>
          </div>
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

      {/* Main Content Grid */}
      <div className="student-content-grid">

        {/* Subjects */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>My Subjects</h3>
            <button style={{ fontSize: '12px', color: C.emerald, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View All</button>
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
                  <div style={{
                    width: '38px', height: '38px', borderRadius: radius.sm, flexShrink: 0,
                    background: sub.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: sub.color }}>{sub.grade}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>{sub.name}</p>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: sub.color }}>{sub.score}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ScoreBar score={sub.score} color={sub.color} />
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

        {/* Upcoming Deadlines */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Upcoming Deadlines</h3>
            <span style={{
              background: C.dangerBg, color: C.danger, borderRadius: radius.full,
              fontSize: '11px', fontWeight: '700', padding: '3px 9px',
            }}>4 due</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deadlines.map(dl => {
              const cols = deadlineColors[dl.status as keyof typeof deadlineColors];
              const Icon = dl.icon;
              return (
                <div key={dl.id} style={{
                  padding: '14px', borderRadius: radius.md,
                  background: cols.bg, border: `1px solid ${cols.border}`,
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Icon size={15} color={cols.iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, margin: '0 0 3px', lineHeight: '1.3' }}>{dl.title}</p>
                      <p style={{ fontSize: '11px', color: C.medGray, margin: '0 0 6px' }}>{dl.subject}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} color={cols.text} />
                        <span style={{ fontSize: '11px', color: cols.text, fontWeight: '600' }}>{dl.due}</span>
                      </div>
                    </div>
                  </div>
                  {dl.status === 'urgent' && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                      <button style={{
                        flex: 1, padding: '6px', borderRadius: radius.sm, background: C.danger,
                        color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                      }}>Submit Now</button>
                      <button style={{
                        padding: '6px 10px', borderRadius: radius.sm, background: 'none',
                        color: C.danger, border: `1px solid ${C.danger}`, cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                      }}>View</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 18px' }}>Today's Schedule</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '1.5px', background: C.border }} />
            {schedule.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px',
                marginBottom: i < schedule.length - 1 ? '14px' : '0',
                position: 'relative',
              }}>
                {/* Dot */}
                <div style={{
                  width: '30px', height: '30px', borderRadius: radius.full, flexShrink: 0,
                  background: item.active ? C.forestGreen : item.done ? C.lightMint : item.break ? C.offWhite : C.paleGreen,
                  border: `2px solid ${item.active ? C.forestGreen : item.done ? C.mediumGreen : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                }}>
                  {item.done
                    ? <CheckCircle size={13} color={C.emerald} />
                    : item.active
                    ? <Clock size={13} color="white" />
                    : item.break
                    ? <span style={{ fontSize: '10px' }}>☕</span>
                    : <Clock size={13} color={C.medGray} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '10.5px', color: C.medGray, margin: '0 0 1px' }}>{item.time}</p>
                  <p style={{
                    fontSize: '13px', fontWeight: item.active ? '700' : item.done ? '400' : '600',
                    color: item.active ? C.forestGreen : item.done ? C.medGray : C.charcoal,
                    margin: 0, lineHeight: '1.3',
                  }}>{item.subject}</p>
                  {item.room && <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>{item.room}</p>}
                  {item.teacher && <p style={{ fontSize: '10.5px', color: C.lightMint, margin: '1px 0 0' }}>{item.teacher}</p>}
                </div>

                {item.active && (
                  <div style={{
                    position: 'absolute', right: 0, top: '4px',
                    background: C.paleMint, color: C.forestGreen, borderRadius: radius.full,
                    fontSize: '9px', fontWeight: '800', padding: '2px 7px', letterSpacing: '0.5px',
                  }}>LIVE</div>
                )}
              </div>
            ))}
          </div>

          {/* Performance Radar */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, marginBottom: '10px' }}>Performance Overview</p>
            <ResponsiveContainer width="100%" height={150}>
              <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: C.medGray }} />
                <Radar name="Score" dataKey="score" stroke={C.emerald} fill={C.emerald} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}