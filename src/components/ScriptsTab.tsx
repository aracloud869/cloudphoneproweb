import React, { useState, useEffect } from 'react';
import { ScriptItem, CommunityScript, ScriptComment } from '../types';
import { User } from '../lib/userFirebase';
import { 
  subscribeCommunityScripts, 
  addCommunityScript, 
  toggleLikeCommunityScript, 
  toggleDislikeCommunityScript, 
  addScriptReport,
  subscribeScriptComments,
  addScriptComment,
  toggleLikeComment
} from '../lib/communityService';
import { 
  Search, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  ShieldAlert, 
  X, 
  Upload, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Flag, 
  SortAsc, 
  Users, 
  Send, 
  Sparkles, 
  LogIn, 
  Heart,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';

interface ScriptsTabProps {
  scripts: ScriptItem[];
  currentUser: User | null;
  onNavigateToAccount?: () => void;
}

export const ScriptsTab: React.FC<ScriptsTabProps> = ({ 
  scripts, 
  currentUser,
  onNavigateToAccount 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'official' | 'community'>('community');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAZ, setSortAZ] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Community State
  const [communityScripts, setCommunityScripts] = useState<CommunityScript[]>([]);
  const [titleInput, setTitleInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Auth Prompt Modal
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('');

  // Comment Modal State
  const [selectedScriptForComments, setSelectedScriptForComments] = useState<CommunityScript | null>(null);
  const [commentsList, setCommentsList] = useState<ScriptComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToParentId, setReplyingToParentId] = useState<string | null>(null);
  const [replyingToAuthorName, setReplyingToAuthorName] = useState<string | null>(null);

  // Report Modal State
  const [selectedScriptForReport, setSelectedScriptForReport] = useState<CommunityScript | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Subscribe Community Scripts
  useEffect(() => {
    const unsub = subscribeCommunityScripts((items) => {
      setCommunityScripts(items);
    });
    return () => unsub();
  }, []);

  // Subscribe Comments when comment modal is open
  useEffect(() => {
    if (!selectedScriptForComments) return;
    const unsub = subscribeScriptComments(selectedScriptForComments.id, (comments) => {
      setCommentsList(comments);
    });
    return () => unsub();
  }, [selectedScriptForComments]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const requireAuth = (actionName: string, callback: () => void) => {
    if (!currentUser) {
      setAuthPromptAction(actionName);
      setShowAuthPrompt(true);
      return;
    }
    callback();
  };

  // 1. Upload Community Script
  const handleUploadScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      requireAuth('đăng Script lên cộng đồng', () => {});
      return;
    }

    if (!titleInput.trim() || !codeInput.trim()) {
      setUploadError('Vui lòng điền Tên Script và Mã Script!');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await addCommunityScript({
        title: titleInput.trim(),
        code: codeInput.trim(),
        description: descInput.trim(),
        authorUid: currentUser.uid,
        authorName: currentUser.displayName || 'Thành viên',
        authorAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`
      });

      setTitleInput('');
      setCodeInput('');
      setDescInput('');
      setUploadSuccess('Đăng Script thành công! Mọi người đã có thể xem và sao chép.');
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      setUploadError('Lỗi khi đăng script: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Like & Dislike
  const handleLike = (scriptId: string) => {
    requireAuth('thả tim Script', () => {
      if (currentUser) {
        toggleLikeCommunityScript(scriptId, currentUser.uid);
      }
    });
  };

  const handleDislike = (scriptId: string) => {
    requireAuth('dislike Script', () => {
      if (currentUser) {
        toggleDislikeCommunityScript(scriptId, currentUser.uid);
      }
    });
  };

  // Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScriptForReport || !currentUser) return;
    if (!reportReason.trim()) return;

    try {
      await addScriptReport({
        scriptId: selectedScriptForReport.id,
        scriptTitle: selectedScriptForReport.title,
        reporterUid: currentUser.uid,
        reporterName: currentUser.displayName || 'Thành viên',
        reason: reportReason.trim()
      });
      setReportSuccess(true);
      setTimeout(() => {
        setSelectedScriptForReport(null);
        setReportReason('');
        setReportSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScriptForComments || !currentUser) return;
    if (!commentInput.trim()) return;

    try {
      await addScriptComment({
        scriptId: selectedScriptForComments.id,
        authorUid: currentUser.uid,
        authorName: currentUser.displayName || 'Thành viên',
        authorAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`,
        content: commentInput.trim(),
        parentId: replyingToParentId
      });
      setCommentInput('');
      setReplyingToParentId(null);
      setReplyingToAuthorName(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter & Sort Official Scripts
  const filteredOfficialScripts = scripts
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortAZ ? a.name.localeCompare(b.name) : 0);

  // Filter & Sort Community Scripts (Search title OR author name)
  const filteredCommunityScripts = communityScripts
    .filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortAZ) {
        return a.title.localeCompare(b.title);
      }
      return b.likes - a.likes; // Priority: Most liked
    });

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-purple-500/30 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Code2 className="w-7 h-7 text-purple-400 animate-pulse" />
            ROBLOX SCRIPTS HUB
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kho Scripts Roblox hệ thống &amp; chia sẻ từ cộng đồng game thủ.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* A to Z Sort Toggle Button */}
          <button
            onClick={() => setSortAZ(!sortAZ)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              sortAZ
                ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md shadow-purple-500/20'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <SortAsc className="w-4 h-4" />
            {sortAZ ? 'Đang Sắp Xếp: A - Z' : 'Sắp Xếp: Mặc Định / Hot'}
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên Script hoặc Tên tác giả..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 text-white text-xs border border-slate-700/80 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all placeholder:text-slate-500"
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
      </div>

      {/* Main Sub-Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveSubTab('community')}
          className={`pb-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'community'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          SCRIPTS CỘNG ĐỒNG ({communityScripts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('official')}
          className={`pb-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'official'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          SCRIPTS HỆ THỐNG ({scripts.length})
        </button>
      </div>

      {/* ==================== COMMUNITY SCRIPTS SUB-TAB ==================== */}
      {activeSubTab === 'community' && (
        <div className="space-y-8">
          {/* TOP PANEL: UP SCRIPT CỦA BẠN */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  UP SCRIPT CỦA BẠN LÊN CỘNG ĐỒNG
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-slate-400">
                  Chia sẻ các bản Script chất lượng đến hàng ngàn người dùng khác.
                </p>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-950/50 p-3 rounded-xl border border-rose-500/40">
                {uploadError}
              </p>
            )}

            {uploadSuccess && (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/40">
                {uploadSuccess}
              </p>
            )}

            <form onSubmit={handleUploadScript} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Tên Script</label>
                  <input
                    type="text"
                    required
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Ví dụ: Blox Fruits Auto Farm Script v2..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Mô Tả / Ghi Chú (Không bắt buộc)</label>
                  <input
                    type="text"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Chức năng chính, lưu ý khi dùng..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Mã Script (Code)</label>
                <textarea
                  required
                  rows={3}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="loadstring(game:HttpGet('https://raw.githubusercontent.com/...'))()"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Đang Tải Lên...' : 'ĐĂNG SCRIPT LÊN CỘNG ĐỒNG'}
                </button>
              </div>
            </form>
          </div>

          {/* COMMUNITY SCRIPTS LIST */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-white tracking-wider uppercase flex items-center justify-between">
              <span>DANH SÁCH SCRIPTS CỘNG ĐỒNG ({filteredCommunityScripts.length})</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                Ưu tiên đưa Script nhiều Like nhất lên đầu
              </span>
            </h2>

            {filteredCommunityScripts.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
                <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-xs font-medium">
                  {searchTerm ? 'Không tìm thấy Script hoặc tác giả phù hợp' : 'Chưa có Script cộng đồng nào. Hãy là người đầu tiên đăng!'}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredCommunityScripts.map((item) => {
                  const isLiked = currentUser && Array.isArray(item.likedBy) && item.likedBy.includes(currentUser.uid);
                  const isDisliked = currentUser && Array.isArray(item.dislikedBy) && item.dislikedBy.includes(currentUser.uid);

                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 overflow-hidden shadow-xl"
                    >
                      {/* Author Header Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.authorUid}`}
                            alt={item.authorName}
                            className="w-9 h-9 rounded-xl object-cover bg-slate-900 border border-slate-800"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Đăng bởi: <strong className="text-purple-300 font-mono">{item.authorName}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Copy Script Button */}
                        <button
                          onClick={() => handleCopy(item.code, item.id)}
                          className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

                      {/* Description if present */}
                      {item.description && (
                        <div className="px-5 pt-3 text-xs text-slate-300">
                          {item.description}
                        </div>
                      )}

                      {/* Code Box */}
                      <div className="p-4 bg-slate-950/80 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300/90 leading-relaxed border-t border-b border-slate-900 max-h-40 scrollbar-thin my-2">
                        <pre className="whitespace-pre-wrap break-all">{item.code}</pre>
                      </div>

                      {/* Action Bar: Like / Dislike / Comment / Report */}
                      <div className="flex items-center justify-between px-5 py-3 bg-slate-950/60 text-xs">
                        <div className="flex items-center gap-2">
                          {/* Like Button */}
                          <button
                            onClick={() => handleLike(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                              isLiked
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{item.likes}</span>
                          </button>

                          {/* Dislike Button */}
                          <button
                            onClick={() => handleDislike(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                              isDisliked
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>{item.dislikes}</span>
                          </button>

                          {/* Comment Button */}
                          <button
                            onClick={() => setSelectedScriptForComments(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:bg-purple-500/20 hover:text-purple-300 border border-slate-800 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                            <span>Bình Luận</span>
                          </button>
                        </div>

                        {/* Report Button */}
                        <button
                          onClick={() => {
                            requireAuth('báo cáo Script', () => {
                              setSelectedScriptForReport(item);
                            });
                          }}
                          className="flex items-center gap-1 text-slate-500 hover:text-rose-400 text-[11px] transition-colors cursor-pointer"
                          title="Báo cáo script xấu hoặc vi phạm"
                        >
                          <Flag className="w-3.5 h-3.5" /> Báo cáo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== OFFICIAL SCRIPTS SUB-TAB ==================== */}
      {activeSubTab === 'official' && (
        <div className="space-y-5">
          {filteredOfficialScripts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">
                {searchTerm ? 'Không tìm thấy Script hệ thống nào phù hợp' : 'Chưa có Script hệ thống nào.'}
              </p>
            </div>
          ) : (
            filteredOfficialScripts.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 overflow-hidden shadow-lg"
              >
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.code, item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

                <div className="p-4 bg-slate-950/70 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300/90 leading-relaxed border-t border-slate-900 max-h-48 scrollbar-thin">
                  <pre className="whitespace-pre-wrap break-all">{item.code}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ==================== AUTH REQUIRED PROMPT MODAL ==================== */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/40 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/40">
              <LogIn className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-white uppercase">
              YÊU CẦU ĐĂNG NHẬP
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn cần đăng nhập tài khoản để thực hiện <strong className="text-purple-300">{authPromptAction}</strong>!
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                ĐỂ SAU
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  if (onNavigateToAccount) onNavigateToAccount();
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs shadow-lg shadow-purple-500/30 cursor-pointer"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== COMMENT MODAL ==================== */}
      {selectedScriptForComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  Bình Luận: {selectedScriptForComments.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScriptForComments(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {commentsList.length === 0 ? (
                <p className="text-center text-xs text-slate-500 italic py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              ) : (
                commentsList.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.authorUid}`}
                          alt={c.authorName}
                          className="w-6 h-6 rounded-lg object-cover bg-slate-900"
                        />
                        <span className="text-xs font-bold text-purple-300">{c.authorName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 pl-8 leading-relaxed">{c.content}</p>

                    <div className="pl-8 pt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <button
                        onClick={() => {
                          requireAuth('thích bình luận', () => {
                            if (currentUser) toggleLikeComment(c.id, currentUser.uid);
                          });
                        }}
                        className="hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Heart className={`w-3 h-3 ${currentUser && c.likedBy?.includes(currentUser.uid) ? 'text-rose-500 fill-rose-500' : ''}`} />
                        <span>{c.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => {
                          setReplyingToParentId(c.id);
                          setReplyingToAuthorName(c.authorName);
                        }}
                        className="hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight className="w-3 h-3" /> Trả lời
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input Form */}
            {currentUser ? (
              <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800 space-y-2">
                {replyingToAuthorName && (
                  <div className="flex items-center justify-between text-[11px] text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg">
                    <span>Đang trả lời <strong>@{replyingToAuthorName}</strong></span>
                    <button
                      type="button"
                      onClick={() => { setReplyingToParentId(null); setReplyingToAuthorName(null); }}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setSelectedScriptForComments(null);
                    if (onNavigateToAccount) onNavigateToAccount();
                  }}
                  className="text-xs text-purple-400 hover:underline font-bold cursor-pointer"
                >
                  Đăng nhập để tham gia bình luận
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== REPORT MODAL ==================== */}
      {selectedScriptForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Flag className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase">BÁO CÁO SCRIPT CỘNG ĐỒNG</h3>
              </div>
              <button
                onClick={() => setSelectedScriptForReport(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 text-emerald-300 text-xs font-bold text-center">
                Cảm ơn bạn! Đơn báo cáo đã được gửi tới Admin xử lý.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Script: <strong className="text-white">{selectedScriptForReport.title}</strong>
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Lý Do Báo Cáo</label>
                  <textarea
                    required
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Script không hoạt động, vi phạm, lừa đảo hoặc chứa mã độc..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedScriptForReport(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-500/30 cursor-pointer"
                  >
                    GỬI BÁO CÁO
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
