"use client";

import React, { useState } from "react";
import { Trophy, Calendar } from "lucide-react";

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
        background: "linear-gradient(150deg, rgba(19, 22, 31, 0.92) 0%, rgba(13, 16, 25, 0.98) 100%)",
        border: isHovered ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: isHovered
          ? "0 22px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.14)"
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
              color: "#FFFFFF",
            }}
          >
            <Trophy size={18} />
          </div>

          <div>
            <div style={{ fontSize: "0.72rem", color: "#38BDF8", fontWeight: 800, textTransform: "uppercase" }}>
              {isInternational ? "International Arena" : isNational ? "National Champion" : "Award of Excellence"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 600 }}>
              RoboBee Robotics Delegation
            </div>
          </div>
        </div>

        {/* Year Pill */}
        <div
          style={{
            padding: "0.35rem 0.85rem",
            borderRadius: "20px",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            color: "#38BDF8",
            fontSize: "0.82rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
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
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.3,
          }}
        >
          {achievement.title}
        </h3>

        <p
          style={{
            fontSize: "0.92rem",
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
