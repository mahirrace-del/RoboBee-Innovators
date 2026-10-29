import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

export type NotificationType =
  | "task_assigned"
  | "task_stage_change"
  | "task_updated"
  | "task_review"
  | "task_completed"
  | "task_deleted"
  | "general_broadcast";

export interface PortalNotification {
  id: string;
  recipientEmail: string; // e.g. "member@domain.com" or "GENERAL"
  recipientName?: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string; // e.g. "/dashboard/tasks"
  read: boolean;
  createdAt: any;
  senderEmail?: string;
  senderName?: string;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    priority?: string;
    dueDate?: string;
    oldStage?: string;
    newStage?: string;
    assignedTo?: string;
    actionBy?: string;
    [key: string]: any;
  };
}

/**
 * Creates a single notification record in Firestore.
 */
export async function createNotification(params: {
  recipientEmail: string;
  recipientName?: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  senderEmail?: string;
  senderName?: string;
  metadata?: Record<string, any>;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "notifications"), {
    recipientEmail: params.recipientEmail.trim().toLowerCase(),
    recipientName: params.recipientName || null,
    userId: params.userId || null,
    title: params.title.trim(),
    message: params.message.trim(),
    type: params.type,
    link: params.link || "/dashboard/tasks",
    read: false,
    createdAt: serverTimestamp(),
    senderEmail: params.senderEmail || null,
    senderName: params.senderName || null,
    metadata: params.metadata || {},
  });
  return docRef.id;
}

/**
 * Dispatches notifications when a new task is created and assigned to one or more members.
 */
export async function notifyTaskAssigned(params: {
  taskId: string;
  taskTitle: string;
  priority: string;
  dueDate?: string;
  assignedToEmails: string[];
  assignedMembers?: Array<{ name: string; email: string }>;
  assignedByName?: string;
  assignedByEmail?: string;
}) {
  const {
    taskId,
    taskTitle,
    priority,
    dueDate,
    assignedToEmails,
    assignedMembers,
    assignedByName,
    assignedByEmail,
  } = params;

  const actor = assignedByName || assignedByEmail || "Team Lead";

  // Check if open to all members
  const isGeneral =
    assignedToEmails.includes("GENERAL") ||
    assignedToEmails.length === 0;

  if (isGeneral) {
    await createNotification({
      recipientEmail: "GENERAL",
      recipientName: "All Team Members",
      title: `📢 New Open Task: ${taskTitle}`,
      message: `${actor} posted an open team task "${taskTitle}" (${priority} priority${
        dueDate ? ` • Due: ${dueDate}` : ""
      }). Claim it on the sprint board!`,
      type: "task_assigned",
      link: "/dashboard/tasks",
      senderEmail: assignedByEmail,
      senderName: actor,
      metadata: { taskId, taskTitle, priority, dueDate, assignedBy: assignedByEmail },
    });
    return;
  }

  // Multi-member / individual assignment
  const uniqueEmails = Array.from(
    new Set(
      assignedToEmails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e && e !== "general")
    )
  );

  const memberNameMap = new Map<string, string>();
  if (assignedMembers) {
    assignedMembers.forEach((m) => {
      if (m.email) {
        memberNameMap.set(m.email.toLowerCase(), m.name);
      }
    });
  }

  const notificationPromises = uniqueEmails.map((email) => {
    const memberName = memberNameMap.get(email);
    return createNotification({
      recipientEmail: email,
      recipientName: memberName,
      title: `📋 New Task Assigned: ${taskTitle}`,
      message: `${actor} assigned you to "${taskTitle}" (${priority} priority${
        dueDate ? ` • Due: ${dueDate}` : ""
      }).`,
      type: "task_assigned",
      link: "/dashboard/tasks",
      senderEmail: assignedByEmail,
      senderName: actor,
      metadata: { taskId, taskTitle, priority, dueDate, assignedBy: assignedByEmail },
    });
  });

  await Promise.allSettled(notificationPromises);
}

/**
 * Dispatches notifications when a task stage changes across the Kanban board.
 */
export async function notifyTaskStageChanged(params: {
  taskId: string;
  taskTitle: string;
  oldStage: string;
  newStage: string;
  assignedToEmails?: string[];
  actorName?: string;
  actorEmail?: string;
  assignedByEmail?: string;
}) {
  const {
    taskId,
    taskTitle,
    oldStage,
    newStage,
    assignedToEmails = [],
    actorName,
    actorEmail,
    assignedByEmail,
  } = params;

  if (oldStage === newStage) return;

  const actor = actorName || actorEmail || "Team Member";

  let title = `Task Updated: ${taskTitle}`;
  let message = `"${taskTitle}" was updated to ${newStage.replace("_", " ")} by ${actor}.`;
  let type: NotificationType = "task_stage_change";

  if (newStage === "in_progress") {
    title = `🚀 Sprint Started: ${taskTitle}`;
    message = `${actor} moved "${taskTitle}" to In Progress. Build underway!`;
    type = "task_stage_change";
  } else if (newStage === "in_review") {
    title = `🔍 Task Submitted for Review: ${taskTitle}`;
    message = `${actor} completed sprint work on "${taskTitle}" and submitted it for review.`;
    type = "task_review";
  } else if (newStage === "completed") {
    title = `✅ Task Completed: ${taskTitle}`;
    message = `"${taskTitle}" was successfully marked as completed by ${actor}!`;
    type = "task_completed";
  } else if (newStage === "backlog") {
    title = `↩️ Task Moved to Backlog: ${taskTitle}`;
    message = `${actor} moved "${taskTitle}" back to Backlog for backlog refinement.`;
    type = "task_stage_change";
  }

  // Gather recipients: assigned members
  const recipients = new Set<string>();

  const isGeneral =
    assignedToEmails.includes("GENERAL") ||
    assignedToEmails.length === 0;

  if (isGeneral) {
    recipients.add("GENERAL");
  } else {
    assignedToEmails.forEach((e) => {
      const clean = e.trim().toLowerCase();
      if (clean && clean !== "general") {
        recipients.add(clean);
      }
    });
  }

  // If task moved to review or completed, also notify the assigner (e.g. Lead/Admin)
  if (
    (newStage === "in_review" || newStage === "completed") &&
    assignedByEmail &&
    assignedByEmail.toLowerCase() !== actorEmail?.toLowerCase()
  ) {
    recipients.add(assignedByEmail.trim().toLowerCase());
  }

  const promises = Array.from(recipients).map((email) =>
    createNotification({
      recipientEmail: email,
      title,
      message,
      type,
      link: "/dashboard/tasks",
      senderEmail: actorEmail,
      senderName: actor,
      metadata: { taskId, taskTitle, oldStage, newStage, actionBy: actorEmail },
    })
  );

  await Promise.allSettled(promises);
}

