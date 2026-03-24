import React, { useState } from 'react';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dateNums = [24, 25, 26, 27, 28];

type ClassEntry = {
  subject: string; teacher: string; room: string;
  color: string; light: string; start: number; duration: number;
};

const schedule: Record<string, ClassEntry[]> = {
  Mon: [
    { subject: 'Mathematics',        teacher: 'Prof. Wilson',  room: 'Room 204', color: C.forestGreen, light: C.paleMint,  start: 8.0,  duration: 1.25 },
    { subject: 'Computer Science',   teacher: 'Dr. Patel',     room: 'Lab 01',   color: '#065F46',     light: '#ECFDF5',  start: 9.5,  duration: 1.25 },
    { subject: 'English Literature', teacher: 'Ms. Thompson',  room: 'Room 301', color: '#7C3AED',     light: '#F3E8FF',  start: 13.5, duration: 1.25 },
    { subject: 'Biology',            teacher: 'Ms. Park',      room: 'Lab 02',   color: '#9D174D',     light: '#FCE7F3',  start: 15.0, duration: 1.25 },
  ],
  Tue: [
    { subject: 'Mathematics',        teacher: 'Prof. Wilson',  room: 'Room 204', color: C.forestGreen, light: C.paleMint,  start: 8.0,  duration: 1.25 },
    { subject: 'Computer Science',   teacher: 'Dr. Patel',     room: 'Lab 01',   color: '#065F46',     light: '#ECFDF5',  start: 9.5,  duration: 1.25 },
    { subject: 'Physics',            teacher: 'Dr. Reed',      room: 'Room 105', color: '#0369A1',     light: '#E0F2FE',  start: 11.0, duration: 1.25 },
    { subject: 'English Literature', teacher: 'Ms. Thompson',  room: 'Room 301', color: '#7C3AED',     light: '#F3E8FF',  start: 13.5, duration: 1.25 },
    { subject: 'Biology',            teacher: 'Ms. Park',      room: 'Lab 02',   color: '#9D174D',     light: '#FCE7F3',  start: 15.0, duration: 1.25 },
  ],
  Wed: [
    { subject: 'World History',      teacher: 'Mr. Garcia',    room: 'Room 210', color: '#92400E',     light: '#FEF3C7',  start: 8.0,  duration: 1.25 },
    { subject: 'Physics',            teacher: 'Dr. Reed',      room: 'Room 105', color: '#0369A1',     light: '#E0F2FE',  start: 9.5,  duration: 1.25 },
    { subject: 'Mathematics',        teacher: 'Prof. Wilson',  room: 'Room 204', color: C.forestGreen, light: C.paleMint,  start: 13.5, duration: 1.25 },
  ],
  Thu: [
    { subject: 'Computer Science',   teacher: 'Dr. Patel',     room: 'Lab 01',   color: '#065F46',     light: '#ECFDF5',  start: 8.0,  duration: 1.25 },
    { subject: 'English Literature', teacher: 'Ms. Thompson',  room: 'Room 301', color: '#7C3AED',     light: '#F3E8FF',  start: 11.0, duration: 1.25 },
    { subject: 'World History',      teacher: 'Mr. Garcia',    room: 'Room 210', color: '#92400E',     light: '#FEF3C7',  start: 13.5, duration: 1.25 },
    { subject: 'Biology',            teacher: 'Ms. Park',      room: 'Lab 02',   color: '#9D174D',     light: '#FCE7F3',  start: 15.0, duration: 1.25 },
  ],
  Fri: [
    { subject: 'Physics',            teacher: 'Dr. Reed',      room: 'Room 105', color: '#0369A1',     light: '#E0F2FE',  start: 9.5,  duration: 1.25 },
    { subject: 'Mathematics',        teacher: 'Prof. Wilson',  room: 'Room 204', color: C.forestGreen, light: C.paleMint,  start: 11.0, duration: 1.25 },
    { subject: 'World History',      teacher: 'Mr. Garcia',    room: 'Room 210', color: '#92400E',     light: '#FEF3C7',  start: 14.0, duration: 1.25 },
  ],
};

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const HOUR_H = 64;
const DAY_START = 8;

function fmtHour(h: number) {
  const hh = Math.floor(h);
  const mm = h % 1 === 0.5 ? '30' : '00';
  return hh < 12 ? `${hh}:${mm} AM` : hh === 12 ? `12:${mm} PM` : `${hh - 12}:${mm} PM`;
}

const subjectList = [
  { name: 'Mathematics',        color: C.forestGreen, light: C.paleMint  },
  { name: 'Physics',            color: '#0369A1',     light: '#E0F2FE'   },
  { name: 'English Literature', color: '#7C3AED',     light: '#F3E8FF'   },
  { name: 'World History',      color: '#92400E',     light: '#FEF3C7'   },
  { name: 'Computer Science',   color: '#065F46',     light: '#ECFDF5'   },
  { name: 'Biology',            color: '#9D174D',     light: '#FCE7F3'   },
];

