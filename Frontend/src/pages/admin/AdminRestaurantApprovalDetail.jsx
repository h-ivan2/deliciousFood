import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/api';
import { getRestaurantImage, formatDetailSubmitted } from '../../utils/adminRestaurantData';
import { IMG_REST_SPICE_ROUTE } from '../../constants/images';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'restaurant', label: 'Restaurant info' },
  { id: 'owner', label: 'Owner info' },
  { id: 'documents', label: 'Documents' },
  { id: 'photos', label: 'Photos & Menus' },
];

export default function AdminRestaurantApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rest, setRest] = useState(null);
  const [section, setSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { bg, cardBg, textTitle, textSub, borderCol, navInactive, tableOverlay } = useAdminTheme();

  useEffect(() => {
    adminService
      .getRestaurantById(id)
      .then(setRest)
      .catch(() => navigate('/admin/approve'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApprove = async () => {
    await adminService.approveRestaurant(id, 'approved');
    navigate('/admin/approve');
  };

  const handleReject = async () => {
    await adminService.approveRestaurant(id, 'rejected', 'Rejected from detail view');
    navigate('/admin/approve');
  };

  if (loading || !rest) {
    return (
      <div className="p-12 text-center min-h-full" style={{ background: bg, color: textSub }}>
        Loading...
      </div>
    );
  }

  const photos = rest.photos || [
    getRestaurantImage(rest),
    IMG_REST_SPICE_ROUTE,
    getRestaurantImage(rest),
    IMG_REST_SPICE_ROUTE,
  ];
  const menu = rest.menuPreview || photos.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: bg, color: textTitle }}>
      <div className="px-8 lg:px-12 pt-10">
        <h1 className="font-display font-black text-3xl mb-6" style={{ color: textTitle }}>
          Restaurant Approval Details
        </h1>

        {/* Top bar */}
        <div
          className="rounded-2xl border px-6 py-4 flex flex-wrap items-center gap-4 mb-8"
          style={{ borderColor: borderCol, background: cardBg }}
        >
          <button
            type="button"
            onClick={() => navigate('/admin/approve')}
            className="flex items-center gap-2 text-sm font-semibold border-none bg-transparent cursor-pointer"
            style={{ color: textSub }}
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <img
              src={getRestaurantImage(rest)}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-[#F5B301]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-lg">{rest.name}</span>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(245,179,1,0.2)', color: '#b45309' }}
                >
                  {rest.restaurantType || 'Cafe'}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: textSub }}>
                Submitted on {formatDetailSubmitted(rest.createdAt)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/approve')}
            className="border-none bg-transparent cursor-pointer p-2"
            style={{ color: textSub }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left nav */}
          <aside
            className="lg:w-56 flex-shrink-0 rounded-2xl border overflow-hidden p-2"
            style={{ borderColor: borderCol, background: cardBg }}
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold border-none cursor-pointer mb-1 transition-colors"
                style={{
                  background: section === s.id ? 'rgba(245,179,1,0.12)' : 'transparent',
                  color: section === s.id ? '#F5B301' : navInactive,
                }}
              >
                {s.label}
              </button>
            ))}
          </aside>

          {/* Main grid */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div
              className="rounded-2xl border overflow-hidden relative min-h-[320px] p-8"
              style={{ borderColor: borderCol }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${IMG_REST_SPICE_ROUTE})` }}
              />
              <div className="absolute inset-0 backdrop-blur-sm" style={{ background: tableOverlay }} />
              <div className="relative">
                <h2 className="font-black text-lg mb-6">Restaurant information</h2>
                <dl className="space-y-4 text-sm">
                  {[
                    ['Restaurant Name', rest.name],
                    ['Type', rest.restaurantType],
                    ['Contact', rest.phone],
                    ['Email', rest.email || rest.owner?.email],
                    ['Address', rest.address],
                    ['Opening hours', rest.openingHours || '09:00AM - 10:00PM'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b pb-3" style={{ borderColor: borderCol }}>
                      <dt className="font-medium" style={{ color: textSub }}>{label}</dt>
                      <dd className="font-bold text-right" style={{ color: textTitle }}>{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="rounded-2xl border p-6" style={{ borderColor: borderCol, background: cardBg }}>
                <h2 className="font-black text-lg mb-4">Photos</h2>
                <div className="grid grid-cols-2 gap-2 h-[220px]">
                  <img src={photos[0]} alt="" className="row-span-2 w-full h-full object-cover rounded-xl" />
                  {photos.slice(1, 4).map((src, i) => (
                    <img key={i} src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border p-6" style={{ borderColor: borderCol, background: cardBg }}>
                <h2 className="font-black text-lg mb-4">Menu Preview</h2>
                <div className="grid grid-cols-4 gap-2">
                  {menu.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square object-cover rounded-xl w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="fixed bottom-0 left-0 lg:left-[260px] right-0 border-t px-8 lg:px-12 py-5 flex justify-end gap-4 z-40"
        style={{ borderColor: borderCol, background: cardBg }}
      >
        <button
          type="button"
          onClick={handleReject}
          className="px-10 py-3.5 rounded-xl font-bold text-sm border cursor-pointer text-red-500 bg-red-50"
          style={{ borderColor: '#fca5a5' }}
        >
          Reject
        </button>
        <button
          type="button"
          onClick={handleApprove}
          className="px-10 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-white"
          style={{ background: '#15803d' }}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
