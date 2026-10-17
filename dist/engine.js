(function(root){
'use strict';
function initial(ids){return {version:1,queue:[...ids],mastered:[],attempts:0,wrong:0,draft:'',revealed:false,history:[]};}
function grade(s,good){if(!s.revealed||!s.queue.length)return s;const next=JSON.parse(JSON.stringify(s));const id=next.queue.shift();next.attempts++;next.history.push({id,good});if(good){if(!next.mastered.includes(id))next.mastered.push(id);}else{next.wrong++;next.queue.splice(Math.min(3,next.queue.length),0,id);}next.draft='';next.revealed=false;return next;}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
root.QuizEngine={initial,grade,shuffle};
})(typeof module!=='undefined'?module.exports:globalThis);
