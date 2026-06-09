import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, Lock, Moon, Sun, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/api';

const PREFS_KEY = 'df_admin_prefs';

/**
 * Admin Settings page — admin profile, password change, appearance,
 * and platform preference toggles. Profile + password use the live backend.
 */
export default function AdminSettings() {
  const navigate = useNavigate();
  const { bg, cardBg, borderCol, textTitle, textSub, dark, toggle } = useAdminTheme();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem(PREFS_KEY);
    return saved ? JSON.parse(saved) : { autoApprove: false, maintenanceMode: false, emailAlerts: true };
  });

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    authService
      .fetchMe()
      .then((me) => {
        if (!me) return navigate('/login');
        setProfile(me);
        setForm({ name: me.name || '', phone: me.phone || '' });
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await authService.updateProfile(form);
      setProfile(updated);
      showToast('Profile updated');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputStyle = { background: inputBg, border: `1px solid ${borderCol}`, color: textTitle };

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className="relative rounded-full transition-colors flex-shrink-0 border-none cursor-pointer"
      style={{ width: 46, height: 26, background: on ? '#F5B301' : (dark ? 'rgba(255,255,255,0.15)' : '#d1d5db') }}>
      <span className="absolute top-[3px] rounded-full bg-white shadow transition-all" style={{ width: 20, height: 20, left: on ? 23 : 3 }} />
    </button>
  );

  const Row = ({ icon, title, desc, children }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0" style={{ borderColor: borderCol }}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-amber-500">{icon}</span>
        <div>
          <div className="font-bold text-sm" style={{ color: textTitle }}>{title}</div>
          {desc && <div className="text-xs mt-0.5" style={{ color: textSub }}>{desc}</div>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="px-8 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      {toast && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border"
          style={{ background: cardBg, borderColor: '#22c55e', color: textTitle }}>
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-3xl flex items-center gap-3" style={{ color: textTitle }}>
          <Settings size={28} className="text-amber-500" /> Settings
        </h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>System configuration and your administrator account.</p>

        {error && <div className="mt-6 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

        {/* Admin profile */}
        <div className="mt-8 rounded-3xl border p-8" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-lg mb-6 flex items-center gap-2" style={{ color: textTitle }}>
            <Shield size={18} className="text-amber-500" /> Administrator Profile
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Email (cannot be changed)</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                <input value={profile?.email || ''} disabled
                  className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold opacity-60" style={inputStyle} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="self-start mt-2 px-6 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <User size={14} />}
              Save Profile
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-2" style={{ color: textTitle }}>Appearance</h2>
          <Row icon={dark ? <Moon size={18} /> : <Sun size={18} />} title="Dark Mode" desc="Toggle the admin panel theme">
            <Toggle on={dark} onClick={toggle} />
          </Row>
        </div>

        {/* Platform preferences */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-2" style={{ color: textTitle }}>Platform Preferences</h2>
          <Row icon={<Settings size={18} />} title="Auto-approve restaurants" desc="Skip manual review for new submissions">
            <Toggle on={prefs.autoApprove} onClick={() => togglePref('autoApprove')} />
          </Row>
          <Row icon={<Settings size={18} />} title="Maintenance mode" desc="Temporarily limit platform access">
            <Toggle on={prefs.maintenanceMode} onClick={() => togglePref('maintenanceMode')} />
          </Row>
          <Row icon={<Mail size={18} />} title="Email alerts" desc="Receive admin email notifications">
            <Toggle on={prefs.emailAlerts} onClick={() => togglePref('emailAlerts')} />
          </Row>
          <p className="text-[11px] mt-4" style={{ color: textSub }}>
            Preferences are saved on this device. Hook them to a platform-config endpoint when ready.
          </p>
        </div>

        {/* Password */}
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
      </div>
    </div>
  );
}
