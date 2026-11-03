import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import {
  executeCreateProjectBOM,
  executeSuggestAndBuildBOM,
  executeCreateBOMFromConversation,
  executeAddComponentsToBOM,
  executeLaunchCompetition,
  executeAddAchievement,
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
} from "@/lib/executiveOperations";

export const dynamic = "force-dynamic";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history, context } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Gather live platform context so the AI operator knows real state
    const [tasksRes, convRes] = await Promise.all([
      supabaseAdmin
        .from("tasks")
        .select("id, title, stage, status, due_date, student_name, guardian_phone, budget_bdt")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("whatsapp_conversations")
        .select("id, contact_name, phone_number, platform, school_name, class_grade, summary")
        .order("last_message_at", { ascending: false })
        .limit(10),
    ]);

    let liveProjectsSummary = "No recent projects.";
    try {
      const projSnap = await getDocs(
        query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(10))
      );
      if (!projSnap.empty) {
        liveProjectsSummary = projSnap.docs
          .map((d) => {
            const data = d.data();
            const itemsCount = Array.isArray(data.bom) ? data.bom.length : 0;
            return `- [${d.id}] "${data.name}" (${itemsCount} parts, taskId: ${data.taskId || "none"})`;
          })
          .join("\n");
      }
    } catch {}

    const liveTasksSummary = (tasksRes.data || [])
      .map(
        (t) =>
          `- [Task #${t.id}] "${t.title}" | Stage: ${t.stage || "backlog"} | Student: ${t.student_name || "N/A"} | Phone: ${t.guardian_phone || "N/A"}${t.budget_bdt ? ` | Budget: ৳${t.budget_bdt}` : ""}`
      )
      .join("\n");

    const liveConversationsSummary = (convRes.data || [])
      .map(
        (c) =>
          `- [${c.platform || "chat"}] ${c.contact_name || "Contact"} (${c.phone_number}) | Grade: ${c.class_grade || "N/A"} | Summary: ${c.summary || "None"}`
      )
      .join("\n");

    const systemPrompt = `
You are the RoboBee Innovators Lead AI Operations & Systems Architect (operating as the Website Management AI Bot).
You operate the website directly on behalf of Team Leader Mostakim Rahman Mahir and the engineering team.
You have FULL AUTONOMOUS CONTROL over the website infrastructure:
1. Bills of Materials (BOM) System:
   - Creating Project BOMs in Firestore ('projects' on 'robobee-db')
   - Linking BOMs to Sprint Tasks in Supabase ('tasks') and updating task budgets and attachments
   - Recommending Bangladesh-standard robotics parts (Arduino, ESP32, HC-SR04, servos, BO motors, mini pumps, solar panels)
   - Converting student/customer chat threads (by phone number or name) into complete BOMs with admin requisitions
   - Submitting procurement requisitions to Firestore ('partRequests') for local store purchases
2. Sprint Board & Tasks:
   - Creating and assigning tasks to students or members
   - Updating task stages (backlog, in_progress, review, done)
3. Competitions Arena:
   - Launching new tournaments with categories, entry fees, and prize purses
4. Public Site CMS:
   - Adding achievements, mentors/team leaders, and signature robot builds
   - Ingesting raw RoboBee Facebook/Instagram posts and publishing them
5. Treasury & Parts:
   - Logging expenses and income
   - Approving/rejecting hardware part requests

CURRENT PLATFORM LIVE DATA:
Recent Sprint Tasks:
${liveTasksSummary || "None"}

Recent Project BOMs:
${liveProjectsSummary}

Recent Student & Customer Conversations:
${liveConversationsSummary || "None"}

USER COMMAND:
"""
${prompt.trim()}
"""

CURRENT PAGE CONTEXT:
${JSON.stringify(context || {})}

Analyze the user's intent. Decide if the user is asking to perform an action or asking a general question/requesting advice.
Output ONLY valid JSON matching this schema:
{
  "intent": "ACTION" | "CONVERSATIONAL",
  "action": "create_bom_from_conversation" | "suggest_and_build_bom" | "create_project_bom" | "add_components_to_bom" | "launch_competition" | "add_achievement" | "add_team_leader" | "add_featured_project" | "assign_task" | "update_task_stage" | "approve_part_request" | "record_treasury" | "update_member_role" | "ingest_robobee_post" | "get_platform_status" | "none",
  "params": {
    "query": "phone number, student name, or task id for conversation BOM",
    "projectTopic": "topic or project idea for suggest BOM",
    "classGrade": "Class 5 to 10 if mentioned",
    "studentName": "student name if mentioned",
    "schoolName": "school name if mentioned",
    "targetDeadline": "YYYY-MM-DD if mentioned",
    "projectId": "existing project id if adding components or updating",
    "components": [
      { "name": "string", "category": "string", "price": 0, "quantity": 1, "source": "string" }
    ],
    "name": "competition or project name",
    "date": "YYYY-MM-DD",
    "location": "string",
    "description": "string",
    "visibility": "public_and_members" or "members_only",
    "purseBdt": 0,
    "fee": 0,
    "segments": [{ "name": "string", "fee": 0, "maxParticipants": 20 }],
    "title": "task or achievement title",
    "year": "2026",
    "category": "string",
    "image": "string",
    "role": "string",
    "bio": "string",
    "dueDate": "YYYY-MM-DD",
    "budgetBdt": 0,
    "priority": "High" | "Medium" | "Low",
    "stage": "backlog" | "in_progress" | "review" | "done",
    "taskIdentifier": "string",
    "requestId": "string",
    "decision": "approved" | "rejected",
    "type": "expense" | "income",
    "amount": 0,
    "emailOrUserId": "string",
    "roleTitle": "string",
    "postText": "string"
  },
  "conversationalReply": "Direct markdown reply explaining findings, answering questions, or summarizing what was observed"
}
`;

    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.8-flash",
      "gemini-2.5-flash",
    ];

    let rawJson = "{}";
    for (const m of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model: m,
          contents: systemPrompt,
          config: { responseMimeType: "application/json" },
        });
        if (res.text) {
          rawJson = res.text;
          break;
        }
      } catch (err) {
        console.warn(`[AI Operations API] Model ${m} failed:`, err);
      }
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(rawJson || "{}");
    } catch {
      parsed = { intent: "CONVERSATIONAL", conversationalReply: rawJson };
    }

    let opResult: OperationResult | null = null;

    if (parsed.intent === "ACTION" && parsed.action && parsed.action !== "none") {
      const p = parsed.params || {};

      switch (parsed.action) {
        case "create_bom_from_conversation":
          opResult = await executeCreateBOMFromConversation({
            query: p.query || prompt,
            projectTitle: p.title || p.name,
            autoSubmitRequisition: true,
          });
          break;

        case "suggest_and_build_bom":
          opResult = await executeSuggestAndBuildBOM({
            projectTopic: p.projectTopic || p.title || prompt,
            classGrade: p.classGrade,
            studentName: p.studentName,
            schoolName: p.schoolName,
            targetDeadline: p.targetDeadline || p.dueDate,
            existingTaskId: p.taskIdentifier,
            autoSubmitRequisition: true,
          });
          break;

        case "create_project_bom":
          opResult = await executeCreateProjectBOM({
            name: p.name || p.title || "New Project BOM",
            taskId: p.taskIdentifier || null,
            studentName: p.studentName || null,
            schoolName: p.schoolName || null,
            classGrade: p.classGrade || null,
            items: Array.isArray(p.components) ? p.components : [],
            submitAdminRequisition: true,
          });
          break;

        case "add_components_to_bom":
          opResult = await executeAddComponentsToBOM({
            projectId: p.projectId,
            components: Array.isArray(p.components) ? p.components : [],
            autoSubmitRequisition: true,
          });
          break;

        case "launch_competition":
          opResult = await executeLaunchCompetition({
            name: p.name,
            date: p.date || new Date().toISOString().split("T")[0],
            location: p.location || "RoboBee Maker Lab, Narayanganj",
            description: p.description || "Official tournament organized by RoboBee Innovators",
            visibility: p.visibility || "public_and_members",
            purseBdt: Number(p.purseBdt) || 0,
            fee: Number(p.fee) || 500,
            segments: p.segments,
          });
          break;

        case "add_achievement":
          opResult = await executeAddAchievement({
            title: p.title,
            year: p.year || "2026",
            description: p.description,
            category: p.category,
            image: p.image || "",
          });
          break;

        case "add_team_leader":
          opResult = await executeAddTeamLeader({
            name: p.name,
            role: p.role,
            bio: p.bio,
            image: p.image,
          });
          break;

        case "add_featured_project":
          opResult = await executeAddFeaturedProject({
            title: p.title,
            description: p.description,
            image: p.image,
          });
          break;

        case "assign_task":
          opResult = await executeAssignTask({
            title: p.title,
            studentName: p.studentName,
            schoolName: p.schoolName,
            classGrade: p.classGrade,
            dueDate: p.dueDate,
            budgetBdt: p.budgetBdt,
            priority: p.priority || "High",
            stage: p.stage || "in_progress",
            description: p.description,
          });
          break;

        case "update_task_stage":
          opResult = await executeUpdateTaskStage(
            p.taskIdentifier,
            p.stage || "in_progress"
          );
          break;

        case "approve_part_request":
          opResult = await executeApprovePartRequest(
            p.requestId,
            p.decision || "approved",
            p.description
          );
          break;

        case "record_treasury":
          opResult = await executeRecordTreasury({
            title: p.title,
            type: p.type || "expense",
            category: p.category || "Hardware Components",
            amount: Number(p.amount) || 0,
          });
          break;

        case "update_member_role":
          opResult = await executeUpdateMemberRole({
            emailOrUserId: p.emailOrUserId,
            role: p.role || "member",
            roleTitle: p.roleTitle,
          });
          break;

        case "ingest_robobee_post":
          opResult = await executeIngestRoboBeePagePost(
            p.postText || prompt,
            p.image
          );
          break;

        case "get_platform_status":
          opResult = await executeGetPlatformStatus();
          break;

        default:
          break;
      }
    }

    const finalReply =
      opResult?.message ||
      parsed.conversationalReply ||
      "I have processed your command and updated the RoboBee platform.";

    return NextResponse.json({
      success: true,
      action: parsed.action || "chat",
      reply: finalReply,
      operationResult: opResult,
      details: opResult?.details || null,
      liveLink: opResult?.liveLink || null,
    });
  } catch (error: any) {
    console.error("[AI Operations API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI operation" },
      { status: 500 }
    );
  }
}
