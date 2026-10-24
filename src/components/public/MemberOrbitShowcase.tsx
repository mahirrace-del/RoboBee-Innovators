"use client";

import React, { useState } from "react";
import { Users, Sparkles, Heart } from "lucide-react";

interface MemberOrbitShowcaseProps {
  marquees: any[];
}

export function MemberOrbitShowcase({ marquees }: MemberOrbitShowcaseProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<{ id: string; image: string; index: number } | null>(null);

  if (!marquees || marquees.length === 0) return null;

  // Quadruple array to ensure continuous smooth infinite marquee
  const loopedList = [...marquees, ...marquees, ...marquees, ...marquees, ...marquees, ...marquees];

  return (
    <section
      id="members"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredMember(null);
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        setIsPaused(false);
        setHoveredMember(null);
      }}
      style={{
        position: "relative",
        padding: "5rem 0 4.5rem",
        background: "linear-gradient(180deg, rgba(14, 2, 9, 0.95) 0%, rgba(9, 11, 16, 0.98) 100%)",
        borderTop: "1px solid rgba(245, 183, 0, 0.18)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Background Circuit Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "250px",
          background: "radial-gradient(ellipse at center, rgba(245, 183, 0, 0.08) 0%, rgba(58, 5, 25, 0.12) 50%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative", zIndex: 2 }}>
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
          <span>Active Innovator Community</span>
        </div>

        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "0.5px",
            marginBottom: "0.6rem",
          }}
        >
          Meet Our <span style={{ color: "#F5B700" }}>Makers & Innovators</span>
        </h2>

        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.95rem",
            maxWidth: "600px",
            margin: "0 auto",
            letterSpacing: "0.3px",
          }}
        >
          Students, researchers, and competitive robotics engineers collaborating inside our North Chashara Maker Lab.
          Hover or tap any member to pause and inspect.
        </p>
      </div>

      {/* Infinite Horizontal Floating Marquee */}
      <div
        style={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "2.4rem",
            width: "max-content",
            animation: "scrollOrbitMarquee 52s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
            willChange: "transform",
            padding: "1rem 0",
          }}
        >
          {loopedList.map((m, idx) => {
            const isThisHovered = hoveredMember?.index === idx;
            return (
              <div
                key={`${m.id || idx}-${idx}`}
                onMouseEnter={() => setHoveredMember({ id: m.id, image: m.image, index: idx })}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transform: isThisHovered ? "scale(1.22) translateY(-6px)" : "scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0.35s ease",
                  zIndex: isThisHovered ? 50 : 1,
                }}
              >
                {/* Glowing Dual-Ring Frame */}
                <div
                  style={{
                    position: "relative",
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    padding: "4px",
                    background: isThisHovered
                      ? "linear-gradient(135deg, #F5B700 0%, #00F0FF 100%)"
                      : "linear-gradient(135deg, #F5B700 0%, #3A0519 100%)",
                    boxShadow: isThisHovered
                      ? "0 0 25px rgba(245, 183, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.5)"
                      : "0 6px 18px rgba(0, 0, 0, 0.6)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#0F1420",
                      border: "2px solid #0B0E17",
                    }}
                  >
                    {m.image?.trim() ? (
                      <img
                        src={m.image.trim()}
                        alt="RoboBee Team Member"
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#F5B700",
                          fontWeight: 800,
                          fontSize: "1.4rem",
                        }}
                      >
                        RB
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Member Tooltip Badge on Hover */}
                {isThisHovered && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-48px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(11, 15, 25, 0.95)",
                      border: "1px solid rgba(245, 183, 0, 0.5)",
                      borderRadius: "10px",
                      padding: "0.35rem 0.75rem",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7)",
                      backdropFilter: "blur(12px)",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      animation: "fadeIn 0.2s ease-out",
                    }}
                  >
                    <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#F5B700" }}>
                      RoboBee Innovator
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#CBD5E1" }}>
                      Maker Lab Member
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollOrbitMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </section>
  );
}
