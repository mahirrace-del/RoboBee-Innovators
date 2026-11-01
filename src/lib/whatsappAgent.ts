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

export interface AnalysisResult {
  state: "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK";
  confidence: number;
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

  const systemInstruction = `
You are the silent Lead Operations Analyst for RoboBee Innovators (Narayanganj, Bangladesh), operating alongside Team Leader Mostakim Rahman Mahir (Mahir Rahman).
RoboBee organizes school science fairs, robotics mentorship, and custom hardware builds for students from Class 5 to Class 10.

Your objective:
1. Examine the WhatsApp chat transcript between Mahir and the guardian.
2. Classify the conversation state into strictly one of three states:
   - "CASUAL": General greetings, queries about what robotics is, casual chit-chat, or passing questions.
   - "IN_DISCUSSION": The guardian is exploring project ideas, asking for suggestions, or asking for quotes, but NO firm mutual commitment has been finalized.
   - "CONFIRMED_WORK": Mahir and the guardian have mutually agreed to execute a project, confirmed an expected delivery deadline/date (e.g., "5th November", "within 4 days"), or confirmed the budget/making of the project.

STRICT INVARIANTS:
- If state is "CASUAL" or "IN_DISCUSSION", you MUST NOT trigger messages or task creation. Set "needsVerificationMessage": false.
- If state is "CONFIRMED_WORK":
  - Extract project title, student name, guardian name, school name, grade/class (Class 5-10), agreed deadline date (YYYY-MM-DD), budget in BDT, and itemized hardware requirements.
  - Check if any CRITICAL information is missing (such as: missing student's class, missing specific deadline, or missing school name).
  - If critical information is missing, set "needsVerificationMessage": true, and generate a polite, warm, human-like bilingual message (Bengali & English) speaking as "Mahir's AI Assistant" to confirm the missing detail politely. Never interrupt aggressive or casual chatting.
  - If all information is complete, set "needsVerificationMessage": false.

Output ONLY valid JSON matching this schema:
{
  "state": "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK",
  "confidence": 0.0 to 1.0,
  "projectTitle": "string or null",
  "studentName": "string or null",
  "guardianName": "string or null",
  "schoolName": "string or null",
  "classGrade": "string or null",
  "agreedDeadline": "YYYY-MM-DD or null",
  "budgetBdt": number or null,
  "requirementsSummary": "string or null",
  "hardwareBOM": ["item 1", "item 2"] or [],
  "missingCriticalInfo": ["e.g. Missing class grade"] or [],
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

    // 5. If CONFIRMED_WORK, create or update a Task on the RoboBee Website Kanban Board!
    if (result.state === "CONFIRMED_WORK" && result.projectTitle) {
      // Check if a task for this conversation already exists
      const { data: existingTask } = await supabaseAdmin
        .from("tasks")
        .select("id")
        .eq("conversation_id", conversationId)
        .maybeSingle();

      const taskPayload = {
        title: result.projectTitle,
        description: `${result.requirementsSummary || 'Science Fair Project Build'}\n\nComponents:\n- ${(result.hardwareBOM || []).join('\n- ')}`,
        assigned_to: "GENERAL",
        assigned_by: "WhatsApp AI Assistant",
        status: "pending",
        stage: "backlog",
        priority: "High",
        due_date: result.agreedDeadline || null,
        conversation_id: conversationId,
        guardian_phone: conv.phone_number,
        student_name: result.studentName || null,
        school_name: result.schoolName || null,
        class_grade: result.classGrade || null,
        budget_bdt: result.budgetBdt || null,
        source: "whatsapp",
      };

      if (existingTask) {
        await supabaseAdmin
          .from("tasks")
          .update(taskPayload)
          .eq("id", existingTask.id);
        console.log(`[WhatsApp Agent] Updated existing Task ${existingTask.id} in Backlog.`);
      } else {
        const { data: newTask, error: taskErr } = await supabaseAdmin
          .from("tasks")
          .insert(taskPayload)
          .select("id")
          .single();
        if (taskErr) {
          console.error("[WhatsApp Agent] Failed to create Task in Supabase:", taskErr);
        } else {
          console.log(`[WhatsApp Agent] Created NEW Task ${newTask?.id} in Backlog for RoboBee Team!`);
        }
      }

      // 6. Handle polite verification message if critical details are missing
      if (result.needsVerificationMessage && result.verificationMessage) {
        console.log(`[WhatsApp Agent] Dispatching polite verification message to ${conv.phone_number}`);
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

    return result;
  } catch (err) {
    console.error("[WhatsApp Agent] Error during Gemini analysis:", err);
    return null;
  }
}
