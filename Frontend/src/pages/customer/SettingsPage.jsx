import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Moon, Sun, Bell, Lock, LogOut, User, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/api';

const PREFS_KEY = 'df_customer_prefs';

/**
 * Customer Settings page — appearance, notification preferences,
 * password change, and account actions. Profile data comes from the
 * live backend; lightweight UI prefs persist in localStorage.
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const [profile, setProfile] = useState(null);
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem(PREFS_KEY);
    return saved ? JSON.parse(saved) : { emailNotifs: true, orderUpdates: true, promotions: false };
  });
  const [toast, setToast] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    authService.fetchMe().then(setProfile).catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputStyle = { background: inputBg, border: `1px solid ${borderCol}`, color: textColor };

  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      className="relative rounded-full transition-colors flex-shrink-0 border-none cursor-pointer"
      style={{ width: 46, height: 26, background: on ? '#F5B301' : (dark ? 'rgba(255,255,255,0.15)' : '#d1d5db') }}
    >
      <span className="absolute top-[3px] rounded-full bg-white shadow transition-all" style={{ width: 20, height: 20, left: on ? 23 : 3 }} />
    </button>
  );

  const Row = ({ icon, title, desc, children }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0" style={{ borderColor: borderCol }}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-amber-500">{icon}</span>
        <div>
          <div className="font-bold text-sm" style={{ color: textColor }}>{title}</div>
          {desc && <div className="text-xs mt-0.5" style={{ color: textSub }}>{desc}</div>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="px-6 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      {toast && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border"
          style={{ background: cardBg, borderColor: '#22c55e', color: textColor }}>
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-3xl flex items-center gap-3" style={{ color: textColor }}>
          <Settings size={28} className="text-amber-500" /> Settings
        </h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>Customize your app experience and manage your account.</p>

        {/* Account summary */}
        <div className="mt-8 rounded-3xl border p-6 flex items-center gap-4" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500 text-black font-black text-xl overflow-hidden">
            {profile?.avatar?.url
              ? <img src={profile.avatar.url} alt={profile.name} className="w-full h-full object-cover" />
              : (profile?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-base truncate" style={{ color: textColor }}>{profile?.name || '—'}</div>
            <div className="text-xs truncate" style={{ color: textSub }}>{profile?.email || ''}</div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-full text-xs font-bold border cursor-pointer"
            style={{ borderColor: '#F5B301', color: '#F5B301', background: 'transparent' }}
          >
            <User size={13} className="inline mr-1" /> Edit Profile
          </button>
        </div>

        {/* Appearance */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-2" style={{ color: textColor }}>Appearance</h2>
          <Row
            icon={dark ? <Moon size={18} /> : <Sun size={18} />}
            title="Dark Mode"
            desc="Switch between light and dark themes"
          >
            <Toggle on={dark} onClick={toggle} />
          </Row>
        </div>

        {/* Notifications */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-2" style={{ color: textColor }}>Notifications</h2>
          <Row icon={<Bell size={18} />} title="Email Notifications" desc="Receive important updates by email">
            <Toggle on={prefs.emailNotifs} onClick={() => togglePref('emailNotifs')} />
          </Row>
          <Row icon={<Bell size={18} />} title="Order Updates" desc="Get notified about your order status">
            <Toggle on={prefs.orderUpdates} onClick={() => togglePref('orderUpdates')} />
          </Row>
          <Row icon={<Bell size={18} />} title="Promotions & Offers" desc="Hear about deals and discounts">
            <Toggle on={prefs.promotions} onClick={() => togglePref('promotions')} />
          </Row>
        </div>

        {/* Security */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-5 flex items-center gap-2" style={{ color: textColor }}>
            <Lock size={18} className="text-amber-500" /> Change Password
          </h2>
          {pwError && <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{pwError}</div>}
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <input
              type="password" placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password" placeholder="New password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required
              />
              <input
                type="password" placeholder="Confirm new password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold" style={inputStyle} required
              />
            </div>
            <button
              type="submit" disabled={pwSaving}
              className="self-start px-6 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center gap-2 disabled:opacity-60"
            >
              {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              Update Password
            </button>
          </form>
        </div>

        {/* Account actions */}
        <div className="mt-6 rounded-3xl border p-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-base mb-2" style={{ color: textColor }}>Account</h2>
          <Row icon={<LogOut size={18} />} title="Log Out" desc="Sign out of your account on this device">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer bg-red-500 text-white"
            >
              Log Out
            </button>
          </Row>
        </div>
      </div>
    </div>
  );
}
