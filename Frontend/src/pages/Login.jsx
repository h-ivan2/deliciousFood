import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Logo, ThemeToggle, Icons } from '../components/ui';
import { authService } from '../services/api';
import {
  IMG_LOGIN_BG,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

const SLIDES = [
  {
    img: IMG_LOGIN_BG,
    text: 'Good food is the foundation of genuine happiness.',
    author: 'Auguste Escoffier',
  },
  {
    img: IMG_REST_SPICE_ROUTE,
    text: 'People who love to eat are always the best people.',
    author: 'Julia Child',
  },
  {
    img: IMG_REST_PIZZA_POINT,
    text: 'One cannot think well, love well, sleep well, if one has not dined well.',
    author: 'Virginia Woolf',
  },
  {
    img: IMG_REST_OCEAN_DELIGHT,
    text: 'Life is uncertain. Eat dessert first.',
    author: 'Ernestine Ulmer',
  },
];

export default function Login() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e2e2e2';
  const inputColor = dark ? '#fff' : '#1a1a1a';
  const labelColor = dark ? 'rgba(255,255,255,0.75)' : '#333';
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#888';
  const dividerColor = dark ? 'rgba(255,255,255,0.08)' : '#e8e8e8';

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* LEFT PANEL — Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
        style={{
          width: '100%',
          maxWidth: 580,
          background: cardBg,
          padding: '40px 52px',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
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

        
        <div className="mb-6 flex flex-col items-start">
          <h1 className="font-display font-black text-3xl mb-1.5">
            Welcome back 👋
          </h1>
        </div>

        
        <form
          className="flex flex-col gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            setErrorMsg('');
            if (!email || !password) {
              setErrorMsg('Please fill in both email and password');
              return;
            }
            setLoading(true);
            try {
              const res = await authService.login(email, password);
              if (res.success) {
                if (res.user.role === 'admin') {
                  navigate('/admin');
                } else if (res.user.role === 'owner') {
                  navigate('/owner');
                } else {
                  navigate('/'); 
                }
              }
            } catch (err) { 
              setErrorMsg(err.message);
            } finally {
              setLoading(false);
            }
          }}
        >

     
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Email or Phone number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <Icons.Mail />
              </span>
              <input
                type="text"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{
                  padding: '13px 16px 13px 44px',
                  background: inputBg,
                  border: `1.5px solid ${inputBorder}`,
                  color: inputColor,
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <Icons.Lock />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{
                  padding: '13px 44px 13px 44px',
                  background: inputBg,
                  border: `1.5px solid ${inputBorder}`,
                  color: inputColor,
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
                style={{ color: subColor }}
              >
                {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setRemember((r) => !r)}
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: remember ? '#F5B301' : 'transparent',
                  border: `2px solid ${remember ? '#F5B301' : inputBorder}`,
                }}
              >
                {remember && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: labelColor }}>Remember me</span>
            </label>
            <button type="button" className="text-sm font-semibold text-accent border-none bg-transparent cursor-pointer hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Sign In button */}
          <motion.button
            type="submit"
            whileHover={!loading ? { y: -2, boxShadow: '0 8px 28px rgba(245,179,1,0.4)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full rounded-full font-bold text-base flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{ background: '#F5B301', color: '#000', padding: '15px', fontFamily: 'DM Sans, sans-serif' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
          <span className="text-xs" style={{ color: subColor }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          {[
            { icon: <Icons.Google />, label: 'Google' },
            { icon: <Icons.Apple />, label: 'Apple' },
            { icon: <Icons.Facebook />, label: 'Facebook' },
          ].map(({ icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium text-sm cursor-pointer transition-all duration-200"
              style={{
                border: `1.5px solid ${inputBorder}`,
                background: 'transparent',
                color: inputColor,
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F5B301'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = inputBorder; }}
            >
              {icon} {label}
            </motion.button>
          ))}
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm mt-8" style={{ color: subColor }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-bold text-accent border-none bg-transparent cursor-pointer hover:underline">
            Sign up
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

        {/* Quote */}
        <div className="absolute bottom-10 left-10 right-10 z-20">
          <AnimatePresence mode="wait" initial={false}>
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
