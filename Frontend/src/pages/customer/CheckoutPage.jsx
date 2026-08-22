import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Store,
  Percent,
  ShieldCheck,
  Clock,
  ChevronLeft,
  CreditCard,
  Wallet,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { customerService, authService } from '../../services/api';

const VALID_PROMOS = {
  WELCOME20: { discount: 0.20, label: '20% OFF First Order' },
  FREESHIP: { discount: 0, freeDelivery: true, label: 'Free Delivery' },
  SAVE10: { discount: 0.10, label: '10% OFF Entire Order' },
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartRestaurant,
    orderType,
    walletBalance,
    updateQuantity,
    removeFromCart,
    clearCart,
    setOrderType,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    refreshWallet,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // { type: string, discount: number, freeDelivery: bool }
  const [promoError, setPromoError] = useState('');
  const [paymentChoice, setPaymentChoice] = useState('wallet'); // 'wallet' | 'cash' | 'card'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = promoApplied?.freeDelivery ? 0 : getDeliveryFee();
  const tax = getTax();
  const discountAmount = promoApplied ? subtotal * (promoApplied.discount || 0) : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const promo = VALID_PROMOS[code];
    if (promo) {
      setPromoApplied(promo);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try WELCOME20, FREESHIP, or SAVE10.');
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoError('');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    // Must be logged in to place an order
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderError('');
    setIsPlacingOrder(true);
    try {
      const orderItems = cartItems.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await customerService.placeOrder({
        restaurant: cartRestaurant?._id,
        items: orderItems,
        orderType,
        paymentMethod: paymentChoice,
        promoCode: promoApplied ? promoCode : undefined,
      });

      // Refresh wallet balance from backend after order
      refreshWallet();
      clearCart();
      navigate('/orders');
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getItemImage = (item) => {
    return item.image?.url || 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80';
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <div className="text-center px-6 py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={36} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-xs text-gray-400 font-bold mb-8 max-w-xs mx-auto">
            Looks like you haven't added anything yet. Browse restaurants to find something delicious!
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-8 py-3.5 rounded-2xl border-none cursor-pointer transition-colors shadow-sm"
          >
            Browse Restaurants <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-500 transition-colors border-none bg-transparent cursor-pointer mb-6"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── LEFT: Cart Items ─── */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header with restaurant name */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                  Your Cart
                </h1>
                {cartRestaurant && (
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    Ordering from <span className="text-amber-500">{cartRestaurant.name}</span>
                  </p>
                )}
              </div>
              <button
                onClick={clearCart}
                className="text-[11px] font-black text-red-500 bg-transparent border-none cursor-pointer hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Delivery Type Toggle */}
            <div className="bg-white rounded-[20px] border border-gray-100 p-1.5 flex shadow-sm">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold border-none cursor-pointer transition-all ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Truck size={15} />
                Delivery
              </button>
              <button
                onClick={() => setOrderType('dine-in')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold border-none cursor-pointer transition-all ${
                  orderType === 'dine-in'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Store size={15} />
                Dine-in
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemPrice = item.discountedPrice || item.price;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-[20px] border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
                    >
                      {/* Image */}
                      <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-gray-800 truncate leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">
                          {item.description || 'Medium, Standard'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-amber-500 font-black text-sm">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold line-through hidden sm:inline">
                            {item.discountedPrice ? `$${(item.price * item.quantity).toFixed(2)}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-transparent border-none text-gray-400 hover:text-amber-500 hover:bg-amber-50 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-gray-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-transparent border-none text-gray-400 hover:text-amber-500 hover:bg-amber-50 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-8 h-8 rounded-xl bg-transparent border-none text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
              <h4 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider mb-4">
                Have a promo code?
              </h4>

              {promoApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Percent size={16} className="text-emerald-600" />
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800">{promoApplied.label}</p>
                      <p className="text-[9px] font-bold text-emerald-600">
                        {promoApplied.freeDelivery
                          ? 'Free delivery applied!'
                          : `Saving $${discountAmount.toFixed(2)} on this order`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-xs font-black text-red-500 bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Percent size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      placeholder="Enter promo code"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none font-bold text-gray-700 placeholder-gray-400 focus:bg-white focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!promoCode.trim()}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-6 py-2.5 rounded-2xl border-none cursor-pointer transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[10px] font-bold text-red-500 mt-2">{promoError}</p>
              )}
              <p className="text-[9px] text-gray-400 font-bold mt-3">
                Try: WELCOME20, FREESHIP, or SAVE10
              </p>
            </div>
          </div>

          {/* ─── RIGHT: Order Summary ─── */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm sticky top-[90px]">
              <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-6">
                Order Summary
              </h3>

              {/* Items Summary */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold">Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)</span>
                  <span className="text-gray-800 font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold">Delivery Fee</span>
                  <span className={`font-black ${deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {orderType === 'dine-in' && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span className="font-bold">Dine-in Credit</span>
                    <span className="font-black">-$0.00</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold">Estimated Tax (10%)</span>
                  <span className="text-gray-800 font-black">${tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span className="font-bold">Promo Discount</span>
                    <span className="font-black">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-gray-800">Total</span>
                  <span className="text-xl font-black text-amber-500">${total.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl px-4 py-3">
                  {orderError}
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Payment Method</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPaymentChoice('wallet')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      paymentChoice === 'wallet'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <Wallet size={16} className={paymentChoice === 'wallet' ? 'text-emerald-500' : 'text-gray-400'} />
                    <div className="flex-1 text-left">
                      <div>Wallet</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">
                        Balance: ${walletBalance.toFixed(2)} {walletBalance < total && <span className="text-red-400">(insufficient)</span>}
                      </div>
                    </div>
                    {paymentChoice === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </button>

                  <button
                    onClick={() => setPaymentChoice('card')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      paymentChoice === 'card'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <CreditCard size={16} className={paymentChoice === 'card' ? 'text-amber-500' : 'text-gray-400'} />
                    <div className="flex-1 text-left">
                      <div>Credit / Debit Card</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">Pay with saved card</div>
                    </div>
                    {paymentChoice === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </button>

                  <button
                    onClick={() => setPaymentChoice('cash')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      paymentChoice === 'cash'
                        ? 'border-gray-800 bg-gray-100 text-gray-800'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <Banknote size={16} className={paymentChoice === 'cash' ? 'text-gray-600' : 'text-gray-400'} />
                    <div className="flex-1 text-left">
                      <div>Cash on Delivery</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">Pay when you receive</div>
                    </div>
                    {paymentChoice === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />}
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-4 rounded-2xl border-none cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} /> Place Order
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-amber-500" /> Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-500" /> Fast Delivery
                </span>
              </div>

              {/* Trust Info */}
              <div className="mt-4 bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                <CreditCard size={16} className="text-gray-400" />
                <div className="text-[10px] font-bold text-gray-500">
                  Your payment is encrypted and secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
