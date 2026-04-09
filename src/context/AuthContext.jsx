// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, firebaseConfigError } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseConfigError || !auth) { setLoading(false); return; }

    // Handle redirect result from Google sign-in on mobile
    getRedirectResult(auth).catch(() => {});

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred;
  };

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Google: try popup first, fall back to redirect (works on mobile/Safari)
  const signInWithGoogle = async () => {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // Popup blocked or unsupported → use redirect
      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return; // page will reload; redirect result handled in useEffect
      }
      throw err;
    }
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
