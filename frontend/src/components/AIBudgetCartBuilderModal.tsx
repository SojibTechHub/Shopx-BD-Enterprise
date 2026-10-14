import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, CheckCircle2, ArrowRight, Zap, RefreshCw, DollarSign, Gift, Layers, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';

interface AIBudgetCartBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_GOALS = [
  {
    id: 'organic_pantry',
    title: '🌿 100% Pure Organic Family Pantry',
    titleBn: '🌿 পরিবারের জন্য ১০০% অর্গানিক খাবার প্যাকেজ',
    icon: '🍯',
    desc: 'Raw Sundarbans Honey, Cold Pressed Mustard Oil, Pure Pabna Ghee & Organic Saffron',
    descBn: 'খাঁটি চাকের মধু, কাঠের ঘানির সরিষার তেল, গাওয়া ঘি ও জাফরান',
    suggestedBudget: 5000,
    items: [
      { id: 'p1', title: 'Sundarbans Natural Raw Honey (1kg)', price: 1050, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80' },
      { id: 'p2', title: 'Pabna Pure Organic Cow Ghee (500g)', price: 1200, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&auto=format&fit=crop&q=80' },
      { id: 'p3', title: 'Cold-Pressed Pure Mustard Oil (2L)', price: 590, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80' },
      { id: 'p4', title: 'Organic Kashmiri Royal Saffron (2g)', price: 1850, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'tech_starter',
    title: '⚡ Pro Tech & Gadget Power Kit',
    titleBn: '⚡ প্রফেশনাল টেক ও অডিও গ্যাজেট বান্ডেল',
    icon: '🎧',
    desc: 'ANC Wireless Earbuds, Magnetic Powerbank 10000mAh, AMOLED Smartwatch',
    descBn: 'এএনসি ইয়ারবাডস, ম্যাগনেটিক পাওয়ারব্যাংক ও অ্যামোলেড স্মার্টওয়াচ',
    suggestedBudget: 12000,
    items: [
      { id: 't1', title: 'Wireless ANC TWS Earbuds Pro 2', price: 2490, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80' },
      { id: 't2', title: 'Ultra Smartwatch with AMOLED Screen', price: 3450, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&auto=format&fit=crop&q=80' },
      { id: 't3', title: 'Fast Charging 10000mAh MagSafe Powerbank', price: 2100, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80' },
      { id: 't4', title: 'RGB Mechanical Wireless Keyboard', price: 3800, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'luxury_lifestyle',
    title: '💎 Royal Fragrance & Luxury Suite',
    titleBn: '💎 রয়্যাল সুগন্ধি ও লাক্সারি লাইফস্টাইল সেট',
    icon: '👑',
    desc: 'Creed Aventus Royal EDP, Dehn Al Oud, Luxury Sapphire Chrono Watch',
    descBn: 'ক্রিড অ্যাভেন্টাস পারফিউম, রয়্যাল দেহন আল উদ ও ক্রোনোগ্রাফ ঘড়ি',
    suggestedBudget: 45000,
    items: [
      { id: 'l1', title: 'Creed Aventus Royal Eau De Parfum (100ml)', price: 32500, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&auto=format&fit=crop&q=80' },
      { id: 'l2', title: 'Dehn Al Oud Royal Arabic Attar (12ml)', price: 6500, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80' },
      { id: 'l3', title: 'Luxury Sapphire Chronograph Watch', price: 5800, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' }
    ]
  }
];

export const AIBudgetCartBuilderModal: React.FC<AIBudgetCartBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem, setDrawerOpen } = useCartStore();

  const [selectedGoal, setSelectedGoal] = useState(PRESET_GOALS[0]);
  const [budget, setBudget] = useState(selectedGoal.suggestedBudget);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  if (!isOpen) return null;

  const bundleTotal = selectedGoal.items.reduce((sum, item) => sum + item.price, 0);
  const discountSaved = Math.round(bundleTotal * 0.12);
  const finalPrice = bundleTotal - discountSaved;

  const handleSelectGoal = (goal: typeof PRESET_GOALS[0]) => {
    setSelectedGoal(goal);
    setBudget(goal.suggestedBudget);
  };

  const handleGenerateBundle = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 600);
  };

  const handleAddAllToCart = () => {
    selectedGoal.items.forEach(item => {
      addItem({
        _id: item.id,
        title: item.title,
        slug: item.id,
        description: item.title,
        shortDescription: item.title,
        price: item.price,
        images: [item.image],
        thumbnail: item.image,
        category: 'bundle',
        categorySlug: 'bundles',
        stock: 10,
        sku: 'BUNDLE-' + item.id,
        rating: 5,
        numReviews: 14
      } as any, 1);
    });
    setBundleAdded(true);
    setTimeout(() => {
      setBundleAdded(false);
      onClose();
      setDrawerOpen(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <span>{lang === 'bn' ? 'এআই স্মার্ট বাজেট কার্ট বিল্ডার' : 'AI Smart Budget Cart Optimizer'}</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black border border-orange-500/40">
                1-Click Bundle
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আপনার বাজেট ঠিক করুন, এআই নিজে থেকে সেরা প্যাকেজ তৈরি করে দিবে' : 'Set your budget & category — AI instantly builds the best value bundle.'}
            </p>
          </div>
        </div>

        {/* Preset Packages */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            {lang === 'bn' ? '১. আপনার শপিং ক্যাটাগরি / উদ্দেশ্য বেছে নিন:' : '1. Select Shopping Theme / Package Goal:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_GOALS.map(goal => (
              <button
                key={goal.id}
                onClick={() => handleSelectGoal(goal)}
                className={`p-3.5 rounded-2xl border text-left transition relative ${
                  selectedGoal.id === goal.id
                    ? 'bg-orange-500/15 border-orange-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl block mb-1">{goal.icon}</span>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {lang === 'bn' ? goal.titleBn : goal.title}
                </h4>
                <p className="text-[10px] text-orange-400 font-mono mt-1 font-bold">
                  {lang === 'bn' ? 'প্রাক্কলিত বাজেট:' : 'Est. Budget:'} {formatPrice(goal.suggestedBudget)}
                </p>
              </button>
            ))}
          </div>

          {/* AI Recommended Product Bundle List */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>{lang === 'bn' ? 'এআই নির্বাচিত অপ্টিমাইজড বান্ডেল আইটেম:' : 'AI Optimized Included Items:'}</span>
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {lang === 'bn' ? 'বান্ডেল ছাড়: ১২%' : '12% Extra Bundle OFF'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedGoal.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <img
                    src={getSafeImage(item.image)}
                    alt={item.title}
                    className="w-11 h-11 object-cover rounded-lg border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                    <span className="text-xs text-orange-400 font-mono font-bold">{formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">{lang === 'bn' ? 'আলাদা ক্রয়ে মোট:' : 'Individual Price:'}</span>
                <span className="line-through text-slate-500 font-mono">{formatPrice(bundleTotal)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">{lang === 'bn' ? 'বান্ডেল অফার মূল্য:' : 'AI Bundle Combo Price:'}</span>
                <span className="text-base font-black text-orange-400 font-mono">{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddAllToCart}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition transform active:scale-95 shadow-xl ${
              bundleAdded
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-slate-950 shadow-orange-500/30'
            }`}
          >
            {bundleAdded ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950 stroke-[3]" />
                <span>{lang === 'bn' ? 'সবগুলো পণ্য ব্যাগে যোগ হয়েছে!' : 'Entire AI Bundle Added to Cart!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {lang === 'bn'
                    ? `১-ক্লিকে পুরো বান্ডেল কার্ট-এ নিন (${formatPrice(finalPrice)})`
                    : `Add Entire Bundle to Bag (${formatPrice(finalPrice)})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
