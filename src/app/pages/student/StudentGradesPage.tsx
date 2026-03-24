import React from 'react';
import { TrendingUp, TrendingDown, Minus, Award, Clock, CheckCircle, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';
import { usePortal } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const subjectColors = [
  { color: C.forestGreen, light: C.paleMint },
  { color: '#0369A1',    light: '#E0F2FE' },
  { color: '#7C3AED',    light: '#F3E8FF' },
  { color: '#92400E',    light: '#FEF3C7' },
  { color: '#065F46',    light: '#ECFDF5' },
  { color: '#9D174D',    light: '#FCE7F3' },
];

function getGradeColor(score: number) {
  if (score >= 93) return { bg: C.paleMint,   text: C.forestGreen };
  if (score >= 87) return { bg: '#E0F2FE',   text: '#0369A1' };
  if (score >= 80) return { bg: '#F3E8FF',   text: '#7C3AED' };
  if (score >= 73) return { bg: '#FEF3C7',   text: '#92400E' };
  return { bg: C.dangerBg, text: C.danger };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.white, borderRadius: radius.md, padding: '10px 14px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <p style={{ fontWeight: '600', color: C.darkSlate, fontSize: '13px', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: C.medGray }}>Score: <strong style={{ color: C.forestGreen }}>{payload[0].value}%</strong></p>
      </div>
    );
  }
  return null;
};

export default function StudentGradesPage() {
  const { studentGrades, gradesSubmitted, gradesSubmittedAt } = usePortal();
  const subjects = Object.values(studentGrades);

  const avg = Math.round(subjects.reduce((a, s) => a + s.score, 0) / subjects.length);
  const gpa = (avg / 100 * 4).toFixed(1);
  const chartData = subjects.map((s, i) => ({ name: s.subject.split(' ')[0], score: s.score, color: subjectColors[i % subjectColors.length].color }));

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>My Grades</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>Term 2, 2025–2026 Academic Year</p>
        </div>
        {gradesSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: radius.md, background: C.successBg, border: `1.5px solid #A7F3D0` }}
          >
            <Zap size={15} color={C.success} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', color: C.success, margin: 0 }}>Grades Updated!</p>
              <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>Prof. Wilson · {gradesSubmittedAt}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Average Score', value: `${avg}%`,  icon: Award,     color: C.forestGreen, bg: C.paleMint },
          { label: 'GPA',          value: gpa,          icon: TrendingUp, color: '#0369A1',    bg: '#E0F2FE' },
          { label: 'Subjects',     value: subjects.length, icon: CheckCircle, color: '#7C3AED', bg: '#F3E8FF' },
          { label: 'Class Rank',   value: '#3 / 31',    icon: Award,     color: '#92400E',    bg: '#FEF3C7' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: C.white, borderRadius: radius.lg, padding: '20px 24px', boxShadow: shadow.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: radius.md, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: C.medGray, margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: s.color, margin: '3px 0 0' }}>{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Bar Chart */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 4px' }}>Score by Subject</h3>
          <p style={{ fontSize: '12px', color: C.medGray, margin: '0 0 20px' }}>Current term performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis key="xaxis" dataKey="name" tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" domain={[60, 100]} tick={{ fontSize: 11, fill: C.medGray }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Bar key="bar-score" dataKey="score" radius={[5, 5, 0, 0]}>
                {chartData.map((d, i) => <Cell key={`bar-${d.name}-${i}`} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 4px' }}>Grade Distribution</h3>
          <p style={{ fontSize: '12px', color: C.medGray, margin: '0 0 20px' }}>Score breakdown by letter grade</p>
          {[
            { grade: 'A+ / A', range: '90–100%', count: subjects.filter(s => s.score >= 90).length, color: C.forestGreen, bg: C.paleMint },
            { grade: 'B+ / B', range: '80–89%',  count: subjects.filter(s => s.score >= 80 && s.score < 90).length, color: '#0369A1', bg: '#E0F2FE' },
            { grade: 'C+ / C', range: '70–79%',  count: subjects.filter(s => s.score >= 70 && s.score < 80).length, color: '#92400E', bg: '#FEF3C7' },
            { grade: 'D / F',  range: '< 70%',   count: subjects.filter(s => s.score < 70).length,  color: C.danger, bg: C.dangerBg },
          ].map(row => (
            <div key={row.grade} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: row.bg, color: row.color, borderRadius: radius.sm, fontSize: '12px', fontWeight: '700', padding: '2px 8px' }}>{row.grade}</span>
                  <span style={{ fontSize: '12px', color: C.medGray }}>{row.range}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate }}>{row.count} subject{row.count !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ height: '6px', background: C.lightGray, borderRadius: radius.full }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(row.count / subjects.length) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ height: '100%', background: row.color, borderRadius: radius.full }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: '0 0 20px' }}>All Subjects – Detailed View</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {subjects.map((sub, i) => {
            const { color, light } = subjectColors[i % subjectColors.length];
            const gc = getGradeColor(sub.score);
            return (
              <motion.div
                key={sub.subject}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
                style={{
                  padding: '18px', borderRadius: radius.lg, border: `1px solid ${C.border}`,
                  background: C.white, cursor: 'default', transition: 'box-shadow 0.18s',
                  borderTop: `4px solid ${color}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>{sub.subject}</h4>
                      {sub.recentlyUpdated && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ background: C.paleMint, color: C.forestGreen, borderRadius: radius.full, fontSize: '8px', fontWeight: '800', padding: '2px 5px' }}
                        >NEW</motion.span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: C.medGray, margin: 0 }}>{sub.teacher}</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: radius.full, fontSize: '13px', fontWeight: '800', background: gc.bg, color: gc.text, flexShrink: 0 }}>
                    {sub.grade}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color }}>
                    {sub.score}%
                  </span>
                </div>
                <div style={{ height: '6px', background: C.lightGray, borderRadius: radius.full }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    style={{ height: '100%', background: color, borderRadius: radius.full }}
                  />
                </div>
                {sub.submittedAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <Clock size={10} color={C.medGray} />
                    <span style={{ fontSize: '10.5px', color: C.medGray }}>Updated: {sub.submittedAt}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}