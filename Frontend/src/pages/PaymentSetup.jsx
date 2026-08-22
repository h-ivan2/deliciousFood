import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle, Icons } from '../components/ui';
import { authService } from '../services/api';

const CARD_TYPES = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
};

function detectCardType(number) {
  const raw = number.replace(/\s/g, '');
  for (const [type, regex] of Object.entries(CARD_TYPES)) {
    if (regex.test(raw)) return type;
  }
  return '';
}

function formatCardNumber(value) {
  const raw = value.replace(/\D/g, '').slice(0, 16);
  return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const raw = value.replace(/\D/g, '').slice(0, 4);
  if (raw.length >= 3) return raw.slice(0, 2) + '/' + raw.slice(2);
  return raw;
}

export default function PaymentSetup() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    // Only customers should access this page
    if (user.role !== 'customer') {
      navigate(user.role === 'owner' ? '/owner' : '/admin');
      return;
    }
    // If user already has a payment method, skip to dashboard
    if (user.hasPaymentMethod) {
      navigate('/explore');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const inputColor = dark ? '#fff' : '#1a1a1a';
  const labelColor = dark ? 'rgba(255,255,255,0.75)' : '#374151';
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#9ca3af';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await authService.updateProfile({
        paymentMethod: {
          cardHolder: form.cardHolder,
          cardNumber: form.cardNumber.replace(/\s/g, ''),
          expiryDate: form.expiryDate,
          cardType,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate('/explore'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/explore');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <Loader2 size={36} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2" style={{ color: dark ? '#fff' : '#1a1a1a' }}>
            Payment Method Saved!
          </h2>
          <p className="text-sm" style={{ color: subColor }}>
            Redirecting you to the dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  const inputStyle = {
    background: inputBg,
    border: `1.5px solid ${inputBorder}`,
    color: inputColor,
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* ─── LEFT PANEL — Form ─── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
        style={{
          width: '100%',
          maxWidth: 580,
          background: cardBg,
          padding: '36px 52px',
          position: 'relative',
          zIndex: 2,
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 text-sm font-semibold cursor-pointer border-none bg-transparent"
            style={{ color: subColor }}
          >
            <ArrowLeft size={16} /> Skip for now
          </button>
          <ThemeToggle />
        </div>

        <div className="mb-7">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(245,179,1,0.12)', border: '1px solid rgba(245,179,1,0.3)' }}
          >
            <CreditCard size={24} style={{ color: '#F5B301' }} />
          </div>
          <h1 className="font-display font-black text-3xl mb-1.5">
            Add Payment Method
          </h1>
          <p style={{ color: subColor }}>
            Set up your payment method to start ordering food. You can always update this later in settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Cardholder Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <Icons.User />
              </span>
              <input
                type="text"
                value={form.cardHolder}
                onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{ padding: '13px 16px 13px 44px', ...inputStyle }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
                required
              />
            </div>
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Card Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <CreditCard size={16} />
              </span>
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setForm({ ...form, cardNumber: formatted });
                  setCardType(detectCardType(formatted));
                }}
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{ padding: '13px 16px 13px 44px', ...inputStyle }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
                maxLength={19}
                required
              />
              {cardType && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase" style={{ color: '#F5B301' }}>
                  {cardType}
                </span>
              )}
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
                Expiry Date
              </label>
              <input
                type="text"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: formatExpiry(e.target.value) })}
                placeholder="MM/YY"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{ padding: '13px 16px', ...inputStyle }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
                CVV
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="***"
                  className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                  style={{ padding: '13px 16px', ...inputStyle }}
                  onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                  onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
                  maxLength={4}
                  required
                />
                <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: subColor }} />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 mt-1">
            <Lock size={13} className="text-green-500 flex-shrink-0" />
            <p className="text-[11px] font-medium" style={{ color: subColor }}>
              Your card details are encrypted and stored securely. Only the last 4 digits are saved.
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>
          )}

          <motion.button
            type="submit"
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(245,179,1,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full font-bold text-base flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 mt-2"
            style={{ background: '#F5B301', color: '#000', padding: '15px', fontFamily: 'DM Sans, sans-serif' }}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Save Payment Method
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </motion.button>

          <p className="text-xs text-center mt-2" style={{ color: subColor }}>
            Prefer to skip?{' '}
            <button
              type="button"
              onClick={handleSkip}
              className="font-semibold underline cursor-pointer bg-transparent border-none"
              style={{ color: '#F5B301' }}
            >
              Set up later in Settings
            </button>
          </p>
        </form>
      </motion.div>

      {/* ─── RIGHT PANEL — Info ─── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center"
        style={{ background: dark ? '#0B1020' : '#fffbeb' }}>
        <div className="max-w-md px-12 text-center">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(245,179,1,0.15)' }}>
            <CreditCard size={36} style={{ color: '#F5B301' }} />
          </div>
          <h2 className="font-display font-black text-3xl mb-4" style={{ color: dark ? '#fff' : '#1a1a1a' }}>
            Why add a payment method?
          </h2>
          <div className="flex flex-col gap-5 text-left">
            {[
              { emoji: '⚡', title: 'Fast Checkout', desc: 'Skip entering card details every time you order' },
              { emoji: '🔒', title: 'Secure Storage', desc: 'Your card info is encrypted and only last 4 digits are stored' },
              { emoji: '💰', title: 'Easy Top-Up', desc: 'Add funds to your wallet for seamless payments' },
              { emoji: '⏭', title: 'Skip Anytime', desc: 'You can set this up later in your settings' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{item.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: dark ? '#fff' : '#1a1a1a' }}>{item.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: subColor }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
