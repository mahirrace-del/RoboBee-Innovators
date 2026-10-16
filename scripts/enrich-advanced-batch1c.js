const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Helper to replace lesson
function replaceLesson(fileContent, lessonId, nextLessonId, newBlock) {
  const startRegex = new RegExp(`\\{\\s*id:\\s*['"]${lessonId}['"][\\s\\S]*?(?=\\{\\s*id:\\s*['"]${nextLessonId}['"])`);
  if (!startRegex.test(fileContent)) {
    throw new Error(`Could not find lesson block for ${lessonId} before ${nextLessonId}`);
  }
  return fileContent.replace(startRegex, newBlock.trim() + ',\n\n  ');
}

const adv04 = `  {
    id: 'adv-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-encoders-odometry"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics", "fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 4,
    code: 'ADVANCED 04',
    title: 'Encoders and Motion Measurement: Odometry',
    promise: 'By the end of this masterclass, you will connect slotted optical wheel encoders, write hardware interrupt service routines (ISRs) with attachInterrupt(), calculate real-world physical distance traveled in millimeters using wheel kinematics, and implement closed-loop distance deceleration.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03'],
    outcomes: [
      'Connect dual slotted optical wheel encoders (LM393) to hardware interrupt pins (Pins 2 and 3).',
      'Author high-speed Interrupt Service Routines (ISRs) with volatile tick counters.',
      'Derive wheel kinematic equations converting raw tick pulses into physical distance in millimeters.',
      'Calculate differential vehicle heading changes using dual-wheel displacement delta math.',
      'Implement closed-loop distance deceleration profiles to eliminate wheel-skid stopping errors.'
    ],
    vocabulary: [
      { 
        term: 'Wheel Odometry', 
        plainMeaning: 'Measuring how far your robot has traveled and which way it turned by counting wheel clicks.', 
        technicalMeaning: 'The estimation of a mobile robot’s position and orientation over time by integrating wheel rotation measurements.' 
      },
      { 
        term: 'Photo-Interrupter Module', 
        plainMeaning: 'A tiny U-shaped plastic sensor that shines an invisible beam of infrared light across a slot.', 
        technicalMeaning: 'An optoelectronic sensor comprising an infrared LED and phototransistor across an optical gap, outputting digital pulses when beam is broken.' 
      },
      { 
        term: 'Slotted Encoder Disc', 
        plainMeaning: 'A circular plastic gear with 20 cut-out windows that spins inside the optical sensor slot.', 
        technicalMeaning: 'An optical chopper disc with radial apertures attached to a motor shaft to modulate an optical beam into discrete pulses.' 
      },
      { 
        term: 'Kinematic Resolution (mm/tick)', 
        plainMeaning: 'How many millimeters the robot rolls forward on the floor every time one slot passes the sensor.', 
        technicalMeaning: 'The linear ground distance traveled per optical pulse, determined by wheel circumference divided by disc slot count ($C / N$).' 
      },
      { 
        term: 'Wheel Slip Error', 
        plainMeaning: 'When the wheels spin on slippery tiles without moving the robot, tricking the encoders into thinking you moved.', 
        technicalMeaning: 'Loss of traction between tire and ground surface causing odometry discrepancies between calculated distance and actual ground displacement.' 
      },
      { 
        term: 'Trapezoidal Deceleration', 
        plainMeaning: 'Slowing down smoothly before you reach your target stopping spot so the robot does not slide past the line.', 
        technicalMeaning: 'A motion control velocity profile that ramps down speed proportionally as remaining distance approaches zero to prevent inertial overshoot.' 
      }
    ],
    teacherPrep: [
      'Inspect 20-slot encoder discs and LM393 photo-interrupter modules; verify discs spin freely in slots without rubbing.',
      'Prepare a 1.0-meter precision test track marked in centimeters on the classroom floor.'
    ],
    verifiedMaterials: [
      '2WD Mobile Rover with dual 1:48 TT gearmotors and 65mm rubber wheels',
      'Dual LM393 optical slotted speed sensor modules',
      '20-slot slotted black plastic encoder discs (26mm diameter)',
      'TB6612FNG dual motor driver breakout board',
      'Arduino Uno Rev3 DIP (with hardware INT0 on Pin 2 and INT1 on Pin 3)',
      'Measuring tape or 1-meter steel rule'
    ],
    safetyNotes: [
      'Never touch spinning slotted encoder discs with fingers or loose hair.',
      'Keep ISR functions strictly minimal (never call Serial.print or delay inside encoder ISRs).',
      'Elevate wheels off the workbench during initial firmware verification.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Hook', 
        minutes: 15, 
        teacherAction: 'Demonstrate "The Open-Loop Drift Catastrophe": run a rover with delay(1000) on high battery vs low battery; show 35cm stopping error!', 
        studentAction: 'Measure wheel diameter ($D=65\\text{mm}$) and calculate theoretical circumference ($C=\\pi D$).' 
      },
      { 
        segment: '15–35m Interrupts', 
        minutes: 20, 
        teacherAction: 'Explain attachInterrupt(0, isrLeft, RISING) and attachInterrupt(1, isrRight, RISING); review volatile atomic sharing.', 
        studentAction: 'Wire LM393 sensors to Pins 2 and 3; upload tick counter sketch and rotate wheel 1 full turn to verify exactly 20 ticks.' 
      },
      { 
        segment: '35–50m Math & Tuning', 
        minutes: 15, 
        teacherAction: 'Derive distance formula: $\\text{mm} = (\\text{ticks} \\times 204.2) / 20 \\approx 10.21 \\times \\text{ticks}$. Supervise 1-meter target stop trials.', 
        studentAction: 'Program closed-loop distance deceleration; tune stopping profile to halt within ±15mm of 1000mm target.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Measure student stopping accuracy and evaluate sources of odometry wheel slip.', 
        studentAction: 'Log measured ground distance vs encoder distance and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Why Open-Loop Timing Fails in Competitive Robotics',
        explanation: 'In open-loop motion, you command \`drive(150, 150); delay(1200);\`. But what happens if the battery drops by 0.5V? Motor RPM drops, and the robot travels 20cm less. What if floor friction changes from smooth tile to rough carpet? The robot stalls. What if one gearbox has slightly more grease? The robot veers in a huge arc. To navigate autonomously, the robot must measure real physical motion. Wheel Encoders close the loop: the firmware commands the robot to move until the wheels physically complete a calculated number of revolutions, rendering navigation immune to battery decay.',
        instructorNote: 'Show the comparison: run time-based stop vs encoder-based stop on the projector track.'
      },
      {
        title: '2. Photo-Interrupter Physics and the LM393 Optical Gate',
        explanation: 'The LM393 optical speed sensor contains an infrared LED on one side of a 5mm U-shaped slot and an NPN phototransistor on the opposite side. When an open slot on the revolving chopper disc aligns with the beam, infrared photons strike the phototransistor base, pulling its collector LOW. When a solid tooth blocks the beam, the phototransistor turns OFF, pulling the signal HIGH through a pullup resistor. An onboard LM393 comparator with built-in hysteresis squares up the analog waveform into a clean, noise-free TTL digital square wave.',
        instructorNote: 'Pass around an optical sensor module: point out the tiny IR LED transmitter and phototransistor receiver facing each other.'
      },
      {
        title: '3. Interrupt Service Routines (ISRs) for Hardware Pin Transitions',
        explanation: 'A 2WD robot moving at 1.0 m/s with 65mm wheels rotates at ~4.9 revolutions per second. With a 20-slot disc, the sensor generates $4.9 \\times 20 \\approx 98$ pulses per second per wheel. If the software attempted to count pulses inside \`loop()\` using \`digitalRead()\`, polling delays would miss pulses whenever the CPU was busy. Instead, we connect the optical outputs to ATmega328P Hardware Interrupt pins (Digital Pin 2 = INT0, Digital Pin 3 = INT1). Hardware interrupts freeze the CPU and run an ISR in <2 microseconds, guaranteeing 100% pulse capture accuracy.',
        instructorNote: 'Explain the RISING trigger mode: interrupts fire only when the signal transitions from LOW (0V) to HIGH (5V).'
      },
      {
        title: '4. Kinematic Odometry Mathematics: Ticks to Millimeters',
        explanation: 'Converting raw optical encoder pulses into real-world physical distance is governed by basic geometry: \\n$$C = \\pi \\times D = 3.14159 \\times 65.0\\text{ mm} = 204.2\\text{ mm}$$\\nSince the encoder disc has exactly 20 slots per revolution, the linear resolution per pulse is: \\n$$\\text{Resolution} = \\frac{C}{N} = \\frac{204.2\\text{ mm}}{20\\text{ ticks}} = 10.21\\text{ mm per tick}$$\\nTo travel a commanded distance of exactly 1.000 meter (1000mm), the target tick count is: \\n$$\\text{Target Ticks} = \\frac{1000\\text{ mm}}{10.21\\text{ mm/tick}} \\approx 98\\text{ ticks}$$',
        instructorNote: 'Have students write the conversion formula in their engineering notebooks: mm = ticks * 10.21.'
      },
      {
        title: '5. Differential Odometry and Vehicle Heading Estimation',
        explanation: 'Encoders do not just measure straight distance—they measure rotation! In a differential drive robot with track width $W$ (distance between left and right wheel contact patches, e.g. 135mm), turning causes one wheel to travel further than the other. The vehicle angular heading change ($\\Delta \\theta$ in radians) is given by: \\n$$\\Delta \\theta = \\frac{\\Delta D_R - \\Delta D_L}{W}$$\\nIf both wheels increment by 50 ticks, the heading change is zero (pure straight line). If the right wheel advances by 30 ticks while the left reverses by 30 ticks, the robot executes a zero-radius tank turn. Odometry tracks both position ($X, Y$) and orientation ($\\theta$) over time.',
        instructorNote: 'Draw the differential arc geometry on the board: show how difference in wheel travel yields arc radius and turn angle.'
      },
      {
        title: '6. Trapezoidal Velocity Profiling & Stopping Precision',
        explanation: 'If a robot cruises at full speed (200 PWM) and abruptly cuts motor power the instant target tick 98 is reached, kinetic momentum ($E_k = \\frac{1}{2} m v^2$) causes the rubber tires to skid across the floor for 5cm to 10cm! To achieve precision stopping, engineers implement a Deceleration Profile: as the remaining distance drops below 15 ticks (150mm), motor PWM is ramped down proportionally from 180 to 90. When target ticks are reached, the H-Bridge triggers active dynamic braking (shorting motor leads), bringing the vehicle to a dead stop within ±10mm of target.',
        instructorNote: 'Demonstrate the difference: show an abrupt cut (skids forward) vs proportional deceleration (stops dead on the line).'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Precision Closed-Loop Odometry Rover',
      deliverableType: 'physical_build',
      successEvidence: [
        'Integrated 2WD rover with dual LM393 optical gate sensors connected to Arduino Pins 2 and 3.',
        'High-speed ISR firmware counting 20-slot encoder pulses on both wheels with zero missed counts.',
        'Executes autonomous 1000mm drive mission, applying proportional deceleration to halt within ±20mm of target line.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 DIP', 'Dual LM393 Optical Gate Sensor Modules', '20-Slot Encoder Discs on TT Gearmotors', 'TB6612FNG Motor Driver'],
      componentList: [
        { name: 'Optical Encoder Modules', exactVariant: 'LM393 photo-interrupter slotted optical speed sensor', quantity: 2 },
        { name: 'Encoder Discs', exactVariant: '20-slot slotted black plastic encoder discs (diameter 26mm)', quantity: 2 },
        { name: 'TT Gearmotors & Wheels', exactVariant: '1:48 gear ratio TT motors with 65mm rubber wheels', quantity: 2 },
        { name: 'TB6612FNG Driver', exactVariant: 'Toshiba dual H-Bridge breakout board with common ground', quantity: 1 },
        { name: 'Arduino Uno Rev3', exactVariant: 'Official Uno R3 with hardware INT0 (Pin 2) and INT1 (Pin 3)', quantity: 1 },
        { name: 'Battery Power Supply', exactVariant: '2S 7.4V Li-Ion battery pack with master toggle switch', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/encoder_odometry_wiring.svg',
      schematic: 'Left Encoder D0 ➔ Pin 2 (INT0). Right Encoder D0 ➔ Pin 3 (INT1). TB6612 on Pins 4, 5, 6, 7, 8, 9, 10. Shared GND.',
      wireTable: [
        { from: 'Left Encoder Module OUT (D0)', to: 'Arduino Digital Pin 2 (INT0)', wireOrPolarityNote: 'Hardware Interrupt 0 pin for left wheel ticks' },
        { from: 'Right Encoder Module OUT (D0)', to: 'Arduino Digital Pin 3 (INT1)', wireOrPolarityNote: 'Hardware Interrupt 1 pin for right wheel ticks' },
        { from: 'Encoder Modules VCC', to: 'Arduino 5V Bus', wireOrPolarityNote: 'Powers optical IR emitter & phototransistor' },
        { from: 'Encoder Modules GND', to: 'Arduino GND Bus', wireOrPolarityNote: 'Logic ground return' },
        { from: 'TB6612 Driver Pins', to: 'Arduino Pins 4, 5, 6, 7, 8, 9, 10', wireOrPolarityNote: 'Standard TB6612 motor control pinout' },
        { from: 'Battery (-) & Logic GND', to: 'Common Star Ground', wireOrPolarityNote: 'Shared 0V reference' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Press 20-slot encoder discs onto TT motor back-shafts firmly.',
        '2. Mount LM393 optical gate sensors so the disc spins through slot center without touching optical lenses.',
        '3. Wire D0 outputs to Arduino Pin 2 and Pin 3.',
        '4. Upload odometry test sketch and rotate wheel 1 full revolution by hand to verify 20 ticks recorded.',
        '5. Place on 1-meter test track, run sketch, and measure final stopping distance with tape measure.'
      ],
      powerAndSafetyChecks: [
        'Never touch spinning slotted encoder discs with fingers or loose hair.',
        'Keep ISR functions strictly minimal (never call Serial.print or delay inside encoder ISRs).',
        'Elevate wheels off the workbench during initial firmware verification.'
      ],
      testCases: [
        { action: 'Rotate left wheel 1 full revolution by hand', expectedResult: 'Serial Monitor logs exactly 20 ticks.' },
        { action: 'Command 1000mm forward drive mission', expectedResult: 'Rover cruises, decelerates at tick 85, and halts at tick 98.' },
        { action: 'Measure physical stopping distance with tape measure', expectedResult: 'Ground distance falls within 980mm - 1020mm (±20mm accuracy).' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 04
// Precision Closed-Loop Odometry Controller with Deceleration Profiling
// Hardware: Dual Optical Slotted Encoders on INT0 (Pin 2) & INT1 (Pin 3) + TB6612FNG

#include <Arduino.h>

// Motor Driver Pins (TB6612FNG)
const int PIN_STBY = 4;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

// Optical Encoder Pins (Hardware Interrupts)
const int PIN_ENC_LEFT  = 2; // INT0
const int PIN_ENC_RIGHT = 3; // INT1

// Kinematic Constants
const float WHEEL_DIAMETER_MM  = 65.0;
const int   SLOTS_PER_REV      = 20;
const float MM_PER_TICK        = (3.14159 * WHEEL_DIAMETER_MM) / SLOTS_PER_REV; // 10.21 mm

// Volatile Shared Tick Counters
volatile unsigned long leftTicks  = 0;
volatile unsigned long rightTicks = 0;

// INTERRUPT SERVICE ROUTINES (ISRs)
void isrLeftWheel() { leftTicks++; }
void isrRightWheel() { rightTicks++; }

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

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  pinMode(PIN_ENC_LEFT, INPUT_PULLUP);
  pinMode(PIN_ENC_RIGHT, INPUT_PULLUP);

  // Attach Hardware Interrupts on Pin 2 (INT0) and Pin 3 (INT1)
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_LEFT), isrLeftWheel, RISING);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_RIGHT), isrRightWheel, RISING);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE CLOSED-LOOP ODOMETRY SYSTEM   "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Ready. Target: Drive 1000mm and Halt."));
  delay(1500);

  // Execute 1000mm Closed-Loop Drive Mission
  driveDistanceMm(1000.0);
}

void loop() {
  // Idle after mission completion
}

void driveDistanceMm(float targetMm) {
  unsigned long targetTicks = targetMm / MM_PER_TICK; // ~98 ticks for 1000mm

  // Reset encoder counters
  noInterrupts();
  leftTicks = 0;
  rightTicks = 0;
  interrupts();

  Serial.print(F("🎯 Target Ticks: "));
  Serial.print(targetTicks);
  Serial.print(F(" ("));
  Serial.print(targetMm);
  Serial.println(F(" mm)"));

  bool missionRunning = true;

  while (missionRunning) {
    // Read atomic copy of ticks
    noInterrupts();
    unsigned long curLeft = leftTicks;
    unsigned long curRight = rightTicks;
    interrupts();

    unsigned long avgTicks = (curLeft + curRight) / 2;
    unsigned long remainingTicks = (avgTicks < targetTicks) ? (targetTicks - avgTicks) : 0;

    // Check completion
    if (avgTicks >= targetTicks) {
      brake();
      missionRunning = false;
      Serial.println(F("🏁 [TARGET REACHED] Active brakes locked!"));
      break;
    }

    // Proportional Deceleration Profile
    int motorPWM = 160;
    if (remainingTicks <= 15) {
      // Ramp down speed proportionally to prevent skid overshoot
      motorPWM = map(remainingTicks, 1, 15, 85, 160);
    }

    // Differential steering trim to keep ticks synchronized
    int leftPWM = motorPWM;
    int rightPWM = motorPWM;
    if (curLeft > curRight) {
      leftPWM -= 15; // Slow left wheel slightly
    } else if (curRight > curLeft) {
      rightPWM -= 15; // Slow right wheel slightly
    }

    drive(leftPWM, rightPWM);
    delay(10);
  }

  // Final telemetry report
  noInterrupts();
  unsigned long finalLeft = leftTicks;
  unsigned long finalRight = rightTicks;
  interrupts();

  float finalMm = ((finalLeft + finalRight) / 2.0) * MM_PER_TICK;
  Serial.print(F("📊 Final Ticks: L="));
  Serial.print(finalLeft);
  Serial.print(F(" R="));
  Serial.print(finalRight);
  Serial.print(F(" | Final Odometry Distance: "));
  Serial.print(finalMm, 1);
  Serial.println(F(" mm"));
}
\`,
      pinMap: {
        'Pin 2 (INT0)': 'Left optical encoder digital pulse input (RISING)',
        'Pin 3 (INT1)': 'Right optical encoder digital pulse input (RISING)',
        'Pins 4-10': 'TB6612 motor driver speed (5,6) and direction (4,7,8,9,10)',
        '5V & GND': 'Regulated logic power bus to LM393 sensor modules'
      },
      setupAndUpload: [
        '1. Mount optical encoder discs onto motor rear axles; wire modules to Pins 2 and 3.',
        '2. Elevate rover on test block and upload sketch via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Verify target ticks report ~98 ticks for 1000mm.',
        '5. Place rover on 1-meter floor track, reset Arduino, and measure physical stopping distance.'
      ],
      explanations: [
        'attachInterrupt(..., RISING): Triggers ISR on each optical slot edge without polling in loop().',
        'MM_PER_TICK (10.21mm): Precise kinematic constant derived from 65mm wheel diameter.',
        'Deceleration Profile (map): Linearly drops PWM from 160 down to 85 over the final 15 ticks, eliminating inertial skidding.'
      ],
      expectedResult: 'Rover accelerates smoothly, tracks straight, decelerates over final 150mm, and stops within ±20mm of 1000mm target.',
      caveats: [
        'Wheel slip on smooth dusty floors causes encoder ticks to register higher than actual ground distance traveled.',
        'Ensure the encoder disc spins freely without rubbing against the plastic optical sensor slot.'
      ],
      tweakTip: 'Implement closed-loop heading correction: if leftTicks != rightTicks, adjust individual motor PWM proportionally to keep path dead-straight!'
    },
    activity: {
      title: 'Calibrate and Test 1-Meter Closed-Loop Odometry',
      steps: [
        'Step 1: Measure drive wheel diameter with digital calipers (e.g. 65.0mm); verify 20-slot disc.',
        'Step 2: Mount LM393 optical gate sensors; verify disc spins through center of optical gap.',
        'Step 3: Wire sensor digital outputs to Pins 2 and 3; upload tick-counting verification sketch.',
        'Step 4: Rotate each wheel exactly 1 revolution by hand; verify Serial Monitor reports exactly 20 ticks.',
        'Step 5: Place rover on 1000mm marked floor track; execute closed-loop drive sketch.',
        'Step 6: Measure final stopping point with measuring tape; calculate error percentage.'
      ],
      successCriteria: [
        'Both optical encoders record exactly 20 pulses per wheel revolution with zero jitter.',
        'Rover executes autonomous 1000mm drive mission with proportional deceleration.',
        'Physical stopping distance measured within ±20mm of 1000mm target mark (<= 2% error).'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'One wheel counts zero ticks while spinning at full speed.', 
        checks: [
          'Step 1: Check optical disc alignment—is the disc spinning inside the sensor slot or hitting the plastic housing?',
          'Step 2: Check sensor module LED—does the onboard D0 indicator LED flicker as the wheel turns?',
          'Step 3: Verify wiring to Pin 2 or Pin 3 and ensure pinMode is INPUT_PULLUP.'
        ], 
        explanation: 'If the optical disc wobbles outside the IR beam or the sensor power is disconnected, no digital edges reach the interrupt pin.' 
      },
      { 
        symptom: 'Rover consistently stops 50mm to 80mm PAST the 1000mm target line.', 
        checks: [
          'Step 1: Did the robot skid across the floor when braking?',
          'Step 2: Increase the deceleration window from 15 ticks to 25 ticks to slow down earlier.',
          'Step 3: Clean rubber tires with rubbing alcohol to restore high-traction friction.'
        ], 
        explanation: 'Inertial momentum causes rubber tires to slip across smooth floors after motors cut power, adding physical distance without encoder ticks.' 
      },
      { 
        symptom: 'Ticks counter stutters or reports 50+ ticks in a single wheel revolution.', 
        checks: [
          'Step 1: Inspect the encoder disc—are there mold flashes or burrs between the plastic slots?',
          'Step 2: Check for ambient direct sunlight or intense halogen lighting blinding the IR phototransistor.',
          'Step 3: Ensure motor power wires are not routed parallel to optical signal wires (inductive crosstalk).'
        ], 
        explanation: 'Optical noise or electrical crosstalk from motor brushes induces false voltage spikes, triggering multiple spurious interrupt events.' 
      },
      { 
        symptom: 'Rover curves severely to the left while driving straight.', 
        checks: [
          'Step 1: Verify both motor gearboxes have identical gear ratios (1:48).',
          'Step 2: Check differential trim code—does it adjust motor PWM when leftTicks != rightTicks?',
          'Step 3: Check front caster wheel for mechanical binding.'
        ], 
        explanation: 'Manufacturing variations cause DC motors to deliver unequal RPM at identical PWM duty cycles; closed-loop tick synchronization corrects this.' 
      }
    ],
    checksForUnderstanding: [
      'Why does wheel slip cause odometry to overestimate the actual ground distance traveled?',
      'How does an optical photo-interrupter convert mechanical rotation into digital square waves?',
      'Why is proportional deceleration essential when stopping a high-speed mobile robot at an exact target line?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the total number of encoder ticks required for a robot with 60mm diameter wheels and 20-slot discs to travel exactly 1.50 meters.', 
        rubricOrSampleReasoning: 'Circumference = PI * 60mm = 188.50mm. Resolution = 188.50 / 20 = 9.425 mm/tick. Target Ticks = 1500mm / 9.425 mm/tick = 159.15 -> 159 ticks.' 
      },
      { 
        question: 'Why must encoder pulse counters be declared as "volatile unsigned long" in embedded C++?', 
        rubricOrSampleReasoning: 'Volatile prevents compiler caching since ticks change asynchronously inside ISRs; unsigned long ensures counter does not overflow into negative numbers after ~32,000 pulses.' 
      },
      { 
        question: 'What is the physical cause of "odometry drift" that accumulates over long driving paths?', 
        rubricOrSampleReasoning: 'Microscopic wheel slip, tire diameter variations from uneven wear, chassis vibrations, and gear backlash accumulate monotonically over time.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-calculated tick-to-distance lookup tables for standard 65mm wheels.'],
      extension: ['Implement real-time pose tracking (X, Y, Theta) using trigonometric coordinate updates.'],
      offlineOption: ['Simulate odometry integration and wheel slip errors in the movement route visualizer.']
    },
    nextLessonId: 'adv-05',
    nextLessonTeaser: 'Advanced 05: Feedback Control & PID Tuning Concepts — Master Proportional, Integral, and Derivative control to eliminate track oscillations and achieve razor-sharp trajectory steering!',
    sources: [{ title: 'IEEE: Introduction to Autonomous Mobile Robot Odometry & Kinematics', url: 'https://ieee.org' }],
    assetCredits: [{ asset: 'Optical Encoder Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-04...');
content = replaceLesson(content, 'adv-04', 'adv-05', adv04);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-04!');
