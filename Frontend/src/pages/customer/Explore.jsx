import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  Clock,
  Star,
  ChevronRight,
  TrendingUp,
  PhoneCall,
  Pizza,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { customerService, authService } from '../../services/api';

const CUISINES = [
  { name: 'Pizza', count: '32 Restaurants', icon: Pizza },
  { name: 'Burgers', count: '24 Restaurants', icon: UtensilsCrossed },
  { name: 'Salads', count: '18 Restaurants', icon: UtensilsCrossed },
  { name: 'Drinks', count: '12 Restaurants', icon: UtensilsCrossed },
  { name: 'Desserts', count: '10 Restaurants', icon: UtensilsCrossed },
];

const CUISINE_COLORS = ['#fef3c7', '#ecfdf5', '#edf2f7', '#e0f2fe', '#fce7f3'];
const CUISINE_ICON_COLORS = ['#d97706', '#059669', '#4a5568', '#0284c7', '#db2777'];

export default function Explore() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { walletBalance, topUpWallet } = useCart();
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();
  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    async function loadData() {
      try {
        const list = await customerService.getApprovedRestaurants();
        setPopularRestaurants(list.slice(0, 4));
        setFeaturedRestaurants(list.slice(4, 8).concat(list.slice(0, 2)));

        const orders = await customerService.getMyOrders();
        setRecentOrders((orders || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ── Theme tokens ──────────────────────────────
  const bgColor = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const mutedBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  return (
    <div className="min-h-screen" style={{ background: bgColor }}>
      <div className="max-w-[1600px] mx-auto px-6 py-6 lg:px-10 lg:py-8">
        {/* ─── HERO WELCOME ─── */}
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl lg:text-3xl leading-none" style={{ color: textColor }}>
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-[12px] font-bold mt-1" style={{ color: textMuted }}>
            Discover delicious food from the best restaurants near you
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── LEFT BODY PANEL ─── */}
          <div className="flex-1 flex flex-col gap-8">

            {/* ── Popular Restaurants ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: textColor }}>
                  Popular Restaurants
                </h3>
                <button
                  onClick={() => navigate('/browse')}
                  className="text-[11px] font-black text-amber-500 bg-transparent border-none cursor-pointer flex items-center hover:underline"
                >
                  View All <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="h-56 rounded-3xl animate-pulse"
                      style={{ background: mutedBg }} />
                  ))
                ) : (
                  popularRestaurants.map((rest) => (
                    <div
                      key={rest._id}
                      onClick={() => navigate(`/browse`, { state: { selectedId: rest._id } })}
                      className="rounded-[24px] border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                      style={{ background: cardBg, borderColor: borderCol }}
                    >
                      <div className="h-32 w-full relative">
                        <img
                          src={rest.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'}
                          alt={rest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-black text-amber-400 flex items-center gap-0.5">
                          ★ {rest.rating}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="font-extrabold text-xs truncate mb-0.5" style={{ color: textColor }}>
                            {rest.name}
                          </h4>
                          <p className="text-[10px] font-bold leading-relaxed truncate" style={{ color: textMuted }}>
                            {rest.cuisines}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t text-[10px] font-bold"
                          style={{ borderColor: borderCol, color: textSub }}>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-amber-500" /> {rest.deliveryTime || '30-40 min'}
                          </span>
                          <span className="text-amber-500 font-black">
                            ${rest.deliveryFee?.toFixed(2)} Delivery
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── Promo Banner ── */}
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 p-8 flex items-center justify-between shadow-md border"
              style={{ borderColor: 'rgba(245,179,1,0.35)' }}>
              <div className="relative z-10 max-w-md">
                <span className="bg-black/10 text-black font-extrabold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full">
                  Special Offer
                </span>
                <h2 className="text-black text-xl lg:text-3xl font-black mt-4 leading-tight">
                  Get 20% OFF on your first Order!
                </h2>
                <p className="text-black/75 text-[11px] font-bold mt-2 mb-6">
                  Order from top restaurants in your area and enjoy premium lightning-fast delivery.
                </p>
                <button
                  onClick={() => navigate('/browse')}
                  className="bg-black hover:bg-neutral-900 text-white font-extrabold text-xs px-6 py-3 rounded-2xl border-none cursor-pointer transition-colors shadow-lg"
                >
                  Order Now
                </button>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-[40%] hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80"
                  alt="Promo food"
                  className="w-full h-full object-cover transform scale-110 translate-x-4 translate-y-4 rounded-l-[32px]"
                />
              </div>
            </div>

            {/* ── Top Cuisines ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: textColor }}>
                  Top Cuisines
                </h3>
                <button
                  onClick={() => navigate('/browse')}
                  className="text-[11px] font-black text-amber-500 bg-transparent border-none cursor-pointer flex items-center hover:underline"
                >
                  View All <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {CUISINES.map((cuisine, i) => (
                  <div
                    key={cuisine.name}
                    onClick={() => navigate('/browse', { state: { selectedCuisine: cuisine.name } })}
                    className="rounded-[24px] border p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{ background: cardBg, borderColor: borderCol }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: CUISINE_COLORS[i], color: CUISINE_ICON_COLORS[i] }}
                    >
                      <cuisine.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs leading-tight mb-0.5" style={{ color: textColor }}>
                        {cuisine.name}
                      </h4>
                      <p className="text-[10px] font-bold leading-none" style={{ color: textMuted }}>
                        {cuisine.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Featured Near You ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: textColor }}>
                  Featured Near You
                </h3>
                <button
                  onClick={() => navigate('/browse')}
                  className="text-[11px] font-black text-amber-500 bg-transparent border-none cursor-pointer flex items-center hover:underline"
                >
                  View All <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="h-56 rounded-3xl animate-pulse"
                      style={{ background: mutedBg }} />
                  ))
                ) : (
                  featuredRestaurants.map((rest) => (
                    <div
                      key={rest._id}
                      onClick={() => navigate(`/browse`, { state: { selectedId: rest._id } })}
                      className="rounded-[24px] border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                      style={{ background: cardBg, borderColor: borderCol }}
                    >
                      <div className="h-32 w-full relative">
                        <img
                          src={rest.coverImage || 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&q=80'}
                          alt={rest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-black text-amber-400 flex items-center gap-0.5">
                          ★ {rest.rating}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="font-extrabold text-xs truncate mb-0.5" style={{ color: textColor }}>
                            {rest.name}
                          </h4>
                          <p className="text-[10px] font-bold leading-relaxed truncate" style={{ color: textMuted }}>
                            {rest.cuisines}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t text-[10px] font-bold"
                          style={{ borderColor: borderCol, color: textSub }}>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-amber-500" /> {rest.deliveryTime || '20-30 min'}
                          </span>
                          <span className="text-amber-500 font-black">
                            ${rest.deliveryFee?.toFixed(2)} Delivery
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT SIDE PANEL ─── */}
          <div className="w-[320px] flex flex-col gap-6 flex-shrink-0 lg:block hidden">

            {/* ── Location Box ── */}
            <div className="rounded-[28px] border p-5 shadow-sm"
              style={{ background: cardBg, borderColor: borderCol }}>
              <h4 className="font-extrabold text-xs uppercase tracking-wider mb-3" style={{ color: textColor }}>
                Your Location
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-2xl border"
                style={{ background: mutedBg, borderColor: borderCol }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(245,179,1,0.1)', color: '#F5B301' }}>
                  <MapPin size={16} />
                </div>
                <div className="text-left truncate">
                  <div className="text-[11px] font-black leading-tight" style={{ color: textColor }}>Kigali, Rwanda</div>
                  <div className="text-[9px] font-bold" style={{ color: textMuted }}>Current Delivery Address</div>
                </div>
              </div>
            </div>

            {/* ── Wallet Balance ── */}
            <div className="rounded-[28px] border p-5 shadow-sm"
              style={{ background: cardBg, borderColor: borderCol }}>
              <h4 className="font-extrabold text-xs uppercase tracking-wider mb-3" style={{ color: textColor }}>
                Wallet Balance
              </h4>
              <div className="flex items-center justify-between p-3.5 rounded-2xl border"
                style={{
                  background: dark ? 'rgba(16,185,129,0.08)' : '#ecfdf5',
                  borderColor: dark ? 'rgba(16,185,129,0.15)' : '#a7f3d0',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: dark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.1)', color: dark ? '#34d399' : '#059669' }}>
                    <Wallet size={18} />
                  </div>
                  <div>
                    <div className="text-[14px] font-black" style={{ color: dark ? '#34d399' : '#065f46' }}>
                      ${walletBalance.toFixed(2)}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: dark ? 'rgba(52,211,153,0.7)' : '#047857' }}>
                      Available Credits
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const amount = window.prompt("Enter amount to add:", "20.00");
                    if (amount && Number(amount) > 0) topUpWallet(Number(amount));
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
                >
                  Top Up
                </button>
              </div>
            </div>

            {/* ── Recent Orders ── */}
            <div className="rounded-[28px] border p-5 shadow-sm"
              style={{ background: cardBg, borderColor: borderCol }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider" style={{ color: textColor }}>
                  Recent Orders
                </h4>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-[10px] font-black text-amber-500 bg-transparent border-none cursor-pointer hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {recentOrders.map((ord) => (
                  <div
                    key={ord._id}
                    onClick={() => navigate(`/orders`, { state: { selectedOrderId: ord._id } })}
                    className="flex items-center justify-between p-3 rounded-2xl border border-transparent cursor-pointer transition-all"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = mutedBg; e.currentTarget.style.borderColor = borderCol; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs"
                        style={{ background: mutedBg }}>
                        🥗
                      </div>
                      <div>
                        <h5 className="font-extrabold text-[11px] leading-snug truncate" style={{ color: textColor }}>
                          {ord.restaurant?.name || 'Restaurant'}
                        </h5>
                        <p className="text-[9px] font-bold mt-0.5" style={{ color: textMuted }}>
                          {formatDate(ord.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] font-black" style={{ color: textColor }}>
                        ${ord.totalAmount?.toFixed(2)}
                      </div>
                      <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-100/30">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Need Help ── */}
            <div className="rounded-[28px] border p-6 shadow-sm flex flex-col items-center text-center"
              style={{ background: cardBg, borderColor: borderCol }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'rgba(245,179,1,0.1)', color: '#F5B301' }}>
                <PhoneCall size={20} />
              </div>
              <h4 className="font-extrabold text-xs mb-1" style={{ color: textColor }}>Need Help?</h4>
              <p className="text-[10px] font-bold leading-relaxed mb-4" style={{ color: textMuted }}>
                Our support team is here to help with any restaurant, order, or booking issue.
              </p>
              <a
                href="tel:+155****3456"
                className="w-full py-3 rounded-2xl text-[11px] font-bold text-center no-underline transition-colors block cursor-pointer border"
                style={{
                  background: mutedBg,
                  borderColor: borderCol,
                  color: textSub,
                }}
              >
                Call for Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
