import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  Users,
  ClipboardList,
  MapPin,
  BarChart3,
  Star,
  Quote,
  Store,
  UserCircle2,
  Settings2,
  ChefHat,
  Bike,
  Leaf,
  UserPlus,
  Store as StoreIcon,
  ArrowRight,
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RestaurantCard from '../components/RestaurantCard';
import DashboardMockup from '../components/DashboardMockup';
import { BtnPrimary, BtnOutline, Tag } from '../components/ui';
import { BackgroundPaths } from '../components/ui/BackgroundPaths';
import { CircularTestimonials } from '../components/ui/CircularTestimonials';

import {
  IMG_HERO_BG,
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

// ─── animation helpers ────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' },
});

// ─── static data ──────────────────────────────────────────────
const RESTAURANTS = [
  { img: IMG_REST_GREEN_BOWL,    name: 'The Green Bowl', rating: '4.8', reviews: '230', time: '25-30 min' },
  { img: IMG_REST_SPICE_ROUTE,   name: 'Spice Route',    rating: '4.6', reviews: '180', time: '30-35 min' },
  { img: IMG_REST_PIZZA_POINT,   name: 'Pizza Point',    rating: '4.7', reviews: '210', time: '20-25 min' },
  { img: IMG_REST_BURGER_HOUSE,  name: 'Burger House',   rating: '4.9', reviews: '160', time: '25-30 min' },
  { img: IMG_REST_OCEAN_DELIGHT, name: 'Ocean Delight',  rating: '4.4', reviews: '130', time: '30-35 min' },
];

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Italian', 'Desserts', 'More'];

const HERO_FEATURES = [
  { Icon: TrendingUp,  title: 'Manage & Grow',       sub: 'Powerful tools for restaurant owners' },
  { Icon: Zap,         title: 'Seamless Experience',  sub: 'Easy ordering & real-time tracking customers' },
  { Icon: ShieldCheck, title: 'Full Control',          sub: 'Super admin oversight and complete control' },
];

const TESTIMONIALS = [
  {
    quote: "I was impressed by the food! And I could really tell that they use high-quality ingredients. The staff was friendly and attentive. I'll definitely be back for more!",
    name: "Tamar Mendelson",
    designation: "Restaurant Critic",
    src: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond. I'll keep returning for more exceptional dining experience.",
    name: "Joe Charlescraft",
    designation: "Frequent Visitor",
    src: "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
  },
  {
    quote: "Delicious Food is a hidden gem! The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
    name: "Martina Edelweist",
    designation: "Satisfied Customer",
    src: "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
  },
];

const HERO_STATS = [
  { value: '245+',    label: 'Restaurants' },
  { value: '2,500+', label: 'Happy Customers' },
  { value: '$24K+',  label: 'Revenue Managed' },
];

// Bottom features bar — matches the 4-column row in the design
const BOTTOM_FEATURES = [
  { Icon: Users,         title: 'Role-Based System',        desc: 'Super Admin, Owners\n& Customers' },
  { Icon: ClipboardList, title: 'Menu & Order Management',  desc: 'Create Menus Manage orders,\n& categories easily' },
  { Icon: MapPin,        title: 'Real-Time tracking',       desc: 'Track orders and Updates\nin real time.' },
  { Icon: BarChart3,     title: 'Scalable Solution',        desc: 'Built to grow  with your\nbusiness' },
];

// ─── Tablet frame component ────────────────────────────────────
/**
 * Wraps children in a dark rounded tablet/iPad-style frame.
 * `scale` lets you shrink it for the side tablets.
 */
