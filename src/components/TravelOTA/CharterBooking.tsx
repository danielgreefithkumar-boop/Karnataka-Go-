import React, { useState } from 'react';
import { CharterItem } from '../../types';
import { MOCK_CHARTERS } from '../../data/mockData';
import { Plane, Compass, Users, Gauge, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CharterBookingProps {
  onBookCharter: (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => void;
  onAddToCart: (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => void;
}

export const CharterBooking: React.FC<CharterBookingProps> = ({
  onBookCharter,
  onAddToCart,
}) => {
  const [originAirfield, setOriginAirfield] = useState('Bengaluru HAL Airport (VOBG)');
  const [destAirfield, setDestAirfield] = useState('Belagavi Sambra Airfield (VOBM)');
  const [flightDate, setFlightDate] = useState('2026-11-08');
  const [passengers, setPassengers] = useState(4);
  const [flightHours, setFlightHours] = useState(2.0);

  const airfields = [
    { code: 'VOBG', name: 'Bengaluru HAL Airport (VOBG)', city: 'Bengaluru Core' },
    { code: 'VOBL', name: 'Kempegowda Intl VIP Apron (VOBL)', city: 'Bengaluru North' },
    { code: 'VOJK', name: 'Jakkur Aerodrome (VOJK)', city: 'Bengaluru Private' },
    { code: 'VOML', name: 'Mangaluru Intl VIP Bay (VOML)', city: 'Mangaluru' },
    { code: 'VOBM', name: 'Belagavi Sambra Airfield (VOBM)', city: 'Belagavi' },
    { code: 'VAHB', name: 'Hubballi Airport VIP (VAHB)', city: 'Hubballi-Dharwad' },
    { code: 'VOMY', name: 'Mysuru Mandakalli (VOMY)', city: 'Mysuru' },
    { code: 'VOJV', name: 'Jindal Vijayanagar Toranagallu (VOJV)', city: 'Ballari / Hampi' },
    { code: 'VAGO', name: 'Goa Dabolim Naval VIP (VAGO)', city: 'Goa Coastal' },
  ];

  return (
    <div className="space-y-6">
      {/* Configurator Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0C1E33] text-base">Karnataka Executive Aviation & Private Charters</span>
              <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200 font-mono px-2 py-0.5 rounded font-bold">
                DGCA Non-Scheduled Operator (NSOP)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct airfield ramp access at HAL, Jakkur, Jindal with corporate handling and VIP lounges
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Aircraft Ramp Clearances</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Departure Airfield (FBO)
            </label>
            <select
              value={originAirfield}
              onChange={(e) => setOriginAirfield(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {airfields.map((f) => (
                <option key={f.code} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Destination Airfield
            </label>
            <select
              value={destAirfield}
              onChange={(e) => setDestAirfield(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {airfields.map((f) => (
                <option key={f.code} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Flight Date & Time
            </label>
            <input
              type="date"
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              VIP Passengers & Block Hours
            </label>
            <div className="flex items-center gap-2">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {[1, 2, 4, 6, 8].map((p) => (
                  <option key={p} value={p}>
                    {p} Pax
                  </option>
                ))}
              </select>
              <span className="text-slate-300">|</span>
              <select
                value={flightHours}
                onChange={(e) => setFlightHours(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-blue-900 focus:outline-none cursor-pointer"
              >
                <option value={1.5}>1.5 Block Hrs</option>
                <option value={2.0}>2.0 Block Hrs</option>
                <option value={3.0}>3.0 Block Hrs</option>
                <option value={4.0}>4.0 Block Hrs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_CHARTERS.map((charter) => {
          const estimatedCost = Math.round(charter.hourlyRate * flightHours);
          const gstAndHandling = Math.round(estimatedCost * 0.18);
          const totalEstimate = estimatedCost + gstAndHandling;

          return (
            <div
              key={charter.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Aircraft image & badge */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={charter.image}
                    alt={charter.model}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-blue-950 shadow-xs border border-slate-200">
                    {charter.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0F2942]/90 text-amber-400 px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow-xs">
                    Base: {charter.homeBase.split(' ')[0]}
                  </div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-xl font-extrabold">{charter.model}</h3>
                    <p className="text-xs text-slate-200">{charter.manufacturer}</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Max Capacity</span>
                      <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-blue-900" />
                        {charter.maxPassengers} Guests
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Cruise Speed</span>
                      <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                        <Gauge className="w-3 h-3 text-blue-900" />
                        {charter.speedKnots} kts
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Max Range</span>
                      <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                        <Compass className="w-3 h-3 text-blue-900" />
                        {charter.rangeKm} km
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Executive Cabin Features:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {charter.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Crew: <strong className="text-slate-800">{charter.crew}</strong>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{totalEstimate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">({flightHours} hrs)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Base rate ₹{charter.hourlyRate.toLocaleString('en-IN')}/hr + 18% GST & Ground Handling
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(charter, originAirfield, destAirfield, flightDate, passengers, totalEstimate)}
                    className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Add Charter to Cart"
                  >
                    + Cart
                  </button>
                  <button
                    onClick={() => onBookCharter(charter, originAirfield, destAirfield, flightDate, passengers, totalEstimate)}
                    className="px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <span>Reserve Flight</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
