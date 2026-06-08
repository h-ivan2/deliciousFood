import { useState, useEffect } from 'react';

import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import {

  LayoutDashboard,

  UtensilsCrossed,

  List,

  ClipboardList,

  Settings,

  LogOut,

} from 'lucide-react';

import { Logo, ThemeToggle } from '../ui';

import { authService, adminService } from '../../services/api';

import { useAdminTheme } from '../../hooks/useAdminTheme';



const NAV = [

  { to: '/admin', end: true, label: 'Dashboard', Icon: LayoutDashboard },

  { to: '/admin/approve', end: false, label: 'Approve Restaurants', Icon: UtensilsCrossed, badgeKey: 'pending' },

  { to: '/admin/restaurants', end: false, label: 'All Restaurants', Icon: List },

  { to: '/admin/reports', end: false, label: 'Reports', Icon: ClipboardList },

  { to: '/admin/settings', end: false, label: 'Settings', Icon: Settings },

];



export default function AdminLayout() {

  const navigate = useNavigate();

  const { bg, sidebarBg, borderCol, textTitle, navInactive, navHover, dark } = useAdminTheme();

  const [pendingCount, setPendingCount] = useState(0);



  useEffect(() => {

    const user = authService.getCurrentUser();

    const token = localStorage.getItem('df_token');

    if (!token) {

      navigate('/login');

      return;

    }

    if (user && user.role !== 'admin') {

      navigate('/login');

      return;

    }

    adminService.getPendingRestaurants().then((list) => setPendingCount(list.length)).catch(() => {});

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

          {NAV.map(({ to, end, label, Icon, badgeKey }) => (

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

              onMouseEnter={(e) => {

                if (!e.currentTarget.classList.contains('active')) {

                  e.currentTarget.style.background = navHover;

                }

              }}

              onMouseLeave={(e) => {

                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';

                if (!isActive) e.currentTarget.style.background = 'transparent';

              }}

            >

              <Icon size={18} className="flex-shrink-0" />

              <span className="flex-1">{label}</span>

              {badgeKey === 'pending' && pendingCount > 0 && (

                <span className="text-[10px] font-black text-white min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-red-500">

                  {pendingCount > 99 ? '99+' : pendingCount}

                </span>

              )}

            </NavLink>

          ))}

        </nav>



        <div

          className="p-4 mx-4 mb-4 rounded-2xl relative overflow-hidden min-h-[160px] border"

          style={{ borderColor: borderCol }}

        >

          <img

            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"

            alt=""

            className="absolute inset-0 w-full h-full object-cover"

          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="relative z-10 p-2 pt-16">

            <p className="text-white font-bold text-xs leading-snug">Delicious food makes every moment special!</p>

            <button

              type="button"

              onClick={() => navigate('/admin/approve')}

              className="mt-3 px-4 py-2 rounded-full text-[10px] font-bold border-none cursor-pointer"

              style={{ background: '#F5B301', color: '#000' }}

            >

              Explore Now

            </button>

          </div>

        </div>



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

            onMouseEnter={(e) => {

              e.currentTarget.style.background = navHover;

            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#ffffff';

            }}

          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>



      <main className="flex-1 overflow-y-auto min-h-screen">

        <Outlet context={{ pendingCount, setPendingCount }} />

      </main>

    </div>

  );

}


