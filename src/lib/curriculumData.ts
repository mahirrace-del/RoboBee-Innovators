export type ClassStatus = 'locked' | 'live_in_class' | 'published';

export type CurriculumLevel =
  | 'Beginner Foundations'
  | 'Motion, Sensors & CAD'
  | 'Integration & Advanced Robotics';

export type InteractiveVisualType =
  | 'sense_decide_act_sim'
  | 'led_blink_sim'
  | 'sensor_serial_sim'
  | 'logic_counter_sim'
  | 'motor_driver_pwm_sim'
  | 'movement_route_sim'
  | 'ultrasonic_sonar_sim'
  | 'cad_caliper_sim'
  | 'smart_bee_integration_sim'
  | 'test_log_sim'
  | 'line_follower_sim'
  | 'servo_arm_sim'
  | 'iot_dashboard_sim'
  | 'sumo_arena_sim';

export interface ClassModule {
  id: string;
  classNumber: number; // 1 to 14
  code: string; // e.g., "CLASS 01"
  level: CurriculumLevel;
  title: string;
  subtitle: string;
  durationMinutes: number; // 60
  status: ClassStatus;
  publishedAt?: string;
  learningObjectives: string[];
  classRhythm: {
    hook: string;      // 5 min
    concept: string;   // 10 min
    demo: string;      // 15 min
    buildTest: string; // 25 min
    exitCheck: string; // 5 min
  };
  coreConcept: {
    headline: string;
    summary: string;
    flowSteps: { label: string; title: string; description: string; icon: string }[];
    safetyOrGoldenRule: string;
  };
  interactiveVisualType: InteractiveVisualType;
  codeLab: {
    title: string;
    language: 'cpp' | 'openscad';
    code: string;
    watchForNotes: string[];
    tweakTip: string;
  };
  handsOnActivity: {
    title: string;
    subtitle: string;
    steps: string[];
    successCriteria: string[];
    tryNextAdvanced: string;
  };
  exitCheckQuestions: {
    id: string;
    question: string;
    hint: string;
    sampleAnswer: string;
  }[];
  nextClassTeaser: string;
}

