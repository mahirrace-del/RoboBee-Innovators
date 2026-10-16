/**
 * RoboBEE Innovators - Authoritative Resource Manifest
 * 
 * Central manifest of all official datasheets, standards, documentation, and references
 * cited across the RoboBEE curriculum and Field Guide.
 * 
 * Copyright (c) RoboBEE Innovators. Proprietary curriculum & educational architecture.
 */

export interface AuthoritativeResource {
  id: string;
  title: string;
  publisher: string;
  category: 'official_documentation' | 'manufacturer_datasheet' | 'competition_rulebook' | 'academic_standard' | 'instructor_developed';
  url: string;
  versionOrRevision?: string;
  retrievedOrPublishedDate: string;
  licenseOrTerms: string;
  supports: {
    lessonIds?: string[];
    fieldGuideSectionIds?: string[];
    topics?: string[];
  };
  summary: string;
}

export const AUTHORITATIVE_RESOURCES: AuthoritativeResource[] = [
  {
    id: 'arduino-uno-r3-docs',
    title: 'Arduino Uno Rev3 Official Documentation & Tech Specs',
    publisher: 'Arduino AG',
    category: 'official_documentation',
    url: 'https://docs.arduino.cc/hardware/uno-rev3',
    versionOrRevision: 'Rev 3 (Schematics reference Rev 3.0)',
    retrievedOrPublishedDate: '2026-03-15',
    licenseOrTerms: 'Creative Commons Attribution-ShareAlike 3.0 (Schematics/Design); Arduino Copyright (Docs)',
    supports: {
      lessonIds: ['beg-01', 'beg-02', 'beg-03', 'beg-04', 'beg-06', 'beg-07', 'beg-09'],
      fieldGuideSectionIds: ['arduino', 'board', 'electronics', 'components'],
      topics: ['Uno R3 anatomy', 'pinout', 'electrical limits', 'PWM pins', 'ADC resolution']
    },
    summary: 'Official technical specifications, microcontroller pin assignment, power jack 7-12V tolerances, and ATmega328P integration.'
  },
  {
    id: 'atmega328p-datasheet',
    title: 'ATmega328P 8-bit AVR Microcontroller with 32K Bytes In-System Programmable Flash',
    publisher: 'Microchip Technology Inc. (formerly Atmel Corporation)',
    category: 'manufacturer_datasheet',
    url: 'https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf',
    versionOrRevision: 'DS40002061B / Rev 7810D',
    retrievedOrPublishedDate: '2026-01-10',
    licenseOrTerms: 'All rights reserved by Microchip Technology Inc.',
    supports: {
      lessonIds: ['beg-01', 'beg-03', 'adv-03'],
      fieldGuideSectionIds: ['board', 'electronics', 'programming'],
      topics: ['Electrical characteristics', '20mA recommended DC current per I/O pin', '200mA VCC/GND total package limit', '16MHz clock']
    },
    summary: 'Definitive silicon limits for GPIO sink/source current, timer/counter hardware, interrupt vectors, and ADC timing.'
  },
  {
    id: 'arduino-lang-reference',
    title: 'Arduino Programming Language Reference',
    publisher: 'Arduino AG',
    category: 'official_documentation',
    url: 'https://www.arduino.cc/reference/en/',
    versionOrRevision: 'Arduino Language Standard 2026',
    retrievedOrPublishedDate: '2026-03-20',
    licenseOrTerms: 'Creative Commons Attribution-ShareAlike 3.0 / Arduino AG',
    supports: {
      lessonIds: ['beg-01', 'beg-03', 'beg-05', 'int-03', 'adv-03'],
      fieldGuideSectionIds: ['programming'],
      topics: ['setup', 'loop', 'pinMode', 'digitalWrite', 'digitalRead', 'analogRead', 'analogWrite', 'millis', 'delay']
    },
    summary: 'Syntax specifications and behavioral definitions for Arduino core API functions and standard data types.'
  },
  {
    id: 'toshiba-tb6612fng',
    title: 'TB6612FNG Driver IC for Dual DC Motor Datasheet',
    publisher: 'Toshiba Electronic Devices & Storage Corporation',
    category: 'manufacturer_datasheet',
    url: 'https://toshiba.semicon-storage.com/info/TB6612FNG_datasheet_en_20141101.pdf',
    versionOrRevision: 'Rev.2.0 2014-11-01',
    retrievedOrPublishedDate: '2026-02-14',
    licenseOrTerms: 'All rights reserved by Toshiba Corporation',
    supports: {
      lessonIds: ['beg-06', 'beg-07', 'beg-09', 'beg-10', 'int-04', 'int-05'],
      fieldGuideSectionIds: ['components', 'motion'],
      topics: ['H-Bridge logic', 'STBY pin behavior', 'IN1/IN2 truth table', '1.2A average / 3.2A peak output current', 'MOSFET low RDS(on)']
    },
    summary: 'Truth table and electrical limits for dual-channel H-Bridge motor driver module used in differential-drive rovers.'
  },
  {
    id: 'hc-sr04-datasheet',
    title: 'Ultrasonic Ranging Module HC - SR04 User Manual & Specifications',
    publisher: 'ElecFreaks / SparkFun Electronics Verified Reference',
    category: 'manufacturer_datasheet',
    url: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf',
    versionOrRevision: 'v2.0',
    retrievedOrPublishedDate: '2026-02-14',
    licenseOrTerms: 'Public Technical Documentation',
    supports: {
      lessonIds: ['beg-09', 'beg-10', 'adv-09'],
      fieldGuideSectionIds: ['components', 'sensors'],
      topics: ['10us trigger pulse', 'echo pulse duration', 'speed of sound calculation 340m/s', '2cm-400cm range']
    },
    summary: 'Operational timing diagrams, ultrasonic echo travel formulas, and 5V trigger requirements.'
  },
  {
    id: 'tcrt5000-datasheet',
    title: 'TCRT5000 / TCRT5000L Reflective Optical Sensor with Transistor Output',
    publisher: 'Vishay Semiconductors',
    category: 'manufacturer_datasheet',
    url: 'https://www.vishay.com/docs/83760/tcrt5000.pdf',
    versionOrRevision: 'Document Number: 83760 Rev. 1.8 15-Jul-11',
    retrievedOrPublishedDate: '2026-01-20',
    licenseOrTerms: 'All rights reserved by Vishay Intertechnology, Inc.',
    supports: {
      lessonIds: ['int-02', 'int-05'],
      fieldGuideSectionIds: ['components', 'sensors'],
      topics: ['Infrared emitter 950nm', 'phototransistor detector', 'peak operating distance 2.5mm', 'analog thresholding']
    },
    summary: 'Optical reflectance curve, dark current, daylight filtering, and emitter forward voltage characteristics.'
  },
  {
    id: 'towerpro-sg90',
    title: 'TowerPro SG90 9g Micro Servo Technical Specifications',
    publisher: 'TowerPro Pte Ltd',
    category: 'manufacturer_datasheet',
    url: 'http://www.towerpro.com.tw/product/sg90-7/',
    versionOrRevision: 'Official Specification Sheet',
    retrievedOrPublishedDate: '2026-01-18',
    licenseOrTerms: 'TowerPro Commercial Documentation',
    supports: {
      lessonIds: ['int-06', 'adv-11'],
      fieldGuideSectionIds: ['components', 'motion'],
      topics: ['50Hz PWM frequency', '1ms to 2ms pulse width', '4.8V-6.0V operating range', '1.8 kg-cm stall torque', 'nylon gear protection']
    },
    summary: 'Position control timing, angular limits (0-180 degrees), current spike mitigation, and external power separation.'
  },
  {
    id: 'invensense-mpu6050',
    title: 'MPU-6000 and MPU-6050 Product Specification & Register Map',
    publisher: 'TDK InvenSense',
    category: 'manufacturer_datasheet',
    url: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf',
    versionOrRevision: 'Revision 3.4 (PS-MPU-6000A-00)',
    retrievedOrPublishedDate: '2026-02-05',
    licenseOrTerms: 'All rights reserved by TDK InvenSense',
    supports: {
      lessonIds: ['adv-06'],
      fieldGuideSectionIds: ['components', 'motion'],
      topics: ['3-axis gyroscope', '3-axis accelerometer', 'I2C address 0x68/0x69', 'Digital Motion Processor (DMP)', 'sensor drift']
    },
    summary: '6-DOF inertial measurement specifications, sensitivity scales (+/-250 to +/-2000 deg/s), and I2C registers.'
  },
  {
    id: 'firso-2026-rules',
    title: 'Fibonacci International Robot & STEM Olympiad (FIRSO) 2026 Bangladesh National Round Handbook',
    publisher: 'FIRSO Executive Committee & UIU Robotics Partner Network',
    category: 'competition_rulebook',
    url: 'https://robobeeinnovators.org/competitions/firso-2026-bangladesh',
    versionOrRevision: 'Edition 2026.1 (Verified from team_info)',
    retrievedOrPublishedDate: '2026-10-12',
    licenseOrTerms: 'FIRSO Tournament Operating Guidelines',
    supports: {
      lessonIds: ['adv-01', 'adv-09', 'adv-11', 'adv-12'],
      fieldGuideSectionIds: ['competitions', 'safety'],
      topics: ['Mega Sumo dimensions & weights', 'Maze Solver arena grid', 'Robo Soccer ring dimensions', 'failsafe rules']
    },
    summary: 'Official tournament category definitions, physical robot size/mass limits, autonomous start procedures, and referee safety flags.'
  },
  {
    id: 'nrc-2026-regulations',
    title: 'National Robotics Championship (NRC) 2026 Official Tournament Regulations',
    publisher: 'IUBAT Robotics Club / National Robotics Championship Committee',
    category: 'competition_rulebook',
    url: 'https://www.nationalroboticschampionship.org/',
    versionOrRevision: '2026 Season Handbook (Verified from team_info)',
    retrievedOrPublishedDate: '2026-10-12',
    licenseOrTerms: 'NRC Tournament Operating Committee',
    supports: {
      lessonIds: ['adv-01', 'adv-09', 'adv-12'],
      fieldGuideSectionIds: ['competitions', 'safety'],
      topics: ['Sumo Bot Combat limits', 'Robo Soccer specs', 'Junior Project Showcase rubrics', 'safety inspection checklist']
    },
    summary: 'Competition rulebook for the 500,000 BDT prize pool national championship hosted at IUBAT Campus, Dhaka.'
  },
  {
    id: 'robobee-lab-safety-standard',
    title: 'RoboBEE Innovators Maker Lab Electrical & Mechanical Safety Standard',
    publisher: 'RoboBEE Innovators (Penny Bee Solutions / Kids Den Int. Preschool)',
    category: 'instructor_developed',
    url: 'https://robobeeinnovators.org/safety-standards',
    versionOrRevision: 'Version 2026.3',
    retrievedOrPublishedDate: '2026-10-15',
    licenseOrTerms: 'Proprietary RoboBEE Innovators Educational Architecture',
    supports: {
      lessonIds: ['exp-02', 'beg-01', 'beg-02', 'beg-06', 'beg-09', 'int-05', 'adv-02', 'adv-09'],
      fieldGuideSectionIds: ['safety', 'electronics'],
      topics: ['Low-voltage limit (<12V DC)', 'no mains exploration', 'two-finger battery inspection', 'reverse polarity check', 'instructor review gate']
    },
    summary: 'Classroom safety protocol mandating instructor inspection before battery connection, dedicated motor supplies, and eye protection during cutting.'
  }
];

export function getResourceById(id: string): AuthoritativeResource | undefined {
  return AUTHORITATIVE_RESOURCES.find(r => r.id === id);
}
