'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import type { Point } from './lessons';

/** Small DOM labels projected from the scene. No nested React roots to leak on scene switches. */
export function ModelAnnotation({position, number, title, selected=false, onSelect, offset=[0,0]}: {position:Point;number?:number;title:string;selected?:boolean;onSelect?:()=>void;offset?:[number,number]}) {
  const {gl,size,camera}=useThree();
  const group=useRef<Group>(null);
  const node=useRef<HTMLElement | null>(null);
  const leader=useRef<HTMLElement | null>(null);
  const projected=useRef(new Vector3());
  const callback=useRef(onSelect);
  useEffect(()=>{callback.current=onSelect;},[onSelect]);
  useEffect(()=>{
    const element=document.createElement(number===undefined?'span':'button');
    element.style.position='absolute';element.style.top='0';element.style.left='0';element.style.zIndex='20';
    if(number!==undefined) {
      element.setAttribute('type','button');
      element.addEventListener('pointerdown',e=>e.stopPropagation());
      element.addEventListener('click',e=>{e.stopPropagation();callback.current?.();});
    } else element.style.pointerEvents='none';
    const line=document.createElement('span');
    line.className='hardware-leader';
    line.style.position='absolute';line.style.top='0';line.style.left='0';line.style.pointerEvents='none';line.style.transformOrigin='0 50%';
    gl.domElement.parentElement?.appendChild(line);leader.current=line;
    gl.domElement.parentElement?.appendChild(element);node.current=element;
    return ()=>{element.remove();line.remove();node.current=null;leader.current=null;};
  },[gl,number]);
  useEffect(()=>{
    if(!node.current)return;
    node.current.className=number===undefined?'hardware-model-tooltip':`hardware-pin ${selected?'is-active':''}`;
    node.current.textContent=number===undefined?title:String(number);
    node.current.title=title;
    if(number!==undefined){node.current.setAttribute('aria-label',`${number}. ${title}`);node.current.setAttribute('aria-pressed',String(selected));}
  },[number,title,selected]);
  useFrame(()=>{
    if(!group.current||!node.current)return;
    group.current.getWorldPosition(projected.current);projected.current.project(camera);
    const p=projected.current;
    const mobileScale = size.width < 620 ? 0.65 : 1;
    const x = (p.x+1)*size.width/2 + offset[0] * mobileScale;
    const y = (1-p.y)*size.height/2 + offset[1] * mobileScale;
    node.current.style.display=p.z>1||p.z< -1||x<18||x>size.width-18||y<18||y>size.height-18?'none':'';
    node.current.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px)`;
    if(leader.current){
      const dx=offset[0]*mobileScale, dy=offset[1]*mobileScale;
      leader.current.style.display=node.current.style.display==='none'||Math.hypot(dx,dy)<20?'none':'';
      leader.current.style.width=`${Math.max(0,Math.hypot(dx,dy)-15)}px`;
      leader.current.style.transform=`translate(${x-dx}px,${y-dy}px) rotate(${Math.atan2(dy,dx)}rad)`;
    }
  });
  return <group ref={group} position={position}/>;
}
