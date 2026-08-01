import React, { useState, useEffect } from 'react';
import { 
  RobloxHack, 
  ScriptItem, 
  SetupCloudApp, 
  ServerCloudItem, 
  CloudPhoneProSettings, 
  GuideItem, 
  GetKeySettings,
  TabType,
  UserProfile,
  UserBanRecord
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
import { userAuth, onAuthStateChanged, User } from './lib/userFirebase';
import { subscribeUserProfile, subscribeUserBans } from './lib/communityService';
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
import { AccountTab } from './components/AccountTab';
import { AdminTab } from './components/AdminTab';
import { BannedOverlay } from './components/BannedOverlay';
import { ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TAB_ROUTES: Record<TabType, string> = {
  home: '/',
  hack_roblox: '/hack-roblox',
  scripts: '/scripts',
  setup_cloud: '/setup-cloud',
  server_cloud_pro: '/server-cloud-pro',
  get_key: '/get-key',
  cloud_phone_pro: '/cloud-phone-pro',
  guides: '/guides',
  notes: '/notes',
  account: '/account',
  admin: '/0869125253',
};

const getTabFromPath = (pathname: string): TabType => {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (cleanPath === '0869125253') {
    return 'admin';
  }

  switch (cleanPath) {
    case 'hack-roblox':
    case 'hack_roblox':
      return 'hack_roblox';
    case 'scripts':
      return 'scripts';
    case 'setup-cloud':
    case 'setup_cloud':
      return 'setup_cloud';
    case 'server-cloud-pro':
    case 'server_cloud_pro':
      return 'server_cloud_pro';
    case 'get-key':
    case 'get_key':
      return 'get_key';
    case 'cloud-phone-pro':
    case 'cloud_phone_pro':
      return 'cloud_phone_pro';
    case 'guides':
      return 'guides';
    case 'notes':
      return 'notes';
    case 'account':
      return 'account';
    default:
      return 'home';
  }
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_mode') === 'true';
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return getTabFromPath(window.location.pathname);
  });

  // Tab switch handler with URL synchronization
  const handleTabChange = (tab: TabType, replace: boolean = false) => {
    setActiveTab(tab);
    const targetPath = TAB_ROUTES[tab] || '/';
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({}, document.title, targetPath);
      } else {
        window.history.pushState({}, document.title, targetPath);
      }
    }
  };

  // User Authentication & Profile States (Second Firebase)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allBans, setAllBans] = useState<UserBanRecord[]>([]);

  // Listen to Auth State
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(userAuth, (user) => {
      setCurrentUser(user);
    });
    const unsubBans = subscribeUserBans((bans) => {
      setAllBans(bans);
    });
    return () => {
      unsubAuth();
      unsubBans();
    };
  }, []);

  // Listen to User Profile when logged in
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    const unsubProfile = subscribeUserProfile(currentUser.uid, (profile) => {
      setUserProfile(profile);
    });
    return () => unsubProfile();
  }, [currentUser]);

  // Check if current logged in user or email is banned
  const now = Date.now();
  const activeBanRecord = currentUser
    ? allBans.find(
        (b) =>
          b.expiresAt > now &&
          (b.userEmail.toLowerCase() === (currentUser.email || '').toLowerCase() ||
           (b.userUid && b.userUid === currentUser.uid))
      )
    : null;

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

  // 2. Handle URL Route Check & Browser Back/Forward navigation
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      
      // Admin Secret URL Route Check (/0869125253)
      if (path === '0869125253') {
        localStorage.setItem('is_admin_mode', 'true');
        setIsAdmin(true);
        handleTabChange('admin', true);
        return;
      }

      const targetTab = getTabFromPath(window.location.pathname);
      setActiveTab(targetTab);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Clean Token strings for robust comparison
  const activeTokenClean = (getKeySettings.activeToken || DEFAULT_GET_KEY_SETTINGS.activeToken).trim();
  const verifiedTokenClean = (verifiedToken || '').trim();

  // User is verified if clean stored token matches clean active token
  const isUserKeyVerified = Boolean(
    verifiedTokenClean &&
    activeTokenClean &&
    verifiedTokenClean.toLowerCase() === activeTokenClean.toLowerCase()
  );

  // Verify entered token against current active token
  const handleVerifyToken = (tokenInput: string): boolean => {
    const cleanInput = tokenInput.trim();
    if (cleanInput && activeTokenClean && cleanInput.toLowerCase() === activeTokenClean.toLowerCase()) {
      localStorage.setItem('user_verified_token', cleanInput);
      setVerifiedToken(cleanInput);
      setShowVerificationBanner(true);
      setTimeout(() => setShowVerificationBanner(false), 5000);
      return true;
    }
    return false;
  };

  // Guaranteed non-empty hidden key string to display
  const effectiveHiddenKey = (getKeySettings.hiddenKey || '').trim() || DEFAULT_GET_KEY_SETTINGS.hiddenKey;

  const resetUserKey = () => {
    localStorage.removeItem('user_verified_token');
    setVerifiedToken(null);
  };

  const handleUnlockAdmin = () => {
    localStorage.setItem('is_admin_mode', 'true');
    setIsAdmin(true);
    handleTabChange('admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Banned Overlay check */}
      {activeBanRecord && currentUser && (
        <BannedOverlay
          banRecord={activeBanRecord}
          userEmail={currentUser.email || activeBanRecord.userEmail}
          userName={currentUser.displayName || activeBanRecord.userName}
          userUid={currentUser.uid}
        />
      )}

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
          setActiveTab={handleTabChange} 
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
            {activeTab === 'home' && <HomeTab setActiveTab={handleTabChange} />}
            {activeTab === 'hack_roblox' && <HackRobloxTab hacks={hacks} />}
            {activeTab === 'scripts' && (
              <ScriptsTab 
                scripts={scripts} 
                currentUser={currentUser} 
                onNavigateToAccount={() => handleTabChange('account')} 
              />
            )}
            {activeTab === 'setup_cloud' && <SetupCloudTab apps={setupApps} />}
            {activeTab === 'server_cloud_pro' && <ServerCloudTab servers={servers} />}
            {activeTab === 'get_key' && (
              <GetKeyTab
                settings={getKeySettings}
                isKeyVerified={isUserKeyVerified}
                userKey={isUserKeyVerified ? effectiveHiddenKey : null}
                resetUserKey={resetUserKey}
                onVerifyToken={handleVerifyToken}
              />
            )}
            {activeTab === 'cloud_phone_pro' && <CloudPhoneProTab settings={cloudPhoneSettings} />}
            {activeTab === 'guides' && <GuidesTab guides={guides} />}
            {activeTab === 'notes' && <NotesTab onAdminUnlocked={handleUnlockAdmin} />}
            {activeTab === 'account' && (
              <AccountTab 
                currentUser={currentUser} 
                userProfile={userProfile} 
                onNavigateToScripts={() => handleTabChange('scripts')} 
              />
            )}
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