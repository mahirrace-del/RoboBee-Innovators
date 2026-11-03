import {
  opAddAchievement,
  opDeleteAchievement,
  opAddTeamLeader,
  opAddFeaturedProject,
  opAddMarqueeAvatar,
  opLaunchCompetition,
  opApproveOrRejectPartRequest,
  opUpdateInventoryStock,
  opRecordTreasuryEntry,
  opUpdateMemberRole,
  opGetPlatformStatusSummary,
  NewAchievementInput,
  LaunchCompetitionInput,
  NewLeaderInput,
  NewProjectInput,
  TreasuryEntryInput,
} from "./executiveFirebase";
import { opAssignTask, opUpdateTaskStage, AssignTaskInput } from "./executiveTaskOperations";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export interface OperationResult {
  success: boolean;
  action: string;
  message: string;
  details?: any;
  liveLink?: string;
}

/**
 * 1. Add Achievement to Public Showcase
 */
export async function executeAddAchievement(input: NewAchievementInput): Promise<OperationResult> {
  try {
    const doc = await opAddAchievement(input);
    return {
      success: true,
      action: "add_achievement",
      message: `🏆 Achievement "${doc.title}" (${doc.year}) has been published to the homepage showcase!`,
      details: doc,
      liveLink: "https://www.robobeeinnovators.org#achievements",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "add_achievement",
      message: `Failed to add achievement: ${error.message}`,
    };
  }
}

/**
 * 2. Launch Competition
 */
export async function executeLaunchCompetition(input: LaunchCompetitionInput): Promise<OperationResult> {
  try {
    const doc = await opLaunchCompetition(input);
    const visText = doc.visibility === "public_and_members" ? "Public & Members" : "Members Only";
    return {
      success: true,
      action: "launch_competition",
      message: `🚀 Competition "${doc.name}" has been officially launched!\n- Date: ${doc.date}\n- Location: ${doc.location}\n- Visibility: ${visText}\n- Prize Purse: ${doc.purseBdt || 0} BDT\n- Segments: ${doc.segments.map((s: any) => s.name).join(", ")}`,
      details: doc,
      liveLink: "https://www.robobeeinnovators.org/dashboard/competitions",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "launch_competition",
      message: `Failed to launch competition: ${error.message}`,
    };
  }
}

/**
 * 3. Add Team Leader / Mentor
 */
export async function executeAddTeamLeader(input: NewLeaderInput): Promise<OperationResult> {
  try {
    const doc = await opAddTeamLeader(input);
    return {
      success: true,
      action: "add_team_leader",
      message: `👤 Leader/Mentor profile for "${doc.name}" (${doc.role}) has been added to the Core Team page!`,
      details: doc,
      liveLink: "https://www.robobeeinnovators.org#team",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "add_team_leader",
      message: `Failed to add leader: ${error.message}`,
    };
  }
}

/**
 * 4. Add Featured Robot Project
 */
export async function executeAddFeaturedProject(input: NewProjectInput): Promise<OperationResult> {
  try {
    const doc = await opAddFeaturedProject(input);
    return {
      success: true,
      action: "add_featured_project",
      message: `🤖 Signature build "${doc.title}" has been added to the public Projects Showcase!`,
      details: doc,
      liveLink: "https://www.robobeeinnovators.org#projects",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "add_featured_project",
      message: `Failed to add featured project: ${error.message}`,
    };
  }
}

/**
 * 5. Assign Task to Member or Student
 */
export async function executeAssignTask(input: AssignTaskInput): Promise<OperationResult> {
  try {
    const task = await opAssignTask(input);
    return {
      success: true,
      action: "assign_task",
      message: `📋 Task "${task.title}" has been assigned!\n- Assignee: ${task.student_name || "General Team"}\n- Stage: ${(task.stage || "in_progress").toUpperCase()}\n- Priority: ${task.priority}\n${task.due_date ? `- Deadline: ${task.due_date}\n` : ""}${task.budget_bdt ? `- Budget: ${task.budget_bdt} BDT` : ""}`,
      details: task,
      liveLink: "https://www.robobeeinnovators.org/dashboard/tasks",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "assign_task",
      message: `Failed to assign task: ${error.message}`,
    };
  }
}

