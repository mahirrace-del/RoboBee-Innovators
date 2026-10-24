"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cpu, Zap, Radar, Shield, Activity, Compass, Play, RotateCcw } from "lucide-react";

export type RobotModelType = "micromouse" | "robotic_arm" | "robo_soccer";

interface RobotModelSpec {
  id: RobotModelType;
  name: string;
  category: string;
  tagline: string;
  mcu: string;
  sensors: string;
  actuators: string;
  specs: { label: string; value: string; unit?: string }[];
}

const ROBOT_MODELS: Record<RobotModelType, RobotModelSpec> = {
  micromouse: {
    id: "micromouse",
    name: "Autonomous Micromouse",
    category: "Maze Solver Bot",
    tagline: "High-speed flood-fill maze exploration with multi-axis ToF laser ranging",
    mcu: "STM32F401RE @ 84MHz",
    sensors: "4x VL53L0X Laser ToF + MPU6050 6-DOF IMU",
    actuators: "Dual High-RPM Coreless Micro Motors with Encoders",
    specs: [
      { label: "Top Speed", value: "3.2", unit: "m/s" },
      { label: "Turn Rate", value: "2400", unit: "°/s" },
      { label: "ToF Laser Ranging", value: "120", unit: "Hz" },
      { label: "Algorithm", value: "FloodFill V4" },
    ],
  },
  robotic_arm: {
    id: "robotic_arm",
    name: "3D-Printed 4-DOF Robotic Arm",
    category: "Kinematics & Automation",
    tagline: "Inverse kinematics articulated arm for precision pick-and-place lab sorting",
    mcu: "Arduino Uno R3 + Custom Shield",
    sensors: "Optical Home Limit Switches + Current Feedback",
    actuators: "4x Metal Gear High-Torque MG996R Servos",
    specs: [
      { label: "Payload Capacity", value: "450", unit: "g" },
      { label: "Reach Radius", value: "285", unit: "mm" },
      { label: "Kinematics", value: "Analytical IK" },
      { label: "Resolution", value: "0.5", unit: "mm" },
    ],
  },
  robo_soccer: {
    id: "robo_soccer",
    name: "Mega Sumo & Soccer Bot",
    category: "Combat & RC Athletics",
    tagline: "High-traction competition striker robot built for FIRSO 2026 UIU National Round",
    mcu: "ESP32 Dual Core + Bluetooth Low Energy",
    sensors: "Front Line Tracking + Ultrasonic Distance + IR Beams",
    actuators: "2x 12V Planetary DC Gear Motors with Steel Wedge Bumper",
    specs: [
      { label: "Push Force", value: "18.5", unit: "N" },
      { label: "Traction Rate", value: "99.2", unit: "%" },
      { label: "Battery", value: "3S 11.1V", unit: "LiPo" },
      { label: "Response Lag", value: "<12", unit: "ms" },
    ],
  },
};

