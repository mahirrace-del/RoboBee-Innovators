"use client";

import { useEffect, useRef } from "react";

export default function InteractiveRobotScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Keep the illustration lightweight and still when motion is reduced or the
    // visitor is on a touch-first/small device.
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 640px)").matches) return;

    let frame = 0;
    let visible = true;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (!host || disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(4.6, 3.6, 7.2);
      camera.lookAt(0, 1.62, 0);

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      host.appendChild(renderer.domElement);
      const fallbackArtwork = host.parentElement?.querySelector(".robotFallback");
      fallbackArtwork?.setAttribute("hidden", "");

      scene.add(new THREE.HemisphereLight(0xfff8ed, 0x4f3834, 2.1));
      const keyLight = new THREE.DirectionalLight(0xfff1cf, 3.5);
      keyLight.position.set(3.5, 6, 5);
      scene.add(keyLight);
      const fillLight = new THREE.PointLight(0xffc753, 11, 13);
      fillLight.position.set(-3, 3.5, 3);
      scene.add(fillLight);
      const rimLight = new THREE.PointLight(0x9a5733, 7, 11);
      rimLight.position.set(2.5, 3.2, -4);
      scene.add(rimLight);

      const robot = new THREE.Group();
      scene.add(robot);

      const ochre = new THREE.MeshStandardMaterial({ color: 0xd99827, roughness: 0.38, metalness: 0.26 });
      const sunny = new THREE.MeshStandardMaterial({ color: 0xf2b83f, roughness: 0.32, metalness: 0.2 });
      const paleGold = new THREE.MeshStandardMaterial({ color: 0xffd36c, roughness: 0.3, metalness: 0.22 });
      const copper = new THREE.MeshStandardMaterial({ color: 0x8d5734, roughness: 0.48, metalness: 0.42 });
      const metal = new THREE.MeshStandardMaterial({ color: 0x9c9b91, roughness: 0.42, metalness: 0.62 });
      const darkMetal = new THREE.MeshStandardMaterial({ color: 0x393b3a, roughness: 0.63, metalness: 0.22 });
      const treadRubber = new THREE.MeshStandardMaterial({ color: 0x292b2b, roughness: 0.78, metalness: 0.12 });
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x302d2b, roughness: 0.13, metalness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
      const irisMaterial = new THREE.MeshStandardMaterial({ color: 0xd88a29, roughness: 0.28, metalness: 0.3 });
      const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x241d1a, roughness: 0.16, metalness: 0.08 });
      const glint = new THREE.MeshBasicMaterial({ color: 0xfff7de });
      const lensAssemblies: import("three").Group[] = [];
      const pupils: import("three").Mesh[] = [];

      const markMesh = (mesh: import("three").Mesh) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      };

      const makeSphere = (
        parent: import("three").Object3D,
        geometry: import("three").SphereGeometry,
        material: import("three").Material,
        position: [number, number, number],
        scale: [number, number, number]
      ) => {
        const mesh = markMesh(new THREE.Mesh(geometry, material));
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        parent.add(mesh);
        return mesh;
      };

      const makeRoundedBox = (
        parent: import("three").Object3D,
        position: [number, number, number],
        width: number,
        height: number,
        depth: number,
        radius: number,
        material: import("three").Material
      ) => {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const r = Math.min(radius, halfWidth * 0.48, halfHeight * 0.48);
        const shape = new THREE.Shape();
        shape.moveTo(-halfWidth + r, -halfHeight);
        shape.lineTo(halfWidth - r, -halfHeight);
        shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + r);
        shape.lineTo(halfWidth, halfHeight - r);
        shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - r, halfHeight);
        shape.lineTo(-halfWidth + r, halfHeight);
        shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - r);
        shape.lineTo(-halfWidth, -halfHeight + r);
        shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + r, -halfHeight);

        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelSegments: 3,
          bevelSize: Math.min(r * 0.38, 0.065),
          bevelThickness: Math.min(r * 0.32, 0.055),
          steps: 1,
        });
        geometry.translate(0, 0, -depth / 2);
        geometry.computeVertexNormals();
        const mesh = markMesh(new THREE.Mesh(geometry, material));
        mesh.position.set(...position);
        parent.add(mesh);
        return mesh;
      };

      const makeTube = (
        parent: import("three").Object3D,
        points: [number, number, number][],
        radius: number,
        material: import("three").Material
      ) => {
        const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
        const mesh = markMesh(new THREE.Mesh(new THREE.TubeGeometry(curve, 18, radius, 8, false), material));
        parent.add(mesh);
        return mesh;
      };

      const softSphere = new THREE.SphereGeometry(1, 24, 18);

      // Twin rubber tracks, detailed with softly rounded pads and warm hub caps.
      const tracks: import("three").Group[] = [];
      for (const side of [-1, 1]) {
        const track = new THREE.Group();
        track.position.set(side * 0.79, 0.48, 0.01);
        robot.add(track);
        makeRoundedBox(track, [0, 0, 0], 0.55, 0.76, 0.34, 0.24, treadRubber);
        makeRoundedBox(track, [0, 0, 0.188], 0.39, 0.6, 0.045, 0.18, darkMetal);

        for (let pad = 0; pad < 5; pad++) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.018), metal);
          bar.position.set((pad - 2) * 0.067, 0.255, 0.22);
          bar.rotation.z = (pad - 2) * 0.04;
          track.add(markMesh(bar));
          const lowerBar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.018), metal);
          lowerBar.position.set((pad - 2) * 0.067, -0.255, 0.22);
          lowerBar.rotation.z = (2 - pad) * 0.04;
          track.add(markMesh(lowerBar));
        }

        for (const wheelY of [-0.22, 0, 0.22]) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelY === 0 ? 0.19 : 0.125, wheelY === 0 ? 0.19 : 0.125, 0.08, 28), copper);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(0, wheelY, 0.242);
          track.add(markMesh(wheel));
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(wheelY === 0 ? 0.105 : 0.065, wheelY === 0 ? 0.105 : 0.065, 0.018, 24), paleGold);
          cap.rotation.x = Math.PI / 2;
          cap.position.set(0, wheelY, 0.294);
          track.add(markMesh(cap));
        }
        tracks.push(track);
      }

      // Rounded, slightly weathered hull with inset front service panels.
      makeRoundedBox(robot, [0, 1.34, 0], 1.42, 1.08, 0.9, 0.18, ochre);
      makeRoundedBox(robot, [0, 1.44, 0.461], 1.2, 0.79, 0.06, 0.13, sunny);
      makeRoundedBox(robot, [0, 1.31, 0.51], 0.72, 0.36, 0.06, 0.085, copper);
      makeRoundedBox(robot, [0, 1.31, 0.551], 0.64, 0.29, 0.025, 0.065, ochre);

      for (let vent = 0; vent < 5; vent++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.022, 0.018), darkMetal);
        slat.position.set(0, 1.39 - vent * 0.052, 0.576);
        robot.add(markMesh(slat));
      }
      for (const x of [-0.48, 0.48]) {
        for (const y of [1.67, 1.2, 0.94]) {
          makeSphere(robot, softSphere, copper, [x, y, 0.513], [0.035, 0.035, 0.025]);
          makeSphere(robot, softSphere, paleGold, [x, y, 0.535], [0.013, 0.013, 0.012]);
        }
      }
      makeRoundedBox(robot, [-0.44, 1.78, 0.47], 0.24, 0.08, 0.045, 0.035, paleGold);
      makeRoundedBox(robot, [0.44, 1.78, 0.47], 0.24, 0.08, 0.045, 0.035, paleGold);

      // A jointed neck lifts the binocular camera head above the rover body.
      const neck = new THREE.Group();
      neck.position.set(0, 1.86, 0.02);
      robot.add(neck);
      const lowerNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.12, 0.43, 24), darkMetal);
      lowerNeck.position.y = 0.24;
      neck.add(markMesh(lowerNeck));
      const neckSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.11, 24), copper);
      neckSleeve.position.y = 0.08;
      neck.add(markMesh(neckSleeve));
      const upperNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.33, 24), metal);
      upperNeck.position.y = 0.5;
      neck.add(markMesh(upperNeck));

      const head = new THREE.Group();
      head.position.set(0, 0.74, 0.02);
      neck.add(head);
      const bridge = makeRoundedBox(head, [0, 0.015, 0.02], 0.56, 0.23, 0.34, 0.1, ochre);
      bridge.rotation.z = -0.02;

      // Two warm brass optical barrels with glossy, gaze-tracking eyes.
      for (const side of [-1, 1]) {
        const eye = new THREE.Group();
        eye.position.set(side * 0.225, 0.12, 0.15);
        head.add(eye);

        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.19, 0.27, 32), sunny);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = 0.02;
        eye.add(markMesh(barrel));
        const barrelBand = new THREE.Mesh(new THREE.TorusGeometry(0.166, 0.027, 10, 32), paleGold);
        barrelBand.position.z = 0.145;
        eye.add(markMesh(barrelBand));

        const lens = new THREE.Group();
        lens.position.z = 0.157;
        eye.add(lens);
        const lensGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.134, 0.022, 32), glass);
        lensGlass.rotation.x = Math.PI / 2;
        lensGlass.position.z = 0.01;
        lens.add(markMesh(lensGlass));
        makeSphere(lens, softSphere, irisMaterial, [0, 0, 0.027], [0.083, 0.092, 0.015]).castShadow = false;
        const pupil = makeSphere(lens, softSphere, pupilMaterial, [0, 0, 0.047], [0.047, 0.061, 0.017]);
        pupil.castShadow = false;
        makeSphere(lens, softSphere, glint, [-0.028, 0.034, 0.069], [0.018, 0.018, 0.009]).castShadow = false;
        makeSphere(lens, softSphere, glint, [0.03, -0.028, 0.068], [0.009, 0.009, 0.007]).castShadow = false;
        lensAssemblies.push(lens);
        pupils.push(pupil);
      }

      // Long articulated arms end in gentle three-pronged grippers.
      const arms: import("three").Group[] = [];
      for (const side of [-1, 1]) {
        const arm = new THREE.Group();
        arm.position.set(side * 0.67, 1.72, 0.02);
        robot.add(arm);
        makeSphere(arm, softSphere, copper, [0, 0, 0], [0.17, 0.17, 0.16]);
        makeSphere(arm, softSphere, paleGold, [0, 0, 0.11], [0.09, 0.09, 0.06]);

        const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.34, 7, 18), metal);
        upperArm.position.set(side * 0.2, -0.19, 0.02);
        upperArm.rotation.z = -side * 0.62;
        arm.add(markMesh(upperArm));
        makeSphere(arm, softSphere, copper, [side * 0.36, -0.37, 0.02], [0.105, 0.105, 0.1]);

        const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.2, 6, 16), ochre);
        forearm.position.set(side * 0.4, -0.53, 0.035);
        forearm.rotation.z = -side * 0.18;
        arm.add(markMesh(forearm));

        const claw = new THREE.Group();
        claw.position.set(side * 0.42, -0.66, 0.08);
        arm.add(claw);
        makeSphere(claw, softSphere, darkMetal, [0, 0, 0], [0.12, 0.095, 0.09]);
        makeTube(claw, [[-0.025, 0, 0.04], [-0.11, -0.08, 0.08], [-0.14, -0.17, 0.08]], 0.035, metal);
        makeTube(claw, [[0.025, 0, 0.04], [0.11, -0.08, 0.08], [0.14, -0.17, 0.08]], 0.035, metal);
        makeTube(claw, [[0, 0.015, 0.04], [0, -0.075, 0.09], [0, -0.15, 0.09]], 0.03, paleGold);
        arms.push(arm);
      }

      // Soft floor shadow and a thin orbit keep the rover visually grounded.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1, 48),
        new THREE.MeshBasicMaterial({ color: 0x4c342c, transparent: true, opacity: 0.12, depthWrite: false })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.scale.set(1.45, 0.58, 1);
      shadow.position.y = 0.035;
      scene.add(shadow);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.13, 0.012, 8, 96),
        new THREE.MeshBasicMaterial({ color: 0xd6a637, transparent: true, opacity: 0.48 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.055;
      scene.add(ring);

      let gazeX = 0;
      let gazeY = 0;
      let targetGazeX = 0;
      let targetGazeY = 0;
      let pointerActive = false;
      let keyboardGazeUntil = 0;
      let nextLook = performance.now() + 900 + Math.random() * 1300;
      let nextBlink = performance.now() + 1900 + Math.random() * 2100;
      let blinkStarted = 0;
      let waveArm = -1;
      let waveStarted = 0;
      let nextWave = performance.now() + 3200 + Math.random() * 2500;

      const onPointerMove = (event: PointerEvent) => {
        const bounds = host.getBoundingClientRect();
        pointerActive = true;
        targetGazeX = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 1.8, -1, 1);
        targetGazeY = THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * -1.2, -0.75, 0.75);
      };
      const onPointerLeave = () => {
        pointerActive = false;
        targetGazeX = 0;
        targetGazeY = 0;
      };
      const onKeyDown = (event: KeyboardEvent) => {
        const step = 0.18;
        if (event.key === "ArrowLeft") targetGazeX = THREE.MathUtils.clamp(targetGazeX - step, -1, 1);
        else if (event.key === "ArrowRight") targetGazeX = THREE.MathUtils.clamp(targetGazeX + step, -1, 1);
        else if (event.key === "ArrowUp") targetGazeY = THREE.MathUtils.clamp(targetGazeY + step, -0.75, 0.75);
        else if (event.key === "ArrowDown") targetGazeY = THREE.MathUtils.clamp(targetGazeY - step, -0.75, 0.75);
        else return;
        pointerActive = false;
        keyboardGazeUntil = performance.now() + 2400;
        event.preventDefault();
      };

      const render = (time = performance.now()) => {
        if (disposed || !visible) return;

        if (!pointerActive && time >= keyboardGazeUntil && time >= nextLook) {
          targetGazeX = (Math.random() - 0.5) * 1.1;
          targetGazeY = (Math.random() - 0.5) * 0.62;
          nextLook = time + 2100 + Math.random() * 3300;
        }

        gazeX += (targetGazeX - gazeX) * 0.065;
        gazeY += (targetGazeY - gazeY) * 0.065;
        head.rotation.y = gazeX * 0.2;
        head.rotation.x = gazeY * 0.12;
        pupils.forEach((pupil, index) => {
          pupil.position.x = gazeX * 0.045 + (index === 0 ? 0.008 : -0.008);
          pupil.position.y = gazeY * 0.035;
        });

        robot.position.y = 0.035 + Math.sin(time * 0.0016) * 0.04;
        robot.rotation.z = Math.sin(time * 0.0008) * 0.018;
        neck.rotation.z = Math.sin(time * 0.0011) * 0.018 + gazeX * -0.045;
        tracks.forEach((track, index) => {
          track.rotation.z = Math.sin(time * 0.0017 + index * Math.PI) * 0.008;
        });

        if (!blinkStarted && time >= nextBlink) blinkStarted = time;
        if (blinkStarted) {
          const blinkProgress = (time - blinkStarted) / 145;
          const blinkAmount = Math.sin(Math.min(1, blinkProgress) * Math.PI);
          lensAssemblies.forEach((lens) => { lens.scale.y = 1 - blinkAmount * 0.9; });
          if (blinkProgress >= 1) {
            lensAssemblies.forEach((lens) => { lens.scale.y = 1; });
            blinkStarted = 0;
            nextBlink = time + 2500 + Math.random() * 3300;
          }
        }

        if (time >= nextWave && waveArm < 0) {
          waveArm = Math.random() > 0.5 ? 0 : 1;
          waveStarted = time;
          nextWave = time + 4300 + Math.random() * 3500;
        }
        if (waveArm >= 0) {
          const progress = (time - waveStarted) / 950;
          const side = waveArm === 0 ? -1 : 1;
          arms[waveArm].rotation.z = -side * Math.sin(Math.min(1, progress) * Math.PI) * 0.55;
          if (progress >= 1) {
            arms[waveArm].rotation.z = 0;
            waveArm = -1;
          }
        }

        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };

      const resize = new ResizeObserver(() => {
        if (!host.clientWidth || !host.clientHeight) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      });
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = window.requestAnimationFrame(render);
        if (!visible && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      });

      resize.observe(host);
      observer.observe(host);
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      host.addEventListener("keydown", onKeyDown);
      frame = window.requestAnimationFrame(render);

      cleanup = () => {
        disposed = true;
        window.cancelAnimationFrame(frame);
        resize.disconnect();
        observer.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        host.removeEventListener("keydown", onKeyDown);
        fallbackArtwork?.removeAttribute("hidden");
        renderer.dispose();
        renderer.domElement.remove();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="robotSceneCanvas" role="img" tabIndex={0} aria-label="A friendly little rover with expressive binocular eyes. Move your pointer or use the arrow keys to make it look around." />;
}
