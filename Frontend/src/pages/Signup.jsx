import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; 
import { useTheme } from '../context/ThemeContext';
import { Logo, ThemeToggle } from '../components/ui'; 
import { authService } from '../services/api';
import {
  IMG_LOGIN_BG,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

const CUSTOMER_SLIDES = [
  { img: IMG_REST_PIZZA_POINT, text: 'Your restaurant deserves to be discovered by the world.', author: 'Delicious Food' },
  { img: IMG_REST_SPICE_ROUTE, text: 'Great food speaks for itself. Let us help it reach further.', author: 'Delicious Food' },
  { img: IMG_LOGIN_BG, text: 'Every great restaurant starts with a single great meal.', author: 'Auguste Escoffier' },
  { img: IMG_REST_OCEAN_DELIGHT, text: 'Cooking is an art, but all art requires knowing something about the techniques.', author: 'Nathan Myhrvold' },
];

const OWNER_SLIDES = [
  { img: IMG_LOGIN_BG, text: 'Your passion for food deserves a platform as ambitious as you are.', author: 'Delicious Food' },
  { img: IMG_REST_PIZZA_POINT, text: 'Every empire of flavor started with a single recipe and a dream.', author: 'Delicious Food' },
  { img: IMG_REST_BURGER_HOUSE, text: 'The best marketing tool for a restaurant is a consistently great experience.', author: 'Danny Meyer' },
  { img: IMG_REST_SPICE_ROUTE, text: 'Owning a restaurant is not just about food. It is about creating moments.', author: 'Delicious Food' },
];

const PERKS = ['Reach more customers', 'Manage Orders easily', 'Grow your Business'];

export default function Signup() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'customer';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [error, setError] = useState('');

  const isOwner = role === 'owner';
  const slides = isOwner ? OWNER_SLIDES : CUSTOMER_SLIDES;

  useEffect(() => {
    setSlideIdx(0);
    const timer = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [isOwner, slides.length]);

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e2e2e2';
  const inputColor = dark ? '#fff' : '#1a1a1a';
  const labelColor = dark ? 'rgba(255,255,255,0.75)' : '#333';
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#888';

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authService.signup({ ...form, role });
      if (isOwner) {
        navigate('/register-restaurant');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-semibold cursor-pointer border-none bg-transparent" style={{ color: subColor }}>
            <ArrowLeft size={16} /> Back
          </button>
          <ThemeToggle />
        </div>
        <div className="mb-7">
          <h1 className="font-display font-black text-3xl mb-1.5">
            {isOwner ? 'Create Owner Account' : 'Create Your Account'}
          </h1>
          <p style={{ color: subColor }}>
            {isOwner
              ? 'Register your restaurant and start managing your business'
              : 'Join Delicious Food and explore great restaurants near you'}
          </p>
          {/* role indicator badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold mt-3 px-3 py-1.5 rounded-full"
            style={{
              background: isOwner ? 'rgba(245,179,1,0.12)' : 'rgba(34,197,94,0.12)',
              border: `1px solid ${isOwner ? 'rgba(245,179,1,0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: isOwner ? '#F5B301' : '#22c55e',
            }}
          >
            {isOwner ? '🍽  Restaurant Owner' : '👤  Customer'}
            <button
              onClick={() => navigate(`/signup?role=${isOwner ? 'customer' : 'owner'}`)}
              className="underline ml-1 cursor-pointer bg-transparent border-none"
              style={{ color: subColor, fontSize: 10 }}
            >
              Switch
            </button>
          </div>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm(f=>({...f, name: e.target.value}))} placeholder="Enter your full name" className="w-full p-4 rounded-xl border" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f=>({...f, email: e.target.value}))} placeholder="Enter your email" className="w-full p-4 rounded-xl border" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Password</label>
            <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm(f=>({...f, password: e.target.value}))} placeholder="Create password" className="w-full p-4 rounded-xl border" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>Confirm Password</label>
            <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={(e) => setForm(f=>({...f, confirm: e.target.value}))} placeholder="Confirm your password" className="w-full p-4 rounded-xl border" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} required />
          </div>

          {error && <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            className="w-full rounded-full font-bold p-4 mt-2"
            style={{ background: isOwner ? '#F5B301' : '#22c55e', color: '#000' }}
          >
            {isOwner ? 'Create Owner Account' : 'Create Account'}
          </motion.button>

          <p className="text-xs text-center mt-2" style={{ color: subColor }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold underline cursor-pointer bg-transparent border-none"
              style={{ color: isOwner ? '#F5B301' : '#22c55e' }}
            >
              Sign In
            </button>
          </p>
        </form>
      </motion.div>

      {/* ─── RIGHT PANEL — Slideshow ─── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        {/* Stacked background images — crossfade via opacity */}
        {slides.map((slide, i) => (
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
                {slides[slideIdx].text}
              </p>
              <p className="text-accent font-semibold text-sm">— {slides[slideIdx].author}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-6">
            {slides.map((_, i) => (
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
