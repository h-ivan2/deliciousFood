import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, Bell, User } from 'lucide-react';
import { Logo } from '../../assets/images';

export default function UserDashboard() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <nav className="flex items-center justify-between px-12 py-6" style={{ background: cardBg }}>
        <Logo size="md" />
        <div className="flex-1 max-w-lg mx-8 relative">
          <Search className="absolute left-3 top-3 opacity-50" size={18} />
          <input type="text" placeholder="Search restaurants or dishes..." className="w-full py-2.5 pl-10 pr-4 rounded-xl border" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/browse')} className="px-6 py-2 bg-[#F5B301] rounded-full font-bold">Browse</button>
          <ShoppingCart size={24} />
          <User size={24} />
        </div>
      </nav>

      <div className="p-12">
        <h1 className="text-3xl font-black mb-6">Good Morning, John! 👋</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 p-8 rounded-3xl border shadow-sm" style={{ background: cardBg }}>
            <h2 className="text-xl font-bold mb-4">Popular Restaurants</h2>
            <div className="grid grid-cols-2 gap-4">
               {/* Restaurant Cards */}
               {[1, 2, 3, 4].map(i => <div key={i} className="p-4 border rounded-2xl">The Green Bowl</div>)}
            </div>
          </div>
          <div className="p-8 rounded-3xl border shadow-sm" style={{ background: cardBg }}>
            <h2 className="text-xl font-bold mb-4">Wallet Balance</h2>
            <div className="text-4xl font-black mb-4">$25.60</div>
            <button className="w-full py-3 bg-[#F5B301] rounded-full font-bold">Top Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
