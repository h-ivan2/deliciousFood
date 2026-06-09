import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Loader2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { ownerService } from '../../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#F5B301', '#60a5fa', '#22c55e', '#a855f7', '#f472b6', '#fb923c'];

/**
 * Owner Reports & Analytics — revenue/orders trends, sales by category,
 * and top menu items, all computed from the restaurant's live order data.
 */
export default function OwnerReportsPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restaurants = await ownerService.getMyRestaurants();
        const primary = (restaurants || [])[0];
        if (!primary) { if (active) { setRestaurant(null); setLoading(false); } return; }
        if (!active) return;
        setRestaurant(primary);
        const list = await ownerService.getRestaurantOrders(primary._id);
        if (active) setOrders(list || []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load reports');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((o) => ['delivered', 'completed'].includes(o.status)),
    [orders]
  );

  const kpis = useMemo(() => {
    const revenue = paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const aov = paidOrders.length ? revenue / paidOrders.length : 0;
    const customers = new Set(orders.map((o) => o.customer?._id || o.customer)).size;
    return [
      { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, Icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
      { label: 'Total Orders', value: totalOrders, Icon: ShoppingBag, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
      { label: 'Avg Order Value', value: `$${aov.toFixed(2)}`, Icon: TrendingUp, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
      { label: 'Total Customers', value: customers, Icon: Users, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
    ];
  }, [orders, paidOrders]);

  // Revenue & order count grouped by month
  const monthly = useMemo(() => {
    const acc = MONTHS.map((m) => ({ month: m, revenue: 0, orders: 0 }));
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const idx = d.getMonth();
      acc[idx].orders += 1;
      if (['delivered', 'completed'].includes(o.status)) acc[idx].revenue += o.totalAmount || 0;
    });
    // Only keep months that have data, but keep at least the chart readable
    return acc;
  }, [orders]);

  // Top items + category split derived from order line items
  const { topItems, categoryData } = useMemo(() => {
    const itemMap = new Map();
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const key = it.name;
        const existing = itemMap.get(key) || { name: key, orders: 0, revenue: 0 };
        existing.orders += it.quantity || 1;
        existing.revenue += (it.price || 0) * (it.quantity || 1);
        itemMap.set(key, existing);
      });
    });
    const sorted = Array.from(itemMap.values()).sort((a, b) => b.orders - a.orders);
    const top = sorted.slice(0, 5);
    const cats = sorted.slice(0, 6).map((it, i) => ({ name: it.name, value: it.orders, color: PIE_COLORS[i % PIE_COLORS.length] }));
    return { topItems: top, categoryData: cats };
  }, [orders]);

  const gridColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
  const axisColor = dark ? 'rgba(255,255,255,0.3)' : '#aaa';
  const maxItemOrders = topItems[0]?.orders || 1;

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
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Reports & Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Performance for {restaurant.name}</p>
        </div>
      </div>

      {error && <div className="mb-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

      {orders.length === 0 ? (
        <div className="rounded-2xl border p-16 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
          No order data yet. Reports will populate as customers place orders.
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {kpis.map(({ label, value, Icon, color, bg: cbg }) => (
              <div key={label} className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: borderCol }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: cbg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-2xl font-black" style={{ color: textTitle }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: textSub }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Revenue & Orders line chart */}
            <div className="xl:col-span-2 rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-bold" style={{ color: textTitle }}>Revenue & Orders</h2>
              <p className="text-xs mt-0.5 mb-6" style={{ color: textSub }}>Monthly performance (this year)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#F5B301" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="#818cf8" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-5 mt-3">
                {[{ label: 'Revenue', color: '#F5B301' }, { label: 'Orders', color: '#818cf8' }].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                    <span className="text-xs" style={{ color: textSub }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-bold mb-1" style={{ color: textTitle }}>Top Sellers Split</h2>
              <p className="text-xs mb-4" style={{ color: textSub }}>By order volume</p>
              {categoryData.length === 0 ? (
                <p className="text-sm" style={{ color: textSub }}>No item data yet.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {categoryData.map((c) => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <span className="text-xs flex-1 truncate" style={{ color: textSub }}>{c.name}</span>
                        <span className="text-xs font-bold" style={{ color: textTitle }}>{c.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bar chart + Top items */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-bold mb-1" style={{ color: textTitle }}>Monthly Orders</h2>
              <p className="text-xs mb-4" style={{ color: textSub }}>Order volume by month</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, fontSize: 11, color: textTitle }} />
                  <Bar dataKey="orders" fill="#F5B301" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-bold mb-4" style={{ color: textTitle }}>Top Menu Items</h2>
              {topItems.length === 0 ? (
                <p className="text-sm" style={{ color: textSub }}>No item data yet.</p>
              ) : (
                <div className="space-y-4">
                  {topItems.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs font-black w-4 text-center flex-shrink-0" style={{ color: idx === 0 ? '#F5B301' : textSub }}>#{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: textTitle }}>{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="h-1 rounded-full flex-1" style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f0f0f0' }}>
                            <div className="h-full rounded-full" style={{ width: `${(item.orders / maxItemOrders) * 100}%`, background: '#F5B301' }} />
                          </div>
                          <span className="text-xs flex-shrink-0" style={{ color: textSub }}>{item.orders}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: '#22c55e' }}>${item.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
