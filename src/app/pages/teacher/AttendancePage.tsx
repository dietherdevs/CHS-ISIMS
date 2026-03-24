import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Save, Send, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const classes = [
  { id: 'calc11a', label: 'Advanced Calculus – Grade 11A', students: 28, color: C.forestGreen },
  { id: 'alg10b',  label: 'Linear Algebra – Grade 10B',    students: 31, color: '#0369A1' },
  { id: 'stat9c',  label: 'Statistics 101 – Grade 9C',     students: 25, color: '#7C3AED' },
];

const studentList = [
  'Emma Johnson', 'Lucas Park', 'Ava Thompson', 'Noah Martinez',
  'Isabella Chen', 'Ethan Parker', 'Mia Williams', 'James Taylor',
  'Sofia Davis', 'Liam Wilson', 'Charlotte Brown', 'Oliver Garcia',
];

type Status = 'present' | 'absent' | 'late';

const statusConfig: Record<Status, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  present: { bg: C.successBg, text: C.success, icon: CheckCircle, label: 'Present' },
  absent:  { bg: C.dangerBg,  text: C.danger,  icon: XCircle,     label: 'Absent' },
  late:    { bg: C.warningBg, text: C.warning,  icon: Clock,       label: 'Late' },
};

export default function AttendancePage() {
  const { attendanceSubmitted, submitAttendance } = usePortal();
  const [activeClass, setActiveClass]   = useState(classes[0].id);
  const [records, setRecords]           = useState<Record<string, Status>>(
    Object.fromEntries(studentList.map(s => [s, 'present']))
  );
  const [submitted, setSubmitted]       = useState(attendanceSubmitted);

  const cls = classes.find(c => c.id === activeClass)!;
  const presentCount = Object.values(records).filter(s => s === 'present').length;
  const absentCount  = Object.values(records).filter(s => s === 'absent').length;
  const lateCount    = Object.values(records).filter(s => s === 'late').length;
  const rate = Math.round((presentCount / studentList.length) * 100);

  const cycle = (name: string) => {
    if (submitted) return;
    const order: Status[] = ['present', 'late', 'absent'];
    const cur = records[name] as Status;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setRecords(r => ({ ...r, [name]: next }));
  };

  const markAll = (status: Status) => {
    if (submitted) return;
    setRecords(Object.fromEntries(studentList.map(s => [s, status])));
  };

  const handleSubmit = () => {
    submitAttendance();
    setSubmitted(true);
    toast.success('Attendance Submitted!', {
      description: `${cls.label}: ${presentCount} present, ${absentCount} absent, ${lateCount} late.`,
      duration: 5000,
      icon: '📋',
    });
  };

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>Attendance</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>Tuesday, March 24, 2026 · Mark attendance for today's classes</p>
        </div>
        {submitted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: radius.md, background: C.successBg, border: `1px solid #A7F3D0` }}>
            <CheckCircle size={16} color={C.success} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: C.success }}>Attendance submitted</span>
          </div>
        )}
      </div>

      {/* Class Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {classes.map(c => (
          <button key={c.id} onClick={() => setActiveClass(c.id)}
            style={{ padding: '9px 18px', borderRadius: radius.md, border: `1.5px solid ${activeClass === c.id ? c.color : C.lightGray}`, background: activeClass === c.id ? `${c.color}12` : 'white', color: activeClass === c.id ? c.color : C.medGray, cursor: 'pointer', fontSize: '13px', fontWeight: activeClass === c.id ? '700' : '400', transition: 'all 0.18s' }}
          >{c.label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Present',  value: presentCount, color: C.success,  bg: C.successBg },
          { label: 'Absent',   value: absentCount,  color: C.danger,   bg: C.dangerBg },
          { label: 'Late',     value: lateCount,    color: C.warning,  bg: C.warningBg },
          { label: 'Rate',     value: `${rate}%`,   color: C.forestGreen, bg: C.paleMint },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, borderRadius: radius.md, padding: '16px 20px', boxShadow: shadow.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '12px', color: C.medGray, margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: '800', color: s.color, margin: '2px 0 0' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls + Table */}
      <div style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, background: C.offWhite, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Click a student's status to cycle: Present → Late → Absent</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['present', 'late', 'absent'] as Status[]).map(s => {
              const Icon = statusConfig[s].icon;
              return (
                <button key={s}
                  onClick={() => markAll(s)}
                  disabled={submitted}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: radius.sm, border: `1px solid ${statusConfig[s].text}20`, background: statusConfig[s].bg, color: statusConfig[s].text, cursor: submitted ? 'default' : 'pointer', fontSize: '12px', fontWeight: '600', opacity: submitted ? 0.5 : 1, transition: 'opacity 0.15s' }}
                >
                  <Icon size={13} /> Mark All {statusConfig[s].label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {studentList.map((name, i) => {
            const status = records[name] as Status;
            const cfg = statusConfig[status];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={name}
                whileTap={{ scale: submitted ? 1 : 0.97 }}
                onClick={() => cycle(name)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', cursor: submitted ? 'default' : 'pointer',
                  borderBottom: i < studentList.length - 2 ? `1px solid ${C.border}` : 'none',
                  borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none',
                  background: 'white', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!submitted) (e.currentTarget as HTMLDivElement).style.background = C.paleGreen; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'white'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: radius.full, background: C.paleMint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: C.forestGreen }}>
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: '500', color: C.darkSlate }}>{name}</span>
                </div>
                <motion.span
                  key={status}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: radius.full, background: cfg.bg, color: cfg.text, fontSize: '11.5px', fontWeight: '600' }}
                >
                  <Icon size={12} /> {cfg.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={() => toast.info('Draft saved.')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: radius.md, border: `1.5px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', fontSize: '14px', color: C.medGray, fontWeight: '600', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          ><Save size={15} /> Save Draft</button>
          <button
            onClick={handleSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 26px', borderRadius: radius.md, background: `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`, color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: `0px 4px 16px rgba(27,94,59,0.3)`, transition: 'opacity 0.18s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          ><Send size={15} /> Submit Attendance</button>
        </div>
      )}
    </PageTransition>
  );
}
