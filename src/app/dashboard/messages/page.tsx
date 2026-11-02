"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { notifyTaskAssigned } from "@/lib/notifications";
import {
  MessageSquare,
  Send,
  Bot,
  ShieldOff,
  CheckSquare,
  Sparkles,
  RefreshCw,
  Search,
  UserPlus,
  Megaphone,
  Phone,
  School,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Users,
  Lock,
  Zap,
  Shield,
} from "lucide-react";

type AIMode = "off" | "task_observer" | "auto_pilot";
type ContactCategory = "personal" | "client" | "team_member" | "school_partner";

interface Conversation {
  id: string;
  phone_number: string;
  contact_name: string | null;
  school_name: string | null;
  class_grade: string | null;
  status: string;
  summary: string | null;
  platform: string;
  ai_mode: AIMode;
  contact_category: ContactCategory;
  custom_ai_instructions: string | null;
  last_message_at: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: "customer" | "agent_mahir" | "ai_assistant";
  message_type: string;
  body: string | null;
  media_url: string | null;
  created_at: string;
}

interface LinkedTask {
  id: string;
  title: string;
  description?: string | null;
  stage: string;
  status: string;
  budget_bdt: number | null;
  due_date: string | null;
  student_name: string | null;
  school_name: string | null;
  class_grade: string | null;
  guardian_phone?: string | null;
  conversation_id?: string | null;
  created_at?: string;
}

