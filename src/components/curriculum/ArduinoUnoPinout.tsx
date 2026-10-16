"use client";

import React, { useState } from "react";
import styles from "./arduinoUnoPinout.module.css";
import { ARDUINO_UNO_PINS, BoardPinoutPin } from "@/lib/referenceData";
import { Layers, Table, Search, AlertCircle, Zap } from "lucide-react";

export function ArduinoUnoPinout() {
  const [viewMode, setViewMode] = useState<"visual" | "table">("visual");
  const [selectedPinNumber, setSelectedPinNumber] = useState<string>("13");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [headerFilter, setHeaderFilter] = useState<string>("all");

  const selectedPin: BoardPinoutPin = 
    ARDUINO_UNO_PINS.find(p => p.pinNumber === selectedPinNumber) || ARDUINO_UNO_PINS[18]; // Default to Pin 13

  const filteredPins = ARDUINO_UNO_PINS.filter(pin => {
    if (headerFilter !== "all" && pin.header.toLowerCase() !== headerFilter.toLowerCase()) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      pin.pinNumber.toLowerCase().includes(q) ||
      pin.name.toLowerCase().includes(q) ||
      pin.specialFunctions.some(f => f.toLowerCase().includes(q)) ||
      pin.caveats.toLowerCase().includes(q)
    );
  });

  // Coordinates mapping on SVG viewBox (0 0 680 500)
  // Top Digital Header (Left to Right: SCL, SDA, AREF, GND, D13 down to D8, then D7 down to D0)
  const topPins = [
    { id: "SCL", label: "SCL", x: 260, y: 45, pinNumber: "A5" },
    { id: "SDA", label: "SDA", x: 280, y: 45, pinNumber: "A4" },
    { id: "AREF", label: "AREF", x: 300, y: 45, pinNumber: "AREF" },
    { id: "GND_TOP", label: "GND", x: 320, y: 45, pinNumber: "POW-5" },
    { id: "13", label: "13", x: 340, y: 45, pinNumber: "13" },
    { id: "12", label: "12", x: 360, y: 45, pinNumber: "12" },
    { id: "11", label: "~11", x: 380, y: 45, pinNumber: "11" },
    { id: "10", label: "~10", x: 400, y: 45, pinNumber: "10" },
    { id: "9", label: "~9", x: 420, y: 45, pinNumber: "9" },
    { id: "8", label: "8", x: 440, y: 45, pinNumber: "8" },
    { id: "7", label: "7", x: 475, y: 45, pinNumber: "7" },
    { id: "6", label: "~6", x: 495, y: 45, pinNumber: "6" },
    { id: "5", label: "~5", x: 515, y: 45, pinNumber: "5" },
    { id: "4", label: "4", x: 535, y: 45, pinNumber: "4" },
    { id: "3", label: "~3", x: 555, y: 45, pinNumber: "3" },
    { id: "2", label: "2", x: 575, y: 45, pinNumber: "2" },
    { id: "1", label: "1", x: 595, y: 45, pinNumber: "1" },
    { id: "0", label: "0", x: 615, y: 45, pinNumber: "0" }
  ];

  // Bottom Power & Analog Headers
  const bottomPowerPins = [
    { id: "IOREF", label: "IOREF", x: 320, y: 455, pinNumber: "POW-1" },
    { id: "RESET", label: "RESET", x: 340, y: 455, pinNumber: "POW-2" },
    { id: "3.3V", label: "3.3V", x: 360, y: 455, pinNumber: "POW-3" },
    { id: "5V", label: "5V", x: 380, y: 455, pinNumber: "POW-4" },
    { id: "GND_B1", label: "GND", x: 400, y: 455, pinNumber: "POW-5" },
    { id: "GND_B2", label: "GND", x: 420, y: 455, pinNumber: "POW-6" },
    { id: "VIN", label: "VIN", x: 440, y: 455, pinNumber: "POW-7" }
  ];

  const bottomAnalogPins = [
    { id: "A0", label: "A0", x: 495, y: 455, pinNumber: "A0" },
    { id: "A1", label: "A1", x: 515, y: 455, pinNumber: "A1" },
    { id: "A2", label: "A2", x: 535, y: 455, pinNumber: "A2" },
    { id: "A3", label: "A3", x: 555, y: 455, pinNumber: "A3" },
    { id: "A4", label: "A4", x: 575, y: 455, pinNumber: "A4" },
    { id: "A5", label: "A5", x: 595, y: 455, pinNumber: "A5" }
  ];

  return (
    <div className={styles.pinoutContainer}>
      <div className={styles.headerBar}>
        <div className={styles.titleGroup}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={22} color="#F5B800" />
              Arduino Uno Rev3 Interactive Pinout & Specs
            </h3>
            <span style={{ 
              fontSize: "0.72rem", 
              fontWeight: 700, 
              background: "rgba(107, 15, 36, 0.12)", 
              color: "#6B0F24", 
              border: "1px solid rgba(107, 15, 36, 0.3)", 
              borderRadius: "999px", 
              padding: "0.2rem 0.65rem",
              letterSpacing: "0.02em"
            }}>
              Illustrative Reference Board (Arduino Uno R3)
            </span>
          </div>
          <p className={styles.subtitle}>
            Verified against official Arduino docs and Microchip ATmega328P datasheet. Tap any pin to inspect electrical limits.
          </p>
        </div>

        <div className={styles.viewToggle}>
          <button 
            className={`${styles.toggleBtn} ${viewMode === "visual" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("visual")}
            aria-label="View interactive visual board"
          >
            <Layers size={16} /> Interactive Tour
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === "table" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("table")}
            aria-label="View accessible pin table"
          >
            <Table size={16} /> Accessible Table
          </button>
        </div>
      </div>

      {viewMode === "visual" ? (
        <div className={styles.interactiveArea}>
          {/* Interactive SVG Board */}
          <div className={styles.svgWrapper}>
            <svg
              className={styles.boardSvg}
              viewBox="0 0 680 500"
              width="680"
              height="500"
              role="img"
              aria-label="Interactive Arduino Uno Rev3 Board Diagram"
            >
              <defs>
                <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#008184" />
                  <stop offset="100%" stopColor="#005b5d" />
                </linearGradient>
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b0bec5" />
                  <stop offset="50%" stopColor="#eceff1" />
                  <stop offset="100%" stopColor="#90a4ae" />
                </linearGradient>
              </defs>

              {/* Main PCB Outline */}
              <rect x="30" y="30" width="620" height="440" rx="20" fill="url(#pcbGrad)" stroke="#F5B800" strokeWidth="2.5" />

              {/* Silkscreen text */}
              <text x="360" y="140" fill="#ffffff" fontSize="24" fontWeight="800" letterSpacing="2" opacity="0.9">ARDUINO</text>
              <text x="360" y="175" fill="#F5B800" fontSize="32" fontWeight="900" letterSpacing="3">UNO</text>
              <text x="360" y="200" fill="#cbd5e1" fontSize="12" fontWeight="600">Rev 3 — ATmega328P 16MHz</text>
              <text x="360" y="220" fill="#94a3b8" fontSize="10" fontWeight="500">RoboBEE Lab Verified Standard</text>

              {/* USB-B Port */}
              <rect x="15" y="80" width="90" height="80" rx="6" fill="url(#metalGrad)" stroke="#455a64" strokeWidth="2" />
              <rect x="25" y="105" width="40" height="30" fill="#263238" rx="2" />
              <text x="45" y="175" fill="#eceff1" fontSize="10" fontWeight="600" textAnchor="middle">USB-B</text>

              {/* DC Barrel Jack */}
              <rect x="15" y="320" width="110" height="90" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <circle cx="35" cy="365" r="14" fill="#334155" />
              <circle cx="35" cy="365" r="6" fill="#0f172a" />
              <text x="50" y="425" fill="#eceff1" fontSize="10" fontWeight="600" textAnchor="middle">7-12V DC</text>

              {/* ATmega328P DIP IC Socket */}
              <rect x="340" y="260" width="220" height="60" rx="4" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
              <circle cx="355" cy="290" r="4" fill="#3f3f46" />
              <text x="450" y="295" fill="#a1a1aa" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="1">ATmega328P-PU</text>

              {/* ICSP Header */}
              <rect x="600" y="250" width="30" height="45" rx="3" fill="#27272a" />
              <circle cx="608" cy="260" r="3" fill="#F5B800" />
              <circle cx="622" cy="260" r="3" fill="#F5B800" />
              <circle cx="608" cy="272" r="3" fill="#F5B800" />
              <circle cx="622" cy="272" r="3" fill="#F5B800" />
              <circle cx="608" cy="285" r="3" fill="#F5B800" />
              <circle cx="622" cy="285" r="3" fill="#F5B800" />
              <text x="615" y="310" fill="#94a3b8" fontSize="8" textAnchor="middle">ICSP</text>

              {/* Reset Button */}
              <circle cx="90" cy="55" r="14" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
              <rect x="78" y="43" width="24" height="24" rx="2" fill="#ef4444" opacity="0.3" />
              <text x="90" y="80" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">RESET</text>

              {/* 16MHz Crystal */}
              <ellipse cx="230" cy="270" rx="14" ry="7" fill="url(#metalGrad)" stroke="#475569" />
              <text x="230" y="290" fill="#94a3b8" fontSize="8" textAnchor="middle">16.0 MHz</text>

              {/* SMD LEDs */}
              <rect x="250" y="160" width="8" height="12" fill="#22c55e" rx="1" />
              <text x="254" y="185" fill="#86efac" fontSize="9" textAnchor="middle">ON</text>
              <g 
                onClick={() => setSelectedPinNumber("13")} 
                style={{ cursor: "pointer" }}
                role="button"
                aria-label="Select Built-in LED on Pin 13"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedPinNumber("13"); }}
              >
                <rect 
                  x="248" y="198" width="12" height="16" 
                  fill={selectedPinNumber === "13" ? "#F5B800" : "#eab308"} 
                  stroke={selectedPinNumber === "13" ? "#ffffff" : "#ca8a04"} 
                  strokeWidth="1.5"
                  rx="2" 
                />
                <text x="254" y="228" fill={selectedPinNumber === "13" ? "#F5B800" : "#fde047"} fontSize="9" fontWeight="800" textAnchor="middle">L (13)</text>
              </g>

              {/* Top Digital Header Strip */}
              <rect x="250" y="35" width="375" height="20" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
              {topPins.map(p => {
                const isSelected = selectedPinNumber === p.pinNumber;
                return (
                  <g 
                    key={p.id} 
                    className={`${styles.pinPin} ${isSelected ? styles.pinPinSelected : ""}`}
                    onClick={() => setSelectedPinNumber(p.pinNumber)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${p.label}`}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedPinNumber(p.pinNumber); }}
                  >
                    <circle cx={p.x} cy={p.y} r={isSelected ? "8" : "5.5"} fill={isSelected ? "#F5B800" : "#fbbf24"} stroke="#1e293b" strokeWidth="1.5" />
                    <text x={p.x} y={p.y - 12} fill={isSelected ? "#F5B800" : "#ffffff"} fontSize="9" fontWeight="700" textAnchor="middle">{p.label}</text>
                  </g>
                );
              })}

              {/* Bottom Power Header Strip */}
              <rect x="310" y="445" width="140" height="20" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
              {bottomPowerPins.map(p => {
                const isSelected = selectedPinNumber === p.pinNumber;
                return (
                  <g 
                    key={p.id} 
                    className={`${styles.pinPin} ${isSelected ? styles.pinPinSelected : ""}`}
                    onClick={() => setSelectedPinNumber(p.pinNumber)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${p.label}`}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedPinNumber(p.pinNumber); }}
                  >
                    <circle cx={p.x} cy={p.y} r={isSelected ? "8" : "5.5"} fill={isSelected ? "#F5B800" : "#38bdf8"} stroke="#1e293b" strokeWidth="1.5" />
                    <text x={p.x} y={p.y + 20} fill={isSelected ? "#F5B800" : "#ffffff"} fontSize="8" fontWeight="700" textAnchor="middle">{p.label}</text>
                  </g>
                );
              })}

              {/* Bottom Analog Header Strip */}
              <rect x="485" y="445" width="120" height="20" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
              {bottomAnalogPins.map(p => {
                const isSelected = selectedPinNumber === p.pinNumber;
                return (
                  <g 
                    key={p.id} 
                    className={`${styles.pinPin} ${isSelected ? styles.pinPinSelected : ""}`}
                    onClick={() => setSelectedPinNumber(p.pinNumber)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${p.label}`}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedPinNumber(p.pinNumber); }}
                  >
                    <circle cx={p.x} cy={p.y} r={isSelected ? "8" : "5.5"} fill={isSelected ? "#F5B800" : "#4ade80"} stroke="#1e293b" strokeWidth="1.5" />
                    <text x={p.x} y={p.y + 20} fill={isSelected ? "#F5B800" : "#ffffff"} fontSize="8" fontWeight="700" textAnchor="middle">{p.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inspector Panel */}
          <div className={styles.inspectorCard}>
            <div className={styles.inspectorHeader}>
              <div>
                <span className={styles.pinBadge}>{selectedPin.header} Pin {selectedPin.pinNumber}</span>
                <h4 className={styles.pinName}>{selectedPin.name}</h4>
              </div>
              <div className={styles.pillList}>
                {selectedPin.pwmCapable && <span className={styles.pillPwm}>PWM ~</span>}
                {selectedPin.interruptCapable && <span className={styles.pillInterrupt}>Interrupt</span>}
              </div>
            </div>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Logic Voltage</span>
                <span className={styles.specVal}>{selectedPin.voltage}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Rec. DC Current</span>
                <span className={styles.specVal}>{selectedPin.maxRecommendedCurrent}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Absolute Maximum</span>
                <span className={styles.specVal} style={{ color: "#b91c1c" }}>{selectedPin.absoluteMaxCurrent}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>I/O Mode</span>
                <span className={styles.specVal}>{selectedPin.type.replace("_", " ").toUpperCase()}</span>
              </div>
            </div>

            {selectedPin.specialFunctions.length > 0 && (
              <div>
                <span className={styles.specLabel}>Special Hardware Functions:</span>
                <ul style={{ margin: "0.25rem 0 0 1.25rem", padding: 0, fontSize: "0.85rem", color: "#334155" }}>
                  {selectedPin.specialFunctions.map((fn, idx) => (
                    <li key={idx}>{fn}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.caveatBox}>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.25rem", fontWeight: 700 }}>
                <AlertCircle size={15} color="#b45309" />
                <span>Electrical Caveats & Best Practices:</span>
              </div>
              <p style={{ margin: 0 }}>{selectedPin.caveats}</p>
            </div>

            {selectedPin.pinNumber === "13" && (
              <div style={{
                background: "rgba(245, 184, 0, 0.1)",
                border: "1px solid rgba(245, 184, 0, 0.35)",
                borderRadius: "8px",
                padding: "0.75rem",
                marginTop: "0.75rem",
                fontSize: "0.82rem",
                color: "#78350f",
                lineHeight: "1.5"
              }}>
                <strong style={{ color: "#92400e", display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
                  <Zap size={14} color="#F5B800" /> Board Portability Note:
                </strong>
                <code>LED_BUILTIN</code> is defined by the board profile in the Arduino IDE. On the Arduino Uno R3, it maps to Digital Pin 13. On other microcontrollers (like ESP32, Raspberry Pi Pico RP2040, or Arduino Nano Every), <code>LED_BUILTIN</code> maps to different physical pins (e.g., Pin 2 on many ESP32 dev boards). Never assume Pin 13 across all hardware families!
              </div>
            )}

            <div className={styles.citationFooter}>
              <strong>Verified Official Source:</strong> {selectedPin.officialCitation}
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table View */
        <div>
          <div className={styles.tableControls}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                className={styles.searchBox}
                placeholder="Search pins by number, name, PWM, interrupt, or function..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter pins"
              />
            </div>
            <select
              className={styles.filterSelect}
              value={headerFilter}
              onChange={(e) => setHeaderFilter(e.target.value)}
              aria-label="Filter by header type"
            >
              <option value="all">All Headers (18 records)</option>
              <option value="digital">Digital Header (Pins 0-13, AREF)</option>
              <option value="analog">Analog Header (A0-A5)</option>
              <option value="power">Power Header (5V, 3.3V, VIN, GND)</option>
            </select>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.pinTable}>
              <thead>
                <tr>
                  <th>Pin</th>
                  <th>Name & Header</th>
                  <th>Voltage</th>
                  <th>Recommended / Max Current</th>
                  <th>Features</th>
                  <th>Important Caveats</th>
                </tr>
              </thead>
              <tbody>
                {filteredPins.map((p) => (
                  <tr key={p.pinNumber}>
                    <td>
                      <span className={styles.pinBadgeTable}>{p.pinNumber}</span>
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.header} Header</div>
                    </td>
                    <td>{p.voltage}</td>
                    <td>
                      <div>Rec: <strong>{p.maxRecommendedCurrent}</strong></div>
                      <div style={{ fontSize: "0.75rem", color: "#b91c1c" }}>Abs Max: {p.absoluteMaxCurrent}</div>
                    </td>
                    <td>
                      <div className={styles.pillList}>
                        {p.pwmCapable && <span className={styles.pillPwm}>PWM ~</span>}
                        {p.interruptCapable && <span className={styles.pillInterrupt}>INT</span>}
                      </div>
                      {p.specialFunctions.length > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem" }}>
                          {p.specialFunctions.join(", ")}
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: "280px", fontSize: "0.8rem", color: "#334155" }}>
                      {p.caveats}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
