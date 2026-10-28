import React, { useState } from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Plane, 
  Train, 
  Bus, 
  Zap, 
  Boxes
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (totalAmount: number, items: CartItem[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  const totalTax = items.reduce((acc, it) => acc + Math.round((it.unitPrice * it.quantity * it.taxPercent) / 100), 0);
  const netTotal = Math.max(0, rawSubtotal + totalTax - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'KARNATAKA500') {
      setAppliedDiscount(500);
      setCouponMessage('Coupon applied: ₹500 Karnataka Supplies Welcome Discount!');
    } else if (code === 'BBPSFREE') {
      setAppliedDiscount(150);
      setCouponMessage('Coupon applied: ₹150 Gateway Clearing Fee Waived!');
    } else {
      setCouponMessage('Invalid coupon code. Try KARNATAKA500');
    }
  };

  const getItemIcon = (vertical: CartItem['vertical']) => {
    switch (vertical) {
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-900" />;
      case 'train':
        return <Train className="w-4 h-4 text-red-700" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-emerald-700" />;
      case 'charter':
        return <Plane className="w-4 h-4 text-purple-700" />;
      case 'bbps':
        return <Zap className="w-4 h-4 text-amber-600" />;
      default:
        return <Boxes className="w-4 h-4 text-blue-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between text-slate-900 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0C1E33] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Service Cart Queue</h3>
              <p className="text-xs text-slate-300">
                {items.length} {items.length === 1 ? 'item' : 'items'} in batch checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-slate-300 hover:text-rose-400 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add travel bookings (Flights, Trains, Buses, Charters), BBPS bills, or B2B industrial supplies to checkout together.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {getItemIcon(item.vertical)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  {item.vertical === 'industrial' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-bold text-slate-900 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 capitalize">
                      {item.vertical} clearance
                    </span>
                  )}

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    {item.taxPercent > 0 && (
                      <span className="text-[10px] text-slate-500 block">
                        + {item.taxPercent}% GST (₹{Math.round((item.unitPrice * item.quantity * item.taxPercent) / 100)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. KARNATAKA500)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-blue-900 font-mono font-bold"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponMessage && (
              <p className={`text-[11px] ${appliedDiscount > 0 ? 'text-emerald-700 font-bold' : 'text-rose-700'}`}>
                {couponMessage}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-mono font-semibold text-slate-800">₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST:</span>
                <span className="font-mono font-semibold text-slate-800">₹{totalTax.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Special Promo Discount:</span>
                  <span className="font-mono">- ₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Net Payable:</span>
                <span className="text-xl font-mono text-blue-900 font-black">
                  ₹{netTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(netTotal, items)}
              className="w-full py-3.5 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Proceed to Razorpay Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
