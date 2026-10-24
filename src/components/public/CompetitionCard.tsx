"use client";

import React from "react";
import { Trophy, Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants: number;
  description?: string;
}

interface CompetitionCardProps {
  comp: {
    id: string;
    name: string;
    date?: string;
    location?: string;
    description?: string;
    segments?: Segment[];
    fee?: number;
    maxParticipants?: number;
  };
  onRegister: (comp: any) => void;
}

export function CompetitionCard({ comp, onRegister }: CompetitionCardProps) {
  const compSegments: Segment[] =
    Array.isArray(comp.segments) && comp.segments.length > 0
      ? comp.segments
      : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

  return (
    <div
      style={{
        borderRadius: "22px",
        background: "linear-gradient(155deg, rgba(32, 4, 21, 0.9) 0%, rgba(13, 17, 27, 0.95) 100%)",
        border: "1px solid rgba(245, 183, 0, 0.35)",
        boxShadow: "0 18px 45px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 183, 0, 0.15)",
        padding: "1.8rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Banner Tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div>
          <div
            style={{
              fontSize: "0.74rem",
              fontWeight: 800,
              color: "#F5B700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              marginBottom: "0.4rem",
            }}
          >
            <Sparkles size={13} />
            <span>Open Tournament</span>
          </div>

          <h3
            style={{
              fontSize: "1.45rem",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.3,
            }}
          >
            {comp.name}
          </h3>
        </div>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(245, 183, 0, 0.15)",
            border: "1px solid rgba(245, 183, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F5B700",
            flexShrink: 0,
          }}
        >
          <Trophy size={20} />
        </div>
      </div>

      {/* Meta details */}
      <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Calendar size={15} color="#F5B700" />
          <span>{comp.date || "Announced Soon"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <MapPin size={15} color="#F5B700" />
          <span>{comp.location || "Club Arena"}</span>
        </div>
      </div>

      {/* Description */}
      {comp.description && (
        <p style={{ fontSize: "0.93rem", color: "#94A3B8", lineHeight: 1.6 }}>
          {comp.description}
        </p>
      )}

      {/* Segments & Categories */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Competition Segments:
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {compSegments.map((seg) => (
            <div
              key={seg.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "0.82rem",
                color: "#F1F5F9",
              }}
            >
              <span style={{ fontWeight: 600 }}>🤖 {seg.name}</span>
              <span style={{ fontWeight: 800, color: "#F5B700", paddingLeft: "0.3rem", borderLeft: "1px solid rgba(255, 255, 255, 0.15)" }}>
                {seg.fee} BDT
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Register CTA Button */}
      <button
        type="button"
        onClick={() => onRegister(comp)}
        style={{
          width: "100%",
          padding: "0.9rem 1.4rem",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #F5B700 0%, #D97706 100%)",
          color: "#0B0F17",
          fontSize: "0.98rem",
          fontWeight: 800,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          boxShadow: "0 8px 20px rgba(245, 183, 0, 0.35)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Trophy size={17} />
        <span>Register for Competition</span>
      </button>
    </div>
  );
}
