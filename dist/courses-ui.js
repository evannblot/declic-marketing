(function(){
'use strict';
const $=id=>document.getElementById(id),byId=new Map(DECLIC_COURSES.map(d=>[d.id,d])),rememberedPages=new Map();
let selected=null,subject=null,requestedSource=null,opened=false,returnFocus=null,returnScroll=null,returnTitle='';
function idsFor(quiz){return [...new Set([...(quiz.documents||[]),...quiz.cards.flatMap(c=>(c.sources||[]).map(s=>s.documentId))])].filter(id=>byId.has(id));}
function available(quiz){return idsFor(quiz).length>0;}
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function jump(page){
 const n=Number.isInteger(page)?Math.min(Math.max(page,1),selected.pageCount):1;
 $('course-page-select').value=String(n);rememberedPages.set(selected.id,n);
 const url=selected.url+'#page='+n;
 if($('course-pdf').getAttribute('src')!==url)$('course-pdf').src=url;
 $('course-pdf-link').href=url;$('course-pdf-link').textContent='Ouvrir à la page '+n+' ↗';
 const isOrigin=requestedSource?.documentId===selected.id&&requestedSource?.page===n;
 $('course-location').textContent=(isOrigin?'Passage lié à ta question · ':'')+'Page '+n+' sur '+selected.pageCount;
 $('course-pdf').title=selected.title+' – page '+n;
 $('course-prev').disabled=n===1;$('course-next').disabled=n===selected.pageCount;
 $('course-origin').classList.toggle('hidden',!requestedSource||isOrigin);
}
function setDocument(id,page=1){
 selected=byId.get(id);if(!selected)return;$('course-document').value=id;$('course-page-select').replaceChildren();
 for(let n=1;n<=selected.pageCount;n++){const o=make('option','',String(n));o.value=String(n);$('course-page-select').appendChild(o);}
 $('course-title').textContent=selected.title;$('course-page-count').textContent=selected.pageCount+' pages · copie du document';
 $('course-download').href=selected.url;jump(page);
}
function open(quiz,source){
 const ids=idsFor(quiz);if(!ids.length)return;
 const validSource=source&&ids.includes(source.documentId)&&Number.isInteger(source.page)&&source.page>0&&source.page<=byId.get(source.documentId).pageCount;
 requestedSource=validSource?source:null;subject=quiz;
 if(!opened){returnFocus=document.activeElement;returnScroll={left:window.scrollX,top:window.scrollY};returnTitle=document.title;}
 const quizVisible=!$('quiz-screen').classList.contains('hidden'),context=quizVisible?DeclicQuiz.context():null;
 $('course-back-label').textContent=quizVisible?(context?.revealed?'← La correction':'← La question'):'← Revenir aux quiz';
 $('course-question-context').classList.toggle('hidden',!context);$('course-question').textContent=context?.question||'';
 $('course-document').replaceChildren();for(const id of ids){const d=byId.get(id),o=make('option','',d.title);o.value=id;$('course-document').appendChild(o);}
 $('course-document-field').classList.toggle('hidden',ids.length===1);
 const doc=requestedSource?.documentId||ids[0];setDocument(doc,requestedSource?.page||rememberedPages.get(doc)||1);
 $('course-subject').textContent=quiz.subjectTitle||quiz.title;$('course-screen').classList.remove('hidden');
 document.title='Déclic · Cours de '+(quiz.subjectTitle||quiz.title);document.body.classList.add('reader-open');
 if(!opened){opened=true;$('course-dialog').showModal();}
 $('course-back').focus({preventScroll:true});
}
function close({restore=true}={}){
 if(!opened)return;opened=false;$('course-dialog').close();$('course-screen').classList.add('hidden');document.body.classList.remove('reader-open');
 if(restore){document.title=returnTitle;
  const fallback=!$('quiz-screen').classList.contains('hidden')?$('question'):$('subject-title');
  (returnFocus?.isConnected?returnFocus:fallback).focus({preventScroll:true});
  if(returnScroll)window.scrollTo({...returnScroll,behavior:'auto'});
 }
}
function renderSources(host,sources,quiz,isCase=false){
 host.replaceChildren();const valid=(sources||[]).filter(s=>byId.has(s.documentId)&&Number.isInteger(s.page)&&s.page>0&&s.page<=byId.get(s.documentId).pageCount);
 host.classList.toggle('hidden',!valid.length);if(!valid.length)return;
 host.appendChild(make('h3','',isCase?'Les notions utiles dans ton cours':'Retrouver la réponse dans le cours'));
 for(const source of valid){const d=byId.get(source.documentId),section=make('div','source-reference');section.appendChild(make('p','source-location',d.title+' · page '+source.page));
  const button=make('button','btn ghost','Lire le passage · p. '+source.page);button.type='button';button.onclick=()=>open(quiz,source);section.appendChild(button);host.appendChild(section);
 }
}
$('course-back').onclick=()=>close();
$('course-dialog').addEventListener('cancel',event=>{event.preventDefault();close();});
$('course-dialog').addEventListener('close',()=>{if(opened)close();});
let backdropPress=false;
$('course-dialog').addEventListener('pointerdown',event=>{backdropPress=event.target===$('course-dialog');});
$('course-dialog').addEventListener('click',event=>{if(backdropPress&&event.target===$('course-dialog'))close();backdropPress=false;});
$('course-document').addEventListener('change',()=>setDocument($('course-document').value,rememberedPages.get($('course-document').value)||1));
$('course-page-select').addEventListener('change',()=>jump(Number($('course-page-select').value)));
$('course-prev').onclick=()=>jump(Number($('course-page-select').value)-1);
$('course-next').onclick=()=>jump(Number($('course-page-select').value)+1);
$('course-origin').onclick=()=>{if(requestedSource)setDocument(requestedSource.documentId,requestedSource.page);};
globalThis.DeclicCourses={available,open,close,renderSources};
})();
