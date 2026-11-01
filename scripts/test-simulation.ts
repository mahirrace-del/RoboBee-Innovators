import { supabaseAdmin } from "../src/lib/supabase";
import { evaluateConversationAndCreateTask } from "../src/lib/whatsappAgent";

async function runSimulation() {
  console.log("=================================================");
  console.log("🐝 ROBOBEE INNOVATORS — WHATSAPP AI AGENT SIMULATION");
  console.log("=================================================\n");

  const testPhone = "+8801700998877";
  const guardianName = "Mohammad Tareq (Zubayer's Father)";

  console.log(`1. Simulating inbound WhatsApp conversation from: ${guardianName} (${testPhone})...`);

  // 1. Create or get conversation
  const { data: conv, error: convErr } = await supabaseAdmin
    .from("whatsapp_conversations")
    .upsert(
      {
        phone_number: testPhone,
        contact_name: guardianName,
        school_name: "Heritage School",
        class_grade: "Class 7",
        status: "in_discussion",
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "phone_number" }
    )
    .select()
    .single();

  if (convErr || !conv) {
    console.error("Failed to create conversation:", convErr);
    return;
  }

  console.log(`   Conversation record ID: ${conv.id}`);

  // 2. Clear old messages for clean simulation run
  await supabaseAdmin.from("whatsapp_messages").delete().eq("conversation_id", conv.id);

  // 3. Simulate dialogue
  const messages = [
    {
      conversation_id: conv.id,
      sender_type: "customer",
      message_type: "text",
      body: "Assalamu Alaikum Mahir bhaiya. Amar chele Zubayer Heritage School er Class 7 e pore. Ora science fair e ekta Hydraulic Bridge banate chay. Apnara ki eta baniye dite parben?",
    },
    {
      conversation_id: conv.id,
      sender_type: "agent_mahir",
      message_type: "text",
      body: "Wa Alaikum Assalam Tareq uncle! Haan obosshoi. Class 7 er jonno amra dual-syringe hydraulic drawbridge banai jeta syringe diye smoothly uthe o naame, shathe red/green traffic LED signal thakbe. Total budget ashbe 2500 BDT.",
    },
    {
      conversation_id: conv.id,
      sender_type: "customer",
      message_type: "text",
      body: "Khub shundor hobe! Amader 5 November er moddhe lagbe, submission 6 November e. 5 November ki delivery dite parben?",
    },
    {
      conversation_id: conv.id,
      sender_type: "agent_mahir",
      message_type: "text",
      body: "Ji uncle, amra 5 November dupur 12 tar moddhe lab e ready kore rakhbo. Apni collect kore nite parben.",
    },
    {
      conversation_id: conv.id,
      sender_type: "customer",
      message_type: "text",
      body: "Alhamdulillah! Tahole confirm kore den bhaiya. Amra 5 November e lab theke Zubayer ke niye project collect korbo.",
    },
  ];

  console.log("2. Inserting simulated WhatsApp chat transcript...");
  const { error: msgErr } = await supabaseAdmin.from("whatsapp_messages").insert(messages);
  if (msgErr) {
    console.error("Failed to insert messages:", msgErr);
    return;
  }
  console.log("   5 messages logged successfully.");

  console.log("\n3. Triggering Gemini 3.5/3.8 Flash AI Decision Engine...");
  const result = await evaluateConversationAndCreateTask(conv.id);

  console.log("\n=================================================");
  console.log("📊 GEMINI DECISION & EXTRACTION RESULT");
  console.log("=================================================");
  console.log("State:", result?.state);
  console.log("Confidence:", result?.confidence);
  console.log("Project Title:", result?.projectTitle);
  console.log("Student:", result?.studentName);
  console.log("Class / Grade:", result?.classGrade);
  console.log("School:", result?.schoolName);
  console.log("Agreed Deadline:", result?.agreedDeadline);
  console.log("Budget:", result?.budgetBdt ? `${result.budgetBdt} BDT` : "Not specified");
  console.log("Hardware BOM:", result?.hardwareBOM);
  console.log("Needs Verification Message:", result?.needsVerificationMessage);

  console.log("\n4. Verifying Task in Supabase 'tasks' table...");
  const { data: createdTasks, error: taskFetchErr } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("conversation_id", conv.id);

  if (taskFetchErr) {
    console.error("Error fetching tasks:", taskFetchErr);
  } else {
    console.log(`   Found ${createdTasks?.length} Task(s) created in Supabase!`);
    createdTasks?.forEach((t) => {
      console.log(`   -> Task ID: ${t.id}`);
      console.log(`      Title: ${t.title}`);
      console.log(`      Stage: [${t.stage.toUpperCase()}]`);
      console.log(`      Priority: ${t.priority}`);
      console.log(`      Due Date: ${t.due_date}`);
      console.log(`      Assigned To: ${t.assigned_to}`);
    });
  }

  console.log("\n✅ End-to-end simulation completed successfully!\n");
}

runSimulation();
