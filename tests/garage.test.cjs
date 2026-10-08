const {test}=require('node:test');
const assert=require('node:assert/strict');
const {RoadRun,TrailRun,FlipTracker,courses,ground}=require('../garage-physics.js');
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
test('checkpoints keep extending the clock beyond the old finish line, once per gate',()=>{
 const g=new RoadRun();g.start();g.speed=100;
 for(let n=1;n<=8;n++){g.distance=n*750-.1;const before=g.time;g.step(1/120);assert.equal(g.checkpoint,n);assert.ok(g.time>before+17);const time=g.time;g.step(1/120);assert.ok(g.time<time)}
 assert.equal(g.phase,'running');assert.equal(g.nextCheckpoint,6750);
});
test('missing the checkpoint ends the run when time expires and stops scoring',()=>{
 const g=new RoadRun();g.start();g.time=.01;advance(g,.1);assert.equal(g.phase,'finished');assert.equal(g.reason,'Out of time.');const score=g.score;advance(g,5);assert.equal(g.score,score);
});
test('traffic approaches faster and spawns more often as survival time grows, even when braking',()=>{
 const young=new RoadRun(),old=new RoadRun();young.start();old.start();old.elapsed=120;
 assert.ok(old.trafficPace>young.trafficPace);assert.ok(old.spawnInterval<young.spawnInterval);
 for(const g of [young,old]){g.traffic=[{z:100,x:0,speed:50}];g.step(1/120,{brake:true})}
 assert.ok(old.traffic[0].z<young.traffic[0].z);assert.ok(young.traffic[0].z<100);
 old.pause();const pace=old.trafficPace;advance(old,10);assert.equal(old.trafficPace,pace);
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

for(const angle of [1.3,-1.3,Math.PI*2+1.3])test('wheel-first landing can be saved at angle '+angle,()=>{
 const g=new TrailRun();g.start();Object.assign(g,{x:150,y:47,vx:20,vy:-100,airborne:true,angle,omega:7,airSpin:angle,airtime:.8});
 g.trick.add(angle);
 advance(g,.08);assert.equal(g.phase,'running');assert.equal(g.airborne,false);assert.equal(g.recovering,true);
 advance(g,.6);assert.equal(g.phase,'running');assert.ok(Math.abs(Math.atan2(Math.sin(g.angle),Math.cos(g.angle)))<.2);
 if(angle>6)assert.ok(g.flips>=1);
});
test('an inverted rider-first landing still crashes',()=>{
 const g=new TrailRun();g.start();Object.assign(g,{x:150,y:45,vx:20,vy:-100,airborne:true,angle:Math.PI,omega:0});advance(g,.15);assert.equal(g.phase,'finished');assert.equal(g.reason,'Frame or rider down.');
});
test('missing a gate on the shoulder does not grant time later',()=>{
 const g=new RoadRun();g.start();g.speed=100;g.distance=749.9;g.x=1.1;const time=g.time;g.step(1/120);assert.equal(g.checkpoint,1);assert.ok(g.time<time);g.x=0;g.step(1/120);assert.ok(g.time<time);assert.equal(g.nextCheckpoint,1500);
});

test('completed flips survive counter-steering and count both directions',()=>{
 const t=new FlipTracker(),turn=Math.PI*2;
 t.add(turn);t.add(-.5);assert.equal(t.total,1);
 t.add(.5);assert.equal(t.total,1);
 t.add(-turn);assert.equal(t.total,2);assert.equal(t.back,1);assert.equal(t.front,1);
});
test('partial rocking does not create flips, and multiple rotations count exactly',()=>{
 const t=new FlipTracker();for(let i=0;i<20;i++){t.add(3);t.add(-3)}assert.equal(t.total,0);
 t.add(Math.PI*4);assert.equal(t.total,2);t.add(.1);assert.equal(t.total,2);
});
for(const course of courses)test(course.name+' is finishable and uses its own terrain',()=>{
 const g=new TrailRun(course.id);g.start();advance(g,40,{gas:true});
 assert.equal(g.won,true,g.reason+' at '+g.x);assert.ok(g.x>=course.end);
 const done=g.score;advance(g,1);assert.equal(g.score,done);
});
test('a completed flip is banked once on a safe wheel landing',()=>{
 const g=new TrailRun();g.start();Object.assign(g,{x:150,y:47,vx:20,vy:-100,airborne:true,angle:1.3,omega:0,airtime:.8});g.trick.add(Math.PI*2);g.trick.add(-.2);
 advance(g,.08);assert.equal(g.flips,1);advance(g,.6);assert.equal(g.flips,1);
});
test('a rider-first crash does not bank completed airborne flips',()=>{
 const g=new TrailRun();g.start();Object.assign(g,{x:150,y:45,vx:20,vy:-100,airborne:true,angle:Math.PI,omega:0});g.trick.add(Math.PI*2);
 advance(g,.15);assert.equal(g.phase,'finished');assert.equal(g.flips,0);
});
