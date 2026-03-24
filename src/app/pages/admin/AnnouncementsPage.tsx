import React, { useState } from 'react';
import { Plus, Megaphone, Trash2, Edit3, Users, Clock, AlertCircle, Info, ChevronDown, GraduationCap, BookOpen, Globe, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { usePortal, AudienceTarget, isAnnouncementForStudents, isAnnouncementForTeachers, Announcement } from '../../context/PortalContext';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

const priorityConfig = {
  high:   { bg: C.dangerBg,  border: '#FCA5A5', text: C.danger,  label: 'High Priority',  dot: '#EF4444' },
  medium: { bg: C.warningBg, border: '#FDE68A', text: C.warning, label: 'Medium Priority', dot: '#F59E0B' },
  low:    { bg: C.successBg, border: '#A7F3D0', text: C.success, label: 'Low Priority',    dot: '#40916C' },
};

const AUDIENCE_OPTIONS: {
  value: AudienceTarget; label: string; icon: React.ElementType;
  forStudents: boolean; forTeachers: boolean; color: string; bg: string;
}[] = [
  { value: 'All Students',            label: 'All Students',            icon: GraduationCap, forStudents: true,  forTeachers: false, color: '#0369A1',      bg: '#E0F2FE'  },
  { value: 'All Teachers',            label: 'All Teachers',            icon: BookOpen,      forStudents: false, forTeachers: true,  color: '#7C3AED',      bg: '#F3E8FF'  },
  { value: 'All Students & Teachers', label: 'All Students & Teachers', icon: Globe,         forStudents: true,  forTeachers: true,  color: C.forestGreen,  bg: C.paleMint },
  { value: 'Grade 9 Students',        label: 'Grade 9 Students',        icon: GraduationCap, forStudents: true,  forTeachers: false, color: '#92400E',      bg: '#FEF3C7'  },
  { value: 'Grade 10 Students',       label: 'Grade 10 Students',       icon: GraduationCap, forStudents: true,  forTeachers: false, color: '#065F46',      bg: '#ECFDF5'  },
  { value: 'Grade 11 Students',       label: 'Grade 11 Students',       icon: GraduationCap, forStudents: true,  forTeachers: false, color: '#9D174D',      bg: '#FCE7F3'  },
  { value: 'Grade 12 Students',       label: 'Grade 12 Students',       icon: GraduationCap, forStudents: true,  forTeachers: false, color: '#1E40AF',      bg: '#EFF6FF'  },
];

function getAudienceMeta(audience: AudienceTarget) {
  return AUDIENCE_OPTIONS.find(o => o.value === audience) ?? AUDIENCE_OPTIONS[0];
}

function AudienceChip({ audience }: { audience: AudienceTarget }) {
  const meta = getAudienceMeta(audience);
  const Icon = meta.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: meta.bg, color: meta.color,
      borderRadius: radius.full, fontSize: '11px', fontWeight: '600', padding: '3px 9px',
    }}>
      <Icon size={10} /> {audience}
    </span>
  );
}

// ── Shared modal form ──────────────────────────────────────────────────────────
interface AnnouncementModalProps {
  mode: 'create' | 'edit';
  initial?: Announcement;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; priority: 'high' | 'medium' | 'low'; audience: AudienceTarget }) => void;
}

