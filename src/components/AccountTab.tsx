import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  userAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User 
} from '../lib/userFirebase';
import { 
  UserProfile, 
  CommunityScript, 
  ScriptComment 
} from '../types';
import { 
  saveUserProfile, 
  subscribeUserProfile, 
  subscribeCommunityScripts,
  updateAuthorProfileInScripts
} from '../lib/communityService';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  LogOut, 
  Camera, 
  Check, 
  Sparkles, 
  Code2, 
  Heart, 
  MessageSquare, 
  AlertCircle, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

interface AccountTabProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  onNavigateToScripts?: () => void;
}

export function AccountTab({ currentUser, userProfile, onNavigateToScripts }: AccountTabProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // User's items
  const [myScripts, setMyScripts] = useState<CommunityScript[]>([]);
  const [likedScripts, setLikedScripts] = useState<CommunityScript[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'my_scripts' | 'liked_history'>('profile');

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.displayName || currentUser?.displayName || '');
      setAvatarPreview(userProfile.avatarUrl || currentUser?.photoURL || '');
    } else if (currentUser) {
      setEditName(currentUser.displayName || '');
      setAvatarPreview(currentUser.photoURL || '');
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeCommunityScripts((scripts) => {
      const mine = scripts.filter(s => s.authorUid === currentUser.uid);
      const liked = scripts.filter(s => Array.isArray(s.likedBy) && s.likedBy.includes(currentUser.uid));
      setMyScripts(mine);
      setLikedScripts(liked);
    });
    return () => unsub();
  }, [currentUser]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          throw new Error('Vui lòng nhập Tên hiển thị!');
        }
        const res = await createUserWithEmailAndPassword(userAuth, email.trim(), password);
        await updateProfile(res.user, {
          displayName: displayName.trim(),
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName.trim())}`
        });

        const initialProfile: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email.trim(),
          displayName: displayName.trim(),
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName.trim())}`,
          createdAt: Date.now()
        };
        await saveUserProfile(initialProfile);
        setSuccessMsg('Đăng ký tài khoản thành công!');
      } else {
        await signInWithEmailAndPassword(userAuth, email.trim(), password);
        setSuccessMsg('Đăng nhập thành công!');
      }
    } catch (err: any) {
      console.error(err);
      let message = err.message || 'Thao tác thất bại!';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Email hoặc Mật khẩu không chính xác!';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Email này đã được đăng ký tài khoản!';
      } else if (err.code === 'auth/weak-password') {
        message = 'Mật khẩu phải chứa ít nhất 6 ký tự!';
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSavingProfile(true);

    try {
      const cleanName = editName.trim() || currentUser.displayName || 'Thành viên';
      const cleanAvatar = avatarPreview.trim() || currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`;

      await updateProfile(currentUser, {
        displayName: cleanName,
        photoURL: cleanAvatar
      });

      const updatedProf: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: cleanName,
        avatarUrl: cleanAvatar,
        createdAt: userProfile?.createdAt || Date.now()
      };
      await saveUserProfile(updatedProf);

      // Sync updated avatar & name to all scripts and comments previously posted by this user
      await updateAuthorProfileInScripts(currentUser.uid, cleanName, cleanAvatar);

      setSuccessMsg('Cập nhật thông tin và đồng bộ avatar cho tất cả Script đã đăng thành công!');
    } catch (err: any) {
      setErrorMsg('Không thể cập nhật hồ sơ: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut(userAuth);
  };

  // Render NOT Logged In State
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <UserIcon className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-white tracking-wide uppercase">
              TÀI KHOẢN NGƯỜI DÙNG
            </h1>
            <p className="text-xs text-slate-400">
              Đăng nhập hoặc Đăng ký để đăng Script, bình luận và thả tim!
            </p>
          </div>

          {/* Form Mode Selector */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ĐĂNG NHẬP
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ĐĂNG KÝ MỚI
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Tên Hiển Thị
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nhập biệt danh của bạn..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Đang Xử Lý...' : isRegister ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP NGAY'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Logged In Profile & Dashboard
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar Display */}
          <div className="relative group">
            <img
              src={avatarPreview || currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
              alt="Avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`;
              }}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20 bg-slate-950"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              {userProfile?.displayName || currentUser.displayName || 'Thành viên'}
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs font-mono text-cyan-400">{currentUser.email}</p>
            <p className="text-[11px] text-slate-400 font-mono">
              UID: {currentUser.uid}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 px-2 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Hồ Sơ Cá Nhân
        </button>

        <button
          onClick={() => setActiveSubTab('my_scripts')}
          className={`pb-3 px-2 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'my_scripts'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Script Của Tôi ({myScripts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('liked_history')}
          className={`pb-3 px-2 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'liked_history'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          Script Đã Yêu Thích ({likedScripts.length})
        </button>
      </div>

      {/* Sub-Tab 1: Profile Edit */}
      {activeSubTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Chỉnh Sửa Thông Tin Cá Nhân
          </h2>

          {avatarError && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{avatarError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">
                Tên Hiển Thị Công Khai
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên hiển thị..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase block">
                Thay Đổi Ảnh Đại Diện (Nhập URL Đường Dẫn Ảnh)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={avatarPreview || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                  alt="Avatar Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`;
                  }}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-950 border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 flex-shrink-0"
                />
                <div className="w-full space-y-2">
                  <input
                    type="url"
                    value={avatarPreview}
                    onChange={(e) => {
                      setAvatarError(null);
                      setAvatarPreview(e.target.value);
                    }}
                    placeholder="Dán URL ảnh (vd: https://i.imgur.com/example.png hoặc link bất kỳ)..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">Gợi ý tạo avatar:</span>
                    {['bottts', 'adventurer', 'avataaars', 'pixel-art'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => {
                          setAvatarPreview(`https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(editName || currentUser.uid)}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-[10px] font-mono cursor-pointer transition-all"
                      >
                        +{style}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-cyan-400/90 font-mono italic">
                    * Khi lưu thay đổi, avatar mới sẽ tự động cập nhật cho tất cả các Script bạn đã đăng trước đây!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isSavingProfile ? 'Đang Lưu...' : 'LƯU THAY ĐỔI'}
            </button>
          </form>
        </div>
      )}

      {/* Sub-Tab 2: My Scripts */}
      {activeSubTab === 'my_scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Danh Sách Script Bạn Đã Đăng ({myScripts.length})
            </h2>
            {onNavigateToScripts && (
              <button
                onClick={onNavigateToScripts}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Đăng Script Mới Trong Tab Scripts <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {myScripts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs italic">
              Bạn chưa đăng script nào. Hãy sang tab "Scripts" để chia sẻ script của bạn với cộng đồng!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myScripts.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-sm line-clamp-1">{s.title}</h3>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      ♥ {s.likes} Lượt thích
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{s.description || 'Không có mô tả'}</p>
                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 truncate">
                    {s.code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Liked History */}
      {activeSubTab === 'liked_history' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Script Bạn Đã Thả Tim ({likedScripts.length})
          </h2>

          {likedScripts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs italic">
              Bạn chưa thả tim script nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {likedScripts.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.authorUid}`}
                      alt="Author"
                      className="w-8 h-8 rounded-lg object-cover bg-slate-950"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{s.title}</h3>
                      <p className="text-[10px] text-slate-400">Bởi: {s.authorName}</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 truncate">
                    {s.code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
