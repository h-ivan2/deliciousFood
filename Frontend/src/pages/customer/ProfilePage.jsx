import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Save, Edit3, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/api';

/**
 * Customer profile page — view and edit personal info + change password.
 * All data is read from and written to the live backend (/auth/me).
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const updated = await authService.updateProfile(form);
      setProfile(updated);
      setEditing(false);
      showToast('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('Passwords do not match');
      return;
    }
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

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${borderCol}`,
    color: textColor,
  };

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      {toast && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border"
          style={{ background: cardBg, borderColor: '#22c55e', color: textColor }}
        >
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-3xl" style={{ color: textColor }}>My Profile</h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>Manage your personal information and account security.</p>

        {/* Avatar + summary */}
        <div className="mt-8 rounded-3xl border p-8 flex items-center gap-6" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-amber-500 text-black font-black text-2xl overflow-hidden">
            {profile.avatar?.url
              ? <img src={profile.avatar.url} alt={profile.name} className="w-full h-full object-cover" />
              : (profile.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-extrabold text-xl" style={{ color: textColor }}>{profile.name}</div>
            <div className="text-sm" style={{ color: textSub }}>{profile.email}</div>
            <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'rgba(245,179,1,0.12)', color: '#F5B301', border: '1px solid rgba(245,179,1,0.3)' }}
            >
              {profile.role}
            </span>
          </div>
        </div>

        {/* Personal info */}
        <div className="mt-6 rounded-3xl border p-8" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-lg" style={{ color: textColor }}>Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border cursor-pointer"
                style={{ borderColor: '#F5B301', color: '#F5B301', background: 'transparent' }}
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{error}</div>}

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                <input
                  value={editing ? form.name : profile.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!editing}
                  className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold disabled:opacity-70"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Email (cannot be changed)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                <input
                  value={profile.email}
                  disabled
                  className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold opacity-60"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                <input
                  value={editing ? form.phone : (profile.phone || '')}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="+250 ..."
                  className="w-full rounded-2xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold disabled:opacity-70"
                  style={inputStyle}
                />
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => { setEditing(false); setForm({ name: profile.name, phone: profile.phone || '' }); }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold border cursor-pointer"
                  style={{ borderColor: borderCol, color: textSub, background: 'transparent' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change password */}
        <div className="mt-6 rounded-3xl border p-8" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-extrabold text-lg mb-6 flex items-center gap-2" style={{ color: textColor }}>
            <Lock size={18} className="text-amber-500" /> Change Password
          </h2>

          {pwError && <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">{pwError}</div>}

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Current Password</label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold"
                style={inputStyle}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>New Password</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  className="w-full rounded-2xl py-3.5 px-4 outline-none text-sm font-semibold"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={pwSaving}
              className="self-start mt-2 px-6 py-3 rounded-2xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black inline-flex items-center gap-2 disabled:opacity-60"
            >
              {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
