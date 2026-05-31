import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Logo, ThemeToggle, Icons } from '../components/ui';
import {
  IMG_LOGIN_BG,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

const SLIDES = [
  {
    img: IMG_REST_PIZZA_POINT,
    text: 'Your restaurant deserves to be discovered by the world.',
    author: 'Delicious Food',
  },
  {
    img: IMG_REST_SPICE_ROUTE,
    text: 'Great food speaks for itself. Let us help it reach further.',
    author: 'Delicious Food',
  },
  {
    img: IMG_LOGIN_BG,
    text: 'Every great restaurant starts with a single great meal.',
    author: 'Auguste Escoffier',
  },
  {
    img: IMG_REST_OCEAN_DELIGHT,
    text: 'Cooking is an art, but all art requires knowing something about the techniques.',
    author: 'Nathan Myhrvold',
  },
];

const PERKS = [
  'Reach more customers',
  'Manage Orders easily',
  'Grow your Business',
];


export default function Signup() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e2e2e2';
  const inputColor = dark ? '#fff' : '#1a1a1a';
  const labelColor = dark ? 'rgba(255,255,255,0.75)' : '#333';
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#888';
  const dividerColor = dark ? 'rgba(255,255,255,0.08)' : '#e8e8e8';

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputStyle = {
    padding: '13px 16px 13px 44px',
    background: inputBg,
    border: `1.5px solid ${inputBorder}`,
    color: inputColor,
    fontFamily: 'DM Sans, sans-serif',
    width: '100%',
    borderRadius: 12,
    outline: 'none',
    fontSize: 14,
    transition: 'all 0.2s',
  };

  const onFocus = (e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; };
  const onBlur = (e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; };

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* LEFT PANEL — Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
        style={{ width: '100%', maxWidth: 580, background: cardBg, padding: '36px 52px', overflowY: 'auto', position: 'relative', zIndex: 2 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer hover:text-accent border-none bg-transparent p-0"
              style={{ color: subColor }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
            <Logo onClick={() => navigate('/')} />
          </div>
          <ThemeToggle />
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="font-display font-black text-3xl mb-1.5">Create your Account</h1>
          <p style={{ color: subColor, fontSize: 15 }}>Join Delicious Food and grow your Restaurant business</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}><Icons.User /></span>
              <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Enter your full name" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}><Icons.Mail /></span>
              <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Enter your email" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}><Icons.Lock /></span>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Create password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer" style={{ color: subColor }}>
                {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Confirm password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}><Icons.Lock /></span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={handleChange('confirm')}
                placeholder="Confirm your password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button onClick={() => setShowConfirm((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer" style={{ color: subColor }}>
                {showConfirm ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none mt-1">
            <div
              onClick={() => setAgreed((a) => !a)}
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{ background: agreed ? '#F5B301' : 'transparent', border: `2px solid ${agreed ? '#F5B301' : inputBorder}` }}
            >
              {agreed && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-sm" style={{ color: labelColor }}>
              I agree to the{' '}
              <span className="text-accent font-semibold cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-accent font-semibold cursor-pointer hover:underline">Privacy Policy</span>
            </span>
          </label>

          {/* Submit */}
          <motion.button
            whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(245,179,1,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full font-bold text-base flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 mt-1"
            style={{ background: '#F5B301', color: '#000', padding: '15px', fontFamily: 'DM Sans, sans-serif' }}
          >
            Create Account
          </motion.button>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm mt-6" style={{ color: subColor }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-bold text-accent border-none bg-transparent cursor-pointer hover:underline">
            Sign In
          </button>
        </p>
      </motion.div>

      {/* RIGHT PANEL — Slideshow */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">

        {/* Stacked background images — always mounted, crossfade via opacity */}
        {SLIDES.map((slide, i) => (
          <motion.img
            key={i}
            src={slide.img}
            alt="Food"
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: i === slideIdx ? 0.55 : 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ zIndex: i === slideIdx ? 1 : 0 }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.12) 100%)' }}
        />

        {/* Perks — top area */}
        <div className="absolute top-12 left-10 right-10 z-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white font-display font-black leading-tight mb-8"
            style={{ fontSize: 'clamp(28px, 3vw, 46px)' }}
          >
            Let's grow your<br />restaurant<br />together!
          </motion.h2>

          <div className="flex flex-col gap-4">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2.5px solid #F5B301' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white font-bold text-base">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote — bottom area */}
        <div className="absolute bottom-10 left-10 right-10 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="text-5xl mb-2 leading-none" style={{ color: '#F5B301', fontFamily: 'serif' }}>&ldquo;</div>
              <p className="text-white font-bold text-xl leading-snug mb-3 max-w-sm">
                {SLIDES[slideIdx].text}
              </p>
              <p className="text-accent font-semibold text-sm">— {SLIDES[slideIdx].author}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className="rounded-full border-none cursor-pointer transition-all duration-300"
                style={{
                  width: i === slideIdx ? 28 : 8,
                  height: 8,
                  background: i === slideIdx ? '#F5B301' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
