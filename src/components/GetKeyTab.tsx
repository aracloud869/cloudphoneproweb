import React, { useState, useEffect } from 'react';
import { GetKeySettings } from '../types';
import { KeyRound, ExternalLink, Copy, Check, ShieldCheck, Lock, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface GetKeyTabProps {
  settings: GetKeySettings;
  isKeyVerified: boolean;
  userKey: string | null;
  resetUserKey: () => void;
}

export const GetKeyTab: React.FC<GetKeyTabProps> = ({
  settings,
  isKeyVerified,
  userKey,
  resetUserKey
}) => {
  const [copied, setCopied] = useState(false);

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
          Nhấn nút <strong className="text-amber-400">Get Key</strong> để vượt link và mở khóa Key dùng ứng dụng Cloud Phone Pro tự động.
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
              TRẠNG THÁI: CHƯA CÓ KEY (CẦN VƯỢT LINK)
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
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-red-400 transition-colors"
              title="Reset Key trên thiết bị này"
            >
              <RefreshCw className="w-3 h-3" /> Reset Key
            </button>
          )}
        </div>

        {/* Display Area */}
        <div className="relative p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-base sm:text-lg font-bold tracking-wider break-all text-center sm:text-left w-full sm:w-auto">
            {isKeyVerified ? (
              <span className="text-emerald-400">{userKey}</span>
            ) : (
              <span className="text-slate-500 italic flex items-center justify-center sm:justify-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500/80" />
                Chưa có key (Hãy bấm Get Key bên dưới)
              </span>
            )}
          </div>

          <button
            disabled={!isKeyVerified}
            onClick={handleCopyKey}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              !isKeyVerified
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
                : copied
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Đã Sao Chép Key
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Sao Chép Key
              </>
            )}
          </button>
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
            Hướng Dẫn Lấy Key:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-sans">
            <li>Bấm vào nút <strong className="text-amber-400">NHẤN VÀO ĐÂY ĐỂ GET KEY</strong> ở trên.</li>
            <li>Hoàn thành các bước vượt link rút gọn trên trang web đích.</li>
            <li>Khi vượt link thành công, hệ thống sẽ tự động chuyển hướng về Token Verification Link và tự động kích hoạt Key cho bạn tại đây!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