export default function StudentSchedulePage() {
  const [activeDay, setActiveDay] = useState('Tue');
  const dayClasses = schedule[activeDay] || [];

  const totalClasses = dayClasses.length;
  const uniqueSubjects = new Set(dayClasses.map(c => c.subject)).size;

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>My Schedule</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>
            Week of March 24–28, 2026 · Grade 11 – Section A
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ padding: '8px', borderRadius: radius.md, border: `1px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          ><ChevronLeft size={16} color={C.medGray} /></button>
          <span style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate, padding: '0 8px' }}>Mar 24 – Mar 28</span>
          <button style={{ padding: '8px', borderRadius: radius.md, border: `1px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          ><ChevronRight size={16} color={C.medGray} /></button>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: "Today's Classes", value: totalClasses,   color: C.forestGreen, bg: C.paleMint },
          { label: 'Subjects Today',  value: uniqueSubjects, color: '#0369A1',     bg: '#E0F2FE' },
          { label: 'Total This Week', value: Object.values(schedule).flat().length, color: '#7C3AED', bg: '#F3E8FF' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ background: C.white, borderRadius: radius.md, padding: '16px 20px', boxShadow: shadow.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: radius.md, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={19} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: C.medGray, margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: '24px', fontWeight: '800', color: s.color, margin: '2px 0 0', lineHeight: 1 }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Day Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {days.map((d, i) => {
          const isToday  = d === 'Tue';
          const isActive = activeDay === d;
          return (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              style={{
                flex: 1, padding: '12px', borderRadius: radius.md,
                border: `1.5px solid ${isActive ? C.forestGreen : C.lightGray}`,
                background: isActive ? C.forestGreen : isToday ? C.paleMint : 'white',
                color: isActive ? 'white' : isToday ? C.forestGreen : C.medGray,
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.paleGreen; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isToday ? C.paleMint : 'white'; }}
            >
              <p style={{ fontSize: '11px', fontWeight: '600', margin: 0, opacity: 0.8 }}>{d}</p>
              <p style={{ fontSize: '18px', fontWeight: '700', margin: '2px 0' }}>{dateNums[i]}</p>
              <p style={{ fontSize: '10px', margin: 0, opacity: 0.7 }}>
                {(schedule[d] || []).length} class{(schedule[d] || []).length !== 1 ? 'es' : ''}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px' }}>

        {/* Timeline */}
        <div style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex' }}>
            {/* Hour labels */}
            <div style={{ width: '64px', flexShrink: 0, borderRight: `1px solid ${C.border}` }}>
              <div style={{ height: '44px', borderBottom: `1px solid ${C.border}`, background: C.offWhite }} />
              {hours.map(h => (
                <div key={h} style={{ height: `${HOUR_H}px`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', paddingTop: '6px', paddingRight: '8px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: C.medGray, fontWeight: '500' }}>
                    {h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day column */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ height: '44px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', paddingLeft: '16px', background: C.offWhite }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: C.forestGreen }}>
                  {activeDay === 'Tue' ? '📍 Today – Tuesday, March 25' : `${days.find(d => d === activeDay)}, March ${dateNums[days.indexOf(activeDay)]}`}
                </span>
              </div>
              {hours.map(h => (
                <div key={h} style={{ height: `${HOUR_H}px`, borderBottom: `1px solid ${C.border}`, background: h % 2 === 0 ? 'white' : C.offWhite }} />
              ))}

              {/* Lunch break band */}
              <div style={{
                position: 'absolute',
                top: `${(12 - DAY_START) * HOUR_H + 44}px`,
                left: 0, right: 0, height: `${HOUR_H}px`,
                background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.015) 6px, rgba(0,0,0,0.015) 12px)',
                pointerEvents: 'none',
              }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: C.medGray, fontWeight: '500' }}>
                  ☕ Lunch Break
                </span>
              </div>

              {/* Class Events */}
              {dayClasses.map((ev, i) => {
                const top    = (ev.start - DAY_START) * HOUR_H + 44;
                const height = ev.duration * HOUR_H - 6;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    style={{
                      position: 'absolute', top: `${top}px`, left: '8px', right: '8px', height: `${height}px`,
                      borderRadius: radius.md, padding: '10px 14px',
                      background: ev.light, border: `1.5px solid ${ev.color}30`,
                      borderLeft: `4px solid ${ev.color}`,
                      cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.18s, transform 0.18s',
                    }}
                    whileHover={{ boxShadow: `0 4px 16px ${ev.color}25`, y: -1 }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '700', color: ev.color, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.subject}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <User size={10} color={C.medGray} />
                        <span style={{ fontSize: '10.5px', color: C.medGray }}>{ev.teacher}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={10} color={C.medGray} />
                        <span style={{ fontSize: '10.5px', color: C.medGray }}>{ev.room}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} color={C.medGray} />
                        <span style={{ fontSize: '10.5px', color: C.medGray }}>{fmtHour(ev.start)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject Legend + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Subject Color Legend */}
          <div style={{ background: C.white, borderRadius: radius.lg, padding: '20px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.darkSlate, margin: '0 0 14px' }}>My Subjects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subjectList.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12.5px', color: C.charcoal }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* This Week Summary */}
          <div style={{ background: C.white, borderRadius: radius.lg, padding: '20px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.darkSlate, margin: '0 0 14px' }}>Weekly Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {days.map((d, i) => {
                const count    = (schedule[d] || []).length;
                const isToday  = d === 'Tue';
                const isActive = activeDay === d;
                return (
                  <div
                    key={d}
                    onClick={() => setActiveDay(d)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', borderRadius: radius.sm,
                      background: isActive ? C.paleGreen : isToday ? `${C.paleMint}60` : 'transparent',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = C.paleGreen; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isActive ? C.paleGreen : isToday ? `${C.paleMint}60` : 'transparent'; }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: isToday ? '700' : '500', color: isToday ? C.forestGreen : C.medGray, width: '28px' }}>
                      {d}
                    </span>
                    <span style={{ fontSize: '12px', color: C.medGray, width: '26px' }}>{dateNums[i]}</span>
                    <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
                      {Array.from({ length: count }).map((_, j) => (
                        <div key={j} style={{ width: '8px', height: '8px', borderRadius: '2px', background: isActive ? C.forestGreen : isToday ? C.emerald : C.lightGray }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: C.medGray }}>{count}cl</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
