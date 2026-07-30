import React, { useState } from 'react';
import { 
  RobloxHack, 
  ScriptItem, 
  SetupCloudApp, 
  ServerCloudItem, 
  CloudPhoneProSettings, 
  GuideItem, 
  GetKeySettings,
  HackVersion
} from '../types';
import { 
  saveHack, 
  deleteHack, 
  saveScript, 
  deleteScript, 
  saveSetupCloudApp, 
  deleteSetupCloudApp, 
  saveServerCloudItem, 
  deleteServerCloudItem, 
  saveGuide, 
  deleteGuide, 
  updateCloudPhoneSettings, 
  updateGetKeySettings 
} from '../lib/firebase';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Gamepad2, 
  Code2, 
  Wrench, 
  Server, 
  Smartphone, 
  HelpCircle, 
  KeyRound,
  Check,
  X,
  ExternalLink,
  Layers,
  Copy
} from 'lucide-react';

interface AdminTabProps {
  hacks: RobloxHack[];
  scripts: ScriptItem[];
  setupApps: SetupCloudApp[];
  servers: ServerCloudItem[];
  cloudPhoneSettings: CloudPhoneProSettings;
  guides: GuideItem[];
  getKeySettings: GetKeySettings;
}

type AdminSubTab = 'hacks' | 'scripts' | 'setup_cloud' | 'server_cloud' | 'cloud_phone' | 'guides' | 'get_key';

