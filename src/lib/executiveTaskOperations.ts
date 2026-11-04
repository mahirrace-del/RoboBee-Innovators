import { supabaseAdmin } from "./supabase";
import { notifyTaskAssigned, createNotification } from "./notifications";

export interface AssignTaskInput {
  title: string;
  description?: string;
  studentName?: string;
  schoolName?: string;
  classGrade?: string;
  dueDate?: string;
  budgetBdt?: number;
  priority?: "High" | "Medium" | "Low";
  stage?: "backlog" | "discussion" | "in_progress" | "review" | "done";
  assignedToEmail?: string;
  assignedByName?: string;
  source?: string;
}

/**
 * Assigns a task in Supabase and triggers real-time in-portal notifications.
 */
export async function opAssignTask(input: AssignTaskInput) {
  const stage = input.stage || "in_progress";
  const priority = input.priority || "High";
  const status = stage === "done" ? "completed" : "pending";

  const taskPayload = {
    title: input.title.trim(),
    description: (input.description || `Assigned via RoboBee AI Operations`).trim(),
    status,
    stage,
    priority,
    due_date: input.dueDate || null,
    student_name: input.studentName || null,
    school_name: input.schoolName || null,
    class_grade: input.classGrade || null,
    budget_bdt: input.budgetBdt ? Number(input.budgetBdt) : null,
    source: input.source || "messenger_ai_agent",
    created_at: new Date().toISOString(),
  };

  const { data: newTask, error: taskErr } = await supabaseAdmin
    .from("tasks")
    .insert(taskPayload)
    .select("*")
    .single();

  if (taskErr) {
    console.error("[ExecutiveTaskOperations] Failed to insert task:", taskErr);
    throw new Error(`Failed to create task in database: ${taskErr.message}`);
  }

  // Trigger real-time website pop-up chime & notification card
  try {
    await notifyTaskAssigned({
      taskId: newTask.id,
      taskTitle: newTask.title,
      assignedToEmails: input.assignedToEmail ? [input.assignedToEmail] : ["GENERAL"],
      priority,
      dueDate: input.dueDate,
      assignedByName: input.assignedByName || "Mostakim Rahman Mahir",
      assignedByEmail: "admin@robobee.org",
    });
  } catch (nErr) {
    console.warn("[ExecutiveTaskOperations] Notification dispatch notice:", nErr);
  }

  return newTask;
}

/**
 * Updates stage or status of an existing task by ID or title match.
 */
export async function opUpdateTaskStage(
  taskIdentifier: string,
  newStage: "backlog" | "discussion" | "in_progress" | "review" | "done",
  statusNotes?: string
) {
  // 1. Try finding by ID
  let { data: task } = await supabaseAdmin
    .from("tasks")
    .select("id, title, stage, status")
    .eq("id", taskIdentifier)
    .maybeSingle();

  // 2. If not found, try finding by title fuzzy match
  if (!task) {
    const { data: matchedTasks } = await supabaseAdmin
      .from("tasks")
      .select("id, title, stage, status")
      .ilike("title", `%${taskIdentifier}%`)
      .limit(1);

    if (matchedTasks && matchedTasks.length > 0) {
      task = matchedTasks[0];
    }
  }

  if (!task) {
    throw new Error(`Task "${taskIdentifier}" not found on the sprint board.`);
  }

  const newStatus = newStage === "done" ? "completed" : "pending";
  const { data: updated, error } = await supabaseAdmin
    .from("tasks")
    .update({
      stage: newStage,
      status: newStatus,
      ...(statusNotes ? { description: `${statusNotes}` } : {}),
    })
    .eq("id", task.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return updated;
}
