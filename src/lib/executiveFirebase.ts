import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBHM3w-jOVtKWcgjFNny5ucCn4pYLfOR_w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "smart-water-planting.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "smart-water-planting",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "smart-water-planting.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "648378153439",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:648378153439:web:146d042b2be17066b7ac6a",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db: Firestore = getFirestore(app, "robobee-db");

let authPromise: Promise<UserCredential> | null = null;

/**
 * Ensures the server session is authenticated as the designated RoboBee Agent Admin.
 * This guarantees all subsequent Firestore mutations on `robobee-db` pass security rules.
 */
export async function ensureAgentAdminAuth(): Promise<void> {
  if (auth.currentUser && auth.currentUser.email === "robobee.agent@robobeeinnovators.org") {
    return;
  }

  const agentEmail = process.env.FIREBASE_AGENT_EMAIL || "robobee.agent@robobeeinnovators.org";
  const agentPassword = process.env.FIREBASE_AGENT_PASSWORD || "RoboBeeAgentSecret2026!#Operations";

  if (!authPromise) {
    authPromise = signInWithEmailAndPassword(auth, agentEmail, agentPassword);
  }

  try {
    await authPromise;
  } catch (err) {
    authPromise = null;
    console.error("[ExecutiveFirebase] Authentication failed:", err);
    throw err;
  }
}

// ============================================================================
// 1. PUBLIC SITE CMS OPERATIONS
// ============================================================================

export interface NewAchievementInput {
  title: string;
  year?: string;
  description: string;
  category?: string;
  milestoneType?: string;
  image?: string;
  imageFit?: "contain" | "cover";
}

export async function opAddAchievement(input: NewAchievementInput) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "achievements");
  const docData = {
    title: input.title.trim(),
    year: input.year?.trim() || new Date().getFullYear().toString(),
    description: input.description.trim(),
    category: input.category || input.milestoneType || "International Milestone",
    milestoneType: input.category || input.milestoneType || "International Milestone",
    image: input.image || "",
    imageFit: input.imageFit || "contain",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "RoboBee AI Autonomous Operator",
  };
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

export async function opDeleteAchievement(achievementId: string) {
  await ensureAgentAdminAuth();
  await deleteDoc(doc(db, "achievements", achievementId));
  return { id: achievementId, deleted: true };
}

export interface NewLeaderInput {
  name: string;
  role: string;
  bio?: string;
  group?: "leader" | "core";
  image?: string;
}

export async function opAddTeamLeader(input: NewLeaderInput) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "leaders");
  const docData = {
    name: input.name.trim(),
    role: input.role.trim(),
    bio: (input.bio || "").trim(),
    group: input.group || "core",
    image: input.image || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "RoboBee AI Autonomous Operator",
  };
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

export interface NewProjectInput {
  title: string;
  description: string;
  status?: string;
  image?: string;
}

export async function opAddFeaturedProject(input: NewProjectInput) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "projects");
  const docData = {
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status || "Building in the lab",
    image: input.image || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "RoboBee AI Autonomous Operator",
  };
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

export async function opAddMarqueeAvatar(imageUrl: string) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "marquee");
  const docData = {
    image: imageUrl.trim(),
    createdAt: new Date(),
    createdBy: "RoboBee AI Autonomous Operator",
  };
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

// ============================================================================
// 2. COMPETITIONS ARENA OPERATIONS
// ============================================================================

export interface CompetitionSegmentInput {
  id?: string;
  name: string;
  fee?: number;
  maxParticipants?: number;
  description?: string;
}

export interface LaunchCompetitionInput {
  name: string;
  date: string;
  location: string;
  description: string;
  visibility?: "public_and_members" | "members_only";
  purseBdt?: number;
  fee?: number;
  segments?: CompetitionSegmentInput[];
}

export async function opLaunchCompetition(input: LaunchCompetitionInput) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "competitions");

  const segments =
    input.segments && input.segments.length > 0
      ? input.segments.map((s, idx) => ({
          id: s.id || `seg_${Date.now()}_${idx}`,
          name: s.name.trim(),
          fee: Number(s.fee) || Number(input.fee) || 500,
          maxParticipants: Number(s.maxParticipants) || 20,
          description: s.description?.trim() || "",
        }))
      : [
          {
            id: `seg_${Date.now()}_1`,
            name: "Robo Challenge Segment",
            fee: Number(input.fee) || 500,
            maxParticipants: 20,
            description: "Standard robotics challenge segment",
          },
        ];

  const totalCapacity = segments.reduce((sum, s) => sum + s.maxParticipants, 0);
  const minFee = Math.min(...segments.map((s) => s.fee));

  const docData = {
    name: input.name.trim(),
    date: input.date,
    location: input.location.trim(),
    description: input.description.trim(),
    visibility: input.visibility || "public_and_members",
    purseBdt: Number(input.purseBdt) || 0,
    segments: segments,
    fee: minFee,
    maxParticipants: totalCapacity,
    status: "Upcoming",
    createdAt: serverTimestamp(),
    createdBy: "RoboBee AI Autonomous Operator",
  };

  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

// ============================================================================
// 3. HARDWARE & LAB PARTS OPERATIONS
// ============================================================================

