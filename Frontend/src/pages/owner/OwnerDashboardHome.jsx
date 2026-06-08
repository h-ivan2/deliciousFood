import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, ShoppingBag, Users, DollarSign,
  Clock, CheckCircle, ChefHat, XCircle,
  ArrowUpRight, Bell, ChevronDown, RefreshCw,
} from 'lucide-react';
import { authService } from '../../services/api';
import { useAdminTheme } from '../../hooks/useAdminTheme';

// ─── Mock owner data ─────────────────────────────────────────────
const MOCK_STATS = [
  { label: 'Total Orders', value: '1,284', change: '+12% this week', icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
  { label: 'Total Revenue', value: '$24,560', change: '+8% this month', icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { label: 'Total Customers', value: '320', change: '+18% this month', icon: Users, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { label: 'Avg Order Value', value: '$19.12', change: '+3% this week', icon: TrendingUp, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
];

const MOCK_ORDERS = [
  { id: 'DF-100421', customer: 'John Doe', items: 'Pepperoni Pizza × 2', amount: '$29.98', status: 'preparing', time: '2 min ago' },
  { id: 'DF-100420', customer: 'Emily Smith', items: 'Chocolate Shake × 1', amount: '$14.99', status: 'confirmed', time: '8 min ago' },
  { id: 'DF-100419', customer: 'Sarah J.', items: 'Grilled Chicken × 1, Salad × 1', amount: '$22.98', status: 'ready', time: '15 min ago' },
  { id: 'DF-100418', customer: 'Mike Chen', items: 'Margherita Pizza × 3', amount: '$38.97', status: 'completed', time: '30 min ago' },
  { id: 'DF-100417', customer: 'Lisa Park', items: 'Quinoa Bowl × 2', amount: '$22.98', status: 'cancelled', time: '45 min ago' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  preparing: { label: 'Preparing', color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
  ready:     { label: 'Ready',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

const POPULAR_DISHES = [
  { name: 'Pepperoni Pizza', orders: 142, revenue: '$2,124', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80&q=80' },
  { name: 'Margherita Pizza', orders: 118, revenue: '$1,534', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&q=80' },
  { name: 'Grilled Chicken', orders: 97, revenue: '$1,115', img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=80&q=80' },
  { name: 'Chocolate Shake', orders: 84, revenue: '$1,259', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=80&q=80' },
];

export default function OwnerDashboardHome() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const restaurant = { name: 'The Green Bowl', cuisine: 'Italian Cuisine', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Chef'} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>
            Here's what's happening at your restaurant today
          </p>
        </div>

        {/* Restaurant Selector */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer"
            style={{ background: cardBg, borderColor: borderCol }}
          >
            <img src={restaurant.logo} alt={restaurant.name} className="w-8 h-8 rounded-full object-cover" />
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

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#22c55e' }}>
                  <ArrowUpRight size={12} />{stat.change.split(' ')[0]}
                </span>
              </div>
              <p className="text-2xl font-black mb-0.5" style={{ color: textTitle }}>{stat.value}</p>
              <p className="text-xs" style={{ color: textSub }}>{stat.label}</p>
              <p className="text-xs mt-1" style={{ color: textSub }}>{stat.change.split(' ').slice(1).join(' ')}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Recent Orders ──────────────────────────────── */}
        <div className="xl:col-span-2 rounded-2xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: borderCol }}>
            <div>
              <h2 className="font-bold text-base" style={{ color: textTitle }}>Recent Orders</h2>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>Live incoming orders</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/owner/orders')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                style={{ color: '#F5B301', borderColor: 'rgba(245,179,1,0.3)', background: 'rgba(245,179,1,0.08)' }}
              >
                View All →
              </button>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: borderCol }}>
            {MOCK_ORDERS.map((order) => {
              const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,179,1,0.1)' }}>
                    <ShoppingBag size={16} style={{ color: '#F5B301' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: textTitle }}>{order.customer}</span>
                      <span className="text-xs" style={{ color: textSub }}>#{order.id}</span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: textSub }}>{order.items}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: textTitle }}>{order.amount}</p>
                    <p className="text-xs mt-0.5" style={{ color: textSub }}>{order.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0" style={{ color: s.color, background: s.bg }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Column ────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Order Status Summary */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <h2 className="font-bold text-sm mb-4" style={{ color: textTitle }}>Today's Order Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pending',   val: 8,  color: '#94a3b8', Icon: Clock },
                { label: 'Preparing', val: 12, color: '#F5B301', Icon: ChefHat },
                { label: 'Ready',     val: 5,  color: '#22c55e', Icon: CheckCircle },
                { label: 'Cancelled', val: 2,  color: '#f87171', Icon: XCircle },
              ].map(({ label, val, color, Icon }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} style={{ color }} />
                    <span className="text-xs" style={{ color: textSub }}>{label}</span>
                  </div>
                  <p className="text-xl font-black" style={{ color }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="rounded-2xl border p-5 flex-1" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm" style={{ color: textTitle }}>Popular Dishes</h2>
              <button onClick={() => navigate('/owner/menu')} className="text-xs font-semibold" style={{ color: '#F5B301' }}>View Menu →</button>
            </div>
            <div className="flex flex-col gap-3">
              {POPULAR_DISHES.map((dish, idx) => (
                <div key={dish.name} className="flex items-center gap-3">
                  <span className="text-xs font-black w-4 text-center flex-shrink-0" style={{ color: idx === 0 ? '#F5B301' : textSub }}>
                    {idx + 1}
                  </span>
                  <img src={dish.img} alt={dish.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: textTitle }}>{dish.name}</p>
                    <p className="text-xs" style={{ color: textSub }}>{dish.orders} orders</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: '#22c55e' }}>{dish.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <h2 className="font-bold text-sm mb-3" style={{ color: textTitle }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Menu Item', onClick: () => navigate('/owner/menu') },
                { label: 'View Orders',   onClick: () => navigate('/owner/orders') },
                { label: 'Customers',     onClick: () => navigate('/owner/customers') },
                { label: 'Reports',       onClick: () => navigate('/owner/reports') },
              ].map(({ label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="text-xs font-bold py-2.5 px-3 rounded-xl border transition-all hover:opacity-80"
                  style={{ color: textTitle, borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}