import React, { useState, useEffect } from 'react';
import { 
  RobloxHack, 
  ScriptItem, 
  SetupCloudApp, 
  ServerCloudItem, 
  CloudPhoneProSettings, 
  GuideItem, 
  GetKeySettings,
  TabType 
} from './types';
import { 
  subscribeHacks, 
  subscribeScripts, 
  subscribeSetupCloud, 
  subscribeServerCloud, 
  subscribeGuides, 
  subscribeCloudPhoneSettings, 
  subscribeGetKeySettings,
  DEFAULT_CLOUD_PHONE_SETTINGS,
  DEFAULT_GET_KEY_SETTINGS
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { HackRobloxTab } from './components/HackRobloxTab';
import { ScriptsTab } from './components/ScriptsTab';
import { SetupCloudTab } from './components/SetupCloudTab';
import { ServerCloudTab } from './components/ServerCloudTab';
import { GetKeyTab } from './components/GetKeyTab';
import { CloudPhoneProTab } from './components/CloudPhoneProTab';
import { GuidesTab } from './components/GuidesTab';
import { NotesTab } from './components/NotesTab';
import { AdminTab } from './components/AdminTab';
import { ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_mode') === 'true';
  });

  // Firestore Realtime Data States
  const [hacks, setHacks] = useState<RobloxHack[]>([]);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [setupApps, setSetupApps] = useState<SetupCloudApp[]>([]);
  const [servers, setServers] = useState<ServerCloudItem[]>([]);
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [cloudPhoneSettings, setCloudPhoneSettings] = useState<CloudPhoneProSettings>(DEFAULT_CLOUD_PHONE_SETTINGS);
  const [getKeySettings, setGetKeySettings] = useState<GetKeySettings>(DEFAULT_GET_KEY_SETTINGS);

  // User Local Token Verification State
  const [verifiedToken, setVerifiedToken] = useState<string | null>(() => {
    return localStorage.getItem('user_verified_token');
  });
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  // 1. Subscribe to Firebase Realtime Listeners
  useEffect(() => {
    const unsubHacks = subscribeHacks(setHacks);
    const unsubScripts = subscribeScripts(setScripts);
    const unsubSetup = subscribeSetupCloud(setSetupApps);
    const unsubServer = subscribeServerCloud(setServers);
    const unsubGuides = subscribeGuides(setGuides);
    const unsubCp = subscribeCloudPhoneSettings(setCloudPhoneSettings);
    const unsubGetKey = subscribeGetKeySettings(setGetKeySettings);

    return () => {
      unsubHacks();
      unsubScripts();
      unsubSetup();
      unsubServer();
      unsubGuides();
      unsubCp();
      unsubGetKey();
    };
  }, []);

  // 2. Handle URL Route & Token Verification Parsing
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      
      // Admin Route Check (/0869125253)
      if (path === '0869125253') {
        localStorage.setItem('is_admin_mode', 'true');
        setIsAdmin(true);
        setActiveTab('admin');
        window.history.replaceState({}, document.title, '/');
        return;
      }

      if (!path) return;

      const activeTokenClean = (getKeySettings.activeToken || DEFAULT_GET_KEY_SETTINGS.activeToken).trim();

      // Check if visited path matches active token OR looks like a valid token URL
      const isTokenMatch = path.toLowerCase() === activeTokenClean.toLowerCase();
      const isCustomTokenPath = path.length > 5 && !['home', 'hack_roblox', 'scripts', 'setup_cloud', 'server_cloud_pro', 'get_key', 'cloud_phone_pro', 'guides', 'notes', 'admin'].includes(path);

      if (isTokenMatch || isCustomTokenPath) {
        const tokenToSave = activeTokenClean || path;
        localStorage.setItem('user_verified_token', tokenToSave);
        setVerifiedToken(tokenToSave);
        setShowVerificationBanner(true);
        setActiveTab('get_key');

        // Clean URL to '/' without reloading
        window.history.replaceState({}, document.title, '/');

        setTimeout(() => {
          setShowVerificationBanner(false);
        }, 6000);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, [getKeySettings.activeToken]);

  // Clean Token strings for robust comparison
  const activeTokenClean = (getKeySettings.activeToken || DEFAULT_GET_KEY_SETTINGS.activeToken).trim();
  const verifiedTokenClean = (verifiedToken || '').trim();

  // User is verified if clean stored token matches clean active token
  const isUserKeyVerified = Boolean(
    verifiedTokenClean &&
    activeTokenClean &&
    (
      verifiedTokenClean.toLowerCase() === activeTokenClean.toLowerCase() ||
      (verifiedTokenClean.length > 5 && activeTokenClean === DEFAULT_GET_KEY_SETTINGS.activeToken)
    )
  );

  // Guaranteed non-empty hidden key string to display
  const effectiveHiddenKey = (getKeySettings.hiddenKey || '').trim() || DEFAULT_GET_KEY_SETTINGS.hiddenKey;

  const resetUserKey = () => {
    localStorage.removeItem('user_verified_token');
    setVerifiedToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Background Ambient Gaming Particles Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Token Verification Toast Banner */}
      <AnimatePresence>
        {showVerificationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 shadow-2xl shadow-emerald-500/40 flex items-center gap-3 border border-emerald-300 font-bold text-sm"
          >
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-black">XÁC MINH VƯỢT LINK THÀNH CÔNG!</p>
              <p className="text-xs opacity-90 font-mono font-semibold">
                Token đã khớp. Key của bạn đã được kích hoạt hiển thị!
              </p>
            </div>
            <Sparkles className="w-5 h-5 ml-auto animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <div className="relative z-10">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={isAdmin} 
        />
      </div>

      {/* Main Content Stage */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
            {activeTab === 'hack_roblox' && <HackRobloxTab hacks={hacks} />}
            {activeTab === 'scripts' && <ScriptsTab scripts={scripts} />}
            {activeTab === 'setup_cloud' && <SetupCloudTab apps={setupApps} />}
            {activeTab === 'server_cloud_pro' && <ServerCloudTab servers={servers} />}
            {activeTab === 'get_key' && (
              <GetKeyTab
                settings={getKeySettings}
                isKeyVerified={isUserKeyVerified}
                userKey={isUserKeyVerified ? effectiveHiddenKey : null}
                resetUserKey={resetUserKey}
              />
            )}
            {activeTab === 'cloud_phone_pro' && <CloudPhoneProTab settings={cloudPhoneSettings} />}
            {activeTab === 'guides' && <GuidesTab guides={guides} />}
            {activeTab === 'notes' && <NotesTab />}
            {activeTab === 'admin' && (
              <AdminTab
                hacks={hacks}
                scripts={scripts}
                setupApps={setupApps}
                servers={servers}
                cloudPhoneSettings={cloudPhoneSettings}
                guides={guides}
                getKeySettings={getKeySettings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Gaming Footer */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4" /> CLOUD PHONE PRO GAMING HUB
          </div>
          <p>© 2026 Cloud Phone Pro. Tốc độ vượt trội - Cấu hình khủng - Mượt mà 24/7.</p>
        </div>
      </footer>
    </div>
  );
}
