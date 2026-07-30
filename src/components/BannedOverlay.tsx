import React, { useState } from 'react';
import { UserBanRecord } from '../types';
import { submitBanAppealRecord } from '../lib/communityService';
import { ShieldAlert, Send, CheckCircle2, Clock, HelpCircle, Lock } from 'lucide-react';

interface BannedOverlayProps {
  banRecord: UserBanRecord;
  userEmail: string;
  userName: string;
  userUid: string;
}

export const BannedOverlay: React.FC<BannedOverlayProps> = ({
  banRecord,
  userEmail,
  userName,
  userUid
}) => {
  const [appealNote, setAppealNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = Date.now();
  const diffMs = Math.max(0, banRecord.expiresAt - now);
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealNote.trim()) {
      setError('Vui lòng nhập lý do biện minh / kháng cáo!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitBanAppealRecord({
        userEmail: userEmail || banRecord.userEmail,
        userName: userName || banRecord.userName,
        userUid: userUid || banRecord.userUid || '',
        appealNote: appealNote.trim()
      });
      setSubmitted(true);
      setAppealNote('');
    } catch (err: any) {
      setError('Lỗi khi gửi kháng cáo: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/60 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/80 space-y-6 relative overflow-hidden">
        {/* Glowing Red Background Blur */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 text-rose-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30 animate-pulse">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            TÀI KHOẢN ĐÃ BỊ KHÓA (BAN)
          </h1>
          <p className="text-xs text-rose-300 max-w-sm mx-auto">
            Tài khoản của bạn đã vi phạm quy định cộng đồng và bị đình chỉ truy cập.
          </p>
        </div>

        {/* Ban Details Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Tài khoản:</span>
            <span className="font-bold text-white font-mono">{userEmail}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Thời gian bị ban:</span>
            <span className="font-bold text-amber-400 font-mono">{banRecord.banDays} ngày</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Thời gian còn lại:</span>
            <span className="font-bold text-rose-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {daysRemaining} ngày nữa sẽ tự gỡ ban
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Lý do khóa tài khoản:</span>
            <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium">
              {banRecord.reason || 'Vi phạm điều khoản cộng đồng hoặc spam script.'}
            </p>
          </div>
        </div>

        {/* Appeal / Help Section */}
        <div className="pt-2 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>TRỢ GIÚP &amp; BIỆN MINH / KHÁNG CÁO</span>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-300">Đã Gửi Đơn Kháng Cáo Thành Công!</p>
                <p className="text-slate-300 mt-1">
                  Đơn kháng cáo của bạn đã được chuyển tới Ban Quản Trị. Quản trị viên sẽ xem xét và gỡ ban nếu hợp lý.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitAppeal} className="space-y-3">
              <p className="text-[11px] text-slate-400">
                Nếu bạn cho rằng đây là sự nhầm lẫn, hãy nhập nội dung biện minh bên dưới để gửi đơn kháng cáo cho Admin xem xét gỡ ban:
              </p>

              <textarea
                required
                rows={3}
                value={appealNote}
                onChange={(e) => setAppealNote(e.target.value)}
                placeholder="Nhập ghi chú biện minh / kháng cáo của bạn..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />

              {error && (
                <p className="text-xs text-rose-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐƠN KHÁNG CÁO TỚI ADMIN'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
