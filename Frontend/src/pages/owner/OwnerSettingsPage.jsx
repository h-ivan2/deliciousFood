import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Phone, Mail, MapPin, Save, Loader2, CheckCircle2, Lock, Power } from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Owner Settings page — edit the owner's restaurant details, toggle open/closed,
 * and change account password. Reads the owner's restaurant from /restaurants/my
 * and persists changes through the live backend.
 */
export default function OwnerSettingsPage() {
  const navigate = useNavigate();
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', phone: '', email: '', street: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('df_token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/restaurants/my`, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load restaurant');
      const r = (json.data || [])[0];
      if (r) {
        setRestaurant(r);
        setForm({
          name: r.name || '',
          description: r.description || '',
          phone: r.phone || '',
          email: r.email || '',
          street: r.address?.street || '',
          city: r.address?.city || '',
        });
      }
    } catch (err) {
      if (/401|auth/i.test(err.message)) return navigate('/login');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/restaurants/${restaurant._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          phone: form.phone,
          email: form.email,
          address: { ...restaurant.address, street: form.street, city: form.city },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to save');
      setRestaurant(json.data);
      showToast('Restaurant details updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOpen = async () => {
    if (!restaurant) return;
    try {
      const res = await fetch(`${API_BASE}/restaurants/${restaurant._id}/toggle`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to toggle');
      setRestaurant((r) => ({ ...r, isOpen: json.isOpen }));
      showToast(json.isOpen ? 'Restaurant is now OPEN' : 'Restaurant is now CLOSED');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword.length < 8) return setPwError('New password must be at least 8 characters');
    if (pwForm.newPassword !== pwForm.confirm) return setPwError('Passwords do not match');
    setPwSaving(true);
    try {
      await authService.updatePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      showToast('Password changed successfully');
    } catch (err) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputStyle = { background: inputBg, border: `1px solid ${borderCol}`, color: textTitle };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 min-h-full" style={{ background: bg }}>
      {toast && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border"
          style={{ background: cardBg, borderColor: '#22c55e', color: textTitle }}>
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-3xl" style={{ color: textTitle }}>Settings</h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>Update your restaurant details and account preferences.</p>

        {error && <div className="mt-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

        {!restaurant ? (
          <div className="mt-8 rounded-3xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
            You don&apos;t have a registered restaurant yet.
            <div className="mt-4">
              <button
                onClick={() => navigate('/register-restaurant')}
                className="px-6 py-3 rounded-full text-xs font-black border-none cursor-pointer bg-amber-500 text-black"
              >
                Register a Restaurant
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Open / Closed toggle */}
            <div className="mt-8 rounded-3xl border p-6 flex items-center justify-between" style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-center gap-3">
                <span className="text-amber-500"><Power size={20} /></span>
                <div>
                  <div className="font-bold text-sm" style={{ color: textTitle }}>Restaurant Status</div>
                  <div className="text-xs mt-0.5" style={{ color: textSub }}>
                    {restaurant.status !== 'approved'
                      ? 'Your restaurant must be approved before it can open.'
                      : restaurant.isOpen ? 'Currently accepting orders' : 'Currently closed'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleOpen}
                disabled={restaurant.status !== 'approved'}
                className="px-5 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer disabled:opacity-50"
                style={{ background: restaurant.isOpen ? '#22c55e' : 'rgba(148,163,184,0.2)', color: restaurant.isOpen ? '#fff' : textSub }}
              >
                {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
              </button>
            </div>

            {/* Restaurant details */}
            <div className="mt-6 rounded-3xl border p-8" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-extrabold text-lg mb-6 flex items-center gap-2" style={{ color: textTitle }}>
                <Store size={18} className="text-amber-500" /> Restaurant Details
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Restaurant Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold resize-none" style={inputStyle} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Phone</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold" style={inputStyle} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Street</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                      <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                        className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} />
                  </div>
                </div>
                <button
                  onClick={handleSave} disabled={saving}
                  className="self-start mt-2 px-6 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </div>

           
            <div className="mt-6 rounded-3xl border p-8" style={{ background: cardBg, borderColor: borderCol }}>
              <h2 className="font-extrabold text-lg mb-5 flex items-center gap-2" style={{ color: textTitle }}>
                <Lock size={18} className="text-amber-500" /> Change Password
              </h2>
              {pwError && <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{pwError}</div>}
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <input type="password" placeholder="Current password" value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="password" placeholder="New password" value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required />
                  <input type="password" placeholder="Confirm new password" value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                    className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required />
                </div>
                <button type="submit" disabled={pwSaving}
                  className="self-start px-6 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center gap-2 disabled:opacity-60">
                  {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                  Update Password
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
