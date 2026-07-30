import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { 
  RobloxHack, 
  ScriptItem, 
  SetupCloudApp, 
  ServerCloudItem, 
  CloudPhoneProSettings, 
  GuideItem, 
  GetKeySettings,
  NoteItem 
} from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCnrIIwwwLj3UL3p07L9-P8OtgGC8dcSMM",
  authDomain: "webcloudpro-7d8be.firebaseapp.com",
  projectId: "webcloudpro-7d8be",
  storageBucket: "webcloudpro-7d8be.firebasestorage.app",
  messagingSenderId: "462828104564",
  appId: "1:462828104564:web:9eafd43b62047b17f35a21",
  measurementId: "G-8Z2JCCT78D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initial fallback defaults when database collections are fresh/empty
export const DEFAULT_CLOUD_PHONE_SETTINGS: CloudPhoneProSettings = {
  appName: "Cloud Phone Pro",
  iconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  version: "v3.5.2-Gaming",
  rating: "4.9 ★",
  downloadUrl: "https://example.com/download-cloud-phone-pro.apk",
  description: "Trải nghiệm Cloud Phone Pro với tốc độ cực nhanh, cấu hình Gaming cao cấp, độ trễ cực thấp, cắm treo game 24/7 không gián đoạn.",
  previewImages: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
  ],
  specs: [
    "CPU: 8-Core Snapdragon Gaming Cloud Engine",
    "RAM: 12GB LPDDR5 Virtualized",
    "Storage: 128GB NVMe Ultra High Speed",
    "FPS: Up to 120 FPS Unlocked",
    "Mạng: Cloud 10Gbps Dedicated Pipeline",
    "Hệ điều hành: Android 13 Custom Gaming OS"
  ]
};

export const DEFAULT_GET_KEY_SETTINGS: GetKeySettings = {
  activeToken: "ughtwkn183748gscbclncvu",
  hiddenKey: "CLOUD-PHONE-PRO-KEY-9988-X77",
  getKeyUrl: "https://example.com/vuot-link-get-key"
};

// Firestore Collections & Helpers

export function subscribeHacks(callback: (hacks: RobloxHack[]) => void) {
  const colRef = collection(db, 'hacks');
  return onSnapshot(colRef, (snapshot) => {
    const items: RobloxHack[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as RobloxHack);
    });
    // Sort by createdAt or name
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  }, (err) => {
    console.warn("Firestore hacks listener warning:", err);
  });
}

export function subscribeScripts(callback: (scripts: ScriptItem[]) => void) {
  const colRef = collection(db, 'scripts');
  return onSnapshot(colRef, (snapshot) => {
    const items: ScriptItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as ScriptItem);
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  }, (err) => {
    console.warn("Firestore scripts listener warning:", err);
  });
}

export function subscribeSetupCloud(callback: (apps: SetupCloudApp[]) => void) {
  const colRef = collection(db, 'setup_cloud');
  return onSnapshot(colRef, (snapshot) => {
    const items: SetupCloudApp[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as SetupCloudApp);
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  }, (err) => {
    console.warn("Firestore setup_cloud listener warning:", err);
  });
}

export function subscribeServerCloud(callback: (servers: ServerCloudItem[]) => void) {
  const colRef = collection(db, 'server_cloud');
  return onSnapshot(colRef, (snapshot) => {
    const items: ServerCloudItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as ServerCloudItem);
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  }, (err) => {
    console.warn("Firestore server_cloud listener warning:", err);
  });
}

export function subscribeGuides(callback: (guides: GuideItem[]) => void) {
  const colRef = collection(db, 'guides');
  return onSnapshot(colRef, (snapshot) => {
    const items: GuideItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as GuideItem);
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  }, (err) => {
    console.warn("Firestore guides listener warning:", err);
  });
}

export function subscribeCloudPhoneSettings(callback: (settings: CloudPhoneProSettings) => void) {
  const docRef = doc(db, 'settings', 'cloudPhonePro');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as CloudPhoneProSettings);
    } else {
      callback(DEFAULT_CLOUD_PHONE_SETTINGS);
    }
  }, (err) => {
    console.warn("Firestore cloudPhoneSettings listener warning:", err);
    callback(DEFAULT_CLOUD_PHONE_SETTINGS);
  });
}