function TabletFrame({ children, className = '', style = {} }) {
  return (
    <div
      className={`relative rounded-[24px] overflow-hidden ${className}`}
      style={{
        background: '#0d1117',
        border: '8px solid #1e2433',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)',
        ...style,
      }}
    >
      {/* top bar chrome */}
      <div
        className="w-full flex items-center justify-center"
        style={{ background: '#161b27', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
      </div>
      <div style={{ overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

// ─── Tablet 1: Restaurant Owner — Menu Management ─────────────
function TabletMenuManagement() {
  const menuItems = [
    { name: 'Grilled Chicken', desc: 'Tender Chicken with BBQ Sauce', price: '$12.99' },
    { name: 'Margherita Pizza', desc: 'Classic Margherita',            price: '$13.99' },
    { name: 'Beef Burger',      desc: 'Delicious premium beef burger', price: '$11.49' },
    { name: 'Creamy Pasta',     desc: 'Rich & Creamy Pasta',           price: '$9.99' },
  ];
  const categories = ['Main Course (24)', 'Drinks (12)', 'Appetizers (18)', 'Desserts (10)'];

  return (
    <div style={{ background: '#0d1117', fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>
      {/* top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg,#F5B301,#c98f00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🍽</div>
          <div>
            <div style={{ color: '#F5B301', fontWeight: 700, fontSize: 9 }}>Delicious Food</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7 }}>Restaurant Management</div>
          </div>
        </div>
        <div style={{ background: 'rgba(245,179,1,0.15)', border: '1px solid rgba(245,179,1,0.3)', borderRadius: 20, padding: '3px 8px', fontSize: 8, color: '#F5B301', fontWeight: 600 }}>Restaurant Owner</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>🔔</div>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#374151' }} />
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* sidebar */}
        <div style={{ width: 80, background: '#111827', padding: '10px 6px', borderRight: '1px solid rgba(255,255,255,0.05)', minHeight: 260 }}>
          {[
            { icon: '🏠', label: 'Dashboard' },
            { icon: '📦', label: 'Orders' },
            { icon: '📋', label: 'Menus', active: true },
            { icon: '🏷', label: 'Categories' },
            { icon: '👥', label: 'Customers' },
            { icon: '📊', label: 'Reports' },
            { icon: '⚙️', label: 'Settings' },
          ].map(({ icon, label, active }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 6px', borderRadius: 6, marginBottom: 2, background: active ? '#F5B301' : 'transparent', cursor: 'pointer' }}>
              <span style={{ fontSize: 10 }}>{icon}</span>
              <span style={{ fontSize: 8, color: active ? '#000' : 'rgba(255,255,255,0.55)', fontWeight: active ? 700 : 400 }}>{label}</span>
            </div>
          ))}

          {/* need help box */}
          <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 14, marginBottom: 3 }}>🎧</div>
            <div style={{ color: '#fff', fontSize: 7, fontWeight: 600, marginBottom: 2 }}>Need Help?</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 6, lineHeight: 1.4 }}>Our support team is here to help you.</div>
            <div style={{ color: '#F5B301', fontSize: 7, marginTop: 4, cursor: 'pointer' }}>Contact Support →</div>
          </div>
        </div>

        {/* main */}
        <div style={{ flex: 1, padding: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Menu Management</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>↻</div>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>≡</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8 }}>
            {/* categories */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 6 }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: 600, marginBottom: 6 }}>Categories</div>
              {categories.map((c, i) => (
                <div key={c} style={{ padding: '4px 6px', borderRadius: 6, marginBottom: 3, background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent', cursor: 'pointer' }}>
                  <span style={{ fontSize: 8, color: i === 0 ? '#F5B301' : 'rgba(255,255,255,0.55)', fontWeight: i === 0 ? 700 : 400 }}>{c}</span>
                </div>
              ))}
            </div>

            {/* menu items */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: 600 }}>Menu Items</span>
                <div style={{ background: '#F5B301', borderRadius: 20, padding: '2px 7px', fontSize: 7, fontWeight: 700, color: '#000' }}>+ Add Item</div>
              </div>
              {menuItems.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1f2937', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: 8, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7 }}>{item.desc}</div>
                  </div>
                  <div style={{ color: '#F5B301', fontSize: 8, fontWeight: 700 }}>{item.price}</div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 6px', fontSize: 7, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Edit</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tablet 2: Customer — Explore Restaurants ─────────────────
function TabletExploreRestaurants() {
  const pills = ['All', 'Pizza', 'Burgers', 'Italian', 'Desserts', 'More'];
  const cards = [
    { name: 'The Green Bowl', rating: '4.4 (230)', time: '25-30 min', img: IMG_REST_GREEN_BOWL },
    { name: 'Spice Route',    rating: '4.6 (180)', time: '30-35 min', img: IMG_REST_SPICE_ROUTE },
    { name: 'Pizza Point',    rating: '4.7 (210)', time: '20-25 min', img: IMG_REST_PIZZA_POINT },
    { name: 'Burger House',   rating: '4.9 (160)', time: '25-30 min', img: IMG_REST_BURGER_HOUSE },
    { name: 'Ocean Delight',  rating: '4.4 (130)', time: '30-35 min', img: IMG_REST_OCEAN_DELIGHT },
  ];

  return (
    <div style={{ background: '#0d1117', fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>
      {/* top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>←</div>
        <div style={{ background: 'rgba(245,179,1,0.12)', border: '1px solid rgba(245,179,1,0.3)', borderRadius: 20, padding: '3px 10px', fontSize: 9, color: '#F5B301', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9 }}>👤</span> Customer
        </div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span>📍</span> New York, USA <span>▾</span>
        </div>
      </div>

      <div style={{ padding: 10 }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Explore Restaurants</div>

        {/* search */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>🔍</span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>Search for restaurants or cuisines...</span>
        </div>

        {/* pills */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
          {pills.map((p, i) => (
            <div key={p} style={{ padding: '3px 9px', borderRadius: 20, background: i === 0 ? '#F5B301' : 'transparent', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)', fontSize: 8, color: i === 0 ? '#000' : 'rgba(255,255,255,0.6)', fontWeight: i === 0 ? 700 : 400, cursor: 'pointer' }}>
              {p}
            </div>
          ))}
        </div>

        {/* restaurant grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {cards.map((c) => (
            <div key={c.name} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 50 }}>
                <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 3, right: 3, width: 14, height: 14, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7 }}>♡</div>
              </div>
              <div style={{ padding: '4px 5px' }}>
                <div style={{ color: '#fff', fontSize: 7, fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.5, color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ color: '#F5B301' }}>★ {c.rating}</span>
                  <span>{c.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom nav */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6px 0' }}>
        {[{ icon: '🏠', label: 'Home', active: true }, { icon: '📋', label: 'Orders' }, { icon: '📍', label: 'Track Order' }, { icon: '👤', label: 'Profile' }].map(({ icon, label, active }) => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 11 }}>{icon}</span>
            <span style={{ fontSize: 7, color: active ? '#F5B301' : 'rgba(255,255,255,0.4)', fontWeight: active ? 700 : 400 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tablet 3: Customer — Track Order ─────────────────────────
function TabletTrackOrder() {
  const steps = [
    { label: 'Order Placed', done: true  },
    { label: 'Confirmed',    done: true  },
    { label: 'Preparing',    done: true  },
    { label: 'On The Way',   active: true },
    { label: 'Delivered',    done: false },
  ];

  return (
    <div style={{ background: '#0d1117', fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>
      {/* top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>←</div>
        <div style={{ background: 'rgba(245,179,1,0.12)', border: '1px solid rgba(245,179,1,0.3)', borderRadius: 20, padding: '3px 10px', fontSize: 9, color: '#F5B301', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>👤</span> Customer
        </div>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>2</div>
      </div>

      <div style={{ padding: 10 }}>
        {/* header */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 10px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>Track Order</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, marginTop: 1 }}>Order on May 15, 2024 at 7:30 PM</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7 }}>Estimated Delivery</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>30-35 min</div>
            </div>
          </div>

          {/* steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 10, left: '50%', width: '100%', height: 1.5, background: s.done ? '#F5B301' : 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                )}
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${s.active ? '#F5B301' : s.done ? '#F5B301' : 'rgba(255,255,255,0.2)'}`, background: s.active ? '#F5B301' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, zIndex: 1, position: 'relative' }}>
                  {s.done && !s.active && <span style={{ color: '#F5B301' }}>✓</span>}
                  {s.active && <span style={{ fontSize: 9 }}>🛵</span>}
                </div>
                <div style={{ fontSize: 6, color: s.active ? '#F5B301' : 'rgba(255,255,255,0.5)', fontWeight: s.active ? 700 : 400, marginTop: 3, textAlign: 'center' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* order items + map */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 8 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 9, marginBottom: 8 }}>Order Items</div>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8 }}>1 x Margherita Pizza</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 600 }}>$10.99</span>
            </div>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8 }}>2 x Coca Cola</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 600 }}>$4.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>Total</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>$14.99</span>
            </div>
          </div>

          {/* map placeholder */}
          <div style={{ background: '#0f172a', borderRadius: 10, overflow: 'hidden', position: 'relative', minHeight: 100 }}>
            {/* grid lines */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </g>
              ))}
              {/* route */}
              <path d="M20 80 Q30 60 45 55 Q60 50 80 35" stroke="#F5B301" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="20" cy="80" r="3" fill="#F5B301" />
              <circle cx="45" cy="55" r="2.5" fill="#F5B301" />
              <circle cx="80" cy="35" r="3" fill="#ef4444" />
            </svg>
            {/* store icon */}
            <div style={{ position: 'absolute', top: '28%', left: '30%', width: 14, height: 14, borderRadius: 3, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>🏪</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────
export default function LandingPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const bg        = dark ? '#070B14' : '#f8f5f0';
  const sectionAlt = dark ? '#0B1020' : '#ffffff';
  const textSub   = dark ? 'rgba(255,255,255,0.6)' : '#666';

  // Hero-specific colors — stay light in both modes because hero has a dark overlay over the bg image
  const heroText = dark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.92)';
  const heroTextMuted = dark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.75)';
  const heroOverlay = dark ? 'rgba(7,11,20,0.7)' : 'rgba(0,0,0,0.55)';

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: bg }}>
      <Navbar />

      {/* Main content wrapper — high z-index so it scrolls over the fixed footer */}
      <main className="relative z-10 w-full min-h-[120vh]" style={{ background: bg }}>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 70 }}
      >
        {/* Full-screen background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMG_HERO_BG}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: heroOverlay }} />
        </div>

        {/* Animated SVG path lines overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.35] dark:opacity-[0.5]">
          <BackgroundPaths />
        </div>

        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: dark
              ? 'radial-gradient(ellipse at 15% 50%, rgba(245,179,1,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 15%, rgba(139,26,26,0.1) 0%, transparent 55%)'
              : 'radial-gradient(ellipse at 20% 50%, rgba(245,179,1,0.12) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <motion.div {...fadeUp(0.05)} className="mb-5">
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2"
                  style={{ border: '1px solid rgba(245,179,1,0.4)', background: 'rgba(245,179,1,0.08)', color: '#F5B301' }}
                >
                  <Sparkles size={13} />
                  All-in-one Restaurant Management System
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.15)}
                className="font-display font-black leading-[1.08] mb-4"
                style={{ fontSize: 'clamp(36px, 4.5vw, 62px)' }}
              >
                Powering{' '}
                <span style={{ color: heroText }}>
                  Restaurants.
                </span>
                <br />
                <span className="gradient-text">Delighting Customers.</span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.25)}
                className="text-lg leading-relaxed mb-10 max-w-[480px]"
                style={{ color: heroTextMuted }}
              >
                Delicious Food is a complete platform that helps restaurants
                manage, grow, and serve better — from dashboard to doorstep.
              </motion.p>

              {/* value props row */}
              <motion.div
                {...fadeUp(0.3)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
              >
                {HERO_FEATURES.map(({ Icon, title, sub }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,179,1,0.15)' }}
                    >
                      <Icon size={17} color="#F5B301" />
                    </div>
                    <div>
                      <div className="font-bold text-xs mb-0.5" style={{ color: heroText }}>{title}</div>
                      <div className="text-xs leading-snug" style={{ color: heroTextMuted }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons — Two role-based buttons */}
              <motion.div {...fadeUp(0.35)} className="flex flex-wrap gap-4 mb-12">
                <BtnPrimary
                  onClick={() => navigate('/signup?role=owner')}
                  style={{
                    fontSize: 15,
                    padding: '14px 28px',
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <StoreIcon size={18} />
                  Join as Restaurant Owner
                </BtnPrimary>
                <BtnOutline
                  dark={dark}
                  onClick={() => navigate('/signup?role=customer')}
                  style={{
                    fontSize: 15,
                    padding: '14px 28px',
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <UserPlus size={18} />
                  Join as Customer
                </BtnOutline>
              </motion.div>

              {/* mini stats */}
              <motion.div {...fadeUp(0.45)} className="flex gap-10">
                {HERO_STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div
                      className="font-display font-extrabold"
                      style={{ fontSize: 26, color: '#F5B301' }}
                    >
                      {value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: heroTextMuted }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — main dashboard + food bg */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              {/* glow blob */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: 'radial-gradient(ellipse, rgba(245,179,1,0.12) 0%, transparent 70%)' }}
              />

              {/* food background image top-right */}
              <div
                className="absolute -top-10 -right-10 w-[55%] h-[55%] rounded-2xl overflow-hidden"
                style={{ zIndex: 0, opacity: 0.85 }}
              >
                <img
                  src={IMG_HERO_BG}
                  alt="food"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* admin dashboard mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative z-10"
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  marginTop: 80,
                }}
              >
                <DashboardMockup />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3 TABLETS SECTION
      ════════════════════════════════════════════════════ */}
      <section className="py-20 overflow-hidden" style={{ background: bg }}>
        <div className="max-w-[1280px] mx-auto px-6">

          {/* 3-tablet layout */}
          <div
            className="relative flex items-end justify-center"
            style={{ gap: 0, minHeight: 340 }}
          >
            {/* LEFT tablet — Restaurant Owner Menu Mgmt */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotate: -4 }}
              whileInView={{ opacity: 1, x: 0, rotate: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ zIndex: 1, flexShrink: 0, width: 300, marginRight: -30, marginBottom: 0 }}
            >
              <TabletFrame style={{ transform: 'rotate(-4deg)', transformOrigin: 'bottom center' }}>
                <TabletMenuManagement />
              </TabletFrame>
            </motion.div>

            {/* CENTER tablet — Customer Explore */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ zIndex: 10, flexShrink: 0, width: 340 }}
            >
              <TabletFrame style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
                <TabletExploreRestaurants />
              </TabletFrame>
            </motion.div>

            {/* RIGHT tablet — Customer Track Order */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 4 }}
              whileInView={{ opacity: 1, x: 0, rotate: 4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ zIndex: 1, flexShrink: 0, width: 300, marginLeft: -30, marginBottom: 0 }}
            >
              <TabletFrame style={{ transform: 'rotate(4deg)', transformOrigin: 'bottom center' }}>
                <TabletTrackOrder />
              </TabletFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          BOTTOM FEATURES BAR
      ════════════════════════════════════════════════════ */}
      <section className="py-14" style={{ background: sectionAlt }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
            style={{
              border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            {BOTTOM_FEATURES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex items-start gap-4 p-7"
                style={{
                  borderRight: i < BOTTOM_FEATURES.length - 1
                    ? `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`
                    : 'none',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(245,179,1,0.12)', border: '1px solid rgba(245,179,1,0.2)' }}
                >
                  <Icon size={22} color="#F5B301" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">{title}</div>
                  <div
                    className="text-xs leading-relaxed whitespace-pre-line"
                    style={{ color: textSub }}
                  >
                    {desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          RESTAURANTS
      ════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: bg }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Tag>✦ Explore</Tag>
              <h2
                className="font-display font-extrabold mt-3"
                style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
              >
                Top <span className="gradient-text">Restaurants</span>
              </h2>
            </motion.div>
            <BtnPrimary style={{ padding: '10px 24px', fontSize: 14 }}>View All</BtnPrimary>
          </div>

          {/* category pills */}
          <div className="flex gap-2.5 mb-8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full font-medium text-sm cursor-pointer transition-all duration-200"
                style={{
                  padding: '8px 20px',
                  fontFamily: 'inherit',
                  background: activeCategory === cat ? '#F5B301' : 'transparent',
                  color: activeCategory === cat ? '#000' : dark ? 'rgba(255,255,255,0.65)' : '#555',
                  border: activeCategory === cat ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.12)' : '#e2e2e2'}`,
                  fontWeight: activeCategory === cat ? 700 : 500,
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {RESTAURANTS.map((r, i) => (
              <RestaurantCard key={r.name} {...r} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ROLES
      ════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: sectionAlt }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold" style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}>
              Built for <span className="gradient-text">Every Role</span>
            </h2>
            <p className="mt-3 text-base" style={{ color: textSub }}>
              Tailored dashboards for Super Admins, Restaurant Owners & Customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Store,       label: 'Restaurant Owner', desc: 'Menu management, order tracking, customer insights & revenue reports.',   color: '#F5B301' },
              { Icon: UserCircle2, label: 'Customer',         desc: 'Browse restaurants, place orders, track delivery live on the map.',        color: '#22c55e' },
              { Icon: Settings2,   label: 'Super Admin',      desc: 'Approve restaurants, manage the platform, monitor analytics & settings.', color: '#a855f7' },
            ].map(({ Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${dark ? 'glass-dark' : 'glass-light'}`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={30} color={color} />
                </div>
                <div className="font-bold text-lg mb-3" style={{ color }}>{label}</div>
                <p className="text-sm leading-relaxed" style={{ color: textSub }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS — Circular Carousel
      ════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: sectionAlt }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <Tag>✦ Testimonials</Tag>
            <h2 className="font-display font-extrabold mt-4" style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}>
              Loved by Restaurants <span className="gradient-text">&amp; Customers</span>
            </h2>
          </motion.div>

          <div className="flex items-center justify-center">
            <CircularTestimonials
              testimonials={TESTIMONIALS}
              autoplay={true}
              colors={dark ? {
                name: "#f7f7ff",
                designation: "#e1e1e1",
                testimony: "#f1f1f7",
                arrowBackground: "#0582CA",
                arrowForeground: "#141414",
                arrowHoverBackground: "#f7f7ff",
              } : {
                name: "#0a0a0a",
                designation: "#454545",
                testimony: "#171717",
                arrowBackground: "#141414",
                arrowForeground: "#f1f1f7",
                arrowHoverBackground: "#00A6FB",
              }}
              fontSizes={{
                name: "28px",
                designation: "20px",
                quote: "20px",
              }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════ */}
      <section
        className="py-24 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(245,179,1,0.09), rgba(139,26,26,0.07))' }}
      >
        <div className="max-w-[680px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display font-black mb-5"
              style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
            >
              Ready to grow your{' '}
              <span className="gradient-text">restaurant?</span>
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: textSub }}>
              Join 245+ restaurants already using Delicious Food to reach more customers and boost revenue.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <BtnPrimary
                onClick={() => navigate('/signup?role=owner')}
                style={{ fontSize: 16, padding: '16px 40px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <StoreIcon size={18} />
                Join as Owner <ArrowRight size={16} />
              </BtnPrimary>
              <BtnOutline
                dark={dark}
                onClick={() => navigate('/login')}
                style={{ fontSize: 16, padding: '16px 36px' }}
              >
                Sign In
              </BtnOutline>
            </div>
          </motion.div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
