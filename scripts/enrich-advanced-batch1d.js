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

const adv05 = `  {
    id: 'adv-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-motion-pid-control", "fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-comp-encoders-odometry", "fg-comp-tb6612fng"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 5,
    code: 'ADVANCED 05',
    title: 'Feedback Control & PID Tuning Concepts',
    promise: 'By the end of this masterclass, you will master the mathematical foundations of Proportional, Integral, and Derivative (PID) control, tune closed-loop error response to eliminate track oscillations, implement anti-windup clamping, and achieve smooth autonomous steering trajectory tracking.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03', 'Advanced 04'],
    outcomes: [
      'Contrast discontinuous Bang-Bang control with continuous closed-loop PID control.',
      'Formulate the mathematical role of Proportional (P), Integral (I), and Derivative (D) terms.',
      'Implement software anti-windup clamping to prevent integral accumulator saturation.',
      'Execute the systematic heuristic PID tuning protocol (Ziegler-Nichols) on hardware/simulation.',
      'Eliminate steady-state track drift and high-frequency steering oscillations in competitive tracking.'
    ],
    vocabulary: [
      { 
        term: 'PID Controller', 
        plainMeaning: 'A three-part mathematical brain that smoothly steers a robot toward its target without wobbling or overshooting.', 
        technicalMeaning: 'A control loop feedback mechanism that calculates an error value and applies a correction based on proportional, integral, and derivative terms.' 
      },
      { 
        term: 'Proportional Gain (Kp)', 
        plainMeaning: 'How hard the robot steers back toward the line based on how far away it is right now.', 
        technicalMeaning: 'The controller gain producing an output change directly proportional to the current instantaneous error magnitude ($P = K_p \\cdot e(t)$).' 
      },
      { 
        term: 'Derivative Gain (Kd)', 
        plainMeaning: 'An electronic shock absorber that slows down your steering as you approach the center line so you do not fly past.', 
        technicalMeaning: 'The controller gain producing an output proportional to the rate of change of error ($D = K_d \\cdot \\frac{de}{dt}$), providing predictive damping.' 
      },
      { 
        term: 'Integral Gain (Ki)', 
        plainMeaning: 'A term that remembers if the robot has been leaning slightly off-center for a long time and pushes harder to fix it.', 
        technicalMeaning: 'The controller gain producing an output proportional to the accumulated sum of error over time ($I = K_i \\int e(t) dt$), eliminating steady-state offset.' 
      },
      { 
        term: 'Integral Windup', 
        plainMeaning: 'When the integral memory gets super huge because the robot is stuck, making it overreact wildly when it moves again.', 
        technicalMeaning: 'A condition where a large change in setpoint or physical actuator saturation causes the integral accumulator to build up excessively.' 
      },
      { 
        term: 'Steady-State Error', 
        plainMeaning: 'A permanent tiny gap between where the robot is and where it is supposed to be that P-control alone cannot fix.', 
        technicalMeaning: 'The residual non-zero difference between the commanded setpoint and the actual process variable as time approaches infinity.' 
      }
    ],
    teacherPrep: [
      'Open interactive PID tuning simulation on classroom projector.',
      'Prepare 5-sensor reflectance array or dual optical encoder test rover with calibrated baseline.'
    ],
    verifiedMaterials: [
      'Autonomous Rover with TB6612FNG driver and 5-channel line array or dual wheel encoders',
      'Arduino Uno Rev3 DIP with USB programming cable',
      'PID tuning simulator workstation (or high-contrast curved line tracking arena)',
      'Digital stopwatch and telemetry plot loggers'
    ],
    safetyNotes: [
      'High-gain tuning warning: excessive Kp can cause violent mechanical oscillation that shakes loose motor mounts.',
      'Always tune in simulation or propped-wheel bench testing before full-throttle arena runs.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Hook', 
        minutes: 15, 
        teacherAction: 'Display side-by-side video: Bang-Bang follower (violent zigzagging at 0.5 m/s) vs tuned PID follower (knife-edge laser carving at 2.5 m/s).', 
        studentAction: 'Contrast step-function switching with continuous mathematical error control.' 
      },
      { 
        segment: '15–35m PID Math', 
        minutes: 20, 
        teacherAction: 'Derive the PID equation: $u(t) = K_p e(t) + K_i \\sum e(t)\\Delta t + K_d \\frac{\\Delta e}{\\Delta t}$. Explain the role of P, I, and D.', 
        studentAction: 'Write PID control loop function with integral anti-windup clamping in C++.' 
      },
      { 
        segment: '35–50m Tuning Protocol', 
        minutes: 15, 
        teacherAction: 'Guide systematic tuning sequence: 1. Set Ki=0, Kd=0. 2. Raise Kp until slight oscillation. 3. Raise Kd until damped. 4. Add small Ki for steady-state offset.', 
        studentAction: 'Execute heuristic tuning trials; log damping settling times and lateral error.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Evaluate student PID response curves and test stability on sharp chicane curves.', 
        studentAction: 'Submit tuned PID gain constants and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. The Fundamental Limits of Discontinuous Bang-Bang Control',
        explanation: 'In Intermediate 05, our 2-sensor line follower used Bang-Bang Control: if off-line, slam full power left; if on-line, slam full power right. This discrete on/off switching introduces three fatal flaws in high-speed racing: 1. Continuous high-frequency lateral oscillation (wiggling) that increases total distance traveled by up to 20%. 2. Severe tire scrubbing friction that bleeds kinetic momentum on straightaways. 3. Zero predictive awareness: when entering a curve at 2 m/s, inertia throws the vehicle off track before a binary sensor can react. PID control eliminates this by computing a continuous, smooth steering curve.',
        instructorNote: 'Plot Bang-Bang square-wave steering vs PID sinusoidal damping on the whiteboard.'
      },
      {
        title: '2. The Proportional Term (P): Responsive Immediate Correction',
        explanation: 'The foundation of PID is the Error Signal: $e(t) = \\text{Setpoint} - \\text{ProcessVariable}$. For a 5-sensor line array, error ranges from -2 (far left) to +2 (far right). The Proportional term multiplies this error by a constant gain: \\n$$P(t) = K_p \\times e(t)$$\\nIf error is small (e.g. 0.5mm off-center), the controller applies a gentle steering nudge. If error is large (e.g. 20mm off-center), it applies maximum differential yaw torque. However, P-control alone ALWAYS overshoots the centerline because momentum carries the vehicle past zero error before motor torque can reverse!',
        instructorNote: 'Show what happens with P-only control: the robot perpetually oscillates back and forth across the black line.'
      },
      {
        title: '3. The Derivative Term (D): Dampening and Overshoot Suppression',
        explanation: 'The Derivative term acts as an Electronic Shock Absorber: \\n$$D(t) = K_d \\times \\frac{e(t) - e(t-1)}{\\Delta t}$$\\nDerivative measures the Rate of Change of error. As a displaced robot rushes back toward the centerline, its error is rapidly decreasing (negative rate of change). Multiplying this negative rate by $K_d$ produces a COUNTER-STEERING force that brakes the turning rate right before the robot reaches the line! This suppresses overshoot and settles the robot into a dead-straight trajectory. Caution: $K_d$ amplifies high-frequency sensor noise, requiring clean sampling.',
        instructorNote: 'Demonstrate derivative damping: push a damped physical spring vs an un-damped spring.'
      },
      {
        title: '4. The Integral Term (I) & Steady-State Error Elimination',
        explanation: 'In the real physical world, DC motors are never perfectly matched; one motor might have 5% higher friction. Under P-control alone, the robot must maintain a tiny permanent error (Steady-State Offset) just to generate enough motor trim to drive straight. The Integral term fixes this by summing past error over time: \\n$$I(t) = K_i \\times \\sum [e(t) \\cdot \\Delta t]$$\\nEven if error is a microscopic 0.5mm, the accumulator continuously adds up until the integral term forces the motors to overcome mechanical drag and restore perfect zero error.',
        instructorNote: 'Explain the difference between P (present), I (past memory), and D (future prediction).'
      },
      {
        title: '5. Integral Anti-Windup Clamping & Error Deadbands',
        explanation: 'What happens if a robot derails or is held stationary by a referee while the line tracking algorithm runs? The error stays non-zero, and the integral sum accumulates to astronomical numbers! When released, the saturated integral dumps maximum power to one motor, spinning the robot uncontrollably for seconds until the accumulator unwinds. Production firmware implements Anti-Windup Clamping: \\n\`\`\`cpp\\nintegralAccumulator = constrain(integralAccumulator + error, -MAX_I, MAX_I);\\n\`\`\`\\nCapping the integral term prevents saturation while preserving its steady-state benefits.',
        instructorNote: 'Demonstrate windup: hold a robot wheels off track for 5 seconds without anti-windup—watch it spin crazily when replaced.'
      },
      {
        title: '6. The Empirical Heuristic PID Tuning Protocol (Ziegler-Nichols)',
        explanation: 'Never guess all three gains at once! Professional control engineers utilize the Heuristic Tuning Sequence: 1. Set $K_i = 0$ and $K_d = 0$. 2. Slowly increase $K_p$ from zero until the robot follows curves with continuous, steady oscillation (Critical Gain $K_u$). 3. Increase $K_d$ gradually until the oscillations are completely damped out, producing a smooth straight line. 4. If the robot drifts slightly to one side of the line on straightaways, introduce a tiny $K_i$ (e.g. 0.001) with anti-windup to eliminate steady-state offset.',
        instructorNote: 'Walk students through the 4-step tuning roadmap before letting them touch the gain sliders.'
      }
    ],
    visualizerId: 'pid_tuning_sim',
    project: {
      name: 'High-Precision Closed-Loop PID Controller',
      deliverableType: 'simulation',
      successEvidence: [
        'Documented PID tuning engineering log recording Kp, Ki, Kd coefficients across 4 progressive tuning rounds.',
        'Demonstrated closed-loop trajectory tracking exhibiting zero persistent steady-state error and critically damped settling.',
        'Firmware incorporates software anti-windup clamping and discrete delta-time derivative filtering.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Autonomous Line Following Rover', '5-Channel TCRT5000 Reflectance Array', 'TB6612FNG Dual Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: 'Mobile Rover Chassis', exactVariant: '2WD differential drive with low-friction front caster', quantity: 1 },
        { name: 'Multi-Sensor Optical Array', exactVariant: '5-channel TCRT5000 analog/digital line reflectance sensor board', quantity: 1 },
        { name: 'TB6612FNG Motor Driver', exactVariant: 'Dual H-Bridge breakout board with shared common ground', quantity: 1 },
        { name: 'Arduino Uno Rev3', exactVariant: 'Official DIP edition with hardware Timer1 PWM', quantity: 1 },
        { name: 'Battery Power Supply', exactVariant: '2S 7.4V Li-Ion battery pack with master power switch', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'Sensors on Pins A0-A4. TB6612 on Pins 3, 5, 6, 7, 8, 9, 10. 7.4V Battery to TB6612 VM. 5V logic to Arduino 5V. Star Ground.',
      wireTable: [
        { from: '5-Channel Sensor S1-S5', to: 'Arduino Analog Pins A0, A1, A2, A3, A4', wireOrPolarityNote: 'Multi-channel optical reflectance inputs' },
        { from: 'Sensor VCC & GND', to: 'Arduino 5V & Star GND', wireOrPolarityNote: 'Sensor logic power' },
        { from: 'TB6612 Driver Pins', to: 'Arduino Pins 3, 5, 6, 7, 8, 9, 10', wireOrPolarityNote: 'Standard TB6612 dual motor drive pins' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount 5-channel line array 8mm above track surface; verify all 5 sensor LEDs respond to black tape.',
        '2. Connect sensor outputs S1 through S5 to Arduino Pins A0 through A4.',
        '3. Upload PID tracking firmware with initial conservative gains (Kp=15, Ki=0, Kd=0).',
        '4. Elevate wheels off desk and verify differential motor speed responses when sliding tape under sensor array.',
        '5. Deploy rover on competition track; systematically tune Kp and Kd until smooth, high-speed tracking is achieved.'
      ],
      powerAndSafetyChecks: [
        'Always start tuning with low base speed (PWM 120) before increasing to full throttle.',
        'Ensure the robot stays inside arena boundary walls during aggressive high-gain tuning runs.'
      ],
      testCases: [
        { action: 'Displace rover 30mm off line and release', expectedResult: 'Rover steers crisply back to center with <= 1 overshoot cycle.' },
        { action: 'Navigate high-speed straightaway', expectedResult: 'Rover tracks centerline with zero visible lateral wiggle or oscillation.' },
        { action: 'Navigate sharp 90-degree bend', expectedResult: 'Derivative term applies instantaneous counter-steering, holding line cleanly.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 05
// Precision Closed-Loop Proportional-Integral-Derivative (PID) Controller
// Application: High-Speed Autonomous Optical Trajectory Steering with Anti-Windup

#include <Arduino.h>

// Motor Driver Pinout (TB6612FNG)
const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

// 5-Channel Optical Line Array Pins (Analog A0 - A4)
const int SENSOR_PINS[5] = { A0, A1, A2, A3, A4 };
const int SENSOR_WEIGHTS[5] = { -200, -100, 0, 100, 200 }; // Weighted lateral positions

// PID CONTROLLER GAIN CONSTANTS
// Step 1: Set Ki=0, Kd=0. Tune Kp until slight oscillation.
// Step 2: Increase Kd to dampen oscillation.
// Step 3: Add tiny Ki with anti-windup for steady-state drift.
float Kp = 0.45;   // Proportional Gain
float Ki = 0.002;  // Integral Gain
float Kd = 2.80;   // Derivative Gain

// PID State Variables
float lastError = 0;
float integralAccumulator = 0;
const float MAX_INTEGRAL = 250.0; // Anti-Windup Clamp Limit

const int SPEED_BASE = 140; // Base cruise throttle (0-255)
unsigned long lastPIDTime = 0;

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE PRECISION CLOSED-LOOP PID     "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Controller Ready."));
  lastPIDTime = millis();
}

void loop() {
  unsigned long now = millis();
  float dt = (now - lastPIDTime) / 1000.0; // Elapsed time in seconds

  // Execute PID control loop at steady 100 Hz (every 10ms)
  if (dt >= 0.010) {
    lastPIDTime = now;

    // 1. MEASURE PROCESS VARIABLE: Calculate weighted position error
    float currentError = calculateLineError();

    // 2. PROPORTIONAL TERM: Immediate responsive force
    float P = Kp * currentError;

    // 3. INTEGRAL TERM with Software Anti-Windup Clamping
    integralAccumulator += currentError * dt;
    integralAccumulator = constrain(integralAccumulator, -MAX_INTEGRAL, MAX_INTEGRAL);
    float I = Ki * integralAccumulator;

    // 4. DERIVATIVE TERM: Damping predictive brake
    float derivative = (currentError - lastError) / dt;
    float D = Kd * derivative;
    lastError = currentError;

    // 5. TOTAL PID STEERING OUTPUT
    float steeringAdjustment = P + I + D;

    // 6. ACTUATE MOTORS: Differential speed assignment
    int leftPWM  = constrain(SPEED_BASE + steeringAdjustment, -255, 255);
    int rightPWM = constrain(SPEED_BASE - steeringAdjustment, -255, 255);

    setMotors(leftPWM, rightPWM);
  }
}

float calculateLineError() {
  long weightedSum = 0;
  long totalBrightness = 0;

  for (int i = 0; i < 5; i++) {
    int val = 1023 - analogRead(SENSOR_PINS[i]); // Invert: black tape yields high value
    weightedSum += (long)val * SENSOR_WEIGHTS[i];
    totalBrightness += val;
  }

  // Avoid division by zero if all sensors see white floor
  if (totalBrightness < 100) {
    return (lastError > 0) ? 200.0 : -200.0; // Last-known-side recovery
  }

  return (float)weightedSum / totalBrightness; // Center position (-200 to +200)
}

void setMotors(int l, int r) {
  digitalWrite(PIN_AIN1, l >= 0 ? HIGH : LOW);
  digitalWrite(PIN_AIN2, l >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMA, abs(l));

  digitalWrite(PIN_BIN1, r >= 0 ? HIGH : LOW);
  digitalWrite(PIN_BIN2, r >= 0 ? LOW : HIGH);
  analogWrite(PIN_PWMB, abs(r));
}
\`,
      pinMap: {
        'Pins A0-A4': '5-Channel TCRT5000 optical reflectance sensor array',
        'Pins 3, 5-10': 'TB6612FNG dual motor speed and direction control pins'
      },
      setupAndUpload: [
        '1. Connect 5-sensor array to Analog Pins A0-A4 and motor driver to Pins 3-10.',
        '2. Upload firmware via Arduino IDE.',
        '3. Open Serial Plotter at 9600 baud to visualize line error vs steering response.',
        '4. Place rover on race track; observe smooth, continuous trajectory correction.'
      ],
      explanations: [
        'calculateLineError(): Weighted centroid algorithm producing continuous analog error (-200 to +200).',
        'Anti-Windup Clamping (constrain): Prevents integral accumulator from saturating motor PWM limits.',
        'dt calculation: Real elapsed delta time ensures derivative and integral terms remain mathematically accurate.'
      ],
      expectedResult: 'Rover tracks racing line smoothly at high speed with zero zigzagging wiggles, gliding around corners like on rails.',
      caveats: [
        'If Kd is set too high, the robot will vibrate or shudder at high frequency due to sensor noise amplification.',
        'If Kp is set too low, the robot will not generate enough turning torque to make sharp 90-degree corners.'
      ],
      tweakTip: 'Mission Challenge: Increase SPEED_BASE from 140 up to 180 and observe how increasing Kd stabilizes high-speed straightaways!'
    },
    activity: {
      title: 'Tune and Validate the Closed-Loop PID Controller',
      steps: [
        'Step 1: Mount 5-channel line array 8mm above floor; calibrate sensor thresholds.',
        'Step 2: Upload sketch with Ki=0 and Kd=0; set Kp=0.2. Observe sluggish response.',
        'Step 3: Gradually increase Kp until the rover tracks the line with persistent, steady oscillation.',
        'Step 4: Introduce Kd in increments of 0.5 until oscillations disappear completely.',
        'Step 5: If the robot rides 3mm off-center on straightaways, introduce a small Ki (0.002) with anti-windup.',
        'Step 6: Time 3 consecutive laps of the track; log lap times and verify zero track departures.'
      ],
      successCriteria: [
        'Documented Ziegler-Nichols tuning progression with empirical gain values.',
        'Rover completes full competition course with zero Bang-Bang oscillations.',
        'Anti-windup clamping verified to prevent post-stall steering saturation.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Robot vibrates violently at high frequency with an audible buzzing shudder.', 
        checks: [
          'Step 1: Check Kd gain constant—is Kd set too high?',
          'Step 2: Reduce Kd by 50% and observe if vibration ceases.',
          'Step 3: Add software low-pass filter on sensor readings to attenuate optical noise.'
        ], 
        explanation: 'The derivative term calculates delta error over tiny delta time; high-frequency optical sensor noise is amplified into violent steering oscillations.' 
      },
      { 
        symptom: 'Robot weaves back and forth in wide, lazy S-curves across the straightaway.', 
        checks: [
          'Step 1: Check Kp gain—is it set too high without sufficient Kd damping?',
          'Step 2: Increase Kd to provide more counter-steering brake as the robot crosses center.',
          'Step 3: Reduce Kp slightly to soften proportional steering aggressiveness.'
        ], 
        explanation: 'Under-damped system response: proportional correction carries too much momentum across the centerline before the controller can reverse torque.' 
      },
      { 
        symptom: 'Robot spins crazily in circles after being lifted off the track for a few seconds.', 
        checks: [
          'Step 1: Check integral anti-windup clamping in code.',
          'Step 2: Ensure integralAccumulator is constrained to +/- MAX_INTEGRAL.',
          'Step 3: Reset integralAccumulator to 0 whenever the line is completely lost.'
        ], 
        explanation: 'Integral Windup: while lifted, non-zero error accumulated unchecked in the integral sum, saturating motor outputs.' 
      },
      { 
        symptom: 'Robot flies completely off track at the entrance to sharp 90-degree corners.', 
        checks: [
          'Step 1: Increase Kp to deliver more aggressive turning torque at maximum error.',
          'Step 2: Reduce SPEED_BASE to lower forward inertia entering the turn.',
          'Step 3: Check that SENSOR_WEIGHTS properly reflect the wide outer sensor positions.'
        ], 
        explanation: 'Centripetal acceleration limit: forward kinetic momentum exceeds tire lateral traction before the PID controller can rotate the heading.' 
      }
    ],
    checksForUnderstanding: [
      'What specific operational problem does the Derivative (D) term solve in a line-following robot?',
      'Why does Integral Windup occur, and how does software clamping prevent it?',
      'Explain the 4-step heuristic sequence for tuning PID gains from scratch.'
    ],
    exitTicket: [
      { 
        question: 'What mathematical calculation is performed by the Proportional (P) term in a closed-loop controller?', 
        rubricOrSampleReasoning: 'It calculates an output correction directly proportional to the current instantaneous error: Output = Kp * Error.' 
      },
      { 
        question: 'Why does adding a Derivative (D) term act like an "electronic shock absorber" in trajectory steering?', 
        rubricOrSampleReasoning: 'It measures the rate of change of error; as the robot rapidly approaches the centerline, the negative rate of change produces counter-steering that prevents overshooting.' 
      },
      { 
        question: 'What is the purpose of software Anti-Windup Clamping on the Integral accumulator?', 
        rubricOrSampleReasoning: 'It limits the maximum accumulated historical error to prevent the integral term from saturating actuator outputs when the robot is stalled or off-track.' 
      }
    ],
    differentiation: {
      support: ['Provide interactive visual PID tuning software where students adjust sliders and observe step-response curves.'],
      extension: ['Implement adaptive PID gain scheduling where Kp and Kd dynamically scale based on vehicle velocity.'],
      offlineOption: ['Calculate manual PID outputs by hand across 5 sequential time steps on graph paper.']
    },
    nextLessonId: 'adv-06',
    nextLessonTeaser: 'Advanced 06: Sensor Fusion & IMU Orientation (MPU-6050) — Interface 6-DOF accelerometers and gyroscopes over I2C and fuse data with a Complementary Filter!',
    sources: [{ title: 'Modern Control Engineering: PID Feedback Control Systems', url: 'https://mit.edu' }],
    assetCredits: [{ asset: 'PID Response Curve Visualizer', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const adv06 = `  {
    id: 'adv-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comm-i2c-spi-uart"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-foundations-open-closed-loop"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 6,
    code: 'ADVANCED 06',
    title: 'Sensor Fusion & IMU Orientation (MPU-6050)',
    promise: 'By the end of this masterclass, you will interface an MPU-6050 6-DOF Inertial Measurement Unit over the I2C bus at 400 kHz, calculate angular velocity integration, measure gravity tilt angles, and combine accelerometer and gyroscope data using a Complementary Filter to track robot heading without drift.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03', 'Advanced 05'],
    outcomes: [
      'Interface an MPU-6050 6-DOF IMU over the hardware I2C serial bus (Pins A4 and A5) at 400 kHz.',
      'Explain the physical operation of MEMS vibrating ring gyroscopes and capacitive accelerometers.',
      'Implement startup zero-rate gyroscope bias calibration to suppress integration drift.',
      'Derive pitch and roll tilt angles from the gravitational acceleration vector using trigonometry.',
      'Construct a high-performance Complementary Filter combining low-frequency accelerometer stability with high-frequency gyroscope agility.'
    ],
    vocabulary: [
      { 
        term: 'Inertial Measurement Unit (IMU)', 
        plainMeaning: 'An electronic inner ear chip that feels tilt, rotation, and motion in 3D space.', 
        technicalMeaning: 'An integrated multi-sensor micro-electro-mechanical system (MEMS) combining 3-axis accelerometers and 3-axis rate gyroscopes.' 
      },
      { 
        term: 'I2C Serial Bus Protocol', 
        plainMeaning: 'A 2-wire serial party line (SDA and SCL) where multiple chips talk to Arduino using digital address numbers.', 
        technicalMeaning: 'Inter-Integrated Circuit: a synchronous, multi-master/multi-slave, packet-switched, single-ended serial communication bus.' 
      },
      { 
        term: 'Gyroscope Integration Drift', 
        plainMeaning: 'How tiny errors in rotation measurements slowly build up into a huge false turn angle over time.', 
        technicalMeaning: 'The monotonic accumulation of position error over time caused by numerical integration of non-zero sensor bias and white noise.' 
      },
      { 
        term: 'Zero-Rate Offset Bias', 
        plainMeaning: 'The fake reading a sensor gives when sitting completely still on a table that you must subtract out.', 
        technicalMeaning: 'The DC voltage offset present at the output of a rate gyroscope under zero angular velocity conditions.' 
      },
      { 
        term: 'Complementary Filter', 
        plainMeaning: 'A math blending trick: use the gyro for fast turns and the accelerometer to keep the horizon level.', 
        technicalMeaning: 'A sensor fusion algorithm combining a low-pass filter on accelerometer tilt with a high-pass filter on integrated gyroscope rate.' 
      },
      { 
        term: 'MEMS Micro-Machining', 
        plainMeaning: 'Microscopic moving springs and silicon masses etched directly inside a computer chip.', 
        technicalMeaning: 'Micro-Electro-Mechanical Systems: microscopic mechanical structures fabricated onto silicon semiconductor wafers.' 
      }
    ],
    teacherPrep: [
      'Inspect MPU-6050 breakout boards; verify AD0 pin is tied to GND (establishing 0x68 I2C address).',
      'Prepare demonstration comparing raw integrated gyro drift (drifting 40° in 1 minute) vs Complementary Filter stability.'
    ],
    verifiedMaterials: [
      'InvenSense MPU-6050 6-Axis Accelerometer and Gyroscope Module (GY-521)',
      'Arduino Uno Rev3 DIP with USB cable',
      'Breadboard and 22AWG solid-core jumper wires',
      'Protractor or 3D-printed 90-degree index block for angle verification'
    ],
    safetyNotes: [
      'MEMS sensor fragility: never strike or drop MPU-6050 sensor modules onto hard concrete floors.',
      'Always keep the sensor module completely stationary on the bench during the 3-second startup calibration phase.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Hook', 
        minutes: 15, 
        teacherAction: 'Display aerospace inertial guidance systems (Saturn V rocket, commercial jetliners, Boston Dynamics Atlas) navigating without GPS.', 
        studentAction: 'Analyze why satellites and submarines require inertial measurement units for 3D spatial awareness.' 
      },
      { 
        segment: '15–35m I2C & Gyro Math', 
        minutes: 20, 
        teacherAction: 'Teach I2C bus wiring (A4=SDA, A5=SCL). Explain angular rate integration: $\\theta(t) = \\theta_0 + \\sum \\omega_z \\Delta t$. Teach zero-rate offset calibration.', 
        studentAction: 'Wire MPU-6050 module; execute startup bias calibration sketch (sampling 500 points).' 
      },
      { 
        segment: '35–50m Sensor Fusion', 
        minutes: 15, 
        teacherAction: 'Explain the Complementary Filter: $\\text{Angle} = 0.96(\\text{Angle} + \\omega \\Delta t) + 0.04(\\text{Angle}_{acc})$. Supervise 90° physical rotation tests.', 
        studentAction: 'Code Complementary Filter; rotate sensor exactly 90° on bench index block; verify heading accuracy within ±2.0°.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Evaluate student heading drift curves over 60 seconds of stationary rest.', 
        studentAction: 'Log 60-second drift data and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Inertial Navigation Physics & 6 Degrees of Freedom (6-DOF)',
        explanation: 'In 3D space, an unconstrained robot possesses 6 Degrees of Freedom: 3 translational axes ($X$ surge, $Y$ sway, $Z$ heave) and 3 rotational axes (Roll around $X$, Pitch around $Y$, Yaw heading around $Z$). The MPU-6050 integrates two distinct MEMS sensors: 1. Tri-Axial Accelerometer: Measures linear acceleration in g’s ($1.0\\text{g} = 9.81\\text{ m/s}^2$). When resting on a table, it feels the constant upward normal force of Earth’s gravity pointing along the Z-axis. 2. Tri-Axial Rate Gyroscope: Measures angular rotational velocity in degrees per second (°/s).',
        instructorNote: 'Pass around an MPU-6050 module: show students the microscopic silicon die inside the 4x4mm QFN package.'
      },
      {
        title: '2. The I2C Serial Bus Protocol (SDA & SCL Architecture)',
        explanation: 'Reading multiple sensors usually requires dozens of wires. The Inter-Integrated Circuit (I2C) protocol reduces this to two wires: SDA (Serial Data) and SCL (Serial Clock). Connected to Arduino Analog Pins A4 (SDA) and A5 (SCL), I2C uses open-drain lines with pullup resistors. The Arduino acts as the Bus Master, addressing target slaves using 7-bit addresses. The MPU-6050 listens at address \`0x68\` (or \`0x69\` if AD0 pin is pulled HIGH). By default, Arduino I2C runs at 100 kHz, but calling \`Wire.setClock(400000)\` engages 400 kHz Fast Mode, slashing sensor read latency.',
        instructorNote: 'Draw the I2C open-drain bus with pullup resistors on the board: explain how multiple chips share the exact same two wires.'
      },
      {
        title: '3. Gyroscope Numerical Integration & The Inevitable Drift Problem',
        explanation: 'A gyroscope measures angular velocity ($\\\\omega$ in °/s), NOT angle! To find current heading angle ($\\\\theta$), the processor must perform Numerical Integration: \\n$$\\\\theta(t) = \\\\theta(t-1) + (\\\\omega_z \\\\times \\\\Delta t)$$\\nHowever, real MEMS gyroscopes possess a microscopic DC offset (e.g. $+0.5^\\\\circ/\\\\text{s}$) due to manufacturing stress. Even when the sensor sits completely stationary, integrating this error means that after 60 seconds, the robot believes it has turned $0.5 \\\\times 60 = 30^\\\\circ$! Gyroscope integration alone is inherently unstable over time.',
        instructorNote: 'Demonstrate raw gyro integration on the projector: watch the angle counter tick upward while the board sits frozen on the table.'
      },
      {
        title: '4. Zero-Rate Gyro Bias Calibration at System Startup',
        explanation: 'To eliminate the vast majority of integration drift, the robot must calibrate its zero-rate bias before entering a match. During \`setup()\`, while the robot sits perfectly still on the arena starting line, the firmware samples 500 consecutive gyroscope readings over 1.5 seconds, computing the arithmetic mean: \\n$$\\\\text{Bias}_z = \\\\frac{1}{500} \\\\sum_{i=1}^{500} \\\\omega_{z, i}$$\\nThis static bias constant is saved in memory and subtracted from every subsequent measurement: $\\\\omega_{corrected} = \\\\omega_{raw} - \\\\text{Bias}_z$. Startup calibration slashes drift by over 95%!',
        instructorNote: 'Emphasize the golden rule of IMUs: NEVER bump or move a robot while its startup calibration routine is running!'
      },
      {
        title: '5. Accelerometer Tilt Calculation via Trigonometry',
        explanation: 'While gyroscopes drift over time, Earth’s gravity vector is eternally constant. When an accelerometer is tilted, gravity ($1.0\\\\text{g}$) projects across the $X$, $Y$, and $Z$ axes. Using basic trigonometry, we calculate absolute Pitch and Roll angles: \\n$$\\\\text{Pitch} = \\\\arctan2(a_x, \\\\sqrt{a_y^2 + a_z^2}) \\\\times \\\\frac{180}{\\\\pi}$$\\n$$\\\\text{Roll} = \\\\arctan2(a_y, \\\\sqrt{a_x^2 + a_z^2}) \\\\times \\\\frac{180}{\\\\pi}$$\\nHowever, in a moving robot, motor vibrations and chassis acceleration contaminate these readings with extreme noise, making raw accelerometer angles erratic during dynamic driving.',
        instructorNote: 'Show the duality: gyroscopes are clean in the short term but drift long term; accelerometers are noisy short term but stable long term!'
      },
      {
        title: '6. The Complementary Filter: High-Pass + Low-Pass Sensor Fusion',
        explanation: 'Sensor Fusion combines the strengths of both sensors while cancelling their flaws. A Complementary Filter blends them using two complementary weighting factors: \\n$$\\\\text{Angle}(t) = \\\\alpha \\\\cdot [\\\\text{Angle}(t-1) + \\\\omega \\\\cdot \\\\Delta t] + (1 - \\\\alpha) \\\\cdot \\\\text{Angle}_{acc}$$\\nSetting $\\\\alpha = 0.96$ assigns 96% of the output to high-frequency gyroscope integration (providing smooth, responsive, instantaneous reaction) while allowing 4% of low-frequency accelerometer gravity data to continuously correct long-term drift. The result is a rock-solid, drift-free orientation angle with zero lag!',
        instructorNote: 'Plot the frequency response on the board: high-pass filter on gyro + low-pass filter on accelerometer.'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Calibrated 6-DOF IMU Heading & Orientation System',
      deliverableType: 'dataset',
      successEvidence: [
        'Interfaced MPU-6050 over I2C at 400 kHz with startup zero-rate bias calibration across 500 samples.',
        'Implemented Complementary Filter blending integrated gyro rate with accelerometer gravity vector.',
        'Demonstrated physical 90-degree and 180-degree yaw rotation tracking verified within ±2.0 degrees of accuracy.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['InvenSense MPU-6050 Breakout Module (GY-521)', 'Arduino Uno Rev3 DIP', 'Solderless Breadboard', 'Connecting Jumpers'],
      componentList: [
        { name: 'IMU Sensor Module', exactVariant: 'GY-521 breakout with MPU-6050 6-axis chip and onboard 3.3V LDO', quantity: 1 },
        { name: 'Microcontroller Board', exactVariant: 'Arduino Uno Rev3 DIP with I2C pins on A4 and A5', quantity: 1 },
        { name: 'Jumper Wires', exactVariant: '22AWG solid-core hookup wire (Red, Black, Yellow, Blue)', quantity: 4 },
        { name: 'Precision 90-Degree Block', exactVariant: 'Machined aluminum or 3D printed 90-degree alignment guide', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/imu_orientation_wiring.svg',
      schematic: 'MPU-6050 VCC ➔ Arduino 5V | GND ➔ Arduino GND | SCL ➔ Arduino Pin A5 | SDA ➔ Arduino Pin A4 | AD0 ➔ GND (0x68).',
      wireTable: [
        { from: 'MPU-6050 VCC Pin', to: 'Arduino 5V Pin', wireOrPolarityNote: 'Module has onboard 3.3V regulator' },
        { from: 'MPU-6050 GND Pin', to: 'Arduino GND Pin', wireOrPolarityNote: 'Common ground reference' },
        { from: 'MPU-6050 SCL Pin', to: 'Arduino Analog Pin A5 (SCL)', wireOrPolarityNote: 'I2C Serial Clock bus' },
        { from: 'MPU-6050 SDA Pin', to: 'Arduino Analog Pin A4 (SDA)', wireOrPolarityNote: 'I2C Serial Data bus' },
        { from: 'MPU-6050 AD0 Pin', to: 'Arduino GND Pin', wireOrPolarityNote: 'Sets 7-bit I2C device address to 0x68' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Insert MPU-6050 breakout module into mini breadboard.',
        '2. Connect VCC to 5V, GND to GND, SCL to Pin A5, and SDA to Pin A4 according to wire table.',
        '3. Tie AD0 pin to GND with a small jumper wire to lock I2C address to 0x68.',
        '4. Connect USB cable; upload the calibrated IMU orientation sketch.',
        '5. Keep sensor COMPLETELY STILL on table while startup calibration runs for 3 seconds.',
        '6. Rotate sensor against 90-degree index block; observe real-time heading tracking in Serial Monitor.'
      ],
      powerAndSafetyChecks: [
        'Never twist or yank I2C jumper wires during operation; broken connection causes I2C bus lockup.',
        'Ensure AD0 is connected to GND or 3.3V; leaving AD0 floating causes address instability.'
      ],
      testCases: [
        { action: 'Boot up while resting stationary on table', expectedResult: 'Calibrates 500 samples; logs drift < 0.1 deg/sec.' },
        { action: 'Rotate 90 degrees clockwise against block', expectedResult: 'Heading reports +90.0 deg ± 2.0 deg in Serial Monitor.' },
        { action: 'Leave stationary for 60 seconds', expectedResult: 'Total drift is < 1.5 degrees over 1 minute.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 06
// Calibrated MPU-6050 6-DOF IMU Heading & Orientation System
// Features: 400kHz I2C Bus, Startup Zero-Rate Bias Calibration, Complementary Filter

#include <Wire.h>

const int MPU_ADDR = 0x68; // Standard 7-bit I2C address (AD0 tied to GND)

// Calibration Offset Biases
float gyroBiasZ = 0;
float accelBiasX = 0, accelBiasY = 0;

// Filtered Orientation Angles (Degrees)
float headingYaw = 0;
float pitchAngle = 0;
float rollAngle  = 0;

unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  Wire.setClock(400000); // 400 kHz Fast-Mode I2C Bus

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE MPU-6050 INERTIAL NAVIGATION "));
  Serial.println(F("========================================"));

  // Wake up MPU-6050 (clears SLEEP register 0x6B)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); // PWR_MGMT_1 register
  Wire.write(0x00); // Set to zero (wakes up internal oscillator)
  Wire.endTransmission(true);

  delay(100);

  // STARTUP ZERO-RATE GYRO CALIBRATION
  Serial.println(F("[INIT] CALIBRATING GYRO BIAS... KEEP SENSOR STILL!"));
  long sumZ = 0;
  const int SAMPLES = 500;

  for (int i = 0; i < SAMPLES; i++) {
    int16_t gz = readRawGyroZ();
    sumZ += gz;
    delay(3);
  }
  gyroBiasZ = (float)sumZ / SAMPLES;

  Serial.print(F("[READY] Gyro Z Zero-Bias Offset: "));
  Serial.print(gyroBiasZ);
  Serial.println(F(" raw units."));
  Serial.println(F("Tracking heading online..."));

  lastSampleTime = micros();
}

void loop() {
  unsigned long now = micros();
  float dt = (now - lastSampleTime) / 1000000.0; // Elapsed time in seconds

  // Sample at steady 100 Hz (every 10,000 microseconds)
  if (dt >= 0.010) {
    lastSampleTime = now;

    // Read 6-axis raw data from MPU-6050
    int16_t rawAX, rawAY, rawAZ, rawGX, rawGY, rawGZ;
    readMPU6050Data(rawAX, rawAY, rawAZ, rawGX, rawGY, rawGZ);

    // Convert raw gyroscope to deg/sec (FS_SEL=0: 131.0 LSB / (deg/s))
    float gyroRateZ = ((float)rawGZ - gyroBiasZ) / 131.0;

    // 1. NUMERICAL INTEGRATION: Heading Yaw Angle
    headingYaw += gyroRateZ * dt;

    // 2. ACCELEROMETER TILT ANGLES (Trigonometric Gravity Projection)
    float accPitch = atan2((float)rawAX, sqrt((long)rawAY * rawAY + (long)rawAZ * rawAZ)) * 57.2958;
    float accRoll  = atan2((float)rawAY, sqrt((long)rawAX * rawAX + (long)rawAZ * rawAZ)) * 57.2958;

    // 3. COMPLEMENTARY FILTER (Sensor Fusion for Pitch & Roll)
    pitchAngle = 0.96 * (pitchAngle + (rawGY / 131.0) * dt) + 0.04 * accPitch;
    rollAngle  = 0.96 * (rollAngle  + (rawGX / 131.0) * dt) + 0.04 * accRoll;

    // Stream telemetry every 200ms (5 Hz)
    static int printCounter = 0;
    if (++printCounter >= 20) {
      printCounter = 0;
      Serial.print(F("🧭 [IMU] Heading (Yaw): "));
      Serial.print(headingYaw, 1);
      Serial.print(F("° | Pitch: "));
      Serial.print(pitchAngle, 1);
      Serial.print(F("° | Roll: "));
      Serial.print(rollAngle, 1);
      Serial.println(F("°"));
    }
  }
}

int16_t readRawGyroZ() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x47); // GYRO_ZOUT_H register
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 2, true);
  return (Wire.read() << 8) | Wire.read();
}

void readMPU6050Data(int16_t &ax, int16_t &ay, int16_t &az, int16_t &gx, int16_t &gy, int16_t &gz) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B); // Starting at ACCEL_XOUT_H register
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true); // Request 14 sequential data bytes

  ax = (Wire.read() << 8) | Wire.read();
  ay = (Wire.read() << 8) | Wire.read();
  az = (Wire.read() << 8) | Wire.read();
  Wire.read(); Wire.read(); // Skip temperature bytes (0x41, 0x42)
  gx = (Wire.read() << 8) | Wire.read();
  gy = (Wire.read() << 8) | Wire.read();
  gz = (Wire.read() << 8) | Wire.read();
}
\`,
      pinMap: {
        'Pin A4 (SDA)': 'I2C Serial Data bus connected to MPU-6050 SDA',
        'Pin A5 (SCL)': 'I2C Serial Clock bus connected to MPU-6050 SCL',
        '5V & GND': 'Regulated logic power bus'
      },
      setupAndUpload: [
        '1. Wire MPU-6050 to Arduino Pins A4 and A5; tie AD0 to GND.',
        '2. Place sensor completely stationary on workbench.',
        '3. Upload sketch via Arduino IDE; open Serial Monitor at 9600 baud.',
        '4. Observe startup calibration take 500 samples.',
        '5. Rotate sensor 90 degrees clockwise; verify heading updates to +90° ± 2°.'
      ],
      explanations: [
        '0x6B register write: Wakes up MPU-6050 internal oscillator from default sleep state.',
        'FS_SEL=0 conversion factor (131.0 LSB/deg/s): Converts 16-bit signed integer into degrees per second.',
        'Complementary Filter (0.96 / 0.04): Fuses gyroscope speed with accelerometer gravity stability.'
      ],
      expectedResult: 'Serial Monitor displays accurate, drift-free Heading, Pitch, and Roll angles tracking physical rotations with < 2° error.',
      caveats: [
        'Never move the sensor during the 3-second startup calibration phase; moving it causes huge permanent offset bias.',
        'If I2C bus locks up, add two external 4.7kΩ pullup resistors between SDA/SCL and 5V.'
      ],
      tweakTip: 'Integrate headingYaw into your differential motor controller: use heading error (targetAngle - headingYaw) to drive in a dead-straight line!'
    },
    activity: {
      title: 'Calibrate and Validate 6-DOF Inertial Orientation',
      steps: [
        'Step 1: Wire MPU-6050 to Arduino I2C bus (A4/A5); lock AD0 to GND.',
        'Step 2: Place sensor flush against a straight index guide on the workbench.',
        'Step 3: Power up Arduino; confirm startup zero-rate calibration runs without motion.',
        'Step 4: Rotate sensor exactly 90 degrees against the guide; record measured yaw heading.',
        'Step 5: Rotate sensor back to 0 degrees; verify heading returns to 0.0° ± 2.0°.',
        'Step 6: Leave stationary for 60 seconds; measure and record total integration drift.'
      ],
      successCriteria: [
        'I2C communication established at 400 kHz without bus timeouts.',
        'Startup zero-bias calibration slashes stationary drift to < 1.5° per minute.',
        'Measured 90-degree physical rotation verified within ±2.0 degrees of accuracy.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Sketch freezes at startup: "Wire.requestFrom()" never returns.', 
        checks: [
          'Step 1: Verify I2C wiring—are SDA and SCL swapped (Pin A4 vs Pin A5)?',
          'Step 2: Check AD0 pin connection—is it floating? Connect AD0 securely to GND.',
          'Step 3: Run an I2C Scanner sketch to verify device responds at address 0x68.'
        ], 
        explanation: 'If I2C wires are reversed or missing, the hardware I2C state machine hangs waiting for a slave acknowledge bit (ACK).' 
      },
      { 
        symptom: 'Heading angle drifts rapidly by 5 to 10 degrees per second while resting still.', 
        checks: [
          'Step 1: Did someone touch or bump the table during the 500-sample startup calibration?',
          'Step 2: Press the Arduino reset button while ensuring the sensor is 100% stationary.',
          'Step 3: Verify the raw-to-deg/sec divisor in code is 131.0 for the ±250 deg/s range.'
        ], 
        explanation: 'Any movement during startup calibration records mechanical motion as static bias, creating massive continuous integration drift.' 
      },
      { 
        symptom: 'Pitch and Roll angles fluctuate wildly (jumping +/- 20 degrees) when motors are running.', 
        checks: [
          'Step 1: Mount the MPU-6050 sensor on a piece of soft double-sided foam tape to absorb high-frequency motor vibration.',
          'Step 2: Increase the gyro weighting in the Complementary Filter from 0.96 to 0.98.',
          'Step 3: Check that motor ground return does not flow through the sensor ground pin.'
        ], 
        explanation: 'Mechanical motor vibrations create chaotic transient linear accelerations that corrupt raw gravity vector calculations.' 
      },
      { 
        symptom: 'Angle readings are inverted (turning clockwise makes heading go negative).', 
        checks: [
          'Step 1: Check coordinate frame orientation marked on the MPU-6050 PCB silkscreen.',
          'Step 2: Invert the sign of gyroRateZ in software: \`headingYaw -= gyroRateZ * dt;\`.'
        ], 
        explanation: 'Mounting the sensor upside down or rotated 180 degrees reverses the axis of rotation relative to the chassis coordinate frame.' 
      }
    ],
    checksForUnderstanding: [
      'Why does integrating raw gyroscope angular velocity inevitably lead to heading drift over time?',
      'How does the Complementary Filter combine the unique advantages of accelerometers and gyroscopes?',
      'Why is it strictly mandatory for a robot to remain completely stationary during startup calibration?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the total heading drift error accumulated after 2 minutes if a gyroscope has an uncalibrated zero-rate bias of +0.35 degrees per second.', 
        rubricOrSampleReasoning: 'Drift = Bias * Time = +0.35 deg/s * 120 seconds = +42.0 degrees of accumulated heading error.' 
      },
      { 
        question: 'What two physical signals are carried by the I2C bus wires SDA and SCL?', 
        rubricOrSampleReasoning: 'SDA carries Serial Data (bidirectional bytes), and SCL carries Serial Clock (synchronization clock pulses generated by the bus master).' 
      },
      { 
        question: 'Why can an accelerometer measure pitch and roll tilt angles, but CANNOT measure yaw heading rotation on a level floor?', 
        rubricOrSampleReasoning: 'Pitch and roll alter the alignment of the sensor axes relative to the vertical Earth gravity vector (1.0g); yaw rotation on a level floor occurs perpendicular to gravity, producing zero change in gravitational projection.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-configured I2C scanner sketch to verify hardware connections before running IMU code.'],
      extension: ['Implement a full 3D attitude heading reference system (AHRS) visualizing a 3D robot model in Processing.'],
      offlineOption: ['Calculate complementary filter fusion outputs by hand across 5 noisy time steps on graph paper.']
    },
    nextLessonId: 'adv-07',
    nextLessonTeaser: 'Advanced 07: Mechanical CAD & Design for Fabrication — Design high-strength competition chassis with parametric ribs, captive nut traps, and low centers of gravity!',
    sources: [{ title: 'InvenSense MPU-6050 Product Specification & Register Map', url: 'https://invensense.tdk.com' }],
    assetCredits: [{ asset: 'IMU Coordinate Frame', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-05...');
content = replaceLesson(content, 'adv-05', 'adv-06', adv05);
console.log('Replacing adv-06...');
content = replaceLesson(content, 'adv-06', 'adv-07', adv06);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-05 and adv-06!');
