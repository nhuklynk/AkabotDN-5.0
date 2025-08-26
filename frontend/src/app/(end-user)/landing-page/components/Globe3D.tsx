"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import { TextureLoader } from "three";
import { useRef, useState, useEffect } from "react";
import React from "react";
import * as THREE from "three";

// City coordinates (latitude, longitude)
const cities = [
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { name: "Seoul", lat: 37.5665, lng: 126.978, label: "Seoul" },
  { name: "Hanoi", lat: 21.0285, lng: 105.8542, label: "Hanoi" },
  { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, label: "TP.HCM" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, label: "Singapore" },
];

// Floating labels around the globe
const floatingLabels = [
  {
    text: "Kết nối toàn cầu",
    position: [-4, 2, 0],
    color: "from-blue-500 to-cyan-500",
  },
  {
    text: "Đồng bộ dữ liệu",
    position: [4, 1, 0],
    color: "from-green-500 to-emerald-500",
  },
  {
    text: "An toàn dữ liệu",
    position: [-3, -2, 0],
    color: "from-purple-500 to-violet-500",
  },
  {
    text: "Trí tuệ nhân tạo",
    position: [3, -1.5, 0],
    color: "from-orange-500 to-red-500",
  },
];

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function CityMarker({ city }: { city: (typeof cities)[0] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const position = latLngToVector3(city.lat, city.lng, 2.05);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial
          color={hovered ? "#fbbf24" : "#f59e0b"}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} />
      </mesh>

      {/* City label */}
      <Html distanceFactor={8} position={[0, 0.2, 0]}>
        <div
          className={`
          px-2 py-1 bg-black/80 text-white text-xs rounded-md
          transition-all duration-300 pointer-events-none
          ${hovered ? "opacity-100 scale-110" : "opacity-70 scale-100"}
        `}
        >
          {city.label}
        </div>
      </Html>
    </group>
  );
}

// Earth component with texture - separate for better error handling
function EarthWithTexture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const earthTexture = useLoader(TextureLoader, "/images/earth-texture.jpg");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.6}
        metalness={0.1}
      />
    </Sphere>
  );
}

// Fallback Earth component
function EarthFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial color="#1e40af" roughness={0.4} metalness={0.2} />
    </Sphere>
  );
}

function RotatingGlobe() {
  const [useTexture, setUseTexture] = useState(true);

  return (
    <group>
      {/* Main globe with error boundary */}
      {useTexture ? (
        <React.Suspense fallback={<EarthFallback />}>
          <EarthWithTexture />
        </React.Suspense>
      ) : (
        <EarthFallback />
      )}

      {/* City markers */}
      {cities.map((city, index) => (
        <CityMarker key={index} city={city} />
      ))}
    </group>
  );
}

function FloatingLabel({
  label,
  index,
}: {
  label: (typeof floatingLabels)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html
      position={label.position as [number, number, number]}
      distanceFactor={6}
    >
      <div
        className={`
          relative px-4 py-3 rounded-xl backdrop-blur-sm border border-white/20
          bg-gradient-to-r ${label.color} bg-opacity-10
          text-white font-medium text-sm shadow-2xl
          transition-all duration-500 cursor-pointer
          ${hovered ? "scale-110 shadow-3xl" : "scale-100"}
          hover:bg-opacity-20
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
        }}
      >
        <div className="relative z-10">{label.text}</div>

        {/* Connecting line to globe */}
        <div
          className="absolute top-1/2 left-1/2 w-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            height: "60px",
            transform: "translate(-50%, -50%) rotate(45deg)",
            transformOrigin: "center",
          }}
        />
      </div>
    </Html>
  );
}

interface Globe3DProps {
  mode?: "fullscreen" | "embedded";
  showBackground?: boolean;
  className?: string;
}

export function Globe3D({
  mode = "embedded",
  showBackground = true,
  className = "",
}: Globe3DProps = {}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerClasses =
    mode === "fullscreen"
      ? "w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      : `w-full h-full relative ${className}`;

  // Show loading state on server/before client hydration
  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Background stars - only show if enabled and in fullscreen mode */}
      {showBackground && mode === "fullscreen" && (
        <div className="absolute inset-0 opacity-30">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Canvas
        camera={{
          position: mode === "fullscreen" ? [0, 0, 8] : [0, 0, 6],
          fov: mode === "fullscreen" ? 45 : 50,
        }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />

        {/* Globe and markers */}
        <RotatingGlobe />

        {/* Floating labels */}
        {/* {floatingLabels.map((label, index) => (
          <FloatingLabel key={index} label={label} index={index} />
        ))} */}

        {/* Controls */}
        <OrbitControls
          enableZoom={mode === "fullscreen"}
          enablePan={false}
          minDistance={mode === "fullscreen" ? 5 : 4}
          maxDistance={mode === "fullscreen" ? 15 : 10}
          autoRotate={false}
          enableRotate={true}
        />
      </Canvas>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
}
