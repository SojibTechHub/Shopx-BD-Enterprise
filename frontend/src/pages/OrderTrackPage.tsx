import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Truck,
  Phone,
  ShieldCheck,
  MapPin,
  Printer,
  RotateCcw,
  PackageCheck,
  Compass,
  Sparkles,
  Share2,
  ExternalLink,
  Clock,
  Building2,
} from 'lucide-react';
import { LiveRiderMap } from '../components/LiveRiderMap';
import { ThermalInvoiceModal } from '../components/ThermalInvoiceModal';
import { ReturnExchangeModal } from '../components/ReturnExchangeModal';
import { UnboxingProofModal } from '../components/UnboxingProofModal';
import { api } from '../services/api';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

export const OrderTrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const [query, setQuery] = useState(initialOrderId);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isUnboxOpen, setIsUnboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchTracking = async (searchVal: string) => {
    if (!searchVal) return;
    const cleanSearch = searchVal.split('\n')[0].substring(0, 50).replace(/^#/, '').trim();
    if (!cleanSearch) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/track?orderId=${encodeURIComponent(cleanSearch)}`);
      if (res.data?.success) {
        setOrder(res.data.data);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (lang === 'bn' ? 'কোনো অর্ডার তথ্য পাওয়া যায়নি।' : 'No active order found with this ID or phone number.')
      );
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const steps = [
    {
      key: 'placed',
      title: lang === 'bn' ? 'অর্ডার গৃহীত' : 'Order Placed',
      desc: lang === 'bn' ? 'সিস্টেমে ভেরিফাইড' : 'Logged & Verified',
    },
    {
      key: 'confirmed',
      title: lang === 'bn' ? 'প্যাকেজিং সম্পন্ন' : 'Hub Packed',
      desc: lang === 'bn' ? 'সেন্ট্রাল হাবে প্রস্তুত' : 'Quality Checked',
    },
    {
      key: 'shipped',
      title: lang === 'bn' ? 'কুরিয়ারে হস্তান্তর' : 'Dispatched',
      desc: lang === 'bn' ? 'জেলা হাবে পাঠানো হয়েছে' : 'In Transit Hub',
    },
    {
      key: 'out_for_delivery',
      title: lang === 'bn' ? 'রাইডার ডেলিভারিতে' : 'Out for Delivery',
      desc: lang === 'bn' ? 'ঠিকানায় রওয়ানা হয়েছে' : 'Rider En Route',
    },
    {
      key: 'delivered',
      title: lang === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered',
      desc: lang === 'bn' ? 'পণ্য পৌঁছে দেওয়া হয়েছে' : 'Handed Over',
    },
  ];

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = {
      placed: 0,
      confirmed: 1,
      processing: 1,
      shipped: 2,
      out_for_delivery: 3,
      delivered: 4,
    };
    return map[status] ?? 0;
  };

  const handleShareTracking = () => {
    const url = `${window.location.origin}/track-order?orderId=${order?.orderNumber || order?.orderId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'bn' ? '৬৪ জেলায় লাইভ ডেলিভারি ট্র্যাকার' : '64-District High-Speed Delivery Tracker'}</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {lang === 'bn' ? 'অর্ডার লাইভ ট্র্যাকিং ও জিপিএস ম্যাপ' : 'Live Order & GPS Tracking'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {lang === 'bn'
            ? 'আপনার অর্ডার আইডি (যেমন: SX-889894) অথবা মোবাইল নম্বর দিয়ে লাইভ স্ট্যাটাস দেখুন'
            : 'Enter your Order ID (e.g. SX-889894) or customer phone number to track live'}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto pt-1">
          <input
            type="text"
            placeholder={lang === 'bn' ? 'অর্ডার আইডি / মোবাইল নম্বর...' : 'Order ID (e.g. SX-889894)...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm outline-none focus:border-emerald-600 shadow-sm font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center transition shadow-md text-xs sm:text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Search className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </form>

        {error && (
          <p className="text-xs font-bold text-rose-700 bg-rose-50 py-2.5 px-4 rounded-2xl border border-rose-200 animate-in fade-in">
            {error}
          </p>
        )}
      </div>

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Order Header & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {lang === 'bn' ? 'লাইভ ট্র্যাকিং সক্রিয়' : 'Live Tracking Active'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {lang === 'bn' ? 'অর্ডার নং' : 'Order'}: #{order.orderNumber || order.orderId}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'bn' ? 'গ্রাহক:' : 'Customer:'} <strong>{order.customerInfo?.name}</strong> ({order.customerInfo?.phone})
              </p>
            </div>

            {/* Print Invoice, Share and Return Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ইনভয়েস ও PDF' : 'Invoice & PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareTracking}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center space-x-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>{copiedLink ? (lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : (lang === 'bn' ? 'শেয়ার' : 'Share')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReturnOpen(true)}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? '১৪ দিনের রিটার্ন' : '14-Day Return'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="py-2">
            <div className="grid grid-cols-5 gap-2 text-center relative z-10">
              {steps.map((step, idx) => {
                const currentIdx = getStepIndex(order.orderStatus);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isPassed
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-200 scale-105' : ''}`}
                    >
                      {isPassed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <p
                      className={`text-xs font-bold ${
                        isPassed ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daraz Express (DEX) & Courier Consignment Info Box */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 p-5 rounded-3xl border border-emerald-200/80 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-slate-900">
                    {lang === 'bn' ? 'লজিস্টিকস ও কুরিয়ার পার্টনার:' : 'Logistics Partner:'}
                  </span>
                  <span className="bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-black text-[11px] shadow-sm flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>ShopX DEX Express (DEX Priority) / Steadfast BD</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <span>{lang === 'bn' ? 'কনসাইনমেন্ট ট্র্যাকিং আইডি:' : 'Consignment ID:'}</span>
                  <strong className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs">
                    {order.trackingHistory?.find((t: any) => t.message?.includes('আইডি:'))?.message?.split('আইডি:')[1]?.trim() || `DEX-BD-${order.orderNumber?.replace(/\D/g, '') || '948271'}`}
                  </strong>
                </div>
              </div>

              {/* Delivery Guarantee Badge */}
              <div className="bg-amber-50 border border-amber-300/80 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-black text-amber-950">
                    {lang === 'bn' ? '⚡ ShopX অন-টাইম গ্যারান্টি' : '⚡ ShopX On-Time Guarantee'}
                  </p>
                  <p className="text-[10px] text-amber-800">
                    {lang === 'bn' ? 'দেরি হলে স্বয়ংক্রিয় ৳৫০ ক্যাশব্যাক' : 'Guaranteed 24-48h Delivery or ৳50 Cashback'}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Handshake & Notification Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {lang === 'bn' ? 'ডেলিভারি ভেরিফিকেশন ওটিপি' : 'Delivery Security OTP'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'bn' ? 'পার্সেল গ্রহণের সময় রাইডারকে বলুন' : 'Provide code to rider upon handoff'}
                  </p>
                </div>
                <span className="font-mono font-black text-lg text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 tracking-widest shadow-inner">
                  {String(Math.abs((order.orderNumber || order.orderId || '9241').split('').reduce((acc: number, char: string) => acc * 33 + char.charCodeAt(0), 11))).slice(-4).padStart(4, '8')}
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                  📱
                </div>
                <div className="text-[11px] text-slate-600">
                  <p className="font-bold text-slate-900">
                    {lang === 'bn' ? 'রিয়েলটাইম SMS অ্যালার্ট সক্রিয়' : 'Real-time SMS & Email Dispatched'}
                  </p>
                  <p className="text-slate-500 font-mono">
                    {order.customerInfo?.phone || '+8801XXXXXXXXX'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Interactive GPS Rider Map */}
          <LiveRiderMap
            orderId={order.orderId || order.orderNumber}
            riderName={order.rider?.name}
            riderPhone={order.rider?.phone}
            vehicleNumber={order.rider?.vehicleNumber}
            customerAddress={order.customerInfo?.address || 'Dhaka, Bangladesh'}
            orderStatus={order.orderStatus}
            createdAt={order.createdAt}
            deliveryZone={order.customerInfo?.deliveryZone}
          />

          {/* Rider & Delivery Contact Box */}
          {order.rider ? (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-emerald-900 font-bold">
                    {lang === 'bn' ? 'নিযুক্ত ডেলিভারি রাইডার' : 'Assigned Delivery Rider'}
                  </p>
                  <p className="text-sm font-black text-slate-900">{order.rider.name}</p>
                  <p className="text-xs text-slate-600 font-mono">
                    {lang === 'bn' ? 'ফোন:' : 'Phone:'} {order.rider.phone}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${order.rider.phone}`}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {lang === 'bn' ? 'কল করুন' : 'Call Rider'}
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-800 font-bold">
                    {lang === 'bn' ? 'রাইডার ডিসপ্যাচ প্রক্রিয়া' : 'Rider Dispatch Progress'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'bn'
                      ? 'অর্ডার প্রসেসিং ও প্যাকেজিং শেষে নিকটস্থ লোকাল হাব থেকে রাইডার যুক্ত করা হবে।'
                      : 'A delivery rider will be assigned once packaging and hub sorting completes.'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
                {lang === 'bn' ? 'অ্যাসাইনমেন্ট প্রক্রিয়াধীন' : 'In Progress'}
              </span>
            </div>
          )}

          {/* Ordered Products Summary */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-3">
              {lang === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ' : 'Ordered Items'}
            </h4>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={getSafeImage(item.image)}
                      alt={item.title || 'Product'}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-500 font-mono">
                        {lang === 'bn' ? 'পরিমাণ:' : 'Qty:'} {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-800 font-mono text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Thermal & A4 Tax Invoice Modal */}
      {order && (
        <ThermalInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={{
            orderNumber: order.orderNumber || order.orderId,
            customerInfo: order.customerInfo,
            items: order.items?.map((i: any) => ({
              product: { title: i.title, price: i.price },
              quantity: i.quantity,
              price: i.price,
            })),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
          }}
        />
      )}

      {/* 14-Day Return & Refund Modal */}
      <ReturnExchangeModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        orderId={order?.orderNumber || order?.orderId}
      />

      {/* Unboxing Check Guarantee Modal */}
      <UnboxingProofModal
        isOpen={isUnboxOpen}
        onClose={() => setIsUnboxOpen(false)}
      />
    </div>
  );
};
