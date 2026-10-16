# RoboBEE Innovators: Authoritative Resource & Citation Manifest

This manifest documents all official technical references, datasheets, manufacturer specifications, competition rulebooks, and safety standards used across the **RoboBEE Innovators Robotics Academy** curriculum and the **Arduino & Robotics Field Guide**.

All educational explanations, lesson plans, schematics, and code labs are original works authored by RoboBEE Innovators and remain proprietary under the organization's institutional policy. Technical numbers (pin counts, voltage ratings, current limits, register addresses, and truth tables) are gathered and verified directly from the authoritative primary sources listed below.

---

## 1. Primary Hardware & Microcontroller References

### Arduino Uno Rev3 Documentation
- **Publisher**: Arduino AG
- **URL**: [https://docs.arduino.cc/hardware/uno-rev3](https://docs.arduino.cc/hardware/uno-rev3)
- **Version / Revision**: Rev 3.0 Reference Design
- **Retrieved**: March 15, 2026
- **License / Terms**: CC BY-SA 3.0 (Schematics/Design Files); Arduino Copyright (Documentation)
- **Supports**: 
  - Lessons: `beg-01`, `beg-02`, `beg-03`, `beg-04`, `beg-06`, `beg-07`, `beg-09`
  - Field Guide: Board Anatomy, Pinout Specification, Power Regulation
- **Key Verified Facts**:
  - Microcontroller: ATmega328P (16 MHz, 32 KB Flash, 2 KB SRAM, 1 KB EEPROM).
  - Operating Voltage: 5V DC.
  - Recommended Input Voltage (VIN / Barrel Jack): 7–12V DC (Absolute limits: 6–20V).
  - 14 Digital I/O pins (pins 0–13), of which 6 provide hardware PWM (pins 3, 5, 6, 9, 10, 11).
  - 6 Analog Inputs (A0–A5, 10-bit successive approximation ADC, 0–1023).
  - Built-in LED on Digital Pin 13.

### Microchip ATmega328P Datasheet
- **Publisher**: Microchip Technology Inc. (formerly Atmel Corp.)
- **URL**: [https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)
- **Document ID**: DS40002061B / Rev 7810D
- **Retrieved**: January 10, 2026
- **License / Terms**: All rights reserved by Microchip Technology Inc.
- **Supports**: Lessons `beg-01`, `beg-03`, `adv-03`; Field Guide Silicon Architecture.
- **Key Verified Facts**:
  - DC Current per I/O Pin: 20.0 mA (recommended test condition); 40.0 mA (absolute maximum stress rating).
  - Maximum current through VCC and GND pins: 200.0 mA.
  - External Interrupt vectors on INT0 (Pin 2) and INT1 (Pin 3).

### Arduino Language Reference
- **Publisher**: Arduino AG
- **URL**: [https://www.arduino.cc/reference/en/](https://www.arduino.cc/reference/en/)
- **Version**: Arduino Core API Standard 2026
- **Retrieved**: March 20, 2026
- **License / Terms**: CC BY-SA 3.0 / Arduino AG
- **Supports**: All coding lessons (`beg-01` through `adv-12`); Field Guide Programming Reference.
- **Key Verified Facts**:
  - `pinMode()` modes: `INPUT`, `OUTPUT`, `INPUT_PULLUP` (enables internal ~20kΩ pull-up resistor).
  - `millis()` rolls over after approximately 49.7 days; subtraction (`current - previous >= interval`) handles rollover correctly.
  - `analogWrite()` outputs PWM square wave (~490 Hz on pins 3, 9, 10, 11; ~980 Hz on pins 5, 6).

---

## 2. Electromechanical & Driver Datasheets

### Toshiba TB6612FNG Dual DC Motor Driver
- **Publisher**: Toshiba Electronic Devices & Storage Corp.
- **URL**: [https://toshiba.semicon-storage.com/info/TB6612FNG_datasheet_en_20141101.pdf](https://toshiba.semicon-storage.com/info/TB6612FNG_datasheet_en_20141101.pdf)
- **Revision**: Rev 2.0 (2014-11-01)
- **Retrieved**: February 14, 2026
- **License / Terms**: Toshiba Corporate Technical Publication
- **Supports**: Lessons `beg-06`, `beg-07`, `beg-09`, `int-04`, `int-05`; Field Guide Motor Drivers.
- **Key Verified Facts**:
  - Output current: 1.2 A (average continuous), 3.2 A (single pulse peak).
  - VM (motor supply): 4.5V to 15.0V. VCC (logic supply): 2.7V to 5.5V.
  - STBY (Standby) pin: MUST be held HIGH for normal operation; LOW shuts down H-bridges to high-impedance.
  - Truth Table:
    - IN1 = HIGH, IN2 = LOW -> Forward (CW)
    - IN1 = LOW, IN2 = HIGH -> Reverse (CCW)
    - IN1 = HIGH, IN2 = HIGH -> Short Brake
    - IN1 = LOW, IN2 = LOW -> Stop (Coast / High Impedance)

### HC-SR04 Ultrasonic Distance Sensor
- **Publisher**: ElecFreaks & SparkFun Verified Module Guide
- **URL**: [https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf)
- **Revision**: v2.0
- **Retrieved**: February 14, 2026
- **Supports**: Lessons `beg-09`, `beg-10`, `adv-09`; Field Guide Sonar Sensing.
- **Key Verified Facts**:
  - Operating Voltage: 5.0V DC. Working Current: 15 mA.
  - Trigger Input: 10 µs TTL pulse.
  - Echo Pulse Output: TTL signal proportional to round-trip distance.
  - Formula: $\text{Distance (cm)} = \frac{\text{Echo duration (µs)} \times 0.0343}{2}$.

### Vishay TCRT5000 Reflective Optical Sensor
- **Publisher**: Vishay Semiconductors
- **URL**: [https://www.vishay.com/docs/83760/tcrt5000.pdf](https://www.vishay.com/docs/83760/tcrt5000.pdf)
- **Document ID**: 83760 Rev. 1.8
- **Retrieved**: January 20, 2026
- **Supports**: Lessons `int-02`, `int-05`; Field Guide Line Detection.
- **Key Verified Facts**:
  - Peak operating distance: 2.5 mm; optical range: 0.2 mm to 15 mm.
  - IR Emitter wavelength: 950 nm; phototransistor daylight blocking filter.

### TowerPro SG90 Micro Servo
- **Publisher**: TowerPro Pte Ltd
- **URL**: [http://www.towerpro.com.tw/product/sg90-7/](http://www.towerpro.com.tw/product/sg90-7/)
- **Retrieved**: January 18, 2026
- **Supports**: Lessons `int-06`, `adv-11`; Field Guide Servo Mechanics.
- **Key Verified Facts**:
  - Control protocol: 50 Hz PWM frame (20 ms period), 1.0 ms (0°) to 2.0 ms (180°) pulse width.
  - Stall Torque: 1.8 kg·cm at 4.8V. Operating speed: 0.1 s / 60°.

---

## 3. Official Tournament Rulebooks & Standards

### FIRSO 2026 (Fibonacci International Robot & STEM Olympiad)
- **Category**: Bangladesh National Round (UIU Campus, Dhaka)
- **Year**: 2026
- **Verified Divisions**: Mega Sumo, Maze Solver (Micromouse), Robo Soccer
- **Source**: Verified from `team_info/robo_innovators_data.json`

### NRC 2026 (National Robotics Championship)
- **Category**: Bangladesh National Tournament (IUBAT Campus, Dhaka)
- **Date**: 2026-11-20
- **Official URL**: [https://www.nationalroboticschampionship.org/](https://www.nationalroboticschampionship.org/)
- **Verified Divisions**: Sumo Bot Combat, Robo Soccer, Junior Project Showcase
- **Source**: Verified from `team_info/robo_innovators_data.json`

---

## 4. RoboBEE Innovators Institutional Safety Code
- **Publisher**: RoboBEE Innovators Maker Lab
- **Location**: Kids Den Int. Preschool, Flat 2, 75 North Chashara, Narayanganj 1400
- **Standards Implemented**:
  - Low-Voltage Mandate: All beginner and explorer circuits strictly limited to $\le 12\text{V DC}$.
  - Prohibition of Mains Electricity Exploration: Students never probe, strip, or interface with $220\text{V AC}$ mains.
  - Instructor Review Gate: Mandatory inspection of wiring, polarities, and battery terminals before applying power.
  - Reverse Polarity Protection: Visual color-coding (Red = VCC/Power, Black = GND) enforced across all lab breadboards.
