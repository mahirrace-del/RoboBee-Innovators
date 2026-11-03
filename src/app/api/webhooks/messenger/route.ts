import { NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  evaluateConversationAndCreateTask,
  findConversationByPhoneNumber,
  processPendingConfirmations,
  sendMessengerTextMessage,
} from "@/lib/whatsappAgent";

export const dynamic = "force-dynamic";

/**
 * ============================================================================
 * META FACEBOOK MESSENGER WEBHOOK ENDPOINT
 * ============================================================================
 * Path: /api/webhooks/messenger
 *
 * Handles:
 *  1. GET: Webhook verification challenge from Meta App Dashboard (Messenger)
 *  2. POST: Ingestion of incoming Messenger messages, attachments, and admin echoes.
 *     Routes messages into the Unified Omnichannel Messaging Hub with platform = 'messenger'.
 *     Trigger AI evaluation ONLY if ai_mode is explicitly enabled ('task_observer' or 'auto_pilot').
 */

const FALLBACK_MESSENGER_TOKEN =
  "EAAbcLr4F7wEBSZCZAbZCJlrNNjzgJpcLyBvZBmALuq3V0lekD8xLcuSz5c8HRsEZAzGjsQOZCBte8AE9tZAX83htNzaUBdV3jSUZC0c1T5gyLGgJES6FTFdZAJqJwODwvZBcRjctpj29fPYulC2nQDIggLYYs9WspHgshIRkJZBpl1wAYhxWtUhBWPCwc1xi3yuUm7MuZBml";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken =
    process.env.MESSENGER_WEBHOOK_VERIFY_TOKEN ||
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
    "robobee_innovators_secret_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    console.log("[Messenger Webhook] Meta verification challenge verified successfully.");
    return new Response(challenge || "", { status: 200 });
  }

  console.warn("[Messenger Webhook] Verification failed. Token mismatch.");
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== "page") {
      return NextResponse.json({ status: "ignored_non_page_object" }, { status: 200 });
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      const messagingEvents = entry.messaging || entry.standby || [];

      for (const event of messagingEvents) {
        if (!event.message) {
          // May be delivery, read receipt, or postback
          continue;
        }

        const isEcho = Boolean(event.message.is_echo);
        const customerPsid = isEcho ? event.recipient?.id : event.sender?.id;

        if (!customerPsid) continue;

        const phoneIdentifier = `messenger_${customerPsid}`;
        const mid = event.message.mid || `m_${Date.now()}`;
        const msgText = event.message.text || "";
        const attachments = event.message.attachments || [];

        let bodyText = msgText;
        let mediaUrl: string | null = null;
        let mediaMimeType: string | null = null;

        if (!bodyText && attachments.length > 0) {
          const firstAtt = attachments[0];
          bodyText = `[Sent ${firstAtt.type || "attachment"}]`;
          mediaUrl = firstAtt.payload?.url || null;
          mediaMimeType = firstAtt.type || null;
        } else if (!bodyText) {
          bodyText = isEcho ? "[Message sent by RoboBee Admin]" : "[Message received]";
        }

        const senderType = isEcho ? "agent_mahir" : "customer";

        // Try to fetch Facebook User Profile name if Page Access Token is available
        let contactName = isEcho ? "Facebook Contact" : "Facebook User";
        const pageToken =
          process.env.MESSENGER_PAGE_ACCESS_TOKEN ||
          FALLBACK_MESSENGER_TOKEN ||
          process.env.WHATSAPP_ACCESS_TOKEN;

        if (!isEcho && pageToken) {
          try {
            const profileRes = await fetch(
              `https://graph.facebook.com/v21.0/${customerPsid}?fields=first_name,last_name,name&access_token=${pageToken}`
            );
            if (profileRes.ok) {
              const pData = await profileRes.json();
              if (pData.name) {
                contactName = pData.name;
              } else if (pData.first_name || pData.last_name) {
                contactName = [pData.first_name, pData.last_name].filter(Boolean).join(" ");
              }
            }
          } catch {
            // Silently fallback to default
          }
        }

        // 1. Locate or create conversation in Supabase with robust matching
        let conversation = await findConversationByPhoneNumber(phoneIdentifier);

        if (!conversation) {
          const { data: newConv, error: createErr } = await supabaseAdmin
            .from("whatsapp_conversations")
            .insert({
              phone_number: phoneIdentifier,
              contact_name: contactName,
              platform: "messenger",
              ai_mode: "off",
              contact_category: "client",
              status: "casual",
              last_message_at: new Date().toISOString(),
            })
            .select("id, status, ai_mode, contact_name, pending_confirmation_due_at")
            .single();

          if (createErr) {
            console.error("[Messenger Webhook] DB error creating conversation:", createErr);
            continue;
          }
          conversation = newConv;
        } else {
          // Reset debounce timer on ongoing activity
          const resetDue = conversation.pending_confirmation_due_at
            ? new Date(Date.now() + 150 * 1000).toISOString()
            : null;

          await supabaseAdmin
            .from("whatsapp_conversations")
            .update({
              last_message_at: new Date().toISOString(),
              platform: "messenger",
              ...(!isEcho && (!conversation.contact_name || conversation.contact_name === "Facebook User")
                ? { contact_name: contactName }
                : {}),
              ...(resetDue ? { pending_confirmation_due_at: resetDue } : {}),
            })
            .eq("id", conversation.id);
        }

        // 2. Insert message into Supabase
        await supabaseAdmin.from("whatsapp_messages").insert({
          conversation_id: conversation.id,
          wam_id: mid,
          sender_type: senderType,
          message_type: attachments.length > 0 ? "media" : "text",
          body: bodyText,
          media_url: mediaUrl,
          media_mime_type: mediaMimeType,
          raw_payload: event,
        });

        // 3. Trigger AI evaluation if ai_mode is enabled ('task_observer' or 'auto_pilot')
        if (conversation?.id && conversation.ai_mode && conversation.ai_mode !== "off") {
          const convId = conversation.id;
          after(async () => {
            try {
              await evaluateConversationAndCreateTask(convId);
            } catch (err) {
              console.error("[Messenger Webhook] Async AI evaluation failed:", err);
            }
          });
        }
      }
    }

    // Process any pending confirmations for settled conversations
    after(async () => {
      try {
        await processPendingConfirmations();
      } catch (e) {
        console.error("[Messenger Webhook] Background processPendingConfirmations error:", e);
      }
    });

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (err) {
    console.error("[Messenger Webhook] Error processing event:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
