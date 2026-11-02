import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  AIMode,
  evaluateConversationAndCreateTask,
  executeAICommandOrBroadcast,
  sendWhatsAppTextMessage,
} from "@/lib/whatsappAgent";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedConvId = searchParams.get("conversationId");

    const { data: conversations, error: convErr } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (convErr) {
      return NextResponse.json({ error: convErr.message }, { status: 500 });
    }

    const activeConvId = requestedConvId || conversations?.[0]?.id || null;
    let messages: unknown[] = [];
    let linkedTasks: unknown[] = [];

    if (activeConvId) {
      const [msgRes, taskRes] = await Promise.all([
        supabaseAdmin
          .from("whatsapp_messages")
          .select("*")
          .eq("conversation_id", activeConvId)
          .order("created_at", { ascending: true })
          .limit(100),
        supabaseAdmin
          .from("tasks")
          .select("id, title, stage, status, budget_bdt, due_date, student_name, school_name, class_grade")
          .eq("conversation_id", activeConvId)
          .order("created_at", { ascending: false }),
      ]);

      messages = msgRes.data || [];
      linkedTasks = taskRes.data || [];
    }

    return NextResponse.json({
      conversations: conversations || [],
      activeConversationId: activeConvId,
      messages,
      linkedTasks,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Update Contact AI Mode & Metadata
    if (action === "update_settings") {
      const {
        conversationId,
        ai_mode,
        contact_category,
        contact_name,
        school_name,
        class_grade,
        custom_ai_instructions,
        runNow,
      } = body;

      if (!conversationId) {
        return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
      }

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (ai_mode !== undefined) updatePayload.ai_mode = ai_mode;
      if (contact_category !== undefined) updatePayload.contact_category = contact_category;
      if (contact_name !== undefined) updatePayload.contact_name = contact_name;
      if (school_name !== undefined) updatePayload.school_name = school_name;
      if (class_grade !== undefined) updatePayload.class_grade = class_grade;
      if (custom_ai_instructions !== undefined) updatePayload.custom_ai_instructions = custom_ai_instructions;

      const { data: updated, error } = await supabaseAdmin
        .from("whatsapp_conversations")
        .update(updatePayload)
        .eq("id", conversationId)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      let analysis = null;
      if (runNow && updated.ai_mode !== "off") {
        analysis = await evaluateConversationAndCreateTask(conversationId, {
          forceRun: true,
          overrideMode: updated.ai_mode as AIMode,
        });
      }

      return NextResponse.json({ status: "ok", conversation: updated, analysis });
    }

    // 2. Send Manual Message as Mahir directly from the Website
    if (action === "send_manual_message") {
      const { conversationId, text } = body;
      if (!conversationId || !text?.trim()) {
        return NextResponse.json({ error: "Missing conversationId or text" }, { status: 400 });
      }

      const { data: conv } = await supabaseAdmin
        .from("whatsapp_conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (!conv) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      const trimmedText = text.trim();
      const dispatched = await sendWhatsAppTextMessage(conv.phone_number, trimmedText);

      const { data: insertedMsg, error: msgErr } = await supabaseAdmin
        .from("whatsapp_messages")
        .insert({
          conversation_id: conversationId,
          sender_type: "agent_mahir",
          message_type: "text",
          body: trimmedText,
        })
        .select("*")
        .single();

      await supabaseAdmin
        .from("whatsapp_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // If this contact has Task Observer or Auto-Pilot enabled, evaluate after Mahir's reply (e.g. when Mahir says "ok confirm")
      let analysis = null;
      if (conv.ai_mode && conv.ai_mode !== "off") {
        analysis = await evaluateConversationAndCreateTask(conversationId);
      }

      return NextResponse.json({
        status: "ok",
        dispatchedToWhatsApp: dispatched,
        message: insertedMsg,
        msgError: msgErr?.message || null,
        analysis,
      });
    }

    // 3. On-Demand AI Evaluation (Extract Tasks Now / Reply Now)
    if (action === "trigger_ai_now") {
      const { conversationId, mode } = body;
      if (!conversationId) {
        return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
      }

      const analysis = await evaluateConversationAndCreateTask(conversationId, {
        forceRun: true,
        overrideMode: (mode as AIMode) || "task_observer",
      });

      return NextResponse.json({ status: "ok", analysis });
    }

    // 4. AI Command & Multi-Member Broadcast
    if (action === "ai_command_or_broadcast") {
      const { instruction, usePolishAI, conversationIds } = body;
      if (!instruction?.trim() || !Array.isArray(conversationIds) || conversationIds.length === 0) {
        return NextResponse.json(
          { error: "Provide an instruction and at least one recipient." },
          { status: 400 }
        );
      }

      const { data: targets } = await supabaseAdmin
        .from("whatsapp_conversations")
        .select("id, phone_number, contact_name")
        .in("id", conversationIds);

      if (!targets || targets.length === 0) {
        return NextResponse.json({ error: "No matching recipients found." }, { status: 404 });
      }

      const result = await executeAICommandOrBroadcast({
        instruction,
        usePolishAI: Boolean(usePolishAI),
        targetConversations: targets,
      });

      return NextResponse.json({ status: "ok", ...result });
    }

    // 5. Add a New Contact / Team Member manually
    if (action === "create_contact") {
      const {
        phone_number,
        contact_name,
        platform = "whatsapp",
        contact_category = "personal",
        ai_mode = "off",
        school_name = null,
        class_grade = null,
      } = body;

      if (!phone_number?.trim()) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }

      const cleanPhone = phone_number.replace(/[^0-9]/g, "");

      const { data: existing } = await supabaseAdmin
        .from("whatsapp_conversations")
        .select("*")
        .eq("phone_number", cleanPhone)
        .maybeSingle();

      if (existing) {
        const { data: updated } = await supabaseAdmin
          .from("whatsapp_conversations")
          .update({
            contact_name: contact_name || existing.contact_name,
            contact_category: contact_category || existing.contact_category,
            ai_mode: ai_mode || existing.ai_mode,
            school_name: school_name || existing.school_name,
            class_grade: class_grade || existing.class_grade,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select("*")
          .single();
        return NextResponse.json({ status: "ok", conversation: updated });
      }

      const { data: created, error } = await supabaseAdmin
        .from("whatsapp_conversations")
        .insert({
          phone_number: cleanPhone,
          contact_name: contact_name || cleanPhone,
          platform,
          contact_category,
          ai_mode,
          school_name,
          class_grade,
          status: "casual",
          last_message_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ status: "ok", conversation: created });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
