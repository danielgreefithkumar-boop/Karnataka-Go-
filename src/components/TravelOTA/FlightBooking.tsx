import React, { useState } from 'react';
import { FlightItem, PassengerDetail, BookingContactInfo } from '../../types';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { PassengerDetailsModal } from './PassengerDetailsModal';
import { 
  Plane, 
  Globe, 
  Luggage, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle
} from 'lucide-react';

interface FlightBookingProps {
  onBookFlightWithPassengers: (
    flight: FlightItem, 
    passengersCount: number, 
    cabinClass: string,
    passengers: PassengerDetail[],
    contactInfo: BookingContactInfo
  ) => void;
  onAddToCart: (flight: FlightItem, passengers: number, cabinClass: string) => void;
}

export const FlightBooking: React.FC<FlightBookingProps> = ({
  onBookFlightWithPassengers,
  onAddToCart,
}) => {
  const [flightScope, setFlightScope] = useState<'domestic' | 'international'>('domestic');
  const [origin, setOrigin] = useState('BLR');
  const [destination, setDestination] = useState('IXE');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [departDate, setDepartDate] = useState('2026-11-05');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Business'>('Economy');

  // Passenger collection modal state
  const [selectedFlightForPassengers, setSelectedFlightForPassengers] = useState<FlightItem | null>(null);

  const domesticAirports = [
    { code: 'BLR', name: 'Bengaluru Kempegowda (BLR)' },
    { code: 'IXE', name: 'Mangaluru Intl (IXE)' },
    { code: 'BOM', name: 'Mumbai Chhatrapati (BOM)' },
    { code: 'DEL', name: 'New Delhi Indira Gandhi (DEL)' },
    { code: 'IXG', name: 'Belagavi Sambra (IXG)' },
    { code: 'HBX', name: 'Hubballi Airport (HBX)' },
    { code: 'GOI', name: 'Goa Dabolim (GOI)' },
    { code: 'HYD', name: 'Hyderabad Rajiv Gandhi (HYD)' },
  ];

  const internationalAirports = [
    { code: 'ALL', name: 'All Global Destinations' },
    { code: 'DXB', name: 'Dubai International (DXB) • UAE' },
    { code: 'SIN', name: 'Singapore Changi (SIN) • Singapore' },
    { code: 'LHR', name: 'London Heathrow (LHR) • UK' },
    { code: 'SFO', name: 'San Francisco (SFO) • USA' },
    { code: 'DOH', name: 'Doha Hamad Intl (DOH) • Qatar' },
    { code: 'FRA', name: 'Frankfurt Airport (FRA) • Germany' },
  ];

  const handleScopeChange = (scope: 'domestic' | 'international') => {
    setFlightScope(scope);
    if (scope === 'international') {
      setOrigin('BLR');
      setDestination('DXB');
    } else {
      setOrigin('BLR');
      setDestination('IXE');
    }
  };

  const filteredFlights = MOCK_FLIGHTS.filter((flight) => {
    // Filter by domestic vs international
    if (flightScope === 'international') {
      if (!flight.isInternational) return false;
      if (destination !== 'ALL' && flight.destinationCode !== destination) return false;
      return true;
    } else {
      if (flight.isInternational) return false;
      const matchOrigin = origin === 'ALL' || flight.originCode === origin;
      const matchDest = destination === 'ALL' || flight.destinationCode === destination;
      if (origin !== 'ALL' && destination !== 'ALL' && (!matchOrigin || !matchDest)) {
        return flight.originCode === origin || flight.destinationCode === destination;
      }
      return true;
    }
  });

  const handleOpenPassengerModal = (flight: FlightItem) => {
    setSelectedFlightForPassengers(flight);
  };

  const handlePassengerDetailsConfirmed = (
    paxList: PassengerDetail[], 
    contact: BookingContactInfo
  ) => {
    if (!selectedFlightForPassengers) return;
    const flight = selectedFlightForPassengers;
    setSelectedFlightForPassengers(null);
    onBookFlightWithPassengers(flight, passengers, cabinClass, paxList, contact);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        {/* Top scope toggles: Domestic vs International */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Flight Category:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => handleScopeChange('domestic')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  flightScope === 'domestic'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plane className="w-3.5 h-3.5 text-amber-400" />
                <span>Domestic (India)</span>
              </button>

              <button
                type="button"
                onClick={() => handleScopeChange('international')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  flightScope === 'international'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>International Flights</span>
                <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                  Global
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setTripType('oneway')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                  tripType === 'oneway' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setTripType('roundtrip')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                  tripType === 'roundtrip' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Round Trip
              </button>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Origin */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-blue-900 transition">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              From (Origin Hub)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="BLR">Bengaluru Kempegowda (BLR)</option>
              <option value="IXE">Mangaluru Intl (IXE)</option>
              {flightScope === 'domestic' && (
                <>
                  <option value="BOM">Mumbai Chhatrapati (BOM)</option>
                  <option value="DEL">New Delhi Indira Gandhi (DEL)</option>
                  <option value="IXG">Belagavi Sambra (IXG)</option>
                  <option value="HBX">Hubballi Airport (HBX)</option>
                </>
              )}
            </select>
          </div>

          {/* Destination */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-blue-900 transition">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              To ({flightScope === 'international' ? 'International Destination' : 'Destination'})
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {flightScope === 'international'
                ? internationalAirports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name}
                    </option>
                  ))
                : domesticAirports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Date */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-blue-900 transition">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Departure Date
            </label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
            />
          </div>

          {/* Travelers & Class */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-blue-900 transition">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Travelers & Cabin
            </label>
            <div className="flex items-center gap-2">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
              <span className="text-slate-300">|</span>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-blue-900 focus:outline-none cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="w-full min-h-[50px] bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition cursor-pointer"
          >
            <Plane className="w-4 h-4 text-amber-400" />
            <span>Search {flightScope === 'international' ? 'International' : 'Domestic'}</span>
          </button>
        </div>
      </div>

      {/* Flight Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredFlights.length}</strong> available {flightScope === 'international' ? 'International Global' : 'Scheduled Domestic'} flights
          </span>
          <span>Mandatory passenger details collected prior to payment checkout</span>
        </div>

        {filteredFlights.map((flight) => {
          const totalFlightPrice = flight.price * passengers;
          return (
            <div
              key={flight.id}
              className="bg-white border border-slate-200 hover:border-blue-900/40 rounded-xl p-4 sm:p-5 transition shadow-xs hover:shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5"
            >
              {/* Airline Badge */}
              <div className="flex items-center gap-4 min-w-[210px]">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-xs font-black text-blue-900">{flight.airline.slice(0, 3).toUpperCase()}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">{flight.flightNumber}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{flight.airline}</h3>
                    {flight.isInternational && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                        Intl
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200">
                      {flight.aircraft}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>{flight.baggage}</span>
                    {flight.refundable && (
                      <span className="text-emerald-700 font-semibold">• Refundable</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Timeline */}
              <div className="flex-1 flex items-center justify-between max-w-md px-2 sm:px-6">
                <div className="text-left">
                  <span className="text-lg font-black text-slate-900">{flight.departureTime}</span>
                  <p className="text-xs font-mono font-bold text-blue-900">{flight.originCode}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[100px]">{flight.originCity}</p>
                </div>

                <div className="flex flex-col items-center px-4 flex-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {flight.duration}
                  </span>
                  <div className="w-full flex items-center my-1">
                    <div className="h-[1.5px] bg-slate-300 flex-1"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-900 mx-1"></div>
                    <div className="h-[1.5px] bg-slate-300 flex-1"></div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {flight.stops === 0 ? 'Non-stop Direct' : `${flight.stops} Stop`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{flight.arrivalTime}</span>
                  <p className="text-xs font-mono font-bold text-blue-900">{flight.destinationCode}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[110px]">
                    {flight.destinationCity} ({flight.destinationCountry})
                  </p>
                </div>
              </div>

              {/* Price & Passenger Entry trigger */}
              <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ₹{totalFlightPrice.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {passengers > 1 ? `₹${flight.price} x ${passengers} Travelers` : 'Total Fare'}
                  </p>
                  <span className="text-[10px] text-rose-700 font-bold">
                    {flight.availableSeats} seats left
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(flight, passengers, cabinClass)}
                    className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Add to Cart"
                  >
                    + Cart
                  </button>
                  <button
                    onClick={() => handleOpenPassengerModal(flight)}
                    className="px-4 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <span>Enter Passenger Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Passenger Details Collection Modal */}
      {selectedFlightForPassengers && (
        <PassengerDetailsModal
          flight={selectedFlightForPassengers}
          passengersCount={passengers}
          cabinClass={cabinClass}
          isOpen={!!selectedFlightForPassengers}
          onClose={() => setSelectedFlightForPassengers(null)}
          onProceedToPayment={handlePassengerDetailsConfirmed}
        />
      )}
    </div>
  );
};
