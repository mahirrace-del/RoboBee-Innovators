export interface HardwareVisualAsset {
  id: string;
  name: string;
  category: "microcontrollers" | "sensors" | "motors" | "wiring_schematics" | "robotics_photos";
  url: string;
  caption: string;
  specBadge: string;
  pinSummary?: string;
  defaultPins?: { number: number; label: string; pinName: string; note: string }[];
}

export const ROBOBEE_HARDWARE_ASSET_LIBRARY: HardwareVisualAsset[] = [
  // ==========================================================================
  // 1. MICROCONTROLLERS & POWER
  // ==========================================================================
  {
    id: "hw-arduino-uno-pinout",
    name: "Arduino Uno R3 Anatomy & Pinout",
    category: "microcontrollers",
    url: "/illustrations/arduino_uno_built_in_led_pin13.svg",
    caption: "Arduino Uno R3 (ATmega328P) • 14 Digital I/O, 6 PWM (~), 6 Analog (A0–A5)",
    specBadge: "MCU • 5V LOGIC • 16MHz",
    pinSummary: "5V, GND, D0–D13 (PWM: 3,5,6,9,10,11), A0–A5 (I2C: A4/SDA, A5/SCL)",
    defaultPins: [
      { number: 1, label: "Power Rail", pinName: "5V & GND", note: "Regulated 5V DC supply & common ground reference" },
      { number: 2, label: "Digital I/O", pinName: "Pins D2–D13", note: "5V digital HIGH/LOW; ~3,5,6,9,10,11 support 8-bit PWM" },
      { number: 3, label: "Analog Inputs", pinName: "Pins A0–A5", note: "10-bit ADC (0–1023 across 0V–5V); A4=SDA, A5=SCL" },
      { number: 4, label: "USB UART", pinName: "D0 (RX) / D1 (TX)", note: "Hardware Serial communication to PC at 9600/115200 baud" },
    ],
  },
  {
    id: "hw-breadboard-xray",
    name: "400-Point Solderless Breadboard X-Ray",
    category: "microcontrollers",
    url: "/illustrations/class1-breadboard-anatomy.svg",
    caption: "Internal Spring Clip X-Ray: Horizontal Power Rails (+ / -) & 5-Hole Vertical Columns",
    specBadge: "PROTOTYPING • 400 TIE-POINTS",
    pinSummary: "Red Rail (+5V), Blue Rail (GND), Columns a–e & f–j split by center IC trench",
  },
  {
    id: "hw-esp32-iot",
    name: "ESP32 Wi-Fi & Bluetooth Dual-Core Node",
    category: "microcontrollers",
    url: "/illustrations/esp32_telemetry_wiring.svg",
    caption: "ESP32 NodeMCU (240MHz Dual-Core, 3.3V Logic, Wi-Fi + BLE Web Server)",
    specBadge: "IOT MCU • 3.3V LOGIC • WI-FI",
    pinSummary: "3V3, GND, GPIO Digital/PWM, 12-bit ADC (0–4095), I2C/SPI/UART",
  },
  {
    id: "hw-dual-rail-power",
    name: "2S Li-Ion 7.4V Dual-Rail Power & Buck Architecture",
    category: "microcontrollers",
    url: "/illustrations/dual_rail_power_wiring.svg",
    caption: "Isolated Motor Power (7.4V VMS) + Regulated 5.0V Logic Rail with Star Ground",
    specBadge: "POWER • 2x 18650 LI-ION",
    pinSummary: "Battery (+) -> Kill Switch -> L298N VMS & LM2596 Buck -> 5V Logic",
  },

  // ==========================================================================
  // 2. WIRING SCHEMATICS & LEVEL 1-4 DIAGRAMS
  // ==========================================================================
  {
    id: "sch-led-blink",
    name: "External LED & 220Ω Resistor Breadboard Wiring",
    category: "wiring_schematics",
    url: "/illustrations/class1-external-blink-wiring.svg",
    caption: "Pin D8 -> 220Ω Resistor -> LED Anode (Long Leg) | LED Cathode -> GND",
    specBadge: "CLASS 01 • DIGITAL OUTPUT",
  },
  {
    id: "sch-led-polarity",
    name: "LED Polarity & Current-Limiting Resistor Physics",
    category: "wiring_schematics",
    url: "/illustrations/class1-led-polarity-resistor.svg",
    caption: "Anode (+) Long Leg vs. Cathode (-) Short Leg & Flat Rim + Ohm's Law",
    specBadge: "CLASS 01 • OHM'S LAW",
  },
  {
    id: "sch-button-pullup",
    name: "Pushbutton Digital Input & INPUT_PULLUP Wiring",
    category: "wiring_schematics",
    url: "/illustrations/arduino_button_input_pullup.svg",
    caption: "Tactile Pushbutton between Pin D2 (INPUT_PULLUP) and GND — Active-LOW Logic",
    specBadge: "CLASS 04 • DIGITAL INPUT",
  },
  {
    id: "sch-reaction-game",
    name: "Buzzer, LED & Button Reaction Timer Wiring",
    category: "wiring_schematics",
    url: "/illustrations/reaction_game_wiring.svg",
    caption: "Multi-I/O Wiring: Status LEDs + Piezo Buzzer + Tactile Trigger Switch",
    specBadge: "CLASS 05 • SOUND & LIGHT",
  },
  {
    id: "sch-potentiometer-a0",
    name: "Potentiometer 10-Bit Analog ADC & PWM Dimmer",
    category: "wiring_schematics",
    url: "/illustrations/potentiometer_analog_a0.svg",
    caption: "10kΩ Rotary Potentiometer Wiper -> Pin A0 (0–1023) -> PWM Pin D9 (0–255)",
    specBadge: "CLASS 06 • ANALOG ADC",
  },
  {
    id: "sch-sense-decide-act",
    name: "Sense → Think → Act Closed-Loop Architecture",
    category: "wiring_schematics",
    url: "/illustrations/class1-sense-decide-act.svg",
    caption: "Universal Robotics Control Triad: Sensors -> Microcontroller Brain -> Actuators",
    specBadge: "FOUNDATION • CONTROL LOOP",
  },
  {
    id: "sch-parts-gallery",
    name: "Complete Level 1–2 Robotics Kit Components Overview",
    category: "wiring_schematics",
    url: "/illustrations/class1-parts-gallery.svg",
    caption: "Arduino Uno, Breadboard, HC-SR04 Sonar, SG90 Servo, L298N Driver & Sensors",
    specBadge: "HARDWARE KIT • BOM",
  },

  // ==========================================================================
  // 3. SENSORS & VISION
  // ==========================================================================
  {
    id: "sen-ultrasonic-radar",
    name: "HC-SR04 Ultrasonic Sonar Distance Sensor & Bracket",
    category: "sensors",
    url: "/illustrations/cad_ultrasonic_bracket_blueprint.svg",
    caption: "40kHz Acoustic Time-of-Flight Distance Sensor: distanceCm = duration * 0.034 / 2",
    specBadge: "CLASS 07 • SONAR • 2–400cm",
    pinSummary: "VCC -> 5V | TRIG -> D9 | ECHO -> D10 | GND -> GND",
    defaultPins: [
      { number: 1, label: "5V Power", pinName: "VCC -> Arduino 5V", note: "Requires clean 5.0V supply for 40kHz transducer burst" },
      { number: 2, label: "Trigger Pulse", pinName: "TRIG -> Pin D9", note: "Send 10-microsecond HIGH pulse to fire ultrasonic wave" },
      { number: 3, label: "Echo Receiver", pinName: "ECHO -> Pin D10", note: "Measure pulse width in microseconds using pulseIn(10, HIGH)" },
      { number: 4, label: "Common Ground", pinName: "GND -> Arduino GND", note: "0V reference shared with microcontroller" },
    ],
  },
  {
    id: "sen-ir-line-array",
    name: "TCRT5000 Dual/Multi-Channel IR Line Follower Array",
    category: "sensors",
    url: "/illustrations/line_follower_integrated_wiring.svg",
    caption: "940nm Infrared Emitter & Phototransistor Reflectance Array (White vs. Black Line)",
    specBadge: "CLASS 16 & 29 • IR REFLECTANCE",
    pinSummary: "VCC -> 5V | GND -> GND | Left DO/AO -> A0 | Right DO/AO -> A1",
  },
  {
    id: "sen-mpu6050-imu",
    name: "MPU-6050 6-DOF Gyroscope & Accelerometer (I2C)",
    category: "sensors",
    url: "/illustrations/imu_orientation_wiring.svg",
    caption: "3-Axis MEMS Gyro + 3-Axis Accelerometer over 400kHz I2C Bus (0x68)",
    specBadge: "CLASS 31 • I2C IMU • 6-DOF",
    pinSummary: "VCC -> 5V | GND -> GND | SDA -> Pin A4 | SCL -> Pin A5",
  },
  {
    id: "sen-wheel-encoders",
    name: "Optical Slot Wheel Encoders & Odometry Interrupts",
    category: "sensors",
    url: "/illustrations/encoder_odometry_wiring.svg",
    caption: "20-Slot Optical Tachometer Discs on Hardware Interrupt Pins D2 (INT0) & D3 (INT1)",
    specBadge: "CLASS 31 • ODOMETRY • ISR",
    pinSummary: "Left Encoder OUT -> D2 (INT0) | Right Encoder OUT -> D3 (INT1)",
  },

  // ==========================================================================
  // 4. MOTORS, DRIVERS & SERVOS
  // ==========================================================================
  {
    id: "mot-servo-gripper",
    name: "SG90 / MG996R Servo Motor & Robotic Arm Gripper",
    category: "motors",
    url: "/illustrations/servo_gripper_wiring.svg",
    caption: "50Hz PWM Angular Actuator (0°–180°): Brown=GND, Red=5V, Orange=Signal (D9)",
    specBadge: "CLASS 08 & 23 • SERVO PWM",
    pinSummary: "Orange/Yellow -> Pin D9 | Red -> 5V Rail | Brown/Black -> GND",
  },
  {
    id: "mot-driver-hbridge",
    name: "Dual H-Bridge Motor Driver (L298N / TB6612FNG)",
    category: "motors",
    url: "/illustrations/motor_driver_tb6612_wiring.svg",
    caption: "Bidirectional H-Bridge Direction Control (IN1–IN4) + Independent PWM Speed (ENA/ENB)",
    specBadge: "CLASS 11 • H-BRIDGE DRIVER",
    pinSummary: "ENA -> D5 | IN1 -> D7 | IN2 -> D8 | IN3 -> D4 | IN4 -> D2 | ENB -> D3",
  },
  {
    id: "mot-2wd-rover-chassis",
    name: "2WD Differential-Drive Robot Rover Wiring Plan",
    category: "motors",
    url: "/illustrations/2wd_rover_wiring_plan.svg",
    caption: "Complete 2WD Chassis Layout: Dual BO Gear Motors, Driver, 2S Battery & Arduino",
    specBadge: "CLASS 12–13 • 2WD ROVER",
  },
  {
    id: "mot-obstacle-rover",
    name: "Autonomous Obstacle-Avoiding Sonar Rover Blueprint",
    category: "motors",
    url: "/illustrations/obstacle_avoiding_rover_complete_wiring.svg",
    caption: "Full Autonomous Rover Integration: HC-SR04 Turret + Servo + L298N + 2WD Chassis",
    specBadge: "CLASS 17–20 • AUTONOMOUS ROVER",
  },
  {
    id: "mot-mini-sumo",
    name: "Autonomous Mini-Sumo Combat Robot Architecture",
    category: "motors",
    url: "/illustrations/mini_sumo_priority_wiring.svg",
    caption: "Edge-Stop White Border IR Sensors + Opponent Search Sonar + 5-Second Safety Start",
    specBadge: "CLASS 33–36 • COMBAT SUMO",
  },

  // ==========================================================================
  // 5. HIGH-RESOLUTION ROBOTICS LAB PHOTOGRAPHY
  // ==========================================================================
  {
    id: "photo-arduino-workbench",
    name: "Arduino & Breadboard Engineering Workbench",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    caption: "Microcontroller Prototyping & Breadboard Circuitry on Lab Bench",
    specBadge: "PHOTO • ELECTRONICS LAB",
  },
  {
    id: "photo-humanoid-robot",
    name: "Autonomous Humanoid & Precision Robotics",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    caption: "Next-Generation Autonomous Robotics & AI Vision Platform",
    specBadge: "PHOTO • HERO VISUAL",
  },
  {
    id: "photo-student-team",
    name: "Collaborative Robotics Team & Tournament Prep",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    caption: "RoboBee Innovators Hands-On Friday Engineering Workshop",
    specBadge: "PHOTO • FRIDAY WORKSHOP",
  },
  {
    id: "photo-robotic-arm",
    name: "Multi-Axis Industrial & Educational Robotic Arm",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    caption: "3-DOF / 4-DOF Servo Kinematics & Pick-and-Place Automation",
    specBadge: "PHOTO • LEVEL 3 ARMS",
  },
  {
    id: "photo-pcb-soldering",
    name: "Close-Up Microcontroller PCB & Sensor Array",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    caption: "Precision Embedded Systems & Integrated Circuit Architecture",
    specBadge: "PHOTO • EMBEDDED HARDWARE",
  },
  {
    id: "photo-autonomous-rover",
    name: "Wheeled Autonomous Exploration Rover",
    category: "robotics_photos",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    caption: "Team Testing & Calibration of Autonomous Mobile Robots",
    specBadge: "PHOTO • LEVEL 2 & 4 ROVERS",
  },
];
