import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { ThemeToggle } from '../../components/ui';
import {
  Utensils,
  Store,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Server,
  Database,
  HardDrive,
  Activity,
  ChevronDown,
  Coffee,
  ShoppingBag,
  Pizza,
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminService, authService } from '../../services/api';
import {
  IMG_HERO_BG,
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_PROMO_CARD,
} from '../../constants/images';

const ORDERS_DATA = [
  { name: 'Mon', orders: 40 },
  { name: 'Tue', orders: 55 },
  { name: 'Wed', orders: 80 },
  { name: 'Thu', orders: 45 },
  { name: 'Fri', orders: 110 },
  { name: 'Sat', orders: 120 },
  { name: 'Sun', orders: 60 },
];

const PIE_DATA = [
  { name: 'Approved', value: 198, color: '#22c55e' },
  { name: 'Pending', value: 18, color: '#F5B301' },
  { name: 'Rejected', value: 29, color: '#ef4444' },
];

const FILLER_REGISTRATIONS = [
  { _id: 'stat_p1', name: 'Pizza Point', owner: { name: 'Mario' }, createdAt: '15 min ago', status: 'approved' },
  { _id: 'stat_p2', name: 'Burger House', owner: { name: 'Dan' }, createdAt: '25 min ago', status: 'approved' },
  { _id: 'stat_p3', name: 'Ocean Delight', owner: { name: 'John' }, createdAt: '40 min ago', status: 'rejected' },
];

const TOP_RESTAURANTS = [
  { name: 'The Green Bowl', rating: '4.8', orders: '1,246', revenue: '$4,230', img: IMG_REST_GREEN_BOWL },
  { name: 'Spice Route', rating: '4.6', orders: '1,034', revenue: '$3,560', img: IMG_REST_SPICE_ROUTE },
  { name: 'Pizza Point', rating: '4.7', orders: '987', revenue: '$2,980', img: IMG_REST_PIZZA_POINT },
  { name: 'Burger House', rating: '4.9', orders: '876', revenue: '$2,340', img: IMG_REST_BURGER_HOUSE },
];

function formatRegDate(createdAt) {
  if (!createdAt) return 'Recently';
  if (typeof createdAt === 'string' && !createdAt.includes('T')) return createdAt;
  return 'Today';
}

