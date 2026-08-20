import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  List,
  ClipboardList,
  Settings,
  LogOut,
  Users,
  CalendarClock,
} from 'lucide-react';
import { Logo, ThemeToggle } from '../ui';
import { authService } from '../../services/api';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const NAV = [
  { to: '/owner', end: true, label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/owner/orders', end: false, label: 'Orders', Icon: ClipboardList },
  { to: '/owner/menu', end: false, label: 'Menu Management', Icon: UtensilsCrossed },
  { to: '/owner/reservations', end: false, label: 'Reservations', Icon: CalendarClock },
  { to: '/owner/customers', end: false, label: 'Customers', Icon: Users },
  { to: '/owner/reports', end: false, label: 'Reports', Icon: List },
  { to: '/owner/settings', end: false, label: 'Settings', Icon: Settings },
];

export default function OwnerLayout() {
  const navigate = useNavigate();
  const { bg, sidebarBg, borderCol, textTitle, navInactive, navHover, dark } = useAdminTheme();

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('df_token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'owner') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex font-body" style={{ background: bg, color: textTitle }}>
      <aside
        className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r"
        style={{ background: sidebarBg, borderColor: borderCol }}
      >
        <div className="p-6 pb-2 flex items-center justify-between gap-3">
          <Logo size="md" onClick={() => navigate('/')} />
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1 mt-6">
          {NAV.map(({ to, end, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all no-underline ${
                  isActive ? '' : 'hover:opacity-90'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'rgba(245,179,1,0.12)', color: '#F5B301' }
                  : { color: navInactive, background: 'transparent' }
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: borderCol }}>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors border"
            style={{
              color: dark ? 'rgba(255,255,255,0.85)' : '#374151',
              borderColor: borderCol,
              background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
