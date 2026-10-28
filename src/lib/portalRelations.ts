import { RoboticsLesson } from "./curriculumData";

/**
 * ============================================================================
 * ROBOBEE INNOVATORS — UNIFIED RELATIONAL DATA SCHEMA & ADAPTER LAYER
 * ============================================================================
 * Connects Competitions/Projects <-> Tasks/Sprints <-> Lab Inventory/Checkouts
 * <-> Treasury Ledger/Expenses <-> Class Schedules & Curriculum BOM Kits.
 * Preserves 100% backward compatibility with all existing Firestore documents.
 */

export type TaskStatusStage = "backlog" | "in_progress" | "in_review" | "completed";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface ReservedHardwareItem {
  partId: string;
  partName: string;
  quantity: number;
  checkoutId?: string;
}

export interface RelationalTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Member email or "GENERAL"
  assignedToName?: string;
  assignedBy?: string;
  // Legacy status ("pending" | "completed" | "Done") + normalized stage
  status: string;
  stage: TaskStatusStage;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  // Relational Foreign Keys
  competitionId?: string;
  competitionName?: string;
  projectId?: string;
  projectName?: string;
  reservedParts?: ReservedHardwareItem[];
  createdAt?: any;
  completedAt?: any;
  completedBy?: string;
}

export type InventoryCategory =
  | "Microcontrollers"
  | "Sensors"
  | "Motors & Actuators"
  | "Power & Batteries"
  | "Displays & Audio"
  | "Wireless & IoT"
  | "Mechanical Hardware"
  | "Prototyping & Passives"
  | "Tools & Equipment"
  | "General"
  | string;

export interface RelationalInventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  price: number;
  minThreshold: number;
  specs?: string;
  pinoutNote?: string;
  locationBin?: string;
  addedBy?: string;
  addedAt?: any;
}

export interface RelationalCheckout {
  id: string;
  partId: string;
  partName: string;
  category: string;
  quantity: number;
  checkedOutBy: string;
  userId?: string;
  userName: string;
  checkedOutAt?: any;
  expectedReturnDate?: string; // YYYY-MM-DD
  status: "Checked Out" | "Returned" | "Overdue" | string;
  notes?: string;
  // Relational Foreign Keys
  competitionId?: string;
  competitionName?: string;
  taskId?: string;
  taskTitle?: string;
  isOverdue?: boolean;
  daysCheckedOut?: number;
}

export type BudgetLineCategory =
  | "Hardware & Sensors"
  | "Lab Requisitions & Sensors"
  | "Competition Registration & Travel"
  | "Mechanical & PCB Fabrication"
  | "Lab Operations & Tooling"
  | "Sponsorship / Grant Inflow";

export interface TreasuryLedgerEntry {
  id: string;
  title: string;
  entryType: "expense" | "income";
  amount: number;
  budgetLine: BudgetLineCategory;
  status: "pending_approval" | "approved" | "rejected";
  submittedBy: string;
  submittedByEmail?: string;
  submittedByName?: string;
  date: string;
  method?: string;
  txnId?: string;
  receiptUrl?: string;
  notes?: string;
  // Relational Foreign Keys
  competitionId?: string;
  competitionName?: string;
  partId?: string;
  partName?: string;
  approvedBy?: string;
}

export interface ProjectVaultAsset {
  id: string;
  title: string;
  assetType: "schematic" | "firmware" | "cad" | "cad_3d" | "documentation";
  url: string;
  version?: string;
  fileFormat?: string;
  competitionId?: string;
  competitionName?: string;
  uploadedBy?: string;
  uploadedByUid?: string;
  uploadedByName?: string;
  createdAt?: any;
  notes?: string;
}

export type SubTeamRoleType =
  | "Team Lead"
  | "Firmware Engineer"
  | "Hardware Fabricator"
  | "CAD & Documentation Lead"
  | "Strategist & Driver";

export const SUB_TEAM_ROLES: SubTeamRoleType[] = [
  "Team Lead",
  "Firmware Engineer",
  "Hardware Fabricator",
  "CAD & Documentation Lead",
  "Strategist & Driver",
];

