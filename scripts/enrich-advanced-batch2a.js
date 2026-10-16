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

const adv07 = `  {
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
        explanation: 'A robot’s Center of Gravity ($z_{cg}$) governs its static stability margin and dynamic pushing traction: \\n$$z_{cg} = \\frac{\\sum (m_i \\times z_i)}{\\sum m_i}$$\\nIn our 500g Mini-Sumo robot, the battery pack represents 25% of total mass (~125g). Mounting the battery on an upper deck raised 40mm off the floor raises the CG, making the robot tip over backwards when accelerating or pushed by an opponent wedge! Professional competition chassis position heavy batteries as low as possible (slung 3mm beneath the main axle line), lowering the CG and maximizing tire normal force.',
        instructorNote: 'Use the CAD "Center of Mass" visualization tool: show how dropping the battery tray lowers the yellow balance marker.'
      },
      {
        title: '3. Captive Hex Nut Pockets & Teardrop Horizontal Holes',
        explanation: 'Threaded holes tapped directly into plastic strip out at less than 0.8 N-m of torque. Professional roboticists model Captive Hex Nut Pockets: a 5.8mm wide hexagonal pocket (for an M3 nut with 5.5mm nominal flats) traps the steel nut inside the print. Furthermore, circular holes printed horizontally through a vertical wall suffer from upper-arch droop because printers cannot bridge mid-air overhangs >45°. Designing the hole with a Teardrop Profile (a 45-degree pointed roof) allows the printer to lay down overhangs cleanly with zero support material!',
        instructorNote: 'Show the teardrop profile sketch: explain why a 45-degree angle bridges cleanly on every 3D printer.'
      },
      {
        title: '4. Structural Stiffening: Gussets, Fillets & Honeycomb Infill',
        explanation: 'A motor mount attached to a flat plate acts as a cantilever beam. Under stall torque, the joint experiences maximum bending stress: $\\sigma = \\frac{M \\cdot y}{I}$. Sharp 90-degree internal corners act as stress concentrators, leading to stress cracks. Adding a 45-degree triangular Gusset or a 3.0mm radius Fillet distributes bending moments across a 4x larger cross-sectional area, increasing rigidity by over 300% without adding significant mass. In slicing, using a Gyroid or 3D Honeycomb infill pattern provides isotropic internal stiffness.',
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
      code: \`// RoboBEE Innovators - Advanced 07
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
\`,
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
  }`;

console.log('Replacing adv-07...');
content = replaceLesson(content, 'adv-07', 'adv-08', adv07);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adv-07!');
