import React, { useState } from 'react';
import { GuideItem } from '../types';
import { HelpCircle, Copy, Check, Video, FileText, ExternalLink, ShieldAlert, X, Search } from 'lucide-react';

interface GuidesTabProps {
  guides: GuideItem[];
}

export const GuidesTab: React.FC<GuidesTabProps> = ({ guides }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = guides.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert youtube watch URL or short URL to embed format if applicable
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-sky-500/30 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-sky-400 animate-pulse" />
            HƯỚNG DẪN SỬ DỤNG
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp video và tài liệu hướng dẫn chi tiết từ Admin giúp bạn làm chủ Cloud Phone Pro.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm bài hướng dẫn..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 text-white text-sm border border-slate-700/80 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-slate-500"
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

      {/* Guides List */}
      <div className="space-y-6">
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">
              {searchTerm ? 'Không tìm thấy video hướng dẫn nào' : 'Chưa có hướng dẫn nào. Vui lòng thêm từ trang Admin.'}
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const embedUrl = getEmbedUrl(guide.videoUrl);
            const isYoutube = embedUrl.includes('youtube.com/embed');

            return (
              <div
                key={guide.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-all overflow-hidden shadow-xl p-6 space-y-4"
              >
                {/* Title */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex-shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{guide.title}</h2>
                    <p className="text-xs font-mono text-sky-400/80 mt-0.5">Video Hướng Dẫn Chi Tiết</p>
                  </div>
                </div>

                {/* Video Frame */}
                {guide.videoUrl && (
                  <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner">
                    {isYoutube ? (
                      <iframe
                        src={embedUrl}
                        title={guide.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={guide.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}

                {/* Inner URL Box & Copy Button */}
                {guide.innerUrl && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                    <span className="truncate w-full sm:w-auto flex-1 text-slate-400">
                      URL Liên Quan: <strong className="text-sky-300">{guide.innerUrl}</strong>
                    </span>

                    <button
                      onClick={() => handleCopyUrl(guide.innerUrl, guide.id)}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all w-full sm:w-auto ${
                        copiedId === guide.id
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 border border-sky-500/40'
                      }`}
                    >
                      {copiedId === guide.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Đã Sao Chép!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Sao Chép URL
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Notes Section */}
                {guide.notes && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sky-300 font-mono">Ghi Chú: </span>
                      <span>{guide.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
