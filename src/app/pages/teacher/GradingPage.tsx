import React, { useState } from 'react';
import { CheckCircle, Save, Send, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const classes = [
  { id: 'calc11a', label: 'Advanced Calculus – Grade 11A', students: 28, color: C.forestGreen, light: C.paleMint },
  { id: 'alg10b',  label: 'Linear Algebra – Grade 10B',    students: 31, color: '#0369A1',    light: '#E0F2FE' },
  { id: 'stat9c',  label: 'Statistics 101 – Grade 9C',     students: 25, color: '#7C3AED',    light: '#F3E8FF' },
];

const initialStudents = [
  { id: 1,  name: 'Emma Johnson',    prevScore: 91, score: 95, submitted: false },
  { id: 2,  name: 'Lucas Park',      prevScore: 88, score: 88, submitted: false },
  { id: 3,  name: 'Ava Thompson',    prevScore: 76, score: 79, submitted: false },
  { id: 4,  name: 'Noah Martinez',   prevScore: 95, score: 97, submitted: false },
  { id: 5,  name: 'Isabella Chen',   prevScore: 82, score: 85, submitted: false },
  { id: 6,  name: 'Ethan Parker',    prevScore: 70, score: 73, submitted: false },
  { id: 7,  name: 'Mia Williams',    prevScore: 93, score: 91, submitted: false },
  { id: 8,  name: 'James Taylor',    prevScore: 78, score: 82, submitted: false },
];

function scoreToGrade(s: number): string {
  if (s >= 97) return 'A+';
  if (s >= 93) return 'A';
  if (s >= 90) return 'A−';
  if (s >= 87) return 'B+';
  if (s >= 83) return 'B';
  if (s >= 80) return 'B−';
  if (s >= 77) return 'C+';
  if (s >= 73) return 'C';
  return 'C−';
}

export default function GradingPage() {
  const { gradesSubmitted, submitGrades } = usePortal();
  const [activeClass,  setActiveClass]  = useState(classes[0].id);
  const [students,     setStudents]     = useState(initialStudents);
  const [submitting,   setSubmitting]   = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const cls = classes.find(c => c.id === activeClass)!;

  const updateScore = (id: number, val: string) => {
    const n = Math.min(100, Math.max(0, parseInt(val) || 0));
    setStudents(s => s.map(st => st.id === id ? { ...st, score: n } : st));
  };

  const handleSubmit = () => {
    setShowConfirm(false);
    setSubmitting(true);
    setTimeout(() => {
      const emmaScore = students.find(s => s.name === 'Emma Johnson')?.score ?? 95;
      submitGrades({
        Mathematics: { score: emmaScore, grade: scoreToGrade(emmaScore), submittedAt: 'Just now' },
      });
      setStudents(s => s.map(st => ({ ...st, submitted: true })));
      setSubmitting(false);
      toast.success('Grades Submitted Successfully!', {
        description: 'Advanced Calculus — Grade 11A grades have been recorded. Students will see their updated scores.',
        duration: 6000,
        icon: '✅',
      });
    }, 1400);
  };

  const avg = Math.round(students.reduce((a, s) => a + s.score, 0) / students.length);
  const passing = students.filter(s => s.score >= 70).length;

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>Grading System</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>Enter and submit grades for your classes</p>
        </div>
        {gradesSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: radius.md, background: C.successBg, border: `1.5px solid #A7F3D0` }}
          >
            <CheckCircle size={16} color={C.success} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: C.success }}>Grades submitted & visible to students</span>
          </motion.div>
        )}
      </div>

      {/* Class Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveClass(c.id)}
            style={{
              padding: '9px 18px', borderRadius: radius.md,
              border: `1.5px solid ${activeClass === c.id ? c.color : C.lightGray}`,
              background: activeClass === c.id ? c.light : 'white',
              color: activeClass === c.id ? c.color : C.medGray,
              cursor: 'pointer', fontSize: '13px', fontWeight: activeClass === c.id ? '700' : '400',
              transition: 'all 0.18s',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Class Average', value: `${avg}%`,    color: C.forestGreen, bg: C.paleMint },
          { label: 'Passing (≥70)', value: `${passing}/${students.length}`, color: '#0369A1', bg: '#E0F2FE' },
          { label: 'Top Score',     value: `${Math.max(...students.map(s => s.score))}%`, color: '#7C3AED', bg: '#F3E8FF' },
          { label: 'Needs Review',  value: `${students.filter(s => s.score < 70).length}`, color: C.danger, bg: C.dangerBg },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.white, borderRadius: radius.md, padding: '16px 20px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: '12px', color: C.medGray, margin: '0 0 6px' }}>{stat.label}</p>
            <p style={{ fontSize: '26px', fontWeight: '800', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Grade Table */}
      <div style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.offWhite }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>{cls.label}</h3>
            <p style={{ fontSize: '12px', color: C.medGray, marginTop: '2px' }}>Midterm Examination Scores</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} color={C.warning} />
            <span style={{ fontSize: '12px', color: C.warning }}>Click scores to edit before submitting</span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {['Student', 'Previous Score', 'Current Score', 'Letter Grade', 'Change', 'Status'].map(col => (
                <th key={col} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: '700', color: C.medGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((st, i) => {
              const delta = st.score - st.prevScore;
              const isEditable = !gradesSubmitted && !st.submitted;
              return (
                <motion.tr
                  key={st.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: i < students.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: radius.full, background: C.paleMint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: C.forestGreen }}>
                        {st.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate }}>{st.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.medGray }}>{st.prevScore}%</td>
                  <td style={{ padding: '12px 16px' }}>
                    {isEditable ? (
                      <input
                        type="number" min={0} max={100}
                        value={st.score}
                        onChange={e => updateScore(st.id, e.target.value)}
                        style={{
                          width: '70px', padding: '6px 10px', border: `1.5px solid ${C.lightMint}`,
                          borderRadius: radius.sm, fontSize: '13px', color: C.darkSlate,
                          outline: 'none', background: C.paleGreen, fontWeight: '600',
                          transition: 'border-color 0.15s',
                        }}
                        onFocus={e => (e.target.style.borderColor = C.emerald)}
                        onBlur={e  => (e.target.style.borderColor = C.lightMint)}
                      />
                    ) : (
                      <span style={{ fontSize: '13px', fontWeight: '700', color: C.darkSlate }}>{st.score}%</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: radius.full,
                      fontSize: '12px', fontWeight: '700',
                      background: st.score >= 90 ? C.paleMint : st.score >= 80 ? '#E0F2FE' : st.score >= 70 ? '#FEF3C7' : C.dangerBg,
                      color: st.score >= 90 ? C.forestGreen : st.score >= 80 ? '#0369A1' : st.score >= 70 ? '#92400E' : C.danger,
                    }}>
                      {scoreToGrade(st.score)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: delta > 0 ? C.success : delta < 0 ? C.danger : C.medGray }}>
                      {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {gradesSubmitted || st.submitted ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: '600', color: C.success }}>
                        <CheckCircle size={12} /> Submitted
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: C.warning, fontWeight: '600' }}>Pending</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      {!gradesSubmitted && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => toast.info('Draft saved locally.')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: radius.md,
              border: `1.5px solid ${C.lightGray}`, background: 'white',
              cursor: 'pointer', fontSize: '14px', color: C.medGray, fontWeight: '600',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.offWhite; e.currentTarget.style.borderColor = C.border; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = C.lightGray; }}
          >
            <Save size={15} /> Save Draft
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 26px', borderRadius: radius.md,
              background: submitting ? C.mediumGreen : `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`,
              color: 'white', border: 'none', cursor: submitting ? 'wait' : 'pointer',
              fontSize: '14px', fontWeight: '600',
              boxShadow: `0px 4px 16px rgba(27,94,59,0.3)`, transition: 'opacity 0.18s',
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {submitting ? (
              <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Submitting…</>
            ) : (
              <><Send size={15} /> Submit Grades to Students</>
            )}
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ background: C.white, borderRadius: radius.xl, padding: '32px', width: '420px', boxShadow: shadow.modal, textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: radius.full, background: C.paleMint, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={24} color={C.forestGreen} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.darkSlate, margin: '0 0 10px' }}>Submit Grades?</h2>
              <p style={{ fontSize: '14px', color: C.medGray, margin: '0 0 8px', lineHeight: '1.6' }}>
                You are about to submit grades for <strong style={{ color: C.darkSlate }}>{cls.label}</strong>.
              </p>
              <p style={{ fontSize: '13px', color: C.warning, margin: '0 0 24px' }}>
                ⚠️ Students will immediately see their updated scores.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '11px', borderRadius: radius.md, border: `1.5px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', fontSize: '14px', color: C.medGray, fontWeight: '600', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >Cancel</button>
                <button onClick={handleSubmit} style={{ flex: 1, padding: '11px', borderRadius: radius.md, border: 'none', background: C.forestGreen, color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#154d30')}
                  onMouseLeave={e => (e.currentTarget.style.background = C.forestGreen)}
                >Yes, Submit Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
