import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Logo, ThemeToggle, BtnPrimary, BtnOutline, Icons } from '../ui';

const NAV_LINKS = ['Features', 'Restaurants', 'About', 'Contact'];

export default function Navbar() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const bgClass = scrolled
    ? dark
      ? 'bg-[rgba(7,11,20,0.92)] border-b border-white/5 backdrop-blur-xl'
      : 'bg-[rgba(248,245,240,0.92)] border-b border-black/5 backdrop-blur-xl'
    : 'bg-transparent';

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[70px] flex items-center justify-between">
        <Logo onClick={() => navigate('/')} style={!scrolled ? { color: '#fff' } : {}} />

        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a key={link} className={`nav-link ${!scrolled ? 'text-white/85' : dark ? 'text-white/75' : 'text-black/70'}`}>
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <BtnOutline dark={!scrolled ? true : dark} onClick={() => navigate('/login')} style={{ padding: '9px 20px', fontSize: 14 }}>
            Login
          </BtnOutline>
          <BtnPrimary onClick={() => navigate('/signup')} style={{ padding: '9px 20px', fontSize: 14 }}>
            Get Started
          </BtnPrimary>
          <button
            className={`md:hidden p-2 rounded-lg border-none bg-transparent cursor-pointer ${!scrolled ? 'text-white' : dark ? 'text-white' : 'text-black'}`}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden ${dark ? 'bg-[#0B1020]' : 'bg-white'} border-t ${dark ? 'border-white/5' : 'border-black/5'}`}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a key={link} className={`nav-link text-base py-2 ${!scrolled ? 'text-white/85' : dark ? 'text-white/75' : 'text-black/70'}`} onClick={() => setMobileOpen(false)}>
                  {link}
                </a>
              ))}
              <div className="flex gap-3 mt-2">
                <BtnOutline dark={dark} onClick={() => { navigate('/login'); setMobileOpen(false); }} style={{ flex: 1, padding: '10px', fontSize: 14 }}>Login</BtnOutline>
                <BtnPrimary onClick={() => { navigate('/signup'); setMobileOpen(false); }} style={{ flex: 1, padding: '10px', fontSize: 14 }}>Get Started</BtnPrimary>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