export interface SubTeamMemberRole {
  id: string;
  competitionId: string;
  competitionName: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  role: SubTeamRoleType;
  subTeamName?: string;
  buildLogNote?: string;
  updatedAt?: any;
}

export type CustomSlideBlockType =
  | "text"
  | "diagram"
  | "code"
  | "warning"
  | "quiz"
  | "video";

export type SlideBlockType = CustomSlideBlockType;

export interface CustomSlideBlock {
  id: string;
  lessonId: string;
  type?: CustomSlideBlockType;
  blockType?: CustomSlideBlockType;
  title: string;
  content: string;
  codeLanguage?: string;
  codeLang?: string;
  mediaUrl?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswerIndex?: number;
  pinHighlight?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  createdBy?: string;
}

/**
 * Normalizes a legacy or new Firestore task document into a RelationalTask.
 * Supports both normalizeTask(rawObj) and normalizeTask(id, dataObj).
 */
export function normalizeTask(idOrRaw: any, maybeData?: any): RelationalTask {
  const raw = maybeData ? { id: idOrRaw, ...maybeData } : idOrRaw || {};
  const rawStatus = String(raw.status || "pending").toLowerCase();
  let stage: TaskStatusStage = raw.stage || "backlog";

  if (!raw.stage) {
    if (rawStatus === "completed" || rawStatus === "done") {
      stage = "completed";
    } else if (rawStatus === "in_review" || rawStatus === "review") {
      stage = "in_review";
    } else if (rawStatus === "in_progress" || rawStatus === "active") {
      stage = "in_progress";
    } else {
      stage = "backlog";
    }
  }

  return {
    id: raw.id || "",
    title: raw.title || "Untitled Task",
    description: raw.description || "",
    assignedTo: raw.assignedTo || "GENERAL",
    assignedToName: raw.assignedToName || undefined,
    assignedBy: raw.assignedBy || "",
    status: stage === "completed" ? "completed" : raw.status || "pending",
    stage,
    priority: raw.priority || "Medium",
    dueDate: raw.dueDate || undefined,
    competitionId: raw.competitionId || undefined,
    competitionName: raw.competitionName || undefined,
    projectId: raw.projectId || undefined,
    projectName: raw.projectName || undefined,
    reservedParts: Array.isArray(raw.reservedParts) ? raw.reservedParts : [],
    createdAt: raw.createdAt,
    completedAt: raw.completedAt,
    completedBy: raw.completedBy,
  };
}

/**
 * Normalizes a Firestore inventory document with stock threshold metadata.
 * Supports both normalizeInventoryItem(rawObj) and normalizeInventoryItem(id, dataObj).
 */
export function normalizeInventoryItem(idOrRaw: any, maybeData?: any): RelationalInventoryItem {
  const raw = maybeData ? { id: idOrRaw, ...maybeData } : idOrRaw || {};
  return {
    id: raw.id || "",
    name: raw.name || "Unnamed Component",
    category: raw.category || "General",
    quantity: typeof raw.quantity === "number" ? raw.quantity : Number(raw.quantity) || 0,
    price: typeof raw.price === "number" ? raw.price : Number(raw.price) || 0,
    minThreshold: typeof raw.minThreshold === "number" ? raw.minThreshold : 3,
    specs: raw.specs || "",
    pinoutNote: raw.pinoutNote || "",
    locationBin: raw.locationBin || "Main Lab Rack",
    addedBy: raw.addedBy,
    addedAt: raw.addedAt,
  };
}

/**
 * Normalizes a hardware checkout document and computes overdue status.
 * Supports both normalizeCheckout(rawObj) and normalizeCheckout(id, dataObj).
 */
