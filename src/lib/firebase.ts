import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom scopes if needed (openid, email, profile are added by default by GoogleAuthProvider)
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.addScope("openid");

// Ensure custom parameter for client ID or other options if required
googleProvider.setCustomParameters({
  prompt: "select_account"
});
