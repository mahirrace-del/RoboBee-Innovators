"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Printer, Wrench, Shield, School, Sparkles, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export function FacilitiesAndPathwaysBento() {
  return (
    <section id="features" style={{ padding: "6rem 5% 5rem", position: "relative" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px",
            background: "rgba(245, 183, 0, 0.12)",
            border: "1px solid rgba(245, 183, 0, 0.35)",
            color: "#F5B700",
            fontSize: "0.8rem",
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
            letterSpacing: "0.5px",
            marginBottom: "0.8rem",
          }}
        >
          World-Class <span style={{ color: "#F5B700" }}>Hardware Facilities</span> &amp; Hands-On Tracks
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
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Bento Card 1: 3D Printing & Rapid Prototyping */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(30, 4, 19, 0.85) 0%, rgba(12, 16, 26, 0.95) 100%)",
            border: "1px solid rgba(245, 183, 0, 0.28)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(245, 183, 0, 0.15)",
              border: "1px solid rgba(245, 183, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5B700",
            }}
          >
            <Printer size={24} />
          </div>

          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF" }}>
            Unrestricted 3D Printing &amp; Fabrication
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Members receive full hands-on access to our high-precision 3D printer fleet, PLA/PETG filaments, and mechanical design tools to prototype custom robot chassis, gripper jaws, and sensor mounts.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              PLA / PETG
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              CAD Prototyping
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Custom Chassis
            </span>
          </div>
        </div>

        {/* Bento Card 2: Soldering & Electronics Testbench */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(30, 4, 19, 0.85) 0%, rgba(12, 16, 26, 0.95) 100%)",
            border: "1px solid rgba(0, 240, 255, 0.28)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(0, 240, 255, 0.15)",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00F0FF",
            }}
          >
            <Cpu size={24} />
          </div>

          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF" }}>
            Electronics, Soldering &amp; Testbed
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Dedicated soldering fume-extracted benches, regulated DC bench power supplies, digital oscilloscopes, and over 100+ sensors (Ultrasonic, IR, ToF, IMUs, Motor Drivers, ESP32, STM32).
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Oscilloscopes
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Fume Benches
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              STM32 &amp; ESP32
            </span>
          </div>
        </div>

        {/* Bento Card 3: School Partnerships & Workshops */}
        <div
          style={{
            borderRadius: "22px",
            background: "linear-gradient(145deg, rgba(30, 4, 19, 0.85) 0%, rgba(12, 16, 26, 0.95) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.28)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10B981",
            }}
          >
            <School size={24} />
          </div>

          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF" }}>
            School Robotics Outreach &amp; Workshops
          </h3>

          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Empowering youth through collaborative STEM workshops (such as the prestigious Heritage School Robotics Workshop) where students build real Arduino circuits and battle in classroom mini-arenas.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Heritage School
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Hands-On Kits
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#CBD5E1" }}>
              Youth Mentorship
            </span>
          </div>
        </div>

        {/* Bento Card 4: Membership & Enrollment CTA (Wide Card) */}
        <div
          style={{
            gridColumn: "1 / -1",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(46, 0, 28, 0.95) 0%, rgba(16, 21, 33, 0.95) 100%)",
            border: "1px solid #F5B700",
            padding: "2.4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 183, 0, 0.2)",
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#F5B700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              ✦ Open Membership &amp; Innovation Roster
            </div>

            <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem" }}>
              Join the Robotics Innovation Community
            </h3>

            <p style={{ color: "#E2E8F0", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Full access to Maker Lab tools, expert mentorship, 3D printing equipment, and competitive robotics team preparation.
            </p>

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Rapid Prototyping &amp; Lab Access</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Hands-On Mentorship &amp; Competitions</span>
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
                background: "linear-gradient(135deg, #F5B700 0%, #D97706 100%)",
                color: "#0B0F17",
                fontSize: "1.05rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(245, 183, 0, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              <span>Apply for Membership</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ fontSize: "0.8rem", color: "#94A3B8", textAlign: "center" }}>
              ✦ Open to passionate makers, students, and young engineers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
