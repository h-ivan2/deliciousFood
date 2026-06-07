import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { authService } from '../../services/api';

export default function AdminTopBar({
  title,
  subtitle,
  badge,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  showSearch = true,
}) {
  const navigate = useNavigate();
  const t = useAdminTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const user = authService.getCurrentUser() || { name: 'Super Admin', email: 'admin@delicious.com' };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10 pb-8 border-b"
      style={{ borderColor: t.borderCol }}
    >
      <div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight leading-none" style={{ color: t.textTitle }}>
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm mt-3 font-semibold" style={{ color: t.textSub }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {showSearch && (
          <div className="relative w-full sm:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: t.textSub }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={searchValue ?? ''}
              onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
              readOnly={!onSearchChange}
              className="w-full text-xs rounded-full py-4 pl-12 pr-4 outline-none border transition-all duration-200"
              style={{
                background: t.inputBg,
                borderColor: t.inputBorder,
                color: t.inputColor,
              }}
              onFocus={(e) => { e.target.style.borderColor = t.accent; }}
              onBlur={(e) => { e.target.style.borderColor = t.inputBorder; }}
            />
          </div>
        )}

        <ThemeToggle />

        <button
          type="button"
          className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all"
          style={{ background: t.inputBg, color: t.textTitle, border: `1px solid ${t.borderCol}` }}
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileDropdown((p) => !p)}
            className="flex items-center gap-3 cursor-pointer border-none bg-transparent text-left"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: t.accent, color: '#000' }}
            >
              SA
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xs" style={{ color: t.textTitle }}>{user.name}</div>
              <div className="text-[10px]" style={{ color: t.textSub }}>Administrator</div>
            </div>
            <ChevronDown size={14} style={{ color: t.textSub }} />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-4 w-60 rounded-3xl shadow-2xl border p-4 z-50"
                style={{ background: t.cardBg, borderColor: t.borderCol }}
              >
                <div className="px-4 py-3 border-b text-xs mb-2" style={{ borderColor: t.borderCol, color: t.textTitle }}>
                  <div className="font-bold truncate">{user.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowProfileDropdown(false); navigate('/admin/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left border-none bg-transparent font-bold text-xs cursor-pointer hover:opacity-80"
                  style={{ color: t.textTitle }}
                >
                  <Settings size={14} /> Profile Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left border-none bg-transparent text-red-500 font-bold text-xs cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
