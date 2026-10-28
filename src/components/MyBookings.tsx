import React from 'react';
import { OperatorRequest } from '../types';
import { 
  FileText, 
  Plane, 
  Train, 
  Bus, 
  Zap, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  ArrowRight
} from 'lucide-react';

interface MyBookingsProps {
  orders: OperatorRequest[];
  onViewDocument: (order: OperatorRequest) => void;
  onExploreMore: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  orders,
  onViewDocument,
  onExploreMore,
}) => {
  const getIcon = (type: OperatorRequest['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-blue-900" />;
      case 'train':
        return <Train className="w-5 h-5 text-red-700" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-emerald-700" />;
      case 'charter':
        return <Plane className="w-5 h-5 text-purple-700" />;
      case 'bbps':
        return <Zap className="w-5 h-5 text-amber-600" />;
      default:
        return <Boxes className="w-5 h-5 text-blue-700" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0C1E33]">My Active Bookings & GST Invoices</h2>
            <span className="text-xs bg-blue-50 text-blue-900 font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
              {orders.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment ledger: download boarding passes, IRCTC e-tickets, BBPS payment receipts, and GST invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreMore}
            className="px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <span>+ Book New Service</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Orders or Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't made any travel bookings or utility bill clearances yet. Use the top navigation to explore Flights, IRCTC Trains, Buses, Charters, BBPS, or Industrial Supplies.
          </p>
          <button
            onClick={onExploreMore}
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl inline-block mt-2 cursor-pointer shadow-xs"
          >
            Start Booking
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => {
            const isCompleted = ['PNR_ISSUED', 'CLEARED', 'DISPATCHED'].includes(order.status);
            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {getIcon(order.type)}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-900">
                          {order.bookingRef}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                          {order.serviceTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-slate-900 text-base">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">{order.createdAt}</span>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Sector / Account:</span>
                      <span className="font-semibold text-slate-900">{order.sectorOrAccount}</span>
                    </div>
                    {order.pnrNumber && (
                      <div className="flex justify-between text-slate-600">
                        <span>Official PNR / Code:</span>
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {order.pnrNumber}
                        </span>
                      </div>
                    )}
                    {order.seatOrBerth && (
                      <div className="flex justify-between text-slate-600">
                        <span>Seat / Berth:</span>
                        <span className="font-mono text-slate-900">{order.seatOrBerth}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed & Cleared
                      </span>
                    ) : (
                      <span className="text-xs text-amber-800 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Fulfillment in Progress
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onViewDocument(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-900" />
                    <span>View Pass / Invoice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
