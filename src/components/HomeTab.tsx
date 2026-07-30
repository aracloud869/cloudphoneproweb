import React from 'react';
import { TabType } from '../types';
import { 
  Gamepad2, 
  Code2, 
  Wrench, 
  Server, 
  KeyRound, 
  Smartphone, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Flame,
  Cpu,
  Globe2,
  Terminal
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeTabProps {
  setActiveTab: (tab: TabType) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
  const categories: {
    id: TabType;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
    buttonText: string;
  }[] = [
    {
      id: 'hack_roblox',
      title: 'Hack Roblox',
      desc: 'Kho tải client hack Roblox hàng đầu. Đầy đủ các phiên bản mới nhất, cập nhật liên tục và mượt mà.',
      icon: <Gamepad2 className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/40',
      badge: 'HOT CLIENTS',
      buttonText: 'Tải Hack Ngay'
    },
    {
      id: 'scripts',
      title: 'Scripts Roblox',
      desc: 'Tổng hợp Scripts Blox Fruits, King Legacy, Pet Simulator xịn nhất. Sao chép 1 click nhanh chóng.',
      icon: <Code2 className="w-8 h-8 text-purple-400" />,
      color: 'from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/40',
      badge: 'AUTO FARM',
      buttonText: 'Lấy Scripts'
    },
    {
      id: 'setup_cloud',
      title: 'Setup Cloud',
      desc: 'Tải các ứng dụng tiện ích hỗ trợ tối ưu Cloud Phone, tối ưu hóa băng thông & tự động hóa.',
      icon: <Wrench className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40',
      badge: 'UTILITIES',
      buttonText: 'Khám Phá Tiện Ích'
    },
    {
      id: 'server_cloud_pro',
      title: 'Server Cloud Pro',
      desc: 'Hệ thống Server Cloud tốc độ cao, truy cập mượt mà chỉ với 1 cú click chuyển tiếp.',
      icon: <Server className="w-8 h-8 text-amber-400" />,
      color: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40',
      badge: 'ULTRA HIGH SPEED',
      buttonText: 'Đến Server'
    },
    {
      id: 'get_key',
      title: 'Get Key Xịn',
      desc: 'Cổng lấy Key kích hoạt dịch vụ tự động, nhanh chóng và bảo mật cao thông qua token link.',
      icon: <KeyRound className="w-8 h-8 text-pink-400" />,
      color: 'from-pink-500/20 via-red-500/10 to-transparent border-pink-500/40',
      badge: 'AUTO KEY',
      buttonText: 'Lấy Key Ngay'
    },
    {
      id: 'cloud_phone_pro',
      title: 'Cloud Phone Pro',
      desc: 'Tải ứng dụng Cloud Phone Pro chuẩn Gaming. Cấu hình khủng, cắm treo game 24/7 không lag.',
      icon: <Smartphone className="w-8 h-8 text-indigo-400" />,
      color: 'from-indigo-500/20 via-violet-500/10 to-transparent border-indigo-500/40',
      badge: 'GAMING APP',
      buttonText: 'Tải App Cloud'
    },
    {
      id: 'guides',
      title: 'Hướng Dẫn Sử Dụng',
      desc: 'Video hướng dẫn chi tiết từ A-Z giúp bạn làm quen và khai thác tối đa sức mạnh Cloud Phone Pro.',
      icon: <HelpCircle className="w-8 h-8 text-sky-400" />,
      color: 'from-sky-500/20 via-blue-500/10 to-transparent border-sky-500/40',
      badge: 'TUTORIALS',
      buttonText: 'Xem Hướng Dẫn'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-8 sm:p-12 shadow-2xl shadow-cyan-950/60">
        {/* Gaming Background Glowing Effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>CLOUD PHONE PRO GAMING HUB v3.5</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
            HỆ THỐNG <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">CLOUD PHONE GAMING</span> ĐỈNH CAO
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Chào mừng bạn đến với <strong className="text-cyan-400">Cloud Phone Pro</strong>. Nơi cung cấp giải pháp Cloud Phone treo game 24/7, tải các bản Hack Roblox, Scripts tự động farm, ứng dụng tiện ích và Server tốc độ cao với giao diện gaming mượt mà nhất.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('cloud_phone_pro')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-200"
            >
              <Smartphone className="w-5 h-5" />
              Tải Cloud Phone Pro
            </button>
            <button
              onClick={() => setActiveTab('hack_roblox')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/90 text-cyan-300 font-bold text-sm border border-cyan-500/40 hover:bg-slate-700/80 transition-all duration-200"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              Tải Hack Roblox
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">TỐC ĐỘ</p>
              <p className="text-sm font-bold text-white">Siêu Mượt 120 FPS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">TREO GAME</p>
              <p className="text-sm font-bold text-white">Online 24/7 Không Lag</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">BẢO MẬT</p>
              <p className="text-sm font-bold text-white">Token Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono">CLOUD</p>
              <p className="text-sm font-bold text-white">Server Tốc Độ Cao</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Exploration Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-cyan-400" />
              DANH MỤC TÍNH NĂNG
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Chọn các khu vực bên dưới để truy cập tài nguyên & công cụ gaming
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setActiveTab(cat.id)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-900/80 border p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg bg-gradient-to-br ${cat.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                  {cat.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-200">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {cat.desc}
              </p>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                  {cat.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
