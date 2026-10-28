"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

import { hasPermission, PermissionKey } from "@/lib/permissions";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: "admin" | "member" | "pending" | "declined" | null;
  signOut: () => Promise<void>;
  userData: any;
  canManage: (permission: PermissionKey | string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  signOut: async () => {},
  userData: null,
  canManage: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "member" | "pending" | "declined" | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let unsubscribeFirestore: () => void;
    let profileLoadTimeout: number | undefined;
    let hasReceivedAuthState = false;

    const authLoadTimeout = window.setTimeout(() => {
      if (!hasReceivedAuthState) {
        console.warn("Timed out while restoring the Firebase session. Showing sign-in instead.");
        setUser(null);
        setRole(null);
        setUserData(null);
        setLoading(false);
      }
    }, 8000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      hasReceivedAuthState = true;
      window.clearTimeout(authLoadTimeout);
      setUser(currentUser);
      if (currentUser) {
        profileLoadTimeout = window.setTimeout(() => {
          console.warn("Timed out while loading the member profile. Continuing with limited access.");
          setRole("pending");
          setUserData(null);
          setLoading(false);
        }, 8000);

        // Fetch user role dynamically from Firestore
        unsubscribeFirestore = onSnapshot(doc(db, "users", currentUser.uid), (userDoc) => {
          if (profileLoadTimeout) window.clearTimeout(profileLoadTimeout);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role as "admin" | "member" | "pending" | "declined");
            setUserData({ id: currentUser.uid, ...data });
          } else {
            // If the user signed up but doesn't have a doc yet, they are pending.
            // Usually we create this right after signup, but this is a fallback.
            setRole("pending");
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          if (profileLoadTimeout) window.clearTimeout(profileLoadTimeout);
          console.error("Error fetching user role:", error);
          setRole("pending");
          setLoading(false);
        });
      } else {
        if (profileLoadTimeout) window.clearTimeout(profileLoadTimeout);
        setRole(null);
        setUserData(null);
        setLoading(false);
        if (unsubscribeFirestore) unsubscribeFirestore();
      }
    });

    return () => {
      window.clearTimeout(authLoadTimeout);
      if (profileLoadTimeout) window.clearTimeout(profileLoadTimeout);
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const canManage = (permission: PermissionKey | string) => {
    if (role === "admin") return true;
    return hasPermission(userData, permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, signOut, userData, canManage }}>
      {children}
    </AuthContext.Provider>
  );
};
