'use client';
import { Component, type ReactNode, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import type { OrbitControls as Controls } from 'three-stdlib';
import { HardwareModel } from './Models';
import type { Device } from './lessons';

class SceneBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() { return this.state.failed ? <div className="hardware-fallback" role="status">The 3D viewer could not start. Enable hardware acceleration and reload. You can still explore every part using the list beside the viewer.</div> : this.props.children; }
}
export default function HardwareScene({device, selected, onSelect, open, motion, labels}: {device: Device; selected: string; onSelect: (id: string)=>void; open: boolean; motion: boolean; labels: boolean}) {
  const controls = useRef<Controls>(null);
  const reset = () => { controls.current?.reset(); };
  return <div className="hardware-scene">
    <SceneBoundary><Canvas dpr={[1,1.75]} camera={{position: device==='tower'?[6,3,9]:[4.5,6,5],fov:40}} gl={{antialias:true}} fallback={<div className="hardware-fallback">3D is unavailable on this device. Use the parts list to continue learning.</div>}>
      <color attach="background" args={['#edf0f2']}/><ambientLight intensity={0.65}/><directionalLight position={[4,8,5]} intensity={2.2}/><directionalLight position={[-5,2,-3]} intensity={1}/>
      <Environment resolution={128}><Lightformer position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[8,8,1]} intensity={2}/><Lightformer position={[-5,2,1]} rotation={[0,Math.PI/2,0]} scale={[4,7,1]} intensity={2}/></Environment>
      <HardwareModel device={device} selected={selected} onSelect={onSelect} open={open} motion={motion} labels={labels}/>
      <OrbitControls ref={controls} makeDefault enableDamping minDistance={3} maxDistance={16} enablePan={false}/>
    </Canvas></SceneBoundary>
    <button className="hardware-reset" onClick={reset}>Reset view</button>
    <div className="hardware-scene-caption">{open?'INTERNAL VIEW':'ENCLOSED VIEW'} <span>Drag to rotate · Pinch or scroll to zoom</span></div>
  </div>;
}
