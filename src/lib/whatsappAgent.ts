import { GoogleGenAI, Modality } from "@google/genai";
import { supabaseAdmin } from "./supabase";
import { notifyTaskAssigned } from "./notifications";
import {
  executeAddAchievement,
  executeLaunchCompetition,
  executeAddTeamLeader,
  executeAddFeaturedProject,
  executeAssignTask,
  executeUpdateTaskStage,
  executeApprovePartRequest,
  executeRecordTreasury,
  executeUpdateMemberRole,
  executeIngestRoboBeePagePost,
  executeGetPlatformStatus,
  OperationResult,
} from "./executiveOperations";

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

export interface ExecutiveOperationRequest {
  action:
    | "launch_competition"
    | "add_achievement"
    | "add_team_leader"
    | "add_featured_project"
    | "assign_task"
    | "update_task_stage"
    | "approve_part_request"
    | "record_treasury"
    | "update_member_role"
    | "ingest_robobee_post"
    | "get_platform_status"
    | "ask_clarifying_questions";
  params?: Record<string, any>;
  clarifyingQuestions?: string[];
  requiresConfirmation?: boolean;
}

export interface AnalysisResult {
  state: "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK" | "EXECUTIVE_OPERATION";
  confidence: number;
  executiveOperation?: ExecutiveOperationRequest;
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

const FALLBACK_MESSENGER_TOKEN =
  "EAAbcLr4F7wEBSZCZAbZCJlrNNjzgJpcLyBvZBmALuq3V0lekD8xLcuSz5c8HRsEZAzGjsQOZCBte8AE9tZAX83htNzaUBdV3jSUZC0c1T5gyLGgJES6FTFdZAJqJwODwvZBcRjctpj29fPYulC2nQDIggLYYs9WspHgshIRkJZBpl1wAYhxWtUhBWPCwc1xi3yuUm7MuZBml";

/**
 * Send a message via Meta Facebook Messenger API
 * Endpoint: https://graph.facebook.com/v21.0/me/messages
 */
export async function sendMessengerTextMessage(
  recipientPsid: string,
  textBody: string
): Promise<string | null> {
  const token =
    process.env.MESSENGER_PAGE_ACCESS_TOKEN ||
    FALLBACK_MESSENGER_TOKEN ||
    process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    console.warn("[Messenger Agent] MESSENGER_PAGE_ACCESS_TOKEN is not configured.");
    return null;
  }

  const cleanPsid = (recipientPsid || "").replace(/^messenger_|^psid_/, "").trim();
  if (!cleanPsid) {
    console.warn("[Messenger Agent] Invalid recipient PSID.");
    return null;
  }

