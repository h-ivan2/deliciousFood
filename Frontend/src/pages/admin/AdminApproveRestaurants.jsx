import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { adminService } from '../../services/api';
import {
  getRestaurantImage,
  formatTableDate,
  paginate,
} from '../../utils/adminRestaurantData';
import RestaurantTablePanel, { ApproveTableRow } from '../../components/admin/RestaurantTablePanel';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function AdminApproveRestaurants() {
  const navigate = useNavigate();
  const { setPendingCount } = useOutletContext() || {};
  const { bg, textTitle, textSub, navInactive, tableHeadBg, borderCol } = useAdminTheme();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, a, r] = await Promise.all([
        adminService.getPendingRestaurants(),
        adminService.getRestaurantsByStatus('approved'),
        adminService.getRestaurantsByStatus('rejected'),
      ]);
      setPending(p);
      setApproved(a);
      setRejected(r);
      setPendingCount?.(p.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const list = activeTab === 'pending' ? pending : activeTab === 'approved' ? approved : rejected;

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.owner?.name?.toLowerCase().includes(term) ||
        r.restaurantType?.toLowerCase().includes(term)
    );
  }, [list, search]);

  const { items, total, totalPages, from, to } = paginate(filtered, page, 5);

  useEffect(() => setPage(1), [activeTab, search]);

  const handleApprove = async (id, e) => {
    e?.stopPropagation();
    await adminService.approveRestaurant(id, 'approved');
    await load();
  };

  const handleReject = async (id, e) => {
    e?.stopPropagation();
    await adminService.approveRestaurant(id, 'rejected', 'Rejected by admin');
    await load();
  };

  const tabCount = (id) => {
    if (id === 'pending') return pending.length;
    if (id === 'approved') return approved.length;
    return rejected.length;
  };

  return (
    <div className="px-8 lg:px-12 py-10 max-w-[1400px] min-h-full" style={{ background: bg }}>
      <header className="mb-8">
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight" style={{ color: textTitle }}>
          Approve Restaurants
        </h1>
        <p className="text-sm mt-2 font-medium" style={{ color: textSub }}>
          Review and approve all restaurant registrations
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const count = tabCount(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-2.5 rounded-full text-sm font-bold border-none cursor-pointer transition-all"
              style={{
                background: active ? 'rgba(245,179,1,0.15)' : 'transparent',
                color: active ? '#F5B301' : navInactive,
              }}
            >
              {tab.label}
              {tab.id === 'pending' && count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center font-semibold" style={{ color: textSub }}>Loading restaurants...</div>
      ) : (
        <RestaurantTablePanel
          search={search}
          onSearchChange={setSearch}
          footer={`Showing ${from} to ${to} of ${total} restaurants`}
          pagination={{ page, totalPages }}
          onPageChange={setPage}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: borderCol, background: tableHeadBg }}>
                {['Restaurant', 'Owner', 'Type', 'Submitted date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: textSub }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm" style={{ color: textSub }}>
                    No restaurants in this category.
                  </td>
                </tr>
              ) : (
                items.map((rest) => (
                  <ApproveTableRow
                    key={rest._id}
                    rest={rest}
                    image={getRestaurantImage(rest)}
                    dateLabel={formatTableDate(rest.createdAt)}
                    onApprove={(e) => handleApprove(rest._id, e)}
                    onReject={(e) => handleReject(rest._id, e)}
                    onRowClick={() => navigate(`/admin/approve/${rest._id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </RestaurantTablePanel>
      )}
    </div>
  );
}
