"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { HardDiskComponentData } from "./types";

export interface HardDiskProps {
  selected: boolean;
  onClick?: () => void;
  position?: [number, number, number];
  componentData?: HardDiskComponentData;
}

export function HardDisk({ selected, onClick, position = [4, 1.5, 0], componentData }: HardDiskProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.y = position[1];
      groupRef.current.position.z = position[2];
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Main HDD enclosure - 3.5 inch drive */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 1, 5.25]} />
        <meshStandardMaterial
          color={selected ? "#3b82f6" : "#4b5563"}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Top cover */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.5, 0.05, 5.25]} />
        <meshStandardMaterial
          color={selected ? "#3b82f6" : "#6b7280"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Platters (visible through top) */}
      <group position={[0, 0.55, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.02, 64]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.02, 64]} />
          <meshStandardMaterial
            color="#a0a0a0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Motor spindle */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Read/write head arm */}
      <group position={[1.2, 0.55, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.05]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[-0.2, 0, -0.3]}>
          <boxGeometry args={[0.4, 0.05, 0.6]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* SATA connector at back */}
      <mesh position={[0, -0.2, -2.65]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Label area */}
      <mesh position={[0, 0.53, 0.5]}>
        <boxGeometry args={[2.5, 0.03, 1]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* LED indicator */}
      <mesh position={[1.5, 0, -2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Component label */}
      {selected && (
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              background: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {componentData?.name || "Hard Disk Drive"}
          </div>
        </Html>
      )}
    </group>
  );
}

export default HardDisk;
