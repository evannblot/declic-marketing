const assert=require('node:assert/strict');const {QuizEngine:E}=require('./dist/engine.js');
let s=E.initial(['a','b','c','d','e']);assert.deepEqual(E.grade(s,true),s);s.revealed=true;s=E.grade(s,false);assert.deepEqual(s.queue,['b','c','d','a','e']);assert.equal(s.wrong,1);assert.equal(s.attempts,1);assert.equal(s.revealed,false);s.revealed=true;s=E.grade(s,true);assert.deepEqual(s.mastered,['b']);assert(!s.queue.includes('b'));assert.equal(s.attempts,2);
while(s.queue.length){s.revealed=true;s=E.grade(s,true);}assert.equal(s.mastered.length,5);assert.equal(new Set(s.mastered).size,5);
s=E.initial(['a']);s.revealed=true;s=E.grade(s,false);assert.deepEqual(s.queue,['a']);s.revealed=true;s=E.grade(s,true);assert.equal(s.queue.length,0);
const cards=require('./dist/cards.json');assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert(cards.every(c=>c.question&&c.answer&&c.chapter));assert.equal(new Set(cards.map(c=>c.chapter)).size,16);
console.log('PASS: répétition différée, maîtrise, compteurs, anti-double clic, fin, question unique, 224 cartes et 16 chapitres.');