export async function opApproveOrRejectPartRequest(
  requestId: string,
  decision: "approved" | "rejected",
  notes?: string
) {
  await ensureAgentAdminAuth();
  const reqRef = doc(db, "partRequests", requestId);
  const snap = await getDoc(reqRef);
  if (!snap.exists()) {
    throw new Error(`Part request #${requestId} does not exist.`);
  }

  const updates: Record<string, any> = {
    status: decision === "approved" ? "Approved" : "Rejected",
    reviewedAt: new Date(),
    reviewedBy: "RoboBee AI Operations Agent",
  };
  if (notes) updates.reviewNotes = notes;

  await updateDoc(reqRef, updates);
  return { id: requestId, ...snap.data(), ...updates };
}

export async function opUpdateInventoryStock(
  partId: string,
  quantityChange: number,
  notes?: string
) {
  await ensureAgentAdminAuth();
  const itemRef = doc(db, "inventory", partId);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) {
    throw new Error(`Inventory item #${partId} not found.`);
  }

  const currentQty = Number(snap.data()?.quantity || 0);
  const newQty = Math.max(0, currentQty + quantityChange);

  await updateDoc(itemRef, {
    quantity: newQty,
    updatedAt: new Date(),
    lastUpdatedBy: "RoboBee AI Operations Agent",
    ...(notes ? { notes } : {}),
  });

  return { id: partId, partName: snap.data()?.name, previousQty: currentQty, newQuantity: newQty };
}

// ============================================================================
// 4. TREASURY & FINANCIAL LEDGER OPERATIONS
// ============================================================================

export interface TreasuryEntryInput {
  title: string;
  type: "expense" | "income";
  category: string;
  amount: number;
  competitionId?: string;
  notes?: string;
}

export async function opRecordTreasuryEntry(input: TreasuryEntryInput) {
  await ensureAgentAdminAuth();
  const coll = collection(db, "treasury_expenses");
  const docData = {
    title: input.title.trim(),
    type: input.type,
    category: input.category.trim(),
    amount: Number(input.amount) || 0,
    competitionId: input.competitionId || "",
    notes: (input.notes || "").trim(),
    date: new Date().toISOString(),
    createdAt: new Date(),
    createdBy: "RoboBee AI Operations Agent",
  };
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

// ============================================================================
// 5. MEMBER ROLE & ADMINISTRATION OPERATIONS
// ============================================================================

export async function opUpdateMemberRole(params: {
  emailOrUserId: string;
  role: "admin" | "member" | "pending";
  roleTitle?: string;
  customPermissions?: string[];
}) {
  await ensureAgentAdminAuth();
  const usersColl = collection(db, "users");

  let targetDocId = params.emailOrUserId;
  let targetDocRef = doc(db, "users", targetDocId);
  let snap = await getDoc(targetDocRef);

  if (!snap.exists()) {
    // Try searching by email
    const q = query(usersColl, where("email", "==", params.emailOrUserId.toLowerCase().trim()), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      targetDocId = querySnap.docs[0].id;
      targetDocRef = doc(db, "users", targetDocId);
      snap = querySnap.docs[0];
    } else {
      throw new Error(`Member with identifier "${params.emailOrUserId}" not found.`);
    }
  }

  const updates: Record<string, any> = {
    role: params.role,
    updatedAt: new Date(),
    roleAssignedBy: "RoboBee AI Operations Agent",
  };
  if (params.roleTitle) updates.roleTitle = params.roleTitle.trim();
  if (params.customPermissions) updates.permissions = params.customPermissions;

  await updateDoc(targetDocRef, updates);
  return {
    id: targetDocId,
    email: (snap.data()?.email || params.emailOrUserId) as string,
    role: params.role,
    roleTitle: params.roleTitle || "",
    ...updates,
  };
}

// ============================================================================
// 6. LIVE PLATFORM SUMMARY & SPRINT STATUS
// ============================================================================

export async function opGetPlatformStatusSummary() {
  await ensureAgentAdminAuth();

  const [achSnap, compSnap, projSnap, usersSnap, partReqSnap] = await Promise.all([
    getDocs(collection(db, "achievements")),
    getDocs(collection(db, "competitions")),
    getDocs(collection(db, "projects")),
    getDocs(collection(db, "users")),
    getDocs(collection(db, "partRequests")),
  ]);

  const upcomingCompetitions = compSnap.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    date: d.data().date,
    visibility: d.data().visibility || "public_and_members",
  }));

  const pendingPartRequests = partReqSnap.docs
    .filter((d) => (d.data().status || "Pending").toLowerCase() === "pending")
    .map((d) => ({
      id: d.id,
      partName: d.data().partName || d.data().projectName || "Hardware Part",
      requestedBy: d.data().requestedBy || "Member",
    }));

  return {
    totalAchievements: achSnap.size,
    totalCompetitions: compSnap.size,
    upcomingCompetitions,
    totalFeaturedProjects: projSnap.size,
    totalRegisteredMembers: usersSnap.size,
    pendingPartRequestsCount: pendingPartRequests.length,
    pendingPartRequests: pendingPartRequests.slice(0, 5),
  };
}
