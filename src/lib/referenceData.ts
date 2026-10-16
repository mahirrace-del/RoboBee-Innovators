/**
 * RoboBEE Innovators - Arduino & Robotics Field Guide
 * Central Reference Data Layer
 * 
 * Sourced from official Arduino documentation, Microchip ATmega328P datasheets,
 * Toshiba semiconductor references, and verified tournament standards.
 * 
 * Copyright (c) RoboBEE Innovators. Proprietary curriculum & educational architecture.
 */

export type FieldGuideSectionId = 
  | 'foundations'
  | 'arduino'
  | 'board'
  | 'electronics'
  | 'components'
  | 'programming'
  | 'communication'
  | 'motion'
  | 'design'
  | 'testing'
  | 'safety'
  | 'competitions'
  | 'glossary'
  | 'cheatsheets';

export type ReadingLevel = 'explorer' | 'beginner' | 'intermediate' | 'advanced';

export interface FieldGuideEntry {
  id: string;
  slug: string;
  title: string;
  sectionId: FieldGuideSectionId;
  readingLevel: ReadingLevel;
  quickVersion: string; // 2-3 sentences
  fullExplanation: string; // Detailed prose
  workedExample?: string;
  commonMistakes: string[];
  tryItLessonId?: string;
  sourceIds: string[];
  applicableLessonIds: string[];
  tags: string[];
}

export interface BoardPinoutPin {
  pinNumber: string;
  name: string;
  header: 'Digital' | 'Analog' | 'Power' | 'ICSP';
  type: 'digital_io' | 'analog_in' | 'power_supply' | 'ground' | 'reference' | 'reset';
  pwmCapable: boolean;
  interruptCapable: boolean;
  specialFunctions: string[];
  voltage: string;
  maxRecommendedCurrent: string;
  absoluteMaxCurrent: string;
  caveats: string;
  officialCitation: string;
}

export interface ComponentCard {
  id: string;
  name: string;
  role: 'input' | 'output' | 'controller' | 'power' | 'mechanical';
  category: string;
  whatItDoes: string;
  confirmedVariant: string;
  pinLevelConnections: { pinName: string; connectsTo: string; purpose: string }[];
  electricalLimits: {
    operatingVoltage: string;
    maxCurrentOrTorque: string;
    datasheetSource: string;
  };
  safetyNote: string;
  linkedLessonId: string;
}

export interface ProgrammingFunctionEntry {
  id: string;
  name: string;
  signature: string;
  category: 'core' | 'io' | 'time' | 'math' | 'communication' | 'library';
  summary: string;
  parameters: { name: string; type: string; description: string }[];
  returnValue: string;
  exampleCode: string;
  commonMistakes: string[];
  officialDocUrl: string;
  introducedInLessonId: string;
}

export interface GlossaryTerm {
  term: string;
  category: 'robotics' | 'electronics' | 'programming' | 'mechanics' | 'competition' | 'sensors' | 'actuators';
  plainMeaning: string;
  technicalMeaning: string;
  relatedLessonIds: string[];
  fieldGuideEntryId?: string;
}

export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  summary: string;
  printableBulletPoints: string[];
  quickReferenceTable?: { col1: string; col2: string; col3?: string }[];
}

// ==========================================
// 1. SECTION DEFINITIONS
// ==========================================
export const FIELD_GUIDE_SECTIONS: { id: FieldGuideSectionId; title: string; icon: string; description: string }[] = [
  { id: 'foundations', title: 'Robotics Foundations', icon: 'Bot', description: 'Sense-decide-act loop, robot definitions, open vs closed loops, and real-world impact.' },
  { id: 'arduino', title: 'Arduino & Microcontrollers', icon: 'Cpu', description: 'What Arduino is, microcontroller vs computer, the official IDE workflow, sketches, and libraries.' },
  { id: 'board', title: 'Board Reference & Pinout', icon: 'Layers', description: 'Arduino Uno R3 anatomy, full interactive pinout, electrical ratings, and other microcontroller comparisons.' },
  { id: 'electronics', title: 'Electronics & Circuits', icon: 'Zap', description: "Ohm's Law, voltage, current, breadboards, schematics, polarity, resistor bands, and LED series calculations." },
  { id: 'components', title: 'Component Library', icon: 'Box', description: 'Datasheet cards for every confirmed sensor, driver, motor, servo, battery, and mechanical part.' },
  { id: 'programming', title: 'C++ Language Reference', icon: 'Code', description: 'The Arduino C++ subset taught in class: functions, pins, control flow, timers, state machines, and syntax.' },
  { id: 'communication', title: 'Communication & Protocols', icon: 'Radio', description: 'UART Serial, I2C bus, SPI, telemetry, and safe wireless practices.' },
  { id: 'motion', title: 'Motion, Motors & Control', icon: 'RotateCw', description: 'H-Bridges, PWM motor control, differential drive, kinematics, encoders, odometry, and PID feedback.' },
  { id: 'design', title: 'CAD & 3D Fabrication', icon: 'Compass', description: 'Measurement with calipers, mechanical tolerances, fastener sizing, 3D printing parameters, and lab safety.' },
  { id: 'testing', title: 'Testing & Engineering Practice', icon: 'ClipboardCheck', description: 'Test plans, data logging, graphing, failure analysis (FMEA), build logs, and presentation skills.' },
  { id: 'safety', title: 'Laboratory Safety Code', icon: 'ShieldAlert', description: 'Low-voltage mandate, battery handling, motor pinch points, instructor review gates, and eye safety.' },
  { id: 'competitions', title: 'Competitions & Rulebooks', icon: 'Trophy', description: 'Verified national tournament divisions (FIRSO, NRC), match procedures, arena specs, and inspection checklists.' },
  { id: 'glossary', title: 'Master Glossary', icon: 'BookOpen', description: 'Searchable dictionary of every technical term taught across all 36 curriculum lessons.' },
  { id: 'cheatsheets', title: 'Printable Cheat Sheets', icon: 'Printer', description: 'One-page print-friendly bench guides for pinouts, syntax, wiring checklists, and troubleshooting.' },
];

