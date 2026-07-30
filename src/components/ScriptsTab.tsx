import React, { useState } from 'react';
import { ScriptItem } from '../types';
import { Search, Code2, Copy, Check, Terminal, ShieldAlert, X } from 'lucide-react';

interface ScriptsTabProps {
  scripts: ScriptItem[];
}

export const ScriptsTab: React.FC<ScriptsTabProps> = ({ scripts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredScripts = scripts.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-purple-500/30 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Code2 className="w-7 h-7 text-purple-400 animate-pulse" />
            ROBLOX SCRIPTS HUB
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kho Scripts Roblox cập nhật liên tục. Sao chép 1-click và dán trực tiếp vào Client Hack.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm Scripts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 text-white text-sm border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all placeholder:text-slate-500"
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

      {/* Scripts List - Stacked Vertically */}
      <div className="space-y-5">
        {filteredScripts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">
              {searchTerm ? 'Không tìm thấy Script nào phù hợp' : 'Chưa có Script nào. Vui lòng thêm từ trang Admin.'}
            </p>
          </div>
        ) : (
          filteredScripts.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 overflow-hidden shadow-lg"
            >
              {/* Header Bar of Fixed Frame */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>

                <button
                  onClick={() => handleCopy(item.code, item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copiedId === item.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white border border-purple-500/30'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Đã Sao Chép!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Sao Chép Script
                    </>
                  )}
                </button>
              </div>

              {/* Fixed Horizontal Code Box */}
              <div className="p-4 bg-slate-950/70 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300/90 leading-relaxed border-t border-slate-900 max-h-48 scrollbar-thin">
                <pre className="whitespace-pre-wrap break-all">{item.code}</pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
