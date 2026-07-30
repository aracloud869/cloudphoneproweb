export interface HackVersion {
  id: string;
  versionName: string;
  downloadUrl: string;
}

export interface RobloxHack {
  id: string;
  name: string;
  iconUrl: string;
  version: string; // Display summary version or main version
  versionsList: HackVersion[];
  createdAt?: number;
}

export interface ScriptItem {
  id: string;
  name: string;
  code: string;
  createdAt?: number;
}

export interface SetupCloudApp {
  id: string;
  name: string;
  iconUrl: string;
  downloadUrl: string;
  createdAt?: number;
}

export interface ServerCloudItem {
  id: string;
  name: string;
  iconUrl: string;
  targetUrl: string;
  createdAt?: number;
}

export interface CloudPhoneProSettings {
  appName: string;
  iconUrl: string;
  version: string;
  rating: string;
  downloadUrl: string;
  description: string;
  previewImages: string[];
  specs: string[];
  updatedAt?: number;
}

export interface GuideItem {
  id: string;
  title: string;
  videoUrl: string;
  innerUrl: string;
  notes: string;
  createdAt?: number;
}

export interface GetKeySettings {
  activeToken: string;
  hiddenKey: string;
  getKeyUrl: string;
  updatedAt?: number;
}

export interface NoteAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  attachment?: NoteAttachment | null;
  createdAt: number;
  authorName?: string;
}

export type TabType = 
  | 'home' 
  | 'hack_roblox' 
  | 'scripts' 
  | 'setup_cloud' 
  | 'server_cloud_pro' 
  | 'get_key' 
  | 'cloud_phone_pro' 
  | 'guides' 
  | 'notes'
  | 'account'
  | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  createdAt: number;
}

export interface CommunityScript {
  id: string;
  title: string;
  code: string;
  description?: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  reportsCount: number;
  createdAt: number;
}

export interface ScriptComment {
  id: string;
  scriptId: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
  parentId?: string | null;
  likes: number;
  likedBy: string[];
}

export interface ScriptReport {
  id: string;
  scriptId: string;
  scriptTitle: string;
  reporterUid: string;
  reporterName: string;
  reason: string;
  createdAt: number;
}

export interface UserBanRecord {
  id: string;
  userEmail: string;
  userName: string;
  userUid?: string;
  banDays: number;
  reason?: string;
  bannedAt: number;
  expiresAt: number;
}

export interface BanAppeal {
  id: string;
  userEmail: string;
  userName: string;
  userUid: string;
  appealNote: string;
  createdAt: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

