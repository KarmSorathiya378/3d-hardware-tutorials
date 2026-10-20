"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FORMAT_LABELS, QUESTIONS, TOPICS, grade, makeSession, type Level, type Question, type Topic } from "./question-bank";
import "./test.css";

type Attempt = { question: Question; answer: string[]; correct: boolean };
const topicKeys = Object.keys(TOPICS) as Topic[];
const marks = [{name:"A",x:54,y:34},{name:"B",x:74,y:31},{name:"C",x:44,y:61},{name:"D",x:84,y:34}];
function initialAnswer(q: Question) { return q.format==="order" ? [...q.options] : q.format==="match" ? q.labels!.map(()=>"") : []; }

export default function TestMode() {
  const [topics,setTopics]=useState<Topic[]>([...topicKeys]);
  const [level,setLevel]=useState<Level|"All">("All");
  const [mode,setMode]=useState<"practice"|"assessment">("practice");
  const [count,setCount]=useState(12);
  const [session,setSession]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<string[]>([]);
  const [attempts,setAttempts]=useState<Attempt[]>([]);
  const [checked,setChecked]=useState(false);
  const [finished,setFinished]=useState(false);
  const [confirmExit,setConfirmExit]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const active=session.length>0 && !finished;
  const q=session[index];
  const pool=QUESTIONS.filter(q=>topics.includes(q.topic) && (level==="All"||q.level===level));
  const correct=attempts.filter(a=>a.correct).length;
  useEffect(()=>{
    if(!active) return;
    const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();};
    window.addEventListener("beforeunload",warn);
    return ()=>window.removeEventListener("beforeunload",warn);
  },[active]);
  function focusHeading() { requestAnimationFrame(()=>heading.current?.focus()); }
  function start(selected: readonly Question[]=pool) {
    const next=makeSession(selected,selected===pool?count:selected.length);
    if(!next.length) return;
    setSession(next);setIndex(0);setAnswer(initialAnswer(next[0]));setAttempts([]);setChecked(false);setFinished(false);setConfirmExit(false);focusHeading();
  }
  function record() {
    const attempt={question:q,answer:[...answer],correct:grade(q,answer)};
    setAttempts([...attempts,attempt]);
    return attempt;
  }
  function advance() {
    if(index===session.length-1) {setFinished(true);focusHeading();return;}
    setIndex(index+1);setAnswer(initialAnswer(session[index+1]));setChecked(false);focusHeading();
  }
  function submit() { record(); if(mode==="practice") setChecked(true); else advance(); }
  function reset() {setSession([]);setFinished(false);setConfirmExit(false);focusHeading();}
  function select(value:string) {
    if(checked) return;
    setAnswer(q.format==="multiple" ? answer.includes(value)?answer.filter(x=>x!==value):[...answer,value] : [value]);
  }
  const ready=active && (q.format==="match" ? answer.every(Boolean) : answer.length>0);
  return <main className="test-page">
    <header className="test-header"><span>Learning lab / Test mode</span><Link href="/">Back to explorer <span aria-hidden="true">↗</span></Link></header>
    {!session.length ? <>
      <div className="test-intro"><h1 ref={heading} tabIndex={-1}>Turn curiosity<br/>into know-how.</h1><p>Recognize the parts. Understand the connections.<br className="desktop-break"/> Put your hardware knowledge to work.</p></div>
      <div className="test-setup">
        <section className="test-settings" aria-label="Configure your test">
          <fieldset><legend>How do you want to learn?</legend><div className="mode-options">{(["practice","assessment"] as const).map(value=><label key={value} data-selected={mode===value}><input type="radio" name="mode" value={value} checked={mode===value} onChange={()=>setMode(value)}/><span><strong>{value==="practice"?"Practice":"Assessment"}</strong><small>{value==="practice"?"Learn from feedback after every answer.":"See your score and explanations at the end."}</small></span></label>)}</div></fieldset>
          <fieldset className="topic-field"><legend>Choose your topics</legend><div className="topic-actions"><button onClick={()=>setTopics([...topicKeys])}>Select all</button><button onClick={()=>setTopics([])}>Clear</button></div><div className="topic-options">{topicKeys.map(topic=><label key={topic}><input type="checkbox" checked={topics.includes(topic)} onChange={()=>setTopics(topics.includes(topic)?topics.filter(t=>t!==topic):[...topics,topic])}/><span>{TOPICS[topic]}</span><small>{QUESTIONS.filter(q=>q.topic===topic).length}</small></label>)}</div></fieldset>
          <div className="test-selects"><label>Difficulty<select value={level} onChange={e=>setLevel(e.target.value as Level|"All")}><option>All</option><option>Foundation</option><option>Applied</option><option>Advanced</option></select></label><label>Session length<select value={count} onChange={e=>setCount(Number(e.target.value))}><option value={12}>12 questions</option><option value={24}>24 questions</option><option value={QUESTIONS.length}>All available</option></select></label></div>
          <div className="test-start"><button className="test-primary" disabled={!pool.length} onClick={()=>start()}>Start {mode} <span aria-hidden="true">→</span></button><p role="status">{pool.length?`${Math.min(count,pool.length)} questions from ${pool.length} available`:"Choose at least one topic to begin."}</p></div>
        </section>
        <aside className="test-guide"><div className="test-guide-art" aria-hidden="true"><svg viewBox="0 0 240 180" fill="none"><path d="m35 57 85-42 85 42-85 43Z" stroke="currentColor" strokeWidth="2"/><path d="m35 83 85 42 85-42M35 109l85 42 85-42" stroke="currentColor" strokeWidth="2"/><path d="m89 55 22 11 39-22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg></div><h2>More than remembering names.</h2><p>Identify real components, match their functions, sequence a workflow and reason through practical situations.</p><ul><li>{QUESTIONS.length} questions across eight topics</li><li>Six ways to test your understanding</li><li>Explanations and a topic-by-topic score</li></ul><p className="test-fine">From foundations to advanced concepts. This is a learning tool, not a professional certification. One point per fully correct answer; no partial credit. Sessions are not saved when you leave.</p></aside>
      </div>
    </> : finished ? <>
      <div className="test-result-heading"><div><h1 ref={heading} tabIndex={-1}>Here’s where you stand.</h1><p>{correct===attempts.length?"Every answer correct. Try a different difficulty or topic next.":"Use your results to choose what to explore next."}</p></div><div className="result-score"><strong>{Math.round(correct/attempts.length*100)}<span>%</span></strong><p>{correct} of {attempts.length} correct</p></div></div>
      <section className="topic-results" aria-label="Scores by topic">{topicKeys.filter(t=>attempts.some(a=>a.question.topic===t)).map(t=>{const group=attempts.filter(a=>a.question.topic===t);const n=group.filter(a=>a.correct).length;return <div key={t}><span>{TOPICS[t]}</span><meter min={0} max={group.length} value={n} aria-label={`${TOPICS[t]}: ${n} out of ${group.length}`}/><strong>{n}/{group.length}</strong></div>;})}</section>
      <div className="result-actions">{correct<attempts.length&&<button className="test-primary" onClick={()=>start(attempts.filter(a=>!a.correct).map(a=>a.question))}>Retry missed questions</button>}<button className="test-secondary" onClick={reset}>Build another test</button></div>
      <section className="answer-review"><h2>Review your answers</h2>{attempts.map((a,i)=><details key={a.question.id}><summary><span className="review-status" data-correct={a.correct}>{a.correct?"Correct":"Review"}</span><span>{i+1}. {a.question.prompt}</span></summary><div><p><strong>Your answer:</strong> {describe(a.question,a.answer)}</p>{!a.correct&&<p><strong>Correct answer:</strong> {describe(a.question,a.question.answer)}</p>}<p>{a.question.explanation}</p><a href={a.question.source} target="_blank" rel="noreferrer">Related technical reference ↗</a></div></details>)}</section>
    </> : <>
      <div className="session-bar"><span>{mode==="practice"?"Practice":"Assessment"} <span aria-hidden="true">/</span> {index+1} of {session.length}</span><button onClick={()=>setConfirmExit(!confirmExit)}>End session</button></div>
      {confirmExit&&<div className="exit-confirm" role="alert"><p>End this session and discard its answers?</p><button className="test-secondary" onClick={()=>setConfirmExit(false)}>Keep learning</button><button className="test-secondary" onClick={reset}>Discard session</button></div>}
      <progress value={index} max={session.length} aria-label="Questions completed"/>
      <section className="question-workspace">
        <div className="question-meta"><span>{TOPICS[q.topic]}</span><span>{q.level}</span><span>{FORMAT_LABELS[q.format]}</span></div>
        <h1 ref={heading} tabIndex={-1}>{q.prompt}</h1>
        {q.format==="visual"&&<div className="visual-question"><Image src="/references/proart-motherboard.png" alt="Motherboard viewed from above, with four lettered locations. Choose a location using the controls below." width={800} height={800} priority/>{marks.map(m=><button key={m.name} style={{left:`${m.x}%`,top:`${m.y}%`}} disabled={checked} aria-label={`Location ${m.name}`} aria-pressed={answer.includes(m.name)} onClick={()=>select(m.name)}>{m.name}</button>)}</div>}
        {q.format==="match" ? <div className="match-options">{q.labels!.map((label,i)=><label key={label}><span>{label}</span><select disabled={checked} value={answer[i]} onChange={e=>setAnswer(answer.map((a,j)=>i===j?e.target.value:a))}><option value="">Choose a match</option>{q.options.map(option=><option key={option}>{option}</option>)}</select></label>)}</div> :
        q.format==="order" ? <><p className="order-hint">Use the arrow buttons to move each step into order, then submit.</p><ol className="order-options">{answer.map((item,i)=><li key={item}><span className="order-number">{i+1}</span><span>{item}</span><div>{([-1,1] as const).map(direction=><button key={direction} disabled={checked||i+direction<0||i+direction>=answer.length} aria-label={`Move ${item} ${direction===-1?"up":"down"}`} onClick={()=>{const next=[...answer];[next[i],next[i+direction]]=[next[i+direction],next[i]];setAnswer(next);}}><svg viewBox="0 0 20 20" aria-hidden="true"><path d={direction===-1?"m5 12 5-5 5 5":"m5 8 5 5 5-5"} fill="none" stroke="currentColor" strokeWidth="1.7"/></svg></button>)}</div></li>)}</ol></> :
        <fieldset className={`answer-options ${q.format==="visual"?"visual-answers":""}`} disabled={checked}><legend className="sr-only">{FORMAT_LABELS[q.format]}</legend>{q.options.map((option,i)=><label key={option} data-selected={answer.includes(option)}><input type={q.format==="multiple"?"checkbox":"radio"} name="answer" checked={answer.includes(option)} onChange={()=>select(option)}/><span>{q.format==="visual"?`Location ${option}`:option}</span><small aria-hidden="true">{q.format==="visual"?"":String.fromCharCode(65+i)}</small></label>)}</fieldset>}
        {checked&&<div className="answer-feedback" data-correct={grade(q,answer)} role="status"><h2>{grade(q,answer)?"That’s right.":"A useful one to revisit."}</h2>{!grade(q,answer)&&<p><strong>Correct answer:</strong> {describe(q,q.answer)}</p>}<p>{q.explanation}</p><a href={q.source} target="_blank" rel="noreferrer">Related technical reference ↗</a></div>}
        <div className="question-footer">{checked?<button className="test-primary" onClick={advance}>{index===session.length-1?"View results":"Next question"} <span aria-hidden="true">→</span></button>:<button className="test-primary" onClick={submit} disabled={!ready}>{mode==="practice"?"Check answer":index===session.length-1?"Finish assessment":"Submit answer"} <span aria-hidden="true">→</span></button>}<span>{mode==="assessment"?"Answers revealed after the final question.":"One point for a fully correct answer."}</span></div>
      </section>
    </>}
  </main>;
}
function describe(q:Question,answer:string[]) { return q.format==="match"?q.labels!.map((label,i)=>`${label}: ${answer[i]||"No answer"}`).join("; "):answer.join(q.format==="order"?" → ":"; "); }
