const assert=require('node:assert/strict'),{boot}=require('./qa-harness.cjs');
(async()=>{
 const a=await boot(),{$,w,click}=a;
 const quiz=w.DeclicLibrary.all().find(q=>q.id==='communication-resume');
 assert(quiz);assert.equal(quiz.cards.length,36);assert.equal(quiz.subjectId,'communication');
 // The new entry is discoverable in Communication without replacing existing quizzes.
 $('quiz-list').querySelector('[data-subject-id="communication"] .choose-subject').click();
 const tile=$('subject-quiz-list').firstElementChild;
 assert.equal(tile.dataset.quizId,quiz.id);assert.equal(tile.querySelector('.subject-kind').textContent,'TON RÉSUMÉ');
 assert.equal($('subject-quiz-list').children.length,4);
 const older=w.DeclicLibrary.all().filter(q=>q.id!==quiz.id);
 for(const other of older){w.DeclicLibrary.openQuiz(other.id);click('reveal');click('good');}
 const previous=Object.fromEntries(older.map(q=>[q.storageKey,w.localStorage.getItem(q.storageKey)]));
 w.DeclicLibrary.showSubject('communication');$('subject-quiz-list').firstElementChild.querySelector('.start-quiz').click();
 assert.equal($('total').textContent,'36');assert.equal($('mastered').textContent,'0');assert.equal($('answer'),null);
 const first=$('question').textContent;click('good');assert.equal($('mastered').textContent,'0');
 click('reveal');const correction=$('correction').textContent;assert(correction);
 $('answer-sources').querySelector('button').click();assert($('course-dialog').open);click('course-back');
 assert.equal($('question').textContent,first);assert.equal($('correction').textContent,correction);
 click('bad');for(let i=0;i<3;i++){click('reveal');click('good');}
 assert.equal($('question').textContent,first);assert.equal($('mastered').textContent,'3');assert.equal($('wrong').textContent,'1');
 const reload=await boot(a.snapshot());reload.w.DeclicLibrary.openQuiz(quiz.id);
 assert.equal(reload.$('question').textContent,first);assert.equal(reload.$('mastered').textContent,'3');
 let attempts=0;while(reload.$('finished').classList.contains('hidden')){
  assert(quiz.cards.some(c=>c.question===reload.$('question').textContent));
  reload.click('reveal');assert(reload.$('correction').textContent);reload.click('good');assert(++attempts<=33);
 }
 assert.equal(attempts,33);assert.equal(reload.$('mastered').textContent,'36');
 reload.click('reset');reload.click('confirm-reset');assert.equal(reload.$('mastered').textContent,'0');
 for(const [key,value]of Object.entries(previous))assert.equal(reload.w.localStorage.getItem(key),value);
 await reload.close();await a.close();
 console.log('PASS résumé : choix dans Communication, 36 questions, réponse mentale, correction et retour du PDF, répétition différée, sauvegarde, fin et remise à zéro sans toucher aux autres quiz.');
})().catch(error=>{console.error(error);process.exitCode=1});
