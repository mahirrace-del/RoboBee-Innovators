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

Your objective:
1. Examine the WhatsApp chat transcript between Mahir and the client/guardian.
2. Classify the conversation state into strictly one of three states:
   - "CASUAL": General greetings ("hi", "ki khobor", "kemon achen"), non-work social chit-chat.
   - "IN_DISCUSSION": The client is casually asking open questions with no specific project, no timeline, and no budget.
   - "CONFIRMED_WORK": 
     * Either Mahir and the client mutually agreed, OR
     * The client explicitly requested a project build with clear parameters (e.g., project name like "solar panel e cholito vibrator", "Hydraulic Bridge", "Obstacle avoiding robot", timeline/deadline like "6din", and/or budget like "2000tk", or words like "confirm kore den", "banay diven", "project lagbo", "ok"). 
     * NOTE: Mahir often agrees verbally or via mobile app without webhook echoes. When a client specifies project requirements and budget/deadline, treat it as CONFIRMED_WORK so the task is captured in Backlog immediately and never missed!

STRICT INVARIANTS:
- If state is "CASUAL" or "IN_DISCUSSION", you MUST NOT trigger messages or task creation. Set "needsVerificationMessage": false.
- If state is "CONFIRMED_WORK":
  - Extract:
    * projectTitle: Clean descriptive engineering title (e.g., "Solar Powered Vibrating System" or "Hydraulic Bridge").
    * studentName: (string or null)
    * guardianName: (string or null)
    * schoolName: (string or null)
    * classGrade: (e.g. "Class 7", or null)
    * agreedDeadline: Exact target date YYYY-MM-DD. Convert relative days (e.g. "6din" from ${currentDate}) to the calculated ISO date.
    * budgetBdt: (numeric amount, e.g. 2000, or null)
    * requirementsSummary: (concise technical summary)
    * hardwareBOM: list of realistic robotics/electronics parts.
    * missingCriticalInfo: list any critical missing items among: "Student Name", "School Name", "Class Grade".
  
  - If critical information is missing (e.g., Student Name, School Name, or Class Grade):
    * Set "needsVerificationMessage": true.
    * Set "verificationMessage": A smart, professional, crisp message strictly following this format:
      "Hi, I'm Mahir's AI bot. To confirm and proceed with your project order ([Project Title], [Budget] BDT), please send:
      - [Missing Item 1]
      - [Missing Item 2]
      Thank you!"
      RULES FOR MESSAGE:
      - NEVER use long corporate greetings, morning/evening wishes, or robotic AI filler.
      - Keep it short, sharp, and direct.
      - Start directly with: "Hi, I'm Mahir's AI bot. To confirm and proceed with your project order..."
  
  - If all critical details are already present:
    * Set "needsVerificationMessage": false.

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
  "verificationMessage": "string or null"
}
`;

  try {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite"];
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

        const taskPayload = {
          title: proj.projectTitle,
          description: `${proj.requirementsSummary || 'Science Fair Project Build'}\n\nComponents:\n- ${(proj.hardwareBOM || []).join('\n- ')}`,
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

      // 6. Handle verification message if critical details are missing
      if (result.needsVerificationMessage && result.verificationMessage) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.sender_type === "ai_assistant") {
          console.log("[WhatsApp Agent] Skipping duplicate verification message - last message was already sent by AI.");
        } else {
          console.log(`[WhatsApp Agent] Dispatching professional verification message to ${conv.phone_number}`);
          const sent = await sendWhatsAppTextMessage(conv.phone_number, result.verificationMessage);
          if (sent) {
            await supabaseAdmin.from("whatsapp_messages").insert({
              conversation_id: conversationId,
              sender_type: "ai_assistant",
              message_type: "text",
              body: result.verificationMessage,
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
