import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Grid,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { customerService } from '../../services/api';

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      try {
        const list = await customerService.getMyReservations();
        setReservations(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReservations();
  }, []);

  const handleCancelReservation = async (resId) => {
    if (window.confirm("Are you sure you want to cancel this table reservation?")) {
      try {
        await customerService.cancelReservation(resId);
        setReservations((prev) => 
          prev.map((r) => r._id === resId ? { ...r, status: 'cancelled' } : r)
        );
      } catch (err) {
        alert(err.message || 'Error cancelling reservation');
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 max-w-4xl w-full mx-auto min-h-screen text-left">
      <h1 className="font-display font-black text-2xl text-gray-800 mb-1">My Bookings</h1>
      <p className="text-xs text-gray-400 font-bold mb-8">Manage and view your upcoming and past table reservations.</p>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent animate-spin rounded-full" />
          <p className="text-xs text-gray-400 font-bold">Loading reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8">
          <Calendar size={48} className="text-gray-200 mb-3 mx-auto" />
          <h3 className="font-extrabold text-sm text-gray-500 mb-4">No Reservations Found</h3>
          <button
            onClick={() => navigate('/browse')}
            className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs px-6 py-3 rounded-2xl border-none cursor-pointer transition-colors shadow-sm"
          >
            Find a Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((res) => {
            const isCancelable = ['pending', 'confirmed'].includes(res.status);
            const isCancelled = res.status === 'cancelled';
            const isCompleted = res.status === 'completed';

            return (
              <div
                key={res._id}
                className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Restaurant Summary */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-800 leading-snug">
                        {res.restaurant?.name || 'The Green Bowl'}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">
                        {res.restaurant?.address || '123 Green Street, Kigali'}
                      </p>
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isCancelled
                          ? 'text-red-500 bg-red-50 border-red-100/30'
                          : isCompleted
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-100/30'
                          : 'text-amber-500 bg-amber-50 border-amber-100/30'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  {/* Booking details grid */}
                  <div className="grid grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500"><Calendar size={14} /></span>
                      <span>{formatDate(res.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500"><Clock size={14} /></span>
                      <span>{res.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500"><Users size={14} /></span>
                      <span>{res.partySize} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500"><Grid size={14} /></span>
                      <span>Table {res.table?.tableNumber || 'B2'}</span>
                    </div>
                  </div>
                </div>

                {/* Cancel Trigger */}
                {isCancelable && (
                  <button
                    onClick={() => handleCancelReservation(res._id)}
                    className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 font-extrabold text-[10px] py-3 rounded-2xl cursor-pointer transition-colors mt-6 flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={13} /> Cancel Reservation
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
