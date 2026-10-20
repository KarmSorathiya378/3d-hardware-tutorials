"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, SRGBColorSpace, Texture } from "three";
import { boardPoint } from "./explorer-data";

// The reference photograph is mapped onto independently raised component surfaces.
// Coordinates remain in the original 800 × 800 image so texture and hotspots agree.
const regions: { id: string; rect: [number, number, number, number]; height: number }[] = [
  { id: "socket", rect: [363, 190, 139, 169], height: 0.22 },
  { id: "memory", rect: [548, 120, 81, 309], height: 0.34 },
  { id: "vrm", rect: [273, 92, 273, 49], height: 0.4 },
  { id: "io", rect: [120, 89, 183, 312], height: 0.48 },
  { id: "pcie", rect: [230, 471, 245, 27], height: 0.16 },
  { id: "m2", rect: [248, 415, 229, 51], height: 0.2 },
  { id: "chipset", rect: [493, 470, 161, 108], height: 0.22 },
  { id: "power", rect: [659, 212, 29, 126], height: 0.32 },
  { id: "sata", rect: [656, 469, 32, 72], height: 0.22 },
  { id: "battery", rect: [584, 697, 54, 54], height: 0.08 },
  { id: "lower-m2", rect: [193, 642, 492, 54], height: 0.2 },
  { id: "second-pcie", rect: [230, 610, 245, 28], height: 0.16 },
  { id: "middle-m2", rect: [220, 512, 270, 66], height: 0.16 },
];

function RaisedComponent({ region, texture, selected, onSelect, reducedMotion }: {
  region: typeof regions[number]; texture: Texture; selected: boolean;
  onSelect: (id: string) => void; reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const { rect: [x, y, w, h], height, id } = region;
  const map = useMemo(() => {
    const crop = texture.clone();
    crop.repeat.set(w / 800, h / 800);
    crop.offset.set(x / 800, 1 - (y + h) / 800);
    crop.needsUpdate = true;
    return crop;
  }, [texture, x, y, w, h]);
  useEffect(() => () => map.dispose(), [map]);
  useFrame((_, dt) => {
    if (group.current) group.current.position.y = reducedMotion ? (selected ? 0.24 : 0) : MathUtils.damp(group.current.position.y, selected ? 0.24 : 0, 7, dt);
  });
  return <group ref={group}>
    <group position={boardPoint(x + w / 2, y + h / 2, 0)} onClick={event => {
      event.stopPropagation();
      if (!["lower-m2", "middle-m2", "second-pcie"].includes(id)) onSelect(id);
    }}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[w * 0.009, height, h * 0.009]} />
        <meshStandardMaterial color={selected ? "#38604b" : "#282c2c"} roughness={0.46} metalness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.009, h * 0.009]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  </group>;
}

export function PhotographicBoard({ selected, onSelect, reducedMotion }: {
  selected: string | null; onSelect: (id: string) => void; reducedMotion: boolean;
}) {
  const source = useTexture("/references/proart-motherboard.png");
  const texture = useMemo(() => {
    const map = source.clone();
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    return map;
  }, [source]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group>
    <mesh position={boardPoint(411, 412, -0.07)} castShadow>
      <boxGeometry args={[5, 0.14, 6.22]} />
      <meshStandardMaterial color="#242b29" roughness={0.75} />
    </mesh>
    <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[7.2, 7.2]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.1} toneMapped={false} />
    </mesh>
    {regions.map(region => <RaisedComponent key={region.id} region={region} texture={texture} selected={selected === region.id} onSelect={onSelect} reducedMotion={reducedMotion} />)}
  </group>;
}
