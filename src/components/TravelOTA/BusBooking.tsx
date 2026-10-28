import React, { useState } from 'react';
import { BusItem, SeatInfo } from '../../types';
import { MOCK_BUSES } from '../../data/mockData';
import { BusSeatModal } from './BusSeatModal';
import { Bus, Star, MapPin, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BusBookingProps {
  onConfirmBusBooking: (bus: BusItem, selectedSeats: SeatInfo[], boarding: string, dropping: string) => void;
  onAddBusToCart: (bus: BusItem, selectedSeats: SeatInfo[], boarding: string, dropping: string) => void;
}

export const BusBooking: React.FC<BusBookingProps> = ({
  onConfirmBusBooking,
  onAddBusToCart,
}) => {
  const [selectedBusForSeats, setSelectedBusForSeats] = useState<BusItem | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleSeatModalConfirm = (
    bus: BusItem, 
    selectedSeats: SeatInfo[], 
    boarding: string, 
    dropping: string
  ) => {
    setSelectedBusForSeats(null);
    onConfirmBusBooking(bus, selectedSeats, boarding, dropping);
  };

  return (
    <div className="space-y-6">
      {/* Header Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0C1E33] text-base">Karnataka Intercity Sleeper Coaches</span>
              <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                KSRTC Airavat & Top Operators
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive Upper/Lower deck sleeper berth selection with live GPS tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Fleet Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-900 cursor-pointer"
            >
              <option value="ALL">All Coach Types</option>
              <option value="KSRTC">KSRTC Airavat Only</option>
              <option value="Sleeper">Multi-Axle Sleepers Only</option>
            </select>
          </div>
        </div>

        {/* Route Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Origin City
            </label>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-900" />
              <span>Bengaluru (All Hubs)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Destination City
            </label>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mangaluru / Belagavi / Hubli</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Boarding Date
            </label>
            <input
              type="date"
              defaultValue="2026-11-05"
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Guarantee:</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Operator Direct Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Bus Cards */}
      <div className="space-y-4">
        {MOCK_BUSES.map((bus) => (
          <div
            key={bus.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition shadow-xs hover:shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6"
          >
            {/* Operator and info */}
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{bus.operator}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{bus.busType}</span>
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {bus.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bus.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Timetable */}
            <div className="flex items-center justify-between flex-1 max-w-md px-2 sm:px-6">
              <div className="text-left">
                <span className="text-lg font-black text-slate-900">{bus.departureTime}</span>
                <p className="text-xs text-slate-500 font-medium">{bus.origin}</p>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-[10px] text-slate-500 font-mono">{bus.duration}</span>
                <div className="w-20 h-0.5 bg-slate-300 my-1 relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900 absolute -top-0.5 left-1/2 -translate-x-1/2"></div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">Overnight Express</span>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-slate-900">{bus.arrivalTime}</span>
                <p className="text-xs text-slate-500 font-medium">{bus.destination}</p>
              </div>
            </div>

            {/* Price & Sleeper layout button */}
            <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
              <div className="text-left lg:text-right">
                <span className="text-xs text-slate-500 block">Starting from</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  ₹{bus.startingPrice}
                </span>
                <span className="text-[10px] text-blue-900 block font-bold">
                  {bus.availableSeats} Berths Available
                </span>
              </div>

              <button
                onClick={() => setSelectedBusForSeats(bus)}
                className="px-5 py-3 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Select Seats / Berths</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Seat Modal */}
      {selectedBusForSeats && (
        <BusSeatModal
          bus={selectedBusForSeats}
          isOpen={!!selectedBusForSeats}
          onClose={() => setSelectedBusForSeats(null)}
          onConfirmSelection={handleSeatModalConfirm}
        />
      )}
    </div>
  );
};
