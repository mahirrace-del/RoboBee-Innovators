"use client";

import React, { useState, useEffect } from "react";
import styles from "./curriculumSimulator.module.css";
import { InteractiveVisualType } from "@/lib/curriculumData";
import { 
  Eye, Cpu, Zap, Radio, Sliders, Play, RotateCcw, 
  CheckCircle, AlertTriangle, Battery, Shield, Target,
  Compass, CheckSquare, RefreshCw, Volume2, ShieldAlert,
  Info, Activity, Layers, SlidersHorizontal, Box, HelpCircle
} from "lucide-react";

interface SimulatorProps {
  type?: InteractiveVisualType;
  visualizerId?: InteractiveVisualType;
  classNumber?: number;
  lessonTitle?: string;
}

export function CurriculumSimulator({ type: propType, visualizerId, classNumber = 1 }: SimulatorProps) {
  const type = visualizerId || propType || 'sense_decide_act_sim';
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
    const cur = { ...c6RobotPos };

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
  // 9. CLASS 09: obstacle_avoiding_rover_sim
  // -----------------------------------------------------------------
  const [roverObstacleDist, setRoverObstacleDist] = useState<number>(45);
  const [roverRunning, setRoverRunning] = useState<boolean>(false);
  const roverThreshold = 20;
  const roverIsBlocked = roverObstacleDist <= roverThreshold;

  // Motor state derived from distance and running flag
  const roverMotorState = !roverRunning
    ? { left: 'STOP', right: 'STOP', action: 'Rover OFF', color: '#64748b' }
    : roverIsBlocked
    ? { left: 'REV', right: 'FWD', action: 'OBSTACLE DETECTED — Brake → Pivot Right', color: '#ef4444' }
    : { left: 'FWD', right: 'FWD', action: 'Path Clear — Driving Forward', color: '#10b981' };

  // Simulate autonomous drive: if running and clear, slowly reduce distance to test avoidance
  useEffect(() => {
    if (type !== 'obstacle_avoiding_rover_sim') return;
    if (!roverRunning) return;
    const interval = setInterval(() => {
      setRoverObstacleDist(prev => {
        if (prev <= roverThreshold) return prev; // blocked, don't approach further
        return Math.max(roverThreshold - 1, prev - 1); // slowly approach obstacle
      });
    }, 300);
    return () => clearInterval(interval);
  }, [type, roverRunning, roverObstacleDist]);

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
  type FlagshipClass1Tool = 'board_tour' | 'blink_sync' | 'robot_or_not' | 'sense_decide_act' | 'parts_gallery';
  const [c1ActiveTool, setC1ActiveTool] = useState<FlagshipClass1Tool>('board_tour');
  const [boardFilter, setBoardFilter] = useState<PinCategory>('all');
  const [selectedPin, setSelectedPin] = useState<string>('d13');
  const [boardBlinkDelay, setBoardBlinkDelay] = useState<number>(500);
  const [boardLedOn, setBoardLedOn] = useState<boolean>(true);
  const [showPinoutTable, setShowPinoutTable] = useState<boolean>(false);

  // Synchronized Blink Stepper State
  const [c1CircuitMode, setC1CircuitMode] = useState<'builtin' | 'breadboard'>('builtin');
  const [c1HighMs, setC1HighMs] = useState<number>(1000);
  const [c1LowMs, setC1LowMs] = useState<number>(1000);
  const [c1SyncLine, setC1SyncLine] = useState<number>(2);
  const [c1SyncLedOn, setC1SyncLedOn] = useState<boolean>(true);
  const [c1BlinkPattern, setC1BlinkPattern] = useState<'standard' | 'heartbeat' | 'sos' | 'strobe'>('standard');

  // Sense Decide Act Domain State
  type SdaDomain = 'agri' | 'health' | 'warehouse' | 'space' | 'city';
  const [c1SdaDomain, setC1SdaDomain] = useState<SdaDomain>('agri');
  const [c1SdaValue, setC1SdaValue] = useState<number>(25);

  // Robot or Not State
  const [c1RonSelected, setC1RonSelected] = useState<string>('rover');
  const [c1RonAnswers, setC1RonAnswers] = useState<Record<string, 'robot' | 'automated' | 'tool'>>({});

  // Parts Gallery State
  type PartsCategory = 'all' | 'brain' | 'sense' | 'act' | 'power' | 'structure';
  const [c1PartsFilter, setC1PartsFilter] = useState<PartsCategory>('all');
  const [c1SelectedPart, setC1SelectedPart] = useState<string>('uno');

  useEffect(() => {
    if (type !== 'arduino_board_tour_sim') return;
    const interval = setInterval(() => {
      setBoardLedOn(prev => !prev);
    }, boardBlinkDelay);
    return () => clearInterval(interval);
  }, [type, boardBlinkDelay]);

  useEffect(() => {
    if (type !== 'arduino_board_tour_sim' || c1ActiveTool !== 'blink_sync') return;
    let timer: NodeJS.Timeout;
    if (c1BlinkPattern === 'heartbeat') {
      const hbSeq = [
        { on: true, dur: 120, line: 2 },
        { on: false, dur: 120, line: 4 },
        { on: true, dur: 120, line: 2 },
        { on: false, dur: 700, line: 4 }
      ];
      let stepIdx = 0;
      const runHb = () => {
        const step = hbSeq[stepIdx % hbSeq.length];
        setC1SyncLedOn(step.on);
        setC1SyncLine(step.line);
        stepIdx++;
        timer = setTimeout(runHb, step.dur);
      };
      runHb();
      return () => clearTimeout(timer);
    } else if (c1BlinkPattern === 'sos') {
      const sosSeq = [
        { on: true, dur: 150 }, { on: false, dur: 150 },
        { on: true, dur: 150 }, { on: false, dur: 150 },
        { on: true, dur: 150 }, { on: false, dur: 400 },
        { on: true, dur: 500 }, { on: false, dur: 200 },
        { on: true, dur: 500 }, { on: false, dur: 200 },
        { on: true, dur: 500 }, { on: false, dur: 400 },
        { on: true, dur: 150 }, { on: false, dur: 150 },
        { on: true, dur: 150 }, { on: false, dur: 150 },
        { on: true, dur: 150 }, { on: false, dur: 1200 }
      ];
      let sIdx = 0;
      const runSos = () => {
        const s = sosSeq[sIdx % sosSeq.length];
        setC1SyncLedOn(s.on);
        setC1SyncLine(s.on ? 2 : 4);
        sIdx++;
        timer = setTimeout(runSos, s.dur);
      };
      runSos();
      return () => clearTimeout(timer);
    } else {
      let isHigh = true;
      const cycle = () => {
        setC1SyncLedOn(isHigh);
        setC1SyncLine(isHigh ? 2 : 4);
        const curDelay = isHigh ? c1HighMs : c1LowMs;
        isHigh = !isHigh;
        timer = setTimeout(cycle, curDelay);
      };
      cycle();
      return () => clearTimeout(timer);
    }
  }, [type, c1ActiveTool, c1BlinkPattern, c1HighMs, c1LowMs]);

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
  // FLAGSHIP CLASS 1 DATA: Robot or Not, Domains, Parts
  // -----------------------------------------------------------------
  interface RonItem {
    id: string;
    name: string;
    icon: string;
    category: 'robot' | 'automated' | 'tool';
    verdict: string;
    reason: string;
  }
  const CLASS_1_ROBOT_OR_NOT_ITEMS: RonItem[] = [
    {
      id: 'rover',
      name: 'Mars Curiosity Rover',
      icon: '🪐',
      category: 'robot',
      verdict: 'TRUE AUTONOMOUS ROBOT',
      reason: 'Uses stereo hazard cameras and laser rangefinders (SENSE), an onboard computer with path-planning algorithms (DECIDE), and motorized rocker-bogie wheels (ACT) to navigate Martian terrain autonomously without real-time human joystick steering.'
    },
    {
      id: 'line_follower',
      name: 'Line-Following Arena Bot',
      icon: '🏎️',
      category: 'robot',
      verdict: 'TRUE AUTONOMOUS ROBOT',
      reason: 'Uses dual infrared reflectance sensors to detect the track (SENSE), an Arduino microcontroller to calculate steering error (DECIDE), and a TB6612FNG driver to steer left/right wheels (ACT) in an unbroken feedback loop.'
    },
    {
      id: 'drone',
      name: 'Autonomous Delivery Drone',
      icon: '🚁',
      category: 'robot',
      verdict: 'TRUE AUTONOMOUS ROBOT',
      reason: 'Uses IMU gyroscopes, barometric altitude sensors, and GPS (SENSE), a flight controller running PID stabilization algorithms (DECIDE), and four brushless motors (ACT) to stay level and navigate to drop-off coordinates.'
    },
    {
      id: 'surgical_arm',
      name: 'Da Vinci Surgical Robot Arm',
      icon: '🦾',
      category: 'robot',
      verdict: 'TRUE TELE-ROBOTIC SYSTEM',
      reason: 'Uses high-resolution joint optical encoders (SENSE), an advanced kinematic processor that filters out hand tremors and scales motions (DECIDE), and precision multi-axis micro-actuators (ACT) to perform surgery.'
    },
    {
      id: 'toaster',
      name: 'Electric Kitchen Toaster',
      icon: '🍞',
      category: 'automated',
      verdict: 'AUTOMATED APPLIANCE (NOT A ROBOT)',
      reason: 'Follows an open-loop mechanical spring latch and bimetallic strip or fixed capacitor timer. It cannot sense if bread is burning, cannot adjust heating duration autonomously, and has no closed-loop sensors.'
    },
    {
      id: 'washing_machine',
      name: 'Domestic Clothes Washer',
      icon: '🌀',
      category: 'automated',
      verdict: 'AUTOMATED APPLIANCE (NOT A ROBOT)',
      reason: 'Cycles through pre-programmed timer sequences (Fill ➔ Agitate ➔ Spin ➔ Drain). Unless fitted with turbidity and load-balancing sensors with closed-loop adjustment, it cannot adapt its behavior.'
    },
    {
      id: 'traffic_light',
      name: 'Fixed Traffic Light Timer',
      icon: '🚦',
      category: 'automated',
      verdict: 'AUTOMATED CLOCK DEVICE (NOT A ROBOT)',
      reason: 'Switches green-yellow-red on a dumb, rigid clock timer without knowing whether cars or pedestrians are waiting (unless upgraded with computer vision or inductive road loop sensors).'
    },
    {
      id: 'screwdriver',
      name: 'Manual Hand Screwdriver',
      icon: '🪛',
      category: 'tool',
      verdict: 'MANUAL HAND TOOL (NOT A ROBOT)',
      reason: 'Zero electronics, zero sensors, zero computation, and zero autonomy. Requires 100% human muscle power to turn and operate.'
    }
  ];

  interface SdaDomainItem {
    id: SdaDomain;
    title: string;
    icon: string;
    sensorName: string;
    sensorType: string;
    sensorReading: string;
    brainName: string;
    brainRule: string;
    decisionState: string;
    actuatorName: string;
    actuatorAction: string;
    minVal: number;
    maxVal: number;
    unit: string;
    threshold: number;
    isTriggered: (val: number) => boolean;
  }
  const SDA_DOMAINS: SdaDomainItem[] = [
    {
      id: 'agri',
      title: 'Precision Agriculture (Smart Irrigation)',
      icon: '🌱',
      sensorName: 'Capacitive Soil Moisture Probe',
      sensorType: 'Analog In (A0)',
      sensorReading: `${c1SdaValue}% Soil Moisture`,
      brainName: 'Arduino Uno (ATmega328P)',
      brainRule: 'if (moisture < 30%) { openValve(); }',
      decisionState: c1SdaValue < 30 ? 'SOIL PARCHED: ACTIVATE' : 'SOIL OPTIMAL: STANDBY',
      actuatorName: '12V Solenoid Water Valve',
      actuatorAction: c1SdaValue < 30 ? 'Pumping Water to Crops' : 'Valve Closed (Conserving Water)',
      minVal: 5,
      maxVal: 80,
      unit: '% Moisture',
      threshold: 30,
      isTriggered: (v) => v < 30
    },
    {
      id: 'health',
      title: 'Critical Healthcare (Patient Monitor)',
      icon: '❤️',
      sensorName: 'Optical Pulse Oximeter (PPG)',
      sensorType: 'I2C Digital (A4/A5)',
      sensorReading: `${c1SdaValue} BPM Heart Rate`,
      brainName: 'Medical Microcontroller',
      brainRule: 'if (bpm > 120 || bpm < 45) { triggerAlarm(); }',
      decisionState: (c1SdaValue > 120 || c1SdaValue < 45) ? 'ARRHYTHMIA ALERT' : 'STABLE VITAL SIGNS',
      actuatorName: 'Piezo Alarm & Nurse Station Beacon',
      actuatorAction: (c1SdaValue > 120 || c1SdaValue < 45) ? 'Loud Alarm Sounding (Audio Alert)' : 'Silent Normal Operation',
      minVal: 35,
      maxVal: 160,
      unit: 'BPM',
      threshold: 120,
      isTriggered: (v) => v > 120 || v < 45
    },
    {
      id: 'warehouse',
      title: 'Warehouse Logistics (Autonomous Rover)',
      icon: '📦',
      sensorName: 'HC-SR04 Ultrasonic Sonar',
      sensorType: 'Digital Trig/Echo (Pins 11/12)',
      sensorReading: `${c1SdaValue} cm Obstacle Distance`,
      brainName: 'Arduino Uno Navigation Loop',
      brainRule: 'if (dist < 20) { reverse(); pivotRight(); }',
      decisionState: c1SdaValue < 20 ? 'OBSTACLE DETECTED (< 20cm)' : 'PATH CLEAR (>= 20cm)',
      actuatorName: 'Dual TT DC Motors via TB6612FNG',
      actuatorAction: c1SdaValue < 20 ? 'Brake & Pivot Right 90°' : 'Driving Forward Full Speed',
      minVal: 5,
      maxVal: 80,
      unit: 'cm Distance',
      threshold: 20,
      isTriggered: (v) => v < 20
    },
    {
      id: 'space',
      title: 'Space Exploration (Mars Rover Hazard)',
      icon: '🚀',
      sensorName: 'Hazcam Stereo Optical Cameras',
      sensorType: 'Stereo Vision Ranging',
      sensorReading: `${c1SdaValue}° Terrain Incline`,
      brainName: 'Rover Autonomous Navigation Matrix',
      brainRule: 'if (slope > 18) { haltDrive(); routeReplan(); }',
      decisionState: c1SdaValue > 18 ? 'CRITICAL ROLLOVER RISK (>18°)' : 'STABLE SLOPE (<=18°)',
      actuatorName: '6-Wheel Rocker-Bogie Suspension Drive',
      actuatorAction: c1SdaValue > 18 ? 'Wheels Locked • Autonomous Re-Plan' : 'Climbing Crater Gradient Safely',
      minVal: 0,
      maxVal: 35,
      unit: 'Degrees Incline',
      threshold: 18,
      isTriggered: (v) => v > 18
    },
    {
      id: 'city',
      title: 'Smart City Infrastructure (Eco Lighting)',
      icon: '💡',
      sensorName: 'PIR Motion & LDR Light Sensor',
      sensorType: 'Digital Pin 2 & Analog A0',
      sensorReading: `${c1SdaValue} Lux Ambient Light`,
      brainName: 'Low-Power Energy Controller',
      brainRule: 'if (lux < 50) { dimTo(100%); } else { dimTo(0%); }',
      decisionState: c1SdaValue < 50 ? 'NIGHTTIME DETECTED' : 'DAYLIGHT DETECTED',
      actuatorName: 'High-Output LED Matrix Array',
      actuatorAction: c1SdaValue < 50 ? 'Illuminating Streetway (Full Output)' : 'Off (Conserving Grid Electricity)',
      minVal: 10,
      maxVal: 150,
      unit: 'Lux Ambient',
      threshold: 50,
      isTriggered: (v) => v < 50
    }
  ];

  interface PartCard {
    id: string;
    name: string;
    role: string;
    category: PartsCategory;
    specs: string;
    desc: string;
    safetyTip: string;
  }
  const ROBOTICS_PARTS_GALLERY: PartCard[] = [
    {
      id: 'uno',
      name: 'Arduino Uno R3 Board',
      role: 'Brain (Microcontroller)',
      category: 'brain',
      specs: 'Microchip ATmega328P, 16 MHz, 14 Digital I/O, 6 Analog Inputs, 5.0V Logic',
      desc: 'The central computational brain of the robot. Executes your compiled C++ program in bare-metal real-time at 16 million clock cycles per second.',
      safetyTip: 'Never power while rewiring. Always unplug USB before making header pin adjustments.'
    },
    {
      id: 'breadboard',
      name: 'Half-Size Solderless Breadboard',
      role: 'Prototyping Platform',
      category: 'structure',
      specs: '400 Tie-Points, 2 Continuous Power Rails (+ / -), 0.1" Standard Pin Spacing',
      desc: 'Enables rapid, solderless prototyping. Internal spring clips connect rows of 5 tie-points and vertical power buses.',
      safetyTip: 'Do not force thick gauge wires into tie-points; bent internal clips can cause intermittent open-circuit faults.'
    },
    {
      id: 'led',
      name: '5mm Diffused Red LED',
      role: 'Visual Actuator (Output)',
      category: 'act',
      specs: 'Forward Voltage ~2.0V, Max Continuous Current 20mA, Electroluminescent Diode',
      desc: 'A solid-state semiconductor diode that emits visible light when forward-biased. Has polarity: Long leg = Anode (+), Short leg = Cathode (-).',
      safetyTip: 'NEVER connect directly across 5V and GND without a 220Ω series resistor (prevents thermal burnout).'
    },
    {
      id: 'resistor',
      name: '220Ω Current-Limiting Resistor',
      role: 'Silicon Bodyguard (Protection)',
      category: 'power',
      specs: '220 Ohms (Ω), 1/4 Watt, 5% Carbon Film (Color Bands: Red-Red-Brown-Gold)',
      desc: 'Wired in series with the LED to limit electron flow and keep current below 15mA, protecting both the LED and the ATmega328P GPIO pin.',
      safetyTip: 'Resistors have no polarity—they can be inserted in either orientation without affecting circuit performance.'
    },
    {
      id: 'sonar',
      name: 'HC-SR04 Ultrasonic Sonar',
      role: 'Sense (Distance Perception)',
      category: 'sense',
      specs: '40 kHz Acoustic Pulses, 2cm to 400cm Detection Range, 5V DC, Trigger/Echo Pins',
      desc: 'Emits ultrasonic acoustic chirps and measures echo reflection time to calculate physical distance using the speed of sound.',
      safetyTip: 'Operates at 5V. Soft absorbent materials (like cloth or fur) may attenuate ultrasonic echoes.'
    },
    {
      id: 'motors',
      name: 'Dual TT DC Gearmotors',
      role: 'Act (Differential Drive)',
      category: 'act',
      specs: '3V–6V DC Nominal, 1:48 Internal Gear Reduction, ~200 RPM @ 6V with Rubber Tires',
      desc: 'Permanent-magnet DC motors paired with gearboxes to trade high rotational speed for strong wheel torque capable of driving rover chassis.',
      safetyTip: 'Never connect DC motor leads directly to Arduino pins! Motors draw inductive current spikes that will reset the CPU.'
    },
    {
      id: 'driver',
      name: 'TB6612FNG Dual H-Bridge Driver',
      role: 'Power & Logic Intermediary',
      category: 'power',
      specs: 'Dual MOSFET H-Bridge, 1.2A Continuous (3.2A Peak), High Efficiency, PWM Speed',
      desc: 'Translates 5V logic pulses from Arduino into high-current power for DC motors with forward, reverse, brake, and coast modes.',
      safetyTip: 'Connect VMOT to external battery pack and VCC to Arduino 5V. Keep system ground (GND) common!'
    },
    {
      id: 'servo',
      name: 'SG90 Micro Servo Motor',
      role: 'Act (Angular Positioning)',
      category: 'act',
      specs: '180° Travel Range, 1.8 kg-cm Torque @ 4.8V, 50Hz PWM Signal (1.0ms–2.0ms Pulses)',
      desc: 'Closed-loop positional actuator with internal motor, potentiometer feedback, and control logic for sensor pan brackets or grippers.',
      safetyTip: 'Servos can draw up to 500mA stall current. When testing multiple servos, power them from an external 5V rail.'
    },
    {
      id: 'chassis',
      name: '2WD Acrylic Rover Chassis Plate',
      role: 'Structure (Mechanical Body)',
      category: 'structure',
      specs: 'Laser-Cut High-Impact Acrylic, Pre-Drilled M3 Grid, Omnidirectional Ball Caster',
      desc: 'The mechanical foundation of the two-wheel differential drive rover, supporting motors, battery holder, Uno board, and sensors.',
      safetyTip: 'Do not overtighten M3 acrylic mounting screws to avoid cracking the chassis plate.'
    },
    {
      id: 'wires',
      name: 'Male-to-Male Dupont Jumper Wires',
      role: 'Electrical Nervous System',
      category: 'power',
      specs: '24 AWG Multi-Strand Flexible Copper, Molded Dupont Pins, Color-Coded Insulation',
      desc: 'Flexible cables that route power, ground, and sensor/actuator logic signals between the Arduino headers and breadboard tie-points.',
      safetyTip: 'Color-code your wiring habits: Red for +5V power, Black for Ground (0V GND), and Yellow/Green for signals.'
    }
  ];

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
  // -----------------------------------------------------------------
  // 19. invent_helper_sim (Explorer 04)
  // -----------------------------------------------------------------
  const [helperSensor, setHelperSensor] = useState<'camera' | 'sound' | 'touch' | 'temp'>('touch');
  const [helperRule, setHelperRule] = useState<'bump' | 'dark' | 'loud' | 'hot'>('bump');
  const [helperActuator, setHelperActuator] = useState<'wheels' | 'lights' | 'buzzer' | 'arm'>('wheels');
  const [helperTriggered, setHelperTriggered] = useState<boolean>(false);

  // -----------------------------------------------------------------
  // 20. breadboard_circuit_sim (Beginner 02)
  // -----------------------------------------------------------------
  const [bbResistor, setBbResistor] = useState<number>(220);
  const [bbBtnPressed, setBbBtnPressed] = useState<boolean>(false);

  // -----------------------------------------------------------------
  // 21. sensor_observatory_sim (Beginner 04)
  // -----------------------------------------------------------------
  const [obsSensor, setObsSensor] = useState<'pot' | 'ldr'>('pot');
  const [obsPotAngle, setObsPotAngle] = useState<number>(50);
  const [obsLux, setObsLux] = useState<number>(300);

  // -----------------------------------------------------------------
  // 22. reaction_game_sim (Beginner 05)
  // -----------------------------------------------------------------
  const [rxState, setRxState] = useState<'idle' | 'waiting' | 'ready' | 'finished' | 'early'>('idle');
  const [rxStartTime, setRxStartTime] = useState<number>(0);
  const [rxTime, setRxTime] = useState<number | null>(null);
  const [rxBestTime, setRxBestTime] = useState<number | null>(null);

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

      {/* CLASS 09: OBSTACLE-AVOIDING ROVER SIMULATOR */}
      {type === 'obstacle_avoiding_rover_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '520px' }}>
              {/* Arena top-down view */}
              <div style={{
                background: '#090e18',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Top-Down Arena View (Simulation)
                </div>
                {/* Rover and obstacle visual */}
                <div style={{ position: 'relative', width: '300px', height: '80px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center' }}>
                  {/* Rover */}
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    width: '44px',
                    height: '44px',
                    background: roverIsBlocked && roverRunning ? '#6B0F24' : roverRunning ? '#1e3a5f' : '#1e293b',
                    border: `2px solid ${roverMotorState.color}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    transition: 'border-color 0.3s'
                  }}>🤖</div>
                  {/* Sonar beam */}
                  <div style={{
                    position: 'absolute',
                    left: '56px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: `${Math.min(roverObstacleDist * 2, 220)}px`,
                    height: '2px',
                    background: roverIsBlocked ? '#ef4444' : '#38bdf8',
                    opacity: 0.6,
                    transition: 'width 0.3s, background 0.3s'
                  }} />
                  {/* Obstacle */}
                  <div style={{
                    position: 'absolute',
                    left: `${Math.min(64 + roverObstacleDist * 2, 255)}px`,
                    width: '30px',
                    height: '60px',
                    background: '#374151',
                    border: '2px solid #6b7280',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#9ca3af'
                  }}>📦</div>
                </div>

                {/* Distance slider */}
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Move Obstacle (Static Foam/Cardboard Prop):</span>
                    <span style={{ fontWeight: 800, color: roverIsBlocked ? '#ef4444' : '#38bdf8' }}>{roverObstacleDist} cm</span>
                  </div>
                  <input
                    type="range" min={5} max={60} step={1}
                    value={roverObstacleDist}
                    onChange={e => setRoverObstacleDist(Number(e.target.value))}
                    className={styles.slider}
                    aria-label="Obstacle distance in cm"
                  />
                </div>
              </div>

              {/* If/else decision box */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px' }}>{'// Arduino avoidance logic (running in sketch):'}</div>
                <div style={{ color: roverObstacleDist <= roverThreshold ? '#f87171' : '#64748b' }}>
                  <span style={{ color: '#38bdf8' }}>if</span> (distance &lt;= {roverThreshold}) &#123; <span style={{ color: '#f87171' }}>{'// ← ' + (roverIsBlocked ? 'TRUE now' : 'false now')}</span>
                </div>
                <div style={{ paddingLeft: '1.2rem', color: roverIsBlocked ? '#fca5a5' : '#334155' }}>brake(); reverseLeft(); pivotRight();</div>
                <div style={{ color: '#64748b' }}>&#125; <span style={{ color: '#38bdf8' }}>else</span> &#123;</div>
                <div style={{ paddingLeft: '1.2rem', color: !roverIsBlocked ? '#86efac' : '#334155' }}>driveForward(); <span style={{ color: '#10b981' }}>{'// ← ' + (!roverIsBlocked ? 'TRUE now' : '')}</span></div>
                <div style={{ color: '#64748b' }}>&#125;</div>
              </div>

              {/* Motor state cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { label: 'Left Motor', val: roverMotorState.left },
                  { label: 'Right Motor', val: roverMotorState.right },
                  { label: 'HC-SR04', val: `${roverObstacleDist} cm` }
                ].map((card, i) => (
                  <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.65rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{card.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: roverMotorState.color, marginTop: '3px' }}>{card.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard} style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  setRoverRunning(r => !r);
                  if (!roverRunning) setRoverObstacleDist(45);
                }}
                className={`${styles.simBtn} ${roverRunning ? styles.simBtnRed : styles.simBtnGreen}`}
                style={{ width: '100%', padding: '0.8rem' }}
              >
                {roverRunning ? '⏹ Stop Rover' : '▶ Start Autonomous Run'}
              </button>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
                ⚠ Simulation only — does not control real hardware.
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${roverIsBlocked && roverRunning ? styles.statusDanger : roverRunning ? styles.statusSuccess : styles.statusNormal}`}>
            <Shield size={18} />
            <span>
              {!roverRunning && 'Press ▶ Start to simulate. Use the slider to move the static cardboard obstacle prop.'}
              {roverRunning && roverIsBlocked && `⛔ OBSTACLE at ${roverObstacleDist} cm ≤ ${roverThreshold} cm threshold → Braking & pivoting!`}
              {roverRunning && !roverIsBlocked && `✅ Path clear (${roverObstacleDist} cm) — driving forward. Move obstacle closer to test avoidance!`}
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

              {/* Autonomous Mini-Sumo Robot */}
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

      {/* 15. FLAGSHIP: ARDUINO BOARD TOUR SIM & CLASS 1 WORKBENCH */}
      {type === 'arduino_board_tour_sim' && (
        <>
          {/* Flagship Class 1 Multi-Tool Navigation Bar */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.4rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setC1ActiveTool('board_tour')}
              style={{
                background: c1ActiveTool === 'board_tour' ? '#6B0F24' : 'transparent',
                color: c1ActiveTool === 'board_tour' ? '#ffffff' : '#cbd5e1',
                border: c1ActiveTool === 'board_tour' ? '1px solid #8b1832' : '1px solid transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Cpu size={15} color="#F5B800" />
              1. Board Tour & Pinout
            </button>

            <button
              onClick={() => setC1ActiveTool('blink_sync')}
              style={{
                background: c1ActiveTool === 'blink_sync' ? '#6B0F24' : 'transparent',
                color: c1ActiveTool === 'blink_sync' ? '#ffffff' : '#cbd5e1',
                border: c1ActiveTool === 'blink_sync' ? '1px solid #8b1832' : '1px solid transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={15} color="#F5B800" />
              2. Synchronized Blink Lab
            </button>

            <button
              onClick={() => setC1ActiveTool('robot_or_not')}
              style={{
                background: c1ActiveTool === 'robot_or_not' ? '#6B0F24' : 'transparent',
                color: c1ActiveTool === 'robot_or_not' ? '#ffffff' : '#cbd5e1',
                border: c1ActiveTool === 'robot_or_not' ? '1px solid #8b1832' : '1px solid transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <HelpCircle size={15} color="#F5B800" />
              3. Robot or Not? Challenge
            </button>

            <button
              onClick={() => setC1ActiveTool('sense_decide_act')}
              style={{
                background: c1ActiveTool === 'sense_decide_act' ? '#6B0F24' : 'transparent',
                color: c1ActiveTool === 'sense_decide_act' ? '#ffffff' : '#cbd5e1',
                border: c1ActiveTool === 'sense_decide_act' ? '1px solid #8b1832' : '1px solid transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Activity size={15} color="#F5B800" />
              4. Sense-Decide-Act Explorer
            </button>

            <button
              onClick={() => setC1ActiveTool('parts_gallery')}
              style={{
                background: c1ActiveTool === 'parts_gallery' ? '#6B0F24' : 'transparent',
                color: c1ActiveTool === 'parts_gallery' ? '#ffffff' : '#cbd5e1',
                border: c1ActiveTool === 'parts_gallery' ? '1px solid #8b1832' : '1px solid transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Box size={15} color="#F5B800" />
              5. Robotics Hardware Gallery
            </button>
          </div>

          {/* SUB-VIEW 1: BOARD TOUR & PINOUT */}
          {c1ActiveTool === 'board_tour' && (
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

                    {/* BOTTOM LEFT: POWER HEADER */}
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
            </>
          )}

          {/* SUB-VIEW 2: SYNCHRONIZED BLINK CODE STEPPER & CIRCUIT LAB */}
          {c1ActiveTool === 'blink_sync' && (
            <div>
              {/* Circuit Mode & Preset Switchers */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setC1CircuitMode('builtin')}
                    style={{
                      background: c1CircuitMode === 'builtin' ? '#6B0F24' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: c1CircuitMode === 'builtin' ? '1px solid #8b1832' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Stage A: Built-in LED (Pin 13)
                  </button>
                  <button
                    onClick={() => setC1CircuitMode('breadboard')}
                    style={{
                      background: c1CircuitMode === 'breadboard' ? '#6B0F24' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: c1CircuitMode === 'breadboard' ? '1px solid #8b1832' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Stage B: External Breadboard Circuit (+220Ω Resistor)
                  </button>
                </div>

                {/* Pattern Presets */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setC1BlinkPattern('standard'); setC1HighMs(1000); setC1LowMs(1000); }}
                    style={{
                      background: c1BlinkPattern === 'standard' ? 'rgba(245,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                      color: c1BlinkPattern === 'standard' ? '#F5B800' : '#cbd5e1',
                      border: c1BlinkPattern === 'standard' ? '1px solid #F5B800' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Standard 1s / 1s
                  </button>
                  <button
                    onClick={() => { setC1BlinkPattern('heartbeat'); }}
                    style={{
                      background: c1BlinkPattern === 'heartbeat' ? 'rgba(245,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                      color: c1BlinkPattern === 'heartbeat' ? '#F5B800' : '#cbd5e1',
                      border: c1BlinkPattern === 'heartbeat' ? '1px solid #F5B800' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Heartbeat (lub-dub)
                  </button>
                  <button
                    onClick={() => { setC1BlinkPattern('sos'); }}
                    style={{
                      background: c1BlinkPattern === 'sos' ? 'rgba(245,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                      color: c1BlinkPattern === 'sos' ? '#F5B800' : '#cbd5e1',
                      border: c1BlinkPattern === 'sos' ? '1px solid #F5B800' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    SOS Maritime (··· --- ···)
                  </button>
                  <button
                    onClick={() => { setC1BlinkPattern('strobe'); setC1HighMs(100); setC1LowMs(100); }}
                    style={{
                      background: c1BlinkPattern === 'strobe' ? 'rgba(245,184,0,0.2)' : 'rgba(255,255,255,0.04)',
                      color: c1BlinkPattern === 'strobe' ? '#F5B800' : '#cbd5e1',
                      border: c1BlinkPattern === 'strobe' ? '1px solid #F5B800' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Fast Strobe (100ms)
                  </button>
                </div>
              </div>

              {/* Grid: Live Visualizer (Left) + Synchronized Code (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Visual Circuit Simulation Canvas */}
                <div style={{
                  background: '#080c14',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '280px',
                  position: 'relative'
                }}>
                  {/* Status Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: c1SyncLedOn ? 'rgba(245,184,0,0.15)' : 'rgba(100,116,139,0.15)',
                      color: c1SyncLedOn ? '#F5B800' : '#94a3b8',
                      border: c1SyncLedOn ? '1px solid #F5B800' : '1px solid #64748b',
                      borderRadius: '20px',
                      padding: '0.2rem 0.65rem'
                    }}>
                      {c1SyncLedOn ? '⚡ PIN 13: 5.0V HIGH (ON)' : '💤 PIN 13: 0.0V LOW (OFF)'}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {c1CircuitMode === 'builtin' ? 'Onboard SMD LED "L"' : 'Series Breadboard Circuit'}
                    </span>
                  </div>

                  {c1CircuitMode === 'builtin' ? (
                    /* Built-in LED Visual Graphic */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '14px',
                        background: c1SyncLedOn ? 'radial-gradient(circle, #F5B800 20%, #d97706 70%, #78350f 100%)' : '#1e293b',
                        border: '3px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: c1SyncLedOn ? '0 0 40px #F5B800, inset 0 0 15px #fff' : 'none',
                        transition: 'all 0.1s ease',
                        position: 'relative'
                      }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: c1SyncLedOn ? '#0f172a' : '#475569' }}>L</span>
                        {c1SyncLedOn && (
                          <div style={{
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'rgba(245, 184, 0, 0.15)',
                            pointerEvents: 'none',
                            animation: 'pulse 1s infinite'
                          }} />
                        )}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>Onboard SMD LED & Resistor Path</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Wired internally between Pin 13 and Ground via PCB trace. Zero external wires needed!</div>
                      </div>
                    </div>
                  ) : (
                    /* Breadboard External LED + Resistor Graphic */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '380px',
                        padding: '1rem',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        gap: '0.5rem'
                      }}>
                        {/* Pin 13 Terminal */}
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Arduino</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F5B800' }}>PIN 13</div>
                          <div style={{ fontSize: '0.65rem', color: c1SyncLedOn ? '#10b981' : '#64748b' }}>
                            {c1SyncLedOn ? '+5.0V DC' : '0.0V'}
                          </div>
                        </div>

                        {/* Yellow Jumper */}
                        <div style={{
                          height: '4px',
                          flex: 0.8,
                          background: c1SyncLedOn ? '#F5B800' : '#334155',
                          boxShadow: c1SyncLedOn ? '0 0 8px #F5B800' : 'none'
                        }} />

                        {/* 220 Ohm Resistor */}
                        <div style={{ textAlign: 'center', flex: 1.2, background: 'rgba(255,255,255,0.03)', padding: '0.35rem', borderRadius: '6px', border: '1px solid #475569' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Resistor</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171' }}>220 Ω</div>
                          <div style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Drops 3.0V</div>
                        </div>

                        {/* Red Wire */}
                        <div style={{
                          height: '4px',
                          flex: 0.8,
                          background: c1SyncLedOn ? '#ef4444' : '#334155',
                          boxShadow: c1SyncLedOn ? '0 0 8px #ef4444' : 'none'
                        }} />

                        {/* 5mm LED */}
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            margin: '0 auto 0.25rem',
                            borderRadius: '50%',
                            background: c1SyncLedOn ? '#ef4444' : '#334155',
                            boxShadow: c1SyncLedOn ? '0 0 20px #ef4444, inset 0 0 6px #fff' : 'none',
                            transition: 'all 0.1s ease'
                          }} />
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f1f5f9' }}>5mm LED</div>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>13.6 mA</div>
                        </div>

                        {/* Black Return Wire */}
                        <div style={{
                          height: '4px',
                          flex: 0.8,
                          background: c1SyncLedOn ? '#38bdf8' : '#334155'
                        }} />

                        {/* GND Terminal */}
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Arduino</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>GND</div>
                          <div style={{ fontSize: '0.65rem', color: '#64748b' }}>0.0V Ref</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                        Ohm’s Law Verification: (5.0V − 2.0V LED drop) ÷ 220Ω = <strong>13.6 mA</strong> safe forward current.
                      </div>
                    </div>
                  )}

                  {/* Dual Timing Sliders (when in standard/custom mode) */}
                  <div style={{ width: '100%', marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        <span>ON (HIGH) Time</span>
                        <strong style={{ color: '#F5B800' }}>{c1HighMs} ms</strong>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={c1HighMs}
                        onChange={(e) => { setC1HighMs(Number(e.target.value)); setC1BlinkPattern('standard'); }}
                        style={{ width: '100%', accentColor: '#F5B800', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        <span>OFF (LOW) Time</span>
                        <strong style={{ color: '#38bdf8' }}>{c1LowMs} ms</strong>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={c1LowMs}
                        onChange={(e) => { setC1LowMs(Number(e.target.value)); setC1BlinkPattern('standard'); }}
                        style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Synchronized C++ Code Stepper View */}
                <div style={{
                  background: '#0d1322',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Zap size={16} color="#F5B800" /> Live Synchronized Execution
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>Blink.ino</span>
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: '1.7', flex: 1 }}>
                    <div style={{ color: '#64748b' }}>// 1. Hardware Initialization (Runs once)</div>
                    <div style={{ color: '#94a3b8' }}>void setup() &#123;</div>
                    <div style={{ color: '#a5f3fc', paddingLeft: '1rem' }}>
                      pinMode(LED_BUILTIN, OUTPUT);
                    </div>
                    <div style={{ color: '#94a3b8' }}>&#125;</div>
                    <br />
                    <div style={{ color: '#64748b' }}>// 2. Main Logic Loop (Repeats forever)</div>
                    <div style={{ color: '#94a3b8' }}>void loop() &#123;</div>

                    {/* Line: HIGH */}
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: c1SyncLedOn ? 'rgba(245, 184, 0, 0.2)' : 'transparent',
                      color: c1SyncLedOn ? '#F5B800' : '#e2e8f0',
                      fontWeight: c1SyncLedOn ? 800 : 400,
                      borderLeft: c1SyncLedOn ? '3px solid #F5B800' : '3px solid transparent',
                      transition: 'all 0.1s ease'
                    }}>
                      &nbsp;&nbsp;digitalWrite(LED_BUILTIN, HIGH); <span style={{ color: '#64748b', fontSize: '0.75rem' }}>// 5V ON</span>
                    </div>

                    {/* Line: Delay HIGH */}
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: c1SyncLedOn ? '#F5B800' : '#64748b',
                      fontSize: '0.82rem'
                    }}>
                      &nbsp;&nbsp;delay({c1BlinkPattern === 'heartbeat' ? '120' : c1BlinkPattern === 'sos' ? '150/500' : c1HighMs}); <span style={{ color: '#64748b', fontSize: '0.75rem' }}>// Wait</span>
                    </div>

                    {/* Line: LOW */}
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: !c1SyncLedOn ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: !c1SyncLedOn ? '#38bdf8' : '#e2e8f0',
                      fontWeight: !c1SyncLedOn ? 800 : 400,
                      borderLeft: !c1SyncLedOn ? '3px solid #38bdf8' : '3px solid transparent',
                      transition: 'all 0.1s ease'
                    }}>
                      &nbsp;&nbsp;digitalWrite(LED_BUILTIN, LOW);  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>// 0V OFF</span>
                    </div>

                    {/* Line: Delay LOW */}
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: !c1SyncLedOn ? '#38bdf8' : '#64748b',
                      fontSize: '0.82rem'
                    }}>
                      &nbsp;&nbsp;delay({c1BlinkPattern === 'heartbeat' ? '700' : c1BlinkPattern === 'sos' ? '150/1200' : c1LowMs}); <span style={{ color: '#64748b', fontSize: '0.75rem' }}>// Wait</span>
                    </div>

                    <div style={{ color: '#94a3b8' }}>&#125;</div>
                  </div>

                  {/* Predict Modify Test Challenge Card */}
                  <div style={{
                    marginTop: '1rem',
                    background: 'rgba(245, 184, 0, 0.08)',
                    border: '1px solid rgba(245, 184, 0, 0.25)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5B800', marginBottom: '0.25rem' }}>
                      🎯 Predict → Modify → Test Protocol:
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#fef3c7', lineHeight: '1.4' }}>
                      1. <strong>Predict:</strong> If you change <code>delay(1000)</code> to <code>delay(100)</code>, will the light flash 10 times faster or 10 times slower?<br />
                      2. <strong>Modify:</strong> Adjust the sliders or choose a pattern above.<br />
                      3. <strong>Test:</strong> Observe how asymmetric ON/OFF timings create realistic airport or lighthouse warning beacons!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: "ROBOT OR NOT?" CHALLENGE */}
          {c1ActiveTool === 'robot_or_not' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f1f5f9' }}>
                    🤖 "Robot or Not?" Engineering Sorting Challenge
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    Does automatic behavior make something a true robot? Evaluate each machine against the Sense → Decide → Act closed feedback loop.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: 'rgba(245,184,0,0.15)',
                    color: '#F5B800',
                    border: '1px solid rgba(245,184,0,0.3)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px'
                  }}>
                    Classified: {Object.keys(c1RonAnswers).length} / {CLASS_1_ROBOT_OR_NOT_ITEMS.length}
                  </span>
                  <button
                    onClick={() => setC1RonAnswers({})}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Challenge
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {CLASS_1_ROBOT_OR_NOT_ITEMS.map((item) => {
                  const userAnswer = c1RonAnswers[item.id];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === item.category;

                  return (
                    <div key={item.id} style={{
                      background: '#0d1322',
                      border: isAnswered 
                        ? (isCorrect ? '1px solid #10b981' : '1px solid #ef4444')
                        : '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f1f5f9' }}>{item.name}</div>
                          {isAnswered && (
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: isCorrect ? '#10b981' : '#f87171'
                            }}>
                              {isCorrect ? '✓ Correct Verdict!' : '✗ Engineering Misconception'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vote Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
                        <button
                          onClick={() => setC1RonAnswers(prev => ({ ...prev, [item.id]: 'robot' }))}
                          style={{
                            background: userAnswer === 'robot' ? '#10b981' : 'rgba(255,255,255,0.04)',
                            color: userAnswer === 'robot' ? '#042f2e' : '#cbd5e1',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.2rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🤖 Robot
                        </button>
                        <button
                          onClick={() => setC1RonAnswers(prev => ({ ...prev, [item.id]: 'automated' }))}
                          style={{
                            background: userAnswer === 'automated' ? '#f59e0b' : 'rgba(255,255,255,0.04)',
                            color: userAnswer === 'automated' ? '#451a03' : '#cbd5e1',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.2rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⚙️ Automated
                        </button>
                        <button
                          onClick={() => setC1RonAnswers(prev => ({ ...prev, [item.id]: 'tool' }))}
                          style={{
                            background: userAnswer === 'tool' ? '#38bdf8' : 'rgba(255,255,255,0.04)',
                            color: userAnswer === 'tool' ? '#082f49' : '#cbd5e1',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.2rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🪛 Tool
                        </button>
                      </div>

                      {/* Explanation Reveal */}
                      {isAnswered && (
                        <div style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '6px',
                          padding: '0.5rem 0.65rem',
                          fontSize: '0.74rem',
                          lineHeight: '1.45',
                          color: '#cbd5e1'
                        }}>
                          <div style={{ fontWeight: 800, color: '#F5B800', marginBottom: '0.2rem' }}>
                            {item.verdict}:
                          </div>
                          {item.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: SENSE → DECIDE → ACT EXPLORER */}
          {c1ActiveTool === 'sense_decide_act' && (
            <div>
              {/* Domain Switcher */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {SDA_DOMAINS.map((dom) => (
                  <button
                    key={dom.id}
                    onClick={() => { setC1SdaDomain(dom.id); setC1SdaValue(dom.threshold - 5); }}
                    style={{
                      background: c1SdaDomain === dom.id ? '#6B0F24' : 'rgba(255,255,255,0.05)',
                      color: c1SdaDomain === dom.id ? '#ffffff' : '#cbd5e1',
                      border: c1SdaDomain === dom.id ? '1px solid #8b1832' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{dom.icon}</span>
                    <span>{dom.title.split('(')[0].trim()}</span>
                  </button>
                ))}
              </div>

              {/* Active Domain Visualizer */}
              {(() => {
                const curDom = SDA_DOMAINS.find(d => d.id === c1SdaDomain) || SDA_DOMAINS[0];
                const triggered = curDom.isTriggered(c1SdaValue);

                return (
                  <div>
                    {/* 3-Stage Diagram: SENSE ➔ DECIDE ➔ ACT */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.25rem'
                    }}>
                      {/* SENSE BLOCK */}
                      <div style={{
                        background: '#0d1322',
                        border: '1px solid #38bdf8',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', marginBottom: '0.5rem' }}>
                          <Eye size={28} color="#38bdf8" />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                          STEP 1: SENSE
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', marginTop: '0.25rem' }}>
                          {curDom.sensorName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          {curDom.sensorType}
                        </div>
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.4rem 0.75rem',
                          background: 'rgba(56, 189, 248, 0.15)',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#38bdf8'
                        }}>
                          {c1SdaValue} {curDom.unit}
                        </div>
                      </div>

                      {/* DECIDE BLOCK */}
                      <div style={{
                        background: '#0d1322',
                        border: '1px solid #F5B800',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', background: 'rgba(245, 184, 0, 0.1)', marginBottom: '0.5rem' }}>
                          <Cpu size={28} color="#F5B800" />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5B800', letterSpacing: '0.05em' }}>
                          STEP 2: DECIDE
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', marginTop: '0.25rem' }}>
                          {curDom.brainName}
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '0.72rem',
                          color: '#cbd5e1',
                          background: '#030712',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          marginTop: '0.4rem',
                          border: '1px solid #334155'
                        }}>
                          {curDom.brainRule}
                        </div>
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.4rem 0.75rem',
                          background: triggered ? 'rgba(245, 184, 0, 0.2)' : 'rgba(100, 116, 139, 0.15)',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: triggered ? '#F5B800' : '#94a3b8'
                        }}>
                          {curDom.decisionState}
                        </div>
                      </div>

                      {/* ACT BLOCK */}
                      <div style={{
                        background: '#0d1322',
                        border: triggered ? '1px solid #10b981' : '1px solid #64748b',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', background: triggered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.1)', marginBottom: '0.5rem' }}>
                          <Zap size={28} color={triggered ? '#10b981' : '#64748b'} />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: triggered ? '#10b981' : '#94a3b8', letterSpacing: '0.05em' }}>
                          STEP 3: ACT
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', marginTop: '0.25rem' }}>
                          {curDom.actuatorName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          Physical Electromechanical Response
                        </div>
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.4rem 0.75rem',
                          background: triggered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.15)',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: triggered ? '#10b981' : '#94a3b8'
                        }}>
                          {curDom.actuatorAction}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Input Slider Card */}
                    <div style={{
                      background: '#080c14',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
                        <span>Simulate Environmental Input ({curDom.sensorName}):</span>
                        <span style={{ color: '#F5B800', fontWeight: 800 }}>{c1SdaValue} {curDom.unit}</span>
                      </div>
                      <input
                        type="range"
                        min={curDom.minVal}
                        max={curDom.maxVal}
                        value={c1SdaValue}
                        onChange={(e) => setC1SdaValue(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#F5B800', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                        <span>Min: {curDom.minVal} {curDom.unit}</span>
                        <span>Decision Threshold: {curDom.threshold} {curDom.unit}</span>
                        <span>Max: {curDom.maxVal} {curDom.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SUB-VIEW 5: ROBOTICS HARDWARE PARTS GALLERY */}
          {c1ActiveTool === 'parts_gallery' && (
            <div>
              {/* Category Filter */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {(['all', 'brain', 'sense', 'act', 'power', 'structure'] as PartsCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setC1PartsFilter(cat)}
                    style={{
                      background: c1PartsFilter === cat ? '#6B0F24' : 'rgba(255,255,255,0.05)',
                      color: c1PartsFilter === cat ? '#ffffff' : '#cbd5e1',
                      border: c1PartsFilter === cat ? '1px solid #8b1832' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {cat === 'all' ? 'All 10 Core Parts' : `${cat} Subsystem`}
                  </button>
                ))}
              </div>

              {/* Parts Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {ROBOTICS_PARTS_GALLERY
                  .filter(p => c1PartsFilter === 'all' || p.category === c1PartsFilter)
                  .map((part) => (
                    <div
                      key={part.id}
                      onClick={() => setC1SelectedPart(part.id)}
                      style={{
                        background: c1SelectedPart === part.id ? 'rgba(107, 15, 36, 0.25)' : '#0d1322',
                        border: c1SelectedPart === part.id ? '2px solid #F5B800' : '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: 'rgba(245,184,0,0.15)',
                          color: '#F5B800',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {part.role}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>
                          {part.category}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f1f5f9', margin: '0.25rem 0' }}>
                        {part.name}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                        {part.specs}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.45', margin: '0 0 0.5rem' }}>
                        {part.desc}
                      </p>

                      <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.55rem',
                        fontSize: '0.7rem',
                        color: '#fca5a5',
                        lineHeight: '1.35'
                      }}>
                        <strong>Lab Safety:</strong> {part.safetyTip}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className={`${styles.statusBanner} ${styles.statusNormal}`} style={{ marginTop: '1.25rem' }}>
            <Info size={18} />
            <span>
              Class 01 Flagship Workbench: Switch between the 5 interactive tools above to explore the Uno pinout, test the synchronized C++ blink stepper, solve the "Robot or Not?" challenge, explore real-world Sense-Decide-Act systems, and inspect all hardware kit parts!
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

      {/* 19. INVENT HELPER SIM (Explorer 04) */}
      {type === 'invent_helper_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '520px' }}>
              <div style={{
                width: '160px',
                height: '130px',
                background: '#161B26',
                border: '2px solid #F5B800',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: helperTriggered ? '0 0 25px rgba(245, 184, 0, 0.4)' : 'none',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '40px' }}>
                  {helperActuator === 'wheels' ? '🏎️' : helperActuator === 'lights' ? '💡' : helperActuator === 'buzzer' ? '📢' : '🦾'}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B800', marginTop: '4px' }}>
                  HelperBot 3000
                </div>
                <div style={{ fontSize: '0.68rem', color: helperTriggered ? '#10b981' : '#94a3b8' }}>
                  {helperTriggered ? '⚡ ACTION TRIGGERED!' : 'Listening for input...'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', width: '100%' }}>
                <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800 }}>1. SENSE (Input)</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
                    {helperSensor === 'touch' ? 'Touch Bumper' : helperSensor === 'camera' ? 'Vision Camera' : helperSensor === 'sound' ? 'Microphone' : 'Temp Sensor'}
                  </div>
                </div>
                <div style={{ background: '#1e293b', border: '1px solid #F5B800', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#F5B800', fontWeight: 800 }}>2. DECIDE (Brain)</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
                    {helperRule === 'bump' ? 'If bumped' : helperRule === 'dark' ? 'If dark room' : helperRule === 'loud' ? 'If sound heard' : 'If room is hot'}
                  </div>
                </div>
                <div style={{ background: '#1e293b', border: '1px solid #10b981', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800 }}>3. ACT (Output)</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
                    {helperActuator === 'wheels' ? 'Drive Forward' : helperActuator === 'lights' ? 'Flash LEDs' : helperActuator === 'buzzer' ? 'Sound Alarm' : 'Lift Gripper'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Step 1: Choose Sensor</span></div>
              <div className={styles.btnGroup}>
                {[
                  { id: 'touch', label: 'Bumper' },
                  { id: 'camera', label: 'Camera' },
                  { id: 'sound', label: 'Mic' },
                  { id: 'temp', label: 'Temp' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setHelperSensor(s.id as 'camera' | 'sound' | 'touch' | 'temp'); setHelperTriggered(false); }}
                    className={`${styles.simBtn} ${helperSensor === s.id ? styles.simBtnCyan : ''}`}
                    style={{ flex: 1 }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Step 2: Choose Rule</span></div>
              <div className={styles.btnGroup}>
                {[
                  { id: 'bump', label: 'On Bump' },
                  { id: 'dark', label: 'On Dark' },
                  { id: 'loud', label: 'On Noise' },
                  { id: 'hot', label: 'On Heat' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setHelperRule(r.id as 'bump' | 'dark' | 'loud' | 'hot'); setHelperTriggered(false); }}
                    className={`${styles.simBtn} ${helperRule === r.id ? styles.simBtnAmber : ''}`}
                    style={{ flex: 1 }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Step 3: Choose Output</span></div>
              <div className={styles.btnGroup}>
                {[
                  { id: 'wheels', label: 'Wheels' },
                  { id: 'lights', label: 'Lights' },
                  { id: 'buzzer', label: 'Alarm' },
                  { id: 'arm', label: 'Arm' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setHelperActuator(a.id as 'wheels' | 'lights' | 'buzzer' | 'arm'); setHelperTriggered(false); }}
                    className={`${styles.simBtn} ${helperActuator === a.id ? styles.simBtnGreen : ''}`}
                    style={{ flex: 1 }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => {
                setHelperTriggered(true);
                setTimeout(() => setHelperTriggered(false), 2500);
              }}
              className={`${styles.simBtn} ${styles.simBtnGreen}`}
              style={{ width: '100%', padding: '0.75rem', fontWeight: 800 }}
            >
              ▶ Test Your Helper Robot!
            </button>
          </div>

          <div className={`${styles.statusBanner} ${helperTriggered ? styles.statusSuccess : styles.statusNormal}`}>
            <CheckCircle size={18} />
            <span>
              {helperTriggered
                ? `SUCCESS: Sensed "${helperSensor}" ➔ Brain evaluated "${helperRule}" ➔ Actuator activated: "${helperActuator}"!`
                : 'Select your robot’s sensor, decision rule, and output actuator, then press Test!'}
            </span>
          </div>
        </>
      )}

      {/* 20. BREADBOARD CIRCUIT & RESISTOR SIM (Beginner 02) */}
      {type === 'breadboard_circuit_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '520px' }}>
              <div style={{
                width: '100%',
                background: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1rem',
                color: '#1e293b',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '1px' }}>SOLDERLESS BREADBOARD TERMINAL STRIP</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: bbResistor === 0 && bbBtnPressed ? '#ef4444' : '#0284c7' }}>
                    {bbResistor === 0 && bbBtnPressed ? '💥 LED BURNT OUT!' : bbBtnPressed ? '⚡ CIRCUIT CLOSED' : '⭕ CIRCUIT OPEN'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ height: '6px', flex: 1, background: '#ef4444', borderRadius: '3px' }} title="+5V Bus Rail" />
                  <div style={{ height: '6px', flex: 1, background: '#0284c7', borderRadius: '3px' }} title="GND Bus Rail" />
                </div>

                <div style={{
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: `2px solid ${bbBtnPressed ? '#10b981' : '#cbd5e1'}` }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Pushbutton</div>
                    <div style={{ fontSize: '1.2rem', margin: '4px 0' }}>{bbBtnPressed ? '🔘' : '⚪'}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: bbBtnPressed ? '#10b981' : '#64748b' }}>
                      {bbBtnPressed ? 'PRESSED' : 'OPEN'}
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: `2px solid ${bbResistor === 0 ? '#ef4444' : '#F5B800'}` }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Resistor (R)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', margin: '6px 0' }}>
                      {bbResistor === 0 ? '0 Ω (Wire)' : `${bbResistor} Ω`}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: bbResistor === 220 ? '#10b981' : '#64748b' }}>
                      {bbResistor === 220 ? 'Optimal' : bbResistor === 0 ? 'DANGER' : 'High Ohm'}
                    </div>
                  </div>

                  <div style={{
                    background: '#fff',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `2px solid ${bbResistor === 0 && bbBtnPressed ? '#ef4444' : bbBtnPressed ? '#10b981' : '#cbd5e1'}`
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>5mm LED</div>
                    <div style={{
                      fontSize: '1.4rem',
                      margin: '2px 0',
                      filter: bbBtnPressed && bbResistor > 0 ? 'drop-shadow(0 0 8px #ef4444)' : 'none'
                    }}>
                      {bbResistor === 0 && bbBtnPressed ? '💥' : bbBtnPressed ? '🔴' : '⚫'}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: bbBtnPressed && bbResistor > 0 ? '#dc2626' : '#64748b' }}>
                      {bbResistor === 0 && bbBtnPressed ? 'DESTROYED' : bbBtnPressed ? 'LIT UP' : 'OFF'}
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Current (I)</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: bbResistor === 0 && bbBtnPressed ? '#ef4444' : bbBtnPressed ? '#0284c7' : '#64748b',
                      margin: '6px 0'
                    }}>
                      {!bbBtnPressed ? '0.0 mA' : bbResistor === 0 ? 'OVERLOAD!' : `${((3.0 / bbResistor) * 1000).toFixed(1)} mA`}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>I = (V - Vf) / R</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Switch State</span></div>
              <button
                onClick={() => setBbBtnPressed(p => !p)}
                className={`${styles.simBtn} ${bbBtnPressed ? styles.simBtnGreen : ''}`}
                style={{ width: '100%', padding: '0.65rem', fontWeight: 800 }}
              >
                {bbBtnPressed ? 'Release Switch' : 'Press Switch (Close Circuit)'}
              </button>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Select Resistor Value</span></div>
              <div className={styles.btnGroup}>
                {[220, 1000, 10000, 0].map(r => (
                  <button
                    key={r}
                    onClick={() => setBbResistor(r)}
                    className={`${styles.simBtn} ${bbResistor === r ? (r === 0 ? styles.simBtnRed : styles.simBtnAmber) : ''}`}
                    style={{ flex: 1 }}
                  >
                    {r === 0 ? '0 Ω (None!)' : `${r >= 1000 ? r/1000 + 'k' : r} Ω`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${bbResistor === 0 && bbBtnPressed ? styles.statusDanger : bbBtnPressed ? styles.statusSuccess : styles.statusNormal}`}>
            <AlertTriangle size={18} />
            <span>
              {bbResistor === 0 && bbBtnPressed
                ? '💥 CATASTROPHIC FAILURE: Without a current-limiting resistor, excessive current instantly burned out the LED!'
                : bbBtnPressed && bbResistor === 220
                ? '✅ OPTIMAL: 220Ω resistor safely limits current to ~13.6 mA. LED glows bright with zero overheating.'
                : bbBtnPressed && bbResistor > 1000
                ? 'ℹ HIGH RESISTANCE: Current is restricted to < 3mA. LED is safe but glows very dimly.'
                : 'Click "Press Switch" to close the circuit and watch current flow through the breadboard.'}
            </span>
          </div>
        </>
      )}

      {/* 21. SENSOR OBSERVATORY & VOLTAGE DIVIDER SIM (Beginner 04) */}
      {type === 'sensor_observatory_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '520px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', width: '100%' }}>
                <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Arduino ADC Reading (Pin A0)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {obsSensor === 'pot' ? Math.round((obsPotAngle / 100) * 1023) : Math.round((obsLux / 1000) * 1023)}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 1023 (10-bit)</span>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#F5B800' }}>
                    Analog Voltage: <strong>{((obsSensor === 'pot' ? (obsPotAngle / 100) : (obsLux / 1000)) * 5.0).toFixed(2)} V</strong>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                    analogRead(A0) = (Vout / 5.0V) * 1023
                  </div>
                </div>

                <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '2.2rem' }}>
                    {obsSensor === 'pot' ? '🎛️' : '☀️'}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9', marginTop: '6px' }}>
                    {obsSensor === 'pot' ? `Knob: ${obsPotAngle}%` : `Light: ${obsLux} Lux`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {obsSensor === 'pot' ? 'Potentiometer Wiper' : 'LDR Photoresistor'}
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', background: '#050811', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#86efac' }}>
                <div style={{ color: '#64748b', marginBottom: '4px' }}>{'// Serial Monitor (9600 baud):'}</div>
                <div>[SERIAL] PIN A0 RAW: {obsSensor === 'pot' ? Math.round((obsPotAngle / 100) * 1023) : Math.round((obsLux / 1000) * 1023)} | VOLTS: {((obsSensor === 'pot' ? (obsPotAngle / 100) : (obsLux / 1000)) * 5.0).toFixed(2)}V</div>
                <div style={{ color: '#94a3b8' }}>[SERIAL] Condition: {((obsSensor === 'pot' ? (obsPotAngle / 100) : (obsLux / 1000)) * 1023) > 512 ? 'HIGH (>= 2.5V)' : 'LOW (< 2.5V)'}</div>
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard}>
              <div className={styles.controlLabel}><span>Sensor Module</span></div>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => setObsSensor('pot')}
                  className={`${styles.simBtn} ${obsSensor === 'pot' ? styles.simBtnCyan : ''}`}
                  style={{ flex: 1 }}
                >
                  Potentiometer
                </button>
                <button
                  onClick={() => setObsSensor('ldr')}
                  className={`${styles.simBtn} ${obsSensor === 'ldr' ? styles.simBtnAmber : ''}`}
                  style={{ flex: 1 }}
                >
                  LDR (Light)
                </button>
              </div>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlLabel}>
                <span>{obsSensor === 'pot' ? 'Turn Potentiometer Knob' : 'Ambient Light Level'}</span>
                <span>{obsSensor === 'pot' ? `${obsPotAngle}%` : `${obsLux} Lux`}</span>
              </div>
              {obsSensor === 'pot' ? (
                <input
                  type="range" min={0} max={100} step={1}
                  value={obsPotAngle}
                  onChange={e => setObsPotAngle(Number(e.target.value))}
                  className={styles.slider}
                  aria-label="Potentiometer angle"
                />
              ) : (
                <input
                  type="range" min={10} max={1000} step={10}
                  value={obsLux}
                  onChange={e => setObsLux(Number(e.target.value))}
                  className={styles.slider}
                  aria-label="Light lux level"
                />
              )}
            </div>
          </div>

          <div className={`${styles.statusBanner} ${styles.statusNormal}`}>
            <Info size={18} />
            <span>
              Notice how the Arduino analog-to-digital converter (ADC) quantizes smooth real-world voltages into integers from 0 to 1023.
            </span>
          </div>
        </>
      )}

      {/* 22. REACTION TIME GAME SIM (Beginner 05) */}
      {type === 'reaction_game_sim' && (
        <>
          <div className={styles.canvasBox}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '520px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: rxState === 'ready' ? '#10b981' : rxState === 'waiting' ? '#f59e0b' : rxState === 'early' ? '#ef4444' : '#1e293b',
                border: '4px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: rxState === 'ready' ? '0 0 40px #10b981' : rxState === 'waiting' ? '0 0 25px #f59e0b' : 'none',
                transition: 'all 0.15s'
              }}>
                <span style={{ fontSize: '28px' }}>
                  {rxState === 'ready' ? '🟢' : rxState === 'waiting' ? '🟡' : rxState === 'early' ? '❌' : '⚪'}
                </span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {rxState === 'idle' && 'Click Start Game to Test Reflexes'}
                  {rxState === 'waiting' && 'Wait for GREEN... Do not click early!'}
                  {rxState === 'ready' && 'CLICK THE BUTTON NOW!'}
                  {rxState === 'finished' && 'Measured Reaction Time:'}
                  {rxState === 'early' && 'FALSE START! Clicked before green light.'}
                </div>
                {rxState === 'finished' && rxTime !== null && (
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: rxTime < 250 ? '#10b981' : rxTime < 350 ? '#38bdf8' : '#f59e0b', margin: '4px 0' }}>
                    {rxTime} ms
                  </div>
                )}
                {rxBestTime !== null && (
                  <div style={{ fontSize: '0.75rem', color: '#F5B800', marginTop: '2px' }}>
                    🏆 Best Time: {rxBestTime} ms
                  </div>
                )}
              </div>

              <div style={{ width: '100%', background: '#050811', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span style={{ color: '#38bdf8' }}>while</span> (digitalRead(PIN_BTN) == HIGH) &#123; <span style={{ color: '#64748b' }}>{'// wait for click'}</span> &#125;<br/>
                <span style={{ color: '#F5B800' }}>unsigned long</span> reaction = millis() - lightTurnOnTime;
              </div>
            </div>
          </div>

          <div className={styles.controlGrid}>
            <div className={styles.controlCard} style={{ textAlign: 'center' }}>
              {rxState === 'idle' || rxState === 'finished' || rxState === 'early' ? (
                <button
                  onClick={() => {
                    setRxState('waiting');
                    setRxTime(null);
                    const randomDelay = 1200 + Math.random() * 2500;
                    setTimeout(() => {
                      setRxState(current => {
                        if (current === 'waiting') {
                          setRxStartTime(Date.now());
                          return 'ready';
                        }
                        return current;
                      });
                    }, randomDelay);
                  }}
                  className={`${styles.simBtn} ${styles.simBtnAmber}`}
                  style={{ width: '100%', padding: '0.85rem', fontWeight: 800, fontSize: '0.9rem' }}
                >
                  ▶ Start Reaction Test
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (rxState === 'waiting') {
                      setRxState('early');
                    } else if (rxState === 'ready') {
                      const elapsed = Date.now() - rxStartTime;
                      setRxTime(elapsed);
                      setRxBestTime(b => (b === null || elapsed < b ? elapsed : b));
                      setRxState('finished');
                    }
                  }}
                  className={`${styles.simBtn} ${rxState === 'ready' ? styles.simBtnGreen : styles.simBtnRed}`}
                  style={{ width: '100%', padding: '0.85rem', fontWeight: 800, fontSize: '1rem' }}
                >
                  🔴 PRESS BUTTON (Pin 2)
                </button>
              )}
            </div>
          </div>

          <div className={`${styles.statusBanner} ${rxState === 'ready' ? styles.statusSuccess : rxState === 'early' ? styles.statusDanger : styles.statusNormal}`}>
            <Activity size={18} />
            <span>
              {rxState === 'idle' && 'Tests program timing and human reaction response using millis() timestamp subtraction.'}
              {rxState === 'waiting' && 'Timer armed with a random delay. Keep your finger ready on the button!'}
              {rxState === 'ready' && 'GREEN ACTIVE! Button click triggers digitalRead() active LOW.'}
              {rxState === 'finished' && rxTime !== null && `Reaction recorded: ${rxTime} ms. ${rxTime < 250 ? 'Lightning reflexes! ⚡' : 'Solid reaction speed! 👍'}`}
              {rxState === 'early' && 'Early click detected: The if-condition checked the button before the light turned on.'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
