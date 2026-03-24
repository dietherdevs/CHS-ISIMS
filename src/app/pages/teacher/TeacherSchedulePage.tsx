import React, { useState } from 'react';
import { Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const schedule: Record<string, { subject: string; grade: string; room: string; color: string; start: number; duration: number }[]> = {
  Mon: [
    { subject: 'Advanced Calculus', grade: 'Grade 11-A', room: 'Room 204', color: C.forestGreen, start: 8.5,  duration: 1.25 },
    { subject: 'Linear Algebra',    grade: 'Grade 10-B', room: 'Room 108', color: '#0369A1',    start: 11.0, duration: 1.25 },
    { subject: 'Statistics 101',    grade: 'Grade 9-C',  room: 'Lab 03',   color: '#7C3AED',    start: 14.0, duration: 1.25 },
  ],
  Tue: [
    { subject: 'Advanced Calculus', grade: 'Grade 11-A', room: 'Room 204', color: C.forestGreen, start: 8.5,  duration: 1.25 },
    { subject: 'Math 8D',           grade: 'Grade 8-D',  room: 'Room 102', color: '#92400E',    start: 13.0, duration: 1.0 },
    { subject: 'Office Hours',      grade: 'Open',       room: 'Office 2', color: C.medGray,    start: 15.0, duration: 1.0 },
  ],
  Wed: [
    { subject: 'Linear Algebra',    grade: 'Grade 10-B', room: 'Room 108', color: '#0369A1',    start: 9.0,  duration: 1.25 },
    { subject: 'Statistics 101',    grade: 'Grade 9-C',  room: 'Lab 03',   color: '#7C3AED',    start: 11.0, duration: 1.25 },
    { subject: 'Faculty Meeting',   grade: 'All Dept.',  room: 'Conf. A',  color: '#9D174D',    start: 14.0, duration: 1.0 },
  ],
  Thu: [
    { subject: 'Advanced Calculus', grade: 'Grade 11-A', room: 'Room 204', color: C.forestGreen, start: 8.5,  duration: 1.25 },
    { subject: 'Math 8D',           grade: 'Grade 8-D',  room: 'Room 102', color: '#92400E',    start: 11.0, duration: 1.0 },
  ],
  Fri: [
    { subject: 'Linear Algebra',    grade: 'Grade 10-B', room: 'Room 108', color: '#0369A1',    start: 9.0,  duration: 1.25 },
    { subject: 'Statistics 101',    grade: 'Grade 9-C',  room: 'Lab 03',   color: '#7C3AED',    start: 14.0, duration: 1.25 },
    { subject: 'Office Hours',      grade: 'Open',       room: 'Office 2', color: C.medGray,    start: 15.5, duration: 1.0 },
  ],
};

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const HOUR_HEIGHT = 60;
const DAY_START = 8;

export default function TeacherSchedulePage() {
  const [activeDay, setActiveDay] = useState('Tue');

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>Weekly Schedule</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>Week of March 24–28, 2026</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ padding: '8px', borderRadius: radius.md, border: `1px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          ><ChevronLeft size={16} color={C.medGray} /></button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: C.darkSlate, padding: '0 8px' }}>Mar 24 – Mar 28</span>
          <button style={{ padding: '8px', borderRadius: radius.md, border: `1px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', display: 'flex', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          ><ChevronRight size={16} color={C.medGray} /></button>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {days.map((d, i) => {
          const dateNums = [24, 25, 26, 27, 28];
          const isToday = d === 'Tue';
          return (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              style={{
                flex: 1, padding: '12px', borderRadius: radius.md,
                border: `1.5px solid ${activeDay === d ? C.forestGreen : C.lightGray}`,
                background: activeDay === d ? C.forestGreen : isToday ? C.paleMint : 'white',
                color: activeDay === d ? 'white' : isToday ? C.forestGreen : C.medGray,
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: '600', margin: 0, opacity: 0.8 }}>{d}</p>
              <p style={{ fontSize: '18px', fontWeight: '700', margin: '2px 0 0' }}>{dateNums[i]}</p>
              <p style={{ fontSize: '10px', margin: '2px 0 0', opacity: 0.7 }}>{(schedule[d] || []).filter(s => s.subject !== 'Office Hours').length} classes</p>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex' }}>
          {/* Hour labels */}
          <div style={{ width: '60px', flexShrink: 0, borderRight: `1px solid ${C.border}` }}>
            <div style={{ height: '40px', borderBottom: `1px solid ${C.border}` }} />
            {hours.map(h => (
              <div key={h} style={{ height: `${HOUR_HEIGHT}px`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', paddingTop: '6px', paddingRight: '8px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: C.medGray, fontWeight: '500' }}>{h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`}</span>
              </div>
            ))}
          </div>

          {/* Day column */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ height: '40px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', paddingLeft: '16px', background: C.offWhite }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: C.forestGreen }}>
                {activeDay === 'Tue' ? '📍 Today' : `${activeDay}, March ${[24,25,26,27,28][days.indexOf(activeDay)]}`}
              </span>
            </div>
            {/* Hour grid lines */}
            {hours.map(h => (
              <div key={h} style={{ height: `${HOUR_HEIGHT}px`, borderBottom: `1px solid ${C.border}`, background: h % 2 === 0 ? 'white' : C.offWhite }} />
            ))}
            {/* Event blocks */}
            {(schedule[activeDay] || []).map((ev, i) => {
              const top = (ev.start - DAY_START) * HOUR_HEIGHT + 40;
              const height = ev.duration * HOUR_HEIGHT - 4;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', top: `${top}px`, left: '8px', right: '8px', height: `${height}px`,
                    borderRadius: radius.md, padding: '8px 12px',
                    background: `${ev.color}15`, border: `1.5px solid ${ev.color}40`,
                    borderLeft: `4px solid ${ev.color}`,
                    cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.18s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${ev.color}30`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}
                >
                  <p style={{ fontSize: '13px', fontWeight: '700', color: ev.color, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.subject}</p>
                  <p style={{ fontSize: '11px', color: C.charcoal, margin: '0 0 4px' }}>{ev.grade}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} color={C.medGray} />
                      <span style={{ fontSize: '10.5px', color: C.medGray }}>{ev.start < 12 ? `${ev.start}AM` : `${ev.start}PM`}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={10} color={C.medGray} />
                      <span style={{ fontSize: '10.5px', color: C.medGray }}>{ev.room}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
