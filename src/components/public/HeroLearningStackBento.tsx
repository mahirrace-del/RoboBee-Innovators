"use client";

import React, { useState } from "react";
import styles from "./HeroLearningStackBento.module.css";
import {
  Cpu,
  Sparkles,
  Bot,
  Zap,
  Radio,
  Boxes,
  MapPin,
  Gauge,
} from "lucide-react";

interface Track {
  id: string;
  number: string;
  title: string;
  level: string;
  description: string;
  highlightProjects: {
    name: string;
    tag: string;
    icon: React.ReactNode;
    specs: string;
  }[];
  hardwareStack: { label: string; detail: string }[];
}

const TRACKS: Track[] = [
  {
    id: "electronics",
    number: "01",
    title: "Basic Electronics & Arduino",
    level: "Foundational Track",
    description:
      "Step-by-step breadboarding, Ohm's law, digital/analog I/O, PWM, and C++ programming on Arduino Uno & Nano microcontrollers.",
    highlightProjects: [
      {
        name: "LED & Ultrasonic Radar",
        tag: "Level 1",
        icon: <Zap size={16} color="#38BDF8" />,
        specs: "Arduino Nano + HC-SR04 + NeoPixel",
      },
      {
        name: "Touchless Smart Bin",
        tag: "Automation",
        icon: <Cpu size={16} color="#38BDF8" />,
        specs: "Servo SG90 + IR Proximity Sensor",
      },
    ],
    hardwareStack: [
      { label: "Microcontroller", detail: "Arduino Uno / Nano" },
      { label: "Sensors", detail: "Ultrasonic, LDR, PIR" },
      { label: "Output", detail: "OLED 0.96\", Buzzer, Servos" },
    ],
  },
  {
    id: "sensors",
    number: "02",
    title: "Smart Sensors & Automation",
    level: "Intermediate Track",
    description:
      "Interfacing I2C/SPI buses, Laser ToF distance sensors, motor drivers, wireless Bluetooth/WiFi telemetry, and closed-loop control.",
    highlightProjects: [
      {
        name: "Bluetooth Wireless RC Bot",
        tag: "Robotics",
        icon: <Radio size={16} color="#6366F1" />,
        specs: "L298N Driver + HC-05 + Dual Geared DC",
      },
      {
        name: "Laser ToF Telemetry Scanner",
        tag: "Optics",
        icon: <Gauge size={16} color="#6366F1" />,
        specs: "VL53L0X Time-of-Flight + ESP32",
      },
    ],
    hardwareStack: [
      { label: "Telemetry", detail: "Bluetooth & ESP32 WiFi" },
      { label: "Actuators", detail: "High-Torque DC Geared" },
      { label: "Power", detail: "2S LiPo 7.4V Regulated" },
    ],
  },
  {
    id: "competition",
    number: "03",
    title: "Competition Robotics & 3D CAD",
    level: "Advanced & Olympiad",
    description:
      "Designing custom 3D-printed chassis, algorithmic PID line follow, maze exploration algorithms, and national olympiad preparation.",
    highlightProjects: [
      {
        name: "Autonomous Micromouse Maze Solver",
        tag: "Olympiad",
        icon: <Bot size={16} color="#10B981" />,
        specs: "Flood-Fill Algorithm + Optical Encoders",
      },
      {
        name: "4-DOF 3D-Printed Robotic Arm",
        tag: "Kinematics",
        icon: <Boxes size={16} color="#10B981" />,
        specs: "Inverse Kinematics + MG996R Servos",
      },
    ],
    hardwareStack: [
      { label: "Fabrication", detail: "3D Print PLA/PETG Chassis" },
      { label: "Algorithms", detail: "PID + Flood-Fill Maze" },
      { label: "Arena", detail: "FIRSO & National Rounds" },
    ],
  },
];

export function HeroLearningStackBento() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrack = TRACKS[activeTrackIndex];

  return (
    <div className={styles.container}>
      {/* Top Ambient Highlight Glow */}
      <div className={styles.ambientGlow} />

      {/* Header Strip with Terminal / Status Tag */}
      <div className={styles.headerStrip}>
        <div className={styles.headerLeft}>
          <div className={styles.statusDot} />
          <span className={styles.headerTitle}>RoboBee Curriculum Engine</span>
        </div>

        <div className={styles.headerTag}>
          <Sparkles size={12} />
          <span>Hands-On Mastery</span>
        </div>
      </div>

      {/* Layer 1: Interactive Track Switcher */}
      <div>
        <div className={styles.sectionLabel}>Select Pathway Track</div>

        <div className={styles.trackSwitcher}>
          {TRACKS.map((t, idx) => {
            const isSelected = idx === activeTrackIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTrackIndex(idx)}
                className={`${styles.trackBtn} ${isSelected ? styles.trackBtnSelected : ""}`}
                aria-pressed={isSelected}
              >
                <span className={styles.trackBtnNumber}>{t.number}</span>
                <span className={styles.trackBtnTitle}>
                  {idx === 0 ? "Electronics" : idx === 1 ? "Automation" : "Competition"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layer 2: Active Track Showcase Details */}
      <div className={styles.trackDetailsCard}>
        <div className={styles.trackTop}>
          <div>
            <div className={styles.trackLevel}>{activeTrack.level}</div>
            <h4 className={styles.trackTitle}>{activeTrack.title}</h4>
          </div>

          <div className={styles.trackNumberBadge}>
            Track {activeTrack.number} / 03
          </div>
        </div>

        <p className={styles.trackDesc}>{activeTrack.description}</p>

        {/* Real Projects Switcher */}
        <div className={styles.projectsList}>
          {activeTrack.highlightProjects.map((proj, pIdx) => (
            <div key={pIdx} className={styles.projectItem}>
              <div className={styles.projectLeft}>
                <div className={styles.projectIconBox}>{proj.icon}</div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectName}>{proj.name}</div>
                  <div className={styles.projectSpecs}>{proj.specs}</div>
                </div>
              </div>

              <span className={styles.projectTag}>{proj.tag}</span>
            </div>
          ))}
        </div>

        {/* Hardware Stack Pills */}
        <div className={styles.hardwareGrid}>
          {activeTrack.hardwareStack.map((item, sIdx) => (
            <div key={sIdx} className={styles.hardwareItem}>
              <span className={styles.hardwareLabel}>{item.label}</span>
              <span className={styles.hardwareDetail}>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: Schedule & Lab Location Card (Clean, NO personal names, NO prices) */}
      <div className={styles.footerCard}>
        <div className={styles.footerLeft}>
          <div className={styles.locationIconBox}>
            <MapPin size={17} />
          </div>
          <div>
            <div className={styles.locationTitle}>North Chashara, Narayanganj</div>
            <div className={styles.locationSubtitle}>Hands-On Maker Lab • Every Friday</div>
          </div>
        </div>

        <div className={styles.activeLabBadge}>
          <div className={styles.activeLabDot} />
          <span>Active Lab</span>
        </div>
      </div>
    </div>
  );
}