  try {
    const res = await fetch("https://graph.facebook.com/v21.0/me/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: cleanPsid },
        message: { text: textBody },
        messaging_type: "RESPONSE",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[Messenger Agent] Meta Messenger send error:", data);
      return null;
    }

    const mid = data?.message_id || "sent";
    console.log("[Messenger Agent] Sent message successfully. MID:", mid);
    return mid;
  } catch (err) {
    console.error("[Messenger Agent] Exception sending messenger text:", err);
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
  const isMessenger =
    conv.platform === "messenger" ||
    conv.phone_number?.startsWith("messenger_") ||
    conv.phone_number?.startsWith("psid_");

  const isMahirAdminGateway =
    conv.id === "2bc78402-cba9-4673-a6b4-f9f40ca6371f" ||
    conv.phone_number === "messenger_38534469092863472" ||
    conv.contact_category === "admin" ||
    Boolean(conv.custom_ai_instructions?.includes("LEAD_ADMIN_GATEWAY"));

  const channelLabel = isMahirAdminGateway
    ? "Facebook Messenger — Team Leader Mahir Rahman's Executive Operations Command Gateway"
    : isMessenger
    ? "Facebook Messenger (Official RoboBee Innovators Page)"
    : "WhatsApp (Direct Contact with Mahir Rahman)";

  const aiPrefix = isMahirAdminGateway
    ? "[RoboBee Admin]:"
    : isMessenger
    ? "[RoboBee AI]:"
    : "[Mahir's AI]:";

  const aiRoleTitle = isMahirAdminGateway
    ? "Autonomous Executive Operations Agent for Team Leader Mostakim Rahman Mahir"
    : isMessenger
    ? "Official AI Assistant of RoboBee Innovators"
    : "Mahir Rahman's Personal AI Assistant";

  // Fetch live tasks for context so Mahir's operations assistant can report sprint progress accurately
  let liveTasksSummary = "No active tasks in database.";
  try {
    const { data: dbTasks } = await supabaseAdmin
      .from("tasks")
      .select("id, title, stage, status, due_date, student_name, school_name, class_grade, budget_bdt")
      .order("created_at", { ascending: false })
      .limit(15);
    if (dbTasks && dbTasks.length > 0) {
      liveTasksSummary = dbTasks
        .map(
          (t) =>
            `- [${(t.stage || "backlog").toUpperCase()}] "${t.title}" (Status: ${t.status || "pending"}${t.due_date ? `, Due: ${t.due_date}` : ""}${t.student_name ? `, Student: ${t.student_name}` : ""}${t.budget_bdt ? `, Budget: ${t.budget_bdt} BDT` : ""})`
        )
        .join("\n");
    }
  } catch (e) {
    console.warn("[WhatsApp Agent] Could not fetch live tasks context:", e);
  }

  const persistentMemory = `
PERSISTENT CONTACT MEMORY (Retained across long conversations):
- Platform / Channel: ${channelLabel}
- Contact Name: ${conv.contact_name || "Unknown"}
- Contact Identifier: ${conv.phone_number}
- Known School: ${conv.school_name || "Not provided yet"}
- Known Class Grade: ${conv.class_grade || "Not provided yet"}
- Previous Rolling Summary: ${conv.summary || "None"}
${conv.custom_ai_instructions ? `- Special Instructions: ${conv.custom_ai_instructions}` : ""}
`;

  const adminGatewayInstruction = `
CRITICAL MAHIR EXECUTIVE OPERATIONS GATEWAY PROTOCOL:
- You are communicating DIRECTLY with Team Leader Mostakim Rahman Mahir (Mahir Rahman).
- You are the Lead AI Operations & Systems Architect for RoboBee Innovators.
- You have FULL AUTONOMOUS CONTROL over the RoboBee Platform:
  * Competitions Arena (launching competitions, configuring multi-category segments, prize purses, public vs members visibility)
  * Public Site CMS (adding achievements, team leaders, featured robot projects, marquee avatars)
  * Sprint Board & Task Management (assigning tasks to students/members, updating stages, deadlines, budgets)
  * Hardware & Lab Inventory (approving/rejecting part requests, stock updates)
  * Treasury & Financial Ledger (logging expenses and income entries)
  * Member Administration (updating roles and custom designations)
  * Social Media Post Ingestion (extracting achievements and competitions from raw RoboBee page posts)
  * Live Platform Status (querying live database counts and pending items)
- NEVER treat Mahir like an outside customer, visitor, parent, or student.
- NEVER ask Mahir how to register, never provide registration forms, and never ask general onboarding questions.
- Every message you send to Mahir MUST start with "${aiPrefix} ".

LIVE SPRINTS & TASKS CURRENTLY ON SPRINT BOARD:
${liveTasksSummary}

HOW TO OPERATE ON COMMANDS FROM MAHIR:

1. LAUNCHING COMPETITIONS ("launch competition", "organize tournament", "new contest", "shuru koro contest"):
   - Required information:
     * Competition Name (e.g. "RoboBee Summer Sumo Clash")
     * Date (YYYY-MM-DD or readable date)
     * Location/Venue (e.g. "RoboBee Maker Lab, Narayanganj")
     * Description
     * Visibility ("public_and_members" or "members_only")
     * Prize Purse (BDT) and Entry Fee (BDT)
     * Segments/Categories (e.g. Sumo Bot, Soccer Bot, Junior Line Follower)
   - INTERACTIVE CLARIFICATION PROTOCOL:
     * If Mahir gives a high-level command without these essential details (e.g. "Launch a competition called Robo Clash"), DO NOT guess or fail!
     * Set state: "EXECUTIVE_OPERATION", confidence: 1.0.
     * Set executiveOperation.action = "ask_clarifying_questions".
     * In autoPilotReply, ask the missing questions in a clean numbered list:
       "1. Date & Venue?
        2. Should this be PUBLIC on the website or MEMBERS-ONLY in the portal?
        3. Segments (e.g. Sumo, Soccer, LFR) and entry fee (BDT)?"
     * When Mahir answers with the details in the conversation, IMMEDIATELY set:
       state: "EXECUTIVE_OPERATION", action: "launch_competition" and populate params: { name, date, location, description, visibility, purseBdt, fee, segments: [{ name, fee, maxParticipants }] }.

2. ADDING ACHIEVEMENTS TO PUBLIC SHOWCASE ("add achievement", "won award", "prize pelam", "add to achievements"):
   - Required information:
     * Title (e.g. "FIRSO 2026 2nd Runner Up (Sumo)")
     * Year (e.g. "2026")
     * Description (1-2 sentences highlighting the students, team, or challenge)
     * Category ("International Milestone" | "National Milestone" | "Maker Lab Innovation" | "Outreach")
     * Image URL (if provided, else "")
   - If missing critical details, ask for them with action: "ask_clarifying_questions".
   - When ready:
     state: "EXECUTIVE_OPERATION", action: "add_achievement", params: { title, year, description, category, image }

3. INGESTING POSTS FROM ROBOBEE FACEBOOK / SOCIAL MEDIA PAGE ("add this post to achievement", "from robobee page", "here is the post"):
   - When Mahir pastes text from a RoboBee Facebook post or tournament announcement:
     * state: "EXECUTIVE_OPERATION", action: "ingest_robobee_post"
     * params: { postText: "[the raw post text]", imageUrl: "[optional url]" }
     * The engine will parse the text, detect if it's an achievement or competition, and publish it directly!

4. ADDING TEAM LEADERS OR MENTORS ("add team leader", "new mentor"):
   - state: "EXECUTIVE_OPERATION", action: "add_team_leader"
   - params: { name, role, bio, group: "leader" | "core", image }

5. ADDING FEATURED ROBOT PROJECTS ("feature project", "add robot to projects"):
   - state: "EXECUTIVE_OPERATION", action: "add_featured_project"
   - params: { title, description, status, image }

6. ASSIGNING SPRINT TASKS ("assign task to X", "give this work to Y", "log task"):
   - state: "EXECUTIVE_OPERATION", action: "assign_task"
   - params: { title, studentName, schoolName, classGrade, dueDate, budgetBdt, priority: "High" | "Medium" | "Low", stage: "backlog" | "in_progress" }

7. UPDATING TASK STAGES ("move task to done", "mark X as completed", "task Y is in review"):
   - state: "EXECUTIVE_OPERATION", action: "update_task_stage"
   - params: { taskIdentifier: "[title or id]", stage: "backlog" | "in_progress" | "review" | "done" }

8. HARDWARE PART REQUESTS ("approve request #123", "reject request for ultrasonic"):
   - state: "EXECUTIVE_OPERATION", action: "approve_part_request"
   - params: { requestId: "[id]", decision: "approved" | "rejected", notes: "optional" }

9. RECORDING TREASURY EXPENSES & INCOME ("log expense 1500 BDT for chassis", "received 5000 BDT from workshop"):
   - state: "EXECUTIVE_OPERATION", action: "record_treasury"
   - params: { title, type: "expense" | "income", category, amount: number, notes }

10. MEMBER ROLES & PROMOTIONS ("promote Tanvir to Hardware Lead", "make Sadman an admin"):
   - state: "EXECUTIVE_OPERATION", action: "update_member_role"
   - params: { emailOrUserId, role: "admin" | "member", roleTitle: "e.g. Hardware Lead" }

11. LIVE PLATFORM SUMMARY & SPRINT STATUS ("status", "show platform metrics", "what tasks are active?"):
   - state: "EXECUTIVE_OPERATION", action: "get_platform_status"
`;

  const visitorInstruction = `
CRITICAL IDENTITY & CHANNEL PROTOCOL:
1. CHANNEL IDENTITY (MUST FOLLOW STRICTLY):
   - Every single outbound message you generate MUST start with "${aiPrefix} " so the contact knows they are communicating with an AI assistant.
   - On Messenger (Facebook Page):
     * The visitor is messaging the RoboBee organization / page, NOT Mahir personally.
     * Speak on behalf of "RoboBee Innovators" and "our team leader Mahir" (e.g. "Welcome to RoboBee Innovators!", "Mahir and our team will catch up with you soon").
   - On WhatsApp:
     * The visitor is messaging Mahir's number directly.
     * Speak as Mahir's personal AI assistant ("How can I help you today?", "I will note this for Mahir").

2. SINGLE CONSOLIDATED TASK PER CONVERSATION (STRICT ANTI-FRAGMENTATION RULE):
   - In any given conversation, a client (teacher, parent, student) will often send requests piece-by-piece in separate messages (e.g. Message 1: "6V USB water pump", Message 2: "2 ta with battery", Message 3: "Can I also get a small solar panel?", Message 4: "For Class 6, deadline Nov 5").
   - ALL OF THESE MESSAGES BELONG TO ONE SINGLE CONSOLIDATED ORDER / TASK!
   - NEVER create multiple separate split tasks for individual components or incremental messages!
   - ALWAYS merge and consolidate all requested parts and requirements into ONE unified project:
     * projectTitle: Descriptive combined title (e.g. "6V USB Water Pump (2 pcs) with Battery & Small Solar Panel")
     * hardwareBOM: Full list of all parts mentioned across all messages (e.g. ["6V USB water pump (2 pcs)", "Battery", "Small solar panel"])
     * requirementsSummary: Combined factual summary of the full requirement (e.g. "2 units of 6V USB water pumps with batteries and 1 small solar panel for Class 6 school work")
   - EXCEPTION: ONLY output multiple projects if the client explicitly states: "I have a DIFFERENT/SECOND project for another class/student" (e.g. "Also I need an obstacle avoiding car for Class 9 student Rafid"). Otherwise, ALWAYS consolidate into exactly 1 project in the "projects" array.

3. NEVER JUMP DIRECTLY INTO ASKING FOR PROJECT DETAILS ON CASUAL GREETINGS OR NON-PROJECT CHATS:
   - Visitors message for many different reasons:
     (a) Simple greetings: "Hi", "Hello", "Assalamu Alaikum", "Kemon achen", "Hey".
     (b) Academy & Courses: How to register, monthly fees (1,000 BDT/month), class schedule, lab address.
     (c) General inquiries: "Are you open?", "Where is your lab?", or general questions.
     (d) Project builds / Science fair assistance: ONLY when they explicitly mention needing a project built, science fair robot, Arduino build, etc.
   
   - RULES FOR CASUAL GREETINGS & GENERAL INQUIRIES:
     * State is strictly "CASUAL".
     * In TASK_OBSERVER mode:
       STAY 100% SILENT! ("needsVerificationMessage": false, "verificationMessage": null, "confirmationMessage": null, "autoPilotReply": null).
     * In AUTO_PILOT mode:
       - If the user sent a casual greeting ("Hi", "Hello", "Assalamu Alaikum", etc.):
         NEVER ask for project topic, student name, school, class, or deadline!
         Simply greet them politely and ask how you can help:
         On Messenger:
         "${aiPrefix} Hi! Welcome to RoboBee Innovators. How can we help you today?"
         On WhatsApp:
         "${aiPrefix} Hi! How can I help you today?"
       - If the user asks about registration, courses, lab address, or fees:
         Provide the factual information directly and politely:
         * Registration Google Form: https://forms.gle/k4sfw3tn4ScPxDbU9
         * Website Membership Application: https://robobee-seven.vercel.app/recruitment
         * Official Website: https://robobee-seven.vercel.app
         * Lab Address: Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj 1400 (at Kids Den Int. Preschool).
         * WhatsApp / Phone: +880 1902-821018
         * Monthly Class Fee: 1,000 BDT
         * In your message, always offer both options clearly: they can fill out the Google Form (https://forms.gle/k4sfw3tn4ScPxDbU9) or visit our website to apply for membership directly (https://robobee-seven.vercel.app/recruitment).
         * Add a closing note: "Mahir or our team will catch up with you soon if you have any questions!"
         * State remains "CASUAL" (Do NOT create any project task!).

4. ROBOBEE INNOVATORS VERIFIED PUBLIC KNOWLEDGE:
   - Organization: RoboBee Innovators (also known as Robo Innovators)
   - Motto: "Dream. Invent. Experiment. Inspire."
   - Team Leader & Mentor: Mostakim Rahman Mahir (Mahir Rahman)
   - Partner Space: Kids Den Int. Preschool (Penny Bee Solutions)
   - What We Are & What We Do:
     * A youth robotics innovation hub, maker lab, and STEM engineering training academy based in Narayanganj.
     * Practical, hands-on STEM & electronics engineering for school and college students (Class 5 to Class 10+ and college level).
     * Level 1 (Foundational): Beginners learn circuit fundamentals, breadboard prototyping, sensor interfacing (IR, ultrasonic, LDR), and Arduino C++.
     * Level 2 (Advanced & IoT): ESP32 IoT systems, autonomous robot logic, 3D CAD modeling (Fusion 360), and 3D printing.
     * Mentoring students for school science fairs, exhibitions, and maker projects.
   - Lab Prototyping Facilities: In-house 3D printers, soldering stations, test equipment (multimeters, bench power supplies), sensors, and microcontrollers.
   - Schedule: Primary hands-on in-person lab sessions are held every Friday.
   - Membership & Cost: 1,000 BDT one-time enrollment + 1,000 BDT/month membership fee (covers weekly mentorship and full access to lab tools & 3D printers).
   - Headquarters / Lab: Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj, Bangladesh 1400.
   - Official Links & Contacts:
     * Website: https://robobee-seven.vercel.app
     * Apply for Membership: https://robobee-seven.vercel.app/recruitment
     * Registration Google Form: https://forms.gle/k4sfw3tn4ScPxDbU9
     * WhatsApp & Hotline: +880 1902-821018

5. STRICT PRIVACY & NON-DISCLOSURE BOUNDARIES (NEVER SHARE):
   - ABSOLUTE PRIVACY RULE: Never disclose private tournament tactical strategies, internal competition squad rosters, competition preparation details (e.g. FIRSO, NRC, international delegations), prize money/purses, internal project blueprints, budget costing spreadsheets, member personal phone numbers, or private mentor deliberations.
   - NEVER share personal private life details of Mahir or team members.
   - If anyone asks about confidential competition robots or private team strategies, answer politely:
     "That is internal team work. You are welcome to visit our lab or ask Mahir directly!"
   - Maintain the EXACT same messaging style: concise, polite, natural, 1-2 sentences, never corporate or fluffy, and always prefixed with "${aiPrefix} ".

6. WHEN TO ACTIVATE PROJECT INTAKE & THE STRICT ANTI-PESTERING RULE (MAX 1 QUESTION):
   - Trigger: ONLY when the user explicitly mentions needing a science fair project, robot build, custom automation, or ordering specific hardware/components (e.g. "I need a robot", "water pump lagbe", "solar panel ene dite parba").
   - State becomes "IN_DISCUSSION" (or "CONFIRMED_WORK" if Mahir has confirmed).
   - In AUTO_PILOT mode:
     * If this is the FIRST time they bring up a project/parts request and details are missing:
       You may ask for basic details in ONE polite message:
       "${aiPrefix} Happy to help! Please share your Student Name, School & Class, and Target Deadline so I can note it down for Mahir."
     * STRICT ANTI-PESTERING RULE: CHECK THE TRANSCRIPT HISTORY!
       If you (the AI) have ALREADY asked for details (e.g. school name, student name, deadline) in an earlier message:
       - If the client replied and provided some info (e.g. they stated "Class 6" and "Deadline 5th November"), but did NOT give their School Name:
         * DO NOT ASK FOR THE MISSING DETAIL AGAIN! NEVER ask a second or third time!
         * Accept whatever information was provided. Leave missing fields (such as school name) as null / blank.
         * NEVER send "Could you please share your school name as well?" or repeat the request.
         * Set "needsVerificationMessage": false, "verificationMessage": null.
         * Proceed directly to Section 7 (Confirmation & Closing Acknowledgement)!

7. CONFIRMATION & CONSOLIDATED CLOSING ACKNOWLEDGEMENT:
   - When the client has shared their requirements (or after you have asked once and they replied):
     * Consolidate all mentioned components and details into ONE single summary.
     * Send ONE reassuring confirmation message listing all consolidated items, class, and deadline:
       "${aiPrefix} Thank you! I have noted your [Consolidated parts/project, e.g. 6V USB water pump (2 pcs) with battery and small solar panel] details for Class [Class] with the [Deadline] deadline. All items have been recorded, and Mahir will review this and get back to you shortly."
   - If the user follows up with "Ok", "Thanks", "Alright", "Thik ache", or simple acknowledgement:
     STAY 100% SILENT! Do not repeat or keep talking!

8. WHEN MAHIR EXPLICITLY CONFIRMS ("ok", "confirm", "hobe", "thik ache", "done", "banay dibo"):
   - State becomes "CONFIRMED_WORK", and the task moves to Sprint Board Backlog.
`;

  const systemInstruction = `
You are the ${aiRoleTitle} at RoboBee Innovators (Narayanganj, Bangladesh).
Channel: ${channelLabel}
Today's reference date: ${currentDate}.
Current AI Mode for this contact: ${isAutoPilot ? "AUTO_PILOT (Direct Assistant)" : "TASK_OBSERVER (Silent Conversation Observer & Task Organizer)"}.
${persistentMemory}

${isMahirAdminGateway ? adminGatewayInstruction : visitorInstruction}

Output ONLY valid JSON matching this schema:
{
  "state": "CASUAL" | "IN_DISCUSSION" | "CONFIRMED_WORK" | "EXECUTIVE_OPERATION",
  "confidence": 0.0 to 1.0,
  "executiveOperation": {
    "action": "launch_competition" | "add_achievement" | "add_team_leader" | "add_featured_project" | "assign_task" | "update_task_stage" | "approve_part_request" | "record_treasury" | "update_member_role" | "ingest_robobee_post" | "get_platform_status" | "ask_clarifying_questions" | null,
    "params": {
      "name": "string",
      "date": "YYYY-MM-DD",
      "location": "string",
      "description": "string",
      "visibility": "public_and_members" or "members_only",
      "purseBdt": number,
      "fee": number,
      "segments": [{ "name": "string", "fee": number, "maxParticipants": number }],
      "title": "string",
      "year": "2026",
      "category": "International Milestone" or "National Milestone" or "Maker Lab Innovation" or "Outreach",
      "role": "string",
      "bio": "string",
      "studentName": "string",
      "schoolName": "string",
      "classGrade": "string",
      "dueDate": "YYYY-MM-DD",
      "budgetBdt": number,
      "priority": "High" or "Medium" or "Low",
      "stage": "backlog" or "in_progress" or "review" or "done",
      "taskIdentifier": "string",
      "requestId": "string",
      "decision": "approved" or "rejected",
      "type": "expense" or "income",
      "amount": number,
      "emailOrUserId": "string",
      "roleTitle": "string",
      "postText": "string",
      "imageUrl": "string"
    },
    "clarifyingQuestions": ["Question 1", "Question 2"]
  },
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
      `[WhatsApp Agent] Conversation ${conversationId} [mode=${effectiveMode}, adminGateway=${isMahirAdminGateway}] classified as: ${result.state} (confidence: ${result.confidence})`
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
        contact_name: isMahirAdminGateway ? "Mahir Rahman" : (result.guardianName || result.studentName || conv.contact_name),
        school_name: result.schoolName || conv.school_name,
        class_grade: result.classGrade || conv.class_grade,
        summary: result.requirementsSummary || conv.summary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // If CONFIRMED_WORK or IN_DISCUSSION, create or update Task(s) on the RoboBee Website Kanban Board
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

    // Save or update Task(s) in Supabase:
    // SINGLE CONSOLIDATED TASK INVARIANT:
    // Incremental messages in the same conversation belong to ONE consolidated order.
    // We update the active task instead of splitting into multiple duplicate rows.
    if (projectsToProcess.length > 0 && (result.state === "CONFIRMED_WORK" || result.state === "IN_DISCUSSION")) {
      const { data: existingTasks } = await supabaseAdmin
        .from("tasks")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false });

      for (const proj of projectsToProcess) {
        if (!proj.projectTitle) continue;

        // In client visitor conversations, all incremental messages map to the active conversation task.
        // For Mahir Admin Gateway, match by title or similar title because Mahir logs tasks for various students.
        let existingTask: any = null;
        if (!isMahirAdminGateway && existingTasks && existingTasks.length > 0) {
          existingTask = existingTasks[0];
        } else if (existingTasks && existingTasks.length > 0) {
          const projTitleLower = proj.projectTitle.toLowerCase().trim();
          existingTask = existingTasks.find((t: any) => {
            const tLower = (t.title || "").toLowerCase().trim();
            return (
              tLower === projTitleLower ||
              (tLower.length > 5 && projTitleLower.length > 5 && (tLower.includes(projTitleLower) || projTitleLower.includes(tLower)))
            );
          });
        }

        // Merge Key Components / Hardware BOM with any previously recorded components in existingTask
        const combinedBOM: string[] = [];
        if (existingTask?.description) {
          const compMatch = existingTask.description.match(/Key Components:\s*([\s\S]*?)(?:\n\n|$)/i);
          if (compMatch && compMatch[1]) {
            const oldLines = compMatch[1]
              .split("\n")
              .map((l: string) => l.replace(/^[-*•\s]+/, "").trim())
              .filter(Boolean);
            combinedBOM.push(...oldLines);
          }
        }
        if (proj.hardwareBOM && proj.hardwareBOM.length > 0) {
          combinedBOM.push(...proj.hardwareBOM);
        }

        // Deduplicate components preserving readability
        const uniqueBOM: string[] = [];
        const seenLower = new Set<string>();
        for (const item of combinedBOM) {
          const lower = item.toLowerCase();
          if (!seenLower.has(lower)) {
            seenLower.add(lower);
            uniqueBOM.push(item);
          }
        }

        const descParts: string[] = [];
        const resolvedClass = proj.classGrade || existingTask?.class_grade;
        const resolvedSchool = proj.schoolName || existingTask?.school_name;
        if (resolvedClass || resolvedSchool) {
          descParts.push(`Class / School: ${[resolvedClass, resolvedSchool].filter(Boolean).join(" | ")}`);
        }
        const resolvedStudent = proj.studentName || existingTask?.student_name || conv.contact_name;
        if (resolvedStudent) {
          descParts.push(`Student: ${resolvedStudent}`);
        }
        const resolvedDeadline = proj.agreedDeadline || result.agreedDeadline || existingTask?.due_date;
        if (resolvedDeadline) {
          descParts.push(`Target Deadline: ${resolvedDeadline}`);
        }
        if (proj.requirementsSummary) {
          descParts.push(`Summary: ${proj.requirementsSummary}`);
        }
        if (uniqueBOM.length > 0) {
          descParts.push(`Key Components:\n- ${uniqueBOM.join("\n- ")}`);
        }

        const isConfirmed = result.state === "CONFIRMED_WORK" || isMahirAdminGateway;
        const validStages = ["backlog", "in_progress", "in_review", "completed"];
        let resolvedStage = "backlog";
        if (existingTask?.stage && validStages.includes(existingTask.stage)) {
          resolvedStage = existingTask.stage;
        }

        const resolvedStatus = isConfirmed
          ? (existingTask?.status && existingTask.status !== "in_discussion" ? existingTask.status : "pending")
          : "in_discussion";

        // Determine resolved title: prioritize unified title from Gemini or fallback to existing
        const resolvedTitle = proj.projectTitle || existingTask?.title || "Hardware & Project Requisition";

        const taskPayload = {
          title: resolvedTitle,
          description: descParts.join("\n\n") || "Science Fair Project Build",
          assigned_to: "GENERAL",
          assigned_by: isMahirAdminGateway
            ? "Mahir Rahman (Messenger Gateway)"
            : isMessenger
            ? "RoboBee AI Agent"
            : "WhatsApp AI Assistant",
          status: resolvedStatus,
          stage: resolvedStage,
          priority: "High",
          due_date: resolvedDeadline || null,
          conversation_id: conversationId,
          guardian_phone: conv.phone_number,
          student_name: resolvedStudent || null,
          school_name: resolvedSchool || null,
          class_grade: resolvedClass || null,
          budget_bdt: proj.budgetBdt || result.budgetBdt || existingTask?.budget_bdt || null,
          source: isMessenger ? "messenger" : "whatsapp",
          updated_at: new Date().toISOString(),
        };

        if (existingTask) {
          await supabaseAdmin.from("tasks").update(taskPayload).eq("id", existingTask.id);
          console.log(
            `[AI Agent] Consolidated & updated existing Task ${existingTask.id} ("${resolvedTitle}") -> stage=${resolvedStage}, status=${resolvedStatus}.`
          );

          // Clean up any historical duplicate tasks created for this same conversation in error
          if (!isMahirAdminGateway && existingTasks && existingTasks.length > 1) {
            const duplicateIds = existingTasks.slice(1).map((t: any) => t.id);
            console.log(`[AI Agent] Auto-merging & removing ${duplicateIds.length} duplicate tasks for conv ${conversationId}`);
            await supabaseAdmin.from("tasks").delete().in("id", duplicateIds);
          }
        } else {
          const { data: newTask, error: taskErr } = await supabaseAdmin
            .from("tasks")
            .insert(taskPayload)
            .select("id")
            .single();

          if (taskErr) {
            console.error("[AI Agent] Failed to create Task in Supabase:", taskErr);
          } else {
            console.log(
              `[AI Agent] Created NEW consolidated Task ${newTask?.id} ("${resolvedTitle}") -> stage=${resolvedStage}, status=${resolvedStatus}!`
            );
            // Trigger instant real-time pop-up notification and audio chime on website
            if (isConfirmed && newTask?.id) {
              try {
                await notifyTaskAssigned({
                  taskId: newTask.id,
                  taskTitle: resolvedTitle,
                  assignedToEmails: ["GENERAL"],
                  priority: "High",
                  dueDate: resolvedDeadline || undefined,
                  assignedByName: isMahirAdminGateway ? "Mahir Rahman" : "RoboBee AI",
                  assignedByEmail: "admin@robobee.org",
                });
              } catch (nErr) {
                console.warn("[AI Agent] Notification dispatch error:", nErr);
              }
            }
          }
        }
      }
    }

    // 4. AUTONOMOUS EXECUTIVE OPERATIONS DISPATCH (Mahir Admin Gateway)
    let executiveOpMessage: string | null = null;
    if (isMahirAdminGateway && result.executiveOperation && result.executiveOperation.action) {
      const op = result.executiveOperation;
      console.log(`[AI Agent] Dispatching Executive Action: ${op.action}`, op.params);

      try {
        let opRes: OperationResult | null = null;
        switch (op.action) {
          case "launch_competition":
            if (op.params?.name) {
              opRes = await executeLaunchCompetition({
                name: op.params.name,
                date: op.params.date || new Date().toISOString().split("T")[0],
                location: op.params.location || "RoboBee Maker Lab, Narayanganj",
                description: op.params.description || "Official robotics tournament hosted by RoboBee Innovators",
                visibility: op.params.visibility || "public_and_members",
                purseBdt: Number(op.params.purseBdt) || 0,
                fee: Number(op.params.fee) || 500,
                segments: op.params.segments || [{ name: "Sumo Bot", fee: 500, maxParticipants: 20 }],
              });
            }
            break;

          case "add_achievement":
            if (op.params?.title) {
              opRes = await executeAddAchievement({
                title: op.params.title,
                year: op.params.year || "2026",
                description: op.params.description || "Milestone achieved by RoboBee Innovators",
                category: op.params.category || "National Milestone",
                image: op.params.image || "",
                imageFit: op.params.imageFit || "contain",
              });
            }
            break;

          case "add_team_leader":
            if (op.params?.name && op.params?.role) {
              opRes = await executeAddTeamLeader({
                name: op.params.name,
                role: op.params.role,
                bio: op.params.bio || "",
                group: op.params.group || "core",
                image: op.params.image || "",
              });
            }
            break;

          case "add_featured_project":
            if (op.params?.title) {
              opRes = await executeAddFeaturedProject({
                title: op.params.title,
                description: op.params.description || "Featured robot build developed at RoboBee Maker Lab",
                status: op.params.status || "Building in the lab",
                image: op.params.image || "",
              });
            }
            break;

          case "assign_task":
            if (op.params?.title) {
              opRes = await executeAssignTask({
                title: op.params.title,
                description: op.params.description,
                studentName: op.params.studentName,
                schoolName: op.params.schoolName,
                classGrade: op.params.classGrade,
                dueDate: op.params.dueDate,
                budgetBdt: op.params.budgetBdt,
                priority: op.params.priority || "High",
                stage: op.params.stage || "in_progress",
                source: "messenger_executive_gateway",
              });
            }
            break;

          case "update_task_stage":
            if (op.params?.taskIdentifier && op.params?.stage) {
              opRes = await executeUpdateTaskStage(op.params.taskIdentifier, op.params.stage);
            }
            break;

          case "approve_part_request":
            if (op.params?.requestId) {
              opRes = await executeApprovePartRequest(
                op.params.requestId,
                op.params.decision || "approved",
                op.params.notes
              );
            }
            break;

          case "record_treasury":
            if (op.params?.title && op.params?.amount) {
              opRes = await executeRecordTreasury({
                title: op.params.title,
                type: op.params.type || "expense",
                category: op.params.category || "Lab Operations",
                amount: Number(op.params.amount),
                notes: op.params.notes,
              });
            }
            break;

          case "update_member_role":
            if (op.params?.emailOrUserId && op.params?.role) {
              opRes = await executeUpdateMemberRole({
                emailOrUserId: op.params.emailOrUserId,
                role: op.params.role,
                roleTitle: op.params.roleTitle,
              });
            }
            break;

          case "ingest_robobee_post":
            if (op.params?.postText) {
              opRes = await executeIngestRoboBeePagePost(op.params.postText, op.params.imageUrl);
            }
            break;

          case "get_platform_status":
            opRes = await executeGetPlatformStatus();
            break;

          case "ask_clarifying_questions":
            // Clarifying questions will be formulated in autoPilotReply
            break;
        }

        if (opRes) {
          if (opRes.success) {
            executiveOpMessage = `${opRes.message}${opRes.liveLink ? `\n🔗 ${opRes.liveLink}` : ""}`;
          } else {
            executiveOpMessage = `⚠️ Notice: ${opRes.message}`;
          }
        }
      } catch (err: any) {
        console.error(`[AI Agent] Executive Operation execution error:`, err);
        executiveOpMessage = `⚠️ Error executing operation: ${err.message}`;
      }
    }

    // Determine outbound reply to send
    const lastMsg = messages[messages.length - 1];
    let outboundText: string | null = null;

    if (executiveOpMessage) {
      outboundText = executiveOpMessage;
    } else {
      // STRICT ANTI-PESTERING GUARDRAIL (Anti-Nagging):
      // If the AI has ALREADY asked for school name, student name, or deadline in earlier turns,
      // and the client already answered with whatever information they have,
      // NEVER badger them or ask again! Accept what was provided.
      const pastAiMessages = messages.filter((m) => m.sender_type === "ai_assistant");
      const pastAiBodies = pastAiMessages.map((m) => (m.body || "").toLowerCase());

      const hasAskedSchoolBefore = pastAiBodies.some((b) => b.includes("school") || b.includes("school name"));
      const hasAskedQuestionsBefore =
        pastAiMessages.length >= 1 &&
        pastAiBodies.some((b) => b.includes("share") || b.includes("could you") || b.includes("please"));

      if (hasAskedSchoolBefore || hasAskedQuestionsBefore) {
        if (result.needsVerificationMessage) {
          console.log("[AI Agent] Anti-pestering: Suppressing repeated inquiry since questions were already asked.");
          result.needsVerificationMessage = false;
          result.verificationMessage = undefined;
        }

        // If autoPilotReply ends with or contains a repetitive question for school name, clean it up:
        if (result.autoPilotReply) {
          result.autoPilotReply = result.autoPilotReply
            .replace(/could you please share (your )?school name.*?\?/gi, "")
            .replace(/would you please share (your )?school name.*?\?/gi, "")
            .replace(/please share (your )?school name.*?\?/gi, "")
            .replace(/could you please share.*?\?/gi, "")
            .replace(/could you share.*?\?/gi, "")
            .trim();

          // If it ended up blank or incomplete, generate a polished confirmation closing reply:
          if (!result.autoPilotReply || result.autoPilotReply.endsWith("as well?")) {
            const classText = result.classGrade ? ` for ${result.classGrade}` : "";
            const deadlineText = result.agreedDeadline ? ` with the ${result.agreedDeadline} deadline` : "";
            const projName = result.projectTitle || "project & parts";
            result.autoPilotReply = `Thank you! I have noted your ${projName} details${classText}${deadlineText}. All items have been recorded, and Mahir will review this and get back to you shortly.`;
          }
        }
      }

      const shouldAutoReply =
        isAutoPilot &&
        (lastMsg?.sender_type === "customer" || (isMahirAdminGateway && lastMsg?.sender_type === "agent_mahir"));

      if (shouldAutoReply && !outboundText) {
        outboundText =
          result.autoPilotReply ||
          (result.needsVerificationMessage ? result.verificationMessage || null : result.confirmationMessage || null);
      } else if (!isAutoPilot && !outboundText && (result.state === "CONFIRMED_WORK" || result.state === "IN_DISCUSSION" || projectsToProcess.length > 0)) {
        outboundText = result.needsVerificationMessage
          ? result.verificationMessage || null
          : result.confirmationMessage || null;
      }
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
        console.log("[AI Agent] Skipping extra chatter after confirmation.");
        outboundText = null;
      } else {
        const cleaned = outboundText.replace(/^\[(Mahir's AI|RoboBee AI|RoboBee Admin)\]:\s*/i, "").trim();
        outboundText = `${aiPrefix} ${cleaned}`;
      }
    }

    if (outboundText) {
      if (lastMsg && lastMsg.sender_type === "ai_assistant" && lastMsg.body?.trim() === outboundText.trim()) {
        console.log("[WhatsApp Agent] Skipping duplicate AI message.");
      } else {
        const isMessengerChannel =
          conv.platform === "messenger" ||
          conv.phone_number?.startsWith("messenger_") ||
          conv.phone_number?.startsWith("psid_");

        console.log(
          `[AI Agent] Dispatching AI message (${isMessengerChannel ? "Messenger" : "WhatsApp"}) to ${conv.phone_number}: "${outboundText}"`
        );
        const sentMsgId = isMessengerChannel
          ? await sendMessengerTextMessage(conv.phone_number, outboundText)
          : await sendWhatsAppTextMessage(conv.phone_number, outboundText);

        if (sentMsgId) {
          await supabaseAdmin.from("whatsapp_messages").insert({
            conversation_id: conversationId,
            wam_id: sentMsgId !== "sent" ? sentMsgId : null,
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
    const isMessenger =
      target.phone_number?.startsWith("messenger_") ||
      target.phone_number?.startsWith("psid_");

    const sentMsgId = isMessenger
      ? await sendMessengerTextMessage(target.phone_number, personalizedMsg)
      : await sendWhatsAppTextMessage(target.phone_number, personalizedMsg);

    const ok = Boolean(sentMsgId);
    results.push({ phone: target.phone_number, ok });
    if (sentMsgId) {
      sentCount++;
      await supabaseAdmin.from("whatsapp_messages").insert({
        conversation_id: target.id,
        wam_id: sentMsgId !== "sent" ? sentMsgId : null,
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
