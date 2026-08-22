import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
  Truck,
  Store,
  ArrowRight,
  Receipt,
  Package,
  ShieldCheck,
} from 'lucide-react';

const PAYMENT_LABELS = {
  wallet: { label: 'Wallet', icon: Wallet, color: '#10b981' },
  card: { label: 'Credit / Debit Card', icon: CreditCard, color: '#F5B301' },
  cash: { label: 'Cash on Delivery', icon: Banknote, color: '#374151' },
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total, paymentMethod, orderType } = location.state || {};
  const [showReceipt, setShowReceipt] = useState(false);

  const payment = PAYMENT_LABELS[paymentMethod] || PAYMENT_LABELS.cash;
  const PaymentIcon = payment.icon;

  useEffect(() => {
    if (!orderId) {
      navigate('/explore');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Success Card */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-lg overflow-hidden">
          {/* Top Success Banner */}
          <div
            className="relative px-8 pt-10 pb-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 size={72} className="text-emerald-500 mx-auto" strokeWidth={1.5} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-black text-2xl text-gray-900 mt-4"
            >
              Order Placed Successfully!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-500 font-bold mt-2"
            >
              Your order has been received and is being prepared
            </motion.p>
          </div>

          {/* Order Details */}
          <div className="px-8 py-6">
            {/* Order ID */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-4 mb-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Receipt size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Number</p>
                  <p className="text-sm font-black text-gray-800">#{orderId.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
                <p className="text-lg font-black text-amber-500">${(total || 0).toFixed(2)}</p>
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-3 mb-6"
            >
              {/* Estimated Time */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Estimated Time</p>
                  <p className="text-xs font-extrabold text-blue-800">25–35 minutes</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 rounded-2xl">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${payment.color}15` }}
                >
                  <PaymentIcon size={16} style={{ color: payment.color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                  <p className="text-xs font-extrabold text-gray-800">{payment.label}</p>
                </div>
              </div>

              {/* Order Type */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  {orderType === 'dine-in' ? <Store size={16} className="text-amber-500" /> : <Truck size={16} className="text-amber-500" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Type</p>
                  <p className="text-xs font-extrabold text-gray-800 capitalize">{orderType === 'dine-in' ? 'Dine-in' : 'Delivery'}</p>
                </div>
              </div>
            </motion.div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 bg-emerald-50 rounded-2xl px-5 py-3 mb-6"
            >
              <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
              <p className="text-[10px] font-bold text-emerald-700">
                You'll receive real-time updates on your order status
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-4 rounded-2xl border-none cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Package size={16} />
                Track My Order
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/explore')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs py-3.5 rounded-2xl border border-gray-100 cursor-pointer transition-all"
              >
                Continue Browsing
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
