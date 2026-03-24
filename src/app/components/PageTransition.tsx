import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition is intentionally a plain wrapper.
 * The actual enter/exit animation is handled by DashboardLayout's
 * AnimatePresence so we avoid double-animating (which caused white flashes).
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={className} style={{ width: '100%' }}>
      {children}
    </div>
  );
}
