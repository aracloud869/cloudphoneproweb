import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
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

const userFirebaseConfig = {
  apiKey: "AIzaSyCrjrUc-Xr0o6H8sxiNlaNwklv2ljP2BaE",
  authDomain: "cloudphone-1939d.firebaseapp.com",
  databaseURL: "https://cloudphone-1939d-default-rtdb.firebaseio.com",
  projectId: "cloudphone-1939d",
  storageBucket: "cloudphone-1939d.firebasestorage.app",
  messagingSenderId: "596711405546",
  appId: "1:596711405546:web:2535447d029bcbf948a493",
  measurementId: "G-CE1Z5PP16X"
};

// Initialize Second Firebase App specifically for User Accounts & Community Features
const userApp = !getApps().some(app => app.name === 'userApp')
  ? initializeApp(userFirebaseConfig, 'userApp')
  : getApp('userApp');

export const userAuth = getAuth(userApp);
export const userDb = getFirestore(userApp);

export { 
  userApp,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  collection as userCol,
  doc as userDoc,
  getDoc as userGetDoc,
  getDocs as userGetDocs,
  setDoc as userSetDoc,
  addDoc as userAddDoc,
  updateDoc as userUpdateDoc,
  deleteDoc as userDeleteDoc,
  onSnapshot as userOnSnapshot,
  query as userQuery,
  where as userWhere,
  orderBy as userOrderBy
};
export type { User };
