"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./curriculumSimulator.module.css";
import { InteractiveVisualType } from "@/lib/curriculumData";
import { 
  Eye, Cpu, Zap, Radio, Sliders, Play, RotateCcw, 
  CheckCircle, AlertTriangle, Battery, Shield, Target,
  Wifi, Compass, CheckSquare, RefreshCw, Volume2, ShieldAlert
} from "lucide-react";

interface SimulatorProps {
  type: InteractiveVisualType;
  classNumber: number;
}

export function CurriculumSimulator({ type, classNumber }: SimulatorProps) {
  // -----------------------------------------------------------------
  // 1. CLASS 01: sense_decide_act_sim
  // -----------------------------------------------------------------
  const [c1ObstacleDist, setC1ObstacleDist] = useState<number>(35);
  const c1IsClose = c1ObstacleDist < 20;

  // -----------------------------------------------------------------
  // 2. CLASS 02: led_blink_sim
  // -----------------------------------------------------------------
  const [c2Delay, setC2Delay] = useState<number>(500);
  const [c2LedOn, setC2LedOn] = useState<boolean>(true);
  const [c2Mode, setC2Mode] = useState<'normal' | 'sos' | 'strobe'>('normal');

  useEffect(() => {
    if (type !== 'led_blink_sim') return;
    if (c2Mode === 'sos') {
      const pattern = [150, 150, 150, 150, 800, 1000]; // On/Off ms
      let idx = 0;
      let timer: NodeJS.Timeout;
      const step = () => {
        setC2LedOn(idx % 2 === 0);
        const curDelay = pattern[idx % pattern.length];
        idx++;
        timer = setTimeout(step, curDelay);
      };
      step();
      return () => clearTimeout(timer);
    } else {
      const interval = setInterval(() => {
        setC2LedOn(prev => !prev);
      }, c2Delay);
      return () => clearInterval(interval);
    }
  }, [type, c2Delay, c2Mode]);

  // -----------------------------------------------------------------
  // 3. CLASS 03: sensor_serial_sim
  // -----------------------------------------------------------------
  const [c3BtnPressed, setC3BtnPressed] = useState<boolean>(false);
  const [c3LdrValue, setC3LdrValue] = useState<number>(450);
  const [c3SerialLogs, setC3SerialLogs] = useState<string[]>([
    "[READY] Serial Monitor started @ 9600 baud.",
    "Reading digital pin 2 (INPUT_PULLUP)..."
  ]);

  useEffect(() => {
    if (type !== 'sensor_serial_sim') return;
    const interval = setInterval(() => {
      const digitalVal = c3BtnPressed ? 0 : 1; // Active LOW
      const now = new Date().toLocaleTimeString();
      const line = `[${now}] PIN 2: ${digitalVal} (${c3BtnPressed ? 'PRESSED' : 'RELEASED'}) | A0 (LDR): ${c3LdrValue}`;
      setC3SerialLogs(prev => [...prev.slice(-12), line]);
    }, 800);
    return () => clearInterval(interval);
  }, [type, c3BtnPressed, c3LdrValue]);

  // -----------------------------------------------------------------
  // 4. CLASS 04: logic_counter_sim
  // -----------------------------------------------------------------
  const [c4Count, setC4Count] = useState<number>(0);
  const [c4Target, setC4Target] = useState<number>(3);
  const [c4IsBlinking, setC4IsBlinking] = useState<boolean>(false);

  const stepC4 = () => {
    if (c4Count < c4Target) {
      setC4IsBlinking(true);
      setTimeout(() => {
        setC4IsBlinking(false);
        setC4Count(prev => prev + 1);
      }, 350);
    }
  };

  const resetC4 = () => {
    setC4Count(0);
    setC4IsBlinking(false);
  };

  // -----------------------------------------------------------------
  // 5. CLASS 05: motor_driver_pwm_sim
  // -----------------------------------------------------------------
  const [c5Ain1, setC5Ain1] = useState<boolean>(true);
  const [c5Ain2, setC5Ain2] = useState<boolean>(false);
  const [c5Pwm, setC5Pwm] = useState<number>(150);
  const [c5Stby, setC5Stby] = useState<boolean>(true);

  const getC5Direction = () => {
    if (!c5Stby || c5Pwm === 0) return 'STOPPED';
    if (c5Ain1 && !c5Ain2) return 'FORWARD (CW)';
    if (!c5Ain1 && c5Ain2) return 'REVERSE (CCW)';
    return 'BRAKE (LOW/LOW)';
  };

  // -----------------------------------------------------------------
  // 6. CLASS 06: movement_route_sim
  // -----------------------------------------------------------------
  type RouteBlock = 'forward' | 'turnRight' | 'turnLeft' | 'reverse' | 'stop';
  const [c6Queue, setC6Queue] = useState<RouteBlock[]>(['forward', 'turnRight', 'forward', 'stop']);
  const [c6RobotPos, setC6RobotPos] = useState<{ x: number; y: number; dir: number }>({ x: 2, y: 4, dir: 0 }); // dir: 0=up, 1=right, 2=down, 3=left
  const [c6Executing, setC6Executing] = useState<boolean>(false);

  const executeRoute = async () => {
    if (c6Executing) return;
    setC6Executing(true);
    let cur = { ...c6RobotPos };

    for (const block of c6Queue) {
      if (block === 'turnRight') {
        cur.dir = (cur.dir + 1) % 4;
      } else if (block === 'turnLeft') {
        cur.dir = (cur.dir + 3) % 4;
      } else if (block === 'forward') {
        if (cur.dir === 0 && cur.y > 0) cur.y--;
        else if (cur.dir === 1 && cur.x < 7) cur.x++;
        else if (cur.dir === 2 && cur.y < 5) cur.y++;
        else if (cur.dir === 3 && cur.x > 0) cur.x--;
      } else if (block === 'reverse') {
        if (cur.dir === 0 && cur.y < 5) cur.y++;
        else if (cur.dir === 1 && cur.x > 0) cur.x--;
        else if (cur.dir === 2 && cur.y > 0) cur.y--;
        else if (cur.dir === 3 && cur.x < 7) cur.x++;
      }
      setC6RobotPos({ ...cur });
      await new Promise(r => setTimeout(r, 600));
    }
    setC6Executing(false);
  };

  const resetC6 = () => {
    setC6RobotPos({ x: 2, y: 4, dir: 0 });
  };

  // -----------------------------------------------------------------
  // 7. CLASS 07: ultrasonic_sonar_sim
  // -----------------------------------------------------------------
  const [c7DistanceCm, setC7DistanceCm] = useState<number>(24);
  const c7Microseconds = Math.round((c7DistanceCm * 2.0) / 0.0343);
  const c7Danger = c7DistanceCm < 18;

  // -----------------------------------------------------------------
  // 8. CLASS 08: cad_caliper_sim
  // -----------------------------------------------------------------
  const [c8Width, setC8Width] = useState<number>(50);
  const [c8HoleDia, setC8HoleDia] = useState<number>(16.5);
  const c8Clearance = (c8HoleDia - 16.0).toFixed(1);
  const c8FitStatus = parseFloat(c8Clearance) < 0.2 
    ? 'TOO TIGHT (Cylinders will jam)' 
    : parseFloat(c8Clearance) > 0.8 
    ? 'TOO LOOSE (Sensor will rattle)' 
    : 'PERFECT 3D PRINT FIT (+0.5mm)';

  // -----------------------------------------------------------------
  // 9. CLASS 09: smart_bee_integration_sim
  // -----------------------------------------------------------------
  const [c9Checks, setC9Checks] = useState<boolean[]>([true, true, false, false]);
  const toggleC9 = (idx: number) => {
    setC9Checks(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };
  const allC9Passed = c9Checks.every(Boolean);

  // -----------------------------------------------------------------
  // 10. CLASS 10: test_log_sim
  // -----------------------------------------------------------------
  const [c10Trials, setC10Trials] = useState<number[]>([14.5, 17.0, 15.2]);
  const c10Avg = (c10Trials.reduce((a, b) => a + b, 0) / 3).toFixed(1);
  const c10Success = c10Trials.filter(t => t >= 10 && t <= 20).length;

  const simulateTrials = () => {
    setC10Trials([
      parseFloat((12 + Math.random() * 6).toFixed(1)),
      parseFloat((12 + Math.random() * 6).toFixed(1)),
      parseFloat((12 + Math.random() * 6).toFixed(1))
    ]);
  };

  // -----------------------------------------------------------------
  // 11. CLASS 11: line_follower_sim
  // -----------------------------------------------------------------
  const [c11TrackPos, setC11TrackPos] = useState<'center' | 'driftLeft' | 'driftRight' | 'cross'>('center');
  const c11LeftIr = c11TrackPos === 'driftLeft' || c11TrackPos === 'cross';
  const c11RightIr = c11TrackPos === 'driftRight' || c11TrackPos === 'cross';

  // -----------------------------------------------------------------
  // 12. CLASS 12: servo_arm_sim
  // -----------------------------------------------------------------
  const [c12Angle, setC12Angle] = useState<number>(120);
  const [c12Gripping, setC12Gripping] = useState<boolean>(false);

  const toggleGrip = async () => {
    if (c12Gripping) {
      // release
      for (let a = 45; a <= 120; a += 5) {
        setC12Angle(a);
        await new Promise(r => setTimeout(r, 20));
      }
      setC12Gripping(false);
    } else {
      // grip
      for (let a = 120; a >= 45; a -= 5) {
        setC12Angle(a);
        await new Promise(r => setTimeout(r, 20));
      }
      setC12Gripping(true);
    }
  };

  // -----------------------------------------------------------------
  // 13. CLASS 13: iot_dashboard_sim
  // -----------------------------------------------------------------
  const [c13LastCmd, setC13LastCmd] = useState<string>('S');
  const [c13FailsafeTimer, setC13FailsafeTimer] = useState<number>(1000);
  const [c13SpeedGear, setC13SpeedGear] = useState<number>(2);

  useEffect(() => {
    if (type !== 'iot_dashboard_sim') return;
    const interval = setInterval(() => {
      setC13FailsafeTimer(prev => {
        if (prev <= 100) {
          setC13LastCmd('S');
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [type]);

  const sendWirelessCmd = (cmd: string) => {
    setC13LastCmd(cmd);
    setC13FailsafeTimer(1000); // Reset deadman timer
  };

  // -----------------------------------------------------------------
  // 14. CLASS 14: sumo_arena_sim
  // -----------------------------------------------------------------
  const [c14Priority, setC14Priority] = useState<'edge' | 'attack' | 'search'>('attack');
  const [c14Countdown, setC14Countdown] = useState<number>(0);

  const start5sDelay = () => {
    setC14Countdown(5);
    const interval = setInterval(() => {
      setC14Countdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // -----------------------------------------------------------------
  // RENDER SWITCH
  // -----------------------------------------------------------------
  return (
    <div className={styles.simContainer}>
      <div className={styles.simHeader}>
        <div className={styles.simTitle}>
          <Radio size={20} />
          <span>Interactive Robotics Simulator</span>
        </div>
        <span className={styles.simBadge}>Class {classNumber.toString().padStart(2, '0')} Sim Engine</span>
      </div>

      {/* CLASS 01: SENSE DECIDE ACT */}
      {type === 'sense_decide_act_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '520px', gap: '0.75rem', position: 'relative' }}>
              {/* SENSE */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #38bdf8', flex: 1 }}>
                <Eye size={28} color="#38bdf8" style={{ marginBottom: '0.25rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>1. SENSE</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>HC-SR04 Sonar</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.35rem', color: c1IsClose ? '#ef4444' : '#10b981' }}>
                  {c1ObstacleDist} cm
                </div>
              </div>

              <div style={{ height: '3px', flex: 0.5, background: '#38bdf8', position: 'relative' }}>
                <div style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', position: 'absolute', top: '-2.5px', left: '50%' }} />
              </div>

              {/* DECIDE */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #f59e0b', flex: 1 }}>
                <Cpu size={28} color="#f59e0b" style={{ marginBottom: '0.25rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>2. DECIDE</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Arduino Brain</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.35rem', color: '#f1f5f9' }}>
                  {c1IsClose ? 'cm < 20 (TRUE)' : 'cm >= 20 (FALSE)'}
                </div>
              </div>

              <div style={{ height: '3px', flex: 0.5, background: '#10b981', position: 'relative' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', position: 'absolute', top: '-2.5px', left: '50%' }} />
              </div>

              {/* ACT */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '1rem', borderRadius: '10px', border: '1px solid #10b981', flex: 1 }}>
                <Zap size={28} color="#10b981" style={{ marginBottom: '0.25rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>3. ACT</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Motor Driver</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.35rem', color: c1IsClose ? '#f59e0b' : '#34d399' }}>
                  {c1IsClose ? 'Turn Right' : 'Forward'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Obstacle Distance</span>
                <span>{c1ObstacleDist} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={c1ObstacleDist}
                onChange={(e) => setC1ObstacleDist(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
            <div className={styles.controlCard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setC1ObstacleDist(12)} 
                className={`${styles.simBtn} ${styles.simBtnRed}`}
                style={{ flex: 1 }}
              >
                Place Close Wall (12cm)
              </button>
              <button 
                onClick={() => setC1ObstacleDist(45)} 
                className={`${styles.simBtn} ${styles.simBtnGreen}`}
                style={{ flex: 1 }}
              >
                Clear Room (45cm)
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${c1IsClose ? styles.statusWarning : styles.statusSuccess}`}>
            <ShieldAlert size={18} />
            <span>
              {c1IsClose 
                ? 'ALERT: Obstacle within 20 cm! Arduino evaluates IF condition as TRUE -> Triggering turnWheelsRight() to avoid crash!'
                : 'CLEAR: Path ahead is open (> 20 cm). Arduino evaluates ELSE condition -> Calling driveWheelsForward()!'}
            </span>
          </div>
        </>
      )}

      {/* CLASS 02: LED BLINK SIM */}
      {type === 'led_blink_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: c2LedOn ? '#f59e0b' : '#1e293b',
                  boxShadow: c2LedOn ? '0 0 40px #f59e0b, 0 0 80px rgba(245, 158, 11, 0.4)' : 'none',
                  border: '3px solid #334155',
                  transition: 'background 0.05s, box-shadow 0.05s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  color: c2LedOn ? '#0b0f19' : '#64748b'
                }}
              >
                {c2LedOn ? 'HIGH 5V' : 'LOW 0V'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Arduino Pin 13 ──[ 220Ω Resistor ]──[ LED ]── Ground (GND)
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>delay(ms) Speed</span>
                <span>{c2Delay} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={c2Delay}
                disabled={c2Mode === 'sos'}
                onChange={(e) => setC2Delay(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Pattern Presets</span>
              </div>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => { setC2Mode('normal'); setC2Delay(500); }}
                  className={`${styles.simBtn} ${c2Mode === 'normal' && c2Delay === 500 ? styles.simBtnCyan : ''}`}
                >
                  Standard (500ms)
                </button>
                <button
                  onClick={() => { setC2Mode('strobe'); setC2Delay(100); }}
                  className={`${styles.simBtn} ${c2Mode === 'strobe' ? styles.simBtnRed : ''}`}
                >
                  Strobe (100ms)
                </button>
                <button
                  onClick={() => setC2Mode('sos')}
                  className={`${styles.simBtn} ${c2Mode === 'sos' ? styles.simBtnGreen : ''}`}
                >
                  SOS Morse Signal
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Volume2 size={18} />
            <span>
              {c2Mode === 'sos' 
                ? 'Morse Signal Active: Two Short Pulses (150ms) + One Long Pulse (800ms) repeating!' 
                : `Loop repeats every ${c2Delay * 2}ms (${(1000 / (c2Delay * 2)).toFixed(1)} Hz blink frequency).`}
            </span>
          </div>
        </>
      )}

      {/* CLASS 03: SENSOR SERIAL SIM */}
      {type === 'sensor_serial_sim' && (
        <>
          <div className={styles.canvasBox} style={{ alignItems: 'stretch' }}>
            <div className={styles.serialMonitor}>
              {c3SerialLogs.map((log, i) => (
                <div key={i} className={styles.serialLine}>{log}</div>
              ))}
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Virtual Push Button (INPUT_PULLUP)</span>
                <span>{c3BtnPressed ? 'PRESSED (0 / LOW)' : 'RELEASED (1 / HIGH)'}</span>
              </div>
              <button
                onMouseDown={() => setC3BtnPressed(true)}
                onMouseUp={() => setC3BtnPressed(false)}
                onTouchStart={() => setC3BtnPressed(true)}
                onTouchEnd={() => setC3BtnPressed(false)}
                className={`${styles.simBtn} ${c3BtnPressed ? styles.simBtnGreen : styles.simBtnCyan}`}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}
              >
                {c3BtnPressed ? '👇 Button Held Down (Pin pulled to GND)' : '👆 Press & Hold Button (Pin 2)'}
              </button>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>LDR Light Sensor (Analog A0)</span>
                <span>{c3LdrValue} / 1023</span>
              </div>
              <input
                type="range"
                min="0"
                max="1023"
                value={c3LdrValue}
                onChange={(e) => setC3LdrValue(Number(e.target.value))}
                className={styles.slider}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                <span>Dark Room (0)</span>
                <span>Torch Light (1023)</span>
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Sliders size={18} />
            <span>Active-LOW Notice: With INPUT_PULLUP, pressing the button connects pin 2 to Ground, reading 0 (LOW)!</span>
          </div>
        </>
      )}

      {/* CLASS 04: LOGIC COUNTER SIM */}
      {type === 'logic_counter_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>MEMORY VARIABLE</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#f59e0b',
                  background: '#1e293b',
                  padding: '0.5rem 1.75rem',
                  borderRadius: '10px',
                  border: '2px solid #f59e0b'
                }}>
                  {c4Count}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>int count;</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <div style={{ color: c4Count < c4Target ? '#34d399' : '#f87171', fontWeight: 700 }}>
                  Condition: ({c4Count} &lt; {c4Target}) ➔ {c4Count < c4Target ? 'TRUE' : 'FALSE'}
                </div>
                <div style={{ color: c4IsBlinking ? '#f59e0b' : '#64748b' }}>
                  {c4IsBlinking ? '⚡ LED Flashing in loop()...' : '⚪ LED Idle'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {c4Count >= c4Target ? 'Reached target! loop() stops blinking.' : `Will blink ${c4Target - c4Count} more times.`}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Target Blink Limit</span>
                <span>{c4Target}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={c4Target}
                onChange={(e) => { setC4Target(Number(e.target.value)); setC4Count(0); }}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={stepC4}
                disabled={c4Count >= c4Target}
                className={`${styles.simBtn} ${styles.simBtnGreen}`}
                style={{ flex: 1, padding: '0.75rem' }}
              >
                <Play size={16} />
                <span>Next Loop Step</span>
              </button>
              <button
                onClick={resetC4}
                className={`${styles.simBtn} ${styles.simBtnCyan}`}
                style={{ padding: '0.75rem' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${c4Count < c4Target ? styles.statusNormal : styles.statusSuccess}`}>
            <CheckCircle size={18} />
            <span>
              {c4Count < c4Target 
                ? `Trace step: count is currently ${c4Count}. Condition is TRUE, so loop executes the block.` 
                : `Execution finished! count = ${c4Target}. Condition count < ${c4Target} is FALSE.`}
            </span>
          </div>
        </>
      )}

      {/* CLASS 05: MOTOR DRIVER PWM SIM */}
      {type === 'motor_driver_pwm_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
              {/* Spinning Wheel */}
              <div
                className={styles.wheelSpinner}
                style={{
                  transform: `rotate(${c5Ain1 && !c5Ain2 && c5Pwm > 0 ? 45 : !c5Ain1 && c5Ain2 && c5Pwm > 0 ? -45 : 0}deg)`,
                  borderColor: c5Pwm > 0 && c5Stby ? '#10b981' : '#64748b'
                }}
              >
                <span>{c5Pwm > 0 && c5Stby ? `${Math.round((c5Pwm / 255) * 220)} RPM` : 'STOP'}</span>
              </div>

              {/* Status readout */}
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  H-Bridge Output
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
                  {getC5Direction()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                  PWMA: {c5Pwm} / 255 ({(c5Pwm / 255 * 100).toFixed(0)}% Power)
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>PWMA Speed Duty Cycle</span>
                <span>{c5Pwm}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={c5Pwm}
                onChange={(e) => setC5Pwm(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Direction Pins (AIN1 & AIN2)</span>
              </div>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => { setC5Ain1(true); setC5Ain2(false); }}
                  className={`${styles.simBtn} ${c5Ain1 && !c5Ain2 ? styles.simBtnGreen : ''}`}
                >
                  Forward (1, 0)
                </button>
                <button
                  onClick={() => { setC5Ain1(false); setC5Ain2(true); }}
                  className={`${styles.simBtn} ${!c5Ain1 && c5Ain2 ? styles.simBtnCyan : ''}`}
                >
                  Reverse (0, 1)
                </button>
                <button
                  onClick={() => { setC5Ain1(false); setC5Ain2(false); }}
                  className={`${styles.simBtn} ${!c5Ain1 && !c5Ain2 ? styles.simBtnRed : ''}`}
                >
                  Brake (0, 0)
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Battery size={18} />
            <span>Safety Rule: Motor power comes from the separate battery pack. Shared GND is connected to Arduino!</span>
          </div>
        </>
      )}

      {/* CLASS 06: MOVEMENT ROUTE SIM */}
      {type === 'movement_route_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div className={styles.gridFloor}>
              {Array.from({ length: 6 }).map((_, r) =>
                Array.from({ length: 8 }).map((_, c) => {
                  const isRobot = c6RobotPos.x === c && c6RobotPos.y === r;
                  const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
                  return (
                    <div key={`${r}-${c}`} className={styles.gridCell}>
                      {isRobot ? (
                        <span style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }}>
                          {arrows[c6RobotPos.dir]}
                        </span>
                      ) : (r === 1 && c === 4) ? (
                        <span>🚩</span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Queue Functions ({c6Queue.length})</span>
                <button onClick={() => setC6Queue([])} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}>Clear</button>
              </div>
              <div className={styles.btnGroup} style={{ marginBottom: '0.5rem' }}>
                <button onClick={() => setC6Queue(q => [...q, 'forward'])} className={styles.simBtn}>+ forward()</button>
                <button onClick={() => setC6Queue(q => [...q, 'turnRight'])} className={styles.simBtn}>+ turnRight()</button>
                <button onClick={() => setC6Queue(q => [...q, 'turnLeft'])} className={styles.simBtn}>+ turnLeft()</button>
                <button onClick={() => setC6Queue(q => [...q, 'reverse'])} className={styles.simBtn}>+ reverse()</button>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Queue: {c6Queue.join(' ➔ ') || 'Empty'}
              </div>
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={executeRoute}
                disabled={c6Executing || c6Queue.length === 0}
                className={`${styles.simBtn} ${styles.simBtnGreen}`}
                style={{ flex: 1, padding: '0.8rem' }}
              >
                <Play size={16} />
                <span>{c6Executing ? 'Executing...' : 'Run Floor Route'}</span>
              </button>
              <button onClick={resetC6} className={styles.simBtn} style={{ padding: '0.8rem' }}>
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Compass size={18} />
            <span>Differential Steering: Named movement functions make route navigation readable and modular!</span>
          </div>
        </>
      )}

      {/* CLASS 07: ULTRASONIC SONAR SIM */}
      {type === 'ultrasonic_sonar_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '480px', position: 'relative' }}>
              {/* Sonar Sensor */}
              <div style={{ background: '#1e293b', border: '2px solid #06b6d4', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#38bdf8' }} />
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#38bdf8' }} />
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>HC-SR04</div>
              </div>

              {/* Sound Wave */}
              <div style={{ flex: 1, margin: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div className={styles.pulseLine}>
                  <div className={styles.pulseDot} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
                  {c7Microseconds} µs echo travel
                </div>
              </div>

              {/* Obstacle */}
              <div style={{
                background: c7Danger ? '#ef4444' : '#475569',
                width: '32px',
                height: '75px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: c7Danger ? '0 0 20px #ef4444' : 'none',
                transition: 'all 0.2s'
              }}>
                WALL
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Distance to Obstacle</span>
                <span>{c7DistanceCm} cm</span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                value={c7DistanceCm}
                onChange={(e) => setC7DistanceCm(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Calculation Math:</div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#38bdf8', marginTop: '0.25rem' }}>
                cm = ({c7Microseconds} * 0.0343) / 2.0 = {c7DistanceCm} cm
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${c7Danger ? styles.statusDanger : styles.statusSuccess}`}>
            <ShieldAlert size={18} />
            <span>
              {c7Danger 
                ? 'THRESHOLD BREACH: cm < 18 cm! Triggering stopAndTurn() avoidance subroutine!' 
                : 'PATH SAFE: cm >= 18 cm. Robot continues driveForward().'}
            </span>
          </div>
        </>
      )}

      {/* CLASS 08: CAD CALIPER SIM */}
      {type === 'cad_caliper_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{
              width: `${c8Width * 4.5}px`,
              height: '95px',
              border: '2px solid #06b6d4',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '26px',
              position: 'relative'
            }}>
              {/* Left Eye Cutout */}
              <div style={{
                width: `${c8HoleDia * 2.2}px`,
                height: `${c8HoleDia * 2.2}px`,
                borderRadius: '50%',
                border: '2px dashed #f59e0b',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                color: '#f59e0b'
              }}>
                {c8HoleDia}mm
              </div>
              {/* Right Eye Cutout */}
              <div style={{
                width: `${c8HoleDia * 2.2}px`,
                height: `${c8HoleDia * 2.2}px`,
                borderRadius: '50%',
                border: '2px dashed #f59e0b',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                color: '#f59e0b'
              }}>
                {c8HoleDia}mm
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Bracket Width (Baseplate)</span>
                <span>{c8Width} mm</span>
              </div>
              <input
                type="range"
                min="42"
                max="65"
                value={c8Width}
                onChange={(e) => setC8Width(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Hole Diameter (+Clearance)</span>
                <span>{c8HoleDia} mm (+{c8Clearance}mm)</span>
              </div>
              <input
                type="range"
                min="16.0"
                max="17.5"
                step="0.1"
                value={c8HoleDia}
                onChange={(e) => setC8HoleDia(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <CheckSquare size={18} />
            <span>Fit Analysis: {c8FitStatus}</span>
          </div>
        </>
      )}

      {/* CLASS 09: SMART BEE INTEGRATION SIM */}
      {type === 'smart_bee_integration_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', maxWidth: '480px' }}>
              {[
                { title: '1. Chassis & Wheels', sub: 'Motors spin freely without wire rubs' },
                { title: '2. Power & Shared GND', sub: 'Battery polarities & common ground verified' },
                { title: '3. Sensor Serial Stream', sub: 'HC-SR04 pings validated in Serial Monitor' },
                { title: '4. Autonomous Avoidance', sub: 'Braking and turning subroutine validated' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleC9(idx)}
                  style={{
                    background: c9Checks[idx] ? 'rgba(16, 185, 129, 0.15)' : '#1e293b',
                    border: `1px solid ${c9Checks[idx] ? '#10b981' : '#334155'}`,
                    borderRadius: '8px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem', color: c9Checks[idx] ? '#34d399' : '#f1f5f9' }}>
                    <CheckCircle size={16} color={c9Checks[idx] ? '#10b981' : '#64748b'} />
                    <span>{item.title}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.statusBanner} ${allC9Passed ? styles.statusSuccess : styles.statusWarning}`}>
            <Shield size={18} />
            <span>
              {allC9Passed
                ? 'ALL PRE-FLIGHT SUB-SYSTEMS VERIFIED — CLEARED FOR AUTONOMOUS FLOOR DEPLOYMENT!'
                : `Pre-flight in progress: ${c9Checks.filter(Boolean).length}/4 subsystems verified. Complete checklist before launch!`}
            </span>
          </div>
        </>
      )}

      {/* CLASS 10: TEST LOG SIM */}
      {type === 'test_log_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                {c10Trials.map((val, idx) => (
                  <div key={idx} style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Trial {idx + 1}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: val >= 10 && val <= 20 ? '#10b981' : '#ef4444', margin: '0.25rem 0' }}>
                      {val} cm
                    </div>
                    <div style={{ fontSize: '0.7rem', color: val >= 10 && val <= 20 ? '#34d399' : '#f87171' }}>
                      {val >= 10 && val <= 20 ? 'Target Hit' : 'Drift Out'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Average Stop Distance</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{c10Avg} cm</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reliability Score</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{c10Success} / 3 Runs</div>
              </div>
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={simulateTrials} className={`${styles.simBtn} ${styles.simBtnCyan}`} style={{ width: '100%', padding: '0.8rem' }}>
                <RefreshCw size={16} />
                <span>Simulate 3 New Engineering Trials</span>
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Target size={18} />
            <span>Engineering Recommendation: Add an activeBrake() reverse pulse to eliminate 4.5cm coasting drift!</span>
          </div>
        </>
      )}

      {/* CLASS 11: LINE FOLLOWER SIM */}
      {type === 'line_follower_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
              <div style={{
                width: '100%',
                maxWidth: '420px',
                height: '70px',
                background: '#ffffff',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Black Line */}
                <div style={{ width: '40px', height: '100%', background: '#09090b', position: 'absolute' }} />

                {/* Robot Sensor Bar */}
                <div style={{
                  display: 'flex',
                  gap: '60px',
                  zIndex: 2,
                  transform: `translateX(${c11TrackPos === 'driftLeft' ? '-45px' : c11TrackPos === 'driftRight' ? '45px' : '0px'})`,
                  transition: 'transform 0.25s ease'
                }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: c11LeftIr ? '#ef4444' : '#10b981', border: '2px solid #000' }} />
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: c11RightIr ? '#ef4444' : '#10b981', border: '2px solid #000' }} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Track Position Preset</span>
              </div>
              <div className={styles.btnGroup}>
                <button onClick={() => setC11TrackPos('center')} className={`${styles.simBtn} ${c11TrackPos === 'center' ? styles.simBtnGreen : ''}`}>Centered (Both White)</button>
                <button onClick={() => setC11TrackPos('driftLeft')} className={`${styles.simBtn} ${c11TrackPos === 'driftLeft' ? styles.simBtnCyan : ''}`}>Drifting Left</button>
                <button onClick={() => setC11TrackPos('driftRight')} className={`${styles.simBtn} ${c11TrackPos === 'driftRight' ? styles.simBtnCyan : ''}`}>Drifting Right</button>
                <button onClick={() => setC11TrackPos('cross')} className={`${styles.simBtn} ${c11TrackPos === 'cross' ? styles.simBtnRed : ''}`}>Finish Line (Both Black)</button>
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Steering Response</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>
                {c11TrackPos === 'center' && 'FORWARD: Left 140 / Right 140 PWM'}
                {c11TrackPos === 'driftLeft' && 'PIVOT LEFT: Left -160 / Right 160 PWM'}
                {c11TrackPos === 'driftRight' && 'PIVOT RIGHT: Left 160 / Right -160 PWM'}
                {c11TrackPos === 'cross' && 'FINISH LINE DETECTED: Motor Halt (0 PWM)'}
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Compass size={18} />
            <span>Optics Physics: Matte black absorbs infrared light (HIGH signal), while white floor reflects it (LOW signal).</span>
          </div>
        </>
      )}

      {/* CLASS 12: SERVO ARM SIM */}
      {type === 'servo_arm_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Gripper Claw Graphic */}
              <div style={{ position: 'relative', width: '120px', height: '100px' }}>
                {/* Left Jaw */}
                <div style={{
                  position: 'absolute',
                  width: '60px',
                  height: '8px',
                  background: '#f59e0b',
                  borderRadius: '4px',
                  top: '30px',
                  left: '10px',
                  transformOrigin: 'right center',
                  transform: `rotate(${c12Angle - 90}deg)`,
                  transition: 'transform 0.05s linear'
                }} />
                {/* Right Jaw */}
                <div style={{
                  position: 'absolute',
                  width: '60px',
                  height: '8px',
                  background: '#f59e0b',
                  borderRadius: '4px',
                  bottom: '30px',
                  left: '10px',
                  transformOrigin: 'right center',
                  transform: `rotate(-${c12Angle - 90}deg)`,
                  transition: 'transform 0.05s linear'
                }} />
                {/* Foam Target Block */}
                <div style={{
                  position: 'absolute',
                  left: '0px',
                  top: '35px',
                  width: '28px',
                  height: '28px',
                  background: c12Angle < 55 ? '#10b981' : '#64748b',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#fff'
                }}>
                  {c12Angle < 55 ? 'HELD' : 'BLOCK'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Servo Target Angle</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>{c12Angle}°</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {c12Angle >= 100 ? 'Jaw OPEN' : c12Angle <= 55 ? 'Jaw GRIPPING' : 'Intermediate Angle'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Manual Angle Sweep (0°–180°)</span>
                <span>{c12Angle}°</span>
              </div>
              <input
                type="range"
                min="35"
                max="140"
                value={c12Angle}
                onChange={(e) => setC12Angle(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={toggleGrip} className={`${styles.simBtn} ${c12Gripping ? styles.simBtnCyan : styles.simBtnGreen}`} style={{ width: '100%', padding: '0.8rem' }}>
                <Zap size={16} />
                <span>{c12Gripping ? 'Smooth Release Jaw (120°)' : 'Smooth Grip Foam Block (45°)'}</span>
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <CheckCircle size={18} />
            <span>Closed-Loop Servos: An internal potentiometer provides feedback to lock exact angles without drifting!</span>
          </div>
        </>
      )}

      {/* CLASS 13: IOT DASHBOARD SIM */}
      {type === 'iot_dashboard_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '480px' }}>
              {/* Telemetry Block */}
              <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>WIRELESS TELEMETRY</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: '#38bdf8' }}>Distance: 28 cm</div>
                <div style={{ fontSize: '0.8rem', color: '#34d399' }}>Battery: 7.4V (LiPo)</div>
                <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Wi-Fi RSSI: -58 dBm</div>
              </div>

              {/* D-Pad Controller */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <button onClick={() => sendWirelessCmd('F')} className={styles.simBtn}>▲ F</button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => sendWirelessCmd('L')} className={styles.simBtn}>◀ L</button>
                  <button onClick={() => sendWirelessCmd('S')} className={`${styles.simBtn} ${styles.simBtnRed}`}>■ S</button>
                  <button onClick={() => sendWirelessCmd('R')} className={styles.simBtn}>▶ R</button>
                </div>
                <button onClick={() => sendWirelessCmd('B')} className={styles.simBtn}>▼ B</button>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Deadman Failsafe Clock</span>
                <span>{c13FailsafeTimer} ms</span>
              </div>
              <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ height: '100%', width: `${(c13FailsafeTimer / 1000) * 100}%`, background: c13FailsafeTimer > 300 ? '#10b981' : '#ef4444', transition: 'width 0.1s linear' }} />
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Active Packet</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: c13LastCmd === 'S' ? '#ef4444' : '#10b981' }}>
                Packet: &apos;{c13LastCmd}&apos; {c13FailsafeTimer === 0 ? '(AUTO-STOPPED BY FAILSAFE)' : '(EXECUTING)'}
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${c13FailsafeTimer === 0 ? styles.statusDanger : styles.statusNormal}`}>
            <AlertTriangle size={18} />
            <span>Failsafe Protection: If wireless connection drops for &gt; 1000ms, robot wheels automatically cut power!</span>
          </div>
        </>
      )}

      {/* CLASS 14: SUMO ARENA SIM */}
      {type === 'sumo_arena_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div className={styles.dohyoRing}>
              {/* Opponent Bot */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '40px',
                width: '32px',
                height: '32px',
                background: '#ef4444',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                OPP
              </div>

              {/* Smart Bee Sumo */}
              <div style={{
                position: 'absolute',
                bottom: c14Priority === 'edge' ? '8px' : '40px',
                left: c14Priority === 'edge' ? '8px' : '40px',
                width: '36px',
                height: '36px',
                background: '#f59e0b',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#0b0f19',
                boxShadow: '0 0 15px #f59e0b'
              }}>
                BEE
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Priority State Machine</span>
              </div>
              <div className={styles.btnGroup}>
                <button onClick={() => setC14Priority('edge')} className={`${styles.simBtn} ${c14Priority === 'edge' ? styles.simBtnRed : ''}`}>P1: Edge Survival</button>
                <button onClick={() => setC14Priority('attack')} className={`${styles.simBtn} ${c14Priority === 'attack' ? styles.simBtnGreen : ''}`}>P2: Radar Lock Attack</button>
                <button onClick={() => setC14Priority('search')} className={`${styles.simBtn} ${c14Priority === 'search' ? styles.simBtnCyan : ''}`}>P3: Tactical Search</button>
              </div>
            </div>

            <div className={styles.controlCard} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={start5sDelay}
                disabled={c14Countdown > 0}
                className={`${styles.simBtn} ${styles.simBtnCyan}`}
                style={{ width: '100%', padding: '0.8rem' }}
              >
                <Play size={16} />
                <span>{c14Countdown > 0 ? `Competition Delay: ${c14Countdown}s` : 'Trigger 5-Second Start Delay'}</span>
              </button>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <ShieldAlert size={18} />
            <span>
              {c14Priority === 'edge' && 'PRIORITY 1: Floor IR senses white ring boundary (tawara)! Reverse & spin to safety overrides attack!'}
              {c14Priority === 'attack' && 'PRIORITY 2: Opponent detected in 40cm front sonar! Full power forward charge (255 PWM)!'}
              {c14Priority === 'search' && 'PRIORITY 3: No edge and no opponent in range. Rotating in place to radar-scan the arena.'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
