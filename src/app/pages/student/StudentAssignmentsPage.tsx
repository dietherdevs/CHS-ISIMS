import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ClipboardList, Clock, CheckCircle, AlertTriangle, Upload,
  BookOpen, Calendar, FileText, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  due: string;
  dueRelative: string;
  status: AssignmentStatus;
  score?: number;
  grade?: string;
  instructions: string;
  subjectColor: string;
  subjectLight: string;
}

const statusConfig: Record<AssignmentStatus, { bg: string; border: string; text: string; label: string; icon: React.ElementType }> = {
  pending:   { bg: C.warningBg,  border: '#FDE68A', text: C.warning,  label: 'Pending',   icon: Clock },
  submitted: { bg: '#EFF6FF',   border: '#BFDBFE', text: '#1D4ED8', label: 'Submitted', icon: CheckCircle },
  graded:    { bg: C.successBg,  border: '#A7F3D0', text: C.success,  label: 'Graded',    icon: CheckCircle },
  overdue:   { bg: C.dangerBg,   border: '#FCA5A5', text: C.danger,   label: 'Overdue',   icon: XCircle },
};

const baseAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Integration by Parts – Problem Set 4',
    subject: 'Mathematics',
    teacher: 'Prof. Wilson',
    due: 'Mar 24, 2026 · 11:59 PM',
    dueRelative: 'Today',
    status: 'pending',
    instructions: 'Complete problems 1–12 from Chapter 7. Show all working steps. Submit as PDF.',
    subjectColor: C.forestGreen,
    subjectLight: C.paleMint,
  },
  {
    id: 2,
    title: 'Optics Lab Report – Refraction Experiment',
    subject: 'Physics',
    teacher: 'Dr. Reed',
    due: 'Mar 25, 2026 · 9:00 AM',
    dueRelative: 'Tomorrow',
    status: 'pending',
    instructions: 'Write up your findings from the refraction lab. Include data tables, diagrams, and conclusion.',
    subjectColor: '#0369A1',
    subjectLight: '#E0F2FE',
  },
  {
    id: 3,
    title: 'Shakespeare Essay – Hamlet Analysis',
    subject: 'English Literature',
    teacher: 'Ms. Thompson',
    due: 'Mar 26, 2026 · 11:59 PM',
    dueRelative: 'In 2 days',
    status: 'pending',
    instructions: 'Write a 1,200-word analytical essay on Hamlet\'s moral dilemma. Use at least 3 textual references.',
    subjectColor: '#7C3AED',
    subjectLight: '#F3E8FF',
  },
  {
    id: 4,
    title: 'World War I Research Paper',
    subject: 'World History',
    teacher: 'Mr. Garcia',
    due: 'Mar 28, 2026 · 11:59 PM',
    dueRelative: 'In 4 days',
    status: 'pending',
    instructions: 'Research paper on the causes and consequences of World War I. Minimum 2,000 words, 5 sources.',
    subjectColor: '#92400E',
    subjectLight: '#FEF3C7',
  },
  {
    id: 5,
    title: 'Binary Tree Traversal – Coding Assignment',
    subject: 'Computer Science',
    teacher: 'Dr. Patel',
    due: 'Mar 20, 2026 · 11:59 PM',
    dueRelative: 'Mar 20',
    status: 'submitted',
    instructions: 'Implement in-order, pre-order, and post-order traversal algorithms.',
    subjectColor: '#065F46',
    subjectLight: '#ECFDF5',
  },
  {
    id: 6,
    title: 'Cell Division – Diagram Assignment',
    subject: 'Biology',
    teacher: 'Ms. Park',
    due: 'Mar 18, 2026 · 11:59 PM',
    dueRelative: 'Mar 18',
    status: 'submitted',
    instructions: 'Label all phases of mitosis and meiosis with accurate descriptions.',
    subjectColor: '#9D174D',
    subjectLight: '#FCE7F3',
  },
  {
    id: 7,
    title: 'Midterm Examination – Advanced Calculus',
    subject: 'Mathematics',
    teacher: 'Prof. Wilson',
    due: 'Mar 10, 2026',
    dueRelative: 'Mar 10',
    status: 'graded',
    score: 95,
    grade: 'A',
    instructions: 'Midterm exam covering Chapters 1–6.',
    subjectColor: C.forestGreen,
    subjectLight: C.paleMint,
  },
  {
    id: 8,
    title: 'Electromagnetism Quiz 2',
    subject: 'Physics',
    teacher: 'Dr. Reed',
    due: 'Mar 8, 2026',
    dueRelative: 'Mar 8',
    status: 'graded',
    score: 88,
    grade: 'A−',
    instructions: 'Quiz on Faraday\'s Law and electromagnetic induction.',
    subjectColor: '#0369A1',
    subjectLight: '#E0F2FE',
  },
];

