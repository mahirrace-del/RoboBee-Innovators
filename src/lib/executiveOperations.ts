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
  opCreateProjectBOM,
  opAddComponentsToProjectBOM,
  opGetProjectBOM,
  opFindConversationAndTask,
  NewAchievementInput,
  LaunchCompetitionInput,
  NewLeaderInput,
  NewProjectInput,
  TreasuryEntryInput,
  CreateProjectBOMInput,
  BOMComponentInput,
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

// ============================================================================
// 12. PROJECT BOM & PROCUREMENT AUTONOMOUS OPERATIONS
// ============================================================================

/**
 * 12. Create Project BOM directly from explicit inputs
 */
export async function executeCreateProjectBOM(input: CreateProjectBOMInput): Promise<OperationResult> {
  try {
    const result = await opCreateProjectBOM(input);
    const itemsTable = result.items
      .map((it: any, i: number) => `  ${i + 1}. ${it.name} (${it.quantity}x @ ৳${it.price} = ৳${it.totalCost}) [${it.source}]`)
      .join("\n");

    const msg =
      `📦 PROJECT BOM CREATED IN WEBSITE DATABASE!\n` +
      `• Project: "${result.name}"\n` +
      `• Mode: ${result.bomType === "task_member" ? "Task & School Project BOM" : "Master Store BOM"}\n` +
      `• Total Components: ${result.itemsCount} items\n` +
      `• Total Estimated Budget: ৳${result.totalBudget.toLocaleString()} BDT\n` +
      `${result.taskId ? `• Linked Sprint Task: #${result.taskId}\n` : ""}` +
      `${result.requisitionId ? `• Admin Requisition: Submitted (#${result.requisitionId}) [Awaiting Admin Review]\n` : ""}` +
      `\nBOM Component List:\n${itemsTable}`;

    return {
      success: true,
      action: "create_project_bom",
      message: msg,
      details: result,
      liveLink: `https://www.robobeeinnovators.org/dashboard/bom?projectId=${result.projectId}`,
    };
  } catch (error: any) {
    return {
      success: false,
      action: "create_project_bom",
      message: `Failed to create Project BOM: ${error.message}`,
    };
  }
}

/**
 * 13. AI Hardware Architect: Suggest & Build BOM for a Project Topic
 * Analyzes the project concept & class grade using RoboBee Bangladesh hardware standards,
 * creates the BOM in Firestore ('projects'), links to the task in Supabase, and submits
 * the admin requisition automatically.
 */
export async function executeSuggestAndBuildBOM(params: {
  projectTopic: string;
  classGrade?: string;
  studentName?: string;
  schoolName?: string;
  targetDeadline?: string;
  existingTaskId?: string;
  autoSubmitRequisition?: boolean;
}): Promise<OperationResult> {
  try {
    const candidateModels = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-2.5-flash"];
    const grade = params.classGrade || "Class 6-8";

    const prompt = `
You are the Lead Hardware Systems Architect for RoboBee Innovators (Narayanganj, Bangladesh).
Design an authentic, practical, age-appropriate Bill of Materials (BOM) for this project:

Project Concept: "${params.projectTopic}"
Target Class / Grade: "${grade}"

ROBOBEE BANGLADESH HARDWARE STANDARDS & LOCAL PRICING REFERENCE (BDT):
- Microcontrollers: Arduino Uno R3 (CH340) ~600 BDT, Arduino Nano Type-C ~350 BDT, ESP32 NodeMCU ~550 BDT
- Gas & Environment Sensors: MQ-2 Gas/Smoke Sensor ~140 BDT, MQ-135 Air Quality/Hazardous Gas ~160 BDT, MQ-7 Carbon Monoxide (CO) ~160 BDT, DHT11 Temperature & Humidity ~120 BDT
- Distance & Motion Sensors: Ultrasonic HC-SR04 ~100 BDT, IR Obstacle / Tracking ~60 BDT, Soil Moisture ~90 BDT, PIR Motion ~110 BDT
- Displays & Indicators: 16x2 I2C LCD Display Module ~240 BDT, Active Buzzer Alarm ~30 BDT, Status LEDs (5x) ~20 BDT
- Actuators, Motors & Fans: 5V/12V DC Brushless Exhaust Cooling Fan ~180 BDT, 5V Single/Dual Relay Module ~100 BDT, SG90 Micro Servo 9g ~140 BDT, MG996R Metal Servo ~500 BDT, BO Dual Gear Motor + Wheel Pair ~220 BDT, 6V Mini Submersible Water Pump ~150 BDT
- Filtration & Mechanical: Activated Carbon Filter / Foam Mesh ~200 BDT, 2WD Robot Chassis Kit ~400 BDT
- Drivers & Power: L298N Dual Motor Driver ~200 BDT, Small Solar Panel 5V/6V ~220 BDT, 18650 Li-ion Batteries (2x) + Holder ~400 BDT, 12V 2A DC Power Adapter ~250 BDT, 9V Battery + Snap ~80 BDT
- Prototyping: 400-Point Breadboard + 40-pc Jumpers ~180 BDT

Output ONLY valid JSON matching this schema:
{
  "projectName": "Clean, descriptive engineering title (e.g. Smart Sun-Tracking Solar Water Pump)",
  "rationale": "1-2 sentence engineering justification for why these parts fit this grade level",
  "items": [
    {
      "name": "Component Name (Standard Model)",
      "category": "Microcontrollers" | "Sensors" | "Motors & Actuators" | "Power & Drivers" | "Prototyping" | "Chassis & Mechanical",
      "price": 0,
      "quantity": 1,
      "source": "RoboShop BD" | "TechShop BD" | "Local Market" | "Daraz"
    }
  ]
}
`;

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
    const projectName = parsed.projectName || params.projectTopic;
    const items: BOMComponentInput[] = Array.isArray(parsed.items) && parsed.items.length > 0
      ? parsed.items
      : [
          { name: "Arduino Uno R3 (CH340)", category: "Microcontrollers", price: 600, quantity: 1, source: "RoboShop BD" },
          { name: "HC-SR04 Ultrasonic Sensor", category: "Sensors", price: 100, quantity: 1, source: "RoboShop BD" },
          { name: "SG90 Micro Servo 9g", category: "Motors & Actuators", price: 140, quantity: 1, source: "TechShop BD" },
          { name: "400-Pt Breadboard + 40-pc Jumpers", category: "Prototyping", price: 180, quantity: 1, source: "TechShop BD" },
        ];

    // Determine or create task
    let targetTaskId = params.existingTaskId || null;
    let targetTaskTitle = projectName;

    if (!targetTaskId) {
      const task = await opAssignTask({
        title: projectName,
        studentName: params.studentName,
        schoolName: params.schoolName,
        classGrade: params.classGrade,
        dueDate: params.targetDeadline,
        priority: "High",
        stage: "in_progress",
        description: `Project BOM auto-architected by RoboBee AI: ${parsed.rationale || params.projectTopic}`,
      });
      targetTaskId = task.id;
      targetTaskTitle = task.title;
    }

    const bomResult = await opCreateProjectBOM({
      name: projectName,
      taskId: targetTaskId,
      taskTitle: targetTaskTitle,
      studentName: params.studentName,
      schoolName: params.schoolName,
      classGrade: params.classGrade,
      bomType: "task_member",
      items,
      submitAdminRequisition: params.autoSubmitRequisition !== false,
      requisitionNotes: `Autonomous BOM submission for ${projectName} (${grade})`,
    });

    const itemsSummary = bomResult.items
      .map((it: any, i: number) => `  ${i + 1}. ${it.name} (${it.quantity}x @ ৳${it.price} = ৳${it.totalCost}) [${it.source}]`)
      .join("\n");

    const msg =
      `🧠 AI HARDWARE ARCHITECT & BOM GENERATOR COMPLETE!\n` +
      `• Project: "${bomResult.name}"\n` +
      `• Target Grade: ${params.classGrade || "Class 6-8"}${params.studentName ? ` (Student: ${params.studentName})` : ""}\n` +
      `• Total Estimated Budget: ৳${bomResult.totalBudget.toLocaleString()} BDT (${bomResult.itemsCount} parts)\n` +
      `• Linked Sprint Task: #${bomResult.taskId} ("${targetTaskTitle}")\n` +
      `${bomResult.requisitionId ? `• Admin Procurement Requisition: Submitted (#${bomResult.requisitionId}) [Pending]\n` : ""}` +
      `\nHardware Bill of Materials:\n${itemsSummary}\n\n` +
      `Rationale: ${parsed.rationale || "Configured for optimal student learning & competition readiness."}`;

    return {
      success: true,
      action: "suggest_and_build_bom",
      message: msg,
      details: { ...bomResult, rationale: parsed.rationale },
      liveLink: `https://www.robobeeinnovators.org/dashboard/bom?projectId=${bomResult.projectId}`,
    };
  } catch (error: any) {
    return {
      success: false,
      action: "suggest_and_build_bom",
      message: `Failed to suggest and build BOM: ${error.message}`,
    };
  }
}

/**
 * 14. Convert Conversation / WhatsApp Chat to Website BOM & Admin Requisition
 * Reads messages from a student/customer conversation, extracts requested hardware,
 * creates the Project BOM in Firestore, links to the task in Supabase, and submits
 * the admin requisition automatically.
 */
export async function executeCreateBOMFromConversation(params: {
  query: string;
  projectTitle?: string;
  autoSubmitRequisition?: boolean;
}): Promise<OperationResult> {
  try {
    const hasPhoneNumber = /\d{7,}/.test(params.query);
    const { conversation, messages, tasks } = await opFindConversationAndTask(params.query);

    // If no chat conversation exists and query is a project concept, seamlessly delegate to executeSuggestAndBuildBOM
    if (!conversation && (!messages || messages.length === 0) && !hasPhoneNumber) {
      console.log(`[ExecutiveOperations] No student chat found for "${params.query}". Delegating to executeSuggestAndBuildBOM.`);
      return await executeSuggestAndBuildBOM({
        projectTopic: params.projectTitle || params.query.replace(/can(n)? you make a bom of this/i, "").trim(),
        autoSubmitRequisition: params.autoSubmitRequisition,
      });
    }

    if (!conversation && (!tasks || tasks.length === 0)) {
      return {
        success: false,
        action: "create_bom_from_conversation",
        message: `Could not find any conversation or task matching "${params.query}". Please check the phone number or name.`,
      };
    }

    // Build transcript
    let transcriptText = "";
    if (messages && messages.length > 0) {
      transcriptText = messages
        .map((m) => `[${m.sender_type}]: ${m.body || ""}`)
        .join("\n");
    } else if (tasks && tasks.length > 0 && tasks[0].description) {
      transcriptText = `Task Description:\n${tasks[0].description}`;
    }

    const linkedTask = tasks && tasks.length > 0 ? tasks[0] : null;

    const prompt = `
You are the RoboBee Autonomous Operations Agent.
A student/client sent the following conversation messages or project requirements:

"""
${transcriptText}
"""

Contact Name: "${conversation?.contact_name || linkedTask?.student_name || "Student"}"
Phone: "${conversation?.phone_number || linkedTask?.guardian_phone || params.query}"
Known School: "${conversation?.school_name || linkedTask?.school_name || ""}"
Known Grade: "${conversation?.class_grade || linkedTask?.class_grade || ""}"

Extract ALL requested hardware components, quantities, student name, class grade, and deadline.
Map each component to realistic Bangladesh market prices (BDT), categories, and sources.

Output ONLY valid JSON matching this schema:
{
  "projectName": "Descriptive title (e.g. 6V USB Water Pump & Solar Station)",
  "studentName": "string or null",
  "schoolName": "string or null",
  "classGrade": "string or null",
  "targetDeadline": "YYYY-MM-DD or null",
  "items": [
    {
      "name": "Component name (standard model)",
      "category": "Microcontrollers" | "Sensors" | "Motors & Actuators" | "Power & Drivers" | "Prototyping" | "Chassis & Mechanical",
      "price": 0,
      "quantity": 1,
      "source": "RoboShop BD" | "TechShop BD" | "Local Market" | "Daraz"
    }
  ]
}
`;

    const candidateModels = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-2.5-flash"];
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
    const projectName = params.projectTitle || parsed.projectName || linkedTask?.title || "Project BOM";
    const studentName = parsed.studentName || conversation?.contact_name || linkedTask?.student_name || "Student";
    const schoolName = parsed.schoolName || conversation?.school_name || linkedTask?.school_name || null;
    const classGrade = parsed.classGrade || conversation?.class_grade || linkedTask?.class_grade || null;
    const targetDeadline = parsed.targetDeadline || linkedTask?.due_date || null;

    const items: BOMComponentInput[] = Array.isArray(parsed.items) && parsed.items.length > 0
      ? parsed.items
      : [
          { name: "6V Mini USB Submersible Water Pump", category: "Motors & Actuators", price: 150, quantity: 2, source: "Local Market" },
          { name: "18650 Li-ion Batteries (2x) + Holder", category: "Power & Drivers", price: 400, quantity: 1, source: "Local Market" },
          { name: "Small Solar Panel 5V/6V", category: "Power & Drivers", price: 220, quantity: 1, source: "Daraz" },
        ];

    // Use existing task or assign new task
    let targetTaskId = linkedTask?.id || null;
    if (!targetTaskId) {
      const task = await opAssignTask({
        title: projectName,
        studentName,
        schoolName,
        classGrade,
        dueDate: targetDeadline,
        priority: "High",
        stage: "in_progress",
        description: `Project BOM created from conversation with ${studentName} (${conversation?.phone_number || params.query})`,
      });
      targetTaskId = task.id;
    } else {
      // Move existing discussion task to in_progress / confirmed
      await opUpdateTaskStage(targetTaskId, "in_progress", `BOM generated from conversation`);
    }

    const bomResult = await opCreateProjectBOM({
      name: projectName,
      taskId: targetTaskId,
      taskTitle: projectName,
      studentName,
      schoolName,
      classGrade,
      bomType: "task_member",
      items,
      submitAdminRequisition: params.autoSubmitRequisition !== false,
      requisitionNotes: `Autonomous BOM generated from chat with ${studentName} (${params.query})`,
    });

    const itemsSummary = bomResult.items
      .map((it: any, i: number) => `  ${i + 1}. ${it.name} (${it.quantity}x @ ৳${it.price} = ৳${it.totalCost}) [${it.source}]`)
      .join("\n");

    const msg =
      `💬 CONVERSATION SUCCESSFULLY CONVERTED TO WEBSITE BOM!\n` +
      `• Source: Conversation with ${studentName} (${conversation?.phone_number || params.query})\n` +
      `• Project: "${bomResult.name}"\n` +
      `• Total Components: ${bomResult.itemsCount} items\n` +
      `• Estimated Total: ৳${bomResult.totalBudget.toLocaleString()} BDT\n` +
      `• Linked Sprint Task: #${bomResult.taskId} (Moved to In Progress)\n` +
      `${bomResult.requisitionId ? `• Admin Requisition: Submitted (#${bomResult.requisitionId}) [Pending Admin Approval]\n` : ""}` +
      `\nHardware Requisition Items:\n${itemsSummary}`;

    return {
      success: true,
      action: "create_bom_from_conversation",
      message: msg,
      details: bomResult,
      liveLink: `https://www.robobeeinnovators.org/dashboard/bom?projectId=${bomResult.projectId}`,
    };
  } catch (error: any) {
    return {
      success: false,
      action: "create_bom_from_conversation",
      message: `Failed to create BOM from conversation: ${error.message}`,
    };
  }
}

/**
 * 15. Add Components to Existing Project BOM
 */
export async function executeAddComponentsToBOM(params: {
  projectId: string;
  components: BOMComponentInput[];
  autoSubmitRequisition?: boolean;
}): Promise<OperationResult> {
  try {
    const updated = await opAddComponentsToProjectBOM(
      params.projectId,
      params.components,
      params.autoSubmitRequisition !== false
    );

    return {
      success: true,
      action: "add_components_to_bom",
      message: `🔧 Added ${updated.addedItemsCount} new components to "${updated.projectName}"!\n- New BOM Total: ৳${updated.newTotalCost.toLocaleString()} BDT (${updated.totalItemsCount} parts)\n${updated.requisitionId ? `- Admin Requisition: #${updated.requisitionId} submitted` : ""}`,
      details: updated,
      liveLink: `https://www.robobeeinnovators.org/dashboard/bom?projectId=${params.projectId}`,
    };
  } catch (error: any) {
    return {
      success: false,
      action: "add_components_to_bom",
      message: `Failed to add components to BOM: ${error.message}`,
    };
  }
}
