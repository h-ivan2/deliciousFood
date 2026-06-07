import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Trash2, Plus, Minus } from 'lucide-react';

const ITEMS = [
  { id: 1, name: 'Pepperoni Pizza', size: 'Medium', price: 14.99, qty: 1 },
  { id: 2, name: 'Chocolate Shake', size: 'Medium', price: 4.99, qty: 1 },
];

export default function CheckoutPage() {
  const { bg, cardBg, textTitle, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12 min-h-screen" style={{ background: bg, color: textTitle }}>
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {ITEMS.map(item => (
            <div key={item.id} className="p-6 rounded-3xl border flex items-center justify-between" style={{ background: cardBg, borderColor: borderCol }}>
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs opacity-60">{item.size}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 border rounded-xl"><Minus size={14}/></button>
                <span className="font-bold">{item.qty}</span>
                <button className="p-2 border rounded-xl"><Plus size={14}/></button>
                <span className="font-black">${item.price}</span>
                <Trash2 size={18} className="cursor-pointer text-red-500" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 rounded-3xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">$19.98</span></div>
            <div className="flex justify-between text-sm"><span>Delivery</span><span className="font-bold">$2.99</span></div>
            <div className="flex justify-between text-lg font-black border-t pt-4"><span>Total</span><span>$22.97</span></div>
          </div>
          <button className="w-full py-4 bg-[#F5B301] text-black font-bold rounded-full">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
