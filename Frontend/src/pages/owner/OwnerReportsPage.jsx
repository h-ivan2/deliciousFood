import { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, ChevronDown, Bell, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminTheme } from '../../hooks/useAdminTheme';

// ─── Mock chart data ─────────────────────────────────────────────
const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200, orders: 280 },
  { month: 'Feb', revenue: 5800, orders: 340 },
  { month: 'Mar', revenue: 4900, orders: 310 },
  { month: 'Apr', revenue: 7200, orders: 420 },
  { month: 'May', revenue: 6500, orders: 390 },
  { month: 'Jun', revenue: 8100, orders: 480 },
  { month: 'Jul', revenue: 9200, orders: 540 },
  { month: 'Aug', revenue: 7800, orders: 460 },
  { month: 'Sep', revenue: 8600, orders: 510 },
  { month: 'Oct', revenue: 9800, orders: 580 },
  { month: 'Nov', revenue: 11200, orders: 660 },
  { month: 'Dec', revenue: 12400, orders: 720 },
];

const CATEGORY_DATA = [
  { name: 'Pizza',    value: 38, color: '#F5B301' },
  { name: 'Burgers',  value: 24, color: '#60a5fa' },
  { name: 'Salads',   value: 18, color: '#22c55e' },
  { name: 'Drinks',   value: 13, color: '#a855f7' },
  { name: 'Desserts', value: 7,  color: '#f472b6' },
];

const TOP_ITEMS = [
  { name: 'Pepperoni Pizza',   orders: 142, revenue: 2124, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=60&q=80' },
  { name: 'Margherita Pizza',  orders: 118, revenue: 1534, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=60&q=80' },
  { name: 'Grilled Chicken',   orders: 97,  revenue: 1115, img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=60&q=80' },
  { name: 'Chocolate Shake',   orders: 84,  revenue: 1259, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=60&q=80' },
  { name: 'Quinoa Bowl',       orders: 71,  revenue: 818,  img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' },
];

const PERIODS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

export default function OwnerReportsPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();
  const [period, setPeriod] = useState('This Month');

  const restaurant = { name: 'The Green Bowl', cuisine: 'Italian Cuisine', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' };

  const inputBg     = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)'  : '#e5e5e5';
  const inputColor  = dark ? '#fff' : '#1a1a1a';
  const gridColor   = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
  const axisColor   = dark ? 'rgba(255,255,255,0.3)'  : '#aaa';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border p-3 text-xs" style={{ background: cardBg, borderColor: borderCol }}>
        <p className="font-bold mb-1" style={{ color: textTitle }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Reports & Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Track your restaurant performance</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl text-sm font-semibold px-4 py-2.5 pr-8 appearance-none outline-none cursor-pointer border"
              style={{ background: cardBg, borderColor: borderCol, color: textTitle, minWidth: 150 }}>
              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSub }} />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: '#F5B301', color: '#000' }}>
            <Download size={15} /> Export
          </button>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer" style={{ background: cardBg, borderColor: borderCol }}>
            <img src={restaurant.logo} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold" style={{ color: textTitle }}>{restaurant.name}</p>
              <p className="text-xs" style={{ color: textSub }}>{restaurant.cuisine}</p>
            </div>
            <ChevronDown size={16} style={{ color: textSub }} />
          </div>

          <div className="relative">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: cardBg, borderColor: borderCol }}>
              <Bell size={18} style={{ color: textSub }} />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">5</span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue',   value: '$24,560', change: '+8%',  Icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Total Orders',    value: '1,284',   change: '+12%', Icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
          { label: 'Avg Order Value', value: '$19.12',  change: '+3%',  Icon: TrendingUp, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
          { label: 'Total Customers', value: '320',     change: '+18%', Icon: Users,      color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
        ].map(({ label, value, change, Icon, color, bg: cbg }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cbg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{change} ↑</span>
            </div>
            <p className="text-2xl font-black" style={{ color: textTitle }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: textSub }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* ── Revenue Chart ───────────────────────────────── */}
        <div className="xl:col-span-2 rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold" style={{ color: textTitle }}>Revenue & Orders</h2>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>Monthly performance overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#F5B301" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="orders"  stroke="#818cf8" strokeWidth={2}   dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-3">
            {[{ label: 'Revenue', color: '#F5B301' }, { label: 'Orders', color: '#818cf8' }].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                <span className="text-xs" style={{ color: textSub }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Breakdown ──────────────────────────── */}
        <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-bold mb-1" style={{ color: textTitle }}>Sales by Category</h2>
          <p className="text-xs mb-4" style={{ color: textSub }}>Order distribution this month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-xs flex-1" style={{ color: textSub }}>{c.name}</span>
                <span className="text-xs font-bold" style={{ color: textTitle }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bar Chart + Top Items ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Monthly Orders bar */}
        <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-bold mb-1" style={{ color: textTitle }}>Monthly Orders</h2>
          <p className="text-xs mb-4" style={{ color: textSub }}>Order volume by month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, fontSize: 11, color: textTitle }} />
              <Bar dataKey="orders" fill="#F5B301" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Menu Items */}
        <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold" style={{ color: textTitle }}>Top Menu Items</h2>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>Best performers this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {TOP_ITEMS.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-black w-4 text-center flex-shrink-0"
                  style={{ color: idx === 0 ? '#F5B301' : textSub }}>#{idx + 1}</span>
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: textTitle }}>{item.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1 rounded-full flex-1" style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }}>
                      <div className="h-full rounded-full" style={{ width: `${(item.orders / 142) * 100}%`, background: '#F5B301' }} />
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: textSub }}>{item.orders}</span>
                  </div>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: '#22c55e' }}>${item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}