export function normalizeCheckout(idOrRaw: any, maybeData?: any): RelationalCheckout {
  const raw = maybeData ? { id: idOrRaw, ...maybeData } : idOrRaw || {};
  const now = Date.now();
  let checkedOutMs = now;

  if (raw.checkedOutAt) {
    if (typeof raw.checkedOutAt.toMillis === "function") {
      checkedOutMs = raw.checkedOutAt.toMillis();
    } else if (raw.checkedOutAt.seconds) {
      checkedOutMs = raw.checkedOutAt.seconds * 1000;
    } else {
      const parsed = new Date(raw.checkedOutAt).getTime();
      if (!isNaN(parsed)) checkedOutMs = parsed;
    }
  }

  const daysCheckedOut = Math.max(0, Math.floor((now - checkedOutMs) / (1000 * 60 * 60 * 24)));

  let isOverdue = false;
  if (raw.expectedReturnDate) {
    const dueMs = new Date(raw.expectedReturnDate + "T23:59:59").getTime();
    if (!isNaN(dueMs) && now > dueMs) {
      isOverdue = true;
    }
  } else if (daysCheckedOut > 7) {
    isOverdue = true;
  }

  return {
    id: raw.id || "",
    partId: raw.partId || "",
    partName: raw.partName || "Component",
    category: raw.category || "General",
    quantity: typeof raw.quantity === "number" ? raw.quantity : 1,
    checkedOutBy: raw.checkedOutBy || "",
    userId: raw.userId,
    userName: raw.userName || raw.checkedOutBy || "Member",
    checkedOutAt: raw.checkedOutAt,
    expectedReturnDate: raw.expectedReturnDate || undefined,
    status: isOverdue ? "Overdue" : raw.status || "Checked Out",
    notes: raw.notes || "",
    competitionId: raw.competitionId || undefined,
    competitionName: raw.competitionName || undefined,
    taskId: raw.taskId || undefined,
    taskTitle: raw.taskTitle || undefined,
    isOverdue,
    daysCheckedOut,
  };
}

export interface BOMVerificationResultItem {
  partName: string;
  requiredQty: number;
  availableInLab: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

/**
 * Cross-checks a curriculum lesson's Bill of Materials (BOM) against live lab inventory.
 */
export function verifyLessonBOMStock(
  bomInput: any[] | RoboticsLesson,
  inventory: RelationalInventoryItem[]
): BOMVerificationResultItem[] {
  const rawList: any[] = Array.isArray(bomInput)
    ? bomInput
    : (bomInput as any)?.physicalBuildPack?.componentList ||
      (bomInput as any)?.physicalBuildPack?.billOfMaterials ||
      (bomInput as any)?.physicalBuild?.billOfMaterials ||
      [];

  const stopWords = new Set(["and", "the", "for", "with", "pack", "set", "module", "board", "sensor", "jumper", "wires", "wire"]);

  return rawList.map((bomItem: any) => {
    const partName = String(bomItem.name || bomItem.item || bomItem.component || "Component");
    const requiredQty = Number(bomItem.quantity) || 1;
    const cleanTarget = partName.toLowerCase();
    const keywords = cleanTarget
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    const matched = inventory.find((inv) => {
      const invName = inv.name.toLowerCase();
      if (invName.includes(cleanTarget) || cleanTarget.includes(invName)) return true;
      return keywords.some((kw) => invName.includes(kw));
    });

    if (!matched || matched.quantity <= 0) {
      return {
        partName,
        requiredQty,
        availableInLab: 0,
        status: "out_of_stock" as const,
      };
    }

    const availableInLab = matched.quantity;
    const status =
      availableInLab > matched.minThreshold
        ? ("in_stock" as const)
        : ("low_stock" as const);

    return {
      partName,
      requiredQty,
      availableInLab,
      status,
    };
  });
}

export const STANDARD_INVENTORY_CATEGORIES: InventoryCategory[] = [
  "Microcontrollers",
  "Sensors",
  "Motors & Actuators",
  "Power & Batteries",
  "Displays & Audio",
  "Wireless & IoT",
  "Mechanical Hardware",
  "Prototyping & Passives",
  "Tools & Equipment",
  "General",
];

export const INVENTORY_CATEGORIES = STANDARD_INVENTORY_CATEGORIES;

export const BUDGET_LINE_CATEGORIES: BudgetLineCategory[] = [
  "Hardware & Sensors",
  "Lab Requisitions & Sensors",
  "Competition Registration & Travel",
  "Mechanical & PCB Fabrication",
  "Lab Operations & Tooling",
  "Sponsorship / Grant Inflow",
];
