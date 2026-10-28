export type AppMode = 'client' | 'operator';

export type TravelVertical = 'flights' | 'trains' | 'buses' | 'charters';

export type UtilityVertical = 
  | 'fastag' 
  | 'electricity' 
  | 'gas' 
  | 'mobile' 
  | 'dth' 
  | 'water' 
  | 'loan' 
  | 'insurance';

export type IndustrialCategory = 'all' | 'valves' | 'electrical' | 'pumps' | 'cables' | 'instruments';

export interface PassengerDetail {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Master' | 'Dr';
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  passengerType: 'Adult' | 'Child' | 'Infant';
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
  passportDocumentName?: string;
  passportDocumentUploaded?: boolean;
  mealPreference?: string;
  seatPreference?: string;
}

export interface PassportVerificationErrorPayload {
  status: 'ERROR' | 'VALIDATED';
  error_code: 'PASSPORT_DETAILS_MISSING' | 'VALIDATION_SUCCESS';
  error_title: string;
  timestamp: string;
  traveler_id: string;
  traveler_name: string;
  route: string;
  flight_number: string;
  mandatory_fields: string[];
  missing_fields: string[];
  field_status: {
    passport_number: 'VALID' | 'MISSING';
    nationality: 'VALID' | 'MISSING';
    date_of_birth: 'VALID' | 'MISSING';
    expiry_date: 'VALID' | 'MISSING' | 'EXPIRED_LESS_6_MONTHS';
    document_upload: 'UPLOADED' | 'MISSING';
  };
  resolution_prompt: string;
  action_required: string;
}

export interface BookingContactInfo {
  email: string;
  phone: string;
  countryCode: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  gstin?: string;
  companyName?: string;
}

export interface FlightItem {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  originCity: string;
  destination: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  isInternational: boolean;
  passportRequired: boolean;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  aircraft: string;
  availableSeats: number;
  cabinClass: 'Economy' | 'Business' | 'First';
  baggage: string;
  refundable: boolean;
}

export interface TrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  originStation: string;
  originCode: string;
  destStation: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: {
    code: '1A' | '2A' | '3A' | 'CC' | 'EC' | 'SL';
    name: string;
    price: number;
    availability: string;
    status: 'AVAILABLE' | 'RAC' | 'WL';
  }[];
}

export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  totalSeats: number;
  availableSeats: number;
  startingPrice: number;
  boardingPoints: string[];
  droppingPoints: string[];
  amenities: string[];
}

export interface SeatInfo {
  id: string;
  number: string;
  deck: 'lower' | 'upper';
  type: 'sleeper' | 'seater';
  berthType?: 'single' | 'double';
  price: number;
  status: 'available' | 'booked' | 'female-reserved' | 'selected';
}

export interface CharterItem {
  id: string;
  model: string;
  manufacturer: string;
  category: 'Midsize Jet' | 'Super Light Jet' | 'Twin Turboprop' | 'Executive Turboprop';
  speedKnots: number;
  rangeKm: number;
  maxPassengers: number;
  hourlyRate: number;
  homeBase: string;
  features: string[];
  crew: string;
  image: string;
}

export interface UtilityProvider {
  id: string;
  name: string;
  vertical: UtilityVertical;
  code: string;
  inputLabel: string;
  placeholder: string;
  regexPattern?: string;
  helperText: string;
}

export interface FetchedBill {
  billerId: string;
  billerName: string;
  consumerId: string;
  customerName: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  amount: number;
  lateFee: number;
  billingPeriod: string;
  status: 'UNPAID' | 'PAID';
  bbpsRefNumber: string;
  additionalDetails?: Record<string, string>;
}

export interface IndustrialProduct {
  id: string;
  name: string;
  category: 'valves' | 'electrical' | 'pumps' | 'cables' | 'instruments';
  sku: string;
  hsnCode: string;
  rating: number;
  reviewsCount: number;
  brand: string;
  unitPrice: number;
  bulkTier5Price: number;
  bulkTier20Price: number;
  stock: number;
  minOrderQty: number;
  specs: Record<string, string>;
  mtcCertified: boolean;
  mtcDetails: {
    standard: string;
    heatNumber: string;
    tensileStrength: string;
    yieldStrength: string;
    chemicalComposition: string;
    certAgency: string;
  };
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  title: string;
  subtitle: string;
  vertical: 'flight' | 'train' | 'bus' | 'charter' | 'bbps' | 'industrial';
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  details: Record<string, any>;
  passengersList?: PassengerDetail[];
  contactInfo?: BookingContactInfo;
}

export interface OperatorRequest {
  id: string;
  bookingRef: string;
  type: 'flight' | 'train' | 'bus' | 'charter' | 'bbps' | 'industrial_rfq' | 'industrial_order';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  sectorOrAccount: string;
  amount: number;
  status: 'PENDING_PNR' | 'PNR_ISSUED' | 'CLEARED' | 'RFQ_OPEN' | 'RFQ_QUOTED' | 'DISPATCHED' | 'REJECTED';
  pnrNumber?: string;
  seatOrBerth?: string;
  notes?: string;
  createdAt: string;
  paidAt?: string;
  paymentMode?: string;
  gstin?: string;
  invoiceNumber?: string;
  passengersList?: PassengerDetail[];
  contactInfo?: BookingContactInfo;
}

export interface RFQSubmission {
  productId: string;
  productName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  siteLocation: string;
  quantity: number;
  targetTimeline: string;
  specialRequirements: string;
}
