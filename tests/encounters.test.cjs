const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Sentinel,CompassRoute,wrap,distance}=require('../encounter-rules.js');
test('a correct guard resolves only when the incoming strike lands',()=>{
  const knight=new Sentinel();knight.start(0);knight.choose('left',100);
  assert.equal(knight.advance(1899),'windup');assert.equal(knight.round,0);
  assert.equal(knight.advance(1900),'recovery');assert.equal(knight.result,'parry');assert.equal(knight.round,1);
});
test('a missed guard repeats the same strike without removing earned progress',()=>{
  const knight=new Sentinel();knight.start(0);knight.choose('right',10);knight.advance(1900);
  assert.equal(knight.result,'miss');assert.equal(knight.round,0);
  knight.advance(3000);assert.equal(knight.lane,'left');assert.equal(knight.guard,null);
});
test('three different parries finish the encounter and ignore extra inputs',()=>{
  const knight=new Sentinel(true);knight.start(0);
  for(const [i,lane] of ['left','high','right'].entries()){
    knight.choose(lane,i*2000);if(i<2)knight.advance(i*2000+1100);
  }
  assert.equal(knight.phase,'won');assert.equal(knight.round,3);
  assert.equal(knight.choose('left',10000),false);knight.advance(10000);assert.equal(knight.round,3);
});
test('unhurried mode has no time limit and can be restarted',()=>{
  const knight=new Sentinel(true);knight.start(0);knight.advance(999999);
  assert.equal(knight.phase,'windup');knight.choose('left',999999);assert.equal(knight.round,1);
  knight.start(1000000);assert.equal(knight.round,0);assert.equal(knight.guard,null);
});
test('compass alignment wraps through north and rejects invalid angles',()=>{
  assert.equal(wrap(-45),315);assert.equal(distance(359,1),2);
  const compass=new CompassRoute();compass.turn(-45);assert.equal(compass.aligned,true);
  compass.turn(NaN);assert.equal(compass.angle,315);
});
test('compass requires all three bearings in order and awards once',()=>{
  const compass=new CompassRoute();assert.equal(compass.confirm(),false);
  for(const angle of [315,90,225]){compass.turn(angle+6);assert.equal(compass.confirm(),true)}
  assert.equal(compass.complete,true);assert.equal(compass.confirm(),false);
});
