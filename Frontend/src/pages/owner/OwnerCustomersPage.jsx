import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Search, Eye, MoreVertical } from 'lucide-react';

const CUSTOMERS = [
  { name: 'John Doe', email: 'john@example.com', totalOrders: 12, spent: '$245.60' },
  { name: 'Emily Smith', email: 'emily@example.com', totalOrders: 8, spent: '$180.20' },
];

export default function OwnerCustomersPage() {
  const { bg, cardBg, textTitle, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12" style={{ background: bg, color: textTitle }}>
      <h1 className="text-3xl font-black mb-8">Manage Customers</h1>
      <div className="p-8 rounded-3xl border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 opacity-50" size={18} />
            <input type="text" placeholder="Search customers..." className="w-full py-2.5 pl-10 pr-4 rounded-xl border outline-none" style={{ background: bg, borderColor: borderCol }} />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase opacity-60">
              <th className="text-left pb-4">Customer</th>
              <th className="text-left pb-4">Email</th>
              <th className="text-left pb-4">Total Orders</th>
              <th className="text-left pb-4">Total Spent</th>
              <th className="text-left pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.email} className="border-t" style={{ borderColor: borderCol }}>
                <td className="py-4 font-bold text-sm">{c.name}</td>
                <td className="py-4 text-sm">{c.email}</td>
                <td className="py-4 text-sm">{c.totalOrders}</td>
                <td className="py-4 font-bold text-sm">{c.spent}</td>
                <td className="py-4 flex gap-2"><Eye size={18} className="cursor-pointer opacity-60" /> <MoreVertical size={18} className="cursor-pointer opacity-60" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
