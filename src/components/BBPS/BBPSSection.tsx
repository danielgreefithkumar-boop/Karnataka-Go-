import React, { useState } from 'react';
import { UtilityVertical, UtilityProvider, FetchedBill } from '../../types';
import { UTILITY_PROVIDERS } from '../../data/mockData';
import { 
  Zap, 
  Car, 
  Flame, 
  Smartphone, 
  Tv, 
  Droplet, 
  CreditCard, 
  Shield, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  RefreshCw,
  Building,
  Check
} from 'lucide-react';

interface BBPSSectionProps {
  onPayBill: (bill: FetchedBill, vertical: UtilityVertical) => void;
  onAddBillToCart: (bill: FetchedBill, vertical: UtilityVertical) => void;
}

export const BBPSSection: React.FC<BBPSSectionProps> = ({
  onPayBill,
  onAddBillToCart,
}) => {
  const [selectedVertical, setSelectedVertical] = useState<UtilityVertical>('electricity');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('elec-bescom');
  const [consumerInput, setConsumerInput] = useState<string>('5420189421');
  const [fastagAmount, setFastagAmount] = useState<number>(1000);
  const [rechargeAmount, setRechargeAmount] = useState<number>(666);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedBill, setFetchedBill] = useState<FetchedBill | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const verticalsList = [
    { id: 'electricity', label: 'Electricity (BESCOM)', icon: Zap, count: '5 Discoms' },
    { id: 'fastag', label: 'FASTag Toll', icon: Car, count: 'NHAI Wallet' },
    { id: 'gas', label: 'LPG Gas Cylinder', icon: Flame, count: '3 Marketers' },
    { id: 'mobile', label: 'Mobile & 5G Data', icon: Smartphone, count: 'Pre & Post' },
    { id: 'dth', label: 'DTH Satellite TV', icon: Tv, count: '4 Providers' },
    { id: 'water', label: 'BWSSB Water', icon: Droplet, count: 'Municipal' },
    { id: 'loan', label: 'Loan EMI Payment', icon: CreditCard, count: 'Banks/NBFC' },
    { id: 'insurance', label: 'Life & Health Ins.', icon: Shield, count: 'LIC/Star' },
  ];

  const currentProviders = UTILITY_PROVIDERS.filter((p) => p.vertical === selectedVertical);
  const activeProvider = UTILITY_PROVIDERS.find((p) => p.id === selectedProviderId) || currentProviders[0];

  const handleVerticalChange = (vertical: UtilityVertical) => {
    setSelectedVertical(vertical);
    const firstProvider = UTILITY_PROVIDERS.find((p) => p.vertical === vertical);
    if (firstProvider) {
      setSelectedProviderId(firstProvider.id);
      setConsumerInput(firstProvider.placeholder.split(' ')[0]);
    }
    setFetchedBill(null);
    setValidationError(null);
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
    const prov = UTILITY_PROVIDERS.find((p) => p.id === providerId);
    if (prov) {
      setConsumerInput(prov.placeholder.split(' ')[0]);
    }
    setFetchedBill(null);
    setValidationError(null);
  };

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Indian vehicle registration regex for FASTag
    if (selectedVertical === 'fastag' && activeProvider?.regexPattern) {
      const cleaned = consumerInput.trim().toUpperCase().replace(/\s+/g, '-');
      const regex = new RegExp('^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$', 'i');
      if (!regex.test(cleaned)) {
        setValidationError('Invalid Indian Vehicle Registration Number. Format example: KA-01-MJ-4092 or KA04AB1234');
        return;
      }
    }

    if (!consumerInput.trim()) {
      setValidationError('Please enter a valid Account ID / Consumer Identifier.');
      return;
    }

    setIsFetching(true);
    setFetchedBill(null);

    setTimeout(() => {
      setIsFetching(false);

      let billAmount = 14850;
      let lateFee = 0;
      let customerName = 'Sri Venkatesha Industries Pvt Ltd';
      let billNumber = 'BBPS-2026-' + Math.floor(100000 + Math.random() * 900000);
      let billingPeriod = '1 Oct 2026 - 31 Oct 2026';
      let dueDate = '10 Nov 2026';

      if (selectedVertical === 'fastag') {
        customerName = 'Ramesh Kumar Gowda (Vehicle: ' + consumerInput.toUpperCase() + ')';
        billAmount = fastagAmount;
        billingPeriod = 'Instant Highway Tag Wallet Top-up';
        dueDate = 'Immediate';
      } else if (selectedVertical === 'electricity') {
        customerName = 'Chamundi Precision Tech Ltd (LT-4 Tariff)';
        billAmount = 8420;
        lateFee = 120;
        billingPeriod = 'Cycle #10 - Oct 2026';
        dueDate = '05 Nov 2026';
      } else if (selectedVertical === 'gas') {
        customerName = 'Shivaraj Patil (Indane Domestic 14.2kg)';
        billAmount = 855;
        billingPeriod = 'Refill Booking Cylinder Order';
        dueDate = 'Direct Dispatch';
      } else if (selectedVertical === 'mobile') {
        customerName = 'Kaveri Logistics Corp (Corporate Postpaid)';
        billAmount = rechargeAmount;
        billingPeriod = 'Unlimited True 5G 84-Day Commercial Pack';
        dueDate = 'Instant Recharge';
      } else if (selectedVertical === 'water') {
        customerName = 'Malleshwaram Commercial Complex';
        billAmount = 3490;
        billingPeriod = 'BWSSB Metered Sanitary & Water #4819';
        dueDate = '12 Nov 2026';
      } else if (selectedVertical === 'loan') {
        customerName = 'M/s Deccan CNC Tools';
        billAmount = 24500;
        billingPeriod = 'Monthly Commercial Term Loan EMI';
        dueDate = '03 Nov 2026';
      } else if (selectedVertical === 'insurance') {
        customerName = 'Dr. Girish Nambiar (Policyholder)';
        billAmount = 18200;
        billingPeriod = 'Jeevan Anand Annual Premium Renewal';
        dueDate = '15 Nov 2026';
      }

      const generatedBill: FetchedBill = {
        billerId: activeProvider.code,
        billerName: activeProvider.name,
        consumerId: consumerInput.trim(),
        customerName,
        billNumber,
        billDate: '26 Oct 2026',
        dueDate,
        amount: billAmount,
        lateFee,
        billingPeriod,
        status: 'UNPAID',
        bbpsRefNumber: 'BPU-' + Math.floor(1000000000 + Math.random() * 9000000000),
      };

      setFetchedBill(generatedBill);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* BBPS Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0F2942] flex items-center justify-center text-white shadow-xs">
              <span className="font-serif font-black text-amber-400 text-lg">BBPS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#0C1E33]">NPCI Bharat BillPay Clearing Desk</h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                  Direct Biller Switch Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official NPCI clearing protocol with validated bill fetch and statutory electronic clearance receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connected: BESCOM, BWSSB, NHAI FASTag, IOCL Gas</span>
          </div>
        </div>

        {/* 8 Verticals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {verticalsList.map((vert) => {
            const Icon = vert.icon;
            const isSelected = selectedVertical === vert.id;
            return (
              <button
                key={vert.id}
                onClick={() => handleVerticalChange(vert.id as UtilityVertical)}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F2942] text-white border-[#0F2942] shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-amber-400' : 'text-blue-900'}`} />
                <span className="text-xs leading-tight font-bold block">{vert.label.split(' ')[0]}</span>
                <span className={`text-[9px] mt-0.5 block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {vert.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Clearing Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (Col 6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              1. Provider Lookup & Account Parameters
            </span>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {activeProvider?.code}
            </span>
          </div>

          <form onSubmit={handleFetchBill} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Biller / Operating Distribution Board
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
              >
                {currentProviders.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                <span>{activeProvider?.inputLabel}</span>
                <span className="text-[10px] text-blue-900 font-bold">
                  {selectedVertical === 'fastag' ? 'Indian Reg Plate Regex Active' : 'Validated Format'}
                </span>
              </label>
              <input
                type="text"
                value={consumerInput}
                onChange={(e) => setConsumerInput(e.target.value)}
                placeholder={activeProvider?.placeholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {activeProvider?.helperText}
              </p>
            </div>

            {/* FASTag Denominations */}
            {selectedVertical === 'fastag' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Select Recharge Amount (₹)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFastagAmount(amt)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition cursor-pointer ${
                        fastagAmount === amt
                          ? 'bg-[#0F2942] text-white border-[#0F2942]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile 5G packs */}
            {selectedVertical === 'mobile' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Karnataka Popular 5G Unlimited Plans
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { amt: 299, desc: '28 Days • 2GB/Day' },
                    { amt: 666, desc: '70 Days • Unlimited 5G' },
                    { amt: 2999, desc: '365 Days • Annual 2.5GB' },
                  ].map((p) => (
                    <button
                      key={p.amt}
                      type="button"
                      onClick={() => setRechargeAmount(p.amt)}
                      className={`p-2.5 text-left rounded-lg border transition cursor-pointer ${
                        rechargeAmount === p.amt
                          ? 'bg-blue-50 border-blue-900 text-blue-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-mono font-bold text-blue-900 block text-xs">₹{p.amt}</span>
                      <span className="text-[10px] text-slate-500 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isFetching}
              className="w-full py-3 px-4 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {isFetching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Connecting to NPCI Biller Gateway...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Fetch Validated Bill & Outstanding Balance</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel: Electronic Bill Voucher (Col 6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                2. Official Electronic Bill Voucher
              </span>
              <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                NPCI Central Clearance
              </span>
            </div>

            {!fetchedBill ? (
              <div className="py-14 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No Bill Fetched Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a distribution authority on the left, enter your Consumer Account or Vehicle Number, and click <strong>"Fetch Validated Bill"</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-900">{fetchedBill.billerName}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Ref: {fetchedBill.bbpsRefNumber}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900">{fetchedBill.customerName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Account: {fetchedBill.consumerId} • Voucher #{fetchedBill.billNumber}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                    <span>Billing Period:</span>
                    <span className="font-semibold text-slate-900">{fetchedBill.billingPeriod}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                    <span>Due Date:</span>
                    <span className="font-bold text-rose-700">{fetchedBill.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                    <span>Current Outstanding:</span>
                    <span className="font-mono font-bold text-slate-900">₹{fetchedBill.amount.toLocaleString('en-IN')}</span>
                  </div>
                  {fetchedBill.lateFee > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                      <span>Late Payment Penalty:</span>
                      <span className="font-mono text-amber-700 font-bold">+ ₹{fetchedBill.lateFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 text-sm font-bold text-slate-900">
                    <span>Total Net Clearance:</span>
                    <span className="font-mono text-xl text-blue-900 font-black">
                      ₹{(fetchedBill.amount + fetchedBill.lateFee).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Verified with NPCI Central Switch. Official statutory settlement receipt will be issued immediately.
                  </span>
                </div>
              </div>
            )}
          </div>

          {fetchedBill && (
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => onAddBillToCart(fetchedBill, selectedVertical)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                + Add to Cart
              </button>
              <button
                onClick={() => onPayBill(fetchedBill, selectedVertical)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Pay ₹{(fetchedBill.amount + fetchedBill.lateFee).toLocaleString('en-IN')} via BBPS</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
