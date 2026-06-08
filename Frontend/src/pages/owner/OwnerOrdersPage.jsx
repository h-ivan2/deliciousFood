import { useState } from 'react';
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, XCircle,
  Search, Filter, Eye, ChevronLeft, ChevronRight,
  ChevronDown, Bell, RefreshCw, TrendingUp,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/api';

// ─── Mock data ──────────────────────────────────────────────────
const STATUSES = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', Icon: Clock },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  preparing: { label: 'Preparing', color: '#F5B301', bg: 'rgba(245,179,1,0.12)',   Icon: ChefHat },
  ready:     { label: 'Ready',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   Icon: CheckCircle },
  completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   Icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)',  Icon: XCircle },
};

const ITEMS_POOL = [
  'Pepperoni Pizza × 2', 'Margherita Pizza × 1', 'Chocolate Shake × 2',
  'Grilled Chicken × 1', 'Quinoa Bowl × 3', 'Avocado Toast × 1',
  'Caesar Salad × 2', 'Beef Burger × 1',
];

const CUSTOMERS = ['John Doe', 'Emily Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Park', 'David Kim', 'Anna White', 'Tom Brown'];
const STATUS_KEYS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

const MOCK_ORDERS = Array.from({ length: 40 }, (_, i) => ({
  _id: `ord_${i}`,
  orderNumber: `DF-${100400 + i}`,
  customer: { name: CUSTOMERS[i % CUSTOMERS.length], email: `${CUSTOMERS[i % CUSTOMERS.length].toLowerCase().replace(' ', '')}@gmail.com`, phone: '+1 123-456-7890' },
  items: ITEMS_POOL[i % ITEMS_POOL.length],
  itemCount: (i % 3) + 1,
  amount: (12.99 + (i % 8) * 2.5).toFixed(2),
  status: STATUS_KEYS[i % STATUS_KEYS.length],
  type: i % 3 === 0 ? 'Dine-in' : 'Delivery',
  date: `May ${15 + (i % 10)}, 2024`,
  time: `${(i % 12) + 7}:${i % 2 === 0 ? '00' : '30'} ${i % 2 === 0 ? 'AM' : 'PM'}`,
}));

const SUMMARY_STATS = [
  { label: 'Total Orders', value: '1,284', Icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
  { label: 'Pending',      value: '24',    Icon: Clock,       color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  { label: 'In Progress',  value: '18',    Icon: ChefHat,     color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { label: "Today's Revenue", value: '$892', Icon: TrendingUp, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
];

const PER_PAGE = 10;

export default function OwnerOrdersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();
  const user = authService.getCurrentUser();

  const [statusTab,  setStatusTab]  = useState('All');
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [selected,   setSelected]   = useState(null);

  const restaurant = { name: 'The Green Bowl', cuisine: 'Italian Cuisine', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' };

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchStatus = statusTab === 'All' || o.status === statusTab.toLowerCase();
    const matchSearch = !search || o.orderNumber.includes(search) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputBg     = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)'  : '#e5e5e5';
  const inputColor  = dark ? '#fff' : '#1a1a1a';

  const handleStatusChange = (orderId, newStatus) => {
    // In real app, call API here
    console.log('Update order', orderId, 'to', newStatus);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Manage and track all incoming orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer" style={{ background: cardBg, borderColor: borderCol }}>
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

      {/* ── Summary Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {SUMMARY_STATS.map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-black" style={{ color: textTitle }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Table Card ──────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: borderCol }}>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 px-5 pt-5 overflow-x-auto pb-0 border-b" style={{ borderColor: borderCol }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusTab(s); setPage(1); }}
              className="px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 -mb-px transition-all"
              style={{
                borderColor: statusTab === s ? '#F5B301' : 'transparent',
                color: statusTab === s ? '#F5B301' : textSub,
                background: 'transparent',
              }}
            >
              {s}
              {s !== 'All' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: statusTab === s ? 'rgba(245,179,1,0.15)' : (dark ? 'rgba(255,255,255,0.08)' : '#f0f0f0'), color: statusTab === s ? '#F5B301' : textSub }}>
                  {MOCK_ORDERS.filter(o => o.status === s.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex items-center gap-3 p-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}>
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border ml-auto"
            style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: borderCol }}>
                {['Order', 'Customer', 'Items', 'Type', 'Amount', 'Date & Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold px-6 py-3" style={{ color: textSub, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const Icon = sc.Icon;
                return (
                  <tr key={order._id} className="border-b transition-colors"
                    style={{ borderColor: borderCol }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>

                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: '#F5B301' }}>#{order.orderNumber}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: textTitle }}>{order.customer.name}</p>
                        <p className="text-xs" style={{ color: textSub }}>{order.customer.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm max-w-[160px] truncate" style={{ color: textTitle }}>{order.items}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: order.type === 'Delivery' ? 'rgba(245,179,1,0.1)' : 'rgba(129,140,248,0.12)', color: order.type === 'Delivery' ? '#F5B301' : '#818cf8' }}>
                        {order.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: textTitle }}>${order.amount}</span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: textTitle }}>{order.date}</p>
                      <p className="text-xs" style={{ color: textSub }}>{order.time}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg w-fit"
                        style={{ color: sc.color, background: sc.bg }}>
                        <Icon size={11} />
                        {sc.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border hover:opacity-70"
                          style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
                        >
                          <Eye size={13} style={{ color: textSub }} />
                        </button>
                        {/* Quick status update for actionable statuses */}
                        {['pending', 'confirmed', 'preparing'].includes(order.status) && (
                          <button
                            onClick={() => handleStatusChange(order._id, order.status === 'pending' ? 'confirmed' : order.status === 'confirmed' ? 'preparing' : 'ready')}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
                            style={{ background: 'rgba(245,179,1,0.1)', color: '#F5B301' }}
                          >
                            {order.status === 'pending' ? 'Confirm' : order.status === 'confirmed' ? 'Prepare' : 'Mark Ready'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: borderCol }}>
          <p className="text-sm" style={{ color: textSub }}>
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} orders
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40"
              style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
              <ChevronLeft size={14} style={{ color: textSub }} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-bold border"
                style={{ borderColor: page === p ? '#F5B301' : borderCol, background: page === p ? '#F5B301' : (dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8'), color: page === p ? '#000' : textSub }}>
                {p}
              </button>
            ))}
            {totalPages > 5 && <span style={{ color: textSub }}>...</span>}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40"
              style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
              <ChevronRight size={14} style={{ color: textSub }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Order Detail Modal ─────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelected(null)}>
          <div className="rounded-2xl border p-6 w-full max-w-md" style={{ background: cardBg, borderColor: borderCol }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>Order #{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-xl leading-none" style={{ color: textSub }}>×</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Customer', selected.customer.name],
                ['Email', selected.customer.email],
                ['Phone', selected.customer.phone],
                ['Items', selected.items],
                ['Type', selected.type],
                ['Amount', `$${selected.amount}`],
                ['Date', `${selected.date} at ${selected.time}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2" style={{ borderColor: borderCol }}>
                  <span style={{ color: textSub }}>{k}</span>
                  <span className="font-semibold text-right" style={{ color: textTitle }}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span style={{ color: textSub }}>Status</span>
                <span className="font-bold px-2 py-0.5 rounded-lg text-xs"
                  style={{ color: STATUS_CONFIG[selected.status]?.color, background: STATUS_CONFIG[selected.status]?.bg }}>
                  {STATUS_CONFIG[selected.status]?.label}
                </span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="mt-5 w-full py-2.5 rounded-xl font-bold text-sm" style={{ background: '#F5B301', color: '#000' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}