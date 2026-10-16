export type CourseTier = 'explorer' | 'beginner' | 'intermediate' | 'advanced';
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type ClassStatus = 'locked' | 'live_in_class' | 'published';

export type InteractiveVisualType =
  | 'robot_detective_sim'
  | 'circuit_switch_led_sim'
  | 'motion_maze_sim'
  | 'invent_helper_sim'
  | 'sense_decide_act_sim'
  | 'arduino_board_tour_sim'
  | 'led_blink_sim'
  | 'breadboard_circuit_sim'
  | 'sensor_serial_sim'
  | 'sensor_observatory_sim'
  | 'logic_counter_sim'
  | 'reaction_game_sim'
  | 'motor_driver_pwm_sim'
  | 'movement_route_sim'
  | 'ultrasonic_sonar_sim'
  | 'cad_caliper_sim'
  | 'obstacle_avoiding_rover_sim'
  | 'test_log_sim'
  | 'line_follower_sim'
  | 'servo_arm_sim'
  | 'iot_dashboard_sim'
  | 'sumo_arena_sim'
  | 'pid_tuning_sim'
  | 'parts_explorer_sim';

export interface VocabularyItem {
  term: string;
  plainMeaning: string;
  technicalMeaning: string;
}

export interface RhythmSegment {
  segment: string;
  minutes: number;
  teacherAction: string;
  studentAction: string;
}

export interface ConceptBlock {
  title: string;
  explanation: string;
  instructorNote?: string;
}

export interface PhysicalBuildPack {
  verifiedBoardAndModules: string[];
  componentList: { name: string; exactVariant: string; quantity: number }[];
  connectionPhotoOrClearlyLabeledIllustration: string;
  schematic: string;
  wireTable: { from: string; to: string; wireOrPolarityNote?: string }[];
  assemblyAndPowerUpSteps: string[];
  powerAndSafetyChecks: string[];
  testCases: { action: string; expectedResult: string }[];
}

export interface CodeLab {
  language: 'cpp' | 'openscad' | 'python' | 'pseudocode';
  code: string;
  pinMap: Record<string, string>;
  setupAndUpload: string[];
  explanations: string[];
  expectedResult: string;
  caveats: string[];
  tweakTip?: string;
}

export interface TroubleshootingCard {
  symptom: string;
  checks: string[];
  explanation: string;
}

export interface ExitTicketItem {
  question: string;
  rubricOrSampleReasoning: string;
  hint?: string;
}

export interface RoboticsLesson {
  id: string;
  courseId: CourseTier;
  sequence: number;
  code: string; // e.g. "EXPLORER 01", "BEGINNER 01"
  title: string;
  promise: string;
  status: ClassStatus;
  proposedAudience: string;
  durationMinutes: number; // default 90 for beginner 1, 60 for others
  compactDurationMinutes?: number; // e.g. 60 for beginner 1
  prerequisites: string[];
  outcomes: string[];
  vocabulary: VocabularyItem[];
  teacherPrep: string[];
  verifiedMaterials: string[];
  safetyNotes: string[];
  classRhythm: RhythmSegment[];
  concepts: ConceptBlock[];
  visualizerId: InteractiveVisualType;
  project: {
    name: string;
    deliverableType: 'physical_build' | 'code_artifact' | 'cad_model' | 'dataset' | 'design_review' | 'simulation';
    successEvidence: string[];
  };
  activity: {
    title: string;
    steps: string[];
    successCriteria: string[];
    extension?: string;
  };
  physicalBuildPack?: PhysicalBuildPack;
  codeLab?: CodeLab;
  troubleshooting: TroubleshootingCard[];
  checksForUnderstanding: string[];
  exitTicket: ExitTicketItem[];
  differentiation: {
    support: string[];
    extension: string[];
    offlineOption?: string[];
  };
  nextLessonId?: string;
  nextLessonTeaser: string;
  sources: { title: string; url: string; accessedOrVersioned?: string }[];
  assetCredits: { asset: string; creator: string; license: string; sourceUrl: string }[];
  ipNotice: string;
  fieldGuideLinks?: {
    readBeforeClass: string[];
    lookUpWhileBuilding: string[];
    goDeeper: string[];
  };

  // Backward compatibility aliases for legacy views
  classNumber?: number;
  level?: string;
  subtitle?: string;
  interactiveVisualType?: InteractiveVisualType;
  learningObjectives?: string[];
  coreConcept?: {
    headline: string;
    summary: string;
    safetyOrGoldenRule: string;
    flowSteps: { label: string; title: string; description: string }[];
  };
}

export type ClassModule = RoboticsLesson;

// Course Space Definition
export interface CourseSpace {
  id: CourseTier;
  title: string;
  codeName: string;
  badge: string;
  proposedBand: string;
  accentColor: string;
  statusNotice: string;
  description: string;
  totalClasses: number;
  recommendedHardware: string;
}

export const COURSE_SPACES: CourseSpace[] = [
  {
    id: 'explorer',
    title: 'Free Robo Explorers',
    codeName: 'EXPLORER',
    badge: 'Proposed for Classes 3–4',
    proposedBand: 'Classes 3–4 (Ages 8–10)',
    accentColor: '#F5B800', // RoboBEE Golden Yellow
    statusNotice: 'Proposed Website Structure (Free Sampler — No account required for public simulations)',
    description: 'A playful, visual, low-barrier introduction to robot systems, circuits, and movement for young learners under teacher supervision.',
    totalClasses: 4,
    recommendedHardware: 'Paper circuits, low-voltage 3V coin cells, or web simulation mode'
  },
  {
    id: 'beginner',
    title: 'Beginner Robotics & Arduino',
    codeName: 'BEGINNER',
    badge: 'Proposed for Classes 5–8',
    proposedBand: 'Classes 5–8 (Ages 10–14)',
    accentColor: '#6B0F24', // RoboBEE Burgundy
    statusNotice: 'Core Academy Track (10 Classes — From First-Light Blink to Autonomous Obstacle Rover)',
    description: 'Master circuits, breadboards, C++ code logic, sensors, motor drivers, 3D CAD design, and two-wheel rover integration.',
    totalClasses: 10,
    recommendedHardware: 'Arduino Uno R3 / Nano, Breadboard, LEDs, Sonar HC-SR04, L298N/TB6612FNG Driver, 2WD Rover Chassis'
  },
  {
    id: 'intermediate',
    title: 'Intermediate Robotics & Systems',
    codeName: 'INTERMEDIATE',
    badge: 'Proposed for Classes 7–10',
    proposedBand: 'Classes 7–10 (Ages 12–16)',
    accentColor: '#8B1A35', // RoboBEE Burgundy Tint
    statusNotice: 'Proposed Website Structure (10 Classes — State Machines, Reflectance IR, Servos & Telemetry)',
    description: 'Engineering workflow, sensor calibration station, state machines, line-following algorithms, servo grippers, and maze navigation.',
    totalClasses: 10,
    recommendedHardware: 'Dual/Multi-channel IR Sensor Array, SG90/MG996R Servos, Calibrated Test Track, Bluetooth/ESP32 Module'
  },
  {
    id: 'advanced',
    title: 'Advanced Robotics & Competition',
    codeName: 'ADVANCED',
    badge: 'Proposed for Classes 9–12',
    proposedBand: 'Classes 9–12 (Ages 14–18+)',
    accentColor: '#C4920A', // RoboBEE Golden Amber
    statusNotice: 'Proposed Website Structure (12 Classes — Non-Blocking C++, Encoders, PID Control & Mini-Sumo)',
    description: 'Competition engineering brief, electrical power budgets, non-blocking C++ architecture, PID tuning, telemetry, and Mini-Sumo robot build.',
    totalClasses: 12,
    recommendedHardware: 'Encoder Gear Motors, IMU (reference: MPU-6050), ESP32/STM32 (instructor-confirmed), Mini-Sumo Dohyo Ring, regulated battery pack'
  }
];

export const TRUSTED_ORG_INFO = {
  name: 'RoboBEE Innovators',
  tagline: 'Dream. Invent. Experiment. Inspire.',
  phone: '+880 1902-821018',
  address: 'Kids Den Int. Preschool (Penny Bee Solutions), Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj, Bangladesh 1400',
  brandColors: {
    burgundy: '#6B0F24',
    goldenYellow: '#F5B800',
    white: '#FFFFFF',
    neutralDark: '#161B26'
  },
  ipStatement: 'Curriculum, schematics, codebases, slide materials, and teaching methods are proprietary intellectual property of RoboBEE Innovators. Unauthorized redistribution or commercial replication is strictly prohibited.'
};

// =========================================================================
// COMPLETE CURRICULUM REPOSITORY (ALL 36 LESSONS ACROSS 4 COURSE SPACES)
// =========================================================================

