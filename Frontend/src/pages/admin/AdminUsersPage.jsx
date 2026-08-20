import { useState, useEffect, useMemo } from 'react';
import {
  Users, Shield, UserCheck, UserX,
  Search, ChevronLeft, ChevronRight, Loader2,
  Trash2, Edit3, X, Check,
} from 'lucide-react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { adminService } from '../../services/api';

const ROLES = ['All', 'customer', 'owner', 'admin'];
const PER_PAGE = 10;

/**
 * Admin Users page — view, search, edit role, and delete platform users.
 */
export default function AdminUsersPage() {
  const { bg, cardBg, borderCol, textTitle, textSub, dark } = useAdminTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // user obj or null
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await adminService.getUsers(search, roleFilter === 'All' ? '' : roleFilter);
      setUsers(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPage(1);
    load();
  };

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9f9f9';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e5e5';
  const inputColor = dark ? '#fff' : '#1a1a1a';

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const openEdit = (user) => {
    setEditing(user);
    setEditForm({ name: user.name, role: user.role, isActive: user.isActive ?? true });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await adminService.updateUser(editing._id, editForm);
      setUsers((prev) => prev.map((u) => (u._id === editing._id ? updated : u)));
      setEditing(null);
    } catch (err) {
      alert(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const ROLE_CONFIG = {
    admin:    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
    owner:    { color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
    customer: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  };

  const summary = useMemo(() => {
    const counts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
    return [
      { label: 'Total Users', value: users.length, Icon: Users, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
      { label: 'Admins', value: counts.admin || 0, Icon: Shield, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
      { label: 'Owners', value: counts.owner || 0, Icon: UserCheck, color: '#F5B301', bg: 'rgba(245,179,1,0.12)' },
      { label: 'Customers', value: counts.customer || 0, Icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    ];
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: bg }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textTitle }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: textSub }}>Manage all platform users</p>
        </div>
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

      {/* Role filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ROLES.map((r) => (
          <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
            className="px-4 py-2 rounded-full text-xs font-bold border cursor-pointer"
            style={{ background: roleFilter === r ? '#F5B301' : inputBg, borderColor: roleFilter === r ? '#F5B301' : inputBorder, color: roleFilter === r ? '#000' : textSub }}>
            {r === 'All' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              className="w-full rounded-xl text-sm outline-none pl-10 pr-4 py-2.5"
              style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}
            />
          </div>
          <button onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer"
            style={{ background: '#F5B301', borderColor: '#F5B301', color: '#000' }}>
            Search
          </button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-sm" style={{ color: textSub }}>No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: borderCol }}>
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-6 py-3" style={{ color: textSub, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => {
                  const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.customer;
                  return (
                    <tr key={user._id} className="border-b" style={{ borderColor: borderCol }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                            style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', color: textSub }}>
                            {(user.name || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold" style={{ color: textTitle }}>{user.name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: textTitle }}>{user.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: textTitle }}>{user.phone || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ color: rc.color, background: rc.bg }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: user.isActive !== false ? '#22c55e' : '#f87171' }}>
                          {user.isActive !== false ? <Check size={11} /> : <X size={11} />}
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm" style={{ color: textTitle }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(user)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
                            style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                            <Edit3 size={13} style={{ color: textSub }} />
                          </button>
                          <button onClick={() => handleDelete(user._id, user.name)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer hover:opacity-70"
                            style={{ borderColor: borderCol, background: dark ? 'rgba(255,255,255,0.04)' : '#f8f8f8' }}>
                            <Trash2 size={13} style={{ color: '#f87171' }} />
                          </button>
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
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} users
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditing(null)}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: cardBg, borderColor: borderCol }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: textTitle }}>Edit User</h2>
              <button onClick={() => setEditing(null)} className="text-xl leading-none bg-transparent border-none cursor-pointer" style={{ color: textSub }}>×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: textSub }}>Name</label>
                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl text-sm outline-none px-4 py-2.5"
                  style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }} />
              </div>

              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: textSub }}>Role</label>
                <select value={editForm.role || 'customer'} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-xl text-sm outline-none px-4 py-2.5 cursor-pointer"
                  style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor }}>
                  <option value="customer">Customer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: textSub }}>Status</label>
                <div className="flex gap-3">
                  {['Active', 'Inactive'].map((s) => {
                    const val = s === 'Active';
                    return (
                      <button key={s} onClick={() => setEditForm((f) => ({ ...f, isActive: val }))}
                        className="flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer"
                        style={{ background: (editForm.isActive === val || (editForm.isActive === undefined && val)) ? '#F5B301' : inputBg, borderColor: '#F5B301', color: (editForm.isActive === val || (editForm.isActive === undefined && val)) ? '#000' : textSub }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={handleSaveEdit} disabled={saving}
                className="w-full py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer disabled:opacity-50"
                style={{ background: '#F5B301', color: '#000' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
