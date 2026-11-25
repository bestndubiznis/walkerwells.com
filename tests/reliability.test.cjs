const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8'),systems=fs.readFileSync('estate-systems.js','utf8'),enhancements=fs.readFileSync('enhancements.js','utf8');
test('all legacy outfit names normalize to the same selection and web reward',()=>{
 const source=app.slice(app.indexOf('function canonicalSuit'),app.indexOf('function renderSuits'));
 const rewards=[];const context={state:{},save(){},renderSuits(){},toast(){},collect(id){rewards.push(id)}};vm.createContext(context);vm.runInContext(source,context);
 for(const [old,name] of [['WEB SUIT','SPIDER SUIT'],['FIELD OPERATIVE','DINNER JACKET'],['COWBOY RIG','WESTERN'],['DIVE RIG','WETSUIT']]){context.equipSuit(old);assert.equal(context.state.suit,name)}assert.deepEqual(rewards,['spider-mask']);
 context.equipSuit('SPIDER SUIT');assert.equal(rewards[1],'spider-mask');
});
for(const [name,source,end] of [['ping',systems,'  function completeMoonGame'],['playTone',enhancements,'  function openPiano']])test(name+' never constructs audio while muted',()=>{
 let calls=0;const context={state:{sound:false},window:{AudioContext:function(){calls++}}};vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf('function '+name),source.indexOf(end)),context);
 context[name](440);assert.equal(calls,0);
});
