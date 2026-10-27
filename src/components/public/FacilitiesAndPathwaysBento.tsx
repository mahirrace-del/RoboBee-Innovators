import Link from "next/link";
import { ArrowRight, Check, Cpu, Printer, School, Sparkles } from "lucide-react";
import styles from "./public-cards.module.css";

const facilities = [
  {
    icon: Printer,
    title: "3D printing & fabrication",
    copy: "Use 3D printers, PLA/PETG filament, and CAD tools to prototype custom chassis, grippers, and sensor mounts.",
    tags: ["PLA / PETG", "CAD", "Custom chassis"],
  },
  {
    icon: Cpu,
    title: "Electronics & testbed",
    copy: "Build on soldering benches with regulated power supplies, oscilloscopes, and more than 100 sensors and modules.",
    tags: ["Oscilloscopes", "Soldering", "ESP32 & STM32"],
  },
  {
    icon: School,
    title: "School outreach & workshops",
    copy: "Learn through collaborative STEM workshops where young makers build Arduino circuits and test robots in mini arenas.",
    tags: ["School workshops", "Hands-on kits", "Mentorship"],
  },
];

export function FacilitiesAndPathwaysBento() {
  return (
    <section id="features" className={styles.programSection}>
      <div className={styles.programHeading}>
        <span className={styles.programEyebrow}><Sparkles size={14} /> Maker lab & STEM academy</span>
        <h2>Built around <span>making</span></h2>
        <p>Dream. Invent. Experiment. Inspire. Members move from first circuits to fabricated, programmed, and competition-ready robots.</p>
      </div>
      <div className={styles.programGrid}>
        {facilities.map(({ icon: Icon, title, copy, tags }) => (
          <article className={styles.programCard} key={title}>
            <span className={styles.programIcon}><Icon size={23} /></span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <div className={styles.programTags}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
        <div className={styles.joinPanel}>
          <div className={styles.joinCopy}>
            <span className={styles.programEyebrow}><Sparkles size={14} /> Open membership</span>
            <h3>Start building with RoboBEE</h3>
            <p>Join a community with weekly lab sessions, guided projects, 3D printing, and a path to robotics competitions.</p>
            <ul>
              <li><Check size={16} /> Hands-on electronics and breadboarding</li>
              <li><Check size={16} /> In-person lab sessions every Friday</li>
              <li><Check size={16} /> Mentorship and competition teams</li>
            </ul>
          </div>
          <Link href="/recruitment" className={styles.joinLink}>Apply for membership <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
