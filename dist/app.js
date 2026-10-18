(function(){
'use strict';
const E=QuizEngine,$=id=>document.getElementById(id);const sessionStates=new Map(),blockedKeys=new Set(),lastStored=new Map();let cards=[],byId=new Map(),key='',filter=null,examOnly=false,s=null,resetAll=true,storageWorks=true,activeQuiz=null;
function fresh(){return {...E.initial([...E.shuffle(cards.filter(c=>c.priority).map(c=>c.id)),...E.shuffle(cards.filter(c=>!c.priority).map(c=>c.id))]),examOnly:activeQuiz?.examByDefault===true};}
function restoreFor(quiz,saved){const state=QuizCatalog.restore(saved,quiz.cards,quiz.legacyCardIds);if(state&&saved.queue.length+saved.mastered.length<quiz.cards.length&&quiz.examByDefault===true){const previousFilter=Object.hasOwn(saved,'chapterFilter')?saved.chapterFilter:(saved.filter&&saved.filter!=='all'?saved.filter:null);if(previousFilter===null){state.examOnly=true;state.revealed=false;state.draft='';}}return state;}
function readFilter(){filter=Object.hasOwn(s,'chapterFilter')?s.chapterFilter:(s.filter&&s.filter!=='all'?s.filter:null);const chapters=[...new Set(cards.map(c=>c.chapter))];if(filter!==null&&!chapters.includes(filter))filter=null;examOnly=cards.some(c=>c.priority)&&(typeof s.examOnly==='boolean'?s.examOnly:activeQuiz.examByDefault===true&&filter===null);if(examOnly){filter=null;if(!Object.hasOwn(s,'examOnly')){s.revealed=false;s.draft='';}}}
function selectFilter(){const chapters=[...new Set(cards.map(c=>c.chapter))];$('chapter').value=examOnly?'exam':filter===null?'all':'chapter-'+chapters.indexOf(filter);}
function matches(id){const card=byId.get(id);return !!card&&(filter===null||card.chapter===filter)&&(!examOnly||card.priority===true);}
function activeQueue(){return s.queue.filter(matches);}
function selectedCards(){return cards.filter(c=>matches(c.id));}
function save(){if(!s)return;syncExternal();s.filter=filter??'all';s.chapterFilter=filter;s.examOnly=examOnly;sessionStates.set(key,JSON.parse(JSON.stringify(s)));try{if(blockedKeys.has(key))throw new Error('Sauvegarde précédente protégée');const serialized=JSON.stringify(s);localStorage.setItem(key,serialized);lastStored.set(key,serialized);storageWorks=true;}catch{storageWorks=false;}$('save-status').textContent=storageWorks?'Progression sauvegardée':'Sauvegarde indisponible · garde cette page ouverte';}
function current(){return byId.get(activeQueue()[0]);}
function progress(quiz){try{return restoreFor(quiz,sessionStates.get(quiz.storageKey)||JSON.parse(localStorage.getItem(quiz.storageKey)))?.mastered.length||0;}catch{return 0;}}
function open(quiz){if(s)save();activeQuiz=quiz;cards=quiz.cards;byId=new Map(cards.map(c=>[c.id,c]));key=quiz.storageKey;filter=null;examOnly=false;s=null;
 let recovered=false;
 try{const raw=localStorage.getItem(key);if(lastStored.has(key)&&lastStored.get(key)!==raw)sessionStates.delete(key);lastStored.set(key,raw);s=restoreFor(quiz,sessionStates.get(key)||(raw?JSON.parse(raw):null));
  if(!s&&raw!==null){try{localStorage.setItem(key+'-recovery',raw);recovered=true;}catch{blockedKeys.add(key);storageWorks=false;}}
 }catch{storageWorks=false;try{const raw=localStorage.getItem(key);if(raw!==null){localStorage.setItem(key+'-recovery',raw);recovered=true;}}catch{blockedKeys.add(key);}}
 if(!s&&sessionStates.has(key))s=restoreFor(quiz,sessionStates.get(key));if(!s)s=fresh();readFilter();
 const chapters=[...new Set(cards.map(c=>c.chapter))];
 $('chapter').replaceChildren();const all=document.createElement('option');all.value='all';all.textContent='Toutes les questions';$('chapter').appendChild(all);if(cards.some(c=>c.priority)){const exam=document.createElement('option');exam.value='exam';exam.textContent='Essentiels du partiel';$('chapter').appendChild(exam);}for(const [index,chapter] of chapters.entries()){const o=document.createElement('option');o.value='chapter-'+index;o.textContent=chapter;$('chapter').appendChild(o);}selectFilter();
 $('quiz-subject').textContent=quiz.title;$('quiz-description').textContent=quiz.description;$('reset').textContent='Recommencer toute cette matière';$('toast').textContent='';document.title='Déclic · '+quiz.title;$('read-course').classList.toggle('hidden',!globalThis.DeclicCourses?.available(quiz));render();if(recovered)$('toast').textContent='La sauvegarde précédente était endommagée. Une copie a été conservée avant de recommencer.';}
function syncExternal(){
 if(!s||!lastStored.has(key)||blockedKeys.has(key))return false;
 try{const raw=localStorage.getItem(key);if(raw===lastStored.get(key))return false;lastStored.set(key,raw);
  const latest=raw===null?fresh():restoreFor(activeQuiz,JSON.parse(raw));if(!latest)return false;
  s=latest;sessionStates.set(key,JSON.parse(JSON.stringify(s)));readFilter();selectFilter();return true;
 }catch{return false;}
}
function changedElsewhere(){if(!syncExternal())return false;render();$('toast').textContent='La progression a changé dans un autre onglet. La question a été actualisée.';return true;}
function leave(){save();activeQuiz=null;s=null;}

function render(focus=false){const ids=activeQueue(),selected=selectedCards(),m=s.mastered.filter(matches).length,pct=Math.round(m/selected.length*100)||0;
 $('percent').textContent=pct+' %';$('progressbar').setAttribute('aria-valuenow',pct);$('fill').style.width=pct+'%';$('mastered').textContent=String(m);$('total').textContent=selected.length;$('remaining').textContent=ids.length;$('wrong').textContent=String(s.history.filter(x=>!x.good&&matches(x.id)).length);
 const n=new Set(cards.map(c=>c.chapter)).size;$('scope').textContent=selected.length+' questions · '+(examOnly?'essentiels du partiel':filter===null?n+' chapitre'+(n>1?'s':''):'ce chapitre');$('attempts').textContent=s.history.filter(x=>matches(x.id)).length+' réponses évaluées · '+m+' bonnes réponses';$('quiz').classList.toggle('hidden',!ids.length);$('finished').classList.toggle('hidden',!!ids.length);
 if(!ids.length){$('finish-text').textContent=`Tu as réussi les ${selected.length} questions de ${examOnly?'la sélection du partiel':filter===null?'cette matière':'ce chapitre'}. Elles sont toutes mises de côté.`;save();return;}
 const c=current();$('topic').textContent=c.chapter;$('session-count').textContent=ids.length+' à travailler';$('question').textContent=c.question;
 // Do not put correction text in the visible DOM before it has been requested.
 $('correction').textContent=s.revealed?c.answer.replace(/^\* /gm,'• '):'';if(globalThis.DeclicCourses)DeclicCourses.renderSources($('answer-sources'),s.revealed?c.sources:[],activeQuiz);$('reveal-actions').classList.toggle('hidden',!!s.revealed);$('correction-zone').classList.toggle('hidden',!s.revealed);save();if(focus)$('question').focus();}
function reveal(){if(changedElsewhere())return;if(!s||s.revealed||!current())return;s.draft='';s.revealed=true;render();$('correction-zone').scrollIntoView({behavior:'smooth',block:'nearest'});}
function grade(good){if(changedElsewhere())return;if(!s||!s.revealed||!current())return;const scoped={...s,queue:activeQueue(),mastered:[...s.mastered],history:[...s.history]};const next=E.grade(scoped,good),other=s.queue.filter(id=>!matches(id));s={...next,queue:[...next.queue,...other]};render(true);$('toast').textContent=good?'Bien joué. Cette question est mise de côté.':next.queue.length>1?'On la reverra après '+Math.min(3,next.queue.length-1)+' autre(s) question(s).':'Il ne reste que cette question. Prends un instant, puis réessaie.';}
$('chapter').addEventListener('change',()=>{if(!s||changedElsewhere())return;const value=$('chapter').value;examOnly=value==='exam';filter=value==='all'||examOnly?null:[...new Set(cards.map(c=>c.chapter))][Number(value.replace('chapter-',''))];if(filter===undefined)filter=null;s.draft='';s.revealed=false;$('toast').textContent='';render();});$('reveal').onclick=()=>reveal();$('dont-know').onclick=()=>reveal();$('good').onclick=()=>grade(true);$('bad').onclick=()=>grade(false);
function askReset(all){resetAll=all;$('reset-dialog').querySelector('p').textContent=all?'Toutes les questions et tous les compteurs de cette matière seront réinitialisés. Les autres matières seront conservées.':'Les questions et compteurs de cette sélection seront réinitialisés. Les autres questions seront conservées.';$('reset-dialog').showModal();}
$('reset').onclick=()=>askReset(true);$('restart-filter').onclick=()=>askReset(filter===null&&!examOnly);$('cancel-reset').onclick=()=>$('reset-dialog').close();$('confirm-reset').onclick=()=>{if(!s)return;if(resetAll){s=fresh();filter=null;examOnly=false;$('chapter').value='all';}else{const ids=selectedCards().map(c=>c.id);s.queue=[...E.shuffle(ids),...s.queue.filter(id=>!matches(id))];s.mastered=s.mastered.filter(id=>!matches(id));s.history=s.history.filter(x=>!matches(x.id));s.attempts=s.history.length;s.wrong=s.history.filter(x=>!x.good).length;s.draft='';s.revealed=false;}$('reset-dialog').close();$('toast').textContent='Nouvelle session, on y va !';render(true);};
window.addEventListener('storage',event=>{
 if(!event.key||event.key==='declic-library-v1'||!event.key.startsWith('declic-')||event.key.includes('-recovery'))return;
 if(event.key===key&&s){if(syncExternal()){render();$('toast').textContent='Progression mise à jour depuis un autre onglet.';}}
 else{sessionStates.delete(event.key);lastStored.delete(event.key);}
 window.dispatchEvent(new Event('declic:progress'));
});
$('read-course').onclick=()=>{if(activeQuiz)DeclicCourses.open(activeQuiz,current()?.sources?.[0]);};
globalThis.DeclicQuiz={open,leave,progress};
})();
