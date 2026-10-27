"use client";

import { useEffect, useRef } from "react";

export default function InteractiveRobotScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const staticOnly = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 640px)").matches;
    if (staticOnly) return;

    let renderer: import("three").WebGLRenderer;
    let frame = 0;
    let visible = true;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    void import("three").then((THREE) => {
      if (!host || disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(5.3, 4.2, 7.4);
      camera.lookAt(0, 0.7, 0);

      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      const fallbackArtwork = host.parentElement?.querySelector(".robotFallback");
      fallbackArtwork?.setAttribute("hidden", "");

      scene.add(new THREE.HemisphereLight(0xfff7e8, 0x4b2026, 2.1));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      keyLight.position.set(4, 8, 5);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0xf3b62c, 18, 14);
      rimLight.position.set(-4, 3, -3);
      scene.add(rimLight);

      const robot = new THREE.Group();
      scene.add(robot);
      const shell = new THREE.MeshStandardMaterial({ color: 0x782536, roughness: 0.3, metalness: 0.28 });
      const shellLight = new THREE.MeshStandardMaterial({ color: 0xa94b43, roughness: 0.34, metalness: 0.2 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xf3b62c, roughness: 0.26, metalness: 0.55 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: 0.56, metalness: 0.24 });
      const glass = new THREE.MeshStandardMaterial({ color: 0x292b30, emissive: 0xffd264, emissiveIntensity: 1.4, roughness: 0.22 });
      const box = (w: number, h: number, d: number, material: import("three").Material, x: number, y: number, z: number) => {
        const part = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        part.position.set(x, y, z);
        part.castShadow = true;
        part.receiveShadow = true;
        robot.add(part);
        return part;
      };

      box(2.75, 0.48, 1.68, dark, 0, 0.45, 0);
      box(2.48, 0.5, 1.53, shell, 0, 0.79, 0);
      box(1.92, 0.2, 1.35, shellLight, -0.13, 1.09, 0);
      box(1.16, 0.66, 0.94, shell, 0.24, 1.48, -0.03);
      box(0.72, 0.35, 0.99, gold, 0.26, 1.96, -0.03);
      box(0.56, 0.19, 1.02, dark, 0.24, 2.19, -0.03);
      box(0.35, 0.28, 0.1, gold, 0.65, 1.54, 0.46);
      box(0.28, 0.25, 0.08, gold, -0.03, 1.53, 0.49);
      box(0.68, 0.12, 0.1, glass, 0.25, 1.3, 0.81);
      box(0.94, 0.12, 0.08, gold, -0.02, 0.79, 0.79);

      const wheelGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.25, 32);
      for (const x of [-0.95, 0.95]) {
        for (const z of [-0.72, 0.72]) {
          const wheel = new THREE.Mesh(wheelGeometry, dark);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.42, z);
          wheel.castShadow = true;
          robot.add(wheel);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.27, 24), gold);
          hub.rotation.z = Math.PI / 2;
          hub.position.set(x, 0.42, z);
          robot.add(hub);
        }
      }

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), gold);
      antenna.position.set(-0.55, 2.42, -0.15);
      robot.add(antenna);
      const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 20), shellLight);
      antennaTip.position.set(-0.55, 2.72, -0.15);
      robot.add(antennaTip);

      const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.08, 64),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0.02 })
      );
      platform.position.y = -0.01;
      platform.receiveShadow = true;
      scene.add(platform);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.15, 0.012, 8, 96),
        new THREE.MeshBasicMaterial({ color: 0xd6a637, transparent: true, opacity: 0.55 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.04;
      scene.add(ring);

      let targetX = -0.13;
      let targetY = -0.25;
      const render = () => {
        if (disposed || !visible) return;
        if (!reducedMotion) {
          robot.rotation.y += (targetY - robot.rotation.y) * 0.035;
          robot.rotation.x += (targetX - robot.rotation.x) * 0.035;
          robot.position.y = 0.035 * Math.sin(performance.now() * 0.0009);
        } else {
          robot.rotation.y = targetY;
          robot.rotation.x = targetX;
        }
        renderer.render(scene, camera);
        if (!reducedMotion) frame = window.requestAnimationFrame(render);
      };
      const draw = () => {
        if (reducedMotion) render();
      };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = host.getBoundingClientRect();
        targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.7 - 0.25;
        targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.2 - 0.13;
        draw();
      };
      const onPointerLeave = () => {
        targetX = -0.13;
        targetY = -0.25;
        draw();
      };
      const onKeyDown = (event: KeyboardEvent) => {
        const step = 0.12;
        if (event.key === "ArrowLeft") targetY -= step;
        else if (event.key === "ArrowRight") targetY += step;
        else if (event.key === "ArrowUp") targetX -= step;
        else if (event.key === "ArrowDown") targetX += step;
        else return;
        event.preventDefault();
      };
      const resize = new ResizeObserver(() => {
        if (!host.clientWidth || !host.clientHeight) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
        draw();
      });
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reducedMotion && !frame) render();
        if (!visible && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        draw();
      });

      resize.observe(host);
      observer.observe(host);
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      host.addEventListener("keydown", onKeyDown);
      render();

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

    let cleanup = () => {};
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="robotSceneCanvas" role="img" tabIndex={0} aria-label="Interactive 3D RoboBEE rover. Use the arrow keys to rotate the model." />;
}