// ==========================================
// 2. ARDUINO UNO R3 BOARD PINOUT TABLE (OFFICIAL SPECIFICATIONS)
// Source: docs.arduino.cc/hardware/uno-rev3 & Microchip ATmega328P Datasheet
// ==========================================
export const ARDUINO_UNO_PINS: BoardPinoutPin[] = [
  // Power Header
  {
    pinNumber: 'POW-1',
    name: 'IOREF',
    header: 'Power',
    type: 'reference',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Shield I/O voltage reference (5.0V on Uno)'],
    voltage: '5.0V',
    maxRecommendedCurrent: 'N/A (Reference)',
    absoluteMaxCurrent: 'N/A',
    caveats: 'Provides reference voltage for compatible shields so they match 5V logic. Do not draw power for actuators.',
    officialCitation: 'Arduino Uno Rev3 Schematics & Documentation'
  },
  {
    pinNumber: 'POW-2',
    name: 'RESET',
    header: 'Power',
    type: 'reset',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Active-LOW hardware reset'],
    voltage: '5.0V pull-up',
    maxRecommendedCurrent: 'N/A',
    absoluteMaxCurrent: 'N/A',
    caveats: 'Pulling this pin LOW resets the microcontroller. Do not connect to positive power rails.',
    officialCitation: 'Microchip ATmega328P Datasheet, Section 10'
  },
  {
    pinNumber: 'POW-3',
    name: '3.3V',
    header: 'Power',
    type: 'power_supply',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Regulated 3.3V power output (from onboard LP2985-33 regulator)'],
    voltage: '3.3V DC (+/- 1%)',
    maxRecommendedCurrent: '50 mA',
    absoluteMaxCurrent: '50 mA (onboard regulator limit)',
    caveats: 'Supplies low-power 3.3V sensors. Never connect motors, servos, or high-power wireless modules to this pin.',
    officialCitation: 'Arduino Uno Rev3 Tech Specs'
  },
  {
    pinNumber: 'POW-4',
    name: '5V',
    header: 'Power',
    type: 'power_supply',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Regulated 5.0V output rail'],
    voltage: '5.0V DC',
    maxRecommendedCurrent: '400 mA (USB powered) / 800 mA (Barrel Jack powered)',
    absoluteMaxCurrent: '1.0 A (Onboard NCP1117 regulator limit with heatsink dissipation)',
    caveats: 'Used for logic circuits and small sensors. Do NOT power DC motors or servo stalls directly from this rail; it resets the board.',
    officialCitation: 'Arduino Uno Rev3 Tech Specs & Onboard Regulator Rating'
  },
  {
    pinNumber: 'POW-5',
    name: 'GND',
    header: 'Power',
    type: 'ground',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['System common ground (0V reference)'],
    voltage: '0V (Ground)',
    maxRecommendedCurrent: '200 mA (total return current through MCU package)',
    absoluteMaxCurrent: '200 mA',
    caveats: 'All external circuits, motor drivers, and sensors must share a common ground with this pin.',
    officialCitation: 'Microchip ATmega328P Datasheet, Electrical Characteristics'
  },
  {
    pinNumber: 'POW-6',
    name: 'GND',
    header: 'Power',
    type: 'ground',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['System common ground (0V reference)'],
    voltage: '0V (Ground)',
    maxRecommendedCurrent: '200 mA (total return current through MCU package)',
    absoluteMaxCurrent: '200 mA',
    caveats: 'Electrically identical to POW-5.',
    officialCitation: 'Microchip ATmega328P Datasheet'
  },
  {
    pinNumber: 'POW-7',
    name: 'VIN',
    header: 'Power',
    type: 'power_supply',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['External unregulated DC power input / battery input'],
    voltage: '7.0V - 12.0V DC (Recommended)',
    maxRecommendedCurrent: '1.0 A',
    absoluteMaxCurrent: 'Limits: 6.0V min (regulator drops out), 20.0V max (regulator overheats)',
    caveats: 'Feeds into the onboard 5V regulator. When powered via barrel jack, this pin outputs the jack voltage minus a diode drop (~0.7V).',
    officialCitation: 'Arduino Uno Rev3 Official Documentation'
  },

  // Analog Header (A0 - A5)
  {
    pinNumber: 'A0',
    name: 'Analog In 0 / Digital 14',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 0', 'General-purpose digital GPIO pin 14'],
    voltage: '0V - 5.0V DC (or 0 - AREF)',
    maxRecommendedCurrent: '20 mA (when used as digital output)',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Default analogRead(A0) yields 0 to 1023 (5.0V / 1024 = 4.88 mV per step).',
    officialCitation: 'ATmega328P Datasheet Section 24 (Analog-to-Digital Converter)'
  },
  {
    pinNumber: 'A1',
    name: 'Analog In 1 / Digital 15',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 1', 'General-purpose digital GPIO pin 15'],
    voltage: '0V - 5.0V DC',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'High input impedance (~100 MΩ); ideal for reading voltage dividers and potentiometers.',
    officialCitation: 'ATmega328P Datasheet Section 24'
  },
  {
    pinNumber: 'A2',
    name: 'Analog In 2 / Digital 16',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 2', 'Digital GPIO pin 16'],
    voltage: '0V - 5.0V DC',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Can be configured with pinMode(A2, OUTPUT) for standard digital control.',
    officialCitation: 'ATmega328P Datasheet Section 24'
  },
  {
    pinNumber: 'A3',
    name: 'Analog In 3 / Digital 17',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 3', 'Digital GPIO pin 17'],
    voltage: '0V - 5.0V DC',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Input voltages exceeding 5.5V will damage the internal clamping diodes.',
    officialCitation: 'ATmega328P Datasheet'
  },
  {
    pinNumber: 'A4',
    name: 'Analog In 4 / SDA (I2C Data)',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 4', 'I2C Serial Data line (SDA)', 'Digital GPIO pin 18'],
    voltage: '0V - 5.0V DC',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Shared with the dedicated SDA pin near the AREF header. If using I2C devices (Wire library), A4 cannot be used for analog readings.',
    officialCitation: 'ATmega328P Two-Wire Serial Interface (Section 22)'
  },
  {
    pinNumber: 'A5',
    name: 'Analog In 5 / SCL (I2C Clock)',
    header: 'Analog',
    type: 'analog_in',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['10-bit ADC channel 5', 'I2C Serial Clock line (SCL)', 'Digital GPIO pin 19'],
    voltage: '0V - 5.0V DC',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Shared with dedicated SCL pin. Required for I2C bus clock synchronization.',
    officialCitation: 'ATmega328P Two-Wire Serial Interface (Section 22)'
  },

  // Digital Header (Pins 0 - 13, GND, AREF, SDA, SCL)
  {
    pinNumber: '0',
    name: 'Digital Pin 0 (RX)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Hardware Serial Receive (RX)', 'Connected to ATmega16U2 USB chip'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Avoid connecting external sensors or buttons to Pin 0 while using Serial.print() or uploading sketches; causes upload conflicts.',
    officialCitation: 'Arduino Uno Rev3 Schematics'
  },
  {
    pinNumber: '1',
    name: 'Digital Pin 1 (TX)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Hardware Serial Transmit (TX)', 'Connected to ATmega16U2 USB chip'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Dedicated to PC Serial communication. Keep open for programming and debugging.',
    officialCitation: 'Arduino Uno Rev3 Schematics'
  },
  {
    pinNumber: '2',
    name: 'Digital Pin 2 (INT0)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: true,
    specialFunctions: ['External Hardware Interrupt 0 (INT0)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Used for attachInterrupt(digitalPinToInterrupt(2), isr, RISING/FALLING). Ideal for encoder channel A or emergency stop switch.',
    officialCitation: 'ATmega328P External Interrupts (Section 13)'
  },
  {
    pinNumber: '3',
    name: 'Digital Pin 3 (PWM ~ / INT1)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: true,
    specialFunctions: ['8-bit Hardware PWM (~490 Hz, Timer 2)', 'External Hardware Interrupt 1 (INT1)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Supports analogWrite(3, val). In the RoboBEE standard rover kit, this is reserved for Motor Driver STBY (or interrupt encoder).',
    officialCitation: 'ATmega328P Timer/Counter 2 (Section 18)'
  },
  {
    pinNumber: '4',
    name: 'Digital Pin 4',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Standard digital GPIO', 'Timer 0 external clock input (T0)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'General-purpose input/output. Often used for button inputs or ultrasonic trigger.',
    officialCitation: 'ATmega328P I/O-Ports (Section 14)'
  },
  {
    pinNumber: '5',
    name: 'Digital Pin 5 (PWM ~)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: false,
    specialFunctions: ['8-bit Hardware PWM (~980 Hz, Timer 0)', 'Timer 1 external clock input (T1)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'High-frequency PWM (~980 Hz) generated by Timer 0 (which also drives millis()). Standard assignment: Left Motor Speed (PWMA).',
    officialCitation: 'ATmega328P Timer/Counter 0 (Section 15)'
  },
  {
    pinNumber: '6',
    name: 'Digital Pin 6 (PWM ~)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: false,
    specialFunctions: ['8-bit Hardware PWM (~980 Hz, Timer 0)', 'Analog Comparator input (AIN0)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Standard assignment: Right Motor Speed (PWMB). Synchronized with Pin 5 timer frequency for balanced motor drive.',
    officialCitation: 'ATmega328P Timer/Counter 0 (Section 15)'
  },
  {
    pinNumber: '7',
    name: 'Digital Pin 7',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Standard digital GPIO', 'Analog Comparator input (AIN1)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Standard assignment: Left Motor Direction 1 (AIN1).',
    officialCitation: 'ATmega328P I/O-Ports (Section 14)'
  },
  {
    pinNumber: '8',
    name: 'Digital Pin 8',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['Standard digital GPIO', 'Timer 1 Input Capture (ICP1)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Standard assignment: Left Motor Direction 2 (AIN2).',
    officialCitation: 'ATmega328P I/O-Ports (Section 14)'
  },
  {
    pinNumber: '9',
    name: 'Digital Pin 9 (PWM ~)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: false,
    specialFunctions: ['16-bit Timer 1 PWM channel A (~490 Hz)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Standard assignment: Right Motor Direction 1 (BIN1) or Servo control. Note: using the <Servo.h> library disables PWM on pins 9 and 10.',
    officialCitation: 'Arduino Servo Library Documentation & Timer 1 Specs'
  },
  {
    pinNumber: '10',
    name: 'Digital Pin 10 (PWM ~ / SS)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: false,
    specialFunctions: ['16-bit Timer 1 PWM channel B (~490 Hz)', 'SPI Slave Select (SS)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Standard assignment: Right Motor Direction 2 (BIN2). If acting as an SPI master, pin 10 must remain an OUTPUT.',
    officialCitation: 'ATmega328P SPI (Section 19)'
  },
  {
    pinNumber: '11',
    name: 'Digital Pin 11 (PWM ~ / MOSI)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: true,
    interruptCapable: false,
    specialFunctions: ['8-bit Timer 2 PWM (~490 Hz)', 'SPI Master Out Slave In (MOSI)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Used for high-speed SPI bus data output to displays, radio modules, or SD cards.',
    officialCitation: 'ATmega328P SPI (Section 19)'
  },
  {
    pinNumber: '12',
    name: 'Digital Pin 12 (MISO)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['SPI Master In Slave Out (MISO)'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Used for SPI data reception from peripherals.',
    officialCitation: 'ATmega328P SPI (Section 19)'
  },
  {
    pinNumber: '13',
    name: 'Digital Pin 13 (SCK / Built-in LED)',
    header: 'Digital',
    type: 'digital_io',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['SPI Serial Clock (SCK)', 'Drives the yellow/amber onboard LED labeled L'],
    voltage: '5.0V TTL logic',
    maxRecommendedCurrent: '20 mA',
    absoluteMaxCurrent: '40 mA',
    caveats: 'Hardwired through an onboard LMV358 operational amplifier buffer to the surface-mount "L" LED. Can be controlled directly with LED_BUILTIN without any external jumper wires.',
    officialCitation: 'Arduino Uno Rev3 Schematics'
  },
  {
    pinNumber: 'AREF',
    name: 'Analog Reference (AREF)',
    header: 'Digital',
    type: 'reference',
    pwmCapable: false,
    interruptCapable: false,
    specialFunctions: ['External voltage reference for the analog ADC'],
    voltage: '0V - 5.0V DC input',
    maxRecommendedCurrent: 'N/A',
    absoluteMaxCurrent: 'Do not exceed VCC',
    caveats: 'If using an external voltage reference on this pin, you MUST call analogReference(EXTERNAL) before calling analogRead(). Otherwise, you short the internal 5V reference to AREF, permanently damaging the ATmega328P ADC multiplexer!',
    officialCitation: 'ATmega328P Datasheet Section 24.5 & Arduino Language Reference'
  }
];

// ==========================================
// 3. FIELD GUIDE ENTRIES (SECTIONS 7A - 7O)
// Written in original, age-appropriate prose with citations.
// ==========================================
export const FIELD_GUIDE_ENTRIES: FieldGuideEntry[] = [
  // 7A: Foundations
  {
    id: 'fg-foundations-what-is-robot',
    slug: 'what-is-a-robot',
    title: 'What Is a Robot? The Sense-Decide-Act Loop',
    sectionId: 'foundations',
    readingLevel: 'explorer',
    quickVersion: 'A robot is a programmable electromechanical system that senses its physical environment, makes decisions with a computational controller, and acts using motors or mechanisms to perform work without continuous human control.',
    fullExplanation: `At RoboBEE Innovators, we define a robot by its core autonomy: it is not simply a remote-controlled toy. A remote-controlled car requires a human thumb on every turn; a true robot observes its surroundings with sensors, processes those observations using a program, and moves actuators to achieve a mission.

Every autonomous robot operates continuously inside the Sense -> Decide -> Act loop:
1. SENSE: Transducers convert physical quantities (photons reflecting from a surface, sound echo transit times, or mechanical switch depressions) into electrical signals.
2. DECIDE: An embedded controller (such as an ATmega328P or ESP32) compares these electrical readings against programmed thresholds, computes mathematical control equations, or updates internal state machines.
3. ACT: The controller sends electrical control signals to actuators (DC motors through an H-Bridge, servo mechanisms, or optical indicators) to alter its physical reality.

When this sequence repeats 100 times per second, the robot demonstrates dynamic stability: it can follow a winding line, avoid sudden obstacles, or stabilize an inverted pendulum.`,
    workedExample: 'Consider the RoboBEE Obstacle-Avoiding Rover: Its ultrasonic transducer emits a 40 kHz chirp (Sense). The microcontroller calculates that distance = 14 cm, triggering an if-condition (Decide). The Arduino sets STBY=HIGH, left motor reverse, right motor forward to execute an evasive 90-degree pivot (Act).',
    commonMistakes: [
      'Confusing automated fixed machines (like a washing machine timer) with autonomous robots that dynamically react to environmental changes.',
      'Assuming robots require human-like artificial intelligence; simple deterministic conditional logic can achieve robust autonomous behavior.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['exp-01', 'exp-04', 'beg-01', 'int-01', 'adv-01'],
    tags: ['robotics', 'sense-decide-act', 'autonomy', 'foundations']
  },
  {
    id: 'fg-foundations-open-closed-loop',
    slug: 'open-vs-closed-loop',
    title: 'Open-Loop vs. Closed-Loop Control',
    sectionId: 'foundations',
    readingLevel: 'intermediate',
    quickVersion: 'Open-loop systems execute commands based solely on time or preset instructions without checking real outcomes. Closed-loop systems measure their actual physical state with sensors and feed back errors to continuously correct their output.',
    fullExplanation: `In engineering, control systems are divided into two fundamental architectures:

1. OPEN-LOOP CONTROL (Feedforward Only):
An open-loop system applies an actuator command for a fixed duration assuming ideal conditions. Example: "Drive both motors forward at PWM 180 for exactly 2.0 seconds." If battery voltage drops from 7.4V to 6.8V, or if wheel traction differs on carpet versus tile, the robot will veer off-course, yet the program has no way to know it failed.

2. CLOSED-LOOP CONTROL (Feedback Control):
A closed-loop system monitors the difference between the desired state (setpoint) and the measured state (process variable) to compute an error signal:
$$\\text{Error}(t) = \\text{Setpoint}(t) - \\text{Measured}(t)$$
The controller continuously adjusts motor PWM to drive the error toward zero. Example: In an autonomous line follower, if the center sensor detects it is drifting right of the black line (error = +2), the controller immediately increases left motor speed and slows the right motor until error = 0.`,
    workedExample: 'Open loop: delay(1000) forward. Closed loop: Read optical wheel encoder ticks in an ISR; if left ticks < right ticks, increase left PWM until tick rates equalize.',
    commonMistakes: [
      'Relying on delay() timing for robot navigation instead of measuring actual ground displacement.',
      'Failing to account for mechanical backlash and battery voltage sag in open-loop commands.'
    ],
    tryItLessonId: 'adv-05',
    sourceIds: ['atmega328p-datasheet'],
    applicableLessonIds: ['int-04', 'adv-04', 'adv-05', 'adv-09'],
    tags: ['control-theory', 'feedback', 'open-loop', 'closed-loop', 'pid']
  },

  // 7B: Arduino Fundamentals
  {
    id: 'fg-arduino-microcontroller-vs-computer',
    slug: 'microcontroller-vs-computer',
    title: 'What Is a Microcontroller vs. a Computer?',
    sectionId: 'arduino',
    readingLevel: 'beginner',
    quickVersion: 'A computer (like your PC or Raspberry Pi) runs a complex multi-tasking operating system with gigabytes of RAM. A microcontroller (like the Arduino ATmega328P) is a dedicated single-chip computer that executes one bare-metal C++ program in real-time with microsecond-level GPIO precision.',
    fullExplanation: `Students frequently ask why we do not use a smartphone or laptop to drive a robot motor directly.

1. MICROCONTROLLERS (e.g., ATmega328P, ESP32, STM32):
- Designed for hard real-time physical interfacing.
- Directly controls General Purpose Input/Output (GPIO) pins at the microsecond level.
- Executes bare-metal machine code with zero operating system overhead or background software updates.
- Low power consumption (milliamps), runs instantly upon power application, and features deterministic timing.
- Limited memory: The ATmega328P has only 32 KB of program Flash and 2 KB of SRAM!

2. GENERAL-PURPOSE COMPUTERS (e.g., PC, Laptop, Raspberry Pi):
- Designed for human interaction, graphical displays, multi-gigabyte files, and web browsing.
- Runs an operating system (Linux, Windows) with thread scheduling, memory management, and background tasks.
- Non-deterministic: A background OS task could delay a motor shutdown signal by 50 milliseconds, causing a competition robot to crash into an arena wall!`,
    workedExample: 'Robotics teams use the best of both: an onboard microcontroller handles high-speed motor PWM, encoder pulses, and safety kill-switches, while a companion computer (if needed) runs high-level camera vision or SLAM mapping.',
    commonMistakes: [
      'Attempting to run video processing or neural networks on a 16 MHz 8-bit ATmega328P.',
      'Connecting high-current inductive loads (motors, coils) directly to fragile microcontroller GPIO pins.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['arduino-uno-r3-docs', 'atmega328p-datasheet'],
    applicableLessonIds: ['beg-01', 'beg-03', 'adv-03', 'adv-08'],
    tags: ['microcontroller', 'arduino', 'hardware', 'embedded']
  },
  {
    id: 'fg-arduino-ide-workflow',
    slug: 'arduino-ide-and-toolchain',
    title: 'The Arduino IDE Toolchain: From C++ Code to Silicon',
    sectionId: 'arduino',
    readingLevel: 'beginner',
    quickVersion: 'The Arduino IDE uses an avr-gcc compiler toolchain to translate human-readable C++ sketches into binary machine code (.hex files), which is transferred over USB to the microcontroller bootloader via the avrdude utility.',
    fullExplanation: `When you click the "Verify" (check mark) and "Upload" (arrow) buttons in the Arduino IDE, a multi-step engineering compilation occurs:

1. PREPROCESSING:
The IDE converts your .ino sketch into standard C++ by generating function prototypes and appending #include <Arduino.h>.

2. COMPILATION (avr-gcc):
The GNU C++ compiler parses your code, checks syntax, and compiles functions (such as digitalWrite and setup) into assembly instructions optimized for the 8-bit AVR RISC architecture.

3. LINKING (avr-ld):
The linker combines your compiled code with the compiled Arduino core library and any external libraries (like <Wire.h> or <Servo.h>), producing an ELF executable.

4. OBJECT COPY (avr-objcopy):
The raw binary machine code is extracted into an Intel HEX (.hex) format file.

5. UPLOAD (avrdude):
The IDE resets the Arduino Uno via the USB-to-Serial converter (DTR line pulses LOW). The ATmega328P Optiboot bootloader runs for 500ms, detects incoming programming packets, writes the new binary into Flash memory, and immediately jumps to address 0x0000 to execute setup().`,
    workedExample: 'To upload: Connect USB cable -> Tools -> Board -> "Arduino Uno" -> Tools -> Port -> Select the verified COM port (e.g. COM3 or /dev/ttyUSB0) -> Click Upload.',
    commonMistakes: [
      'Leaving the Serial Monitor window open in a third-party application, which locks the COM port and causes avrdude: ser_open(): can\'t open device errors.',
      'Selecting the wrong COM port or an unconfirmed board profile.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['arduino-lang-reference', 'arduino-uno-r3-docs'],
    applicableLessonIds: ['beg-01', 'beg-03', 'beg-05', 'adv-03'],
    tags: ['ide', 'compiler', 'toolchain', 'upload', 'hex']
  },

  // 7C: Board Reference
  {
    id: 'fg-board-uno-anatomy',
    slug: 'arduino-uno-r3-anatomy',
    title: 'Arduino Uno Rev3 Board Anatomy & Electrical Limits',
    sectionId: 'board',
    readingLevel: 'beginner',
    quickVersion: 'The Arduino Uno Rev3 features an ATmega328P microcontroller running at 16 MHz with 14 digital I/O pins (6 PWM), 6 analog inputs, an onboard 5V regulator, USB-B interface, and strict 20 mA per-pin current limits.',
    fullExplanation: `The Arduino Uno Rev3 is the global reference standard for educational robotics. Understanding its physical layout and electrical limits prevents burned components and unexplainable resets:

KEY PHYSICAL SUBSYSTEMS:
- MICROCONTROLLER: Microchip ATmega328P in a 28-pin DIP or TQFP package, clocked by a 16.000 MHz ceramic resonator.
- USB INTERFACE: ATmega16U2 programmed as a USB-to-Serial converter. Powers the board and handles sketch uploads.
- POWER JACK: 2.1mm center-positive barrel connector. Feeds an onboard NCP1117 linear voltage regulator. Recommended supply: 7.4V to 12.0V DC.
- 5V REGULATOR: Regulates battery voltage down to 5.0V for the microcontroller and sensor headers. Dissipates excess voltage as heat.
- RESET BUTTON: Connects the ATmega328P RESET pin to GND, restarting program execution from setup().

CRITICAL SILICON CURRENT LIMITS (Datasheet Verified):
- Recommended DC Current per I/O Pin: 20.0 mA.
- Absolute Maximum Stress Rating per Pin: 40.0 mA. Drawing more than 40 mA can permanently burn out internal output transistors.
- Total Current for All Combined Pins: 200.0 mA (package limit for VCC/GND pins).
- 3.3V Pin Maximum Current: 50.0 mA (from the onboard low-dropout LP2985-33 regulator).`,
    workedExample: 'To safely drive an external red LED (forward voltage 2.0V, desired current 15 mA) from Pin 8 (5.0V): Resistance = (5.0V - 2.0V) / 0.015A = 200 Ohms. We use a standard 220 Ohm resistor (producing 13.6 mA), safely below the 20 mA limit!',
    commonMistakes: [
      'Connecting a DC motor directly between a digital pin and GND. Motors draw 500 mA+ stall currents and will instantly destroy the ATmega328P output pin!',
      'Powering the barrel jack with more than 12V while powering multiple sensors from the 5V pin; this causes the linear regulator to thermal-throttle and reboot.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['arduino-uno-r3-docs', 'atmega328p-datasheet'],
    applicableLessonIds: ['beg-01', 'beg-02', 'beg-03', 'beg-06', 'adv-02'],
    tags: ['uno', 'pinout', 'hardware', 'specifications', 'current-limits']
  },
  {
    id: 'fg-board-other-microcontrollers',
    slug: 'other-boards-comparison',
    title: 'Comparing Microcontrollers: Uno, Nano, Mega, ESP32, and STM32',
    sectionId: 'board',
    readingLevel: 'intermediate',
    quickVersion: 'While the Uno R3 uses 5V logic and an 8-bit AVR chip, modern advanced robotics often uses 3.3V 32-bit platforms such as the ESP32 (Wi-Fi/Bluetooth) or STM32 (ARM Cortex-M3). 5V signals will permanently damage 3.3V inputs without level shifters!',
    fullExplanation: `As robots scale in complexity, builders transition from the educational Uno R3 to specialized boards:

1. ARDUINO NANO:
- Microcontroller: ATmega328P (Identical to Uno R3).
- Architecture: 8-bit AVR, 16 MHz, 5V logic.
- Difference: Breadboard-friendly dual in-line pin layout; exposes two extra analog-only input pins (A6 and A7).

2. ARDUINO MEGA 2560:
- Microcontroller: ATmega2560.
- Architecture: 8-bit AVR, 16 MHz, 5V logic.
- Features: 54 digital I/O pins (15 PWM), 16 analog inputs, 4 hardware UART serial ports, 256 KB Flash memory. Ideal for multi-joint robotic arms or rover arrays.

3. ESP32 (NodeMCU / DevKit):
- Microcontroller: Tensilica Xtensa Dual-Core 32-bit, running at up to 240 MHz.
- Logic Voltage: 3.3V ONLY! Inputs are NOT 5V tolerant!
- Connectivity: Built-in 2.4 GHz Wi-Fi, Bluetooth Classic, and BLE.
- Memory: 520 KB SRAM, 4 MB external Flash.

4. STM32 ("Blue Pill" / STM32F103C8T6):
- Microcontroller: ARM Cortex-M3 32-bit, 72 MHz.
- Logic Voltage: 3.3V (some specific pins are 5V-tolerant).
- Highlights: Hardware DMA channels, high-speed rotary encoder interfaces, microsecond-accurate hardware timers.`,
    workedExample: 'Interfacing an HC-SR04 ultrasonic sensor with an ESP32: The sensor echo pin outputs 5.0V pulses. You MUST use a voltage divider (1kΩ and 2kΩ resistors) to step down the echo signal to 3.3V before connecting to an ESP32 GPIO.',
    commonMistakes: [
      'Plugging a 5V sensor output directly into an ESP32 GPIO pin, destroying the ESP32 input gate.',
      'Assuming all analogRead() functions return 0-1023; the ESP32 has a 12-bit ADC returning 0-4095.'
    ],
    tryItLessonId: 'adv-08',
    sourceIds: ['arduino-uno-r3-docs'],
    applicableLessonIds: ['adv-01', 'adv-08', 'adv-09', 'adv-11'],
    tags: ['esp32', 'stm32', 'nano', 'mega', 'logic-levels', '3.3v']
  },

  // 7D: Electronics Basics
  {
    id: 'fg-electronics-ohms-law',
    slug: 'ohms-law-and-circuits',
    title: "Ohm's Law, Power, and Electrical Safety",
    sectionId: 'electronics',
    readingLevel: 'beginner',
    quickVersion: "Ohm's Law defines the relationship between Voltage (V), Current (I), and Resistance (R): V = I × R. Electrical power dissipated as heat is calculated as P = V × I.",
    fullExplanation: `All electrical circuits obey fundamental physical laws:

1. VOLTAGE (V, measured in Volts):
Electrical potential difference: the "pressure" that pushes electrons through a conductor. Think of it as water pressure in a pipe.

2. CURRENT (I, measured in Amperes / Milliamperes):
The rate of electron flow through a closed circuit. 1 Ampere = 1 Coulomb of charge per second. Think of it as the volume of water flowing through the pipe.

3. RESISTANCE (R, measured in Ohms, Ω):
The opposition to current flow. High resistance allows only a trickle of current; low resistance allows massive flow.

THE GOLDEN EQUATION:
$$V = I \\times R \\quad \\implies \\quad I = \\frac{V}{R} \\quad \\implies \\quad R = \\frac{V}{I}$$

SHORT CIRCUITS:
When a positive power terminal (e.g., 5V) is connected directly to Ground (0V) with zero resistance ($R \\approx 0$), current approaches infinity ($I = 5V / 0\\Omega = \\infty$). In reality, wire resistance limits current to several amps, melting jumper wires, destroying battery cells, and blowing computer USB safety fuses.`,
    workedExample: 'A 5V digital output connects to a 1000 Ω resistor to ground. Current = 5V / 1000Ω = 0.005 A = 5 mA. Power dissipated = V × I = 5V × 0.005A = 0.025 Watts (well within a standard 0.25W resistor rating).',
    commonMistakes: [
      'Connecting an LED directly across 5V and GND without a current-limiting resistor, causing the LED silicon to vaporize within milliseconds.',
      'Using the wrong multiplier band when reading resistor color codes (e.g., confusing 220 Ω with 22 kΩ).'
    ],
    tryItLessonId: 'beg-02',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['exp-02', 'beg-02', 'beg-04', 'beg-06', 'adv-02'],
    tags: ['ohms-law', 'voltage', 'current', 'resistance', 'circuits', 'short-circuit']
  },
  {
    id: 'fg-electronics-breadboards',
    slug: 'breadboard-internal-anatomy',
    title: 'Breadboard Internal Anatomy & Prototyping Rules',
    sectionId: 'electronics',
    readingLevel: 'beginner',
    quickVersion: 'A solderless breadboard connects components using spring metal clips hidden beneath plastic rows. Power rails run continuously along the sides, while terminal rows connect horizontally in 5-pin groups separated by a central divider trough.',
    fullExplanation: `Breadboards allow students to assemble and modify circuits without soldering:

INTERNAL METAL TIE-POINT BUSES:
1. POWER RAILS (Buses):
The long columns along both outer edges (marked with Red '+' and Blue/Black '-') are connected vertically from top to bottom. Use the Red rail exclusively for positive supply (+5V or Battery) and the Blue/Black rail exclusively for Ground (GND).

2. TERMINAL ROWS (5-Pin Groups):
In the central area, numbered rows (1 to 30 or 60) contain groups of five connected holes (labeled a-b-c-d-e and f-g-h-i-j). Any wire pushed into hole 10a is electrically connected to 10b, 10c, 10d, and 10e.

3. THE CENTER DIVIDER (DIP Trough):
The 0.3-inch groove down the middle separates columns a-e from f-j. Dual In-line Package (DIP) ICs, such as the ATmega328P or optocouplers, straddle this trough so pins on opposite sides do not short together.`,
    workedExample: 'To wire a pushbutton: Place the button straddling the center divider. Connect one side to Pin 4, and the other side to the Blue Ground rail. Use INPUT_PULLUP in software.',
    commonMistakes: [
      'Plugging both legs of a resistor or LED into the exact same 5-hole row, short-circuiting the component.',
      'Assuming the power rails on the left side of the breadboard automatically connect to the power rails on the right side; you must bridge them with jumper wires!'
    ],
    tryItLessonId: 'beg-02',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['exp-02', 'beg-02', 'beg-03', 'beg-04', 'beg-06'],
    tags: ['breadboard', 'prototyping', 'circuits', 'wiring']
  },

  // 7E: Component Library
  {
    id: 'fg-comp-tb6612fng',
    slug: 'tb6612fng-motor-driver',
    title: 'TB6612FNG Dual H-Bridge Motor Driver',
    sectionId: 'components',
    readingLevel: 'intermediate',
    quickVersion: 'The TB6612FNG is a dual MOSFET H-bridge motor driver that controls the direction and speed of two DC motors up to 1.2A continuous (3.2A peak) from a 4.5V-15V motor supply, featuring far higher efficiency than obsolete L298N drivers.',
    fullExplanation: `Robots cannot connect DC motors directly to Arduino GPIO pins because a pin can only output 20 mA, whereas a spinning DC motor draws 300 mA to 1.5 A under load. The TB6612FNG solves this:

PIN CONNECTIONS & ROLES:
- VM: Motor Power Supply (+7.4V battery pack).
- VCC: Logic Power Supply (+5V from Arduino).
- GND: Common Ground (must connect to BOTH Arduino GND and Battery negative).
- STBY: Standby pin. MUST BE HELD HIGH (5V) for motors to turn. Setting STBY=LOW disables all outputs.
- PWMA / PWMB: Speed control pins. Connected to Arduino PWM pins (Pins 5 and 6).
- AIN1 / AIN2: Motor A Direction pins.
- BIN1 / BIN2: Motor B Direction pins.

TRUTH TABLE (Per Motor Channel):
| IN1 | IN2 | PWM | Mode |
|---|---|---|---|
| HIGH | LOW | PWM | Forward (Clockwise) |
| LOW | HIGH | PWM | Reverse (Counter-Clockwise) |
| HIGH | HIGH | Any | Short Brake (Dynamic braking) |
| LOW | LOW | Any | Stop (Coast / High Impedance) |`,
    workedExample: 'To turn Left Motor Forward at 75% speed: Set STBY=HIGH, AIN1=HIGH, AIN2=LOW, analogWrite(PWMA, 191).',
    commonMistakes: [
      'Forgetting to pull STBY HIGH, leaving motors completely dead despite correct PWM signals.',
      'Omitting the common ground wire between Arduino GND and Battery GND, causing erratic motor twitching.'
    ],
    tryItLessonId: 'beg-06',
    sourceIds: ['toshiba-tb6612fng'],
    applicableLessonIds: ['beg-06', 'beg-07', 'beg-09', 'beg-10', 'int-04', 'int-05'],
    tags: ['motor-driver', 'h-bridge', 'tb6612fng', 'dc-motor', 'pwm']
  },
  {
    id: 'fg-comp-hc-sr04',
    slug: 'hc-sr04-ultrasonic-sensor',
    title: 'HC-SR04 Ultrasonic Distance Sensor',
    sectionId: 'components',
    readingLevel: 'beginner',
    quickVersion: 'The HC-SR04 uses 40 kHz ultrasonic sound waves to measure distance from 2 cm to 400 cm with 3 mm accuracy by measuring the round-trip travel time of an emitted sound burst.',
    fullExplanation: `The HC-SR04 features two cylindrical acoustic transducers: an ultrasonic speaker (Transmitter, T) and a high-sensitivity ultrasonic microphone (Receiver, R).

OPERATING PRINCIPLE:
1. The Arduino sends a 10-microsecond HIGH pulse to the TRIG pin.
2. The onboard sensor circuitry generates an 8-cycle burst of 40 kHz ultrasound and pulls the ECHO pin HIGH.
3. The sound waves travel through the air, reflect off an obstacle, and strike the receiver.
4. The moment the echo is detected, the sensor drops the ECHO pin LOW.
5. The Arduino measures the duration the ECHO pin remained HIGH using pulseIn(echoPin, HIGH).

THE CALCULATION:
The speed of sound in air at 20°C is approximately 343 m/s (or 0.0343 cm/µs). Because the sound travels to the obstacle and back:
$$\\text{Distance (cm)} = \\frac{\\text{Echo Time (µs)} \\times 0.0343}{2} \\approx \\frac{\\text{Echo Time}}{58.2}$$`,
    workedExample: 'pulseIn() returns 874 microseconds. Distance = (874 * 0.0343) / 2 = 14.99 cm.',
    commonMistakes: [
      'Expecting ultrasound to detect soft fabric, angled mirrors, or acoustic foam that absorbs or deflects sound waves away from the receiver.',
      'Using blocking pulseIn() calls without a timeout, freezing the robot loop for 30 ms if no obstacle is within range.'
    ],
    tryItLessonId: 'beg-09',
    sourceIds: ['hc-sr04-datasheet'],
    applicableLessonIds: ['beg-09', 'beg-10', 'adv-09'],
    tags: ['ultrasonic', 'sonar', 'sensors', 'hc-sr04', 'distance']
  },
  {
    id: 'fg-comp-sg90-servo',
    slug: 'sg90-micro-servo-motor',
    title: 'SG90 9g Micro Servo Motor',
    sectionId: 'components',
    readingLevel: 'beginner',
    quickVersion: 'The TowerPro SG90 is a closed-loop position actuator with internal gears, potentiometer, and control circuit that positions its output horn to an exact angle between 0° and 180° based on a 50 Hz PWM control pulse.',
    fullExplanation: `Unlike continuous DC motors that spin freely, RC servos are position-controlled actuators:

INTERNAL COMPONENTS:
1. Small DC coreless motor.
2. High-ratio reduction gear train (nylon gears).
3. Feedback potentiometer attached to the final output shaft.
4. Error amplifier and pulse decoder circuit.

CONTROL PROTOCOL:
The servo expects a control pulse every 20 milliseconds (50 Hz frequency). The pulse width encodes the target angle:
- 1.0 ms pulse = 0 degrees (full clockwise/counter-clockwise limit)
- 1.5 ms pulse = 90 degrees (neutral center)
- 2.0 ms pulse = 180 degrees (opposite limit)

WIRING:
- Brown / Black: Ground (GND)
- Red: Power (+5V DC; use external battery/regulator for multiple servos)
- Orange / Yellow: PWM Signal (e.g., Arduino Pin 9 via <Servo.h>)`,
    workedExample: 'In Arduino: #include <Servo.h> -> Servo gripper; -> gripper.attach(9); -> gripper.write(90); positions the gripper arm precisely to center.',
    commonMistakes: [
      'Powering 2 or more servos directly from the Arduino 5V pin. When moving, each servo spikes up to 500 mA, causing the Arduino to brown out and continuously reboot.',
      'Commanding the servo past its physical hard stops (e.g. 0° or 180°), causing the motor to stall, strip nylon gears, and burn out the drive circuit.'
    ],
    tryItLessonId: 'int-06',
    sourceIds: ['towerpro-sg90'],
    applicableLessonIds: ['int-06', 'adv-11'],
    tags: ['servo', 'actuators', 'sg90', 'pwm', 'manipulator']
  },

  // 7F: Programming Reference
  {
    id: 'fg-prog-program-structure',
    slug: 'arduino-sketch-structure',
    title: 'Arduino Program Structure: setup(), loop(), and Execution Flow',
    sectionId: 'programming',
    readingLevel: 'beginner',
    quickVersion: 'Every Arduino program requires two fundamental C++ functions: setup(), which runs once at startup to configure pins and communications, and loop(), which executes continuously forever to sense and control in real-time.',
    fullExplanation: `Behind the scenes, the Arduino core defines the standard C++ main() function:
\`\`\`cpp
int main(void) {
    init();          // Configures hardware timers for millis() and PWM
    setup();         // User initialization
    for (;;) {
        loop();      // Infinite execution loop
        if (serialEventRun) serialEventRun();
    }
    return 0;
}
\`\`\`

1. void setup():
Executed exactly once whenever the board is powered on, reset, or a new sketch is uploaded. This is where you configure pin modes (pinMode), initialize serial communications (Serial.begin), calibrate sensors, and attach servos.

2. void loop():
Once setup() completes, the processor jumps into loop() and repeats it indefinitely. A typical robotics loop executes hundreds or thousands of times every second, reading sensors, evaluating state transitions, and driving motor drivers.`,
    workedExample: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("RoboBEE System Online");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}`,
    commonMistakes: [
      'Placing long delay() calls inside loop(), which blinds the robot to sensor events and makes obstacle collision inevitable.',
      'Redeclaring variables inside loop() that need to persist across cycles; use global variables or static local variables instead.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['arduino-lang-reference'],
    applicableLessonIds: ['beg-01', 'beg-03', 'beg-05', 'adv-03'],
    tags: ['c++', 'setup', 'loop', 'sketch', 'structure']
  },
  {
    id: 'fg-prog-millis-vs-delay',
    slug: 'non-blocking-timing-millis',
    title: 'Non-Blocking Timing: Why millis() Beats delay()',
    sectionId: 'programming',
    readingLevel: 'intermediate',
    quickVersion: 'delay(ms) freezes the microcontroller, stopping all sensor reads, button checks, and navigation math. Non-blocking timing with millis() uses an internal clock timestamp to schedule tasks without ever stalling the CPU.',
    fullExplanation: `In beginner code, delay(1000) pauses execution for 1 second by burning clock cycles in an idle loop. While delayed, the robot CANNOT:
- Detect an obstacle with its ultrasonic sensor.
- Read an emergency stop pushbutton.
- Count optical encoder wheel revolutions.
- Balance an inverted pendulum.

THE MILLIS() PATTERN (State Machine Timing):
The ATmega328P hardware Timer 0 updates an internal 32-bit counter every millisecond. Calling millis() returns this count (which rolls over after ~49.7 days). By subtracting the previous event timestamp from the current timestamp, we achieve non-blocking execution:
\`\`\`cpp
unsigned long previousMillis = 0;
const unsigned long interval = 200; // Run every 200ms

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    // Execute scheduled task (e.g. read distance sensor)
  }
  
  // Other fast tasks (like motor PWM and bumper checks) run at full speed!
}
\`\`\``,
    workedExample: 'A robot can flash an LED at 2 Hz, read ultrasonic distance at 10 Hz, and check bumper microswitches at 5000 Hz simultaneously inside the same loop()!',
    commonMistakes: [
      'Using signed long or int for timestamp variables. Always use unsigned long, otherwise timestamp math fails when integers overflow!',
      'Using addition (currentMillis >= previousMillis + interval) instead of subtraction; subtraction handles the 49.7-day timer rollover smoothly without bugs.'
    ],
    tryItLessonId: 'adv-03',
    sourceIds: ['arduino-lang-reference', 'atmega328p-datasheet'],
    applicableLessonIds: ['beg-05', 'int-03', 'adv-03', 'adv-10'],
    tags: ['millis', 'delay', 'timing', 'non-blocking', 'concurrency']
  },

  // 7K: Safety
  {
    id: 'fg-safety-lab-code',
    slug: 'electrical-and-mechanical-safety',
    title: 'RoboBEE Laboratory Safety Code & Inspection Protocol',
    sectionId: 'safety',
    readingLevel: 'explorer',
    quickVersion: 'Safety is non-negotiable in robotics. All circuits must be strictly low-voltage (under 12V DC), battery packs must be inspected before connection, and every prototype must pass an instructor review gate before applying power.',
    fullExplanation: `At the RoboBEE Innovators Maker Lab, we follow strict professional engineering safety protocols:

1. THE LOW-VOLTAGE MANDATE:
- All student prototypes operate strictly at low DC voltages (3.3V, 5.0V, 7.4V, or maximum 12.0V DC).
- Exploration of 220V AC mains electricity is STRICTLY PROHIBITED. No student probes or modifies mains power.

2. BATTERY & SHORT-CIRCUIT SAFETY:
- Lithium battery packs (2S Li-ion / LiPo) can deliver up to 20 Amps during a dead short, causing fire or burst hazards.
- Always perform the "Two-Finger Inspection": Check that red (positive) and black (ground) wires are securely seated with zero frayed copper strands.
- If a battery feels warm or swells, immediately disconnect it and alert the lab instructor.

3. INSTRUCTOR REVIEW GATE:
- Before any circuit powered by external batteries (such as motor driver VM terminals) is energized, it MUST be visually inspected and cleared by the lab instructor.

4. MECHANICAL & ROTATIONAL SAFETY:
- High-torque gearmotors and spinning wheels can pinch fingers or wrap loose hair/clothing. Keep hands clear while testing.
- Wear safety glasses whenever cutting wires, trimming 3D printed supports, or observing spinning combat/sumo prototypes.`,
    workedExample: 'Pre-Flight Checklist: 1. Disconnect battery. 2. Verify common ground. 3. Check for reverse polarity. 4. Call instructor. 5. Power ON while keeping one hand near the battery plug.',
    commonMistakes: [
      'Plugging in battery power before double-checking motor driver polarity, instantly frying the driver chip.',
      'Leaving tools and wire clippings on energized breadboards, causing random short circuits.'
    ],
    tryItLessonId: 'beg-01',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['exp-02', 'beg-01', 'beg-02', 'beg-06', 'beg-09', 'int-05', 'adv-02', 'adv-09'],
    tags: ['safety', 'battery', 'voltage', 'inspection', 'lab-rules']
  },

  // 7L: Competitions
  {
    id: 'fg-comp-tournament-prep',
    slug: 'competition-robotics-and-rules',
    title: 'Tournament Engineering: FIRSO and NRC Tournament Standards',
    sectionId: 'competitions',
    readingLevel: 'advanced',
    quickVersion: 'Competitive robotics tests engineering under strict match constraints. Robots must pass dimensional sizing boxes, weight limits, autonomous startup delays, and fail-safe safety inspections before entering the arena.',
    fullExplanation: `RoboBEE Innovators competes in premier national championships including FIRSO (Fibonacci International Robot & STEM Olympiad at UIU) and the National Robotics Championship (NRC at IUBAT Campus).

KEY TOURNAMENT CRITERIA:
1. TECHNICAL INSPECTION (Scrutineering):
- Size constraints: Robots must fit inside a precise measurement cube (e.g. 20 cm × 20 cm for Mega Sumo, or 10 cm × 10 cm for Micromouse) with zero pre-match expansion.
- Weight categories: Verified on official calibrated scales (e.g. max 1.0 kg or 3.0 kg).
- Sharp edges and battery securement: Loose batteries or hazardous exposed sharp edges result in immediate disqualification.

2. AUTONOMOUS START PROTOCOL:
- Sumo and autonomous combat rules mandate a strict 5.0-second delay between the referee whistle / button press and the first mechanical movement.
- Any movement during the countdown is penalized as a false start.

3. FAIL-SAFE REQUIREMENTS:
- Radio-controlled robots (Robo Soccer) must feature a software deadman failsafe: if RF signal is lost for >500 ms, all motors must instantly brake.`,
    workedExample: 'Sumo countdown code: if (digitalRead(START_PIN) == LOW) { delay(5000); state = SEARCHING; }',
    commonMistakes: [
      'Building a robot right up to the 200.0 mm limit, only to have it fail inspection when tournament calipers measure 201 mm due to protruding screw heads!',
      'Ignoring battery voltage drops between back-to-back tournament matches.'
    ],
    tryItLessonId: 'adv-01',
    sourceIds: ['firso-2026-rules', 'nrc-2026-regulations'],
    applicableLessonIds: ['adv-01', 'adv-09', 'adv-11', 'adv-12'],
    tags: ['competitions', 'firso', 'nrc', 'rules', 'scrutineering', 'failsafe']
  },
  // 7E continued: Additional Sensors
  {
    id: 'fg-comp-tcrt5000',
    slug: 'tcrt5000-ir-reflectance-sensor',
    title: 'TCRT5000 Infrared Reflectance Sensor',
    sectionId: 'components',
    readingLevel: 'intermediate',
    quickVersion: 'The TCRT5000 uses a 950nm infrared LED and phototransistor to detect light reflection. White surfaces reflect infrared strongly (high analog reading / LOW digital), while black lines absorb infrared (low analog reading / HIGH digital).',
    fullExplanation: 'Optical line following relies on contrast detection. The TCRT5000 emitter sends an infrared beam down to the floor. The phototransistor conducts current in proportion to the reflected photons. By calibrating readings over both black electrical tape and white arena tiles, a decision threshold is computed: Threshold = (White_Value + Black_Value) / 2.',
    workedExample: 'Arena calibration: White tile reads 120, Black tape reads 880. Calculated Threshold = (120 + 880) / 2 = 500. Code logic: if (analogRead(A0) > 500) { onLine = true; }',
    commonMistakes: [
      'Mounting the sensor more than 5mm off the floor; TCRT5000 peak sensitivity is 2.5mm.',
      'Calibrating under classroom fluorescent lights and expecting the exact same thresholds under sunlight near an open window.'
    ],
    tryItLessonId: 'int-02',
    sourceIds: ['tcrt5000-datasheet'],
    applicableLessonIds: ['int-01', 'int-02', 'int-03', 'int-05', 'adv-09'],
    tags: ['sensors', 'infrared', 'tcrt5000', 'line-follower', 'reflectance']
  },
  {
    id: 'fg-comp-encoders-odometry',
    slug: 'rotary-encoders-and-odometry',
    title: 'Wheel Encoders & Differential-Drive Odometry',
    sectionId: 'motion',
    readingLevel: 'advanced',
    quickVersion: 'Optical wheel encoders convert wheel rotations into high-speed digital pulse trains. By multiplying ticks by wheel circumference and tracking track width, a robot dead-reckons its real-time 2D Cartesian position (x, y, theta).',
    fullExplanation: 'Dead reckoning odometry integrates wheel displacement over discrete time steps. For wheel radius R and N pulses per revolution, linear displacement per tick is ds = (2 * PI * R) / N. At each sample: delta_s = (ds_left + ds_right) / 2, delta_theta = (ds_right - ds_left) / Track_Width. The new position is: x += delta_s * cos(theta), y += delta_s * sin(theta), theta += delta_theta.',
    workedExample: 'A 65mm diameter wheel with a 20-slot encoder disc travels: Distance per tick = (3.14159 * 65mm) / 20 = 10.21 mm per pulse.',
    commonMistakes: [
      'Missing encoder pulses due to polling with digitalRead(); fast wheel rotation requires Hardware Interrupts (attachInterrupt).',
      'Ignoring wheel slip on dusty or smooth surfaces, which causes dead-reckoning drift over long runs.'
    ],
    tryItLessonId: 'adv-04',
    sourceIds: ['atmega328p-datasheet'],
    applicableLessonIds: ['adv-04', 'adv-05', 'adv-09', 'adv-11'],
    tags: ['encoders', 'odometry', 'kinematics', 'interrupts', 'navigation']
  },
  {
    id: 'fg-motion-differential-kinematics',
    slug: 'differential-drive-kinematics',
    title: 'Differential Drive Steering & Kinematics',
    sectionId: 'motion',
    readingLevel: 'beginner',
    quickVersion: 'A two-wheel differential drive steers by creating a velocity difference between left and right wheels. Equal forward speeds drive in a straight line, opposite speeds spin in place around the center axis, and one stopped wheel pivots around that contact patch.',
    fullExplanation: 'Differential drive is the primary chassis architecture for youth robotics due to its mechanical simplicity and zero turning radius capability. When left wheel velocity (V_L) and right wheel velocity (V_R) are equal, the robot translates linearly with forward speed V = (V_L + V_R) / 2 and angular rotation omega = 0. When V_L = -V_R, linear speed is 0 and the robot rotates around its midpoint with angular velocity omega = (V_R - V_L) / Track_Width.',
    workedExample: 'Spin Left in place: Left Motor Reverse (AIN1=LOW, AIN2=HIGH, PWM=160), Right Motor Forward (BIN1=HIGH, BIN2=LOW, PWM=160).',
    commonMistakes: [
      'Assuming identical PWM values result in identical wheel speeds; motor manufacturing tolerances and gearbox friction mean you must trim or PID-control wheel speeds.',
      'Forgetting that caster wheels introduce drag when reversing quickly.'
    ],
    tryItLessonId: 'beg-07',
    sourceIds: ['toshiba-tb6612fng'],
    applicableLessonIds: ['beg-07', 'beg-09', 'beg-10', 'int-04', 'int-05', 'adv-04'],
    tags: ['differential-drive', 'kinematics', 'steering', 'motors']
  },
  {
    id: 'fg-motion-pid-control',
    slug: 'pid-feedback-control',
    title: 'Proportional-Integral-Derivative (PID) Control Concepts',
    sectionId: 'motion',
    readingLevel: 'advanced',
    quickVersion: 'PID is a closed-loop algorithm that calculates motor corrections from an error signal: Proportional reacts to present error, Integral eliminates accumulated steady-state bias, and Derivative dampens rapid changes to prevent overshoot.',
    fullExplanation: 'In autonomous line following or motor speed control, simple bang-bang (ON/OFF) control causes violent oscillations. A PID controller computes: Output = (Kp * error) + (Ki * integral) + (Kd * derivative). Kp provides the primary steering punch; Ki slowly ramps up to overcome mechanical friction or motor mismatch; Kd acts like an acoustic shock absorber, slowing the steering as the robot approaches center to stop it from fishtailing.',
    workedExample: 'Line Follower Error: Center is 0. If robot is slightly right (error = +1): P = Kp * 1 = 15. D = Kd * (1 - 0) = 10. Correction = 25. Left motor speed = Base_Speed + 25, Right motor speed = Base_Speed - 25.',
    commonMistakes: [
      'Increasing Ki too high too early, which causes massive integral windup and causes the robot to whip wildly off the line.',
      'Tuning PID without a systematic procedure; always start with Kp alone, then add Kd for damping, and finally add small Ki if steady-state error persists.'
    ],
    tryItLessonId: 'adv-05',
    sourceIds: ['arduino-lang-reference'],
    applicableLessonIds: ['adv-05', 'adv-09', 'adv-11'],
    tags: ['pid', 'control-theory', 'feedback', 'line-follower', 'tuning']
  },
  {
    id: 'fg-design-cad-measurement',
    slug: 'cad-modeling-and-measurement',
    title: 'Design for Robotics: Calipers, Tolerances, and 3D Fit',
    sectionId: 'design',
    readingLevel: 'beginner',
    quickVersion: 'Precision robotics parts must fit without brute force. Learn to read digital vernier calipers, design standard clearance tolerances (0.3mm to 0.4mm for 3D printed holes and snap fits), and align screw holes with standard M3 hardware.',
    fullExplanation: 'A 3D printer does not print nominal dimensions perfectly: melted plastic expands slightly upon extrusion (thermal shrinkage and die swell). If an ultrasonic sensor barrel has an outside diameter of 16.0mm, modeling a 16.0mm hole will result in a part that is impossible to insert! A proper engineering CAD model adds a clearance allowance: Hole Diameter = 16.0mm + 0.4mm = 16.4mm.',
    workedExample: 'Fastener sizing: Standard M3 bolts have a nominal thread diameter of 3.0mm. For a loose clearance hole, model a 3.4mm diameter cylinder. For a plastic self-tapping thread, model a 2.8mm hole.',
    commonMistakes: [
      'Designing parts with zero clearance, requiring frantic filing and drilling during assembly.',
      'Placing holes too close to part edges where 3D printed layer lines easily delaminate under bolt tension.'
    ],
    tryItLessonId: 'beg-08',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['beg-08', 'int-08', 'adv-07', 'adv-11'],
    tags: ['cad', 'tolerances', '3d-printing', 'calipers', 'mechanical']
  },
  {
    id: 'fg-comm-i2c-spi-uart',
    slug: 'serial-i2c-and-spi-protocols',
    title: 'Hardware Communication Protocols: UART, I2C, and SPI',
    sectionId: 'communication',
    readingLevel: 'intermediate',
    quickVersion: 'Robots use three primary digital buses: UART (asynchronous point-to-point, 2 wires: TX/RX), I2C (synchronous multi-device bus with addresses, 2 wires: SDA/SCL), and SPI (high-speed synchronous bus, 4 wires: MOSI/MISO/SCK/CS).',
    fullExplanation: '1. UART (Serial): Asynchronous; no shared clock line. Both devices must agree on baud rate (e.g. 9600 or 115200). Used for computer debugging, Bluetooth modules, and GPS.\n\n2. I2C (Two-Wire Interface / Wire library): Synchronous; uses SDA (data) and SCL (clock) lines with pull-up resistors. Up to 127 devices can share the same two pins because each module has a unique 7-bit hexadecimal address (e.g., MPU6050 is 0x68).\n\n3. SPI: High-speed full-duplex bus. Clocked up to 8 MHz on an Uno. Uses MOSI, MISO, SCK, and a dedicated Chip Select (CS) pin for each peripheral.',
    workedExample: 'To read MPU6050 accelerometer over I2C: Wire.begin(); -> Wire.beginTransmission(0x68); -> Wire.write(0x3B); -> Wire.endTransmission(false); -> Wire.requestFrom(0x68, 6);',
    commonMistakes: [
      'Connecting TX to TX and RX to RX; UART transmit must cross over to the other device receive pin (TX -> RX, RX -> TX).',
      'Forgetting that I2C open-drain lines require pull-up resistors (often built into breakout boards, but essential if wiring raw chips).'
    ],
    tryItLessonId: 'adv-06',
    sourceIds: ['arduino-uno-r3-docs', 'atmega328p-datasheet'],
    applicableLessonIds: ['beg-03', 'int-09', 'adv-06', 'adv-08'],
    tags: ['communication', 'i2c', 'spi', 'uart', 'protocols']
  },
  {
    id: 'fg-testing-fmea-debugging',
    slug: 'systematic-debugging-and-failure-analysis',
    title: 'Systematic Robotics Debugging & Failure Analysis (FMEA)',
    sectionId: 'testing',
    readingLevel: 'intermediate',
    quickVersion: 'When a robot fails, never guess randomly. Isolate the failure by testing subsystems one-by-one: check power supply voltages with a multimeter, verify sensor readings on the Serial Monitor, and test actuators with isolated test code before declaring hardware broken.',
    fullExplanation: 'Professional engineers use Failure Mode and Effects Analysis (FMEA) to identify weak points before competitions. Common robotic failure modes include: battery voltage sag under motor stall, optical sensor saturation from sunlight, loose DuPont jumper wire pins, and race conditions in non-blocking state loops. When debugging: 1. Measure voltages under load. 2. Print raw variables to Serial. 3. Swap only one component at a time. 4. Record every trial in a lab log.',
    workedExample: 'Rover will not turn left. Debug step 1: Check battery voltage (reads 7.8V = Good). Step 2: Swap left/right motor wires on driver output. If problem moves to right wheel, driver channel is bad. If left wheel still will not turn, motor gearbox or wiring is open-circuit.',
    commonMistakes: [
      'Changing five different software variables and three hardware wires at the same time, making it impossible to know which change fixed or broke the system.',
      'Assuming software is bugged when the actual cause is an uncharged battery dropping voltage under load.'
    ],
    tryItLessonId: 'beg-10',
    sourceIds: ['robobee-lab-safety-standard'],
    applicableLessonIds: ['beg-05', 'beg-10', 'int-10', 'adv-10'],
    tags: ['debugging', 'testing', 'fmea', 'troubleshooting', 'multimeter']
  }
];

// ==========================================
// 4. MASTER GLOSSARY (SECTION 7M)
// ==========================================
export const MASTER_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Actuator',
    category: 'robotics',
    plainMeaning: 'A component that creates physical movement or motion, such as a motor, servo, or solenoid.',
    technicalMeaning: 'An electromechanical transducer that converts electrical energy into controlled mechanical force, torque, or displacement.',
    relatedLessonIds: ['exp-01', 'beg-01', 'beg-06', 'int-06']
  },
  {
    term: 'Analog Signal',
    category: 'electronics',
    plainMeaning: 'A continuous electrical signal that can have any voltage value within a range, not just ON or OFF.',
    technicalMeaning: 'A continuous-time, continuous-amplitude voltage signal whose value conveys information through magnitude (e.g., 0.0V to 5.0V).',
    relatedLessonIds: ['beg-04', 'int-02']
  },
  {
    term: 'Analog-to-Digital Converter (ADC)',
    category: 'electronics',
    plainMeaning: 'A microcontroller circuit that converts a real-world voltage into a digital number that code can read.',
    technicalMeaning: 'A hardware peripheral that samples continuous voltage and converts it into a quantized binary integer (e.g., 10-bit resolution producing 0 to 1023).',
    relatedLessonIds: ['beg-04', 'int-02', 'adv-06']
  },
  {
    term: 'Breadboard',
    category: 'electronics',
    plainMeaning: 'A reusable construction board with hidden metal clips for plugging in circuits without soldering.',
    technicalMeaning: 'A solderless prototyping matrix featuring spring-loaded phosphorus-bronze clips organized into vertical power buses and 5-contact horizontal terminal strips.',
    relatedLessonIds: ['exp-02', 'beg-02', 'beg-03']
  },
  {
    term: 'Closed-Loop Control',
    category: 'robotics',
    plainMeaning: 'A control system that continuously checks sensor feedback to correct its mistakes while running.',
    technicalMeaning: 'A control architecture where the process variable is measured by sensors and subtracted from the setpoint to generate an error signal that drives the actuator.',
    relatedLessonIds: ['int-04', 'adv-04', 'adv-05']
  },
  {
    term: 'Differential Drive',
    category: 'mechanics',
    plainMeaning: 'A wheeled robot base steered by spinning two independent side wheels at different speeds or in opposite directions.',
    technicalMeaning: 'A kinematic drive configuration consisting of two independently driven co-axial wheels on opposite sides of a robot chassis, enabling zero-radius turning by setting equal and opposite wheel velocities.',
    relatedLessonIds: ['beg-07', 'beg-09', 'int-05', 'adv-04']
  },
  {
    term: 'Digital Signal',
    category: 'electronics',
    plainMeaning: 'A signal that has only two distinct states: HIGH (5V / ON) or LOW (0V / OFF).',
    technicalMeaning: 'A discrete two-state binary voltage signal representing logic 1 (VCC) or logic 0 (GND) with defined noise margin thresholds.',
    relatedLessonIds: ['beg-01', 'beg-03', 'beg-05']
  },
  {
    term: 'Encoder',
    category: 'sensors',
    plainMeaning: 'A sensor attached to a wheel or motor that counts rotations to measure how far and fast the robot moves.',
    technicalMeaning: 'An electro-optical or magnetic sensor that outputs a stream of digital pulses corresponding to incremental angular shaft displacements for odometry computation.',
    relatedLessonIds: ['adv-04', 'adv-05']
  },
  {
    term: 'H-Bridge',
    category: 'electronics',
    plainMeaning: 'An electronic circuit using 4 switches to spin a DC motor forward, backward, or brake it.',
    technicalMeaning: 'A topology of four solid-state switching elements (MOSFETs or BJTs) arranged in an "H" configuration across a DC motor load, allowing bidirectional current flow.',
    relatedLessonIds: ['beg-06', 'beg-07', 'int-04']
  },
  {
    term: 'Interrupt (ISR)',
    category: 'programming',
    plainMeaning: 'A high-priority signal that pauses regular code immediately to handle an urgent event, like an encoder tick.',
    technicalMeaning: 'A hardware-triggered asynchronous signal that causes the microcontroller core to suspend current execution, push the program counter to the stack, and execute an Interrupt Service Routine.',
    relatedLessonIds: ['adv-03', 'adv-04']
  },
  {
    term: 'Kinematics',
    category: 'mechanics',
    plainMeaning: 'The geometry and math of motion: calculating positions and velocities without worrying about forces.',
    technicalMeaning: 'The branch of mechanics that describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion.',
    relatedLessonIds: ['beg-07', 'adv-04']
  },
  {
    term: 'Microcontroller',
    category: 'robotics',
    plainMeaning: 'A compact computer on a single chip designed to control physical circuits and motors in real-time.',
    technicalMeaning: 'A highly integrated monolithic semiconductor containing a CPU core, memory (Flash, SRAM, EEPROM), and programmable input/output peripherals on a single silicon die.',
    relatedLessonIds: ['beg-01', 'beg-03', 'adv-08']
  },
  {
    term: 'Ohm’s Law',
    category: 'electronics',
    plainMeaning: 'The fundamental rule linking Voltage, Current, and Resistance: Voltage equals Current times Resistance (V = I × R).',
    technicalMeaning: 'The empirical physical law stating that the current through a conductor between two points is directly proportional to the voltage across the two points and inversely proportional to resistance.',
    relatedLessonIds: ['beg-02', 'beg-04', 'adv-02']
  },
  {
    term: 'Pulse-Width Modulation (PWM)',
    category: 'electronics',
    plainMeaning: 'A technique of rapidly turning a digital pin ON and OFF to simulate an adjustable lower voltage for motor speed or LED brightness.',
    technicalMeaning: 'A modulation technique that varies the duty cycle (ratio of on-time to total period) of a high-frequency square wave to regulate the average electrical power delivered to a load.',
    relatedLessonIds: ['beg-06', 'int-04', 'int-06']
  },
  {
    term: 'Servo Motor',
    category: 'actuators',
    plainMeaning: 'A specialized motor with internal feedback that turns precisely to a commanded angle and holds its position.',
    technicalMeaning: 'A self-contained closed-loop actuator comprising a DC motor, reduction gear train, position-sensing potentiometer, and error amplifier controlled via 50 Hz PWM pulse duration.',
    relatedLessonIds: ['int-06', 'adv-11']
  },
  {
    term: 'State Machine',
    category: 'programming',
    plainMeaning: 'A programming design where a robot is always in one named state (like SEEKING, TURNING, or STOPPED) and switches states based on sensor events.',
    technicalMeaning: 'A computational model consisting of a finite number of discrete states, transitions between those states triggered by input conditions, and associated output actions.',
    relatedLessonIds: ['int-03', 'adv-03', 'adv-09']
  }
];

// ==========================================
// 5. PRINTABLE CHEAT SHEETS (SECTION 7N)
// ==========================================
export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'cs-uno-pinout-bench-card',
    title: 'Arduino Uno R3 Quick Bench Pinout Sheet',
    category: 'Hardware',
    summary: 'A fast one-page desktop reference showing every pin on the Arduino Uno Rev3, its hardware timer, PWM capability, and safe current ratings.',
    printableBulletPoints: [
      'Operating Voltage: 5.0V DC. Recommended Input: 7.4V - 12.0V DC on Barrel Jack or VIN.',
      '14 Digital Pins (0-13): Maximum recommended continuous current per pin is 20 mA (Absolute max: 40 mA).',
      'PWM Pins (~): 3, 5, 6, 9, 10, 11. Pins 5 & 6 run at ~980 Hz; Pins 3, 9, 10, 11 run at ~490 Hz.',
      '6 Analog Inputs (A0-A5): 10-bit resolution (0 to 1023). A4 = SDA, A5 = SCL for I2C communication.',
      'Hardware Interrupts: Pin 2 (INT0), Pin 3 (INT1).',
      'Pin 13: Connected to onboard yellow LED (LED_BUILTIN).',
      'Serial Pins 0 (RX) and 1 (TX): Keep disconnected while uploading code or using USB Serial Monitor.'
    ],
    quickReferenceTable: [
      { col1: 'Digital 0 & 1', col2: 'Hardware Serial (RX / TX)', col3: 'Avoid using during USB debugging' },
      { col1: 'Digital 2 & 3', col2: 'External Interrupts (INT0 / INT1)', col3: 'Ideal for encoders or emergency stops' },
      { col1: 'Digital 5 & 6', col2: 'High-speed PWM (~980 Hz)', col3: 'Standard left/right motor speed (PWMA / PWMB)' },
      { col1: 'Digital 7, 8, 9, 10', col2: 'Motor Direction GPIOs', col3: 'AIN1, AIN2, BIN1, BIN2 on TB6612FNG' },
      { col1: 'Digital 11, 12, 13', col2: 'Hardware SPI Bus', col3: 'MOSI (11), MISO (12), SCK (13)' },
      { col1: 'Analog A4 & A5', col2: 'I2C Bus (SDA / SCL)', col3: 'Connects to IMUs, displays, and sensors' }
    ]
  },
  {
    id: 'cs-circuit-wiring-checklist',
    title: 'Pre-Power Circuit Wiring & Safety Checklist',
    category: 'Safety & Electronics',
    summary: 'Mandatory 6-step inspection card to complete before turning on battery switches or connecting USB cables.',
    printableBulletPoints: [
      'Step 1: DISCONNECT POWER. Never plug or unplug components while battery or USB power is applied.',
      'Step 2: VERIFY COMMON GROUND. Is there a black jumper wire connecting the battery negative rail directly to Arduino GND?',
      'Step 3: CHECK MOTOR DRIVER VOLTAGES. Is high-voltage battery (VM, 7.4V) completely isolated from the Arduino 5V logic rail?',
      'Step 4: TWO-FINGER PULL TEST. Gently nudge wires to confirm they are seated firmly in breadboard clips and not touching adjacent rows.',
      'Step 5: REVERSE POLARITY INSPECTION. Confirm Red is VCC (+) and Black is GND (-) on all modules. Reversing power instantly fries chips!',
      'Step 6: INSTRUCTOR REVIEW. Call the lab instructor to verify your connections before flipping the main power switch.'
    ]
  },
  {
    id: 'cs-arduino-syntax-cheat-sheet',
    title: 'Arduino C++ Syntax & Quick Code Reference',
    category: 'Programming',
    summary: 'Essential syntax patterns, pin commands, and non-blocking timers taught across RoboBEE curriculum.',
    printableBulletPoints: [
      'pinMode(pin, mode): Sets a pin to INPUT, OUTPUT, or INPUT_PULLUP (enables internal 20kΩ pullup).',
      'digitalWrite(pin, value): Sets output to HIGH (5V) or LOW (0V).',
      'digitalRead(pin): Returns HIGH or LOW from an input pin.',
      'analogRead(pin): Reads analog input (A0-A5) and returns an integer from 0 to 1023.',
      'analogWrite(pin, val): Outputs PWM duty cycle from 0 (always OFF) to 255 (always ON).',
      'millis(): Returns the number of milliseconds since the program started. Use for non-blocking timing.',
      'Serial.begin(9600): Starts serial monitor communication at 9600 baud.',
      'Serial.print() / Serial.println(): Outputs telemetry data to the computer screen.'
    ]
  }
];

export function getFieldGuideEntryById(id: string): FieldGuideEntry | undefined {
  return FIELD_GUIDE_ENTRIES.find(e => e.id === id);
}

export function getFieldGuideEntriesBySection(sectionId: FieldGuideSectionId): FieldGuideEntry[] {
  return FIELD_GUIDE_ENTRIES.filter(e => e.sectionId === sectionId);
}

export function searchFieldGuide(query: string, level?: ReadingLevel, section?: FieldGuideSectionId): FieldGuideEntry[] {
  const q = query.toLowerCase().trim();
  return FIELD_GUIDE_ENTRIES.filter(entry => {
    if (level && entry.readingLevel !== level) return false;
    if (section && entry.sectionId !== section) return false;
    if (!q) return true;
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.quickVersion.toLowerCase().includes(q) ||
      entry.fullExplanation.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    );
  });
}
