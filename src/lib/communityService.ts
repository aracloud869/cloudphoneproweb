import { 
  userDb, 
  userCol, 
  userDoc, 
  userGetDoc, 
  userGetDocs, 
  userSetDoc, 
  userAddDoc, 
  userUpdateDoc, 
  userDeleteDoc, 
  userOnSnapshot,
  userQuery,
  userWhere,
  userOrderBy
} from './userFirebase';
import { 
  UserProfile, 
  CommunityScript, 
  ScriptComment, 
  ScriptReport, 
  UserBanRecord, 
  BanAppeal 
} from '../types';

// 1. Community Scripts CRUD & Listener
export function subscribeCommunityScripts(callback: (scripts: CommunityScript[]) => void) {
  const colRef = userCol(userDb, 'community_scripts');
  return userOnSnapshot(colRef, (snapshot) => {
    const items: CommunityScript[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        code: data.code || '',
        description: data.description || '',
        authorUid: data.authorUid || '',
        authorName: data.authorName || 'Vô danh',
        authorAvatar: data.authorAvatar || '',
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
        dislikedBy: Array.isArray(data.dislikedBy) ? data.dislikedBy : [],
        reportsCount: data.reportsCount || 0,
        createdAt: data.createdAt || Date.now(),
      });
    });
    // Default sort by likes descending
    items.sort((a, b) => b.likes - a.likes || b.createdAt - a.createdAt);
    callback(items);
  }, (err) => {
    console.warn("Community scripts listener warning:", err);
    callback([]);
  });
}

export async function addCommunityScript(script: Omit<CommunityScript, 'id' | 'likes' | 'dislikes' | 'likedBy' | 'dislikedBy' | 'reportsCount' | 'createdAt'>) {
  const colRef = userCol(userDb, 'community_scripts');
  return await userAddDoc(colRef, {
    ...script,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    reportsCount: 0,
    createdAt: Date.now()
  });
}

export async function deleteCommunityScript(scriptId: string) {
  const docRef = userDoc(userDb, 'community_scripts', scriptId);
  return await userDeleteDoc(docRef);
}

export async function toggleLikeCommunityScript(scriptId: string, userUid: string) {
  const docRef = userDoc(userDb, 'community_scripts', scriptId);
  const snap = await userGetDoc(docRef);
  if (!snap.exists()) return;

  const data = snap.data();
  let likedBy: string[] = Array.isArray(data.likedBy) ? [...data.likedBy] : [];
  let dislikedBy: string[] = Array.isArray(data.dislikedBy) ? [...data.dislikedBy] : [];

  if (likedBy.includes(userUid)) {
    // Remove like
    likedBy = likedBy.filter(uid => uid !== userUid);
  } else {
    // Add like and remove dislike if present
    likedBy.push(userUid);
    dislikedBy = dislikedBy.filter(uid => uid !== userUid);
  }

  await userUpdateDoc(docRef, {
    likedBy,
    dislikedBy,
    likes: likedBy.length,
    dislikes: dislikedBy.length
  });
}

export async function buffCommunityScriptLikes(scriptId: string, additionalLikes: number) {
  const docRef = userDoc(userDb, 'community_scripts', scriptId);
  const snap = await userGetDoc(docRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const currentLikes = typeof data.likes === 'number' ? data.likes : 0;
  const newLikes = Math.max(0, currentLikes + additionalLikes);

  await userUpdateDoc(docRef, {
    likes: newLikes
  });
}

export async function toggleDislikeCommunityScript(scriptId: string, userUid: string) {
  const docRef = userDoc(userDb, 'community_scripts', scriptId);
  const snap = await userGetDoc(docRef);
  if (!snap.exists()) return;

  const data = snap.data();
  let likedBy: string[] = Array.isArray(data.likedBy) ? [...data.likedBy] : [];
  let dislikedBy: string[] = Array.isArray(data.dislikedBy) ? [...data.dislikedBy] : [];

  if (dislikedBy.includes(userUid)) {
    // Remove dislike
    dislikedBy = dislikedBy.filter(uid => uid !== userUid);
  } else {
    // Add dislike and remove like if present
    dislikedBy.push(userUid);
    likedBy = likedBy.filter(uid => uid !== userUid);
  }

  await userUpdateDoc(docRef, {
    likedBy,
    dislikedBy,
    likes: likedBy.length,
    dislikes: dislikedBy.length
  });
}

// 2. Comments CRUD & Listener
export function subscribeScriptComments(scriptId: string, callback: (comments: ScriptComment[]) => void) {
  const colRef = userCol(userDb, 'script_comments');
  const q = userQuery(colRef, userWhere('scriptId', '==', scriptId));
  
  return userOnSnapshot(q, (snapshot) => {
    const items: ScriptComment[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        scriptId: data.scriptId,
        authorUid: data.authorUid || '',
        authorName: data.authorName || 'Thành viên',
        authorAvatar: data.authorAvatar || '',
        content: data.content || '',
        createdAt: data.createdAt || Date.now(),
        parentId: data.parentId || null,
        likes: data.likes || 0,
        likedBy: Array.isArray(data.likedBy) ? data.likedBy : []
      });
    });
    items.sort((a, b) => a.createdAt - b.createdAt);
    callback(items);
  }, (err) => {
    console.warn("Comments listener warning:", err);
    callback([]);
  });
}

