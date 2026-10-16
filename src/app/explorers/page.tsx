"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./explorers.module.css";
import { ALL_ROBOTICS_LESSONS, RoboticsLesson } from "@/lib/curriculumData";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import { 
  Sparkles, Bot, Zap, ArrowRight, ShieldCheck, CheckCircle, 
  HelpCircle, Compass, Award, ExternalLink
} from "lucide-react";

export default function FreeRoboExplorersPage() {
  const explorerLessons = ALL_ROBOTICS_LESSONS.filter(l => l.courseId === 'explorer');
  const [selectedLessonId, setSelectedLessonId] = useState<string>("exp-01");

  const currentLesson: RoboticsLesson = 
    explorerLessons.find(l => l.id === selectedLessonId) || explorerLessons[0];

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
            <Link href="/resources" className={styles.navLink}>Resources &amp; Credits</Link>
            <Link href="/portal" className={styles.portalBtn}>Member Sign In</Link>
          </div>
        </header>

        {/* Hero Banner */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} /> Proposed Offering — Free to Try
          </div>
          <h1 className={styles.heroTitle}>Free Robo Explorers</h1>
          <p className={styles.heroSubtitle}>
            A playful, supervised, low-voltage introduction to robotics for young minds (Classes 3–4, Ages 8–10).
            Zero prior electronics or coding required. Try real interactive simulators right in your browser!
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#simulator" className={styles.ctaBtn}>
              Launch Simulator Below <ArrowRight size={16} style={{ display: "inline" }} />
            </a>
          </div>
        </section>

        {/* 4 Explorer Class Cards */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F5B800", textTransform: "uppercase" }}>
              4-Class Foundational Roadmap
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0.25rem 0 0 0" }}>
              Select an Explorer Class to Explore
            </h2>
          </div>

          <div className={styles.classesGrid}>
            {explorerLessons.map(lesson => {
              const isActive = selectedLessonId === lesson.id;
              return (
                <div
                  key={lesson.id}
                  className={`${styles.classCard} ${isActive ? styles.classCardActive : ""}`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedLessonId(lesson.id); }}
                >
                  <span className={styles.classCode}>{lesson.code}</span>
                  <h3 className={styles.classTitle}>{lesson.title}</h3>
                  <p className={styles.classPromise}>{lesson.promise}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.8rem", color: "#F5B800" }}>
                    <span>{lesson.durationMinutes} Minutes</span>
                    <span style={{ fontWeight: 700 }}>{isActive ? "Active ★" : "Select ➔"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Simulator Section */}
        <section id="simulator" className={styles.simulatorSection}>
          <div className={styles.simulatorHeader}>
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                Interactive Browser Simulator (No Hardware Required)
              </span>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0 0", color: "#ffffff" }}>
                {currentLesson.code}: {currentLesson.title}
              </h2>
            </div>
            <div style={{ background: "rgba(245, 184, 0, 0.1)", border: "1px solid #F5B800", padding: "0.35rem 0.85rem", borderRadius: "20px", fontSize: "0.8rem", color: "#F5B800", fontWeight: 700 }}>
              Live Simulation Mode
            </div>
          </div>

          <CurriculumSimulator
            visualizerId={currentLesson.visualizerId}
            lessonTitle={currentLesson.title}
          />
        </section>

        {/* Class Learning Guide Details */}
        <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
          {/* Activity & Steps */}
          <div style={{ background: "#111827", padding: "1.5rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F5B800", margin: "0 0 1rem 0" }}>
              Hands-On Activity: {currentLesson.activity.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {currentLesson.activity.steps.map((st, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ background: "#6B0F24", color: "#ffffff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.5 }}>{st}</span>
                </div>
              ))}
            </div>

            {currentLesson.activity.extension && (
              <div style={{ marginTop: "1.25rem", background: "rgba(56, 189, 248, 0.1)", border: "1px solid #38bdf8", padding: "0.85rem", borderRadius: "8px", fontSize: "0.85rem", color: "#38bdf8" }}>
                <strong>Bonus Challenge: </strong>{currentLesson.activity.extension}
              </div>
            )}
          </div>

          {/* Outcomes & Safety */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#111827", padding: "1.25rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
              <div style={{ fontWeight: 800, color: "#10b981", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                🎯 What Explorers Achieve:
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.6 }}>
                {currentLesson.outcomes.map((out, i) => (
                  <li key={i}>{out}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "rgba(107, 15, 36, 0.25)", border: "1px solid #6B0F24", padding: "1.25rem", borderRadius: "12px" }}>
              <div style={{ fontWeight: 800, color: "#fca5a5", fontSize: "0.85rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <ShieldCheck size={16} />
                <span>Supervised Safety Note:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.6 }}>
                {currentLesson.safetyNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Vocabulary Flashcards */}
        <section style={{ background: "#111827", padding: "1.5rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F5B800", margin: "0 0 1rem 0" }}>
            📖 Explorer Vocabulary
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {currentLesson.vocabulary.map((voc, i) => (
              <div key={i} style={{ background: "#0b101b", border: "1px solid #1e293b", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ fontWeight: 800, color: "#F5B800", fontSize: "1rem", marginBottom: "0.25rem" }}>
                  {voc.term}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.4rem" }}>
                  {voc.plainMeaning}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#38bdf8" }}>
                  Technical: {voc.technicalMeaning}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner to Full Academy */}
        <section className={styles.ctaBanner}>
          <Award size={36} color="#F5B800" />
          <h2 className={styles.ctaTitle}>Ready to Build with Real Arduino Hardware?</h2>
          <p className={styles.ctaText}>
            Join our in-person maker sessions at Kids Den Int. Preschool, Flat 2, 75 North Chashara, Narayanganj.
            Advance into Beginner, Intermediate, and Advanced robotics with real circuits, motors, 3D printers, and competition teams!
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/portal" className={styles.ctaBtn}>
              Student &amp; Member Portal ➔
            </Link>
            <a
              href="tel:+8801902821018"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "30px",
                border: "1px solid #F5B800",
                color: "#F5B800",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.95rem"
              }}
            >
              Call Lab: +880 1902-821018
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
