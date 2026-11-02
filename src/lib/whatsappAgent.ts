import { GoogleGenAI, Modality } from "@google/genai";
import { supabaseAdmin } from "./supabase";

/**
 * ============================================================================
 * ROBOBEE INNOVATORS — OMNICHANNEL AI MESSAGING & TASK ENGINE
 * ============================================================================
 * Supports strictly gated per-contact AI Modes so ZERO tokens are wasted on
 * personal chats:
 *  - 'off'           : Personal / Manual mode. AI never reads or replies.
 *  - 'task_observer' : AI reads conversation, extracts confirmed tasks to
 *                      Kanban Backlog, and asks only for missing student info.
 *  - 'auto_pilot'    : AI actively replies on behalf of Mahir Rahman AND
 *                      automatically logs confirmed orders to Kanban Backlog.
 */

export type AIMode = "off" | "task_observer" | "auto_pilot";

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
  autoPilotReply?: string;
}

/**
 * Send an outbound text message via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppTextMessage(toPhone: string, textBody: string): Promise<string | null> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("[WhatsApp Agent] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID. Skipping outbound message dispatch.");
    return null;
  }

  const trimmedRecipient = (toPhone || "").trim();
  if (!trimmedRecipient) {
    console.warn("[WhatsApp Agent] Empty recipient identifier. Skipping outbound message dispatch.");
    return null;
  }

  // Support both standard phone numbers and Meta Business-Scoped User IDs (BSUID, e.g. "BD.1801234624250524")
  // CRITICAL: When sending to a BSUID, ONLY pass "recipient": "BD.1801234624250524" (NEVER pass "to", or Meta strips "BD." into a US +1801 number!)
  const isBsuid = /^[A-Za-z]{2}\.\d+/.test(trimmedRecipient);
  const recipientId = isBsuid ? trimmedRecipient : trimmedRecipient.replace(/[^0-9]/g, "");

  try {
    const payload: Record<string, unknown> = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      type: "text",
      text: { body: textBody },
    };

    if (isBsuid) {
      payload.recipient = recipientId;
    } else {
      payload.to = recipientId;
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp Agent] Meta API send error:", data);
      return null;
    }

    const wamId = data?.messages?.[0]?.id || "sent";
    console.log("[WhatsApp Agent] Sent message successfully. WAM ID:", wamId, "Recipient:", data?.contacts?.[0]);
    return wamId;
  } catch (err) {
    console.error("[WhatsApp Agent] Exception while sending message:", err);
    return null;
  }
}

/**
 * Download media (photo / PDF guideline) from Meta's Graph API
 */
export async function downloadWhatsAppMedia(mediaId: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!metaRes.ok) return null;
    const metaData = await metaRes.json();
    const mediaUrl = metaData?.url;
    const mimeType = metaData?.mime_type || "application/octet-stream";

    if (!mediaUrl) return null;

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
 * Helper to call Gemini with automatic fallback across active healthy models
 */
/**
 * Helper to call Unlimited-Quota Gemini Live API models (0 / Unlimited RPM & RPD)
 */
async function callGeminiLiveUnlimited(
  ai: GoogleGenAI,
  modelName: string,
  systemInstruction: string,
  userPrompt: string,
  jsonMode = true
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let textOut = "";
    let done = false;
    const finish = (err: Error | null, val?: string) => {
      if (done) return;
      done = true;
      if (err) reject(err);
      else resolve(val || "");
    };

    try {
      const session = await ai.live.connect({
        model: modelName,
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          thinkingConfig: { thinkingBudget: 0 },
          systemInstruction: {
            parts: [
              {
                text: jsonMode
                  ? `${systemInstruction}\nCRITICAL: Output ONLY a raw valid JSON object starting with { and ending with }. Do NOT speak any conversational preamble outside the JSON.`
                  : systemInstruction,
              },
            ],
          },
        },
        callbacks: {
          onmessage: (msg: unknown) => {
            const sc = (msg as {
              serverContent?: {
                modelTurn?: { parts?: Array<{ text?: string; thought?: boolean }> };
                outputTranscription?: { text?: string };
                turnComplete?: boolean;
              };
            })?.serverContent;
            if (sc?.modelTurn?.parts) {
              for (const p of sc.modelTurn.parts) {
                if (p.text && !p.thought) textOut += p.text;
              }
            }
            if (sc?.outputTranscription?.text) {
              textOut += sc.outputTranscription.text;
            }
            if (sc?.turnComplete) {
              try {
                session.close();
              } catch {}
              finish(null, textOut.trim());
            }
          },
          onerror: (e: { message?: string }) => finish(new Error(e?.message || "Live API error")),
          onclose: () => finish(new Error("Live session closed early")),
        },
      });

      session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: userPrompt }] }],
        turnComplete: true,
      });

      setTimeout(() => {
        try {
          session.close();
        } catch {}
        finish(new Error("Live API timeout"));
      }, 7500);
    } catch (e: unknown) {
      finish(e instanceof Error ? e : new Error("Live connection failed"));
    }
  });
}

