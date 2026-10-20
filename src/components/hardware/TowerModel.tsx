"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Shape } from "three";
import type { Point } from "./lessons";
import type { TowerView } from "./explorer-data";

const shell = "#c9cec6", graphite = "#252c2b", steel = "#8b938e", accent = "#d7ed9d";
function Box({ p, s, color = graphite, metal = 0.35 }: { p: Point; s: Point; color?: string; metal?: number }) {
  return <mesh position={p} castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={color} metalness={metal} roughness={0.48} /></mesh>;
}
function Round({ p, radius, depth = 0.035, color = steel }: { p: Point; radius: number; depth?: number; color?: string }) {
  return <mesh position={p} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[radius, radius, depth, 40]} /><meshStandardMaterial color={color} metalness={0.55} roughness={0.35} /></mesh>;
}
function USB({ x, y, z = 2.005, type = "a" }: { x: number; y: number; z?: number; type?: "a" | "c" | "ethernet" }) {
  const w = type === "c" ? 0.24 : type === "ethernet" ? 0.32 : 0.34;
  const h = type === "ethernet" ? 0.3 : type === "c" ? 0.11 : 0.15;
  return <group position={[x,y,z]}>
    <RoundedBox args={[w + 0.055, h + 0.055, 0.045]} radius={type === "c" ? 0.06 : 0.018} smoothness={2}><meshStandardMaterial color={steel} metalness={0.75} roughness={0.3}/></RoundedBox>
    <Box p={[0,0,0.028]} s={[w,h,0.012]} color="#101916" />
    <Box p={[0,-h * 0.1,0.039]} s={[w * 0.77,h * 0.24,0.015]} color={type === "a" ? "#336e82" : "#6e7972"} />
    {Array.from({length: type === "ethernet" ? 8 : 4},(_,i)=><Box key={i} p={[-w * 0.3 + i * w * 0.6 / (type === "ethernet" ? 7 : 3), -h * 0.28, 0.041]} s={[0.012,0.035,0.008]} color="#c9b685" />)}
  </group>;
}
function DisplayPort({ x, hdmi = false }: { x: number; hdmi?: boolean }) {
  const opening = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.17,0.075);
    shape.lineTo(0.17,0.075);
    shape.lineTo(0.17,hdmi ? 0.01 : -0.075);
    shape.lineTo(0.11,-0.075);
    shape.lineTo(hdmi ? -0.11 : -0.17,-0.075);
    shape.lineTo(-0.17,hdmi ? 0.01 : 0.015);
    shape.closePath();
    return shape;
  }, [hdmi]);
  return <group position={[x,-0.55,2.055]}>
    <Box p={[0,0,0]} s={[0.4,0.22,0.05]} color={steel}/>
    <mesh position={[0,0,0.028]}><shapeGeometry args={[opening]}/><meshBasicMaterial color="#111a14"/></mesh>
    <Box p={[0,0,0.035]} s={[0.25,0.025,0.01]} color="#a99a72"/>
  </group>;
}
function Fan({ position, motion, radius = 0.67, rotation = [0,0,0] }: { position: Point; motion: boolean; radius?: number; rotation?: Point }) {
  const rotor = useRef<Group>(null);
  const blade = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(radius * 0.15, -radius * 0.08);
    shape.bezierCurveTo(radius * 0.43, -radius * 0.26, radius * 0.77, -radius * 0.35, radius * 0.91, -radius * 0.11);
    shape.bezierCurveTo(radius * 0.92, radius * 0.08, radius * 0.78, radius * 0.24, radius * 0.59, radius * 0.22);
    shape.quadraticCurveTo(radius * 0.3, radius * 0.11, radius * 0.15, radius * 0.08);
    shape.closePath();
    return shape;
  }, [radius]);
  useFrame((_,dt) => { if (rotor.current && motion) rotor.current.rotation.z += Math.min(dt,0.04) * 2.8; });
  return <group position={position} rotation={rotation}>
    <mesh><boxGeometry args={[radius * 2.2, radius * 2.2, 0.14]} /><meshStandardMaterial color="#303b35" roughness={0.7} /></mesh>
    <Round p={[0,0,0.09]} radius={radius} color="#101814" />
    <mesh position={[0,0,0.13]}><torusGeometry args={[radius * 0.93,0.045,10,60]}/><meshStandardMaterial color="#7d8e78" metalness={0.5}/></mesh>
    <group ref={rotor} position={[0,0,0.16]}>
      {Array.from({length:7},(_,i)=><mesh key={i} rotation={[0,0,i*Math.PI*2/7]}><extrudeGeometry args={[blade,{depth:0.022,bevelEnabled:false,curveSegments:12}]}/><meshStandardMaterial color="#657360" roughness={0.42} metalness={0.25}/></mesh>)}
      <Round p={[0,0,0.02]} radius={radius * 0.24} depth={0.12} color="#a7b4a0"/>
    </group>
    {[-1,1].flatMap(x=>[-1,1].map(y=><Round key={`${x}-${y}`} p={[x*radius,y*radius,0.1]} radius={0.035} color={steel}/>))}
  </group>;
}

