import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Truck, MapPin, X, Heart, Loader2, Utensils } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { customerService, favoriteService } from '../../services/api';

const CUISINE_OPTIONS = [
  'All', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian', 'French',
  'American', 'Healthy', 'Desserts', 'Mediterranean', 'Vietnamese',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 18 } },
};

/**
 * Browse Restaurants — fetches the live list of approved restaurants from the
 * backend, supports search/cuisine filtering, and lets customers favorite a
 * restaurant directly from the grid (persisted via /favorites).
 */
export default function BrowseRestaurants() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      customerService.getApprovedRestaurants(),
      favoriteService.getMyFavorites().catch(() => []),
    ])
      .then(([list, favs]) => {
        if (!active) return;
        setRestaurants(list || []);
        setFavoriteIds(new Set((favs || []).map((f) => f.restaurant._id)));
      })
      .catch((err) => active && setError(err.message || 'Failed to load restaurants'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    const isFav = favoriteIds.has(id);
    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      if (isFav) await favoriteService.removeFavorite(id);
      else await favoriteService.addFavorite(id);
    } catch {
      // revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const cuisines = (Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine || '').toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        cuisines.includes(search.toLowerCase());
      const matchCuisine = activeCuisine === 'All' || cuisines.includes(activeCuisine.toLowerCase());
      return matchSearch && matchCuisine;
    });
  }, [restaurants, search, activeCuisine]);

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const half = (rating || 0) - full >= 0.5;
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
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textMuted }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full sm:w-[260px] rounded-2xl py-2.5 pl-10 pr-10 outline-none text-xs font-medium transition-colors"
                style={{ background: mutedBg, border: `1px solid ${borderCol}`, color: textColor }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = dark ? 'rgba(245,179,1,0.05)' : '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = borderCol; e.target.style.background = mutedBg; }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: textMuted }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-colors"
              style={{ background: showFilters ? '#F5B301' : mutedBg, borderColor: showFilters ? '#F5B301' : borderCol, color: showFilters ? '#000' : textSub }}
            >
              <Filter size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* Cuisine Filter Chips */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <div className="flex flex-wrap gap-2.5 pt-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setActiveCuisine(cuisine)}
                  className="px-4 py-2 rounded-full text-[11px] font-bold border cursor-pointer transition-all"
                  style={{ background: activeCuisine === cuisine ? '#F5B301' : mutedBg, borderColor: activeCuisine === cuisine ? '#F5B301' : borderCol, color: activeCuisine === cuisine ? '#000' : textSub }}
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

        {/* Content states */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="font-extrabold text-sm mb-1" style={{ color: textSub }}>Couldn&apos;t load restaurants</h3>
            <p className="text-xs font-bold max-w-xs" style={{ color: textMuted }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: mutedBg }}>
              <Search size={24} style={{ color: textMuted }} />
            </div>
            <h3 className="font-extrabold text-sm mb-1" style={{ color: textSub }}>No restaurants found</h3>
            <p className="text-xs font-bold max-w-xs" style={{ color: textMuted }}>
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button onClick={() => { setSearch(''); setActiveCuisine('All'); }} className="mt-5 text-xs font-black text-amber-500 bg-transparent border-none cursor-pointer hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((r) => {
              const cover = r.coverImage?.url || r.logo?.url;
              const cuisines = Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine;
              const isFav = favoriteIds.has(r._id);
              return (
                <motion.div
                  key={r._id}
                  variants={cardVariants}
                  onClick={() => navigate(`/restaurant/${r._id}/menu`)}
                  className="rounded-[24px] border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group"
                  style={{ background: cardBg, borderColor: borderCol }}
                >
                  {/* Image */}
                  <div className="h-40 w-full relative overflow-hidden bg-gray-200">
                    {cover ? (
                      <img src={cover} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-500/10">
                        <Utensils size={28} className="text-amber-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <button
                      onClick={(e) => toggleFavorite(e, r._id)}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer backdrop-blur-md bg-black/40"
                    >
                      <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-white'} />
                    </button>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black text-amber-600 flex items-center gap-1 shadow-sm">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      {r.rating || '0.0'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-extrabold text-sm truncate leading-snug mb-0.5 group-hover:text-amber-500 transition-colors" style={{ color: textColor }}>
                        {r.name}
                      </h3>
                      <p className="text-[10px] font-bold truncate" style={{ color: textMuted }}>{cuisines}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: borderCol }}>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: textSub }}>
                        <Clock size={12} className="text-amber-500" />
                        {r.estimatedDeliveryTime || 30} min
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: textSub }}>
                        <Truck size={12} className="text-amber-500" />
                        ${Number(r.deliveryFee || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-2">{renderStars(r.rating)}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
