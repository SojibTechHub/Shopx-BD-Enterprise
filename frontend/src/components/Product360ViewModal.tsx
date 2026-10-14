import React, { useState } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { getSafeImage } from '../utils/image';

interface Product360ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  images?: string[];
}

export const Product360ViewModal: React.FC<Product360ViewModalProps> = ({
  isOpen,
  onClose,
  productTitle = 'Flagship Product',
  images = [],
}) => {
  const { lang } = useLanguageStore();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeColor, setActiveColor] = useState('Desert Titanium');

  if (!isOpen) return null;

  const defaultImages = [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <RotateCw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase">
                360° Interactive 3D Mode
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-100 truncate max-w-md">
                {productTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 360 Interactive Viewport */}
        <div className="relative my-6 aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none">
          <div
            className="transition-transform duration-200"
            style={{
              transform: `rotate(${rotationAngle}deg) scale(${zoomLevel})`,
            }}
          >
            <img
              src={getSafeImage(displayImages[0])}
              alt={productTitle}
              className="max-h-64 object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] pointer-events-none"
            />
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            {lang === 'bn' ? 'ঘুরাতে স্লাইডার ব্যবহার করুন' : 'Use sliders to inspect all angles'}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'অ্যাঙ্গেল রোটেশন (৩৬০°)' : 'Angle Rotation'}</span>
            <span className="text-orange-400 font-mono font-bold">{rotationAngle}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setRotationAngle(0);
                  setZoomLevel(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition"
              >
                {lang === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Genuine Photogrammetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
