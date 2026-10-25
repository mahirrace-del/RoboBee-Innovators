"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export interface MarqueeItem {
  id?: string;
  name?: string;
  role?: string;
  image?: string;
}

interface MemberOrbitShowcaseProps {
  marquees: MarqueeItem[];
}

export function MemberOrbitShowcase({ marquees }: MemberOrbitShowcaseProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<{
    id?: string;
    name?: string;
    role?: string;
    image?: string;
    index: number;
  } | null>(null);

  if (!marquees || marquees.length === 0) return null;

  // Ensure the repeated list has enough items so that 50% of the track spans >= 3200px
  // (covering ultra-wide 4K monitors) and maintains an exact, mathematically seamless 50% loop offset.
  const itemWidthEstimate = 125; // 84px avatar + 38.4px (2.4rem) gap = ~122.4px
  const minItemsPerHalf = Math.max(16, Math.ceil(3200 / itemWidthEstimate));
  const multiplierPerHalf = Math.max(1, Math.ceil(minItemsPerHalf / (marquees.length || 1)));
  const singleHalf = Array.from({ length: multiplierPerHalf }, () => marquees).flat();
  const loopedList = [...singleHalf, ...singleHalf];

  return (
    <section
      id="members"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredMember(null);
      }}
      style={{
        position: "relative",
        padding: "5.5rem 0 5rem",
        background: "linear-gradient(180deg, #090A0F 0%, #0D1017 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        scrollMarginTop: "90px",
      }}
    >
      {/* Background Subtle Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "250px",
          background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.06) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", marginBottom: "2.8rem", position: "relative", zIndex: 2, padding: "0 1.5rem" }}>
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
          <span>Active Innovator Community</span>
        </div>

        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
            marginBottom: "0.6rem",
          }}
        >
          Meet Our <span style={{ color: "#38BDF8" }}>Makers &amp; Innovators</span>
        </h2>

        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.98rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
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
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "2.4rem",
            width: "max-content",
            animation: "scrollOrbitMarquee 48s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
            willChange: "transform",
            padding: "1.5rem 0 4.5rem 0", // Generous bottom clearance to prevent tooltip clipping
          }}
        >
          {loopedList.map((m, idx) => {
            const isThisHovered = hoveredMember?.index === idx;
            const displayName = m.name?.trim() || "RoboBee Innovator";
            const displayRole = m.role?.trim() || "Maker Lab Member";

            return (
              <div
                key={`${m.id || idx}-${idx}`}
                onMouseEnter={() =>
                  setHoveredMember({
                    id: m.id,
                    name: displayName,
                    role: displayRole,
                    image: m.image,
                    index: idx,
                  })
                }
                onClick={() => {
                  setHoveredMember((prev) =>
                    prev?.index === idx
                      ? null
                      : {
                          id: m.id,
                          name: displayName,
                          role: displayRole,
                          image: m.image,
                          index: idx,
                        }
                  );
                }}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transform: isThisHovered ? "scale(1.18) translateY(-6px)" : "scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0.35s ease",
                  zIndex: isThisHovered ? 50 : 1,
                  userSelect: "none",
                }}
              >
                {/* Modern Ring Frame */}
                <div
                  style={{
                    position: "relative",
                    width: "84px",
                    height: "84px",
                    borderRadius: "50%",
                    padding: "3px",
                    background: isThisHovered
                      ? "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)"
                      : "rgba(255, 255, 255, 0.12)",
                    border: isThisHovered
                      ? "2px solid #38BDF8"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: isThisHovered
                      ? "0 0 25px rgba(56, 189, 248, 0.6), 0 0 45px rgba(99, 102, 241, 0.3)"
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
                    }}
                  >
                    {m.image?.trim() ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={m.image.trim()}
                        alt={displayName}
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
                          color: "#38BDF8",
                          fontWeight: 800,
                          fontSize: "1.3rem",
                        }}
                      >
                        RB
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Member Tooltip Badge on Hover / Click */}
                {isThisHovered && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-48px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(15, 20, 30, 0.96)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      borderRadius: "10px",
                      padding: "0.4rem 0.85rem",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.85), 0 0 15px rgba(56, 189, 248, 0.2)",
                      backdropFilter: "blur(14px)",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      animation: "fadeIn 0.2s ease-out",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#38BDF8", fontWeight: 600 }}>
                      {displayRole}
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
