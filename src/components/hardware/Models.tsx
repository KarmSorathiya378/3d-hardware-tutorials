'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group } from 'three';
import { ModelAnnotation } from './ModelAnnotation';
import { LESSONS, type Device, type Point } from './lessons';

type Props = { device: Device; selected: string; onSelect: (id: string) => void; open: boolean; motion: boolean; labels: boolean };
const metal = '#a7afb5', dark = '#242b30', pcb = '#214d42', gold = '#b49a58';
function Box({ p, s, color = dark, metallic = 0.3 }: { p: Point; s: Point; color?: string; metallic?: number }) {
  return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} metalness={metallic} roughness={0.42}/></mesh>;
}
function Disc({ p, r, h, color = metal }: { p: Point; r: number; h: number; color?: string }) {
  return <mesh position={p} castShadow><cylinderGeometry args={[r,r,h,64]}/><meshStandardMaterial color={color} metalness={0.75} roughness={0.26}/></mesh>;
}
function Screw({ p }: { p: Point }) {
  return <group position={p}><Disc p={[0,0,0]} r={0.065} h={0.035}/><Box p={[0,0.021,0]} s={[0.08,0.006,0.015]} color="#32383b"/></group>;
}
function Chip({ p, s }: { p: Point; s: Point }) {
  return <group position={p}><Box p={[0,0,0]} s={s} color="#181d21" metallic={0.1}/>{Array.from({length:8},(_,i)=><group key={i}><Box p={[-s[0]/2-0.025,-s[1]/3,-s[2]/2+0.06+i*(s[2]-0.12)/7]} s={[0.08,0.025,0.025]} color={metal}/><Box p={[s[0]/2+0.025,-s[1]/3,-s[2]/2+0.06+i*(s[2]-0.12)/7]} s={[0.08,0.025,0.025]} color={metal}/></group>)}<Box p={[0,s[1]/2+0.002,0]} s={[s[0]*0.55,0.003,0.018]} color="#707a80"/></group>;
}
function SATA({ z }: { z: number }) {
  return <group><Box p={[0.2,0,z]} s={[2.3,0.18,0.26]}/>{Array.from({length:22},(_,i)=><Box key={i} p={[-0.83+i*0.09+(i>14?0.12:0),0.098,z+0.025]} s={[0.035,0.012,0.2]} color={gold}/>)}<Box p={[0.52,0.13,z]} s={[0.08,0.08,0.27]}/></group>;
}
function Fan({ motion, radius = 0.57 }: { motion: boolean; radius?: number }) {
  const fan = useRef<Group>(null);
  useFrame((_,dt)=> { if(fan.current && motion) fan.current.rotation.y += Math.min(dt,0.05)*3; });
  return <group><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[radius,0.055,8,48]}/><meshStandardMaterial color={dark}/></mesh><group ref={fan}><Disc p={[0,0,0]} r={radius*0.22} h={0.12} color={dark}/>{Array.from({length:7},(_,i)=><group key={i} rotation={[0,i*Math.PI*2/7,0]}><mesh position={[radius*0.52,0,0]} rotation={[0,0,0.25]}><boxGeometry args={[radius*0.68,0.045,radius*0.3]}/><meshStandardMaterial color="#535d65" metalness={0.4} roughness={0.5}/></mesh></group>)}</group></group>;
}
export function HDD({ motion, open }: Pick<Props,'motion'|'open'>) {
  const spindle = useRef<Group>(null), arm = useRef<Group>(null);
  useFrame(({clock},dt)=> { if(spindle.current && motion) spindle.current.rotation.y += Math.min(dt,0.05)*1.2; if(arm.current && motion) arm.current.rotation.y = Math.sin(clock.elapsedTime*0.7)*0.16; });
  return <group>
    <RoundedBox args={[3.25,0.3,4.6]} radius={0.12} position={[0,-0.15,0]}><meshStandardMaterial color={metal} metalness={0.75} roughness={0.32}/></RoundedBox>
    <Box p={[0,0.025,0]} s={[3,0.035,4.3]} color="#31383c"/>
    {[-1.55,1.55].map(x=><Box key={x} p={[x,0.12,0]} s={[0.1,0.28,4.3]} color={metal}/>)}
    <Box p={[0,0.12,-2.19]} s={[3.1,0.28,0.1]} color={metal}/>
    <group position={[-0.45,0,0.15]}><group ref={spindle}>
      {[0.16,0.3].map(y=><group key={y}><Disc p={[0,y,0]} r={1.23} h={0.055}/>{[0.65,0.9,1.1,1.2].map(r=><mesh key={r} position={[0,y+0.029,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[r,r+0.007,80]}/><meshStandardMaterial color="#79848c" metalness={0.8} roughness={0.3}/></mesh>)}</group>)}
      <Disc p={[0,0.4,0]} r={0.34} h={0.18}/>{Array.from({length:6},(_,i)=><Screw key={i} p={[Math.cos(i*Math.PI/3)*0.23,0.5,Math.sin(i*Math.PI/3)*0.23]}/>)}
    </group></group>
    <group position={[1.05,0.29,1.16]}><Disc p={[0,0,0]} r={0.23} h={0.3}/><group ref={arm}>
      <mesh position={[-0.48,0.15,-0.48]} rotation={[0,-Math.PI/4,0]}><boxGeometry args={[0.16,0.07,1.3]}/><meshStandardMaterial color={metal} metalness={0.8} roughness={0.25}/></mesh>
      <Box p={[-0.91,0.12,-0.92]} s={[0.13,0.055,0.17]} color={dark}/><mesh position={[0.02,0,0.38]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[0.3,0.06,8,32,Math.PI*1.4]}/><meshStandardMaterial color="#9d6b3f" metalness={0.7}/></mesh>
    </group><Box p={[0.05,-0.03,0.43]} s={[0.77,0.12,0.58]} color={metal}/></group>
    <SATA z={2.25}/><Box p={[0,-0.34,0.8]} s={[2.65,0.08,2.5]} color={pcb}/><Chip p={[-0.55,-0.43,1.25]} s={[0.65,0.12,0.7]}/><Chip p={[0.6,-0.43,0.6]} s={[0.4,0.1,0.7]}/>
    {[-1.38,1.38].flatMap(x=>[-2,2].map(z=><Screw key={`${x}-${z}`} p={[x,0.28,z]}/>))}
    {!open && <group><RoundedBox args={[3.2,0.08,4.5]} radius={0.08} position={[0,0.64,0]}><meshStandardMaterial color="#c2c8cc" metalness={0.65} roughness={0.35}/></RoundedBox><Box p={[0,0.688,0]} s={[2.3,0.008,2.8]} color="#edece7"/>{Array.from({length:18},(_,i)=><Box key={i} p={[-0.8+i*0.08,0.695,0.55]} s={[i%3===0?0.04:0.02,0.005,0.45]} color={dark}/>)}</group>}
  </group>;
}
export function SSD({ open }: Pick<Props,'open'>) {
  return <group><RoundedBox args={[2.9,0.18,3.65]} radius={0.12} position={[0,-0.18,0]}><meshStandardMaterial color="#3a4249" metalness={0.7} roughness={0.38}/></RoundedBox><Box p={[0,-0.03,0]} s={[2.65,0.1,3.35]} color={pcb}/>
    {[-0.73,0.05].flatMap(x=>[-1,-0.13].map(z=><Chip key={`${x}-${z}`} p={[x,0.1,z]} s={[0.59,0.14,0.7]}/>))}
    <Chip p={[0.78,0.1,0.45]} s={[0.68,0.16,0.65]}/><Chip p={[0.78,0.1,-0.8]} s={[0.45,0.12,0.74]}/>
    {Array.from({length:9},(_,i)=><group key={i}><Box p={[-1.1+i*0.12,0.07,0.88]} s={[0.06,0.07,0.12]} color={i%3===0?metal:'#baac85'}/><Box p={[-1.13+i*0.25,0.027,1.26]} s={[0.014,0.009,0.65]} color="#52796a"/></group>)}
    <Box p={[-0.7,0.1,1.1]} s={[0.28,0.17,0.27]}/><SATA z={1.78}/>{[-1.22,1.22].flatMap(x=>[-1.5,1.5].map(z=><Screw key={`${x}-${z}`} p={[x,0.07,z]}/>))}
    {!open && <group><RoundedBox args={[2.9,0.08,3.65]} radius={0.1} position={[0,0.38,0]}><meshStandardMaterial color="#454e55" metalness={0.7} roughness={0.4}/></RoundedBox><Box p={[0,0.425,0]} s={[2.05,0.008,2.4]} color="#dedfd9"/></group>}
  </group>;
}
function Tower({ open, motion }: Pick<Props,'open'|'motion'>) {
  return <group>
    <Box p={[0,0,-0.92]} s={[3.5,5.2,0.1]} color="#687178"/>
    {[-2.55,2.55].map(y=><Box key={y} p={[0,y,0]} s={[3.5,0.12,2.05]} color={dark}/>)}
    {[-1.7,1.7].map(x=><group key={x}><Box p={[x,0,-0.85]} s={[0.12,5.2,0.15]} color={dark}/><Box p={[x,0,0.97]} s={[0.12,5.2,0.15]} color={dark}/></group>)}
    <Box p={[0,0.8,-0.79]} s={[2.75,3.2,0.12]} color={pcb}/>
    <Box p={[-0.2,1.45,-0.65]} s={[0.82,0.82,0.16]} color={metal}/>
    {Array.from({length:12},(_,i)=><Box key={i} p={[-0.2,1.02+i*0.075,-0.17]} s={[1,0.035,0.8]} color={metal}/>)}
    <group position={[-0.2,1.45,0.3]} rotation={[Math.PI/2,0,0]}><Fan motion={motion} radius={0.48}/></group>
    {[0.65,0.92].map(x=><group key={x}><Box p={[x,1.3,-0.45]} s={[0.1,1.85,0.48]} color={dark}/>{Array.from({length:6},(_,i)=><Box key={i} p={[x+0.055,0.58+i*0.26,-0.46]} s={[0.04,0.19,0.25]} color="#4d5b55"/>)}</group>)}
    <Box p={[-0.25,-0.15,0]} s={[2.6,0.32,1.5]} color={dark}/>
    {[-0.88,0.28].map(x=><group key={x} position={[x,-0.33,0.04]}><Fan motion={motion} radius={0.43}/></group>)}
    <Box p={[-0.55,-1.95,-0.02]} s={[1.9,0.9,1.65]} color={dark}/>
    {Array.from({length:10},(_,i)=><Box key={i} p={[-1.36+i*0.17,-1.94,0.82]} s={[0.06,0.6,0.015]} color="#697178"/>)}
    <Box p={[1,-1.95,0.1]} s={[0.85,0.15,1.3]} color="#929b9e"/><Box p={[1,-1.85,0.1]} s={[0.6,0.025,0.75]} color="#d9dcd7"/>
    {[-1,0.35,1.7].map(y=><group key={y} position={[1.57,y,0.02]} rotation={[0,0,Math.PI/2]}><Fan motion={motion} radius={0.55}/></group>)}
    {Array.from({length:16},(_,i)=><Box key={i} p={[1.72,-2.35+i*0.3,0]} s={[0.035,0.045,1.7]} color="#525d64"/>)}
    <Box p={[0,-1.4,-0.1]} s={[3.3,0.07,1.9]} color="#525a60"/>
    {[-1.3,1.3].flatMap(x=>[-0.6,0.6].map(z=><Box key={`${x}-${z}`} p={[x,-2.69,z]} s={[0.4,0.2,0.4]} color={dark}/>))}
    {!open && <mesh position={[0,0,1.04]}><boxGeometry args={[3.35,5.1,0.06]}/><meshStandardMaterial color="#63717a" metalness={0.1} roughness={0.15} transparent opacity={0.5}/></mesh>}
  </group>;
}
export function HardwareModel({device, selected, onSelect, open, motion, labels}: Props) {
  return <group>
    {device==='hdd'?<HDD open={open} motion={motion}/>:device==='ssd'?<SSD open={open}/>:<Tower open={open} motion={motion}/>}
    {open && labels && LESSONS[device].parts.map((part,i)=><ModelAnnotation key={part.id} position={part.position} number={i+1} title={part.name} selected={selected===part.id} onSelect={()=>onSelect(part.id)}/>)}
  </group>;
}
