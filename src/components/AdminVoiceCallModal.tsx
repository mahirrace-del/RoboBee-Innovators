"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, Sparkles, Clock, X, Bell } from "lucide-react";
import styles from "./AdminVoiceCallModal.module.css";

interface AdminVoiceCallModalProps {
  // Optional external trigger callback
  onRegisterTrigger?: (triggerFn: (reason?: string) => void) => void;
}

export function AdminVoiceCallModal({ onRegisterTrigger }: AdminVoiceCallModalProps) {
  const { user, role } = useAuth();

  // Strict Admin Authorization Guard: ONLY Mahir Rahman (mahir.race@gmail.com / race.mahir@gmail.com / rest.mahir@gmail.com)
  const userEmail = (user?.email || "").toLowerCase().trim();
  const isMahirAdmin = Boolean(
    user &&
    (userEmail === "mahir.race@gmail.com" ||
      userEmail === "race.mahir@gmail.com" ||
      userEmail === "rest.mahir@gmail.com" ||
      user?.uid === "C2OOIbUqumPNFx6GS42eD40380V2" ||
      role === "admin" ||
      userEmail.includes("mahir"))
  );

  const [callState, setCallState] = useState<"idle" | "ringing" | "connected" | "ended">("idle");
  const [callReason, setCallReason] = useState<string>("Morning Wake-Up Briefing");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  
  // Alarm Scheduler State
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [alarmTime, setAlarmTime] = useState<string>("07:00");
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(false);
  const [lastFiredDate, setLastFiredDate] = useState<string>("");

  // Refs for audio and timers
  const ringtoneTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const titleFlasherRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const isConnectedRef = useRef<boolean>(false);

  // Load saved alarm from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAlarm = localStorage.getItem("robobee_admin_alarm_time");
      const savedEnabled = localStorage.getItem("robobee_admin_alarm_enabled");
      if (savedAlarm) setAlarmTime(savedAlarm);
      if (savedEnabled) setIsAlarmEnabled(savedEnabled === "true");
    }
  }, []);

  // Realistic Telephone Ringtone Synthesizer (440Hz + 480Hz cadence)
  const stopRingtone = useCallback(() => {
    if (ringtoneTimerRef.current) {
      clearInterval(ringtoneTimerRef.current);
      ringtoneTimerRef.current = null;
    }
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    if (titleFlasherRef.current) {
      clearInterval(titleFlasherRef.current);
      titleFlasherRef.current = null;
    }
    if (typeof document !== "undefined") {
      document.title = "RoboBEE Innovators | Team Portal & STEM Academy";
    }
    try {
      if (navigator.vibrate) navigator.vibrate(0);
    } catch {}
    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    } catch {}
  }, []);

  const playRealisticRingCycle = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const playBurst = () => {
        if (!ctx || ctx.state === "closed") return;
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
        gain.gain.setValueAtTime(0.35, now + 1.85);
        gain.gain.linearRampToValueAtTime(0, now + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.05);
        osc2.stop(now + 2.05);
      };

      // Play first burst immediately
      playBurst();

      // Ring cadence: 2 seconds tone, 3.5 seconds silence, repeat
      ringtoneTimerRef.current = setInterval(() => {
        playBurst();
      }, 5500);

      // Mobile phone vibration loop
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate([800, 400, 800, 400, 1500]);
        vibrationIntervalRef.current = setInterval(() => {
          try {
            navigator.vibrate([800, 400, 800, 400, 1500]);
          } catch {}
        }, 5500);
      }
    } catch (e) {
      console.warn("Failed to play web audio ringtone:", e);
    }
  }, []);

  // Trigger Incoming Call
  const triggerIncomingCall = useCallback(
    (reason = "Morning Wake-Up Briefing") => {
      setCallReason(reason);
      setCallState("ringing");
      setTranscriptHistory([]);
      setCallDuration(0);
      playRealisticRingCycle();

      // Flash browser document title
      if (typeof document !== "undefined") {
        let toggle = false;
        if (titleFlasherRef.current) clearInterval(titleFlasherRef.current);
        titleFlasherRef.current = setInterval(() => {
          toggle = !toggle;
          document.title = toggle ? "🔴 INCOMING CALL (RoboBee AI)" : "📞 RoboBee Portal";
        }, 800);
      }

      // Display system-level heads-up notification if supported
      if (typeof window !== "undefined") {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_CALL_NOTIFICATION",
            title: "📞 Incoming Call: RoboBee AI",
            body: "Executive Voice Line • Tap to Answer",
            reason: reason,
          });
        } else if ("Notification" in window && Notification.permission === "granted") {
          try {
            const notif = new Notification("📞 Incoming Call: RoboBee AI", {
              body: "Executive Voice Line • Tap to Answer",
              icon: "/icon.png",
              badge: "/icon.png",
              vibrate: [600, 300, 600, 300, 600, 300, 1000],
              tag: "admin-incoming-call",
              requireInteraction: true,
            } as any);
            notif.onclick = () => {
              window.focus();
              notif.close();
            };
          } catch {}
        }
      }
    },
    [playRealisticRingCycle]
  );

  // Register PWA Service Worker & listen to system notification clicks
  useEffect(() => {
    if (typeof window === "undefined" || !isMahirAdmin) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});

      const handleSwMsg = (event: MessageEvent) => {
        if (event.data?.type === "TRIGGER_CALL") {
          triggerIncomingCall(event.data.reason || "Mobile Incoming Call");
          if (event.data.autoAccept) {
            setTimeout(() => handleAcceptCall(), 400);
          }
        }
      };
      navigator.serviceWorker.addEventListener("message", handleSwMsg);
      return () => navigator.serviceWorker.removeEventListener("message", handleSwMsg);
    }
  }, [isMahirAdmin, triggerIncomingCall]);

  // Request Notification permission for system alerts & check URL params
  useEffect(() => {
    if (typeof window === "undefined" || !isMahirAdmin) return;
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    if (window.location.search.includes("incoming_call=true")) {
      triggerIncomingCall("Mobile System Call");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isMahirAdmin, triggerIncomingCall]);

  // Expose trigger function to parent or layout
  useEffect(() => {
    if (onRegisterTrigger) {
      onRegisterTrigger(triggerIncomingCall);
    }

    // Global custom event listener
    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ reason?: string }>;
      triggerIncomingCall(customEvent.detail?.reason || "Executive Voice Session");
    };
    window.addEventListener("trigger-admin-call", handleCustomTrigger);
    return () => window.removeEventListener("trigger-admin-call", handleCustomTrigger);
  }, [onRegisterTrigger, triggerIncomingCall]);

  // Real-time listener for incoming call triggers dispatched to Mahir (e.g. from Messenger "call me")
  useEffect(() => {
    if (!isMahirAdmin || !user) return;

    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(10));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            const target = String(data.recipientEmail || "").toLowerCase().trim();
            const isTargetedToMahir =
              target === userEmail ||
              target === "mahir.race@gmail.com" ||
              target === "rest.mahir@gmail.com" ||
              target === "race.mahir@gmail.com";

            if (isTargetedToMahir && !data.read && (data.type === "trigger_voice_call" || data.metadata?.action === "incoming_call")) {
              // Immediately mark notification as read to prevent loop
              updateDoc(doc(db, "notifications", change.doc.id), { read: true }).catch(() => {});
              triggerIncomingCall(data.message || data.title || "Messenger Remote Call Request");
            }
          }
        });
      },
      (err) => {
        console.warn("[AdminVoiceCallModal] Call trigger listener notice:", err);
      }
    );

    return () => unsub();
  }, [isMahirAdmin, user, userEmail, triggerIncomingCall]);

  // Check Alarm Time every 10 seconds
  useEffect(() => {
    if (!isAlarmEnabled || !alarmTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split("T")[0];

      if (currentTimeStr === alarmTime && lastFiredDate !== todayStr && callState === "idle") {
        setLastFiredDate(todayStr);
        triggerIncomingCall("Scheduled Morning Wake-Up Briefing");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAlarmEnabled, alarmTime, lastFiredDate, callState, triggerIncomingCall]);

  // Decline Call
  const handleDeclineCall = () => {
    stopRingtone();
    setCallState("ended");
    setTimeout(() => setCallState("idle"), 1200);
  };

  // Speak AI text using SpeechSynthesis
  const speakAiReply = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onDone) onDone();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (naturalVoice) utterance.voice = naturalVoice;

    setIsAiSpeaking(true);
    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onDone) onDone();
    };
    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Listen to Mahir's speech and process turn
  const startListening = useCallback(() => {
    if (typeof window === "undefined" || !isConnectedRef.current) return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        if (!spokenText?.trim()) return;

        setTranscriptHistory((prev) => [...prev, { sender: "user", text: spokenText }]);

        try {
          const res = await fetch("/api/admin-voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "process_voice_turn",
              transcript: spokenText,
              userEmail: user?.email || "race.mahir@gmail.com",
            }),
          });
          const data = await res.json();
          if (data.speech) {
            setTranscriptHistory((prev) => [...prev, { sender: "ai", text: data.speech }]);
            speakAiReply(data.speech, () => {
              if (isConnectedRef.current) startListening();
            });
          } else {
            if (isConnectedRef.current) startListening();
          }
        } catch (e) {
          console.error("Voice turn processing failed:", e);
          if (isConnectedRef.current) startListening();
        }
      };

      recognition.onerror = () => {
        if (isConnectedRef.current) {
          setTimeout(() => startListening(), 1000);
        }
      };

      recognition.onend = () => {
        // Automatically restart if still connected and AI isn't currently talking
        if (isConnectedRef.current && !isAiSpeaking) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
    }
  }, [user?.email, isAiSpeaking, speakAiReply]);

  // Accept Call
  const handleAcceptCall = async () => {
    stopRingtone();
    setCallState("connected");
    isConnectedRef.current = true;

    // Start Call Duration Timer
    setCallDuration(0);
    callDurationIntervalRef.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);

    // Initial greeting from Gemini
    try {
      const res = await fetch("/api/admin-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_initial_greeting",
          reason: callReason,
          userEmail: user?.email || "race.mahir@gmail.com",
        }),
      });
      const data = await res.json();
      const greeting =
        data.speech ||
        "Hello Boss! Do you need anything?";

      setTranscriptHistory([{ sender: "ai", text: greeting }]);
      speakAiReply(greeting, () => {
        if (isConnectedRef.current) startListening();
      });
    } catch {
      const fallbackGreeting = "Hello Boss! Do you need anything?";
      setTranscriptHistory([{ sender: "ai", text: fallbackGreeting }]);
      speakAiReply(fallbackGreeting, () => {
        if (isConnectedRef.current) startListening();
      });
    }
  };

  // End Active Call
  const handleEndCall = () => {
    isConnectedRef.current = false;
    stopRingtone();
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
      callDurationIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setTranscriptHistory([]);
    }, 1500);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  // If user is not Mahir Admin, NEVER render anything
  if (!isMahirAdmin) {
    return null;
  }

  return (
    <>
      {/* Sleek Header Pill: Always accessible to Mahir on any dashboard page */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          type="button"
          onClick={() => triggerIncomingCall("Executive Voice Session")}
          className={styles.triggerPill}
          title="Start Live Two-Way Voice Call with RoboBee AI"
        >
          <PhoneCall size={12} style={{ color: "#10b981" }} />
          <span>📞 AI Call</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAlarmModalOpen(true)}
          style={{
            background: isAlarmEnabled ? "rgba(16, 185, 129, 0.18)" : "rgba(255, 255, 255, 0.08)",
            border: isAlarmEnabled ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.15)",
            color: isAlarmEnabled ? "#10b981" : "#a89f91",
            borderRadius: "999px",
            padding: "0.32rem 0.6rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
          title="Set Morning Wake-Up Call Alarm"
        >
          <Clock size={11} />
          <span>{isAlarmEnabled ? `⏰ ${alarmTime}` : "Alarm"}</span>
        </button>
      </div>

      {/* Alarm Settings Modal */}
      {isAlarmModalOpen && (
        <div className={styles.overlay} style={{ zIndex: 100000 }}>
          <div className={styles.callCard} style={{ maxWidth: "380px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fef3c7" }}>⏰ Wake-Up Alarm Call</div>
              <button
                type="button"
                onClick={() => setIsAlarmModalOpen(false)}
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "#a89f91", margin: "0.8rem 0 1.2rem", textAlign: "left" }}>
              At this time, the RoboBee website will play a continuous ringing call to wake you up and brief you on your daily tasks.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e5e7eb", textAlign: "left" }}>
                Alarm Time (24h format):
              </label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  background: "#1f1915",
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.8rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "12px",
                  marginTop: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>Enable Daily Wake-Up Call</span>
                <input
                  type="checkbox"
                  checked={isAlarmEnabled}
                  onChange={(e) => setIsAlarmEnabled(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "#10b981", cursor: "pointer" }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("robobee_admin_alarm_time", alarmTime);
                  localStorage.setItem("robobee_admin_alarm_enabled", String(isAlarmEnabled));
                  setIsAlarmModalOpen(false);
                }}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                Save Alarm Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Incoming Call / Active Call Overlay */}
      {callState !== "idle" && (
        <div className={styles.overlay}>
          <div className={styles.callCard}>
            {/* Pulsing Radar Container */}
            <div className={styles.radarContainer}>
              {callState === "ringing" && (
                <>
                  <div className={styles.radarWave} />
                  <div className={`${styles.radarWave} ${styles.radarWaveDelay}`} />
                </>
              )}
              <div className={styles.avatar}>🐝</div>
            </div>

            {/* Calling Identity */}
            <div className={styles.incomingBadge}>
              <Sparkles size={11} />
              <span>{callState === "ringing" ? "Incoming Call" : callState === "connected" ? "Call Connected" : "Call Ended"}</span>
            </div>

            <h2 className={styles.callerTitle}>RoboBee AI Assistant</h2>
            <p className={styles.callerSub}>Executive Operational Line • Mostakim Rahman Mahir</p>
            <div className={styles.reasonTag}>{callReason}</div>

            {/* RINGING STATE ACTIONS */}
            {callState === "ringing" && (
              <div className={styles.actionsBar}>
                <div className={styles.actionBtnGroup}>
                  <button type="button" onClick={handleDeclineCall} className={`${styles.roundBtn} ${styles.declineBtn}`}>
                    <PhoneOff size={28} />
                  </button>
                  <span className={styles.btnLabel}>Decline</span>
                </div>

                <div className={styles.actionBtnGroup}>
                  <button type="button" onClick={handleAcceptCall} className={`${styles.roundBtn} ${styles.acceptBtn}`}>
                    <PhoneCall size={32} />
                  </button>
                  <span className={styles.btnLabel} style={{ color: "#34d399" }}>Pick Up</span>
                </div>
              </div>
            )}

            {/* CONNECTED STATE VIEW */}
            {callState === "connected" && (
              <div className={styles.connectedView}>
                <div className={styles.timer}>{formatTimer(callDuration)}</div>

                {/* Animated Sound Wave Visualizer */}
                <div className={styles.visualizer}>
                  <div className={styles.waveBar} />
                  <div className={styles.waveBar} />
                  <div className={styles.waveBar} />
                  <div className={styles.waveBar} />
                  <div className={styles.waveBar} />
                  <div className={styles.waveBar} />
                </div>

                {/* Live Speech Transcript Box */}
                <div className={styles.transcriptBox}>
                  {transcriptHistory.length === 0 ? (
                    <div style={{ color: "#9ca3af", fontStyle: "italic" }}>Connecting to Gemini live voice...</div>
                  ) : (
                    transcriptHistory.map((item, idx) => (
                      <div key={idx} className={item.sender === "ai" ? styles.bubbleAi : styles.bubbleUser}>
                        <strong>{item.sender === "ai" ? "RoboBee AI: " : "Mahir: "}</strong>
                        {item.text}
                      </div>
                    ))
                  )}
                </div>

                {/* Call Control Buttons */}
                <div className={styles.connectedControls}>
                  <button
                    type="button"
                    onClick={() => setIsMuted((m) => !m)}
                    className={`${styles.utilityBtn} ${isMuted ? styles.utilityBtnActive : ""}`}
                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleEndCall}
                    className={`${styles.roundBtn} ${styles.declineBtn}`}
                    style={{ width: "60px", height: "60px" }}
                    title="End Call"
                  >
                    <PhoneOff size={26} />
                  </button>
                </div>
              </div>
            )}

            {/* ENDED STATE */}
            {callState === "ended" && (
              <div style={{ margin: "2rem 0", color: "#9ca3af", fontSize: "0.9rem", fontWeight: 700 }}>
                Call Ended
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
