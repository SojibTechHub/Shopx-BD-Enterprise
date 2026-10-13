import React, { useState } from 'react';
import { Users, Sparkles, Share2, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface TeamBuySectionProps {
  onQuickOrder: (product: Product) => void;
}

export const TeamBuySection: React.FC<TeamBuySectionProps> = ({ onQuickOrder }) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const teamDeals = [
    {
      _id: 'team-1',
      title: 'Sundarbans Natural Raw Honey (1kg Jar)',
      banglaTitle: 'সুন্দরবনের প্রাকৃতিক চাকের মধু (১ কেজি জার)',
      slug: 'sundarbans-natural-raw-honey-500g',
      soloPrice: 1300,
      teamPrice: 1050,
      thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      price: 1300,
      discountPrice: 1050,
      stock: 40,
      soldCount: 380,
      sku: 'SX-TEAM-01',
      isOrganic: true,
      rating: 4.9,
      activeTeams: 18,
    },
    {
      _id: 'team-2',
      title: 'Traditional Cold-Pressed Mustard Oil (2 Litre)',
      banglaTitle: 'কাঠের ঘানি ভাঙা খাঁটি সরিষার তেল (২ লিটার)',
      slug: 'cold-pressed-pure-mustard-oil-1l',
      soloPrice: 760,
      teamPrice: 590,
      thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      price: 760,
      discountPrice: 590,
      stock: 50,
      soldCount: 410,
      sku: 'SX-TEAM-02',
      isOrganic: true,
      rating: 5.0,
      activeTeams: 24,
    },
    {
      _id: 'team-3',
      title: 'TWS Wireless ANC Gaming Earbuds Pro 2',
      banglaTitle: 'TWS ওয়্যারলেস গেমিং ইয়ারবাডস প্রো ২',
      slug: 'wireless-anc-tws-earbuds-pro-2',
      soloPrice: 2490,
      teamPrice: 1590,
      thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      price: 2490,
      discountPrice: 1590,
      stock: 25,
      soldCount: 190,
      sku: 'SX-TEAM-03',
      isOrganic: false,
      rating: 4.8,
      activeTeams: 12,
    },
  ];

  const handleShareTeam = (idx: number, itemTitle: string) => {
    const text = `ShopX BD Group Buy: "${itemTitle}" - Join my team to get special discount! Link: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section id="team-buy-section" className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {lang === 'bn' ? 'সোশ্যাল টিম বাই (Group Discount)' : 'Social Group Buy (Team Deals)'}
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {lang === 'bn' ? 'অতিরিক্ত ৩০% ছাড়' : 'Extra 30% OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'bn'
                  ? 'এককভাবে কেনা চেয়ে বন্ধুকে আমন্ত্রণ জানিয়ে ২ জন একসাথে কিনলে বিশাল টিম ডিসকাউন্ট!'
                  : 'Invite a friend to buy together and unlock exclusive bulk team pricing!'}
              </p>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamDeals.map((deal, idx) => (
            <div
              key={deal._id}
              className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getSafeImage(deal.thumbnail || (deal as any).images?.[0])}
                  alt={deal.title}
                  className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 inline-block mb-1">
                    👥 {deal.activeTeams} {lang === 'bn' ? 'টি টিম চলছে' : 'Active Teams'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {lang === 'bn' ? deal.banglaTitle : deal.title}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-indigo-800 font-mono">
                      {formatPrice(deal.teamPrice)}
                    </span>
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      {formatPrice(deal.soloPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleShareTeam(idx, lang === 'bn' ? deal.banglaTitle : deal.title)}
                  className="py-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'টিমে ইনভাইট' : 'Invite Friend')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickOrder(deal as any)}
                  className="py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-indigo-700/20"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'bn' ? 'টিম শুরু করুন' : 'Start Team'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
