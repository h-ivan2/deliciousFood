import { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, XCircle,
  Search, Eye, ChevronLeft, ChevronRight, RefreshCw, Truck, Loader2,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { ownerService } from '../../services/api';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', Icon: Clock },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  Icon: CheckCircle },
  preparing: { label: 'Preparing', color: '#F5B301', bg: 'rgba(245,179,1,0.12)',   Icon: ChefHat },
  ready:     { label: 'Ready',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',    Icon: CheckCircle },
  delivered: { label: 'Delivered', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    Icon: Truck },
  completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    Icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)',   Icon: XCircle },
};

// Forward transition for the quick-action button
const NEXT_STATUS = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'delivered' };
const NEXT_LABEL = { pending: 'Confirm', confirmed: 'Prepare', preparing: 'Mark Ready', ready: 'Mark Delivered' };

const PER_PAGE = 10;

/**
 * Owner Orders page — lists live orders for the owner's restaurant with
 * search, status filtering, pagination, and inline status updates.
 */
export default function OwnerOrdersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const restaurants = await ownerService.getMyRestaurants();
      const primary = (restaurants || [])[0];
      if (!primary) { setRestaurant(null); setOrders([]); return; }
      setRestaurant(primary);
      const list = await ownerService.getRestaurantOrders(primary._id);
      setOrders(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await ownerService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      setSelected((s) => (s && s._id === orderId ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert(err.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusTab === 'All' || o.status === statusTab.toLowerCase();
      const num = o.orderNumber || o._id;
      const name = o.customer?.name || '';
      const matchSearch =
        !search ||
        num.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e5e5';
  const inputColor = dark ? '#fff' : '#1a1a1a';

  const summary = useMemo(() => {
    const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    const revenue = orders.filter((o) => ['delivered', 'completed'].includes(o.status)).reduce((s, o) => s + (o.totalAmount || 0), 0);
    return [
      { label: 'Total Orders', value: orders.length, Icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
      { label: 'Pending', value: counts.pending || 0, Icon: Clock, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
      { label: 'In Progress', value: (counts.confirmed || 0) + (counts.preparing || 0), Icon: ChefHat, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
      { label: 'Revenue', value: `$${revenue.toLocaleString()}`, Icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    ];
  }, [orders]);

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
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Manage and track all incoming orders</p>
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
            {s}
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
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-sm" style={{ color: textSub }}>No orders match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: borderCol }}>
                  {['Order', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-6 py-3" style={{ color: textSub, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const Icon = sc.Icon;
                  const itemsLabel = (order.items || []).map((it) => `${it.name} ×${it.quantity}`).join(', ');
                  return (
                    <tr key={order._id} className="border-b" style={{ borderColor: borderCol }}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: '#F5B301' }}>#{order.orderNumber || order._id.slice(-6)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold" style={{ color: textTitle }}>{order.customer?.name || 'Customer'}</p>
                        <p className="text-xs" style={{ color: textSub }}>{order.customer?.phone || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm max-w-[200px] truncate" style={{ color: textTitle }}>{itemsLabel}</p>
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
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(order)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
                            style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                            <Eye size={13} style={{ color: textSub }} />
                          </button>
                          {NEXT_STATUS[order.status] && (
                            <button
                              onClick={() => handleStatusChange(order._id, NEXT_STATUS[order.status])}
                              disabled={updatingId === order._id}
                              className="text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer disabled:opacity-50"
                              style={{ background: 'rgba(245,179,1,0.1)', color: '#F5B301' }}>
                              {updatingId === order._id ? '...' : NEXT_LABEL[order.status]}
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
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: borderCol }}>
            <p className="text-sm" style={{ color: textSub }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} orders
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

      {/* Order detail modal */}
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
                ['Phone', selected.customer?.phone || '—'],
                ['Items', (selected.items || []).map((it) => `${it.name} ×${it.quantity}`).join(', ')],
                ['Amount', `$${Number(selected.totalAmount || 0).toFixed(2)}`],
                ['Date', new Date(selected.createdAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2 gap-4" style={{ borderColor: borderCol }}>
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
            {NEXT_STATUS[selected.status] && (
              <button onClick={() => handleStatusChange(selected._id, NEXT_STATUS[selected.status])}
                className="mt-5 w-full py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer" style={{ background: '#F5B301', color: '#000' }}>
                {NEXT_LABEL[selected.status]}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
