import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  ChevronLeft,
  Check,
  Table2,
  Sofa,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const TIME_SLOTS = [
  '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30',
  '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
];

const TABLE_PRESETS = [
  { id: 'small', label: 'Small (2 pax)', capacity: 2, icon: Table2 },
  { id: 'medium', label: 'Medium (4 pax)', capacity: 4, icon: Table2 },
  { id: 'large', label: 'Large (6 pax)', capacity: 6, icon: Table2 },
  { id: 'vip', label: 'VIP Booth (4 pax)', capacity: 4, icon: Sofa },
];

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getMaxDateString = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().split('T')[0];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

export default function TableReservation() {
  const navigate = useNavigate();
  const { setBookingDetails, bookingDetails } = useCart();

  const [date, setDate] = useState(getTodayString());
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState('medium');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState(null);

  const maxGuests = useMemo(() => {
    const table = TABLE_PRESETS.find((t) => t.id === selectedTable);
    return table ? table.capacity : 4;
  }, [selectedTable]);

  // Adjust guests if over max
  useMemo(() => {
    if (guests > maxGuests) setGuests(maxGuests);
  }, [maxGuests, guests]);

  const formattedDate = useMemo(() => {
    if (!date) return 'Not Selected';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [date]);

  const handleReserve = () => {
    if (!date || !selectedTime) return;
    setIsReserving(true);

    const reservation = {
      date,
      time: selectedTime,
      guests,
      tableType: selectedTable,
      specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookingDetails(reservation);

    setTimeout(() => {
      setIsReserving(false);
      setReservationConfirmed(reservation);
    }, 1200);
  };

  const handleNewReservation = () => {
    setReservationConfirmed(null);
    setSelectedTime(null);
    setSpecialRequests('');
    setGuests(2);
    setSelectedTable('medium');
    setDate(getTodayString());
  };

  // ─── CONFIRMATION VIEW ───
  if (reservationConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-600" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-2">Reservation Confirmed! 🎉</h2>
          <p className="text-xs text-gray-400 font-bold mb-8">
            Your table has been reserved. We look forward to serving you!
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Date</span>
              <span className="text-gray-800 font-extrabold">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Time</span>
              <span className="text-gray-800 font-extrabold">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Guests</span>
              <span className="text-gray-800 font-extrabold">{guests} {guests === 1 ? 'person' : 'people'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-bold">Table</span>
              <span className="text-gray-800 font-extrabold">
                {TABLE_PRESETS.find((t) => t.id === selectedTable)?.label || 'Medium'}
              </span>
            </div>
            {specialRequests && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold">Note</span>
                <span className="text-gray-800 font-bold max-w-[200px] text-right truncate">{specialRequests}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleNewReservation}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs py-3.5 rounded-2xl border-none cursor-pointer transition-colors shadow-sm"
            >
              Make Another Reservation
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs py-3.5 rounded-2xl border border-gray-100 cursor-pointer transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-500 transition-colors border-none bg-transparent cursor-pointer mb-6"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── LEFT: Reservation Form ─── */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight flex items-center gap-3">
                <UtensilsCrossed size={28} className="text-amber-500" />
                Reserve a Table
              </h1>
              <p className="text-xs text-gray-400 font-bold mt-1">
                Book your seat at your favorite restaurant
              </p>
            </div>

            {/* Date Picker */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <Calendar size={18} className="text-amber-500" />
                <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Select Date</h3>
              </div>
              <input
                type="date"
                value={date}
                min={getTodayString()}
                max={getMaxDateString()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-amber-500 transition-colors cursor-pointer [color-scheme:light]"
              />
              <p className="text-[10px] text-gray-400 font-bold mt-2">
                You can reserve up to 2 months in advance
              </p>
            </div>

            {/* Time Slots Grid */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <Clock size={18} className="text-amber-500" />
                <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Available Time Slots</h3>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5"
              >
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  const hour = parseInt(time.split(':')[0]);
                  const period = hour < 12 ? 'AM' : 'PM';
                  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

                  return (
                    <motion.button
                      key={time}
                      variants={itemVariants}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-2xl text-[11px] font-bold border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-100 hover:border-amber-300 hover:text-amber-600'
                      }`}
                    >
                      {displayHour}:{time.split(':')[1]} {period}
                    </motion.button>
                  );
                })}
              </motion.div>

              {selectedTime && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-amber-600 font-bold mt-3 flex items-center gap-1.5"
                >
                  <Check size={13} /> Selected: {selectedTime}
                </motion.p>
              )}
            </div>

            {/* Guest Count & Table Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Count */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <Users size={18} className="text-amber-500" />
                  <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Number of Guests</h3>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-amber-500 hover:border-amber-300 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-lg font-black">−</span>
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="text-2xl font-black text-gray-800">{guests}</span>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {guests === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                  <button
                    onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                    disabled={guests >= maxGuests}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-amber-500 hover:border-amber-300 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-lg font-black">+</span>
                  </button>
                </div>
              </div>

              {/* Table Type Selection */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <Table2 size={18} className="text-amber-500" />
                  <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Table Type</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {TABLE_PRESETS.map((table) => {
                    const isSelected = selectedTable === table.id;
                    const Icon = table.icon;
                    return (
                      <button
                        key={table.id}
                        onClick={() => {
                          setSelectedTable(table.id);
                          if (guests > table.capacity) setGuests(table.capacity);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-[10px] font-bold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 shadow-sm'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="leading-tight text-center">{table.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <MessageSquare size={18} className="text-amber-500" />
                <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Special Requests</h3>
              </div>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special occasion, dietary needs, seating preference, or additional notes..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-amber-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* ─── RIGHT: Reservation Summary ─── */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm sticky top-[90px]">
              <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Calendar size={16} className="text-amber-500" />
                Reservation Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={15} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-bold">Date</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-800">
                    {date ? formattedDate : 'Not Selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-bold">Time</span>
                  </div>
                  <span className={`text-xs font-extrabold ${selectedTime ? 'text-gray-800' : 'text-gray-300'}`}>
                    {selectedTime || 'Not Selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Users size={15} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-bold">Guests</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-800">
                    {guests} {guests === 1 ? 'person' : 'people'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Table2 size={15} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-bold">Table</span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-800">
                    {TABLE_PRESETS.find((t) => t.id === selectedTable)?.label || ''}
                  </span>
                </div>

                {specialRequests && (
                  <div className="flex items-start justify-between py-2.5 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={15} className="text-gray-400" />
                      <span className="text-xs text-gray-400 font-bold">Note</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 max-w-[160px] text-right truncate">
                      {specialRequests}
                    </span>
                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                disabled={!date || !selectedTime || isReserving}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-4 rounded-2xl border-none cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isReserving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Reserving...
                  </>
                ) : (
                  <>
                    <Calendar size={16} /> Confirm Reservation
                  </>
                )}
              </button>

              {/* Table Visual Layout */}
              <div className="bg-gray-50 rounded-2xl p-5 mt-6">
                <h4 className="font-extrabold text-[10px] text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Table Layout Preview
                </h4>
                <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                  {[1, 2, 3, 4, 5, 6].map((pos) => {
                    const isSelectedTable = String(pos) <= String(maxGuests);
                    return (
                      <div
                        key={pos}
                        className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                          isSelectedTable
                            ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                            : 'bg-gray-100 text-gray-300 border border-gray-100'
                        }`}
                      >
                        <UtensilsCrossed size={14} />
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] text-gray-400 font-bold text-center mt-3">
                  Selected table seats up to {maxGuests} guests
                </p>
              </div>

              {/* Policy */}
              <p className="text-[9px] text-gray-400 font-bold text-center mt-4 leading-relaxed">
                Free cancellation up to 2 hours before reservation.
                <br />Late arrivals may result in table reassignment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
