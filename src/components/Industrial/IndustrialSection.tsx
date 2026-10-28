import React, { useState } from 'react';
import { IndustrialProduct, IndustrialCategory, RFQSubmission } from '../../types';
import { MOCK_INDUSTRIAL_PRODUCTS } from '../../data/mockData';
import { 
  Boxes, 
  Search, 
  FileCheck, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  X, 
  Send, 
  Building,
  CheckCircle2
} from 'lucide-react';

interface IndustrialSectionProps {
  onBuyProduct: (product: IndustrialProduct, quantity: number, unitPrice: number) => void;
  onAddProductToCart: (product: IndustrialProduct, quantity: number, unitPrice: number) => void;
  onSubmitRFQ: (rfq: RFQSubmission) => void;
}

export const IndustrialSection: React.FC<IndustrialSectionProps> = ({
  onBuyProduct,
  onAddProductToCart,
  onSubmitRFQ,
}) => {
  const [activeCategory, setActiveCategory] = useState<IndustrialCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForSpecs, setSelectedProductForSpecs] = useState<IndustrialProduct | null>(null);
  const [selectedProductForMTC, setSelectedProductForMTC] = useState<IndustrialProduct | null>(null);
  const [selectedProductForRFQ, setSelectedProductForRFQ] = useState<IndustrialProduct | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [rfqForm, setRfqForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    siteLocation: 'Peenya Industrial Area, Bengaluru',
    quantity: 10,
    targetTimeline: 'Immediate (Within 7 Days)',
    specialRequirements: '',
  });

  const categories = [
    { id: 'all', label: 'All B2B Supplies' },
    { id: 'valves', label: 'Valves & Piping' },
    { id: 'electrical', label: 'Electrical Switchgear' },
    { id: 'pumps', label: 'Industrial Pumps & Motors' },
    { id: 'cables', label: 'Armoured HT/LT Cables' },
    { id: 'instruments', label: 'Instrumentation & Gauges' },
  ];

  const getProductQty = (prodId: string) => quantities[prodId] || 1;

  const handleQtyChange = (prodId: string, val: number) => {
    if (val < 1) return;
    setQuantities((prev) => ({ ...prev, [prodId]: val }));
  };

  const getEffectivePrice = (product: IndustrialProduct, qty: number) => {
    if (qty >= 20) return product.bulkTier20Price;
    if (qty >= 5) return product.bulkTier5Price;
    return product.unitPrice;
  };

  const filteredProducts = MOCK_INDUSTRIAL_PRODUCTS.filter((prod) => {
    const matchesCat = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenRFQ = (product: IndustrialProduct) => {
    setSelectedProductForRFQ(product);
    setRfqForm((prev) => ({
      ...prev,
      quantity: quantities[product.id] || 10,
    }));
  };

  const handleRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForRFQ) return;

    const submission: RFQSubmission = {
      productId: selectedProductForRFQ.id,
      productName: selectedProductForRFQ.name,
      companyName: rfqForm.companyName || 'Karnataka Industrial Enterprise',
      contactPerson: rfqForm.contactPerson || 'Procurement Manager',
      email: rfqForm.email || 'procurement@company.com',
      phone: rfqForm.phone || '+91 98450 00000',
      gstin: rfqForm.gstin || '29AABCK9928M1Z2',
      siteLocation: rfqForm.siteLocation,
      quantity: rfqForm.quantity,
      targetTimeline: rfqForm.targetTimeline,
      specialRequirements: rfqForm.specialRequirements || 'Requires EN 10204 3.1 inspection certificate with dispatch.',
    };

    onSubmitRFQ(submission);
    setSelectedProductForRFQ(null);
  };

  return (
    <div className="space-y-6">
      {/* Industrial Procurement Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0C1E33] text-base">B2B Industrial & Engineering Hardware Procurement</span>
              <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200 font-mono px-2 py-0.5 rounded font-bold">
                MTC EN 10204 3.1 Certified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Wholesale volume tier pricing with certified Mill Test Certificates for manufacturing, infra & power sites
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-4 h-4" />
              100% Traceable Heat Batches
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-600 font-medium">
              Direct dispatch to Peenya, Bommasandra, Dharwad, Baikampady
            </span>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id as IndustrialCategory)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU, Valve, ACB, Pump..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const qty = getProductQty(prod.id);
          const effectivePrice = getEffectivePrice(prod, qty);
          const hasDiscount = effectivePrice < prod.unitPrice;
          const totalOrderCost = effectivePrice * qty;

          return (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-white/95 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs border border-slate-200">
                      {prod.brand.split('/')[0]}
                    </span>
                    {prod.mtcCertified && (
                      <span className="bg-blue-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs">
                        MTC 3.1
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-white/90 text-slate-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                    HSN: {prod.hsnCode}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-sm line-clamp-1">{prod.name}</h3>
                    <p className="text-[10px] text-slate-200 font-mono">SKU: {prod.sku}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Bulk Tier Rates */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Volume Wholesale Rates:</span>
                      <span className="text-emerald-700 font-mono font-bold">Stock: {prod.stock} Units</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono pt-1">
                      <div className={`p-1 rounded ${qty < 5 ? 'bg-blue-100 text-blue-900 font-bold' : 'text-slate-600'}`}>
                        <span>1-4:</span> <strong>₹{prod.unitPrice}</strong>
                      </div>
                      <div className={`p-1 rounded ${qty >= 5 && qty < 20 ? 'bg-blue-100 text-blue-900 font-bold' : 'text-slate-600'}`}>
                        <span>5+:</span> <strong>₹{prod.bulkTier5Price}</strong>
                      </div>
                      <div className={`p-1 rounded ${qty >= 20 ? 'bg-blue-100 text-blue-900 font-bold' : 'text-slate-600'}`}>
                        <span>20+:</span> <strong>₹{prod.bulkTier20Price}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Specs & MTC Quick Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProductForSpecs(prod)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tech Specs</span>
                    </button>
                    <button
                      onClick={() => setSelectedProductForMTC(prod)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center gap-1.5 border border-blue-200 transition cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>MTC 3.1 Cert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order / RFQ Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Qty:</span>
                    <button
                      onClick={() => handleQtyChange(prod.id, qty - 1)}
                      className="w-7 h-7 rounded bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-slate-100 border border-slate-300 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-slate-900 w-8 text-center">{qty}</span>
                    <button
                      onClick={() => handleQtyChange(prod.id, qty + 1)}
                      className="w-7 h-7 rounded bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-slate-100 border border-slate-300 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-mono">
                      ₹{totalOrderCost.toLocaleString('en-IN')}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      (₹{effectivePrice}/ea {hasDiscount && <span className="text-emerald-700 font-bold">• Tier Applied</span>})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenRFQ(prod)}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition border border-slate-300 cursor-pointer"
                  >
                    Request RFQ
                  </button>
                  <button
                    onClick={() => onAddProductToCart(prod, qty, effectivePrice)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-blue-900 text-xs font-bold transition border border-slate-300 cursor-pointer"
                    title="Add to Cart"
                  >
                    + Cart
                  </button>
                  <button
                    onClick={() => onBuyProduct(prod, qty, effectivePrice)}
                    className="flex-1 py-2 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    <span>Instant Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech Specs Modal */}
      {selectedProductForSpecs && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl text-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{selectedProductForSpecs.name}</h3>
                <span className="text-xs font-mono text-amber-400">SKU: {selectedProductForSpecs.sku}</span>
              </div>
              <button 
                onClick={() => setSelectedProductForSpecs(null)}
                className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">{selectedProductForSpecs.description}</div>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  Engineering Datasheet Specifications
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {Object.entries(selectedProductForSpecs.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2 px-3.5 bg-white">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-semibold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProductForSpecs(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Datasheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MTC (Mill Test Certificate) Modal */}
      {selectedProductForMTC && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-900 rounded-2xl w-full max-w-2xl shadow-2xl text-slate-900 overflow-hidden">
            <div className="p-5 border-b border-blue-900 bg-[#0C1E33] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-amber-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Official Mill Test Certificate (EN 10204 3.1)
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    Heat No: {selectedProductForMTC.mtcDetails.heatNumber}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProductForMTC(null)}
                className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-slate-50/50">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                <div className="text-slate-600">Standard Specification: <strong className="text-slate-900">{selectedProductForMTC.mtcDetails.standard}</strong></div>
                <div className="text-slate-600">Inspection & Certifying Body: <strong className="text-blue-900 font-bold">{selectedProductForMTC.mtcDetails.certAgency}</strong></div>
                <div className="text-slate-600">Certified Hardware: <strong className="text-slate-900">{selectedProductForMTC.name}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">
                    Tensile Strength (Rm)
                  </span>
                  <p className="font-mono text-slate-900 text-xs font-bold">{selectedProductForMTC.mtcDetails.tensileStrength}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">
                    Yield Proof Stress (Rp0.2)
                  </span>
                  <p className="font-mono text-slate-900 text-xs font-bold">{selectedProductForMTC.mtcDetails.yieldStrength}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                <span className="font-bold text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">
                  Spectrometric Chemical Analysis (% wt)
                </span>
                <p className="font-mono text-slate-900 text-xs font-bold">{selectedProductForMTC.mtcDetails.chemicalComposition}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  This original MTC is logged with Karnataka Supplies Hub Quality Assurance Registry. Serialized physical inspection tags accompany delivery.
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-mono">ISO 9001:2015 Accredited Laboratory</span>
              <button
                onClick={() => setSelectedProductForMTC(null)}
                className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Submission Modal */}
      {selectedProductForRFQ && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl text-slate-900 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Request for Quotation (B2B Wholesale RFQ)</h3>
                <p className="text-xs text-amber-400 mt-0.5">{selectedProductForRFQ.name}</p>
              </div>
              <button 
                onClick={() => setSelectedProductForRFQ(null)}
                className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRFQSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Enterprise Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaveri Heavy Engineering Ltd"
                    value={rfqForm.companyName}
                    onChange={(e) => setRfqForm({ ...rfqForm, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company GSTIN Number</label>
                  <input
                    type="text"
                    required
                    placeholder="29AABCK9928M1Z2"
                    value={rfqForm.gstin}
                    onChange={(e) => setRfqForm({ ...rfqForm, gstin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Procurement Officer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Contact person"
                    value={rfqForm.contactPerson}
                    onChange={(e) => setRfqForm({ ...rfqForm, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email & Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="purchase@enterprise.in"
                    value={rfqForm.email}
                    onChange={(e) => setRfqForm({ ...rfqForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Quantity (Units)</label>
                  <input
                    type="number"
                    min={1}
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Site Location</label>
                  <select
                    value={rfqForm.siteLocation}
                    onChange={(e) => setRfqForm({ ...rfqForm, siteLocation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-900 cursor-pointer"
                  >
                    <option value="Peenya Industrial Area, Bengaluru">Peenya Industrial Area, Bengaluru</option>
                    <option value="Bommasandra / Electronic City, Bengaluru">Bommasandra / Electronic City, Bengaluru</option>
                    <option value="Belur Industrial Area, Dharwad">Belur Industrial Area, Dharwad</option>
                    <option value="Baikampady Industrial Estate, Mangaluru">Baikampady Industrial Estate, Mangaluru</option>
                    <option value="Hebbal Industrial Area, Mysuru">Hebbal Industrial Area, Mysuru</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Requirements / Inspection</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Third-party TUV inspection required, custom flange standard, test certificates with batch"
                  value={rfqForm.specialRequirements}
                  onChange={(e) => setRfqForm({ ...rfqForm, specialRequirements: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                ></textarea>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 pt-4">
                <span className="text-[11px] text-slate-500">
                  Transmitted directly to Master Operator Desk
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transmit RFQ to Operator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