export const AdminTab: React.FC<AdminTabProps> = ({
  hacks,
  scripts,
  setupApps,
  servers,
  cloudPhoneSettings,
  guides,
  getKeySettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('hacks');
  const [successMsg, setSuccessMsg] = useState('');

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // --- 1. Hack Roblox State ---
  const [editingHackId, setEditingHackId] = useState<string | null>(null);
  const [hackName, setHackName] = useState('');
  const [hackIconUrl, setHackIconUrl] = useState('');
  const [hackMainVersion, setHackMainVersion] = useState('');
  const [hackVersionsList, setHackVersionsList] = useState<HackVersion[]>([]);
  const [tempVerName, setTempVerName] = useState('');
  const [tempVerUrl, setTempVerUrl] = useState('');

  const handleAddHackVersion = () => {
    if (!tempVerName || !tempVerUrl) return;
    setHackVersionsList([...hackVersionsList, { id: Date.now().toString(), versionName: tempVerName, downloadUrl: tempVerUrl }]);
    setTempVerName('');
    setTempVerUrl('');
  };

  const handleRemoveHackVersion = (id: string) => {
    setHackVersionsList(hackVersionsList.filter(v => v.id !== id));
  };

  const handleSaveHack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackName) return;
    await saveHack({
      name: hackName,
      iconUrl: hackIconUrl,
      version: hackMainVersion || 'v1.0',
      versionsList: hackVersionsList
    }, editingHackId || undefined);

    notify('Đã lưu thông tin Hack Roblox thành công!');
    resetHackForm();
  };

  const resetHackForm = () => {
    setEditingHackId(null);
    setHackName('');
    setHackIconUrl('');
    setHackMainVersion('');
    setHackVersionsList([]);
  };

  const handleEditHack = (h: RobloxHack) => {
    setEditingHackId(h.id);
    setHackName(h.name);
    setHackIconUrl(h.iconUrl);
    setHackMainVersion(h.version);
    setHackVersionsList(h.versionsList || []);
  };

  // --- 2. Script State ---
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
  const [scriptName, setScriptName] = useState('');
  const [scriptCode, setScriptCode] = useState('');

  const handleSaveScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptName || !scriptCode) return;
    await saveScript({ name: scriptName, code: scriptCode }, editingScriptId || undefined);
    notify('Đã lưu Script thành công!');
    setEditingScriptId(null);
    setScriptName('');
    setScriptCode('');
  };

  // --- 3. Setup Cloud State ---
  const [editingSetupId, setEditingSetupId] = useState<string | null>(null);
  const [setupName, setSetupName] = useState('');
  const [setupIconUrl, setSetupIconUrl] = useState('');
  const [setupDownloadUrl, setSetupDownloadUrl] = useState('');

  const handleSaveSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupName) return;
    await saveSetupCloudApp({
      name: setupName,
      iconUrl: setupIconUrl,
      downloadUrl: setupDownloadUrl
    }, editingSetupId || undefined);
    notify('Đã lưu ứng dụng tiện ích thành công!');
    setEditingSetupId(null);
    setSetupName('');
    setSetupIconUrl('');
    setSetupDownloadUrl('');
  };

  // --- 4. Server Cloud State ---
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [serverName, setServerName] = useState('');
  const [serverIconUrl, setServerIconUrl] = useState('');
  const [serverTargetUrl, setServerTargetUrl] = useState('');

  const handleSaveServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName) return;
    await saveServerCloudItem({
      name: serverName,
      iconUrl: serverIconUrl,
      targetUrl: serverTargetUrl
    }, editingServerId || undefined);
    notify('Đã lưu Server Cloud Pro thành công!');
    setEditingServerId(null);
    setServerName('');
    setServerIconUrl('');
    setServerTargetUrl('');
  };

  // --- 5. Cloud Phone Pro Settings State ---
  const [cpName, setCpName] = useState(cloudPhoneSettings.appName || 'Cloud Phone Pro');
  const [cpIcon, setCpIcon] = useState(cloudPhoneSettings.iconUrl || '');
  const [cpVersion, setCpVersion] = useState(cloudPhoneSettings.version || 'v3.5.2');
  const [cpRating, setCpRating] = useState(cloudPhoneSettings.rating || '4.9 ★');
  const [cpDownloadUrl, setCpDownloadUrl] = useState(cloudPhoneSettings.downloadUrl || '');
  const [cpDesc, setCpDesc] = useState(cloudPhoneSettings.description || '');
  const [cpPreviewsStr, setCpPreviewsStr] = useState((cloudPhoneSettings.previewImages || []).join('\n'));
  const [cpSpecsStr, setCpSpecsStr] = useState((cloudPhoneSettings.specs || []).join('\n'));

  const handleSaveCloudPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const previewImages = cpPreviewsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const specs = cpSpecsStr.split('\n').map(s => s.trim()).filter(Boolean);

    await updateCloudPhoneSettings({
      appName: cpName,
      iconUrl: cpIcon,
      version: cpVersion,
      rating: cpRating,
      downloadUrl: cpDownloadUrl,
      description: cpDesc,
      previewImages,
      specs
    });

    notify('Đã cập nhật cấu hình Cloud Phone Pro toàn hệ thống!');
  };

  // --- 6. Guides State ---
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideVideoUrl, setGuideVideoUrl] = useState('');
  const [guideInnerUrl, setGuideInnerUrl] = useState('');
  const [guideNotes, setGuideNotes] = useState('');

  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideTitle) return;
    await saveGuide({
      title: guideTitle,
      videoUrl: guideVideoUrl,
      innerUrl: guideInnerUrl,
      notes: guideNotes
    }, editingGuideId || undefined);
    notify('Đã lưu Hướng dẫn sử dụng thành công!');
    setEditingGuideId(null);
    setGuideTitle('');
    setGuideVideoUrl('');
    setGuideInnerUrl('');
    setGuideNotes('');
  };

  // --- 7. Get Key & Token Settings State ---
  const [keyHiddenString, setKeyHiddenString] = useState(getKeySettings.hiddenKey || '');
  const [keyDestinationUrl, setKeyDestinationUrl] = useState(getKeySettings.getKeyUrl || '');
  const [newTokenInput, setNewTokenInput] = useState(getKeySettings.activeToken || '');
  const [tokenCopied, setTokenCopied] = useState(false);

  React.useEffect(() => {
    if (getKeySettings) {
      setKeyHiddenString(getKeySettings.hiddenKey || '');
      setKeyDestinationUrl(getKeySettings.getKeyUrl || '');
      setNewTokenInput(getKeySettings.activeToken || '');
    }
  }, [getKeySettings]);

  const handleSaveGetKey = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGetKeySettings({
      activeToken: newTokenInput.trim(),
      hiddenKey: keyHiddenString.trim(),
      getKeyUrl: keyDestinationUrl.trim()
    });
    notify('Đã tạo Token & Cập nhật Key ẩn toàn hệ thống! Tất cả user sẽ tự động reset key.');
  };

  const vercelDomain = 'https://cloudphoneproweb.vercel.app';
  const fullTokenUrl = `${vercelDomain}/${newTokenInput.trim()}`;

  const copyTokenUrl = () => {
    navigator.clipboard.writeText(fullTokenUrl);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">ADMIN MANAGEMENT PANEL</h1>
            <p className="text-xs text-emerald-400 font-mono">
              Quyền Quản Trị Hệ Thống Cloud Phone Pro - Cập nhật dữ liệu thời gian thực
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-sm font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* Admin Sub-tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'hacks', label: 'Hack Roblox', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'scripts', label: 'Scripts', icon: <Code2 className="w-4 h-4" /> },
          { id: 'setup_cloud', label: 'Setup Cloud', icon: <Wrench className="w-4 h-4" /> },
          { id: 'server_cloud', label: 'Server Cloud Pro', icon: <Server className="w-4 h-4" /> },
          { id: 'cloud_phone', label: 'App Cloud Phone Pro', icon: <Smartphone className="w-4 h-4" /> },
          { id: 'guides', label: 'Hướng Dẫn', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'get_key', label: 'Get Key & Token', icon: <KeyRound className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as AdminSubTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- SUB TAB 1: HACK ROBLOX ---------------- */}
      {activeSubTab === 'hacks' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveHack} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              {editingHackId ? 'Chỉnh Sửa Bản Hack Roblox' : 'Thêm Bản Hack Roblox Mới'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tên Bản Hack</label>
                <input
                  type="text"
                  value={hackName}
                  onChange={(e) => setHackName(e.target.value)}
                  placeholder="Ví dụ: Hydrogen Client, Delta, Codex..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Ảnh Icon Hack</label>
                <input
                  type="text"
                  value={hackIconUrl}
                  onChange={(e) => setHackIconUrl(e.target.value)}
                  placeholder="https://domain.com/icon.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tên Phiên Bản Hiển Thị Chín (Ví dụ: v2.604)</label>
                <input
                  type="text"
                  value={hackMainVersion}
                  onChange={(e) => setHackMainVersion(e.target.value)}
                  placeholder="v2.604"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Versions List Builder */}
            <div className="pt-2 space-y-3">
              <label className="block text-xs font-mono text-emerald-400 font-bold">Thêm Các Phiên Bản Muốn Tải (Tải khi nhấn nút Download)</label>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={tempVerName}
                  onChange={(e) => setTempVerName(e.target.value)}
                  placeholder="Tên phiên bản (VD: Bản APK Android)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                />
                <input
                  type="text"
                  value={tempVerUrl}
                  onChange={(e) => setTempVerUrl(e.target.value)}
                  placeholder="Link tải (https://...)"
                  className="w-full sm:w-2/3 px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddHackVersion}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs whitespace-nowrap"
                >
                  + Thêm PB
                </button>
              </div>

              {/* Render added versions */}
              <div className="space-y-1.5">
                {hackVersionsList.map((ver) => (
                  <div key={ver.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-white font-bold">{ver.versionName}</span>
                    <span className="text-slate-400 truncate max-w-xs">{ver.downloadUrl}</span>
                    <button type="button" onClick={() => handleRemoveHackVersion(ver.id)} className="text-red-400 p-1 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm"
              >
                {editingHackId ? 'Cập Nhật Hack' : 'Thêm Hack Roblox'}
              </button>
              {editingHackId && (
                <button
                  type="button"
                  onClick={resetHackForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          {/* Table List of Hacks */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Danh Sách Hack Roblox Trên Web</h3>
            {hacks.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={h.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"} className="w-10 h-10 object-cover rounded-lg" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{h.name} <span className="text-xs text-cyan-400 font-mono">({h.version})</span></h4>
                    <p className="text-xs text-slate-400">{h.versionsList?.length || 0} phiên bản tải</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditHack(h)} className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteHack(h.id)} className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 2: SCRIPTS ---------------- */}
      {activeSubTab === 'scripts' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveScript} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              {editingScriptId ? 'Chỉnh Sửa Script' : 'Thêm Script Mới'}
            </h2>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tên Script</label>
              <input
                type="text"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                placeholder="Ví dụ: Script Blox Fruits Auto Farm Hub..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800 focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Mã Script (Code)</label>
              <textarea
                value={scriptCode}
                onChange={(e) => setScriptCode(e.target.value)}
                rows={5}
                placeholder="loadstring(game:HttpGet('...'))()"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-cyan-300 font-mono text-xs border border-slate-800 focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm">
                {editingScriptId ? 'Cập Nhật Script' : 'Thêm Script'}
              </button>
            </div>
          </form>

          {/* List of Scripts */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Danh Sách Scripts Hiện Tại</h3>
            {scripts.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{s.name}</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingScriptId(s.id); setScriptName(s.name); setScriptCode(s.code); }} className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteScript(s.id)} className="p-1.5 rounded-lg bg-slate-800 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-400 truncate bg-slate-950 p-2 rounded">{s.code}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 3: SETUP CLOUD ---------------- */}
      {activeSubTab === 'setup_cloud' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveSetup} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              {editingSetupId ? 'Chỉnh Sửa App Tiện Ích' : 'Thêm App Tiện Ích Mới'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tên App Tiện Ích</label>
                <input
                  type="text"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="Auto Clicker, FPS Booster..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Ảnh Icon</label>
                <input
                  type="text"
                  value={setupIconUrl}
                  onChange={(e) => setSetupIconUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Tải Tiện Ích</label>
                <input
                  type="text"
                  value={setupDownloadUrl}
                  onChange={(e) => setSetupDownloadUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                  required
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm">
              Lưu Tiện Ích
            </button>
          </form>

          {/* List of Setup Apps */}
          <div className="space-y-3">
            {setupApps.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={a.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-bold text-white">{a.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingSetupId(a.id); setSetupName(a.name); setSetupIconUrl(a.iconUrl); setSetupDownloadUrl(a.downloadUrl); }} className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteSetupCloudApp(a.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 4: SERVER CLOUD PRO ---------------- */}
      {activeSubTab === 'server_cloud' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveServer} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              {editingServerId ? 'Chỉnh Sửa Server Cloud Pro' : 'Thêm Server Cloud Pro Mới'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tên Server</label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Server Cloud SG-01..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Ảnh Icon</label>
                <input
                  type="text"
                  value={serverIconUrl}
                  onChange={(e) => setServerIconUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Chuyển Đến Khi Nhấn "Đi"</label>
                <input
                  type="text"
                  value={serverTargetUrl}
                  onChange={(e) => setServerTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm border border-slate-800"
                  required
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm">
              Lưu Server
            </button>
          </form>

          {/* List of Servers */}
          <div className="space-y-3">
            {servers.map((srv) => (
              <div key={srv.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={srv.iconUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-bold text-white">{srv.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingServerId(srv.id); setServerName(srv.name); setServerIconUrl(srv.iconUrl); setServerTargetUrl(srv.targetUrl); }} className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteServerCloudItem(srv.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 5: CLOUD PHONE PRO CONFIG ---------------- */}
      {activeSubTab === 'cloud_phone' && (
        <form onSubmit={handleSaveCloudPhone} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            Cấu Hình Trang App Cloud Phone Pro (Trang Store)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tên App</label>
              <input type="text" value={cpName} onChange={(e) => setCpName(e.target.value)} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">URL Icon App</label>
              <input type="text" value={cpIcon} onChange={(e) => setCpIcon(e.target.value)} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Phiên Bản</label>
              <input type="text" value={cpVersion} onChange={(e) => setCpVersion(e.target.value)} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Đánh Giá (Rating)</label>
              <input type="text" value={cpRating} onChange={(e) => setCpRating(e.target.value)} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">URL Link Tải APK App</label>
              <input type="text" value={cpDownloadUrl} onChange={(e) => setCpDownloadUrl(e.target.value)} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">Mô Tả Giới Thiệu App</label>
              <textarea value={cpDesc} onChange={(e) => setCpDesc(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">URL Các Ảnh Xem Trước Preview (Mỗi URL 1 dòng)</label>
              <textarea value={cpPreviewsStr} onChange={(e) => setCpPreviewsStr(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">Thông Số Cấu Hình Specs (Mỗi dòng 1 thông số)</label>
              <textarea value={cpSpecsStr} onChange={(e) => setCpSpecsStr(e.target.value)} rows={4} className="w-full px-4 py-2 bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800" />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm">
            Cập Nhật Cloud Phone Pro Store
          </button>
        </form>
      )}

      {/* ---------------- SUB TAB 6: GUIDES ---------------- */}
      {activeSubTab === 'guides' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveGuide} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              {editingGuideId ? 'Chỉnh Sửa Bài Hướng Dẫn' : 'Thêm Bài Hướng Dẫn Mới'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tiêu Đề Hướng Dẫn</label>
                <input type="text" value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Ví dụ: Hướng dẫn vượt link lấy key..." className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" required />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Video Hướng Dẫn (YouTube hoặc trực tiếp)</label>
                <input type="text" value={guideVideoUrl} onChange={(e) => setGuideVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">URL Hiển Thị Trong Khung Đính Kèm</label>
                <input type="text" value={guideInnerUrl} onChange={(e) => setGuideInnerUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Ghi Chú</label>
                <textarea value={guideNotes} onChange={(e) => setGuideNotes(e.target.value)} rows={3} placeholder="Lưu ý khi thực hiện..." className="w-full px-4 py-2 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm" />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm">
              Lưu Bài Hướng Dẫn
            </button>
          </form>

          {/* List Guides */}
          <div className="space-y-3">
            {guides.map((g) => (
              <div key={g.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm font-bold text-white">{g.title}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingGuideId(g.id); setGuideTitle(g.title); setGuideVideoUrl(g.videoUrl); setGuideInnerUrl(g.innerUrl); setGuideNotes(g.notes); }} className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteGuide(g.id)} className="p-2 bg-slate-800 text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB TAB 7: GET KEY & TOKEN CONFIG ---------------- */}
      {activeSubTab === 'get_key' && (
        <form onSubmit={handleSaveGetKey} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              Quản Lý Key Ẩn & Token Xác Minh Vượt Link
            </h2>
            <p className="text-xs text-slate-400">
              Khi tạo Token mới tại đây, Firebase sẽ cập nhật dữ liệu tới tất cả người dùng real-time. Tất cả user sẽ bị reset key về trạng thái "Chưa có key" cho tới khi họ truy cập Token URL mới này.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-amber-300 font-bold mb-1">1. Key Ẩn (Key Sẽ Hiện Khi User Vượt Link Thành Công)</label>
              <input
                type="text"
                value={keyHiddenString}
                onChange={(e) => setKeyHiddenString(e.target.value)}
                placeholder="CLOUD-PHONE-PRO-KEY-SECRET-999"
                className="w-full px-4 py-2.5 bg-slate-950 text-emerald-400 font-mono font-bold rounded-xl border border-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-300 font-bold mb-1">2. Link Đích Cho Nút "Get Key" (Link Rút Gọn Vượt Link)</label>
              <input
                type="text"
                value={keyDestinationUrl}
                onChange={(e) => setKeyDestinationUrl(e.target.value)}
                placeholder="https://linkvertise.com/..."
                className="w-full px-4 py-2.5 bg-slate-950 text-cyan-300 font-mono rounded-xl border border-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-300 font-bold mb-1">3. Token Chuỗi Mã Hóa (Ví dụ: ughtwkn183748gscbclncvu)</label>
              <input
                type="text"
                value={newTokenInput}
                onChange={(e) => setNewTokenInput(e.target.value)}
                placeholder="ughtwkn183748gscbclncvu"
                className="w-full px-4 py-2.5 bg-slate-950 text-pink-300 font-mono rounded-xl border border-slate-800 text-sm"
                required
              />
            </div>

            {/* Generated Token Link Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Link Token Tự Động Tạo (Cài link này làm đích đến sau khi vượt link rút gọn):</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold truncate">{fullTokenUrl}</span>
                <button
                  type="button"
                  onClick={copyTokenUrl}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
                >
                  {tokenCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {tokenCopied ? 'Đã Copy!' : 'Sao Chép Link'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
          >
            CẬP NHẬT TOKEN & RESET KEY TẤT CẢ USER (CẬP NHẬT ALL)
          </button>
        </form>
      )}
    </div>
  );
};
