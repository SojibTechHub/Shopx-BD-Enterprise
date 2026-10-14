import React, { useState } from 'react';
import {
  X,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Box,
  Layers,
  Ruler,
  Smartphone,
  Eye,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface Product3DStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export const Product3DStudioModal: React.FC<Product3DStudioModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const [rotationAngle, setRotationAngle] = useState(0);
  const [lightingMode, setLightingMode] = useState<'studio' | 'neon' | 'sunset'>('neon');
  const [showWireframe, setShowWireframe] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const title = product?.title || 'Apple iPhone 16 Pro Max (Desert Titanium 256GB)';
  const price = product?.discountPrice || product?.price || 169900;
  const image = product?.thumbnail || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80';

  const rotateLeft = () => setRotationAngle((prev) => (prev - 45 + 360) % 360);
  const rotateRight = () => setRotationAngle((prev) => (prev + 45) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Glow */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            lightingMode === 'neon'
              ? 'bg-cyan-500/15'
              : lightingMode === 'sunset'
              ? 'bg-amber-500/15'
              : 'bg-white/10'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20">
              <Box className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white">
                  {lang === 'bn' ? '৩৬০° ইন্টারেক্টিভ থ্রি-ডি ও এআর স্টুডিও' : 'Interactive 3D WebGL & AR Studio'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-black uppercase">
                  WebGL 60FPS
                </span>
              </div>
              <p className="text-xs text-slate-400">{title}</p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-400 block">Offer Price:</span>
            <span className="text-lg font-black text-orange-400 font-mono">{formatPrice(price)}</span>
          </div>
        </div>

        {/* 3D Viewport Area */}
        <div
          className={`relative w-full h-80 sm:h-96 rounded-3xl border flex items-center justify-center overflow-hidden transition-all duration-500 shadow-2xl ${
            lightingMode === 'neon'
              ? 'bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border-cyan-500/40 shadow-cyan-500/10'
              : lightingMode === 'sunset'
              ? 'bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 border-amber-500/40 shadow-amber-500/10'
              : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800'
          }`}
        >
          {/* 3D Mesh Floor Grid Simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

          {/* Dimension Measure Overlays */}
          {showDimensions && (
            <div className="absolute inset-x-12 inset-y-8 pointer-events-none flex flex-col justify-between border-2 border-dashed border-cyan-400/50 rounded-2xl p-4 animate-fadeIn">
              <div className="flex justify-between text-[11px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded w-fit">
                <span>Height: 160.7 mm</span>
              </div>
              <div className="flex justify-end text-[11px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded w-fit self-end">
                <span>Width: 77.6 mm • Depth: 8.25 mm</span>
              </div>
            </div>
          )}

          {/* Interactive 3D Product Container with Smooth Rotation */}
          <div
            className="relative z-10 transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing flex items-center justify-center"
            style={{
              transform: `rotateY(${rotationAngle}deg) scale(${zoomLevel}) ${
                isExploded ? 'translateY(-10px)' : ''
              }`,
            }}
          >
            <img
              src={getSafeImage(image)}
              alt={title}
              className={`w-56 h-56 sm:w-72 sm:h-72 object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-all ${
                showWireframe ? 'opacity-80 invert contrast-200' : ''
              }`}
            />

            {isExploded && (
              <div className="absolute -top-6 -right-6 px-3 py-1 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full uppercase shadow-lg animate-bounce">
                Exploded Anatomy View
              </div>
            )}
          </div>

          {/* Floating Rotation Degree Badge */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-mono text-slate-300">
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yaw: {rotationAngle}°</span>
          </div>

          {/* AR Camera Placement Button */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={() => alert('Mobile AR Room scale launched! Point your camera to place item in your room.')}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition hover:scale-105"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'মোবাইলে এআর ভিউ' : 'View in Your Room (AR)'}</span>
            </button>
          </div>
        </div>

        {/* 3D Studio Controls Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Rotation Controls */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">360° Rotate:</span>
            <div className="flex space-x-1.5">
              <button
                onClick={rotateLeft}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                title="Rotate Left 45°"
              >
                ↺ -45°
              </button>
              <button
                onClick={rotateRight}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                title="Rotate Right 45°"
              >
                +45° ↻
              </button>
            </div>
          </div>

          {/* Lighting Mode Selector */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lighting:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setLightingMode('neon')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  lightingMode === 'neon' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
                title="Cyber Neon Studio"
              >
                Neon
              </button>
              <button
                onClick={() => setLightingMode('sunset')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  lightingMode === 'sunset' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
                title="Sunset Amber Studio"
              >
                Sunset
              </button>
            </div>
          </div>

          {/* Dimension Toggle */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition ${
              showDimensions
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>{showDimensions ? 'Hide Dimensions' : 'Show Dimensions'}</span>
          </button>

          {/* Explode View Toggle */}
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition ${
              isExploded
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isExploded ? 'Collapse Parts' : 'Explode Parts'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
