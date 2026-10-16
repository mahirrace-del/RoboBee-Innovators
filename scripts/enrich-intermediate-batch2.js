const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// We will construct the enriched replacements for int-06 through int-10.
// Let's ensure all fieldGuideLinks match valid keys in referenceData.ts:
// fg-foundations-what-is-robot, fg-foundations-open-closed-loop, fg-comp-tcrt5000,
// fg-motion-differential-kinematics, fg-testing-fmea-debugging, fg-electronics-ohms-law,
// fg-board-uno-anatomy, fg-motion-pid-control, fg-prog-program-structure,
// fg-prog-millis-vs-delay, fg-comp-tb6612fng, fg-comp-encoders-odometry,
// fg-safety-lab-code, fg-comp-sg90-servo, fg-design-cad-measurement,
// fg-comm-i2c-spi-uart, fg-comp-tournament-prep

const int06 = `  {
    id: 'int-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-sg90-servo"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-safety-lab-code"],
      goDeeper: ["fg-design-cad-measurement"]
    },
    courseId: 'intermediate',
    sequence: 6,
    code: 'INTERMEDIATE 06',
    title: 'Servo Mechanisms and Robotic Arms',
    promise: 'By the end of this masterclass, you will command closed-loop positional servomotors using precise 50 Hz PWM pulse widths, calibrate mechanical horn center positions, and construct a motorized robotic gripper claw capable of pick-and-place maneuvers without gear-stripping motor stalls.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 03'],
    outcomes: [
      'Contrast continuous-rotation DC gearmotors with closed-loop positional servomotors (SG90/MG996R).',
      'Explain the 50 Hz PWM pulse-width modulation protocol (1.0ms = 0°, 1.5ms = 90°, 2.0ms = 180°).',
      'Isolate high-current inductive motor loads using dedicated 5V 2A external rails with star grounding.',
      'Assemble a mechanical gripper claw and calibrate safe OPEN and GRIP angles to eliminate motor stalls.',
      'Program smooth angular trajectory transitions using rate-limiting software algorithms to prevent mechanical shock.'
    ],
    vocabulary: [
      { 
        term: 'Positional Servomotor', 
        plainMeaning: 'A motor that turns to an exact commanded angle (like 45° or 90°) and fights to hold that position.', 
        technicalMeaning: 'A closed-loop rotary actuator comprising a DC motor, reduction gear train, potentiometer position sensor, and internal error amplifier.' 
      },
      { 
        term: 'PWM Pulse-Width Protocol', 
        plainMeaning: 'Sending short electrical pulses (1 to 2 milliseconds) every 20ms to tell the servo which angle to hold.', 
        technicalMeaning: 'A 50 Hz control waveform where the high-state pulse duration (1000µs to 2000µs) encodes the target shaft angle linearly from 0° to 180°.' 
      },
      { 
        term: 'Motor Stall Torque', 
        plainMeaning: 'When the motor is forced to stop turning while power is applied, drawing maximum current and overheating.', 
        technicalMeaning: 'The torque produced by a motor when the output rotational speed is zero, resulting in peak stall current ($I_{stall} = V / R_{armature}$).' 
      },
      { 
        term: 'Mechanical Backlash', 
        plainMeaning: 'The slight wiggle or looseness between interlocking gear teeth that causes angular inaccuracy.', 
        technicalMeaning: 'The clearance or play between mating gear teeth in a gear train resulting from intentional manufacturing tolerances or mechanical wear.' 
      },
      { 
        term: 'Centering Protocol', 
        plainMeaning: 'Sending a 90° command to a servo before attaching any plastic arms so you do not strip the internal gears.', 
        technicalMeaning: 'The calibration procedure of driving an uncoupled servo to its electrical midpoint (1500µs) prior to mechanical horn fastening.' 
      },
      { 
        term: 'End-Effector', 
        plainMeaning: 'The hand, gripper claw, or tool mounted at the end of a robotic manipulator arm.', 
        technicalMeaning: 'The peripheral device attached to the terminal wrist joint of a robotic manipulator designed to interact directly with the environment.' 
      }
    ],
    teacherPrep: [
      'Inspect TowerPro SG90 9g servos and acrylic gripper kits; verify all gear trains rotate freely by hand before powering.',
      'Prepare bench power supplies regulated to 5.0V with shared common ground jumpers connected to all student breadboards.'
    ],
    verifiedMaterials: [
      'TowerPro SG90 9g micro servomotor (1.8 kg-cm torque)',
      'Laser-cut acrylic / 3D-printed gripper claw kit',
      'External 5V 2A DC regulated power supply or 4xAA battery pack',
      'Arduino Uno Rev3 DIP with USB programming cable',
      'Breadboard and 22AWG solid-core jumper wires',
      'Lightweight 30mm foam test cube'
    ],
    safetyNotes: [
      'Never force a powered servo horn by hand; back-driving the gear train strips delicate nylon gear teeth.',
      'Never command a robotic gripper beyond its mechanical stopping point; stalling draws >650mA and melts motor coils.',
      'Always maintain a shared common ground between the external 5V servo supply and the Arduino logic ground.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display industrial 6-axis robotic arms performing high-speed surgical procedures and automotive welding.', 
        studentAction: 'Contrast continuous wheel rotation with closed-loop precision joint positioning.' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Dissect an SG90 servo: explain potentiometer feedback, internal error amplifier, and 50 Hz PWM timing.', 
        studentAction: 'Upload centering firmware (90°) and mechanically align the gripper horn to its midpoint.' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Supervise mechanical claw linkage assembly and safe angle calibration (OPEN_ANGLE vs GRIP_ANGLE).', 
        studentAction: 'Assemble gripper mechanism, wire dedicated 5V power bus, and calibrate stall-free foam block pickup.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Test student gripper hold strength and evaluate current draw during stall prevention checks.', 
        studentAction: 'Demonstrate clean 5-second pick-and-place cycle and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Closed-Loop Positional Actuation vs Continuous DC Motors',
        explanation: 'In previous classes, our TT gearmotors spun continuously, requiring open-loop delays or optical encoders to approximate position. A positional servomotor operates on Closed-Loop Feedback: inside its compact plastic housing sits a miniature DC motor, a high-ratio reduction gear train (often 250:1), a 10k potentiometer geared to the output shaft, and an analog control chip. When the microcontroller commands 90°, the internal comparator compares the potentiometer voltage against the commanded pulse width. If an external load pushes the arm away from 90°, the error amplifier instantly supplies counter-torque to restore the exact commanded position.',
        instructorNote: 'Pass around a disassembled SG90 micro-servo so students can see the miniature potentiometer directly beneath the output gear.'
      },
      {
        title: '2. The 50 Hz PWM Pulse-Width Protocol (1.0ms to 2.0ms)',
        explanation: 'Do not confuse motor speed PWM with servo control PWM! For motor speed (Class 06), Arduino uses a ~490 Hz or 980 Hz square wave where the duty cycle (0-255) controls average voltage. In contrast, hobby servos expect a strict 50 Hz frame frequency (a 20-millisecond period). The position is encoded purely by the duration of the high pulse: 1.0ms (1000µs) commands full counter-clockwise (0°); 1.5ms (1500µs) commands neutral center (90°); and 2.0ms (2000µs) commands full clockwise (180°). The Arduino <Servo.h> library utilizes hardware Timer1 on ATmega328P to generate these microsecond pulses with zero jitter.',
        instructorNote: 'Display the 50 Hz waveform on an oscilloscope or logic analyzer: show how varying the pulse between 1ms and 2ms rotates the shaft.'
      },
      {
        title: '3. Gearbox Backlash, Torque Ratings, and Gear Stripping Physics',
        explanation: 'The TowerPro SG90 servo is rated for a stall torque of approximately 1.8 kg-cm at 4.8V (or 0.176 N-m). Applying the torque equation (Torque = Force × Distance), a 10cm long gripper arm can exert a maximum force of only 0.18 kg (180 grams) at its tip! Furthermore, standard SG90 servos utilize nylon plastic gears. If the arm is commanded past a rigid mechanical barrier, the motor exerts peak stall torque against locked teeth, shearing microscopic nylon teeth and rendering the servo useless. In high-impact competition robots, metal-gear servos (like MG996R rated at 10 kg-cm) are chosen for durability.',
        instructorNote: 'Emphasize lever arm physics: doubling the length of the gripper claw halves the available gripping pinch force.'
      },
      {
        title: '4. Electrical Isolation: Why Servos Must Never Share Logic 5V',
        explanation: 'An idle SG90 draws roughly 10mA. In motion, it draws 150mA to 250mA. But the instant the motor starts or encounters resistance, instantaneous inrush current surges to 650mA–800mA! The Arduino Uno onboard linear regulator (AMS1117-5.0) has a thermal limit of ~800mA, but when powered from a 9V or 12V barrel jack, excessive voltage drop ($P = (V_{in} - 5V) \\times I$) causes thermal shutdown. Attempting to power a servo directly from the Arduino 5V pin collapses the 5V logic bus below 4.3V, triggering an ATmega328P Brownout Reset (BOD). Servos must ALWAYS be powered by an external 5V regulator with a shared Star Common Ground.',
        instructorNote: 'Demonstrate brownout: plug a servo into Arduino 5V and command rapid back-and-forth movement—watch the board reboot!'
      },
      {
        title: '5. Angular Kinematics and S-Curve Software Rate Limiting',
        explanation: 'When firmware executes \`gripper.write(180)\` while the arm sits at 0°, the internal motor controller slams full battery voltage across the armature to accelerate the arm at maximum speed. This abrupt angular acceleration ($a = \\Delta \\omega / \\Delta t$) generates high inertial shock loads, causing mechanical vibration, gear backlash wear, and dropping held items. Production robotics code implements Software Rate Limiting: instead of jumping 180° in 1 millisecond, a \`smoothMove()\` routine steps the angle by 1° every 15 milliseconds, achieving a smooth, controlled angular velocity of ~66 degrees per second.',
        instructorNote: 'Demonstrate the difference: have students run instant write() vs smoothMove() and listen to the mechanical gear noise.'
      },
      {
        title: '6. End-Effector Gripper Kinematics and Stall-Free Calibration',
        explanation: 'A robotic gripper transforms rotary servo motion into linear pinch action through a four-bar linkage or gear rack. When gripping a solid object like a wooden block, the jaws stop moving before the servo reaches its commanded position. If \`ANGLE_GRIP\` is programmed to 30° but the block blocks closure at 45°, the servo stays permanently locked in full-power stall mode, buzzing loudly and rapidly overheating! Calibration requires finding the exact physical contact angle, then backing off by 3° to 5° so the compliance of rubber or foam padding holds the object securely while the motor coil draws near-idle current.',
        instructorNote: 'Show students how adding thin adhesive foam tape to the claw fingers provides mechanical compliance that holds objects without stalling.'
      }
    ],
    visualizerId: 'servo_arm_sim',
    project: {
      name: 'Calibrated Pick-and-Place Robotic Gripper',
      deliverableType: 'physical_build',
      successEvidence: [
        'Calibrated robotic gripper smoothly opens to 120°, pauses, and closes around a 30mm foam cube at 48°.',
        'Holds the foam block firmly for 5 seconds without mechanical gear buzzing or drawing stall current.',
        'Dedicated external 5V power bus wired with common ground, exhibiting zero Arduino brownout resets during continuous movement.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 DIP', 'TowerPro SG90 9g Micro Servo', 'External 5V 2A Regulated Power Supply', 'Acrylic Gripper Assembly'],
      componentList: [
        { name: 'Micro Servomotor', exactVariant: 'TowerPro SG90 9g nylon gear servo (1.8 kg-cm torque)', quantity: 1 },
        { name: 'Mechanical Gripper Kit', exactVariant: 'Laser-cut acrylic / 3D-printed claw with gear drive', quantity: 1 },
        { name: 'External Power Supply', exactVariant: '5V 2A DC adapter or 4x AA battery pack (6.0V max)', quantity: 1 },
        { name: 'Breadboard & Jumpers', exactVariant: 'Mini breadboard with male-to-male jumper wires', quantity: 1 },
        { name: 'Foam Test Cube', exactVariant: '30mm high-density craft foam cube (approx 5 grams)', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/servo_gripper_wiring.svg',
      schematic: 'Arduino Pin 9 (PWM) ➔ Servo Orange (Signal). Ext 5V (+) ➔ Servo Red (Power). Ext GND (-) ➔ Servo Brown (GND) & Arduino GND (Common).',
      wireTable: [
        { from: 'Arduino Pin 9 (PWM)', to: 'SG90 Servo Signal Lead (Orange/Yellow)', wireOrPolarityNote: 'Carries 50Hz PWM pulse (1000us - 2000us)' },
        { from: 'External 5V (+) Supply', to: 'SG90 Servo VCC Lead (Red)', wireOrPolarityNote: 'Do NOT power servo motor from Arduino 5V onboard regulator' },
        { from: 'External Supply GND (-)', to: 'SG90 Servo GND Lead (Brown/Black)', wireOrPolarityNote: 'Current return path for motor' },
        { from: 'External Supply GND (-)', to: 'Arduino GND Pin', wireOrPolarityNote: 'MANDATORY common ground reference for PWM signal' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Connect servo signal and power leads on breadboard according to wire table.',
        '2. Upload the 90-degree centering sketch to Arduino BEFORE mounting mechanical horn.',
        '3. Attach the plastic servo horn so gripper jaws sit halfway open at the 90-degree centered position.',
        '4. Tighten the central gear screw carefully without over-torquing plastic teeth.',
        '5. Upload the calibrated claw sweep sketch with safe OPEN and GRIP angles.',
        '6. Test gripping a lightweight 30mm foam cube.'
      ],
      powerAndSafetyChecks: [
        'Never force a powered servo horn by hand; mechanical back-driving strips internal gears.',
        'Never set GRIP angle past physical contact point (stalls motor and draws >650mA stall current).',
        'Always ensure common ground between external supply and Arduino board.'
      ],
      testCases: [
        { action: 'Command OPEN_ANGLE (120°)', expectedResult: 'Gripper jaws open wide smoothly with zero buzzing.' },
        { action: 'Command GRIP_ANGLE (48°)', expectedResult: 'Gripper jaws close firmly around foam cube and hold without buzzing.' },
        { action: 'Lift foam cube 5cm off table', expectedResult: 'Cube is held securely without slipping or dropping for 5 seconds.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Intermediate 06
// Calibrated Robotic Gripper Claw Controller with Smooth Trajectory
// Library: <Servo.h> | Hardware: TowerPro SG90 Micro Servo + Ext 5V Power

#include <Servo.h>

Servo gripper;

const int PIN_SERVO = 9;

// Calibrated Safe Angles (Degrees)
// Calibrated for laser-cut acrylic claw with 30mm foam cube target
const int ANGLE_OPEN = 120; // Jaws wide open (release position)
const int ANGLE_GRIP = 48;  // Jaws firmly holding foam cube without motor stall
const int STEP_DELAY_MS = 15; // 15ms per degree = smooth angular transition

void setup() {
  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE ROBOTIC GRIPPER CONTROLLER   "));
  Serial.println(F("========================================"));

  gripper.attach(PIN_SERVO);

  // Electrical Centering Protocol on Startup
  Serial.println(F("[INIT] Centering servo to 90 degrees..."));
  gripper.write(90);
  delay(1000);

  Serial.println(F("[INIT] Moving to OPEN position..."));
  smoothMove(ANGLE_OPEN);
  delay(500);

  Serial.println(F("[READY] Commencing automated pick-and-place cycle."));
}

void loop() {
  // Step 1: Approach & Open
  Serial.println(F("-> OPENING Gripper Jaws..."));
  smoothMove(ANGLE_OPEN);
  delay(1500); // 1.5-second dwell for object placement

  // Step 2: Grip Object
  Serial.println(F("-> CLOSING Gripper Jaws (Grip Object)..."));
  smoothMove(ANGLE_GRIP);
  delay(2500); // 2.5-second transport hold
}

// Moves servo incrementally to eliminate inertial shock and gear wear
void smoothMove(int targetAngle) {
  int currentAngle = gripper.read();
  if (currentAngle < targetAngle) {
    for (int a = currentAngle; a <= targetAngle; a++) {
      gripper.write(a);
      delay(STEP_DELAY_MS);
    }
  } else {
    for (int a = currentAngle; a >= targetAngle; a--) {
      gripper.write(a);
      delay(STEP_DELAY_MS);
    }
  }
}
\`,
      pinMap: {
        'Pin 9': 'Arduino Timer1 PWM output to SG90 Signal Lead (Orange)',
        'Ext 5V (+)': 'Regulated 5.0V External Rail to SG90 VCC Lead (Red)',
        'Star GND': 'Common Ground tying SG90 Ground (Brown) to Arduino GND'
      },
      setupAndUpload: [
        '1. Ensure servo horn is detached from gripper assembly.',
        '2. Upload sketch to Arduino Uno via USB cable.',
        '3. Observe servo center to 90 degrees; fasten mechanical horn so jaws sit half-open.',
        '4. Tighten center retaining screw securely.',
        '5. Open Serial Monitor at 9600 baud and observe automated smooth gripping cycles.'
      ],
      explanations: [
        '#include <Servo.h>: Utilizes ATmega328P 16-bit Timer1 to generate clean 50Hz PWM waveforms without software jitter.',
        'smoothMove(): S-curve stepping function that advances position by 1 degree every 15ms, preventing high stall inrush spikes.',
        'ANGLE_GRIP (48°): Empirically tuned resting angle that pinches foam block firmly without driving motor coil into continuous stall.'
      ],
      expectedResult: 'Gripper opens smoothly to 120°, pauses cleanly, closes to 48°, and firmly clamps the foam cube without buzzing or resetting the Arduino.',
      caveats: [
        'If the servo buzzes or hums continuously after closing, increase ANGLE_GRIP by 2-3 degrees immediately to relieve motor stall.',
        'Never attempt to power the servo directly from the Arduino 5V header pin; inductive spikes will cause board resets.'
      ],
      tweakTip: 'Connect a 10k potentiometer to Analog Pin A0 and use map(analogRead(A0), 0, 1023, ANGLE_GRIP, ANGLE_OPEN) for direct manual teleoperation!'
    },
    activity: {
      title: 'Assemble, Calibrate, and Test the Pick-and-Place Gripper',
      steps: [
        'Step 1: Wire the SG90 servo to external 5V power bus with star ground return to Arduino GND.',
        'Step 2: Upload the 90-degree centering firmware to establish electrical zero reference.',
        'Step 3: Fasten the mechanical horn to the acrylic claw linkage at the centered midpoint.',
        'Step 4: Empirically determine the safe ANGLE_OPEN limit where the mechanism opens wide without binding.',
        'Step 5: Place a 30mm foam cube in jaws and determine ANGLE_GRIP where cube is held firmly with zero motor buzz.',
        'Step 6: Execute 5 consecutive pick-and-place cycles without dropping the object or stalling the motor.'
      ],
      successCriteria: [
        'Servo centered electronically prior to mechanical horn attachment.',
        'Gripper operates smoothly without gear buzzing or thermal heating on motor case.',
        'Successfully picks up and holds 30mm foam block for 5 seconds without dropping.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Servo buzzes loudly and becomes noticeably warm within 30 seconds of closing on the object.', 
        checks: [
          'Step 1: Check ANGLE_GRIP in code—is it set too small, trying to close past the thickness of the foam cube?',
          'Step 2: Increase ANGLE_GRIP by 3 to 5 degrees in code and re-test.',
          'Step 3: Check mechanical linkages for tight burrs or misaligned screws causing physical binding.'
        ], 
        explanation: 'When commanded past mechanical contact, the servo motor stalls at 0 RPM, drawing continuous maximum stall current (>650mA) and dissipating power as heat in the motor coils.' 
      },
      { 
        symptom: 'Arduino board resets (LED blinks and Serial prints boot banner) whenever the servo moves.', 
        checks: [
          'Step 1: Verify where the servo Red power wire is connected—is it plugged into the Arduino 5V pin?',
          'Step 2: Transfer servo VCC to an external 5V 2A power supply.',
          'Step 3: Verify the common ground jumper wire is securely bridging external GND to Arduino GND.'
        ], 
        explanation: 'Servo inrush current collapses the Arduino onboard 5V regulator, causing supply voltage to dip below the 4.3V Brownout Detector (BOD) threshold.' 
      },
      { 
        symptom: 'Servo shaft twitches, jitters erratically, or does not respond to write commands.', 
        checks: [
          'Step 1: Check the ground connection between the external power supply and Arduino GND.',
          'Step 2: Verify the signal wire is connected to a valid PWM pin (Digital Pin 9).',
          'Step 3: Check battery voltage—depleted batteries below 4.5V cause erratic servo comparator jitter.'
        ], 
        explanation: 'Without a shared common ground, the servo has no 0V electrical reference to measure the 50 Hz PWM control pulse, interpreting floating voltage noise as random commands.' 
      },
      { 
        symptom: 'Servo arm jumps violently to maximum travel on initial power-up.', 
        checks: [
          'Step 1: Ensure \`gripper.write(90)\` is called immediately after \`gripper.attach(PIN_SERVO)\` in \`setup()\`.',
          'Step 2: Add a 100uF electrolytic capacitor across the servo 5V and GND power rails near the breadboard.'
        ], 
        explanation: 'Before Timer1 stabilizes and outputs valid 50 Hz pulses, internal servo circuitry can trigger on power rail rise-time transients.' 
      }
    ],
    checksForUnderstanding: [
      'How does an internal potentiometer enable closed-loop positional feedback inside a hobby servo?',
      'What is the specific difference between a 50 Hz PWM pulse-width protocol and a 490 Hz motor speed PWM duty cycle?',
      'Why is it mandatory to connect an external 5V servo power supply ground directly to the Arduino GND pin?'
    ],
    exitTicket: [
      { 
        question: 'Why must you electrically center a servomotor at 90 degrees before fastening its mechanical horn to the gripper linkage?', 
        rubricOrSampleReasoning: 'If the horn is attached at an arbitrary angle, commanding full range travel can force the internal gear train into its physical mechanical stop tabs, permanently stripping the nylon gear teeth.' 
      },
      { 
        question: 'Calculate the pulse duration required to command a standard hobby servo to its exact neutral 90-degree midpoint.', 
        rubricOrSampleReasoning: 'A standard hobby servo maps 0° to 1000µs (1.0ms) and 180° to 2000µs (2.0ms). Therefore, 90° corresponds exactly to 1500µs (1.5ms).' 
      },
      { 
        question: 'Why does holding a rigid object too tightly cause a servo to rapidly overheat, and how is this prevented in software?', 
        rubricOrSampleReasoning: 'If commanded beyond object contact, the motor stalls at 0 RPM, drawing continuous stall current (>650mA). In software, this is prevented by calibrating ANGLE_GRIP to stop right at object contact and utilizing mechanical foam compliance.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-assembled acrylic gripper claws so students focus strictly on wiring and angle calibration.'],
      extension: ['Connect a 10k potentiometer to Analog Pin A0 and implement smooth real-time manual teleoperation.'],
      offlineOption: ['Use the interactive servo simulator to visualize internal potentiometer feedback and 50 Hz pulse widths.']
    },
    nextLessonId: 'int-07',
    nextLessonTeaser: 'Intermediate 07: Navigation Challenge: Maze Routing & Intersections — Upgrade your autonomous rover with junction classification algorithms and grid maze routing!',
    sources: [{ title: 'TowerPro SG90 9g Micro Servo Technical Specification', url: 'http://www.towerpro.com.tw' }],
    assetCredits: [{ asset: 'Servo Gripper Mechanism', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const int07 = `  {
    id: 'int-07',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure", "fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'intermediate',
    sequence: 7,
    code: 'INTERMEDIATE 07',
    title: 'Navigation Challenge: Maze Routing & Intersections',
    promise: 'By the end of this masterclass, you will program an autonomous mobile robot to detect and classify complex line intersections (T-junctions, 90° corners, 4-way crosses) and navigate a multi-node grid maze using waypoint routing tables and wall-following heuristics.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 03', 'Intermediate 05'],
    outcomes: [
      'Classify optical intersection signatures (T-junctions, 90° L-turns, 4-way cross intersections).',
      'Solve the "Axle Alignment Problem" by commanding a calibrated forward deadband coast past the junction crossbar.',
      'Program a deterministic waypoint routing table using C++ enum data structures.',
      'Implement an active optical line-catching pivot routine to eliminate battery-dependent turn timing errors.',
      'Navigate a 3-node grid arena autonomously, executing precise left, right, and straight maneuvers.'
    ],
    vocabulary: [
      { 
        term: 'Intersection Node', 
        plainMeaning: 'A point on the arena floor where two or more black lines meet or cross.', 
        technicalMeaning: 'A vertex in a planar topological navigation graph representing a decision point between multiple trajectory branches.' 
      },
      { 
        term: 'Axle Alignment Offset', 
        plainMeaning: 'Driving the robot a few centimeters forward after seeing a cross line so the wheels line up with the turn.', 
        technicalMeaning: 'The longitudinal distance between the front sensor array and the vehicle differential drive axle that must be traversed prior to executing a yaw pivot.' 
      },
      { 
        term: 'Waypoint Routing Table', 
        plainMeaning: 'A list of planned directions (like Left, Right, Straight) saved in code for each upcoming crossroad.', 
        technicalMeaning: 'An ordered sequential array or lookup table of discrete navigation actions indexed by intersection node counter.' 
      },
      { 
        term: 'Line-Catching Pivot', 
        plainMeaning: 'Spinning the robot until the opposite sensor sees the new line, instead of guessing turn time with a delay.', 
        technicalMeaning: 'A closed-loop rotational maneuver that executes differential yaw until a designated optical sensor transitions across the reflectance threshold.' 
      },
      { 
        term: 'Left-Hand Wall Rule', 
        plainMeaning: 'A maze-solving trick where keeping your left hand on the wall will always guide you to the exit.', 
        technicalMeaning: 'A topological maze-traversal heuristic for simply-connected mazes where the agent prioritizes Left > Straight > Right > U-Turn at every junction node.' 
      },
      { 
        term: 'Junction Debounce', 
        plainMeaning: 'A brief pause or distance filter that prevents the robot from counting the same thick cross line twice.', 
        technicalMeaning: 'A temporal or spatial hysteresis filter that inhibits secondary node detection triggers until the sensor array completely clears the junction geometry.' 
      }
    ],
    teacherPrep: [
      'Construct a 3-node tape grid maze arena (black vinyl tape on white floor) with at least one 90° L-turn, one T-junction, and one 4-way cross.',
      'Verify that all competition rovers have their optical sensors mounted 10mm above the track surface.'
    ],
    verifiedMaterials: [
      '2WD Autonomous Mobile Rover (with TB6612FNG driver and dual TCRT5000 array)',
      'Official 3-Node Competition Grid Maze Arena',
      'Arduino Uno Rev3 DIP with USB programming cable',
      '7.4V Li-Ion / 6xAA Battery Pack with master power switch',
      'Digital stopwatch for timing trial runs'
    ],
    safetyNotes: [
      'Perform all grid maze trials on the floor inside designated arena boundaries.',
      'Never allow rovers to run unmonitored near table edges or stairwells.',
      'Ensure the battery switch is turned OFF before transferring the robot from floor to workbench.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display industrial automated guided vehicles (AGVs) navigating warehouse floor grids to retrieve pallets with millimeter precision.', 
        studentAction: 'Analyze grid intersection topology and trace required turn decisions.' 
      },
      { 
        segment: '10–25m Logic', 
        minutes: 15, 
        teacherAction: 'Teach intersection signature detection: White/White ➔ Line Cruise; Black/Black ➔ Intersection Node! Explain Axle Alignment Offset.', 
        studentAction: 'Calculate required forward coast distance based on chassis wheel-to-sensor offset.' 
      },
      { 
        segment: '25–50m Test', 
        minutes: 25, 
        teacherAction: 'Supervise grid maze trials. Coach students on replacing open-loop turn delays with closed-loop line-catching pivots.', 
        studentAction: 'Program 3-node waypoint route, tune axle offset, and achieve 3 consecutive flawless runs through the maze.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Host head-to-head maze traversal challenges and evaluate node-counting reliability.', 
        studentAction: 'Log successful maze completion time and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Topological vs Geometric Navigation in Mobile Robotics',
        explanation: 'In open-space navigation, robots rely on geometric coordinates ($X, Y, \\theta$). However, in warehouse logistics and automated factory floors, robots utilize Topological Navigation: the environment is abstracted into a mathematical graph of vertices (nodes) and connecting edges (line segments). The robot does not need to calculate global GPS coordinates; it simply tracks edges using low-cost optical sensors and executes pre-determined discrete decisions (Left, Right, Straight, Halt) upon arriving at each intersection node.',
        instructorNote: 'Draw a graph theory network on the board: Nodes labeled 0, 1, 2 connected by directed edges.'
      },
      {
        title: '2. Optical Junction Signatures and the Multi-Sensor Truth Table',
        explanation: 'When our 2-sensor mobile rover encounters a straight line, only one sensor or neither sensor sees black. But when approaching a T-junction or a 4-way cross, BOTH Left and Right TCRT5000 sensors simultaneously detect black vinyl tape (\`leftDark && rightDark\`). This simultaneous optical transition serves as the deterministic signature of an Intersection Node. The firmware must immediately suspend normal line-following steering, freeze PID or Bang-Bang steering adjustments, and hand control over to the specialized intersection handler subroutine.',
        instructorNote: 'Walk through the sensor truth table: 00 = Straight, 10 = Correct Left, 01 = Correct Right, 11 = INTERSECTION NODE!'
      },
      {
        title: '3. The Axle Alignment Problem and Deadband Coasting',
        explanation: 'A critical mechanical challenge in wheeled robotics is that the optical sensor array is positioned at the extreme front bumper, while the drive wheels and turning pivot axle sit 10cm to 15cm further back. If the robot initiates a 90-degree pivot the instant its front sensors detect the cross line, it will spin around its rear wheels, swinging the front sensors completely off the track and missing the outbound branch! To execute a clean turn, the robot must execute a Forward Coast ($d_{offset} \\approx 12\\text{cm}$) to roll its drive axle directly over the center of the crossbar before commanding the yaw pivot.',
        instructorNote: 'Demonstrate with a physical robot on tape: show why spinning immediately leaves the wheels stranded behind the intersection.'
      },
      {
        title: '4. Deterministic Waypoint Routing Tables Using C++ Enums',
        explanation: 'Rather than writing hardcoded spaghetti \`if-else\` statements for each turn, professional autonomous systems utilize Waypoint Routing Tables. We define a strongly typed C++ enum: \`enum class TurnAction { TURN_LEFT, TURN_RIGHT, GO_STRAIGHT, HALT_FINISH };\`. An array \`const TurnAction ROUTE[] = { TurnAction::TURN_LEFT, TurnAction::TURN_RIGHT, TurnAction::HALT_FINISH };\` defines the flight plan. An internal state variable \`int currentNode = 0;\` increments upon each valid intersection encounter, retrieving and executing the exact planned action cleanly.',
        instructorNote: 'Show students how updating a single element in the ROUTE array alters the entire path of the robot without touching motor code.'
      },
      {
        title: '5. Eliminating Battery-Dependent Turns: Closed-Loop Line Catching',
        explanation: 'Beginner robots execute 90-degree turns using open-loop delays: \`drive(-120, 120); delay(380);\`. However, as the battery pack discharges from 8.4V down to 7.0V, motor RPM drops significantly! A 380ms pulse that turned 90° on fresh batteries will only turn 72° on depleted cells, causing the rover to derail. Robust navigation code utilizes Closed-Loop Line Catching: 1. Pivot away from the current line for 150ms (clearing old tape). 2. Continue pivoting in a \`while()\` loop until the optical sensor detects the new black line! This guarantees an exact 90-degree lock regardless of battery state.',
        instructorNote: 'Demonstrate line-catching: spin the robot slowly by hand until the sensor LED lights up, proving hardware feedback eliminates timing drift.'
      },
      {
        title: '6. The Left-Hand Wall Maze Solving Heuristic (Tremaux Rule)',
        explanation: 'When exploring an unknown grid maze with no pre-planned route, the robot can execute the classic Left-Hand Wall Rule (or Right-Hand Rule). At every intersection node, the decision priority hierarchy is strictly enforced: 1. If an opening exists to the Left, TURN LEFT. 2. Else if the path continues Straight, GO STRAIGHT. 3. Else if an opening exists to the Right, TURN RIGHT. 4. If all paths are blocked (dead end), EXECUTE U-TURN (180°). In simply-connected mazes with no closed island loops, this mathematical heuristic guarantees reaching the exit.',
        instructorNote: 'Explain the difference between a simply-connected maze (solvable by wall-following) and a looped maze requiring coordinate mapping.'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Autonomous Grid Maze Navigation Rover',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Rover detects 3 consecutive intersection nodes using dual TCRT5000 optical sensors.',
        'Executes calibrated forward axle alignment coast (180ms) prior to each pivot maneuver.',
        'Executes programmed Turn Left at Node 1, Turn Right at Node 2, and Halts crisply within Node 3 finish zone.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Mobile Rover Assembly', 'TB6612FNG Dual Driver', 'Dual TCRT5000 Optical Sensors', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Mobile Chassis', exactVariant: 'Differential drive with twin 1:48 gearmotors and front caster', quantity: 1 },
        { name: 'TB6612FNG Driver Breakout', exactVariant: 'Dual H-Bridge carrier with common ground', quantity: 1 },
        { name: 'TCRT5000 Optical Array', exactVariant: 'Dual-sensor calibrated reflectance modules', quantity: 2 },
        { name: 'Arduino Uno Rev3', exactVariant: 'Official DIP edition with USB cable', quantity: 1 },
        { name: '7.4V Battery Pack', exactVariant: '2S 18650 Li-Ion / 6xAA battery holder with toggle switch', quantity: 1 },
        { name: 'Competition Arena', exactVariant: '3-Node black tape grid maze on white floor board', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'TB6612: STBY ➔ D3 | PWMA ➔ D5 | AIN1 ➔ D7 | AIN2 ➔ D8 | PWMB ➔ D6 | BIN1 ➔ D9 | BIN2 ➔ D10. Sensors: Left ➔ A0, Right ➔ A1. Common Ground.',
      wireTable: [
        { from: 'Arduino Digital Pin 3', to: 'TB6612 STBY', wireOrPolarityNote: 'Standby enable (HIGH = Active)' },
        { from: 'Arduino Digital Pin 5 (~PWM)', to: 'TB6612 PWMA', wireOrPolarityNote: 'Left motor speed control' },
        { from: 'Arduino Digital Pin 7', to: 'TB6612 AIN1', wireOrPolarityNote: 'Left motor direction lead 1' },
        { from: 'Arduino Digital Pin 8', to: 'TB6612 AIN2', wireOrPolarityNote: 'Left motor direction lead 2' },
        { from: 'Arduino Digital Pin 6 (~PWM)', to: 'TB6612 PWMB', wireOrPolarityNote: 'Right motor speed control' },
        { from: 'Arduino Digital Pin 9', to: 'TB6612 BIN1', wireOrPolarityNote: 'Right motor direction lead 1' },
        { from: 'Arduino Digital Pin 10', to: 'TB6612 BIN2', wireOrPolarityNote: 'Right motor direction lead 2' },
        { from: 'Left TCRT5000 Analog Out', to: 'Arduino Pin A0', wireOrPolarityNote: 'Left optical line feedback' },
        { from: 'Right TCRT5000 Analog Out', to: 'Arduino Pin A1', wireOrPolarityNote: 'Right optical line feedback' },
        { from: 'Battery (-) & Arduino GND', to: 'TB6612 GND & Sensor GND', wireOrPolarityNote: 'Star Common Ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect mechanical chassis: ensure dual front sensors are mounted 10mm above the track surface.',
        '2. Verify wiring against table; ensure motor driver STBY pin is tied to Digital Pin 3.',
        '3. Upload grid maze routing sketch with Serial Monitor open.',
        '4. Elevate wheels on bench block; verify left/right steering responses by covering sensors.',
        '5. Place rover on arena starting line, activate battery switch, and observe 3-node sequence.'
      ],
      powerAndSafetyChecks: [
        'Never run grid maze rovers on high tables where derailments cause falls.',
        'Ensure drive wheels are free of caught hair or lint that introduces asymmetric friction.',
        'Always switch battery pack OFF when making firmware adjustments via USB.'
      ],
      testCases: [
        { action: 'Both sensors cross 4-way black crossbar', expectedResult: 'Rover detects Node, coasts 180ms to align axle, and executes planned turn.' },
        { action: 'Left sensor trips black line on straight', expectedResult: 'Rover applies gentle differential correction to stay centered.' },
        { action: 'Rover reaches Node 3 (Terminal Goal)', expectedResult: 'Motors engage active dynamic braking and halt permanently in stop box.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Intermediate 07
// Autonomous Grid Maze Intersection Navigation Controller
// Deterministic Waypoint Routing with Axle Alignment and Line-Catching Pivots

enum class TurnAction { TURN_LEFT, TURN_RIGHT, GO_STRAIGHT, HALT_FINISH };

// Programmed Waypoint Route for 3-Node Maze:
const TurnAction ROUTE[] = {
  TurnAction::TURN_LEFT,    // Node 0: Pivot 90 degrees Left
  TurnAction::TURN_RIGHT,   // Node 1: Pivot 90 degrees Right
  TurnAction::HALT_FINISH   // Node 2: Terminal Stop Box
};
const int TOTAL_NODES = sizeof(ROUTE) / sizeof(ROUTE[0]);
int currentNode = 0;

// Motor Driver Pinout (TB6612FNG)
const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

// Optical Reflectance Sensors (TCRT5000)
const int PIN_IR_L = A0;
const int PIN_IR_R = A1;

const int THRESHOLD_BLACK = 500;
const int SPEED_CRUISE    = 130;
const int SPEED_TURN      = 125;
const int AXLE_COAST_MS   = 180; // Time to roll drive wheels directly over intersection

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE GRID MAZE ROUTING SYSTEM      "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Ready. Place on starting line."));
  delay(1500);
}

void loop() {
  int leftVal  = analogRead(PIN_IR_L);
  int rightVal = analogRead(PIN_IR_R);

  bool leftDark  = (leftVal > THRESHOLD_BLACK);
  bool rightDark = (rightVal > THRESHOLD_BLACK);

  // DECISION 1: INTERSECTION NODE (Both sensors detect black tape simultaneously)
  if (leftDark && rightDark) {
    handleIntersection();
  }
  // DECISION 2: CORRECT LEFT (Line drifted under left sensor)
  else if (leftDark && !rightDark) {
    drive(SPEED_CRUISE - 35, SPEED_CRUISE + 35);
  }
  // DECISION 3: CORRECT RIGHT (Line drifted under right sensor)
  else if (!leftDark && rightDark) {
    drive(SPEED_CRUISE + 35, SPEED_CRUISE - 35);
  }
  // DECISION 4: STRAIGHT CRUISE (Both sensors on white floor, line centered)
  else {
    drive(SPEED_CRUISE, SPEED_CRUISE);
  }
}

void handleIntersection() {
  Serial.print(F("📍 [NODE DETECTED] Index: "));
  Serial.println(currentNode);

  // STEP 1: Axle Alignment Coast
  // Drive forward ~3cm so the differential drive axle aligns over the cross line
  drive(SPEED_CRUISE, SPEED_CRUISE);
  delay(AXLE_COAST_MS);

  if (currentNode >= TOTAL_NODES) {
    Serial.println(F("🏁 [MISSION COMPLETE] All waypoints cleared!"));
    brake();
    while (true) { brake(); }
  }

  TurnAction action = ROUTE[currentNode];
  currentNode++; // Advance waypoint counter

  switch (action) {
    case TurnAction::TURN_LEFT:
      Serial.println(F("-> Executing 90-degree PIVOT LEFT..."));
      drive(-SPEED_TURN, SPEED_TURN);
      delay(150); // Blind breakout delay to clear current line
      // Closed-loop line catching: spin until left sensor re-acquires black line
      while (analogRead(PIN_IR_L) < THRESHOLD_BLACK) {
        drive(-SPEED_TURN, SPEED_TURN);
      }
      Serial.println(F("-> Outbound line locked!"));
      break;

    case TurnAction::TURN_RIGHT:
      Serial.println(F("-> Executing 90-degree PIVOT RIGHT..."));
      drive(SPEED_TURN, -SPEED_TURN);
      delay(150); // Blind breakout delay to clear current line
      // Closed-loop line catching: spin until right sensor re-acquires black line
      while (analogRead(PIN_IR_R) < THRESHOLD_BLACK) {
        drive(SPEED_TURN, -SPEED_TURN);
      }
      Serial.println(F("-> Outbound line locked!"));
      break;

    case TurnAction::GO_STRAIGHT:
      Serial.println(F("-> Continuing STRAIGHT through intersection..."));
      drive(SPEED_CRUISE, SPEED_CRUISE);
      delay(200); // Debounce delay to prevent re-triggering on same cross line
      break;

    case TurnAction::HALT_FINISH:
      Serial.println(F("🏁 [GOAL REACHED] Halting in stop box!"));
      brake();
      while (true) { brake(); }
  }
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
        'Pin 3': 'TB6612 STBY enable pin (HIGH = Operational)',
        'Pin 5 & 6': 'TB6612 PWMA & PWMB hardware PWM speed pins',
        'Pins 7, 8, 9, 10': 'TB6612 AIN1, AIN2, BIN1, BIN2 direction control pins',
        'Pins A0 & A1': 'TCRT5000 Left and Right optical reflectance analog inputs'
      },
      setupAndUpload: [
        '1. Place rover on workbench with wheels elevated.',
        '2. Upload firmware via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Manually trigger both IR sensors with dark paper; observe Serial print "[NODE DETECTED] Index: 0".',
        '5. Place on arena starting line, enable battery switch, and observe 3-node sequence.'
      ],
      explanations: [
        'ROUTE[] array: Stores pre-planned high-level tactical decisions independently of hardware drive functions.',
        'AXLE_COAST_MS (180ms): Drives the vehicle forward so its turning center of rotation sits directly over the crossbar.',
        'Closed-Loop Line Catching: Combines a 150ms breakout delay with a while() loop that locks onto the target outbound branch.'
      ],
      expectedResult: 'Rover cruises straight, detects Node 0, coasts 3cm, executes a sharp 90° left turn, tracks to Node 1, turns right, and stops squarely inside Node 2.',
      caveats: [
        'If AXLE_COAST_MS is too short, the rover will spin prematurely, landing its rear caster off the track.',
        'Ensure the breakout delay (150ms) is long enough to clear the existing tape before the line-catching loop starts.'
      ],
      tweakTip: 'Mission Upgrade: Add a 3rd TCRT5000 sensor in the center to maintain continuous line contact during intersection transitions!'
    },
    activity: {
      title: 'Program and Navigate the 3-Node Grid Maze',
      steps: [
        'Step 1: Map the grid maze arena on graph paper and identify all 3 intersection node coordinates.',
        'Step 2: Define the ROUTE array in firmware matching your arena layout (e.g. LEFT, RIGHT, HALT).',
        'Step 3: Measure the physical distance between your front sensors and drive wheel axle (e.g. 12cm).',
        'Step 4: Tune AXLE_COAST_MS so the wheels stop squarely on top of the crossbar before pivoting.',
        'Step 5: Verify the closed-loop line-catching while() loop locks onto outbound lines without overshooting.',
        'Step 6: Execute 3 consecutive autonomous runs through the grid maze with 100% path accuracy.'
      ],
      successCriteria: [
        'Rover detects all 3 intersection nodes with zero double-counting errors.',
        'Coasts cleanly to align drive wheels over crossbar before initiating turns.',
        'Successfully executes programmed route and halts within the final finish stop box.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Rover detects the same intersection node twice, executing two turns in rapid succession.', 
        checks: [
          'Step 1: Check the post-turn debounce delay—is it long enough for the sensors to fully clear the cross line?',
          'Step 2: Increase the straight coast delay after turning from 150ms to 250ms.',
          'Step 3: Verify sensor spacing is not wider than the intersection tape crossbar.'
        ], 
        explanation: 'If the front sensors linger over wide electrical tape after completing a pivot, the FSM immediately registers a second intersection trigger.' 
      },
      { 
        symptom: 'Rover swings wide off the track and gets lost when attempting a 90-degree turn at a node.', 
        checks: [
          'Step 1: Increase AXLE_COAST_MS by 40ms to allow wheels to roll fully past the cross line.',
          'Step 2: Verify both motors are spinning in opposite directions during the turn (Tank Pivot).',
          'Step 3: Clean front omnidirectional caster wheel to eliminate turning scrub friction.'
        ], 
        explanation: 'Initiating a turn before the rear drive axle crosses the intersection causes the vehicle to rotate around a pivot point located behind the intersection geometry.' 
      },
      { 
        symptom: 'Rover spins continuously in circles at the intersection, never locking onto the outbound line.', 
        checks: [
          'Step 1: Check THRESHOLD_BLACK—is it set higher than the black tape reflectance value?',
          'Step 2: Check sensor height—if the sensor is higher than 12mm, it will not detect the black line.',
          'Step 3: Verify the breakout delay (150ms) is not so long that the sensor spins completely past the outbound line!'
        ], 
        explanation: 'If the breakout delay overshoots the outbound tape or the sensor threshold is miscalibrated, the \`while()\` condition never terminates.' 
      },
      { 
        symptom: 'Rover fails to detect the intersection cross line, driving straight through without turning.', 
        checks: [
          'Step 1: Inspect the intersection crossbar—is it narrower than the lateral distance between your two sensors?',
          'Step 2: Widen the crossbar tape to at least 25mm so both sensors trigger simultaneously.',
          'Step 3: Check sensor alignment to ensure both sensors are level and parallel.'
        ], 
        explanation: 'If the rover approaches the intersection at an angle, one sensor triggers before the other; without simultaneous detection, the FSM treats it as a normal steering correction.' 
      }
    ],
    checksForUnderstanding: [
      'Why is simultaneous multi-sensor detection (\`leftDark && rightDark\`) necessary to distinguish an intersection from a curve?',
      'Explain the mechanical necessity of the Axle Alignment Coast distance in differential drive robots.',
      'How does closed-loop line-catching improve turning accuracy compared to fixed open-loop millisecond delays?'
    ],
    exitTicket: [
      { 
        question: 'Why does a mobile robot with front-mounted sensors need to drive forward slightly after detecting an intersection before executing a 90-degree turn?', 
        rubricOrSampleReasoning: 'To align its rear differential drive wheels directly over the intersection center, preventing the front sensors from swinging wide off the outbound track branch.' 
      },
      { 
        question: 'What is the primary operational failure of using hardcoded delay() times for robot turns when running on battery power?', 
        rubricOrSampleReasoning: 'As battery voltage decays over time, motor RPM decreases; a fixed delay that turned 90° on a fresh battery will turn less than 75° on depleted cells, causing derailment.' 
      },
      { 
        question: 'In graph-based topological navigation, what physical features correspond to nodes and edges in a grid maze arena?', 
        rubricOrSampleReasoning: 'Intersection cross points (T-junctions, crosses, corners) correspond to graph nodes (vertices), while the straight connecting tape segments correspond to graph edges.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-configured 2-node arena layouts (Single L-turn and Finish box) for initial tuning.'],
      extension: ['Implement dynamic Left-Hand Wall Following (Pledge/Tremaux algorithm) for unknown maze exploration.'],
      offlineOption: ['Simulate grid maze intersection state transitions and route arrays in the interactive route planner visualizer.']
    },
    nextLessonId: 'int-08',
    nextLessonTeaser: 'Intermediate 08: CAD Assemblies, Gears, and Fit — Model multi-component robotic digital twins, simulate gear ratios, and engineer 3D-printable chassis upgrades!',
    sources: [{ title: 'IEEE: Graph-Based Topological Path Planning for Mobile Robotics', url: 'https://ieeexplore.ieee.org' }],
    assetCredits: [{ asset: 'Maze Grid Blueprint', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const int08 = `  {
    id: 'int-08',
    fieldGuideLinks: {
      readBeforeClass: ["fg-design-cad-measurement"],
      lookUpWhileBuilding: ["fg-design-cad-measurement"],
      goDeeper: ["fg-comp-sg90-servo"]
    },
    courseId: 'intermediate',
    sequence: 8,
    code: 'INTERMEDIATE 08',
    title: 'CAD Assemblies, Gears, and Fit',
    promise: 'By the end of this masterclass, you will model multi-component parametric CAD assemblies, define kinematic joints and mate constraints, calculate spur gear ratios and tooth meshing pitch, and verify interference clearances for 3D-printable chassis upgrades.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Beginner 08'],
    outcomes: [
      'Construct multi-part digital twin assemblies using parametric mates and kinematic joint constraints.',
      'Calculate spur gear transmission ratios, pitch circle diameters, and center-to-center distances.',
      'Perform automated interference detection to isolate part collisions prior to 3D printing or CNC machining.',
      'Design captive M3 hex nut pockets, screw bosses, and clearance holes compliant with FDM tolerances.',
      'Export production-ready STEP and STL files with optimized layer print orientations for maximum strength.'
    ],
    vocabulary: [
      { 
        term: 'Digital Twin Assembly', 
        plainMeaning: 'A complete 3D computer model of the entire robot where every motor, bolt, and sensor fits together digitally.', 
        technicalMeaning: 'A virtual CAD representation of a physical electro-mechanical system comprising multiple interconnected parts with defined spatial constraints.' 
      },
      { 
        term: 'Kinematic Joint Constraint', 
        plainMeaning: 'Rules in 3D software that lock parts together while letting specific parts rotate or slide like real hinges.', 
        technicalMeaning: 'Mathematical relationships that restrict specific degrees of freedom (DOF) between mating CAD bodies (e.g. revolute, slider, planar, rigid).' 
      },
      { 
        term: 'Pitch Circle Diameter (PCD)', 
        plainMeaning: 'The imaginary smooth circle where two interlocking gears touch and roll against each other.', 
        technicalMeaning: 'The operational diameter of a gear where tooth velocity matches, calculated as $d = m \\times z$ (module multiplied by tooth count).' 
      },
      { 
        term: 'Gear Backlash', 
        plainMeaning: 'The tiny gap between gear teeth that prevents them from jamming against each other.', 
        technicalMeaning: 'The intentional clearance between non-driving tooth surfaces of mating gears necessary to absorb thermal expansion and manufacturing tolerances.' 
      },
      { 
        term: 'Interference Collision Check', 
        plainMeaning: 'A CAD button that highlights in bright red where two solid parts are accidentally occupying the same physical space.', 
        technicalMeaning: 'A boolean volumetric intersection analysis that identifies overlapping solid geometries within an assembly.' 
      },
      { 
        term: 'Captive Nut Pocket', 
        plainMeaning: 'A hexagonal slot modeled into plastic so a steel nut slides in and cannot spin when you tighten the screw.', 
        technicalMeaning: 'An internal hexagonal cavity designed to mechanically lock an ISO standard hex nut against rotational torque during threaded fastener assembly.' 
      }
    ],
    teacherPrep: [
      'Pre-load CAD workstations (Fusion 360, Onshape, or FreeCAD) with standardized RoboBEE component library (Arduino Uno, TT Motor, SG90, TCRT5000).',
      'Prepare 3D printed samples showing proper vs improper gear mesh and stripped plastic threads vs captive steel nuts.'
    ],
    verifiedMaterials: [
      'CAD workstation with parametric modeling software (Fusion 360 / Onshape)',
      'Digital Vernier Caliper (0.01mm resolution)',
      'Sample 3D printed spur gear sets (Module 1.0, 20T and 40T)',
      'M3 socket head cap screws (10mm, 16mm) and M3 hex nuts',
      'Standard TT gearmotor and Arduino Uno R3 physical hardware for dimension verification'
    ],
    safetyNotes: [
      'Computer laboratory ergonomics: maintain proper posture and monitor distance during extended 3D modeling.',
      'Handle digital calipers carefully; never use caliper jaws as pry bars or scribing tools.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display full virtual twin assembly of Boston Dynamics Spot and competition battlebots; explain why NASA models every screw in CAD.', 
        studentAction: 'Analyze why discovering a 1mm collision in CAD saves weeks of wasted fabrication time.' 
      },
      { 
        segment: '10–25m Assemblies', 
        minutes: 15, 
        teacherAction: 'Demonstrate assembly mates: Fastened/Rigid mates, Revolute joints, and Center Distance formula ($a = m(z_1+z_2)/2$).', 
        studentAction: 'Mate TT gearmotor models onto chassis baseplate using concentric cylinder constraints.' 
      },
      { 
        segment: '25–50m Design', 
        minutes: 25, 
        teacherAction: 'Guide modeling of a reinforced front sensor bracket with captive M3 hex nut pockets; supervise interference checking.', 
        studentAction: 'Model custom chassis upgrade, run interference analysis, resolve red collisions, and export STL.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review student CAD assemblies and evaluate clearance fit tolerances.', 
        studentAction: 'Submit CAD assembly file and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. From Discrete Parts to Multi-Body Assemblies (Degrees of Freedom)',
        explanation: 'In Beginner 08, we modeled isolated 3D parts. In competitive robotics, parts must interact in a unified Digital Twin Assembly. An unconstrained body in 3D space possesses 6 Degrees of Freedom (DOF): 3 translational axes ($X, Y, Z$) and 3 rotational axes (Roll, Pitch, Yaw). Assembly modeling involves systematically applying Mate Constraints (such as Coincident planes, Concentric axes, and Tangent surfaces) to eliminate unwanted DOF until parts occupy their exact physical relationships relative to a Grounded Baseplate.',
        instructorNote: 'Demonstrate what happens to an ungrounded component: clicking and dragging sends it floating wildly across virtual 3D space.'
      },
      {
        title: '2. Parametric Assembly Mates vs Static Positioning',
        explanation: 'Never "eyeball" or drag parts into place! Modern CAD employs Parametric Joint Constraints. A Fastened (Rigid) Mate locks all 6 DOF between two mating features (such as a motor face and chassis bracket). A Revolute Joint locks 5 DOF while allowing 1 rotational axis of freedom, enabling virtual simulation of spinning wheels and rotating robotic gripper claws. If the chassis thickness changes from 3.0mm to 4.5mm in the parametric timeline, all mated motors, brackets, and screws automatically update their positions flawlessly.',
        instructorNote: 'Show students the parametric timeline: change chassis width by 20mm and watch all attached motors shift outward automatically.'
      },
      {
        title: '3. Spur Gear Kinematics: Modules, Tooth Count & Gear Ratios',
        explanation: 'Gears transmit rotational mechanical power between rotating shafts. The fundamental metric governing metric spur gears is the Module ($m$), defined as the pitch diameter divided by the number of teeth ($m = d / z$). Two gears can ONLY mesh if they share the exact same Module! The Gear Transmission Ratio ($i$) determines the trade-off between speed and torque: $i = z_2 / z_1 = \\omega_1 / \\omega_2 = \\tau_2 / \\tau_1$. A 12-tooth pinion driving a 36-tooth gear provides a 3:1 speed reduction, cutting output RPM by one-third while tripling available driving torque!',
        instructorNote: 'Write the gear ratio equation on the board: Torque Output = Torque Input × Ratio × Efficiency.'
      },
      {
        title: '4. Pitch Circle Meshing and Center-to-Center Distance Calculation',
        explanation: 'How far apart must you drill the axle holes for two mating gears? In CAD, this is governed by the Center-to-Center Distance formula: $a = \\frac{d_1 + d_2}{2} = \\frac{m(z_1 + z_2)}{2}$. For example, mating a 20-tooth gear ($z_1 = 20$) with a 40-tooth gear ($z_2 = 40$) of Module 1.0 requires an exact theoretical center distance of $a = 1.0(20 + 40) / 2 = 30.0\\text{mm}$. However, in FDM 3D printing, molten plastic expands slightly. Engineers add intentional Backlash Clearance (+0.25mm to +0.4mm), positioning axles at 30.3mm to prevent teeth from binding.',
        instructorNote: 'Pass around 3D printed gears mounted at exactly 30.0mm (binds tightly) vs 30.3mm (spins like silk).'
      },
      {
        title: '5. Volumetric Interference Checking and Fastener Clearance Fits',
        explanation: 'Before sending a CAD file to a 3D printer or laser cutter, engineers execute an automated Interference Check. The CAD engine computes boolean intersections across all assembly bodies, highlighting overlapping solids in bright red. Common rookie mistakes include: screws colliding with internal motor gears, zero clearance between wheel hubs and chassis side-plates, and undersized screw holes. For standard metric M3 screws, clearance holes must be modeled at 3.4mm (+0.4mm clearance) to allow screws to pass through without reaming.',
        instructorNote: 'Run a live interference check on an unverified assembly: show how CAD instantly flags a 12mm bolt penetrating a motor gearbox.'
      },
      {
        title: '6. Design for Additive Assembly (DFAA): Captive Hex Nut Pockets',
        explanation: 'Attempting to tap metric screw threads directly into 3D printed plastic creates weak, fragile joints that strip out the second time a screw is tightened. Professional robotics chassis utilize Captive Hex Nut Pockets. A standard metric M3 hex nut measures 5.5mm across the flats and 2.4mm thick. In CAD, we model a hexagonal pocket with dimensions of 5.8mm width and 2.6mm depth. The steel nut slides snugly into the plastic pocket during assembly, providing rock-solid steel-on-steel clamping pressure that withstands violent competition impacts.',
        instructorNote: 'Demonstrate captive nut installation: press an M3 nut into a 3D printed bracket and tighten a screw until the chassis flexes—it never strips!'
      }
    ],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Reinforced Sensor/Chassis Digital Twin Upgrade',
      deliverableType: 'cad_model',
      successEvidence: [
        'Complete multi-part CAD digital twin assembly with baseplate, twin TT gearmotors, wheels, and front sensor mount.',
        'Zero volumetric interference errors detected across all mated components in automated collision analysis.',
        'Custom sensor bracket features integrated captive M3 hex nut pockets and 3.4mm clearance fastener slots.'
      ]
    },
    activity: {
      title: 'Model and Verify the Digital Twin Chassis Assembly',
      steps: [
        'Step 1: Open CAD workspace and insert the standardized grounded chassis baseplate component.',
        'Step 2: Import twin TT gearmotors and constrain them to chassis mounting tabs using cylindrical joint mates.',
        'Step 3: Measure physical motor axle with vernier caliper; insert drive wheels and mate using revolute joint.',
        'Step 4: Sketch a reinforced front optical sensor bracket incorporating dual captive M3 hex nut pockets (5.8mm flats).',
        'Step 5: Run global Interference Analysis across all assembly bodies; inspect and resolve any red collision highlights.',
        'Step 6: Export print-ready STL file with flat base orientation for optimal layer adhesion and strength.'
      ],
      successCriteria: [
        'All assembly components fully constrained with zero floating ungrounded degrees of freedom.',
        'Interference report passes with zero volumetric collisions detected.',
        'Fastener holes and captive nut pockets correctly sized for standard M3 hardware.'
      ]
    },
    troubleshooting: [
      { 
        symptom: '3D printed spur gears bind tightly and will not spin when mounted on the chassis.', 
        checks: [
          'Step 1: Verify the center-to-center distance in CAD—did you use theoretical pitch distance without backlash?',
          'Step 2: Increase center distance by +0.3mm to account for FDM filament squish and tooth expansion.',
          'Step 3: Check printer slicer horizontal expansion settings (-0.05mm).'
        ], 
        explanation: 'FDM 3D printing causes microscopic plastic bulging along layer lines; zero-clearance CAD pitch circles force interlocking teeth into severe interference.' 
      },
      { 
        symptom: 'CAD components float apart or jump to crazy angles when dragged in the viewport.', 
        checks: [
          'Step 1: Verify that the chassis baseplate is officially "Grounded" (locked to origin).',
          'Step 2: Check Joint relationships in the assembly tree—are there conflicting or incomplete mates?',
          'Step 3: Add explicit concentric cylinder and planar coincidence mates to lock remaining free DOF.'
        ], 
        explanation: 'Components without sufficient constraints retain free rotational or translational degrees of freedom, moving whenever the user clicks within the 3D space.' 
      },
      { 
        symptom: 'M3 screws strip out the plastic when tightened onto the chassis.', 
        checks: [
          'Step 1: Replace simple drilled holes with captive M3 hex nut pockets.',
          'Step 2: Model nut pocket width to 5.8mm across flats and 2.6mm depth.',
          'Step 3: Use a steel M3 nut to absorb clamping force instead of plastic threads.'
        ], 
        explanation: 'Inter-layer plastic strength is insufficient to support the high tensile clamping preload generated by steel metric machine screw threads.' 
      },
      { 
        symptom: 'Interference check shows red collision between motor screws and internal gearbox gears.', 
        checks: [
          'Step 1: Check fastener screw length in BOM—is an M3x16mm screw specified where an M3x10mm is required?',
          'Step 2: Shorten screw length or add a 3D-printed spacer washer under the screw head.'
        ], 
        explanation: 'Overly long machine screws protrude past motor mounting flanges, physically locking internal reduction gears.' 
      }
    ],
    checksForUnderstanding: [
      'What are the 6 physical degrees of freedom that must be accounted for when constraining parts in CAD?',
      'Why is intentional backlash clearance (+0.2mm to +0.4mm) required when designing 3D-printed spur gears?',
      'Explain the engineering advantage of captive hex nut pockets over threading screws directly into plastic.'
    ],
    exitTicket: [
      { 
        question: 'Calculate the theoretical center-to-center distance required between two mating spur gears with Module 1.0, where Gear 1 has 15 teeth and Gear 2 has 45 teeth.', 
        rubricOrSampleReasoning: 'Formula: a = m(z1 + z2) / 2. Here, a = 1.0(15 + 45) / 2 = 60 / 2 = 30.0 mm.' 
      },
      { 
        question: 'What specific problem does an automated CAD interference check detect before manufacturing physical parts?', 
        rubricOrSampleReasoning: 'It detects volumetric overlap collisions where two solid components occupy the same physical space simultaneously, identifying misaligned holes or colliding parts.' 
      },
      { 
        question: 'Why must clearance holes for standard M3 screws be modeled at 3.4mm in 3D-printed parts instead of exactly 3.0mm?', 
        rubricOrSampleReasoning: 'FDM 3D printing causes inward hole shrinkage due to thermoplastic cooling; a 3.4mm hole produces a clean, free-sliding clearance fit for a 3.0mm nominal screw shank.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-aligned motor and chassis sub-assemblies with pre-placed joint origin points.'],
      extension: ['Model a 2-stage compound reduction gear train achieving a 9:1 mechanical advantage ratio.'],
      offlineOption: ['Practice vernier caliper measurements and tolerance calculations on physical chassis hardware.']
    },
    nextLessonId: 'int-09',
    nextLessonTeaser: 'Intermediate 09: Wireless Control & Telemetry: Deadman Failsafes — Pilot your robot wirelessly using local, secure serial command packets and fail-safe watchdog timers!',
    sources: [{ title: 'Autodesk Fusion 360 Assembly & Joint Constraint Design Guide', url: 'https://autodesk.com' }],
    assetCredits: [{ asset: 'Chassis Digital Twin Assembly', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const int09 = `  {
    id: 'int-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comm-i2c-spi-uart", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-prog-millis-vs-delay"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'intermediate',
    sequence: 9,
    code: 'INTERMEDIATE 09',
    title: 'Wireless Control & Telemetry: Deadman Failsafes',
    promise: 'By the end of this masterclass, you will engineer a low-latency wireless teleoperation link using single-byte serial protocols, implement a strict non-blocking Deadman Watchdog Failsafe with millis(), and stream real-time sensor telemetry back to a control station without drive-loop lag.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 04'],
    outcomes: [
      'Parse low-latency single-byte wireless command packets (F, B, L, R, S) via UART serial bridges.',
      'Implement a strict non-blocking Deadman Watchdog Failsafe that halts motors if communication ceases for >500ms.',
      'Stream real-time robot telemetry (battery voltage, obstacle distance) back to control station at 5 Hz.',
      'Prevent UART buffer overflow and command lag by flushing stale serial FIFO buffers.',
      'Demonstrate fail-safe emergency motor braking upon abrupt wireless transmitter disconnect.'
    ],
    vocabulary: [
      { 
        term: 'Deadman Failsafe', 
        plainMeaning: 'A safety emergency brake that immediately stops the robot if the wireless signal or controller battery dies.', 
        technicalMeaning: 'A fail-safe mechanism designed to automatically halt machine actuation if the human operator ceases activity or the communication link is interrupted.' 
      },
      { 
        term: 'UART Serial Bridge', 
        plainMeaning: 'A wireless radio module (like Bluetooth HC-05) that turns wireless radio waves into simple serial wire data.', 
        technicalMeaning: 'An asynchronous transceiver module that bridges RF/Bluetooth packets to standard TTL serial UART (TX/RX) data streams.' 
      },
      { 
        term: 'Single-Byte Protocol', 
        plainMeaning: 'Sending single letters like "F" for Forward instead of full sentences, making the robot respond instantly.', 
        technicalMeaning: 'A minimal communication framing architecture where each ASCII byte represents an atomic operational command, minimizing transmission latency.' 
      },
      { 
        term: 'Telemetry Streaming', 
        plainMeaning: 'The robot constantly reporting its battery percentage and sensor readings back to your screen.', 
        technicalMeaning: 'The automated transmission of system health metrics, sensor data, and operating state from a remote agent to a monitoring terminal.' 
      },
      { 
        term: 'UART FIFO Buffer', 
        plainMeaning: 'A 64-byte waiting line inside the chip where incoming messages wait to be read by your program.', 
        technicalMeaning: 'A hardware/software ring buffer (First-In, First-Out) used by the microcontroller UART receiver to store incoming serial bytes until parsed.' 
      },
      { 
        term: 'Loss of Signal (LOS)', 
        plainMeaning: 'When the wireless connection drops because the robot drove out of range or hit radio interference.', 
        technicalMeaning: 'The cessation of valid packet reception over a wireless communications channel exceeding a predetermined timeout threshold.' 
      }
    ],
    teacherPrep: [
      'Pair Bluetooth HC-05 modules with lab tablets/phones; verify baud rate is configured to standard 9600 baud.',
      'Prepare test track with cardboard barricades to demonstrate safety deadman cutoff.'
    ],
    verifiedMaterials: [
      '2WD Mobile Rover with TB6612FNG driver and Arduino Uno Rev3',
      'HC-05 or HC-06 Bluetooth Serial Transceiver Module (or USB Serial fallback)',
      'Android Tablet / Laptop with Bluetooth Terminal / Serial Monitor',
      '7.4V Li-Ion Battery Pack with master safety switch',
      'Voltage divider resistors (1kΩ and 2kΩ) for 3.3V Bluetooth RX protection'
    ],
    safetyNotes: [
      'MANDATORY DEADMAN RULE: Every wireless robot MUST automatically halt within 1.0 second of signal loss.',
      'Never operate high-speed wireless rovers in crowded classroom aisles; keep test runs inside the taped arena.',
      'Disconnect Bluetooth module RX/TX wires during USB sketch upload to prevent hardware serial port contention.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Ask: "What happens to a 50kg industrial robot if your Wi-Fi drops while it is driving forward at full speed?" Show runaway robot crash videos.', 
        studentAction: 'Analyze why failsafe engineering is legally mandatory in industrial robotics (ISO 10218).' 
      },
      { 
        segment: '10–30m Protocol', 
        minutes: 20, 
        teacherAction: 'Explain UART framing: single-byte parsing vs multi-byte strings. Teach non-blocking deadman clock: \`if (millis() - lastPacketTime > 500) brake();\`.', 
        studentAction: 'Code single-byte command parser (\`switch(cmd)\`) and deadman watchdog check.' 
      },
      { 
        segment: '30–50m Failsafe Test', 
        minutes: 20, 
        teacherAction: 'Supervise transmitter disconnect trials: students command forward motion, then abruptly turn off transmitter Bluetooth.', 
        studentAction: 'Verify robot motors engage active dynamic braking within 500ms of transmitter disconnect.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review telemetry packet formatting and inspect failsafe reliability.', 
        studentAction: 'Demonstrate live telemetry streaming and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Wireless Teleoperation Architecture & Communication Protocols',
        explanation: 'Controlling an autonomous or teleoperated mobile robot requires a robust communications link. Wireless transceivers (such as the Bluetooth HC-05 or 2.4 GHz NRF24L01) act as transparent UART Serial Bridges: data sent wirelessly appears directly on the microcontroller UART hardware pins (Digital 0 RX and Digital 1 TX). Understanding baud rate synchronization (9600 bits per second = 960 bytes/sec) is critical; mismatched baud rates result in corrupted framing and garbled nonsense characters.',
        instructorNote: 'Remind students: Arduino Pins 0 and 1 are hardwired to the onboard USB chip. Bluetooth modules must be unplugged during code upload!'
      },
      {
        title: '2. Low-Latency Single-Byte Protocols vs Multi-Byte String Parsing',
        explanation: 'Novice programmers often transmit verbose English text strings: \`"MOVE_FORWARD_AT_SPEED_150\\n"\`. This is terrible engineering! Transmitting a 28-character string takes ~29 milliseconds at 9600 baud, requires dynamically allocating memory buffers, and wastes CPU cycles parsing substrings. A production robotics protocol uses Single-Byte Atomic Commands: \`F\` = Forward, \`B\` = Reverse, \`L\` = Left, \`R\` = Right, \`S\` = Stop. A single ASCII character takes only 1.04 milliseconds to transmit and is evaluated instantaneously by a C++ \`switch(cmd)\` jump table with zero memory overhead.',
        instructorNote: 'Compare transmission times on the board: 1 byte (1ms) vs 30 bytes (31ms). Explain how lag accumulates when driving at 1 meter/second.'
      },
      {
        title: '3. The Physics of the Deadman Watchdog Clock',
        explanation: 'If a robot receives the command \`F\` (Forward), its H-Bridge will keep driving motors forward indefinitely until told otherwise. If the operator trips, the controller battery dies, or the robot drives behind a concrete wall, the rover becomes a dangerous runaway missile! To prevent catastrophic failure, ISO 10218 safety standards mandate a Deadman Watchdog Timer. Every time a valid packet arrives, the firmware refreshes a timestamp: \`lastPacketTime = millis();\`. On every loop iteration, the CPU evaluates: \`if (millis() - lastPacketTime > TIMEOUT_MS) { brake(); }\`. If signal drops for over 500ms, the robot halts instantly.',
        instructorNote: 'Draw the watchdog timeline: show packet pulses resetting the timer before it reaches the 500ms trip threshold.'
      },
      {
        title: '4. Non-Blocking Telemetry Feedback Streaming (Duplex Communication)',
        explanation: 'True teleoperation is a Two-Way Conversation (Full Duplex). While receiving operator driving commands, the rover must simultaneously transmit its internal health metrics back to the control terminal. However, sending telemetry strings must NEVER block motor control! Utilizing our non-blocking \`millis()\` architecture from Advanced 03, the rover transmits a structured JSON telemetry packet (\`{"bat":7.42,"dist":35}\`) at a steady 5 Hz (every 200ms) without using a single millisecond of blocking \`delay()\`.',
        instructorNote: 'Demonstrate live telemetry streaming into the Arduino Serial Plotter: watch battery voltage curve under motor load in real time.'
      },
      {
        title: '5. UART FIFO Buffer Overflow and Stale Command Latency',
        explanation: 'The ATmega328P hardware serial receiver utilizes a 64-byte circular FIFO (First-In, First-Out) buffer. If the operator mashes directional buttons rapidly while the robot executes a slow function, dozens of keystrokes accumulate in the buffer. When the operator releases the controls, the robot continues driving for several seconds as it blindly processes the stale backlog of commands! Robust firmware flushes or parses only the newest command byte: \`while (Serial.available() > 1) { Serial.read(); }\`, discarding stale commands instantly.',
        instructorNote: 'Demonstrate command lag: flood the serial monitor with 30 "F" characters and watch an unbuffered robot refuse to stop when commanded.'
      },
      {
        title: '6. Radio Frequency Interference, Line-of-Sight, and Multipath Reflections',
        explanation: 'Standard 2.4 GHz radio signals (Bluetooth, Wi-Fi) suffer significant attenuation when passing through metal chassis plates, human bodies, or concrete classroom walls. In crowded competition arenas with hundreds of active smartphones, 2.4 GHz RF congestion leads to high packet drop rates. Mounting transceiver antennas externally, adding 0.1µF decoupling capacitors across power leads to suppress motor brush noise, and tuning deadman timeouts to tolerate brief 100ms packet drops prevent false emergency stops while maintaining safety.',
        instructorNote: 'Show the physical RF module placement: explain why mounting an antenna inside an aluminum chassis completely kills range (Faraday cage effect).'
      }
    ],
    visualizerId: 'iot_dashboard_sim',
    project: {
      name: 'Fail-Safe Wireless Teleoperation Rover',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Rover responds smoothly to single-byte wireless directional commands (F, B, L, R, S) with zero noticeable latency.',
        'Strict Deadman Watchdog engages active dynamic braking within 500ms of transmitter power-down or signal loss.',
        'Streams real-time battery voltage and ultrasonic obstacle distance telemetry back to control station at 5 Hz.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Mobile Rover Assembly', 'HC-05 Bluetooth Module', 'TB6612FNG Motor Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Mobile Rover Chassis', exactVariant: 'Differential drive with twin 1:48 gearmotors and battery pack', quantity: 1 },
        { name: 'HC-05 Bluetooth Transceiver', exactVariant: 'Standard 6-pin breakout board (configured at 9600 baud)', quantity: 1 },
        { name: 'TB6612FNG Motor Driver', exactVariant: 'Toshiba dual H-Bridge breakout with common ground', quantity: 1 },
        { name: 'Resistor Divider for RX', exactVariant: '1kΩ and 2kΩ 1/4W resistors (5V Arduino TX to 3.3V HC-05 RX)', quantity: 2 },
        { name: 'Arduino Uno Rev3', exactVariant: 'DIP edition with hardware UART on Pins 0 and 1', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'HC-05 VCC ➔ Arduino 5V | HC-05 GND ➔ Arduino GND | HC-05 TXD ➔ Arduino Pin 0 (RX) | Arduino Pin 1 (TX) ➔ 1k/2k Divider ➔ HC-05 RXD. Motor Driver on Pins 3-10.',
      wireTable: [
        { from: 'HC-05 Bluetooth VCC', to: 'Arduino 5V Pin', wireOrPolarityNote: 'Powers internal Bluetooth radio' },
        { from: 'HC-05 Bluetooth GND', to: 'Arduino GND Pin', wireOrPolarityNote: 'Common logic ground' },
        { from: 'HC-05 Bluetooth TXD', to: 'Arduino Digital Pin 0 (RX)', wireOrPolarityNote: 'Carries wireless commands from module to Arduino' },
        { from: 'Arduino Digital Pin 1 (TX)', to: '1kΩ Resistor ➔ HC-05 RXD', wireOrPolarityNote: 'Voltage divider input (converts 5V logic to 3.3V)' },
        { from: 'HC-05 RXD Pin', to: '2kΩ Resistor ➔ Arduino GND', wireOrPolarityNote: 'Voltage divider lower leg' },
        { from: 'TB6612 Driver Pins', to: 'Arduino Pins 3, 5, 6, 7, 8, 9, 10', wireOrPolarityNote: 'Standard TB6612 motor control pinout' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure Bluetooth module is UNPLUGGED from Pins 0 and 1 before connecting USB cable.',
        '2. Upload the fail-safe teleoperation sketch to Arduino Uno via Arduino IDE.',
        '3. Unplug USB cable; wire HC-05 Bluetooth module according to wire table with voltage divider.',
        '4. Power rover via 7.4V battery pack; verify HC-05 red LED flashes rapidly (waiting for connection).',
        '5. Pair Android tablet/phone with HC-05 (passcode: 1234); open Bluetooth terminal app.',
        '6. Send "F" command; observe wheels spin forward. Disconnect app; observe wheels halt within 500ms.'
      ],
      powerAndSafetyChecks: [
        'Always implement the voltage divider on HC-05 RXD; supplying 5V directly damages the 3.3V Bluetooth chip.',
        'Never test wireless driving on a table; place robot on the floor before pairing Bluetooth.',
        'Always test the emergency Deadman cutoff before conducting any high-speed runs.'
      ],
      testCases: [
        { action: 'Send "F" command via Bluetooth', expectedResult: 'Rover drives forward at SPEED_TELEOP.' },
        { action: 'Send "S" command via Bluetooth', expectedResult: 'Rover engages active dynamic braking immediately.' },
        { action: 'Abruptly switch OFF phone Bluetooth while driving', expectedResult: 'Watchdog timer expires; rover halts within exactly 500ms.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Intermediate 09
// Fail-Safe Wireless Teleoperation Controller with Deadman Watchdog
// Supports Bluetooth HC-05 / USB Serial / Telemetry Feedback Streaming

const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

// SAFETY DEADMAN WATCHDOG CONFIGURATION
// If no valid command packet is received within 500ms, emergency brakes engage!
const unsigned long DEADMAN_TIMEOUT_MS = 500;
unsigned long lastPacketTime = 0;
bool failsafeTriggered = false;

// TELEMETRY STREAMING CONFIGURATION (5 Hz = every 200ms)
const unsigned long TELEMETRY_INTERVAL_MS = 200;
unsigned long lastTelemetryTime = 0;

const int SPEED_TELEOP = 160;

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  // Initialize Hardware UART at 9600 baud (Bluetooth HC-05 default)
  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE FAIL-SAFE TELEOPERATION ROVER "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Ready. Send 'F','B','L','R','S'."));

  lastPacketTime = millis();
}

void loop() {
  unsigned long now = millis();

  // 1. PROCESS INCOMING WIRELESS COMMANDS
  if (Serial.available() > 0) {
    char cmd = Serial.read();

    // Flush any stale backlog bytes to ensure zero control lag
    while (Serial.available() > 0) {
      cmd = Serial.read(); // Keep only the newest incoming byte
    }

    lastPacketTime = now; // Reset Deadman Watchdog Clock
    failsafeTriggered = false;
    executeCommand(cmd);
  }

  // 2. STRICT DEADMAN WATCHDOG FAILSAFE CHECK
  if (!failsafeTriggered && (now - lastPacketTime > DEADMAN_TIMEOUT_MS)) {
    brake();
    failsafeTriggered = true;
    Serial.println(F("⚠️ [ALERT] DEADMAN TIMEOUT: Signal lost > 500ms. Brakes locked!"));
  }

  // 3. NON-BLOCKING TELEMETRY FEEDBACK STREAMING (5 Hz)
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = now;
    sendTelemetry();
  }
}

void executeCommand(char cmd) {
  switch (cmd) {
    case 'F': case 'f':
      drive(SPEED_TELEOP, SPEED_TELEOP);
      break;
    case 'B': case 'b':
      drive(-SPEED_TELEOP, -SPEED_TELEOP);
      break;
    case 'L': case 'l':
      drive(-SPEED_TELEOP, SPEED_TELEOP); // Zero-radius tank spin left
      break;
    case 'R': case 'r':
      drive(SPEED_TELEOP, -SPEED_TELEOP); // Zero-radius tank spin right
      break;
    case 'S': case 's':
      brake();
      break;
    default:
      // Ignore invalid characters (newlines, carriage returns)
      break;
  }
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

void sendTelemetry() {
  // Simulate telemetry: measure analog A0 battery voltage rail
  int rawADC = analogRead(A0);
  float voltage = (rawADC / 1023.0) * 5.0 * 2.0; // Scaled for 2:1 divider

  Serial.print(F("{\\"v\\":"));
  Serial.print(voltage, 2);
  Serial.print(F(",\\"safe\\":"));
  Serial.print(failsafeTriggered ? 0 : 1);
  Serial.println(F("}"));
}
\`,
      pinMap: {
        'Pin 0 (RX)': 'Hardware UART receive from Bluetooth HC-05 TXD',
        'Pin 1 (TX)': 'Hardware UART transmit through 1k/2k divider to HC-05 RXD',
        'Pins 3-10': 'TB6612FNG dual motor driver speed and direction control pins',
        'Pin A0': 'Battery voltage monitoring analog input rail'
      },
      setupAndUpload: [
        '1. Disconnect Bluetooth module from Pins 0 and 1 before uploading.',
        '2. Upload sketch via Arduino IDE; verify compilation succeeds.',
        '3. Reconnect Bluetooth module according to schematic.',
        '4. Open Bluetooth Terminal app on mobile device and connect to HC-05.',
        '5. Send "F" to drive forward; turn off phone Bluetooth to verify instant safety stop.'
      ],
      explanations: [
        'DEADMAN_TIMEOUT_MS (500ms): Sets the maximum allowable elapsed time without communication before fail-safe shutdown.',
        'while (Serial.available() > 0) flush: Discards accumulated stale commands to eliminate control lag.',
        'sendTelemetry(): Formats compact JSON packets for control station dashboards at 5 Hz without blocking loop execution.'
      ],
      expectedResult: 'Rover responds instantly to wireless keystrokes, streams telemetry packets at 5 Hz, and engages active braking within 500ms if communication drops.',
      caveats: [
        'Never set DEADMAN_TIMEOUT_MS to 0 or comment out the watchdog check during competition testing.',
        'Always unplug Bluetooth module RX wire before uploading sketches via USB to prevent programming errors.'
      ],
      tweakTip: 'Configure the mobile app to send a heartbeat character "." every 200ms while holding a virtual steering joystick to keep the watchdog timer happy!'
    },
    activity: {
      title: 'Implement and Validate the Wireless Safety Failsafe',
      steps: [
        'Step 1: Wire the HC-05 Bluetooth transceiver with the 1k/2k voltage divider on its RX pin.',
        'Step 2: Upload the fail-safe controller firmware with Serial Monitor open at 9600 baud.',
        'Step 3: Pair mobile tablet with HC-05 and verify bidirectional communication.',
        'Step 4: Command the robot to drive forward across the floor at 160 PWM.',
        'Step 5: Abruptly power down the mobile transmitter; measure the elapsed time until motors halt.',
        'Step 6: Confirm motors halt in under 500ms with zero runaway distance.'
      ],
      successCriteria: [
        'Rover responds cleanly to all 5 single-byte directional commands (F, B, L, R, S).',
        'Braking engages within 500ms of transmitter disconnect with zero runaway overshoot.',
        'Telemetry packets stream continuously at 5 Hz without causing motor stutter.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Sketch upload fails with "avrdude: stk500_recv(): programmer is not responding".', 
        checks: [
          'Step 1: Disconnect the Bluetooth module from Arduino Pins 0 (RX) and 1 (TX).',
          'Step 2: Retry the USB upload with pins disconnected.',
          'Step 3: Reconnect Bluetooth module ONLY after upload finishes successfully.'
        ], 
        explanation: 'The ATmega328P shares hardware pins 0 and 1 with the onboard USB-to-Serial converter; connecting a Bluetooth module causes electrical signal contention during flashing.' 
      },
      { 
        symptom: 'Rover continues driving indefinitely after the mobile app is closed or disconnected.', 
        checks: [
          'Step 1: Verify the deadman condition in code—is it inside loop() or trapped inside an if(Serial.available()) block?',
          'Step 2: Ensure \`now - lastPacketTime > DEADMAN_TIMEOUT_MS\` is evaluated unconditionally on every loop cycle.',
          'Step 3: Confirm \`brake()\` engages active dynamic braking (AIN1=HIGH, AIN2=HIGH).'
        ], 
        explanation: 'If the timeout check is mistakenly placed inside the \`if (Serial.available())\` block, it will never execute when communication ceases because no new bytes arrive!' 
      },
      { 
        symptom: 'Rover responds with 1 to 2 seconds of lag after tapping directional buttons.', 
        checks: [
          'Step 1: Check if blocking \`delay()\` calls exist inside your motor or telemetry functions.',
          'Step 2: Add the circular buffer flush: \`while (Serial.available() > 0) cmd = Serial.read();\` to discard stale queue.',
          'Step 3: Verify the control app is sending single characters instead of long text strings.'
        ], 
        explanation: 'Stale commands queue up inside the 64-byte UART FIFO buffer; processing them sequentially creates artificial reaction lag.' 
      },
      { 
        symptom: 'Serial Monitor displays strange question marks and corrupted symbols (e.g. "").', 
        checks: [
          'Step 1: Check Serial Monitor baud rate setting—is it set to 9600 baud?',
          'Step 2: Verify HC-05 default factory baud rate (typically 9600 for data mode, 38400 for AT mode).',
          'Step 3: Check ground wire between Bluetooth module and Arduino GND.'
        ], 
        explanation: 'Baud rate mismatch causes asynchronous bit timing errors, corrupting ASCII character framing.' 
      }
    ],
    checksForUnderstanding: [
      'Why is an unconditional watchdog check inside loop() necessary to detect communication loss?',
      'Explain why single-byte command protocols ('F', 'B') are superior to multi-byte text strings in robotics.',
      'Why does placing the Bluetooth module on hardware pins 0 and 1 interfere with USB programming?'
    ],
    exitTicket: [
      { 
        question: 'What is the dangerous failure mode of placing the deadman timeout check inside "if (Serial.available() > 0)"?', 
        rubricOrSampleReasoning: 'When wireless connection drops, Serial.available() becomes 0; code inside that block will never execute, leaving motors driving forward indefinitely.' 
      },
      { 
        question: 'Why must a voltage divider (or level shifter) be used between Arduino Pin 1 (TX) and the HC-05 RXD pin?', 
        rubricOrSampleReasoning: 'Arduino Uno outputs 5.0V TTL logic, while the HC-05 Bluetooth transceiver chip operates on 3.3V logic; 5V will degrade or destroy the Bluetooth receiver.' 
      },
      { 
        question: 'How does clearing stale serial buffer bytes eliminate control lag in a wireless teleoperated robot?', 
        rubricOrSampleReasoning: 'It flushes older, queued commands from the FIFO buffer so the microcontroller executes only the most recent operator command instantly.' 
      }
    ],
    differentiation: {
      support: ['Test wireless commands using the USB Serial Monitor text box before introducing Bluetooth hardware.'],
      extension: ['Add a custom mobile app joystick interface sending continuous X/Y analog velocity coordinates.'],
      offlineOption: ['Simulate teleoperation packet parsing and deadman watchdog clocks in the interactive dashboard visualizer.']
    },
    nextLessonId: 'int-10',
    nextLessonTeaser: 'Intermediate 10: Timed Robotics Mission Challenge: Final Review — Put all your mechanical, electrical, and software skills to the test in an official timed team competition!',
    sources: [{ title: 'ISO 10218-1: Robots and Robotic Devices — Safety Requirements', url: 'https://www.iso.org/standard/51330.html' }],
    assetCredits: [{ asset: 'Telemetry Dashboard Layout', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const int10 = `  {
    id: 'int-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging", "fg-comp-tournament-prep"],
      lookUpWhileBuilding: ["fg-safety-lab-code"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'intermediate',
    sequence: 10,
    code: 'INTERMEDIATE 10',
    title: 'Timed Robotics Mission Challenge: Final Review',
    promise: 'By the end of this capstone masterclass, you will compete in an official timed multi-task robotics tournament, conduct rapid pit failure diagnostics under pressure, defend engineering trade-offs before a review panel, and graduate from Level 3: Intermediate Robotics & Systems.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01 through Intermediate 09'],
    outcomes: [
      'Compete in an official multi-task robotics challenge combining line tracking, maze routing, and obstacle response.',
      'Conduct rapid 3-minute pit diagnostics to resolve electromechanical failures under competition pressure.',
      'Quantify the impact of battery voltage droop curves on autonomous turn timing and sensor thresholds.',
      'Defend engineering trade-offs (Speed vs Stability, Simplicity vs Feature-Bloat) before a peer review panel.',
      'Document complete technical iteration history in an official engineering post-mortem journal.'
    ],
    vocabulary: [
      { 
        term: 'Design Trade-Off', 
        plainMeaning: 'Choosing between two good things that fight each other, like making a robot faster versus making it not crash.', 
        technicalMeaning: 'A situational engineering decision that involves diminishing or compromising one performance metric in return for gains in another.' 
      },
      { 
        term: 'Tournament Heats', 
        plainMeaning: 'Multiple competitive timed runs where only your best score or average counts toward the championship.', 
        technicalMeaning: 'Sequential competitive trial rounds conducted under standardized rules to evaluate system consistency and reliability.' 
      },
      { 
        term: 'Pit Turnaround Protocol', 
        plainMeaning: 'A fast, strict checklist done between race rounds to check screws, battery voltage, and sensor lenses.', 
        technicalMeaning: 'A standardized high-speed inspection and maintenance routine executed between competitive heats to ensure mission readiness.' 
      },
      { 
        term: 'Battery Voltage Droop', 
        plainMeaning: 'How a battery gives less voltage as it gets tired, making motors turn slower and turns undershoot.', 
        technicalMeaning: 'The gradual decline of cell terminal voltage as chemical capacity is discharged, altering actuator power output.' 
      },
      { 
        term: 'Engineering Post-Mortem', 
        plainMeaning: 'An honest team discussion after the race about what broke, why it broke, and how to redesign it better.', 
        technicalMeaning: 'A formal retrospective analysis conducted following a project or competition to identify failure root causes and record lessons learned.' 
      },
      { 
        term: 'Scoring Multiplier', 
        plainMeaning: 'Bonus points awarded for clean runs with zero penalties or completing the course in record time.', 
        technicalMeaning: 'A mathematical weighting factor applied to raw performance metrics to incentivize desirable engineering behaviors (such as autonomous accuracy).' 
      }
    ],
    teacherPrep: [
      'Construct official Mission Arena incorporating: Section 1 Line Sprint, Section 2 Grid Intersection, Section 3 Obstacle Evasion, Section 4 Precision Stop Box.',
      'Prepare official referee scorecards, millisecond stopwatches, and Intermediate Certificate of Mastery awards.'
    ],
    verifiedMaterials: [
      'Integrated Competition Mobile Rovers (TB6612, Dual TCRT5000, HC-SR04, Arduino Uno)',
      'Official Arena Track Arena with high-contrast vinyl tape and obstacle props',
      'Digital bench multimeters for battery voltage pit checks',
      'Millisecond competition stopwatches and official scorecards',
      'Emergency Pit Toolkits (hex keys, soldering station, spare jumpers, fresh battery packs)'
    ],
    safetyNotes: [
      'Arena perimeter safety: spectator students must remain behind designated safety lines during live heats.',
      'Never grab a racing robot by its moving wheels; lift by the center chassis plate.',
      'Emergency pit stop rule: if smoke, burning smells, or battery swelling occurs, hit the master power switch immediately.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Briefing', 
        minutes: 10, 
        teacherAction: 'Review official tournament rulebook: Course objectives, 60-second time limit, penalty deductions (-5 pts per track departure), and scoring rubric.', 
        studentAction: 'Conduct pre-flight hardware inspection checklist with team members.' 
      },
      { 
        segment: '10–35m Tournament', 
        minutes: 25, 
        teacherAction: 'Officiate competitive mission heats: track time, log penalties, and enforce 3-minute pit turnaround windows.', 
        studentAction: 'Execute Heat 1, diagnose performance issues in the pit, deploy calibrated firmware adjustments, and execute Heat 2.' 
      },
      { 
        segment: '35–50m Reflection', 
        minutes: 15, 
        teacherAction: 'Facilitate structured engineering post-mortem: "What failed under competition stress that never failed during practice?"', 
        studentAction: 'Document root-cause failure analysis and quantify speed vs stability trade-offs in engineering notebooks.' 
      },
      { 
        segment: '50–60m Graduation', 
        minutes: 10, 
        teacherAction: 'Announce tournament podium rankings, present Intermediate Level Engineering Certifications, and preview Advanced Level.', 
        studentAction: 'Celebrate team accomplishments and complete final course exit reflection.' 
      }
    ],
    concepts: [
      {
        title: '1. Systems Engineering Under Competition Stress (Murphy’s Law)',
        explanation: 'In the quiet environment of a practice bench, a robot might succeed 9 times out of 10. But under the intense heat, lighting variations, and time pressure of an official tournament, any hidden flaw WILL manifest—a truism known as Murphy’s Law. Competition engineering requires robust margins: wire harnesses must be mechanically secured with strain relief, optical sensor thresholds must be resilient against shadows, and software must contain fail-safe state recovery routines.',
        instructorNote: 'Remind students of the engineering maxim: "In competition, the simplest robust machine beats the complex fragile machine every single time."'
      },
      {
        title: '2. Scoring Multipliers, Penalties & The Speed vs Stability Trade-Off',
        explanation: 'Tournament scoring rules are mathematically designed to penalize recklessness: \\n$$\\text{Score} = (100 - T_{\\text{elapsed}}) \\times M_{\\text{accuracy}} - P_{\\text{penalties}}$$\\nSetting motor speed to 100% PWM might yield a fast lap time, but derailing at a sharp corner incurs a 25-point penalty and requires a manual restart. Champion robotics teams calculate their optimal operating window: dialing cruise speed back to 75% guarantees zero track departures, yielding a significantly higher net score through consistent clean-run multipliers.',
        instructorNote: 'Show the scoring math on the board: demonstrate how a steady 20-second clean run beats an aggressive 12-second run with two penalties.'
      },
      {
        title: '3. Battery Discharge Curves and Open-Loop Degradation',
        explanation: 'A 2S Li-Ion battery pack delivers 8.4V when freshly charged off the wall. After two practice runs, terminal voltage drops to 7.4V (nominal), and under heavy motor acceleration, internal resistance causes temporary voltage droop below 6.8V. If your intersection turns rely on open-loop delays (\`delay(350)\`), the robot will turn 90° on fresh batteries, but only 74° on depleted batteries! Tournament teams measure cell voltage with a multimeter before every heat and utilize closed-loop line catching to remain immune to voltage decay.',
        instructorNote: 'Measure a fresh battery pack (8.4V) vs a discharged pack (7.2V) on the projector DMM to show the 15% voltage drop.'
      },
      {
        title: '4. The 3-Minute Pit Turnaround Inspection Protocol',
        explanation: 'In Formula 1 racing and competitive robotics, races are won or lost in the pit lane. Between tournament heats, teams have exactly 3 minutes to inspect their machine. The RoboBEE Pit Protocol mandates a 4-step check: 1. Mechanical: Tug test on wheel hubs and caster screws. 2. Optical: Wipe TCRT5000 lenses with microfiber to clear floor dust. 3. Electrical: Measure battery voltage under load (must be >7.4V). 4. Software: Verify starting heading and sensor baseline values in Serial Monitor.',
        instructorNote: 'Time a mock 3-minute pit stop: assign roles (Hardware Lead, Software Lead, Strategy Lead) to keep teams focused.'
      },
      {
        title: '5. Live Telemetry Logging and Performance Post-Mortems',
        explanation: 'Engineering progress is driven by empirical data, not emotional guesswork. When a robot veers off course at Node 2, an amateur guesses: "Maybe the motor slipped?" A RoboBEE engineer checks the telemetry log: "At timestamp 14.2s, Left IR read 840 (black) while Right IR read 812 (black), but the state machine was trapped in the cruise state because the threshold was set to 850." Telemetry logging converts confusing failures into concrete, fixable firmware parameters.',
        instructorNote: 'Review a live telemetry log: show students how timestamps and sensor numbers isolate the exact millisecond a failure occurred.'
      },
      {
        title: '6. Engineering Portfolio Defense and Academy Graduation',
        explanation: 'Graduating from Level 3: Intermediate Robotics requires demonstrating technical mastery across four core domains: Mechanical CAD Assemblies, Electronic Circuit Architecture, Embedded Firmware State Machines, and Empirical Verification. In today’s final defense, students present their engineering notebooks, defend their technical design compromises before a panel of mentors, and receive their official certification, preparing them for Level 4: Advanced Robotics & Competition.',
        instructorNote: 'Congratulate students on completing all 10 Intermediate classes, progressing from basic circuits to integrated autonomous robots!'
      }
    ],
    visualizerId: 'test_log_sim',
    project: {
      name: 'Official Timed Robotics Mission Tournament',
      deliverableType: 'design_review',
      successEvidence: [
        'Autonomous mobile rover successfully completes official tournament course combining line tracking, node routing, and precision stopping.',
        'Official competition score sheet documenting Heat 1 and Heat 2 times, penalty deductions, and net score.',
        'Completed engineering post-mortem report detailing root-cause diagnosis of competition anomalies and future iteration plans.'
      ]
    },
    activity: {
      title: 'Compete in the Timed Robotics Mission Tournament',
      steps: [
        'Step 1: Perform pre-flight mechanical, electrical, and sensor calibration inspection.',
        'Step 2: Deploy robot on starting line for Heat 1; referee initiates official competition timer.',
        'Step 3: Navigate straightaway line sprint, execute 90-degree maze turn, and halt in finish box.',
        'Step 4: Enter 3-minute Pit Window: check battery voltage, clean sensor lenses, and tune speed parameters.',
        'Step 5: Deploy for Heat 2; aim to improve elapsed time while maintaining zero penalty deductions.',
        'Step 6: Submit official score sheet and deliver 2-minute engineering post-mortem defense to jury.'
      ],
      successCriteria: [
        'Rover completes at least one official tournament heat autonomously within the 60-second limit.',
        'Team executes structured 3-minute pit turnaround protocol between heats.',
        'Delivers structured engineering defense citing empirical telemetry data and design trade-offs.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Rover performs flawlessly during practice but derails at the very first corner during Heat 1.', 
        checks: [
          'Step 1: Did the team install a freshly charged battery pack right before the match?',
          'Step 2: Check if higher battery voltage (8.4V vs 7.4V practice) caused turn speed to overshoot.',
          'Step 3: Replace open-loop turn delays with closed-loop optical line catching.'
        ], 
        explanation: 'Fresh batteries provide higher terminal voltage, increasing motor RPM and kinetic momentum, carrying the vehicle past the corner before steering can react.' 
      },
      { 
        symptom: 'Robot stops dead in the middle of a straightaway as if it hit the finish line.', 
        checks: [
          'Step 1: Inspect the arena floor for dark tape seams, scuff marks, or overhead lighting shadows.',
          'Step 2: Re-run the ambient calibration routine and raise the black detection threshold by 60 counts.',
          'Step 3: Verify sensor bracket has not flexed downward closer to the floor.'
        ], 
        explanation: 'Floor scuffs or overhead shadows dropping both sensor voltages below the threshold falsely triggers the simultaneous intersection/finish state.' 
      },
      { 
        symptom: 'One drive wheel spins slower than the other during Heat 2, causing the robot to veer severely.', 
        checks: [
          'Step 1: Inspect the wheel hub and gearbox axle for wound carpet fibers or hair.',
          'Step 2: Check set screws on the wheel shaft coupling—is the hub slipping on the D-shaft?',
          'Step 3: Measure motor driver output voltage with DMM to verify both H-Bridge channels are delivering equal voltage.'
        ], 
        explanation: 'Mechanical debris wound around drive axles introduces severe asymmetric friction that overwhelms open-loop motor trim settings.' 
      },
      { 
        symptom: 'Microcontroller reboots the instant both motors accelerate out of the start box.', 
        checks: [
          'Step 1: Check battery pack terminal voltage under motor load—does it drop below 6.0V?',
          'Step 2: Verify common ground connection between motor driver and Arduino.',
          'Step 3: Add a 470µF electrolytic buffer capacitor across the motor driver VM power input.'
        ], 
        explanation: 'Motor inrush current combined with a high-resistance battery holder causes terminal voltage to collapse, triggering the ATmega328P Brownout Detector (BOD).' 
      }
    ],
    checksForUnderstanding: [
      'Why does a clean, steady run at 75% speed almost always defeat an aggressive 100% speed run in robotics competitions?',
      'How does battery discharge over successive tournament heats alter open-loop robot behavior?',
      'What are the 4 mandatory checkpoints in the RoboBEE 3-minute pit turnaround protocol?'
    ],
    exitTicket: [
      { 
        question: 'Identify one major electromechanical design trade-off your team navigated during today’s tournament challenge.', 
        rubricOrSampleReasoning: 'Student accurately identifies a concrete trade-off (e.g. balancing high cruise speed on straights against cornering stability, or sensor ground clearance vs optical contrast sensitivity).' 
      },
      { 
        question: 'Why is closed-loop sensory feedback essential for tournament consistency compared to fixed-time delay movements?', 
        rubricOrSampleReasoning: 'Battery voltage decays and motor friction varies across heats; closed-loop feedback reacts to real physical track features, ensuring identical performance regardless of battery charge.' 
      },
      { 
        question: 'How does an engineering post-mortem analysis improve team performance for future robotics competitions?', 
        rubricOrSampleReasoning: 'It systematically isolates root causes of failure using empirical data rather than speculation, allowing teams to redesign failure-prone subsystems before the next tournament.' 
      }
    ],
    differentiation: {
      support: ['Provide mentor-assisted pit debugging checklists for teams experiencing mechanical anomalies.'],
      extension: ['Calculate average speed (m/s) and energy consumption (mAh per lap) across both heats.'],
      offlineOption: ['Analyze tournament run video footage frame-by-frame to measure cross-track error and cornering trajectory.']
    },
    nextLessonId: 'adv-01',
    nextLessonTeaser: 'Welcome to Level 4: Advanced Robotics & Competition — Power budgets, non-blocking FreeRTOS schedulers, PID closed-loop control, quadrature odometry encoders, and autonomous Mini-Sumo combat!',
    sources: [{ title: 'RoboBEE Innovators Academy Tournament Standards & Review Guidelines', url: '' }],
    assetCredits: [{ asset: 'Mission Scorecard', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

// Now let's perform targeted replacements in content for int-06, int-07, int-08, int-09, int-10.
// Let's find each block using regex:
// int-06 starts at id: 'int-06' and ends before id: 'int-07'
// etc.

function replaceLesson(fileContent, lessonId, nextLessonId, newBlock) {
  const startRegex = new RegExp(`\\{\\s*id:\\s*['"]${lessonId}['"][\\s\\S]*?(?=\\{\\s*id:\\s*['"]${nextLessonId}['"])`);
  if (!startRegex.test(fileContent)) {
    throw new Error(`Could not find lesson block for ${lessonId} before ${nextLessonId}`);
  }
  return fileContent.replace(startRegex, newBlock.trim() + ',\n\n  ');
}

console.log('Replacing int-06...');
content = replaceLesson(content, 'int-06', 'int-07', int06);
console.log('Replacing int-07...');
content = replaceLesson(content, 'int-07', 'int-08', int07);
console.log('Replacing int-08...');
content = replaceLesson(content, 'int-08', 'int-09', int08);
console.log('Replacing int-09...');
content = replaceLesson(content, 'int-09', 'int-10', int09);
console.log('Replacing int-10...');
content = replaceLesson(content, 'int-10', 'adv-01', int10);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated int-06 through int-10 in curriculumData.ts!');
