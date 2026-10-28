import React, { useState } from 'react';
import { BusItem, SeatInfo } from '../../types';
import { X, Check, Info, ShieldCheck, MapPin, User } from 'lucide-react';

interface BusSeatModalProps {
  bus: BusItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSelection: (bus: BusItem, selectedSeats: SeatInfo[], boardingPoint: string, droppingPoint: string) => void;
}

export const BusSeatModal: React.FC<BusSeatModalProps> = ({
  bus,
  isOpen,
  onClose,
  onConfirmSelection,
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<string>(bus.boardingPoints[0] || 'Majestic Kempegowda');
  const [droppingPoint, setDroppingPoint] = useState<string>(bus.droppingPoints[0] || 'Central Bus Stand');

  if (!isOpen) return null;

  const lowerSeats: SeatInfo[] = [
    { id: 'L1', number: 'L1', deck: 'lower', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 150, status: 'available' },
    { id: 'L2', number: 'L2', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'booked' },
    { id: 'L3', number: 'L3', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'female-reserved' },
    { id: 'L4', number: 'L4', deck: 'lower', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 150, status: 'available' },
    { id: 'L5', number: 'L5', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'available' },
    { id: 'L6', number: 'L6', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'available' },
    { id: 'L7', number: 'L7', deck: 'lower', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 150, status: 'booked' },
    { id: 'L8', number: 'L8', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'available' },
    { id: 'L9', number: 'L9', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'available' },
    { id: 'L10', number: 'L10', deck: 'lower', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 150, status: 'available' },
    { id: 'L11', number: 'L11', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'booked' },
    { id: 'L12', number: 'L12', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'booked' },
    { id: 'L13', number: 'L13', deck: 'lower', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 150, status: 'available' },
    { id: 'L14', number: 'L14', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'available' },
    { id: 'L15', number: 'L15', deck: 'lower', type: 'seater', price: bus.startingPrice, status: 'female-reserved' },
  ];

  const upperSeats: SeatInfo[] = [
    { id: 'U1', number: 'U1', deck: 'upper', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U2', number: 'U2', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U3', number: 'U3', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'female-reserved' },
    { id: 'U4', number: 'U4', deck: 'upper', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 200, status: 'booked' },
    { id: 'U5', number: 'U5', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U6', number: 'U6', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U7', number: 'U7', deck: 'upper', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U8', number: 'U8', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'booked' },
    { id: 'U9', number: 'U9', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'booked' },
    { id: 'U10', number: 'U10', deck: 'upper', type: 'sleeper', berthType: 'single', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U11', number: 'U11', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'available' },
    { id: 'U12', number: 'U12', deck: 'upper', type: 'sleeper', berthType: 'double', price: bus.startingPrice + 200, status: 'available' },
  ];

  const currentDeckSeats = activeDeck === 'lower' ? lowerSeats : upperSeats;
  const allSeats = [...lowerSeats, ...upperSeats];

  const toggleSeat = (seat: SeatInfo) => {
    if (seat.status === 'booked') return;
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert('Maximum 6 seats can be selected per booking');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const selectedSeats = allSeats.filter((s) => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    onConfirmSelection(bus, selectedSeats, boardingPoint, droppingPoint);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">{bus.operator}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-800 text-slate-100 font-mono font-medium">
                {bus.busType}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {bus.origin} → {bus.destination} • Departure: <strong className="text-amber-400">{bus.departureTime}</strong> ({bus.duration})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Deck Layout (Col 7) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
            {/* Deck Switcher Tabs */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Layout Deck
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setActiveDeck('lower')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                    activeDeck === 'lower' 
                      ? 'bg-[#0F2942] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lower Deck (15 Seats)
                </button>
                <button
                  onClick={() => setActiveDeck('upper')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                    activeDeck === 'upper' 
                      ? 'bg-[#0F2942] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upper Deck (12 Sleepers)
                </button>
              </div>
            </div>

            {/* Bus Exterior Frame */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-slate-300 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border border-slate-400 flex items-center justify-center text-[8px]">◎</span>
                  Driver Cabin
                </span>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {activeDeck === 'lower' ? 'Lower Deck Level' : 'Upper Sleeper Level'}
                </span>
                <span>Entry Door →</span>
              </div>

              {/* Grid of Seats */}
              <div className="grid grid-cols-3 gap-3">
                {/* Column 1: Single Window Berths / Seats */}
                <div className="space-y-3">
                  <div className="text-[10px] text-center uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Single (Window)
                  </div>
                  {currentDeckSeats
                    .filter((_, idx) => idx % 3 === 0)
                    .map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.status === 'booked'}
                          onClick={() => toggleSeat(seat)}
                          className={`w-full py-3 px-2 rounded-lg border text-center transition flex flex-col items-center justify-center relative cursor-pointer ${
                            seat.status === 'booked'
                              ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#0F2942] border-[#0F2942] text-white font-black shadow-md'
                              : seat.status === 'female-reserved'
                              ? 'bg-pink-50 border-pink-300 text-pink-800 hover:border-pink-400'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-blue-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-mono font-bold">{seat.number}</span>
                          <span className="text-[10px] opacity-80 mt-0.5">
                            {seat.type === 'sleeper' ? 'Sleeper' : 'Recliner'}
                          </span>
                          <span className={`text-[11px] font-bold mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-700'}`}>
                            ₹{seat.price}
                          </span>
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>

                {/* Column 2 & 3: Double Seats / Berths */}
                <div className="col-span-2 space-y-3">
                  <div className="text-[10px] text-center uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Aisle Side & Window Pairs
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {currentDeckSeats
                      .filter((_, idx) => idx % 3 !== 0)
                      .map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        return (
                          <button
                            key={seat.id}
                            disabled={seat.status === 'booked'}
                            onClick={() => toggleSeat(seat)}
                            className={`py-3 px-2 rounded-lg border text-center transition flex flex-col items-center justify-center relative cursor-pointer ${
                              seat.status === 'booked'
                                ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#0F2942] border-[#0F2942] text-white font-black shadow-md'
                                : seat.status === 'female-reserved'
                                ? 'bg-pink-50 border-pink-300 text-pink-800 hover:border-pink-400'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-blue-900 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold">{seat.number}</span>
                            <span className="text-[10px] opacity-80 mt-0.5">
                              {seat.type === 'sleeper' ? 'Sleeper' : 'Recliner'}
                            </span>
                            <span className={`text-[11px] font-bold mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-700'}`}>
                              ₹{seat.price}
                            </span>
                            {isSelected && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#0F2942] text-amber-400 flex items-center justify-center text-[9px] font-bold">✓</span>
                <span className="text-slate-900 font-bold">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-pink-100 border border-pink-300"></span>
                <span>Ladies Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-200"></span>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Summary (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-900" />
                  Select Boarding Location in {bus.origin.split(' ')[0]}
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  {bus.boardingPoints.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt} ({bus.departureTime})
                    </option>
                  ))}
                </select>

                <label className="text-xs font-bold text-slate-700 flex items-center gap-2 mt-3 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Select Dropping Location in {bus.destination.split(' ')[0]}
                </label>
                <select
                  value={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  {bus.droppingPoints.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt} ({bus.arrivalTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Berths Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Selected Berths / Seats
                  </span>
                  <span className="text-xs text-blue-900 font-mono font-bold">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>

                {selectedSeats.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    Click on any available berth or seat in the layout above to select.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
                            {s.number}
                          </span>
                          <span className="text-slate-700 capitalize">
                            {s.deck} Deck • {s.type} {s.berthType ? `(${s.berthType})` : ''}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900">₹{s.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSeats.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Base Fare ({selectedSeats.length} pax):</span>
                      <span className="font-semibold text-slate-800">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Passenger Tax & Insurance (5%):</span>
                      <span className="font-semibold text-slate-800">₹{Math.round(totalPrice * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Net Payable:</span>
                      <span className="text-blue-900 font-mono font-black text-base">
                        ₹{totalPrice + Math.round(totalPrice * 0.05)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleConfirm}
                className={`flex-2 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedSeats.length > 0
                    ? 'bg-[#0F2942] hover:bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 text-amber-400" />
                <span>Confirm {selectedSeats.length} {selectedSeats.length === 1 ? 'Berth' : 'Berths'} & Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