/**
 * Dispatches notifications when an admin or lead edits task parameters (details, due date, priority).
 */
export async function notifyTaskUpdated(params: {
  taskId: string;
  taskTitle: string;
  updatedFields: string[];
  assignedToEmails: string[];
  actorName?: string;
  actorEmail?: string;
}) {
  const {
    taskId,
    taskTitle,
    updatedFields,
    assignedToEmails,
    actorName,
    actorEmail,
  } = params;

  const actor = actorName || actorEmail || "Admin";
  const fieldsText = updatedFields.length > 0 ? updatedFields.join(", ") : "details";

  const isGeneral = assignedToEmails.includes("GENERAL") || assignedToEmails.length === 0;

  if (isGeneral) {
    await createNotification({
      recipientEmail: "GENERAL",
      title: `📝 Task Updated: ${taskTitle}`,
      message: `${actor} updated the ${fieldsText} for open task "${taskTitle}".`,
      type: "task_updated",
      link: "/dashboard/tasks",
      senderEmail: actorEmail,
      senderName: actor,
      metadata: { taskId, taskTitle, updatedFields },
    });
    return;
  }

  const uniqueEmails = Array.from(
    new Set(
      assignedToEmails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e && e !== "general")
    )
  );

  const promises = uniqueEmails.map((email) =>
    createNotification({
      recipientEmail: email,
      title: `📝 Task Updated: ${taskTitle}`,
      message: `${actor} updated the ${fieldsText} for "${taskTitle}". Check the task board for new details.`,
      type: "task_updated",
      link: "/dashboard/tasks",
      senderEmail: actorEmail,
      senderName: actor,
      metadata: { taskId, taskTitle, updatedFields },
    })
  );

  await Promise.allSettled(promises);
}

/**
 * Dispatches notifications when an admin deletes a task.
 */
export async function notifyTaskDeleted(params: {
  taskTitle: string;
  assignedToEmails: string[];
  actorName?: string;
}) {
  const { taskTitle, assignedToEmails, actorName } = params;
  const actor = actorName || "Admin";

  const isGeneral =
    assignedToEmails.includes("GENERAL") || assignedToEmails.length === 0;

  if (isGeneral) {
    await createNotification({
      recipientEmail: "GENERAL",
      title: `🗑️ Task Removed: ${taskTitle}`,
      message: `Open task "${taskTitle}" was removed from the sprint pipeline by ${actor}.`,
      type: "task_deleted",
      link: "/dashboard/tasks",
      senderName: actor,
      metadata: { taskTitle },
    });
    return;
  }

  const uniqueEmails = Array.from(
    new Set(
      assignedToEmails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e && e !== "general")
    )
  );

  const promises = uniqueEmails.map((email) =>
    createNotification({
      recipientEmail: email,
      title: `🗑️ Task Removed: ${taskTitle}`,
      message: `Task "${taskTitle}" was removed by ${actor}.`,
      type: "task_deleted",
      link: "/dashboard/tasks",
      senderName: actor,
      metadata: { taskTitle },
    })
  );

  await Promise.allSettled(promises);
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  if (!notificationId) return;
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

/**
 * Mark a single notification as unread.
 */
export async function markNotificationUnread(notificationId: string): Promise<void> {
  if (!notificationId) return;
  await updateDoc(doc(db, "notifications", notificationId), {
    read: false,
  });
}

/**
 * Mark all notifications in the provided ID list as read.
 */
export async function markAllNotificationsRead(notificationIds: string[]): Promise<void> {
  if (!notificationIds || notificationIds.length === 0) return;

  const batch = writeBatch(db);
  notificationIds.slice(0, 450).forEach((id) => {
    batch.update(doc(db, "notifications", id), { read: true });
  });

  await batch.commit();
}

/**
 * Delete a notification document.
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  if (!notificationId) return;
  await deleteDoc(doc(db, "notifications", notificationId));
}

/**
 * Delete all notifications in the provided ID list.
 */
export async function clearAllNotifications(notificationIds: string[]): Promise<void> {
  if (!notificationIds || notificationIds.length === 0) return;

  const batch = writeBatch(db);
  notificationIds.slice(0, 450).forEach((id) => {
    batch.delete(doc(db, "notifications", id));
  });

  await batch.commit();
}

/**
 * Relative time formatter for notification timestamps.
 */
export function formatNotificationTime(timestamp: any): string {
  if (!timestamp) return "Just now";

  let date: Date;
  if (timestamp?.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return "Just now";
  }

  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 45) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return "Yesterday";
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
