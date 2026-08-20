import { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, XCircle, Truck,
  Search, Eye, ChevronLeft, ChevronRight, RefreshCw, Loader2,
  Store, DollarSign,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { adminService } from '../../services/api';

const STATUSES = ['All', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', Icon: Clock },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  preparing: { label: 'Preparing', color: '#F5B301', bg: 'rgba(245,179,1,0.12)',   Icon: ChefHat },
  ready:     { label: 'Ready',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',    Icon: CheckCircle },
  delivered: { label: 'Delivered', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    Icon: Truck },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)',   Icon: XCircle },
};

const PER_PAGE = 15;

/**
 * Admin Orders page — view all orders across the platform with
 * status filtering, search, pagination, and order detail modal.
 */
export default function AdminOrdersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const filters = { page, limit: PER_PAGE };
      if (statusTab !== 'All') filters.status = statusTab;
      const result = await adminService.getOrders(filters);
      setOrders(result.data || []);
      setTotal(result.total || 0);
      setPages(result.pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, statusTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const num = o.orderNumber || o._id;
      const name = o.customer?.name || '';
      const rest = o.restaurant?.name || '';
      return num.toLowerCase().includes(q) || name.toLowerCase().includes(q) || rest.toLowerCase().includes(q);
    });
  }, [orders, search]);

  const isServerFiltered = statusTab !== 'All';
  const displayOrders = isServerFiltered ? filtered : filtered;
  const totalPages = isServerFiltered ? pages : Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e5e5';
  const inputColor = dark ? '#fff' : '#1a1a1a';

  const summary = useMemo(() => {
    const totalAmount = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    return [
      { label: 'Total Orders', value: total, Icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
      { label: 'Pending', value: counts.pending || 0, Icon: Clock, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
      { label: 'Active', value: (counts.confirmed || 0) + (counts.preparing || 0) + (counts.ready || 0), Icon: ChefHat, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
      { label: 'Revenue', value: `$${totalAmount.toLocaleString()}`, Icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    ];
  }, [orders, total]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Monitor all orders across the platform</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer"
          style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div className="mb-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map(({ label, value, Icon, color, bg: sbg }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: sbg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color: textTitle }}>{value}</p>
            <p className="text-xs" style={{ color: textSub }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatusTab(s); setPage(1); }}
            className="px-4 py-2 rounded-full text-xs font-bold border cursor-pointer"
            style={{ background: statusTab === s ? '#F5B301' : inputBg, borderColor: statusTab === s ? '#F5B301' : inputBorder, color: statusTab === s ? '#000' : textSub }}>
            {s === 'All' ? 'All' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border" style={{ background: cardBg, borderColor: borderCol }}>
        {/* Search */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: borderCol }}>
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
            <input
              type="text"
              placeholder="Search by order #, customer, or restaurant..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); }}
              className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
            />
          </div>
        </div>

        {/* Table */}
        {orders.length === 0 ? (
          <div className="p-16 text-center text-sm" style={{ color: textSub }}>No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: borderCol }}>
                  {['Order', 'Customer', 'Restaurant', 'Items', 'Amount', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-6 py-3" style={{ color: textSub, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const Icon = sc.Icon;
                  const itemsLabel = (order.items || []).map((it) => `${it.name || it.menuItem?.name || 'Item'} ×${it.quantity}`).join(', ');
                  return (
                    <tr key={order._id} className="border-b" style={{ borderColor: borderCol }}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: '#F5B301' }}>#{order.orderNumber || order._id.slice(-6)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold" style={{ color: textTitle }}>{order.customer?.name || 'Customer'}</p>
                        <p className="text-xs" style={{ color: textSub }}>{order.customer?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm" style={{ color: textTitle }}>
                          <Store size={13} /> {order.restaurant?.name || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm max-w-[180px] truncate" style={{ color: textTitle }} title={itemsLabel}>
                          {itemsLabel || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: textTitle }}>${Number(order.totalAmount || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm" style={{ color: textTitle }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs" style={{ color: textSub }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg w-fit" style={{ color: sc.color, background: sc.bg }}>
                          <Icon size={11} /> {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelected(order)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
                          style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                          <Eye size={13} style={{ color: textSub }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: borderCol }}>
            <p className="text-sm" style={{ color: textSub }}>
              Page {page} of {totalPages} ({total} total orders)
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

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelected(null)}>
          <div className="rounded-2xl border p-6 w-full max-w-md" style={{ background: cardBg, borderColor: borderCol }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>Order #{selected.orderNumber || selected._id.slice(-6)}</h2>
              <button onClick={() => setSelected(null)} className="text-xl leading-none bg-transparent border-none cursor-pointer" style={{ color: textSub }}>×</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Customer', selected.customer?.name || '—'],
                ['Email', selected.customer?.email || '—'],
                ['Restaurant', selected.restaurant?.name || '—'],
                ['Items', (selected.items || []).map((it) => `${it.name || it.menuItem?.name || 'Item'} ×${it.quantity}`).join(', ')],
                ['Amount', `$${Number(selected.totalAmount || 0).toFixed(2)}`],
                ['Date', new Date(selected.createdAt).toLocaleString()],
                ['Delivery Address', selected.deliveryAddress || 'Pickup'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2 gap-4" style={{ borderColor: borderCol }}>
                  <span style={{ color: textSub }}>{k}</span>
                  <span className="font-semibold text-right max-w-[60%]" style={{ color: textTitle }}>{v}</span>
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
          </div>
        </div>
      )}
    </div>
  );
}
