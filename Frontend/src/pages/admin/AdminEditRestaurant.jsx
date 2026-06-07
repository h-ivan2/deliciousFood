import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { adminService } from '../../services/api';
import { getRestaurantImage } from '../../utils/adminRestaurantData';
import { IMG_REST_SPICE_ROUTE } from '../../constants/images';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const SECTIONS = [
  { id: 'basic', label: 'Basic information' },
  { id: 'owner', label: 'Owner information' },
  { id: 'menu', label: 'Menu' },
  { id: 'documents', label: 'Documents' },
];

export default function AdminEditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState('basic');
  const [form, setForm] = useState({
    name: '',
    restaurantType: 'Cafe',
    phone: '',
    email: '',
    address: '',
    openFrom: '00:00 AM',
    openTo: '00:00 AM',
    ownerName: '',
    ownerEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { bg, cardBg, textTitle, textSub, borderCol, navInactive, inputBg, inputBorder, inputColor, tableOverlay } = useAdminTheme();

  useEffect(() => {
    adminService
      .getRestaurantById(id)
      .then((r) => {
        setForm({
          name: r.name || '',
          restaurantType: r.restaurantType || 'Cafe',
          phone: r.phone || '',
          email: r.email || r.owner?.email || '',
          address: r.address || '',
          openFrom: '00:00 AM',
          openTo: '00:00 AM',
          ownerName: r.owner?.name || '',
          ownerEmail: r.owner?.email || '',
        });
      })
      .catch(() => navigate('/admin/restaurants'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateRestaurant(id, {
        name: form.name,
        restaurantType: form.restaurantType,
        phone: form.phone,
        email: form.email,
        address: form.address,
        owner: { name: form.ownerName, email: form.ownerEmail },
      });
      navigate('/admin/restaurants');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center min-h-full" style={{ background: bg, color: textSub }}>
        Loading...
      </div>
    );
  }

  const inputStyle = { background: inputBg, borderColor: inputBorder, color: inputColor };
  const inputClass = 'w-full rounded-xl py-3 px-4 text-sm outline-none border';
  const labelClass = 'block text-sm font-semibold mb-2';

  return (
    <div className="min-h-screen flex flex-col pb-28" style={{ background: bg, color: textTitle }}>
      <div className="px-8 lg:px-12 pt-10 flex-1">
        <button
          type="button"
          onClick={() => navigate('/admin/restaurants')}
          className="flex items-center gap-2 text-sm font-semibold border-none bg-transparent cursor-pointer mb-6"
          style={{ color: textSub }}
        >
          <ArrowLeft size={16} />
          Back to Restaurants
        </button>

        <h1 className="font-display font-black text-3xl" style={{ color: textTitle }}>Edit Restaurant</h1>
        <p className="text-sm mt-2 mb-10" style={{ color: textSub }}>Update Restaurant details and menu</p>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Section nav */}
          <aside
            className="xl:w-64 flex-shrink-0 rounded-2xl border overflow-hidden relative min-h-[400px]"
            style={{ borderColor: borderCol }}
          >
            <img
              src={IMG_REST_SPICE_ROUTE}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="relative p-3 backdrop-blur-sm min-h-full" style={{ background: tableOverlay }}>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold border-none cursor-pointer mb-1"
                  style={{
                    background: section === s.id ? 'rgba(245,179,1,0.15)' : 'transparent',
                    color: section === s.id ? '#F5B301' : navInactive,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Form */}
          <div
            className="flex-1 rounded-2xl border p-8"
            style={{ borderColor: borderCol, background: cardBg }}
          >
            <h2 className="font-black text-xl mb-8">Basic information</h2>

            {section === 'basic' && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div>
                  <label className={labelClass} style={{ color: textSub }}>Restaurant Name</label>
                  <input className={inputClass} style={inputStyle} value={form.name} onChange={handleChange('name')} />
                </div>
                <div>
                  <label className={labelClass}>Restaurant Type</label>
                  <select
                    className={inputClass}
                    style={inputStyle}
                    value={form.restaurantType}
                    onChange={handleChange('restaurantType')}
                  >
                    {['Cafe', 'Restaurant', 'Fast Food', 'Sea Food', 'Healthy'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input className={inputClass} style={inputStyle} value={form.phone} onChange={handleChange('phone')} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} style={inputStyle} value={form.email} onChange={handleChange('email')} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input className={inputClass} style={inputStyle} value={form.address} onChange={handleChange('address')} />
                </div>
                <div>
                  <label className={labelClass}>Opening Hours</label>
                  <div className="flex items-center gap-3">
                    <input className={inputClass} style={inputStyle} value={form.openFrom} onChange={handleChange('openFrom')} />
                    <span className="text-gray-400">—</span>
                    <input className={inputClass} style={inputStyle} value={form.openTo} onChange={handleChange('openTo')} />
                  </div>
                </div>
              </div>
            )}

            {section === 'owner' && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div>
                  <label className={labelClass}>Owner Name</label>
                  <input className={inputClass} style={inputStyle} value={form.ownerName} onChange={handleChange('ownerName')} />
                </div>
                <div>
                  <label className={labelClass}>Owner Email</label>
                  <input className={inputClass} style={inputStyle} value={form.ownerEmail} onChange={handleChange('ownerEmail')} />
                </div>
              </div>
            )}

            {(section === 'menu' || section === 'documents') && (
              <p className="text-sm" style={{ color: textSub }}>This section will connect to menu and document APIs when available.</p>
            )}
          </div>

          {/* Media column */}
          <div className="xl:w-72 flex-shrink-0 flex flex-col gap-6">
            <div className="rounded-2xl border p-6 text-center" style={{ borderColor: borderCol, background: cardBg }}>
              <p className="font-bold text-sm mb-4">Restaurant Logo</p>
              <img
                src={getRestaurantImage({ name: form.name })}
                alt=""
                className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-green-600/30"
              />
              <button
                type="button"
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold border cursor-pointer"
                style={{ borderColor: '#F5B301', color: '#F5B301', background: '#fff' }}
              >
                Change Logo
              </button>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: borderCol, background: cardBg }}>
              <p className="font-bold text-sm mb-4">Cover Photos</p>
              <div className="grid grid-cols-2 gap-2">
                {[getRestaurantImage({ name: form.name }), IMG_REST_SPICE_ROUTE, getRestaurantImage({ name: form.name })].map((src, i) => (
                  <img key={i} src={src} alt="" className="aspect-square object-cover rounded-lg w-full" />
                ))}
                <button
                  type="button"
                  className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-400 text-xs font-semibold cursor-pointer bg-gray-50"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <Plus size={20} />
                  Add Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 lg:left-[260px] right-0 border-t px-8 lg:px-12 py-5 flex justify-end gap-4"
        style={{ borderColor: borderCol, background: cardBg }}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/restaurants')}
          className="px-8 py-3 rounded-xl font-bold text-sm border-none cursor-pointer"
          style={{ background: '#e9e0f5', color: '#4b5563' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl font-bold text-sm border-none cursor-pointer disabled:opacity-60"
          style={{ background: 'rgba(245,179,1,0.35)', color: '#92400e' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
