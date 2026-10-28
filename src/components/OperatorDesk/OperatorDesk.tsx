import React, { useState } from 'react';
import { OperatorRequest } from '../../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Check, 
  X, 
  AlertCircle,
  Hash,
  Send,
  Zap,
  Plane,
  Train,
  Bus,
  Boxes
} from 'lucide-react';

interface OperatorDeskProps {
  requests: OperatorRequest[];
  onIssuePNR: (requestId: string, pnrNumber: string, seatOrBerth?: string) => void;
  onUpdateStatus: (requestId: string, status: OperatorRequest['status'], notes?: string) => void;
  onViewDocument: (request: OperatorRequest) => void;
}

export const OperatorDesk: React.FC<OperatorDeskProps> = ({
  requests,
  onIssuePNR,
  onUpdateStatus,
  onViewDocument,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activeRequestForPNR, setActiveRequestForPNR] = useState<OperatorRequest | null>(null);
  const [customPNR, setCustomPNR] = useState('');
  const [customSeat, setCustomSeat] = useState('');

  const [activeRequestForRFQ, setActiveRequestForRFQ] = useState<OperatorRequest | null>(null);
  const [quotedAmount, setQuotedAmount] = useState<number>(0);
  const [rfqLeadTime, setRfqLeadTime] = useState<string>('4 Business Days');

  const totalGPV = requests.reduce((acc, r) => acc + r.amount, 0);
  const pendingPNRCount = requests.filter((r) => r.status === 'PENDING_PNR').length;
  const clearedBBPSCount = requests.filter((r) => r.type === 'bbps' && r.status === 'CLEARED').length;
  const openRFQCount = requests.filter((r) => r.status === 'RFQ_OPEN').length;
  const commissionEarned = Math.round(totalGPV * 0.035);

  const filteredRequests = requests.filter((r) => {
    const matchesType = filterType === 'ALL' || r.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = 
      r.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.pnrNumber && r.pnrNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleOpenPNRModal = (req: OperatorRequest) => {
    setActiveRequestForPNR(req);
    let prefix = 'KGO-PNR-';
    if (req.type === 'flight') prefix = '6E-BLR-';
    if (req.type === 'train') prefix = 'IRCTC-';
    if (req.type === 'bus') prefix = 'KSRTC-';
    if (req.type === 'charter') prefix = 'DGCA-CHT-';
    setCustomPNR(prefix + Math.floor(100000 + Math.random() * 900000));
    setCustomSeat(req.seatOrBerth || 'Confirmed Assigned');
  };

  const handleConfirmPNRIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestForPNR) return;
    onIssuePNR(activeRequestForPNR.id, customPNR, customSeat);
    setActiveRequestForPNR(null);
  };

  const handleOpenRFQModal = (req: OperatorRequest) => {
    setActiveRequestForRFQ(req);
    setQuotedAmount(req.amount > 0 ? req.amount : 285000);
  };

  const handleConfirmRFQQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestForRFQ) return;
    onUpdateStatus(activeRequestForRFQ.id, 'RFQ_QUOTED', `Quoted: ₹${quotedAmount.toLocaleString('en-IN')} with lead time: ${rfqLeadTime}. MTC inspection approved.`);
    setActiveRequestForRFQ(null);
  };

  const exportCSV = () => {
    const headers = ['Booking Ref', 'Type', 'Customer', 'Service Title', 'Amount', 'Status', 'PNR / Voucher', 'Date'];
    const rows = filteredRequests.map(r => [
      r.bookingRef,
      r.type,
      `"${r.customerName}"`,
      `"${r.serviceTitle}"`,
      r.amount,
      r.status,
      r.pnrNumber || 'N/A',
      r.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSH_Operator_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (type: OperatorRequest['type']) => {
    switch (type) {
      case 'flight':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200"><Plane className="w-3 h-3" /> FLIGHT</span>;
      case 'train':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200"><Train className="w-3 h-3" /> IRCTC</span>;
      case 'bus':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"><Bus className="w-3 h-3" /> KSRTC</span>;
      case 'charter':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200"><Plane className="w-3 h-3" /> CHARTER</span>;
      case 'bbps':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200"><Zap className="w-3 h-3 text-amber-600" /> BBPS</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200"><Boxes className="w-3 h-3" /> B2B MTC</span>;
    }
  };

  const getStatusBadge = (status: OperatorRequest['status']) => {
    switch (status) {
      case 'PENDING_PNR':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200"><Clock className="w-3 h-3 text-rose-600" /> PNR Pending</span>;
      case 'PNR_ISSUED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"><CheckCircle className="w-3 h-3 text-emerald-600" /> PNR Confirmed</span>;
      case 'CLEARED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"><CheckCircle className="w-3 h-3 text-emerald-600" /> BBPS Settled</span>;
      case 'RFQ_OPEN':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200"><AlertCircle className="w-3 h-3 text-amber-600" /> RFQ Open</span>;
      case 'RFQ_QUOTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200"><Send className="w-3 h-3 text-blue-600" /> Quote Dispatched</span>;
      case 'DISPATCHED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200"><Check className="w-3 h-3" /> Dispatched</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner Card */}
      <div className="bg-[#0C1E33] text-white p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-800 border border-blue-700 flex items-center justify-center text-amber-400 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Master Operator Desk Console</h1>
              <span className="text-[10px] bg-blue-900 text-slate-200 border border-blue-700 font-mono px-2 py-0.5 rounded font-bold">
                Fulfillment Authority Node
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live transaction clearance, official PNR generation, and B2B industrial RFQ quotation desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-900" />
            <span>Export Queue CSV</span>
          </button>
          <div className="text-right">
            <span className="text-[10px] text-slate-300 block uppercase font-medium">Terminal Node</span>
            <span className="text-xs font-mono font-bold text-amber-400">AGENT-KA-BLR-0192</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gross Volume</span>
          <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
            ₹{totalGPV >= 100000 ? `${(totalGPV / 100000).toFixed(2)} L` : totalGPV.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Processed Volume</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending PNRs</span>
          <span className={`text-lg font-black font-mono mt-1 block ${pendingPNRCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {pendingPNRCount} Bookings
          </span>
          <span className="text-[10px] text-slate-500">Requires agent stamp</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">BBPS Cleared</span>
          <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
            {clearedBBPSCount} Receipts
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">NPCI 100% Settled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Open RFQs</span>
          <span className="text-lg font-black text-amber-800 font-mono mt-1 block">
            {openRFQCount} Enquiries
          </span>
          <span className="text-[10px] text-slate-500">Industrial & MTC batch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Operator Margin</span>
          <span className="text-lg font-black text-emerald-700 font-mono mt-1 block">
            ₹{commissionEarned.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500">3.5% Commission</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fulfillment SLA</span>
          <span className="text-lg font-black text-blue-900 font-mono mt-1 block">
            99.8% Success
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Zero Dropped</span>
        </div>
      </div>

      {/* Queue Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-900" />
            Vertical:
          </span>
          {['ALL', 'flight', 'train', 'bus', 'charter', 'bbps', 'industrial_rfq'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-bold rounded-lg uppercase transition cursor-pointer ${
                filterType === type
                  ? 'bg-[#0F2942] text-white'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {type === 'ALL' ? 'All' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-900 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_PNR">Pending PNR</option>
            <option value="PNR_ISSUED">PNR Issued</option>
            <option value="CLEARED">Cleared / Settled</option>
            <option value="RFQ_OPEN">RFQ Open</option>
            <option value="RFQ_QUOTED">RFQ Quoted</option>
          </select>

          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ref, Name, PNR..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>
      </div>

      {/* Main Request Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Booking Ref & Vertical</th>
                <th className="py-3 px-4">Client / Entity</th>
                <th className="py-3 px-4">Service Details & Sector</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">PNR / Voucher Code</th>
                <th className="py-3 px-4 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No service requests match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-900">{req.bookingRef}</div>
                      <div className="mt-1">{getTypeBadge(req.type)}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{req.customerName}</div>
                      <div className="text-[11px] text-slate-500">{req.customerPhone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{req.customerEmail}</div>
                      {req.passengersList && req.passengersList.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] bg-blue-50 text-blue-900 px-1.5 py-0.2 rounded font-bold border border-blue-200">
                            {req.passengersList.length} Pax Roster
                          </span>
                          {req.passengersList[0].passportNumber && (
                            <span className="text-[9px] bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold border border-amber-200">
                              Pass: {req.passengersList[0].passportNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 line-clamp-1">{req.serviceTitle}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{req.sectorOrAccount}</div>
                      {req.notes && (
                        <div className="text-[10px] text-amber-800 italic mt-0.5 line-clamp-1">
                          Note: {req.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        ₹{req.amount.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[10px] text-slate-500">{req.paymentMode || 'Paid Online'}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                      <div className="text-[10px] text-slate-400 mt-1">{req.createdAt}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.pnrNumber ? (
                        <div>
                          <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                            {req.pnrNumber}
                          </span>
                          {req.seatOrBerth && (
                            <div className="text-[10px] text-slate-500 mt-0.5">{req.seatOrBerth}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Pending Gen</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {req.status === 'PENDING_PNR' && (
                          <button
                            onClick={() => handleOpenPNRModal(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                            title="Generate Official PNR"
                          >
                            <Hash className="w-3.5 h-3.5 text-amber-400" />
                            <span>Issue PNR</span>
                          </button>
                        )}

                        {req.status === 'RFQ_OPEN' && (
                          <button
                            onClick={() => handleOpenRFQModal(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                            title="Review and dispatch RFQ Quote"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Quote</span>
                          </button>
                        )}

                        <button
                          onClick={() => onViewDocument(req)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer shadow-2xs"
                          title="View Official Pass / GST Invoice"
                        >
                          <FileText className="w-4 h-4 text-blue-900" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PNR Modal */}
      {activeRequestForPNR && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl text-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm">Issue Official PNR / Passenger Code</h3>
                <p className="text-xs text-amber-400 mt-0.5">{activeRequestForPNR.serviceTitle}</p>
              </div>
              <button 
                onClick={() => setActiveRequestForPNR(null)}
                className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPNRIssue} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Generated PNR / Passenger Ref
                </label>
                <input
                  type="text"
                  required
                  value={customPNR}
                  onChange={(e) => setCustomPNR(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Seat / Berth / Cabin Allocation
                </label>
                <input
                  type="text"
                  required
                  value={customSeat}
                  onChange={(e) => setCustomSeat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
                Sealing this PNR registers the ticket with the central reservation switch and updates the customer portal in real-time.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRequestForPNR(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Issue & Seal PNR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RFQ Quoting Modal */}
      {activeRequestForRFQ && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl text-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm">Fulfill & Quote B2B Industrial RFQ</h3>
                <p className="text-xs text-amber-300 mt-0.5">{activeRequestForRFQ.serviceTitle}</p>
              </div>
              <button 
                onClick={() => setActiveRequestForRFQ(null)}
                className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRFQQuote} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Operator Quoted Wholesale Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-700 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Lead Time to Site
                </label>
                <input
                  type="text"
                  required
                  value={rfqLeadTime}
                  onChange={(e) => setRfqLeadTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
                Official proforma quotation with attached Mill Test Certificate (EN 10204 3.1) and GST breakdown will be transmitted to the client's procurement inbox.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRequestForRFQ(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Transmit Official Quote</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
