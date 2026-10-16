const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

function replaceLastTwoLessons(fileContent, newAdv11, newAdv12) {
  const startRegex = /\{\s*id:\s*['"]adv-11['"][\s\S]*?\n\];/;
  if (!startRegex.test(fileContent)) {
    throw new Error('Could not find adv-11 to end of array block');
  }
  return fileContent.replace(startRegex, newAdv11.trim() + ',\n\n  ' + newAdv12.trim() + '\n];');
}

const adv11 = `  {
    id: 'adv-11',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-comp-tb6612fng", "fg-board-uno-anatomy", "fg-testing-fmea-debugging"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 11,
    code: 'ADVANCED 11',
    title: 'Autonomous Robotics Capstone: Build Sprint',
    promise: 'By the end of this sprint, your engineering team will execute an agile hardware-software integration sprint, conduct formal peer code reviews, maintain contemporaneous engineering build journals, and pass the Subsystem Milestone 3 pre-flight inspection gate.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 10'],
    outcomes: [
      'Execute 10-minute agile scrum standup meetings isolating technical blockers across mechanical, electrical, and firmware domains.',
      'Integrate 4 interdependent subsystems (chassis/drivetrain, dual-rail power, multi-sensor array, and real-time state machine firmware).',
      'Maintain contemporaneous engineering build journals documenting design iterations, schematics, and empirical test data.',
      'Conduct peer code reviews enforcing non-blocking timing, atomic interrupt guards, and memory safety.',
      'Pass the mandatory Subsystem Milestone 3 Gate: cold electrical continuity check, bench sensor telemetry, and propped-wheel drive verification.'
    ],
    vocabulary: [
      { 
        term: 'Agile Hardware Sprint', 
        plainMeaning: 'A focused, timeboxed engineering session where team members build, wire, code, and test specific physical subsystems together.', 
        technicalMeaning: 'An iterative development methodology adapting Scrum principles to physical systems, emphasizing rapid integration cycles and continuous testing.' 
      },
      { 
        term: 'Subsystem Milestone Gate', 
        plainMeaning: 'A mandatory inspection checkpoint where instructors verify safety and basic function before a robot is allowed on the arena floor.', 
        technicalMeaning: 'A formal engineering review milestone establishing go/no-go criteria that must be verified empirically before proceeding to integrated field trials.' 
      },
      { 
        term: 'Contemporaneous Build Journal', 
        plainMeaning: 'A legal engineering notebook where you write down ideas, schematics, and test results the exact minute they happen.', 
        technicalMeaning: 'A bound, dated, and signed technical record of inventions, designs, and experimental observations providing legal and institutional documentation.' 
      },
      { 
        term: 'Peer Code Review', 
        plainMeaning: 'Having another programmer inspect your code before uploading it, catching logic bugs and race conditions in minutes.', 
        technicalMeaning: 'A systematic examination of software source code by peers to identify defects, enforce coding guidelines, and improve architectural quality.' 
      },
      { 
        term: 'Cold Electrical Continuity Check', 
        plainMeaning: 'Testing every power wire with a multimeter beeper before plugging in the battery, ensuring no positive wires touch ground.', 
        technicalMeaning: 'An unpowered circuit integrity test using a DMM in low-resistance mode to verify complete isolation between supply rails (VM, VCC) and ground (GND).' 
      },
      { 
        term: 'Subsystem Integration Debt', 
        plainMeaning: 'The unexpected bugs and crashes that happen when you plug two separately working circuits into the same battery and microcontroller.', 
        technicalMeaning: 'The compounded technical overhead and unpredictable interactions arising from interface mismatches, pin contention, or power bus coupling between modules.' 
      }
    ],
    teacherPrep: [
      'Prepare agile sprint kanban boards (Backlog, In-Progress, Milestone Inspection, Done) for each student team.',
      'Set up Subsystem Milestone 3 review stations equipped with bench power supplies, multimeters, and test props.'
    ],
    verifiedMaterials: [
      'Team capstone autonomous rovers (aluminum/acrylic chassis, TB6612, optical encoders, HC-SR04, line array)',
      'Bound engineering build journals and carbon-copy lab notebooks',
      'True-RMS bench multimeters with needle probes for cold continuity checks',
      'USB programming cables and laptop workstations with Arduino IDE 2.x',
      'Standardized competition obstacle and line-tracking test arena'
    ],
    safetyNotes: [
      'Mandatory Cold Continuity Verification: Never connect the 2S LiPo battery until an instructor signs off on the 0-ohm short test.',
      'Keep chassis propped on a bench stand during initial firmware flashing so drive wheels spin freely in the air.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Agile Standup', 
        minutes: 10, 
        teacherAction: 'Facilitate 2-minute team scrum standup meetings: What subsystem did you complete? What are you building today? What is blocking you?', 
        studentAction: 'Elect team spokesperson; declare sprint deliverables on the physical sprint board.' 
      },
      { 
        segment: '10–40m Subsystem Sprint', 
        minutes: 30, 
        teacherAction: 'Mentor cross-functional integration: inspect wire strain relief, mediate pin conflicts, and supervise peer code reviews.', 
        studentAction: 'Fabricate mounts, route harnesses, write non-blocking state machines, and log contemporaneous build entries.' 
      },
      { 
        segment: '40–50m Milestone 3 Gate', 
        minutes: 10, 
        teacherAction: 'Inspect rovers at the Milestone 3 Gate: 1. Cold DMM continuity check. 2. Propped-wheel motor test. 3. Serial sensor stream.', 
        studentAction: 'Present completed rover for technical inspection sign-off before conducting arena trials.' 
      },
      { 
        segment: '50–60m Retrospective & Journal', 
        minutes: 10, 
        teacherAction: 'Review build journal documentation rigor and sign off on completed engineering tickets.', 
        studentAction: 'Record sprint outcomes, document remaining technical debt, and complete exit tickets.' 
      }
    ],
    concepts: [
      {
        title: '1. Agile Systems Engineering & Cross-Functional Team Roles',
        explanation: 'In commercial robotics (such as Boston Dynamics or NASA JPL), complex robots are never built by lone wolves. They are created by cross-functional teams using Agile Sprints: timeboxed engineering iterations focused on tangible deliverables. A balanced robotics squad assigns 4 vital roles: \\n• Mechanical Lead: CAD chassis, gearbox ratios, center of gravity ($z_{cg}$), and fastener torque. \\n• Electrical & Power Lead: Battery discharge budgets, voltage regulation, wire gauges, and common ground star buses. \\n• Firmware & Algorithms Lead: Real-time scheduling, interrupt service routines (ISRs), and sensor arbitration. \\n• Systems Integration Lead: End-to-end testing, error logging, and the team Build Journal.',
        instructorNote: 'Ensure teams rotate roles across projects so every student masters mechanical, electrical, and software disciplines.'
      },
      {
        title: '2. Contemporaneous Engineering Build Journals',
        explanation: 'In aerospace engineering and patent law, if an experiment is not recorded contemporaneously (in real-time as it occurs), it legally never happened! A professional Build Journal is bound (never loose-leaf) and written in ink. Key rules: \\n1. Never erase or white-out mistakes; draw a single neat strikethrough ($---$) with your initials, preserving the audit trail of what failed and why. \\n2. Record exact part numbers, measured wire resistances, and battery cell voltages. \\n3. Sketch physical wiring pinouts before writing a single line of code. \\n4. Document every software change with git commit hashes and observed behavior.',
        instructorNote: 'Show an authentic engineering notebook: emphasize that failed tests with clear notes are more valuable than unrecorded lucky runs.'
      },
      {
        title: '3. Peer Code Reviews & Static Firmware Verification',
        explanation: 'The human brain suffers from cognitive confirmation bias: an engineer who spent 3 hours writing a 200-line control loop will read right past their own off-by-one errors or uninitialized variables. A Peer Code Review eliminates this blind spot. Before flashing firmware to the physical capstone rover, another teammate must review the code against a 5-point safety rubric: \\n1. Are all shared ISR variables declared \\\\texttt{volatile}? \\n2. Are multi-byte variables protected by atomic guards (\\\\texttt{noInterrupts()})? \\n3. Are there ZERO blocking \\\\texttt{delay()} calls inside autonomous state loops? \\n4. Do all sensor sampling routines include fail-safe timeout boundaries? \\n5. Are all microcontroller pins explicitly matched to the electrical wire table?',
        instructorNote: 'Have pairs swap laptops and annotate code comments using the 5-point safety rubric.'
      },
      {
        title: '4. Pre-Flight Cold Electrical Continuity Verification',
        explanation: 'The single most catastrophic moment in robotics is the "Smoke Test"—plugging in a fresh 7.4V Li-Po battery when an accidental solder bridge or stray wire strand shorts the power rail to ground. A 2S Li-Po can deliver over 40A of instantaneous short-circuit current, vaporizing PCB copper traces and frying the microcontroller within 80 milliseconds! To eliminate this risk, professional teams enforce a mandatory Cold Continuity Check: \\n• Switch DMM to Resistance / Continuity mode (\\\\Omega). \\n• Probe between Battery Positive Terminal ($V_{in}$) and Common Ground (GND). \\n• Resistance must read Mega-ohms (open circuit). If resistance is $<10\\\\,\\\\Omega$, DO NOT CONNECT POWER—isolate and fix the short circuit immediately!',
        instructorNote: 'Demonstrate with a DMM: show what open circuit (O.L.) looks like versus an audible short beep.'
      },
      {
        title: '5. Multi-Domain Subsystem Integration & Pin Arbitrations',
        explanation: 'When 5 separate modules (optical encoders, ultrasonic sonar, TCRT5000 line array, TB6612 motor driver, and serial telemetry) combine onto an Arduino Uno, hardware resource contention is severe. The ATmega328P has only two external hardware interrupt pins: Pin 2 (INT0) and Pin 3 (INT1). Therefore: \\n• Encoders MUST claim Pins 2 and 3 for microsecond pulse capture. \\n• Hardware PWM pins (Timer 0: D5, D6; Timer 1: D9, D10; Timer 2: D3, D11) must be reserved for motor speeds without conflicting with encoder interrupts. \\n• Ultrasonic echo timing cannot use blocking \\\\texttt{pulseIn()} without a microsecond timeout ($18000\\\\,\\\\mu\\\\text{s} \\\\approx 3\\\\text{m}$), otherwise a lost acoustic ping freezes the entire rover.',
        instructorNote: 'Review the pin budget matrix on the whiteboard: show how every single pin from D2 to A4 is mapped without conflict.'
      },
      {
        title: '6. The Subsystem Milestone 3 Gate (Go/No-Go Qualification)',
        explanation: 'Before any robot is permitted to conduct integrated autonomous trials in the arena, it must clear the Milestone 3 Gate. The inspection panel verifies three objective criteria: \\n1. Mechanical & Wiring Inspection: All M3 fasteners secured with Nyloc nuts; wire harnesses clamped with zip-tie strain relief within 30mm of terminals; center of gravity balanced over drive wheels. \\n2. Electrical Isolation: Multimeter confirms open-circuit between $V_{bat}$ and GND; inline 3A fuse installed; emergency mechanical toggle switch easily reachable. \\n3. Propped-Wheel Bench Verification: With wheels elevated in the air, the rover streams live encoder ticks and sonar distance to Serial Monitor, confirming correct motor direction before tires touch the ground.',
        instructorNote: 'Act as the Chief Flight Inspector: sign the team Build Journal with a formal ink stamp or signature upon passing.'
      }
    ],
    visualizerId: 'obstacle_avoiding_rover_sim',
    project: {
      name: 'Autonomous Robotics Capstone Integration',
      deliverableType: 'physical_build',
      successEvidence: [
        'Fully integrated capstone rover clearing the Milestone 3 Gate with zero short-circuits and verified strain relief.',
        'Contemporaneous team build journal with signed sprint standup entries, wiring schematics, and test logs.',
        'Production firmware passing peer code review with non-blocking tasks, odometry interrupts, and fail-safe sonar arbitration.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (or Mega)', 'TB6612FNG Dual H-Bridge Driver', 'Dual Optical Wheel Encoders (LM393)', 'HC-SR04 Ultrasonic Sensor', '3-Channel Reflectance Line Array', '7.4V 2S LiPo Battery Pack with 3A Fuse'],
      componentList: [
        { name: 'Differential Drive Chassis', exactVariant: 'Stiff laser-cut acrylic / aluminum 2WD chassis with caster', quantity: 1 },
        { name: 'TB6612FNG Driver', exactVariant: '1.2A continuous dual H-bridge motor driver module', quantity: 1 },
        { name: 'Dual Optical Encoders', exactVariant: '20-slot optical interrupter slotted gate discs with LM393 boards', quantity: 2 },
        { name: 'HC-SR04 Ultrasonic Sensor', exactVariant: '40kHz piezoelectric sonar rangefinder module', quantity: 1 },
        { name: 'Analog Line Sensor Array', exactVariant: 'TCRT5000 3-sensor infrared reflectance array (Left, Center, Right)', quantity: 1 },
        { name: 'Power Harness & Failsafe', exactVariant: '2S 7.4V LiPo with SPST toggle switch and inline 3A automotive blade fuse', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/capstone_rover_wiring.svg',
      schematic: 'Master Capstone Architecture: Left/Right Encoders on D2/D3 (INT0/INT1). HC-SR04 Sonar on D4 (Trig) and D11 (Echo). TB6612 on D5/D6 (PWMA/B), D7/D8 (AIN1/2), D9/D10 (BIN1/2), D12 (STBY). TCRT5000 Line Array on A0, A1, A2. Battery 7.4V through 3A fuse to VM; Arduino regulated 5V to VCC and sensors; common GND bus.',
      wireTable: [
        { from: 'Left Encoder D0', to: 'Arduino Pin 2 (INT0)', wireOrPolarityNote: 'Hardware interrupt 0 for microsecond left wheel odometry' },
        { from: 'Right Encoder D0', to: 'Arduino Pin 3 (INT1)', wireOrPolarityNote: 'Hardware interrupt 1 for microsecond right wheel odometry' },
        { from: 'HC-SR04 Trig', to: 'Arduino Pin 4', wireOrPolarityNote: '10us ultrasonic burst trigger output' },
        { from: 'HC-SR04 Echo', to: 'Arduino Pin 11', wireOrPolarityNote: 'Echo pulse return with 18ms software timeout' },
        { from: 'TB6612 PWMA', to: 'Arduino Pin 5 (PWM)', wireOrPolarityNote: 'Left motor PWM speed control' },
        { from: 'TB6612 PWMB', to: 'Arduino Pin 6 (PWM)', wireOrPolarityNote: 'Right motor PWM speed control' },
        { from: 'TB6612 AIN1, AIN2', to: 'Arduino Pins 7, 8', wireOrPolarityNote: 'Left motor direction H-bridge inputs' },
        { from: 'TB6612 BIN1, BIN2', to: 'Arduino Pins 9, 10', wireOrPolarityNote: 'Right motor direction H-bridge inputs' },
        { from: 'TB6612 STBY', to: 'Arduino Pin 12', wireOrPolarityNote: 'Hardware standby enable (active HIGH)' },
        { from: 'Line Array Left', to: 'Arduino Pin A0', wireOrPolarityNote: 'Analog reflectance signal (<400 = black line)' },
        { from: 'Line Array Center', to: 'Arduino Pin A1', wireOrPolarityNote: 'Analog reflectance signal (<400 = black line)' },
        { from: 'Line Array Right', to: 'Arduino Pin A2', wireOrPolarityNote: 'Analog reflectance signal (<400 = black line)' },
        { from: 'Battery Positive (+) 7.4V', to: 'Master Switch ➔ 3A Fuse ➔ TB6612 VM', wireOrPolarityNote: 'High-current isolated motor power rail' },
        { from: 'Shared Ground Bus', to: 'Battery (-) & Arduino GND & Driver GND', wireOrPolarityNote: 'Mandatory single-point star common ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mechanical Assembly: Torque all M3 chassis standoffs and motor brackets using Nyloc locknuts; ensure zero wheel wobble.',
        '2. Wiring Harness Integration: Route sensor and motor wires through strain relief zip-ties; ensure zero wire pinch around moving wheels.',
        '3. Pre-Flight Cold Continuity Test: With battery disconnected, verify open circuit (>100k-ohm) between VM and GND with a DMM.',
        '4. Elevate Chassis: Place rover onto bench test block so drive wheels are suspended in the air.',
        '5. Firmware Flash: Upload Capstone Release Candidate firmware via USB with motor power switch OFF.',
        '6. Bench Telemetry Verification: Open Serial Monitor at 9600 baud; manually rotate wheels to confirm encoder ticks increment cleanly; wave hand in front of sonar to confirm distance updates.',
        '7. Live Arena Maiden Run: Switch on motor power and place rover in competition arena; observe autonomous navigation and obstacle evasion.'
      ],
      powerAndSafetyChecks: [
        'Mandatory 3A inline fuse on battery positive lead protects wiring against short-circuit thermal runaway.',
        'Top-mounted red emergency master toggle switch must be instantly accessible to kill motor power.',
        'Always conduct first drive trial with suspended drive wheels before placing rover on floor.'
      ],
      testCases: [
        { action: 'Cold Multimeter Continuity Test', expectedResult: 'DMM shows open circuit (O.L.) between VM and GND, confirming zero power-rail shorts.' },
        { action: 'Propped-Wheel Direction Verification', expectedResult: 'Both left and right wheels spin forward smoothly when forward command is issued.' },
        { action: 'Bench Sonar Obstacle Trigger', expectedResult: 'Placing hand 15cm in front of HC-SR04 triggers obstacle state: motors brake and pivot safely within 200ms.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 11
// Autonomous Capstone Rover Master Firmware (Release Candidate 1.0)
// Subsystems: Dual Odometry Interrupts, Non-Blocking Sonar, Line Array, TB6612

#include <Arduino.h>

// Pin Definitions
const int PIN_ENC_L  = 2;   // INT0 hardware interrupt
const int PIN_ENC_R  = 3;   // INT1 hardware interrupt
const int PIN_TRIG   = 4;   // Ultrasonic Trigger
const int PIN_ECHO   = 11;  // Ultrasonic Echo
const int PIN_PWMA   = 5;   // Left Motor Speed (PWM)
const int PIN_PWMB   = 6;   // Right Motor Speed (PWM)
const int PIN_AIN1   = 7;   // Left Motor Direction 1
const int PIN_AIN2   = 8;   // Left Motor Direction 2
const int PIN_BIN1   = 9;   // Right Motor Direction 1
const int PIN_BIN2   = 10;  // Right Motor Direction 2
const int PIN_STBY   = 12;  // Motor Driver Standby Enable

const int PIN_LINE_L = A0;  // Line Sensor Left
const int PIN_LINE_C = A1;  // Line Sensor Center
const int PIN_LINE_R = A2;  // Line Sensor Right

// Volatile interrupt pulse counters
volatile unsigned long ticksLeft = 0;
volatile unsigned long ticksRight = 0;

void isrLeftEncoder() { ticksLeft++; }
void isrRightEncoder() { ticksRight++; }

// Non-blocking task timing
unsigned long lastSonarTime = 0;
unsigned long lastTelemetryTime = 0;
int currentDistanceCm = 100;

void drive(int leftSpeed, int rightSpeed);
void brake();
int readSonarNonBlocking();

void setup() {
  Serial.begin(9600);
  
  // Configure and attach encoder hardware interrupts
  pinMode(PIN_ENC_L, INPUT_PULLUP);
  pinMode(PIN_ENC_R, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_L), isrLeftEncoder, RISING);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_R), isrRightEncoder, RISING);

  // Configure sonar pins
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  // Configure TB6612 motor driver pins
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH); // Enable H-bridge

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE CAPSTONE ROVER - RC 1.0       "));
  Serial.println(F("========================================"));
  Serial.println(F("[SYSTEM] Hardware Interrupts & Subsystems Ready."));
}

void loop() {
  unsigned long now = millis();

  // Task 1: Non-blocking Sonar Ping every 50ms
  if (now - lastSonarTime >= 50) {
    lastSonarTime = now;
    currentDistanceCm = readSonarNonBlocking();
  }

  // Task 2: Live Telemetry Broadcast every 250ms
  if (now - lastTelemetryTime >= 250) {
    lastTelemetryTime = now;
    noInterrupts();
    unsigned long safeL = ticksLeft;
    unsigned long safeR = ticksRight;
    interrupts();

    Serial.print(F("TICKS: L=")); Serial.print(safeL);
    Serial.print(F(" R=")); Serial.print(safeR);
    Serial.print(F(" | SONAR: ")); Serial.print(currentDistanceCm);
    Serial.print(F(" cm | LINE: "));
    Serial.print(analogRead(PIN_LINE_L)); Serial.print(F("/"));
    Serial.print(analogRead(PIN_LINE_C)); Serial.print(F("/"));
    Serial.println(analogRead(PIN_LINE_R));
  }

  // Task 3: Autonomous Arbitration State Machine
  // Level 1 Priority: Safety Obstacle Avoidance (< 18cm)
  if (currentDistanceCm <= 18) {
    brake();
    delay(100);
    drive(-130, 130); // Pivot right away from obstacle
    delay(250);
    return;
  }

  // Level 2 Priority: Line Tracking Navigation
  int lineL = analogRead(PIN_LINE_L);
  int lineC = analogRead(PIN_LINE_C);
  int lineR = analogRead(PIN_LINE_R);

  // Black line detected (< 400 ADC)
  bool leftOnLine = (lineL < 400);
  bool centerOnLine = (lineC < 400);
  bool rightOnLine = (lineR < 400);

  if (centerOnLine && !leftOnLine && !rightOnLine) {
    drive(150, 150); // Straight cruise
  } else if (leftOnLine) {
    drive(90, 160);  // Steer left
  } else if (rightOnLine) {
    drive(160, 90);  // Steer right
  } else {
    drive(130, 130); // Search / cruise forward
  }
}

int readSonarNonBlocking() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  // 18ms timeout corresponds to approx 300cm maximum range
  long duration = pulseIn(PIN_ECHO, HIGH, 18000);
  if (duration == 0) return 999; // Target out of range / clear
  return (duration * 0.0343) / 2;
}

void drive(int leftSpeed, int rightSpeed) {
  // Left motor direction & speed
  digitalWrite(PIN_AIN1, leftSpeed >= 0 ? HIGH : LOW);
  digitalWrite(PIN_AIN2, leftSpeed >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMA, constrain(abs(leftSpeed), 0, 255));

  // Right motor direction & speed
  digitalWrite(PIN_BIN1, rightSpeed >= 0 ? HIGH : LOW);
  digitalWrite(PIN_BIN2, rightSpeed >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMB, constrain(abs(rightSpeed), 0, 255));
}

void brake() {
  digitalWrite(PIN_AIN1, HIGH); digitalWrite(PIN_AIN2, HIGH); analogWrite(PIN_PWMA, 0);
  digitalWrite(PIN_BIN1, HIGH); digitalWrite(PIN_BIN2, HIGH); analogWrite(PIN_PWMB, 0);
}
\`,
      pinMap: {
        'Pin 2': 'Left Wheel Optical Encoder (Hardware Interrupt 0 / INT0)',
        'Pin 3': 'Right Wheel Optical Encoder (Hardware Interrupt 1 / INT1)',
        'Pin 4': 'HC-SR04 Ultrasonic Trigger 10us output pulse',
        'Pin 11': 'HC-SR04 Ultrasonic Echo timed input pulse',
        'Pin 5': 'TB6612 Left Motor PWM Speed control',
        'Pin 6': 'TB6612 Right Motor PWM Speed control',
        'Pin 7': 'TB6612 Left Motor Direction In1',
        'Pin 8': 'TB6612 Left Motor Direction In2',
        'Pin 9': 'TB6612 Right Motor Direction In1',
        'Pin 10': 'TB6612 Right Motor Direction In2',
        'Pin 12': 'TB6612 Standby Enable (Active HIGH)',
        'Pin A0': 'Left TCRT5000 Analog Line Sensor',
        'Pin A1': 'Center TCRT5000 Analog Line Sensor',
        'Pin A2': 'Right TCRT5000 Analog Line Sensor'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB; verify correct COM port and Board selection in IDE.',
        '2. Perform pre-flight cold continuity test with DMM before energizing battery circuit.',
        '3. Elevate rover chassis on bench blocks so drive wheels are suspended in mid-air.',
        '4. Upload firmware; open Serial Monitor at 9600 baud.',
        '5. Verify encoder tick counts increment when spinning wheels by hand and sonar reads obstacles accurately.'
      ],
      explanations: [
        'Atomic interrupt reading: noInterrupts() guards the 32-bit tick counters during copying, preventing partial byte corruption.',
        'pulseIn() timeout: Restricting pulseIn to 18,000 microseconds guarantees that an unreturned echo will not freeze the robot.',
        'Priority arbitration: Emergency obstacle avoidance unconditionally preempts line following, guaranteeing collision prevention.'
      ],
      expectedResult: 'Rover tracks course line smoothly, reports live telemetry at 4Hz, and executes clean 90-degree obstacle avoidance pivots when encountering barriers.',
      caveats: [
        'Ensure common ground wire between battery, TB6612, and Arduino Uno is securely connected, or motors will stutter erratically.',
        'Never flash new firmware via USB while battery master switch is ON and wheels are resting on the floor.'
      ],
      tweakTip: 'Adjust the pulseIn timeout from 18,000us down to 10,000us (~1.7m) to make the main control loop cycle even faster!'
    },
    activity: {
      title: 'Execute Capstone Sprint & Pass Milestone 3 Gate',
      steps: [
        'Step 1: Conduct 10-minute team agile standup; allocate tasks across mechanical, electrical, and firmware leads.',
        'Step 2: Complete physical assembly, harness wire strain relief, and perform DMM cold continuity test.',
        'Step 3: Conduct peer code review on Capstone Release Candidate firmware using the 5-point safety rubric.',
        'Step 4: Flash firmware to suspended rover; verify encoder ISRs, line array, and sonar on Serial Monitor.',
        'Step 5: Present rover to instructor at the Subsystem Milestone 3 Gate for inspection sign-off.',
        'Step 6: Execute maiden autonomous arena run; log lap performance in team contemporaneous build journal.'
      ],
      successCriteria: [
        'Rover passes the 3-point Milestone 3 Gate inspection (zero short circuits, verified strain relief, live sensor stream).',
        'Team contemporaneous build journal updated with dated schematics, role assignments, and empirical test data.',
        'Autonomous rover completes arena mission with verified obstacle evasion and line following.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Left and right encoder tick counts stay at 0 in Serial Monitor even when wheels spin.', 
        checks: [
          'Step 1: Check encoder power: is the VCC pin connected to 5V and GND to common ground?',
          'Step 2: Check pin assignment: are encoders wired strictly to Pins 2 (INT0) and 3 (INT1)?',
          'Step 3: Check optical alignment: is the slotted encoder wheel rubbing against the plastic opto-gate housing?'
        ], 
        explanation: 'Arduino Uno hardware interrupts are strictly hardwired to ATmega328P pins D2 and D3; wiring encoders to other digital pins will never fire external ISRs.' 
      },
      { 
        symptom: 'Rover drives in reverse when a forward command is executed.', 
        checks: [
          'Step 1: Check motor terminal polarity: swap the positive and negative motor wires on the TB6612 screw terminals.',
          'Step 2: Alternatively, invert the logic HIGH/LOW assignments in the drive() function for AIN1/AIN2 or BIN1/BIN2.',
          'Step 3: Re-verify wheel rotation on the propped bench test stand before placing rover back on the floor.'
        ], 
        explanation: 'DC motor polarity determines magnetic flux direction; reversing the physical wires or directional control bits reverses rotation.' 
      },
      { 
        symptom: 'Multimeter beeps during cold continuity test between VM and GND.', 
        checks: [
          'Step 1: DO NOT CONNECT BATTERY! A dead short circuit exists.',
          'Step 2: Visually inspect TB6612 motor driver pins for solder bridges or stray copper strands.',
          'Step 3: Disconnect motor driver and test battery leads separately to isolate the exact shorted component.'
        ], 
        explanation: 'A short between VM and GND will destroy wiring and pose a fire hazard if energized by a high-discharge LiPo battery.' 
      },
      { 
        symptom: 'Rover freezes periodically for 1 second when obstacle is detected.', 
        checks: [
          'Step 1: Check pulseIn() parameters in code: is a timeout specified?',
          'Step 2: Add 18000us timeout parameter to pulseIn(PIN_ECHO, HIGH, 18000).',
          'Step 3: Eliminate any blocking delay() calls inside the obstacle avoidance handler.'
        ], 
        explanation: 'Without a timeout parameter, pulseIn() defaults to waiting 1,000,000 microseconds (1 full second) if an acoustic echo is absorbed or deflected.' 
      }
    ],
    checksForUnderstanding: [
      'What are the 4 essential engineering roles on an agile robotics team, and what is each responsible for?',
      'Why is an unpowered cold continuity check with a multimeter mandatory before connecting a Li-Po battery?',
      'Why must variables shared between an Interrupt Service Routine (ISR) and the main loop be declared volatile and read atomically?'
    ],
    exitTicket: [
      { 
        question: 'What specific technical contribution did you make to today’s capstone build sprint, and what blocker did you overcome?', 
        rubricOrSampleReasoning: 'Student gives concrete, honest engineering details (e.g. "I wired the optical encoders to pins 2 and 3, fixed a loose ground wire, and verified clean pulse counts in Serial Monitor").' 
      },
      { 
        question: 'Explain why drawing a single strikethrough through a mistake in an engineering build journal is superior to erasing it.', 
        rubricOrSampleReasoning: 'Preserves the historical audit trail and intellectual property record; shows future engineers what was tried, what failed, and why it failed.' 
      },
      { 
        question: 'Why does the Milestone 3 Gate require bench testing with propped drive wheels before arena testing?', 
        rubricOrSampleReasoning: 'Prevents runaway robots, high-speed physical wall impacts, and motor stall burns by verifying telemetry, sensor responses, and motor directions in a safe, zero-load state.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-pinned breadboard jumper wiring templates and structured scrum role checklists.'],
      extension: ['Implement closed-loop odometry straight-line tracking using differential encoder error corrections.'],
      offlineOption: ['Draft the complete multi-subsystem wiring schematic and write the peer code review audit on paper.']
    },
    nextLessonId: 'adv-12',
    nextLessonTeaser: 'Advanced 12: Technical Demonstration and Design Review — Deliver your 5-minute technical defense before an expert jury, demonstrate live autonomous mission execution, and graduate as certified RoboBEE Innovators!',
    sources: [
      { title: 'NASA Systems Engineering Procedural Requirements (NPR 7123.1C)', url: 'https://nasa.gov' },
      { title: 'Agile Alliance: Hardware Development Principles', url: 'https://agilealliance.org' }
    ],
    assetCredits: [{ asset: 'Capstone Sprint Board & Inspection Rubric', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const adv12 = `  {
    id: 'adv-12',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep", "fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-safety-lab-code"],
      goDeeper: ["fg-foundations-what-is-robot"]
    },
    courseId: 'advanced',
    sequence: 12,
    code: 'ADVANCED 12',
    title: 'Technical Demonstration and Design Review',
    promise: 'By the end of this graduation capstone, your engineering team will deliver a formal 5-minute Critical Design Review (CDR) defense before a technical jury, justify engineering tradeoffs with empirical data, demonstrate live autonomous robot mission execution, and graduate as certified RoboBEE Innovators.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 11'],
    outcomes: [
      'Deliver a professional 5-minute Critical Design Review (CDR) technical presentation defending mechanical, electrical, and software architectures.',
      'Justify engineering tradeoffs (e.g., speed vs torque, optical vs ultrasonic sensing, rigid vs flexible chassis) using empirical test data.',
      'Demonstrate live autonomous mission execution in the competition arena, verifying obstacle avoidance, navigation, and fail-safe recovery.',
      'Exhibit engineering poise and methodical diagnostic communication when explaining unexpected live demonstration anomalies.',
      'Document technical debt and outline a Revision 2.0 engineering roadmap in a formal post-project retrospective.',
      'Graduate as certified RoboBEE Innovators, committing to the engineering creed: Dream. Invent. Experiment. Inspire.'
    ],
    vocabulary: [
      { 
        term: 'Critical Design Review (CDR)', 
        plainMeaning: 'A formal engineering presentation where you prove to a jury of expert judges that your robot meets all mission requirements.', 
        technicalMeaning: 'A rigorous milestone review in systems engineering that verifies the detailed design meets performance and safety requirements before operational deployment.' 
      },
      { 
        term: 'Tradeoff Defense', 
        plainMeaning: 'Explaining why you chose one solution over another using numbers and test data instead of just guessing.', 
        technicalMeaning: 'The empirical justification of design compromises (e.g., mass vs structural stiffness, sensor latency vs algorithmic complexity) backed by experimental data.' 
      },
      { 
        term: 'Demonstration Poise', 
        plainMeaning: 'Staying calm and explaining what happened like a professional scientist if your robot glitches during a live show.', 
        technicalMeaning: 'The professional ability to manage live physical demonstration anomalies through calm demeanor, transparent telemetry analysis, and root-cause explanation.' 
      },
      { 
        term: 'Technical Debt', 
        plainMeaning: 'Temporary shortcuts you took to make the robot work today that you must redesign properly in the future.', 
        technicalMeaning: 'The implied cost of additional future rework caused by choosing an easy, short-term engineering solution instead of a robust, scalable architecture.' 
      },
      { 
        term: 'Post-Mortem Retrospective', 
        plainMeaning: 'A team meeting after the project is finished to celebrate what went well and write down how to do even better next time.', 
        technicalMeaning: 'A blameless post-project engineering analysis identifying successes, operational failures, and actionable recommendations for future product iterations.' 
      },
      { 
        term: 'The RoboBEE Innovators Creed', 
        plainMeaning: 'The four engineering rules we live by: Dream boldly, Invent purposefully, Experiment fearlessly, and Inspire others.', 
        technicalMeaning: 'The foundational ethical and pedagogical principles guiding robotics engineers to pursue scientific truth, persistence through failure, and collaborative mentorship.' 
      }
    ],
    teacherPrep: [
      'Convene the expert jury panel (instructors, alumni engineers, guest mentors) and distribute standardized CDR evaluation rubrics.',
      'Prepare the graduation presentation display, competition arena, precision timing gates, and Certificates of Robotics Mastery.'
    ],
    verifiedMaterials: [
      'Completed team autonomous capstone robots with charged 2S LiPo battery packs',
      'Digital projector and technical presentation station for team slide decks',
      'Standardized competition arena with obstacle props and line course',
      'Bench multimeters, battery chargers, and pit repair tools',
      'Official RoboBEE Innovators Certificates of Robotics Mastery'
    ],
    safetyNotes: [
      'Controlled public demonstration: all spectators must remain behind safety perimeter barriers.',
      'Robots must be powered OFF immediately upon completing their live arena demonstration runs.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Welcome & Rubric Briefing', 
        minutes: 10, 
        teacherAction: 'Welcome parents, mentors, and jury members. Introduce the 5-category CDR evaluation rubric: Mechanical, Electrical, Software, Data Defense, and Poise.', 
        studentAction: 'Stage capstone rovers at pit inspection tables; perform final pre-flight battery voltage check.' 
      },
      { 
        segment: '10–40m CDR Defenses & Arena Runs', 
        minutes: 30, 
        teacherAction: 'Moderate team technical defenses (5 min presentation + 3 min live arena run + 2 min jury Q&A per team).', 
        studentAction: 'Deliver technical slide presentations, execute live autonomous arena runs, and defend engineering tradeoffs before the jury.' 
      },
      { 
        segment: '40–50m Jury Deliberation & Feedback', 
        minutes: 10, 
        teacherAction: 'Tally jury scorecards; provide constructive, professional engineering feedback on technical rigor and design ingenuity.', 
        studentAction: 'Listen to jury feedback; take notes on architectural recommendations and technical debt insights.' 
      },
      { 
        segment: '50–60m Graduation & Creed', 
        minutes: 10, 
        teacherAction: 'Award official Certificates of Robotics Mastery; lead the academy graduation ceremony and recite the RoboBEE Innovators Creed.', 
        studentAction: 'Recite the RoboBEE Innovators Creed; celebrate graduation with teammates, mentors, and parents.' 
      }
    ],
    concepts: [
      {
        title: '1. The Architecture of a Professional Critical Design Review (CDR)',
        explanation: 'In aerospace organizations like NASA, ESA, and SpaceX, no spacecraft or autonomous rover is cleared for launch without passing a Critical Design Review (CDR). A CDR is not a superficial sales pitch; it is an exhaustive technical interrogation where engineers present the complete system architecture: \\n1. Functional Requirements: What exact specifications was the robot required to meet? \\n2. Subsystem Schematics: Detailed mechanical CAD drawings, electrical schematics, and finite-state machine diagrams. \\n3. Verification Evidence: Empirical proof (graphs, tables, MTBF statistics) demonstrating the machine satisfies every requirement under worst-case operating conditions. Professional engineers speak with numbers and data, never opinions!',
        instructorNote: 'Remind students: judges do not care about buzzwords; judges care about measured tolerances, ampere draws, and loop execution frequencies.'
      },
      {
        title: '2. Defending Engineering Tradeoffs with Empirical Telemetry',
        explanation: 'Every engineering design is an exercise in tradeoffs. A robot cannot simultaneously possess infinite speed, infinite torque, zero mass, and zero battery consumption! In your CDR, the jury will challenge your decisions: \\n• "Why did you choose a 30:1 gear ratio instead of 50:1?" An amateur answers: "It felt fast." An innovator defends with physics: "$30:1$ provides $0.32\\\\,\\\\text{N}\\\\cdot\\\\text{m}$ stall torque, accelerating our $0.85\\\\,\\\\text{kg}$ chassis at $1.8\\\\,\\\\text{m/s}^2$ while drawing only $1.2\\\\,\\\\text{A}$, staying safely within our $2.5\\\\,\\\\text{A}$ power budget." \\n• "Why ultrasonic over optical sensors?" Defense: "Acoustic waves are unaffected by arena ambient lighting or dark glossy floor reflections, eliminating false edge triggers."',
        instructorNote: 'Coach teams to reference specific equations and test log data when answering questions from the jury.'
      },
      {
        title: '3. Engineering Poise & The Science of Handling Live Failures',
        explanation: 'Robotics is an unforgiving contact sport governed by Murphy’s Law: "Anything that can go wrong, will go wrong—at the worst possible moment." During a live demonstration, an unexpected arena surface reflection or a loose connector might cause the robot to hesitate or stall. Amateur builders panic, make excuses, or blame their partners. Professional systems engineers demonstrate Demonstration Poise: \\n1. Maintain absolute calm and professional posture. \\n2. Consult live telemetry data on the diagnostic serial stream: "The robot has transitioned into State 3 (Search) because optical line sensor A1 read 820 ADC due to arena spotlight flare." \\n3. Explain the exact corrective measure for Revision 2.0. The jury rewards technical poise and diagnostic mastery far more than unearned lucky runs!',
        instructorNote: 'Emphasize to the audience that how an engineer diagnoses an unexpected glitch reveals their true competence.'
      },
      {
        title: '4. Documenting Technical Debt & The Revision 2.0 Roadmap',
        explanation: 'No engineering project is ever truly "finished"; it is merely deployed at a given deadline! In every complex machine, compromises were made to meet schedule: a 3D-printed bracket that flexes slightly under shock, a breadboard wire harness that needs custom PCB routing, or a state machine that relies on fixed timeouts instead of dynamic PID tracking. A mature engineering organization documents this openly as Technical Debt. In the final slide of your CDR, present your Revision 2.0 Roadmap: 3 specific architectural upgrades you will implement in the next development cycle.',
        instructorNote: 'Praise teams who demonstrate self-awareness by highlighting their technical debt and presenting concrete engineering solutions.'
      },
      {
        title: '5. Ethics, Safety & Responsibility in Autonomous Robotics',
        explanation: 'As autonomous machines increasingly enter society—from self-driving automobiles and warehouse logistics rovers to medical surgical robots and agricultural drones—roboticists bear profound ethical responsibilities: \\n• Failsafe Architecture: An autonomous system must default to a safe, unpowered state whenever power decays, sensor signals fail, or human operators command an emergency stop. \\n• Algorithmic Transparency: Robot decision-making must be deterministic, auditable, and logged to non-volatile memory. \\n• Human Stewardship: Robotics technology must always be directed toward elevating human potential, protecting life, and solving real-world challenges with integrity and scientific truth.',
        instructorNote: 'Lead a brief discussion on why safety interlocks and software watchdog timers are ethical requirements, not optional extras.'
      },
      {
        title: '6. The RoboBEE Innovators Creed & The Lifelong Engineering Journey',
        explanation: 'Reflect on where you began: in Class 01, you wired a single coin-cell battery to light a miniature LED. Today, in Class 36, you have designed, built, wired, and programmed an autonomous, multi-tasking mobile robot capable of real-time odometry, sensor fusion, and closed-loop control! You have earned the title of RoboBEE Innovator. Live by our engineering creed: \\n• DREAM: Envision bold, imaginative solutions to real-world problems. \\n• INVENT: Transform creative ideas into functional physical mechanisms and code. \\n• EXPERIMENT: Test relentlessly, embrace failure as data, and persevere. \\n• INSPIRE: Share your knowledge generously and mentor the next generation of engineers!',
        instructorNote: 'Present each graduating student with their Certificate of Robotics Mastery to a round of applause.'
      }
    ],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Technical Demonstration and Critical Design Review',
      deliverableType: 'design_review',
      successEvidence: [
        'Delivered 5-minute technical presentation defending mechanical, electrical, and software architectures.',
        'Completed live autonomous mission run in the competition arena meeting all course navigation requirements.',
        'Defended engineering tradeoffs before jury with empirical telemetry data and documented Revision 2.0 roadmap.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Completed Autonomous Capstone Rover', 'Bench Multimeter', 'Live Telemetry Diagnostic Rig', 'Competition Arena Props', 'Master Safety Cutoff Switch'],
      componentList: [
        { name: 'Capstone Competition Rover', exactVariant: 'Fully integrated 2WD differential drive autonomous rover', quantity: 1 },
        { name: 'Competition Demonstration Arena', exactVariant: 'Standardized 2m x 2m obstacle course with matte black floor and white perimeter', quantity: 1 },
        { name: 'Telemetry Diagnostic Station', exactVariant: 'Laptop workstation streaming live 9600-baud serial state telemetry', quantity: 1 },
        { name: 'Obstacle Course Elements', exactVariant: 'Calibrated 100mm cardboard/plastic obstacle cubes and tunnel props', quantity: 4 },
        { name: 'Precision Digital Stopwatch', exactVariant: 'True-split dual-lap digital arena timer', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/mini_sumo_priority_wiring.svg',
      schematic: 'Final Demonstration Rig: Autonomous capstone rover operating under battery power (7.4V LiPo) with live serial diagnostic broadcast to monitoring station. Pin D13 onboard LED indicates system state; Pin 12 drives motor driver standby enable; Pin 2 monitors hardware start button; full sensor suite active.',
      wireTable: [
        { from: 'Master Power Switch', to: 'Inline 3A Fuse ➔ TB6612 VM & Buck Converter', wireOrPolarityNote: 'Master battery disconnect with short protection' },
        { from: 'Start / Mode Button', to: 'Arduino Pin 2 (INPUT_PULLUP)', wireOrPolarityNote: 'Operator trigger for autonomous demonstration mission' },
        { from: 'Status LED / Buzzer', to: 'Arduino Pin 13 (Builtin) & Pin A3', wireOrPolarityNote: 'Visual and audible state annunciators' },
        { from: 'Serial Diagnostic Port (TX/RX)', to: 'USB / Bluetooth Telemetry Bridge', wireOrPolarityNote: 'Real-time state and sensor telemetry streaming' },
        { from: 'Chassis Ground Bus', to: 'Common Star Ground', wireOrPolarityNote: 'Verified 0.0-ohm ground integrity across all subsystems' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Pre-Flight Pit Inspection: Check battery voltage (>7.8V); verify all M3 locknuts are torqued; verify wire harness strain relief.',
        '2. Diagnostic Serial Connection: Connect USB cable to diagnostic laptop; open Serial Monitor at 9600 baud.',
        '3. Zero-Calibration: Place robot on arena start pad; press Reset button to initialize sensor baseline and tare odometry.',
        '4. Jury Presentation: Deliver 5-minute technical slide presentation defending system architecture and empirical test results.',
        '5. Live Arena Launch: Disconnect USB; flip master battery switch ON; press start button on Pin 2 to begin autonomous mission.',
        '6. Post-Run Failsafe: Rover halts autonomously upon reaching goal zone; switch master power OFF; answer jury questions.'
      ],
      powerAndSafetyChecks: [
        'Verify battery voltage before launch; minimum 7.4V required for reliable motor torque.',
        'Arena perimeter safety barrier must be secured before starting high-speed autonomous runs.',
        'Top-mounted emergency toggle switch must be accessible for immediate manual power cutoff.'
      ],
      testCases: [
        { action: 'Pre-flight Diagnostic Self-Test', expectedResult: 'Onboard status LED flashes 3 times; Serial Monitor reports "[DIAG] All subsystems nominal; battery at 8.1V".' },
        { action: 'Live Autonomous Mission Run', expectedResult: 'Rover traverses course, detects and avoids 2 obstacles, follows line curve, and halts in finish box within 25 seconds.' },
        { action: 'Technical Jury Defense', expectedResult: 'Team answers 3 technical questions, citing specific empirical equations, component ratings, and test logs.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 12
// Final Capstone Graduation Demonstration & Telemetry Master Firmware
// Integrates: State Machine, Failsafe Watchdog, Live Telemetry, Mode Selector

#include <Arduino.h>

// Subsystem Pin Definitions
const int PIN_START_BUTTON = 2;   // Momentary start switch (INPUT_PULLUP)
const int PIN_STATUS_LED   = 13;  // System status indicator
const int PIN_BUZZER       = A3;  // Audio state annunciator

const int PIN_TRIG         = 4;   // Sonar Trigger
const int PIN_ECHO         = 11;  // Sonar Echo
const int PIN_PWMA         = 5;   // Left Motor PWM
const int PIN_PWMB         = 6;   // Right Motor PWM
const int PIN_AIN1         = 7;   // Left Motor Dir 1
const int PIN_AIN2         = 8;   // Left Motor Dir 2
const int PIN_BIN1         = 9;   // Right Motor Dir 1
const int PIN_BIN2         = 10;  // Right Motor Dir 2
const int PIN_STBY         = 12;  // Motor Standby Enable

const int PIN_LINE_LEFT    = A0;  // Left Line Sensor
const int PIN_LINE_CENTER  = A1;  // Center Line Sensor
const int PIN_LINE_RIGHT   = A2;  // Right Line Sensor

// Finite State Machine States
enum RobotState {
  STATE_STANDBY,
  STATE_COUNTDOWN,
  STATE_AUTONOMOUS_NAV,
  STATE_OBSTACLE_AVOID,
  STATE_MISSION_COMPLETE,
  STATE_FAILSAFE_HALT
};

RobotState currentState = STATE_STANDBY;
unsigned long stateStartTime = 0;
unsigned long lastTelemetryTime = 0;
const unsigned long MISSION_TIMEOUT_MS = 45000; // 45-second watchdog failsafe

void setMotors(int leftPwm, int rightPwm);
void brakeMotors();
int getDistanceCm();
void printTelemetry();

void setup() {
  Serial.begin(9600);
  pinMode(PIN_START_BUTTON, INPUT_PULLUP);
  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE INNOVATORS CAPSTONE CDR DEMO  "));
  Serial.println(F("  Motto: Dream. Invent. Experiment.     "));
  Serial.println(F("========================================"));
  Serial.println(F("[SYSTEM] Standby. Press button on Pin 2 to begin demonstration."));
}

void loop() {
  unsigned long now = millis();

  // Periodic 5Hz Diagnostic Telemetry Stream
  if (now - lastTelemetryTime >= 200) {
    lastTelemetryTime = now;
    printTelemetry();
  }

  // State Machine Execution
  switch (currentState) {
    case STATE_STANDBY:
      digitalWrite(PIN_STATUS_LED, (now / 500) % 2); // Slow blink
      if (digitalRead(PIN_START_BUTTON) == LOW) {
        delay(50); // Debounce
        if (digitalRead(PIN_START_BUTTON) == LOW) {
          currentState = STATE_COUNTDOWN;
          stateStartTime = now;
          Serial.println(F("📢 [STATE] Button pressed! Starting 3-second countdown..."));
          tone(PIN_BUZZER, 1000, 150);
        }
      }
      break;

    case STATE_COUNTDOWN:
      digitalWrite(PIN_STATUS_LED, HIGH);
      if (now - stateStartTime >= 3000) {
        currentState = STATE_AUTONOMOUS_NAV;
        stateStartTime = now;
        tone(PIN_BUZZER, 2000, 400);
        Serial.println(F("🚀 [STATE] Mission Launched! Navigating arena autonomously."));
      }
      break;

    case STATE_AUTONOMOUS_NAV: {
      // Watchdog failsafe: automatically stop if time exceeds 45s
      if (now - stateStartTime >= MISSION_TIMEOUT_MS) {
        currentState = STATE_FAILSAFE_HALT;
        brakeMotors();
        Serial.println(F("⚠️ [FAILSAFE] Mission timeout watchdog reached; stopping."));
        break;
      }

      int dist = getDistanceCm();
      if (dist <= 18) {
        currentState = STATE_OBSTACLE_AVOID;
        stateStartTime = now;
        Serial.print(F("⚡ [OBSTACLE] Detected at ")); Serial.print(dist); Serial.println(F(" cm! Evasive maneuver."));
        break;
      }

      // 3-Sensor Line Navigation
      int l = analogRead(PIN_LINE_LEFT);
      int c = analogRead(PIN_LINE_CENTER);
      int r = analogRead(PIN_LINE_RIGHT);

      if (c < 400) {
        setMotors(160, 160); // Straight on line
      } else if (l < 400) {
        setMotors(80, 170);  // Steer left
      } else if (r < 400) {
        setMotors(170, 80);  // Steer right
      } else {
        setMotors(130, 130); // Search forward
      }
      break;
    }

    case STATE_OBSTACLE_AVOID:
      // Obstacle Evasion Sequence: Brake -> Back up -> Pivot right -> Resume
      if (now - stateStartTime < 200) {
        brakeMotors();
      } else if (now - stateStartTime < 500) {
        setMotors(-120, -120); // Reverse
      } else if (now - stateStartTime < 850) {
        setMotors(-140, 140);  // Pivot right
      } else {
        currentState = STATE_AUTONOMOUS_NAV;
        Serial.println(F("✅ [OBSTACLE] Evasion complete. Resuming navigation."));
      }
      break;

    case STATE_MISSION_COMPLETE:
      brakeMotors();
      digitalWrite(PIN_STATUS_LED, HIGH);
      break;

    case STATE_FAILSAFE_HALT:
      brakeMotors();
      digitalWrite(PIN_STATUS_LED, (now / 100) % 2); // Rapid error blink
      break;
  }
}

int getDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long dur = pulseIn(PIN_ECHO, HIGH, 18000);
  if (dur == 0) return 999;
  return (dur * 0.0343) / 2;
}

void setMotors(int leftPwm, int rightPwm) {
  digitalWrite(PIN_AIN1, leftPwm >= 0 ? HIGH : LOW);
  digitalWrite(PIN_AIN2, leftPwm >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMA, constrain(abs(leftPwm), 0, 255));

  digitalWrite(PIN_BIN1, rightPwm >= 0 ? HIGH : LOW);
  digitalWrite(PIN_BIN2, rightPwm >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMB, constrain(abs(rightPwm), 0, 255));
}

void brakeMotors() {
  digitalWrite(PIN_AIN1, HIGH); digitalWrite(PIN_AIN2, HIGH); analogWrite(PIN_PWMA, 0);
  digitalWrite(PIN_BIN1, HIGH); digitalWrite(PIN_BIN2, HIGH); analogWrite(PIN_PWMB, 0);
}

void printTelemetry() {
  Serial.print(F("[TELEM] State: "));
  switch (currentState) {
    case STATE_STANDBY:          Serial.print(F("STANDBY")); break;
    case STATE_COUNTDOWN:        Serial.print(F("COUNTDOWN")); break;
    case STATE_AUTONOMOUS_NAV:   Serial.print(F("AUTO_NAV")); break;
    case STATE_OBSTACLE_AVOID:   Serial.print(F("OBSTACLE_AVOID")); break;
    case STATE_MISSION_COMPLETE: Serial.print(F("COMPLETE")); break;
    case STATE_FAILSAFE_HALT:    Serial.print(F("FAILSAFE_HALT")); break;
  }
  Serial.print(F(" | MissionTime: ")); Serial.print((millis() - stateStartTime) / 1000);
  Serial.println(F("s"));
}
\`,
      pinMap: {
        'Pin 2': 'Momentary Mission Start Button (INPUT_PULLUP)',
        'Pin 13': 'Onboard Status LED / Annunciator',
        'Pin A3': 'Piezo Buzzer Audio State Annunciator',
        'Pin 4': 'HC-SR04 Sonar Trigger 10us pulse',
        'Pin 11': 'HC-SR04 Sonar Echo duration pulse',
        'Pin 5': 'TB6612 Left Motor PWM speed output',
        'Pin 6': 'TB6612 Right Motor PWM speed output',
        'Pin 7': 'TB6612 Left Motor Direction In1',
        'Pin 8': 'TB6612 Left Motor Direction In2',
        'Pin 9': 'TB6612 Right Motor Direction In1',
        'Pin 10': 'TB6612 Right Motor Direction In2',
        'Pin 12': 'TB6612 Standby Enable (Active HIGH)',
        'Pin A0': 'Left Line Sensor analog reflectance',
        'Pin A1': 'Center Line Sensor analog reflectance',
        'Pin A2': 'Right Line Sensor analog reflectance'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB; compile and upload capstone demonstration firmware.',
        '2. Open Serial Monitor at 9600 baud; observe standby status telemetry stream.',
        '3. Position rover on arena start line facing course path.',
        '4. Press momentary push button on Pin 2 to begin 3-second audible countdown.',
        '5. Observe rover execute autonomous mission with live state reporting and fail-safe watchdog timer.'
      ],
      explanations: [
        'Finite State Machine (FSM): Clear, robust state separation prevents conflicting motor commands and simplifies debugging.',
        'Watchdog Timer (MISSION_TIMEOUT_MS): Guarantees the robot will halt after 45 seconds even if finish line is missed, preventing motor burns.',
        'Diagnostic Telemetry: Streaming current state and mission time over Serial provides transparency during jury defense.'
      ],
      expectedResult: 'System displays clean countdown, drives autonomously through course, avoids obstacle seamlessly, and reports real-time state telemetry to jury display.',
      caveats: [
        'Ensure start button circuit is debounced properly to avoid premature accidental launch.',
        'Confirm battery voltage is above 7.4V before starting demonstration to maintain repeatable motor speeds.'
      ],
      tweakTip: 'Connect a HC-05 Bluetooth module to Serial pins to stream telemetry wirelessly to a tablet in the jury gallery!'
    },
    activity: {
      title: 'Deliver Technical Defense & Autonomous Arena Demonstration',
      steps: [
        'Step 1: Stage robot at inspection station; perform final battery voltage and mechanical fastener check.',
        'Step 2: Deliver 5-minute technical Critical Design Review presentation with slides and subsystem diagrams.',
        'Step 3: Defend engineering tradeoffs (gear ratios, power budget, sensor selection) before the jury panel.',
        'Step 4: Place robot in competition arena; press start button and execute live autonomous mission.',
        'Step 5: Explain real-time telemetry stream as rover navigates course and navigates obstacles.',
        'Step 6: Receive jury evaluation, recite the RoboBEE Innovators Creed, and accept graduation certificate.'
      ],
      successCriteria: [
        'Delivered 5-minute technical defense with quantitative equations and empirical test evidence.',
        'Completed live autonomous arena demonstration exhibiting obstacle avoidance and fail-safe recovery.',
        'Handled jury cross-examination questions with professional composure and telemetry data.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Robot does not respond when start button on Pin 2 is pressed.', 
        checks: [
          'Step 1: Check Serial Monitor—is the system in STATE_STANDBY?',
          'Step 2: Verify button wiring: one terminal to Pin 2, the other terminal to GND.',
          'Step 3: Test with a direct jumper wire bridging Pin 2 to GND to rule out a faulty switch contact.'
        ], 
        explanation: 'Pin 2 is configured with internal pull-up resistor (INPUT_PULLUP); it requires a clean connection to GND to register a LOW state.' 
      },
      { 
        symptom: 'Robot executes countdown and buzzes, but motors do not spin when autonomous state begins.', 
        checks: [
          'Step 1: Verify the hardware master battery toggle switch is turned ON.',
          'Step 2: Check TB6612 STBY pin (Pin 12): is it driven HIGH (+5V)?',
          'Step 3: Check battery voltage under load using a multimeter: did voltage collapse below 6V?'
        ], 
        explanation: 'The TB6612 standby pin disables all H-bridge outputs when LOW; also, a depleted battery cannot supply motor stall current.' 
      },
      { 
        symptom: 'Robot stops moving after 45 seconds and status LED blinks rapidly.', 
        checks: [
          'Step 1: This is not a bug; this is the software Watchdog Timer working correctly!',
          'Step 2: Check Serial Monitor output: "[FAILSAFE] Mission timeout watchdog reached; stopping."',
          'Step 3: If course is longer than 45 seconds, increase MISSION_TIMEOUT_MS in firmware.'
        ], 
        explanation: 'The watchdog failsafe timer prevents runaway robots and protects motors from burning out if trapped in a corner.' 
      },
      { 
        symptom: 'Robot veers off track during live demo when arena spotlights are turned on.', 
        checks: [
          'Step 1: Maintain demonstration poise! Calmly explain the environmental shift to the jury.',
          'Step 2: Explain to judges: "High-intensity incandescent spotlights emit infrared radiation, saturating phototransistors."',
          'Step 3: Point out the solution in the Revision 2.0 roadmap: adding modulated IR pulsing or physical 3D-printed light shrouds.'
        ], 
        explanation: 'External infrared light from halogen/sunlight floods optical line sensors; explaining the physics demonstrates genuine engineering expertise.' 
      }
    ],
    checksForUnderstanding: [
      'What are the core components of a NASA-standard Critical Design Review (CDR) presentation?',
      'How does an engineer defend a design tradeoff with quantitative evidence rather than personal opinion?',
      'What are the four pillars of the RoboBEE Innovators Creed, and what does each signify?'
    ],
    exitTicket: [
      { 
        question: 'Reflect on your entire robotics journey from Class 01 (blinking an LED) to Class 36 (autonomous rover CDR). What was the most profound engineering lesson you learned?', 
        rubricOrSampleReasoning: 'Student reflects thoughtfully on systems thinking, persistence through physical failures, and how hardware and software must unite seamlessly.' 
      },
      { 
        question: 'How will you handle unexpected equipment glitches or failures in your future engineering career?', 
        rubricOrSampleReasoning: 'Student describes maintaining demonstration poise, consulting telemetry and diagnostic data, isolating root causes, and treating failure as empirical feedback.' 
      },
      { 
        question: 'What is one specific feature you would implement in your robot’s "Revision 2.0 Roadmap" to eliminate technical debt?', 
        rubricOrSampleReasoning: 'Student identifies a concrete, realistic upgrade (e.g., custom PCB to eliminate breadboard jumpers, closed-loop PID encoder control, or active IR modulation for line sensing).' 
      }
    ],
    differentiation: {
      support: ['Provide structured presentation cue cards and speaking queues for team members.'],
      extension: ['Prepare a comprehensive technical whitepaper and portfolio for university engineering admissions.'],
      offlineOption: ['Submit a handwritten 3-page Critical Design Review executive summary and post-mortem retrospective.']
    },
    nextLessonId: undefined,
    nextLessonTeaser: 'Academy Graduation Complete! You are now prepared to design, build, and lead competitive autonomous robotics teams at national and international Olympiads! Dream. Invent. Experiment. Inspire.',
    sources: [
      { title: 'NASA Systems Engineering Handbook (SP-2016-6105 Rev 2)', url: 'https://nasa.gov' },
      { title: 'IEEE Robotics and Automation Society Code of Ethics', url: 'https://ieee.org' }
    ],
    assetCredits: [{ asset: 'Certificate of Robotics Mastery', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-11 and adv-12...');
content = replaceLastTwoLessons(content, adv11, adv12);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-11 and adv-12!');
