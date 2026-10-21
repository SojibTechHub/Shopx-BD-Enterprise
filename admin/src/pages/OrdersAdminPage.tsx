import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Printer,
  Phone,
  MapPin,
  Compass,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
  Building2,
  QrCode,
  Receipt,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Box,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { api } from '../services/api';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminLanguageStore } from '../store/useAdminLanguageStore';

export const OrdersAdminPage: React.FC = () => {
  const { user } = useAdminAuthStore();
  const { lang, t } = useAdminLanguageStore();
  const isAdmin = user?.role === 'admin';

  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedMapDistrict, setSelectedMapDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceFormat, setInvoiceFormat] = useState<'thermal' | 'a4'>('thermal');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const res = await api.get('/admin/orders');
        if (res.data?.success) setOrders(res.data.data);
      } else {
        const res = await api.get('/vendor/dashboard');
        if (res.data?.success) setOrders(res.data.data.recentOrders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await api.get('/riders/status');
      if (res.data?.success) setRiders(res.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId: string, status: string, riderId?: string) => {
    try {
      const payload: any = { status };
      if (riderId) payload.riderId = riderId;
      await api.put(`/orders/${orderId}/status`, payload);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, orderStatus: status }));
      }
    } catch (err) {
      alert(lang === 'en' ? 'Status update failed.' : 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        paymentStatus,
        message: paymentStatus === 'paid' ? 'পেমেন্ট সফলভাবে ভেরিফাই ও গ্রহণ করা হয়েছে।' : 'পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে।'
      });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, paymentStatus }));
      }
      alert(
        paymentStatus === 'paid'
          ? (lang === 'en' ? 'Payment successfully marked as PAID!' : 'পেমেন্ট সফলভাবে অনুমোদিত ও পেইড মার্ক করা হয়েছে!')
          : (lang === 'en' ? 'Payment status updated.' : 'পেমেন্ট স্ট্যাটাস আপডেট করা হয়েছে।')
      );
    } catch (err) {
      alert(lang === 'en' ? 'Payment status update failed.' : 'পেমেন্ট আপডেট ব্যর্থ হয়েছে।');
    }
  };

  const handleCourierBook = async (orderId: string, courier: 'steadfast' | 'pathao' | 'dex' | 'redx') => {
    try {
      const res = await api.post(`/courier/${courier}/book`, { orderId, id: orderId, _id: orderId });
      if (res.data?.success) {
        alert(
          lang === 'en'
            ? `📦 ${res.data.message}\nConsignment ID: ${res.data.consignmentId}\nHub: ${res.data.hub || 'Dispatched'}`
            : `📦 ${res.data.message}\nকনসাইনমেন্ট আইডি: ${res.data.consignmentId}\nহাব: ${res.data.hub || 'ডিসপ্যাচড'}`
        );
        fetchOrders();
      }
    } catch (err: any) {
      alert(
        (err.response?.data?.message) ||
        (lang === 'en' ? 'Courier booking failed.' : 'কুরিয়ার বুকিং ব্যর্থ হয়েছে।')
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered orders by search & district
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerInfo?.phone?.includes(searchQuery) ||
      o.customerInfo?.district?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict =
      selectedMapDistrict === 'all' || o.customerInfo?.district === selectedMapDistrict;

    return matchesSearch && matchesDistrict;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; labelEn: string; labelBn: string }> = {
      placed: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', labelEn: 'Placed', labelBn: 'গৃহীত' },
      confirmed: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', labelEn: 'Confirmed', labelBn: 'প্যাকড' },
      shipped: { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400', labelEn: 'Dispatched', labelBn: 'কুরিয়ারে' },
      out_for_delivery: { bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-400', labelEn: 'Out for Delivery', labelBn: 'রাইডারে' },
      delivered: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', labelEn: 'Delivered', labelBn: 'ডেলিভার্ড' },
      cancelled: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', labelEn: 'Cancelled', labelBn: 'বাতিল' },
    };
    const s = map[status] || map.placed;
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap inline-flex items-center gap-1 ${s.bg} ${s.text}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {lang === 'en' ? s.labelEn : s.labelBn}
      </span>
    );
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-5 max-w-full overflow-hidden">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
            <span>{t('orders.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t('orders.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('orders.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>

          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('refresh')}</span>
          </button>
        </div>
      </div>

      {/* Orders Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:px-6 border-b border-slate-800 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-xs sm:text-sm text-slate-200">
              {t('orders.total_count')} <strong className="text-orange-400">{filteredOrders.length}</strong>
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {t('orders.live_sync')}
          </span>
        </div>

        {/* 1. Mobile Responsive Card View (< md) - Guaranteed 0 text cut off */}
        <div className="p-3 space-y-3 md:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              {lang === 'en' ? 'No orders found.' : 'কোন অর্ডার পাওয়া যায়নি।'}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
              >
                {/* Header: Order ID & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      #{order.orderId}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Customer Details */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-xs">{order.customerInfo?.name || 'Customer'}</span>
                    <span className="font-mono font-black text-orange-400 text-sm">৳{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-mono">{order.customerInfo?.phone}</span>
                    <span className="uppercase text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {order.paymentMethod} • {order.paymentStatus === 'paid' ? t('orders.paid') : t('orders.cod_due')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{order.customerInfo?.district || 'Dhaka'} — {order.customerInfo?.address}</span>
                  </p>
                </div>

                {/* Quick Courier API Booking Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleCourierBook(order._id, 'dex')}
                      className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/60 text-amber-300 rounded-lg text-[10px] font-bold hover:bg-amber-900 transition shadow-sm"
                      title="ShopX DEX Express Logistics API"
                    >
                      DEX Express
                    </button>
                    <button
                      onClick={() => handleCourierBook(order._id, 'steadfast')}
                      className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-900 transition"
                    >
                      Steadfast
                    </button>
                    <button
                      onClick={() => handleCourierBook(order._id, 'pathao')}
                      className="px-2.5 py-1 bg-rose-950/80 border border-rose-600/60 text-rose-400 rounded-lg text-[10px] font-bold hover:bg-rose-900 transition"
                    >
                      Pathao
                    </button>
                    <button
                      onClick={() => handleCourierBook(order._id, 'redx')}
                      className="px-2.5 py-1 bg-red-950/80 border border-red-600/60 text-red-300 rounded-lg text-[10px] font-bold hover:bg-red-900 transition"
                      title="RedX Logistics API"
                    >
                      RedX
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsInvoiceOpen(false);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
                      title={t('orders.view_details')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="p-1.5 bg-emerald-950/80 border border-emerald-700 hover:bg-emerald-900 text-emerald-300 rounded-xl transition"
                      title={t('orders.invoice')}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. Desktop Widescreen Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">{t('orders.th_order_no')}</th>
                <th className="py-3.5 px-4 min-w-[160px]">{t('orders.th_customer')}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{t('orders.th_amount')}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{t('orders.th_payment')}</th>
                <th className="py-3.5 px-4 whitespace-nowrap">{t('orders.th_status')}</th>
                <th className="py-3.5 px-4 min-w-[150px]">{t('orders.th_courier')}</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">{t('orders.th_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {lang === 'en' ? 'No orders found matching criteria.' : 'কোন অর্ডার খুঁজে পাওয়া যায়নি।'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-black text-emerald-400 whitespace-nowrap">
                      #{order.orderId}
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white truncate max-w-[180px]">{order.customerInfo?.name || 'Customer'}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{order.customerInfo?.phone}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{order.customerInfo?.district || 'Dhaka'}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-black text-white whitespace-nowrap text-sm">
                      ৳{order.totalAmount}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="uppercase text-[11px] font-bold text-slate-300 block">
                        {order.paymentMethod || 'COD'}
                      </span>
                      <span
                        className={`text-[10px] font-bold inline-flex items-center gap-1 ${
                          order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        ● {order.paymentStatus === 'paid' ? t('orders.paid') : t('orders.cod_due')}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCourierBook(order._id, 'dex')}
                          className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/60 text-amber-300 rounded-lg text-[10px] font-bold hover:bg-amber-900 transition shadow-sm"
                          title="ShopX DEX Express Logistics API"
                        >
                          DEX
                        </button>
                        <button
                          onClick={() => handleCourierBook(order._id, 'steadfast')}
                          className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-900 transition shadow-sm"
                          title="Steadfast Courier Booking API"
                        >
                          Steadfast
                        </button>
                        <button
                          onClick={() => handleCourierBook(order._id, 'pathao')}
                          className="px-2.5 py-1 bg-rose-950/80 border border-rose-600/60 text-rose-400 rounded-lg text-[10px] font-bold hover:bg-rose-900 transition shadow-sm"
                          title="Pathao Express Booking API"
                        >
                          Pathao
                        </button>
                        <button
                          onClick={() => handleCourierBook(order._id, 'redx')}
                          className="px-2.5 py-1 bg-red-950/80 border border-red-600/60 text-red-300 rounded-lg text-[10px] font-bold hover:bg-red-900 transition shadow-sm"
                          title="RedX Logistics Booking API"
                        >
                          RedX
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsInvoiceOpen(false);
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700 inline-block"
                        title={t('orders.view_details')}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsInvoiceOpen(true);
                        }}
                        className="p-2 bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900 text-emerald-300 rounded-xl transition inline-block"
                        title={t('orders.invoice')}
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {lang === 'en' ? 'Order Details' : 'অর্ডার বিবরণ'} #{selectedOrder.orderId}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {new Date(selectedOrder.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'bn-BD')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details & Address */}
            <div className="bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs sm:text-sm">{selectedOrder.customerInfo?.name}</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedOrder.customerInfo?.phone}</span>
              </div>
              <p className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.thana}, {selectedOrder.customerInfo?.district}
                </span>
              </p>
            </div>

            {/* Payment & TrxID Verification Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {lang === 'en' ? 'Payment & Verification' : 'পেমেন্ট ও ভেরিফিকেশন'}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  selectedOrder.paymentStatus === 'paid'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : selectedOrder.paymentStatus === 'pending_verification'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedOrder.paymentStatus === 'paid'
                    ? (lang === 'en' ? 'PAID' : 'পরিশোধিত')
                    : selectedOrder.paymentStatus === 'pending_verification'
                    ? (lang === 'en' ? 'VERIFICATION PENDING' : 'ভেরিফিকেশন অপেক্ষমাণ')
                    : (selectedOrder.paymentStatus || 'PENDING')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === 'en' ? 'Method:' : 'পদ্ধতি:'}</span>
                  <strong className="text-white uppercase font-mono">{selectedOrder.paymentMethod || 'COD'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{lang === 'en' ? 'Total Amount:' : 'মোট মূল্য:'}</span>
                  <strong className="text-emerald-400 font-mono text-sm">৳{selectedOrder.totalAmount}</strong>
                </div>
                {selectedOrder.senderNumber && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">{lang === 'en' ? 'Sender Number:' : 'প্রেরকের নম্বর:'}</span>
                    <strong className="text-white font-mono">{selectedOrder.senderNumber}</strong>
                  </div>
                )}
                {selectedOrder.transactionId && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">{lang === 'en' ? 'Transaction ID (TrxID):' : 'ট্রানজেকশন আইডি (TrxID):'}</span>
                    <strong className="text-amber-400 font-mono font-black">{selectedOrder.transactionId}</strong>
                  </div>
                )}
              </div>

              {/* Quick Action to Verify & Approve Payment */}
              {selectedOrder.paymentStatus !== 'paid' && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdatePaymentStatus(selectedOrder._id, 'paid')}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? '✓ Verify & Mark Paid' : '✓ পেমেন্ট ভেরিফাই ও গ্রহণ করুন'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdatePaymentStatus(selectedOrder._id, 'failed')}
                    className="py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold transition"
                    title="Mark as invalid / unpaid"
                  >
                    {lang === 'en' ? 'Invalid TrxID' : 'ভুয়া TrxID'}
                  </button>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? 'Order Items' : 'অর্ডারের পণ্যসমূহ'}
              </h4>
              {selectedOrder.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-950 rounded-2xl text-xs border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image && typeof item.image === 'string' && item.image.trim() !== '' ? item.image : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={item.title || 'Product'}
                      className="w-10 h-10 object-cover rounded-xl bg-slate-800 flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white truncate max-w-[140px] sm:max-w-xs">{item.title}</p>
                      <p className="text-slate-400 text-[11px]">{lang === 'en' ? 'Qty:' : 'পরিমাণ:'} {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Status Changer Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                className="py-2.5 px-2 sm:px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition text-center truncate"
              >
                {lang === 'en' ? '✓ Confirm' : '✓ কনফার্ম'}
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery')}
                className="py-2.5 px-2 sm:px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow transition text-center truncate"
              >
                {lang === 'en' ? '🚚 Assign Rider' : '🚚 রাইডারে দিন'}
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                className="py-2.5 px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition text-center truncate"
              >
                {lang === 'en' ? '🎉 Delivered' : '🎉 সম্পন্ন'}
              </button>
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="py-2.5 px-2 sm:px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border border-slate-700 truncate"
              >
                <Printer className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span className="truncate">{lang === 'en' ? 'Invoice' : 'ইনভয়েস'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Thermal POS & A4 Tax Invoice Modal */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:max-w-none print:w-full print:p-0 print:m-0 print:bg-white">
            
            {/* Header & Format Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 print:hidden">
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInvoiceFormat('thermal')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    invoiceFormat === 'thermal' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>80mm POS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceFormat('a4')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    invoiceFormat === 'a4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official A4</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thermal POS Slip Format */}
            {invoiceFormat === 'thermal' ? (
              <div className="my-2 mx-auto max-w-sm bg-white text-slate-950 p-5 rounded-2xl font-mono text-xs shadow-inner space-y-4 border border-slate-300 print:border-none print:shadow-none print:max-w-none print:w-full print:m-0 print:p-4">
                <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-slate-400">
                  <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">SHOPX BANGLADESH</h2>
                  <p className="text-[10px] text-slate-600">Enterprise Multi-Vendor Supermall</p>
                  <p className="text-[10px] text-slate-600">Hotline: 01942-791004 | support@shopxbd.com</p>
                </div>

                <div className="bg-slate-50 border border-dashed border-slate-300 p-2.5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase">
                    COURIER DISPATCH STICKER ({selectedOrder.customerInfo?.district || 'Dhaka'})
                  </span>
                  <div className="font-mono text-sm sm:text-base font-black tracking-widest text-slate-900">
                    *CN-{selectedOrder.orderId?.replace(/\D/g, '') || '948271'}*
                  </div>
                </div>

                <div className="text-[11px] space-y-1 border-b border-dashed border-slate-300 pb-2.5">
                  <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                  <p><strong>Customer:</strong> {selectedOrder.customerInfo?.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerInfo?.phone}</p>
                  <p><strong>District:</strong> {selectedOrder.customerInfo?.district || 'Dhaka'}</p>
                  <p><strong>Address:</strong> {selectedOrder.customerInfo?.address}</p>
                  <p><strong>Payment:</strong> <span className="uppercase font-bold">{selectedOrder.paymentMethod || 'COD'}</span> ({selectedOrder.paymentStatus === 'paid' ? 'PAID' : 'DUE / PENDING'})</p>
                  {selectedOrder.transactionId && (
                    <p><strong>TrxID:</strong> <span className="font-bold">{selectedOrder.transactionId}</span> {selectedOrder.senderNumber ? `(from ${selectedOrder.senderNumber})` : ''}</p>
                  )}
                </div>

                <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2.5">
                  {selectedOrder.items?.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[180px]">{it.title} × {it.quantity}</span>
                      <span className="font-bold">৳{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] space-y-1 border-b-2 border-dashed border-slate-400 pb-2.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳{selectedOrder.subTotal || selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>৳{selectedOrder.deliveryFee || 60}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-black pt-1 border-t">
                    <span>TOTAL PAYABLE:</span>
                    <span className="font-mono text-emerald-800">৳{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <p className="text-[10px] font-bold text-slate-800">THANK YOU FOR SHOPPING WITH SHOPX BD!</p>
                  <div className="pt-2 flex justify-center">
                    <div className="p-1 bg-slate-100 rounded border border-slate-300">
                      <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-slate-800" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* A4 Tax Invoice Format */
              <div className="my-2 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl text-xs shadow-inner space-y-6 border border-slate-300 print:border-none print:shadow-none print:p-4 print:m-0">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-950">SHOPX BANGLADESH LIMITED</h2>
                    <p className="text-slate-600">Head Office: Rowmari, Kurigram, Rangpur, Bangladesh</p>
                    <p className="text-slate-600">Hotline: +880 1942-791004 | support: sojibahmedshorif25@gmail.com</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      OFFICIAL TAX INVOICE
                    </span>
                    <p className="font-mono font-bold text-sm">#{selectedOrder.orderId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <p className="font-bold text-slate-900">BILL TO:</p>
                    <p>{selectedOrder.customerInfo?.name}</p>
                    <p>{selectedOrder.customerInfo?.phone}</p>
                    <p>{selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.district}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">SHIPPING & LOGISTICS:</p>
                    <p>Partner: Steadfast / Pathao Express</p>
                    <p>Consignment: CN-{selectedOrder.orderId?.replace(/\D/g, '') || '948271'}</p>
                    <p>Payment: <span className="uppercase font-bold">{selectedOrder.paymentMethod || 'COD'}</span> ({selectedOrder.paymentStatus === 'paid' ? 'PAID' : 'DUE / PENDING'})</p>
                    {selectedOrder.transactionId && (
                      <p>TrxID: <span className="font-bold">{selectedOrder.transactionId}</span> {selectedOrder.senderNumber ? `(Sender: ${selectedOrder.senderNumber})` : ''}</p>
                    )}
                  </div>
                </div>

                <table className="w-full text-left text-xs border">
                  <thead className="bg-slate-100 font-bold border-b text-[10px]">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.items?.map((it: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold">{it.title}</td>
                        <td className="p-2 text-center">{it.quantity}</td>
                        <td className="p-2 text-right font-mono">৳{it.price}</td>
                        <td className="p-2 text-right font-bold font-mono">৳{it.price * it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-end pt-2">
                  <div className="text-slate-500 text-[10px]">
                    <p>✓ 100% Genuine Quality Guaranteed</p>
                    <p className="pt-3 border-t w-32 text-center text-[10px] text-slate-700">Authorized Signature</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border space-y-1 w-48 sm:w-64 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono">৳{selectedOrder.subTotal || selectedOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="font-mono">৳{selectedOrder.deliveryFee || 60}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm pt-1 border-t">
                      <span>Total:</span>
                      <span className="font-mono text-emerald-800">৳{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
