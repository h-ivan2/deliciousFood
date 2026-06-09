import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Clock, MapPin, Loader2, Trash2, Utensils } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { favoriteService } from '../../services/api';


export default function FavoritesPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await favoriteService.getMyFavorites();
      setFavorites(list || []);
    } catch (err) {
      if (/401|auth/i.test(err.message)) {
        navigate('/login');
        return;
      }
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (restaurantId) => {
    setRemovingId(restaurantId);
    try {
      await favoriteService.removeFavorite(restaurantId);
      setFavorites((prev) => prev.filter((f) => f.restaurant._id !== restaurantId));
    } catch (err) {
      alert(err.message || 'Failed to remove favorite');
    } finally {
      setRemovingId(null);
    }
  };

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';

  return (
    <div className="px-6 lg:px-12 py-10 min-h-full" style={{ background: bg }}>
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display font-black text-3xl flex items-center gap-3" style={{ color: textColor }}>
          <Heart size={28} className="text-red-500 fill-red-500" /> My Favorites
        </h1>
        <p className="text-sm mt-2" style={{ color: textSub }}>Your saved restaurants, ready to order from in one tap.</p>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 size={36} className="animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border p-12 text-center" style={{ background: cardBg, borderColor: borderCol, color: textSub }}>
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-12 rounded-3xl border p-16 text-center flex flex-col items-center gap-4" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,179,1,0.12)' }}>
              <Heart size={28} className="text-amber-500" />
            </div>
            <h3 className="font-extrabold text-lg" style={{ color: textColor }}>No favorites yet</h3>
            <p className="text-sm max-w-sm" style={{ color: textSub }}>
              Tap the heart icon on any restaurant to save it here for quick access.
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="mt-2 px-6 py-3 rounded-full text-xs font-black border-none cursor-pointer bg-amber-500 text-black"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const r = fav.restaurant;
              const cover = r.coverImage?.url || r.logo?.url;
              const cuisines = Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine;
              return (
                <div
                  key={fav._id}
                  className="rounded-3xl border overflow-hidden flex flex-col shadow-sm transition-transform hover:-translate-y-1"
                  style={{ background: cardBg, borderColor: borderCol }}
                >
                  <div className="h-40 relative bg-gray-200">
                    {cover ? (
                      <img src={cover} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-500/10">
                        <Utensils size={32} className="text-amber-500" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(r._id)}
                      disabled={removingId === r._id}
                      title="Remove from favorites"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer backdrop-blur-md bg-black/50 text-white hover:bg-red-500"
                    >
                      {removingId === r._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-extrabold text-base truncate" style={{ color: textColor }}>{r.name}</h3>
                    {cuisines && <p className="text-xs truncate" style={{ color: textSub }}>{cuisines}</p>}
                    <div className="flex items-center gap-4 text-xs mt-1" style={{ color: textSub }}>
                      <span className="flex items-center gap-1">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold" style={{ color: textColor }}>{r.rating || '0.0'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {r.estimatedDeliveryTime || 30} min
                      </span>
                    </div>
                    {r.address?.city && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: textSub }}>
                        <MapPin size={13} /> {r.address.city}
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/restaurant/${r._id}/menu`)}
                      className="mt-3 w-full py-2.5 rounded-xl text-xs font-black border-none cursor-pointer bg-amber-500 text-black"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