type FilterTab = 'All' | 'Pending' | 'Submitted' | 'Graded';

export default function StudentAssignmentsPage() {
  const navigate = useNavigate();
  const { gradesSubmitted, studentGrades } = usePortal();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [localSubmitted, setLocalSubmitted] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Sync cross-role: if teacher submitted grades, update Math midterm score
  const assignments = baseAssignments.map(a => {
    if (gradesSubmitted && a.id === 7) {
      const math = studentGrades['Mathematics'];
      return { ...a, score: math?.score ?? a.score, grade: math?.grade ?? a.grade, status: 'graded' as AssignmentStatus };
    }
    if (localSubmitted.includes(a.id)) {
      return { ...a, status: 'submitted' as AssignmentStatus };
    }
    return a;
  });

  const counts: Record<FilterTab, number> = {
    All:       assignments.length,
    Pending:   assignments.filter(a => a.status === 'pending' || a.status === 'overdue').length,
    Submitted: assignments.filter(a => a.status === 'submitted').length,
    Graded:    assignments.filter(a => a.status === 'graded').length,
  };

  const filtered = activeTab === 'All'
    ? assignments
    : assignments.filter(a => {
        if (activeTab === 'Pending')   return a.status === 'pending' || a.status === 'overdue';
        if (activeTab === 'Submitted') return a.status === 'submitted';
        if (activeTab === 'Graded')    return a.status === 'graded';
        return true;
      });

  const handleSubmit = (id: number) => {
    setSubmitting(id);
    setTimeout(() => {
      setLocalSubmitted(prev => [...prev, id]);
      setSubmitting(null);
      toast.success('Assignment Submitted!', {
        description: 'Your submission has been recorded. Awaiting teacher review.',
        duration: 4000,
        icon: '📤',
      });
    }, 1200);
  };

  const tabs: FilterTab[] = ['All', 'Pending', 'Submitted', 'Graded'];

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>My Assignments</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>
            Term 2, 2025–2026 · {counts.Pending} pending · {counts.Graded} graded
          </p>
        </div>
        {gradesSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: radius.md,
              background: C.successBg, border: `1.5px solid #A7F3D0`,
            }}
          >
            <CheckCircle size={15} color={C.success} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: C.success }}>
              Math grade updated by Prof. Wilson ✓
            </span>
          </motion.div>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total',     value: counts.All,       color: C.forestGreen, bg: C.paleMint,   icon: ClipboardList },
          { label: 'Pending',   value: counts.Pending,   color: C.warning,     bg: C.warningBg,  icon: Clock },
          { label: 'Submitted', value: counts.Submitted, color: '#1D4ED8',     bg: '#EFF6FF',    icon: Upload },
          { label: 'Graded',    value: counts.Graded,    color: C.success,     bg: C.successBg,  icon: CheckCircle },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: C.white, borderRadius: radius.lg, padding: '18px 20px',
                boxShadow: shadow.card, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: '14px',
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: radius.md, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={19} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: C.medGray, margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: '24px', fontWeight: '800', color: s.color, margin: '2px 0 0', lineHeight: 1 }}>{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px', borderRadius: radius.full,
              border: `1.5px solid ${activeTab === tab ? C.forestGreen : C.lightGray}`,
              background: activeTab === tab ? C.forestGreen : 'white',
              color: activeTab === tab ? 'white' : C.medGray,
              cursor: 'pointer', fontSize: '13px',
              fontWeight: activeTab === tab ? '700' : '400',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.background = C.offWhite; }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.background = 'white'; }}
          >
            {tab}
            <span style={{ marginLeft: '6px', opacity: 0.7, fontSize: '11px' }}>({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {filtered.map((a, i) => {
            const cfg     = statusConfig[a.status];
            const Icon    = cfg.icon;
            const isOpen  = expandedId === a.id;
            const isSubm  = submitting === a.id;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
                style={{
                  background: C.white, borderRadius: radius.lg,
                  boxShadow: shadow.card, border: `1px solid ${C.border}`,
                  overflow: 'hidden',
                  borderLeft: `4px solid ${a.subjectColor}`,
                }}
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : a.id)}
                  style={{
                    padding: '18px 22px', cursor: 'pointer', display: 'flex',
                    alignItems: 'flex-start', gap: '16px', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  {/* Subject Icon */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: radius.md,
                    background: a.subjectLight, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <BookOpen size={18} color={a.subjectColor} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: C.darkSlate, margin: 0, lineHeight: '1.3' }}>{a.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: a.subjectColor, background: a.subjectLight, borderRadius: radius.sm, padding: '2px 8px' }}>
                            {a.subject}
                          </span>
                          <span style={{ fontSize: '12px', color: C.medGray }}>{a.teacher}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 10px', borderRadius: radius.full,
                          background: cfg.bg, border: `1px solid ${cfg.border}`,
                          fontSize: '11.5px', fontWeight: '600', color: cfg.text,
                        }}>
                          <Icon size={12} /> {cfg.label}
                        </span>
                        {a.status === 'graded' && a.score !== undefined && (
                          <motion.span
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{
                              fontSize: '16px', fontWeight: '800', color: a.subjectColor,
                              background: a.subjectLight, borderRadius: radius.sm,
                              padding: '2px 8px',
                            }}
                          >
                            {a.score}% · {a.grade}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <Calendar size={12} color={C.medGray} />
                      <span style={{ fontSize: '12px', color: C.medGray }}>Due: {a.due}</span>
                      {(a.status === 'pending' || a.status === 'overdue') && (
                        <span style={{
                          fontSize: '11px', fontWeight: '700',
                          color: a.dueRelative === 'Today' ? C.danger : C.warning,
                          background: a.dueRelative === 'Today' ? C.dangerBg : C.warningBg,
                          borderRadius: radius.full, padding: '1px 7px',
                        }}>
                          {a.dueRelative === 'Today' && <AlertTriangle size={10} style={{ marginRight: '3px', display: 'inline' }} />}
                          {a.dueRelative}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 22px 20px', borderTop: `1px solid ${C.border}`, paddingTop: '16px', background: C.offWhite }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                          <FileText size={14} color={C.medGray} />
                          <p style={{ fontSize: '13px', fontWeight: '600', color: C.charcoal, margin: 0 }}>Instructions</p>
                        </div>
                        <p style={{ fontSize: '13px', color: C.charcoal, lineHeight: '1.6', margin: '0 0 16px', paddingLeft: '26px' }}>
                          {a.instructions}
                        </p>
                        {(a.status === 'pending' || a.status === 'overdue') && (
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                              style={{
                                padding: '9px 16px', borderRadius: radius.md,
                                border: `1.5px solid ${C.lightGray}`, background: 'white',
                                cursor: 'pointer', fontSize: '13px', color: C.medGray, fontWeight: '600',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                            >
                              Save Draft
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleSubmit(a.id); }}
                              disabled={isSubm}
                              style={{
                                padding: '9px 20px', borderRadius: radius.md,
                                background: isSubm ? C.mediumGreen : `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`,
                                color: 'white', border: 'none', cursor: isSubm ? 'wait' : 'pointer',
                                fontSize: '13px', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '7px',
                                boxShadow: `0px 4px 12px rgba(27,94,59,0.25)`,
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={e => { if (!isSubm) e.currentTarget.style.opacity = '0.9'; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                            >
                              {isSubm ? (
                                <>
                                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }}
                                  />
                                  Submitting…
                                </>
                              ) : (
                                <><Upload size={14} /> Submit Assignment</>
                              )}
                            </button>
                          </div>
                        )}
                        {a.status === 'submitted' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: radius.md, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                            <CheckCircle size={15} color="#1D4ED8" />
                            <span style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: '600' }}>Submitted successfully · Awaiting teacher review</span>
                          </div>
                        )}
                        {a.status === 'graded' && a.score !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: radius.md, background: C.successBg, border: '1px solid #A7F3D0' }}>
                            <CheckCircle size={15} color={C.success} />
                            <span style={{ fontSize: '13px', color: C.success, fontWeight: '600' }}>
                              Graded by {a.teacher} · Score: {a.score}% ({a.grade})
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
            <ClipboardList size={40} color={C.lightGray} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '14px', color: C.medGray }}>No assignments in this category.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
