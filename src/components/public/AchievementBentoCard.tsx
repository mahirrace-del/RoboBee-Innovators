"use client";

import React, { useState } from "react";
import { Trophy, Award, Medal, Sparkles, MapPin, Calendar } from "lucide-react";

interface AchievementBentoCardProps {
  achievement: {
    id: string;
    title: string;
    year: string;
    description: string;
    image?: string;
  };
}

export function AchievementBentoCard({ achievement }: AchievementBentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isInternational =
    achievement.title.toLowerCase().includes("malaysia") ||
    achievement.description.toLowerCase().includes("malaysia") ||
    achievement.title.toLowerCase().includes("international");

  const isNational =
    achievement.title.toLowerCase().includes("firso") ||
    achievement.description.toLowerCase().includes("uiu") ||
    achievement.title.toLowerCase().includes("national");

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "22px",
        background: "linear-gradient(150deg, rgba(38, 4, 24, 0.9) 0%, rgba(14, 18, 28, 0.95) 100%)",
        border: isHovered ? "1px solid #F5B700" : "1px solid rgba(245, 183, 0, 0.35)",
        boxShadow: isHovered
          ? "0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 183, 0, 0.28)"
          : "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
        overflow: "hidden",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Top Banner Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.8rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #F5B700 0%, #D97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(245, 183, 0, 0.45)",
            }}
          >
            <Trophy size={18} color="#0B0F17" />
          </div>

          <div>
            <div style={{ fontSize: "0.72rem", color: "#F5B700", fontWeight: 800, textTransform: "uppercase" }}>
              {isInternational ? "International Arena" : isNational ? "National Champion" : "Award of Excellence"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 600 }}>
              RoboBee Robotics Delegation
            </div>
          </div>
        </div>

        {/* Year Pill */}
        <div
          style={{
            padding: "0.35rem 0.85rem",
            borderRadius: "20px",
            background: "rgba(245, 183, 0, 0.15)",
            border: "1px solid rgba(245, 183, 0, 0.4)",
            color: "#F5B700",
            fontSize: "0.82rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Calendar size={13} />
          <span>{achievement.year}</span>
        </div>
      </div>

      {/* Image if provided */}
      {achievement.image?.trim() && (
        <div
          style={{
            width: "100%",
            height: "220px",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#080B12",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${achievement.image.trim()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.4s ease-out",
            }}
          />
        </div>
      )}

      {/* Title & Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.3,
          }}
        >
          {achievement.title}
        </h3>

        <p
          style={{
            fontSize: "0.93rem",
            color: "#CBD5E1",
            lineHeight: 1.6,
          }}
        >
          {achievement.description}
        </p>
      </div>
    </div>
  );
}