export function HeroRobotics3DViewport() {
  const [activeModel, setActiveModel] = useState<RobotModelType>("micromouse");
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(25);
  const [elevationAngle, setElevationAngle] = useState(15);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [laserBeamActive, setLaserBeamActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const currentSpec = ROBOT_MODELS[activeModel];

  // Telemetry real-time ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 1000);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Continuous auto-rotation when not interacting
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.45) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Pointer drag controls for 3D rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    setRotationAngle((prev) => (prev + dx * 0.7) % 360);
    setElevationAngle((prev) => Math.max(-25, Math.min(45, prev - dy * 0.4)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // High-performance Canvas Rendering of 3D wireframe robot & holographic laser beams
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = 640;
    const height = 480;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radRot = (rotationAngle * Math.PI) / 180;
      const radElev = (elevationAngle * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2 + 15;

      // 1. Draw glowing holographic grid floor
      ctx.save();
      const gridSize = 180;
      const step = 30;
      ctx.strokeStyle = "rgba(245, 183, 0, 0.12)";
      ctx.lineWidth = 1;

      for (let x = -gridSize; x <= gridSize; x += step) {
        const x1 = x * Math.cos(radRot) - (-gridSize) * Math.sin(radRot);
        const y1 = (x * Math.sin(radRot) + (-gridSize) * Math.cos(radRot)) * Math.sin(radElev);
        const x2 = x * Math.cos(radRot) - gridSize * Math.sin(radRot);
        const y2 = (x * Math.sin(radRot) + gridSize * Math.cos(radRot)) * Math.sin(radElev);
        ctx.beginPath();
        ctx.moveTo(cx + x1, cy + 85 + y1);
        ctx.lineTo(cx + x2, cy + 85 + y2);
        ctx.stroke();
      }

      for (let y = -gridSize; y <= gridSize; y += step) {
        const x1 = (-gridSize) * Math.cos(radRot) - y * Math.sin(radRot);
        const y1 = ((-gridSize) * Math.sin(radRot) + y * Math.cos(radRot)) * Math.sin(radElev);
        const x2 = gridSize * Math.cos(radRot) - y * Math.sin(radRot);
        const y2 = (gridSize * Math.sin(radRot) + y * Math.cos(radRot)) * Math.sin(radElev);
        ctx.beginPath();
        ctx.moveTo(cx + x1, cy + 85 + y1);
        ctx.lineTo(cx + x2, cy + 85 + y2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Project 3D Model Vertices
      // 3D projection helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * Math.cos(radRot) - z * Math.sin(radRot);
        const z1 = x * Math.sin(radRot) + z * Math.cos(radRot);
        // Rotate around X (elevation)
        const y2 = y * Math.cos(radElev) - z1 * Math.sin(radElev);
        const z2 = y * Math.sin(radElev) + z1 * Math.cos(radElev);
        const fov = 420;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      };

      // Draw active robot model
      if (activeModel === "micromouse") {
        // Chassis Box
        const w = 65;
        const l = 85;
        const h = 26;
        const nodes = [
          [-w, -h, -l], [w, -h, -l], [w, h, -l], [-w, h, -l],
          [-w, -h, l], [w, -h, l], [w, h, l], [-w, h, l],
        ];
        const pNodes = nodes.map(([x, y, z]) => project(x, y, z));

        // Draw solid glowing chassis faces
        ctx.fillStyle = "rgba(46, 0, 28, 0.65)";
        ctx.strokeStyle = "#F5B700";
        ctx.lineWidth = 2;

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(pNodes[i].x, pNodes[i].y);
          ctx.lineTo(pNodes[j].x, pNodes[j].y);
          ctx.stroke();
        });

        // Wheels
        [-w - 8, w + 8].forEach((wheelX) => {
          const wF = project(wheelX, 6, -18);
          const wR = project(wheelX, 6, 18);
          ctx.strokeStyle = "#00F0FF";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(wF.x, wF.y);
          ctx.lineTo(wR.x, wR.y);
          ctx.stroke();
        });

        // Laser ToF Beams (Front Left, Front Right, Center)
        if (laserBeamActive) {
          const frontCenter = project(0, 0, -l);
          const leftSensor = project(-w + 12, 0, -l + 6);
          const rightSensor = project(w - 12, 0, -l + 6);

          const pulse = Math.sin(telemetryTick * 0.4) * 15;
          const beamTargetC = project(0, -10, -l - 130 + pulse);
          const beamTargetL = project(-110, -5, -l - 90 + pulse);
          const beamTargetR = project(110, -5, -l - 90 + pulse);

          ctx.lineWidth = 1.5;
          // Center Beam
          ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
          ctx.beginPath();
          ctx.moveTo(frontCenter.x, frontCenter.y);
          ctx.lineTo(beamTargetC.x, beamTargetC.y);
          ctx.stroke();

          // Left Beam
          ctx.strokeStyle = "rgba(245, 183, 0, 0.75)";
          ctx.beginPath();
          ctx.moveTo(leftSensor.x, leftSensor.y);
          ctx.lineTo(beamTargetL.x, beamTargetL.y);
          ctx.stroke();

          // Right Beam
          ctx.strokeStyle = "rgba(245, 183, 0, 0.75)";
          ctx.beginPath();
          ctx.moveTo(rightSensor.x, rightSensor.y);
          ctx.lineTo(beamTargetR.x, beamTargetR.y);
          ctx.stroke();

          // Beam Target Impact Rings
          [beamTargetC, beamTargetL, beamTargetR].forEach((target, idx) => {
            ctx.fillStyle = idx === 0 ? "rgba(0, 240, 255, 0.4)" : "rgba(245, 183, 0, 0.4)";
            ctx.beginPath();
            ctx.arc(target.x, target.y, 4 + Math.sin(telemetryTick * 0.5) * 2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      } else if (activeModel === "robotic_arm") {
        // Articulated Robotic Arm
        const base = project(0, 50, 0);
        const shoulder = project(0, 0, 0);
        const elbow = project(
          Math.sin(telemetryTick * 0.08) * 35,
          -65,
          Math.cos(telemetryTick * 0.08) * 25
        );
        const wrist = project(
          Math.sin(telemetryTick * 0.08) * 60 + 20,
          -110,
          Math.cos(telemetryTick * 0.08) * 40
        );
        const gripperL = project(
          Math.sin(telemetryTick * 0.08) * 60 + 35,
          -130,
          Math.cos(telemetryTick * 0.08) * 40 - 12
        );
        const gripperR = project(
          Math.sin(telemetryTick * 0.08) * 60 + 35,
          -130,
          Math.cos(telemetryTick * 0.08) * 40 + 12
        );

        // Draw Links
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#F5B700";
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(shoulder.x, shoulder.y);
        ctx.lineTo(elbow.x, elbow.y);
        ctx.lineTo(wrist.x, wrist.y);
        ctx.stroke();

        // Draw Gripper
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00F0FF";
        ctx.beginPath();
        ctx.moveTo(wrist.x, wrist.y);
        ctx.lineTo(gripperL.x, gripperL.y);
        ctx.moveTo(wrist.x, wrist.y);
        ctx.lineTo(gripperR.x, gripperR.y);
        ctx.stroke();

        // Joint Rings
        [base, shoulder, elbow, wrist].forEach((joint) => {
          ctx.fillStyle = "#FF0055";
          ctx.beginPath();
          ctx.arc(joint.x, joint.y, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Mega Sumo & Soccer Bot
        const w = 80;
        const l = 80;
        const h = 30;
        const bodyNodes = [
          [-w, -h, -l], [w, -h, -l], [w, h, -l], [-w, h, -l],
          [-w, -h, l], [w, -h, l], [w, h, l], [-w, h, l],
        ];
        const pNodes = bodyNodes.map(([x, y, z]) => project(x, y, z));

        ctx.fillStyle = "rgba(46, 0, 28, 0.75)";
        ctx.strokeStyle = "#F5B700";
        ctx.lineWidth = 2.5;

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(pNodes[i].x, pNodes[i].y);
          ctx.lineTo(pNodes[j].x, pNodes[j].y);
          ctx.stroke();
        });

        // Heavy Steel Front Wedge
        const wedgeTipL = project(-w - 15, h + 10, -l - 35);
        const wedgeTipR = project(w + 15, h + 10, -l - 35);
        ctx.strokeStyle = "#00F0FF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pNodes[3].x, pNodes[3].y);
        ctx.lineTo(wedgeTipL.x, wedgeTipL.y);
        ctx.lineTo(wedgeTipR.x, wedgeTipR.y);
        ctx.lineTo(pNodes[2].x, pNodes[2].y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeModel, rotationAngle, elevationAngle, telemetryTick, laserBeamActive]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        borderRadius: "24px",
        background: "linear-gradient(145deg, rgba(30, 3, 19, 0.85) 0%, rgba(11, 14, 23, 0.95) 100%)",
        border: "1px solid rgba(245, 183, 0, 0.28)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 183, 0, 0.12)",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top Model Switcher Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.4rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(10, 11, 16, 0.6)",
          flexWrap: "wrap",
          gap: "0.8rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["micromouse", "robotic_arm", "robo_soccer"] as RobotModelType[]).map((type) => {
            const isSelected = activeModel === type;
            const model = ROBOT_MODELS[type];
            return (
              <button
                key={type}
                onClick={() => setActiveModel(type)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: isSelected ? "1px solid #F5B700" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(245, 183, 0, 0.2) 0%, rgba(107, 15, 36, 0.3) 100%)"
                    : "rgba(255, 255, 255, 0.03)",
                  color: isSelected ? "#F5B700" : "#94A3B8",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {type === "micromouse" && <Compass size={14} />}
                {type === "robotic_arm" && <Activity size={14} />}
                {type === "robo_soccer" && <Shield size={14} />}
                <span>{model.category}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setIsRotating((p) => !p)}
            title="Toggle 360° Auto-Rotation"
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              background: isRotating ? "rgba(245, 183, 0, 0.15)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(245, 183, 0, 0.3)",
              color: isRotating ? "#F5B700" : "#94A3B8",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <RotateCcw size={12} />
            <span>{isRotating ? "Orbiting" : "Paused"}</span>
          </button>

          <button
            onClick={() => setLaserBeamActive((p) => !p)}
            title="Toggle ToF Laser Telemetry"
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "8px",
              background: laserBeamActive ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              color: laserBeamActive ? "#00F0FF" : "#94A3B8",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Zap size={12} />
            <span>ToF Sensor</span>
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Canvas Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: "relative",
          width: "100%",
          height: "380px",
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          touchAction: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {/* Live HUD Overlay Readouts */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "18px",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "#00F0FF",
              letterSpacing: "1px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00F0FF",
                boxShadow: "0 0 10px #00F0FF",
                display: "inline-block",
              }}
            />
            LIVE TELEMETRY ACTIVE
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
            }}
          >
            {currentSpec.name}
          </div>

          <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
            MCU: <span style={{ color: "#F5B700", fontWeight: 700 }}>{currentSpec.mcu}</span>
          </div>
        </div>

        {/* Live Telemetry Radar Compass at Top Right */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            pointerEvents: "none",
            background: "rgba(10, 14, 23, 0.75)",
            border: "1px solid rgba(0, 240, 255, 0.25)",
            borderRadius: "12px",
            padding: "0.5rem 0.8rem",
            textAlign: "right",
          }}
        >
          <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase" }}>
            Yaw Heading
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#00F0FF",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {Math.round(rotationAngle)}° NNE
          </div>
        </div>

        {/* Drag Hint at Bottom Center */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.72rem",
            color: "rgba(255, 255, 255, 0.45)",
            pointerEvents: "none",
            letterSpacing: "0.5px",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "0.2rem 0.6rem",
            borderRadius: "20px",
          }}
        >
          ✦ Drag with mouse or finger to rotate 3D hardware in 360°
        </div>
      </div>

      {/* Bottom Technical Spec Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.8rem",
          padding: "1rem 1.4rem",
          background: "rgba(10, 11, 16, 0.85)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {currentSpec.specs.map((item, idx) => (
          <div key={idx}>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase" }}>
              {item.label}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F5B700" }}>
              {item.value} {item.unit && <span style={{ fontSize: "0.75rem", color: "#FFFFFF" }}>{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
