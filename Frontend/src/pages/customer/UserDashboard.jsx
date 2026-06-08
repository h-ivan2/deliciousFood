import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Wallet,
  TrendingUp,
  Clock,
  Settings,
  Edit3,
  ChevronRight,
  Star,
  Heart,
  LogOut,
  Award,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

const MOCK_RECENT_ACTIVITY = [
  { id: 'act1', type: 'order', label: 'Order delivered', detail: 'The Green Bowl • $24.99', time: 'Today, 12:30 PM', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'act2', type: 'reservation', label: 'Table reservation', detail: 'Pizza Point • Mar 15, 7:00 PM', time: 'Yesterday', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'act3', type: 'order', label: 'Order delivered', detail: 'Burger House • $14.99', time: 'Mar 13, 8:15 PM', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'act4', type: 'wallet', label: 'Wallet top-up', detail: '+$50.00 added to wallet', time: 'Mar 12, 10:00 AM', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'act5', type: 'favorite', label: 'New favorite', detail: 'Added Sakura Sushi to favorites', time: 'Mar 10, 6:45 PM', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'act6', type: 'order', label: 'Order delivered', detail: 'Taco Fiesta • $18.50', time: 'Mar 8, 7:30 PM', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { walletBalance } = useCart();

  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@delicious.com',
    phone: '+250 788 123 456',
    location: 'Kigali, Rwanda',
    memberSince: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const stats = [
    { label: 'Orders Placed', value: '24', icon: ShoppingBag, color: 'text-amber-500', colorHex: '#f59e0b', bg: 'bg-amber-50' },
    { label: 'Reservations', value: '8', icon: Calendar, color: 'text-emerald-600', colorHex: '#059669', bg: 'bg-emerald-50' },
    { label: 'Wallet Balance', value: `$${walletBalance.toFixed(2)}`, icon: Wallet, color: 'text-blue-600', colorHex: '#2563eb', bg: 'bg-blue-50' },
    { label: 'Favorites', value: '12', icon: Heart, color: 'text-red-500', colorHex: '#ef4444', bg: 'bg-red-50' },
    { label: 'Reward Points', value: '1,250', icon: Award, color: 'text-purple-600', colorHex: '#9333ea', bg: 'bg-purple-50' },
  ];

  const handleSaveProfile = () => {
    setUser({ ...editForm });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  // ── Theme tokens ──────────────────────────────
  const bgColor = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.5)' : '#9ca3af';
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : '#6b7280';
  const mutedBg = dark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const hoverBg = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ background: bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
        {/* ─── PROFILE HEADER ─── */}
        <motion.div
          variants={itemVariants}
          className="rounded-[28px] border shadow-sm overflow-hidden mb-8"
          style={{ background: cardBg, borderColor: borderCol }}
        >
          {/* Cover */}
          <div className="h-36 lg:h-48 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 lg:px-8 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl border-4 overflow-hidden shadow-lg"
                style={{ borderColor: cardBg, background: cardBg }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 pt-4 sm:pt-0 sm:pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-black leading-tight" style={{ color: textColor }}>
                      {user.name}
                    </h1>
                    <p className="text-xs font-bold mt-0.5 flex items-center gap-1.5" style={{ color: textMuted }}>
                      <MapPin size={12} className="text-amber-500" />
                      {user.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold hover:opacity-80 transition-colors cursor-pointer border"
                      style={{
                        background: mutedBg,
                        borderColor: borderCol,
                        color: dark ? 'rgba(255,255,255,0.7)' : '#6b7280',
                      }}
                    >
                      <Settings size={14} /> Settings
                    </button>
                    {!isEditing && (
                      <button
                        onClick={() => { setEditForm({ ...user }); setIsEditing(true); }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 text-black text-xs font-black hover:bg-amber-600 transition-colors border-none cursor-pointer shadow-sm"
                      >
                        <Edit3 size={14} /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── MAIN GRID ─── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-8">
            {/* EDIT PROFILE CARD */}
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-[24px] border p-6 shadow-sm"
                style={{ background: cardBg, borderColor: borderCol }}
              >
                <h3 className="font-extrabold text-xs uppercase tracking-wider mb-5" style={{ color: textColor }}>
                  Edit Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: textMuted }}>Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-amber-500 transition-colors"
                      style={{
                        background: mutedBg,
                        borderColor: borderCol,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: textMuted }}>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-amber-500 transition-colors"
                      style={{
                        background: mutedBg,
                        borderColor: borderCol,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: textMuted }}>Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full border rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-amber-500 transition-colors"
                      style={{
                        background: mutedBg,
                        borderColor: borderCol,
                        color: textColor,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: textMuted }}>Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full border rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-amber-500 transition-colors"
                      style={{
                        background: mutedBg,
                        borderColor: borderCol,
                        color: textColor,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-6 py-3 rounded-2xl border-none cursor-pointer transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="font-bold text-xs px-6 py-3 rounded-2xl border cursor-pointer transition-colors"
                    style={{
                      background: mutedBg,
                      borderColor: borderCol,
                      color: textMuted,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              /* USER INFO CARD */
              <motion.div
                variants={itemVariants}
                className="rounded-[24px] border p-6 shadow-sm"
                style={{ background: cardBg, borderColor: borderCol }}
              >
                <h3 className="font-extrabold text-xs uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: textColor }}>
                  <User size={15} className="text-amber-500" /> Profile Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: mutedBg }}>
                    <Mail size={16} style={{ color: textMuted }} className="flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>Email</p>
                      <p className="text-xs font-extrabold" style={{ color: textColor }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: mutedBg }}>
                    <Phone size={16} style={{ color: textMuted }} className="flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>Phone</p>
                      <p className="text-xs font-extrabold" style={{ color: textColor }}>{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: mutedBg }}>
                    <MapPin size={16} style={{ color: textMuted }} className="flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>Location</p>
                      <p className="text-xs font-extrabold" style={{ color: textColor }}>{user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: mutedBg }}>
                    <Calendar size={16} style={{ color: textMuted }} className="flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: textMuted }}>Member Since</p>
                      <p className="text-xs font-extrabold" style={{ color: textColor }}>{user.memberSince}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RECENT ACTIVITY */}
            <motion.div
              variants={itemVariants}
              className="rounded-[24px] border p-6 shadow-sm"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2" style={{ color: textColor }}>
                  <Clock size={15} className="text-amber-500" /> Recent Activity
                </h3>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-[10px] font-black text-amber-500 bg-transparent border-none cursor-pointer hover:underline"
                >
                  View All <ChevronRight size={12} className="inline" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {MOCK_RECENT_ACTIVITY.slice(0, 5).map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer"
                      style={{ hover: { background: hoverBg } }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                        style={{ background: dark ? 'rgba(255,255,255,0.08)' : '#f0fdf4' }}
                      >
                        <Icon size={16} className={activity.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-extrabold truncate" style={{ color: textColor }}>{activity.label}</p>
                        <p className="text-[10px] font-bold truncate" style={{ color: textMuted }}>{activity.detail}</p>
                      </div>
                      <span className="text-[9px] font-bold whitespace-nowrap" style={{ color: textMuted }}>{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-[340px] flex flex-col gap-6">
            {/* STATS CARDS */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-4"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                const statBg = dark ? 'rgba(255,255,255,0.06)' : stat.bg;
                const iconColorClass = dark ? '' : stat.color;
                return (
                  <div
                    key={stat.label}
                    className="rounded-[20px] border p-5 shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: cardBg, borderColor: borderCol }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: statBg }}
                      >
                        <Icon size={20} className={iconColorClass} style={dark ? { color: stat.colorHex } : {}} />
                      </div>
                      <div>
                        <p className="text-lg font-black leading-tight" style={{ color: textColor }}>{stat.value}</p>
                        <p className="text-[10px] font-bold mt-0.5" style={{ color: textMuted }}>{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* QUICK ACTIONS */}
            <motion.div
              variants={itemVariants}
              className="rounded-[24px] border p-6 shadow-sm"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <h3 className="font-extrabold text-xs uppercase tracking-wider mb-4" style={{ color: textColor }}>
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Browse Restaurants', icon: ShoppingBag, path: '/browse' },
                  { label: 'View Orders', icon: Clock, path: '/orders' },
                  { label: 'My Reservations', icon: Calendar, path: '/reservations' },
                  { label: 'Favorites', icon: Heart, path: '/favorites' },
                ].map(({ label, icon: Icon, path }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold border-none cursor-pointer transition-colors"
                    style={{
                      background: mutedBg,
                      color: dark ? 'rgba(255,255,255,0.8)' : '#374151',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dark ? 'rgba(245,179,1,0.12)' : '#fffbeb'; e.currentTarget.style.color = '#d97706'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = mutedBg; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.8)' : '#374151'; }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} /> {label}
                    </span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* MEMBERSHIP BADGE */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-[24px] p-6 shadow-sm text-black"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm leading-tight">Gold Member</h4>
                  <p className="text-[10px] font-bold text-black/70">Premium Benefits Active</p>
                </div>
              </div>
              <div className="space-y-2 text-[10px] font-bold text-black/80">
                <p className="flex items-center gap-1.5"><Star size={11} /> 5% cashback on all orders</p>
                <p className="flex items-center gap-1.5"><TrendingUp size={11} /> Priority support & free delivery</p>
                <p className="flex items-center gap-1.5"><Award size={11} /> Exclusive member-only offers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
