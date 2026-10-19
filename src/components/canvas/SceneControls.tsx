"use client";

import React, { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface SceneControlsProps {
  autoRotate?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  target?: [number, number, number];
  onControlsReady?: (controls: OrbitControlsImpl) => void;
}

export function SceneControls({
  autoRotate = false,
  enableZoom = true,
  enableRotate = true,
  enablePan = true,
  target = [0, 0, 0],
  onControlsReady,
}: SceneControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current && onControlsReady) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      enablePan={enablePan}
      enableDamping
      dampingFactor={0.06}
      minDistance={3.5}
      maxDistance={22}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under ground plane
      minPolarAngle={0.1}
    />
  );
}
