import React, { useState } from 'react';
import { BookOpen, Video, ExternalLink, Play, Search } from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl?: string;
  externalLink?: string;
}

// Hàm xử lý và chuẩn hóa URL video cho iframe
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

    // 3. Xử lý YouTube (chuẩn hóa watch?v=, short link youtu.be, youtube shorts, embed)
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

    // Mặc định trả về URL gốc nếu không rơi vào các trường hợp trên
    return url;
  } catch (e) {
    return url;
  }
};

export const GuidesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Danh sách hướng dẫn mẫu (Bạn có thể thêm bớt tùy ý)
  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'Hướng Dẫn Dùng Streamable Video',
      description: 'Cách xem video hướng dẫn được lưu trữ trên Streamable.',
      category: 'basic',
      videoUrl: 'https://streamable.com/e/example', // Hỗ trợ cả link thường lẫn link /e/
    },
    {
      id: '2',
      title: 'Hướng Dẫn Sử Dụng Cloud Phone',
      description: 'Cách cài đặt và vận hành Cloud Phone Pro hiệu quả nhất.',
      category: 'basic',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'basic', name: 'Căn bản' },
    { id: 'advanced', name: 'Nâng cao' },
  ];

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Center Hướng Dẫn
          </h2>
          <p className="text-slate-400 mt-1">
            Xem các video hướng dẫn và tài liệu sử dụng hệ thống
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Guides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all flex flex-col"
          >
            {/* Embedded Video/Iframe Container */}
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

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                  {guide.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {guide.description}
                </p>
              </div>

              {guide.externalLink && (
                <a
                  href={guide.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Xem thêm tài liệu chi tiết
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredGuides.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Không tìm thấy bài hướng dẫn nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidesTab;
