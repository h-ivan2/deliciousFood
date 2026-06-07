import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  Clock,
  Star,
  ChevronRight,
  TrendingUp,
  Percent,
  PhoneCall,
  Pizza,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { customerService } from '../../services/api';

const CUISINES = [
  { name: 'Pizza', count: '32 Restaurants', icon: Pizza, color: '#fef3c7', iconColor: '#d97706' },
  { name: 'Burgers', count: '24 Restaurants', icon: UtensilsCrossed, color: '#ecfdf5', iconColor: '#059669' },
  { name: 'Salads', count: '18 Restaurants', icon: UtensilsCrossed, color: '#edf2f7', iconColor: '#4a5568' },
  { name: 'Drinks', count: '12 Restaurants', icon: UtensilsCrossed, color: '#e0f2fe', iconColor: '#0284c7' },
  { name: 'Desserts', count: '10 Restaurants', icon: UtensilsCrossed, color: '#fce7f3', iconColor: '#db2777' },
];

export default function Explore() {
  const navigate = useNavigate();
  const { walletBalance, topUpWallet } = useCart();
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await customerService.getApprovedRestaurants();
        setPopularRestaurants(list.slice(0, 4));
        setFeaturedRestaurants(list.slice(4, 8).concat(list.slice(0, 2)));
        
        const orders = await customerService.getMyOrders();
        // Seed some mock recent orders if history is empty
        if (orders.length === 0) {
          setRecentOrders([
            { _id: 'ord_m1', restaurant: { name: 'The Green Bowl' }, createdAt: '2026-05-17T12:00:00.000Z', totalAmount: 24.99, status: 'delivered' },
            { _id: 'ord_m2', restaurant: { name: 'The Green Bowl' }, createdAt: '2026-05-17T10:15:00.000Z', totalAmount: 24.99, status: 'delivered' },
            { _id: 'ord_m3', restaurant: { name: 'The Green Bowl' }, createdAt: '2026-05-16T19:30:00.000Z', totalAmount: 24.99, status: 'delivered' },
            { _id: 'ord_m4', restaurant: { name: 'The Green Bowl' }, createdAt: '2026-05-15T13:45:00.000Z', totalAmount: 24.99, status: 'delivered' },
          ]);
        } else {
          setRecentOrders(orders.slice(0, 5));
        }
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

  return (
    <div className="flex px-8 py-6 gap-8 max-w-[1600px] mx-auto min-h-screen">
      {/* ─── LEFT BODY PANEL ─── */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Welcome Section */}
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-gray-900 leading-none">
            Good Morning , John 👋
          </h1>
          <p className="text-[12px] text-gray-400 font-bold mt-1">
            Discover delicious food from the best restaurant near you
          </p>
        </div>

        {/* Popular Restaurants Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">Popular Restaurants</h3>
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
                <div key={i} className="h-56 bg-gray-100 rounded-3xl animate-pulse" />
              ))
            ) : (
              popularRestaurants.map((rest) => (
                <div
                  key={rest._id}
                  onClick={() => navigate(`/browse`, { state: { selectedId: rest._id } })}
                  className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
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
                      <h4 className="font-extrabold text-xs text-gray-800 truncate mb-0.5">{rest.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold leading-relaxed truncate">{rest.cuisines}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 text-[10px] font-bold text-gray-500">
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

        {/* Promo Code Banner */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 p-8 flex items-center justify-between shadow-md border border-amber-300/35">
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

        {/* Top Cuisines Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">Top Cuisines</h3>
            <button
              onClick={() => navigate('/browse')}
              className="text-[11px] font-black text-amber-500 bg-transparent border-none cursor-pointer flex items-center hover:underline"
            >
              View All <ChevronRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {CUISINES.map((cuisine) => (
              <div
                key={cuisine.name}
                onClick={() => navigate('/browse', { state: { selectedCuisine: cuisine.name } })}
                className="bg-white rounded-[24px] border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: cuisine.color, color: cuisine.iconColor }}
                >
                  <cuisine.icon size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-800 leading-tight mb-0.5">{cuisine.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold leading-none">{cuisine.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Near You Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">Featured Near You</h3>
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
                <div key={i} className="h-56 bg-gray-100 rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredRestaurants.map((rest) => (
                <div
                  key={rest._id}
                  onClick={() => navigate(`/browse`, { state: { selectedId: rest._id } })}
                  className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
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
                      <h4 className="font-extrabold text-xs text-gray-800 truncate mb-0.5">{rest.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold leading-relaxed truncate">{rest.cuisines}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 text-[10px] font-bold text-gray-500">
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
        {/* Your Location Box */}
        <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
          <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider mb-3">Your Location</h4>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <MapPin size={16} />
            </div>
            <div className="text-left truncate">
              <div className="text-[11px] font-black text-gray-800">Kigali , Rwanda</div>
              <div className="text-[9px] text-gray-400 font-bold">Current Delivery Address</div>
            </div>
          </div>
        </div>

        {/* Wallet Balance Box */}
        <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
          <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider mb-3">Wallet Balance</h4>
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <div className="text-[14px] font-black text-emerald-800">${walletBalance.toFixed(2)}</div>
                <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Available Credits</div>
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

        {/* Recent Orders Box */}
        <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Recent Orders</h4>
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
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs">
                    🥗
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[11px] text-gray-800 truncate leading-snug">{ord.restaurant?.name || 'Restaurant'}</h5>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">{formatDate(ord.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black text-gray-800">${ord.totalAmount?.toFixed(2)}</div>
                  <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-100/30">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help Box */}
        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
            <PhoneCall size={20} />
          </div>
          <h4 className="font-extrabold text-xs text-gray-800 mb-1">Need Help?</h4>
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed mb-4">
            Our support team is here to help with any restaurant, order, or booking issue.
          </p>
          <a
            href="tel:+1555123456"
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 font-bold text-[11px] py-3 rounded-2xl cursor-pointer text-center no-underline transition-colors block"
          >
            Call for Support
          </a>
        </div>
      </div>
    </div>
  );
}
