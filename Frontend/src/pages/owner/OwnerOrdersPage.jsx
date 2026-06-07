import { useState } from 'react';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Search, ChevronDown, Eye, MoreVertical } from 'lucide-react';

const ORDERS = [
  { id: '#ORD0256', customer: 'John Doe', items: '2 Items', total: '$24.99', status: 'Preparing', time: '2 min ago' },
  { id: '#ORD0254', customer: 'Jane Smith', items: '3 Items', total: '$32.00', status: 'On the way', time: '15 min ago' },
  { id: '#ORD0253', customer: 'Alex Johnson', items: '1 Item', total: '$12.99', status: 'Preparing', time: '30 min ago' },
];

export default function OwnerOrdersPage() {
  const { bg, cardBg, textTitle, textSub, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12" style={{ background: bg, color: textTitle }}>
      <h1 className="text-3xl font-black mb-8">Manage Orders</h1>
      <div className="p-8 rounded-3xl border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 opacity-50" size={18} />
            <input type="text" placeholder="Search orders..." className="w-full py-2.5 pl-10 pr-4 rounded-xl border outline-none" style={{ background: bg, borderColor: borderCol }} />
          </div>
          <button className="px-6 py-2.5 rounded-xl font-bold text-sm border" style={{ borderColor: borderCol }}>Export</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase opacity-60">
              <th className="text-left pb-4">Order ID</th>
              <th className="text-left pb-4">Customer</th>
              <th className="text-left pb-4">Items</th>
              <th className="text-left pb-4">Total</th>
              <th className="text-left pb-4">Status</th>
              <th className="text-left pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr key={order.id} className="border-t" style={{ borderColor: borderCol }}>
                <td className="py-4 font-bold text-sm">{order.id}</td>
                <td className="py-4 text-sm">{order.customer}</td>
                <td className="py-4 text-sm">{order.items}</td>
                <td className="py-4 font-bold text-sm">{order.total}</td>
                <td className="py-4 text-sm font-bold text-yellow-600">{order.status}</td>
                <td className="py-4 flex gap-2"><Eye size={18} className="cursor-pointer opacity-60 hover:opacity-100" /> <MoreVertical size={18} className="cursor-pointer opacity-60 hover:opacity-100" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
