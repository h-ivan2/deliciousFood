import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Search, Filter, Star, Clock, Truck } from 'lucide-react';

const RESTAURANTS = [
  { id: 1, name: 'The Green Bowl', cuisine: 'Healthy, Salads', rating: 4.8, time: '30-40 min', delivery: '$2.99' },
  { id: 2, name: 'Pizza Point', cuisine: 'Italian, Pizza', rating: 4.7, time: '20-30 min', delivery: '$1.99' },
  { id: 3, name: 'Burger House', cuisine: 'Burgers, American', rating: 4.5, time: '10-20 min', delivery: '$1.99' },
];

export default function BrowseRestaurants() {
  const { bg, cardBg, textTitle, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12 min-h-screen" style={{ background: bg, color: textTitle }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Browse Restaurants</h1>
        <div className="flex gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 opacity-50" size={18} />
            <input type="text" placeholder="Search restaurants..." className="w-full py-2.5 pl-10 pr-4 rounded-xl border" style={{ background: cardBg, borderColor: borderCol }} />
          </div>
          <button className="px-6 py-2.5 rounded-xl border font-bold flex items-center gap-2" style={{ borderColor: borderCol }}><Filter size={18}/> Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {RESTAURANTS.map(r => (
          <div key={r.id} className="p-6 rounded-3xl border shadow-sm transition-transform hover:scale-[1.02]" style={{ background: cardBg, borderColor: borderCol }}>
            <div className="h-40 bg-gray-200 rounded-2xl mb-4" />
            <h3 className="text-lg font-black">{r.name}</h3>
            <p className="text-xs opacity-60 mb-3">{r.cuisine}</p>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1"><Star size={14} className="text-[#F5B301]" /> {r.rating}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {r.time}</span>
              <span className="flex items-center gap-1"><Truck size={14} /> {r.delivery}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
