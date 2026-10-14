import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Check,
  ShoppingBag,
  ArrowRight,
  Zap,
  CheckCircle2,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';

interface AISmartBundleUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseProduct?: any;
}

const COMPLEMENTARY_ITEMS = [
  {
    id: 'upsell-1',
    title: 'Cold-Pressed Pure Mustard Oil (1L)',
    banglaTitle: 'কাঠের ঘানির খাঁটি সরিষার তেল (১ লিটার)',
    price: 320,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    selected: true,
  },
  {
    id: 'upsell-2',
    title: 'Organic Kashmiri Saffron (1g)',
    banglaTitle: 'খাঁটি কাশ্মীরি রয়্যাল জাফরান (১ গ্রাম)',
    price: 950,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80',
    selected: true,
  },
  {
    id: 'upsell-3',
    title: 'Pabna Pure Organic Ghee (250g)',
    banglaTitle: 'পাবনার খাঁটি গাওয়া ঘি (২৫০ গ্রাম)',
    price: 650,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&auto=format&fit=crop&q=80',
    selected: false,
  },
];

export const AISmartBundleUpsellModal: React.FC<AISmartBundleUpsellModalProps> = ({
  isOpen,
  onClose,
  baseProduct,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem, setDrawerOpen } = useCartStore();

  const [items, setItems] = useState(COMPLEMENTARY_ITEMS);
  const [bundleAdded, setBundleAdded] = useState(false);

  if (!isOpen) return null;

  const basePrice = baseProduct?.discountPrice || baseProduct?.price || 1050;
  const baseTitle = baseProduct?.title || 'Sundarbans Natural Raw Honey (1kg)';
  const baseImage = baseProduct?.thumbnail || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80';

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );
  };

  const selectedAdditionalTotal = items
    .filter((it) => it.selected)
    .reduce((sum, it) => sum + it.price, 0);

  const subtotal = basePrice + selectedAdditionalTotal;
  const discount = Math.round(subtotal * 0.15); // 15% instant combo saving
  const finalPrice = subtotal - discount;

  const handleAddAll = () => {
    // Add base product
    addItem(
      baseProduct || {
        _id: 'base-honey-01',
        title: baseTitle,
        price: basePrice,
        images: [baseImage],
        thumbnail: baseImage,
        slug: 'honey-1kg',
        category: 'organic',
        categorySlug: 'organic-foods',
        stock: 20,
        sku: 'HONEY-1KG',
      },
      1
    );

    // Add selected bundle items
    items
      .filter((it) => it.selected)
      .forEach((it) => {
        addItem(
          {
            _id: it.id,
            title: it.title,
            price: it.price,
            images: [it.image],
            thumbnail: it.image,
            slug: it.id,
            category: 'bundle-item',
            categorySlug: 'organic-foods',
            stock: 20,
            sku: 'UP-' + it.id,
          } as any,
          1
        );
      });

    setBundleAdded(true);
    setTimeout(() => {
      setBundleAdded(false);
      onClose();
      setDrawerOpen(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white">
                {lang === 'bn' ? 'এআই স্মার্ট কম্বো ও সেভার বান্ডেল' : 'Frequently Bought Together (AI Combo)'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">
                15% Instant Off
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn'
                ? 'এই পণ্যের সাথে সবচেয়ে বেশি কেনা পরিপূরক পণ্যগুলো একসাথে নিয়ে ১৫% ছাড় পান।'
                : 'Customers frequently pair these authentic items together. Add all to save 15% instantly.'}
            </p>
          </div>
        </div>

        {/* Product Visual Chain */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Base Product Card */}
            <div className="p-3 rounded-xl bg-slate-900 border border-orange-500/50 flex items-center space-x-3 max-w-xs shadow-md">
              <img
                src={getSafeImage(baseImage)}
                alt={baseTitle}
                className="w-12 h-12 rounded-lg object-cover bg-slate-800"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-black text-orange-400 uppercase">Main Item</span>
                <h4 className="text-xs font-bold text-white truncate">{baseTitle}</h4>
                <span className="text-xs font-black text-white font-mono">{formatPrice(basePrice)}</span>
              </div>
            </div>

            <Plus className="w-5 h-5 text-orange-400" />

            {/* Complementary Items Checklist */}
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition max-w-xs ${
                  item.selected
                    ? 'bg-orange-500/10 border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    item.selected ? 'bg-orange-500 text-slate-950' : 'border border-slate-700'
                  }`}
                >
                  {item.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <img
                  src={getSafeImage(item.image)}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                />
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-xs font-black text-orange-400 font-mono">
                    +{formatPrice(item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">{lang === 'bn' ? 'আলাদা আলাদা মোট মূল্য:' : 'Total Item Price:'}</span>
              <span className="line-through text-slate-500 font-mono text-sm">{formatPrice(subtotal)}</span>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block">
                {lang === 'bn' ? 'বান্ডেল কম্বো অফার মূল্য (১৫% সেভ):' : 'Bundle Savings Offer (15% OFF):'}
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {formatPrice(finalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleAddAll}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition transform active:scale-95 shadow-xl ${
              bundleAdded
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-slate-950 shadow-orange-500/30'
            }`}
          >
            {bundleAdded ? (
              <>
                <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                <span>{lang === 'bn' ? 'সম্পূর্ণ কম্বো কার্টে যোগ হয়েছে!' : 'All Items Added to Cart!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {lang === 'bn'
                    ? `১-ক্লিকে পুরো কম্বো কার্টে নিন (${formatPrice(finalPrice)})`
                    : `Add Full AI Bundle to Cart (${formatPrice(finalPrice)})`}
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
