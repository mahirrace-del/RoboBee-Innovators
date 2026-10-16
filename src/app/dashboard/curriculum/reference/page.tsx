"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./reference.module.css";
import { 
  FIELD_GUIDE_SECTIONS, 
  FIELD_GUIDE_ENTRIES, 
  MASTER_GLOSSARY, 
  CHEAT_SHEETS, 
  FieldGuideSectionId, 
  ReadingLevel, 
  FieldGuideEntry 
} from "@/lib/referenceData";
import { AUTHORITATIVE_RESOURCES } from "@/lib/resources";
import { ArduinoUnoPinout } from "@/components/curriculum/ArduinoUnoPinout";
import { 
  Search, BookOpen, Layers, Zap, Bot, Cpu, Box, Code, 
  RotateCw, ShieldAlert, Trophy, Printer, ArrowRight, ExternalLink,
  CheckCircle2, AlertTriangle, Compass, ClipboardCheck, Radio
} from "lucide-react";

// Icon mapping helper
function getSectionIcon(id: FieldGuideSectionId) {
  switch (id) {
    case 'foundations': return <Bot size={16} />;
    case 'arduino': return <Cpu size={16} />;
    case 'board': return <Layers size={16} />;
    case 'electronics': return <Zap size={16} />;
    case 'components': return <Box size={16} />;
    case 'programming': return <Code size={16} />;
    case 'communication': return <Radio size={16} />;
    case 'motion': return <RotateCw size={16} />;
    case 'design': return <Compass size={16} />;
    case 'testing': return <ClipboardCheck size={16} />;
    case 'safety': return <ShieldAlert size={16} />;
    case 'competitions': return <Trophy size={16} />;
    case 'glossary': return <BookOpen size={16} />;
    case 'cheatsheets': return <Printer size={16} />;
    default: return <BookOpen size={16} />;
  }
}

