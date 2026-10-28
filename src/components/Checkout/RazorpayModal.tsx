import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Building2, 
  Lock, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTitle: string;
  orderAmount: number;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (paymentInfo: {
    paymentId: string;
    mode: string;
    amount: number;
  }) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  orderTitle,
  orderAmount,
  customerDetails = {
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@example.com',
    phone: '+91 98450 12345',
  },
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [selectedBank, setSelectedBank] = useState('Canara Bank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('841');
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [otpValue, setOtpValue] = useState('4819');
  const [qrSeconds, setQrSeconds] = useState(285);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setQrSeconds((prev) => (prev > 1 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProcessPayment = () => {
    if (activeTab === 'card' && !otpStage) {
      setOtpStage(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOtpStage(false);
      const generatedPayId = 'pay_KA_' + Math.floor(100000000 + Math.random() * 900000000);
      const modeLabel = activeTab === 'upi' ? 'UPI (Instant QR)' : activeTab === 'card' ? 'RuPay / Credit Card' : `NetBanking (${selectedBank})`;
      onPaymentSuccess({
        paymentId: generatedPayId,
        mode: modeLabel,
        amount: orderAmount,
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl text-slate-900 overflow-hidden flex flex-col">
        {/* Razorpay Brand Bar */}
        <div className="bg-[#0C2340] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-xs">
              <span className="font-sans text-sm">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-white">RAZORPAY GATEWAY</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                  NPCI SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Merchant: <strong>Karnataka Supplies Hub</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Strip */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="text-xs text-slate-700 font-bold block truncate">{orderTitle}</span>
            <span className="text-[11px] text-slate-500">
              Payer: {customerDetails.name} ({customerDetails.phone})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Payable</span>
            <span className="text-2xl font-black text-blue-900 font-mono">
              ₹{orderAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment Tabs & Content */}
        <div className="p-6 space-y-5">
          {!otpStage ? (
            <>
              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'upi'
                      ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-900" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-900" />
                  <span>Cards / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'netbanking'
                      ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-900" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* UPI Tab */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* Simulated Clean QR Code */}
                    <div className="w-32 h-32 bg-white p-2.5 rounded-xl border-2 border-slate-300 flex flex-col items-center justify-center shadow-xs shrink-0">
                      <div className="grid grid-cols-6 gap-1 w-full h-full bg-slate-900 p-2 rounded">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                                ? 'bg-amber-400'
                                : 'bg-slate-900'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[8px] font-bold text-slate-800 mt-1 uppercase font-mono">
                        SCAN & PAY
                      </span>
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-blue-900 font-mono font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Valid for {formatTimer(qrSeconds)}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-bold">
                        Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI App
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Zero convenience fee on UPI & RuPay debit settlement.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Or Enter Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Card Number (RuPay, Visa, Mastercard)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Participating Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Canara Bank', 'Karnataka Bank', 'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                          selectedBank === b
                            ? 'bg-blue-50 border-blue-900 text-blue-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 mx-auto flex items-center justify-center text-blue-900">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Enter Bank OTP</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sent to registered mobile ending with <strong>...4092</strong>
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-full text-center tracking-[0.4em] text-2xl font-mono font-black py-2.5 bg-slate-50 border-2 border-blue-900 rounded-xl text-blue-900 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Simulated OTP: 4819</span>
              </div>
            </div>
          )}

          {/* Security & Action */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit SSL Encrypted
              </span>
              <span>PCI-DSS Level 1 Compliant</span>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Authorizing with NPCI & RBI Gateway...</span>
                </>
              ) : otpStage ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Verify OTP & Authorize ₹{orderAmount.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Pay ₹{orderAmount.toLocaleString('en-IN')} Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
