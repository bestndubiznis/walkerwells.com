/* Deterministic encounter rules, shared by the browser and regression tests. */
(function(root){
  const bearings=[315,90,225];
  const wrap=angle=>((angle%360)+360)%360;
  const distance=(a,b)=>Math.abs(((wrap(a)-wrap(b)+540)%360)-180);
  class Sentinel {
    constructor(unhurried=false){this.unhurried=unhurried;this.phase='idle';this.round=0;this.guard=null;this.result=null;this.deadline=0;this.lanes=['left','high','right']}
    start(now){this.round=0;this.guard=null;this.phase='windup';this.result=null;this.deadline=now+1900}
    get lane(){return this.lanes[this.round]}
    choose(lane,now){
      if(!this.lanes.includes(lane)||this.phase!=='windup')return false;
      this.guard=lane;
      if(this.unhurried)this.resolve(now);
      return true;
    }
    resolve(now){
      if(this.phase!=='windup')return;
      this.result=this.guard===this.lane?'parry':'miss';
      if(this.result==='parry')this.round++;
      this.phase=this.round===3?'won':'recovery';this.deadline=now+1100;
    }
    advance(now){
      if(this.phase==='windup'&&!this.unhurried&&now>=this.deadline)this.resolve(now);
      else if(this.phase==='recovery'&&now>=this.deadline){this.phase='windup';this.guard=null;this.result=null;this.deadline=now+1700}
      return this.phase;
    }
  }
  class CompassRoute {
    constructor(){this.step=0;this.angle=0}
    turn(angle){if(Number.isFinite(angle))this.angle=wrap(angle)}
    get target(){return bearings[this.step]}
    get aligned(){return this.step<bearings.length&&distance(this.angle,this.target)<=7}
    confirm(){if(!this.aligned)return false;this.step++;return true}
    get complete(){return this.step===bearings.length}
  }
  const rules={Sentinel,CompassRoute,wrap,distance};
  if(typeof module!=='undefined'&&module.exports)module.exports=rules;
  else root.EstateEncounters=rules;
})(typeof window!=='undefined'?window:this);
