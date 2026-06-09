import { useState, useEffect } from 'react';
import {
  BarChart3, Store, Users, ShoppingBag, DollarSign, Loader2, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { adminService } from '../../services/api';

/**
 * Admin Reports page — platform-wide analytics built from live stats
 * (/admin/stats) and the live restaurant list (/admin/restaurants).
 */
export default function AdminReports() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getAllRestaurants()])
      .then(([s, r]) => {
        setStats(s);
        setRestaurants(r || []);
      })
      .catch((err) => setError(err.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = restaurants.reduce(
    (acc, r) => {
      const key = r.status || 'pending';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0, suspended: 0 }
  );

  const PIE_DATA = [
    { name: 'Approved', value: statusCounts.approved, color: '#22c55e' },
    { name: 'Pending', value: statusCounts.pending, color: '#F5B301' },
    { name: 'Rejected', value: statusCounts.rejected, color: '#ef4444' },
    { name: 'Suspended', value: statusCounts.suspended, color: '#94a3b8' },
  ].filter((d) => d.value > 0);

  const OVERVIEW_DATA = stats
    ? [
        { name: 'Restaurants', value: stats.totalRestaurants || 0 },
        { name: 'Users', value: stats.totalUsers || 0 },
        { name: 'Orders', value: stats.totalOrders || 0 },
      ]
    : [];

  const axisColor = dark ? 'rgba(255,255,255,0.3)' : '#aaa';
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';

  const KPIS = stats
    ? [
        { label: 'Total Restaurants', value: stats.totalRestaurants ?? 0, Icon: Store, color: '#F5B301' },
        { label: 'Total Users', value: stats.totalUsers ?? 0, Icon: Users, color: '#3b82f6' },
        { label: 'Total Orders', value: stats.totalOrders ?? 0, Icon: ShoppingBag, color: '#a855f7' },
        { label: 'Total Revenue', value: `$${Number(stats.totalRevenue || 0).toLocaleString()}`, Icon: DollarSign, color: '#22c55e' },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="px-8 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      <h1 className="font-display font-black text-3xl flex items-center gap-3" style={{ color: textTitle }}>
        <BarChart3 size={28} className="text-amber-500" /> Reports & Analytics
      </h1>
      <p className="text-sm mt-2" style={{ color: textSub }}>Platform-wide performance and onboarding insights.</p>

      {error && <div className="mt-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

      {/* KPI cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIS.map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-3xl p-6 border flex flex-col gap-4" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div className="text-3xl font-black leading-none" style={{ color: textTitle }}>{value}</div>
              <div className="text-[10px] mt-2 uppercase font-black tracking-widest opacity-60" style={{ color: textSub }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview bar chart */}
        <div className="lg:col-span-2 rounded-3xl p-8 border" style={{ background: cardBg, borderColor: borderCol }}>
          <h3 className="font-black text-base mb-6 flex items-center gap-2" style={{ color: textTitle }}>
            <TrendingUp size={18} className="text-amber-500" /> Platform Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={OVERVIEW_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: axisColor }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: axisColor }} />
              <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 12, color: textTitle }} cursor={{ fill: 'rgba(245,179,1,0.08)' }} />
              <Bar dataKey="value" fill="#F5B301" radius={[8, 8, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Restaurant status pie */}
        <div className="rounded-3xl p-8 border flex flex-col" style={{ background: cardBg, borderColor: borderCol }}>
          <h3 className="font-black text-base mb-6" style={{ color: textTitle }}>Restaurant Status</h3>
          {PIE_DATA.length === 0 ? (
            <p className="text-sm" style={{ color: textSub }}>No restaurant data yet.</p>
          ) : (
            <>
              <div className="relative h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} innerRadius="65%" outerRadius="100%" dataKey="value" stroke="none">
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 12, fontSize: 12, color: textTitle }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-2xl font-black" style={{ color: textTitle }}>{restaurants.length}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: textSub }}>Total</div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                {PIE_DATA.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="font-semibold opacity-75" style={{ color: textTitle }}>{name}</span>
                    </div>
                    <span className="font-extrabold" style={{ color: textTitle }}>{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