function FieldGuideContent() {
  const searchParams = useSearchParams();
  const entryQueryParam = searchParams.get("entry");
  const sectionQueryParam = searchParams.get("section") as FieldGuideSectionId | null;

  const [activeSection, setActiveSection] = useState<FieldGuideSectionId | "all">("all");
  const [activeLevel, setActiveLevel] = useState<ReadingLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // If query parameter is provided, switch to that entry's section and scroll to it
  useEffect(() => {
    if (entryQueryParam) {
      setSelectedEntryId(entryQueryParam);
      const matched = FIELD_GUIDE_ENTRIES.find(e => e.id === entryQueryParam);
      if (matched) {
        setActiveSection(matched.sectionId);
      }
      setTimeout(() => {
        const el = document.getElementById(entryQueryParam);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else if (sectionQueryParam) {
      setActiveSection(sectionQueryParam);
    }
  }, [entryQueryParam, sectionQueryParam]);

  // Filter entries
  const filteredEntries = FIELD_GUIDE_ENTRIES.filter(entry => {
    if (activeSection !== "all" && entry.sectionId !== activeSection) return false;
    if (activeLevel !== "all" && entry.readingLevel !== activeLevel) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.quickVersion.toLowerCase().includes(q) ||
      entry.fullExplanation.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Filter glossary terms
  const filteredGlossary = MASTER_GLOSSARY.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.term.toLowerCase().includes(q) ||
      item.plainMeaning.toLowerCase().includes(q) ||
      item.technicalMeaning.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <BookOpen size={14} /> Official Reference Library
        </div>
        <h1 className={styles.heroTitle}>Arduino & Robotics Field Guide</h1>
        <p className={styles.heroSubtitle}>
          A comprehensive, verified technical reference cross-linked with all 36 curriculum classes.
          Explore board pinouts, silicon electrical limits, components, C++ syntax, kinematics, and laboratory safety codes.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className={styles.searchFilterBar}>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search concepts, pins, components, C++ functions, or error messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Field Guide"
            />
          </div>

          <select
            className={styles.levelFilter}
            value={activeLevel}
            onChange={(e) => setActiveLevel(e.target.value as ReadingLevel | "all")}
            aria-label="Filter by reading level"
          >
            <option value="all">All Reading Levels</option>
            <option value="explorer">Explorer Level (Ages 8-10)</option>
            <option value="beginner">Beginner Level (Ages 10-14)</option>
            <option value="intermediate">Intermediate Systems</option>
            <option value="advanced">Advanced / Competition</option>
          </select>
        </div>

        {/* Section Navigation Tabs */}
        <div className={styles.sectionTabs} role="tablist">
          <button
            className={`${styles.sectionTab} ${activeSection === "all" ? styles.sectionTabActive : ""}`}
            onClick={() => setActiveSection("all")}
            role="tab"
            aria-selected={activeSection === "all"}
          >
            <Layers size={15} /> All Topics
          </button>
          {FIELD_GUIDE_SECTIONS.map(sec => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                className={`${styles.sectionTab} ${isActive ? styles.sectionTabActive : ""}`}
                onClick={() => setActiveSection(sec.id)}
                role="tab"
                aria-selected={isActive}
              >
                {getSectionIcon(sec.id)} {sec.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === "board" && (
        <div style={{ marginBottom: "2rem" }}>
          <ArduinoUnoPinout />
        </div>
      )}

      {activeSection === "cheatsheets" ? (
        /* Printable Cheat Sheets View */
        <div className={styles.entriesList}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Printable Bench Cheat Sheets</h2>
            <button className={styles.printBtn} onClick={() => window.print()}>
              <Printer size={16} /> Print These Sheets
            </button>
          </div>

          {CHEAT_SHEETS.map(sheet => (
            <div key={sheet.id} className={styles.cheatSheetCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span className={styles.heroBadge} style={{ background: "#f1f5f9", color: "#6B0F24", border: "1px solid #cbd5e1" }}>
                  {sheet.category}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>RoboBEE Lab Verified</span>
              </div>
              <h3 className={styles.cheatSheetTitle}>{sheet.title}</h3>
              <p style={{ fontSize: "0.95rem", color: "#475569", margin: "0 0 1rem 0" }}>{sheet.summary}</p>
              
              <ul className={styles.cheatSheetPoints}>
                {sheet.printableBulletPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>

              {sheet.quickReferenceTable && (
                <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Signal / Pin</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Function</th>
                        {sheet.quickReferenceTable[0].col3 && <th style={{ padding: "0.5rem 0.75rem" }}>Notes</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.quickReferenceTable.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{row.col1}</td>
                          <td style={{ padding: "0.5rem 0.75rem" }}>{row.col2}</td>
                          {row.col3 && <td style={{ padding: "0.5rem 0.75rem", color: "#64748b" }}>{row.col3}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : activeSection === "glossary" ? (
        /* Master Glossary View */
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>
            Robotics Master Glossary ({filteredGlossary.length} terms)
          </h2>
          <div className={styles.glossaryGrid}>
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className={styles.glossaryCard}>
                <div className={styles.glossaryCategory}>{item.category}</div>
                <h3 className={styles.glossaryTerm}>{item.term}</h3>
                <p className={styles.glossaryPlain}><strong>Plain Meaning:</strong> {item.plainMeaning}</p>
                <div className={styles.glossaryTechnical}>
                  <strong>Technical:</strong> {item.technicalMeaning}
                </div>
                {item.relatedLessonIds.length > 0 && (
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.3rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Taught in:</span>
                    {item.relatedLessonIds.map(lid => (
                      <Link key={lid} href={`/dashboard/curriculum?lesson=${lid}`} className={styles.lessonPill}>
                        {lid.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Field Guide Topic Cards */
        <div className={styles.entriesList}>
          {filteredEntries.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <AlertTriangle size={36} color="#d97706" style={{ margin: "0 auto 1rem auto" }} />
              <h3 style={{ margin: "0 0 0.5rem 0" }}>No matching Field Guide entries found</h3>
              <p style={{ color: "#64748b", margin: 0 }}>Try clearing your search query or switching to All Topics.</p>
            </div>
          ) : (
            filteredEntries.map(entry => {
              const isSelected = selectedEntryId === entry.id;
              const levelClass = 
                entry.readingLevel === "explorer" ? styles.levelExplorer :
                entry.readingLevel === "beginner" ? styles.levelBeginner :
                entry.readingLevel === "intermediate" ? styles.levelIntermediate :
                styles.levelAdvanced;

              return (
                <article
                  key={entry.id}
                  id={entry.id}
                  className={`${styles.entryCard} ${isSelected ? styles.entryCardSelected : ""}`}
                >
                  <div className={styles.entryHeader}>
                    <div>
                      <h2 className={styles.entryTitle}>{entry.title}</h2>
                    </div>
                    <div className={styles.badgeRow}>
                      <span className={`${styles.levelBadge} ${levelClass}`}>
                        {entry.readingLevel}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                        {entry.sectionId.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Quick Version Highlight */}
                  <div className={styles.quickVersionBox}>
                    <strong>Quick Summary:</strong> {entry.quickVersion}
                  </div>

                  {/* Full Prose Explanation */}
                  <div className={styles.fullText}>
                    {entry.fullExplanation}
                  </div>

                  {/* Worked Example */}
                  {entry.workedExample && (
                    <div className={styles.workedExampleBox}>
                      <div className={styles.workedExampleTitle}>
                        <Code size={14} /> Worked Engineering Example
                      </div>
                      <div>{entry.workedExample}</div>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {entry.commonMistakes.length > 0 && (
                    <div className={styles.mistakesBox}>
                      <div className={styles.mistakesTitle}>
                        <AlertTriangle size={14} /> Common Pitfalls to Avoid:
                      </div>
                      <ul className={styles.mistakesList}>
                        {entry.commonMistakes.map((mistake, idx) => (
                          <li key={idx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer: Lesson Cross-Links & Source Block */}
                  <div className={styles.entryFooter}>
                    <div className={styles.lessonLinkList}>
                      <span>Used in Classes:</span>
                      {entry.applicableLessonIds.map(lid => (
                        <Link key={lid} href={`/dashboard/curriculum?lesson=${lid}`} className={styles.lessonPill}>
                          {lid.toUpperCase()}
                        </Link>
                      ))}
                    </div>

                    {entry.tryItLessonId && (
                      <Link href={`/dashboard/curriculum?lesson=${entry.tryItLessonId}`} className={styles.tryItBtn}>
                        Try It in Lab ({entry.tryItLessonId.toUpperCase()}) <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>

                  {/* Authoritative Sources */}
                  {entry.sourceIds.length > 0 && (
                    <div className={styles.sourcesBlock}>
                      <strong>Authoritative Primary Sources: </strong>
                      {entry.sourceIds.map(sid => {
                        const res = AUTHORITATIVE_RESOURCES.find(r => r.id === sid);
                        return (
                          <span key={sid} style={{ marginRight: "0.75rem" }}>
                            {res ? (
                              <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: "#6B0F24", textDecoration: "underline" }}>
                                {res.title} ({res.publisher}) <ExternalLink size={10} style={{ display: "inline" }} />
                              </a>
                            ) : sid}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function FieldGuidePage() {
  return (
    <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center" }}>Loading Arduino & Robotics Field Guide...</div>}>
      <FieldGuideContent />
    </Suspense>
  );
}
