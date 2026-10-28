import React from 'react';
import { 
  AppMode, 
  TravelVertical 
} from '../types';
import { 
  Plane, 
  Zap, 
  Boxes, 
  ShieldCheck, 
  ShoppingCart, 
  FileText, 
  Building2,
  Phone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeNav: 'travel' | 'bbps' | 'industrial' | 'my-orders';
  setActiveNav: (nav: 'travel' | 'bbps' | 'industrial' | 'my-orders') => void;
  travelTab: TravelVertical;
  setTravelTab: (tab: TravelVertical) => void;
  cartCount: number;
  openCart: () => void;
  pendingOperatorCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  activeNav,
  setActiveNav,
  travelTab,
  setTravelTab,
  cartCount,
  openCart,
  pendingOperatorCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Institutional Top Bar */}
      <div className="bg-[#0C1E33] text-slate-200 px-4 sm:px-6 lg:px-8 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NPCI Bharat BillPay (BBPS) Direct Clearing Gateway</span>
          </div>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">
            Govt. of Karnataka Partner Network • MTC EN 10204 3.1 & IRCTC PRS Node
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-300">
            Toll-Free Helpline: <strong className="text-white font-mono">1800-425-5748</strong>
          </span>
          <span className="bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono border border-amber-400/20">
            GSTIN: 29AABCK1234F1Z8
          </span>
          <span className="text-slate-400">Bengaluru (HQ)</span>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Emblems */}
          <div 
            onClick={() => { setMode('client'); setActiveNav('travel'); }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Modern High-End Karnataka Go (karnatakago.in) Badge */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-[#0f172a] p-0.5 shadow-lg border-2 border-[#d97706]/80 group-hover:border-[#d97706] transition-all flex items-center justify-center overflow-hidden">
                {/* Subtle metallic gold linear gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#d97706]/25 rounded-full blur-xs"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <span className="font-sans font-black text-[#d97706] text-base tracking-wider leading-none drop-shadow-xs">
                    K•GO
                  </span>
                  <span className="text-[6.5px] text-amber-200/90 font-mono font-bold tracking-widest uppercase mt-0.5">
                    PORTAL
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl text-[#0f172a] tracking-tight group-hover:text-blue-950 transition-colors">
                    Karnataka Go
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-[#d97706] border border-[#d97706]/40 font-mono">
                    karnatakago.in
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-0.5">
                  <span className="font-semibold text-slate-700">Karnataka Universal Portal</span>
                  <span className="text-slate-300">•</span>
                  <span>Travel OTA</span>
                  <span className="text-slate-300">•</span>
                  <span>BBPS Utilities & B2B</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Tools: Dual Mode & Cart */}
          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center shadow-inner">
              <button
                onClick={() => setMode('client')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'client'
                    ? 'bg-white text-[#0C1E33] shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Client Booking & Purchase Portal"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Client Portal</span>
              </button>

              <button
                onClick={() => setMode('operator')}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'operator'
                    ? 'bg-[#0C1E33] text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Open Master Operator Desk Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Operator Desk</span>
                {pendingOperatorCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-rose-600 text-white rounded-full shadow">
                    {pendingOperatorCount}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-900 border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
              title="View Unified Service Cart"
            >
              <ShoppingCart className="w-4 h-4 text-blue-900" />
              <span className="hidden sm:inline text-xs font-bold text-slate-800">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-700 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        {mode === 'client' && (
          <div className="flex items-center justify-between border-t border-slate-200/90 py-2.5 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveNav('travel')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeNav === 'travel'
                    ? 'bg-blue-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>Travel OTA Engine</span>
              </button>

              <button
                onClick={() => setActiveNav('bbps')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeNav === 'bbps'
                    ? 'bg-blue-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>BBPS Utility Clearance</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">
                  Instant
                </span>
              </button>

              <button
                onClick={() => setActiveNav('industrial')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeNav === 'industrial'
                    ? 'bg-blue-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Boxes className="w-4 h-4 text-blue-600" />
                <span>B2B Industrial Supplies</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border border-amber-200">
                  MTC 3.1
                </span>
              </button>

              <button
                onClick={() => setActiveNav('my-orders')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeNav === 'my-orders'
                    ? 'bg-blue-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Bookings & Invoices</span>
              </button>
            </nav>

            {/* Travel Sub-verticals Pills */}
            {activeNav === 'travel' && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] uppercase tracking-wider font-bold px-1.5">Modes:</span>
                {(['flights', 'trains', 'buses', 'charters'] as TravelVertical[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTravelTab(tab)}
                    className={`capitalize px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      travelTab === tab
                        ? 'bg-white text-blue-900 shadow-sm border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
