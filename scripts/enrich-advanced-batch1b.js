const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/curriculumData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const adv03 = `  {
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
        teacherAction: 'Teach unsigned subtraction delta math: \`now - lastRun >= interval\`. Introduce struct Task array and function pointers.', 
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
        explanation: 'When firmware executes \`delay(200)\`, the ATmega328P processor executes billions of empty \`NOP\` instructions in a locked loop. The CPU is completely frozen: it cannot sample optical sensors, cannot read ultrasonic echoes, cannot parse wireless commands, and cannot detect a cliff edge! If an obstacle appears 10cm ahead while cruising at 1.0 m/s, the robot travels 20cm before the delay finishes, crashing into the wall. In competitive autonomous robotics, \`delay()\` is strictly forbidden in production code.',
        instructorNote: 'Draw the execution timeline: show how delay() blocks all sensory perception and communications.'
      },
      {
        title: '2. Cooperative Multitasking via Unsigned millis() Delta Timing',
        explanation: 'How do computers run multiple tasks without an operating system? Through Elapsed Delta Timing: \`if ((unsigned long)(currentMillis - previousMillis) >= intervalMs)\`. Because \`millis()\` returns an \`unsigned long\` (32-bit integer), subtraction in C++ utilizes binary modulo arithmetic ($2^{32}$). Even when the internal timer rolls over from 4,294,967,295 back to 0 at day 49.7, the delta subtraction \`(0 - 4294967290)\` evaluates correctly to 6! This guarantees infinite runtime stability with zero timer crash bugs.',
        instructorNote: 'Walk through unsigned integer wraparound on the board: prove why (now - lastTime) never breaks on rollover.'
      },
      {
        title: '3. Modular Struct-Based Task Schedulers and Function Pointers',
        explanation: 'Rather than cluttering \`loop()\` with dozens of separate timestamp variables, professional embedded software utilizes a Task Table: \\n\`\`\`cpp\\nstruct Task {\\n  unsigned long intervalMs;\\n  unsigned long lastRun;\\n  void (*taskFunction)();\\n};\\n\`\`\`\\nAn array of tasks defines the executive schedule. On every pass of \`loop()\`, a simple 5-line \`for\`-loop iterates through the table. If a task is due, its function pointer is called. This decouples timing from implementation, allowing new tasks (like telemetry or sensor filtering) to be added with a single table entry.',
        instructorNote: 'Demonstrate adding a new task to the array: show how easy it is to schedule a 10 Hz telemetry task.'
      },
      {
        title: '4. Hardware Interrupt Service Routines (ISRs) on External Pins',
        explanation: 'Some physical events occur too fast for software polling to catch reliably—such as an optical wheel encoder slot passing at 2000 pulses per second. Hardware Interrupts solve this: the ATmega328P hardware monitors physical pins (Digital Pin 2 = INT0, Pin 3 = INT1). When an electrical edge rises, the CPU instantly freezes main execution, saves registers to the stack, jumps to the Interrupt Service Routine (ISR), executes the handler, and resumes main code—all in under 3 microseconds! ISRs must remain tiny: NEVER use \`Serial.print()\`, \`delay()\`, or complex loops inside an ISR.',
        instructorNote: 'Explain interrupt priority: hardware interrupts override everything, guaranteeing zero missed encoder ticks.'
      },
      {
        title: '5. The volatile Keyword and Atomic Multi-Byte Data Hazards',
        explanation: 'When a variable is modified inside an ISR and read inside \`loop()\`, two fatal bugs can occur: 1. Compiler Optimization Caching: The C++ compiler assumes variables only change within the local function, storing the value in a CPU register and ignoring RAM updates. Declaring \`volatile unsigned long ticks = 0;\` forces the compiler to re-read from physical RAM every time. 2. Data Tearing: On an 8-bit AVR chip, reading a 32-bit \`unsigned long\` requires 4 separate clock cycles. If an ISR fires between byte 1 and byte 2, the variable becomes corrupted! Protecting 16-bit/32-bit shared variables requires an Atomic Block: \`noInterrupts(); long safeCopy = ticks; interrupts();\`.',
        instructorNote: 'Demonstrate data tearing: explain what happens if a variable changes from 0x00FF to 0x0100 mid-read.'
      },
      {
        title: '6. Loop Frequency Benchmarking and Processor Headroom',
        explanation: 'A healthy non-blocking embedded system runs \`loop()\` thousands of times per second. By counting loop iterations and reporting frequency every 1000ms: \\n$$\\text{Loop Frequency (Hz)} = \\frac{\\text{Iterations}}{\\text{Elapsed Seconds}}$$\\nAn optimized Arduino Uno runs at 30,000 Hz to 60,000 Hz. If adding a sensor library causes loop frequency to drop to 150 Hz, it immediately reveals that the library contains blocking internal delays or slow I2C bus transactions, giving engineers the empirical data needed to fix performance bottlenecks.',
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
      code: \`// RoboBEE Innovators - Advanced 03
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
\`,
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
  }`;

console.log('Replacing adv-03...');
content = replaceLesson(content, 'adv-03', 'adv-04', adv03);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-03!');

function replaceLesson(fileContent, lessonId, nextLessonId, newBlock) {
  const startRegex = new RegExp(`\\{\\s*id:\\s*['"]${lessonId}['"][\\s\\S]*?(?=\\{\\s*id:\\s*['"]${nextLessonId}['"])`);
  if (!startRegex.test(fileContent)) {
    throw new Error(`Could not find lesson block for ${lessonId} before ${nextLessonId}`);
  }
  return fileContent.replace(startRegex, newBlock.trim() + ',\n\n  ');
}
