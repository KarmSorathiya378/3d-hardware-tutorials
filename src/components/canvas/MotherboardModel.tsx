"use client";

import React, { useState, useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { ModelAnnotation } from "../hardware/ModelAnnotation";
import { MOTHERBOARD_COMPONENTS } from "./motherboard-data";
import { MotherboardComponentData } from "./types";

interface MotherboardModelProps {
  selectedId?: string | null;
  onSelectComponent?: (component: MotherboardComponentData | null) => void;
  wireframe?: boolean;
}

export function MotherboardModel({
  selectedId,
  onSelectComponent,
  wireframe = false,
}: MotherboardModelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = hoveredId ? "pointer" : "default";
      return () => {
        document.body.style.cursor = "default";
      };
    }
  }, [hoveredId]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>, id: string) => {
    e.stopPropagation();
    setHoveredId(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredId(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>, comp: MotherboardComponentData) => {
    e.stopPropagation();
    if (onSelectComponent) {
      if (selectedId === comp.id) {
        onSelectComponent(null);
      } else {
        onSelectComponent(comp);
      }
    }
  };

  const handlePcbClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onSelectComponent) {
      onSelectComponent(null);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main ATX Motherboard PCB Base */}
      <mesh
        position={[0, 0, 0]}
        receiveShadow
        castShadow
        onClick={handlePcbClick}
      >
        <boxGeometry args={[10, 0.16, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* PCB Corner Screw Holes / Mounting Pads */}
      {[
        [-4.6, 0.09, 3.6],
        [4.6, 0.09, 3.6],
        [-4.6, 0.09, -3.6],
        [4.6, 0.09, -3.6],
        [0, 0.09, 3.6],
        [0, 0.09, -3.6],
      ].map((pos, idx) => (
        <group key={`screw-${idx}`} position={pos as [number, number, number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.28, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* PCB Decorative Copper / Gold Traces */}
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.4, 7.4]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.8}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Interactive Motherboard Components */}
      {MOTHERBOARD_COMPONENTS.map((comp, index) => {
        const isSelected = selectedId === comp.id;
        const isHovered = hoveredId === comp.id;
        const activeColor = isSelected
          ? comp.highlightColor || "#3b82f6"
          : isHovered
          ? "#60a5fa"
          : comp.color;

        return (
          <group
            key={comp.id}
            position={comp.position}
            onClick={(e) => handleClick(e, comp)}
            onPointerOver={(e) => handlePointerOver(e, comp.id)}
            onPointerOut={handlePointerOut}
          >
            <ModelAnnotation position={[0, comp.size[1] / 2 + 0.3, 0]} number={index + 1} title={comp.name} selected={isSelected} onSelect={() => onSelectComponent?.(comp)}/>
            {/* Component Main Mesh */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={comp.size} />
              <meshStandardMaterial
                color={activeColor}
                metalness={isSelected ? 0.6 : 0.4}
                roughness={isSelected ? 0.2 : 0.4}
                emissive={
                  isSelected
                    ? comp.highlightColor || "#3b82f6"
                    : isHovered
                    ? "#38bdf8"
                    : "#000000"
                }
                emissiveIntensity={isSelected ? 0.65 : isHovered ? 0.35 : 0}
                wireframe={wireframe}
              />
            </mesh>

            {/* Selection Bounding Highlight Ring / Bracket */}
            {isSelected && (
              <group position={[0, comp.size[1] / 2 + 0.04, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[comp.size[0] + 0.25, comp.size[2] + 0.25]} />
                  <meshBasicMaterial
                    color={comp.highlightColor || "#3b82f6"}
                    wireframe
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* 3D Floating Tag with Component Name */}
                <ModelAnnotation position={[0, 1.05, 0]} title={comp.name}/>
              </group>
            )}

            {/* Hover Tooltip when not selected */}
            {isHovered && !isSelected && (
              <ModelAnnotation position={[0, comp.size[1] / 2 + 0.85, 0]} title={comp.name}/>
            )}

            {/* Internal specific details for notable components */}
            {comp.id === "cpu-socket" && (
              <group position={[0, comp.size[1] / 2 + 0.01, 0]}>
                {/* Gold Pin Matrix */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[1.4, 1.4]} />
                  <meshStandardMaterial
                    color="#eab308"
                    metalness={0.9}
                    roughness={0.1}
                  />
                </mesh>
                {/* Steel Retention Lever */}
                <mesh position={[0.9, 0.05, 0]} rotation={[0, 0, Math.PI / 12]}>
                  <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            )}

            {comp.id === "ram-slots" && (
              <group position={[0, comp.size[1] / 2 + 0.01, 0]}>
                {/* 4 DDR5 Slot lines */}
                {[-0.6, -0.2, 0.2, 0.6].map((xOffset, i) => (
                  <group key={i} position={[xOffset, 0, 0]}>
                    <mesh>
                      <boxGeometry args={[0.08, 0.1, 2.4]} />
                      <meshStandardMaterial color="#020617" roughness={0.5} />
                    </mesh>
                    {/* Retention latches */}
                    <mesh position={[0, 0.06, 1.25]}>
                      <boxGeometry args={[0.12, 0.15, 0.1]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.4} />
                    </mesh>
                    <mesh position={[0, 0.06, -1.25]}>
                      <boxGeometry args={[0.12, 0.15, 0.1]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.4} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}

            {comp.id === "audio-section" && (
              <group position={[0, comp.size[1] / 2, 0]}>
                {/* 4 Gold Audio Capacitors */}
                {[
                  [-0.3, 0.15, -0.4],
                  [0.3, 0.15, -0.4],
                  [-0.3, 0.15, 0.4],
                  [0.3, 0.15, 0.4],
                ].map((capPos, idx) => (
                  <mesh key={idx} position={capPos as [number, number, number]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
                    <meshStandardMaterial
                      color="#eab308"
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
export default MotherboardModel;
