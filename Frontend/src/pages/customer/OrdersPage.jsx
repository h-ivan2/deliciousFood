import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  ShoppingBag,
  Clock,
  Check,
  XCircle,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { customerService, authService } from '../../services/api';

const ORDER_STEPS = [
  { status: 'pending', label: 'Order Placed', icon: '📝' },
  { status: 'confirmed', label: 'Confirmed', icon: '✓' },
  { status: 'preparing', label: 'Preparing', icon: '🍳' },
  { status: 'out_for_delivery', label: 'On The Way', icon: '🛵' },
  { status: 'delivered', label: 'Delivered', icon: '🎁' }
];

export default function OrdersPage() {
  const location = useLocation();
  
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // WebSocket connection state
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    // Connect to Express Socket.IO server (strip the /api/v1 suffix from the API URL)
    const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('🔌 Customer socket connected:', socket.id);
      socket.emit('join_room', `user_${user._id}`);
    });

    socket.on('order_status_update', (data) => {
      console.log('⚡ Order status update received:', data);
      
      // Update selected order if it is the one updated
      setSelectedOrder((prev) => {
        if (prev && prev._id === data.orderId) {
          return { ...prev, status: data.status };
        }
        return prev;
      });

      // Update in general orders list
      setOrders((prev) => 
        prev.map((o) => (o._id === data.orderId ? { ...o, status: data.status } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const list = await customerService.getMyOrders();
        setOrders(list);

        // Pre-select order if sent from state, otherwise select first order
        const stateOrderId = location.state?.selectedOrderId;
        if (stateOrderId) {
          const found = list.find((o) => o._id === stateOrderId);
          if (found) setSelectedOrder(found);
        } else if (list.length > 0) {
          setSelectedOrder(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [location.state]);

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Reason for cancellation:", "Change of plans");
    if (reason === null) return; // cancelled prompt
    
    try {
      await customerService.cancelOrder(orderId, reason);
      
      // Update local state
      setSelectedOrder((prev) => prev && prev._id === orderId ? { ...prev, status: 'cancelled' } : prev);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert(err.message || 'Error cancelling order');
    }
  };

  const getStepIndex = (status) => {
    return ORDER_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : -1;
  const isCancelled = selectedOrder?.status === 'cancelled';

  return (
    <div className="flex h-[calc(100vh-70px)] overflow-hidden">
      {/* ─── LEFT ORDERS DIRECTORY ─── */}
      <div className="w-[360px] border-r border-gray-100 flex flex-col p-6 bg-white overflow-y-auto">
        <h2 className="font-extrabold text-base text-gray-800 uppercase tracking-wider mb-1">Your Orders</h2>
        <p className="text-[10px] text-gray-400 font-bold mb-6">Track your active orders and review order history.</p>

        <div className="flex flex-col gap-4 flex-1">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={40} className="text-gray-200 mb-2 mx-auto" />
              <p className="text-xs text-gray-400 font-bold">No orders placed yet</p>
            </div>
          ) : (
            orders.map((ord) => {
              const isSelected = selectedOrder?._id === ord._id;
              const formattedDate = new Date(ord.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const isOrdCancelled = ord.status === 'cancelled';

              return (
                <div
                  key={ord._id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 bg-white text-left ${
                    isSelected
                      ? 'border-amber-500 shadow-sm ring-2 ring-amber-500/10'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-xl shadow-sm border border-gray-100">
                    🍔
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-[12px] text-gray-800 truncate leading-snug">
                        {ord.restaurant?.name || 'The Green Bowl'}
                      </h4>
                      <span className="text-[9px] font-black text-gray-400 ml-1 whitespace-nowrap">
                        {ord.orderNumber || 'DF-1234'}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">{formattedDate}</p>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-50">
                      <span className="text-[10px] font-black text-amber-500">${ord.totalAmount?.toFixed(2)}</span>
                      <span
                        className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isOrdCancelled
                            ? 'text-red-500 bg-red-50 border-red-100/30'
                            : ord.status === 'delivered'
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-100/30'
                            : 'text-amber-500 bg-amber-50 border-amber-100/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── RIGHT TRACKER DETAILS PANEL ─── */}
      <div className="flex-1 bg-white overflow-y-auto flex flex-col">
        {selectedOrder ? (
          <div className="p-8 max-w-3xl w-full mx-auto flex flex-col gap-6 text-left">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-5">
              <div>
                <h1 className="font-display font-black text-lg text-gray-800">Track Order</h1>
                <p className="text-[10px] text-gray-400 font-bold mt-1">
                  Order placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Estimated Delivery</div>
                <div className="text-lg font-black text-gray-800 mt-1">30-35 min</div>
              </div>
            </div>

            {/* Stepper visual bar */}
            {!isCancelled ? (
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-6">
                <div className="flex items-center justify-between relative">
                  {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isActive = idx === currentStepIdx;
                    const isFuture = idx > currentStepIdx;
                    
                    return (
                      <div key={step.status} className="flex-1 flex flex-col items-center relative z-10">
                        {/* Connecting Line */}
                        {idx < ORDER_STEPS.length - 1 && (
                          <div 
                            className={`absolute top-4 left-[50%] right-[-50%] h-[2px] z-0 transition-colors duration-300 ${
                              idx < currentStepIdx ? 'bg-amber-500' : 'bg-gray-200'
                            }`}
                          />
                        )}

                        {/* Step Bubble */}
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-black text-xs z-10 ${
                            isActive 
                              ? 'bg-amber-500 text-black border-amber-500 shadow-md scale-115 ring-4 ring-amber-500/10'
                              : isCompleted 
                              ? 'bg-white text-amber-500 border-amber-500' 
                              : 'bg-white text-gray-300 border-gray-200'
                          }`}
                        >
                          {isCompleted ? <Check size={14} strokeWidth={3} /> : step.icon}
                        </div>
                        <span 
                          className={`text-[9px] font-black uppercase tracking-wider mt-2.5 transition-colors ${
                            isActive ? 'text-amber-500' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-red-50 border border-red-100 rounded-3xl text-left flex items-start gap-4 text-red-700">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs">Order Cancelled</h4>
                  <p className="text-[10px] font-medium leading-relaxed mt-1">
                    This order was cancelled. Reason: {selectedOrder.cancelReason || 'Customer requested cancellation.'}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items Summary and Delivery details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items Card */}
              <div className="border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider mb-4">Order Items</h3>
                <div className="flex flex-col gap-3.5 divide-y divide-gray-50">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-bold pt-3.5 first:pt-0">
                      <span className="text-gray-500">{item.quantity} x {item.name || 'Margherita Pizza'}</span>
                      <span className="text-gray-700">${((item.price || 14.99) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs font-black text-gray-800 pt-4 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-amber-500">${selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
                <div>
                  <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider mb-3">Delivery Information</h3>
                  <div className="flex gap-3 text-xs font-medium text-gray-500">
                    <span className="text-amber-500 mt-0.5"><Truck size={15} /></span>
                    <div>
                      <div className="font-extrabold text-gray-700">Type: {selectedOrder.orderType === 'delivery' ? 'Home Delivery' : 'Dine-in Reservation'}</div>
                      {selectedOrder.orderType === 'delivery' && (
                        <p className="text-[11px] leading-relaxed mt-1 text-gray-400">{selectedOrder.deliveryAddress || '123 Green Street, Kigali'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancel Trigger for Active Orders */}
                {['pending', 'confirmed'].includes(selectedOrder.status) && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 font-extrabold text-xs py-3 rounded-2xl cursor-pointer transition-colors mt-auto flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10">
            <ShoppingBag size={48} className="text-gray-200 mb-2" />
            <h3 className="font-extrabold text-sm text-gray-500">Select an order to view status</h3>
          </div>
        )}
      </div>
    </div>
  );
}
