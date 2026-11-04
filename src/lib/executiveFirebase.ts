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
import { supabaseAdmin } from "./supabase";

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

// ============================================================================
// 7. PROJECT BOM & PROCUREMENT OPERATIONS (AUTONOMOUS WEBSITE OPERATOR)
// ============================================================================

export interface BOMComponentInput {
  id?: string;
  itemId?: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  source?: string;
  status?: string;
}

export interface CreateProjectBOMInput {
  name: string;
  taskId?: string | null;
  taskTitle?: string | null;
  studentName?: string | null;
  schoolName?: string | null;
  classGrade?: string | null;
  bomType?: "task_member" | "store_admin";
  items: BOMComponentInput[];
  submitAdminRequisition?: boolean;
  requisitionNotes?: string;
  requestedByName?: string;
  requestedByEmail?: string;
}

/**
 * Creates a Project BOM in Firestore ('projects' on 'robobee-db'),
 * syncs attachments and budget to the Supabase task (if linked),
 * and optionally submits an admin requisition to 'partRequests'.
 */
export async function opCreateProjectBOM(input: CreateProjectBOMInput) {
  await ensureAgentAdminAuth();

  const formattedItems = input.items.map((it, idx) => {
    const p = Math.max(0, Number(it.price) || 0);
    const q = Math.max(1, Number(it.quantity) || 1);
    return {
      id: it.id || `bom_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      ...(it.itemId ? { itemId: it.itemId } : {}),
      name: it.name.trim(),
      category: it.category || "General",
      price: p,
      quantity: q,
      totalCost: p * q,
      source: it.source || "Local Market",
      status: it.status || (input.submitAdminRequisition ? "Requested" : "Needed"),
    };
  });

  const totalBudget = formattedItems.reduce((acc, it) => acc + it.totalCost, 0);

  // 1. Insert Project into Firestore `projects`
  const projectData = {
    name: input.name.trim(),
    bom: formattedItems,
    bomType: input.bomType || "task_member",
    taskId: input.taskId || null,
    taskTitle: input.taskTitle || null,
    studentName: input.studentName || null,
    schoolName: input.schoolName || null,
    classGrade: input.classGrade || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "RoboBee AI Autonomous Operator",
    createdByName: input.requestedByName || "RoboBee AI Operator",
  };

  const projColl = collection(db, "projects");
  const docRef = await addDoc(projColl, projectData);
  const projectId = docRef.id;

  // 2. Sync to Supabase `tasks` if taskId is supplied
  if (input.taskId) {
    const attachments = [
      {
        type: "project_bom",
        projectId: projectId,
        projectName: input.name.trim(),
        totalCost: totalBudget,
        itemsCount: formattedItems.length,
        items: formattedItems,
      },
    ];

    try {
      await supabaseAdmin
        .from("tasks")
        .update({
          budget_bdt: totalBudget,
          attachments: attachments,
          project_id: projectId,
        })
        .eq("id", input.taskId);
    } catch (tErr) {
      console.warn("[ExecutiveFirebase] Supabase task sync warning:", tErr);
    }

    // Mirror to Firestore tasks if exists
    try {
      await updateDoc(doc(db, "tasks", input.taskId), {
        budget_bdt: totalBudget,
        attachments: attachments,
        projectId: projectId,
        updatedAt: new Date().toISOString(),
      });
    } catch {}
  }

  // 3. Submit Requisition to Admin `partRequests` if enabled
  let requisitionId: string | null = null;
  if (input.submitAdminRequisition !== false && formattedItems.length > 0) {
    const reqData = {
      type: "bom_procurement",
      projectId: projectId,
      projectName: input.name.trim(),
      items: formattedItems,
      itemsCount: formattedItems.length,
      totalCost: totalBudget,
      notes: input.requisitionNotes || `Autonomous requisition for ${input.name}`,
      requestedBy: input.requestedByName || "RoboBee AI Operations Agent",
      requestedByEmail: input.requestedByEmail || "robobee.agent@robobeeinnovators.org",
      requestedByUid: "agent_admin",
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    const reqColl = collection(db, "partRequests");
    const reqRef = await addDoc(reqColl, reqData);
    requisitionId = reqRef.id;
  }

  return {
    projectId,
    name: input.name.trim(),
    bomType: input.bomType || "task_member",
    totalBudget,
    itemsCount: formattedItems.length,
    items: formattedItems,
    taskId: input.taskId || null,
    taskTitle: input.taskTitle || null,
    requisitionId,
  };
}

/**
 * Appends components to an existing project BOM and synchronizes task attachments.
 */
export async function opAddComponentsToProjectBOM(
  projectId: string,
  newItems: BOMComponentInput[],
  autoSubmitRequisition: boolean = true
) {
  await ensureAgentAdminAuth();
  const projRef = doc(db, "projects", projectId);
  const snap = await getDoc(projRef);
  if (!snap.exists()) {
    throw new Error(`Project #${projectId} not found.`);
  }

  const existingBOM: any[] = Array.isArray(snap.data()?.bom) ? snap.data().bom : [];
  const formattedNew = newItems.map((it, idx) => {
    const p = Math.max(0, Number(it.price) || 0);
    const q = Math.max(1, Number(it.quantity) || 1);
    return {
      id: it.id || `bom_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      ...(it.itemId ? { itemId: it.itemId } : {}),
      name: it.name.trim(),
      category: it.category || "General",
      price: p,
      quantity: q,
      totalCost: p * q,
      source: it.source || "Local Market",
      status: autoSubmitRequisition ? "Requested" : "Needed",
    };
  });

  const updatedBOM = [...existingBOM, ...formattedNew];
  const newTotal = updatedBOM.reduce((sum, it) => sum + (Number(it.totalCost) || 0), 0);

  await updateDoc(projRef, {
    bom: updatedBOM,
    updatedAt: new Date().toISOString(),
  });

  const taskId = snap.data()?.taskId;
  if (taskId) {
    const attachments = [
      {
        type: "project_bom",
        projectId: projectId,
        projectName: snap.data()?.name || "Project BOM",
        totalCost: newTotal,
        itemsCount: updatedBOM.length,
        items: updatedBOM,
      },
    ];
    await supabaseAdmin
      .from("tasks")
      .update({
        budget_bdt: newTotal,
        attachments,
      })
      .eq("id", taskId);
  }

  let requisitionId = null;
  if (autoSubmitRequisition && formattedNew.length > 0) {
    const reqTotal = formattedNew.reduce((sum, it) => sum + (Number(it.totalCost) || 0), 0);
    const reqRef = await addDoc(collection(db, "partRequests"), {
      type: "bom_procurement",
      projectId,
      projectName: snap.data()?.name || "Project",
      items: formattedNew,
      itemsCount: formattedNew.length,
      totalCost: reqTotal,
      notes: `Autonomous addition of ${formattedNew.length} parts to ${snap.data()?.name}`,
      requestedBy: "RoboBee AI Operations Agent",
      requestedByEmail: "robobee.agent@robobeeinnovators.org",
      requestedByUid: "agent_admin",
      requestedAt: new Date().toISOString(),
      status: "pending",
    });
    requisitionId = reqRef.id;
  }

  return {
    projectId,
    projectName: snap.data()?.name,
    addedItemsCount: formattedNew.length,
    totalItemsCount: updatedBOM.length,
    newTotalCost: newTotal,
    requisitionId,
  };
}

/**
 * Retrieves a single project BOM from Firestore.
 */
export async function opGetProjectBOM(projectId: string) {
  await ensureAgentAdminAuth();
  const projRef = doc(db, "projects", projectId);
  const snap = await getDoc(projRef);
  if (!snap.exists()) {
    throw new Error(`Project #${projectId} not found.`);
  }
  return { id: snap.id, ...snap.data() };
}

/**
 * Searches conversations, messages, and sprint tasks across channels.
 */
export async function opFindConversationAndTask(queryStr: string) {
  const cleanQ = queryStr.trim().replace(/^[@+]/, "");
  const numericOnly = cleanQ.replace(/\D/g, "");

  let conv: any = null;
  if (numericOnly.length >= 7) {
    const { data } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select("*")
      .or(`phone_number.ilike.%${numericOnly}%,phone_number.ilike.%${cleanQ}%`)
      .limit(1)
      .maybeSingle();
    conv = data;
  }

  if (!conv && cleanQ) {
    const { data } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select("*")
      .or(`contact_name.ilike.%${cleanQ}%,school_name.ilike.%${cleanQ}%`)
      .limit(1)
      .maybeSingle();
    conv = data;
  }

  let messages: any[] = [];
  if (conv?.id) {
    const { data: msgs } = await supabaseAdmin
      .from("whatsapp_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false })
      .limit(30);
    messages = (msgs || []).reverse();
  }

  let tasks: any[] = [];
  if (conv?.id) {
    const { data: tList } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false });
    tasks = tList || [];
  } else if (cleanQ) {
    const { data: tList } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .or(`title.ilike.%${cleanQ}%,student_name.ilike.%${cleanQ}%,guardian_phone.ilike.%${numericOnly || cleanQ}%`)
      .limit(5);
    tasks = tList || [];
  }

  return {
    conversation: conv,
    messages,
    tasks,
  };
}
