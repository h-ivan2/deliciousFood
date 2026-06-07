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
import { authService } from '../../services/api';
import { Logo, ThemeToggle } from '../ui';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, walletBalance, topUpWallet } = useCart();
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('20.00');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      // Create a default customer session if no token exists for the demo
      const demoUser = { _id: 'cust_demo', name: 'John Doe', email: 'john@delicious.com', role: 'customer' };
      localStorage.setItem('df_user', JSON.stringify(demoUser));
      localStorage.setItem('df_token', 'mock_jwt_customer_token');
      setCurrentUser(demoUser);
    } else {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    if (Number(topUpAmount) > 0) {
      topUpWallet(Number(topUpAmount));
      setShowTopUp(false);
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

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans text-gray-900">
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="fixed inset-y-0 left-0 w-[240px] bg-white border-r border-gray-100 flex flex-col justify-between p-6 z-30">
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
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Delivery Card Promo */}
        <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-100 flex flex-col items-center text-center relative overflow-hidden mt-6">
          <img
            src="https://images.unsplash.com/photo-1534080391025-09795d197a5b?w=100&q=80"
            alt="Delivery rider"
            className="w-14 h-14 rounded-full object-cover shadow-md mb-2"
          />
          <h4 className="font-extrabold text-[12px] leading-snug mb-1 text-gray-800">
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
        <header className="sticky top-0 bg-white border-b border-gray-100 h-[70px] flex items-center justify-between px-8 z-20">
          {/* Location Selector */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-85">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <MapPin size={16} />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Deliver To</div>
              <div className="text-[12px] font-extrabold flex items-center gap-1 text-gray-800">
                Kigali , Rwanda <ChevronDown size={12} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="relative w-full max-w-md mx-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search restaurants, cuisines or dishes..."
              onClick={() => {
                if (location.pathname !== '/browse') navigate('/browse');
              }}
              className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-10 pr-4 outline-none text-[12px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-amber-500 transition-all font-medium"
            />
          </div>

          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-4">
            {/* Filters Shortcut */}
            <button
              onClick={() => navigate('/browse')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 border border-gray-100 cursor-pointer flex items-center justify-center transition-colors"
              title="Filter Restaurants"
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => navigate('/checkout')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 border border-gray-100 cursor-pointer flex items-center justify-center relative transition-colors"
            >
              <ShoppingCart size={16} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 border border-gray-100 cursor-pointer flex items-center justify-center relative transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            {/* Wallet Balance Widget */}
            <div 
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl cursor-pointer transition-colors text-emerald-700"
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
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[11px] font-extrabold text-gray-800">
                    {currentUser?.name || 'John Doe'}
                  </div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    Customer
                  </div>
                </div>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-3xl shadow-xl p-3 z-50">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left bg-transparent border-none px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer font-bold"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('/orders');
                    }}
                    className="w-full text-left bg-transparent border-none px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer font-bold"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('/reservations');
                    }}
                    className="w-full text-left bg-transparent border-none px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer font-bold"
                  >
                    My Reservations
                  </button>
                  <hr className="my-1 border-gray-100" />
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
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="font-extrabold text-lg mb-2 text-gray-800">Top Up Wallet</h3>
            <p className="text-xs text-gray-400 font-medium mb-6">Add credits to your account for quick and seamless ordering.</p>
            
            <form onSubmit={handleTopUpSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Amount to Add ($)</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full border border-gray-100 rounded-2xl px-4 py-3 outline-none text-base font-extrabold bg-gray-50 focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-colors"
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
