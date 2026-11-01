import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { evaluateConversationAndCreateTask } from "@/lib/whatsappAgent";

/**
 * ============================================================================
 * META WHATSAPP CLOUD API WEBHOOK ENDPOINT
 * ============================================================================
 * Path: /api/webhooks/whatsapp
 * Handles:
 *  1. GET: Webhook verification challenge from Meta Developer Dashboard
 *  2. POST: Ingestion of incoming messages, images, PDFs, and status updates
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "robobee_innovators_secret_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    console.log("[WhatsApp Webhook] Meta challenge verified successfully.");
    return new Response(challenge || "", { status: 200 });
  }

  console.warn("[WhatsApp Webhook] Verification failed. Token mismatch.");
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends ping events or delivery receipts without messages
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value || !value.messages || value.messages.length === 0) {
      // Acknowledge status pings (sent, delivered, read receipts)
      return NextResponse.json({ status: "ignored_non_message_event" }, { status: 200 });
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    const senderPhone = message.from; // e.g. "8801902821018"
    const profileName = contact?.profile?.name || "Guardian / Student";
    const wamId = message.id;
    const msgType = message.type; // "text", "image", "document", etc.

    let bodyText: string | null = null;
    let mediaUrl: string | null = null;
    let mediaMimeType: string | null = null;
    let mediaCaption: string | null = null;

    if (msgType === "text") {
      bodyText = message.text?.body || "";
    } else if (msgType === "image") {
      bodyText = message.image?.caption || "[Image sent]";
      mediaCaption = message.image?.caption || null;
      mediaMimeType = message.image?.mime_type || "image/jpeg";
      mediaUrl = message.image?.id || null; // Stores Meta Media ID for download
    } else if (msgType === "document") {
      bodyText = message.document?.caption || `[Document: ${message.document?.filename || "file.pdf"}]`;
      mediaCaption = message.document?.caption || null;
      mediaMimeType = message.document?.mime_type || "application/pdf";
      mediaUrl = message.document?.id || null;
    } else {
      bodyText = `[Received ${msgType} message]`;
    }

    // 1. Locate or create conversation thread in Supabase
    let { data: conversation } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select("id, status")
      .eq("phone_number", senderPhone)
      .maybeSingle();

    if (!conversation) {
      const { data: newConv, error: createConvErr } = await supabaseAdmin
        .from("whatsapp_conversations")
        .insert({
          phone_number: senderPhone,
          contact_name: profileName,
          status: "casual",
          last_message_at: new Date().toISOString(),
        })
        .select("id, status")
        .single();

      if (createConvErr) {
        console.error("[WhatsApp Webhook] Failed to create conversation:", createConvErr);
        return NextResponse.json({ error: "db_error" }, { status: 500 });
      }
      conversation = newConv;
    } else {
      await supabaseAdmin
        .from("whatsapp_conversations")
        .update({
          last_message_at: new Date().toISOString(),
          contact_name: profileName,
        })
        .eq("id", conversation.id);
    }

    // 2. Insert message into Supabase
    const { error: insertMsgErr } = await supabaseAdmin
      .from("whatsapp_messages")
      .insert({
        conversation_id: conversation.id,
        wam_id: wamId,
        sender_type: "customer",
        message_type: msgType,
        body: bodyText,
        media_url: mediaUrl,
        media_mime_type: mediaMimeType,
        media_caption: mediaCaption,
        raw_payload: message,
      });

    if (insertMsgErr) {
      console.error("[WhatsApp Webhook] Failed to insert message:", insertMsgErr);
    }

    // 3. Trigger asynchronous background AI evaluation
    // Next.js returns 200 immediately to Meta, processing the decision engine asynchronously
    if (conversation?.id) {
      // Execute without blocking the Meta 200 OK response
      setTimeout(async () => {
        try {
          await evaluateConversationAndCreateTask(conversation.id);
        } catch (err) {
          console.error("[WhatsApp Webhook] Async AI evaluation failed:", err);
        }
      }, 3000); // 3-second debounce window
    }

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (err) {
    console.error("[WhatsApp Webhook] Error processing webhook:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
