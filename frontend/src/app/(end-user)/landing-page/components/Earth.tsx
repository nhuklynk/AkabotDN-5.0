"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create Earth-like texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Create gradient for ocean (blue)
    const oceanGradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    oceanGradient.addColorStop(0, "#001f3f");
    oceanGradient.addColorStop(0.5, "#0074D9");
    oceanGradient.addColorStop(1, "#7FDBFF");

    // Fill with ocean color
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add continents (simplified shapes)
    ctx.fillStyle = "#2ECC40"; // Green for land

    // Africa/Europe (simplified)
    ctx.beginPath();
    ctx.ellipse(550, 200, 80, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asia (simplified)
    ctx.beginPath();
    ctx.ellipse(750, 180, 120, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // North America (simplified)
    ctx.beginPath();
    ctx.ellipse(250, 150, 90, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // South America (simplified)
    ctx.beginPath();
    ctx.ellipse(300, 350, 60, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australia (simplified)
    ctx.beginPath();
    ctx.ellipse(800, 400, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add some brown/desert areas
    ctx.fillStyle = "#FFDC00";
    ctx.beginPath();
    ctx.ellipse(600, 250, 30, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add white polar caps
    ctx.fillStyle = "#FFFFFF";
    // North pole
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 50, 200, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    // South pole
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2,
      canvas.height - 50,
      180,
      25,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create atmosphere glow effect
  const atmosphereTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(256, 256, 200, 256, 256, 256);
    gradient.addColorStop(0, "rgba(135, 206, 250, 0.8)");
    gradient.addColorStop(0.7, "rgba(135, 206, 250, 0.2)");
    gradient.addColorStop(1, "rgba(135, 206, 250, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Rotate the Earth
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
          transparent={true}
        />
      </mesh>

      {/* Atmosphere effect */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial
          map={atmosphereTexture}
          transparent={true}
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh scale={1.02}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.1}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
