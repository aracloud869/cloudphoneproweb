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
  | 'admin';
