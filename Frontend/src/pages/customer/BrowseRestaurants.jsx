import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Truck, MapPin, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RESTAURANTS = [
  { id: 1, name: 'The Green Bowl', cuisine: 'Healthy, Salads', rating: 4.8, time: '30-40 min', fee: 2.99, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
  { id: 2, name: 'Pizza Point', cuisine: 'Italian, Pizza', rating: 4.7, time: '20-30 min', fee: 1.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { id: 3, name: 'Burger House', cuisine: 'Burgers, American', rating: 4.5, time: '10-20 min', fee: 1.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 4, name: 'Sakura Sushi', cuisine: 'Japanese, Sushi', rating: 4.9, time: '25-35 min', fee: 3.49, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
  { id: 5, name: 'Taco Fiesta', cuisine: 'Mexican, Tacos', rating: 4.6, time: '15-25 min', fee: 2.49, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 6, name: 'Golden Dragon', cuisine: 'Chinese, Dim Sum', rating: 4.7, time: '30-45 min', fee: 2.99, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80' },
  { id: 7, name: 'Le Petit Bistro', cuisine: 'French, Pastries', rating: 4.8, time: '20-30 min', fee: 3.99, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80' },
  { id: 8, name: 'Spice Route', cuisine: 'Indian, Curry', rating: 4.6, time: '25-40 min', fee: 2.49, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { id: 9, name: 'Mediterranean Grill', cuisine: 'Greek, Mediterranean', rating: 4.5, time: '20-35 min', fee: 2.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { id: 10, name: 'Noodle House', cuisine: 'Vietnamese, Pho', rating: 4.4, time: '15-25 min', fee: 1.99, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80' },
  { id: 11, name: 'Steakhouse Prime', cuisine: 'Steak, Grill', rating: 4.9, time: '35-50 min', fee: 4.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { id: 12, name: 'Sweet Tooth', cuisine: 'Desserts, Ice Cream', rating: 4.3, time: '10-20 min', fee: 1.49, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
];

const CUISINE_OPTIONS = [
  'All', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian', 'French',
  'American', 'Healthy', 'Desserts', 'Mediterranean', 'Vietnamese',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 160, damping: 18 },
  },
};

export default function BrowseRestaurants() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase());
      const matchCuisine =
        activeCuisine === 'All' ||
        r.cuisine.toLowerCase().includes(activeCuisine.toLowerCase());
      return matchSearch && matchCuisine;
    });
  }, [search, activeCuisine]);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < full
                ? 'text-amber-500 fill-amber-500'
                : i === full && half
                  ? 'text-amber-500 fill-amber-500/50'
                  : 'text-gray-200 fill-gray-200'
            }
          />
        ))}
      </span>
    );
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
      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black leading-tight" style={{ color: textColor }}>
              Browse Restaurants
            </h1>
            <p className="text-xs font-bold mt-1" style={{ color: textMuted }}>
              Discover the best food near you
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-initial">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: textMuted }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full sm:w-[260px] rounded-2xl py-2.5 pl-10 pr-10 outline-none text-xs font-medium transition-colors"
                style={{
                  background: mutedBg,
                  border: `1px solid ${borderCol}`,
                  color: textColor,
                }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = dark ? 'rgba(245,179,1,0.05)' : '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = borderCol; e.target.style.background = mutedBg; }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  style={{ color: textMuted }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-colors"
              style={{
                background: showFilters ? '#F5B301' : mutedBg,
                borderColor: showFilters ? '#F5B301' : borderCol,
                color: showFilters ? '#000' : textSub,
              }}
            >
              <Filter size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* Cuisine Filter Chips */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2.5 pt-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setActiveCuisine(cuisine)}
                  className="px-4 py-2 rounded-full text-[11px] font-bold border cursor-pointer transition-all"
                  style={{
                    background: activeCuisine === cuisine ? '#F5B301' : mutedBg,
                    borderColor: activeCuisine === cuisine ? '#F5B301' : borderCol,
                    color: activeCuisine === cuisine ? '#000' : textSub,
                  }}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold" style={{ color: textMuted }}>
            {filtered.length} {filtered.length === 1 ? 'restaurant' : 'restaurants'} found
          </p>
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: textSub }}>
            <MapPin size={13} className="text-amber-500" />
            Delivering to Kigali, Rwanda
          </div>
        </div>

        {/* Restaurant Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: mutedBg }}>
              <Search size={24} style={{ color: textMuted }} />
            </div>
            <h3 className="font-extrabold text-sm mb-1" style={{ color: textSub }}>
              No restaurants found
            </h3>
            <p className="text-xs font-bold max-w-xs" style={{ color: textMuted }}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCuisine('All'); }}
              className="mt-5 text-xs font-black text-amber-500 bg-transparent border-none cursor-pointer hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                variants={cardVariants}
                onClick={() => navigate(`/restaurant/${r.id}/menu`)}
                className="rounded-[24px] border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group"
                style={{ background: cardBg, borderColor: borderCol }}
              >
                {/* Image */}
                <div className="h-40 w-full relative overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black text-amber-600 flex items-center gap-1 shadow-sm">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    {r.rating}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-extrabold text-sm truncate leading-snug mb-0.5 group-hover:text-amber-500 transition-colors"
                      style={{ color: textColor }}>
                      {r.name}
                    </h3>
                    <p className="text-[10px] font-bold truncate" style={{ color: textMuted }}>
                      {r.cuisine}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t"
                    style={{ borderColor: borderCol }}>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"
                      style={{ color: textSub }}>
                      <Clock size={12} className="text-amber-500" />
                      {r.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"
                      style={{ color: textSub }}>
                      <Truck size={12} className="text-amber-500" />
                      ${r.fee.toFixed(2)}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="mt-2">{renderStars(r.rating)}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
