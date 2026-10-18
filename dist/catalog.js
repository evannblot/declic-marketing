(function(root){
'use strict';
function validateCards(data){
 if(!Array.isArray(data)||!data.length||data.length>2000)throw new Error('Le quiz doit contenir entre 1 et 2 000 questions.');
 const reserved=new Set(data.filter(r=>r&&typeof r==='object'&&!Array.isArray(r)&&typeof r.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(r.id)).map(r=>r.id));
 const ids=new Set();return data.map((row,i)=>{
  if(Array.isArray(row))row={chapter:String(row[0]||'Général'),question:row[1],answer:row[2]};
  if(!row||typeof row!=='object')throw new Error('La question '+(i+1)+' est invalide.');
  const question=row.question,answer=row.answer??row.correction;
  if(typeof question!=='string'||!question.trim()||question.length>10000||typeof answer!=='string'||!answer.trim()||answer.length>40000)throw new Error('Question '+(i+1)+' : ajoute une question et sa correction (texte).');
  let id=typeof row.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(row.id)?row.id:'q'+(i+1);
  if(!(typeof row.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(row.id))){let suffix=1;while(ids.has(id)||reserved.has(id))id='generated-'+(i+1)+'-'+suffix++;}
  if(ids.has(id))throw new Error('Chaque question doit avoir un identifiant différent.');ids.add(id);
  const sources=Array.isArray(row.sources)?row.sources.filter(s=>s&&typeof s.documentId==='string'&&/^[a-z0-9-]{1,60}$/.test(s.documentId)&&Number.isInteger(s.page)&&s.page>0&&s.page<=500).slice(0,5).map(s=>({documentId:s.documentId,page:s.page,...(typeof s.excerpt==='string'?{excerpt:s.excerpt.slice(0,5000)}:{}),...(typeof s.highlight==='string'?{highlight:s.highlight.slice(0,300)}:{})})):[];
  return {id,chapter:typeof row.chapter==='string'&&row.chapter.trim()?row.chapter.trim().slice(0,150):'Général',question:question.trim(),answer:answer.trim(),...(row.priority===true?{priority:true}:{}),...(sources.length?{sources}:{})};
 });
}
function normalizeQuiz(data,fallbackTitle='Mon quiz'){
 const cards=validateCards(Array.isArray(data)?data:data?.cards??data?.questions);
 const title=Array.isArray(data)?fallbackTitle:data?.title??data?.name??fallbackTitle;
 if(typeof title!=='string'||!title.trim()||title.length>100)throw new Error('Indique un nom de matière (100 caractères maximum).');
 const subjectTitle=data?.subjectTitle;if(subjectTitle!==undefined&&(typeof subjectTitle!=='string'||!subjectTitle.trim()||subjectTitle.length>100))throw new Error('Indique un nom de matière (100 caractères maximum).');
 return {title:title.trim(),...(subjectTitle?{subjectTitle:subjectTitle.trim()}:{}),description:typeof data?.description==='string'?data.description.slice(0,300):'Un quiz personnel pour progresser à ton rythme.',cards};
}
function restore(saved,cards,legacyCardIds=[]){
 if(!saved||saved.version!==1||!Array.isArray(saved.queue)||!Array.isArray(saved.mastered))return null;
 const set=new Set(cards.map(c=>c.id)),all=[...saved.queue,...saved.mastered];
 if(new Set(all).size!==all.length||!all.every(x=>set.has(x)))return null;
 if(all.length!==set.size){const previous=new Set(legacyCardIds);if(!legacyCardIds.length||previous.size!==legacyCardIds.length||previous.size!==all.length||!all.every(x=>previous.has(x))||!legacyCardIds.every(x=>set.has(x)))return null;}
 if(!Array.isArray(saved.history)||!saved.history.every(x=>x&&set.has(x.id)&&typeof x.good==='boolean'))return null;
 const known=new Set(all),added=cards.filter(c=>!known.has(c.id)).map(c=>c.id);
 return {...saved,queue:[...saved.queue,...added],attempts:saved.history.length,wrong:saved.history.filter(x=>!x.good).length,draft:typeof saved.draft==='string'?saved.draft:'',revealed:saved.queue.length>0&&saved.revealed===true,filter:typeof saved.filter==='string'?saved.filter:'all'};
}
root.QuizCatalog={validateCards,normalizeQuiz,restore};
})(typeof module!=='undefined'?module.exports:globalThis);
