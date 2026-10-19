const {chromium}=require(process.env.DEClic_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.DEClic_BASE_URL||'http://127.0.0.1:8778',output=process.env.DEClic_QA_DIR||path.join(__dirname,'qa-fluid');
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({headless:true,channel:'chromium'});
 try{
 const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],assets=[];
 p.on('pageerror',error=>errors.push(error.message));p.on('response',response=>{if(new URL(response.url()).origin===new URL(base).origin&&!response.url().includes('favicon'))assets.push({url:response.url(),status:response.status()});});
 await p.goto(base);await p.locator('[data-subject-id="communication"] .choose-subject').click();
 await p.evaluate(()=>{const q=DEClic_BUILTINS.find(q=>q.id==='communication-essentiel'),id='communication-concept-062';localStorage.setItem(q.storageKey,JSON.stringify(QuizEngine.initial([id,...q.cards.filter(c=>c.id!==id).map(c=>c.id)])));});
 await p.locator('[data-quiz-id="communication-essentiel"] .start-quiz').click();const question=await p.locator('#question').innerText();
 async function visibleInViewport(selector){await p.waitForFunction(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return r.width>0&&r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;},selector,{timeout:5000});const b=await p.locator(selector).boundingBox(),v=p.viewportSize();assert(b&&b.x>=0&&b.y>=0&&b.x+b.width<=v.width+1&&b.y+b.height<=v.height+1,selector+' doit rester visible');}
 await visibleInViewport('#reveal');await p.screenshot({path:path.join(output,'desktop-question.png')});
 await p.keyboard.press('Space');await p.locator('#correction-zone:not(.hidden)').waitFor();const correction=await p.locator('#correction').innerText();await visibleInViewport('#good');await visibleInViewport('#bad');
 await p.screenshot({path:path.join(output,'desktop-correction.png')});
 const source=p.locator('#answer-sources button').first();await source.scrollIntoViewIfNeeded();const beforeRead=await p.evaluate(()=>scrollY);const pdfResponse=p.waitForResponse(r=>r.url().endsWith('/courses/com-partiel.pdf')&&r.status()===200);await source.click();await pdfResponse;
 assert(await p.locator('#course-dialog').evaluate(d=>d.open));assert.equal(await p.locator('#course-page-select').inputValue(),'10');assert.equal(await p.locator('#course-question').innerText(),question);await visibleInViewport('#course-back');
 await p.locator('#course-next').click();assert.equal(await p.locator('#course-page-select').inputValue(),'11');await p.locator('#course-origin').click();assert.equal(await p.locator('#course-page-select').inputValue(),'10');
 await p.waitForTimeout(1200);await p.screenshot({path:path.join(output,'desktop-reader.png')});await p.locator('#course-back').focus();await p.keyboard.press('Escape');assert(!(await p.locator('#course-dialog').evaluate(d=>d.open)));assert.equal(await p.locator('#question').innerText(),question);assert.equal(await p.locator('#correction').innerText(),correction);assert(Math.abs(await p.evaluate(()=>scrollY)-beforeRead)<=2);
 await p.locator('#bad').click();assert.equal(await p.locator('#wrong').innerText(),'1');await visibleInViewport('#undo-grade');await p.locator('#undo-grade').click();assert.equal(await p.locator('#wrong').innerText(),'0');assert.equal(await p.locator('#question').innerText(),question);assert.equal(await p.locator('#correction').innerText(),correction);
 await p.keyboard.press('2');assert.equal(await p.locator('#mastered').innerText(),'1');await p.reload();await p.locator('[data-subject-id="communication"] .choose-subject').click();await p.locator('[data-quiz-id="communication-essentiel"] .start-quiz').click();assert.equal(await p.locator('#mastered').innerText(),'1');
 await p.setViewportSize({width:390,height:844});await p.locator('#home-button').click();
 await p.evaluate(()=>{const q=DEClic_BUILTINS.find(q=>q.id==='communication-cas'),id='communication-cas-008';localStorage.setItem(q.storageKey,JSON.stringify(QuizEngine.initial([id,...q.cards.filter(c=>c.id!==id).map(c=>c.id)])));});
 await p.locator('[data-quiz-id="communication-cas"] .start-quiz').click();assert(await p.locator('#case-context').isVisible());assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await visibleInViewport('#reveal');await p.screenshot({path:path.join(output,'mobile-question.png')});
 await p.locator('#reveal').click();await visibleInViewport('#bad');await visibleInViewport('#good');await p.screenshot({path:path.join(output,'mobile-correction.png')});const mobileQuestion=await p.locator('#question').innerText(),mobileCorrection=await p.locator('#correction').innerText();
 await p.locator('#quick-course').click();assert.equal(await p.locator('#course-page-select').inputValue(),'5');await visibleInViewport('#course-back');const frame=await p.locator('#course-pdf').boundingBox();assert(frame.height>400);await p.waitForTimeout(1200);await p.screenshot({path:path.join(output,'mobile-reader.png')});
 await p.setViewportSize({width:320,height:568});await visibleInViewport('#course-back');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert((await p.locator('#course-pdf').boundingBox()).height>230);await p.screenshot({path:path.join(output,'small-reader.png')});
 await p.locator('#course-back').click();assert.equal(await p.locator('#question').innerText(),mobileQuestion);assert.equal(await p.locator('#correction').innerText(),mobileCorrection);await visibleInViewport('#good');await p.screenshot({path:path.join(output,'small-correction.png')});
 assert.deepEqual(errors,[]);assert(assets.every(a=>a.status<400),JSON.stringify(assets.filter(a=>a.status>=400)));
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({base,viewports:['1440×1000','390×844','320×568'],passed:true,consoleErrors:errors,assets},null,2));
 console.log('PASS navigateur : boutons visibles, correction longue, lecteur PDF chargé, retour exact, pages, raccourcis, annulation, sauvegarde et absence de débordement sur trois formats.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