/**
 * 6. Update Task Stage
 */
export async function executeUpdateTaskStage(
  taskIdentifier: string,
  stage: "backlog" | "discussion" | "in_progress" | "review" | "done"
): Promise<OperationResult> {
  try {
    const updated = await opUpdateTaskStage(taskIdentifier, stage);
    return {
      success: true,
      action: "update_task_stage",
      message: `✅ Task "${updated.title}" stage changed to ${stage.toUpperCase()}!`,
      details: updated,
      liveLink: "https://www.robobeeinnovators.org/dashboard/tasks",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "update_task_stage",
      message: `Failed to update task: ${error.message}`,
    };
  }
}

/**
 * 7. Approve or Reject Hardware Part Request
 */
export async function executeApprovePartRequest(
  requestId: string,
  decision: "approved" | "rejected",
  notes?: string
): Promise<OperationResult> {
  try {
    const updated = await opApproveOrRejectPartRequest(requestId, decision, notes);
    return {
      success: true,
      action: "approve_part_request",
      message: `🛠️ Part request #${requestId} has been marked as ${decision.toUpperCase()}!`,
      details: updated,
      liveLink: "https://www.robobeeinnovators.org/dashboard/admin/requests",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "approve_part_request",
      message: `Failed to process part request: ${error.message}`,
    };
  }
}

/**
 * 8. Record Treasury Expense or Income
 */
export async function executeRecordTreasury(input: TreasuryEntryInput): Promise<OperationResult> {
  try {
    const doc = await opRecordTreasuryEntry(input);
    const sign = doc.type === "income" ? "+" : "-";
    return {
      success: true,
      action: "record_treasury",
      message: `💰 Treasury ${doc.type.toUpperCase()} recorded:\n- Title: "${doc.title}"\n- Amount: ${sign}${doc.amount} BDT\n- Category: ${doc.category}`,
      details: doc,
      liveLink: "https://www.robobeeinnovators.org/dashboard/admin/finance",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "record_treasury",
      message: `Failed to record treasury entry: ${error.message}`,
    };
  }
}

/**
 * 9. Update Member Role or Custom Designation
 */
export async function executeUpdateMemberRole(params: {
  emailOrUserId: string;
  role: "admin" | "member" | "pending";
  roleTitle?: string;
}): Promise<OperationResult> {
  try {
    const updated = await opUpdateMemberRole(params);
    return {
      success: true,
      action: "update_member_role",
      message: `👥 Member "${updated.email || params.emailOrUserId}" permissions updated:\n- Role: ${updated.role.toUpperCase()}${updated.roleTitle ? `\n- Designation: ${updated.roleTitle}` : ""}`,
      details: updated,
      liveLink: "https://www.robobeeinnovators.org/dashboard/admin/members",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "update_member_role",
      message: `Failed to update member role: ${error.message}`,
    };
  }
}

/**
 * 10. Ingest Social Media / RoboBee Page Post
 * Automatically extracts tournament awards, achievements, or competition notices
 * from raw post text and publishes them to the website!
 */
