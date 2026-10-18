(function(){
'use strict';
const E=QuizEngine,$=id=>document.getElementById(id);const sessionStates=new Map(),blockedKeys=new Set(),lastStored=new Map();let cards=[],byId=new Map(),key='',filter=null,s=null,resetAll=true,storageWorks=true,activeQuiz=null,undoState=null;
const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function fresh(){return E.initial(E.shuffle(cards.map(c=>c.id)));}
function restoreFor(quiz,saved){const state=QuizCatalog.restore(saved,quiz.cards,quiz.legacyCardIds,quiz.legacyCardIdSets);if(state){if(state.examOnly===true){state.revealed=false;state.draft='';}state.examOnly=false;}return state;}
function readFilter(){filter=Object.hasOwn(s,'chapterFilter')?s.chapterFilter:(s.filter&&s.filter!=='all'?s.filter:null);const chapters=[...new Set(cards.map(c=>c.chapter))];if(filter!==null&&!chapters.includes(filter))filter=null;}
function selectFilter(){const chapters=[...new Set(cards.map(c=>c.chapter))];$('chapter').value=filter===null?'all':'chapter-'+chapters.indexOf(filter);}
function matches(id){return !!byId.has(id)&&(filter===null||byId.get(id).chapter===filter);}
function activeQueue(){return s.queue.filter(matches);}
function selectedCards(){return cards.filter(c=>matches(c.id));}
function save(){if(!s)return;syncExternal();s.filter=filter??'all';s.chapterFilter=filter;s.examOnly=false;sessionStates.set(key,JSON.parse(JSON.stringify(s)));try{if(blockedKeys.has(key))throw new Error('Sauvegarde précédente protégée');const serialized=JSON.stringify(s);localStorage.setItem(key,serialized);lastStored.set(key,serialized);storageWorks=true;}catch{storageWorks=false;}$('save-status').textContent=storageWorks?'Progression sauvegardée':'Sauvegarde indisponible · garde cette page ouverte';}
function current(){return byId.get(activeQueue()[0]);}
function progress(quiz){try{return restoreFor(quiz,sessionStates.get(quiz.storageKey)||JSON.parse(localStorage.getItem(quiz.storageKey)))?.mastered.length||0;}catch{return 0;}}
function open(quiz){if(s)save();undoState=null;activeQuiz=quiz;cards=quiz.cards;byId=new Map(cards.map(c=>[c.id,c]));key=quiz.storageKey;filter=null;s=null;
 let recovered=false;
 try{const raw=localStorage.getItem(key);if(lastStored.has(key)&&lastStored.get(key)!==raw)sessionStates.delete(key);lastStored.set(key,raw);s=restoreFor(quiz,sessionStates.get(key)||(raw?JSON.parse(raw):null));
  if(!s&&raw!==null){try{localStorage.setItem(key+'-recovery',raw);recovered=true;}catch{blockedKeys.add(key);storageWorks=false;}}
 }catch{storageWorks=false;try{const raw=localStorage.getItem(key);if(raw!==null){localStorage.setItem(key+'-recovery',raw);recovered=true;}}catch{blockedKeys.add(key);}}
 if(!s&&sessionStates.has(key))s=restoreFor(quiz,sessionStates.get(key));if(!s)s=fresh();readFilter();
 const chapters=[...new Set(cards.map(c=>c.chapter))];
 $('chapter').replaceChildren();const all=document.createElement('option');all.value='all';all.textContent='Toutes les questions';$('chapter').appendChild(all);for(const [index,chapter] of chapters.entries()){const o=document.createElement('option');o.value='chapter-'+index;o.textContent=chapter;$('chapter').appendChild(o);}selectFilter();
 $('quiz-subject-caption').textContent=quiz.subjectTitle||'Révision mentale';$('quiz-subject').textContent=quiz.quizTitle||quiz.title;$('quiz-description').textContent=quiz.description;$('reset').textContent='Recommencer ce quiz';$('toast').textContent='';document.title='Déclic · '+quiz.title;$('read-course').classList.toggle('hidden',!globalThis.DeclicCourses?.available(quiz));render();if(recovered)$('toast').textContent='La sauvegarde précédente était endommagée. Une copie a été conservée avant de recommencer.';}
function syncExternal(){
 if(!s||!lastStored.has(key)||blockedKeys.has(key))return false;
 try{const raw=localStorage.getItem(key);if(raw===lastStored.get(key))return false;lastStored.set(key,raw);
  const latest=raw===null?fresh():restoreFor(activeQuiz,JSON.parse(raw));if(!latest)return false;
  s=latest;undoState=null;sessionStates.set(key,JSON.parse(JSON.stringify(s)));readFilter();selectFilter();return true;
 }catch{return false;}
}
function changedElsewhere(){if(!syncExternal())return false;render();$('toast').textContent='La progression a changé dans un autre onglet. La question a été actualisée.';return true;}
function leave(){save();undoState=null;activeQuiz=null;s=null;}
function context(){if(!s)return null;const card=current();return card?{question:card.question,id:card.id,revealed:s.revealed===true}:null;}

function render(focus=false){const ids=activeQueue(),selected=selectedCards(),m=s.mastered.filter(matches).length,pct=Math.round(m/selected.length*100)||0;
 $('percent').textContent=pct+' %';$('progressbar').setAttribute('aria-valuenow',pct);$('fill').style.width=pct+'%';$('mastered').textContent=String(m);$('total').textContent=selected.length;$('remaining').textContent=ids.length;$('wrong').textContent=String(s.history.filter(x=>!x.good&&matches(x.id)).length);
 const n=new Set(cards.map(c=>c.chapter)).size;$('scope').textContent=selected.length+' questions · '+(filter===null?n+' chapitre'+(n>1?'s':''):'ce chapitre');$('attempts').textContent=s.history.filter(x=>matches(x.id)).length+' réponses évaluées · '+m+' bonnes réponses';$('quiz').classList.toggle('hidden',!ids.length);$('finished').classList.toggle('hidden',!!ids.length);
 $('review-bar').classList.toggle('hidden',!ids.length&&!undoState);$('review-caption').classList.toggle('hidden',!ids.length);$('review-row').classList.toggle('hidden',!ids.length);$('undo-grade').classList.toggle('hidden',!undoState);$('quick-course').classList.toggle('hidden',!globalThis.DeclicCourses?.available(activeQuiz));$('grade-actions').classList.toggle('hidden',!s.revealed);$('review-step').textContent=s.revealed?'Compare, puis évalue ta réponse':'Réponds dans ta tête, puis vérifie';
 if(!ids.length){$('finish-text').textContent=`Tu as réussi les ${selected.length} questions de ${filter===null?'ce quiz':'ce chapitre'}. Elles sont toutes mises de côté.`;save();if(focus)$('finished').focus();return;}
 const c=current();$('topic').textContent=c.chapter;$('session-count').textContent=ids.length+' à travailler';$('question').textContent=c.question;
 const isCase=!!c.scenario;$('case-context').classList.toggle('hidden',!isCase);$('case-scenario').textContent=c.scenario||'';$('mental-instruction').textContent=isCase?'Analyse la situation dans ta tête, puis compare ton raisonnement au corrigé. Plusieurs réponses peuvent être valables si elles sont justifiées.':'Réponds dans ta tête, puis affiche la correction.';$('correction-title').textContent=isCase?'Un corrigé possible':'La réponse à retenir';$('self-instruction').textContent=isCase?'En utilisant les critères du corrigé, ton analyse était…':'En comparant avec le cours, ta réponse était…';
 // Do not put correction text in the visible DOM before it has been requested.
 $('correction').textContent=s.revealed?c.answer.replace(/^\* /gm,'• '):'';if(globalThis.DeclicCourses)DeclicCourses.renderSources($('answer-sources'),s.revealed?c.sources:[],activeQuiz,isCase);$('reveal-actions').classList.toggle('hidden',!!s.revealed);$('correction-zone').classList.toggle('hidden',!s.revealed);save();if(focus){const target=$('question');target.focus({preventScroll:true});target.scrollIntoView({behavior:motion(),block:'start'});}}
function reveal(){if(changedElsewhere())return;if(!s||s.revealed||!current())return;s.draft='';s.revealed=true;render();$('correction-title').focus({preventScroll:true});$('correction-zone').scrollIntoView({behavior:motion(),block:'start'});}
function grade(good){if(changedElsewhere())return;if(!s||!s.revealed||!current())return;undoState={state:JSON.parse(JSON.stringify(s)),filter};const scoped={...s,queue:activeQueue(),mastered:[...s.mastered],history:[...s.history]};const next=E.grade(scoped,good),other=s.queue.filter(id=>!matches(id));s={...next,queue:[...next.queue,...other]};render(true);$('toast').textContent=good?'Question mise de côté.':next.queue.length>1?'À revoir après '+Math.min(3,next.queue.length-1)+' autre(s) question(s).':'Il ne reste que cette question. Prends un instant, puis réessaie.';}
function undoGrade(){if(changedElsewhere()||!undoState)return;const previous=undoState;undoState=null;s=previous.state;filter=previous.filter;selectFilter();render(true);$('toast').textContent='Évaluation annulée. Tu peux reprendre cette question.';}
$('chapter').addEventListener('change',()=>{if(!s||changedElsewhere())return;undoState=null;const value=$('chapter').value;filter=value==='all'?null:[...new Set(cards.map(c=>c.chapter))][Number(value.replace('chapter-',''))];if(filter===undefined)filter=null;s.draft='';s.revealed=false;$('toast').textContent='';render(true);});$('reveal').onclick=()=>reveal();$('good').onclick=()=>grade(true);$('bad').onclick=()=>grade(false);$('undo-grade').onclick=undoGrade;
function askReset(all){resetAll=all;$('reset-dialog').querySelector('p').textContent=all?'Toutes les questions et tous les compteurs de ce quiz seront réinitialisés. Les autres quiz seront conservés.':'Les questions et compteurs de cette sélection seront réinitialisés. Les autres questions seront conservées.';$('reset-dialog').showModal();}
$('reset').onclick=()=>askReset(true);$('restart-filter').onclick=()=>askReset(filter===null);$('cancel-reset').onclick=()=>$('reset-dialog').close();$('confirm-reset').onclick=()=>{if(!s)return;undoState=null;if(resetAll){s=fresh();filter=null;$('chapter').value='all';}else{const ids=selectedCards().map(c=>c.id);s.queue=[...E.shuffle(ids),...s.queue.filter(id=>!matches(id))];s.mastered=s.mastered.filter(id=>!matches(id));s.history=s.history.filter(x=>!matches(x.id));s.attempts=s.history.length;s.wrong=s.history.filter(x=>!x.good).length;s.draft='';s.revealed=false;}$('reset-dialog').close();$('toast').textContent='Nouvelle session, on y va !';render(true);};
window.addEventListener('storage',event=>{
 if(!event.key||event.key==='declic-library-v1'||!event.key.startsWith('declic-')||event.key.includes('-recovery'))return;
 if(event.key===key&&s){if(syncExternal()){render();$('toast').textContent='Progression mise à jour depuis un autre onglet.';}}
 else{sessionStates.delete(event.key);lastStored.delete(event.key);}
 window.dispatchEvent(new Event('declic:progress'));
});
function openCourse(){if(activeQuiz)DeclicCourses.open(activeQuiz,current()?.sources?.[0]);}
$('read-course').onclick=openCourse;$('quick-course').onclick=openCourse;
document.addEventListener('keydown',event=>{
 if(event.defaultPrevented||event.repeat||event.ctrlKey||event.metaKey||event.altKey||!s||$('quiz-screen').classList.contains('hidden')||document.querySelector('dialog[open]'))return;
 if(event.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
 if(event.code==='Space'&&!event.target.closest?.('button,a')&&!s.revealed&&current()){event.preventDefault();reveal();}
 else if(s.revealed&&(event.key==='1'||event.key==='2')){event.preventDefault();grade(event.key==='2');}
 else if(event.key.toLowerCase()==='c'&&globalThis.DeclicCourses?.available(activeQuiz)){event.preventDefault();openCourse();}
});
globalThis.DeclicQuiz={open,leave,progress,context};
})();
