import { NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  evaluateConversationAndCreateTask,
  findConversationByPhoneNumber,
  processPendingConfirmations,
} from "@/lib/whatsappAgent";

export const dynamic = "force-dynamic";

/**
 * ============================================================================
 * META WHATSAPP CLOUD API WEBHOOK ENDPOINT
 * ============================================================================
 * Path: /api/webhooks/whatsapp
 * Handles:
 *  1. GET: Webhook verification challenge from Meta Developer Dashboard
 *  2. POST: Ingestion of incoming messages, images, PDFs, echoes from WhatsApp Business app, and status updates.
 *     Saves all messages to the Unified Messaging Hub, and ONLY invokes AI
 *     when the contact's ai_mode is explicitly set to 'task_observer' or 'auto_pilot'.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken =
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "robobee_innovators_secret_verify_token_2026";

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
    const entries = body?.entry || [];

    for (const entry of entries) {
      const changes = entry?.changes || [];

      for (const change of changes) {
        const value = change?.value;
        if (!value) continue;

        // 1. Log delivery receipts / status reports from Meta (do NOT return early)
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const st of value.statuses) {
            console.log(
              `[WhatsApp Webhook] Delivery status: ${st.status} for recipient: ${st.recipient_id}. Errors:`,
              st.errors || "None"
            );
          }
        }

        // 2. Handle Message Echoes (messages sent by Mahir from WhatsApp Business mobile app)
        const rawEchoes =
          value.message_echoes ||
          value.smb_message_echoes ||
          (change.field === "smb_message_echoes" ? value.message_echoes || value.messages : null) ||
          [];

        const echoes = Array.isArray(rawEchoes) ? rawEchoes : [rawEchoes].filter(Boolean);

        if (echoes.length > 0) {
          for (const echo of echoes) {
            const recipientPhone =
              echo.to ||
              echo.to_user_id ||
              echo.recipient_id ||
              echo.recipient?.id ||
              echo.wa_id ||
              "";

            const echoText =
              echo.text?.body ||
              echo.body ||
              echo.message?.text?.body ||
              echo.message?.text ||
              (echo.image
                ? "[Photo sent by Mahir]"
                : echo.document
                ? `[Document: ${echo.document?.filename || "file.pdf"}]`
                : "[Message sent by Mahir]");
            const echoWamId = echo.id || echo.mid;
            const echoType = echo.type || "text";

            console.log(
              `[WhatsApp Webhook] Captured echo sent by Mahir to ${recipientPhone}: "${echoText}"`
            );

            // Locate conversation using robust phone matching
            let conv = await findConversationByPhoneNumber(recipientPhone);

            if (!conv) {
              const { data: newConv } = await supabaseAdmin
                .from("whatsapp_conversations")
                .insert({
                  phone_number: recipientPhone,
                  platform: "whatsapp",
                  ai_mode: "off",
                  contact_category: "personal",
                  status: "casual",
                  last_message_at: new Date().toISOString(),
                })
                .select("*")
                .single();
              conv = newConv;
            } else {
              // Update last message time and push pending confirmation timer (reset debounce)
              const resetDue = conv.pending_confirmation_due_at
                ? new Date(Date.now() + 150 * 1000).toISOString()
                : null;

              await supabaseAdmin
                .from("whatsapp_conversations")
                .update({
                  last_message_at: new Date().toISOString(),
                  ...(resetDue ? { pending_confirmation_due_at: resetDue } : {}),
                })
                .eq("id", conv.id);
            }

            if (conv?.id) {
              await supabaseAdmin.from("whatsapp_messages").insert({
                conversation_id: conv.id,
                wam_id: echoWamId,
                sender_type: "agent_mahir",
                message_type: echoType,
                body: echoText,
                raw_payload: echo,
              });

              // If this contact has AI enabled, run evaluation
              if (conv.ai_mode && conv.ai_mode !== "off") {
                const convId = conv.id;
                after(async () => {
                  try {
                    await evaluateConversationAndCreateTask(convId);
                  } catch (err) {
                    console.error("[WhatsApp Webhook] Async AI evaluation failed on echo:", err);
                  }
                });
              }
            }
          }
        }

        // 3. Handle Inbound Messages
        if (value.messages && Array.isArray(value.messages)) {
          const contact = value.contacts?.[0];

          for (const message of value.messages) {
            const rawSenderPhone =
              message.from ||
              message.from_user_id ||
              contact?.wa_id ||
              contact?.user_id ||
              "";

            const metaPhoneNumberId = value.metadata?.phone_number_id || "1480815671771528";
            const metaDisplayPhone = (value.metadata?.display_phone_number || "").replace(/\D/g, "");

            const isOutboundFromMahir =
              Boolean(message.is_echo) ||
              rawSenderPhone.includes("1902821018") ||
              rawSenderPhone === metaPhoneNumberId ||
              (metaDisplayPhone && rawSenderPhone.includes(metaDisplayPhone)) ||
              (message.to &&
                !message.to.includes("1902821018") &&
                rawSenderPhone.endsWith("1902821018"));

            const targetPhone = isOutboundFromMahir
              ? message.to || message.to_user_id || message.recipient_id || contact?.wa_id || rawSenderPhone
              : rawSenderPhone;

            const senderType = isOutboundFromMahir ? "agent_mahir" : "customer";
            const profileName = isOutboundFromMahir
              ? "Mahir Rahman (RoboBee Leader)"
              : contact?.profile?.name || "Contact";
            const wamId = message.id;
            const msgType = message.type;

            let bodyText: string | null = null;
            let mediaUrl: string | null = null;
            let mediaMimeType: string | null = null;
            let mediaCaption: string | null = null;

            if (msgType === "text") {
              bodyText = message.text?.body || "";
            } else if (msgType === "image") {
              bodyText =
                message.image?.caption ||
                (isOutboundFromMahir ? "[Photo sent by Mahir]" : "[Image sent]");
              mediaCaption = message.image?.caption || null;
              mediaMimeType = message.image?.mime_type || "image/jpeg";
              mediaUrl = message.image?.id || null;
            } else if (msgType === "document") {
              bodyText =
                message.document?.caption ||
                `[Document: ${message.document?.filename || "file.pdf"}]`;
              mediaCaption = message.document?.caption || null;
              mediaMimeType = message.document?.mime_type || "application/pdf";
              mediaUrl = message.document?.id || null;
            } else {
              bodyText = `[Received ${msgType} message]`;
            }

            // Locate conversation with robust matcher
            let conversation = await findConversationByPhoneNumber(targetPhone);

            if (!conversation) {
              const { data: newConv, error: createConvErr } = await supabaseAdmin
                .from("whatsapp_conversations")
                .insert({
                  phone_number: targetPhone,
                  contact_name: isOutboundFromMahir ? "Contact" : profileName,
                  platform: "whatsapp",
                  ai_mode: "off",
                  contact_category: "personal",
                  status: "casual",
                  last_message_at: new Date().toISOString(),
                })
                .select("*")
                .single();

              if (createConvErr) {
                console.error("[WhatsApp Webhook] Failed to create conversation:", createConvErr);
                continue;
              }
              conversation = newConv;
            } else {
              // Reset debounce timer on new message
              const resetDue = conversation.pending_confirmation_due_at
                ? new Date(Date.now() + 150 * 1000).toISOString()
                : null;

              await supabaseAdmin
                .from("whatsapp_conversations")
                .update({
                  last_message_at: new Date().toISOString(),
                  ...(!isOutboundFromMahir &&
                  (!conversation.contact_name || conversation.contact_name === "Contact")
                    ? { contact_name: profileName }
                    : {}),
                  ...(resetDue ? { pending_confirmation_due_at: resetDue } : {}),
                })
                .eq("id", conversation.id);
            }

            // Insert message into Supabase
            const { error: insertMsgErr } = await supabaseAdmin
              .from("whatsapp_messages")
              .insert({
                conversation_id: conversation.id,
                wam_id: wamId,
                sender_type: senderType,
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

            // Trigger AI evaluation ONLY if ai_mode is explicitly enabled ('task_observer' or 'auto_pilot')
            if (conversation?.id && conversation.ai_mode && conversation.ai_mode !== "off") {
              const convId = conversation.id;
              after(async () => {
                try {
                  await evaluateConversationAndCreateTask(convId);
                } catch (err) {
                  console.error("[WhatsApp Webhook] Async AI evaluation failed:", err);
                }
              });
            }
          }
        }
      }
    }

    // Process any pending confirmations for settled conversations
    after(async () => {
      try {
        await processPendingConfirmations();
      } catch (e) {
        console.error("[WhatsApp Webhook] Background processPendingConfirmations error:", e);
      }
    });

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (err) {
    console.error("[WhatsApp Webhook] Error processing webhook:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
