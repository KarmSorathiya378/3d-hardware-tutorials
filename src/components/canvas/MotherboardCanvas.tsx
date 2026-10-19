"use client";

import React, { useState, useRef, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { MotherboardModel } from "./MotherboardModel";
import { SceneControls } from "./SceneControls";
import { MOTHERBOARD_COMPONENTS } from "./motherboard-data";
import {
  MotherboardCanvasProps,
  MotherboardComponentData,
  CanvasSettings,
} from "./types";

const DEFAULT_SETTINGS: CanvasSettings = {
  autoRotate: false,
  enableZoom: true,
  enableRotate: true,
  enablePan: true,
  showGrid: true,
  showAxes: false,
  wireframe: false,
};

export function MotherboardCanvas({
  selectedId: controlledSelectedId,
  onSelectComponent,
  className = "",
  initialSettings,
  height = "520px",
}: MotherboardCanvasProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CanvasSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const selectedId =
    controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const handleSelect = useCallback(
    (component: MotherboardComponentData | null) => {
      setInternalSelectedId(component ? component.id : null);
      if (onSelectComponent) {
        onSelectComponent(component);
      }

      // Smoothly reposition target towards selected component if selected
      if (component && controlsRef.current) {
        const [x, y, z] = component.position;
        controlsRef.current.target.set(x * 0.6, y, z * 0.6);
        controlsRef.current.update();
      }
    },
    [onSelectComponent]
  );

  const handleControlsReady = useCallback((controls: OrbitControlsImpl) => {
    controlsRef.current = controls;
  }, []);

  // Camera preset actions
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 10, 11);
      controlsRef.current.update();
    }
  };

  const setViewTopDown = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 14, 0.01);
      controlsRef.current.update();
    }
  };

  const setViewIsometric = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(9, 9, 9);
      controlsRef.current.update();
    }
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.85);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.15);
      controlsRef.current.update();
    }
  };

  const selectedComponent = MOTHERBOARD_COMPONENTS.find((c) => c.id === selectedId);

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden shadow-sm flex flex-col ${className}`}
      style={{ height }}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Component Selector Dropdown */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-sm border border-slate-200 backdrop-blur-md">
          <label htmlFor="comp-select" className="text-xs font-medium text-slate-500">
            Component:
          </label>
          <select
            id="comp-select"
            value={selectedId || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                handleSelect(null);
              } else {
                const comp = MOTHERBOARD_COMPONENTS.find((c) => c.id === val);
                handleSelect(comp || null);
              }
            }}
            className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer pr-1"
          >
            <option value="">Overview (Select a component)</option>
            {MOTHERBOARD_COMPONENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Angle Presets & Navigation */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-white/95 p-1 shadow-sm border border-slate-200 backdrop-blur-md">
          <button
            type="button"
            onClick={resetCamera}
            title="Reset Camera View"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset
          </button>
          <div className="h-3 w-[1px] bg-slate-200" />
          <button
            type="button"
            onClick={setViewTopDown}
            title="Top-Down Plan View"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Top
          </button>
          <button
            type="button"
            onClick={setViewIsometric}
            title="Isometric 3D Angle"
            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Isometric
          </button>
          <div className="h-3 w-[1px] bg-slate-200" />
          <button
            type="button"
            onClick={() =>
              setSettings((s) => ({ ...s, autoRotate: !s.autoRotate }))
            }
            title="Toggle Auto Rotation"
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              settings.autoRotate
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Rotate
          </button>
          <button
            type="button"
            onClick={() =>
              setSettings((s) => ({ ...s, wireframe: !s.wireframe }))
            }
            title="Toggle Wireframe Mode"
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              settings.wireframe
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Wireframe
          </button>
        </div>
      </div>

      {/* Floating Zoom & Pan Controls (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom In"
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-100 font-bold text-sm backdrop-blur-md"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom Out"
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-100 font-bold text-sm backdrop-blur-md"
        >
          -
        </button>
      </div>

      {/* Selected Component Quick Banner (Bottom-Left) */}
      {selectedComponent && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-auto max-w-sm rounded-xl bg-white/95 p-3.5 shadow-md border border-slate-200 backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
              {selectedComponent.category}
            </span>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          </div>
          <h4 className="mt-1 text-xs font-bold text-slate-900">
            {selectedComponent.name}
          </h4>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
            {selectedComponent.shortDescription}
          </p>
        </div>
      )}

      {/* WebGL 3D Canvas */}
      <div className="relative h-full w-full flex-1">
        <Canvas
          shadows
          camera={{ position: [0, 10, 11], fov: 42, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting Setup */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[8, 14, 8]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={30}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          <directionalLight position={[-8, 8, -6]} intensity={0.5} />
          <hemisphereLight
            args={["#ffffff", "#cbd5e1", 0.5]}
            position={[0, 15, 0]}
          />

          {/* Interactive Motherboard 3D Model */}
          <Suspense fallback={null}>
            <MotherboardModel
              selectedId={selectedId}
              onSelectComponent={handleSelect}
              wireframe={settings.wireframe}
            />
          </Suspense>

          {/* Ground Plane Grid and Contact Shadow */}
          {settings.showGrid && (
            <Grid
              renderOrder={-1}
              position={[0, -0.1, 0]}
              infiniteGrid
              cellSize={0.8}
              cellThickness={0.6}
              cellColor="#e2e8f0"
              sectionSize={4}
              sectionThickness={1.2}
              sectionColor="#cbd5e1"
              fadeDistance={30}
              fadeStrength={1.5}
            />
          )}

          <ContactShadows
            position={[0, -0.09, 0]}
            opacity={0.45}
            scale={14}
            blur={1.8}
            far={4}
          />

          {/* Orbit, Zoom, and Rotation Controls */}
          <SceneControls
            autoRotate={settings.autoRotate}
            enableZoom={settings.enableZoom}
            enableRotate={settings.enableRotate}
            enablePan={settings.enablePan}
            onControlsReady={handleControlsReady}
          />
        </Canvas>
      </div>

      {/* Helper Footer Hint */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-white/80 px-3 py-1.5 text-[11px] text-slate-500 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span>
            <strong className="text-slate-700">Left Click + Drag:</strong> Rotate
          </span>
          <span>
            <strong className="text-slate-700">Scroll:</strong> Zoom
          </span>
          <span>
            <strong className="text-slate-700">Click Component:</strong> Select &amp; Inspect
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px]">WebGL 2.0 / R3F</span>
        </div>
      </div>
    </div>
  );
}
export default MotherboardCanvas;
