import React from 'react';
import { Sparkles, Plus, Zap, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

export const ComboDealsSection: React.FC<{ onQuickOrder?: (product: any) => void }> = ({
  onQuickOrder,
}) => {
  const { addItem } = useCartStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const comboItems = [
    {
      id: 'combo-1',
      title: 'Family Pure Health Bundle (Raw Honey + Pure Cow Ghee + Mustard Oil)',
      banglaTitle: 'পারিবারিক খাঁটি স্বাস্থ্য প্যাকেজ (মধু + গাওয়া ঘি + সরিষার তেল)',
      regularPrice: 2180,
      comboPrice: 1750,
      savings: 430,
      items: [
        { name: 'Sundarbans Honey 500g', bn: 'সুন্দরবনের মধু ৫০০ গ্রাম', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300' },
        { name: 'Pabna Desi Ghee 500g', bn: 'পাবনার গাওয়া ঘি ৫০০ গ্রাম', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300' },
        { name: 'Cold-Pressed Mustard Oil 1L', bn: 'ঘানির সরিষার তেল ১ লিটার', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
      ],
    },
    {
      id: 'combo-2',
      title: 'Flagship Creator Power Kit (Wireless TWS + 65W GaN Fast Charger + Keychron)',
      banglaTitle: 'প্রো ক্রিয়েটর পাওয়ার কিট (TWS ইয়ারবাডস + ৬৫W ফাস্ট চার্জার)',
      regularPrice: 4340,
      comboPrice: 3490,
      savings: 850,
      items: [
        { name: 'ANC TWS Pro 2', bn: 'নয়েজ ক্যানসেলিং ইয়ারবাডস', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300' },
        { name: '65W GaN Charger', bn: '৬৫W গ্যান কুইক অ্যাডাপ্টার', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300' },
        { name: 'Smartwatch Ultra', bn: 'স্মার্টওয়াচ আল্ট্রা ২.০', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300' },
      ],
    },
  ];

  const handleBuyCombo = (combo: any) => {
    const mockProduct = {
      _id: `combo_bundle_${combo.id}`,
      title: combo.title,
      banglaTitle: combo.banglaTitle,
      price: combo.regularPrice,
      discountPrice: combo.comboPrice,
      thumbnail: combo.items[0].img,
      images: combo.items.map((i: any) => i.img),
      categorySlug: 'organic-foods',
      sku: 'SX-COMBO-99',
      isOrganic: true,
      stock: 30,
      soldCount: 140,
      shortDescription: combo.title,
      description: combo.title,
      rating: 5.0,
      numReviews: 48,
    };

    if (onQuickOrder) {
      onQuickOrder(mockProduct);
    } else {
      addItem(mockProduct as any, 1);
    }
  };

  return (
    <section id="combo-deals-section" className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'সুপার সেভার বান্ডেল অফার' : 'Choice Super Saver Bundles'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {lang === 'bn' ? 'একসাথে কিনুন — অতিরিক্ত ৳৮৫০ পর্যন্ত সাশ্রয় করুন!' : 'Bundle & Save Extra — Up to ৳850 Instant Savings!'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'একসাথে প্রয়োজনীয় আইটেম কিনে ডেলিভারি ফ্রি ও স্পেশাল কম্বো ছাড় পান'
                : 'Handcrafted mega packs with free shipping and maximum bundle discounts'}
            </p>
          </div>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comboItems.map((combo) => (
            <div
              key={combo.id}
              className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
            >
              {/* Product Thumbnails with Plus signs */}
              <div className="flex items-center justify-center gap-2">
                {combo.items.map((it, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 p-1 shadow-sm flex flex-col items-center">
                      <img src={getSafeImage(it.img)} alt={it.name} className="w-full h-12 object-cover rounded-xl" />
                      <span className="text-[9px] font-bold text-slate-600 truncate mt-1 max-w-full px-1">
                        {lang === 'bn' ? it.bn : it.name}
                      </span>
                    </div>
                    {idx < combo.items.length - 1 && (
                      <Plus className="w-4 h-4 text-emerald-700 font-black flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 text-center line-clamp-1">
                  {lang === 'bn' ? combo.banglaTitle : combo.title}
                </h4>

                <div className="flex items-center justify-center gap-3 my-2">
                  <span className="text-xl font-black text-emerald-800 font-mono">
                    {formatPrice(combo.comboPrice)}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">
                    {formatPrice(combo.regularPrice)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {lang === 'bn' ? `সাশ্রয় ${formatPrice(combo.savings)}` : `Save ${formatPrice(combo.savings)}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleBuyCombo(combo)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {lang === 'bn' ? `কম্বো বান্ডেল অর্ডার করুন (${formatPrice(combo.comboPrice)})` : `Order Combo Bundle (${formatPrice(combo.comboPrice)})`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