function AnnouncementModal({ mode, initial, onClose, onSubmit }: AnnouncementModalProps) {
  const [title,    setTitle]    = useState(initial?.title    ?? '');
  const [content,  setContent]  = useState(initial?.content  ?? '');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initial?.priority ?? 'medium');
  const [audience, setAudience] = useState<AudienceTarget>(initial?.audience ?? 'All Students');

  const selectedMeta = getAudienceMeta(audience);
  const isEdit = mode === 'edit';

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content.');
      return;
    }
    onSubmit({ title, content, priority, audience });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)', padding: '20px' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: C.white, borderRadius: radius.xl, width: '100%', maxWidth: '520px', boxShadow: shadow.modal, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: radius.md, background: isEdit ? '#EFF6FF' : C.paleMint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isEdit ? <Edit3 size={18} color="#1E40AF" /> : <Megaphone size={18} color={C.forestGreen} />}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: C.darkSlate }}>
                {isEdit ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.medGray }}>
                {isEdit ? 'Changes will reflect instantly on all recipient dashboards' : 'Delivered instantly to selected recipients'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: C.offWhite, border: `1px solid ${C.border}`, cursor: 'pointer', color: C.medGray, padding: '5px 7px', borderRadius: radius.md, lineHeight: 1, fontSize: '14px', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.dangerBg; (e.currentTarget as HTMLButtonElement).style.color = C.danger; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.offWhite; (e.currentTarget as HTMLButtonElement).style.color = C.medGray; }}
            >✕</button>
          </div>

          {/* Delivery preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{ background: selectedMeta.bg, border: `1px solid ${selectedMeta.color}25`, borderRadius: radius.md, padding: '10px 14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <selectedMeta.icon size={14} color={selectedMeta.color} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '12px', color: selectedMeta.color, fontWeight: '600', flex: 1 }}>
                Visible on:{' '}
                {[selectedMeta.forStudents && 'Student Dashboard', selectedMeta.forTeachers && 'Teacher Dashboard'].filter(Boolean).join(' & ')}
              </p>
              <div style={{ display: 'flex', gap: '5px' }}>
                {selectedMeta.forStudents && (
                  <span style={{ fontSize: '10px', fontWeight: '700', background: 'rgba(3,105,161,0.12)', color: '#0369A1', borderRadius: radius.full, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <GraduationCap size={9} /> Students
                  </span>
                )}
                {selectedMeta.forTeachers && (
                  <span style={{ fontSize: '10px', fontWeight: '700', background: 'rgba(124,58,237,0.12)', color: '#7C3AED', borderRadius: radius.full, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <BookOpen size={9} /> Teachers
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ padding: '0 28px 24px' }}>
          {/* Title */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.charcoal, marginBottom: '5px' }}>Title *</label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Campus closed on Friday"
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '13.5px', color: C.charcoal, outline: 'none', background: C.offWhite, boxSizing: 'border-box', transition: 'border-color 0.18s' }}
              onFocus={e => (e.target.style.borderColor = C.emerald)}
              onBlur={e  => (e.target.style.borderColor = C.lightGray)}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.charcoal, marginBottom: '5px' }}>Message *</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              rows={3} placeholder="Enter the full announcement message…"
              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '13.5px', color: C.charcoal, outline: 'none', background: C.offWhite, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.18s' }}
              onFocus={e => (e.target.style.borderColor = C.emerald)}
              onBlur={e  => (e.target.style.borderColor = C.lightGray)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.charcoal, marginBottom: '5px' }}>Priority</label>
              <select
                value={priority} onChange={e => setPriority(e.target.value as any)}
                style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md, fontSize: '13px', color: C.charcoal, outline: 'none', background: C.offWhite, boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.charcoal, marginBottom: '5px' }}>Audience</label>
              <select
                value={audience} onChange={e => setAudience(e.target.value as AudienceTarget)}
                style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${selectedMeta.color}55`, borderRadius: radius.md, fontSize: '13px', color: selectedMeta.color, outline: 'none', background: selectedMeta.bg, boxSizing: 'border-box', cursor: 'pointer', fontWeight: '600', transition: 'all 0.18s' }}
              >
                <optgroup label="All Users">
                  <option value="All Students">👨‍🎓 All Students</option>
                  <option value="All Teachers">👩‍🏫 All Teachers</option>
                  <option value="All Students & Teachers">🌐 All Students & Teachers</option>
                </optgroup>
                <optgroup label="Specific Grade">
                  <option value="Grade 9 Students">Grade 9 Students</option>
                  <option value="Grade 10 Students">Grade 10 Students</option>
                  <option value="Grade 11 Students">Grade 11 Students</option>
                  <option value="Grade 12 Students">Grade 12 Students</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: '10px', borderRadius: radius.md, border: `1.5px solid ${C.lightGray}`, background: 'white', cursor: 'pointer', fontSize: '13.5px', color: C.medGray, fontWeight: '600', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >Cancel</button>
            <button
              onClick={handleSubmit}
              style={{ flex: 2, padding: '10px', borderRadius: radius.md, border: 'none', background: isEdit ? `linear-gradient(135deg, #1E40AF, #3B82F6)` : `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`, color: 'white', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: isEdit ? '0px 4px 12px rgba(30,64,175,0.25)' : '0px 4px 12px rgba(27,94,59,0.3)', transition: 'opacity 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {isEdit ? <><Check size={14} /> Save Changes</> : <><Megaphone size={14} /> Publish</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AnnouncementsPage() {
  const { announcements, postAnnouncement, editAnnouncement, deleteAnnouncement } = usePortal();

  const [showCreate,    setShowCreate]    = useState(false);
  const [editingAnn,   setEditingAnn]    = useState<Announcement | null>(null);
  const [confirmDelId, setConfirmDelId]  = useState<number | null>(null);
  const [expandedId,   setExpandedId]    = useState<number | null>(null);

  // ── handlers ──
  const handleCreate = (data: { title: string; content: string; priority: 'high' | 'medium' | 'low'; audience: AudienceTarget }) => {
    postAnnouncement({ ...data, postedBy: 'Dr. Sarah Mitchell' });
    const dests = [
      isAnnouncementForStudents(data.audience) && 'Student Dashboard',
      isAnnouncementForTeachers(data.audience) && 'Teacher Dashboard',
    ].filter(Boolean).join(' & ');
    toast.success('Announcement Published!', { description: `"${data.title}" is now live on: ${dests}.`, duration: 4500, icon: '📢' });
    setShowCreate(false);
  };

  const handleEdit = (data: { title: string; content: string; priority: 'high' | 'medium' | 'low'; audience: AudienceTarget }) => {
    if (!editingAnn) return;
    editAnnouncement(editingAnn.id, data);
    const dests = [
      isAnnouncementForStudents(data.audience) && 'Student Dashboard',
      isAnnouncementForTeachers(data.audience) && 'Teacher Dashboard',
    ].filter(Boolean).join(' & ');
    toast.success('Announcement Updated!', { description: `"${data.title}" changes are live on: ${dests}.`, duration: 4500, icon: '✏️' });
    setEditingAnn(null);
  };

  const handleDelete = (ann: Announcement) => {
    deleteAnnouncement(ann.id);
    setConfirmDelId(null);
    if (expandedId === ann.id) setExpandedId(null);
    toast.success('Announcement deleted.', { duration: 3000, icon: '🗑️' });
  };

  const studentCount = announcements.filter(a => isAnnouncementForStudents(a.audience)).length;
  const teacherCount = announcements.filter(a => isAnnouncementForTeachers(a.audience)).length;

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>Announcements</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>
            Broadcast messages — edits and deletions reflect instantly on all recipient dashboards.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: radius.md, background: C.forestGreen, color: 'white', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', flexShrink: 0, boxShadow: `0px 4px 12px rgba(27,94,59,0.3)`, transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#154d30'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.forestGreen; }}
        >
          <Plus size={15} /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Published',  value: announcements.length,                                   icon: Megaphone,    bg: C.paleMint, color: C.forestGreen },
          { label: 'High Priority',    value: announcements.filter(a => a.priority === 'high').length, icon: AlertCircle,  bg: C.dangerBg, color: C.danger },
          { label: 'Sent to Students', value: studentCount,                                            icon: GraduationCap,bg: '#E0F2FE',  color: '#0369A1' },
          { label: 'Sent to Teachers', value: teacherCount,                                            icon: BookOpen,     bg: '#F3E8FF',  color: '#7C3AED' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: C.white, borderRadius: radius.lg, padding: '16px 18px', boxShadow: shadow.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: radius.md, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: C.medGray, margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: C.darkSlate, margin: '2px 0 0' }}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audience legend */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {AUDIENCE_OPTIONS.map(opt => {
          const count = announcements.filter(a => a.audience === opt.value).length;
          if (count === 0) return null;
          const Icon = opt.icon;
          return (
            <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: opt.bg, borderRadius: radius.full, padding: '4px 10px' }}>
              <Icon size={11} color={opt.color} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: opt.color }}>{opt.label}</span>
              <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: radius.full, padding: '1px 5px', color: opt.color, fontWeight: '700' }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {announcements.map((ann, i) => {
            const cfg       = priorityConfig[ann.priority];
            const isNew     = i === 0 && !ann.editedAt;
            const isEdited  = !!ann.editedAt;
            const isExpanded = expandedId === ann.id;
            const confirmingDelete = confirmDelId === ann.id;

            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -6 }}
                transition={{ duration: 0.22, delay: Math.min(i * 0.03, 0.15) }}
                layout
                style={{ background: C.white, borderRadius: radius.lg, boxShadow: shadow.card, border: `1px solid ${C.border}`, overflow: 'hidden', borderLeft: `4px solid ${cfg.text}` }}
              >
                {/* Main row */}
                <div
                  style={{ padding: '18px 20px', cursor: 'pointer' }}
                  onClick={() => !confirmingDelete && setExpandedId(isExpanded ? null : ann.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        {isNew && (
                          <motion.span
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ background: C.forestGreen, color: 'white', borderRadius: radius.full, fontSize: '10px', fontWeight: '700', padding: '2px 7px' }}
                          >NEW</motion.span>
                        )}
                        {isEdited && (
                          <motion.span
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ background: '#EFF6FF', color: '#1E40AF', borderRadius: radius.full, fontSize: '10px', fontWeight: '700', padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          ><Edit3 size={9} /> UPDATED</motion.span>
                        )}
                        {/* Priority dot badge */}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: radius.full, fontSize: '11px', fontWeight: '600', padding: '2px 8px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                          {cfg.label}
                        </span>
                        <AudienceChip audience={ann.audience} />
                      </div>

                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: C.darkSlate, margin: '0 0 4px' }}>{ann.title}</h3>
                      <p style={{ fontSize: '12.5px', color: C.medGray, margin: 0, lineHeight: '1.5', display: isExpanded ? 'block' : '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ann.content}
                      </p>

                      {/* Visible on */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                        <span style={{ fontSize: '10.5px', color: C.medGray }}>Visible on:</span>
                        {isAnnouncementForStudents(ann.audience) && (
                          <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#0369A1', background: '#E0F2FE', borderRadius: radius.full, padding: '1px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <GraduationCap size={9} /> Student Dashboard
                          </span>
                        )}
                        {isAnnouncementForTeachers(ann.audience) && (
                          <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#7C3AED', background: '#F3E8FF', borderRadius: radius.full, padding: '1px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <BookOpen size={9} /> Teacher Dashboard
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <button
                        title="Edit"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, padding: '6px', borderRadius: radius.sm, transition: 'all 0.15s', display: 'flex' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#1E40AF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = C.medGray; }}
                        onClick={e => { e.stopPropagation(); setConfirmDelId(null); setEditingAnn(ann); }}
                      ><Edit3 size={14} /></button>

                      <button
                        title="Delete"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, padding: '6px', borderRadius: radius.sm, transition: 'all 0.15s', display: 'flex' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.dangerBg; (e.currentTarget as HTMLButtonElement).style.color = C.danger; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = C.medGray; }}
                        onClick={e => { e.stopPropagation(); setConfirmDelId(confirmingDelete ? null : ann.id); }}
                      ><Trash2 size={14} /></button>

                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', padding: '6px' }}>
                        <ChevronDown size={14} color={C.medGray} />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Inline delete confirmation */}
                <AnimatePresence>
                  {confirmingDelete && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '10px 20px 14px', borderTop: `1px solid #FCA5A5`, background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <p style={{ margin: 0, fontSize: '12.5px', color: C.danger, fontWeight: '600' }}>
                          🗑️ Delete this announcement? It will be removed from all dashboards.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmDelId(null); }}
                            style={{ padding: '5px 12px', borderRadius: radius.sm, border: `1px solid ${C.border}`, background: 'white', color: C.medGray, cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                          >Cancel</button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(ann); }}
                            style={{ padding: '5px 14px', borderRadius: radius.sm, border: 'none', background: C.danger, color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', transition: 'opacity 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                          ><Trash2 size={11} /> Delete</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && !confirmingDelete && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 20px 18px', borderTop: `1px solid ${C.border}`, paddingTop: '14px' }}>
                        <p style={{ fontSize: '13.5px', color: C.charcoal, lineHeight: '1.7', margin: '0 0 14px' }}>{ann.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={12} color={C.medGray} />
                            <span style={{ fontSize: '11.5px', color: C.medGray }}>Posted: {ann.postedAt}</span>
                          </div>
                          {ann.editedAt && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Edit3 size={12} color='#1E40AF' />
                              <span style={{ fontSize: '11.5px', color: '#1E40AF', fontWeight: '600' }}>Edited: {ann.editedAt}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Info size={12} color={C.medGray} />
                            <span style={{ fontSize: '11.5px', color: C.medGray }}>By: {ann.postedBy}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {announcements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '52px 20px', background: C.white, borderRadius: radius.lg, border: `1px dashed ${C.border}` }}>
            <Megaphone size={32} color={C.lightGray} style={{ marginBottom: '10px' }} />
            <p style={{ color: C.medGray, fontSize: '14px', margin: 0 }}>No announcements yet. Click <strong>New Announcement</strong> to get started.</p>
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <AnnouncementModal
            mode="create"
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingAnn && (
          <AnnouncementModal
            mode="edit"
            initial={editingAnn}
            onClose={() => setEditingAnn(null)}
            onSubmit={handleEdit}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
