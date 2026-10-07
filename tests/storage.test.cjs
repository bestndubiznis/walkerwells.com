const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const code=readFileSync(require('node:path').join(__dirname,'../storage.js'),'utf8');
function setup(storage){
  const window={localStorage:storage,sessionStorage:storage};
  vm.runInNewContext(code,{window,Map});
  return window.WellsStorage;
}
test('reads and writes persistent progress',()=>{
  const data=new Map();
  const store=setup({getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)});
  store.setItem('outfit','RACE SUIT');assert.equal(store.getItem('outfit'),'RACE SUIT');
  assert.equal(data.get('outfit'),'RACE SUIT');store.removeItem('outfit');assert.equal(store.getItem('outfit'),null);
});
test('blocked browser storage falls back to visit memory',()=>{
  const store=setup({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}});
  assert.equal(store.getItem('progress'),null);store.setItem('progress','found');
  assert.equal(store.getItem('progress'),'found');assert.equal(store.available,false);
  store.removeItem('progress');assert.equal(store.getItem('progress'),null);
});
test('a quota failure preserves previously read and newly written progress',()=>{
  const store=setup({getItem:()=> 'existing',setItem(){throw Error('quota')}});
  assert.equal(store.getItem('earlier'),'existing');store.setItem('new','discovery');
  assert.equal(store.getItem('earlier'),'existing');assert.equal(store.getItem('new'),'discovery');
});
test('malformed JSON and missing values return a usable fallback',()=>{
  const store=setup({getItem:k=>k==='broken'?'{':null});
  const fallback=[];assert.equal(store.readJSON('broken',fallback),fallback);
  assert.equal(store.readJSON('missing',fallback),fallback);
});
