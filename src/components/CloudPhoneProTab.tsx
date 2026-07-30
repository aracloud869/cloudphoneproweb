import React, { useState } from 'react';
import { CloudPhoneProSettings } from '../types';
import { Download, Smartphone, Star, Cpu, ShieldCheck, Zap, Sparkles, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface CloudPhoneProTabProps {
  settings: CloudPhoneProSettings;
}

export const CloudPhoneProTab: React.FC<CloudPhoneProTabProps> = ({ settings }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const images = settings.previewImages || [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Store Header App Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* App Icon */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-950 p-1.5 border-2 border-indigo-500/50 flex-shrink-0 shadow-2xl shadow-indigo-500/30">
            <img
              src={settings.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80"}
              alt={settings.appName}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80";
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-600 p-1.5 rounded-xl text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* App Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 tracking-wider">
                CH PLAY GAMING STORE
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                {settings.appName || "Cloud Phone Pro"}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-400 font-mono font-semibold">
                Phiên bản: {settings.version || "v3.5.2-Gaming"}
              </p>
            </div>

            {/* Rating & Stats Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {settings.rating || "4.9 ★"}
              </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Khuyên Dùng Cho Treo Game
              </span>
            </div>

            {/* Download Button */}
            <div className="pt-2">
              <a
                href={settings.downloadUrl || "#"}
                target="_self"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                <Download className="w-5 h-5 animate-bounce" />
                TẢI XUỐNG CLOUD PHONE PRO (APK)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot / Preview Images Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          HÌNH ẢNH XEM TRƯỚC APP
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(img)}
              className="group relative h-48 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all shadow-md"
            >
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-white font-mono font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Xem ảnh lớn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          GIỚI THIỆU & MÔ TẢ
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {settings.description || "Trải nghiệm Cloud Phone Pro chuẩn Gaming đỉnh cao. Cấu hình cực mạnh, mạng 10Gbps chuyên dụng, cắm treo Blox Fruits, Pet Simulator, Roblox và các ứng dụng Android 24/7 mượt mà không nóng máy."}
        </p>
      </div>

      {/* Technical Specifications Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          CẤU HÌNH CLOUD PHONE GAMING
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(settings.specs || []).map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{spec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
        >
          <img
            src={activeImage}
            alt="Enlarged preview"
            className="max-w-full max-h-[85vh] rounded-2xl border border-indigo-500/40 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
