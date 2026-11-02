import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyTaskAssigned } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const AUTHORIZED_ADMIN_EMAILS = [
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
      const greetingReason = reason || "Morning Wake-Up Briefing";
      const prompt = `
You are the RoboBee Executive Voice Assistant on a live direct phone call with Team Leader Mahir Rahman (Mostakim Rahman Mahir).
Reason for this call: ${greetingReason}.
Today's date: ${new Date().toISOString().split("T")[0]}.

Current live tasks on Sprint Board:
${liveTasksContext}

Instructions:
- Speak directly, warmly, and crisply to Mahir as his lead operational assistant.
- Give a quick 2-3 sentence verbal briefing: greet him, mention how many active tasks exist or any urgent deadlines, and ask what he would like to work on or assign.
- Output ONLY the spoken text to be voiced out loud to Mahir. Do not use asterisks or markdown.
`;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({
          speech: "Good morning, Mahir! RoboBee AI is online. How can I assist you with the team today?",
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const res = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const speech = res.text?.trim() || "Good morning, Mahir! RoboBee AI is on the line. How can I assist you today?";
      return NextResponse.json({ speech, liveTasks: liveTasksContext });
    }

    // 3. Action: Process Mahir's Spoken Input & Execute Commands
    if (action === "process_voice_turn") {
      if (!transcript || !transcript.trim()) {
        return NextResponse.json({ speech: "I'm listening, Mahir. Go ahead." });
      }

      const prompt = `
You are RoboBee Innovators' Executive Voice Assistant speaking live over a voice call with Team Leader Mostakim Rahman Mahir (Mahir Rahman).
Mahir just spoke into his phone: "${transcript}"

Current Live Tasks on Sprint Board:
${liveTasksContext}

YOUR MISSION:
1. Understand Mahir's command. He may:
   - Ask to log/confirm a new project or task (e.g. "Add a task for Class 8 student Ayan, obstacle avoider, deadline Friday, budget 2000").
   - Ask for sprint status, active tasks, or backlog.
   - Ask for a technical component or BOM recommendation (Arduino, ESP32, L298N, BO motors, servos).
   - Ask you to set a reminder or confirm an alarm.
   - Converse naturally about RoboBee lab plans.
2. If he wants to CREATE or CONFIRM a task:
   - Populate the "taskToCreate" JSON object with: title, studentName, schoolName, classGrade, dueDate (YYYY-MM-DD), budgetBdt, description.
3. Formulate a natural, concise, spoken response (1-2 sentences) in "spokenReply". Never use markdown bullets or asterisks in spokenReply because it will be read aloud.

Output strictly valid JSON:
{
  "spokenReply": "Concise spoken text to say out loud to Mahir",
  "taskToCreate": {
    "title": "Descriptive task title",
    "studentName": "Student name or null",
    "schoolName": "School name or null",
    "classGrade": "Class or null",
    "dueDate": "YYYY-MM-DD or null",
    "budgetBdt": number or null,
    "description": "Short requirements summary"
  } or null
}
`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ speech: "Understood, Mahir! I heard: " + transcript });
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

      let parsed: { spokenReply?: string; taskToCreate?: any } = {};
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

      return NextResponse.json({
        speech: parsed.spokenReply || "Understood, Mahir! I have noted that.",
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
