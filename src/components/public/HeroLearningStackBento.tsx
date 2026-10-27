"use client";

import { useState } from "react";
import { ArrowUpRight, Bot, Cpu, Radio, Zap } from "lucide-react";
import styles from "./HeroLearningStackBento.module.css";

const pathways = [
  {
    number: "01", title: "Electronics", level: "Foundational track",
    description: "Learn breadboarding, Ohm’s law, digital and analog I/O, PWM, and Arduino C++ through guided builds.",
    project: "LED and ultrasonic radar", stack: "Arduino Nano · HC-SR04 · NeoPixel", icon: Zap,
    details: ["Arduino Uno / Nano", "Ultrasonic, LDR, PIR", "Displays, buzzers, servos"],
  },
  {
    number: "02", title: "Automation", level: "Intermediate track",
    description: "Connect sensors, motors, and wireless telemetry, then use feedback to make your robot respond reliably.",
    project: "Bluetooth wireless rover", stack: "Motor driver · HC-05 · DC motors", icon: Radio,
    details: ["Bluetooth & ESP32 Wi-Fi", "DC motors & servos", "Regulated LiPo power"],
  },
  {
    number: "03", title: "Competition", level: "Advanced & olympiad",
    description: "Design custom 3D-printed robots and prepare for autonomous line-following, maze solving, and national events.",
    project: "Micromouse & robotic arm", stack: "Flood-fill · encoders · inverse kinematics", icon: Bot,
    details: ["3D-printed chassis", "PID & flood-fill", "FIRSO & national rounds"],
  },
];

export function HeroLearningStackBento() {
  const [active, setActive] = useState(0);
  const track = pathways[active];
  const ProjectIcon = track.icon;

  return (
    <div className={styles.pathwayPanel}>
      <div className={styles.pathwayTop}>
        <div><span className={styles.pathwayOverline}>Learn by building</span><h2>Choose your pathway</h2></div>
        <span className={styles.pathwayMark}><Cpu size={20} /></span>
      </div>
      <div className={styles.pathwayTabs} role="group" aria-label="Learning pathways">
        {pathways.map((path, index) => (
          <button type="button" aria-pressed={active === index} aria-controls="pathway-details" key={path.number} onClick={() => setActive(index)}>
            <span>{path.number}</span>{path.title}
          </button>
        ))}
      </div>
      <div id="pathway-details" className={styles.pathwayDetails}>
        <span className={styles.pathwayLevel}>{track.level} <span>{track.number} / 03</span></span>
        <h3>{track.title}</h3>
        <p>{track.description}</p>
        <div className={styles.pathwayProject}><span><ProjectIcon size={17} /></span><div><small>Build highlight</small><strong>{track.project}</strong><em>{track.stack}</em></div><ArrowUpRight size={17} /></div>
        <div className={styles.pathwayDetailsList}>{track.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
      </div>
    </div>
  );
}
