import { useAdminTheme } from '../../hooks/useAdminTheme';
import { Calendar, Users, Clock } from 'lucide-react';

export default function TableReservation() {
  const { bg, cardBg, textTitle, borderCol } = useAdminTheme();

  return (
    <div className="p-8 lg:p-12 min-h-screen" style={{ background: bg, color: textTitle }}>
      <h1 className="text-3xl font-black mb-8">Seat & Table Reservation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl border flex flex-col gap-6" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="text-xl font-bold">Reservation Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 opacity-50" size={18} />
                <input type="date" className="w-full py-2.5 pl-10 pr-4 rounded-xl border outline-none" style={{ background: bg, borderColor: borderCol }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Select Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 opacity-50" size={18} />
                <input type="time" className="w-full py-2.5 pl-10 pr-4 rounded-xl border outline-none" style={{ background: bg, borderColor: borderCol }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Number of Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 opacity-50" size={18} />
                <input type="number" min="1" placeholder="4 guests" className="w-full py-2.5 pl-10 pr-4 rounded-xl border outline-none" style={{ background: bg, borderColor: borderCol }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 rounded-3xl border" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="text-xl font-bold mb-6">Reservation Summary</h2>
          <div className="flex flex-col gap-4 mb-6 text-sm">
            <div className="flex justify-between"><span>Date & Time</span><span className="font-bold">Not Selected</span></div>
            <div className="flex justify-between"><span>Guests</span><span className="font-bold">Not Selected</span></div>
          </div>
          <button className="w-full py-4 bg-[#F5B301] text-black font-bold rounded-full">Reserve Table</button>
        </div>
      </div>
    </div>
  );
}