export function TowerModel({ view, selected, motion, reducedMotion }: { view: TowerView; selected: string | null; motion: boolean; reducedMotion: boolean }) {
  const side = useRef<Group>(null);
  useFrame((_,dt) => {
    if (side.current) side.current.position.x = reducedMotion ? (view === "inside" ? 3.5 : 0) : MathUtils.damp(side.current.position.x, view === "inside" ? 3.5 : 0, 5, dt);
  });
  const selectedColor = (id: string) => selected === id ? accent : steel;
  return <group>
    {/* Chassis: front +Z, rear -Z, removable service side +X. */}
    <Box p={[-1.25,0,0]} s={[0.09,5,3.9]} color={shell}/>
    {[-2.5,2.5].map(y=><Box key={y} p={[0,y,0]} s={[2.6,0.1,3.9]} color={shell}/>)}
    <Box p={[0,0,-1.93]} s={[2.6,5,0.1]} color={shell}/>
    <Box p={[0,0,1.93]} s={[2.6,5,0.1]} color={shell}/>
    {[-1.15,1.15].flatMap(x=>[-1.5,1.5].map(z=><Box key={`${x}-${z}`} p={[x,-2.65,z]} s={[0.35,0.22,0.55]} color={graphite}/>))}
    {/* Front I/O. Real holes and metallic connector tongues. */}
    <Round p={[-0.86,2.05,2]} radius={0.155} color={selectedColor("power-button")}/>
    <mesh position={[-0.86,2.05,2.027]}><torusGeometry args={[0.1,0.009,6,28,Math.PI*1.65]}/><meshBasicMaterial color="#344339"/></mesh>
    <Box p={[-0.86,2.1,2.04]} s={[0.014,0.1,0.008]} color="#344339"/>
    <Round p={[-0.38,2.05,2]} radius={0.07} color={selectedColor("reset-button")}/>
    <USB x={0.06} y={2.05}/><USB x={0.47} y={2.05}/><USB x={0.93} y={2.05} type="c"/>
    {[-0.08,0.36].map(x=><group key={x}><Round p={[x,1.65,2]} radius={0.082} color={selectedColor("front-audio")}/><Round p={[x,1.65,2.03]} radius={0.047} color="#13251c"/></group>)}
    <Box p={[-0.66,1.65,2.02]} s={[0.09,0.025,0.01]} color={accent}/>
    <Box p={[0,-0.32,1.991]} s={[2.15,3.4,0.025]} color="#25332b"/>
    {[0.67,-0.87].map(y=><Fan key={y} position={[0,y,2.005]} motion={motion} radius={0.65}/>)}
    {Array.from({length:26},(_,i)=><Box key={i} p={[-1.04+i*0.083,-0.32,2.23]} s={[0.032,3.42,0.055]} color={shell}/>)}
    <Box p={[0,-2.23,2]} s={[0.35,0.055,0.015]} color="#435447"/>
    {/* Rear I/O components face outward by rotating a complete local assembly. */}
    <group rotation={[0,Math.PI,0]}>
      <Box p={[-0.78,1.12,1.997]} s={[0.67,2.45,0.035]} color="#343f38"/>
      {[1.92,1.61,1.3].map(y=><USB key={y} x={-0.78} y={y} z={2.025}/>)}
      <USB x={-0.78} y={0.83} z={2.025} type="ethernet"/>
      {[-0.98,-0.78,-0.58].map((x,i)=><group key={x}><Round p={[x,0.26,2.04]} radius={0.074} color={["#82a98b","#bca7a4","#9daeb8"][i]}/><Round p={[x,0.26,2.07]} radius={0.043} color="#151b17"/></group>)}
      <Fan position={[0.45,1.25,2.02]} motion={motion} radius={0.66}/>
      {Array.from({length:8},(_,i)=><Box key={i} p={[0.45,0.69+i*0.16,2.28]} s={[1.35,0.025,0.02]} color={shell}/>)}
      {Array.from({length:6},(_,i)=><group key={i}><Box p={[-0.1,-0.42-i*0.19,2]} s={[2,0.12,0.025]} color={steel}/>{i>1&&Array.from({length:8},(_,j)=><Box key={j} p={[-0.85+j*0.21,-0.42-i*0.19,2.02]} s={[0.13,0.045,0.008]} color={graphite}/>)}</group>)}
      {[-0.7,-0.22,0.27,0.75].map((x,i)=><DisplayPort key={x} x={x} hdmi={i===3}/>)}
      <Box p={[0,-1.94,2.015]} s={[2.2,0.78,0.04]} color="#303931"/>
      <Box p={[0.48,-1.88,2.06]} s={[0.29,0.4,0.07]} color={selectedColor("psu-switch")}/>
      <Box p={[0.48,-1.88,2.1]} s={[0.2,0.3,0.03]} color="#101a14"/>
      <Box p={[0.48,-1.81,2.125]} s={[0.016,0.08,0.008]} color="#dde4d8"/>
      <Box p={[-0.43,-1.88,2.065]} s={[0.68,0.43,0.08]} color={steel}/>
      <Box p={[-0.43,-1.88,2.115]} s={[0.57,0.34,0.02]} color="#101a14"/>
      {[-0.58,-0.28].map(x=><Box key={x} p={[x,-1.94,2.14]} s={[0.035,0.1,0.025]} color={steel}/>)}
      <Box p={[-0.43,-1.79,2.14]} s={[0.035,0.1,0.025]} color={steel}/>
    </group>
    {/* Inside layout on the motherboard tray. */}
    <Box p={[-1.12,0.65,-0.25]} s={[0.1,3.35,2.7]} color="#30473a"/>
    <Box p={[-0.94,1.27,-0.45]} s={[0.2,0.95,0.95]} color={steel}/>
    {Array.from({length:14},(_,i)=><Box key={i} p={[-0.8+i*0.06,1.27,-0.45]} s={[0.026,1,1]} color={steel}/>)}
    <Fan position={[0.1,1.27,-0.45]} rotation={[0,Math.PI/2,0]} motion={motion} radius={0.44}/>
    {[0.48,0.77].map(z=><group key={z}><Box p={[-0.79,1.1,z]} s={[0.45,1.65,0.08]} color="#15251a"/><Box p={[-0.53,1.1,z]} s={[0.035,1.6,0.09]} color={accent}/>{Array.from({length:5},(_,i)=><Box key={i} p={[-0.75,0.5+i*0.27,z+0.05]} s={[0.25,0.17,0.04]} color="#364638"/>)}</group>)}
    <Box p={[-0.12,-0.22,-0.25]} s={[1.85,0.4,2.8]} color={graphite}/>
    <Box p={[0.82,-0.2,-0.2]} s={[0.04,0.2,2.5]} color={steel}/>
    {[-0.95,0.35].map(z=><Fan key={z} position={[-0.12,-0.46,z]} rotation={[Math.PI/2,0,0]} motion={motion} radius={0.52}/>)}
    <Box p={[0,-1.43,0]} s={[2.4,0.09,3.7]} color={shell}/>
    <Box p={[0,-1.97,-0.84]} s={[2,0.95,1.6]} color={graphite}/>
    <Box p={[0.1,-1.3,1.05]} s={[1.2,0.15,1.3]} color="#626e62"/>
    <Box p={[0.1,-1.215,1.05]} s={[0.8,0.01,0.75]} color="#cfd8c8"/>
    {/* Service panel slides away before disappearing. It never obstructs internal selection. */}
    <group ref={side} visible={view !== "inside"}>
      <mesh position={[1.28,0,0]}><boxGeometry args={[0.055,4.88,3.8]}/><meshPhysicalMaterial color="#c3cebc" transparent opacity={0.23} roughness={0.16} metalness={0.1} depthWrite={false}/></mesh>
      {[-2.43,2.43].map(y=><Box key={y} p={[1.3,y,0]} s={[0.08,0.09,3.9]} color={graphite}/>)}
      {[-1.88,1.88].map(z=><Box key={z} p={[1.3,0,z]} s={[0.08,4.9,0.09]} color={graphite}/>)}
    </group>
  </group>;
}
