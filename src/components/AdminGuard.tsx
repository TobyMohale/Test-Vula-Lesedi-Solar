import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, User, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { Shield, AlertCircle, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function AdminGuard({ children, theme, toggleTheme }: AdminGuardProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Credentials-based emergency auth fallback
  const [localAuthenticated, setLocalAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("vula_lesedi_admin_authenticated") === "true";
  });

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Monitor Firebase Auth state change (Global Session Initialization)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Strict verification: only allow lesedisolarandbackup@gmail.com
          if (user.email === "lesedisolarandbackup@gmail.com") {
            setFirebaseUser(user);
            setAuthError(null);
          } else {
            // Immediately sign out unauthorized users
            signOut(auth);
            setFirebaseUser(null);
            setAuthError("Access Denied: This Google account is not authorized to access the administrator panel.");
          }
        } else {
          setFirebaseUser(null);
        }
        setIsInitializing(false);
      },
      (error) => {
        console.error("Firebase auth state observer error:", error);
        setIsInitializing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google Sign-In Error Object:", err);
      
      const errorCode = err.code || "";
      const errorMessage = err.message || "";
      
      // Strict user-friendly mapping for 401: invalid_client / configuration errors
      if (
        errorCode.includes("invalid-oauth-client-id") || 
        errorCode.includes("configuration-not-found") ||
        errorCode.includes("invalid-api-key") ||
        errorMessage.includes("401") ||
        errorMessage.includes("invalid_client")
      ) {
        setAuthError(
          "The Google Authentication client is currently misconfigured or undergoes setup. " +
          "Please log in using the secure emergency credential fields below."
        );
      } else if (errorCode === "auth/popup-blocked") {
        setAuthError("Sign-in window was blocked by your browser. Please enable popups and try again.");
      } else if (errorCode === "auth/popup-closed-by-user") {
        setAuthError("Sign-in process was closed before completion. Please try again.");
      } else {
        setAuthError("An unexpected authentication error occurred. Please use your credentials below.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailClean = adminEmail.trim().toLowerCase();
    const passwordClean = adminPassword.trim();

    if (emailClean === "lesedisolarandbackup@gmail.com" && passwordClean === "Vincent@1987") {
      setLocalAuthenticated(true);
      localStorage.setItem("vula_lesedi_admin_authenticated", "true");
      setAuthError(null);
    } else {
      setAuthError("Invalid administrator credentials. Please check your email and password.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out from Firebase:", e);
    }
    setLocalAuthenticated(false);
    localStorage.removeItem("vula_lesedi_admin_authenticated");
    setFirebaseUser(null);
    setAdminEmail("");
    setAdminPassword("");
  };

  const isUserAuthenticated = 
    (firebaseUser !== null && firebaseUser.email === "lesedisolarandbackup@gmail.com") || 
    localAuthenticated;

  // Render a polished loading screen during Firebase Session Initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-[#16a34a] shadow-lg shadow-green-500/10">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow">
              <Loader2 className="w-4 h-4 text-[#16a34a] animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Initializing Secure Gateway
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Establishing encrypted administrator handshake...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the Login screen if not authenticated
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-[#16a34a] rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/10">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Vula Lesedi
          </h2>
          <p className="mt-2 text-center text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Administrator Gateway
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl sm:px-10">
            {authError && (
              <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 leading-normal">
                  {authError}
                </p>
              </div>
            )}

            {/* Google OAuth Login Block */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSigningIn ? (
                  <Loader2 className="w-5 h-5 text-[#16a34a] animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38C17.15,14.9 16.22,16.14 14.8,17.1l2.3,1.8c2.14,-1.98 3.57,-4.9 3.57,-8.3C22.2,10.6 21.35,11.1 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.7c2.43,0 4.47,-0.8 5.96,-2.2l-2.3,-1.8c-0.64,0.44 -1.48,0.7 -2.46,0.7c-2.34,0 -4.33,-1.58 -5.04,-3.7L5.8,15.5c1.48,2.94 4.54,4.9 8.2,4.9z" fill="#34A853" />
                      <path d="M6.96,13.7c-0.18,-0.54 -0.28,-1.12 -0.28,-1.7s0.1,-1.16 0.28,-1.7L4.62,8.5C4.02,9.7 3.6,11.06 3.6,12.5s0.42,2.8 1.02,4l2.34,-1.8z" fill="#FBBC05" />
                      <path d="M12,6.9c1.3,0 2.48,0.45 3.4,1.3l2.5,-2.5C16.4,4.2 14.4,3.3 12,3.3c-3.66,0 -6.72,1.96 -8.2,4.9L6.14,10C6.85,7.9 8.84,6.9 12,6.9z" fill="#EA4335" />
                    </g>
                  </svg>
                )}
                <span>{isSigningIn ? "Authorizing with Google..." : "Sign in with Google"}</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            {/* Backup Credentials Login Form */}
            <form onSubmit={handleCredentialLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] dark:text-white transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Security Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] dark:text-white transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-xs font-black uppercase tracking-wider text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-150"
                >
                  Verify Credentials
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Clone children, passing down any expected props, such as custom logout handler if needed
  // Or provide an Auth Context. Let's pass the props or simply render as is.
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            // Provide a prop-level override to handle logouts securely from the dashboard
            onLogout: handleLogout,
          });
        }
        return child;
      })}
    </>
  );
}
