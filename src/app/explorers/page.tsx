"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  Bot,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Cpu,
  Lightbulb,
  Play,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import { ALL_ROBOTICS_LESSONS, RoboticsLesson } from "@/lib/curriculumData";
import styles from "./explorers.module.css";

type LessonTab = "mission" | "make" | "know" | "safe" | "play";

const explorerVisuals: Record<string, { src: string; alt: string; eyebrow: string; label: string }> = {
  "exp-01": {
    src: "/illustrations/explorer-robot-detective.svg",
    alt: "A friendly robot detective explains the Sense, Decide, Act cycle.",
    eyebrow: "Mission 01",
    label: "Discover what makes a machine a robot.",
  },
  "exp-02": {
    src: "/illustrations/paper_circuit_led_switch.svg",
    alt: "Reference illustration of a paper circuit with a coin cell, switch, and LED.",
    eyebrow: "Mission 02",
    label: "Make a light turn on with a safe paper circuit.",
  },
  "exp-03": {
    src: "/illustrations/explorer-rover-route.svg",
    alt: "A small wheeled rover follows a path through a grid challenge.",
    eyebrow: "Mission 03",
    label: "Plan how a rover moves, turns, and reaches a goal.",
  },
  "exp-04": {
    src: "/illustrations/explorer-helper-design.svg",
    alt: "A helper robot blueprint labels the sensor, brain rule, actuator, and safety stop.",
    eyebrow: "Mission 04",
    label: "Invent a robot that helps someone in the real world.",
  },
};

const tabs: { id: LessonTab; label: string; icon: typeof Compass }[] = [
  { id: "mission", label: "Mission", icon: Compass },
  { id: "make", label: "Make", icon: Wrench },
  { id: "know", label: "Know", icon: BookOpen },
  { id: "safe", label: "Safe", icon: ShieldCheck },
  { id: "play", label: "Play", icon: Play },
];

function lessonVisual(lesson: RoboticsLesson) {
  return explorerVisuals[lesson.id] ?? explorerVisuals["exp-01"];
}

