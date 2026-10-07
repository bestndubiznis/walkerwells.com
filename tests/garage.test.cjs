const {test}=require('node:test');
const assert=require('node:assert/strict');
const {RoadRun,TrailRun,ground}=require('../garage-physics.js');
function advance(game,seconds,input={}){for(let i=0;i<seconds*120;i++)game.step(1/120,input)}
test('road waits for start, pauses without losing time, and resumes',()=>{
 const g=new RoadRun();advance(g,2);assert.equal(g.distance,0);g.start();advance(g,2);const d=g.distance,t=g.time;g.pause();advance(g,5,{gas:true});assert.equal(g.distance,d);assert.equal(g.time,t);g.resume();advance(g,1);assert.ok(g.distance>d);
});
test('throttle is faster than cruise and braking slows the car',()=>{
 const cruise=new RoadRun(),gas=new RoadRun();cruise.start();gas.start();advance(cruise,4);advance(gas,4,{gas:true});assert.ok(gas.speed>cruise.speed);const speed=gas.speed;advance(gas,1,{brake:true});assert.ok(gas.speed<speed);
});
test('a swept pass collides once and grants temporary contact protection',()=>{
 const g=new RoadRun();g.start();g.speed=100;g.traffic=[{z:.01,x:0,speed:40},{z:.02,x:0,speed:40}];g.step(1/120);assert.equal(g.health,2);assert.ok(g.invincible>0);advance(g,.1);assert.equal(g.health,2);
});
test('close passes reward precision while distant passes do not build a combo',()=>{
 const g=new RoadRun();g.start();g.speed=100;g.traffic=[{z:.01,x:.32,speed:40},{z:.02,x:-.6,speed:40}];g.step(1/120);assert.equal(g.near,1);assert.equal(g.combo,1);assert.equal(g.health,3);assert.ok(g.score>=125);
});
test('checkpoints add time once and a completed road run cannot keep scoring',()=>{
 const g=new RoadRun();g.start();g.distance=999.9;g.speed=100;g.step(1/120);assert.equal(g.checkpoint,1);assert.ok(g.time>86);const time=g.time;g.step(1/120);assert.ok(g.time<time);g.distance=2999.9;g.step(1/120);assert.equal(g.won,true);const score=g.score;advance(g,2);assert.equal(g.score,score);
});
test('the bike can complete the authored trail with gas and neutral balance',()=>{
 const g=new TrailRun();g.start();advance(g,30,{gas:true});assert.equal(g.phase,'finished');assert.equal(g.won,true);assert.ok(g.stuntScore>0);assert.ok(g.distance>=368);
});
test('undershooting a gap ends the run instead of falling forever or snapping to the far edge',()=>{
 const g=new TrailRun();g.start();advance(g,30,{brake:true});assert.equal(g.phase,'finished');assert.equal(!!g.won,false);assert.ok(g.x<1000);assert.equal(ground(730),null);
});
test('bike pause preserves position and airborne balance is independent of gas',()=>{
 const g=new TrailRun();g.start();g.airborne=true;g.y=200;g.vy=100;advance(g,.2,{lean:1});assert.ok(g.angle>0);const angle=g.angle,x=g.x;g.pause();advance(g,2,{lean:-1});assert.equal(g.x,x);assert.equal(g.angle,angle);g.resume();advance(g,.2,{lean:-1});assert.ok(g.omega<1);
});
test('a controlled rotation and release can land full flips and finish the trail',()=>{
 const g=new TrailRun();g.start();for(let i=0;i<3600&&g.phase==='running';i++)g.step(1/120,{gas:true,lean:g.airborne&&g.airtime<.6?1:0});assert.equal(g.won,true);assert.ok(g.flips>=1);
});
