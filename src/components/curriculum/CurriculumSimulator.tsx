"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./curriculumSimulator.module.css";
import { InteractiveVisualType } from "@/lib/curriculumData";
import { 
  Eye, Cpu, Zap, Radio, Sliders, Play, RotateCcw, 
  CheckCircle, AlertTriangle, Battery, Shield, Target,
  Wifi, Compass, CheckSquare, RefreshCw, Volume2, ShieldAlert,
  Info, Activity
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
  // 15. FLAGSHIP: arduino_board_tour_sim (Beginner Class 01)
  // -----------------------------------------------------------------
  type PinCategory = 'all' | 'digital' | 'analog' | 'power' | 'mcu';
  const [boardFilter, setBoardFilter] = useState<PinCategory>('all');
  const [selectedPin, setSelectedPin] = useState<string>('d13');
  const [boardBlinkDelay, setBoardBlinkDelay] = useState<number>(500);
  const [boardLedOn, setBoardLedOn] = useState<boolean>(true);
  const [showPinoutTable, setShowPinoutTable] = useState<boolean>(false);

  useEffect(() => {
    if (type !== 'arduino_board_tour_sim') return;
    const interval = setInterval(() => {
      setBoardLedOn(prev => !prev);
    }, boardBlinkDelay);
    return () => clearInterval(interval);
  }, [type, boardBlinkDelay]);

  const BOARD_PINS: Record<string, { name: string; type: string; category: PinCategory; desc: string; voltage: string; code: string; caution: string }> = {
    d13: {
      name: "Digital Pin 13 (Built-in LED)",
      type: "Digital Output / SPI SCK",
      category: "digital",
      desc: "Connected directly to the onboard amber SMD LED labeled 'L'. When your sketch executes digitalWrite(LED_BUILTIN, HIGH), this pin delivers 5V and illuminates the LED without any external wires!",
      voltage: "5.0V Logic (Max 20mA recommended)",
      code: "pinMode(LED_BUILTIN, OUTPUT);\ndigitalWrite(LED_BUILTIN, HIGH);\ndelay(500);",
      caution: "Safe for the onboard LED. If adding external LEDs, ALWAYS wire a 220Ω current-limiting resistor."
    },
    d11: {
      name: "Digital Pin 11 (~PWM / MOSI)",
      type: "PWM Output & SPI Bus",
      category: "digital",
      desc: "A PWM (Pulse Width Modulation) pin marked with a tilde (~). Delivers 8-bit analogWrite() signals to smoothly fade LEDs or control motor speed through a motor driver.",
      voltage: "5.0V Logic (~490 Hz PWM frequency)",
      code: "pinMode(11, OUTPUT);\nanalogWrite(11, 180); // ~70% duty cycle",
      caution: "Maximum continuous current draw should not exceed 20mA."
    },
    d9: {
      name: "Digital Pin 9 (~PWM)",
      type: "PWM Motor Speed Control",
      category: "digital",
      desc: "Our primary motor driver speed pin (PWMA). Sends duty-cycle pulses to the driver's H-bridge logic to regulate wheel RPM.",
      voltage: "5.0V Logic (~490 Hz PWM)",
      code: "analogWrite(9, 200); // 78% Motor Drive Power",
      caution: "Never connect directly to DC motor terminals! Use TB6612FNG or L298N driver."
    },
    d3: {
      name: "Digital Pin 3 (~PWM / INT 1)",
      type: "External Hardware Interrupt",
      category: "digital",
      desc: "Capable of triggering immediate hardware interrupts when a sensor transitions from HIGH to LOW. Essential for collision bumpers and wheel encoders.",
      voltage: "5.0V Logic",
      code: "attachInterrupt(digitalPinToInterrupt(3), onBumperHit, FALLING);",
      caution: "Keep interrupt service routines (ISR) short and non-blocking (never use delay() inside an ISR)."
    },
    d2: {
      name: "Digital Pin 2 (External Interrupt 0)",
      type: "Digital Input / External Interrupt",
      category: "digital",
      desc: "Often paired with INPUT_PULLUP for pushbuttons or optical slot wheel encoders. Reads digital 1 (HIGH) or 0 (LOW).",
      voltage: "5.0V Logic (Internal 20kΩ pullup available)",
      code: "pinMode(2, INPUT_PULLUP);\nint state = digitalRead(2);",
      caution: "With INPUT_PULLUP, pressing the button connects pin 2 to GND, reading LOW (0)."
    },
    a0: {
      name: "Analog In Pin A0",
      type: "10-bit Analog to Digital Converter",
      category: "analog",
      desc: "Reads continuous analog voltage from 0.0V to 5.0V and maps it to an integer from 0 to 1023 (approximately 4.88 mV per count). Used with potentiometers and light sensors.",
      voltage: "0V to 5.0V Analog Input",
      code: "int lightVal = analogRead(A0);\nfloat voltage = lightVal * (5.0 / 1023.0);",
      caution: "Applying voltage > 5.0V will damage the microcontroller's analog multiplexer."
    },
    a4: {
      name: "Analog In Pin A4 (I2C SDA)",
      type: "Analog In & I2C Data Bus",
      category: "analog",
      desc: "Doubles as the I2C Serial Data line (SDA) for modern digital sensors such as OLED screens and MPU6050 gyroscopes.",
      voltage: "5.0V I2C Bus",
      code: "#include <Wire.h>\nWire.begin();",
      caution: "Requires pull-up resistors to 5V or 3.3V (most breakout modules have these onboard)."
    },
    v5: {
      name: "5V Power Header",
      type: "Regulated 5.0V DC Rail",
      category: "power",
      desc: "Delivers clean regulated 5V power to sensors, ICs, and microchips from the onboard voltage regulator or USB port.",
      voltage: "5.0V DC (Up to 400mA on USB, 800mA on DC Jack)",
      code: "// Hardware power supply rail (No code)",
      caution: "CRITICAL: NEVER power DC motors or servo motor power pins from this pin! Motors draw inductive spikes that will brown out or reboot the Arduino."
    },
    v33: {
      name: "3.3V Power Header",
      type: "Regulated 3.3V DC Rail",
      category: "power",
      desc: "Provides low-noise 3.3V power for 3.3V modules like ESP8266/ESP32, wireless transceivers, and IMU sensors.",
      voltage: "3.3V DC (Max 50mA)",
      code: "// 3.3V breakout power rail",
      caution: "Do not short to 5V or Ground."
    },
    gnd: {
      name: "GND (Ground / 0V Reference)",
      type: "System Ground Reference",
      category: "power",
      desc: "The universal 0V electrical return path. Every complete circuit must return to GND. In multi-supply circuits, the Arduino GND must connect to the motor battery GND (Common Ground).",
      voltage: "0.0V Reference",
      code: "// Shared reference for all sensors and drivers",
      caution: "Without common ground, control signals float and motor drivers misbehave."
    },
    vin: {
      name: "Vin (Voltage In)",
      type: "Unregulated Power Input",
      category: "power",
      desc: "Direct access to the external DC barrel jack power. Can accept 7V to 12V from an external battery pack to power the board through the onboard regulator.",
      voltage: "7.0V to 12.0V DC Input",
      code: "// External battery power input",
      caution: "Never feed 5V into Vin (the onboard regulator will drop it to ~3.8V, causing brownouts)."
    },
    mcu: {
      name: "ATmega328P Microcontroller",
      type: "8-bit AVR RISC Brain",
      category: "mcu",
      desc: "The heart of the Arduino Uno. Contains 32 KB Flash memory for your code, 2 KB SRAM for variables, and runs at 16 MHz (16 million instructions per second).",
      voltage: "5.0V Internal Core, 16 MHz Clock",
      code: "void setup() { ... }\nvoid loop() { ... }",
      caution: "Operates deterministically. Runs exactly what is written in your sketch."
    },
    reset: {
      name: "Reset Pushbutton",
      type: "Tactile Hardware Reset",
      category: "mcu",
      desc: "Forces the ATmega328P to restart its instruction pointer. Immediately re-runs setup() and loops your program from the beginning.",
      voltage: "Active-Low Reset Signal",
      code: "// Restarts sketch execution immediately",
      caution: "Does NOT erase uploaded code. Re-executes the sketch already in Flash memory."
    },
    usb: {
      name: "USB Type-B Port",
      type: "Communication & Power Jack",
      category: "mcu",
      desc: "Provides 5V bus power and bidirectional serial UART communication with the computer via the onboard USB-to-Serial converter.",
      voltage: "5.0V USB Bus Voltage",
      code: "Serial.begin(9600); // Initialize telemetry",
      caution: "Use a verified data cable. Cables sold only for phone charging cannot upload sketches."
    }
  };

  // -----------------------------------------------------------------
  // 16. ROBOT DETECTIVE SIM (Free Explorer Class 01)
  // -----------------------------------------------------------------
  interface DetectiveItem {
    id: string;
    name: string;
    icon: string;
    correctType: 'robot' | 'automated' | 'tool';
    explanation: string;
  }
  const DETECTIVE_ITEMS: DetectiveItem[] = [
    { id: '1', name: 'Delivery Rover', icon: '🤖', correctType: 'robot', explanation: 'TRUE ROBOT: Uses sonar/lidar to sense pedestrians, an onboard computer to plan a route, and motors to steer.' },
    { id: '2', name: 'Washing Machine', icon: '🌀', correctType: 'automated', explanation: 'AUTOMATED DEVICE: Follows a fixed pre-programmed timer sequence. It cannot sense whether clothes are clean or adjust its path.' },
    { id: '3', name: 'Surgeon Robotic Arm', icon: '🦾', correctType: 'robot', explanation: 'TRUE ROBOT: Uses high-precision encoders and closed-loop kinematic controllers to eliminate tremors and follow surgical coordinates.' },
    { id: '4', name: 'Traffic Light Timer', icon: '🚦', correctType: 'automated', explanation: 'AUTOMATED DEVICE: Cycles red-yellow-green on a fixed clock timer without sensing individual cars (unless fitted with loop sensors).' },
    { id: '5', name: 'Hand Screwdriver', icon: '🪛', correctType: 'tool', explanation: 'MANUAL TOOL: Requires direct human muscle power. Has no controller, no sensor, and no power circuit.' },
    { id: '6', name: 'Line-Following Bot', icon: '🏎️', correctType: 'robot', explanation: 'TRUE ROBOT: IR sensors read reflected light, Arduino decides steering direction, and DC motor driver turns wheels.' }
  ];
  const [detectiveSelected, setDetectiveSelected] = useState<string>('1');
  const [detectiveSorted, setDetectiveSorted] = useState<Record<string, 'robot' | 'automated' | 'tool'>>({});

  const handleSortItem = (bin: 'robot' | 'automated' | 'tool') => {
    setDetectiveSorted(prev => ({ ...prev, [detectiveSelected]: bin }));
  };

  // -----------------------------------------------------------------
  // 17. CIRCUIT SWITCH & LED SIM (Free Explorer Class 02)
  // -----------------------------------------------------------------
  const [circuitSwitchClosed, setCircuitSwitchClosed] = useState<boolean>(false);
  const [circuitResistance, setCircuitResistance] = useState<number>(220); // 220, 1000, 10000, 0
  const circuitCurrentMa = circuitResistance === 0 
    ? (circuitSwitchClosed ? '> 150.0 (DANGER: SHORT CIRCUIT)' : '0.0')
    : (circuitSwitchClosed ? (((5.0 - 2.0) / circuitResistance) * 1000).toFixed(1) : '0.0');

  // -----------------------------------------------------------------
  // 18. PID TUNING SIM (Advanced Class 05)
  // -----------------------------------------------------------------
  const [pidKp, setPidKp] = useState<number>(2.4);
  const [pidKi, setPidKi] = useState<number>(0.04);
  const [pidKd, setPidKd] = useState<number>(1.2);
  const [pidPreset, setPidPreset] = useState<'tuned' | 'oscillating' | 'sluggish'>('tuned');

  const applyPidPreset = (preset: 'tuned' | 'oscillating' | 'sluggish') => {
    setPidPreset(preset);
    if (preset === 'tuned') {
      setPidKp(2.4); setPidKi(0.04); setPidKd(1.2);
    } else if (preset === 'oscillating') {
      setPidKp(5.5); setPidKi(0.12); setPidKd(0.1);
    } else {
      setPidKp(0.8); setPidKi(0.0); setPidKd(0.2);
    }
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

      {/* 15. FLAGSHIP: ARDUINO BOARD TOUR SIM */}
      {type === 'arduino_board_tour_sim' && (
        <>
          {/* Filter Bar */}
          <div className={styles.boardFilterRow}>
            <button
              onClick={() => setBoardFilter('all')}
              className={`${styles.boardFilterBtn} ${boardFilter === 'all' ? styles.boardFilterBtnActive : ''}`}
            >
              All Components
            </button>
            <button
              onClick={() => setBoardFilter('digital')}
              className={`${styles.boardFilterBtn} ${boardFilter === 'digital' ? styles.boardFilterBtnActive : ''}`}
            >
              Digital & PWM (Pins 0–13)
            </button>
            <button
              onClick={() => setBoardFilter('analog')}
              className={`${styles.boardFilterBtn} ${boardFilter === 'analog' ? styles.boardFilterBtnActive : ''}`}
            >
              Analog Inputs (A0–A5)
            </button>
            <button
              onClick={() => setBoardFilter('power')}
              className={`${styles.boardFilterBtn} ${boardFilter === 'power' ? styles.boardFilterBtnActive : ''}`}
            >
              Power & GND Rails
            </button>
            <button
              onClick={() => setBoardFilter('mcu')}
              className={`${styles.boardFilterBtn} ${boardFilter === 'mcu' ? styles.boardFilterBtnActive : ''}`}
            >
              MCU Brain & USB
            </button>
            <button
              onClick={() => setShowPinoutTable(prev => !prev)}
              className={styles.boardFilterBtn}
              style={{ marginLeft: 'auto', background: showPinoutTable ? '#6B0F24' : 'rgba(255,255,255,0.06)', color: '#fff' }}
            >
              {showPinoutTable ? 'Hide Pinout Table' : 'Show Full Pinout Table'}
            </button>
          </div>

          {/* Main Board View & Inspector */}
          <div className={styles.boardContainer}>
            {/* SVG Visual Board */}
            <div className={styles.boardSvgWrap}>
              <svg viewBox="0 0 540 380" style={{ width: '100%', maxWidth: '520px', height: 'auto' }}>
                {/* Board PCB Base */}
                <rect x="20" y="20" width="500" height="340" rx="16" fill="#006677" stroke="#004d5a" strokeWidth="4" />
                <rect x="25" y="25" width="490" height="330" rx="14" fill="#0a5361" />

                {/* Silk Screen Branding */}
                <text x="180" y="70" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">ARDUINO UNO R3</text>
                <text x="180" y="90" fill="#F5B800" fontSize="11" fontWeight="700" fontFamily="sans-serif">ROBOBEE INNOVATORS ACADEMY</text>
                <text x="180" y="105" fill="#a5f3fc" fontSize="9" fontFamily="sans-serif">Illustrative Uno R3 Reference Model</text>

                {/* USB Connector */}
                <rect 
                  x="10" y="75" width="65" height="60" rx="4" 
                  fill="#94a3b8" stroke="#475569" strokeWidth="2" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPin('usb')}
                />
                <rect x="18" y="85" width="48" height="40" fill="#334155" />
                <text x="22" y="110" fill="#f8fafc" fontSize="10" fontWeight="bold">USB-B</text>

                {/* DC Barrel Jack */}
                <rect 
                  x="10" y="240" width="75" height="70" rx="6" 
                  fill="#0f172a" stroke="#334155" strokeWidth="3" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPin('vin')}
                />
                <circle cx="45" cy="275" r="14" fill="#475569" />
                <circle cx="45" cy="275" r="6" fill="#020617" />
                <text x="20" y="325" fill="#cbd5e1" fontSize="9">7-12V DC</text>

                {/* Reset Button */}
                <rect 
                  x="90" y="40" width="30" height="30" rx="4" 
                  fill="#334155" stroke="#475569" strokeWidth="1" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPin('reset')}
                />
                <circle cx="105" cy="55" r="9" fill="#ef4444" />
                <text x="86" y="82" fill="#f87171" fontSize="8" fontWeight="bold">RESET</text>

                {/* ATmega328P Microcontroller DIP-28 */}
                <rect 
                  x="200" y="180" width="220" height="50" rx="3" 
                  fill="#111827" stroke="#374151" strokeWidth="2" 
                  style={{ cursor: 'pointer', filter: selectedPin === 'mcu' ? 'drop-shadow(0 0 10px #F5B800)' : 'none' }}
                  onClick={() => setSelectedPin('mcu')}
                />
                <circle cx="210" cy="205" r="4" fill="#374151" />
                <text x="235" y="210" fill="#e2e8f0" fontSize="12" fontWeight="800" fontFamily="monospace">ATMEGA328P-PU</text>
                <text x="270" y="224" fill="#94a3b8" fontSize="9" fontFamily="monospace">16MHz 32KB FLASH</text>

                {/* 16 MHz Quartz Crystal */}
                <rect x="135" y="160" width="18" height="40" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                <text x="132" y="212" fill="#cbd5e1" fontSize="8">16 MHz</text>

                {/* Onboard LED 'L' (Pin 13) */}
                <rect 
                  x="145" y="105" width="16" height="20" rx="2" 
                  fill={boardLedOn ? '#F5B800' : '#1e293b'} 
                  stroke="#334155" strokeWidth="1"
                  style={{ 
                    cursor: 'pointer',
                    filter: boardLedOn ? 'drop-shadow(0 0 12px #F5B800)' : 'none',
                    transition: 'fill 0.1s, filter 0.1s'
                  }}
                  onClick={() => setSelectedPin('d13')}
                />
                <text x="148" y="136" fill="#F5B800" fontSize="9" fontWeight="900">L</text>
                <text x="135" y="98" fill="#94a3b8" fontSize="8">Pin 13 LED</text>

                {/* TX and RX LEDs */}
                <rect x="170" y="115" width="8" height="12" rx="1" fill="#10b981" />
                <text x="168" y="136" fill="#6ee7b7" fontSize="8">TX</text>
                <rect x="182" y="115" width="8" height="12" rx="1" fill="#10b981" />
                <text x="180" y="136" fill="#6ee7b7" fontSize="8">RX</text>

                {/* TOP HEADER: DIGITAL PINS (0 to 13, GND, AREF) */}
                <rect x="180" y="25" width="310" height="22" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                
                {/* Digital Hotspots */}
                {[
                  { id: 'd13', label: '13', x: 275 },
                  { id: 'd12', label: '12', x: 295 },
                  { id: 'd11', label: '~11', x: 315 },
                  { id: 'd10', label: '~10', x: 335 },
                  { id: 'd9', label: '~9', x: 355 },
                  { id: 'd3', label: '~3', x: 425 },
                  { id: 'd2', label: '2', x: 445 },
                  { id: 'd1', label: 'TX', x: 465 },
                  { id: 'd0', label: 'RX', x: 485 }
                ].map((pin) => (
                  <g key={pin.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPin(pin.id)}>
                    <circle 
                      cx={pin.x} cy="36" r="6" 
                      fill={selectedPin === pin.id ? '#F5B800' : '#030712'} 
                      stroke={selectedPin === pin.id ? '#ffffff' : '#64748b'} 
                      strokeWidth="1.5"
                    />
                    <text x={pin.x - 5} y="55" fill={selectedPin === pin.id ? '#F5B800' : '#cbd5e1'} fontSize="8" fontWeight="bold">
                      {pin.label}
                    </text>
                  </g>
                ))}

                {/* BOTTOM LEFT: POWER HEADER (IOREF, RESET, 3.3V, 5V, GND, GND, VIN) */}
                <rect x="180" y="325" width="140" height="22" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="185" y="318" fill="#f87171" fontSize="9" fontWeight="bold">POWER</text>
                {[
                  { id: 'v33', label: '3.3V', x: 220 },
                  { id: 'v5', label: '5V', x: 240 },
                  { id: 'gnd', label: 'GND', x: 260 },
                  { id: 'vin', label: 'Vin', x: 300 }
                ].map((p) => (
                  <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPin(p.id)}>
                    <circle 
                      cx={p.x} cy="336" r="6" 
                      fill={selectedPin === p.id ? '#F5B800' : '#030712'} 
                      stroke={selectedPin === p.id ? '#ffffff' : '#ef4444'} 
                      strokeWidth="1.5"
                    />
                    <text x={p.x - 8} y="360" fill={selectedPin === p.id ? '#F5B800' : '#cbd5e1'} fontSize="7.5" fontWeight="bold">
                      {p.label}
                    </text>
                  </g>
                ))}

                {/* BOTTOM RIGHT: ANALOG HEADER (A0 to A5) */}
                <rect x="340" y="325" width="130" height="22" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="345" y="318" fill="#38bdf8" fontSize="9" fontWeight="bold">ANALOG IN</text>
                {[
                  { id: 'a0', label: 'A0', x: 355 },
                  { id: 'a1', label: 'A1', x: 375 },
                  { id: 'a2', label: 'A2', x: 395 },
                  { id: 'a3', label: 'A3', x: 415 },
                  { id: 'a4', label: 'A4', x: 435 }
                ].map((p) => (
                  <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPin(p.id)}>
                    <circle 
                      cx={p.x} cy="336" r="6" 
                      fill={selectedPin === p.id ? '#F5B800' : '#030712'} 
                      stroke={selectedPin === p.id ? '#ffffff' : '#38bdf8'} 
                      strokeWidth="1.5"
                    />
                    <text x={p.x - 6} y="360" fill={selectedPin === p.id ? '#F5B800' : '#cbd5e1'} fontSize="8" fontWeight="bold">
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
                💡 <em>Click any component, header pin, or the ATmega328P chip to inspect its engineering specifications.</em>
              </div>
            </div>

            {/* Inspector Drawer */}
            <div className={styles.pinDrawer}>
              {BOARD_PINS[selectedPin] ? (
                <>
                  <div className={styles.pinDrawerHeader}>
                    <div>
                      <div className={styles.pinDrawerTitle}>{BOARD_PINS[selectedPin].name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{BOARD_PINS[selectedPin].type}</div>
                    </div>
                    <span className={styles.pinDrawerTag}>{BOARD_PINS[selectedPin].category.toUpperCase()}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {BOARD_PINS[selectedPin].desc}
                  </p>

                  <div className={styles.pinPropRow}>
                    <span className={styles.pinPropLabel}>Logic & Voltage:</span>
                    <span className={styles.pinPropVal}>{BOARD_PINS[selectedPin].voltage}</span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F5B800', marginBottom: '0.35rem' }}>
                      C++ Code Example:
                    </div>
                    <pre className={styles.pinCodeSnippet}>
                      <code>{BOARD_PINS[selectedPin].code}</code>
                    </pre>
                  </div>

                  <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertTriangle size={14} />
                      <span>SAFETY RULE:</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '0.25rem', lineHeight: '1.4' }}>
                      {BOARD_PINS[selectedPin].caution}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 1rem' }}>
                  Select any pin on the Uno board above to inspect its properties.
                </div>
              )}
            </div>
          </div>

          {/* Hands-On Timing Control Panel for Class 01 Blink */}
          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Change Blink Delay: delay({boardBlinkDelay})</span>
                <span style={{ color: '#F5B800', fontWeight: 800 }}>{boardBlinkDelay} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={boardBlinkDelay}
                onChange={(e) => setBoardBlinkDelay(Number(e.target.value))}
                className={styles.slider}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
                <span>⚡ Hyper Flash (50ms)</span>
                <span>Standard (500ms)</span>
                <span>🐢 Slow Pulse (1500ms)</span>
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Live Sketch Tracing (Arduino Uno)</span>
                <span style={{ color: boardLedOn ? '#F5B800' : '#64748b', fontWeight: 700 }}>
                  LED State: {boardLedOn ? 'HIGH (5V)' : 'LOW (0V)'}
                </span>
              </div>
              <div style={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '6px', padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                <div style={{ color: '#64748b' }}>void loop() &#123;</div>
                <div style={{ color: boardLedOn ? '#F5B800' : '#475569', fontWeight: boardLedOn ? 800 : 400, background: boardLedOn ? 'rgba(245, 184, 0, 0.15)' : 'transparent', padding: '2px 4px', borderRadius: '4px' }}>
                  &nbsp;&nbsp;digitalWrite(LED_BUILTIN, HIGH); // 5V ON
                </div>
                <div style={{ color: '#64748b' }}>&nbsp;&nbsp;delay({boardBlinkDelay});</div>
                <div style={{ color: !boardLedOn ? '#38bdf8' : '#475569', fontWeight: !boardLedOn ? 800 : 400, background: !boardLedOn ? 'rgba(56, 189, 248, 0.15)' : 'transparent', padding: '2px 4px', borderRadius: '4px' }}>
                  &nbsp;&nbsp;digitalWrite(LED_BUILTIN, LOW);  // 0V OFF
                </div>
                <div style={{ color: '#64748b' }}>&nbsp;&nbsp;delay({boardBlinkDelay});</div>
                <div style={{ color: '#64748b' }}>&#125;</div>
              </div>
            </div>
          </div>

          {/* Accessible Pinout Table Toggle */}
          {showPinoutTable && (
            <div style={{ marginTop: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', overflowX: 'auto' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5B800', marginBottom: '0.75rem' }}>
                📋 Complete Arduino Uno R3 Pinout & Electrical Reference Table
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                    <th style={{ padding: '0.5rem' }}>Pin / Component</th>
                    <th style={{ padding: '0.5rem' }}>Category</th>
                    <th style={{ padding: '0.5rem' }}>Voltage / Limits</th>
                    <th style={{ padding: '0.5rem' }}>Robotics Classroom Usage</th>
                    <th style={{ padding: '0.5rem' }}>Typical C++ Code</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(BOARD_PINS).map(([key, p]) => (
                    <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f1f5f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: '#F5B800' }}>{p.name}</td>
                      <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ padding: '0.5rem', color: '#38bdf8', fontFamily: 'monospace' }}>{p.voltage}</td>
                      <td style={{ padding: '0.5rem' }}>{p.desc}</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#a5f3fc' }}>{p.code.split('\n')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Info size={18} />
            <span>
              Simulation Notice: The virtual Arduino Uno above models standard Rev3 behavior. Notice that the built-in LED on Pin 13 blinks without external jumper wires!
            </span>
          </div>
        </>
      )}

      {/* 16. ROBOT DETECTIVE SIM */}
      {type === 'robot_detective_sim' && (
        <div className={styles.detectiveContainer}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F5B800' }}>
              🕵️ The Robot Detective Challenge
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              A robot must follow the closed loop: <strong>SENSE → DECIDE → ACT</strong>. Click an example item below, then classify it into its correct bin!
            </p>
          </div>

          {/* Cards to pick */}
          <div className={styles.detectiveCardsGrid}>
            {DETECTIVE_ITEMS.map((item) => {
              const isSelected = detectiveSelected === item.id;
              const sortedBin = detectiveSorted[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => setDetectiveSelected(item.id)}
                  className={`${styles.detectiveCard} ${isSelected ? styles.detectiveCardSelected : ''}`}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>{item.name}</div>
                  {sortedBin && (
                    <div style={{ fontSize: '0.65rem', marginTop: '0.35rem', fontWeight: 800, color: sortedBin === item.correctType ? '#34d399' : '#f87171' }}>
                      {sortedBin === item.correctType ? '✓ Sorted Right' : '✗ Re-evaluate'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3 Classification Bins */}
          <div className={styles.detectiveBinsGrid}>
            <div onClick={() => handleSortItem('robot')} className={styles.detectiveBin}>
              <div className={styles.detectiveBinTitle}>🤖 1. True Robot</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                Has sensors, runs a programmable decision loop, and acts autonomously in the physical world.
              </div>
              <button className={`${styles.simBtn} ${styles.simBtnGreen}`} style={{ marginTop: 'auto' }}>
                Classify as Robot
              </button>
            </div>

            <div onClick={() => handleSortItem('automated')} className={styles.detectiveBin}>
              <div className={styles.detectiveBinTitle}>⚙️ 2. Automated Device</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                Runs a fixed open-loop sequence or clock timer. Cannot dynamically adapt to environment changes.
              </div>
              <button className={`${styles.simBtn} ${styles.simBtnCyan}`} style={{ marginTop: 'auto' }}>
                Classify as Automated
              </button>
            </div>

            <div onClick={() => handleSortItem('tool')} className={styles.detectiveBin}>
              <div className={styles.detectiveBinTitle}>🪛 3. Manual Tool</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                Requires direct human muscle power to function. No controller, no sensor, no motor.
              </div>
              <button className={styles.simBtn} style={{ marginTop: 'auto' }}>
                Classify as Tool
              </button>
            </div>
          </div>

          {/* Feedback Area */}
          {detectiveSorted[detectiveSelected] && (
            <div className={`${styles.statusBanner} ${detectiveSorted[detectiveSelected] === DETECTIVE_ITEMS.find(i => i.id === detectiveSelected)?.correctType ? styles.statusSuccess : styles.statusWarning}`}>
              <CheckCircle size={18} />
              <span>
                <strong>{DETECTIVE_ITEMS.find(i => i.id === detectiveSelected)?.name}:</strong> {DETECTIVE_ITEMS.find(i => i.id === detectiveSelected)?.explanation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 17. CIRCUIT SWITCH & LED SIM */}
      {type === 'circuit_switch_led_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div className={styles.circuitLoop}>
              {/* 5V Power Supply */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ef4444' }}>
                <Battery size={24} color="#ef4444" />
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444' }}>5V Rail</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>+5.0V DC</div>
              </div>

              {/* Wire 1 */}
              <div className={`${styles.circuitWire} ${circuitSwitchClosed ? styles.circuitWireActive : ''}`} />

              {/* Pushbutton Switch */}
              <div 
                style={{ textAlign: 'center', background: circuitSwitchClosed ? '#10b981' : '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #64748b', cursor: 'pointer' }}
                onClick={() => setCircuitSwitchClosed(prev => !prev)}
              >
                <div style={{ fontSize: '1.2rem' }}>{circuitSwitchClosed ? '🟢' : '⚪'}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: circuitSwitchClosed ? '#022c22' : '#f1f5f9' }}>
                  {circuitSwitchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                </div>
              </div>

              {/* Wire 2 */}
              <div className={`${styles.circuitWire} ${circuitSwitchClosed ? styles.circuitWireActive : ''}`} />

              {/* Resistor */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #F5B800' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B800' }}>{circuitResistance} Ω</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Limiter</div>
              </div>

              {/* Wire 3 */}
              <div className={`${styles.circuitWire} ${circuitSwitchClosed ? styles.circuitWireActive : ''}`} />

              {/* LED Output */}
              <div style={{ 
                textAlign: 'center', 
                background: circuitSwitchClosed && circuitResistance > 0 ? '#F5B800' : '#1e293b', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid #F5B800',
                boxShadow: circuitSwitchClosed && circuitResistance > 0 ? '0 0 25px #F5B800' : 'none'
              }}>
                <Zap size={24} color={circuitSwitchClosed && circuitResistance > 0 ? '#161B26' : '#64748b'} />
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: circuitSwitchClosed && circuitResistance > 0 ? '#161B26' : '#94a3b8' }}>
                  {circuitSwitchClosed && circuitResistance > 0 ? 'GLOWING' : 'DARK'}
                </div>
              </div>

              {/* Wire 4 */}
              <div className={`${styles.circuitWire} ${circuitSwitchClosed ? styles.circuitWireActive : ''}`} />

              {/* Ground Return */}
              <div style={{ textAlign: 'center', background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #38bdf8' }}>
                <div style={{ fontSize: '1.2rem', color: '#38bdf8' }}>⏚</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>GND</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>0.0V Return</div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Pushbutton Switch Control</span>
              </div>
              <button
                onClick={() => setCircuitSwitchClosed(prev => !prev)}
                className={`${styles.simBtn} ${circuitSwitchClosed ? styles.simBtnGreen : styles.simBtnCyan}`}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}
              >
                {circuitSwitchClosed ? 'Click to OPEN Switch (Break Circuit)' : 'Click to CLOSE Switch (Complete Loop)'}
              </button>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Current-Limiting Resistor</span>
                <span style={{ color: '#F5B800' }}>{circuitResistance} Ω</span>
              </div>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => setCircuitResistance(220)}
                  className={`${styles.simBtn} ${circuitResistance === 220 ? styles.simBtnGreen : ''}`}
                >
                  220 Ω (Standard Safe)
                </button>
                <button
                  onClick={() => setCircuitResistance(1000)}
                  className={`${styles.simBtn} ${circuitResistance === 1000 ? styles.simBtnCyan : ''}`}
                >
                  1 kΩ (Dim)
                </button>
                <button
                  onClick={() => setCircuitResistance(0)}
                  className={`${styles.simBtn} ${circuitResistance === 0 ? styles.simBtnRed : ''}`}
                >
                  0 Ω (No Resistor!)
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${circuitResistance === 0 && circuitSwitchClosed ? styles.statusDanger : styles.statusNormal}`}>
            <Activity size={18} />
            <span>
              Ohm&apos;s Law Calculated Current: <strong>{circuitCurrentMa} mA</strong>.
              {circuitResistance === 0 && circuitSwitchClosed 
                ? ' ⚠️ DANGER: Without a current-limiting resistor, infinite current destroys the LED and damages the Arduino GPIO pin!'
                : ' Notice how the 220Ω resistor safely holds current at ~13.6 mA!'}
            </span>
          </div>
        </>
      )}

      {/* 18. PID TUNING SIM */}
      {type === 'pid_tuning_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ width: '100%', maxWidth: '520px', height: '180px', background: '#020617', border: '1px solid #1f2937', borderRadius: '8px', position: 'relative', overflow: 'hidden', padding: '1rem' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
                Error Curve vs Time (Target = Center Line 0)
              </div>
              {/* Target Line */}
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: '#10b981', borderTop: '1px dashed #10b981' }} />
              
              {/* Simulated Waveform Path */}
              <svg viewBox="0 0 500 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path
                  d={
                    pidPreset === 'tuned'
                      ? "M 10 100 Q 80 10, 160 62 T 260 58 T 360 60 T 490 60"
                      : pidPreset === 'oscillating'
                      ? "M 10 110 Q 60 5, 120 115 T 220 5 T 320 115 T 420 5 T 490 100"
                      : "M 10 110 Q 150 95, 300 75 T 490 62"
                  }
                  fill="none"
                  stroke={pidPreset === 'tuned' ? '#10b981' : pidPreset === 'oscillating' ? '#ef4444' : '#F5B800'}
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Kp (Proportional Gain)</span>
                <span>{pidKp}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8.0"
                step="0.1"
                value={pidKp}
                onChange={(e) => setPidKp(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>Kd (Derivative Damping)</span>
                <span>{pidKd}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={pidKd}
                onChange={(e) => setPidKd(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>PID Tuning Presets</span>
              </div>
              <div className={styles.btnGroup}>
                <button onClick={() => applyPidPreset('tuned')} className={`${styles.simBtn} ${pidPreset === 'tuned' ? styles.simBtnGreen : ''}`}>
                  Critically Damped (Tuned)
                </button>
                <button onClick={() => applyPidPreset('oscillating')} className={`${styles.simBtn} ${pidPreset === 'oscillating' ? styles.simBtnRed : ''}`}>
                  Violent Oscillation (High Kp)
                </button>
                <button onClick={() => applyPidPreset('sluggish')} className={`${styles.simBtn} ${pidPreset === 'sluggish' ? styles.simBtnCyan : ''}`}>
                  Sluggish (Low Kp)
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${pidPreset === 'tuned' ? styles.statusSuccess : pidPreset === 'oscillating' ? styles.statusDanger : styles.statusNormal}`}>
            <CheckCircle size={18} />
            <span>
              {pidPreset === 'tuned' && 'OPTIMIZED: Proportional drive corrects error rapidly while Derivative damping prevents overshoot!'}
              {pidPreset === 'oscillating' && 'INSTABILITY: Excessive Kp causes over-correction and violently throws the robot off the line!'}
              {pidPreset === 'sluggish' && 'SLUGGISH: Low Kp reacts too slowly to sharp corners, missing track intersections.'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
