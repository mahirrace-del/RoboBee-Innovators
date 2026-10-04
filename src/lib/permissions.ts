export type PermissionKey =
  | "manage_store"
  | "manage_achievements"
  | "manage_competitions"
  | "manage_finance"
  | "manage_attendance"
  | "manage_members";

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  description: string;
}

export const PERMISSION_LIST: PermissionDefinition[] = [
  {
    key: "manage_store",
    label: "Store & Inventory",
    description: "Add, edit, delete parts in store inventory and review parts requests."
  },
  {
    key: "manage_achievements",
    label: "Achievements & Public Site",
    description: "Manage achievements, projects showcase, member marquee, and core team."
  },
  {
    key: "manage_competitions",
    label: "Competitions & Events",
    description: "Launch, edit, delete competitions and manage participants."
  },
  {
    key: "manage_attendance",
    label: "Attendance Management",
    description: "Create class sessions and record member attendance."
  },
  {
    key: "manage_finance",
    label: "Finance & Accounts",
    description: "Verify and manage bKash member fee payments."
  },
  {
    key: "manage_members",
    label: "Member Management",
    description: "Assign roles, approve recruits, and manage member profiles."
  }
];

export interface RolePreset {
  id: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: "store_manager",
    name: "Store Manager",
    description: "Full access to inventory, parts catalog, and parts requests.",
    permissions: ["manage_store"]
  },
  {
    id: "event_manager",
    name: "Competition & Event Manager",
    description: "Full access to launch, edit, and delete competitions and participant lists.",
    permissions: ["manage_competitions"]
  },
  {
    id: "content_manager",
    name: "Achievements & Content Manager",
    description: "Full access to manage achievements, projects, marquee, and team showcase.",
    permissions: ["manage_achievements"]
  },
  {
    id: "attendance_manager",
    name: "Attendance Manager",
    description: "Create class sessions and record attendance.",
    permissions: ["manage_attendance"]
  },
  {
    id: "finance_manager",
    name: "Finance Manager",
    description: "Review and verify bKash payments and club finances.",
    permissions: ["manage_finance"]
  },
  {
    id: "admin",
    name: "Full Administrator",
    description: "Unrestricted access to all club systems and controls.",
    permissions: [
      "manage_store",
      "manage_achievements",
      "manage_competitions",
      "manage_finance",
      "manage_attendance",
      "manage_members"
    ]
  },
  {
    id: "member",
    name: "Standard Member",
    description: "Default member access with no administrative privileges.",
    permissions: []
  }
];

/**
 * Check if a user has a specific permission.
 * Admins unconditionally have all permissions.
 */
export function hasPermission(userData: any, permission: PermissionKey | string): boolean {
  if (!userData) return false;
  
  // Full admins have all permissions
  if (userData.role === "admin") return true;

  // Check explicit permissions array in Firestore user doc
  if (Array.isArray(userData.permissions) && userData.permissions.includes(permission)) {
    return true;
  }

  // Support preset role names if stored in user.role or user.rolePreset
  const activeRole = userData.rolePreset || userData.role;
  const preset = ROLE_PRESETS.find(p => p.id === activeRole);
  if (preset && preset.permissions.includes(permission as PermissionKey)) {
    return true;
  }

  return false;
}

/**
 * Get a formatted display label and badge style for a user's role and assigned permissions.
 */
export function getUserRoleBadge(userData: any): { label: string; color: string; background: string } {
  if (!userData) {
    return { label: "Unknown", color: "#888888", background: "rgba(255,255,255,0.05)" };
  }

  if (userData.role === "admin") {
    return { label: "Admin", color: "#00d2ff", background: "rgba(0, 210, 255, 0.15)" };
  }

  if (userData.role === "pending") {
    return { label: "Pending", color: "#F4B304", background: "rgba(244, 179, 4, 0.15)" };
  }

  if (userData.role === "declined") {
    return { label: "Declined", color: "#ff5555", background: "rgba(255, 85, 85, 0.15)" };
  }

  if (userData.roleTitle) {
    return { label: userData.roleTitle, color: "#a855f7", background: "rgba(168, 85, 247, 0.15)" };
  }

  if (Array.isArray(userData.permissions) && userData.permissions.length > 0) {
    if (userData.permissions.includes("manage_store") && userData.permissions.length === 1) {
      return { label: "Store Manager", color: "#10b981", background: "rgba(16, 185, 129, 0.15)" };
    }
    if (userData.permissions.includes("manage_competitions") && userData.permissions.length === 1) {
      return { label: "Events Manager", color: "#ec4899", background: "rgba(236, 72, 153, 0.15)" };
    }
    if (userData.permissions.includes("manage_achievements") && userData.permissions.length === 1) {
      return { label: "Content Manager", color: "#f59e0b", background: "rgba(245, 158, 11, 0.15)" };
    }
    return { label: `Staff (${userData.permissions.length})`, color: "#a855f7", background: "rgba(168, 85, 247, 0.15)" };
  }

  return { label: "Member", color: "var(--text-primary)", background: "rgba(255, 255, 255, 0.1)" };
}
