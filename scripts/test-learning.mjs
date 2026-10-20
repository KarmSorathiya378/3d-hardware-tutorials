import assert from "node:assert/strict";
import { QUESTIONS, TOPICS, FORMAT_LABELS, grade, makeSession } from "../src/components/test/question-bank.ts";

assert.equal(QUESTIONS.length,64);
assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
for(const topic of Object.keys(TOPICS)) assert.equal(QUESTIONS.filter(q=>q.topic===topic).length,8);
for(const format of Object.keys(FORMAT_LABELS)) assert.ok(QUESTIONS.some(q=>q.format===format));
for(const q of QUESTIONS) {
  assert.ok(q.answer.length && q.explanation && q.source.startsWith("https://"));
  assert.equal(new Set(q.options).size,q.options.length);
  q.answer.forEach(a=>assert.ok(q.options.includes(a),q.id));
  assert.ok(grade(q,[...q.answer]),q.id);
  assert.equal(grade(q,[]),false);
  if(q.format==="match") assert.equal(q.labels.length,q.answer.length);
  if(q.format==="order") {
    assert.equal(q.options.length,q.answer.length);
    assert.equal(grade(q,[...q.answer].reverse()),false);
  }
  if(q.format==="multiple") {
    assert.ok(grade(q,[...q.answer].reverse()));
    assert.equal(grade(q,q.answer.slice(1)),false);
    assert.equal(grade(q,[...q.answer,q.options.find(o=>!q.answer.includes(o))]),false);
    assert.equal(grade(q,q.answer.map(()=>q.answer[0])),false);
  }
}
for(let i=0;i<40;i++) {
  const session=makeSession(QUESTIONS,12);
  assert.equal(session.length,12);
  assert.equal(new Set(session.map(q=>q.id)).size,12);
  assert.equal(new Set(session.map(q=>q.format)).size,6);
}
assert.deepEqual(makeSession([],12),[]);
assert.equal(makeSession(QUESTIONS.filter(q=>q.topic==="board"),24).length,8);
console.log("64-question bank valid; all six formats, exact scoring, filtering and randomized sessions passed.");