export default function FreeRoboExplorersPage() {
  const explorerLessons = ALL_ROBOTICS_LESSONS.filter((lesson) => lesson.courseId === "explorer");
  const [selectedLessonId, setSelectedLessonId] = useState("exp-01");
  const [activeTab, setActiveTab] = useState<LessonTab>("mission");

  const currentLesson = explorerLessons.find((lesson) => lesson.id === selectedLessonId) ?? explorerLessons[0];
  const currentVisual = lessonVisual(currentLesson);
  const selectedIndex = explorerLessons.findIndex((lesson) => lesson.id === currentLesson.id);

  const selectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab("mission");
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageFrame}>
        <header className={styles.navBar}>
          <Link href="/" className={styles.brand} aria-label="RoboBEE Innovators home">
            <span className={styles.brandMark}><Bot size={20} aria-hidden="true" /></span>
            <span>RoboBEE <em>Innovators</em></span>
          </Link>
          <nav className={styles.navLinks} aria-label="Explorer navigation">
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/resources" className={styles.navLink}>Resources</Link>
            <Link href="/portal" className={styles.portalLink}>Member portal <ArrowRight size={15} /></Link>
          </nav>
        </header>

        <section className={styles.hero} aria-labelledby="explorer-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><Sparkles size={15} aria-hidden="true" /> Proposed free sampler · Classes 3–4</p>
            <h1 id="explorer-title">Start with wonder.<br /><span>Build with purpose.</span></h1>
            <p className={styles.heroText}>
              Four short, visual missions for young inventors. Observe real robot ideas, make a safe circuit,
              steer a rover, then design a helpful machine of your own.
            </p>
            <div className={styles.heroActions}>
              <a href="#learning-path" className={styles.primaryButton}>Choose a mission <ArrowRight size={17} /></a>
              <div className={styles.heroFact}><Clock3 size={17} aria-hidden="true" /><span><strong>4 missions</strong><br />about 45 minutes each</span></div>
            </div>
          </div>
          <div className={styles.heroArtwork}>
            <Image
              src="/illustrations/explorer-learning-journey.svg"
              alt="The Free Robo Explorers path: discover, make, move, and invent."
              width={680}
              height={520}
              priority
            />
          </div>
        </section>

        <section className={styles.pathSection} id="learning-path" aria-labelledby="path-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Your learning path</p>
              <h2 id="path-title">Choose one mission at a time</h2>
            </div>
            <p>Every mission has an illustration, a guided activity, vocabulary, safety notes, and a browser-based way to explore the idea.</p>
          </div>

          <div className={styles.lessonRail} role="list" aria-label="Four Explorer missions">
            {explorerLessons.map((lesson, index) => {
              const visual = lessonVisual(lesson);
              const isCurrent = lesson.id === currentLesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  className={`${styles.lessonCard} ${isCurrent ? styles.lessonCardCurrent : ""}`}
                  onClick={() => selectLesson(lesson.id)}
                  aria-pressed={isCurrent}
                  role="listitem"
                >
                  <span className={styles.lessonNumber}>0{index + 1}</span>
                  <div className={styles.cardImageWrap}>
                    <Image src={visual.src} alt="" width={720} height={480} className={styles.cardImage} />
                    <span className={styles.cardState}>{isCurrent ? "Open mission" : `${lesson.durationMinutes} min`}</span>
                  </div>
                  <span className={styles.cardEyebrow}>{visual.eyebrow}</span>
                  <strong>{lesson.title}</strong>
                  <span className={styles.cardSummary}>{visual.label}</span>
                  <span className={styles.cardFooter}>{isCurrent ? "You are here" : "Open lesson"}<ChevronRight size={15} /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.lessonStudio} aria-labelledby="lesson-title">
          <div className={styles.progressBar} aria-label={`Mission ${selectedIndex + 1} of ${explorerLessons.length}`}>
            <span style={{ width: `${((selectedIndex + 1) / explorerLessons.length) * 100}%` }} />
          </div>

          <div className={styles.lessonIntro}>
            <div>
              <p className={styles.sectionKicker}>{currentVisual.eyebrow} · Explorer lab</p>
              <h2 id="lesson-title">{currentLesson.title}</h2>
              <p>{currentLesson.promise}</p>
            </div>
            <div className={styles.lessonMeta}>
              <span><Clock3 size={16} /> {currentLesson.durationMinutes} min</span>
              <span><Award size={16} /> {currentLesson.proposedAudience}</span>
            </div>
          </div>

          <div className={styles.lessonGrid}>
            <div className={styles.mainVisual}>
              <Image src={currentVisual.src} alt={currentVisual.alt} width={720} height={480} className={styles.mainImage} />
              <div className={styles.visualCaption}>
                <Lightbulb size={18} aria-hidden="true" />
                <span><strong>Look closely:</strong> {currentVisual.label}</span>
              </div>
            </div>
            <aside className={styles.missionSnapshot} aria-label="Mission overview">
              <span className={styles.snapshotLabel}>Mission goal</span>
              <h3>{currentLesson.project.name}</h3>
              <p>When you finish, you can show:</p>
              <ul>
                {currentLesson.project.successEvidence.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
              </ul>
              <div className={styles.snapshotDivider} />
              <span className={styles.snapshotLabel}>You will practise</span>
              <div className={styles.skillChips}>
                {currentLesson.outcomes.slice(0, 3).map((outcome) => <span key={outcome}>{outcome}</span>)}
              </div>
            </aside>
          </div>

          <div className={styles.tabList} role="tablist" aria-label="Lesson sections">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabButton} ${selected ? styles.tabButtonActive : ""}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon size={16} aria-hidden="true" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className={styles.lessonPanel} id={`${activeTab}-panel`} role="tabpanel">
            {activeTab === "mission" && (
              <div className={styles.missionPanel}>
                <div>
                  <p className={styles.panelKicker}>What happens in class</p>
                  <h3>A story your hands can follow</h3>
                  <p className={styles.panelLead}>Your teacher guides the mission in short parts. Each part gives you a new clue, skill, or chance to share what you noticed.</p>
                  <div className={styles.conceptList}>
                    {currentLesson.concepts.slice(0, 3).map((concept, index) => (
                      <article key={concept.title} className={styles.conceptItem}>
                        <span>0{index + 1}</span>
                        <div><h4>{concept.title}</h4><p>{concept.explanation}</p></div>
                      </article>
                    ))}
                  </div>
                </div>
                <ol className={styles.timeline}>
                  {currentLesson.classRhythm.map((segment) => (
                    <li key={segment.segment}>
                      <span className={styles.timelineTime}>{segment.minutes} min</span>
                      <div><strong>{segment.segment}</strong><p>{segment.studentAction}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "make" && (
              <div className={styles.makePanel}>
                <div className={styles.makeHeading}><span className={styles.makeIcon}><Wrench size={22} /></span><div><p className={styles.panelKicker}>Hands-on activity</p><h3>{currentLesson.activity.title}</h3></div></div>
                <ol className={styles.activitySteps}>
                  {currentLesson.activity.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
                </ol>
                <div className={styles.successGrid}>
                  <div><span>Success looks like</span>{currentLesson.activity.successCriteria.map((criterion) => <p key={criterion}><Check size={16} />{criterion}</p>)}</div>
                  {currentLesson.activity.extension && <div className={styles.bonusCard}><span>Try a bonus</span><p>{currentLesson.activity.extension}</p></div>}
                </div>
              </div>
            )}

            {activeTab === "know" && (
              <div className={styles.knowPanel}>
                <div className={styles.outcomePanel}><p className={styles.panelKicker}>By the end, you can</p><h3>Explain what you discovered</h3><ul>{currentLesson.outcomes.map((outcome) => <li key={outcome}><Check size={17} />{outcome}</li>)}</ul></div>
                <div className={styles.vocabularyPanel}>
                  <p className={styles.panelKicker}>Word toolbox</p><h3>Words for young engineers</h3>
                  <div className={styles.vocabularyGrid}>{currentLesson.vocabulary.map((word) => <article key={word.term}><h4>{word.term}</h4><p>{word.plainMeaning}</p><details><summary>Engineer meaning</summary><span>{word.technicalMeaning}</span></details></article>)}</div>
                </div>
              </div>
            )}

            {activeTab === "safe" && (
              <div className={styles.safePanel}>
                <div className={styles.safetyCard}><ShieldCheck size={26} /><div><p className={styles.panelKicker}>Build safely</p><h3>Safety comes before switching anything on</h3><ul>{currentLesson.safetyNotes.map((note) => <li key={note}>{note}</li>)}</ul></div></div>
                <div className={styles.materialCard}><Cpu size={24} /><div><p className={styles.panelKicker}>What you may use</p><h3>Mission materials</h3><div className={styles.materialChips}>{currentLesson.verifiedMaterials.map((item) => <span key={item}>{item}</span>)}</div></div></div>
                {currentLesson.physicalBuildPack && <div className={styles.referenceCard}><Image src={currentLesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration} alt="Reference circuit wiring illustration for this lesson." width={540} height={340} /><div><p className={styles.panelKicker}>Visual build reference</p><h3>Follow the picture with your teacher</h3><p>{currentLesson.physicalBuildPack.schematic}</p></div></div>}
              </div>
            )}

            {activeTab === "play" && (
              <div className={styles.playPanel}>
                <div className={styles.playHeading}><div><p className={styles.panelKicker}>Interactive lab</p><h3>Try the idea before you build</h3><p>This is a browser simulation. It helps you explore the mission safely; it is not a replacement for a teacher-supervised physical activity.</p></div><span><Play size={15} /> Simulation</span></div>
                <CurriculumSimulator visualizerId={currentLesson.visualizerId} lessonTitle={currentLesson.title} />
              </div>
            )}
          </div>
        </section>

        <section className={styles.nextStep} aria-labelledby="next-step-title">
          <div><p className={styles.sectionKicker}>After Explorer</p><h2 id="next-step-title">Ready for an Arduino that you can program?</h2><p>Move into Beginner Robotics & Arduino, where students meet a microcontroller, write their first code, and make a light blink.</p></div>
          <div className={styles.nextActions}><Link href="/portal" className={styles.primaryButton}>Visit member portal <ArrowRight size={17} /></Link><a href="tel:+8801902821018" className={styles.callLink}>Talk to RoboBEE <span>+880 1902-821018</span></a></div>
        </section>
      </div>
    </main>
  );
}
