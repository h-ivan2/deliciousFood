import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { getRestaurantImage, formatTableDate, paginate } from '../../utils/adminRestaurantData';
import RestaurantTablePanel, { AllRestaurantsTableRow } from '../../components/admin/RestaurantTablePanel';
import DeleteRestaurantModal from '../../components/admin/DeleteRestaurantModal';
import { useAdminTheme } from '../../hooks/useAdminTheme';

export default function AdminAllRestaurants() {
  const navigate = useNavigate();
  const { bg, textTitle, textSub, tableHeadBg, borderCol } = useAdminTheme();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllRestaurants();
      setRestaurants(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return restaurants;
    const term = search.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.owner?.name?.toLowerCase().includes(term)
    );
  }, [restaurants, search]);

  const { items, total, totalPages, from, to } = paginate(filtered, page, 5);

  useEffect(() => setPage(1), [search]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await adminService.deleteRestaurant(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div className="px-8 lg:px-12 py-10 max-w-[1400px] min-h-full" style={{ background: bg }}>
      <header className="mb-8">
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight" style={{ color: textTitle }}>
          All Restaurants
        </h1>
        <p className="text-sm mt-2 font-medium" style={{ color: textSub }}>Manage all registered Restaurants</p>
      </header>

      {loading ? (
        <div className="py-20 text-center font-semibold" style={{ color: textSub }}>Loading...</div>
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
                {['Name', 'Owner', 'Category', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: textSub }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((rest) => (
                <AllRestaurantsTableRow
                  key={rest._id}
                  rest={rest}
                  image={getRestaurantImage(rest)}
                  onEdit={() => navigate(`/admin/restaurants/${rest._id}/edit`)}
                  onView={() =>
                    rest.status === 'pending'
                      ? navigate(`/admin/approve/${rest._id}`)
                      : navigate(`/admin/restaurants/${rest._id}/edit`)
                  }
                  onDelete={() => setDeleteId(rest._id)}
                />
              ))}
            </tbody>
          </table>
        </RestaurantTablePanel>
      )}

      <DeleteRestaurantModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
