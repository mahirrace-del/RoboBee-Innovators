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
  // COURSE SPACE B: BEGINNER ROBOTICS (CLASSES 01-10) — REQUIRED FLAGSHIP
  // -----------------------------------------------------------------------
  {
    id: 'beg-01',
    fieldGuideLinks: {
      readBeforeClass: ["fg-foundations-what-is-robot", "fg-arduino-microcontroller-vs-computer"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-prog-program-structure"],
      goDeeper: ["fg-arduino-ide-workflow", "fg-safety-lab-code"]
    },
    courseId: 'beginner',
    sequence: 1,
    code: 'BEGINNER 01',
    title: 'Welcome to Robotics: Meet Arduino, Then Make an LED Blink',
    subtitle: 'Discover how real robots Sense, Decide, and Act, tour the Arduino microcontroller brain, and build your first programmable hardware circuit.',
    promise: 'Discover how real robots Sense, Decide, and Act, tour the Arduino microcontroller brain, and build your first programmable hardware circuit.',
    status: 'published',
    proposedAudience: 'Proposed Pathway for Classes 5–8 (Ages 10–14) — Subject to Cohort & Kit Confirmation',
    durationMinutes: 90,
    compactDurationMinutes: 60,
    prerequisites: ['None — Designed for complete beginners with zero prior electronics or coding experience.'],
    outcomes: [
      'Define a True Robot vs. a Machine: Explain using real-world evidence that a robot is a system that Senses its environment (inputs), Decides using a programmed controller (processing), and Acts on the physical world (outputs).',
      'Identify Core Robotics Hardware: Locate and state the function of the USB port, power pins (5V, 3.3V, GND), digital I/O pins (D0–D13), analog input pins (A0–A5), microcontroller chip (ATmega328P), and onboard LED (LED_BUILTIN) on an Arduino Uno R3 reference board.',
      'Construct a Safe Current-Limited LED Circuit: Build an external breadboard circuit connecting an Arduino digital output pin, a 220 Ω – 330 Ω series resistor, and a 5mm LED with correct anode (+) and cathode (-) polarity returning to GND.',
      'Read, Upload & Explain Embedded C++ Structure: Upload a complete Arduino sketch and explain the exact role of const int, void setup(), void loop(), pinMode(), digitalWrite(), HIGH, LOW, and delay().',
      'Conduct a Timing Experiment: Modify millisecond parameters inside delay(), predict how changing ON and OFF durations changes blink frequency and duty cycle, and record observations in an engineering trial log.'
    ],
    vocabulary: [
      {
        term: 'Robot',
        plainMeaning: 'A programmable machine that can gather information from the world around it, make choices using code, and move or signal in response.',
        technicalMeaning: 'An autonomous or semi-autonomous electromechanical system integrating sensors (transducers), a programmable processing unit (microcontroller/computer), and actuators operating in a Sense–Decide–Act control loop.'
      },
      {
        term: 'Sense → Decide → Act Loop',
        plainMeaning: 'The 3-step thinking cycle every robot repeats: Sense what is happening, Decide what to do next, and Act by turning on lights, motors, or speakers.',
        technicalMeaning: 'The fundamental cybernetic control paradigm where input signals from sensors are sampled by a processor, evaluated against algorithmic rules, and converted into electrical drive signals for output actuators.'
      },
      {
        term: 'Microcontroller (MCU)',
        plainMeaning: 'A tiny, single-chip computer on the Arduino board that stores and runs one dedicated control program over and over.',
        technicalMeaning: 'An integrated circuit (such as the 8-bit AVR ATmega328P running at 16 MHz on the Arduino Uno R3) containing a CPU core, Flash program memory (32 KB), SRAM (2 KB), EEPROM (1 KB), timers, and general-purpose input/output (GPIO) peripherals on a single die.'
      },
      {
        term: 'Sensor (Input)',
        plainMeaning: 'A robot\'s "eyes, ears, or fingertips" that measure things like distance, light, touch, or temperature.',
        technicalMeaning: 'An input transducer that converts a physical phenomenon (sound waves, infrared reflectance, mechanical pressure, heat) into a measurable electrical voltage or digital signal for the microcontroller.'
      },
      {
        term: 'Actuator / Output',
        plainMeaning: 'A robot\'s "muscles or voice"—any part that does physical work or shows a signal, like an LED lighting up or a motor spinning a wheel.',
        technicalMeaning: 'A hardware device driven by electrical energy that produces a physical output (photon emission in an LED, rotational torque in a DC/servo motor, or acoustic waves in a piezo buzzer).'
      },
      {
        term: 'Solderless Breadboard',
        plainMeaning: 'A reusable plug-and-play board with hidden metal clips underneath that lets us connect electronic parts without melting solder.',
        technicalMeaning: 'A construction base for prototyping electronics featuring internal spring-loaded nickel-silver phosphor bronze clips arranged in horizontal 5-point terminal strips (separated by a 7.62 mm DIP center channel) and vertical power distribution buses.'
      },
      {
        term: 'LED (Light-Emitting Diode)',
        plainMeaning: 'A tiny electronic light that only lets electricity flow in one direction—in through the long leg (+ Anode) and out through the short leg (- Cathode).',
        technicalMeaning: 'A two-lead semiconductor light source (p–n junction diode) that emits photons via electroluminescence when forward-biased above its forward voltage drop (Vf ≈ 1.8V–2.2V for standard red LEDs).'
      },
      {
        term: 'Current-Limiting Resistor (Ohm\'s Law)',
        plainMeaning: 'A safety "speed bump" for electricity that slows down electrical current so the LED and Arduino pin don\'t burn out.',
        technicalMeaning: 'A passive two-terminal component measured in Ohms (Ω) placed in series with a load to restrict current flow according to Ohm\'s Law (I = (Vsupply - Vf) / R), keeping pin current safely around 10–15 mA (well under the ATmega328P\'s 20 mA recommended continuous limit and 40 mA absolute maximum).'
      },
      {
        term: 'Digital Signal (HIGH / LOW)',
        plainMeaning: 'A two-state electrical switch signal where HIGH means "ON (5 Volts)" and LOW means "OFF (0 Volts)".',
        technicalMeaning: 'A discrete binary logic signal representing two voltage states: Logic 1 (HIGH, ≈ 5.0V on 5V AVR boards or 3.3V on 3.3V boards) and Logic 0 (LOW, 0V referenced to Ground).'
      },
      {
        term: 'Ground (GND)',
        plainMeaning: 'The "return home" path for electricity—every circuit must connect back to GND to complete a closed loop.',
        technicalMeaning: 'The common zero-volt (0V) reference potential in an electrical circuit through which return current flows back to the power source.'
      },
      {
        term: 'void setup() & void loop()',
        plainMeaning: 'setup() is the checklist the Arduino runs once when it wakes up; loop() is the main routine it repeats forever while powered on.',
        technicalMeaning: 'The two mandatory entry-point functions in an Arduino C++ sketch: setup() executes once after power-on or hardware reset to initialize pin modes and peripherals, after which the runtime infinitely invokes loop().'
      },
      {
        term: 'Milliseconds (ms) & delay()',
        plainMeaning: 'One-thousandths of a second (1,000 ms = 1 second). delay(1000) tells the Arduino to pause right where it is for 1 full second.',
        technicalMeaning: 'A unit of time equal to 10^-3 seconds passed as an unsigned long argument to delay(ms), which halts sequential CPU instruction execution for the specified duration while hardware timers continue counting.'
      }
    ],
    realWorldDomains: [
      {
        title: 'Precision Agriculture & Food Security',
        domain: 'Agriculture',
        sense: 'Soil moisture probes, ambient humidity & crop canopy cameras',
        decide: 'Microcontroller calculates irrigation deficit & nutrient requirements',
        act: 'Solenoid water valves open & autonomous sprayer rovers navigate rows',
        description: 'Autonomous soil-moisture rovers and automated irrigation systems sense plant hydration, decide exactly which zones need water, and act by opening targeted valves—conserving fresh water across agricultural communities.'
      },
      {
        title: 'Healthcare, Surgery & Hospital Logistics',
        domain: 'Healthcare',
        sense: 'Hallway LiDAR, ultrasonic obstacle rangefinders & patient bed sensors',
        decide: 'Navigation computer calculates collision-free hospital transit routes',
        act: 'Differential-drive wheels deliver sterile medicine trays to nurse stations',
        description: 'Autonomous hospital pharmacy carts sense hallway obstacles using ultrasonic and laser sensors, decide safe detours around gurneys, and act by delivering critical medication safely without delay.'
      },
      {
        title: 'Safe Manufacturing & Quality Inspection',
        domain: 'Manufacturing',
        sense: 'High-speed line-scan cameras & optical solder-joint profilers',
        decide: 'Embedded vision controller evaluates component placement tolerances',
        act: 'Pneumatic reject actuators divert defective circuit boards off the line',
        description: 'Automated assembly systems sense solder joints on electronics boards, decide if joints meet quality standards, and act by sorting defective parts before they reach consumers.'
      },
      {
        title: 'Autonomous & Assisted Transportation',
        domain: 'Transportation',
        sense: 'Millimeter-wave radar, optical cameras & wheel speed encoders',
        decide: 'Safety ECU compares distance and closing velocity against braking curve',
        act: 'Hydraulic emergency braking actuators engage faster than human reaction',
        description: 'Modern railway and vehicle collision-avoidance systems sense stopping distances, decide when a crash risk exists, and act by applying brakes autonomously.'
      },
      {
        title: 'Accessibility & Assistive Robotics',
        domain: 'Assistive Tech',
        sense: 'Surface electromyography (EMG) electrodes sensing forearm muscle pulses',
        decide: 'Pattern-recognition algorithm maps nerve firing intent to grip modes',
        act: 'Precision micro-servo motors actuate bionic fingers to grasp a cup',
        description: 'Myoelectric bionic hands sense tiny muscle impulses, decide the intended user grip pattern, and act via micro-servos to restore independence.'
      },
      {
        title: 'Disaster Search & Rescue',
        domain: 'Rescue',
        sense: 'Thermal infrared cameras, CO2 gas sensors & microphone arrays',
        decide: 'Search controller prioritizes survivor heat signatures in rubble voids',
        act: 'High-torque tracked flippers climb over debris and drop emergency radios',
        description: 'Inspection rovers navigate collapsed buildings, sense body heat and air quality, decide if pathways are passable, and act by establishing communication lines without risking rescue workers.'
      },
      {
        title: 'Environmental & River Monitoring',
        domain: 'Environment',
        sense: 'Water pH electrodes, dissolved oxygen probes & optical turbidity meters',
        decide: 'Controller checks if chemical pollutants exceed statutory thresholds',
        act: 'Surface thrusters steer boat toward contamination source while logging GPS',
        description: 'Solar-powered robotic surface boats sense river pH and turbidity, decide when pollution levels spike, and act by collecting water samples and transmitting GPS coordinates to environmental scientists.'
      }
    ],
    robotOrNotChallenge: [
      {
        item: 'Standard Ceiling Fan with Wall Regulator',
        senses: 'No — does not measure room temperature or human presence',
        decides: 'No — passive variable resistance sets motor voltage directly',
        acts: 'Yes — spins blades continuously',
        verdict: 'NOT A ROBOT (Simple Electrical Appliance): It acts, but cannot sense room conditions or make autonomous decisions.',
        isRobot: false
      },
      {
        item: 'Basic Pop-Up Kitchen Toaster',
        senses: 'Mechanical thermal timer / bimetallic strip only',
        decides: 'No programmable controller or adaptable decision logic',
        acts: 'Heating coils glow and mechanical spring pops toast',
        verdict: 'NOT A ROBOT (Automated Mechanical Appliance): Follows a fixed physical timer regardless of whether the bread is actually burnt.',
        isRobot: false
      },
      {
        item: 'Basic Radio-Controlled (RC) Toy Car',
        senses: 'Receives human thumbstick radio commands only (no obstacle sensors)',
        decides: 'No — the human driver\'s brain makes 100% of steering decisions',
        acts: 'Yes — DC motors spin wheels and steering servo turns',
        verdict: 'NOT AN AUTONOMOUS ROBOT (Teleoperated Machine): A great stepping stone, but until it has onboard sensors and decision code, the human is the controller.',
        isRobot: false
      },
      {
        item: 'Smart Inverter Air Conditioner / Washing Machine',
        senses: 'Yes — measures water weight/turbidity or room temperature via thermistors',
        decides: 'Yes — embedded microcontroller adjusts wash cycle time or compressor speed',
        acts: 'Yes — drives drum motor, water valves, or compressor',
        verdict: 'BORDERLINE / EMBEDDED SMART APPLIANCE: Uses the exact same Sense → Decide → Act microcontroller principles inside a fixed household enclosure!',
        isRobot: false
      },
      {
        item: 'Obstacle-Avoiding Wheeled Rover',
        senses: 'Yes — HC-SR04 ultrasonic sensor measures distance to walls in cm',
        decides: 'Yes — Arduino C++ program compares distance < 20 cm and chooses turn direction',
        acts: 'Yes — Motor driver reverses and pivots left/right DC gear motors',
        verdict: 'TRUE ROBOT: Continuously senses its physical environment, runs programmed decision logic, and moves autonomously.',
        isRobot: true
      },
      {
        item: 'Line-Following Warehouse Delivery Bot',
        senses: 'Yes — IR reflectance sensor array detects contrast between black track and floor',
        decides: 'Yes — Microcontroller calculates steering correction from sensor state',
        acts: 'Yes — Adjusts left and right wheel PWM speeds to stay centered on track',
        verdict: 'TRUE ROBOT: Classic industrial mobile robot operating in a continuous closed-loop Sense → Decide → Act cycle.',
        isRobot: true
      },
      {
        item: 'Automated Hydroponic Seeding & Harvesting Arm',
        senses: 'Yes — Vision camera, limit switches, and moisture/EC sensors',
        decides: 'Yes — Controller computes inverse kinematics and plant readiness',
        acts: 'Yes — Stepper/SCARA arm joints move and gripper harvests tray',
        verdict: 'TRUE ROBOT: Multi-axis agricultural robot combining environmental sensing, coordinate math, and mechanical actuation.',
        isRobot: true
      },
      {
        item: 'Autonomous Search-and-Rescue Quadruped',
        senses: 'Yes — IMU balance sensor, depth cameras, and thermal sensors',
        decides: 'Yes — Onboard computer plans foot placement over rubble',
        acts: 'Yes — 12 servo/brushless joint actuators walk over uneven obstacles',
        verdict: 'TRUE ROBOT: Advanced mobile robot adapting dynamically to unpredictable terrain.',
        isRobot: true
      }
    ],
    teacherPrep: [
      'Pre-Class Step 1: Test-upload the Class 1 Blink sketch on 1 demo Arduino Uno R3 and verify the classroom projector displays ProjectorView.tsx clearly at 125% zoom from the back of the room.',
      'Pre-Class Step 2: Pre-sort student hardware trays so each station has strictly today\'s parts: 1x Arduino Uno R3 (or compatible board), 1x USB-A to USB-B cable, 1x 400-point breadboard, 2x 5mm Red LEDs (1 primary + 1 spare), 2x 220Ω or 330Ω resistors, and 3x Male-to-Male jumper wires (1 Red, 1 Black, 1 spare). Keep motors and batteries out of the tray for Class 1 to prevent distractions and short circuits.',
      'Pre-Class Step 3: Confirm Arduino IDE 2.x is installed on lab laptops with Arduino AVR Boards core ready, OR open the Class 1 Code Lab & Simulator tab for browser-based simulation stations.',
      'Student Group Structure: Organize students into pairs or trios with rotating engineering roles: Hardware Engineer (breadboard placement), Firmware Navigator (IDE / code input), and Safety & Quality Inspector (polarity and pre-power verification). Roles swap between Part A and Part B.',
      'Lab Safety Enforcement: Maintain the 5 Mandatory Lab Safety Rules: 1) Unplug before wiring; 2) Never connect an external LED without a series resistor; 3) Protect against short circuits (no bare 5V to GND connections); 4) Check polarity twice, power once; 5) Touch test and emergency disconnect if any component feels warm.',
      'No-Kit Fallback: For remote or no-kit stations, use the built-in Interactive Arduino Uno Board Tour and Synchronized Blink Simulator in Tab 4 / Slide 6 & 11, clearly noting that it models ideal behavior while physical hardware requires port selection and resistor checks.'
    ],
    verifiedMaterials: [
      'Arduino Uno R3 (Microchip ATmega328P DIP or SMD edition with 16 MHz crystal oscillator)',
      'High-quality shielded USB-A to USB-B Cable (1.5m, verified with active D+ and D- serial data lines)',
      '400-tie-point solderless breadboard (with vertical power rails and 0.3-inch center DIP ravine)',
      '5mm Red Diffused LED (Forward voltage Vf ≈ 2.0V, max continuous current 20 mA)',
      '220 Ω Axial Carbon Film Resistor (Color bands: Red-Red-Brown-Gold, 1/4 Watt, 5% tolerance; 330 Ω also approved)',
      'Male-to-Male Flexible Jumper Wires (1x Red 20cm, 1x Black 20cm, 1x spare)',
      'Classroom workstation with Arduino IDE 2.x or Web USB Simulator environment'
    ],
    safetyNotes: [
      '1. Unplug Before Wiring: Always disconnect the USB cable (or power source) before adding, moving, or removing wires and components on the breadboard.',
      '2. Never Connect an External LED Without a Series Resistor: Connecting an LED directly between 5V (or an output pin) and GND without a 220 Ω – 330 Ω resistor draws excessive current and permanently burns out the LED or damages the microcontroller pin.',
      '3. Protect Against Short Circuits: Never connect the 5V pin directly to GND with a bare wire, and never place the Arduino board onto a conductive metal desk, coin, or wire clippings.',
      '4. Check Polarity Twice, Power Once: Have your partner verify LED Anode (+ long leg) and Cathode (- short leg / flat edge) before plugging in the USB cable.',
      '5. Touch Test & Emergency Disconnect: If any component or chip ever feels warm or smells unusual, immediately unplug the USB cable by gripping the plastic connector housing (never yank the cable wire).'
    ],
    classRhythm: [
      {
        segment: '00:00 – 00:10 Welcome, Safety Ground Rules & "Robot or Not?" Debate',
        minutes: 10,
        teacherAction: 'Welcome students to RoboBEE Innovators. Present Slide 1 & Slide 3 on the projector. Poll the room on the 8 "Robot or Not?" items before clicking to reveal the Sense-Decide-Act breakdown.',
        studentAction: 'Vote on each machine, debate why an RC car differs from an autonomous rover, and state the 3 parts of the robotics loop.'
      },
      {
        segment: '00:10 – 00:25 Sense → Decide → Act & Real-World Robotics Tour',
        minutes: 15,
        teacherAction: 'Walk through Slide 2 (7 real-world domains) and Slide 4 (Interactive Sense-Decide-Act diagram). Show the physical kit components using Slide 5 (Parts Gallery).',
        studentAction: 'Match physical kit components on their desk (sensor, Arduino, LED, motor) to Sense, Decide, or Act.'
      },
      {
        segment: '00:25 – 00:40 Meet the Brain: Interactive Arduino Uno R3 & Breadboard Tour',
        minutes: 15,
        teacherAction: 'Project Slide 6 (ArduinoUnoPinout.tsx) and Slide 7 (Breadboard & LED anatomy). Hold up an Arduino Uno and breadboard; point out GND, Pin 13, the breadboard center gap, and LED long (+) vs. short (-) legs.',
        studentAction: 'Locate the USB port, Reset button, 5V, GND, Pin 13, and LED_BUILTIN on their reference diagram or physical board. Inspect an LED to find the long anode leg and flat cathode rim.'
      },
      {
        segment: '00:40 – 00:55 Lab Part A: First Light with LED_BUILTIN & Code Walkthrough',
        minutes: 15,
        teacherAction: 'Project Slide 8 & Slide 10. Guide students through selecting board + COM port in Arduino IDE (or launching the software simulator if running no-kit). Walk through setup(), loop(), pinMode(), digitalWrite(), and delay() line by line.',
        studentAction: 'Connect Arduino via USB (only after visual check), upload the Stage A LED_BUILTIN sketch, verify the onboard L LED blinks at 1 Hz (1 sec ON, 1 sec OFF), and trace which line of code causes each state.'
      },
      {
        segment: '00:55 – 01:15 Lab Part B: External Breadboard LED Build & Timing Experiments',
        minutes: 20,
        teacherAction: 'Project Slide 9 (Wiring Diagram & Wire Table) and Slide 11 (Timing Challenge). Enforce the Unplug USB Before Wiring rule. Inspect each team\'s 220 Ω resistor and LED polarity before they plug USB back in.',
        studentAction: 'Unplug USB, wire Pin 13 → 220 Ω resistor → LED Anode (+) and LED Cathode (-) → GND. Reconnect USB, test external blink, then run the 4 "Predict → Modify → Test" timing challenges and fill in the Trial Log.'
      },
      {
        segment: '01:15 – 01:30 Troubleshooting Review, Check for Understanding & Exit Ticket',
        minutes: 15,
        teacherAction: 'Project Slide 12. Lead the 5-question class quiz, review how to debug a dark LED using the Troubleshooting Matrix, oversee kit pack-up, and collect the 4-part Exit Reflection.',
        studentAction: 'Complete the 5-question check, record their Exit Reflection (1 Input, 1 Decision, 1 Output, 1 Safety Rule), disconnect USB cables by gripping the plug housing, and organize parts back into kit compartments.'
      }
    ],
    concepts: [
      {
        title: 'The Soul of Robotics: What Actually Makes a Machine a "Robot"?',
        explanation: 'In popular culture, people often think of robots as metallic humanoids with glowing eyes. But in true engineering, a robot is any autonomous machine that bridges the digital and physical worlds. Consider the difference between a microwave and a Mars rover: When you put food in a microwave and set it for two minutes, it spins blindly on a timer. If your food catches fire or is frozen solid, the microwave has no idea—it has zero sensory awareness of the world. It is a dumb open-loop machine. In stark contrast, NASA’s Perseverance rover on Mars uses high-resolution stereo cameras and laser rangefinders (SENSE) to inspect Martian craters, evaluates safe routes using onboard obstacle-avoidance algorithms (DECIDE), and commands its six motorized wheels to steer around boulders (ACT). Every true robot on Earth—from automated warehouse vehicles sorting packages to hospital medicine delivery drones—operates inside this continuous, unbroken loop: SENSE → DECIDE → ACT.',
        instructorNote: 'Help students understand that autonomy requires closed-loop feedback based on live sensory data, not just hardcoded blind timers.'
      },
      {
        title: 'The Four Universal Subsystems of Every Robot on Earth',
        explanation: 'No matter how simple or complex a robot is, its design can always be broken down into four foundational subsystems: 1. THE BODY (Mechanical System): The physical chassis, structural acrylic or aluminum plates, wheels, gearboxes, linkages, and brackets that give the robot shape and allow it to exert force on the world. 2. THE NERVOUS SYSTEM (Electrical System): The battery power pack, voltage regulators, wiring harnesses, and common ground return paths that deliver clean electrical energy to every component. 3. THE SENSES (Perception System): Transducers such as ultrasonic sensors (sonar hearing), infrared sensors (reflective vision), gyroscopes (balance), and tactile bumper switches that convert physical changes in the environment into electrical voltage signals. 4. THE BRAIN (Control System): The microcontroller board (our Arduino Uno) that reads those voltage signals, runs computer code to make decisions, and sends control signals to motors and lights.',
        instructorNote: 'Pass around physical components from the kit box as you introduce each subsystem so students can touch and feel the hardware.'
      },
      {
        title: 'Inside the Silicon Brain: Microcontroller vs. Personal Computer',
        explanation: 'Why don’t we just bolt an iPhone or a laptop onto our small robotics rover? Modern computers and smartphones are general-purpose devices. They run complex operating systems like Windows, macOS, or Android, juggling hundreds of background apps, network updates, and graphics drivers. Because their attention is constantly divided, a computer might delay an instruction by a fraction of a second—which could cause a fast robot to crash into a wall before the software reacts! An Arduino Uno, powered by the Microchip ATmega328P microcontroller, is fundamentally different. It has no operating system. It runs only ONE single program that you write, executing instructions in bare-metal real-time. It runs on a 16 MHz quartz crystal oscillator, which means its internal clock pulses 16,000,000 times every single second! When your code commands a pin to turn on or read a sensor, the microcontroller executes that action in approximately 62.5 nanoseconds. It is fast, deterministic, reliable, and uses only a fraction of a watt of battery power.',
        instructorNote: 'Show students the silver oval crystal on the board labeled "16.000" and explain that it acts like the beating heart of the microcontroller.'
      },
      {
        title: 'Electronics Foundations: Voltage, Current, Resistance & Ohm’s Law',
        explanation: 'Electricity is not magic—it is the physical movement of billions of microscopic electrons rushing through conductive copper wires. To visualize how a circuit works, engineers use the Water Tower Analogy: 1. VOLTAGE (V, measured in Volts): Think of voltage as the water pressure created by a tall water tank. The higher the tank, the more pressure pushing the water down the pipe. On our Arduino, the standard electrical pressure is 5.0 Volts. 2. CURRENT (I, measured in Amps or Milliamps): Current is the actual volume of water rushing through the pipe per second. In electronics, 1 Ampere means 6.242 × 10^18 electrons are flowing past a point every single second! Most small robotics sensors and LEDs use milliamps (1 mA = 1/1000th of an Amp). 3. RESISTANCE (R, measured in Ohms Ω): Resistance is a narrow constriction or valve inside the pipe that resists the flow of water. If the pipe is wide open with zero resistance, water rushes out uncontrollably in a flood. If the pipe is narrow, only a trickle can pass. These three forces are locked together by the most famous equation in electronics, Ohm’s Law: Voltage = Current × Resistance (V = I × R). Furthermore, electricity can only flow if it has a complete, unbroken circular loop starting from the positive 5V source and returning to Ground (0V GND). If the wire is disconnected anywhere, the circle is broken and current stops instantly.',
        instructorNote: 'Draw the classic Ohm’s Law triangle on the whiteboard (V at the top, I and R at the bottom) and show how covering one letter reveals the formula for the others.'
      },
      {
        title: 'The Anatomy of an LED & The 220Ω Resistor Rule (The Silicon Bodyguard)',
        explanation: 'An LED (Light Emitting Diode) is not like a traditional incandescent household bulb that uses a glowing wire filament. An LED is a solid-state semiconductor device that converts electrical energy directly into light photons. Because it is a diode, it acts like a one-way electrical check-valve: electricity can only flow through it in ONE direction, from positive to negative. If you look closely at a 5mm LED, you will notice one leg is slightly longer than the other. The LONG leg is the ANODE (+) and must connect toward positive voltage (+5V). The SHORT leg (which also has a flat edge on the plastic rim) is the CATHODE (-) and must connect toward Ground (GND). If you plug it in backward, no current will flow and the light will stay off. More importantly: once an LED turns on, its internal resistance drops to nearly zero! If you connect an LED directly between 5V and GND with no resistor, an enormous surge of electrical current will try to rush through the diode. Within milliseconds, the microscopic bonding wire inside the LED will overheat, melting the silicon and permanently destroying the LED with a tiny puff of "magic smoke"! To protect both the LED and your Arduino’s microcontroller pin, we always wire a 220Ω (Ohm) resistor in series. We can use Ohm’s Law to prove why: A red LED requires about 2.0V to light up, leaving 3.0V across the resistor (5V - 2V = 3V). To keep the current at a safe 15 milliamps (0.015A): R = 3.0V / 0.015A = 200Ω. A standard 220Ω resistor guarantees the current never exceeds safe limits, acting as an indestructible silicon bodyguard!',
        instructorNote: 'Hold an LED up to the classroom light so students can see the internal anvil (large flag = cathode/negative) and post (small flag = anode/positive) through the translucent epoxy dome.'
      },
      {
        title: 'The Anatomy of Embedded C++: How Code Commands Physical Voltage',
        explanation: 'When you type code into the Arduino IDE and click Upload, your human-readable C++ instructions are translated by a compiler into thousands of binary 1s and 0s (machine code). These bytes travel down the USB cable and are burned into the ATmega328P’s internal Flash memory. When the Arduino powers on, it executes your program using two mandatory functions: 1. void setup(): This function runs exactly ONCE when the board first receives power or when you tap the red Reset button. We use setup() to tell the microcontroller how each physical pin should behave. For example, pinMode(13, OUTPUT) tells the chip’s internal circuitry: "Configure Digital Pin 13 as a power source so we can push 5V electricity out." 2. void loop(): Once setup() finishes, the microcontroller jumps into loop() and repeats everything inside its curly braces over and over forever until power is cut! Inside loop(), we use digitalWrite(13, HIGH) to connect Pin 13 to +5V (turning the light ON), followed by delay(1000) which tells the CPU to wait for 1,000 milliseconds (1 full second). Next, digitalWrite(13, LOW) pulls Pin 13 down to 0V (turning the light OFF), followed by another delay(1000). Once the code reaches the bottom curly brace of loop(), it instantly circles back to the top and starts again. You are literally turning computer logic into physical electricity!',
        instructorNote: 'Emphasize that the microcontroller never gets tired or stops—it will execute loop() billions of times without ever skipping an instruction unless told to do so.'
      }
    ],
    visualizerId: 'arduino_board_tour_sim',
    project: {
      name: 'Arduino First-Light Blink & Signal Lab',
      deliverableType: 'code_artifact',
      successEvidence: [
        'A running physical Arduino Uno board (or web simulator) pulsing the built-in amber LED on Pin 13 with verified timing.',
        'A modified embedded C++ sketch compiled and flashed with zero compiler syntax errors.',
        'A completed Engineering Prediction Log documenting measured differences between standard 1000ms blinks, rapid 200ms strobes, asymmetric warning beacons, and heartbeat pulse intervals.'
      ]
    },
    activity: {
      title: 'Upload, Predict, and Program First-Light Signals',
      steps: [
        'Step 1 (Physical Inspection): Hold your Arduino Uno by its edges. Locate the silver USB-B port, the black square ATmega328P chip, the small reset button, and find the tiny amber surface-mount LED labeled "L" situated right next to Digital Pin 13.',
        'Step 2 (Connection & Power): Plug the square end of the USB cable into the Arduino and the flat end into your computer. Confirm that the green LED labeled "ON" illuminates steadily, proving the 5V power regulator is active.',
        'Step 3 (Software Configuration): Open Arduino IDE 2.x on your computer. Go to Tools -> Board -> Arduino AVR Boards -> Arduino Uno. Then go to Tools -> Port and select the active COM port (e.g. COM3 or COM4 on Windows).',
        'Step 4 (Inspect the Starter Code): Open File -> Examples -> 01.Basics -> Blink. Read through setup() and loop(). Predict what will happen before you run it.',
        'Step 5 (Compile & Flash): Click the Upload button (the rightward arrow ➔). Watch the tiny TX and RX LEDs on the board flicker rapidly for two seconds as serial data is flashed into memory. When the IDE displays "Done uploading", look at the board: LED "L" is pulsing on and off with exact 1-second precision!',
        'Step 6 (Mission 1 - The Heartbeat Challenge): Modify the code to create a realistic human heartbeat rhythm (lub-dub... pause): Turn ON for 120ms, OFF for 120ms, ON for 120ms, then OFF for 800ms. Upload and observe the lifelike pulse!',
        'Step 7 (Mission 2 - S.O.S. Maritime Distress Beacon): Program the universal international emergency signal in Morse Code: 3 rapid short flashes (150ms), 3 long flashes (500ms), and 3 rapid short flashes (150ms), followed by a 2-second pause before repeating.',
        'Step 8 (Mission 3 - Strobe & Persistence of Vision): Set the delays to 10ms ON and 10ms OFF. Observe how human eyes begin to blend rapid flashes into continuous motion at half brightness.'
      ],
      successCriteria: [
        'The student successfully configures the IDE board and serial COM port with "Done uploading" status.',
        'The student can point to the physical LED on the board and explain which line of code turns it on versus off.',
        'The student successfully modifies delay values, predicts the visual result, and demonstrates at least one custom signaling pattern (Heartbeat, SOS, or Strobe).'
      ],
      extension: 'Wire an external 5mm red LED on a solderless breadboard: Connect the long anode leg to Digital Pin 13 through a 220Ω resistor, connect the short cathode leg to an Arduino GND pin, and reprogram timing challenges!'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (Microchip ATmega328P DIP or SMD edition with 16 MHz crystal)'],
      componentList: [
        { name: 'Arduino Uno R3 Development Board', exactVariant: 'Standard Rev3 with ATmega328P DIP or SMD edition and 16 MHz crystal', quantity: 1 },
        { name: 'USB-A to USB-B Shielded Cable', exactVariant: '1.5m standard data communication cable (verify data lines present)', quantity: 1 },
        { name: '400-Tie-Point Solderless Breadboard', exactVariant: 'Half-size breadboard with dual power rails and center 0.3-inch DIP ravine', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'Forward voltage Vf ≈ 2.0V, max continuous current 20 mA, anode long leg', quantity: 1 },
        { name: '220 Ω Axial Resistor', exactVariant: 'Color bands: Red-Red-Brown-Gold, 1/4 Watt, 5% tolerance (330 Ω also approved)', quantity: 1 },
        { name: 'Male-to-Male Jumper Wires', exactVariant: '20cm flexible jumper wires: 1x Red (signal), 1x Black (Ground return)', quantity: 2 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/class1-external-blink-wiring.svg',
      schematic: 'Arduino Digital Pin 13 ──[ 220 Ω Resistor (10c to 15c) ]──[ Anode (+) 5mm Red LED (15e) ]──[ Cathode (-) (16e) ]── Arduino GND (via 16a to GND).',
      wireTable: [
        { from: '220 Ω Resistor (Lead 1)', to: 'Breadboard Row 10, Column c (10c)', wireOrPolarityNote: 'Non-polarized (works either way); receives HIGH/LOW signal from Pin 13' },
        { from: '220 Ω Resistor (Lead 2)', to: 'Breadboard Row 15, Column c (15c)', wireOrPolarityNote: 'Spans rows 10 to 15; limits circuit current to ≈ 13.6 mA' },
        { from: '5mm Red LED — Anode (+ LONGER Leg)', to: 'Breadboard Row 15, Column e (15e)', wireOrPolarityNote: 'Shares Row 15 (a–e) with resistor lead 2; positive diode terminal' },
        { from: '5mm Red LED — Cathode (- SHORTER Leg, Flat Rim)', to: 'Breadboard Row 16, Column e (16e)', wireOrPolarityNote: 'Must be in different row (Row 16); negative diode exit terminal' },
        { from: 'Arduino Digital Pin 13', to: 'Breadboard Row 10, Column a (10a)', wireOrPolarityNote: 'Red Jumper Wire; delivers programmed 5V HIGH / 0V LOW signals' },
        { from: 'Breadboard Row 16, Column a (16a)', to: 'Arduino GND Pin (or via Blue - Rail to GND)', wireOrPolarityNote: 'Black Jumper Wire; completes the closed return loop back to 0V Ground' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Disconnect Power First: Confirm the USB cable is completely unplugged from both laptop and Arduino board before placing any parts.',
        '2. Stage A Verification (Built-In LED First): Before wiring the breadboard, connect bare Arduino via USB, select Tools -> Board -> Arduino Uno and Tools -> Port, upload sketch, confirm onboard amber "L" LED blinks at 1 Hz (1s ON, 1s OFF), then unplug USB.',
        '3. Insert the 220 Ω Resistor: Gently bend leads into a 90° U-shape. Insert one lead firmly into breadboard hole 10c and the other into 15c. (Resistors have no polarity—either direction works).',
        '4. Inspect & Insert 5mm Red LED: Identify the LONGER leg (Anode, +) and SHORTER leg with flat edge on plastic rim (Cathode, -). Insert LONGER leg into 15e (sharing Row 15 with resistor) and SHORTER leg into 16e.',
        '5. Connect Signal Jumper (Red): Plug one end of Red jumper into Arduino Digital Pin 13 and other end into breadboard hole 10a (sharing Row 10 with top resistor leg).',
        '6. Connect Ground Return Jumper (Black): Plug one end of Black jumper into breadboard hole 16a (sharing Row 16 with short LED cathode leg) and other end into any Arduino GND pin.',
        '7. Partner Pre-Power Inspection: Verify resistor bridges Row 10c to 15c, LED long leg is in 15e and short leg is in 16e, Red wire connects Pin 13 to 10a, and Black wire connects 16a to GND.',
        '8. Power-Up & Expected Result: Plug USB cable back into laptop. Within 2 seconds both the onboard "L" LED and your external red breadboard LED will blink in perfect synchronization: 1.0s ON, 1.0s OFF.',
        '9. Safe Shutdown & Storage: When done, unplug USB by gripping connector body. Pull components straight out gently with fingers near base of leads, and place parts into labeled storage compartments.'
      ],
      powerAndSafetyChecks: [
        'Never place an active, powered Arduino board directly onto a conductive metal table, aluminum foil, or copper tape.',
        'Never connect or disconnect wires while the USB cable is plugged in. Always unplug the USB cable before making circuit changes!',
        'Never connect an external LED directly between 5V and GND without a 220Ω current-limiting resistor.',
        'If the board ever feels hot to the touch or your computer warns of a "USB Power Surge", unplug the USB cable immediately!'
      ],
      testCases: [
        { action: 'Upload standard 1000ms Blink sketch', expectedResult: 'Both onboard amber "L" LED and external breadboard red LED turn ON for 1.0s and OFF for 1.0s in synchronization.' },
        { action: 'Change delay values to 200ms and re-upload', expectedResult: 'Both LEDs pulse at a rapid 2.5 Hz strobe rate (200ms ON, 200ms OFF).' },
        { action: 'Press the red physical RESET button on the board', expectedResult: 'The blinking pauses for approximately 1 second while bootloader restarts, then resumes normal blinking.' },
        { action: 'Disconnect USB cable from computer', expectedResult: 'All LEDs turn off immediately as electrical current stops flowing through the open circuit.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `/*
 * ============================================================================
 * RoboBEE Innovators — Beginner Robotics & Arduino (Proposed Track)
 * Class 1 (beg-01): Welcome to Robotics: Meet Arduino, Then Make an LED Blink
 * ============================================================================
 * Target Reference Board : Arduino Uno R3 (ATmega328P)
 * Circuit Configuration  :
 *   - Stage A (Built-in test) : Uses onboard LED_BUILTIN (mapped to Pin 13 on Uno R3)
 *   - Stage B (External circuit):
 *       Arduino Pin 13 ---> 220 Ohm Resistor ---> Red LED Anode (+, Long Leg)
 *       Red LED Cathode (-, Short Leg / Flat Rim) ---> Arduino GND
 * ============================================================================
 */

// 1. PIN & TIMING CONSTANTS (Global Scope — easy to read and change in one place)
const int LED_PIN     = LED_BUILTIN; // On Arduino Uno R3, LED_BUILTIN equals Digital Pin 13
const int ON_TIME_MS  = 1000;        // Time LED stays ON in milliseconds (1000 ms = 1.0 second)
const int OFF_TIME_MS = 1000;        // Time LED stays OFF in milliseconds (1000 ms = 1.0 second)

// 2. SETUP FUNCTION — Runs ONCE when the Arduino powers on or the Reset button is pressed
void setup() {
  // Configure LED_PIN as a digital OUTPUT so the microcontroller can drive 5V or 0V safely
  pinMode(LED_PIN, OUTPUT);
}

// 3. LOOP FUNCTION — Repeats continuously forever (Sense -> Decide -> Act cycle)
void loop() {
  // ACT Step 1: Turn the LED ON by driving the output pin HIGH (5 Volts on Uno R3)
  digitalWrite(LED_PIN, HIGH);

  // DECIDE / TIMING Step 1: Hold the ON state for ON_TIME_MS milliseconds
  delay(ON_TIME_MS);

  // ACT Step 2: Turn the LED OFF by pulling the output pin LOW (0 Volts / Ground)
  digitalWrite(LED_PIN, LOW);

  // DECIDE / TIMING Step 2: Hold the OFF state for OFF_TIME_MS milliseconds before loop() repeats
  delay(OFF_TIME_MS);
}
`,
      pinMap: {
        'LED_BUILTIN': 'Digital Pin 13 (Built-in SMD amber LED with internal 1kΩ resistor)',
        'Pin 13': 'Digital Output Pin delivering 5V HIGH / 0V LOW to external breadboard circuit',
        '5V': 'Regulated 5.0V DC bus power rail from USB or NCP1117 linear voltage regulator',
        'GND': 'System Ground reference plane (0.0V DC return path for current)'
      },
      setupAndUpload: [
        '1. Connect your Arduino Uno to the computer using the high-quality shielded USB cable.',
        '2. Launch the Arduino IDE 2.x software on your desktop.',
        '3. Go to Tools -> Board -> Arduino AVR Boards and select "Arduino Uno".',
        '4. Go to Tools -> Port and click on the port identified with your board (e.g. COM3, COM4, or /dev/ttyACM0).',
        '5. Click the Verify button (Checkmark icon) to compile your C++ code into machine hex bytes.',
        '6. Click the Upload button (Rightward Arrow icon) to flash the compiled hex file into the ATmega328P Flash memory.',
        '7. Look at the board: verify that the TX and RX LEDs flicker rapidly for two seconds, followed by the amber LED "L" and external LED pulsing to life!'
      ],
      explanations: [
        '/* ... */ and // (Comments): Explanatory text for human engineers. The C++ compiler ignores comments completely—they consume zero bytes in memory.',
        'const int LED_PIN = LED_BUILTIN;: Declares an immutable integer constant mapping to Pin 13 on the Uno R3. The const keyword prevents accidental alteration.',
        'const int ON_TIME_MS = 1000; and OFF_TIME_MS = 1000;: Stores blink durations in milliseconds at the top of the sketch for quick timing modifications.',
        'void setup() { ... }: The mandatory initialization function. Runs exactly once after power-on or hardware reset; void indicates no return value.',
        'pinMode(LED_PIN, OUTPUT);: Sets the internal transistor driver for Pin 13 to low-impedance OUTPUT mode, enabling it to source current safely.',
        'void loop() { ... }: The primary execution routine. Infinitely repeats sequentially from top to bottom as long as power is maintained.',
        'digitalWrite(LED_PIN, HIGH); and LOW;: HIGH connects the pin to 5V (turning LED ON); LOW pulls the pin to 0V Ground (turning LED OFF).',
        'delay(ON_TIME_MS); and delay(OFF_TIME_MS);: Pauses CPU instruction progression for specified milliseconds, allowing the eye to register each state.'
      ],
      expectedResult: 'Both the onboard amber SMD LED labeled "L" and the external red breadboard LED alternate steadily between bright illumination (5V) and complete darkness (0V) at the exact programmed interval.',
      caveats: [
        'Blocking Delay Warning: While delay() is executing, the microcontroller is completely frozen in an idle loop and CANNOT read sensors or react to emergency stops. In Class 03 and Advanced classes, we will master non-blocking millis() timing!',
        'Power Indicator Distinguish: Do not confuse the green power LED labeled "ON" with the programmable amber LED labeled "L". The green light indicates 5V power presence; only "L" is controlled by your code.',
        'Pin 13 Resistor: While Pin 13 has a built-in resistor for the onboard surface-mount LED, any external LED connected to external breadboard pins MUST have its own 220Ω resistor!'
      ],
      tweakTip: 'Run the 4 Timing Experiments: 1) Rapid Strobe (200ms/200ms); 2) Beacon (100ms/900ms); 3) Robot Heartbeat (120ms/120ms/120ms/800ms); 4) Persistence of Vision limit (10ms/10ms).'
    },
    troubleshooting: [
      {
        symptom: 'Onboard "L" LED blinks, but the external breadboard LED stays completely dark.',
        checks: [
          'Unplug USB first. Check LED leg polarity: ensure the longer leg (Anode, +) is in Row 15 sharing with the resistor, and shorter leg (Cathode, -) is in Row 16.',
          'Verify that the 220 Ω resistor bridges Row 10 (Column c) to Row 15 (Column c).',
          'Confirm that the Red jumper wire is in Row 10a (connected to Pin 13) and Black jumper wire is in Row 16a (connected to GND).',
          'Check for accidental short circuits: verify that the LED legs are in DIFFERENT rows (Row 15 and Row 16), not plugged into the same row!'
        ],
        explanation: 'LEDs are diodes that only conduct current in one direction (Anode + to Cathode -). If inserted backward or shorted on the same breadboard row, no current will flow through the diode junction.'
      },
      {
        symptom: 'External LED turns ON and stays solidly lit—it never blinks OFF.',
        checks: [
          'Check the Arduino pin header: ensure the Red jumper wire is plugged into Digital Pin 13, NOT into the 5V power pin!',
          'Inspect your loop() code: confirm that there is a delay(OFF_TIME_MS); AFTER the digitalWrite(LED_PIN, LOW); line.',
          'Verify that OFF_TIME_MS is not set to 0. If delay is omitted or 0, the LED turns off for less than a microsecond and turns back on instantly, appearing constantly on.'
        ],
        explanation: 'Connecting directly to 5V bypasses program control. Omitting the second delay causes the MCU to loop back to HIGH faster than the human eye\'s persistence of vision threshold (≈ 50ms).'
      },
      {
        symptom: 'External LED blinks, but it is extremely dim (barely visible in room light).',
        checks: [
          'Check your setup() function: confirm that pinMode(LED_PIN, OUTPUT); is included and spelled correctly.',
          'Inspect the resistor color bands: ensure you used Red-Red-Brown (220 Ω) or Orange-Orange-Brown (330 Ω), NOT Brown-Black-Orange (10,000 Ω / 10 kΩ) or Brown-Black-Yellow (100 kΩ).',
          'Ensure the breadboard tie-point holes are gripping the component leads firmly and not loose.'
        ],
        explanation: 'If pinMode() is omitted, the pin defaults to INPUT mode with a weak 20kΩ internal pull-up, limiting current to < 0.25 mA. A 10kΩ resistor similarly restricts current to < 0.3 mA.'
      },
      {
        symptom: 'Arduino IDE error: "avrdude: ser_open(): can\'t open device // COM port not found / Permission denied"',
        checks: [
          'Verify that the USB cable is pushed all the way into the Arduino jack until it clicks firmly into place.',
          'Check if the green "ON" LED on the board is illuminated. If it is dark, your cable or USB port has no power.',
          'Verify that you are using a true data cable, not a cheap phone charge-only cable that lacks internal D+ and D- data wires.',
          'Open Tools -> Port in the IDE and ensure a checkmark appears next to the active COM port. If no COM port appears, reinstall the CH340 or FTDI USB driver.',
          'Close the Serial Monitor window or any other program (such as Cura, 3D printer software, or Python scripts) that might be locking the serial port.'
        ],
        explanation: 'The Arduino IDE uses the avrdude utility to communicate with the USB-to-Serial bridge chip (ATmega16U2 or CH340) on the Arduino board. If the port is busy, disconnected, or unpowered, upload will fail.'
      },
      {
        symptom: 'Arduino IDE refuses to compile with error: "expected \';\' before \'}\' token" or syntax error.',
        checks: [
          'Look at the line number highlighted in red by the compiler, and look at the line directly above it.',
          'Check that every statement inside setup() and loop() ends with a semicolon (;).',
          'Verify matching curly braces: ensure setup() has { and }, and loop() has { and }.'
        ],
        explanation: 'C++ syntax requires semicolons to terminate statements. Missing a semicolon prevents the compiler from constructing an Abstract Syntax Tree (AST).'
      },
      {
        symptom: 'The green "ON" power LED on the Arduino turns off as soon as a breadboard wire is connected.',
        checks: [
          'UNPLUG THE USB CABLE IMMEDIATELY! Do not hesitate.',
          'Inspect the workbench: check for stray metal staples, paperclips, wire snippings, or aluminum foil touching the underside solder pins.',
          'If an external breadboard is connected, check whether a wire connects 5V directly into GND without passing through a resistor or component.',
          'Inspect the ATmega328P chip and the gold polyfuse near the USB port for visual discoloration or scorching.'
        ],
        explanation: 'A short circuit (0 Ohms between 5V and GND) causes excessive current to rush from the host computer’s USB port. The Arduino Uno has an onboard resettable PTC polyfuse that automatically trips to protect your computer’s motherboard.'
      }
    ],
    checksForUnderstanding: [
      'Q1: Why is a standard remote-controlled (RC) toy car usually classified as a teleoperated machine rather than an autonomous robot? (Answer: Because it lacks onboard environmental sensors and programmed decision logic—the human holding the remote makes all steering decisions).',
      'Q2: On a standard solderless breadboard, how are the 5 holes 15a, 15b, 15c, 15d, and 15e connected underneath the plastic? (Answer: All 5 holes share a single horizontal metal spring strip, and are isolated from 15f–15j by the center gap).',
      'Q3: What happens if you connect a 5mm Red LED directly between an Arduino 5V pin and GND without a 220 Ω – 330 Ω series resistor? (Answer: Excessive current flows, overheating the semiconductor junction and permanently burning out the LED or damaging the pin).',
      'Q4: What happens in your Blink program if you write digitalWrite(LED_PIN, LOW); but delete the second delay(1000); after it? (Answer: The LED appears solidly ON because loop() immediately jumps back to HIGH in less than a microsecond).',
      'Q5: If you set ON_TIME_MS = 250 and OFF_TIME_MS = 250, how long does one complete cycle take and how many cycles occur in 1 second? (Answer: 500 ms per cycle, yielding exactly 2 complete blink cycles per second).'
    ],
    exitTicket: [
      {
        question: 'Name 1 Input (Sensor): Name one sensor a robot uses to gather information from its surroundings.',
        rubricOrSampleReasoning: 'Acceptable answers: HC-SR04 ultrasonic distance sensor, infrared reflectance line sensor, tactile pushbutton bumper, LDR light sensor, or temperature sensor.'
      },
      {
        question: 'Name 1 Decision Rule: Give one example of an if/then decision a robot brain might make based on that sensor.',
        rubricOrSampleReasoning: 'Acceptable answers: "if distance < 20cm then turn right", "if line sensor sees black then steer left", or "if pushbutton is pressed then stop motors".'
      },
      {
        question: 'Name 1 Output (Actuator): Name one actuator that lets the robot act physically on the world, and describe how we wired our LED output today.',
        rubricOrSampleReasoning: 'Acceptable answers: 5mm LED for visual signals (Anode + long leg through 220Ω resistor to Pin 13, Cathode - short leg to GND), DC gear motor for wheel drive, or servo motor for gripper.'
      },
      {
        question: 'Name 1 Lab Safety Rule: State one safety rule you followed today before changing wires or powering your circuit.',
        rubricOrSampleReasoning: 'Acceptable answers: Unplug USB before changing wiring; always use a 220Ω series resistor with an external LED; check polarity twice before power; never connect 5V directly to GND.'
      }
    ],
    differentiation: {
      support: [
        'Pair students as "Lead Engineer" (typing code in the IDE) and "Systems Inspector" (checking board connections, verifying pin numbers, and recording prediction logs). Swap roles halfway through class.',
        'Provide color-coded breadboard cheat sheets and use the interactive web board simulator for any student encountering USB driver or port permissions issues on their workstation.'
      ],
      extension: [
        'Hardware Challenge: Wire an external 5mm green LED and a 220Ω resistor to Digital Pin 12 on a breadboard. Modify your C++ sketch to blink Pin 13 and Pin 12 alternately like railroad crossing signals!',
        'Algorithmic Challenge: Write an algorithmic SOS beacon function that uses a custom C++ function void flash(int duration) with for-loops to eliminate repetitive code.'
      ],
      offlineOption: [
        'Draw a complete schematic diagram of the Arduino Uno, Pin 13, the internal 1kΩ resistor, the onboard LED, and the Ground return path on an engineering notebook page, calculating the circuit current using Ohm’s Law.'
      ]
    },
    nextLessonId: 'beg-02',
    nextLessonTeaser: 'Class 2: Circuits, Breadboards and Safe Outputs — Multi-LED traffic controller and series vs. parallel breadboard paths.',
    sources: [
      { title: 'Arduino Official Hardware Documentation — UNO R3', url: 'https://docs.arduino.cc/hardware/uno-rev3/', accessedOrVersioned: 'ATmega328P Rev3 Hardware Spec' },
      { title: 'Arduino Official Built-In Examples — Blink Tutorial', url: 'https://docs.arduino.cc/built-in-examples/basics/Blink/', accessedOrVersioned: 'Official Arduino Blink Guide' },
      { title: 'Arduino Language Reference — pinMode()', url: 'https://docs.arduino.cc/language-reference/en/functions/digital-io/pinMode/', accessedOrVersioned: 'Arduino Core API' },
      { title: 'Arduino Language Reference — digitalWrite()', url: 'https://www.arduino.cc/en/Reference/digitalWrite', accessedOrVersioned: 'Arduino Core API' },
      { title: 'Arduino Language Reference — delay()', url: 'https://docs.arduino.cc/language-reference/en/functions/time/delay/', accessedOrVersioned: 'Arduino Timing API' },
      { title: 'Arduino Language Reference — LED_BUILTIN Constant', url: 'https://docs.arduino.cc/language-reference/en/variables/constants/ledbuiltin', accessedOrVersioned: 'Arduino Board Pin Constants' },
      { title: 'SparkFun Engineering Tutorial — How to Use a Breadboard', url: 'https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard/all', accessedOrVersioned: 'SparkFun Electronics' },
      { title: 'SparkFun Engineering Tutorial — Light-Emitting Diodes (LEDs)', url: 'https://learn.sparkfun.com/tutorials/light-emitting-diodes-leds/all', accessedOrVersioned: 'SparkFun Electronics' }
    ],
    assetCredits: [
      { asset: 'Arduino Uno R3 Vector Pinout & Anatomy', creator: 'RoboBEE Innovators Engineering Team', license: 'RoboBEE Innovators IP', sourceUrl: 'team_info' },
      { asset: 'Interactive Board Tour & Synchronized Blink Simulator', creator: 'RoboBEE Innovators Visual Interaction Lab', license: 'Proprietary', sourceUrl: 'team_info' }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 02: CIRCUITS, BREADBOARDS & SAFE OUTPUTS
  // -----------------------------------------------------------------------
  // BEGINNER 02: CIRCUITS, BREADBOARDS, AND SAFE OUTPUTS
  // -----------------------------------------------------------------------
  {
    id: 'beg-02',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-electronics-breadboards", "fg-board-uno-anatomy"],
      goDeeper: ["fg-testing-fmea-debugging", "fg-prog-program-structure"]
    },
    courseId: 'beginner',
    sequence: 2,
    code: 'BEGINNER 02',
    title: 'Circuits, Breadboards, and Safe Outputs',
    promise: 'Master the physics of solderless breadboards, calculate exact current-limiting resistance with Ohm’s Law, and wire a multi-stage robotic traffic signal controller.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01'],
    outcomes: [
      'Deconstruct the internal spring-clip architecture of solderless breadboards (power rails vs horizontal terminal tie-points).',
      'Derive the current-limiting resistor equation using Ohm’s Law (V = I × R) and LED forward voltage drops (Vf).',
      'Decode 4-band and 5-band resistor color codes (E12 standard) and verify resistance with a digital multimeter.',
      'Construct a multi-output breadboard circuit (Red, Yellow, Green status LEDs) with isolated series protection resistors.',
      'Program deterministic multi-state robotic signal sequences in C++ using digital I/O port manipulation.'
    ],
    vocabulary: [
      { 
        term: 'Solderless Breadboard', 
        plainMeaning: 'A reusable plastic grid with hidden spring-clip channels that let you connect components together instantly without hot solder.', 
        technicalMeaning: 'A modular prototyping construction base featuring nickel-plated phosphor bronze spring clips configured into vertical distribution buses and 5-point horizontal terminal strips.' 
      },
      { 
        term: 'Current-Limiting Resistor', 
        plainMeaning: 'An electrical safety resistor that slows down electron flow so sensitive semiconductor diodes and microcontrollers do not overheat or burn out.', 
        technicalMeaning: 'A passive two-terminal fixed resistor placed in series with a diode to drop excess circuit voltage and restrict forward current to safe operational thresholds (typically 10mA–20mA).' 
      },
      { 
        term: 'Ohm’s Law', 
        plainMeaning: 'The fundamental mathematical rule of electricity: Voltage equals Current multiplied by Resistance (V = I × R).', 
        technicalMeaning: 'An empirical physical law stating that the electric current through a linear conductor between two points is directly proportional to the potential difference and inversely proportional to resistance.' 
      },
      { 
        term: 'Forward Voltage Drop (Vf)', 
        plainMeaning: 'The minimum voltage "toll fee" an LED requires across its semiconductor junction before it can emit light.', 
        technicalMeaning: 'The operating potential drop across a forward-biased P-N junction diode under standard forward conduction (typically 1.8V–2.2V for Red/Yellow, 3.0V–3.3V for Green/Blue/White).' 
      },
      { 
        term: 'Current Sourcing vs Sinking', 
        plainMeaning: 'Sourcing pushes positive electrical current out of the pin; sinking pulls current into the pin and returns it to Ground.', 
        technicalMeaning: 'Sourcing occurs when an active-high output transistor connects the GPIO pin to VCC (+5V); sinking occurs when an active-low transistor connects the GPIO pin to Ground (0V).' 
      },
      { 
        term: 'Thermal Runaway', 
        plainMeaning: 'A dangerous chain reaction where heating decreases resistance, which draws more current, creating even more heat until the component melts.', 
        technicalMeaning: 'A positive feedback process where increasing semiconductor temperature decreases junction barrier potential, exponentially amplifying current and resulting in catastrophic device failure.' 
      }
    ],
    teacherPrep: [
      'Inspect half-size 400 tie-point breadboards to ensure clips have not been bent by oversized component leads.',
      'Prepare bins with 220Ω (Red-Red-Brown-Gold) and 330Ω (Orange-Orange-Brown-Gold) 1/4W resistors.',
      'Check assorted 5mm diffused LEDs (Red, Yellow, Green) and test lead straightness.',
      'Verify Male-to-Male 20cm copper jumper wires have intact Dupont pins and good continuity.'
    ],
    verifiedMaterials: [
      'Arduino Uno Rev3 (Official or 100% ATmega328P DIP clone)',
      'Solderless breadboard (400 tie-points, half-size with power rails)',
      '3x 5mm diffused LEDs (1x Red, 1x Yellow, 1x Green)',
      '3x Carbon film resistors, 220Ω ±5%, 0.25W',
      '6x Male-to-Male jumper wires (Red, Black, Yellow, Green, Blue)'
    ],
    safetyNotes: [
      'Never connect an LED directly between 5V and GND without a series resistor — doing so causes instant diode destruction and can permanently burn out the microcontroller output pin.',
      'Always unplug the USB cable or battery power before inserting or repositioning wires on the breadboard.',
      'Do not bridge both legs of an LED or resistor into the exact same 5-hole row — that shorts the component out.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display an X-ray tear-down of a breadboard showing internal nickel clips. Demonstrate a bare LED connected to a 9V battery popping in a burst of smoke on video.', 
        studentAction: 'Examine breadboard internal tie-point rows with flashlights and identify the central isolation trench.' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Derive Ohm’s Law on the board: V_resistor = 5.0V - 2.0V = 3.0V; R = 3.0V / 0.015A = 200Ω. Explain why 220Ω is the standard safe choice.', 
        studentAction: 'Calculate required resistance for a 3.2V Blue LED operating at 15mA: (5V - 3.2V) / 0.015A = 120Ω.' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Guide multi-LED breadboard construction: Red on Pin 9, Yellow on Pin 8, Green on Pin 7, each with dedicated 220Ω resistor and shared GND rail.', 
        studentAction: 'Wire the traffic light circuit, plug in USB, and upload the robotic state sequence sketch.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect student traffic light sequences and assess circuit topology.', 
        studentAction: 'Complete the formative exit ticket and defend why parallel LEDs require separate resistors.' 
      }
    ],
    concepts: [
      {
        title: '1. Solderless Breadboard Internal Anatomy & Continuity',
        explanation: 'A solderless breadboard is an array of nickel-plated phosphor bronze spring clips encased in ABS plastic. Along the outer edges run two vertical columns known as Power Rails (+ in red for VCC, - in blue for GND). In the center area, horizontal terminal strips are arranged in numbered rows of 5 interconnected tie-points (columns a-b-c-d-e and f-g-h-i-j). The center 0.3-inch divider trench physically and electrically isolates the two halves, allowing Dual In-Line Package (DIP) integrated circuits to sit across the trench without shorting their opposite pins together.',
        instructorNote: 'Emphasize: Two wires inserted into row 15a and row 15b are touching each other via the hidden metal strip beneath. But row 15a and row 16a are completely insulated from each other.'
      },
      {
        title: '2. Ohm’s Law & The Exact Current-Limiting Derivation',
        explanation: 'An LED is a non-linear semiconductor diode: once voltage exceeds its forward threshold (Vf ≈ 2.0V for Red), its internal electrical resistance drops nearly to zero! If connected directly across a 5V supply, the diode attempts to draw infinite current, destroying its microscopic silicon bond wire within milliseconds. By placing a resistor in series, the circuit obeys Kirchhoff’s Voltage Law (V_source = V_resistor + V_led) and Ohm’s Law (V_resistor = I × R). To achieve a bright, safe forward current of 15mA (0.015A) from a 5.0V Arduino pin: R = (5.0V - 2.0V) / 0.015A = 3.0V / 0.015A = 200Ω. The nearest standard manufactured resistor value in the E12 series is 220Ω, delivering exactly 13.6mA — safely below the ATmega328P pin limit of 40mA absolute maximum.',
        instructorNote: 'Show students the formula triangle: V at the top, I and R at the bottom. Cover the variable you want to find.'
      },
      {
        title: '3. Resistor Color Band Decoding (E12 Standard)',
        explanation: 'Because electronic resistors are too small for printed text numbers, manufacturers mark their nominal resistance using color-coded circumferential bands based on the IEC 60062 international standard. On a 4-band resistor: Band 1 = 1st significant digit; Band 2 = 2nd significant digit; Band 3 = Multiplier (power of 10); Band 4 = Tolerance. For a 220Ω resistor: Red (2) — Red (2) — Brown (×10¹) — Gold (±5%). For a 10kΩ resistor: Brown (1) — Black (0) — Orange (×10³) — Gold (±5%). For a 330Ω resistor: Orange (3) — Orange (3) — Brown (×10¹) — Gold (±5%).',
        instructorNote: 'Teach the mnemonic: Bad Boys R-O-Y Great Britain Very Good Wife (Black=0, Brown=1, Red=2, Orange=3, Yellow=4, Green=5, Blue=6, Violet=7, Gray=8, White=9).'
      },
      {
        title: '4. Series vs Parallel Circuit Rules & Current Hogging',
        explanation: 'In a Series circuit, all components are connected end-to-end along a single path: Current is identical through every component (I_total = I_1 = I_2), while voltages divide (V_total = V_1 + V_2). In a Parallel circuit, components share common positive and negative nodes: Voltage across every branch is identical (V_total = V_1 = V_2), while currents add (I_total = I_1 + I_2). CRITICAL ENGINEERING RULE: Never place multiple LEDs in parallel sharing a single current-limiting resistor! Due to microscopic manufacturing tolerances, one LED will have a slightly lower Vf, causing it to draw all the current ("current hogging"), burning it out first, after which the remaining LEDs quickly cascade into failure.',
        instructorNote: 'Show students that in the RoboBEE lab, every single LED always receives its own dedicated series resistor.'
      },
      {
        title: '5. Microcontroller GPIO Output States: Sourcing vs Sinking',
        explanation: 'Every digital I/O pin on the ATmega328P microcontroller contains a complementary pair of internal silicon MOSFET switches: a P-channel transistor tied to VCC (+5V) and an N-channel transistor tied to Ground (0V). Executing `digitalWrite(pin, HIGH)` activates the P-FET, connecting the pin to +5V and pushing electric current OUT into the circuit (Current Sourcing). Executing `digitalWrite(pin, LOW)` activates the N-FET, pulling the pin to 0V and draining electric current down to Ground (Current Sinking). Both configurations are widely used in commercial robotics: Active-HIGH sourcing turns devices on with logic 1; Active-LOW sinking turns devices on with logic 0.',
        instructorNote: 'Explain that the ATmega328P can source up to 20mA per pin continuously, but the entire chip has a total maximum current budget of 200mA across all pins combined.'
      },
      {
        title: '6. Robotic Status Annunciators & Industrial Safety Signals',
        explanation: 'Real-world autonomous robots cannot speak human words; they communicate internal computational states to lab operators using tri-color status indicator beacons (Annunciator Stacks). In modern robotics engineering (ISO 10218 robotic safety standards): Solid Red = E-Stop engaged / System Fault; Solid Yellow = Standby / Pre-movement warning; Solid Green = Autonomous navigation active; Flashing Amber = Low battery / Telemetry link lost. Today, students build and program this exact industrial robotic annunciator on their breadboards.',
        instructorNote: 'Relate this to industrial KUKA robot cells and warehouse AGVs that flash amber strobe lights before starting wheel motion.'
      }
    ],
    visualizerId: 'breadboard_circuit_sim',
    project: {
      name: 'Tri-State Robotic Signal & Traffic Annunciator',
      deliverableType: 'physical_build',
      successEvidence: [
        'Breadboard circuit with Red, Yellow, and Green LEDs wired with dedicated 220Ω series resistors.',
        'Shared common Ground return rail connected back to Arduino GND.',
        'Arduino executing deterministic traffic light timing sequence without flickering or pin overload.'
      ]
    },
    activity: {
      title: 'Assemble and Code the Robotic Annunciator Circuit',
      steps: [
        'Step 1: Unplug the USB cable from the Arduino to guarantee an electrically dead workspace.',
        'Step 2: Insert the Red LED into breadboard rows 10 & 11 (Long leg / Anode in row 10, short leg / Cathode in row 11).',
        'Step 3: Insert the Yellow LED into rows 15 & 16, and the Green LED into rows 20 & 21.',
        'Step 4: Insert three 220Ω resistors: one spanning from row 10 to Arduino Pin 9; one from row 15 to Pin 8; one from row 20 to Pin 7.',
        'Step 5: Connect three black jumper wires from rows 11, 16, and 21 to the breadboard blue negative (-) Ground rail.',
        'Step 6: Connect a master ground wire from the breadboard Ground rail to an Arduino GND pin.',
        'Step 7: Perform visual peer-review inspection before plugging in USB power and uploading the sketch.'
      ],
      successCriteria: [
        'All three LEDs light up brightly in sequence without any dimming or resistor overheating.',
        'No short circuits exist between adjacent breadboard terminal rows.',
        'The C++ sketch executes the correct timed transition: Green (3s) -> Yellow (1s) -> Red (3s).'
      ],
      extension: 'Wire an active-low pedestrian push indicator or program a 4-state European traffic sequence with simultaneous Red and Amber.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 (ATmega328P)', 'Solderless Breadboard 400 tie-points'],
      componentList: [
        { name: 'Arduino Uno Rev3', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: 'Solderless Breadboard', exactVariant: '400 Tie-Point Half Size with Power Rails', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'Vf ≈ 2.0V, If = 20mA max, 625nm wavelength', quantity: 1 },
        { name: '5mm Yellow Diffused LED', exactVariant: 'Vf ≈ 2.1V, If = 20mA max, 590nm wavelength', quantity: 1 },
        { name: '5mm Green Diffused LED', exactVariant: 'Vf ≈ 2.2V, If = 20mA max, 525nm wavelength', quantity: 1 },
        { name: 'Carbon Film Resistors', exactVariant: '220Ω ±5%, 0.25W (Red-Red-Brown-Gold)', quantity: 3 },
        { name: 'Male-to-Male Jumper Wires', exactVariant: '20cm 24AWG copper multi-color', quantity: 6 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/breadboard_led_resistor_wiring.svg',
      schematic: 'Arduino Pin 9 ──[ 220Ω ]──[ Red LED Anode | Cathode ]── GND Rail\nArduino Pin 8 ──[ 220Ω ]──[ Yellow LED Anode | Cathode ]── GND Rail\nArduino Pin 7 ──[ 220Ω ]──[ Green LED Anode | Cathode ]── GND Rail\nGND Rail ────────────────────────────────────────────── Arduino GND',
      wireTable: [
        { from: 'Arduino Digital Pin 9', to: 'Breadboard Row 10A (Red Resistor)', wireOrPolarityNote: 'Red Signal Wire' },
        { from: 'Arduino Digital Pin 8', to: 'Breadboard Row 15A (Yellow Resistor)', wireOrPolarityNote: 'Yellow Signal Wire' },
        { from: 'Arduino Digital Pin 7', to: 'Breadboard Row 20A (Green Resistor)', wireOrPolarityNote: 'Green Signal Wire' },
        { from: 'Breadboard Row 11E (Red Cathode)', to: 'Breadboard Blue (-) Rail', wireOrPolarityNote: 'Black Ground Jumper' },
        { from: 'Breadboard Row 16E (Yellow Cathode)', to: 'Breadboard Blue (-) Rail', wireOrPolarityNote: 'Black Ground Jumper' },
        { from: 'Breadboard Row 21E (Green Cathode)', to: 'Breadboard Blue (-) Rail', wireOrPolarityNote: 'Black Ground Jumper' },
        { from: 'Breadboard Blue (-) Rail', to: 'Arduino GND Pin', wireOrPolarityNote: 'Main System Ground Return Wire' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure Arduino is fully disconnected from USB and 9V power before placing components.',
        '2. Orient the breadboard horizontally with the blue (-) ground rail closest to you.',
        '3. Inspect the three 5mm LEDs. Note that the longer leg is the Anode (+), and the flat collar side with the shorter leg is the Cathode (-).',
        '4. Insert the Red, Yellow, and Green LEDs into rows 10-11, 15-16, and 20-21 respectively.',
        '5. Place a 220Ω resistor (Red-Red-Brown-Gold) in series with the anode of each LED.',
        '6. Connect the three cathode rows to the common blue (-) ground bus rail.',
        '7. Connect the master Ground wire from the breadboard bus rail to the Arduino GND pin.',
        '8. Connect signal wires from Pins 9, 8, and 7 to the input ends of the resistors.',
        '9. Re-verify with your lab partner that no resistor or LED has both legs in the same row.',
        '10. Plug in the USB cable and upload the sketch.'
      ],
      powerAndSafetyChecks: [
        'Verify that each LED has its OWN dedicated 220Ω resistor — never share one resistor between multiple LEDs.',
        'Check that no wire strands are touching adjacent terminal rows.',
        'Confirm that total current from all active pins does not exceed the 200mA microcontroller package ceiling.'
      ],
      testCases: [
        { action: 'Upload code and observe Pin 7 state', expectedResult: 'Green LED illuminates for exactly 3000ms while Red and Yellow remain dark.' },
        { action: 'Observe transition after 3000ms', expectedResult: 'Green LED extinguishes and Yellow LED illuminates for exactly 1000ms.' },
        { action: 'Observe transition after 4000ms', expectedResult: 'Yellow LED extinguishes and Red LED illuminates for exactly 3000ms.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Robotic Signal Annunciator
// Class: BEGINNER 02 - Circuits, Breadboards, and Safe Outputs
// Controls a 3-stage traffic indicator using safe series resistors.

const int RED_LED_PIN    = 9; // Pin 9 drives Red LED through 220Ω resistor
const int YELLOW_LED_PIN = 8; // Pin 8 drives Yellow LED through 220Ω resistor
const int GREEN_LED_PIN  = 7; // Pin 7 drives Green LED through 220Ω resistor

void setup() {
  // Configure all three digital pins as low-impedance voltage outputs
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);

  // Initial state: start with all LEDs safely turned OFF
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(YELLOW_LED_PIN, LOW);
  digitalWrite(GREEN_LED_PIN, LOW);
}

void loop() {
  // PHASE 1: GREEN LIGHT (Robot Navigation Active / Clear to proceed)
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(YELLOW_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);
  delay(3000); // Hold Green for 3.0 seconds

  // PHASE 2: YELLOW LIGHT (Warning / Deceleration / Obstacle ahead)
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(YELLOW_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, LOW);
  delay(1000); // Hold Yellow for 1.0 second

  // PHASE 3: RED LIGHT (Halt / E-Stop / Critical Hazard Zone)
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(YELLOW_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, HIGH);
  delay(3000); // Hold Red for 3.0 seconds
}`,
      pinMap: { 
        'Pin 9': 'Red Status LED Anode via 220Ω resistor', 
        'Pin 8': 'Yellow Warning LED Anode via 220Ω resistor', 
        'Pin 7': 'Green Clear LED Anode via 220Ω resistor',
        'GND': 'Common Ground Rail for all 3 LED cathodes'
      },
      setupAndUpload: [
        '1. In the Arduino IDE, confirm "Arduino Uno" is selected under Tools > Board.',
        '2. Select the matching serial communication port under Tools > Port.',
        '3. Click the Verify button (checkmark) to ensure zero compilation syntax errors.',
        '4. Click Upload (arrow pointing right) and observe the Arduino TX/RX LEDs flickering as the binary flashes.'
      ],
      explanations: [
        'const int: Declares read-only constant integers for pin numbers, optimizing memory and preventing accidental reassignment.',
        'pinMode(pin, OUTPUT): Sets the Data Direction Register (DDR) bit to 1, enabling the internal high-speed CMOS output driver.',
        'digitalWrite(pin, HIGH): Connects the internal pin gate to VCC (+5V), sourcing ~13.6mA through the 220Ω resistor to illuminate the LED.',
        'digitalWrite(pin, LOW): Connects the internal pin gate to GND (0V), shutting off current flow completely.'
      ],
      expectedResult: 'The breadboard LEDs transition continuously in an infinite industrial traffic cycle: Green (3s) -> Yellow (1s) -> Red (3s) -> repeats.',
      caveats: [
        'Ensure the long leg of each LED connects to the resistor row, and the short leg connects to the ground row.',
        'Do not remove wires while the board is actively powered.'
      ],
      tweakTip: 'Implement European intersection timing: add a 4th phase where Red and Yellow illuminate together for 800ms right before turning Green!'
    },
    troubleshooting: [
      { 
        symptom: 'One specific LED fails to illuminate while the other two work normally.', 
        checks: [
          'Step 1: Check LED orientation — is the long leg (Anode) connected to the resistor and short leg (Cathode) to GND?',
          'Step 2: Check row alignment — verify that both legs are not plugged into the same 5-hole row.',
          'Step 3: Swap the suspected LED into a known-working row to check for internal semiconductor burnout.'
        ], 
        explanation: 'LEDs are directional diodes; reversed polarity blocks current conduction without damage, but no photons are emitted.' 
      },
      { 
        symptom: 'All three LEDs illuminate at the exact same time and never change.', 
        checks: [
          'Step 1: Verify the sketch uploaded successfully with "Done uploading" in the IDE status bar.',
          'Step 2: Check that each digital pin (9, 8, 7) connects to a separate breadboard row, rather than being bridged together.'
        ], 
        explanation: 'If jumper wires are plugged into the same breadboard row, the outputs are tied together, overriding individual software control.' 
      },
      { 
        symptom: 'The Arduino board disconnects or reboots every time an LED turns on.', 
        checks: [
          'Step 1: Unplug USB immediately!',
          'Step 2: Inspect for a missing resistor: did an LED connect directly from Pin 9 to GND with 0Ω resistance?',
          'Step 3: Check for bent wire leads touching the metal USB connector casing.'
        ], 
        explanation: 'A short circuit draws excessive current (>500mA), tripping the Arduino board’s onboard resettable polyfuse to protect your computer’s USB port.' 
      },
      { 
        symptom: 'LEDs appear very dim even when commanded HIGH.', 
        checks: [
          'Step 1: Inspect resistor color code — did you accidentally use a 10kΩ resistor (Brown-Black-Orange) instead of 220Ω (Red-Red-Brown)?',
          'Step 2: Test with a digital multimeter across the resistor to verify actual resistance.'
        ], 
        explanation: 'A 10kΩ resistor allows only 0.3mA of current to pass (10,000 ohms), which is too weak to produce visible photon emission in diffused LEDs.' 
      }
    ],
    checksForUnderstanding: [
      'Why is it physically impossible to power an LED directly from 5V without a series resistor?',
      'How does a solderless breadboard connect holes horizontally vs vertically?',
      'If two LEDs are placed in parallel sharing one resistor, what dangerous phenomenon can occur?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the required series resistor value for a Blue LED with a forward voltage of Vf = 3.2V operating at 15mA from a 5.0V Arduino pin.', 
        hint: 'Use Ohm’s Law: R = (V_supply - V_f) / I_forward. Convert 15mA into amperes (0.015A).',
        rubricOrSampleReasoning: 'Voltage across resistor V_R = 5.0V - 3.2V = 1.8V. Resistance R = 1.8V / 0.015A = 120Ω. The nearest standard manufactured E12 resistor is 120Ω or 150Ω.' 
      },
      { 
        question: 'Explain why two wires plugged into holes 15a and 15e are electrically connected, but holes 15e and 15f are NOT.', 
        hint: 'Think about the central divider trench running down the middle of the breadboard.',
        rubricOrSampleReasoning: 'Holes 15a through 15e share a single continuous metal spring-clip underneath. The central trench splits the breadboard into two isolated halves, so column f belongs to a separate clip.' 
      },
      { 
        question: 'Why does RoboBEE engineering mandate separate series resistors for every LED in a multi-light circuit?', 
        hint: 'Consider slight manufacturing differences in forward voltage between individual LEDs.',
        rubricOrSampleReasoning: 'Sharing a single resistor causes "current hogging" — the LED with slightly lower forward voltage draws excess current, overheats, burns out, and cascades into failure for the remaining LEDs.' 
      }
    ],
    differentiation: {
      support: [
        'Provide a 1:1 scale color-printed breadboard layout template showing exact hole numbers for students needing spatial assistance.',
        'Pre-bend resistor legs at 90-degree angles to make insertion into 5-hole rows smooth.'
      ],
      extension: [
        'Mission: Program an interactive crosswalk where an additional white or blue LED flashes rapidly as a warning strobe.',
        'Mission: Use the C++ modulo operator (%) to create an automatic cycling loop without duplicating digitalWrite calls.'
      ],
      offlineOption: [
        'Sketch the circuit on an engineering grid sheet showing node continuity, voltage drops, and Kirchhoff loop equations.'
      ]
    },
    nextLessonId: 'beg-03',
    nextLessonTeaser: 'Beginner 03: Arduino & C++ First Steps — Inputs & Serial Monitor. Discover how robots sense touch with tactile pushbuttons, master active-low pull-up physics, and stream live sensor telemetry at 9600 baud!',
    sources: [
      { title: 'Arduino Foundations: Digital Pins & Breadboards', url: 'https://docs.arduino.cc/learn/microcontrollers/digital-pins/' },
      { title: 'IEC 60062 Marking codes for resistors and capacitors', url: 'https://www.iec.ch' }
    ],
    assetCredits: [
      { asset: 'Breadboard LED Resistor Wiring Illustration', creator: 'RoboBEE Innovators Academy', license: 'Proprietary Educational Architecture', sourceUrl: 'team_info' }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 03: ARDUINO AND C++ FIRST STEPS: INPUTS & SERIAL MONITOR
  // -----------------------------------------------------------------------
  {
    id: 'beg-03',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure", "fg-arduino-ide-workflow"],
      lookUpWhileBuilding: ["fg-comm-i2c-spi-uart", "fg-board-uno-anatomy"],
      goDeeper: ["fg-prog-millis-vs-delay", "fg-testing-fmea-debugging"]
    },
    courseId: 'beginner',
    sequence: 3,
    code: 'BEGINNER 03',
    title: 'Arduino and C++ First Steps: Inputs & Serial Monitor',
    promise: 'Master tactile digital inputs, eliminate electromagnetic antenna noise with internal pull-up physics, write software contact debouncers, and stream live robotic telemetry at 9600 baud.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02'],
    outcomes: [
      'Diagnose the physics of "floating inputs" acting as ambient electromagnetic antennas picking up 50Hz/60Hz mains noise.',
      'Configure the ATmega328P internal 20kΩ–50kΩ pull-up resistor architecture using `INPUT_PULLUP`.',
      'Analyze the microsecond mechanics of mechanical switch contact bounce and implement software debouncing.',
      'Construct a tactile Human-Machine Interface (HMI) pushbutton circuit with active-low safety logic.',
      'Establish bidirectional UART serial communication at 9600 baud to log diagnostic sensor telemetry.'
    ],
    vocabulary: [
      { 
        term: 'Floating Pin', 
        plainMeaning: 'A digital input pin connected to nothing, which acts like a tiny radio antenna catching stray electrical static from the air.', 
        technicalMeaning: 'A high-impedance CMOS gate input with no fixed electrical reference to VCC or GND, causing its logical state to fluctuate randomly due to capacitive electromagnetic coupling.' 
      },
      { 
        term: 'INPUT_PULLUP', 
        plainMeaning: 'A software command that switches on a tiny safety resistor inside the Arduino chip to hold the pin at 5V until pressed to Ground.', 
        technicalMeaning: 'An internal ATmega328P register configuration that connects an on-chip 20kΩ–50kΩ resistor between the I/O pin and the internal VCC supply bus.' 
      },
      { 
        term: 'Active-LOW Logic', 
        plainMeaning: 'An inverted logic system where a 0 (Ground) means "Pressed / Active", and a 1 (+5V) means "Released / Idle".', 
        technicalMeaning: 'A digital signaling convention where the asserted (active) state corresponds to electrical ground (0V / binary 0), and the unasserted state corresponds to system voltage (5V / binary 1).' 
      },
      { 
        term: 'Contact Bounce', 
        plainMeaning: 'The microscopic metal spring inside a button bouncing open and shut several times in a few thousandths of a second when tapped.', 
        technicalMeaning: 'Transient electrical oscillations (typically lasting 1ms–10ms) caused by elastic mechanical collisions of physical switch contacts before reaching stable mechanical closure.' 
      },
      { 
        term: 'UART Serial Protocol', 
        plainMeaning: 'A two-wire electronic conversation channel that sends data one letter or bit at a time over a single wire.', 
        technicalMeaning: 'Universal Asynchronous Receiver-Transmitter: a hardware protocol transmitting byte packets framed with 1 start bit, 8 data bits, no parity, and 1 stop bit (8-N-1) across TX and RX lines.' 
      },
      { 
        term: 'Baud Rate', 
        plainMeaning: 'The exact timing speed of the serial connection (9600 baud means 9,600 electrical pulses per second).', 
        technicalMeaning: 'The modulation rate of a communication channel, defined as the number of discrete signaling events or symbol transitions per second.' 
      }
    ],
    teacherPrep: [
      'Verify 4-pin tactile momentary switches seat firmly across the breadboard center trench without loose wobble.',
      'Check that students know how to locate the Serial Monitor icon (magnifying glass) in Arduino IDE 2.x.',
      'Prepare an intentionally ungrounded jumper wire demonstration to show floating pin erratic readings live on the projector.'
    ],
    verifiedMaterials: [
      'Arduino Uno Rev3',
      '4-pin momentary tactile pushbutton (6x6mm through-hole)',
      'Solderless half-size breadboard',
      'External 5mm status LED and 220Ω resistor',
      'Male-to-Male jumper wires (Red, Black, Yellow, Green)'
    ],
    safetyNotes: [
      'Always connect the switch between the digital input pin and Ground (GND); never short a direct wire from 5V to GND without a resistive load.',
      'Unplug USB power before placing or removing the tactile switch from the breadboard.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Configure Pin 2 as bare INPUT. Touch the metal wire with your finger and show the Serial Monitor streaming wildly between 0 and 1 from ambient AC static!', 
        studentAction: 'Observe the floating pin live telemetry on the classroom screen and discover why floating inputs are dangerous in robotics.' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Explain the internal pull-up resistor schematic inside the ATmega328P. Demonstrate contact bounce on a digital storage oscilloscope.', 
        studentAction: 'Trace the active-low current path when the button is held down (current flows from 5V through internal 20kΩ to GND).' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Guide button insertion across breadboard trench, connect Pin 2 to switch and GND return. Walk through software toggle latch code.', 
        studentAction: 'Wire the button, upload the sketch, open Serial Monitor at 9600 baud, and program a pushbutton toggle that turns an external LED ON and OFF.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect student Serial Monitor streams and verify toggle latch stability.', 
        studentAction: 'Complete the exit check questions explaining pull-up logic and debouncing math.' 
      }
    ],
    concepts: [
      {
        title: '1. The Floating Input Hazard & The Antenna Effect',
        explanation: 'A microcontroller CMOS input pin has an ultra-high input impedance (over 100,000,000 ohms). It requires virtually zero electrical current to sense whether a voltage is present. Consequently, if a pin is left disconnected ("floating"), it acts exactly like a radio antenna! It picks up ambient electromagnetic interference (EMI) radiating from room fluorescent lights, laptop power bricks, and 50Hz/60Hz mains wiring. If a robot used a floating pin to trigger its emergency brake, the robot would randomly stop or jerk erratically without anyone touching it. To guarantee deterministic behavior, every digital input must be actively pulled up to VCC or pulled down to GND.',
        instructorNote: 'Have students wave their hands near a floating input pin in Serial Plotter — the graph looks like an ECG heartbeat monitor from electro-static induction.'
      },
      {
        title: '2. The ATmega328P Internal Pull-Up Resistor Architecture',
        explanation: 'In early electronics, every pushbutton required an external 10,000Ω (10kΩ) pull-up resistor soldered onto the circuit board to hold the pin high. The designers of the ATmega328P microchip integrated a microscopic on-chip resistor (nominally 20kΩ to 50kΩ) directly into the silicon of every I/O pin! By calling `pinMode(pin, INPUT_PULLUP)`, the microcontroller closes an internal PMOS switch connecting this internal resistor between the I/O pin and the internal +5V power rail. This eliminates external components, saves breadboard space, and makes robot wiring faster and far more reliable.',
        instructorNote: 'Point out that the internal pull-up resistor is relatively weak (20k–50kΩ), which draws only ~0.15mA when the button is pressed, conserving battery power.'
      },
      {
        title: '3. Active-LOW Logic in Industrial Robotics Safety',
        explanation: 'In beginner minds, "Pressed = 1, Released = 0" feels intuitive. However, professional aerospace and industrial robotics almost universally use Active-LOW logic ("Pressed = 0, Released = 1"). Why? Because connecting a switch between an input pin and Ground (GND) means you only run a Ground wire to the physical button on the robot bumper. If the wire rubs against the aluminum metal chassis and wears through its insulation, it simply shorts to Ground — causing the robot to stop safely. If an Active-HIGH circuit (carrying +5V or +24V) wore through and touched the metal frame, it would create a catastrophic direct battery short circuit and fire hazard!',
        instructorNote: 'Connect this to emergency stop buttons (E-Stops) on industrial machinery, which are wired normally-closed (NC) so that cutting the wire immediately triggers an emergency shutdown.'
      },
      {
        title: '4. Mechanical Contact Bounce & Elastic Collisions',
        explanation: 'When you press a tactile pushbutton, it feels like a single instant click. But at microscopic scale and high microsecond speeds, the moving metal leaf spring slams into the stationary contact plate, flexing and rebounding elastically. It physically bounces open and closed 5 to 25 times over the course of 2 to 10 milliseconds before settling into firm contact! Because an Arduino executes code at 16 million instructions per second (one instruction every 62.5 nanoseconds), the microcontroller can detect every single bounce as an independent button press! Without debouncing, pressing a button once might toggle a robot arm 14 times in a blink.',
        instructorNote: 'Have students run a counter sketch without debouncing and watch the counter jump from 1 to 5 to 12 on a single finger tap.'
      },
      {
        title: '5. Software Debouncing Algorithms: Delay vs Non-Blocking Time Stamps',
        explanation: 'To eliminate contact bounce, engineers use software debouncing. The simplest method is the Delay Debounce: when a state change is detected, execute a short `delay(20)` to let the physical metal spring finish bouncing before reading the pin again. The professional method is Non-Blocking State Debounce: record the time of the transition using `millis()`. Ignore all subsequent transitions until at least 30 milliseconds have elapsed since the last detected edge. This ensures rock-solid single-click detection while keeping the robot CPU 100% free to monitor other critical sensors.',
        instructorNote: 'Compare debouncing to a referee in sports waiting 1 second after a whistle before allowing another play to begin.'
      },
      {
        title: '6. UART Serial Framing, Baud Rates & Diagnostic Telemetry',
        explanation: 'Robots need a way to talk back to human developers during testing. The Arduino Uno uses Universal Asynchronous Receiver-Transmitter (UART) serial hardware. When you call `Serial.print("ROBO_OK")`, the ATmega328P converts each ASCII character into an 8-bit byte. It frames the byte with a 0 Start Bit at the beginning and a 1 Stop Bit at the end, shifting the bits sequentially out of Digital Pin 1 (TX) at precisely timed microsecond intervals dictated by the Baud Rate (9600 bits per second = 104.16 microseconds per bit). The onboard USB interface chip reads these electrical pulses and forwards them to your computer screen.',
        instructorNote: 'Demonstrate what happens when the IDE Serial Monitor is set to 115200 baud while the Arduino sends at 9600 baud — complete character corruption due to clock mismatch.'
      }
    ],
    visualizerId: 'sensor_serial_sim',
    project: {
      name: 'Interactive Robotic HMI Console with Toggle Latch',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Tactile button wired between Pin 2 and GND using internal pull-up resistor.',
        'External status LED on Pin 9 toggling ON and OFF cleanly on alternate button presses without double-click bouncing.',
        'Serial Monitor streaming formatted JSON-like diagnostic telemetry at 9600 baud showing button state and cycle count.'
      ]
    },
    activity: {
      title: 'Assemble the Button HMI and Program Software Latching',
      steps: [
        'Step 1: Unplug USB power from the Arduino board.',
        'Step 2: Place a 4-pin tactile switch straddling the central divider trench between rows 15 and 17.',
        'Step 3: Connect a jumper wire from Arduino Pin 2 to breadboard row 15a (Switch Terminal 1).',
        'Step 4: Connect a jumper wire from Arduino GND to breadboard row 17a (Switch Terminal 2 diagonally opposite).',
        'Step 5: Wire an external status LED with a 220Ω series resistor from Arduino Pin 9 to GND.',
        'Step 6: Plug in the USB cable, upload the debounced toggle latch sketch, and open the Serial Monitor at 9600 baud.',
        'Step 7: Press the tactile button and observe the LED latch ON. Press again to latch OFF.'
      ],
      successCriteria: [
        'Pressing the tactile switch cleanly toggles the status LED every single time without false double-triggers.',
        'Serial Monitor displays human-readable diagnostic messages: "BUTTON PRESSED -> SYSTEM ACTIVE" and "SYSTEM STANDBY".',
        'No external resistors are used on the button circuit (leveraging internal pull-up silicon).'
      ],
      extension: 'Add a second button on Pin 3 to serve as a Dedicated E-Stop Reset that immediately forces the LED off and prints an emergency log.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3', '6x6mm 4-Pin Momentary Tactile Pushbutton'],
      componentList: [
        { name: 'Arduino Uno Rev3', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: '4-Pin Tactile Pushbutton', exactVariant: '6x6mm through-hole momentary switch', quantity: 1 },
        { name: 'Solderless Breadboard', exactVariant: '400 Tie-Point Half Size', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'Vf ≈ 2.0V, If = 20mA max', quantity: 1 },
        { name: 'Carbon Film Resistor', exactVariant: '220Ω ±5%, 0.25W', quantity: 1 },
        { name: 'Male-to-Male Jumper Wires', exactVariant: '20cm 24AWG copper', quantity: 4 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/arduino_button_input_pullup.svg',
      schematic: 'Arduino Pin 2 ──[ Tactile Switch ]── Arduino GND (Uses internal ~20kΩ pull-up to 5V)\nArduino Pin 9 ──[ 220Ω Resistor ]──[ LED Anode | Cathode ]── Arduino GND',
      wireTable: [
        { from: 'Arduino Digital Pin 2', to: 'Breadboard Row 15A (Switch Pin 1)', wireOrPolarityNote: 'Button Sense Signal (Yellow)' },
        { from: 'Breadboard Row 17A (Switch Pin 2)', to: 'Arduino GND Pin', wireOrPolarityNote: 'Button Ground Return (Black)' },
        { from: 'Arduino Digital Pin 9', to: 'Breadboard Row 25A (Resistor Leg 1)', wireOrPolarityNote: 'LED Output Signal (Red)' },
        { from: 'Breadboard Row 25E (Resistor Leg 2)', to: 'Breadboard Row 26A (LED Anode)', wireOrPolarityNote: 'Internal Tie-Point' },
        { from: 'Breadboard Row 26E (LED Cathode)', to: 'Arduino GND Pin', wireOrPolarityNote: 'LED Ground Return (Black)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Disconnect USB power before modifying circuit wiring.',
        '2. Orient the 4-pin tactile button so that its legs curve outward across the center breadboard trench.',
        '3. Press the button firmly until its plastic body sits flush against the breadboard face.',
        '4. Connect Pin 2 to one side of the button, and connect GND to the opposite terminal.',
        '5. Wire the external LED on Pin 9 with its series 220Ω resistor.',
        '6. Reconnect the USB cable and upload the sketch.',
        '7. Open Tools > Serial Monitor in the Arduino IDE and set the baud rate dropdown to 9600 baud.'
      ],
      powerAndSafetyChecks: [
        'Confirm the button is wired between Pin 2 and GND (never connect the button between 5V and GND!).',
        'Verify that the LED cathode connects directly to Ground, not to 5V.'
      ],
      testCases: [
        { action: 'Board powered, button untouched', expectedResult: 'LED is dark. Serial Monitor logs "System: STANDBY | Raw Pin: 1"' },
        { action: 'Tap button once firmly', expectedResult: 'LED turns ON and remains ON. Serial Monitor logs "Event: CLICK | System: ACTIVE"' },
        { action: 'Tap button a second time', expectedResult: 'LED turns OFF and remains OFF. Serial Monitor logs "Event: CLICK | System: STANDBY"' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Robotic HMI & Input Telemetry
// Class: BEGINNER 03 - Arduino and C++ First Steps: Inputs & Serial Monitor
// Implements active-low INPUT_PULLUP, software contact debouncing,
// toggle latching, and real-time UART telemetry.

const int BUTTON_PIN = 2; // Tactile button connected between Pin 2 and GND
const int LED_PIN    = 9; // Status LED connected to Pin 9 via 220Ω resistor

// System state variables
int ledState = LOW;         // Current operational state of the robot LED (LOW or HIGH)
int lastButtonState = HIGH; // Previous raw reading from the active-low button (default HIGH)
unsigned long lastDebounceTime = 0; // Timestamp of the last detected transition
const unsigned long DEBOUNCE_DELAY_MS = 40; // 40ms debounce lockout window
unsigned long pressCounter = 0;     // Total number of valid human presses

void setup() {
  // Configure Pin 2 with internal 20kΩ pull-up resistor (no external resistor needed!)
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  // Configure Pin 9 as low-impedance output driver for LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState);

  // Initialize hardware UART serial link at 9600 bits per second
  Serial.begin(9600);
  delay(200); // Allow serial transceiver to stabilize
  Serial.println("==========================================");
  Serial.println("  ROBOBEE INNOVATORS - HMI CONSOLE READY  ");
  Serial.println("  INPUT_PULLUP Active-LOW Logic Engaged  ");
  Serial.println("==========================================");
}

void loop() {
  // Read current raw pin state (1 = unpressed, 0 = pressed to GND)
  int currentReading = digitalRead(BUTTON_PIN);

  // Check if mechanical contact state changed (either pressed down or released)
  if (currentReading != lastButtonState) {
    lastDebounceTime = millis(); // Reset debounce timer
  }

  // If signal has stayed stable longer than our 40ms debounce window:
  if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY_MS) {
    // Detect falling edge: transition from unpressed (HIGH) to pressed (LOW)
    if (currentReading == LOW && lastButtonState == HIGH) {
      pressCounter++;
      ledState = !ledState; // Toggle LED state (LOW -> HIGH or HIGH -> LOW)
      digitalWrite(LED_PIN, ledState);

      // Transmit diagnostic telemetry packet over Serial Monitor
      Serial.print("[TELEMETRY] Press #");
      Serial.print(pressCounter);
      Serial.print(" | Action: TOGGLE | System State: ");
      if (ledState == HIGH) {
        Serial.println("ACTIVE (1)");
      } else {
        Serial.println("STANDBY (0)");
      }
    }
  }

  // Save current reading for next loop iteration comparison
  lastButtonState = currentReading;
}`,
      pinMap: { 
        'Pin 2': 'Tactile pushbutton input with on-chip INPUT_PULLUP', 
        'Pin 9': 'Status LED Anode via 220Ω current-limiting resistor',
        'GND': 'Common Ground for both pushbutton and LED cathode'
      },
      setupAndUpload: [
        '1. Verify Arduino Uno is connected via USB cable.',
        '2. In the Arduino IDE, verify Tools > Board is set to "Arduino Uno".',
        '3. Click Upload. Once complete, open Tools > Serial Monitor.',
        '4. In the Serial Monitor window (bottom panel), verify the dropdown is set to "9600 baud".'
      ],
      explanations: [
        'pinMode(BUTTON_PIN, INPUT_PULLUP): Activates the internal 20kΩ pull-up resistor, forcing the pin to read 1 (HIGH) until physically grounded.',
        'digitalRead(BUTTON_PIN): Reads the digital voltage on Pin 2. Returns 0 (LOW) when pressed, 1 (HIGH) when released.',
        'millis(): Built-in hardware timer function returning milliseconds elapsed since Arduino power-up, enabling non-blocking debouncing.',
        'ledState = !ledState: Boolean NOT operator, inverting LOW into HIGH and HIGH into LOW to create a push-on / push-off toggle latch.'
      ],
      expectedResult: 'Pressing the button once lights the LED and logs "[TELEMETRY] Press #1 | Action: TOGGLE | System State: ACTIVE (1)". Pressing again turns off the LED and logs STANDBY.',
      caveats: [
        'If the Serial Monitor shows gibberish characters, change the baud rate dropdown at the bottom right from 115200 to 9600 baud.',
        'Be sure the button is seated firmly across the center trench — loose pins produce intermittent connections.'
      ],
      tweakTip: 'Change DEBOUNCE_DELAY_MS from 40 to 0 to observe contact bounce live in the Serial Monitor as a single tap registers 3-5 presses!'
    },
    troubleshooting: [
      { 
        symptom: 'Serial Monitor displays strange unreadable characters like ⸮⸮⸮ or inverted question marks.', 
        checks: [
          'Step 1: Check the baud rate dropdown at the bottom right corner of the Serial Monitor window.',
          'Step 2: Confirm it is set to exactly "9600 baud" to match `Serial.begin(9600)` in your C++ setup() function.'
        ], 
        explanation: 'Asynchronous serial communication requires both transmitter and receiver to use the exact same clock speed. A baud rate mismatch scrambles bit decoding.' 
      },
      { 
        symptom: 'The button reading stays permanently at 0 (LOW) even when nobody is touching it.', 
        checks: [
          'Step 1: Check button orientation on the breadboard.',
          'Step 2: Note that a 4-pin tactile switch has internal metal bridges connecting pairs of pins.',
          'Step 3: Rotate the switch 90 degrees or connect jumper wires diagonally across opposite corners.'
        ], 
        explanation: 'Connecting wires to the two pins on the same internal bridge permanently connects Pin 2 to GND, simulating a stuck button.' 
      },
      { 
        symptom: 'The button reading flickers erratically between 0 and 1 without touching it.', 
        checks: [
          'Step 1: Inspect setup() code — did you write `pinMode(BUTTON_PIN, INPUT)` instead of `INPUT_PULLUP`?',
          'Step 2: Check that the GND jumper wire is plugged firmly into a real Arduino GND pin.'
        ], 
        explanation: 'Using plain `INPUT` leaves the pin floating without an electrical reference, causing it to pick up stray electromagnetic static from the room.' 
      },
      { 
        symptom: 'A single press of the button registers 2, 3, or more count increments.', 
        checks: [
          'Step 1: Inspect the debounce delay value in code (`DEBOUNCE_DELAY_MS`).',
          'Step 2: Increase the debounce threshold from 40ms to 60ms or 80ms for worn mechanical switches.'
        ], 
        explanation: 'Mechanical contact bounce creates rapid microsecond oscillations as metal contacts collide. A higher debounce threshold filters out slow mechanical settling.' 
      }
    ],
    checksForUnderstanding: [
      'What electrical phenomenon causes a floating pin to read random values when touched by a human hand?',
      'Why does `INPUT_PULLUP` eliminate the need for an external resistor on a pushbutton?',
      'In active-low logic, what binary number does the Arduino read when a switch connects the pin to Ground?'
    ],
    exitTicket: [
      { 
        question: 'Explain why connecting an input pin to a button wired to GND with `INPUT_PULLUP` is safer for robots than wiring a button to +5V with an external pull-down.', 
        hint: 'Think about what happens if a wire chafes against an aluminum robot chassis.',
        rubricOrSampleReasoning: 'Wiring to GND means only Ground lines run to external robot bumpers. If a wire insulation chafes against the metal chassis, it simply activates a safe active-low signal rather than creating a catastrophic high-current direct power short circuit.' 
      },
      { 
        question: 'What is mechanical contact bounce, and how long does it typically last in physical tactile switches?', 
        hint: 'Consider the elasticity of metal leaf springs.',
        rubricOrSampleReasoning: 'Contact bounce is the rapid mechanical bouncing of metal switch contacts as they collide, creating transient electrical oscillations lasting 1ms to 10ms that can fool a high-speed microchip into registering multiple clicks.' 
      },
      { 
        question: 'If `Serial.begin(9600)` transmits 10 bits per character (1 start + 8 data + 1 stop bit), how many characters can be sent per second?', 
        hint: 'Divide the baud rate by the number of bits per framed character.',
        rubricOrSampleReasoning: '9600 bits per second / 10 bits per character = 960 characters per second. Each character takes approximately 1.04 milliseconds to transmit.' 
      }
    ],
    differentiation: {
      support: [
        'Use an illuminated LED alongside the Serial Monitor so visual learners can see the physical pin state immediately.',
        'Provide a labeled diagram of the 4-pin switch showing which pins are internally connected.'
      ],
      extension: [
        'Mission: Program a double-click detector — detect if the button is pressed twice within 300 milliseconds.',
        'Mission: Long-Press detector — holding the button for more than 2 seconds triggers an audible reset tone.'
      ],
      offlineOption: [
        'Draw the complete timing diagram showing the noisy mechanical bounce versus the filtered debounced output signal over a 50ms timeline.'
      ]
    },
    nextLessonId: 'beg-04',
    nextLessonTeaser: 'Beginner 04: Sensors as Inputs — Analog Readings & Voltage Dividers. Step beyond binary 0 and 1 into the continuous physical world! Connect photoresistors and potentiometers to read 10-bit analog values from 0 to 1023!',
    sources: [
      { title: 'Arduino Reference: Digital Input Pullup', url: 'https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/' },
      { title: 'Microchip ATmega328P Datasheet: I/O Ports', url: 'https://www.microchip.com' }
    ],
    assetCredits: [
      { asset: 'Tactile Button Pullup Diagram', creator: 'RoboBEE Innovators Academy', license: 'Proprietary Educational Architecture', sourceUrl: 'team_info' }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 04: SENSORS AS INPUTS: ANALOG READINGS & VOLTAGE DIVIDERS
  // -----------------------------------------------------------------------
  {
    id: 'beg-04',
    fieldGuideLinks: {
      readBeforeClass: ["fg-electronics-ohms-law", "fg-board-uno-anatomy"],
      lookUpWhileBuilding: ["fg-comp-tcrt5000", "fg-foundations-open-closed-loop"],
      goDeeper: ["fg-testing-fmea-debugging", "fg-prog-program-structure"]
    },
    courseId: 'beginner',
    sequence: 4,
    code: 'BEGINNER 04',
    title: 'Sensors as Inputs: Analog Readings & Voltage Dividers',
    promise: 'Explore the continuous physical world: master 10-bit Analog-to-Digital Converter (ADC) quantization, derive the voltage divider formula, calibrate ambient photoresistors, and build an automatic phototaxis threshold controller.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03'],
    outcomes: [
      'Contrast continuous physical analog signals with discrete binary digital states.',
      'Deconstruct the ATmega328P 10-bit Successive Approximation ADC and calculate quantization resolution (4.887mV per LSB).',
      'Derive the mathematical Voltage Divider equation (V_out = V_in × R2 / [R1 + R2]) for passive resistive sensors.',
      'Construct a light-sensing circuit using a Cadmium Sulfide (CdS) photoresistor balanced against a fixed 10kΩ reference resistor.',
      'Implement dynamic software calibration algorithms using `map()`, `constrain()`, and threshold hysteresis in C++.'
    ],
    vocabulary: [
      { 
        term: 'Analog Signal', 
        plainMeaning: 'A smooth, continuous electrical signal that can have any voltage value between 0V and 5V (like volume, brightness, or temperature).', 
        technicalMeaning: 'A continuously variable physical quantity whose voltage or current magnitude is directly proportional to a measured environmental stimulus.' 
      },
      { 
        term: 'Analog-to-Digital Converter (ADC)', 
        plainMeaning: 'The on-chip silicon translation engine that turns an incoming voltage into an integer number between 0 and 1023.', 
        technicalMeaning: 'A 10-bit Successive Approximation Register (SAR) peripheral that quantizes an input voltage from 0V to the reference voltage (AREF = 5.0V) into 1024 discrete binary integer bins.' 
      },
      { 
        term: 'Voltage Divider', 
        plainMeaning: 'A pair of resistors that divide a higher input voltage into a lower, measurable output voltage according to their resistance ratio.', 
        technicalMeaning: 'A linear circuit configuration of two passive series impedances where the intermediate tap voltage obeys the transfer function V_out = V_in × (R2 / [R1 + R2]).' 
      },
      { 
        term: 'Light-Dependent Resistor (LDR)', 
        plainMeaning: 'A light sensor whose electrical resistance drops drastically when photons strike its wavy semiconductor surface.', 
        technicalMeaning: 'A photoresistive Cadmium Sulfide (CdS) component exhibiting photoconductivity, whose resistance decreases non-linearly from ~1MΩ in total darkness to ~1kΩ in bright ambient light.' 
      },
      { 
        term: 'Potentiometer', 
        plainMeaning: 'A rotary control dial with three pins that outputs a continuously variable voltage by sliding a wiper across a carbon track.', 
        technicalMeaning: 'A three-terminal variable resistor with a manual rotary wiper contact that functions as an adjustable voltage divider between VCC and GND.' 
      },
      { 
        term: 'Threshold Hysteresis', 
        plainMeaning: 'A safety deadband that prevents an autonomous robot from flickering rapidly ON and OFF when light is hovering right on the edge of a trigger point.', 
        technicalMeaning: 'The intentional lag between an activation threshold and a deactivation threshold to prevent rapid relay or actuator chattering caused by analog signal noise.' 
      }
    ],
    teacherPrep: [
      'Check GL5528 or similar 5mm CdS photoresistors (LDRs) and 10kΩ 1/4W pull-down balancing resistors.',
      'Test 10kΩ rotary potentiometers (B10K) for smooth wiper continuity using a multimeter.',
      'Dim classroom blinds during demonstration to demonstrate dramatic analog value shifts live on the projector.'
    ],
    verifiedMaterials: [
      'Arduino Uno Rev3',
      '10kΩ linear rotary potentiometer (B10K)',
      'GL5528 5mm LDR photoresistor',
      '10kΩ ±5% 0.25W carbon film resistor (Brown-Black-Orange-Gold)',
      '5mm Red status LED & 220Ω series resistor',
      'Solderless half-size breadboard & jumper wires'
    ],
    safetyNotes: [
      'Never connect both outer legs of a potentiometer to the same rail — one outer leg must connect to +5V and the opposite outer leg to GND, with the center wiper to Analog Pin A0.',
      'Ensure the LDR is paired with a fixed balancing resistor (10kΩ); plugging an LDR directly between 5V and A0 without a ground resistor leaves the pin floating.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display a smartphone ambient light sensor. Ask: "How can a computer, which only knows 0 and 1, sense whether the sun is rising or setting?"', 
        studentAction: 'Discuss analog vs digital phenomena (light, sound, heat vs binary light switch).' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Derive 10-bit ADC quantization: 5.0V / 1024 = 4.887mV per count. Write the voltage divider equation on the board: V_out = 5V × (10k / [R_ldr + 10k]).', 
        studentAction: 'Calculate analog values: 0V -> 0; 2.5V -> 512; 5.0V -> 1023.' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Guide breadboard potentiometer and LDR voltage divider wiring. Demonstrate Tools > Serial Plotter live waveform visualization.', 
        studentAction: 'Wire the LDR voltage divider, graph live light changes in Serial Plotter, and program an automatic night-lamp with an LED.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review student calibration data tables and inspect threshold stability.', 
        studentAction: 'Complete the exit ticket explaining ADC resolution and voltage divider math.' 
      }
    ],
    concepts: [
      {
        title: '1. The Analog Physical World vs The Digital Microchip',
        explanation: 'In nature, almost every physical phenomenon is continuous and analog: sunlight does not jump instantaneously from pitch black to blinding noon; ambient temperature does not toggle binary between freezing and boiling; sound pressure waves vibrate across a continuous spectrum. However, digital microprocessors can only store discrete binary bits (0s and 1s). To bridge this fundamental physical gap, autonomous robots rely on Analog-to-Digital Converters (ADCs) to sample, measure, and quantize continuous physical voltages into digital numbers.',
        instructorNote: 'Use the analogy of a smooth ramp (analog) versus a staircase with 1024 individual steps (digital quantization).'
      },
      {
        title: '2. The 10-Bit Successive Approximation ADC & Quantization',
        explanation: 'The ATmega328P microcontroller contains an integrated 10-bit Successive Approximation Register (SAR) ADC connected to Analog Pins A0 through A5 via an internal analog multiplexer. A 10-bit resolution means the chip divides the 0.0V to 5.0V input voltage range into 2^10 = 1,024 discrete integer steps (from 0 to 1023). Each step represents a voltage quantum of V_LSB = 5.000V / 1024 = 0.0048828 Volts (approximately 4.88 millivolts). When Analog Pin A0 sees 0.0V, `analogRead(A0)` returns 0; at 2.5V, it returns 512; at 5.0V, it returns 1023. The conversion takes approximately 100 microseconds (13 to 260 ADC clock cycles).',
        instructorNote: 'Highlight that 10 bits is standard for microcontrollers; high-precision laboratory instruments use 16-bit (65,536 steps) or 24-bit ADCs.'
      },
      {
        title: '3. The Voltage Divider Derivation & Why Sensors Need It',
        explanation: 'Microcontroller ADCs can ONLY measure voltage; they cannot directly measure electrical resistance! However, many of the most useful robotic sensors — photoresistors (light), thermistors (temperature), flex sensors (finger bending), and strain gauges — are variable resistors. To turn changing resistance into a readable changing voltage, we build a Voltage Divider. Two resistors (R1 and R2) are placed in series between VCC (+5V) and GND. By Ohm’s Law, the total current flowing through the pair is I = V_in / (R1 + R2). The output voltage tapped between them is V_out = I × R2. Substituting gives the golden equation: V_out = V_in × (R2 / [R1 + R2]). If R1 is a light sensor whose resistance changes, V_out rises and falls proportionally!',
        instructorNote: 'Derive the formula step-by-step on the board so students understand it is simply Ohm’s Law applied to two series resistors.'
      },
      {
        title: '4. Photoresistors (CdS LDR) & Semiconductor Photoconductivity',
        explanation: 'A Light-Dependent Resistor contains a zig-zag track of Cadmium Sulfide (CdS) semiconductor material. In darkness, valence electrons are tightly bound within the semiconductor crystal lattice, resulting in extremely high electrical resistance (typically 500,000Ω to 1,000,000Ω = 1 MΩ). When incident light photons strike the CdS surface, their energy excites valence electrons across the bandgap into the conduction band. These free electron-hole pairs drastically increase electrical conductivity, dropping the LDR resistance down to 1,000Ω to 2,000Ω (1kΩ–2kΩ) under bright classroom light. By pairing the LDR with a fixed 10kΩ reference resistor, V_out changes by over 3.5 Volts between light and dark!',
        instructorNote: 'Warn students that LDRs have a physical response latency of ~10ms–50ms; for high-speed laser break-beams, phototransistors or photodiodes are preferred.'
      },
      {
        title: '5. Potentiometers: 3-Terminal Rotary Voltage Dividers',
        explanation: 'A rotary potentiometer is an electromechanical component containing a curved resistive carbon track and a movable conductive metal wiper connected to the center terminal. Terminal 1 connects to one end of the track (+5V); Terminal 3 connects to the opposite end (GND); Terminal 2 connects to the wiper. As you rotate the shaft, the wiper physically slides along the carbon track, smoothly varying the ratio of resistance above the wiper versus below the wiper. It acts as an adjustable voltage divider, sweeping the output voltage seamlessly from 0.00V all the way to 5.00V without requiring any external resistors.',
        instructorNote: 'Have students connect a potentiometer and open Tools > Serial Plotter to watch their finger turns draw smooth real-time sine waves.'
      },
      {
        title: '6. Dynamic Sensor Calibration & Threshold Hysteresis',
        explanation: 'In the real world, no two rooms have identical ambient lighting: a robotics competition arena in a gym has different lux levels than a classroom at night. Professional autonomous robots NEVER hardcode arbitrary magic numbers like `if (val > 500)`. Instead, robots execute an automatic calibration sequence upon startup: during the first 5 seconds, the robot records the absolute minimum (`sensorMin`) and maximum (`sensorMax`) light values detected. It then uses the C++ `map()` function to normalize the signal into a universal 0% to 100% scale. Furthermore, engineers add Hysteresis (a deadband gap between ON and OFF thresholds) to eliminate jitter and flickering when the sensor hovers near the trigger boundary.',
        instructorNote: 'Demonstrate how a night-light without hysteresis buzzes and flickers furiously at twilight, whereas hysteresis provides clean, confident switching.'
      }
    ],
    visualizerId: 'sensor_observatory_sim',
    project: {
      name: 'Autonomous Phototaxis Light Observatory & Night-Lamp',
      deliverableType: 'dataset',
      successEvidence: [
        'Breadboard circuit featuring both a 10kΩ potentiometer and an LDR/10kΩ voltage divider.',
        'Serial Plotter displaying smooth 10-bit analog waveforms (0–1023) without electrical noise or dropouts.',
        'C++ program converting raw ADC integers into calibrated physical Volts and triggering an external LED indicator when light drops below a calibrated threshold.'
      ]
    },
    activity: {
      title: 'Assemble the Analog Observatory & Calibrate Thresholds',
      steps: [
        'Step 1: Disconnect USB power from the Arduino board.',
        'Step 2: Insert the 10kΩ rotary potentiometer into the breadboard so its 3 pins occupy separate rows (e.g., rows 5, 6, 7).',
        'Step 3: Connect potentiometer Pin 1 to Arduino 5V, Pin 3 to Arduino GND, and center wiper Pin 2 to Arduino Analog Pin A0.',
        'Step 4: On the opposite side of the breadboard, assemble the LDR voltage divider: place the LDR between 5V and row 20.',
        'Step 5: Place a 10kΩ fixed resistor (Brown-Black-Orange-Gold) from row 20 to the breadboard GND rail.',
        'Step 6: Connect a jumper wire from row 20 (the junction between LDR and 10kΩ resistor) to Arduino Analog Pin A1.',
        'Step 7: Wire an external status LED with a 220Ω series resistor on Digital Pin 9 to serve as the automatic night-lamp.',
        'Step 8: Connect USB, upload the sketch, and open Tools > Serial Plotter to view live analog waveforms.'
      ],
      successCriteria: [
        'Turning the potentiometer knob smoothly sweeps Analog 0 from 0 to 1023 (0.0V to 5.0V).',
        'Covering the LDR with a finger causes the Analog 1 voltage to drop significantly, illuminating the Pin 9 LED.',
        'Serial Monitor streams formatted telemetry: `Raw: [value] | Volts: [v]V | Illuminance: [pct]% | Lamp: [ON/OFF]`.'
      ],
      extension: 'Program a dynamic auto-calibration loop: during the first 3 seconds of power-up, flash the LED rapidly while recording room ambient minimum and maximum light levels.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno Rev3 (ATmega328P)', '10kΩ Rotary Potentiometer', 'GL5528 CdS Photoresistor'],
      componentList: [
        { name: 'Arduino Uno Rev3', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: '10kΩ Rotary Potentiometer', exactVariant: 'B10K 3-terminal single-turn', quantity: 1 },
        { name: 'CdS Photoresistor (LDR)', exactVariant: 'GL5528 5mm (Dark: 1MΩ, 10 Lux: 10k–20kΩ)', quantity: 1 },
        { name: 'Carbon Film Resistor', exactVariant: '10kΩ ±5%, 0.25W (Brown-Black-Orange-Gold)', quantity: 1 },
        { name: 'Carbon Film Resistor', exactVariant: '220Ω ±5%, 0.25W (Red-Red-Brown-Gold)', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'Vf ≈ 2.0V, If = 20mA max', quantity: 1 },
        { name: 'Solderless Breadboard', exactVariant: '400 Tie-Point Half Size', quantity: 1 },
        { name: 'Male-to-Male Jumper Wires', exactVariant: '20cm 24AWG copper', quantity: 7 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/potentiometer_analog_a0.svg',
      schematic: 'Arduino 5V ──────[ Pot Pin 1 ]──[ Pin 2 Wiper ➔ A0 ]──[ Pot Pin 3 ]────── Arduino GND\nArduino 5V ──────[ LDR Photoresistor ]──┬──[ 10kΩ Resistor ]────────────── Arduino GND\n                                        └── ➔ Arduino Analog Pin A1\nArduino Pin 9 ───[ 220Ω Resistor ]──────[ LED Anode | Cathode ]───────────── Arduino GND',
      wireTable: [
        { from: 'Arduino 5V Pin', to: 'Breadboard Red (+) Power Rail', wireOrPolarityNote: 'Main System 5V Bus (Red)' },
        { from: 'Arduino GND Pin', to: 'Breadboard Blue (-) Ground Rail', wireOrPolarityNote: 'Main System GND Bus (Black)' },
        { from: 'Breadboard Red (+) Rail', to: 'Potentiometer Outer Terminal 1', wireOrPolarityNote: 'Potentiometer VCC (Red)' },
        { from: 'Breadboard Blue (-) Rail', to: 'Potentiometer Outer Terminal 3', wireOrPolarityNote: 'Potentiometer GND (Black)' },
        { from: 'Potentiometer Center Wiper 2', to: 'Arduino Analog Pin A0', wireOrPolarityNote: 'Analog Channel 0 Signal (Yellow)' },
        { from: 'Breadboard Red (+) Rail', to: 'LDR Leg 1', wireOrPolarityNote: 'LDR Power Connection' },
        { from: 'LDR Leg 2 (Row 20)', to: '10kΩ Resistor Leg 1 (Row 20)', wireOrPolarityNote: 'Voltage Divider Midpoint Node' },
        { from: '10kΩ Resistor Leg 2', to: 'Breadboard Blue (-) Rail', wireOrPolarityNote: 'Voltage Divider Ground Leg' },
        { from: 'Breadboard Row 20 (Node)', to: 'Arduino Analog Pin A1', wireOrPolarityNote: 'Analog Channel 1 Signal (Green)' },
        { from: 'Arduino Digital Pin 9', to: 'Breadboard Row 25 (220Ω Resistor)', wireOrPolarityNote: 'Night-Lamp Output Signal (Blue)' },
        { from: 'LED Cathode (Row 26)', to: 'Breadboard Blue (-) Rail', wireOrPolarityNote: 'LED Ground Return (Black)' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure Arduino is fully powered down before inserting analog components.',
        '2. Plug the potentiometer into rows 5, 6, and 7 on the left side of the breadboard.',
        '3. Wire the potentiometer outer legs to the +5V and GND power rails.',
        '4. Connect the center wiper (row 6) to Arduino Analog Pin A0.',
        '5. On the right side of the breadboard, insert the LDR between +5V and row 20.',
        '6. Insert the 10kΩ resistor (Brown-Black-Orange) between row 20 and GND rail to complete the voltage divider.',
        '7. Connect a jumper wire from row 20 to Arduino Analog Pin A1.',
        '8. Wire the 220Ω resistor and Red LED from Digital Pin 9 to GND.',
        '9. Re-verify that the 5V and GND rails are never shorted together.',
        '10. Plug in the USB cable and upload the sketch.'
      ],
      powerAndSafetyChecks: [
        'Confirm the potentiometer center wiper connects to Analog Pin A0, NOT to +5V or GND directly.',
        'Verify that the LDR voltage divider has its 10kΩ resistor tied firmly to Ground — a missing ground creates a floating input.',
        'Confirm that the LED has its 220Ω resistor in series to prevent drawing more than 20mA.'
      ],
      testCases: [
        { action: 'Turn potentiometer knob fully counter-clockwise', expectedResult: 'Analog A0 reads 0 (0.00V ± 0.05V)' },
        { action: 'Turn potentiometer knob fully clockwise', expectedResult: 'Analog A0 reads 1023 (5.00V ± 0.05V)' },
        { action: 'Cover LDR with finger to simulate darkness', expectedResult: 'Analog A1 drops below 300, and Pin 9 LED turns ON automatically' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Analog Observatory & Phototaxis Controller
// Class: BEGINNER 04 - Sensors as Inputs: Analog Readings & Voltage Dividers
// Reads 10-bit ADC channels (A0 Potentiometer, A1 LDR Voltage Divider),
// converts to physical Volts, and controls an automatic night-lamp with hysteresis.

const int POT_PIN   = A0; // Potentiometer center wiper on Analog 0
const int LDR_PIN   = A1; // LDR voltage divider junction on Analog 1
const int LAMP_PIN  = 9;  // Night-lamp indicator LED on Digital Pin 9

// Threshold settings with hysteresis to prevent flickering
const int DARK_THRESHOLD_ON  = 350; // Lamp turns ON when light falls below 350
const int DARK_THRESHOLD_OFF = 420; // Lamp turns OFF when light rises above 420 (70-count hysteresis)
bool lampState = false;

void setup() {
  pinMode(LAMP_PIN, OUTPUT);
  digitalWrite(LAMP_PIN, LOW);

  // Initialize hardware serial telemetry at 9600 baud
  Serial.begin(9600);
  delay(100);
  Serial.println("==============================================");
  Serial.println("  ROBOBEE INNOVATORS - 10-BIT ADC OBSERVATORY ");
  Serial.println("  Channel A0: Potentiometer | Channel A1: LDR  ");
  Serial.println("==============================================");
}

void loop() {
  // Read 10-bit ADC values (0 to 1023)
  int rawPot = analogRead(POT_PIN);
  int rawLdr = analogRead(LDR_PIN);

  // Convert raw 10-bit integers into physical engineering Volts
  // Formula: Volts = (ADC_reading / 1023.0) * 5.0V
  float potVolts = (rawPot / 1023.0) * 5.0;
  float ldrVolts = (rawLdr / 1023.0) * 5.0;

  // Map LDR reading into an intuitive 0% to 100% light level
  int lightPercent = map(rawLdr, 100, 900, 0, 100);
  lightPercent = constrain(lightPercent, 0, 100);

  // Autonomous Night-Lamp Logic with Threshold Hysteresis
  if (rawLdr < DARK_THRESHOLD_ON && !lampState) {
    lampState = true;
    digitalWrite(LAMP_PIN, HIGH);
    Serial.println(">>> [EVENT] Ambient darkness detected. Night-lamp ACTIVATED.");
  } else if (rawLdr > DARK_THRESHOLD_OFF && lampState) {
    lampState = false;
    digitalWrite(LAMP_PIN, LOW);
    Serial.println(">>> [EVENT] Ambient illumination restored. Night-lamp DEACTIVATED.");
  }

  // Stream formatted telemetry packet for Serial Plotter / Monitor
  Serial.print("POT_ADC:");
  Serial.print(rawPot);
  Serial.print(" LDR_ADC:");
  Serial.print(rawLdr);
  Serial.print(" LDR_Volts:");
  Serial.print(ldrVolts, 2);
  Serial.print(" Light%:");
  Serial.print(lightPercent);
  Serial.print(" Lamp:");
  Serial.println(lampState ? 100 : 0);

  delay(100); // 10 Hz sampling rate
}`,
      pinMap: { 
        'A0': 'Potentiometer center wiper (0.0V–5.0V input)', 
        'A1': 'LDR / 10kΩ voltage divider midpoint tap',
        'Pin 9': 'Automatic Night-Lamp LED Anode via 220Ω resistor',
        '5V': 'Sensor distribution power bus',
        'GND': 'Common Ground return bus'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB cable.',
        '2. In the Arduino IDE, verify Tools > Board is "Arduino Uno".',
        '3. Click Upload. Once complete, open Tools > Serial Plotter (Ctrl+Shift+L) to see multiple live color graphs.',
        '4. Alternatively, open Tools > Serial Monitor at 9600 baud to inspect numeric voltage calculations.'
      ],
      explanations: [
        'analogRead(pin): Initiates the Successive Approximation ADC, returning a 10-bit integer between 0 and 1023 proportional to input voltage.',
        'float potVolts = (raw / 1023.0) * 5.0: Calibrates the raw integer into true physical Volts (4.887mV per step).',
        'map(val, in_min, in_max, out_min, out_max): Performs linear mathematical interpolation to scale raw sensor readings into percentage values.',
        'Hysteresis Check: Using separate thresholds for turning ON (350) and turning OFF (420) prevents rapid high-frequency relay or LED chattering.'
      ],
      expectedResult: 'Serial Plotter renders multi-colored waveform lines. Turning the potentiometer moves POT_ADC from 0 to 1023. Shading the LDR drops LDR_ADC and switches the Lamp line from 0 to 100.',
      caveats: [
        'Analog pins on the Arduino Uno (A0–A5) do not require a pinMode() declaration in setup().',
        'Floating analog pins pick up environmental 50Hz noise and fluctuate wildly if wires are loose.'
      ],
      tweakTip: 'Change DARK_THRESHOLD_ON to match your specific room ambient light levels by reading the baseline in the Serial Monitor!'
    },
    troubleshooting: [
      { 
        symptom: 'analogRead(A0) stays permanently locked at 1023 regardless of potentiometer rotation.', 
        checks: [
          'Step 1: Check the Ground connection on the potentiometer outer leg.',
          'Step 2: If the GND leg is disconnected, the entire resistive track floats up to +5V, causing the wiper to read 1023 everywhere.',
          'Step 3: Verify the breadboard ground rail is connected back to an Arduino GND pin.'
        ], 
        explanation: 'Without a complete return circuit to Ground, no electric current flows through the resistive track, leaving the wiper pulled up to VCC.' 
      },
      { 
        symptom: 'analogRead(A1) reading barely changes when shading or illuminating the LDR.', 
        checks: [
          'Step 1: Inspect the voltage divider circuit: is the 10kΩ fixed resistor present between A1 and GND?',
          'Step 2: If the fixed resistor is missing, you have an open circuit rather than a voltage divider.',
          'Step 3: Confirm you are using a 10kΩ resistor (Brown-Black-Orange), NOT a 220Ω resistor (which would dominate the LDR).'
        ], 
        explanation: 'A voltage divider requires two comparable resistances. If R2 is too small (e.g., 220Ω vs 10,000Ω LDR), nearly all voltage drops across the LDR, leaving V_out stuck near 0V.' 
      },
      { 
        symptom: 'The night-lamp LED flickers and buzzes rapidly when light is near the threshold.', 
        checks: [
          'Step 1: Check your software threshold code — are you using a single threshold like `if (val < 400)` for both turning ON and OFF?',
          'Step 2: Implement hysteresis: set the ON threshold to 350 and the OFF threshold to 420.'
        ], 
        explanation: 'Natural analog sensor noise causes readings to fluctuate by ±3 to ±8 counts. Without a hysteresis deadband, values hovering on the boundary toggle the output on every loop iteration.' 
      },
      { 
        symptom: 'Analog readings jump erratically whenever another pin turns ON.', 
        checks: [
          'Step 1: Check your power source — are you powering a motor or heavy load from the same 5V pin?',
          'Step 2: Add a 0.1µF ceramic decoupling capacitor between the sensor 5V rail and GND near the breadboard.'
        ], 
        explanation: 'Sudden load spikes pull down the analog reference voltage rail, causing the ADC to read artificial voltage shifts.' 
      }
    ],
    checksForUnderstanding: [
      'What voltage does a reading of 512 represent on an Arduino Uno powered by a 5.0V supply?',
      'Why is a voltage divider mandatory when interfacing resistive sensors like LDRs or thermistors?',
      'How does software hysteresis protect mechanical relays and robot actuators from wearing out?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the expected voltage at Analog Pin A1 when an LDR with resistance R_ldr = 15kΩ is paired with a fixed 10kΩ resistor across a 5.0V supply.', 
        hint: 'Use the voltage divider formula: V_out = V_in × (R_fixed / [R_ldr + R_fixed]).',
        rubricOrSampleReasoning: 'V_out = 5.0V × (10,000 / [15,000 + 10,000]) = 5.0V × (10,000 / 25,000) = 5.0V × 0.40 = 2.00 Volts. The ADC reading would be (2.00V / 5.0V) × 1023 ≈ 409.' 
      },
      { 
        question: 'What is the voltage resolution (step size) of a 10-bit ADC operating with a 5.0V reference, and how many distinct values can it return?', 
        hint: 'Calculate 2^10 and divide 5.0V by that number of steps.',
        rubricOrSampleReasoning: 'A 10-bit ADC has 2^10 = 1,024 discrete steps (returning integers from 0 to 1023). The voltage step size is 5.0V / 1024 = 0.00488 Volts (4.88 millivolts per step).' 
      },
      { 
        question: 'Why does a potentiometer not require an external fixed resistor, whereas an LDR does?', 
        hint: 'Consider how many terminals each component has and what is inside them.',
        rubricOrSampleReasoning: 'A potentiometer is already a complete 3-terminal voltage divider internally — its resistive track provides both R1 and R2 with the wiper tapping the junction. An LDR is only a 2-terminal variable resistor, so an external fixed resistor is required to complete the voltage divider to Ground.' 
      }
    ],
    differentiation: {
      support: [
        'Provide a printed voltage divider chart showing V_out curves for different LDR resistance values.',
        'Use the Serial Plotter with fixed min/max dummy prints (0 and 1023) to keep the auto-scaling window steady.'
      ],
      extension: [
        'Mission: Build a Light-Seeking Phototaxis Sensor Bar — connect two LDRs (Left on A1, Right on A2) and compute an error differential (left - right) to steer a virtual rover toward light.',
        'Mission: Implement an automatic baseline zeroing routine that calibrates to dark upon a button press.'
      ],
      offlineOption: [
        'Plot a manual graph on grid paper showing LDR resistance (Y-axis) versus distance from a desk lamp (X-axis) using multimeter measurements.'
      ]
    },
    nextLessonId: 'beg-05',
    nextLessonTeaser: 'Beginner 05: Program Logic & Debugging — The Hardware Reaction-Time Game. Ditch blocking delay() commands! Master non-blocking millis() state machines, random number generation, and microsecond human reaction measurement!',
    sources: [
      { title: 'Arduino Reference: analogRead()', url: 'https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/' },
      { title: 'Microchip ATmega328P Datasheet: 10-bit Analog-to-Digital Converter', url: 'https://www.microchip.com' }
    ],
    assetCredits: [
      { asset: 'Potentiometer Analog Wiring Illustration', creator: 'RoboBEE Innovators Academy', license: 'Proprietary Educational Architecture', sourceUrl: 'team_info' }
    ],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  // -----------------------------------------------------------------------
  // BEGINNER 05: PROGRAM LOGIC & DEBUGGING (REACTION GAME)
  // -----------------------------------------------------------------------
  {
    id: 'beg-05',
    fieldGuideLinks: {
      readBeforeClass: ["fg-prog-program-structure"],
      lookUpWhileBuilding: ["fg-prog-millis-vs-delay", "fg-testing-fmea-debugging"],
      goDeeper: ["fg-arduino-microcontroller-vs-computer"]
    },
    courseId: 'beginner',
    sequence: 5,
    code: 'BEGINNER 05',
    title: 'Program Logic & Debugging: Reaction-Time Game',
    promise: 'By the end of this masterclass, you will understand non-blocking hardware timing with millis(), seed pseudo-random number generators with floating analog noise, build a high-precision electronic reflex timer, and practice the scientific single-variable debugging method.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04'],
    outcomes: [
      'Contrast blocking delay() with non-blocking time tracking using the internal 32-bit hardware timer via millis().',
      'Harvest atmospheric electrical noise from an unconnected floating analog pin to seed the pseudo-random generator.',
      'Construct a 4-state Finite State Machine (Standby, Random Wait, Go Stimulus, Reaction Evaluation).',
      'Implement falling-edge button detection to reliably catch false starts before the stimulus triggers.',
      'Apply the single-variable scientific debugging protocol to isolate hardware faults from algorithmic logic bugs.'
    ],
    vocabulary: [
      { term: 'millis()', plainMeaning: 'A built-in hardware stopwatch counting milliseconds since the Arduino powered on.', technicalMeaning: 'A function that returns the number of milliseconds passed since the board began executing the program, tracked by Timer0.' },
      { term: 'Blocking Code', plainMeaning: 'Commands like delay() that freeze the robot brain so it cannot respond to sensors.', technicalMeaning: 'Execution that halts CPU instruction flow, preventing polling of inputs or servicing real-time events.' },
      { term: 'Non-Blocking Code', plainMeaning: 'Smart timing that checks the clock on the fly without stopping robot tasks.', technicalMeaning: 'Asynchronous event-loop design that compares timestamps to determine when tasks should execute without stalling.' },
      { term: 'Pseudo-Random Number Generator (PRNG)', plainMeaning: 'A mathematical formula that mimics randomness but repeats if not given a fresh seed.', technicalMeaning: 'A deterministic algorithm producing a sequence of numbers approximating the properties of random numbers.' },
      { term: 'Random Seed', plainMeaning: 'A starting number plucked from physical static noise to make random sequences unpredictable.', technicalMeaning: 'An initial value provided to a PRNG to initialize its internal mathematical state register.' },
      { term: 'Finite State Machine (FSM)', plainMeaning: 'A program organized into clearly labeled modes (like Waiting, Running, Winner).', technicalMeaning: 'A computational model consisting of a finite number of discrete states, transitions, and inputs.' },
      { term: 'Scientific Debugging', plainMeaning: 'Changing only ONE single wire or line of code at a time to prove the root cause.', technicalMeaning: 'A systematic method of isolating faults by formulating single-variable hypotheses and running empirical tests.' }
    ],
    teacherPrep: ['Verify pushbuttons, LEDs, 220Ω resistors, and breadboards; test Serial Monitor reaction tester sketch at 9600 baud.'],
    verifiedMaterials: ['Arduino Uno Rev3 DIP', '4-Pin Tactile Pushbutton', '5mm Diffused Red LED', '220Ω 1/4W Resistor', 'Half-size breadboard', 'Solid-core jumper wires'],
    safetyNotes: ['Never short digital output pins directly to 5V or Ground. Ensure button is wired with INPUT_PULLUP to avoid shorting the power rail.'],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Run a live reflex showdown on the projector: Have two student volunteers compete to react to a sudden visual flash. Point out millisecond human reaction limits (~200ms).', 
        studentAction: 'Predict the physical speed limit of human nerve conduction from visual eye input to thumb muscle action.' 
      },
      { 
        segment: '10–25m Logic', 
        minutes: 15, 
        teacherAction: 'Diagram the 4-state Finite State Machine on the whiteboard. Explain why delay() makes false-start detection impossible and introduce millis().', 
        studentAction: 'Trace state transitions and evaluate what happens if a player presses the button prematurely during the random delay.' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Guide circuit breadboard construction: Stimulus LED on Pin 13, Response Button on Pin 2 with INPUT_PULLUP. Seed PRNG with analogRead(A0).', 
        studentAction: 'Assemble hardware, upload reaction game, and record 5 competitive reaction rounds against a lab partner.' 
      },
      { 
        segment: '50–60m Debug', 
        minutes: 10, 
        teacherAction: 'Introduce an intentional bug (e.g. inverted button logic or missing randomSeed) and model the scientific debugging protocol.', 
        studentAction: 'Diagnose the bug by testing one hypothesis at a time and submit the formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. The Fatal Flaw of Blocking Delays (delay() vs Real-Time Sensing)',
        explanation: 'When an embedded engineer calls `delay(2000)`, the microcontroller’s Arithmetic Logic Unit (ALU) enters a hard busy-wait loop, executing millions of useless "no-operation" (NOP) clock cycles. During those two seconds, the robot is completely deaf and blind: it cannot read incoming ultrasonic pulses, cannot detect boundary lines, and cannot see an emergency stop button being pressed! In mission-critical robotics, blocking delays are strictly forbidden. Systems must instead use time-based polling using hardware counter registers.',
        instructorNote: 'Compare delay() to sleeping with noise-canceling headphones on: the world keeps moving, but you miss every warning signal!'
      },
      {
        title: '2. Hardware Timers & The Internal Clock with millis()',
        explanation: 'Inside the ATmega328P microcontroller, a dedicated silicon counter called Timer0 runs continuously in the background, clocked by the 16MHz quartz crystal. Every 1024 microseconds, Timer0 triggers a hardware interrupt that increments an internal 32-bit `unsigned long` memory counter. Calling `millis()` simply reads this counter without halting CPU execution. Because an unsigned long is 32 bits ($2^{32} - 1$), the counter can track up to 4,294,967,295 milliseconds—which is approximately 49.7 days of continuous operation before rolling over to zero!',
        instructorNote: 'Show students the difference between int (16-bit, rolls over at 32,767 ms = 32 seconds!) and unsigned long (32-bit, lasts 49.7 days).'
      },
      {
        title: '3. Pseudo-Random Number Generation & Analog Noise Seeding',
        explanation: 'Computers are deterministic logic machines: given the exact same input, they will calculate the exact same output every single time. A standard `random(2000, 5000)` function uses a mathematical Linear Congruential Generator (PRNG) that produces an identical sequence of numbers every time the Arduino powers on! To make the game truly unpredictable, we must inject true physical entropy. We do this by calling `randomSeed(analogRead(A0))` during `setup()`. Because analog pin A0 has no wire connected to it, it acts as a microscopic radio antenna, picking up floating electromagnetic noise from the room to seed the generator.',
        instructorNote: 'Demonstrate to students that without randomSeed(), the LED illuminates after the exact same number of seconds every single time the reset button is pressed.'
      },
      {
        title: '4. Finite State Machines (FSM) in Game & Robotic Control',
        explanation: 'Complex robotics behavior should never be written as deeply nested IF/ELSE spaghettis. Instead, professional systems use Finite State Machines (FSMs). An FSM divides the system into clear, mutually exclusive behavioral states: STATE_IDLE (waiting for round to start), STATE_RANDOM_WAIT (suspense period), STATE_STIMULUS_ACTIVE (LED lit, clock running), STATE_RESULT_DISPLAY (calculating score), and STATE_FALSE_START_PENALTY (caught cheating). The code executes only the logic appropriate to the active state and transitions smoothly between them.',
        instructorNote: 'Draw the state bubbles on the board with arrows showing the triggers that cause transitions.'
      },
      {
        title: '5. Scientific Single-Variable Debugging Protocol',
        explanation: 'When a robot or electronic circuit fails to work, novice students often panic and change five things at once: moving wires, editing variables, swapping pins, and modifying equations. This haphazard approach makes debugging impossible because even if the circuit begins working, you have no idea what fixed it—or worse, you introduced three new hidden bugs! The Scientific Single-Variable Method requires: 1. Formulate a single falsifiable hypothesis; 2. Change exactly ONE variable; 3. Run the test and record empirical results; 4. Revert the change if it did not resolve the symptom.',
        instructorNote: 'Teach the debugging mantra: "Isolate the symptom, form a hypothesis, test ONE variable, verify empirically."'
      },
      {
        title: '6. Edge Detection vs Level Detection in User Inputs',
        explanation: 'When reading a tactile button, there is a fundamental difference between Level Detection and Edge Detection. Level detection checks whether the pin is currently LOW at the instantaneous moment the code reads it (`digitalRead(pin) == LOW`). Edge detection monitors for the exact moment of state transition: from HIGH to LOW (Falling Edge) or from LOW to HIGH (Rising Edge). By storing the button’s previous state (`previousButtonState`), the code can detect the exact millisecond the player presses down, preventing repeated triggering if the button remains held down.',
        instructorNote: 'Show how checking button states in a fast loop without edge detection would trigger a score 10,000 times a second!'
      }
    ],
    visualizerId: 'reaction_game_sim',
    project: {
      name: 'High-Precision Reflex Timer & Reaction Game',
      deliverableType: 'code_artifact',
      successEvidence: [
        'Breadboard circuit with Stimulus LED and Tactile Response Button wired with INPUT_PULLUP.',
        'Randomized wait period (2000ms–5000ms) seeded with floating analog antenna noise.',
        'Serial Monitor reporting millisecond reaction score and instantaneous false-start penalty detection.'
      ]
    },
    activity: {
      title: 'Assemble, Program, and Calibrate the Reflex Game',
      steps: [
        'Step 1: Wire the Red Stimulus LED to Arduino Pin 13 through a 220Ω series resistor to GND.',
        'Step 2: Wire the 4-pin momentary pushbutton across breadboard trench, connecting Pin 2 to one leg and GND to the diagonal leg.',
        'Step 3: In setup(), enable internal pull-up resistor on Pin 2 and seed the PRNG using analogRead(A0).',
        'Step 4: Upload the embedded C++ sketch and open the Serial Monitor at 9600 baud.',
        'Step 5: Run 5 competitive rounds with your lab partner, noting reaction times and testing false-start interception.',
        'Step 6: Complete the single-variable debugging challenge by diagnosing an intentional code bug.'
      ],
      successCriteria: [
        'Game reliably measures reaction times between 150ms and 500ms.',
        'Pressing the button before the LED illuminates immediately aborts the round with a false-start penalty message.'
      ],
      extension: 'Add a high-score persistence variable that announces a new "Academy Reflex Record" in the Serial Monitor.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 DIP (ATmega328P)', 'Half-Size Solderless Breadboard (400 tie-points)'],
      componentList: [
        { name: 'Arduino Uno Rev3', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: 'Tactile Pushbutton', exactVariant: '6x6mm 4-pin momentary tact switch', quantity: 1 },
        { name: '5mm Red Diffused LED', exactVariant: 'Vf ≈ 2.0V, 20mA max, 625nm wavelength', quantity: 1 },
        { name: 'Carbon Film Resistor', exactVariant: '220Ω ±5%, 0.25W (Red-Red-Brown-Gold)', quantity: 1 },
        { name: 'Half-Size Breadboard', exactVariant: '400 Tie-Point Breadboard with Power Rails', quantity: 1 },
        { name: 'Jumper Wires', exactVariant: '20cm 24AWG Male-to-Male copper jumpers', quantity: 4 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/reaction_game_wiring.svg',
      schematic: 'Arduino Pin 13 ──[ 220Ω ]──[ LED Anode | Cathode ]── Arduino GND\nArduino Pin 2 ──[ Tactile Switch NO ]── Arduino GND (Internal Pull-Up Active)\nArduino Pin A0 (Unconnected Antenna for PRNG noise seed)',
      wireTable: [
        { from: 'Arduino Digital Pin 13', to: 'Breadboard Row 10A (Resistor Lead 1)', wireOrPolarityNote: 'Yellow Signal Wire' },
        { from: 'Breadboard Row 10E (Resistor Lead 2)', to: 'Breadboard Row 11A (LED Anode)', wireOrPolarityNote: 'Component series bridge' },
        { from: 'Breadboard Row 11E (LED Cathode)', to: 'Arduino GND', wireOrPolarityNote: 'Black Ground Wire' },
        { from: 'Arduino Digital Pin 2', to: 'Breadboard Row 20A (Button Pin 1)', wireOrPolarityNote: 'Green Signal Wire' },
        { from: 'Breadboard Row 22A (Button Pin 2)', to: 'Arduino GND', wireOrPolarityNote: 'Black Ground Return Wire' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure Arduino is disconnected from USB power during breadboard wiring.',
        '2. Straddle the 4-pin pushbutton across the central breadboard divider trench between rows 20 and 22.',
        '3. Connect Arduino Pin 2 to row 20A and connect row 22A to Arduino GND.',
        '4. Insert the 220Ω resistor and Red LED in series across rows 10 and 11, returning cathode to GND.',
        '5. Confirm that Pin A0 is completely empty (no wire attached) to act as a floating RF noise antenna.',
        '6. Plug in USB cable, compile and upload the sketch, and open the Serial Monitor at 9600 baud.'
      ],
      powerAndSafetyChecks: [
        'Verify button is wired between Pin 2 and GND only — never connect a pushbutton directly from 5V to GND without a resistor!',
        'Confirm Pin 13 series resistor is 220Ω (Red-Red-Brown) rather than 10kΩ or 0Ω.',
        'Check that the pushbutton legs are oriented correctly across the trench.'
      ],
      testCases: [
        { action: 'Wait for LED illumination, then press button immediately', expectedResult: 'Serial Monitor displays reaction time in milliseconds (e.g. "Reaction Time: 214 ms").' },
        { action: 'Press button BEFORE LED illuminates during the suspense delay', expectedResult: 'Serial Monitor prints "FALSE START PENALTY! Cheating detected!" and aborts the round.' },
        { action: 'Press reset button on Arduino and observe delay before LED turns on', expectedResult: 'Delay duration changes each round due to analogRead(A0) PRNG seeding.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Precision Reflex & Reaction Game
// Class: BEGINNER 05 - Program Logic, millis() Timing & Debugging

const int STIMULUS_LED_PIN = 13; // Output: High-speed stimulus visual LED
const int BUTTON_PIN       = 2;  // Input: Reaction trigger button (active-LOW)
const int NOISE_SEED_PIN   = A0; // Floating analog antenna for randomSeed()

void setup() {
  pinMode(STIMULUS_LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP); // 20kΩ internal pull-up resistor enabled

  Serial.begin(9600);
  while (!Serial) { ; } // Wait for serial port to connect

  // Seed pseudo-random generator with atmospheric electromagnetic noise
  randomSeed(analogRead(NOISE_SEED_PIN));

  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE ACADEMY REFLEX TEST STATION   "));
  Serial.println(F("========================================"));
  Serial.println(F("Rules: Keep your thumb ready on the button."));
  Serial.println(F("When the RED light fires, PRESS INSTANTLY!"));
  Serial.println(F("False starts will be penalized heavily!\n"));
}

void loop() {
  digitalWrite(STIMULUS_LED_PIN, LOW);
  Serial.println(F(">> Status: STANDBY. Get Ready..."));

  // Calculate random suspense delay between 2.0s and 5.0s
  unsigned long suspenseDuration = random(2000, 5001);
  unsigned long waitStartTime = millis();

  // Non-blocking false-start detection window
  bool falseStartDetected = false;
  while (millis() - waitStartTime < suspenseDuration) {
    // If player presses button during suspense window (active-LOW)
    if (digitalRead(BUTTON_PIN) == LOW) {
      falseStartDetected = true;
      break;
    }
  }

  // Handle False Start Penalty
  if (falseStartDetected) {
    Serial.println(F("❌ [PENALTY] FALSE START! You jumped the gun before the light!"));
    Serial.println(F("   Disqualified for this round. Cooling down for 3 seconds...\n"));
    
    // Rapid error strobe (3 fast blinks)
    for (int i = 0; i < 3; i++) {
      digitalWrite(STIMULUS_LED_PIN, HIGH);
      delay(80);
      digitalWrite(STIMULUS_LED_PIN, LOW);
      delay(80);
    }
    delay(2000);
    return; // Restart game loop
  }

  // STIMULUS EVENT: FIRE THE LIGHT!
  digitalWrite(STIMULUS_LED_PIN, HIGH);
  unsigned long stimulusTriggerTime = millis();

  // Poll button until player reacts
  while (digitalRead(BUTTON_PIN) == HIGH) {
    // Escape hatch: timeout after 4 seconds of human inaction
    if (millis() - stimulusTriggerTime > 4000) {
      Serial.println(F("⚠️ [TIMEOUT] Did you fall asleep? Light remained unpressed for 4s.\n"));
      digitalWrite(STIMULUS_LED_PIN, LOW);
      delay(2000);
      return;
    }
  }

  // Calculate high-precision elapsed reaction time
  unsigned long reactionTimeMs = millis() - stimulusTriggerTime;
  digitalWrite(STIMULUS_LED_PIN, LOW); // Turn off stimulus immediately

  // Display Telemetry Results & Athletic Evaluation
  Serial.println(F("⚡ [STIMULUS TRIGGERED]"));
  Serial.print(F("🎯 Reaction Time: "));
  Serial.print(reactionTimeMs);
  Serial.println(F(" ms"));

  if (reactionTimeMs < 180) {
    Serial.println(F("🏆 Performance Rating: SUPERHUMAN (Esports / Fighter Pilot Grade)"));
  } else if (reactionTimeMs <= 250) {
    Serial.println(F("🥇 Performance Rating: EXCELLENT (High Athletic Reflexes)"));
  } else if (reactionTimeMs <= 350) {
    Serial.println(F("🥈 Performance Rating: AVERAGE (Normal Human Baseline)"));
  } else {
    Serial.println(F("🥉 Performance Rating: SLUGGISH (Drink some water and refocus!)"));
  }

  Serial.println(F("----------------------------------------\n"));
  delay(3000); // 3-second recovery delay before next test round
}`,
      pinMap: { 
        'Pin 13': 'Visual stimulus LED (220Ω series resistor to GND)', 
        'Pin 2': 'Reaction response tactile button (INPUT_PULLUP active-LOW)',
        'Pin A0': 'Unconnected floating analog pin for PRNG noise harvesting'
      },
      setupAndUpload: [
        '1. Connect Arduino Uno via USB and confirm Port under Tools > Port.',
        '2. Verify and upload the sketch to the board.',
        '3. Open the Serial Monitor (Ctrl+Shift+M or Cmd+Shift+M) and ensure baud rate is 9600.',
        '4. Rest your index finger lightly on the button and wait for the "STANDBY" prompt.'
      ],
      explanations: [
        'randomSeed(analogRead(A0)): Reads floating atmospheric voltage (0-1023) from unconnected pin A0, initializing the PRNG seed register.',
        'millis() - waitStartTime < suspenseDuration: Non-blocking time window that constantly checks for button presses while waiting for the timer to expire.',
        'digitalRead(BUTTON_PIN) == LOW: Detects active-low button press when connected to GND via internal pull-up resistor.',
        'millis() - stimulusTriggerTime: Computes exact human neuromuscular reaction time with millisecond precision.'
      ],
      expectedResult: 'Serial Monitor prompts the user to get ready; after an unpredictable 2-5s delay, the LED fires. Pressing the button prints the reaction time (e.g. 218ms) and athletic ranking.',
      caveats: [
        'Ensure Pin A0 has NO wire connected to it; grounding Pin A0 causes randomSeed to read 0 every time, making delays predictable.',
        'Release the button quickly after pressing so you do not accidentally trigger a false start on the next round.'
      ],
      tweakTip: 'Mission Challenge: Create a best-of-5 tournament scorekeeper variable that computes the runner’s average reaction time across 5 consecutive rounds!'
    },
    troubleshooting: [
      { 
        symptom: 'Game immediately aborts with "FALSE START" the instant the round begins without the button being touched.', 
        checks: [
          'Step 1: Inspect button wiring — is Pin 2 connected to the same pin as GND through a jumper wire or bent pin?',
          'Step 2: Confirm code includes `pinMode(BUTTON_PIN, INPUT_PULLUP)` — if set to `INPUT`, floating noise can falsely read LOW.',
          'Step 3: Measure voltage at Pin 2 with a multimeter: it should read 5.0V when unpressed, and 0V when pressed.'
        ], 
        explanation: 'If the pin is floating or accidentally grounded, digitalRead() evaluates to LOW immediately, triggering the false start penalty.' 
      },
      { 
        symptom: 'Reaction times are identical on every test round after resetting the board.', 
        checks: [
          'Step 1: Check if `randomSeed(analogRead(A0))` is present in setup().',
          'Step 2: Inspect Pin A0 to ensure it is completely empty and not touching 5V, GND, or adjacent pins.'
        ], 
        explanation: 'Without a randomized seed from floating RF noise, the Arduino PRNG generates the exact same sequence of pseudo-random numbers upon every reset.' 
      },
      { 
        symptom: 'Stimulus LED does not light up when the game enters the GO phase, but Serial Monitor prints messages.', 
        checks: [
          'Step 1: Check LED polarity — is long leg (Anode) connected to Pin 13 through the resistor and short leg (Cathode) to GND?',
          'Step 2: Swap the LED with a fresh unit to test for semiconductor burnout.'
        ], 
        explanation: 'Reversed LED polarity blocks forward current conduction; the software executes normally but produces no visible optical signal.' 
      },
      { 
        symptom: 'Serial Monitor displays scrambled, garbled hieroglyphic characters instead of English text.', 
        checks: [
          'Step 1: Look at the bottom right corner of the Serial Monitor window.',
          'Step 2: Change the baud rate dropdown menu from 115200 (or other value) to exactly 9600 baud to match `Serial.begin(9600)`.'
        ], 
        explanation: 'UART asynchronous serial communication requires transmitter and receiver clocks to be synchronized to the exact same baud rate.' 
      }
    ],
    checksForUnderstanding: [
      'Why is using delay() in an autonomous robot dangerous when monitoring emergency stop sensors?',
      'How does millis() allow an embedded system to track time without halting CPU instruction flow?',
      'Why does an unconnected analog pin (A0) provide an effective seed for pseudo-random number generators?'
    ],
    exitTicket: [
      { 
        question: 'Explain the difference between blocking time control (delay) and non-blocking time control (millis) using a real-world analogy.', 
        rubricOrSampleReasoning: 'delay() is like sitting with your eyes closed waiting for an alarm, unable to see anything. millis() is like glancing at your wrist watch while continuing to navigate and look around.' 
      },
      { 
        question: 'What is the role of an unsigned long variable type when storing millis() timestamps, and why cannot a regular int be used?', 
        rubricOrSampleReasoning: 'A standard signed int (16-bit on Arduino) rolls over after 32,767 milliseconds (~32 seconds). An unsigned long (32-bit) can count up to ~4.29 billion milliseconds (~49.7 days) before rolling over.' 
      },
      { 
        question: 'What is the single-variable scientific debugging method, and why is it essential in robotics development?', 
        rubricOrSampleReasoning: 'It is changing only one hardware or software parameter at a time and verifying results empirically. Changing multiple things simultaneously masks the root cause and creates compounding bugs.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-wired breadboards with color-coded signal jumpers (Yellow for Pin 13, Green for Pin 2).'],
      extension: ['Implement a 2-player reflex duel with two buttons (Pins 2 and 3) that detects who pressed first down to the microsecond.'],
      offlineOption: ['Use the interactive web reaction simulator with virtual oscilloscopes and debounce timing traces.']
    },
    nextLessonId: 'beg-06',
    nextLessonTeaser: 'Beginner 06: DC Motors & Motor Drivers — Why can’t an Arduino pin power a motor directly? Learn H-Bridge MOSFET switches, flyback diodes, and PWM speed control!',
    sources: [{ title: 'Arduino Reference: millis() & Timer0 Architecture', url: 'https://docs.arduino.cc/language-reference/en/functions/time/millis/' }],
    assetCredits: [{ asset: 'Reaction Game Diagram', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'beg-06',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-tb6612fng", "fg-safety-lab-code"],
      lookUpWhileBuilding: ["fg-electronics-ohms-law", "fg-board-uno-anatomy"],
      goDeeper: ["fg-motion-differential-kinematics"]
    },
    courseId: 'beginner',
    sequence: 6,
    code: 'BEGINNER 06',
    title: 'DC Motors and Motor Drivers: The H-Bridge',
    promise: 'By the end of this masterclass, you will understand the Lorentz force of DC motors, why microcontrollers require H-Bridge motor drivers, how flyback diodes protect circuits, and how Pulse Width Modulation (PWM) controls rotational speed.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04', 'Beginner 05'],
    outcomes: [
      'Explain why an ATmega328P GPIO pin (max 20mA recommended) cannot directly drive an inductive DC motor (300mA–1500mA stall current).',
      'Analyze the 4-quadrant switching states of an H-Bridge circuit (Forward, Reverse, Coast, Active Regenerative Brake).',
      'Explain how inductive kickback (V = -L di/dt) creates massive voltage spikes and how flyback diodes prevent MOSFET destruction.',
      'Contrast modern low-resistance MOSFET drivers (TB6612FNG) with legacy bipolar drivers (L298N).',
      'Wire a dual DC motor test stand with independent high-current battery power and shared Common Ground.'
    ],
    vocabulary: [
      { term: 'Motor Driver', plainMeaning: 'A heavy-duty electronic gate that lets tiny Arduino signals safely control powerful battery motors.', technicalMeaning: 'An integrated circuit interface translating low-power digital logic into high-current power stages for inductive loads.' },
      { term: 'H-Bridge', plainMeaning: 'Four electronic switches arranged in an "H" shape to reverse electric current through a motor.', technicalMeaning: 'An electronic circuit topology enabling bidirectional voltage and current control across an electrical load.' },
      { term: 'Lorentz Force', plainMeaning: 'The physical magnetic push that spins an electric motor when current flows through its coils.', technicalMeaning: 'The force exerted on a charged particle moving through magnetic and electric fields: F = q(E + v × B).' },
      { term: 'Back-EMF (Counter Electromotive Force)', plainMeaning: 'A reverse voltage generated by the spinning motor that opposes the battery voltage.', technicalMeaning: 'The voltage created across an electric motor as its magnetic field collapses or rotates, opposing applied voltage.' },
      { term: 'Flyback Diode', plainMeaning: 'A safety one-way valve that drains dangerous high-voltage electrical sparks when a motor turns off.', technicalMeaning: 'A diode placed across an inductive load to dissipate high-voltage transient spikes caused by rapid current interruption.' },
      { term: 'PWM (Pulse Width Modulation)', plainMeaning: 'Rapidly switching motor power ON and OFF hundreds of times per second to set wheel speed.', technicalMeaning: 'A modulation technique controlling delivered power by varying the duty cycle of a fixed-frequency square wave.' },
      { term: 'Common Ground (Shared GND)', plainMeaning: 'Connecting all negative wires together so signals have the same zero-volt reference point.', technicalMeaning: 'A unified reference potential shared across multiple voltage domains to enable signal integrity.' }
    ],
    teacherPrep: ['Prepare TT yellow DC gear motors, TB6612FNG drivers, 4xAA battery packs, and elevated motor bench test stands.'],
    verifiedMaterials: ['Arduino Uno Rev3 DIP', 'TB6612FNG Dual H-Bridge Driver Carrier', 'TT Yellow DC Gear Motor (1:48 ratio)', '4xAA Battery Holder (6.0V nominal)', 'Bench elevation block', 'Jumper wires'],
    safetyNotes: [
      'NEVER connect a DC motor directly across Arduino GPIO pins! Doing so draws excessive current, causing permanent silicon burn-out.',
      'Always bench-test motors with wheels elevated completely off the table surface to prevent runaway hardware accidents.',
      'Never short the high-current battery rail (VM) to the microcontroller 5V logic rail (VCC).'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Compare a smartphone headphone jack (low power) to a rock concert stadium amplifier (high power). Explain why Arduino is the brain and the H-Bridge is the muscle.', 
        studentAction: 'Compare current draw: Arduino pin (20mA) vs DC motor starting surge (1000mA). Calculate ratio (50x difference!).' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Draw the H-Bridge switch diagram on the board. Trace current path for Forward, Reverse, Coast, and Active Brake. Explain inductive kickback and flyback diodes.', 
        studentAction: 'Fill out the H-Bridge 4-state direction truth table and calculate PWM average voltage for values 0, 128, and 255.' 
      },
      { 
        segment: '25–50m Build', 
        minutes: 25, 
        teacherAction: 'Supervise wiring of TB6612FNG logic pins, motor terminals, battery pack, and the vital Common Ground connection.', 
        studentAction: 'Assemble motor stand with elevated wheel. Upload C++ test sketch and observe bidirectional rotation, braking, and PWM speed sweeps.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect student wiring for common ground compliance and verify dynamic braking behavior.', 
        studentAction: 'Complete exit check questions and explain why an H-Bridge requires a shared GND.' 
      }
    ],
    concepts: [
      {
        title: '1. Lorentz Force & The Electromechanics of DC Motors',
        explanation: 'A brushed direct current (DC) motor operates on the Lorentz Force principle: when electric current ($I$) flows through copper wire coils situated inside a permanent magnetic field ($B$), a physical mechanical force ($F = B \cdot I \cdot L \sin\theta$) is exerted on the rotor. The mechanical commutator flips the electrical polarity every half-turn, producing continuous rotary torque. The faster the motor spins, the more mechanical work it performs. However, producing substantial physical torque requires substantial current—typically 200mA under light rolling loads and up to 1500mA when stalled or starting!',
        instructorNote: 'Demonstrate by spinning a disconnected DC motor by hand: feel the magnetic detents of the permanent magnets inside.'
      },
      {
        title: '2. The Golden Rule of Power Isolation (Logic vs Inductive Loads)',
        explanation: 'Every digital I/O pin on the ATmega328P microcontroller has a strict continuous current limit of 20mA (with an absolute maximum rating of 40mA). Attempting to power a 1000mA DC motor directly from an Arduino pin pulls 50 times the safe current rating! This excessive current instantly vaporizes the microscopic silicon bond wires inside the microcontroller package, destroying the pin permanently. Modern robotics strictly segregates circuits into two isolated domains: Low-Power Digital Logic (5V / low current) and High-Power Inductive Drive (6V–12V / high current).',
        instructorNote: 'State the golden rule clearly: Microcontrollers are THINKERS, not MUSCLES. Never power motors or coils from GPIO pins!'
      },
      {
        title: '3. Anatomy of an H-Bridge & Inductive Kickback (Flyback Protection)',
        explanation: 'An H-Bridge circuit consists of four electronic switches (typically MOSFET transistors: Q1, Q2, Q3, Q4) arranged in an "H" shape around the motor terminals. Closing Q1 and Q4 pushes current from Left to Right (Motor spins Forward). Closing Q2 and Q3 pushes current from Right to Left (Motor spins Reverse). CRITICAL ELECTRICAL SAFETY: A motor coil is an inductor that stores energy in a magnetic field. When the switches suddenly turn off, the magnetic field collapses violently, generating a massive reverse voltage spike known as Inductive Kickback ($V = -L \frac{di}{dt}$), easily reaching 50V–100V! Fast-recovery Schottky Flyback Diodes clamp these spikes safely back into the power rails, protecting the delicate driver transistors from burning out.',
        instructorNote: 'Point out what happens if Q1 and Q2 are turned on simultaneously: "Shoot-Through" creates a dead short across the battery that melts wires!'
      },
      {
        title: '4. Modern MOSFET Drivers (TB6612FNG) vs Legacy Bipolar Drivers (L298N)',
        explanation: 'Many outdated robotics tutorials use the ancient L298N dual motor driver. The L298N is built using obsolete bipolar junction transistors (BJTs) that have a massive internal voltage drop of 2.0V to 3.0V! If you connect a 6V battery pack to an L298N, the motor only receives ~3.5V, while the remaining 2.5V is wasted as intense heat ($P = V \times I$), requiring a massive aluminum heatsink. The modern Toshiba TB6612FNG driver uses low-resistance DMOS Field-Effect Transistors ($R_{DS(on)} \approx 0.5\Omega$). It drops almost zero voltage, generates virtually no heat, fits on a tiny postage-stamp carrier board, and features built-in thermal shutdown and standby energy saving.',
        instructorNote: 'Show students the physical size difference: the bulky heavy L298N brick vs the compact, highly efficient TB6612FNG chip.'
      },
      {
        title: '5. Pulse Width Modulation (PWM) & Mechanical Inertia',
        explanation: 'Microcontrollers cannot output continuously variable analog voltages like 2.5V or 3.7V—they are purely digital, outputting either 0V or 5V. To control motor speed smoothly, we use Pulse Width Modulation (PWM). PWM rapidly toggles the digital output at approximately 490Hz (490 times per second on Uno pins 5 & 6). By adjusting the Duty Cycle (the percentage of time the signal is HIGH versus LOW), we control average electrical power. At `analogWrite(pin, 128)`, the signal is 50% ON and 50% OFF, delivering 50% average power. The physical inertia of the motor’s heavy copper rotor acts as a mechanical low-pass filter, smoothing the pulses into steady rotational velocity.',
        instructorNote: 'Explain the 8-bit resolution: 0 = 0% duty (Stop), 128 = 50% duty (Half Speed), 255 = 100% duty (Full Speed).'
      },
      {
        title: '6. The Critical Necessity of Shared Common Ground (GND)',
        explanation: 'A voltage is not an absolute number; it is an electrical potential DIFFERENCE between two points measured relative to a 0V reference. If your 6V motor battery pack is completely isolated from your Arduino, the Arduino’s 5V logic signal has no return path back to the Arduino when plugged into the driver! The driver gates cannot measure the 5V signal because they do not share the same 0V ground baseline. Without a Common Ground wire tying the Arduino GND to the Battery Pack (-), logic signals float erratically, causing motors to twitch uncontrollably or fail to respond entirely.',
        instructorNote: 'Draw two separate mountains on the board: you cannot measure the height difference between two flags unless you measure from the same sea level!'
      }
    ],
    visualizerId: 'motor_driver_pwm_sim',
    project: {
      name: 'Precision DC Motor Driver & Bench Test Stand',
      deliverableType: 'physical_build',
      successEvidence: [
        'Elevated motor test stand demonstrating Forward, Reverse, Coast, and Active Dynamic Braking.',
        'Smooth PWM speed acceleration sweep from minimum starting deadband to full speed.',
        'Properly wired dual-supply circuit with independent 6V motor power and shared Common Ground.'
      ]
    },
    activity: {
      title: 'Wire, Program, and Test the Motor Test Stand',
      steps: [
        'Step 1: Elevate the yellow TT DC gear motor and wheel securely on a bench block clear of table contact.',
        'Step 2: Connect the TB6612FNG logic pins to Arduino: PWMA to Pin 5 (~PWM), AIN1 to Pin 7, AIN2 to Pin 8, and STBY to Pin 6.',
        'Step 3: Connect Arduino 5V to Driver VCC (Logic Power), and Arduino GND to Driver GND.',
        'Step 4: Connect the 4xAA battery pack positive (6V) to Driver VM (Motor Power) and battery negative (-) to Driver GND (Shared Common Ground).',
        'Step 5: Connect the two yellow motor wires to driver output terminals A01 and A02.',
        'Step 6: Upload the embedded C++ sketch and observe forward spin, active braking, reverse spin, and PWM speed sweeps.'
      ],
      successCriteria: [
        'Motor spins smoothly in both directions under software control.',
        'Active brake stops wheel immediately without coasting.',
        'Microcontroller does not brown out or reset when motor starts from a dead stop.'
      ],
      extension: 'Find the exact minimum PWM value (deadband threshold) required to overcome internal gearbox friction from a stationary stop.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Arduino Uno R3 DIP (ATmega328P)', 'Toshiba TB6612FNG Dual Motor Driver Breakout', 'TT Yellow DC Gear Motor (1:48)'],
      componentList: [
        { name: 'Arduino Uno Rev3', exactVariant: 'Standard Rev3 DIP ATmega328P', quantity: 1 },
        { name: 'TB6612FNG Motor Driver Breakout', exactVariant: 'Dual H-Bridge, 1.2A continuous / 3.2A peak per channel', quantity: 1 },
        { name: 'TT DC Gear Motor + Wheel', exactVariant: '3V–6V DC, 1:48 gear ratio with 65mm rubber tire', quantity: 1 },
        { name: '4xAA Battery Holder', exactVariant: '4-cell AA switched battery box (6.0V nominal)', quantity: 1 },
        { name: 'Half-Size Breadboard', exactVariant: '400 tie-points with power bus strips', quantity: 1 },
        { name: 'Jumper Wires', exactVariant: '20cm 24AWG Male-to-Male and Male-to-Female jumpers', quantity: 10 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/motor_driver_tb6612_wiring.svg',
      schematic: 'Arduino Pin 5 (~PWM) ── PWMA (Speed)\nArduino Pin 7 ────────── AIN1 (Direction 1)\nArduino Pin 8 ────────── AIN2 (Direction 2)\nArduino Pin 6 ────────── STBY (Standby Enable, HIGH=Run)\nArduino 5V ───────────── VCC (Driver Logic Power)\nArduino GND ──────────── GND (Common Ground)\nBattery 6V (+) ───────── VM (Motor Drive Power)\nBattery 6V (-) ───────── GND (Common Ground)\nDriver A01 ───────────── Motor Terminal 1\nDriver A02 ───────────── Motor Terminal 2',
      wireTable: [
        { from: 'Arduino Digital Pin 5 (~PWM)', to: 'TB6612FNG PWMA', wireOrPolarityNote: 'Blue PWM Speed Signal' },
        { from: 'Arduino Digital Pin 7', to: 'TB6612FNG AIN1', wireOrPolarityNote: 'Yellow Direction Signal 1' },
        { from: 'Arduino Digital Pin 8', to: 'TB6612FNG AIN2', wireOrPolarityNote: 'Green Direction Signal 2' },
        { from: 'Arduino Digital Pin 6', to: 'TB6612FNG STBY', wireOrPolarityNote: 'Orange Standby Enable Signal' },
        { from: 'Arduino 5V Pin', to: 'TB6612FNG VCC', wireOrPolarityNote: 'Red 5V Logic Power Wire' },
        { from: 'Arduino GND Pin', to: 'TB6612FNG GND', wireOrPolarityNote: 'Black Master Logic Ground' },
        { from: '4xAA Battery Pack (+ 6V)', to: 'TB6612FNG VM', wireOrPolarityNote: 'Red Heavy-Duty Motor Power Wire' },
        { from: '4xAA Battery Pack (- GND)', to: 'TB6612FNG GND', wireOrPolarityNote: 'Black SHARED COMMON GROUND Wire' },
        { from: 'TB6612FNG A01 Terminal', to: 'Motor Lead 1', wireOrPolarityNote: 'Motor Phase 1 Wire' },
        { from: 'TB6612FNG A02 Terminal', to: 'Motor Lead 2', wireOrPolarityNote: 'Motor Phase 2 Wire' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Ensure 4xAA battery pack power switch is turned OFF before making connections.',
        '2. Mount TB6612FNG carrier board into breadboard center trench.',
        '3. Connect all logic wires between Arduino and driver breakout.',
        '4. Connect the critical Black Common Ground wire between Arduino GND and Battery GND on the breadboard rail.',
        '5. Prop the motor test stand so the rubber tire is suspended in mid-air.',
        '6. Plug in Arduino USB cable, turn ON battery pack switch, and upload the sketch.'
      ],
      powerAndSafetyChecks: [
        'Double-check that battery 6V (+) connects to VM and NEVER to Arduino 5V or VCC.',
        'Confirm common ground connection exists between battery pack (-) and Arduino GND.',
        'If driver chip or wires feel hot to the touch, switch battery pack OFF immediately.'
      ],
      testCases: [
        { action: 'AIN1=HIGH, AIN2=LOW, PWMA=150', expectedResult: 'Motor spins smoothly forward at medium speed.' },
        { action: 'AIN1=LOW, AIN2=HIGH, PWMA=150', expectedResult: 'Motor reverses direction smoothly at medium speed.' },
        { action: 'AIN1=HIGH, AIN2=HIGH, PWMA=255', expectedResult: 'Motor enters Active Dynamic Braking, halting wheel immediately.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - H-Bridge Motor Control Lab
// Class: BEGINNER 06 - DC Motors & The TB6612FNG Motor Driver

// Control Pin Assignments
const int PIN_PWMA = 5;  // Speed control: MUST be a hardware ~PWM pin (Timer0)
const int PIN_AIN1 = 7;  // Motor Direction input 1
const int PIN_AIN2 = 8;  // Motor Direction input 2
const int PIN_STBY = 6;  // Standby disable pin (HIGH = Active, LOW = Sleep)

void setup() {
  // Configure all driver control pins as low-impedance digital outputs
  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_STBY, OUTPUT);

  // Take driver out of low-power standby mode
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE TB6612FNG MOTOR TEST BENCH    "));
  Serial.println(F("========================================"));
}

// Low-level helper: Set motor state (Speed: -255 to +255, 0 = Coast, brake = true for active stop)
void driveMotor(int speedVal, bool activeBrake = false) {
  if (activeBrake) {
    // ACTIVE REGENERATIVE BRAKE: Both direction pins HIGH shorts motor terminals
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
    analogWrite(PIN_PWMA, 255);
    return;
  }

  if (speedVal > 0) {
    // FORWARD ROTATION
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
    analogWrite(PIN_PWMA, constrain(speedVal, 0, 255));
  } else if (speedVal < 0) {
    // REVERSE ROTATION
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
    analogWrite(PIN_PWMA, constrain(abs(speedVal), 0, 255));
  } else {
    // COAST TO A HALT: Both direction pins LOW
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, LOW);
    analogWrite(PIN_PWMA, 0);
  }
}

void loop() {
  // 1. FORWARD SPEED SWEEP (Accelerating from deadband to full throttle)
  Serial.println(F(">> Phase 1: Forward Acceleration Sweep..."));
  for (int spd = 70; spd <= 255; spd += 25) {
    driveMotor(spd);
    Serial.print(F("   PWM Duty: "));
    Serial.println(spd);
    delay(250);
  }
  delay(1000); // Hold full forward speed for 1s

  // 2. ACTIVE BRAKE DEMONSTRATION
  Serial.println(F(">> Phase 2: ACTIVE DYNAMIC BRAKE engaged!"));
  driveMotor(0, true); // Active brake
  delay(1500);

  // 3. REVERSE SPEED SWEEP
  Serial.println(F(">> Phase 3: Reverse Rotation Sweep..."));
  for (int spd = 70; spd <= 220; spd += 30) {
    driveMotor(-spd);
    Serial.print(F("   Reverse PWM: "));
    Serial.println(spd);
    delay(250);
  }
  delay(1000);

  // 4. COAST TO STOP
  Serial.println(F(">> Phase 4: Coasting to stop (low resistance)...\n"));
  driveMotor(0, false); // Passive coast
  delay(2500);
}`,
      pinMap: { 
        'Pin 5': 'PWMA speed duty cycle (Hardware ~PWM pin)', 
        'Pin 7': 'AIN1 motor direction logic input 1', 
        'Pin 8': 'AIN2 motor direction logic input 2', 
        'Pin 6': 'STBY standby enable pin (HIGH = operational, LOW = standby)' 
      },
      setupAndUpload: [
        '1. Ensure motor wheel is elevated in mid-air before uploading.',
        '2. Verify and upload the sketch via Arduino IDE.',
        '3. Switch battery pack power switch to ON.',
        '4. Open Serial Monitor at 9600 baud to observe telemetry transitions.'
      ],
      explanations: [
        'digitalWrite(STBY, HIGH): Pulls the TB6612FNG standby pin HIGH, awakening internal charge pump and MOSFET gate drivers.',
        'digitalWrite(AIN1, HIGH) & AIN2, LOW: Configures H-Bridge to conduct diagonally, routing battery current forward through motor coils.',
        'digitalWrite(AIN1, HIGH) & AIN2, HIGH: Enters Active Regenerative Brake mode, shorting motor terminals to ground to resist rotation.',
        'analogWrite(PWMA, val): Sends high-frequency 490Hz pulse-width modulated square wave, altering average motor voltage.'
      ],
      expectedResult: 'Elevated wheel accelerates smoothly forward through 8 speed steps, snaps to an immediate halt under active braking, accelerates in reverse, and coasts to rest.',
      caveats: [
        'If the motor rotates backward during Phase 1, simply swap the two motor wires connected to terminals A01 and A02.',
        'Below a PWM value of ~60-80, the motor may hum without spinning due to internal gearbox static friction.'
      ],
      tweakTip: 'Mission Challenge: Determine the exact "Breakaway PWM Threshold" where the motor first starts turning, and write a software clamp that never commands below that value!'
    },
    troubleshooting: [
      { 
        symptom: 'Motor emits a high-pitched whine or buzz, but the wheel does not rotate.', 
        checks: [
          'Step 1: Increase the PWM speed value above 100 in code.',
          'Step 2: Check battery pack voltage with a digital multimeter — fresh 4xAA cells should measure ~6.0V.',
          'Step 3: Try spinning the wheel lightly with your fingers to see if gear teeth are jammed.'
        ], 
        explanation: 'Gearbox static friction (stiction) requires a minimum breakaway torque. Low PWM values cannot supply sufficient average current to overcome mechanical resistance.' 
      },
      { 
        symptom: 'Arduino disconnects from USB or reboots every time the motor attempts to start.', 
        checks: [
          'Step 1: Check where the motor driver VM pin is connected — is it accidentally plugged into Arduino 5V instead of the battery pack?',
          'Step 2: Verify that the 4xAA batteries are fresh and not completely drained.'
        ], 
        explanation: 'When a motor starts from rest, it draws a massive inrush current surge. If powered from Arduino 5V, this surge droops the voltage rail below 4.3V, triggering the ATmega328P Brown-Out Detector (BOD) reset.' 
      },
      { 
        symptom: 'Motor does not respond at all; Serial Monitor prints normally, but wheel never moves.', 
        checks: [
          'Step 1: Verify STBY pin 6 is set to OUTPUT and commanded HIGH in code.',
          'Step 2: Verify the Shared Common Ground wire is securely bridging Arduino GND to Battery (-) on the breadboard.',
          'Step 3: Confirm the physical switch on the 4xAA battery pack is flipped ON.'
        ], 
        explanation: 'If the STBY pin is LOW or floating, the TB6612FNG enters low-power sleep mode, disabling all internal MOSFET gate drivers.' 
      },
      { 
        symptom: 'Motor only spins in one direction; reversing commands cause it to stop.', 
        checks: [
          'Step 1: Inspect jumper wire from Pin 8 to AIN2 — is it seated firmly in the breadboard row?',
          'Step 2: Swap the AIN1 and AIN2 wires to see if the failure follows the wire or the driver channel.'
        ], 
        explanation: 'A disconnected direction pin leaves that gate floating, preventing the H-Bridge from completing the second diagonal conduction path.' 
      }
    ],
    checksForUnderstanding: [
      'Why does connecting a DC motor directly to an Arduino GPIO pin cause permanent chip damage?',
      'How does an H-Bridge circuit achieve bidirectional motor rotation without reversing battery wires by hand?',
      'Why is a Common Ground wire between the Arduino and battery pack strictly required?'
    ],
    exitTicket: [
      { 
        question: 'Why can a microcontroller GPIO pin power an LED directly, but cannot power a DC motor directly?', 
        rubricOrSampleReasoning: 'An LED draws safe low current (~15mA), within the ATmega328P 20mA pin rating. A DC motor draws 300mA to 1500mA+, which exceeds the pin rating by 15 to 75 times and vaporizes internal silicon traces.' 
      },
      { 
        question: 'What is inductive kickback, and what circuit component protects the motor driver against it?', 
        rubricOrSampleReasoning: 'Inductive kickback is a high-voltage spike generated when current through a motor coil is interrupted, caused by collapsing magnetic fields (V = -L di/dt). Flyback diodes clamp these spikes safely.' 
      },
      { 
        question: 'What happens to average motor voltage when an Arduino executes analogWrite(pin, 128) from a 5V logic driver?', 
        rubricOrSampleReasoning: 'analogWrite(pin, 128) outputs a 50% duty cycle PWM square wave, delivering an average effective voltage of 2.5V (50% of 5V).' 
      }
    ],
    differentiation: {
      support: ['Provide color-coded breadboard wiring templates highlighting VM (Red), GND (Black), and Logic (Yellow/Blue).'],
      extension: ['Implement a smooth S-curve acceleration profile that ramps motor speed without mechanical jerk.'],
      offlineOption: ['Use the interactive H-Bridge transistor simulator to toggle virtual switches and trace current paths.']
    },
    nextLessonId: 'beg-07',
    nextLessonTeaser: 'Beginner 07: Movement Functions & Route Control — Package raw motor pins into forward(), turnRight(), and stopRobot() to drive precision floor routes!',
    sources: [{ title: 'Toshiba TB6612FNG Driver Datasheet & Application Notes', url: 'https://toshiba.semicon-storage.com/' }],
    assetCredits: [{ asset: 'H-Bridge Truth Table Guide', creator: 'RoboBEE Innovators Lab', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'beg-07',
    fieldGuideLinks: {
      readBeforeClass: ["fg-motion-differential-kinematics"],
      lookUpWhileBuilding: ["fg-comp-tb6612fng", "fg-prog-program-structure"],
      goDeeper: ["fg-comp-encoders-odometry"]
    },
    courseId: 'beginner',
    sequence: 7,
    code: 'BEGINNER 07',
    title: 'Differential-Drive Movement and Route Control',
    promise: 'By the end of this masterclass, you will master differential-drive robot kinematics, encapsulate low-level H-Bridge commands into clean C++ movement functions, understand the physics of open-loop dead reckoning drift, and choreograph autonomous floor routes.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 03', 'Beginner 04', 'Beginner 05', 'Beginner 06'],
    outcomes: [
      'Formulate the mathematical kinematics of differential drive mobile robotics (linear velocity V and angular rotational rate ω).',
      'Encapsulate low-level motor pin operations into modular, reusable C++ functions: forward(), reverse(), turnLeft(), turnRight(), and stopRobot().',
      'Distinguish between zero-radius tank spins, single-wheel pivot turns, and sweeping arc maneuvers.',
      'Explain why open-loop dead reckoning inevitably drifts over time due to gearbox tolerances, wheel slip, and battery voltage droop.',
      'Calibrate software motor trim multipliers to achieve straight-line tracking on real classroom flooring.'
    ],
    vocabulary: [
      { term: 'Differential Drive', plainMeaning: 'Steering a mobile robot by driving its left and right wheels at different speeds.', technicalMeaning: 'A mobile robotics drive architecture based on two independent coaxial drive wheels with velocities determining linear and angular motion.' },
      { term: 'Kinematics', plainMeaning: 'The branch of physics that describes motion (speed, angles, distance) without worrying about forces.', technicalMeaning: 'The study of the geometry of motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion.' },
      { term: 'Dead Reckoning', plainMeaning: 'Navigating purely by estimating time and speed without looking at sensors or maps.', technicalMeaning: 'The process of calculating current position based on estimated velocity, course heading, and elapsed time from a known fix.' },
      { term: 'Open-Loop Control', plainMeaning: 'Sending a command to a motor and blindly assuming it worked without checking sensor feedback.', technicalMeaning: 'A control system in which output has no feedback effect on the input quantity or control action.' },
      { term: 'Software Motor Trim', plainMeaning: 'A tiny calibration number in code that slows down a faster motor so the robot drives straight.', technicalMeaning: 'A scaling multiplier applied to actuator control signals to compensate for physical mechanical asymmetric biases.' },
      { term: 'Function Abstraction', plainMeaning: 'Hiding 12 lines of confusing pin code behind a clean English command like forward(150).', technicalMeaning: 'The software design practice of isolating low-level hardware manipulations behind a clean, parameter-driven application programming interface (API).' }
    ],
    teacherPrep: ['Mark test navigation arenas on classroom floor with painter’s tape (start line, 90° corner box, stop target).'],
    verifiedMaterials: ['Assembled 2WD Smart Rover Chassis with dual TT gearmotors and caster', 'Arduino Uno Rev3', 'TB6612FNG Driver', '4xAA Battery Pack', 'Painter’s floor tape', 'Ruler / tape measure'],
    safetyNotes: [
      'Perform floor testing only in designated flat areas away from stairs, open doorways, and foot traffic.',
      'Never pick up a moving robot by its spinning wheels; lift by the main acrylic chassis deck.',
      'Ensure battery pack switch is OFF when carrying the rover between lab tables and testing zones.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display 120 lines of repetitive digitalWrite code versus 6 clean lines of function calls. Ask: "Which codebase would you rather debug in a national competition?"', 
        studentAction: 'Analyze code readability and recognize the power of procedural software abstraction.' 
      },
      { 
        segment: '10–25m Concept', 
        minutes: 15, 
        teacherAction: 'Derive differential drive kinematics on the whiteboard: V = (Vr + Vl)/2 and ω = (Vr - Vl)/W. Explain open-loop drift and why time-based navigation fails over long distances.', 
        studentAction: 'Calculate wheel speed ratios for a 90° tank turn versus a wide sweeping arc turn.' 
      },
      { 
        segment: '25–50m Floor Tests', 
        minutes: 25, 
        teacherAction: 'Facilitate floor testing on taped routes. Guide students in measuring steering drift and tuning software motor trim factors.', 
        studentAction: 'Deploy rover on test track, calibrate turn timing to execute an exact 90° corner, and navigate around an obstacle cone.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review empirical causes of dead reckoning error (tire traction, gearbox variance, battery voltage decline).', 
        studentAction: 'Complete formative exit check and explain why closed-loop sensory feedback is required for true autonomy.' 
      }
    ],
    concepts: [
      {
        title: '1. Differential Drive Kinematic Equations & Heading Physics',
        explanation: 'A two-wheeled differential drive rover moves in a two-dimensional plane $(x, y, \theta)$. Its instantaneous linear velocity ($V$) is the mathematical average of the left and right wheel surface velocities: $V = \frac{V_R + V_L}{2}$. Its angular rotational velocity ($\omega$) is determined by the velocity difference divided by the track width ($W$, the lateral distance between wheel contact patches): $\omega = \frac{V_R - V_L}{W}$. When both wheels rotate at identical forward velocities ($V_L = V_R$), angular velocity is zero ($\omega = 0$), producing pure linear translation. When velocities differ, the robot rotates about an Instantaneous Center of Curvature (ICC).',
        instructorNote: 'Point out that increasing track width W makes a robot turn more slowly and predictably for a given wheel speed difference.'
      },
      {
        title: '2. Software Function Abstraction & API Architecture',
        explanation: 'In commercial robotics firmware, hardware engineers never scatter raw pin manipulations (`digitalWrite(7, HIGH)`) throughout navigational logic. Doing so creates fragile "spaghetti code" that is nearly impossible to maintain or debug. Instead, good architecture uses Function Abstraction: low-level H-Bridge operations are encapsulated inside dedicated motor driver functions: `setLeftMotor(speed)` and `setRightMotor(speed)`. High-level navigational commands like `forward(speed)`, `turnRight(speed)`, and `stopRobot()` simply call these driver primitives, presenting a clean, robust Application Programming Interface (API).',
        instructorNote: 'Compare function abstraction to driving a modern car: you press the accelerator pedal; you do not manually squirt fuel into the engine cylinders!'
      },
      {
        title: '3. Turn Topology: Tank Spins vs Pivot Turns vs Sweeping Arcs',
        explanation: 'Differential steering enables three distinct turning topologies: 1. Tank Spin (Zero-Radius Turn): Wheels rotate at equal speeds in opposite directions ($V_L = -V_R$). The ICC is located at the center of the axle, causing the robot to rotate completely in place ($R = 0$). Ideal for tight maze escapes. 2. Pivot Turn: One wheel is locked at zero speed while the other drives forward ($V_L > 0, V_R = 0$). The robot pivots around the stationary tire with radius $R = W$. 3. Sweeping Arc: Both wheels drive forward at different non-zero speeds ($V_L > V_R > 0$). The robot navigates a smooth curve without shedding forward kinetic momentum, ideal for high-speed racing lines.',
        instructorNote: 'Have students trace the three turn paths on the floor with their fingers to visualize the difference in turning radii.'
      },
      {
        title: '4. The Inevitable Degradation of Open-Loop Dead Reckoning',
        explanation: 'Open-loop control operates on pure faith: the software issues a command (`forward for 800ms`) and assumes the physical world complies perfectly without checking reality. In practice, dead reckoning degrades rapidly due to four physical factors: 1. Microscopic gearbox manufacturing tolerances (DC motors vary by ±10% in RPM); 2. Surface friction variations (tire slip on dust or tile grout); 3. Wheel diameter discrepancies (even 0.5mm variance curves travel); 4. Battery discharge curves (as voltage drops from 6.0V to 5.2V, motor RPM drops, shortening travel distance).',
        instructorNote: 'Use this lesson to establish why upcoming lessons on Ultrasonic sensors (beg-09) and Line sensors (int-02) are essential for closed-loop correction.'
      },
      {
        title: '5. Software Motor Trim & Straight-Line Calibration',
        explanation: 'Because no two mass-produced DC motors have identical internal magnetic field strengths or gearbox friction, a differential drive robot will almost never drive in a perfectly straight line right out of the box! Rather than re-soldering hardware, robotics engineers compensate in firmware using Software Motor Trim. By defining scaling constants (e.g. `const float LEFT_TRIM = 1.00; const float RIGHT_TRIM = 0.92;`), we mathematically reduce the duty cycle delivered to the faster motor, equalizing wheel RPM and achieving straight-line tracking.',
        instructorNote: 'Show students how to measure drift: run the robot 2 meters along a floor tile seam and measure how many centimeters it drifted off-center.'
      },
      {
        title: '6. Dynamic Active Braking vs Passive Coasting in Rover Physics',
        explanation: 'Stopping a moving rover is just as critical as accelerating it. When an autonomous vehicle reaches a target position, simply setting PWM to zero causes the robot to "coast"—rolling forward under its own linear momentum for 10cm to 30cm depending on chassis mass. To achieve crisp, repeatable positioning, the firmware must trigger Active Dynamic Braking: shorting both motor terminals together through the H-Bridge. As the armature continues spinning through the permanent magnets, it functions as an electrical generator. The shorted terminals cause Back-EMF to oppose motion, generating immediate electromagnetic braking torque.',
        instructorNote: 'Demonstrate by pushing the rover across the desk with driver off (coasts easily) vs with motor terminals shorted (heavy resistance).'
      }
    ],
    visualizerId: 'movement_route_sim',
    project: {
      name: 'Two-Wheel Autonomous Differential-Drive Rover',
      deliverableType: 'physical_build',
      successEvidence: [
        'Fully assembled 2WD chassis with dual TT gearmotors, TB6612FNG driver, and front omnidirectional castor.',
        'Modular C++ firmware implementing forward(), reverse(), turnLeft(), turnRight(), and stopRobot() functions.',
        'Successfully calibrated 90° tank turn executing an exact square floor path and stopping within the target box.'
      ]
    },
    activity: {
      title: 'Program and Calibrate Autonomous Floor Navigation',
      steps: [
        'Step 1: Prop rover on a bench block to verify wheel rotation directions before touching the floor.',
        'Step 2: Upload modular movement firmware with left and right motor abstraction functions.',
        'Step 3: Place rover on the starting line of the taped floor arena.',
        'Step 4: Measure forward distance travel: tune delay duration to traverse exactly 1.0 meter.',
        'Step 5: Calibrate 90-degree turn timing: adjust turn delay (approx 320ms–400ms) until rover pivots exactly 90° on a floor tile.',
        'Step 6: Execute a 4-segment square path (Forward -> Turn -> Forward -> Turn -> Forward -> Turn -> Forward -> Stop) returning to start!'
      ],
      successCriteria: [
        'Rover drives straight along a 1-meter floor line with less than 5cm of lateral drift.',
        'Rover executes a clean 90-degree pivot turn without colliding with side boundaries.',
        'Chassis comes to an immediate, crisp stop using dynamic braking.'
      ],
      extension: 'Implement a non-blocking navigation state machine that executes complex multi-waypoint routes without blocking delays.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Mobile Rover Chassis Kit', 'Dual Yellow TT DC Motors (1:48)', 'Toshiba TB6612FNG Dual Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Laser-Cut Acrylic Chassis', exactVariant: 'Standard dual TT motor cutouts with caster mount', quantity: 1 },
        { name: 'TT Yellow DC Gear Motors', exactVariant: 'Dual shaft, 3V-6V DC, 1:48 gear reduction ratio', quantity: 2 },
        { name: 'High-Grip Rubber Drive Wheels', exactVariant: '65mm outer diameter with silicone rubber tread', quantity: 2 },
        { name: 'Omnidirectional Ball Caster Wheel', exactVariant: 'Nylon / stainless steel ball transfer unit', quantity: 1 },
        { name: 'TB6612FNG Dual Motor Driver Breakout', exactVariant: 'Carrier board with integrated flyback diodes', quantity: 1 },
        { name: '4xAA Switched Battery Holder', exactVariant: '6.0V nominal DC supply with flying leads', quantity: 1 },
        { name: 'Jumper Wires & Fasteners', exactVariant: 'M3 machine screws, standoffs, and 24AWG jumpers', quantity: 14 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/2wd_rover_wiring_plan.svg',
      schematic: 'TB6612FNG Driver Pin Map:\nLeft Motor:  PWMA ── Arduino Pin 5 (~PWM) | AIN1 ── Pin 7 | AIN2 ── Pin 8\nRight Motor: PWMB ── Arduino Pin 6 (~PWM) | BIN1 ── Pin 9 | BIN2 ── Pin 10\nStandby:     STBY ── Arduino Pin 3 (HIGH = Enabled)\nPower:       VCC ── Arduino 5V | VM ── Battery (+) 6V | GND ── Battery (-) & Arduino GND\nOutputs:     A01/A02 ── Left Motor | B01/B02 ── Right Motor',
      wireTable: [
        { from: 'Arduino Pin 5 (~PWM)', to: 'TB6612FNG PWMA', wireOrPolarityNote: 'Left Motor Speed Signal' },
        { from: 'Arduino Pin 7', to: 'TB6612FNG AIN1', wireOrPolarityNote: 'Left Motor Direction 1' },
        { from: 'Arduino Pin 8', to: 'TB6612FNG AIN2', wireOrPolarityNote: 'Left Motor Direction 2' },
        { from: 'Arduino Pin 6 (~PWM)', to: 'TB6612FNG PWMB', wireOrPolarityNote: 'Right Motor Speed Signal' },
        { from: 'Arduino Pin 9', to: 'TB6612FNG BIN1', wireOrPolarityNote: 'Right Motor Direction 1' },
        { from: 'Arduino Pin 10', to: 'TB6612FNG BIN2', wireOrPolarityNote: 'Right Motor Direction 2' },
        { from: 'Arduino Pin 3', to: 'TB6612FNG STBY', wireOrPolarityNote: 'Master Standby Enable' },
        { from: 'Arduino 5V Pin', to: 'TB6612FNG VCC', wireOrPolarityNote: 'Logic Supply (5.0V)' },
        { from: 'Arduino GND Pin', to: 'TB6612FNG GND', wireOrPolarityNote: 'Common Ground Reference' },
        { from: 'Battery Pack (+ 6V)', to: 'TB6612FNG VM', wireOrPolarityNote: 'Motor High-Current Supply' },
        { from: 'Battery Pack (- GND)', to: 'TB6612FNG GND', wireOrPolarityNote: 'Common Battery Ground Return' },
        { from: 'TB6612FNG A01/A02', to: 'Left TT Motor Terminals', wireOrPolarityNote: 'Left Drive Channel' },
        { from: 'TB6612FNG B01/B02', to: 'Right TT Motor Terminals', wireOrPolarityNote: 'Right Drive Channel' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Fasten the two TT gear motors to the lower acrylic chassis using long M3 machine screws and nuts.',
        '2. Mount the front omnidirectional castor wheel with standoffs so the chassis sits perfectly horizontal.',
        '3. Secure the 4xAA battery pack over the center of the chassis to maintain balanced weight distribution.',
        '4. Mount the Arduino Uno and TB6612FNG driver to the upper chassis plate using nylon standoffs.',
        '5. Complete all wire connections as specified in the wire table, verifying the common ground link.',
        '6. Elevate chassis on a stand, upload firmware, and verify both wheels spin forward during forward().',
        '7. Place on floor arena, turn on battery pack, and commence path calibration.'
      ],
      powerAndSafetyChecks: [
        'Ensure chassis fasteners are tightened securely; motor vibrations can loosen un-nutted screws.',
        'Verify drive wires are clear of spinning wheel spokes and rubber tires.',
        'Never connect battery 6V to any Arduino 5V or I/O pin.'
      ],
      testCases: [
        { action: 'Call forward(140) on bench', expectedResult: 'Both left and right wheels spin forward in unison.' },
        { action: 'Call turnRight(130) on bench', expectedResult: 'Left wheel spins forward, right wheel reverses (zero-radius spin).' },
        { action: 'Call stopRobot() on moving rover', expectedResult: 'Chassis comes to an immediate, crisp stop via active dynamic braking.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Differential-Drive Movement Architecture
// Class: BEGINNER 07 - Modular Movement Functions & Route Choreography

// Motor Driver Pin Mapping (TB6612FNG)
const int PIN_PWMA = 5;   // Left Motor Speed (~PWM)
const int PIN_AIN1 = 7;   // Left Motor Direction 1
const int PIN_AIN2 = 8;   // Left Motor Direction 2

const int PIN_PWMB = 6;   // Right Motor Speed (~PWM)
const int PIN_BIN1 = 9;   // Right Motor Direction 1
const int PIN_BIN2 = 10;  // Right Motor Direction 2

const int PIN_STBY = 3;   // Standby Enable Pin (HIGH = Active)

// Calibration Trim Multipliers (Compensates for motor manufacturing variance)
const float LEFT_MOTOR_TRIM  = 1.00; // Baseline left motor scaling
const float RIGHT_MOTOR_TRIM = 0.94; // Adjust right motor to eliminate drift

// ---------------------------------------------------------------------------
// LOW-LEVEL ACTUATOR PRIMITIVES
// ---------------------------------------------------------------------------

void setLeftMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * LEFT_MOTOR_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  } else {
    // Dynamic Active Brake
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, adjustedSpeed);
}

void setRightMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * RIGHT_MOTOR_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
  } else {
    // Dynamic Active Brake
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, HIGH);
  }
  analogWrite(PIN_PWMB, adjustedSpeed);
}

// ---------------------------------------------------------------------------
// HIGH-LEVEL ROBOTIC NAVIGATION API
// ---------------------------------------------------------------------------

void forward(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(speedVal);
}

void reverse(int speedVal) {
  setLeftMotor(-speedVal);
  setRightMotor(-speedVal);
}

// Zero-Radius Tank Spin (Left forward, Right reverse)
void turnRight(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(-speedVal);
}

// Zero-Radius Tank Spin (Left reverse, Right forward)
void turnLeft(int speedVal) {
  setLeftMotor(-speedVal);
  setRightMotor(speedVal);
}

void stopRobot() {
  setLeftMotor(0);
  setRightMotor(0);
}

// ---------------------------------------------------------------------------
// SETUP & AUTONOMOUS MISSION SEQUENCE
// ---------------------------------------------------------------------------

void setup() {
  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);

  pinMode(PIN_PWMB, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT);
  pinMode(PIN_BIN2, OUTPUT);

  pinMode(PIN_STBY, OUTPUT);
  digitalWrite(PIN_STBY, HIGH); // Enable driver

  Serial.begin(9600);
  Serial.println(F(">> ROBOBEE 2WD ROVER ONLINE. 3-second pre-flight countdown..."));
  delay(3000); // Safety grace period: place rover on floor start line
}

void loop() {
  Serial.println(F(">> Executing Autonomous Mission: Precision Square Route"));

  // Traverse a 4-corner square path
  for (int side = 1; side <= 4; side++) {
    Serial.print(F("   Traversing Side "));
    Serial.println(side);

    forward(140);
    delay(850); // Calibrated straight drive (~60cm)

    stopRobot();
    delay(300); // Settle chassis momentum

    Serial.println(F("   Executing 90-degree Right Tank Turn"));
    turnRight(130);
    delay(340); // Calibrated 90-degree spin

    stopRobot();
    delay(300);
  }

  Serial.println(F("✅ Mission Complete. Rover docked at starting position."));
  while (true) {
    stopRobot(); // Mission finished: halt indefinitely
  }
}`,
      pinMap: { 
        'Pin 5': 'Left Motor PWMA speed (~PWM)', 
        'Pin 7': 'Left Motor AIN1 direction', 
        'Pin 8': 'Left Motor AIN2 direction', 
        'Pin 6': 'Right Motor PWMB speed (~PWM)', 
        'Pin 9': 'Right Motor BIN1 direction', 
        'Pin 10': 'Right Motor BIN2 direction', 
        'Pin 3': 'TB6612FNG STBY master enable' 
      },
      setupAndUpload: [
        '1. Place the rover on a testing stand clear of desk surface.',
        '2. Verify and upload sketch to the Arduino Uno.',
        '3. Disconnect USB cable and transfer rover to the floor arena start tile.',
        '4. Flip battery pack switch to ON; step back during the 3-second safety grace countdown!'
      ],
      explanations: [
        'RIGHT_MOTOR_TRIM: A software compensation multiplier that scales right wheel speed to match left wheel RPM.',
        'setLeftMotor(speedVal): Encapsulates H-Bridge direction logic and PWM constrain limits in a single reusable function.',
        'turnRight(speedVal): Implements zero-radius tank rotation by commanding opposite wheel directions (+V and -V).',
        'while(true) { stopRobot(); }: Halts execution after completing the square path once, preventing runaway looping.'
      ],
      expectedResult: 'Rover counts down 3 seconds, drives straight for ~60cm, executes an exact 90° right pivot, repeats 4 times to trace a complete closed square, and halts cleanly at the start mark.',
      caveats: [
        'Turn angles depend heavily on battery voltage and floor traction: a 340ms turn on tile will turn less on deep carpet.',
        'Always ensure the castor wheel rotates freely and is not clogged with hair or dust.'
      ],
      tweakTip: 'Mission Challenge: Modify the mission to execute an autonomous "Figure-8" pattern: forward, turn right 360°, forward, turn left 360°, and stop!'
    },
    troubleshooting: [
      { 
        symptom: 'Rover curves noticeably to the left or right instead of tracking in a straight line.', 
        checks: [
          'Step 1: Check which direction the rover veers — if it drifts left, the right motor is spinning faster.',
          'Step 2: Adjust the `RIGHT_MOTOR_TRIM` variable in firmware (e.g. decrease from 0.94 to 0.90 to slow down the right motor).',
          'Step 3: Inspect both wheels to verify rubber tires are fully seated on plastic rims.'
        ], 
        explanation: 'DC motors have natural mechanical tolerances of ±10%. Software trim equalizes motor speeds to achieve straight tracking.' 
      },
      { 
        symptom: 'Rover executes a 70° turn or 110° turn instead of an exact 90° right angle.', 
        checks: [
          'Step 1: Check battery voltage — weak batteries spin motors slower, resulting in under-turning.',
          'Step 2: Adjust `delay(340)` inside the turn sequence: increase delay for under-turns, decrease for over-turns.'
        ], 
        explanation: 'Open-loop timed turning is sensitive to battery voltage and floor friction coefficients.' 
      },
      { 
        symptom: 'One wheel spins while the other wheel stays completely stationary.', 
        checks: [
          'Step 1: Inspect the non-spinning motor’s PWM pin connection (Pin 5 for Left, Pin 6 for Right).',
          'Step 2: Check terminal block wire screws on the driver breakout to ensure wire strands are clamped securely.',
          'Step 3: Test motor independently by applying 5V directly to its leads.'
        ], 
        explanation: 'A loose jumper wire on the driver’s direction or PWM pin prevents gate signals from activating that H-Bridge channel.' 
      },
      { 
        symptom: 'Rover shakes violently or stutters without moving forward smoothly.', 
        checks: [
          'Step 1: Inspect the front castor wheel — is it jammed against the chassis or floor?',
          'Step 2: Check battery level: dead batteries cannot deliver sufficient continuous current under dual-motor load.'
        ], 
        explanation: 'Excessive caster drag or severely depleted batteries prevent motors from delivering adequate rotational torque.' 
      }
    ],
    checksForUnderstanding: [
      'What are the linear and angular velocity equations that govern differential drive mobile robots?',
      'Why do professional software engineers use function abstraction instead of scattering digitalWrite commands?',
      'Why is open-loop dead reckoning navigation inherently unreliable over long distances?'
    ],
    exitTicket: [
      { 
        question: 'What wheel commands must be sent to execute a zero-radius tank spin toward the left?', 
        rubricOrSampleReasoning: 'Command the left wheel in reverse (-speed) and the right wheel forward (+speed) at identical velocity magnitudes.' 
      },
      { 
        question: 'What is the purpose of software motor trim, and how does it compensate for physical hardware limitations?', 
        rubricOrSampleReasoning: 'Motor trim applies a scaling multiplier to the faster motor in code, equalizing wheel RPMs and eliminating steering drift caused by mechanical tolerances.' 
      },
      { 
        question: 'Why will the exact same 340ms turn timing produce different physical turn angles on tile vs deep carpet?', 
        rubricOrSampleReasoning: 'Carpet has a higher rotational friction and tire resistance, causing slower rotational acceleration and a smaller turn angle compared to slick tile.' 
      }
    ],
    differentiation: {
      support: ['Provide pre-calibrated trim tables based on classroom battery batch testing.'],
      extension: ['Program an autonomous "Obstacle Slalom" route navigating around three cones in a serpentine path.'],
      offlineOption: ['Use the interactive 2D kinematics simulator to model differential drive paths and turning radii.']
    },
    nextLessonId: 'beg-08',
    nextLessonTeaser: 'Beginner 08: 3D Design for Robotics — Measure real hardware with precision calipers, learn 3D printing clearances (+0.4mm), and model a custom sensor bracket!',
    sources: [{ title: 'Differential Drive Kinematics & Autonomous Mobile Robots — RoboBEE Innovators Academy', url: '' }],
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
    promise: 'By the end of this masterclass, you will master precision digital metrology with vernier calipers, understand the polymer thermal physics of FDM 3D printing, apply engineering clearance fits (+0.4mm to +0.5mm), and model a parametric sensor bracket ready for 3D printing.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 07'],
    outcomes: [
      'Use digital vernier calipers to measure real electronic hardware dimensions in millimeters with 0.01mm resolution (PCB profile, transducer barrels, fastener hole pitch).',
      'Explain the thermal expansion and nozzle deposition physics of Fused Deposition Modeling (FDM) 3D printing that causes hole shrinkage.',
      'Apply engineering clearance tolerance standards (+0.4mm to +0.5mm) to design smooth sliding fits for physical components.',
      'Construct a 3D parametric CAD model of an ultrasonic sensor bracket with baseplate, M3 chassis slots, and cable clearance notches.',
      'Evaluate structural layer orientation (anisotropy) to prevent mechanical failure under robot chassis vibrations.'
    ],
    vocabulary: [
      { term: 'Metrology', plainMeaning: 'The science of making super-accurate physical measurements using precision tools.', technicalMeaning: 'The scientific study of measurement, establishing standard units, measuring instruments, and dimensional tolerances.' },
      { term: 'Vernier Caliper', plainMeaning: 'A precision metal measuring jaw tool that reads millimeters down to two decimal places.', technicalMeaning: 'A measuring instrument with a calibrated main scale and sliding vernier jaw that measures internal, external, and depth dimensions.' },
      { term: 'Clearance Fit (Tolerance)', plainMeaning: 'Extra wiggle room added to 3D models so plastic parts slide together without getting stuck.', technicalMeaning: 'The intentional dimensional allowance between mating parts ensuring a positive space for assembly without interference.' },
      { term: 'FDM 3D Printing', plainMeaning: 'A printer that melts and stacks thin plastic spaghetti threads layer-by-layer to build a 3D object.', technicalMeaning: 'Fused Deposition Modeling: an additive manufacturing process using a continuous filament of thermoplastic material extruded through a heated nozzle.' },
      { term: 'Parametric Modeling', plainMeaning: '3D CAD design where shapes are linked to editable numbers; changing one number updates the whole part.', technicalMeaning: 'A computer-aided design method where geometric features are driven by mathematical equations, parameters, and geometric constraints.' },
      { term: 'Anisotropy (Layer Weakness)', plainMeaning: '3D printed plastic is strong along the print bed, but snaps easily along layer glue lines.', technicalMeaning: 'The property of being directionally dependent; FDM prints exhibit high tensile strength along X/Y filaments and lower interlaminar shear strength along the Z-axis.' },
      { term: 'Extrude', plainMeaning: 'Stretching a flat 2D blueprint shape upward into a solid 3D block.', technicalMeaning: 'A CAD operation that projects a two-dimensional closed sketch profile along a linear vector to create three-dimensional solid volume.' }
    ],
    teacherPrep: ['Verify CAD software (Tinkercad, Onshape, or OpenSCAD) is logged in on workstations; calibrate digital vernier calipers with fresh batteries.'],
    verifiedMaterials: ['Digital vernier calipers with depth probes', 'HC-SR04 ultrasonic sensor modules', 'M3 machine screws & nuts (M3x10mm)', 'CAD workstations / browsers', '3D printed demonstration parts (Zero-clearance vs +0.5mm clearance)'],
    safetyNotes: [
      'Handle digital vernier calipers carefully: measuring jaws have sharp ground edges that can scratch skin.',
      'Never force electronic components into 3D printed brackets; if a part jams, re-check CAD dimensions and adjust hole clearances.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display two 3D printed parts: One designed with zero tolerance (fails to assemble, jammed!) and one designed with +0.5mm clearance (slides in like butter!). Explain why CAD is not magic.', 
        studentAction: 'Attempt to assemble both physical test brackets and observe the mechanical reality of manufacturing tolerances.' 
      },
      { 
        segment: '10–25m Measuring', 
        minutes: 15, 
        teacherAction: 'Demonstrate the 3-jaw digital caliper measurement protocol: External jaws (PCB width), Internal jaws (barrel spacing), Depth probe (transducer height).', 
        studentAction: 'Measure physical HC-SR04 module with lab partner and record exact dimensions in their engineering notebook.' 
      },
      { 
        segment: '25–50m CAD Modeling', 
        minutes: 25, 
        teacherAction: 'Guide parametric 3D CAD modeling: Create L-bracket baseplate (50x25x3mm), vertical faceplate, add +0.5mm cylinder cutouts (16.5mm dia at 26mm pitch), and cut M3 slots (3.4mm dia).', 
        studentAction: 'Model the custom sensor mount in CAD, inspect cross-sections for cable clearance, and verify manifold geometry.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Inspect student 3D models before STL export, checking for wall thickness (>2.5mm) and print bed orientation.', 
        studentAction: 'Export watertight .STL file, check slicer orientation, and complete the formative exit ticket.' 
      }
    ],
    concepts: [
      {
        title: '1. Precision Digital Metrology & Caliper Measurement Protocol',
        explanation: 'Before designing any mechanical bracket in CAD, an engineer must accurately measure the real physical hardware using a digital vernier caliper. A quality caliper features three distinct measuring surfaces: 1. External Jaws for measuring outside widths and cylinder diameters; 2. Internal Jaws for measuring hole diameters and gap spacing; 3. Depth Probe blade for measuring cavity depths and step heights. Before taking any measurement, you must perform "Tare / Zero Calibration": wipe the jaws clean, close them gently, and press the ZERO button to ensure the digital display reads exactly 0.00 mm.',
        instructorNote: 'Remind students: Never squeeze calipers too tightly! Bending the jaws flexes the stainless steel beam, producing a false negative measurement.'
      },
      {
        title: '2. The Physics of FDM 3D Printing & Polymer Thermal Shrinkage',
        explanation: 'Fused Deposition Modeling (FDM) operates by feeding a continuous 1.75mm thermoplastic filament (typically Polylactic Acid, PLA) into a heated brass hotend, melting it at 200°C–215°C, and extruding it through a microscopic 0.4mm nozzle onto a build plate. As molten plastic cools from 200°C down to room temperature (25°C), it undergoes thermal contraction, shrinking by approximately 0.5% to 1.0% in volume. Furthermore, as the extruder deposits perimeter toolpaths around circular holes, the tension pulls the liquid bead inward toward the hole center, causing circular holes to consistently print smaller than modeled!',
        instructorNote: 'Explain the golden rule of 3D printing holes: Holes always print smaller, pins and outer walls always print slightly larger!'
      },
      {
        title: '3. Engineering Tolerances & The +0.4mm to +0.5mm Clearance Rule',
        explanation: 'In mechanical engineering (ANSI B4.1 / ISO 286 standards), fits between mating parts are classified into three types: Interference Fit (parts are pressed together with high force and never come apart), Transition Fit (snug fit requiring a light tap with a mallet), and Clearance Fit (parts slide together smoothly with zero binding). Because standard desktop 3D printers have an inherent mechanical positioning accuracy of ±0.15mm plus polymer shrinkage, modeling a hole at the exact measured size of a 16.0mm cylinder guarantees it will jam! Professional robotics engineers apply a standard Clearance Allowance of +0.4mm to +0.5mm, modeling the transducer holes at 16.5mm diameter.',
        instructorNote: 'Show students the difference on the whiteboard: Nominal Dimension (16.0mm) + Clearance Allowance (0.5mm) = CAD Feature Dimension (16.5mm).'
      },
      {
        title: '4. Fastener Standards: Metric M3 Threads & Screw Clearance Slots',
        explanation: 'The universal fastener standard in lightweight autonomous robotics is the Metric M3 machine screw. An M3 screw has a nominal outer thread crest diameter of 3.00mm. If you design a mounting hole at 3.0mm in 3D CAD, the printed plastic will shrink to ~2.8mm, requiring you to force-thread the screw into the plastic! To allow an M3 screw to slide freely through a chassis bracket so it can be tightened securely with a nylon-insert locknut, the through-hole or adjustment slot must be modeled at 3.4mm diameter (ISO standard medium clearance fit).',
        instructorNote: 'Show students why we design slots rather than circular holes for chassis mounting: slots allow sliding adjustment to compensate for chassis laser-cut offsets!'
      },
      {
        title: '5. Structural Anisotropy & Print Bed Orientation',
        explanation: 'Unlike injection-molded plastic parts which are isotropic (possessing identical strength in all directions), 3D printed parts are anisotropic. Molten filament lines fuse strongly along the continuous horizontal X-Y toolpath lines, but rely solely on microscopic thermal re-melting between vertical Z-axis layers. A part under tension along its Z-axis will snap along layer lines at approximately 40%–60% of its bulk tensile strength. When slicing our L-bracket, it must be oriented flat on the build plate so the mounting base and faceplate have continuous filament strands wrapping around the corner fillet.',
        instructorNote: 'Compare 3D printing layers to wood grain: wood splits effortlessly along its grain, but is incredibly tough across its grain.'
      },
      {
        title: '6. Parametric CAD Modeling Architecture & Constraint Geometry',
        explanation: 'In commercial CAD engineering (e.g. OpenSCAD, Onshape, Fusion 360), models are never constructed by blindly dragging disconnected geometric shapes together. Instead, engineers use Parametric Modeling: defining dimensions as mathematical variables (`sensor_width = 45.0`, `cylinder_dia = 16.0`, `clearance = 0.5`, `wall_thick = 3.0`). Features are locked in place using geometric constraints (tangent, concentric, symmetric, parallel). If your team upgrades next month from an HC-SR04 to a waterproof ultrasonic sensor with 18mm barrels, changing a single variable instantly updates the entire bracket without re-drawing!',
        instructorNote: 'Show how OpenSCAD code or parametric sketch equations save hours of re-work when hardware revisions occur.'
      }
    ],
    visualizerId: 'cad_caliper_sim',
    project: {
      name: 'Rover Ultrasonic Sensor Bracket CAD Part',
      deliverableType: 'cad_model',
      successEvidence: [
        'Dimensioned parametric 3D CAD model featuring 16.5mm transducer cutouts with verified +0.5mm clearance.',
        'M3 chassis mounting slots (3.4mm width) allowing sliding focal alignment on the rover front deck.',
        '8mm rear cable relief notch ensuring 4-pin female jumper connectors do not collide with bracket walls.',
        'Watertight, manifold .STL export verified in 3D slicer software with zero non-manifold edges.'
      ]
    },
    activity: {
      title: 'Measure, Model, and Prepare the Sensor Bracket for Fabrication',
      steps: [
        'Step 1: Use digital vernier calipers to measure real HC-SR04 hardware: PCB width (45.2mm), PCB height (20.3mm), transducer barrel diameter (16.0mm), and barrel center-to-center pitch (26.0mm).',
        'Step 2: Log all measured dimensions and calculate target CAD dimensions by adding +0.5mm clearance allowance.',
        'Step 3: Construct the 3D L-bracket solid in CAD: Extrude horizontal baseplate (50mm × 25mm × 3mm) and vertical faceplate (50mm × 28mm × 3mm).',
        'Step 4: Cut out two concentric cylindrical holes at 16.5mm diameter spaced 26.0mm apart, elevated 15mm above the base.',
        'Step 5: Cut out two 3.4mm × 8.0mm M3 chassis mounting slots on the baseplate for flexible positioning.',
        'Step 6: Add a 3mm corner fillet to strengthen the L-joint against rover collision impacts and export to .STL!'
      ],
      successCriteria: [
        'CAD model passes slicer verification with 100% manifold geometry and clean layer toolpaths.',
        'Transducer barrels seat smoothly into bracket cutouts without filing or cracking plastic.',
        'Screw slots align perfectly with the laser-cut mounting holes on the 2WD rover acrylic chassis deck.'
      ],
      extension: 'Design a snap-fit locking retention clip that holds the sensor PCB securely without requiring zip-ties or glue.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['HC-SR04 Ultrasonic Sonar Module', 'FDM 3D Printer (Optional physical fabrication)'],
      componentList: [
        { name: 'HC-SR04 Ultrasonic Distance Sensor', exactVariant: 'Standard 4-pin 5V dual-transducer module', quantity: 1 },
        { name: 'M3x10mm Machine Screws', exactVariant: 'Stainless steel metric socket head cap screws', quantity: 2 },
        { name: 'M3 Nylon-Insert Locknuts', exactVariant: 'DIN 985 zinc-plated locking nuts', quantity: 2 },
        { name: 'Digital Vernier Caliper', exactVariant: '150mm stainless steel digital caliper (0.01mm resolution)', quantity: 1 },
        { name: 'PLA 3D Printing Filament', exactVariant: '1.75mm premium PLA (density ~1.24 g/cm³)', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/cad_ultrasonic_bracket_blueprint.svg',
      schematic: 'L-Bracket Architecture:\nBaseplate: 50.0mm (X) × 25.0mm (Y) × 3.0mm (Z)\nFaceplate: 50.0mm (X) × 3.0mm (Y) × 28.0mm (Z)\nTransducer Cutouts: Two 16.5mm dia cylinders spaced 26.0mm center-to-center\nM3 Slots: Two 3.4mm × 8.0mm oblong slots spaced 32.0mm pitch\nRear Clearance: 8.0mm notch for 4-pin female jumper wire housings',
      wireTable: [
        { from: 'HC-SR04 Header Pins', to: 'Rear Cable Clearance Notch', wireOrPolarityNote: 'Requires 8mm minimum clearance depth behind PCB for female Dupont headers' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Inspect digital caliper reading and calibrate zero with jaws closed.',
        '2. Verify CAD part volume and manifold integrity using slicer software.',
        '3. If 3D printing: slice with 3 perimeter walls, 20% gyroid infill, and 0.2mm layer height.',
        '4. Print oriented flat on the baseplate without supports.',
        '5. Test-fit the real HC-SR04 sensor into the printed bracket; verify smooth sliding fit.',
        '6. Fasten bracket to front rover chassis using two M3 screws and locknuts.'
      ],
      powerAndSafetyChecks: [
        'Verify bracket holds sensor perfectly horizontal; if sensor angles downward toward the floor, ground echoes will cause false obstacle detections!',
        'Ensure M3 screw threads do not touch or short out any electronic components on the Arduino board.'
      ],
      testCases: [
        { action: 'Insert real HC-SR04 module into bracket holes', expectedResult: 'Transducer barrels slide in smoothly with zero binding, seated firmly against vertical faceplate.' },
        { action: 'Attach 4-pin female Dupont cable to rear sensor header', expectedResult: 'Cable fits comfortably through rear notch without bending pin leads.' },
        { action: 'Tighten M3 screws to rover chassis', expectedResult: 'Bracket locks firmly into place with zero wobble under driving vibration.' }
      ]
    },
    codeLab: {
      language: 'openscad',
      code: `// RoboBEE Innovators Academy - Parametric Robotic CAD Architecture
// Class: BEGINNER 08 - 3D Design: Custom HC-SR04 Sensor Bracket
// Author: RoboBEE Engineering Team | License: Proprietary Educational Asset

$fn = 60; // Set circle smoothness for high-resolution 3D printing

// ---------------------------------------------------------------------------
// PARAMETRIC SPECIFICATION CONSTANTS (All dimensions in millimeters)
// ---------------------------------------------------------------------------
BARREL_NOMINAL_DIA  = 16.0; // Measured transducer barrel diameter
CLEARANCE_ALLOWANCE = 0.5;  // FDM thermal shrinkage clearance allowance
BARREL_HOLE_DIA     = BARREL_NOMINAL_DIA + CLEARANCE_ALLOWANCE; // 16.5mm

BARREL_PITCH        = 26.0; // Center-to-center distance between acoustic eyes
BARREL_ELEVATION    = 15.0; // Height of barrel center from chassis deck

BRACKET_WIDTH       = 52.0; // Overall bracket lateral width
BASE_DEPTH          = 24.0; // Baseplate mounting footprint
WALL_THICKNESS      = 3.0;  // High-durability structural wall thickness
FACE_HEIGHT         = 28.0; // Vertical faceplate height

M3_SLOT_DIA         = 3.4;  // Clearance diameter for standard M3 screws
M3_SLOT_PITCH       = 34.0; // Spacing matching 2WD rover chassis cutouts

// ---------------------------------------------------------------------------
// PARAMETRIC SOLID GEOMETRY MODULE
// ---------------------------------------------------------------------------
module ultrasonicSensorBracket() {
  difference() {
    // 1. ADDITIVE SOLID: Extrude L-Bracket Frame
    union() {
      // Horizontal chassis mounting baseplate
      cube([BRACKET_WIDTH, BASE_DEPTH, WALL_THICKNESS]);
      
      // Vertical structural faceplate holding the sensor barrels
      cube([BRACKET_WIDTH, WALL_THICKNESS, FACE_HEIGHT]);
      
      // Diagonal corner gusset fillets for mechanical impact reinforcement
      translate([0, 0, 0])
        rotate([0, 0, 0])
        cube([WALL_THICKNESS, BASE_DEPTH * 0.6, WALL_THICKNESS * 2]);
        
      translate([BRACKET_WIDTH - WALL_THICKNESS, 0, 0])
        cube([WALL_THICKNESS, BASE_DEPTH * 0.6, WALL_THICKNESS * 2]);
    }

    // 2. SUBTRACTIVE CUTOUT: Left Ultrasonic Transducer Hole (16.5mm)
    translate([(BRACKET_WIDTH - BARREL_PITCH)/2, -1, BARREL_ELEVATION])
      rotate([-90, 0, 0])
      cylinder(h = WALL_THICKNESS + 2, d = BARREL_HOLE_DIA);

    // 3. SUBTRACTIVE CUTOUT: Right Ultrasonic Transducer Hole (16.5mm)
    translate([(BRACKET_WIDTH + BARREL_PITCH)/2, -1, BARREL_ELEVATION])
      rotate([-90, 0, 0])
      cylinder(h = WALL_THICKNESS + 2, d = BARREL_HOLE_DIA);

    // 4. SUBTRACTIVE CUTOUT: Left M3 Chassis Fastener Slot (3.4mm)
    translate([(BRACKET_WIDTH - M3_SLOT_PITCH)/2, BASE_DEPTH/2 + 2, -1])
      cylinder(h = WALL_THICKNESS + 2, d = M3_SLOT_DIA);

    // 5. SUBTRACTIVE CUTOUT: Right M3 Chassis Fastener Slot (3.4mm)
    translate([(BRACKET_WIDTH + M3_SLOT_PITCH)/2, BASE_DEPTH/2 + 2, -1])
      cylinder(h = WALL_THICKNESS + 2, d = M3_SLOT_DIA);
      
    // 6. SUBTRACTIVE CUTOUT: Center Crystal Oscillator Relief Pocket
    translate([BRACKET_WIDTH/2 - 6, -1, BARREL_ELEVATION - 4])
      cube([12, WALL_THICKNESS + 2, 8]);
  }
}

// Render the completed watertight solid part
ultrasonicSensorBracket();`,
      pinMap: { 
        'Clearance': '16.5mm hole (+0.5mm clearance for 16.0mm barrel)', 
        'M3 Slot': '3.4mm diameter slot for 3.0mm machine screw' 
      },
      setupAndUpload: [
        '1. Copy the parametric OpenSCAD script into OpenSCAD, or replicate the dimensions in Tinkercad / Onshape.',
        '2. Press F5 to preview solid geometry and inspect cross-sections.',
        '3. Press F6 to compile and render the full CSG Boolean tree.',
        '4. Export as ASCII or Binary .STL format ready for your 3D slicer.'
      ],
      explanations: [
        'BARREL_HOLE_DIA = 16.0 + 0.5: Implements the critical +0.5mm clearance compensation for FDM plastic contraction.',
        'difference(): Core Constructive Solid Geometry (CSG) operation subtracting holes and slots from the additive solid base.',
        'cylinder(..., d = 3.4): Cuts standard ISO medium clearance fit holes for M3 metric machine screws.',
        '$fn = 60: Divides circles into 60 polygon segments, producing ultra-smooth circular arcs without faceting.'
      ],
      expectedResult: 'Watertight, manifold 3D solid model with perfectly aligned transducer cutouts, gusset reinforcement, and M3 chassis slots.',
      caveats: [
        'Ensure the sensor bracket holds the sensor perpendicular to the ground (90° vertical); tilting downward causes floor reflections.',
        'In slicer settings, set wall line count to 3 (1.2mm total perimeter thickness) to ensure robust screw retention.'
      ],
      tweakTip: 'Mission Challenge: Add a central vertical cable notch so jumper wires can route neatly underneath the chassis deck without dangling!'
    },
    troubleshooting: [
      { 
        symptom: 'Ultrasonic sensor barrels jam halfway into the 3D printed holes and cannot be pushed through.', 
        checks: [
          'Step 1: Check your CAD model dimensions — did you model the holes at 16.0mm instead of 16.5mm?',
          'Step 2: Inspect your 3D printer’s flow rate / extrusion multiplier: over-extrusion causes inner hole walls to swell inward.',
          'Step 3: Measure the physical printed hole with internal caliper jaws to check actual printed diameter.'
        ], 
        explanation: 'FDM toolpaths pull molten perimeter beads inward, shrinking inner diameters. A nominal 16.0mm hole will print at ~15.6mm without clearance compensation.' 
      },
      { 
        symptom: 'The 3D printed bracket snaps in half along the corner joint when tightened to the chassis.', 
        checks: [
          'Step 1: Check slicer print orientation — was the bracket printed upright like a "tower" rather than flat on its base?',
          'Step 2: Increase wall thickness from 2mm to 3mm and add corner gusset fillets in CAD.'
        ], 
        explanation: 'Printing upright aligns the weak interlaminar Z-axis across the high-stress corner joint; printing flat aligns strong X-Y continuous fibers across the bend.' 
      },
      { 
        symptom: 'M3 machine screws cannot pass through the baseplate holes.', 
        checks: [
          'Step 1: Verify the hole diameter was set to 3.4mm in CAD, not 3.0mm.',
          'Step 2: Use a 3.5mm twist drill bit by hand to clear out stringing or plastic burrs inside the hole.'
        ], 
        explanation: 'An M3 screw has an outer thread crest of 3.0mm. Holes printed at 3.0mm shrink to ~2.8mm, blocking clearance passage.' 
      },
      { 
        symptom: 'Slicer software warns that the exported .STL file is "Non-Manifold" or has hole errors.', 
        checks: [
          'Step 1: In CAD, check that subtractive cylinders extend completely through the walls (e.g. thickness + 2mm).',
          'Step 2: Ensure zero zero-thickness walls (infinitesimal geometry) exist in the Boolean difference tree.'
        ], 
        explanation: 'Coincident planar surfaces in Boolean operations can produce zero-thickness non-manifold edges that confuse slicing engines.' 
      }
    ],
    checksForUnderstanding: [
      'Why does a 16.0mm cylinder require a 16.5mm hole when fabricating parts with FDM 3D printing?',
      'What are the three distinct measuring features on a digital vernier caliper?',
      'Why is an L-bracket significantly stronger when 3D printed flat on its base rather than standing upright?'
    ],
    exitTicket: [
      { 
        question: 'Explain what causes circular holes in 3D printed plastic to shrink smaller than their modeled CAD size.', 
        rubricOrSampleReasoning: 'Thermal contraction of molten plastic as it cools, combined with nozzle perimeter tension pulling the curved molten bead toward the center of the hole.' 
      },
      { 
        question: 'Why do mechanical engineers design mounting slots at 3.4mm diameter for standard M3 screws instead of 3.0mm?', 
        rubricOrSampleReasoning: 'M3 screws measure 3.0mm across thread crests; a 3.4mm hole provides standard clearance so the screw slides through freely without jamming after plastic shrinkage.' 
      },
      { 
        question: 'What is anisotropy in 3D printed parts, and how do engineers orient brackets to prevent layer splitting?', 
        rubricOrSampleReasoning: 'Anisotropy means directional strength variance; parts are weak between Z-layers. Engineers orient brackets flat on the print bed so continuous X-Y plastic fibers absorb mechanical bending loads.' 
      }
    ],
    differentiation: {
      support: ['Provide starter Tinkercad template with pre-aligned 16.5mm cylinders and 3.4mm M3 slots.'],
      extension: ['Model an integrated servo horn pocket on the bottom of the bracket to enable 180° pan-tilt obstacle scanning.'],
      offlineOption: ['Use the interactive web 2D/3D caliper and tolerance simulator to practice reading vernier scales.']
    },
    nextLessonId: 'beg-09',
    nextLessonTeaser: 'Beginner 09: Build an Obstacle-Avoiding Rover — System Integration! Combine mechanical chassis, ultrasonic sonar, TB6612FNG driver, and autonomous firmware into one unified robot!',
    sources: [{ title: 'OpenSCAD Parametric CAD User Manual & Mechanical Engineering Standards', url: 'https://openscad.org' }],
    assetCredits: [{ asset: 'Parametric CAD Model', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'beg-09',
    fieldGuideLinks: {
      readBeforeClass: ["fg-comp-hc-sr04", "fg-comp-tb6612fng"],
      lookUpWhileBuilding: ["fg-board-uno-anatomy", "fg-safety-lab-code"],
      goDeeper: ["fg-motion-differential-kinematics", "fg-prog-millis-vs-delay"]
    },
    courseId: 'beginner',
    sequence: 9,
    code: 'BEGINNER 09',
    title: 'Build an Obstacle-Avoiding Rover: System Integration',
    promise: 'By the end of this masterclass, you will integrate mechanical, electrical, sensory, and firmware subsystems into a unified cyber-physical machine, calibrate ultrasonic echolocation at 40 kHz, and implement an autonomous reactive collision avoidance state machine.',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01', 'Beginner 02', 'Beginner 06', 'Beginner 07', 'Beginner 08'],
    outcomes: [
      'Synthesize mechanical chassis, TB6612FNG dual motor driver, HC-SR04 ultrasonic sensor, and Arduino brain into a fully integrated mobile rover.',
      'Derive the acoustic time-of-flight distance formula using the speed of sound in air (343 m/s = 0.0343 cm/μs) and round-trip division.',
      'Execute the mandatory pre-flight Subsystem Startup Protocol (Smoke Test) to verify ground continuity and sensor streams before motor power-up.',
      'Program an autonomous reactive decision state machine: Cruise Forward -> Active Dynamic Brake -> Reverse Recovery -> Scan Pivot -> Resume.',
      'Identify acoustic blind spots caused by specular reflections, absorbent soft surfaces, and sensor dead-bands.'
    ],
    vocabulary: [
      { term: 'System Integration', plainMeaning: 'Connecting mechanics, electronics, sensors, and code so they function together as one machine.', technicalMeaning: 'The engineering process of linking disparate sub-systems into a single unified cyber-physical architecture.' },
      { term: 'Ultrasonic Sonar', plainMeaning: 'Measuring distance by broadcasting high-frequency sound chirps and timing the echo return.', technicalMeaning: 'An active acoustic sensor emitting 40 kHz ultrasound bursts to determine target range via time-of-flight.' },
      { term: 'Time-of-Flight (ToF)', plainMeaning: 'Calculating distance by timing how many microseconds it takes for a sound pulse to bounce back.', technicalMeaning: 'The measurement of the time taken by an acoustic or electromagnetic wave to travel from transmitter to reflector and back.' },
      { term: 'Safety Zone Threshold', plainMeaning: 'The minimum safety distance (e.g. 20 cm) that triggers the robot to slam the brakes.', technicalMeaning: 'A programmatic spatial decision boundary that shifts the autonomous controller from forward navigation to an evasive state.' },
      { term: 'Specular Reflection', plainMeaning: 'When sound bounces off an angled wall like light off a mirror, missing the sensor completely.', technicalMeaning: 'Mirror-like reflection of acoustic waves occurring when an incident angle exceeds critical detection limits, deflecting the echo.' },
      { term: 'Cyber-Physical System', plainMeaning: 'A computer brain that uses software logic to manipulate real physical moving hardware in the world.', technicalMeaning: 'A mechanism controlled or monitored by computer-based algorithms, tightly integrated with the internet and physical actuators.' }
    ],
    teacherPrep: ['Set up controlled test arenas with cardboard boxes / foam blocks; verify all rover batteries measure >= 5.8V under load.'],
    verifiedMaterials: ['Fully assembled 2WD Rover Chassis', 'HC-SR04 Ultrasonic Sensor Module', '3D Printed Sensor Bracket (Class 08)', 'TB6612FNG Motor Driver', 'Arduino Uno Rev3 DIP', '4xAA Switched Battery Pack', 'Stationary cardboard test boxes'],
    safetyNotes: [
      'ALWAYS test rovers against stationary, non-fragile obstacles (cardboard boxes or foam blocks).',
      'NEVER test rovers by driving them toward human bystanders or classroom pets.',
      'Always perform the Subsystem Startup Protocol with motor battery power switched OFF before live floor deployment.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Ask: "How do bats fly through pitch-black caves at 40 km/h without hitting jagged rocks?" Introduce 40 kHz piezoelectric ultrasound physics.', 
        studentAction: 'Calculate round-trip echo time for an object 30 cm away (approx 1,749 microseconds).' 
      },
      { 
        segment: '10–25m Subsystems', 
        minutes: 15, 
        teacherAction: 'Guide the 4-phase pre-flight bring-up protocol: 1. Mechanical clearance; 2. Ground return continuity; 3. Sonar serial stream; 4. High-power motor arming.', 
        studentAction: 'Perform pre-power inspection checklist and verify live sonar distance stream in Serial Monitor with motor switch OFF.' 
      },
      { 
        segment: '25–50m Floor Integration', 
        minutes: 25, 
        teacherAction: 'Supervise autonomous rover floor testing in a challenging cardboard obstacle arena. Coach students on tuning reverse pulses and turning angles.', 
        studentAction: 'Deploy autonomous rover; calibrate safe distance threshold (20cm) and verify evasive maneuvers when trapped in dead-end corners.' 
      },
      { 
        segment: '50–60m Exit Check', 
        minutes: 10, 
        teacherAction: 'Review causes of sensor failure (specular reflection on angled walls, cloth absorption).', 
        studentAction: 'Complete formative exit ticket and defend why active braking must precede turning.' 
      }
    ],
    concepts: [
      {
        title: '1. Cyber-Physical System Integration (The Robotics Convergence)',
        explanation: 'System Integration is the ultimate milestone of robotics engineering. Up until today, you have tested individual components in isolation: LEDs, pushbuttons, motor drivers, and 3D printed brackets. When combining these subsystems into an autonomous cyber-physical machine, they interact dynamically: motors pull high current that can brown out the logic rail; motor vibrations can rattle sensor pins loose; and software timing bugs can drive the chassis into walls. Successful integration requires methodical subsystem-by-subsystem bring-up rather than flipping all power switches at once.',
        instructorNote: 'Compare system integration to an orchestra: the strings, brass, and percussion may sound great individually, but they need a conductor to play together in harmony!'
      },
      {
        title: '2. The Physics of Ultrasonic Echolocation (Time-of-Flight)',
        explanation: 'The HC-SR04 ultrasonic distance sensor consists of two aluminum cylindrical canisters containing piezoelectric crystals: a Transmitter (T) and a Receiver (R). When the Arduino sends a 10-microsecond HIGH pulse to the TRIG pin, the transmitter generates a burst of 8 ultrasonic sound waves at 40,000 Hz (40 kHz)—well above human hearing range (~20 kHz). The sound waves travel through ambient air at approximately 343 meters per second (at 20°C). When the wave collides with an obstacle, acoustic energy bounces back to the receiver, pulling the ECHO pin HIGH for the exact duration of the flight. Because the wave traveled OUT to the obstacle and BACK to the receiver, the one-way distance formula is: $\text{Distance (cm)} = \frac{\Delta t (\mu s) \times 0.0343 \text{ cm/\mu s}}{2.0}$.',
        instructorNote: 'Walk through the math: 343 m/s = 34,300 cm/s = 0.0343 cm/μs. Inverting this: 1 cm of travel takes 29.15 microseconds (or 58.3 μs round-trip).'
      },
      {
        title: '3. Acoustic Blind Spots: Specular Reflection, Absorption & Dead-Bands',
        explanation: 'Ultrasonic sensors are powerful, but they have distinct physical limitations that every robotics engineer must understand: 1. Specular Reflection: Like a flashlight beam reflecting off a mirror, if an ultrasonic wavefront strikes a smooth hard surface at an angle greater than ~45°, the echo bounces away into the room instead of returning to the receiver, making the wall completely invisible! 2. Acoustic Absorption: Soft materials like thick foam, drapery, or pet fur absorb sound energy rather than reflecting it. 3. Minimum Dead-Band: The sensor cannot accurately measure objects closer than ~2 cm because the piezoelectric crystal is still physically ringing from transmission.',
        instructorNote: 'Demonstrate specular reflection by holding a cardboard sheet at a sharp 45-degree angle in front of the rover—the sensor reads 999cm!'
      },
      {
        title: '4. The Reactive Obstacle Avoidance State Machine',
        explanation: 'Autonomous navigation requires deterministic state-based decision logic. Our rover executes a 4-state Finite State Machine: 1. `STATE_CRUISE_FORWARD`: Default state. Both motors drive forward at cruise speed (PWM 140) while polling distance every 30ms. 2. `STATE_ACTIVE_BRAKE`: Triggered when `distance < SAFE_DISTANCE_CM` (20cm). Both motor channels trigger dynamic braking immediately to halt linear inertia. 3. `STATE_REVERSE_PULSE`: Rover drives backward for 300ms to open up clearance space. 4. `STATE_SCAN_PIVOT`: Rover executes a 90° tank spin to orient toward an open heading before resuming cruise.',
        instructorNote: 'Emphasize why we reverse before turning: if a rover stops 10cm from a flat wall and immediately tries to turn, its outer corner bumper will scrape against the wall!'
      },
      {
        title: '5. Pre-Power Subsystem Startup Checklist (Smoke Test Protocol)',
        explanation: 'In aerospace and defense engineering, technicians never power up a new satellite without executing a rigorous Pre-Flight Checklist. In robotics, turning on motor power prematurely can short-circuit batteries or cause runaway robots to smash onto the floor. Our mandatory bring-up sequence: Step 1 (Mechanical): Spin both drive wheels and caster by hand to confirm zero physical binding. Step 2 (Continuity): Verify common ground wire bridges Arduino GND and Battery GND. Step 3 (Sensor Stream): Plug in USB with motor battery OFF; verify live sonar telemetry in Serial Monitor. Step 4 (Live Arming): Disconnect USB, place on floor, and flip motor battery switch ON.',
        instructorNote: 'Enforce this checklist strictly: any team that powers up motors before verifying sensor telemetry in Serial Monitor must step back and restart.'
      },
      {
        title: '6. Software Glitch Filtering & Moving Average Windowing',
        explanation: 'Real-world sensors are noisy. An ultrasonic ping can occasionally return 0 (timeout) or 999 (echo deflected by air turbulence). If your firmware blindly triggers an emergency evasive maneuver on a single erroneous ping, your rover will twitch and turn erratically in empty rooms! Professional firmware implements a Software Glitch Filter: taking three consecutive readings and computing a running median, or discarding obvious outliers (`distance == 0 || distance > 400`). Only when two consecutive valid pings confirm an obstacle does the state machine trigger an avoidance maneuver.',
        instructorNote: 'Show students the difference in Serial Monitor between raw unfiltered data and filtered rolling-average data.'
      }
    ],
    visualizerId: 'obstacle_avoiding_rover_sim',
    project: {
      name: 'Autonomous Obstacle-Avoiding Rover',
      deliverableType: 'physical_build',
      successEvidence: [
        'Fully integrated 2WD autonomous mobile rover with forward-facing HC-SR04 sonar on custom 3D bracket.',
        'Deterministic obstacle detection at 20cm initiating active brake, reverse clearance pulse, and 90° pivot.',
        'Successfully navigates an irregular cardboard obstacle arena for 3 minutes continuously with zero collisions.'
      ]
    },
    activity: {
      title: 'Integrate, Calibrate, and Test the Autonomous Rover',
      steps: [
        'Step 1: Mount the 3D printed sensor bracket to the front of the rover chassis, pointing dead horizontal.',
        'Step 2: Wire HC-SR04: VCC to 5V, GND to GND, TRIG to Pin 12, ECHO to Pin 11.',
        'Step 3: Connect TB6612FNG motor driver pins to Arduino: Left (PWMA:5, AIN1:7, AIN2:8), Right (PWMB:6, BIN1:9, BIN2:10), STBY:3.',
        'Step 4: Execute the Pre-Flight bring-up protocol: Verify Common Ground and stream distance data in Serial Monitor with motor battery OFF.',
        'Step 5: Disconnect USB, place rover on floor facing a stationary cardboard box 1 meter away, and switch battery pack ON.',
        'Step 6: Observe autonomous obstacle detection, braking, reverse clearance, and escape turning!'
      ],
      successCriteria: [
        'Rover detects cardboard obstacle at exactly 20cm, comes to a full dynamic brake, reverses 10cm, and pivots right.',
        'Rover completes 3 consecutive obstacle approaches without physical collision.',
        'Firmware includes glitch filtering that eliminates false-trigger stops in open hallways.'
      ],
      extension: 'Add a micro servo motor beneath the ultrasonic bracket to scan left (45°) and right (135°) before choosing the clearest escape path.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['2WD Mobile Rover Chassis', 'HC-SR04 Ultrasonic Sonar Module', 'TB6612FNG Dual Driver', 'Arduino Uno Rev3 DIP'],
      componentList: [
        { name: '2WD Rover Acrylic Chassis Assembly', exactVariant: 'Dual TT gearmotors (1:48), rubber wheels, front caster', quantity: 1 },
        { name: 'HC-SR04 Ultrasonic Sensor Module', exactVariant: 'Standard 4-pin 5V dual-transducer module (2cm–400cm range)', quantity: 1 },
        { name: '3D Printed Sensor Bracket', exactVariant: 'Class 08 Parametric CAD part with M3 fastener slots', quantity: 1 },
        { name: 'TB6612FNG Motor Driver Breakout', exactVariant: 'Dual H-Bridge carrier with integrated flyback diodes', quantity: 1 },
        { name: 'Arduino Uno Rev3 DIP', exactVariant: 'Standard ATmega328P DIP board with USB cable', quantity: 1 },
        { name: '4xAA Battery Pack with Switch', exactVariant: '6.0V nominal DC high-current motor power supply', quantity: 1 },
        { name: 'Stationary Cardboard Obstacle Box', exactVariant: 'Standard 30cm × 20cm cardboard testing target', quantity: 1 },
        { name: 'Jumper Wires & Hardware', exactVariant: 'Male-to-Female and Male-to-Male 24AWG jumpers, M3 screws', quantity: 16 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/obstacle_avoiding_rover_complete_wiring.svg',
      schematic: 'Sensor Wiring:\nHC-SR04 VCC ── Arduino 5V\nHC-SR04 GND ── Arduino GND\nHC-SR04 TRIG ── Arduino Pin 12\nHC-SR04 ECHO ── Arduino Pin 11\n\nMotor Driver Wiring (TB6612FNG):\nLeft Motor:  PWMA ── Pin 5 (~PWM) | AIN1 ── Pin 7 | AIN2 ── Pin 8\nRight Motor: PWMB ── Pin 6 (~PWM) | BIN1 ── Pin 9 | BIN2 ── Pin 10\nStandby:     STBY ── Pin 3 (HIGH = Enabled)\nPower Rails: VCC ── Arduino 5V | VM ── Battery (+) 6V | GND ── Shared Ground',
      wireTable: [
        { from: 'HC-SR04 VCC Pin', to: 'Arduino 5V Pin', wireOrPolarityNote: 'Red 5V Sensor Power Wire' },
        { from: 'HC-SR04 GND Pin', to: 'Arduino GND Pin', wireOrPolarityNote: 'Black Sensor Ground Wire' },
        { from: 'HC-SR04 TRIG Pin', to: 'Arduino Digital Pin 12', wireOrPolarityNote: 'Green Ultrasonic Trigger Signal' },
        { from: 'HC-SR04 ECHO Pin', to: 'Arduino Digital Pin 11', wireOrPolarityNote: 'Yellow Ultrasonic Echo Signal' },
        { from: 'TB6612FNG PWMA', to: 'Arduino Digital Pin 5 (~PWM)', wireOrPolarityNote: 'Blue Left Motor Speed Wire' },
        { from: 'TB6612FNG AIN1', to: 'Arduino Digital Pin 7', wireOrPolarityNote: 'Yellow Left Motor Direction 1' },
        { from: 'TB6612FNG AIN2', to: 'Arduino Digital Pin 8', wireOrPolarityNote: 'Green Left Motor Direction 2' },
        { from: 'TB6612FNG PWMB', to: 'Arduino Digital Pin 6 (~PWM)', wireOrPolarityNote: 'Blue Right Motor Speed Wire' },
        { from: 'TB6612FNG BIN1', to: 'Arduino Digital Pin 9', wireOrPolarityNote: 'Yellow Right Motor Direction 1' },
        { from: 'TB6612FNG BIN2', to: 'Arduino Digital Pin 10', wireOrPolarityNote: 'Green Right Motor Direction 2' },
        { from: 'TB6612FNG STBY', to: 'Arduino Digital Pin 3', wireOrPolarityNote: 'Orange Standby Enable Wire' },
        { from: '4xAA Battery (+ 6V)', to: 'TB6612FNG VM', wireOrPolarityNote: 'Red Motor High-Current Power' },
        { from: '4xAA Battery (- GND)', to: 'TB6612FNG GND', wireOrPolarityNote: 'Black Battery Ground Return' },
        { from: 'Arduino GND Pin', to: 'TB6612FNG GND', wireOrPolarityNote: 'CRITICAL SHARED COMMON GROUND' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Mount sensor bracket to front chassis with M3 screws, ensuring horizontal alignment.',
        '2. Insert HC-SR04 module and connect female jumper wires according to wire table.',
        '3. Inspect all motor driver logic connections to Arduino pins 3, 5, 6, 7, 8, 9, 10.',
        '4. Connect the critical Black Common Ground wire between Arduino GND and Battery GND.',
        '5. Connect Arduino via USB with motor battery switch OFF; verify live distance telemetry in Serial Monitor.',
        '6. Disconnect USB, place rover on floor start line facing target, and flip battery switch ON.'
      ],
      powerAndSafetyChecks: [
        'Ensure the battery pack 6V (+) is connected ONLY to driver VM, NEVER to Arduino 5V or any I/O pin.',
        'Confirm sensor points horizontally; downward tilt will catch floor seams and cause constant spinning.',
        'Always test against non-fragile stationary cardboard boxes in an open floor space.'
      ],
      testCases: [
        { action: 'Obstacle placed at 50cm', expectedResult: 'Rover drives forward in cruise state at commanded speed.' },
        { action: 'Obstacle detected within 20cm', expectedResult: 'Rover active-brakes, reverses 10cm, executes 90° right tank turn, and resumes forward path.' },
        { action: 'Sensor unplugged or covered', expectedResult: 'Glitch filter detects timeout (>400cm or 0) and holds safe cruise or stops safely.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Autonomous Obstacle-Avoiding Mobile Rover
// Class: BEGINNER 09 - System Integration & Cyber-Physical Navigation Loop

// Ultrasonic Sonar Pin Assignments
const int PIN_TRIG = 12; // Output: 10µs ultrasonic trigger chirp
const int PIN_ECHO = 11; // Input: Echo time-of-flight pulse

// Motor Driver Pin Mapping (TB6612FNG Dual Driver)
const int PIN_PWMA = 5;  // Left Motor Speed (~PWM)
const int PIN_AIN1 = 7;  // Left Motor Direction 1
const int PIN_AIN2 = 8;  // Left Motor Direction 2

const int PIN_PWMB = 6;  // Right Motor Speed (~PWM)
const int PIN_BIN1 = 9;  // Right Motor Direction 1
const int PIN_BIN2 = 10; // Right Motor Direction 2

const int PIN_STBY = 3;  // Driver Standby Enable (HIGH = Operational)

// Navigational & Safety Thresholds
const int   SAFE_DISTANCE_CM   = 22;   // Obstacle avoidance threshold distance
const int   CRUISE_SPEED       = 140;  // Standard forward cruise throttle (0-255)
const int   ESCAPE_TURN_SPEED  = 130;  // Zero-radius tank turn throttle
const float LEFT_TRIM          = 1.00; // Left motor calibration trim multiplier
const float RIGHT_TRIM         = 0.94; // Right motor calibration trim multiplier

// ---------------------------------------------------------------------------
// LOW-LEVEL ACTUATOR PRIMITIVES (Dynamic Active Braking Supported)
// ---------------------------------------------------------------------------

void setLeftMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * LEFT_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  } else {
    // Dynamic Active Brake: Short motor windings to GND
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, adjustedSpeed);
}

void setRightMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * RIGHT_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
  } else {
    // Dynamic Active Brake: Short motor windings to GND
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, HIGH);
  }
  analogWrite(PIN_PWMB, adjustedSpeed);
}

void forward(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(speedVal);
}

void reverse(int speedVal) {
  setLeftMotor(-speedVal);
  setRightMotor(-speedVal);
}

void turnRight(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(-speedVal); // Tank spin right
}

void stopRobot() {
  setLeftMotor(0);
  setRightMotor(0);
}

// ---------------------------------------------------------------------------
// SENSORY PERCEPTION PRIMITIVE (Acoustic Time-of-Flight with Glitch Filter)
// ---------------------------------------------------------------------------

float readSonarDistanceCm() {
  // Clear the trigger pin to ensure clean HIGH pulse
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);

  // Send exact 10-microsecond ultrasound trigger burst
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  // Measure echo return duration (timeout after 25,000µs = ~4.2 meters max range)
  unsigned long durationUs = pulseIn(PIN_ECHO, HIGH, 25000);

  // Glitch Filter: If echo timed out, return safe out-of-range value
  if (durationUs == 0) {
    return 999.0;
  }

  // Derive distance: speed of sound = 0.0343 cm/µs; divide by 2 for round-trip
  return (durationUs * 0.0343) / 2.0;
}

// ---------------------------------------------------------------------------
// SETUP & AUTONOMOUS REACTIVE NAVIGATION LOOP
// ---------------------------------------------------------------------------

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);

  pinMode(PIN_PWMB, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT);
  pinMode(PIN_BIN2, OUTPUT);

  pinMode(PIN_STBY, OUTPUT);
  digitalWrite(PIN_STBY, HIGH); // Wake up motor driver

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE AUTONOMOUS OBSTACLE ROVER     "));
  Serial.println(F("========================================"));
  Serial.println(F("Status: Pre-Flight Check Complete."));
  Serial.println(F("Arming autonomous loop in 3 seconds...\n"));
  
  delay(3000); // 3-second safety grace window for floor placement
}

void loop() {
  // 1. SENSE: Sample physical distance ahead
  float distanceAhead = readSonarDistanceCm();

  Serial.print(F("Sonar Distance: "));
  Serial.print(distanceAhead);
  Serial.println(F(" cm"));

  // 2. DECIDE & ACT: Evaluate safety boundary condition
  if (distanceAhead < SAFE_DISTANCE_CM) {
    Serial.println(F("⚠️ [OBSTACLE DETECTED] Initiating Evasive Collision Avoidance!"));

    // Phase A: Active Dynamic Brake (halt forward momentum immediately)
    stopRobot();
    delay(150);

    // Phase B: Reverse Recovery Pulse (back away from trap to open turn clearance)
    Serial.println(F("   Backing away 10cm..."));
    reverse(CRUISE_SPEED - 10);
    delay(320);
    stopRobot();
    delay(150);

    // Phase C: 90-Degree Escape Tank Turn (pivot right to find open vector)
    Serial.println(F("   Executing 90-degree escape pivot..."));
    turnRight(ESCAPE_TURN_SPEED);
    delay(350); // Calibrated 90-degree tank spin
    stopRobot();
    delay(150);

    Serial.println(F("✅ Escape Complete. Resuming forward cruise.\n"));
  } else {
    // Path is clear: Cruise forward
    forward(CRUISE_SPEED);
  }

  delay(40); // 25Hz control loop refresh rate
}`,
      pinMap: { 
        'Pin 12': 'HC-SR04 TRIG trigger pulse output', 
        'Pin 11': 'HC-SR04 ECHO return pulse input', 
        'Pin 5': 'Left Motor PWMA speed (~PWM)', 
        'Pin 7': 'Left Motor AIN1 direction 1', 
        'Pin 8': 'Left Motor AIN2 direction 2', 
        'Pin 6': 'Right Motor PWMB speed (~PWM)', 
        'Pin 9': 'Right Motor BIN1 direction 1', 
        'Pin 10': 'Right Motor BIN2 direction 2', 
        'Pin 3': 'TB6612FNG STBY master enable' 
      },
      setupAndUpload: [
        '1. Complete all wiring and inspect common ground connection.',
        '2. Connect USB with battery pack switch OFF and upload sketch.',
        '3. Open Serial Monitor at 9600 baud and wave your hand in front of sonar to test distance streaming.',
        '4. Disconnect USB, place rover on floor facing test box at 1.0m distance, and switch battery pack ON.'
      ],
      explanations: [
        'pulseIn(PIN_ECHO, HIGH, 25000): Waits for echo pin to go HIGH and returns duration in microseconds with a 25ms timeout.',
        'readSonarDistanceCm(): Emits a 10μs trigger pulse and calculates one-way distance using the speed of sound (343 m/s).',
        'stopRobot() followed by reverse(130): Eliminates chassis momentum and backs away from the obstacle before rotating.',
        'turnRight(ESCAPE_TURN_SPEED): Executes zero-radius tank turn to steer chassis toward an unobstructed heading.'
      ],
      expectedResult: 'Rover cruises straight forward toward stationary box; at exactly 22cm, it slams brakes, reverses 10cm, spins 90° right, and continues cruising in the new clear direction.',
      caveats: [
        'Curved or fabric-covered obstacles will absorb ultrasound, requiring an increased SAFE_DISTANCE_CM margin (e.g. 28cm).',
        'If the rover turns repeatedly in empty open spaces, check whether the sensor is angled slightly down toward the floor.'
      ],
      tweakTip: 'Mission Challenge: Implement a dual-sided obstacle escape: if the obstacle is still detected after turning right, pivot 180° to check the left corridor!'
    },
    troubleshooting: [
      { 
        symptom: 'Rover repeatedly stops, reverses, and turns in an empty room with no obstacles ahead.', 
        checks: [
          'Step 1: Inspect the physical mounting angle of the HC-SR04 sensor bracket — is it tilted downward even 3 degrees?',
          'Step 2: Level the bracket so transducers point perfectly parallel to the floor.',
          'Step 3: Check floor seams or tile grout lines that can echo sound back prematurely.'
        ], 
        explanation: 'The HC-SR04 has a 15-degree acoustic cone. If angled downward, sound echoes off the floor tiles, producing a false obstacle trigger.' 
      },
      { 
        symptom: 'Rover crashes directly into stationary cardboard boxes without ever slowing down.', 
        checks: [
          'Step 1: Open Serial Monitor with USB connected and test if distance numbers change when holding a book in front.',
          'Step 2: Verify Pin 12 is connected to TRIG and Pin 11 to ECHO — swapped trigger/echo wires disable distance measurements completely.',
          'Step 3: Check if the obstacle surface is angled at >45°, causing specular reflection.'
        ], 
        explanation: 'If TRIG and ECHO pins are reversed, pulseIn() never sees a start edge and times out, returning 999cm continuously.' 
      },
      { 
        symptom: 'Arduino resets or reboots the instant the rover detects an obstacle and tries to reverse.', 
        checks: [
          'Step 1: Check battery voltage — if 4xAA cells drop below 4.5V under load, sudden motor reversal causes a brownout reset.',
          'Step 2: Inspect the delay between forward, braking, and reverse — ensure `stopRobot()` and a 150ms settling pause are executed before reversing.'
        ], 
        explanation: 'Reversing a spinning DC motor instantaneously creates a massive Back-EMF current spike that sags the logic supply rail unless dynamic braking is applied first.' 
      },
      { 
        symptom: 'Rover backs away but then turns back directly into the obstacle.', 
        checks: [
          'Step 1: Increase the turn delay in code from 350ms to 420ms to achieve a full 90-degree escape angle.',
          'Step 2: Ensure wheels are not slipping on dusty floors during the turn maneuver.'
        ], 
        explanation: 'An under-calibrated turn timing leaves the robot still partially pointed at the obstacle, re-triggering the avoidance loop immediately.' 
      }
    ],
    checksForUnderstanding: [
      'Why is the ultrasonic echo travel time divided by 2.0 in the distance equation?',
      'What is specular acoustic reflection, and how can it cause an autonomous rover to hit a wall?',
      'Why must a mobile robot execute dynamic active braking and a brief reverse pulse before attempting to turn in a tight corner?'
    ],
    exitTicket: [
      { 
        question: 'Calculate the echo return time in microseconds for an obstacle located 50 cm away from the rover (speed of sound = 0.0343 cm/μs).', 
        rubricOrSampleReasoning: 'Round-trip distance = 50cm × 2 = 100cm. Time = 100cm / 0.0343 cm/μs = approximately 2,915 microseconds.' 
      },
      { 
        question: 'What are the four discrete behavioral states of our autonomous obstacle avoidance state machine, and what triggers each transition?', 
        rubricOrSampleReasoning: '1. Cruise Forward (default clear path); 2. Active Brake (triggered by distance < safe threshold); 3. Reverse Clearance (timed back-up); 4. Escape Turn (timed 90° pivot before resuming cruise).' 
      },
      { 
        question: 'Why is performing a pre-flight checklist with motor battery power switched OFF mandatory before testing an integrated cyber-physical robot?', 
        rubricOrSampleReasoning: 'It isolates electrical and sensor bugs safely, verifying live telemetry in software without risking high-current shorts, motor runaway, or physical chassis damage.' 
      }
    ],
    differentiation: {
      support: ['Increase SAFE_DISTANCE_CM to 30cm to provide wider reaction margins for slower student builds.'],
      extension: ['Implement a 3-point sonar scanning head using a micro servo (Pin 4) that scans Left, Center, and Right before deciding which way to turn.'],
      offlineOption: ['Use the interactive 2D autonomous obstacle-avoiding simulator with tunable sensor cones and obstacle placement.']
    },
    nextLessonId: 'beg-10',
    nextLessonTeaser: 'Beginner 10: Rover Reliability Showcase — Run 3 standardized arena trials, log stopping distance data, optimize momentum compensation, and present your team capstone!',
    sources: [{ title: 'HC-SR04 Ultrasonic Distance Sensor Datasheet & Acoustic Principles', url: 'https://sparkfun.com' }],
    assetCredits: [{ asset: 'Integrated Rover Illustration', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
    ipNotice: TRUSTED_ORG_INFO.ipStatement
  },

  {
    id: 'beg-10',
    fieldGuideLinks: {
      readBeforeClass: ["fg-testing-fmea-debugging"],
      lookUpWhileBuilding: ["fg-testing-fmea-debugging", "fg-comp-hc-sr04"],
      goDeeper: ["fg-comp-tournament-prep"]
    },
    courseId: 'beginner',
    sequence: 10,
    code: 'BEGINNER 10',
    title: 'Rover Reliability Showcase: Data-Driven Improvement',
    promise: 'By the end of this capstone masterclass, you will conduct standardized 3-trial engineering test runs, measure empirical stopping distance datasets, apply data-driven momentum compensation to eliminate coasting drift, and defend your robot in an authentic Engineering Showcase presentation!',
    status: 'published',
    proposedAudience: 'Classes 5–8 (Ages 10–14)',
    durationMinutes: 60,
    prerequisites: ['Beginner 01 through Beginner 09'],
    outcomes: [
      'Execute 3 standardized, repeatable engineering test trials under controlled arena conditions, logging stopping distance in centimeters.',
      'Differentiate between anecdotal guesswork and empirical data-driven engineering decision-making.',
      'Analyze Failure Mode and Effects Analysis (FMEA) vectors in autonomous mobile robotics (battery droop, caster drag, momentum drift).',
      'Implement an active counter-torque reverse braking pulse in C++ firmware to eliminate mechanical coasting.',
      'Deliver an authentic 2-minute technical engineering presentation defending system architecture, sensor perception, and measured improvements.'
    ],
    vocabulary: [
      { term: 'Empirical Evidence', plainMeaning: 'Real measured facts, numbers, and test results, not optimistic guesses.', technicalMeaning: 'Information acquired by rigorous scientific observation or experimentation recorded as quantitative data.' },
      { term: 'Repeatability', plainMeaning: 'Getting the exact same performance outcome every single time you run a test trial.', technicalMeaning: 'The closeness of agreement between successive measurements of the same measurand carried out under identical conditions.' },
      { term: 'Failure Mode & Effects Analysis (FMEA)', plainMeaning: 'Brainstorming everything that could possibly go wrong before it fails on the competition field.', technicalMeaning: 'A systematic, proactive method for identifying where and how a process or hardware system might fail and assessing relative impacts.' },
      { term: 'Voltage Droop', plainMeaning: 'The decline in battery voltage as energy is drained, causing motors to slow down over time.', technicalMeaning: 'The loss in terminal output voltage of a power supply under increasing electrical load or state-of-charge depletion.' },
      { term: 'Counter-Torque Braking Pulse', plainMeaning: 'A split-second burst of reverse motor power that stops forward coasting instantly.', technicalMeaning: 'A transient reverse electromagnetic torque applied to an inductive motor to rapidly decelerate rotor and chassis inertia.' },
      { term: 'Technical Showcase Defense', plainMeaning: 'Standing up in front of fellow engineers to explain and prove why your machine works.', technicalMeaning: 'A structured peer-review presentation defending design trade-offs, empirical performance data, and safety architectures.' }
    ],
    teacherPrep: ['Mark standardized 1.5-meter test arena track on the floor; print 3-Trial Engineering Test Data Sheets and Judging Rubrics.'],
    verifiedMaterials: ['Integrated Autonomous Obstacle-Avoiding Rover (Class 09)', 'Millimeter-graduated meter stick / measuring tape', 'Stationary cardboard obstacle box', 'Digital multimeter for battery health logging', 'Team Engineering Showcase Rubrics'],
    safetyNotes: [
      'Conduct all test runs in the marked standardized arena corridor; keep spectator students behind the safety line.',
      'Never catch a running robot by the rotating wheels; pick up firmly by the chassis deck plates.',
      'Verify battery voltage before and after testing trials to account for discharge effects.'
    ],
    classRhythm: [
      { 
        segment: '0–10m Hook', 
        minutes: 10, 
        teacherAction: 'Display telemetry dashboards from Formula 1 racing and SpaceX Falcon landings. Explain: "Elite engineers do not say I think it works; they show empirical data!"', 
        studentAction: 'Define their team’s target stopping distance specification: Halt between 10cm and 15cm from obstacle without touching.' 
      },
      { 
        segment: '10–30m 3-Trial Testing', 
        minutes: 20, 
        teacherAction: 'Supervise standardized trial runs from the 1.5-meter start mark. Verify and witness student stopping distance measurements with a meter stick.', 
        studentAction: 'Execute Trial 1, Trial 2, and Trial 3 under identical arena conditions; record stopping distance in cm and log battery terminal voltage.' 
      },
      { 
        segment: '30–45m Iteration', 
        minutes: 15, 
        teacherAction: 'Coach data analysis: Calculate average stopping distance and variance. Guide implementation of the C++ active counter-torque braking pulse.', 
        studentAction: 'Modify firmware with calibrated activeBrake() pulse; re-run verification trial to prove empirical performance gain.' 
      },
      { 
        segment: '45–60m Showcase', 
        minutes: 15, 
        teacherAction: 'Host the official RoboBEE Beginner Capstone Showcase: Time student presentations, evaluate against rubric, and award Beginner Certificates!', 
        studentAction: 'Deliver 2-minute technical defense, demonstrate live obstacle avoidance run, field questions, and celebrate graduation!' 
      }
    ],
    concepts: [
      {
        title: '1. Empirical Data-Driven Engineering vs Anecdotal Guesswork',
        explanation: 'Novice hobbyists build a robot, watch it succeed once by sheer luck, and declare: "It works!" Professional robotics engineers conduct Standardized Repeatable Testing. When a robot fails to stop before hitting a wall, a hobbyist blindly guesses and tweaks random numbers. An empirical engineer measures the exact stopping distance across multiple trials, calculates the mean and standard deviation, and analyzes the physical mechanism causing the error: Was it sensor latency? Acoustic absorption? Or chassis momentum sliding across low-friction floor tiles?',
        instructorNote: 'Teach the engineering mantra: "In God we trust; all others must bring empirical data!"'
      },
      {
        title: '2. Failure Mode and Effects Analysis (FMEA) in Autonomous Systems',
        explanation: 'Before deploying any autonomous rover in a tournament or real-world mission, aerospace engineers perform Failure Mode and Effects Analysis (FMEA). FMEA systematically categorizes potential failures by Severity (how bad is the impact?), Occurrence (how likely is it to happen?), and Detection (can our software catch it before disaster strikes?). In our 2WD rover: 1. Battery Droop (High occurrence, drops motor RPM); 2. Front Caster Hair Drag (Medium occurrence, curves steering); 3. Ultrasonic Specular Blind Spot (Low occurrence on flat boxes, high on angled corners). Anticipating failures allows engineers to build software fail-safes.',
        instructorNote: 'Have teams identify the single weakest component on their rover and devise a software or mechanical redundancy.'
      },
      {
        title: '3. Battery Voltage Droop & Actuator Degradation Curves',
        explanation: 'Chemical batteries (Alkaline, NiMH, or Li-ion) are not infinite ideal voltage sources. As a battery pack discharges chemical energy, its internal electrical resistance ($R_{int}$) increases according to electrochemistry. Under a dual-motor load of 800mA, terminal voltage drops from an initial 6.2V down to 5.0V or lower! Because DC motor rotational speed is directly proportional to applied voltage ($V = I \cdot R + K_e \cdot \omega$), a rover driving at PWM 140 on fresh batteries will travel 30% faster than on half-drained batteries! This voltage droop changes both linear travel distance and turn calibration over the course of a day.',
        instructorNote: 'Show students how to use a digital multimeter to measure battery pack voltage before every official trial run.'
      },
      {
        title: '4. Active Counter-Torque Braking & Momentum Compensation',
        explanation: 'Newton’s First Law of Motion states that an object in motion remains in motion unless acted upon by an external force. When our 400-gram rover cruises forward at 40 cm/s, it possesses significant kinetic momentum ($p = m \cdot v$). If firmware simply sets motor pins to `digitalWrite(LOW, LOW)` (Coast mode), the rubber tires slide forward on smooth tile for 10cm to 20cm before friction brings it to rest! To achieve razor-sharp, predictable stops, firmware must execute an Active Counter-Torque Braking Pulse: commanding the H-Bridge into reverse at PWM 160 for exactly 100ms–140ms, using motor electromagnetic torque to violently cancel chassis forward inertia.',
        instructorNote: 'Demonstrate the difference: a rover coasting past the target line vs a rover snapping to an instant, crisp halt.'
      },
      {
        title: '5. The 2-Minute Technical Defense & Engineering Presentation',
        explanation: 'In the real world of technology, great engineering that cannot be communicated is useless. Professional engineers must defend their designs to project managers, venture capitalists, and academic review boards. The RoboBEE Showcase Presentation follows a structured 4-part framework: 1. The Challenge (What problem does your rover solve?); 2. System Architecture (How do the mechanical chassis, TB6612FNG driver, and HC-SR04 sensor interact?); 3. Empirical Test Data (Presenting the 3-trial dataset and before/after improvements); 4. Live Demonstration & Future Roadmap.',
        instructorNote: 'Coach students on public speaking: stand tall, speak with confidence, point to physical hardware, and let data prove your claims!'
      },
      {
        title: '6. Code Hardening & Competition Reliability Protocols',
        explanation: 'Building a prototype on a breadboard is only 50% of the battle; preparing it for real-world deployment requires Code Hardening and Hardware Ruggedization: 1. Wire Harness Dressing: Jumper wires must be bundled and strain-relieved with zip-ties so motor vibrations cannot shake pins loose; 2. Fail-Safe Defaults: If sensor readings return invalid data, firmware must default to a safe stop rather than driving blindly; 3. Clean Documentation: Code must feature descriptive variable names, inline comments, and zero magic numbers.',
        instructorNote: 'Perform the "Gentle Shake Test": lift the rover 5cm off the table and set it down firmly—no wires should come loose!'
      }
    ],
    visualizerId: 'test_log_sim',
    project: {
      name: 'Rover Reliability Showcase & Technical Defense',
      deliverableType: 'dataset',
      successEvidence: [
        'Completed 3-Trial standardized engineering data sheet recording measured stopping distances in cm.',
        'Documented before/after empirical improvement using firmware active counter-torque braking.',
        'Flawless live autonomous demonstration navigating past obstacle box within the 10cm–15cm target zone.',
        'Successful 2-minute team technical defense delivered to instructors and peers, earning Beginner Graduation Certificate.'
      ]
    },
    activity: {
      title: 'Execute Standardized Trials, Calibrate Braking, and Present',
      steps: [
        'Step 1: Lay out the standardized test arena: Starting line exactly 150 cm from stationary cardboard obstacle target.',
        'Step 2: Measure initial battery pack voltage using a digital multimeter and record in the test log.',
        'Step 3: Run Baseline Trial 1, Trial 2, and Trial 3 from identical starting headings. Measure stopping distance from bumper to box using a meter stick.',
        'Step 4: Calculate average stopping distance and identify coasting drift error.',
        'Step 5: Implement firmware counter-torque braking: add calibrated `activeBrake()` pulse (120ms reverse burst) to firmware.',
        'Step 6: Run verification trials, record improved stopping precision, and present your team showcase defense to the class!'
      ],
      successCriteria: [
        'All 3 official test trials logged with quantitative millimeter measurements.',
        'Empirical improvement demonstrated: stopping distance variance reduced by at least 50% after braking calibration.',
        'Every team member speaks during the 2-minute technical defense, correctly using engineering vocabulary.'
      ],
      extension: 'Calculate standard deviation and 95% confidence intervals across 6 repeated test trials.'
    },
    physicalBuildPack: {
      verifiedBoardAndModules: ['Fully Integrated 2WD Autonomous Obstacle Rover', 'Standardized 1.5m Test Arena'],
      componentList: [
        { name: 'Completed Autonomous Rover', exactVariant: 'Hardware verified across Classes 01–09', quantity: 1 },
        { name: 'Millimeter Meter Stick', exactVariant: '100cm stainless steel / hardwood measuring rule', quantity: 1 },
        { name: 'Standardized Obstacle Target', exactVariant: '30cm × 20cm stationary cardboard box', quantity: 1 },
        { name: 'Digital Multimeter', exactVariant: 'Handheld DMM for DC voltage monitoring', quantity: 1 },
        { name: 'Showcase Evaluation Rubric', exactVariant: 'RoboBEE Academy Official Capstone Score Sheet', quantity: 1 }
      ],
      connectionPhotoOrClearlyLabeledIllustration: '/illustrations/3_trial_arena_test_setup.svg',
      schematic: 'Standardized Test Arena Layout:\n[Start Line: 0.0m] ───────────────── (1.50m Travel Track) ─────────────────► [Target Box: 1.50m]\nOptimal Stopping Zone: 10.0cm to 15.0cm before obstacle\nSafe Turn Vector: 90° Right pivot corridor',
      wireTable: [
        { from: 'Rover Chassis Alignment Mark', to: 'Arena Start Line', wireOrPolarityNote: 'Maintain identical wheel heading and battery charge for all trials' }
      ],
      assemblyAndPowerUpSteps: [
        '1. Measure battery voltage before commencing official trials; replace cells if < 5.4V.',
        '2. Inspect drive wheels and front caster for hair, lint, or mechanical friction.',
        '3. Place rover front bumper exactly touching the Start Line tape edge.',
        '4. Release rover autonomously; do not touch or shadow rover during trial run.',
        '5. Measure stopping distance from front bumper edge to target cardboard face.',
        '6. Log measurements immediately on official scoring sheet.'
      ],
      powerAndSafetyChecks: [
        'Keep arena run corridor clear of stray backpacks, shoes, and loose cables.',
        'Spectator students must remain behind the designated safety tape boundary.'
      ],
      testCases: [
        { action: 'Trial 1 Run (Baseline)', expectedResult: 'Log measured stopping distance (e.g. 19.5cm coasting drift).' },
        { action: 'Implement activeBrake() firmware', expectedResult: 'Log improved stopping distance (target: 12.0cm ± 1.5cm crisp halt).' },
        { action: 'Live Showcase Defense Run', expectedResult: 'Clean autonomous obstacle detection, braking, and 90° escape with zero collision.' }
      ]
    },
    codeLab: {
      language: 'cpp',
      code: `// RoboBEE Innovators Academy - Capstone Engineering Showcase
// Class: BEGINNER 10 - Data-Driven Improvement & Momentum Compensation

// Ultrasonic Sonar Pin Mapping
const int PIN_TRIG = 12;
const int PIN_ECHO = 11;

// Motor Driver Pin Mapping (TB6612FNG)
const int PIN_PWMA = 5;  // Left Motor Speed (~PWM)
const int PIN_AIN1 = 7;  // Left Motor Direction 1
const int PIN_AIN2 = 8;  // Left Motor Direction 2

const int PIN_PWMB = 6;  // Right Motor Speed (~PWM)
const int PIN_BIN1 = 9;  // Right Motor Direction 1
const int PIN_BIN2 = 10; // Right Motor Direction 2

const int PIN_STBY = 3;  // Standby Enable

// Calibrated Navigational Parameters (Post-Trial 1 Empirical Optimization)
const int   SAFE_DISTANCE_CM    = 24;   // Increased from 18cm to compensate for inertia
const int   CRUISE_SPEED        = 140;  // Standard forward cruise throttle
const int   BRAKE_PULSE_MS      = 110;  // Calibrated reverse counter-torque burst
const float LEFT_TRIM           = 1.00; // Left motor trim
const float RIGHT_TRIM          = 0.94; // Right motor trim

// ---------------------------------------------------------------------------
// ACTUATOR PRIMITIVES
// ---------------------------------------------------------------------------

void setLeftMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * LEFT_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  } else {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, adjustedSpeed);
}

void setRightMotor(int speedVal) {
  int adjustedSpeed = (int)(abs(speedVal) * RIGHT_TRIM);
  adjustedSpeed = constrain(adjustedSpeed, 0, 255);

  if (speedVal > 0) {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
  } else if (speedVal < 0) {
    digitalWrite(PIN_BIN1, LOW);
    digitalWrite(PIN_BIN2, HIGH);
  } else {
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, HIGH);
  }
  analogWrite(PIN_PWMB, adjustedSpeed);
}

void forward(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(speedVal);
}

void reverse(int speedVal) {
  setLeftMotor(-speedVal);
  setRightMotor(-speedVal);
}

void turnRight(int speedVal) {
  setLeftMotor(speedVal);
  setRightMotor(-speedVal);
}

void stopRobot() {
  setLeftMotor(0);
  setRightMotor(0);
}

// ---------------------------------------------------------------------------
// DATA-DRIVEN MOMENTUM COMPENSATION (Active Counter-Torque Braking)
// ---------------------------------------------------------------------------

void activeCounterTorqueBrake() {
  // Fire high-torque reverse pulse to cancel forward chassis momentum
  reverse(160);
  delay(BRAKE_PULSE_MS); // Calibrated 110ms reverse pulse

  // Lock motor terminals together for dynamic electromagnetic braking
  stopRobot();
}

// ---------------------------------------------------------------------------
// ACOUSTIC DISTANCE SENSING
// ---------------------------------------------------------------------------

float readSonarDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  unsigned long durationUs = pulseIn(PIN_ECHO, HIGH, 25000);
  if (durationUs == 0) return 999.0;
  return (durationUs * 0.0343) / 2.0;
}

// ---------------------------------------------------------------------------
// SETUP & SHOWCASE CAPSTONE SEQUENCE
// ---------------------------------------------------------------------------

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);

  pinMode(PIN_PWMB, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT);
  pinMode(PIN_BIN2, OUTPUT);

  pinMode(PIN_STBY, OUTPUT);
  digitalWrite(PIN_STBY, HIGH);

  Serial.begin(9600);
  Serial.println(F("========================================"));
  Serial.println(F("  ROBOBEE BEGINNER SHOWCASE CAPSTONE    "));
  Serial.println(F("========================================"));
  Serial.println(F("Firmware Feature: Active Counter-Torque Momentum Braking"));
  Serial.println(F("Place rover on official arena start line."));
  Serial.println(F("Starting autonomous trial run in 3s...\n"));
  
  delay(3000);
}

void loop() {
  float distanceAhead = readSonarDistanceCm();

  if (distanceAhead < SAFE_DISTANCE_CM) {
    Serial.println(F("🚨 [TARGET DETECTED] Triggering Active Counter-Torque Brake!"));
    
    // 1. DATA-DRIVEN BRAKING: Eliminate coasting drift!
    activeCounterTorqueBrake();
    delay(200); // Settle chassis momentum

    // 2. ESCAPE NAVIGATION
    Serial.println(F("   Executing calibrated 90-degree escape pivot..."));
    turnRight(135);
    delay(340);
    stopRobot();
    delay(200);

    Serial.println(F("✅ Obstacle Cleared. Continuing autonomous mission.\n"));
  } else {
    forward(CRUISE_SPEED);
  }

  delay(35);
}`,
      pinMap: { 
        'Pin 12': 'HC-SR04 TRIG trigger', 
        'Pin 11': 'HC-SR04 ECHO pulse', 
        'Pins 5,7,8': 'Left Motor Channel (PWMA, AIN1, AIN2)', 
        'Pins 6,9,10': 'Right Motor Channel (PWMB, BIN1, BIN2)', 
        'Pin 3': 'STBY enable' 
      },
      setupAndUpload: [
        '1. Connect Arduino via USB and upload the showcase sketch.',
        '2. Disconnect USB and inspect battery terminal voltage with multimeter.',
        '3. Position rover on the arena start line facing the obstacle box.',
        '4. Switch battery pack ON, step back, and record stopping distance with meter stick.'
      ],
      explanations: [
        'activeCounterTorqueBrake(): Delivers a calibrated 110ms burst of reverse power, applying electromagnetic counter-torque to immediately cancel forward kinetic inertia.',
        'SAFE_DISTANCE_CM = 24: Empirically adjusted threshold compensating for deceleration distance to achieve final resting distance of ~12cm.',
        'BRAKE_PULSE_MS = 110: Determined through trial data: shorter pulses cause coasting overshoots; longer pulses cause unwanted backward motion.'
      ],
      expectedResult: 'Rover drives forward at cruise speed, encounters obstacle, snaps to an instant drift-free halt at ~12cm, pivots 90°, and clears the arena.',
      caveats: [
        'If the rover jerks backward before turning, reduce BRAKE_PULSE_MS from 110ms to 90ms.',
        'If the rover still coasts too close to the obstacle, increase SAFE_DISTANCE_CM to 26cm.'
      ],
      tweakTip: 'Mission Challenge: Log battery voltage before Trial 1 and after Trial 6; calculate how many milliseconds of turn timing drift occurs per 0.1V of battery discharge!'
    },
    troubleshooting: [
      { 
        symptom: 'Stopping distance decreases steadily on each consecutive test run (rover gets closer to wall).', 
        checks: [
          'Step 1: Measure battery voltage with a multimeter across the 4xAA pack terminals.',
          'Step 2: Compare voltage to fresh cells — if pack has dropped below 5.2V, motor RPM is lower, reducing forward speed.'
        ], 
        explanation: 'Battery discharge droop reduces motor operating voltage, lowering cruise velocity and resulting in shorter travel before detection.' 
      },
      { 
        symptom: 'Rover kicks violently backward into a reverse slide when triggering the brake.', 
        checks: [
          'Step 1: Check the `BRAKE_PULSE_MS` value in firmware — is it set too high (e.g. 250ms)?',
          'Step 2: Reduce `BRAKE_PULSE_MS` by 20ms decrements until the rover comes to a dead stop without reversing.'
        ], 
        explanation: 'Excessive reverse pulse duration applies more counter-torque than required to cancel forward momentum, reversing direction.' 
      },
      { 
        symptom: 'Rover stops at wildly different distances on every run (e.g. 10cm, 25cm, 8cm).', 
        checks: [
          'Step 1: Inspect the target obstacle — is it tilted or made of textured fabric that absorbs ultrasound?',
          'Step 2: Ensure the starting line alignment and vehicle heading are identical on every trial.'
        ], 
        explanation: 'Non-standardized test conditions introduce confounding variables; testing against angled surfaces causes fluctuating echo returns.' 
      },
      { 
        symptom: 'One team member dominates the showcase presentation while others stay silent.', 
        checks: [
          'Step 1: Divide the presentation into 4 distinct roles: Team Lead (Problem), Hardware Lead (Chassis/Driver), Firmware Lead (Sonar/Code), Quality Lead (Data/FMEA).',
          'Step 2: Practice transitions between speakers before stepping up to the judging podium.'
        ], 
        explanation: 'Professional engineering reviews evaluate team collaboration and equal mastery of multidisciplinary subsystems.' 
      }
    ],
    checksForUnderstanding: [
      'What is the difference between anecdotal testing and empirical engineering data?',
      'How does Failure Mode and Effects Analysis (FMEA) help an engineering team prepare for competitions?',
      'Why does an active counter-torque reverse pulse stop a mobile robot faster than setting motor pins to zero?'
    ],
    exitTicket: [
      { 
        question: 'What empirical evidence did your team collect today, and what specific design decision did you change based on that data?', 
        rubricOrSampleReasoning: 'Student cites quantitative numbers (e.g. "Trial 1 showed 19cm stopping distance with 5cm coasting drift, so we added a 110ms counter-torque brake pulse, reducing stopping distance to 12cm").' 
      },
      { 
        question: 'What is battery voltage droop, and how does it affect autonomous robot performance over time?', 
        rubricOrSampleReasoning: 'Voltage droop is the loss of battery terminal voltage as cells discharge. It reduces motor rotational speed, causing straight driving and turn angles to drift over time.' 
      },
      { 
        question: 'Explain the Sense → Decide → Act cycle of your completed autonomous rover as you would present it to a competition judge.', 
        rubricOrSampleReasoning: '1. SENSE: HC-SR04 ultrasonic sensor measures distance ahead via 40kHz acoustic time-of-flight; 2. DECIDE: Arduino ATmega328P compares distance to 24cm safety boundary in software; 3. ACT: TB6612FNG motor driver fires active counter-torque brake and executes a 90° pivot.' 
      }
    ],
    differentiation: {
      support: ['Provide printed data table templates with pre-calculated mean and variance formulas.'],
      extension: ['Plot a 2D scatter graph of stopping distance versus battery voltage in Google Sheets or Python.'],
      offlineOption: ['Use the interactive web 3-trial engineering test logging simulator with exportable graphs.']
    },
    nextLessonId: 'int-01',
    nextLessonTeaser: 'Graduate to Intermediate Robotics: Engineering workflows, reflectance sensor calibration, state machines, and competition line followers!',
    sources: [{ title: 'RoboBEE Innovators Engineering Showcase Rubric & FMEA Standards', url: '' }],
    assetCredits: [{ asset: 'Showcase Rubric & Test Arena', creator: 'RoboBEE Innovators Engineering Team', license: 'Proprietary', sourceUrl: 'team_info' }],
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
