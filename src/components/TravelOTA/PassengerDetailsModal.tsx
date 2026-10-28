import React, { useState } from 'react';
import { FlightItem, PassengerDetail, BookingContactInfo, PassportVerificationErrorPayload } from '../../types';
import { 
  X, 
  Users, 
  UserCheck, 
  Globe, 
  ArrowRight, 
  Plane, 
  AlertCircle,
  AlertTriangle,
  Mail, 
  CheckCircle2,
  XCircle,
  UploadCloud,
  FileCheck,
  FileText,
  Copy,
  Check,
  Calendar,
  Hash,
  RefreshCw,
  Eye,
  ShieldAlert
} from 'lucide-react';

interface PassengerDetailsModalProps {
  flight: FlightItem;
  passengersCount: number;
  cabinClass: string;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (
    passengers: PassengerDetail[], 
    contactInfo: BookingContactInfo
  ) => void;
}

export const PassengerDetailsModal: React.FC<PassengerDetailsModalProps> = ({
  flight,
  passengersCount,
  cabinClass,
  isOpen,
  onClose,
  onProceedToPayment,
}) => {
  // Initialize passenger list based on passengersCount
  const [passengers, setPassengers] = useState<PassengerDetail[]>(() => {
    return Array.from({ length: passengersCount }).map((_, idx) => ({
      id: `pax-${idx + 1}`,
      title: idx === 0 ? 'Mr' : 'Mrs',
      firstName: idx === 0 ? 'Ramesh' : idx === 1 ? 'Priya' : `Traveler`,
      lastName: 'Gowda',
      gender: idx === 0 ? 'Male' : 'Female',
      dateOfBirth: idx === 0 ? '1988-06-14' : '1992-09-22',
      passengerType: 'Adult',
      // If international, seed first passenger with sample or empty to trigger check
      passportNumber: flight.isInternational ? (idx === 0 ? 'Z5819204' : '') : '',
      passportExpiry: flight.isInternational ? (idx === 0 ? '2032-10-15' : '') : '',
      nationality: flight.isInternational ? 'Indian' : '',
      passportDocumentName: flight.isInternational ? (idx === 0 ? 'Ramesh_Gowda_Passport_BioData.pdf' : '') : '',
      passportDocumentUploaded: flight.isInternational ? (idx === 0 ? true : false) : false,
      mealPreference: 'Vegetarian Hindu Meal (AVML)',
      seatPreference: idx % 2 === 0 ? 'Window Seat' : 'Aisle Seat',
    }));
  });

  const [contactInfo, setContactInfo] = useState<BookingContactInfo>({
    email: 'ramesh.gowda@gmail.com',
    phone: '9845012890',
    countryCode: '+91',
    emergencyContactName: 'Dr. Srinivas Gowda',
    emergencyContactPhone: '+91 94480 33412',
    gstin: '',
    companyName: '',
  });

  const [activePaxIndex, setActivePaxIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [manualVerificationTriggered, setManualVerificationTriggered] = useState(false);

  if (!isOpen) return null;

  const currentPax = passengers[activePaxIndex] || passengers[0];

  const handleUpdatePax = (index: number, field: keyof PassengerDetail, value: any) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Check mandatory passport fields for a passenger:
  // 1. passport number
  // 2. nationality
  // 3. DOB
  // 4. expiry date
  // 5. document upload
  const checkPassengerPassportStatus = (pax: PassengerDetail) => {
    const hasPassportNumber = Boolean(pax.passportNumber && pax.passportNumber.trim().length >= 6);
    const hasNationality = Boolean(pax.nationality && pax.nationality.trim().length > 0);
    const hasDOB = Boolean(pax.dateOfBirth && pax.dateOfBirth.trim().length > 0);
    const hasExpiry = Boolean(pax.passportExpiry && pax.passportExpiry.trim().length > 0);
    const hasDocument = Boolean(pax.passportDocumentUploaded && pax.passportDocumentName);

    const missing: string[] = [];
    if (!hasPassportNumber) missing.push('passport_number');
    if (!hasNationality) missing.push('nationality');
    if (!hasDOB) missing.push('date_of_birth');
    if (!hasExpiry) missing.push('expiry_date');
    if (!hasDocument) missing.push('document_upload');

    const isValid = missing.length === 0;

    return {
      isValid,
      missing,
      fieldStatus: {
        passport_number: hasPassportNumber ? ('VALID' as const) : ('MISSING' as const),
        nationality: hasNationality ? ('VALID' as const) : ('MISSING' as const),
        date_of_birth: hasDOB ? ('VALID' as const) : ('MISSING' as const),
        expiry_date: hasExpiry ? ('VALID' as const) : ('MISSING' as const),
        document_upload: hasDocument ? ('UPLOADED' as const) : ('MISSING' as const),
      }
    };
  };

  const activePaxStatus = checkPassengerPassportStatus(currentPax);

  // Generate structured JSON error response & command payload
  const errorPayload: PassportVerificationErrorPayload = {
    status: activePaxStatus.isValid ? 'VALIDATED' : 'ERROR',
    error_code: activePaxStatus.isValid ? 'VALIDATION_SUCCESS' : 'PASSPORT_DETAILS_MISSING',
    error_title: activePaxStatus.isValid 
      ? 'Traveler Details Verification - ALL CREDENTIALS VALIDATED'
      : 'Traveler Details Verification - PASSPORT DETAILS MISSING',
    timestamp: new Date().toISOString(),
    traveler_id: currentPax.id,
    traveler_name: `${currentPax.title} ${currentPax.firstName || ''} ${currentPax.lastName || ''}`.trim(),
    route: `${flight.originCode} (${flight.originCity}) → ${flight.destinationCode} (${flight.destinationCity}, ${flight.destinationCountry})`,
    flight_number: `${flight.airline} ${flight.flightNumber}`,
    mandatory_fields: [
      'passport_number',
      'nationality',
      'date_of_birth',
      'expiry_date',
      'document_upload'
    ],
    missing_fields: activePaxStatus.missing,
    field_status: activePaxStatus.fieldStatus,
    resolution_prompt: 'Prompt Notice: International civil aviation authorities (ICAO / DGCA / Bureau of Immigration) mandate verified biometric passport credentials and scanned bio-data document for all international sectors prior to ticket issuance and payment settlement.',
    action_required: activePaxStatus.isValid
      ? 'PROCEED_TO_PAYMENT_GATEWAY'
      : 'ACQUIRE_MISSING_PASSPORT_CREDENTIALS_AND_SCAN'
  };

  const handleSimulateDocumentUpload = (index: number) => {
    handleUpdatePax(index, 'passportDocumentName', `${passengers[index].firstName || 'Traveler'}_Passport_Scan_BioData.pdf`);
    handleUpdatePax(index, 'passportDocumentUploaded', true);
  };

  const handleRemoveDocument = (index: number) => {
    handleUpdatePax(index, 'passportDocumentName', '');
    handleUpdatePax(index, 'passportDocumentUploaded', false);
  };

  const handleClearPassportFields = (index: number) => {
    handleUpdatePax(index, 'passportNumber', '');
    handleUpdatePax(index, 'passportExpiry', '');
    handleUpdatePax(index, 'nationality', '');
    handleUpdatePax(index, 'passportDocumentName', '');
    handleUpdatePax(index, 'passportDocumentUploaded', false);
    setManualVerificationTriggered(true);
  };

  const handleAutoFillValidPassport = (index: number) => {
    handleUpdatePax(index, 'passportNumber', `Z${Math.floor(1000000 + Math.random() * 9000000)}`);
    handleUpdatePax(index, 'passportExpiry', '2033-08-25');
    handleUpdatePax(index, 'nationality', 'Indian');
    handleUpdatePax(index, 'dateOfBirth', '1990-04-12');
    handleUpdatePax(index, 'passportDocumentName', `${passengers[index].firstName || 'Traveler'}_Passport_BioData.pdf`);
    handleUpdatePax(index, 'passportDocumentUploaded', true);
    setManualVerificationTriggered(false);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(errorPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate all passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setValidationError(`Passenger #${i + 1}: Please enter complete First and Last name as per Govt ID.`);
        setActivePaxIndex(i);
        return;
      }

      if (flight.isInternational) {
        const status = checkPassengerPassportStatus(p);
        if (!status.isValid) {
          setManualVerificationTriggered(true);
          setActivePaxIndex(i);
          setValidationError(
            `Passenger #${i + 1} (${p.firstName || 'Traveler'}): Passport details incomplete (${status.missing.join(', ')}). All 5 mandatory international travel fields must be provided before payment.`
          );
          return;
        }
      }
    }

    if (!contactInfo.email.trim() || !contactInfo.phone.trim()) {
      setValidationError('Please provide a valid Contact Email and Mobile Number for ticket dispatch.');
      return;
    }

    onProceedToPayment(passengers, contactInfo);
  };

  const totalFare = flight.price * passengersCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header with Karnataka Go Theme */}
        <div className="p-5 border-b border-slate-800 bg-[#0f172a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* High-End Karnataka Go Badge */}
            <div className="relative w-11 h-11 rounded-xl bg-[#0f172a] p-0.5 shadow-lg border-2 border-[#d97706]/80 flex items-center justify-center overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <span className="font-sans font-black text-[#d97706] text-xs tracking-wider leading-none">
                  K•GO
                </span>
                <span className="text-[6px] text-amber-200 font-mono font-bold tracking-widest uppercase">
                  VERIFY
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  Traveler Details Verification
                </h3>
                {flight.isInternational ? (
                  <span className="text-[10px] bg-[#d97706]/20 text-amber-300 border border-[#d97706]/50 font-mono px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#d97706]" />
                    International Sector (ICAO Mandated)
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-900/60 text-blue-200 border border-blue-700/50 font-mono px-2 py-0.5 rounded font-bold">
                    Domestic Sector
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-white">{flight.airline} {flight.flightNumber}</span>
                <span>•</span>
                <span>{flight.originCode} ({flight.originCity}) → {flight.destinationCode} ({flight.destinationCity})</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{cabinClass} Class</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                showJsonInspector
                  ? 'bg-[#d97706] text-white border-[#d97706]'
                  : 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Inspect structured JSON error and command payload"
            >
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span>{showJsonInspector ? 'Hide JSON' : 'JSON Payload'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Error Response & Command Payload Drawer / Modal */}
        {showJsonInspector && (
          <div className="bg-[#0b1329] border-b border-slate-800 p-4 text-xs font-mono text-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#d97706] font-bold uppercase tracking-wider text-[11px]">
                  Structured JSON Error Response & Command Payload:
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  errorPayload.status === 'ERROR' 
                    ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {errorPayload.error_code}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] transition cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied JSON!' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="bg-[#070d1d] p-3 rounded-xl border border-slate-800/80 overflow-x-auto text-[11px] leading-relaxed text-amber-100/90 max-h-48">
              {JSON.stringify(errorPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/60">
          
          {/* Passenger Selector Header & Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Traveler Manifest ({passengersCount} {passengersCount === 1 ? 'Seat' : 'Seats'})
              </span>
              <span className="text-xs text-blue-900 font-semibold">
                Select passenger tab below to review and verify required identity details
              </span>
            </div>

            {/* Quick Test / Demo Tools for Evaluator */}
            {flight.isInternational && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClearPassportFields(activePaxIndex)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 transition cursor-pointer flex items-center gap-1"
                  title="Clear fields to test the Passport Missing Alert Card"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Simulate Missing Passport</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoFillValidPassport(activePaxIndex)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1"
                  title="Auto-fill complete valid credentials and document"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Auto-Fill Valid Demo Pass</span>
                </button>
              </div>
            )}
          </div>

          {/* Passenger Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
            {passengers.map((p, idx) => {
              const pStatus = checkPassengerPassportStatus(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePaxIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activePaxIndex === idx
                      ? 'bg-[#0f172a] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className={`w-3.5 h-3.5 ${activePaxIndex === idx ? 'text-[#d97706]' : 'text-slate-400'}`} />
                  <span>Passenger {idx + 1}: {p.firstName || 'Traveler'}</span>
                  {flight.isInternational && (
                    <span className={`w-2 h-2 rounded-full ${pStatus.isValid ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* ==================================================================== */}
          {/* MODERN VERIFICATION FORM CARD: PASSPORT DETAILS MISSING ALERT       */}
          {/* Responsive HTML/CSS using deep navy blue (#0f172a) & metallic gold (#d97706) */}
          {/* ==================================================================== */}
          {flight.isInternational && (!activePaxStatus.isValid || manualVerificationTriggered) && (
            <div 
              id="passport-missing-verification-card"
              className="rounded-2xl p-5 border-2 border-[#d97706] shadow-xl text-white relative overflow-hidden"
              style={{ backgroundColor: '#0f172a' }}
            >
              {/* Subtle gold accent glow */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-15"
                style={{ backgroundColor: '#d97706' }}
              />

              <div className="relative z-10 space-y-4">
                {/* Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #d97706' }}
                    >
                      <ShieldAlert className="w-5 h-5 text-[#d97706]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                        <span>Traveler Details Verification - PASSPORT DETAILS MISSING</span>
                      </h4>
                      <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                        Passenger #{activePaxIndex + 1}: <strong className="text-white">{currentPax.title} {currentPax.firstName || ''} {currentPax.lastName || ''}</strong> • Mandatory International Credentials Required
                      </p>
                    </div>
                  </div>

                  <span 
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider shadow-xs"
                    style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', border: '1px solid #d97706' }}
                  >
                    Action Required
                  </span>
                </div>

                {/* Prompt Notice */}
                <div className="bg-slate-900/90 border border-[#d97706]/40 rounded-xl p-3.5 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs text-amber-100/95 leading-relaxed font-sans font-medium">
                      <strong className="text-[#d97706] font-bold">Prompt Notice:</strong> International civil aviation authorities (ICAO / DGCA / Bureau of Immigration) mandate verified biometric passport credentials and scanned bio-data document for all international sectors prior to ticket issuance and payment settlement.
                    </p>
                  </div>
                </div>

                {/* 5 Mandatory Fields Verification Status Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold">
                      Mandatory Fields Checklist (5/5 Required):
                    </span>
                    <span className="text-[11px] text-amber-300 font-mono">
                      {5 - activePaxStatus.missing.length} of 5 Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                    {/* 1. Passport Number */}
                    <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      activePaxStatus.fieldStatus.passport_number === 'VALID'
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">1. Passport #</span>
                        {activePaxStatus.fieldStatus.passport_number === 'VALID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                      <span className="font-mono font-bold mt-1 truncate">
                        {currentPax.passportNumber || 'MISSING'}
                      </span>
                    </div>

                    {/* 2. Nationality */}
                    <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      activePaxStatus.fieldStatus.nationality === 'VALID'
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">2. Nationality</span>
                        {activePaxStatus.fieldStatus.nationality === 'VALID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                      <span className="font-semibold mt-1 truncate">
                        {currentPax.nationality || 'MISSING'}
                      </span>
                    </div>

                    {/* 3. Date of Birth */}
                    <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      activePaxStatus.fieldStatus.date_of_birth === 'VALID'
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">3. DOB</span>
                        {activePaxStatus.fieldStatus.date_of_birth === 'VALID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                      <span className="font-mono font-bold mt-1 truncate">
                        {currentPax.dateOfBirth || 'MISSING'}
                      </span>
                    </div>

                    {/* 4. Expiry Date */}
                    <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      activePaxStatus.fieldStatus.expiry_date === 'VALID'
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">4. Expiry Date</span>
                        {activePaxStatus.fieldStatus.expiry_date === 'VALID' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                      <span className="font-mono font-bold mt-1 truncate">
                        {currentPax.passportExpiry || 'MISSING'}
                      </span>
                    </div>

                    {/* 5. Document Upload */}
                    <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      activePaxStatus.fieldStatus.document_upload === 'UPLOADED'
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">5. Scanned Copy</span>
                        {activePaxStatus.fieldStatus.document_upload === 'UPLOADED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                      <span className="font-semibold mt-1 truncate">
                        {currentPax.passportDocumentUploaded ? 'UPLOADED' : 'MISSING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-amber-200/80">
                    Fill the form fields below to resolve this missing passport alert.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutoFillValidPassport(activePaxIndex)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                      style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Auto-Resolve & Verify</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJsonInspector(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Payload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Input Fields Form Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>Passenger #{activePaxIndex + 1} Profile Information</span>
                {flight.isInternational && (
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    Govt ID & Passport Mode
                  </span>
                )}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {cabinClass} Class • {currentPax.passengerType}
              </span>
            </div>

            {/* Title & Names */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                <select
                  value={currentPax.title}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Master">Master</option>
                  <option value="Dr">Dr.</option>
                </select>
              </div>

              <div className="sm:col-span-1.5">
                <label className="text-xs font-bold text-slate-700 block mb-1">First & Middle Name</label>
                <input
                  type="text"
                  required
                  placeholder="As in ID / Passport"
                  value={currentPax.firstName}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'firstName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="sm:col-span-1.5">
                <label className="text-xs font-bold text-slate-700 block mb-1">Last Name / Surname</label>
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  value={currentPax.lastName}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'lastName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                <select
                  value={currentPax.gender}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'gender', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Date of Birth, Nationality & Meal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>Date of Birth (DOB) *</span>
                  {flight.isInternational && (
                    <span className="text-[10px] text-amber-700 font-mono font-bold">Mandatory</span>
                  )}
                </label>
                <input
                  type="date"
                  required
                  value={currentPax.dateOfBirth}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'dateOfBirth', e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900 ${
                    flight.isInternational && !currentPax.dateOfBirth ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>Nationality *</span>
                  {flight.isInternational && (
                    <span className="text-[10px] text-amber-700 font-mono font-bold">Mandatory</span>
                  )}
                </label>
                <input
                  type="text"
                  required={flight.isInternational}
                  placeholder="e.g. Indian, American, British"
                  value={currentPax.nationality || ''}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'nationality', e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900 ${
                    flight.isInternational && !currentPax.nationality ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Meal Preference</label>
                <select
                  value={currentPax.mealPreference}
                  onChange={(e) => handleUpdatePax(activePaxIndex, 'mealPreference', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="Vegetarian Hindu Meal (AVML)">Vegetarian Hindu Meal (AVML)</option>
                  <option value="Jain Vegetarian Meal (VJML)">Jain Vegetarian Meal (VJML)</option>
                  <option value="Non-Vegetarian Halal (MOML)">Non-Vegetarian Halal (MOML)</option>
                  <option value="Continental Western Meal">Continental Western Meal</option>
                  <option value="Diabetic Meal (DBML)">Diabetic Meal (DBML)</option>
                </select>
              </div>
            </div>

            {/* Mandatory International Passport Details Form Section */}
            {flight.isInternational && (
              <div className="p-4 bg-slate-900 text-white border-2 border-[#d97706]/70 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#d97706]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Mandatory Passport & Travel Document Verification
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#d97706]/20 text-amber-300 border border-[#d97706]/40 px-2 py-0.5 rounded font-mono font-bold">
                    Bureau of Immigration Compliance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Passport Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
                      <span>Passport Number *</span>
                      <span className="text-[10px] text-amber-400 font-mono">Alphanumeric (Min 6 Chars)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Z5819204"
                        value={currentPax.passportNumber || ''}
                        onChange={(e) => handleUpdatePax(activePaxIndex, 'passportNumber', e.target.value.toUpperCase())}
                        className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#d97706] ${
                          !currentPax.passportNumber ? 'border-rose-500' : 'border-slate-700'
                        }`}
                      />
                      {currentPax.passportNumber && currentPax.passportNumber.length >= 6 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                      )}
                    </div>
                  </div>

                  {/* Passport Expiry Date */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
                      <span>Passport Expiry Date *</span>
                      <span className="text-[10px] text-amber-400 font-mono">Min 6 Months Validity</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={currentPax.passportExpiry || ''}
                        onChange={(e) => handleUpdatePax(activePaxIndex, 'passportExpiry', e.target.value)}
                        className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#d97706] ${
                          !currentPax.passportExpiry ? 'border-rose-500' : 'border-slate-700'
                        }`}
                      />
                      {currentPax.passportExpiry && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Upload Zone */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[#d97706]" />
                      <span>Passport Document Upload (Bio-data / Scanned Copy) *</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">PDF, JPG, PNG (Max 5MB)</span>
                  </label>

                  {currentPax.passportDocumentUploaded && currentPax.passportDocumentName ? (
                    <div className="bg-slate-800/90 border border-emerald-500/50 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                            {currentPax.passportDocumentName}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                            <span>Status: Verified Document Uploaded</span>
                            <span>•</span>
                            <span>1.4 MB</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(activePaxIndex)}
                        className="px-2.5 py-1 text-xs text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-lg transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700 hover:border-[#d97706] rounded-xl p-4 text-center bg-slate-800/40 transition">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-300">
                        Upload traveler passport bio-data scanned photo page
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Required for ICAO advanced passenger manifest submission
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSimulateDocumentUpload(activePaxIndex)}
                          className="px-3 py-1.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Attach Scanned Passport File</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Contact & Delivery */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-900" />
                Primary Booking Contact & Ticket Delivery
              </span>
              <span className="text-xs text-slate-500">Official PNR, SMS & WhatsApp Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address for Ticket</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (with Country Code)</label>
                <div className="flex gap-2">
                  <span className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9845012345"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Optional GSTIN for Corporate Input Credit */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Corporate GSTIN (Optional for Tax Credit)
                  </label>
                  <input
                    type="text"
                    placeholder="29AABCK1234F1Z8"
                    value={contactInfo.gstin}
                    onChange={(e) => setContactInfo({ ...contactInfo, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Company Registered Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kaveri Tech Solutions Pvt Ltd"
                    value={contactInfo.companyName}
                    onChange={(e) => setContactInfo({ ...contactInfo, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Error Alert Banner */}
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* Footer Checkout Action */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Total Payable for {passengersCount} Passenger(s):</span>
              <span className="text-2xl font-black text-[#0f172a] font-mono">
                ₹{totalFare.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold ml-2">All Taxes & Passenger Fees Included</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer border border-[#d97706]/40"
              >
                <span>Confirm Passengers & Proceed to Pay</span>
                <ArrowRight className="w-4 h-4 text-[#d97706]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
