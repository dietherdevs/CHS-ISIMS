import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell, Search, ChevronDown, LogOut, X, Menu, ChevronRight,
} from 'lucide-react';
import { C, shadow, radius } from './theme';
import logoImg from 'figma:asset/d81b8c08f2d9126add4ceb501f1a676b2e6d690c.png';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

interface DashboardLayoutProps {
  role: 'admin' | 'teacher' | 'student';
  navItems: NavItem[];
  children: React.ReactNode;
  userName: string;
  userTitle: string;
  notificationCount?: number;
}

const notifications = [
  { id: 1, text: 'New student registered: Mia Chen',       time: '5 min ago',  unread: true  },
  { id: 2, text: 'Assignment submitted by Lucas Park',      time: '20 min ago', unread: true  },
  { id: 3, text: 'System maintenance scheduled for Sunday', time: '2 hrs ago',  unread: false },
  { id: 4, text: 'Grade export completed successfully',     time: '3 hrs ago',  unread: false },
];

const roleLabelMap = {
  admin:   'Administrator',
  teacher: 'Teacher Portal',
  student: 'Student Portal',
};

/* ─── Sidebar widths ─── */
const SIDEBAR_OPEN   = 256;
const SIDEBAR_CLOSED = 64;

export function DashboardLayout({
  role,
  navItems,
  children,
  userName,
  userTitle,
  notificationCount = 2,
}: DashboardLayoutProps) {
  const navigate  = useNavigate();
  const location  = useLocation();

  /* Sidebar state */
  const [pinned,        setPinned]        = useState(false);   // burger toggle
  const [hovered,       setHovered]       = useState(false);   // hover expand
  const [mobileOpen,    setMobileOpen]    = useState(false);   // mobile drawer
  const [isMobile,      setIsMobile]      = useState(false);

  /* Header dropdowns */
  const [showNotif,   setShowNotif]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal,   setSearchVal]   = useState('');

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Close mobile drawer on navigate */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* Close dropdowns on outside click */
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowNotif(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isExpanded = isMobile ? false : (pinned || hovered);
  const sidebarW   = isExpanded ? SIDEBAR_OPEN : SIDEBAR_CLOSED;
  const initial    = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  /* ── Sidebar inner content ── */
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => {
    const expanded = mobile || isExpanded;
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: expanded ? '12px' : '0px',
          padding: expanded ? '20px 20px 16px' : '20px 0 16px',
          justifyContent: expanded ? 'flex-start' : 'center',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          transition: 'padding 0.25s ease, justify-content 0.25s ease',
          flexShrink: 0,
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: radius.md,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src={logoImg} alt="CHS-ISIMS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <p style={{ color: 'white', fontSize: '15px', fontWeight: '800', lineHeight: '1.2', margin: 0, letterSpacing: '0.3px' }}>CHS-ISIMS</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '9px', lineHeight: '1.4', margin: 0, letterSpacing: '0.5px', fontWeight: '600', textTransform: 'uppercase' }}>College of Health Sciences</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Role Badge */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '12px 20px 8px', overflow: 'hidden', flexShrink: 0 }}
            >
              <span style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.9)',
                borderRadius: radius.full, fontSize: '10px', padding: '4px 12px',
                textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600',
                whiteSpace: 'nowrap',
              }}>
                {roleLabelMap[role]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: expanded ? '8px 12px' : '8px 8px', overflowY: 'auto', overflowX: 'hidden', transition: 'padding 0.25s ease' }}>
          {navItems.map(item => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={!expanded ? item.label : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: expanded ? '10px' : '0px',
                  padding: expanded ? '10px 12px' : '10px 0',
                  justifyContent: expanded ? 'flex-start' : 'center',
                  borderRadius: radius.md,
                  marginBottom: '2px',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  border: 'none', cursor: 'pointer', fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '400',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  flexShrink: 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '28px', background: C.lightMint,
                    borderRadius: '0 3px 3px 0',
                  }} />
                )}
                <Icon size={17} style={{ flexShrink: 0 }} />
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {expanded && item.badge != null && item.badge > 0 && (
                  <span style={{
                    background: C.warning, color: 'white', borderRadius: radius.full,
                    fontSize: '10px', padding: '2px 7px', fontWeight: '700', lineHeight: '1.4',
                    flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                )}
                {!expanded && item.badge != null && item.badge > 0 && (
                  <div style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: C.warning,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info + Sign Out */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: expanded ? '16px' : '12px 8px', transition: 'padding 0.25s ease', flexShrink: 0 }}>
          {expanded ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: radius.full,
                  background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{userName}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', margin: 0 }}>{userTitle}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '8px 12px', borderRadius: radius.md,
                  background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                  border: 'none', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/')}
              title="Sign Out"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 0', borderRadius: radius.md,
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.offWhite }}>

      {/* ── Mobile Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                zIndex: 40,
              }}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -SIDEBAR_OPEN }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_OPEN }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: `${SIDEBAR_OPEN}px`, background: C.forestGreen,
                zIndex: 50, display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', borderRadius: radius.md, padding: '6px', display: 'flex', color: 'white' }}
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      {!isMobile && (
        <motion.aside
          onMouseEnter={() => !pinned && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ width: sidebarW }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          style={{
            background: C.forestGreen, flexShrink: 0,
            display: 'flex', flexDirection: 'column', height: '100%',
            position: 'relative', zIndex: 20, overflow: 'hidden',
          }}
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* ── Main Area ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header
          ref={headerRef}
          style={{
            background: C.white, borderBottom: `1px solid ${C.border}`,
            padding: '0 20px 0 16px', height: '64px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: shadow.header, position: 'relative', zIndex: 10,
            gap: '12px',
          }}
        >
          {/* Left: Burger + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            {/* Burger Button */}
            <button
              onClick={() => isMobile ? setMobileOpen(true) : setPinned(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px', borderRadius: radius.md,
                background: 'transparent', border: `1px solid transparent`,
                cursor: 'pointer', color: C.medGray, flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.paleGreen;
                e.currentTarget.style.borderColor = C.border;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {pinned && !isMobile ? (
                  <motion.span
                    key="chevron"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex' }}
                  >
                    <ChevronRight size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex' }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.medGray, pointerEvents: 'none' }} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search students, teachers, classes…"
                style={{
                  paddingLeft: '36px', paddingRight: '16px', paddingTop: '9px', paddingBottom: '9px',
                  border: `1px solid ${C.lightGray}`, borderRadius: radius.md,
                  fontSize: '13.5px', color: C.charcoal, outline: 'none',
                  background: C.offWhite, width: '100%', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = C.emerald)}
                onBlur={e  => (e.target.style.borderColor = C.lightGray)}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotif(s => !s); setShowProfile(false); }}
                style={{
                  position: 'relative', background: showNotif ? C.paleGreen : 'none',
                  border: `1px solid ${showNotif ? C.border : 'transparent'}`,
                  cursor: 'pointer', padding: '8px', borderRadius: radius.md, display: 'flex',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!showNotif) e.currentTarget.style.background = C.paleGreen; }}
                onMouseLeave={e => { if (!showNotif) e.currentTarget.style.background = 'none'; }}
              >
                <Bell size={19} style={{ color: C.medGray }} />
                {notificationCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '16px', height: '16px', borderRadius: radius.full,
                    background: C.emerald, border: '2px solid white',
                    fontSize: '9px', color: 'white', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {notificationCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '48px', right: 0,
                      background: C.white, borderRadius: radius.lg, boxShadow: shadow.modal,
                      border: `1px solid ${C.border}`, width: '300px', zIndex: 100,
                      transformOrigin: 'top right',
                    }}
                  >
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px', color: C.darkSlate, margin: 0 }}>Notifications</p>
                      <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.medGray, padding: '2px', borderRadius: radius.sm, display: 'flex' }}>
                        <X size={15} />
                      </button>
                    </div>
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        style={{
                          padding: '11px 18px', display: 'flex', gap: '10px',
                          borderBottom: `1px solid ${C.border}`,
                          background: n.unread ? C.paleGreen : 'white',
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.paleMint)}
                        onMouseLeave={e => (e.currentTarget.style.background = n.unread ? C.paleGreen : 'white')}
                      >
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.unread ? C.emerald : 'transparent', flexShrink: 0, marginTop: '5px' }} />
                        <div>
                          <p style={{ fontSize: '13px', color: C.darkSlate, lineHeight: '1.4', margin: 0 }}>{n.text}</p>
                          <p style={{ fontSize: '11px', color: C.medGray, marginTop: '2px', margin: 0 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '11px 18px', textAlign: 'center' }}>
                      <button style={{ fontSize: '13px', color: C.emerald, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowProfile(s => !s); setShowNotif(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  background: showProfile ? C.paleGreen : 'none',
                  border: `1px solid ${showProfile ? C.border : 'transparent'}`,
                  borderRadius: radius.md, padding: '6px 8px', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!showProfile) e.currentTarget.style.background = C.paleGreen; }}
                onMouseLeave={e => { if (!showProfile) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: radius.full,
                  background: C.paleMint, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: C.forestGreen, fontSize: '13px', fontWeight: '700',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="sm:block">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.darkSlate, lineHeight: '1.2', margin: 0 }}>{userName}</p>
                  <p style={{ fontSize: '11px', color: C.medGray, margin: 0 }}>{userTitle}</p>
                </div>
                <ChevronDown size={13} style={{ color: C.medGray, transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '52px', right: 0,
                      background: C.white, borderRadius: radius.lg, boxShadow: shadow.modal,
                      border: `1px solid ${C.border}`, width: '200px', zIndex: 100, padding: '8px',
                      transformOrigin: 'top right',
                    }}
                  >
                    {['My Profile', 'Account Settings', 'Help & Support'].map(item => (
                      <button
                        key={item}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 12px',
                          borderRadius: radius.md, background: 'none', border: 'none',
                          cursor: 'pointer', fontSize: '13.5px', color: C.charcoal,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.paleGreen)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        {item}
                      </button>
                    ))}
                    <div style={{ borderTop: `1px solid ${C.border}`, margin: '4px 0' }} />
                    <button
                      onClick={() => navigate('/')}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 12px',
                        borderRadius: radius.md, background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: '13.5px', color: C.danger,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.dangerBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main
          style={{
            flex: 1,
            overflowY: 'hidden',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
              style={{
                position: 'absolute',
                inset: 0,
                padding: '28px',
                overflowY: 'auto',
                overflowX: 'hidden',
                willChange: 'opacity, transform',
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}