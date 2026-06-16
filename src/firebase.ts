import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOpdGBB3aUje04RFQEPybyrzfOcA2HZmg",
  authDomain: "gen-lang-client-0207415067.firebaseapp.com",
  projectId: "gen-lang-client-0207415067",
  storageBucket: "gen-lang-client-0207415067.firebasestorage.app",
  messagingSenderId: "636533503535",
  appId: "1:636533503535:web:3a083cc04a28f76d2a78da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    if (error.code === 'auth/popup-blocked' || error.message?.includes('popup-blocked')) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      throw error;
    }
  }
};

export const checkRedirectLogin = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user;
  } catch (error) {
    console.error("Error getting redirect result", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};


