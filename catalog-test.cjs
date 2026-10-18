const assert=require('node:assert/strict'),{QuizCatalog:C}=require('./dist/catalog.js'),{QuizEngine:E}=require('./dist/engine.js');
const cards=[{id:'a',chapter:'A',question:'Question ?',answer:'Réponse'}];
assert.equal(C.normalizeQuiz({title:'Test',cards}).title,'Test');assert.equal(C.normalizeQuiz([[1,'Q','R']],'Autre').cards[0].chapter,'1');assert.throws(()=>C.normalizeQuiz({title:'',cards}));assert.throws(()=>C.normalizeQuiz({title:'T',cards:[]}));assert.throws(()=>C.validateCards([...cards,...cards]));assert.throws(()=>C.validateCards([{question:'Q',answer:''}]));
const state=E.initial(['a']);state.draft='Brouillon';assert.equal(C.restore(state,cards).draft,'Brouillon');assert.equal(C.restore({...state,history:null},cards),null);assert.equal(C.restore({...state,queue:['a','a']},cards),null);assert.equal(C.restore({...state,queue:['absent']},cards),null);assert.equal(C.restore({...state,history:[{id:'missing',good:true}]},cards),null);
console.log('PASS catalogue : validation des imports, identifiants, contenu, restauration et état corrompu.');
// Growth is allowed only from the explicitly known previous bank, without resetting results.
const previous=E.initial(['a','b']);previous.revealed=true;const learned=E.grade(previous,true);learned.revealed=true;
const expanded=[...cards,{id:'b',question:'Q2',answer:'R2'},{id:'c',question:'Q3',answer:'R3',priority:true}];
const migrated=C.restore(learned,expanded,['a','b']);assert.deepEqual(migrated.queue,['b','c']);assert.deepEqual(migrated.mastered,['a']);assert.equal(migrated.revealed,true);assert.equal(migrated.attempts,1);assert.equal(C.restore(learned,expanded),null);assert.equal(C.restore({...learned,queue:[]},expanded,['a','b']),null);
assert.deepEqual(C.normalizeQuiz({title:'PDF',cards:[{question:'Q',answer:'R',priority:true,sources:[{documentId:'com',page:16}]}]}).cards[0].sources,[{documentId:'com',page:16}]);
assert.equal(C.normalizeQuiz({title:'Priorités',cards:[{question:'Q',answer:'R',priority:true}]}).cards[0].priority,true);
console.log('PASS migration : résultats conservés, ajout des nouvelles questions, refus des sauvegardes incomplètes et références PDF sans retranscription.');
assert.equal(C.restore({version:1,queue:[],mastered:[],history:[]},cards),null);
assert.equal(C.normalizeQuiz({title:'Formules',subjectTitle:'Marketing',cards}).subjectTitle,'Marketing');
assert.throws(()=>C.normalizeQuiz({title:'Quiz',subjectTitle:'x'.repeat(101),cards}));
