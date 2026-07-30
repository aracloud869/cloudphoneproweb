import React, { useState } from 'react';
import { GetKeySettings } from '../types';
import { 
  KeyRound, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  X,
  Key,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GetKeyTabProps {
  settings: GetKeySettings;
  isKeyVerified: boolean;
  userKey: string | null;
  resetUserKey: () => void;
  onVerifyToken?: (token: string) => boolean;
}

export const GetKeyTab: React.FC<GetKeyTabProps> = ({
  settings,
  isKeyVerified,
  userKey,
  resetUserKey,
  onVerifyToken
}) => {
  const [copied, setCopied] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleCopyKey = () => {
    if (userKey) {
      navigator.clipboard.writeText(userKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetKeyDown = () => {
    if (settings.getKeyUrl) {
      window.open(settings.getKeyUrl, '_blank');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);

    const cleanToken = inputToken.trim();
    if (!cleanToken) {
      setTokenError('Vui lòng nhập Token xác minh!');
      return;
    }

    if (onVerifyToken) {
      const isValid = onVerifyToken(cleanToken);
      if (isValid) {
        setShowTokenModal(false);
        setInputToken('');
        setIsUnlocking(true);
        setTimeout(() => {
          setIsUnlocking(false);
        }, 1800);
      } else {
        setTokenError('Mã Token xác minh không hợp lệ hoặc đã hết hạn! Vui lòng kiểm tra lại.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-8 text-center shadow-2xl shadow-amber-950/40">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/40 text-amber-400 mb-4 shadow-lg shadow-amber-500/20">
          <KeyRound className="w-8 h-8 animate-bounce" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          CỔNG TẠO & XÁC MINH KEY HỆ THỐNG
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
          Nhấn nút <strong className="text-amber-400">Get Key</strong> để vượt link lấy Token xác minh và nhập mở khóa Key dùng Cloud Phone Pro.
        </p>

        {/* Verification Status Pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold border shadow-inner">
          {isKeyVerified ? (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border-emerald-500/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ĐÃ XÁC MINH VƯỢT LINK - KEY ĐÃ KÍCH HOẠT
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border-amber-500/30 px-3 py-1 rounded-full">
              <Lock className="w-4 h-4 text-amber-400" />
              TRẠNG THÁI: KHÓA BẰNG XÍCH (CẦN NHẬP TOKEN)
            </span>
          )}
        </div>
      </div>

      {/* Key Display Card Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">KEY CỦA BẠN</h2>
          </div>

          {isKeyVerified && (
            <button
              onClick={resetUserKey}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Reset Key trên thiết bị này"
            >
              <RefreshCw className="w-3 h-3" /> Reset Key
            </button>
          )}
        </div>

        {/* DISPLAY AREA WITH METALLIC CHAINS & LOCK OVERLAY */}
        <div className="relative p-6 rounded-2xl bg-slate-950 border border-amber-500/30 min-h-[140px] flex items-center justify-center overflow-hidden shadow-2xl">
          
          {/* 1. CHAINS OVERLAY (Shown when NOT verified or during shattering animation) */}
          {(!isKeyVerified || isUnlocking) && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={
                  isUnlocking
                    ? { opacity: 0, scale: 1.15, filter: 'blur(8px)' }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none z-20 flex items-center justify-between p-1 overflow-hidden"
              >
                {/* Top Metallic Chain Links Row */}
                <motion.div 
                  animate={isUnlocking ? { y: -80, opacity: 0, rotate: -15 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute top-1 left-2 right-2 flex justify-between items-center opacity-90 z-20"
                >
                  {[...Array(14)].map((_, i) => (
                    <div key={`top_${i}`} className="w-6 h-3 border-2 border-amber-500 bg-slate-900 rounded-full shadow-lg shadow-amber-500/40 transform -rotate-12 flex items-center justify-center">
                      <div className="w-3 h-1 bg-amber-400 rounded-full" />
                    </div>
                  ))}
                </motion.div>

                {/* Bottom Metallic Chain Links Row */}
                <motion.div 
                  animate={isUnlocking ? { y: 80, opacity: 0, rotate: 15 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute bottom-1 left-2 right-2 flex justify-between items-center opacity-90 z-20"
                >
                  {[...Array(14)].map((_, i) => (
                    <div key={`bot_${i}`} className="w-6 h-3 border-2 border-amber-500 bg-slate-900 rounded-full shadow-lg shadow-amber-500/40 transform rotate-12 flex items-center justify-center">
                      <div className="w-3 h-1 bg-amber-400 rounded-full" />
                    </div>
                  ))}
                </motion.div>

                {/* Left Chain Column */}
                <motion.div 
                  animate={isUnlocking ? { x: -80, opacity: 0, rotate: -45 } : { x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute top-4 bottom-4 left-1 flex flex-col justify-between items-center opacity-90 z-20"
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={`left_${i}`} className="w-3 h-6 border-2 border-amber-500 bg-slate-900 rounded-full shadow-lg shadow-amber-500/40 transform rotate-45 flex items-center justify-center">
                      <div className="w-1 h-3 bg-amber-400 rounded-full" />
                    </div>
                  ))}
                </motion.div>

                {/* Right Chain Column */}
                <motion.div 
                  animate={isUnlocking ? { x: 80, opacity: 0, rotate: 45 } : { x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute top-4 bottom-4 right-1 flex flex-col justify-between items-center opacity-90 z-20"
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={`right_${i}`} className="w-3 h-6 border-2 border-amber-500 bg-slate-900 rounded-full shadow-lg shadow-amber-500/40 transform -rotate-45 flex items-center justify-center">
                      <div className="w-1 h-3 bg-amber-400 rounded-full" />
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* 2. CENTER LOCK BUTTON & OVERLAY (When locked) */}
          {!isKeyVerified && !isUnlocking && (
            <div className="relative z-30 flex flex-col items-center justify-center text-center p-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTokenModal(true)}
                className="group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-500/70 text-amber-300 shadow-2xl shadow-amber-500/40 cursor-pointer backdrop-blur-xl hover:border-amber-400 hover:text-white transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left space-y-0.5">
                  <p className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-400 group-hover:text-amber-300">
                    BẤM VÀO ĐÂY ĐỂ NHẬP TOKEN XÁC MINH
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Nhập đúng token để mở khóa xích và nhận Key
                  </p>
                </div>
              </motion.button>
            </div>
          )}

          {/* 3. UNLOCKING ANIMATION GLOW */}
          {isUnlocking && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 1 }}
              className="relative z-30 flex flex-col items-center justify-center space-y-2 py-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/50 animate-bounce">
                <Unlock className="w-8 h-8" />
              </div>
              <p className="font-mono text-sm font-black text-emerald-400 animate-pulse">
                ĐANG MỞ KHÓA XÍCH...
              </p>
            </motion.div>
          )}

          {/* 4. UNLOCKED KEY DISPLAY AREA */}
          {isKeyVerified && !isUnlocking && (
            <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> KEY ĐÃ MỞ KHÓA HOÀN TOÀN:
                </p>
                <p className="font-mono text-base sm:text-xl font-black text-emerald-300 tracking-wider break-all">
                  {userKey}
                </p>
              </div>

              <button
                onClick={handleCopyKey}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> Đã Sao Chép Key
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Sao Chép Key
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGetKeyDown}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
          >
            <KeyRound className="w-6 h-6" />
            <span>NHẤN VÀO ĐÂY ĐỂ GET KEY</span>
            <ExternalLink className="w-5 h-5 opacity-80" />
          </button>
        </div>

        {/* Steps Guide */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
          <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px] font-mono">
            Hướng Dẫn Lấy Key &amp; Mở Khóa:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans">
            <li>Bấm vào nút <strong className="text-amber-400">NHẤN VÀO ĐÂY ĐỂ GET KEY</strong> ở trên.</li>
            <li>Hoàn thành các bước vượt link rút gọn để nhận chuỗi <strong className="text-amber-400">Token xác minh</strong>.</li>
            <li>Quay lại ứng dụng, bấm vào <strong className="text-amber-400">Ổ Khóa</strong> ở giữa khung Key của bạn và nhập Token xác minh để mở xích kích hoạt Key!</li>
          </ol>
        </div>
      </div>

      {/* TOKEN VERIFICATION INPUT MODAL */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-amber-950/60 space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-black text-white uppercase tracking-wide">
                    NHẬP TOKEN XÁC MINH VƯỢT LINK
                  </h2>
                </div>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nhập chuỗi <strong className="text-amber-300 font-mono">Token xác minh</strong> mà bạn lấy được sau khi hoàn thành vượt link rút gọn:
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-300 font-mono tracking-wider uppercase">
                    TOKEN XÁC MINH
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="Dán token xác minh tại đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                {tokenError && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{tokenError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    HỦY
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" /> MỞ KHÓA KEY
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

