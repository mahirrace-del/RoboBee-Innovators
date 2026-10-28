"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import styles from "./MemberOrbitShowcase.module.css";

export interface MarqueeItem { id?: string; name?: string; role?: string; image?: string }

export function MemberOrbitShowcase({ marquees }: { marquees: MarqueeItem[] }) {
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const validMarquees = Array.isArray(marquees) ? marquees.filter(Boolean) : [];
  if (!validMarquees.length) return null;

  const copies = Array.from({ length: Math.max(1, Math.ceil(18 / validMarquees.length)) }, () => validMarquees).flat();
  const items = [...copies, ...copies];

  return (
    <section id="members" className={styles.community} aria-labelledby="community-title">
      <header className={styles.communityHeading}>
        <span className={styles.communityEyebrow}><Sparkles size={14} /> Active innovator community</span>
        <h2 id="community-title">Meet our makers <span>&amp; innovators</span></h2>
        <p>Students, researchers, and robotics engineers learning and building together in our North Chashara Maker Lab.</p>
      </header>
      <div className={styles.marqueeWindow} onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); setSelected(null); }}>
        <div className={`${styles.marqueeTrack} ${paused ? styles.paused : ""}`}>
          {items.map((member, index) => {
            const key = member.id || `member-${index % copies.length}`;
            const active = selected === `${key}-${index}`;
            const name = member.name?.trim() || "RoboBEE innovator";
            const role = member.role?.trim() || "Maker Lab Member";
            return (
              <button
                className={`${styles.memberButton} ${active ? styles.memberActive : ""}`}
                type="button"
                key={`${key}-${index}`}
                aria-label={`${name}, ${role}. ${active ? "Selected" : "Select member"}`}
                aria-pressed={active}
                aria-hidden={index >= copies.length}
                tabIndex={index >= copies.length ? -1 : 0}
                onFocus={() => { setPaused(true); setSelected(`${key}-${index}`); }}
                onBlur={() => { setPaused(false); setSelected(null); }}
                onMouseEnter={() => { setPaused(true); setSelected(`${key}-${index}`); }}
                onClick={() => { setPaused(true); setSelected(active ? null : `${key}-${index}`); }}
              >
                <span className={styles.memberPhoto}>
                  {member.image?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image.trim()} alt="" loading="lazy" />
                  ) : <span aria-hidden="true">RB</span>}
                </span>
                <span className={styles.memberCaption}>
                  <strong>{name}</strong><small>{role}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className={styles.marqueeHint}>Select a portrait to pause and view member details</p>
    </section>
  );
}
