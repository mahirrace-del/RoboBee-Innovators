import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyTaskAssigned } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const AUTHORIZED_ADMIN_EMAILS = [
  "mahir.race@gmail.com",
  "race.mahir@gmail.com",
  "rest.mahir@gmail.com",
];

/**
 * Handles real-time voice assistant turns and executive task execution for Mahir Rahman.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transcript, userEmail, reason } = body;

    // Strict Admin Authorization Check
    const normalizedEmail = (userEmail || "").trim().toLowerCase();
    const isAdmin =
      AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail) ||
      normalizedEmail.includes("mahir");

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Voice calling is strictly reserved for Team Leader Mahir Rahman." },
        { status: 403 }
      );
    }

    // 1. Fetch live tasks for context
    let liveTasksContext = "No tasks currently recorded.";
    try {
      const { data: tasks } = await supabaseAdmin
        .from("tasks")
        .select("id, title, stage, status, due_date, student_name, school_name, class_grade, budget_bdt")
        .order("created_at", { ascending: false })
        .limit(15);
      if (tasks && tasks.length > 0) {
        liveTasksContext = tasks
          .map(
            (t) =>
              `- [${(t.stage || "backlog").toUpperCase()}] "${t.title}" (Status: ${t.status || "pending"}${t.due_date ? `, Due: ${t.due_date}` : ""}${t.student_name ? `, Student: ${t.student_name}` : ""}${t.budget_bdt ? `, Budget: ${t.budget_bdt} BDT` : ""})`
          )
          .join("\n");
      }
    } catch (e) {
      console.warn("Failed to query live tasks for voice context:", e);
    }

    // 2. Action: Call initiation / initial greeting
    if (action === "get_initial_greeting") {
      const greetingReason = (reason || "").toLowerCase();
      const isWakeUp = greetingReason.includes("wake") || greetingReason.includes("alarm");

      // Short, respectful greeting without spamming tasks
      const speech = isWakeUp
        ? "Good morning Boss! Time to wake up. Do you need anything today?"
        : "Hello Boss! Do you need anything?";

      return NextResponse.json({ speech, liveTasks: liveTasksContext });
    }

    // 3. Action: Process Mahir's Spoken Input & Execute Commands
    if (action === "process_voice_turn") {
      if (!transcript || !transcript.trim()) {
        return NextResponse.json({ speech: "I am listening Boss, go ahead." });
      }

      const prompt = `
You are RoboBee Innovators' Executive Voice Assistant speaking live over a voice call with Team Leader Mostakim Rahman Mahir (Mahir Rahman).
Address him respectfully as "Boss" or "Mahir".
Mahir just spoke into his phone: "${transcript}"

LIVE CONTEXT & ORGANIZATIONAL MEMORY:
- Team Leader: Mostakim Rahman Mahir (Mahir Rahman)
- Headquarters / Maker Lab: Flat 2, 75 North Chashara, Narayanganj
- Programs: Heritage School Science Fair (Class 5-10 projects), Ideal School STEM Mentorship, Indonesia Competition delegation
- Active Competitions: NRC Bangladesh (500K BDT purse), FIRSO Bangladesh (Mega Sumo, Soccer, LFR)
- Standard Component Prices (BDT): Arduino Uno (550-650 BDT), ESP32 (480-600 BDT), Ultrasonic (90-120 BDT), L298N (180-230 BDT), SG90 Servo (120-160 BDT), BO Motor + Wheel pair (180-250 BDT)
- Today's date: ${new Date().toISOString().split("T")[0]}

LIVE TASKS CURRENTLY ON SPRINT BOARD:
${liveTasksContext}

INSTRUCTIONS:
1. Understand Mahir's command or question:
   - If he asks what tasks are active or sprint status: summarize crisply in 1-2 sentences.
   - If he asks about his schedule or lab: tell him based on lab & session memory.
   - If he asks to CREATE or CONFIRM a task (e.g. "Add a task for Class 8 student Ayan, obstacle avoider, deadline Friday, budget 2000"):
     populate "taskToCreate".
   - If he asks to REMOVE or DELETE a task (e.g. "Remove the bicycle project"):
     populate "taskToRemoveTitle".
   - If he asks about components, pricing, or ideas: answer factually in 1-2 sentences.
   - If he asks casually or gives general instructions: respond naturally and crisply.
2. Formulate "spokenReply":
   - Keep it short, sharp, and natural (1-2 sentences).
   - Address him as "Boss" or "Mahir".
   - NEVER output markdown asterisks or bullets in spokenReply because it will be voiced out loud!

Output strictly valid JSON matching this schema:
{
  "spokenReply": "Short natural spoken response to Mahir",
  "taskToCreate": {
    "title": "Descriptive task title",
    "studentName": "Student name or null",
    "schoolName": "School name or null",
    "classGrade": "Class grade or null",
    "dueDate": "YYYY-MM-DD or null",
    "budgetBdt": number or null,
    "description": "Short requirements summary"
  } or null,
  "taskToRemoveTitle": "Title of task to remove or null"
}
`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ speech: "Understood Boss! I heard: " + transcript });
      }

      const ai = new GoogleGenAI({ apiKey });
      const res = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      let parsed: { spokenReply?: string; taskToCreate?: any; taskToRemoveTitle?: string } = {};
      try {
        parsed = JSON.parse(res.text || "{}");
      } catch (e) {
        console.warn("Failed to parse Gemini voice response JSON:", e);
      }

      let createdTask = null;
      if (parsed.taskToCreate && parsed.taskToCreate.title) {
        const t = parsed.taskToCreate;
        const { data: newTask, error: tErr } = await supabaseAdmin
          .from("tasks")
          .insert({
            title: t.title,
            description: t.description || "Project task logged via Live Voice Call with Mahir",
            stage: "backlog",
            status: "pending",
            priority: "High",
            assigned_to: "GENERAL",
            assigned_by: "Mahir Rahman (Live Voice Call)",
            student_name: t.studentName || null,
            school_name: t.schoolName || null,
            class_grade: t.classGrade || null,
            due_date: t.dueDate || null,
            budget_bdt: t.budgetBdt || null,
            source: "voice_call",
          })
          .select("*")
          .single();

        if (!tErr && newTask) {
          createdTask = newTask;
          try {
            await notifyTaskAssigned({
              taskId: newTask.id,
              taskTitle: newTask.title,
              assignedToEmails: ["GENERAL"],
              priority: "High",
              dueDate: newTask.due_date || undefined,
              assignedByName: "Mahir Rahman (Live Voice)",
              assignedByEmail: "race.mahir@gmail.com",
            });
          } catch (nErr) {
            console.warn("Failed to dispatch voice notification:", nErr);
          }
        }
      }

      if (parsed.taskToRemoveTitle) {
        try {
          const matchTitle = parsed.taskToRemoveTitle.trim().toLowerCase();
          const { data: matched } = await supabaseAdmin.from("tasks").select("id, title");
          const target = (matched || []).find((m: { id: string; title: string }) =>
            (m.title || "").toLowerCase().includes(matchTitle)
          );
          if (target?.id) {
            await supabaseAdmin.from("tasks").delete().eq("id", target.id);
            console.log(`[Voice API] Deleted task ${target.id} (${target.title}) on Mahir's voice command.`);
          }
        } catch (delErr) {
          console.warn("Failed to remove task on voice command:", delErr);
        }
      }

      return NextResponse.json({
        speech: parsed.spokenReply || "Understood Boss! I have taken care of that.",
        createdTask,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("[Admin Voice API] Error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
