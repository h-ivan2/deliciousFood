import { useTheme } from '../../context/ThemeContext';
import { IMG_LOGO } from '../../constants/images';
import {
  Sun,
  Moon,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  Play,
  Heart,
  Clock,
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  BarChart2,
  Settings,
  Users,
  Store,
  TrendingUp,
  Shield,
  MapPin,
  Zap,
  Target,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Star as StarIcon,
  Utensils,
} from 'lucide-react';

// ─────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────
export function Logo({ size = 'md', onClick }) {
  const sizeMap = { sm: 48, md: 72, lg: 96 };
  const px = sizeMap[size] || 72;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      {IMG_LOGO ? (
        <img
          src={IMG_LOGO}
          alt="Delicious Food Logo"
          style={{ height: px, width: 'auto', maxWidth: px * 2, objectFit: 'contain' }}
        />
      ) : (
        /* Fallback: Lucide icon instead of emoji */
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-xl"
          style={{
            width: px,
            height: px,
            background: 'linear-gradient(135deg, #F5B301, #c98f00)',
          }}
        >
          <Utensils size={px * 0.5} color="#000" />
        </div>
      )}
      <div>
        <div
          className="font-display font-bold leading-tight"
          style={{ fontSize: size === 'lg' ? 22 : size === 'sm' ? 14 : 17 }}
        >
          Delicious Food
        </div>
        {size !== 'sm' && (
          <div className="text-accent text-xs font-medium tracking-wide">
            Good Food, Good Mood
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// THEME TOGGLE  — Sun / Moon Lucide icons
// ─────────────────────────────────────────────
export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex-shrink-0 rounded-full transition-colors duration-300 border-none outline-none cursor-pointer"
      style={{ width: 48, height: 26, background: dark ? '#F5B301' : '#d1d5db' }}
    >
      <div
        className="absolute top-[3px] flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300"
        style={{ width: 20, height: 20, left: dark ? 25 : 3 }}
      >
        {/* Lucide Sun / Moon — no emojis */}
        {dark
          ? <Moon size={11} color="#1a1a1a" />
          : <Sun  size={11} color="#c98f00" />
        }
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────
export function BtnPrimary({ children, onClick, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-bold rounded-full border-none cursor-pointer font-body transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,179,1,0.4)] ${className}`}
      style={{ background: '#F5B301', color: '#000', padding: '14px 32px', fontSize: 15, ...style }}
    >
      {children}
    </button>
  );
}

export function BtnOutline({ children, onClick, dark = true, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer font-body transition-all duration-200 ${className}`}
      style={{
        background: 'transparent',
        color: dark ? '#fff' : '#1a1a1a',
        padding: '14px 32px',
        fontSize: 15,
        border: `1.5px solid ${dark ? 'rgba(255,255,255,0.3)' : '#1a1a1a'}`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#F5B301';
        e.currentTarget.style.color = '#F5B301';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.3)' : '#1a1a1a';
        e.currentTarget.style.color = dark ? '#fff' : '#1a1a1a';
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// TAG
// ─────────────────────────────────────────────
export function Tag({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent rounded-full px-3.5 py-1.5"
      style={{ border: '1px solid rgba(245,179,1,0.4)', background: 'rgba(245,179,1,0.08)' }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// ICONS  — 100% Lucide, no emojis
// ─────────────────────────────────────────────
export const Icons = {
  Sun:      () => <Sun  size={18} />,
  Moon:     () => <Moon size={18} />,
  Star:     ({ size = 14 }) => <StarIcon size={size} fill="#F5B301" color="#F5B301" />,
  Arrow:    () => <ArrowRight size={16} />,
  Eye:      () => <Eye     size={16} />,
  EyeOff:   () => <EyeOff  size={16} />,
  Mail:     () => <Mail    size={16} />,
  Lock:     () => <Lock    size={16} />,
  User:     () => <User    size={16} />,
  Phone:    () => <Phone   size={16} />,
  Check:    () => <Check   size={16} color="#F5B301" strokeWidth={2.5} />,
  Play:     () => <Play    size={14} fill="currentColor" />,
  Heart:    ({ filled = false }) => (
    <Heart size={16} fill={filled ? '#F5B301' : 'none'} color={filled ? '#F5B301' : 'currentColor'} />
  ),
  Clock:    () => <Clock   size={13} />,
  Menu:     () => <Menu    size={22} />,
  Close:    () => <X       size={22} />,

  // Social
  Twitter:   () => <Twitter   size={16} />,
  Instagram: () => <Instagram size={16} />,
  Linkedin:  () => <Linkedin  size={16} />,
  Facebook:  () => <Facebook  size={16} color="#1877F2" fill="#1877F2" />,

  // Feature / dashboard
  Dashboard:    () => <LayoutDashboard size={22} />,
  Utensils:     () => <UtensilsCrossed size={22} />,
  Orders:       () => <ShoppingBag     size={22} />,
  Analytics:    () => <BarChart2       size={22} />,
  SettingsIcon: () => <Settings        size={22} />,
  UsersIcon:    () => <Users           size={22} />,
  StoreIcon:    () => <Store           size={22} />,
  TrendingUp:   () => <TrendingUp      size={22} />,
  Shield:       () => <Shield          size={22} />,
  MapPin:       () => <MapPin          size={22} />,
  Zap:          () => <Zap             size={22} />,
  Target:       () => <Target          size={22} />,

  // Google — brand colours require SVG
  Google: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),

  // Apple — no Lucide equivalent
  Apple: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  ),

  // Quote — decorative, no Lucide equivalent
  Quote: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5B301">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
};