export default function AdminDashboardHome() {
  const { dark, bg, cardBg, textTitle, textSub, borderCol, inputBg, inputBorder, inputColor } = useAdminTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      const token = localStorage.getItem('df_token');
      if (!token) {
        navigate('/login');
        return;
      }
    }
    setCurrentUser(user || { name: 'Super Admin', email: 'admin@delicious.com', role: 'admin' });
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sData, pData, aData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingRestaurants(),
        adminService.getRecentActivities(),
      ]);
      setStats(sData);
      setPendingRestaurants(pData);
      setRecentActivities(aData);
    } catch {
      addToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const displayName = currentUser?.name || 'Super Admin';
  const revenueDisplay =
    stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toLocaleString()}` : '—';

  const registrationRows = [
    ...pendingRestaurants.slice(0, 5),
    ...FILLER_REGISTRATIONS.slice(0, Math.max(0, 5 - pendingRestaurants.length)),
  ].slice(0, 5);

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-6" style={{ background: bg }}>
        <div
          className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#F5B301', borderTopColor: 'transparent' }}
        />
        <p className="font-bold text-sm tracking-wide" style={{ color: textSub }}>
          Loading platform settings...
        </p>
      </div>
    );
  }

  return (
    <div className="font-body min-h-full" style={{ background: bg, color: textTitle }}>
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="rounded-2xl p-5 flex items-center gap-4 shadow-xl border backdrop-blur-md max-w-sm"
              style={{
                background: dark ? 'rgba(15,21,36,0.92)' : 'rgba(255,255,255,0.96)',
                borderColor: t.type === 'error' ? '#ef4444' : '#F5B301',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                color: textTitle,
              }}
            >
              {t.type === 'error' ? (
                <XCircle size={20} color="#ef4444" className="flex-shrink-0" />
              ) : (
                <CheckCircle2 size={20} color="#F5B301" className="flex-shrink-0" />
              )}
              <span className="text-sm font-semibold leading-relaxed">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-8 lg:px-16 py-10 lg:py-12 max-w-[1600px]">
        <header
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12 pb-10 border-b"
          style={{ borderColor: borderCol }}
        >
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight leading-none">
                Welcome back, {displayName}!
              </h1>
              <span
                className="text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full"
                style={{
                  background: 'rgba(245,179,1,0.08)',
                  border: '1px solid rgba(245,179,1,0.3)',
                  color: '#F5B301',
                }}
              >
                SUPER ADMIN
              </span>
            </div>
            <p className="text-sm mt-3 font-semibold" style={{ color: textSub }}>
              Here&apos;s what&apos;s happening on your platform today.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search for restaurants, users, order..."
                readOnly
                className="w-full text-xs rounded-full py-4 pl-12 pr-4 outline-none border transition-all duration-200"
                style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; }}
              />
            </div>

            <ThemeToggle />

            <button
              type="button"
              className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: inputBg, color: textTitle, border: `1px solid ${borderCol}` }}
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileDropdown((p) => !p)}
                className="flex items-center gap-3.5 cursor-pointer border-none bg-transparent text-left"
                style={{ color: textTitle }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                  style={{ background: '#F5B301', color: '#000' }}
                >
                  SA
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-xs leading-snug">{currentUser?.name}</div>
                  <div className="text-[10px] leading-tight" style={{ color: textSub }}>
                    Administrator
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: textSub }} />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-60 rounded-3xl shadow-2xl border p-4 z-50"
                    style={{ background: cardBg, borderColor: borderCol }}
                  >
                    <div className="px-4 py-3 border-b text-xs mb-2" style={{ borderColor: borderCol, color: textTitle }}>
                      <div className="font-bold truncate">{currentUser?.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate('/admin/settings');
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left border-none bg-transparent font-bold text-xs cursor-pointer"
                      style={{ color: textTitle }}
                    >
                      <Settings size={14} /> Profile Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left border-none bg-transparent text-red-500 hover:bg-red-500/10 font-bold text-xs cursor-pointer"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { label: 'Total Restaurants', value: stats?.totalRestaurants, Icon: Store, change: '+12%', color: '#F5B301' },
              { label: 'Total Owners', value: stats?.totalOwners, Icon: Users, change: '+16%', color: '#22c55e' },
              { label: 'Total Customers', value: stats?.totalCustomers, Icon: Users, change: '+14%', color: '#3b82f6' },
              { label: 'Total Orders', value: stats?.totalOrders, Icon: Utensils, change: '+21%', color: '#a855f7' },
              { label: 'Total Revenues', value: revenueDisplay, Icon: BarChart3, change: '+12%', color: '#f43f5e' },
            ].map(({ label, value, Icon, change, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -6 }}
                className="rounded-3xl p-8 border flex flex-col justify-between min-h-[140px] transition-shadow duration-300"
                style={{ background: cardBg, borderColor: borderCol }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={22} color={color} />
                  </div>
                  <span className="text-[10px] font-black text-green-500">{change}</span>
                </div>
                <div className="mt-6">
                  <div className="text-3xl lg:text-4xl font-black leading-none tracking-tight">{value ?? '—'}</div>
                  <div className="text-[10px] mt-2 uppercase font-black tracking-widest opacity-60">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className="relative rounded-3xl overflow-hidden h-[240px] lg:h-[300px] shadow-xl border"
            style={{ borderColor: borderCol }}
          >
            <img src={IMG_HERO_BG} alt="Delicious food showcase" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent flex flex-col justify-center px-12 lg:px-20">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase mb-4 px-6 py-3 rounded-full w-fit"
                style={{
                  color: '#F5B301',
                  background: 'rgba(245,179,1,0.2)',
                  border: '1px solid rgba(245,179,1,0.4)',
                }}
              >
                Premium Food Operations
              </span>
              <h2 className="text-white text-2xl lg:text-4xl font-black leading-tight max-w-lg tracking-tight">
                Delighting Customers,
                <br />
                Empowering Restaurant Owners.
              </h2>
              <p className="text-white/60 text-xs mt-4 max-w-sm leading-relaxed">
                Manage pending submissions, control roles, and review platform audits with space and ease.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-black text-base lg:text-lg leading-tight">Recent Registrations</h3>
                  <p className="text-[11px] mt-1" style={{ color: textSub }}>
                    Pending approvals in pipeline
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/approve')}
                  className="px-4 py-2 rounded-full text-[10px] font-bold border cursor-pointer transition-all"
                  style={{ borderColor: '#F5B301', color: '#F5B301', background: 'transparent' }}
                >
                  View All
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-5">
                {registrationRows.map((rest) => {
                  const isPending = rest.status === 'pending';
                  const isApproved = rest.status === 'approved';
                  return (
                    <div
                      key={rest._id}
                      className="flex items-center justify-between py-4 border-b"
                      style={{ borderColor: borderCol }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,179,1,0.15)' }}>
                          <Store size={20} color="#F5B301" />
                        </div>
                        <div>
                          <div className="font-black text-xs leading-snug">{rest.name}</div>
                          <div className="text-[10px] mt-1" style={{ color: textSub }}>
                            Owner: {rest.owner?.name} · {formatRegDate(rest.createdAt)}
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-bold uppercase px-3 py-1.5 rounded-full"
                        style={{
                          background: isPending
                            ? 'rgba(245,179,1,0.12)'
                            : isApproved
                              ? 'rgba(34,197,94,0.12)'
                              : 'rgba(239,68,68,0.12)',
                          color: isPending ? '#F5B301' : isApproved ? '#22c55e' : '#ef4444',
                          border: `1px solid ${
                            isPending
                              ? 'rgba(245,179,1,0.3)'
                              : isApproved
                                ? 'rgba(34,197,94,0.3)'
                                : 'rgba(239,68,68,0.3)'
                          }`,
                        }}
                      >
                        {rest.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-black text-base lg:text-lg leading-tight">Orders Overview</h3>
                  <p className="text-[11px] mt-1" style={{ color: textSub }}>
                    Daily order transaction trends
                  </p>
                </div>
                <select
                  className="text-[10px] font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer"
                  style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                >
                  <option>This week</option>
                  <option>Last month</option>
                </select>
              </div>
              <div className="flex-1 min-h-[200px] pt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ORDERS_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F5B301" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#F5B301" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: textSub }} dy={10} />
                    <Tooltip
                      contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: '12px', color: textTitle }}
                      itemStyle={{ color: '#F5B301' }}
                    />
                    <Area type="monotone" dataKey="orders" stroke="#F5B301" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
              <div>
                <h3 className="font-black text-base lg:text-lg leading-tight">Registration Status</h3>
                <p className="text-[11px] mt-1" style={{ color: textSub }}>
                  Platform onboarding diagnostics
                </p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 items-center mt-6">
                <div className="relative flex items-center justify-center h-[130px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_DATA} innerRadius="75%" outerRadius="100%" dataKey="value" stroke="none">
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: '12px', fontSize: '12px', color: textTitle }}
                        itemStyle={{ color: textTitle }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center pointer-events-none">
                    <div className="text-2xl font-black leading-none">245</div>
                    <div className="text-[8px] font-black uppercase tracking-widest mt-1" style={{ color: textSub }}>
                      Total
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {PIE_DATA.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                        <span className="font-semibold opacity-75">{name}</span>
                      </div>
                      <span className="font-extrabold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-base lg:text-lg leading-tight">Top performing Restaurants</h3>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/restaurants')}
                    className="text-xs font-black hover:underline"
                    style={{ color: '#F5B301' }}
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                  {TOP_RESTAURANTS.map((r) => (
                    <div
                      key={r.name}
                      className="rounded-3xl border overflow-hidden flex flex-col shadow-sm"
                      style={{ background: cardBg, borderColor: borderCol }}
                    >
                      <div className="h-36 relative">
                        <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3.5 right-3.5 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black text-amber-400">
                          ★ {r.rating}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-extrabold text-xs truncate leading-snug">{r.name}</h4>
                        <div className="flex justify-between items-center mt-3.5 text-[10px] font-black">
                          <span style={{ color: textSub }}>{r.orders} Orders</span>
                          <span style={{ color: '#F5B301' }}>{r.revenue} Rev</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className="rounded-3xl p-8 border relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-md"
                  style={{ borderColor: borderCol }}
                >
                  <img src={IMG_PROMO_CARD} alt="Promo" className="absolute inset-0 w-full h-full object-cover z-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />
                  <div className="relative z-20">
                    <h4 className="text-white font-extrabold text-sm mb-1">Food that brings people together</h4>
                    <p className="text-white/60 text-[10px] mb-4">Great taste, happy life</p>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/approve')}
                      className="px-6 py-3 rounded-full text-[9px] font-black border-none cursor-pointer"
                      style={{ background: '#F5B301', color: '#000' }}
                    >
                      Explore Restaurants
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-black text-xs uppercase tracking-widest opacity-60">Recent Activities</h4>
                    <button type="button" className="text-[10px] font-black hover:underline" style={{ color: '#F5B301' }}>
                      View All
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {recentActivities.slice(0, 4).map((act) => (
                      <div key={act.id} className="flex items-start gap-4 text-xs py-1.5">
                        <span className="mt-0.5 flex-shrink-0">
                          {act.type === 'pending' ? (
                            <Bell size={14} className="text-blue-500" />
                          ) : act.type === 'approval' ? (
                            <CheckCircle2 size={14} className="text-green-500" />
                          ) : act.type === 'rejection' ? (
                            <XCircle size={14} className="text-red-500" />
                          ) : (
                            <Settings size={14} style={{ color: textSub }} />
                          )}
                        </span>
                        <div className="flex-1 leading-relaxed">
                          <span className="font-bold">{act.text}</span>
                          <span className="text-[9px] block mt-1.5 font-semibold" style={{ color: textSub }}>
                            {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-black text-xs uppercase tracking-widest opacity-60">Top Categories</h4>
                  <button type="button" className="text-[10px] font-black hover:underline" style={{ color: '#F5B301' }}>
                    View All
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Main Course', count: '1,245', icon: <Utensils size={16} className="text-amber-500" /> },
                    { name: 'Drinks', count: '876', icon: <Coffee size={16} className="text-amber-500" /> },
                    { name: 'Desserts', count: '432', icon: <ShoppingBag size={16} className="text-amber-500" /> },
                    { name: 'Fast Food', count: '1,234', icon: <Pizza size={16} className="text-amber-500" /> },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between text-xs py-3 border-b"
                      style={{ borderColor: borderCol }}
                    >
                      <div className="flex items-center gap-3 font-extrabold">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-black" style={{ color: textSub }}>
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                <h4 className="font-black text-xs uppercase tracking-widest opacity-60 mb-6">System Status</h4>
                <div className="flex flex-col gap-5">
                  {[
                    { label: 'Server Status', val: 'Online', status: 'ok', Icon: Server },
                    { label: 'Database', val: 'Online', status: 'ok', Icon: Database },
                    { label: 'Storage', val: '72% Used', status: 'warning', Icon: HardDrive },
                    { label: 'Active Users', val: '1,245', status: 'ok', Icon: Activity },
                  ].map(({ label, val, status, Icon }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Icon size={14} style={{ color: textSub }} />
                        <span className="font-extrabold" style={{ color: textSub }}>
                          {label}
                        </span>
                      </div>
                      <span
                        className="font-black text-[10px] px-3.5 py-0.5 rounded-full"
                        style={{
                          background: status === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(245,179,1,0.12)',
                          color: status === 'ok' ? '#22c55e' : '#F5B301',
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