export const CURRICULUM_CLASSES: ClassModule[] = [
  // ==========================================
  // LEVEL 1: BEGINNER FOUNDATIONS (CLASSES 01-04)
  // ==========================================
  {
    id: 'class-01',
    classNumber: 1,
    code: 'CLASS 01',
    level: 'Beginner Foundations',
    title: 'Introduction to Robotics',
    subtitle: 'Meet the robot system: sense, decide, act.',
    durationMinutes: 60,
    status: 'published',
    publishedAt: '2026-01-10T10:00:00Z',
    learningObjectives: [
      'Describe a robot as a system that senses, processes, and acts.',
      'Name a sensor, controller, and actuator in Smart Bee.',
      'Choose one useful behavior for the robot to perform.'
    ],
    classRhythm: {
      hook: '5 min: What makes a machine an autonomous robot vs a simple appliance? Class hook discussion.',
      concept: '10 min: Sense -> Decide -> Act: The 3 fundamental pillars of all intelligent machines.',
      demo: '15 min: Smart Bee obstacle avoidance live demonstration and electronic signal tracing.',
      buildTest: '25 min: Hands-on activity: Design a custom robot behavior and write decision rules on paper.',
      exitCheck: '5 min: 3-question Exit Check quiz to verify understanding and earn +100 RoboXP.'
    },
    coreConcept: {
      headline: 'The Universal Robotics Triad: Sense -> Decide -> Act',
      summary: 'Every autonomous robot observes physical changes in its environment, processes those signals using coded software logic, and triggers actuators to produce real-world action.',
      flowSteps: [
        {
          label: '1. SENSE',
          title: 'Input Signals',
          description: 'A sensor notices a physical change, such as an obstacle ahead, a black line on the floor, or ambient light level.',
          icon: 'Eye'
        },
        {
          label: '2. DECIDE',
          title: 'Microcontroller Logic',
          description: 'The microcontroller (Arduino) runs code rules that choose what happens next—it follows instructions, it never guesses!',
          icon: 'Cpu'
        },
        {
          label: '3. ACT',
          title: 'Actuators in Motion',
          description: 'A motor driver and DC motors (or LEDs/buzzers) carry out physical actions to change the physical world.',
          icon: 'Zap'
        }
      ],
      safetyOrGoldenRule: 'The sensor provides information; the program tells the robot what to do with it. The Arduino follows exact instructions—it does not guess.'
    },
    interactiveVisualType: 'sense_decide_act_sim',
    codeLab: {
      title: "Tracing Smart Bee's Brain Logic (Pseudocode to C++ Preview)",
      language: 'cpp',
      code: `// CLASS 01: Tracing Smart Bee's Brain Logic (Pseudocode to C++ Preview)
// Follow the information from the first observation to the robot's movement:
// Obstacle ahead -> Sensor signal -> Arduino checks rule -> Motor driver turns wheels

void loop() {
  int distanceCm = readUltrasonicSensor(); // 1. SENSE: Measure obstacle distance

  if (distanceCm < 20) {                   // 2. DECIDE: Check the rule
    turnWheelsRight();                     // 3. ACT: Avoid the obstacle
  } else {
    driveWheelsForward();                  // 3. ACT: Keep exploring
  }
}`,
      watchForNotes: [
        'Sensors send measurements or electrical signals (Inputs).',
        'The Arduino checks rules in code; it never guesses (Controller).',
        'The motor driver lets small control signals operate high-power motors (Output).'
      ],
      tweakTip: 'Try changing the distance threshold from 20cm to 35cm to make Smart Bee react from further away before getting close to a wall!'
    },
    handsOnActivity: {
      title: 'Design a Robot Behavior',
      subtitle: 'Define inputs, decision rules, and motor actions for a real-world task.',
      steps: [
        'Choose a job for Smart Bee: explore a room, avoid obstacles, follow a line, or deliver a light object.',
        'Name the exact sensor or signal that gives the robot information (Input).',
        'Write the decision rule: "IF the robot notices ___, IT SHOULD ___."',
        'Sketch the sensor, controller (Arduino), and moving part (wheels/motors).'
      ],
      successCriteria: [
        'The job has a clear goal.',
        'The behavior includes an input and an action.',
        'The team can explain the rule aloud.'
      ],
      tryNextAdvanced: 'Add a second condition (e.g., low battery or cliff edge) and predict which rule should take priority first.'
    },
    exitCheckQuestions: [
      {
        id: 'c1-q1',
        question: 'What is one input Smart Bee can receive?',
        hint: 'Think about the ultrasonic eyes on the front.',
        sampleAnswer: 'Ultrasonic distance ping (distance to an obstacle in centimeters) or a push button switch.'
      },
      {
        id: 'c1-q2',
        question: 'What does the controller (Arduino) do with that input?',
        hint: 'Does it guess or evaluate programmed logic?',
        sampleAnswer: 'It compares the input measurement against programmed IF/ELSE rules to determine what action to execute.'
      },
      {
        id: 'c1-q3',
        question: 'Name one output the robot can use to act on the world.',
        hint: 'What makes the robot physically move or signal?',
        sampleAnswer: 'DC gear motors / wheels through the motor driver, indicator LEDs, or sound buzzer.'
      }
    ],
    nextClassTeaser: 'Class 02: Arduino, Circuits & First Output — Build your first closed circuit, learn current-limiting resistor safety, and make an LED blink with precision C++ code!'
  },

  {
    id: 'class-02',
    classNumber: 2,
    code: 'CLASS 02',
    level: 'Beginner Foundations',
    title: 'Arduino, Circuits & First Output',
    subtitle: 'Load a program, build a closed circuit, and make an LED output respond.',
    durationMinutes: 60,
    status: 'published',
    publishedAt: '2026-01-17T10:00:00Z',
    learningObjectives: [
      'Identify the microcontroller as the brain that runs a compiled program.',
      'Describe a closed circuit (Power to GND) and why an external LED needs a current-limiting resistor (220Ω–330Ω).',
      'Write and upload code using setup(), loop(), pinMode(), digitalWrite(), and delay().'
    ],
    classRhythm: {
      hook: '5 min: The magic of electric current: why electricity will only flow in a full circle.',
      concept: '10 min: Microcontroller pins, digital voltages (5V HIGH vs 0V LOW), and Ohm\'s Law safety.',
      demo: '15 min: Arduino IDE tour, USB compilation, and hands-on breadboard resistor + LED setup.',
      buildTest: '25 min: Build circuit, upload Blink, and engineer a custom Morse code signal pattern.',
      exitCheck: '5 min: 3-question Exit Check quiz on pinMode, setup, and loop functions.'
    },
    coreConcept: {
      headline: 'Closed Circuits & Digital Output Pins',
      summary: 'Electrons must flow from positive 5V through your component and back to Ground (GND). An Arduino pin acts like a lightning-fast electronic switch.',
      flowSteps: [
        {
          label: '1. POWER PATH',
          title: 'Closed Loop to GND',
          description: 'The board and breadboard circuit need a complete closed loop from positive voltage back to Ground (GND).',
          icon: 'Battery'
        },
        {
          label: '2. CODE CYCLE',
          title: 'setup() vs loop()',
          description: 'setup() runs once after reset to prepare pins; loop() repeats the main instructions forever while powered.',
          icon: 'RotateCw'
        },
        {
          label: '3. DIGITAL SWITCH',
          title: 'HIGH (5V) & LOW (0V)',
          description: 'A digital pin switches between HIGH (5V ON) and LOW (0V OFF) to control an LED safely through a current resistor.',
          icon: 'Lightbulb'
        }
      ],
      safetyOrGoldenRule: 'A circuit needs a complete closed path, and an external LED always needs a resistor so it does not burn out. Never connect a motor directly to an Arduino pin!'
    },
    interactiveVisualType: 'led_blink_sim',
    codeLab: {
      title: 'Blink & Pattern Controller',
      language: 'cpp',
      code: `const int LED_PIN = LED_BUILTIN; // Pin 13 on Arduino Uno

void setup() {
  // Runs ONCE when Arduino turns on or resets
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Repeats FOREVER while the board has power
  digitalWrite(LED_PIN, HIGH); // Turn LED ON (5V)
  delay(500);                  // Wait 500 milliseconds (0.5 sec)
  digitalWrite(LED_PIN, LOW);  // Turn LED OFF (0V)
  delay(500);                  // Wait 500 milliseconds
}`,
      watchForNotes: [
        'setup() runs once after reset; loop() repeats forever.',
        'HIGH and LOW set a digital output state (ON/OFF).',
        'Change 500 to 150 to make the blink much faster!'
      ],
      tweakTip: 'Replace delay(500) with delay(100) on lines 10 & 12 to create an emergency strobe beacon!'
    },
    handsOnActivity: {
      title: 'Change the Blink Pattern — Morse Signal',
      subtitle: 'Create a custom two-short, one-long communication pattern.',
      steps: [
        'Upload the example sketch and confirm the built-in or breadboard LED blinks steadily.',
        'Change one delay() value in the code and predict the result before uploading.',
        'Create a custom Two-Short, One-Long communication pattern (e.g., 150ms ON, 150ms OFF, 150ms ON, 150ms OFF, 800ms ON, 1000ms OFF).',
        'Show your partner exactly which lines of code create each part of the flash pattern.'
      ],
      successCriteria: [
        'The program compiles and uploads without errors.',
        'The LED pattern matches your plan.',
        'You can explain the difference between setup() and loop().'
      ],
      tryNextAdvanced: 'Replace the repeated blink lines with a custom helper function like void blinkPulse(int duration) and compare how clean the code looks.'
    },
    exitCheckQuestions: [
      {
        id: 'c2-q1',
        question: 'Which Arduino function repeats over and over forever?',
        hint: 'It shares its name with a continuous circle.',
        sampleAnswer: 'The loop() function repeats continuously as long as the Arduino has power.'
      },
      {
        id: 'c2-q2',
        question: 'What does pinMode(LED_PIN, OUTPUT) configure?',
        hint: 'Does it configure the pin to listen or send power?',
        sampleAnswer: 'It configures the specified digital pin as an OUTPUT so it can send voltage (5V or 0V) to external components.'
      },
      {
        id: 'c2-q3',
        question: 'Why must we use a resistor in series with an external LED on a breadboard?',
        hint: 'What happens to a light bulb if too much current rushes through?',
        sampleAnswer: 'To limit the electric current (milliamps) flowing through the LED so it does not burn out or damage the Arduino pin.'
      }
    ],
    nextClassTeaser: 'Class 03: Sensors & Reading Inputs — Connect push buttons and light sensors, and inspect live data on the Serial Monitor!'
  },

  {
    id: 'class-03',
    classNumber: 3,
    code: 'CLASS 03',
    level: 'Beginner Foundations',
    title: 'Sensors & Reading Inputs',
    subtitle: 'Turn a physical change into a value your code can read and inspect.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Distinguish a digital input (2 states: ON/OFF, HIGH/LOW) from an analog reading (a range of values: 0 to 1023).',
      'Read an input pin using digitalRead() or analogRead().',
      'Use Serial.begin(9600) and the Serial Monitor to inspect live sensor values on screen.'
    ],
    classRhythm: {
      hook: '5 min: How do humans sense temperature vs light switches? Digital vs Analog senses.',
      concept: '10 min: INPUT_PULLUP internal resistors, floating pins, and Serial communication (9600 baud).',
      demo: '15 min: Button wiring to GND, opening the Serial Monitor, and seeing 0 vs 1 appear.',
      buildTest: '25 min: Wire push button & photoresistor (LDR), graph values, and write an IF threshold.',
      exitCheck: '5 min: 3-question Exit Check quiz on digitalRead and Serial Monitor debugging.'
    },
    coreConcept: {
      headline: 'Converting Physical Physics into Digital Numbers',
      summary: 'Sensors are electrical transducers: they transform mechanical presses, light, sound, or distance into voltages the microcontroller reads.',
      flowSteps: [
        {
          label: '1. CHANGE',
          title: 'Physical World Event',
          description: 'A push button is pressed, an obstacle blocks an IR beam, or room light level changes.',
          icon: 'Sliders'
        },
        {
          label: '2. SIGNAL',
          title: 'Voltage to Input Pin',
          description: 'The sensor or switch sends an electrical voltage state to an Arduino input pin (0V to 5V).',
          icon: 'Activity'
        },
        {
          label: '3. READING',
          title: 'Serial Monitor Inspection',
          description: 'The code reads the value (digitalRead or analogRead) and prints it to the Serial Monitor for debugging.',
          icon: 'Terminal'
        }
      ],
      safetyOrGoldenRule: 'Always inspect the raw sensor reading in the Serial Monitor first! Different sensor modules use different ranges and active states (many are active-LOW).'
    },
    interactiveVisualType: 'sensor_serial_sim',
    codeLab: {
      title: 'Read a Button in the Serial Monitor',
      language: 'cpp',
      code: `const int BUTTON_PIN = 2; // Push button wired between Pin 2 and GND

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Internal pull-up keeps pin HIGH when unpressed
  Serial.begin(9600);                // Start live communication with the PC
}

void loop() {
  int state = digitalRead(BUTTON_PIN); // Read the button state (1 or 0)
  Serial.println(state);               // Print value to the Serial Monitor
  delay(100);                          // Short delay for readable scrolling
}`,
      watchForNotes: [
        'INPUT_PULLUP gives the pin a stable default HIGH (1) state without needing an external resistor.',
        'With a button wired to GND, pressing the button connects the pin to Ground, so pressed reads LOW (0)!',
        'Serial output reveals what the sensor actually sees inside the Arduino\'s brain.'
      ],
      tweakTip: 'Notice that pressing the button prints 0 and releasing prints 1. That is Active-LOW logic!'
    },
    handsOnActivity: {
      title: 'Make an Input Visible',
      subtitle: 'Connect a push button and inspect raw electrical states in real-time.',
      steps: [
        'Wire the push button (or approved light/IR sensor) with USB power disconnected.',
        'Upload the read-and-print example and open the Serial Monitor at 9600 baud.',
        'Record the exact numbers shown in two conditions (e.g., Button Released vs. Button Pressed, or Sensor Covered vs. Uncovered).',
        'Write one IF rule on paper that could use those exact readings to trigger an action.'
      ],
      successCriteria: [
        'Readings visibly change in the Serial Monitor when you interact with the sensor.',
        'Wiring follows the guide safely.',
        'Your team can explain what 1 and 0 mean for your circuit.'
      ],
      tryNextAdvanced: 'Connect an analog sensor (like an LDR photoresistor on A0), collect 10 readings in bright vs. dark conditions, and find the average threshold.'
    },
    exitCheckQuestions: [
      {
        id: 'c3-q1',
        question: 'What two values can digitalRead() return?',
        hint: 'Binary states in digital electronics.',
        sampleAnswer: 'HIGH (1) or LOW (0).'
      },
      {
        id: 'c3-q2',
        question: 'How did the Serial Monitor help you test your circuit today?',
        hint: 'Can you see electricity with your eyes?',
        sampleAnswer: 'It lets us see the exact live numbers and state changes the Arduino detects from the sensor on our computer screen.'
      },
      {
        id: 'c3-q3',
        question: 'Why did the reading become 0 (LOW) when the button was pressed in our INPUT_PULLUP circuit?',
        hint: 'Where does the button connect the pin when pressed?',
        sampleAnswer: 'Pressing the button connects pin 2 directly to Ground (0V), pulling the voltage down to LOW.'
      }
    ],
    nextClassTeaser: 'Class 04: Code Logic & Debugging — Use variables, if/else rules, and systematic debugging methods to make smart decisions!'
  },

  {
    id: 'class-04',
    classNumber: 4,
    code: 'CLASS 04',
    level: 'Beginner Foundations',
    title: 'Code Logic & Debugging',
    subtitle: 'Use variables, if/else rules, and systematic debugging to make smart decisions.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Read and update an integer variable (int) and evaluate an if/else condition.',
      'Explain how loop() repeats a decision check every cycle.',
      'Debug hardware and software by changing only one thing at a time and checking the result.'
    ],
    classRhythm: {
      hook: '5 min: The detective engineer: Why changing 5 things at once makes debugging impossible.',
      concept: '10 min: Variables as memory lockers, relational operators (<, >, ==), and conditional branching.',
      demo: '15 min: Tracing loop() execution on a whiteboard and stepping through variable increments.',
      buildTest: '25 min: Program the 3-blink counter, introduce a deliberate bug, and solve it methodically.',
      exitCheck: '5 min: 3-question Exit Check quiz on if/else conditions and debugging rules.'
    },
    coreConcept: {
      headline: 'Memory Variables & The Decision Engine',
      summary: 'A computer cannot think—it can only store values in memory variables, compare them against conditions, and execute branches.',
      flowSteps: [
        {
          label: '1. STORE',
          title: 'Named Memory Box',
          description: 'Put a sensor reading or counter number into a named variable (like a labeled memory box: int count = 0;).',
          icon: 'Database'
        },
        {
          label: '2. COMPARE',
          title: 'Condition Check',
          description: 'Check whether the variable meets a condition using comparison operators (<, >, ==, !=).',
          icon: 'GitFork'
        },
        {
          label: '3. CHOOSE',
          title: 'Branch Execution',
          description: 'Run the matching action block (if or else) and repeat the check on the next loop cycle.',
          icon: 'CheckCircle'
        }
      ],
      safetyOrGoldenRule: 'When debugging a robot, state your prediction first and change only ONE thing at a time. If you change three things at once, you will not know which change fixed or broke it!'
    },
    interactiveVisualType: 'logic_counter_sim',
    codeLab: {
      title: 'Count Three Blinks & Stop',
      language: 'cpp',
      code: `int count = 0; // Variable stores how many times the LED has blinked

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (count < 3) {                  // Check condition: Is count less than 3?
    digitalWrite(LED_BUILTIN, HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN, LOW);
    delay(250);
    count = count + 1;              // Add 1 to count after each blink
  }
}`,
      watchForNotes: [
        'count starts at 0. The condition count < 3 is true for 0, 1, and 2 (total 3 blinks).',
        'Once count reaches 3, count < 3 is false, so the LED stays off until you press the Arduino RESET button.'
      ],
      tweakTip: 'Try editing count < 3 to count < 6 to see the LED blink exactly six times before pausing!'
    },
    handsOnActivity: {
      title: 'Predict, Edit, Test & Debug',
      subtitle: 'Use scientific hypothesis testing to debug robot code logic.',
      steps: [
        'Predict aloud how changing 3 to 5 in if (count < 3) will affect the LED behavior.',
        'Make that single edit, upload the code, and verify your prediction.',
        'Add an else block or a push-button reset rule so pressing a button resets count = 0;.',
        'Document one bug you encountered (e.g., missing delay or semicolon) and how you fixed it.'
      ],
      successCriteria: [
        'Prediction is stated before uploading.',
        'Only one change is tested at a time.',
        'Student can trace the value of count on each pass of loop().'
      ],
      tryNextAdvanced: 'Move the blink sequence into a separate function void flashAlert() and call it inside the if condition.'
    },
    exitCheckQuestions: [
      {
        id: 'c4-q1',
        question: 'What does a variable store in an Arduino program?',
        hint: 'Think of a labeled storage container.',
        sampleAnswer: 'It stores a piece of data (like an integer number, sensor reading, or counter) in the microcontroller\'s memory.'
      },
      {
        id: 'c4-q2',
        question: 'When does the code inside an if (...) { ... } block run?',
        hint: 'Only when the condition evaluates to what?',
        sampleAnswer: 'It runs only when the condition inside the parentheses evaluates to TRUE.'
      },
      {
        id: 'c4-q3',
        question: 'Why should engineers change only one thing at a time when debugging?',
        hint: 'What happens if you change three wires and two lines of code all at once?',
        sampleAnswer: 'If you change multiple things at once, you will not know which specific change fixed the problem or caused a new bug.'
      }
    ],
    nextClassTeaser: 'Class 05: DC Motors & Motor Drivers — Enter Level 2! Learn H-Bridges, separate battery power, and spin robot wheels with PWM speed control!'
  },

  // ==========================================
  // LEVEL 2: MOTION, SENSORS & CAD (CLASSES 05-08)
  // ==========================================
  {
    id: 'class-05',
    classNumber: 5,
    code: 'CLASS 05',
    level: 'Motion, Sensors & CAD',
    title: 'DC Motors & Motor Drivers',
    subtitle: 'Use an H-Bridge motor driver to control wheel direction and speed safely.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Explain why a motor driver sits between the Arduino and DC motors.',
      'Identify direction pins (AIN1, AIN2 / IN1, IN2) and PWM speed pins (PWMA / ENA) on a dual motor driver.',
      'Explain why motors require a separate battery supply while sharing a Common Ground (GND) with the Arduino.'
    ],
    classRhythm: {
      hook: '5 min: Can an Arduino pin power a motor? (The 40mA pin limit vs 500mA motor hunger!).',
      concept: '10 min: H-Bridge architecture, TB6612FNG vs L298N, PWM duty cycles, and Shared Ground.',
      demo: '15 min: Motor bench test with wheels lifted safely off the table; changing direction pins.',
      buildTest: '25 min: Wire dual motor driver, program speed ramps (0-255), and test wheel rotation.',
      exitCheck: '5 min: 3-question Exit Check quiz on motor drivers, direction pins, and Common GND.'
    },
    coreConcept: {
      headline: 'The H-Bridge & High-Power Actuation',
      summary: 'Motors draw high electric current and generate inductive spikes. A motor driver acts as a protected electronic gate between your delicate Arduino and the high-current battery.',
      flowSteps: [
        {
          label: '1. LOW CURRENT',
          title: 'Arduino Logic Signals',
          description: 'Arduino sends tiny, low-current logic signals (direction HIGH/LOW and PWM speed 0–255).',
          icon: 'Cpu'
        },
        {
          label: '2. POWER GATE',
          title: 'H-Bridge Driver Switch',
          description: 'Motor Driver acts as a high-power electronic switch (H-Bridge) that routes battery current to the motors.',
          icon: 'Layers'
        },
        {
          label: '3. HIGH TORQUE',
          title: 'DC Motor Rotation',
          description: 'DC Motor spins forward, backward, fast, or slow when the driver supplies high battery current.',
          icon: 'Compass'
        }
      ],
      safetyOrGoldenRule: 'NEVER connect a DC motor directly to an Arduino GPIO pin! A motor draws way too much current (200mA–1000mA+) and will permanently fry the Arduino pin (max 40mA).'
    },
    interactiveVisualType: 'motor_driver_pwm_sim',
    codeLab: {
      title: 'Command One Motor — Direction & PWM Speed',
      language: 'cpp',
      code: `// Example for TB6612FNG Dual Motor Driver (Adapt pin names if using L298N)
const int PWMA = 5;  // PWM Speed control pin (must be a ~ PWM pin)
const int AIN1 = 7;  // Direction pin 1
const int AIN2 = 8;  // Direction pin 2
const int STBY = 6;  // Standby enable pin (set HIGH to enable driver)

void setup() {
  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(STBY, OUTPUT);
}

void loop() {
  digitalWrite(STBY, HIGH); // Wake up the motor driver
  
  // Spin Forward at medium speed (150 out of 255)
  digitalWrite(AIN1, HIGH);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 150);
  delay(2000);

  // Stop for 1 second
  analogWrite(PWMA, 0);
  delay(1000);

  // Spin Reverse at slower speed (100 out of 255)
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, HIGH);
  analogWrite(PWMA, 100);
  delay(2000);
}`,
      watchForNotes: [
        'AIN1 and AIN2 set the spin direction (HIGH/LOW = Forward, LOW/HIGH = Reverse, LOW/LOW = Stop).',
        'analogWrite(PWMA, speed) sets speed from 0 (stopped) to 255 (100% full battery power).',
        'Battery GND and Arduino GND MUST be connected together!'
      ],
      tweakTip: 'Adjust analogWrite(PWMA, 150) to analogWrite(PWMA, 230) to see the motor spin at high speed!'
    },
    handsOnActivity: {
      title: 'Control Direction and Speed Safely',
      subtitle: 'Bench test dual DC motors with elevated chassis for safety.',
      steps: [
        'Identify your motor driver model (TB6612FNG or L298N) and verify its battery voltage pins.',
        'Check all wiring with the battery disconnected, ensuring Common GND is connected.',
        'Prop the robot up on a box so the wheels are lifted clear off the table, then upload a low-speed test (PWM = 120).',
        'Reverse the direction signals (AIN1/AIN2) in code and observe the wheel spin the opposite way.'
      ],
      successCriteria: [
        'Motor spins smoothly only when commanded.',
        'Team can show which lines control direction vs. speed.',
        'Robot wheels are safely elevated during initial bench testing.'
      ],
      tryNextAdvanced: 'Compare two PWM values (100 vs. 220) and find the minimum PWM value required to overcome gear friction from a dead stop.'
    },
    exitCheckQuestions: [
      {
        id: 'c5-q1',
        question: 'Why do we need a motor driver between the Arduino and the DC motors?',
        hint: 'Think about electric current (milliamps).',
        sampleAnswer: 'DC motors require several hundred milliamps of current, which would destroy an Arduino pin (max 40mA). The driver safely switches high battery power using low logic signals.'
      },
      {
        id: 'c5-q2',
        question: 'Which two signals do we swap to reverse a DC motor\'s direction?',
        hint: 'Look at the direction pins AIN1 and AIN2.',
        sampleAnswer: 'Swap the logic states of AIN1 and AIN2 (e.g., from HIGH/LOW to LOW/HIGH).'
      },
      {
        id: 'c5-q3',
        question: 'What must be shared between the motor battery pack and the Arduino for signals to work?',
        hint: 'The common voltage reference for all circuits.',
        sampleAnswer: 'A shared Common Ground (GND).'
      }
    ],
    nextClassTeaser: 'Class 06: Movement Functions & Choreography — Package low-level motor pins into forward(), turnRight(), and stopRobot() to drive precision floor routes!'
  },

  {
    id: 'class-06',
    classNumber: 6,
    code: 'CLASS 06',
    level: 'Motion, Sensors & CAD',
    title: 'Movement Functions & Choreography',
    subtitle: 'Package motor commands into clean, reusable C++ functions to drive a route.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Group repeated low-level motor pin commands into named C++ functions (forward(), turnRight(), stopRobot()).',
      'Pass a speedValue parameter into a movement function.',
      'Program, test, and tune a multi-step driving sequence on the floor.'
    ],
    classRhythm: {
      hook: '5 min: Clean Code vs Spaghetti Code: Why copying 8 lines of pin commands 20 times causes disaster.',
      concept: '10 min: C++ function definitions, parameters, return types, and differential drive steering math.',
      demo: '15 min: Coding helper functions and demonstrating pivot turns vs smooth arc turns on the floor.',
      buildTest: '25 min: Arena choreography: Program Smart Bee to drive an L-route around an obstacle cone.',
      exitCheck: '5 min: 3-question Exit Check quiz on function structure and timing parameters.'
    },
    coreConcept: {
      headline: 'Modular Function Abstraction & Differential Drive',
      summary: 'Good roboticists abstract complex hardware pins behind friendly English function names. Smart Bee steers by spinning left and right wheels at different speeds.',
      flowSteps: [
        {
          label: '1. PIN COMBINATION',
          title: 'Low-Level Commands',
          description: 'Choose direction states and PWM speed values for the left and right motor channels.',
          icon: 'Sliders'
        },
        {
          label: '2. ENCAPSULATION',
          title: 'Named Helper Function',
          description: 'Group those 6–8 motor pin lines into one readable action like forward(150) or turnRight(130).',
          icon: 'Box'
        },
        {
          label: '3. CHOREOGRAPHY',
          title: 'Sequence Execution',
          description: 'Call your named actions in order inside loop() and tune the delay() timings on the floor.',
          icon: 'Play'
        }
      ],
      safetyOrGoldenRule: 'A named movement function like forward(140) is much easier to read, reuse, and debug than copying and pasting 8 lines of digitalWrite code twenty times!'
    },
    interactiveVisualType: 'movement_route_sim',
    codeLab: {
      title: 'Create Reusable Movement Functions',
      language: 'cpp',
      code: `// Helper functions package left & right motor commands into readable actions
void forward(int speedValue) {
  leftMotorForward(speedValue);
  rightMotorForward(speedValue);
}

void turnRight(int speedValue) {
  leftMotorForward(speedValue);
  rightMotorReverse(speedValue); // Spin right on the spot
}

void stopRobot() {
  leftMotorForward(0);
  rightMotorForward(0);
}

void loop() {
  forward(140);   // Drive forward at speed 140
  delay(700);     // Move for 0.7 seconds
  stopRobot();    // Brake
  delay(500);
  
  turnRight(130); // Pivot 90 degrees right
  delay(350);
  stopRobot();
  while(true);    // Stop after completing the route once
}`,
      watchForNotes: [
        'The function name clearly describes the physical action.',
        'speedValue is an input parameter passed inside the parentheses.',
        'Timed movement distance changes depending on battery charge, floor friction, and motor differences.'
      ],
      tweakTip: 'Tune delay(350) in turnRight() until Smart Bee pivots exactly 90 degrees on your classroom floor!'
    },
    handsOnActivity: {
      title: 'Program a Precision Floor Route',
      subtitle: 'Program an L-Shape route around a cone and calibrate turn angles.',
      steps: [
        'Test forward(140) and stopRobot() with the wheels lifted clear off the desk first.',
        'Add turnLeft() and turnRight() functions and verify both wheels spin in the expected directions.',
        'Place Smart Bee on the floor test arena and program an "L-Shape" or parking route around a cone.',
        'Adjust only one timing or speed value per test run until the robot hits the target zone consistently.'
      ],
      successCriteria: [
        'Robot starts, turns, and stops cleanly on command.',
        'Team can point to the exact function controlling each maneuver.',
        'Route is tested at least 3 times.'
      ],
      tryNextAdvanced: 'Program a full Square Route (4 straight sides, 4 ninety-degree turns) and measure how much the robot drifts over repeated runs.'
    },
    exitCheckQuestions: [
      {
        id: 'c6-q1',
        question: 'Why is writing a forward() function better than repeating raw pin commands?',
        hint: 'Think about readability, reusability, and fixing bugs.',
        sampleAnswer: 'It makes the code clean, readable, easy to test, and if motor pins change, you only have to update one place.'
      },
      {
        id: 'c6-q2',
        question: 'What does the number inside forward(140) control?',
        hint: 'What does the speedValue parameter pass to the motor driver?',
        sampleAnswer: 'The PWM speed value (from 0 to 255) sent to the motors.'
      },
      {
        id: 'c6-q3',
        question: 'Why might the exact same delay(700) timing produce slightly different distances on carpet vs. tile?',
        hint: 'Think about mechanical friction and wheel traction.',
        sampleAnswer: 'Surface friction, wheel slip, and battery voltage differences affect real-world distance.'
      }
    ],
    nextClassTeaser: 'Class 07: Distance Sensors & Obstacle Response — Install the HC-SR04 ultrasonic sonar sensor and teach Smart Bee to brake before crashing!'
  },

  {
    id: 'class-07',
    classNumber: 7,
    code: 'CLASS 07',
    level: 'Motion, Sensors & CAD',
    title: 'Distance Sensors & Obstacle Response',
    subtitle: 'Measure distance with ultrasonic sonar and make Smart Bee react before crashing.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Explain how an ultrasonic distance sensor (HC-SR04) uses sound echoes to measure distance.',
      'Convert microsecond echo time into centimeters (cm = us * 0.0343 / 2.0) and explain why we divide by 2.',
      'Use a distance threshold (cm < 18) inside an if/else rule to trigger obstacle avoidance.'
    ],
    classRhythm: {
      hook: '5 min: How bats and dolphins navigate in pitch-black caves using echolocation sonar.',
      concept: '10 min: The HC-SR04 TRIG/ECHO pins, speed of sound in air (343 m/s), and the round-trip formula.',
      demo: '15 min: Measuring distance to hands/rulers in Serial Monitor and viewing noise/timeout limits.',
      buildTest: '25 min: Integrate sonar on robot, set 18cm avoidance threshold, and run floor test.',
      exitCheck: '5 min: 3-question Exit Check quiz on ultrasonic math and threshold rules.'
    },
    coreConcept: {
      headline: 'Acoustic Echolocation & Safe Braking Zones',
      summary: 'The HC-SR04 sensor transmits a 40kHz ultrasonic chirp and measures the time until the echo bounces back from an obstacle.',
      flowSteps: [
        {
          label: '1. PING & TIME',
          title: 'Ultrasonic Pulse',
          description: 'The TRIG pin sends a 10µs ping; pulseIn(ECHO, HIGH) times how many microseconds the sound takes to bounce back.',
          icon: 'Radio'
        },
        {
          label: '2. DISTANCE MATH',
          title: 'Speed of Sound Formula',
          description: 'Convert echo time to cm: cm = (microseconds * 0.0343) / 2.0 (divided by 2 for one-way distance).',
          icon: 'Calculator'
        },
        {
          label: '3. AVOIDANCE',
          title: 'Threshold Decision',
          description: 'If cm < 18, stop and turn away; if clear, continue forward exploration.',
          icon: 'ShieldAlert'
        }
      ],
      safetyOrGoldenRule: 'Sound travels to the obstacle AND back to the sensor—that is a round trip! Always divide the total travel distance by 2 to get the true one-way distance to the wall.'
    },
    interactiveVisualType: 'ultrasonic_sonar_sim',
    codeLab: {
      title: 'Ultrasonic Distance Math & Threshold Rule',
      language: 'cpp',
      code: `const int TRIG = 9;
const int ECHO = 10;

void loop() {
  // 1. Trigger a 10-microsecond ultrasonic sound pulse
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  // 2. Measure echo return time in microseconds (25000 us timeout)
  long us = pulseIn(ECHO, HIGH, 25000);

  // 3. Convert time to cm (Speed of sound = 0.0343 cm/us; divide by 2 for one-way)
  float cm = us ? (us * 0.0343 / 2.0) : 999;

  // 4. Compare against our 18 cm threshold rule
  if (cm < 18) {
    stopAndTurn();
  } else {
    driveForward();
  }
}`,
      watchForNotes: [
        'pulseIn() measures pulse duration in microseconds (µs).',
        'If no obstacle is in range (us == 0), the ternary operator sets cm = 999 so the robot knows the path is clear.',
        'Always print and verify the distance in the Serial Monitor BEFORE enabling the motors!'
      ],
      tweakTip: 'If your robot carries heavy momentum, increase the safety threshold from 18cm to 24cm!'
    },
    handsOnActivity: {
      title: 'Build & Tune an Obstacle Rule',
      subtitle: 'Calibrate sonar against a physical ruler and test autonomous wall avoidance.',
      steps: [
        'Disable the motors and print cm to the Serial Monitor first.',
        'Place a flat box at 10 cm, 20 cm, and 30 cm using a ruler and verify the sensor\'s accuracy.',
        'Enable the if (cm < 18) threshold rule and test Smart Bee approaching a wall on the floor.',
        'Tune the threshold distance or turn duration so Smart Bee smoothly avoids the wall without touching it.'
      ],
      successCriteria: [
        'Sensor readings accurately match ruler measurements.',
        'Code uses a clear threshold variable.',
        'Robot stops or turns before contact during live floor tests.'
      ],
      tryNextAdvanced: 'Take 3 rapid distance readings and calculate their average (moving average filter) to ignore random sensor glitches.'
    },
    exitCheckQuestions: [
      {
        id: 'c7-q1',
        question: 'Why must we divide the ultrasonic echo calculation by 2.0?',
        hint: 'Sound has to travel there and return.',
        sampleAnswer: 'Because the sound wave makes a round trip (to the object and back); we divide by 2 to get the one-way distance.'
      },
      {
        id: 'c7-q2',
        question: 'What does the threshold value (18 cm) decide in our code?',
        hint: 'What happens when an object is closer vs farther than 18 cm?',
        sampleAnswer: 'It triggers the decision boundary: if closer than 18 cm, the robot stops and turns; otherwise it drives forward.'
      },
      {
        id: 'c7-q3',
        question: 'Why do we test the sensor readings in the Serial Monitor with the motors disabled first?',
        hint: 'Safety and isolating variables.',
        sampleAnswer: 'To ensure the sensor and math work accurately before the robot moves and potentially crashes.'
      }
    ],
    nextClassTeaser: 'Class 08: 3D Design for Robotics — Measure real hardware with calipers, learn CAD tolerances, and 3D-model a custom sensor bracket!'
  },

  {
    id: 'class-08',
    classNumber: 8,
    code: 'CLASS 08',
    level: 'Motion, Sensors & CAD',
    title: '3D Design for Robotics',
    subtitle: 'Measure real hardware, account for clearance, and model a custom 3D-printable sensor mount.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Measure an electronic component (like the HC-SR04 sensor) and identify critical mounting dimensions.',
      'Create a simple 3D CAD bracket/mount from a 2D sketch and extrusion.',
      'Check mechanical fit, transducer hole clearance, and wire connector space before exporting an .STL file.'
    ],
    classRhythm: {
      hook: '5 min: Why 3D printing fails: The tragedy of the zero-tolerance tight hole!',
      concept: '10 min: Caliper measurement, parametric CAD concepts, 3D printing tolerances (+0.4mm), and slicers.',
      demo: '15 min: Live CAD walkthrough modeling an L-bracket for the HC-SR04 ultrasonic eyes.',
      buildTest: '25 min: Hands-on CAD lab: Sketch baseplate, punch cylinder cutouts, and test virtual fit.',
      exitCheck: '5 min: 3-question Exit Check quiz on CAD dimensions and 3D printing clearances.'
    },
    coreConcept: {
      headline: 'Precision Mechanical Tolerances & Parametric CAD',
      summary: 'Robotics is not just code and circuits—it requires rigid physical enclosures and mounts designed to withstand real vibration and motion.',
      flowSteps: [
        {
          label: '1. MEASURE',
          title: 'Physical Calipers',
          description: 'Record sensor PCB dimensions (45mm x 20mm), cylinder diameters (16mm), and wire header clearance.',
          icon: 'Maximize'
        },
        {
          label: '2. MODEL',
          title: 'Parametric CAD',
          description: 'Sketch baseplate and vertical bracket, cut out transducer clearance holes (16.5mm), and extrude walls.',
          icon: 'Box'
        },
        {
          label: '3. VERIFY',
          title: 'Clearance Check',
          description: 'Verify +0.5mm 3D printing tolerance and check wire routing space before slicing to .STL.',
          icon: 'CheckSquare'
        }
      ],
      safetyOrGoldenRule: 'Design for mechanical fit, clearance, and function FIRST; add cool logos or decorations only after the bracket holds the sensor straight and leaves room for the wires!'
    },
    interactiveVisualType: 'cad_caliper_sim',
    codeLab: {
      title: 'Parametric HC-SR04 Ultrasonic Bracket Reference',
      language: 'openscad',
      code: `// CLASS 08: Parametric HC-SR04 Ultrasonic Bracket Reference (OpenSCAD / CAD Dimensions)
// Real HC-SR04 PCB = 45mm x 20mm | Transducer Cylinders = 16mm diameter (+0.5mm clearance = 16.5mm)
// Center-to-center spacing between ultrasonic eyes = 26mm

module ultrasonicMount() {
  difference() {
    // 1. Extrude L-Bracket Base & Vertical Faceplate (3mm wall thickness)
    union() {
      cube([50, 25, 3]);           // Base plate attached to Smart Bee chassis
      cube([50, 3, 28]);           // Vertical front plate holding sensor
    }
    // 2. Cut out Left & Right Ultrasonic Eye Holes (16.5mm diameter with clearance)
    translate([12, 4, 15]) rotate([90, 0, 0]) cylinder(h=6, d=16.5, $fn=50);
    translate([38, 4, 15]) rotate([90, 0, 0]) cylinder(h=6, d=16.5, $fn=50);
    // 3. Cut out Chassis M3 Screw Slots on the base
    translate([10, 14, -1]) cylinder(h=5, d=3.4, $fn=30);
    translate([40, 14, -1]) cylinder(h=5, d=3.4, $fn=30);
  }
}
ultrasonicMount();`,
      watchForNotes: [
        'Measure the real sensor and its mounting holes before touching the mouse.',
        'Leave clearance at the bottom/back for the 4-pin jumper cable (VCC, TRIG, ECHO, GND) so the wires aren\'t crushed against the chassis.',
        'Preview the part from all angles before exporting to .STL.'
      ],
      tweakTip: 'Notice d=16.5 for the 16mm cylinders. That 0.5mm clearance allows 3D printer filament expansion without requiring sanding!'
    },
    handsOnActivity: {
      title: 'Model a Smart Bee Sensor Mount',
      subtitle: 'Measure, sketch, model, and check clearances for the HC-SR04 bracket.',
      steps: [
        'Measure the HC-SR04 body (45mm x 20mm), transducer cylinders (16mm), and cable exit space.',
        'Sketch the base attachment plate and vertical sensor holder on paper with labeled dimensions in millimeters (mm).',
        'Model the bracket in CAD with at least +0.5mm clearance on holes.',
        'Hold the real sensor up to a 1:1 scale preview (or caliper check) and revise one dimension for a better fit.'
      ],
      successCriteria: [
        'All critical dimensions are labeled in mm.',
        'The sensor attaches pointing straight forward without blocking the ultrasonic beam or bending the pins.',
        'Model is exported cleanly.'
      ],
      tryNextAdvanced: 'Add a built-in cable clip guide or sunken M3 hex-nut trap to your bracket design.'
    },
    exitCheckQuestions: [
      {
        id: 'c8-q1',
        question: 'Which physical measurement affected your bracket design the most?',
        hint: 'Think about the ultrasonic eyes and the board width.',
        sampleAnswer: 'The transducer cylinder diameters (16mm) and their 26mm center-to-center spacing.'
      },
      {
        id: 'c8-q2',
        question: 'Why do we add 0.5mm extra clearance to holes in 3D printing?',
        hint: 'Does molten plastic shrink or expand slightly when extruded?',
        sampleAnswer: 'FDM 3D printing extrudes molten plastic that expands slightly; the clearance ensures parts slide together without tight jamming.'
      },
      {
        id: 'c8-q3',
        question: 'What happens if your mount points the ultrasonic sensor slightly down toward the floor?',
        hint: 'What will the sound waves bounce off of?',
        sampleAnswer: 'The sensor will detect false echoes from the floor, causing the robot to stop and turn when the path is actually clear.'
      }
    ],
    nextClassTeaser: 'Class 09: Build Smart Bee (System Integration) — Enter Level 3! Assemble all mechanical, electrical, and coding subsystems into one unified autonomous robot!'
  },

  // ==========================================
  // LEVEL 3: INTEGRATION & ADVANCED ROBOTICS (CLASSES 09-14)
  // ==========================================
  {
    id: 'class-09',
    classNumber: 9,
    code: 'CLASS 09',
    level: 'Integration & Advanced Robotics',
    title: 'Build Smart Bee (System Integration)',
    subtitle: 'Bring the chassis, motor driver, ultrasonic sensor, and autonomous code together into one complete robot.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Connect mechanical, electrical, and coding subsystems into one integrated autonomous robot.',
      'Follow a step-by-step Subsystem Startup Checklist before full-power floor testing.',
      'Implement and tune Smart Bee\'s autonomous obstacle-avoiding main loop.'
    ],
    classRhythm: {
      hook: '5 min: NASA flight checklist philosophy: Why rocket scientists test each subsystem independently.',
      concept: '10 min: Power distribution, wire tidiness, center of gravity, and autonomous state sequencing.',
      demo: '15 min: The 4-step startup verification test: Wheels -> Sensors -> Drivers -> Autonomous loop.',
      buildTest: '25 min: Full chassis assembly, wiring verification, and maiden floor obstacle navigation run.',
      exitCheck: '5 min: 3-question Exit Check quiz on integration debugging and reverse motor fixes.'
    },
    coreConcept: {
      headline: 'Full-System Integration & Subsystem Verification',
      summary: 'An autonomous robot succeeds only when mechanical rigidity, clean electrical power, and responsive software logic work in flawless synchronization.',
      flowSteps: [
        {
          label: '1. MECHANICAL BUILD',
          title: 'Rigid Chassis Assembly',
          description: 'Mount motors, wheels, caster wheel, battery holder, driver, Arduino, and 3D bracket securely.',
          icon: 'Wrench'
        },
        {
          label: '2. ELECTRICAL WIRING',
          title: 'Power & Common GND',
          description: 'Wire battery power, shared GND, motor driver logic, and ultrasonic sonar pins systematically.',
          icon: 'Zap'
        },
        {
          label: '3. AUTONOMOUS LOOP',
          title: 'Sense -> Decide -> Act',
          description: 'Run the integrated autonomous navigation algorithm and verify obstacle avoidance in the lab.',
          icon: 'Cpu'
        }
      ],
      safetyOrGoldenRule: 'Test one subsystem at a time before running the whole robot! If you wire everything and run full code immediately, you will not know whether a bug is in the sensor, the motor wiring, or the code.'
    },
    interactiveVisualType: 'smart_bee_integration_sim',
    codeLab: {
      title: "Smart Bee's Complete Autonomous Main Loop",
      language: 'cpp',
      code: `const int SAFE_DISTANCE_CM = 20;
float distanceCm = 999;

void loop() {
  // 1. SENSE: Update distance reading from HC-SR04
  readDistance();

  // 2. DECIDE & ACT: Autonomous obstacle avoidance
  if (distanceCm < SAFE_DISTANCE_CM) {
    stopRobot();
    delay(200);
    reverseRobot(130);
    delay(300);
    turnRight(140);
    delay(400);
    stopRobot();
  } else {
    driveForward(150);
  }
}`,
      watchForNotes: [
        'readDistance() updates distanceCm every loop cycle.',
        'Adding a brief stopRobot() and reverseRobot() before turning prevents the front wheel from catching on the obstacle.',
        'If one wheel spins backward when calling driveForward(), swap that motor\'s two wires or flip its IN1/IN2 pins in code!'
      ],
      tweakTip: 'Notice the quick reverseRobot(130) before the turn. That backs the robot out of tight pinch points!'
    },
    handsOnActivity: {
      title: 'Assemble & Commission Smart Bee',
      subtitle: 'Systematically check mechanical, electrical, and software subsystems.',
      steps: [
        'Mechanical Check: Inspect chassis screws, ensure wheels spin freely without rubbing wires, and check that the sensor faces straight ahead.',
        'Electrical Check: Verify battery polarity, Common GND, and pin numbers against the kit wiring diagram before powering on.',
        'Subsystem Test 1 (Sensor Only): Check Serial Monitor distance readings with motors switched off.',
        'Subsystem Test 2 (Full Autonomous Run): Enable motors and test Smart Bee navigating out of a 3-box obstacle corner.'
      ],
      successCriteria: [
        'Every subsystem passes its individual check.',
        'Smart Bee detects and avoids obstacles autonomously without collisions.',
        'Every team member can trace the signal path on the real robot.'
      ],
      tryNextAdvanced: 'Program Smart Bee to pause, look left and right (or alternate turn directions if stuck in a corner), and choose the clearest path.'
    },
    exitCheckQuestions: [
      {
        id: 'c9-q1',
        question: 'Which subsystem did your team test first, and why?',
        hint: 'Bench testing sensors before turning on motors.',
        sampleAnswer: 'We tested the sensor in the Serial Monitor with motors turned off to confirm distance readings were accurate before moving.'
      },
      {
        id: 'c9-q2',
        question: 'What happens if the left motor is wired backward when you run driveForward()?',
        hint: 'One wheel goes forward, the other goes reverse.',
        sampleAnswer: 'The robot will spin in circles instead of driving straight forward.'
      },
      {
        id: 'c9-q3',
        question: 'What adjustment did you make after Smart Bee\'s first floor run?',
        hint: 'Think about speed, turn duration, or threshold distance.',
        sampleAnswer: 'We tuned the turn duration and increased the threshold distance so it did not clip the wall while pivoting.'
      }
    ],
    nextClassTeaser: 'Class 10: Test, Improve & Present — Run 3 repeatable engineering trials, log stopping distances, and deliver your team RoboBEE Showcase presentation!'
  },

  {
    id: 'class-10',
    classNumber: 10,
    code: 'CLASS 10',
    level: 'Integration & Advanced Robotics',
    title: 'Test, Improve & Present (Engineering Showcase)',
    subtitle: 'Run repeatable engineering trials, use data evidence to improve your robot, and present at the RoboBEE Showcase.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Test a robot against a measurable, repeatable success criterion across 3 trials.',
      'Use recorded test data to make one evidence-based improvement to hardware or code.',
      'Present your Smart Bee robot clearly, explaining how it senses, decides, and acts.'
    ],
    classRhythm: {
      hook: '5 min: Real aerospace engineering: How SpaceX and Formula 1 use data telemetry to win.',
      concept: '10 min: Repeatability, standard deviation, inertia/braking momentum, and presentation structure.',
      demo: '15 min: Running Trial 1, logging stopping distance in cm, and observing braking overshoot.',
      buildTest: '25 min: 3-Trial testing table, tuning active braking code, and delivering team showcase.',
      exitCheck: '5 min: 3-question Exit Check quiz on engineering evidence and showcase communication.'
    },
    coreConcept: {
      headline: 'Empirical Evidence & Continuous Engineering Iteration',
      summary: 'Great robotics is not luck—it is rigorous measurement. Record real numbers across repeated trials, identify patterns of failure, and apply surgical improvements.',
      flowSteps: [
        {
          label: '1. PLAN & ISOLATE',
          title: 'Standard Test Setup',
          description: 'Define the exact test arena (same starting line, same obstacle target) and measurable success criteria.',
          icon: 'Target'
        },
        {
          label: '2. TRIAL LOGGING',
          title: '3-Trial Data Recording',
          description: 'Run the robot 3 times under identical conditions and record actual stopping distance in cm.',
          icon: 'FileText'
        },
        {
          label: '3. EVIDENCE TUNING',
          title: 'Data-Driven Fix',
          description: 'Change one variable based on evidence (e.g., compensate for inertia drift) and re-verify!',
          icon: 'TrendingUp'
        }
      ],
      safetyOrGoldenRule: 'A failed test is never a failure when you record what happened—it gives your engineering team the exact evidence needed for your next improvement!'
    },
    interactiveVisualType: 'test_log_sim',
    codeLab: {
      title: 'Calibrating Braking & Momentum Compensation',
      language: 'cpp',
      code: `// CLASS 10: Tuned Obstacle Response with Momentum Braking
const int SAFE_DISTANCE_CM = 24; // Increased from 18cm after Trial 1 data showed 5cm coasting drift!
const int CRUISE_SPEED = 145;    // Tuned for reliable sensor reaction time

void loop() {
  float cm = getFilteredDistanceCm(); // Average of 3 rapid pings for rock-solid reliability

  if (cm < SAFE_DISTANCE_CM) {
    activeBrake();     // Short reverse pulse stops wheel momentum instantly
    delay(150);
    evasiveTurnRight(150);
    delay(380);
    stopRobot();
  } else {
    driveForward(CRUISE_SPEED);
  }
}`,
      watchForNotes: [
        'Active braking applies a quick reverse pulse before the turn, stopping inertia in its tracks.',
        'getFilteredDistanceCm() ignores anomalous noise spikes.',
        'Data showed 5cm of coasting drift, so SAFE_DISTANCE_CM was raised to 24cm.'
      ],
      tweakTip: 'Notice how activeBrake() stops the robot from skidding forward into the wall on slick tile floors!'
    },
    handsOnActivity: {
      title: 'Run the 3-Trial Engineering Test & Showcase',
      subtitle: 'Gather evidence across 3 runs and present your team\'s engineering accomplishments.',
      steps: [
        'State your team\'s task and measurable success criterion (e.g., "Smart Bee must stop and turn between 10 cm and 20 cm before the wall in 3 out of 3 runs").',
        'Run 3 official trials from the exact same starting mark and log the actual stopping distance in centimeters for each trial.',
        'Make one evidence-based improvement to your code or sensor angle and run a verification trial.',
        'Deliver a 2-minute team presentation demonstrating the robot and explaining its Sensor, Controller, Driver, Motors, and Code Rule.'
      ],
      successCriteria: [
        '3-trial test table is completed with real measurements.',
        'At least one improvement is backed by test data.',
        'Every student explains one part of the system during the showcase.'
      ],
      tryNextAdvanced: 'Compare two different threshold settings (15 cm vs. 25 cm) across 6 trials and graph the average stopping distance.'
    },
    exitCheckQuestions: [
      {
        id: 'c10-q1',
        question: 'What piece of test evidence led to your team\'s best improvement today?',
        hint: 'Stopping distance, sensor reflection angle, or turn timing?',
        sampleAnswer: 'Measuring 5cm of coasting momentum drift prompted us to increase the safety threshold and add an active brake pulse.'
      },
      {
        id: 'c10-q2',
        question: 'Which part of the robot was the most challenging to debug across the course?',
        hint: 'Wiring, motor speed matching, or distance calibration?',
        sampleAnswer: 'Balancing motor speeds so the robot drove straight, and tuning the sensor threshold so it reacted without false triggers.'
      },
      {
        id: 'c10-q3',
        question: 'What feature would you add to Smart Bee next in the Advanced Robotics track?',
        hint: 'Think about line following, grippers, Wi-Fi, or combat!',
        sampleAnswer: 'Adding IR line-tracking sensors for high-speed racing or a servo arm gripper for object delivery.'
      }
    ],
    nextClassTeaser: 'Class 11: IR Sensor Arrays & Autonomous Line Follower — Enter Competition Robotics! Master infrared surface reflection and differential steering!'
  },

  {
    id: 'class-11',
    classNumber: 11,
    code: 'CLASS 11',
    level: 'Integration & Advanced Robotics',
    title: 'IR Sensor Arrays & Autonomous Line Follower',
    subtitle: 'Teach Smart Bee to read infrared surface reflection and track a high-speed racing line autonomously.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Explain how an Infrared (IR) emitter and photodiode detect the difference between white surfaces (reflects IR) and black tape (absorbs IR).',
      'Calibrate IR sensor sensitivity potentiometers and read Left/Right IR states.',
      'Program a differential-steering Line Follower algorithm (Straight, Correct Left, Correct Right, Stop at Intersection).'
    ],
    classRhythm: {
      hook: '5 min: How Tesla and warehouse AGVs track road lines and factory navigation paths.',
      concept: '10 min: IR light reflection physics, analog vs digital IR modules, and potentiometer tuning.',
      demo: '15 min: Calibrating IR modules with indicator LEDs on white floor vs black electrical tape.',
      buildTest: '25 min: Mount dual IR sensors, upload differential steering code, and race on the track.',
      exitCheck: '5 min: 3-question Exit Check quiz on IR reflection and steering state logic.'
    },
    coreConcept: {
      headline: 'Infrared Surface Absorption & Differential Steering',
      summary: 'Matte black surfaces absorb infrared light, while glossy white surfaces reflect it back into the photodiode. By placing two sensors across a black tape track, the robot detects which way it is drifting.',
      flowSteps: [
        {
          label: '1. EMIT & REFLECT',
          title: 'Optical Reflection',
          description: 'IR LED shines infrared light at the floor; white floor bounces it back, black track tape absorbs it.',
          icon: 'Sun'
        },
        {
          label: '2. TRACK DRIFT',
          title: 'Dual Sensor Check',
          description: 'Left and Right IR sensors flanking the black line report whether the robot is centered or drifting.',
          icon: 'Sliders'
        },
        {
          label: '3. DIFFERENTIAL STEER',
          title: 'Corrective Torque',
          description: 'If left sensor sees black, pivot left; if right sensor sees black, pivot right; if both white, charge straight!',
          icon: 'Compass'
        }
      ],
      safetyOrGoldenRule: 'Ambient sunlight contains lots of infrared light! Always calibrate your IR sensors on the actual competition floor lighting right before your run.'
    },
    interactiveVisualType: 'line_follower_sim',
    codeLab: {
      title: 'Dual-IR Differential Line Follower',
      language: 'cpp',
      code: `const int IR_LEFT = A0;   // Left IR Sensor Digital Output (0 = White, 1 = Black Line)
const int IR_RIGHT = A1;  // Right IR Sensor Digital Output
const int BASE_SPEED = 140;
const int TURN_SPEED = 160;

void setup() {
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_RIGHT, INPUT);
  initMotors();
}

void loop() {
  int leftState = digitalRead(IR_LEFT);
  int rightState = digitalRead(IR_RIGHT);

  if (leftState == LOW && rightState == LOW) {
    // Both sensors on white floor (straddling the black line) -> Drive Straight
    setMotors(BASE_SPEED, BASE_SPEED);
  } 
  else if (leftState == HIGH && rightState == LOW) {
    // Left sensor hit the black line -> Pivot Left to recenter
    setMotors(-TURN_SPEED, TURN_SPEED);
  } 
  else if (leftState == LOW && rightState == HIGH) {
    // Right sensor hit the black line -> Pivot Right to recenter
    setMotors(TURN_SPEED, -TURN_SPEED);
  } 
  else {
    // Both sensors on black (Finish Line / Cross Intersection) -> Stop!
    setMotors(0, 0);
  }
}`,
      watchForNotes: [
        'Notice active-HIGH logic here: HIGH (1) indicates the black line has absorbed the IR beam.',
        'Pivoting uses opposite motor directions (-TURN_SPEED vs +TURN_SPEED) for rapid cornering.',
        'Both sensors HIGH detects a perpendicular black finish line.'
      ],
      tweakTip: 'If your robot wiggles too violently on straightaways, lower TURN_SPEED from 160 to 135!'
    },
    handsOnActivity: {
      title: 'Calibrate & Race the Figure-8 Track',
      subtitle: 'Tune sensitivity potentiometers and race without derailing on curves.',
      steps: [
        'Mount two IR proximity sensors 10mm above the floor, spaced slightly wider than the black electrical tape track.',
        'Tune the small blue potentiometer screw on each IR module so its indicator LED turns ON over white and OFF over black tape.',
        'Upload the differential steering code and test on a gentle curve first.',
        'Tune BASE_SPEED and TURN_SPEED to complete a full lap without derailing on sharp corners.'
      ],
      successCriteria: [
        'Both IR sensors switch reliably over the black line.',
        'Robot corrects both left and right drift automatically.',
        'Stops cleanly at a perpendicular black finish line.'
      ],
      tryNextAdvanced: 'Upgrade from 2 sensors to a 5-channel IR array and implement Proportional (P-Controller) steering where outer sensors trigger sharper corrections than inner sensors.'
    },
    exitCheckQuestions: [
      {
        id: 'c11-q1',
        question: 'What happens to infrared light when it hits matte black tape versus a white board?',
        hint: 'Does black absorb or bounce light?',
        sampleAnswer: 'Black tape absorbs infrared light so little bounces back; white board reflects the infrared light back into the sensor.'
      },
      {
        id: 'c11-q2',
        question: 'If the Right IR sensor detects the black line, which way must the robot steer to stay on track?',
        hint: 'If the right side is touching the line, steer which way to get back to center?',
        sampleAnswer: 'The robot must steer Right so that the sensor moves off the tape back into the white zone.'
      },
      {
        id: 'c11-q3',
        question: 'Why does a Line Follower derail if BASE_SPEED is set too high on a sharp 90-degree corner?',
        hint: 'Inertia vs sensor polling rate.',
        sampleAnswer: 'The robot\'s forward momentum shoots it past the corner before the loop can detect the line and apply steering torque.'
      }
    ],
    nextClassTeaser: 'Class 12: Servo Motors & Robotic Manipulators — Control angular positions from 0° to 180° and construct a motorized robotic gripper arm!'
  },

  {
    id: 'class-12',
    classNumber: 12,
    code: 'CLASS 12',
    level: 'Integration & Advanced Robotics',
    title: 'Servo Motors & Robotic Manipulators',
    subtitle: 'Control precise angular positions from 0° to 180° using Servo motors and build a robotic gripper arm.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Contrast continuous-rotation DC gear motors with closed-loop positional Servo motors (SG90 / MG996R).',
      'Use the <Servo.h> library and myServo.write(angle) to command exact angles between 0° and 180°.',
      'Use a for loop to sweep a robotic arm smoothly without jerky movement or mechanical stalls.'
    ],
    classRhythm: {
      hook: '5 min: How industrial robotic arms on car assembly lines grip with millimeter precision.',
      concept: '10 min: Internal potentiometers, closed-loop feedback, pulse-width modulation (1ms to 2ms pulses).',
      demo: '15 min: Centering a servo to 90° before mounting horn; smooth for-loop sweep vs sudden write().',
      buildTest: '25 min: Assemble mechanical claw, calibrate OPEN and GRIP angles, and pick up a foam block.',
      exitCheck: '5 min: 3-question Exit Check quiz on servos, internal feedback, and stall prevention.'
    },
    coreConcept: {
      headline: 'Closed-Loop Positional Servomechanisms',
      summary: 'Unlike DC motors that spin continuously, a positional servo motor contains an internal potentiometer and control circuit that maintains an exact specified shaft angle against mechanical resistance.',
      flowSteps: [
        {
          label: '1. COMMAND ANGLE',
          title: 'Target Position',
          description: 'Your code commands a specific angle (e.g., 90° center or 30° closed claw) using <Servo.h>.',
          icon: 'Target'
        },
        {
          label: '2. FEEDBACK CHECK',
          title: 'Internal Potentiometer',
          description: 'Inside the servo, an internal sensor measures actual shaft angle and compares it to your target.',
          icon: 'Activity'
        },
        {
          label: '3. TORQUE HOLD',
          title: 'Position Holding',
          description: 'The internal motor drives until the shaft matches target angle and actively resists external force.',
          icon: 'Lock'
        }
      ],
      safetyOrGoldenRule: 'Never force a powered servo horn by hand, and never command a robotic gripper past its physical closing limit—stalling a servo draws high current and strips its gears!'
    },
    interactiveVisualType: 'servo_arm_sim',
    codeLab: {
      title: 'Smooth Servo Arm & Gripper Control',
      language: 'cpp',
      code: `#include <Servo.h>

Servo clawServo;
const int SERVO_PIN = 11;
const int OPEN_ANGLE = 120;  // Calibrated open jaw angle
const int GRIP_ANGLE = 45;   // Calibrated closed grip angle (do not over-pinch!)

void setup() {
  clawServo.attach(SERVO_PIN);
  clawServo.write(OPEN_ANGLE); // Start with gripper open
  delay(1000);
}

// Smoothly move servo from current angle to target angle
void moveServoSmooth(int startAngle, int endAngle, int stepDelay) {
  if (startAngle < endAngle) {
    for (int pos = startAngle; pos <= endAngle; pos++) {
      clawServo.write(pos);
      delay(stepDelay);
    }
  } else {
    for (int pos = startAngle; pos >= endAngle; pos--) {
      clawServo.write(pos);
      delay(stepDelay);
    }
  }
}

void loop() {
  moveServoSmooth(OPEN_ANGLE, GRIP_ANGLE, 15); // Smoothly close claw to pick up block
  delay(2000);
  moveServoSmooth(GRIP_ANGLE, OPEN_ANGLE, 15); // Smoothly release block
  delay(2000);
}`,
      watchForNotes: [
        'clawServo.attach(11) assigns the servo control pulse to digital pin 11.',
        'moveServoSmooth increments one degree at a time, eliminating jerky mechanical stress.',
        'Never command GRIP_ANGLE lower than where the jaws physically touch!'
      ],
      tweakTip: 'Change stepDelay from 15 to 35 for cinematic, gentle robotic arm motion!'
    },
    handsOnActivity: {
      title: 'Calibrate & Run a Pick-and-Place Gripper',
      subtitle: 'Center servo, attach horn, find mechanical limits, and grab an object.',
      steps: [
        'Connect the Servo (Brown/Black = GND, Red = 5V, Orange/Yellow = Pin 11) and center it to 90° BEFORE attaching the plastic servo horn.',
        'Find the exact safe OPEN_ANGLE and GRIP_ANGLE for your mechanical claw without stalling the motor.',
        'Use the moveServoSmooth() loop to gently grasp a foam block, hold it for 2 seconds, and release it in a target zone.',
        'Combine with Smart Bee\'s ultrasonic sensor: when an object is placed 8 cm in front of the robot, automatically grab it!'
      ],
      successCriteria: [
        'Servo centers at 90° before assembly.',
        'Claw opens and closes smoothly without buzzing or stalling.',
        'Autonomously grabs an object on trigger.'
      ],
      tryNextAdvanced: 'Control a 2-Axis Arm (Base Rotation Servo + Gripper Servo) using two potentiometers or serial commands.'
    },
    exitCheckQuestions: [
      {
        id: 'c12-q1',
        question: 'How is a positional Servo motor different from the DC gear motors on Smart Bee\'s wheels?',
        hint: 'Can a servo rotate infinitely, or does it hold specific angles?',
        sampleAnswer: 'DC gear motors rotate continuously for driving; servos rotate to specific commanded angles (0° to 180°) and hold that position.'
      },
      {
        id: 'c12-q2',
        question: 'Why must we command the servo to 90° before screwing on the servo arm horn?',
        hint: 'Setting the mechanical reference center.',
        sampleAnswer: 'To ensure the servo is at its known mechanical center, allowing equal travel to the left and right without hitting internal gear stops.'
      },
      {
        id: 'c12-q3',
        question: 'How does a for loop make a robotic arm move more smoothly than jumping straight from 45° to 120°?',
        hint: 'Think of taking stairs versus leaping off a cliff.',
        sampleAnswer: 'It steps through each degree with a small delay, producing gradual, controlled acceleration instead of an abrupt, jerky snap.'
      }
    ],
    nextClassTeaser: 'Class 13: Wireless Robotics & IoT Control — Cut the USB tether! Pilot your robot wirelessly using Bluetooth / Wi-Fi packets and deadman failsafes!'
  },

  {
    id: 'class-13',
    classNumber: 13,
    code: 'CLASS 13',
    level: 'Integration & Advanced Robotics',
    title: 'Wireless Robotics & IoT Control (ESP32 / Bluetooth Telemetry)',
    subtitle: 'Cut the USB cord! Command your robot wirelessly and stream live sensor telemetry to a dashboard.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Understand serial character command packets (\'F\', \'B\', \'L\', \'R\', \'S\') sent over Wireless Bluetooth or Wi-Fi (ESP32).',
      'Use a switch (command) statement to parse incoming wireless commands instantly.',
      'Implement a Deadman Failsafe Timer so the robot stops automatically if wireless signal is lost.'
    ],
    classRhythm: {
      hook: '5 min: NASA Mars Rovers: How millions of miles of wireless latency dictate failsafe programming.',
      concept: '10 min: Wireless serial protocols, baud rates, packet parsing with switch/case, and timeout counters.',
      demo: '15 min: Driving Smart Bee with a mobile app D-pad and simulating radio disconnect to verify failsafe.',
      buildTest: '25 min: Pair wireless module, program switch/case handler, and navigate a blind obstacle course.',
      exitCheck: '5 min: 3-question Exit Check quiz on wireless command packets and deadman failsafes.'
    },
    coreConcept: {
      headline: 'Wireless Command Packets & Deadman Failsafes',
      summary: 'Wireless robotics requires robust communication handshakes. Commands are sent as compact single-character packets, and a strict timeout clock guarantees the robot halts if contact is lost.',
      flowSteps: [
        {
          label: '1. TRANSMIT',
          title: 'Wireless Packet',
          description: 'A smartphone app or web dashboard sends a single-character command packet (\'F\', \'B\', \'L\', \'R\', \'S\') over the air.',
          icon: 'Wifi'
        },
        {
          label: '2. PARSE',
          title: 'Switch / Case Engine',
          description: 'The microcontroller reads Serial.read() and instantly branches to the corresponding movement function.',
          icon: 'Code'
        },
        {
          label: '3. FAILSAFE',
          title: 'Deadman Timeout',
          description: 'If millis() - lastCommandTime exceeds 1000ms, emergency stop engages to prevent runaway crashes.',
          icon: 'AlertTriangle'
        }
      ],
      safetyOrGoldenRule: 'Every wireless robot needs a communication failsafe! If a pilot walks out of range while sending \'F\', the robot must never drive off a table forever.'
    },
    interactiveVisualType: 'iot_dashboard_sim',
    codeLab: {
      title: 'Wireless Command Parser with Safety Timeout',
      language: 'cpp',
      code: `unsigned long lastCommandTime = 0;
const unsigned long FAILSAFE_TIMEOUT_MS = 1000; // Auto-stop if no signal for 1 sec

void setup() {
  Serial.begin(9600); // Bluetooth Module / USB Serial Telemetry
  initMotors();
}

void loop() {
  // 1. Check if a wireless command packet arrived
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    lastCommandTime = millis(); // Reset safety timer

    switch (cmd) {
      case 'F': forward(180);   break;
      case 'B': reverse(160);   break;
      case 'L': turnLeft(150);  break;
      case 'R': turnRight(150); break;
      case 'S': stopRobot();    break;
    }
  }

  // 2. Deadman Failsafe: Stop motors if connection drops for > 1 second
  if (millis() - lastCommandTime > FAILSAFE_TIMEOUT_MS) {
    stopRobot();
  }
}`,
      watchForNotes: [
        'Serial.available() checks if characters are waiting in the input buffer.',
        'millis() tracks real elapsed time without freezing the microcontroller like delay() does.',
        'switch (cmd) evaluates all cases cleanly with break statements.'
      ],
      tweakTip: 'Add case \'G\' to trigger your Class 12 servo gripper claw from the wireless controller!'
    },
    handsOnActivity: {
      title: 'Wireless Pilot & Blind Telemetry Challenge',
      subtitle: 'Pilot your robot through an obstacle course and test the deadman safety cutoff.',
      steps: [
        'Test the command parser using the Serial Monitor first by typing F, L, R, S and confirming instant response.',
        'Pair the wireless controller/smartphone app and test driving Smart Bee across the room.',
        'Verify the Deadman Failsafe by disconnecting while the wheels are spinning—confirm the robot brakes within 1 second.',
        'Navigate an obstacle course using both manual wireless piloting and an emergency autonomous override button.'
      ],
      successCriteria: [
        'Robot responds to all 5 directional commands (F, B, L, R, S).',
        'Failsafe stops the wheels automatically on disconnect.',
        'Team completes the wireless obstacle course.'
      ],
      tryNextAdvanced: 'Add speed gear commands (\'1\' = Slow Precision Mode, \'2\' = Medium, \'3\' = Turbo Speed) that dynamically update the PWM variable.'
    },
    exitCheckQuestions: [
      {
        id: 'c13-q1',
        question: 'Why do we send single characters like \'F\' instead of long sentences like "Please drive forward now" over wireless serial?',
        hint: 'Bandwidth, speed, and parsing simplicity.',
        sampleAnswer: 'Single bytes transmit almost instantaneously, use minimal bandwidth, and require zero complex string parsing in Arduino memory.'
      },
      {
        id: 'c13-q2',
        question: 'How does a switch (cmd) statement make command parsing cleaner than five if/else blocks?',
        hint: 'Evaluating a single variable against multiple exact values.',
        sampleAnswer: 'It jumps directly to the matching case value without evaluating multiple chained boolean expressions.'
      },
      {
        id: 'c13-q3',
        question: 'What does the millis() - lastCommandTime failsafe protect the robot from?',
        hint: 'What happens if the pilot\'s phone battery dies while the robot is moving?',
        sampleAnswer: 'It protects the robot from continuing to drive blindly into walls or off edges if wireless communication drops.'
      }
    ],
    nextClassTeaser: 'Class 14: Autonomous Combat & Mini-Sumo Robotics — The Grand Finale! Priority state machines, ring edge survival, and tournament combat!'
  },

  {
    id: 'class-14',
    classNumber: 14,
    code: 'CLASS 14',
    level: 'Integration & Advanced Robotics',
    title: 'Autonomous Combat & Mini-Sumo Robotics',
    subtitle: 'Combine edge detection, opponent radar locking, and priority state-machine logic for competition robotics.',
    durationMinutes: 60,
    status: 'locked',
    learningObjectives: [
      'Design a Priority Rule Hierarchy where staying inside the arena ring (Edge Survival) always overrides attacking an opponent.',
      'Combine bottom-mounted IR Edge Sensors (detecting the white ring border) with front Ultrasonic/Distance Opponent Sensors.',
      'Implement a mandatory 5-Second Competition Start Delay and an autonomous Search-and-Charge state machine.'
    ],
    classRhythm: {
      hook: '5 min: International Mini-Sumo robot battles in Japan: 500g machines with 3G acceleration!',
      concept: '10 min: Strict competition rules, dohyo dimensions, edge priority overriding radar attacks, and state machines.',
      demo: '15 min: Edge detection test: Putting robot at ring border and seeing immediate emergency reverse.',
      buildTest: '25 min: RoboBEE Mini-Sumo Championship tournament with friendly target cup knockdown!',
      exitCheck: '5 min: 3-question Exit Check quiz on rule priorities and the full RoboBEE curriculum journey.'
    },
    coreConcept: {
      headline: 'Priority State Machines & Autonomous Combat Tactics',
      summary: 'In competitive robotics, priority hierarchy dictates victory. Edge survival MUST override opponent charging, or the robot will eliminate itself from the tournament.',
      flowSteps: [
        {
          label: 'PRIORITY 1',
          title: 'Survive the Edge (Tawara)',
          description: 'Check bottom IR sensors first! If white border detected, immediately reverse and turn back to center.',
          icon: 'AlertOctagon'
        },
        {
          label: 'PRIORITY 2',
          title: 'Lock & Full-Power Charge',
          description: 'If safe inside the ring and front sensor detects opponent within 40cm, charge forward at 100% torque!',
          icon: 'Zap'
        },
        {
          label: 'PRIORITY 3',
          title: 'Tactical Arena Search',
          description: 'If no edge and no opponent in sight, rotate slowly to radar-scan the circular combat ring.',
          icon: 'Compass'
        }
      ],
      safetyOrGoldenRule: 'In autonomous robotics, rule priority is everything! If your robot sees an opponent outside the ring and does not check the floor sensor first, it will drive itself right out of the arena.'
    },
    interactiveVisualType: 'sumo_arena_sim',
    codeLab: {
      title: 'Autonomous Mini-Sumo State Machine',
      language: 'cpp',
      code: `const int EDGE_SENSOR_PIN = A0; // Bottom IR: LOW = White Ring Border Detected!
const int ATTACK_RANGE_CM = 40;

void setup() {
  initSumoHardware();
  // Official Competition Rule: Mandatory 5-second safety delay after pressing Start
  waitForStartButton();
  delay(5000);
}

void loop() {
  // PRIORITY 1: Check Ring Border FIRST (Survival overrides everything!)
  if (digitalRead(EDGE_SENSOR_PIN) == LOW) {
    reverse(220);
    delay(350);
    turnRight(200);
    delay(300);
    return; // Restart loop immediately to re-verify safety
  }

  // PRIORITY 2: Scan for Opponent Inside the Ring
  float opponentCm = readDistanceCm();
  if (opponentCm < ATTACK_RANGE_CM) {
    // Opponent Locked! Full power charge!
    forward(255);
  } else {
    // PRIORITY 3: Search Mode — Rotate slowly to scan the arena
    turnLeft(125);
  }
}`,
      watchForNotes: [
        'Notice return; after Priority 1 edge handling: this exits loop() instantly to re-check the edge before doing anything else.',
        'delay(5000) enforces the mandatory international competition rule allowing judges to step clear.',
        'High PWM values (255) provide maximum motor torque to push targets.'
      ],
      tweakTip: 'Notice how return; prevents the robot from ever seeing an opponent while its wheels are on the edge line!'
    },
    handsOnActivity: {
      title: 'The Grand RoboBEE Mini-Sumo Tournament',
      subtitle: 'Compete in the circular dohyo ring, eliminate target cups, and win the RoboBEE Cup!',
      steps: [
        'Verify the 5-second safety countdown with an LED countdown blink before the motors engage.',
        'Test Priority 1 (Edge Survival) alone in the circular ring—confirm the robot stays inside the white border for 30 seconds continuously.',
        'Place dummy target cups inside the ring and test Priority 2 & 3 (Search, Lock, and Knock Out targets without driving over the white line).',
        'Compete in the friendly classroom tournament and log your team\'s strategic adjustments between rounds!'
      ],
      successCriteria: [
        'Robot obeys the 5-second start rule.',
        'Never drives across the white boundary line.',
        'Autonomously locates and pushes targets out of the ring.'
      ],
      tryNextAdvanced: 'Add a "Tornado Search" or dual front sensors (Left-Front and Right-Front) so the robot actively steers toward a moving opponent while charging.'
    },
    exitCheckQuestions: [
      {
        id: 'c14-q1',
        question: 'Why must the Edge Sensor check (Priority 1) come BEFORE the Opponent Attack check (Priority 2) in loop()?',
        hint: 'What happens if an opponent is outside the ring?',
        sampleAnswer: 'Survival overrides attack: if the robot attacks without checking the edge, it will chase opponents right off the mat and lose.'
      },
      {
        id: 'c14-q2',
        question: 'Why do international Sumo Bot competitions require a strict 5-second delay after pressing the start button?',
        hint: 'Safety of human operators.',
        sampleAnswer: 'To allow the human pilots to press start and step back safely outside the arena before the robots engage.'
      },
      {
        id: 'c14-q3',
        question: 'How did all the skills from Class 01 to Class 13 come together in today\'s autonomous competition robot?',
        hint: 'Sense, Decide, Act, circuits, motors, functions, sensors, and timing.',
        sampleAnswer: 'Smart Bee uses sensors (IR + Sonar), microcontroller decisions, H-bridge motor drivers, calibrated movement functions, and failsafe state logic to operate completely autonomously.'
      }
    ],
    nextClassTeaser: 'Graduation Complete! Congratulations on mastering the RoboBEE 14-Class Robotics Academy! You are now prepared for National & Global Robotics Olympiads!'
  }
];

export const CURRICULUM_STATS = {
  totalClasses: 14,
  totalHours: 14,
  levels: [
    {
      name: 'Beginner Foundations' as CurriculumLevel,
      classes: [1, 2, 3, 4],
      color: '#F59E0B',
      description: 'Master robot architecture, electronic circuits, sensors, and algorithmic debugging.'
    },
    {
      name: 'Motion, Sensors & CAD' as CurriculumLevel,
      classes: [5, 6, 7, 8],
      color: '#06B6D4',
      description: 'H-Bridge motor drivers, differential drive functions, ultrasonic sonar, and 3D modeling.'
    },
    {
      name: 'Integration & Advanced Robotics' as CurriculumLevel,
      classes: [9, 10, 11, 12, 13, 14],
      color: '#10B981',
      description: 'Full-system Smart Bee integration, IR line followers, servo manipulators, IoT, and Mini-Sumo.'
    }
  ]
};
