import React, { useState } from 'react';
import {
  TrendingDown,
  Bell,
  CheckCircle2,
  X,
  LineChart,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowDownRight,
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { getSafeImage } from '../utils/image';

interface AIPriceTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  currentPrice?: number;
  productImage?: string;
}

export const AIPriceTrackerModal: React.FC<AIPriceTrackerModalProps> = ({
  isOpen,
  onClose,
  productTitle = 'Sundarban Pure Honey 1kg',
  currentPrice = 1450,
  productImage = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop',
}) => {
  const { lang } = useLanguageStore();
  const isBn = lang === 'bn';
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegisterAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setIsRegistered(true);
    setTimeout(() => {
      setIsRegistered(false);
      onClose();
    }, 3000);
  };

  const priceHistory = [
    { day: '30d ago', price: currentPrice + 250 },
    { day: '20d ago', price: currentPrice + 150 },
    { day: '10d ago', price: currentPrice + 100 },
    { day: 'Yesterday', price: currentPrice + 50 },
    { day: 'Today (Live)', price: currentPrice, isLowest: true },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {isBn ? 'এআই স্মার্ট প্রাইস রাডার' : 'AI Smart Price Drop Radar'}
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                {isBn ? 'মূল্য ট্র্যাকিং ও অটো ড্রপ অ্যালার্ট' : 'Price Tracker & Drop Alert'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <img
            src={getSafeImage(productImage)}
            alt={productTitle}
            className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700/60 flex-shrink-0"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">{productTitle}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono font-black text-emerald-400">৳{currentPrice.toLocaleString()}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full font-bold">
                {isBn ? '🔥 বর্তমান সর্বনিম্ন রেট' : '🔥 Lowest 30-Day Price'}
              </span>
            </div>
          </div>
        </div>

        {/* Price History Visual Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>{isBn ? '৩০ দিনের প্রাইস ট্রেন্ড' : '30-Day Historical Trend'}</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> -12% drop
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
            {priceHistory.map((item, idx) => (
              <div key={idx} className="text-center space-y-1">
                <span className="text-[9px] text-slate-500 font-mono block truncate">{item.day}</span>
                <div
                  className={`h-12 rounded-lg flex items-end justify-center p-1 font-mono text-[9px] font-bold ${
                    item.isLowest
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-500 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300'
                  }`}
                >
                  ৳{item.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Set Alert Form */}
        {isRegistered ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">
              {isBn
                ? `প্রাইস ড্রপ অ্যালার্ট সক্রিয় হয়েছে! দাম ৳${targetPrice} এ নামলেই মেসেজ পাবেন।`
                : `Price alert armed! You will receive an instant WhatsApp alert when price hits ৳${targetPrice}.`}
            </span>
          </div>
        ) : (
          <form onSubmit={handleRegisterAlert} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isBn ? `আপনার টার্গেট কাঙ্ক্ষিত মূল্য (৳):` : `Your Desired Target Price (৳):`}
              </label>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isBn ? 'মোবাইল নম্বর বা হোয়াটসঅ্যাপ (অ্যালার্টের জন্য):' : 'Mobile / WhatsApp for Instant Ping:'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 01711223344"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>{isBn ? 'ফ্রি প্রাইস অ্যালার্ট সক্রিয় করুন' : 'Arm Instant Price Drop Alert'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
