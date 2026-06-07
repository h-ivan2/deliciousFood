import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Plus, Trash2, Edit3 } from 'lucide-react';

const MENU_ITEMS = [
  { id: 1, name: 'Grilled Chicken', category: 'Main Course', price: '$11.49', status: 'Available' },
  { id: 2, name: 'Burger Deluxe', category: 'Burger', price: '$8.99', status: 'Available' },
  { id: 3, name: 'Veggie Pizza', category: 'Pizza', price: '$9.75', status: 'Out of Stock' },
];

export default function OwnerMenuPage() {
  const { bg, cardBg, textTitle, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12" style={{ background: bg, color: textTitle }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Menu Management</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#F5B301] text-black font-bold rounded-full">
          <Plus size={18} /> Add New Item
        </button>
      </div>
      <div className="p-8 rounded-3xl border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase opacity-60"><th className="text-left pb-4">Item Name</th><th className="text-left pb-4">Category</th><th className="text-left pb-4">Price</th><th className="text-left pb-4">Status</th><th className="text-left pb-4">Actions</th></tr>
          </thead>
          <tbody>
            {MENU_ITEMS.map((item) => (
              <tr key={item.id} className="border-t" style={{ borderColor: borderCol }}>
                <td className="py-4 font-bold">{item.name}</td>
                <td className="py-4">{item.category}</td>
                <td className="py-4">{item.price}</td>
                <td className="py-4 text-green-600 font-bold">{item.status}</td>
                <td className="py-4 flex gap-3"><Edit3 size={18} className="cursor-pointer" /> <Trash2 size={18} className="cursor-pointer text-red-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
