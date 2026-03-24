import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, ShieldCheck, BookOpen, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { C, shadow, radius } from '../components/theme';
const logoImg = "https://placehold.co/400x100/154d30/white?text=School+Logo";

type Role = 'admin' | 'teacher' | 'student';

const roles: { role: Role; label: string; desc: string; icon: React.ElementType; bg: string; hoverBg: string }[] = [
  {
    role: 'admin',
    label: 'Login as Admin',
    desc: 'Full system access · Manage users & settings',
    icon: ShieldCheck,
    bg: C.forestGreen,
    hoverBg: '#154d30',
  },
  {
    role: 'teacher',
    label: 'Login as Teacher',
    desc: 'Classes, grading & attendance tools',
    icon: BookOpen,
    bg: C.emerald,
    hoverBg: '#2d7a5a',
  },
  {
    role: 'student',
    label: 'Login as Student',
    desc: 'Subjects, grades & assignments',
    icon: User,
    bg: C.mediumGreen,
    hoverBg: '#3d9970',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState<Role | 'login' | null>(null);
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);

  const handleRoleLogin = (role: Role) => {
    if (loading) return;
    setLoading(role);
    setTimeout(() => navigate(`/${role}`), 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading('login');
    setTimeout(() => navigate('/admin'), 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #EDF7F0 0%, #D8F3DC 45%, #B7E4C7 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '24px',
    }}>

      {/* ── Geometric Background ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[
          { w: 480, h: 480, t: -140, l: -120, op: 0.07 },
          { w: 360, h: 360, t: -80,  l: 80,   op: 0.05 },
          { w: 300, h: 300, b: -80,  r: -60,  op: 0.08 },
          { w: 420, h: 420, b: -160, r: 80,   op: 0.05 },
          { w: 200, h: 200, t: '35%' as any, r: '12%', op: 0.07 },
          { w: 140, h: 140, b: '30%' as any, l: '8%', op: 0.06 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            background: `rgba(27,94,59,${c.op})`,
            width: c.w, height: c.h,
            top: c.t as any, left: c.l as any, bottom: c.b as any, right: c.r as any,
          }} />
        ))}
        {/* Ring accents */}
        <div style={{ position: 'absolute', width: '220px', height: '220px', top: '12%', right: '10%', border: '2px solid rgba(64,145,108,0.15)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '160px', height: '160px', bottom: '14%', left: '6%', border: '2px solid rgba(64,145,108,0.12)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '80px', height: '80px', top: '20%', left: '20%', border: '1.5px solid rgba(64,145,108,0.10)', borderRadius: '50%' }} />
        {/* Dot grids */}
        <svg style={{ position: 'absolute', top: '62%', left: '3%', opacity: 0.14 }} width="120" height="100">
          {[0,1,2,3,4].map(row => [0,1,2,3,4].map(col => (
            <circle key={`${row}-${col}`} cx={col * 22 + 10} cy={row * 20 + 10} r="2.5" fill={C.emerald} />
          )))}
        </svg>
        <svg style={{ position: 'absolute', top: '5%', right: '4%', opacity: 0.11 }} width="96" height="80">
          {[0,1,2,3].map(row => [0,1,2,3].map(col => (
            <circle key={`${row}-${col}`} cx={col * 24 + 10} cy={row * 20 + 10} r="2.5" fill={C.forestGreen} />
          )))}
        </svg>
      </div>

      {/* ── Login Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: C.white,
          borderRadius: radius.xxl,
          padding: '44px 44px 40px',
          width: '100%', maxWidth: '448px',
          boxShadow: '0px 24px 80px rgba(27,94,59,0.14), 0px 4px 16px rgba(0,0,0,0.06)',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
            style={{
              width: '80px', height: '80px', borderRadius: radius.lg,
              overflow: 'hidden',
              boxShadow: `0px 8px 28px rgba(27,94,59,0.3)`, marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            <img src={logoImg} alt="CHS-ISIMS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <h1 style={{ color: C.darkSlate, fontSize: '22px', fontWeight: '800', margin: 0, lineHeight: '1.2', letterSpacing: '0.3px' }}>
            CHS-ISIMS
          </h1>
          <p style={{ color: C.forestGreen, fontSize: '11px', fontWeight: '700', marginTop: '4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            College of Health Sciences
          </p>
          <p style={{ color: C.medGray, fontSize: '13px', marginTop: '6px' }}>
            Integrated School Information Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.charcoal, marginBottom: '7px' }}>
              Email or Username
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email or username"
              style={{
                width: '100%', padding: '11px 14px',
                border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md,
                fontSize: '14px', color: C.charcoal, outline: 'none',
                background: C.offWhite, boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = C.emerald)}
              onBlur={e  => (e.target.style.borderColor = C.lightGray)}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: C.charcoal, marginBottom: '7px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '11px 44px 11px 14px',
                  border: `1.5px solid ${C.lightGray}`, borderRadius: radius.md,
                  fontSize: '14px', color: C.charcoal, outline: 'none',
                  background: C.offWhite, boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = C.emerald)}
                onBlur={e  => (e.target.style.borderColor = C.lightGray)}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.medGray, padding: '2px', display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '22px' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.emerald, fontSize: '13px', fontWeight: '600', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.forestGreen)}
              onMouseLeave={e => (e.currentTarget.style.color = C.emerald)}
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!!loading}
            style={{
              width: '100%', padding: '12px',
              background: loading === 'login'
                ? C.mediumGreen
                : `linear-gradient(135deg, ${C.forestGreen}, ${C.emerald})`,
              color: 'white', border: 'none', borderRadius: radius.md,
              fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: `0px 4px 16px rgba(27,94,59,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading === 'login' ? (
              'Signing in…'
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: C.lightGray }} />
          <span style={{ fontSize: '11.5px', color: C.medGray, fontWeight: '500', whiteSpace: 'nowrap' }}>
            Quick Demo Login
          </span>
          <div style={{ flex: 1, height: '1px', background: C.lightGray }} />
        </div>

        {/* Role Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {roles.map(({ role, label, desc, icon: Icon, bg, hoverBg }, i) => (
            <motion.button
              key={role}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
              onClick={() => handleRoleLogin(role)}
              disabled={!!loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', borderRadius: radius.md,
                background: hoveredRole === role ? C.paleGreen : C.offWhite,
                border: `1.5px solid ${hoveredRole === role ? C.lightMint : C.border}`,
                cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left',
                transition: 'all 0.18s', opacity: loading && loading !== role ? 0.55 : 1,
              }}
              onMouseEnter={() => !loading && setHoveredRole(role)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: radius.md,
                background: hoveredRole === role ? hoverBg : bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.18s',
              }}>
                {loading === role ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '17px', height: '17px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }}
                  />
                ) : (
                  <Icon size={17} color="white" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13.5px', fontWeight: '600', color: C.darkSlate, margin: 0 }}>{label}</p>
                <p style={{ fontSize: '11px', color: C.medGray, margin: '1px 0 0' }}>{desc}</p>
              </div>
              <AnimatePresence>
                {hoveredRole === role && !loading && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowRight size={15} color={C.forestGreen} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!hoveredRole && (
                <span style={{
                  fontSize: '10px', color: bg, fontWeight: '700',
                  background: `${bg}18`, borderRadius: radius.sm, padding: '2px 8px',
                  flexShrink: 0,
                }}>
                  DEMO
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '11.5px', color: C.medGray, marginTop: '24px' }}>
          © 2026 CHS-ISIMS · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}