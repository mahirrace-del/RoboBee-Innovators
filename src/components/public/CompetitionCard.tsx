"use client";

import React, { useState } from "react";
import { Trophy, Calendar, MapPin, Sparkles } from "lucide-react";

export interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants?: number;
  description?: string;
}

export interface CompetitionCardItem {
  id: string;
  name: string;
  date?: string;
  location?: string;
  description?: string;
  segments?: Segment[];
  fee?: number;
  maxParticipants?: number;
  visibility?: string;
  status?: string;
}

interface CompetitionCardProps {
  comp: CompetitionCardItem;
  onRegister: (comp: CompetitionCardItem) => void;
}

export function CompetitionCard({ comp, onRegister }: CompetitionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const compSegments: Segment[] =
    Array.isArray(comp.segments) && comp.segments.length > 0
      ? comp.segments
      : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "22px",
        background: "linear-gradient(155deg, rgba(19, 22, 31, 0.92) 0%, rgba(13, 16, 25, 0.98) 100%)",
        border: isHovered ? "1px solid rgba(56, 189, 248, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: isHovered
          ? "0 22px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.12)"
          : "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
        padding: "1.8rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Top Banner Tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "#38BDF8",
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
              fontSize: "1.35rem",
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
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#38BDF8",
            flexShrink: 0,
          }}
        >
          <Trophy size={20} />
        </div>
      </div>

      {/* Meta details */}
      <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#CBD5E1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Calendar size={15} color="#38BDF8" />
          <span>{comp.date || "Announced Soon"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <MapPin size={15} color="#38BDF8" />
          <span>{comp.location || "Club Arena"}</span>
        </div>
      </div>

      {/* Description */}
      {comp.description && (
        <p style={{ fontSize: "0.92rem", color: "#94A3B8", lineHeight: 1.6 }}>
          {comp.description}
        </p>
      )}

      {/* Segments & Categories */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.6rem" }}>
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
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "0.82rem",
                color: "#F1F5F9",
              }}
            >
              <span style={{ fontWeight: 600 }}>🤖 {seg.name}</span>
              {seg.fee > 0 && (
                <span style={{ fontWeight: 800, color: "#38BDF8", paddingLeft: "0.3rem", borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}>
                  {seg.fee} BDT
                </span>
              )}
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
          background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
          color: "#FFFFFF",
          fontSize: "0.98rem",
          fontWeight: 700,
          border: "1px solid rgba(56, 189, 248, 0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          boxShadow: "0 8px 25px rgba(37, 99, 235, 0.35)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Trophy size={17} />
        <span>Register for Competition</span>
      </button>
    </div>
  );
}