export async function addScriptComment(comment: Omit<ScriptComment, 'id' | 'likes' | 'likedBy' | 'createdAt'>) {
  const colRef = userCol(userDb, 'script_comments');
  return await userAddDoc(colRef, {
    ...comment,
    likes: 0,
    likedBy: [],
    createdAt: Date.now()
  });
}

export async function toggleLikeComment(commentId: string, userUid: string) {
  const docRef = userDoc(userDb, 'script_comments', commentId);
  const snap = await userGetDoc(docRef);
  if (!snap.exists()) return;

  const data = snap.data();
  let likedBy: string[] = Array.isArray(data.likedBy) ? [...data.likedBy] : [];

  if (likedBy.includes(userUid)) {
    likedBy = likedBy.filter(uid => uid !== userUid);
  } else {
    likedBy.push(userUid);
  }

  await userUpdateDoc(docRef, {
    likedBy,
    likes: likedBy.length
  });
}

// 3. Reports
export function subscribeScriptReports(callback: (reports: ScriptReport[]) => void) {
  const colRef = userCol(userDb, 'script_reports');
  return userOnSnapshot(colRef, (snapshot) => {
    const items: ScriptReport[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as ScriptReport);
    });
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  }, (err) => {
    console.warn("Reports listener warning:", err);
    callback([]);
  });
}

export async function addScriptReport(report: Omit<ScriptReport, 'id' | 'createdAt'>) {
  const colRef = userCol(userDb, 'script_reports');
  const res = await userAddDoc(colRef, {
    ...report,
    createdAt: Date.now()
  });

  // Increment report count on script doc
  try {
    const scriptDocRef = userDoc(userDb, 'community_scripts', report.scriptId);
    const snap = await userGetDoc(scriptDocRef);
    if (snap.exists()) {
      const current = snap.data().reportsCount || 0;
      await userUpdateDoc(scriptDocRef, { reportsCount: current + 1 });
    }
  } catch (e) {
    console.warn("Error incrementing report count:", e);
  }

  return res;
}

export async function deleteScriptReport(reportId: string) {
  const docRef = userDoc(userDb, 'script_reports', reportId);
  return await userDeleteDoc(docRef);
}

// 4. User Profiles
export function subscribeUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const docRef = userDoc(userDb, 'users', uid);
  return userOnSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProfile);
    } else {
      callback(null);
    }
  });
}

export async function saveUserProfile(profile: UserProfile) {
  const docRef = userDoc(userDb, 'users', profile.uid);
  return await userSetDoc(docRef, profile, { merge: true });
}

// 5. Bans System
export function subscribeUserBans(callback: (bans: UserBanRecord[]) => void) {
  const colRef = userCol(userDb, 'user_bans');
  return userOnSnapshot(colRef, (snapshot) => {
    const items: UserBanRecord[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as UserBanRecord);
    });
    items.sort((a, b) => b.bannedAt - a.bannedAt);
    callback(items);
  }, (err) => {
    console.warn("Bans listener warning:", err);
    callback([]);
  });
}

export async function banUserRecord(ban: Omit<UserBanRecord, 'id' | 'bannedAt' | 'expiresAt'>) {
  const colRef = userCol(userDb, 'user_bans');
  const bannedAt = Date.now();
  const expiresAt = bannedAt + (ban.banDays * 24 * 60 * 60 * 1000);

  return await userAddDoc(colRef, {
    ...ban,
    bannedAt,
    expiresAt
  });
}

export async function unbanUserRecord(banId: string) {
  const docRef = userDoc(userDb, 'user_bans', banId);
  return await userDeleteDoc(docRef);
}

// 6. Ban Appeals
export function subscribeBanAppeals(callback: (appeals: BanAppeal[]) => void) {
  const colRef = userCol(userDb, 'ban_appeals');
  return userOnSnapshot(colRef, (snapshot) => {
    const items: BanAppeal[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as BanAppeal);
    });
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  }, (err) => {
    console.warn("Ban appeals listener warning:", err);
    callback([]);
  });
}

export async function submitBanAppealRecord(appeal: Omit<BanAppeal, 'id' | 'createdAt' | 'status'>) {
  const colRef = userCol(userDb, 'ban_appeals');
  return await userAddDoc(colRef, {
    ...appeal,
    createdAt: Date.now(),
    status: 'pending'
  });
}

export async function updateBanAppealStatus(appealId: string, status: 'reviewed' | 'approved' | 'rejected') {
  const docRef = userDoc(userDb, 'ban_appeals', appealId);
  return await userUpdateDoc(docRef, { status });
}
