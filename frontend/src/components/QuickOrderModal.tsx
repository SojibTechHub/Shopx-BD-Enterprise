import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { getSafeImage } from '../utils/image';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <QuickOrderModalContent product={product} onClose={onClose} />;
};

const QuickOrderModalContent: React.FC<{ product: Product; onClose: () => void }> = ({
  product,
  onClose,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { user } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options?.[0]?.title || ''
  );
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.addresses?.find((a: any) => a.isDefault)?.street || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!phone) setPhone(user.phone || '');
      if (!address) setAddress(user.addresses?.find((a: any) => a.isDefault)?.street || '');
    }
  }, [user]);

  const unitPrice = product.discountPrice || product.price;
  const subTotal = unitPrice * quantity;
  const deliveryFee = deliveryZone === 'inside_dhaka' ? 60 : 120;
  const total = subTotal + deliveryFee;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert(lang === 'bn' ? 'অর্ডার করতে প্রথমে আপনার অ্যাকাউন্টে লগইন বা সাইন আপ করুন।' : 'Please login or sign up to your account to place an order.');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম, মোবাইল নাম্বার এবং ঠিকানা সঠিকভাবে দিন।' : 'Please fill in your name, phone number, and address correctly.');
      return;
    }

    if (phone.trim().length < 11) {
      alert(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)' : 'Please enter a valid 11-digit phone number (e.g. 017XXXXXXXX)');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        customerInfo: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: deliveryZone === 'inside_dhaka' ? 'Dhaka' : 'Outside Dhaka',
          district: deliveryZone === 'inside_dhaka' ? 'Dhaka' : 'Bangladesh',
          deliveryZone,
        },
        items: [
          {
            productId: product._id,
            quantity,
            variant: selectedVariant,
          },
        ],
        paymentMethod: 'cod',
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        setOrderSuccess(res.data.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || (lang === 'bn' ? 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to place order. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
            <h3 className="font-extrabold text-base">
              {lang === 'bn' ? '১-ক্লিক দ্রুত অর্ডার (ক্যাশ অন ডেলিভারি)' : '1-Click Express Order (COD)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {orderSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                {lang === 'bn' ? 'অভিনন্দন! আপনার অর্ডারটি নিশ্চিত হয়েছে।' : 'Congratulations! Your Order is Confirmed.'}
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                {lang === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Order Tracking ID:'} <span className="font-bold text-emerald-700 font-mono">#{orderSuccess.orderId}</span>
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 mb-6 border border-slate-100">
                <p><strong>{lang === 'bn' ? 'গ্রাহকের নাম:' : 'Customer Name:'}</strong> {orderSuccess.customerInfo.name}</p>
                <p><strong>{lang === 'bn' ? 'মোবাইল নাম্বার:' : 'Phone Number:'}</strong> {orderSuccess.customerInfo.phone}</p>
                <p><strong>{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {orderSuccess.customerInfo.address}</p>
                <p>
                  <strong>{lang === 'bn' ? 'মোট প্রদেয় বিল (পণ্য হাতে পেয়ে পরিশোধ করবেন):' : 'Total Payable (Pay on Delivery):'}</strong>{' '}
                  <span className="text-sm font-bold text-emerald-800 font-mono">{formatPrice(orderSuccess.totalAmount)}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition shadow-md"
              >
                {lang === 'bn' ? 'ঠিক আছে, ধন্যবাদ' : 'Close, Thank You'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Product Info Bar */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <img
                  src={getSafeImage(product.thumbnail || product.images?.[0])}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded-xl bg-white border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title}
                  </h4>
                  <p className="text-sm font-extrabold text-emerald-800 font-mono mt-0.5">
                    {formatPrice(unitPrice)}
                  </p>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500">{lang === 'bn' ? 'পরিমাণ:' : 'Qty:'}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs font-mono">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Mandatory Auth Banner if not logged in */}
              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-amber-900">
                      🔒 {lang === 'bn' ? 'অর্ডার করতে প্রথমে লগইন বা সাইন আপ আবশ্যক' : 'Login / Sign Up is mandatory to order'}
                    </p>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      {lang === 'bn' ? 'অ্যাকাউন্টে কয়েন ও অর্ডার ট্র্যাকিং হিস্ট্রি সেভ থাকবে' : 'Save loyalty coins & live tracking history'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm"
                    >
                      {lang === 'bn' ? 'লগইন' : 'Login'}
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-sm"
                    >
                      {lang === 'bn' ? 'সাইন আপ' : 'Sign Up'}
                    </Link>
                  </div>
                </div>
              )}

              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'ডেলিভারি এরিয়া নির্বাচন করুন:' : 'Select Delivery Area:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone('inside_dhaka')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</span>
                    <span className="font-mono">{formatPrice(60)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryZone('outside_dhaka')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</span>
                    <span className="font-mono">{formatPrice(120)}</span>
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'আপনার নাম' : 'Your Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'সম্পূর্ণ নাম লিখুন' : 'Enter your full name'}
                  required
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নাম্বার' : 'Phone Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  required
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সম্পূর্ণ ঠিকানা' : 'Full Delivery Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'bn' ? 'বাসা/রোড/এলাকা এবং থানা...' : 'House, road, area & landmark...'}
                  required
                  className="w-full bg-[#f8fafc] border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl p-2.5 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Total Calculation */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{lang === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable:'}</span>
                <span className="font-extrabold text-base text-emerald-800 font-mono">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isSubmitting ? (lang === 'bn' ? 'অর্ডার হচ্ছে...' : 'Processing...') : (lang === 'bn' ? `অর্ডার নিশ্চিত করুন (${formatPrice(total)})` : `Confirm Order (${formatPrice(total)})`)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