/**
 * Helper to call Gemini with fast native JSON models (~750ms) + Unlimited Live API fallback (0 / Unlimited RPD)
 */
async function callGeminiWithFallback(systemInstruction: string, userPrompt: string, jsonMode = true): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastErr: unknown = null;

  // TIER 1: FAST NATIVE JSON MODELS (~750ms latency, 500 to 14,400 RPD)
  const candidateModels = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemma-4-26b-a4b-it",
  ];

  for (const modelName of candidateModels) {
    try {
      const isGemma = modelName.startsWith("gemma-");
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: isGemma ? `${systemInstruction}\n\n${userPrompt}` : userPrompt,
              },
            ],
          },
        ],
        config: {
          ...(!isGemma ? { systemInstruction } : {}),
          ...(!isGemma && jsonMode ? { responseMimeType: "application/json" } : {}),
          temperature: 0.2,
        },
      });
      if (response?.text) {
        let cleaned = response.text.trim();
        if (jsonMode) {
          cleaned = cleaned
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          const startIdx = cleaned.indexOf("{");
          const endIdx = cleaned.lastIndexOf("}");
          if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            cleaned = cleaned.slice(startIdx, endIdx + 1);
          }
          JSON.parse(cleaned);
        }
        console.log(`[WhatsApp Agent] Fulfilled via fast model: ${modelName}`);
        return cleaned;
      }
    } catch (mErr) {
      lastErr = mErr;
      console.warn(`[WhatsApp Agent] Model ${modelName} unavailable, falling back to next...`);
    }
  }

  // TIER 2: UNLIMITED QUOTA LIVE API MODELS (0 / Unlimited RPM & 0 / Unlimited RPD)
  const unlimitedLiveModels = ["gemini-3.1-flash-live-preview", "gemini-3.8-live"];
  for (const liveModel of unlimitedLiveModels) {
    try {
      const rawLive = await callGeminiLiveUnlimited(ai, liveModel, systemInstruction, userPrompt, jsonMode);
      if (rawLive) {
        if (jsonMode) {
          const startIdx = rawLive.indexOf("{");
          const endIdx = rawLive.lastIndexOf("}");
          if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            const jsonCandidate = rawLive.slice(startIdx, endIdx + 1);
            JSON.parse(jsonCandidate); // Validate JSON before returning
            console.log(`[WhatsApp Agent] Fulfilled via Unlimited Live Model: ${liveModel}`);
            return jsonCandidate;
          }
          throw new Error("Live output did not contain valid JSON");
        }
        return rawLive;
      }
    } catch (liveErr) {
      lastErr = liveErr;
      console.warn(`[WhatsApp Agent] Live model ${liveModel} fallback:`, liveErr);
    }
  }

  throw lastErr || new Error("Failed to get response from all candidate Gemini models");
}

/**
 * Core Decision Engine: Evaluates the conversation thread ONLY if ai_mode !== 'off' (or forceRun === true)
 */
