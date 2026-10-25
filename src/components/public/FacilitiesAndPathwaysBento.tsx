"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Printer, School, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function FacilitiesAndPathwaysBento() {
  return (
    <section id="features" style={{ padding: "6rem 5% 5rem", position: "relative", scrollMarginTop: "90px" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            color: "#38BDF8",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "0.8rem",
          }}
        >
          <Sparkles size={14} />
          <span>Advanced Maker Lab &amp; STEM Academy</span>
        </div>

        <h2
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
            marginBottom: "0.8rem",
          }}
        >
          Inside Our <span style={{ color: "#38BDF8" }}>Maker Lab</span> &amp; Programs
        </h2>

        <p
          style={{
            color: "#94A3B8",
            fontSize: "1.05rem",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          A state-of-the-art engineering workspace where members design, build, solder, 3D print, and program autonomous robotics systems under our core motto: <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em>
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Bento Card 1: 3D Printing & Rapid Prototyping */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(19, 22, 31, 0.9) 0%, rgba(13, 16, 25, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38BDF8",
            }}
          >
            <Printer size={24} />
          </div>

          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF" }}>
            Unrestricted 3D Printing &amp; Fabrication
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Members receive full hands-on access to our high-precision 3D printer fleet, PLA/PETG filaments, and mechanical design tools to prototype custom robot chassis, gripper jaws, and sensor mounts.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(56, 189, 248, 0.08)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              PLA / PETG
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(56, 189, 248, 0.08)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              CAD Prototyping
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(56, 189, 248, 0.08)", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              Custom Chassis
            </span>
          </div>
        </div>

        {/* Bento Card 2: Soldering & Electronics Testbench */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(19, 22, 31, 0.9) 0%, rgba(13, 16, 25, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(99, 102, 241, 0.12)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818CF8",
            }}
          >
            <Cpu size={24} />
          </div>

          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF" }}>
            Electronics, Soldering &amp; Testbed
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Dedicated soldering fume-extracted benches, regulated DC bench power supplies, digital oscilloscopes, and over 100+ sensors (Ultrasonic, IR, ToF, IMUs, Motor Drivers, ESP32, STM32).
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.08)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              Oscilloscopes
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.08)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              Fume Benches
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.08)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              STM32 &amp; ESP32
            </span>
          </div>
        </div>

        {/* Bento Card 3: School Partnerships & Workshops */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(19, 22, 31, 0.9) 0%, rgba(13, 16, 25, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10B981",
            }}
          >
            <School size={24} />
          </div>

          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF" }}>
            School Robotics Outreach &amp; Workshops
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Empowering youth through collaborative STEM workshops (such as the prestigious Heritage School Robotics Workshop) where students build real Arduino circuits and battle in classroom mini-arenas.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(16, 185, 129, 0.08)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              Heritage School
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(16, 185, 129, 0.08)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              Hands-On Kits
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(16, 185, 129, 0.08)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              Youth Mentorship
            </span>
          </div>
        </div>

        {/* Bento Card 4: Membership & Enrollment CTA (Wide Card) */}
        <div
          style={{
            gridColumn: "1 / -1",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(19, 22, 31, 0.95) 0%, rgba(13, 16, 25, 0.98) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            padding: "2.4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.1)",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              ✦ Open Membership &amp; Innovation Roster
            </div>

            <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem", letterSpacing: "-0.5px" }}>
              Join the Robotics Innovation Community
            </h3>

            <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Full access to Maker Lab tools, expert mentorship, 3D printing equipment, and competitive robotics team preparation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E2E8F0", fontSize: "0.92rem", fontWeight: 600 }}>
                <CheckCircle2 size={17} color="#10B981" />
                <span>Rapid Prototyping &amp; 3D Printers</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E2E8F0", fontSize: "0.92rem", fontWeight: 600 }}>
                <CheckCircle2 size={17} color="#10B981" />
                <span>Hands-On Circuit Breadboarding</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E2E8F0", fontSize: "0.92rem", fontWeight: 600 }}>
                <CheckCircle2 size={17} color="#10B981" />
                <span>Every Friday In-Person Lab Sessions</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E2E8F0", fontSize: "0.92rem", fontWeight: 600 }}>
                <CheckCircle2 size={17} color="#10B981" />
                <span>Olympiad &amp; Tournament Teams</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", minWidth: "240px" }}>
            <Link
              href="/recruitment"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                padding: "1rem 2rem",
                borderRadius: "30px",
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                fontSize: "1.02rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s ease",
                border: "1px solid rgba(56, 189, 248, 0.4)",
              }}
            >
              <span>Apply for Membership</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ fontSize: "0.8rem", color: "#64748B", textAlign: "center" }}>
              ✦ Open to passionate makers, students, and young engineers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