export async function executeIngestRoboBeePagePost(postText: string, imageUrl?: string): Promise<OperationResult> {
  try {
    const prompt = `
You are the RoboBee Innovators Lead AI Architect.
Analyze this Facebook / Instagram / Social Media post from RoboBee Innovators:

"""
${postText}
"""

Determine if this post represents:
A) An "ACHIEVEMENT" (award won, tournament medal, championship, national honor, exhibition milestone)
B) A "COMPETITION" (upcoming contest, robot battle, registration call, arena event)
C) A "FEATURED_PROJECT" (showcase of a signature robot build, e.g. agricultural bot, drone, rover)
D) A "GENERAL_ANNOUNCEMENT" (workshop, class, general update)

Output ONLY valid JSON matching this schema:
{
  "type": "ACHIEVEMENT" | "COMPETITION" | "FEATURED_PROJECT" | "GENERAL_ANNOUNCEMENT",
  "title": "Clean, punchy headline",
  "year": "2026",
  "description": "Engaging 1-2 sentence description highlighting the students, team, or challenge",
  "category": "International Milestone" | "National Milestone" | "Maker Lab Innovation" | "Outreach",
  "competitionDate": "YYYY-MM-DD or approx date if competition",
  "location": "Venue or city",
  "purseBdt": 0,
  "segments": ["Sumo Bot", "Soccer Bot"]
}
`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash"];
    let rawJson = "{}";
    for (const m of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });
        if (res.text) {
          rawJson = res.text;
          break;
        }
      } catch (e) {
        console.warn(`[ExecutiveOperations] Model ${m} fallback:`, e);
      }
    }

    const parsed = JSON.parse(rawJson || "{}");

    if (parsed.type === "ACHIEVEMENT") {
      const ach = await opAddAchievement({
        title: parsed.title,
        year: parsed.year || "2026",
        description: parsed.description,
        category: parsed.category || "National Milestone",
        image: imageUrl || "",
      });
      return {
        success: true,
        action: "ingest_achievement",
        message: `🏆 Ingested and published Achievement from RoboBee post:\n- Title: "${ach.title}"\n- Category: ${ach.category}\n- Year: ${ach.year}\n- Summary: ${ach.description}`,
        details: ach,
        liveLink: "https://www.robobeeinnovators.org#achievements",
      };
    } else if (parsed.type === "COMPETITION") {
      const comp = await opLaunchCompetition({
        name: parsed.title,
        date: parsed.competitionDate || new Date().toISOString().split("T")[0],
        location: parsed.location || "RoboBee Maker Lab, Narayanganj",
        description: parsed.description,
        purseBdt: parsed.purseBdt || 0,
        visibility: "public_and_members",
        segments: (parsed.segments || ["Robo Challenge"]).map((segName: string, i: number) => ({
          name: segName,
          fee: 500,
          maxParticipants: 20,
        })),
      });
      return {
        success: true,
        action: "ingest_competition",
        message: `🚀 Ingested and launched Competition from RoboBee post:\n- Name: "${comp.name}"\n- Date: ${comp.date}\n- Segments: ${comp.segments.map((s: any) => s.name).join(", ")}`,
        details: comp,
        liveLink: "https://www.robobeeinnovators.org/dashboard/competitions",
      };
    } else {
      const proj = await opAddFeaturedProject({
        title: parsed.title,
        description: parsed.description,
        image: imageUrl || "",
      });
      return {
        success: true,
        action: "ingest_project",
        message: `🤖 Ingested and published Featured Project from RoboBee post:\n- Title: "${proj.title}"\n- Description: ${proj.description}`,
        details: proj,
        liveLink: "https://www.robobeeinnovators.org#projects",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      action: "ingest_post",
      message: `Failed to ingest post content: ${error.message}`,
    };
  }
}

/**
 * 11. Get Live Platform Status
 */
export async function executeGetPlatformStatus(): Promise<OperationResult> {
  try {
    const summary = await opGetPlatformStatusSummary();
    const compList =
      summary.upcomingCompetitions.length > 0
        ? summary.upcomingCompetitions.map((c) => `  • "${c.name}" (${c.date}) [${c.visibility}]`).join("\n")
        : "  None currently scheduled.";

    const partList =
      summary.pendingPartRequests.length > 0
        ? summary.pendingPartRequests.map((p) => `  • #${p.id}: ${p.partName} (by ${p.requestedBy})`).join("\n")
        : "  All clear! Zero pending requests.";

    const msg = `📊 LIVE PLATFORM CONTROL STATUS:\n` +
      `• Total Public Achievements: ${summary.totalAchievements}\n` +
      `• Total Competitions: ${summary.totalCompetitions}\n${compList}\n` +
      `• Featured Robot Projects: ${summary.totalFeaturedProjects}\n` +
      `• Registered Club Members: ${summary.totalRegisteredMembers}\n` +
      `• Pending Hardware Part Requests (${summary.pendingPartRequestsCount}):\n${partList}`;

    return {
      success: true,
      action: "platform_status",
      message: msg,
      details: summary,
      liveLink: "https://www.robobeeinnovators.org/dashboard",
    };
  } catch (error: any) {
    return {
      success: false,
      action: "platform_status",
      message: `Failed to fetch status: ${error.message}`,
    };
  }
}
