import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Star,
  Plus,
  Minus,
  Trash2,
  Percent,
  Clock,
  MapPin,
  UtensilsCrossed,
  Heart,
  ShoppingCart,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { customerService } from '../../services/api';

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    cartItems,
    cartRestaurant,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal
  } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('df_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('df_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(f => f !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
    }
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  useEffect(() => {
    async function loadRestaurantData() {
      setLoading(true);
      try {
        const restDetails = await customerService.getRestaurantDetails(id);
        setRestaurant(restDetails);

        const cats = await customerService.getMenuCategories(id);
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCat(cats[0]);
        }

        const items = await customerService.getMenuItems(id);
        setMenuItems(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurantData();
  }, [id]);

  const handleCategoryClick = async (cat) => {
    setSelectedCat(cat);
    try {
      const items = await customerService.getMenuItems(id, cat._id);
      setMenuItems(items);
    } catch (err) {
      console.error(err);
    }
  };

  const getItemQuantityInCart = (itemId) => {
    const found = cartItems.find((i) => i._id === itemId);
    return found ? found.quantity : 0;
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'welcome20') {
      setPromoApplied(true);
      setPromoDiscount(6.40); // seed mock discount
    } else if (promoCode.trim()) {
      alert("Invalid code. Try 'WELCOME20' for a demo discount!");
    }
  };

  if (loading && !restaurant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent animate-spin rounded-full" />
        <p className="text-xs text-gray-400 font-bold">Loading Menu...</p>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const discountAmount = promoApplied ? promoDiscount : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

  return (
    <div className="flex h-[calc(100vh-70px)] overflow-hidden">
      {/* ─── CENTER MENU SELECTION COLUMN ─── */}
      <div className="flex-1 bg-white p-8 overflow-y-auto flex flex-col gap-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-500 transition-colors border-none bg-transparent self-start cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Restaurant
        </button>

        {/* Restaurant Profile Header info */}
        {restaurant && (
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border border-gray-100 overflow-hidden shadow-sm flex-shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-xl leading-snug text-gray-800">{restaurant.name}</h1>
              <p className="text-[11px] text-gray-400 font-bold mt-0.5">{restaurant.cuisines}</p>
              
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold mt-2">
                <span className="flex items-center gap-0.5 text-amber-500">
                  ★ <b className="text-gray-700">{restaurant.rating}</b> ({restaurant.reviews || 230})
                </span>
                <span>•</span>
                <span>{restaurant.deliveryTime || '30-40 min'}</span>
                <span>•</span>
                <span>${restaurant.deliveryFee?.toFixed(2)} Delivery</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/restaurant/${id}/reserve`)}
              className="ml-auto bg-transparent hover:bg-amber-500/5 text-amber-500 font-bold text-xs border border-amber-500/30 px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CalendarCheck size={14} /> Reserve a Table
            </button>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin mt-2">
          {categories.map((cat) => {
            const isSelected = selectedCat?._id === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat)}
                className={`rounded-full px-5 py-2.5 font-bold text-xs cursor-pointer border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-500 font-black'
                    : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>🍔</span> {cat.name}
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <div>
          <h2 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-6 text-left">
            {selectedCat?.name || 'Menu items'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => {
              const qty = getItemQuantityInCart(item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-[24px] border border-gray-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition-all duration-300 relative text-left"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={item.image?.url || 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-800 leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-bold mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-amber-500 font-black text-xs">${item.price.toFixed(2)}</span>
                      
                      {qty > 0 ? (
                        <div className="flex items-center border border-amber-500/35 rounded-xl bg-amber-50/20 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, qty - 1)}
                            className="w-6 h-6 rounded-lg bg-transparent border-none text-amber-500 hover:bg-amber-100 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-gray-800">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item._id, qty + 1)}
                            className="w-6 h-6 rounded-lg bg-transparent border-none text-amber-500 hover:bg-amber-100 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item, restaurant)}
                          className="bg-transparent hover:bg-amber-500/5 border border-amber-500/30 text-amber-500 font-bold text-[10px] px-4 py-2 rounded-xl cursor-pointer transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Favorite Heart Icon Overlay */}
                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm p-1.5 rounded-full border border-gray-50 shadow-sm cursor-pointer transition-all text-gray-400 hover:text-red-500"
                  >
                    <Heart size={12} fill={isFavorite(item._id) ? "#ef4444" : "none"} className={isFavorite(item._id) ? "text-red-500" : ""} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── RIGHT CART SLIDE PANEL ─── */}
      <div className="w-[340px] border-l border-gray-100 bg-white flex flex-col justify-between p-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart size={15} className="text-amber-500" /> Your Cart ({cartItems.length})
            </h3>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] font-black text-red-500 bg-transparent border-none cursor-pointer hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart items list */}
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={32} className="text-gray-200 mb-2 mx-auto" />
                <p className="text-xs text-gray-400 font-bold">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 py-2 border-b border-gray-50 last:border-none text-left">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={item.image?.url || 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-[11px] text-gray-800 truncate leading-snug">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-300 hover:text-red-500 bg-transparent border-none cursor-pointer p-0"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5">Medium, Extra Cheese</p>
                    
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-amber-500 font-black text-[11px]">${(item.price * item.quantity).toFixed(2)}</span>
                      
                      {/* Stepper */}
                      <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-4 h-4 rounded bg-transparent border-none text-gray-400 hover:text-amber-500 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-[10px] font-black text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-4 h-4 rounded bg-transparent border-none text-gray-400 hover:text-amber-500 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Promo code form */}
          {cartItems.length > 0 && (
            <form onSubmit={applyPromo} className="border-t border-gray-50 pt-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] outline-none font-bold text-gray-700 placeholder-gray-400 focus:bg-white focus:border-amber-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] px-4 py-2 rounded-xl border-none cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-[9px] text-emerald-600 font-bold mt-2 text-left">
                  ✓ WELCOME20 applied! Saving $6.40 on this order.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Totals Summary & Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 pt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2.5 text-[11px] font-bold text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-700">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-700">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (10%)</span>
                <span className="text-gray-700">${tax.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo Code Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px] font-black text-gray-800 border-t border-gray-50 pt-3 mt-1">
                <span>Total</span>
                <span className="text-amber-500">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-3.5 rounded-2xl border-none cursor-pointer transition-colors shadow-sm text-center"
            >
              View Cart & Checkout
            </button>

            {/* Bottom trust icons */}
            <div className="flex justify-between items-center border-t border-gray-50 pt-4 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-amber-500" /> Secure Checkout</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-amber-500" /> On-time Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
