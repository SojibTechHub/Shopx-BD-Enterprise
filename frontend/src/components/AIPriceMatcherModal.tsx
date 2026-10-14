import React, { useState } from 'react';
import { X, Sparkles, Camera, Upload, CheckCircle2, ShieldAlert, ArrowRight, DollarSign, Tag } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface AIPriceMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (slug: string) => void;
}

export const AIPriceMatcherModal: React.FC<AIPriceMatcherModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result as string;
        setSelectedImage(imgUrl);
        setAnalyzing(true);

        setTimeout(() => {
          setAnalyzing(false);
          setMatchResult({
            productName: 'Apple iPhone 16 Pro Max (256GB Desert Titanium)',
            competitorPrice: 175000,
            shopxPrice: 169900,
            savings: 5100,
            voucherCode: 'PRICEMATCH100',
            slug: 'apple-iphone-16-pro-max-256gb',
            thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
          });
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoScan = () => {
    setSelectedImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80');
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setMatchResult({
        productName: 'Sundarbans Natural Raw Honey (500g)',
        competitorPrice: 850,
        shopxPrice: 690,
        savings: 160,
        voucherCode: 'BESTPRICE50',
        slug: 'sundarbans-natural-raw-honey-500g',
        thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Tag className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              AI Price Match Guarantee
            </span>
            <h2 className="text-xl font-black text-slate-100">
              {lang === 'bn' ? 'AI প্রাইস ম্যাচ ও লোয়েস্ট প্রাইস চ্যালেঞ্জ' : 'AI Price Match & Lowest Price Scanner'}
            </h2>
          </div>
        </div>

        {analyzing ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {lang === 'bn' ? 'AI ছবি বিশ্লেষণ ও দাম তুলনা করছে...' : 'AI is analyzing product specs & market prices...'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                দারাজ ও অন্যান্য মার্কেটপ্লেসের সাথে দাম মিলিয়ে সেরা ডিল খোঁজা হচ্ছে
              </p>
            </div>
          </div>
        ) : matchResult ? (
          <div className="space-y-4 animate-scaleUp">
            <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4 flex items-center space-x-3.5">
              <img
                src={getSafeImage(matchResult.thumbnail)}
                alt={matchResult.productName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  ✓ ShopX Lowest Price Match
                </span>
                <p className="text-xs font-bold text-slate-100 truncate mt-1">
                  {matchResult.productName}
                </p>
                <div className="flex items-center space-x-3 mt-1 text-xs">
                  <span className="text-slate-400 line-through">
                    অন্যত্র: {formatPrice(matchResult.competitorPrice)}
                  </span>
                  <span className="font-black text-emerald-400 text-sm">
                    ShopX: {formatPrice(matchResult.shopxPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-300">
                {lang === 'bn' ? 'ShopX এ কিনলে আপনার মোট সাশ্রয়:' : 'Your Total Savings on ShopX:'}
              </p>
              <h4 className="text-2xl font-black text-emerald-400 mt-0.5">
                {formatPrice(matchResult.savings)} কমে পাচ্ছেন!
              </h4>
              <p className="text-[11px] text-amber-300 font-semibold mt-1">
                অতিরিক্ত ক্যাশব্যাক ভাউচার কোড: <strong>{matchResult.voucherCode}</strong>
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setMatchResult(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                {lang === 'bn' ? 'আরেকটি ছবি স্ক্যান করুন' : 'Scan Another'}
              </button>
              <a
                href={`/product/${matchResult.slug}`}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                <span>{lang === 'bn' ? 'পণ্যটি কিনুন' : 'View & Buy Deal'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'যেকোনো শোরুম, ফেসবুক বা অন্য ওয়েবসাইটের পণ্যের স্ক্রিনশট বা বারকোড আপলোড করুন। আমাদের এআই নিশ্চিত করবে আপনি ShopX-এ সর্বনিম্ন দামে পাচ্ছেন কিনা।'
                : 'Upload any product photo, receipt or screenshot from other sites. Our AI guarantees to find the lowest price match on ShopX.'}
            </p>

            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-950/60 relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 transition">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-200">
                {lang === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to Upload Product Photo'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">JPG, PNG or Screenshot (Max 10MB)</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleDemoScan}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ডেমো ছবি দিয়ে টেস্ট করুন' : 'Try Demo Image Scan'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