export function subscribeGetKeySettings(callback: (settings: GetKeySettings) => void) {
  const docRef = doc(db, 'settings', 'getKeySettings');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as GetKeySettings);
    } else {
      callback(DEFAULT_GET_KEY_SETTINGS);
    }
  }, (err) => {
    console.warn("Firestore getKeySettings listener warning:", err);
    callback(DEFAULT_GET_KEY_SETTINGS);
  });
}

// Admin Write Helper Operations

export async function saveHack(hack: Omit<RobloxHack, 'id'>, id?: string) {
  if (id) {
    const ref = doc(db, 'hacks', id);
    await updateDoc(ref, { ...hack });
  } else {
    const col = collection(db, 'hacks');
    await addDoc(col, { ...hack, createdAt: Date.now() });
  }
}

export async function deleteHack(id: string) {
  await deleteDoc(doc(db, 'hacks', id));
}

export async function saveScript(script: Omit<ScriptItem, 'id'>, id?: string) {
  if (id) {
    const ref = doc(db, 'scripts', id);
    await updateDoc(ref, { ...script });
  } else {
    const col = collection(db, 'scripts');
    await addDoc(col, { ...script, createdAt: Date.now() });
  }
}

export async function deleteScript(id: string) {
  await deleteDoc(doc(db, 'scripts', id));
}

export async function saveSetupCloudApp(app: Omit<SetupCloudApp, 'id'>, id?: string) {
  if (id) {
    const ref = doc(db, 'setup_cloud', id);
    await updateDoc(ref, { ...app });
  } else {
    const col = collection(db, 'setup_cloud');
    await addDoc(col, { ...app, createdAt: Date.now() });
  }
}

export async function deleteSetupCloudApp(id: string) {
  await deleteDoc(doc(db, 'setup_cloud', id));
}

export async function saveServerCloudItem(server: Omit<ServerCloudItem, 'id'>, id?: string) {
  if (id) {
    const ref = doc(db, 'server_cloud', id);
    await updateDoc(ref, { ...server });
  } else {
    const col = collection(db, 'server_cloud');
    await addDoc(col, { ...server, createdAt: Date.now() });
  }
}

export async function deleteServerCloudItem(id: string) {
  await deleteDoc(doc(db, 'server_cloud', id));
}

export async function saveGuide(guide: Omit<GuideItem, 'id'>, id?: string) {
  if (id) {
    const ref = doc(db, 'guides', id);
    await updateDoc(ref, { ...guide });
  } else {
    const col = collection(db, 'guides');
    await addDoc(col, { ...guide, createdAt: Date.now() });
  }
}

export async function deleteGuide(id: string) {
  await deleteDoc(doc(db, 'guides', id));
}

export async function updateCloudPhoneSettings(settings: CloudPhoneProSettings) {
  const docRef = doc(db, 'settings', 'cloudPhonePro');
  await setDoc(docRef, { ...settings, updatedAt: Date.now() });
}

export async function updateGetKeySettings(settings: GetKeySettings) {
  const docRef = doc(db, 'settings', 'getKeySettings');
  await setDoc(docRef, { ...settings, updatedAt: Date.now() });
}

export async function saveSharedNote(note: NoteItem) {
  const cleanDocId = note.title.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '_');
  const docRef = doc(db, 'shared_notes', cleanDocId || `note_${Date.now()}`);
  await setDoc(docRef, { 
    ...note, 
    titleLower: note.title.trim().toLowerCase(),
    createdAt: note.createdAt || Date.now()
  });
}

export async function fetchSharedNoteByTitle(title: string): Promise<NoteItem | null> {
  const cleanDocId = title.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '_');
  try {
    const docRef = doc(db, 'shared_notes', cleanDocId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as NoteItem;
    }
  } catch (err) {
    console.warn("Doc lookup warning:", err);
  }

  try {
    const colRef = collection(db, 'shared_notes');
    const q = query(colRef, where('titleLower', '==', title.trim().toLowerCase()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as NoteItem;
    }
  } catch (err) {
    console.warn("Query lookup warning:", err);
  }

  return null;
}