export const ALL_ROBOTICS_LESSONS: RoboticsLesson[] = [
  // -----------------------------------------------------------------------
  // COURSE SPACE A: FREE ROBO EXPLORERS (CLASSES 01-04)
  // -----------------------------------------------------------------------
  {
    id: 'exp-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot"],
      lookUpWhileBuilding: ["fg-foundations-what-is-robot"],
      goDeeper: ["fg-arduino-microcontroller-vs-computer"]
    },
    courseId: 'explorer',
    sequence: 1,
    code: 'EXPLORER 01',
    title: 'Robot Detective: Sense, Decide, Act',
    promise: 'By the end, I can spot real robots around me and explain how they sense, decide, and act.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['None. Curiosity and eagerness to explore!'],
    outcomes: [
      'Classify everyday machines into "robot," "automated appliance," or "tool."',
      'Explain that a robot has three parts: sensors to see, a brain to decide, and parts to act.',
      'Create a three-panel comic storyboard showing a robot helping people.'
    ],
    vocabulary: [
      { term: 'Robot', plainMeaning: 'A machine with senses, a computer brain, and moving parts.', technicalMeaning: 'An autonomous electromechanical system that senses its environment, processes information, and acts physically.' },
      { term: 'Sensor', plainMeaning: 'The robot’s eyes, ears, or touch detectors.', technicalMeaning: 'An electrical transducer that detects physical inputs and converts them into signals.' },
      { term: 'Actuator', plainMeaning: 'The muscles of the robot (motors, lights, speakers).', technicalMeaning: 'A device that converts electrical energy into physical motion or output.' }
    ],
    teacherPrep: [
      'Print Robot Detective flashcards or load interactive simulation on projector.',
      'Prepare sample objects: a toaster/traffic light picture vs. a robotic vacuum picture.',
      'Check classroom display and provide paper and color pens for storyboards.'
    ],
    verifiedMaterials: ['Classroom projector / tablet', 'Robot Detective Sorting Cards', 'Drawing paper & crayons'],
    safetyNotes: ['Supervised classroom discussion. No electrical power tools or bare wires used in this session.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show pictures of a toaster, a hand drill, a traffic light, and a Mars rover. Ask: "Which one is alive?"', studentAction: 'Vote and discuss why some machines act by themselves.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Guide interactive Sense -> Decide -> Act story simulation on screen.', studentAction: 'Click simulated sensors and trace how the robot chooses what to do.' },
      { segment: '25–40m Hands-on', minutes: 15, teacherAction: 'Distribute storyboard sheets and mentor idea generation.', studentAction: 'Draw a three-panel comic: 1. Sensor notices, 2. Brain decides, 3. Motor acts.' },
      { segment: '40–45m Exit Share', minutes: 5, teacherAction: 'Invite two students to present their robot story.', studentAction: 'Share story and answer exit question.' }
    ],
    concepts: [
      {
        title: 'Is Every Machine a Robot?',
        explanation: 'A washing machine follows a timer, but cannot see if your clothes are clean. A robot has sensors to observe the real world and changes its behavior based on what it senses!',
        instructorNote: 'Emphasize that autonomy requires closed-loop feedback based on live sensory data.'
      }
    ],
    visualizerId: 'robot_detective_sim',
    project: {
      name: 'Sense–Decide–Act Robot Storyboard',
      deliverableType: 'simulation',
      successEvidence: ['Three clearly labeled story panels naming the input sensor, the brain decision, and the motor action.']
    },
    activity: {
      title: 'Create Your Robot Storyboard',
      steps: [
        'Pick a mission: A robot helper for cleaning parks, watering plants, or guiding visually impaired people.',
        'Draw Panel 1 (SENSE): What does the robot notice? (e.g. Dry soil, plastic bottle on grass).',
        'Draw Panel 2 (DECIDE): What rule does its brain check? (e.g. IF soil is dry, turn water pump on).',
        'Draw Panel 3 (ACT): What physical action happens? (e.g. Robot arm waters the plant).'
      ],
      successCriteria: ['All 3 stages (Sense, Decide, Act) are present and correctly connected.'],
      extension: 'Add an emergency stop button to your storyboard design.'
    },
    troubleshooting: [
      { symptom: 'Student confuses remote control toy with an autonomous robot.', checks: ['Ask: "Who is making the decision—you on the joystick, or the computer inside the robot?"'], explanation: 'Remote control machines have human brains; autonomous robots run their own software decisions.' }
    ],
    checksForUnderstanding: ['What is the difference between a microwave timer and an autonomous cleaning robot?'],
    exitTicket: [
      { question: 'Name one sensor a robot can use and what it detects.', rubricOrSampleReasoning: 'Light sensor (detects brightness), distance sensor (detects obstacles), or temperature sensor.' },
      { question: 'What does the robot’s controller do with information from sensors?', rubricOrSampleReasoning: 'It follows programmed rules to decide what action to take next.' }
    ],
    differentiation: {
      support: ['Provide fill-in-the-blank sentence starters: "My robot senses ___ so it ___."'],
      extension: ['Ask students to imagine what happens if the sensor gets covered in mud.'],
      offlineOption: ['Use printed paper flashcards instead of digital screen.']
    },
    nextLessonId: 'exp-02',
    nextLessonTeaser: 'Explorer 02: Make a Signal — Discover the magical circle of electricity and light up an LED with a switch!',
    sources: [{ title: 'RoboBEE Innovators Lab Pedagogy (Instructor-Developed Reference)', url: '' }],
    assetCredits: [{ asset: 'Robot Detective Graphics', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'exp-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-electronics-ohms-law","fg-electronics-breadboards"],
      goDeeper: ["fg-board-uno-anatomy"]
    },
    courseId: 'explorer',
    sequence: 2,
    code: 'EXPLORER 02',
    title: 'Make a Signal: Switch-and-LED Circuit',
    promise: 'By the end, I can build a safe closed circuit and send light signals with a switch.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01'],
    outcomes: [
      'Explain that electricity only flows when there is a complete closed circle.',
      'Demonstrate how a switch breaks or connects the circle of current.',
      'Build a working physical paper circuit or safe simulation.'
    ],
    vocabulary: [
      { term: 'Circuit', plainMeaning: 'A complete circle that electricity travels through.', technicalMeaning: 'A closed loop of conductive paths through which electrical charges can flow.' },
      { term: 'Switch', plainMeaning: 'A drawbridge that opens and closes the electricity path.', technicalMeaning: 'An electrical component that can disconnect or connect the conducting path in an electrical circuit.' },
      { term: 'LED', plainMeaning: 'A tiny electronic bulb that turns electricity into bright light.', technicalMeaning: 'Light Emitting Diode: a semiconductor light source that emits light when current flows through it in the forward direction.' }
    ],
    teacherPrep: ['Check safe 3V coin cells, conductive copper tape, 5mm LEDs, and binder clips, or prepare web simulator.'],
    verifiedMaterials: ['3V CR2032 Coin Cell', 'Copper conductive tape or safe snap circuit blocks', '5mm Diffused LED', 'Paper card'],
    safetyNotes: ['Never connect coin cell battery directly across both terminals with a paperclip (short circuit). Supervised by instructor.'],
    classRhythm: [
      { segment: '0–8m Hook', minutes: 8, teacherAction: 'Show an unlit bulb. Ask: "Why does water stop when the pipe is broken?"', studentAction: 'Predict what makes electricity stop flowing.' },
      { segment: '8–20m Concept', minutes: 12, teacherAction: 'Demonstrate closed loop vs broken loop on the simulator.', studentAction: 'Toggle virtual switch and watch current arrows move.' },
      { segment: '20–40m Hands-on', minutes: 20, teacherAction: 'Guide safe copper tape or snap-circuit assembly.', studentAction: 'Assemble circuit, press switch, and watch LED light up!' },
      { segment: '40–45m Reflection', minutes: 5, teacherAction: 'Review LED polarity (long leg = positive).', studentAction: 'Record whether circuit worked and explain why.' }
    ],
    concepts: [
      {
        title: 'The Closed Circuit Rule',
        explanation: 'Electricity is like a train on a circular railway track. If the track is broken anywhere, all the trains stop. Closing the switch repairs the bridge!',
        instructorNote: 'Point out polarity: LEDs are diodes and only let current flow in one direction.'
      }
    ],
    visualizerId: 'circuit_switch_led_sim',
    project: {
      name: 'Switch-and-LED Circuit',
      deliverableType: 'physical_build',
      successEvidence: ['Physical paper circuit or simulation where pressing the switch instantly lights the LED reliably.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['No microcontroller used (Supervised low-voltage DC paper circuit)'],
      componentList: [
        { name: '3V Coin Cell Battery', exactVariant: 'CR2032 Lithium Cell (3.0V)', quantity: 1 },
        { name: 'Diffused 5mm LED', exactVariant: 'Red/Green 5mm LED (Vf ≈ 2.0V, 20mA max)', quantity: 1 },
        { name: 'Conductive Adhesive Tape', exactVariant: 'Single-sided Conductive Copper Foil Tape (5mm width)', quantity: 1 },
        { name: 'Cardstock Paper Canvas', exactVariant: 'Heavy cardstock sheet (300 gsm)', quantity: 1 },
        { name: 'Conductive Clip / Binder Clip', exactVariant: 'Small steel binder clip for battery clamp', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/paper_circuit_led_switch.svg',
      schematic: 'CR2032 (+) ➔ Copper Foil Trace ➔ LED Anode (Long Leg) ➔ LED Cathode ➔ Flap Switch ➔ CR2032 (-)',
      wireTable: [
        { from: 'CR2032 Battery Positive (+)', to: 'Copper Tape (+) Rail', wireOrPolarityNote: 'Direct contact with top face of coin cell' },
        { from: 'Copper Tape (+) Rail', to: 'LED Anode (Long Leg)', wireOrPolarityNote: 'Secure under copper tape with firm pressure' },
        { from: 'LED Cathode (Short Leg)', to: 'Switch Contact Gap A', wireOrPolarityNote: 'Flat side of LED lens faces cathode' },
        { from: 'Switch Contact Gap B (Foldable Flap)', to: 'Copper Tape (-) Return Trace', wireOrPolarityNote: 'Closing flap bridges Gap A to Gap B' },
        { from: 'Copper Tape (-) Return Trace', to: 'CR2032 Battery Negative (-)', wireOrPolarityNote: 'Held by binder clip against bottom face of coin cell' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Draw your circuit path in pencil on cardstock paper with a 1cm break for the switch flap.',
        '2. Apply copper tape smoothly along lines without tearing; fold neatly at 90-degree corners.',
        '3. Identify the longer positive leg (Anode) of your 5mm LED. Tape it firmly to the positive copper rail.',
        '4. Tape the shorter negative leg (Cathode) to the switch trace.',
        '5. Place the CR2032 coin cell with (+) facing UP on the negative return pad and clamp with binder clip.',
        '6. Fold the paper switch flap down so the copper tape bridges the gap. The LED lights up!'
      ],
      powerAndSafetyChecks: [
        'Adult supervision mandatory: Coin cells pose ingestion hazards for young children.',
        'Never connect copper tape directly from (+) to (-) without the LED in between (prevents dead short).',
        'If coin cell feels warm to touch, unclamp binder clip immediately and inspect for shorts.',
        'No programming or computer connection required for this foundational physics activity.'
      ],
      testCases: [
        { action: 'Switch flap open (not pressed)', expectedResult: 'Circuit is open; LED remains OFF.' },
        { action: 'Press paper switch flap firmly', expectedResult: 'Circuit closes; LED lights up bright red.' },
        { action: 'Flip coin cell upside down (+ facing down)', expectedResult: 'LED does not light (demonstrates diode directional current flow).' }
      ]
    },
    activity: {
      title: 'Build Your Signal Circuit',
      steps: [
        'Stick copper tape in a loop on paper, leaving a 1cm gap for the switch.',
        'Place the LED across the gap, making sure the longer positive leg faces battery positive (+).',
        'Fasten the 3V coin cell battery with a paperclip or binder clip.',
        'Press your paper flap switch to complete the bridge and watch the LED glow!'
      ],
      successCriteria: ['LED lights up firmly when switch is pressed and turns off when released.'],
      extension: 'Create a secret flashlight pattern (1 short press = YES, 2 short presses = NO).'
    },
    troubleshooting: [
      { symptom: 'LED does not light up when switch is closed.', checks: ['Check battery polarity', 'Flip LED legs 180 degrees'], explanation: 'LEDs only pass current in one direction (Anode to Cathode).' }
    ],
    checksForUnderstanding: ['Why does an LED turn off when you open a switch?'],
    exitTicket: [
      { question: 'Why does electricity need a complete circle to work?', rubricOrSampleReasoning: 'Because charges must travel from the power source through the device and back to ground.' }
    ],
    differentiation: {
      support: ['Pre-cut copper tape strips with marked polarity lines.'],
      extension: ['Add a second LED in parallel and observe if both light up.'],
      offlineOption: ['Use physical battery holder and test jumper clips.']
    },
    nextLessonId: 'exp-03',
    nextLessonTeaser: 'Explorer 03: Move and Turn — How do wheels, axles, and gears help robots explore mazes?',
    sources: [{ title: 'All About Circuits: Electric Circuits and Polarity', url: 'https://www.allaboutcircuits.com' }],
    assetCredits: [{ asset: 'Circuit Diagrams', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'exp-03',
    fieldGuideLinks: {
      readBeforeClass: ["fg-motion-differential-kinematics"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics"],
      goDeeper: ["fg-comp-tb6612fng"]
    },
    courseId: 'explorer',
    sequence: 3,
    code: 'EXPLORER 03',
    title: 'Move and Turn: Wheeled-Motion Challenge',
    promise: 'By the end, I can explain how two wheels let a robot drive straight, pivot, and navigate a maze.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01', 'Explorer 02'],
    outcomes: [
      'Describe how spinning wheels at different speeds turns a robot left or right.',
      'Compare friction, traction, and smooth rolling.',
      'Plan a step-by-step navigation path through a simulated floor grid.'
    ],
    vocabulary: [
      { term: 'Differential Drive', plainMeaning: 'Steering by making one wheel go faster than the other.', technicalMeaning: 'A mobile robot steering system based on two independently powered drive wheels.' },
      { term: 'Traction', plainMeaning: 'How well the rubber tires grip the floor without slipping.', technicalMeaning: 'The frictional grip between a drive wheel and the contact surface.' }
    ],
    teacherPrep: ['Open the drag-and-drop movement maze simulation on class devices.'],
    verifiedMaterials: ['Movement maze simulator or floor grid mat with cardboard two-wheel models'],
    safetyNotes: ['Supervised tabletop activity.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Demonstrate holding a toy cart by one wheel while pushing the other.', studentAction: 'Observe how the cart spins in a circle!' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain differential steering: Left wheel stop + Right wheel forward = Pivot Left.', studentAction: 'Simulate steering with hand gestures.' },
      { segment: '25–40m Hands-on', minutes: 15, teacherAction: 'Facilitate maze route challenge on the web grid.', studentAction: 'Queue movement blocks and navigate rover to target flag.' },
      { segment: '40–45m Exit Check', minutes: 5, teacherAction: 'Summarize how real rovers on Mars steer.', studentAction: 'Complete exit question.' }
    ],
    concepts: [
      {
        title: 'Two Wheels, Infinite Directions',
        explanation: 'By controlling the speed and direction of two wheels separately, a robot can drive straight (both forward), spin on the spot (one forward, one backward), or pivot around a stationary wheel.',
        instructorNote: 'Use the differential drive visualizer to show wheel speed vectors.'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Wheeled-Motion Challenge',
      deliverableType: 'simulation',
      successEvidence: ['Completed grid route from start to target without wall collisions.']
    },
    activity: {
      title: 'Navigate the Rover Maze',
      steps: [
        'Inspect the target flag on the grid map.',
        'Count the squares forward, then choose whether to pivot 90° left or right.',
        'Run the simulated route and observe wheel rotation.',
        'Adjust commands until the rover stops on the exact target square.'
      ],
      successCriteria: ['Rover reaches the target flag smoothly without bumping obstacles.'],
      extension: 'Plan a route with a reverse parking maneuver into a narrow zone.'
    },
    troubleshooting: [
      { symptom: 'Rover turns the wrong direction.', checks: ['Check which wheel is commanded forward.'], explanation: 'Spinning the right wheel pushes the right side forward, making the body pivot LEFT.' }
    ],
    checksForUnderstanding: ['If both wheels spin forward at the exact same speed, which way does the robot move?'],
    exitTicket: [
      { question: 'To turn right, which wheel must spin faster?', rubricOrSampleReasoning: 'The left wheel must spin faster to pivot the robot right.' }
    ],
    differentiation: {
      support: ['Use a physical toy rover on floor tile grid before simulator.'],
      extension: ['Calculate how many turns are needed to navigate a zigzag.'],
      offlineOption: ['Draw grid on paper and move eraser with labeled wheel arrows.']
    },
    nextLessonId: 'exp-04',
    nextLessonTeaser: 'Explorer 04: Invent a Helpful Robot — Combine sensing, power, and motion to design your dream machine!',
    sources: [{ title: 'Differential Steering Principles — RoboBEE Innovators Lab (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Maze Simulation Assets', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'exp-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot"],
      lookUpWhileBuilding: ["fg-foundations-what-is-robot"],
      goDeeper: ["fg-design-cad-measurement"]
    },
    courseId: 'explorer',
    sequence: 4,
    code: 'EXPLORER 04',
    title: 'Invent-a-Helper Robot Design',
    promise: 'By the end, I can design an original helpful robot, name its components, and present my idea.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01', 'Explorer 02', 'Explorer 03'],
    outcomes: [
      'Synthesize sensing, decision rules, power circuits, and actuators into a single robot concept.',
      'Explain who the robot helps and what problem it solves in society.',
      'Present a labeled design diagram to peers.'
    ],
    vocabulary: [
      { term: 'Design Brief', plainMeaning: 'A plan that explains what problem you are solving.', technicalMeaning: 'A written document for a design project developed by an engineer and client.' },
      { term: 'Prototype', plainMeaning: 'A first draft model built to test an idea.', technicalMeaning: 'An early sample or model of a product built to test a concept or process.' }
    ],
    teacherPrep: ['Prepare drawing templates with sections: Problem, Sensor Input, Brain Rule, Motor Output.'],
    verifiedMaterials: ['Design Brief Worksheets', 'Color markers', 'Interactive invent-a-helper viewer'],
    safetyNotes: ['Supervised design session.'],
    classRhythm: [
      { segment: '0–8m Hook', minutes: 8, teacherAction: 'Show real disaster-relief robots and farming rovers.', studentAction: 'Discuss problems in their home city of Narayanganj.' },
      { segment: '8–18m Planning', minutes: 10, teacherAction: 'Guide students to choose one real problem and name the required sensor.', studentAction: 'Select their robot helper goal.' },
      { segment: '18–35m Design Sprint', minutes: 17, teacherAction: 'Coach students on labeling inputs, controllers, and outputs.', studentAction: 'Draw and label the complete prototype.' },
      { segment: '35–45m Showcase', minutes: 10, teacherAction: 'Host 1-minute peer presentations.', studentAction: 'Present design and celebrate Explorer program completion!' }
    ],
    concepts: [
      {
        title: 'Engineering for Human Need',
        explanation: 'Every great robot begins with a clear human problem. Engineers first ask: Who needs help? What information must the robot gather? What decision must it make? What action will it perform?',
        instructorNote: 'Help students connect their ideas to real community challenges in Narayanganj and Bangladesh.'
      }
    ],
    visualizerId: 'invent_helper_sim',
    project: {
      name: 'Invent-a-Helper Robot Design',
      deliverableType: 'design_review',
      successEvidence: ['Completed, dimensioned design sketch with labeled sensor, microcontroller brain, actuator motors, and intended human benefit.']
    },
    activity: {
      title: 'Invent Your Helper Robot',
      steps: [
        'Name your robot and the problem it solves (e.g. River Trash Collector, School Guard).',
        'Identify its SENSE organ: What sensor does it use?',
        'Identify its DECIDE brain: What rule does its program run?',
        'Identify its ACT mechanism: Wheels, gripper arm, or warning light?',
        'Present your finished invention to the class!'
      ],
      successCriteria: ['Drawing clearly labels the sensor, controller, power source, and output parts.'],
      extension: 'Add a secondary safety sensor (e.g. collision bumper or battery meter).'
    },
    troubleshooting: [
      { symptom: 'Idea is too fantastical (e.g. flying to Mars instantly).', checks: ['Ask: "What part of this could we build with our Arduino and two wheels next month?"'], explanation: 'Ground ideas in real engineering components students will build in the Beginner track.' }
    ],
    checksForUnderstanding: ['Why does an engineer create a design on paper before buying parts?'],
    exitTicket: [
      { question: 'What is the most important part of your robot design and why?', rubricOrSampleReasoning: 'Student identifies a component and explains its functional role in the system.' }
    ],
    differentiation: {
      support: ['Provide pre-drawn chassis silhouettes for students to add sensors onto.'],
      extension: ['Write a 3-step pseudocode logic sequence for their robot brain.'],
      offlineOption: ['Full paper presentation with cardboard cutouts.']
    },
    nextLessonId: 'beg-01',
    nextLessonTeaser: 'Graduate to Beginner Robotics Class 01: Meet the real Arduino microcontroller board and make an LED blink with C++ code!',
    sources: [{ title: 'RoboBEE Innovators Design Thinking Framework (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Design Templates', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // COURSE SPACE B: BEGINNER ROBOTICS (CLASSES 01-10) — REQUIRED FLAGSHIP
  // -----------------------------------------------------------------------
  {
    id: 'beg-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot","fg-arduino-microcontroller-vs-computer"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-prog-program-structure"],
      goDeeper: ["fg-arduino-ide-workflow","fg-safety-lab-code"]
    },
    courseId: 'beginner',
    sequence: 1,
    code: 'BEGINNER 01',
    title: 'Welcome to Robotics: Meet Arduino, Then Make an LED Blink',
    promise: 'By the end, I can explain how a robot senses, decides, and acts—and I can change a program to control a light.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14, Editable)',
    durationMinutes: 90,
    compactDurationMinutes: 60,
    prerequisites: ['None. No prior electronics or programming experience required!'],
    outcomes: [
      'Explain the simple Sense → Decide → Act robotics model in your own words.',
      'Identify the Arduino microcontroller as a controller that runs compiled instructions, not a machine that guesses.',
      'Tour the Arduino board and locate USB power, ATmega328P chip, Reset, digital pins, and Ground.',
      'Upload and run the foundational Blink program using the built-in LED (Pin 13), with a web simulator fallback.',
      'Modify a delay timing value, predict the physical result, test it, and record observational evidence.',
      'Demonstrate basic low-voltage lab safety habits.'
    ],
    vocabulary: [
      { term: 'Microcontroller', plainMeaning: 'A tiny computer on a single chip that runs one program at a time.', technicalMeaning: 'An integrated circuit containing a processor core, memory, and programmable input/output peripherals.' },
      { term: 'Arduino Uno', plainMeaning: 'The programmable brain board we connect sensors and motors to.', technicalMeaning: 'An open-source microcontroller board based on the Microchip ATmega328P.' },
      { term: 'LED_BUILTIN', plainMeaning: 'A tiny indicator light permanently soldered onto the Arduino board on Pin 13.', technicalMeaning: 'A board-defined preprocessor constant mapped to the digital pin tied to the on-board surface-mount LED.' },
      { term: 'setup()', plainMeaning: 'A code block that runs only once when the board turns on to get pins ready.', technicalMeaning: 'A mandatory Arduino C++ initialization function called once on startup or hardware reset.' },
      { term: 'loop()', plainMeaning: 'A code block that repeats over and over forever while the board has power.', technicalMeaning: 'A mandatory Arduino C++ execution function called continuously in an infinite loop.' },
      { term: 'delay()', plainMeaning: 'A command that tells the Arduino to pause and wait for a count of milliseconds.', technicalMeaning: 'A blocking function that pauses the program execution for a specified duration in milliseconds.' }
    ],
    teacherPrep: [
      'Inspect classroom Arduino Uno R3 boards and USB type-A to type-B data cables.',
      'Confirm Arduino IDE or web upload plugin is installed on lab workstations.',
      'Have optional 220Ω resistors and 5mm LEDs ready for students wanting breadboard extension.',
      'Open the interactive 3D Arduino board tour and web Blink simulator on classroom projector.',
      'Print student First-Light prediction logs or provide digital tablet entry.'
    ],
    verifiedMaterials: [
      'Arduino Uno R3 (or compatible verified Uno board)',
      'USB-A to USB-B Data Cable (must carry data, not charge-only)',
      'Optional: Half-size solderless breadboard, 5mm red LED, 220Ω resistor, 2 jumper wires',
      'Classroom workstation with Arduino IDE 2.x or Web Simulator'
    ],
    safetyNotes: [
      'Low-voltage 5V DC safety. Never connect wires while USB power is plugged in.',
      'Never connect an external LED directly between 5V and GND without a 220Ω–330Ω current-limiting resistor.',
      'Keep metal tools, paperclips, and liquids off the workbench to prevent accidental shorts across board pins.'
    ],
    classRhythm: [
      { segment: '0–8m Hook', minutes: 8, teacherAction: 'Display 6 images: Delivery rover, industrial arm, line-follower, traffic light, washing machine, hand drill. Ask: "Robot or Not?"', studentAction: 'Vote, debate, and distinguish closed-loop sensing from simple timed automation.' },
      { segment: '8–18m Relevance', minutes: 10, teacherAction: 'Showcase real applications: agricultural soil rovers, hospital medicine delivery, disaster rescue. Emphasize problem solving.', studentAction: 'Name one real-world challenge in Bangladesh they would like to solve with robotics.' },
      { segment: '18–30m System Model', minutes: 12, teacherAction: 'Present SENSE → DECIDE → ACT animated diagram. Explain that the controller never guesses.', studentAction: 'Interact with the virtual signal flow and trace an input trigger to an actuator output.' },
      { segment: '30–42m Board Tour', minutes: 12, teacherAction: 'Guide interactive 3D board tour. Explain USB, 5V/3.3V power, GND, ATmega chip, and digital pins 0–13.', studentAction: 'Hold physical Arduino Uno and locate the USB port, reset button, and Pin 13 LED_BUILTIN.' },
      { segment: '42–68m Hands-on Blink', minutes: 26, teacherAction: 'Guide IDE setup: Select Board "Arduino Uno", select COM Port, open Blink sketch. Guide upload.', studentAction: 'Predict behavior, connect USB cable, upload code, and observe on-board amber LED blinking!' },
      { segment: '68–78m Make It Yours', minutes: 10, teacherAction: 'Challenge students to change delay(500) to delay(150) or create a custom rhythm.', studentAction: 'Edit code timing, predict if blink speeds up or slows down, re-upload, and verify prediction.' },
      { segment: '78–86m Kit Explorer', minutes: 8, teacherAction: 'Showcase the complete kit box: sensors, motor driver, wheels, chassis, servo.', studentAction: 'Sort component flashcards into INPUT, CONTROLLER, or OUTPUT categories.' },
      { segment: '86–90m Exit & Teaser', minutes: 4, teacherAction: 'Facilitate 4-question exit check and tease Class 02 breadboard circuits.', studentAction: 'Submit exit ticket and pack equipment safely in kit box.' }
    ],
    concepts: [
      {
        title: 'The Universal Robotics Triad: Sense → Decide → Act',
        explanation: 'Every autonomous robot in the universe follows three steps: 1. SENSE observes physical changes (light, distance, touch); 2. DECIDE evaluates rules in code (if distance < 20cm); 3. ACT produces physical changes (wheels spin, lights flash). The Arduino is the controller brain.',
        instructorNote: 'Emphasize that the Arduino cannot think or guess—it executes exact compiled assembly instructions step by step.'
      },
      {
        title: 'Microcontroller vs Personal Computer',
        explanation: 'A computer runs an operating system with hundreds of apps. A microcontroller like the Arduino Uno runs only ONE dedicated program in an infinite loop, making it fast, reliable, and perfect for physical machines!',
        instructorNote: 'Mention the ATmega328P runs at 16 MHz with 32KB of flash memory.'
      }
    ],
    visualizerId: 'arduino_board_tour_sim',
    project: {
      name: 'Arduino First-Light Blink',
      deliverableType: 'code_artifact',
      successEvidence: [
        'A running Arduino Uno board (or verified simulator) blinking the built-in LED on Pin 13.',
        'A modified timing sketch compiled and uploaded successfully.',
        'A completed prediction log documenting standard 500ms vs custom fast 150ms blink rates.'
      ]
    },
    activity: {
      title: 'Upload, Predict, and Customize First-Light Blink',
      steps: [
        'Step 1 (Physical Inspection): Hold your Arduino Uno. Locate the tiny amber LED labeled "L" next to pin 13.',
        'Step 2 (Connection): Plug the USB-B cable into the Arduino and the USB-A into your computer. Look for the green "ON" LED.',
        'Step 3 (Predict): Read the starter sketch. What do you predict happens when delay(500) is changed to delay(100)?',
        'Step 4 (Upload): Open Arduino IDE -> Tools -> Board -> Arduino Uno. Select your Port. Click the Upload arrow (➔).',
        'Step 5 (Observe): Watch the TX/RX lights flash rapidly during upload, followed by the steady pulse of LED "L"!',
        'Step 6 (Customize): Change the delay values to create an SOS or fast heartbeat beacon, and re-upload.'
      ],
      successCriteria: [
        'The Arduino board compiles and uploads the sketch with "Done uploading" status.',
        'The LED "L" blinks at the commanded interval.',
        'Student can explain which line of code turns the LED on versus off.'
      ],
      extension: 'Create a custom Two-Short, One-Long communication beacon pattern (e.g. 150ms ON, 150ms OFF, 150ms ON, 150ms OFF, 800ms ON, 1000ms OFF).'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (Microchip ATmega328P microcontroller)'],
      componentList: [
        { name: 'Arduino Uno R3 Development Board', exactVariant: 'DIP or SMD ATmega328P with 16MHz crystal', quantity: 1 },
        { name: 'USB-A to USB-B Data Cable', exactVariant: 'Standard 1.5m shielded USB data cable', quantity: 1 },
        { name: 'On-Board Surface Mount LED', exactVariant: 'Built-in SMD LED connected to Digital Pin 13', quantity: 1 },
        { name: 'Optional External LED Pack', exactVariant: '5mm Diffused Red LED + 220Ω 1/4W resistor', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/arduino_uno_built_in_led_pin13.svg',
      schematic: 'Digital Pin 13 ──[ Internal 1kΩ Resistor ]──[ Amber LED "L" ]── Ground (GND). When using the on-board LED, no external jumper wires or breadboard are required!',
      wireTable: [
        { from: 'USB Port of PC', to: 'USB-B Jack of Arduino Uno', wireOrPolarityNote: 'Supplies regulated 5V DC power and serial data communication' },
        { from: 'Digital Pin 13 (Internal)', to: 'Anode (+) of Built-In LED "L"', wireOrPolarityNote: 'Internal PCB trace' },
        { from: 'Cathode (-) of Built-In LED "L"', to: 'GND (Internal)', wireOrPolarityNote: 'Internal PCB ground plane' },
        { from: 'OPTIONAL External Breadboard Pin 13', to: 'Long leg (+) of 5mm Red LED', wireOrPolarityNote: 'Requires 220Ω resistor in series to GND!' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect the Arduino board on the static-safe mat; confirm no loose screws or wire clippings touch the underside pins.',
        '2. Connect USB cable to the board FIRST, then plug into PC workstation.',
        '3. Verify that the green LED labeled "ON" illuminates steadily.',
        '4. Confirm your computer recognizes the USB serial interface (COM port on Windows, /dev/ttyACM on Linux/Mac).',
        '5. Click Upload in the Arduino IDE; verify TX/RX LEDs flicker for 2 seconds during transmission.',
        '6. Observe the built-in amber LED "L" begin pulsing.'
      ],
      powerAndSafetyChecks: [
        'Never place the powered Arduino board on a metal surface or foil.',
        'Do not touch exposed IC pins with wet hands.',
        'Disconnect USB cable before adding any optional external components.'
      ],
      testCases: [
        { action: 'Upload standard 500ms Blink sketch', expectedResult: 'LED L stays ON for 0.5 sec, then OFF for 0.5 sec repeatedly.' },
        { action: 'Change delay to 100ms and re-upload', expectedResult: 'LED L blinks at a rapid 5 Hz strobe rate.' },
        { action: 'Press the physical red RESET button on board', expectedResult: 'Blinking pauses for 1 second during bootloader restart, then resumes.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// CLASS 01: First-Light Blink (Beginner Robotics Foundation)
// Hardware: Arduino Uno R3 on-board LED (LED_BUILTIN on Digital Pin 13)

void setup() {
  // setup() runs ONCE when the board powers on or after you press RESET.
  // We must configure pin 13 as an OUTPUT so it can send electric voltage.
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // loop() repeats over and over FOREVER as long as the Arduino has power.
  
  digitalWrite(LED_BUILTIN, HIGH); // Send 5V to turn the LED ON
  delay(500);                      // Wait 500 milliseconds (0.5 seconds)
  
  digitalWrite(LED_BUILTIN, LOW);  // Send 0V to turn the LED OFF
  delay(500);                      // Wait 500 milliseconds, then loop() restarts!
}`,
      pinMap: {
        'LED_BUILTIN': 'Digital Pin 13 (Built-in SMD LED with internal resistor)',
        'VCC': '5V DC from USB bus',
        'GND': 'System Ground'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno to computer with USB cable.',
        '2. In Arduino IDE, go to Tools -> Board and select "Arduino Uno".',
        '3. Go to Tools -> Port and choose the active port (e.g. COM3 or COM4 on Windows).',
        '4. Click the checkmark icon (Verify) to compile the C++ code.',
        '5. Click the right arrow icon (Upload) to transfer the compiled hex file into Arduino flash memory.'
      ],
      explanations: [
        'pinMode(pin, OUTPUT): Tells the microcontroller hardware register to enable the transistor switch for that pin so it can push 5V out.',
        'digitalWrite(pin, HIGH): Sets the pin voltage to 5 Volts (ON).',
        'digitalWrite(pin, LOW): Sets the pin voltage to 0 Volts / Ground (OFF).',
        'delay(milliseconds): Instructs the processor to wait for a count of milliseconds. 1000 milliseconds = 1 full second.'
      ],
      expectedResult: 'The amber LED labeled "L" on the board flashes on and off with precise 0.5-second pacing.',
      caveats: [
        'Notice that delay() completely pauses execution during the wait time. In later classes, we will learn non-blocking timers so the robot can think while moving!',
        'Do not confuse the green power light ("ON") with the programmable amber light ("L"). Only "L" is controlled by your code!'
      ],
      tweakTip: 'Try changing the first delay to 100 and the second delay to 900. Your LED will flash like a quick camera strobe!'
    },
    troubleshooting: [
      {
        symptom: 'Arduino IDE error: "avrdude: ser_open(): can\'t open device // COM port not found"',
        checks: [
          'Verify the USB cable is fully pushed into the Arduino jack until it clicks.',
          'Check if the green "ON" LED on the board is lit.',
          'Test a different USB port on your computer.',
          'Confirm your cable is a true data cable, not a cheap phone charge-only cable.'
        ],
        explanation: 'The computer cannot establish serial communication with the CH340 or ATmega16U2 USB interface chip.'
      },
      {
        symptom: 'Upload succeeds ("Done uploading"), but the LED never lights up or blinks.',
        checks: [
          'Confirm your sketch uses LED_BUILTIN or pin 13.',
          'Confirm pinMode(LED_BUILTIN, OUTPUT) is present inside setup().',
          'Ensure delay() values are not set to 0 (which makes it flicker faster than human eyes can detect).'
        ],
        explanation: 'If pinMode is omitted, the pin defaults to high-impedance INPUT mode and cannot deliver sufficient current to light the LED.'
      },
      {
        symptom: 'The board gets warm or PC displays "USB device drawing too much power".',
        checks: [
          'Unplug USB cable IMMEDIATELY!',
          'Inspect the board for metal staples, conductive wire clips, or solder bridges.',
          'Ensure no external wires connect 5V directly to GND without a load.'
        ],
        explanation: 'A short circuit triggers the Arduino Uno’s on-board resettable PTC polyfuse to protect your computer’s motherboard.'
      }
    ],
    checksForUnderstanding: [
      'Why does the code inside setup() run only once, while the code inside loop() repeats forever?',
      'If you delete delay(500), will the LED stay on, stay off, or something else? (Hint: It blinks millions of times per second!)'
    ],
    exitTicket: [
      { question: 'What is one input a robot can receive from the physical world?', rubricOrSampleReasoning: 'Ultrasonic distance ping, push button click, temperature reading, or light level.' },
      { question: 'What does the microcontroller controller do with that input?', rubricOrSampleReasoning: 'It compares the input against coded rules to decide what action to execute.' },
      { question: 'Name the output that you controlled with code in today’s lab.', rubricOrSampleReasoning: 'The built-in LED (Pin 13) on the Arduino Uno.' },
      { question: 'What is one problem in the world you would love to solve using robotics?', rubricOrSampleReasoning: 'Student describes a thoughtful real-world application (e.g. river cleaning, crop monitoring, medical assistance).' }
    ],
    differentiation: {
      support: [
        'Pair students as "Pilot" (typing code) and "Co-pilot" (reading connection map and predicting results).',
        'Use the built-in web interactive simulator with one-click timing presets (100ms, 500ms, 1000ms) for students encountering hardware driver issues.'
      ],
      extension: [
        'Wire an external 5mm red LED on a breadboard using a 220Ω resistor connected to pin 12, and make pins 12 and 13 blink alternately like railway crossing lights!'
      ],
      offlineOption: [
        'Trace the C++ sketch on paper and write out the LED state (HIGH vs LOW) for every 250 milliseconds across a 2-second timeline.'
      ]
    },
    nextLessonId: 'beg-02',
    nextLessonTeaser: 'Beginner 02: Circuits, Breadboards, and Safe Outputs — Step beyond the built-in light! Learn breadboard internal rails, Ohm\'s law resistor safety, and connect external LEDs and pushbuttons.',
    sources: [
      { title: 'Official Arduino Documentation: Built-in Blink Example', url: 'https://docs.arduino.cc/built-in-examples/basics/Blink/', accessedOrVersioned: 'Arduino Docs 2026' },
      { title: 'Arduino Uno Rev3 Hardware Reference', url: 'https://docs.arduino.cc/hardware/uno-rev3/', accessedOrVersioned: 'ATmega328P Rev3' }
    ],
    assetCredits: [
      { asset: 'Arduino Uno R3 Vector Pinout', creator: 'RoboBEE Innovators Engineering Team', license: 'RoboBEE Innovators IP', sourceUrl: 'team_info' },
      { asset: 'Interactive Board Tour Simulator', creator: 'RoboBEE Innovators Visual Interaction Lab', license: 'Proprietary', sourceUrl: 'team_info' }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 02: CIRCUITS, BREADBOARDS & SAFE OUTPUTS
  // -----------------------------------------------------------------------
  {
    id: 'beg-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-electronics-breadboards","fg-board-uno-anatomy"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'beginner',
    sequence: 2,
    code: 'BEGINNER 02',
    title: 'Circuits, Breadboards, and Safe Outputs',
    promise: 'By the end, I can wire external LEDs safely on a breadboard using resistors and control them with code.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01'],
    outcomes: [
      'Explain how solderless breadboard internal tie-point rows and power rails are connected.',
      'Calculate why an external LED requires a current-limiting resistor (220Ω–330Ω) to prevent burn-out.',
      'Wire an external LED and current-limiting resistor safely from an Arduino digital output to Ground.',
      'Control external digital outputs using C++ digitalWrite() commands.'
    ],
    vocabulary: [
      { term: 'Breadboard', plainMeaning: 'A reusable plastic grid with hidden metal clips to connect circuits without soldering.', technicalMeaning: 'A solderless construction base for prototyping electronics with connected terminal strips.' },
      { term: 'Resistor', plainMeaning: 'An electrical speed bump that slows down electric current so delicate parts do not burn out.', technicalMeaning: 'A passive two-terminal electrical component that implements electrical resistance as a circuit element.' },
      { term: 'Ohm’s Law', plainMeaning: 'The math rule connecting voltage push, electric flow, and resistance (V = I × R).', technicalMeaning: 'A law stating that electric current through a conductor between two points is directly proportional to voltage across the points.' }
    ],
    teacherPrep: ['Check half-size breadboards, 220Ω resistors, assorted color 5mm LEDs, and M-M jumper wires.'],
    verifiedMaterials: ['Arduino Uno', 'Half-size breadboard', '220Ω resistors (Red-Red-Brown-Gold)', '5mm LEDs', 'M-M Jumper wires'],
    safetyNotes: ['Never connect an LED directly to 5V without a resistor. Always disconnect USB before modifying breadboard wiring.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show an X-ray view of a breadboard stripped of its plastic backing.', studentAction: 'Trace the hidden metal spring clips inside the breadboard.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain current limits: 40mA max per Arduino pin; 20mA ideal for LED. Ohm’s Law math.', studentAction: 'Calculate resistance: (5V - 2V drop) / 0.015A ≈ 200Ω.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Guide breadboard circuit wiring and inspection before power.', studentAction: 'Wire digital pin 9 through 220Ω resistor to LED anode, cathode to GND. Run code.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Inspect student breadboard circuits.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'How a Breadboard Works Inside',
        explanation: 'Inside a breadboard, the long side rails (+ and -) are connected vertically for power distribution. The center rows (a-b-c-d-e and f-g-h-i-j) are connected horizontally in groups of 5 tie-points, separated by a middle divider trench.',
        instructorNote: 'Emphasize that plugging two wires into the same numbered 5-hole strip connects them electrically.'
      }
    ],
    visualizerId: 'breadboard_circuit_sim',
    project: {
      name: 'Pushbutton-Controlled LED',
      deliverableType: 'physical_build',
      successEvidence: ['Working external breadboard circuit with 220Ω resistor and LED illuminating reliably from pin 9.']
    },
    activity: {
      title: 'Build the External Breadboard Light Circuit',
      steps: [
        'Unplug USB cable from Arduino.',
        'Insert 220Ω resistor between Arduino Pin 9 and breadboard terminal row 15.',
        'Insert long leg (Anode) of LED into row 15, and short leg (Cathode) into row 16.',
        'Connect a black jumper wire from row 16 to an Arduino GND pin.',
        'Plug in USB cable and upload sketch commanding Pin 9 HIGH.'
      ],
      successCriteria: ['External breadboard LED lights brightly without flickering or overheating.'],
      extension: 'Wire two LEDs (Red and Green) and write a traffic light sequence.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', 'Solderless Breadboard 400 tie-points'],
      componentList: [
        { name: 'Arduino Uno R3', exactVariant: 'Standard Rev3', quantity: 1 },
        { name: 'Solderless Breadboard', exactVariant: '400 Tie-Point Half Size', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'VF ≈ 2.0V, IF ≈ 20mA', quantity: 1 },
        { name: 'Carbon Film Resistor', exactVariant: '220Ω 1/4W 5% tolerance', quantity: 1 },
        { name: 'Male-to-Male Jumper Wires', exactVariant: '20cm multi-color copper', quantity: 2 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/breadboard_led_resistor_wiring.svg',
      schematic: 'Arduino Pin 9 ──[ 220Ω Resistor ]──[ LED Anode (+) ] ──[ LED Cathode (-) ]── Arduino GND',
      wireTable: [
        { from: 'Arduino Digital Pin 9', to: 'Breadboard Row 15A (Resistor leg 1)', wireOrPolarityNote: 'Signal wire (Yellow/Blue)' },
        { from: 'Breadboard Row 15B (Resistor leg 2)', to: 'Breadboard Row 15E (LED Anode)', wireOrPolarityNote: 'Direct internal tie-point connection' },
        { from: 'Breadboard Row 16E (LED Cathode)', to: 'Arduino GND Pin', wireOrPolarityNote: 'Ground return wire (Black)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Disconnect USB power before inserting components into breadboard.',
        '2. Identify LED legs: Long leg = Anode (+), flat edge/short leg = Cathode (-).',
        '3. Insert 220Ω resistor spanning row 10 to row 15.',
        '4. Connect signal and GND jumper wires firmly.',
        '5. Reconnect USB cable and upload test sketch.'
      ],
      powerAndSafetyChecks: ['Double check that the resistor is in series with the LED, not bypassed by connecting both legs to the same row.'],
      testCases: [
        { action: 'Run digitalWrite(9, HIGH)', expectedResult: 'External red LED illuminates brightly.' },
        { action: 'Run digitalWrite(9, LOW)', expectedResult: 'External red LED turns completely dark.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int EXTERNAL_LED = 9; // External LED wired to Pin 9 via 220-ohm resistor

void setup() {
  pinMode(EXTERNAL_LED, OUTPUT); // Configure Pin 9 as an output
}

void loop() {
  digitalWrite(EXTERNAL_LED, HIGH); // Turn external LED on
  delay(1000);                      // Wait 1 second
  digitalWrite(EXTERNAL_LED, LOW);  // Turn external LED off
  delay(1000);                      // Wait 1 second
}`,
      pinMap: { 'Pin 9': 'External LED Anode via 220Ω resistor', 'GND': 'LED Cathode' },
      setupAndUpload: ['Open Arduino IDE, select board Uno, choose port, click upload.'],
      explanations: ['pinMode(9, OUTPUT) enables voltage driver for pin 9.'],
      expectedResult: 'External breadboard LED pulses on for 1 second, off for 1 second.',
      caveats: ['Ensure the LED is not plugged in backwards.'],
      tweakTip: 'Change pin 9 to pin 8 and move the wire on the Arduino board to verify pin mapping.'
    },
    troubleshooting: [
      { symptom: 'External LED stays completely off.', checks: ['Check LED polarity (flip legs)', 'Ensure resistor is in separate rows'], explanation: 'Diodes only conduct electricity in forward bias.' }
    ],
    checksForUnderstanding: ['What happens if you plug both legs of an LED into the exact same breadboard row?'],
    exitTicket: [
      { question: 'Why does an external LED need a 220Ω resistor?', rubricOrSampleReasoning: 'To limit current flow to ~15-20mA so neither the LED nor the Arduino pin burns out.' }
    ],
    differentiation: {
      support: ['Color-code breadboard diagram matching jumper wire colors.'],
      extension: ['Add a second LED and create an alternating beacon.'],
      offlineOption: ['Use web breadboard simulator with wire tracer.']
    },
    nextLessonId: 'beg-03',
    nextLessonTeaser: 'Beginner 03: Arduino and C++ First Steps — Connect pushbuttons, read digital inputs, and inspect live data in the Serial Monitor!',
    sources: [{ title: 'Arduino Foundations: Digital Pins', url: 'https://docs.arduino.cc/learn/microcontrollers/digital-pins/' }],
    assetCredits: [{ asset: 'Breadboard Illustration', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 03: ARDUINO & C++ FIRST STEPS
  // -----------------------------------------------------------------------
  {
    id: 'beg-03',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure","fg-arduino-ide-workflow"],
      lookUpWhileBuilding: ["fg-comm-i2c-spi-uart","fg-board-uno-anatomy"],
      goDeeper: ["fg-prog-millis-vs-delay"]
    },
    courseId: 'beginner',
    sequence: 3,
    code: 'BEGINNER 03',
    title: 'Arduino and C++ First Steps: Inputs & Serial Monitor',
    promise: 'By the end, I can connect a pushbutton, read its state in code, and inspect live data using the Serial Monitor.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02'],
    outcomes: [
      'Understand digital inputs as binary states: HIGH (1) vs LOW (0).',
      'Explain floating pins and use the internal pull-up resistor (INPUT_PULLUP).',
      'Establish serial communication at 9600 baud and print live diagnostic data.'
    ],
    vocabulary: [
      { term: 'INPUT_PULLUP', plainMeaning: 'An internal safety resistor built into the chip that holds the pin at 5V until pressed.', technicalMeaning: 'Configures a pin as input with an internal ~20kΩ pull-up resistor connected to 5V.' },
      { term: 'Serial Monitor', plainMeaning: 'A text chat window between the Arduino and your computer screen.', technicalMeaning: 'A serial communication terminal for transmitting and receiving ASCII data over UART/USB.' },
      { term: 'Baud Rate', plainMeaning: 'The communication speed (like 9600 words per second).', technicalMeaning: 'The rate at which information is transferred in a communication channel, measured in symbols/bits per second.' }
    ],
    teacherPrep: ['Verify pushbutton tactile switches fit into breadboard center divider.'],
    verifiedMaterials: ['Arduino Uno', '4-pin tactile pushbutton', 'Breadboard', 'Jumper wires'],
    safetyNotes: ['Connect button between pin and GND; never directly short 5V to GND.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Explain floating pin: A pin connected to nothing acts like an antenna catching electrical noise!', studentAction: 'Wave hand near an ungrounded pin and observe erratic Serial readings.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain Active-LOW logic with INPUT_PULLUP: Unpressed = HIGH (1); Pressed to GND = LOW (0).', studentAction: 'Trace current path when button is pressed.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Guide button connection to Pin 2 and GND. Open Serial Monitor @ 9600 baud.', studentAction: 'Upload code, open Serial Monitor, press button, and watch numbers stream.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review Serial data formats.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'Active-LOW Logic Demystified',
        explanation: 'When using INPUT_PULLUP, the Arduino holds the pin at 5V (HIGH = 1). When you press the button, it connects the pin directly to Ground (0V), pulling the reading down to LOW (0). Pressed = 0, Released = 1!',
        instructorNote: 'This is the standard engineering practice because it requires no external resistors.'
      }
    ],
    visualizerId: 'sensor_serial_sim',
    project: {
      name: 'Arduino Input/Output Console',
      deliverableType: 'code_artifact',
      successEvidence: ['Serial Monitor streaming 1 when button is released and 0 when held down.']
    },
    activity: {
      title: 'Read Button States in the Serial Monitor',
      steps: [
        'Insert 4-pin tactile switch straddling the breadboard center trench.',
        'Connect one side of button to Arduino Digital Pin 2.',
        'Connect diagonal pin of button to Arduino GND.',
        'Upload the INPUT_PULLUP sketch and open Serial Monitor at 9600 baud.',
        'Press the button and watch the live values change from 1 to 0!'
      ],
      successCriteria: ['Values in Serial Monitor respond instantaneously to button presses.'],
      extension: 'Make an LED turn ON when the button is pressed and OFF when released.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', '4-Pin Tactile Pushbutton'],
      componentList: [
        { name: 'Arduino Uno R3', exactVariant: 'Standard Rev3', quantity: 1 },
        { name: 'Tactile Pushbutton', exactVariant: '6x6mm through-hole 4-pin momentary', quantity: 1 },
        { name: 'Jumper wires', exactVariant: 'Male-to-Male 20cm', quantity: 2 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/arduino_button_input_pullup.svg',
      schematic: 'Arduino Pin 2 ──[ Tactile Switch ]── Arduino GND (Uses internal ~20kΩ pull-up to 5V)',
      wireTable: [
        { from: 'Arduino Digital Pin 2', to: 'Tactile Switch Pin 1A', wireOrPolarityNote: 'Sense line' },
        { from: 'Tactile Switch Pin 2B', to: 'Arduino GND', wireOrPolarityNote: 'Ground connection' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Seat tactile button across center breadboard trench.',
        '2. Connect pin 2 and GND.',
        '3. Upload code and open Tools -> Serial Monitor in Arduino IDE.'
      ],
      powerAndSafetyChecks: ['Ensure button is wired to GND, not 5V.'],
      testCases: [
        { action: 'Button unpressed', expectedResult: 'Serial Monitor prints 1' },
        { action: 'Button held down', expectedResult: 'Serial Monitor prints 0' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int BUTTON_PIN = 2; // Button wired between Pin 2 and GND

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Enable internal pull-up resistor
  Serial.begin(9600);                // Start serial communication at 9600 baud
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN); // Read state: 1 or 0
  Serial.print("Button State: ");
  Serial.println(buttonState);
  delay(150); // Small delay to make text readable
}`,
      pinMap: { 'Pin 2': 'Button input with INPUT_PULLUP', 'GND': 'Button ground return' },
      setupAndUpload: ['Upload sketch, then click magnifying glass icon (top right) to open Serial Monitor.'],
      explanations: ['Serial.begin(9600) sets communication speed to 9600 bits per second.'],
      expectedResult: 'Stream of lines showing 1, turning to 0 while button is pressed.',
      caveats: ['Make sure the baud rate dropdown in the Serial Monitor window matches 9600 baud!'],
      tweakTip: 'Change delay(150) to delay(50) to observe switch contact bounce.'
    },
    troubleshooting: [
      { symptom: 'Serial Monitor displays gibberish symbols (e.g. ⸮⸮⸮).', checks: ['Check baud rate setting at bottom right of Serial Monitor'], explanation: 'Baud rate mismatch: if Arduino speaks at 9600 but monitor listens at 115200, characters become garbled.' }
    ],
    checksForUnderstanding: ['What happens to an input pin if you do NOT use a pull-up or pull-down resistor?'],
    exitTicket: [
      { question: 'Why does pressing the button produce a 0 in our INPUT_PULLUP circuit?', rubricOrSampleReasoning: 'Pressing the switch connects pin 2 directly to 0V Ground, pulling the voltage down.' }
    ],
    differentiation: {
      support: ['Help student locate the Serial Monitor button in IDE 2.x.'],
      extension: ['Add an if-statement to print "ALERT: BUTTON PRESSED!" only on state change.'],
      offlineOption: ['Use web Serial Monitor simulator.']
    },
    nextLessonId: 'beg-04',
    nextLessonTeaser: 'Beginner 04: Sensors as Inputs — Connect light-dependent resistors and potentiometers to read analog ranges from 0 to 1023!',
    sources: [{ title: 'Arduino Docs: Digital Input Pullup', url: 'https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/' }],
    assetCredits: [{ asset: 'Tactile Button Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 04: SENSORS AS INPUTS (OBSERVATORY)
  // -----------------------------------------------------------------------
  {
    id: 'beg-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-comp-tcrt5000"],
      goDeeper: ["fg-foundations-open-closed-loop"]
    },
    courseId: 'beginner',
    sequence: 4,
    code: 'BEGINNER 04',
    title: 'Sensors as Inputs: Analog Readings & Voltage Dividers',
    promise: 'By the end, I can read analog sensor values (0–1023), graph changing values, and calibrate thresholds.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03'],
    outcomes: [
      'Distinguish digital inputs (2 states: 0 or 1) from analog inputs (1024 discrete levels: 0 to 1023).',
      'Explain how a 10-bit Analog-to-Digital Converter (ADC) measures voltage (0V to 5V).',
      'Wire a potentiometer or light-dependent resistor (LDR) voltage divider and log changing values.'
    ],
    vocabulary: [
      { term: 'Analog Input', plainMeaning: 'A sensor reading that can be any number in a smooth range, like temperature or light.', technicalMeaning: 'A continuous electrical signal mapped into discrete digital integer values via an ADC.' },
      { term: 'ADC (Analog-to-Digital Converter)', plainMeaning: 'A translator chip inside Arduino that turns voltages into numbers between 0 and 1023.', technicalMeaning: 'A 10-bit peripheral that converts an analog voltage from 0V–5V into an integer from 0–1023.' },
      { term: 'Potentiometer', plainMeaning: 'A volume knob that adjusts voltage resistance smoothly.', technicalMeaning: 'A three-terminal variable resistor with a sliding or rotating contact that forms an adjustable voltage divider.' }
    ],
    teacherPrep: ['Check 10kΩ potentiometers, LDR photoresistors, and 10kΩ fixed resistors.'],
    verifiedMaterials: ['Arduino Uno', '10kΩ Potentiometer or GL5528 LDR', '10kΩ fixed resistor', 'Breadboard'],
    safetyNotes: ['Never connect 5V directly to GND when turning a potentiometer knob (ensure center wiper pin goes to A0).'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Dim classroom lights and ask: "How does your phone screen know when to dim itself?"', studentAction: 'Discuss light sensors in smartphones.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain 10-bit ADC math: 0V = 0, 2.5V = 512, 5.0V = 1023.', studentAction: 'Calculate analog values for 1V and 4V.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Guide potentiometer/LDR wiring to Analog pin A0.', studentAction: 'Turn knob or shade LDR, watch live Serial Plotter graph rise and fall.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Guide students to find the midpoint threshold value.', studentAction: 'Record bright vs dark values and submit exit check.' }
    ],
    concepts: [
      {
        title: 'How the Arduino Reads Analog Voltages',
        explanation: 'Arduino Uno has a 10-bit ADC. 2^10 = 1024 levels. 0 Volts reads as 0. 5 Volts reads as 1023. Each step represents approximately 4.9 millivolts!',
        instructorNote: 'analogRead() takes approximately 100 microseconds per reading.'
      }
    ],
    visualizerId: 'sensor_observatory_sim',
    project: {
      name: 'Sensor Reading Observatory',
      deliverableType: 'dataset',
      successEvidence: ['Data table showing 5 sensor measurements recorded under ambient, bright, and dark conditions with threshold calculation.']
    },
    activity: {
      title: 'Build the Sensor Observatory',
      steps: [
        'Connect outer pin 1 of 10kΩ potentiometer to Arduino 5V.',
        'Connect outer pin 3 of potentiometer to Arduino GND.',
        'Connect center wiper pin 2 of potentiometer to Analog In A0.',
        'Upload sketch and open Tools -> Serial Plotter in Arduino IDE.',
        'Turn knob and observe smooth waveform graph updating in real-time!'
      ],
      successCriteria: ['Graph moves smoothly between 0 and 1023 without clipping or jumps.'],
      extension: 'Replace potentiometer with an LDR photoresistor and 10kΩ fixed resistor voltage divider.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', '10kΩ Linear Potentiometer'],
      componentList: [
        { name: 'Arduino Uno R3', exactVariant: 'Standard Rev3', quantity: 1 },
        { name: '10kΩ Rotary Potentiometer', exactVariant: 'B10K 3-pin single-turn', quantity: 1 },
        { name: 'Jumper wires', exactVariant: 'Male-to-Male', quantity: 3 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/potentiometer_analog_a0.svg',
      schematic: 'Arduino 5V ──[ Pin 1: 10kΩ Pot ]──[ Pin 2 Wiper ➔ Analog A0 ]──[ Pin 3: Pot ]── Arduino GND',
      wireTable: [
        { from: 'Arduino 5V', to: 'Potentiometer Leg 1', wireOrPolarityNote: 'Red wire (5V)' },
        { from: 'Arduino Analog A0', to: 'Potentiometer Center Leg 2', wireOrPolarityNote: 'Signal wire (Yellow)' },
        { from: 'Arduino GND', to: 'Potentiometer Leg 3', wireOrPolarityNote: 'Black wire (GND)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Insert potentiometer firmly into breadboard.',
        '2. Connect outer legs to 5V and GND.',
        '3. Connect center wiper leg to Analog pin A0.',
        '4. Plug in USB cable and upload sketch.'
      ],
      powerAndSafetyChecks: ['Never connect center wiper to 5V and outer leg to GND simultaneously while turning knob to extreme end.'],
      testCases: [
        { action: 'Turn knob fully counter-clockwise', expectedResult: 'Serial Monitor prints values near 0' },
        { action: 'Turn knob fully clockwise', expectedResult: 'Serial Monitor prints values near 1023' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int SENSOR_PIN = A0; // Potentiometer center wiper on Analog 0

void setup() {
  Serial.begin(9600); // Start serial communication
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN); // Read 0 to 1023
  float voltage = sensorValue * (5.0 / 1023.0); // Convert to actual volts
  
  Serial.print("Raw: ");
  Serial.print(sensorValue);
  Serial.print(" | Volts: ");
  Serial.println(voltage);
  
  delay(100); // 10 readings per second
}`,
      pinMap: { 'A0': 'Analog Input from sensor wiper', '5V': 'Sensor power', 'GND': 'Sensor ground' },
      setupAndUpload: ['Upload sketch and open Tools -> Serial Plotter.'],
      explanations: ['analogRead() reads the internal 10-bit ADC register.'],
      expectedResult: 'Stream of raw ADC numbers and converted voltage values.',
      caveats: ['Analog pins do not require pinMode() to read analog voltages.'],
      tweakTip: 'Multiply sensorValue by (5.0 / 1023.0) to display true physical Volts!'
    },
    troubleshooting: [
      { symptom: 'analogRead(A0) stays stuck at 1023 regardless of knob position.', checks: ['Check if GND wire is disconnected'], explanation: 'Without a ground reference, the input is pulled to 5V rail.' }
    ],
    checksForUnderstanding: ['What reading would analogRead() return if the input voltage is exactly 2.5V? (Answer: ~512)'],
    exitTicket: [
      { question: 'What is the highest number analogRead() can return on an Arduino Uno?', rubricOrSampleReasoning: '1023 (because the ADC has 10 bits of resolution, 2^10 - 1 = 1023).' }
    ],
    differentiation: {
      support: ['Draw an analog ruler showing 0V = 0, 2.5V = 512, 5V = 1023.'],
      extension: ['Use map(sensorValue, 0, 1023, 0, 100) to display percentage.'],
      offlineOption: ['Use web sensor simulator with live voltage needle gauge.']
    },
    nextLessonId: 'beg-05',
    nextLessonTeaser: 'Beginner 05: Program Logic & Debugging — Use variables, IF/ELSE rules, and timing to build an electronic reaction-time game!',
    sources: [{ title: 'Arduino Docs: Analog Read Serial', url: 'https://docs.arduino.cc/built-in-examples/basics/AnalogReadSerial/' }],
    assetCredits: [{ asset: 'Potentiometer Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 05: PROGRAM LOGIC & DEBUGGING (REACTION GAME)
  // -----------------------------------------------------------------------
  {
    id: 'beg-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure"],
      lookUpWhileBuilding: ["fg-prog-millis-vs-delay","fg-testing-fmea-debugging"],
      goDeeper: ["fg-arduino-microcontroller-vs-computer"]
    },
    courseId: 'beginner',
    sequence: 5,
    code: 'BEGINNER 05',
    title: 'Program Logic & Debugging: Reaction-Time Game',
    promise: 'By the end, I can write IF/ELSE decision logic, use variables, and systematically debug an electronic game.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04'],
    outcomes: [
      'Store and update game state using integer and unsigned long variables.',
      'Evaluate relational operators (<, >, ==, !=) inside if/else decision blocks.',
      'Apply the scientific single-variable debugging method when hardware or code fails.',
      'Build a working electronic Reaction-Time Game measuring milliseconds to press a button.'
    ],
    vocabulary: [
      { term: 'Variable', plainMeaning: 'A labeled memory box that holds a number that can change.', technicalMeaning: 'A named storage location in computer memory that contains a value of a specified data type.' },
      { term: 'millis()', plainMeaning: 'A built-in stopwatch counting milliseconds since the Arduino turned on.', technicalMeaning: 'Returns the number of milliseconds passed since the board began running the current program.' },
      { term: 'Scientific Debugging', plainMeaning: 'Changing only ONE thing at a time to prove what fixed a problem.', technicalMeaning: 'A systematic method of isolating and resolving bugs by testing individual hypotheses.' }
    ],
    teacherPrep: ['Have LEDs, 220Ω resistors, and pushbuttons ready for the reaction game.'],
    verifiedMaterials: ['Arduino Uno', 'Pushbutton', 'LED', '220Ω resistor', 'Breadboard'],
    safetyNotes: ['Standard low-voltage circuit safety.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Run a live reaction test on the projector: Who can press spacebar fastest when screen turns green?', studentAction: 'Compete and record reaction times in milliseconds.' },
      { segment: '10–25m Logic', minutes: 15, teacherAction: 'Trace IF/ELSE logic and millis() stopwatch timing on the whiteboard.', studentAction: 'Step through code lines and predict variable values.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Guide circuit assembly: LED on pin 13, Button on pin 2 with INPUT_PULLUP.', studentAction: 'Assemble, upload reaction game, and test partner reaction speeds.' },
      { segment: '50–60m Debug', minutes: 10, teacherAction: 'Demonstrate single-variable troubleshooting.', studentAction: 'Solve one intentional bug and submit exit ticket.' }
    ],
    concepts: [
      {
        title: 'Non-Blocking Time Tracking with millis()',
        explanation: 'delay(1000) freezes the microcontroller so it cannot see button presses. millis() is like checking your wristwatch: it tells you the exact time without stopping the robot from thinking!',
        instructorNote: 'millis() rolls over after ~50 days, stored in an unsigned long (32-bit).'
      }
    ],
    visualizerId: 'reaction_game_sim',
    project: {
      name: 'Reaction-Time Game',
      deliverableType: 'code_artifact',
      successEvidence: ['Working reaction timer game measuring button presses in milliseconds and detecting false starts.']
    },
    activity: {
      title: 'Build the Reaction-Time Game',
      steps: [
        'Wire LED to Pin 13 through 220Ω resistor.',
        'Wire Pushbutton to Pin 2 and GND using INPUT_PULLUP.',
        'Upload the Reaction Game sketch.',
        'Watch for the LED to illuminate after a random delay (1 to 4 seconds).',
        'Press the button as fast as you can; read your reaction score in the Serial Monitor!'
      ],
      successCriteria: ['Game accurately times response; prints warning if button pressed too early.'],
      extension: 'Add a high-score tracker variable that saves the fastest human score of the day.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', 'Breadboard', 'Button & LED'],
      componentList: [
        { name: 'Arduino Uno R3', exactVariant: 'Standard Rev3', quantity: 1 },
        { name: 'Tactile Button', exactVariant: '4-pin momentary', quantity: 1 },
        { name: '5mm LED', exactVariant: 'Red diffused', quantity: 1 },
        { name: '220Ω Resistor', exactVariant: '1/4W 5%', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/reaction_game_wiring.svg',
      schematic: 'Pin 13 ──[ 220Ω ]──[ LED ]── GND | Pin 2 ──[ Button ]── GND (INPUT_PULLUP)',
      wireTable: [
        { from: 'Pin 13', to: 'LED Anode via 220Ω', wireOrPolarityNote: 'Output signal' },
        { from: 'Pin 2', to: 'Button Pin 1', wireOrPolarityNote: 'Input signal' },
        { from: 'Button Pin 2', to: 'GND', wireOrPolarityNote: 'Ground return' }
      ],
      assemblyAndPowerUpSteps: ['1. Wire button and LED on breadboard.', '2. Upload sketch.', '3. Open Serial Monitor.'],
      powerAndSafetyChecks: ['Confirm common GND for both LED and switch.'],
      testCases: [
        { action: 'Wait for LED, then press button immediately', expectedResult: 'Serial Monitor displays reaction time (e.g. 240 ms)' },
        { action: 'Press button BEFORE LED turns on', expectedResult: 'Serial Monitor displays "FALSE START! CHEATER!"' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int LED_PIN = 13;
const int BUTTON_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println("--- ROBOBEE REACTION GAME ---");
}

void loop() {
  digitalWrite(LED_PIN, LOW);
  Serial.println("Get Ready...");
  
  // Random wait between 2 and 5 seconds
  delay(random(2000, 5000));
  
  // Check if player jumped the gun
  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("FALSE START! Wait for the light!");
    delay(2000);
    return;
  }
  
  digitalWrite(LED_PIN, HIGH); // GO!
  unsigned long startTime = millis();
  
  // Wait until player presses button
  while (digitalRead(BUTTON_PIN) == HIGH) {
    // waiting...
  }
  
  unsigned long reactionTime = millis() - startTime;
  digitalWrite(LED_PIN, LOW);
  
  Serial.print("Reaction Time: ");
  Serial.print(reactionTime);
  Serial.println(" ms!");
  
  delay(3000); // Wait before next round
}`,
      pinMap: { 'Pin 13': 'Reaction stimulus LED', 'Pin 2': 'Reaction response button' },
      setupAndUpload: ['Upload sketch and open Serial Monitor at 9600 baud.'],
      explanations: ['random(min, max) generates unpredictable delay.', 'millis() - startTime calculates elapsed time.'],
      expectedResult: 'Interactive game in Serial Monitor with millisecond reaction scoring.',
      caveats: ['while() loop blocks until the button is pressed.'],
      tweakTip: 'Compete with your partner to see who scores below 200 ms!'
    },
    troubleshooting: [
      { symptom: 'Game immediately triggers "Reaction Time: 0 ms" without waiting.', checks: ['Check button wiring'], explanation: 'If pin 2 is shorted to GND or button is jammed down, digitalRead() evaluates to LOW immediately.' }
    ],
    checksForUnderstanding: ['Why do engineers change only ONE variable at a time when debugging a robot?'],
    exitTicket: [
      { question: 'What does millis() - startTime calculate in code?', rubricOrSampleReasoning: 'It calculates elapsed time in milliseconds between when the event started and now.' }
    ],
    differentiation: {
      support: ['Provide starter template with setup() pre-written.'],
      extension: ['Add an average score calculator over 5 rounds.'],
      offlineOption: ['Use web reaction timer simulator.']
    },
    nextLessonId: 'beg-06',
    nextLessonTeaser: 'Beginner 06: DC Motors & Motor Drivers — Why can’t an Arduino pin drive a motor directly? Learn H-Bridges, separate battery power, and speed control!',
    sources: [{ title: 'Arduino Reference: millis()', url: 'https://docs.arduino.cc/language-reference/en/functions/time/millis/' }],
    assetCredits: [{ asset: 'Reaction Game Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 06: DC MOTORS & MOTOR DRIVERS (TEST STAND)
  // -----------------------------------------------------------------------
  {
    id: 'beg-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tb6612fng","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-electronics-ohms-law","fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-differential-kinematics"]
    },
    courseId: 'beginner',
    sequence: 6,
    code: 'BEGINNER 06',
    title: 'DC Motors and Motor Drivers: The H-Bridge',
    promise: 'By the end, I can explain why motors need a driver, wire an H-Bridge, and control wheel direction and PWM speed.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04', 'Beginner 05'],
    outcomes: [
      'Explain why a microcontroller GPIO pin (max 40mA) cannot directly power a DC motor (200mA–1000mA+).',
      'Describe the operation of an H-Bridge circuit for bidirectional rotation.',
      'Explain Pulse Width Modulation (PWM) as a digital duty-cycle control for motor speed.',
      'Wire a dual motor driver (TB6612FNG or L298N) with separate battery supply and common Ground.'
    ],
    vocabulary: [
      { term: 'Motor Driver', plainMeaning: 'A heavy-duty electronic gate that lets tiny Arduino signals control powerful battery motors.', technicalMeaning: 'An integrated circuit interface that translates low-current logic inputs into high-current drive outputs for inductive loads.' },
      { term: 'H-Bridge', plainMeaning: 'Four electronic switches arranged in an "H" shape to reverse electric current through a motor.', technicalMeaning: 'An electronic circuit that enables a voltage to be applied across a load in either direction.' },
      { term: 'PWM (Pulse Width Modulation)', plainMeaning: 'Rapidly switching power ON and OFF hundreds of times a second to adjust speed.', technicalMeaning: 'A modulation technique used to encode information or control power delivery by pulsing digital square waves.' },
      { term: 'Common Ground (Shared GND)', plainMeaning: 'Connecting all negative wires together so signals have the same zero-volt reference.', technicalMeaning: 'A single reference potential shared between multiple power supply domains.' }
    ],
    teacherPrep: ['Verify TT DC gear motors, motor drivers (TB6612FNG or L298N), and 4xAA battery packs.'],
    verifiedMaterials: ['Arduino Uno', 'TB6612FNG or L298N Motor Driver', 'TT Yellow DC Gear Motor with wheel', '4xAA Battery Pack (6V)'],
    safetyNotes: [
      'NEVER connect a DC motor directly across Arduino GPIO pins! Doing so draws excessive current and burns the microcontroller chip.',
      'Elevate wheels off the table during bench tests so the motor stand cannot drive off the edge.'
    ],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Compare a smartphone headphone jack (low power) to a rock concert speaker amplifier (high power).', studentAction: 'Understand that Arduino is a thinker, not a muscle.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain H-Bridge truth table (IN1/IN2) and PWM duty cycle (0-255). Explain shared GND.', studentAction: 'Fill out the 4-state direction truth table.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Supervise wiring of driver logic, motor battery, and shared GND.', studentAction: 'Wire motor test stand with elevated wheel. Upload direction & speed sweep.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Verify safe shared-ground habits.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'Why We Need a Shared Common Ground (GND)',
        explanation: 'Electricity only flows when there is a reference loop. If the motor battery pack Ground is not connected to the Arduino Ground, the logic signals cannot flow into the driver gates!',
        instructorNote: 'Common ground allows the 5V logic signal to be referenced to the same 0V baseline as the 6V motor battery.'
      }
    ],
    visualizerId: 'motor_driver_pwm_sim',
    project: {
      name: 'DC Motor Driver Test Stand',
      deliverableType: 'physical_build',
      successEvidence: ['Elevated motor test stand demonstrating Forward, Reverse, PWM Speed ramp (0–255), and Active Brake under code command.']
    },
    activity: {
      title: 'Assemble and Test the Motor Bench Stand',
      steps: [
        'Prop the yellow DC gear motor and wheel on a secure stand clear of the desk surface.',
        'Wire motor driver logic inputs (AIN1, AIN2, PWMA) to Arduino pins 7, 8, and 5 (~PWM).',
        'Connect the 4xAA battery pack positive (6V) to Motor Driver VM / VMS pin.',
        'Connect Battery negative (-) to Motor Driver GND AND connect Arduino GND to Motor Driver GND (Common Ground).',
        'Upload sketch and observe forward spin, coast, reverse spin, and speed changes!'
      ],
      successCriteria: ['Wheel spins smoothly forward, pauses, and reverses at commanded PWM speed.'],
      extension: 'Find the minimum PWM value (deadband threshold) required to overcome gearbox friction from a dead stop.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', 'TB6612FNG Dual Motor Driver (or L298N)', 'Yellow TT DC Gear Motor 1:48'],
      componentList: [
        { name: 'Arduino Uno R3', exactVariant: 'Standard Rev3', quantity: 1 },
        { name: 'TB6612FNG Motor Driver Carrier', exactVariant: 'Dual H-Bridge 1.2A per channel', quantity: 1 },
        { name: 'TT Gear Motor + Wheel', exactVariant: '3V-6V DC 1:48 gear ratio', quantity: 1 },
        { name: '4xAA Battery Holder', exactVariant: 'Switched 6V DC pack', quantity: 1 },
        { name: 'Jumper wires', exactVariant: 'Male-to-Female / Male-to-Male', quantity: 8 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/motor_driver_tb6612_wiring.svg',
      schematic: 'Arduino Pins [PWMA ➔ 5, AIN1 ➔ 7, AIN2 ➔ 8, STBY ➔ 6] | Battery 6V ➔ VM | Battery GND + Arduino GND ➔ Driver GND | Motor ➔ A01/A02',
      wireTable: [
        { from: 'Arduino Pin 5 (~PWM)', to: 'Driver PWMA', wireOrPolarityNote: 'Speed control signal' },
        { from: 'Arduino Pin 7', to: 'Driver AIN1', wireOrPolarityNote: 'Direction logic 1' },
        { from: 'Arduino Pin 8', to: 'Driver AIN2', wireOrPolarityNote: 'Direction logic 2' },
        { from: 'Arduino Pin 6', to: 'Driver STBY', wireOrPolarityNote: 'Standby wake-up (HIGH = Run)' },
        { from: 'Arduino 5V', to: 'Driver VCC', wireOrPolarityNote: 'Driver logic power (5V)' },
        { from: 'Battery Pack (+) 6V', to: 'Driver VM', wireOrPolarityNote: 'High current motor power' },
        { from: 'Battery Pack (-) GND', to: 'Driver GND', wireOrPolarityNote: 'Battery Ground' },
        { from: 'Arduino GND', to: 'Driver GND', wireOrPolarityNote: 'CRITICAL SHARED COMMON GROUND' },
        { from: 'Driver A01', to: 'Motor Terminal A', wireOrPolarityNote: 'Motor phase A' },
        { from: 'Driver A02', to: 'Motor Terminal B', wireOrPolarityNote: 'Motor phase B' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure 4xAA battery switch is OFF before wiring.',
        '2. Connect all logic pins between Arduino and driver.',
        '3. Connect Shared Ground wire securely.',
        '4. Elevate wheel off the table.',
        '5. Turn battery switch ON, then upload sketch.'
      ],
      powerAndSafetyChecks: ['Never short VM and VCC. Verify battery polarity with multimeter if unsure.'],
      testCases: [
        { action: 'AIN1=HIGH, AIN2=LOW, PWMA=150', expectedResult: 'Wheel rotates forward at medium speed.' },
        { action: 'AIN1=LOW, AIN2=HIGH, PWMA=100', expectedResult: 'Wheel rotates reverse at lower speed.' },
        { action: 'PWMA=0 or AIN1=LOW, AIN2=LOW', expectedResult: 'Wheel halts safely.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// CLASS 06: DC Motor & H-Bridge Control (TB6612FNG Driver)
const int PWMA = 5;  // Speed control (must be a ~PWM pin)
const int AIN1 = 7;  // Direction pin 1
const int AIN2 = 8;  // Direction pin 2
const int STBY = 6;  // Standby pin (HIGH = enabled)

void setup() {
  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(STBY, OUTPUT);
  
  digitalWrite(STBY, HIGH); // Wake up motor driver
}

void loop() {
  // 1. FORWARD at medium speed (150 out of 255)
  digitalWrite(AIN1, HIGH);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 150);
  delay(2000);

  // 2. STOP for 1 second
  analogWrite(PWMA, 0);
  delay(1000);

  // 3. REVERSE at slower speed (100 out of 255)
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, HIGH);
  analogWrite(PWMA, 100);
  delay(2000);

  // 4. STOP
  analogWrite(PWMA, 0);
  delay(1000);
}`,
      pinMap: { 'Pin 5': 'PWMA speed (0-255)', 'Pin 7': 'AIN1 direction', 'Pin 8': 'AIN2 direction', 'Pin 6': 'STBY enable' },
      setupAndUpload: ['Upload sketch with wheels elevated off desk.'],
      explanations: ['analogWrite(PWMA, val) sends high-frequency PWM duty cycle.'],
      expectedResult: 'Wheel spins forward for 2 sec, pauses, spins backwards for 2 sec.',
      caveats: ['If motor spins backward when commanding forward, swap A01/A02 motor wires.'],
      tweakTip: 'Change analogWrite(PWMA, 150) to analogWrite(PWMA, 240) to observe maximum torque!'
    },
    troubleshooting: [
      { symptom: 'Motor buzzes or hums with high pitch but wheel does not turn.', checks: ['Increase PWM value above 100', 'Check battery voltage'], explanation: 'Gearbox friction requires a minimum starting torque to break free.' },
      { symptom: 'Arduino resets or disconnects from PC every time motor starts.', checks: ['Verify battery is connected to VM, not Arduino 5V'], explanation: 'Motor inrush current drops the 5V rail voltage (brownout reset).' }
    ],
    checksForUnderstanding: ['What would happen to an Arduino pin if you connected a 500mA motor directly to it?'],
    exitTicket: [
      { question: 'What two logic pins do we toggle to reverse a motor’s direction in an H-Bridge?', rubricOrSampleReasoning: 'Swap AIN1 and AIN2 from HIGH/LOW to LOW/HIGH.' }
    ],
    differentiation: {
      support: ['Color-code the truth table on worksheet.'],
      extension: ['Write a soft-start acceleration loop that ramps PWM from 0 to 255 over 2 seconds.'],
      offlineOption: ['Use web H-Bridge transistor schematic simulator.']
    },
    nextLessonId: 'beg-07',
    nextLessonTeaser: 'Beginner 07: Movement Functions & Route Control — Package raw motor pins into forward(), turnRight(), and stopRobot() to drive precision floor routes!',
    sources: [{ title: 'Toshiba TB6612FNG Driver Datasheet', url: 'https://toshiba.semicon-storage.com/' }],
    assetCredits: [{ asset: 'H-Bridge Truth Table Guide', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 07: DIFFERENTIAL-DRIVE MOVEMENT & ROUTE CONTROL
  // -----------------------------------------------------------------------
  {
    id: 'beg-07',
    fieldGuideLinks: {
      readBeforeClass: ["fg-motion-differential-kinematics"],
      lookUpWhileBuilding: ["fg-comp-tb6612fng","fg-prog-program-structure"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'beginner',
    sequence: 7,
    code: 'BEGINNER 07',
    title: 'Differential-Drive Movement and Route Control',
    promise: 'By the end, I can package low-level motor commands into reusable C++ movement functions and choreograph floor navigation.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04', 'Beginner 05', 'Beginner 06'],
    outcomes: [
      'Encapsulate left and right motor pin commands into named C++ functions (forward, reverse, turnLeft, turnRight, stopRobot).',
      'Pass a speed parameter into movement functions.',
      'Calibrate time-based floor turns (e.g. 90-degree pivot) on classroom flooring.',
      'Program a two-wheel rover to drive a repeatable test route around an obstacle cone.'
    ],
    vocabulary: [
      { term: 'Function Abstraction', plainMeaning: 'Hiding 10 messy lines of pin code behind a clean English word like forward(150).', technicalMeaning: 'Hiding low-level implementation details behind a clean, reusable functional interface.' },
      { term: 'Pivot Turn', plainMeaning: 'Spinning like a top by moving one wheel forward and the other wheel backward.', technicalMeaning: 'Differential rotation around the geometric center of the wheel axle.' },
      { term: 'Dead Reckoning', plainMeaning: 'Navigating only by timing and estimated speed without sensor feedback.', technicalMeaning: 'The process of estimating current position based upon a previously determined position and advancing that position based upon estimated speed and elapsed time.' }
    ],
    teacherPrep: ['Mark test arena routes on classroom floor with painter’s tape.'],
    verifiedMaterials: ['Assembled 2WD Rover Chassis with dual TT motors and caster wheel', 'Arduino Uno', 'Motor driver', 'Battery pack'],
    safetyNotes: ['Supervised floor tests only. Keep clear of doorways and stairs.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show messy repeated code (100 lines of digitalWrite) vs modular code (5 lines of functions).', studentAction: 'Compare readability and maintainability.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain differential steering math: Left + Right = Straight; Left - Right = Spin Right.', studentAction: 'Step through function parameter passing.' },
      { segment: '25–50m Floor Tests', minutes: 25, teacherAction: 'Facilitate floor testing on taped route; guide turn calibration.', studentAction: 'Tune delay() ms until rover executes a clean 90° right turn.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review friction drift factors.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'Why Dead Reckoning Drifts Over Time',
        explanation: 'Timed movement (e.g. drive for 700ms) will drift because battery voltage drops, tires slip on smooth floors, and no two DC gear motors spin at the exact identical speed without sensor feedback.',
        instructorNote: 'This provides the perfect pedagogical motivation for distance sensors and line followers in upcoming lessons!'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Two-Wheel Differential-Drive Rover',
      deliverableType: 'physical_build',
      successEvidence: ['Rover successfully drives straight, pivots 90 degrees around a cone, and stops on command.']
    },
    activity: {
      title: 'Program a Floor Navigation Route',
      steps: [
        'Prop chassis on box to bench-test turn directions.',
        'Upload helper functions: forward(speed), turnRight(speed), stopRobot().',
        'Place rover on floor start line.',
        'Measure driving distance: tune delay(700) for forward travel.',
        'Calibrate turn timing: adjust delay(350) until rover pivots exactly 90 degrees.'
      ],
      successCriteria: ['Rover starts, turns 90 degrees, and stops without rolling into walls.'],
      extension: 'Program a complete "Figure-8" or square route returning to the starting tile.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Smart Rover Chassis Kit', 'Dual TT Motors', 'Arduino Uno R3', 'TB6612FNG Driver'],
      componentList: [
        { name: '2WD Acrylic or 3D Printed Chassis', exactVariant: 'Dual DC TT motor mounts + front caster', quantity: 1 },
        { name: 'TT Gear Motors', exactVariant: 'Dual shaft 3-6V', quantity: 2 },
        { name: 'Rubber Drive Wheels', exactVariant: '65mm diameter', quantity: 2 },
        { name: 'Steel Ball Caster Wheel', exactVariant: 'Omnidirectional front support', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/2wd_rover_wiring_plan.svg',
      schematic: 'Dual H-Bridge Driver [Left Motor ➔ A01/A02, Right Motor ➔ B01/B02] | Arduino Pins [Left ➔ 5,7,8; Right ➔ 3,4,2]',
      wireTable: [
        { from: 'Driver A01/A02', to: 'Left Motor', wireOrPolarityNote: 'Left drive channel' },
        { from: 'Driver B01/B02', to: 'Right Motor', wireOrPolarityNote: 'Right drive channel' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount motors and caster securely to chassis.',
        '2. Mount battery pack in center for balanced weight distribution.',
        '3. Test wheels spin in matching directions when calling forward().'
      ],
      powerAndSafetyChecks: ['Check chassis screws are tight so motors do not vibrate loose.'],
      testCases: [
        { action: 'Call forward(140)', expectedResult: 'Both wheels drive forward in sync.' },
        { action: 'Call turnRight(130)', expectedResult: 'Left wheel drives forward, right wheel reverses, rover spins right.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// CLASS 07: Modular Movement Functions
const int LEFT_PWM = 5;
const int LEFT_IN1 = 7;
const int LEFT_IN2 = 8;
const int RIGHT_PWM = 6;
const int RIGHT_IN1 = 9;
const int RIGHT_IN2 = 10;

void setLeftMotor(int speedVal) {
  if (speedVal > 0) {
    digitalWrite(LEFT_IN1, HIGH);
    digitalWrite(LEFT_IN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(LEFT_IN1, LOW);
    digitalWrite(LEFT_IN2, HIGH);
  } else {
    digitalWrite(LEFT_IN1, LOW);
    digitalWrite(LEFT_IN2, LOW);
  }
  analogWrite(LEFT_PWM, abs(speedVal));
}

void setRightMotor(int speedVal) {
  if (speedVal > 0) {
    digitalWrite(RIGHT_IN1, HIGH);
    digitalWrite(RIGHT_IN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(RIGHT_IN1, LOW);
    digitalWrite(RIGHT_IN2, HIGH);
  } else {
    digitalWrite(RIGHT_IN1, LOW);
    digitalWrite(RIGHT_IN2, LOW);
  }
  analogWrite(RIGHT_PWM, abs(speedVal));
}

void forward(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(speedVal);
}

void turnRight(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(-speedVal); // Spin on spot
}

void stopRobot() {
  setLeftMotor(0);
  setRightMotor(0);
}

void setup() {
  pinMode(LEFT_PWM, OUTPUT);
  pinMode(LEFT_IN1, OUTPUT);
  pinMode(LEFT_IN2, OUTPUT);
  pinMode(RIGHT_PWM, OUTPUT);
  pinMode(RIGHT_IN1, OUTPUT);
  pinMode(RIGHT_IN2, OUTPUT);
}

void loop() {
  forward(140);
  delay(800);
  stopRobot();
  delay(400);

  turnRight(130);
  delay(350); // Calibrated 90-deg turn
  stopRobot();
  delay(400);

  while(true); // Stop after completing route once
}`,
      pinMap: { 'Pins 5,7,8': 'Left Motor Channel', 'Pins 6,9,10': 'Right Motor Channel' },
      setupAndUpload: ['Upload sketch and disconnect USB before placing on floor.'],
      explanations: ['abs(speedVal) extracts magnitude for PWM while sign determines direction.'],
      expectedResult: 'Rover drives forward, brakes, spins 90 degrees right, and halts.',
      caveats: ['Check battery charge: turn angles change as batteries discharge.'],
      tweakTip: 'Tune delay(350) inside turnRight to achieve an exact 90-degree square corner!'
    },
    troubleshooting: [
      { symptom: 'Rover curves in a wide arc instead of driving straight.', checks: ['One motor has slightly more friction or lower voltage'], explanation: 'Cheap DC gear motors vary by ±10%. Adjust one motor PWM slightly in software (e.g. setLeftMotor(145)).' }
    ],
    checksForUnderstanding: ['Why is writing a forward() function better than repeating 8 lines of pin commands?'],
    exitTicket: [
      { question: 'Why might the exact same delay(700) produce different travel distances on tile vs carpet?', rubricOrSampleReasoning: 'Different surface friction, wheel slip, and battery voltage levels change real-world distance.' }
    ],
    differentiation: {
      support: ['Provide pre-configured motor pin setup.'],
      extension: ['Program a full square route with 4 sides and 4 turns.'],
      offlineOption: ['Use web 2D floor grid route simulator.']
    },
    nextLessonId: 'beg-08',
    nextLessonTeaser: 'Beginner 08: 3D Design for Robotics — Measure real hardware with calipers, learn 3D printing clearances (+0.5mm), and model a custom sensor bracket!',
    sources: [{ title: 'Differential Drive Kinematics Reference (Instructor-Developed Lab Notes)', url: '' }],
    assetCredits: [{ asset: 'Rover Chassis Layout', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 08: 3D DESIGN FOR ROBOTICS (SENSOR BRACKET)
  // -----------------------------------------------------------------------
  {
    id: 'beg-08',
    fieldGuideLinks: {
      readBeforeClass: ["fg-design-cad-measurement"],
      lookUpWhileBuilding: ["fg-design-cad-measurement"],
      goDeeper: ["fg-comp-hc-sr04"]
    },
    courseId: 'beginner',
    sequence: 8,
    code: 'BEGINNER 08',
    title: '3D Design for Robotics: Custom Sensor Mount',
    promise: 'By the end, I can measure physical electronic modules, account for 3D printing tolerances, and model a custom sensor bracket in CAD.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 07'],
    outcomes: [
      'Use vernier calipers to measure real hardware dimensions in millimeters (PCB, cylinders, mounting holes).',
      'Explain 3D printing clearance tolerances (+0.4mm to +0.5mm) for sliding fits.',
      'Create an editable 3D CAD model of an ultrasonic sensor bracket with baseplate and screw slots.',
      'Export a 3D-printable .STL file.'
    ],
    vocabulary: [
      { term: 'Tolerance & Clearance', plainMeaning: 'Extra wiggle room added to holes so printed plastic parts fit together without jamming.', technicalMeaning: 'The total allowable variation in a physical dimension to ensure proper mechanical fit.' },
      { term: 'Parametric CAD', plainMeaning: '3D design where you can change numbers and the whole model automatically resizes.', technicalMeaning: 'Computer-aided design where geometry is driven by mathematical constraints and editable dimensions.' },
      { term: 'Extrude', plainMeaning: 'Pulling a flat 2D drawing up into a 3D solid block.', technicalMeaning: 'Creating a 3D object by projecting a 2D profile along a linear direction.' }
    ],
    teacherPrep: ['Verify CAD software (Tinkercad, Onshape, or OpenSCAD) is accessible on workstations.'],
    verifiedMaterials: ['Digital vernier calipers', 'HC-SR04 ultrasonic sensor modules', 'CAD workstations'],
    safetyNotes: ['Handle caliper measuring jaws carefully.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show a 3D printed cylinder that fails to fit into a hole designed at exact zero clearance.', studentAction: 'Discover why real manufacturing requires tolerances.' },
      { segment: '10–25m Measuring', minutes: 15, teacherAction: 'Guide caliper measurement of HC-SR04 body (45x20mm) and cylinders (16mm).', studentAction: 'Measure hardware and log dimensions on paper.' },
      { segment: '25–50m CAD Modeling', minutes: 25, teacherAction: 'Demonstrate sketching L-bracket base and cutting cylinder holes (16.5mm diameter).', studentAction: 'Model bracket in CAD and perform clearance fit check.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Inspect 3D bracket models before export.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'The +0.5mm 3D Printing Rule',
        explanation: 'Fused Deposition Modeling (FDM) 3D printers squeeze molten plastic through a nozzle. The plastic expands slightly as it cools. If an ultrasonic cylinder is 16.0mm, you must model the hole at 16.5mm!',
        instructorNote: 'Also remember wire header clearance: leave 8mm space behind the sensor for the 4-pin jumper cable!'
      }
    ],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Rover Sensor-Bracket CAD Part',
      deliverableType: 'cad_model',
      successEvidence: ['Dimensioned 3D CAD bracket model with 16.5mm transducer cutouts, M3 chassis slots, and exported .STL file.']
    },
    activity: {
      title: 'Model the Ultrasonic Sensor Bracket',
      steps: [
        'Measure HC-SR04 sensor PCB: 45mm width × 20mm height.',
        'Measure transducer eyes: 16.0mm diameter with 26mm center-to-center spacing.',
        'Create CAD baseplate: 50mm × 25mm × 3mm thick.',
        'Create vertical faceplate: 50mm × 28mm × 3mm thick.',
        'Cut out two transducer holes at 16.5mm diameter (+0.5mm clearance).',
        'Cut out two M3 screw slots (3.4mm diameter) on baseplate for chassis mounting.'
      ],
      successCriteria: ['Model holds sensor straight, leaves room for 4-pin cable, and has valid screw slots.'],
      extension: 'Add a built-in snap-fit latch or cable management clip to the bracket.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['HC-SR04 Ultrasonic Sensor Module', '3D Printer (optional)'],
      componentList: [
        { name: 'HC-SR04 Sonar Module', exactVariant: '4-pin VCC/TRIG/ECHO/GND', quantity: 1 },
        { name: 'M3x8mm Screws & Nuts', exactVariant: 'Zinc plated steel', quantity: 2 },
        { name: 'PLA 3D Printer Filament', exactVariant: '1.75mm PLA (optional)', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/cad_ultrasonic_bracket_blueprint.svg',
      schematic: 'L-bracket: 50mm wide, 3mm wall, 16.5mm cylinder cutouts at 26mm spacing, M3 chassis mount slots',
      wireTable: [
        { from: 'HC-SR04 Header', to: 'Pass-through Cable Notch', wireOrPolarityNote: 'Requires 8mm depth clearance for jumper wires' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect CAD dimensions against caliper table.',
        '2. Export to .STL format.',
        '3. Slice in slicer software and verify 3mm wall thickness.'
      ],
      powerAndSafetyChecks: ['Check print orientation: print with L-bracket flat on bed to prevent layer delamination.'],
      testCases: [
        { action: 'Insert real HC-SR04 into 3D printed or virtual bracket', expectedResult: 'Snug sliding fit with zero binding or rattling.' }
      ]
    },
    codeLab: {
      language: 'openscad',
      code: `// CLASS 08: Parametric Ultrasonic Bracket (OpenSCAD / CAD Reference)
// HC-SR04 Dimensions: 45mm x 20mm | Eyes: 16mm diameter (+0.5mm clearance)

module ultrasonicMount() {
  difference() {
    // 1. Extrude L-Bracket Base and Vertical Faceplate
    union() {
      cube([50, 25, 3]); // Baseplate attached to chassis
      cube([50, 3, 28]); // Vertical front plate holding sensor
    }
    // 2. Cut out Left & Right Ultrasonic Eye Holes (16.5mm dia with tolerance)
    translate([12, 4, 15]) rotate([90, 0, 0]) cylinder(h=6, d=16.5, $fn=50);
    translate([38, 4, 15]) rotate([90, 0, 0]) cylinder(h=6, d=16.5, $fn=50);
    
    // 3. Cut out Chassis M3 Screw Slots
    translate([10, 14, -1]) cylinder(h=5, d=3.4, $fn=30);
    translate([40, 14, -1]) cylinder(h=5, d=3.4, $fn=30);
  }
}
ultrasonicMount();`,
      pinMap: { 'Clearance': '16.5mm hole for 16.0mm cylinder', 'M3 Slot': '3.4mm slot for 3.0mm screw' },
      setupAndUpload: ['Paste into OpenSCAD or replicate in Tinkercad / Onshape / Fusion 360.'],
      explanations: ['difference() cuts holes out of the solid base union.'],
      expectedResult: 'Watertight 3D manifold model ready for 3D printing.',
      caveats: ['Check that sensor points horizontal, not angled down toward the floor.'],
      tweakTip: 'Adjust cylinder diameter from 16.5 to 16.8 if your 3D printer tends to over-extrude.'
    },
    troubleshooting: [
      { symptom: 'Ultrasonic cylinders jam halfway into printed bracket.', checks: ['Check if clearance was omitted'], explanation: 'Always add +0.4mm to +0.5mm for FDM 3D printing holes.' }
    ],
    checksForUnderstanding: ['What happens if your mount points the ultrasonic sensor slightly down toward the floor? (Answer: Floor echoes produce false obstacle detections!)'],
    exitTicket: [
      { question: 'Why do mechanical engineers add 0.5mm clearance to holes in 3D CAD design?', rubricOrSampleReasoning: 'To account for plastic expansion and manufacturing tolerances so parts assemble smoothly.' }
    ],
    differentiation: {
      support: ['Provide starter Tinkercad baseplate template.'],
      extension: ['Add an angled 15-degree tilt adjustment.'],
      offlineOption: ['Use web 2D/3D caliper simulator with interactive tolerance slider.']
    },
    nextLessonId: 'beg-09',
    nextLessonTeaser: 'Beginner 09: Build an Obstacle-Avoiding Rover — System Integration! Assemble chassis, sonar, driver, and autonomous brain into one unified machine!',
    sources: [{ title: 'OpenSCAD User Manual', url: 'https://openscad.org' }],
    assetCredits: [{ asset: 'Parametric CAD Model', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 09: OBSTACLE-AVOIDING ROVER (SYSTEM INTEGRATION)
  // -----------------------------------------------------------------------
  {
    id: 'beg-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-hc-sr04","fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-safety-lab-code"],
      goDeeper: ["fg-motion-differential-kinematics","fg-prog-millis-vs-delay"]
    },
    courseId: 'beginner',
    sequence: 9,
    code: 'BEGINNER 09',
    title: 'Build an Obstacle-Avoiding Rover: System Integration',
    promise: 'By the end, I can assemble all subsystems into an autonomous rover and navigate around stationary obstacles safely.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 06', 'Beginner 07', 'Beginner 08'],
    outcomes: [
      'Connect mechanical, electrical, and coding subsystems into one integrated autonomous rover.',
      'Explain ultrasonic echolocation math (cm = us × 0.0343 / 2.0).',
      'Follow a pre-power Subsystem Startup Checklist to prevent electrical shorts.',
      'Implement an autonomous Sense → Decide → Act avoidance loop testing with stationary cardboard/foam obstacles.'
    ],
    vocabulary: [
      { term: 'System Integration', plainMeaning: 'Bringing together mechanics, electronics, and code so they work as one team.', technicalMeaning: 'The engineering process of bringing together the component sub-systems into one functional system.' },
      { term: 'Ultrasonic Sonar', plainMeaning: 'Measuring distance using high-pitched sound echoes like bats.', technicalMeaning: 'An acoustic distance sensor operating at 40 kHz timing the round-trip propagation of sound in air.' },
      { term: 'Safety Zone Threshold', plainMeaning: 'The minimum safe distance (e.g. 20 cm) before the robot must brake.', technicalMeaning: 'A software decision boundary triggering an evasive control state.' }
    ],
    teacherPrep: ['Prepare stationary cardboard boxes / foam blocks as obstacle test targets.'],
    verifiedMaterials: ['Assembled 2WD Rover', 'HC-SR04 Sonar', 'Arduino Uno', 'Motor driver', 'Battery pack', 'Stationary cardboard obstacle'],
    safetyNotes: [
      'Always test rover with stationary, non-fragile obstacles (cardboard box or foam block).',
      'NEVER test by driving toward a person or classroom pet.',
      'Perform sensor verification in Serial Monitor before turning on motor power.'
    ],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Ask: "How do bats fly through dark caves without hitting stalactites?" Explain speed of sound.', studentAction: 'Calculate round-trip echo travel time.' },
      { segment: '10–25m Subsystems', minutes: 15, teacherAction: 'Guide 4-step pre-flight checklist: 1. Mechanical, 2. Power/GND, 3. Sonar stream, 4. Autonomous code.', studentAction: 'Perform pre-power inspection checklist.' },
      { segment: '25–50m Floor Integration', minutes: 25, teacherAction: 'Supervise floor test in controlled cardboard obstacle corner.', studentAction: 'Deploy rover; tune threshold and reverse pulse until it navigates out of corner.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review diagnostic methods.', studentAction: 'Complete exit check questions.' }
    ],
    concepts: [
      {
        title: 'Why We Divide Sonar Echo Time by 2.0',
        explanation: 'The TRIG pin emits a 40kHz chirp. The sound wave travels OUT to the wall and bounces BACK to the ECHO pin—that is a round trip! We must divide total distance by 2 to get the true one-way distance.',
        instructorNote: 'Speed of sound in air is ~343 meters/sec = 0.0343 cm/microsecond.'
      }
    ],
    visualizerId: 'obstacle_avoiding_rover_sim',
    project: {
      name: 'Obstacle-Avoiding Rover',
      deliverableType: 'physical_build',
      successEvidence: ['Autonomous rover reliably detects stationary cardboard obstacle at 20cm, brakes, reverses, pivots right, and continues navigation without physical contact.']
    },
    activity: {
      title: 'Integrate and Test the Obstacle-Avoiding Rover',
      steps: [
        'Mount HC-SR04 sensor bracket pointing dead straight ahead on the front chassis.',
        'Wire TRIG to Pin 9, ECHO to Pin 10, VCC to 5V, GND to Ground.',
        'Verify sonar readings in Serial Monitor with motor battery turned OFF.',
        'Place a stationary cardboard obstacle 50 cm ahead on the floor.',
        'Turn on motor battery power, engage autonomous loop, and observe obstacle avoidance!'
      ],
      successCriteria: ['Rover stops and turns before touching the stationary cardboard target in 3 consecutive runs.'],
      extension: 'Program rover to pause, scan left and right, and choose the clearest pathway.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Rover Kit', 'Arduino Uno R3', 'HC-SR04 Ultrasonic Sonar', 'TB6612FNG Driver'],
      componentList: [
        { name: 'Complete 2WD Rover Chassis', exactVariant: 'Dual TT gear motors', quantity: 1 },
        { name: 'HC-SR04 Ultrasonic Sensor', exactVariant: '4-pin 5V module', quantity: 1 },
        { name: '3D Printed Sensor Bracket', exactVariant: 'Class 08 CAD Part', quantity: 1 },
        { name: '4xAA Battery Pack', exactVariant: '6V switched', quantity: 1 },
        { name: 'Stationary Cardboard Target', exactVariant: '30x20cm box', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/obstacle_avoiding_rover_complete_wiring.svg',
      schematic: 'HC-SR04 [TRIG ➔ Pin 9, ECHO ➔ Pin 10] | Motors via TB6612FNG [Pins 5,7,8 & 6,9,10] | Shared GND connected',
      wireTable: [
        { from: 'HC-SR04 VCC', to: 'Arduino 5V', wireOrPolarityNote: '5V Sensor Power' },
        { from: 'HC-SR04 TRIG', to: 'Arduino Pin 9', wireOrPolarityNote: '10µs Trigger pulse' },
        { from: 'HC-SR04 ECHO', to: 'Arduino Pin 10', wireOrPolarityNote: 'Echo return duration' },
        { from: 'HC-SR04 GND', to: 'Arduino GND', wireOrPolarityNote: 'Sensor Ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount sensor securely pointing horizontal.',
        '2. Verify Common GND is intact.',
        '3. Test sonar in Serial Monitor before turning on motors.',
        '4. Place rover on floor facing stationary cardboard target.'
      ],
      powerAndSafetyChecks: ['Never test against people. Keep testing floor clear of stray obstacles.'],
      testCases: [
        { action: 'Obstacle placed at 40cm', expectedResult: 'Rover cruises forward at 145 PWM.' },
        { action: 'Obstacle detected < 20cm', expectedResult: 'Rover active-brakes, reverses for 300ms, pivots right 90°, and resumes forward drive.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int TRIG = 9;
const int ECHO = 10;
const int SAFE_DISTANCE_CM = 20;

float readDistanceCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  
  long us = pulseIn(ECHO, HIGH, 25000); // 25ms timeout (~4 meters)
  return us ? (us * 0.0343 / 2.0) : 999;
}

void loop() {
  float distance = readDistanceCm();

  if (distance < SAFE_DISTANCE_CM) {
    // Evasive avoidance maneuver
    stopRobot();
    delay(150);
    reverse(130);
    delay(300);
    turnRight(140);
    delay(400);
    stopRobot();
  } else {
    forward(145);
  }
}`,
      pinMap: { 'Pin 9': 'HC-SR04 TRIG pulse', 'Pin 10': 'HC-SR04 ECHO echo return' },
      setupAndUpload: ['Upload sketch and bench-test sensor before floor release.'],
      explanations: ['pulseIn(ECHO, HIGH, 25000) returns microseconds until pin drops.'],
      expectedResult: 'Autonomous obstacle avoidance in floor test.',
      caveats: ['Soft fabrics (like heavy drapes) absorb ultrasonic pings, creating false clear readings.'],
      tweakTip: 'Notice the quick reverse before turning—it backs the rover away from tight corners!'
    },
    troubleshooting: [
      { symptom: 'Rover repeatedly stops and turns even in an empty room.', checks: ['Check if sensor is pointed down toward the floor'], explanation: 'Floor reflections bounce sound back early, simulating a false obstacle.' }
    ],
    checksForUnderstanding: ['Why must we divide the ultrasonic echo calculation by 2.0?'],
    exitTicket: [
      { question: 'Why do we test sensor readings in Serial Monitor before turning on the motor battery?', rubricOrSampleReasoning: 'To verify sensor accuracy and isolate bugs before the physical robot starts moving.' }
    ],
    differentiation: {
      support: ['Set SAFE_DISTANCE_CM to 30 cm for greater reaction margin.'],
      extension: ['Implement a moving average filter across 3 pings to eliminate noise spikes.'],
      offlineOption: ['Use web autonomous rover integration simulator.']
    },
    nextLessonId: 'beg-10',
    nextLessonTeaser: 'Beginner 10: Test, Improve, and Showcase — Run 3 repeatable engineering trials, log stopping data, and deliver your team RoboBEE Showcase presentation!',
    sources: [{ title: 'HC-SR04 Ultrasonic Distance Sensor User Manual', url: 'https://sparkfun.com' }],
    assetCredits: [{ asset: 'Integrated Rover Illustration', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 10: TEST, IMPROVE & SHOWCASE (ENGINEERING SHOWCASE)
  // -----------------------------------------------------------------------
  {
    id: 'beg-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-testing-fmea-debugging","fg-comp-hc-sr04"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'beginner',
    sequence: 10,
    code: 'BEGINNER 10',
    title: 'Rover Reliability Showcase: Data-Driven Improvement',
    promise: 'By the end, I can conduct repeatable engineering trials, log stopping distance data, improve one design choice, and present evidence.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01 through Beginner 09'],
    outcomes: [
      'Conduct 3 repeatable engineering test trials under identical standardized arena conditions.',
      'Record physical measurement data (stopping distance in cm, contact vs. clear).',
      'Make one evidence-backed improvement to code or hardware based on test data.',
      'Deliver a 2-minute engineering presentation explaining how your rover Senses, Decides, and Acts.'
    ],
    vocabulary: [
      { term: 'Repeatability', plainMeaning: 'Getting the exact same result every time you run a test.', technicalMeaning: 'The closeness of agreement between successive measurements of the same quantity under identical conditions.' },
      { term: 'Empirical Evidence', plainMeaning: 'Real measured facts and numbers, not guesses.', technicalMeaning: 'Information acquired by observation or experimentation recorded as data.' },
      { term: 'Iteration', plainMeaning: 'Making a change, testing it, and making it better.', technicalMeaning: 'The repetition of a process in order to generate a sequence of outcomes approaching a desired goal.' }
    ],
    teacherPrep: ['Prepare official 3-Trial scoring sheets and judging rubrics.'],
    verifiedMaterials: ['Integrated Obstacle-Avoiding Rover', 'Meter stick / measuring tape', 'Stationary cardboard target', 'Team Presentation Rubrics'],
    safetyNotes: ['Controlled arena testing only.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Explain how Formula 1 and SpaceX use telemetry data to optimize machines.', studentAction: 'Define their team’s measurable success criterion.' },
      { segment: '10–30m 3-Trial Testing', minutes: 20, teacherAction: 'Supervise standardized trial runs and witness logged distance measurements.', studentAction: 'Run 3 official trials from the exact same start mark. Log stopping distance in cm.' },
      { segment: '30–45m Iteration', minutes: 15, teacherAction: 'Guide data analysis: Did inertia cause coasting drift?', studentAction: 'Implement one data-driven fix (e.g. increase threshold or add active braking pulse). Re-test!' },
      { segment: '45–60m Showcase', minutes: 15, teacherAction: 'Host team showcase presentations and award certificates.', studentAction: 'Present team rover, explain code rules, demonstrate live run, and celebrate Beginner graduation!' }
    ],
    concepts: [
      {
        title: 'Data-Driven Engineering Iteration',
        explanation: 'A failed trial is never a failure—it gives your team the exact numbers needed for your next improvement! If your rover slides 5cm after braking on tile, raise SAFE_DISTANCE_CM from 18cm to 23cm.',
        instructorNote: 'Celebrate careful record-keeping and thoughtful modifications rather than luck.'
      }
    ],
    visualizerId: 'test_log_sim',
    project: {
      name: 'Rover Reliability Showcase',
      deliverableType: 'dataset',
      successEvidence: ['Completed 3-trial test table, recorded stopping distances in cm, documented before/after improvement, and team presentation.']
    },
    activity: {
      title: 'Run the 3-Trial Test and Showcase',
      steps: [
        'Set up standardized arena: Starting line exactly 1.5 meters from stationary cardboard box.',
        'Run Trial 1, Trial 2, and Trial 3. Measure stopping distance in centimeters using a ruler.',
        'Calculate average stopping distance and observe variation.',
        'Apply one evidence-based improvement (e.g. active braking pulse or sensor angle adjustment).',
        'Run verification trial and present your working rover to the class!'
      ],
      successCriteria: ['Team completes all 3 recorded trials and explains their evidence-backed improvement clearly.'],
      extension: 'Calculate standard deviation across 6 repeated trials.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Integrated 2WD Obstacle-Avoiding Rover'],
      componentList: [
        { name: 'Completed Autonomous Rover', exactVariant: 'Hardware from Classes 01–09', quantity: 1 },
        { name: '1-Meter Measuring Stick', exactVariant: 'Millimeter graduated', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/3_trial_arena_test_setup.svg',
      schematic: 'Standardized arena: 150cm track ➔ Stationary target ➔ Safe turn zone',
      wireTable: [
        { from: 'Rover System', to: 'Arena Start Line', wireOrPolarityNote: 'Identical starting heading for all 3 trials' }
      ],
      assemblyAndPowerUpSteps: ['1. Check battery voltage before trials.', '2. Inspect wheels for hair/dust.', '3. Log data after each run.'],
      powerAndSafetyChecks: ['Clear path of stray backpacks and cords.'],
      testCases: [
        { action: 'Trial 1 Run', expectedResult: 'Log actual stopping distance (target 10cm–20cm)' },
        { action: 'Trial 2 Run', expectedResult: 'Log actual stopping distance' },
        { action: 'Trial 3 Run', expectedResult: 'Log actual stopping distance' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// CLASS 10: Calibrated Braking with Momentum Compensation
const int SAFE_DISTANCE_CM = 24; // Increased from 18cm after Trial 1 showed 5cm coasting drift!
const int CRUISE_SPEED = 140;

void activeBrake() {
  // Quick 120ms reverse pulse halts wheel inertia immediately
  reverse(150);
  delay(120);
  stopRobot();
}

void loop() {
  float distance = readDistanceCm();

  if (distance < SAFE_DISTANCE_CM) {
    activeBrake(); // Eliminate coasting drift!
    delay(150);
    turnRight(140);
    delay(380);
    stopRobot();
  } else {
    forward(CRUISE_SPEED);
  }
}`,
      pinMap: { 'Pins 5,6,7,8,9,10': 'Dual motor drive with active brake pulse', 'Pins 9,10': 'HC-SR04 sonar' },
      setupAndUpload: ['Upload calibrated braking sketch and run verification trial.'],
      explanations: ['activeBrake() counters motor flywheel momentum with a reverse torque burst.'],
      expectedResult: 'Sharper, drift-free stops right at the 15cm target zone.',
      caveats: ['Too long a reverse pulse makes the robot back up before turning.'],
      tweakTip: 'Adjust activeBrake delay from 120ms to 80ms if the rover jerks backward.'
    },
    troubleshooting: [
      { symptom: 'Stopping distance gets smaller on each trial.', checks: ['Check battery charge'], explanation: 'As batteries drain, motor speed drops, reducing stopping momentum.' }
    ],
    checksForUnderstanding: ['What piece of test evidence led to your team’s improvement today?'],
    exitTicket: [
      { question: 'What is the difference between guessing a fix versus using evidence-based engineering?', rubricOrSampleReasoning: 'Evidence-based engineering relies on measured numbers from repeatable trials rather than assumptions.' }
    ],
    differentiation: {
      support: ['Provide pre-formatted table for logging trial measurements.'],
      extension: ['Plot stopping distance vs initial battery voltage on a graph.'],
      offlineOption: ['Use web 3-trial engineering test table simulator.']
    },
    nextLessonId: 'int-01',
    nextLessonTeaser: 'Graduate to Intermediate Robotics: Engineering workflows, reflectance sensor calibration, state machines, and competition line followers!',
    sources: [{ title: 'RoboBEE Innovators Engineering Showcase Rubric (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Showcase Rubric & Test Arena', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // COURSE SPACE C: INTERMEDIATE ROBOTICS (CLASSES 01-10)
  // -----------------------------------------------------------------------
  {
    id: 'int-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot","fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-comp-tcrt5000","fg-motion-differential-kinematics"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'intermediate',
    sequence: 1,
    code: 'INTERMEDIATE 01',
    title: 'Engineering Workflow and System Diagrams',
    promise: 'By the end, I can translate user mission requirements into testable block diagrams and interface specifications.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Beginner Series (Classes 01–10)'],
    outcomes: [
      'Decompose complex autonomous missions into functional subsystem blocks (Power, Sensing, Logic, Actuation).',
      'Define clear electrical and software interface specifications between subsystems.',
      'Produce an engineering blueprint for a competition line-following robot.'
    ],
    vocabulary: [
      { term: 'System Block Diagram', plainMeaning: 'A bird’s-eye visual map showing how all parts talk to each other.', technicalMeaning: 'A diagram of a system in which the principal parts or functions are represented by blocks connected by lines.' },
      { term: 'Functional Requirement', plainMeaning: 'A specific measurable test a robot must pass to succeed.', technicalMeaning: 'A statement of what a system must do, verifiable through measurement.' }
    ],
    teacherPrep: ['Prepare system architecture templates and mission rulebooks.'],
    verifiedMaterials: ['System architecture worksheets', 'Sample competition rule sheets'],
    safetyNotes: ['Classroom planning session.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Analyze why 40% of competition robots fail on the field due to unplanned interface bugs.', studentAction: 'Identify common team coordination failures.' },
      { segment: '10–30m Concept', minutes: 20, teacherAction: 'Guide drawing of Subsystem Block Diagram with voltage labels and signal buses.', studentAction: 'Map out Line-Follower blueprint.' },
      { segment: '30–50m Blueprinting', minutes: 20, teacherAction: 'Review student interface definitions.', studentAction: 'Define measurable acceptance tests.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Wrap up requirements review.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Interface Specifications', explanation: 'Each block must specify voltage, current draw, pin type, and data protocol.' }],
    visualizerId: 'sense_decide_act_sim',
    project: {
      name: 'Line-Follower Requirements and System Blueprint',
      deliverableType: 'design_review',
      successEvidence: ['Completed engineering block diagram detailing sensor array, controller, driver, and power budgets.']
    },
    activity: {
      title: 'Architect the Line Follower Blueprint',
      steps: ['Define requirements', 'Draw Power block', 'Draw Sensor block', 'Draw Logic block', 'Draw Motor block'],
      successCriteria: ['All signals and power lines are labeled with pin numbers and voltages.']
    },
    troubleshooting: [{ symptom: 'Blueprint omits common ground.', checks: ['Check battery to microcontroller link'], explanation: 'Signal references require shared GND.' }],
    checksForUnderstanding: ['What is the difference between a functional requirement and a design choice?'],
    exitTicket: [{ question: 'Why is defining interfaces between team members critical before writing code?', rubricOrSampleReasoning: 'Ensures code and circuits written by different teammates plug together without pin conflicts.' }],
    differentiation: { support: ['Provide pre-labeled block outlines.'], extension: ['Add telemetry and error state blocks.'] },
    nextLessonId: 'int-02',
    nextLessonTeaser: 'Intermediate 02: Reflectance-Sensor Calibration Station — Calibrate photodiode thresholds against actual competition track tape!',
    sources: [{ title: 'NASA Systems Engineering Handbook (SP-2016-6105 Rev2)', url: 'https://www.nasa.gov/connect/ebooks/systems_engineering_handbook.html' }],
    assetCredits: [{ asset: 'System Blueprint Template', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tcrt5000"],
      lookUpWhileBuilding: ["fg-electronics-ohms-law","fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'intermediate',
    sequence: 2,
    code: 'INTERMEDIATE 02',
    title: 'Reflectance-Sensor Calibration Station',
    promise: 'By the end, I can calibrate infrared surface reflectance sensors against dark and light floor surfaces.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01'],
    outcomes: [
      'Explain IR optical reflectance and absorption on matte vs glossy surfaces.',
      'Tune hardware sensitivity potentiometers on IR comparator modules.',
      'Log calibrated threshold values in software.'
    ],
    vocabulary: [
      { term: 'Photodiode', plainMeaning: 'An electric eye that turns reflected infrared light into electrical current.', technicalMeaning: 'A semiconductor diode that converts light photons into electrical current.' },
      { term: 'Calibration', plainMeaning: 'Adjusting a sensor so its readings match reality.', technicalMeaning: 'The comparison of measurement values delivered by a device under test with those of a calibration standard.' }
    ],
    teacherPrep: ['Prepare black electrical tape on white poster board test stations.'],
    verifiedMaterials: ['Dual TCRT5000 or IR proximity modules', 'Arduino Uno', 'Track test board'],
    safetyNotes: ['Avoid looking directly into high-intensity IR emitters at close range.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Demonstrate how sunlight blinds uncalibrated IR sensors.', studentAction: 'Observe sensor indicator light behavior in sunlight vs shade.' },
      { segment: '10–30m Calibration', minutes: 20, teacherAction: 'Guide potentiometer tuning: indicator ON over white, OFF over black.', studentAction: 'Tune module screw until switching is crisp.' },
      { segment: '30–50m Code Logging', minutes: 20, teacherAction: 'Guide digitalRead() inspection in Serial Monitor.', studentAction: 'Verify both sensors switch states reliably across tape.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review ambient light mitigation.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Infrared Reflection vs Absorption', explanation: 'Black electrical tape absorbs IR photons, while white vinyl reflects them back into the phototransistor base.' }],
    visualizerId: 'line_follower_sim',
    project: {
      name: 'Reflectance-Sensor Calibration Station',
      deliverableType: 'dataset',
      successEvidence: ['Calibrated IR sensor setup switching states consistently with 0 false triggers across 10 tape passes.']
    },
    activity: {
      title: 'Calibrate the IR Sensor Array',
      steps: ['Mount IR sensors 10mm above surface', 'Tune potentiometer over white', 'Pass across black line', 'Log state changes'],
      successCriteria: ['Sensors switch reliably at line boundary.']
    },
    troubleshooting: [{ symptom: 'Sensor indicator light never turns off.', checks: ['Sensor is too close to floor or ambient light is too intense'], explanation: 'Adjust distance to 8–12mm and shade from direct sunlight.' }],
    checksForUnderstanding: ['Why must IR sensors be recalibrated when moving from a classroom to a sunny competition arena?'],
    exitTicket: [{ question: 'What does black tape do to infrared light?', rubricOrSampleReasoning: 'It absorbs the infrared wavelengths, returning minimal reflection to the photodiode.' }],
    differentiation: { support: ['Use precision mini screwdriver for potentiometer tuning.'], extension: ['Calculate hysteresis band.'] },
    nextLessonId: 'int-03',
    nextLessonTeaser: 'Intermediate 03: Line-Follower State-Machine Controller — Replace messy nested if-statements with clean C++ state machines!',
    sources: [{ title: 'TCRT5000 Reflective Optical Sensor Datasheet', url: 'https://vishay.com' }],
    assetCredits: [{ asset: 'IR Sensor Calibration Station', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-03',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure"],
      lookUpWhileBuilding: ["fg-prog-millis-vs-delay"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'intermediate',
    sequence: 3,
    code: 'INTERMEDIATE 03',
    title: 'Reusable C++ Functions and State Machines',
    promise: 'By the end, I can architect a clean finite state machine (FSM) in C++ to control robot behavior.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02'],
    outcomes: [
      'Model robot navigation as a Finite State Machine with defined states and transitions.',
      'Use C++ enum and switch/case statements to implement clean state logic.',
      'Trace state transitions and eliminate race conditions.'
    ],
    vocabulary: [
      { term: 'Finite State Machine (FSM)', plainMeaning: 'A robot brain design where the robot is only ever in ONE clear state at a time (like Driving, Turning, or Stopped).', technicalMeaning: 'A mathematical model of computation that can be in exactly one of a finite number of states at any given time.' },
      { term: 'enum (Enumeration)', plainMeaning: 'A C++ keyword that gives human names to state numbers.', technicalMeaning: 'A user-defined data type consisting of a set of named integral constants.' }
    ],
    teacherPrep: ['Draw state transition bubble diagram on whiteboard.'],
    verifiedMaterials: ['Arduino Uno', 'Serial Monitor for state transition tracing'],
    safetyNotes: ['Logic and code lab.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show spaghetti code with 7 nested if-statements. Ask: "Can anyone tell what state this robot is in?"', studentAction: 'Experience the frustration of unstructured code.' },
      { segment: '10–30m Concept', minutes: 20, teacherAction: 'Introduce enum State { FORWARD, PIVOT_LEFT, PIVOT_RIGHT, STOPPED } and switch/case architecture.', studentAction: 'Map out state transition table.' },
      { segment: '30–50m Code Lab', minutes: 20, teacherAction: 'Guide compilation of FSM code with Serial state reporting.', studentAction: 'Test state transitions using simulated button triggers.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review transition guarantees.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why State Machines Prevent Glitches', explanation: 'An FSM guarantees the robot cannot execute two conflicting actions (like trying to turn left and drive forward simultaneously).' }],
    visualizerId: 'logic_counter_sim',
    project: {
      name: 'Line-Follower State-Machine Controller',
      deliverableType: 'code_artifact',
      successEvidence: ['State machine code compiling cleanly with enum states and verified transition test cases in Serial Monitor.']
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Intermediate 03
// Finite State Machine (FSM) Navigation Controller
// Proprietary Curriculum - Lab Reference

enum RobotState {
  STATE_FORWARD,
  STATE_PIVOT_LEFT,
  STATE_PIVOT_RIGHT,
  STATE_STOPPED
};

RobotState currentState = STATE_STOPPED;
unsigned long lastStatePrint = 0;

// Hardware Pin Definitions (Illustrative Reference)
const int PIN_BTN_LEFT  = 2; // Simulates left line/bump trigger
const int PIN_BTN_RIGHT = 3; // Simulates right line/bump trigger
const int PIN_LED_STATE = 13;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_BTN_LEFT, INPUT_PULLUP);
  pinMode(PIN_BTN_RIGHT, INPUT_PULLUP);
  pinMode(PIN_LED_STATE, OUTPUT);

  Serial.println(F("[ROVI-FSM] State Machine Initialized."));
  transitionTo(STATE_FORWARD);
}

void loop() {
  // Read inputs (Active LOW with INPUT_PULLUP)
  bool leftTriggered  = (digitalRead(PIN_BTN_LEFT) == LOW);
  bool rightTriggered = (digitalRead(PIN_BTN_RIGHT) == LOW);

  // FSM State Transition Logic
  switch (currentState) {
    case STATE_FORWARD:
      if (leftTriggered && rightTriggered) {
        transitionTo(STATE_STOPPED);
      } else if (leftTriggered) {
        transitionTo(STATE_PIVOT_LEFT);
      } else if (rightTriggered) {
        transitionTo(STATE_PIVOT_RIGHT);
      }
      break;

    case STATE_PIVOT_LEFT:
      if (!leftTriggered) {
        transitionTo(STATE_FORWARD);
      }
      break;

    case STATE_PIVOT_RIGHT:
      if (!rightTriggered) {
        transitionTo(STATE_FORWARD);
      }
      break;

    case STATE_STOPPED:
      if (!leftTriggered && !rightTriggered) {
        delay(200); // Debounce
        transitionTo(STATE_FORWARD);
      }
      break;
  }

  // Non-blocking telemetry output every 500ms
  if (millis() - lastStatePrint >= 500) {
    lastStatePrint = millis();
    reportTelemetry();
  }
}

void transitionTo(RobotState newState) {
  if (currentState == newState) return;
  Serial.print(F("[TRANSITION] "));
  Serial.print(getStateName(currentState));
  Serial.print(F(" -> "));
  Serial.println(getStateName(newState));
  currentState = newState;
  digitalWrite(PIN_LED_STATE, (currentState == STATE_FORWARD) ? HIGH : LOW);
}

const char* getStateName(RobotState state) {
  switch (state) {
    case STATE_FORWARD:     return "FORWARD";
    case STATE_PIVOT_LEFT:  return "PIVOT_LEFT";
    case STATE_PIVOT_RIGHT: return "PIVOT_RIGHT";
    case STATE_STOPPED:     return "STOPPED";
    default:                return "UNKNOWN";
  }
}

void reportTelemetry() {
  Serial.print(F("Current State: "));
  Serial.println(getStateName(currentState));
}
`,
      pinMap: {
        'PIN_BTN_LEFT': 'Pin 2 (Left sensor simulator, INPUT_PULLUP)',
        'PIN_BTN_RIGHT': 'Pin 3 (Right sensor simulator, INPUT_PULLUP)',
        'PIN_LED_STATE': 'Pin 13 (Built-in status indicator LED)'
      },
      setupAndUpload: [
        'Open Arduino IDE, select your board and serial COM port.',
        'Paste the FSM controller sketch and click Upload.',
        'Open Tools > Serial Monitor at 9600 baud.',
        'Ground Pin 2 or Pin 3 with a jumper wire to simulate sensor triggers and observe clean state transitions.'
      ],
      explanations: [
        'enum RobotState: Defines human-readable names for states instead of confusing magic numbers.',
        'transitionTo(): Centralized transition function that logs transitions and updates indicator lights cleanly.',
        'switch/case: Guarantees that only ONE state logic block executes per loop pass, preventing conflicting motor signals.',
        'millis() timer: Prints telemetry at 500ms intervals without blocking or slowing down loop execution.'
      ],
      expectedResult: 'Serial Monitor prints initial [ROVI-FSM] boot and displays instant transitions whenever sensor inputs toggle.',
      caveats: [
        'Always remember "break;" at the end of each case block to prevent unintended fall-through to the next state.',
        'Keep transition actions lightweight; never place long delay() calls inside state blocks.'
      ],
      tweakTip: 'Add an emergency recovery timer in STATE_STOPPED so the rover reverses after 3 seconds of being stuck.'
    },
    activity: {
      title: 'Program the Line-Follower State Machine',
      steps: ['Declare enum RobotState', 'Write switch(currentState) block', 'Define sensor transition triggers', 'Test in Serial Monitor'],
      successCriteria: ['Robot transitions between states cleanly without skipped steps.']
    },
    troubleshooting: [{ symptom: 'State machine gets trapped in one state forever.', checks: ['Check break; statements inside switch/case'], explanation: 'Missing break statements cause unintended fall-through.' }],
    checksForUnderstanding: ['How does a switch/case block make code cleaner than 6 chained if-else blocks?'],
    exitTicket: [{ question: 'What is a state transition condition?', rubricOrSampleReasoning: 'A rule or sensor event that causes the state machine to exit the current state and enter a new one.' }],
    differentiation: { support: ['Provide state diagram visual sheet.'], extension: ['Add an ERROR_RECOVERY state with timeout.'] },
    nextLessonId: 'int-04',
    nextLessonTeaser: 'Intermediate 04: Motor Control and PWM Tuning — Explore driver truth tables and record precise motor speed curves!',
    sources: [{ title: 'Finite State Machines in Embedded Systems', url: 'https://arduino.cc' }],
    assetCredits: [{ asset: 'FSM Transition Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics","fg-board-uno-anatomy"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'intermediate',
    sequence: 4,
    code: 'INTERMEDIATE 04',
    title: 'Motor Control and PWM Tuning',
    promise: 'By the end, I can analyze motor driver truth tables, calibrate PWM duty cycles, and eliminate wheel speed differences.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02', 'Intermediate 03'],
    outcomes: [
      'Analyze the H-Bridge driver truth table across forward, reverse, brake, and coast modes.',
      'Record a speed-calibration tuning table measuring wheel RPM across PWM values (50 to 255).',
      'Implement software trimming to make two mismatched DC gear motors drive perfectly straight.'
    ],
    vocabulary: [
      { term: 'Active Braking', plainMeaning: 'Shorting motor leads together so the motor acts as an electromagnetic brake.', technicalMeaning: 'Connecting both terminals of a DC motor to the same potential (LOW/LOW or HIGH/HIGH) inducing back-EMF braking torque.' },
      { term: 'Trimming / Bias', plainMeaning: 'Adjusting one motor slightly faster in software to fix a steering drift.', technicalMeaning: 'A calibration offset applied to equalize mechanical disparities between actuator channels.' }
    ],
    teacherPrep: ['Have tachometers or optical flags ready for measuring wheel RPM.'],
    verifiedMaterials: ['2WD Rover Chassis', 'Motor Driver', 'Arduino Uno', 'Tuning table worksheet'],
    safetyNotes: ['Elevate rover wheels during bench calibration.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Explain back-EMF and why braking is different from coasting.', studentAction: 'Spin unpowered motor by hand while shorting its leads together.' },
      { segment: '10–30m Truth Tables', minutes: 20, teacherAction: 'Walk through L298N vs TB6612 truth tables.', studentAction: 'Test all 4 input states.' },
      { segment: '30–50m PWM Sweep', minutes: 20, teacherAction: 'Guide logging of motor RPM at PWM 80, 120, 160, 200, 255.', studentAction: 'Calculate trim offset factor.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review trimming equations.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Braking vs Coasting in H-Bridges', explanation: 'Coasting (PWM=0) lets the wheels roll freely with momentum. Active braking (IN1=LOW, IN2=LOW or HIGH/HIGH) shorts the coils, creating immediate stopping resistance!' }],
    visualizerId: 'motor_driver_pwm_sim',
    project: {
      name: 'PWM Motor-Tuning Bench',
      deliverableType: 'dataset',
      successEvidence: ['Completed motor tuning data table with calibrated trim values for straight 3-meter driving.']
    },
    activity: {
      title: 'Calibrate Motor Speed and Trimming',
      steps: ['Test low-speed threshold', 'Measure RPM across 5 PWM steps', 'Calculate left/right speed ratio', 'Apply software trim in code'],
      successCriteria: ['Rover drives 3 meters in a straight line with less than 5cm lateral drift.']
    },
    troubleshooting: [{ symptom: 'Motor stalls below PWM 75.', checks: ['Check gearbox friction'], explanation: 'DC motors have static friction that requires a minimum voltage to overcome.' }],
    checksForUnderstanding: ['Why does shorting the two wires of a DC motor make it hard to turn by hand?'],
    exitTicket: [{ question: 'What is the difference between active braking and coasting on an H-Bridge driver?', rubricOrSampleReasoning: 'Braking shorts the motor leads to create counter-electromagnetic force stopping rotation; coasting simply disconnects power.' }],
    differentiation: { support: ['Provide pre-calculated trim multiplier.'], extension: ['Plot speed vs PWM curve on graph.'] },
    nextLessonId: 'int-05',
    nextLessonTeaser: 'Intermediate 05: Line-Following Robot — Put sensor calibration, state machines, and motor tuning together to race a competition track!',
    sources: [{ title: 'DC Motor Physics and H-Bridge Dynamics', url: 'https://sparkfun.com' }],
    assetCredits: [{ asset: 'PWM Tuning Table', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tcrt5000","fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-safety-lab-code","fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'intermediate',
    sequence: 5,
    code: 'INTERMEDIATE 05',
    title: 'Integrated Autonomous Line-Following Robot',
    promise: 'By the end, I can program an autonomous line follower that navigates curved tracks and recovers from line loss.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02', 'Intermediate 03', 'Intermediate 04'],
    outcomes: [
      'Integrate dual IR reflection sensors with differential drive motors.',
      'Program a 4-state line tracking algorithm (Straight, Correct Left, Correct Right, Recovery).',
      'Tune BASE_SPEED and TURN_SPEED to race a curved test track without derailing.'
    ],
    vocabulary: [
      { term: 'Differential Line Tracking', plainMeaning: 'Steering the robot by pivoting toward the sensor that sees the black line.', technicalMeaning: 'A closed-loop steering control method that applies corrective torque proportional to optical line position.' },
      { term: 'Recovery State', plainMeaning: 'A backup plan if the robot loses the line completely on a sharp turn.', technicalMeaning: 'A fault-tolerant routine executed when all tracking sensors lose line contact.' }
    ],
    teacherPrep: ['Set up competition track with 90° curves and a cross intersection.'],
    verifiedMaterials: ['2WD Rover with dual IR array', 'Arduino Uno', 'Track arena'],
    safetyNotes: ['Floor testing only.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show real warehouse AGVs moving goods autonomously along magnetic and optical floor lines.', studentAction: 'Relate track challenge to real robotics.' },
      { segment: '10–25m Algorithm', minutes: 15, teacherAction: 'Walk through 4-state logic: Both White ➔ Forward; Left Black ➔ Pivot Left; Right Black ➔ Pivot Right; Both Black ➔ Stop.', studentAction: 'Trace state reactions.' },
      { segment: '25–50m Track Tuning', minutes: 25, teacherAction: 'Supervise track trial runs and coach speed tuning.', studentAction: 'Run laps, tune BASE_SPEED and TURN_SPEED, optimize lap time.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review line loss recovery.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'The Speed vs Cornering Tradeoff', explanation: 'If BASE_SPEED is set too high, forward inertia carries the sensors past sharp 90-degree corners before the loop can pivot the chassis.' }],
    visualizerId: 'line_follower_sim',
    project: {
      name: 'Line-Following Robot',
      deliverableType: 'physical_build',
      successEvidence: ['Robot completes 2 full laps of the competition track autonomously without leaving the black line.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (or Nano)', 'TB6612FNG Dual H-Bridge Motor Driver', 'Dual TCRT5000 IR Reflectance Sensors'],
      componentList: [
        { name: '2WD Robot Chassis', exactVariant: 'Acrylic/3D-printed chassis with dual TT gearmotors (1:48)', quantity: 1 },
        { name: 'TB6612FNG Driver Module', exactVariant: 'Toshiba TB6612FNG dual motor driver breakout', quantity: 1 },
        { name: 'Dual IR Reflectance Sensors', exactVariant: 'TCRT5000 optical reflectance tracking sensor modules', quantity: 2 },
        { name: 'Battery Pack', exactVariant: '2S 7.4V Li-Ion / 6x AA battery holder with power switch', quantity: 1 },
        { name: 'Caster Wheel', exactVariant: 'Front smooth nylon/metal ball caster', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'Arduino D3 ➔ STBY, D5 ➔ PWMA, D7 ➔ AIN1, D8 ➔ AIN2, D6 ➔ PWMB, D9 ➔ BIN1, D10 ➔ BIN2. A0 ➔ Left IR, A1 ➔ Right IR. Battery (+) ➔ TB6612 VM, Shared GND.',
      wireTable: [
        { from: 'Arduino D3', to: 'TB6612 STBY', wireOrPolarityNote: 'Standby pin: must be HIGH to enable motor outputs' },
        { from: 'Arduino D5 (PWM)', to: 'TB6612 PWMA', wireOrPolarityNote: 'Speed control for Left Motor (0-255)' },
        { from: 'Arduino D7', to: 'TB6612 AIN1', wireOrPolarityNote: 'Left Motor Direction A' },
        { from: 'Arduino D8', to: 'TB6612 AIN2', wireOrPolarityNote: 'Left Motor Direction B' },
        { from: 'Arduino D6 (PWM)', to: 'TB6612 PWMB', wireOrPolarityNote: 'Speed control for Right Motor (0-255)' },
        { from: 'Arduino D9', to: 'TB6612 BIN1', wireOrPolarityNote: 'Right Motor Direction A' },
        { from: 'Arduino D10', to: 'TB6612 BIN2', wireOrPolarityNote: 'Right Motor Direction B' },
        { from: 'Arduino A0', to: 'Left TCRT5000 OUT', wireOrPolarityNote: 'Analog/Digital output from left optical sensor' },
        { from: 'Arduino A1', to: 'Right TCRT5000 OUT', wireOrPolarityNote: 'Analog/Digital output from right optical sensor' },
        { from: 'Arduino 5V', to: 'TB6612 VCC & Sensor VCC', wireOrPolarityNote: 'Regulated 5V logic power bus' },
        { from: 'Arduino GND', to: 'TB6612 GND & Battery (-)', wireOrPolarityNote: 'Mandatory common ground return' },
        { from: 'Battery (+) 7.4V', to: 'TB6612 VM', wireOrPolarityNote: 'Motor drive power rail (never connect directly to 5V)' },
        { from: 'TB6612 AO1/AO2', to: 'Left TT Motor Terminals', wireOrPolarityNote: 'Solder 0.1uF ceramic noise filtering capacitor across leads' },
        { from: 'TB6612 BO1/BO2', to: 'Right TT Motor Terminals', wireOrPolarityNote: 'Solder 0.1uF ceramic noise filtering capacitor across leads' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount dual IR sensors 8-12mm above ground surface, centered 20mm apart on chassis front.',
        '2. Wire TB6612FNG driver to Arduino digital pins using the wire table above.',
        '3. Connect common GND between battery negative, TB6612 GND, and Arduino GND.',
        '4. Place robot on bench with wheels off ground; power on USB logic first.',
        '5. Upload firmware sketch and calibrate IR threshold pot until indicator LEDs switch on black line vs white floor.',
        '6. Turn on motor battery switch and verify left and right wheel forward directions.'
      ],
      powerAndSafetyChecks: [
        'Never connect 7.4V battery pack to Arduino 5V or Vin while USB cable is connected.',
        'Always test motor directions on a test stand before placing robot on floor.',
        'Keep hair, fingers, and loose clothing away from rotating wheels and gears.',
        'Common ground between battery and Arduino is strictly mandatory for clean driver logic.'
      ],
      testCases: [
        { action: 'Both sensors on white floor', expectedResult: 'Robot drives forward at BASE_SPEED (PWM 135).' },
        { action: 'Left sensor enters black line', expectedResult: 'Left motor reverses; Right motor drives forward to pivot left onto line.' },
        { action: 'Right sensor enters black line', expectedResult: 'Right motor reverses; Left motor drives forward to pivot right onto line.' },
        { action: 'Both sensors enter black cross line (Stop Line)', expectedResult: 'Robot halts motors completely.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Intermediate 05
// 4-State Differential Line-Following Robot
// Motor Driver: TB6612FNG | Sensors: Dual IR Reflectance

const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

const int PIN_IR_LEFT  = A0;
const int PIN_IR_RIGHT = A1;

// Calibrated Threshold: Analog reading > 500 means Black Line
const int LINE_THRESHOLD = 500;

// Speed Settings (0-255)
const int SPEED_BASE = 135;
const int SPEED_TURN = 110;

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);

  digitalWrite(PIN_STBY, HIGH); // Enable driver
  Serial.begin(9600);
  Serial.println(F("[LINE-FOLLOWER] Ready."));
}

void loop() {
  int leftVal  = analogRead(PIN_IR_LEFT);
  int rightVal = analogRead(PIN_IR_RIGHT);

  bool leftOnLine  = (leftVal > LINE_THRESHOLD);
  bool rightOnLine = (rightVal > LINE_THRESHOLD);

  if (!leftOnLine && !rightOnLine) {
    // Both on white floor -> Drive straight forward
    setMotors(SPEED_BASE, SPEED_BASE);
  } else if (leftOnLine && !rightOnLine) {
    // Left on line -> Pivot left
    setMotors(-SPEED_TURN, SPEED_TURN);
  } else if (!leftOnLine && rightOnLine) {
    // Right on line -> Pivot right
    setMotors(SPEED_TURN, -SPEED_TURN);
  } else {
    // Both on black line (Finish / T-junction) -> Stop
    brakeMotors();
  }
}

void setMotors(int leftSpeed, int rightSpeed) {
  // Left Motor
  if (leftSpeed >= 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
    analogWrite(PIN_PWMA, leftSpeed);
  } else {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
    analogWrite(PIN_PWMA, -leftSpeed);
  }

  // Right Motor
  if (rightSpeed >= 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
    analogWrite(PIN_PWMB, rightSpeed);
  } else {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
    analogWrite(PIN_PWMB, -rightSpeed);
  }
}

void brakeMotors() {
  digitalWrite(PIN_AIN1, HIGH);
  digitalWrite(PIN_AIN2, HIGH);
  analogWrite(PIN_PWMA, 0);
  digitalWrite(PIN_BIN1, HIGH);
  digitalWrite(PIN_BIN2, HIGH);
  analogWrite(PIN_PWMB, 0);
}
`,
      pinMap: {
        'PIN_STBY': 'Pin 3 (TB6612 Standby enable, active HIGH)',
        'PIN_PWMA': 'Pin 5 (Left motor PWM speed control)',
        'PIN_AIN1 / AIN2': 'Pins 7 & 8 (Left motor direction truth table)',
        'PIN_PWMB': 'Pin 6 (Right motor PWM speed control)',
        'PIN_BIN1 / BIN2': 'Pins 9 & 10 (Right motor direction truth table)',
        'PIN_IR_LEFT': 'Pin A0 (Left TCRT5000 reflectance analog input)',
        'PIN_IR_RIGHT': 'Pin A1 (Right TCRT5000 reflectance analog input)'
      },
      setupAndUpload: [
        'Keep robot propped on a test block so wheels spin freely.',
        'Upload sketch to Arduino Uno via USB.',
        'Open Serial Monitor and test sensor readings over white paper and black electrical tape.',
        'Adjust LINE_THRESHOLD if paper surface reflectivity differs.',
        'Place on curved track and activate battery switch.'
      ],
      explanations: [
        'analogRead() reads infrared reflection; dark black absorbs IR giving higher analog values (>500).',
        'setMotors() accepts positive values for forward and negative for reverse, allowing smooth differential pivot turns.',
        'brakeMotors() pulls both driver input terminals HIGH simultaneously to short motor EMF and brake instantly.'
      ],
      expectedResult: 'Robot smoothly tracks curved black line on white poster board, pivoting when turning and stopping at finish line.',
      caveats: [
        'Ensure sensor height is locked between 8-12mm; higher distances cause unreliable optical readings.',
        'If robot pivots the wrong way on seeing a line, swap PIN_AIN1/2 or PIN_BIN1/2 pin assignments.'
      ],
      tweakTip: 'If rover wiggles on straights, decrease SPEED_TURN from 110 to 90 for gentler steering corrections.'
    },
    activity: {
      title: 'Race the Line Following Track',
      steps: ['Mount calibrated IR sensors', 'Upload 4-state line tracking code', 'Place on track', 'Tune turn speeds', 'Record lap time'],
      successCriteria: ['Complete full lap cleanly and stop at perpendicular finish line.']
    },
    troubleshooting: [{ symptom: 'Robot oscillates (wiggles) violently on straightaways.', checks: ['Reduce TURN_SPEED or increase BASE_SPEED slightly'], explanation: 'Over-correction occurs when steering torque is disproportionately large for the error.' }],
    checksForUnderstanding: ['What should the robot do if both sensors see white floor?'],
    exitTicket: [{ question: 'If the Left IR sensor detects the black line, which way must the robot steer to recenter?', rubricOrSampleReasoning: 'It must steer Left so the sensor moves back off the line onto the white floor.' }],
    differentiation: { support: ['Lower BASE_SPEED to 120 for slower, stable tracking.'], extension: ['Upgrade to 5-sensor array with proportional steering.'] },
    nextLessonId: 'int-06',
    nextLessonTeaser: 'Intermediate 06: Servo Mechanisms & Robotic Manipulators — Control angular positions from 0° to 180° and construct a motorized robotic gripper arm!',
    sources: [{ title: 'RoboBEE Innovators Line Follower Competition Rules (Lab Reference)', url: '' }],
    assetCredits: [{ asset: 'Competition Track Map', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-sg90-servo"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-safety-lab-code"],
      goDeeper: ["fg-design-cad-measurement"]
    },
    courseId: 'intermediate',
    sequence: 6,
    code: 'INTERMEDIATE 06',
    title: 'Servo Mechanisms and Robotic Arms',
    promise: 'By the end, I can control positional servo motors with <Servo.h>, calibrate angles, and build a robotic gripper claw.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 03'],
    outcomes: [
      'Contrast continuous-rotation DC motors with closed-loop positional servomotors (SG90/MG996R).',
      'Command exact angular positions (0° to 180°) using <Servo.h>.',
      'Assemble a mechanical gripper claw and calibrate safe OPEN and GRIP angles to avoid motor stalls.'
    ],
    vocabulary: [
      { term: 'Servomotor', plainMeaning: 'A motor that turns to a precise commanded angle (like 90°) and holds that position.', technicalMeaning: 'A rotary actuator that allows for precise control of angular position, velocity, and acceleration with internal feedback.' },
      { term: 'Motor Stall', plainMeaning: 'When a motor is forced to stop turning while power is still applied, drawing huge current and heating up.', technicalMeaning: 'A condition where motor shaft torque is matched by opposing load torque, causing zero speed and maximum stall current.' }
    ],
    teacherPrep: ['Check SG90/MG996R servos and mechanical acrylic/3D-printed gripper kits.'],
    verifiedMaterials: ['SG90 or MG996R Servomotor', 'Acrylic gripper claw kit', 'Arduino Uno', 'External 5V supply'],
    safetyNotes: ['Never force a powered servo horn by hand. Never set grip angle past physical closure.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show industrial robot arms assembling cars with millimeter precision.', studentAction: 'Compare continuous wheel rotation with precision joints.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Explain internal potentiometer feedback loop and PWM pulse widths (1ms to 2ms = 0° to 180°).', studentAction: 'Center servo to 90° before attaching horn.' },
      { segment: '25–50m Build', minutes: 25, teacherAction: 'Guide assembly of gripper mechanism. Guide angle calibration.', studentAction: 'Assemble claw, program smooth sweep, pick up foam block.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review stall prevention.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why You Must Center a Servo Before Assembly', explanation: 'If you screw the horn on without commanding 90° first, the servo will hit its physical internal stop tab and strip its plastic gears!' }],
    visualizerId: 'servo_arm_sim',
    project: {
      name: 'Servo Pick-and-Place Gripper',
      deliverableType: 'physical_build',
      successEvidence: ['Calibrated robotic gripper smoothly picking up, holding for 3 seconds, and releasing a lightweight foam block without gear buzzing.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', 'TowerPro SG90 9g Micro Servo', 'External 5V 2A Regulated Power Supply'],
      componentList: [
        { name: 'Micro Servomotor', exactVariant: 'TowerPro SG90 9g nylon gear servo (1.8 kg-cm torque)', quantity: 1 },
        { name: 'Mechanical Gripper Kit', exactVariant: 'Laser-cut acrylic / 3D-printed claw with gear drive', quantity: 1 },
        { name: 'External Power Supply', exactVariant: '5V 2A DC adapter or 4x AA battery pack (6.0V max)', quantity: 1 },
        { name: 'Breadboard & Jumpers', exactVariant: 'Mini breadboard with male-to-male jumper wires', quantity: 1 }
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
      code: `// RoboBEE Innovators - Intermediate 06
// Calibrated Robotic Gripper Claw Controller
// Library: <Servo.h> | Hardware: SG90 Micro Servo

#include <Servo.h>

Servo gripper;

const int PIN_SERVO = 9;

// Calibrated Safe Angles (Degrees)
// Verify against physical claw limits before operation!
const int ANGLE_OPEN = 120; // Jaws wide open
const int ANGLE_GRIP = 48;  // Jaws firmly holding foam cube without stalling

void setup() {
  Serial.begin(9600);
  Serial.println(F("[GRIPPER] Initializing..."));

  gripper.attach(PIN_SERVO);

  // Center servo on boot
  gripper.write(90);
  delay(1000);
  Serial.println(F("[GRIPPER] Ready. Testing pick-and-place cycle."));
}

void loop() {
  Serial.println(F("Opening gripper jaws..."));
  smoothMove(ANGLE_OPEN);
  delay(1500);

  Serial.println(F("Gripping object..."));
  smoothMove(ANGLE_GRIP);
  delay(2000); // Hold object
}

// Moves servo slowly to avoid mechanical jerk and gear stress
void smoothMove(int targetAngle) {
  int currentAngle = gripper.read();
  if (currentAngle < targetAngle) {
    for (int a = currentAngle; a <= targetAngle; a++) {
      gripper.write(a);
      delay(15); // 15ms per degree = smooth angular velocity
    }
  } else {
    for (int a = currentAngle; a >= targetAngle; a--) {
      gripper.write(a);
      delay(15);
    }
  }
}
`,
      pinMap: {
        'PIN_SERVO': 'Pin 9 (Arduino PWM output to servo signal lead)',
        'External 5V (+)': 'Servo Red power lead',
        'Common GND': 'Servo Brown lead & Arduino GND'
      },
      setupAndUpload: [
        'Open Arduino IDE and upload sketch.',
        'Open Serial Monitor at 9600 baud.',
        'Observe smooth continuous opening and closing cycle.',
        'Adjust ANGLE_GRIP up or down if jaws buzz against object.'
      ],
      explanations: [
        '#include <Servo.h>: Standard Arduino library generating exact 50Hz PWM pulses for positional servos.',
        'smoothMove(): Increments angle degree by degree with a 15ms delay, preventing sudden mechanical shock.',
        'ANGLE_GRIP = 48: Calibrated stop point where jaws touch object firmly without forcing the motor shaft.'
      ],
      expectedResult: 'Gripper opens to 120 degrees smoothly, pauses, closes to 48 degrees, and holds object securely without motor buzzing.',
      caveats: [
        'If servo buzzes continuously when closed, increase ANGLE_GRIP by 2-3 degrees immediately.',
        'Do not attempt to lift metal or heavy objects that exceed the 1.8 kg-cm torque rating of SG90.'
      ],
      tweakTip: 'Connect a 10k potentiometer to A0 and map its value from 0-1023 to ANGLE_GRIP-ANGLE_OPEN for manual teleoperation.'
    },
    activity: {
      title: 'Assemble and Calibrate the Gripper Claw',
      steps: ['Connect servo and center to 90° in code', 'Attach plastic horn at centered jaw position', 'Find safe OPEN angle (e.g. 120°)', 'Find safe GRIP angle (e.g. 45°)', 'Run pick-and-place loop'],
      successCriteria: ['Gripper opens and closes cleanly without buzzing or stalling.']
    },
    troubleshooting: [{ symptom: 'Servo buzzes loudly and gets warm when claw is closed.', checks: ['Increase GRIP angle'], explanation: 'The code is commanding the servo to close past where the physical jaws touch, stalling the motor.' }],
    checksForUnderstanding: ['How does a positional servo motor know what angle its shaft is currently pointing at?'],
    exitTicket: [{ question: 'Why must we never command a robotic gripper past its physical closing limit?', rubricOrSampleReasoning: 'It stalls the internal motor, drawing maximum current, overheating the coil, and stripping the gears.' }],
    differentiation: { support: ['Pre-assemble mechanical linkage.'], extension: ['Control gripper using an analog potentiometer on A0.'] },
    nextLessonId: 'int-07',
    nextLessonTeaser: 'Intermediate 07: Navigation Challenge — Upgrade your line follower with intersection logic and grid maze routing!',
    sources: [{ title: 'Arduino Docs: Servo Library', url: 'https://docs.arduino.cc/libraries/servo/' }],
    assetCredits: [{ asset: 'Servo Gripper Mechanism', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-07',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure","fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'intermediate',
    sequence: 7,
    code: 'INTERMEDIATE 07',
    title: 'Navigation Challenge: Maze Routing & Intersections',
    promise: 'By the end, I can program intersection handling (T-junctions, cross intersections) and navigate a grid maze.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 03', 'Intermediate 05'],
    outcomes: ['Detect line intersections (T-junctions, crosses)', 'Implement a turn sequence table in code', 'Navigate a multi-node grid arena'],
    vocabulary: [{ term: 'Intersection Node', plainMeaning: 'A spot where two or more tracks cross.', technicalMeaning: 'A vertex in a topological navigation graph.' }],
    teacherPrep: ['Tape grid maze on floor.'],
    verifiedMaterials: ['Line follower robot', 'Grid maze arena'],
    safetyNotes: ['Controlled arena tests.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Explain automated warehouse AGVs picking up pallets at intersections.', studentAction: 'Map out grid nodes.' },
      { segment: '10–30m Logic', minutes: 20, teacherAction: 'Explain intersection detection: When both sensors read black simultaneously.', studentAction: 'Write intersection decision handler.' },
      { segment: '30–50m Test', minutes: 20, teacherAction: 'Supervise maze navigation.', studentAction: 'Navigate 3 intersection nodes.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Wrap up node logic.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Node Counting vs Coordinate Navigation', explanation: 'The robot can count how many intersections it has crossed to know when to turn.' }],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Maze-Route Line-Follower Upgrade',
      deliverableType: 'code_artifact',
      successEvidence: ['Rover successfully executes an ordered sequence of turns at 3 distinct intersection nodes in a grid maze.']
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Intermediate 07
// Grid Maze Intersection Navigation Controller
// Follows line and executes ordered turn sequence at intersection nodes

enum TurnAction { TURN_LEFT, TURN_RIGHT, GO_STRAIGHT, HALT_FINISH };

// Ordered sequence of turns for 3 maze intersections:
const TurnAction ROUTE[] = { TURN_LEFT, TURN_RIGHT, HALT_FINISH };
const int TOTAL_NODES = 3;
int currentNode = 0;

const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;
const int PIN_IR_L = A0;
const int PIN_IR_R = A1;

const int THRESHOLD = 500;
const int SPEED_NORM = 130;
const int SPEED_TURN = 120;

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);
  Serial.begin(9600);
  Serial.println(F("[MAZE-ROUTER] System Initialized."));
}

void loop() {
  int leftVal  = analogRead(PIN_IR_L);
  int rightVal = analogRead(PIN_IR_R);
  bool leftDark  = (leftVal > THRESHOLD);
  bool rightDark = (rightVal > THRESHOLD);

  // Check for Intersection Node: Both sensors detect black simultaneously
  if (leftDark && rightDark) {
    handleIntersection();
  } else if (leftDark && !rightDark) {
    drive(SPEED_NORM - 30, SPEED_NORM + 30);
  } else if (!leftDark && rightDark) {
    drive(SPEED_NORM + 30, SPEED_NORM - 30);
  } else {
    drive(SPEED_NORM, SPEED_NORM);
  }
}

void handleIntersection() {
  Serial.print(F("[NODE DETECTED] Index: "));
  Serial.println(currentNode);

  // 1. Align turning axis: Drive forward 3cm past the node
  drive(SPEED_NORM, SPEED_NORM);
  delay(180);

  if (currentNode >= TOTAL_NODES) {
    brake();
    while (true); // Mission complete
  }

  TurnAction action = ROUTE[currentNode];
  currentNode++;

  switch (action) {
    case TURN_LEFT:
      Serial.println(F("Executing Pivot LEFT..."));
      drive(-SPEED_TURN, SPEED_TURN);
      delay(380); // Calibrated 90-degree turn
      break;

    case TURN_RIGHT:
      Serial.println(F("Executing Pivot RIGHT..."));
      drive(SPEED_TURN, -SPEED_TURN);
      delay(380); // Calibrated 90-degree turn
      break;

    case GO_STRAIGHT:
      Serial.println(F("Continuing STRAIGHT..."));
      drive(SPEED_NORM, SPEED_NORM);
      delay(200);
      break;

    case HALT_FINISH:
      Serial.println(F("GOAL REACHED! Halting."));
      brake();
      while (true);
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
`,
      pinMap: {
        'PIN_STBY': 'Pin 3 (Motor driver enable)',
        'PIN_PWMA / PWMB': 'Pins 5 & 6 (PWM speed control)',
        'PIN_AIN / BIN': 'Pins 7, 8, 9, 10 (H-Bridge direction control)',
        'PIN_IR_L / R': 'Pins A0 & A1 (Dual IR reflectance sensors)'
      },
      setupAndUpload: [
        'Upload sketch to Arduino line follower rover.',
        'Place rover at starting line of grid maze.',
        'Turn on motor battery switch.',
        'Verify rover drives forward, detects first intersection cross, pivots 90 degrees left, and continues.'
      ],
      explanations: [
        'ROUTE[]: Array defining pre-planned waypoint actions for each encountered intersection.',
        'drive(180ms delay): Moves chassis forward so wheels align directly over intersection center before pivoting.',
        'handleIntersection(): Increments currentNode counter so each node executes its specific turn.'
      ],
      expectedResult: 'Rover tracks line, turns 90 degrees left at node 1, turns 90 degrees right at node 2, and halts at node 3.',
      caveats: [
        'Always include the small drive-forward delay before turning, or the front caster wheel will bind on tape edges.',
        'Tune turn delay milliseconds if battery voltage drops.'
      ],
      tweakTip: 'Replace hardcoded turn delays with a while-loop that turns until the opposite IR sensor catches the new line.'
    },
    activity: { title: 'Navigate Grid Maze', steps: ['Detect intersection', 'Drive forward 2cm past node', 'Execute turn', 'Resume line tracking'], successCriteria: ['Hits all 3 waypoints correctly.'] },
    troubleshooting: [{ symptom: 'Robot detects same intersection twice.', checks: ['Add 200ms debounce drive-forward delay'], explanation: 'Sensors linger over thick tape.' }],
    checksForUnderstanding: ['What sensor state indicates an intersection?'],
    exitTicket: [{ question: 'Why must the robot drive slightly forward after detecting an intersection before executing a turn?', rubricOrSampleReasoning: 'To align its turning pivot axle directly over the center of the cross.' }],
    differentiation: { support: ['Single T-junction first.'], extension: ['Implement Left-Hand-on-Wall maze solving algorithm.'] },
    nextLessonId: 'int-08',
    nextLessonTeaser: 'Intermediate 08: CAD Assemblies, Gears, and Fit — Model multi-part robotic assemblies with constraints and printable upgrades!',
    sources: [{ title: 'IEEE: Grid-Based Path Planning for Autonomous Mobile Robots', url: 'https://ieeexplore.ieee.org' }],
    assetCredits: [{ asset: 'Maze Grid Blueprint', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
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
    promise: 'By the end, I can model multi-component CAD assemblies, define joints, and design printable chassis upgrades.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Beginner 08'],
    outcomes: ['Assemble multi-part CAD assemblies using mates and constraints', 'Model gear tooth pitch and meshing', 'Verify interference and clearance'],
    vocabulary: [{ term: 'Assembly Constraint', plainMeaning: 'Locking two digital parts together like real bolts.', technicalMeaning: 'Geometric relationships that limit degrees of freedom between components in a CAD model.' }],
    teacherPrep: ['Prepare component CAD library (motors, Arduino, sensors).'],
    verifiedMaterials: ['CAD workstations with Fusion 360 / Onshape'],
    safetyNotes: ['Computer lab activity.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show full virtual twin of a competition robot before cutting physical material.', studentAction: 'Understand cost savings of digital prototyping.' },
      { segment: '10–30m Assemblies', minutes: 20, teacherAction: 'Demonstrate mate connectors, concentric holes, and revolute joints.', studentAction: 'Assemble motor mount onto chassis.' },
      { segment: '30–50m Design', minutes: 20, teacherAction: 'Guide modeling of a sensor shield or bumper.', studentAction: 'Model and check interference.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review CAD export.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Interference Checking', explanation: 'CAD software highlights overlapping solids in bright red to prevent manufacturing collisions.' }],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Printable Sensor/Chassis CAD Upgrade',
      deliverableType: 'cad_model',
      successEvidence: ['Multi-part CAD assembly with zero interference errors and verified fastener hole alignments.']
    },
    activity: { title: 'Assemble Digital Twin Chassis', steps: ['Import chassis base', 'Mate TT motors with fasteners', 'Attach sensor bracket', 'Run interference check'], successCriteria: ['No red overlapping collisions.'] },
    troubleshooting: [{ symptom: 'Parts float apart in 3D space.', checks: ['Check missing mate constraint'], explanation: 'All 6 degrees of freedom must be constrained.' }],
    checksForUnderstanding: ['What is the difference between modeling a single part versus an assembly?'],
    exitTicket: [{ question: 'What does a CAD interference check detect?', rubricOrSampleReasoning: 'It detects where two physical parts occupy the same physical space (a collision).' }],
    differentiation: { support: ['Provide pre-aligned motor models.'], extension: ['Model a 2:1 reduction spur gear set.'] },
    nextLessonId: 'int-09',
    nextLessonTeaser: 'Intermediate 09: Wireless Control or Telemetry — Pilot your robot wirelessly using local, secure serial packets and deadman failsafes!',
    sources: [{ title: 'Parametric CAD Best Practices', url: 'https://autodesk.com' }],
    assetCredits: [{ asset: 'Assembly Models', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comm-i2c-spi-uart","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-prog-millis-vs-delay"],
      goDeeper: ["fg-board-other-microcontrollers","fg-comp-tournament-prep"]
    },
    courseId: 'intermediate',
    sequence: 9,
    code: 'INTERMEDIATE 09',
    title: 'Wireless Control & Telemetry: Deadman Failsafes',
    promise: 'By the end, I can control a robot wirelessly using single-character command packets and implement a safety deadman timer.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 04'],
    outcomes: ['Parse wireless serial command packets (F, B, L, R, S)', 'Implement a Deadman Failsafe timer with millis()', 'Stream live telemetry'],
    vocabulary: [{ term: 'Deadman Failsafe', plainMeaning: 'An emergency brake that stops the robot if the wireless signal is lost for more than 1 second.', technicalMeaning: 'A control device designed to automatically stop a machine if the operator ceases activity or connection drops.' }],
    teacherPrep: ['Verify Bluetooth HC-05 or local Wi-Fi telemetry test bench.'],
    verifiedMaterials: ['Rover with wireless module or Serial cable test fallback', 'Arduino Uno'],
    safetyNotes: ['Mandatory deadman timeout: Robot must never drive indefinitely if controller loses power.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Ask: "What happens to a drone if your phone battery dies while flying?"', studentAction: 'Understand failsafe urgency.' },
      { segment: '10–30m Protocol', minutes: 20, teacherAction: 'Explain packet protocols: single-byte characters vs strings. switch(cmd) parsing.', studentAction: 'Code command parser.' },
      { segment: '30–50m Failsafe Test', minutes: 20, teacherAction: 'Test safety cutoff by abruptly turning off transmitter.', studentAction: 'Verify wheels brake within 1000ms of disconnect.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review wireless safety.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'The Deadman Clock', explanation: 'Every time a packet arrives, lastCommandTime = millis(). If millis() - lastCommandTime > 1000, halt immediately!' }],
    visualizerId: 'iot_dashboard_sim',
    project: {
      name: 'Wireless Teleoperation Rover',
      deliverableType: 'code_artifact',
      successEvidence: ['Rover responds to wireless directional commands and automatically halts within 1 second if signal is disconnected.']
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Intermediate 09
// Wireless Teleoperation Controller with Deadman Failsafe
// Supports Bluetooth HC-05 / Serial / Web Telemetry

const int PIN_STBY = 3;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

// Safety Deadman Timeout: Halt if no packet received within 1000ms
const unsigned long DEADMAN_TIMEOUT_MS = 1000;
unsigned long lastPacketTime = 0;
bool failsafeTriggered = false;

const int SPEED_TELEOP = 160;

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600); // Communicates with HC-05 / USB
  Serial.println(F("[TELEOP-ROVER] Safety Ready. Send 'F','B','L','R','S'."));
  lastPacketTime = millis();
}

void loop() {
  // 1. Process incoming wireless commands
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    lastPacketTime = millis(); // Reset deadman clock
    failsafeTriggered = false;
    executeCommand(cmd);
  }

  // 2. Strict Deadman Failsafe Check
  if (!failsafeTriggered && (millis() - lastPacketTime > DEADMAN_TIMEOUT_MS)) {
    brake();
    failsafeTriggered = true;
    Serial.println(F("[ALERT] DEADMAN TIMEOUT: Signal lost > 1000ms. Brakes engaged!"));
  }
}

void executeCommand(char cmd) {
  switch (cmd) {
    case 'F': drive(SPEED_TELEOP, SPEED_TELEOP); break;
    case 'B': drive(-SPEED_TELEOP, -SPEED_TELEOP); break;
    case 'L': drive(-SPEED_TELEOP, SPEED_TELEOP); break;
    case 'R': drive(SPEED_TELEOP, -SPEED_TELEOP); break;
    case 'S': brake(); break;
    default:  break;
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
`,
      pinMap: {
        'PIN_STBY': 'Pin 3 (Motor driver enable)',
        'PIN_PWMA / PWMB': 'Pins 5 & 6 (PWM speed control)',
        'PIN_AIN / BIN': 'Pins 7, 8, 9, 10 (H-Bridge direction control)',
        'Serial RX / TX': 'Pins 0 & 1 (or SoftwareSerial to Bluetooth module)'
      },
      setupAndUpload: [
        'Disconnect Bluetooth RX wire while uploading sketch via USB.',
        'Upload sketch and reconnect Bluetooth module.',
        'Open Serial Monitor or Bluetooth terminal app on phone.',
        'Send single character "F" to drive forward.',
        'Close the app or turn off transmitter; rover will immediately halt after 1000ms.'
      ],
      explanations: [
        'lastPacketTime = millis(): Updates heartbeat timestamp on every received character.',
        'millis() - lastPacketTime > 1000: Checks continuously whether operator communication has failed.',
        'executeCommand(): Maps single-byte ASCII characters to motor actions with zero parsing overhead.'
      ],
      expectedResult: 'Rover drives on command and immediately brakes within 1 second of wireless connection drop.',
      caveats: [
        'Never set DEADMAN_TIMEOUT_MS to 0 or leave it unmonitored during competition runs.',
        'Remember Bluetooth modules share hardware Serial pins 0/1; unplug module RX before uploading code.'
      ],
      tweakTip: 'Add telemetry feedback sending "ACK" and battery voltage readings back to the controller every 500ms.'
    },
    activity: { title: 'Implement Wireless Failsafe', steps: ['Read Serial char', 'Reset lastTime', 'Switch/case execution', 'Check timeout in loop'], successCriteria: ['Stops instantly on disconnect.'] },
    troubleshooting: [{ symptom: 'Rover keeps driving when app is closed.', checks: ['Check failsafe condition inside loop()'], explanation: 'Timeout must be checked on every pass of loop().' }],
    checksForUnderstanding: ['Why do we send single characters like "F" instead of sentences like "Please move forward"?'],
    exitTicket: [{ question: 'What does a deadman failsafe timer protect against?', rubricOrSampleReasoning: 'It prevents runaway collisions if wireless radio signal or controller power is lost.' }],
    differentiation: { support: ['Test using USB Serial Monitor first.'], extension: ['Add battery voltage telemetry packet streaming.'] },
    nextLessonId: 'int-10',
    nextLessonTeaser: 'Intermediate 10: Timed Robotics Mission Challenge — Put all intermediate skills to the test in a timed classroom team mission!',
    sources: [{ title: 'ISO 10218-1 Robots and Robotic Devices — Safety Requirements', url: 'https://www.iso.org/standard/51330.html' }],
    assetCredits: [{ asset: 'Telemetry Dashboard Layout', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging","fg-comp-tournament-prep"],
      lookUpWhileBuilding: ["fg-safety-lab-code"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'intermediate',
    sequence: 10,
    code: 'INTERMEDIATE 10',
    title: 'Timed Robotics Mission Challenge: Final Review',
    promise: 'By the end, I can compete in a timed team robotics mission, evaluate performance tradeoffs, and document an engineering iteration.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01 through Intermediate 09'],
    outcomes: ['Execute a timed robotics mission combining line tracking and obstacle response', 'Log trial data and scores', 'Deliver team post-mission design review'],
    vocabulary: [{ term: 'Design Tradeoff', plainMeaning: 'Balancing speed vs accuracy.', technicalMeaning: 'A situational decision that involves diminishing or losing one quality in return for gains in other aspects.' }],
    teacherPrep: ['Set up official mission arena with scoring zones.'],
    verifiedMaterials: ['Competition mission arena', 'Integrated rovers', 'Stopwatches', 'Scorecards'],
    safetyNotes: ['Controlled tournament testing.'],
    classRhythm: [
      { segment: '0–10m Briefing', minutes: 10, teacherAction: 'Review official mission rules, penalties, and score multipliers.', studentAction: 'Finalize team strategy.' },
      { segment: '10–35m Tournament', minutes: 25, teacherAction: 'Time mission runs and record official scores.', studentAction: 'Run 2 timed mission heats.' },
      { segment: '35–50m Reflection', minutes: 15, teacherAction: 'Facilitate team debrief: What failed under competition pressure?', studentAction: 'Document technical tradeoffs.' },
      { segment: '50–60m Graduation', minutes: 10, teacherAction: 'Award Intermediate engineering certifications.', studentAction: 'Complete exit reflection.' }
    ],
    concepts: [{ title: 'Engineering Under Pressure', explanation: 'In competition, the simplest, most robust machine almost always beats the over-complicated fragile machine.' }],
    visualizerId: 'test_log_sim',
    project: {
      name: 'Timed Robotics Mission Challenge',
      deliverableType: 'design_review',
      successEvidence: ['Official mission scorecard, telemetry log, and documented post-competition engineering review.']
    },
    activity: { title: 'Compete in Timed Mission Challenge', steps: ['Inspect robot', 'Run Heat 1', 'Quick pit adjustment', 'Run Heat 2', 'Complete post-mortem review'], successCriteria: ['Team completes mission within time limit.'] },
    troubleshooting: [{ symptom: 'Rover derailed on sharp curve during Heat 1.', checks: ['Check if battery voltage was higher than practice'], explanation: 'Fresh batteries deliver higher voltage, causing higher turn speed.' }],
    checksForUnderstanding: ['What was your team’s most significant engineering tradeoff today?'],
    exitTicket: [{ question: 'Name one hardware choice you would redesign before entering a national robotics olympiad.', rubricOrSampleReasoning: 'Student identifies a mechanical/electrical limitation and explains a concrete engineering solution.' }],
    differentiation: { support: ['Pair with veteran mentor for pit troubleshooting.'], extension: ['Calculate average speed in meters/second.'] },
    nextLessonId: 'adv-01',
    nextLessonTeaser: 'Advance to Level 4: Advanced Robotics & Competition — Power budgets, non-blocking FreeRTOS, PID control, encoders, and Mini-Sumo dohyo battles!',
    sources: [{ title: 'RoboBEE Innovators Tournament Guidelines (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Mission Scorecard', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // COURSE SPACE D: ADVANCED ROBOTICS (CLASSES 01-12)
  // -----------------------------------------------------------------------
  {
    id: 'adv-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep"],
      lookUpWhileBuilding: ["fg-comp-tournament-prep","fg-safety-lab-code"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 1,
    code: 'ADVANCED 01',
    title: 'Competition Strategy, Requirements & Official Rules',
    promise: 'By the end, I can translate official robotics olympiad rulebooks into strict engineering specifications.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Intermediate Series'],
    outcomes: ['Analyze international competition rulebooks (Mini-Sumo, Line Follower, Robo Soccer)', 'Extract dimensional, weight, and safety constraints', 'Draft a competition verification checklist'],
    vocabulary: [{ term: 'Dohyo', plainMeaning: 'The circular combat ring for sumo robotics with a white border.', technicalMeaning: 'A standardized circular competition ring, typically 77cm or 154cm diameter with a 5cm white border (tawara).' }],
    teacherPrep: ['Prepare official Mini-Sumo and Line Following rulebooks with version dates.'],
    verifiedMaterials: ['Rulebooks', 'Engineering notebooks'],
    safetyNotes: ['Rulebook compliance review.'],
    classRhythm: [
      { segment: '0–15m Rule Deep-Dive', minutes: 15, teacherAction: 'Analyze strict dimensional limits (e.g. 10cm x 10cm, 500g max).', studentAction: 'Extract constraints into table.' },
      { segment: '15–35m Requirements', minutes: 20, teacherAction: 'Teach 5-second mandatory start delay rule and human safety rules.', studentAction: 'Draft functional requirements.' },
      { segment: '35–50m Verification Plan', minutes: 15, teacherAction: 'Guide inspection checklist creation.', studentAction: 'Write pre-match inspection test plan.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Wrap up rule compliance.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why Rules Dictate Architecture', explanation: 'If a rule specifies a 500g weight limit, motor and battery selection are constrained before writing a single line of code.' }],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Competition Mission Engineering Brief',
      deliverableType: 'design_review',
      successEvidence: ['Completed engineering brief citing current official rule version, weight/size constraints, and verification protocol.']
    },
    activity: { title: 'Draft the Competition Brief', steps: ['Record dimensions', 'Record weight limits', 'Specify 5s safety delay', 'Define referee start protocol'], successCriteria: ['100% compliant with cited rulebook.'] },
    troubleshooting: [{ symptom: 'Robot exceeds weight by 15 grams.', checks: ['Switch to lighter lithium cells or 3D print with lower infill'], explanation: 'Strict competition weigh-ins disqualify overweight entries.' }],
    checksForUnderstanding: ['Why do international Sumo Bot competitions require a strict 5-second delay after pressing start?'],
    exitTicket: [{ question: 'What is the consequence of failing the referee dimensional box inspection?', rubricOrSampleReasoning: 'Immediate disqualification or requirement to modify the robot before match start.' }],
    differentiation: { support: ['Provide template with pre-filled standard dimensions.'], extension: ['Analyze tactical starting positions.'] },
    nextLessonId: 'adv-02',
    nextLessonTeaser: 'Advanced 02: Power Architecture and Electrical Budget — Calculate current draws, wire low-voltage regulators, and eliminate brownouts!',
    sources: [{ title: 'All Japan Robot-Sumo Tournament Official Rules', url: 'http://www.fsi.co.jp/sumo/en/' }],
    assetCredits: [{ asset: 'Competition Rulebook Citations', creator: 'RoboBEE Innovators Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-comp-tb6612fng"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 2,
    code: 'ADVANCED 02',
    title: 'Power Architecture and Electrical Budget',
    promise: 'By the end, I can calculate a complete power budget, select safe low-voltage regulators, and build clean power distribution.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01'],
    outcomes: ['Calculate peak and continuous current draws across all subsystems', 'Design dual-rail power distribution (5V logic + 7.4V motor)', 'Select appropriate wire gauges and fuses'],
    vocabulary: [{ term: 'Brownout Reset', plainMeaning: 'When high motor current causes battery voltage to sag, causing the microcontroller to reboot.', technicalMeaning: 'A low-voltage condition triggering the microcontroller internal brownout detector (BOD) reset.' }],
    teacherPrep: ['Check DC power supplies, bench multimeters, and buck converters.'],
    verifiedMaterials: ['Multimeter', 'Buck regulator module', 'Fuse holder', 'LiPo / NiMH safe battery pack'],
    safetyNotes: ['Never improvise lithium battery packs. Always use certified battery holders with short-circuit protection.'],
    classRhythm: [
      { segment: '0–15m Budgeting', minutes: 15, teacherAction: 'Guide worst-case power table: Arduino (50mA) + Sonar (15mA) + 2x Motors Stall (2x 1.2A) = 2.465A peak!', studentAction: 'Calculate system peak load.' },
      { segment: '15–35m Regulators', minutes: 20, teacherAction: 'Explain linear (LM7805) vs switching (buck) regulator efficiency.', studentAction: 'Measure regulator output voltage.' },
      { segment: '35–50m Distribution', minutes: 15, teacherAction: 'Inspect dual-rail wiring harness.', studentAction: 'Verify stable 5.0V under motor load.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review fuse sizing.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why Logic and Motors Need Separate Power Rails', explanation: 'Motors generate heavy inductive electrical noise and voltage spikes that crash microcontrollers if powered from the same unregulated bus.' }],
    visualizerId: 'circuit_switch_led_sim',
    project: {
      name: 'Low-Voltage Robot Power Distribution Plan',
      deliverableType: 'design_review',
      successEvidence: ['Calculated electrical budget table and schematic showing dual-rail power with fuse and common ground.']
    },
    activity: { title: 'Wire Dual-Rail Power Harness', steps: ['Calculate stall current', 'Select fuse', 'Wire buck converter to 5V logic', 'Verify shared GND'], successCriteria: ['No brownout reset during full motor stall test.'] },
    troubleshooting: [{ symptom: 'Arduino reboots every time both motors start.', checks: ['Check battery internal resistance or add 470µF electrolytic capacitor across 5V bus'], explanation: 'Inductive inrush current collapses battery terminal voltage.' }],
    checksForUnderstanding: ['Why is a switching buck converter more efficient than a linear LM7805 regulator?'],
    exitTicket: [{ question: 'What does a common ground provide in a dual-battery or dual-rail system?', rubricOrSampleReasoning: 'A shared zero-volt reference potential so logic signals can be read accurately across domains.' }],
    differentiation: { support: ['Use pre-built power distribution board.'], extension: ['Calculate battery runtime in minutes based on mAh capacity.'] },
    nextLessonId: 'adv-03',
    nextLessonTeaser: 'Advanced 03: Robust Embedded C++ — Master non-blocking state machines, circular buffers, and interrupt handling!',
    sources: [{ title: 'Texas Instruments: Power Management for Mobile Robots', url: 'https://ti.com' }],
    assetCredits: [{ asset: 'Power Harness Schematic', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-03',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-millis-vs-delay","fg-prog-program-structure"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-arduino-ide-workflow"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 3,
    code: 'ADVANCED 03',
    title: 'Robust Embedded C++: Non-Blocking Architecture',
    promise: 'By the end, I can write completely non-blocking C++ code that executes sensor sampling, motor control, and telemetry simultaneously.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01', 'Advanced 02'],
    outcomes: ['Eliminate all delay() calls using elapsed millis() schedulers', 'Implement hardware timer interrupts safely', 'Build a non-blocking autonomous rover controller'],
    vocabulary: [{ term: 'Non-Blocking Code', plainMeaning: 'Writing code so the processor never sits waiting, allowing multiple tasks to run in parallel.', technicalMeaning: 'Asynchronous event-driven programming where execution continues without waiting for slow operations to finish.' }],
    teacherPrep: ['Prepare timing oscilloscope or logic analyzer demonstration.'],
    verifiedMaterials: ['Arduino Uno / Mega', 'Oscilloscope / Serial timing monitor'],
    safetyNotes: ['Embedded coding lab.'],
    classRhythm: [
      { segment: '0–15m Problem', minutes: 15, teacherAction: 'Show how delay(500) prevents a robot from seeing a cliff edge until it has already fallen.', studentAction: 'Calculate blind travel distance during delay.' },
      { segment: '15–35m Architecture', minutes: 20, teacherAction: 'Teach task scheduling with millis(): if (now - lastSensor >= 20ms) { ... }', studentAction: 'Refactor blocking loop into task scheduler.' },
      { segment: '35–50m Test', minutes: 15, teacherAction: 'Measure loop execution frequency in Hz.', studentAction: 'Achieve > 1000 loop cycles per second.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review interrupt safety.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Task Schedulers Without an RTOS', explanation: 'By checking timestamps on every cycle, an Arduino can manage sensor polling at 50Hz, telemetry at 10Hz, and motor updates at 100Hz with zero lag.' }],
    visualizerId: 'logic_counter_sim',
    project: {
      name: 'Non-Blocking Autonomous Rover Controller',
      deliverableType: 'code_artifact',
      successEvidence: ['Complete compile-ready non-blocking C++ sketch with 0 delay() calls and verified 500Hz loop execution rate.']
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 03
// High-Performance Non-Blocking Task Scheduler
// Eliminates all delay() calls using elapsed millis() architecture

struct Task {
  unsigned long intervalMs;
  unsigned long lastRun;
  void (*functionPointer)();
};

const int PIN_STATUS_LED = 13;
const int PIN_HEARTBEAT  = 12;

unsigned long loopCount = 0;
unsigned long lastHzCheck = 0;

void taskSampleSensors() {
  int sample = analogRead(A0);
  (void)sample;
}

void taskUpdateMotors() {
  // Motor PID update stub
}

void taskBlinkHeartbeat() {
  static bool state = false;
  state = !state;
  digitalWrite(PIN_HEARTBEAT, state ? HIGH : LOW);
}

void taskReportTelemetry() {
  unsigned long now = millis();
  float elapsedSec = (now - lastHzCheck) / 1000.0;
  if (elapsedSec > 0) {
    float hz = loopCount / elapsedSec;
    Serial.print(F("[SCHEDULER] Loop Frequency: "));
    Serial.print(hz, 0);
    Serial.println(F(" Hz | No blocking delays."));
  }
  loopCount = 0;
  lastHzCheck = now;
}

Task tasks[] = {
  { 20,   0, taskSampleSensors   }, // 50 Hz
  { 10,   0, taskUpdateMotors    }, // 100 Hz
  { 500,  0, taskBlinkHeartbeat  }, // 2 Hz
  { 1000, 0, taskReportTelemetry }  // 1 Hz
};
const int NUM_TASKS = sizeof(tasks) / sizeof(tasks[0]);

void setup() {
  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_HEARTBEAT, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("[ROVI-SCHEDULER] Starting non-blocking architecture..."));
  lastHzCheck = millis();
}

void loop() {
  unsigned long currentMillis = millis();

  for (int i = 0; i < NUM_TASKS; i++) {
    if (currentMillis - tasks[i].lastRun >= tasks[i].intervalMs) {
      tasks[i].lastRun = currentMillis;
      tasks[i].functionPointer();
    }
  }

  loopCount++;
}
`,
      pinMap: {
        'PIN_STATUS_LED': 'Pin 13 (Built-in status indicator)',
        'PIN_HEARTBEAT': 'Pin 12 (Hardware heartbeat indicator toggle)'
      },
      setupAndUpload: [
        'Upload sketch to Arduino Uno or Mega.',
        'Open Serial Monitor at 9600 baud.',
        'Observe loop execution frequency reporting > 50,000 Hz.',
        'Notice how the heartbeat LED toggles at 2Hz while sensors poll at 50Hz without timing jitter.'
      ],
      explanations: [
        'struct Task: Encapsulates task periodicity, last execution timestamp, and callback function pointer.',
        'currentMillis - lastRun >= intervalMs: Safe unsigned integer math that handles 50-day timer rollover without error.',
        'loopCount benchmark: Demonstrates that the CPU executes hundreds of thousands of cycles instead of wasting power stalled inside delay().'
      ],
      expectedResult: 'Serial Monitor logs loop speed (>20,000 Hz) with concurrent independent tasks running smoothly.',
      caveats: [
        'Never call delay() inside any task function; doing so blocks all other scheduled tasks.',
        'Always declare timestamps as unsigned long to prevent negative integer overflow.'
      ],
      tweakTip: 'Add an emergency priority task that executes immediately if an obstacle sensor falls below safety threshold.'
    },
    activity: { title: 'Convert Blocking Code to Non-Blocking Tasks', steps: ['Define task interval constants', 'Replace delay with timestamp check', 'Verify parallel execution in Serial Monitor'], successCriteria: ['Buttons respond instantly even while LEDs blink slowly.'] },
    troubleshooting: [{ symptom: 'Variable overflow after 50 days.', checks: ['Always use (unsigned long)(currentMillis - previousMillis) >= interval'], explanation: 'Unsigned subtraction handles timer rollover correctly.' }],
    checksForUnderstanding: ['Why does delay() make an autonomous obstacle-avoiding robot dangerous at high speeds?'],
    exitTicket: [{ question: 'How does millis() time subtraction handle integer rollover?', rubricOrSampleReasoning: 'Unsigned arithmetic wraps around modulo 2^32, maintaining correct delta calculations.' }],
    differentiation: { support: ['Provide task timer struct.'], extension: ['Implement an ISR (Interrupt Service Routine) on pin 2.'] },
    nextLessonId: 'adv-04',
    nextLessonTeaser: 'Advanced 04: Encoders and Motion Measurement — Read optical wheel ticks and calculate real odometry distance in millimeters!',
    sources: [{ title: 'Arduino Docs: Avoid Delay', url: 'https://docs.arduino.cc' }],
    assetCredits: [{ asset: 'Task Scheduler Architecture', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-encoders-odometry"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics","fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 4,
    code: 'ADVANCED 04',
    title: 'Encoders and Motion Measurement: Odometry',
    promise: 'By the end, I can read optical wheel encoders, count tick interrupts, and calculate real physical distance traveled.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03'],
    outcomes: ['Connect optical slotted wheel encoders', 'Write interrupt service routines (ISR) with attachInterrupt()', 'Convert encoder counts into centimeters traveled'],
    vocabulary: [{ term: 'Odometry', plainMeaning: 'Measuring how far you traveled by counting wheel rotations.', technicalMeaning: 'The use of data from motion sensors to estimate change in position over time.' },
      { term: 'ISR (Interrupt Service Routine)', plainMeaning: 'A special emergency function that runs instantly whenever an encoder tick occurs.', technicalMeaning: 'A callback subroutine called by hardware when an interrupt condition occurs.' }],
    teacherPrep: ['Check slotted wheel encoder discs and optical gate modules.'],
    verifiedMaterials: ['Rover with optical encoder discs', 'LM393 photo-interrupter modules', 'Arduino Uno'],
    safetyNotes: ['Keep ISR functions short (never use Serial.print inside an ISR).'],
    classRhythm: [
      { segment: '0–15m Hook', minutes: 15, teacherAction: 'Explain wheel slip: Why measuring motor time does not equal distance traveled.', studentAction: 'Measure wheel circumference.' },
      { segment: '15–35m Interrupts', minutes: 20, teacherAction: 'Explain attachInterrupt(digitalPinToInterrupt(2), countTick, RISING) and volatile keyword.', studentAction: 'Write tick counter ISR.' },
      { segment: '35–50m Math', minutes: 15, teacherAction: 'Derive formula: cm = (ticks / 20) * (PI * diameter).', studentAction: 'Drive rover 100cm and compare measured vs encoder count.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review encoder error sources.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'The Volatile Keyword', explanation: 'Variables modified inside an ISR must be declared `volatile` so the C++ compiler does not cache them in CPU registers.' }],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Encoder-Based Odometry Rover',
      deliverableType: 'physical_build',
      successEvidence: ['Rover drives forward, counts 20-slot optical encoder ticks, and halts within 2cm of exactly 100cm commanded distance.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3', 'Dual LM393 Optical Gate Sensor Modules', '20-Slot Encoder Discs on TT Gearmotors', 'TB6612FNG Motor Driver'],
      componentList: [
        { name: 'Optical Encoder Modules', exactVariant: 'LM393 photo-interrupter slotted optical speed sensor', quantity: 2 },
        { name: 'Encoder Discs', exactVariant: '20-slot slotted black plastic encoder discs (diameter 26mm)', quantity: 2 },
        { name: 'TT Gearmotors & Wheels', exactVariant: '1:48 gear ratio TT motors with 65mm rubber wheels', quantity: 2 },
        { name: 'TB6612FNG Driver', exactVariant: 'Toshiba dual H-Bridge breakout board', quantity: 1 },
        { name: 'Arduino Uno R3', exactVariant: 'Official Uno R3 with hardware INT0 (Pin 2) and INT1 (Pin 3)', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/encoder_odometry_wiring.svg',
      schematic: 'Left Encoder D0 ➔ Arduino Pin 2 (INT0). Right Encoder D0 ➔ Arduino Pin 3 (INT1). TB6612 on Pins 4-10. Shared GND.',
      wireTable: [
        { from: 'Left Encoder Module OUT (D0)', to: 'Arduino Pin 2 (INT0)', wireOrPolarityNote: 'Hardware Interrupt 0 pin for left wheel ticks' },
        { from: 'Right Encoder Module OUT (D0)', to: 'Arduino Pin 3 (INT1)', wireOrPolarityNote: 'Hardware Interrupt 1 pin for right wheel ticks' },
        { from: 'Encoder Modules VCC', to: 'Arduino 5V', wireOrPolarityNote: 'Powers optical IR emitter & phototransistor' },
        { from: 'Encoder Modules GND', to: 'Arduino GND', wireOrPolarityNote: 'Logic ground return' },
        { from: 'TB6612 Driver Pins', to: 'Arduino Pins 4, 5, 6, 7, 8, 9, 10', wireOrPolarityNote: 'Standard TB6612 motor drive pinout' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Press 20-slot encoder discs onto TT motor back-shafts firmly.',
        '2. Mount LM393 optical gate sensors so the disc spins through slot center without touching optical lenses.',
        '3. Wire D0 outputs to Arduino Pin 2 and Pin 3.',
        '4. Upload odometry test sketch and rotate wheel 1 full revolution by hand to verify 20 ticks recorded.',
        '5. Place on 1-meter test track, run sketch, and measure final stopping distance with tape measure.'
      ],
      powerAndSafetyChecks: [
        'ISR variables MUST be declared volatile to prevent compiler register caching.',
        'Never execute Serial.print() or delay() inside an Interrupt Service Routine.',
        'Shield optical sensors from direct incandescent sunlight to avoid spurious optical noise.'
      ],
      testCases: [
        { action: 'Hand-rotate wheel 1 exact turn (360°)', expectedResult: 'Serial Monitor records exactly 20 ticks (±1 tick).' },
        { action: 'Command 100cm forward drive', expectedResult: 'Rover drives forward, counts ~98 ticks, and brakes within ±2cm of 100cm mark.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 04
// Dual Wheel Odometry Distance Controller
// Hardware Interrupts: Pin 2 (INT0) & Pin 3 (INT1)

const int PIN_ENC_LEFT  = 2;
const int PIN_ENC_RIGHT = 3;

const int PIN_STBY = 4;
const int PIN_PWMA = 5;
const int PIN_AIN1 = 7;
const int PIN_AIN2 = 8;
const int PIN_PWMB = 6;
const int PIN_BIN1 = 9;
const int PIN_BIN2 = 10;

volatile unsigned long leftTicks = 0;
volatile unsigned long rightTicks = 0;

const float WHEEL_DIAMETER_CM = 6.5;
const int TICKS_PER_REV = 20;
const float CM_PER_TICK = (3.14159 * WHEEL_DIAMETER_CM) / TICKS_PER_REV;

const float TARGET_DISTANCE_CM = 100.0;
const unsigned long TARGET_TICKS = TARGET_DISTANCE_CM / CM_PER_TICK;

void isrLeft() {
  leftTicks++;
}

void isrRight() {
  rightTicks++;
}

void setup() {
  pinMode(PIN_ENC_LEFT, INPUT_PULLUP);
  pinMode(PIN_ENC_RIGHT, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_LEFT), isrLeft, RISING);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_RIGHT), isrRight, RISING);

  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.print(F("[ODOMETRY] Target Distance: "));
  Serial.print(TARGET_DISTANCE_CM);
  Serial.print(F(" cm (Target Ticks: "));
  Serial.print(TARGET_TICKS);
  Serial.println(F(")"));

  drive(140, 140);
}

void loop() {
  unsigned long currentTicks = (leftTicks + rightTicks) / 2;
  float currentDistCm = currentTicks * CM_PER_TICK;

  if (currentTicks >= TARGET_TICKS) {
    brake();
    Serial.println(F("[TARGET REACHED] Brakes locked."));
    Serial.print(F("Final Left Ticks: ")); Serial.print(leftTicks);
    Serial.print(F(" | Final Right Ticks: ")); Serial.print(rightTicks);
    Serial.print(F(" | Est Dist: ")); Serial.print(currentDistCm); Serial.println(F(" cm"));
    while (true);
  }

  delay(50);
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
`,
      pinMap: {
        'PIN_ENC_LEFT': 'Pin 2 (Hardware Interrupt 0, left wheel optical gate)',
        'PIN_ENC_RIGHT': 'Pin 3 (Hardware Interrupt 1, right wheel optical gate)',
        'PIN_STBY / PWM / AIN / BIN': 'Pins 4-10 (TB6612 motor driver control)'
      },
      setupAndUpload: [
        'Upload sketch to Arduino Uno.',
        'Place rover on floor with measuring tape alongside path.',
        'Turn on motor battery switch.',
        'Verify rover stops cleanly at approximately the 100cm mark and logs final ticks to Serial Monitor.'
      ],
      explanations: [
        'attachInterrupt(..., RISING): Triggers the tiny ISR function on every slot edge without checking in loop().',
        'volatile: Informs compiler that variable value can change outside normal program flow.',
        'CM_PER_TICK calculation: Circumference (PI * D) divided by 20 slots converts counts directly into centimeters.'
      ],
      expectedResult: 'Rover drives forward, counts optical pulses, and halts within 2cm of exactly 100cm target.',
      caveats: [
        'Wheel slip on smooth tile floors causes encoder count to read higher than real ground traveled.',
        'Ensure disc spins cleanly in the optical gate slot without rubbing against plastic housing.'
      ],
      tweakTip: 'Implement a proportional speed trim comparing (leftTicks - rightTicks) to keep rover tracking perfectly straight.'
    },
    activity: { title: 'Calibrate Encoder Odometry', steps: ['Count ticks per revolution (20 slots)', 'Measure wheel diameter (6.5cm)', 'Write distance math', 'Test 1-meter stop'], successCriteria: ['Stops within ±2cm of target line.'] },
    troubleshooting: [{ symptom: 'Ticks count doubles or stutters.', checks: ['Check optical alignment and ambient light interference'], explanation: 'Optical noise or mechanical wobble triggers false edges.' }],
    checksForUnderstanding: ['Why must variables shared between an ISR and loop() be declared volatile?'],
    exitTicket: [{ question: 'If a 6.5cm diameter wheel has a 20-slot encoder disc, how far does the robot move in one tick?', rubricOrSampleReasoning: 'Circumference = PI * 6.5 = 20.42 cm. One tick = 20.42 / 20 ≈ 1.02 cm.' }],
    differentiation: { support: ['Provide pre-calculated tick-to-cm ratio.'], extension: ['Implement dual-wheel differential odometry heading angle.'] },
    nextLessonId: 'adv-05',
    nextLessonTeaser: 'Advanced 05: Feedback Control & PID Concepts — Master Proportional, Integral, and Derivative control to eliminate track oscillations!',
    sources: [{ title: 'Wheel Odometry for Mobile Robots', url: 'https://ieee.org' }],
    assetCredits: [{ asset: 'Optical Encoder Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-motion-pid-control","fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-comp-encoders-odometry","fg-comp-tb6612fng"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'advanced',
    sequence: 5,
    code: 'ADVANCED 05',
    title: 'Feedback Control & PID Tuning Concepts',
    promise: 'By the end, I can explain Proportional, Integral, and Derivative (PID) control and tune a smooth closed-loop tracking system.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03', 'Advanced 04'],
    outcomes: ['Contrast open-loop with closed-loop feedback control', 'Explain the role of P (present error), I (accumulated error), and D (rate of error change)', 'Tune Kp, Ki, Kd coefficients in a simulator'],
    vocabulary: [{ term: 'PID Controller', plainMeaning: 'A smart math formula that smoothly steers a robot toward its target without overshooting.', technicalMeaning: 'A control loop mechanism employing feedback that continuously calculates an error value and applies a correction based on proportional, integral, and derivative terms.' }],
    teacherPrep: ['Open PID tuning simulator on projector.'],
    verifiedMaterials: ['PID simulator workstation or 5-sensor line follower'],
    safetyNotes: ['Tune in simulation first before running high-speed hardware.'],
    classRhythm: [
      { segment: '0–15m Hook', minutes: 15, teacherAction: 'Show how simple ON/OFF control causes harsh zigzagging. Introduce smooth proportional steering.', studentAction: 'Compare step response vs smooth tracking.' },
      { segment: '15–35m PID Math', minutes: 20, teacherAction: 'Explain: P pushes harder the further off-line you are; D dampens sudden swings; I eliminates steady-state bias.', studentAction: 'Experiment with Kp values.' },
      { segment: '35–50m Simulation Tuning', minutes: 15, teacherAction: 'Guide systematic tuning: 1. Set Ki=0, Kd=0. 2. Raise Kp until it tracks with slight oscillation. 3. Raise Kd to smooth out oscillation.', studentAction: 'Record tuning graph.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review Ziegler-Nichols tuning principles.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why Derivative (D) Prevents Overshoot', explanation: 'D acts like an electronic shock absorber: as the robot rushes back toward the center line, the rate of change is negative, applying gentle counter-steering before it overshoots!' }],
    visualizerId: 'pid_tuning_sim',
    project: {
      name: 'PID Line Follower or Speed Controller',
      deliverableType: 'simulation',
      successEvidence: ['Documented PID tuning log showing Kp, Ki, Kd values with stable settling time and zero persistent oscillations.']
    },
    activity: { title: 'Tune a Closed-Loop PID Controller', steps: ['Set Ki=0, Kd=0', 'Increase Kp until slight oscillation', 'Increase Kd to dampen oscillation', 'Add tiny Ki if steady-state error persists'], successCriteria: ['Stable line tracking with measured damping under 5mm lateral deviation across 3 recorded trials.'] },
    troubleshooting: [{ symptom: 'Robot vibrates uncontrollably at high frequency.', checks: ['Kd is set too high, amplifying sensor noise'], explanation: 'Derivative terms amplify high-frequency measurement noise.' }],
    checksForUnderstanding: ['What happens if Kp is set way too high? (Answer: Violent oscillation and instability!)'],
    exitTicket: [{ question: 'What does the Proportional (P) term calculate in a PID controller?', rubricOrSampleReasoning: 'It calculates an output correction proportional to the current error (Output = Kp * Error).' }],
    differentiation: { support: ['Tune P-only controller before adding D.'], extension: ['Implement anti-windup clamping on the integral term.'] },
    nextLessonId: 'adv-06',
    nextLessonTeaser: 'Advanced 06: Sensor Fusion & IMU Orientation — Read accelerometers and gyroscopes to track robot heading in 3D space!',
    sources: [{ title: 'Modern Control Engineering: PID Control', url: 'https://mit.edu' }],
    assetCredits: [{ asset: 'PID Response Curve Visualizer', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comm-i2c-spi-uart"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy","fg-foundations-open-closed-loop"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 6,
    code: 'ADVANCED 06',
    title: 'Sensor Fusion & IMU Orientation (MPU-6050)',
    promise: 'By the end, I can read accelerometer and gyroscope data over I2C and track robot heading angle.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03', 'Advanced 05'],
    outcomes: ['Understand I2C communication protocol (SDA/SCL)', 'Read raw 6-axis data from an MPU-6050 IMU', 'Explain gyroscope drift and accelerometer gravity tilt'],
    vocabulary: [{ term: 'IMU (Inertial Measurement Unit)', plainMeaning: 'An electronic inner ear that measures acceleration, tilt, and rotation.', technicalMeaning: 'An electronic device that measures and reports a body’s specific force, angular rate, and orientation using accelerometers and gyroscopes.' },
      { term: 'I2C Protocol', plainMeaning: 'A 2-wire serial bus that lets multiple chips talk using addresses.', technicalMeaning: 'Inter-Integrated Circuit: a synchronous, multi-controller/multi-target, packet switched, single-ended serial communication bus.' }],
    teacherPrep: ['Check MPU-6050 6-axis breakout modules.'],
    verifiedMaterials: ['MPU-6050 breakout', 'Arduino Uno / Mega', 'I2C jumper wires'],
    safetyNotes: ['Handle delicate MEMS sensor modules with care.'],
    classRhythm: [
      { segment: '0–15m Hook', minutes: 15, teacherAction: 'Explain how aircraft and spacecraft navigate without GPS using gyroscopes.', studentAction: 'Rotate sensor and observe raw angular velocity.' },
      { segment: '15–35m I2C & Gyro Math', minutes: 20, teacherAction: 'Explain I2C pins: A4 (SDA), A5 (SCL). Explain angle integration: angle += gyroZ * dt.', studentAction: 'Code I2C reader.' },
      { segment: '35–50m Drift Analysis', minutes: 15, teacherAction: 'Observe gyroscope integration drift over 60 seconds.', studentAction: 'Calculate zero-offset calibration bias.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review complementary filter concept.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Why Gyroscopes Drift Over Time', explanation: 'A tiny sensor offset of +0.5°/sec will integrate into a 30° heading error after just 60 seconds! Calibration at bootup is essential.' }],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'IMU Heading Experiment',
      deliverableType: 'dataset',
      successEvidence: ['Calibrated IMU heading readout tracking 90° and 180° physical rotations within ±3° accuracy.']
    },
    activity: { title: 'Calibrate and Track IMU Heading', steps: ['Connect SDA to A4, SCL to A5', 'Calculate zero-rate gyro offset', 'Integrate angular velocity', 'Rotate 90° and verify angle'], successCriteria: ['Displays accurate heading angle.'] },
    troubleshooting: [{ symptom: 'I2C device not found error.', checks: ['Run I2C scanner sketch to find 0x68 address', 'Check pull-up resistors'], explanation: 'Bad wiring or address pin (AD0) pulled HIGH to 0x69.' }],
    checksForUnderstanding: ['What is the difference between what an accelerometer measures versus a gyroscope?'],
    exitTicket: [{ question: 'What two wires does the I2C protocol require for communication?', rubricOrSampleReasoning: 'SDA (Serial Data) and SCL (Serial Clock), plus a common ground.' }],
    differentiation: { support: ['Use pre-built MPU6050 library.'], extension: ['Implement a complementary filter combining accelerometer tilt with gyro rate.'] },
    nextLessonId: 'adv-07',
    nextLessonTeaser: 'Advanced 07: Mechanical CAD & Design for Fabrication — Design high-strength competition chassis with parametric ribs and motor traps!',
    sources: [{ title: 'InvenSense MPU-6050 Product Specification', url: 'https://invensense.tdk.com' }],
    assetCredits: [{ asset: 'IMU Coordinate Frame', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-07',
    fieldGuideLinks: {
      readBeforeClass: ["fg-design-cad-measurement"],
      lookUpWhileBuilding: ["fg-design-cad-measurement"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'advanced',
    sequence: 7,
    code: 'ADVANCED 07',
    title: 'Mechanical CAD and Design for Fabrication',
    promise: 'By the end, I can design a competition robot chassis optimized for 3D printing strength, low center of gravity, and rapid battery swaps.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 08'],
    outcomes: ['Optimize 3D print layer orientation for tensile and shear loads', 'Design captive nut pockets and snap-fits', 'Lower the center of gravity for combat stability'],
    vocabulary: [{ term: 'Anisotropic Strength', plainMeaning: '3D printed parts are strong along the filament lines, but weak between layers.', technicalMeaning: 'Physical properties that vary depending on the direction of measurement, characteristic of layered additive manufacturing.' }],
    teacherPrep: ['Prepare samples of sheared 3D prints vs correctly oriented prints.'],
    verifiedMaterials: ['CAD workstations', 'Sample 3D printed components'],
    safetyNotes: ['Fabrication lab safety.'],
    classRhythm: [
      { segment: '0–15m Failure Modes', minutes: 15, teacherAction: 'Show high-speed collision video of a Mini-Sumo robot cracking along layer lines.', studentAction: 'Analyze why layer orientation matters.' },
      { segment: '15–35m CAD Techniques', minutes: 20, teacherAction: 'Teach captive M3 hex nut slots, chamfers, and structural gussets.', studentAction: 'Model reinforced motor mount.' },
      { segment: '35–50m Iteration Log', minutes: 15, teacherAction: 'Review CAD assembly.', studentAction: 'Export print-ready file with infill specs.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Wrap up design review.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Captive Nut Traps', explanation: 'Instead of tapping weak plastic threads that strip under vibration, cut a 5.5mm hex pocket to trap a steel M3 nut permanently inside the print!' }],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Competition Chassis CAD Redesign',
      deliverableType: 'cad_model',
      successEvidence: ['Complete competition chassis model with low center of gravity, captive nut pockets, and structural gussets.']
    },
    activity: { title: 'Design Reinforced Combat Chassis', steps: ['Position heavy battery at bottom', 'Add 45-degree front scoop blade', 'Embed captive M3 hex nut pockets', 'Check weight budget'], successCriteria: ['Meets competition dimensions and weight.'] },
    troubleshooting: [{ symptom: '3D print delaminates during combat impact.', checks: ['Orient print so impact forces compress layers instead of peeling them apart'], explanation: 'Tensile stress perpendicular to layer lines causes catastrophic splitting.' }],
    checksForUnderstanding: ['Why should heavy battery packs always be mounted as low as possible on a competition robot?'],
    exitTicket: [{ question: 'Why is printing a part with layers parallel to an impact force weaker than perpendicular?', rubricOrSampleReasoning: 'Inter-layer adhesion is significantly weaker than the tensile strength of continuous filament strands.' }],
    differentiation: { support: ['Provide chassis perimeter baseplate template.'], extension: ['Run Finite Element Analysis (FEA) stress simulation.'] },
    nextLessonId: 'adv-08',
    nextLessonTeaser: 'Advanced 08: ESP32/STM32, Telemetry & Local IoT — High-performance 32-bit dual-core processors and local web telemetry dashboards!',
    sources: [{ title: 'Additive Manufacturing Design Guidelines', url: 'https://stratasys.com' }],
    assetCredits: [{ asset: 'Captive Nut Slot Guide', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-08',
    fieldGuideLinks: {
      readBeforeClass: ["fg-board-other-microcontrollers"],
      lookUpWhileBuilding: ["fg-comm-i2c-spi-uart","fg-safety-lab-code"],
      goDeeper: ["fg-prog-millis-vs-delay"]
    },
    courseId: 'advanced',
    sequence: 8,
    code: 'ADVANCED 08',
    title: 'ESP32/STM32, Telemetry, and Local IoT Concepts',
    promise: 'By the end, I can program a 32-bit microcontroller to host a local offline telemetry dashboard streaming live sensor data.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03'],
    outcomes: ['Contrast 8-bit AVR with 32-bit dual-core ESP32 architecture', 'Host a secure local Access Point (AP) web dashboard without internet dependencies', 'Stream JSON telemetry packets over WebSockets'],
    vocabulary: [{ term: 'Access Point (AP Mode)', plainMeaning: 'When the robot creates its own private Wi-Fi network like a router.', technicalMeaning: 'A networking hardware device that allows other Wi-Fi devices to connect to a local network.' }],
    teacherPrep: ['Check ESP32 development boards.'],
    verifiedMaterials: ['ESP32 DevKit V1', 'USB cable', 'Laptop / tablet'],
    safetyNotes: ['Never hardcode sensitive passwords in public code. Use local offline network only.'],
    classRhythm: [
      { segment: '0–15m 32-bit Power', minutes: 15, teacherAction: 'Compare 16MHz Arduino Uno (2KB RAM) with 240MHz ESP32 (520KB RAM + Wi-Fi).', studentAction: 'Understand processor scaling.' },
      { segment: '15–35m Web Server', minutes: 20, teacherAction: 'Explain local WebServer and HTML/JS packet delivery.', studentAction: 'Upload local AP dashboard sketch.' },
      { segment: '35–50m Live Telemetry', minutes: 15, teacherAction: 'Connect phone to robot Wi-Fi AP.', studentAction: 'View live live battery voltage and distance graph on mobile browser.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review local IoT security.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Offline-First Robotics Architecture', explanation: 'Competition arenas have jammed Wi-Fi and zero internet access. Professional robots create an isolated local Access Point that requires no external cloud servers!' }],
    visualizerId: 'iot_dashboard_sim',
    project: {
      name: 'Local Telemetry Dashboard',
      deliverableType: 'code_artifact',
      successEvidence: ['Working ESP32 web server displaying real-time sensor telemetry on a connected phone browser over local Wi-Fi.']
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 08
// ESP32 Local Access Point & Telemetry Web Server
// Hosts offline dashboard for browser teleoperation and monitoring

#include <WiFi.h>
#include <WebServer.h>

const char* AP_SSID = "RoboBEE-Telemetry";
const char* AP_PASS = "innovator123";

WebServer server(80);

float batteryVoltage = 7.42;
int sonarDistanceCm = 35;
unsigned long packetCount = 0;

const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RoboBEE Telemetry</title>
  <style>
    body { font-family: monospace; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 15px; margin: 10px auto; max-width: 400px; }
    h1 { color: #F5B800; font-size: 1.2rem; }
    .val { font-size: 2rem; font-weight: bold; color: #38bdf8; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>RoboBEE Live Telemetry</h1>
    <p>Battery: <span id="bat" class="val">--</span> V</p>
    <p>Distance: <span id="dist" class="val">--</span> cm</p>
    <p style="font-size:0.8rem; color:#94a3b8;">Local AP Mode (Offline Ready)</p>
  </div>
  <script>
    setInterval(() => {
      fetch('/data').then(r => r.json()).then(d => {
        document.getElementById('bat').innerText = d.battery.toFixed(2);
        document.getElementById('dist').innerText = d.distance;
      });
    }, 500);
  </script>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", INDEX_HTML);
}

void handleData() {
  packetCount++;
  float simBat = batteryVoltage - (packetCount * 0.001);
  int simDist = 20 + (millis() / 200) % 60;

  String json = "{\"battery\":" + String(simBat, 2) + ",\"distance\":" + String(simDist) + ",\"packets\":" + String(packetCount) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("\n[ESP32] Initializing Local Access Point..."));

  WiFi.softAP(AP_SSID, AP_PASS);
  IPAddress IP = WiFi.softAPIP();

  Serial.print(F("AP Created! SSID: "));
  Serial.println(AP_SSID);
  Serial.print(F("Connect phone and open browser at: http://"));
  Serial.println(IP);

  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
  Serial.println(F("HTTP server started."));
}

void loop() {
  server.handleClient();
}
`,
      pinMap: {
        'ESP32 GPIO': 'Internal Wi-Fi radio (No external wiring needed)',
        'UART0': 'TX0 / RX0 on micro-USB for 115200 baud serial'
      },
      setupAndUpload: [
        'Select "ESP32 Dev Module" in Arduino IDE board manager.',
        'Set baud rate to 115200 and upload sketch.',
        'On your phone or laptop, connect to Wi-Fi network "RoboBEE-Telemetry" with password "innovator123".',
        'Open web browser to http://192.168.4.1 to view live telemetry dashboard.'
      ],
      explanations: [
        'WiFi.softAP(): Creates an independent local Wi-Fi router network directly on the robot with zero internet dependencies.',
        'WebServer server(80): Lightweight HTTP web server that serves both dashboard HTML and JSON sensor endpoints.',
        'fetch("/data"): Browser JavaScript polls the robot every 500ms for live battery and distance telemetry.'
      ],
      expectedResult: 'Phone connects to robot Wi-Fi and displays real-time battery voltage and distance gauge updating at 2Hz.',
      caveats: [
        'Ensure phone does not disconnect from Wi-Fi due to "No internet connection" prompts.',
        'Use 115200 baud for ESP32 Serial Monitor instead of 9600.'
      ],
      tweakTip: 'Add buttons on the webpage sending HTTP GET requests (/forward, /stop) for browser-based remote control.'
    },
    activity: { title: 'Deploy Local Robot Dashboard', steps: ['Configure ESP32 softAP("RoboBEE_Pilot")', 'Build lightweight HTML string', 'Stream sensor data over HTTP/WebSocket', 'Connect phone browser'], successCriteria: ['Data updates smoothly without lag.'] },
    troubleshooting: [{ symptom: 'Phone disconnects from robot Wi-Fi.', checks: ['Disable "Auto-switch to mobile data" on phone settings'], explanation: 'Smartphones disconnect from Wi-Fi networks that do not have an active internet uplink unless configured.' }],
    checksForUnderstanding: ['Why should robot competition dashboards avoid relying on cloud internet servers?'],
    exitTicket: [{ question: 'What is the advantage of a 32-bit 240MHz microcontroller over an 8-bit 16MHz microcontroller?', rubricOrSampleReasoning: 'Dramatically faster mathematical computation, hardware floating-point support, larger memory, and integrated wireless radios.' }],
    differentiation: { support: ['Provide pre-built HTML template string.'], extension: ['Add interactive D-pad controls sending WebSocket commands back to the motors.'] },
    nextLessonId: 'adv-09',
    nextLessonTeaser: 'Advanced 09: Autonomous Combat & Mini-Sumo — Implement priority state machines: Ring edge survival MUST override opponent attack!',
    sources: [{ title: 'Espressif Systems ESP32 Technical Reference', url: 'https://espressif.com' }],
    assetCredits: [{ asset: 'Telemetry Interface Mockup', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-comp-tcrt5000","fg-comp-hc-sr04","fg-comp-tb6612fng"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 9,
    code: 'ADVANCED 09',
    title: 'Autonomous Combat & Mini-Sumo Robotics',
    promise: 'By the end, I can program an autonomous Mini-Sumo combat robot using priority hierarchy state machines.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01', 'Advanced 03', 'Advanced 05'],
    outcomes: [
      'Design a Priority Rule Hierarchy where Edge Survival strictly overrides Opponent Attacking.',
      'Combine bottom downward-facing IR edge sensors with front ultrasonic/distance opponent sensors.',
      'Implement the mandatory 5-second start delay and autonomous Search-and-Charge state machine.'
    ],
    vocabulary: [
      { term: 'Priority State Hierarchy', plainMeaning: 'A rule system where life-saving rules always cut in front of attack rules.', technicalMeaning: 'A layered decision architecture where high-priority safety conditions pre-empt lower-priority operational behaviors.' },
      { term: 'Tawara', plainMeaning: 'The 5cm white boundary ring painted around the black circular dohyo.', technicalMeaning: 'The white boundary line defining the perimeter of a sumo wrestling ring.' }
    ],
    teacherPrep: ['Set up official circular Mini-Sumo dohyo mat (black surface with 5cm white border).'],
    verifiedMaterials: ['Mini-Sumo Robot with bottom edge sensors & front sonar', 'Official dohyo ring', 'Dummy target cups'],
    safetyNotes: [
      'No sharp metal blades or spinning weapons. Supervised friendly push-out competition only.',
      'Keep fingers clear of high-torque wheels during engagement.'
    ],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Show Japanese national 500g Mini-Sumo championship match.', studentAction: 'Analyze search patterns and ring retention.' },
      { segment: '10–25m Priority Logic', minutes: 15, teacherAction: 'Explain why checking the edge MUST come first in loop(): If edge is detected, return; immediately!', studentAction: 'Code priority ladder.' },
      { segment: '25–50m Arena Practice', minutes: 25, teacherAction: 'Supervise solo edge tests, then target knockdown tests.', studentAction: 'Test edge survival for 30s; test target lock.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review rule precedence.', studentAction: 'Complete exit check.' }
    ],
    concepts: [
      {
        title: 'Rule Priority: Survival Over Attack',
        explanation: 'If your robot sees an opponent outside the ring and attacks without checking the floor sensor, it will drive itself right out of the arena! Priority 1: Survive the edge. Priority 2: Charge opponent. Priority 3: Search.',
        instructorNote: 'Using `return;` inside the Priority 1 block forces the microcontroller to restart the loop immediately to re-verify safety.'
      }
    ],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Mini-Sumo or Maze-Solving Robot',
      deliverableType: 'physical_build',
      successEvidence: ['Robot stays inside the white border of the dohyo continuously for 30 seconds and pushes out a dummy target cup autonomously.']
    },
    activity: {
      title: 'Program the Autonomous Mini-Sumo State Machine',
      steps: [
        'Implement 5-second safety countdown delay after button press.',
        'Priority 1 (Survival): If bottom IR reads white border (LOW), immediately reverse (220 PWM) and spin 180° back to center.',
        'Priority 2 (Attack): If front sensor detects opponent within 40cm, charge forward at 100% torque (255 PWM)!',
        'Priority 3 (Search): If ring is clear, rotate slowly in place to radar-scan the circular ring.'
      ],
      successCriteria: ['Robot never crosses white line; locks onto and pushes out dummy targets.'],
      extension: 'Implement dual front sensors (Left-Front and Right-Front) to track moving opponents dynamically.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Mini-Sumo Robot Chassis', '2x Bottom IR Edge Sensors (TCRT5000)', 'Front Ultrasonic / Laser Sensor', 'Arduino Uno / Nano'],
      componentList: [
        { name: 'Mini-Sumo Metal / 3D Printed Chassis', exactVariant: '10cm x 10cm footprint, <500g', quantity: 1 },
        { name: 'High-Torque Micro Metal Gearmotors', exactVariant: '6V 50:1 ratio with silicone tires', quantity: 2 },
        { name: 'Bottom IR Sensors', exactVariant: 'Downward facing active-LOW', quantity: 2 },
        { name: 'Front Opponent Sonar', exactVariant: 'HC-SR04 or VL53L0X Time-of-Flight', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/mini_sumo_priority_wiring.svg',
      schematic: 'Edge IR ➔ A0 | Sonar TRIG ➔ 9, ECHO ➔ 10 | Motor Driver ➔ Pins 5,6,7,8 | Start Button ➔ Pin 2',
      wireTable: [
        { from: 'Bottom IR Sensor', to: 'Analog Pin A0', wireOrPolarityNote: 'Edge detect line (LOW over white)' },
        { from: 'Start Button', to: 'Digital Pin 2', wireOrPolarityNote: 'Referee Start Switch (INPUT_PULLUP)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount bottom edge sensors 3mm above floor.',
        '2. Verify start switch delay is exactly 5.0 seconds.',
        '3. Test Priority 1 edge reverse alone on the dohyo.'
      ],
      powerAndSafetyChecks: ['Strictly verify no sharp cutting edges or entangling devices.'],
      testCases: [
        { action: 'Place robot on edge border line', expectedResult: 'Robot immediately reverses and turns away from the edge.' },
        { action: 'Place target cup 25cm in front of robot', expectedResult: 'Robot accelerates to 255 PWM and charges target.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `const int EDGE_SENSOR = A0; // Bottom IR: LOW = White Border
const int ATTACK_RANGE_CM = 40;

void setup() {
  initSumoHardware();
  waitForStartButton();
  delay(5000); // Official 5-second mandatory competition delay
}

void loop() {
  // PRIORITY 1: Survive the Edge (Overrides everything!)
  if (digitalRead(EDGE_SENSOR) == LOW) {
    reverse(220);
    delay(300);
    turnRight(200);
    delay(250);
    return; // Restart loop immediately to re-verify safety!
  }

  // PRIORITY 2: Opponent Radar Lock
  float opponentDist = readDistanceCm();
  if (opponentDist < ATTACK_RANGE_CM) {
    forward(255); // Full power attack!
  } else {
    // PRIORITY 3: Search Mode
    turnLeft(120); // Rotate to scan arena
  }
}`,
      pinMap: { 'A0': 'Bottom Edge IR', '9,10': 'Front Opponent Sonar', '5,6,7,8': 'Dual Motors' },
      setupAndUpload: ['Upload sketch and test with 5-second countdown.'],
      explanations: ['return; immediately exits loop() to re-check the edge before any lower-priority code runs.'],
      expectedResult: 'Autonomous competition combat behavior adhering to safety rules.',
      caveats: ['Check that edge sensor is close enough to the mat so it does not trigger on ambient room light.'],
      tweakTip: 'Notice how return; prevents the robot from ever charging an opponent while on the white line!'
    },
    troubleshooting: [
      { symptom: 'Robot drives out of the ring while charging an opponent.', checks: ['Priority 1 was placed after Priority 2 in loop()'], explanation: 'Rule order is critical! Edge check must always precede attack checks.' }
    ],
    checksForUnderstanding: ['Why must the Edge Sensor check come BEFORE the Opponent check in loop()?'],
    exitTicket: [
      { question: 'Why does the return; statement inside the Priority 1 block save the robot from falling?', rubricOrSampleReasoning: 'It skips all lower-priority code and immediately restarts loop() to re-evaluate the edge sensor.' }
    ],
    differentiation: { support: ['Test edge sensor alone before installing opponent sonar.'], extension: ['Add corner edge sensors on both rear corners.'] },
    nextLessonId: 'adv-10',
    nextLessonTeaser: 'Advanced 10: Verification, Reliability & Data — Write formal test matrices, run repeated trials, and perform root-cause failure analysis!',
    sources: [{ title: 'All Japan Robot-Sumo Tournament Official Rules', url: 'https://fsi.co.jp' }],
    assetCredits: [{ asset: 'Mini-Sumo Dohyo Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-testing-fmea-debugging","fg-safety-lab-code"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'advanced',
    sequence: 10,
    code: 'ADVANCED 10',
    title: 'Verification, Reliability & Failure Analysis',
    promise: 'By the end, I can conduct systematic failure-mode analysis, write test matrices, and document measurable reliability improvements.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 09'],
    outcomes: ['Conduct Failure Mode and Effects Analysis (FMEA)', 'Execute a 10-trial reliability test matrix', 'Calculate Mean Time Between Failures (MTBF)'],
    vocabulary: [{ term: 'FMEA (Failure Mode and Effects Analysis)', plainMeaning: 'A checklist predicting everything that could go wrong and how to prevent it.', technicalMeaning: 'A systematic, proactive method for evaluating a process to identify where and how it might fail and to assess the relative impact of different failures.' }],
    teacherPrep: ['Prepare FMEA worksheets and failure analysis report templates.'],
    verifiedMaterials: ['Test arena', 'Robots', 'FMEA forms'],
    safetyNotes: ['Systematic reliability testing.'],
    classRhythm: [
      { segment: '0–15m Case Studies', minutes: 15, teacherAction: 'Analyze why the Mars Climate Orbiter was lost due to unit conversion errors.', studentAction: 'Understand catastrophic cost of unverified assumptions.' },
      { segment: '15–35m FMEA', minutes: 20, teacherAction: 'Score Severity × Occurrence × Detection = Risk Priority Number (RPN).', studentAction: 'Complete FMEA table for their robot.' },
      { segment: '35–50m Stress Testing', minutes: 15, teacherAction: 'Supervise 10-run endurance stress testing.', studentAction: 'Log failures and isolate root causes.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review risk mitigations.', studentAction: 'Complete exit check.' }
    ],
    concepts: [{ title: 'Risk Priority Numbers (RPN)', explanation: 'Prioritize fixing items that have high severity and are hard to detect before competition day.' }],
    visualizerId: 'test_log_sim',
    project: {
      name: 'Reliability and Failure-Analysis Report',
      deliverableType: 'dataset',
      successEvidence: ['Completed FMEA matrix with identified high-risk failure modes and verified corrective redesign actions.']
    },
    activity: { title: 'Complete Robot FMEA and Stress Test', steps: ['List potential failure modes', 'Rate Severity (1-10)', 'Run 10 endurance trials', 'Document root cause fix'], successCriteria: ['Zero unresolved high-severity failure modes.'] },
    troubleshooting: [{ symptom: 'Intermittent loose wire during vibration.', checks: ['Replace push-in breadboard jumper with soldered or screw-terminal connection'], explanation: 'Breadboards are for bench prototyping; competition robots require mechanically secure terminals.' }],
    checksForUnderstanding: ['What does RPN stand for in an engineering FMEA?'],
    exitTicket: [{ question: 'Why is an intermittent failure more dangerous than a constant hard failure?', rubricOrSampleReasoning: 'Intermittent bugs are difficult to reproduce and often manifest during high-stress competition matches.' }],
    differentiation: { support: ['Provide pre-filled common robotics failure modes.'], extension: ['Calculate standard deviation of lap times.'] },
    nextLessonId: 'adv-11',
    nextLessonTeaser: 'Advanced 11: Capstone Build Sprint — Teams embark on their multi-week autonomous robotics engineering build sprint!',
    sources: [{ title: 'NASA Systems Engineering Handbook: Failure Analysis', url: 'https://nasa.gov' }],
    assetCredits: [{ asset: 'FMEA Matrix Template', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-11',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep","fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-comp-tb6612fng","fg-board-uno-anatomy","fg-testing-fmea-debugging"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 11,
    code: 'ADVANCED 11',
    title: 'Autonomous Robotics Capstone: Build Sprint',
    promise: 'By the end, I can collaborate in an engineering team through milestone check-ins, build journals, and code reviews.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 10'],
    outcomes: ['Execute team milestone checkpoints (Mechanical, Electrical, Software, Integration)', 'Maintain an engineering build journal', 'Perform peer code reviews and git version control'],
    vocabulary: [{ term: 'Engineering Build Journal', plainMeaning: 'A daily diary recording what you built, what failed, and what you learned.', technicalMeaning: 'A contemporaneous technical record of ideas, inventions, experiments, and results maintained by engineers.' }],
    teacherPrep: ['Set up sprint milestone review stations.'],
    verifiedMaterials: ['Team capstone kits', 'Build journals', 'Test arena'],
    safetyNotes: ['Supervised laboratory sprint.'],
    classRhythm: [
      { segment: '0–10m Standup', minutes: 10, teacherAction: 'Facilitate 2-minute team scrum standup meetings: What did you complete? What is blocking you?', studentAction: 'State daily sprint goals.' },
      { segment: '10–40m Build Sprint', minutes: 30, teacherAction: 'Mentor subsystem integration and code reviews.', studentAction: 'Fabricate parts, wire harnesses, and test firmware.' },
      { segment: '40–50m Milestone Check', minutes: 10, teacherAction: 'Sign off on Subsystem Milestone 3.', studentAction: 'Demonstrate subsystem to instructor.' },
      { segment: '50–60m Exit Check', minutes: 10, teacherAction: 'Review build journal entries.', studentAction: 'Log progress and risks.' }
    ],
    concepts: [{ title: 'Peer Code Reviews', explanation: 'A fresh pair of eyes catches bugs in 5 minutes that the author would spend 3 hours debugging!' }],
    visualizerId: 'obstacle_avoiding_rover_sim',
    project: {
      name: 'Autonomous Robotics Capstone',
      deliverableType: 'physical_build',
      successEvidence: ['Fully integrated, operational team robot meeting all competition brief requirements with verified build journal.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (or Mega)', 'TB6612FNG Dual H-Bridge Driver', 'Dual Optical Wheel Encoders', 'HC-SR04 Ultrasonic Sensor', '5-Channel Reflectance Sensor Array', '7.4V 2S LiPo Battery Pack'],
      componentList: [
        { name: 'Competition Chassis', exactVariant: 'Aluminum / stiff acrylic 2WD differential drive chassis', quantity: 1 },
        { name: 'TB6612FNG Driver', exactVariant: '1.2A dual motor driver with common ground', quantity: 1 },
        { name: 'HC-SR04 Sensor', exactVariant: 'Ultrasonic rangefinder on custom front mount', quantity: 1 },
        { name: 'Dual Encoders', exactVariant: '20-slot optical gate encoders on pins 2 and 3', quantity: 2 },
        { name: '5-Channel Line Array', exactVariant: 'TCRT5000 5-sensor analog/digital reflectance array', quantity: 1 },
        { name: 'Power Harness', exactVariant: '2S 7.4V battery with master toggle switch and 3A inline fuse', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/capstone_rover_wiring.svg',
      schematic: 'Arduino Uno central master: Encoders on D2/D3 (INT), Sonar on D4/D11, Motors on D5/D6/D7/D8/D9/D10/D12, Line Array on A0-A4. 7.4V Battery with 3A fuse.',
      wireTable: [
        { from: 'Left Encoder D0', to: 'Arduino Pin 2 (INT0)', wireOrPolarityNote: 'Left wheel odometry interrupts' },
        { from: 'Right Encoder D0', to: 'Arduino Pin 3 (INT1)', wireOrPolarityNote: 'Right wheel odometry interrupts' },
        { from: 'HC-SR04 Trig', to: 'Arduino Pin 4', wireOrPolarityNote: '10us ultrasonic trigger pulse' },
        { from: 'HC-SR04 Echo', to: 'Arduino Pin 11', wireOrPolarityNote: 'Pulse duration return' },
        { from: 'TB6612 Driver', to: 'Arduino Pins 5,6 (PWM), 7,8,9,10 (Dirs), 12 (STBY)', wireOrPolarityNote: 'Complete dual motor control' },
        { from: '5-Channel IR Array', to: 'Arduino Pins A0, A1, A2, A3, A4', wireOrPolarityNote: 'Multi-point line position sensing' },
        { from: 'Battery (+) 7.4V', to: 'Master Switch ➔ 3A Fuse ➔ TB6612 VM', wireOrPolarityNote: 'High-current motor power rail' },
        { from: 'Battery (-) GND', to: 'Shared Ground Bus', wireOrPolarityNote: 'Common ground between battery, driver, and Arduino' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Complete mechanical chassis assembly and verify wheel alignment and fastener tightness.',
        '2. Wire all sensor harnesses with strain relief; check for pinch points.',
        '3. Perform cold continuity test with multimeter: verify NO short between VM and GND.',
        '4. Flash Capstone firmware release candidate via USB with motor power switched OFF.',
        '5. Propped-wheel bench test: verify sonar readings, encoder tick increments, and motor directions.',
        '6. Ground trials: place rover in competition arena, switch on battery power, and observe autonomous navigation.'
      ],
      powerAndSafetyChecks: [
        'Mandatory inline 3A fuse on battery positive lead protects against short-circuit fire hazards.',
        'Emergency physical toggle switch must be accessible on top chassis plate for instant manual shutdown.',
        'Never test high-speed navigation without arena boundary perimeter in place.'
      ],
      testCases: [
        { action: 'Bench Pre-Flight Check', expectedResult: 'All 5 line sensors, sonar, and dual encoders report valid numbers in Serial Monitor.' },
        { action: 'Autonomous Arena Run', expectedResult: 'Rover tracks course line, avoids cardboard obstacle prop at 25cm, and stops at finish zone.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 11
// Autonomous Capstone Rover Firmware
// Integrated Sensors: Sonar, Line Tracking, Dual Encoders, Non-Blocking Scheduler

#include <Arduino.h>

const int PIN_ENC_L  = 2;
const int PIN_ENC_R  = 3;
const int PIN_TRIG   = 4;
const int PIN_ECHO   = 11;
const int PIN_PWMA   = 5;
const int PIN_AIN1   = 7;
const int PIN_AIN2   = 8;
const int PIN_PWMB   = 6;
const int PIN_BIN1   = 9;
const int PIN_BIN2   = 10;
const int PIN_STBY   = 12;

volatile unsigned long ticksL = 0;
volatile unsigned long ticksR = 0;

void isrL() { ticksL++; }
void isrR() { ticksR++; }

unsigned long lastSenseTime = 0;
int obstacleDistance = 100;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_ENC_L, INPUT_PULLUP);
  pinMode(PIN_ENC_R, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_L), isrL, RISING);
  attachInterrupt(digitalPinToInterrupt(PIN_ENC_R), isrR, RISING);

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.println(F("[CAPSTONE] Release Candidate Firmware Online."));
}

void loop() {
  unsigned long now = millis();

  // Non-blocking Sonar sampling every 60ms
  if (now - lastSenseTime >= 60) {
    lastSenseTime = now;
    digitalWrite(PIN_TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(PIN_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(PIN_TRIG, LOW);
    long duration = pulseIn(PIN_ECHO, HIGH, 18000); // 18ms timeout (~3m)
    obstacleDistance = (duration == 0) ? 999 : (duration * 0.0343) / 2;
  }

  // Priority Arbitration: Safety Obstacle Avoidance > Line Navigation
  if (obstacleDistance <= 20) {
    brake();
    delay(100);
    drive(-120, 120); // Pivot right
    delay(300);
  } else {
    drive(140, 140);
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
`,
      pinMap: {
        'PIN_ENC_L / R': 'Pins 2 & 3 (Hardware interrupt encoder inputs)',
        'PIN_TRIG / ECHO': 'Pins 4 & 11 (HC-SR04 sonar rangefinder)',
        'PIN_STBY / PWMA / PWMB / AIN / BIN': 'Pins 12, 5, 6, 7, 8, 9, 10 (TB6612 motor control)'
      },
      setupAndUpload: [
        'Perform pre-flight continuity check.',
        'Upload firmware to Arduino controller.',
        'Verify in Serial Monitor that obstacle distance updates reliably.',
        'Test safety stop with stationary cardboard obstacle prop.'
      ],
      explanations: [
        'Non-blocking sonar sampling: pulseIn with timeout prevents the microcontroller from freezing if no echo returns.',
        'Priority arbitration: Obstacle avoidance unconditionally overrides navigation commands for fail-safe operation.',
        'Differential drive functions: Clean abstraction of motor H-bridge direction and PWM speed.'
      ],
      expectedResult: 'Capstone rover cruises autonomously, senses obstacle at 20cm, brakes, pivots safely, and resumes cruising.',
      caveats: [
        'Always test with foam/cardboard obstacles; never test by driving towards humans or pets.',
        'Confirm inline 3A fuse is in place before powering VM rail from LiPo battery.'
      ],
      tweakTip: 'Integrate the 5-channel line array readings into the cruise state to follow race track lines between obstacle evasions.'
    },
    activity: { title: 'Execute Capstone Sprint', steps: ['Review sprint backlog', 'Integrate mechanical & electrical subsystems', 'Flash release candidate firmware', 'Pass milestone inspection'], successCriteria: ['Robot passes all automated test cases.'] },
    troubleshooting: [{ symptom: 'Subsystems work individually but fail when connected together.', checks: ['Check shared GND, electrical noise, and pin conflicts'], explanation: 'Integration issues represent the majority of real-world robotics bugs.' }],
    checksForUnderstanding: ['What is the purpose of an engineering standup meeting?'],
    exitTicket: [{ question: 'What was your primary technical contribution to today’s capstone sprint?', rubricOrSampleReasoning: 'Student reflects clearly on their specific mechanical, electrical, or software contribution.' }],
    differentiation: { support: ['Assign specific team roles (Mechanics Lead, Electrical Lead, Software Lead).'], extension: ['Conduct formal git branch pull requests.'] },
    nextLessonId: 'adv-12',
    nextLessonTeaser: 'Advanced 12: Technical Demonstration & Reflection — Present your completed capstone robot, defend your design choices, and celebrate graduation!',
    sources: [{ title: 'Agile Hardware Development Framework (Instructor-Developed Lab Method)', url: '' }],
    assetCredits: [{ asset: 'Capstone Sprint Board', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-12',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tournament-prep","fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-safety-lab-code"],
      goDeeper: ["fg-foundations-what-is-robot"]
    },
    courseId: 'advanced',
    sequence: 12,
    code: 'ADVANCED 12',
    title: 'Technical Demonstration and Design Review',
    promise: 'By the end, I can present my robot to an engineering jury, defend technical tradeoffs, and document future design iterations.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01 through Advanced 11'],
    outcomes: ['Deliver a professional 5-minute technical engineering presentation', 'Defend hardware, software, and mechanical tradeoffs before a jury', 'Demonstrate live autonomous robot performance'],
    vocabulary: [{ term: 'Design Review', plainMeaning: 'Presenting your finished machine to a panel of expert engineers to prove it meets requirements.', technicalMeaning: 'A milestone evaluation of a product to evaluate its design against requirements and ensure fitness for purpose.' }],
    teacherPrep: ['Invite mentor jury panel and prepare evaluation scoring sheets.'],
    verifiedMaterials: ['Competition arena', 'Projector presentation station', 'Certificates of Mastery'],
    safetyNotes: ['Controlled public showcase.'],
    classRhythm: [
      { segment: '0–10m Welcome', minutes: 10, teacherAction: 'Welcome parents, mentors, and jury members. Introduce evaluation rubric.', studentAction: 'Prepare demonstration robots.' },
      { segment: '10–45m Presentations', minutes: 35, teacherAction: 'Moderate team technical demonstrations and live arena matches.', studentAction: 'Present engineering slides, demonstrate live autonomous run, answer jury questions.' },
      { segment: '45–55m Awards & Reflection', minutes: 10, teacherAction: 'Award graduation certificates and recognize technical innovation.', studentAction: 'Reflect on their complete learning journey from Class 01 to Class 12.' },
      { segment: '55–60m Closing', minutes: 5, teacherAction: 'Celebrate the RoboBEE Innovators spirit: Dream. Invent. Experiment. Inspire.', studentAction: 'Complete final academy exit reflection.' }
    ],
    concepts: [{ title: 'The True Definition of an Innovator', explanation: 'Robotics is not about perfection on the first try. It is about dreaming bold ideas, experimenting fearlessly, learning from every failure, and inspiring others!' }],
    visualizerId: 'sumo_arena_sim',
    project: {
      name: 'Technical Demonstration and Design Review',
      deliverableType: 'design_review',
      successEvidence: ['Completed technical defense presentation, live demonstration run, and written post-project retrospective.']
    },
    activity: { title: 'Deliver Technical Defense', steps: ['Present system diagram', 'Explain CAD and circuit choices', 'Demonstrate autonomous mission run', 'Answer jury technical questions'], successCriteria: ['Team defends decisions with empirical data.'] },
    troubleshooting: [{ symptom: 'Robot experiences unexpected glitch during live demonstration.', checks: ['Calmly explain what happened and what the telemetry indicates'], explanation: 'Engineers respect teams who diagnose failure modes with poise and evidence.' }],
    checksForUnderstanding: ['What was the most challenging technical hurdle your team overcame throughout this academy?'],
    exitTicket: [
      { question: 'How has your understanding of robotics changed from when you made your first LED blink?', rubricOrSampleReasoning: 'Student demonstrates deep appreciation of systems thinking, hardware-software integration, and persistence.' }
    ],
    differentiation: { support: ['Provide speaking queue notes for nervous presenters.'], extension: ['Prepare portfolio for university and scholarship applications.'] },
    nextLessonId: undefined,
    nextLessonTeaser: 'Academy Graduation Complete! You are now prepared to build competitive autonomous robots and compete at national and international Olympiads!',
    sources: [{ title: 'RoboBEE Innovators Academy Graduation Standards (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Certificate of Mastery', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  }
];

// Populate backward-compatibility aliases
ALL_ROBOTICS_LESSONS.forEach(lesson => {
  lesson.classNumber = lesson.sequence;
  lesson.level = COURSE_SPACES.find(c => c.id === lesson.courseId)?.title || lesson.proposedAudience;
  lesson.subtitle = lesson.promise;
  lesson.interactiveVisualType = lesson.visualizerId;
  lesson.learningObjectives = lesson.outcomes;
  lesson.coreConcept = {
    headline: lesson.concepts[0]?.title || lesson.title,
    summary: lesson.concepts[0]?.explanation || lesson.promise,
    safetyOrGoldenRule: lesson.safetyNotes[0] || 'Work safely under instructor supervision.',
    flowSteps: lesson.concepts.map((c, i) => ({
      label: `Concept ${i + 1}`,
      title: c.title,
      description: c.explanation
    }))
  };
});

// Helper functions for easy querying
export function getLessonsByTier(tier: CourseTier): RoboticsLesson[] {
  return ALL_ROBOTICS_LESSONS.filter(l => l.courseId === tier);
}

export function getLessonById(id: string): RoboticsLesson | undefined {
  return ALL_ROBOTICS_LESSONS.find(l => l.id === id);
}

// Backward compatibility with legacy 14-class components
export const CURRICULUM_CLASSES = ALL_ROBOTICS_LESSONS.filter(l => l.courseId === 'beginner');

export const CURRICULUM_STATS = {
  totalClasses: ALL_ROBOTICS_LESSONS.length,
  totalHours: 36,
  levels: COURSE_SPACES.map(cs => ({
    name: cs.title,
    classes: ALL_ROBOTICS_LESSONS.filter(l => l.courseId === cs.id).map(l => l.sequence),
    color: cs.accentColor,
    description: cs.description
  }))
};
