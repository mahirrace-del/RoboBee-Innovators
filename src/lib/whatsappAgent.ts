import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "./supabase";

/**
 * ============================================================================
 * ROBOBEE INNOVATORS — WHATSAPP AI ASSISTANT & DECISION ENGINE
 * ============================================================================
 * Watches incoming WhatsApp conversations between Team Leader Mahir Rahman and
 * guardians/members. Stays completely silent during casual chats.
 * Only triggers task creation and polite confirmation when an explicit project
 * agreement is reached.
 */

export interface ProjectItem {
  projectTitle: string;
  studentName?: string | null;
  guardianName?: string | null;
  schoolName?: string | null;
  classGrade?: string | null;
  agreedDeadline?: string | null; // YYYY-MM-DD
  budgetBdt?: number | null;
  requirementsSummary?: string | null;
  hardwareBOM?: string[];
}

export interface AnalysisResult {
  state: "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK";
  confidence: number;
  projects?: ProjectItem[];
  projectTitle?: string;
  studentName?: string;
  guardianName?: string;
  schoolName?: string;
  classGrade?: string;
  agreedDeadline?: string; // YYYY-MM-DD
  budgetBdt?: number;
  requirementsSummary?: string;
  hardwareBOM?: string[];
  missingCriticalInfo?: string[];
  needsVerificationMessage?: boolean;
  verificationMessage?: string;
  confirmationMessage?: string;
}

/**
 * Send an outbound text message to a guardian via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppTextMessage(toPhone: string, textBody: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("[WhatsApp Agent] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID. Skipping outbound message dispatch.");
    return false;
  }

  // Format clean phone number (remove '+' or leading dashes)
  const cleanPhone = toPhone.replace(/[^0-9]/g, "");

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: { body: textBody },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[WhatsApp Agent] Meta API send error:", data);
      return false;
    }

    console.log("[WhatsApp Agent] Sent message successfully. WAM ID:", data?.messages?.[0]?.id);
    return true;
  } catch (err) {
    console.error("[WhatsApp Agent] Exception while sending message:", err);
    return false;
  }
}

/**
 * Download media (photo / PDF guideline) from Meta's Graph API
 */
export async function downloadWhatsAppMedia(mediaId: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) return null;

  try {
    // 1. Get temporary media URL
    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!metaRes.ok) return null;
    const metaData = await metaRes.json();
    const mediaUrl = metaData?.url;
    const mimeType = metaData?.mime_type || "application/octet-stream";

    if (!mediaUrl) return null;

    // 2. Download the binary stream
    const fileRes = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!fileRes.ok) return null;

    const arrayBuffer = await fileRes.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType,
    };
  } catch (err) {
    console.error("[WhatsApp Agent] Failed to download media:", err);
    return null;
  }
}

/**
 * Core Decision Engine: Evaluates the conversation thread with Gemini 2.5/2.0
 */
