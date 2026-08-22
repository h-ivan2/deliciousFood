import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  ShoppingBag,
  Heart,
  Percent,
  User,
  Settings,
  MapPin,
  Wallet,
  Bell,
  ShoppingCart,
  ChevronDown,
  Search,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/api';
import { Logo, ThemeToggle } from '../ui';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, walletBalance, topUpWallet } = useCart();
  const { dark } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('20.00');

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('df_token');
    if (!user || !token) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    // Refresh from the server so the header always shows live data
    authService.fetchMe().then((fresh) => fresh && setCurrentUser(fresh)).catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (Number(topUpAmount) > 0) {
      try {
        await topUpWallet(Number(topUpAmount));
        setShowTopUp(false);
      } catch (err) {
        alert(err.message || 'Top-up failed');
      }
    }
  };

  const NAV_ITEMS = [
    { to: '/explore', label: 'Home', icon: Home },
    { to: '/browse', label: 'Browse Restaurants', icon: Compass },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/offers', label: 'Offers', icon: Percent },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  // ── Theme tokens ──────────────────────────────
  const bgColor = dark ? '#070B14' : '#f8f5f0';
  const sidebarBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const headerBg = dark ? '#0B1020' : '#ffffff';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const mutedBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  return (
    <div className="min-h-screen flex font-sans" style={{ background: bgColor, color: textColor }}>
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside
        className="fixed inset-y-0 left-0 w-[240px] border-r flex flex-col justify-between p-6 z-30"
        style={{ background: sidebarBg, borderColor: borderCol }}
      >
        <div className="flex flex-col gap-8">
          <Logo size="sm" onClick={() => navigate('/explore')} />
          
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all no-underline ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 font-extrabold shadow-sm'
                      : 'hover:opacity-80'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#F5B301' : textSub,
                  background: isActive ? 'rgba(245,179,1,0.1)' : 'transparent',
                })}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Delivery Card Promo */}
        <div
          className="rounded-3xl p-5 border flex flex-col items-center text-center relative overflow-hidden mt-6"
          style={{
            background: dark ? 'rgba(245,179,1,0.08)' : '#fffbeb',
            borderColor: dark ? 'rgba(245,179,1,0.15)' : '#fde68a',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534080391025-09795d197a5b?w=100&q=80"
            alt="Delivery rider"
            className="w-14 h-14 rounded-full object-cover shadow-md mb-2"
          />
          <h4 className="font-extrabold text-[12px] leading-snug mb-1" style={{ color: textColor }}>
            Fast Delivery<br />At Your Doorstep
          </h4>
          <button
            onClick={() => navigate('/browse')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[11px] py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
          >
            Order Now
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 pl-[240px] flex flex-col min-h-screen">
        {/* ─── TOP HEADER BAR ─── */}
        <header
          className="sticky top-0 border-b h-[70px] flex items-center justify-between px-8 z-20"
          style={{ background: headerBg, borderColor: borderCol }}
        >
          {/* Location Selector */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-85">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: dark ? 'rgba(245,179,1,0.1)' : '#fffbeb', color: '#F5B301' }}
            >
              <MapPin size={16} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider leading-none" style={{ color: textMuted }}>Deliver To</div>
              <div className="text-[12px] font-extrabold flex items-center gap-1" style={{ color: textColor }}>
                Kigali , Rwanda <ChevronDown size={12} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="relative w-full max-w-md mx-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textMuted }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search restaurants, cuisines or dishes..."
              onClick={() => {
                if (location.pathname !== '/browse') navigate('/browse');
              }}
              className="w-full rounded-full py-2.5 pl-10 pr-4 outline-none text-[12px] transition-all font-medium"
              style={{
                background: mutedBg,
                border: `1px solid ${borderCol}`,
                color: textColor,
              }}
              onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = dark ? 'rgba(245,179,1,0.05)' : '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = borderCol; e.target.style.background = mutedBg; }}
            />
          </div>

          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Filters Shortcut */}
            <button
              onClick={() => navigate('/browse')}
              className="p-2.5 rounded-xl border cursor-pointer flex items-center justify-center transition-colors"
              style={{
                background: mutedBg,
                borderColor: borderCol,
                color: textSub,
              }}
              title="Filter Restaurants"
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => navigate('/checkout')}
              className="p-2.5 rounded-xl border cursor-pointer flex items-center justify-center relative transition-colors"
              style={{
                background: mutedBg,
                borderColor: borderCol,
                color: textSub,
              }}
            >
              <ShoppingCart size={16} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: sidebarBg }}
                >
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              className="p-2.5 rounded-xl border cursor-pointer flex items-center justify-center relative transition-colors"
              style={{
                background: mutedBg,
                borderColor: borderCol,
                color: textSub,
              }}
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2" style={{ borderColor: headerBg }} />
            </button>

            {/* Wallet Balance Widget */}
            <div 
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl cursor-pointer transition-colors"
              style={{
                background: dark ? 'rgba(16,185,129,0.1)' : '#ecfdf5',
                border: `1px solid ${dark ? 'rgba(16,185,129,0.2)' : '#a7f3d0'}`,
                color: dark ? '#34d399' : '#047857',
              }}
            >
              <Wallet size={15} />
              <span className="text-[11px] font-black">${walletBalance.toFixed(2)}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown((d) => !d)}
                className="flex items-center gap-2 cursor-pointer bg-transparent border-none py-1 pl-2 text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center bg-amber-500 text-black font-black text-[11px]" style={{ borderColor: borderCol }}>
                  {currentUser?.avatar?.url ? (
                    <img
                      src={currentUser.avatar.url}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (currentUser?.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[11px] font-extrabold" style={{ color: textColor }}>
                    {currentUser?.name || 'Guest'}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>
                    Customer
                  </div>
                </div>
                <ChevronDown size={12} style={{ color: textMuted }} />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-3 w-48 border rounded-3xl shadow-xl p-3 z-50"
                  style={{
                    background: sidebarBg,
                    borderColor: borderCol,
                  }}
                >
                  {[
                    { label: 'My Profile', path: '/profile' },
                    { label: 'My Orders', path: '/orders' },
                    { label: 'My Reservations', path: '/reservations' },
                  ].map(({ label, path }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate(path);
                      }}
                      className="w-full text-left bg-transparent border-none px-4 py-2.5 text-xs rounded-xl cursor-pointer font-bold transition-colors"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = mutedBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {label}
                    </button>
                  ))}
                  <hr className="my-1" style={{ borderColor: borderCol }} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left bg-transparent border-none px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold"
                  >
                    <LogOut size={13} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── ROUTE SUB-PAGE BODY ─── */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* ─── WALLET TOP UP MODAL ─── */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="rounded-[32px] p-8 max-w-sm w-full shadow-2xl border animate-in fade-in zoom-in duration-200"
            style={{ background: cardBg, borderColor: borderCol }}
          >
            <h3 className="font-extrabold text-lg mb-2" style={{ color: textColor }}>Top Up Wallet</h3>
            <p className="text-xs font-medium mb-6" style={{ color: textMuted }}>Add credits to your account for quick and seamless ordering.</p>
            
            <form onSubmit={handleTopUpSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: textSub }}>Amount to Add ($)</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none text-base font-extrabold transition-colors"
                  style={{
                    background: mutedBg,
                    borderColor: borderCol,
                    color: textColor,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = dark ? 'rgba(245,179,1,0.05)' : '#fff'; }}
                  onBlur={(e) => { e.target.style.borderColor = borderCol; e.target.style.background = mutedBg; }}
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 font-bold text-xs py-3 rounded-2xl border cursor-pointer transition-colors"
                  style={{
                    background: mutedBg,
                    borderColor: borderCol,
                    color: textSub,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-2xl font-black text-xs border-none cursor-pointer transition-colors shadow-sm"
                >
                  Top Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
