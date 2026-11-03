"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  FileDown,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Layers,
  ChevronRight,
  ClipboardList,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { generateProcurementPDF, ProcurementItem } from "@/lib/procurementPdf";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  action?: string;
  details?: any;
  liveLink?: string;
}

export function AICopilotDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome_1",
      sender: "bot",
      text: `👋 **Welcome, Mahir! I am your Autonomous Website Management AI.**\n\nI can operate the platform directly on your command:\n• 📦 **Build BOM from Chat**: *"Merge conversation with 8801939426670 and create the BOM & requisition"*\n• 💡 **AI Hardware Architect**: *"Suggest parts for a Class 6 Smart Solar Dustbin and make the BOM"*\n• 📋 **Task Manager**: *"Assign task 'Sumo Bot Wiring' to Tanvir for Nov 10"*\n• 📊 **Platform Status**: *"Show platform metrics and pending requests"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          context: {
            currentUrl: typeof window !== "undefined" ? window.location.pathname : "",
          },
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: data.reply || (data.success ? "Operation completed." : `Error: ${data.error}`),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: data.action,
        details: data.details,
        liveLink: data.liveLink,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `⚠️ Network error communicating with Operations Engine: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDFFromDetails = (details: any) => {
    if (!details || !Array.isArray(details.items)) return;
    const items: ProcurementItem[] = details.items.map((it: any) => ({
      name: it.name,
      category: it.category || "General",
      quantity: Number(it.quantity) || 1,
      source: it.source || "Local Market",
    }));

    generateProcurementPDF({
      projectName: details.name || details.projectName || "Project Procurement Slip",
      items,
      notes: `Autonomous Requisition by RoboBee AI Operator (${items.length} components)`,
      requisitionId: details.requisitionId || `REC-${Date.now().toString().slice(-6)}`,
      classGrade: details.classGrade || undefined,
      studentName: details.studentName || undefined,
    });
  };

  const quickPrompts = [
    { label: "⚡ BOM from Student Chat", prompt: "Convert the student conversation with 8801939426670 to a project BOM and submit the admin requisition" },
    { label: "💡 Suggest Class 6 Solar Pump BOM", prompt: "Suggest parts for a Class 6 Smart Solar Water Pump & Irrigation project, build the BOM, and submit requisition" },
    { label: "📊 Live Platform Status", prompt: "Show live platform metrics, competitions, and pending part requests" },
    { label: "📋 Assign Sprint Task", prompt: "Assign a high priority task: 'FIRSO Robo Soccer Chassis Assembly' with deadline 2026-11-12" },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "linear-gradient(135deg, #581c87 0%, #1e1b4b 100%)",
            color: "#fff",
            padding: "0.75rem 1.15rem",
            borderRadius: "9999px",
            boxShadow: "0 10px 25px -3px rgba(88, 28, 135, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            border: "2px solid rgba(245, 158, 11, 0.5)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.85rem",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          aria-label="Open RoboBee AI Website Operator"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#f59e0b",
              color: "#1e1b4b",
            }}
          >
            <Sparkles size={16} />
          </span>
          <span>AI Website Operator</span>
          <span
            style={{
              fontSize: "0.65rem",
              background: "rgba(245, 158, 11, 0.2)",
              color: "#fde68a",
              padding: "0.15rem 0.45rem",
              borderRadius: "999px",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            Live
          </span>
        </button>
      )}

      {/* Expanded Copilot Drawer */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: isExpanded ? "1rem" : "5rem",
            right: "1.5rem",
            width: isExpanded ? "min(92vw, 850px)" : "min(92vw, 460px)",
            height: isExpanded ? "min(88vh, 780px)" : "560px",
            zIndex: 9999,
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "width 0.25s ease, height 0.25s ease",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.85rem 1.15rem",
              background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "#f59e0b",
                  color: "#1e1b4b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>RoboBee AI Autonomous Operator</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#e9d5ff" }}>
                  Operating Backend Database • BOMs • Tasks • Requisitions
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "0.35rem",
                  cursor: "pointer",
                }}
                title={isExpanded ? "Restore size" : "Expand size"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "0.35rem",
                  cursor: "pointer",
                }}
                title="Close Drawer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div
            style={{
              padding: "0.5rem 0.85rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              gap: "0.4rem",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.65rem",
                  borderRadius: "999px",
                  background: "#ffffff",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#9333ea";
                  e.currentTarget.style.color = "#9333ea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.9rem",
              background: "#fdfcfe",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "0.75rem 0.95rem",
                      borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      background: isUser ? "#3b0764" : "#ffffff",
                      color: isUser ? "#ffffff" : "#1e293b",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      fontSize: "0.82rem",
                      lineHeight: "1.45",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.text}

                    {/* Rich Interactive Action Result Card */}
                    {m.details && (
                      <div
                        style={{
                          marginTop: "0.65rem",
                          padding: "0.65rem",
                          borderRadius: "8px",
                          background: isUser ? "rgba(255, 255, 255, 0.12)" : "#f8fafc",
                          border: isUser ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.45rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, fontSize: "0.78rem" }}>
                          <CheckCircle size={15} color={isUser ? "#fde68a" : "#16a34a"} />
                          <span>Autonomous Action Completed</span>
                        </div>

                        {/* Interactive Buttons */}
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                          {m.details.projectId && (
                            <Link
                              href={`/dashboard/bom?projectId=${m.details.projectId}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                background: "#4f46e5",
                                color: "#fff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              <Layers size={13} />
                              <span>Open Project in BOM</span>
                            </Link>
                          )}

                          {m.details.items && (
                            <button
                              type="button"
                              onClick={() => handleDownloadPDFFromDetails(m.details)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                background: "#059669",
                                color: "#fff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <FileDown size={13} />
                              <span>Download Store PDF (No Prices)</span>
                            </button>
                          )}

                          {m.details.taskId && (
                            <Link
                              href="/dashboard/tasks"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                background: "#0284c7",
                                color: "#fff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              <ClipboardList size={13} />
                              <span>View Sprint Task</span>
                            </Link>
                          )}

                          {m.details.requisitionId && (
                            <Link
                              href="/dashboard/admin/requests"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                background: "#f59e0b",
                                color: "#1e1b4b",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              <ArrowUpRight size={13} />
                              <span>View Requisition</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "0.2rem", padding: "0 0.2rem" }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.78rem" }}>
                <RefreshCw size={15} className="spin" style={{ animation: "spin 1s linear infinite" }} />
                <span>Operating website backend & running Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: "0.75rem 0.9rem",
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tell AI to build BOM, link task, launch competition..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "0.82rem",
                outline: "none",
                background: "#f8fafc",
                color: "#0f172a",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: isLoading || !inputPrompt.trim() ? "#cbd5e1" : "#581c87",
                color: "#fff",
                border: "none",
                cursor: isLoading || !inputPrompt.trim() ? "not-allowed" : "pointer",
                transition: "background 0.15s ease",
              }}
              title="Send Command to AI Operator"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Global CSS for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
