import React, { useState } from 'react';
import { SetupCloudApp } from '../types';
import { Search, Download, Wrench, ExternalLink, ShieldAlert, X } from 'lucide-react';

interface SetupCloudTabProps {
  apps: SetupCloudApp[];
}

export const SetupCloudTab: React.FC<SetupCloudTabProps> = ({ apps }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/30 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="w-7 h-7 text-emerald-400 animate-pulse" />
            SETUP CLOUD UTILITIES
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bộ công cụ và ứng dụng tiện ích giúp tối ưu trải nghiệm Cloud Phone Pro.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm ứng dụng tiện ích..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 text-white text-sm border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-500"
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

      {/* Apps List - Horizontal Panels stacked Vertically */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">
              {searchTerm ? 'Không tìm thấy tiện ích nào phù hợp' : 'Chưa có tiện ích nào. Vui lòng thêm từ trang Admin.'}
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="group relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-200 shadow-md"
            >
              {/* Left Side: Icon & Name */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-14 h-14 rounded-xl bg-slate-950 p-1 border border-emerald-500/30 flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={app.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                    alt={app.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {app.name}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    Ứng Dụng Tiện Ích Cloud
                  </span>
                </div>
              </div>

              {/* Right Side: Download Action Button */}
              <div className="w-full sm:w-auto flex justify-end">
                <a
                  href={app.downloadUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Tiện Ích</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
