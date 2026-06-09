import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Users, DollarSign,
  Clock, CheckCircle, ChefHat, XCircle, Loader2,
} from 'lucide-react';
import { authService, ownerService } from '../../services/api';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  preparing: { label: 'Preparing', color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
  ready:     { label: 'Ready',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  delivered: { label: 'Delivered', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

/**
 * Owner dashboard home — live stats, recent orders, and order-status
 * breakdown for the owner's primary restaurant.
 */
export default function OwnerDashboardHome() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [greeting, setGreeting] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRestaurant, setNoRestaurant] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restaurants = await ownerService.getMyRestaurants();
        const primary = (restaurants || [])[0];
        if (!primary) {
          if (active) { setNoRestaurant(true); setLoading(false); }
          return;
        }
        if (!active) return;
        setRestaurant(primary);
        const [s, o] = await Promise.all([
          ownerService.getStats(primary._id).catch(() => null),
          ownerService.getRestaurantOrders(primary._id).catch(() => []),
        ]);
        if (!active) return;
        setStats(s);
        setOrders(o || []);
      } catch {
        // session/auth handled at layout level
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders ?? 0, change: 'all time', icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
        { label: 'Total Revenue', value: `$${Number(stats.totalRevenue || 0).toLocaleString()}`, change: 'delivered orders', icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
        { label: 'Total Customers', value: stats.totalCustomers ?? 0, change: 'unique', icon: Users, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
        { label: 'Pending Orders', value: stats.pendingOrders ?? 0, change: 'need action', icon: Clock, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
      ]
    : [];

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (noRestaurant) {
    return (
      <div className="px-6 py-10 min-h-full" style={{ background: bg }}>
        <div className="max-w-lg mx-auto rounded-3xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-lg" style={{ color: textTitle }}>No restaurant yet</h2>
          <p className="text-sm mt-2" style={{ color: textSub }}>Register your restaurant to start receiving orders.</p>
          <button onClick={() => navigate('/register-restaurant')} className="mt-5 px-6 py-3 rounded-full text-xs font-black border-none cursor-pointer bg-amber-500 text-black">
            Register Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-8 min-h-full" style={{ background: bg }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Chef'} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>
            Here&apos;s what&apos;s happening at {restaurant?.name || 'your restaurant'} today
          </p>
        </div>
        <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{
          background: restaurant?.isOpen ? 'rgba(34,197,94,0.12)' : 'rgba(148,163,184,0.15)',
          color: restaurant?.isOpen ? '#22c55e' : textSub,
        }}>
          {restaurant?.isOpen ? '● OPEN' : '● CLOSED'}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black mb-0.5" style={{ color: textTitle }}>{stat.value}</p>
              <p className="text-xs" style={{ color: textSub }}>{stat.label}</p>
              <p className="text-xs mt-1 opacity-70" style={{ color: textSub }}>{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-2xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: borderCol }}>
            <div>
              <h2 className="font-bold text-base" style={{ color: textTitle }}>Recent Orders</h2>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>Live incoming orders</p>
            </div>
            <button onClick={() => navigate('/owner/orders')} className="text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer"
              style={{ color: '#F5B301', borderColor: 'rgba(245,179,1,0.3)', background: 'rgba(245,179,1,0.08)' }}>
              View All →
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm" style={{ color: textSub }}>No orders yet.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: borderCol }}>
              {orders.slice(0, 6).map((order) => {
                const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <div key={order._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,179,1,0.1)' }}>
                      <ShoppingBag size={16} style={{ color: '#F5B301' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: textTitle }}>{order.customer?.name || 'Customer'}</span>
                        <span className="text-xs" style={{ color: textSub }}>#{order.orderNumber || order._id.slice(-6)}</span>
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: textSub }}>
                        {(order.items || []).map((it) => `${it.name} ×${it.quantity}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: textTitle }}>${Number(order.totalAmount || 0).toFixed(2)}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSub }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <h2 className="font-bold text-sm mb-4" style={{ color: textTitle }}>Order Status Breakdown</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pending',   val: statusCounts.pending || 0,   color: '#94a3b8', Icon: Clock },
                { label: 'Preparing', val: statusCounts.preparing || 0, color: '#F5B301', Icon: ChefHat },
                { label: 'Ready',     val: statusCounts.ready || 0,     color: '#22c55e', Icon: CheckCircle },
                { label: 'Cancelled', val: statusCounts.cancelled || 0, color: '#f87171', Icon: XCircle },
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

          <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <h2 className="font-bold text-sm mb-3" style={{ color: textTitle }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Manage Menu', onClick: () => navigate('/owner/menu') },
                { label: 'View Orders', onClick: () => navigate('/owner/orders') },
                { label: 'Customers', onClick: () => navigate('/owner/customers') },
                { label: 'Reports', onClick: () => navigate('/owner/reports') },
              ].map(({ label, onClick }) => (
                <button key={label} onClick={onClick}
                  className="text-xs font-bold py-2.5 px-3 rounded-xl border transition-all hover:opacity-80 cursor-pointer"
                  style={{ color: textTitle, borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
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