export default function MessagingControlPanel() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<LinkedTask[]>([]);
  const [allProjectTasks, setAllProjectTasks] = useState<LinkedTask[]>([]);
  const [topViewTab, setTopViewTab] = useState<"chat" | "summary_panel">("chat");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect non-admin members immediately
  useEffect(() => {
    if (!authLoading && role && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, role, router]);

  // Filters
  const [channelFilter, setChannelFilter] = useState<"all" | "whatsapp" | "messenger" | "instagram">("all");
  const [modeFilter, setModeFilter] = useState<"all" | AIMode | "team">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Composer state
  const [composerText, setComposerText] = useState("");
  const [composerMode, setComposerMode] = useState<"direct" | "ai_command">("direct");
  const [sending, setSending] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Contact Details Sidebar State
  const [showDetailsPane, setShowDetailsPane] = useState(true);
  const [editName, setEditName] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editCategory, setEditCategory] = useState<ContactCategory>("personal");
  const [editInstructions, setEditInstructions] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Modals: Add Contact & Broadcast
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ContactCategory>("personal");
  const [newAiMode, setNewAiMode] = useState<AIMode>("off");

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastInstruction, setBroadcastInstruction] = useState("");
  const [broadcastPolish, setBroadcastPolish] = useState(true);
  const [selectedBroadcastIds, setSelectedBroadcastIds] = useState<string[]>([]);
  const [broadcastSending, setBroadcastSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  const fetchHubData = useCallback(
    async (targetConvId?: string | null, silent = false) => {
      if (role !== "admin") return;
      if (!silent) setRefreshing(true);
      try {
        const query = targetConvId ? `?conversationId=${encodeURIComponent(targetConvId)}` : "";
        const res = await fetch(`/api/messages${query}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setConversations(data.conversations || []);
          const resolvedId = targetConvId || data.activeConversationId || null;
          setActiveId(resolvedId);
          setMessages(data.messages || []);
          setLinkedTasks(data.linkedTasks || []);
          setAllProjectTasks(data.allProjectTasks || []);
        }
      } catch (err) {
        console.error("Failed to fetch messaging hub:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [role]
  );

  useEffect(() => {
    fetchHubData(null);
  }, [fetchHubData]);

  // Poll every 8 seconds for live incoming WhatsApp messages without spending any AI tokens
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeId) {
        fetchHubData(activeId, true);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [activeId, fetchHubData]);

  // Populate right-hand contact editor when switching conversations
  useEffect(() => {
    if (activeConv) {
      setEditName(activeConv.contact_name || "");
      setEditSchool(activeConv.school_name || "");
      setEditClass(activeConv.class_grade || "");
      setEditCategory((activeConv.contact_category as ContactCategory) || "personal");
      setEditInstructions(activeConv.custom_ai_instructions || "");
    }
  }, [activeConv?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4500);
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    fetchHubData(id);
  };

  // Instant AI Mode change for active contact
  const handleChangeAIMode = async (newMode: AIMode) => {
    if (!activeConv) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_settings",
          conversationId: activeConv.id,
          ai_mode: newMode,
          contact_category: newMode !== "off" && activeConv.contact_category === "personal" ? "client" : activeConv.contact_category,
          runNow: false,
        }),
      });
      if (res.ok) {
        const modeNames: Record<AIMode, string> = {
          off: "Personal Mode (AI Off — 0 Tokens)",
          task_observer: "Task Observer (Reads Chat & Syncs Kanban Tasks)",
          auto_pilot: "AI Auto-Pilot (Replies on Behalf of Mahir + Syncs Tasks)",
        };
        showToast(`Switched to: ${modeNames[newMode]}`);
        await fetchHubData(activeConv.id, true);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveContactDetails = async () => {
    if (!activeConv) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_settings",
          conversationId: activeConv.id,
          contact_name: editName.trim() || null,
          school_name: editSchool.trim() || null,
          class_grade: editClass.trim() || null,
          contact_category: editCategory,
          custom_ai_instructions: editInstructions.trim() || null,
        }),
      });
      if (res.ok) {
        showToast("Contact profile & AI instructions saved.");
        await fetchHubData(activeConv.id, true);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendOrCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !composerText.trim()) return;
    setSending(true);
    try {
      if (composerMode === "direct") {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_manual_message",
            conversationId: activeConv.id,
            text: composerText,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setComposerText("");
          showToast(
            data.dispatchedToWhatsApp
              ? "Sent via WhatsApp & saved to history."
              : "Saved to chat history (Check WhatsApp token if not delivered)."
          );
          await fetchHubData(activeConv.id, true);
        }
      } else {
        // AI Command for this specific contact
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "ai_command_or_broadcast",
            instruction: composerText,
            usePolishAI: true,
            conversationIds: [activeConv.id],
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setComposerText("");
          showToast(`AI sent message on your behalf: "${data.generatedMessage}"`);
          await fetchHubData(activeConv.id, true);
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleTriggerAINow = async (overrideMode: AIMode) => {
    if (!activeConv) return;
    setAiRunning(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trigger_ai_now",
          conversationId: activeConv.id,
          mode: overrideMode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const st = data.analysis?.state || "ANALYZED";
        showToast(`AI Analysis complete: ${st}. Tasks synced to Backlog.`);
        await fetchHubData(activeConv.id, true);
      }
    } finally {
      setAiRunning(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_contact",
        phone_number: newPhone,
        contact_name: newName,
        contact_category: newCategory,
        ai_mode: newAiMode,
      }),
    });
    const data = await res.json();
    if (res.ok && data.conversation) {
      setShowAddModal(false);
      setNewPhone("");
      setNewName("");
      showToast("Contact added to Messaging Hub.");
      await fetchHubData(data.conversation.id);
    }
  };

  const handleExecuteBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInstruction.trim() || selectedBroadcastIds.length === 0) return;
    setBroadcastSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_command_or_broadcast",
          instruction: broadcastInstruction,
          usePolishAI: broadcastPolish,
          conversationIds: selectedBroadcastIds,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowBroadcastModal(false);
        setBroadcastInstruction("");
        showToast(`Broadcast dispatched to ${data.sentCount} recipient(s)!`);
        if (activeId) await fetchHubData(activeId, true);
      }
    } finally {
      setBroadcastSending(false);
    }
  };

  // Filtered conversation list
  const filteredConversations = conversations.filter((c) => {
    if (channelFilter !== "all" && (c.platform || "whatsapp") !== channelFilter) return false;
    if (modeFilter === "team" && c.contact_category !== "team_member") return false;
    if (modeFilter !== "all" && modeFilter !== "team" && (c.ai_mode || "off") !== modeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (c.contact_name || "").toLowerCase().includes(q);
      const matchPhone = (c.phone_number || "").toLowerCase().includes(q);
      const matchSchool = (c.school_name || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSchool) return false;
    }
    return true;
  });

  const selectBroadcastGroup = (group: "all" | "team_member" | "client") => {
    if (group === "all") {
      setSelectedBroadcastIds(conversations.map((c) => c.id));
    } else {
      setSelectedBroadcastIds(conversations.filter((c) => c.contact_category === group).map((c) => c.id));
    }
  };

  // Finalize an Ongoing Project Discussion into a Confirmed Task (Moves to Sprint Board Backlog)
  const handleFinalizeTask = async (params: { taskId?: string; conversationId?: string; title?: string }) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finalize_project_task",
          ...params,
        }),
      });
      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        showToast("Confirmed! Project moved to Task & Sprint Board Backlog.");
        if (resData.task) {
          notifyTaskAssigned({
            taskId: resData.task.id,
            taskTitle: resData.task.title || params.title || "New Project Task",
            priority: resData.task.priority || "High",
            dueDate: resData.task.due_date,
            assignedToEmails: ["GENERAL"],
            assignedByName: "Mahir Rahman",
          }).catch(() => {});
        }
        await fetchHubData(activeId, true);
      }
    } catch (e) {
      console.error("Failed to finalize task:", e);
    }
  };

  // Move a Finalized Task back to Ongoing Discussion
  const handleMoveToDiscussion = async (params: { taskId?: string; conversationId?: string }) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move_to_discussion",
          ...params,
        }),
      });
      if (res.ok) {
        showToast("Moved back to Ongoing Project Discussions (removed from Sprint Board).");
        await fetchHubData(activeId, true);
      }
    } catch (e) {
      console.error("Failed to move to discussion:", e);
    }
  };

  // Dismiss / Remove from Summary Panel
  const handleDismissSummary = async (params: { taskId?: string; conversationId?: string }) => {
    // Optimistically remove from UI immediately so the item disappears on first click
    if (params.taskId) {
      setAllProjectTasks((prev) => prev.filter((t) => t.id !== params.taskId));
      setLinkedTasks((prev) => prev.filter((t) => t.id !== params.taskId));
    }
    if (params.conversationId) {
      const remainingForConv = allProjectTasks.filter(
        (t) => t.conversation_id === params.conversationId && t.id !== params.taskId
      );
      if (!params.taskId || remainingForConv.length === 0) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === params.conversationId ? { ...c, status: "casual", summary: null } : c
          )
        );
      }
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dismiss_project_summary",
          ...params,
        }),
      });
      if (res.ok) {
        showToast("Removed from Project Summaries.");
        await fetchHubData(activeId, true);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(`Failed to remove: ${errData.error || "Error"}`);
        await fetchHubData(activeId, true);
      }
    } catch (e) {
      console.error("Failed to dismiss summary:", e);
    }
  };

  // Compute Ongoing Discussions vs Confirmed Tasks for the Summary & Task Staging Panel
  const ongoingProjectItems = allProjectTasks.filter((t) => t.stage === "in_discussion" || t.status === "in_discussion");
  const confirmedProjectItems = allProjectTasks.filter((t) => t.stage !== "in_discussion" && t.status !== "in_discussion");

  // Also include conversations that have an active project summary but no task row yet
  const convIdsWithTasks = new Set(allProjectTasks.map((t) => t.conversation_id).filter(Boolean));
  const summaryOnlyConvs = conversations.filter(
    (c) =>
      !convIdsWithTasks.has(c.id) &&
      c.status !== "casual" &&
      c.status !== "dismissed" &&
      Boolean(c.summary && c.summary.trim())
  );

  // Strict Admin-Only Guard: Regular members can NEVER view WhatsApp messages or AI task controls
  if (authLoading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#6f665e", fontWeight: 700 }}>
        Verifying Admin Access...
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div
        style={{
          margin: "3rem auto",
          maxWidth: "480px",
          padding: "2.25rem",
          borderRadius: "16px",
          background: "#fff",
          border: "1px solid #fca5a5",
          textAlign: "center",
        }}
      >
        <Shield size={36} color="#dc2626" style={{ marginBottom: "0.75rem" }} />
        <h2 style={{ margin: "0 0 0.5rem", color: "#991b1b", fontSize: "1.2rem" }}>
          Admin Access Only
        </h2>
        <p style={{ color: "#5c5149", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
          The Omnichannel Messaging &amp; WhatsApp AI Task Control Panel is restricted to administrators. You can view and work on confirmed tasks on the Task &amp; Sprint Board.
        </p>
        <Link
          href="/dashboard/tasks"
          style={{
            display: "inline-block",
            padding: "0.6rem 1.2rem",
            borderRadius: "9px",
            background: "#7A1C24",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          Go to Task &amp; Sprint Board
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 88px)", gap: "0.75rem" }}>
      {/* TOP BAR: OMNICHANNEL SWITCHER & TOKEN SHIELD */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "0.85rem 1.15rem",
          background: "#fff",
          border: "1px solid #e6dfd5",
          borderRadius: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#27211d",
              marginRight: "0.5rem",
            }}
          >
            <MessageSquare size={20} color="#7A1C24" />
            <span>Omnichannel Messaging &amp; AI Control</span>
          </div>

          {/* Platform Tabs */}
          {(
            [
              { id: "all", label: "All Channels", badge: conversations.length },
              { id: "whatsapp", label: "WhatsApp", badge: conversations.filter((c) => (c.platform || "whatsapp") === "whatsapp").length || "LIVE" },
              { id: "messenger", label: "Messenger", badge: conversations.filter((c) => c.platform === "messenger").length || "LIVE" },
              { id: "instagram", label: "Instagram", badge: "Ready" },
            ] as const
          ).map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannelFilter(ch.id)}
              style={{
                padding: "0.38rem 0.75rem",
                borderRadius: "999px",
                border: channelFilter === ch.id ? "1px solid #7A1C24" : "1px solid #dfd7cc",
                background: channelFilter === ch.id ? "#7A1C24" : "#f8f6f2",
                color: channelFilter === ch.id ? "#fff" : "#4a4039",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>{ch.label}</span>
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "0.08rem 0.4rem",
                  borderRadius: "99px",
                  background: channelFilter === ch.id ? "rgba(255,255,255,0.22)" : "#e8e2d9",
                  color: channelFilter === ch.id ? "#fff" : "#5c5149",
                }}
              >
                {ch.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
          {/* View Mode Toggle: Live Chat Inbox vs Project Summaries & Task Staging */}
          <div
            style={{
              display: "flex",
              background: "#f4f1ea",
              padding: "0.22rem",
              borderRadius: "10px",
              border: "1px solid #dfd7cc",
              gap: "0.2rem",
            }}
          >
            <button
              type="button"
              onClick={() => setTopViewTab("chat")}
              style={{
                padding: "0.38rem 0.75rem",
                borderRadius: "8px",
                border: "none",
                background: topViewTab === "chat" ? "#27211d" : "transparent",
                color: topViewTab === "chat" ? "#fff" : "#5c5149",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              💬 Live Chat Inbox
            </button>
            <button
              type="button"
              onClick={() => setTopViewTab("summary_panel")}
              style={{
                padding: "0.38rem 0.75rem",
                borderRadius: "8px",
                border: "none",
                background: topViewTab === "summary_panel" ? "#7A1C24" : "transparent",
                color: topViewTab === "summary_panel" ? "#fff" : "#5c5149",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <CheckSquare size={14} />
              <span>Project Summaries &amp; Task Staging ({ongoingProjectItems.length + summaryOnlyConvs.length} Ongoing / {confirmedProjectItems.length} Confirmed)</span>
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              padding: "0.35rem 0.65rem",
              borderRadius: "8px",
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              fontWeight: 600,
            }}
            title="New contacts default to Personal Mode (AI Off) so zero Gemini tokens are spent on personal chats."
          >
            <Lock size={13} />
            <span>Default = Personal (AI Off)</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.8rem",
              borderRadius: "9px",
              border: "1px solid #dfd7cc",
              background: "#f8f6f2",
              color: "#27211d",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <UserPlus size={15} />
            <span>Add Contact</span>
          </button>

          <button
            onClick={() => {
              setSelectedBroadcastIds(
                conversations.filter((c) => c.contact_category === "team_member").map((c) => c.id)
              );
              setShowBroadcastModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "9px",
              border: "none",
              background: "linear-gradient(135deg, #7A1C24, #9c6f18)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Megaphone size={15} />
            <span>AI Command / Group Broadcast</span>
          </button>

          <button
            onClick={() => fetchHubData(activeId)}
            style={{
              padding: "0.45rem 0.65rem",
              borderRadius: "9px",
              border: "1px solid #dfd7cc",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            title="Refresh messages"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {statusBanner && (
        <div
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "10px",
            background: "#1e293b",
            color: "#f8fafc",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>{statusBanner}</span>
        </div>
      )}

      {topViewTab === "summary_panel" ? (
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.9rem",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* COLUMN 1: ONGOING PROJECT CONVERSATIONS (NOT FINALIZED YET) */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6dfd5",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.9rem 1.1rem",
                borderBottom: "1px solid #eee7de",
                background: "#fffbeb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#92400e" }}>
                  ⏳ Ongoing Project Discussions (Not Finalized Yet)
                </div>
                <div style={{ fontSize: "0.75rem", color: "#78350f", marginTop: "0.15rem" }}>
                  Summarized from WhatsApp conversations. They stay here until confirmed in chat or finalized by you.
                </div>
              </div>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "99px",
                  background: "#fde68a",
                  color: "#92400e",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                }}
              >
                {ongoingProjectItems.length + summaryOnlyConvs.length}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {ongoingProjectItems.length === 0 && summaryOnlyConvs.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#7c7067", fontSize: "0.84rem" }}>
                  No unconfirmed ongoing project discussions right now.
                </div>
              ) : (
                <>
                  {ongoingProjectItems.map((item) => {
                    const convObj = conversations.find((c) => c.id === item.conversation_id);
                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: "0.9rem",
                          borderRadius: "12px",
                          border: "1px solid #fcd34d",
                          background: "#fffdf5",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.45rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "#27211d" }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6e6259", marginTop: "0.15rem" }}>
                              From: <strong>{convObj?.contact_name || item.student_name || "Contact"}</strong>{" "}
                              ({item.guardian_phone || convObj?.phone_number || "WhatsApp"})
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "99px",
                              background: "#fef3c7",
                              color: "#b45309",
                              fontWeight: 700,
                              border: "1px solid #fde68a",
                            }}
                          >
                            Awaiting Confirmation
                          </span>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", fontSize: "0.74rem", color: "#4a4039" }}>
                          {item.student_name && (
                            <span style={{ background: "#f3f0ea", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                              👤 Student: <strong>{item.student_name}</strong>
                            </span>
                          )}
                          {(item.school_name || item.class_grade) && (
                            <span style={{ background: "#f3f0ea", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                              🏫 {[item.class_grade, item.school_name].filter(Boolean).join(" • ")}
                            </span>
                          )}
                          {item.due_date && (
                            <span style={{ background: "#fef2f2", color: "#991b1b", padding: "0.15rem 0.45rem", borderRadius: "6px", fontWeight: 700 }}>
                              📅 Target: {item.due_date}
                            </span>
                          )}
                          {item.budget_bdt && (
                            <span style={{ background: "#ecfdf5", color: "#065f46", padding: "0.15rem 0.45rem", borderRadius: "6px", fontWeight: 700 }}>
                              💰 {item.budget_bdt} BDT
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "#3f3731",
                              background: "#fff",
                              padding: "0.55rem 0.7rem",
                              borderRadius: "8px",
                              border: "1px solid #eee7de",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {item.description}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => handleFinalizeTask({ taskId: item.id })}
                            style={{
                              padding: "0.4rem 0.75rem",
                              borderRadius: "8px",
                              border: "none",
                              background: "#059669",
                              color: "#fff",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Confirm &amp; Finalize to Tasks
                          </button>
                          {item.conversation_id && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveId(item.conversation_id!);
                                setTopViewTab("chat");
                                fetchHubData(item.conversation_id!);
                              }}
                              style={{
                                padding: "0.4rem 0.7rem",
                                borderRadius: "8px",
                                border: "1px solid #dfd7cc",
                                background: "#fff",
                                color: "#27211d",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              💬 Open Chat
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDismissSummary({
                                taskId: item.id,
                                conversationId: item.conversation_id || undefined,
                              })
                            }
                            style={{
                              padding: "0.4rem 0.7rem",
                              borderRadius: "8px",
                              border: "1px solid #fca5a5",
                              background: "#fef2f2",
                              color: "#b91c1c",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {summaryOnlyConvs.map((conv) => (
                    <div
                      key={conv.id}
                      style={{
                        padding: "0.9rem",
                        borderRadius: "12px",
                        border: "1px solid #e2dad0",
                        background: "#faf8f5",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.45rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#27211d" }}>
                            {conv.contact_name || conv.phone_number}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#6e6259" }}>
                            {[conv.class_grade, conv.school_name].filter(Boolean).join(" • ") || "School/Class not specified yet"}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.12rem 0.45rem",
                            borderRadius: "99px",
                            background: "#f1f5f9",
                            color: "#475569",
                            fontWeight: 700,
                          }}
                        >
                          In Conversation
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#3f3731" }}>
                        {conv.summary || "Project conversation active — click Summarize or Finalize below."}
                      </div>
                      <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleFinalizeTask({ conversationId: conv.id })}
                          style={{
                            padding: "0.38rem 0.7rem",
                            borderRadius: "8px",
                            border: "none",
                            background: "#059669",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Confirm &amp; Finalize to Tasks
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(conv.id);
                            setTopViewTab("chat");
                            fetchHubData(conv.id);
                          }}
                          style={{
                            padding: "0.38rem 0.7rem",
                            borderRadius: "8px",
                            border: "1px solid #dfd7cc",
                            background: "#fff",
                            color: "#27211d",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          💬 Open Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDismissSummary({ conversationId: conv.id })}
                          style={{
                            padding: "0.38rem 0.7rem",
                            borderRadius: "8px",
                            border: "1px solid #fca5a5",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* COLUMN 2: CONFIRMED & FINALIZED TASKS (ACTIVE ON SPRINT BOARD) */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6dfd5",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.9rem 1.1rem",
                borderBottom: "1px solid #eee7de",
                background: "#ecfdf5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#065f46" }}>
                  ✅ Confirmed Project Tasks (On Sprint Board)
                </div>
                <div style={{ fontSize: "0.75rem", color: "#047857", marginTop: "0.15rem" }}>
                  Confirmed by Mahir in chat or manually finalized. Visible on the Task &amp; Sprint Board.
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href="/dashboard/tasks"
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "8px",
                    background: "#059669",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <span>Go to Sprint Board</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {confirmedProjectItems.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#7c7067", fontSize: "0.84rem" }}>
                  No confirmed WhatsApp project tasks yet. Click &quot;Confirm &amp; Finalize to Tasks&quot; on any ongoing project on the left.
                </div>
              ) : (
                confirmedProjectItems.map((item) => {
                  const convObj = conversations.find((c) => c.id === item.conversation_id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "0.9rem",
                        borderRadius: "12px",
                        border: "1px solid #a7f3d0",
                        background: "#f8fffb",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.45rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "#27211d" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6e6259", marginTop: "0.15rem" }}>
                            Contact: <strong>{convObj?.contact_name || item.student_name || "Contact"}</strong>{" "}
                            ({item.guardian_phone || convObj?.phone_number || "WhatsApp"})
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "99px",
                            background: "#d1fae5",
                            color: "#065f46",
                            fontWeight: 800,
                          }}
                        >
                          {item.stage.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", fontSize: "0.74rem", color: "#4a4039" }}>
                        {item.student_name && (
                          <span style={{ background: "#f3f0ea", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                            👤 Student: <strong>{item.student_name}</strong>
                          </span>
                        )}
                        {(item.school_name || item.class_grade) && (
                          <span style={{ background: "#f3f0ea", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                            🏫 {[item.class_grade, item.school_name].filter(Boolean).join(" • ")}
                          </span>
                        )}
                        {item.due_date && (
                          <span style={{ background: "#fef2f2", color: "#991b1b", padding: "0.15rem 0.45rem", borderRadius: "6px", fontWeight: 700 }}>
                            📅 Due: {item.due_date}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "#3f3731",
                            background: "#fff",
                            padding: "0.55rem 0.7rem",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.description}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleMoveToDiscussion({ taskId: item.id, conversationId: item.conversation_id || undefined })}
                          style={{
                            padding: "0.38rem 0.7rem",
                            borderRadius: "8px",
                            border: "1px solid #d97706",
                            background: "#fffbeb",
                            color: "#92400e",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ↩ Unconfirm (Move back to Ongoing Discussion)
                        </button>
                        {item.conversation_id && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveId(item.conversation_id!);
                              setTopViewTab("chat");
                              fetchHubData(item.conversation_id!);
                            }}
                            style={{
                              padding: "0.38rem 0.7rem",
                              borderRadius: "8px",
                              border: "1px solid #dfd7cc",
                              background: "#fff",
                              color: "#27211d",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            💬 Open Chat
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            handleDismissSummary({
                              taskId: item.id,
                              conversationId: item.conversation_id || undefined,
                            })
                          }
                          style={{
                            padding: "0.38rem 0.7rem",
                            borderRadius: "8px",
                            border: "1px solid #fca5a5",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Remove Task
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
      /* MAIN 3-COLUMN WHATSAPP WEB LAYOUT */
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: showDetailsPane ? "320px 1fr 310px" : "320px 1fr",
          gap: "0.75rem",
          minHeight: 0,
        }}
      >
        {/* LEFT COLUMN: CONTACTS & AI FILTER LIST */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e6dfd5",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "0.75rem", borderBottom: "1px solid #eee7de" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "#f8f6f2",
                border: "1px solid #e2dad0",
                borderRadius: "9px",
                padding: "0.42rem 0.65rem",
                marginBottom: "0.55rem",
              }}
            >
              <Search size={15} color="#7c7067" />
              <input
                type="text"
                placeholder="Search contacts, phone, school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "0.82rem",
                  width: "100%",
                  color: "#27211d",
                }}
              />
            </div>

            {/* AI Mode Filter Tabs */}
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "off", label: "🔒 Personal" },
                  { id: "task_observer", label: "📋 Task AI" },
                  { id: "auto_pilot", label: "🤖 Auto-Pilot" },
                  { id: "team", label: "👥 Team" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModeFilter(tab.id)}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.24rem 0.5rem",
                    borderRadius: "6px",
                    border: modeFilter === tab.id ? "1px solid #7A1C24" : "1px solid #e5dec9",
                    background: modeFilter === tab.id ? "rgba(122, 28, 36, 0.1)" : "#faf8f5",
                    color: modeFilter === tab.id ? "#7A1C24" : "#5c5149",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.4rem" }}>
            {loading ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#7c7067", fontSize: "0.85rem" }}>
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#7c7067", fontSize: "0.82rem" }}>
                No contacts match this filter.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeId;
                const mode = c.ai_mode || "off";
                const badgeConfig =
                  mode === "auto_pilot"
                    ? { bg: "#dcfce7", text: "#166534", label: "🤖 Auto-Pilot" }
                    : mode === "task_observer"
                    ? { bg: "#fef3c7", text: "#92400e", label: "📋 Task Observer" }
                    : { bg: "#f1f5f9", text: "#475569", label: "🔒 Personal (AI Off)" };

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConversation(c.id)}
                    style={{
                      padding: "0.7rem 0.75rem",
                      borderRadius: "10px",
                      marginBottom: "0.3rem",
                      cursor: "pointer",
                      background: isSelected ? "rgba(122, 28, 36, 0.08)" : "transparent",
                      border: isSelected ? "1px solid rgba(122, 28, 36, 0.28)" : "1px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.4rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "#27211d" }}>
                        {c.contact_name || c.phone_number}
                      </div>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          padding: "0.12rem 0.42rem",
                          borderRadius: "99px",
                          background: badgeConfig.bg,
                          color: badgeConfig.text,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {badgeConfig.label}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.73rem",
                        color: "#7c7067",
                        marginTop: "0.2rem",
                      }}
                    >
                      {c.platform === "messenger" ? (
                        <>
                          <MessageSquare size={11} color="#0084ff" />
                          <span style={{ color: "#0084ff", fontWeight: 700 }}>Facebook Messenger</span>
                        </>
                      ) : (
                        <>
                          <Phone size={11} />
                          <span>+{c.phone_number.replace(/^\+/, "")}</span>
                        </>
                      )}
                      {c.contact_category === "team_member" && (
                        <span style={{ color: "#7A1C24", fontWeight: 700 }}>• Team</span>
                      )}
                      {c.school_name && <span>• {c.school_name}</span>}
                    </div>

                    {c.summary && (
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#5c5149",
                          marginTop: "0.3rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {c.summary}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER COLUMN: WHATSAPP CHAT STREAM & AI LEVEL BAR */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e6dfd5",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {activeConv ? (
            <>
              {/* Chat Header with 3-Level AI Selector */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid #eee7de",
                  background: "#faf8f5",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.6rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.96rem", color: "#27211d" }}>
                      {activeConv.contact_name || activeConv.phone_number}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "6px",
                        background: activeConv.platform === "messenger" ? "#eff6ff" : "#e2e8f0",
                        color: activeConv.platform === "messenger" ? "#1d4ed8" : "#334155",
                        fontWeight: 700,
                      }}
                    >
                      {activeConv.platform === "messenger"
                        ? `Messenger (${activeConv.phone_number.replace(/^messenger_/, "")})`
                        : `+${activeConv.phone_number.replace(/^\+/, "")}`}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#6e6259", marginTop: "0.15rem" }}>
                    {activeConv.ai_mode === "off" &&
                      "🔒 Personal Chat — AI is completely OFF. Zero tokens are used on this conversation."}
                    {activeConv.ai_mode === "task_observer" &&
                      "📋 Task Observer — AI reads chat, creates Backlog tasks when confirmed, and asks only for missing student info."}
                    {activeConv.ai_mode === "auto_pilot" &&
                      "🤖 AI Auto-Pilot — AI replies directly on behalf of Mahir and logs confirmed tasks automatically."}
                  </div>
                </div>

                {/* 3-Way AI Mode Selector */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleChangeAIMode("off")}
                    disabled={savingSettings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.38rem 0.65rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: activeConv.ai_mode === "off" ? "2px solid #334155" : "1px solid #cbd5e1",
                      background: activeConv.ai_mode === "off" ? "#1e293b" : "#fff",
                      color: activeConv.ai_mode === "off" ? "#fff" : "#475569",
                    }}
                    title="Personal / Manual Chat: AI will NOT read this conversation"
                  >
                    <ShieldOff size={13} />
                    <span>Personal (AI Off)</span>
                  </button>

                  <button
                    onClick={() => handleChangeAIMode("task_observer")}
                    disabled={savingSettings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.38rem 0.65rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: activeConv.ai_mode === "task_observer" ? "2px solid #b45309" : "1px solid #fde68a",
                      background: activeConv.ai_mode === "task_observer" ? "#d97706" : "#fffbeb",
                      color: activeConv.ai_mode === "task_observer" ? "#fff" : "#92400e",
                    }}
                    title="Task Observer: Reads chat & arranges confirmed work into Tasks"
                  >
                    <CheckSquare size={13} />
                    <span>Task Observer</span>
                  </button>

                  <button
                    onClick={() => handleChangeAIMode("auto_pilot")}
                    disabled={savingSettings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.38rem 0.65rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: activeConv.ai_mode === "auto_pilot" ? "2px solid #047857" : "1px solid #a7f3d0",
                      background: activeConv.ai_mode === "auto_pilot" ? "#059669" : "#ecfdf5",
                      color: activeConv.ai_mode === "auto_pilot" ? "#fff" : "#065f46",
                    }}
                    title="Auto-Pilot: AI directly replies on your behalf & logs tasks"
                  >
                    <Bot size={13} />
                    <span>AI Auto-Pilot</span>
                  </button>

                  <button
                    onClick={() => setShowDetailsPane((prev) => !prev)}
                    style={{
                      padding: "0.38rem 0.55rem",
                      borderRadius: "8px",
                      border: "1px solid #dfd7cc",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    title="Toggle Contact Settings & Linked Tasks"
                  >
                    <Sliders size={14} />
                  </button>
                </div>
              </div>

              {/* Message History Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  background: "#f4f1ea",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      margin: "auto",
                      textAlign: "center",
                      color: "#7c7067",
                      fontSize: "0.85rem",
                      maxWidth: "360px",
                    }}
                  >
                    No messages in this thread yet. Send a WhatsApp message below or wait for incoming messages.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isCustomer = m.sender_type === "customer";
                    const isAI = m.sender_type === "ai_assistant";
                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: isCustomer ? "flex-start" : "flex-end",
                          maxWidth: "74%",
                          padding: "0.65rem 0.9rem",
                          borderRadius: isCustomer
                            ? "14px 14px 14px 4px"
                            : "14px 14px 4px 14px",
                          background: isCustomer
                            ? "#ffffff"
                            : isAI
                            ? "#065f46"
                            : "#7A1C24",
                          color: isCustomer ? "#27211d" : "#ffffff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                          border: isCustomer ? "1px solid #e6dfd5" : "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            marginBottom: "0.22rem",
                            opacity: 0.85,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          {isCustomer ? (
                            <span>{activeConv.contact_name || "Contact"}</span>
                          ) : isAI ? (
                            <>
                              <Bot size={11} />
                              <span>Mahir&apos;s AI Bot</span>
                            </>
                          ) : (
                            <span>Mahir Rahman (You)</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
                          {m.body}
                        </div>
                        <div
                          style={{
                            fontSize: "0.64rem",
                            opacity: 0.72,
                            marginTop: "0.28rem",
                            textAlign: "right",
                          }}
                        >
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Bottom Composer Bar */}
              <form
                onSubmit={handleSendOrCommand}
                style={{
                  padding: "0.75rem 1rem",
                  borderTop: "1px solid #eee7de",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setComposerMode("direct")}
                      style={{
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        border: composerMode === "direct" ? "1px solid #7A1C24" : "1px solid #dfd7cc",
                        background: composerMode === "direct" ? "#7A1C24" : "#f8f6f2",
                        color: composerMode === "direct" ? "#fff" : "#4a4039",
                        cursor: "pointer",
                      }}
                    >
                      💬 Direct Reply (as Mahir)
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerMode("ai_command")}
                      style={{
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        border: composerMode === "ai_command" ? "1px solid #059669" : "1px solid #dfd7cc",
                        background: composerMode === "ai_command" ? "#059669" : "#f8f6f2",
                        color: composerMode === "ai_command" ? "#fff" : "#4a4039",
                        cursor: "pointer",
                      }}
                    >
                      ✨ Command AI to Message
                    </button>
                  </div>

                  {/* Manual One-Click AI Action Buttons */}
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      disabled={aiRunning}
                      onClick={() => handleTriggerAINow("task_observer")}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #f59e0b",
                        background: "#fffbeb",
                        color: "#92400e",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                      title="Analyze this chat right now and arrange confirmed projects into Kanban Backlog"
                    >
                      <Zap size={12} />
                      <span>{aiRunning ? "Running AI..." : "Extract & Sync Tasks Now"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={aiRunning}
                      onClick={() => handleTriggerAINow("auto_pilot")}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #10b981",
                        background: "#ecfdf5",
                        color: "#065f46",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                      title="Have AI immediately reply to the latest message on your behalf"
                    >
                      <Sparkles size={12} />
                      <span>AI Reply Now</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder={
                      composerMode === "direct"
                        ? activeConv?.platform === "messenger"
                          ? "Type a Messenger reply as RoboBee Admin..."
                          : "Type a WhatsApp message as Mahir (e.g., 'Ok confirm, budget 2500 BDT')..."
                        : "Instruct AI what to tell this person (e.g., 'Ask for his school name and confirm delivery on Friday')..."
                    }
                    style={{
                      flex: 1,
                      padding: "0.65rem 0.9rem",
                      borderRadius: "10px",
                      border: "1px solid #d6cec2",
                      fontSize: "0.86rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !composerText.trim()}
                    style={{
                      padding: "0 1.15rem",
                      borderRadius: "10px",
                      border: "none",
                      background: composerMode === "direct" ? "#7A1C24" : "#059669",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Send size={15} />
                    <span>{sending ? "Sending..." : composerMode === "direct" ? "Send" : "AI Send"}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ margin: "auto", textAlign: "center", padding: "2rem", color: "#7c7067" }}>
              Select a contact on the left to view messages and manage AI permissions.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONTACT SETTINGS, CUSTOM AI INSTRUCTIONS & LINKED TASKS */}
        {showDetailsPane && activeConv && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6dfd5",
              borderRadius: "14px",
              padding: "0.9rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              overflowY: "auto",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#27211d", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sliders size={16} color="#7A1C24" />
              <span>Contact &amp; AI Configuration</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#5c5149" }}>Contact Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
                style={{
                  padding: "0.45rem 0.65rem",
                  borderRadius: "8px",
                  border: "1px solid #dfd7cc",
                  fontSize: "0.82rem",
                }}
              />

              <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#5c5149" }}>Contact Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as ContactCategory)}
                style={{
                  padding: "0.45rem 0.65rem",
                  borderRadius: "8px",
                  border: "1px solid #dfd7cc",
                  fontSize: "0.82rem",
                  background: "#fff",
                }}
              >
                <option value="personal">🔒 Personal / Friend</option>
                <option value="client">🎓 Teacher / Guardian / Student</option>
                <option value="team_member">🐝 RoboBee Team Member</option>
                <option value="school_partner">🏫 School Partner</option>
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5c5149" }}>School</label>
                  <input
                    type="text"
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value)}
                    placeholder="School Name"
                    style={{
                      width: "100%",
                      padding: "0.42rem 0.55rem",
                      borderRadius: "8px",
                      border: "1px solid #dfd7cc",
                      fontSize: "0.78rem",
                      marginTop: "0.2rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5c5149" }}>Class Grade</label>
                  <input
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    placeholder="e.g. Class 7"
                    style={{
                      width: "100%",
                      padding: "0.42rem 0.55rem",
                      borderRadius: "8px",
                      border: "1px solid #dfd7cc",
                      fontSize: "0.78rem",
                      marginTop: "0.2rem",
                    }}
                  />
                </div>
              </div>

              <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#5c5149" }}>
                Custom AI Instructions (Budget / Notes)
              </label>
              <textarea
                rows={3}
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                placeholder="e.g., Fixed budget is 2,500 BDT for Solar Drone + Vibrator. Pickup from Chashara lab."
                style={{
                  padding: "0.5rem 0.65rem",
                  borderRadius: "8px",
                  border: "1px solid #dfd7cc",
                  fontSize: "0.78rem",
                  resize: "vertical",
                }}
              />

              <button
                onClick={handleSaveContactDetails}
                disabled={savingSettings}
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#27211d",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {savingSettings ? "Saving..." : "Save Contact & AI Rules"}
              </button>
            </div>

            {/* Linked Project Summary & Kanban Tasks Section */}
            <div style={{ borderTop: "1px solid #eee7de", paddingTop: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#27211d" }}>
                  Project Summary &amp; Tasks ({linkedTasks.length})
                </span>
                <Link
                  href="/dashboard/tasks"
                  style={{
                    fontSize: "0.73rem",
                    color: "#7A1C24",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    textDecoration: "none",
                  }}
                >
                  <span>Sprint Board</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              {linkedTasks.length === 0 ? (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#f8f6f2",
                    fontSize: "0.75rem",
                    color: "#7c7067",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.45rem",
                  }}
                >
                  <div>
                    {activeConv.summary ? (
                      <>
                        <strong>Conversation Summary:</strong> {activeConv.summary}
                      </>
                    ) : (
                      <>
                        No project summarized yet. Click <strong>Extract &amp; Sync Tasks Now</strong> to summarize this chat.
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFinalizeTask({ conversationId: activeConv.id })}
                    style={{
                      padding: "0.4rem 0.65rem",
                      borderRadius: "7px",
                      border: "none",
                      background: "#059669",
                      color: "#fff",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✓ Finalize &amp; Move to Sprint Board
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {linkedTasks.map((t) => {
                    const isDiscussion = t.stage === "in_discussion" || t.status === "in_discussion";
                    return (
                      <div
                        key={t.id}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "9px",
                          border: isDiscussion ? "1px solid #f59e0b" : "1px solid #10b981",
                          background: isDiscussion ? "#fffbeb" : "#ecfdf5",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.35rem" }}>
                          <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#27211d" }}>{t.title}</div>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "99px",
                              fontWeight: 700,
                              background: isDiscussion ? "#fde68a" : "#a7f3d0",
                              color: isDiscussion ? "#92400e" : "#065f46",
                            }}
                          >
                            {isDiscussion ? "ONGOING CHAT" : `CONFIRMED (${t.stage.toUpperCase()})`}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#4a4039", marginTop: "0.25rem" }}>
                          {t.student_name ? `Student: ${t.student_name}` : ""}
                          {t.due_date ? ` • Due: ${t.due_date}` : ""}
                          {t.budget_bdt ? ` • ${t.budget_bdt} BDT` : ""}
                        </div>
                        {(t.school_name || t.class_grade) && (
                          <div style={{ fontSize: "0.7rem", color: "#7A1C24", marginTop: "0.15rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <School size={11} />
                            <span>{[t.class_grade, t.school_name].filter(Boolean).join(" — ")}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                          {isDiscussion ? (
                            <button
                              type="button"
                              onClick={() => handleFinalizeTask({ taskId: t.id })}
                              style={{
                                padding: "0.28rem 0.55rem",
                                borderRadius: "6px",
                                border: "none",
                                background: "#059669",
                                color: "#fff",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              ✓ Finalize as Task
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMoveToDiscussion({ taskId: t.id, conversationId: activeConv.id })}
                              style={{
                                padding: "0.28rem 0.55rem",
                                borderRadius: "6px",
                                border: "1px solid #d97706",
                                background: "#fff",
                                color: "#92400e",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              ↩ Move to Ongoing
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDismissSummary({
                                taskId: t.id,
                                conversationId: t.conversation_id || activeConv?.id,
                              })
                            }
                            style={{
                              padding: "0.28rem 0.55rem",
                              borderRadius: "6px",
                              border: "1px solid #fca5a5",
                              background: "#fef2f2",
                              color: "#b91c1c",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* MODAL 1: ADD CONTACT / TEAM MEMBER */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleCreateContact}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "430px",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#27211d" }}>Add Contact or Team Member</h3>
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700 }}>WhatsApp Phone Number (with country code)</label>
              <input
                type="text"
                required
                placeholder="e.g. 8801711223344"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700 }}>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rafi / Team Member"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700 }}>Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ContactCategory)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
              >
                <option value="personal">🔒 Personal / Friend</option>
                <option value="client">🎓 Teacher / Guardian / Student</option>
                <option value="team_member">🐝 RoboBee Team Member</option>
                <option value="school_partner">🏫 School Partner</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700 }}>Initial AI Level</label>
              <select
                value={newAiMode}
                onChange={(e) => setNewAiMode(e.target.value as AIMode)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
              >
                <option value="off">🔒 Personal (AI Off — 0 Tokens)</option>
                <option value="task_observer">📋 Task Observer (Read &amp; Create Tasks)</option>
                <option value="auto_pilot">🤖 AI Auto-Pilot (Reply on Behalf of Mahir)</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.4rem" }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: "0.5rem 0.9rem", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", background: "#7A1C24", color: "#fff", fontWeight: 700, cursor: "pointer" }}
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: AI COMMAND & MULTI-MEMBER BROADCAST */}
      {showBroadcastModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <form
            onSubmit={handleExecuteBroadcast}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "540px",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Megaphone size={20} color="#7A1C24" />
              <h3 style={{ margin: 0, fontSize: "1.08rem", color: "#27211d" }}>
                Command AI &amp; Broadcast to Members / Contacts
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#6e6259" }}>
              Tell the AI what message to send to your team members or clients on your behalf. Use{" "}
              <code>{"{name}"}</code> to automatically insert each recipient&apos;s name.
            </p>

            {/* Quick Group Selection */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => selectBroadcastGroup("team_member")}
                style={{ fontSize: "0.73rem", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #7A1C24", background: "#fdf2f2", color: "#7A1C24", fontWeight: 700, cursor: "pointer" }}
              >
                <Users size={12} style={{ display: "inline", marginRight: "4px" }} />
                Select All Team Members
              </button>
              <button
                type="button"
                onClick={() => selectBroadcastGroup("client")}
                style={{ fontSize: "0.73rem", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #d97706", background: "#fffbeb", color: "#92400e", fontWeight: 700, cursor: "pointer" }}
              >
                Select All Clients
              </button>
              <button
                type="button"
                onClick={() => selectBroadcastGroup("all")}
                style={{ fontSize: "0.73rem", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#334155", fontWeight: 700, cursor: "pointer" }}
              >
                Select All ({conversations.length})
              </button>
            </div>

            {/* Recipient Checkboxes */}
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #e2dad0",
                borderRadius: "8px",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              {conversations.map((c) => {
                const checked = selectedBroadcastIds.includes(c.id);
                return (
                  <label
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBroadcastIds((prev) => [...prev, c.id]);
                        } else {
                          setSelectedBroadcastIds((prev) => prev.filter((id) => id !== c.id));
                        }
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>{c.contact_name || c.phone_number}</span>
                    <span style={{ fontSize: "0.72rem", color: "#7c7067" }}>
                      (+{c.phone_number.replace(/^\+/, "")} • {c.contact_category || "personal"})
                    </span>
                  </label>
                );
              })}
            </div>

            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700 }}>Your Command / Message Content</label>
              <textarea
                rows={4}
                required
                value={broadcastInstruction}
                onChange={(e) => setBroadcastInstruction(e.target.value)}
                placeholder="e.g., Hi {name}, this is Mahir's AI bot. Reminder that our robotics build session is tomorrow at 4 PM at the North Chashara Lab."
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem", fontSize: "0.83rem" }}
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={broadcastPolish}
                onChange={(e) => setBroadcastPolish(e.target.checked)}
              />
              <span>Have AI polish my instruction into a smart message before sending</span>
            </label>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                style={{ padding: "0.5rem 0.9rem", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={broadcastSending || selectedBroadcastIds.length === 0}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#7A1C24",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {broadcastSending ? "Dispatching..." : `Send to ${selectedBroadcastIds.length} Recipient(s)`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
