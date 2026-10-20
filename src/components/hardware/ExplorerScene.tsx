"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { HDD, SSD } from "./Models";
import { PhotographicBoard } from "./PhotographicBoard";
import { TowerModel } from "./TowerModel";
import { getParts, type HardwareDevice, type TowerView, type ExplorerPart } from "./explorer-data";
import { ModelAnnotation } from "./ModelAnnotation";

type Props = {
  device: HardwareDevice; view: TowerView; selected: string | null; focusVersion: number;
  onSelect: (id: string) => void; open: boolean; motion: boolean; labels: boolean; reducedMotion: boolean;
};

class SceneBoundary extends Component<{ children: ReactNode; device: HardwareDevice }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="scene-fallback"><p>The 3D view could not load.</p><span>You can still explore every component using the parts list.</span><button onClick={() => this.setState({ failed: false })}>Try again</button></div>;
  }
}

function cameraPose(device: HardwareDevice, view: TowerView) {
  if (device === "motherboard") return new Vector3(3.7, 8.7, 7.4);
  if (device === "tower") {
    if (view === "rear") return new Vector3(-4.5, 2.6, -9.4);
    if (view === "inside") return new Vector3(9.2, 3.7, 4.8);
    return new Vector3(5.8, 3.5, 9.2);
  }
  return new Vector3(4.7, 6.6, 5.8);
}

function CameraRig({ device, view, selected, focusVersion, reducedMotion, parts }: Pick<Props, "device" | "view" | "selected" | "focusVersion" | "reducedMotion"> & { parts: ExplorerPart[] }) {
  const controls = useRef<OrbitControlsType>(null);
  const camera = useThree(state => state.camera);
  const movement = useRef<{ position: Vector3; target: Vector3 } | null>(null);
  const { width } = useThree(state => state.size);
  useEffect(() => {
    const part = parts.find(part => part.id === selected);
    const base = cameraPose(device, view);
    // Keep the full object in frame on narrow viewports.
    if (width < 620) base.multiplyScalar(1.2);
    const target = part ? new Vector3(...part.position).multiplyScalar(0.62) : new Vector3();
    const direction = base.clone().normalize();
    const position = part ? target.clone().addScaledVector(direction, base.length() * 0.78) : base;
    if (device === "hdd" && selected === "controller") position.set(4, -5, 6);
    movement.current = { position, target };
  }, [device, view, selected, focusVersion, reducedMotion, parts, width]);
  useFrame((_, dt) => {
    if (!movement.current || !controls.current) return;
    const { position, target } = movement.current;
    const blend = reducedMotion ? 1 : 1 - Math.exp(-5 * Math.min(dt, 0.05));
    camera.position.lerp(position, blend);
    controls.current.target.lerp(target, blend);
    controls.current.update();
    if (camera.position.distanceTo(position) < 0.005 && controls.current.target.distanceTo(target) < 0.005) movement.current = null;
  });
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.08} enablePan={false} minDistance={4} maxDistance={23} onStart={() => { movement.current = null; }} />;
}

function Content(props: Props) {
  const { device, view, selected, onSelect, motion, open, reducedMotion, labels } = props;
  const parts = useMemo(() => getParts(device, view), [device, view]);
  return <>
    <ambientLight intensity={0.8} />
    <directionalLight position={[5,9,6]} intensity={2.6} />
    <directionalLight position={[-5,4,-5]} intensity={1.3} />
    <Environment resolution={128}>
      <Lightformer position={[0,7,0]} rotation={[Math.PI/2,0,0]} scale={[8,8,1]} intensity={3} />
      <Lightformer position={[-5,2,4]} rotation={[0,Math.PI/2,0]} scale={[5,8,1]} intensity={2} />
    </Environment>
    {device === "motherboard" ? <PhotographicBoard selected={selected} onSelect={onSelect} reducedMotion={reducedMotion} />
      : device === "tower" ? <TowerModel view={view} selected={selected} motion={motion && !reducedMotion} reducedMotion={reducedMotion} />
      : device === "hdd" ? <HDD open={open} motion={motion && !reducedMotion} /> : <SSD open={open} />}
    {labels && (device === "motherboard" || device === "tower" || open) && parts.map((part, index) => (
      <ModelAnnotation key={`${view}-${part.id}`} position={part.position} number={index + 1} title={part.name} selected={selected === part.id} onSelect={() => onSelect(part.id)} offset={part.offset} />
    ))}
    <ContactShadows position={[0,device === "tower" ? -2.8 : -0.65,0]} opacity={0.25} scale={16} blur={2.6} far={10} resolution={256} color="#354238" />
    <CameraRig {...props} parts={parts} />
  </>;
}

export default function ExplorerScene(props: Props) {
  const pose = cameraPose(props.device, props.view);
  return <SceneBoundary device={props.device}>
    <Canvas dpr={[1,1.75]} camera={{ position: pose.toArray(), fov: 39 }} gl={{ antialias: true, alpha: true }} fallback={<div className="scene-fallback">3D is unavailable. Choose a component from the parts list to keep exploring.</div>}>
      <Suspense fallback={null}><Content {...props} /></Suspense>
    </Canvas>
  </SceneBoundary>;
}
