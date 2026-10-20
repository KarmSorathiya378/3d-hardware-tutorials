'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { LESSONS, type Device } from './lessons';
const Scene = dynamic(()=>import('./HardwareScene'),{ssr:false,loading:()=> <div className="hardware-scene hardware-fallback" role="status">Preparing the interactive model…</div>});
export default function HardwareLesson({device}: {device:Device}) {
  const lesson = LESSONS[device];
  const [selected,setSelected]=useState(lesson.parts[0].id);
  const [open,setOpen]=useState(true), [motion,setMotion]=useState(false), [labels,setLabels]=useState(true);
  const [visited,setVisited]=useState<string[]>([lesson.parts[0].id]);
  const [answer,setAnswer]=useState('');
  const index=lesson.parts.findIndex(p=>p.id===selected), part=lesson.parts[index];
  const select=(id:string)=> {setSelected(id);setOpen(true);setVisited(v=>v.includes(id)?v:[...v,id]);};
  return <main className="hardware-lesson">
    <header className="hardware-intro"><p className="hardware-eyebrow">{lesson.subtitle}</p><h1>{lesson.title}</h1><p>{lesson.summary}</p></header>
    <div className="hardware-toolbar"><div><button aria-pressed={open} onClick={()=>setOpen(v=>!v)}>{open?'Close enclosure':'Open enclosure'}</button><button aria-pressed={labels} onClick={()=>setLabels(v=>!v)}>{labels?'Hide numbers':'Show numbers'}</button>{device!=='ssd'&&<button aria-pressed={motion} onClick={()=>setMotion(v=>!v)}>{motion?'Pause motion':'Show motion'}</button>}</div><span>{visited.length} / {lesson.parts.length} parts explored</span></div>
    <div className="hardware-workbench">
      <Scene device={device} selected={selected} onSelect={select} open={open} motion={motion} labels={labels}/>
      <aside className="hardware-detail" aria-live="polite" aria-atomic="true"><p className="hardware-eyebrow">PART {String(index+1).padStart(2,'0')} / {String(lesson.parts.length).padStart(2,'0')}</p><h2>{part.name}</h2><p className="hardware-role">{part.role}</p><p>{part.explanation}</p><h3>A simple example</h3><p>{part.example}</p><div className="hardware-tip"><h3>Remember</h3><p>{part.tip}</p></div><div className="hardware-step"><button onClick={()=>select(lesson.parts[(index+lesson.parts.length-1)%lesson.parts.length].id)}>← Previous</button><button onClick={()=>select(lesson.parts[(index+1)%lesson.parts.length].id)}>Next part →</button></div></aside>
    </div>
    <div className="hardware-parts" aria-label="Select a part">{lesson.parts.map((p,i)=><button key={p.id} aria-pressed={selected===p.id} onClick={()=>select(p.id)}><span>{i+1}</span><strong>{p.name}</strong><small>{visited.includes(p.id)?'Explored':'Explore'}</small></button>)}</div>
    <section className="hardware-check"><div><p className="hardware-eyebrow">CHECK YOUR UNDERSTANDING</p><h2>{lesson.question}</h2></div><div className="hardware-answers">{lesson.choices.map(choice=><button key={choice} aria-pressed={answer===choice} onClick={()=>setAnswer(choice)}>{choice}</button>)}<p role="status">{answer ? answer===lesson.answer ? 'Correct. You’ve got it.' : 'Not quite. Revisit the numbered parts, then try again.' : 'Choose an answer to check what you learned.'}</p></div></section>
    <p className="hardware-note">Original interactive educational models. Layouts are representative, not a scale replica of a particular manufacturer’s product. Covers are hidden for explanation; do not open a working HDD or a power supply.</p>
  </main>;
}
