"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export interface HardDiskModelProps {
  selectedComponent: string | null;
  onComponentSelect: (componentId: string) => void;
  position?: [number, number, number];
}

export function HardDiskModel({ selectedComponent, onComponentSelect, position = [6, 1.5, 0] }: HardDiskModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.y = position[1];
      groupRef.current.position.z = position[2];
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hard Disk Drive enclosure */}
      <mesh
        position={[0, 0, 0]}
        onClick={() => onComponentSelect("hardDisk")}
      >
        <boxGeometry args={[3.5, 1, 5.25]} />
        <meshStandardMaterial
          color={selectedComponent === "hardDisk" ? "#3b82f6" : "#6b7280"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Top cover */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.5, 0.05, 5.25]} />
        <meshStandardMaterial
          color={selectedComponent === "hardDisk" ? "#3b82f6" : "#9ca3af"}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Component label */}
      {selectedComponent === "hardDisk" && (
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              background: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              color: "#1f2937",
            }}
          >
            Hard Disk Drive
          </div>
        </Html>
      )}

      {/* Component details tooltip */}
      {selectedComponent === "hardDisk" && (
        <Html position={[-3, 0, 0]} style={{ width: 220 }}>
          <div
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: "14px",
              color: "#374151",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "8px", color: "#1f2937" }}>Hard Disk Drive (HDD)</div>
            <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
              <div style={{ marginBottom: "4px" }}>• Non-volatile magnetic storage device</div>
              <div style={{ marginBottom: "4px" }}>• Uses spinning platters to store data</div>
              <div style={{ marginBottom: "4px" }}>• SATA connector for data transfer</div>
              <div style={{ marginBottom: "4px" }}>• Capacity: 500GB - 8TB typical</div>
              <div>• Speed: 5400 or 7200 RPM</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default HardDiskModel;