const assert=require('node:assert/strict'),{boot}=require('./qa-harness.cjs'),{QuizEngine:E}=require('./dist/engine.js');
const plain=x=>JSON.parse(JSON.stringify(x));
(async()=>{
 const a=await boot(),{$,w,click}=a,all=w.DeclicLibrary.all(),full=all.find(q=>q.id==='communication'),essential=all.find(q=>q.id==='communication-essentiel'),cases=all.find(q=>q.id==='communication-cas');
 assert.equal(full.cards.length,147);assert.equal(essential.cards.length,84);assert.equal(cases.cards.length,14);
 const guide=w.DECLIC_COURSES.find(d=>d.id==='com-partiel');assert.equal(guide.pageCount,11);assert.equal(guide.url,'courses/com-partiel.pdf');assert.equal(full.documents[0],guide.id);
 // The six functions are learnable separately and also explained in the overview.
 const names=['référentielle','expressive','conative','phatique','poétique','métalinguistique'];
 for(const [index,name]of names.entries()){
  const id='communication-concept-'+(134+index),card=full.cards.find(c=>c.id===id);assert(card.question.includes(name));assert(card.answer.includes('Rôle :'));assert(card.answer.includes('Exemple pour comprendre'));assert.equal(essential.cards.find(c=>c.id===id).answer,card.answer);assert(card.sources.some(s=>s.documentId==='com'&&s.page===8));
 }
 const overview=full.cards.find(c=>c.id==='communication-concept-035');for(const name of names)assert(overview.answer.toLocaleLowerCase('fr').includes(name));assert(overview.answer.includes('fonction dominante'));assert(full.cards.find(c=>c.id==='communication-concept-135').answer.includes('l’émetteur'));
 // Models in the new guide have a short explanation and a recognition cue.
 for(const n of [33,34,36,38,40,41,42,44,45]){const c=full.cards.find(c=>c.id==='communication-concept-'+String(n).padStart(3,'0'));assert.equal(c.sources[0].documentId,'com-partiel');assert(c.answer.includes('reconnaître'));}
 // Open the source for a new function, then navigate between the two PDFs and return to it.
 const target=essential.cards.find(c=>c.id==='communication-concept-135'),seed=E.initial([target.id,...essential.cards.filter(c=>c.id!==target.id).map(c=>c.id)]);w.localStorage.setItem(essential.storageKey,JSON.stringify(seed));w.DeclicLibrary.openQuiz(essential.id);click('reveal');const correction=$('correction').textContent;$('answer-sources').querySelector('button').click();assert.equal($('course-document').options.length,2);assert.equal($('course-document').value,'com');assert.equal($('course-page-select').value,'8');
 $('course-document').value='com-partiel';$('course-document').dispatchEvent(new w.Event('change'));assert.equal($('course-page-select').options.length,11);$('course-page-select').value='6';$('course-page-select').dispatchEvent(new w.Event('change'));assert($('course-pdf').src.endsWith('courses/com-partiel.pdf#page=6'));click('course-origin');assert($('course-pdf').src.endsWith('courses/com.pdf#page=8'));click('course-back');assert.equal($('correction').textContent,correction);assert.equal($('question').textContent,target.question);
 w.DeclicLibrary.showSubject('communication');click('subject-course');assert.equal($('course-document').value,'com-partiel');click('course-back');assert(!$('subject-screen').classList.contains('hidden'));await a.close();
 // Exact immediately preceding banks remain valid saves. New questions are appended.
 for(const [quiz,previousCount]of [[full,133],[essential,73],[cases,12]]){
  const oldIds=plain(quiz.legacyCardIdSets.find(ids=>ids.length===previousCount));assert(oldIds);let old=E.initial(oldIds);old.revealed=true;old=E.grade(old,true);old.revealed=true;old=E.grade(old,false);old.revealed=true;
  const b=await boot({[quiz.storageKey]:JSON.stringify(old)});b.w.DeclicLibrary.openQuiz(quiz.id);const saved=JSON.parse(b.w.localStorage.getItem(quiz.storageKey));assert.deepEqual(saved.mastered,old.mastered);assert.deepEqual(saved.history,old.history);assert.deepEqual(saved.queue.slice(0,old.queue.length),old.queue);assert.equal(saved.wrong,1);assert.equal(saved.attempts,2);assert.equal(saved.queue.length+saved.mastered.length,quiz.cards.length);assert.equal(b.w.localStorage.getItem(quiz.storageKey+'-recovery'),null);await b.close();
  const completed={...E.initial([]),mastered:oldIds};const c=await boot({[quiz.storageKey]:JSON.stringify(completed)});c.w.DeclicLibrary.openQuiz(quiz.id);assert.equal(Number(c.$('remaining').textContent),quiz.cards.length-previousCount);assert.equal(Number(c.$('mastered').textContent),previousCount);await c.close();
 }
 console.log('PASS Com partiel : PDF de 11 pages, théories prioritaires, six fonctions expliquées, passage entre documents et migrations sans perte des banques 133/73/12.');
})().catch(error=>{console.error(error);process.exitCode=1});
