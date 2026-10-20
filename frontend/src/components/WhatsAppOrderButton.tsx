import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppOrderButton: React.FC = () => {
  const whatsappNumber = '8801942791004';
  const defaultMessage = encodeURIComponent(
    'আসসালামু আলাইকুম ShopX BD, আমি আপনাদের প্ল্যাটফর্ম থেকে পণ্য অর্ডার করতে চাই।'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group ring-4 ring-emerald-400/30"
      title="হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      <span className="text-xs font-black hidden group-hover:inline transition-all">
        হোয়াটসঅ্যাপ অর্ডার 💬
      </span>
    </a>
  );
};
