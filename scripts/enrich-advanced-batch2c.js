const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

function replaceLesson(fileContent, lessonId, nextLessonId, newBlock) {
  const startRegex = new RegExp(`\\{\\s*id:\\s*['"]${lessonId}['"][\\s\\S]*?(?=\\{\\s*id:\\s*['"]${nextLessonId}['"])`);
  if (!startRegex.test(fileContent)) {
    throw new Error(`Could not find lesson block for ${lessonId} before ${nextLessonId}`);
  }
  return fileContent.replace(startRegex, newBlock.trim() + ',\n\n  ');
}

const adv09 = `  {
    id: 'adv-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-comp-tcrt5000", "fg-comp-hc-sr04", "fg-comp-tb6612fng"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 9,
    code: 'ADVANCED 09',
    title: 'Autonomous Combat & Mini-Sumo Robotics',
    promise: 'By the end of this masterclass, you will engineer an autonomous 500g Mini-Sumo combat robot using a Subsumption Architecture priority hierarchy where edge survival strictly pre-empts opponent attack, integrating downward TCRT5000 border sensors and front ultrasonic rangefinders.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01', 'Advanced 03', 'Advanced 05'],
    outcomes: [
      'Design a Subsumption Architecture priority hierarchy where survival unconditionally overrides attack.',
      'Calibrate downward-facing TCRT5000 optical sensors to detect the 5cm white Tawara border line in <2ms.',
      'Implement autonomous circular arena search patterns (Stationary Radar Spin, Spiral Sweep, Probing Charge).',
      'Analyze the mechanical advantage and traction physics of low-angle front scoop wedges (15°).',
      'Compete in an official autonomous 500g Mini-Sumo match adhering strictly to safety regulations.'
    ],
    vocabulary: [
      { 
        term: 'Subsumption Architecture', 
        plainMeaning: 'A robot brain rule where emergency life-saving rules always jump to the front of the line before attack rules.', 
        technicalMeaning: 'A layered, behavioral robot control architecture where higher-priority competence layers suppress or override lower-priority layers.' 
      },
      { 
        term: 'Tawara White Border', 
        plainMeaning: 'The 5cm wide white warning stripe painted around the edge of the circular black dohyo.', 
        technicalMeaning: 'The high-contrast boundary perimeter line indicating the physical edge of the sumo ring.' 
      },
      { 
        term: 'Priority Arbiter', 
        plainMeaning: 'The master judge code in loop() that decides which sensor wins if two things happen at once.', 
        technicalMeaning: 'A decision-making logic block that resolves conflicting behavioral requests by evaluating hierarchical priority rules.' 
      },
      { 
        term: 'Wedge Scraping Physics', 
        plainMeaning: 'Using a sharp flat front shovel to scoop under an opponent, lifting their wheels off the ground so they cannot push.', 
        technicalMeaning: 'The mechanical technique of lifting an opponent chassis to reduce their wheel normal force to zero, eliminating their traction ($F_f = \\mu N = 0$).' 
      },
      { 
        term: 'Zero-Radius Tank Spin', 
        plainMeaning: 'Spinning the robot like a top by driving one wheel forward and the other wheel backward.', 
        technicalMeaning: 'A differential drive rotational maneuver where wheels rotate in opposite directions at equal velocity, producing pure yaw with zero translational displacement.' 
      },
      { 
        term: '5-Second Grace Countdown', 
        plainMeaning: 'The mandatory 5-second frozen pause before the robot is legally allowed to move in a match.', 
        technicalMeaning: 'The regulatory delay mandated by international sumo rules to permit operators to clear the arena perimeter.' 
      }
    ],
    teacherPrep: [
      'Set up official circular Mini-Sumo dohyo mat (77cm diameter matte black disk with 5cm white border).',
      'Verify student robot chassis pass official 10cm x 10cm box and 500.0g weight inspection.'
    ],
    verifiedMaterials: [
      'Autonomous Mini-Sumo Combat Robot (dual TCRT5000 edge sensors, front sonar, TB6612 driver)',
      'Official 77cm circular Mini-Sumo Dohyo competition mat',
      'High-friction silicone tire sets and front aluminum wedge blades',
      'Dummy opponent target blocks (weighted 300g cylinders)',
      'Precision digital gram scale and millisecond stopwatch'
    ],
    safetyNotes: [
      'Non-destructive rules: strictly zero sharp cutting blades, spinning weapons, or sticky adhesives.',
      'Keep fingers clear of high-torque wheels during active combat engagement.',
      'Always test edge evasion routines alone on the dohyo before introducing an opponent.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display Japanese national 500g Mini-Sumo championship finals: show high-speed edge recoveries and wedge lifts.', 
        studentAction: 'Analyze why surviving the edge is mathematically 10x more important than charging an opponent.' 
      },
      { 
        segment: '10–25m Priority Logic', 
        minutes: 15, 
        teacherAction: 'Teach Subsumption Priority Hierarchy: Layer 0 (Edge Survival) > Layer 1 (Radar Lock Charge) > Layer 2 (Search Sweep). Explain return; statements.', 
        studentAction: 'Code deterministic priority ladder in C++ using clean state pre-emption.' 
      },
      { 
        segment: '25–50m Arena Practice', 
        minutes: 25, 
        teacherAction: 'Supervise dohyo trials: test 30-second solo edge survival, followed by autonomous target acquisition and push-out.', 
        studentAction: 'Calibrate edge reverse-and-spin angles; achieve 100% ring retention across 5 consecutive trials.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Host round-robin friendly matches and evaluate fail-safe priority execution.', 
        studentAction: 'Log match performance and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Subsumption Architecture: Rodney Brooks\\' Behavioral Hierarchy',
        explanation: 'In autonomous combat robotics, classic sequential programming fails. If your robot sees an opponent outside the ring and charges forward without verifying floor safety, it will drive itself straight off the edge into oblivion! We implement Rodney Brooks\\' Subsumption Architecture: behaviors are decomposed into layered competency tiers: \\n• Layer 0 (SURVIVAL): Bottom IR edge detection. If white border seen ➔ REVERSE & SPIN! \\n• Layer 1 (ATTACK): Front distance sensor. If opponent within 40cm ➔ CHARGE 100% PWM! \\n• Layer 2 (SEARCH): Idle scan. Rotate in place to radar-sweep the circular ring. \\nLayer 0 unconditionally subsumes (overrides) Layer 1 and Layer 2 on every single loop iteration.',
        instructorNote: 'Draw the layered architecture diagram: show how Layer 0 cuts the wire of Layer 1 whenever the white border is touched.'
      },
      {
        title: '2. Downward TCRT5000 Optical Border Sensing Physics',
        explanation: 'The dohyo ring surface is matte black (reflectance ~5%), while the outer 5cm Tawara border is brilliant white (reflectance ~85%). Two downward-facing TCRT5000 optical sensors are mounted at the extreme front corners, positioned 3mm to 5mm above the mat. Over the black floor, the phototransistor turns OFF, pulling analog voltage HIGH. The instant a sensor crosses onto the white line, optical reflectance surges, pulling voltage LOW. Using digital interrupts or high-speed analog thresholds, the microcontroller detects the edge in less than 2 milliseconds!',
        instructorNote: 'Demonstrate sensor contrast on the DMM: show the massive voltage swing from black mat (4.2V) to white border (0.4V).'
      },
      {
        title: '3. Circular Dohyo Geometry & Autonomous Search Trajectories',
        explanation: 'A standard Mini-Sumo dohyo has a 77cm diameter ($Area \\approx 0.466\\text{ m}^2$). Because you cannot predict where the opponent will move after the 5-second countdown, autonomous search routines dominate: 1. Stationary Radar Spin: The robot executes a zero-radius tank pivot at 120 PWM, sweeping its front ultrasonic rangefinder across 360 degrees in ~0.8 seconds. 2. Spiral Outward Sweep: Gently driving in an expanding spiral to sweep the ring center. 3. Probing Yoyo: Charging forward 20cm, backing up 10cm, and sweeping. The instant the distance reading drops below 40cm, radar lock is achieved!',
        instructorNote: 'Map out search trajectories on the board: show why high-speed rotation provides the fastest target acquisition.'
      },
      {
        title: '4. Wedge Scraping Mechanics & The Normal Force Neutralizer',
        explanation: 'In robot-sumo, pushing victory is governed by Coulomb Friction: $F_{push} \\le \\mu \\cdot N$. Both robots have a maximum weight of 500g ($N = 4.9\\text{ N}$). If two robots collide head-on, the robot with the lower front scoop wins. Why? A razor-sharp 15-degree wedge blade slides beneath the opponent’s front bumper as they push forward. As the opponent rides up your wedge, their drive wheels are lifted off the dohyo floor! Their normal force becomes ZERO ($N_{opponent} = 0$), destroying their traction completely, while your normal force doubles ($N_{you} = 4.9\\text{N} + 4.9\\text{N} = 9.8\\text{N}$), giving you 2x pushing grip!',
        instructorNote: 'Demonstrate with two toy cars: slide a wedge under one car and show how its spinning wheels have zero push.'
      },
      {
        title: '5. High-Torque DC Motor Sizing & Over-Voltage Duty Cycles',
        explanation: 'Standard DC motors rated for 6V (such as 50:1 micro metal gearmotors delivering 1.5 kg-cm torque at stall) are routinely powered from 7.4V or 8.4V Li-Po battery packs in competition. In a 3-minute sumo match, the duty cycle consists of short 3-second bursts of maximum stall pushing. Operating 6V motors at 8.4V increases magnetic flux density and current by 40%, delivering massive peak stall torque. As long as thermal mass absorbs the heat during short rounds, the motors survive easily while overpowering competitors.',
        instructorNote: 'Explain thermal limits: running 6V motors at 8.4V for 10 minutes melts them; running them for 10 seconds wins the match.'
      },
      {
        title: '6. Edge Evasion Maneuvers & Gyro-Assisted Spin-Backs',
        explanation: 'What happens when your robot detects the white edge while charging at full speed? An amateur robot merely hits reverse. But reversing in a straight line keeps the robot facing the edge, and momentum leaves it vulnerable to an opponent pushing from the flank! A competition edge evasion routine executes an Escape Choreography: 1. Instant reverse (220 PWM) for 250ms to pull the front scoop back inside the black zone. 2. Immediate zero-radius tank spin (120° to 180°) toward the center of the ring. 3. Re-engage search sweep facing inward.',
        instructorNote: 'Demonstrate the escape maneuver on the dohyo: watch the robot bounce off the border and spin back to center like a billiard ball.'
      }
    ],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Autonomous Mini-Sumo Combat Robot',
      deliverableType: 'physical_build',
      successEvidence: [
        'Mini-Sumo robot strictly complies with 10.0cm x 10.0cm footprint and <= 500.0g competition limits.',
        'Subsumption architecture firmware guarantees 100% white border Tawara survival during continuous 30-second solo ring trials.',
        'Autonomously radar-scans dohyo, acquires 300g dummy opponent within 40cm, and expels it from the arena in under 10 seconds.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Mini-Sumo Metal Chassis (10x10cm)', 'Dual Downward TCRT5000 Edge Sensors', 'HC-SR04 or VL53L0X Front Rangefinder', 'TB6612FNG High-Current Driver', 'Arduino Nano or Uno Rev3'],
      componentList: [
        { name: 'Mini-Sumo Chassis Kit', exactVariant: 'Aluminum / stiff 3D-printed 10cm x 10cm chassis with steel front scoop', quantity: 1 },
        { name: 'Micro Metal Gearmotors', exactVariant: '6V 50:1 high-torque N20 gearmotors with high-grip silicone tires', quantity: 2 },
        { name: 'Downward Optical Sensors', exactVariant: 'TCRT5000 infrared reflectance modules mounted at front corners', quantity: 2 },
        { name: 'Front Opponent Sonar', exactVariant: 'HC-SR04 ultrasonic rangefinder or VL53L0X laser distance sensor', quantity: 1 },
        { name: 'Motor Driver', exactVariant: 'TB6612FNG dual 1.2A H-Bridge breakout with common ground', quantity: 1 },
        { name: 'Power Pack', exactVariant: '2S 7.4V 800mAh high-discharge Li-Po battery with master power switch', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/mini_sumo_priority_wiring.svg',
      schematic: 'Left Edge ➔ A0 | Right Edge ➔ A1 | Sonar: Trig ➔ 4, Echo ➔ 11 | Motors: 5,6,7,8,9,10,12 | Start Button ➔ Pin 2 (INT0). Fused 7.4V.',
      wireTable: [
        { from: 'Left TCRT5000 Analog Out', to: 'Arduino Analog Pin A0', wireOrPolarityNote: 'Left border reflectance (LOW on white)' },
        { from: 'Right TCRT5000 Analog Out', to: 'Arduino Analog Pin A1', wireOrPolarityNote: 'Right border reflectance (LOW on white)' },
        { from: 'HC-SR04 Sonar Trig / Echo', to: 'Arduino Digital Pins 4 & 11', wireOrPolarityNote: 'Front opponent detection radar' },
        { from: 'Tactile Referee Start Switch', to: 'Arduino Digital Pin 2', wireOrPolarityNote: 'INPUT_PULLUP (active LOW start signal)' },
        { from: 'TB6612 Driver Leads', to: 'Arduino Pins 5, 6 (PWM), 7, 8, 9, 10, 12 (Dirs/STBY)', wireOrPolarityNote: 'High-current motor actuation' },
        { from: '2S 7.4V Battery (+)', to: 'Master Switch ➔ 3A Fuse ➔ TB6612 VM', wireOrPolarityNote: 'Raw high-current motor bus' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount downward TCRT5000 edge sensors 3mm to 4mm above the arena floor at front left and right corners.',
        '2. Mount front ultrasonic or laser distance sensor pointing directly forward parallel to floor.',
        '3. Wire all power and signal leads according to table; ensure 3A inline fuse is installed.',
        '4. Upload Subsumption combat firmware with 5-second referee delay.',
        '5. Place robot in center of dohyo; press start button and step back 1.5 meters.',
        '6. Verify robot sits frozen for 5.0 seconds, commences radar spin, locks onto dummy target, and charges.'
      ],
      powerAndSafetyChecks: [
        'Inspect front scoop blade: edges must be deburred and non-hazardous to human skin.',
        'Confirm edge sensors trigger consistently on white tape before introducing physical opponents.',
        'Ensure master power switch is instantly accessible on the top chassis plate.'
      ],
      testCases: [
        { action: 'Robot encounters white Tawara border line', expectedResult: 'Motors reverse at 220 PWM in <5ms, spin 140° back toward center, and resume search.' },
        { action: 'Opponent placed 30cm in front of robot', expectedResult: 'Radar locks onto target; motors accelerate to 255 PWM (100% full torque push).' },
        { action: 'Simultaneous edge detect while charging target', expectedResult: 'Edge Survival strictly overrides attack: robot reverses immediately, preserving ring retention.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 09
// Autonomous 500g Mini-Sumo Combat Controller
// Subsumption Priority Hierarchy: Layer 0 (Survival) > Layer 1 (Attack) > Layer 2 (Search)

#include <Arduino.h>

// Sensor Pin Definitions
const int PIN_EDGE_L   = A0; // Downward IR: LOW = White Border Line
const int PIN_EDGE_R   = A1; // Downward IR: LOW = White Border Line
const int PIN_SONAR_TRIG = 4;
const int PIN_SONAR_ECHO = 11;
const int PIN_START_BTN  = 2; // Referee start switch (INPUT_PULLUP)

// Motor Driver Pins (TB6612FNG)
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;
const int PIN_STBY = 12;

// Optical Border Threshold (0-1023: White < 350, Black > 700)
const int THRESHOLD_EDGE_WHITE = 400;
const int ATTACK_RANGE_CM      = 40; // Front opponent lock distance

enum class MatchMode { REFEREE_WAIT, COUNTDOWN_5S, ACTIVE_COMBAT };
MatchMode currentMode = MatchMode::REFEREE_WAIT;

void setup() {
  pinMode(PIN_START_BTN, INPUT_PULLUP);
  pinMode(PIN_SONAR_TRIG, OUTPUT);
  pinMode(PIN_SONAR_ECHO, INPUT);

  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE AUTONOMOUS MINI-SUMO COMBAT   "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Armed. Awaiting referee start button."));
}

void loop() {
  switch (currentMode) {
    case MatchMode::REFEREE_WAIT:
      if (digitalRead(PIN_START_BTN) == LOW) {
        delay(50); // Debounce
        if (digitalRead(PIN_START_BTN) == LOW) {
          Serial.println(F("[REFEREE START] Commencing 5.0-second delay..."));
          currentMode = MatchMode::COUNTDOWN_5S;
          delay(5000); // Official Mandatory 5.0s Regulatory Freeze!
          Serial.println(F("⚔️ [COMBAT ACTIVE] Engines Engaged!"));
          currentMode = MatchMode::ACTIVE_COMBAT;
        }
      }
      break;

    case MatchMode::ACTIVE_COMBAT:
      executeSubsumptionHierarchy();
      break;

    default:
      break;
  }
}

void executeSubsumptionHierarchy() {
  // -------------------------------------------------------------------------
  // LAYER 0: SURVIVAL ARBITER (Highest Priority: Edge Retention)
  // -------------------------------------------------------------------------
  int edgeL = analogRead(PIN_EDGE_L);
  int edgeR = analogRead(PIN_EDGE_R);

  if (edgeL < THRESHOLD_EDGE_WHITE || edgeR < THRESHOLD_EDGE_WHITE) {
    Serial.println(F("⚠️ [LAYER 0: EDGE DETECTED] Emergency reverse and spin-back!"));

    // Step 1: Instant high-torque reverse
    drive(-230, -230);
    delay(220);

    // Step 2: Spin back toward ring center
    if (edgeL < THRESHOLD_EDGE_WHITE && edgeR >= THRESHOLD_EDGE_WHITE) {
      drive(200, -200); // Left hit edge -> spin right
      delay(200);
    } else {
      drive(-200, 200); // Right hit edge -> spin left
      delay(200);
    }

    return; // PRE-EMPT: Skip all lower layers; re-verify edge safety immediately!
  }

  // -------------------------------------------------------------------------
  // LAYER 1: ATTACK ARBITER (Medium Priority: Opponent Charge)
  // -------------------------------------------------------------------------
  float opponentDistance = readDistanceCm();

  if (opponentDistance > 0 && opponentDistance <= ATTACK_RANGE_CM) {
    Serial.print(F("🎯 [LAYER 1: RADAR LOCK] Target at "));
    Serial.print(opponentDistance);
    Serial.println(F(" cm! CHARGE 100% PWM!"));

    // Full-throttle frontal bulldozer charge
    drive(255, 255);
    return; // Target locked; maintain attack
  }

  // -------------------------------------------------------------------------
  // LAYER 2: SEARCH ARBITER (Lowest Priority: Arena Radar Sweep)
  // -------------------------------------------------------------------------
  // Rotate smoothly in place to sweep ultrasonic beam across circular ring
  drive(-130, 130);
}

float readDistanceCm() {
  digitalWrite(PIN_SONAR_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_SONAR_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_SONAR_TRIG, LOW);

  long duration = pulseIn(PIN_SONAR_ECHO, HIGH, 15000); // 15ms timeout (~2.5m)
  if (duration == 0) return 999.0;
  return (duration * 0.0343) / 2.0;
}

void drive(int l, int r) {
  digitalWrite(PIN_AIN1, l >= 0 ? HIGH : LOW);
  digitalWrite(PIN_AIN2, l >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMA, abs(l));

  digitalWrite(PIN_BIN1, r >= 0 ? HIGH : LOW);
  digitalWrite(PIN_BIN2, r >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMB, abs(r));
}

void brake() {
  digitalWrite(PIN_AIN1, HIGH); digitalWrite(PIN_AIN2, HIGH); analogWrite(PIN_PWMA, 0);
  digitalWrite(PIN_BIN1, HIGH); digitalWrite(PIN_BIN2, HIGH); analogWrite(PIN_PWMB, 0);
}
\`,
      pinMap: {
        'Pin A0 & A1': 'Downward TCRT5000 Left and Right edge sensors (Analog)',
        'Pins 4 & 11': 'HC-SR04 Sonar Trig and Echo pins',
        'Pin 2': 'Referee tactile start switch (INPUT_PULLUP)',
        'Pins 5, 6': 'TB6612 PWMA and PWMB motor speed pins',
        'Pins 7, 8, 9, 10, 12': 'TB6612 motor direction and STBY pins'
      },
      setupAndUpload: [
        '1. Mount downward IR sensors 3mm above floor; connect to Pins A0 and A1.',
        '2. Mount front sonar and connect to Pins 4 and 11.',
        '3. Upload combat firmware via Arduino IDE.',
        '4. Place robot on black dohyo; press start button and step back.',
        '5. Observe 5.0-second pause, radar search rotation, edge bounce-back, and target charge.'
      ],
      explanations: [
        'Subsumption Layering: Layer 0 uses return; to pre-emptively abort lower-tier attack logic whenever the edge is tripped.',
        'pulseIn timeout (15ms): Limits ultrasonic echo listening to 2.5 meters so the CPU never freezes waiting for lost pulses.',
        'Spin-Back Routine: Reverses and turns 140° upon edge detection, keeping the robot facing inward toward the ring center.'
      ],
      expectedResult: 'Robot stays inside the white Tawara border indefinitely during solo runs, locks onto targets within 40cm, and charges at full power.',
      caveats: [
        'Ensure edge sensors are mounted no higher than 5mm above the mat; higher elevations fail to detect the white contrast line.',
        'Never place Layer 0 after Layer 1 in software; doing so will cause the robot to charge out of the ring.'
      ],
      tweakTip: 'Add dual front ultrasonic sensors (Left-Front and Right-Front) to steer proportionally toward moving opponents during the charge!'
    },
    activity: {
      title: 'Calibrate and Compete in Autonomous Mini-Sumo Trials',
      steps: [
        'Step 1: Calibrate downward TCRT5000 sensors on black mat (must read >700) and white tape (must read <350).',
        'Step 2: Upload combat firmware; verify 5.0-second stationary freeze upon button press.',
        'Step 3: Test solo edge survival: place robot in ring for 30 seconds; confirm it never touches floor outside white border.',
        'Step 4: Place a 300g weighted dummy target block in the ring; verify robot radar locks and expels target.',
        'Step 5: Inspect front scoop blade for clean ground contact (blade must touch floor to lift opponent).',
        'Step 6: Execute 3 official match rounds against classmate robots; log victory/defeat metrics.'
      ],
      successCriteria: [
        'Robot survives 30 seconds of solo operation inside the circular dohyo with 0 border ring-outs.',
        'Front distance sensor locks onto opponent targets within 40cm and executes full-power charge.',
        'Subsumption priority successfully prevents edge departures even during active combat charges.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Robot drives straight out of the ring while chasing an opponent target.', 
        checks: [
          'Step 1: Check code order in loop()—is Layer 0 (Edge Survival) evaluated BEFORE Layer 1 (Attack)?',
          'Step 2: Check edge sensor response time—did someone insert a blocking delay() inside the attack block?',
          'Step 3: Measure optical sensor height—is it higher than 5mm off the floor?'
        ], 
        explanation: 'If attack logic executes before the edge check, the robot prioritizes charging the target over staying inside the ring, causing self-elimination.' 
      },
      { 
        symptom: 'Robot detects ghost edges in the middle of the black ring and turns randomly.', 
        checks: [
          'Step 1: Check THRESHOLD_EDGE_WHITE—is it set too close to the black floor reflectance reading?',
          'Step 2: Inspect the black dohyo surface for floor scuffs or reflections from overhead ceiling lights.',
          'Step 3: Lower THRESHOLD_EDGE_WHITE from 400 down to 300 in code.'
        ], 
        explanation: 'If the threshold is set too high, ambient lighting reflections or gray floor patches falsely trip the edge detection comparator.' 
      },
      { 
        symptom: 'Front ultrasonic sensor fails to detect the opponent, spinning past them repeatedly.', 
        checks: [
          'Step 1: Check spinning search speed—is the robot rotating too fast for sound waves to return (343 m/s)?',
          'Step 2: Reduce search spin speed from 130 PWM down to 105 PWM.',
          'Step 3: Check pulseIn timeout—ensure it is set to at least 15000 microseconds (2.5 meters).'
        ], 
        explanation: 'At excessive rotation speeds, the ultrasonic sensor rotates past the echo cone before the acoustic wave bounces back from the target.' 
      },
      { 
        symptom: 'Opponent robot rides over your front scoop and pushes your robot out.', 
        checks: [
          'Step 1: Check scoop angle—is the front blade angled steeper than 20 degrees?',
          'Step 2: Flatten scoop angle to 12-15 degrees so it acts as a low wedge rather than a vertical wall.',
          'Step 3: Ensure front scoop blade touches the floor without catching on tape seams.'
        ], 
        explanation: 'A steep scoop provides mechanical leverage for the opponent to climb over; a low 15-degree wedge slides under the opponent to lift their wheels.' 
      }
    ],
    checksForUnderstanding: [
      'Why is Subsumption Architecture superior to monolithic sequential code in combat robotics?',
      'How does lifting an opponent’s wheels with a wedge blade reduce their pushing traction to zero?',
      'Why must the edge escape maneuver include a rotational turn and not merely a straight reverse?'
    ],
    exitTicket: [
      { 
        question: 'In a Subsumption Architecture, why must the Edge Survival behavior include a "return;" statement?', 
        rubricOrSampleReasoning: 'The "return;" statement immediately aborts the current loop cycle, pre-empting lower-priority attack logic and forcing the microcontroller to immediately re-evaluate edge safety.' 
      },
      { 
        question: 'What happens to an opponent robot\\'s pushing force if your front wedge lifts its drive wheels 2mm off the arena mat?', 
        rubricOrSampleReasoning: 'Lifting its wheels reduces its normal force to zero (N = 0); according to Coulomb friction (F = u * N), its available pushing traction drops instantly to zero.' 
      },
      { 
        question: 'Why do downward optical border sensors require microsecond reaction times in 500g Mini-Sumo robots?', 
        rubricOrSampleReasoning: 'A robot charging at 1.5 m/s crosses the 5cm white Tawara border in only 33 milliseconds; delayed sensor response causes the robot to fly off the ring before brakes can engage.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-calibrated analog edge threshold ranges for standard black poster board.'],
      extension: ['Add a second pair of rear corner edge sensors to enable 360-degree boundary defense.'],
      offlineOption: ['Analyze high-speed tournament video to diagram the tactical physics of wedge collisions.']
    },
    nextLessonId: 'adv-10',
    nextLessonTeaser: 'Advanced 10: Verification, Reliability & Failure Analysis — Conduct formal Failure Mode and Effects Analysis (FMEA), stress-test MTBF, and eliminate vibration bugs!',
    sources: [{ title: 'Rodney Brooks: A Robust Layered Control System for a Mobile Robot (Subsumption Architecture)', url: 'https://mit.edu' }],
    assetCredits: [{ asset: 'Mini-Sumo Dohyo Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-09...');
content = replaceLesson(content, 'adv-09', 'adv-10', adv09);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-09!');
