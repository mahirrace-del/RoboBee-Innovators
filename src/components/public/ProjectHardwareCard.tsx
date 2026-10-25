"use client";

import React, { useState, useRef } from "react";
import { Cpu, CheckCircle2 } from "lucide-react";

interface ProjectHardwareCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    status?: string;
    tags?: string[];
  };
}

export function ProjectHardwareCard({ project }: ProjectHardwareCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Determine tags from project description or title
  const tags = project.tags || [
    project.title.toLowerCase().includes("arm") ? "4-DOF Kinematics" :
    project.title.toLowerCase().includes("maze") ? "Micromouse" :
    project.title.toLowerCase().includes("soccer") ? "Mega Sumo" : "Hardware Lab",
    project.description.toLowerCase().includes("stm32") ? "STM32" : "Arduino C++",
    "3D Printed",
    "Autonomous",
  ].slice(0, 3);

  const isCompleted =
    project.status === "completed" ||
    project.title.toLowerCase().includes("winner") ||
    project.title.toLowerCase().includes("trophy") ||
    project.description.toLowerCase().includes("champion");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        height: "100%",
      }}
    >
      <div
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out, box-shadow 0.4s ease-out, border-color 0.3s ease",
          background: "linear-gradient(160deg, rgba(19, 22, 31, 0.9) 0%, rgba(13, 16, 25, 0.98) 100%)",
          border: isHovered ? "1px solid rgba(56, 189, 248, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.14)"
            : "0 15px 35px -10px rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(16px)",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glowing Circuit Corner Ambient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "140px",
            height: "140px",
            background: "radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Project Image Frame (16:10 aspect ratio container) */}
        <div
          style={{
            width: "100%",
            height: "220px",
            borderRadius: "14px",
            overflow: "hidden",
            position: "relative",
            background: "#0A0D14",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {project.image?.trim() ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${project.image.trim()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              <Cpu size={36} color="#38BDF8" />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Hardware Prototype</span>
            </div>
          )}

          {/* Status Badge */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "0.35rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backdropFilter: "blur(12px)",
              background: isCompleted ? "rgba(16, 185, 129, 0.18)" : "rgba(15, 23, 42, 0.85)",
              color: isCompleted ? "#10B981" : "#38BDF8",
              border: isCompleted ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(56, 189, 248, 0.35)",
            }}
          >
            {isCompleted ? (
              <CheckCircle2 size={12} />
            ) : (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                  display: "inline-block",
                }}
              />
            )}
            <span>{isCompleted ? "Competition Ready" : "Active in Lab"}</span>
          </div>
        </div>

        {/* Content & Details */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "0.6rem" }}>
          {/* Tech Hardware Tags */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                  background: "rgba(56, 189, 248, 0.08)",
                  color: "#38BDF8",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.3px",
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: "0.9rem",
              color: "#94A3B8",
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
