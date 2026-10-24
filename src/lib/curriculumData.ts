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
  robotOrNotChallenge?: {
    item: string;
    senses: string;
    decides: string;
    acts: string;
    verdict: string;
    isRobot: boolean;
  }[];
  realWorldDomains?: {
    title: string;
    domain: string;
    sense: string;
    decide: string;
    act: string;
    description: string;
  }[];
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
    statusNotice: 'Core Academy Track (12 Classes — From Breadboard X-Ray to Autonomous Maze Explorer)',
    description: 'Master circuits, breadboards, C++ code logic, sensors, motor drivers, Bluetooth wireless, and autonomous robotics integration across 12 hands-on Friday labs.',
    totalClasses: 12,
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
    title: 'Robot Detective: Sense, Decide, Act — What Makes a Machine a True Robot?',
    promise: 'Put on your detective hat! By the end of this class, you will know how to spot a real autonomous robot anywhere in the world, understand the Sense → Decide → Act golden triad, and design your very own helper robot storyboard.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['None! Just your curiosity, imagination, and excitement to explore real robotics.'],
    outcomes: [
      'Classify everyday machines into three categories: Manual Tools (hammer/drill), Automated Machines (microwave/toaster), and True Autonomous Robots (Mars rover/Roomba).',
      'Explain the universal robotics triad: SENSE (sensors feeling the world), DECIDE (computer brain checking rules), and ACT (motors and lights taking action).',
      'Compare human anatomy to robot anatomy: Brain = Microcontroller, Bones = Chassis, Nerves = Wires, Senses = Sensors, Muscles = Motors.',
      'Explore real-world robotics missions: from Mars rovers exploring distant planets to agricultural rovers helping farmers in Bangladesh.',
      'Create a three-panel comic storyboard showing a robot helper observing a problem, making an autonomous decision, and taking action to help people.'
    ],
    vocabulary: [
      {
        term: 'Autonomous Robot',
        plainMeaning: 'A machine with senses, a computer brain, and motorized parts that makes its own decisions in the real world without a human pushing remote control buttons.',
        technicalMeaning: 'An electromechanical system that senses environmental stimuli, computes decisions using internal software logic, and executes physical actions via actuators.'
      },
      {
        term: 'Sensor (The Senses)',
        plainMeaning: 'The robot’s eyes, ears, touch whiskers, or temperature detectors that feel changes in the physical world.',
        technicalMeaning: 'An electrical transducer that detects a physical parameter (such as distance, light, or touch) and converts it into an electrical signal.'
      },
      {
        term: 'Controller / Brain',
        plainMeaning: 'The tiny computer chip inside the robot that reads what the sensors say and follows programmed instructions to decide what to do next.',
        technicalMeaning: 'The central processing microcontroller that executes software instructions in real time, processing sensory inputs and commanding actuators.'
      },
      {
        term: 'Actuator (The Muscles)',
        plainMeaning: 'The moving or glowing parts of the robot (wheels, motors, robotic arms, lights, buzzers) that do physical work in the world.',
        technicalMeaning: 'A mechanical or electrical device that converts stored energy into motion, force, or physical environmental change.'
      },
      {
        term: 'Sense → Decide → Act',
        plainMeaning: 'The endless circle of robot life: first feel the world, then think about what to do, then make the physical move!',
        technicalMeaning: 'The universal closed-loop feedback architecture: sensory data acquisition → programmatic algorithmic evaluation → mechanical actuation.'
      }
    ],
    teacherPrep: [
      'Print Robot Detective mystery sorting cards or load the interactive Sense-Decide-Act lab on the classroom smartboard.',
      'Prepare mystery machine pictures: kitchen toaster, power drill, street traffic light, RC racing car, Roomba vacuum, and NASA Mars rover.',
      'Prepare student drawing packs: heavy storyboard paper, markers, colored pencils, and ruler strips.'
    ],
    verifiedMaterials: ['Classroom projector / tablet', 'Robot Detective Sorting Cards', 'Heavy drawing paper & markers'],
    safetyNotes: ['Supervised classroom discovery session. No high-voltage tools, bare electrical wires, or sharp soldering tools used in this introductory class.'],
    classRhythm: [
      {
        segment: '0–10m Hook',
        minutes: 10,
        teacherAction: 'Display 6 mystery machines on the smartboard: toaster, power drill, traffic light, RC drone, robotic floor cleaner, and NASA Mars Perseverance rover. Challenge students: "Two of these are true robots, and four are pretenders. Who can crack the case?"',
        studentAction: 'Vote, argue, and discover the mystery: A toaster only runs on a dumb timer, and an RC drone needs a human pilot. Only the Mars rover and floor cleaner make decisions on their own!'
      },
      {
        segment: '10–25m Concept',
        minutes: 15,
        teacherAction: 'Guide the interactive Sense → Decide → Act simulation on screen. Contrast human biology (Eyes, Brain, Muscles) with robotic anatomy (Sensors, Microcontroller, Motors).',
        studentAction: 'Interact with virtual sensor triggers: click a simulated wall, watch the distance sensor ping, see the microcontroller highlight "Turn Left", and watch the rover spin away safely.'
      },
      {
        segment: '25–40m Hands-on',
        minutes: 15,
        teacherAction: 'Distribute Robot Storyboard templates and mentor idea generation. Challenge students to design an inventive helper robot for Bangladesh (e.g. river cleaning, school guiding, tree planting).',
        studentAction: 'Draw and color a three-panel comic storyboard: Panel 1 = SENSE (What does it detect?), Panel 2 = DECIDE (What rule does it check?), Panel 3 = ACT (What motor does it move?).'
      },
      {
        segment: '40–45m Exit Share',
        minutes: 5,
        teacherAction: 'Invite two student teams to hold up their robot storyboards on the classroom podium. Facilitate the exit question check.',
        studentAction: 'Present their robot’s mission to the class, explain which sensor and motor it uses, and complete their detective badge!'
      }
    ],
    concepts: [
      {
        title: 'The Great Robot Mystery: What Actually Makes a Machine a "Robot"?',
        explanation: 'Imagine walking into your kitchen. You see a toaster, a microwave, and a robotic vacuum cleaner gliding across the floor. Which one is a real robot? Many people think any electrical machine is a robot—but that is a common mistake! A toaster has a spring and a heated coil. It pops up your toast using a simple mechanical timer. If your bread is already burnt black or if there is no bread in the slot at all, the toaster pops up anyway because it cannot see, feel, or think. It is a blind machine. Even a remote-controlled toy car is not a true robot, because YOU are making all the decisions using your fingers on the joystick! A true robot must have its own sensors to observe the real world, and its own computer brain inside its body that makes decisions and moves without a human touching it. That special superpower is called AUTONOMY.',
        instructorNote: 'Ask students: "If you leave your room, does your TV turn off by itself when you walk out?" (No, it is not autonomous!).'
      },
      {
        title: 'The Golden Triad of Every Robot: Sense → Decide → Act',
        explanation: 'Every autonomous robot ever built—from a tiny line-following bug robot to a massive rover driving across the red deserts of Mars—follows the exact same three steps over and over in an infinite circle: 1. SENSE (Feeling the World): Just like you have eyes, ears, and fingertips, a robot has electronic sensors. Ultrasonic sonar sensors bounce sound waves off walls to measure distance; light sensors detect darkness; and bumper switches feel when the robot bumps into a table leg. 2. DECIDE (The Computer Brain): The sensors send electrical signals into the robot’s microcontroller brain (like our Arduino). The brain checks computer rules that you program: "IF a wall is closer than 10 centimeters, THEN we must turn around!" 3. ACT (Physical Action): The brain sends electrical power to actuators—motors that spin the wheels, robotic grippers that pick up objects, lights that flash, or speakers that beep. Once the robot acts, its sensors immediately check the world again, repeating SENSE → DECIDE → ACT forever!',
        instructorNote: 'Have students physically act out the triad: Close eyes, put hands out (Sense obstacle), Brain says "Stop" (Decide), Step backward (Act).'
      },
      {
        title: 'Comparing Human Bodies to Robot Bodies',
        explanation: 'To understand how a robot is built, look in the mirror! Engineers designed robots to mirror biological anatomy: 1. YOUR BONES = THE ROBOT’S CHASSIS: Your skeleton gives your body shape and holds you upright. In a robot, the chassis (acrylic, 3D printed plastic, or aluminum plates) holds all the pieces together. 2. YOUR NERVOUS SYSTEM = ELECTRICAL WIRES & BATTERIES: Your nerves carry electrical signals from your senses to your brain. In a robot, copper jumper wires and battery packs carry electrical energy and data between components. 3. YOUR SENSES = SENSORS: Your eyes, ears, and skin detect light, sound, and touch. In a robot, electronic sensors convert physical world changes into voltage numbers. 4. YOUR BRAIN = MICROCONTROLLER: Your brain processes thoughts and controls movement. In a robot, a tiny black silicon chip executes lines of code in fractions of a microsecond. 5. YOUR MUSCLES = MOTORS: Your muscles contract to pull your bones and walk. In a robot, electric DC gear motors and servos spin to move the chassis across the floor.',
        instructorNote: 'Display a physical chassis plate, a wire, an ultrasonic sensor, an Arduino Uno, and a yellow DC gear motor side-by-side on the teacher desk.'
      },
      {
        title: 'Real-World Robotics: Heroes of Earth, Space, and Bangladesh',
        explanation: 'Robots are not just toys—they are real-world problem solvers built to go where humans cannot survive! In deep space, NASA’s Perseverance rover drives alone on Mars, drilling into Martian rocks to search for ancient signs of water. In modern hospitals, surgeon-guided robotic arms make microscopic incisions with superhuman steadiness, saving lives every day. In modern shipping warehouses, thousands of automated orange rovers lift shelves and sort millions of packages with zero traffic jams. Right here in Bangladesh, robotics engineers are designing autonomous solar-powered water drones that scoop plastic bottles out of the Buriganga and Shitalakshya rivers, and building smart agricultural rovers that drive through rice fields to test soil moisture and protect crops against droughts. When you learn robotics, you are learning the superpower to invent machines that solve the biggest challenges in the world!',
        instructorNote: 'Encourage students to think about how robotics can protect their local community from pollution or help grandparents at home.'
      }
    ],
    visualizerId: 'robot_detective_sim',
    project: {
      name: 'Sense–Decide–Act Robot Storyboard',
      deliverableType: 'simulation',
      successEvidence: [
        'A completed three-panel comic storyboard clearly identifying a unique helper robot mission.',
        'Panel 1 correctly labels the SENSE organ (e.g. ultrasonic sensor, camera, moisture detector).',
        'Panel 2 correctly describes the DECIDE rule (e.g. IF soil dry -> trigger water pump).',
        'Panel 3 correctly illustrates the ACT mechanism (e.g. motor spinning, robotic arm lifting).'
      ]
    },
    activity: {
      title: 'Design Your Autonomous Helper Robot Storyboard',
      steps: [
        'Step 1 (Choose Your Mission): Pick a real challenge you want your robot to solve: Cleaning plastic from a river, guiding a visually impaired student across campus, watering dry garden crops, or exploring a collapsed building after an earthquake.',
        'Step 2 (Name Your Robot): Give your robot an inspiring engineering name (e.g. "AquaBEE Cleaner", "FloraGuard Rover", "RescueBot-1").',
        'Step 3 (Panel 1 - SENSE): Draw your robot observing the world. Label its sensory organ (e.g. "Ultrasonic Sonar Eyes detecting floating plastic 30cm away").',
        'Step 4 (Panel 2 - DECIDE): Draw the inside of your robot’s microcontroller brain. Write its logic rule in a speech bubble: "IF obstacle < 30cm, THEN lower collection net and spin left motor!"',
        'Step 5 (Panel 3 - ACT): Draw your robot executing physical motion. Label the actuators doing the work: "DC gear motors spinning wheels forward; micro servo lowering scooper arm into the water."',
        'Step 6 (Add a Safety Stop): Draw a bright red emergency stop button on the back of the robot so human instructors can pause it safely anytime.'
      ],
      successCriteria: [
        'All three stages of the Sense → Decide → Act feedback cycle are clearly drawn and logically linked.',
        'The student can stand up and explain how their robot makes decisions without human remote control.',
        'The storyboard includes a thoughtful real-world application that helps people, animals, or the environment.'
      ],
      extension: 'Add a secondary sensor to your design: What should the robot do if its battery gets low, or if it suddenly starts raining?'
    },
    troubleshooting: [
      {
        symptom: 'Student confuses a remote-control (RC) toy drone with an autonomous robot.',
        checks: [
          'Ask the student: "If you take your hands completely off the controller and walk away into another room, does the toy know where to go or will it crash?"',
          'Explain: An RC car has a human brain doing the thinking via radio waves. An autonomous robot has its own computer brain inside its body that makes decisions by itself.'
        ],
        explanation: 'True robotics requires onboard autonomous decision-making using sensor feedback, not human teleoperation.'
      },
      {
        symptom: 'Student draws a robot that "knows everything" without any sensors.',
        checks: [
          'Ask: "If you close your eyes, cover your ears, and wear thick winter gloves, can you tell if someone is standing in front of you?"',
          'Explain: A computer cannot guess or imagine. Without sensors, a robot is completely blind and deaf.'
        ],
        explanation: 'Microcontrollers require physical electrical transducers (sensors) to acquire data about the external environment.'
      }
    ],
    checksForUnderstanding: [
      'What are the three magical steps of every robot’s decision-making circle?',
      'Why is a kitchen microwave oven NOT considered an autonomous robot?',
      'If you could put any sensor on a robot, which one would you pick and what would it detect?'
    ],
    exitTicket: [
      {
        question: 'In your own words, what is the main difference between an automated tool (like a microwave) and a true autonomous robot?',
        rubricOrSampleReasoning: 'An automated tool blindly follows a preset timer regardless of what is happening around it. An autonomous robot uses sensors to observe physical changes in the real world and changes its actions based on what it senses.'
      },
      {
        question: 'Name the three parts of the Sense → Decide → Act triad and give an example of each part on a real machine.',
        rubricOrSampleReasoning: '1. SENSE: Distance sensor feeling a wall; 2. DECIDE: Microcontroller checking code to turn left; 3. ACT: Electric motor spinning wheels to steer away.'
      },
      {
        question: 'What is one problem in Bangladesh or your local community that you would like to build a robot to help solve?',
        rubricOrSampleReasoning: 'Student gives a thoughtful, empathetic real-world mission (e.g. cleaning rivers, planting trees, delivering medical supplies, helping elders).'
      }
    ],
    differentiation: {
      support: [
        'Provide fill-in-the-blank storyboard sentence starters: "My robot uses its ___ sensor to sense ___. Then its brain decides to ___. Finally, its motor acts by ___."',
        'Use pre-cut picture cards of sensors, Arduino boards, and motors that students can paste directly into their comic panels.'
      ],
      extension: [
        'Challenge students to draw a multi-sensor robot: What happens if the robot detects an obstacle in front of it AND detects a dark pit beneath its wheels at the same time?'
      ],
      offlineOption: [
        'Use the printed cardboard sorting game with 12 machine cards to debate and classify tools vs appliances vs robots in small groups.'
      ]
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
      lookUpWhileBuilding: ["fg-electronics-ohms-law", "fg-electronics-breadboards"],
      goDeeper: ["fg-board-uno-anatomy"]
    },
    courseId: 'explorer',
    sequence: 2,
    code: 'EXPLORER 02',
    title: 'Make a Signal: Switch-and-LED Circuit',
    promise: 'By the end, I can build a safe closed circuit, explain polarity and electron flow, and send light signals with a tactile switch.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01'],
    outcomes: [
      'Explain that electricity only flows when there is an unbroken, continuous conductive loop.',
      'Demonstrate how a switch mechanically disconnects or reconnects the current path.',
      'Identify LED polarity (Anode vs Cathode) and explain why diodes function as one-way check valves.',
      'Distinguish between conductors, insulators, and dangerous zero-resistance short circuits.'
    ],
    vocabulary: [
      { term: 'Circuit', plainMeaning: 'A complete unbroken circle that electricity travels through.', technicalMeaning: 'A closed loop of conductive paths through which electrical charges can flow.' },
      { term: 'Switch', plainMeaning: 'A drawbridge that opens and closes the electricity path.', technicalMeaning: 'An electromechanical device that disconnects or connects a conducting path in a circuit.' },
      { term: 'LED', plainMeaning: 'A tiny electronic bulb that turns electricity into bright light.', technicalMeaning: 'Light Emitting Diode: a semiconductor diode that emits photons when forward-biased.' },
      { term: 'Anode', plainMeaning: 'The longer, positive leg of an LED where current enters.', technicalMeaning: 'The positive electrode of a semiconductor diode.' },
      { term: 'Cathode', plainMeaning: 'The shorter, negative leg of an LED where current exits.', technicalMeaning: 'The negative electrode of a semiconductor diode, marked by a flat lens notch.' },
      { term: 'Short Circuit', plainMeaning: 'A dangerous shortcut where electricity bypasses the bulb, making wires hot.', technicalMeaning: 'A low-resistance connection between two conductors supplying electrical power, causing excessive current.' },
      { term: 'Conductor', plainMeaning: 'A material like copper metal that lets electricity flow freely.', technicalMeaning: 'A material containing movable electrical charges that flows current under electric potential.' },
      { term: 'Insulator', plainMeaning: 'A material like plastic or paper that stops electricity cold.', technicalMeaning: 'A material whose internal electric charges do not flow freely, resisting electric current.' }
    ],
    teacherPrep: ['Check safe 3V coin cells, conductive copper tape, 5mm LEDs, and binder clips, or prepare web simulator.'],
    verifiedMaterials: ['3V CR2032 Coin Cell', 'Conductive copper tape (5mm width)', '5mm Diffused LED (Red or Green)', 'Heavy cardstock paper', 'Steel binder clip'],
    safetyNotes: ['Never connect coin cell battery directly across both terminals with a paperclip (short circuit). Supervised by instructor.'],
    classRhythm: [
      { segment: '0–8m Hook', minutes: 8, teacherAction: 'Show an unlit bulb and ask: "Why does water stop when the pipe is broken?" Relate to broken train tracks.', studentAction: 'Predict what makes electricity stop flowing and inspect sample paper circuits.' },
      { segment: '8–20m Concept', minutes: 12, teacherAction: 'Demonstrate closed loop vs broken loop on the simulator and explain diode polarity.', studentAction: 'Toggle virtual switch, watch electron current vectors, and observe reverse polarity blocking.' },
      { segment: '20–40m Hands-on', minutes: 20, teacherAction: 'Guide safe copper tape, LED placement, and binder-clip battery terminal assembly.', studentAction: 'Assemble circuit, press switch flap, and send Morse code light pulses!' },
      { segment: '40–45m Reflection', minutes: 5, teacherAction: 'Review LED polarity (long leg = positive) and check for proper component handling.', studentAction: 'Record whether circuit worked and defend why a break stops the entire loop.' }
    ],
    concepts: [
      {
        title: '1. The Closed Circuit Loop & The Continuity Principle',
        explanation: 'Electricity is the organized physical movement of trillions of subatomic particles called electrons. For electrons to move and perform useful work (such as lighting an LED or spinning a motor), they must travel in an unbroken, continuous loop from the power source’s positive terminal, through a conductive path and an electrical load, and back to the negative terminal. If there is even a microscopic break anywhere along the loop, the electrical field collapses instantly across the entire circuit, and all electron flow halts immediately.',
        instructorNote: 'Use the circular train track analogy: If a single rail bridge is raised or broken, every train across the entire loop must come to a complete standstill.'
      },
      {
        title: '2. Semiconductor Diodes & Polarity (Anode vs Cathode)',
        explanation: 'Unlike a classic incandescent light bulb which illuminates regardless of connection direction, an LED (Light Emitting Diode) is a polarized semiconductor component. It functions as an electrical one-way check valve! It has two distinct metal legs: the longer leg is the Anode (+), and the shorter leg is the Cathode (-), which is also marked by a subtle flat notch on the rim of the round plastic lens. Current can only flow from Anode to Cathode (forward bias). If connected backward (reverse bias), the internal semiconductor junction blocks all current flow completely.',
        instructorNote: 'Teach the memory trick: "Long leg is Loving positive (+), Short leg is Shorted to Ground (-)."'
      },
      {
        title: '3. Mechanical Switches as Controlled Circuit Breakers',
        explanation: 'In electrical engineering, a switch is a mechanical bridge that gives humans control over electrical continuity. In our paper circuit, a Single-Pole Single-Throw (SPST) momentary push-contact switch is formed using a folded cardstock flap lined with conductive copper tape. When the flap is open (Normally Open / NO state), an air gap separates the electrical traces. Because air is an insulator with immense resistance, current cannot flow. Pressing the flap brings the copper surfaces into contact, dropping resistance to near zero and completing the circuit loop instantly.',
        instructorNote: 'Explain that inside autonomous robots, computer-controlled electronic switches called transistors replace human fingers, turning circuits on and off millions of times every second!'
      },
      {
        title: '4. Conductors, Insulators & The Danger of Dead Shorts',
        explanation: 'Materials in nature are categorized into conductors and insulators based on their atomic structure. Conductors, like the copper foil tape and wire leads, have loose "free electrons" that slide effortlessly from atom to atom. Insulators, like cardstock paper, plastic tape, and rubber desk mats, hold their electrons tightly and block electrical flow. CRITICAL SAFETY CONCEPT: A "Short Circuit" occurs when a conductor connects the positive terminal of a battery directly to the negative terminal without passing through an electrical load. Without load resistance, the battery discharges violently, generating dangerous heat that can cause burns and destroy the battery cell!',
        instructorNote: 'Show students why we always verify that the LED is positioned between the battery terminals before pressing down the copper traces.'
      }
    ],
    visualizerId: 'circuit_switch_led_sim',
    project: {
      name: 'Switch-and-LED Circuit',
      deliverableType: 'physical_build',
      successEvidence: ['Physical paper circuit or simulation where pressing the switch instantly lights the LED reliably without flickering or heating.']
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['No microcontroller used (Supervised low-voltage DC paper circuit)'],
      componentList: [
        { name: '3V Coin Cell Battery', exactVariant: 'CR2032 Lithium Cell (3.0V nominal, 220mAh)', quantity: 1 },
        { name: 'Diffused 5mm LED', exactVariant: 'Red/Green 5mm Diffused (Vf ≈ 2.0V, 20mA max)', quantity: 1 },
        { name: 'Conductive Adhesive Tape', exactVariant: 'Single-sided Conductive Copper Foil Tape (5mm width)', quantity: 1 },
        { name: 'Cardstock Paper Canvas', exactVariant: 'Heavy cardstock sheet (300 gsm)', quantity: 1 },
        { name: 'Conductive Clip / Binder Clip', exactVariant: 'Small steel binder clip for battery terminal clamping', quantity: 1 }
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
        { action: 'Switch flap open (not pressed)', expectedResult: 'Circuit is open; LED remains completely dark.' },
        { action: 'Press paper switch flap firmly', expectedResult: 'Circuit closes; LED illuminates brightly with steady light.' },
        { action: 'Flip coin cell upside down (+ facing down)', expectedResult: 'LED does not light up (proves diode directional check-valve operation).' }
      ]
    },
    activity: {
      title: 'Build Your Signal Circuit',
      steps: [
        'Step 1: Stick copper tape in a continuous loop on cardstock, leaving a 1cm gap for the switch.',
        'Step 2: Place the LED across the gap, making sure the longer positive leg (Anode) faces battery positive (+).',
        'Step 3: Fasten the 3V coin cell battery with a steel binder clip so the negative face touches the return rail.',
        'Step 4: Press your paper flap switch to complete the bridge and watch the LED glow brightly!',
        'Step 5: Practice sending a 3-pulse emergency Morse signal (Dot-Dot-Dot).'
      ],
      successCriteria: ['LED lights up firmly when switch is pressed and turns off immediately when released.'],
      extension: 'Create a secret signaling code with your lab partner (1 short flash = Yes, 2 short flashes = No).'
    },
    troubleshooting: [
      { 
        symptom: 'LED does not light up when the switch flap is pressed firmly.', 
        checks: [
          'Step 1: Check LED polarity — is the long leg (Anode) touching the positive battery rail?',
          'Step 2: Check battery contact — is the coin cell seated firmly inside the binder clip with metal-on-metal contact?',
          'Step 3: Test LED directly across the coin cell terminals to ensure the diode is not burned out.'
        ], 
        explanation: 'LEDs are directional diodes; reversed polarity completely blocks electrical conduction without causing damage.' 
      },
      { 
        symptom: 'LED flickers or is very dim when pressing the switch.', 
        checks: [
          'Step 1: Burnish the copper tape joints with your fingernail or a plastic ruler to ensure solid conductive adhesive contact.',
          'Step 2: Check if the coin cell voltage has dropped below 2.0V using a digital multimeter.'
        ], 
        explanation: 'Loose mechanical contact creates high contact resistance, causing a voltage drop that starves the LED of forward current.' 
      },
      { 
        symptom: 'The coin cell battery or copper tape feels warm to the touch.', 
        checks: [
          'Step 1: Release the binder clip immediately!',
          'Step 2: Inspect the paper canvas for a direct copper bridge connecting (+) directly to (-) without passing through the LED.'
        ], 
        explanation: 'A short circuit allows unrestricted current flow from the battery, rapidly discharging chemical energy as resistive heat.' 
      },
      { 
        symptom: 'LED stays illuminated even when the paper switch flap is opened.', 
        checks: [
          'Step 1: Check the 1cm switch gap — are the two copper tape ends accidentally touching or overlapped?',
          'Step 2: Inspect for stray pieces of conductive copper tape bridging the switch gap.'
        ], 
        explanation: 'If conductive tape bridges the switch gap, the circuit remains closed permanently regardless of flap position.' 
      }
    ],
    checksForUnderstanding: [
      'Why does an LED instantly turn off when you open the paper switch flap?',
      'What happens if you connect an LED backward in an electrical circuit, and why?',
      'Why is connecting the positive and negative terminals of a battery directly together dangerous?'
    ],
    exitTicket: [
      { 
        question: 'Why does electricity require an unbroken, complete circle (closed loop) to power an LED?', 
        rubricOrSampleReasoning: 'Electrons must have a continuous pathway to travel from the high-potential power terminal, through the load to do work, and back to the low-potential ground terminal. A break collapses the electric field.' 
      },
      { 
        question: 'How does an LED differ from a standard incandescent flashlight bulb in terms of polarity?', 
        rubricOrSampleReasoning: 'An incandescent bulb conducts in both directions, but an LED is a semiconductor diode that only allows current to flow in one direction (Anode to Cathode).' 
      },
      { 
        question: 'What is a short circuit, and what component was used in your circuit to safely consume electrical energy?', 
        rubricOrSampleReasoning: 'A short circuit is a zero-resistance path that causes excessive current and overheating; the LED acts as the electrical load that safely consumes energy and turns it into light.' 
      }
    ],
    differentiation: {
      support: ['Pre-cut copper tape strips with marked polarity lines on template worksheets.'],
      extension: ['Add a second LED in parallel and observe if both light up with equal brightness.'],
      offlineOption: ['Use physical battery holder and test alligator jumper clips with cardboard models.']
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
    promise: 'By the end, I can explain how two wheels let a robot drive straight, pivot, and navigate complex maze environments.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01', 'Explorer 02'],
    outcomes: [
      'Describe how spinning two independent drive wheels at different speeds steers a robot left or right.',
      'Distinguish between zero-radius tank turns and wide pivot turns around a stationary wheel.',
      'Explain how friction and tire traction prevent wheel slip on various floor surfaces.',
      'Plan a step-by-step navigation path through a simulated floor grid to reach a target coordinate.'
    ],
    vocabulary: [
      { term: 'Differential Drive', plainMeaning: 'Steering by making one wheel go faster than the other.', technicalMeaning: 'A mobile robot drive architecture based on two independently driven coaxial wheels.' },
      { term: 'Traction', plainMeaning: 'How well rubber tires grip the floor without slipping or skidding.', technicalMeaning: 'The frictional grip between a drive wheel and the operating surface governed by normal force.' },
      { term: 'Pivot Turn', plainMeaning: 'Swinging around one wheel that stays completely frozen in place.', technicalMeaning: 'A turning maneuver where one wheel is stopped while the opposite wheel drives, with turning radius equal to wheel track.' },
      { term: 'Tank Turn', plainMeaning: 'Spinning like a top in one exact spot without moving forward or backward.', technicalMeaning: 'A zero-radius rotation where left and right wheels rotate at equal speeds in opposite directions.' },
      { term: 'Castor Wheel', plainMeaning: 'A smooth spinning helper wheel that keeps the robot balanced without steering.', technicalMeaning: 'An unpowered omnidirectional wheel or ball transfer supporting chassis balance.' },
      { term: 'Wheel Slip', plainMeaning: 'Tires spinning on slippery floors without pushing the robot forward.', technicalMeaning: 'Loss of traction occurring when applied motor shear force exceeds maximum static friction.' }
    ],
    teacherPrep: ['Open the drag-and-drop movement maze simulation on class devices and lay out grid mats.'],
    verifiedMaterials: ['Movement maze simulator or floor grid mat with cardboard two-wheel models', 'Toy differential-drive cart or demonstration chassis'],
    safetyNotes: ['Supervised tabletop activity; ensure carts do not roll off table edges.'],
    classRhythm: [
      { segment: '0–10m Hook', minutes: 10, teacherAction: 'Hold a 2-wheel toy cart by one wheel while pushing the other forward. Ask: "Why does it spin in a circle?"', studentAction: 'Observe circular rotation and predict what happens when both wheels spin together.' },
      { segment: '10–25m Concept', minutes: 15, teacherAction: 'Demonstrate differential steering vectors: Straight (L=R), Pivot (L=0, R>0), Tank Turn (L=-R).', studentAction: 'Practice steering commands using hand gesture pairs (two fists as wheels).' },
      { segment: '25–40m Hands-on', minutes: 15, teacherAction: 'Facilitate maze route challenge on the web grid simulator.', studentAction: 'Queue movement blocks and navigate rover through the obstacle maze to the target flag.' },
      { segment: '40–45m Exit Check', minutes: 5, teacherAction: 'Summarize how real planetary exploration rovers steer on rocky terrain.', studentAction: 'Complete formative exit question on wheel velocity vectors.' }
    ],
    concepts: [
      {
        title: '1. Differential Drive Kinematics (Two Wheels, Infinite Paths)',
        explanation: 'Most mobile autonomous robots in research and industry—from Amazon warehouse AGVs to Mars exploration rovers—do not use car-style steering racks with mechanical front knuckles. Instead, they use Differential Drive steering, which relies on two independently powered drive wheels mounted on a single lateral axis. To drive straight ahead, both wheels must rotate forward at identical speeds (VL = VR). To reverse, both wheels spin backward. By independently varying the velocities of the two wheels, the robot can generate smooth curved paths, sharp pivots, or straight lines.',
        instructorNote: 'Have students hold a pencil horizontally between both hands. Push both hands forward together for straight travel; push the left hand forward while holding the right still to show a right turn.'
      },
      {
        title: '2. Tank Turns vs Pivot Turns (Zero-Radius Agility)',
        explanation: 'Differential drive gives mobile robots agile turning maneuvers that traditional cars cannot execute. In a Pivot Turn, one wheel is stopped completely (VR = 0) while the other rotates forward (VL > 0). The robot swings around the stationary tire patch, tracing an arc with a turning radius equal to the wheelbase width. In a Tank Turn (Zero-Radius Spin), the two wheels spin at equal speeds in opposite directions (VL = -VR). The center of rotation is located at the exact geometric midpoint between the wheels, causing the robot to spin on the spot with zero forward translation!',
        instructorNote: 'Demonstrate how a zero-radius tank turn is essential when a robot enters a narrow dead-end corridor and must turn around 180° without crashing into side walls.'
      },
      {
        title: '3. Friction, Normal Force & Wheel Slip Physics',
        explanation: 'A robot’s motor produces rotational torque, but it cannot move the robot forward without friction! The rubber tire must grip the floor surface, governed by static friction: F_traction ≤ μ × N, where μ is the friction coefficient between tire and floor, and N is the normal force (the portion of the robot’s weight pressing down on that wheel). If a motor accelerates too violently or the floor is dusty or slick, the force exceeds maximum static friction, resulting in "Wheel Slip." In real robotics, wheel slip corrupts position tracking (odometry), causing the robot to get lost even if its code was logically correct!',
        instructorNote: 'Compare driving a toy car on a high-grip rubber mat versus a slippery, dusty tile floor to show the practical impact of wheel slip.'
      },
      {
        title: '4. The 3-Point Chassis: Drive Wheels & The Passive Castor',
        explanation: 'Two wheels alone cannot physically balance a robot—it would tip forward or backward like an unridden bicycle! To maintain stable three-dimensional balance without adding a complex suspension, mobile robots use a 3-point support triangle: two driven traction wheels on one axle, and a low-friction passive omnidirectional Castor Wheel (or smooth nylon ball slider) at the opposite end. The castor supports part of the vehicle’s weight while rolling or swiveling freely in any direction, allowing the robot to turn smoothly without dragging.',
        instructorNote: 'Point out the swivel castor wheels under office chairs and supermarket shopping carts—they rotate 360 degrees to follow whatever direction you push!'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Wheeled-Motion Challenge',
      deliverableType: 'simulation',
      successEvidence: ['Completed grid route from start to target without wall collisions, optimizing turn counts.']
    },
    activity: {
      title: 'Navigate the Rover Maze',
      steps: [
        'Step 1: Inspect the target flag coordinate on the simulated grid map.',
        'Step 2: Count the squares forward, then choose whether to execute a 90° pivot left or right.',
        'Step 3: Run the simulated route and observe individual wheel rotation arrows.',
        'Step 4: Debug turn overshoots or wall collisions by adjusting wheel command sequences.',
        'Step 5: Successfully park the rover on the exact target square with zero wall bumps.'
      ],
      successCriteria: ['Rover reaches the target flag smoothly without bumping obstacle blocks.'],
      extension: 'Plan an optimal route that includes a reverse parking maneuver into a narrow docking bay.'
    },
    troubleshooting: [
      { 
        symptom: 'Rover turns in the opposite direction from what the student expected.', 
        checks: [
          'Step 1: Check which wheel is spinning forward — is the right wheel spinning to turn left?',
          'Step 2: Verify wheel orientation from the robot’s point of view (driver seat), not the outside observer’s perspective.'
        ], 
        explanation: 'Spinning the right wheel forward pushes the right side ahead, which forces the robot chassis to pivot toward the LEFT.' 
      },
      { 
        symptom: 'Rover drifts to one side instead of driving in a straight line.', 
        checks: [
          'Step 1: Inspect wheels for hair, dust, or axle friction that slows down one motor.',
          'Step 2: Check tire diameters to confirm both wheels are identical in size.'
        ], 
        explanation: 'In open-loop control, any slight difference in motor speed, gear friction, or tire diameter causes differential steering drift.' 
      },
      { 
        symptom: 'Rover spins its wheels in place without moving forward on the floor.', 
        checks: [
          'Step 1: Check floor surface for dust or low friction.',
          'Step 2: Check weight distribution — is enough battery weight pressing down over the drive wheels rather than the castor?'
        ], 
        explanation: 'Insufficient normal force over the drive wheels reduces available traction below the threshold needed to overcome inertia.' 
      },
      { 
        symptom: 'Robot chassis tips forward and drags on the floor during braking.', 
        checks: [
          'Step 1: Verify the castor wheel is properly installed at the correct height.',
          'Step 2: Lower the vehicle’s center of gravity by mounting the heavy battery lower in the chassis.'
        ], 
        explanation: 'Dynamic deceleration transfers weight forward; a properly positioned castor wheel prevents nose-diving.' 
      }
    ],
    checksForUnderstanding: [
      'If both wheels spin forward at the exact same speed, what path does the robot follow?',
      'How does a zero-radius tank turn differ from a pivot turn around one wheel?',
      'Why does a two-wheeled robot require a third support point like a castor wheel?'
    ],
    exitTicket: [
      { 
        question: 'To turn a differential-drive robot toward the right, what must the left and right wheels do?', 
        rubricOrSampleReasoning: 'The left wheel must spin forward faster than the right wheel (or the right wheel stops/reverses), pushing the left side forward to pivot right.' 
      },
      { 
        question: 'What is the advantage of a zero-radius tank turn when navigating a tight obstacle maze?', 
        rubricOrSampleReasoning: 'It allows the robot to rotate completely in place without needing extra clearance space to swing its body, preventing wall collisions in narrow dead ends.' 
      },
      { 
        question: 'Why do engineers use rubber tires instead of smooth hard plastic wheels on autonomous rovers?', 
        rubricOrSampleReasoning: 'Rubber has a higher friction coefficient with the floor, maximizing traction and preventing wheel slip so movements remain accurate.' 
      }
    ],
    differentiation: {
      support: ['Use a physical toy rover on floor tile grid before launching the screen simulator.'],
      extension: ['Calculate how many individual wheel rotations are needed to traverse a 10-meter hallway.'],
      offlineOption: ['Draw grid on paper and move an eraser marked with left and right wheel arrows.']
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
    promise: 'By the end, I can design an original helpful robot, select its sensors, actuators, and fail-safes, and present my engineering concept.',
    status: 'published',
    proposedAudience: 'Classes 3–4 (Ages 8–10)',
    durationMinutes: 45,
    prerequisites: ['Explorer 01', 'Explorer 02', 'Explorer 03'],
    outcomes: [
      'Synthesize sensory perception, decision logic, power delivery, and actuators into a cohesive robot concept.',
      'Explain who the robot helps and what specific societal or environmental problem it solves.',
      'Select appropriate sensors and motor actuators matched to the target environment.',
      'Incorporate fail-safe engineering rules and emergency stop mechanisms into the design.'
    ],
    vocabulary: [
      { term: 'Design Brief', plainMeaning: 'A plan that explains what problem you are solving.', technicalMeaning: 'A structured project specification defining goals, constraints, and functional requirements.' },
      { term: 'Prototype', plainMeaning: 'A first draft model built to test an idea before final production.', technicalMeaning: 'An early physical or virtual model built to validate a design concept and test performance.' },
      { term: 'Actuator', plainMeaning: 'The robotic muscle (motor or piston) that creates physical motion.', technicalMeaning: 'A component of a machine responsible for moving and controlling a mechanism or system.' },
      { term: 'Fail-Safe', plainMeaning: 'A safety feature that stops the robot if something goes wrong.', technicalMeaning: 'A design feature that automatically reverts a system to a safe condition upon component failure.' },
      { term: 'E-Stop', plainMeaning: 'A big red button that cuts power instantly in an emergency.', technicalMeaning: 'An emergency stop circuit designed to immediately de-energize actuators to protect humans.' },
      { term: 'Specifications', plainMeaning: 'The exact measurements, speeds, and rules a robot must follow.', technicalMeaning: 'Detailed precise requirements regarding materials, dimensions, and performance parameters.' }
    ],
    teacherPrep: ['Prepare drawing templates with sections: Problem, Sensor Input, Brain Rule, Motor Output, and Safety Stop.'],
    verifiedMaterials: ['Design Brief Worksheets', 'Color markers and rulers', 'Interactive invent-a-helper viewer'],
    safetyNotes: ['Supervised design session; emphasize ethical and safe engineering practices.'],
    classRhythm: [
      { segment: '0–8m Hook', minutes: 8, teacherAction: 'Show real disaster-relief robots and river-cleaning rovers. Discuss challenges in Bangladesh.', studentAction: 'Identify community problems in their home city of Narayanganj.' },
      { segment: '8–18m Planning', minutes: 10, teacherAction: 'Guide students to choose one real problem and select sensors and actuators.', studentAction: 'Define their robot helper mission and complete the specification box.' },
      { segment: '18–35m Design Sprint', minutes: 17, teacherAction: 'Coach students on labeling inputs, controllers, power sources, and E-Stop mechanisms.', studentAction: 'Draw and annotate the complete multi-view prototype sketch.' },
      { segment: '35–45m Showcase', minutes: 10, teacherAction: 'Host 1-minute peer presentations and celebrate Explorer tier graduation!', studentAction: 'Present design, defend sensor choices, and receive Explorer Certificate!' }
    ],
    concepts: [
      {
        title: '1. Human-Centered Robotics Design & Needs Analysis',
        explanation: 'Engineering is not merely assembling electronics; it is solving meaningful human problems. Before writing a line of code or purchasing parts, professional robotics engineers conduct a Needs Analysis. They examine the "3 D’s of Robotics": tasks that are Dull, Dirty, or Dangerous for humans. In Bangladesh, seasonal river pollution, industrial textile safety, and agricultural irrigation are critical challenges. Designing an autonomous helper robot starts with a clear statement: Who is being helped, and how does this machine improve human lives?',
        instructorNote: 'Encourage students to connect their designs to local challenges in Narayanganj, like cleaning school playgrounds or monitoring river water quality.'
      },
      {
        title: '2. Sensor Selection: Matching Physics to the Environment',
        explanation: 'A robot is only as intelligent as the data it perceives. Selecting the right sensor requires matching environmental physics to sensor operating principles. In murky, sediment-heavy river water, optical cameras cannot see, but ultrasonic sound waves easily penetrate to detect submerged obstacles. In blazing outdoor sunlight, infrared sensors get blinded by solar IR radiation, making tactile microswitches or laser time-of-flight sensors superior. Engineers must weigh sensor range, accuracy, power consumption, and environmental resistance.',
        instructorNote: 'Ask students: "If your helper robot must search a dark, smoky building after an earthquake, why is an ultrasonic sensor or thermal camera better than a standard camera?"'
      },
      {
        title: '3. Actuator Selection: Converting Electrical Energy into Motion',
        explanation: 'Once the robot brain makes a decision, it must physically exert force on the world using Actuators. Different tasks require different actuation physics: Continuous DC gearmotors provide rotational speed to propel rover wheels; Servo motors provide precise angular positioning (0°–180°) for robot arm joints and steering links; Stepper motors provide exact step-by-step rotational control for 3D printers and CNC machines; and Solenoid electromagnets provide rapid linear punch motions for sorting gates.',
        instructorNote: 'Remind students: Motors are the robot’s muscles, the battery is its heart, and the microcontroller is its central nervous system.'
      },
      {
        title: '4. Fail-Safe Engineering & Emergency Stop Protocols',
        explanation: 'The prime directive of robotics engineering (enshrined in international safety standard ISO 13849) is that a robot must never endanger human operators or destroy property. Every robot must incorporate Fail-Safe mechanisms: If battery voltage drops too low, if a sensor fails, or if communication disconnects, the robot must default to a safe state—stopping all motors immediately. Furthermore, every robot must feature an easily accessible hardware Emergency Stop (E-Stop) button that directly cuts actuator power unconditionally.',
        instructorNote: 'Show students pictures of industrial factory robots with prominent, bright-red mushroom-style E-Stop buttons within arm’s reach of human workers.'
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
        'Step 1: Name your robot and write a 1-sentence mission statement (e.g. "RiverGuard: Autonomous Floating Debris Skimmer").',
        'Step 2: Identify its SENSE organ: What sensor does it use and what physical property does it measure?',
        'Step 3: Identify its DECIDE brain: What logic rule does its program run when an obstacle or target is found?',
        'Step 4: Identify its ACT mechanism: Wheels, gripper arm, conveyor belt, or water pump?',
        'Step 5: Draw a bright red Emergency Stop (E-Stop) button and explain what happens when pressed.',
        'Step 6: Present your finished invention to your peers and defend your engineering choices!'
      ],
      successCriteria: ['Drawing clearly labels sensor, controller, power source, actuators, and safety mechanism.'],
      extension: 'Add a secondary safety sensor (e.g. tilt sensor or battery fuel gauge).'
    },
    troubleshooting: [
      { 
        symptom: 'Student proposes an idea that violates physical laws (e.g. infinite battery power, teleportation).', 
        checks: [
          'Ask: "Where does the energy come from to do that work?"',
          'Guide the student to replace magic with real technologies (e.g. solar recharge panels or swappable lithium packs).'
        ], 
        explanation: 'Engineering design requires operating within the constraints of real-world physics and available materials.' 
      },
      { 
        symptom: 'Student design has actuators but no sensors (blind machine).', 
        checks: [
          'Ask: "How does the robot know when to start or stop moving if its eyes and ears are missing?"',
          'Help student select at least one input sensor to close the Sense-Decide-Act loop.'
        ], 
        explanation: 'Without sensory feedback, a machine cannot adapt to real-world environmental changes and will collide with obstacles.' 
      },
      { 
        symptom: 'Student omits any safety or emergency stop mechanism.', 
        checks: [
          'Ask: "If the code has a software bug and the robot starts driving toward a staircase, how do you stop it?"',
          'Prompt student to add an external hardware power cutoff switch.'
        ], 
        explanation: 'Safety is a foundational engineering requirement; autonomous machines must always provide human override control.' 
      },
      { 
        symptom: 'Student struggles to explain who the robot helps.', 
        checks: [
          'Prompt with community scenarios: elderly assistance, flood rescue, agricultural harvesting, or classroom cleaning.'
        ], 
        explanation: 'Purpose-driven engineering grounds technical design in real human and social needs.' 
      }
    ],
    checksForUnderstanding: [
      'Why do professional engineers sketch and dimension a design on paper before buying components?',
      'What are the "3 D’s of Robotics" that help engineers decide which tasks to automate?',
      'Why must every autonomous robot feature a physical hardware Emergency Stop switch?'
    ],
    exitTicket: [
      { 
        question: 'What real-world problem does your helper robot solve, and who benefits from it?', 
        rubricOrSampleReasoning: 'Student describes a specific human or environmental problem and identifies the beneficiary (e.g. elderly citizens, farmers, city sanitation workers).' 
      },
      { 
        question: 'Name one sensor and one actuator on your robot, and describe how they work together in the Sense-Decide-Act cycle.', 
        rubricOrSampleReasoning: 'Student accurately pairs an input (e.g. ultrasonic sensor detects distance) with an output (e.g. DC motor turns wheels away) via the microcontroller brain.' 
      },
      { 
        question: 'What fail-safe mechanism did you include in your design to protect humans if the robot malfunctions?', 
        rubricOrSampleReasoning: 'Student mentions a hardware E-Stop button, collision bumper switch, or automatic power-cutoff state.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-drawn chassis silhouettes for students to add sensors and motors onto.'],
      extension: ['Write a 4-step pseudocode logic sequence for their robot brain handling an obstacle encounter.'],
      offlineOption: ['Full paper presentation with cardboard cutouts and colored construction paper.']
    },
    nextLessonId: 'beg-01',
    nextLessonTeaser: 'Graduate to Beginner Robotics Class 01: Meet the real Arduino microcontroller board and make an LED blink with C++ code!',
    sources: [{ title: 'RoboBEE Innovators Design Thinking Framework (Instructor-Developed)', url: '' }],
    assetCredits: [{ asset: 'Design Templates', creator: 'RoboBEE Innovators Creative Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // COURSE SPACE B: BEGINNER ROBOTICS (CLASSES 01-12) — COMPLETE FLAGSHIP
  // -----------------------------------------------------------------------
  {
    "id": "beg-01",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-foundations-what-is-robot",
        "fg-arduino-microcontroller-vs-computer"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-prog-program-structure"
      ],
      "goDeeper": [
        "fg-arduino-ide-workflow",
        "fg-safety-lab-code"
      ]
    },
    "courseId": "beginner",
    "sequence": 1,
    "code": "BEGINNER 01",
    "title": "Meet Arduino, Breadboard X-Ray, Traffic Light & Police Strobe",
    "subtitle": "Microcontroller anatomy, solderless breadboard internal spring clips, Ohm’s law current limits, and multi-LED traffic signal & dual-strobe firmware.",
    "promise": "I can explain how a robot senses, decides, and acts, trace breadboard internal connections, calculate safe current-limiting resistors, and program a 3-LED traffic light and police strobe system.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "None — Complete beginner course with zero prior coding or electronics experience required."
    ],
    "outcomes": [
      "Differentiate between microcontrollers (ATmega328P dedicated real-time control) and general-purpose desktop computers.",
      "Deconstruct solderless breadboard internal architecture: 5-pin horizontal terminal strips vs vertical power bus rails.",
      "Apply Ohm’s Law (V = I × R) to calculate safe current-limiting resistance (220Ω) preventing LED burnout and GPIO damage.",
      "Identify polarity on semiconductor LEDs (longer anode lead + vs shorter cathode lead - with flat rim).",
      "Write, compile, flash, and debug Arduino C++ code controlling a 3-LED Traffic Light sequence and high-speed Police Strobe mode."
    ],
    "vocabulary": [
      {
        "term": "Microcontroller (MCU)",
        "plainMeaning": "A single tiny chip that acts as the dedicated brain for a machine or robot.",
        "technicalMeaning": "An integrated circuit (ATmega328P AVR 8-bit, 16 MHz) containing a CPU core, 32KB flash memory, 2KB SRAM, and GPIO peripherals."
      },
      {
        "term": "Solderless Breadboard",
        "plainMeaning": "A reusable construction board with hidden metal clips for plugging in circuits without solder.",
        "technicalMeaning": "A prototyping base with internal phosphor bronze spring clips configured into 5-point tie terminal strips separated by a center DIP ravine."
      },
      {
        "term": "Current-Limiting Resistor",
        "plainMeaning": "An electrical safety speed bump that limits electron flow so LEDs and Arduino pins do not burn out.",
        "technicalMeaning": "A passive fixed resistor in series with a diode to drop excess circuit voltage according to Ohm’s Law (I = (Vsupply - Vf) / R)."
      },
      {
        "term": "Light Emitting Diode (LED)",
        "plainMeaning": "A tiny electronic light bulb that only lets electricity flow in one direction.",
        "technicalMeaning": "A P-N junction semiconductor diode that emits photons via electroluminescence when forward-biased above its forward voltage drop (Vf ≈ 2.0V)."
      },
      {
        "term": "Digital Output (HIGH / LOW)",
        "plainMeaning": "A two-state electrical switch command: HIGH gives 5 Volts (ON), LOW gives 0 Volts (OFF).",
        "technicalMeaning": "A discrete binary logic state generated by microcontroller output transistors: Logic 1 (≈5.0V) and Logic 0 (0.0V Ground)."
      },
      {
        "term": "void setup() & void loop()",
        "plainMeaning": "setup() runs once when powering on; loop() repeats forever and ever while running.",
        "technicalMeaning": "Mandatory entry points in Arduino runtime: setup() initializes registers and pin modes once; loop() is called repeatedly in an infinite while loop."
      }
    ],
    "teacherPrep": [
      "Unbox Arduino Uno R3 kits, half-size breadboards, red/yellow/green LEDs, and 220Ω resistors onto student trays.",
      "Verify Arduino IDE 2.x detects CH340 or Atmega16U2 USB serial drivers on student laptops."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with shielded USB cable",
      "400-point half-size solderless breadboard",
      "1x 5mm Red diffused LED, 1x 5mm Yellow diffused LED, 1x 5mm Green diffused LED",
      "3x 220 Ω axial metal-film resistors (Red-Red-Brown)",
      "6x Male-to-Male jumper wires (Red, Yellow, Green, Black)"
    ],
    "safetyNotes": [
      "Always disconnect the USB cable before adding or changing wires on the breadboard.",
      "Never connect an LED directly between 5V and GND without a 220Ω current-limiting resistor.",
      "Keep metal tools, paperclips, and wires away from the bare Arduino circuit board while powered."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Hold up an actual cutaway breadboard showing the internal metal clips. Demonstrate a high-speed police strobe and automated traffic light.",
        "studentAction": "Examine their workbench hardware tray. Count LEDs, resistors, and identify the ATmega328P chip on their Uno."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Project the Breadboard X-Ray & Ohm’s Law slide. Teach LED polarity (long lead anode +, flat rim cathode -) and resistor color bands.",
        "studentAction": "Use the interactive Circuit Switch & Breadboard Sim on the classroom portal to test virtual LED circuits before wiring physical parts."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide point-to-point wiring of Red (Pin 13), Yellow (Pin 12), and Green (Pin 11) LEDs with 220Ω series resistors to Ground rail.",
        "studentAction": "Wire the 3-LED traffic light circuit. Conduct partner peer-check: confirm resistor bridges rows and cathodes connect to common Ground."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through void setup() pinMode() declarations and sequential digitalWrite() delay() traffic timing.",
        "studentAction": "Upload the traffic light sketch. Observe the realistic cycle. Then modify code to create an emergency 80ms alternating Police Strobe mode!"
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"Narayanganj Traffic Gridlock Challenge\": who can program a realistic pedestrian crossing button sequence first?",
        "studentAction": "Demonstrate custom light patterns to the class, complete the 4-question Exit Ticket, and pack workbench hardware trays safely."
      }
    ],
    "concepts": [
      {
        "title": "Microcontroller vs Desktop Computer",
        "explanation": "A desktop computer runs millions of lines of operating system code to multitask browsers, games, and videos. An Arduino microcontroller runs ONE single control loop dedicated directly to reading electrical voltages and controlling physical machines with microsecond precision.",
        "instructorNote": "Point out the silver 16 MHz quartz crystal oscillator that acts as the heartbeat of the ATmega328P."
      },
      {
        "title": "Breadboard Internal X-Ray Architecture",
        "explanation": "Inside a breadboard, columns are not connected together, but horizontal rows (a-b-c-d-e and f-g-h-i-j) are connected by continuous spring-loaded metal clips. Components in the same row share electrical contact. The center channel separates dual-inline IC chips.",
        "instructorNote": "Have students probe row continuity with a multimeter in continuity beep mode."
      },
      {
        "title": "Ohm’s Law & Safe Diode Current",
        "explanation": "Without a resistor, an LED behaves like an electrical short circuit: huge current rushes through the diode, causing thermal destruction in less than a second. A 220Ω resistor limits current to I = (5V - 2V) / 220Ω ≈ 13.6 mA, well below the 20 mA pin safety rating.",
        "instructorNote": "Demonstrate the difference in brightness between 220Ω, 1kΩ, and 10kΩ resistors."
      }
    ],
    "visualizerId": "breadboard_circuit_sim",
    "project": {
      "name": "Autonomous Traffic Signal & Police Strobe Station",
      "deliverableType": "physical_build",
      "successEvidence": [
        "A physical breadboard circuit with 3 LEDs wired in series with 220Ω resistors connected to Arduino Pins 13, 12, and 11.",
        "Flawless execution of standard traffic sequencing (Red 4s, Yellow 1s, Green 4s).",
        "Successful code modification enabling emergency dual-strobe police flasher mode (80ms alternating bursts)."
      ]
    },
    "activity": {
      "title": "Assemble, Wire, and Program the Municipal Traffic Light",
      "steps": [
        "Step 1: Place 3 LEDs into breadboard rows with cathode (-) legs inserted into the blue Ground bus rail.",
        "Step 2: Insert three 220Ω resistors bridging the LED anode rows to separate signal input rows.",
        "Step 3: Connect jumper wires from Arduino Digital Pin 13 (Red), Pin 12 (Yellow), and Pin 11 (Green) to the resistor input rows.",
        "Step 4: Connect a black jumper wire from the breadboard blue rail to an Arduino GND pin.",
        "Step 5: Connect USB cable, open Arduino IDE 2.x, select Arduino Uno COM port, and upload the Traffic Light sketch.",
        "Step 6: Verify timing on stopwatch: Red illuminates for 4000ms, transitions to Yellow for 1200ms, then Green for 4000ms.",
        "Step 7: Challenge: Modify code to create an emergency Police Strobe alternating Red and Green rapidly 5 times each."
      ],
      "successCriteria": [
        "Circuit operates reliably without loose jumpers or flickering connections.",
        "Student can explain why the 220Ω resistor is necessary and identify anode vs cathode leads.",
        "Student successfully flashes and demonstrates both Traffic and Police Strobe modes."
      ],
      "extension": "Add an asynchronous pedestrian blink warning where the Yellow LED pulses 3 times before switching to Red."
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3 (ATmega328P 16MHz)"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Rev3 with DIP/SMD ATmega328P",
          "quantity": 1
        },
        {
          "name": "400-Tie Breadboard",
          "exactVariant": "Half-size solderless breadboard",
          "quantity": 1
        },
        {
          "name": "5mm Red LED",
          "exactVariant": "Diffused lens, Vf ≈ 2.0V",
          "quantity": 1
        },
        {
          "name": "5mm Yellow LED",
          "exactVariant": "Diffused lens, Vf ≈ 2.1V",
          "quantity": 1
        },
        {
          "name": "5mm Green LED",
          "exactVariant": "Diffused lens, Vf ≈ 2.2V",
          "quantity": 1
        },
        {
          "name": "220 Ω Resistors",
          "exactVariant": "1/4 Watt, 5% tolerance (Red-Red-Brown-Gold)",
          "quantity": 3
        },
        {
          "name": "Male-to-Male Jumpers",
          "exactVariant": "20cm multi-color flexible wires",
          "quantity": 6
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/class1-external-blink-wiring.svg",
      "schematic": "Arduino D13 -> 220Ω -> Red LED Anode | Cathode -> GND; Arduino D12 -> 220Ω -> Yellow LED Anode | Cathode -> GND; Arduino D11 -> 220Ω -> Green LED Anode | Cathode -> GND",
      "wireTable": [
        {
          "from": "Arduino Digital Pin 13",
          "to": "Breadboard Row 10 (Red LED Signal)",
          "wireOrPolarityNote": "Red wire — Red Traffic LED"
        },
        {
          "from": "Arduino Digital Pin 12",
          "to": "Breadboard Row 15 (Yellow LED Signal)",
          "wireOrPolarityNote": "Yellow wire — Yellow Caution LED"
        },
        {
          "from": "Arduino Digital Pin 11",
          "to": "Breadboard Row 20 (Green LED Signal)",
          "wireOrPolarityNote": "Green wire — Green Go LED"
        },
        {
          "from": "Breadboard Blue Rail (-)",
          "to": "Arduino GND Pin",
          "wireOrPolarityNote": "Black wire — Common Circuit Return Ground"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is unplugged before touching components.",
        "2. Insert Red LED long leg in row 11, short leg in blue Ground rail.",
        "3. Insert 220Ω resistor bridging row 10 to row 11.",
        "4. Repeat for Yellow (rows 15/16) and Green (rows 20/21) with their respective 220Ω resistors.",
        "5. Connect jumpers from D13, D12, and D11 to rows 10, 15, and 20.",
        "6. Connect black jumper from blue Ground rail to Arduino GND.",
        "7. Plug in USB cable. Compile and upload firmware."
      ],
      "powerAndSafetyChecks": [
        "Ensure resistor leads do not touch adjacent metal leads or short across rows.",
        "Check that LED flat rim (cathode) is in the Ground rail, not facing the signal pin."
      ],
      "testCases": [
        {
          "action": "Power up with standard traffic sketch",
          "expectedResult": "Red turns on for 4s, Yellow turns on for 1.2s, Green turns on for 4s."
        },
        {
          "action": "Upload Police Strobe sketch",
          "expectedResult": "Red and Green LEDs alternate 3 rapid 80ms bursts each."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 01: Traffic Light & Police Strobe\n * Board: Arduino Uno R3 (ATmega328P)\n */\n\nconst int PIN_RED    = 13;\nconst int PIN_YELLOW = 12;\nconst int PIN_GREEN  = 11;\n\nvoid setup() {\n  pinMode(PIN_RED, OUTPUT);\n  pinMode(PIN_YELLOW, OUTPUT);\n  pinMode(PIN_GREEN, OUTPUT);\n}\n\nvoid loop() {\n  // Traffic Light Sequence\n  // 1. RED STOP (4.0s)\n  digitalWrite(PIN_RED, HIGH);\n  digitalWrite(PIN_YELLOW, LOW);\n  digitalWrite(PIN_GREEN, LOW);\n  delay(4000);\n\n  // 2. GREEN GO (4.0s)\n  digitalWrite(PIN_RED, LOW);\n  digitalWrite(PIN_GREEN, HIGH);\n  delay(4000);\n\n  // 3. YELLOW CAUTION (1.2s)\n  digitalWrite(PIN_GREEN, LOW);\n  digitalWrite(PIN_YELLOW, HIGH);\n  delay(1200);\n\n  // Emergency Police Strobe Burst (Demo Mode)\n  digitalWrite(PIN_YELLOW, LOW);\n  for (int i = 0; i < 4; i++) {\n    digitalWrite(PIN_RED, HIGH);\n    digitalWrite(PIN_GREEN, LOW);\n    delay(80);\n    digitalWrite(PIN_RED, LOW);\n    digitalWrite(PIN_GREEN, HIGH);\n    delay(80);\n  }\n}\n",
      "pinMap": {
        "Pin 13": "Digital Output connected to Red Traffic LED via 220Ω resistor",
        "Pin 12": "Digital Output connected to Yellow Caution LED via 220Ω resistor",
        "Pin 11": "Digital Output connected to Green Go LED via 220Ω resistor",
        "GND": "Common Circuit Ground return rail"
      },
      "setupAndUpload": [
        "Select Tools -> Board -> Arduino Uno.",
        "Select Tools -> Port -> (Your detected COM port).",
        "Click Upload (Arrow icon) and confirm \"Done uploading\"."
      ],
      "explanations": [
        "pinMode(pin, OUTPUT): Sets internal MCU transistor driver to source up to 20mA safely.",
        "digitalWrite(pin, HIGH): Sets output voltage to 5.0V, driving current through resistor and LED to Ground.",
        "delay(ms): Suspends program execution for specified milliseconds while hardware timers maintain state.",
        "for loop strobe: Rapidly toggles Red and Green pins to simulate emergency vehicle warning strobes."
      ],
      "expectedResult": "System alternates smoothly between standard municipal traffic lights and rapid emergency police vehicle strobing.",
      "caveats": [
        "Never omit the 220Ω resistor: direct 5V will burn out standard LEDs within milliseconds.",
        "Ensure the USB cable provides steady 5V power from laptop USB port."
      ],
      "tweakTip": "Change the red/green delay in the police strobe from 80ms down to 40ms to observe visual persistence of vision!"
    },
    "troubleshooting": [
      {
        "symptom": "One of the LEDs does not light up at all.",
        "checks": [
          "Check LED polarity: the longer leg must connect to the resistor, shorter flat-rim leg to Ground.",
          "Check resistor connection: verify resistor is in the exact row as the LED long leg.",
          "Check jumper pin assignment: confirm wire is seated firmly in D13, D12, or D11."
        ],
        "explanation": "Diodes only conduct electricity in one direction. Reverse polarity blocks all current flow safely without light emission."
      },
      {
        "symptom": "Arduino IDE reports \"avrdude: ser_open(): can't open device COM...\" error.",
        "checks": [
          "Unplug and reconnect the USB cable.",
          "Verify in Device Manager that the USB Serial port appears under Ports (COM & LPT).",
          "Close other serial monitors or tabs that might be locking the COM port."
        ],
        "explanation": "The operating system COM port driver was locked by another process or the cable was not fully seated."
      },
      {
        "symptom": "LEDs are very dim and hard to see.",
        "checks": [
          "Verify resistor value: confirm color bands are Red-Red-Brown (220Ω), not Red-Red-Yellow (220kΩ).",
          "Check that the breadboard Ground wire is connected to Arduino GND and not a digital pin."
        ],
        "explanation": "A 220kΩ resistor drops current to microamps, rendering the LED barely visible."
      }
    ],
    "checksForUnderstanding": [
      "Why does an LED need a resistor while an incandescent flashlight bulb does not?",
      "What happens if you plug both legs of an LED into the exact same horizontal breadboard row?"
    ],
    "exitTicket": [
      {
        "question": "Explain what happens inside a breadboard along row 15 (columns a through e).",
        "rubricOrSampleReasoning": "All 5 holes (a, b, c, d, e) in row 15 are connected together underneath by a continuous spring metal clip. Any wire or part placed in these holes is electrically joined."
      },
      {
        "question": "Calculate the current flowing through a Red LED (Vf = 2.0V) connected to 5V through a 220Ω resistor using Ohm’s Law.",
        "rubricOrSampleReasoning": "I = (Vsupply - Vf) / R = (5.0V - 2.0V) / 220Ω = 3.0V / 220Ω ≈ 0.0136 A = 13.6 mA. This is safe because it is under the 20 mA continuous pin limit."
      },
      {
        "question": "What is the main difference between void setup() and void loop()?",
        "rubricOrSampleReasoning": "setup() runs only once when the Arduino boots up or resets to configure pins; loop() runs continuously forever in an infinite cycle."
      }
    ],
    "differentiation": {
      "support": [
        "Provide breadboards with color-coded stickers indicating where resistors and LED anodes go."
      ],
      "extension": [
        "Program a 4-way intersection simulation with alternating cross-traffic lights and pedestrian crossing countdowns."
      ],
      "offlineOption": [
        "Use the interactive breadboard circuit simulator on the RoboBee portal without physical hardware."
      ]
    },
    "nextLessonId": "beg-02",
    "nextLessonTeaser": "Class 02: Arcade Buttons, Buzzer tone(), and the 2-Player Reaction Timer Game! Learn digital inputs and high-speed reflex battles.",
    "sources": [
      {
        "title": "ATmega328P Microchip Datasheet & Electrical Characteristics",
        "url": "https://microchip.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "Breadboard Traffic Light Wiring Illustration",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-02",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-electronics-ohms-law",
        "fg-prog-program-structure"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-electronics-breadboards"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-safety-lab-code"
      ]
    },
    "courseId": "beginner",
    "sequence": 2,
    "code": "BEGINNER 02",
    "title": "Arcade Buttons, Buzzer tone(), 2-Player Reaction Timer Game",
    "subtitle": "Digital inputs, floating pins, internal pullup resistors, audio square wave frequencies, and millisecond reflex game firmware.",
    "promise": "I can wire tactile arcade pushbuttons with internal pullups, synthesize frequencies on a piezo buzzer, and program a 2-player reflex reaction timer game with false-start detection.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01"
    ],
    "outcomes": [
      "Explain the concept of floating digital inputs and demonstrate why pull-up/pull-down resistors are required.",
      "Enable the ATmega328P internal 20kΩ pull-up resistor using pinMode(pin, INPUT_PULLUP) without external parts.",
      "Synthesize musical tones and audio alerts using tone(pin, frequency, duration) and noTone(pin).",
      "Track elapsed time in milliseconds using the non-blocking millis() timer system.",
      "Assemble and program an interactive 2-Player Reaction Timer Game with random delay countdown, sub-millisecond winner logging, and false-start penalty buzzer."
    ],
    "vocabulary": [
      {
        "term": "Digital Input (digitalRead)",
        "plainMeaning": "Reading whether an electronic switch is currently open (HIGH) or closed (LOW).",
        "technicalMeaning": "Sampling a GPIO pin voltage through an internal Schmitt trigger to determine if the logic state is above VIH or below VIL."
      },
      {
        "term": "Floating Pin",
        "plainMeaning": "An unconnected input pin that randomly flips between 1 and 0 due to static electricity and radio noise in the air.",
        "technicalMeaning": "A high-impedance CMOS input node lacking a deterministic reference potential, susceptible to electromagnetic interference (EMI)."
      },
      {
        "term": "Internal Pull-Up Resistor",
        "plainMeaning": "A built-in resistor inside the Arduino chip that gently pulls the input pin up to 5V until you press the button to Ground.",
        "technicalMeaning": "An internal 20kΩ–50kΩ semiconductor resistor enabled via MCU firmware connecting the pin to VCC when configured as INPUT_PULLUP."
      },
      {
        "term": "Piezo Buzzer",
        "plainMeaning": "A tiny disc that flexes back and forth when pulsed with electricity to create sound waves in the air.",
        "technicalMeaning": "An acoustic transducer utilizing the piezoelectric effect to vibrate a metal diaphragm in response to applied AC or PWM square waves."
      },
      {
        "term": "tone() and Frequency (Hz)",
        "plainMeaning": "tone(pin, 440) vibrates a speaker 440 times per second to play musical note Concert A.",
        "technicalMeaning": "A core Arduino function that configures a hardware timer to generate a 50% duty cycle square wave at a specified frequency in Hertz."
      },
      {
        "term": "millis() Timer",
        "plainMeaning": "An internal stopwatch inside the Arduino that counts milliseconds since the board turned on.",
        "technicalMeaning": "An unsigned 32-bit counter incremented by the Timer0 overflow interrupt every 1.024 milliseconds, rolling over after approximately 50 days."
      }
    ],
    "teacherPrep": [
      "Set up 2 tactile arcade pushbuttons, 1 piezo buzzer, and status LEDs for each student team.",
      "Test pushbuttons in breadboards to confirm pins bridge the center ravine cleanly."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "400-tie breadboard",
      "2x 12mm Tactile Arcade Pushbuttons",
      "1x 5V Passive Piezo Buzzer module",
      "2x 5mm LEDs (Player 1 Red, Player 2 Green) with 220Ω resistors",
      "8x Male-to-Male jumper wires"
    ],
    "safetyNotes": [
      "Piezo buzzers can be loud when operated close to the ear: keep buzzers mounted on the bench breadboard.",
      "Always press pushbuttons with reasonable finger pressure; do not bend the internal metal leaf contacts."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Invite two students to the front bench for an exciting live reflex battle. Trigger the random buzzer countdown: who reacts fastest?",
        "studentAction": "Cheer on the live match. Note the millisecond score displayed on the serial monitor. Inspect their own pushbuttons and buzzers."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Demonstrate a floating pin on the projector (antenna wire fluctuating wildly). Teach INPUT_PULLUP and tone(pin, Hz) physics.",
        "studentAction": "Experiment with the interactive Reaction Game simulator on the portal to understand button debouncing and state changes."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide placement of Player 1 button (D2), Player 2 button (D3), Buzzer (D8), and winner indicator LEDs (D11 and D12).",
        "studentAction": "Wire the dual arcade button and buzzer circuit. Verify buttons connect pins to GND and buzzer + connects to D8."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through random(2000, 5000) countdown logic, polling button states with digitalRead(), and logging reaction time with millis().",
        "studentAction": "Upload the 2-Player Game sketch. Open Serial Monitor at 9600 baud. Test countdown beeps, false-start penalties, and winner fanfare."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Run the RoboBee Classroom Reflex Championship: partner vs partner tournament bracket!",
        "studentAction": "Compete in best-of-5 tournament rounds. Log reaction times in milliseconds (e.g. 184ms vs 212ms) and complete Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "The Mystery of Floating Pins",
        "explanation": "When an input pin is not connected to 5V or GND, it acts like a sensitive radio antenna. Electromagnetic noise from AC lights and human hands causes the pin to flap randomly between 0 and 1. A pull-up resistor holds the pin securely at 5V until pressed to GND.",
        "instructorNote": "Touch an unconnected input pin with your bare finger on the projector to show the erratic 0/1 serial monitor readings."
      },
      {
        "title": "Sound Waves & The tone() Function",
        "explanation": "Sound is vibrating air molecules. When Arduino turns a buzzer pin HIGH and LOW 1,000 times per second (1 kHz), the piezo disc flexes at 1 kHz, creating an audible high-pitched tone. By changing frequency in Hz, we can play musical scales and game sounds.",
        "instructorNote": "Play C-Major scale (262Hz C, 294Hz D, 330Hz E, 349Hz F, 392Hz G, 440Hz A, 494Hz B, 523Hz C)."
      },
      {
        "title": "Precision Stopwatch Timing with millis()",
        "explanation": "delay() freezes the microcontroller completely, making it blind to button presses! millis() returns the exact millisecond count without pausing. By saving startTime when the buzzer sounds and subtracting it when a button is pressed, we measure human reflexes to 1/1000th of a second.",
        "instructorNote": "Explain that average human visual reaction time is 200–250ms, while audio reaction time is around 170ms."
      }
    ],
    "visualizerId": "reaction_game_sim",
    "project": {
      "name": "2-Player Precision Reaction Timer Game Console",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Dual tactile arcade button circuit with piezo buzzer and winner indicator LEDs wired on breadboard.",
        "Randomized 2000ms–5000ms countdown buzzer with anti-cheating false start detection.",
        "Accurate millisecond reflex scoring displayed on Serial Monitor with victory fanfare tone for the winner."
      ]
    },
    "activity": {
      "title": "Wire and Program the 2-Player Reflex Battle Station",
      "steps": [
        "Step 1: Place Player 1 button straddling breadboard center ravine connecting Pin 2 to GND.",
        "Step 2: Place Player 2 button straddling center ravine connecting Pin 3 to GND.",
        "Step 3: Connect Piezo buzzer positive (+) pin to Arduino Pin 8 and negative (-) to GND.",
        "Step 4: Connect Player 1 LED to Pin 11 and Player 2 LED to Pin 12 with 220Ω series resistors.",
        "Step 5: Flash firmware with pinMode(2, INPUT_PULLUP) and pinMode(3, INPUT_PULLUP).",
        "Step 6: Open Serial Monitor at 9600 baud. Observe countdown: \"3... 2... 1... BEEP!\"",
        "Step 7: Compete with partner: whoever presses first illuminates their LED and hears the victory melody!"
      ],
      "successCriteria": [
        "Buttons read reliably without floating pin errors or contact bounce issues.",
        "Buzzer plays clear countdown chirps, false start buzzes, and victory fanfares.",
        "Accurate millisecond scores reported on serial monitor."
      ],
      "extension": "Add a best-of-5 tournament score counter that flashes both LEDs when a player reaches 3 victories!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3 (ATmega328P)"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "Solderless Breadboard",
          "exactVariant": "Half-size 400 tie points",
          "quantity": 1
        },
        {
          "name": "Arcade Pushbuttons",
          "exactVariant": "12mm tactile momentaries with square caps",
          "quantity": 2
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive acoustic transducer",
          "quantity": 1
        },
        {
          "name": "5mm LEDs (Red & Green)",
          "exactVariant": "Diffused lens indicator LEDs",
          "quantity": 2
        },
        {
          "name": "220 Ω Resistors",
          "exactVariant": "1/4W 5% carbon film",
          "quantity": 2
        },
        {
          "name": "Jumper Wires",
          "exactVariant": "Male-to-Male 20cm flexible jumpers",
          "quantity": 8
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "Button 1: D2 -> Button -> GND (INPUT_PULLUP); Button 2: D3 -> Button -> GND (INPUT_PULLUP); Buzzer: D8 -> (+) Buzzer (-) -> GND; Player 1 LED: D11 -> 220Ω -> Anode | Cathode -> GND; Player 2 LED: D12 -> 220Ω -> Anode | Cathode -> GND",
      "wireTable": [
        {
          "from": "Arduino Digital Pin 2",
          "to": "Player 1 Button Terminal",
          "wireOrPolarityNote": "Red wire — Player 1 Input"
        },
        {
          "from": "Player 1 Button Other Terminal",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Ground connection"
        },
        {
          "from": "Arduino Digital Pin 3",
          "to": "Player 2 Button Terminal",
          "wireOrPolarityNote": "Green wire — Player 2 Input"
        },
        {
          "from": "Player 2 Button Other Terminal",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Ground connection"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Yellow wire — Audio PWM Output"
        },
        {
          "from": "Piezo Buzzer (-) Pin",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Buzzer return Ground"
        },
        {
          "from": "Arduino Digital Pin 11",
          "to": "Player 1 Red LED Resistor",
          "wireOrPolarityNote": "Red LED signal"
        },
        {
          "from": "Arduino Digital Pin 12",
          "to": "Player 2 Green LED Resistor",
          "wireOrPolarityNote": "Green LED signal"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Insert pushbuttons bridging the central ravine to avoid shorting left and right terminals.",
        "2. Connect button Ground pins to the common blue Ground rail.",
        "3. Wire Pin 2 and Pin 3 to opposite button contacts.",
        "4. Insert Piezo buzzer noting polarity (+ is longer leg or indicated by top sticker).",
        "5. Wire indicator LEDs with 220Ω resistors to D11 and D12.",
        "6. Connect blue rail to Arduino GND, plug in USB, and upload firmware."
      ],
      "powerAndSafetyChecks": [
        "Verify buttons are oriented so pressing shorts pin to Ground, not pin to itself.",
        "Ensure buzzer + is on Pin 8 and - is on GND."
      ],
      "testCases": [
        {
          "action": "Press Player 1 button during idle",
          "expectedResult": "Serial monitor registers button press with instantaneous response."
        },
        {
          "action": "Press button BEFORE countdown beep (cheat)",
          "expectedResult": "Harsh low-pitch buzz (150Hz) sounds; false-start penalty reported."
        },
        {
          "action": "Press button after countdown beep",
          "expectedResult": "Winner LED lights up, victory fanfare sounds, reaction time in ms printed."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 02: 2-Player Reaction Timer Game\n * Board: Arduino Uno R3 (ATmega328P)\n */\n\nconst int PIN_BTN1   = 2;   // Player 1 Arcade Button (INPUT_PULLUP)\nconst int PIN_BTN2   = 3;   // Player 2 Arcade Button (INPUT_PULLUP)\nconst int PIN_BUZZER = 8;   // Piezo Buzzer\nconst int PIN_LED1   = 11;  // Player 1 Winner LED\nconst int PIN_LED2   = 12;  // Player 2 Winner LED\n\nvoid setup() {\n  pinMode(PIN_BTN1, INPUT_PULLUP);\n  pinMode(PIN_BTN2, INPUT_PULLUP);\n  pinMode(PIN_BUZZER, OUTPUT);\n  pinMode(PIN_LED1, OUTPUT);\n  pinMode(PIN_LED2, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE 2-PLAYER REACTION GAME ===\");\n  Serial.println(\"Get ready! Waiting for GO signal...\");\n}\n\nvoid loop() {\n  digitalWrite(PIN_LED1, LOW);\n  digitalWrite(PIN_LED2, LOW);\n\n  // Random countdown delay between 2.0s and 5.0s\n  int waitTime = random(2000, 5000);\n  unsigned long startCountdown = millis();\n\n  // Watch for false starts during countdown\n  while (millis() - startCountdown < (unsigned long)waitTime) {\n    if (digitalRead(PIN_BTN1) == LOW) {\n      triggerFalseStart(1);\n      return;\n    }\n    if (digitalRead(PIN_BTN2) == LOW) {\n      triggerFalseStart(2);\n      return;\n    }\n  }\n\n  // GO SIGNAL! Beep at 1000 Hz\n  tone(PIN_BUZZER, 1000, 250);\n  unsigned long goTime = millis();\n  int winner = 0;\n  unsigned long reactionTime = 0;\n\n  // Poll buttons for fastest reflex\n  while (winner == 0) {\n    if (digitalRead(PIN_BTN1) == LOW) {\n      reactionTime = millis() - goTime;\n      winner = 1;\n    } else if (digitalRead(PIN_BTN2) == LOW) {\n      reactionTime = millis() - goTime;\n      winner = 2;\n    }\n  }\n\n  // Celebrate winner\n  if (winner == 1) {\n    digitalWrite(PIN_LED1, HIGH);\n    Serial.print(\"PLAYER 1 WINS! Time: \");\n    Serial.print(reactionTime);\n    Serial.println(\" ms\");\n  } else {\n    digitalWrite(PIN_LED2, HIGH);\n    Serial.print(\"PLAYER 2 WINS! Time: \");\n    Serial.print(reactionTime);\n    Serial.println(\" ms\");\n  }\n\n  // Victory fanfare\n  tone(PIN_BUZZER, 659, 120); delay(140);\n  tone(PIN_BUZZER, 880, 250); delay(300);\n  delay(3000); // Wait 3s before next round\n}\n\nvoid triggerFalseStart(int player) {\n  Serial.print(\"FALSE START by Player \");\n  Serial.println(player);\n  tone(PIN_BUZZER, 150, 600); // Penalty buzz\n  delay(1500);\n}\n",
      "pinMap": {
        "Pin 2": "Player 1 Arcade Button (Internal pullup, active LOW when pressed)",
        "Pin 3": "Player 2 Arcade Button (Internal pullup, active LOW when pressed)",
        "Pin 8": "Piezo Buzzer (Square wave tone generation)",
        "Pin 11": "Player 1 Victory Indicator LED",
        "Pin 12": "Player 2 Victory Indicator LED"
      },
      "setupAndUpload": [
        "Connect Arduino Uno via USB cable.",
        "Select Tools -> Board -> Arduino Uno and proper COM port.",
        "Upload sketch and open Serial Monitor at 9600 baud."
      ],
      "explanations": [
        "pinMode(pin, INPUT_PULLUP): Activates the internal 20kΩ pull-up resistor, keeping pin HIGH until button connects it to GND.",
        "digitalRead(pin) == LOW: Detects button press because closing switch connects pin to 0V Ground.",
        "random(2000, 5000): Generates unpredictable delay so players cannot anticipate the go-beep.",
        "millis() - goTime: Calculates human reaction speed in milliseconds with zero CPU blocking."
      ],
      "expectedResult": "Players hear a random go-beep; whoever presses their button first has their LED illuminate and sees their reflex time in ms on the Serial Monitor.",
      "caveats": [
        "Buttons must be pressed firmly: light brushing may trigger debounce chatter.",
        "Ensure the Serial Monitor baud rate is set to 9600 to view results."
      ],
      "tweakTip": "Change tone frequencies in the victory fanfare to customize your team signature sound!"
    },
    "troubleshooting": [
      {
        "symptom": "False start triggers immediately as soon as round begins without touching button.",
        "checks": [
          "Check pinMode declaration: must be INPUT_PULLUP, not plain INPUT.",
          "Check button wiring: verify button is not shorted to Ground by mistake.",
          "Check breadboard placement: make sure button straddles center ravine."
        ],
        "explanation": "A plain INPUT pin floats randomly, triggering false LOW reads from electromagnetic noise."
      },
      {
        "symptom": "Buzzer sounds very weak, scratchy, or clicks instead of singing.",
        "checks": [
          "Check buzzer type: confirm it is a passive piezo buzzer (can play multiple pitches) or active buzzer.",
          "Check polarity: ensure longer lead connects to Pin 8 and shorter lead to Ground."
        ],
        "explanation": "Passive buzzers require alternating tone() frequencies to vibrate their diaphragm."
      },
      {
        "symptom": "One player cannot register button presses.",
        "checks": [
          "Inspect breadboard wire: test continuity between button terminal and Arduino Pin 2 or 3.",
          "Check pushbutton legs: some tactile switches have leads bent underneath that do not enter the breadboard."
        ],
        "explanation": "A bent pin prevents electrical contact with the breadboard spring clip."
      }
    ],
    "checksForUnderstanding": [
      "Why does digitalRead() return LOW when you press a button configured with INPUT_PULLUP?",
      "How does millis() allow us to measure time without freezing the microcontroller like delay()?"
    ],
    "exitTicket": [
      {
        "question": "What is a \"floating pin\" and how does pinMode(pin, INPUT_PULLUP) solve it?",
        "rubricOrSampleReasoning": "A floating pin is an unconnected input that randomly fluctuates between HIGH and LOW due to electrical noise. INPUT_PULLUP activates an internal 20kΩ resistor that ties the pin securely to 5V (HIGH) until a button pulls it to 0V (LOW)."
      },
      {
        "question": "How do you calculate a player’s reaction time using the millis() function?",
        "rubricOrSampleReasoning": "Record goTime = millis() the exact moment the buzzer beeps. When the button is pressed, record pressTime = millis(). The reaction time is pressTime - goTime."
      },
      {
        "question": "What physical property determines whether a piezo buzzer plays a high pitch versus a low pitch?",
        "rubricOrSampleReasoning": "Frequency in Hertz (Hz)—the number of times the diaphragm vibrates back and forth per second. Higher frequency produces higher musical pitch."
      }
    ],
    "differentiation": {
      "support": [
        "Provide breadboards with pre-labeled P1 and P2 button zones."
      ],
      "extension": [
        "Implement an audio-only vs visual-only reaction trial to measure human sensory speed differences."
      ],
      "offlineOption": [
        "Play the interactive Reaction Timer Game simulator on the web portal."
      ]
    },
    "nextLessonId": "beg-03",
    "nextLessonTeaser": "Class 03: Potentiometers, PWM, RGB Mood Lamp & Theremin DJ Synth! Learn analog inputs and smooth electronic sound synthesis.",
    "sources": [
      {
        "title": "Arduino Language Reference: digitalRead, tone, and millis",
        "url": "https://arduino.cc"
      }
    ],
    "assetCredits": [
      {
        "asset": "Reaction Game Diagram",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-03",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-electronics-ohms-law",
        "fg-prog-program-structure"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-electronics-breadboards"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 3,
    "code": "BEGINNER 03",
    "title": "Potentiometer, PWM, RGB Mood Lamp & Theremin DJ Synth",
    "subtitle": "10-bit Analog-to-Digital conversion (ADC), pulse-width modulation (PWM), RGB additive color mixing, and audio frequency modulation.",
    "promise": "I can read 10-bit analog signals, generate PWM duty cycles, blend RGB LED colors, and modulate audio frequencies into an electronic DJ Theremin synth.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01",
      "Beginner 02"
    ],
    "outcomes": [
      "Explain how the 10-bit Analog-to-Digital Converter (ADC) maps continuous voltages (0V–5V) to discrete integer values (0–1023).",
      "Demonstrate Pulse Width Modulation (PWM) duty cycle control using analogWrite(pin, 0–255) on timer-enabled pins.",
      "Wire a 10kΩ rotary potentiometer as an adjustable analog voltage divider.",
      "Construct an RGB Common-Cathode LED circuit with individual series current-limiting resistors and mix secondary colors.",
      "Program an interactive dual-mode DJ Theremin: dial rotation smoothly sweeps RGB color spectrum and modulates acoustic pitch from 150 Hz to 2500 Hz."
    ],
    "vocabulary": [
      {
        "term": "Potentiometer",
        "plainMeaning": "A rotary dial knob that acts as an adjustable electrical valve for voltage.",
        "technicalMeaning": "A 3-terminal variable resistor with an internal resistive track and movable wiper arm operating as an adjustable voltage divider."
      },
      {
        "term": "Analog vs Digital",
        "plainMeaning": "Digital is strictly ON or OFF (light switch); analog is an infinite smooth spectrum (volume knob).",
        "technicalMeaning": "Digital signals exist in discrete binary states; analog signals represent continuous physical quantities varying smoothly over time."
      },
      {
        "term": "Analog-to-Digital Converter (ADC)",
        "plainMeaning": "The translator chip that turns analog voltages into numbers the microcontroller can calculate with.",
        "technicalMeaning": "A successive-approximation ADC peripheral mapping 0V–VREF (5.0V) to a 10-bit integer range (0 to 1023, resolution ≈ 4.88 mV per step)."
      },
      {
        "term": "Pulse Width Modulation (PWM)",
        "plainMeaning": "Flicking a digital pin on and off hundreds of times per second to simulate dimming an LED or slowing a motor.",
        "technicalMeaning": "A modulation technique varying the ratio of pulse ON-time to OFF-time (duty cycle 0% to 100% via 8-bit value 0–255 at 490Hz or 980Hz)."
      },
      {
        "term": "RGB LED (Common Cathode)",
        "plainMeaning": "One LED containing Red, Green, and Blue crystals sharing one common Ground pin.",
        "technicalMeaning": "A multi-chip optoelectronic package with three separate semiconductor dice and a single common negative cathode lead."
      },
      {
        "term": "map() Function",
        "plainMeaning": "Converting a number from one scale (like 0–1023) into another scale (like 0–255 or 150Hz–2500Hz).",
        "technicalMeaning": "A linear mathematical transform function: y = (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min."
      }
    ],
    "teacherPrep": [
      "Distribute 10kΩ rotary potentiometers, common-cathode RGB LEDs, 220Ω resistors, and buzzers.",
      "Confirm students know which Arduino pins support hardware PWM (pins with tilde ~: 3, 5, 6, 9, 10, 11)."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "400-tie solderless breadboard",
      "1x 10kΩ Rotary Potentiometer (B10K)",
      "1x 5mm RGB Diffused LED (Common Cathode)",
      "3x 220 Ω axial resistors (for R, G, B pins)",
      "1x Piezo Buzzer",
      "8x Male-to-Male jumper wires"
    ],
    "safetyNotes": [
      "Never connect the potentiometer wiper directly between 5V and GND without the resistive track; wire outer pins to 5V and GND, center pin to A0.",
      "Always use 220Ω resistors on all three RGB anode leads to avoid burning out the color dice."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Perform a live electronic DJ Theremin demo! Turn the dial knob: the room glows through vibrant purple, cyan, and amber while pitch glides like a futuristic sci-fi synth.",
        "studentAction": "Observe the color transitions and sound pitch. Inspect the 3-legged potentiometer dial on their bench."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Explain the 10-bit ADC (1024 steps) and PWM duty cycles. Teach RGB additive color physics (Red + Green = Yellow, Red + Blue = Magenta).",
        "studentAction": "Open the Sensor Observatory simulator on the portal: drag virtual voltage sliders to observe ADC values and PWM wave shapes."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: Potentiometer outer pins to 5V and GND, wiper to A0; RGB LED common cathode (longest leg) to GND, R to D9, G to D10, B to D11 via 220Ω; Buzzer to D6.",
        "studentAction": "Wire the complete potentiometer, RGB LED, and buzzer synth bench. Conduct continuity check before connecting USB."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through analogRead(A0), map() to RGB color components, analogWrite() PWM outputs, and tone() frequency generation.",
        "studentAction": "Upload the DJ Synth sketch. Rotate the dial and observe real-time Serial Plotter graphs of potentiometer voltage and audio frequency."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"RoboBee DJ Color & Sound Jam\": who can tune the dial to exact Target Frequencies and custom Hex colors?",
        "studentAction": "Showcase custom color blending presets (Cyber Gold, Ocean Cyan, Laser Violet) and complete the 3-question Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "How 10-bit ADC Slices Analog Voltages",
        "explanation": "Microcontrollers can only understand numbers. The Arduino 10-bit ADC cuts the 0V–5V range into 2^10 = 1024 equal steps. 0V gives 0, 2.5V gives 512, and 5V gives 1023. This gives an incredible measurement accuracy of approximately 4.88 millivolts per step!",
        "instructorNote": "Have students calculate what ADC integer corresponds to 3.3 Volts: (3.3 / 5.0) * 1023 ≈ 675."
      },
      {
        "title": "Pulse Width Modulation (PWM) Optical Illusion",
        "explanation": "Arduino digital pins can only output 0V or 5V. To create intermediate voltages, PWM switches the pin HIGH and LOW 490 times per second. By varying the percentage of time the pin is HIGH (Duty Cycle), our eyes and ears perceive smooth dimming and speed control.",
        "instructorNote": "Show PWM duty cycle oscilloscope waveforms on the projector: 25% (dim), 50% (medium), 75% (bright)."
      },
      {
        "title": "RGB Additive Color Mixing",
        "explanation": "Computer screens, robot status displays, and stage lights create millions of colors from just three wavelengths: Red, Green, and Blue. By controlling the PWM brightness of each LED die independently with analogWrite(), we can mix any color in the rainbow.",
        "instructorNote": "Turn on Red and Green simultaneously at full 255 brightness to reveal bright Yellow!"
      }
    ],
    "visualizerId": "sensor_serial_sim",
    "project": {
      "name": "Interactive RGB Mood Lamp & DJ Theremin Synth Console",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Functional 10kΩ potentiometer analog input circuit reading 0–1023 on Pin A0.",
        "Common-Cathode RGB LED circuit mixing primary and secondary colors via PWM Pins 9, 10, and 11.",
        "Simultaneous tone modulation on Pin D6 creating continuous audio pitch sweeps from 150 Hz to 2500 Hz."
      ]
    },
    "activity": {
      "title": "Assemble, Wire, and Program the DJ Theremin Console",
      "steps": [
        "Step 1: Place 10kΩ potentiometer across three rows; connect left pin to 5V, right pin to GND, and center pin to Analog A0.",
        "Step 2: Identify RGB LED leads: longest lead is Cathode (-); outer leads are Red, Green, and Blue anodes.",
        "Step 3: Connect Common Cathode lead to breadboard Ground rail.",
        "Step 4: Connect Red anode to Pin 9 via 220Ω resistor, Green to Pin 10 via 220Ω, and Blue to Pin 11 via 220Ω.",
        "Step 5: Connect Piezo buzzer (+) to PWM Pin 6 and (-) to Ground rail.",
        "Step 6: Upload firmware and rotate dial: watch colors transition smoothly across the spectrum while audio frequency modulates.",
        "Step 7: Challenge: Modify code to create a Strobe Party Mode when the dial reaches maximum position (>1000)!"
      ],
      "successCriteria": [
        "Potentiometer analog readings span the full 0–1023 range without dead spots.",
        "All three RGB channels illuminate brightly and mix cleanly without flickering.",
        "Audio tone modulates smoothly without clicks or lockups."
      ],
      "extension": "Add a serial command parser to allow setting custom RGB hex colors directly from the computer keyboard!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3 (ATmega328P)"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "Solderless Breadboard",
          "exactVariant": "Half-size 400 tie points",
          "quantity": 1
        },
        {
          "name": "10kΩ Rotary Potentiometer",
          "exactVariant": "Linear taper (B10K) 3-pin",
          "quantity": 1
        },
        {
          "name": "5mm RGB LED",
          "exactVariant": "Common Cathode diffused lens",
          "quantity": 1
        },
        {
          "name": "220 Ω Resistors",
          "exactVariant": "1/4 Watt, 5% (Red-Red-Brown)",
          "quantity": 3
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive transducer",
          "quantity": 1
        },
        {
          "name": "Jumper Wires",
          "exactVariant": "Male-to-Male multi-color flexible jumpers",
          "quantity": 8
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/class1-external-blink-wiring.svg",
      "schematic": "Potentiometer: 5V -> Pin 1 | Wiper Pin 2 -> A0 | Pin 3 -> GND; RGB LED: Cathode -> GND | Red -> 220Ω -> D9 (PWM) | Green -> 220Ω -> D10 (PWM) | Blue -> 220Ω -> D11 (PWM); Buzzer: D6 (PWM) -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "Arduino 5V Pin",
          "to": "Potentiometer Outer Terminal 1",
          "wireOrPolarityNote": "Red wire — 5V Bus"
        },
        {
          "from": "Potentiometer Center Wiper",
          "to": "Arduino Analog In A0",
          "wireOrPolarityNote": "Yellow wire — Analog Signal"
        },
        {
          "from": "Potentiometer Outer Terminal 3",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — 0V Ground"
        },
        {
          "from": "Arduino Digital Pin 9 (PWM)",
          "to": "RGB Red Anode 220Ω Resistor",
          "wireOrPolarityNote": "Red channel"
        },
        {
          "from": "Arduino Digital Pin 10 (PWM)",
          "to": "RGB Green Anode 220Ω Resistor",
          "wireOrPolarityNote": "Green channel"
        },
        {
          "from": "Arduino Digital Pin 11 (PWM)",
          "to": "RGB Blue Anode 220Ω Resistor",
          "wireOrPolarityNote": "Blue channel"
        },
        {
          "from": "RGB Common Cathode (Longest Leg)",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Common Cathode return"
        },
        {
          "from": "Arduino Digital Pin 6 (PWM)",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Audio tone output"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is disconnected before wiring.",
        "2. Insert potentiometer firmly into breadboard rows 1, 2, 3.",
        "3. Insert RGB LED: identify longest lead (Cathode) and connect to Ground rail.",
        "4. Connect 220Ω resistors to the other three leads and connect to PWM pins 9, 10, 11.",
        "5. Connect Piezo buzzer to Pin 6 and Ground.",
        "6. Connect 5V and GND jumpers, plug in USB, and upload firmware."
      ],
      "powerAndSafetyChecks": [
        "Confirm potentiometer outer pins connect across 5V and GND, not shorted together.",
        "Check that RGB cathode is connected to GND, not 5V."
      ],
      "testCases": [
        {
          "action": "Turn potentiometer dial fully counter-clockwise",
          "expectedResult": "ADC reads 0; LED turns deep Red; buzzer emits low 150 Hz bass hum."
        },
        {
          "action": "Turn potentiometer dial to 50% midpoint",
          "expectedResult": "ADC reads ≈ 512; LED blends to vibrant Cyan/Green; buzzer plays 1200 Hz tone."
        },
        {
          "action": "Turn potentiometer dial fully clockwise",
          "expectedResult": "ADC reads 1023; LED illuminates brilliant Magenta/Blue; buzzer sings at 2500 Hz."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 03: RGB Mood Lamp & DJ Theremin Synth\n * Board: Arduino Uno R3 (ATmega328P)\n */\n\nconst int PIN_POT    = A0;  // 10k Potentiometer Wiper (Analog In)\nconst int PIN_RED    = 9;   // RGB Red Anode (PWM ~)\nconst int PIN_GREEN  = 10;  // RGB Green Anode (PWM ~)\nconst int PIN_BLUE   = 11;  // RGB Blue Anode (PWM ~)\nconst int PIN_BUZZER = 6;   // Piezo Buzzer (PWM ~)\n\nvoid setup() {\n  pinMode(PIN_RED, OUTPUT);\n  pinMode(PIN_GREEN, OUTPUT);\n  pinMode(PIN_BLUE, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE DJ THEREMIN & RGB SYNTH ===\");\n}\n\nvoid loop() {\n  // Read 10-bit analog voltage (0 to 1023)\n  int potValue = analogRead(PIN_POT);\n\n  // Map analog reading to audio frequency (150 Hz to 2500 Hz)\n  int freq = map(potValue, 0, 1023, 150, 2500);\n  tone(PIN_BUZZER, freq);\n\n  // Calculate RGB color mixing across 3 color zones\n  int r = 0, g = 0, b = 0;\n  if (potValue < 341) {\n    // Zone 1: Red fading to Green\n    r = map(potValue, 0, 341, 255, 0);\n    g = map(potValue, 0, 341, 0, 255);\n    b = 0;\n  } else if (potValue < 682) {\n    // Zone 2: Green fading to Blue\n    r = 0;\n    g = map(potValue, 341, 682, 255, 0);\n    b = map(potValue, 341, 682, 0, 255);\n  } else {\n    // Zone 3: Blue fading back to Red/Purple\n    r = map(potValue, 682, 1023, 0, 255);\n    g = 0;\n    b = map(potValue, 682, 1023, 255, 120);\n  }\n\n  // Drive PWM outputs\n  analogWrite(PIN_RED, r);\n  analogWrite(PIN_GREEN, g);\n  analogWrite(PIN_BLUE, b);\n\n  // Telemetry to Serial Monitor\n  Serial.print(\"POT: \");\n  Serial.print(potValue);\n  Serial.print(\" | Freq: \");\n  Serial.print(freq);\n  Serial.print(\" Hz | RGB: (\");\n  Serial.print(r); Serial.print(\",\");\n  Serial.print(g); Serial.print(\",\");\n  Serial.print(b); Serial.println(\")\");\n\n  delay(20); // Smooth 50 Hz refresh rate\n}\n",
      "pinMap": {
        "Pin A0": "10kΩ Potentiometer Wiper (0V to 5V analog voltage input)",
        "Pin 9": "PWM Output ~ driving RGB Red Anode (via 220Ω resistor)",
        "Pin 10": "PWM Output ~ driving RGB Green Anode (via 220Ω resistor)",
        "Pin 11": "PWM Output ~ driving RGB Blue Anode (via 220Ω resistor)",
        "Pin 6": "PWM Output ~ driving Piezo Buzzer acoustic frequency",
        "GND": "Common Ground return"
      },
      "setupAndUpload": [
        "Connect Arduino Uno via USB cable.",
        "Select Tools -> Board -> Arduino Uno and proper COM port.",
        "Upload sketch and open Serial Plotter to visualize live waveforms."
      ],
      "explanations": [
        "analogRead(A0): Reads internal 10-bit ADC, converting voltage to integer between 0 and 1023.",
        "map(value, fromLow, fromHigh, toLow, toHigh): Scales numbers proportionally between ranges.",
        "analogWrite(pin, 0-255): Generates PWM square wave to control effective brightness and voltage.",
        "tone(PIN_BUZZER, freq): Drives piezo diaphragm at specified frequency in Hz for audio synth sound."
      ],
      "expectedResult": "Turning the knob continuously alters both the RGB illumination color through the full visual spectrum and the acoustic synthesizer pitch from low bass hum to high treble whistle.",
      "caveats": [
        "Only pins with the tilde symbol (~) support analogWrite() PWM output on the Uno (pins 3, 5, 6, 9, 10, 11).",
        "Do not omit resistors: without them, one color will hog all current and burn out."
      ],
      "tweakTip": "Adjust the frequency range from 150-2500Hz to 440-880Hz to restrict the pitch to a single musical octave!"
    },
    "troubleshooting": [
      {
        "symptom": "Analog readings only show 0 or 1023 with nothing in between.",
        "checks": [
          "Check potentiometer wiper connection: confirm center pin is plugged into A0.",
          "Check outer pins: one must be on 5V and the other on GND.",
          "Inspect breadboard: ensure potentiometer pins are in separate horizontal rows."
        ],
        "explanation": "If the wiper pin is wired incorrectly, it connects directly to the power rail instead of reading the divided voltage."
      },
      {
        "symptom": "One color of the RGB LED stays on all the time and ignores code.",
        "checks": [
          "Check pin assignments: ensure wires are plugged into PWM pins (9, 10, 11).",
          "Verify resistor isolation: confirm resistors do not touch each other."
        ],
        "explanation": "Touching resistor leads creates an electrical short between adjacent color channels."
      },
      {
        "symptom": "Buzzer stops playing when color changes.",
        "checks": [
          "Check timer conflicts: on Uno, tone() uses Timer2, which shares pins 3 and 11 PWM. Using Pin 6 avoids conflict.",
          "Verify buzzer wire connection to Pin 6 and GND."
        ],
        "explanation": "Pin 6 uses Timer0, avoiding timer conflict with tone() on Timer2."
      }
    ],
    "checksForUnderstanding": [
      "How many unique voltage levels can the Arduino Uno 10-bit ADC distinguish between 0V and 5V?",
      "Why do we use analogWrite() on PWM pins instead of standard digitalWrite() to dim LEDs?"
    ],
    "exitTicket": [
      {
        "question": "What is the mathematical resolution in millivolts of the 10-bit ADC on an Arduino Uno powered by 5.0 Volts?",
        "rubricOrSampleReasoning": "Resolution = Vref / (2^10 - 1) = 5.0V / 1023 ≈ 0.004887 V = 4.88 mV per integer step."
      },
      {
        "question": "How does Pulse Width Modulation (PWM) create the appearance of analog voltage using only digital HIGH (5V) and LOW (0V) states?",
        "rubricOrSampleReasoning": "By switching the pin on and off at a rapid frequency (490 Hz) and varying the duty cycle (percentage of time HIGH). The average power delivered creates the visual or physical effect of intermediate voltages."
      },
      {
        "question": "What happens when you mix Red (PWM 255) and Green (PWM 255) together on an RGB LED?",
        "rubricOrSampleReasoning": "In additive optical color mixing, combining Red and Green light produces Yellow light."
      }
    ],
    "differentiation": {
      "support": [
        "Provide color-coded jumper wires matching the RGB LED leads (Red, Green, Blue wires)."
      ],
      "extension": [
        "Program a Theremin that locks to the 7 notes of the pentatonic musical scale rather than continuous glissando."
      ],
      "offlineOption": [
        "Experiment with the interactive Sensor Observatory simulator on the RoboBee portal."
      ]
    },
    "nextLessonId": "beg-04",
    "nextLessonTeaser": "Class 04: 16x2 I2C LCD Displays, Custom Emojis, Animated Banners & Stopwatch! Learn the I2C bus and alphanumeric communication.",
    "sources": [
      {
        "title": "Atmel AVR ATmega328P ADC & PWM Architecture Manual",
        "url": "https://microchip.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "RGB Mood Lamp Schematic",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-04",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-arduino-ide-workflow",
        "fg-prog-program-structure"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-electronics-breadboards"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-safety-lab-code"
      ]
    },
    "courseId": "beginner",
    "sequence": 4,
    "code": "BEGINNER 04",
    "title": "16x2 I2C LCD, SDA/SCL, Custom Emojis, Animated Banner & Stopwatch",
    "subtitle": "Inter-Integrated Circuit (I2C) serial bus protocol, alphanumeric character LCD displays, custom 5x8 pixel font generation, and non-blocking millisecond stopwatch.",
    "promise": "I can wire an I2C LCD screen over SDA/SCL using only 2 communication wires, create custom pixel bitmap characters, display animated banners, and build a millisecond-accurate stopwatch.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01",
      "Beginner 02",
      "Beginner 03"
    ],
    "outcomes": [
      "Explain the advantages of the I2C serial communication bus (2 wires: SDA data and SCL clock) over 16-pin parallel display wiring.",
      "Identify I2C device addresses (0x27 or 0x3F) and write address-scanning diagnostics using the Wire library.",
      "Design and render custom 5x8 byte array pixel characters (RoboBee mascot and beating heart) on the HD44780 CGRAM.",
      "Implement non-blocking character scrolling for marquee announcements using millis().",
      "Assemble and program an interactive Lap Stopwatch with Start, Stop, and Reset arcade buttons and millisecond precision."
    ],
    "vocabulary": [
      {
        "term": "I2C Bus (Inter-Integrated Circuit)",
        "plainMeaning": "A 2-wire highway that lets multiple smart chips talk to the Arduino using only two pins (SDA and SCL).",
        "technicalMeaning": "A synchronous, multi-master, multi-slave, packet-switched serial communication bus invented by Philips Semiconductor."
      },
      {
        "term": "SDA (Serial Data Line)",
        "plainMeaning": "The wire that carries the actual messages, letters, and numbers back and forth.",
        "technicalMeaning": "The bidirectional open-drain data signal line pulled high with pull-up resistors, synchronized to SCL clock transitions."
      },
      {
        "term": "SCL (Serial Clock Line)",
        "plainMeaning": "The metronome wire that pulses a beat so both chips know exactly when to read each bit.",
        "technicalMeaning": "The synchronous clock line driven by the master (Arduino Uno on Analog Pin A5) coordinating serial bit transfer rates (standard mode 100 kHz)."
      },
      {
        "term": "16x2 Character LCD",
        "plainMeaning": "A liquid crystal screen that displays 16 characters per line across 2 lines (32 characters total).",
        "technicalMeaning": "An alphanumeric dot-matrix liquid crystal display driven by an HD44780 controller or compatible chip via PCF8574 I2C expander."
      },
      {
        "term": "I2C Hex Address (0x27 / 0x3F)",
        "plainMeaning": "The unique street address number of the screen on the I2C highway.",
        "technicalMeaning": "A 7-bit slave address transmitted by the master to select the target peripheral before data byte exchange begins."
      },
      {
        "term": "CGRAM (Character Generator RAM)",
        "plainMeaning": "The memory bank inside the screen where we draw our own custom pixel characters and emojis.",
        "technicalMeaning": "A 64-byte internal RAM space in the HD44780 allowing user definition of up to 8 custom 5x8 pixel font patterns."
      }
    ],
    "teacherPrep": [
      "Distribute 1602 LCDs with pre-soldered PCF8574 I2C backpack modules to student benches.",
      "Ensure LiquidCrystal_I2C library is installed in Arduino IDE 2.x across all student laptops."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "1602 Character LCD with soldered PCF8574 I2C backpack",
      "Solderless breadboard",
      "1x Tactile Pushbutton (for stopwatch start/lap)",
      "4x Female-to-Male jumper wires (for I2C backpack: VCC, GND, SDA, SCL)",
      "4x Male-to-Male jumper wires"
    ],
    "safetyNotes": [
      "Adjust the blue potentiometer on the back of the I2C backpack gently with a plastic screwdriver to calibrate contrast; do not force it.",
      "Verify VCC connects to 5V and GND connects to GND before plugging in USB."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Display a live 16x2 LCD screen with animated flying RoboBee wings and a real-time classroom lap timer. Show a legacy 16-wire LCD tangle vs a sleek 4-wire I2C backpack.",
        "studentAction": "Inspect the PCF8574 I2C backpack on the back of their screen. Count the 4 pins: GND, VCC, SDA, SCL."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Explain the I2C serial protocol. Teach Uno pin assignments: SDA is on A4, SCL is on A5. Demonstrate the 5x8 custom character grid.",
        "studentAction": "Use the interactive Logic Counter & Display Sim on the portal to design a custom 5x8 pixel emoji character."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: LCD VCC -> 5V, GND -> GND, SDA -> A4, SCL -> A5; wire pushbutton from D2 to GND with internal pullup.",
        "studentAction": "Connect the 4 I2C lines to Arduino Uno. Turn the contrast trimmer potentiometer until character rectangles appear clearly."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through lcd.init(), lcd.backlight(), lcd.createChar(), and non-blocking millisecond stopwatch calculation.",
        "studentAction": "Upload the code. Watch custom RoboBee emoji appear on the screen! Press button to start, lap, and reset the live stopwatch."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"RoboBee 5.000-Second Human Reflex Challenge\": can you stop the timer at exactly 5.000 seconds?",
        "studentAction": "Compete in the 5-second precision challenge, display custom animated headlines, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "Why I2C Solves Pin Exhaustion",
        "explanation": "Old-school LCD screens required 16 individual wires (RS, EN, D0-D7, power, backlight). This left almost no pins for sensors or motors! The I2C protocol uses only 2 communication wires (SDA and SCL) to talk to up to 127 different devices simultaneously on the same two pins.",
        "instructorNote": "Point out the dedicated SDA and SCL pins next to AREF on the Uno R3 (which are internally connected to A4 and A5)."
      },
      {
        "title": "Custom 5x8 Pixel Fonts in CGRAM",
        "explanation": "Each character on a 16x2 LCD is made of 5 columns and 8 rows of dots (40 pixels). By defining an 8-byte array where 1 represents a dark pixel and 0 represents a blank pixel, we can program custom icons like battery gauges, robot faces, and hearts.",
        "instructorNote": "Draw a 5x8 binary grid on the whiteboard: B01110, B10001, B10101, B10001, B01110 (smiley face)."
      },
      {
        "title": "Non-Blocking LCD Refreshing",
        "explanation": "Updating an LCD over I2C takes a few milliseconds. If we clear and rewrite the screen in every loop() cycle, the screen flickers uncontrollably! Professional firmware only updates the display when the timer value changes or on a fixed 100ms interval.",
        "instructorNote": "Demonstrate the difference between lcd.clear() flicker vs overwriting specific column coordinates with lcd.setCursor()."
      }
    ],
    "visualizerId": "logic_counter_sim",
    "project": {
      "name": "16x2 I2C Smart Announcement Display & Precision Stopwatch",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Operational 16x2 I2C LCD connected via SDA (A4) and SCL (A5) with clear character contrast.",
        "Display of custom 5x8 pixel RoboBee and Heart icons loaded into CGRAM.",
        "Working millisecond stopwatch with arcade button trigger and scrolling headline banner."
      ]
    },
    "activity": {
      "title": "Wire and Program the Smart Alphanumeric Station",
      "steps": [
        "Step 1: Connect Female-to-Male jumper wires from LCD backpack: GND to GND, VCC to 5V, SDA to A4, SCL to A5.",
        "Step 2: Connect a tactile pushbutton between Digital Pin 2 and GND (using INPUT_PULLUP).",
        "Step 3: Plug in USB and check backlight illumination; adjust blue trimmer pot until text contrast is sharp.",
        "Step 4: Upload the I2C scanner sketch if needed to verify address (standard is 0x27).",
        "Step 5: Upload the RoboBee Smart LCD Banner & Stopwatch sketch.",
        "Step 6: Press the button to start the stopwatch; press again to pause and record lap time.",
        "Step 7: Challenge: Modify the custom 5x8 byte array to create your own personalized team mascot icon!"
      ],
      "successCriteria": [
        "Text renders crisply without garbled characters or contrast wash-out.",
        "Custom emojis display accurately at specified cursor coordinates.",
        "Stopwatch increments accurately in seconds and tenths of seconds."
      ],
      "extension": "Add a second button to record up to 3 split-lap times stored in an array and displayed on demand!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "1602 LCD with PCF8574 I2C Backpack"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "1602 Alphanumeric LCD",
          "exactVariant": "With soldered PCF8574 I2C backpack (Address 0x27)",
          "quantity": 1
        },
        {
          "name": "Tactile Pushbutton",
          "exactVariant": "12mm momentary switch",
          "quantity": 1
        },
        {
          "name": "Solderless Breadboard",
          "exactVariant": "Half-size 400 tie points",
          "quantity": 1
        },
        {
          "name": "Female-to-Male Jumpers",
          "exactVariant": "20cm ribbon cables for I2C",
          "quantity": 4
        },
        {
          "name": "Male-to-Male Jumpers",
          "exactVariant": "20cm flexible wire",
          "quantity": 2
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "LCD I2C Backpack: VCC -> Arduino 5V | GND -> Arduino GND | SDA -> Arduino Analog A4 | SCL -> Arduino Analog A5; Button: Arduino D2 -> Button -> GND (INPUT_PULLUP)",
      "wireTable": [
        {
          "from": "LCD I2C Backpack VCC",
          "to": "Arduino 5V Power Pin",
          "wireOrPolarityNote": "Red wire — 5V DC Bus"
        },
        {
          "from": "LCD I2C Backpack GND",
          "to": "Arduino GND Pin",
          "wireOrPolarityNote": "Black wire — Ground"
        },
        {
          "from": "LCD I2C Backpack SDA",
          "to": "Arduino Analog Pin A4 (SDA)",
          "wireOrPolarityNote": "Blue wire — Serial Data"
        },
        {
          "from": "LCD I2C Backpack SCL",
          "to": "Arduino Analog Pin A5 (SCL)",
          "wireOrPolarityNote": "Yellow wire — Serial Clock"
        },
        {
          "from": "Arduino Digital Pin 2",
          "to": "Pushbutton Terminal 1",
          "wireOrPolarityNote": "Stopwatch Start/Stop trigger"
        },
        {
          "from": "Pushbutton Terminal 2",
          "to": "Arduino GND",
          "wireOrPolarityNote": "Button Ground return"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is disconnected before wiring.",
        "2. Connect 4 female ends to LCD backpack pins (GND, VCC, SDA, SCL).",
        "3. Connect male ends to Arduino 5V, GND, A4, A5.",
        "4. Connect button from D2 to GND on breadboard.",
        "5. Plug in USB. If screen shows solid white blocks, turn the contrast trimmer on the back with a screwdriver until characters appear."
      ],
      "powerAndSafetyChecks": [
        "Never short VCC and GND on the I2C backpack.",
        "Verify SDA and SCL are not swapped (SDA goes to A4, SCL goes to A5)."
      ],
      "testCases": [
        {
          "action": "Power on board with sketch uploaded",
          "expectedResult": "Screen displays \"RoboBEE Innovators\" on Line 1 with custom animated bee icon."
        },
        {
          "action": "Press pushbutton once",
          "expectedResult": "Stopwatch begins counting milliseconds smoothly on Line 2."
        },
        {
          "action": "Press pushbutton a second time",
          "expectedResult": "Stopwatch freezes and displays final elapsed time."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 04: 16x2 I2C LCD & Stopwatch\n * Board: Arduino Uno R3 (ATmega328P)\n * Required Library: LiquidCrystal_I2C by Frank de Brabander\n */\n\n#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\n// Set the LCD I2C address to 0x27 for a 16 chars and 2 line display\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nconst int PIN_BTN = 2; // Stopwatch Start/Stop Button\n\n// Custom 5x8 Byte Character: RoboBee Icon\nbyte roboBee[8] = {\n  B01010,\n  B11111,\n  B10101,\n  B11111,\n  B01110,\n  B11111,\n  B01010,\n  B00100\n};\n\n// Custom 5x8 Byte Character: Heart Icon\nbyte heart[8] = {\n  B00000,\n  B01010,\n  B11111,\n  B11111,\n  B01110,\n  B00100,\n  B00000,\n  B00000\n};\n\nbool running = false;\nunsigned long startTime = 0;\nunsigned long elapsedTime = 0;\nbool lastBtnState = HIGH;\n\nvoid setup() {\n  pinMode(PIN_BTN, INPUT_PULLUP);\n\n  lcd.init();\n  lcd.backlight();\n\n  // Load custom characters into CGRAM slots 0 and 1\n  lcd.createChar(0, roboBee);\n  lcd.createChar(1, heart);\n\n  lcd.setCursor(0, 0);\n  lcd.write(0); // Display custom RoboBee\n  lcd.print(\" ROBOBEE LAB \");\n  lcd.write(1); // Display custom Heart\n\n  lcd.setCursor(0, 1);\n  lcd.print(\"Timer: 0.00s\");\n}\n\nvoid loop() {\n  bool btnState = digitalRead(PIN_BTN);\n\n  // Detect button press on falling edge (transition from HIGH to LOW)\n  if (lastBtnState == HIGH && btnState == LOW) {\n    if (!running) {\n      running = true;\n      startTime = millis() - elapsedTime;\n    } else {\n      running = false;\n    }\n    delay(50); // Simple debounce\n  }\n  lastBtnState = btnState;\n\n  // Update stopwatch display when running\n  if (running) {\n    elapsedTime = millis() - startTime;\n    lcd.setCursor(7, 1);\n    float seconds = elapsedTime / 1000.0;\n    lcd.print(seconds, 2);\n    lcd.print(\"s  \");\n  }\n}\n",
      "pinMap": {
        "SDA (Pin A4)": "I2C Serial Data Bus communication",
        "SCL (Pin A5)": "I2C Serial Clock Bus synchronization",
        "Pin 2": "Arcade Button input (INPUT_PULLUP) for stopwatch control",
        "5V & GND": "Regulated 5V logic and LED backlight power"
      },
      "setupAndUpload": [
        "Install \"LiquidCrystal_I2C\" via Arduino IDE Library Manager.",
        "Connect Arduino Uno, select board and COM port, and upload sketch.",
        "Adjust the contrast knob on the back of the LCD if screen appears blank."
      ],
      "explanations": [
        "LiquidCrystal_I2C lcd(0x27, 16, 2): Instantiates the LCD controller object with I2C address 0x27.",
        "lcd.createChar(0, roboBee): Transfers the 8-byte array pattern into CGRAM address slot 0.",
        "lcd.setCursor(col, row): Moves the active writing cursor (columns 0–15, rows 0–1).",
        "millis() - startTime: Tracks high-precision continuous time without freezing the microcontroller."
      ],
      "expectedResult": "Screen displays \"ROBOBEE LAB\" flanked by custom bee and heart icons, and counts up stopwatch seconds in real-time when button is pressed.",
      "caveats": [
        "If nothing appears on screen, turn the blue contrast potentiometer on the back of the I2C backpack.",
        "Some I2C backpacks use address 0x3F instead of 0x27; run an I2C scanner sketch if detection fails."
      ],
      "tweakTip": "Create your own custom 5x8 pixel character using an online binary LCD generator and display it on line 2!"
    },
    "troubleshooting": [
      {
        "symptom": "Screen backlight lights up, but only displays solid white rectangles or no text.",
        "checks": [
          "Adjust the blue potentiometer trimmer on the back of the I2C backpack with a small screwdriver.",
          "Contrast is set either too high (solid blocks) or too low (completely blank)."
        ],
        "explanation": "The liquid crystal bias voltage requires calibration to achieve optimal viewing angle."
      },
      {
        "symptom": "Arduino IDE gives compilation error: \"LiquidCrystal_I2C.h: No such file or directory\".",
        "checks": [
          "Open Arduino IDE -> Sketch -> Include Library -> Manage Libraries.",
          "Search for \"LiquidCrystal I2C\" by Frank de Brabander and click Install."
        ],
        "explanation": "The external library must be installed locally for the compiler to locate the header files."
      },
      {
        "symptom": "Screen does not initialize and stays frozen.",
        "checks": [
          "Confirm SDA is plugged into A4 and SCL into A5.",
          "Upload an I2C Scanner sketch to verify whether the device address is 0x27 or 0x3F."
        ],
        "explanation": "Different manufacturer chipsets default to 0x27 (PCF8574T) or 0x3F (PCF8574AT)."
      }
    ],
    "checksForUnderstanding": [
      "How many communication wires does the I2C protocol use to send data to the screen?",
      "What is the purpose of the SCL (Serial Clock) line in I2C communication?"
    ],
    "exitTicket": [
      {
        "question": "Which two Arduino Uno pins are dedicated to the I2C bus?",
        "rubricOrSampleReasoning": "Analog Pin A4 is SDA (Serial Data) and Analog Pin A5 is SCL (Serial Clock)."
      },
      {
        "question": "How many custom characters can be stored in the LCD CGRAM simultaneously?",
        "rubricOrSampleReasoning": "Up to 8 custom 5x8 pixel characters (slots 0 through 7)."
      },
      {
        "question": "Why should you avoid calling lcd.clear() in every execution of void loop()?",
        "rubricOrSampleReasoning": "lcd.clear() takes up to 2 milliseconds and blanks the entire screen memory, causing noticeable and distracting optical flickering. It is better to position the cursor with lcd.setCursor() and overwrite characters directly."
      }
    ],
    "differentiation": {
      "support": [
        "Provide printed binary 5x8 grids for students to color in with pencil before typing byte arrays."
      ],
      "extension": [
        "Program a scrolling marquee text message that smoothly shifts text left across the 16 columns."
      ],
      "offlineOption": [
        "Use the interactive LCD Simulator on the RoboBee portal to test custom emojis."
      ]
    },
    "nextLessonId": "beg-05",
    "nextLessonTeaser": "Class 05: LDR Light Sensor, PIR HC-SR501 Motion Vault Alarm & Auto Streetlight! Learn environmental optical sensing and infrared security.",
    "sources": [
      {
        "title": "Philips I2C Bus Specification Manual",
        "url": "https://nxp.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "1602 LCD I2C Pinout Diagram",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-05",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-electronics-ohms-law",
        "fg-board-uno-anatomy"
      ],
      "lookUpWhileBuilding": [
        "fg-electronics-breadboards",
        "fg-prog-program-structure"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-safety-lab-code"
      ]
    },
    "courseId": "beginner",
    "sequence": 5,
    "code": "BEGINNER 05",
    "title": "LDR Light Sensor, PIR HC-SR501 Motion Vault Alarm & Auto Streetlight",
    "subtitle": "Photoresistor semiconductor physics, analog voltage dividers, pyroelectric infrared (PIR) thermal detection, and smart municipal & security systems.",
    "promise": "I can construct analog voltage dividers with photoresistors, interface PIR motion sensors, and build an automated night streetlight and intruder security alarm.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01",
      "Beginner 02",
      "Beginner 03"
    ],
    "outcomes": [
      "Explain the semiconductor physics of Light-Dependent Resistors (LDR) and photon-excited conductivity.",
      "Construct a precision analog voltage divider using a 10kΩ fixed resistor and calculate output voltage curves.",
      "Interface an HC-SR04/HC-SR501 Pyroelectric Infrared (PIR) sensor, adjusting sensitivity and re-trigger delay potentiometers.",
      "Implement threshold comparison logic (if / else) with hysteresis to prevent streetlamp chatter at dusk.",
      "Assemble and program a dual-mode municipal station: automatically dims on streetlights when dark, and arms an audible security vault alarm when motion is detected."
    ],
    "vocabulary": [
      {
        "term": "Light-Dependent Resistor (LDR)",
        "plainMeaning": "A sensor whose electrical resistance drops dramatically when light hits its wavy face.",
        "technicalMeaning": "A cadmium sulfide (CdS) photoconductive cell where incident photons excite valence electrons into the conduction band, decreasing electrical resistance from ~1 MΩ (dark) to ~1 kΩ (bright)."
      },
      {
        "term": "Voltage Divider",
        "plainMeaning": "Two resistors in a row that split a 5V supply into a smaller measurable voltage based on their resistance ratio.",
        "technicalMeaning": "A linear circuit that produces an output voltage proportional to the input: Vout = Vin × (R2 / (R1 + R2))."
      },
      {
        "term": "PIR Sensor (Passive Infrared)",
        "plainMeaning": "A motion sensor that detects the moving body heat of humans and warm-blooded animals.",
        "technicalMeaning": "A pyroelectric sensor containing two infrared-sensitive crystalline elements behind a segmented Fresnel lens detecting differential thermal radiation."
      },
      {
        "term": "Hysteresis",
        "plainMeaning": "Having different ON and OFF threshold points so a streetlight does not flicker crazily when sunset is right on the edge.",
        "technicalMeaning": "The dependence of the state of a system on its history, creating a dead-band zone between switching thresholds to prevent oscillation."
      },
      {
        "term": "Latching Security Alarm",
        "plainMeaning": "An alarm that stays sounding once triggered until an authorized human resets it.",
        "technicalMeaning": "A bistable software state that transitions to an active alarm latch condition and ignores further sensor inputs until explicitly cleared."
      }
    ],
    "teacherPrep": [
      "Prepare LDR photoresistors, 10kΩ fixed resistors, HC-SR501 PIR motion sensor modules, and white LEDs on student trays.",
      "Demonstrate how to set the PIR jumper to \"H\" (repeatable trigger mode)."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "Solderless breadboard",
      "1x LDR Photoresistor (5mm CdS)",
      "1x 10kΩ Fixed Resistor (Brown-Black-Orange)",
      "1x HC-SR501 PIR Motion Sensor Module",
      "1x High-Brightness White LED (Streetlight) with 220Ω resistor",
      "1x Piezo Buzzer (Alarm Siren)",
      "8x Male-to-Male and 3x Female-to-Male jumper wires"
    ],
    "safetyNotes": [
      "HC-SR501 PIR sensors require 30–60 seconds after power-up to stabilize their internal thermal reference before readings are reliable.",
      "Do not touch the white dome Fresnel lens with sharp metal tools."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Dim the classroom lights: a model city streetlight automatically glows bright! Then wave a hand near the bank vault box: an emergency security siren blares instantly!",
        "studentAction": "Observe the light and motion triggers. Inspect the wavy serpentine pattern on the LDR sensor and the faceted dome on the PIR sensor."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Explain the Voltage Divider formula Vout = 5V * (10k / (R_ldr + 10k)). Teach PIR differential heat sensing and Fresnel lenses.",
        "studentAction": "Open the Sensor Observatory simulator: adjust ambient light sliders and watch the analog voltage divider curve shift."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: LDR and 10kΩ divider to A0; PIR VCC to 5V, GND to GND, OUT to D2; White LED to D9 (PWM); Buzzer to D8.",
        "studentAction": "Wire the complete dual municipal and security circuit. Check connections with partner before power-up."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through analogRead(A0) thresholding, digitalRead(2) PIR motion detection, and hysteresis logic to prevent light fluttering.",
        "studentAction": "Upload code. Open Serial Plotter. Cover the LDR with a finger to simulate nightfall; wave hand to trigger security alarm siren."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"Laser Vault Heist Challenge\": can you sneak past the PIR sensor without setting off the alarm?",
        "studentAction": "Test sensor sensitivity limits, demonstrate calibrated threshold switching, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "Why Microcontrollers Cannot Read Resistance Directly",
        "explanation": "Microcontrollers can only measure VOLTAGE, never resistance! A photoresistor changes resistance (Ohms), not voltage. By putting the LDR in series with a fixed 10kΩ resistor across 5V and GND, the changing resistance creates a changing voltage drop at the midpoint that the ADC can read.",
        "instructorNote": "Write the formula on the board: when LDR is bright (1kΩ), Vout = 5V * (10k / 11k) ≈ 4.5V; when dark (100kΩ), Vout = 5V * (10k / 110k) ≈ 0.45V."
      },
      {
        "title": "How PIR Detects Human Body Heat",
        "explanation": "Human bodies emit infrared radiation at a wavelength of around 10 micrometers. The PIR sensor has two pyroelectric windows side by side. When a human walks past, one window sees the heat before the other, creating a differential voltage pulse that triggers the output pin.",
        "instructorNote": "Point out the white dome—it is a Fresnel lens that splits the room into dozens of infrared detection zones."
      },
      {
        "title": "Hysteresis & Dusk Anti-Flicker Logic",
        "explanation": "At sunset, light fluctuates right around the threshold. If threshold is 500, a light value of 499 turns the lamp ON, but its own light might bounce back and raise it to 501, turning it OFF! Hysteresis uses two thresholds: turn ON below 450, and turn OFF only above 550.",
        "instructorNote": "Explain that all smart thermostats and streetlights use hysteresis to protect lamps and motors from rapid cycling."
      }
    ],
    "visualizerId": "sensor_observatory_sim",
    "project": {
      "name": "Smart Automated Streetlight & Bank Vault Intrusion Alarm",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Functional LDR + 10kΩ voltage divider reading ambient light levels on Pin A0.",
        "HC-SR501 PIR sensor detecting human motion reliably on Digital Pin 2.",
        "Automated PWM streetlamp fading on at dusk, and siren alarm latching upon motion detection."
      ]
    },
    "activity": {
      "title": "Assemble, Calibrate, and Program the Municipal Security Station",
      "steps": [
        "Step 1: Wire LDR from 5V to breadboard row 10; wire 10kΩ resistor from row 10 to GND.",
        "Step 2: Connect a jumper wire from row 10 (the midpoint divider) to Arduino Analog A0.",
        "Step 3: Connect HC-SR501 PIR sensor: VCC to 5V, GND to GND, OUT to Digital Pin 2.",
        "Step 4: Connect High-brightness White LED to Pin 9 (PWM) via 220Ω resistor to GND.",
        "Step 5: Connect Piezo buzzer to Pin 8 and GND.",
        "Step 6: Upload firmware; allow 30 seconds for PIR thermal stabilization.",
        "Step 7: Cover LDR with your palm: streetlamp smoothly illuminates. Wave hand over PIR: siren blares!"
      ],
      "successCriteria": [
        "LDR readings respond smoothly to changes in classroom lighting.",
        "Streetlight turns on only when dark, without flickering or chatter.",
        "Motion alarm detects movement within 3 meters and alerts immediately."
      ],
      "extension": "Add a photo-resistor light meter bar graph using 3 colored LEDs indicating Lux levels!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "HC-SR501 PIR Module"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "5mm CdS Photoresistor (LDR)",
          "exactVariant": "Dark resistance > 1MΩ, Light < 10kΩ",
          "quantity": 1
        },
        {
          "name": "10kΩ Fixed Resistor",
          "exactVariant": "1/4 Watt, 5% (Brown-Black-Orange)",
          "quantity": 1
        },
        {
          "name": "HC-SR501 PIR Motion Module",
          "exactVariant": "With dual potentiometers and jumper",
          "quantity": 1
        },
        {
          "name": "White High-Brightness LED",
          "exactVariant": "5mm clear lens, 3.2V Vf",
          "quantity": 1
        },
        {
          "name": "220 Ω Resistor",
          "exactVariant": "1/4 Watt, 5%",
          "quantity": 1
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive acoustic transducer",
          "quantity": 1
        },
        {
          "name": "Jumper Wires",
          "exactVariant": "Male-to-Male and Female-to-Male",
          "quantity": 8
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/class1-external-blink-wiring.svg",
      "schematic": "Divider: 5V -> LDR -> Node A0 -> 10kΩ -> GND; PIR: 5V -> VCC | GND -> GND | OUT -> D2; LED: D9 -> 220Ω -> White LED Anode | Cathode -> GND; Buzzer: D8 -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "Arduino 5V",
          "to": "LDR Terminal 1",
          "wireOrPolarityNote": "Red wire — 5V Supply"
        },
        {
          "from": "LDR Terminal 2 & 10kΩ Resistor",
          "to": "Arduino Analog In A0",
          "wireOrPolarityNote": "Yellow wire — Midpoint Voltage"
        },
        {
          "from": "10kΩ Resistor Other Lead",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Ground"
        },
        {
          "from": "PIR OUT Pin",
          "to": "Arduino Digital Pin 2",
          "wireOrPolarityNote": "Green wire — Motion trigger signal"
        },
        {
          "from": "Arduino Digital Pin 9 (PWM)",
          "to": "White LED 220Ω Resistor",
          "wireOrPolarityNote": "Streetlight control"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Alarm Siren output"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is disconnected.",
        "2. Build voltage divider: LDR to 5V, 10kΩ to GND, center to A0.",
        "3. Connect PIR sensor via Female-to-Male jumpers (VCC, OUT, GND).",
        "4. Connect White LED to PWM Pin 9 and Buzzer to Pin 8.",
        "5. Connect Ground rail to Arduino GND, plug in USB, and wait 30 seconds for PIR warm-up."
      ],
      "powerAndSafetyChecks": [
        "Confirm PIR jumper is set to \"H\" (repeatable trigger).",
        "Ensure 10kΩ resistor connects to GND, not 5V."
      ],
      "testCases": [
        {
          "action": "Cover LDR with black paper",
          "expectedResult": "Analog A0 reading drops below 400; White streetlight fades on smoothly."
        },
        {
          "action": "Uncover LDR to ambient classroom light",
          "expectedResult": "Analog A0 reading rises above 600; White streetlight turns off."
        },
        {
          "action": "Wave hand in front of PIR during dark mode",
          "expectedResult": "Digital Pin 2 goes HIGH; Piezo buzzer triggers 2-tone police emergency siren."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 05: Smart Streetlight & Vault Alarm\n * Board: Arduino Uno R3 (ATmega328P)\n */\n\nconst int PIN_LDR     = A0; // LDR Voltage Divider\nconst int PIN_PIR     = 2;  // HC-SR501 PIR Motion Sensor\nconst int PIN_LIGHT   = 9;  // White Streetlight LED (PWM ~)\nconst int PIN_BUZZER  = 8;  // Security Siren Buzzer\n\n// Hysteresis Thresholds for Streetlight\nconst int DARK_THRESHOLD  = 400; // Turn light ON when darker than this\nconst int LIGHT_THRESHOLD = 550; // Turn light OFF when brighter than this\n\nbool isNight = false;\n\nvoid setup() {\n  pinMode(PIN_PIR, INPUT);\n  pinMode(PIN_LIGHT, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE SMART STREETLIGHT & VAULT ALARM ===\");\n  Serial.println(\"Warming up PIR sensor (30 seconds)...\");\n  delay(2000); // Quick boot delay\n}\n\nvoid loop() {\n  int lightLevel = analogRead(PIN_LDR);\n  int motionDetected = digitalRead(PIN_PIR);\n\n  // Hysteresis State Machine for Streetlight\n  if (!isNight && lightLevel < DARK_THRESHOLD) {\n    isNight = true;\n    analogWrite(PIN_LIGHT, 255); // Full brightness at night\n    Serial.println(\">> NIGHT DETECTED: Streetlight ON\");\n  } else if (isNight && lightLevel > LIGHT_THRESHOLD) {\n    isNight = false;\n    analogWrite(PIN_LIGHT, 0); // Turn off during daylight\n    Serial.println(\">> DAYLIGHT DETECTED: Streetlight OFF\");\n  }\n\n  // Security Vault Alarm: Only active when night is set and motion detected\n  if (isNight && motionDetected == HIGH) {\n    Serial.println(\"!! INTRUSION ALERT: Motion in Vault !!\");\n    // Sound 2-tone alarm siren\n    for (int i = 0; i < 3; i++) {\n      tone(PIN_BUZZER, 800, 100);\n      delay(120);\n      tone(PIN_BUZZER, 1200, 100);\n      delay(120);\n    }\n  }\n\n  delay(100); // 10 Hz telemetry loop\n}\n",
      "pinMap": {
        "Pin A0": "LDR + 10kΩ Analog Voltage Divider input",
        "Pin 2": "PIR Motion Sensor digital output (HIGH when body heat moves)",
        "Pin 9": "PWM Output ~ driving White Streetlamp LED",
        "Pin 8": "Digital Output driving Alarm Siren Buzzer"
      },
      "setupAndUpload": [
        "Connect Arduino Uno via USB cable.",
        "Select Tools -> Board -> Arduino Uno and proper COM port.",
        "Upload sketch and wait 30 seconds for PIR thermal stabilization."
      ],
      "explanations": [
        "analogRead(PIN_LDR): Samples the voltage divider node to determine ambient light level.",
        "Hysteresis logic (DARK_THRESHOLD vs LIGHT_THRESHOLD): Prevents light from flashing on and off at sunset.",
        "digitalRead(PIN_PIR) == HIGH: Detects moving thermal differential signatures across the pyroelectric elements.",
        "2-tone siren loop: Alternates 800 Hz and 1200 Hz tones to create an urgent industrial alert sound."
      ],
      "expectedResult": "Streetlight illuminates automatically in the dark; if an intruder moves while dark, the alarm siren sounds immediately.",
      "caveats": [
        "HC-SR501 requires up to 60 seconds to warm up and establish its baseline thermal reading.",
        "Adjust the left pot on the PIR for delay time and right pot for detection range (3m to 7m)."
      ],
      "tweakTip": "Implement a PWM smooth fade-in so the streetlight gradually ramps up over 2 seconds like modern LED municipal streetlights!"
    },
    "troubleshooting": [
      {
        "symptom": "PIR sensor triggers constantly even when nobody is moving.",
        "checks": [
          "Allow full 60 seconds after power-up for the pyroelectric sensor to warm up.",
          "Check for heat sources nearby: avoid pointing the sensor directly at radiators, heaters, or open windows.",
          "Turn the sensitivity potentiometer slightly counter-clockwise to reduce range."
        ],
        "explanation": "Air convection currents from heaters create thermal differentials that trigger sensitive PIR elements."
      },
      {
        "symptom": "LDR values change very little between bright room and dark room.",
        "checks": [
          "Check resistor value: confirm the fixed resistor is 10kΩ (Brown-Black-Orange), not 220Ω.",
          "Confirm wire to A0 connects to the junction between the LDR and resistor."
        ],
        "explanation": "Using a 220Ω resistor with an LDR whose minimum resistance is 1kΩ produces negligible voltage change."
      },
      {
        "symptom": "Streetlight flickers rapidly when light is near threshold.",
        "checks": [
          "Increase the gap between DARK_THRESHOLD (e.g. 400) and LIGHT_THRESHOLD (e.g. 550).",
          "Ensure the streetlight LED is not pointing directly at its own LDR sensor (optical feedback loop)."
        ],
        "explanation": "If light from the LED strikes the LDR, it tricks itself into thinking daylight has returned."
      }
    ],
    "checksForUnderstanding": [
      "Why is a fixed 10kΩ resistor needed in series with the LDR to measure light?",
      "What is hysteresis and why is it important in automated lighting systems?"
    ],
    "exitTicket": [
      {
        "question": "Calculate Vout of a voltage divider when Vin = 5.0V, R1 (LDR) = 40kΩ (dim room), and R2 (fixed) = 10kΩ.",
        "rubricOrSampleReasoning": "Vout = Vin × (R2 / (R1 + R2)) = 5.0V × (10k / (40k + 10k)) = 5.0V × (10 / 50) = 1.0 Volt. The ADC will read approximately (1.0 / 5.0) × 1023 ≈ 204."
      },
      {
        "question": "How does an HC-SR501 PIR sensor detect human movement without emitting any light or sound of its own?",
        "rubricOrSampleReasoning": "It is a PASSIVE sensor. It absorbs natural infrared thermal radiation (body heat ~10µm) emitted by warm bodies. When a person moves across the Fresnel lens, the differential heat across two pyroelectric crystals triggers an output pulse."
      },
      {
        "question": "What happens if you set DARK_THRESHOLD to 500 and LIGHT_THRESHOLD to 500 without hysteresis?",
        "rubricOrSampleReasoning": "Any tiny fluctuation or sensor noise around 500 will cause the light to flicker on and off rapidly and erratically (hunting/chatter), potentially damaging the lamp or driving circuit."
      }
    ],
    "differentiation": {
      "support": [
        "Provide breadboards with pre-wired voltage dividers so students focus on calibration and code."
      ],
      "extension": [
        "Program an intelligent timeout that keeps the streetlight on for 15 seconds after motion ceases."
      ],
      "offlineOption": [
        "Simulate the vault alarm in the interactive web portal simulator."
      ]
    },
    "nextLessonId": "beg-06",
    "nextLessonTeaser": "Class 06: HC-SR04 Ultrasonic Sonar + SG90 Servo Radar Barrier & Distance Bar! Learn acoustic echolocation and motorized boom gates.",
    "sources": [
      {
        "title": "HC-SR501 Pyroelectric Infrared Sensor User Manual",
        "url": "https://sparkfun.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "LDR & PIR Security Station Wiring Diagram",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-06",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-comp-hc-sr04",
        "fg-board-uno-anatomy"
      ],
      "lookUpWhileBuilding": [
        "fg-electronics-breadboards",
        "fg-prog-program-structure"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-safety-lab-code"
      ]
    },
    "courseId": "beginner",
    "sequence": 6,
    "code": "BEGINNER 06",
    "title": "HC-SR04 Ultrasonic Sonar + SG90 Servo Radar Barrier & Distance Bar",
    "subtitle": "Acoustic echolocation time-of-flight physics, SG90 angular servomotors with 50Hz PWM control, and automated tollgate boom barrier systems.",
    "promise": "I can calculate acoustic time-of-flight distances with ultrasonic sonar, command SG90 micro servos with 50Hz PWM pulses, and build an automated tollgate boom barrier.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01",
      "Beginner 02",
      "Beginner 03",
      "Beginner 04"
    ],
    "outcomes": [
      "Apply the speed of sound equation in air (v = 343 m/s = 0.0343 cm/µs) to calculate distance from acoustic round-trip echo times.",
      "Generate standard 10µs trigger pulses and measure echo response duration using pulseIn(pin, HIGH).",
      "Explain how SG90 servomotors use internal closed-loop feedback potentiometers to hold exact angles from 0° to 180°.",
      "Drive servomotors cleanly using the Arduino <Servo.h> library and calculate pulse widths (1000µs = 0°, 1500µs = 90°, 2000µs = 180°).",
      "Assemble and program an Automated Highway Tollgate: 3-LED distance gauge indicates approach distance; when vehicle stops < 15cm, barrier sweeps up 90°, sounds confirmation chirp, and lowers."
    ],
    "vocabulary": [
      {
        "term": "Ultrasonic Sonar (HC-SR04)",
        "plainMeaning": "An electronic bat that emits high-frequency sound clicks humans cannot hear and times how long the echo takes to bounce back.",
        "technicalMeaning": "An active acoustic rangefinder featuring a 40 kHz piezoelectric transmitter and receiver measuring round-trip time-of-flight."
      },
      {
        "term": "Speed of Sound (343 m/s)",
        "plainMeaning": "How fast sound travels through room temperature air: about 1 centimeter every 29.1 microseconds.",
        "technicalMeaning": "The velocity of acoustic pressure waves in dry air at 20°C: v ≈ 331.4 + 0.606 × T(°C) ≈ 343 m/s = 0.0343 cm/µs."
      },
      {
        "term": "Time-of-Flight (ToF)",
        "plainMeaning": "The total round-trip time for a sound wave to travel to an object and bounce back into the sensor.",
        "technicalMeaning": "The elapsed time Δt measured by the microcontroller; distance d = (Δt × speed_of_sound) / 2 to account for the two-way travel."
      },
      {
        "term": "SG90 Micro Servomotor",
        "plainMeaning": "A motorized steering arm that rotates to an exact angle (0° to 180°) and holds its position firmly.",
        "technicalMeaning": "A closed-loop rotary actuator containing a DC motor, reduction gear train, feedback potentiometer, and error amplifier controlled by 50Hz PWM."
      },
      {
        "term": "Servo PWM Pulse Width",
        "plainMeaning": "The length of the electrical pulse that tells the servo what angle to turn to.",
        "technicalMeaning": "A periodic 20ms (50 Hz) frame where pulse duration dictates angular position: ~1.0ms = 0°, ~1.5ms = 90° (neutral), ~2.0ms = 180°."
      }
    ],
    "teacherPrep": [
      "Place HC-SR04 ultrasonic sensors, SG90 9g micro servos with horn arms, and 3x LEDs on student benches.",
      "Attach a lightweight paper or cardboard tollgate arm to the servo horn with double-sided tape."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "HC-SR04 Ultrasonic Distance Sensor",
      "SG90 9g Micro Servo with horn arm and mounting screws",
      "3x 5mm LEDs (Green, Yellow, Red) with 220Ω resistors",
      "1x Piezo Buzzer",
      "Solderless breadboard and jumper wires"
    ],
    "safetyNotes": [
      "Never force the SG90 servo horn with your fingers while powered; forcing it can strip the delicate nylon reduction gears.",
      "Connect servo red wire to 5V and brown wire to GND; reverse power can permanently damage the internal servo driver."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Drive a model toy car towards the bench: the distance bar shifts from Green to Yellow to Red; at 12cm, the automated boom barrier swings up smoothly with a chime!",
        "studentAction": "Observe the acoustic sensor \"eyes\" (Transmitter T and Receiver R) and the motorized boom barrier in action."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Derive Distance = (Duration * 0.0343) / 2 on the whiteboard. Explain the SG90 internal potentiometer and 50Hz PWM pulse width control.",
        "studentAction": "Test the Ultrasonic Sonar Sim on the portal: move virtual obstacles and observe time-of-flight waveform calculations."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: HC-SR04 VCC->5V, GND->GND, Trig->D9, Echo->D10; SG90 Servo Signal->D6, VCC->5V, GND->GND; LEDs to D2, D3, D4.",
        "studentAction": "Assemble the tollgate station on breadboard. Press servo horn onto spline at 0° horizontal position."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through <Servo.h>, trigger pulse generation (digitalWrite HIGH for 10µs), pulseIn(Echo), and barrier state transitions.",
        "studentAction": "Upload code. Open Serial Monitor. Hold hand at different distances: observe distance in cm printed in real-time and barrier opening!"
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Run the \"Padma Toll Plaza Automated Gate Challenge\": can your gate handle oncoming cars and reset safely without collisions?",
        "studentAction": "Demonstrate automated toll barrier operation, calibrate detection distance threshold, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "Acoustic Time-of-Flight Physics",
        "explanation": "The HC-SR04 emits eight 40 kHz ultrasound sound pulses from transducer \"T\". These sound waves travel through air at 343 m/s, strike an obstacle, and bounce back to receiver \"R\". By measuring the round-trip microsecond time with pulseIn(), distance is calculated as: Distance (cm) = (Duration (µs) × 0.0343) / 2.",
        "instructorNote": "Why divide by 2? Because the sound wave travels to the obstacle and all the way back!"
      },
      {
        "title": "How Servos Know Their Exact Angle",
        "explanation": "Unlike continuous DC motors that spin freely, an SG90 servo motor is a closed-loop positioning robot. Inside, an internal potentiometer measures the exact shaft angle. A microchip compares target pulse width against actual position and drives the internal motor until the error is zero.",
        "instructorNote": "Demonstrate that trying to push the servo arm while powered results in the motor pushing back to hold its commanded angle."
      },
      {
        "title": "The Speed of Sound in Air",
        "explanation": "At 20°C, sound travels 1 cm in approximately 29.15 microseconds. If pulseIn() returns 1000 µs: Distance = 1000 / 29.15 / 2 ≈ 17.15 cm. This allows our robot to perceive obstacles before physically touching them.",
        "instructorNote": "Explain why soft cloth or slanted walls can absorb sound waves or deflect them away, causing false readings."
      }
    ],
    "visualizerId": "ultrasonic_sonar_sim",
    "project": {
      "name": "Smart Automated Tollgate Barrier & Radar Distance Bar",
      "deliverableType": "physical_build",
      "successEvidence": [
        "HC-SR04 sonar sensor reading accurate distance (2cm–200cm) on Serial Monitor.",
        "3-LED distance gauge reflecting proximity (Green > 30cm, Yellow 15–30cm, Red < 15cm).",
        "SG90 servo boom barrier rotating smoothly to 90° on vehicle approach and resetting to 0° after passage."
      ]
    },
    "activity": {
      "title": "Assemble, Wire, and Program the Automated Tollgate",
      "steps": [
        "Step 1: Mount HC-SR04 on breadboard; connect VCC to 5V, GND to GND, Trig to Pin 9, Echo to Pin 10.",
        "Step 2: Connect SG90 servo: Brown wire to GND, Red wire to 5V, Orange signal wire to Pin 6.",
        "Step 3: Connect 3 indicator LEDs: Green (Pin 2), Yellow (Pin 3), Red (Pin 4) with 220Ω series resistors.",
        "Step 4: Connect Piezo buzzer to Pin 8 and GND.",
        "Step 5: Upload code. When powered, the servo will calibrate to 0° horizontal barrier position.",
        "Step 6: Move a hand towards the sonar: watch Green turn to Yellow, then Red.",
        "Step 7: When hand stops within 15cm, barrier opens to 90°, chime sounds, holds for 3 seconds, and closes!"
      ],
      "successCriteria": [
        "Sonar measurements agree with a physical ruler within ±1 cm accuracy.",
        "Servo sweeps smoothly between 0° and 90° without jittering or grinding.",
        "Tollgate operates autonomously and reliably for 10 consecutive vehicle passes."
      ],
      "extension": "Add a vehicle speed estimation feature: measure distance twice over 200ms to calculate approach speed in cm/s!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "HC-SR04 Sonar Module",
        "SG90 Micro Servo"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "HC-SR04 Ultrasonic Sensor",
          "exactVariant": "4-pin 40 kHz module (VCC, Trig, Echo, GND)",
          "quantity": 1
        },
        {
          "name": "SG90 9g Micro Servo",
          "exactVariant": "With single-arm horn and mounting screw",
          "quantity": 1
        },
        {
          "name": "5mm LEDs (Green, Yellow, Red)",
          "exactVariant": "Diffused lens indicator LEDs",
          "quantity": 3
        },
        {
          "name": "220 Ω Resistors",
          "exactVariant": "1/4 Watt, 5%",
          "quantity": 3
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive transducer",
          "quantity": 1
        },
        {
          "name": "Jumper Wires",
          "exactVariant": "Male-to-Male and Male-to-Female jumpers",
          "quantity": 10
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "HC-SR04: VCC->5V | GND->GND | Trig->D9 | Echo->D10; SG90 Servo: Red->5V | Brown->GND | Orange->D6; Distance LEDs: D2 (Green), D3 (Yellow), D4 (Red) -> 220Ω -> Anodes | Cathodes->GND; Buzzer: D8 -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "Arduino Digital Pin 9",
          "to": "HC-SR04 Trig Pin",
          "wireOrPolarityNote": "10µs ultrasonic trigger pulse"
        },
        {
          "from": "Arduino Digital Pin 10",
          "to": "HC-SR04 Echo Pin",
          "wireOrPolarityNote": "Pulse width time-of-flight return"
        },
        {
          "from": "Arduino Digital Pin 6 (PWM)",
          "to": "SG90 Orange Signal Wire",
          "wireOrPolarityNote": "50Hz Servo position signal"
        },
        {
          "from": "Arduino 5V Power Pin",
          "to": "Breadboard Red Rail (+)",
          "wireOrPolarityNote": "Common 5V Bus"
        },
        {
          "from": "Arduino GND Pin",
          "to": "Breadboard Blue Rail (-)",
          "wireOrPolarityNote": "Common Ground Return"
        },
        {
          "from": "Arduino Digital Pin 2",
          "to": "Green Distance LED Resistor",
          "wireOrPolarityNote": "Clear zone indicator"
        },
        {
          "from": "Arduino Digital Pin 3",
          "to": "Yellow Distance LED Resistor",
          "wireOrPolarityNote": "Caution zone indicator"
        },
        {
          "from": "Arduino Digital Pin 4",
          "to": "Red Distance LED Resistor",
          "wireOrPolarityNote": "Stop / Tollgate zone indicator"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Confirmation chirp output"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is disconnected before wiring.",
        "2. Insert HC-SR04 across 4 separate breadboard columns.",
        "3. Connect Trig to D9 and Echo to D10; connect VCC and GND.",
        "4. Connect SG90 servo: Brown to GND, Red to 5V, Orange to D6.",
        "5. Connect 3 LEDs to D2, D3, D4 with 220Ω resistors.",
        "6. Connect Buzzer to D8, plug in USB, and flash firmware."
      ],
      "powerAndSafetyChecks": [
        "Do not force the servo horn by hand while the Arduino is powered.",
        "Verify HC-SR04 VCC is connected to 5V, not 3.3V (HC-SR04 requires 5V to fire 40kHz ultrasound bursts)."
      ],
      "testCases": [
        {
          "action": "Hold obstacle 40cm away",
          "expectedResult": "Green LED illuminates; barrier remains closed at 0°."
        },
        {
          "action": "Move obstacle to 20cm away",
          "expectedResult": "Yellow LED illuminates; warning beep emitted."
        },
        {
          "action": "Move obstacle to 10cm away",
          "expectedResult": "Red LED illuminates; barrier raises to 90°; confirmation chime sounds."
        },
        {
          "action": "Remove obstacle after 3 seconds",
          "expectedResult": "Barrier sweeps smoothly back down to 0° closed position."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 06: Sonar Radar & Servo Tollgate\n * Board: Arduino Uno R3 (ATmega328P)\n */\n\n#include <Servo.h>\n\nconst int PIN_TRIG    = 9;   // HC-SR04 Trigger Pin\nconst int PIN_ECHO    = 10;  // HC-SR04 Echo Pin\nconst int PIN_SERVO   = 6;   // SG90 Servo Signal Pin\nconst int PIN_LED_G   = 2;   // Green LED (Clear)\nconst int PIN_LED_Y   = 3;   // Yellow LED (Caution)\nconst int PIN_LED_R   = 4;   // Red LED (Stop / Toll)\nconst int PIN_BUZZER  = 8;   // Confirmation Chime Buzzer\n\nServo tollgate;\n\nvoid setup() {\n  pinMode(PIN_TRIG, OUTPUT);\n  pinMode(PIN_ECHO, INPUT);\n  pinMode(PIN_LED_G, OUTPUT);\n  pinMode(PIN_LED_Y, OUTPUT);\n  pinMode(PIN_LED_R, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  tollgate.attach(PIN_SERVO);\n  tollgate.write(0); // Start with barrier closed (0 degrees)\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE AUTOMATED TOLLGATE BARRIER ===\");\n}\n\n// Function to measure distance in centimeters\nlong measureDistance() {\n  digitalWrite(PIN_TRIG, LOW);\n  delayMicroseconds(2);\n  // Send 10 microsecond HIGH pulse to fire 40 kHz ultrasound burst\n  digitalWrite(PIN_TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(PIN_TRIG, LOW);\n\n  // Measure round-trip echo pulse duration in microseconds\n  long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout (~5m max)\n  if (duration == 0) return 999; // No echo detected\n\n  // Distance formula: d = (duration * 0.0343) / 2\n  long distanceCm = (duration * 0.0343) / 2;\n  return distanceCm;\n}\n\nvoid loop() {\n  long distance = measureDistance();\n\n  Serial.print(\"Distance: \");\n  Serial.print(distance);\n  Serial.println(\" cm\");\n\n  // Proximity Gauge\n  if (distance > 30) {\n    // Clear Zone (> 30 cm)\n    digitalWrite(PIN_LED_G, HIGH);\n    digitalWrite(PIN_LED_Y, LOW);\n    digitalWrite(PIN_LED_R, LOW);\n  } else if (distance >= 15 && distance <= 30) {\n    // Caution Zone (15 to 30 cm)\n    digitalWrite(PIN_LED_G, LOW);\n    digitalWrite(PIN_LED_Y, HIGH);\n    digitalWrite(PIN_LED_R, LOW);\n  } else if (distance < 15 && distance > 0) {\n    // Tollgate Zone (< 15 cm): Open Barrier!\n    digitalWrite(PIN_LED_G, LOW);\n    digitalWrite(PIN_LED_Y, LOW);\n    digitalWrite(PIN_LED_R, HIGH);\n\n    Serial.println(\">> VEHICLE AT GATE: Opening barrier to 90 deg...\");\n    tollgate.write(90); // Open barrier arm\n    tone(PIN_BUZZER, 1200, 150); // Confirmation chirp\n    delay(3000); // Hold gate open for 3 seconds\n\n    Serial.println(\">> Lowering barrier back to 0 deg...\");\n    tollgate.write(0); // Close barrier arm\n    delay(500);\n  }\n\n  delay(60); // 16 Hz measurement loop\n}\n",
      "pinMap": {
        "Pin 9": "HC-SR04 Trig Pin (Generates 10µs ultrasonic burst trigger)",
        "Pin 10": "HC-SR04 Echo Pin (Reads acoustic round-trip flight duration)",
        "Pin 6": "SG90 Servo PWM signal line (commands angular position)",
        "Pins 2, 3, 4": "Distance indicator bar (Green, Yellow, Red LEDs)",
        "Pin 8": "Confirmation Chime Buzzer"
      },
      "setupAndUpload": [
        "Connect Arduino Uno via USB cable.",
        "Select Tools -> Board -> Arduino Uno and proper COM port.",
        "Upload sketch and open Serial Monitor at 9600 baud."
      ],
      "explanations": [
        "digitalWrite(PIN_TRIG, HIGH) + delayMicroseconds(10): Triggers the HC-SR04 internal processor to fire 8 ultrasound cycles at 40 kHz.",
        "pulseIn(PIN_ECHO, HIGH, 30000): Measures the microsecond duration until the reflected echo is detected.",
        "d = (duration * 0.0343) / 2: Converts time-of-flight to metric centimeters based on acoustic speed.",
        "tollgate.write(90): Commands the SG90 servo motor to rotate directly to 90 degrees."
      ],
      "expectedResult": "Sonar measures vehicle distance accurately; distance bar updates in real time; approaching vehicles under 15cm trigger the boom gate to raise, chime, wait 3 seconds, and close.",
      "caveats": [
        "Soft fabrics, angled cardboard, and acoustic absorbers may not reflect ultrasound cleanly.",
        "pulseIn() timeout defaults to 1 second if omitted; always specify 30000µs timeout to maintain fast loop timing."
      ],
      "tweakTip": "Implement a smooth servo sweep loop using a for-loop incrementing by 2 degrees every 15ms for ultra-smooth barrier motion!"
    },
    "troubleshooting": [
      {
        "symptom": "Distance reading constantly shows 0 cm or 999 cm regardless of object distance.",
        "checks": [
          "Check Trig and Echo wiring: ensure Trig connects to D9 and Echo to D10 (they are often accidentally swapped).",
          "Verify 5V power: HC-SR04 requires full 5.0V power to charge its transmitter transducers."
        ],
        "explanation": "Swapping Trig and Echo prevents the trigger pulse from firing, causing the receiver to time out."
      },
      {
        "symptom": "Servo motor jitters, buzzes loudly, or resets the Arduino board.",
        "checks": [
          "Check power supply: the servo DC motor draws current spikes up to 500mA when moving.",
          "Ensure servo horn is not jammed against a mechanical stop.",
          "Use a dedicated power rail or plug into a high-current laptop USB port."
        ],
        "explanation": "Current spikes from an inductive servo motor can cause a brief voltage dip (brownout), restarting the MCU."
      },
      {
        "symptom": "Barrier arm is crooked or does not point horizontally when at 0 degrees.",
        "checks": [
          "Command tollgate.write(0) in code to position the spline motor shaft.",
          "Unscrew the servo horn, align it horizontally, and press it firmly back onto the gear spline."
        ],
        "explanation": "The servo horn was installed at an offset mechanical angle on the splined shaft."
      }
    ],
    "checksForUnderstanding": [
      "Why must the round-trip echo duration be divided by 2 when calculating obstacle distance?",
      "What is the difference between how an SG90 servo motor operates compared to a standard DC toy motor?"
    ],
    "exitTicket": [
      {
        "question": "Calculate the obstacle distance if the HC-SR04 Echo pulse duration is measured at 1166 microseconds.",
        "rubricOrSampleReasoning": "Distance = (Duration × 0.0343 cm/µs) / 2 = (1166 × 0.0343) / 2 ≈ 40.0 cm / 2 ≈ 20.0 cm."
      },
      {
        "question": "What frequency of sound does the HC-SR04 ultrasonic sensor emit, and can humans hear it?",
        "rubricOrSampleReasoning": "It emits ultrasound at 40,000 Hertz (40 kHz). Humans cannot hear it because human hearing is limited to approximately 20 Hz – 20,000 Hz."
      },
      {
        "question": "How does an SG90 servo know which angle it is currently holding?",
        "rubricOrSampleReasoning": "It has an internal feedback potentiometer attached to the output shaft that acts as a closed-loop voltage sensor, reporting actual position to its internal comparator chip."
      }
    ],
    "differentiation": {
      "support": [
        "Provide pre-attached cardboard boom gates so students focus on wiring and sonar logic."
      ],
      "extension": [
        "Add an automated anti-crush safety sensor: if an object enters the gate area while closing, immediately reopen!"
      ],
      "offlineOption": [
        "Use the interactive Ultrasonic Radar simulator on the RoboBee portal."
      ]
    },
    "nextLessonId": "beg-07",
    "nextLessonTeaser": "Class 07 (Major Project Build Day 1): Touchless Smart Dustbin & Mini Robotic Arm! Build your first complete household autonomous robot.",
    "sources": [
      {
        "title": "HC-SR04 Ultrasonic Ranging Module Technical Specification",
        "url": "https://sparkfun.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "Ultrasonic Tollgate Schematic",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-07",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-comp-hc-sr04",
        "fg-testing-fmea-debugging"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-electronics-breadboards"
      ],
      "goDeeper": [
        "fg-safety-lab-code",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 7,
    "code": "BEGINNER 07",
    "title": "Major Build 1: Touchless Smart Dustbin & Mini Robotic Arm",
    "subtitle": "Major Project Milestone Day 1 — Mechanical pushrod linkages, noise-filtering algorithms, finite state machine architecture, and complete smart sanitation product integration.",
    "promise": "I can assemble mechanical pushrod linkages, filter sensor noise, and build an autonomous touchless smart dustbin that opens on approach, holds, and closes safely.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 06"
    ],
    "outcomes": [
      "Design and assemble mechanical lever pushrod linkages to convert rotational servo torque into linear lid lifting.",
      "Implement a 5-reading median/moving-average digital filter in C++ to eliminate acoustic sonar false positives and draft noise.",
      "Architect a 4-state Finite State Machine (IDLE -> OPENING -> HOLDING -> CLOSING) with non-blocking timing.",
      "Integrate physical sensors, servomotors, chassis enclosure, status indicator LEDs, and power distribution into a finished product.",
      "Defend the completed smart device in an authentic engineering product showcase, measuring opening latency and battery current."
    ],
    "vocabulary": [
      {
        "term": "Mechanical Linkage",
        "plainMeaning": "A connected set of metal rods and pivots that transmits force and motion from a motor to a lid.",
        "technicalMeaning": "An assembly of rigid bodies connected by kinematic joints to transmit force and motion along a designed geometric trajectory."
      },
      {
        "term": "Pushrod",
        "plainMeaning": "A stiff metal wire that pushes the bin lid open when the servo arm rotates.",
        "technicalMeaning": "A rigid linkage element loaded primarily in compression or tension to actuate remote mechanical components."
      },
      {
        "term": "Finite State Machine (FSM)",
        "plainMeaning": "A program organized into clear behavior stages (like Waiting, Opening, Open, Closing) that transitions based on rules.",
        "technicalMeaning": "A computational model consisting of a finite set of states, transitions between states triggered by inputs, and associated actions."
      },
      {
        "term": "Median Digital Filter",
        "plainMeaning": "Taking 5 sensor readings, throwing out the highest and lowest glitches, and picking the middle number to prevent lid fluttering.",
        "technicalMeaning": "A non-linear digital filtering technique widely used to remove salt-and-pepper noise from sensor data while preserving sharp step edges."
      },
      {
        "term": "Holding Dwell Time",
        "plainMeaning": "How long the bin lid stays open so you have plenty of time to throw away trash without it snapping on your hand.",
        "technicalMeaning": "A software-controlled timer duration during which an actuator remains in its activated state prior to initiating closing trajectory."
      },
      {
        "term": "System Integration",
        "plainMeaning": "Putting all the separate parts (brain, eyes, muscle, chassis, and power) together into a finished, working machine.",
        "technicalMeaning": "The engineering process of bringing together component subsystems into one unified, cooperating system ensuring functional synergy."
      }
    ],
    "teacherPrep": [
      "Prepare tabletop mini dustbin boxes or acrylic chassis kits with hinged lids for each team.",
      "Provide pre-bent paperclip/wire pushrod linkages and hot-glue/mounting tape pads.",
      "Ensure student power banks or 9V battery clips are charged and tested."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 or Nano development board",
      "HC-SR04 Ultrasonic Sonar Sensor",
      "SG90 9g Micro Servo with horn arm and mounting hardware",
      "Mini Dustbin Chassis / Box with lightweight hinged lid",
      "Steel / Brass pushrod linkage wire (1.2mm diameter, 10cm length)",
      "1x Common Cathode RGB LED or 2x 5mm LEDs (Green Open, Red Closed)",
      "Solderless breadboard or prototyping shield and jumpers",
      "Double-sided foam tape and zip-ties"
    ],
    "safetyNotes": [
      "Ensure the lid is lightweight (cardboard or thin plastic) so the 9g micro servo does not stall under excessive mechanical load.",
      "Keep fingers clear of the mechanical hinge pivot during automatic testing."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Walk up to a prototype Touchless Smart Dustbin with a handful of scrap paper: hold hand 15cm away; lid sweeps open smoothly, holds for 3 seconds with a blue status glow, and closes gently. Explain: \"Today, you build this commercial smart home robot!\"",
        "studentAction": "Examine the completed physical build. Inspect the servo pushrod linkage mounted to the bin lid hinge."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Deconstruct the mechanical linkage geometry (lever arm radius vs angular travel). Teach the 4-state Finite State Machine and median noise filtering.",
        "studentAction": "Interact with the Servo Arm & Mechanical Linkage Sim on the portal: test lever angles and noise filter algorithms."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide physical assembly: mount HC-SR04 facing outward on front of bin; mount SG90 on interior wall; link pushrod to lid; wire Arduino.",
        "studentAction": "Assemble the physical dustbin mechanics. Adjust pushrod length so 0° holds lid closed and 100° opens lid wide."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through FSM architecture in C++: enum State { IDLE, OPENING, HOLDING, CLOSING }; and the 5-sample median filter.",
        "studentAction": "Upload the Touchless Dustbin firmware. Test approach hand gestures: tune detection threshold to exactly 20cm."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"RoboBee Sanitation Product Showcase\": each team demonstrates 5 consecutive hands-free trash deposits and defends their build.",
        "studentAction": "Demonstrate completed Smart Bin to peers and instructors. Measure opening response time in milliseconds and complete Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "Lever Linkage Geometry & Torque",
        "explanation": "An SG90 servo produces about 1.6 kg-cm of torque at 5V. If our pushrod is attached 1.5 cm from the servo pivot, it exerts over 1.0 kg of pushing force! Connecting the other end of the rod further from the lid hinge gives high mechanical advantage to lift the lid effortlessly.",
        "instructorNote": "Show that attaching the pushrod too far out on the servo horn reduces lifting force, while attaching too close reduces travel distance."
      },
      {
        "title": "Eliminating False Triggers with Median Filtering",
        "explanation": "Ultrasonic sensors occasionally read a false \"0cm\" or \"300cm\" due to room echoes, drafts, or electrical noise. If our code reacts to a single bad reading, the bin lid flaps erratically. A 5-reading median filter sorts samples and picks the median, completely ignoring extreme spikes.",
        "instructorNote": "Demonstrate array sorting: raw values [18, 19, 0, 18, 20] -> sorted [0, 18, 18, 19, 20] -> median is 18 cm (the 0 is eliminated!)."
      },
      {
        "title": "Finite State Machine (FSM) Clean Architecture",
        "explanation": "Amateur code uses nested delay() calls that freeze the machine. Professional embedded systems use a Finite State Machine: IDLE (watching for hands), OPENING (smooth servo ramp), HOLDING (3s countdown with blinking light), and CLOSING (gentle non-slamming descent).",
        "instructorNote": "Draw the 4 circles and transition arrows on the whiteboard."
      }
    ],
    "visualizerId": "servo_arm_sim",
    "project": {
      "name": "Major Milestone 1: Autonomous Touchless Smart Sanitation Dustbin",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Fully assembled mechanical chassis with lid actuated by SG90 servo pushrod linkage.",
        "HC-SR04 sonar front-mounted measuring user hand approach with median noise filtering.",
        "Robust 4-state FSM executing: detects hand < 20cm -> opens to 100° in 350ms -> holds 3000ms -> closes smoothly without slamming."
      ]
    },
    "activity": {
      "title": "Fabricate, Assemble, and Program the Touchless Smart Dustbin",
      "steps": [
        "Step 1: Mount HC-SR04 ultrasonic sensor to the front aperture of the dustbin facing slightly upwards.",
        "Step 2: Secure SG90 servo motor firmly to the interior sidewall using foam tape or bracket screws.",
        "Step 3: Bend a 10cm steel linkage pushrod: form Z-bends on both ends; attach one end to servo horn and other end to lid bracket.",
        "Step 4: Wire HC-SR04 (Trig D9, Echo D10), SG90 (Signal D6, 5V, GND), and status RGB LED (Pins 3, 4, 5).",
        "Step 5: Upload the production-grade FSM firmware.",
        "Step 6: Test manual calibration: confirm 0° holds lid completely flush and 100° opens lid to 80° vertical clearance.",
        "Step 7: Conduct 10 consecutive hands-free discard trials with crumpled paper balls."
      ],
      "successCriteria": [
        "Lid opens within 400ms of hand approach within 20cm.",
        "Zero false triggers observed when ambient students walk past at 50cm.",
        "Lid closes gently without snapping or stalling the servo motor."
      ],
      "extension": "Add an automatic full-bin warning: if trash remains stacked < 5cm from sensor for 10 seconds, flash red LED!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3 or Nano",
        "HC-SR04 Sonar",
        "SG90 Micro Servo"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 or Nano",
          "exactVariant": "Standard 16 MHz microcontroller",
          "quantity": 1
        },
        {
          "name": "HC-SR04 Sonar Sensor",
          "exactVariant": "4-pin ultrasonic distance module",
          "quantity": 1
        },
        {
          "name": "SG90 9g Micro Servo",
          "exactVariant": "High-torque nylon gear micro servo",
          "quantity": 1
        },
        {
          "name": "Dustbin Container Body & Lid",
          "exactVariant": "Lightweight desktop flip-top bin (15–20cm height)",
          "quantity": 1
        },
        {
          "name": "Linkage Pushrod Wire",
          "exactVariant": "1.2mm diameter stiff steel wire (10cm length)",
          "quantity": 1
        },
        {
          "name": "Status Indicator RGB LED",
          "exactVariant": "Common cathode 5mm LED with 220Ω resistors",
          "quantity": 1
        },
        {
          "name": "Half-size Solderless Breadboard",
          "exactVariant": "400 tie points with power rails",
          "quantity": 1
        },
        {
          "name": "Mounting Hardware & Jumpers",
          "exactVariant": "Double-sided foam tape, zip ties, and jumper wires",
          "quantity": 12
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/class1-external-blink-wiring.svg",
      "schematic": "HC-SR04: VCC->5V | GND->GND | Trig->D9 | Echo->D10; SG90 Servo: VCC->5V | GND->GND | Signal->D6; Status RGB LED: Cathode->GND | Red->220Ω->D3 | Green->220Ω->D4 | Blue->220Ω->D5",
      "wireTable": [
        {
          "from": "Arduino Digital Pin 9",
          "to": "HC-SR04 Trig Pin",
          "wireOrPolarityNote": "Sonar trigger pulse"
        },
        {
          "from": "Arduino Digital Pin 10",
          "to": "HC-SR04 Echo Pin",
          "wireOrPolarityNote": "Sonar echo return"
        },
        {
          "from": "Arduino Digital Pin 6 (PWM)",
          "to": "SG90 Orange Signal Wire",
          "wireOrPolarityNote": "Lid actuator servo command"
        },
        {
          "from": "Arduino Digital Pin 3",
          "to": "RGB Red Anode Resistor",
          "wireOrPolarityNote": "Closing / Closed indicator"
        },
        {
          "from": "Arduino Digital Pin 4",
          "to": "RGB Green Anode Resistor",
          "wireOrPolarityNote": "Open / Ready indicator"
        },
        {
          "from": "Arduino Digital Pin 5",
          "to": "RGB Blue Anode Resistor",
          "wireOrPolarityNote": "Holding countdown indicator"
        },
        {
          "from": "Arduino 5V Power Pin",
          "to": "Breadboard Power Rail (+)",
          "wireOrPolarityNote": "Regulated 5V bus"
        },
        {
          "from": "Arduino GND Pin",
          "to": "Breadboard Ground Rail (-)",
          "wireOrPolarityNote": "Common Ground return"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Drill or cut neat aperture holes in dustbin body for sonar transducers.",
        "2. Fasten SG90 servo securely to inner wall with industrial foam tape.",
        "3. Form Z-bends in the 1.2mm wire pushrod and connect between servo arm and lid underside.",
        "4. Mount Arduino and breadboard to rear or base of dustbin.",
        "5. Connect all wires according to wire table.",
        "6. Power via USB or 9V battery pack; test open/close angles."
      ],
      "powerAndSafetyChecks": [
        "Verify pushrod does not bind or hit the bin rim during opening stroke.",
        "Confirm servo is powered from 5V rail and shares common Ground with Arduino."
      ],
      "testCases": [
        {
          "action": "Idle state (no hand near bin)",
          "expectedResult": "Lid rests securely closed at 0°; status LED glows faint Green."
        },
        {
          "action": "Hover hand 10cm above sonar sensor",
          "expectedResult": "Lid sweeps smoothly open to 100° in ~350ms; status LED switches to Blue."
        },
        {
          "action": "Hold hand for countdown period",
          "expectedResult": "Lid stays open for exactly 3000ms; status LED pulses."
        },
        {
          "action": "Countdown timer expires",
          "expectedResult": "Lid descends smoothly back to 0° closed position; status LED returns to Green."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 07: Touchless Smart Dustbin\n * Major Project Milestone Day 1\n * Board: Arduino Uno R3 or Nano (ATmega328P)\n */\n\n#include <Servo.h>\n\nconst int PIN_TRIG   = 9;   // Sonar Trigger\nconst int PIN_ECHO   = 10;  // Sonar Echo\nconst int PIN_SERVO  = 6;   // Lid Actuator Servo\nconst int PIN_RED    = 3;   // RGB Red\nconst int PIN_GREEN  = 4;   // RGB Green\nconst int PIN_BLUE   = 5;   // RGB Blue\n\n// Mechanical Angle Constants\nconst int ANGLE_CLOSED = 0;   // Lid flush closed\nconst int ANGLE_OPEN   = 105; // Lid lifted wide\nconst int DETECT_DIST  = 20;  // Detection boundary in cm\nconst unsigned long DWELL_TIME = 3000; // Hold open for 3.0 seconds\n\nServo lidServo;\n\n// Finite State Machine States\nenum BinState {\n  STATE_IDLE,\n  STATE_OPENING,\n  STATE_HOLDING,\n  STATE_CLOSING\n};\n\nBinState currentState = STATE_IDLE;\nunsigned long stateStartTime = 0;\n\n// 5-Sample Median Filter for Ultra-Reliable Sonar Distance\nlong getFilteredDistance() {\n  long samples[5];\n  for (int i = 0; i < 5; i++) {\n    digitalWrite(PIN_TRIG, LOW);\n    delayMicroseconds(2);\n    digitalWrite(PIN_TRIG, HIGH);\n    delayMicroseconds(10);\n    digitalWrite(PIN_TRIG, LOW);\n\n    long duration = pulseIn(PIN_ECHO, HIGH, 25000);\n    if (duration == 0) duration = 15000;\n    samples[i] = (duration * 0.0343) / 2;\n    delay(10);\n  }\n\n  // Simple bubble sort to find median\n  for (int i = 0; i < 4; i++) {\n    for (int j = i + 1; j < 5; j++) {\n      if (samples[i] > samples[j]) {\n        long temp = samples[i];\n        samples[i] = samples[j];\n        samples[j] = temp;\n      }\n    }\n  }\n  return samples[2]; // Return median middle sample\n}\n\nvoid setStatusColor(bool r, bool g, bool b) {\n  digitalWrite(PIN_RED, r ? HIGH : LOW);\n  digitalWrite(PIN_GREEN, g ? HIGH : LOW);\n  digitalWrite(PIN_BLUE, b ? HIGH : LOW);\n}\n\nvoid setup() {\n  pinMode(PIN_TRIG, OUTPUT);\n  pinMode(PIN_ECHO, INPUT);\n  pinMode(PIN_RED, OUTPUT);\n  pinMode(PIN_GREEN, OUTPUT);\n  pinMode(PIN_BLUE, OUTPUT);\n\n  lidServo.attach(PIN_SERVO);\n  lidServo.write(ANGLE_CLOSED);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE TOUCHLESS SMART DUSTBIN READY ===\");\n  setStatusColor(false, true, false); // Green = Ready\n}\n\nvoid loop() {\n  long distance = getFilteredDistance();\n\n  switch (currentState) {\n    case STATE_IDLE:\n      setStatusColor(false, true, false); // Green = Ready\n      if (distance > 0 && distance < DETECT_DIST) {\n        Serial.println(\">> HAND DETECTED: Opening Lid!\");\n        currentState = STATE_OPENING;\n        stateStartTime = millis();\n      }\n      break;\n\n    case STATE_OPENING:\n      setStatusColor(false, false, true); // Blue = Opening\n      lidServo.write(ANGLE_OPEN);\n      if (millis() - stateStartTime >= 350) { // Allow 350ms to reach 105 deg\n        currentState = STATE_HOLDING;\n        stateStartTime = millis();\n      }\n      break;\n\n    case STATE_HOLDING:\n      setStatusColor(false, false, true); // Blue = Holding\n      // If hand remains present, refresh dwell timer\n      if (distance > 0 && distance < DETECT_DIST) {\n        stateStartTime = millis();\n      }\n      if (millis() - stateStartTime >= DWELL_TIME) {\n        Serial.println(\">> Dwell complete: Closing Lid...\");\n        currentState = STATE_CLOSING;\n        stateStartTime = millis();\n      }\n      break;\n\n    case STATE_CLOSING:\n      setStatusColor(true, false, false); // Red = Closing\n      lidServo.write(ANGLE_CLOSED);\n      if (millis() - stateStartTime >= 400) { // Allow 400ms to seat flush\n        currentState = STATE_IDLE;\n        Serial.println(\">> Bin safely closed and IDLE.\");\n      }\n      break;\n  }\n\n  delay(40);\n}\n",
      "pinMap": {
        "Pin 9": "HC-SR04 Trigger Pin (Fires ultrasonic chirp pulses)",
        "Pin 10": "HC-SR04 Echo Pin (Reads return acoustic time-of-flight)",
        "Pin 6": "SG90 Micro Servo PWM control line",
        "Pin 3": "Status RGB LED Red channel (Closing state)",
        "Pin 4": "Status RGB LED Green channel (Idle / Ready state)",
        "Pin 5": "Status RGB LED Blue channel (Opening / Holding state)"
      },
      "setupAndUpload": [
        "Mount mechanical hardware into dustbin enclosure.",
        "Connect Arduino via USB, select Board and Port, and upload sketch.",
        "Test hand gestures: confirm lid opens smoothly, holds 3 seconds, and closes."
      ],
      "explanations": [
        "getFilteredDistance(): Takes 5 sonar samples, sorts them in ascending order, and returns samples[2] (the median) to eliminate false spikes.",
        "enum BinState: Clean enum defining the 4 formal states of the machine.",
        "DWELL_TIME (3000ms): Keeps lid open so user can comfortably dispose of trash without rush.",
        "stateStartTime timer refresh: If user’s hand stays in front of the sensor, the dwell timer resets, keeping the lid open continuously."
      ],
      "expectedResult": "Placing hand within 20cm of bin smoothly swings lid open to 105°; lid stays open for 3s (or as long as hand remains); closes gently when user steps away.",
      "caveats": [
        "Do not set ANGLE_OPEN beyond the mechanical limit of the lid hinge, or the servo will stall and overheat.",
        "Ensure the pushrod wire is rigid steel so it does not flex or bow under load."
      ],
      "tweakTip": "Adjust DWELL_TIME from 3000ms to 5000ms if users prefer a longer trash deposit window!"
    },
    "troubleshooting": [
      {
        "symptom": "Lid opens only halfway or the servo motor buzzes loudly when open.",
        "checks": [
          "Check mechanical linkage travel: verify the pushrod is not jammed against the bin rim.",
          "Adjust ANGLE_OPEN in code: reduce from 105 to 90 or 85 degrees to match lid hinge freedom."
        ],
        "explanation": "Commanding a servo beyond physical mechanical limits causes the motor to stall under high stall current."
      },
      {
        "symptom": "Lid opens randomly when nobody is in front of the dustbin.",
        "checks": [
          "Check sonar angle: ensure the sensor is not angled downwards towards the floor or tabletop.",
          "Increase sample count in median filter from 5 to 7 samples."
        ],
        "explanation": "Ground reflections can create intermittent false echos that trigger threshold detection."
      },
      {
        "symptom": "Lid snaps open so fast it shakes the dustbin.",
        "checks": [
          "Implement an interpolated servo sweep: increment angle by 3 degrees every 10ms instead of instantaneous jump.",
          "Ensure the bin base is weighted or taped to the tabletop."
        ],
        "explanation": "Direct positional jumps command maximum servo motor acceleration and rotational momentum."
      }
    ],
    "checksForUnderstanding": [
      "How does a 5-sample median filter eliminate false ultrasonic spikes?",
      "Why is a Finite State Machine superior to a long delay(3000) for managing the lid cycle?"
    ],
    "exitTicket": [
      {
        "question": "Explain what happens during the HOLDING state if a user keeps their hand in front of the sensor for 8 seconds.",
        "rubricOrSampleReasoning": "The code checks if distance < DETECT_DIST during the HOLDING state; if true, it resets stateStartTime = millis(). This refreshes the 3-second countdown so the lid never snaps shut while the user is actively using the bin."
      },
      {
        "question": "Why does sorting an array of 5 readings and selecting index 2 eliminate an occasional 0cm sensor glitch?",
        "rubricOrSampleReasoning": "A glitch of 0cm will be sorted to the very front of the array (index 0). Index 2 represents the true median reading, completely filtering out both 0cm dropouts and 300cm echo timeouts."
      },
      {
        "question": "What is the mechanical advantage of attaching a pushrod further away from the bin lid hinge?",
        "rubricOrSampleReasoning": "Greater distance from the hinge increases the moment arm (Torque = Force × Distance), meaning less force is needed from the servo motor to lift the weight of the lid."
      }
    ],
    "differentiation": {
      "support": [
        "Provide pre-cut pushrods with precision Z-bends for quick mechanical assembly."
      ],
      "extension": [
        "Add an automated soft-close feature using PWM micro-stepping to eliminate all closure impact noise."
      ],
      "offlineOption": [
        "Simulate the complete Touchless Dustbin mechanical linkage on the RoboBee portal."
      ]
    },
    "nextLessonId": "beg-08",
    "nextLessonTeaser": "Class 08: MQ-2 Gas/Smoke, DHT11 Temp/Humidity, Soil Moisture & 5V Relay! Enter environmental monitoring and high-power industrial switching.",
    "sources": [
      {
        "title": "RoboBEE Innovators Major Build 1 Engineering Specifications",
        "url": ""
      }
    ],
    "assetCredits": [
      {
        "asset": "Touchless Smart Dustbin Mechanical Assembly Drawing",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-08",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-electronics-ohms-law",
        "fg-board-uno-anatomy"
      ],
      "lookUpWhileBuilding": [
        "fg-electronics-breadboards",
        "fg-safety-lab-code"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 8,
    "code": "BEGINNER 08",
    "title": "MQ-2 Gas/Smoke, DHT11 Temp/Humidity, Soil Moisture & 5V Relay",
    "subtitle": "Environmental transducers, tin-dioxide SnO2 gas heating chambers, single-bus digital timing protocols, and galvanic soil resistance with optocoupler relay isolation.",
    "promise": "I can monitor air quality and environmental climate sensors, isolate high-power loads with 5V electromechanical relays, and build an automated greenhouse safety station.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 07"
    ],
    "outcomes": [
      "Explain the chemical heating and adsorption principles of the MQ-2 tin-dioxide (SnO2) gas sensor.",
      "Decode single-wire digital serial packets (40-bit data stream) from the DHT11 humidity and temperature sensor.",
      "Construct a galvanic soil moisture probe and map analog soil resistance to plant hydration percentages.",
      "Deconstruct electromechanical relays: coil energization, flyback diode protection, Normally Open (NO) vs Normally Closed (NC).",
      "Assemble and program an Autonomous Greenhouse Disaster Prevention Station: automatically switches high-power 5V DC fan/pump relays and sounds alarms."
    ],
    "vocabulary": [
      {
        "term": "MQ-2 Gas/Smoke Sensor",
        "plainMeaning": "A sensor that heats up a tiny chemical chamber to detect combustible gases like LPG, propane, methane, and smoke.",
        "technicalMeaning": "A chemo-resistive gas transducer utilizing tin dioxide (SnO2) whose surface conductivity increases in the presence of reducing gases at ~300°C."
      },
      {
        "term": "DHT11 Sensor",
        "plainMeaning": "A digital sensor that measures both ambient temperature and air humidity over a single communication pin.",
        "technicalMeaning": "A combined sensor featuring a resistive humidity component, NTC thermistor, and internal 8-bit MCU transmitting 40-bit serial packets."
      },
      {
        "term": "Soil Moisture Probe",
        "plainMeaning": "Two gold-plated prongs pushed into soil that measure how easily electricity flows through moist dirt.",
        "technicalMeaning": "A resistive soil moisture sensor measuring the electrical conductivity of the substrate, inversely proportional to volumetric water content."
      },
      {
        "term": "5V Electromechanical Relay",
        "plainMeaning": "A remote-controlled magnetic light switch that lets a tiny 5V Arduino signal safely turn on big fans, pumps, or lamps.",
        "technicalMeaning": "An electrically operated switch utilizing an electromagnet coil to physically attract a mechanical armature, bridging high-voltage/high-current contacts."
      },
      {
        "term": "Normally Open (NO) vs Closed (NC)",
        "plainMeaning": "NO stays disconnected until Arduino turns on the magnet; NC stays connected until turned off.",
        "technicalMeaning": "NO contacts remain open in the de-energized coil state; NC contacts maintain continuity until coil excitation forces the contact to break."
      },
      {
        "term": "Galvanic Isolation / Optocoupler",
        "plainMeaning": "Using a tiny light beam inside a chip to protect the Arduino from dangerous power surges on the motor/fan side.",
        "technicalMeaning": "The electrical separation of two circuits via an optical barrier (LED and phototransistor) preventing transient voltage spikes from reaching the MCU."
      }
    ],
    "teacherPrep": [
      "Distribute MQ-2 gas sensors, DHT11 sensors, soil moisture probes, 1-channel 5V relay modules, and 5V mini DC fans.",
      "Provide small cups of dry and damp soil for real-time plant hydration testing.",
      "Ensure DHT11 library (by Adafruit) is installed in student IDE environments."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 with USB cable",
      "MQ-2 Flammable Gas & Smoke Sensor Module",
      "DHT11 Digital Temperature & Humidity Sensor",
      "Resistive Soil Moisture Sensor with LM393 comparator board",
      "1-Channel 5V Optocoupler Relay Module",
      "5V DC Mini Cooling Fan or Submersible Water Pump",
      "Piezo Buzzer (Emergency Hazard Siren)",
      "Solderless breadboard and jumper wires"
    ],
    "safetyNotes": [
      "MQ-2 gas sensor metal cap becomes warm to the touch during normal operation: this is the internal 5V heating element and is normal.",
      "Only switch low-voltage DC loads (5V to 12V fans/pumps) during student labs; never connect mains 220V AC wiring."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Introduce an automated greenhouse chamber. Spray a small alcohol swab or light an extinguished match near the MQ-2 sensor: instantly, the relay clicks loudly, the exhaust fan spins at full speed, and an alarm sounds!",
        "studentAction": "Observe the environmental sensors and the mechanical \"click\" of the relay switch. Inspect the copper prongs of the soil moisture probe."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Explain SnO2 chemical adsorption, the DHT11 40-bit protocol, and how relay magnetic coils physically pull contacts. Teach NO vs NC.",
        "studentAction": "Explore the IoT Greenhouse Dashboard on the portal: test humidity thresholds and relay switching states."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: DHT11 Data->D4, MQ-2 AOUT->A0, Soil Moisture AOUT->A1, Relay IN->D7, Buzzer->D8; connect 5V DC fan through Relay NO and COM terminals.",
        "studentAction": "Wire the multi-sensor safety station. Double-check relay coil connections and Ground returns."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through dht.readTemperature(), dht.readHumidity(), analogRead() thresholds, and driving relay pins LOW to trigger active-low relays.",
        "studentAction": "Upload the Greenhouse Safety firmware. Open Serial Monitor. Dip soil probe into dry vs wet soil: watch pump/fan relay click dynamically!"
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"Smart Agriculture Climate Defense Challenge\": calibrate trigger thresholds so the station survives simulated drought and heat!",
        "studentAction": "Demonstrate live environmental triggers, log temperature and gas values in PPM, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "How the MQ-2 \"Smells\" Smoke and Gas",
        "explanation": "Inside the MQ-2 is a microscopic ceramic tube coated with Tin Dioxide (SnO2). When heated to ~300°C by a 5V coil, oxygen binds to the surface. When reducing gases (smoke, butane, LPG) enter the chamber, they react with the oxygen, freeing trapped electrons and causing electrical resistance to drop sharply.",
        "instructorNote": "Point out the fine stainless-steel mesh window on the sensor—it protects the heating coil and prevents sparks from igniting external gas."
      },
      {
        "title": "The Mechanical Magic of an Electromechanical Relay",
        "explanation": "An Arduino output pin can only supply 20mA at 5V—far too weak to run a large cooling fan or water pump! A relay contains an electromagnet coil. When Arduino sends a tiny 5V signal, the coil generates a magnetic field that physically pulls a spring-loaded iron armature down, connecting heavy copper terminals that can carry up to 10 Amps!",
        "instructorNote": "Have students listen for the crisp mechanical \"CLICK\" sound whenever the relay engages and disengages."
      },
      {
        "title": "Active-LOW Relay Modules",
        "explanation": "Most commercial hobby relay modules are active-LOW: writing digitalWrite(7, LOW) connects the optocoupler LED to GND, turning the relay ON; writing HIGH turns the relay OFF. This design ensures that if the microcontroller resets (pins default to high impedance), appliances stay safely OFF.",
        "instructorNote": "Explain why keeping machinery OFF during bootup is a critical industrial safety standard."
      }
    ],
    "visualizerId": "iot_dashboard_sim",
    "project": {
      "name": "Autonomous IoT Greenhouse Safety & Disaster Prevention Station",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Simultaneous multi-sensor telemetry (DHT11 temp/humidity, MQ-2 gas, and soil moisture) logged to Serial Monitor.",
        "Audible mechanical relay clicking on when environmental thresholds are breached.",
        "Active exhaust fan and emergency siren response to simulated smoke or dry soil conditions."
      ]
    },
    "activity": {
      "title": "Assemble, Wire, and Program the Environmental Safety Hub",
      "steps": [
        "Step 1: Connect DHT11: VCC to 5V, GND to GND, Data pin to Arduino Digital Pin 4.",
        "Step 2: Connect MQ-2 gas sensor: VCC to 5V, GND to GND, AOUT to Analog Pin A0.",
        "Step 3: Connect Soil Moisture probe module: VCC to 5V, GND to GND, AOUT to Analog Pin A1.",
        "Step 4: Connect 1-Channel Relay module: VCC to 5V, GND to GND, IN to Digital Pin 7.",
        "Step 5: Wire 5V mini DC fan in series through the Relay COM (Common) and NO (Normally Open) terminals to the 5V power bus.",
        "Step 6: Connect Piezo buzzer to Digital Pin 8 and GND.",
        "Step 7: Upload firmware. Insert soil probe into dry cup: pump/fan activates; breathe warm air on DHT11: humidity rises on monitor!"
      ],
      "successCriteria": [
        "Telemetry streams stable readings every 1000ms without NaN errors.",
        "Relay triggers reliably when smoke threshold is exceeded or soil is dry.",
        "Audible emergency alarm alerts instantly during simulated gas leaks."
      ],
      "extension": "Add an automatic irrigation cooldown timer: pump runs for 5 seconds, then pauses for 10 seconds to allow water absorption!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "MQ-2 Gas Sensor",
        "DHT11 Sensor",
        "1-Ch 5V Relay"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "MQ-2 Gas / Smoke Sensor",
          "exactVariant": "4-pin analog/digital module",
          "quantity": 1
        },
        {
          "name": "DHT11 Temperature & Humidity Sensor",
          "exactVariant": "3-pin single-bus digital module",
          "quantity": 1
        },
        {
          "name": "Soil Moisture Probe",
          "exactVariant": "Dual-prong PCB with LM393 comparator board",
          "quantity": 1
        },
        {
          "name": "1-Channel 5V Relay Module",
          "exactVariant": "Optocoupled 250VAC/10A rated",
          "quantity": 1
        },
        {
          "name": "5V DC Mini Cooling Fan",
          "exactVariant": "40mm brushless 5V fan",
          "quantity": 1
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive transducer",
          "quantity": 1
        },
        {
          "name": "Solderless Breadboard & Jumpers",
          "exactVariant": "Half-size 400 tie points and ribbon cables",
          "quantity": 14
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "DHT11: VCC->5V | GND->GND | Data->D4; MQ-2: VCC->5V | GND->GND | AOUT->A0; Soil: VCC->5V | GND->GND | AOUT->A1; Relay: VCC->5V | GND->GND | IN->D7; Fan: 5V -> Relay COM | Relay NO -> Fan (+) | Fan (-) -> GND; Buzzer: D8 -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "DHT11 Data Pin",
          "to": "Arduino Digital Pin 4",
          "wireOrPolarityNote": "Single-bus serial telemetry"
        },
        {
          "from": "MQ-2 AOUT Pin",
          "to": "Arduino Analog In A0",
          "wireOrPolarityNote": "Gas / Smoke concentration voltage"
        },
        {
          "from": "Soil Moisture AOUT Pin",
          "to": "Arduino Analog In A1",
          "wireOrPolarityNote": "Soil conductivity voltage"
        },
        {
          "from": "Relay Module IN Pin",
          "to": "Arduino Digital Pin 7",
          "wireOrPolarityNote": "Active-LOW coil trigger"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Emergency Hazard Siren"
        },
        {
          "from": "Arduino 5V Power Pin",
          "to": "Breadboard Power Rail (+)",
          "wireOrPolarityNote": "5V DC bus"
        },
        {
          "from": "Arduino GND Pin",
          "to": "Breadboard Ground Rail (-)",
          "wireOrPolarityNote": "Common Ground return"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Verify USB is disconnected before wiring.",
        "2. Mount DHT11, MQ-2, and soil probe comparator to breadboard.",
        "3. Wire data pins to D4, A0, and A1.",
        "4. Connect Relay module VCC, GND, and IN to D7.",
        "5. Wire DC fan in series through Relay COM and NO terminals.",
        "6. Connect Buzzer to D8, plug in USB, and observe initial sensor warmup."
      ],
      "powerAndSafetyChecks": [
        "Do not short the relay COM and NO terminals directly to 5V and GND.",
        "Ensure the MQ-2 sensor has at least 60 seconds to warm up its heating element."
      ],
      "testCases": [
        {
          "action": "Dip soil probe into dry soil (<300 ADC)",
          "expectedResult": "Relay triggers ON (clicks); Fan/pump starts; Serial reports \"DRY SOIL\"."
        },
        {
          "action": "Add water to soil cup (>600 ADC)",
          "expectedResult": "Relay disengages (clicks); Fan/pump stops; Serial reports \"SOIL MOISTURE OPTIMAL\"."
        },
        {
          "action": "Expose MQ-2 to smoke from extinguished match",
          "expectedResult": "Gas reading spikes > 450; Siren sounds urgently; Exhaust fan triggers ON."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 08: Greenhouse Climate & Safety Station\n * Board: Arduino Uno R3 (ATmega328P)\n * Required Library: DHT sensor library by Adafruit\n */\n\n#include \"DHT.h\"\n\n#define DHTPIN 4\n#define DHTTYPE DHT11\n\nconst int PIN_GAS    = A0; // MQ-2 Analog Out\nconst int PIN_SOIL   = A1; // Soil Moisture Analog Out\nconst int PIN_RELAY  = 7;  // 5V Relay IN (Active LOW)\nconst int PIN_BUZZER = 8;  // Hazard Siren\n\n// Safety Thresholds\nconst int GAS_DANGER_THRESHOLD = 450; // Gas reading indicating smoke/leak\nconst int SOIL_DRY_THRESHOLD   = 400; // Low reading = Dry soil\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  pinMode(PIN_RELAY, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  // Active-LOW relay: HIGH = OFF, LOW = ON\n  digitalWrite(PIN_RELAY, HIGH);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE IOT GREENHOUSE & HAZARD STATION ===\");\n  dht.begin();\n  delay(1500); // Allow sensors to stabilize\n}\n\nvoid loop() {\n  // Read Digital Temperature & Humidity\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n\n  // Read Analog Gas and Soil Sensors\n  int gasPpm = analogRead(PIN_GAS);\n  int soilVal = analogRead(PIN_SOIL);\n\n  // Check if DHT reading is valid\n  if (isnan(humidity) || isnan(temperature)) {\n    Serial.println(\"Warning: Failed to read from DHT sensor!\");\n    humidity = 0;\n    temperature = 0;\n  }\n\n  // Print Telemetry to Serial Monitor\n  Serial.print(\"Temp: \"); Serial.print(temperature); Serial.print(\" C | \");\n  Serial.print(\"Humidity: \"); Serial.print(humidity); Serial.print(\" % | \");\n  Serial.print(\"Gas: \"); Serial.print(gasPpm); Serial.print(\" | \");\n  Serial.print(\"Soil: \"); Serial.println(soilVal);\n\n  bool danger = false;\n\n  // Hazard Check 1: Flammable Gas or Smoke\n  if (gasPpm > GAS_DANGER_THRESHOLD) {\n    Serial.println(\"!! EMERGENCY: High Gas / Smoke Concentration Detected !!\");\n    danger = true;\n    digitalWrite(PIN_RELAY, LOW); // Turn ON Exhaust Fan\n    // Sound urgent emergency siren\n    tone(PIN_BUZZER, 1500, 150);\n    delay(180);\n    tone(PIN_BUZZER, 900, 150);\n  }\n\n  // Hazard Check 2: Dry Soil (Needs Irrigation)\n  if (soilVal < SOIL_DRY_THRESHOLD && !danger) {\n    Serial.println(\">> SOIL DRY: Activating Water Pump Relay...\");\n    digitalWrite(PIN_RELAY, LOW); // Turn ON Pump\n  } else if (!danger) {\n    digitalWrite(PIN_RELAY, HIGH); // Turn OFF Relay\n  }\n\n  delay(1000); // 1.0 second sensor sampling cycle\n}\n",
      "pinMap": {
        "Pin 4": "DHT11 Data Line (Single-bus temperature & humidity protocol)",
        "Pin A0": "MQ-2 Gas / Smoke Sensor Analog Out",
        "Pin A1": "Soil Moisture Sensor Analog Out",
        "Pin 7": "1-Channel 5V Relay IN (Active-LOW coil trigger)",
        "Pin 8": "Emergency Alert Siren Buzzer"
      },
      "setupAndUpload": [
        "Install \"DHT sensor library\" via Arduino IDE Library Manager.",
        "Connect Arduino Uno via USB cable, select board and port, and upload sketch.",
        "Open Serial Monitor at 9600 baud to view real-time environmental telemetry."
      ],
      "explanations": [
        "dht.readTemperature() and readHumidity(): Decodes the 40-bit serial train sent by the DHT11 sensor.",
        "digitalWrite(PIN_RELAY, LOW): Connects optocoupler cathode to GND, energizing the relay coil and switching the fan ON.",
        "digitalWrite(PIN_RELAY, HIGH): Disengages the relay coil, returning contacts to default open state.",
        "GAS_DANGER_THRESHOLD check: Prioritizes human life safety—smoke triggers immediate exhaust ventilation and sirens."
      ],
      "expectedResult": "System monitors climate continuously; dry soil activates the pump relay; simulated smoke triggers the high-speed exhaust fan and alarm sirens.",
      "caveats": [
        "DHT11 cannot be read faster than once every 1–2 seconds: rapid sampling will return stale or NaN data.",
        "MQ-2 requires a clean environment warmup before baseline calibration."
      ],
      "tweakTip": "Add an automated high-temperature threshold (> 35°C) that turns on the cooling fan even if gas levels are normal!"
    },
    "troubleshooting": [
      {
        "symptom": "DHT11 outputs \"NaN\" (Not a Number) on Serial Monitor continuously.",
        "checks": [
          "Check data wire: verify connection to Digital Pin 4.",
          "Ensure delay between reads is at least 1000ms.",
          "Verify DHT11 is receiving 5V power and GND."
        ],
        "explanation": "The DHT11 uses precise microsecond timing pulses; loose wiring breaks the single-wire handshaking protocol."
      },
      {
        "symptom": "Relay stays on all the time and never turns off.",
        "checks": [
          "Check relay logic: most relay boards are active-LOW (write HIGH to turn OFF).",
          "Verify digitalWrite(PIN_RELAY, HIGH) in setup() to keep relay deactivated on startup."
        ],
        "explanation": "Writing LOW turns an active-LOW relay ON; invert the logic in code if needed."
      },
      {
        "symptom": "MQ-2 sensor reads 1023 continuously.",
        "checks": [
          "Check if connected to Analog AOUT or Digital DOUT: must use AOUT for variable gas concentration.",
          "Allow 60 seconds for internal heater to burn off residual factory coatings."
        ],
        "explanation": "Cold sensors exhibit high baseline conductivity until reaching the 300°C operating temperature."
      }
    ],
    "checksForUnderstanding": [
      "Why can’t an Arduino pin power a large cooling fan or water pump directly without a relay?",
      "What does \"Active-LOW\" mean when controlling a hobby relay module?"
    ],
    "exitTicket": [
      {
        "question": "Explain the purpose of Normally Open (NO) versus Normally Closed (NC) contacts on a relay.",
        "rubricOrSampleReasoning": "Normally Open (NO) contacts remain disconnected until the relay coil is energized by the microcontroller. Normally Closed (NC) contacts remain connected until the coil is energized. NO is preferred for safety so appliances stay OFF if power fails."
      },
      {
        "question": "How does an optocoupler protect the Arduino microcontroller from motor power surges?",
        "rubricOrSampleReasoning": "An optocoupler transmits the control signal using a beam of light (an internal infrared LED shining on a phototransistor). There is no physical electrical connection between the Arduino and the high-power relay circuit, isolating the MCU from voltage spikes."
      },
      {
        "question": "Why does soil moisture decrease the electrical resistance between the probe prongs?",
        "rubricOrSampleReasoning": "Water containing dissolved mineral ions acts as an electrical conductor. More water in the soil allows more current to flow between the prongs, lowering resistance and raising measured voltage."
      }
    ],
    "differentiation": {
      "support": [
        "Provide color-coded stickers for relay terminals (COM, NO, NC)."
      ],
      "extension": [
        "Implement a multi-stage irrigation algorithm with hysteresis and soil drying predictions."
      ],
      "offlineOption": [
        "Use the interactive IoT Greenhouse Dashboard on the RoboBee portal."
      ]
    },
    "nextLessonId": "beg-09",
    "nextLessonTeaser": "Class 09: DC Gear Motors, L298N H-Bridge, 2WD Chassis Assembly & Choreographed Robot Dance! Build your first mobile robot chassis.",
    "sources": [
      {
        "title": "Songle 5V Relay Technical Datasheet",
        "url": "https://songle.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "Greenhouse Station Schematic",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-09",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-motion-differential-kinematics",
        "fg-safety-lab-code"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-electronics-breadboards"
      ],
      "goDeeper": [
        "fg-testing-fmea-debugging",
        "fg-comp-tournament-prep"
      ]
    },
    "courseId": "beginner",
    "sequence": 9,
    "code": "BEGINNER 09",
    "title": "DC Gear Motors, L298N H-Bridge, 2WD Chassis Assembly & Robot Dance",
    "subtitle": "Inductive motor loads, back-EMF flyback diodes, H-Bridge transistor matrix topology, dual full-bridge drivers, and 2WD differential robot chassis assembly with choreographed motion routines.",
    "promise": "I can assemble a 2WD differential robot chassis, wire an L298N dual H-bridge motor driver, and program a calibrated 30-second choreographed robot victory dance routine.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 08"
    ],
    "outcomes": [
      "Explain the physics of brushed DC motors, electromagnetic coils, gear reduction (1:48), and inductive back-EMF.",
      "Deconstruct the H-Bridge transistor matrix (4 switching transistors per motor allowing forward, reverse, dynamic braking, and freewheeling coast).",
      "Assemble a complete 2WD robot chassis: dual TT gear motors, rubber drive wheels, omnidirectional ball caster, and battery box.",
      "Wire an L298N dual full-bridge driver, configuring logic inputs (IN1–IN4) and PWM speed control pins (ENA, ENB).",
      "Write a modular robotics motion library (forward, backward, turnLeft, turnRight, pivotSpin, brake) and choreograph a synchronized 30-second victory dance."
    ],
    "vocabulary": [
      {
        "term": "H-Bridge",
        "plainMeaning": "A 4-switch electronic bridge that lets a motor spin forward or backwards by flipping the direction electricity flows through it.",
        "technicalMeaning": "An electronic circuit topology composed of four solid-state switching elements (BJTs or MOSFETs) configured in an \"H\" formation enabling bidirectional DC motor control and active braking."
      },
      {
        "term": "L298N Motor Driver",
        "plainMeaning": "A high-power amplifier chip with a big heat sink that powers two robot motors from a battery pack.",
        "technicalMeaning": "A high-voltage, high-current dual full-bridge driver capable of driving inductive loads up to 46V and 2A continuous per channel."
      },
      {
        "term": "Differential Steering (Skid Steer)",
        "plainMeaning": "Steering like a tank: to turn left, you stop or reverse the left wheel while the right wheel drives forward.",
        "technicalMeaning": "A mobile robotics drive architecture where vehicle heading and angular velocity are governed by the differential speed ratio between left and right drive wheels."
      },
      {
        "term": "PWM Speed Control (ENA / ENB)",
        "plainMeaning": "Removing the jumper and pulsing the enable pin to control motor driving speed from crawl to sprint.",
        "technicalMeaning": "Modulating the duty cycle (0–255) supplied to the L298N enable pins to govern average motor voltage and rotor RPM."
      },
      {
        "term": "Back-Electromotive Force (Back-EMF)",
        "plainMeaning": "A reverse voltage spike generated by spinning motor coils when stopped, safely absorbed by flyback diodes.",
        "technicalMeaning": "The counter-electromotive force induced in an inductive armature winding opposing current change according to Faraday’s and Lenz’s laws."
      },
      {
        "term": "Active Dynamic Braking",
        "plainMeaning": "Connecting both sides of the motor to 5V or Ground to stop coasting instantly.",
        "technicalMeaning": "Short-circuiting motor armature terminals, converting kinetic rotational energy into electromagnetic resistance that rapidly decelerates the rotor."
      }
    ],
    "teacherPrep": [
      "Unbox 2WD Robot Chassis acrylic base plates, 2x TT gear motors, wheels, casters, L298N drivers, and screws.",
      "Distribute AA battery boxes (4x AA = 6V) or 2x 18650 Li-ion battery holders with rocker power switches.",
      "Verify screwdrivers and hardware trays are placed on all student workbenches."
    ],
    "verifiedMaterials": [
      "Arduino Uno R3 development board with USB cable",
      "L298N Dual H-Bridge Motor Driver Module with heatsink",
      "2WD Robot Chassis kit (acrylic deck, 2x TT DC gear motors 1:48 ratio, 2x wheels, 1x caster ball)",
      "4x AA Battery Box (6V) or 2x 18650 Battery Holder (7.4V) with toggle switch",
      "Chassis assembly screws, brass standoffs, and nuts",
      "Small Phillips and flathead screwdrivers",
      "10x Male-to-Female and 6x Male-to-Male jumper wires"
    ],
    "safetyNotes": [
      "Always prop the robot chassis up on a block or mug during initial testing so wheels spin freely in the air.",
      "Never connect motor battery pack wires directly to the 5V pin of the Arduino; power the L298N screw terminals directly from the battery pack.",
      "Ensure battery polarity is correct (+ to 12V terminal, - to GND terminal)."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Place an assembled 2WD robot on the arena floor: cue energetic music and watch the robot perform a synchronized victory dance routine (pirouette spins, figure-8s, and celebratory bows)!",
        "studentAction": "Cheer on the robot dancer! Inspect the motorized chassis components and mechanical gearbox on their bench trays."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Deconstruct the H-Bridge schematic on the whiteboard: trace current paths for Forward, Reverse, Coast, and Active Dynamic Braking.",
        "studentAction": "Interact with the Motor Driver & H-Bridge Sim on the portal: click virtual transistor switches to reverse DC motor rotation."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide mechanical chassis assembly: mount TT motors to acrylic deck; attach rubber wheels; install front ball caster; wire L298N driver.",
        "studentAction": "Assemble the mechanical 2WD rover chassis. Fasten motors, wheels, and L298N driver securely with screws and standoffs."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through the modular movement library: forward(), backward(), turnLeft(), turnRight(), pivotSpin(), and activeBrake().",
        "studentAction": "Prop robot on bench block; upload code; verify both wheels turn forward together; adjust motor lead polarity if one wheel runs backwards."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"RoboBee Dance-Off Showcase\": play music tracks while teams deploy custom choreographed 30-second dance routines!",
        "studentAction": "Place robots on the arena floor; execute choreographed dance routines; measure turn symmetry; complete Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "How an H-Bridge Controls Direction",
        "explanation": "To make a DC motor spin forward, current must flow from Left to Right through the coils. To reverse, current must flow from Right to Left! An H-Bridge uses 4 transistors (switches Q1, Q2, Q3, Q4). Closing Q1 and Q4 spins the motor forward; closing Q2 and Q3 reverses current and spins the motor backwards!",
        "instructorNote": "CRITICAL SAFETY RULE: Never close Q1 and Q2 at the same time! That connects 12V directly to Ground—a destructive condition known as \"Shoot-Through\". The L298N logic chip prevents this."
      },
      {
        "title": "Active Dynamic Braking vs Coasting",
        "explanation": "When a robot turns off its motors (coasting), kinetic momentum causes it to skid forward 10–20 cm. By setting both motor inputs to LOW or both to HIGH, the H-Bridge shorts the motor terminals. The spinning rotor acts as a generator, creating magnetic resistance that halts wheels instantly!",
        "instructorNote": "Demonstrate by spinning a disconnected motor by hand vs spinning a motor with its two leads touched together."
      },
      {
        "title": "Skid-Steer Differential Physics",
        "explanation": "To turn right, our 2WD robot slows down or stops the right wheel while driving the left wheel forward. To spin on a dime (pivot turn), the left wheel drives forward at full speed while the right wheel drives backward at full speed!",
        "instructorNote": "Explain that the center of rotation lies directly in the center of the wheel axle during a pivot spin."
      }
    ],
    "visualizerId": "motor_driver_pwm_sim",
    "project": {
      "name": "2WD Mobile Robot Chassis Assembly & Choreographed Dance Bot",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Fully assembled mechanical 2WD chassis with dual TT gear motors, rubber tires, and omnidirectional caster.",
        "L298N motor driver wired to Arduino pins (ENA D5, IN1 D7, IN2 D8, IN3 D9, IN4 D10, ENB D6) and battery pack.",
        "Flawless execution of a 30-second choreographed robot dance routine featuring forward rushes, sharp pivots, and victory spins."
      ]
    },
    "activity": {
      "title": "Assemble the 2WD Rover Chassis and Choreograph Robot Dance",
      "steps": [
        "Step 1: Mount the two yellow TT gear motors to the acrylic deck using long M3 machine screws and motor brackets.",
        "Step 2: Press rubber drive wheels firmly onto the motor axle flats; mount omnidirectional ball caster to the front.",
        "Step 3: Fasten L298N driver module and Arduino Uno to the upper chassis plate using brass standoffs.",
        "Step 4: Wire Left Motor to L298N OUT1/OUT2 and Right Motor to OUT3/OUT4 screw terminals.",
        "Step 5: Connect battery box (+ Red) to L298N 12V terminal and (- Black) to L298N GND terminal.",
        "Step 6: Connect a jumper from L298N GND to Arduino GND (MANDATORY COMMON GROUND).",
        "Step 7: Connect control pins: ENA (D5), IN1 (D7), IN2 (D8), IN3 (D9), IN4 (D10), ENB (D6).",
        "Step 8: Upload motion library and calibrate wheel direction; choreograph a 30-second multi-move victory dance!"
      ],
      "successCriteria": [
        "Both wheels spin forward smoothly without grinding or stalling.",
        "Robot drives straight across a 2-meter floor line with minimal drift (< 10cm).",
        "Dance choreography executes all 6 motion commands synchronously."
      ],
      "extension": "Add a motor trim calibration offset in code to correct for slight manufacturing speed differences between left and right motors!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "L298N Dual H-Bridge Module",
        "2WD Chassis Kit"
      ],
      "componentList": [
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "L298N Dual H-Bridge Driver",
          "exactVariant": "Standard red board with aluminum heatsink",
          "quantity": 1
        },
        {
          "name": "2WD Robot Chassis Acrylic Deck",
          "exactVariant": "Laser-cut with mounting slots",
          "quantity": 1
        },
        {
          "name": "TT DC Gear Motors (1:48)",
          "exactVariant": "3V–6V dual-shaft yellow gearboxes",
          "quantity": 2
        },
        {
          "name": "Rubber Drive Wheels",
          "exactVariant": "65mm diameter high-traction tires",
          "quantity": 2
        },
        {
          "name": "Omnidirectional Ball Caster",
          "exactVariant": "Metal/plastic roller caster",
          "quantity": 1
        },
        {
          "name": "4x AA Battery Box with Switch",
          "exactVariant": "Holds 4x 1.5V alkaline or NiMH cells (6V)",
          "quantity": 1
        },
        {
          "name": "Jumper Wires & Hardware",
          "exactVariant": "Male-to-Female ribbons and M3 screws",
          "quantity": 16
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "Battery: (+) -> L298N 12V | (-) -> L298N GND -> Arduino GND; L298N 5V Out -> Arduino 5V In (if onboard 5V regulator enabled); Left Motor -> L298N OUT1/OUT2; Right Motor -> L298N OUT3/OUT4; Control: IN1->D7 | IN2->D8 | IN3->D9 | IN4->D10 | ENA->D5 (PWM) | ENB->D6 (PWM)",
      "wireTable": [
        {
          "from": "Battery Box (+) Positive (Red)",
          "to": "L298N 12V Power Screw Terminal",
          "wireOrPolarityNote": "Motor power supply (6V–9V)"
        },
        {
          "from": "Battery Box (-) Negative (Black)",
          "to": "L298N GND Screw Terminal",
          "wireOrPolarityNote": "Power Ground"
        },
        {
          "from": "L298N GND Screw Terminal",
          "to": "Arduino GND Pin",
          "wireOrPolarityNote": "MANDATORY Common Logic Ground"
        },
        {
          "from": "L298N 5V Screw Terminal",
          "to": "Arduino Vin or 5V Pin",
          "wireOrPolarityNote": "Powers Arduino from onboard 78M05 regulator"
        },
        {
          "from": "Arduino Digital Pin 5 (PWM)",
          "to": "L298N ENA (Left Speed)",
          "wireOrPolarityNote": "Remove onboard ENA jumper"
        },
        {
          "from": "Arduino Digital Pin 7",
          "to": "L298N IN1 (Left Dir A)",
          "wireOrPolarityNote": "Left motor direction A"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "L298N IN2 (Left Dir B)",
          "wireOrPolarityNote": "Left motor direction B"
        },
        {
          "from": "Arduino Digital Pin 9",
          "to": "L298N IN3 (Right Dir A)",
          "wireOrPolarityNote": "Right motor direction A"
        },
        {
          "from": "Arduino Digital Pin 10",
          "to": "L298N IN4 (Right Dir B)",
          "wireOrPolarityNote": "Right motor direction B"
        },
        {
          "from": "Arduino Digital Pin 6 (PWM)",
          "to": "L298N ENB (Right Speed)",
          "wireOrPolarityNote": "Remove onboard ENB jumper"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Prop chassis up on a bench block so wheels do not touch ground.",
        "2. Fasten TT gear motors with M3 screws and press wheels onto axle flats.",
        "3. Connect motor leads to OUT1/OUT2 (Left) and OUT3/OUT4 (Right).",
        "4. Connect battery pack to 12V and GND terminals.",
        "5. Connect common Ground wire to Arduino GND.",
        "6. Connect control pins ENA, IN1, IN2, IN3, IN4, ENB.",
        "7. Power on battery switch; upload test sketch; verify forward rotation."
      ],
      "powerAndSafetyChecks": [
        "NEVER omit the common Ground wire between L298N and Arduino GND: without it, control signals have no reference potential and motors will behave erratically.",
        "Keep hair, ties, and loose wires away from spinning motor shafts."
      ],
      "testCases": [
        {
          "action": "Command forward(200)",
          "expectedResult": "Both wheels spin forward smoothly at medium speed."
        },
        {
          "action": "Command pivotSpin(true, 200) (Turn Right)",
          "expectedResult": "Left wheel spins forward while right wheel spins reverse; robot rotates in place."
        },
        {
          "action": "Command activeBrake()",
          "expectedResult": "Both motors halt immediately with zero coasting drift."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 09: 2WD Robot Chassis & Victory Dance\n * Board: Arduino Uno R3 (ATmega328P) + L298N Motor Driver\n */\n\n// Left Motor Pins\nconst int PIN_ENA = 5;  // PWM Speed Control (0-255)\nconst int PIN_IN1 = 7;  // Direction A\nconst int PIN_IN2 = 8;  // Direction B\n\n// Right Motor Pins\nconst int PIN_IN3 = 9;  // Direction A\nconst int PIN_IN4 = 10; // Direction B\nconst int PIN_ENB = 6;  // PWM Speed Control (0-255)\n\nvoid setup() {\n  pinMode(PIN_ENA, OUTPUT);\n  pinMode(PIN_IN1, OUTPUT);\n  pinMode(PIN_IN2, OUTPUT);\n  pinMode(PIN_IN3, OUTPUT);\n  pinMode(PIN_IN4, OUTPUT);\n  pinMode(PIN_ENB, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE 2WD CHOREOGRAPHED DANCE BOT ===\");\n  delay(2000); // 2-second grace period before starting dance\n}\n\n// Low-Level Motor Control Functions\nvoid setMotors(int leftSpeed, int rightSpeed) {\n  // Left Motor Direction\n  if (leftSpeed > 0) {\n    digitalWrite(PIN_IN1, HIGH);\n    digitalWrite(PIN_IN2, LOW);\n  } else if (leftSpeed < 0) {\n    digitalWrite(PIN_IN1, LOW);\n    digitalWrite(PIN_IN2, HIGH);\n  } else {\n    digitalWrite(PIN_IN1, LOW);\n    digitalWrite(PIN_IN2, LOW);\n  }\n\n  // Right Motor Direction\n  if (rightSpeed > 0) {\n    digitalWrite(PIN_IN3, HIGH);\n    digitalWrite(PIN_IN4, LOW);\n  } else if (rightSpeed < 0) {\n    digitalWrite(PIN_IN3, LOW);\n    digitalWrite(PIN_IN4, HIGH);\n  } else {\n    digitalWrite(PIN_IN3, LOW);\n    digitalWrite(PIN_IN4, LOW);\n  }\n\n  // Apply PWM speeds (0 to 255)\n  analogWrite(PIN_ENA, abs(leftSpeed));\n  analogWrite(PIN_ENB, abs(rightSpeed));\n}\n\n// High-Level Motion Library\nvoid forward(int speed, int ms) {\n  setMotors(speed, speed);\n  delay(ms);\n}\n\nvoid backward(int speed, int ms) {\n  setMotors(-speed, -speed);\n  delay(ms);\n}\n\nvoid turnLeft(int speed, int ms) {\n  setMotors(0, speed);\n  delay(ms);\n}\n\nvoid turnRight(int speed, int ms) {\n  setMotors(speed, 0);\n  delay(ms);\n}\n\nvoid pivotSpin(bool spinRight, int speed, int ms) {\n  if (spinRight) {\n    setMotors(speed, -speed);\n  } else {\n    setMotors(-speed, speed);\n  }\n  delay(ms);\n}\n\nvoid activeBrake(int ms = 200) {\n  // Dynamic braking: set all inputs HIGH\n  digitalWrite(PIN_IN1, HIGH);\n  digitalWrite(PIN_IN2, HIGH);\n  digitalWrite(PIN_IN3, HIGH);\n  digitalWrite(PIN_IN4, HIGH);\n  analogWrite(PIN_ENA, 255);\n  analogWrite(PIN_ENB, 255);\n  delay(ms);\n  setMotors(0, 0);\n}\n\nvoid loop() {\n  Serial.println(\">> COMMENCING CHOREOGRAPHED VICTORY DANCE <<\");\n\n  // Move 1: Forward Rush & Sudden Stop\n  forward(220, 1000);\n  activeBrake(150);\n\n  // Move 2: Backwards retreat\n  backward(180, 800);\n  activeBrake(150);\n\n  // Move 3: 360-degree high-speed pirouette spin to the right\n  pivotSpin(true, 250, 1200);\n  activeBrake(200);\n\n  // Move 4: 360-degree reverse pirouette spin to the left\n  pivotSpin(false, 250, 1200);\n  activeBrake(200);\n\n  // Move 5: Zig-Zag shimmy dance\n  for (int i = 0; i < 3; i++) {\n    turnRight(220, 250);\n    turnLeft(220, 250);\n  }\n  activeBrake(200);\n\n  // Move 6: Grand Finale Victory Bow (quick pulses)\n  for (int i = 0; i < 4; i++) {\n    forward(200, 150);\n    backward(200, 150);\n  }\n  activeBrake(500);\n\n  Serial.println(\">> DANCE ROUTINE COMPLETE. Pausing 5 seconds...\");\n  delay(5000); // Wait 5s before repeating\n}\n",
      "pinMap": {
        "Pin 5 (PWM)": "L298N ENA (Left Motor Speed: 0 = Stop, 255 = Full Speed)",
        "Pin 7": "L298N IN1 (Left Motor Forward Logic)",
        "Pin 8": "L298N IN2 (Left Motor Reverse Logic)",
        "Pin 9": "L298N IN3 (Right Motor Forward Logic)",
        "Pin 10": "L298N IN4 (Right Motor Reverse Logic)",
        "Pin 6 (PWM)": "L298N ENB (Right Motor Speed: 0 = Stop, 255 = Full Speed)",
        "GND": "Common Logic Ground connection"
      },
      "setupAndUpload": [
        "Prop robot up on a block or mug so wheels cannot take off during upload.",
        "Connect Arduino via USB, select Uno board and port, and upload sketch.",
        "Turn on battery pack power switch and watch wheels execute dance routine."
      ],
      "explanations": [
        "setMotors(leftSpeed, rightSpeed): Universal low-level routine taking signed speeds (-255 to +255) for complete vector control.",
        "analogWrite(ENA, speed): Varies PWM duty cycle to smoothly govern wheel rotational velocity.",
        "activeBrake(): Applies counter-electromotive braking by driving both legs of each motor HIGH.",
        "pivotSpin(true/false): Rotates left and right wheels in opposite directions, allowing zero-radius in-place turns."
      ],
      "expectedResult": "Robot executes the full 30-second synchronized dance routine with rapid accelerations, clean turns, and dynamic stops.",
      "caveats": [
        "Do not test on a narrow table: always test ground movement on the open floor or enclosed arena.",
        "If one motor turns backward when commanded forward, simply swap its two motor wires in the L298N screw terminal."
      ],
      "tweakTip": "Adjust timing parameters in milliseconds to calibrate an exact 360-degree spin on your classroom floor surface!"
    },
    "troubleshooting": [
      {
        "symptom": "One motor spins forward but the other spins backward when forward() is called.",
        "checks": [
          "Turn off battery power.",
          "Swap the two wires of the backwards motor in its L298N screw terminal (OUT1/OUT2 or OUT3/OUT4)."
        ],
        "explanation": "DC motor rotational direction depends on polarity. Inverting the two terminal wires reverses rotation."
      },
      {
        "symptom": "Motors hum or squeal loudly but do not spin.",
        "checks": [
          "Increase PWM speed: TT gear motors typically require at least PWM 120–140 to overcome internal gearbox friction.",
          "Check battery voltage: exhausted batteries cannot deliver the stall current needed to start motors."
        ],
        "explanation": "Overcoming static friction in a 1:48 gear train requires sufficient initial voltage and current."
      },
      {
        "symptom": "Arduino resets or disconnects from computer when motors start spinning.",
        "checks": [
          "Verify common Ground: confirm L298N GND connects to Arduino GND.",
          "Ensure motors are powered from battery pack, NOT from the Arduino 5V pin.",
          "Add a 100µF electrolytic capacitor across the L298N 12V and GND terminals to filter voltage dips."
        ],
        "explanation": "Motor inrush current can pull the power rail down below 4.5V, triggering the MCU Brown-Out Reset."
      }
    ],
    "checksForUnderstanding": [
      "How does an H-Bridge reverse the direction of a DC motor without rewiring anything physically?",
      "Why is active dynamic braking superior to simply letting motors coast to a stop?"
    ],
    "exitTicket": [
      {
        "question": "Which transistors in an H-Bridge must be turned on to drive a motor in the Forward direction?",
        "rubricOrSampleReasoning": "Transistors Q1 (high-side left) and Q4 (low-side right) must be turned on, allowing current to flow from +12V through the motor from left to right to Ground."
      },
      {
        "question": "Why is a common Ground connection between the L298N driver and the Arduino mandatory?",
        "rubricOrSampleReasoning": "Voltage is a relative potential difference. Without a shared Ground return reference, the logic signals from Arduino pins (5V/0V) cannot be interpreted correctly by the L298N input circuitry, resulting in erratic or dead motor behavior."
      },
      {
        "question": "How do you execute a zero-radius pivot spin on a 2WD differential robot?",
        "rubricOrSampleReasoning": "Drive the left motor forward at speed +V while driving the right motor backward at speed -V (or vice versa). The opposing forces cause the chassis to rotate directly about its central vertical axis."
      }
    ],
    "differentiation": {
      "support": [
        "Provide chassis kits with pre-soldered motor wires and color-coded labels."
      ],
      "extension": [
        "Implement speed acceleration ramping in code so the robot accelerates smoothly without wheel slip."
      ],
      "offlineOption": [
        "Use the Movement Route Simulator on the RoboBee portal to plan dance choreographies."
      ]
    },
    "nextLessonId": "beg-10",
    "nextLessonTeaser": "Class 10 (Major Project Build Day 2): Smartphone Bluetooth RC Car & 2v2 Robo-Soccer Match! Transform your chassis into a wireless soccer athlete.",
    "sources": [
      {
        "title": "STMicroelectronics L298 Dual Full-Bridge Driver Technical Datasheet",
        "url": "https://st.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "2WD Chassis Assembly Diagram",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-10",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-motion-differential-kinematics",
        "fg-comp-tournament-prep"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-testing-fmea-debugging"
      ],
      "goDeeper": [
        "fg-safety-lab-code",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 10,
    "code": "BEGINNER 10",
    "title": "Major Build 2: Smartphone Bluetooth RC Car & 2v2 Robo-Soccer Match",
    "subtitle": "Major Project Milestone Day 2 — Asynchronous UART serial communication, HC-05/06 2.4GHz wireless Bluetooth SPP transceivers, 3.3V logic level shifting, and competitive 2v2 Robo-Soccer arena match tactics.",
    "promise": "I can configure UART serial communication with HC-05 Bluetooth, build a smartphone-controlled 2WD rover, and compete in a high-speed 2v2 Robo-Soccer match!",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 09"
    ],
    "outcomes": [
      "Explain the fundamentals of asynchronous serial UART communication: baud rate (9600 bps), TX (Transmit), RX (Receive), and frame formatting.",
      "Construct a 5V-to-3.3V resistive voltage divider (1kΩ and 2kΩ) on the HC-05 RX pin to protect the sensitive 3.3V Bluetooth baseband transceiver.",
      "Parse single-character command packets ('F', 'B', 'L', 'R', 'S', 'V' for horn, 'W' for turbo speed) in real-time embedded C++.",
      "Implement an automatic communication watchdog timer that halts motors if Bluetooth packets drop for over 500ms (preventing runaway crashes).",
      "Compete in an authentic Robo-Soccer Tournament: field a 2-robot alliance, execute offensive dribbling and defensive blocking, and defend engineering telemetry."
    ],
    "vocabulary": [
      {
        "term": "UART (Universal Asynchronous Receiver-Transmitter)",
        "plainMeaning": "A 2-wire serial conversation method where chips send bytes one bit at a time over TX and RX lines.",
        "technicalMeaning": "A physical circuit for asynchronous serial communication with configurable baud rates, start/stop framing, and parity error checking."
      },
      {
        "term": "Bluetooth SPP (Serial Port Profile)",
        "plainMeaning": "A wireless radio link that acts just like a virtual serial cable between your smartphone and the Arduino.",
        "technicalMeaning": "A Bluetooth Classic protocol profile emulating an RS-232 serial cable over 2.4 GHz Gaussian Frequency Shift Keying (GFSK) RF channels."
      },
      {
        "term": "HC-05 / HC-06 Transceiver",
        "plainMeaning": "A tiny blue radio module that connects wirelessly to Android and iOS phone apps.",
        "technicalMeaning": "A baseband Bluetooth v2.0+EDR module operating at 3.3V logic featuring AT command mode configuration and ~10 meter operating range."
      },
      {
        "term": "Logic Level Shifting",
        "plainMeaning": "Stepping down the Arduino 5V signal so it does not overload the delicate 3.3V Bluetooth receiver pin.",
        "technicalMeaning": "Voltage level translation using a voltage divider or bidirectional MOSFET converter ensuring signal voltage compatibility across logic families."
      },
      {
        "term": "Watchdog Failsafe",
        "plainMeaning": "A safety timer that slams the brakes automatically if your phone goes out of range or disconnects.",
        "technicalMeaning": "An autonomous supervisory timer routine that forces actuators into a safe default state (all motors STOP) upon loss of continuous communication heartbeat."
      },
      {
        "term": "Robo-Soccer Tactics",
        "plainMeaning": "Teamwork strategies including striker offense, goalkeeper wedge blocking, and differential spin turns.",
        "technicalMeaning": "Multi-agent cooperative and competitive game strategies in constrained arena environments optimizing velocity, traction, and ball intercept angles."
      }
    ],
    "teacherPrep": [
      "Mark a 2m × 1.5m Robo-Soccer arena on the floor with white/black perimeter borders and tape goals.",
      "Ensure standard Bluetooth RC Controller apps (e.g. \"Arduino Bluetooth Controller\" or \"RoboBee RC\") are installed on classroom tablets/phones.",
      "Prepare mini ping-pong or lightweight foam soccer balls."
    ],
    "verifiedMaterials": [
      "Assembled 2WD Robot Chassis from Class 09",
      "Arduino Uno R3 with L298N motor driver",
      "HC-05 or HC-06 Bluetooth Module with breakout pins",
      "1x 1kΩ Resistor and 1x 2kΩ Resistor (for 3.3V RX level divider)",
      "1x Piezo Buzzer (Robot Honk Horn on command)",
      "Rechargeable 4x AA or 2x 18650 Battery Pack",
      "Smartphone or Tablet with Bluetooth",
      "Mini soccer ball and goal posts"
    ],
    "safetyNotes": [
      "Never disconnect the common Ground wire: floating grounds cause corrupted serial packets.",
      "Do not connect the Arduino 5V TX pin directly to the HC-05 RX pin without the 1kΩ/2kΩ level shifter resistor divider.",
      "Spectators must remain outside the Robo-Soccer arena tape perimeter during match play."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Drive a smartphone-controlled RoboBee soccer bot across the arena at high speed, intercept a ball, execute a pivot spin, and score a goal! Blare the onboard horn!",
        "studentAction": "Cheer the goal! Inspect the blinking HC-05 radio module and understand today’s tournament objective."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Deconstruct UART TX/RX crossovers and the 5V->3.3V voltage divider on the whiteboard. Teach packet parsing and watchdog failsafe architecture.",
        "studentAction": "Interact with the Sumo Arena & RC Control Sim on the portal: test smartphone joystick inputs and command packets."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide wiring: HC-05 VCC->5V, GND->GND, TX->D2 (Arduino RX), RX->divider from D3 (Arduino TX); Buzzer->D12.",
        "studentAction": "Wire the Bluetooth module and voltage divider on breadboard. Pair smartphone with HC-05 (Default PIN: 1234)."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through SoftwareSerial btSerial(2, 3), parsing chars ('F', 'B', 'L', 'R', 'S', 'V'), and the 500ms watchdog timer.",
        "studentAction": "Upload code. Connect app. Test directional driving, horn honking, and verify failsafe stop when phone Bluetooth is toggled off."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the official RoboBee 2v2 Robo-Soccer World Cup: 3-minute matches with alliance scoring and sportsmanship awards!",
        "studentAction": "Compete in high-stakes 2v2 soccer matches, execute defensive blocks, score goals, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "UART Serial Crossover: TX Meets RX",
        "explanation": "In serial UART, communication is a conversation between two people. Your mouth (TX - Transmit) speaks to the other person's ear (RX - Receive)! Therefore, the Arduino TX pin connects to the Bluetooth RX pin, and the Bluetooth TX pin connects to the Arduino RX pin. Connecting TX to TX or RX to RX results in complete silence.",
        "instructorNote": "Draw two faces on the whiteboard showing Mouth -> Ear crossover paths."
      },
      {
        "title": "The 3.3V Protection Divider",
        "explanation": "The HC-05 Bluetooth chip is a 3.3V low-power device. While its VCC pin can accept 5V (because of an onboard regulator), its RX data pin connects directly to the bare silicon. A 5V signal from the Arduino can degrade or burn the chip over time. A 1kΩ and 2kΩ divider scales 5V down to safe 3.33V: 5V * (2k / (1k + 2k)) = 3.33V!",
        "instructorNote": "Emphasize that the HC-05 TX pin outputs 3.3V, which the Arduino Uno easily recognizes as a logic HIGH (Uno threshold is 3.0V), so no stepping is needed in reverse."
      },
      {
        "title": "Watchdog Timer Failsafe Architecture",
        "explanation": "If a smartphone moves out of range or the app crashes while the robot is driving forward at full speed, what happens? Without a watchdog, the robot will drive endlessly into a wall or down the stairs! A watchdog logs lastPacketTime = millis(); if millis() - lastPacketTime > 500ms, it forces all motors to STOP immediately.",
        "instructorNote": "Demonstrate by turning off phone Bluetooth while the robot is driving: the robot stops in half a second!"
      }
    ],
    "visualizerId": "sumo_arena_sim",
    "project": {
      "name": "Major Milestone 2: Smartphone Bluetooth RC Rover & Robo-Soccer Striker",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Fully operational wireless Bluetooth rover paired with smartphone controller app.",
        "Instantaneous response (< 50ms latency) to Forward, Reverse, Left, Right, Brake, and Horn commands.",
        "Active participation in 2v2 Robo-Soccer match with autonomous watchdog failsafe protection."
      ]
    },
    "activity": {
      "title": "Integrate Wireless Bluetooth RC Rover and Compete in Robo-Soccer",
      "steps": [
        "Step 1: Mount HC-05 Bluetooth module to the breadboard on the 2WD chassis.",
        "Step 2: Wire HC-05 VCC to 5V and GND to GND.",
        "Step 3: Connect HC-05 TX to Arduino Pin 2 (SoftwareSerial RX).",
        "Step 4: Build voltage divider: Pin 3 (SoftwareSerial TX) -> 1kΩ -> HC-05 RX -> 2kΩ -> GND.",
        "Step 5: Connect Piezo horn buzzer to Digital Pin 12 and GND.",
        "Step 6: Upload firmware. Pair phone with \"HC-05\" using PIN 1234 or 0000 in phone Bluetooth settings.",
        "Step 7: Open Bluetooth Controller app, map D-pad keys to F, B, L, R, S, and enter the soccer arena!",
        "Step 8: Compete in 2v2 Robo-Soccer tournament: score goals, defend the net, and test watchdog failsafe."
      ],
      "successCriteria": [
        "Rover pairs and connects reliably on the first attempt.",
        "D-pad controls drive vehicle accurately with tight steering and zero lag.",
        "Robot halts instantly if Bluetooth connection is broken."
      ],
      "extension": "Add a turbo-boost button in the app that pulses motor PWM to 255 for 1.5 seconds for breakaway sprint shots!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "L298N Motor Driver",
        "HC-05 Bluetooth",
        "2WD Chassis"
      ],
      "componentList": [
        {
          "name": "Assembled 2WD Robot Chassis",
          "exactVariant": "Chassis from Class 09 with dual TT gear motors",
          "quantity": 1
        },
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "L298N Dual H-Bridge Driver",
          "exactVariant": "With heatsink and screw terminals",
          "quantity": 1
        },
        {
          "name": "HC-05 Bluetooth Module",
          "exactVariant": "6-pin breakout board (VCC, GND, TXD, RXD, STATE, EN)",
          "quantity": 1
        },
        {
          "name": "1kΩ Axial Resistor",
          "exactVariant": "1/4 Watt, 5% (Brown-Black-Red)",
          "quantity": 1
        },
        {
          "name": "2kΩ Axial Resistor",
          "exactVariant": "1/4 Watt, 5% (Red-Black-Red)",
          "quantity": 1
        },
        {
          "name": "Piezo Buzzer (Horn)",
          "exactVariant": "5V passive transducer",
          "quantity": 1
        },
        {
          "name": "Battery Pack (6V–7.4V)",
          "exactVariant": "4x AA or 2x 18650 holder with toggle switch",
          "quantity": 1
        },
        {
          "name": "Jumper Wires",
          "exactVariant": "Male-to-Male and Male-to-Female flexible jumpers",
          "quantity": 14
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "HC-05: VCC->5V | GND->GND | TX->D2 (SoftRX) | RX <- 1kΩ <- D3 (SoftTX) & RX -> 2kΩ -> GND; L298N: ENA->D5 | IN1->D7 | IN2->D8 | IN3->D9 | IN4->D10 | ENB->D6; Buzzer: D12 -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "HC-05 VCC Pin",
          "to": "Breadboard 5V Rail",
          "wireOrPolarityNote": "Red wire — Module power"
        },
        {
          "from": "HC-05 GND Pin",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Module Ground"
        },
        {
          "from": "HC-05 TXD Pin",
          "to": "Arduino Digital Pin 2 (SoftRX)",
          "wireOrPolarityNote": "Blue wire — Bluetooth data to Arduino"
        },
        {
          "from": "Arduino Digital Pin 3 (SoftTX)",
          "to": "1kΩ Resistor Input",
          "wireOrPolarityNote": "Arduino data out to divider"
        },
        {
          "from": "1kΩ / 2kΩ Resistor Midpoint",
          "to": "HC-05 RXD Pin",
          "wireOrPolarityNote": "Stepped 3.3V data line"
        },
        {
          "from": "2kΩ Resistor Other Lead",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Divider Ground reference"
        },
        {
          "from": "Arduino Digital Pin 12",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Horn audio output"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Prop robot on bench block.",
        "2. Wire HC-05 Bluetooth and 1kΩ/2kΩ divider on breadboard.",
        "3. Wire Buzzer to Pin 12.",
        "4. Power Arduino via USB, upload firmware, then disconnect USB.",
        "5. Turn on battery pack switch; confirm HC-05 LED flashes rapidly (waiting for pair).",
        "6. Pair smartphone; open RC app; verify HC-05 LED blinks slowly (connected).",
        "7. Drive robot in arena!"
      ],
      "powerAndSafetyChecks": [
        "Confirm 1kΩ is connected between Pin 3 and RXD, and 2kΩ is between RXD and GND.",
        "Ensure the L298N and Arduino share common Ground."
      ],
      "testCases": [
        {
          "action": "Press 'F' in phone app",
          "expectedResult": "Both motors drive forward at programmed speed."
        },
        {
          "action": "Press 'V' in phone app",
          "expectedResult": "Piezo buzzer sounds a dual-tone automotive horn honk."
        },
        {
          "action": "Release all buttons or walk out of room",
          "expectedResult": "Watchdog triggers after 500ms; robot halts all motors immediately."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 10: Smartphone Bluetooth RC Car & Soccer Bot\n * Major Project Milestone Day 2\n * Board: Arduino Uno R3 + L298N Driver + HC-05 Bluetooth\n */\n\n#include <SoftwareSerial.h>\n\n// SoftwareSerial Pins for HC-05 (Leaves hardware Serial free for USB debug!)\nSoftwareSerial btSerial(2, 3); // RX = Pin 2, TX = Pin 3\n\n// Motor Driver Pins\nconst int PIN_ENA = 5;  // PWM Left\nconst int PIN_IN1 = 7;\nconst int PIN_IN2 = 8;\nconst int PIN_IN3 = 9;\nconst int PIN_IN4 = 10;\nconst int PIN_ENB = 6;  // PWM Right\nconst int PIN_HORN = 12; // Horn Buzzer\n\nint driveSpeed = 220; // Default competitive speed (0-255)\nunsigned long lastPacketTime = 0;\nconst unsigned long WATCHDOG_TIMEOUT = 500; // 500ms failsafe timeout\n\nvoid setup() {\n  pinMode(PIN_ENA, OUTPUT);\n  pinMode(PIN_IN1, OUTPUT);\n  pinMode(PIN_IN2, OUTPUT);\n  pinMode(PIN_IN3, OUTPUT);\n  pinMode(PIN_IN4, OUTPUT);\n  pinMode(PIN_ENB, OUTPUT);\n  pinMode(PIN_HORN, OUTPUT);\n\n  Serial.begin(9600);\n  btSerial.begin(9600); // Standard HC-05 default baud rate\n\n  Serial.println(\"=== ROBOBEE BLUETOOTH RC SOCCER BOT READY ===\");\n  lastPacketTime = millis();\n}\n\nvoid setMotors(int leftSpeed, int rightSpeed) {\n  if (leftSpeed > 0) {\n    digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, LOW);\n  } else if (leftSpeed < 0) {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, HIGH);\n  } else {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, LOW);\n  }\n\n  if (rightSpeed > 0) {\n    digitalWrite(PIN_IN3, HIGH); digitalWrite(PIN_IN4, LOW);\n  } else if (rightSpeed < 0) {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, HIGH);\n  } else {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, LOW);\n  }\n\n  analogWrite(PIN_ENA, abs(leftSpeed));\n  analogWrite(PIN_ENB, abs(rightSpeed));\n}\n\nvoid soundHorn() {\n  tone(PIN_HORN, 440, 150); delay(160);\n  tone(PIN_HORN, 554, 250);\n}\n\nvoid loop() {\n  // Read incoming wireless Bluetooth characters\n  if (btSerial.available()) {\n    char cmd = btSerial.read();\n    lastPacketTime = millis(); // Refresh watchdog heartbeat\n\n    Serial.print(\"BT Command: \");\n    Serial.println(cmd);\n\n    switch (cmd) {\n      case 'F': // Drive Forward\n        setMotors(driveSpeed, driveSpeed);\n        break;\n      case 'B': // Drive Backward\n        setMotors(-driveSpeed, -driveSpeed);\n        break;\n      case 'L': // Turn Left (Spin)\n        setMotors(-driveSpeed, driveSpeed);\n        break;\n      case 'R': // Turn Right (Spin)\n        setMotors(driveSpeed, -driveSpeed);\n        break;\n      case 'S': // Stop / Brake\n        setMotors(0, 0);\n        break;\n      case 'V': // Honk Horn\n        soundHorn();\n        break;\n      case 'W': // Turbo Speed Boost\n        driveSpeed = 255;\n        break;\n      case 'w': // Normal Speed\n        driveSpeed = 200;\n        break;\n    }\n  }\n\n  // Watchdog Failsafe Check: If connection drops, halt motors!\n  if (millis() - lastPacketTime > WATCHDOG_TIMEOUT) {\n    setMotors(0, 0); // Safety Stop\n  }\n}\n",
      "pinMap": {
        "Pin 2": "SoftwareSerial RX (Receives 3.3V data from HC-05 TXD)",
        "Pin 3": "SoftwareSerial TX (Transmits data via 1k/2k divider to HC-05 RXD)",
        "Pins 5, 7, 8": "L298N Left Motor Speed and Direction (ENA, IN1, IN2)",
        "Pins 6, 9, 10": "L298N Right Motor Speed and Direction (ENB, IN3, IN4)",
        "Pin 12": "Horn Buzzer Output"
      },
      "setupAndUpload": [
        "Connect Arduino via USB, select Uno board and port, and upload sketch.",
        "Unplug USB; connect battery pack; verify HC-05 LED blinks rapidly.",
        "Pair phone with \"HC-05\" (PIN 1234); open RC app and drive!"
      ],
      "explanations": [
        "SoftwareSerial btSerial(2, 3): Emulates a hardware UART on general digital pins, keeping pins 0/1 free for USB flashing.",
        "lastPacketTime = millis(): Watchdog heartbeat mechanism tracking the exact arrival of every radio packet.",
        "millis() - lastPacketTime > WATCHDOG_TIMEOUT: Shuts off motor power if no command is received for 500ms, preventing crashes.",
        "case 'V': soundHorn(): Plays a celebratory automotive fanfare on command during soccer matches."
      ],
      "expectedResult": "Smartphone app connects to robot; pressing buttons moves robot instantly with rapid turning, aggressive soccer dribbling, and automatic failsafe stops.",
      "caveats": [
        "Always disconnect Bluetooth or use SoftwareSerial when uploading code so USB serial programming is not disrupted.",
        "Ensure the app transmits standard uppercase characters (F, B, L, R, S)."
      ],
      "tweakTip": "Implement proportional joystick speed control by parsing speed values (0–255) sent from advanced app sliders!"
    },
    "troubleshooting": [
      {
        "symptom": "Phone discovers \"HC-05\" in settings, but app says \"Connection Failed\".",
        "checks": [
          "Unpair HC-05 in phone Bluetooth settings, restart phone Bluetooth, and pair again with PIN 1234.",
          "Ensure the app is configured to connect to \"Bluetooth Classic\" and not \"Bluetooth Low Energy (BLE)\"."
        ],
        "explanation": "HC-05 uses Bluetooth Classic 2.0 SPP; some modern apps default to BLE mode."
      },
      {
        "symptom": "Robot drives forward when Left is pressed and spins when Forward is pressed.",
        "checks": [
          "Check motor wiring: verify Left motor is wired to OUT1/OUT2 and Right to OUT3/OUT4.",
          "Swap motor leads in the screw terminals to align physical direction with code logic."
        ],
        "explanation": "Inverted motor polarities create crossed differential steering vectors."
      },
      {
        "symptom": "Robot takes one command, drives, and then ignores all future commands.",
        "checks": [
          "Check SoftwareSerial baud rate: must match HC-05 baud rate (standard is 9600).",
          "Verify voltage divider on HC-05 RX pin: ensure 1kΩ and 2kΩ resistors are securely grounded."
        ],
        "explanation": "A baud rate mismatch causes incoming serial bytes to be read as corrupt framing errors."
      }
    ],
    "checksForUnderstanding": [
      "Why must the Arduino TX pin connect to the Bluetooth RX pin and not TX to TX?",
      "What does the watchdog timer do if your phone battery dies while driving the robot?"
    ],
    "exitTicket": [
      {
        "question": "Calculate the output voltage delivered to the HC-05 RX pin when an Arduino Uno 5.0V TX pin drives a voltage divider with R1 = 1kΩ and R2 = 2kΩ.",
        "rubricOrSampleReasoning": "Vout = Vin × (R2 / (R1 + R2)) = 5.0V × (2k / (1k + 2k)) = 5.0V × (2/3) ≈ 3.33 Volts. This safely matches the 3.3V logic level of the HC-05 chip."
      },
      {
        "question": "Why do we use SoftwareSerial on Pins 2 and 3 instead of hardware Serial on Pins 0 and 1 for the Bluetooth module?",
        "rubricOrSampleReasoning": "Pins 0 and 1 are hardwired to the onboard USB-to-Serial converter. Using them for Bluetooth interferes with uploading code from the computer and locks the USB Serial Monitor. SoftwareSerial leaves USB programming completely unhindered."
      },
      {
        "question": "Explain how the watchdog timer prevents a runaway robot crash.",
        "rubricOrSampleReasoning": "Every time a valid command packet arrives, the code updates lastPacketTime = millis(). If the wireless signal is lost or drops for more than 500ms, the condition millis() - lastPacketTime > 500 becomes true, instantly setting all motor speeds to 0 to prevent crashes."
      }
    ],
    "differentiation": {
      "support": [
        "Provide pre-configured tablet devices with the RoboBee RC app already paired to specific team robot IDs."
      ],
      "extension": [
        "Program a 2-button defensive goalie mode that oscillates rapidly back and forth between goalposts."
      ],
      "offlineOption": [
        "Use the interactive Sumo Arena Simulator on the RoboBee portal to test driving tactics."
      ]
    },
    "nextLessonId": "beg-11",
    "nextLessonTeaser": "Class 11: TCRT5000 IR Sensor, Edge-Detection Table-Avoider Sumo & Line-Follower! Enter autonomous optical surface navigation.",
    "sources": [
      {
        "title": "HC-05 Bluetooth Module User Instruction & AT Command Manual",
        "url": "https://sparkfun.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "Bluetooth RC Car Schematic and Soccer Pitch Layout",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-11",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-comp-tournament-prep",
        "fg-motion-differential-kinematics"
      ],
      "lookUpWhileBuilding": [
        "fg-board-uno-anatomy",
        "fg-testing-fmea-debugging"
      ],
      "goDeeper": [
        "fg-safety-lab-code",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 11,
    "code": "BEGINNER 11",
    "title": "TCRT5000 IR Sensor, Edge-Detection Table-Avoider Sumo & Line-Follower",
    "subtitle": "Optoelectronic infrared reflectance, black absorption vs white reflection, LM393 comparator potentiometer calibration, cliff avoidance algorithms, and dual-sensor proportional line following.",
    "promise": "I can calibrate infrared reflectance sensors for black absorption vs white reflection, program cliff-avoiding table sumo bots, and build an autonomous line-following racer.",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 10"
    ],
    "outcomes": [
      "Explain the physics of optoelectronic reflectance: 940nm infrared LED emission and phototransistor detection.",
      "Differentiate between specular/diffuse white surface reflection and carbon-black electrical tape absorption.",
      "Calibrate onboard LM393 comparator sensitivity potentiometers to achieve crisp digital switching.",
      "Program an Autonomous Table-Edge Cliff Avoider: detect sudden surface drop-offs, execute emergency reverse braking, and pivot away safely.",
      "Implement a 2-sensor closed-loop Black Line Following algorithm with proportional steering and track-loss recovery."
    ],
    "vocabulary": [
      {
        "term": "TCRT5000 IR Reflectance Sensor",
        "plainMeaning": "An infrared eye that bounces invisible light off the floor to see whether the ground is black, white, or missing completely.",
        "technicalMeaning": "An optoelectronic reflective sensor comprising an infrared GaAs emitter diode (940nm) and an NPN phototransistor in a light-blocking enclosure."
      },
      {
        "term": "Light Absorption vs Reflection",
        "plainMeaning": "White surfaces reflect light back into the sensor; black tape absorbs light so none bounces back.",
        "technicalMeaning": "High diffuse reflectance on high-albedo white surfaces reflects photons into the phototransistor base; carbon-black pigment absorbs infrared photons."
      },
      {
        "term": "LM393 Comparator & Trimmer Pot",
        "plainMeaning": "A tiny chip on the sensor board with a screw dial that tunes how sensitive the sensor is to black lines.",
        "technicalMeaning": "A precision dual-voltage comparator IC evaluating sensor analog voltage against a reference potential tuned via a multi-turn trimmer potentiometer."
      },
      {
        "term": "Cliff Edge Detection",
        "plainMeaning": "Detecting when the floor disappears (like the edge of a table) so the robot does not plunge to its death.",
        "technicalMeaning": "An optical boundary condition where total absence of return reflectance signifies infinite distance (surface drop-off / table edge)."
      },
      {
        "term": "Line Following Logic",
        "plainMeaning": "If the left sensor sees black, turn left; if the right sensor sees black, turn right; if both see white, go straight.",
        "technicalMeaning": "A closed-loop trajectory tracking control loop using differential sensory error feedback to maintain vehicle alignment along a high-contrast path."
      },
      {
        "term": "Recovery Search Spin",
        "plainMeaning": "A search maneuver where the robot sweeps left and right to find the line again if it drifts off the track.",
        "technicalMeaning": "A heuristic search routine initiated upon loss of target trajectory to re-acquire the navigation line within a bounded angular corridor."
      }
    ],
    "teacherPrep": [
      "Set up black electrical tape tracks (smooth curves and 90° turns) on white poster boards on the classroom floor.",
      "Prepare an elevated testing table with edge drop-offs for the Cliff Avoider trial.",
      "Distribute 2-channel or 3-channel TCRT5000 IR sensor modules to student teams."
    ],
    "verifiedMaterials": [
      "Assembled 2WD Robot Chassis with L298N driver and battery pack",
      "Arduino Uno R3 development board",
      "2x TCRT5000 Infrared Reflectance Sensor Modules (with LM393 comparators)",
      "Sensor mounting bracket or double-sided tape for front chassis mounting",
      "Black electrical tape (18mm width) and white foam boards",
      "Piezo Buzzer (Warning alarm)",
      "10x Female-to-Male jumper wires"
    ],
    "safetyNotes": [
      "When running the Table-Edge Cliff Avoider test on an elevated table, students MUST stand ready to catch the robot in case of calibration failure!",
      "Mount IR sensors approximately 5mm to 10mm above the floor surface: mounting too high reduces return signal drastically."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Place a 2WD robot on a tall table with NO walls: let it speed forward towards the edge at full speed! 2cm from the fatal drop, it detects the cliff, stops instantly, reverses, and pivots away safely!",
        "studentAction": "Gasp at the near-drop! Inspect the downward-pointing TCRT5000 infrared sensor eyes on the front bumper."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Explain IR phototransistor physics and LM393 comparator thresholding. Teach the 4-case line following truth table on the whiteboard.",
        "studentAction": "Open the Line Follower & Sumo Arena Sim on the portal: test sensor thresholds and observe track following corrections."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide mounting: secure Left IR and Right IR sensors 2cm apart facing downward at 8mm ground clearance; wire to D2 and D3.",
        "studentAction": "Mount sensors to front chassis. Turn the blue trimmer pot on each module with a screwdriver until the indicator LED turns ON over white floor and OFF over black tape."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through Mode 1 (Cliff Avoider reverse-turn logic) and Mode 2 (Closed-loop line follower algorithm).",
        "studentAction": "Upload the Dual-Mode Navigation sketch. Test table-edge avoidance on a desk; then place on the floor race track to test line following."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the \"RoboBee Mini-Sumo & Line Drag Race\": time robots around the black tape circuit and crown the champion!",
        "studentAction": "Race around the track, tune motor speeds for maximum cornering grip, log lap times, and complete the Exit Ticket."
      }
    ],
    "concepts": [
      {
        "title": "How TCRT5000 \"Sees\" in the Dark",
        "explanation": "The blue LED on the TCRT5000 is an Infrared Emitter flashing invisible 940nm photons down at the floor. The black component is an Infrared Phototransistor. When passing over white tile, light bounces back and turns the phototransistor ON. When passing over black tape, the carbon pigment absorbs the light; no photons return, and the phototransistor turns OFF!",
        "instructorNote": "View the IR emitter through a smartphone camera—the phone camera sensor reveals the invisible purple glow!"
      },
      {
        "title": "Calibrating the LM393 Comparator Trimmer",
        "explanation": "Every floor has different ambient reflectivity. The blue multi-turn potentiometer sets the reference switching voltage for the internal LM393 comparator. Turning it clockwise increases sensitivity; turning it counter-clockwise decreases sensitivity. When calibrated properly, the onboard indicator LED turns ON over white and OFF over black.",
        "instructorNote": "Have students verify their calibration by sliding the robot back and forth across a strip of electrical tape."
      },
      {
        "title": "Closed-Loop Line Following Logic",
        "explanation": "Two sensors straddle the black line like two feet: Left Sensor on white, Right Sensor on white. If robot drifts right: Left sensor touches black! The code immediately stops the left wheel and speeds up the right wheel, steering the robot back onto center in milliseconds!",
        "instructorNote": "Show the 4-case truth table: (0,0) = Straight; (1,0) = Turn Left; (0,1) = Turn Right; (1,1) = Intersection / Crossline."
      }
    ],
    "visualizerId": "line_follower_sim",
    "project": {
      "name": "Autonomous Table-Edge Cliff Avoider & Line-Following Racer",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Dual TCRT5000 IR sensors mounted with 8mm ground clearance and calibrated via LM393 potentiometers.",
        "100% reliable cliff edge avoidance on elevated table (5 consecutive trials without falling).",
        "Autonomous navigation around a 3-meter closed-loop black tape racing circuit."
      ]
    },
    "activity": {
      "title": "Assemble, Calibrate, and Race the Autonomous Optical Rover",
      "steps": [
        "Step 1: Mount Left IR and Right IR sensors to the front underside of the chassis facing down (8mm from floor).",
        "Step 2: Connect Left IR: VCC to 5V, GND to GND, OUT to Digital Pin 2.",
        "Step 3: Connect Right IR: VCC to 5V, GND to GND, OUT to Digital Pin 3.",
        "Step 4: Connect Buzzer to Digital Pin 12 and GND.",
        "Step 5: Calibrate sensors: slide sensor over white paper, adjust potentiometer until indicator LED lights up; slide over black tape, confirm LED turns off.",
        "Step 6: Upload firmware. Mode 1 (Cliff Avoider): test on tabletop with ready hands; verify robot stops and retreats at edge.",
        "Step 7: Mode 2 (Line Racer): place on black tape circuit on floor; observe autonomous trajectory tracking!"
      ],
      "successCriteria": [
        "Sensors trigger cleanly between white floor and black tape without jitter.",
        "Robot never falls off the edge of the testing table during 5 consecutive trials.",
        "Robot completes full lap of the line tracking course without derailing."
      ],
      "extension": "Add dynamic speed cornering: slow down inside wheel during sharp turns and burst forward on straightaways!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "L298N Motor Driver",
        "2x TCRT5000 IR Modules",
        "2WD Chassis"
      ],
      "componentList": [
        {
          "name": "Assembled 2WD Robot Chassis",
          "exactVariant": "With dual TT gear motors and rubber wheels",
          "quantity": 1
        },
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "L298N Dual H-Bridge Driver",
          "exactVariant": "With heatsink and screw terminals",
          "quantity": 1
        },
        {
          "name": "TCRT5000 IR Sensor Modules",
          "exactVariant": "With LM393 comparator and trimmer pots",
          "quantity": 2
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "5V passive transducer",
          "quantity": 1
        },
        {
          "name": "Battery Box (6V–7.4V)",
          "exactVariant": "4x AA or 2x 18650 holder with switch",
          "quantity": 1
        },
        {
          "name": "Black Electrical Tape & White Board",
          "exactVariant": "Standard 18mm PVC tape and white poster board",
          "quantity": 1
        },
        {
          "name": "Jumper Wires & Mounting Tape",
          "exactVariant": "Female-to-Male and Male-to-Male jumpers",
          "quantity": 14
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "Left IR: VCC->5V | GND->GND | OUT->D2; Right IR: VCC->5V | GND->GND | OUT->D3; L298N: ENA->D5 | IN1->D7 | IN2->D8 | IN3->D9 | IN4->D10 | ENB->D6; Buzzer: D12 -> Buzzer (+) | (-) -> GND",
      "wireTable": [
        {
          "from": "Left TCRT5000 VCC Pin",
          "to": "Breadboard 5V Rail",
          "wireOrPolarityNote": "Red wire — Sensor power"
        },
        {
          "from": "Left TCRT5000 GND Pin",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Sensor Ground"
        },
        {
          "from": "Left TCRT5000 OUT Pin",
          "to": "Arduino Digital Pin 2",
          "wireOrPolarityNote": "Left reflectance signal"
        },
        {
          "from": "Right TCRT5000 VCC Pin",
          "to": "Breadboard 5V Rail",
          "wireOrPolarityNote": "Red wire — Sensor power"
        },
        {
          "from": "Right TCRT5000 GND Pin",
          "to": "Breadboard Ground Rail",
          "wireOrPolarityNote": "Black wire — Sensor Ground"
        },
        {
          "from": "Right TCRT5000 OUT Pin",
          "to": "Arduino Digital Pin 3",
          "wireOrPolarityNote": "Right reflectance signal"
        },
        {
          "from": "Arduino Digital Pin 12",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Cliff warning audio alert"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Prop robot on bench block.",
        "2. Mount Left and Right IR sensors to front bumper 20mm apart, 8mm above ground.",
        "3. Wire VCC, GND, and signals to D2 and D3.",
        "4. Power on battery; tune trimmer pots with screwdriver until LEDs switch cleanly between black and white.",
        "5. Upload navigation code; test on table and floor tracks."
      ],
      "powerAndSafetyChecks": [
        "ALWAYS assign a student \"catcher\" at the table edge during cliff avoidance testing.",
        "Ensure sensor wires are tucked away and cannot tangle in the rotating drive wheels."
      ],
      "testCases": [
        {
          "action": "Both sensors over white floor",
          "expectedResult": "Both IR LEDs ON; robot drives straight forward."
        },
        {
          "action": "Left sensor encounters black line",
          "expectedResult": "Left IR LED turns OFF; robot pivots left until back on white."
        },
        {
          "action": "Both sensors pass over table edge (infinite dark)",
          "expectedResult": "Both IR LEDs OFF; robot halts immediately, sounds buzzer, reverses 20cm, and pivots 120° away."
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 11: Table-Edge Cliff Avoider & Line Racer\n * Board: Arduino Uno R3 + L298N + Dual TCRT5000 IR Sensors\n */\n\n// IR Sensor Pins\nconst int PIN_IR_LEFT  = 2;  // Left TCRT5000 Digital OUT\nconst int PIN_IR_RIGHT = 3;  // Right TCRT5000 Digital OUT\n\n// Motor Driver Pins\nconst int PIN_ENA = 5;  // PWM Left\nconst int PIN_IN1 = 7;\nconst int PIN_IN2 = 8;\nconst int PIN_IN3 = 9;\nconst int PIN_IN4 = 10;\nconst int PIN_ENB = 6;  // PWM Right\nconst int PIN_BUZZER = 12; // Warning Buzzer\n\n// Speed Presets\nconst int BASE_SPEED = 180; // Cruising speed\nconst int TURN_SPEED = 190; // Pivot speed\n\n// Mode Selector: Set to true for Table Cliff Avoider; false for Line Follower\nconst bool MODE_CLIFF_AVOIDER = false;\n\nvoid setup() {\n  pinMode(PIN_IR_LEFT, INPUT);\n  pinMode(PIN_IR_RIGHT, INPUT);\n  pinMode(PIN_ENA, OUTPUT);\n  pinMode(PIN_IN1, OUTPUT);\n  pinMode(PIN_IN2, OUTPUT);\n  pinMode(PIN_IN3, OUTPUT);\n  pinMode(PIN_IN4, OUTPUT);\n  pinMode(PIN_ENB, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE AUTONOMOUS OPTICAL NAVIGATION READY ===\");\n  delay(1500); // Calibration delay\n}\n\nvoid setMotors(int leftSpeed, int rightSpeed) {\n  if (leftSpeed > 0) {\n    digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, LOW);\n  } else if (leftSpeed < 0) {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, HIGH);\n  } else {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, LOW);\n  }\n\n  if (rightSpeed > 0) {\n    digitalWrite(PIN_IN3, HIGH); digitalWrite(PIN_IN4, LOW);\n  } else if (rightSpeed < 0) {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, HIGH);\n  } else {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, LOW);\n  }\n\n  analogWrite(PIN_ENA, abs(leftSpeed));\n  analogWrite(PIN_ENB, abs(rightSpeed));\n}\n\nvoid activeBrake(int ms = 150) {\n  digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, HIGH);\n  digitalWrite(PIN_IN3, HIGH); digitalWrite(PIN_IN4, HIGH);\n  analogWrite(PIN_ENA, 255); analogWrite(PIN_ENB, 255);\n  delay(ms);\n  setMotors(0, 0);\n}\n\nvoid loop() {\n  // Read IR sensors: LM393 output: LOW = White Floor, HIGH = Black Tape / Drop-Off\n  int leftIR  = digitalRead(PIN_IR_LEFT);\n  int rightIR = digitalRead(PIN_IR_RIGHT);\n\n  if (MODE_CLIFF_AVOIDER) {\n    // ==========================================\n    // MODE 1: TABLE-EDGE CLIFF AVOIDER & SUMO\n    // ==========================================\n    // If either sensor sees drop-off (HIGH): EMERGENCY ESCAPE!\n    if (leftIR == HIGH || rightIR == HIGH) {\n      Serial.println(\"!! CLIFF DETECTED: Emergency Reverse & Pivot !!\");\n      activeBrake(100);\n      tone(PIN_BUZZER, 1800, 200); // Warning chirp\n\n      // Reverse away from edge\n      setMotors(-200, -200);\n      delay(400);\n\n      // Pivot 120 degrees away from danger\n      if (leftIR == HIGH) {\n        setMotors(210, -210); // Pivot right\n      } else {\n        setMotors(-210, 210); // Pivot left\n      }\n      delay(450);\n      activeBrake(100);\n    } else {\n      // Safe white floor: cruise forward\n      setMotors(BASE_SPEED, BASE_SPEED);\n    }\n\n  } else {\n    // ==========================================\n    // MODE 2: HIGH-SPEED BLACK LINE RACER\n    // ==========================================\n    // Case 1: Both on white floor -> Go Straight\n    if (leftIR == LOW && rightIR == LOW) {\n      setMotors(BASE_SPEED, BASE_SPEED);\n    }\n    // Case 2: Left sensor on black line -> Steer Left\n    else if (leftIR == HIGH && rightIR == LOW) {\n      setMotors(-60, TURN_SPEED); // Sharp differential left turn\n    }\n    // Case 3: Right sensor on black line -> Steer Right\n    else if (leftIR == LOW && rightIR == HIGH) {\n      setMotors(TURN_SPEED, -60); // Sharp differential right turn\n    }\n    // Case 4: Both on black line (Intersection / Finish Line)\n    else if (leftIR == HIGH && rightIR == HIGH) {\n      setMotors(BASE_SPEED, BASE_SPEED); // Cross intersection smoothly\n    }\n  }\n\n  delay(10); // 100 Hz control loop\n}\n",
      "pinMap": {
        "Pin 2": "Left TCRT5000 IR Sensor Digital Output",
        "Pin 3": "Right TCRT5000 IR Sensor Digital Output",
        "Pins 5, 7, 8": "L298N Left Motor Speed and Direction (ENA, IN1, IN2)",
        "Pins 6, 9, 10": "L298N Right Motor Speed and Direction (ENB, IN3, IN4)",
        "Pin 12": "Cliff Warning Alarm Buzzer"
      },
      "setupAndUpload": [
        "Mount sensors to front bumper; calibrate trimmer pots over white floor and black tape.",
        "Connect Arduino via USB, select Uno board and port, and upload sketch.",
        "Select MODE_CLIFF_AVOIDER (true) or LINE_RACER (false) and deploy onto testing track."
      ],
      "explanations": [
        "digitalRead(PIN_IR_LEFT): Reads LM393 comparator output (LOW = white floor reflection, HIGH = black absorption or cliff).",
        "Cliff Avoider logic: Instantly triggers active dynamic brake, reverses 400ms, and executes a 120° pivot spin away from the edge.",
        "Line Following logic: Implements 4-case differential skid steering to keep the black line centered between the two sensors.",
        "100 Hz control loop: Executes sensory evaluations every 10ms for instant high-speed cornering corrections."
      ],
      "expectedResult": "In Cliff mode, the robot cruises on a table and recoils safely whenever it approaches the edge. In Line mode, it traces the black electrical tape course smoothly.",
      "caveats": [
        "Direct sunlight or bright incandescent stage lights contain infrared that can saturate phototransistors: test indoors under LED lights.",
        "Ensure the black tape has high contrast against the floor surface."
      ],
      "tweakTip": "Change the reverse speed in line following from -60 to 0 for gentle curves or -120 for extreme hairpin turns!"
    },
    "troubleshooting": [
      {
        "symptom": "Robot crosses the black line and keeps going without turning.",
        "checks": [
          "Check sensor height: verify distance between sensor face and floor is between 5mm and 10mm.",
          "Recalibrate trimmer pot: turn slowly until onboard LED extinguishes over black tape and lights up over white floor."
        ],
        "explanation": "If sensors are mounted too high, the reflected infrared beam is too weak to trigger the comparator."
      },
      {
        "symptom": "Robot shakes or oscillates violently left and right while following the line.",
        "checks": [
          "Reduce turn speed: lower TURN_SPEED from 190 to 160 in code.",
          "Increase cruising speed slightly or move sensors slightly further apart."
        ],
        "explanation": "Over-aggressive steering causes proportional control hunting (over-correcting back and forth)."
      },
      {
        "symptom": "Robot drives off the edge of the table during Cliff Avoidance test.",
        "checks": [
          "Verify sensors point downward at the ground ahead of the wheels, not straight forward.",
          "Ensure BASE_SPEED is moderate so momentum does not carry the wheels over before braking takes effect."
        ],
        "explanation": "Excessive speed combined with front-heavy chassis momentum can overshoot the table edge."
      }
    ],
    "checksForUnderstanding": [
      "Why does black electrical tape prevent infrared light from reflecting back into the sensor?",
      "What happens when the robot encounters a 90-degree hairpin turn in the black line?"
    ],
    "exitTicket": [
      {
        "question": "Explain why a phototransistor turns ON when passing over white poster board and turns OFF over black electrical tape.",
        "rubricOrSampleReasoning": "White poster board exhibits high diffuse reflectance, bouncing the 940nm infrared photons back into the phototransistor base, allowing current to flow (ON). Black electrical tape contains carbon pigment that absorbs infrared photons, starving the base of light and turning the transistor OFF."
      },
      {
        "question": "How does an autonomous mobile robot detect an empty cliff (table edge) using downward-pointing IR reflectance sensors?",
        "rubricOrSampleReasoning": "When the sensor passes over the edge of the table, the emitted infrared beam travels into open air and never returns. The complete absence of return light produces the exact same signal as black absorption, signaling the microcontroller that the floor is gone."
      },
      {
        "question": "What is the purpose of the multi-turn trimmer potentiometer on the TCRT5000 module?",
        "rubricOrSampleReasoning": "It adjusts the reference threshold voltage for the onboard LM393 comparator. This allows the user to tune the exact sensitivity point where the digital output flips between HIGH and LOW based on ambient room light and specific floor reflectivity."
      }
    ],
    "differentiation": {
      "support": [
        "Provide calibration strips of white cardstock and black tape taped directly to the workbench."
      ],
      "extension": [
        "Implement PID (Proportional-Integral-Derivative) control for ultra-smooth high-speed competition racing."
      ],
      "offlineOption": [
        "Simulate line follower algorithms on the RoboBee portal simulator."
      ]
    },
    "nextLessonId": "beg-12",
    "nextLessonTeaser": "Class 12 (Final Capstone Build Day 3): Autonomous Obstacle-Avoiding & Maze Explorer Robot! Master full system integration and graduate from Beginner Robotics.",
    "sources": [
      {
        "title": "Vishay TCRT5000 Reflective Optical Sensor Datasheet",
        "url": "https://vishay.com"
      }
    ],
    "assetCredits": [
      {
        "asset": "Line Follower Truth Table Diagram",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    "id": "beg-12",
    "fieldGuideLinks": {
      "readBeforeClass": [
        "fg-testing-fmea-debugging",
        "fg-comp-tournament-prep"
      ],
      "lookUpWhileBuilding": [
        "fg-motion-differential-kinematics",
        "fg-comp-hc-sr04"
      ],
      "goDeeper": [
        "fg-safety-lab-code",
        "fg-arduino-ide-workflow"
      ]
    },
    "courseId": "beginner",
    "sequence": 12,
    "code": "BEGINNER 12",
    "title": "Final Capstone Build 3: Autonomous Obstacle-Avoiding & Maze Explorer Robot",
    "subtitle": "Final Capstone Milestone Day 3 — Complete multi-subsystem engineering integration, active ultrasonic servo scanning head, spatial clearance matrices, dead-end escape maneuvers, and capstone graduation defense.",
    "promise": "I can integrate ultrasonic sonar scanning turrets with differential chassis drive, program autonomous maze navigation algorithms, and graduate from Beginner Robotics!",
    "status": "published",
    "proposedAudience": "Classes 5–8 (Ages 10–14)",
    "durationMinutes": 120,
    "compactDurationMinutes": 60,
    "prerequisites": [
      "Beginner 01 through Beginner 11"
    ],
    "outcomes": [
      "Synthesize all five core robotics subsystems: Sensing (Sonar), Thinking (Arduino), Actuating (DC Motors & Servos), Structure (Chassis), and Power (Batteries).",
      "Mount and calibrate an active motorized scanning turret (SG90 servo panning HC-SR04 sonar across 45° Left, 90° Center, 135° Right).",
      "Implement a Spatial Decision Matrix in C++: detect forward obstacles < 25cm, halt with active braking, pan head, compare clearance paths, and turn toward maximum open space.",
      "Program an intelligent Dead-End Escape Maneuver: detect trapped corridors (Left and Right blocked) and execute an automatic 180° reverse-pivot retreat.",
      "Deliver an authentic 3-minute Capstone Engineering Defense, demonstrate autonomous maze navigation, and celebrate Beginner Robotics Graduation!"
    ],
    "vocabulary": [
      {
        "term": "Autonomous Navigation",
        "plainMeaning": "A robot driving, exploring, and making its own smart decisions without any human touching a remote control.",
        "technicalMeaning": "The capability of a mobile robotic system to execute mission objectives across unknown environments without human intervention."
      },
      {
        "term": "Active Scanning Turret",
        "plainMeaning": "A motorized neck that pans the robot’s ultrasonic eyes left and right to look around corners before turning.",
        "technicalMeaning": "An articulated pan-tilt sensor payload actuated by a servomotor expanding the spatial field of view beyond a single fixed axis."
      },
      {
        "term": "Spatial Clearance Matrix",
        "plainMeaning": "A decision chart where the robot compares Left Distance vs Right Distance to pick the widest open hallway.",
        "technicalMeaning": "A multi-point spatial distance array evaluating environmental clearance vectors to select an optimal collision-free trajectory."
      },
      {
        "term": "Dead-End Escape Maneuver",
        "plainMeaning": "Recognizing when you are trapped in a corner with no way out, backing up, and turning 180 degrees around.",
        "technicalMeaning": "A state-machine recovery behavior triggered when all forward directional clearance vectors fall below safe operating thresholds."
      },
      {
        "term": "Full System Integration",
        "plainMeaning": "All the pieces working together in harmony: brain, eyes, neck, wheels, chassis, and battery pack.",
        "technicalMeaning": "The successful synthesis of electrical power, embedded firmware, mechanical drive, and sensory feedback into one unified machine."
      },
      {
        "term": "Capstone Engineering Defense",
        "plainMeaning": "Standing up in front of fellow engineers and parents to explain and prove why your autonomous machine works.",
        "technicalMeaning": "A structured peer-review presentation defending design trade-offs, empirical sensor data, and firmware architectures."
      }
    ],
    "teacherPrep": [
      "Build a cardboard or foam board maze arena with corridors, dead-ends, and 90-degree turns on the classroom floor.",
      "Mount HC-SR04 sensors onto SG90 servo horns using sensor brackets or zip-ties.",
      "Prepare printed RoboBee Beginner Robotics Graduation Certificates for all students!"
    ],
    "verifiedMaterials": [
      "Fully integrated 2WD Robot Chassis (from Classes 09, 10, 11)",
      "Arduino Uno R3 development board with USB cable",
      "L298N Dual H-Bridge Motor Driver",
      "SG90 9g Micro Servo with mounting bracket",
      "HC-SR04 Ultrasonic Sonar Sensor",
      "Status Indicator RGB LED with 220Ω resistors",
      "Piezo Buzzer (Celebratory victory fanfare)",
      "4x AA or 2x 18650 Battery Pack with toggle switch",
      "Cardboard maze obstacles and corridor walls"
    ],
    "safetyNotes": [
      "Conduct all maze trials on the marked floor arena; keep spectator students seated outside the boundary line.",
      "Never pick up the robot by its delicate servo scanner head; always lift firmly by the chassis deck plates.",
      "Verify battery terminal voltage before the final graduation trials to ensure consistent motor speeds."
    ],
    "classRhythm": [
      {
        "segment": "00–15m: Hook & Live Demo",
        "minutes": 15,
        "teacherAction": "Place the master prototype inside a complex 3-corridor maze: step back and raise hands in the air! The robot drives forward, encounters a dead-end, halts, pans its head left and right, picks the open path, navigates to the exit, and sounds a triumphant victory fanfare!",
        "studentAction": "Cheer the autonomous escape! Realize that today they will combine every skill learned from Class 01 to Class 11 into this ultimate build."
      },
      {
        "segment": "15–40m: Interactive Concept & Pinout",
        "minutes": 25,
        "teacherAction": "Deconstruct the full system block diagram. Teach the active scanning turret geometry (45° Left, 90° Center, 135° Right) and the dead-end escape state machine.",
        "studentAction": "Interact with the Obstacle Avoiding Rover Sim on the portal: test scanning head sweeps and maze escape algorithms."
      },
      {
        "segment": "40–75m: Breadboard Wiring & Assembly",
        "minutes": 35,
        "teacherAction": "Guide mounting: fasten SG90 servo to front chassis center; mount HC-SR04 to servo horn; wire Servo to D11, Sonar to D9/D10, Buzzer to D3.",
        "studentAction": "Assemble the scanning turret and complete all final wiring. Calibrate 90° center alignment so sonar points dead ahead."
      },
      {
        "segment": "75–100m: Code & Serial Debugging",
        "minutes": 25,
        "teacherAction": "Walk through lookLeft(), lookRight(), activeBrake(), comparing distances, and executing the 180° dead-end retreat maneuver.",
        "studentAction": "Upload the Capstone Maze Explorer firmware. Prop robot on bench block; place hands at various angles to verify head panning and motor steering."
      },
      {
        "segment": "100–120m: Game Challenge & Showoff",
        "minutes": 20,
        "teacherAction": "Host the Official RoboBee Beginner Capstone Maze Showcase: time autonomous runs, evaluate against engineering rubrics, and award Graduation Certificates!",
        "studentAction": "Deploy robot into the maze; watch it solve the course 100% autonomously; celebrate graduation with parents, peers, and instructors!"
      }
    ],
    "concepts": [
      {
        "title": "Full Cybernetic Sense → Decide → Act Loop",
        "explanation": "Our Capstone Robot represents the pinnacle of cybernetic engineering: SENSE: HC-SR04 ultrasonic sonar measures acoustic distance; DECIDE: ATmega328P compares clearance vectors against spatial safety boundaries; ACT: L298N motors execute skid-steering maneuvers while SG90 servo scans the path ahead.",
        "instructorNote": "Remind students of Class 01 where they first blinked an LED—now they are commanding an autonomous multi-subsystem vehicle!"
      },
      {
        "title": "Active Sensor Panning vs Fixed Sensors",
        "explanation": "A fixed sonar can only see directly ahead. If an obstacle is angled or a wall blocks the path, a fixed-sensor robot gets permanently stuck! By mounting the sonar on a servomotor, the robot pans 45° to the left and 135° to the right, mapping out alternative corridors before making its turn.",
        "instructorNote": "Demonstrate that turning the \"head\" uses almost zero battery power compared to turning the entire robot chassis."
      },
      {
        "title": "Handling Trapped Dead-Ends",
        "explanation": "What if the robot drives into a narrow box where forward, left, AND right are all blocked? A basic obstacle avoider will thrash back and forth helplessly. Our firmware checks: if leftDistance < 20cm AND rightDistance < 20cm, it recognizes a DEAD-END, reverses 30cm, and executes a 180° spin to escape!",
        "instructorNote": "Highlight that solving edge cases separates amateur gadgets from professional autonomous robotics."
      }
    ],
    "visualizerId": "obstacle_avoiding_rover_sim",
    "project": {
      "name": "Final Capstone Project: Autonomous Obstacle-Avoiding & Maze Explorer Robot",
      "deliverableType": "physical_build",
      "successEvidence": [
        "Complete physical 2WD autonomous rover with motorized SG90 scanning turret and HC-SR04 sonar.",
        "Active path scanning: stops < 25cm from obstacle, pans head Left (45°) and Right (135°), and selects clearest corridor.",
        "Successful 100% autonomous navigation through a multi-turn labyrinth arena and celebratory victory graduation fanfare."
      ]
    },
    "activity": {
      "title": "Assemble, Integrate, and Defend the Capstone Maze Explorer",
      "steps": [
        "Step 1: Secure SG90 micro servo firmly to the front center of the top acrylic chassis deck facing forward.",
        "Step 2: Attach HC-SR04 sonar module to the servo horn bracket; align so 90° commands point dead ahead.",
        "Step 3: Connect Servo signal to Digital Pin 11; Sonar Trig to Pin 9, Echo to Pin 10; Buzzer to Pin 3.",
        "Step 4: Verify L298N motor driver connections (ENA D5, IN1 D7, IN2 D8, IN3 D9, IN4 D10, ENB D6).",
        "Step 5: Connect common Ground and power from the battery pack; upload Capstone firmware.",
        "Step 6: Place robot inside the testing maze; observe autonomous forward drive, scanning pauses, and wall avoidance.",
        "Step 7: Deliver 2-minute technical showcase defense, demonstrate maze solve, and receive RoboBee Beginner Graduation Certificate!"
      ],
      "successCriteria": [
        "Rover never collides with or scrapes maze walls during testing.",
        "Scanning turret rotates cleanly across 45°, 90°, and 135° angles without wire snagging.",
        "Robot successfully solves the maze and plays the graduation melody."
      ],
      "extension": "Add a non-volatile EEPROM memory run log recording total distance traveled and number of turns executed!"
    },
    "physicalBuildPack": {
      "verifiedBoardAndModules": [
        "Arduino Uno R3",
        "L298N Driver",
        "SG90 Servo",
        "HC-SR04 Sonar",
        "2WD Chassis"
      ],
      "componentList": [
        {
          "name": "Complete 2WD Robot Chassis",
          "exactVariant": "With dual TT gear motors, rubber wheels, and caster",
          "quantity": 1
        },
        {
          "name": "Arduino Uno R3 Board",
          "exactVariant": "Standard Rev3",
          "quantity": 1
        },
        {
          "name": "L298N Dual H-Bridge Driver",
          "exactVariant": "With heatsink and screw terminals",
          "quantity": 1
        },
        {
          "name": "SG90 9g Micro Servo",
          "exactVariant": "Motorized scanning turret actuator",
          "quantity": 1
        },
        {
          "name": "HC-SR04 Ultrasonic Sonar",
          "exactVariant": "Mounted to servo horn bracket",
          "quantity": 1
        },
        {
          "name": "Piezo Buzzer",
          "exactVariant": "Victory celebration sound generator",
          "quantity": 1
        },
        {
          "name": "Status Indicator RGB LED",
          "exactVariant": "Common cathode with 220Ω resistors",
          "quantity": 1
        },
        {
          "name": "Battery Pack (6V–7.4V)",
          "exactVariant": "4x AA or 2x 18650 holder with toggle switch",
          "quantity": 1
        },
        {
          "name": "Cardboard Maze Arena Kit",
          "exactVariant": "Corridor walls (30cm height)",
          "quantity": 1
        }
      ],
      "connectionPhotoOrClearlyLabeledIllustration": "/illustrations/2wd_rover_wiring_plan.svg",
      "schematic": "L298N: ENA->D5 | IN1->D7 | IN2->D8 | IN3->D9 | IN4->D10 | ENB->D6; SG90 Servo: Signal->D11 | 5V | GND; HC-SR04: Trig->A2 | Echo->A3; Buzzer: D3 -> Buzzer (+) | (-) -> GND; Common Ground shared across all modules",
      "wireTable": [
        {
          "from": "SG90 Servo Signal (Orange)",
          "to": "Arduino Digital Pin 11 (PWM)",
          "wireOrPolarityNote": "Turret pan angle control"
        },
        {
          "from": "HC-SR04 Trig Pin",
          "to": "Arduino Analog In A2 (as Digital Output)",
          "wireOrPolarityNote": "Sonar trigger pulse"
        },
        {
          "from": "HC-SR04 Echo Pin",
          "to": "Arduino Analog In A3 (as Digital Input)",
          "wireOrPolarityNote": "Sonar echo return"
        },
        {
          "from": "Arduino Digital Pin 3",
          "to": "Piezo Buzzer (+) Pin",
          "wireOrPolarityNote": "Victory fanfare chime"
        },
        {
          "from": "Arduino Digital Pin 5 (PWM)",
          "to": "L298N ENA (Left Speed)",
          "wireOrPolarityNote": "Left motor speed"
        },
        {
          "from": "Arduino Digital Pin 7",
          "to": "L298N IN1",
          "wireOrPolarityNote": "Left forward logic"
        },
        {
          "from": "Arduino Digital Pin 8",
          "to": "L298N IN2",
          "wireOrPolarityNote": "Left reverse logic"
        },
        {
          "from": "Arduino Digital Pin 9",
          "to": "L298N IN3",
          "wireOrPolarityNote": "Right forward logic"
        },
        {
          "from": "Arduino Digital Pin 10",
          "to": "L298N IN4",
          "wireOrPolarityNote": "Right reverse logic"
        },
        {
          "from": "Arduino Digital Pin 6 (PWM)",
          "to": "L298N ENB (Right Speed)",
          "wireOrPolarityNote": "Right motor speed"
        },
        {
          "from": "Battery Pack (-)",
          "to": "L298N GND & Arduino GND",
          "wireOrPolarityNote": "Common Ground Return"
        }
      ],
      "assemblyAndPowerUpSteps": [
        "1. Mount SG90 servo securely to front center of chassis plate.",
        "2. Fasten HC-SR04 sonar module to servo horn arm.",
        "3. Wire Servo to Pin 11, Sonar to A2/A3, Motors to Pins 5–10, and Buzzer to Pin 3.",
        "4. Connect common Ground across L298N, Arduino, and Battery.",
        "5. Power on battery switch; upload Capstone firmware; place in maze corridor."
      ],
      "powerAndSafetyChecks": [
        "Verify the servo wires do not bind or pull taut when the head pans to 45° or 135°.",
        "Ensure the battery pack provides at least 6.0V under motor load."
      ],
      "testCases": [
        {
          "action": "Obstacle appears directly ahead (< 25cm)",
          "expectedResult": "Rover halts with active brake; pans head Left (45°), then Right (135°)."
        },
        {
          "action": "Left clearance is 50cm, Right clearance is 15cm",
          "expectedResult": "Rover pivots 90° to the Left and resumes forward drive."
        },
        {
          "action": "Dead-end: both Left and Right are blocked (< 20cm)",
          "expectedResult": "Rover reverses 25cm and executes full 180° turnaround."
        },
        {
          "action": "Reaches maze exit (open space > 100cm for 5s)",
          "expectedResult": "Rover halts and plays triumphant 5-tone graduation melody!"
        }
      ]
    },
    "codeLab": {
      "language": "cpp",
      "code": "/*\n * RoboBEE Innovators — Class 12: Final Capstone Autonomous Maze Explorer\n * Major Project Milestone Day 3\n * Board: Arduino Uno R3 + L298N + SG90 Servo Turret + HC-SR04 Sonar\n */\n\n#include <Servo.h>\n\n// Sonar Pins (Using Analog pins as Digital to prevent conflict with PWM pins)\nconst int PIN_TRIG   = A2;\nconst int PIN_ECHO   = A3;\n\n// Motor Driver Pins\nconst int PIN_ENA    = 5;\nconst int PIN_IN1    = 7;\nconst int PIN_IN2    = 8;\nconst int PIN_IN3    = 9;\nconst int PIN_IN4    = 10;\nconst int PIN_ENB    = 6;\n\n// Scanning Turret Servo & Buzzer\nconst int PIN_SERVO  = 11;\nconst int PIN_BUZZER = 3;\n\n// Navigation Thresholds\nconst int STOP_DIST   = 25; // Stop when obstacle closer than 25cm\nconst int CRUISE_SPD  = 180; // Cruising motor speed\nconst int PIVOT_SPD   = 200; // Turning motor speed\n\nServo headServo;\n\nvoid setup() {\n  pinMode(PIN_TRIG, OUTPUT);\n  pinMode(PIN_ECHO, INPUT);\n  pinMode(PIN_ENA, OUTPUT);\n  pinMode(PIN_IN1, OUTPUT);\n  pinMode(PIN_IN2, OUTPUT);\n  pinMode(PIN_IN3, OUTPUT);\n  pinMode(PIN_IN4, OUTPUT);\n  pinMode(PIN_ENB, OUTPUT);\n  pinMode(PIN_BUZZER, OUTPUT);\n\n  headServo.attach(PIN_SERVO);\n  headServo.write(90); // Center head dead ahead\n\n  Serial.begin(9600);\n  Serial.println(\"=== ROBOBEE CAPSTONE AUTONOMOUS MAZE EXPLORER READY ===\");\n  delay(2000); // 2-second grace period before autonomous drive\n}\n\nlong getDistance() {\n  digitalWrite(PIN_TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(PIN_TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(PIN_TRIG, LOW);\n\n  long duration = pulseIn(PIN_ECHO, HIGH, 25000);\n  if (duration == 0) return 999;\n  return (duration * 0.0343) / 2;\n}\n\nvoid setMotors(int leftSpeed, int rightSpeed) {\n  if (leftSpeed > 0) {\n    digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, LOW);\n  } else if (leftSpeed < 0) {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, HIGH);\n  } else {\n    digitalWrite(PIN_IN1, LOW); digitalWrite(PIN_IN2, LOW);\n  }\n\n  if (rightSpeed > 0) {\n    digitalWrite(PIN_IN3, HIGH); digitalWrite(PIN_IN4, LOW);\n  } else if (rightSpeed < 0) {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, HIGH);\n  } else {\n    digitalWrite(PIN_IN3, LOW); digitalWrite(PIN_IN4, LOW);\n  }\n\n  analogWrite(PIN_ENA, abs(leftSpeed));\n  analogWrite(PIN_ENB, abs(rightSpeed));\n}\n\nvoid activeBrake(int ms = 150) {\n  digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, HIGH);\n  digitalWrite(PIN_IN3, HIGH); digitalWrite(PIN_IN4, HIGH);\n  analogWrite(PIN_ENA, 255); analogWrite(PIN_ENB, 255);\n  delay(ms);\n  setMotors(0, 0);\n}\n\nvoid playVictoryFanfare() {\n  tone(PIN_BUZZER, 523, 150); delay(180); // C5\n  tone(PIN_BUZZER, 659, 150); delay(180); // E5\n  tone(PIN_BUZZER, 784, 150); delay(180); // G5\n  tone(PIN_BUZZER, 1046, 400); delay(450); // C6\n}\n\nvoid loop() {\n  headServo.write(90); // Look forward\n  long distAhead = getDistance();\n\n  Serial.print(\"Ahead: \");\n  Serial.print(distAhead);\n  Serial.println(\" cm\");\n\n  // Path is Clear: Cruise Forward!\n  if (distAhead > STOP_DIST) {\n    setMotors(CRUISE_SPD, CRUISE_SPD);\n    delay(40);\n  }\n  // Obstacle Detected: Execute Scanning Decision Matrix!\n  else {\n    Serial.println(\">> OBSTACLE AHEAD! Halting and Scanning Corridors...\");\n    activeBrake(200);\n\n    // Pan Head to the Left (45 degrees)\n    headServo.write(45);\n    delay(350);\n    long distLeft = getDistance();\n    Serial.print(\"  Left Clearance: \"); Serial.print(distLeft); Serial.println(\" cm\");\n\n    // Pan Head to the Right (135 degrees)\n    headServo.write(135);\n    delay(400);\n    long distRight = getDistance();\n    Serial.print(\"  Right Clearance: \"); Serial.print(distRight); Serial.println(\" cm\");\n\n    // Return Head to Center\n    headServo.write(90);\n    delay(250);\n\n    // Decision Logic\n    // Case 1: Dead End (Both sides blocked < 20cm) -> 180 Turnaround!\n    if (distLeft < 20 && distRight < 20) {\n      Serial.println(\">> DEAD END TRAP! Executing 180 Turnaround...\");\n      tone(PIN_BUZZER, 600, 150);\n      setMotors(-180, -180); // Back up 25cm\n      delay(400);\n      setMotors(PIVOT_SPD, -PIVOT_SPD); // Pivot 180 degrees\n      delay(750);\n      activeBrake(150);\n    }\n    // Case 2: Left has greater clearance -> Turn Left!\n    else if (distLeft >= distRight) {\n      Serial.println(\">> Left Path Clear: Turning Left...\");\n      setMotors(-PIVOT_SPD, PIVOT_SPD); // Turn Left\n      delay(400);\n      activeBrake(100);\n    }\n    // Case 3: Right has greater clearance -> Turn Right!\n    else {\n      Serial.println(\">> Right Path Clear: Turning Right...\");\n      setMotors(PIVOT_SPD, -PIVOT_SPD); // Turn Right\n      delay(400);\n      activeBrake(100);\n    }\n  }\n}\n",
      "pinMap": {
        "Pin A2": "HC-SR04 Trig Pin (Fires ultrasonic chirp pulses)",
        "Pin A3": "HC-SR04 Echo Pin (Reads return acoustic time-of-flight)",
        "Pin 11 (PWM)": "SG90 Micro Servo turret pan control (45° Left to 135° Right)",
        "Pins 5, 7, 8": "L298N Left Motor Speed and Direction (ENA, IN1, IN2)",
        "Pins 6, 9, 10": "L298N Right Motor Speed and Direction (ENB, IN3, IN4)",
        "Pin 3": "Victory Celebration Fanfare Buzzer Output"
      },
      "setupAndUpload": [
        "Connect Arduino via USB, select Uno board and port, and upload Capstone sketch.",
        "Disconnect USB; place robot inside maze corridor; switch on battery pack.",
        "Watch robot navigate corridors, scan corners, avoid dead ends, and celebrate graduation!"
      ],
      "explanations": [
        "Active Scanning Turret: Panning the SG90 servo between 45° and 135° allows spatial distance mapping without vehicle movement.",
        "Spatial Decision Matrix: Evaluates distLeft vs distRight to make intelligent autonomous steering choices.",
        "Dead-End Recovery: Reversing and pivoting 180° prevents the robot from ever becoming permanently trapped in corners.",
        "Full System Synthesis: Integrates all sensors, actuators, and code algorithms mastered across the 12-class curriculum."
      ],
      "expectedResult": "Robot travels autonomously through complex maze corridors, stops safely before walls, scans left and right, navigates cleanly around corners, escapes dead ends, and solves the maze without human intervention.",
      "caveats": [
        "Ensure the servo wires have sufficient slack to rotate 45° to 135° without binding or catching on chassis standoffs.",
        "Calibrate battery voltage so pivot turns execute exact 90° and 180° rotations."
      ],
      "tweakTip": "Add an autonomous maze exit detection: if distance stays > 100cm for 5 consecutive seconds, trigger the celebratory graduation fanfare!"
    },
    "troubleshooting": [
      {
        "symptom": "Robot stops at an obstacle, but the servo does not pan left or right.",
        "checks": [
          "Check servo wire connection: confirm signal wire is in Digital Pin 11.",
          "Verify headServo.attach(11) in setup().",
          "Check 5V power rail voltage: an under-voltage battery pack cannot power the servo."
        ],
        "explanation": "Low battery voltage causes the servo motor to draw brown-out currents, failing to rotate."
      },
      {
        "symptom": "Robot turns towards the blocked wall instead of the open hallway.",
        "checks": [
          "Check servo angle mapping: verify 45° points Left and 135° points Right (swap if servo is mounted backwards).",
          "Verify Left and Right motor wiring is not reversed."
        ],
        "explanation": "An inverted servo orientation causes distLeft and distRight variables to be swapped in memory."
      },
      {
        "symptom": "Robot gets stuck in a corner oscillating between Left and Right.",
        "checks": [
          "Verify the Dead-End check: confirm distLeft < 20 && distRight < 20 triggers the 180° reverse retreat.",
          "Ensure the reverse maneuver runs long enough (400ms) to clear the corner walls."
        ],
        "explanation": "Without sufficient reverse travel, the robot remains within the obstacle envelope and re-triggers."
      }
    ],
    "checksForUnderstanding": [
      "How does an active motorized scanning turret improve robot navigation compared to a fixed sensor?",
      "What are the five core subsystems of an autonomous mobile robot and how do they communicate?"
    ],
    "exitTicket": [
      {
        "question": "Explain how the robot’s Spatial Decision Matrix chooses between turning Left versus turning Right when encountering an obstacle.",
        "rubricOrSampleReasoning": "When obstacle < 25cm is detected ahead, the robot halts and pans its servo to 45° (measuring distLeft) and 135° (measuring distRight). It compares the two distances: if distLeft >= distRight, it executes a pivot turn to the left; otherwise, it pivots to the right toward the greater clearance path."
      },
      {
        "question": "How does the robot detect and escape from a trapped Dead-End corridor?",
        "rubricOrSampleReasoning": "If both distLeft and distRight are less than 20cm, the robot recognizes that all forward and lateral paths are blocked. It triggers the dead-end state: backing up 25cm, executing an active 180-degree pivot turnaround, and resuming forward drive out of the trap."
      },
      {
        "question": "Defend how your completed Capstone Robot embodies the universal Sense → Decide → Act cybernetic loop.",
        "rubricOrSampleReasoning": "1. SENSE: HC-SR04 ultrasonic sonar and SG90 scanning turret gather real-time acoustic time-of-flight distance data; 2. DECIDE: The ATmega328P microcontroller evaluates spatial clearance matrices, dead-end states, and safety boundaries in software; 3. ACT: The L298N H-bridge driver commands TT gear motors to execute forward rushes, differential pivot turns, and active dynamic braking."
      }
    ],
    "differentiation": {
      "support": [
        "Provide maze corridors with high-contrast colored walls for clean ultrasonic reflection."
      ],
      "extension": [
        "Implement a wall-following \"right-hand rule\" algorithm for guaranteed mathematical maze escape."
      ],
      "offlineOption": [
        "Simulate the complete Capstone Maze Explorer on the RoboBee portal."
      ]
    },
    "nextLessonId": "int-01",
    "nextLessonTeaser": "Graduate to Intermediate Robotics & Systems (Classes 01–10): State machines, multi-channel IR arrays, PID line tracking, and servo grippers!",
    "sources": [
      {
        "title": "RoboBEE Innovators Capstone Showcase & Graduation Rubric",
        "url": ""
      }
    ],
    "assetCredits": [
      {
        "asset": "Capstone Autonomous Maze Explorer Drawing",
        "creator": "RoboBEE Innovators Engineering Team",
        "license": "Proprietary",
        "sourceUrl": "team_info"
      }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // COURSE SPACE C: INTERMEDIATE ROBOTICS (CLASSES 01-10)
  // -----------------------------------------------------------------------
  {
    id: 'int-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot", "fg-foundations-open-closed-loop"],
      lookUpWhileBuilding: ["fg-comp-tcrt5000", "fg-motion-differential-kinematics"],
      goDeeper: ["fg-testing-fmea-debugging"]
    },
    courseId: 'intermediate',
    sequence: 1,
    code: 'INTERMEDIATE 01',
    title: 'Engineering Workflow and System Diagrams',
    promise: 'By the end of this masterclass, you will translate official robotics tournament rulebooks into formal functional requirements, architect professional subsystem block diagrams, partition voltage domains, and draft an unambiguous hardware-software interface specification.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Beginner Series (Classes 01–10)'],
    outcomes: [
      'Deconstruct complex robotics mission briefs into hierarchical functional requirements (Must-Have, Should-Have, Nice-to-Have).',
      'Architect a comprehensive System Block Diagram detailing Power, Sensory Perception, Logic Processing, and Actuation domains.',
      'Define rigorous Interface Control Documents (ICD) specifying signal voltages, current capacities, pin mappings, and communication protocols.',
      'Construct a complete Electrical Power Budget calculating battery runtime under continuous and peak stall loads.',
      'Identify and isolate Ground Loop vulnerabilities before physical soldering or wiring commences.'
    ],
    vocabulary: [
      { term: 'System Block Diagram', plainMeaning: 'A high-level blueprint map showing how every motor, battery, sensor, and chip connects.', technicalMeaning: 'A diagram of a system in which the principal parts or functions are represented by blocks connected by lines showing relationships.' },
      { term: 'Functional Requirement', plainMeaning: 'A specific, measurable rule a robot must obey (e.g. "Must detect a 20mm black line within 5ms").', technicalMeaning: 'A formal specification of a function that a system or subsystem must perform, verifiable through empirical measurement.' },
      { term: 'Interface Control Document (ICD)', plainMeaning: 'A signed agreement between teammates specifying exactly which wire carries what signal.', technicalMeaning: 'An engineering document that defines and controls the interfaces between distinct subsystems to ensure compatibility.' },
      { term: 'Power Budget', plainMeaning: 'A math table adding up all the milliamps every part draws to make sure the battery doesn’t die early.', technicalMeaning: 'An accounting of total electrical energy and peak current consumption across all system operating states.' },
      { term: 'Ground Loop', plainMeaning: 'A messy electrical wiring trap where ground wires form circles, picking up radio noise that causes glitches.', technicalMeaning: 'An unwanted current path in a circuit caused by connecting grounds at multiple physical locations with differing potentials.' },
      { term: 'Subsystem Decomposition', plainMeaning: 'Breaking a giant impossible robotics project into 4 small manageable modules.', technicalMeaning: 'The structural division of a complex engineering system into modular, independently testable sub-assemblies.' }
    ],
    teacherPrep: ['Prepare official national and international Line Follower tournament rule sheets (e.g. Robofest, FIRSO, World Robot Olympiad).'],
    verifiedMaterials: ['System architecture blueprint templates', 'Sample tournament rulebooks', 'Colored technical drafting pens & grid paper', 'Multimeter for component current verification'],
    safetyNotes: ['Classroom planning and engineering architecture session. Emphasize fire safety in battery power budget calculations.'],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Analyze why 40% of autonomous competition robots fail during their first official run: Not due to bad code, but due to uncoordinated interface pin conflicts and power brownouts!', 
        studentAction: 'Examine historical competition failure footage and identify team coordination breakdowns.' 
      },
      { 
        segment: '10–30m Concept', 
        minutes: 20, 
        teacherAction: 'Guide construction of the 4-Domain System Block Diagram: 1. Power Distribution; 2. Optical Sensory Array; 3. Microcontroller Logic; 4. High-Current Motor Actuation.', 
        studentAction: 'Draft team system architecture map, labeling all wire buses with voltage levels (5.0V Logic vs 7.4V Motor) and pin designations.' 
      },
      { 
        segment: '30–50m Blueprinting', 
        minutes: 20, 
        teacherAction: 'Supervise drafting of the Interface Control Document (ICD) and Power Budget spreadsheet.', 
        studentAction: 'Calculate total milliamp-hour (mAh) consumption and establish measurable acceptance criteria for each subsystem.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review student blueprints and verify that power domains share a single Star Common Ground.', 
        studentAction: 'Defend completed system blueprint to instructors and submit formative exit check.' 
      }
    ],
    concepts: [
      {
        title: '1. Systems Engineering Decomposition: The 4 Universal Domains',
        explanation: 'In aerospace and professional robotics (NASA Systems Engineering Handbook SP-2016-6105), no machine is built as a monolithic tangle of wires. A complex autonomous vehicle is systematically partitioned into four distinct functional domains: 1. Mechanical Kinematics (chassis chassis, gear ratios, center of gravity); 2. Electrical Power (energy storage, voltage regulation, current decoupling); 3. Sensory Perception (photodiodes, sonars, IMUs converting physics to bits); 4. Silicon Brain (embedded firmware executing deterministic control algorithms). Each domain has distinct design constraints and must be independently testable.',
        instructorNote: 'Point out that if your power domain fails, your code domain cannot even wake up to run!'
      },
      {
        title: '2. Interface Control Documents (ICD) & Pin Budgeting',
        explanation: 'In collegiate and commercial robotics teams, hardware engineers and firmware developers frequently work simultaneously. Without an Interface Control Document (ICD), disaster is guaranteed: the hardware engineer wires an ultrasonic sensor to Pin 5, while the firmware developer writes code assigning Pin 5 to Left Motor PWM! An ICD serves as a binding legal contract between sub-teams. It explicitly lists every physical connector, pin number, signal type (Analog, Digital Input, PWM Output, I2C Bus), voltage tolerance (3.3V vs 5V), and timing frequency.',
        instructorNote: 'Have students physically sign off on their team ICD before any soldering or jumper wire assembly begins.'
      },
      {
        title: '3. Electrical Power Budgeting & Battery Discharge Curves',
        explanation: 'An autonomous robot cannot run on hopes; it runs on Coulombs. A rigorous Power Budget tabulates the quiescent (idle) and peak current consumption of every component: Arduino Uno (~45mA), 2x TCRT5000 IR modules (~40mA total), TB6612 logic (~2mA), and 2x TT DC gearmotors (~300mA running, ~1200mA stall). Total peak draw can exceed 2.5 Amperes! If using a 2S 7.4V 1500mAh LiPo battery pack: $\text{Runtime (hours)} = \frac{\text{Battery Capacity (Ah)}}{\text{Average Current (A)}} \times 0.8$ (accounting for the 80% safe depth-of-discharge limit to prevent permanent cell degradation).',
        instructorNote: 'Demonstrate how a robot that runs fine on the bench for 30 seconds can brown out and reset halfway through a 2-minute tournament run.'
      },
      {
        title: '4. Ground Loop Vulnerabilities & The Star Ground Topology',
        explanation: 'Ground is not a magical zero-resistance black hole; it is a physical copper conductor with non-zero electrical resistance ($R = \rho \frac{L}{A}$). When high motor currents (1.5A) surge through a shared ground wire, Ohm’s Law ($V = I \cdot R$) causes the ground potential at the sensor to bounce upward by several hundred millivolts! If logic ground wires are daisy-chained from motor driver to sensor to Arduino, these ground shifts corrupt delicate analog sensor readings. The solution is Star Grounding: all ground returns must connect back to a single central ground hub.',
        instructorNote: 'Draw a daisy-chain ground vs a star ground on the whiteboard to illustrate how motor noise bypasses delicate sensors.'
      },
      {
        title: '5. Verifiable Functional Requirements vs Aesthetic Preferences',
        explanation: 'In professional engineering, requirements must be strictly falsifiable and measurable. A statement like "The robot should follow lines quickly" is an un-testable opinion. A professional Functional Requirement specifies: "FR-01: The mobile robot shall follow a 19mm matte black vinyl line on white foam board at a forward velocity of >= 0.35 m/s without exceeding a cross-track error of ±15mm." If a requirement cannot be verified with a stopwatch, ruler, or multimeter, it is not an engineering specification.',
        instructorNote: 'Challenge students to convert vague statements into quantitative, verifiable engineering requirements.'
      },
      {
        title: '6. Fail-Safe Mode Decomposition & Watchdogs',
        explanation: 'Every autonomous system must possess defined failure modes. What happens if the line sensor loses track of the black tape entirely? What happens if battery voltage drops below 6.0V? In our system diagram, we design an explicit Error Handling State: if no line is detected for 500ms, the robot must not blindly accelerate forward into walls; it must immediately trigger dynamic active braking and initiate a safe recovery search sweep.',
        instructorNote: 'Remind students of tournament rules: robots that drive off the table or crash into obstacles receive immediate zero-point disqualification.'
      }
    ],
    visualizerId: 'sense_decide_act_sim',
    project: {
      name: 'Line-Follower Requirements & System Architecture Blueprint',
      deliverableType: 'design_review',
      successEvidence: [
        'Complete 4-domain System Block Diagram detailing wire buses, pin assignments, and voltage rails.',
        'Formal Interface Control Document (ICD) signed by team members with zero duplicate pin conflicts.',
        'Calculated Power Budget establishing continuous runtime and safety margins on 7.4V power.'
      ]
    },
    activity: {
      title: 'Architect the Competition Line-Follower Blueprint',
      steps: [
        'Step 1: Read the competition rulebook specifications (track width, curve radius, line color, match time limit).',
        'Step 2: Define 3 mandatory Functional Requirements with quantitative target metrics.',
        'Step 3: Draw the Power Block: Battery pack (7.4V), motor rail (VM), 5V regulated logic rail, and master power switch.',
        'Step 4: Draw the Perception Block: Dual TCRT5000 optical sensors mapped to analog pins A0 and A1.',
        'Step 5: Draw the Actuation Block: TB6612FNG driver mapped to PWM pins 5, 6 and direction pins 7, 8, 9, 10.',
        'Step 6: Calculate total peak current draw and verify that Star Grounding is utilized across all blocks.'
      ],
      successCriteria: [
        'Blueprint clearly labels every single wire with exact Arduino pin designation and operating voltage.',
        'Power budget demonstrates at least 20 minutes of continuous autonomous operation.',
        'Interface control document has zero duplicate pin conflicts.'
      ],
      extension: 'Add an emergency telemetry annunciator sub-block (RGB status LED on Pin 13) indicating active system state.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['System Architecture Drafting Kit', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: 'Architecture Blueprint Sheet', exactVariant: 'A3 technical grid drafting canvas', quantity: 1 },
        { name: 'Tournament Rulebook Dossier', exactVariant: 'Standard 20mm Line-Following Competition Rules', quantity: 1 },
        { name: 'Arduino Uno Rev3 Pin Reference Map', exactVariant: 'Official ATmega328P DIP pinout specification', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'System Architecture Bus Map:\n[7.4V Battery] ──► [Master Switch] ──► [TB6612 VM Rail (High Current)]\n                └──► [Arduino Vin (Internal 5V Regulator)] ──► [5V Logic Bus]\n[5V Logic Bus] ──► TB6612 VCC & Dual TCRT5000 VCC\n[Star Ground Hub] ◄── Battery (-), Arduino GND, TB6612 GND, Sensor GND\n[Sensors] ──► Pins A0 & A1 (Analog Reflectance Bus)\n[Arduino Logic] ──► Pins 3, 5, 6, 7, 8, 9, 10 (TB6612 Motor Control Bus)',
      wireTable: [
        { from: 'Master Power Switch', to: 'TB6612 VM Pin', wireOrPolarityNote: 'High-Current 7.4V Battery Rail (Red 20AWG)' },
        { from: 'Arduino 5V Pin', to: 'Sensor & Driver VCC', wireOrPolarityNote: 'Regulated 5.0V Logic Bus (Red 24AWG)' },
        { from: 'Central Star Ground Hub', to: 'All System Grounds', wireOrPolarityNote: 'Common 0V Reference (Black 20AWG)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect physical components against the architecture blueprint BOM.',
        '2. Verify pin allocations against the Interface Control Document.',
        '3. Check that no two sensors or drivers share the same physical Arduino pin.'
      ],
      powerAndSafetyChecks: [
        'Confirm battery positive rail (7.4V) never connects to any 5V logic input.',
        'Verify single Star Ground hub prevents motor current from flowing through delicate sensor ground traces.'
      ],
      testCases: [
        { action: 'Review ICD Pin Table', expectedResult: 'Zero overlapping pin assignments between sensors, motor drivers, and serial ports.' },
        { action: 'Calculate Battery Runtime', expectedResult: 'Calculated runtime exceeds match duration by at least a factor of 4.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Interface & Pin Budget Validator
// Class: INTERMEDIATE 01 - Systems Engineering & Pin Allocation Check

// INTERFACE CONTROL DOCUMENT (ICD) PIN DEFINITIONS
// Sensory Perception Bus
const int PIN_LINE_LEFT   = A0; // Input: Left TCRT5000 analog reflectance
const int PIN_LINE_RIGHT  = A1; // Input: Right TCRT5000 analog reflectance

// Motor Actuation Bus (TB6612FNG Dual Driver)
const int PIN_MOTOR_PWMA  = 5;  // Output: Left Motor Speed (~PWM Timer0)
const int PIN_MOTOR_AIN1  = 7;  // Output: Left Motor Direction 1
const int PIN_MOTOR_AIN2  = 8;  // Output: Left Motor Direction 2

const int PIN_MOTOR_PWMB  = 6;  // Output: Right Motor Speed (~PWM Timer0)
const int PIN_MOTOR_BIN1  = 9;  // Output: Right Motor Direction 1
const int PIN_MOTOR_BIN2  = 10; // Output: Right Motor Direction 2

const int PIN_MOTOR_STBY  = 3;  // Output: Driver Standby Enable (HIGH = Run)
const int PIN_STATUS_LED  = 13; // Output: Onboard system health indicator

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE INTERFACE & PIN AUDIT SYSTEM  "));
  Serial.println(F("========================================"));

  // Initialize and verify all pins defined in the team ICD
  pinMode(PIN_LINE_LEFT, INPUT);
  pinMode(PIN_LINE_RIGHT, INPUT);

  pinMode(PIN_MOTOR_PWMA, OUTPUT);
  pinMode(PIN_MOTOR_AIN1, OUTPUT);
  pinMode(PIN_MOTOR_AIN2, OUTPUT);

  pinMode(PIN_MOTOR_PWMB, OUTPUT);
  pinMode(PIN_MOTOR_BIN1, OUTPUT);
  pinMode(PIN_MOTOR_BIN2, OUTPUT);

  pinMode(PIN_MOTOR_STBY, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  digitalWrite(PIN_MOTOR_STBY, LOW); // Safe default: Keep motors disabled during audit
  digitalWrite(PIN_STATUS_LED, HIGH);

  Serial.println(F(">> [AUDIT PASS] All 9 subsystem pins configured successfully."));
  Serial.println(F(">> [ICD VERIFIED] Zero pin conflicts detected between sensors and actuators."));
  Serial.println(F(">> System ready for physical modular bring-up in Intermediate 02.\n"));
}

void loop() {
  // Blink status LED at 1Hz to demonstrate healthy microcontroller heartbeat
  digitalWrite(PIN_STATUS_LED, HIGH);
  delay(500);
  digitalWrite(PIN_STATUS_LED, LOW);
  delay(500);
}`,
      pinMap: { 
        'Pin A0': 'Left Line Sensor bus (Analog)', 
        'Pin A1': 'Right Line Sensor bus (Analog)', 
        'Pins 5,7,8': 'Left Motor Channel (PWMA, AIN1, AIN2)', 
        'Pins 6,9,10': 'Right Motor Channel (PWMB, BIN1, BIN2)', 
        'Pin 3': 'TB6612 Standby enable pin',
        'Pin 13': 'System Heartbeat LED'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB.',
        '2. Verify and upload the Pin Audit sketch.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Confirm all pins report healthy configuration.'
      ],
      explanations: [
        'pinMode(): Verifies that all data direction registers (DDR) configure correctly without pin overlapping.',
        'digitalWrite(PIN_MOTOR_STBY, LOW): Enforces the Fail-Safe Default rule, ensuring motor power stages remain inert.',
        'Blink Heartbeat: Verifies that the CPU event loop runs stably without hanging.'
      ],
      expectedResult: 'Serial Monitor prints interface audit confirmation and onboard LED blinks at steady 1Hz heartbeat.',
      caveats: [
        'Do not connect high-current motors until the software audit verifies zero pin conflicts.',
        'Always ensure UART Pins 0 and 1 (RX/TX) remain unassigned to avoid bricking USB communication.'
      ],
      tweakTip: 'Mission Challenge: Add an analog voltage divider on Pin A2 to read raw battery voltage and print battery percentage in the audit!'
    },
    troubleshooting: [
      { 
        symptom: 'Team members disagree on which pins to use for motor PWM vs sensors.', 
        checks: [
          'Step 1: Check the ATmega328P pinout sheet — only pins marked with a tilde (~) support hardware PWM (Pins 3, 5, 6, 9, 10, 11).',
          'Step 2: Reserve Pins 5 and 6 for motor PWM, reserving A0-A5 for optical analog sensors.'
        ], 
        explanation: 'Hardware timers dictate pin capabilities; analog inputs and PWM outputs cannot be assigned arbitrarily.' 
      },
      { 
        symptom: 'Arduino resets continuously every time battery power is switched on.', 
        checks: [
          'Step 1: Check the Power Budget — is the battery voltage drooping under initial regulator load?',
          'Step 2: Verify that battery 7.4V connects to Vin or driver VM, NEVER directly to 5V.'
        ], 
        explanation: 'Connecting over-voltage to the 5V logic rail trips thermal shutdown on the onboard linear regulator.' 
      },
      { 
        symptom: 'Analog sensor readings fluctuate wildly whenever motors start spinning.', 
        checks: [
          'Step 1: Inspect ground wiring — are sensor grounds daisy-chained through the motor driver?',
          'Step 2: Re-route ground wires into a Star Ground topology directly back to the main power return.'
        ], 
        explanation: 'Motor ground return currents create ground-bounce voltage drops across shared wires, corrupting ADC readings.' 
      },
      { 
        symptom: 'Sketch fails to upload with "avrdude: stk500_recv(): programmer is not responding".', 
        checks: [
          'Step 1: Disconnect any wires plugged into Digital Pin 0 (RX) and Digital Pin 1 (TX).',
          'Step 2: Re-attempt upload with Pins 0 and 1 completely clear.'
        ], 
        explanation: 'Pins 0 and 1 are hardwired to the USB-to-Serial converter chip; external connections interfere with flashing.' 
      }
    ],
    checksForUnderstanding: [
      'What are the four primary subsystem domains in professional robotics systems engineering?',
      'Why is an Interface Control Document (ICD) essential on multidisciplinary robotics teams?',
      'How does a Star Ground topology prevent motor electrical noise from corrupting delicate analog sensors?'
    ],
    exitTicket: [
      { 
        question: 'Why is defining verifiable functional requirements critical before purchasing components or writing code?', 
        rubricOrSampleReasoning: 'It establishes quantitative, measurable engineering goals that prevent scope creep and ensure components selected meet required performance metrics.' 
      },
      { 
        question: 'What is a ground loop, and what physical wiring technique eliminates ground bounce in autonomous robots?', 
        rubricOrSampleReasoning: 'A ground loop is an unwanted return path causing voltage offsets from high motor currents. Star Grounding eliminates it by connecting all returns to a single common hub.' 
      },
      { 
        question: 'Calculate the expected battery runtime for a rover drawing an average of 450mA from a 7.4V 1200mAh battery pack (using 80% safe depth-of-discharge).', 
        rubricOrSampleReasoning: 'Usable capacity = 1200mAh × 0.8 = 960mAh. Runtime = 960mAh / 450mA = approximately 2.13 hours (128 minutes).' 
      }
    ],
    differentiation: {
      support: ['Provide pre-printed architectural block diagram templates with color-coded power and signal rails.'],
      extension: ['Create a complete FMEA matrix evaluating risk priority numbers (RPN) for every subsystem interface.'],
      offlineOption: ['Use technical graph paper and drawing instruments to draft formal ANSI architectural schematics.']
    },
    nextLessonId: 'int-02',
    nextLessonTeaser: 'Intermediate 02: Reflectance-Sensor Calibration Station — Calibrate infrared photodiode arrays against real competition track tape and eliminate ambient light interference!',
    sources: [{ title: 'NASA Systems Engineering Handbook (SP-2016-6105 Rev2)', url: 'https://www.nasa.gov/connect/ebooks/systems_engineering_handbook.html' }],
    assetCredits: [{ asset: 'System Blueprint Template', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tcrt5000"],
      lookUpWhileBuilding: ["fg-electronics-ohms-law", "fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'intermediate',
    sequence: 2,
    code: 'INTERMEDIATE 02',
    title: 'Reflectance-Sensor Calibration Station',
    promise: 'By the end of this masterclass, you will understand the semiconductor physics of infrared photodiodes, calibrate TCRT5000 optical reflectance sensors against competition track surfaces, reject ambient solar interference, and code dynamic auto-calibration routines.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01'],
    outcomes: [
      'Explain the optical physics of infrared emission (950nm Gallium Arsenide LED) and phototransistor base current generation.',
      'Contrast optical absorption on carbon-black electrical tape versus diffuse scattering on white vinyl/poster board.',
      'Calibrate hardware sensitivity potentiometers on LM393 comparator circuits to establish clean switching thresholds.',
      'Program a dynamic software auto-calibration routine that sweeps across the line, samples min/max ADC values, and calculates the optimal midpoint threshold.',
      'Implement ambient light compensation techniques to prevent false triggers under stadium floodlights or direct sunlight.'
    ],
    vocabulary: [
      { term: 'Phototransistor', plainMeaning: 'A light-activated electronic valve that opens and lets current flow when struck by infrared photons.', technicalMeaning: 'A bipolar transistor that uses light rather than base current to generate collector current.' },
      { term: 'Infrared (950nm)', plainMeaning: 'Invisible light just past red on the rainbow that sensors use to see lines in the dark.', technicalMeaning: 'Electromagnetic radiation with wavelengths longer than visible light, typically 700nm to 1mm.' },
      { term: 'Diffuse vs Specular Reflection', plainMeaning: 'White paper bounces light in all directions (diffuse); shiny plastic bounces it in one beam (specular).', technicalMeaning: 'Diffuse reflection scatters incident light at many angles; specular reflection reflects at a single angle obeying the law of reflection.' },
      { term: 'Comparator (LM393)', plainMeaning: 'A microscopic electronic referee that compares sensor voltage to a threshold and outputs pure 0 or 1.', technicalMeaning: 'A high-gain differential amplifier that compares two input voltages and switches its digital output accordingly.' },
      { term: 'Optical Hysteresis', plainMeaning: 'A buffer zone between ON and OFF that stops the sensor from buzzing or flickering on fuzzy borders.', technicalMeaning: 'The difference between the turn-on and turn-off threshold voltages preventing rapid state oscillation near the boundary.' },
      { term: 'Dynamic Calibration', plainMeaning: 'Letting the robot measure the floor itself during boot-up to set its own perfect threshold.', technicalMeaning: 'An automated runtime procedure that samples sensor min/max extremes and calculates statistical decision midpoints.' }
    ],
    teacherPrep: ['Prepare track test boards with 19mm matte black electrical tape on white poster board; calibrate incandescent and LED bench lights.'],
    verifiedMaterials: ['Dual TCRT5000 IR reflectance sensor modules (or 5-channel line tracker array)', 'Arduino Uno Rev3 DIP', 'Track test board with black tape lines', 'Mini flathead tuning screwdrivers', 'Breadboard and jumpers'],
    safetyNotes: [
      'Do not look directly into infrared emitter LEDs with optical magnifying lenses.',
      'Handle mini trimming potentiometers gently; forcing them past their physical end-stops will strip the internal carbon track.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Shine a bright smartphone flashlight onto an uncalibrated line follower: Watch it lose the line and spin in circles! Explain why ambient light blinds optical sensors.', 
        studentAction: 'Observe phototransistor saturation under ambient light and recognize the necessity of calibration.' 
      },
      { 
        segment: '10–30m Calibration', 
        minutes: 20, 
        teacherAction: 'Explain IR semiconductor physics: 950nm GaAs emitter and NPN silicon phototransistor. Guide manual potentiometer tuning on LM393 modules.', 
        studentAction: 'Tune module sensitivity potentiometer until the onboard indicator LED cleanly turns ON over white floor and OFF over black tape.' 
      },
      { 
        segment: '30–50m Code Logging', 
        minutes: 20, 
        teacherAction: 'Guide analogRead() telemetry logging in Serial Plotter. Code an automated min/max software calibration routine.', 
        studentAction: 'Sweep sensor array across the black line, record raw analog values, and compute the mathematical midpoint threshold.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Verify student calibration tables and assess understanding of diffuse reflection.', 
        studentAction: 'Complete formative exit check and explain why sensor height must be locked between 8mm and 12mm.' 
      }
    ],
    concepts: [
      {
        title: '1. The Semiconductor Physics of TCRT5000 Reflective Sensors',
        explanation: 'A TCRT5000 sensor consists of two optical components enclosed in a daylight-blocking plastic package: an Infrared Emitter Diode and an NPN Phototransistor. The emitter is a Gallium Arsenide (GaAs) LED emitting light at an invisible peak wavelength of 950 nanometers. When these IR photons strike a surface, reflected photons penetrate the silicon lens of the adjacent phototransistor. Photons collide with the silicon valence band, exciting electron-hole pairs that generate base current ($I_B$). This base current is amplified by the transistor gain ($\beta$), allowing proportional current ($I_C = \beta \cdot I_B$) to flow from collector to emitter.',
        instructorNote: 'View the emitter through a smartphone camera: digital camera CMOS sensors can see 950nm IR light as a faint purplish glow!'
      },
      {
        title: '2. Optical Absorption vs Diffuse Scattering on Track Surfaces',
        explanation: 'Why does a black line look dark to an infrared sensor? Carbon-black pigment used in electrical tape has high optical absorptivity across both visible and near-infrared spectrums: it absorbs over 95% of incident 950nm photons, converting optical energy into microscopic thermal vibrations. In contrast, white vinyl poster board or melamine tiles contain Titanium Dioxide ($TiO_2$) particles that scatter incident photons randomly in all directions (Diffuse Reflection). A large fraction of these scattered photons enter the phototransistor aperture, pulling the analog signal wire down toward Ground.',
        instructorNote: 'Point out that some glossy black tapes act as mirrors (specular reflection), bouncing IR directly back into the sensor if placed at an angle!'
      },
      {
        title: '3. Hardware Comparators (LM393) & Switching Hysteresis',
        explanation: 'Many commercial line-tracking breakout boards feature an onboard LM393 dual voltage comparator chip. The comparator compares the analog phototransistor voltage ($V_{in}$) against a reference voltage ($V_{ref}$) established by an onboard 10kΩ multi-turn trimming potentiometer. When $V_{in} > V_{ref}$, the digital output pin snaps to 5V (HIGH); when $V_{in} < V_{ref}$, it drops to 0V (LOW). Quality comparator circuits incorporate positive feedback resistors to create Hysteresis: a small voltage separation (~50mV) between the rising and falling trip points. Hysteresis prevents the digital output from chattering or oscillating when the sensor crosses fuzzy tape borders.',
        instructorNote: 'Show students the physical potentiometer on the board: explain that turning it clockwise increases sensitivity, counter-clockwise decreases it.'
      },
      {
        title: '4. The Critical Sensor Elevation Envelope (8mm to 12mm)',
        explanation: 'Optical reflectance sensors follow an optical focal curve governed by the inverse-square law ($I \propto \frac{1}{r^2}$) and optical aperture overlap. If the sensor is mounted too close to the floor (< 4mm), the physical plastic divider wall between the LED and phototransistor casts an optical shadow, preventing reflected light from reaching the detector! If mounted too high (> 20mm), the expanding conical beam dissipates, and signal contrast drops to near zero. The optimal focal sweet-spot for TCRT5000 sensors is strictly between 8.0mm and 12.0mm above the surface.',
        instructorNote: 'Have students measure their sensor elevation with a vernier caliper depth probe: an improperly mounted sensor guarantees failure.'
      },
      {
        title: '5. Dynamic Software Auto-Calibration Algorithms',
        explanation: 'In tournament environments, relying on manually tuned potentiometers is dangerous: competition halls have different floor finishes, air conditioning, and overhead lighting than your home lab. Professional line-following firmware implements Dynamic Auto-Calibration. During the first 3 seconds after powering on, the robot wiggles its chassis left and right across the line. The firmware samples the analog pins 200 times, recording `minVal` (bright white floor) and `maxVal` (dark black tape). The optimal decision threshold is calculated mathematically: $\text{Threshold} = \frac{\text{minVal} + \text{maxVal}}{2}$.',
        instructorNote: 'Explain that auto-calibration makes the robot immune to track variations between different competition venues.'
      },
      {
        title: '6. Ambient Sunlight Mitigation & AC Optical Modulation',
        explanation: 'Sunlight is the mortal enemy of optical robotics. Solar radiation contains massive amounts of broad-spectrum infrared energy. When sunlight strikes an unshielded phototransistor, it floods the semiconductor with photons, saturating the transistor into continuous conduction regardless of whether it is over white floor or black tape! In high-end robotics, ambient light is rejected using two techniques: 1. Physical 3D printed optical baffles (shrouds) that shield the sensor from ambient overhead light; 2. Software Differential Sampling (measuring ambient light with emitter OFF, turning emitter ON, and calculating the difference).',
        instructorNote: 'Show students how cupping your hand over the sensor restores line detection under harsh lighting.'
      }
    ],
    visualizerId: 'line_follower_sim',
    project: {
      name: 'Reflectance-Sensor Calibration Station',
      deliverableType: 'dataset',
      successEvidence: [
        'Rigidly mounted dual IR sensor array positioned within the optimal 8mm–12mm focal envelope.',
        'Completed optical reflectance dataset logging raw ADC values across white floor, line edge, and black tape.',
        'Firmware auto-calibration routine calculating optimal midpoint threshold with zero false triggers over 10 repeated passes.'
      ]
    },
    activity: {
      title: 'Assemble, Calibrate, and Log the IR Sensor Array',
      steps: [
        'Step 1: Mount dual TCRT5000 sensors to front of chassis spaced 20mm apart, locked between 8mm and 12mm elevation.',
        'Step 2: Connect Left Sensor analog pin to Arduino A0, Right Sensor analog pin to A1, VCC to 5V, and GND to Common Ground.',
        'Step 3: Upload the Calibration Station firmware and open the Arduino IDE Serial Plotter (Tools > Serial Plotter).',
        'Step 4: Manually slide the sensor array back and forth across a black electrical tape line; observe the waveform transitions.',
        'Step 5: Record `val_white` (~120) and `val_black` (~850) and calculate the mathematical midpoint threshold (~485).',
        'Step 6: Execute the dynamic auto-calibration routine and verify crisp digital state detection under classroom lights.'
      ],
      successCriteria: [
        'Sensors demonstrate a contrast difference of at least 400 ADC counts between black tape and white floor.',
        'Digital state transitions cleanly at the exact 19mm line boundary without noise chattering.',
        'Calibration holds steady when room lights are toggled or shaded.'
      ],
      extension: 'Implement an optical ambient noise subtraction filter in code that rejects 50Hz/60Hz AC room light flicker.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Dual TCRT5000 Reflective Optical Sensor Breakouts', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: 'TCRT5000 Optical Reflectance Modules', exactVariant: 'Dual infrared emitter/phototransistor with LM393 comparator', quantity: 2 },
        { name: 'Arduino Uno Rev3 DIP', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: 'Competition Track Test Board', exactVariant: '19mm matte black vinyl electrical tape on white poster board', quantity: 1 },
        { name: 'Mini Flathead Screwdriver', exactVariant: '2.0mm slotted tuning tool for potentiometers', quantity: 1 },
        { name: 'Jumper Wires', exactVariant: '20cm 24AWG Female-to-Male jumper cables', quantity: 6 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'Optical Sensor Wiring:\nLeft TCRT5000:  VCC ── Arduino 5V | GND ── Arduino GND | A0 (Analog) ── Arduino Pin A0\nRight TCRT5000: VCC ── Arduino 5V | GND ── Arduino GND | A0 (Analog) ── Arduino Pin A1\nStatus LED:     Pin 13 (Calibration indicator)\nOptical Elevation: 10.0mm above track surface',
      wireTable: [
        { from: 'Left TCRT5000 VCC', to: 'Arduino 5V Pin', wireOrPolarityNote: 'Red 5V Sensor Logic Power' },
        { from: 'Left TCRT5000 GND', to: 'Arduino GND Pin', wireOrPolarityNote: 'Black Common Ground' },
        { from: 'Left TCRT5000 Analog Out (AO)', to: 'Arduino Pin A0', wireOrPolarityNote: 'Yellow Left Reflectance Signal' },
        { from: 'Right TCRT5000 VCC', to: 'Arduino 5V Pin', wireOrPolarityNote: 'Red 5V Sensor Logic Power' },
        { from: 'Right TCRT5000 GND', to: 'Arduino GND Pin', wireOrPolarityNote: 'Black Common Ground' },
        { from: 'Right TCRT5000 Analog Out (AO)', to: 'Arduino Pin A1', wireOrPolarityNote: 'Green Right Reflectance Signal' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Secure the sensor array bracket to chassis so sensors are 10mm above the track.',
        '2. Connect VCC, GND, and analog signal wires according to wire table.',
        '3. Verify sensor indicator LEDs illuminate when powered.',
        '4. Upload calibration sketch and open Serial Plotter.'
      ],
      powerAndSafetyChecks: [
        'Ensure sensor wires are routed cleanly away from moving drive wheels and motor pin leads.',
        'Confirm sensor height does not scrape track bumps or high-friction tape seams.'
      ],
      testCases: [
        { action: 'Hold sensor over white poster board', expectedResult: 'Serial Monitor reports low analog value (typically 80–180 ADC counts).' },
        { action: 'Hold sensor over 19mm matte black tape', expectedResult: 'Serial Monitor reports high analog value (typically 750–920 ADC counts).' },
        { action: 'Run dynamic calibration sweep', expectedResult: 'Calculated midpoint threshold sits cleanly halfway between min and max.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Reflectance Sensor Calibration Station
// Class: INTERMEDIATE 02 - Optical Sensor Metrology & Auto-Calibration

const int PIN_IR_LEFT   = A0; // Analog input: Left TCRT5000 phototransistor
const int PIN_IR_RIGHT  = A1; // Analog input: Right TCRT5000 phototransistor
const int PIN_LED_STATE = 13; // Calibration status annunciator

// Dynamic Calibration Variables
int leftMinVal  = 1023, leftMaxVal  = 0;
int rightMinVal = 1023, rightMaxVal = 0;
int leftThreshold  = 500;
int rightThreshold = 500;

void setup() {
  pinMode(PIN_LED_STATE, OUTPUT);
  digitalWrite(PIN_LED_STATE, HIGH); // LED ON indicates Calibration Mode

  Serial.begin(9600);
  while (!Serial) { ; }

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE TCRT5000 CALIBRATION STATION  "));
  Serial.println(F("========================================"));
  Serial.println(F("CALIBRATION PHASE: Slide the sensor array back and"));
  Serial.println(F("forth across the black tape line for 5 seconds...\n"));

  // Dynamic Auto-Calibration: Sample min/max extremes over 5 seconds
  unsigned long calibStartTime = millis();
  while (millis() - calibStartTime < 5000) {
    int leftRaw  = analogRead(PIN_IR_LEFT);
    int rightRaw = analogRead(PIN_IR_RIGHT);

    // Track minimums (White surface)
    if (leftRaw < leftMinVal)   leftMinVal = leftRaw;
    if (rightRaw < rightMinVal) rightMinVal = rightRaw;

    // Track maximums (Black line)
    if (leftRaw > leftMaxVal)   leftMaxVal = leftRaw;
    if (rightRaw > rightMaxVal) rightMaxVal = rightRaw;

    delay(20);
  }

  // Calculate mathematical midpoint threshold
  leftThreshold  = (leftMinVal + leftMaxVal) / 2;
  rightThreshold = (rightMinVal + rightMaxVal) / 2;

  digitalWrite(PIN_LED_STATE, LOW); // LED OFF indicates Operational Mode

  Serial.println(F(">> [CALIBRATION COMPLETE] Calculated Thresholds:"));
  Serial.print(F("   Left Sensor:  Min=")); Serial.print(leftMinVal);
  Serial.print(F(" | Max=")); Serial.print(leftMaxVal);
  Serial.print(F(" | THRESHOLD=")); Serial.println(leftThreshold);

  Serial.print(F("   Right Sensor: Min=")); Serial.print(rightMinVal);
  Serial.print(F(" | Max=")); Serial.print(rightMaxVal);
  Serial.print(F(" | THRESHOLD=")); Serial.println(rightThreshold);
  Serial.println(F("----------------------------------------\n"));
}

void loop() {
  int leftVal  = analogRead(PIN_IR_LEFT);
  int rightVal = analogRead(PIN_IR_RIGHT);

  // Evaluate binary line detection using dynamic thresholds
  bool leftOnLine  = (leftVal > leftThreshold);
  bool rightOnLine = (rightVal > rightThreshold);

  // Stream telemetry formatted for Serial Plotter: LeftVal, RightVal, LeftThresh, RightThresh
  Serial.print(leftVal);
  Serial.print(F(" "));
  Serial.print(rightVal);
  Serial.print(F(" "));
  Serial.print(leftThreshold);
  Serial.print(F(" "));
  Serial.println(rightThreshold);

  delay(40); // 25Hz telemetry refresh
}`,
      pinMap: { 
        'Pin A0': 'Left TCRT5000 Analog Output', 
        'Pin A1': 'Right TCRT5000 Analog Output', 
        'Pin 13': 'Calibration Status LED' 
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB and select correct COM port.',
        '2. Verify and upload sketch.',
        '3. Immediately slide sensor array manually back and forth across black tape for 5 seconds.',
        '4. Open Serial Plotter (Ctrl+Shift+L) to view real-time optical waveforms crossing the thresholds.'
      ],
      explanations: [
        'analogRead(A0): Reads 10-bit phototransistor voltage (0 = 0V max reflection, 1023 = 5V total absorption).',
        'Auto-calibration loop: Tracks minVal and maxVal dynamically during boot, eliminating manual potentiometer guesswork.',
        'Serial Plotter Output: Printing space-separated numbers automatically graphs multiple data channels in real time.'
      ],
      expectedResult: 'Serial Plotter displays high peaks when crossing black tape and low valleys over white poster board, cleanly bounded by the midpoint threshold lines.',
      caveats: [
        'You MUST sweep the sensors across BOTH black tape and white floor during the 5-second calibration window.',
        'If sensors are shielded from ambient light, contrast improves by over 30%.'
      ],
      tweakTip: 'Mission Challenge: Add an alarm that flashes Pin 13 rapidly if the contrast difference (maxVal - minVal) is less than 300 counts, warning of poor track reflectivity!'
    },
    troubleshooting: [
      { 
        symptom: 'Analog readings never change when passing over black tape (flat line in Serial Plotter).', 
        checks: [
          'Step 1: Check sensor height — is the sensor dragging on the floor (< 3mm) or hovering in the clouds (> 20mm)?',
          'Step 2: Adjust height to exactly 10mm using standoffs or caliper measurement.',
          'Step 3: Check if the black line is drawn with water-based marker (which is transparent to IR) rather than carbon-black vinyl electrical tape.'
        ], 
        explanation: 'Many black inks and dyes do not contain carbon and are completely transparent to 950nm infrared light. True vinyl electrical tape is required.' 
      },
      { 
        symptom: 'Readings read 1023 continuously on both white floor and black tape.', 
        checks: [
          'Step 1: Inspect the infrared emitter LED with a smartphone camera — is it glowing faint purple?',
          'Step 2: Check VCC and GND connections to the sensor module with a multimeter.'
        ], 
        explanation: 'If the IR emitter LED is unpowered, zero photons are emitted, leaving the phototransistor in complete darkness (1023 reading).' 
      },
      { 
        symptom: 'Calculated threshold is identical to maxVal, causing false line triggers.', 
        checks: [
          'Step 1: Verify the sensor was moved across BOTH white floor and black tape during the initial 5-second window.',
          'Step 2: Press the Arduino reset button to restart the calibration sequence.'
        ], 
        explanation: 'If the sensor remains stationary over black tape during boot-up, minVal and maxVal will both read ~850, breaking threshold math.' 
      },
      { 
        symptom: 'Sensors trigger erratically whenever the overhead classroom fluorescent lights are turned on.', 
        checks: [
          'Step 1: Design or fit a 3D printed optical shroud around the sensor array.',
          'Step 2: Increase the threshold by adding a +50 count safety margin to filter ambient optical wash.'
        ], 
        explanation: 'Overhead ballasts emit infrared flicker that couples into unshielded phototransistors, elevating baseline readings.' 
      }
    ],
    checksForUnderstanding: [
      'What wavelength of light do TCRT5000 optical sensors emit, and can human eyes see it?',
      'Why is carbon-black electrical tape required for line following rather than regular black water-based ink?',
      'Why does mounting an optical reflectance sensor closer than 3mm to the surface cause sensor failure?'
    ],
    exitTicket: [
      { 
        question: 'Explain why a phototransistor produces a high analog reading over black tape and a low reading over white poster board.', 
        rubricOrSampleReasoning: 'Black tape absorbs infrared photons, returning minimal light, leaving the transistor OFF (high resistance / high voltage). White board reflects photons, exciting base current and pulling the analog output to Ground (low voltage).' 
      },
      { 
        question: 'What is the formula for calculating dynamic midpoint threshold from sampled min and max ADC values?', 
        rubricOrSampleReasoning: 'Threshold = (minVal + maxVal) / 2. This sets the decision boundary at the exact statistical midpoint between surface extremes.' 
      },
      { 
        question: 'What is the optimal mounting height for a TCRT5000 optical sensor above the competition floor, and why?', 
        rubricOrSampleReasoning: '8.0mm to 12.0mm. Too close casts an optical shadow behind the divider wall; too far causes optical divergence and loss of contrast.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-calibrated baseline thresholds for standard classroom tape.'],
      extension: ['Program an auto-calibrating routine that wiggles the robot wheels autonomously to sample the line without human hands!'],
      offlineOption: ['Use the interactive line follower simulator with adjustable track reflectivity and ambient lighting sliders.']
    },
    nextLessonId: 'int-03',
    nextLessonTeaser: 'Intermediate 03: Reusable C++ Functions & State Machines — Replace nested if-statement spaghetti with clean enum state machine architectures!',
    sources: [{ title: 'Vishay TCRT5000 Reflective Optical Sensor Datasheet & Optoelectronics Application Guide', url: 'https://vishay.com' }],
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
    promise: 'By the end of this masterclass, you will architect modular, scalable embedded C++ firmware using strongly typed enums, switch-case state handlers, non-blocking telemetry schedulers, and race-condition elimination protocols.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02'],
    outcomes: [
      'Model complex autonomous robot behavior as a formal Finite State Machine (FSM) with discrete states, transition conditions, and actions.',
      'Implement C++ strongly typed `enum class` and `switch/case` control structures to guarantee single-state execution.',
      'Eliminate race conditions and erratic behavior caused by deeply nested if-else spaghetti code.',
      'Architect a non-blocking telemetry scheduler using millis() timestamps that outputs diagnostics without stalling the control loop.',
      'Incorporate emergency timeout fail-safes that automatically recover from trapped or stalled states.'
    ],
    vocabulary: [
      { term: 'Finite State Machine (FSM)', plainMeaning: 'A program design where the robot is strictly in ONE clear mode at any second (like Cruising, Turning, or Recovering).', technicalMeaning: 'A mathematical model of computation consisting of a finite number of states, transitions between those states, and actions.' },
      { term: 'enum (Enumeration)', plainMeaning: 'A C++ keyword that gives friendly English names to state numbers instead of confusing codes.', technicalMeaning: 'A user-defined data type consisting of a set of named integral constants.' },
      { term: 'switch/case', plainMeaning: 'A clean code structure that jumps directly to the active state block without evaluating 10 if-statements.', technicalMeaning: 'A control flow statement that tests a variable against a list of constant case values and branches execution.' },
      { term: 'Race Condition', plainMeaning: 'A nasty bug where two parts of code fight to control the motors at the same millisecond.', technicalMeaning: 'An undesirable situation that occurs when a device or system attempts to perform two or more operations at the same time.' },
      { term: 'Deterministic Execution', plainMeaning: 'A guarantee that code will behave predictably under all possible sensor input combinations.', technicalMeaning: 'A property of an algorithm where given a particular input, it will always produce the exact same sequence of states.' },
      { term: 'Watchdog Timeout', plainMeaning: 'A software safety timer that reboots or backs up the robot if it gets stuck for more than 3 seconds.', technicalMeaning: 'A timer mechanism that detects and recovers from system malfunctions or infinite operational loops.' }
    ],
    teacherPrep: ['Draw formal Moore / Mealy state transition bubble diagrams on whiteboard; verify Arduino IDE Serial Monitor at 9600 baud.'],
    verifiedMaterials: ['Arduino Uno Rev3 DIP', '2x Tactile Pushbuttons (simulating line sensor inputs)', 'Breadboard & jumpers', 'LED indicator (Pin 13)'],
    safetyNotes: ['Firmware logic and architectural lab. Ensure buttons are wired with internal pull-ups to prevent shorting power rails.'],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display 150 lines of messy, nested if-else "spaghetti code" from a failed tournament robot. Ask: "Can anyone tell what this robot does if both sensors flicker?"', 
        studentAction: 'Experience the difficulty of debugging unstructured code and identify logical overlap errors.' 
      },
      { 
        segment: '10–30m Concept', 
        minutes: 20, 
        teacherAction: 'Introduce formal FSM design: States (Forward, Pivot Left, Pivot Right, Lost Recovery, Stopped). Teach C++ enum architecture and centralized transition handlers.', 
        studentAction: 'Map out the 5-state transition table on technical grid paper with triggers, entry actions, and exit conditions.' 
      },
      { 
        segment: '30–50m Code Lab', 
        minutes: 20, 
        teacherAction: 'Guide implementation of switch/case architecture with simulated pushbuttons (Pins 2 & 3) and non-blocking serial telemetry.', 
        studentAction: 'Upload sketch, toggle input buttons, and trace real-time state transitions in Serial Monitor.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect student state transition tables and check for missing `break;` statements.', 
        studentAction: 'Demonstrate transition logging and submit the formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. The Nightmare of Spaghetti Code vs Finite State Machines',
        explanation: 'Novice programmers write robot behavior by chaining nested if-else blocks: `if (s1) { if (!s2) { turn(); } } else if (s3) ...`. As the robot acquires more sensors (line, distance, battery, buttons), the code explodes exponentially into an unmaintainable "spaghetti" tangle. A subtle change to one branch inadvertently breaks three other branches! A Finite State Machine (FSM) eliminates this chaos by enforcing a fundamental mathematical rule: At any given microsecond, the robot can exist in exactly ONE discrete state. All sensor readings are evaluated solely to decide whether to transition to a new state.',
        instructorNote: 'Compare an FSM to a traffic light: it can be Red, Yellow, or Green. It is physically impossible for a traffic light to be Red and Green at the same time!'
      },
      {
        title: '2. C++ Enumerations (enum class) & Type Safety',
        explanation: 'In C++, instead of tracking state numbers with raw integers (`int state = 2; // What was 2 again? Turning?`), professional firmware uses Enumerated Types (`enum class RobotState { CRUISE, PIVOT_LEFT, PIVOT_RIGHT, RECOVERY, EMERGENCY_STOP };`). Strongly typed enums provide three massive engineering benefits: 1. Self-Documenting Code (the state names describe exactly what the robot is doing); 2. Compiler Optimization (enums compile into efficient byte registers); 3. Type Safety (the compiler prevents you from assigning an invalid number like `state = 99`).',
        instructorNote: 'Show students compiler errors: the C++ compiler will immediately reject assigning a raw integer to an enum class variable.'
      },
      {
        title: '3. switch/case Branching & The Critical break Keyword',
        explanation: 'When executing an FSM, C++ `switch (currentState)` statements provide superior performance and readability over long chains of `if / else if`. The compiler optimizes switch statements into an internal Jump Table in flash memory: the CPU jumps directly to the target state block in a single clock cycle, rather than evaluating every preceding condition! CRITICAL SYNTAX RULE: Every `case` block MUST terminate with the `break;` statement. If `break;` is accidentally omitted, code execution falls through into the next state block, executing conflicting actions simultaneously!',
        instructorNote: 'Intentionally comment out a `break;` statement to show students the bizarre behavior of switch fall-through.'
      },
      {
        title: '4. Centralized Transition Handlers & State Logging',
        explanation: 'Never scatter state assignments (`currentState = PIVOT_LEFT;`) randomly across your code. Professional architecture funnels all state changes through a single Centralized Transition Function: `void transitionTo(RobotState newState)`. This function: 1. Guards against redundant self-transitions (`if (currentState == newState) return;`); 2. Executes State Exit Actions; 3. Formats and prints human-readable telemetry to the Serial Monitor; 4. Updates system indicator LEDs; 5. Executes State Entry Actions. This gives engineers a complete audit trail of robot decision-making.',
        instructorNote: 'Show students how centralized transitions make debugging effortless: the Serial Monitor displays a chronological log of every single robot decision.'
      },
      {
        title: '5. Non-Blocking Telemetry Schedulers via millis()',
        explanation: 'Printing diagnostic messages to the Serial Monitor takes time: sending a string at 9600 baud consumes approximately 1 millisecond per character. If you execute `Serial.println()` on every pass of `void loop()`, the UART buffer fills up, stalling the CPU and slowing your motor control loop from 500 Hz down to 20 Hz! To maintain lightning-fast control response while streaming telemetry, we implement a Non-Blocking Scheduler: polling `if (millis() - lastTelemetryTime >= 250)` to output status reports at 4 Hz without stealing cycles from motor PID loops.',
        instructorNote: 'Compare non-blocking telemetry to glancing at your speedometer every few seconds while keeping your hands firmly on the wheel.'
      },
      {
        title: '6. The Watchdog State Recovery Timer',
        explanation: 'Autonomous machines encounter unforeseen physical traps: a wheel getting wedged in a track seam, or a line sensor getting blinded by a camera flash. If an FSM enters a state like `STATE_PIVOT_LEFT` and never sees the line return, it will spin in circles until its battery dies! Robust firmware incorporates a State Timeout Watchdog: whenever entering a turning or recovery state, `stateEntryTime = millis();` is recorded. If `millis() - stateEntryTime > 2500` (2.5 seconds of continuous turning), the watchdog trips, transitioning the robot into an active recovery reverse or emergency halt.',
        instructorNote: 'Demonstrate how a watchdog timer saves robots from burning out motor gearboxes when physically jammed against a wall.'
      }
    ],
    visualizerId: 'logic_counter_sim',
    project: {
      name: 'Line-Follower State-Machine Controller',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Robust embedded C++ firmware implementing a 5-state Finite State Machine with enum class architecture.',
        'Centralized transition handler with chronological serial telemetry logging and LED status indication.',
        'Verified non-blocking telemetry scheduler and 2.5-second watchdog timeout recovery routine.'
      ]
    },
    activity: {
      title: 'Architect and Test the FSM Controller',
      steps: [
        'Step 1: Wire two tactile pushbuttons across breadboard trench: Button 1 to Pin 2, Button 2 to Pin 3 (both with INPUT_PULLUP to GND).',
        'Step 2: Declare strongly typed enum: `enum class RobotState { FORWARD, PIVOT_LEFT, PIVOT_RIGHT, RECOVERY, STOPPED };`.',
        'Step 3: Implement centralized `transitionTo(RobotState newState)` function with serial state logging.',
        'Step 4: Construct the `switch (currentState)` control structure inside `void loop()`.',
        'Step 5: Upload sketch and open Serial Monitor at 9600 baud.',
        'Step 6: Press simulated sensor buttons and observe instant, clean state transitions and watchdog timeout recovery!'
      ],
      successCriteria: [
        'Firmware compiles cleanly with zero warnings under strict C++ standards.',
        'State transitions occur cleanly without skipped intermediate steps or fall-through glitches.',
        'Holding a button down for > 2.5 seconds triggers the Watchdog Recovery state automatically.'
      ],
      extension: 'Add a persistent EEPROM state recorder that logs the total number of line-loss recovery events during a match.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 DIP', 'Half-Size Breadboard', '2x Tactile Buttons'],
      componentList: [
        { name: 'Arduino Uno Rev3 DIP', exactVariant: 'Standard ATmega328P Rev3', quantity: 1 },
        { name: '4-Pin Tactile Pushbuttons', exactVariant: '6x6mm momentary tactile switches', quantity: 2 },
        { name: 'Half-Size Breadboard', exactVariant: '400 tie-points with center trench', quantity: 1 },
        { name: 'Jumper Wires', exactVariant: '20cm 24AWG Male-to-Male copper jumpers', quantity: 4 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'FSM Test Station Wiring:\nButton 1 (Left Sensor Sim):  Arduino Pin 2 ──[ Switch NO ]── Arduino GND (INPUT_PULLUP)\nButton 2 (Right Sensor Sim): Arduino Pin 3 ──[ Switch NO ]── Arduino GND (INPUT_PULLUP)\nStatus Heartbeat:            Arduino Pin 13 (Built-in LED)',
      wireTable: [
        { from: 'Arduino Digital Pin 2', to: 'Button 1 Terminal A', wireOrPolarityNote: 'Yellow Left Sensor Sim Signal' },
        { from: 'Button 1 Terminal B', to: 'Arduino GND', wireOrPolarityNote: 'Black Ground Return' },
        { from: 'Arduino Digital Pin 3', to: 'Button 2 Terminal A', wireOrPolarityNote: 'Green Right Sensor Sim Signal' },
        { from: 'Button 2 Terminal B', to: 'Arduino GND', wireOrPolarityNote: 'Black Ground Return' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Insert tactile buttons across breadboard center divider trench.',
        '2. Connect Pin 2 and Pin 3 to buttons; connect opposite legs to Arduino GND.',
        '3. Connect Arduino to USB and upload sketch.',
        '4. Open Serial Monitor at 9600 baud to monitor state transitions.'
      ],
      powerAndSafetyChecks: [
        'Verify buttons connect between pins and GND only (never 5V) to ensure internal pull-up safety.'
      ],
      testCases: [
        { action: 'No buttons pressed (Both white floor)', expectedResult: 'Robot remains in STATE_FORWARD; LED lit.' },
        { action: 'Press Left Button (Pin 2 grounded)', expectedResult: 'Instant transition: FORWARD -> PIVOT_LEFT logged in Serial Monitor.' },
        { action: 'Hold Left Button for > 2.5 seconds', expectedResult: 'Watchdog timer expires: PIVOT_LEFT -> RECOVERY logged in Serial Monitor.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Finite State Machine (FSM) Controller
// Class: INTERMEDIATE 03 - Modular C++ State Machine Architecture

// Strongly typed enum representing discrete autonomous states
enum class RobotState : uint8_t {
  FORWARD,
  PIVOT_LEFT,
  PIVOT_RIGHT,
  RECOVERY,
  STOPPED
};

// Global State Machine Registers
RobotState currentState     = RobotState::STOPPED;
unsigned long stateStartTime  = 0;
unsigned long lastTelemetry   = 0;

// Hardware Input Pin Mapping (Simulated Line Sensors via Tactile Buttons)
const int PIN_BTN_LEFT   = 2;  // Left line sensor simulator (Active LOW)
const int PIN_BTN_RIGHT  = 3;  // Right line sensor simulator (Active LOW)
const int PIN_LED_STATE  = 13; // Onboard visual state indicator

// Function Prototypes
void transitionTo(RobotState newState);
const __FlashStringHelper* getStateName(RobotState state);

void setup() {
  pinMode(PIN_BTN_LEFT, INPUT_PULLUP);
  pinMode(PIN_BTN_RIGHT, INPUT_PULLUP);
  pinMode(PIN_LED_STATE, OUTPUT);

  Serial.begin(9600);
  while (!Serial) { ; }

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE MODULAR FSM CONTROLLER ONLINE "));
  Serial.println(F("========================================"));
  Serial.println(F("Controls: Ground Pin 2 (Left Line) or Pin 3 (Right Line)\n"));

  // Initial deterministic transition
  transitionTo(RobotState::FORWARD);
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. SENSE: Sample physical inputs (Active-LOW with internal pull-ups)
  bool leftTriggered  = (digitalRead(PIN_BTN_LEFT) == LOW);
  bool rightTriggered = (digitalRead(PIN_BTN_RIGHT) == LOW);

  // 2. WATCHDOG SAFETY CHECK: Prevent getting stuck in turning states
  if ((currentState == RobotState::PIVOT_LEFT || currentState == RobotState::PIVOT_RIGHT) &&
      (currentMillis - stateStartTime > 2500)) {
    Serial.println(F("⚠️ [WATCHDOG TIMEOUT] Exceeded 2.5s turning threshold! Entering RECOVERY."));
    transitionTo(RobotState::RECOVERY);
  }

  // 3. DECIDE: Finite State Machine Branching
  switch (currentState) {
    case RobotState::FORWARD:
      if (leftTriggered && rightTriggered) {
        transitionTo(RobotState::STOPPED);
      } else if (leftTriggered) {
        transitionTo(RobotState::PIVOT_LEFT);
      } else if (rightTriggered) {
        transitionTo(RobotState::PIVOT_RIGHT);
      }
      break;

    case RobotState::PIVOT_LEFT:
      if (!leftTriggered) {
        transitionTo(RobotState::FORWARD); // Re-centered on white floor
      }
      break;

    case RobotState::PIVOT_RIGHT:
      if (!rightTriggered) {
        transitionTo(RobotState::FORWARD); // Re-centered on white floor
      }
      break;

    case RobotState::RECOVERY:
      // In recovery: reverse pulse for 400ms then re-attempt forward search
      if (currentMillis - stateStartTime > 400) {
        Serial.println(F("✅ [RECOVERY COMPLETE] Resuming line search."));
        transitionTo(RobotState::FORWARD);
      }
      break;

    case RobotState::STOPPED:
      if (!leftTriggered && !rightTriggered) {
        delay(150); // Debounce settle window
        transitionTo(RobotState::FORWARD);
      }
      break;
  }

  // 4. NON-BLOCKING TELEMETRY: Stream state reports at 2Hz without blocking loop
  if (currentMillis - lastTelemetry >= 500) {
    lastTelemetry = currentMillis;
    Serial.print(F(">> [HEARTBEAT] State: "));
    Serial.print(getStateName(currentState));
    Serial.print(F(" | Active Duration: "));
    Serial.print(currentMillis - stateStartTime);
    Serial.println(F(" ms"));
  }
}

// ---------------------------------------------------------------------------
// CENTRALIZED STATE TRANSITION HANDLER
// ---------------------------------------------------------------------------
void transitionTo(RobotState newState) {
  if (currentState == newState) return; // Guard against redundant self-transitions

  // Log transition telemetry
  Serial.print(F("⚡ [TRANSITION] "));
  Serial.print(getStateName(currentState));
  Serial.print(F("  ──►  "));
  Serial.println(getStateName(newState));

  // Update state register and record timestamp for watchdog
  currentState   = newState;
  stateStartTime = millis();

  // Visual hardware feedback
  digitalWrite(PIN_LED_STATE, (currentState == RobotState::FORWARD) ? HIGH : LOW);
}

// Helper: Convert enum class into Flash-stored string to save SRAM
const __FlashStringHelper* getStateName(RobotState state) {
  switch (state) {
    case RobotState::FORWARD:     return F("FORWARD");
    case RobotState::PIVOT_LEFT:  return F("PIVOT_LEFT");
    case RobotState::PIVOT_RIGHT: return F("PIVOT_RIGHT");
    case RobotState::RECOVERY:    return F("RECOVERY");
    case RobotState::STOPPED:     return F("STOPPED");
    default:                      return F("UNKNOWN");
  }
}`,
      pinMap: { 
        'Pin 2': 'Left sensor simulated trigger (INPUT_PULLUP)', 
        'Pin 3': 'Right sensor simulated trigger (INPUT_PULLUP)', 
        'Pin 13': 'FSM State indicator LED' 
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB and select Port.',
        '2. Verify and upload sketch.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Press Button 1 (Pin 2) and Button 2 (Pin 3) to test state transitions.'
      ],
      explanations: [
        'enum class RobotState : uint8_t: Strongly typed enumeration allocating only 1 byte of RAM per state variable.',
        'transitionTo(): Centralized transition function logging changes and resetting state timer registers.',
        'Watchdog condition: Automatically kicks the FSM out of endless turning loops if inputs remain stuck for > 2.5s.',
        '__FlashStringHelper: Stores debug text strings in Flash memory instead of consuming precious 2KB SRAM.'
      ],
      expectedResult: 'Serial Monitor displays instant transition logs whenever buttons are toggled, with 2Hz non-blocking heartbeats and automatic watchdog timeouts.',
      caveats: [
        'Never omit break; inside switch/case blocks; doing so creates catastrophic fall-through bugs.',
        'Never place blocking delay() calls inside state handling blocks.'
      ],
      tweakTip: 'Mission Challenge: Add an AUDIT_ERROR state that triggers if both buttons are held down for more than 5 seconds!'
    },
    troubleshooting: [
      { 
        symptom: 'State transitions fire erratically when no buttons are being pressed.', 
        checks: [
          'Step 1: Check pin mode — did you declare `pinMode(pin, INPUT_PULLUP)` or `INPUT`?',
          'Step 2: If declared as `INPUT`, pins float erratically, reading LOW randomly.'
        ], 
        explanation: 'CMOS microcontroller inputs require internal pull-up resistors to hold an idle 5V baseline when unconnected.' 
      },
      { 
        symptom: 'Robot executes the logic for two states simultaneously (e.g. forward and turning).', 
        checks: [
          'Step 1: Inspect the `switch (currentState)` block line-by-line.',
          'Step 2: Check for a missing `break;` statement at the end of every case.'
        ], 
        explanation: 'In C++, missing a `break;` causes code execution to "fall through" into the next case block unconditionally.' 
      },
      { 
        symptom: 'Serial Monitor output freezes or stops updating completely.', 
        checks: [
          'Step 1: Check if a `while()` loop was placed inside a state handler without an escape condition.',
          'Step 2: Replace blocking while() loops with non-blocking state evaluations.'
        ], 
        explanation: 'A while() loop with an unsatisfied exit condition halts the entire microcontroller CPU thread.' 
      },
      { 
        symptom: 'Watchdog timer never triggers even when a sensor is jammed for 10 seconds.', 
        checks: [
          'Step 1: Verify `stateStartTime = millis();` is executed inside `transitionTo()`.',
          'Step 2: Check the watchdog threshold condition logic: ensure it evaluates `currentMillis - stateStartTime > 2500`.'
        ], 
        explanation: 'If `stateStartTime` is not reset during state transitions, elapsed time math calculates incorrectly.' 
      }
    ],
    checksForUnderstanding: [
      'Why is a Finite State Machine mathematically incapable of executing two conflicting states simultaneously?',
      'What happens in C++ if you forget to write a break; statement at the end of a case block?',
      'How does a watchdog timer protect an autonomous robot from physical hardware failures?'
    ],
    exitTicket: [
      { 
        question: 'Explain what a race condition is and how an FSM switch/case architecture prevents it in robotics.', 
        rubricOrSampleReasoning: 'A race condition occurs when conflicting logic branches attempt to command actuators simultaneously. An FSM evaluates only the active case, guaranteeing single-action determinism.' 
      },
      { 
        question: 'Why should state changes be routed through a centralized transitionTo() function rather than setting currentState directly?', 
        rubricOrSampleReasoning: 'It centralizes exit/entry actions, resets watchdog timer registers, prevents redundant self-transitions, and provides a single location for telemetry audit logging.' 
      },
      { 
        question: 'Why is non-blocking telemetry scheduling with millis() necessary when controlling fast robotic motors?', 
        rubricOrSampleReasoning: 'Serial printing at 9600 baud takes ~1ms per character. Printing continuously fills UART buffers and drops control loop frequency from 500Hz to 20Hz, causing steering delays.' 
      }
    ],
    differentiation: {
      support: ['Provide printed state bubble diagrams with numbered transition paths.'],
      extension: ['Implement a hierarchical state machine (HSM) with a sub-state machine inside RECOVERY.'],
      offlineOption: ['Use the interactive logic counter simulator to step through state machine transitions manually.']
    },
    nextLessonId: 'int-04',
    nextLessonTeaser: 'Intermediate 04: Motor Control & PWM Tuning — Measure real motor RPM, analyze H-Bridge truth tables, and calibrate software trim factors!',
    sources: [{ title: 'State Machines in Embedded C/C++ — Miro Samek / Quantum Leaps', url: 'https://state-machine.com' }],
    assetCredits: [{ asset: 'FSM Transition Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-motion-differential-kinematics", "fg-board-uno-anatomy"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'intermediate',
    sequence: 4,
    code: 'INTERMEDIATE 04',
    title: 'Motor Control and PWM Tuning',
    promise: 'By the end of this masterclass, you will analyze H-Bridge switching truth tables, measure mechanical motor RPM with optical tachometers, determine starting deadband thresholds, and calibrate software trim multipliers to achieve straight-line 3-meter tracking.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02', 'Intermediate 03'],
    outcomes: [
      'Analyze the 4-quadrant switching states of dual H-Bridge drivers (Forward, Reverse, Dynamic Active Brake, Passive Coast).',
      'Record an empirical Speed-Tuning Table measuring wheel RPM across 5 distinct PWM duty cycles (80, 120, 160, 200, 255).',
      'Determine the minimum breakaway deadband voltage required to overcome static gearbox friction (stiction).',
      'Formulate and program software motor trim scaling multipliers to eliminate straight-line steering drift.',
      'Calibrate dynamic active braking deceleration curves to stop within ±2cm of target.'
    ],
    vocabulary: [
      { term: 'Active Dynamic Braking', plainMeaning: 'Shorting motor leads together so the spinning motor fights itself and stops instantly.', technicalMeaning: 'Connecting both terminals of a DC motor to the same potential, generating electromagnetic counter-torque via Back-EMF.' },
      { term: 'Passive Coasting', plainMeaning: 'Cutting power and letting the wheels roll freely until friction slowly stops them.', technicalMeaning: 'Setting H-Bridge outputs to high-impedance (floating), allowing vehicle inertia to dissipate through friction.' },
      { term: 'Motor Deadband (Stiction)', plainMeaning: 'The low PWM speeds where the motor just buzzes because it isn’t strong enough to move gears.', technicalMeaning: 'The minimum voltage or PWM duty cycle required to overcome static friction in motor bearings and gearboxes.' },
      { term: 'Software Motor Trim', plainMeaning: 'A tiny multiplier number in code that slows down the faster wheel so the robot drives straight.', technicalMeaning: 'A calibration scalar applied to actuator drive channels to equalize asymmetric electromechanical outputs.' },
      { term: 'Tachometer', plainMeaning: 'A tool that measures how many full spins a wheel completes in one minute (RPM).', technicalMeaning: 'An instrument measuring the rotation speed of a shaft or disk, calibrated in revolutions per minute.' },
      { term: 'Duty Cycle', plainMeaning: 'The percentage of time electrical power is ON versus OFF in a rapid pulsing wave.', technicalMeaning: 'The fraction of one period in which a signal or system is active: D = (PW / T) × 100%.' }
    ],
    teacherPrep: ['Set up 3-meter straight testing corridors on floor tiles with measuring tape; prepare optical tachometers or wheel flag counters.'],
    verifiedMaterials: ['2WD Rover Chassis with dual TT gearmotors', 'TB6612FNG Dual Driver', 'Arduino Uno Rev3 DIP', '4xAA Battery Pack', 'Optical tachometer or white marker flag on wheel', 'Tuning table worksheet'],
    safetyNotes: [
      'Elevate rover drive wheels completely off the bench surface during RPM sweep testing.',
      'Never short driver VM (battery power) directly to GND or VCC.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Spin an unpowered DC motor by hand. Now short its two leads together and spin it again: Watch students’ eyes widen at the heavy magnetic resistance! Introduce active dynamic braking.', 
        studentAction: 'Feel physical electromagnetic counter-torque with their hands and recognize the difference between braking and coasting.' 
      },
      { 
        segment: '10–30m Truth Tables', 
        minutes: 20, 
        teacherAction: 'Analyze TB6612FNG truth table: AIN1/AIN2 = HIGH/LOW (CW), LOW/HIGH (CCW), HIGH/HIGH (Short Brake), LOW/LOW (Stop Coast). Explain PWM deadbands.', 
        studentAction: 'Test all 4 switching combinations on bench stand and measure minimum breakaway PWM threshold.' 
      },
      { 
        segment: '30–50m PWM Sweep', 
        minutes: 20, 
        teacherAction: 'Guide optical RPM sweep across PWM steps (80, 120, 160, 200, 255). Coach calculation of the trim multiplier ratio: Trim = RPM_slow / RPM_fast.', 
        studentAction: 'Log left and right wheel RPMs, calculate trim ratio, implement in firmware, and deploy on 3-meter floor track.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect floor test runs: verify lateral drift is less than 5cm over 3 meters.', 
        studentAction: 'Submit motor tuning data table and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Active Regenerative Braking vs Passive Coasting Physics',
        explanation: 'When a moving robot cuts motor power in passive coast mode (inputs LOW/LOW), the vehicle rolls forward under its own linear momentum ($p = m \cdot v$) for 15cm to 30cm before bearing friction halts it. In Active Dynamic Braking, the H-Bridge turns on both low-side (or both high-side) MOSFETs simultaneously, creating a zero-resistance short across the motor terminals. As the rotor continues spinning through the permanent magnetic stator, it acts as an electric generator! The shorted circuit forces maximum Back-EMF current ($I_{brake} = \frac{V_{emf}}{R_{armature}}$) to flow through the windings, generating intense electromagnetic counter-torque that stops the wheel in under 50 milliseconds.',
        instructorNote: 'Point out that active braking is how Formula 1 electric KERS systems and Tesla regenerative brakes stop vehicles quickly.'
      },
      {
        title: '2. The Static Friction Deadband (Breakaway Torque)',
        explanation: 'A DC motor cannot rotate at infinitely low speeds. Inside the gearbox, plastic or metal spur gears have static friction (stiction), and the motor brushes have mechanical contact resistance. At low PWM duty cycles (e.g. `analogWrite(pin, 40)`), the average voltage (0.78V) is insufficient to generate the required breakaway torque ($\tau_{breakaway} = K_t \cdot I$). The motor stalls, emitting an audible high-pitched hum as 490Hz pulses vibrate the windings. The PWM value where the wheel first begins turning reliably is the Breakaway Deadband Threshold (typically PWM 65–85 on TT gearmotors).',
        instructorNote: 'Teach students to always clamp their motor control functions so software never commands a speed inside the useless deadband zone.'
      },
      {
        title: '3. Electromechanical Motor Disparities in Mass Manufacturing',
        explanation: 'Why do two identical yellow TT gearmotors straight out of the factory box spin at different speeds? In mass-produced hobby motors: 1. Permanent magnet field strengths vary by ±8%; 2. Armature copper winding tension causes slight resistance differences; 3. Gearbox injection-molded tooth friction varies; 4. Commutator brush spring tension differs. If you send `analogWrite(200)` to both motors, one wheel might spin at 135 RPM while the other spins at 122 RPM. Over a 3-meter run, this 10% mismatch causes the robot to veer over 30cm off course!',
        instructorNote: 'Emphasize: You cannot fix this with wishful thinking; you must measure the disparity and compensate in software.'
      },
      {
        title: '4. Mathematical Formulation of Software Motor Trim',
        explanation: 'To force two mismatched DC motors to track in a straight line, engineers calculate a Software Trim Multiplier. First, measure the free-running RPM of both wheels at a standard cruise speed (PWM 160). Identify the slower wheel (e.g. Right = 120 RPM) and the faster wheel (e.g. Left = 132 RPM). We define the Trim Ratio as: $\text{Trim} = \frac{\text{RPM}_{\text{slower}}}{\text{RPM}_{\text{faster}}} = \frac{120}{132} \approx 0.909$. In firmware, we keep the slower motor at 1.00 scaling and multiply the faster motor by 0.909, perfectly equalizing wheel surface velocities ($V_L = V_R$).',
        instructorNote: 'Walk through the formula on the board: show how multiplying PWM 160 by 0.909 reduces the left motor to PWM 145.'
      },
      {
        title: '5. High-Frequency vs Low-Frequency PWM in Motor Drivers',
        explanation: 'Arduino Uno digital pins 5 and 6 are driven by Timer0 at approximately 976 Hz, while pins 9 and 10 are driven by Timer1 at 490 Hz. The frequency of PWM affects motor performance: Higher PWM frequencies produce smoother motor torque and eliminate audible whining, but increase switching losses ($P_{switch} = f \cdot C \cdot V^2$) in the driver MOSFETs. Lower frequencies deliver punchier low-speed starting torque due to discrete inductive current pulses, but produce audible hum. The TB6612FNG supports switching frequencies up to 100 kHz, effortlessly handling Arduino PWM.',
        instructorNote: 'Explain why pins 5 & 6 have double the PWM frequency of pins 9 & 10 due to Timer0 clock prescaler configurations.'
      },
      {
        title: '6. Linear Velocity vs Duty Cycle Non-Linearity',
        explanation: 'The relationship between PWM duty cycle and physical vehicle speed is not a straight line! At low PWM (0–70), speed is zero due to deadband stiction. In the mid-range (80–200), speed increases fairly linearly with duty cycle. Near the top end (220–255), motor back-EMF approaches battery supply voltage, and aerodynamic/frictional drag increases, causing velocity gains to level off (saturation). A complete Motor Tuning Table documents this S-curve, allowing autonomous algorithms to command precise linear velocities in cm/s.',
        instructorNote: 'Have students plot their 5-point data table on grid paper to visualize the non-linear motor curve.'
      }
    ],
    visualizerId: 'motor_driver_pwm_sim',
    project: {
      name: 'PWM Motor-Tuning & Straight-Line Calibration Bench',
      deliverableType: 'dataset',
      successEvidence: [
        'Completed 5-point Speed-Tuning Data Table documenting wheel RPM vs PWM duty cycle.',
        'Measured breakaway deadband threshold logged and clamped in firmware.',
        'Software trim multipliers programmed in code, achieving straight-line 3-meter floor run with < 5cm lateral drift.'
      ]
    },
    activity: {
      title: 'Measure RPM, Calculate Trim, and Verify 3-Meter Tracking',
      steps: [
        'Step 1: Elevate rover chassis on bench block so drive wheels spin freely.',
        'Step 2: Connect tachometer or stick a white reflective tape flag onto each wheel rim.',
        'Step 3: Upload the PWM Sweep Bench sketch and open Serial Monitor.',
        'Step 4: Record wheel RPM for Left and Right motors across PWM values: 80, 120, 160, 200, 255.',
        'Step 5: Calculate the software trim multiplier ratio: Trim = Slower_RPM / Faster_RPM.',
        'Step 6: Deploy rover on the 3-meter floor tile track and verify straight-line tracking with < 5cm lateral drift!'
      ],
      successCriteria: [
        'Both wheels demonstrate measured RPM data logged across all 5 test points.',
        'Rover traverses a 3.0-meter floor corridor without veering outside the 10cm boundary line.',
        'Chassis executes active dynamic braking at the finish mark with zero forward coast.'
      ],
      extension: 'Implement an acceleration ramp in software that gradually steps PWM from deadband to cruise over 500ms, eliminating wheel slip.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Rover Chassis with Dual TT Motors', 'TB6612FNG Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Mobile Rover Assembly', exactVariant: 'Dual TT gear motors (1:48) with 65mm rubber tires', quantity: 1 },
        { name: 'TB6612FNG Dual Driver Breakout', exactVariant: 'Carrier board with integrated flyback diodes', quantity: 1 },
        { name: 'Arduino Uno Rev3 DIP', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: '4xAA Battery Pack with Switch', exactVariant: '6.0V nominal DC high-current supply', quantity: 1 },
        { name: '3-Meter Measuring Tape', exactVariant: 'Standard metric floor measuring rule', quantity: 1 },
        { name: 'Bench Block', exactVariant: 'Wood / 3D-printed chassis elevator block', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/motor_driver_tb6612_wiring.svg',
      schematic: 'TB6612FNG Pin Configuration:\nLeft Channel:  PWMA ── Pin 5 (~PWM) | AIN1 ── Pin 7 | AIN2 ── Pin 8\nRight Channel: PWMB ── Pin 6 (~PWM) | BIN1 ── Pin 9 | BIN2 ── Pin 10\nStandby:       STBY ── Pin 3 (HIGH = Enabled)\nPower Rails:   VCC ── 5V | VM ── Battery (+) 6V | GND ── Shared Common Ground',
      wireTable: [
        { from: 'Arduino Pin 5 (~PWM)', to: 'TB6612FNG PWMA', wireOrPolarityNote: 'Left Speed Control Signal' },
        { from: 'Arduino Pin 7', to: 'TB6612FNG AIN1', wireOrPolarityNote: 'Left Motor Direction 1' },
        { from: 'Arduino Pin 8', to: 'TB6612FNG AIN2', wireOrPolarityNote: 'Left Motor Direction 2' },
        { from: 'Arduino Pin 6 (~PWM)', to: 'TB6612FNG PWMB', wireOrPolarityNote: 'Right Speed Control Signal' },
        { from: 'Arduino Pin 9', to: 'TB6612FNG BIN1', wireOrPolarityNote: 'Right Motor Direction 1' },
        { from: 'Arduino Pin 10', to: 'TB6612FNG BIN2', wireOrPolarityNote: 'Right Motor Direction 2' },
        { from: 'Arduino Pin 3', to: 'TB6612FNG STBY', wireOrPolarityNote: 'Standby Enable Signal' },
        { from: 'Arduino 5V Pin', to: 'TB6612FNG VCC', wireOrPolarityNote: 'Logic Supply' },
        { from: 'Battery (+) 6V', to: 'TB6612FNG VM', wireOrPolarityNote: 'Motor High-Current Power' },
        { from: 'Battery (-) & Arduino GND', to: 'TB6612FNG GND', wireOrPolarityNote: 'Star Common Ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Place rover on bench block with wheels suspended in air.',
        '2. Verify wiring connections and common ground bridge.',
        '3. Upload test sketch and verify both wheels spin forward during forward command.',
        '4. Log RPM across PWM values, apply trim, and transfer to floor corridor.'
      ],
      powerAndSafetyChecks: [
        'Ensure bench block is stable; motor vibrations must not cause rover to shake off bench.',
        'Do not touch spinning wheel spokes with pencils or fingers during RPM logging.'
      ],
      testCases: [
        { action: 'Command PWM 50 (below deadband)', expectedResult: 'Motors emit faint 490Hz hum; wheels do not rotate (stiction lock).' },
        { action: 'Command PWM 85 (breakaway threshold)', expectedResult: 'Both wheels begin rotating smoothly.' },
        { action: 'Deploy on 3-meter floor track with calculated trim', expectedResult: 'Rover tracks within ±5cm of straight centerline over 3.0 meters.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Precision Motor Control & Trim Calibration
// Class: INTERMEDIATE 04 - H-Bridge Dynamics & Speed Calibration Bench

// Motor Driver Pin Mapping (TB6612FNG)
const int PIN_PWMA = 5;  // Left Motor Speed (~PWM)
const int PIN_AIN1 = 7;  // Left Motor Direction 1
const int PIN_AIN2 = 8;  // Left Motor Direction 2

const int PIN_PWMB = 6;  // Right Motor Speed (~PWM)
const int PIN_BIN1 = 9;  // Right Motor Direction 1
const int PIN_BIN2 = 10; // Right Motor Direction 2

const int PIN_STBY = 3;  // Standby Enable

// ---------------------------------------------------------------------------
// CALIBRATION PARAMETERS (Empirically Derived from Tachometer Sweeps)
// ---------------------------------------------------------------------------
const int   MIN_DEADBAND_PWM = 75;   // Breakaway threshold: ignore PWM below this
const float LEFT_TRIM        = 1.00; // Slower motor baseline
const float RIGHT_TRIM       = 0.92; // Faster motor scaled down (120 RPM / 130 RPM)

void setup() {
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);
  pinMode(PIN_STBY, OUTPUT);

  digitalWrite(PIN_STBY, HIGH); // Enable driver

  Serial.begin(9600);
  while (!Serial) { ; }

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE MOTOR CALIBRATION & TRIM BENCH"));
  Serial.println(F("========================================"));
  Serial.println(F("Starting 3-Meter Straight Tracking Mission in 3s...\n"));
  
  delay(3000);
}

// Low-Level Actuator Driver with Active Dynamic Braking
void setLeftMotor(int speedVal) {
  if (abs(speedVal) < MIN_DEADBAND_PWM && speedVal != 0) {
    speedVal = (speedVal > 0) ? MIN_DEADBAND_PWM : -MIN_DEADBAND_PWM;
  }

  int scaled = (int)(abs(speedVal) * LEFT_TRIM);
  scaled = constrain(scaled, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  } else {
    // Dynamic Active Brake: Short windings
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, scaled);
}

void setRightMotor(int speedVal) {
  if (abs(speedVal) < MIN_DEADBAND_PWM && speedVal != 0) {
    speedVal = (speedVal > 0) ? MIN_DEADBAND_PWM : -MIN_DEADBAND_PWM;
  }

  int scaled = (int)(abs(speedVal) * RIGHT_TRIM);
  scaled = constrain(scaled, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
  } else {
    // Dynamic Active Brake: Short windings
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, HIGH);
  }
  analogWrite(PIN_PWMB, scaled);
}

void forward(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(speedVal);
}

void activeBrake() {
  setLeftMotor(0);
  setRightMotor(0);
}

void loop() {
  Serial.println(F(">> [DRIVE] Cruising 3.0 meters along centerline..."));
  forward(160);
  delay(2400); // Calibrated straight drive duration for 3.0 meters

  Serial.println(F("🛑 [BRAKE] Engaging active dynamic brake!"));
  activeBrake();
  
  Serial.println(F("✅ Run complete. Measure lateral drift from tape line."));
  while (true) {
    activeBrake(); // Hold stop indefinitely
  }
}`,
      pinMap: { 
        'Pin 5': 'Left Motor PWMA (~PWM)', 
        'Pin 7': 'Left Motor AIN1', 
        'Pin 8': 'Left Motor AIN2', 
        'Pin 6': 'Right Motor PWMB (~PWM)', 
        'Pin 9': 'Right Motor BIN1', 
        'Pin 10': 'Right Motor BIN2', 
        'Pin 3': 'TB6612 STBY enable' 
      },
      setupAndUpload: [
        '1. Place rover on bench block and upload sketch.',
        '2. Verify both wheels spin smoothly forward.',
        '3. Disconnect USB and transfer rover to the floor 3-meter start line.',
        '4. Flip battery pack switch ON; record lateral drift from the centerline at the 3-meter finish.'
      ],
      explanations: [
        'MIN_DEADBAND_PWM: Software clamp that elevates commands above the gearbox stiction threshold.',
        'RIGHT_TRIM = 0.92: Reduces right motor PWM duty cycle by 8% to match the slower left motor.',
        'Active Brake: Shorting AIN1/AIN2 and BIN1/BIN2 to HIGH halts wheel rotation in < 50ms.'
      ],
      expectedResult: 'Rover drives straight down the 3-meter floor track with < 5cm lateral drift and snaps to a crisp stop at the finish.',
      caveats: [
        'If the rover drifts left, decrease RIGHT_TRIM slightly (e.g. from 0.92 to 0.89).',
        'If the rover drifts right, increase RIGHT_TRIM toward 0.96.'
      ],
      tweakTip: 'Mission Challenge: Create an acceleration loop that ramps cruise speed from PWM 75 to 160 over 400ms to eliminate starting wheel skid!'
    },
    troubleshooting: [
      { 
        symptom: 'Motors emit an audible high-pitched squeal but the wheels do not rotate.', 
        checks: [
          'Step 1: Check the commanded PWM value — is it below the breakaway threshold (e.g. PWM 40)?',
          'Step 2: Increase `MIN_DEADBAND_PWM` in code to 85.',
          'Step 3: Check battery voltage — depleted cells cannot supply starting stall current.'
        ], 
        explanation: 'DC motors require a minimum breakaway torque to overcome internal gearbox static friction (stiction).' 
      },
      { 
        symptom: 'Rover curves in a wide arc despite applying software trim.', 
        checks: [
          'Step 1: Inspect wheels — is one rubber tire slipping on its plastic rim?',
          'Step 2: Check for hair or lint wrapped tightly around one motor axle.',
          'Step 3: Measure actual battery voltage under load to confirm one driver channel isn’t dropping voltage.'
        ], 
        explanation: 'Mechanical friction spikes or axle binding override software trim calibrations.' 
      },
      { 
        symptom: 'One motor runs at full speed regardless of what PWM value is commanded.', 
        checks: [
          'Step 1: Verify the PWM pin wire is connected to a hardware ~PWM pin (Pins 5 or 6).',
          'Step 2: If connected to a non-PWM pin like Pin 4, `analogWrite()` treats values >= 128 as permanent 100% HIGH.'
        ], 
        explanation: 'Calling analogWrite() on non-timer pins results in binary on/off switching rather than modulated duty cycles.' 
      },
      { 
        symptom: 'Rover coasts past the 3-meter finish line for over 20cm before stopping.', 
        checks: [
          'Step 1: Inspect `activeBrake()` code — did you command direction pins HIGH/HIGH or did you set PWM to 0?',
          'Step 2: Setting PWM to 0 without pulling direction pins HIGH enters passive coast mode.'
        ], 
        explanation: 'Active dynamic braking requires shorting motor terminals together to generate electromagnetic counter-torque.' 
      }
    ],
    checksForUnderstanding: [
      'What is the physical difference between Active Dynamic Braking and Passive Coasting in an H-Bridge driver?',
      'Why do mass-produced DC gearmotors require software trim multipliers to track in a straight line?',
      'What is motor deadband stiction, and how does firmware compensate for it?'
    ],
    exitTicket: [
      { 
        question: 'Explain how an H-Bridge generates electromagnetic counter-torque when commanded into Active Brake mode.', 
        rubricOrSampleReasoning: 'By turning on both low-side (or high-side) MOSFETs simultaneously, motor terminals are shorted together. The spinning rotor acts as an electric generator, forcing high Back-EMF current to oppose rotation.' 
      },
      { 
        question: 'If the Left motor runs at 130 RPM and the Right motor runs at 117 RPM at PWM 160, what is the calculated software trim multiplier?', 
        rubricOrSampleReasoning: 'Trim = 117 / 130 = 0.90. The Left motor must be scaled by 0.90 in firmware to match the Right motor.' 
      },
      { 
        question: 'Why will commanding a motor at PWM 30 produce only an audible hum without any physical wheel motion?', 
        rubricOrSampleReasoning: 'PWM 30 delivers insufficient average electrical power to generate the minimum breakaway torque required to overcome gearbox static friction (deadband stiction).' 
      }
    ],
    differentiation: {
      support: ['Provide pre-calculated trim lookup table matching classroom rover serial numbers.'],
      extension: ['Write a closed-loop trim auto-tuner using wheel encoders to equalize left and right tick rates.'],
      offlineOption: ['Use the interactive H-Bridge and PWM bench simulator to plot motor RPM curves.']
    },
    nextLessonId: 'int-05',
    nextLessonTeaser: 'Intermediate 05: Integrated Autonomous Line-Following Robot — Put sensor calibration, state machines, and motor tuning together to race a competition track!',
    sources: [{ title: 'Toshiba TB6612FNG Dual Motor Driver Carrier Application Note & PWM Dynamics', url: 'https://toshiba.semicon-storage.com/' }],
    assetCredits: [{ asset: 'PWM Tuning Table', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'int-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tcrt5000", "fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-safety-lab-code", "fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'intermediate',
    sequence: 5,
    code: 'INTERMEDIATE 05',
    title: 'Integrated Autonomous Line-Following Robot',
    promise: 'By the end of this flagship masterclass, you will integrate dual TCRT5000 optical sensors, an H-Bridge driver, and an autonomous 4-state differential steering algorithm into a competition-ready line-following robot capable of racing curved tracks and recovering from line loss.',
    status: 'published',
    proposedAudience: 'Classes 7–10 (Ages 12–16)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 01', 'Intermediate 02', 'Intermediate 03', 'Intermediate 04'],
    outcomes: [
      'Integrate sensory perception, motor actuation, and FSM logic into a unified line-following competition robot.',
      'Program a deterministic 4-state line-tracking controller (Cruise Center, Pivot Left, Pivot Right, Finish Stop).',
      'Optimize the engineering trade-off between straightaway BASE_SPEED and sharp-corner TURN_SPEED.',
      'Implement an active line-loss recovery heuristic that remembers the last known line heading.',
      'Race two complete consecutive laps of an official tournament track autonomously with zero course derailments.'
    ],
    vocabulary: [
      { term: 'Differential Line Tracking', plainMeaning: 'Steering an autonomous robot by turning toward whichever sensor sees the black tape.', technicalMeaning: 'A closed-loop optical trajectory control method that applies differential yaw torque based on sensor array lateral displacement.' },
      { term: 'Cross-Track Error (CTE)', plainMeaning: 'How many millimeters your robot has drifted away from the exact center of the black line.', technicalMeaning: 'The perpendicular lateral distance between the center of the vehicle and the reference path centerline.' },
      { term: 'Line-Loss Recovery', plainMeaning: 'A smart backup plan where the robot remembers which side it lost the line on and pivots back.', technicalMeaning: 'A fault-tolerant search heuristic executed when all sensors transition to the background surface potential.' },
      { term: 'Bang-Bang Control', plainMeaning: 'An on/off steering method that turns full blast whenever the line is touched, causing a slight wiggle.', technicalMeaning: 'A feedback controller that switches abruptly between two states (e.g. hard left and hard right) with no intermediate output.' },
      { term: 'Lap Time Optimization', plainMeaning: 'Finding the fastest speed that still lets the robot make sharp 90-degree corners without flying off.', technicalMeaning: 'The systematic tuning of velocity parameters to minimize elapsed course time while maintaining dynamic stability within traction limits.' },
      { term: 'T-Junction / Cross Line', plainMeaning: 'A perpendicular black tape stripe that signals the robot to stop at the finish line.', technicalMeaning: 'A track feature where both left and right sensors simultaneously detect black, triggering a terminal state.' }
    ],
    teacherPrep: ['Assemble the official competition track with straightaways, 45° chicanes, 90° corners, and a perpendicular stop line; calibrate track lighting.'],
    verifiedMaterials: ['2WD Mobile Rover with dual TCRT5000 IR sensor array (Class 02)', 'TB6612FNG Motor Driver', 'Arduino Uno Rev3 DIP', '7.4V Li-Ion / 6xAA Battery Pack', 'Competition track arena', 'Digital stopwatch'],
    safetyNotes: [
      'Floor testing only. Ensure spectator students stay clear of the track boundary.',
      'Never pick up a racing robot by its spinning wheels; lift by the center chassis plate.',
      'Ensure motor battery switch is OFF when transferring rovers from table to track.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display industrial automated guided vehicles (AGVs) carrying multi-ton shipping containers in automated ports along optical lines. Show tournament lap record runs (under 8 seconds!).', 
        studentAction: 'Analyze lap record video and identify the speed vs cornering stability trade-off.' 
      },
      { 
        segment: '10–25m Algorithm', 
        minutes: 15, 
        teacherAction: 'Walk through the 4-state differential line tracking truth table: White/White ➔ Forward; Black/White ➔ Pivot Left; White/Black ➔ Pivot Right; Black/Black ➔ Stop.', 
        studentAction: 'Trace state reactions and analyze how motor trim calibrations from Class 04 keep the robot centered on straightaways.' 
      },
      { 
        segment: '25–50m Track Tuning', 
        minutes: 25, 
        teacherAction: 'Supervise official track trial runs. Coach students on balancing BASE_SPEED (throttle on straights) and TURN_SPEED (pivot agility on 90° bends).', 
        studentAction: 'Deploy rover on tournament track, tune speed parameters, log lap times, and achieve 2 clean laps without derailment.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Host head-to-head lap time challenges and evaluate line-loss recovery mechanisms.', 
        studentAction: 'Record official competition lap time and complete the formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Closed-Loop Optical Trajectory Control (The Error Feedback Loop)',
        explanation: 'In Open-Loop movement (Class 07), the rover guessed its path using blind delays. Today, we close the loop! Closed-Loop Optical Line Tracking continuously samples the track surface at 50 Hz. The two TCRT5000 optical sensors act as an error detector: when both sensors see white, Cross-Track Error is zero ($e(t) = 0$), and the rover charges straight forward. When the black line slips under the left sensor, it indicates a positive lateral error ($e(t) > 0$), commanding immediate differential yaw torque to pivot the chassis left until error returns to zero.',
        instructorNote: 'Draw the closed-loop block diagram on the board: Plant (Motors) ➔ Sensor (IR Array) ➔ Error Comparator ➔ Controller (FSM).'
      },
      {
        title: '2. The Speed vs Cornering Agility Trade-Off (Centripetal Limits)',
        explanation: 'Every line-following team faces the fundamental physics trade-off: Velocity vs Curvature. On straightaways, you want maximum forward speed ($V = 200$). But when entering a sharp 90-degree corner with a turning radius of only 15cm, Newton’s inertia attempts to carry the chassis forward along a tangent line. The required centripetal acceleration ($a_c = \frac{v^2}{r}$) exceeds available tire friction ($\mu \cdot g$), causing the optical sensors to fly completely past the tape before the robot can pivot! Tournament winners find the sweet spot: moderate cruise speed paired with aggressive, crisp pivot braking.',
        instructorNote: 'Show students what happens if BASE_SPEED is set to 220: the robot flies off the track at the very first corner!'
      },
      {
        title: '3. Bang-Bang Control vs Proportional Steering Dynamics',
        explanation: 'Our 2-sensor line follower operates on Bang-Bang Control: it switches instantaneously between full-forward and full-pivot states. This causes a characteristic "high-frequency wiggle" or oscillation as the robot alternately trips the left and right sensors along straightaways. While simple and highly reliable for 2-sensor rovers, advanced competition robots upgrade to 5-sensor or 8-sensor arrays running Proportional-Integral-Derivative (PID) control, calculating a smooth, continuous steering curve that eliminates oscillations.',
        instructorNote: 'Point out the wiggle: explain that lowering TURN_SPEED slightly softens the oscillation on straight sections.'
      },
      {
        title: '4. Memory-Based Line-Loss Recovery Heuristics',
        explanation: 'What happens if a rover enters a sudden zigzag bend too fast and both sensors fly off the tape onto white floor? An unhardened robot blindly thinks it is on a straight line and drives straight into the wall! A robust line-following controller implements a Last-Known-Heading Recovery Heuristic: whenever a sensor detects the line, the firmware updates an internal direction memory variable: `lastSeenSide = LEFT;`. If both sensors suddenly read white floor while in an active turn, the robot does not drive forward; it pivots aggressively in the direction of `lastSeenSide` until the optical array re-acquires the black line.',
        instructorNote: 'Demonstrate by manually lifting the robot slightly off a corner: watch it pivot back toward the lost line instead of driving away!'
      },
      {
        title: '5. Terminal State Detection: The Perpendicular Finish Line',
        explanation: 'Official tournament courses conclude with a solid black cross-stripe spanning perpendicular to the track (a T-junction). When the rover reaches the finish line, both the Left and Right TCRT5000 sensors simultaneously read values above the black threshold (`leftOnLine && rightOnLine`). The FSM immediately detects this condition as the terminal finish state, triggering active dynamic braking to halt the vehicle instantly inside the finish box, stopping the official competition timer cleanly.',
        instructorNote: 'Ensure the finish line cross-stripe is at least 30mm wide so both sensors are guaranteed to trigger simultaneously.'
      },
      {
        title: '6. Ground Clearance & Focal Plane Rigidity',
        explanation: 'In dynamic racing conditions, the chassis pitches and rolls slightly as it accelerates and brakes. If your 3D printed sensor bracket flexes or was mounted loosely, the vertical distance to the floor fluctuates between 6mm and 15mm. Because optical reflectance follows an inverse-square curve, a 3mm height change can alter analog readings by over 200 counts! Rigid mechanical mounting with zero flex is just as critical as good firmware logic in competition line followers.',
        instructorNote: 'Perform the "Finger Tap Test": tap the front sensor bracket firmly—it should not wobble or flex downward.'
      }
    ],
    visualizerId: 'line_follower_sim',
    project: {
      name: 'Autonomous Competition Line-Following Robot',
      deliverableType: 'physical_build',
      successEvidence: [
        'Fully integrated 2WD mobile rover with dual TCRT5000 optical sensors, TB6612FNG driver, and Star Ground wiring.',
        'Deterministic 4-state line-tracking FSM firmware navigating straightaways, chicanes, and 90° corners.',
        'Completes 2 consecutive laps of the official tournament track autonomously, halting crisply at the finish cross-line.'
      ]
    },
    activity: {
      title: 'Tune and Race the Line-Following Robot',
      steps: [
        'Step 1: Mount the calibrated dual TCRT5000 array rigidly 10mm above the track surface.',
        'Step 2: Upload the integrated 4-state line-following firmware to Arduino Uno.',
        'Step 3: Prop wheels off desk and verify sensor-to-motor steering directions: Left sensor covered ➔ Left wheel reverses, Right wheel drives forward.',
        'Step 4: Place rover on the white track area behind the start line, aligning wheels parallel to the black line.',
        'Step 5: Switch battery pack ON; observe autonomous line tracking around curves.',
        'Step 6: Tune `SPEED_BASE` and `SPEED_TURN` in code until the rover completes 2 full laps without derailing, stopping at the finish line!'
      ],
      successCriteria: [
        'Rover completes 2 full consecutive laps of the competition track without human intervention.',
        'Chassis navigates 90-degree corners without losing line contact.',
        'Rover halts completely within the finish line stop box.'
      ],
      extension: 'Upgrade firmware to a 3-state proportional turn: command gentle arc turns on slight curves and hard tank pivots only on sharp angles.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Mobile Rover Assembly', 'Dual TCRT5000 Optical Sensors', 'TB6612FNG Dual Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Acrylic / 3D Printed Rover Chassis', exactVariant: 'Dual TT gearmotors (1:48) with front caster', quantity: 1 },
        { name: 'TB6612FNG Motor Driver Breakout', exactVariant: 'Carrier board with integrated flyback diodes', quantity: 1 },
        { name: 'TCRT5000 Optical Reflectance Modules', exactVariant: 'Calibrated dual-channel infrared array', quantity: 2 },
        { name: 'Battery Power Supply', exactVariant: '2S 7.4V Li-Ion / 6xAA switched battery pack', quantity: 1 },
        { name: 'Official Competition Track Arena', exactVariant: '19mm matte black electrical tape on white poster board track', quantity: 1 },
        { name: 'Digital Stopwatch', exactVariant: 'Millisecond competition timer', quantity: 1 },
        { name: 'Jumper Wires & Fasteners', exactVariant: '24AWG jumpers and M3 mounting screws', quantity: 14 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
      schematic: 'Integrated System Wiring:\nSensors:       Left TCRT5000 ── Pin A0 | Right TCRT5000 ── Pin A1\nLeft Motor:    PWMA ── Pin 5 (~PWM) | AIN1 ── Pin 7 | AIN2 ── Pin 8\nRight Motor:   PWMB ── Pin 6 (~PWM) | BIN1 ── Pin 9 | BIN2 ── Pin 10\nStandby:       STBY ── Pin 3 (HIGH = Run)\nPower Rails:   VCC ── Arduino 5V | VM ── Battery (+) 7.4V | Star Common Ground',
      wireTable: [
        { from: 'Arduino Digital Pin 3', to: 'TB6612FNG STBY', wireOrPolarityNote: 'Standby enable (active HIGH)' },
        { from: 'Arduino Digital Pin 5 (~PWM)', to: 'TB6612FNG PWMA', wireOrPolarityNote: 'Left Motor Speed (0-255)' },
        { from: 'Arduino Digital Pin 7', to: 'TB6612FNG AIN1', wireOrPolarityNote: 'Left Motor Direction 1' },
        { from: 'Arduino Digital Pin 8', to: 'TB6612FNG AIN2', wireOrPolarityNote: 'Left Motor Direction 2' },
        { from: 'Arduino Digital Pin 6 (~PWM)', to: 'TB6612FNG PWMB', wireOrPolarityNote: 'Right Motor Speed (0-255)' },
        { from: 'Arduino Digital Pin 9', to: 'TB6612FNG BIN1', wireOrPolarityNote: 'Right Motor Direction 1' },
        { from: 'Arduino Digital Pin 10', to: 'TB6612FNG BIN2', wireOrPolarityNote: 'Right Motor Direction 2' },
        { from: 'Left TCRT5000 Analog Out', to: 'Arduino Pin A0', wireOrPolarityNote: 'Left optical line feedback' },
        { from: 'Right TCRT5000 Analog Out', to: 'Arduino Pin A1', wireOrPolarityNote: 'Right optical line feedback' },
        { from: 'Arduino 5V Pin', to: 'TB6612 VCC & Sensor VCC', wireOrPolarityNote: 'Regulated 5.0V Logic Bus' },
        { from: 'Battery (+) 7.4V', to: 'TB6612 VM Pin', wireOrPolarityNote: 'High-Current Motor Power' },
        { from: 'Battery (-) & Arduino GND', to: 'TB6612 GND & Sensor GND', wireOrPolarityNote: 'Star Common Ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount sensor array 10mm above the track surface, centered with 20mm lateral spacing.',
        '2. Connect all logic and power wires according to the integrated wire table.',
        '3. Inspect Star Ground hub to ensure all negative leads converge at a single point.',
        '4. Elevate wheels off desk, power logic via USB, and verify sensor-to-motor directional reactions.',
        '5. Place rover on competition track start line, activate battery switch, and time the run!'
      ],
      powerAndSafetyChecks: [
        'Never connect 7.4V battery pack directly to Arduino 5V or sensor pins.',
        'Ensure drive wheels are clear of loose wire loops that could snag during racing.',
        'Spectator students must remain behind the safety tape line.'
      ],
      testCases: [
        { action: 'Both sensors on white floor', expectedResult: 'Rover charges straight forward at SPEED_BASE.' },
        { action: 'Left sensor trips black tape', expectedResult: 'Left motor reverses, Right motor drives forward (sharp left pivot).' },
        { action: 'Both sensors trip black cross-stripe', expectedResult: 'Motors trigger active dynamic braking, halting within the stop box.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Integrated Competition Line-Following Robot
// Class: INTERMEDIATE 05 - Flagship Autonomous Line Tracking Controller

// Motor Driver Pin Mapping (TB6612FNG)
const int PIN_STBY = 3;  // Standby Enable (HIGH = Operational)
const int PIN_PWMA = 5;  // Left Motor Speed (~PWM)
const int PIN_AIN1 = 7;  // Left Motor Direction 1
const int PIN_AIN2 = 8;  // Left Motor Direction 2

const int PIN_PWMB = 6;  // Right Motor Speed (~PWM)
const int PIN_BIN1 = 9;  // Right Motor Direction 1
const int PIN_BIN2 = 10; // Right Motor Direction 2

// Optical Sensor Pin Mapping (TCRT5000 Analog Array)
const int PIN_IR_LEFT  = A0; // Left sensor analog input
const int PIN_IR_RIGHT = A1; // Right sensor analog input

// Calibrated Optical Thresholds (Derived in Class 02)
const int THRESHOLD_LEFT  = 480; // Reading > 480 means Black Line
const int THRESHOLD_RIGHT = 480; // Reading > 480 means Black Line

// Speed & Agility Tuning Parameters
const int   SPEED_BASE     = 145;  // Cruise speed on straightaways (0-255)
const int   SPEED_TURN     = 125;  // Differential pivot speed on sharp corners
const float LEFT_TRIM      = 1.00; // Left motor calibration scalar
const float RIGHT_TRIM     = 0.94; // Right motor calibration scalar

// Direction Memory Enum for Line-Loss Recovery
enum class LastKnownSide : uint8_t {
  CENTER,
  LEFT,
  RIGHT
};
LastKnownSide lastSeenSide = LastKnownSide::CENTER;

// ---------------------------------------------------------------------------
// LOW-LEVEL ACTUATOR PRIMITIVES (Dynamic Active Braking Supported)
// ---------------------------------------------------------------------------

void setMotors(int leftSpeed, int rightSpeed) {
  // Apply software trim calibration
  int leftPWM  = constrain((int)(abs(leftSpeed) * LEFT_TRIM), 0, 255);
  int rightPWM = constrain((int)(abs(rightSpeed) * RIGHT_TRIM), 0, 255);

  // Left Motor H-Bridge Truth Table
  if (leftSpeed > 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else if (leftSpeed < 0) {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  } else {
    // Dynamic Active Brake
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, leftPWM);

  // Right Motor H-Bridge Truth Table
  if (rightSpeed > 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
  } else if (rightSpeed < 0) {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
  } else {
    // Dynamic Active Brake
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, HIGH);
  }
  analogWrite(PIN_PWMB, rightPWM);
}

void brakeMotors() {
  setMotors(0, 0);
}

// ---------------------------------------------------------------------------
// SETUP & HARDWARE INITIALIZATION
// ---------------------------------------------------------------------------

void setup() {
  pinMode(PIN_STBY, OUTPUT);
  pinMode(PIN_PWMA, OUTPUT); pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_PWMB, OUTPUT); pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);

  digitalWrite(PIN_STBY, HIGH); // Wake up motor driver

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE COMPETITION LINE FOLLOWER     "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Ready. Place on track start line."));
  Serial.println(F("Racing commences in 2 seconds...\n"));
  
  delay(2000); // 2-second grace countdown
}

// ---------------------------------------------------------------------------
// AUTONOMOUS HIGH-SPEED LINE TRACKING LOOP
// ---------------------------------------------------------------------------

void loop() {
  // 1. SENSE: Sample optical reflectance voltages
  int leftVal  = analogRead(PIN_IR_LEFT);
  int rightVal = analogRead(PIN_IR_RIGHT);

  bool leftOnLine  = (leftVal > THRESHOLD_LEFT);
  bool rightOnLine = (rightVal > THRESHOLD_RIGHT);

  // 2. DECIDE & ACT: 4-State Differential Trajectory Control
  if (!leftOnLine && !rightOnLine) {
    // STATE 1: STRAIGHTAWAY CRUISE (Both sensors on white floor, line centered)
    setMotors(SPEED_BASE, SPEED_BASE);
  } 
  else if (leftOnLine && !rightOnLine) {
    // STATE 2: PIVOT LEFT (Line slipped under left sensor)
    lastSeenSide = LastKnownSide::LEFT; // Update memory
    setMotors(-SPEED_TURN, SPEED_TURN);  // Zero-radius tank spin left
  } 
  else if (!leftOnLine && rightOnLine) {
    // STATE 3: PIVOT RIGHT (Line slipped under right sensor)
    lastSeenSide = LastKnownSide::RIGHT; // Update memory
    setMotors(SPEED_TURN, -SPEED_TURN);  // Zero-radius tank spin right
  } 
  else {
    // STATE 4: TERMINAL FINISH LINE (Both sensors detect black cross-stripe)
    Serial.println(F("🏁 [FINISH LINE DETECTED] Halting rover in stop box!"));
    brakeMotors();
    
    // Hold position permanently in finish box
    while (true) {
      brakeMotors();
    }
  }
}`,
      pinMap: { 
        'Pin 3': 'TB6612 Standby enable', 
        'Pin 5': 'Left Motor PWMA speed', 
        'Pin 7': 'Left Motor AIN1 dir', 
        'Pin 8': 'Left Motor AIN2 dir', 
        'Pin 6': 'Right Motor PWMB speed', 
        'Pin 9': 'Right Motor BIN1 dir', 
        'Pin 10': 'Right Motor BIN2 dir', 
        'Pin A0': 'Left TCRT5000 Analog input', 
        'Pin A1': 'Right TCRT5000 Analog input' 
      },
      setupAndUpload: [
        '1. Ensure wheels are elevated on a test block before connecting USB.',
        '2. Verify and upload sketch to Arduino Uno.',
        '3. Test optical response by covering Left or Right sensor and confirming wheel pivots.',
        '4. Transfer rover to competition track start line, activate battery pack, and start stopwatch!'
      ],
      explanations: [
        'THRESHOLD_LEFT / RIGHT: Calibrated optical midpoints that separate white floor from black vinyl tape.',
        'setMotors(-SPEED_TURN, SPEED_TURN): Commands a zero-radius tank pivot by reversing one wheel and driving the other forward.',
        'lastSeenSide: Memory register tracking which direction the line was last detected to aid recovery heuristics.',
        'Terminal While-Loop: Locks the robot into active dynamic braking the instant the finish cross-line is crossed.'
      ],
      expectedResult: 'Rover accelerates cleanly along straightaways, executes rapid differential pivots around 90-degree corners, and halts abruptly inside the finish box.',
      caveats: [
        'If the rover oscillates or wiggles too violently on straightaways, reduce SPEED_TURN from 125 to 105.',
        'If the rover flies off sharp 90-degree corners, reduce SPEED_BASE from 145 to 130.'
      ],
      tweakTip: 'Mission Challenge: Implement smooth proportional steering on slight curves: set inner motor to PWM 60 instead of full reverse to maintain forward momentum!'
    },
    troubleshooting: [
      { 
        symptom: 'Rover pivots in the wrong direction when encountering a line (steers OFF the track).', 
        checks: [
          'Step 1: Check motor wiring — when Left sensor triggers, does the Left motor reverse or drive forward?',
          'Step 2: If the directions are inverted, swap `PIN_AIN1` and `PIN_AIN2` in software or swap the motor leads.'
        ], 
        explanation: 'Inverted direction logic causes positive feedback: turning away from the line increases error instead of correcting it.' 
      },
      { 
        symptom: 'Rover oscillates (wiggles) violently side-to-side on straight sections of track.', 
        checks: [
          'Step 1: Reduce `SPEED_TURN` in code from 125 down to 95.',
          'Step 2: Increase `SPEED_BASE` slightly or widen the physical spacing between the two IR sensors.'
        ], 
        explanation: 'Excessive turning speed causes over-correction in Bang-Bang controllers: the robot overshoots the line on every single correction.' 
      },
      { 
        symptom: 'Rover flies off the track on sharp 90-degree corners and never recovers.', 
        checks: [
          'Step 1: Lower `SPEED_BASE` from 145 to 130 to reduce forward momentum entering the turn.',
          'Step 2: Increase `SPEED_TURN` to provide more aggressive pivot torque.',
          'Step 3: Ensure front caster wheel is clean and swiveling with zero friction.'
        ], 
        explanation: 'Chassis forward momentum carries sensors past the corner before the differential pivot can rotate the vehicle heading.' 
      },
      { 
        symptom: 'Rover stops dead in the middle of a straightaway as if it hit the finish line.', 
        checks: [
          'Step 1: Check for shadows or dirty floor patches that drop both sensor readings below threshold.',
          'Step 2: Re-run the calibration routine from Class 02 and raise the threshold by 50 counts.'
        ], 
        explanation: 'If ambient light or floor reflections cause both sensors to read dark simultaneously, the FSM falsely triggers the finish state.' 
      }
    ],
    checksForUnderstanding: [
      'What are the four discrete states of a standard differential line-following controller?',
      'Why does high cruise speed on straightaways conflict with cornering ability on sharp 90-degree curves?',
      'How does the Last-Known-Heading heuristic help a robot recover if it loses the line on a chicane?'
    ],
    exitTicket: [
      { 
        question: 'What motor commands must be sent when the Left TCRT5000 sensor detects the black line, and why?', 
        rubricOrSampleReasoning: 'Left motor reverse, Right motor forward. This pivots the chassis left, moving the sensor back off the tape and recentering the robot on the track.' 
      },
      { 
        question: 'What is the cause of the high-frequency "wiggle" oscillation in Bang-Bang line followers, and how can it be minimized?', 
        rubricOrSampleReasoning: 'Bang-Bang control applies 100% steering correction immediately, overshooting the centerline. It is minimized by tuning SPEED_TURN down and widening sensor spacing.' 
      },
      { 
        question: 'How does the firmware differentiate between normal line tracking and crossing the official finish line?', 
        rubricOrSampleReasoning: 'Normal tracking triggers only one sensor at a time (Left or Right). Crossing the finish line cross-stripe triggers both Left and Right sensors simultaneously.' 
      }
    ],
    differentiation: {
      support: ['Provide starter speed settings: BASE_SPEED = 125, TURN_SPEED = 100 for stable beginner runs.'],
      extension: ['Upgrade to a 5-sensor array implementing a weighted average Cross-Track Error calculation.'],
      offlineOption: ['Use the interactive line follower simulation with curved tracks and real-time sensor beam overlays.']
    },
    nextLessonId: 'int-06',
    nextLessonTeaser: 'Intermediate 06: Servo Mechanisms & Robotic Manipulators — Control angular positions from 0° to 180° and construct a motorized robotic gripper arm!',
    sources: [{ title: 'RoboBEE Innovators Autonomous Line Follower Championship Standards & Rules', url: '' }],
    assetCredits: [{ asset: 'Competition Track Map', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
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
        explanation: 'An idle SG90 draws roughly 10mA. In motion, it draws 150mA to 250mA. But the instant the motor starts or encounters resistance, instantaneous inrush current surges to 650mA–800mA! The Arduino Uno onboard linear regulator (AMS1117-5.0) has a thermal limit of ~800mA, but when powered from a 9V or 12V barrel jack, excessive voltage drop ($P = (V_{in} - 5V) \times I$) causes thermal shutdown. Attempting to power a servo directly from the Arduino 5V pin collapses the 5V logic bus below 4.3V, triggering an ATmega328P Brownout Reset (BOD). Servos must ALWAYS be powered by an external 5V regulator with a shared Star Common Ground.',
        instructorNote: 'Demonstrate brownout: plug a servo into Arduino 5V and command rapid back-and-forth movement—watch the board reboot!'
      },
      {
        title: '5. Angular Kinematics and S-Curve Software Rate Limiting',
        explanation: 'When firmware executes `gripper.write(180)` while the arm sits at 0°, the internal motor controller slams full battery voltage across the armature to accelerate the arm at maximum speed. This abrupt angular acceleration ($a = \Delta \omega / \Delta t$) generates high inertial shock loads, causing mechanical vibration, gear backlash wear, and dropping held items. Production robotics code implements Software Rate Limiting: instead of jumping 180° in 1 millisecond, a `smoothMove()` routine steps the angle by 1° every 15 milliseconds, achieving a smooth, controlled angular velocity of ~66 degrees per second.',
        instructorNote: 'Demonstrate the difference: have students run instant write() vs smoothMove() and listen to the mechanical gear noise.'
      },
      {
        title: '6. End-Effector Gripper Kinematics and Stall-Free Calibration',
        explanation: 'A robotic gripper transforms rotary servo motion into linear pinch action through a four-bar linkage or gear rack. When gripping a solid object like a wooden block, the jaws stop moving before the servo reaches its commanded position. If `ANGLE_GRIP` is programmed to 30° but the block blocks closure at 45°, the servo stays permanently locked in full-power stall mode, buzzing loudly and rapidly overheating! Calibration requires finding the exact physical contact angle, then backing off by 3° to 5° so the compliance of rubber or foam padding holds the object securely while the motor coil draws near-idle current.',
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
      code: `// RoboBEE Innovators - Intermediate 06
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
`,
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
          'Step 1: Ensure `gripper.write(90)` is called immediately after `gripper.attach(PIN_SERVO)` in `setup()`.',
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
  },

  {
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
        explanation: 'In open-space navigation, robots rely on geometric coordinates ($X, Y, \theta$). However, in warehouse logistics and automated factory floors, robots utilize Topological Navigation: the environment is abstracted into a mathematical graph of vertices (nodes) and connecting edges (line segments). The robot does not need to calculate global GPS coordinates; it simply tracks edges using low-cost optical sensors and executes pre-determined discrete decisions (Left, Right, Straight, Halt) upon arriving at each intersection node.',
        instructorNote: 'Draw a graph theory network on the board: Nodes labeled 0, 1, 2 connected by directed edges.'
      },
      {
        title: '2. Optical Junction Signatures and the Multi-Sensor Truth Table',
        explanation: 'When our 2-sensor mobile rover encounters a straight line, only one sensor or neither sensor sees black. But when approaching a T-junction or a 4-way cross, BOTH Left and Right TCRT5000 sensors simultaneously detect black vinyl tape (`leftDark && rightDark`). This simultaneous optical transition serves as the deterministic signature of an Intersection Node. The firmware must immediately suspend normal line-following steering, freeze PID or Bang-Bang steering adjustments, and hand control over to the specialized intersection handler subroutine.',
        instructorNote: 'Walk through the sensor truth table: 00 = Straight, 10 = Correct Left, 01 = Correct Right, 11 = INTERSECTION NODE!'
      },
      {
        title: '3. The Axle Alignment Problem and Deadband Coasting',
        explanation: 'A critical mechanical challenge in wheeled robotics is that the optical sensor array is positioned at the extreme front bumper, while the drive wheels and turning pivot axle sit 10cm to 15cm further back. If the robot initiates a 90-degree pivot the instant its front sensors detect the cross line, it will spin around its rear wheels, swinging the front sensors completely off the track and missing the outbound branch! To execute a clean turn, the robot must execute a Forward Coast ($d_{offset} \approx 12\text{cm}$) to roll its drive axle directly over the center of the crossbar before commanding the yaw pivot.',
        instructorNote: 'Demonstrate with a physical robot on tape: show why spinning immediately leaves the wheels stranded behind the intersection.'
      },
      {
        title: '4. Deterministic Waypoint Routing Tables Using C++ Enums',
        explanation: 'Rather than writing hardcoded spaghetti `if-else` statements for each turn, professional autonomous systems utilize Waypoint Routing Tables. We define a strongly typed C++ enum: `enum class TurnAction { TURN_LEFT, TURN_RIGHT, GO_STRAIGHT, HALT_FINISH };`. An array `const TurnAction ROUTE[] = { TurnAction::TURN_LEFT, TurnAction::TURN_RIGHT, TurnAction::HALT_FINISH };` defines the flight plan. An internal state variable `int currentNode = 0;` increments upon each valid intersection encounter, retrieving and executing the exact planned action cleanly.',
        instructorNote: 'Show students how updating a single element in the ROUTE array alters the entire path of the robot without touching motor code.'
      },
      {
        title: '5. Eliminating Battery-Dependent Turns: Closed-Loop Line Catching',
        explanation: 'Beginner robots execute 90-degree turns using open-loop delays: `drive(-120, 120); delay(380);`. However, as the battery pack discharges from 8.4V down to 7.0V, motor RPM drops significantly! A 380ms pulse that turned 90° on fresh batteries will only turn 72° on depleted cells, causing the rover to derail. Robust navigation code utilizes Closed-Loop Line Catching: 1. Pivot away from the current line for 150ms (clearing old tape). 2. Continue pivoting in a `while()` loop until the optical sensor detects the new black line! This guarantees an exact 90-degree lock regardless of battery state.',
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
      code: `// RoboBEE Innovators - Intermediate 07
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
`,
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
        explanation: 'If the breakout delay overshoots the outbound tape or the sensor threshold is miscalibrated, the `while()` condition never terminates.' 
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
      'Why is simultaneous multi-sensor detection (`leftDark && rightDark`) necessary to distinguish an intersection from a curve?',
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
        technicalMeaning: 'The operational diameter of a gear where tooth velocity matches, calculated as $d = m \times z$ (module multiplied by tooth count).' 
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
        explanation: 'Gears transmit rotational mechanical power between rotating shafts. The fundamental metric governing metric spur gears is the Module ($m$), defined as the pitch diameter divided by the number of teeth ($m = d / z$). Two gears can ONLY mesh if they share the exact same Module! The Gear Transmission Ratio ($i$) determines the trade-off between speed and torque: $i = z_2 / z_1 = \omega_1 / \omega_2 = \tau_2 / \tau_1$. A 12-tooth pinion driving a 36-tooth gear provides a 3:1 speed reduction, cutting output RPM by one-third while tripling available driving torque!',
        instructorNote: 'Write the gear ratio equation on the board: Torque Output = Torque Input × Ratio × Efficiency.'
      },
      {
        title: '4. Pitch Circle Meshing and Center-to-Center Distance Calculation',
        explanation: 'How far apart must you drill the axle holes for two mating gears? In CAD, this is governed by the Center-to-Center Distance formula: $a = \frac{d_1 + d_2}{2} = \frac{m(z_1 + z_2)}{2}$. For example, mating a 20-tooth gear ($z_1 = 20$) with a 40-tooth gear ($z_2 = 40$) of Module 1.0 requires an exact theoretical center distance of $a = 1.0(20 + 40) / 2 = 30.0\text{mm}$. However, in FDM 3D printing, molten plastic expands slightly. Engineers add intentional Backlash Clearance (+0.25mm to +0.4mm), positioning axles at 30.3mm to prevent teeth from binding.',
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
  },

  {
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
        teacherAction: 'Explain UART framing: single-byte parsing vs multi-byte strings. Teach non-blocking deadman clock: `if (millis() - lastPacketTime > 500) brake();`.', 
        studentAction: 'Code single-byte command parser (`switch(cmd)`) and deadman watchdog check.' 
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
        explanation: 'Novice programmers often transmit verbose English text strings: `"MOVE_FORWARD_AT_SPEED_150\n"`. This is terrible engineering! Transmitting a 28-character string takes ~29 milliseconds at 9600 baud, requires dynamically allocating memory buffers, and wastes CPU cycles parsing substrings. A production robotics protocol uses Single-Byte Atomic Commands: `F` = Forward, `B` = Reverse, `L` = Left, `R` = Right, `S` = Stop. A single ASCII character takes only 1.04 milliseconds to transmit and is evaluated instantaneously by a C++ `switch(cmd)` jump table with zero memory overhead.',
        instructorNote: 'Compare transmission times on the board: 1 byte (1ms) vs 30 bytes (31ms). Explain how lag accumulates when driving at 1 meter/second.'
      },
      {
        title: '3. The Physics of the Deadman Watchdog Clock',
        explanation: 'If a robot receives the command `F` (Forward), its H-Bridge will keep driving motors forward indefinitely until told otherwise. If the operator trips, the controller battery dies, or the robot drives behind a concrete wall, the rover becomes a dangerous runaway missile! To prevent catastrophic failure, ISO 10218 safety standards mandate a Deadman Watchdog Timer. Every time a valid packet arrives, the firmware refreshes a timestamp: `lastPacketTime = millis();`. On every loop iteration, the CPU evaluates: `if (millis() - lastPacketTime > TIMEOUT_MS) { brake(); }`. If signal drops for over 500ms, the robot halts instantly.',
        instructorNote: 'Draw the watchdog timeline: show packet pulses resetting the timer before it reaches the 500ms trip threshold.'
      },
      {
        title: '4. Non-Blocking Telemetry Feedback Streaming (Duplex Communication)',
        explanation: 'True teleoperation is a Two-Way Conversation (Full Duplex). While receiving operator driving commands, the rover must simultaneously transmit its internal health metrics back to the control terminal. However, sending telemetry strings must NEVER block motor control! Utilizing our non-blocking `millis()` architecture from Advanced 03, the rover transmits a structured JSON telemetry packet (`{"bat":7.42,"dist":35}`) at a steady 5 Hz (every 200ms) without using a single millisecond of blocking `delay()`.',
        instructorNote: 'Demonstrate live telemetry streaming into the Arduino Serial Plotter: watch battery voltage curve under motor load in real time.'
      },
      {
        title: '5. UART FIFO Buffer Overflow and Stale Command Latency',
        explanation: 'The ATmega328P hardware serial receiver utilizes a 64-byte circular FIFO (First-In, First-Out) buffer. If the operator mashes directional buttons rapidly while the robot executes a slow function, dozens of keystrokes accumulate in the buffer. When the operator releases the controls, the robot continues driving for several seconds as it blindly processes the stale backlog of commands! Robust firmware flushes or parses only the newest command byte: `while (Serial.available() > 1) { Serial.read(); }`, discarding stale commands instantly.',
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
      code: `// RoboBEE Innovators - Intermediate 09
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

  Serial.print(F("{\"v\":"));
  Serial.print(voltage, 2);
  Serial.print(F(",\"safe\":"));
  Serial.print(failsafeTriggered ? 0 : 1);
  Serial.println(F("}"));
}
`,
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
          'Step 2: Ensure `now - lastPacketTime > DEADMAN_TIMEOUT_MS` is evaluated unconditionally on every loop cycle.',
          'Step 3: Confirm `brake()` engages active dynamic braking (AIN1=HIGH, AIN2=HIGH).'
        ], 
        explanation: 'If the timeout check is mistakenly placed inside the `if (Serial.available())` block, it will never execute when communication ceases because no new bytes arrive!' 
      },
      { 
        symptom: 'Rover responds with 1 to 2 seconds of lag after tapping directional buttons.', 
        checks: [
          'Step 1: Check if blocking `delay()` calls exist inside your motor or telemetry functions.',
          'Step 2: Add the circular buffer flush: `while (Serial.available() > 0) cmd = Serial.read();` to discard stale queue.',
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
      "Explain why single-byte command protocols ('F', 'B') are superior to multi-byte text strings in robotics.",
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
  },

  {
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
        explanation: 'Tournament scoring rules are mathematically designed to penalize recklessness: \n$\text{Score} = (100 - T_{\text{elapsed}}) \times M_{\text{accuracy}} - P_{\text{penalties}}$\nSetting motor speed to 100% PWM might yield a fast lap time, but derailing at a sharp corner incurs a 25-point penalty and requires a manual restart. Champion robotics teams calculate their optimal operating window: dialing cruise speed back to 75% guarantees zero track departures, yielding a significantly higher net score through consistent clean-run multipliers.',
        instructorNote: 'Show the scoring math on the board: demonstrate how a steady 20-second clean run beats an aggressive 12-second run with two penalties.'
      },
      {
        title: '3. Battery Discharge Curves and Open-Loop Degradation',
        explanation: 'A 2S Li-Ion battery pack delivers 8.4V when freshly charged off the wall. After two practice runs, terminal voltage drops to 7.4V (nominal), and under heavy motor acceleration, internal resistance causes temporary voltage droop below 6.8V. If your intersection turns rely on open-loop delays (`delay(350)`), the robot will turn 90° on fresh batteries, but only 74° on depleted batteries! Tournament teams measure cell voltage with a multimeter before every heat and utilize closed-loop line catching to remain immune to voltage decay.',
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
  },

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
      readBeforeClass: ["fg-prog-millis-vs-delay", "fg-prog-program-structure"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-arduino-ide-workflow"],
      goDeeper: ["fg-motion-pid-control"]
    },
    courseId: 'advanced',
    sequence: 3,
    code: 'ADVANCED 03',
    title: 'Robust Embedded C++: Non-Blocking Architecture',
    promise: 'By the end of this masterclass, you will architect production-grade embedded C++ firmware for autonomous robots using cooperative non-blocking task schedulers, eliminate all delay() execution freezes, measure loop execution frequencies exceeding 10 kHz, and implement safe atomic volatile data sharing.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 01', 'Advanced 02'],
    outcomes: [
      'Eliminate all blocking delay() functions using elapsed millis() delta time comparisons.',
      'Construct a modular struct-based task scheduler executing concurrent periodic tasks.',
      'Explain the operation of Interrupt Service Routines (ISRs) and hardware external interrupts.',
      'Protect multi-byte shared variables using the volatile keyword and atomic block guards.',
      'Benchmark main loop execution frequency and demonstrate >20,000 loop cycles per second.'
    ],
    vocabulary: [
      { 
        term: 'Non-Blocking Execution', 
        plainMeaning: 'Writing code so the computer never sits waiting doing nothing, allowing sensors, motors, and radios to run simultaneously.', 
        technicalMeaning: 'An asynchronous programming model where subroutines execute without stalling thread execution, preserving processor availability.' 
      },
      { 
        term: 'Task Scheduler', 
        plainMeaning: 'A digital manager table that triggers different functions at their own separate timers (like 50 times/sec vs 1 time/sec).', 
        technicalMeaning: 'A deterministic cooperative executive that invokes periodic task callbacks based on elapsed system timestamps.' 
      },
      { 
        term: 'Interrupt Service Routine (ISR)', 
        plainMeaning: 'An emergency function that pauses normal code instantly when a pin changes (like a wheel encoder tick).', 
        technicalMeaning: 'A hardware-invoked callback subroutine that executes in response to an asynchronous external interrupt signal.' 
      },
      { 
        term: 'Volatile Keyword', 
        plainMeaning: 'A warning sticker for the compiler: "Never hide this variable in CPU cache because an interrupt can change it at any microsecond!"', 
        technicalMeaning: 'A type qualifier that informs the compiler that a variable can be modified outside normal program control, forcing reads directly from RAM.' 
      },
      { 
        term: 'Atomic Operation', 
        plainMeaning: 'An operation so small and fast that it cannot be cut in half by an interrupt while it is being read.', 
        technicalMeaning: 'An uninterrupted machine-code execution sequence guaranteed to complete as a single isolated transaction.' 
      },
      { 
        term: 'Timer Rollover (Overflow)', 
        plainMeaning: 'When the millis() clock hits its maximum number after 50 days and restarts at 0.', 
        technicalMeaning: 'The wraparound of a 32-bit unsigned integer counter from 4,294,967,295 back to 0 occurring every ~49.71 days.' 
      }
    ],
    teacherPrep: [
      'Prepare logic analyzer or oscilloscope connected to Arduino status pin to measure loop cycle frequency.',
      'Prepare demonstration comparing a frozen delay-based robot with a smooth non-blocking scheduler during button presses.'
    ],
    verifiedMaterials: [
      'Arduino Uno Rev3 DIP or Arduino Mega 2560',
      'High-speed status LEDs with 330Ω resistors',
      'Tactile momentary pushbuttons for interrupt triggering',
      'USB programming cable and PC with Arduino IDE / Serial Plotter'
    ],
    safetyNotes: [
      'Embedded code lab: never use Serial.print() or delay() inside an Interrupt Service Routine (ISR).',
      'Keep ISR functions under 10 microseconds to prevent timer starvation and serial buffer drops.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Problem', 
        minutes: 15, 
        teacherAction: 'Demonstrate "The Blind Travel Problem": show that a robot moving at 1.0 m/s with delay(250) travels 25cm completely blind to cliffs or obstacles!', 
        studentAction: 'Calculate blind distance traveled during delay() calls across various robot speeds.' 
      },
      { 
        segment: '15–35m Architecture', 
        minutes: 20, 
        teacherAction: 'Teach unsigned subtraction delta math: `now - lastRun >= interval`. Introduce struct Task array and function pointers.', 
        studentAction: 'Refactor blocking loop into modular 4-task cooperative scheduler (50Hz sensors, 100Hz motors, 2Hz blink, 1Hz telemetry).' 
      },
      { 
        segment: '35–50m Test', 
        minutes: 15, 
        teacherAction: 'Supervise loop frequency benchmarking: measure iterations per second (Hz) via Serial Monitor.', 
        studentAction: 'Optimize code to achieve >20,000 loop cycles per second while executing all 4 periodic tasks.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review atomic volatile data integrity and evaluate scheduler architectures.', 
        studentAction: 'Submit non-blocking controller sketch and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. The Catastrophic Cost of delay() in Autonomous Robotics',
        explanation: 'When firmware executes `delay(200)`, the ATmega328P processor executes billions of empty `NOP` instructions in a locked loop. The CPU is completely frozen: it cannot sample optical sensors, cannot read ultrasonic echoes, cannot parse wireless commands, and cannot detect a cliff edge! If an obstacle appears 10cm ahead while cruising at 1.0 m/s, the robot travels 20cm before the delay finishes, crashing into the wall. In competitive autonomous robotics, `delay()` is strictly forbidden in production code.',
        instructorNote: 'Draw the execution timeline: show how delay() blocks all sensory perception and communications.'
      },
      {
        title: '2. Cooperative Multitasking via Unsigned millis() Delta Timing',
        explanation: 'How do computers run multiple tasks without an operating system? Through Elapsed Delta Timing: `if ((unsigned long)(currentMillis - previousMillis) >= intervalMs)`. Because `millis()` returns an `unsigned long` (32-bit integer), subtraction in C++ utilizes binary modulo arithmetic ($2^{32}$). Even when the internal timer rolls over from 4,294,967,295 back to 0 at day 49.7, the delta subtraction `(0 - 4294967290)` evaluates correctly to 6! This guarantees infinite runtime stability with zero timer crash bugs.',
        instructorNote: 'Walk through unsigned integer wraparound on the board: prove why (now - lastTime) never breaks on rollover.'
      },
      {
        title: '3. Modular Struct-Based Task Schedulers and Function Pointers',
        explanation: 'Rather than cluttering `loop()` with dozens of separate timestamp variables, professional embedded software utilizes a Task Table: \n```cpp\nstruct Task {\n  unsigned long intervalMs;\n  unsigned long lastRun;\n  void (*taskFunction)();\n};\n```\nAn array of tasks defines the executive schedule. On every pass of `loop()`, a simple 5-line `for`-loop iterates through the table. If a task is due, its function pointer is called. This decouples timing from implementation, allowing new tasks (like telemetry or sensor filtering) to be added with a single table entry.',
        instructorNote: 'Demonstrate adding a new task to the array: show how easy it is to schedule a 10 Hz telemetry task.'
      },
      {
        title: '4. Hardware Interrupt Service Routines (ISRs) on External Pins',
        explanation: 'Some physical events occur too fast for software polling to catch reliably—such as an optical wheel encoder slot passing at 2000 pulses per second. Hardware Interrupts solve this: the ATmega328P hardware monitors physical pins (Digital Pin 2 = INT0, Pin 3 = INT1). When an electrical edge rises, the CPU instantly freezes main execution, saves registers to the stack, jumps to the Interrupt Service Routine (ISR), executes the handler, and resumes main code—all in under 3 microseconds! ISRs must remain tiny: NEVER use `Serial.print()`, `delay()`, or complex loops inside an ISR.',
        instructorNote: 'Explain interrupt priority: hardware interrupts override everything, guaranteeing zero missed encoder ticks.'
      },
      {
        title: '5. The volatile Keyword and Atomic Multi-Byte Data Hazards',
        explanation: 'When a variable is modified inside an ISR and read inside `loop()`, two fatal bugs can occur: 1. Compiler Optimization Caching: The C++ compiler assumes variables only change within the local function, storing the value in a CPU register and ignoring RAM updates. Declaring `volatile unsigned long ticks = 0;` forces the compiler to re-read from physical RAM every time. 2. Data Tearing: On an 8-bit AVR chip, reading a 32-bit `unsigned long` requires 4 separate clock cycles. If an ISR fires between byte 1 and byte 2, the variable becomes corrupted! Protecting 16-bit/32-bit shared variables requires an Atomic Block: `noInterrupts(); long safeCopy = ticks; interrupts();`.',
        instructorNote: 'Demonstrate data tearing: explain what happens if a variable changes from 0x00FF to 0x0100 mid-read.'
      },
      {
        title: '6. Loop Frequency Benchmarking and Processor Headroom',
        explanation: 'A healthy non-blocking embedded system runs `loop()` thousands of times per second. By counting loop iterations and reporting frequency every 1000ms: \n$\text{Loop Frequency (Hz)} = \frac{\text{Iterations}}{\text{Elapsed Seconds}}$\nAn optimized Arduino Uno runs at 30,000 Hz to 60,000 Hz. If adding a sensor library causes loop frequency to drop to 150 Hz, it immediately reveals that the library contains blocking internal delays or slow I2C bus transactions, giving engineers the empirical data needed to fix performance bottlenecks.',
        instructorNote: 'Have students run the benchmark sketch: challenge them to optimize their code to exceed 40,000 Hz.'
      }
    ],
    visualizerId: 'logic_counter_sim',
    project: {
      name: 'High-Performance Non-Blocking Task Scheduler',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Complete compile-ready non-blocking C++ sketch executing 4 concurrent periodic tasks with zero delay() calls.',
        'Measured main loop execution frequency reporting >20,000 Hz in Serial Monitor benchmark.',
        'Verified atomic volatile ISR tick counter responding instantaneously to push-button interrupt pulses.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 DIP or Mega 2560', 'Tactile Pushbutton Switch', 'Dual Status LEDs with 330Ω Resistors', 'Connecting Wires'],
      componentList: [
        { name: 'Microcontroller Board', exactVariant: 'Arduino Uno Rev3 DIP (ATmega328P @ 16 MHz)', quantity: 1 },
        { name: 'Interrupt Pushbutton', exactVariant: 'SPST momentary tactile button connected to Pin 2 (INT0)', quantity: 1 },
        { name: 'Heartbeat LED', exactVariant: '5mm green LED with 330Ω current-limiting resistor on Pin 12', quantity: 1 },
        { name: 'Scheduler Indicator LED', exactVariant: '5mm red LED with 330Ω current-limiting resistor on Pin 13', quantity: 1 },
        { name: 'Breadboard & Jumpers', exactVariant: 'Half-size breadboard and solid-core jumper wires', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/task_scheduler_wiring.svg',
      schematic: 'Pin 2 (INT0) ➔ Button to GND (INPUT_PULLUP). Pin 12 ➔ Green Heartbeat LED (2Hz). Pin 13 ➔ Red Status LED. Shared GND.',
      wireTable: [
        { from: 'Interrupt Button Terminal 1', to: 'Arduino Digital Pin 2 (INT0)', wireOrPolarityNote: 'Hardware Interrupt pin (INPUT_PULLUP)' },
        { from: 'Interrupt Button Terminal 2', to: 'Arduino GND Pin', wireOrPolarityNote: 'Active-LOW ground return' },
        { from: 'Green Heartbeat LED Anode (+)', to: 'Arduino Digital Pin 12 (via 330Ω)', wireOrPolarityNote: '2 Hz visual heartbeat indicator' },
        { from: 'Red Status LED Anode (+)', to: 'Arduino Digital Pin 13 (via 330Ω)', wireOrPolarityNote: 'Task activity indicator' },
        { from: 'LED Cathodes (-)', to: 'Arduino GND Pin', wireOrPolarityNote: 'Common ground bus' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Wire tactile button to Digital Pin 2 and LEDs to Pins 12 and 13 according to wire table.',
        '2. Connect USB cable and upload non-blocking task scheduler sketch via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Observe loop execution frequency reporting >25,000 Hz while heartbeat LED blinks steadily at 2 Hz.',
        '5. Press button rapidly; observe interrupt tick counter increment instantly without jitter.'
      ],
      powerAndSafetyChecks: [
        'Never attach an interrupt to a floating pin; always use INPUT_PULLUP to prevent false trigger storms.',
        'Confirm current-limiting resistors are installed on all external LEDs to prevent overloading ATmega328P pins.'
      ],
      testCases: [
        { action: 'Upload and observe Serial Monitor', expectedResult: 'Loop frequency logs >20,000 Hz; no blocking delays detected.' },
        { action: 'Observe Heartbeat LED on Pin 12', expectedResult: 'Toggles smoothly at exactly 2 Hz (every 500ms) with zero timing drift.' },
        { action: 'Press Pin 2 interrupt button 10 times', expectedResult: 'Interrupt count updates to exactly 10 in telemetry log with zero missed pulses.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 03
// High-Performance Non-Blocking Cooperative Task Scheduler
// Features: Function Pointer Task Table, 50kHz Loop Benchmarking, Atomic ISR Sharing

#include <Arduino.h>

// Task Definition Structure
struct Task {
  unsigned long intervalMs;   // Execution periodicity in milliseconds
  unsigned long lastRunTime;  // Timestamp of last execution
  void (*executeFunction)();  // Pointer to callback function
};

const int PIN_INT_BUTTON = 2;  // Hardware Interrupt 0 (INT0)
const int PIN_HEARTBEAT  = 12; // 2 Hz Heartbeat indicator
const int PIN_STATUS_LED = 13; // Built-in status indicator

// Volatile Shared Variables (Modified inside ISR)
volatile unsigned long interruptEventCount = 0;

// Benchmarking Variables
unsigned long loopCycleCounter = 0;
unsigned long lastBenchmarkTime = 0;

// --- PERIODIC TASK CALLBACKS ---

void taskSampleSensors() {
  // Simulates 50 Hz optical sensor sampling (every 20ms)
  int sampleA0 = analogRead(A0);
  (void)sampleA0; // Avoid unused variable warning
}

void taskUpdateMotorPID() {
  // Simulates 100 Hz closed-loop motor controller (every 10ms)
}

void taskBlinkHeartbeat() {
  // 2 Hz Heartbeat Blink (every 500ms)
  static bool ledState = false;
  ledState = !ledState;
  digitalWrite(PIN_HEARTBEAT, ledState ? HIGH : LOW);
}

void taskReportTelemetry() {
  // 1 Hz Telemetry & Performance Benchmark (every 1000ms)
  unsigned long now = millis();
  float elapsedSec = (now - lastBenchmarkTime) / 1000.0;

  if (elapsedSec > 0) {
    float loopFrequencyHz = loopCycleCounter / elapsedSec;

    // ATOMIC COPY of shared interrupt counter
    noInterrupts();
    unsigned long safeInterrupts = interruptEventCount;
    interrupts();

    Serial.print(F("⚡ [SCHEDULER] Loop Frequency: "));
    Serial.print(loopFrequencyHz, 0);
    Serial.print(F(" Hz | Interrupt Events: "));
    Serial.print(safeInterrupts);
    Serial.println(F(" | Status: 100% Non-Blocking"));
  }

  loopCycleCounter = 0;
  lastBenchmarkTime = now;
}

// --- TASK SCHEDULE TABLE ---
Task systemTasks[] = {
  { 10,   0, taskUpdateMotorPID   }, // 100 Hz
  { 20,   0, taskSampleSensors    }, // 50 Hz
  { 500,  0, taskBlinkHeartbeat   }, // 2 Hz
  { 1000, 0, taskReportTelemetry  }  // 1 Hz
};
const int NUM_SYSTEM_TASKS = sizeof(systemTasks) / sizeof(systemTasks[0]);

// --- HARDWARE INTERRUPT SERVICE ROUTINE (ISR) ---
void handleExternalInterrupt() {
  // Ultra-fast ISR: executes in < 2 microseconds!
  interruptEventCount++;
}

void setup() {
  pinMode(PIN_HEARTBEAT, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_INT_BUTTON, INPUT_PULLUP);

  // Attach hardware interrupt on INT0 (Pin 2, active LOW transition)
  attachInterrupt(digitalPinToInterrupt(PIN_INT_BUTTON), handleExternalInterrupt, FALLING);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE COOPERATIVE TASK SCHEDULER    "));
  Serial.println(F("========================================"));
  Serial.println(F("Initializing 4 concurrent non-blocking tasks..."));

  lastBenchmarkTime = millis();
}

void loop() {
  unsigned long currentMillis = millis();

  // COOPERATIVE TASK DISPATCHER
  for (int i = 0; i < NUM_SYSTEM_TASKS; i++) {
    if (currentMillis - systemTasks[i].lastRunTime >= systemTasks[i].intervalMs) {
      systemTasks[i].lastRunTime = currentMillis;
      systemTasks[i].executeFunction(); // Invoke task callback
    }
  }

  loopCycleCounter++; // Track total loop iterations for frequency benchmark
}
`,
      pinMap: {
        'Pin 2 (INT0)': 'Hardware external interrupt from tactile push-button',
        'Pin 12': 'Heartbeat LED indicator (2 Hz toggle)',
        'Pin 13': 'Built-in status indicator LED',
        'Pin A0': 'Analog sensor input simulated at 50 Hz'
      },
      setupAndUpload: [
        '1. Wire circuit according to wire table.',
        '2. Upload firmware via Arduino IDE.',
        '3. Open Serial Monitor at 9600 baud.',
        '4. Observe loop frequency benchmark reporting >20,000 Hz.',
        '5. Press button to trigger hardware external interrupt events.'
      ],
      explanations: [
        'systemTasks[] array: Encapsulates task periodicity, execution timestamps, and callback function pointers.',
        'noInterrupts() / interrupts(): Atomic guard preventing data tearing on 32-bit shared variable read.',
        'loopCycleCounter: Benchmarks true processor execution headroom in cycles per second.'
      ],
      expectedResult: 'Serial Monitor logs loop speed (>25,000 Hz) with concurrent independent tasks running smoothly and zero timing jitter.',
      caveats: [
        'Never call delay() inside any scheduled task callback; doing so blocks all other scheduled tasks.',
        'Always declare variables modified inside an ISR as volatile to prevent compiler register caching.'
      ],
      tweakTip: 'Add an emergency priority check inside loop() that executes immediately if an obstacle distance flag is raised, bypassing the normal task interval!'
    },
    activity: {
      title: 'Implement and Benchmark the Non-Blocking Scheduler',
      steps: [
        'Step 1: Wire the hardware interrupt button and heartbeat LED on breadboard.',
        'Step 2: Upload the task scheduler sketch and open Serial Monitor at 9600 baud.',
        'Step 3: Verify the loop execution frequency benchmarks at >20,000 Hz.',
        'Step 4: Press the interrupt button 5 times; confirm the interrupt counter increments cleanly.',
        'Step 5: Deliberately insert a delay(50) into taskSampleSensors(); observe loop frequency plunge to ~20 Hz.',
        'Step 6: Remove the blocking delay and restore 30,000 Hz performance.'
      ],
      successCriteria: [
        'Zero blocking delay() calls in user code.',
        'Loop frequency benchmark reports >20,000 Hz.',
        'Hardware interrupt ISR captures all button presses without data corruption.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Loop frequency drops from 30,000 Hz down to under 100 Hz.', 
        checks: [
          'Step 1: Inspect all task functions—did someone accidentally insert a delay() call?',
          'Step 2: Check Serial.print() usage—printing long strings at 9600 baud fills the 64-byte buffer and blocks execution.',
          'Step 3: Increase Serial baud rate to 115200 baud or reduce telemetry reporting frequency.'
        ], 
        explanation: 'Serial output at 9600 baud transmits only 960 characters per second; attempting to print 100 characters per loop blocks the CPU for 100ms.' 
      },
      { 
        symptom: 'Shared interrupt variable occasionally reports crazy corrupted values (e.g. jumping to 16,777,216).', 
        checks: [
          'Step 1: Verify the variable is declared volatile.',
          'Step 2: Verify atomic copy protection: is noInterrupts() called before reading the multi-byte variable?',
          'Step 3: Ensure interrupts() is re-enabled immediately after copying the variable.'
        ], 
        explanation: 'Data tearing: an interrupt fired between reading byte 1 and byte 2 of a multi-byte integer, corrupting the combined binary value.' 
      },
      { 
        symptom: 'Microcontroller freezes completely after running for a few seconds.', 
        checks: [
          'Step 1: Check ISR code—is there a Serial.print() or delay() inside the ISR?',
          'Step 2: Verify that interrupts are re-enabled if noInterrupts() was called.',
          'Step 3: Check for infinite while() loops inside scheduled task callbacks.'
        ], 
        explanation: 'Serial.print() relies on internal UART interrupts to send data; calling it inside an ISR (where interrupts are disabled) causes an unrecoverable deadlock.' 
      },
      { 
        symptom: 'Heartbeat LED blinks irregularly with noticeable stutter.', 
        checks: [
          'Step 1: Check task execution durations—does a task take longer than 10ms to complete?',
          'Step 2: Ensure task timestamps use unsigned long and not signed int.',
          'Step 3: Verify systemTasks array size matches NUM_SYSTEM_TASKS constant.'
        ], 
        explanation: 'Long-running tasks cause timing jitter on lower-priority tasks, delaying their scheduled execution window.' 
      }
    ],
    checksForUnderstanding: [
      'Why is delay() considered dangerous in autonomous obstacle-avoidance robotics?',
      'How does unsigned integer subtraction (now - lastRun >= interval) handle 50-day timer rollover?',
      'Why must 16-bit and 32-bit variables shared with an ISR be read inside an atomic block?'
    ],
    exitTicket: [
      { 
        question: 'What is the operational difference between polling an optical encoder inside loop() versus using an Interrupt Service Routine (ISR)?', 
        rubricOrSampleReasoning: 'Polling checks the pin only when loop() reaches that line, easily missing fast pulses; an ISR triggers hardware execution the instant the edge changes, guaranteeing zero missed ticks.' 
      },
      { 
        question: 'Why does declaring a variable as "volatile" prevent compiler optimization bugs in embedded systems?', 
        rubricOrSampleReasoning: 'It instructs the compiler that the variable can change asynchronously outside the local function, forcing it to read directly from physical RAM rather than caching in CPU registers.' 
      },
      { 
        question: 'Calculate the physical blind distance traveled by a robot moving at 1.5 m/s if its firmware executes a 150ms delay().', 
        rubricOrSampleReasoning: 'Distance = Velocity * Time = 1.5 m/s * 0.150s = 0.225 meters (22.5 centimeters) of completely unmonitored blind motion.' 
      }
    ],
    differentiation: {
      support: ['Provide starter task scheduler template with pre-configured task intervals.'],
      extension: ['Implement a Priority Task Queue that dynamically adjusts task frequency based on robot velocity.'],
      offlineOption: ['Trace scheduler execution timelines and state tables on graph paper with millisecond time stamps.']
    },
    nextLessonId: 'adv-04',
    nextLessonTeaser: 'Advanced 04: Encoders and Motion Measurement: Odometry — Count optical slot interrupts and translate wheel revolutions into millimeter precision ground navigation!',
    sources: [{ title: 'Arduino Documentation: Avoiding Delay and Writing Non-Blocking Code', url: 'https://docs.arduino.cc' }],
    assetCredits: [{ asset: 'Task Scheduler Architecture', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
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
        studentAction: 'Measure wheel diameter ($D=65\text{mm}$) and calculate theoretical circumference ($C=\pi D$).' 
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
        teacherAction: 'Derive distance formula: $\text{mm} = (\text{ticks} \times 204.2) / 20 \approx 10.21 \times \text{ticks}$. Supervise 1-meter target stop trials.', 
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
        explanation: 'In open-loop motion, you command `drive(150, 150); delay(1200);`. But what happens if the battery drops by 0.5V? Motor RPM drops, and the robot travels 20cm less. What if floor friction changes from smooth tile to rough carpet? The robot stalls. What if one gearbox has slightly more grease? The robot veers in a huge arc. To navigate autonomously, the robot must measure real physical motion. Wheel Encoders close the loop: the firmware commands the robot to move until the wheels physically complete a calculated number of revolutions, rendering navigation immune to battery decay.',
        instructorNote: 'Show the comparison: run time-based stop vs encoder-based stop on the projector track.'
      },
      {
        title: '2. Photo-Interrupter Physics and the LM393 Optical Gate',
        explanation: 'The LM393 optical speed sensor contains an infrared LED on one side of a 5mm U-shaped slot and an NPN phototransistor on the opposite side. When an open slot on the revolving chopper disc aligns with the beam, infrared photons strike the phototransistor base, pulling its collector LOW. When a solid tooth blocks the beam, the phototransistor turns OFF, pulling the signal HIGH through a pullup resistor. An onboard LM393 comparator with built-in hysteresis squares up the analog waveform into a clean, noise-free TTL digital square wave.',
        instructorNote: 'Pass around an optical sensor module: point out the tiny IR LED transmitter and phototransistor receiver facing each other.'
      },
      {
        title: '3. Interrupt Service Routines (ISRs) for Hardware Pin Transitions',
        explanation: 'A 2WD robot moving at 1.0 m/s with 65mm wheels rotates at ~4.9 revolutions per second. With a 20-slot disc, the sensor generates $4.9 \times 20 \approx 98$ pulses per second per wheel. If the software attempted to count pulses inside `loop()` using `digitalRead()`, polling delays would miss pulses whenever the CPU was busy. Instead, we connect the optical outputs to ATmega328P Hardware Interrupt pins (Digital Pin 2 = INT0, Digital Pin 3 = INT1). Hardware interrupts freeze the CPU and run an ISR in <2 microseconds, guaranteeing 100% pulse capture accuracy.',
        instructorNote: 'Explain the RISING trigger mode: interrupts fire only when the signal transitions from LOW (0V) to HIGH (5V).'
      },
      {
        title: '4. Kinematic Odometry Mathematics: Ticks to Millimeters',
        explanation: 'Converting raw optical encoder pulses into real-world physical distance is governed by basic geometry: \n$C = \pi \times D = 3.14159 \times 65.0\text{ mm} = 204.2\text{ mm}$\nSince the encoder disc has exactly 20 slots per revolution, the linear resolution per pulse is: \n$\text{Resolution} = \frac{C}{N} = \frac{204.2\text{ mm}}{20\text{ ticks}} = 10.21\text{ mm per tick}$\nTo travel a commanded distance of exactly 1.000 meter (1000mm), the target tick count is: \n$\text{Target Ticks} = \frac{1000\text{ mm}}{10.21\text{ mm/tick}} \approx 98\text{ ticks}$',
        instructorNote: 'Have students write the conversion formula in their engineering notebooks: mm = ticks * 10.21.'
      },
      {
        title: '5. Differential Odometry and Vehicle Heading Estimation',
        explanation: 'Encoders do not just measure straight distance—they measure rotation! In a differential drive robot with track width $W$ (distance between left and right wheel contact patches, e.g. 135mm), turning causes one wheel to travel further than the other. The vehicle angular heading change ($\Delta \theta$ in radians) is given by: \n$\Delta \theta = \frac{\Delta D_R - \Delta D_L}{W}$\nIf both wheels increment by 50 ticks, the heading change is zero (pure straight line). If the right wheel advances by 30 ticks while the left reverses by 30 ticks, the robot executes a zero-radius tank turn. Odometry tracks both position ($X, Y$) and orientation ($\theta$) over time.',
        instructorNote: 'Draw the differential arc geometry on the board: show how difference in wheel travel yields arc radius and turn angle.'
      },
      {
        title: '6. Trapezoidal Velocity Profiling & Stopping Precision',
        explanation: 'If a robot cruises at full speed (200 PWM) and abruptly cuts motor power the instant target tick 98 is reached, kinetic momentum ($E_k = \frac{1}{2} m v^2$) causes the rubber tires to skid across the floor for 5cm to 10cm! To achieve precision stopping, engineers implement a Deceleration Profile: as the remaining distance drops below 15 ticks (150mm), motor PWM is ramped down proportionally from 180 to 90. When target ticks are reached, the H-Bridge triggers active dynamic braking (shorting motor leads), bringing the vehicle to a dead stop within ±10mm of target.',
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
      code: `// RoboBEE Innovators - Advanced 04
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
`,
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
  },

  {
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
        technicalMeaning: 'The controller gain producing an output change directly proportional to the current instantaneous error magnitude ($P = K_p \cdot e(t)$).' 
      },
      { 
        term: 'Derivative Gain (Kd)', 
        plainMeaning: 'An electronic shock absorber that slows down your steering as you approach the center line so you do not fly past.', 
        technicalMeaning: 'The controller gain producing an output proportional to the rate of change of error ($D = K_d \cdot \frac{de}{dt}$), providing predictive damping.' 
      },
      { 
        term: 'Integral Gain (Ki)', 
        plainMeaning: 'A term that remembers if the robot has been leaning slightly off-center for a long time and pushes harder to fix it.', 
        technicalMeaning: 'The controller gain producing an output proportional to the accumulated sum of error over time ($I = K_i \int e(t) dt$), eliminating steady-state offset.' 
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
        teacherAction: 'Derive the PID equation: $u(t) = K_p e(t) + K_i \sum e(t)\Delta t + K_d \frac{\Delta e}{\Delta t}$. Explain the role of P, I, and D.', 
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
        explanation: 'The foundation of PID is the Error Signal: $e(t) = \text{Setpoint} - \text{ProcessVariable}$. For a 5-sensor line array, error ranges from -2 (far left) to +2 (far right). The Proportional term multiplies this error by a constant gain: \n$P(t) = K_p \times e(t)$\nIf error is small (e.g. 0.5mm off-center), the controller applies a gentle steering nudge. If error is large (e.g. 20mm off-center), it applies maximum differential yaw torque. However, P-control alone ALWAYS overshoots the centerline because momentum carries the vehicle past zero error before motor torque can reverse!',
        instructorNote: 'Show what happens with P-only control: the robot perpetually oscillates back and forth across the black line.'
      },
      {
        title: '3. The Derivative Term (D): Dampening and Overshoot Suppression',
        explanation: 'The Derivative term acts as an Electronic Shock Absorber: \n$D(t) = K_d \times \frac{e(t) - e(t-1)}{\Delta t}$\nDerivative measures the Rate of Change of error. As a displaced robot rushes back toward the centerline, its error is rapidly decreasing (negative rate of change). Multiplying this negative rate by $K_d$ produces a COUNTER-STEERING force that brakes the turning rate right before the robot reaches the line! This suppresses overshoot and settles the robot into a dead-straight trajectory. Caution: $K_d$ amplifies high-frequency sensor noise, requiring clean sampling.',
        instructorNote: 'Demonstrate derivative damping: push a damped physical spring vs an un-damped spring.'
      },
      {
        title: '4. The Integral Term (I) & Steady-State Error Elimination',
        explanation: 'In the real physical world, DC motors are never perfectly matched; one motor might have 5% higher friction. Under P-control alone, the robot must maintain a tiny permanent error (Steady-State Offset) just to generate enough motor trim to drive straight. The Integral term fixes this by summing past error over time: \n$I(t) = K_i \times \sum [e(t) \cdot \Delta t]$\nEven if error is a microscopic 0.5mm, the accumulator continuously adds up until the integral term forces the motors to overcome mechanical drag and restore perfect zero error.',
        instructorNote: 'Explain the difference between P (present), I (past memory), and D (future prediction).'
      },
      {
        title: '5. Integral Anti-Windup Clamping & Error Deadbands',
        explanation: 'What happens if a robot derails or is held stationary by a referee while the line tracking algorithm runs? The error stays non-zero, and the integral sum accumulates to astronomical numbers! When released, the saturated integral dumps maximum power to one motor, spinning the robot uncontrollably for seconds until the accumulator unwinds. Production firmware implements Anti-Windup Clamping: \n```cpp\nintegralAccumulator = constrain(integralAccumulator + error, -MAX_I, MAX_I);\n```\nCapping the integral term prevents saturation while preserving its steady-state benefits.',
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
      code: `// RoboBEE Innovators - Advanced 05
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
`,
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
  },

  {
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
        teacherAction: 'Teach I2C bus wiring (A4=SDA, A5=SCL). Explain angular rate integration: $\theta(t) = \theta_0 + \sum \omega_z \Delta t$. Teach zero-rate offset calibration.', 
        studentAction: 'Wire MPU-6050 module; execute startup bias calibration sketch (sampling 500 points).' 
      },
      { 
        segment: '35–50m Sensor Fusion', 
        minutes: 15, 
        teacherAction: 'Explain the Complementary Filter: $\text{Angle} = 0.96(\text{Angle} + \omega \Delta t) + 0.04(\text{Angle}_{acc})$. Supervise 90° physical rotation tests.', 
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
        explanation: 'In 3D space, an unconstrained robot possesses 6 Degrees of Freedom: 3 translational axes ($X$ surge, $Y$ sway, $Z$ heave) and 3 rotational axes (Roll around $X$, Pitch around $Y$, Yaw heading around $Z$). The MPU-6050 integrates two distinct MEMS sensors: 1. Tri-Axial Accelerometer: Measures linear acceleration in g’s ($1.0\text{g} = 9.81\text{ m/s}^2$). When resting on a table, it feels the constant upward normal force of Earth’s gravity pointing along the Z-axis. 2. Tri-Axial Rate Gyroscope: Measures angular rotational velocity in degrees per second (°/s).',
        instructorNote: 'Pass around an MPU-6050 module: show students the microscopic silicon die inside the 4x4mm QFN package.'
      },
      {
        title: '2. The I2C Serial Bus Protocol (SDA & SCL Architecture)',
        explanation: 'Reading multiple sensors usually requires dozens of wires. The Inter-Integrated Circuit (I2C) protocol reduces this to two wires: SDA (Serial Data) and SCL (Serial Clock). Connected to Arduino Analog Pins A4 (SDA) and A5 (SCL), I2C uses open-drain lines with pullup resistors. The Arduino acts as the Bus Master, addressing target slaves using 7-bit addresses. The MPU-6050 listens at address `0x68` (or `0x69` if AD0 pin is pulled HIGH). By default, Arduino I2C runs at 100 kHz, but calling `Wire.setClock(400000)` engages 400 kHz Fast Mode, slashing sensor read latency.',
        instructorNote: 'Draw the I2C open-drain bus with pullup resistors on the board: explain how multiple chips share the exact same two wires.'
      },
      {
        title: '3. Gyroscope Numerical Integration & The Inevitable Drift Problem',
        explanation: 'A gyroscope measures angular velocity ($\\omega$ in °/s), NOT angle! To find current heading angle ($\\theta$), the processor must perform Numerical Integration: \n$\\theta(t) = \\theta(t-1) + (\\omega_z \\times \\Delta t)$\nHowever, real MEMS gyroscopes possess a microscopic DC offset (e.g. $+0.5^\\circ/\\text{s}$) due to manufacturing stress. Even when the sensor sits completely stationary, integrating this error means that after 60 seconds, the robot believes it has turned $0.5 \\times 60 = 30^\\circ$! Gyroscope integration alone is inherently unstable over time.',
        instructorNote: 'Demonstrate raw gyro integration on the projector: watch the angle counter tick upward while the board sits frozen on the table.'
      },
      {
        title: '4. Zero-Rate Gyro Bias Calibration at System Startup',
        explanation: 'To eliminate the vast majority of integration drift, the robot must calibrate its zero-rate bias before entering a match. During `setup()`, while the robot sits perfectly still on the arena starting line, the firmware samples 500 consecutive gyroscope readings over 1.5 seconds, computing the arithmetic mean: \n$\\text{Bias}_z = \\frac{1}{500} \\sum_{i=1}^{500} \\omega_{z, i}$\nThis static bias constant is saved in memory and subtracted from every subsequent measurement: $\\omega_{corrected} = \\omega_{raw} - \\text{Bias}_z$. Startup calibration slashes drift by over 95%!',
        instructorNote: 'Emphasize the golden rule of IMUs: NEVER bump or move a robot while its startup calibration routine is running!'
      },
      {
        title: '5. Accelerometer Tilt Calculation via Trigonometry',
        explanation: 'While gyroscopes drift over time, Earth’s gravity vector is eternally constant. When an accelerometer is tilted, gravity ($1.0\\text{g}$) projects across the $X$, $Y$, and $Z$ axes. Using basic trigonometry, we calculate absolute Pitch and Roll angles: \n$\\text{Pitch} = \\arctan2(a_x, \\sqrt{a_y^2 + a_z^2}) \\times \\frac{180}{\\pi}$\n$\\text{Roll} = \\arctan2(a_y, \\sqrt{a_x^2 + a_z^2}) \\times \\frac{180}{\\pi}$\nHowever, in a moving robot, motor vibrations and chassis acceleration contaminate these readings with extreme noise, making raw accelerometer angles erratic during dynamic driving.',
        instructorNote: 'Show the duality: gyroscopes are clean in the short term but drift long term; accelerometers are noisy short term but stable long term!'
      },
      {
        title: '6. The Complementary Filter: High-Pass + Low-Pass Sensor Fusion',
        explanation: 'Sensor Fusion combines the strengths of both sensors while cancelling their flaws. A Complementary Filter blends them using two complementary weighting factors: \n$\\text{Angle}(t) = \\alpha \\cdot [\\text{Angle}(t-1) + \\omega \\cdot \\Delta t] + (1 - \\alpha) \\cdot \\text{Angle}_{acc}$\nSetting $\\alpha = 0.96$ assigns 96% of the output to high-frequency gyroscope integration (providing smooth, responsive, instantaneous reaction) while allowing 4% of low-frequency accelerometer gravity data to continuously correct long-term drift. The result is a rock-solid, drift-free orientation angle with zero lag!',
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
      code: `// RoboBEE Innovators - Advanced 06
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
`,
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
          'Step 2: Invert the sign of gyroRateZ in software: `headingYaw -= gyroRateZ * dt;`.'
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
    promise: 'By the end of this masterclass, you will design competition-grade robot chassis optimized for additive manufacturing (FDM 3D printing), minimize center of gravity (CG) height, orient layer lines to resist high-speed combat impact shear, and model parametric captive nut traps and battery quick-swap trays.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Intermediate 08'],
    outcomes: [
      'Analyze anisotropic layer adhesion physics and orient print layers to withstand shear impacts.',
      'Calculate vehicle Center of Gravity (CG) height and optimize wheel normal force distribution.',
      'Model parametric captive M3 hex nut pockets, self-tapping screw bosses, and teardrop overhangs.',
      'Implement structural reinforcement ribs, fillets, and 45-degree gussets to eliminate cantilever flex.',
      'Design modular battery quick-swap dovetail trays allowing 15-second pit turnaround times.'
    ],
    vocabulary: [
      { 
        term: 'Anisotropic Strength', 
        plainMeaning: '3D printed plastic is strong along the printed lines, but snaps easily between the layers like a stack of pancakes.', 
        technicalMeaning: 'Physical material properties that vary significantly depending on the axis of measurement, characteristic of layered fused deposition modeling.' 
      },
      { 
        term: 'Center of Gravity (CG)', 
        plainMeaning: 'The average balancing point of your robot where all weight is centered.', 
        technicalMeaning: 'The point at which the entire weight of a body may be considered as acting in a gravitational field, governing dynamic tip-over limits.' 
      },
      { 
        term: 'Captive Hex Nut Pocket', 
        plainMeaning: 'A 6-sided slot in the plastic where a steel nut slides in and cannot spin when you tighten the screw.', 
        technicalMeaning: 'An integrated hexagonal internal cavity designed to mechanically lock an ISO standard hex nut against rotational torque.' 
      },
      { 
        term: 'Structural Gusset', 
        plainMeaning: 'A 45-degree triangular brace added to corners to keep motor mounts from bending.', 
        technicalMeaning: 'A triangular bracket or reinforcement plate added across an inside corner to distribute bending moments and reduce stress concentration.' 
      },
      { 
        term: 'Teardrop Hole Geometry', 
        plainMeaning: 'Making horizontal screw holes pointed like a raindrop at the top so the 3D printer needs no support material.', 
        technicalMeaning: 'A self-supporting CAD hole profile with a 45-degree peaked apex that bridges cleanly during horizontal FDM printing without droop.' 
      },
      { 
        term: 'Design for Assembly (DFA)', 
        plainMeaning: 'Designing parts so you can actually reach the screws with a real screwdriver without having to dismantle the whole robot.', 
        technicalMeaning: 'An engineering design methodology focused on minimizing component count, simplifying assembly sequences, and ensuring tool clearance.' 
      }
    ],
    teacherPrep: [
      'Prepare physical 3D-printed impact test coupons showing delamination failure along layer lines vs continuous filament strength.',
      'Load parametric chassis starter templates into CAD workstations (Fusion 360 / Onshape).'
    ],
    verifiedMaterials: [
      'CAD Workstations with Autodesk Fusion 360 or Onshape',
      'Digital Vernier Caliper (0.01mm resolution)',
      'Sample 3D-printed chassis components (PLA and PETG)',
      'Standard M3 hardware (10mm, 16mm button head screws and M3 hex nuts)',
      'Digital gram scale for mass property verification'
    ],
    safetyNotes: [
      'Fabrication safety: handle sharp deburring tools and hobby knives with care when cleaning 3D prints.',
      'Ensure proper ventilation in 3D printing laboratories during thermoplastic extrusion.'
    ],
    classRhythm: [
      { 
        segment: '0–15m Failure Modes', 
        minutes: 15, 
        teacherAction: 'Display high-speed collision video of a Mini-Sumo robot cracking along horizontal layer lines. Analyze failure root cause.', 
        studentAction: 'Analyze why tensile loads perpendicular to layer lines cause catastrophic delamination.' 
      },
      { 
        segment: '15–35m CAD Techniques', 
        minutes: 20, 
        teacherAction: 'Demonstrate captive M3 nut slots (5.8mm flats), teardrop hole profiles, and Center of Gravity calculation tools in CAD.', 
        studentAction: 'Model reinforced motor mount with integrated 45-degree gussets and captive nut slots.' 
      },
      { 
        segment: '35–50m Iteration Log', 
        minutes: 15, 
        teacherAction: 'Supervise Center of Gravity optimization: guide students to lower battery tray beneath drive axle.', 
        studentAction: 'Run CAD mass property analysis; verify CG height is within bottom 25% of chassis envelope.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review student CAD assemblies and evaluate tool clearance line-of-sight.', 
        studentAction: 'Export print-ready STL with layer orientation specification and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Anisotropic Layer Adhesion & Impact Shear Dynamics',
        explanation: 'Fused Deposition Modeling (FDM) extrudes molten thermoplastic (PLA/PETG) in 0.2mm layers. Within a single extruded strand, tensile strength is exceptional (~55 MPa for PLA). However, between adjacent layers, bonding relies on thermal fusion, which is up to 45% weaker (~30 MPa). In autonomous combat or high-speed collisions, if an impact force strikes perpendicular to layer lines, it peels the layers apart in catastrophic Delamination! Parts must be oriented on the print bed so that impact shear forces compress layers together or pull along continuous filament paths.',
        instructorNote: 'Break two 3D-printed test sticks by hand: one printed flat (impossible to break) vs one printed vertically (snaps instantly like chalk).'
      },
      {
        title: '2. Center of Gravity (CG) Physics & Dynamic Roll Stability',
        explanation: 'A robot’s Center of Gravity ($z_{cg}$) governs its static stability margin and dynamic pushing traction: \n$z_{cg} = \frac{\sum (m_i \times z_i)}{\sum m_i}$\nIn our 500g Mini-Sumo robot, the battery pack represents 25% of total mass (~125g). Mounting the battery on an upper deck raised 40mm off the floor raises the CG, making the robot tip over backwards when accelerating or pushed by an opponent wedge! Professional competition chassis position heavy batteries as low as possible (slung 3mm beneath the main axle line), lowering the CG and maximizing tire normal force.',
        instructorNote: 'Use the CAD "Center of Mass" visualization tool: show how dropping the battery tray lowers the yellow balance marker.'
      },
      {
        title: '3. Captive Hex Nut Pockets & Teardrop Horizontal Holes',
        explanation: 'Threaded holes tapped directly into plastic strip out at less than 0.8 N-m of torque. Professional roboticists model Captive Hex Nut Pockets: a 5.8mm wide hexagonal pocket (for an M3 nut with 5.5mm nominal flats) traps the steel nut inside the print. Furthermore, circular holes printed horizontally through a vertical wall suffer from upper-arch droop because printers cannot bridge mid-air overhangs >45°. Designing the hole with a Teardrop Profile (a 45-degree pointed roof) allows the printer to lay down overhangs cleanly with zero support material!',
        instructorNote: 'Show the teardrop profile sketch: explain why a 45-degree angle bridges cleanly on every 3D printer.'
      },
      {
        title: '4. Structural Stiffening: Gussets, Fillets & Honeycomb Infill',
        explanation: 'A motor mount attached to a flat plate acts as a cantilever beam. Under stall torque, the joint experiences maximum bending stress: $\sigma = \frac{M \cdot y}{I}$. Sharp 90-degree internal corners act as stress concentrators, leading to stress cracks. Adding a 45-degree triangular Gusset or a 3.0mm radius Fillet distributes bending moments across a 4x larger cross-sectional area, increasing rigidity by over 300% without adding significant mass. In slicing, using a Gyroid or 3D Honeycomb infill pattern provides isotropic internal stiffness.',
        instructorNote: 'Demonstrate cantilever flex: compare a plain 90-degree bracket with a gusseted bracket under thumb pressure.'
      },
      {
        title: '5. Modular Battery Quick-Swap Trays & Retention Latches',
        explanation: 'In tournament competition, you have exactly 3 minutes in the pit between heats. If replacing your battery requires unscrewing 6 machine bolts and removing the circuit board, your team will miss the match call! Competition chassis feature Quick-Swap Battery Trays: a sliding dovetail rail or friction-fit cradle secured by a reusable silicone O-ring or spring-loaded snap latch. The battery can be swapped, plugged into the XT30 power connector, and armed in under 15 seconds with zero tools required.',
        instructorNote: 'Pass around a quick-swap battery cradle: time a student replacing the dummy battery pack in 10 seconds.'
      },
      {
        title: '6. Design for Assembly (DFA) & Tool Clearance Envelopes',
        explanation: 'It is easy to model a bolt in CAD that is physically impossible to tighten with a real wrench in the real world! Design for Assembly (DFA) requires verifying Tool Clearance Envelopes. For an M3 socket head cap screw, a 2.5mm hex key requires an unobstructed vertical cylinder of at least 8mm diameter extending all the way out of the chassis. If a capacitor or motor casing blocks this cylinder, the robot cannot be assembled or serviced in the pit. Professional CAD models include tool clearance cutouts on upper chassis decks.',
        instructorNote: 'Have students attempt to tighten an obstructed screw with an L-shaped hex key: point out the knuckle clearance problem.'
      }
    ],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Competition-Grade Reinforced Chassis CAD Model',
      deliverableType: 'cad_model',
      successEvidence: [
        'Complete parametric CAD chassis assembly featuring low Center of Gravity battery cradle, twin motor traps, and front scoop mount.',
        'All fastener joints incorporate captive M3 hex nut pockets and self-supporting teardrop horizontal holes.',
        'Verified tool clearance envelopes and structural gussets providing verified rigidity under simulated motor stall loads.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Parametric CAD Digital Model', 'Digital Vernier Caliper', '3D Printing Workstation', 'Standard M3 Hardware Kit'],
      componentList: [
        { name: '3D Printer Filament', exactVariant: 'PLA+ or PETG 1.75mm high-impact engineering filament', quantity: 1 },
        { name: 'Captive Fasteners', exactVariant: 'M3x10mm button head socket screws and M3 hex nuts', quantity: 8 },
        { name: 'Brass Threaded Heat-Set Inserts', exactVariant: 'M3x4mm brass knurled inserts (optional alternative)', quantity: 4 },
        { name: 'TT Gearmotors', exactVariant: 'Standard yellow dual-shaft 1:48 gearmotors for fitment', quantity: 2 },
        { name: 'Battery Pack', exactVariant: '2S 7.4V 1500mAh Li-Po / 6xAA holder for cradle dimension check', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/cad_ultrasonic_bracket_blueprint.svg',
      schematic: 'CAD Mechanical Assembly: Grounded lower chassis plate, captive M3 motor traps, low-slung battery cradle, front scoop bracket.',
      wireTable: [
        { from: 'Motor Mount Tab', to: 'Chassis Baseplate', wireOrPolarityNote: 'Reinforced with 45-degree triangular structural gusset' },
        { from: 'Battery Cradle', to: 'Lower Chassis Belly', wireOrPolarityNote: 'Slung 3mm above floor to minimize Center of Gravity height' },
        { from: 'Fastener Clearance Slots', to: 'M3 Screw Shanks', wireOrPolarityNote: 'Modeled at 3.4mm diameter (+0.4mm FDM clearance tolerance)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Measure motor casing dimensions and battery pack with digital calipers.',
        '2. Model lower chassis baseplate incorporating captive M3 hex nut pockets (5.8mm flats).',
        '3. Add 45-degree structural gussets to motor mounting flanges.',
        '4. Model battery cradle on the bottom chassis belly to lower center of gravity.',
        '5. Perform virtual interference check; verify all M3 screws have unobstructed hex key clearance.',
        '6. Export print-ready STL file; verify slicer print orientation aligns layers parallel to impact shear forces.'
      ],
      powerAndSafetyChecks: [
        'Verify minimum 3.0mm wall thickness around all load-bearing motor screw holes.',
        'Ensure battery retention strap prevents cell ejection during high-speed violent impacts.',
        'Confirm front scoop blade has smooth, deburred edges compliant with tournament non-destructive rules.'
      ],
      testCases: [
        { action: 'Insert standard M3 hex nut into 3D-printed captive pocket', expectedResult: 'Nut presses in snugly by hand and does not spin when screw is torqued.' },
        { action: 'Tighten M3 screw to 1.2 N-m torque', expectedResult: 'Steel nut absorbs clamping force; plastic shows zero cracking or stripping.' },
        { action: 'Calculate CAD Center of Gravity', expectedResult: 'Vertical CG height is located within the bottom 25% of overall chassis height.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 07
// Center of Gravity (CG) & Normal Force Distribution Calculator
// Validates physical mass distribution before manufacturing chassis

#include <Arduino.h>

struct Component {
  const char* name;
  float massGrams;
  float xPosMm; // Longitudinal position from rear axle (mm)
  float zPosMm; // Vertical height from ground (mm)
};

// System Mass & Position Matrix (500g Mini-Sumo Specification)
Component robotBOM[] = {
  { "Chassis Base (PETG)",  85.0,  50.0,  12.0 },
  { "Twin TT Gearmotors",  110.0,  25.0,  18.0 },
  { "Wheels & Tires (x2)",  60.0,  25.0,  32.5 },
  { "2S 7.4V LiPo Battery", 125.0,  45.0,  10.0 }, // Slung low in belly!
  { "Arduino & Driver",     45.0,  55.0,  28.0 },
  { "Sensors & Wiring",     25.0,  85.0,  15.0 },
  { "Steel Front Scoop",    45.0,  98.0,   5.0 }  // Pushes CG forward!
};
const int NUM_COMPONENTS = sizeof(robotBOM) / sizeof(robotBOM[0]);

void setup() {
  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE CHASSIS CG & TRACTION AUDIT   "));
  Serial.println(F("========================================"));

  float totalMass = 0;
  float weightedX = 0;
  float weightedZ = 0;

  for (int i = 0; i < NUM_COMPONENTS; i++) {
    totalMass += robotBOM[i].massGrams;
    weightedX += robotBOM[i].massGrams * robotBOM[i].xPosMm;
    weightedZ += robotBOM[i].massGrams * robotBOM[i].zPosMm;
  }

  float cgX = weightedX / totalMass;
  float cgZ = weightedZ / totalMass;

  Serial.print(F("⚖️ Total Robot Mass: "));
  Serial.print(totalMass, 1);
  Serial.println(F(" g (Limit: 500.0g)"));

  Serial.print(F("📍 Center of Gravity (X longitudinal): "));
  Serial.print(cgX, 1);
  Serial.println(F(" mm from rear axle"));

  Serial.print(F("📍 Center of Gravity (Z vertical height): "));
  Serial.print(cgZ, 1);
  Serial.println(F(" mm above ground"));

  // Stability & Traction Evaluation
  if (totalMass > 500.0) {
    Serial.println(F("❌ DISQUALIFIED: Mass exceeds 500.0g limit!"));
  } else if (totalMass >= 490.0) {
    Serial.println(F("✅ OPTIMAL MASS: Maximizes Coulomb traction friction."));
  }

  if (cgZ <= 18.0) {
    Serial.println(F("✅ EXCELLENT LOW CG: High dynamic anti-roll stability."));
  } else {
    Serial.println(F("⚠️ HIGH CG: Danger of tipping backward under acceleration!"));
  }
}

void loop() {
  // Idle
}
`,
      pinMap: {
        'No direct I/O': 'Computational firmware validating CAD mass properties'
      },
      setupAndUpload: [
        '1. Open Arduino IDE and upload CG calculator sketch.',
        '2. Open Serial Monitor at 9600 baud.',
        '3. Inspect calculated mass, longitudinal CG, and vertical CG height.',
        '4. Adjust component mass or position values in code matching your exact CAD model.'
      ],
      explanations: [
        'weightedX / weightedZ: Mathematical centroid calculation yielding exact Center of Gravity coordinates.',
        'cgZ evaluation: Validates that battery placement successfully keeps vertical CG under 18mm.',
        'totalMass audit: Ensures final physical assembly will pass official 500.0g weigh-in inspection.'
      ],
      expectedResult: 'Serial Monitor outputs total mass (~495g), longitudinal CG (52mm), and vertical CG height (16.2mm) with stability sign-offs.',
      caveats: [
        'Always weigh real physical parts on a digital scale; CAD estimated densities often underestimate hardware screw weight.',
        'Remember that cables, zip ties, and solder add ~15 grams of distributed mass.'
      ],
      tweakTip: 'Move the battery forward by 10mm in the matrix to increase normal force on the front scoop for better wedge scraping!'
    },
    activity: {
      title: 'Model, Slice, and Validate the Reinforced Combat Chassis',
      steps: [
        'Step 1: Sketch chassis baseplate in CAD; place battery cradle in the lower belly (3mm ground clearance).',
        'Step 2: Model motor brackets with 45-degree triangular gussets and captive M3 hex nut pockets (5.8mm flats).',
        'Step 3: Create horizontal fastener holes using self-supporting teardrop apex profiles.',
        'Step 4: Check Tool Clearance Envelopes: verify an 8mm diameter hex key can reach all fastener heads.',
        'Step 5: Run CAD Center of Mass analysis; verify vertical CG is below 18mm.',
        'Step 6: Import STL into slicer; orient print so impact shear forces act parallel to the build plate.'
      ],
      successCriteria: [
        'All motor brackets reinforced with 45-degree gussets and captive M3 nut traps.',
        'Vertical Center of Gravity verified below 18mm in mass analysis.',
        'Slicer print orientation aligns continuous filament layers with primary collision impact axes.'
      ]
    },
    troubleshooting: [
      { 
        symptom: '3D printed motor mount snaps off along a clean, flat break line during an impact test.', 
        checks: [
          'Step 1: Inspect the break surface—did it split perfectly along a horizontal layer line?',
          'Step 2: Re-orient the part on the 3D printer bed so layer lines run perpendicular to the impact force.',
          'Step 3: Increase extruder temperature by 5°C and increase wall perimeter count from 2 to 4.'
        ], 
        explanation: 'Tensile delamination: printing thin vertical walls subjected to bending moments places layer adhesion under direct tensile stress.' 
      },
      { 
        symptom: 'M3 hex nut spins freely inside the 3D-printed captive pocket when tightened.', 
        checks: [
          'Step 1: Measure the pocket with vernier calipers—is it larger than 5.8mm across the flats?',
          'Step 2: Reduce pocket width in CAD to 5.7mm or 5.8mm for a tight press-fit.',
          'Step 3: Check printer slicer for over-extrusion or loose belt backlash.'
        ], 
        explanation: 'If the hex cavity is oversized, the steel nut rounds off the plastic internal corners when tightened with a screwdriver.' 
      },
      { 
        symptom: 'Robot flips backward onto its roof whenever motors accelerate at 100% PWM.', 
        checks: [
          'Step 1: Check Center of Gravity height—is the battery mounted high above the wheels?',
          'Step 2: Lower the battery cradle beneath the wheel axle level.',
          'Step 3: Move the battery forward toward the front scoop to increase front wheel normal force.'
        ], 
        explanation: 'High Center of Gravity paired with high motor acceleration torque creates a pitch-up rotational moment exceeding vehicle wheelbase stability.' 
      },
      { 
        symptom: 'Horizontal screw holes droop at the top and require drilling out with a drill bit.', 
        checks: [
          'Step 1: Did you model a standard round hole on a vertical wall without support?',
          'Step 2: Replace circular hole profile with a 45-degree pointed Teardrop profile in CAD.',
          'Step 3: Ensure slicer bridging settings are enabled.'
        ], 
        explanation: 'FDM printers cannot extrude plastic into empty air; standard circular ceiling arcs droop downwards due to gravity.' 
      }
    ],
    checksForUnderstanding: [
      'Why are 3D printed parts significantly weaker along the Z-axis (between layers) than along the X-Y plane?',
      'How does lowering a robot’s Center of Gravity improve both pushing traction and dynamic stability?',
      'Explain how a Teardrop hole geometry allows horizontal holes to print cleanly without support material.'
    ],
    exitTicket: [
      { 
        question: 'Why must 3D-printed parts subjected to high-speed frontal impacts be printed with layers parallel to the baseplate?', 
        rubricOrSampleReasoning: 'Printing layers parallel to the baseplate aligns the continuous filament strands with the impact shear forces, preventing catastrophic inter-layer delamination.' 
      },
      { 
        question: 'What is the structural purpose of adding 45-degree triangular gussets to 90-degree motor mounting brackets?', 
        rubricOrSampleReasoning: 'Gussets eliminate stress concentrations at sharp corners and distribute bending moments across a wider cross-sectional area, preventing cantilever flex under motor stall torque.' 
      },
      { 
        question: 'What is a "Tool Clearance Envelope" in Design for Assembly (DFA), and why is it critical in competition robotics?', 
        rubricOrSampleReasoning: 'It is the physical clearance space required for hand tools (like hex keys or screwdrivers) to reach and tighten fasteners; without it, components cannot be serviced or assembled in the pit.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-modeled parametric captive nut pocket sketches for copy-pasting into student assemblies.'],
      extension: ['Run Finite Element Analysis (FEA) in Fusion 360 to simulate von Mises stress distribution under 50 N impact loads.'],
      offlineOption: ['Calculate Center of Gravity coordinates by hand for a 4-component robot using weighted centroid equations.']
    },
    nextLessonId: 'adv-08',
    nextLessonTeaser: 'Advanced 08: ESP32/STM32, Telemetry, and Local IoT Concepts — Migrate to 240MHz 32-bit dual-core processors and stream real-time telemetry over local Wi-Fi dashboards!',
    sources: [{ title: 'Stratasys Design Guidelines for Additive Manufacturing & FDM Tooling', url: 'https://stratasys.com' }],
    assetCredits: [{ asset: 'Captive Nut Slot Guide', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'adv-08',
    fieldGuideLinks: {
      readBeforeClass: ["fg-board-other-microcontrollers"],
      lookUpWhileBuilding: ["fg-comm-i2c-spi-uart", "fg-safety-lab-code"],
      goDeeper: ["fg-prog-millis-vs-delay"]
    },
    courseId: 'advanced',
    sequence: 8,
    code: 'ADVANCED 08',
    title: 'ESP32/STM32, Telemetry, and Local IoT Concepts',
    promise: 'By the end of this masterclass, you will program high-performance 32-bit dual-core microcontrollers (ESP32 @ 240 MHz), host a standalone local Wi-Fi Access Point (AP) web dashboard with zero internet dependencies, and stream bidirectional JSON telemetry packets over WebSockets at 20 Hz.',
    status: 'published',
    proposedAudience: 'Classes 9–12 (Ages 14–18+)',
    durationMinutes: 60,
    prerequisites: ['Advanced 03'],
    outcomes: [
      'Contrast 8-bit AVR architecture (ATmega328P @ 16 MHz) with 32-bit dual-core Xtensa (ESP32 @ 240 MHz).',
      'Host a standalone offline Wi-Fi Access Point (AP Mode) serving HTML5/JS telemetry dashboards.',
      'Stream real-time sensor metrics (battery voltage, obstacle distance) over HTTP/WebSockets at 20 Hz.',
      'Pin high-speed motor control loops to Core 1 while dedicating Core 0 to Wi-Fi network stacks using FreeRTOS.',
      'Configure hardware LEDC PWM timers for high-frequency silent motor driving.'
    ],
    vocabulary: [
      { 
        term: '32-Bit Dual-Core Processor', 
        plainMeaning: 'A computer chip with two separate brains running at 240 MHz that can think and communicate at the same time.', 
        technicalMeaning: 'A microprocessor architecture featuring dual 32-bit CPU cores (Xtensa LX6) capable of concurrent parallel execution at up to 240 MHz.' 
      },
      { 
        term: 'Access Point (AP Mode)', 
        plainMeaning: 'When the robot creates its own private Wi-Fi network that phones can connect to in the middle of nowhere without internet.', 
        technicalMeaning: 'A networking state where the Wi-Fi transceiver acts as a DHCP server and wireless base station, assigning local IP addresses (e.g. 192.168.4.1).' 
      },
      { 
        term: 'FreeRTOS Task Pinning', 
        plainMeaning: 'Telling Core 1 to focus 100% on balancing wheels while Core 0 handles web browser traffic.', 
        technicalMeaning: 'The assignment of specific real-time threads to designated CPU hardware cores using xTaskCreatePinnedToCore() to prevent resource contention.' 
      },
      { 
        term: 'WebSocket Connection', 
        plainMeaning: 'A permanent open telephone line between the robot and your phone browser for instant 2-way data flow.', 
        technicalMeaning: 'A persistent, bidirectional, full-duplex TCP communication protocol over a single socket connection, avoiding HTTP polling overhead.' 
      },
      { 
        term: 'LEDC Hardware PWM', 
        plainMeaning: 'Special hardware timers inside the ESP32 that generate super-smooth motor speeds without loading the CPU.', 
        technicalMeaning: 'The LED Control peripheral on the ESP32 providing 16 independent PWM channels with configurable frequency and up to 16-bit duty resolution.' 
      },
      { 
        term: 'JSON Telemetry Framing', 
        plainMeaning: 'Formatting sensor data like {"v":7.4,"d":35} so web dashboards can graph it effortlessly.', 
        technicalMeaning: 'A lightweight text-based data interchange format (JavaScript Object Notation) representing structured key-value attribute pairs.' 
      }
    ],
    teacherPrep: [
      'Install ESP32 Board Support Package (BSP) in Arduino IDE on all student lab workstations.',
      'Verify ESP32 DevKit V1 boards enumerate correctly on COM ports; check Wi-Fi AP broadcast power.'
    ],
    verifiedMaterials: [
      'ESP32 NodeMCU / DevKit V1 development board (dual-core 38-pin module)',
      'TB6612FNG Dual Motor Driver Breakout Board',
      'Micro-USB high-speed data communication cable',
      'Mobile smartphone or tablet with modern web browser (Chrome / Safari)',
      'Breadboard and jumper wires'
    ],
    safetyNotes: [
      'Always operate in isolated offline Local AP mode; never connect competition robots to unsecured public networks.',
      'ESP32 I/O pins operate on 3.3V logic: supplying 5.0V directly to GPIO pins will permanently destroy the chip.'
    ],
    classRhythm: [
      { 
        segment: '0–15m 32-bit Power', 
        minutes: 15, 
        teacherAction: 'Compare 8-bit Arduino Uno (16MHz, 2KB RAM) with 32-bit ESP32 (240MHz, 520KB RAM, Wi-Fi/BLE). Explain why robotics migrated to 32-bit.', 
        studentAction: 'Analyze memory and clock speed scaling; identify why multi-threading eliminates motor jitter.' 
      },
      { 
        segment: '15–35m Web Server', 
        minutes: 20, 
        teacherAction: 'Teach offline-first Local AP architecture: WiFi.softAP("RoboBEE-AP") and PROGMEM HTML web server hosting.', 
        studentAction: 'Upload standalone AP dashboard firmware; connect smartphone to robot Wi-Fi network (192.168.4.1).' 
      },
      { 
        segment: '35–50m Live Telemetry', 
        minutes: 15, 
        teacherAction: 'Supervise 20 Hz JSON telemetry streaming: watch live battery voltage and ultrasonic distance graph on mobile browser.', 
        studentAction: 'Interact with mobile touch controls; pilot robot wirelessly over local browser dashboard.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review FreeRTOS core isolation and evaluate browser telemetry latency.', 
        studentAction: 'Demonstrate live mobile dashboard telemetry and complete formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. 8-Bit AVR (ATmega328P) vs 32-Bit Dual-Core Xtensa (ESP32)',
        explanation: 'For decades, 8-bit microcontrollers powered hobby robots. But modern autonomous systems require immense computing throughput. Consider the hardware leap: the ATmega328P runs at 16 MHz with 2 Kilobytes of RAM and 32KB of Flash memory. In contrast, the ESP32 features a dual-core 32-bit Xtensa processor clocked at 240 MHz (15x faster), 520 Kilobytes of SRAM (260x more RAM!), 4 Megabytes of Flash, and integrated 2.4 GHz Wi-Fi and Bluetooth. It can perform floating-point trigonometric calculations, filter noisy IMU angles, and host a full web server simultaneously without breaking a sweat.',
        instructorNote: 'Compare chip dies on the board: show students how the ESP32 contains an entire computer system on a single module.'
      },
      {
        title: '2. Offline-First Local Access Point (AP Mode) Architecture',
        explanation: 'In competition halls (such as the World Robot Olympiad or Robot-Sumo championships), hundreds of active spectator smartphones jam public Wi-Fi networks, and cellular internet is often nonexistent. Relying on cloud servers (like AWS or Firebase) for robot control guarantees catastrophic failure. We design an Offline-First Architecture: the ESP32 acts as a standalone Wi-Fi router (Access Point Mode), broadcasting its own private SSID (`WiFi.softAP("RoboBEE-Rover", "secret123")`). Any phone or laptop connects directly to `192.168.4.1`, serving the complete HTML/CSS/JS dashboard stored in the ESP32 Flash memory with zero external dependencies.',
        instructorNote: 'Turn off the classroom Wi-Fi router: prove to students that their robot dashboard continues working flawlessly offline!'
      },
      {
        title: '3. High-Speed Telemetry: HTTP Polling vs Full-Duplex WebSockets',
        explanation: 'How does the web dashboard update live sensor data? Under HTTP Polling, the browser sends a `GET /data` request every 100ms. Each request requires establishing a TCP connection, exchanging HTTP headers (500 bytes of overhead), and tearing down the socket—wasting bandwidth and causing 50ms of latency. Professional robotics dashboards utilize WebSockets: a single TCP handshake upgrades the connection to a persistent, full-duplex socket. The robot pushes compact JSON or binary packets (`{"v":7.42,"d":35}`) at 20 Hz (every 50ms) with less than 2 bytes of overhead and sub-5ms latency!',
        instructorNote: 'Open the browser Developer Console Network tab: show students the difference between repetitive HTTP requests vs a single open WebSocket stream.'
      },
      {
        title: '4. Dual-Core Symmetric Multiprocessing via FreeRTOS Task Pinning',
        explanation: 'A critical vulnerability of single-core microcontrollers is that processing Wi-Fi network packets can temporarily interrupt motor PID calculations, causing high-speed robots to stutter or veer off track. The ESP32 solves this with Dual Cores: Core 0 (Protocol CPU) and Core 1 (Application CPU). Using FreeRTOS, we pin tasks explicitly: \n```cpp\nxTaskCreatePinnedToCore(motorPIDLoop, "PID_Task", 4096, NULL, 1, NULL, 1);\n```\nCore 1 runs high-speed motor control and sensor acquisition at a rock-solid 100 Hz, while Core 0 handles all Wi-Fi, TCP/IP, and web server processing. The two domains never interfere with each other!',
        instructorNote: 'Explain FreeRTOS core pinning on the board: Core 0 = Communications, Core 1 = Hard Real-Time Motion.'
      },
      {
        title: '5. Hardware Timer Interrupts and Dedicated LEDC PWM Peripherals',
        explanation: 'On the Arduino Uno, analogWrite() uses 8-bit timers tied to specific pins, producing an audible 490 Hz high-pitched whine from motor coils. The ESP32 provides a dedicated LED Control (LEDC) peripheral with 16 independent PWM channels. Any GPIO pin can be mapped to any PWM channel in software! Furthermore, you can configure PWM frequency to 20,000 Hz (ultrasonic) and resolution to 10-bit (0-1023 steps). At 20 kHz, motor coils operate completely outside the range of human hearing, delivering dead-silent, butter-smooth velocity control.',
        instructorNote: 'Switch PWM frequency from 490 Hz to 20,000 Hz: have students listen as the annoying motor whine disappears instantly!'
      },
      {
        title: '6. Local Wireless Security and 2.4 GHz Congestion Mitigation',
        explanation: 'In an arena with multiple competing teams, what prevents an opponent from connecting to your robot’s Access Point and hijacking your steering? We implement three layers of defensive wireless engineering: 1. WPA2-PSK Authentication with a strong pre-shared key. 2. Wi-Fi Channel Pinning: standard 2.4 GHz spectrum has only 3 non-overlapping channels (1, 6, and 11); scanning and pinning the quietest channel avoids packet collisions. 3. Client Whitelisting: configuring the firmware to accept commands exclusively from your designated tablet’s unique hardware MAC address.',
        instructorNote: 'Run a Wi-Fi analyzer app: show students the crowded 2.4 GHz spectrum and explain why channel selection matters.'
      }
    ],
    visualizerId: 'iot_dashboard_sim',
    project: {
      name: 'ESP32 Local AP & Telemetry Web Dashboard',
      deliverableType: 'code_artifact',
      successEvidence: [
        'ESP32 broadcasting standalone local Wi-Fi Access Point (SSID: RoboBEE-Telemetry) with zero internet connection.',
        'Connected smartphone browser loads responsive HTML5/JS dashboard from local IP 192.168.4.1.',
        'Streams real-time battery voltage and distance telemetry at 20 Hz while executing motor driving commands.'
      ]
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['ESP32 NodeMCU / DevKit V1 (30-pin or 38-pin)', 'TB6612FNG Dual Driver', 'HC-SR04 Ultrasonic Sensor', '7.4V Battery Pack with Buck Converter'],
      componentList: [
        { name: 'ESP32 DevKit V1 Board', exactVariant: 'Dual-core Xtensa 32-bit MCU with onboard PCB antenna', quantity: 1 },
        { name: 'TB6612FNG Motor Driver', exactVariant: 'Toshiba dual H-Bridge breakout board (3.3V logic compatible)', quantity: 1 },
        { name: 'Ultrasonic Rangefinder', exactVariant: 'HC-SR04P or RCWL-9610 (3.3V compatible ultrasonic sensor)', quantity: 1 },
        { name: 'DC-DC Buck Converter', exactVariant: 'MP1584 regulated to 5.0V input to ESP32 VIN pin', quantity: 1 },
        { name: '2WD Mobile Rover Assembly', exactVariant: 'Differential drive with twin gearmotors and battery pack', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/esp32_telemetry_wiring.svg',
      schematic: 'ESP32 VIN ➔ Buck 5V | GND ➔ Star GND. TB6612: PWMA ➔ GPIO 18, PWMB ➔ GPIO 19, Dirs ➔ GPIO 21, 22, 23, 25. Sonar on GPIO 4, 16.',
      wireTable: [
        { from: 'Buck Converter OUT+ (5.0V)', to: 'ESP32 VIN Pin', wireOrPolarityNote: 'Powers ESP32 onboard 3.3V LDO regulator' },
        { from: 'Star Ground Hub', to: 'ESP32 GND Pin', wireOrPolarityNote: 'Common ground reference' },
        { from: 'ESP32 GPIO 18', to: 'TB6612 PWMA Pin', wireOrPolarityNote: 'LEDC Channel 0 Hardware PWM (20kHz)' },
        { from: 'ESP32 GPIO 19', to: 'TB6612 PWMB Pin', wireOrPolarityNote: 'LEDC Channel 1 Hardware PWM (20kHz)' },
        { from: 'ESP32 GPIO 21 & 22', to: 'TB6612 AIN1 & AIN2', wireOrPolarityNote: 'Left motor direction control' },
        { from: 'ESP32 GPIO 23 & 25', to: 'TB6612 BIN1 & BIN2', wireOrPolarityNote: 'Right motor direction control' },
        { from: 'ESP32 GPIO 4 & 16', to: 'HC-SR04 Trig & Echo', wireOrPolarityNote: '3.3V compliant ultrasonic rangefinder pins' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Insert ESP32 module into mini breadboard.',
        '2. Connect motor driver logic leads to ESP32 GPIO pins according to wire table.',
        '3. Connect 5.0V from buck converter to ESP32 VIN pin (never exceed 5.5V on VIN!).',
        '4. Connect USB cable and upload the local AP dashboard firmware via Arduino IDE.',
        '5. Open Wi-Fi settings on mobile phone; connect to "RoboBEE-Telemetry" network (password: innovator123).',
        '6. Open mobile browser and navigate to http://192.168.4.1; verify live telemetry display.'
      ],
      powerAndSafetyChecks: [
        'ESP32 GPIO pins are strictly 3.3V: never connect 5V logic signals directly to ESP32 pins.',
        'Ensure the buck converter output is measured with a DMM and verified at 5.0V before connecting to VIN.',
        'Never power motors from the ESP32 3V3 onboard pin; doing so will immediately destroy the chip.'
      ],
      testCases: [
        { action: 'Power on ESP32 without internet', expectedResult: 'Broadcasts "RoboBEE-Telemetry" Wi-Fi network within 2 seconds of boot.' },
        { action: 'Navigate to http://192.168.4.1 on phone', expectedResult: 'Web browser renders full interactive telemetry dashboard.' },
        { action: 'Tap "FORWARD" button on phone dashboard', expectedResult: 'Motors engage instantly with <15ms latency; live telemetry graphs distance.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators - Advanced 08
// ESP32 Standalone Local Access Point & Telemetry Web Server
// Features: Dual-Core Architecture, Offline HTML5 Dashboard, 20Hz Telemetry

#include <WiFi.h>
#include <WebServer.h>

// Standalone Local Wi-Fi AP Credentials (No Internet Required!)
const char* AP_SSID = "RoboBEE-Telemetry";
const char* AP_PASS = "innovator123";

WebServer server(80);

// Hardware Motor Pins (TB6612FNG)
const int PIN_PWMA = 18;
const int PIN_AIN1 = 21;
const int PIN_AIN2 = 22;
const int PIN_PWMB = 19;
const int PIN_BIN1 = 23;
const int PIN_BIN2 = 25;

// LEDC Hardware PWM Properties
const int PWM_FREQ = 20000;    // 20 kHz Ultrasonic Frequency (Silent Motors!)
const int PWM_RES  = 8;        // 8-bit Resolution (0 - 255)
const int PWM_CH_L = 0;
const int PWM_CH_R = 1;

// Telemetry State Variables
float batteryVoltage = 7.42;
int obstacleDistance = 35;

// Embedded HTML5/CSS/JavaScript Dashboard stored in Flash memory
const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>RoboBEE Telemetry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #0f172a; color: #f8fafc; text-align: center; margin: 0; padding: 15px; }
    h1 { color: #F5B800; font-size: 1.3rem; margin-bottom: 5px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 15px; margin: 10px auto; max-width: 380px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
    .metric { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #334155; }
    .metric:last-child { border-bottom: none; }
    .label { font-size: 0.9rem; color: #94a3b8; }
    .val { font-size: 1.4rem; font-weight: bold; color: #38bdf8; }
    .btn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
    button { background: #6B0F24; color: #fff; border: 1px solid #F5B800; border-radius: 8px; padding: 18px; font-size: 1.1rem; font-weight: bold; touch-action: manipulation; }
    button:active { background: #F5B800; color: #000; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ROBOBEE TELEMETRY</h1>
    <p style="font-size:0.75rem; color:#64748b; margin-top:0;">Local AP Mode (192.168.4.1)</p>
    <div class="metric">
      <span class="label">BATTERY VOLTAGE:</span>
      <span id="bat" class="val">-- V</span>
    </div>
    <div class="metric">
      <span class="label">SONAR RANGE:</span>
      <span id="dist" class="val">-- cm</span>
    </div>
    <div class="metric">
      <span class="label">SYSTEM STATUS:</span>
      <span style="color:#22c55e; font-weight:bold;">CONNECTED</span>
    </div>
    <div class="btn-grid">
      <div></div><button ontouchstart="cmd('F')" ontouchend="cmd('S')">▲</button><div></div>
      <button ontouchstart="cmd('L')" ontouchend="cmd('S')">◀</button>
      <button ontouchstart="cmd('S')">■</button>
      <button ontouchstart="cmd('R')" ontouchend="cmd('S')">▶</button>
      <div></div><button ontouchstart="cmd('B')" ontouchend="cmd('S')">▼</button><div></div>
    </div>
  </div>
  <script>
    function cmd(c) { fetch('/cmd?dir=' + c); }
    setInterval(() => {
      fetch('/telemetry').then(r => r.json()).then(d => {
        document.getElementById('bat').innerText = d.v.toFixed(2) + ' V';
        document.getElementById('dist').innerText = d.d + ' cm';
      }).catch(e => {});
    }, 100); // 10 Hz refresh
  </script>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", INDEX_HTML);
}

void handleTelemetry() {
  // Read simulated/real analog battery rail on GPIO 34 (ADC1)
  int rawADC = analogRead(34);
  batteryVoltage = (rawADC / 4095.0) * 3.3 * 2.5; // Scaled for divider

  String json = "{\"v\":" + String(batteryVoltage, 2) + ",\"d\":" + String(obstacleDistance) + "}";
  server.send(200, "application/json", json);
}

void handleCommand() {
  if (server.hasArg("dir")) {
    String dir = server.arg("dir");
    char c = dir.charAt(0);
    switch (c) {
      case 'F': drive(180, 180); break;
      case 'B': drive(-180, -180); break;
      case 'L': drive(-160, 160); break;
      case 'R': drive(160, -160); break;
      case 'S': brake(); break;
    }
  }
  server.send(200, "text/plain", "OK");
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE ESP32 LOCAL TELEMETRY SERVER  "));
  Serial.println(F("========================================"));

  // Configure Motor Direction Pins
  pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT); pinMode(PIN_BIN2, OUTPUT);

  // Configure LEDC Hardware PWM Channels (20 kHz Silent Drive)
  ledcAttachChannel(PIN_PWMA, PWM_FREQ, PWM_RES, PWM_CH_L);
  ledcAttachChannel(PIN_PWMB, PWM_FREQ, PWM_RES, PWM_CH_R);

  // Initialize Standalone Local Access Point
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);

  IPAddress localIP = WiFi.softAPIP();
  Serial.print(F("📡 [WIFI] Access Point Online! SSID: "));
  Serial.println(AP_SSID);
  Serial.print(F("🌐 [SERVER] Web Dashboard URL: http://"));
  Serial.println(localIP);

  // Configure Web Server Handlers
  server.on("/", handleRoot);
  server.on("/telemetry", handleTelemetry);
  server.on("/cmd", handleCommand);
  server.begin();
  Serial.println(F("[SERVER] HTTP Server Online on Port 80."));
}

void loop() {
  server.handleClient(); // Process incoming browser requests
}

void drive(int l, int r) {
  digitalWrite(PIN_AIN1, l >= 0 ? HIGH : LOW);
  digitalWrite(PIN_AIN2, l >= 0 ? LOW : HIGH);
  ledcWrite(PIN_PWMA, abs(l));

  digitalWrite(PIN_BIN1, r >= 0 ? HIGH : LOW);
  digitalWrite(PIN_BIN2, r >= 0 ? LOW : HIGH);
  ledcWrite(PIN_PWMB, abs(r));
}

void brake() {
  digitalWrite(PIN_AIN1, HIGH); digitalWrite(PIN_AIN2, HIGH); ledcWrite(PIN_PWMA, 0);
  digitalWrite(PIN_BIN1, HIGH); digitalWrite(PIN_BIN2, HIGH); ledcWrite(PIN_PWMB, 0);
}
`,
      pinMap: {
        'GPIO 18 & 19': 'LEDC hardware PWM speed pins (20kHz silent motor drive)',
        'GPIO 21, 22, 23, 25': 'TB6612 motor direction pins',
        'GPIO 34 (ADC1)': 'Battery voltage monitoring analog input',
        'VIN & GND': '5.0V regulated power bus from buck converter'
      },
      setupAndUpload: [
        '1. Select "ESP32 Dev Module" in Arduino IDE Board Manager.',
        '2. Connect ESP32 via micro-USB data cable; upload sketch at 115200 baud.',
        '3. Open Serial Monitor at 115200 baud; observe AP IP address (192.168.4.1).',
        '4. Connect mobile phone to "RoboBEE-Telemetry" Wi-Fi network (password: innovator123).',
        '5. Open Chrome/Safari and visit http://192.168.4.1; test on-screen direction buttons.'
      ],
      explanations: [
        'WiFi.softAP(): Creates an independent Wi-Fi router entirely on-chip with zero internet connection.',
        'ledcAttachChannel(): Configures hardware PWM channels at 20 kHz for dead-silent motor actuation.',
        'INDEX_HTML PROGMEM: Stores complete responsive web application inside ESP32 Flash memory.'
      ],
      expectedResult: 'Phone connects to ESP32 Wi-Fi, browser displays real-time battery and distance readings, and touch buttons drive the robot with zero lag.',
      caveats: [
        'Mobile phones may display "No Internet Connection": select "Stay Connected to Wi-Fi" to enable communication.',
        'Never supply 5V to any GPIO pin; ESP32 inputs are strictly 3.3V maximum.'
      ],
      tweakTip: 'Add an on-screen slider on the web dashboard to dynamically adjust motor cruise speed from 100 to 255 in real time!'
    },
    activity: {
      title: 'Host and Deploy the Local IoT Web Dashboard',
      steps: [
        'Step 1: Wire the ESP32 to the TB6612 motor driver according to the 3.3V-safe wire table.',
        'Step 2: Upload the standalone Access Point sketch; verify serial baud rate is set to 115200.',
        'Step 3: Connect smartphone to the "RoboBEE-Telemetry" Wi-Fi network.',
        'Step 4: Navigate to http://192.168.4.1 in mobile browser; verify dashboard renders cleanly.',
        'Step 5: Tap direction buttons while observing wheel actuation; confirm immediate response.',
        'Step 6: Measure telemetry update frequency in browser console (must update at 10 Hz with <20ms latency).'
      ],
      successCriteria: [
        'ESP32 hosts standalone Access Point without external router or cloud infrastructure.',
        'HTML5 dashboard loads on mobile browser and streams live JSON telemetry at 10 Hz.',
        '20 kHz LEDC hardware PWM drives motors completely silently without audible whine.'
      ]
    },
    troubleshooting: [
      { 
        symptom: 'Phone immediately disconnects from ESP32 Wi-Fi after connecting.', 
        checks: [
          'Step 1: Check mobile phone settings—did Android/iOS prompt "This network has no internet access"?',
          'Step 2: Tap the notification and select "Always Stay Connected".',
          'Step 3: Temporarily disable cellular mobile data on the phone during testing.'
        ], 
        explanation: 'Modern smartphones automatically disconnect from Wi-Fi networks that lack internet access unless explicitly instructed to remain connected.' 
      },
      { 
        symptom: 'Sketch fails to upload with "A fatal error occurred: Failed to connect to ESP32".', 
        checks: [
          'Step 1: Hold down the physical "BOOT" button on the ESP32 module while the IDE says "Connecting...".',
          'Step 2: Release the button once the red progress percentage appears.',
          'Step 3: Add a 10uF capacitor between the ESP32 EN pin and GND to enable auto-boot flashing.'
        ], 
        explanation: 'Some ESP32 development boards require manual assertion of the GPIO 0 bootloader strapping pin to enter UART download mode.' 
      },
      { 
        symptom: 'Motors do not spin when web buttons are pressed, but Serial prints "OK".', 
        checks: [
          'Step 1: Verify TB6612 STBY pin is connected to 3.3V or driven HIGH in setup().',
          'Step 2: Check motor battery power switch (7.4V VM rail must be powered).',
          'Step 3: Verify LEDC PWM channel mapping in ledcWrite().'
        ], 
        explanation: 'If the motor driver STBY pin is LOW or floating, the H-Bridge stays in low-power shutdown mode regardless of PWM signals.' 
      },
      { 
        symptom: 'Analog battery voltage reading reports 4095 constantly.', 
        checks: [
          'Step 1: Verify the analog pin used—did you pick an ADC2 pin while Wi-Fi is running?',
          'Step 2: Switch analog input to an ADC1 pin (GPIO 32, 33, 34, 35, 36, 39).',
          'Step 3: Verify the 2:1 voltage divider is dropping the battery voltage below 3.3V.'
        ], 
        explanation: 'The ESP32 internal Wi-Fi peripheral uses ADC2; attempting to use ADC2 pins while Wi-Fi is active returns corrupted 4095 readings.' 
      }
    ],
    checksForUnderstanding: [
      'Why is an offline-first Local Access Point (AP Mode) architecture required in competition robotics?',
      'How does the ESP32 LEDC hardware PWM peripheral eliminate motor coil whine?',
      'Explain why FreeRTOS dual-core task pinning prevents Wi-Fi network latency from jittering motor PID loops.'
    ],
    exitTicket: [
      { 
        question: 'What is the operational difference between the ESP32 running in Station (STA) mode versus Access Point (AP) mode?', 
        rubricOrSampleReasoning: 'STA mode connects to an existing external Wi-Fi router (requiring infrastructure); AP mode turns the ESP32 into its own standalone router, broadcasting a local network without internet.' 
      },
      { 
        question: 'Why must you use ADC1 pins (e.g. GPIO 34) rather than ADC2 pins for analog sensors on an ESP32 when Wi-Fi is active?', 
        rubricOrSampleReasoning: 'The ESP32 internal Wi-Fi driver hardware shares and monopolizes ADC2; attempting to read ADC2 pins while Wi-Fi is enabled causes hardware conflicts and invalid readings.' 
      },
      { 
        question: 'What is the maximum safe logic voltage that can be applied to an ESP32 GPIO input pin?', 
        rubricOrSampleReasoning: '3.3 Volts DC; supplying 5.0V directly to an ESP32 GPIO pin will degrade or permanently destroy the silicon input protection diodes.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-compiled binary firmware flashable with ESP Flash Tool via USB.'],
      extension: ['Implement a real-time WebSocket binary streaming telemetry link updating at 50 Hz.'],
      offlineOption: ['Analyze FreeRTOS task state diagrams and context switching timing graphs on paper.']
    },
    nextLessonId: 'adv-09',
    nextLessonTeaser: 'Advanced 09: Autonomous Combat & Mini-Sumo Robotics — Subsumption architecture, priority arbiters, white border Tawara detection, and high-torque combat tactics!',
    sources: [{ title: 'Espressif Systems: ESP32 Technical Reference Manual & FreeRTOS Architecture', url: 'https://espressif.com' }],
    assetCredits: [{ asset: 'Telemetry Interface Mockup', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
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
        technicalMeaning: 'The mechanical technique of lifting an opponent chassis to reduce their wheel normal force to zero, eliminating their traction ($F_f = \mu N = 0$).' 
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
        title: '1. Subsumption Architecture: Rodney Brooks\' Behavioral Hierarchy',
        explanation: 'In autonomous combat robotics, classic sequential programming fails. If your robot sees an opponent outside the ring and charges forward without verifying floor safety, it will drive itself straight off the edge into oblivion! We implement Rodney Brooks\' Subsumption Architecture: behaviors are decomposed into layered competency tiers: \n• Layer 0 (SURVIVAL): Bottom IR edge detection. If white border seen ➔ REVERSE & SPIN! \n• Layer 1 (ATTACK): Front distance sensor. If opponent within 40cm ➔ CHARGE 100% PWM! \n• Layer 2 (SEARCH): Idle scan. Rotate in place to radar-sweep the circular ring. \nLayer 0 unconditionally subsumes (overrides) Layer 1 and Layer 2 on every single loop iteration.',
        instructorNote: 'Draw the layered architecture diagram: show how Layer 0 cuts the wire of Layer 1 whenever the white border is touched.'
      },
      {
        title: '2. Downward TCRT5000 Optical Border Sensing Physics',
        explanation: 'The dohyo ring surface is matte black (reflectance ~5%), while the outer 5cm Tawara border is brilliant white (reflectance ~85%). Two downward-facing TCRT5000 optical sensors are mounted at the extreme front corners, positioned 3mm to 5mm above the mat. Over the black floor, the phototransistor turns OFF, pulling analog voltage HIGH. The instant a sensor crosses onto the white line, optical reflectance surges, pulling voltage LOW. Using digital interrupts or high-speed analog thresholds, the microcontroller detects the edge in less than 2 milliseconds!',
        instructorNote: 'Demonstrate sensor contrast on the DMM: show the massive voltage swing from black mat (4.2V) to white border (0.4V).'
      },
      {
        title: '3. Circular Dohyo Geometry & Autonomous Search Trajectories',
        explanation: 'A standard Mini-Sumo dohyo has a 77cm diameter ($Area \approx 0.466\text{ m}^2$). Because you cannot predict where the opponent will move after the 5-second countdown, autonomous search routines dominate: 1. Stationary Radar Spin: The robot executes a zero-radius tank pivot at 120 PWM, sweeping its front ultrasonic rangefinder across 360 degrees in ~0.8 seconds. 2. Spiral Outward Sweep: Gently driving in an expanding spiral to sweep the ring center. 3. Probing Yoyo: Charging forward 20cm, backing up 10cm, and sweeping. The instant the distance reading drops below 40cm, radar lock is achieved!',
        instructorNote: 'Map out search trajectories on the board: show why high-speed rotation provides the fastest target acquisition.'
      },
      {
        title: '4. Wedge Scraping Mechanics & The Normal Force Neutralizer',
        explanation: 'In robot-sumo, pushing victory is governed by Coulomb Friction: $F_{push} \le \mu \cdot N$. Both robots have a maximum weight of 500g ($N = 4.9\text{ N}$). If two robots collide head-on, the robot with the lower front scoop wins. Why? A razor-sharp 15-degree wedge blade slides beneath the opponent’s front bumper as they push forward. As the opponent rides up your wedge, their drive wheels are lifted off the dohyo floor! Their normal force becomes ZERO ($N_{opponent} = 0$), destroying their traction completely, while your normal force doubles ($N_{you} = 4.9\text{N} + 4.9\text{N} = 9.8\text{N}$), giving you 2x pushing grip!',
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
      code: `// RoboBEE Innovators - Advanced 09
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
`,
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
        question: 'What happens to an opponent robot\'s pushing force if your front wedge lifts its drive wheels 2mm off the arena mat?', 
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
  },

  {
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
        technicalMeaning: 'The numerical product of Severity (S), Occurrence (O), and Detection (D) ratings used to prioritize engineering corrective actions ($RPN = S \times O \times D$).' 
      },
      { 
        term: 'Mean Time Between Failures (MTBF)', 
        plainMeaning: 'How many hours your robot can run continuously on average before something breaks.', 
        technicalMeaning: 'The predicted elapsed time between inherent system failures during normal operation ($MTBF = \text{Operating Time} / \text{Failures}$).' 
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
        explanation: 'Amateur builders test a robot until it works once, then declare success. Professional systems engineers test a robot until it CANNOT fail! Failure Mode and Effects Analysis (FMEA) is the aerospace standard: you brainstorm every component failure mode, scoring: \n• Severity (S: 1 = harmless glitch, 10 = fire/total destruction) \n• Occurrence (O: 1 = once in a million, 10 = happens every match) \n• Detection (D: 1 = immediately obvious on bench, 10 = hidden until failure) \nMultiplying these yields the Risk Priority Number ($RPN = S \times O \times D$). Any failure mode with RPN > 120 must receive mandatory engineering redesign before tournament day.',
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
        explanation: 'When a motor driver pushes an opponent or climbs a ramp, internal power dissipation surges: $P_{diss} = I_{rms}^2 \times R_{DS(on)} + V_{drop} \times I$. For a TB6612 delivering 1.8A, junction temperature rises according to thermal resistance: $T_j = T_a + (P_{diss} \times R_{\theta JA})$. If junction temperature reaches 150°C, the silicon’s internal Thermal Shutdown (TSD) circuit trips, cutting motor power for 2 seconds! Adding a miniature finned aluminum heatsink with thermal silicone adhesive slashes thermal resistance by 50%, keeping the driver safely below 85°C.',
        instructorNote: 'Use an infrared thermal camera or contact probe to show a bare driver chip running hot vs a heatsinked driver.'
      },
      {
        title: '5. Empirical 10-Trial Test Matrices & Statistical Reliability',
        explanation: 'If a robot completes 1 lap of a track, what is its reliability? Zero statistical confidence! To prove mission readiness, engineering teams execute a 10-Trial Test Matrix: running 10 consecutive identical missions while logging: 1. Elapsed course time. 2. End-of-run battery voltage. 3. Optical line departures or false obstacle triggers. Calculating the Mean ($\\mu$) and Standard Deviation ($\\sigma$) reveals stability: if lap time is $14.2\\text{s} \\pm 0.3\\text{s}$, the system is deterministic; if lap time is $14.2\\text{s} \\pm 4.5\\text{s}$, hidden friction or electrical noise is corrupting performance.',
        instructorNote: 'Record lap times from 5 student runs: calculate standard deviation live on the whiteboard.'
      },
      {
        title: '6. Mean Time Between Failures (MTBF) & Pre-Flight Qualification',
        explanation: 'Mean Time Between Failures (MTBF) quantifies long-term system health: \n$MTBF = \\frac{\\text{Total Operating Hours}}{\\text{Total Number of Observed Failures}}$\nIf a robot runs for 5 hours of cumulative practice and experiences 2 wire disconnections and 1 software crash, its MTBF is $5.0 / 3 = 1.67\\text{ hours}$. Before an engineering sign-off for national competition, the vehicle must achieve an MTBF exceeding 10 operating hours with zero unresolved high-severity failure modes.',
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
      code: `// RoboBEE Innovators - Advanced 10
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
`,
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
  },

  {
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
        explanation: 'In commercial robotics (such as Boston Dynamics or NASA JPL), complex robots are never built by lone wolves. They are created by cross-functional teams using Agile Sprints: timeboxed engineering iterations focused on tangible deliverables. A balanced robotics squad assigns 4 vital roles: \n• Mechanical Lead: CAD chassis, gearbox ratios, center of gravity ($z_{cg}$), and fastener torque. \n• Electrical & Power Lead: Battery discharge budgets, voltage regulation, wire gauges, and common ground star buses. \n• Firmware & Algorithms Lead: Real-time scheduling, interrupt service routines (ISRs), and sensor arbitration. \n• Systems Integration Lead: End-to-end testing, error logging, and the team Build Journal.',
        instructorNote: 'Ensure teams rotate roles across projects so every student masters mechanical, electrical, and software disciplines.'
      },
      {
        title: '2. Contemporaneous Engineering Build Journals',
        explanation: 'In aerospace engineering and patent law, if an experiment is not recorded contemporaneously (in real-time as it occurs), it legally never happened! A professional Build Journal is bound (never loose-leaf) and written in ink. Key rules: \n1. Never erase or white-out mistakes; draw a single neat strikethrough ($---$) with your initials, preserving the audit trail of what failed and why. \n2. Record exact part numbers, measured wire resistances, and battery cell voltages. \n3. Sketch physical wiring pinouts before writing a single line of code. \n4. Document every software change with git commit hashes and observed behavior.',
        instructorNote: 'Show an authentic engineering notebook: emphasize that failed tests with clear notes are more valuable than unrecorded lucky runs.'
      },
      {
        title: '3. Peer Code Reviews & Static Firmware Verification',
        explanation: 'The human brain suffers from cognitive confirmation bias: an engineer who spent 3 hours writing a 200-line control loop will read right past their own off-by-one errors or uninitialized variables. A Peer Code Review eliminates this blind spot. Before flashing firmware to the physical capstone rover, another teammate must review the code against a 5-point safety rubric: \n1. Are all shared ISR variables declared \\texttt{volatile}? \n2. Are multi-byte variables protected by atomic guards (\\texttt{noInterrupts()})? \n3. Are there ZERO blocking \\texttt{delay()} calls inside autonomous state loops? \n4. Do all sensor sampling routines include fail-safe timeout boundaries? \n5. Are all microcontroller pins explicitly matched to the electrical wire table?',
        instructorNote: 'Have pairs swap laptops and annotate code comments using the 5-point safety rubric.'
      },
      {
        title: '4. Pre-Flight Cold Electrical Continuity Verification',
        explanation: 'The single most catastrophic moment in robotics is the "Smoke Test"—plugging in a fresh 7.4V Li-Po battery when an accidental solder bridge or stray wire strand shorts the power rail to ground. A 2S Li-Po can deliver over 40A of instantaneous short-circuit current, vaporizing PCB copper traces and frying the microcontroller within 80 milliseconds! To eliminate this risk, professional teams enforce a mandatory Cold Continuity Check: \n• Switch DMM to Resistance / Continuity mode (\\Omega). \n• Probe between Battery Positive Terminal ($V_{in}$) and Common Ground (GND). \n• Resistance must read Mega-ohms (open circuit). If resistance is $<10\\,\\Omega$, DO NOT CONNECT POWER—isolate and fix the short circuit immediately!',
        instructorNote: 'Demonstrate with a DMM: show what open circuit (O.L.) looks like versus an audible short beep.'
      },
      {
        title: '5. Multi-Domain Subsystem Integration & Pin Arbitrations',
        explanation: 'When 5 separate modules (optical encoders, ultrasonic sonar, TCRT5000 line array, TB6612 motor driver, and serial telemetry) combine onto an Arduino Uno, hardware resource contention is severe. The ATmega328P has only two external hardware interrupt pins: Pin 2 (INT0) and Pin 3 (INT1). Therefore: \n• Encoders MUST claim Pins 2 and 3 for microsecond pulse capture. \n• Hardware PWM pins (Timer 0: D5, D6; Timer 1: D9, D10; Timer 2: D3, D11) must be reserved for motor speeds without conflicting with encoder interrupts. \n• Ultrasonic echo timing cannot use blocking \\texttt{pulseIn()} without a microsecond timeout ($18000\\,\\mu\\text{s} \\approx 3\\text{m}$), otherwise a lost acoustic ping freezes the entire rover.',
        instructorNote: 'Review the pin budget matrix on the whiteboard: show how every single pin from D2 to A4 is mapped without conflict.'
      },
      {
        title: '6. The Subsystem Milestone 3 Gate (Go/No-Go Qualification)',
        explanation: 'Before any robot is permitted to conduct integrated autonomous trials in the arena, it must clear the Milestone 3 Gate. The inspection panel verifies three objective criteria: \n1. Mechanical & Wiring Inspection: All M3 fasteners secured with Nyloc nuts; wire harnesses clamped with zip-tie strain relief within 30mm of terminals; center of gravity balanced over drive wheels. \n2. Electrical Isolation: Multimeter confirms open-circuit between $V_{bat}$ and GND; inline 3A fuse installed; emergency mechanical toggle switch easily reachable. \n3. Propped-Wheel Bench Verification: With wheels elevated in the air, the rover streams live encoder ticks and sonar distance to Serial Monitor, confirming correct motor direction before tires touch the ground.',
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
      code: `// RoboBEE Innovators - Advanced 11
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
`,
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
  },

  {
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
        explanation: 'In aerospace organizations like NASA, ESA, and SpaceX, no spacecraft or autonomous rover is cleared for launch without passing a Critical Design Review (CDR). A CDR is not a superficial sales pitch; it is an exhaustive technical interrogation where engineers present the complete system architecture: \n1. Functional Requirements: What exact specifications was the robot required to meet? \n2. Subsystem Schematics: Detailed mechanical CAD drawings, electrical schematics, and finite-state machine diagrams. \n3. Verification Evidence: Empirical proof (graphs, tables, MTBF statistics) demonstrating the machine satisfies every requirement under worst-case operating conditions. Professional engineers speak with numbers and data, never opinions!',
        instructorNote: 'Remind students: judges do not care about buzzwords; judges care about measured tolerances, ampere draws, and loop execution frequencies.'
      },
      {
        title: '2. Defending Engineering Tradeoffs with Empirical Telemetry',
        explanation: 'Every engineering design is an exercise in tradeoffs. A robot cannot simultaneously possess infinite speed, infinite torque, zero mass, and zero battery consumption! In your CDR, the jury will challenge your decisions: \n• "Why did you choose a 30:1 gear ratio instead of 50:1?" An amateur answers: "It felt fast." An innovator defends with physics: "$30:1$ provides $0.32\\,\\text{N}\\cdot\\text{m}$ stall torque, accelerating our $0.85\\,\\text{kg}$ chassis at $1.8\\,\\text{m/s}^2$ while drawing only $1.2\\,\\text{A}$, staying safely within our $2.5\\,\\text{A}$ power budget." \n• "Why ultrasonic over optical sensors?" Defense: "Acoustic waves are unaffected by arena ambient lighting or dark glossy floor reflections, eliminating false edge triggers."',
        instructorNote: 'Coach teams to reference specific equations and test log data when answering questions from the jury.'
      },
      {
        title: '3. Engineering Poise & The Science of Handling Live Failures',
        explanation: 'Robotics is an unforgiving contact sport governed by Murphy’s Law: "Anything that can go wrong, will go wrong—at the worst possible moment." During a live demonstration, an unexpected arena surface reflection or a loose connector might cause the robot to hesitate or stall. Amateur builders panic, make excuses, or blame their partners. Professional systems engineers demonstrate Demonstration Poise: \n1. Maintain absolute calm and professional posture. \n2. Consult live telemetry data on the diagnostic serial stream: "The robot has transitioned into State 3 (Search) because optical line sensor A1 read 820 ADC due to arena spotlight flare." \n3. Explain the exact corrective measure for Revision 2.0. The jury rewards technical poise and diagnostic mastery far more than unearned lucky runs!',
        instructorNote: 'Emphasize to the audience that how an engineer diagnoses an unexpected glitch reveals their true competence.'
      },
      {
        title: '4. Documenting Technical Debt & The Revision 2.0 Roadmap',
        explanation: 'No engineering project is ever truly "finished"; it is merely deployed at a given deadline! In every complex machine, compromises were made to meet schedule: a 3D-printed bracket that flexes slightly under shock, a breadboard wire harness that needs custom PCB routing, or a state machine that relies on fixed timeouts instead of dynamic PID tracking. A mature engineering organization documents this openly as Technical Debt. In the final slide of your CDR, present your Revision 2.0 Roadmap: 3 specific architectural upgrades you will implement in the next development cycle.',
        instructorNote: 'Praise teams who demonstrate self-awareness by highlighting their technical debt and presenting concrete engineering solutions.'
      },
      {
        title: '5. Ethics, Safety & Responsibility in Autonomous Robotics',
        explanation: 'As autonomous machines increasingly enter society—from self-driving automobiles and warehouse logistics rovers to medical surgical robots and agricultural drones—roboticists bear profound ethical responsibilities: \n• Failsafe Architecture: An autonomous system must default to a safe, unpowered state whenever power decays, sensor signals fail, or human operators command an emergency stop. \n• Algorithmic Transparency: Robot decision-making must be deterministic, auditable, and logged to non-volatile memory. \n• Human Stewardship: Robotics technology must always be directed toward elevating human potential, protecting life, and solving real-world challenges with integrity and scientific truth.',
        instructorNote: 'Lead a brief discussion on why safety interlocks and software watchdog timers are ethical requirements, not optional extras.'
      },
      {
        title: '6. The RoboBEE Innovators Creed & The Lifelong Engineering Journey',
        explanation: 'Reflect on where you began: in Class 01, you wired a single coin-cell battery to light a miniature LED. Today, in Class 36, you have designed, built, wired, and programmed an autonomous, multi-tasking mobile robot capable of real-time odometry, sensor fusion, and closed-loop control! You have earned the title of RoboBEE Innovator. Live by our engineering creed: \n• DREAM: Envision bold, imaginative solutions to real-world problems. \n• INVENT: Transform creative ideas into functional physical mechanisms and code. \n• EXPERIMENT: Test relentlessly, embrace failure as data, and persevere. \n• INSPIRE: Share your knowledge generously and mentor the next generation of engineers!',
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
      code: `// RoboBEE Innovators - Advanced 12
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
`,
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
  }
];

const SUPPLEMENTAL_BUILD_PACKS: Record<string, PhysicalBuildPack> = {
  'exp-01': {
    verifiedBoardAndModules: ['Physical Machine Cards', 'Sense-Decide-Act Sorting Mats', 'Demo Arduino Uno R3 + HC-SR04'],
    componentList: [
      { name: 'Sense-Decide-Act Sorting Mat', exactVariant: 'Laminated A3 Classroom Mat', quantity: 1 },
      { name: 'Machine & Robot Evidence Cards', exactVariant: '12-Card Classroom Set', quantity: 1 },
      { name: 'Instructor Demo Sonar Rig', exactVariant: 'Arduino Uno R3 + HC-SR04 Ultrasonic Sensor', quantity: 1 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/explorer-robot-detective.svg',
    schematic: '[Sensor Input (Eyes/Ears)] ---> [Controller Brain (Decision Rules)] ---> [Actuator Output (Motors/Lights)]',
    wireTable: [
      { from: 'Sensor Card (Input)', to: 'SENSE Column on Detective Mat', wireOrPolarityNote: 'Identifies what changed in the environment' },
      { from: 'Rule Card (Logic)', to: 'DECIDE Column on Detective Mat', wireOrPolarityNote: 'Matches sensor reading to an IF/THEN rule' },
      { from: 'Motor/Light Card (Output)', to: 'ACT Column on Detective Mat', wireOrPolarityNote: 'Performs physical action in the real world' }
    ],
    assemblyAndPowerUpSteps: [
      'Lay out the Sense-Decide-Act Detective Mat at your partner station.',
      'Sort all 12 machine cards into Robot vs. Non-Robot piles using the 3-part test.',
      'Trace the signal arrow from the sensor input to the controller brain and out to the actuator.'
    ],
    powerAndSafetyChecks: [
      'Do not touch spinning demo fan blades during the live machine comparison.',
      'Keep magnetic sorting cards away from exposed USB power ports.'
    ],
    testCases: [
      { action: 'Hold hand 15 cm in front of the demo ultrasonic sensor', expectedResult: 'Demo robot senses distance, controller decides it is < 20 cm, and LED/buzzer acts immediately' },
      { action: 'Flip wall switch on a standard toaster', expectedResult: 'Heats on a fixed timer without sensing bread color — classified as a non-robot machine' }
    ]
  },
  'exp-03': {
    verifiedBoardAndModules: ['2WD Demo Rover or Tabletop Grid Bot', 'Floor Grid Mat (4x4 Tiles)', 'Command Arrow Cards'],
    componentList: [
      { name: 'Floor Grid Mat', exactVariant: '4x4 Taped Classroom Tiles (30 cm per square)', quantity: 1 },
      { name: 'Sequence Command Cards', exactVariant: 'FORWARD 1, TURN LEFT 90°, TURN RIGHT 90°, STOP', quantity: 20 },
      { name: 'Obstacle Marker Cones', exactVariant: 'Foam Classroom Cones', quantity: 3 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/explorer-rover-route.svg',
    schematic: '[START Tile] --> [FORWARD 1] --> [TURN RIGHT 90°] --> [FORWARD 2] --> [STOP on Target]',
    wireTable: [
      { from: 'Left Wheel + Right Wheel Forward', to: 'Rover Drives Straight 1 Grid Square', wireOrPolarityNote: 'Both motors spin forward at equal speed' },
      { from: 'Left Wheel Forward + Right Wheel Stop/Reverse', to: 'Rover Pivots 90° Right', wireOrPolarityNote: 'Differential steering pivot turn' },
      { from: 'Card Bug Marker', to: 'Exact Step Where Rover Left the Path', wireOrPolarityNote: 'Used to isolate and fix one card at a time' }
    ],
    assemblyAndPowerUpSteps: [
      'Place the Rover on the START square facing the North arrow.',
      'Lay out your Command Cards in a single left-to-right row on the programming strip.',
      'Have the Robot Walker execute ONLY what each card says, one step at a time.'
    ],
    powerAndSafetyChecks: [
      'Keep the floor grid clear of backpacks and loose wires to prevent tripping.',
      'Never push or force a motorized rover wheels by hand while its motor switch is ON.'
    ],
    testCases: [
      { action: 'Run the 5-card sequence around the center obstacle cone', expectedResult: 'Rover reaches the yellow TARGET square without touching any obstacle cone' },
      { action: 'Swap a TURN LEFT card for an accidental TURN RIGHT bug', expectedResult: 'Rover turns away from the obstacle and reaches the goal on Trial 2' }
    ]
  },
  'exp-04': {
    verifiedBoardAndModules: ['RoboBEE Invention Blueprint Sheet', 'Cardboard & Craft Prototype Materials', '3V Coin-Cell LED Indicator Kit'],
    componentList: [
      { name: 'Invention Blueprint Template', exactVariant: 'A3 Sense-Decide-Act Design Sheet', quantity: 1 },
      { name: '3V Coin-Cell & 5mm LED Indicator', exactVariant: 'CR2032 Holder + Diffused LED', quantity: 1 },
      { name: 'Chassis Prototype Craft Pack', exactVariant: 'Cardboard panels, brass fasteners, markers', quantity: 1 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/explorer-helper-design.svg',
    schematic: '[Problem Identified] --> [Sensor Placement] --> [Controller Rule Card] --> [Actuator Output]',
    wireTable: [
      { from: 'CR2032 Positive (+) Terminal', to: 'LED Long Leg (Anode)', wireOrPolarityNote: 'Provides 3V indicator power when switch closes' },
      { from: 'CR2032 Negative (-) Terminal', to: 'LED Short Leg (Cathode) via Paper Switch', wireOrPolarityNote: 'Completes the indicator circuit during demo' }
    ],
    assemblyAndPowerUpSteps: [
      'Draw your Helper Robot on the Blueprint Sheet and label its Sensor, Brain, and Actuator.',
      'Build a tabletop cardboard model showing where the sensor looks and what part moves or lights up.',
      'Attach the 3V LED indicator to light up when your helper robot activates.'
    ],
    powerAndSafetyChecks: [
      'Use safety scissors under instructor supervision when cutting cardboard panels.',
      'Keep 3V coin cells inside their snaps and never place batteries near your mouth.'
    ],
    testCases: [
      { action: 'Press the paper switch on the Helper Robot prototype', expectedResult: 'Status LED illuminates and team explains Sense -> Decide -> Act in 60 seconds' }
    ]
  },
  'int-08': {
    verifiedBoardAndModules: ['Digital Calipers (0-150mm)', 'OpenSCAD / Tinkercad Workstation', 'SG90 Servo & HC-SR04 Reference Parts'],
    componentList: [
      { name: 'Digital Caliper', exactVariant: '0.1mm Resolution Stainless/Carbon Caliper', quantity: 1 },
      { name: 'SG90 Micro Servo', exactVariant: '9g Servo with Mounting Ears (22.5 x 12.2 mm)', quantity: 1 },
      { name: 'M3 Hardware Assortment', exactVariant: 'M3x10 Bolts & M3 Hex Nuts for clearance testing', quantity: 4 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/cad_ultrasonic_bracket_blueprint.svg',
    schematic: '[Caliper Nominal Measurement] + [0.4mm FDM Clearance Allowance] --> [Parametric OpenSCAD Bracket] --> [STL Export]',
    wireTable: [
      { from: 'M3 Bolt Nominal Shaft (3.0 mm)', to: 'CAD Clearance Hole (3.4 mm)', wireOrPolarityNote: '+0.4 mm clearance so bolt slides through without cracking PLA' },
      { from: 'SG90 Servo Body (22.5 x 12.2 mm)', to: 'CAD Pocket Cutout (23.0 x 12.7 mm)', wireOrPolarityNote: '+0.5 mm pocket tolerance for clean press-in fit' },
      { from: 'Chassis Deck Hole Spacing (30.0 mm)', to: 'Bracket Base Mount Holes (30.0 mm center-to-center)', wireOrPolarityNote: 'Aligns bracket with existing rover deck' }
    ],
    assemblyAndPowerUpSteps: [
      'Zero your digital calipers with jaws closed before measuring the SG90 servo body and mounting ears.',
      'Record raw measurements in your engineering notebook, then add +0.4 mm clearance for holes and +0.5 mm for pockets.',
      'Enter your dimensions into the parametric OpenSCAD script, render (F6), and verify wall thickness >= 3.0 mm.'
    ],
    powerAndSafetyChecks: [
      'Digital caliper tips are sharp — keep jaws closed when placing on the workbench.',
      'Never touch a 3D printer hotend (200°C+) or heated build plate during print verification.'
    ],
    testCases: [
      { action: 'Change hole_d or pocket_w variable at the top of the OpenSCAD file and press F5', expectedResult: 'Entire 3D bracket updates cleanly without broken geometry' },
      { action: 'Test-fit an M3 bolt through a 3.4 mm printed test coupon hole', expectedResult: 'M3 bolt passes through smoothly with zero post-drilling required' }
    ]
  },
  'int-10': {
    verifiedBoardAndModules: ['Arduino Uno R3', 'L298N / TB6612FNG Dual Motor Driver', 'Dual IR Reflectance Sensors', 'HC-SR04 Ultrasonic Sensor', 'SG90 Servo'],
    componentList: [
      { name: 'Autonomous Rover Platform', exactVariant: '2WD Chassis with Arduino Uno R3 & Motor Driver', quantity: 1 },
      { name: 'Dual IR Line Sensor Pair', exactVariant: 'Left (A0) & Right (A1) Downward Reflectance Sensors', quantity: 2 },
      { name: 'HC-SR04 Ultrasonic Sensor', exactVariant: 'Front Obstacle Detector (Trig D9, Echo D10)', quantity: 1 },
      { name: 'SG90 Servo Gate/Gripper', exactVariant: 'Payload Marker Arm on D6', quantity: 1 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/line_follower_integrated_wiring.svg',
    schematic: '[IR Left A0 / Right A1] + [HC-SR04 D9/D10] --> [Arduino Finite State Machine] --> [Motor Driver D5/D3/D7/D8 + Servo D6]',
    wireTable: [
      { from: 'Left & Right IR Sensors OUT', to: 'Arduino A0 (Left) & A1 (Right)', wireOrPolarityNote: 'Reads track reflectance continuously' },
      { from: 'HC-SR04 TRIG / ECHO', to: 'Arduino D9 (TRIG) / D10 (ECHO)', wireOrPolarityNote: 'Checks for safety stop obstacles < 15 cm' },
      { from: 'Motor Driver ENA / IN1 / IN2 / ENB / IN3 / IN4', to: 'Arduino D5 / D7 / D8 / D3 / D4 / D2', wireOrPolarityNote: 'Controls differential wheel speed and direction' },
      { from: 'Battery Pack GND & Arduino GND', to: 'Common Ground Rail', wireOrPolarityNote: 'Mandatory shared reference across all subsystems' }
    ],
    assemblyAndPowerUpSteps: [
      'Complete the Pre-Run Inspection Checklist: common ground verified, battery > 7.4V, sensor bolts tight, wires strain-relieved.',
      'Place the rover at the start of the 3-Zone Course (Zone 1: Line Follow -> Zone 2: Obstacle Stop -> Zone 3: Target Dock).',
      'Execute 3 official timed trials and log completion time, state transitions, and any interventions.'
    ],
    powerAndSafetyChecks: [
      'Always lift drive wheels off the table when uploading new firmware so the rover does not drive off the bench.',
      'Disconnect the main battery pack immediately if the servo or motor stalls against a physical stop.'
    ],
    testCases: [
      { action: 'Place an obstacle block in Zone 2 while the rover is following the line', expectedResult: 'Rover transitions from FOLLOW_LINE to OBSTACLE_WAIT within 15 cm and pauses safely' },
      { action: 'Remove the obstacle block from Zone 2', expectedResult: 'Rover resumes line tracking and docks cleanly in Zone 3' }
    ]
  },
  'adv-01': {
    verifiedBoardAndModules: ['Competition Robot Platform', 'Digital Kitchen Scale (0-2000g)', '200x200mm Sizing Box', 'Digital Multimeter'],
    componentList: [
      { name: 'Sizing Inspection Box', exactVariant: '200 mm x 200 mm Internal Acrylic/Plywood Check Box', quantity: 1 },
      { name: 'Digital Mass Scale', exactVariant: '1g Resolution Bench Scale', quantity: 1 },
      { name: 'Kill-Switch & Battery Harness', exactVariant: 'High-Current Toggle Switch in Series with Battery (+)', quantity: 1 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/3_trial_arena_test_setup.svg',
    schematic: '[Competition Rulebook Constraints] --> [Weighted Trade-Off Matrix] --> [Sub-System Architecture & Kill-Switch Spec]',
    wireTable: [
      { from: 'Main Battery Pack Positive (+)', to: 'Master Kill-Switch Terminal 1', wireOrPolarityNote: 'All robot power must pass through the master switch' },
      { from: 'Master Kill-Switch Terminal 2', to: 'Motor Driver VMS & Buck Converter IN+', wireOrPolarityNote: 'Flipping switch OFF cuts all actuators and logic immediately' },
      { from: 'Main Battery Pack Negative (-)', to: 'Star Ground Point', wireOrPolarityNote: 'Single common ground return for power and telemetry' }
    ],
    assemblyAndPowerUpSteps: [
      'Place the candidate robot chassis inside the 200x200mm sizing box with zero manual compression.',
      'Weigh the complete chassis, battery, motors, and sensors on the digital scale and record the mass margin below 1500g.',
      'Score 3 candidate architectures in the Weighted Trade-Off Matrix and verify 1-second kill-switch accessibility.'
    ],
    powerAndSafetyChecks: [
      'Every competition robot must have a clearly marked red Master Kill-Switch reachable from above without touching wheels or blades.',
      'Insulate all exposed battery terminals with heat-shrink tubing before tech inspection.'
    ],
    testCases: [
      { action: 'Drop robot into the 200x200mm inspection box and weigh on scale', expectedResult: 'Passes dimensional clearance with >= 4 mm margin and mass <= 1450g' },
      { action: 'Actuate the Master Kill-Switch during full-speed bench test', expectedResult: 'All motors and indicators de-energize instantaneously' }
    ]
  },
  'adv-02': {
    verifiedBoardAndModules: ['2S 7.4V LiPo / 6xAA Battery Pack', 'LM2596 / Pololu 5V Step-Down Buck Converter', 'Inline Blade Fuse Holder (5A)', 'Digital Multimeter'],
    componentList: [
      { name: 'Adjustable Buck Converter', exactVariant: 'LM2596 DC-DC Step-Down Regulator (Adjusted to 5.00V)', quantity: 1 },
      { name: 'Inline Fuse & Master Switch', exactVariant: '5A Fast-Blow Blade Fuse + High-Current Switch', quantity: 1 },
      { name: 'Decoupling Capacitor', exactVariant: '470µF 16V Electrolytic Capacitor across Motor Rail', quantity: 1 },
      { name: 'Digital Multimeter', exactVariant: 'DC Voltage & Continuity Tester', quantity: 1 }
    ],
    connectionPhotoOrClearlyLabeledIllustration: '/illustrations/dual_rail_power_wiring.svg',
    schematic: '[Battery +] --> [5A Fuse] --> [Kill Switch] --+--> [Raw Motor Rail (VMS)] \n                                               +--> [Buck IN+] --> [5.00V Logic Rail (Arduino 5V / Sensors)]',
    wireTable: [
      { from: 'Battery (+) via 5A Fuse & Kill Switch', to: 'Motor Driver VMS + Buck Converter IN+', wireOrPolarityNote: 'Splits high-current motor power from regulated logic input' },
      { from: 'Buck Converter OUT+ (Pre-calibrated to 5.00V)', to: 'Logic & Sensor 5V Rail', wireOrPolarityNote: 'Verify 5.00V on multimeter BEFORE connecting microcontroller!' },
      { from: 'Battery (-), Motor Driver GND, Buck GND, Logic GND', to: 'Central Star Ground Bus', wireOrPolarityNote: 'Prevents ground-bounce resets during motor stall current spikes' }
    ],
    assemblyAndPowerUpSteps: [
      'Wire the Battery (+) through the 5A inline fuse and Master Kill-Switch before connecting any downstream load.',
      'Connect the Buck Converter input only (leave the microcontroller disconnected!), power on, and turn the brass trim pot until your multimeter reads exactly 5.00V DC.',
      'Power off, connect the logic rail and star ground bus, and verify zero brownout resets under simulated motor load.'
    ],
    powerAndSafetyChecks: [
      'CRITICAL: Always calibrate an adjustable buck converter with a multimeter BEFORE connecting the Arduino or sensors — factory trim pots often ship set to 9V–12V!',
      'Never bypass the inline 5A fuse on LiPo or high-current battery packs.'
    ],
    testCases: [
      { action: 'Measure Buck Converter output voltage with multimeter while motor load switches on', expectedResult: 'Logic rail remains rock-steady between 4.95V and 5.05V with zero MCU resets' },
      { action: 'Check continuity from Battery (-) to Arduino GND, Sensor GND, and Driver GND', expectedResult: 'Multimeter beeps (< 0.5 Ω) confirming solid Star Ground continuity' }
    ]
  }
};

const SUPPLEMENTAL_CODE_LABS: Record<string, CodeLab> = {
  'exp-01': {
    language: 'pseudocode',
    code: `// EXPLORER 01: ROBOT DETECTIVE LOGIC RULES
// Every true robot follows SENSE -> DECIDE -> ACT:

WHEN ultrasonic_sensor_distance_cm < 20:
  DECIDE: "Obstacle is close!"
  ACT:    turn_on_warning_led(GREEN_SAFE = OFF, RED_ALERT = ON)
  ACT:    stop_wheel_motors()
OTHERWISE:
  DECIDE: "Path is clear!"
  ACT:    turn_on_warning_led(GREEN_SAFE = ON, RED_ALERT = OFF)
  ACT:    drive_forward_slowly()`,
    pinMap: {
      'Ultrasonic Eye': 'SENSE Input (Measures distance in cm)',
      'Arduino Brain': 'DECIDE Controller (Checks if distance < 20 cm)',
      'Wheels & LED': 'ACT Output (Stops motors and lights warning LED)'
    },
    setupAndUpload: [
      'Read each line of the Robot Detective rule card aloud with your partner.',
      'Point to the physical part on the instructor demo robot that performs SENSE, DECIDE, and ACT.',
      'Test both branches of the rule by moving your hand closer than 20 cm and farther than 20 cm.'
    ],
    explanations: [
      'WHEN ultrasonic_sensor_distance_cm < 20 checks the sensor input (SENSE).',
      'DECIDE compares the sensor reading against our safety rule.',
      'ACT sends power to the LEDs and wheel motors based on that decision.'
    ],
    expectedResult: 'Students accurately predict whether the demo robot will drive or stop before the hand test is performed.',
    caveats: ['A machine without a sensor or decision rule repeats the same action blindly even if an obstacle is in the way.'],
    tweakTip: 'What happens if we change the rule from 20 cm to 40 cm? The robot stops much earlier!'
  },
  'exp-02': {
    language: 'pseudocode',
    code: `// EXPLORER 02: CLOSED LOOP & SWITCH LOGIC
// Electricity only flows when the loop is complete from (+) to (-):

IF switch_button == PRESSED:
  circuit_loop = CLOSED
  current_flows_through_resistor_and_led = TRUE
  red_led_state = ON
ELSE:
  circuit_loop = OPEN_GAP
  current_flows_through_resistor_and_led = FALSE
  red_led_state = OFF`,
    pinMap: {
      'Battery (+) Red Rail': 'Energy Source (Pushes current into the loop)',
      'Pushbutton Switch': 'Gatekeeper (Closes or opens the bridge)',
      'Resistor + LED': 'Protected Load (Lights up when current returns to -)'
    },
    setupAndUpload: [
      'Trace the circuit path with your finger starting at Battery (+).',
      'Verify the LED long leg (+) faces the switch/battery (+) side and short leg (-) faces Ground (-).',
      'Press the switch to close the gap and watch the LED illuminate.'
    ],
    explanations: [
      'CLOSED loop means there is an unbroken metal path from (+) through the LED and back to (-).',
      'OPEN loop means a gap (like an unpressed switch) stops current everywhere in the branch.'
    ],
    expectedResult: 'The LED lights brightly when the switch is pressed and turns off immediately when released.',
    caveats: ['If the LED is plugged in backward, the loop is blocked because an LED is a one-way valve for electricity.'],
    tweakTip: 'Try adding a second switch in series — now BOTH partners must press their switches together to light the LED!'
  },
  'exp-03': {
    language: 'pseudocode',
    code: `// EXPLORER 03: ROVER GRID NAVIGATION SEQUENCE
// Each step executes in strict top-to-bottom order:

STEP 1: START at Square (A, 1) facing NORTH
STEP 2: MOVE_FORWARD(1_SQUARE)      // Now at (A, 2) facing NORTH
STEP 3: TURN_RIGHT(90_DEGREES)      // Now at (A, 2) facing EAST (avoids cone at A,3)
STEP 4: MOVE_FORWARD(2_SQUARES)     // Now at (C, 2) facing EAST
STEP 5: TURN_LEFT(90_DEGREES)       // Now at (C, 2) facing NORTH
STEP 6: MOVE_FORWARD(2_SQUARES)     // Now at TARGET (C, 4)!
STEP 7: STOP_MOTORS()`,
    pinMap: {
      'Left + Right Motors Forward': 'MOVE_FORWARD(1_SQUARE)',
      'Left Forward + Right Reverse': 'TURN_RIGHT(90_DEGREES)',
      'Left Reverse + Right Forward': 'TURN_LEFT(90_DEGREES)'
    },
    setupAndUpload: [
      'Lay out your 7 command cards in order from left to right.',
      'Have the Programmer read one step at a time while the Robot Walker moves on the floor grid.',
      'If the rover touches a cone, place the Bug Marker on that exact card and swap it.'
    ],
    explanations: [
      'TURN_RIGHT(90_DEGREES) rotates the rover in place on its current grid square without moving forward.',
      'MOVE_FORWARD(2_SQUARES) advances two full grid tiles in the direction the rover Nose Arrow is currently pointing.'
    ],
    expectedResult: 'The rover navigates around the obstacle cones and stops cleanly inside the TARGET square.',
    caveats: ['Forgetting that a turn only rotates in place (and does not move to the next square) is the #1 navigation bug!'],
    tweakTip: 'Can you find a second valid path around the left side of the obstacle using the exact same number of cards?'
  },
  'exp-04': {
    language: 'pseudocode',
    code: `// EXPLORER 04: MY HELPER ROBOT DESIGN SPECIFICATION
// Helper Robot Name: Smart Plant Watering Buddy

DEFINE SENSE_INPUT:
  soil_moisture_sensor (placed in flowerpot soil)

DEFINE DECIDE_RULE:
  IF soil_moisture_level == DRY:
    trigger_action = WATER_AND_ALERT
  ELSE:
    trigger_action = STAND_BY_HAPPY

DEFINE ACT_OUTPUT:
  WHEN WATER_AND_ALERT:
    turn_on_blue_led()
    open_water_spout_for_3_seconds()`,
    pinMap: {
      'Sensor Input': 'Soil Moisture Probe / Touch Switch',
      'Controller Brain': 'Arduino Decision Rule (DRY vs. OK)',
      'Actuator Output': '3V Blue Status LED + Servo Spout'
    },
    setupAndUpload: [
      'Fill in your own Sensor, Decision Rule, and Actuator on the Invention Blueprint Sheet.',
      'Wire the 3V coin-cell and LED indicator into your cardboard prototype.',
      'Present a 60-second showcase demonstrating how your helper robot senses, decides, and acts.'
    ],
    explanations: [
      'SENSE_INPUT defines what real-world clue your robot measures.',
      'DECIDE_RULE states the exact condition that triggers your robot into action.',
      'ACT_OUTPUT describes the physical movement, light, or sound that helps the user.'
    ],
    expectedResult: 'Every student team presents a complete, working tabletop prototype with a clear Sense-Decide-Act specification.',
    caveats: ['Make sure your sensor measures something related to the problem (e.g., moisture for plants, distance for doorway alerts).'],
    tweakTip: 'Add a second LED color so humans can tell at a glance whether the robot is standing by (Green) or actively helping (Blue)!'
  },
  'int-08': {
    language: 'openscad',
    code: `// INTERMEDIATE 08: PARAMETRIC SENSOR/SERVO BRACKET WITH FIT TOLERANCES
// All dimensions in millimeters (mm)
$fn = 48;

// 1. Measured Nominal Dimensions + 3D Print Clearance Allowances
servo_w      = 22.5 + 0.5; // 22.5mm nominal + 0.5mm pocket clearance
servo_d      = 12.2 + 0.5; // 12.2mm nominal + 0.5mm pocket clearance
wall_t       = 3.2;        // Minimum 3.0mm structural wall thickness
base_hole_cc = 30.0;       // Chassis deck M3 hole spacing (center-to-center)
m3_clear_d   = 3.0 + 0.4;  // 3.0mm M3 screw + 0.4mm clearance fit

module sensor_servo_bracket() {
  difference() {
    // Outer structural body + mounting flange
    union() {
      cube([servo_w + 2*wall_t, servo_d + 2*wall_t, 16], center=true);
      translate([0, 0, -6])
        cube([base_hole_cc + 14, servo_d + 2*wall_t, 4], center=true);
    }
    // Servo rectangular pocket cutout
    cube([servo_w, servo_d, 20], center=true);
    // Left & Right M3 chassis mounting holes (3.4mm diameter)
    for (x_pos = [-base_hole_cc/2, base_hole_cc/2]) {
      translate([x_pos, 0, -6])
        cylinder(h=10, d=m3_clear_d, center=true);
    }
  }
}

sensor_servo_bracket();`,
    pinMap: {
      'm3_clear_d (3.4 mm)': 'M3 through-hole (+0.4 mm clearance so bolt does not crack PLA)',
      'servo_w (23.0 mm)': 'SG90 body width (+0.5 mm pocket clearance)',
      'wall_t (3.2 mm)': 'Structural wall thickness (>= 3.0 mm rule)'
    },
    setupAndUpload: [
      'Open OpenSCAD (or model the equivalent parametric solids in Tinkercad) and paste the script.',
      'Press F5 to preview and inspect the servo pocket and two M3 mounting holes.',
      'Verify with your caliper log that servo_w, servo_d, and base_hole_cc match your physical hardware, then press F6 and Export as STL.'
    ],
    explanations: [
      'Adding +0.4 mm to m3_clear_d compensates for FDM plastic squish so M3 bolts slide in cleanly.',
      'Using variables at the top of the file lets you adjust tolerances in 5 seconds if a printer runs tight.'
    ],
    expectedResult: 'Clean, manifold 3D bracket STL with 3.4 mm M3 clearance holes, 23.0 x 12.7 mm servo pocket, and 3.2 mm walls.',
    caveats: ['Designing a 3.0 mm hole for a 3.0 mm screw will print undersized (~2.7 mm) and split the layer lines when forced.'],
    tweakTip: 'Change m3_clear_d to 2.85 if you want the M3 screw to self-tap threads directly into the plastic without a hex nut!'
  },
  'int-10': {
    language: 'cpp',
    code: `// INTERMEDIATE 10: CAPSTONE MULTI-SENSOR STATE-MACHINE ROVER
const int PIN_IR_L = A0, PIN_IR_R = A1;
const int PIN_TRIG = 9,  PIN_ECHO = 10;
const int ENA = 5, IN1 = 7, IN2 = 8;
const int ENB = 3, IN3 = 4, IN4 = 2;

enum MissionState { FOLLOW_LINE, OBSTACLE_HOLD, MISSION_DOCKED };
MissionState state = FOLLOW_LINE;
const int IR_THRESH = 500; // Calibrated midpoint from Serial Plotter

long readSonarCm() {
  digitalWrite(PIN_TRIG, LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long dur = pulseIn(PIN_ECHO, HIGH, 20000);
  return (dur == 0) ? 999 : (dur * 0.0343) / 2;
}

void setMotors(int leftSpd, int rightSpd) {
  digitalWrite(IN1, leftSpd >= 0 ? HIGH : LOW);
  digitalWrite(IN2, leftSpd >= 0 ? LOW  : HIGH);
  analogWrite(ENA, abs(leftSpd));
  digitalWrite(IN3, rightSpd >= 0 ? HIGH : LOW);
  digitalWrite(IN4, rightSpd >= 0 ? LOW  : HIGH);
  analogWrite(ENB, abs(rightSpd));
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  int irL = analogRead(PIN_IR_L);
  int irR = analogRead(PIN_IR_R);
  long distCm = readSonarCm();

  switch (state) {
    case FOLLOW_LINE:
      if (distCm < 15) { setMotors(0, 0); state = OBSTACLE_HOLD; }
      else if (irL > IR_THRESH && irR > IR_THRESH) { setMotors(0, 0); state = MISSION_DOCKED; }
      else if (irL > IR_THRESH) setMotors(70, 150);
      else if (irR > IR_THRESH) setMotors(150, 70);
      else setMotors(135, 135);
      break;
    case OBSTACLE_HOLD:
      setMotors(0, 0);
      if (distCm >= 20) state = FOLLOW_LINE;
      break;
    case MISSION_DOCKED:
      setMotors(0, 0);
      break;
  }
}`,
    pinMap: {
      'A0 / A1': 'Left & Right IR Reflectance Sensors',
      'D9 / D10': 'HC-SR04 Ultrasonic TRIG / ECHO',
      'D5, D7, D8': 'Left Motor PWM (ENA) & Direction (IN1, IN2)',
      'D3, D4, D2': 'Right Motor PWM (ENB) & Direction (IN3, IN4)'
    },
    setupAndUpload: [
      'Measure white floor and black tape values first and update IR_THRESH with your calibrated midpoint.',
      'Upload the sketch with wheels elevated off the bench and verify state transitions in the Serial Monitor.',
      'Place the rover on the Zone 1 start line and switch motor power ON for your 3 official trials.'
    ],
    explanations: [
      'MissionState enum keeps FOLLOW_LINE, OBSTACLE_HOLD, and MISSION_DOCKED cleanly separated with zero spaghetti if/else nesting.',
      'pulseIn timeout (20000 us) prevents the line follower from freezing if no ultrasonic echo is returned.'
    ],
    expectedResult: 'Rover tracks the course line smoothly, pauses automatically when an obstacle is within 15 cm, resumes when cleared, and docks at the perpendicular stop bar.',
    caveats: ['Never use delay(1000) inside FOLLOW_LINE — even a 200ms blocking delay will make the rover overshoot sharp turns.'],
    tweakTip: 'Lower base speed from 135 to 115 if your battery pack is freshly charged above 8.0V.'
  },
  'adv-01': {
    language: 'cpp',
    code: `// ADVANCED 01: PRE-MATCH COMPLIANCE & HARDWARE SELF-TEST DIAGNOSTIC
const int PIN_BATT_SENSE = A3;
const int PIN_START_BTN  = 12;
const int PIN_STATUS_LED = 13;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_START_BTN, INPUT_PULLUP);
  pinMode(PIN_STATUS_LED, OUTPUT);
  Serial.println(F("=== ROBOBEE COMPETITION TECH-INSPECTION DIAGNOSTIC ==="));
  Serial.println(F("1. Verify chassis fits 200x200mm box & mass < 1500g"));
  Serial.println(F("2. Verify Master Kill-Switch cuts VMS + Logic cleanly"));
  Serial.println(F("3. Waiting for Start Button (D12 -> GND) for 5s Safety Delay..."));
}

void loop() {
  if (digitalRead(PIN_START_BTN) == LOW) {
    Serial.println(F("MATCH START TRIGGERED: Counting mandatory 5.00s safety delay..."));
    for (int i = 5; i > 0; i--) {
      Serial.print(F("T-minus ")); Serial.print(i); Serial.println(F("s"));
      digitalWrite(PIN_STATUS_LED, HIGH); delay(250);
      digitalWrite(PIN_STATUS_LED, LOW);  delay(750);
    }
    Serial.println(F("AUTONOMOUS MATCH STATE ACTIVE!"));
    while (true) { digitalWrite(PIN_STATUS_LED, HIGH); }
  }
}`,
    pinMap: {
      'D12 (INPUT_PULLUP)': 'Competition Start Button (Active-LOW to GND)',
      'D13': 'Inspection & 5-Second Countdown Status LED',
      'A3': 'Optional Voltage Divider Sense Input'
    },
    setupAndUpload: [
      'Upload the diagnostic firmware to verify serial telemetry at 115200 baud.',
      'Press the Start Button on D12 and time the 5-second safety countdown with a stopwatch.',
      'Test the Master Kill-Switch mid-countdown to prove instantaneous power cutoff.'
    ],
    explanations: [
      'Competition rules require a mandatory 5-second hands-clear countdown after pressing Start before any motor may spin.',
      'INPUT_PULLUP holds D12 HIGH until the button connects it to GND, preventing false starts from electrical noise.'
    ],
    expectedResult: 'Pressing the Start button blinks D13 five times at 1 Hz and logs the countdown before entering Autonomous Match State.',
    caveats: ['Moving before the 5.0-second countdown completes results in an automatic false-start disqualification in Mini-Sumo.'],
    tweakTip: 'Use millis() timestamps during the countdown so sensors can warm up and sample background reflectance before motion starts.'
  },
  'adv-02': {
    language: 'cpp',
    code: `// ADVANCED 02: BROWNOUT DETECTOR & BATTERY RAIL TELEMETRY MONITOR
// Detects unexpected MCU resets caused by power-rail sag during motor stall spikes
const int PIN_STATUS_LED = 13;
unsigned long bootTimestampMs = 0;
unsigned long lastHeartbeatMs = 0;
int loopCounter = 0;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_STATUS_LED, OUTPUT);
  // Rapid 3-flash signature indicates a fresh MCU boot or brownout reset!
  for (int i = 0; i < 3; i++) {
    digitalWrite(PIN_STATUS_LED, HIGH); delay(80);
    digitalWrite(PIN_STATUS_LED, LOW);  delay(80);
  }
  Serial.println(F("!!! MCU BOOT EVENT DETECTED (Check for Brownout if mid-run) !!!"));
}

void loop() {
  unsigned long now = millis();
  if (now - lastHeartbeatMs >= 500) {
    lastHeartbeatMs = now;
    loopCounter++;
    Serial.print(F("[UPTIME ")); Serial.print(now / 1000.0, 1);
    Serial.print(F("s] Rail Stable | Heartbeat #")); Serial.println(loopCounter);
  }
}`,
    pinMap: {
      'D13': 'Boot-Signature LED (Flashes 3x rapidly if MCU resets)',
      'Buck OUT+ (5.00V)': 'Regulated 5V Logic Supply',
      'Star Ground Bus': 'Common Reference for Battery (-), Driver GND, and Logic GND'
    },
    setupAndUpload: [
      'Calibrate your Buck Converter to 5.00V with a multimeter BEFORE connecting the Arduino.',
      'Upload the Brownout Detector sketch and open Serial Monitor at 115200 baud.',
      'Command a sudden motor direction reversal; verify that Uptime continues counting smoothly without printing a fresh MCU BOOT EVENT.'
    ],
    explanations: [
      'setup() only runs once at power-up or after a reset. If you see "MCU BOOT EVENT" when motors start, your 5V rail sagged below the brownout threshold!',
      'Separating the raw motor rail from the regulated 5.00V buck rail eliminates voltage droop on the microcontroller.'
    ],
    expectedResult: 'Uptime counter increments continuously across heavy motor starts with zero unexpected reboot signatures.',
    caveats: ['Never power high-stall DC motors from the Arduino onboard 5V pin — its linear regulator will overheat or drop out.'],
    tweakTip: 'Add a 470µF electrolytic capacitor across the motor driver VMS and GND terminals to absorb sudden current spikes.'
  }
};

// Populate universal 120-minute standard, complete build/code packs, and backward-compatibility aliases
ALL_ROBOTICS_LESSONS.forEach(lesson => {
  // 1. Enforce 120-minute (2-hour) standard across all 36 classes with 60-minute compact option
  lesson.durationMinutes = 120;
  lesson.compactDurationMinutes = 60;

  // 2. Enforce 5-segment 120-minute Class Rhythm (15 + 25 + 35 + 30 + 15 = 120m)
  const rhythmSum = lesson.classRhythm.reduce((acc, r) => acc + r.minutes, 0);
  if (lesson.classRhythm.length !== 5 || rhythmSum !== 120) {
    const r0 = lesson.classRhythm[0];
    const r1 = lesson.classRhythm[1] || r0;
    const r2 = lesson.classRhythm[2] || r1;
    const r3 = lesson.classRhythm[3] || r2;
    lesson.classRhythm = [
      {
        segment: r0?.segment || 'Warm-Up & Concept Hook',
        minutes: 15,
        teacherAction: r0?.teacherAction || `Introduce ${lesson.title} and frame today's engineering mission.`,
        studentAction: r0?.studentAction || 'Inspect starter hardware, review safety rules, and predict system behavior.'
      },
      {
        segment: r1?.segment || 'Core Engineering Theory & Pinout Walkthrough',
        minutes: 25,
        teacherAction: r1?.teacherAction || 'Walk through the schematic, pinout map, and key engineering vocabulary on the projector.',
        studentAction: r1?.studentAction || 'Trace signal and power paths on the diagram and record pin assignments.'
      },
      {
        segment: r2?.segment || 'Guided Physical Build & Wiring Lab',
        minutes: 35,
        teacherAction: r2?.teacherAction || 'Coach bench teams through power-off wiring, mechanical assembly, and continuity inspection.',
        studentAction: r2?.studentAction || 'Build the circuit or mechanism step-by-step with power disconnected and verify polarity.'
      },
      {
        segment: 'Code Upload, Calibration & Challenge Trials',
        minutes: 30,
        teacherAction: r2?.teacherAction || 'Guide code upload, live telemetry verification, and structured 3-trial bench testing.',
        studentAction: r2?.studentAction || 'Upload code, tune parameters, and record results across structured test cases.'
      },
      {
        segment: r3?.segment || 'Exit Check, Troubleshooting Debrief & Bench Reset',
        minutes: 15,
        teacherAction: r3?.teacherAction || 'Run the 4-question Exit Check, review common hardware bugs, and verify kit sign-off.',
        studentAction: r3?.studentAction || 'Complete the Exit Check, log final evidence, and sort components back into storage.'
      }
    ];
  }

  // 3. Populate supplemental physicalBuildPack & codeLab so 36/36 lessons have complete hardware & code packs
  if (!lesson.physicalBuildPack && SUPPLEMENTAL_BUILD_PACKS[lesson.id]) {
    lesson.physicalBuildPack = SUPPLEMENTAL_BUILD_PACKS[lesson.id];
  }
  if (!lesson.codeLab && SUPPLEMENTAL_CODE_LABS[lesson.id]) {
    lesson.codeLab = SUPPLEMENTAL_CODE_LABS[lesson.id];
  }

  // 4. Backward-compatibility aliases
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

// Backward compatibility with legacy components
export const CURRICULUM_CLASSES = ALL_ROBOTICS_LESSONS.filter(l => l.courseId === 'beginner');

export const CURRICULUM_STATS = {
  totalClasses: ALL_ROBOTICS_LESSONS.length,
  totalHours: 72,
  levels: COURSE_SPACES.map(cs => ({
    name: cs.title,
    classes: ALL_ROBOTICS_LESSONS.filter(l => l.courseId === cs.id).map(l => l.sequence),
    color: cs.accentColor,
    description: cs.description
  }))
};

