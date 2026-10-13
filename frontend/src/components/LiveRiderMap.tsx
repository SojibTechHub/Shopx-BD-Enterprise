import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Clock, Phone, ShieldCheck, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';

interface LiveRiderMapProps {
  orderId: string;
  riderName?: string;
  riderPhone?: string;
  vehicleNumber?: string;
  customerAddress: string;
  orderStatus: string;
  createdAt?: string;
  deliveryZone?: string;
}

export const LiveRiderMap: React.FC<LiveRiderMapProps> = ({
  orderId,
  riderName,
  riderPhone,
  vehicleNumber,
  customerAddress,
  orderStatus = 'placed',
  createdAt,
  deliveryZone = 'inside_dhaka',
}) => {
  // Current Bangladesh Time State
  const [currentBdTime, setCurrentBdTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentBdTime(
        now.toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Calculate realistic ETA and progress percentage strictly based on real orderStatus
  let initialProgress = 15;
  let statusBadge = 'অর্ডার প্রসেসিং';
  let etaText = '২৪ ঘণ্টার মধ্যে ডেলিভারি';
  let routeStatusText = 'সেন্ট্রাল হাবে প্রোডাক্ট প্যাকেজিং চলছে';

  switch (orderStatus) {
    case 'placed':
      initialProgress = 15;
      statusBadge = 'অর্ডার গৃহীত (Placed)';
      etaText = deliveryZone === 'outside_dhaka' ? '৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি' : '২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি';
      routeStatusText = 'সেন্ট্রাল ওয়্যারহাউজে ভেরিফিকেশন ও প্যাকিং চলছে';
      break;
    case 'confirmed':
      initialProgress = 35;
      statusBadge = 'নিশ্চিতকৃত (Confirmed)';
      etaText = deliveryZone === 'outside_dhaka' ? '৪৮ ঘণ্টার মধ্যে ডেলিভারি' : '২৪ ঘণ্টার মধ্যে ডেলিভারি';
      routeStatusText = 'অর্ডার কনফার্মড — হাব সেন্টারে পার্সেল প্রস্তুত হচ্ছে';
      break;
    case 'processing':
      initialProgress = 50;
      statusBadge = 'প্রসেসিং ও প্যাকিং';
      etaText = 'আজ বা আগামীকালের মধ্যে ডেলিভারি';
      routeStatusText = 'কোয়ালিটি অডিট ও বারকোড লেবেলিং সম্পন্ন';
      break;
    case 'shipped':
      initialProgress = 70;
      statusBadge = 'হাব ট্রানজিট (Shipped)';
      etaText = 'নিকটস্থ লোকাল হাবে পাঠানো হয়েছে';
      routeStatusText = 'পার্সেল কুরিয়ার / ডেলিভারি সেন্টারে পৌঁছেছে';
      break;
    case 'out_for_delivery':
      initialProgress = 82;
      statusBadge = 'ডেলিভারি হিরো পথে রয়েছে (Live)';
      etaText = 'আনুমানিক ৩০-৪৫ মিনিটের মধ্যে পৌঁছাবে';
      routeStatusText = 'রাইডার পার্সেল নিয়ে আপনার ঠিকানায় গতিশীল রয়েছে';
      break;
    case 'delivered':
      initialProgress = 100;
      statusBadge = 'ডেলিভারি সম্পন্ন (Delivered)';
      etaText = 'পণ্য সফলভাবে হস্তান্তর করা হয়েছে';
      routeStatusText = 'কাস্টমারের কাছে পার্সেল পৌঁছে দেওয়া হয়েছে';
      break;
    case 'cancelled':
      initialProgress = 0;
      statusBadge = 'অর্ডার বাতিল (Cancelled)';
      etaText = 'অর্ডারটি বাতিল করা হয়েছে';
      routeStatusText = 'কোনো ডেলিভারি ট্রানজিট সক্রিয় নেই';
      break;
    default:
      initialProgress = 25;
  }

  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    setProgress(initialProgress);
    // Only animate forward slightly when active rider is genuinely out for delivery
    if (orderStatus === 'out_for_delivery') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 94) return 94;
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [orderStatus, initialProgress]);

  // Formatted Order Placement Time
  const orderTimeFormatted = createdAt
    ? new Date(createdAt).toLocaleString('bn-BD', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'সম্প্রতি';

  const hasAssignedRider = Boolean(riderName && riderName.trim());

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 text-white space-y-6 shadow-2xl overflow-hidden relative">
      {/* Top Status Bar with Real Bangladesh Time */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-pulse">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-white">লাইভ রাইডার জিপিএস ট্র্যাকিং</h3>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {statusBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              অর্ডার নম্বর: <strong className="text-orange-400 font-mono">#{orderId}</strong> • অর্ডার সময়:{' '}
              <span className="text-slate-300 font-medium">{orderTimeFormatted}</span>
            </p>
          </div>
        </div>

        {/* Real Dynamic ETA & Live Clock Widget */}
        <div className="bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">রিয়েল-টাইম ডেলিভারি সময়</p>
              {currentBdTime && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-700/50">
                  {currentBdTime}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">{etaText}</p>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Route */}
      <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* City Streets Simulation SVG */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-[2] fill-none">
          <path d="M 50 150 Q 180 50, 320 180 T 600 120" stroke="#1e293b" strokeWidth="12" />
          <path d="M 120 280 Q 250 180, 420 220 T 700 80" stroke="#1e293b" strokeWidth="8" />
          {/* Active Navigation Route Path */}
          <path
            d="M 60 180 Q 220 80, 380 190 T 620 140"
            stroke={orderStatus === 'cancelled' ? '#64748b' : '#10b981'}
            strokeWidth="5"
            strokeDasharray="8 4"
            className="animate-pulse"
          />
        </svg>

        {/* Origin Warehouse Marker */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full mt-1 text-blue-300">
            ShopX সেন্ট্রাল হাব
          </span>
        </div>

        {/* Moving Progress Marker */}
        <div
          className="absolute transition-all duration-1000 z-20 flex flex-col items-center"
          style={{
            left: `${Math.min(92, Math.max(8, progress))}%`,
            top: '46%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl ring-4 ${
              orderStatus === 'delivered'
                ? 'bg-emerald-500 text-slate-950 ring-emerald-400/40 shadow-emerald-500/80'
                : (orderStatus === 'out_for_delivery'
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 ring-emerald-400/40 shadow-emerald-500/80 animate-bounce'
                  : 'bg-slate-800 text-amber-400 ring-amber-400/30 border border-slate-700')
            }`}>
              {orderStatus === 'delivered' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Truck className="w-6 h-6" />
              )}
            </div>
            {orderStatus === 'out_for_delivery' && (
              <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/60 animate-ping pointer-events-none" />
            )}
          </div>
          <span className="text-[10px] font-black bg-slate-900/95 text-emerald-400 px-2.5 py-0.5 rounded-full mt-1.5 shadow-md flex items-center gap-1 border border-emerald-500/40 whitespace-nowrap">
            <Navigation className="w-3 h-3 fill-emerald-400" /> {routeStatusText}
          </span>
        </div>

        {/* Customer Destination Marker */}
        <div className="absolute right-8 top-1/3 flex flex-col items-center z-10">
          <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/50">
            <MapPin className="w-5 h-5 fill-white" />
          </div>
          <span className="text-[10px] font-bold bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full mt-1 text-rose-300 max-w-[130px] truncate text-center">
            {customerAddress || 'আপনার গন্তব্য'}
          </span>
        </div>
      </div>

      {/* Real Rider Profile or Status Box */}
      {hasAssignedRider ? (
        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {riderName?.charAt(0) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{riderName}</h4>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ★ ভেরিফাইড ডেলিভারি হিরো
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                গাড়ির নম্বর: {vehicleNumber || 'অনুমোদিত বাইক'} • ফোন: {riderPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${riderPhone}`}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি কল দিন ({riderPhone})</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-slate-300">রাইডার অ্যাসাইনমেন্ট স্ট্যাটাস</p>
              <p className="text-[11px] text-slate-500">
                পার্সেল সেন্ট্রাল ওয়্যারহাউজ থেকে বের হওয়ার মুহূর্তে দায়িত্বপ্রাপ্ত রাইডারের নাম ও মোবাইল নম্বর এখানে সরাসরি প্রদর্শিত হবে।
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-800 text-amber-400 text-[11px] font-bold rounded-lg border border-slate-700 whitespace-nowrap">
            ওয়্যারহাউজ প্রসেসিং চলমান
          </span>
        </div>
      )}
    </div>
  );
};
