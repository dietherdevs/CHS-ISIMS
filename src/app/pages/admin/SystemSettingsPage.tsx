import React, { useState } from 'react';
import {
  Settings, Bell, Shield, Database, Globe, Mail,
  Moon, Users, Calendar, Save, RotateCcw, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { PageTransition } from '../../components/PageTransition';
import { C, shadow, radius } from '../../components/theme';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: '42px', height: '24px', borderRadius: '12px',
        background: checked ? C.forestGreen : C.lightGray,
        position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.22s', opacity: disabled ? 0.5 : 1, flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: 'absolute', top: '3px',
          width: '18px', height: '18px',
          borderRadius: '50%', background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function SettingRow({ label, description, checked, onChange, disabled }: SettingRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ flex: 1, paddingRight: '24px' }}>
        <p style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>{label}</p>
        <p style={{ fontSize: '12px', color: C.medGray, marginTop: '3px' }}>{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

const settingSections = [
  {
    id: 'general',
    label: 'General',
    icon: Settings,
    color: C.forestGreen,
    bg: C.paleMint,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    color: '#0369A1',
    bg: '#E0F2FE',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F3E8FF',
  },
  {
    id: 'academic',
    label: 'Academic',
    icon: Calendar,
    color: '#92400E',
    bg: '#FEF3C7',
  },
];

export default function SystemSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // General
  const [darkMode,     setDarkMode]     = useState(false);
  const [compactView,  setCompactView]  = useState(false);
  const [autoLogout,   setAutoLogout]   = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Notifications
  const [emailNotifs,     setEmailNotifs]     = useState(true);
  const [gradeAlerts,     setGradeAlerts]     = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(true);
  const [smsNotifs,       setSmsNotifs]       = useState(false);
  const [digestEmail,     setDigestEmail]     = useState(true);

  // Security
  const [twoFactor,     setTwoFactor]     = useState(false);
  const [sessionLogging, setSessionLogging] = useState(true);
  const [ipRestrict,    setIpRestrict]    = useState(false);
  const [auditLog,      setAuditLog]      = useState(true);

  // Academic
  const [autoGradeCalc,  setAutoGradeCalc]  = useState(true);
  const [attendanceReq,  setAttendanceReq]  = useState(true);
  const [parentAccess,   setParentAccess]   = useState(false);
  const [exportReports,  setExportReports]  = useState(true);

  const [schoolName, setSchoolName]   = useState('Greenfield Academy');
  const [adminEmail, setAdminEmail]   = useState('admin@greenfield.edu');
  const [timezone,   setTimezone]     = useState('UTC-5 (Eastern)');
  const [semester,   setSemester]     = useState('Term 2 · Spring 2026');

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings Saved!', {
      description: 'All system settings have been updated and applied.',
      duration: 4000,
      icon: '⚙️',
    });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults.', { duration: 3000 });
  };

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.darkSlate, margin: 0 }}>System Settings</h1>
          <p style={{ fontSize: '14px', color: C.medGray, marginTop: '4px' }}>
            Configure portal preferences, security, and academic options
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', borderRadius: radius.md,
              border: `1.5px solid ${C.lightGray}`, background: 'white',
              cursor: 'pointer', fontSize: '14px', color: C.medGray, fontWeight: '600',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.offWhite; e.currentTarget.style.borderColor = C.border; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = C.lightGray; }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 22px', borderRadius: radius.md,
              background: saved ? C.mediumGreen : C.forestGreen,
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600',
              boxShadow: `0px 4px 12px rgba(27,94,59,0.3)`, transition: 'all 0.18s',
            }}
            onMouseEnter={e => { if (!saved) e.currentTarget.style.background = '#154d30'; }}
            onMouseLeave={e => { if (!saved) e.currentTarget.style.background = C.forestGreen; }}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>

        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {settingSections.map(s => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 14px', borderRadius: radius.md,
                  background: isActive ? s.bg : 'white',
                  border: `1.5px solid ${isActive ? `${s.color}40` : C.lightGray}`,
                  cursor: 'pointer', fontSize: '13.5px', fontWeight: isActive ? '700' : '500',
                  color: isActive ? s.color : C.charcoal,
                  transition: 'all 0.18s', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.offWhite; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white'; }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: radius.sm, background: isActive ? `${s.color}18` : C.offWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={isActive ? s.color : C.medGray} />
                </div>
                {s.label}
              </button>
            );
          })}

          {/* System Info Card */}
          <div style={{ background: C.paleGreen, borderRadius: radius.lg, padding: '16px', marginTop: '8px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Database size={14} color={C.forestGreen} />
              <p style={{ fontSize: '12px', fontWeight: '700', color: C.forestGreen, margin: 0 }}>System Status</p>
            </div>
            {[
              { label: 'Version', value: 'v3.2.1' },
              { label: 'DB Status', value: 'Online ✓' },
              { label: 'Uptime', value: '99.8%' },
              { label: 'Last Backup', value: '2h ago' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: C.medGray }}>{item.label}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: C.darkSlate }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div>
          {/* General */}
          {activeSection === 'general' && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              {/* School Info */}
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Globe size={16} color={C.forestGreen} />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>School Information</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'School Name',     value: schoolName,  set: setSchoolName },
                    { label: 'Admin Email',      value: adminEmail,  set: setAdminEmail },
                    { label: 'Timezone',         value: timezone,    set: setTimezone },
                    { label: 'Current Semester', value: semester,    set: setSemester },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.charcoal, marginBottom: '6px' }}>{f.label}</label>
                      <input
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        style={{
                          width: '100%', padding: '9px 12px',
                          border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md,
                          fontSize: '13.5px', color: C.charcoal, outline: 'none',
                          background: C.offWhite, boxSizing: 'border-box', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => (e.target.style.borderColor = C.emerald)}
                        onBlur={e  => (e.target.style.borderColor = C.lightGray)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Moon size={16} color={C.forestGreen} />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Display Preferences</h3>
                </div>
                <SettingRow label="Dark Mode" description="Switch to a dark color scheme across the portal" checked={darkMode} onChange={setDarkMode} />
                <SettingRow label="Compact View" description="Reduce spacing to show more content on screen" checked={compactView} onChange={setCompactView} />
                <SettingRow label="Auto Logout" description="Automatically log out after 30 minutes of inactivity" checked={autoLogout} onChange={setAutoLogout} />
                <SettingRow label="System Alerts" description="Show system-wide banners for important updates" checked={systemAlerts} onChange={setSystemAlerts} />
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Mail size={16} color="#0369A1" />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Email & Alert Preferences</h3>
                </div>
                <SettingRow label="Email Notifications" description="Receive email updates for key system events" checked={emailNotifs} onChange={setEmailNotifs} />
                <SettingRow label="Grade Submission Alerts" description="Notify admins when teachers submit grades" checked={gradeAlerts} onChange={setGradeAlerts} />
                <SettingRow label="Attendance Reports" description="Daily attendance summary sent to administrators" checked={attendanceAlert} onChange={setAttendanceAlert} />
                <SettingRow label="SMS Notifications" description="Send SMS alerts for urgent announcements (premium)" checked={smsNotifs} onChange={setSmsNotifs} />
                <SettingRow label="Weekly Digest Email" description="Summary of the week's activity every Friday" checked={digestEmail} onChange={setDigestEmail} />
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Shield size={16} color="#7C3AED" />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Access & Security Controls</h3>
                </div>
                <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin accounts (recommended)" checked={twoFactor} onChange={setTwoFactor} />
                <SettingRow label="Session Activity Logging" description="Log all user login and logout events" checked={sessionLogging} onChange={setSessionLogging} />
                <SettingRow label="IP Address Restriction" description="Restrict access to approved IP ranges only" checked={ipRestrict} onChange={setIpRestrict} />
                <SettingRow label="Audit Log" description="Keep a full audit trail of admin actions" checked={auditLog} onChange={setAuditLog} />
              </div>
              <div style={{ marginTop: '16px', padding: '16px 20px', borderRadius: radius.md, background: '#F3E8FF', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Shield size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#5B21B6', margin: 0, lineHeight: '1.5' }}>
                  <strong>Security Reminder:</strong> Always keep 2FA enabled for administrator accounts. Review the audit log regularly for suspicious activity.
                </p>
              </div>
            </motion.div>
          )}

          {/* Academic */}
          {activeSection === 'academic' && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Calendar size={16} color="#92400E" />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Academic Configuration</h3>
                </div>
                <SettingRow label="Automatic GPA Calculation" description="Automatically recalculate GPA when grades change" checked={autoGradeCalc} onChange={setAutoGradeCalc} />
                <SettingRow label="Attendance Requirements" description="Enforce minimum 80% attendance for grade submission" checked={attendanceReq} onChange={setAttendanceReq} />
                <SettingRow label="Parent/Guardian Portal Access" description="Allow parents to view their student's performance" checked={parentAccess} onChange={setParentAccess} />
                <SettingRow label="Automated Report Exports" description="Generate and email reports at end of each term" checked={exportReports} onChange={setExportReports} />
              </div>

              {/* Grade Scale */}
              <div style={{ background: C.white, borderRadius: radius.lg, padding: '24px', boxShadow: shadow.card, border: `1px solid ${C.border}`, marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Users size={16} color="#92400E" />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>Grade Scale Reference</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                  {[
                    { range: '97–100', letter: 'A+', color: C.forestGreen, bg: C.paleMint },
                    { range: '93–96',  letter: 'A',  color: C.forestGreen, bg: C.paleMint },
                    { range: '90–92',  letter: 'A−', color: C.emerald,     bg: '#ECFDF5' },
                    { range: '87–89',  letter: 'B+', color: '#0369A1',     bg: '#E0F2FE' },
                    { range: '83–86',  letter: 'B',  color: '#0369A1',     bg: '#E0F2FE' },
                    { range: '80–82',  letter: 'B−', color: '#0369A1',     bg: '#E0F2FE' },
                    { range: '77–79',  letter: 'C+', color: '#92400E',     bg: '#FEF3C7' },
                    { range: '70–76',  letter: 'C',  color: '#92400E',     bg: '#FEF3C7' },
                  ].map(g => (
                    <div key={g.letter} style={{ padding: '10px', borderRadius: radius.sm, background: g.bg, textAlign: 'center', border: `1px solid ${g.color}20` }}>
                      <p style={{ fontSize: '16px', fontWeight: '800', color: g.color, margin: 0 }}>{g.letter}</p>
                      <p style={{ fontSize: '10.5px', color: C.medGray, margin: '3px 0 0' }}>{g.range}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}