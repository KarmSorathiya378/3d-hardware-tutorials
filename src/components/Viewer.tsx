"use client";

import React, { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei";
import { MotherboardModel } from "./canvas/MotherboardModel";

export interface ViewerProps {
  /** Optional custom 3D children to render in the scene */
  children?: React.ReactNode;
  /** Container CSS classes */
  className?: string;
  /** Height of the viewer container (defaults to 100%) */
  height?: string | number;
  /** Background color for the 3D scene (defaults to white #ffffff) */
  backgroundColor?: string;
  /** Initial camera position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Enable zoom via scroll wheel or pinch */
  enableZoom?: boolean;
  /** Enable rotation via drag */
  enableRotate?: boolean;
  /** Enable panning */
  enablePan?: boolean;
  /** Auto-rotate scene */
  autoRotate?: boolean;
  /** Show subtle floor grid */
  showGrid?: boolean;
  /** Show floor contact shadows */
  showShadows?: boolean;
  /** Show subtle overlay instructions */
  showInstructions?: boolean;
}

/**
 * Loading fallback displayed while WebGL and 3D assets initialize.
 */
function ViewerLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-3" />
      <span className="text-xs font-medium text-slate-500">
        Loading 3D Hardware Canvas...
      </span>
    </div>
  );
}

/**
 * Basic 3D Viewer component for hardware tutorial visualization.
 * Features a clean white-themed canvas with OrbitControls for rotation and zoom.
 */
const emptySubscribe = () => () => {};

export function Viewer({
  children,
  className = "",
  height = "500px",
  backgroundColor = "#ffffff",
  cameraPosition = [7, 6, 7],
  enableZoom = true,
  enableRotate = true,
  enablePan = true,
  autoRotate = false,
  showGrid = true,
  showShadows = true,
  showInstructions = true,
}: ViewerProps) {
  // Ensure component only renders on client to avoid Next.js SSR WebGL issues
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
        style={{ height }}
      >
        <ViewerLoader />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
      style={{ height }}
    >
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 45 }}
        className="h-full w-full touch-none"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        {/* White-themed scene background */}
        <color attach="background" args={[backgroundColor]} />

        {/* Clean studio lighting for hardware viewing */}
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-10, 10, -10]} intensity={0.4} />
        <hemisphereLight args={["#ffffff", "#e2e8f0", 0.6]} />

        {/* OrbitControls for smooth rotation and zoom */}
        <OrbitControls
          makeDefault
          enableRotate={enableRotate}
          enableZoom={enableZoom}
          enablePan={enablePan}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          minDistance={2}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2 + 0.05}
          dampingFactor={0.05}
          enableDamping
        />

        {/* 3D Scene Content */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {children ?? <MotherboardModel />}
          </group>

          {/* Contact shadows on white floor */}
          {showShadows && (
            <ContactShadows
              position={[0, -0.02, 0]}
              opacity={0.35}
              scale={16}
              blur={1.8}
              far={4}
            />
          )}

          {/* Clean architectural grid */}
          {showGrid && (
            <Grid
              position={[0, -0.03, 0]}
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#e2e8f0"
              sectionSize={2.5}
              sectionThickness={1}
              sectionColor="#cbd5e1"
              fadeDistance={22}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Floating viewer helper instructions badge */}
      {showInstructions && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur-sm border border-slate-200">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Left-click: Rotate &bull; Scroll: Zoom &bull; Right-click: Pan</span>
        </div>
      )}
    </div>
  );
}

export default Viewer;
