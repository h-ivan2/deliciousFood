import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import {
  Utensils,
  Store,
  Users,
  BarChart3,
  Search,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ORDERS_DATA = [
  { name: 'Sun', orders: 120 },
  { name: 'Mon', orders: 150 },
  { name: 'Tue', orders: 100 },
  { name: 'Wed', orders: 160 },
  { name: 'Thu', orders: 200 },
  { name: 'Fri', orders: 180 },
  { name: 'Sat', orders: 140 },
];

const TOP_ITEMS = [
  { name: 'Grilled Chicken', orders: 120, price: '$11.49' },
  { name: 'Burger Deluxe', orders: 98, price: '$8.99' },
  { name: 'Veggie Pizza', orders: 75, price: '$9.75' },
  { name: 'Chocolate Shake', orders: 54, price: '$4.99' },
];

export default function OwnerDashboardHome() {
  const { bg, cardBg, textTitle, textSub, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12" style={{ background: bg, color: textTitle }}>
      <h1 className="text-3xl font-black mb-8">Welcome back, John! 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Orders', value: '156', Icon: ShoppingBag, color: '#F5B301' },
          { label: 'Total Customers', value: '320', Icon: Users, color: '#22c55e' },
          { label: 'Revenue', value: '$4,460', Icon: BarChart3, color: '#3b82f6' },
          { label: 'Pending Orders', value: '24', Icon: Utensils, color: '#ef4444' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="p-6 rounded-3xl border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
              <Icon size={20} color={color} />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-bold opacity-60 uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="text-lg font-black mb-6">Sales Overview</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ORDERS_DATA}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#F5B301" fill="#F5B301" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-3xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="text-lg font-black mb-6">Top Sold Items</h2>
          <div className="flex flex-col gap-4">
            {TOP_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <span className="font-bold text-sm">{item.name}</span>
                <span className="font-black text-sm">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
