import React, { useState } from 'react';
import { 
  AppMode, 
  TravelVertical, 
  UtilityVertical, 
  FlightItem, 
  TrainItem, 
  BusItem, 
  CharterItem, 
  SeatInfo, 
  FetchedBill, 
  IndustrialProduct, 
  CartItem, 
  OperatorRequest, 
  RFQSubmission,
  PassengerDetail,
  BookingContactInfo
} from './types';
import { INITIAL_OPERATOR_REQUESTS } from './data/mockData';
import { Header } from './components/Header';
import { TravelSection } from './components/TravelOTA/TravelSection';
import { BBPSSection } from './components/BBPS/BBPSSection';
import { IndustrialSection } from './components/Industrial/IndustrialSection';
import { OperatorDesk } from './components/OperatorDesk/OperatorDesk';
import { MyBookings } from './components/MyBookings';
import { RazorpayModal } from './components/Checkout/RazorpayModal';
import { CartDrawer } from './components/Checkout/CartDrawer';
import { TicketModal } from './components/Documents/TicketModal';
import { 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<AppMode>('client');
  const [activeNav, setActiveNav] = useState<'travel' | 'bbps' | 'industrial' | 'my-orders'>('travel');
  const [travelTab, setTravelTab] = useState<TravelVertical>('flights');

  // Unified Request / Booking Queue
  const [requests, setRequests] = useState<OperatorRequest[]>(INITIAL_OPERATOR_REQUESTS);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Razorpay Gateway Simulator State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<{
    title: string;
    amount: number;
    pendingAction?: () => void;
  }>({
    title: 'Karnataka Supplies Hub Transaction',
    amount: 0,
  });

  // Ticket / Document Modal State
  const [activeTicketRequest, setActiveTicketRequest] = useState<OperatorRequest | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Travel Booking Handlers
  const handleBookFlightWithPassengers = (
    flight: FlightItem, 
    pax: number, 
    cabinClass: string,
    passengersList: PassengerDetail[],
    contactInfo: BookingContactInfo
  ) => {
    const totalAmount = flight.price * pax;
    const primaryName = passengersList.length > 0 
      ? `${passengersList[0].title} ${passengersList[0].firstName} ${passengersList[0].lastName}`
      : 'Primary Traveler';

    setRazorpayOrder({
      title: `${flight.airline} ${flight.flightNumber} (${flight.originCode} → ${flight.destinationCode}) x ${pax} Pax`,
      amount: totalAmount,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: (flight.isInternational ? 'KGO-INTL-' : 'KGO-FL-') + Math.floor(10000 + Math.random() * 90000),
          type: 'flight',
          customerName: primaryName,
          customerEmail: contactInfo.email,
          customerPhone: `${contactInfo.countryCode} ${contactInfo.phone}`,
          serviceTitle: `${flight.airline} ${flight.flightNumber} (${flight.destinationCity})`,
          sectorOrAccount: `${flight.originCity} (${flight.originCode}) to ${flight.destinationCity} (${flight.destinationCode}, ${flight.destinationCountry}) | ${pax} Traveler(s) | ${cabinClass}`,
          amount: totalAmount,
          status: 'PENDING_PNR',
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'Razorpay UPI / NetBanking',
          gstin: contactInfo.gstin,
          invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
          passengersList: passengersList,
          contactInfo: contactInfo,
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast(`${flight.airline} ${flight.isInternational ? 'International' : 'Domestic'} flight booked! Official PNR queued in Operator Desk.`);
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddFlightToCart = (flight: FlightItem, pax: number, cabinClass: string) => {
    const newItem: CartItem = {
      id: flight.id,
      cartItemId: 'cart-' + Date.now(),
      title: `${flight.airline} ${flight.flightNumber} (${flight.originCode} → ${flight.destinationCode})`,
      subtitle: `${flight.departureTime} • ${cabinClass} • ${pax} Traveler(s)`,
      vertical: 'flight',
      quantity: pax,
      unitPrice: flight.price,
      taxPercent: 5,
      details: { flight, cabinClass },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${flight.airline} flight to cart.`);
  };

  const handleBookTrain = (train: TrainItem, cls: TrainItem['classes'][0], quota: string) => {
    const finalPrice = quota === 'Tatkal' ? Math.round(cls.price * 1.25) : cls.price;
    setRazorpayOrder({
      title: `IRCTC: ${train.trainName} #${train.trainNumber} (${cls.code} - ${quota})`,
      amount: finalPrice,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: 'KGO-TR-' + Math.floor(10000 + Math.random() * 90000),
          type: 'train',
          customerName: 'Suresh Kumar Naik',
          customerEmail: 'suresh.naik@techkarnataka.in',
          customerPhone: '+91 94481 22904',
          serviceTitle: `${train.trainName} #${train.trainNumber}`,
          sectorOrAccount: `${train.originCode} to ${train.destCode} | ${cls.name} (${quota} Quota)`,
          amount: finalPrice,
          status: 'PNR_ISSUED',
          pnrNumber: '4819-' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(100 + Math.random() * 900),
          seatOrBerth: `Coach ${cls.code === 'EC' || cls.code === 'CC' ? 'C1' : 'B2'}, Berth 32 (Window)`,
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'NetBanking (Canara Bank)',
          invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast('IRCTC Train ticket confirmed with PNR!');
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddTrainToCart = (train: TrainItem, cls: TrainItem['classes'][0], quota: string) => {
    const finalPrice = quota === 'Tatkal' ? Math.round(cls.price * 1.25) : cls.price;
    const newItem: CartItem = {
      id: train.id,
      cartItemId: 'cart-' + Date.now(),
      title: `${train.trainName} #${train.trainNumber}`,
      subtitle: `${train.originCode} → ${train.destCode} | Class ${cls.code} (${quota})`,
      vertical: 'train',
      quantity: 1,
      unitPrice: finalPrice,
      taxPercent: 0,
      details: { train, cls, quota },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${train.trainName} to cart.`);
  };

  const handleBookBus = (bus: BusItem, seats: SeatInfo[], boarding: string, dropping: string) => {
    const totalAmount = seats.reduce((s, it) => s + it.price, 0);
    setRazorpayOrder({
      title: `${bus.operator} (${seats.length} Berths: ${seats.map(s => s.number).join(', ')})`,
      amount: totalAmount,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: 'KGO-BUS-' + Math.floor(10000 + Math.random() * 90000),
          type: 'bus',
          customerName: 'Vinayaka Bhat',
          customerEmail: 'vinayaka.bhat@karnatakatour.in',
          customerPhone: '+91 97401 55678',
          serviceTitle: `${bus.operator} (${bus.busType})`,
          sectorOrAccount: `${bus.origin} to ${bus.destination} | Boarding: ${boarding}`,
          amount: totalAmount,
          status: 'PNR_ISSUED',
          pnrNumber: 'KSRTC-VOL-' + Math.floor(10000 + Math.random() * 90000),
          seatOrBerth: `Seats: ${seats.map(s => s.number).join(', ')}`,
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'UPI (QR Code)',
          invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast('Bus sleeper seats confirmed!');
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddBusToCart = (bus: BusItem, seats: SeatInfo[], boarding: string, dropping: string) => {
    const totalAmount = seats.reduce((s, it) => s + it.price, 0);
    const newItem: CartItem = {
      id: bus.id,
      cartItemId: 'cart-' + Date.now(),
      title: `${bus.operator} (${bus.origin} → ${bus.destination})`,
      subtitle: `${seats.length} Berth(s): ${seats.map(s => s.number).join(', ')} • ${boarding}`,
      vertical: 'bus',
      quantity: 1,
      unitPrice: totalAmount,
      taxPercent: 5,
      details: { bus, seats, boarding, dropping },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${bus.operator} seats to cart.`);
  };

  const handleBookCharter = (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => {
    setRazorpayOrder({
      title: `Executive Charter: ${charter.model} (${origin} → ${dest})`,
      amount: totalEst,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: 'KGO-CHT-' + Math.floor(10000 + Math.random() * 90000),
          type: 'charter',
          customerName: 'InfraCorp Karnataka Ltd',
          customerEmail: 'executive@infracorp.ka.gov.in',
          customerPhone: '+91 99000 88123',
          serviceTitle: `${charter.model} (${charter.manufacturer})`,
          sectorOrAccount: `${origin} to ${dest} | ${pax} VIP Pax | ${date}`,
          amount: totalEst,
          status: 'PNR_ISSUED',
          pnrNumber: 'DGCA-FLT-CHT-' + Math.floor(1000 + Math.random() * 9000),
          seatOrBerth: `${pax} Executive Leather Club Seats`,
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'Corporate RTGS',
          gstin: '29AABCI9021L1Z0',
          invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast('Private Charter flight reserved!');
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddCharterToCart = (charter: CharterItem, origin: string, dest: string, date: string, pax: number, totalEst: number) => {
    const newItem: CartItem = {
      id: charter.id,
      cartItemId: 'cart-' + Date.now(),
      title: `${charter.model} Executive Jet`,
      subtitle: `${origin} → ${dest} • ${pax} Pax`,
      vertical: 'charter',
      quantity: 1,
      unitPrice: totalEst,
      taxPercent: 0,
      details: { charter, origin, dest, date, pax },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${charter.model} charter to cart.`);
  };

  // 2. BBPS Utility Handlers
  const handlePayBBPSBill = (bill: FetchedBill, vertical: UtilityVertical) => {
    const totalToPay = bill.amount + bill.lateFee;
    setRazorpayOrder({
      title: `BBPS Clearance: ${bill.billerName} (Ref: ${bill.consumerId})`,
      amount: totalToPay,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: 'KGO-BBPS-' + Math.floor(10000 + Math.random() * 90000),
          type: 'bbps',
          customerName: bill.customerName,
          customerEmail: 'billing@enterprise.in',
          customerPhone: '+91 98450 12345',
          serviceTitle: bill.billerName,
          sectorOrAccount: `Acc #${bill.consumerId} | ${bill.billingPeriod}`,
          amount: totalToPay,
          status: 'CLEARED',
          pnrNumber: bill.bbpsRefNumber,
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'BBPS Central Switch',
          invoiceNumber: 'BBPS-REC-' + Math.floor(1000 + Math.random() * 9000),
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast('BBPS Bill cleared with NPCI settlement reference!');
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddBillToCart = (bill: FetchedBill, vertical: UtilityVertical) => {
    const newItem: CartItem = {
      id: bill.bbpsRefNumber,
      cartItemId: 'cart-' + Date.now(),
      title: `BBPS: ${bill.billerName}`,
      subtitle: `Consumer #${bill.consumerId} • Due: ${bill.dueDate}`,
      vertical: 'bbps',
      quantity: 1,
      unitPrice: bill.amount + bill.lateFee,
      taxPercent: 0,
      details: { bill, vertical },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${bill.billerName} bill to cart.`);
  };

  // 3. Industrial Supplies Handlers
  const handleBuyIndustrial = (product: IndustrialProduct, qty: number, unitPrice: number) => {
    const totalCost = qty * unitPrice;
    setRazorpayOrder({
      title: `B2B Hardware: ${qty}x ${product.name}`,
      amount: totalCost,
      pendingAction: () => {
        const newReq: OperatorRequest = {
          id: 'req-' + Date.now(),
          bookingRef: 'KGO-ORD-' + Math.floor(10000 + Math.random() * 90000),
          type: 'industrial_order',
          customerName: 'Peenya Machining & Forge Pvt Ltd',
          customerEmail: 'purchase@peenyamachining.com',
          customerPhone: '+91 98440 19283',
          serviceTitle: `${qty}x ${product.name}`,
          sectorOrAccount: `SKU: ${product.sku} | Peenya Industrial Estate`,
          amount: totalCost,
          status: 'DISPATCHED',
          pnrNumber: 'MTC-BATCH-' + product.mtcDetails.heatNumber,
          createdAt: 'Just now',
          paidAt: 'Just now',
          paymentMode: 'Corporate Card',
          gstin: '29AABCP9910N1Z5',
          invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
        };
        setRequests((prev) => [newReq, ...prev]);
        setActiveTicketRequest(newReq);
        setIsTicketModalOpen(true);
        showToast('B2B Industrial wholesale order placed!');
      },
    });
    setIsRazorpayOpen(true);
  };

  const handleAddIndustrialToCart = (product: IndustrialProduct, qty: number, unitPrice: number) => {
    const newItem: CartItem = {
      id: product.id,
      cartItemId: 'cart-' + Date.now(),
      title: product.name,
      subtitle: `SKU: ${product.sku} • MTC 3.1 Certified`,
      vertical: 'industrial',
      quantity: qty,
      unitPrice: unitPrice,
      taxPercent: 18,
      details: { product },
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${qty}x ${product.name} to cart.`);
  };

  const handleSubmitRFQ = (rfq: RFQSubmission) => {
    const newReq: OperatorRequest = {
      id: 'req-' + Date.now(),
      bookingRef: 'KGO-RFQ-' + Math.floor(10000 + Math.random() * 90000),
      type: 'industrial_rfq',
      customerName: rfq.companyName,
      customerEmail: rfq.email,
      customerPhone: rfq.phone,
      serviceTitle: `RFQ: ${rfq.quantity}x ${rfq.productName}`,
      sectorOrAccount: `${rfq.siteLocation} | Timeline: ${rfq.targetTimeline}`,
      amount: 0,
      status: 'RFQ_OPEN',
      createdAt: 'Just now',
      gstin: rfq.gstin,
      notes: rfq.specialRequirements,
    };
    setRequests((prev) => [newReq, ...prev]);
    showToast('B2B RFQ transmitted to Master Operator Desk! Operator reviewing quotation.');
  };

  // 4. Cart Drawer Handlers
  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
  };

  const handleUpdateCartQuantity = (cartItemId: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity: qty } : it))
    );
  };

  const handleProceedCartCheckout = (totalAmount: number, items: CartItem[]) => {
    setIsCartOpen(false);
    setRazorpayOrder({
      title: `Batch Checkout: ${items.length} Items (Travel + Utilities + Supplies)`,
      amount: totalAmount,
      pendingAction: () => {
        items.forEach((it) => {
          const reqType = it.vertical === 'flight' ? 'flight' : it.vertical === 'train' ? 'train' : it.vertical === 'bus' ? 'bus' : it.vertical === 'charter' ? 'charter' : it.vertical === 'bbps' ? 'bbps' : 'industrial_order';
          const newReq: OperatorRequest = {
            id: 'req-' + Date.now() + '-' + Math.random().toString(36).substring(7),
            bookingRef: 'KGO-BATCH-' + Math.floor(10000 + Math.random() * 90000),
            type: reqType,
            customerName: 'Consolidated Enterprise Buyer',
            customerEmail: 'billing@enterprise.ka.gov.in',
            customerPhone: '+91 98450 99881',
            serviceTitle: it.title,
            sectorOrAccount: it.subtitle,
            amount: it.unitPrice * it.quantity,
            status: reqType === 'bbps' ? 'CLEARED' : reqType === 'flight' ? 'PENDING_PNR' : 'PNR_ISSUED',
            pnrNumber: 'BATCH-PNR-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: 'Just now',
            paidAt: 'Just now',
            paymentMode: 'Unified Razorpay Batch',
            invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
          };
          setRequests((prev) => [newReq, ...prev]);
        });
        setCartItems([]);
        showToast('All batch cart items successfully processed!');
        setActiveNav('my-orders');
      },
    });
    setIsRazorpayOpen(true);
  };

  // 5. Operator Fulfillment Handlers
  const handleOperatorIssuePNR = (requestId: string, pnrNumber: string, seatOrBerth?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'PNR_ISSUED',
              pnrNumber,
              seatOrBerth: seatOrBerth || r.seatOrBerth,
            }
          : r
      )
    );
    showToast(`Official PNR ${pnrNumber} issued and sealed!`);
  };

  const handleOperatorUpdateStatus = (requestId: string, status: OperatorRequest['status'], notes?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              notes: notes || r.notes,
            }
          : r
      )
    );
    showToast(`Order status updated to ${status}.`);
  };

  const handleViewDocument = (request: OperatorRequest) => {
    setActiveTicketRequest(request);
    setIsTicketModalOpen(true);
  };

  const pendingOperatorCount = requests.filter((r) => r.status === 'PENDING_PNR' || r.status === 'RFQ_OPEN').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0C1E33] border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-xl bg-blue-800 text-amber-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-amber-400">Portal Notification</div>
            <p className="text-xs text-slate-200">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
      <Header
        mode={mode}
        setMode={setMode}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        travelTab={travelTab}
        setTravelTab={setTravelTab}
        cartCount={cartItems.length}
        openCart={() => setIsCartOpen(true)}
        pendingOperatorCount={pendingOperatorCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {mode === 'operator' ? (
          <OperatorDesk
            requests={requests}
            onIssuePNR={handleOperatorIssuePNR}
            onUpdateStatus={handleOperatorUpdateStatus}
            onViewDocument={handleViewDocument}
          />
        ) : (
          <div>
            {activeNav === 'travel' && (
              <TravelSection
                activeTab={travelTab}
                setActiveTab={setTravelTab}
                onBookFlightWithPassengers={handleBookFlightWithPassengers}
                onAddFlightToCart={handleAddFlightToCart}
                onBookTrain={handleBookTrain}
                onAddTrainToCart={handleAddTrainToCart}
                onBookBus={handleBookBus}
                onAddBusToCart={handleAddBusToCart}
                onBookCharter={handleBookCharter}
                onAddCharterToCart={handleAddCharterToCart}
              />
            )}

            {activeNav === 'bbps' && (
              <BBPSSection
                onPayBill={handlePayBBPSBill}
                onAddBillToCart={handleAddBillToCart}
              />
            )}

            {activeNav === 'industrial' && (
              <IndustrialSection
                onBuyProduct={handleBuyIndustrial}
                onAddProductToCart={handleAddIndustrialToCart}
                onSubmitRFQ={handleSubmitRFQ}
              />
            )}

            {activeNav === 'my-orders' && (
              <MyBookings
                orders={requests}
                onViewDocument={handleViewDocument}
                onExploreMore={() => setActiveNav('travel')}
              />
            )}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={handleProceedCartCheckout}
      />

      {/* Razorpay Gateway Simulator Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        orderTitle={razorpayOrder.title}
        orderAmount={razorpayOrder.amount}
        onPaymentSuccess={(payInfo) => {
          setIsRazorpayOpen(false);
          if (razorpayOrder.pendingAction) {
            razorpayOrder.pendingAction();
          }
        }}
      />

      {/* Digital Pass, Ticket & GST Invoice Generator Modal */}
      <TicketModal
        request={activeTicketRequest}
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />

      {/* Institutional Enterprise Footer */}
      <footer className="mt-16 bg-[#0C1E33] text-slate-300 text-xs py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-[#d97706]/70 flex items-center justify-center font-bold text-[#d97706] shadow-sm">
              K•GO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm block">Karnataka Go</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  karnatakago.in
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Official Universal Portal — Travel OTA, BBPS Direct Clearing Desk & B2B Industrial Supply Registry
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>GSTIN: <strong className="text-white">29AABCK1234F1Z8</strong></span>
            <span>•</span>
            <span>IRCTC PRS Node #4819</span>
            <span>•</span>
            <span>NPCI BBPOU Reg #KA-BBPS-0912</span>
            <span>•</span>
            <span>Helpdesk: <strong className="text-white">1800-425-5748</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
