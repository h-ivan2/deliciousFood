import { useState } from 'react';
import {
  Users, UserPlus, Star, BookOpen, Activity,
  Search, Download, Eye, ChevronLeft, ChevronRight,
  ChevronDown, MoreVertical, ArrowRight, Bell, ChevronDown as CD,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/api';

// ─── Mock data ──────────────────────────────────────────────────
const MOCK_CUSTOMERS = Array.from({ length: 20 }, (_, i) => ({
  _id: `c_${i}`,
  name: ['John Doe', 'Emily Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Park', 'David Kim'][i % 6],
  email: ['johndoe@gmail.com', 'emily@gmail.com', 'sarah@gmail.com', 'mike@gmail.com', 'lisa@gmail.com', 'david@gmail.com'][i % 6],
  phone: '+1 123-456-7890',
  totalOrders: [12, 8, 15, 6, 12, 12][i % 6],
  totalSpent: 245.60,
  lastOrder: 'May 15, 2024\n07:30 PM',
  rating: 4.8,
  status: i % 7 === 0 ? 'Inactive' : 'Active',
}));

const STAT_CARDS = [
  { label: 'Total Customers', value: '320', change: '↑ 18% this month', icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { label: 'New Customers',   value: '28',  change: '↑ 12% this week',  icon: UserPlus, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { label: 'Repeat Customers',value: '156', change: '↑ 15% this week',  icon: Star,   color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  { label: 'Active This Month',value: '24', change: '',                  icon: BookOpen, color: '#F5B301', bg: 'rgba(245,179,1,0.12)', viewAll: true },
];

const PER_PAGE = 10;

export default function OwnerCustomersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();
  const user = authService.getCurrentUser();

  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('All Status');
  const [timeFilter, setTime]       = useState('All Time');
  const [page, setPage]             = useState(1);

  const restaurant = { name: 'The Green Bowl', cuisine: 'Italian Cuisine', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=60&q=80' };

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputBg     = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)'  : '#e5e5e5';
  const inputColor  = dark ? '#fff' : '#1a1a1a';

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Customers</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Manage and view all your customers</p>
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

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                {s.viewAll && (
                  <button className="text-xs font-semibold flex items-center gap-1" style={{ color: '#F5B301' }}>
                    View All <ArrowRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-2xl font-black" style={{ color: textTitle }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>{s.label}</p>
              {s.change && (
                <p className="text-xs mt-1 font-semibold" style={{ color: '#22c55e' }}>{s.change}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Table Card ──────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: borderCol }}>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-5 border-b" style={{ borderColor: borderCol }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
            <input
              type="text"
              placeholder="Search customers by name, email or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="rounded-xl text-sm font-semibold outline-none px-4 py-2.5 pr-8 appearance-none cursor-pointer"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor, minWidth: 130 }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSub }} />
          </div>

          {/* Time filter */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl text-sm font-semibold outline-none px-4 py-2.5 pr-8 appearance-none cursor-pointer"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor, minWidth: 120 }}
            >
              <option>All Time</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSub }} />
          </div>

          {/* Export */}
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
            style={{ background: '#F5B301', color: '#000' }}
          >
            <Download size={15} />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: borderCol }}>
                {['Customer', 'Contact', 'Total Orders', 'Total Spent', 'Last Order', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold px-6 py-4"
                    style={{ color: textSub, whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr
                  key={c._id}
                  className="border-b transition-colors"
                  style={{ borderColor: borderCol }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', color: textSub }}>
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold" style={{ color: textTitle }}>{c.name}</span>
                          <span className="text-xs flex items-center gap-0.5" style={{ color: '#F5B301' }}>
                            <Star size={10} fill="#F5B301" /> {c.rating}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: textSub }}>{c.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: textTitle }}>{c.phone}</span>
                  </td>

                  {/* Total Orders */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold" style={{ color: textTitle }}>{c.totalOrders}</span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold" style={{ color: textTitle }}>${c.totalSpent.toFixed(2)}</span>
                  </td>

                  {/* Last Order */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm" style={{ color: textTitle }}>{c.lastOrder.split('\n')[0]}</p>
                      <p className="text-xs" style={{ color: textSub }}>{c.lastOrder.split('\n')[1]}</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        color: c.status === 'Active' ? '#22c55e' : '#94a3b8',
                        background: c.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.1)',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
                        title="View customer"
                      >
                        <Eye size={14} style={{ color: textSub }} />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
                        title="More options"
                      >
                        <MoreVertical size={14} style={{ color: textSub }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: borderCol }}>
          <p className="text-sm" style={{ color: textSub }}>
            Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} customers
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 transition-opacity"
              style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
            >
              <ChevronLeft size={14} style={{ color: textSub }} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-xs font-bold border transition-all"
                  style={{
                    borderColor: page === p ? '#F5B301' : borderCol,
                    background: page === p ? '#F5B301' : (dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8'),
                    color: page === p ? '#000' : textSub,
                  }}
                >
                  {p}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-sm" style={{ color: textSub }}>...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="w-8 h-8 rounded-lg text-xs font-bold border"
                  style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8', color: textSub }}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 transition-opacity"
              style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}
            >
              <ChevronRight size={14} style={{ color: textSub }} />
            </button>

            {/* Per-page selector */}
            <div className="relative ml-2">
              <select
                className="text-xs font-semibold rounded-lg px-3 py-2 pr-7 appearance-none outline-none cursor-pointer"
                style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
              >
                <option>10 / page</option>
                <option>20 / page</option>
                <option>50 / page</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSub }} />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar promo */}
      <div
        className="mt-6 rounded-2xl border p-5 flex flex-col items-center text-center max-w-xs"
        style={{ background: cardBg, borderColor: borderCol }}
      >
        <div className="w-14 h-14 rounded-full mb-3 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80" alt="food" className="w-full h-full object-cover" />
        </div>
        <p className="font-bold text-sm mb-1" style={{ color: textTitle }}>Grow Your Business</p>
        <p className="text-xs mb-4" style={{ color: textSub }}>Keep your menu updated and orders on track.</p>
        <button className="w-full py-2.5 rounded-xl text-sm font-bold" style={{ background: '#F5B301', color: '#000' }}>
          View Tips
        </button>
      </div>
    </div>
  );
}