import { useState, useEffect, useMemo } from 'react';
import {
  Users, UserPlus, Star, BookOpen, Search, Eye,
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { ownerService } from '../../services/api';

const PER_PAGE = 10;

/**
 * Owner Customers page — lists the unique customers who have ordered from
 * the owner's restaurant, aggregated from live order data.
 */
export default function OwnerCustomersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restaurants = await ownerService.getMyRestaurants();
        const primary = (restaurants || [])[0];
        if (!primary) { if (active) { setRestaurant(null); setLoading(false); } return; }
        if (!active) return;
        setRestaurant(primary);
        const list = await ownerService.getCustomers(primary._id);
        if (active) setCustomers(list || []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load customers');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(search)
      );
    });
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => {
    const total = customers.length;
    const repeat = customers.filter((c) => c.totalOrders > 1).length;
    const revenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);
    return [
      { label: 'Total Customers', value: total, icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
      { label: 'Repeat Customers', value: repeat, icon: Star, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
      { label: 'One-time', value: total - repeat, icon: UserPlus, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
      { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, icon: BookOpen, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
    ];
  }, [customers]);

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e5e5';
  const inputColor = dark ? '#fff' : '#1a1a1a';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen p-8" style={{ background: bg }}>
        <div className="max-w-lg mx-auto rounded-3xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
          You don&apos;t have a registered restaurant yet.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Customers</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>People who have ordered from {restaurant.name}</p>
        </div>
      </div>

      {error && <div className="mb-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-black" style={{ color: textTitle }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: borderCol }}>
        {/* Search */}
        <div className="p-5 border-b" style={{ borderColor: borderCol }}>
          <div className="relative max-w-md">
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
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center text-sm" style={{ color: textSub }}>
            {customers.length === 0 ? 'No customers yet — orders will appear here.' : 'No customers match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: borderCol }}>
                  {['Customer', 'Contact', 'Total Orders', 'Total Spent', 'Last Order', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-6 py-4" style={{ color: textSub, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c._id} className="border-b" style={{ borderColor: borderCol }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                          style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', color: textSub }}>
                          {(c.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-bold" style={{ color: textTitle }}>{c.name || 'Customer'}</span>
                          <p className="text-xs mt-0.5" style={{ color: textSub }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: textTitle }}>{c.phone || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: textTitle }}>{c.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: textTitle }}>${Number(c.totalSpent || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: textTitle }}>{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-80"
                        style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }} title="View customer">
                        <Eye size={14} style={{ color: textSub }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: borderCol }}>
            <p className="text-sm" style={{ color: textSub }}>
              Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} customers
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 cursor-pointer"
                style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                <ChevronLeft size={14} style={{ color: textSub }} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-xs font-bold border cursor-pointer"
                  style={{ borderColor: page === p ? '#F5B301' : borderCol, background: page === p ? '#F5B301' : (dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8'), color: page === p ? '#000' : textSub }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 cursor-pointer"
                style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                <ChevronRight size={14} style={{ color: textSub }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
