import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Loader2,
  Zap,
  TrendingUp,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const PRESET_AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function WalletTopUp() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { walletBalance, topUpWallet, refreshWallet } = useCart();

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    refreshWallet();
  }, []);

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const textMain = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : '#9ca3af';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const mutedBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';

  const getAmount = () => {
    if (selectedAmount) return selectedAmount;
    const val = parseFloat(customAmount);
    return isNaN(val) ? 0 : val;
  };

  const handleTopUp = async () => {
    const amount = getAmount();
    if (amount <= 0) {
      setError('Please select or enter an amount');
      return;
    }
    if (amount > 500) {
      setError('Maximum top-up amount is $500');
      return;
    }
    if (amount < 5) {
      setError('Minimum top-up amount is $5');
      return;
    }

    setError('');
    setLoading(true);
    try {
      setFinalAmount(amount);
      await topUpWallet(amount);
      setSuccess(true);
      refreshWallet();
    } catch (err) {
      setError(err.message || 'Top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    setSelectedAmount(null);
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 size={80} className="text-emerald-500 mx-auto" strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-black mt-6 mb-2"
            style={{ color: textMain }}
          >
            Wallet Topped Up!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm mb-2"
            style={{ color: textSub }}
          >
            ${finalAmount.toFixed(2)} has been added to your wallet
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg font-black text-emerald-500 mb-8"
          >
            New balance: ${(walletBalance + finalAmount).toFixed(2)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => navigate('/explore')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-sm py-4 rounded-2xl border-none cursor-pointer transition-all shadow-sm"
            >
              Start Ordering
            </button>
            <button
              onClick={() => { setSuccess(false); setSelectedAmount(null); setCustomAmount(''); }}
              className="w-full font-bold text-sm py-3 rounded-2xl border cursor-pointer transition-all"
              style={{ background: mutedBg, borderColor: borderCol, color: textSub }}
            >
              Top Up More
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: bg }}>
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold transition-colors border-none bg-transparent cursor-pointer mb-6 hover:opacity-70"
          style={{ color: textMuted }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <Wallet size={24} className="text-emerald-500" />
          </div>
          <h1 className="font-black text-2xl mb-1" style={{ color: textMain }}>
            Top Up Wallet
          </h1>
          <p className="text-sm" style={{ color: textSub }}>
            Add credits for fast, seamless ordering
          </p>
        </div>

        {/* Current Balance Card */}
        <div
          className="rounded-[24px] p-6 mb-6 border"
          style={{
            background: dark ? 'rgba(16,185,129,0.08)' : 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            borderColor: dark ? 'rgba(16,185,129,0.15)' : '#a7f3d0',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: textMuted }}>
            Current Balance
          </p>
          <p className="text-3xl font-black text-emerald-500">
            ${walletBalance.toFixed(2)}
          </p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4" style={{ color: textSub }}>
            Select Amount
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`rounded-2xl py-4 border text-center cursor-pointer transition-all font-black text-sm ${
                  selectedAmount === amount ? 'shadow-md' : ''
                }`}
                style={{
                  background: selectedAmount === amount
                    ? 'rgba(245,179,1,0.12)'
                    : mutedBg,
                  borderColor: selectedAmount === amount ? '#F5B301' : borderCol,
                  color: selectedAmount === amount ? '#F5B301' : textMain,
                }}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: textSub }}>
            Or Enter Custom Amount
          </h3>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black" style={{ color: textMuted }}>
              $
            </span>
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="0.00"
              min="5"
              max="500"
              className="w-full rounded-2xl pl-10 pr-4 py-4 outline-none text-lg font-black transition-all border"
              style={{
                background: mutedBg,
                borderColor: customAmount ? '#F5B301' : borderCol,
                color: textMain,
              }}
              onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = dark ? 'rgba(245,179,1,0.05)' : '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = customAmount ? '#F5B301' : borderCol; e.target.style.background = mutedBg; }}
            />
          </div>
          <p className="text-[10px] font-bold mt-2" style={{ color: textMuted }}>
            Min $5 · Max $500
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 rounded-2xl px-5 py-3 text-xs font-bold text-red-500">
            {error}
          </div>
        )}

        {/* Top Up Button */}
        <button
          onClick={handleTopUp}
          disabled={loading || getAmount() <= 0}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-sm py-4 rounded-2xl border-none cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mb-6"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus size={18} />
              Top Up {getAmount() > 0 ? `$${getAmount().toFixed(2)}` : ''}
            </>
          )}
        </button>

        {/* Benefits */}
        <div className="rounded-[24px] border p-5" style={{ background: cardBg, borderColor: borderCol }}>
          <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4" style={{ color: textSub }}>
            Why Use Wallet?
          </h4>
          <div className="flex flex-col gap-4">
            {[
              { icon: Zap, title: 'Instant Payments', desc: 'Skip entering card details every time', color: '#F5B301' },
              { icon: ShieldCheck, title: 'Secure & Encrypted', desc: 'Your funds are protected', color: '#10b981' },
              { icon: Gift, title: 'Exclusive Top-Up Bonuses', desc: 'Coming soon — earn rewards on top-ups', color: '#8b5cf6' },
              { icon: TrendingUp, title: 'Track Spending', desc: 'View your order history and balance', color: '#3b82f6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-extrabold" style={{ color: textMain }}>{item.title}</p>
                  <p className="text-[10px] font-bold" style={{ color: textMuted }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
