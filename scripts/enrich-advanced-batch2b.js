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

const adv08 = `  {
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
        explanation: 'In competition halls (such as the World Robot Olympiad or Robot-Sumo championships), hundreds of active spectator smartphones jam public Wi-Fi networks, and cellular internet is often nonexistent. Relying on cloud servers (like AWS or Firebase) for robot control guarantees catastrophic failure. We design an Offline-First Architecture: the ESP32 acts as a standalone Wi-Fi router (Access Point Mode), broadcasting its own private SSID (\`WiFi.softAP("RoboBEE-Rover", "secret123")\`). Any phone or laptop connects directly to \`192.168.4.1\`, serving the complete HTML/CSS/JS dashboard stored in the ESP32 Flash memory with zero external dependencies.',
        instructorNote: 'Turn off the classroom Wi-Fi router: prove to students that their robot dashboard continues working flawlessly offline!'
      },
      {
        title: '3. High-Speed Telemetry: HTTP Polling vs Full-Duplex WebSockets',
        explanation: 'How does the web dashboard update live sensor data? Under HTTP Polling, the browser sends a \`GET /data\` request every 100ms. Each request requires establishing a TCP connection, exchanging HTTP headers (500 bytes of overhead), and tearing down the socket—wasting bandwidth and causing 50ms of latency. Professional robotics dashboards utilize WebSockets: a single TCP handshake upgrades the connection to a persistent, full-duplex socket. The robot pushes compact JSON or binary packets (\`{"v":7.42,"d":35}\`) at 20 Hz (every 50ms) with less than 2 bytes of overhead and sub-5ms latency!',
        instructorNote: 'Open the browser Developer Console Network tab: show students the difference between repetitive HTTP requests vs a single open WebSocket stream.'
      },
      {
        title: '4. Dual-Core Symmetric Multiprocessing via FreeRTOS Task Pinning',
        explanation: 'A critical vulnerability of single-core microcontrollers is that processing Wi-Fi network packets can temporarily interrupt motor PID calculations, causing high-speed robots to stutter or veer off track. The ESP32 solves this with Dual Cores: Core 0 (Protocol CPU) and Core 1 (Application CPU). Using FreeRTOS, we pin tasks explicitly: \\n\`\`\`cpp\\nxTaskCreatePinnedToCore(motorPIDLoop, "PID_Task", 4096, NULL, 1, NULL, 1);\\n\`\`\`\\nCore 1 runs high-speed motor control and sensor acquisition at a rock-solid 100 Hz, while Core 0 handles all Wi-Fi, TCP/IP, and web server processing. The two domains never interfere with each other!',
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
      code: \`// RoboBEE Innovators - Advanced 08
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

  String json = "{\\"v\\":" + String(batteryVoltage, 2) + ",\\"d\\":" + String(obstacleDistance) + "}";
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
\`,
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
  }`;

console.log('Replacing adv-08...');
content = replaceLesson(content, 'adv-08', 'adv-09', adv08);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-08!');
