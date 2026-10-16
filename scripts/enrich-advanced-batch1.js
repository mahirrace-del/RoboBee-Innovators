const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const adv01 = `  {
    id: 'adv-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep"],
      lookUpWhileBuilding: ["fg-comp-tournament-prep", "fg-safety-lab-code"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 1,
    code: 'ADVANCED 01',
    title: 'Competition Strategy, Requirements & Official Rules',
    promise: 'By the end of this masterclass, you will translate official international robotics olympiad rulebooks (All Japan Robot-Sumo, RoboCupJunior, WRO) into unambiguous engineering specifications, mechanical dimensional envelopes, and verifiable pre-match inspection checklists.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Intermediate Series'],
    outcomes: [
      'Extract dimensional, mass, and electrical constraints from international robotics rulebooks (Mini-Sumo, Line Follower).',
      'Implement the mandatory 5-second autonomous start delay with audible/visual countdown annunciators.',
      'Analyze the optical and friction physics of the circular Dohyo arena and white Tawara border line.',
      'Differentiate between legal tactical pushers, dodgers, and wedges under weapon and entanglement bans.',
      'Draft a comprehensive pre-match engineering scrutineering inspection checklist.'
    ],
    vocabulary: [
      { 
        term: 'Dohyo Arena', 
        plainMeaning: 'The circular combat ring where sumo robots compete, painted matte black with a white outer border.', 
        technicalMeaning: 'A standardized circular competition ring (typically 77cm diameter for 500g Mini-Sumo) with a 5cm white border (Tawara).' 
      },
      { 
        term: 'Tawara Border', 
        plainMeaning: 'The 5cm wide white boundary ring that tells robots where the arena edge is.', 
        technicalMeaning: 'The high-contrast white perimeter boundary line exhibiting >5:1 optical reflectance ratio relative to the interior dohyo.' 
      },
      { 
        term: '5-Second Safety Delay', 
        plainMeaning: 'A mandatory safety pause where the robot sits frozen for 5 seconds after pressing start before moving.', 
        technicalMeaning: 'A strictly enforced regulatory delay allowing human referees and operators to clear the arena perimeter before autonomous actuation.' 
      },
      { 
        term: 'Scrutineering Box', 
        plainMeaning: 'A physical hollow box that referees slide over your robot to prove it is not too big.', 
        technicalMeaning: 'A precision dimensional gauge fixture (e.g. 10.0cm x 10.0cm interior) used to verify vehicle compliance under static starting conditions.' 
      },
      { 
        term: 'Non-Destructive Combat', 
        plainMeaning: 'Sumo robotics where machines push each other out without using saws, blades, or fire.', 
        technicalMeaning: 'A competitive format where victory is achieved purely through traction, torque, and positional expulsion, with weapons banned.' 
      },
      { 
        term: 'Traction Coefficient (μ)', 
        plainMeaning: 'How grippy your rubber or silicone tires are against the arena surface.', 
        technicalMeaning: 'The dimensionless ratio between maximum static frictional force and normal force ($F_f \\le \\mu N$) dictating maximum pushing force.' 
      }
    ],
    teacherPrep: [
      'Prepare official 500g Mini-Sumo and Autonomous Line Follower rulebooks with highlighted constraint tables.',
      'Construct a 10cm x 10cm aluminum/acrylic scrutineering box and digital gram scale calibrated to 0.1g resolution.'
    ],
    verifiedMaterials: [
      'Official competition rulebooks (All Japan Robot-Sumo Tournament standards)',
      'Digital precision scale (0.1g resolution, 1000g capacity)',
      '10cm x 10cm interior dimensional inspection box',
      'Arduino Uno or Nano development board with buzzer and start button',
      'Engineering notebooks and compliance audit forms'
    ],
    safetyNotes: [
      'Regulatory compliance: sharp blades, liquid dispensing, and jamming devices are strictly prohibited by tournament rules.',
      'Verify that human operators stand at least 1 meter away from the dohyo boundary when the 5-second delay completes.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Rule Deep-Dive', 
        minutes: 15, 
        teacherAction: 'Analyze strict dimensional limits: Mini-Sumo 10cm x 10cm footprint, 500.0g maximum mass, unlimited height.', 
        studentAction: 'Extract constraints into an engineering requirements matrix with tolerance limits.' 
      },
      { 
        segment: '15–35m Requirements', 
        minutes: 20, 
        teacherAction: 'Explain the 5-second mandatory start delay rule and referee hand signals; analyze start tactics (blitz charge vs evade).', 
        studentAction: 'Program and test the 5-second non-blocking countdown routine with LED and buzzer cues.' 
      },
      { 
        segment: '35–50m Verification Plan', 
        minutes: 15, 
        teacherAction: 'Guide creation of the pre-match technical inspection checklist (weigh-in, dimension box, fail-safe cutoff).', 
        studentAction: 'Conduct mock scrutineering inspection on prototype chassis; record pass/fail data.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review disqualification failure modes and evaluate student requirement tables.', 
        studentAction: 'Submit pre-match inspection document and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Deconstructing Competition Rulebooks into Engineering Specifications',
        explanation: 'In competitive robotics, the rulebook is your customer specification. Top engineering teams never build a robot and hope it fits the rules; the rules dictate the entire architecture! In the international Mini-Sumo division, three rules dominate all design choices: 1. Dimensional Envelope: At match start, the robot must fit entirely inside a 10.0cm wide by 10.0cm long box (though parts may expand after the match begins). 2. Mass Limit: The total weight including batteries must not exceed 500.0 grams. 3. Starting Autonomy: The robot must be 100% autonomous with zero remote communication after the start button is pressed.',
        instructorNote: 'Pass around the 10cm x 10cm inspection box: demonstrate how a loose wire snagging on the rim causes immediate disqualification.'
      },
      {
        title: '2. Safety Systems and the Mandatory 5-Second Autonomous Start Delay',
        explanation: 'All international robot-sumo competitions enforce a strict 5-second start rule: upon pressing the start switch, the robot must remain completely stationary for exactly 5.0 seconds before wheels turn. This grace period allows operators and referees to step back to safety. A false start (moving at 4.8 seconds) results in an immediate match penalty or forfeit. Implementing this in firmware requires a deterministic timer paired with an audible buzzer or blinking LED annunciator so referees can visually count down the 5 seconds.',
        instructorNote: 'Emphasize that the 5-second delay must be implemented cleanly in setup() before any motor actuation routines are called.'
      },
      {
        title: '3. Dohyo Arena Physics: Dimensions, Tawara Border & Optical Contrast',
        explanation: 'The standard Mini-Sumo Dohyo is a flat circular disk 77cm in diameter, fabricated from non-magnetic wood, MDF, or aluminum coated with matte black industrial paint. Surrounding the perimeter is a 5.0cm wide Tawara (boundary border) painted high-contrast brilliant white. Because the surface is non-magnetic, robots cannot use magnetic downforce (unlike the 3kg Mega-Sumo division). Pushing victory depends purely on Coulomb Friction: $F_{push} \\le \\mu \\cdot m \\cdot g$. Maximizing pushing force requires maximizing tire friction coefficient (silicone tires with $\\mu > 1.2$) and keeping total weight at exactly 499.0 grams.',
        instructorNote: 'Show the friction equation: explain why a 480g robot has a significant traction disadvantage against a 499g robot.'
      },
      {
        title: '4. Weapons, Entanglement and Banned Mechanism Regulations',
        explanation: 'Tournament integrity requires fair, reusable hardware. Official rules strictly forbid: 1. Sticky substances or adhesives on tires that leave residue on the dohyo. 2. Sharp metal blades, spikes, or gouging edges that permanently damage the arena mat. 3. Liquid, powder, or gas dispersal mechanisms. 4. Devices that tether, entangle, or jam opponent mechanics. Permitted mechanisms include low-angle ground-hugging front scoops (aluminum or spring steel wedges) that slide under an opponent’s chassis to lift their drive wheels off the floor, breaking their traction!',
        instructorNote: 'Inspect sample scoop blades: show how a 15-degree wedge lifts an opponent without violating the non-destructive rule.'
      },
      {
        title: '5. Tactical Match Analysis: Bulldozer Pusher vs Evasive Dodger',
        explanation: 'Sumo matches last a maximum of 3 minutes and are fought across two primary strategic archetypes: 1. The High-Torque Bulldozer: Heavy gear reduction (50:1 to 75:1), ultra-soft high-grip silicone tires, and a front wedge scoop designed to charge head-on and push the opponent out through raw mechanical traction. 2. The High-Speed Evasive Dodger: High-speed gearing (20:1 to 30:1), agile side radar sensors, designed to evade the initial frontal charge and spin around to push the opponent from the rear flank where they have zero wedge protection.',
        instructorNote: 'Debate with students: which strategy has the highest probability of winning against an unknown opponent?'
      },
      {
        title: '6. Pre-Match Scrutineering Inspection Checklists & Technical Defense',
        explanation: 'Before any robot is allowed to enter the competition arena, it must pass official Scrutineering (technical inspection). Referees execute a strict pass/fail audit: 1. Dimensional check in the 10cm x 10cm box. 2. Digital scale weigh-in ($m \\le 500.0\\text{g}$). 3. Non-stick tire test: robot placed on a clean sheet of paper; the paper must not stick to tires when lifted. 4. 5-second delay test: referee presses start; robot must not twitch for 5.0 seconds. 5. Sharp edge check: cotton swab dragged across chassis perimeter; cotton fibers must not snag.',
        instructorNote: 'Conduct the "Paper Test" and "Cotton Swab Test" live on student chassis so they experience real referee inspection.'
      }
    ],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Competition Mission Engineering Brief',
      deliverableType: 'design_review',
      successEvidence: [
        'Complete competition engineering brief citing current official Mini-Sumo rules (dimensions, mass, timing).',
        'Demonstrated 5.0-second precision countdown firmware with synchronized buzzer/LED status annunciator.',
        'Completed scrutineering checklist verifying physical chassis dimensions (<10cm) and weight (<500g).'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 or Nano DIP', 'Tactile Pushbutton Switch', 'Piezo Buzzer (5V)', 'High-Brightness Status LED', '10kΩ Pullup Resistor'],
      componentList: [
        { name: 'Microcontroller Board', exactVariant: 'Arduino Uno Rev3 DIP or Nano V3.0 (ATmega328P)', quantity: 1 },
        { name: 'Start Pushbutton', exactVariant: 'SPST tactile momentary button (6x6mm)', quantity: 1 },
        { name: 'Audio Annunciator', exactVariant: '5V passive piezo buzzer (tone capable)', quantity: 1 },
        { name: 'Visual Annunciator', exactVariant: '5mm high-efficiency red/green LED with 330Ω resistor', quantity: 2 },
        { name: 'Breadboard & Wire', exactVariant: 'Mini breadboard and solid-core jumper wires', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/sumo_start_wiring.svg',
      schematic: 'Start Button ➔ Pin 2 (INPUT_PULLUP to GND). Buzzer (+) ➔ Pin 8 (~Tone). Status LED ➔ Pin 13. System Ground ➔ Arduino GND.',
      wireTable: [
        { from: 'Tactile Start Button Terminal 1', to: 'Arduino Digital Pin 2', wireOrPolarityNote: 'Monitored start trigger (active LOW)' },
        { from: 'Tactile Start Button Terminal 2', to: 'Arduino GND Pin', wireOrPolarityNote: 'Direct return to ground' },
        { from: 'Piezo Buzzer (+) Lead', to: 'Arduino Digital Pin 8', wireOrPolarityNote: '8-bit tone signal for countdown chirps' },
        { from: 'Piezo Buzzer (-) Lead', to: 'Arduino GND Pin', wireOrPolarityNote: 'Audio ground return' },
        { from: 'Countdown LED Anode (+)', to: 'Arduino Digital Pin 13 (via 330Ω)', wireOrPolarityNote: 'Visual countdown flasher' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Wire start button to Digital Pin 2 and buzzer to Digital Pin 8 on breadboard.',
        '2. Connect USB cable to Arduino and upload the official 5-second countdown firmware.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Press start button; observe 1 chirp per second for 5 seconds, followed by high-pitch GO tone.',
        '5. Measure countdown duration with competition stopwatch: verify elapsed time is between 5.00s and 5.05s.'
      ],
      powerAndSafetyChecks: [
        'Ensure buzzer is passive (tone driven) or active with 5V supply to avoid damaging digital pins.',
        'Never allow wheels to engage before the 5.0-second countdown concludes.',
        'Always verify tactile switch does not trigger accidentally from mechanical chassis vibration.'
      ],
      testCases: [
        { action: 'Power on Arduino', expectedResult: 'System prints READY; LED is solid OFF; robot remains completely stationary.' },
        { action: 'Press start button once', expectedResult: 'LED flashes and buzzer chirps at 1 Hz for exactly 5 seconds.' },
        { action: 'Elapsed time reaches 5.000s', expectedResult: 'Buzzer sounds solid 2kHz GO tone; state transitions to ACTIVE_COMBAT.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 01
// Official Robotics Competition 5-Second Start Safety Controller
// Strict Compliance with All Japan Robot-Sumo Tournament Standards

const int PIN_START_BUTTON = 2; // Momentary tactile button (active LOW)
const int PIN_BUZZER       = 8; // Passive piezo buzzer for countdown chirps
const int PIN_STATUS_LED   = 13; // Visual inspection indicator

enum class MatchState { WAITING_FOR_REFEREE, COUNTDOWN_5S, ACTIVE_COMBAT };
MatchState currentState = MatchState::WAITING_FOR_REFEREE;

unsigned long startPressTime = 0;
int secondsRemaining = 5;

void setup() {
  pinMode(PIN_START_BUTTON, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE COMPETITION START CONTROLLER  "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Ready for Referee. Press button to arm."));

  digitalWrite(PIN_STATUS_LED, LOW);
}

void loop() {
  switch (currentState) {
    case MatchState::WAITING_FOR_REFEREE:
      // Await referee start button press (active LOW)
      if (digitalRead(PIN_START_BUTTON) == LOW) {
        delay(50); // Contact debounce
        if (digitalRead(PIN_START_BUTTON) == LOW) {
          Serial.println(F("[ARMED] Referee start pressed! Commencing 5.0s countdown..."));
          currentState = MatchState::COUNTDOWN_5S;
          startPressTime = millis();
          secondsRemaining = 5;
        }
      }
      break;

    case MatchState::COUNTDOWN_5S: {
      unsigned long elapsed = millis() - startPressTime;

      // Execute exactly 5 seconds of stationary countdown
      if (elapsed < 5000) {
        int currentSec = 5 - (elapsed / 1000);
        if (currentSec != secondsRemaining) {
          secondsRemaining = currentSec;
          Serial.print(F("⏱️ T-minus: "));
          Serial.print(secondsRemaining);
          Serial.println(F(" seconds (STATIONARY)..."));

          // Audible & Visual chirp: 1000 Hz for 80ms
          tone(PIN_BUZZER, 1000, 80);
          digitalWrite(PIN_STATUS_LED, HIGH);
          delay(80);
          digitalWrite(PIN_STATUS_LED, LOW);
        }
      } else {
        // EXACTLY 5.0 SECONDS REACHED: COMMENCE COMBAT!
        Serial.println(F("🚀 [MATCH START] 5.0s elapsed! Motors ENGAGED!"));
        tone(PIN_BUZZER, 2500, 400); // 2.5kHz GO whistle
        digitalWrite(PIN_STATUS_LED, HIGH);
        currentState = MatchState::ACTIVE_COMBAT;
      }
      break;
    }

    case MatchState::ACTIVE_COMBAT:
      // Autonomous combat / line tracking logic executes here
      executeAutonomousTactics();
      break;
  }
}

void executeAutonomousTactics() {
  // Production combat stub: wheels engage only after state transition
}
\`,
      pinMap: {
        'Pin 2': 'Tactile Start Button (Internal INPUT_PULLUP to GND)',
        'Pin 8': 'Passive Piezo Buzzer tone frequency output',
        'Pin 13': 'Visual Countdown Status LED indicator'
      },
      setupAndUpload: [
        '1. Wire button and buzzer according to pin map.',
        '2. Upload firmware via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Press tactile button and time countdown with a stopwatch.',
        '5. Verify exact 5-second delay before "MATCH START" is printed.'
      ],
      explanations: [
        'enum class MatchState: Ensures type-safe state machine execution without illegal states.',
        'INPUT_PULLUP: Utilizes internal 20kΩ ATmega328P resistor, eliminating external hardware parts.',
        'elapsed / 1000 calculation: Generates precise 1-second countdown intervals without blocking main loop.'
      ],
      expectedResult: 'Pressing start produces 5 crisp 1-second chirps while robot sits frozen; at exactly 5.00s, buzzer sounds GO whistle and motors activate.',
      caveats: [
        'Never allow any motor movement during the 5.0-second countdown; doing so causes immediate referee disqualification.',
        'Ensure the start button is protected by a physical shroud so an opponent cannot trigger it during transport.'
      ],
      tweakTip: 'Add an emergency double-tap feature: if the button is pressed again during the 5-second countdown, cancel the match and return to WAITING state!'
    },
    activity: {
      title: 'Conduct Official Pre-Match Scrutineering Inspection',
      steps: [
        'Step 1: Place robot chassis on digital precision scale; record mass (must be <= 500.0g).',
        'Step 2: Lower the 10.0cm x 10.0cm inspection box over the robot; verify zero contact with box sides.',
        'Step 3: Perform the non-stick paper test on all drive wheels.',
        'Step 4: Upload the 5-second start countdown sketch and connect millisecond stopwatch.',
        'Step 5: Press start; measure countdown duration to verify it falls within 5.00s - 5.10s.',
        'Step 6: Complete and sign off on official scrutineering compliance certificate.'
      ],
      successCriteria: [
        'Chassis mass verified at 495.0g - 499.5g (compliant with 500.0g limit).',
        'Chassis slides freely inside 10.0cm x 10.0cm scrutineering gauge fixture.',
        '5.0-second autonomous start delay verified with zero premature wheel movement.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Robot is disqualified at official weigh-in for exceeding 500.0 grams by 8 grams.', 
        checks: [
          'Step 1: Check battery pack—switch from heavy NiMH cells to lightweight 2S Li-Po pack.',
          'Step 2: Re-slice 3D printed brackets with 20% infill instead of 100% solid plastic.',
          'Step 3: Trim excess screw lengths down to flush with nuts.'
        ], 
        explanation: 'Tournament scales are calibrated to 0.1g; being 500.1g is an absolute regulatory failure with zero margin.' 
      },
      { 
        symptom: 'Robot fails the dimensional box inspection because front scoop snags on box entrance.', 
        checks: [
          'Step 1: Measure overall chassis length with vernier calipers—does it exceed 100.0mm?',
          'Step 2: File down front scoop edge or model an adjustable slotted mounting bracket.',
          'Step 3: Ensure wire loops do not bulge outward past the side chassis plates.'
        ], 
        explanation: 'Referees lower the box from above; any protrusion beyond the 100.0mm boundary violates static envelope rules.' 
      },
      { 
        symptom: 'Buzzer sounds muffled or clicks instead of producing audible countdown chirps.', 
        checks: [
          'Step 1: Verify whether the buzzer is active or passive.',
          'Step 2: Ensure tone(PIN_BUZZER, 1000, 80) is driving a passive piezo transducer.',
          'Step 3: Verify the buzzer ground lead is connected securely to Arduino GND.'
        ], 
        explanation: 'Passive buzzers require an oscillating square wave from the tone() function; sending digital DC voltage produces only a single click.' 
      },
      { 
        symptom: 'Start button triggers spontaneously when the robot is turned on or bumped.', 
        checks: [
          'Step 1: Verify pinMode is set to INPUT_PULLUP and not floating INPUT.',
          'Step 2: Increase software debounce delay from 20ms to 50ms.',
          'Step 3: Add a 0.1uF ceramic capacitor across the switch terminals to filter RF noise.'
        ], 
        explanation: 'A floating digital pin toggles randomly on ambient electrical noise; internal pullup resistors guarantee a stable HIGH logic level.' 
      }
    ],
    checksForUnderstanding: [
      'Why do international Mini-Sumo rules mandate an exact 5.0-second delay before autonomous actuation?',
      'How does Coulomb friction (F <= u * N) govern maximum pushing capability in robot-sumo?',
      'Why are non-destructive weapon bans strictly enforced in student robotics olympiads?'
    ],
    exitTicket: [
      { 
        question: 'What are the two absolute physical constraints governing the Mini-Sumo division at match start?', 
        rubricOrSampleReasoning: 'Maximum mass of 500.0 grams, and static dimensions fitting entirely within a 10.0cm x 10.0cm footprint.' 
      },
      { 
        question: 'Why does maximizing robot mass close to the 500.0g limit provide a decisive competitive advantage?', 
        rubricOrSampleReasoning: 'Pushing force is directly proportional to normal force (mass x gravity); a 499g robot exerts greater traction friction than a 450g robot.' 
      },
      { 
        question: 'What is the operational consequence of a robot moving at 4.9 seconds after the referee start signal?', 
        rubricOrSampleReasoning: 'It is classified as a False Start violation, resulting in a match penalty, round forfeit, or immediate disqualification.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-machined 10cm aluminum chassis baseplates guaranteed to pass inspection.'],
      extension: ['Program multi-profile tactical start routines (e.g. direct charge, delayed flank spin, edge retreat).'],
      offlineOption: ['Analyze international tournament match video footage to categorize winning start strategies.']
    },
    nextLessonId: 'adv-02',
    nextLessonTeaser: 'Advanced 02: Power Architecture and Electrical Budget — Calculate worst-case current draws, wire low-noise buck converters, and eliminate brownouts!',
    sources: [{ title: 'All Japan Robot-Sumo Tournament Official Rules', url: 'http://www.fsi.co.jp/sumo/en/' }],
    assetCredits: [{ asset: 'Competition Rulebook Citations', creator: 'RoboBEE Innovators Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

const adv02 = `  {
    id: 'adv-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-comp-tb6612fng"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 2,
    code: 'ADVANCED 02',
    title: 'Power Architecture and Electrical Budget',
    promise: 'By the end of this masterclass, you will calculate worst-case continuous and peak electrical power budgets, design dual-rail isolated power distribution (7.4V high-current motor bus + 5.0V low-noise logic bus) using switching buck converters, and eliminate microcontroller brownouts and inductive ground bounce.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01'],
    outcomes: [
      'Calculate system-wide continuous and peak current budgets across logic, sensors, and actuators.',
      'Explain Li-Ion/LiPo battery discharge curves, internal resistance (ESR), and voltage droop.',
      'Contrast linear regulators (LM7805/AMS1117) with high-efficiency switching buck converters (MP1584/LM2596).',
      'Design dual-rail isolated power distribution with bulk decoupling capacitors and star grounding.',
      'Size fast-acting fuses and conductor wire gauges (AWG) to protect against short-circuit fire hazards.'
    ],
    vocabulary: [
      { 
        term: 'Brownout Detector (BOD)', 
        plainMeaning: 'A watchdog circuit inside the chip that resets the microcontroller if battery voltage dips too low.', 
        technicalMeaning: 'An internal analog comparator circuit that resets the CPU when the VCC supply rail drops below a calibrated threshold (typically 4.3V or 2.7V).' 
      },
      { 
        term: 'Switching Buck Converter', 
        plainMeaning: 'A super-efficient electronic step-down transformer that drops high voltage to 5V without getting burning hot.', 
        technicalMeaning: 'A high-frequency switch-mode DC-DC converter that steps down voltage efficiently (>90%) by storing energy in an inductor and capacitor.' 
      },
      { 
        term: 'Dual-Rail Power Architecture', 
        plainMeaning: 'Splitting your power into two separate highways: a noisy 7.4V road for motors and a clean 5V road for brains.', 
        technicalMeaning: 'An electrical distribution topology providing galvanically isolated or separately regulated voltage buses for high-current loads and logic.' 
      },
      { 
        term: 'Bulk Decoupling Capacitor', 
        plainMeaning: 'A small electrical water tower (470µF) that squirts instant juice when motors start up so the Arduino does not reset.', 
        technicalMeaning: 'An electrolytic reservoir capacitor placed across a power bus to supply transient inrush currents and filter low-frequency voltage sags.' 
      },
      { 
        term: 'Battery C-Rating', 
        plainMeaning: 'A number that tells you how fast and hard you can pull power out of a lithium battery safely.', 
        technicalMeaning: 'A measure of the continuous maximum discharge current of a battery normalized against its capacity ($I_{max} = C \\times \\text{Capacity}$).' 
      },
      { 
        term: 'Star Common Ground', 
        plainMeaning: 'Connecting all ground wires to one central hub screw so motor noise cannot mess up sensor readings.', 
        technicalMeaning: 'A single-point grounding topology that prevents ground loops and eliminates shared-impedance ground bounce between noisy and quiet circuits.' 
      }
    ],
    teacherPrep: [
      'Calibrate bench DC power supplies with current-limiting features and digital multimeters.',
      'Prepare demonstration comparing a scorching hot linear LM7805 with a cool-running switching buck converter under 1A load.'
    ],
    verifiedMaterials: [
      'Digital Multimeter (measuring DC voltage and DC current up to 10A)',
      'MP1584 or LM2596 DC-DC Step-Down Buck Converter Module',
      '2S 7.4V Li-Ion / LiPo Battery Pack (or 6xAA battery pack)',
      'Inline automotive blade fuse holder with 3A fast-acting fuse',
      '470µF 16V electrolytic capacitor and 0.1µF ceramic capacitors',
      'Arduino Uno Rev3 DIP and TB6612FNG motor driver breakout'
    ],
    safetyNotes: [
      'LITHIUM BATTERY SAFETY: Never puncture, crush, or short-circuit lithium battery terminals; short circuits cause thermal runaway fires.',
      'Always install an inline fuse on the battery positive lead immediately adjacent to the battery connector.',
      'Always double-check polarity with a digital multimeter BEFORE connecting any battery to the power bus.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Budgeting', 
        minutes: 15, 
        teacherAction: 'Guide worst-case power table: Arduino (45mA) + 2x IR (40mA) + Sonar (15mA) + 2x Motor Stall (2x 1.2A = 2400mA) = 2500mA Peak!', 
        studentAction: 'Tabulate complete subsystem power budget and identify peak stall demands.' 
      },
      { 
        segment: '15–35m Regulators', 
        minutes: 20, 
        teacherAction: 'Calculate linear regulator thermal dissipation ($P = (7.4V - 5V) \\times 1A = 2.4W$). Contrast with 92% buck efficiency.', 
        studentAction: 'Adjust buck converter trimpot with screwdriver to output exactly 5.00V on digital multimeter.' 
      },
      { 
        segment: '35–50m Distribution', 
        minutes: 15, 
        teacherAction: 'Supervise wiring of dual-rail power harness with bulk capacitor and 3A inline fuse.', 
        studentAction: 'Execute full motor stall test on bench; verify 5V logic bus remains rock-solid with zero brownouts.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review electrical safety and inspect student wiring harnesses.', 
        studentAction: 'Submit calculated electrical budget sheet and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Worst-Case Power Budget Calculation & Current Inrush Dynamics',
        explanation: 'Every mobile robot begins with an Electrical Power Budget. You must calculate two distinct operational states: 1. Quiescent Continuous Load: Arduino Uno (45mA), dual TCRT5000 optical sensors (40mA), HC-SR04 sonar (15mA), motor driver logic (5mA), cruising gearmotors (2x 150mA = 300mA). Total continuous = ~405mA. 2. Worst-Case Peak Stall Load: When pushing an opponent or accelerating from a dead stop, motor armatures stall at 0 RPM, drawing Ohm’s Law limit ($I = V / R_{coil} = 7.4V / 6.2\\Omega = 1.19A$ per motor). System peak load surges to over 2.45 Amperes! Your power architecture must support peak stall without voltage collapse.',
        instructorNote: 'Draw the power table on the board: show why designing for continuous load alone guarantees competition failure.'
      },
      {
        title: '2. Battery Chemistry: Discharge Curves, ESR & Voltage Droop',
        explanation: 'A 2S Li-Po battery pack consists of two lithium cells in series (nominal 3.7V per cell = 7.4V nominal). Fully charged, it delivers 8.4V; when depleted, it drops to 6.0V (3.0V/cell critical cutoff). Every real chemical battery has an internal Equivalent Series Resistance (ESR). When motors demand 2.5A of surge current, internal resistance causes an instantaneous Terminal Voltage Droop: $V_{terminal} = V_{open} - (I_{surge} \\times R_{int})$. If a battery has $R_{int} = 0.4\\Omega$, a 2.5A pulse drops terminal voltage by 1.0 Volt! High-C rated lithium batteries (25C+) have ultra-low ESR ($<0.05\\Omega$), minimizing droop.',
        instructorNote: 'Demonstrate voltage droop on the bench: connect a DMM across battery terminals and stall the motor—watch the voltage plunge.'
      },
      {
        title: '3. Linear Regulators (LM7805/AMS1117) vs Switching Buck Converters',
        explanation: 'Why can’t we power 5V logic directly from the 7.4V battery using an Arduino onboard AMS1117 linear regulator? Linear regulators function like self-adjusting resistors: they drop excess voltage by dissipating it purely as heat: $P_{loss} = (V_{in} - V_{out}) \\times I_{load} = (7.4V - 5.0V) \\times 0.6A = 1.44\\text{ Watts}! On a tiny SOT-223 chip without a massive heatsink, junction temperature exceeds 125°C within seconds, triggering thermal shutdown. A Switching Buck Converter (MP1584/LM2596) pulses current at 500 kHz through an inductor and diode, achieving >90% energy efficiency while staying cool to the touch.',
        instructorNote: 'Pass around a hot linear regulator alongside a cold buck converter operating at identical 1A loads.'
      },
      {
        title: '4. Dual-Rail Power Architecture & Inductive Isolation',
        explanation: 'In robust robotics design, logic and actuators must NEVER drink from the same unregulated straw. We implement Dual-Rail Distribution: 1. Motor Rail (VM = 7.4V): Unregulated high-current bus fed directly from the battery through master switch and fuse to TB6612 VM pin. 2. Logic Rail (VCC = 5.0V): Regulated low-noise bus fed through the switching buck converter to Arduino 5V, sensors, and servos. The two rails share ONLY one physical connection: a single Star Common Ground hub. This topology isolates inductive motor noise and prevents ATmega328P brownouts.',
        instructorNote: 'Draw the dual-rail schematic on the board: highlight the star ground converging at the battery negative terminal.'
      },
      {
        title: '5. Bulk Decoupling Capacitors & High-Frequency Noise Filtering',
        explanation: 'DC motors contain rotating commutators and carbon brushes. As the brushes slide across spinning copper segments, tiny electrical arcs generate brutal high-frequency electromagnetic interference (EMI) and voltage spikes ($V = -L \\frac{di}{dt}$). To suppress this electrical noise: 1. Place a 470µF to 1000µF electrolytic bulk capacitor across the motor driver VM power input to act as a local energy reservoir. 2. Solder three 0.1µF (100nF) ceramic capacitors across each motor: one between positive and negative terminals, and one from each terminal to the metal motor casing.',
        instructorNote: 'Show an oscilloscope trace of raw motor brush noise (wild ±15V spikes) vs cleaned-up power with decoupling capacitors.'
      },
      {
        title: '6. Fusing, Wire Gauge Sizing (AWG) & Fire Prevention Protocols',
        explanation: 'Lithium battery packs store massive chemical energy. In a dead short, a 2S 1500mAh 25C LiPo can dump over 37 Amperes of current, instantly vaporizing thin jumper wires and igniting battery cells in an uncontrollable chemical fire! Mandatory safety rules: 1. Install an inline 3A or 5A fast-acting automotive blade fuse on the positive lead within 5cm of the battery connector. 2. Use 20AWG or 18AWG high-strand silicone wire for main battery rails; never route motor power through flimsy breadboard jumper wires.',
        instructorNote: 'Demonstrate a blown fuse: show how a 3A fuse sacrifices itself in 5 milliseconds to save expensive microcontrollers and prevent fires.'
      }
    ],
    visualizerId: 'circuit_switch_led_sim',
    project: {
      name: 'High-Efficiency Dual-Rail Power Distribution System',
      deliverableType: 'design_review',
      successEvidence: [
        'Complete electro-mechanical power budget calculating quiescent and peak stall currents with battery runtime.',
        'Calibrated switching buck converter delivering 5.00V ± 0.05V logic power from 7.4V battery.',
        'Wired dual-rail harness featuring 3A inline fuse, 470µF bulk capacitor, and verified zero brownouts during motor stall.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['MP1584 / LM2596 DC-DC Buck Converter', '2S 7.4V Li-Ion Battery Pack', 'Inline 3A Automotive Blade Fuse', '470µF 16V Low-ESR Electrolytic Capacitor', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: 'DC-DC Buck Converter', exactVariant: 'MP1584 miniature 3A step-down switching regulator module', quantity: 1 },
        { name: 'Battery Power Pack', exactVariant: '2S 7.4V 1500mAh Li-Ion / 6xAA holder with master switch', quantity: 1 },
        { name: 'Inline Fuse Holder', exactVariant: 'Standard automotive mini blade fuse holder with 3A fast fuse', quantity: 1 },
        { name: 'Bulk Electrolytic Capacitor', exactVariant: '470µF 16V radial low-ESR electrolytic capacitor', quantity: 1 },
        { name: 'High-Current Hookup Wire', exactVariant: '20AWG flexible stranded silicone wire (Red and Black)', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/dual_rail_power_wiring.svg',
      schematic: 'Battery (+) ➔ Switch ➔ 3A Fuse ➔ Split: [Rail 1: TB6612 VM (7.4V)] & [Rail 2: Buck IN+ ➔ Buck OUT+ (5.0V) ➔ Arduino 5V]. Star GND.',
      wireTable: [
        { from: 'Battery Positive Lead (+)', to: 'Master SPST Power Switch Terminal 1', wireOrPolarityNote: 'Unswitched raw battery positive' },
        { from: 'Master Power Switch Terminal 2', to: 'Inline 3A Fuse Input Lead', wireOrPolarityNote: 'Switched raw battery rail' },
        { from: 'Inline 3A Fuse Output Lead', to: 'TB6612 VM Pin & Buck Converter IN+', wireOrPolarityNote: 'Protected 7.4V high-current motor bus' },
        { from: 'Buck Converter OUT+ (5.0V)', to: 'Arduino 5V Pin & Sensor VCC', wireOrPolarityNote: 'Regulated, low-noise 5.0V logic bus' },
        { from: 'Battery Negative Lead (-)', to: 'Central Star Ground Hub', wireOrPolarityNote: 'MANDATORY common ground reference' },
        { from: '470µF Capacitor (+)', to: 'TB6612 VM Pin (Cathode to Star GND)', wireOrPolarityNote: 'Local inrush reservoir' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Solder 3A inline fuse holder directly to the switched positive lead of the battery pack.',
        '2. Connect battery to Buck Converter IN+ and IN-; connect DMM probes to Buck OUT+ and OUT-.',
        '3. Adjust the miniature brass potentiometer until DMM reads exactly 5.00V DC.',
        '4. Wire Buck OUT+ to Arduino 5V pin; connect TB6612 VM to the 7.4V fused battery rail.',
        '5. Install 470µF bulk capacitor directly across TB6612 VM and GND pins (observe polarity!).',
        '6. Perform bench stall test: hold wheels stationary under full power; verify Arduino does not reset.'
      ],
      powerAndSafetyChecks: [
        'Electrolytic capacitors are POLARIZED: connecting backwards causes violent venting and chemical smoke.',
        'Never adjust the buck converter trimpot while connected to the Arduino; calibrate with DMM first!',
        'Always confirm 3A fuse is installed before turning on the master power switch.'
      ],
      testCases: [
        { action: 'Measure Buck OUT+ with DMM', expectedResult: 'Digital multimeter displays 5.00V ± 0.05V with zero load.' },
        { action: 'Simultaneously stall both drive motors by hand', expectedResult: 'Motors draw ~2.2A; 5V rail drops by <0.1V; Arduino continues running.' },
        { action: 'Intentional dead short across motor rail', expectedResult: '3A fuse blows instantly in <10ms; zero wire melting or battery damage.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: \`// RoboBEE Innovators - Advanced 02
// Real-Time Battery Voltage & Brownout Telemetry Monitor
// Measures 7.4V battery rail via 2:1 precision resistive divider on Pin A0

const int PIN_BATTERY_SENSE = A0;
const int PIN_STATUS_LED    = 13;

// Precision Resistor Divider Ratio:
// R1 = 10k (to Battery +), R2 = 10k (to GND) -> Ratio = (R1+R2)/R2 = 2.000
const float VOLTAGE_DIVIDER_RATIO = 2.00;
const float ADC_REFERENCE_VOLTAGE = 5.00;

// Critical Battery Safety Thresholds (2S Li-Po / Li-Ion):
const float VOLTAGE_FULL_CHARGE   = 8.40; // 4.20V per cell
const float VOLTAGE_NOMINAL       = 7.40; // 3.70V per cell
const float VOLTAGE_LOW_WARNING   = 6.80; // 3.40V per cell (Warning beep)
const float VOLTAGE_CRITICAL_CUT  = 6.20; // 3.10V per cell (Shutdown to protect cells)

unsigned long lastSampleTime = 0;
float minVoltageRecorded = 12.0;

void setup() {
  pinMode(PIN_STATUS_LED, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE POWER TELEMETRY & BOD MONITOR "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Monitoring 7.4V Power Rail."));
}

void loop() {
  unsigned long now = millis();

  // Sample battery voltage every 250ms (4 Hz)
  if (now - lastSampleTime >= 250) {
    lastSampleTime = now;

    int rawADC = analogRead(PIN_BATTERY_SENSE);
    float pinVoltage = (rawADC / 1023.0) * ADC_REFERENCE_VOLTAGE;
    float batteryVoltage = pinVoltage * VOLTAGE_DIVIDER_RATIO;

    // Track minimum voltage droop during motor surges
    if (batteryVoltage < minVoltageRecorded) {
      minVoltageRecorded = batteryVoltage;
    }

    Serial.print(F("🔋 [BATTERY] Current: "));
    Serial.print(batteryVoltage, 2);
    Serial.print(F(" V | Peak Droop Min: "));
    Serial.print(minVoltageRecorded, 2);
    Serial.print(F(" V | Status: "));

    if (batteryVoltage <= VOLTAGE_CRITICAL_CUT) {
      Serial.println(F("🛑 CRITICAL! SHUTDOWN MOTORS TO PREVENT BATTERY RUIN!"));
      digitalWrite(PIN_STATUS_LED, HIGH);
    } else if (batteryVoltage <= VOLTAGE_LOW_WARNING) {
      Serial.println(F("⚠️ WARNING: Battery low. Return to pit."));
      digitalWrite(PIN_STATUS_LED, (now / 250) % 2 == 0 ? HIGH : LOW);
    } else {
      Serial.println(F("✅ Nominal Operational Voltage."));
      digitalWrite(PIN_STATUS_LED, LOW);
    }
  }
}
\`,
      pinMap: {
        'Pin A0': 'Battery Voltage Sensing input (Center of 10k/10k divider)',
        'Pin 13': 'Status & Low-Battery Alarm LED indicator',
        'Buck OUT+': 'Regulated 5.0V bus to Arduino 5V Header Pin',
        'Fused VM': '7.4V Switched Battery bus to Motor Driver VM Pin'
      },
      setupAndUpload: [
        '1. Wire 10k/10k resistive divider from 7.4V battery rail to Pin A0.',
        '2. Upload firmware via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Observe real-time voltage reporting (e.g. 7.82 V).',
        '5. Engage motors; observe "Peak Droop Min" capture voltage dip under load.'
      ],
      explanations: [
        'VOLTAGE_DIVIDER_RATIO (2.0): Halves the 8.4V battery voltage so it never exceeds the 5.0V analog pin limit.',
        'minVoltageRecorded: Captures microsecond inductive voltage dips during motor stalls to evaluate battery health.',
        'VOLTAGE_CRITICAL_CUT (6.2V): Protects lithium cells against permanent chemical damage from over-discharge.'
      ],
      expectedResult: 'Serial Monitor prints accurate battery voltage every 250ms and captures minimum voltage droop during motor surges.',
      caveats: [
        'Never connect raw 7.4V battery voltage directly to Analog Pin A0; without the voltage divider, it will destroy the ATmega328P ADC.',
        'Verify resistor values with a DMM: a 5% resistor tolerance changes voltage readings by ~0.4V.'
      ],
      tweakTip: 'Implement software-calibrated ADC reference: measure the real 5V rail with a DMM and update ADC_REFERENCE_VOLTAGE to exactly match!'
    },
    activity: {
      title: 'Assemble and Stress-Test the Dual-Rail Power Harness',
      steps: [
        'Step 1: Calculate the total worst-case continuous and peak stall current for your robot.',
        'Step 2: Connect the 2S battery to the buck converter input; adjust potentiometer to exactly 5.00V on DMM.',
        'Step 3: Solder the 3A inline fuse holder into the positive battery harness lead.',
        'Step 4: Install the 470µF electrolytic decoupling capacitor directly across the motor driver VM and GND pins.',
        'Step 5: Connect Arduino logic to the 5.0V buck output and motor driver to the 7.4V fused rail.',
        'Step 6: Upload voltage monitor firmware and execute a 3-second physical motor stall test; confirm zero brownouts.'
      ],
      successCriteria: [
        'Buck converter delivers steady 5.00V ± 0.05V across varying battery charge levels.',
        'Dual-rail harness incorporates master switch, 3A inline fuse, and bulk capacitor.',
        'Robot survives full 3-second motor stall with zero microcontroller brownout resets.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Arduino board reboots every time both motors switch from forward to reverse.', 
        checks: [
          'Step 1: Check if the 470uF bulk decoupling capacitor is installed across TB6612 VM and GND.',
          'Step 2: Measure battery internal resistance or test with a fresh, fully charged battery pack.',
          'Step 3: Ensure Arduino is powered from the 5V buck converter and NOT the raw motor rail.'
        ], 
        explanation: 'Rapid motor direction reversal draws double stall current (reverse EMF), collapsing battery terminal voltage below the BOD threshold.' 
      },
      { 
        symptom: 'Buck converter module gets burning hot and smells like hot plastic.', 
        checks: [
          'Step 1: Verify the output voltage—did you accidentally connect 7.4V to the buck OUTPUT instead of INPUT?',
          'Step 2: Check for a short circuit on the 5V logic bus using DMM continuity mode.',
          'Step 3: Verify total current draw on the 5V rail does not exceed the 2A/3A rating of the buck chip.'
        ], 
        explanation: 'Connecting power supplies in reverse or drawing short-circuit current forces the internal switching MOSFET into thermal overload.' 
      },
      { 
        symptom: 'Serial Monitor reports battery voltage as 0.0V or constant 10.0V.', 
        checks: [
          'Step 1: Check voltage divider wiring: R1 from Battery (+) to A0, R2 from A0 to GND.',
          'Step 2: Measure voltage at Pin A0 with a DMM—it must read approximately half of the battery voltage.',
          'Step 3: Verify the common ground jumper between the battery negative lead and Arduino GND.'
        ], 
        explanation: 'Missing ground connections leave the analog pin floating, or miswiring resistors creates an open circuit.' 
      },
      { 
        symptom: '3A inline fuse blows immediately upon flipping the master power switch.', 
        checks: [
          'Step 1: Perform a cold continuity beep test: is there a direct short between VM and GND?',
          'Step 2: Check the polarity of the 470uF electrolytic capacitor—is the white stripe on GND?',
          'Step 3: Check motor driver H-Bridge wiring for pinched wires or bridged solder pads.'
        ], 
        explanation: 'A blown fuse indicates an immediate dead short circuit; the fuse performed its job, preventing a catastrophic battery fire.' 
      }
    ],
    checksForUnderstanding: [
      'Why does drawing 2.5A from a battery cause terminal voltage to instantly droop?',
      'Why is a switching buck converter vastly superior to a linear LM7805 regulator in mobile robotics?',
      'Explain the vital role of the 470µF bulk decoupling capacitor during motor stall transients.'
    ],
    exitTicket: [
      { 
        question: 'Calculate the power dissipated as pure heat by a linear LM7805 regulator stepping 8.4V down to 5.0V at a current load of 800mA.', 
        rubricOrSampleReasoning: 'Formula: Ploss = (Vin - Vout) * Iload = (8.4V - 5.0V) * 0.8A = 3.4V * 0.8A = 2.72 Watts of heat.' 
      },
      { 
        question: 'What is an ATmega328P Brownout Reset (BOD), and what electrical event triggers it on a mobile robot?', 
        rubricOrSampleReasoning: 'BOD is an internal safety reset triggered when supply voltage dips below 4.3V (or 2.7V), caused by high motor inrush current collapsing an unregulated power rail.' 
      },
      { 
        question: 'Why must high-current motor drivers and sensitive microcontroller logic share only a Star Common Ground?', 
        rubricOrSampleReasoning: 'To prevent large, noisy motor return currents from flowing through logic ground traces, which causes inductive ground bounce and signal corruption.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-soldered dual-rail power distribution boards with pre-tuned 5.0V buck regulators.'],
      extension: ['Add an automatic low-voltage buzzer cutoff circuit that isolates the battery if voltage drops below 6.4V.'],
      offlineOption: ['Calculate battery runtime in hours using Wh capacity and continuous vs peak duty cycles.']
    },
    nextLessonId: 'adv-03',
    nextLessonTeaser: 'Advanced 03: Robust Embedded C++: Non-Blocking Architecture — Master cooperative task schedulers, eliminate delay() freezes, and achieve 50,000 Hz loop speeds!',
    sources: [{ title: 'Texas Instruments: Power Management Architecture for Autonomous Mobile Robots', url: 'https://ti.com' }],
    assetCredits: [{ asset: 'Dual-Rail Power Harness Schematic', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }`;

console.log('Replacing adv-01...');
content = replaceLesson(content, 'adv-01', 'adv-02', adv01);
console.log('Replacing adv-02...');
content = replaceLesson(content, 'adv-02', 'adv-03', adv02);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-01 and adv-02!');
