import React, { useState } from 'react';
import { RobloxHack, HackVersion } from '../types';
import { Search, Download, Gamepad2, Layers, ExternalLink, X, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HackRobloxTabProps {
  hacks: RobloxHack[];
}

export const HackRobloxTab: React.FC<HackRobloxTabProps> = ({ hacks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHack, setSelectedHack] = useState<RobloxHack | null>(null);

  const filteredHacks = hacks.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-cyan-400 animate-pulse" />
            HACK ROBLOX CLIENTS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp các bản Client Hack Roblox hot nhất, mượt mà và cập nhật liên tục.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bản Hack..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 text-white text-sm border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Hacks List - Horizontal Panels stacked Vertically */}
      <div className="space-y-3">
        {filteredHacks.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">
              {searchTerm ? 'Không tìm thấy bản hack nào phù hợp' : 'Chưa có bản hack nào. Vui lòng thêm từ trang Admin.'}
            </p>
          </div>
        ) : (
          filteredHacks.map((hack) => (
            <div
              key={hack.id}
              className="group relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 shadow-md"
            >
              {/* Left Side: Icon, Name, Version */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-14 h-14 rounded-xl bg-slate-950 p-1 border border-cyan-500/30 flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={hack.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                    alt={hack.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {hack.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {hack.version || 'v1.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                    <Layers className="w-3 h-3 text-purple-400" />
                    <span>{hack.versionsList?.length || 1} phiên bản sẵn sàng</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Download Action Button */}
              <div className="w-full sm:w-auto flex justify-end">
                <button
                  onClick={() => setSelectedHack(hack)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Download Version Modal */}
      <AnimatePresence>
        {selectedHack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/80 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedHack(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <img
                  src={selectedHack.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                  alt={selectedHack.name}
                  className="w-14 h-14 object-cover rounded-xl border border-cyan-500/30"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedHack.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Chọn phiên bản muốn tải xuống
                  </p>
                </div>
              </div>

              {/* Version List */}
              <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(!selectedHack.versionsList || selectedHack.versionsList.length === 0) ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Chưa có link phiên bản cụ thể. Vui lòng liên hệ Admin.
                  </div>
                ) : (
                  selectedHack.versionsList.map((ver, idx) => (
                    <div
                      key={ver.id || idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-sm font-bold text-white">{ver.versionName}</span>
                      </div>

                      <a
                        href={ver.downloadUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition-all"
                      >
                        Tải Ngay <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedHack(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
