import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ExternalLink, Play, FileText, Globe } from 'lucide-react';
import { subscribeGuides, Guide } from '../lib/communityService';

// Hàm chuyển đổi URL đa dạng nền tảng sang dạng nhúng (Embed) chuẩn
const getEmbedUrl = (url?: string): string => {
  if (!url) return '';

  try {
    // 1. Nếu dán nguyên đoạn mã <iframe src="..."></iframe>
    if (url.includes('<iframe')) {
      const match = url.match(/src=["']([^"']+)["']/);
      if (match && match[1]) return match[1];
    }

    const parsedUrl = new URL(url);

    // 2. Xử lý Streamable (VD: https://streamable.com/XXXXX -> https://streamable.com/e/XXXXX)
    if (parsedUrl.hostname.includes('streamable.com')) {
      const pathname = parsedUrl.pathname;
      if (pathname.startsWith('/e/')) {
        return url;
      }
      return `https://streamable.com/e${pathname}`;
    }

    // 3. Xử lý YouTube (watch?v=, short link youtu.be, shorts, embed)
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      let videoId = '';
      if (parsedUrl.hostname.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      } else if (parsedUrl.pathname.includes('/embed/')) {
        return url;
      } else if (parsedUrl.pathname.includes('/shorts/')) {
        videoId = parsedUrl.pathname.split('/shorts/')[1];
      } else {
        videoId = parsedUrl.searchParams.get('v') || '';
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    // 4. Xử lý Vimeo (VD: https://vimeo.com/12345678)
    if (parsedUrl.hostname.includes('vimeo.com')) {
      const videoId = parsedUrl.pathname.split('/')[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    return url;
  } catch (e) {
    return url;
  }
};

export const GuidesTab: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeGuides((updatedGuides) => {
      setGuides(updatedGuides);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guide.note && guide.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Center Hướng Dẫn
          </h2>
          <p className="text-slate-400 mt-1">
            Tổng hợp các bài hướng dẫn chi tiết và video minh họa
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm bài hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-12 text-center text-slate-400">
          Chưa có bài hướng dẫn nào được thêm.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id}
              className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all flex flex-col"
            >
              {/* Embed Video iframe (Streamable / Youtube / Vimeo / Custom) */}
              {guide.videoUrl && (
                <div className="relative w-full pt-[56.25%] bg-slate-950">
                  <iframe
                    src={getEmbedUrl(guide.videoUrl)}
                    title={guide.title}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                    {guide.title}
                  </h3>

                  {guide.note && (
                    <div className="flex items-start gap-2 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="whitespace-pre-wrap">{guide.note}</p>
                    </div>
                  )}
                </div>

                {guide.embedUrl && (
                  <a
                    href={guide.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors pt-2 border-t border-slate-700/30"
                  >
                    <Globe className="w-4 h-4" />
                    Mở liên kết đính kèm
                    <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuidesTab;
