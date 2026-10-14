import React, { useState } from 'react';
import { X, BellRing, CheckCircle2, DollarSign, Smartphone, Mail, ArrowRight, ShieldCheck, TrendingDown } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface PriceDropAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  currentPrice?: number;
  productImage?: string;
}

export const PriceDropAlertModal: React.FC<PriceDropAlertModalProps> = ({
  isOpen,
  onClose,
  productName = 'Apple iPhone 16 Pro Max 256GB',
  currentPrice = 175000,
  productImage = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentPrice * 0.9));
  const [notifyMethod, setNotifyMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('01942791004');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const discountPercent = Math.round(((currentPrice - targetPrice) / currentPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <BellRing className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{lang === 'bn' ? 'প্রাইস ড্রপ ও স্টক অ্যালার্ট' : 'Price Drop & Restock Alert'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'দাম কমলে সরাসরি WhatsApp বা ইমেইলে নোটিফিকেশন পান' : 'Get instant alerts when price drops to your target budget.'}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'অ্যালার্ট সফলভাবে চালু হয়েছে!' : 'Price Alert Activated!'}
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                {lang === 'bn'
                  ? `যখন ${productName} এর দাম ${formatPrice(targetPrice)} বা তার নিচে নামবে, আমরা ${contactValue} নম্বরে সতর্কবার্তা পাঠাবো।`
                  : `We will ping ${contactValue} as soon as ${productName} reaches ${formatPrice(targetPrice)} or lower.`}
              </p>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              {lang === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Summary */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <img
                src={getSafeImage(productImage)}
                alt={productName}
                className="w-12 h-12 object-cover rounded-xl border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{productName}</h4>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-slate-400">{lang === 'bn' ? 'বর্তমান মূল্য:' : 'Current:'}</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{formatPrice(currentPrice)}</span>
                </div>
              </div>
            </div>

            {/* Target Price Slider & Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'আপনার কাঙ্ক্ষিত টার্গেট মূল্য' : 'Your Target Drop Price'}
                </label>
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{discountPercent}% OFF Target</span>
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white font-bold font-mono focus:border-amber-500 focus:outline-none text-sm"
                  min={1}
                  max={currentPrice}
                  required
                />
              </div>
              <input
                type="range"
                min={Math.round(currentPrice * 0.5)}
                max={currentPrice}
                step={500}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full mt-3 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Notification Channel Choice */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {lang === 'bn' ? 'নোটিফিকেশন মাধ্যম' : 'Notification Channel'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNotifyMethod('whatsapp')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                    notifyMethod === 'whatsapp'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>WhatsApp Push</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNotifyMethod('email')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition ${
                    notifyMethod === 'email'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Alert</span>
                </button>
              </div>
            </div>

            {/* Input for Phone or Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {notifyMethod === 'whatsapp'
                  ? (lang === 'bn' ? 'WhatsApp নম্বর' : 'WhatsApp Mobile Number')
                  : (lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address')}
              </label>
              <input
                type={notifyMethod === 'whatsapp' ? 'tel' : 'email'}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={notifyMethod === 'whatsapp' ? '01942791004' : 'user@example.com'}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              <span>{lang === 'bn' ? 'প্রাইস অ্যালার্ট সেট করুন' : 'Activate 24/7 Price Alert'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'স্প্যামমুক্ত ও তাৎক্ষণিক নোটিফিকেশন গ্যারান্টি' : '100% Spam-free instant automated alert guaranteed.'}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