export async function evaluateConversationAndCreateTask(
  conversationId: string,
  options?: { forceRun?: boolean; overrideMode?: AIMode }
): Promise<AnalysisResult | null> {
  // 1. Fetch conversation details
  const { data: conv, error: convErr } = await supabaseAdmin
    .from("whatsapp_conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (convErr || !conv) {
    console.error("[WhatsApp Agent] Conversation not found:", convErr);
    return null;
  }

  const effectiveMode: AIMode = options?.overrideMode || (conv.ai_mode as AIMode) || "off";

  // CRITICAL TOKEN GUARD: Never read or spend tokens on 'off' (personal) conversations unless explicitly forced by Mahir
  if (effectiveMode === "off" && !options?.forceRun) {
    console.log(`[WhatsApp Agent] Conversation ${conversationId} (${conv.contact_name || conv.phone_number}) has ai_mode='off'. Skipping AI to save tokens.`);
    return null;
  }

  const { data: recentMessages, error: msgErr } = await supabaseAdmin
    .from("whatsapp_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(40);

  if (msgErr || !recentMessages || recentMessages.length === 0) {
    return null;
  }

  const messages = [...recentMessages].reverse();

  // Construct chat transcript representation for the AI
  const formattedTranscript = messages
    .map((m) => {
      const sender =
        m.sender_type === "agent_mahir"
          ? "MAHIR (RoboBee Leader)"
          : m.sender_type === "ai_assistant"
          ? "AI ASSISTANT"
          : "CONTACT/CLIENT";
      let content = m.body || "";
      if (m.media_url) content += ` [Attached File: ${m.media_mime_type || "Media"}]`;
      return `[${m.created_at}] ${sender}: ${content}`;
    })
    .join("\n");

  const currentDate = new Date().toISOString().split("T")[0];
  const isAutoPilot = effectiveMode === "auto_pilot";
  const persistentMemory = `
PERSISTENT CONTACT MEMORY (Retained across long conversations):
- Contact Name: ${conv.contact_name || "Unknown"}
- Phone: ${conv.phone_number}
- Known School: ${conv.school_name || "Not provided yet"}
- Known Class Grade: ${conv.class_grade || "Not provided yet"}
- Previous Rolling Summary: ${conv.summary || "None"}
${conv.custom_ai_instructions ? `- Special Instructions from Mahir: ${conv.custom_ai_instructions}` : ""}
`;

  const systemInstruction = `
You are Mahir's AI Assistant at RoboBee Innovators (Narayanganj, Bangladesh).
Today's reference date: ${currentDate}.
Current AI Mode for this contact: ${isAutoPilot ? "AUTO_PILOT (Direct Intake Assistant)" : "TASK_OBSERVER (Conversation Observer & Task Organizer)"}.
${persistentMemory}

CRITICAL IDENTITY & TONE RULES (MUST FOLLOW STRICTLY):
1. YOU ARE AN AI TASK ASSISTANT, NOT A HUMAN AND NOT MAHIR'S REPLACEMENT:
   - Never pretend to be human, never try to brainstorm/design projects, and never add enthusiastic fluff ("That's a great project!", "Awesome challenge!", "Brilliant idea!", "We are excited to help bring this amazing invention to life!").
   - Never use commercial store words like "order", "product", "customer", or "purchase".
   - Every message you send to the contact MUST start with "[Mahir's AI]: " so they clearly know it is Mahir's AI assistant collecting/noting info.
   - Keep every message 1–2 short, straightforward sentences. No extra chatter.
   - Your ONLY job is to:
     (a) Collect the required intake details in ONE single message if any are missing:
         1. Project Topic / Brief Description
         2. Student Name
         3. School / College Name
         4. Class / Grade
         5. Deadline / Presentation Date
     (b) Save/update the project in the Task Backlog once the project is discussed/confirmed.
     (c) Tell them briefly that it is noted for Mahir and Mahir will reply directly.
   - NEVER ask for budget/money (Mahir decides budget himself; only record budgetBdt if already mentioned in chat).
   - NEVER ask missing questions one by one across multiple messages! Ask for ALL missing items together in ONE single list.

2. CONVERSATION STATES (CRITICAL DISTINCTION):
   - "CASUAL": Only simple "Hi"/"Hello" or unrelated chat where no project topic has been mentioned yet.
   - "IN_DISCUSSION" (Ongoing Project Summary — NOT Finalized Yet):
     * The contact is asking about a project, discussing an idea (e.g. "Smart Bin", "Rock Picking Rover"), or sharing details (Student Name, School, Class, Deadline), BUT Mahir has NOT confirmed it yet, and the project is not finalized.
     * IMPORTANT: Even in "IN_DISCUSSION", you MUST extract the project(s) into the "projects" array so our Project Summary & Staging Panel can display who sent it, what they want, their school/class, and their deadline!
   - "CONFIRMED_WORK" (Finalized Task — Moves to Sprint Board Backlog):
     * ONLY classify as "CONFIRMED_WORK" when:
       (a) Mahir explicitly confirms in the conversation ("ok", "okay", "ha", "hobe", "confirm", "thik ache", "done", "banay dibo"), OR
       (b) In "AUTO_PILOT" mode, the contact has already provided ALL required details (Project Topic, Student Name, School Name, Class Grade, and Deadline) AND explicitly confirms they want us to proceed.

3. BEHAVIOR BY MODE:
   - MODE A: "TASK_OBSERVER" (Observes conversation, summarizes ongoing projects, asks ONLY for missing info):
     * If state is "CASUAL" (no project mentioned):
       Stay silent ("needsVerificationMessage": false, "verificationMessage": null, "confirmationMessage": null, "autoPilotReply": null).
     * If a project is being discussed ("IN_DISCUSSION" or "CONFIRMED_WORK"):
       Always extract the project details into "projects" (so the Summary Panel shows Project Title, Student Name, School, Class, Deadline, and Summary).
       - Check which of these items are still missing from the conversation: [Project Topic, Student Name, School Name, Class Grade, Deadline].
       - If ANY of those items are missing:
         Set "needsVerificationMessage": true, and write a short, direct "verificationMessage" asking ONLY for the missing items in ONE message:
         Example:
         "[Mahir's AI]: Noted your project details for Mahir. Please share the missing info:\n- Student Name\n- School & Class\n- Target Date"
       - When the user replies with the missing info:
         * If state is "IN_DISCUSSION" (not yet confirmed by Mahir):
           Set "needsVerificationMessage": false, and set a brief 4-word acknowledgement in "confirmationMessage":
           "[Mahir's AI]: Thank you, noted for Mahir."
         * If state is "CONFIRMED_WORK" (confirmed by Mahir):
           Set "needsVerificationMessage": false, and set "confirmationMessage":
           "[Mahir's AI]: Thank you. Confirmed and added [Project Title] to Mahir's task list."
       - After sending "Thank you...", if the user replies "Ok" or anything without new missing info, stay completely silent!

   - MODE B: "AUTO_PILOT" (Direct Intake Assistant when Mahir is away):
     * Never brainstorm or act like a human engineer. Just collect the required details in 3–4 total messages max.
     * Step 1 (User says "Hi" or "I want help with a project"):
       Set state = "IN_DISCUSSION", and reply briefly:
       "[Mahir's AI]: Hi, I am Mahir's AI assistant. Please share these details so I can note your project for Mahir:\n1. Project Name / Description\n2. Student Name\n3. School & Class\n4. Target Deadline"
     * Step 2 (User shares partial details — e.g. gave project & class, but missed school or deadline):
       Set state = "IN_DISCUSSION", extract known details into "projects", and in "autoPilotReply" ask ONLY for the remaining missing items:
       "[Mahir's AI]: Noted. Please also share: [missing items]."
     * Step 3 (All details provided):
       Extract all details into "projects". Send one short reply:
       "[Mahir's AI]: Thank you. I have noted your [Project Title] details for Mahir. He will review and confirm soon."
     * Step 4 (User says "Ok" / "Thank you" after details are noted):
       Set "autoPilotReply": null, "confirmationMessage": null, "needsVerificationMessage": false. Do NOT keep talking!

Output ONLY valid JSON matching this schema:
{
  "state": "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK",
  "confidence": 0.0 to 1.0,
  "projects": [
    {
      "projectTitle": "Clean descriptive project title",
      "studentName": "string or null",
      "schoolName": "string or null",
      "classGrade": "string or null",
      "agreedDeadline": "YYYY-MM-DD or null",
      "budgetBdt": number or null,
      "requirementsSummary": "Brief factual summary of what the project is",
      "hardwareBOM": ["item 1", "item 2"]
    }
  ],
  "projectTitle": "Primary project title or null",
  "studentName": "string or null",
  "guardianName": "string or null",
  "schoolName": "string or null",
  "classGrade": "string or null",
  "agreedDeadline": "YYYY-MM-DD or null",
  "budgetBdt": number or null,
  "requirementsSummary": "string or null",
  "hardwareBOM": ["item 1", "item 2"] or [],
  "missingCriticalInfo": ["Student Name", "School Name", "Class Grade", "Deadline"] or [],
  "needsVerificationMessage": boolean,
  "verificationMessage": "string or null",
  "confirmationMessage": "string or null",
  "autoPilotReply": "string or null"
}
`;

  try {
    const rawText = await callGeminiWithFallback(
      systemInstruction,
      `Analyze this conversation transcript:\n\n${formattedTranscript}`,
      true
    );
    const result: AnalysisResult = JSON.parse(rawText || "{}");

    console.log(
      `[WhatsApp Agent] Conversation ${conversationId} [mode=${effectiveMode}] classified as: ${result.state} (confidence: ${result.confidence})`
    );

    // Update conversation metadata in Supabase
    await supabaseAdmin
      .from("whatsapp_conversations")
      .update({
        status:
          result.state === "CONFIRMED_WORK"
            ? "confirmed"
            : result.state === "IN_DISCUSSION"
            ? "in_discussion"
            : "casual",
        contact_name: result.guardianName || result.studentName || conv.contact_name,
        school_name: result.schoolName || conv.school_name,
        class_grade: result.classGrade || conv.class_grade,
        summary: result.requirementsSummary || conv.summary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // If CONFIRMED_WORK, create or update Task(s) on the RoboBee Website Kanban Board
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

    // Save or update Task(s) on the RoboBee Website:
    // - If IN_DISCUSSION (ongoing conversation, not confirmed yet) -> stage: 'in_discussion', status: 'in_discussion'
    // - If CONFIRMED_WORK (confirmed by Mahir or finalized) -> stage: 'backlog', status: 'pending'
    // Note: If an existing task was already manually finalized to 'backlog' / 'in_progress' / 'in_review' / 'completed', never downgrade it back to 'in_discussion'!
    if (projectsToProcess.length > 0 && (result.state === "CONFIRMED_WORK" || result.state === "IN_DISCUSSION")) {
      const { data: existingTasks } = await supabaseAdmin
        .from("tasks")
        .select("id, title, stage, status")
        .eq("conversation_id", conversationId);

      for (const proj of projectsToProcess) {
        if (!proj.projectTitle) continue;

        const projTitleLower = proj.projectTitle.toLowerCase().trim();
        const existingTask =
          (existingTasks || []).find((t: { id: string; title?: string; stage?: string; status?: string }) => {
            const tLower = (t.title || "").toLowerCase().trim();
            return tLower === projTitleLower || tLower.includes(projTitleLower) || projTitleLower.includes(tLower);
          }) || (projectsToProcess.length === 1 && existingTasks && existingTasks.length === 1 ? existingTasks[0] : undefined);

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
          descParts.push(`Key Components:\n- ${proj.hardwareBOM.join("\n- ")}`);
        }

        const alreadyFinalized =
          existingTask &&
          existingTask.stage &&
          existingTask.stage !== "in_discussion" &&
          existingTask.stage !== "dismissed";

        const isConfirmed = result.state === "CONFIRMED_WORK" || Boolean(alreadyFinalized);
        const resolvedStage = isConfirmed ? (existingTask?.stage && existingTask.stage !== "in_discussion" ? existingTask.stage : "backlog") : "in_discussion";
        const resolvedStatus = isConfirmed ? (existingTask?.status && existingTask.status !== "in_discussion" ? existingTask.status : "pending") : "in_discussion";

        const taskPayload = {
          title: proj.projectTitle,
          description: descParts.join("\n\n") || "Science Fair Project Build",
          assigned_to: "GENERAL",
          assigned_by: "WhatsApp AI Assistant",
          status: resolvedStatus,
          stage: resolvedStage,
          priority: "High",
          due_date: proj.agreedDeadline || result.agreedDeadline || null,
          conversation_id: conversationId,
          guardian_phone: conv.phone_number,
          student_name: proj.studentName || result.studentName || conv.contact_name || null,
          school_name: proj.schoolName || result.schoolName || conv.school_name || null,
          class_grade: proj.classGrade || result.classGrade || conv.class_grade || null,
          budget_bdt: proj.budgetBdt || result.budgetBdt || null,
          source: "whatsapp",
        };

        if (existingTask) {
          await supabaseAdmin.from("tasks").update(taskPayload).eq("id", existingTask.id);
          console.log(`[WhatsApp Agent] Updated Task ${existingTask.id} (${proj.projectTitle}) -> stage=${resolvedStage}.`);
        } else {
          const { data: newTask, error: taskErr } = await supabaseAdmin
            .from("tasks")
            .insert(taskPayload)
            .select("id")
            .single();
          if (taskErr) {
            console.error("[WhatsApp Agent] Failed to create Task in Supabase:", taskErr);
          } else {
            console.log(`[WhatsApp Agent] Created NEW Task ${newTask?.id} (${proj.projectTitle}) -> stage=${resolvedStage}!`);
          }
        }
      }
    }

    // Determine outbound reply to send
    const lastMsg = messages[messages.length - 1];
    let outboundText: string | null = null;

    if (isAutoPilot && lastMsg?.sender_type === "customer") {
      outboundText =
        result.autoPilotReply ||
        (result.needsVerificationMessage ? result.verificationMessage || null : result.confirmationMessage || null);
    } else if (!isAutoPilot && (result.state === "CONFIRMED_WORK" || result.state === "IN_DISCUSSION" || projectsToProcess.length > 0)) {
      outboundText = result.needsVerificationMessage
        ? result.verificationMessage || null
        : result.confirmationMessage || null;
    }

    if (outboundText) {
      // Prevent repeating a final confirmation if the previous AI message already confirmed and saved the task
      const prevAiMsg = [...messages].reverse().find((m) => m.sender_type === "ai_assistant");
      const alreadyConfirmed =
        prevAiMsg?.body &&
        (prevAiMsg.body.includes("saved") || prevAiMsg.body.includes("noted the") || prevAiMsg.body.includes("task list")) &&
        !result.needsVerificationMessage &&
        lastMsg?.sender_type === "customer" &&
        /^(ok|okay|thanks|thank you|accha|thik ache|dhonnobad|alright|great)\b/i.test((lastMsg.body || "").trim());

      if (alreadyConfirmed) {
        console.log("[WhatsApp Agent] Skipping extra chatter after confirmation.");
        outboundText = null;
      } else if (!outboundText.startsWith("[Mahir's AI]")) {
        outboundText = `[Mahir's AI]: ${outboundText}`;
      }
    }

    if (outboundText) {
      if (lastMsg && lastMsg.sender_type === "ai_assistant" && lastMsg.body?.trim() === outboundText.trim()) {
        console.log("[WhatsApp Agent] Skipping duplicate AI message.");
      } else {
        console.log(`[WhatsApp Agent] Dispatching AI message to ${conv.phone_number}: "${outboundText}"`);
        const sentWamId = await sendWhatsAppTextMessage(conv.phone_number, outboundText);
        if (sentWamId) {
          await supabaseAdmin.from("whatsapp_messages").insert({
            conversation_id: conversationId,
            wam_id: sentWamId !== "sent" ? sentWamId : null,
            sender_type: "ai_assistant",
            message_type: "text",
            body: outboundText,
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

/**
 * Command & Broadcast Engine: Allows Mahir to instruct the AI to message a contact
 * or broadcast to multiple team members / clients on his behalf.
 */
export async function executeAICommandOrBroadcast(params: {
  instruction: string;
  usePolishAI: boolean;
  targetConversations: Array<{ id: string; phone_number: string; contact_name?: string | null }>;
}): Promise<{ sentCount: number; generatedMessage: string; results: Array<{ phone: string; ok: boolean }> }> {
  let finalMessage = params.instruction.trim();

  if (params.usePolishAI) {
    const sysPrompt = `
You are Mahir Rahman's assistant at RoboBee Innovators (Narayanganj, Bangladesh) — a collaborative team of student inventors and STEM mentors.
Convert Mahir's raw command/instruction into a warm, respectful, natural WhatsApp message to be sent on his behalf to teachers, guardians, students, or team members.
- Never use commercial/shop words like "order", "product", "customer", or "purchase".
- Speak like fellow inventors and mentors who are happy to help build and create projects together.
- Keep it concise, polite, and natural (matching English or Banglish/Bengali tone).
- Output ONLY the final message text to send, nothing else.
`;
    try {
      const generated = await callGeminiWithFallback(sysPrompt, params.instruction, false);
      if (generated && generated.trim()) {
        finalMessage = generated.trim();
      }
    } catch (e) {
      console.warn("[WhatsApp Agent] Failed to polish broadcast with AI, using raw instruction:", e);
    }
  }

  const results: Array<{ phone: string; ok: boolean }> = [];
  let sentCount = 0;

  for (const target of params.targetConversations) {
    const personalizedMsg = finalMessage.replace(/\{name\}/gi, target.contact_name || "Member");
    const sentWamId = await sendWhatsAppTextMessage(target.phone_number, personalizedMsg);
    const ok = Boolean(sentWamId);
    results.push({ phone: target.phone_number, ok });
    if (sentWamId) {
      sentCount++;
      await supabaseAdmin.from("whatsapp_messages").insert({
        conversation_id: target.id,
        wam_id: sentWamId !== "sent" ? sentWamId : null,
        sender_type: "ai_assistant",
        message_type: "text",
        body: personalizedMsg,
      });
      await supabaseAdmin
        .from("whatsapp_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", target.id);
    }
  }

  return {
    sentCount,
    generatedMessage: finalMessage,
    results,
  };
}
