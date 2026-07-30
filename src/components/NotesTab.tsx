import React, { useState, useEffect } from 'react';
import { NoteItem, NoteAttachment } from '../types';
import { saveSharedNote, fetchSharedNoteByTitle } from '../lib/firebase';
import { 
  FileText, 
  Plus, 
  Download, 
  Share2, 
  Trash2, 
  Copy, 
  Check, 
  Paperclip, 
  Search, 
  Sparkles, 
  AlertCircle, 
  FileUp, 
  ExternalLink,
  BookOpen,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'cloud_phone_local_notes';

export const NotesTab: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse local notes:', e);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string } | null>(null);

  // Create Note Form State
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Import Note Form State
  const [importTitleInput, setImportTitleInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Toast Banner State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [copiedTitleId, setCopiedTitleId] = useState<string | null>(null);

  // Save notes to localStorage whenever notes array changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn('LocalStorage save notes failed:', e);
    }
  }, [notes]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSizeBytes) {
        setFileError('Dung lượng tệp đính kèm vượt quá giới hạn 5MB! Vui lòng chọn tệp nhỏ hơn.');
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  // Create Note Handler
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !contentInput.trim()) {
      showToast('Vui lòng điền đầy đủ Tên ghi chú và Nội dung!', 'error');
      return;
    }

    setIsSubmitting(true);
    setFileError(null);

    try {
      let attachment: NoteAttachment | null = null;

      if (selectedFile) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedFile);
        });

        attachment = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          dataUrl
        };
      }

      const newNote: NoteItem = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: titleInput.trim(),
        content: contentInput.trim(),
        attachment,
        createdAt: Date.now()
      };

      // 1. Save to Cloud Firestore for cross-user title lookup
      await saveSharedNote(newNote);

      // 2. Save to user's Local Notes
      setNotes((prev) => [newNote, ...prev.filter((n) => n.title.toLowerCase() !== newNote.title.toLowerCase())]);

      // Reset Form & Close
      setTitleInput('');
      setContentInput('');
      setSelectedFile(null);
      setShowCreateModal(false);

      showToast(`Đã tạo ghi chú "${newNote.title}" thành công! Bạn có thể gửi tên ghi chú này cho bạn bè.`);
    } catch (err) {
      console.error('Error creating note:', err);
      showToast('Lỗi khi lưu ghi chú. Vui lòng thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import Note Handler (by Title)
  const handleImportNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryTitle = importTitleInput.trim();
    if (!queryTitle) {
      setImportError('Vui lòng nhập tên ghi chú cần tìm!');
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      // 1. Search in existing local notes first
      const existingLocal = notes.find((n) => n.title.toLowerCase() === queryTitle.toLowerCase());
      if (existingLocal) {
        showToast(`Ghi chú "${existingLocal.title}" đã có sẵn trong danh sách của bạn!`);
        setShowImportModal(false);
        setImportTitleInput('');
        setIsImporting(false);
        return;
      }

      // 2. Search on Cloud Firestore
      const sharedNote = await fetchSharedNoteByTitle(queryTitle);

      if (sharedNote) {
        setNotes((prev) => [sharedNote, ...prev]);
        setShowImportModal(false);
        setImportTitleInput('');
        showToast(`Tải thành công ghi chú "${sharedNote.title}" từ đám mây!`);
      } else {
        setImportError(`Không tìm thấy ghi chú nào với tên "${queryTitle}". Hãy kiểm tra xem người tạo đã nhập chính xác tên ghi chú chưa!`);
      }
    } catch (err) {
      console.error('Error importing note:', err);
      setImportError('Có lỗi xảy ra khi tìm kiếm ghi chú trên hệ thống.');
    } finally {
      setIsImporting(false);
    }
  };

  // Copy Note Content
  const copyContent = (note: NoteItem) => {
    navigator.clipboard.writeText(note.content);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Copy Note Title (for sharing with friends)
  const copyTitle = (note: NoteItem) => {
    navigator.clipboard.writeText(note.title);
    setCopiedTitleId(note.id);
    showToast(`Đã sao chép tên ghi chú "${note.title}". Gửi tên này cho bạn bè để họ bấm "Nhập Ghi Chú"!`);
    setTimeout(() => setCopiedTitleId(null), 2000);
  };

  // Delete Note from local list
  const promptDeleteNote = (id: string, title: string) => {
    setNoteToDelete({ id, title });
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      showToast(`Đã xóa ghi chú "${noteToDelete.title}".`);
      setNoteToDelete(null);
    }
  };

  // Helper format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border flex items-center gap-3 font-semibold text-sm ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 backdrop-blur-md shadow-emerald-500/20'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/50 backdrop-blur-md shadow-rose-500/20'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-spin" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <div className="flex-1">{toastMessage.text}</div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 relative overflow-hidden shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-wider uppercase">
            <BookOpen className="w-4 h-4" /> TRUNG TÂM GHI CHÚ & CHIA SẺ VƯỢT LINK
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-cyan-400" /> QUẢN LÝ & CHIA SẺ GHI CHÚ
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Tạo ghi chú cá nhân kèm tệp đính kèm (&lt; 5MB) hoặc <span className="text-cyan-300 font-bold">nhập tên ghi chú</span> từ bạn bè để tải ghi chú chia sẻ trực tiếp về ứng dụng của bạn.
          </p>

          {/* Main Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" /> TẠO GHI CHÚ MỚI
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-extrabold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FileUp className="w-5 h-5 text-cyan-400" /> NHẬP GHI CHÚ ( BẰNG TÊN )
            </button>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3 text-xs text-cyan-300">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Cách chia sẻ ghi chú cho người khác:</p>
          <p className="text-slate-400">
            1. Bạn bấm <span className="text-cyan-300 font-bold">"Tạo Ghi Chú Mới"</span> và đặt một Tên ghi chú dễ nhớ (Ví dụ: <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-400 font-mono">ScriptPro2026</code>).<br />
            2. Bạn gửi tên ghi chú đó cho bạn bè.<br />
            3. Bạn bè chỉ cần bấm <span className="text-cyan-300 font-bold">"Nhập Ghi Chú"</span> và gõ tên <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-400 font-mono">ScriptPro2026</code> là hệ thống tự động tải ghi chú &amp; tệp đính kèm về ngay lập tức!
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên ghi chú hoặc Nội dung..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono font-semibold whitespace-nowrap">
          Đang hiển thị: <span className="text-cyan-400">{filteredNotes.length}</span> ghi chú
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Chưa có ghi chú nào phù hợp</p>
          <p className="text-slate-500 text-xs">Hãy bấm "Tạo Ghi Chú Mới" hoặc "Nhập Ghi Chú" để bắt đầu lưu trữ thông tin!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Note Title Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-cyan-300 font-mono tracking-wide break-all">
                        {note.title}
                      </h3>
                      {note.authorName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                          {note.authorName}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {new Date(note.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyTitle(note)}
                      title="Sao chép Tên ghi chú để chia sẻ"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 transition-colors"
                    >
                      {copiedTitleId === note.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => promptDeleteNote(note.id, note.title)}
                      title="Xóa ghi chú này khỏi danh sách cá nhân"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note Content */}
                <div className="relative bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                  <p className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed break-words max-h-48 overflow-y-auto">
                    {note.content}
                  </p>

                  <button
                    onClick={() => copyContent(note)}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1"
                  >
                    {copiedNoteId === note.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-cyan-400" /> Sao chép
                      </>
                    )}
                  </button>
                </div>

                {/* Attachment Section if present */}
                {note.attachment && (
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Paperclip className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {note.attachment.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {formatFileSize(note.attachment.size)}
                        </p>
                      </div>
                    </div>

                    <a
                      href={note.attachment.dataUrl}
                      download={note.attachment.name}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-bold font-mono flex items-center gap-1 flex-shrink-0 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Tải về
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom Quick Share Action Footer */}
              <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-slate-500">Tên ghi chú: <code className="text-cyan-400">{note.title}</code></span>
                <button
                  onClick={() => copyTitle(note)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Share2 className="w-3 h-3" /> Gửi tên cho bạn bè
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl shadow-cyan-950/60 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-400" /> TẠO GHI CHÚ MỚI
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4">
                {/* Note Title Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 font-mono">
                    TÊN GHI CHÚ <span className="text-rose-500">*</span> (Dùng để người khác tìm kiếm &amp; chia sẻ)
                  </label>
                  <input
                    type="text"
                    required
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Ví dụ: ScriptBlox2026, PassCloudVIP, GhiChuTreoGame..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-500">
                    Đặt tên độc đáo, dễ nhớ để bạn bè chỉ cần gõ tên này là tải được ghi chú!
                  </p>
                </div>

                {/* Note Content Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 font-mono">
                    NỘI DUNG GHI CHÚ <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Nhập nội dung ghi chú, script, hướng dẫn hoặc mã kích hoạt tại đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                  />
                </div>

                {/* File Attachment Input (< 5MB) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                    <span>TỆP ĐÍNH KÈM (TÙY CHỌN)</span>
                    <span className="text-[10px] text-cyan-400 font-bold">Giới hạn &lt; 5MB</span>
                  </label>

                  <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 flex items-center gap-3">
                    <Paperclip className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer w-full"
                    />
                  </div>

                  {selectedFile && (
                    <p className="text-xs text-emerald-400 font-mono font-semibold pt-1">
                      ✓ Đã chọn: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}

                  {fileError && (
                    <p className="text-xs text-rose-400 font-mono font-semibold pt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    HỦY
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" /> ĐANG LƯU...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[3]" /> THÊM GHI CHÚ
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMPORT NOTE MODAL */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-cyan-950/60 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-cyan-400" /> NHẬP GHI CHÚ CHIA SẺ
                </h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleImportNote} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nhập chính xác <span className="text-cyan-300 font-bold">Tên ghi chú</span> mà bạn bè hoặc ai đó đã tạo để tải ghi chú kèm tệp về thiết bị của bạn:
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 font-mono">
                    TÊN GHI CHÚ CẦN NHẬP
                  </label>
                  <input
                    type="text"
                    required
                    value={importTitleInput}
                    onChange={(e) => setImportTitleInput(e.target.value)}
                    placeholder="Nhập tên ghi chú (VD: ScriptPro2026)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                {importError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{importError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    HỦY
                  </button>

                  <button
                    type="submit"
                    disabled={isImporting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" /> ĐANG TÌM KIẾM...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4" /> NHẬP GHI CHÚ
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* DELETE CONFIRMATION MODAL */}
        {noteToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-rose-950/60 space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">XÁC NHẬN XÓA GHI CHÚ</h3>
                  <p className="text-xs text-rose-400 font-mono">Hành động này không thể hoàn tác</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bạn có chắc chắn muốn xóa ghi chú sau khỏi danh sách lưu trữ cá nhân?
                </p>
                
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 font-bold break-all flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>{noteToDelete.title}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  HUỶ
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteNote}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> XÓA GHI CHÚ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
