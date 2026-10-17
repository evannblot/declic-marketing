const fs=require('node:fs'),path=require('node:path');
async function boot(seed={},options={}){
 const {Window}=await import(process.env.DEClic_DOM_MODULE||'happy-dom');const w=new Window({url:'https://declic-marketing.vercel.app/',settings:{disableIframePageLoading:true}});
 w.document.write(fs.readFileSync(path.join(options.dist||path.join(__dirname,'dist'),'index.html'),'utf8').replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/g,''));
 for(const [key,value]of Object.entries(seed))w.localStorage.setItem(key,value);
 if(options.storage)Object.defineProperty(w,'localStorage',{configurable:true,value:options.storage});
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 for(const f of ['courses.js','quizzes.js','engine.js','catalog.js','app.js','courses-ui.js','library.js'])w.eval(fs.readFileSync(path.join(options.dist||path.join(__dirname,'dist'),f),'utf8'));
 const $=id=>w.document.getElementById(id),click=id=>$(id).click(),input=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new w.Event('input'));};
 const snapshot=()=>{const result={};for(let i=0;i<w.localStorage.length;i++){const k=w.localStorage.key(i);result[k]=w.localStorage.getItem(k);}return result;};
 function submit(title,cards){click('add-quiz');input('builder-title',title);cards.forEach((c,i)=>{if(i)click('add-question');const row=$('question-rows').children[i];for(const k of ['question','answer','chapter'])row.querySelector('[data-field="'+k+'"]').value=c[k]||'';});$('builder-form').dispatchEvent(new w.Event('submit',{cancelable:true}));}
 return {w,$,click,input,snapshot,submit,close:()=>w.happyDOM.abort()};
}
module.exports={boot};