export async function evaluateConversationAndCreateTask(conversationId: string): Promise<AnalysisResult | null> {
  // 1. Fetch conversation details & recent message history
  const { data: conv, error: convErr } = await supabaseAdmin
    .from("whatsapp_conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (convErr || !conv) {
    console.error("[WhatsApp Agent] Conversation not found:", convErr);
    return null;
  }

  const { data: messages, error: msgErr } = await supabaseAdmin
    .from("whatsapp_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(25);

  if (msgErr || !messages || messages.length === 0) {
    return null;
  }

  // 2. Prepare Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[WhatsApp Agent] GEMINI_API_KEY is not configured. Skipping automated evaluation.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Construct chat transcript representation for the AI
  const formattedTranscript = messages
    .map((m) => {
      const sender = m.sender_type === "agent_mahir" ? "MAHIR (RoboBee Leader)" : (m.sender_type === "ai_assistant" ? "AI ASSISTANT" : "GUARDIAN/MEMBER");
      let content = m.body || "";
      if (m.media_url) content += ` [Attached File: ${m.media_mime_type || 'Media'}]`;
      return `[${m.created_at}] ${sender}: ${content}`;
    })
    .join("\n");

  const currentDate = new Date().toISOString().split("T")[0];

  const systemInstruction = `
You are the silent Lead Operations Analyst and AI Assistant for RoboBee Innovators (Narayanganj, Bangladesh), operating alongside Team Leader Mostakim Rahman Mahir (Mahir Rahman).
RoboBee organizes school science fairs, robotics mentorship, and custom hardware builds for students from Class 5 to Class 10.
Today's reference date: ${currentDate}.

CRITICAL ROLE PRINCIPLE:
Mahir Rahman is the Team Leader and final authority. Clients, parents, and students reach out with inquiries, project proposals, or their own budget guesses.
YOU MUST BE INTELLIGENT AND HIGHLY SELECTIVE. DO NOT ASSUME OR CONFIRM ORDERS PREMATURELY.

Conversation States:
1. "CASUAL":
   - General greetings ("hi", "assalamu alaikum", "ki khobor", "kemon achen"), non-work chit-chat.
   - Action: DO NOTHING. No tasks. No messages.

2. "IN_DISCUSSION":
   - Client is asking questions, requesting ideas, inquiring about prices, or proposing their budget.
   - If Mahir has not agreed/confirmed, or if discussion is open-ended without a final build agreement, stay in IN_DISCUSSION.
   - Action: DO NOTHING. DO NOT ask for budget. DO NOT create tasks. DO NOT message.

3. "CONFIRMED_WORK":
   - Triggered when:
     * Mahir says phrases of confirmation/acceptance: "ok", "okay", "ha", "hobe", "confirm", "thik ache", "kora jabe", "order confirm", "done", "ami banay dibo", etc.
     * OR the client explicitly gives an order instruction to execute/build a named project (e.g. "project banay den", "koren", "confirm kore den", "lagbo") with clear deliverables (e.g. "solar drone", "solar vibrator", "hydraulic bridge") and timeline.
     * NOTE: Due to Meta Cloud API limitations, messages sent by Mahir from his mobile phone app are sometimes not echoed to the webhook. When a client explicitly instructs to build a named project ("koren", "project banay den"), treat it as CONFIRMED_WORK so the task is captured in Backlog immediately and never missed!

WHEN "CONFIRMED_WORK" IS REACHED:
- Extract all confirmed project(s). If multiple projects were agreed in the conversation (e.g. Project 1 and Project 2), include each in the "projects" array:
  * projectTitle: Clean descriptive engineering title (e.g. "Solar Powered Vibrating System", "Hydraulic Bridge", "Solar Powered Model Boat")
  * studentName: (string or null)
  * guardianName: (string or null)
  * schoolName: (string or null)
  * classGrade: (e.g. "Class 7", or null)
  * agreedDeadline: Exact target date YYYY-MM-DD. Convert relative days (e.g. "6din" from ${currentDate}) to the calculated ISO date.
  * budgetBdt: The budget agreed or confirmed by Mahir. (Do not ask for budget if not finalized; summarize what was discussed).
  * requirementsSummary: Concise technical summary
  * hardwareBOM: realistic component list
- If critical details (Student Name, School Name, Class Grade) are missing:
  * Set "needsVerificationMessage": true.
  * Set "verificationMessage": Professional, smart, and direct message sent ONLY AT THE END after confirmation:
    For a single project:
    "Hi, I'm Mahir's AI bot. To proceed with your project order ([Project Title]), please send:
    - Student Name
    - School Name & Class
    Thank you!"
    (If Mahir confirmed a budget, include it: e.g. "[Project Title], [Budget] BDT").
    For multiple projects:
    "Hi, I'm Mahir's AI bot. To proceed with your project orders ([Project 1 Title], [Project 2 Title]), please send:
    - Student Name
    - School Name & Class
    Thank you!"
  * Set "confirmationMessage": null.
- If all details (Student Name, School Name, Class Grade) are already present:
  * Set "needsVerificationMessage": false.
  * Set "verificationMessage": null.
  * Set "confirmationMessage":
    For single project:
    "Hi, I'm Mahir's AI bot. Your project order for [Project Title] is confirmed and added to our build schedule. Thank you!"
    For multiple projects:
    "Hi, I'm Mahir's AI bot. Your project orders for [Project 1 Title] and [Project 2 Title] are confirmed and added to our build schedule. Thank you!"

Output ONLY valid JSON matching this schema:
{
  "state": "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK",
  "confidence": 0.0 to 1.0,
  "projects": [
    {
      "projectTitle": "Clean descriptive title (e.g. Solar Powered Boat or Hydraulic Bridge)",
      "studentName": "string or null",
      "schoolName": "string or null",
      "classGrade": "string or null",
      "agreedDeadline": "YYYY-MM-DD or null",
      "budgetBdt": number or null,
      "requirementsSummary": "string or null",
      "hardwareBOM": ["item 1", "item 2"]
    }
  ],
  "projectTitle": "Primary project title or null (for backward compatibility)",
  "studentName": "string or null",
  "guardianName": "string or null",
  "schoolName": "string or null",
  "classGrade": "string or null",
  "agreedDeadline": "YYYY-MM-DD or null",
  "budgetBdt": number or null,
  "requirementsSummary": "string or null",
  "hardwareBOM": ["item 1", "item 2"] or [],
  "missingCriticalInfo": ["Student Name", "School Name"] or [],
  "needsVerificationMessage": boolean,
  "verificationMessage": "string or null",
  "confirmationMessage": "string or null"
}
`;

  try {
    const candidateModels = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash"];
    let response: any = null;
    let lastErr: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                { text: `Analyze this WhatsApp dialogue transcript:\n\n${formattedTranscript}` }
              ]
            }
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.2,
          }
        });
        if (response?.text) break;
      } catch (mErr) {
        lastErr = mErr;
        console.warn(`[WhatsApp Agent] Model ${modelName} unavailable, falling back to next...`);
      }
    }

    if (!response?.text) {
      throw lastErr || new Error("Failed to get response from all candidate models");
    }

    const rawText = response.text || "{}";
    const result: AnalysisResult = JSON.parse(rawText);

    console.log(`[WhatsApp Agent] Conversation ${conversationId} classified as: ${result.state} (confidence: ${result.confidence})`);

    // 4. Update conversation metadata in Supabase
    await supabaseAdmin
      .from("whatsapp_conversations")
      .update({
        status: result.state === "CONFIRMED_WORK" ? "confirmed" : (result.state === "IN_DISCUSSION" ? "in_discussion" : "casual"),
        contact_name: result.guardianName || conv.contact_name,
        school_name: result.schoolName || conv.school_name,
        class_grade: result.classGrade || conv.class_grade,
        summary: result.requirementsSummary || conv.summary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // 5. If CONFIRMED_WORK, create or update Task(s) on the RoboBee Website Kanban Board!
    const projectsToProcess: ProjectItem[] = [];
    if (result.projects && Array.isArray(result.projects) && result.projects.length > 0) {
      projectsToProcess.push(...result.projects);
    } else if (result.projectTitle) {
      projectsToProcess.push({
        projectTitle: result.projectTitle,
        studentName: result.studentName,
        guardianName: result.guardianName,
        schoolName: result.schoolName,
        classGrade: result.classGrade,
        agreedDeadline: result.agreedDeadline,
        budgetBdt: result.budgetBdt,
        requirementsSummary: result.requirementsSummary,
        hardwareBOM: result.hardwareBOM,
      });
    }

    if (result.state === "CONFIRMED_WORK" && projectsToProcess.length > 0) {
      // Fetch all existing tasks linked to this conversation thread
      const { data: existingTasks } = await supabaseAdmin
        .from("tasks")
        .select("id, title")
        .eq("conversation_id", conversationId);

      for (const proj of projectsToProcess) {
        if (!proj.projectTitle) continue;

        // Match existing task by title similarity (case-insensitive)
        const projTitleLower = proj.projectTitle.toLowerCase().trim();
        const existingTask = (existingTasks || []).find((t: any) => {
          const tLower = (t.title || "").toLowerCase().trim();
          return tLower === projTitleLower || tLower.includes(projTitleLower) || projTitleLower.includes(tLower);
        });

        const descParts: string[] = [];
        if (proj.classGrade || proj.schoolName) {
          descParts.push(`Class / School: ${[proj.classGrade, proj.schoolName].filter(Boolean).join(" | ")}`);
        }
        if (proj.studentName) {
          descParts.push(`Student: ${proj.studentName}`);
        }
        if (proj.requirementsSummary) {
          descParts.push(`Summary: ${proj.requirementsSummary}`);
        }
        if (proj.hardwareBOM && proj.hardwareBOM.length > 0) {
          descParts.push(`Key Components:\n- ${proj.hardwareBOM.join('\n- ')}`);
        }

        const taskPayload = {
          title: proj.projectTitle,
          description: descParts.join("\n\n") || "Science Fair Project Build",
          assigned_to: "GENERAL",
          assigned_by: "WhatsApp AI Assistant",
          status: "pending",
          stage: "backlog",
          priority: "High",
          due_date: proj.agreedDeadline || result.agreedDeadline || null,
          conversation_id: conversationId,
          guardian_phone: conv.phone_number,
          student_name: proj.studentName || result.studentName || null,
          school_name: proj.schoolName || result.schoolName || null,
          class_grade: proj.classGrade || result.classGrade || null,
          budget_bdt: proj.budgetBdt || result.budgetBdt || null,
          source: "whatsapp",
        };

        if (existingTask) {
          await supabaseAdmin
            .from("tasks")
            .update(taskPayload)
            .eq("id", existingTask.id);
          console.log(`[WhatsApp Agent] Updated existing Task ${existingTask.id} (${proj.projectTitle}) in Backlog.`);
        } else {
          const { data: newTask, error: taskErr } = await supabaseAdmin
            .from("tasks")
            .insert(taskPayload)
            .select("id")
            .single();
          if (taskErr) {
            console.error("[WhatsApp Agent] Failed to create Task in Supabase:", taskErr);
          } else {
            console.log(`[WhatsApp Agent] Created NEW Task ${newTask?.id} (${proj.projectTitle}) in Backlog for RoboBee Team!`);
          }
        }
      }

      // 6. Handle outbound notification message at the end (verification or confirmation)
      const messageToSend = result.needsVerificationMessage
        ? result.verificationMessage
        : result.confirmationMessage;

      if (messageToSend) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.sender_type === "ai_assistant" && lastMsg.body?.trim() === messageToSend.trim()) {
          console.log("[WhatsApp Agent] Skipping duplicate message - identical message was already sent by AI.");
        } else {
          console.log(`[WhatsApp Agent] Dispatching notification message to ${conv.phone_number}: "${messageToSend}"`);
          const sent = await sendWhatsAppTextMessage(conv.phone_number, messageToSend);
          if (sent) {
            await supabaseAdmin.from("whatsapp_messages").insert({
              conversation_id: conversationId,
              sender_type: "ai_assistant",
              message_type: "text",
              body: messageToSend,
            });
          }
        }
      }
    }

    return result;
  } catch (err) {
    console.error("[WhatsApp Agent] Error during Gemini analysis:", err);
    return null;
  }
}
