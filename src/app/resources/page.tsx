"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./resources.module.css";
import { AUTHORITATIVE_RESOURCES } from "@/lib/resources";
import { Bot, ExternalLink, ShieldCheck, BookOpen } from "lucide-react";

export default function ResourcesAndCreditsPage() {
  const [filterCat, setFilterCat] = useState<string>("all");

  const filteredResources = AUTHORITATIVE_RESOURCES.filter(r => {
    if (filterCat === "all") return true;
    return r.category === filterCat;
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Navigation Bar */}
        <header className={styles.navBar}>
          <Link href="/" className={styles.logoText}>
            <Bot size={24} color="#F5B800" />
            <span>RoboBEE Innovators</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/explorers" className={styles.navLink}>Free Robo Explorers</Link>
            <Link href="/portal" className={styles.navLink} style={{ color: "#F5B800", fontWeight: 700 }}>
              Member Portal
            </Link>
          </div>
        </header>

        {/* Hero Header */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <BookOpen size={14} /> Official Citations &amp; Permissions
          </div>
          <h1 className={styles.heroTitle}>Authoritative Resources &amp; Credits</h1>
          <p className={styles.heroSubtitle}>
            RoboBEE Innovators grounds every circuit schematic, electrical limit, pinout table, and code example
            in manufacturer datasheets, official microcontroller standards, and verified tournament handbooks.
          </p>
        </section>

        {/* IP and Proprietary Architecture Notice */}
        <section style={{ background: "#111827", border: "1px solid #6B0F24", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F5B800", fontWeight: 800, fontSize: "1rem", marginBottom: "0.5rem" }}>
            <ShieldCheck size={20} color="#F5B800" />
            <span>Intellectual Property &amp; Educational Architecture</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.6 }}>
            All lesson plans, classroom rhythm allocations, original SVG connection diagrams, code labs,
            and teaching methodologies are proprietary educational works authored by <strong>RoboBEE Innovators</strong> 
            (operated in partnership with Penny Bee Solutions at Kids Den Int. Preschool, Flat 2, 75 North Chashara, Narayanganj).
            Commercial redistribution, replication with external trainers, or uncredited use is strictly prohibited under our institutional policy.
          </p>
        </section>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Filter by Source Category:</span>
          {[
            { id: "all", label: "All Sources" },
            { id: "official_documentation", label: "Official Documentation" },
            { id: "manufacturer_datasheet", label: "Manufacturer Datasheets" },
            { id: "competition_rulebook", label: "Competition Rulebooks" },
            { id: "instructor_developed", label: "Lab Safety Standards" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              style={{
                background: filterCat === cat.id ? "#6B0F24" : "#111827",
                color: filterCat === cat.id ? "#ffffff" : "#cbd5e1",
                border: filterCat === cat.id ? "1px solid #F5B800" : "1px solid #1e293b",
                padding: "0.4rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <section className={styles.resourceGrid}>
          {filteredResources.map(res => (
            <div key={res.id} className={styles.resourceCard}>
              <div className={styles.resourceCategory}>
                {res.category.replace(/_/g, " ")}
              </div>
              <h2 className={styles.resourceTitle}>{res.title}</h2>
              <div className={styles.resourcePublisher}>
                Published by <strong>{res.publisher}</strong>
              </div>
              <p className={styles.resourceSummary}>{res.summary}</p>

              <div className={styles.metaItem}>
                <strong>Version / Revision:</strong> {res.versionOrRevision || "Current Release"}
              </div>
              <div className={styles.metaItem}>
                <strong>Retrieved / Verified:</strong> {res.retrievedOrPublishedDate}
              </div>
              <div className={styles.metaItem}>
                <strong>License Terms:</strong> {res.licenseOrTerms}
              </div>

              {res.supports.lessonIds && res.supports.lessonIds.length > 0 && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "#94a3b8" }}>
                  <strong>Supports Lessons: </strong>
                  {res.supports.lessonIds.map(id => id.toUpperCase()).join(", ")}
                </div>
              )}

              <div className={styles.linkRow}>
                <span className={styles.licenseBadge}>Authoritative Primary Source</span>
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.resourceLink}
                >
                  <span>Official Page</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Footer Credit & Verification Statement */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "#64748b" }}>
          <div>RoboBEE Innovators — <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em></div>
          <div style={{ marginTop: "0.35rem" }}>
            Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj 1400 | Phone: +880 1902-821018
          </div>
        </footer>
      </div>
    </div>
  );
}
