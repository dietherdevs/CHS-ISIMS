import { Outlet } from 'react-router';

/**
 * Root layout — thin shell that renders the matched child route.
 * PortalProvider lives in App.tsx, above RouterProvider, so it
 * is always in the tree before any route component can call usePortal().
 */
export default function RootLayout() {
  return <Outlet />;
}
