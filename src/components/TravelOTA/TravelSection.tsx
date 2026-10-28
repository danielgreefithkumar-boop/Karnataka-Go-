import { TravelVertical, FlightItem, TrainItem, BusItem, CharterItem, SeatInfo, PassengerDetail, BookingContactInfo } from '../../types';
import { FlightBooking } from './FlightBooking';
import { TrainBooking } from './TrainBooking';
import { BusBooking } from './BusBooking';
import { CharterBooking } from './CharterBooking';
import { Plane, Train, Bus, Shield, Sparkles } from 'lucide-react';

interface TravelSectionProps {
  activeTab: TravelVertical;
  setActiveTab: (tab: TravelVertical) => void;
  onBookFlightWithPassengers: (
    flight: FlightItem, 
    passengers: number, 
    cabinClass: string,
    passengersList: PassengerDetail[],
    contactInfo: BookingContactInfo
  ) => void;
  onAddFlightToCart: (flight: FlightItem, passengers: number, cabinClass: string) => void;
  onBookTrain: (train: TrainItem, selectedClass: TrainItem['classes'][0], quota: string) => void;
  onAddTrainToCart: (train: TrainItem, selectedClass: TrainItem['classes'][0], quota: string) => void;
  onBookBus: (bus: BusItem, selectedSeats: SeatInfo[], boarding: string, dropping: string) => void;
  onAddBusToCart: (bus: BusItem, selectedSeats: SeatInfo[], boarding: string, dropping: string) => void;
  onBookCharter: (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => void;
  onAddCharterToCart: (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({
  activeTab,
  setActiveTab,
  onBookFlightWithPassengers,
  onAddFlightToCart,
  onBookTrain,
  onAddTrainToCart,
  onBookBus,
  onAddBusToCart,
  onBookCharter,
  onAddCharterToCart,
}) => {
  const tabs = [
    {
      id: 'flights',
      label: 'Commercial Flights',
      icon: Plane,
      desc: 'Scheduled regional flights & direct fares',
      badge: 'BLR Hub',
    },
    {
      id: 'trains',
      label: 'IRCTC Vande Bharat & Trains',
      icon: Train,
      desc: 'General, Tatkal quotas & live availability',
      badge: 'Direct PRS',
    },
    {
      id: 'buses',
      label: 'Intercity Sleeper Buses',
      icon: Bus,
      desc: 'Interactive dual-deck berth selector',
      badge: 'KSRTC Fleet',
    },
    {
      id: 'charters',
      label: 'Executive Charters',
      icon: Sparkles,
      desc: 'Hawker, Learjet & King Air VIP FBO',
      badge: 'Private Airstrips',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Cards Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TravelVertical)}
              className={`p-4 rounded-xl border text-left transition relative cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-blue-900 shadow-md ring-2 ring-blue-900/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-[#0F2942] text-amber-400 shadow-xs' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <div>
                <h4 className={`font-bold text-sm ${isActive ? 'text-[#0C1E33]' : 'text-slate-800'}`}>
                  {tab.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tab.desc}</p>
              </div>

              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F2942] rounded-t-xl"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Sub-vertical */}
      {activeTab === 'flights' && (
        <FlightBooking
          onBookFlightWithPassengers={onBookFlightWithPassengers}
          onAddToCart={onAddFlightToCart}
        />
      )}

      {activeTab === 'trains' && (
        <TrainBooking
          onBookTrain={onBookTrain}
          onAddToCart={onAddTrainToCart}
        />
      )}

      {activeTab === 'buses' && (
        <BusBooking
          onConfirmBusBooking={onBookBus}
          onAddBusToCart={onAddBusToCart}
        />
      )}

      {activeTab === 'charters' && (
        <CharterBooking
          onBookCharter={onBookCharter}
          onAddToCart={onAddCharterToCart}
        />
      )}
    </div>
  );
};
