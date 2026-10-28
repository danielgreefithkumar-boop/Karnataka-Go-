import React, { useState } from 'react';
import { TrainItem } from '../../types';
import { MOCK_TRAINS } from '../../data/mockData';
import { Train, Calendar, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface TrainBookingProps {
  onBookTrain: (train: TrainItem, selectedClass: TrainItem['classes'][0], quota: string) => void;
  onAddToCart: (train: TrainItem, selectedClass: TrainItem['classes'][0], quota: string) => void;
}

export const TrainBooking: React.FC<TrainBookingProps> = ({
  onBookTrain,
  onAddToCart,
}) => {
  const [quota, setQuota] = useState<'General' | 'Tatkal' | 'Ladies' | 'Senior'>('General');
  const [selectedStation, setSelectedStation] = useState('ALL');

  const quotas = [
    { id: 'General', label: 'General (GN)' },
    { id: 'Tatkal', label: 'Tatkal (TQ)' },
    { id: 'Ladies', label: 'Ladies (LD)' },
    { id: 'Senior', label: 'Senior Citizen (SS)' },
  ];

  return (
    <div className="space-y-6">
      {/* Quota & Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0C1E33] text-base">IRCTC Express & Vande Bharat Quotas</span>
              <span className="text-[10px] bg-red-50 text-red-800 border border-red-200 font-mono px-2 py-0.5 rounded font-bold">
                Direct PRS Gateway
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized direct agent integration with instant Indian Railways PNR generation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Booking Quota:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {quotas.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuota(q.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    quota === q.id
                      ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Boarding Node (Karnataka)
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Hubs (SBC Bengaluru, YPR, MAQ, BGM, UBL)</option>
              <option value="SBC">KSR Bengaluru City (SBC)</option>
              <option value="MAS">MGR Chennai Central (MAS)</option>
              <option value="DWR">Dharwad / Hubballi (DWR/UBL)</option>
              <option value="BGM">Belagavi Junction (BGM)</option>
              <option value="KAWR">Karwar / Mangaluru (KAWR)</option>
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Journey Date
            </label>
            <input
              type="date"
              defaultValue="2026-11-06"
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Agent Service Fee:</span>
              <span className="text-emerald-700 font-bold">₹0.00 (Standard)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Passenger Insurance:</span>
              <span>Included (₹0.45/pax)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {MOCK_TRAINS.map((train) => (
          <div
            key={train.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition shadow-xs hover:shadow-sm"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{train.trainName}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      #{train.trainNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Runs: {train.runningDays.join(', ')} • South Western Railway Express
                  </p>
                </div>
              </div>

              {/* Station Timings */}
              <div className="flex items-center gap-6 text-xs text-slate-700">
                <div className="text-right">
                  <span className="text-base font-black text-slate-900">{train.departureTime}</span>
                  <p className="text-slate-500 font-mono">{train.originCode} ({train.originStation})</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 font-mono">{train.duration}</span>
                  <div className="w-16 h-0.5 bg-slate-300 my-1 relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 absolute -top-0.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-base font-black text-slate-900">{train.arrivalTime}</span>
                  <p className="text-slate-500 font-mono">{train.destCode} ({train.destStation})</p>
                </div>
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {train.classes.map((cls) => {
                const isAvail = cls.status === 'AVAILABLE';
                const isRac = cls.status === 'RAC';
                return (
                  <div
                    key={cls.code}
                    className="bg-slate-50 border border-slate-200 hover:border-blue-900 rounded-xl p-3 flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{cls.code}</span>
                        <span className="text-xs font-mono font-bold text-blue-900">
                          ₹{quota === 'Tatkal' ? Math.round(cls.price * 1.25) : cls.price}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{cls.name}</p>

                      <div className="mt-2.5 mb-3">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                            isAvail
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isRac
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {cls.availability}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => onBookTrain(train, cls, quota)}
                        className="w-full py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onAddToCart(train, cls, quota)}
                        className="w-full py-1 text-[11px] text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition cursor-pointer"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
