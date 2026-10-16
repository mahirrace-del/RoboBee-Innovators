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

function replaceLastLesson(fileContent, lessonId, newBlock) {
  const startRegex = new RegExp(`\\{\\s*id:\\s*['"]${lessonId}['"][\\s\\S]*?\\n\\];`);
  if (!startRegex.test(fileContent)) {
    throw new Error(`Could not find final lesson block for ${lessonId}`);
  }
  return fileContent.replace(startRegex, newBlock.trim() + '\n];');
}

const adv10 = `  {
    id: 'adv-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-testing-fmea-debugging", "fg-safety-lab-code"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'advanced',
    sequence: 10,
    code: 'ADVANCED 10',
    title: 'Verification, Reliability & Failure Analysis',
    promise: 'By the end of this masterclass, you will execute a formal Failure Mode and Effects Analysis (FMEA), conduct a 10-trial empirical endurance stress test, quantify Mean Time Between Failures (MTBF), and implement proactive hardening against mechanical vibration and electrical noise.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 09'],
    outcomes: [
      'Conduct formal Failure Mode and Effects Analysis (FMEA) calculating Risk Priority Numbers (RPN).',
      'Execute a 10-trial endurance stress test logging runtime telemetry, battery voltage droop, and sensor error counts.',
      'Mitigate mechanical vibration loosening using nylon-insert locknuts (Nyloc) and threadlocking compounds.',
      'Harden electrical wiring harnesses against solder fatigue and intermittent breadboard disconnections.',
      'Calculate Mean Time Between Failures (MTBF) and draft pre-flight qualification certificates.'
    ],
    vocabulary: [
      { 
        term: 'FMEA (Failure Mode & Effects Analysis)', 
        plainMeaning: 'A systematic checklist predicting everything that could break on your robot and how to prevent it before it happens.', 
        technicalMeaning: 'A structured, proactive engineering procedure for evaluating where and how an electromechanical system might fail and assessing relative risk impact.' 
      },
      { 
        term: 'Risk Priority Number (RPN)', 
        plainMeaning: 'A danger score from 1 to 1000 calculated by multiplying how bad a failure is, how often it happens, and how hard it is to spot.', 
        technicalMeaning: 'The numerical product of Severity (S), Occurrence (O), and Detection (D) ratings used to prioritize engineering corrective actions ($RPN = S \\times O \\times D$).' 
      },
      { 
        term: 'Mean Time Between Failures (MTBF)', 
        plainMeaning: 'How many hours your robot can run continuously on average before something breaks.', 
        technicalMeaning: 'The predicted elapsed time between inherent system failures during normal operation ($MTBF = \\text{Operating Time} / \\text{Failures}$).' 
      },
      { 
        term: 'Intermittent Fault', 
        plainMeaning: 'A maddening bug that only happens once in a while when the robot shakes or hits a bump.', 
        technicalMeaning: 'A temporary or non-repeatable malfunction that occurs irregularly, typically caused by loose electrical contacts or thermal expansion.' 
      },
      { 
        term: 'Threadlocking Compound (Loctite)', 
        plainMeaning: 'Special liquid glue for metal screw threads that prevents nuts from vibrating loose during high-speed runs.', 
        technicalMeaning: 'An anaerobic chemical adhesive applied to fastener threads that cures in the absence of air between metal surfaces, resisting dynamic shock.' 
      },
      { 
        term: 'Cable Strain Relief', 
        plainMeaning: 'Clamping wires firmly to the plastic chassis so pulling on the wire does not rip it out of the circuit board.', 
        technicalMeaning: 'A mechanical feature that prevents mechanical tension, bending fatigue, or vibration from transferring to delicate electrical terminations.' 
      }
    ],
    teacherPrep: [
      'Prepare standardized FMEA risk assessment matrix worksheets for student engineering teams.',
      'Set up 10-trial automated endurance test arena equipped with digital multimeters and stopwatches.'
    ],
    verifiedMaterials: [
      'Fully integrated competition rovers (TB6612, dual TCRT5000, HC-SR04, Uno/Nano)',
      'FMEA engineering worksheets and MTBF calculation logs',
      'Loctite Blue 242 threadlocker and nylon-insert M3 locknuts (Nyloc)',
      'Zip ties, heat shrink tubing, and crimped JST wire harnesses',
      'Digital bench multimeter and 10-trial competition arena'
    ],
    safetyNotes: [
      'Laboratory endurance testing: monitor motor driver heat sink temperatures during repeated trials.',
      'Always disconnect the battery master switch before tightening loose mechanical fasteners.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Case Studies', 
        minutes: 15, 
        teacherAction: 'Analyze why the Mars Climate Orbiter burned up ($125M loss) due to metric vs imperial unit confusion; examine robotics tournament failure reels.', 
        studentAction: 'Analyze the devastating cost of unverified assumptions in mission-critical engineering.' 
      },
      { 
        segment: '15–35m FMEA', 
        minutes: 20, 
        teacherAction: 'Teach the FMEA scoring formula: Severity (1-10) × Occurrence (1-10) × Detection (1-10) = RPN. Demonstrate vibration locknuts.', 
        studentAction: 'Draft team FMEA matrix; identify top 3 highest-RPN failure risks and implement corrective redesigns.' 
      },
      { 
        segment: '35–50m Stress Testing', 
        minutes: 15, 
        teacherAction: 'Supervise 10-trial automated endurance stress test: log lap times, sensor misses, and battery voltage droop.', 
        studentAction: 'Execute 10 consecutive autonomous mission runs; calculate MTBF and isolate root causes of anomalies.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review risk mitigation effectiveness and inspect mechanical fastener security.', 
        studentAction: 'Submit completed FMEA audit sheet and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Systems Engineering & The Science of Failure (FMEA)',
        explanation: 'Amateur builders test a robot until it works once, then declare success. Professional systems engineers test a robot until it CANNOT fail! Failure Mode and Effects Analysis (FMEA) is the aerospace standard: you brainstorm every component failure mode, scoring: \\n• Severity (S: 1 = harmless glitch, 10 = fire/total destruction) \\n• Occurrence (O: 1 = once in a million, 10 = happens every match) \\n• Detection (D: 1 = immediately obvious on bench, 10 = hidden until failure) \\nMultiplying these yields the Risk Priority Number ($RPN = S \\times O \\times D$). Any failure mode with RPN > 120 must receive mandatory engineering redesign before tournament day.',
        instructorNote: 'Walk through an example on the board: a loose battery wire has S=9, O=5, D=4 ➔ RPN = 180 (high danger!).'
      },
      {
        title: '2. Vibration Fatigue & Fastener Loosening Physics',
        explanation: 'A competition robot travelling at 1.5 m/s experiences continuous high-frequency vibration (100 Hz to 500 Hz) generated by electric motor gearboxes and floor texture. Standard steel nuts threaded onto steel bolts rely entirely on elastic friction to stay tight. Under cyclic vibration, transverse micro-slip occurs, causing standard nuts to unscrew and fall off within 45 seconds of operation! To eliminate fastener loss: 1. Use Nylon-Insert Locknuts (Nyloc) that mechanically grip the thread. 2. Apply a drop of Loctite Blue 242 (medium-strength anaerobic threadlocker) to all metal-on-metal threads.',
        instructorNote: 'Pass around a Nyloc nut: show the blue nylon ring inside that prevents vibrating loose.'
      },
      {
        title: '3. Wire Harness Strain Relief & Solder Fatigue Fractures',
        explanation: 'The number-one cause of mysterious robot failures during competition matches is Intermittent Wire Disconnection. Flimsy breadboard jumper wires consist of thin stranded copper crimped into a stamped square pin. As the robot accelerates and turns, cyclic bending concentrates at the pin neck, causing microscopic metal fatigue fractures inside the plastic insulation. The wire looks fine from the outside, but vibration disconnects the circuit for 10 milliseconds, rebooting the microcontroller! Solved by: crimped JST locking connectors and zip-tie strain relief anchors clamped to the chassis.',
        instructorNote: 'Perform the "Tug Test": gently pull on harness wires—they must not wiggle inside their headers.'
      },
      {
        title: '4. Thermal Dissipation & Junction Temperature Monitoring',
        explanation: 'When a motor driver pushes an opponent or climbs a ramp, internal power dissipation surges: $P_{diss} = I_{rms}^2 \\times R_{DS(on)} + V_{drop} \\times I$. For a TB6612 delivering 1.8A, junction temperature rises according to thermal resistance: $T_j = T_a + (P_{diss} \\times R_{\\theta JA})$. If junction temperature reaches 150°C, the silicon’s internal Thermal Shutdown (TSD) circuit trips, cutting motor power for 2 seconds! Adding a miniature finned aluminum heatsink with thermal silicone adhesive slashes thermal resistance by 50%, keeping the driver safely below 85°C.',
        instructorNote: 'Use an infrared thermal camera or contact probe to show a bare driver chip running hot vs a heatsinked driver.'
      },
      {
        title: '5. Empirical 10-Trial Test Matrices & Statistical Reliability',
        explanation: 'If a robot completes 1 lap of a track, what is its reliability? Zero statistical confidence! To prove mission readiness, engineering teams execute a 10-Trial Test Matrix: running 10 consecutive identical missions while logging: 1. Elapsed course time. 2. End-of-run battery voltage. 3. Optical line departures or false obstacle triggers. Calculating the Mean ($\\\\mu$) and Standard Deviation ($\\\\sigma$) reveals stability: if lap time is $14.2\\\\text{s} \\\\pm 0.3\\\\text{s}$, the system is deterministic; if lap time is $14.2\\\\text{s} \\\\pm 4.5\\\\text{s}$, hidden friction or electrical noise is corrupting performance.',
        instructorNote: 'Record lap times from 5 student runs: calculate standard deviation live on the whiteboard.'
      },
      {
        title: '6. Mean Time Between Failures (MTBF) & Pre-Flight Qualification',
        explanation: 'Mean Time Between Failures (MTBF) quantifies long-term system health: \\n$$MTBF = \\\\frac{\\\\text{Total Operating Hours}}{\\\\text{Total Number of Observed Failures}}$$\\nIf a robot runs for 5 hours of cumulative practice and experiences 2 wire disconnections and 1 software crash, its MTBF is $5.0 / 3 = 1.67\\\\text{ hours}$. Before an engineering sign-off for national competition, the vehicle must achieve an MTBF exceeding 10 operating hours with zero unresolved high-severity failure modes.',
        instructorNote: 'Congratulate teams that complete all 10 trials with zero interventions, achieving high MTBF ratings!'
      }
    ],
    visualizerId: 'test_log_sim',
    project: {
      name: 'FMEA Risk Matrix & Empirical Reliability Report',
      deliverableType: 'dataset',
      successEvidence: [
        'Completed Failure Mode and Effects Analysis (FMEA) matrix scoring Severity, Occurrence, and Detection for 6 key subsystems.',
        'Documented 10-trial endurance stress test log capturing run times, battery droop curves, and MTBF calculations.',
        'Implemented physical reliability hardening: Loctite/Nyloc fasteners, cable strain relief anchors, and thermal heatsinks.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Integrated Mobile Rover', 'Loctite Blue 242 Threadlocker', 'M3 Nylon-Insert Locknuts', 'Finned Aluminum Driver Heatsink', 'Cable Ties & Strain Relief Mounts'],
      componentList: [
        { name: 'Hardware Hardening Kit', exactVariant: 'M3 Nyloc locknuts and Loctite 242 anaerobic threadlocker', quantity: 1 },
        { name: 'Driver Heatsink', exactVariant: '10x10x5mm anodized aluminum finned heatsink with thermal tape', quantity: 1 },
        { name: 'Wire Management', exactVariant: 'Miniature nylon zip ties and adhesive cable tie mounts', quantity: 10 },
        { name: 'Precision Digital Multimeter', exactVariant: 'True-RMS bench multimeter for battery load logging', quantity: 1 },
        { name: '10-Trial Test Track Arena', exactVariant: 'Standardized competition line following / combat arena', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/3_trial_arena_test_setup.svg',
      schematic: 'Endurance Test Harness: Automated run logger streaming elapsed lap times, battery droop, and sensor error counts over Serial.',
      wireTable: [
        { from: 'Battery Positive Lead', to: 'Inline 3A Fuse', wireOrPolarityNote: 'Secured with heat shrink tubing' },
        { from: 'Motor Harness Wires', to: 'Chassis Frame', wireOrPolarityNote: 'Anchored with zip-tie strain relief within 30mm of terminals' },
        { from: 'TB6612 Driver IC', to: 'Aluminum Heatsink', wireOrPolarityNote: 'Thermally coupled with 0.5mm thermal conductive tape' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect all chassis screws; replace standard M3 nuts with M3 nylon-insert locknuts (Nyloc).',
        '2. Apply 1 drop of Loctite 242 to motor mounting screw threads.',
        '3. Attach finned aluminum heatsink directly to the TB6612 motor driver IC package.',
        '4. Secure all sensor and power wiring harnesses to chassis plates using zip-tie strain relief anchors.',
        '5. Upload automated 10-trial test logger sketch.',
        '6. Execute 10 consecutive autonomous mission runs; record lap times and battery voltage after each run.'
      ],
      powerAndSafetyChecks: [
        'Confirm Loctite 242 has cured for at least 15 minutes before high-speed testing.',
        'Never overtighten screws into 3D-printed plastic; torque to 0.8 N-m maximum.',
        'Verify battery voltage does not drop below 6.4V across the 10 endurance trials.'
      ],
      testCases: [
        { action: 'Vibration Shake Test', expectedResult: 'Invert and gently shake robot by hand; zero loose wires or rattling fasteners.' },
        { action: 'Execute 10 consecutive arena trial runs', expectedResult: 'Robot completes all 10 runs with 0 derailments and lap time variance < 0.8s.' },
        { action: 'Post-test thermal inspection', expectedResult: 'Motor driver heatsink temperature remains below 70°C after 10 continuous trials.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 10
// Automated 10-Trial Reliability Test Logger & Endurance Benchmarker
// Records: Lap Split Times, Battery Droop Curve, Optical Sensor Error Counts

#include <Arduino.h>

const int PIN_START_TRIGGER = 2; // Momentary start switch (INPUT_PULLUP)
const int PIN_FINISH_SENSOR = A0; // Optical finish line detector
const int PIN_BATTERY_SENSE = A1; // Battery voltage divider (2:1 ratio)

const int TOTAL_TRIALS = 10;
int currentTrial = 0;

struct TrialLog {
  int trialNumber;
  float elapsedSec;
  float batteryVolts;
  int sensorAnomalies;
  bool passed;
};

TrialLog trialRecords[TOTAL_TRIALS];
unsigned long trialStartTime = 0;
bool trialRunning = false;

void setup() {
  pinMode(PIN_START_TRIGGER, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE 10-TRIAL RELIABILITY BENCH    "));
  Serial.println(F("========================================"));
  Serial.println(F("Ready. Press button on Pin 2 to start Trial 1."));
}

void loop() {
  // 1. Await operator start trigger for next trial
  if (!trialRunning && currentTrial < TOTAL_TRIALS) {
    if (digitalRead(PIN_START_TRIGGER) == LOW) {
      delay(50); // Debounce
      if (digitalRead(PIN_START_TRIGGER) == LOW) {
        startNextTrial();
      }
    }
  }

  // 2. Monitor active trial execution
  if (trialRunning) {
    unsigned long now = millis();
    float elapsed = (now - trialStartTime) / 1000.0;

    // Simulate finish line detection on Pin A0 (or timeout at 30s)
    int finishVal = analogRead(PIN_FINISH_SENSOR);
    bool finishCrossed = (finishVal < 350); // Black finish stripe detected

    if (finishCrossed || elapsed >= 30.0) {
      completeTrial(elapsed, finishCrossed);
    }
  }
}

void startNextTrial() {
  trialRunning = true;
  trialStartTime = millis();
  currentTrial++;

  Serial.println();
  Serial.print(F("🏁 [TRIAL "));
  Serial.print(currentTrial);
  Serial.println(F(" / 10] LAUNCHED! Running autonomous mission..."));
}

void completeTrial(float elapsedSec, bool cleanFinish) {
  trialRunning = false;

  // Measure battery voltage under load
  int rawADC = analogRead(PIN_BATTERY_SENSE);
  float volts = (rawADC / 1023.0) * 5.0 * 2.0;

  int idx = currentTrial - 1;
  trialRecords[idx].trialNumber = currentTrial;
  trialRecords[idx].elapsedSec = elapsedSec;
  trialRecords[idx].batteryVolts = volts;
  trialRecords[idx].sensorAnomalies = cleanFinish ? 0 : 1;
  trialRecords[idx].passed = cleanFinish && (elapsedSec < 25.0);

  Serial.print(F("✅ [TRIAL "));
  Serial.print(currentTrial);
  Serial.print(F(" COMPLETE] Time: "));
  Serial.print(elapsedSec, 2);
  Serial.print(F(" s | Battery: "));
  Serial.print(volts, 2);
  Serial.print(F(" V | Status: "));
  Serial.println(trialRecords[idx].passed ? F("PASS") : F("FAIL (Anomaly)"));

  // Check if 10-trial suite is finished
  if (currentTrial >= TOTAL_TRIALS) {
    printStatisticalSummary();
  } else {
    Serial.println(F("Place robot at start line and press button for next trial."));
  }
}

void printStatisticalSummary() {
  Serial.println();
  Serial.println(F("========================================"));
  Serial.println(F("     10-TRIAL STATISTICAL SUMMARY       "));
  Serial.println(F("========================================"));

  float totalTime = 0;
  int passCount = 0;

  for (int i = 0; i < TOTAL_TRIALS; i++) {
    totalTime += trialRecords[i].elapsedSec;
    if (trialRecords[i].passed) passCount++;
  }

  float meanTime = totalTime / TOTAL_TRIALS;

  // Calculate Variance & Standard Deviation
  float sumSqDiff = 0;
  for (int i = 0; i < TOTAL_TRIALS; i++) {
    float diff = trialRecords[i].elapsedSec - meanTime;
    sumSqDiff += diff * diff;
  }
  float stdDev = sqrt(sumSqDiff / TOTAL_TRIALS);
  float reliabilityPercent = ((float)passCount / TOTAL_TRIALS) * 100.0;

  Serial.print(F("📊 Mean Lap Time: "));
  Serial.print(meanTime, 2);
  Serial.println(F(" seconds"));

  Serial.print(F("📊 Standard Deviation (σ): ±"));
  Serial.print(stdDev, 2);
  Serial.println(F(" seconds (Target: <0.5s)"));

  Serial.print(F("🎯 Reliability Score: "));
  Serial.print(reliabilityPercent, 0);
  Serial.println(F("% (Passes: "));
  Serial.print(passCount);
  Serial.println(F("/10)"));

  if (reliabilityPercent >= 90.0 && stdDev <= 0.6) {
    Serial.println(F("🌟 FLIGHT READY: Qualified for Championship Competition!"));
  } else {
    Serial.println(F("⚠️ HIGH VARIANCE: Investigate friction or battery droop bugs."));
  }
}
\`,
      pinMap: {
        'Pin 2': 'Momentary Trial Start trigger button (INPUT_PULLUP)',
        'Pin A0': 'Optical Finish Line reflectance sensor',
        'Pin A1': 'Battery voltage monitor divider input'
      },
      setupAndUpload: [
        '1. Wire start button to Pin 2 and finish sensor to Pin A0.',
        '2. Upload test logger sketch via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Execute 10 consecutive trials, pressing button at the start of each run.',
        '5. Review final statistical summary: Mean, Standard Deviation, and Reliability Score.'
      ],
      explanations: [
        'trialRecords[] array: Stores full empirical history of all 10 trials in memory.',
        'Standard Deviation calculation: Quantifies run-to-run consistency (lower sigma = higher reliability).',
        'Battery droop tracking: Correlates increasing lap times with declining cell voltage.'
      ],
      expectedResult: 'System logs all 10 trials cleanly, computing Mean Time (~14.2s), Standard Deviation (±0.3s), and 100% Reliability qualification.',
      caveats: [
        'Do not recharge the battery during the 10 trials; observing natural voltage droop is essential to the reliability test.',
        'If a mechanical derailment occurs, log it as an anomaly rather than restarting the trial.'
      ],
      tweakTip: 'Graph the 10 trial times in Excel or Google Sheets to visually observe the performance degradation curve!'
    },
    activity: {
      title: 'Conduct the 10-Trial Reliability Qualification Suite',
      steps: [
        'Step 1: Perform the FMEA analysis on your robot; document top 3 failure risks in matrix.',
        'Step 2: Apply Loctite 242 / Nyloc nuts to all motor mount screws and add driver heatsink.',
        'Step 3: Secure all wire harnesses with zip-tie strain relief anchors.',
        'Step 4: Upload automated 10-trial test logger sketch; place robot at arena start line.',
        'Step 5: Execute 10 consecutive mission heats; log lap times and battery voltage.',
        'Step 6: Review statistical report: achieve >=90% reliability and standard deviation <0.8s.'
      ],
      successCriteria: [
        'Completed FMEA matrix with corrective engineering redesign actions documented.',
        'Physical reliability hardening applied (Nyloc fasteners, cable anchors, heatsinks).',
        'Robot completes 10-trial endurance test suite with >=90% success rate.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Robot runs 2 seconds slower on Trial 8, 9, and 10 than on Trial 1 and 2.', 
        checks: [
          'Step 1: Inspect the battery voltage log—did voltage decay from 8.4V down to 7.0V?',
          'Step 2: Correlate motor speed with battery voltage droop.',
          'Step 3: Upgrade to closed-loop encoder odometry or PID tracking to stay immune to battery decay.'
        ], 
        explanation: 'Natural battery discharge drops available motor terminal voltage; open-loop motor speeds decay proportionally with battery capacity.' 
      },
      { 
        symptom: 'Robot derails on Trial 6 due to a loose optical sensor bracket.', 
        checks: [
          'Step 1: Check fastener type—were standard plain nuts used instead of Nyloc nuts?',
          'Step 2: Replace standard nuts with nylon-insert locknuts and apply Loctite Blue 242.',
          'Step 3: Add split spring lock washers under screw heads.'
        ], 
        explanation: 'High-frequency gearbox vibrations break friction preload on standard nuts, vibrating them loose after 5 to 7 minutes of running.' 
      },
      { 
        symptom: 'Intermittent glitch: robot pauses for 0.5s during a sharp corner on Trial 4.', 
        checks: [
          'Step 1: Check wire harness connections—are push-in breadboard jumpers being used?',
          'Step 2: Perform the "Tug Test" on all power and ground wires.',
          'Step 3: Replace push-in jumpers with soldered wires or locking JST crimp connectors.'
        ], 
        explanation: 'Cyclic centripetal acceleration on curves causes loose jumper pins to momentarily disconnect, triggering an unrecorded microcontroller brownout.' 
      },
      { 
        symptom: 'Motor driver smells hot and shuts off during Trial 9.', 
        checks: [
          'Step 1: Inspect driver thermal heatsink—is it securely coupled with thermal tape?',
          'Step 2: Check for mechanical binding in wheel axles or gearboxes.',
          'Step 3: Allow driver to cool down and verify heatsink surface area is adequate.'
        ], 
        explanation: 'Cumulative heat buildup over consecutive trials pushed the silicon junction past 150°C, triggering internal thermal shutdown (TSD).' 
      }
    ],
    checksForUnderstanding: [
      'What are the three components of a Risk Priority Number (RPN) in an engineering FMEA?',
      'Why do standard metal nuts vibrate loose on mobile robots, and how do Nyloc nuts prevent this?',
      'How does statistical Standard Deviation (sigma) quantify robot navigation consistency?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the Risk Priority Number (RPN) for a loose battery wire where Severity is 9, Occurrence is 6, and Detection is 4.', 
        rubricOrSampleReasoning: 'Formula: RPN = S * O * D = 9 * 6 * 4 = 216. (This high score exceeds the 120 threshold, demanding mandatory corrective redesign).' 
      },
      { 
        question: 'What is the operational purpose of adding Cable Strain Relief within 30mm of wire terminals?', 
        rubricOrSampleReasoning: 'It anchors the wire mechanically to the chassis frame, preventing dynamic chassis motion and vibration from concentrating bending fatigue at delicate electrical solder joints or pins.' 
      },
      { 
        question: 'Why is an empirical 10-trial test matrix vastly superior to running a single successful practice lap?', 
        rubricOrSampleReasoning: 'A single run cannot reveal intermittent electrical disconnections, thermal heat buildup, or battery discharge degradation; 10 trials provide statistically significant data on real-world reliability.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-filled FMEA templates with common robotics failure modes and severity benchmarks.'],
      extension: ['Implement automated Weibull distribution reliability modeling to predict component wear-out lifespans.'],
      offlineOption: ['Perform manual statistical mean and standard deviation calculations for a 10-run dataset on paper.']
    },
    nextLessonId: 'adv-11',
    nextLessonTeaser: 'Advanced 11: Autonomous Robotics Capstone: Build Sprint — Team agile scrums, contemporaneous build journals, peer code reviews, and Subsystem Milestone 3!',
    sources: [{ title: 'NASA Systems Engineering Handbook: Failure Mode & Effects Analysis (FMEA)', url: 'https://nasa.gov' }],
    assetCredits: [{ asset: 'FMEA Matrix Template', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-10...');
content = replaceLesson(content, 'adv-10', 'adv-11', adv10);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-10!');
