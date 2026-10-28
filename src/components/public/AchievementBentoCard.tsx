"use client";

import { useState } from "react";
import { Trophy, ArrowDown, ArrowUp } from "lucide-react";
import styles from "./public-cards.module.css";

interface AchievementBentoCardProps {
  achievement: {
    id: string;
    title: string;
    year: string;
    description: string;
    image?: string;
    category?: string;
    milestoneType?: string;
    imageFit?: "contain" | "cover";
  };
}

export function AchievementBentoCard({ achievement }: AchievementBentoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = achievement?.title || "Milestone";
  const desc = achievement?.description || "";
  const year = achievement?.year || "";

  // 1. Prioritize explicit category/milestone set by admin in CMS
  const customLabel = achievement?.category || achievement?.milestoneType;
  let label = customLabel;

  if (!label) {
    // Fallback smart detection
    const fullText = `${title} ${desc}`.toLowerCase();
    const international = /korea|seoul|wico|wise|isif|malaysia|international|global|world|olympiad|olympic|asia/i.test(fullText);
    const national = /firso|uiu|national|bangladesh|dhaka|division/i.test(fullText);

    label = international
      ? "International Milestone"
      : national
      ? "National Milestone"
      : "Award of Excellence";
  }

  const hasLongDescription = desc.length > 85;

  return (
    <article className={styles.achievementCard}>
      <div className={styles.achievementTop}>
        <div className={styles.achievementLabel}>
          <span className={styles.achievementIcon}>
            <Trophy size={18} />
          </span>
          {label}
        </div>
        {year && <span className={styles.year}>{year}</span>}
      </div>

      {achievement?.image?.trim() && (
        <div className={styles.achievementVisual}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.achievementImage}
            style={
              achievement.imageFit === "cover"
                ? { objectFit: "cover", objectPosition: "top center" }
                : { objectFit: "contain" }
            }
            src={achievement.image.trim()}
            alt={title}
            loading="lazy"
          />
        </div>
      )}

      <h3>{title}</h3>

      {desc && (
        <div>
          <p
            className={`${styles.achievementDescription} ${
              isExpanded ? styles.achievementDescriptionExpanded : ""
            }`}
          >
            {desc}
          </p>

          {hasLongDescription && (
            <button
              type="button"
              className={styles.readDetailsButton}
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Read full description"}
              {isExpanded ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
