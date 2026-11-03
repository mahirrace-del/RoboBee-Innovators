export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  status?: string;
  tags?: string[];
}

export interface LeaderData {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  group?: "leader" | "core" | string;
}

export interface AchievementData {
  id: string;
  title: string;
  year: string;
  description: string;
  image?: string;
  category?: string;
  milestoneType?: string;
  imageFit?: "contain" | "cover";
}

export interface MarqueeItem {
  id: string;
  name?: string;
  role?: string;
  image?: string;
}

export interface CompetitionCardItem {
  id: string;
  name: string;
  date?: string;
  location?: string;
  prizePool?: string;
  status?: string;
  divisions?: string[];
  description?: string;
  visibility?: string;
}

export const DEFAULT_ACHIEVEMENTS: AchievementData[] = [
  {
    id: "wice-2026",
    title: "World Invention Competition & Exhibition (WICE) 2026",
    year: "2026",
    category: "International Stage",
    milestoneType: "Global Contender",
    description: "Representing RoboBee Innovators and Team Bangladesh on the global stage in Malaysia with the HydroHelp autonomous agricultural robotics system.",
    imageFit: "contain",
  },
  {
    id: "nasa-space-apps-2026",
    title: "NASA Space Apps Challenge 2026 (National Round)",
    year: "2026",
    category: "NASA & BASIS",
    milestoneType: "National Finalist",
    description: "Selected for the National Round and Contender for Global Nominee with AstroHealth Guardian software for astronaut bio-telemetry.",
    imageFit: "contain",
  },
  {
    id: "firso-2026",
    title: "Fibonacci International Robot & STEM Olympiad (FIRSO) 2026",
    year: "2026",
    category: "National Tournament",
    milestoneType: "Competitive Contender",
    description: "National tournament contender at United International University (UIU), Dhaka in Robo Soccer, Mega Sumo, and Micromouse Maze Solving.",
    imageFit: "contain",
  },
  {
    id: "nrc-2026",
    title: "National Robotics Championship (NRC) 2026",
    year: "2026",
    category: "National Championship",
    milestoneType: "Active Contender",
    description: "500K BDT Prize Pool tournament at IUBAT Campus competing in Robo Soccer, Sumo Combat, and Junior Project Showcase.",
    imageFit: "contain",
  },
  {
    id: "inysia-2026",
    title: "InYSIA 2026 Indonesia International Award",
    year: "2026",
    category: "International Mentorship",
    milestoneType: "Delegation Mentor",
    description: "Technical mentorship and presentation coaching across 6 student teams representing Heritage School on the international stage in Yogyakarta, Indonesia.",
    imageFit: "contain",
  },
];

export const DEFAULT_LEADERS: LeaderData[] = [
  {
    id: "mahir-rahman",
    name: "Mostakim Rahman Mahir",
    role: "Team Leader & Head of Engineering",
    group: "leader",
    bio: "Lead Systems Architect, Tournament Captain, and Maker Lab Director at RoboBee Innovators. Mentoring student teams across robotics olympiads and STEM fairs.",
  },
  {
    id: "hardware-lead",
    name: "RoboBee Maker Lab Core",
    role: "Hardware & Autonomous Systems",
    group: "core",
    bio: "Designing embedded circuits, motor drivers, sensor arrays, and custom mechanical chassis for competitive battle and soccer robots.",
  },
  {
    id: "mentorship-team",
    name: "STEM Mentorship Delegation",
    role: "Curriculum & School Programs",
    group: "core",
    bio: "Instructing young makers across Class 5–10 at Heritage School, Ideal School, and international delegations.",
  },
];

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "hydrohelp",
    title: "HydroHelp — Autonomous Agricultural Robot",
    description: "Modular autonomous hydroponic robot combining a 4-DOF SCARA arm, central linear rail carriage, HuskyLens 2 vision sensor, and closed-loop smart irrigation.",
    status: "International Contender",
    tags: ["Agriculture", "SCARA Arm", "IoT", "AI Vision"],
  },
  {
    id: "mega-sumo",
    title: "Mega Sumo Heavyweight Battle Bot",
    description: "High-traction competitive combat robot equipped with border-detecting IR sensors, high-torque gearmotors, and hardened front pushing wedges.",
    status: "Tournament Ready",
    tags: ["Sumo", "Combat", "High-Torque", "Motors"],
  },
  {
    id: "robo-soccer",
    title: "Robo Soccer High-Agility Striker",
    description: "Fast differential drive robot with low-latency RF control, mechanical ball manipulation, and dynamic field maneuvering.",
    status: "Active Competition",
    tags: ["Robo Soccer", "RF Control", "Agility"],
  },
  {
    id: "micromouse",
    title: "Autonomous Micromouse Maze Solver",
    description: "High-speed maze-solving robot utilizing ultrasonic/IR distance arrays and left-hand rule / flood-fill navigation algorithms.",
    status: "Lab Tested",
    tags: ["Autonomous", "Micromouse", "Algorithms"],
  },
  {
    id: "robotic-arm",
    title: "4-DOF Custom Robotic Manipulator",
    description: "Precision servo-actuated robotic arm with 3D printed joints and interchangeable gripper for pick-and-place tasks.",
    status: "Lab Demonstration",
    tags: ["Robotic Arm", "3D Printing", "Servos"],
  },
  {
    id: "smart-sanitizer",
    title: "Contactless Touchless Sanitizer & Bin",
    description: "Automated contactless lid opening and dispenser system utilizing HC-SR04 ultrasonic sensors and micro servos.",
    status: "Deployed in School",
    tags: ["Automation", "Sensors", "Arduino"],
  },
];

export const DEFAULT_COMPETITIONS: CompetitionCardItem[] = [
  {
    id: "nrc-2026-event",
    name: "National Robotics Championship (NRC) 2026",
    date: "2026-11-20",
    location: "IUBAT Campus, Dhaka",
    prizePool: "500,000 BDT",
    status: "Active Recruitment",
    divisions: ["Robo Soccer", "Sumo Bot Combat", "Project Showcase Junior"],
    description: "Bangladesh's premier national tournament featuring 3 exclusive competitive divisions.",
  },
  {
    id: "firso-2026-event",
    name: "FIRSO 2026 National Round",
    date: "2026-12-05",
    location: "UIU Campus, Dhaka",
    prizePool: "National Trophies & Grants",
    status: "Active Entry",
    divisions: ["Robo Soccer", "Mega Sumo", "Micromouse Maze Solver"],
    description: "Fibonacci International Robot & STEM Olympiad national round.",
  },
];

export const DEFAULT_MARQUEES: MarqueeItem[] = [
  { id: "m1", name: "Mahir Rahman", role: "Team Leader" },
  { id: "m2", name: "RoboBee Innovator", role: "Hardware Builder" },
  { id: "m3", name: "STEM Builder", role: "Firmware Dev" },
];
