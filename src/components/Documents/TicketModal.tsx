import React from 'react';
import { OperatorRequest } from '../../types';
import { 
  X, 
  Printer, 
  Plane, 
  Train, 
  Bus, 
  Zap, 
  Boxes, 
  CheckCircle2
} from 'lucide-react';

interface TicketModalProps {
  request: OperatorRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFlight = request.type === 'flight';
  const isTrain = request.type === 'train';
  const isBus = request.type === 'bus';
  const isCharter = request.type === 'charter';
  const isBBPS = request.type === 'bbps';
  const isIndustrial = request.type.includes('industrial');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="bg-[#0C1E33] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Official Digital Document
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
              Verified & Authenticated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 print:p-0 print:bg-white">
          {/* 1. FLIGHT BOARDING PASS */}
          {isFlight && (
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F2942] flex items-center justify-center text-amber-400">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">E-BOARDING PASS / TRAVEL VOUCHER</h3>
                    <p className="text-xs text-blue-900 font-mono font-bold">
                      DGCA AUTHORIZED • KARNATAKA GO (karnatakago.in) OTA
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">PASSENGER PNR</span>
                  <span className="text-lg font-mono font-black text-blue-900">
                    {request.pnrNumber || 'PENDING CONFIRMATION'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 text-xs border-b border-dashed border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Passenger Name</span>
                  <strong className="text-slate-900 text-sm block">{request.customerName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Flight & Carrier</span>
                  <strong className="text-slate-900 text-sm block">{request.serviceTitle.split('(')[0]}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Allocated Seat</span>
                  <strong className="text-blue-900 text-sm font-mono block">
                    {request.seatOrBerth || '12A (Window)'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Gate & Terminal</span>
                  <strong className="text-slate-900 text-sm block">Gate 14B • Terminal 1</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 text-xs border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Sector / Route</span>
                  <span className="text-slate-800 font-semibold">{request.sectorOrAccount}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Fare Paid</span>
                  <span className="text-emerald-700 font-mono font-bold text-base">
                    ₹{request.amount.toLocaleString('en-IN')} (Inclusive of Taxes)
                  </span>
                </div>
              </div>

              {/* Passenger Manifest Table */}
              {request.passengersList && request.passengersList.length > 0 && (
                <div className="py-3 border-b border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">
                    Verified Passenger Manifest & Passport Details ({request.passengersList.length} Travelers)
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Passenger Name</th>
                          <th className="py-2 px-3">Gender / Type</th>
                          <th className="py-2 px-3">Passport No / ID</th>
                          <th className="py-2 px-3">Meal / Seat Pref</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {request.passengersList.map((pax, i) => (
                          <tr key={pax.id || i} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-mono font-bold text-slate-500">{i + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {pax.title} {pax.firstName} {pax.lastName}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {pax.gender} • {pax.passengerType}
                            </td>
                            <td className="py-2 px-3 font-mono text-blue-900 font-bold">
                              {pax.passportNumber ? pax.passportNumber : 'Govt ID Verified'}
                              {pax.passportExpiry ? ` (Exp: ${pax.passportExpiry})` : ''}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {pax.mealPreference || 'Standard'} / {pax.seatPreference || 'Assigned'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Barcode & Security */}
              <div className="pt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex gap-1 h-8 items-center">
                    {[2, 4, 1, 5, 2, 6, 3, 1, 4, 2, 5, 3, 2, 4, 1, 6, 2, 5, 3, 2, 4, 1].map((w, idx) => (
                      <div key={idx} className="bg-slate-800 h-full" style={{ width: `${w * 2}px` }}></div>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    BCBP {request.bookingRef} {request.pnrNumber}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Present at Airport Security Gate with valid passport / photo ID</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. IRCTC TRAIN E-TICKET */}
          {isTrain && (
            <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-red-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">IRCTC ELECTRONIC RESERVATION SLIP (ERS)</h3>
                    <p className="text-xs text-red-700 font-mono font-bold">SOUTH WESTERN RAILWAY • SBC PRS</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">10-Digit PNR</span>
                  <span className="text-xl font-mono font-black text-red-700">
                    {request.pnrNumber || '4819-204-182'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-red-50/50 p-3 rounded-xl border border-red-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Train Name & No</span>
                  <strong className="text-slate-900 block">{request.serviceTitle}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Class / Quota</span>
                  <strong className="text-slate-900 block">Executive / General</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Coach / Berth</span>
                  <strong className="text-red-700 font-mono block">
                    {request.seatOrBerth || 'Coach E1, Seat 24'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
                  <strong className="text-emerald-700 font-bold block">CONFIRMED (CNF)</strong>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Primary Passenger:</span>
                  <span className="font-bold text-slate-900">{request.customerName} (Age: 38, Gender: M)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Ticket Fare:</span>
                  <span className="font-mono font-bold text-slate-900">₹{request.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-slate-600">{request.bookingRef}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                Valid for travel along with original government photo identity proof (Aadhaar, Voter ID, Passport, Driving License).
              </div>
            </div>
          )}

          {/* 3. BBPS CLEARANCE RECEIPT */}
          {isBBPS && (
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">BHARAT BILL PAYMENT SYSTEM (BBPS) RECEIPT</h3>
                    <p className="text-xs text-emerald-800 font-mono font-bold">NPCI CENTRAL SETTLEMENT • STATUTORY VOUCHER</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">BBPS Ref No</span>
                  <span className="text-sm font-mono font-black text-slate-900">
                    {request.pnrNumber || 'BBPS-NPCI-TXN-7740192'}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Biller Operating Board:</span>
                  <strong className="text-slate-900">{request.serviceTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Consumer Account / RR:</span>
                  <strong className="font-mono text-slate-900">{request.sectorOrAccount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Subscriber Name:</span>
                  <strong className="text-slate-900">{request.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Settlement Status:</span>
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    CLEARED & REMITTED
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm">
                  <span className="font-bold text-slate-900">Total Cleared:</span>
                  <span className="font-mono font-black text-emerald-800 text-base">
                    ₹{request.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                This transaction has been authenticated and processed through the National Payments Corporation of India (NPCI) Bharat Bill Payment Operating Unit (BBPOU).
              </div>
            </div>
          )}

          {/* 4. B2B INDUSTRIAL GST TAX INVOICE */}
          {isIndustrial && (
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div>
                  <h2 className="font-black text-slate-900 text-lg">TAX INVOICE (GST COMPLIANT)</h2>
                  <p className="text-xs text-slate-500">Original for Recipient • MSME & B2B Supply</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase block font-bold">Invoice Number</span>
                  <span className="text-base font-mono font-black text-blue-900">
                    {request.invoiceNumber || 'INV-2026-0814'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">SUPPLIER (KSH)</span>
                  <p className="font-bold text-slate-900">KARNATAKA SUPPLIES HUB LTD</p>
                  <p className="text-slate-600">Plot 42, Peenya Industrial Area, Phase 1</p>
                  <p className="text-slate-600">Bengaluru, Karnataka - 560058</p>
                  <p className="font-mono text-blue-900 font-bold mt-1">GSTIN: 29AABCK1234F1Z8</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">BUYER / CONSIGNEE</span>
                  <p className="font-bold text-slate-900">{request.customerName}</p>
                  <p className="text-slate-600">{request.sectorOrAccount}</p>
                  <p className="text-slate-600">Phone: {request.customerPhone}</p>
                  <p className="font-mono text-blue-900 font-bold mt-1">
                    GSTIN: {request.gstin || '29AABCK9928M1Z2'}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">HSN Code</th>
                      <th className="p-2.5 text-right">Taxable Val</th>
                      <th className="p-2.5 text-right">GST (18%)</th>
                      <th className="p-2.5 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 text-slate-900 font-semibold">{request.serviceTitle}</td>
                      <td className="p-2.5 font-mono text-slate-600">84818030</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">
                        ₹{Math.round(request.amount / 1.18).toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-700">
                        ₹{(request.amount - Math.round(request.amount / 1.18)).toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        ₹{request.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
                <span>Certified that the particulars given above are true and correct.</span>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-emerald-800 font-bold">DIGITALLY SIGNED</span>
                  <span className="text-slate-900 font-bold">Authorized Signatory, KSH</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. BUS / CHARTER TICKET */}
          {(isBus || isCharter) && (
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F2942] flex items-center justify-center text-amber-400">
                    {isBus ? <Bus className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {isBus ? 'INTERCITY COACH PASS & SLEEPER TICKET' : 'EXECUTIVE CHARTER MANIFEST'}
                    </h3>
                    <p className="text-xs text-blue-900 font-mono font-bold">KARNATAKA SUPPLIES HUB MOBILITY DESK</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">PNR Reference</span>
                  <span className="text-base font-mono font-black text-blue-900">
                    {request.pnrNumber || 'KSRTC-VOL-88912'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block font-medium">Passenger / Entity:</span>
                  <strong className="text-slate-900 text-sm">{request.customerName}</strong>
                  <p className="text-slate-500">{request.customerPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block font-medium">Allocated Berth / Seat:</span>
                  <strong className="text-blue-900 text-sm font-mono font-bold">
                    {request.seatOrBerth || 'Confirmed Sleeper Deck'}
                  </strong>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block font-medium">Route & Sector Details:</span>
                  <p className="text-slate-900 font-semibold">{request.sectorOrAccount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                <span>Payment Mode: {request.paymentMode || 'Instant Net Settlement'}</span>
                <span className="text-base font-mono font-black text-emerald-800">
                  Total Paid: ₹{request.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
