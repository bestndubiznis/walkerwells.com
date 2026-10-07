/* Deterministic garage simulation; rendering and input live in separate modules. */
(function(root){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const norm=a=>Math.atan2(Math.sin(a),Math.cos(a));
  const cars={
    race:{name:'FERRARI',title:'The last light.',route:'COAST ROAD',max:160,cruise:100,grip:1.05,color:'#b64c39',sky:['#192b3d','#c48e71'],grass:'#23382e'},
    aston:{name:'ASTON MARTIN',title:'Midnight, wide open.',route:'MIDNIGHT RUN',max:146,cruise:92,grip:1.2,color:'#467665',sky:['#060d1d','#344654'],grass:'#172a29'},
    rover:{name:'RANGE ROVER',title:'The long way home.',route:'COUNTRY RUN',max:126,cruise:83,grip:1.35,color:'#b6ac88',sky:['#293b42','#adad91'],grass:'#344532'}
  };
  function curveAt(d){return Math.sin(d/290)*.5+Math.sin(d/127)*.2}
  class RoadRun{
    constructor(mode='race',random=Math.random){
      this.cfg=cars[mode]||cars.race;this.random=random;this.phase='ready';this.distance=0;this.speed=0;this.x=0;this.steer=0;this.elapsed=0;this.health=3;this.score=0;this.combo=0;this.near=0;this.traffic=[];this.spawn=2.5;this.invincible=0;this.event='';this.eventTime=0;this.shoulderTime=0;this.time=45;this.checkpoint=0;
    }
    get nextCheckpoint(){return (this.checkpoint+1)*750}
    get trafficPace(){return 20+30*Math.log1p(this.elapsed/40)}
    get spawnInterval(){return Math.max(.65,2.6/(1+this.elapsed/90))}
    start(){if(this.phase==='ready')this.phase='running'}
    pause(){if(this.phase==='running')this.phase='paused'}
    resume(){if(this.phase==='paused')this.phase='running'}
    announce(text){this.event=text;this.eventTime=2}
    step(dt,input={}){
      if(this.phase!=='running')return;dt=clamp(dt,0,.04);
      this.elapsed+=dt;this.time=Math.max(0,this.time-dt);this.invincible=Math.max(0,this.invincible-dt);this.eventTime=Math.max(0,this.eventTime-dt);
      const target=input.brake?38:input.gas?this.cfg.max:this.cfg.cruise;
      this.speed+=clamp(target-this.speed,-95*dt,32*dt);
      this.steer+=(clamp(input.steer||0,-1,1)-this.steer)*Math.min(1,dt*9);
      const velocity=this.speed/this.cfg.max;
      this.x+=this.steer*(.6+velocity)*this.cfg.grip*dt-curveAt(this.distance)*velocity*velocity*.48*dt;
      this.x=clamp(this.x,-1.22,1.22);
      if(Math.abs(this.x)>.91){this.speed=Math.max(25,this.speed-55*dt);this.combo=0}
      const travel=this.speed*.44704*dt;this.distance+=travel;
      const onRoad=Math.abs(this.x)<=.91;
      if(onRoad){this.score+=travel*.25;this.shoulderTime=0}else{
        this.shoulderTime+=dt;
        if(this.shoulderTime>=3){this.shoulderTime=0;this.health--;this.combo=0;this.announce('SHOULDER DAMAGE · GET BACK ON THE ROAD')}
      }
      this.spawn-=dt;
      if(this.spawn<=0){
        // One vehicle per row, with enough approach time and two open lanes.
        this.traffic.push({z:240+this.random()*80,x:[-.6,0,.6][Math.floor(this.random()*3)],speed:38+this.random()*18,color:['#8da2a9','#bd9361','#9d5352'][Math.floor(this.random()*3)],passed:false});
        this.spawn=this.spawnInterval*(.9+this.random()*.2);
      }
      for(const car of this.traffic){
        const before=car.z;car.z-=Math.max(this.trafficPace,(this.speed-car.speed)*.44704+this.trafficPace)*dt;
        if(!car.passed&&before>0&&car.z<=0){
          car.passed=true;const separation=Math.abs(this.x-car.x);
          if(separation<.28&&this.invincible===0){
            this.health--;this.speed*=.48;this.combo=0;this.invincible=2.2;this.announce(this.health?'CONTACT · '+this.health+' CONTACTS LEFT':'RUN ENDED');
          }else if(onRoad&&separation<.47&&this.invincible===0){
            this.near++;this.combo=Math.min(5,this.combo+1);const bonus=100*this.combo;this.score+=bonus;this.announce('CLOSE CALL +'+bonus+' · ×'+this.combo);
          }else if(onRoad){this.score+=25}
        }
      }
      this.traffic=this.traffic.filter(c=>c.z>-35&&c.z<650);
      if(this.distance>=this.nextCheckpoint){
        this.checkpoint++;
        if(onRoad){this.time+=18;this.score+=250;this.announce('CHECKPOINT '+this.checkpoint+' · +18 SECONDS')}
        else this.announce('MISSED GATE · STAY ON THE ROAD');
      }
      if(this.health<=0){this.health=0;this.phase='finished';this.reason='One more run?'}
      else if(this.time<=0){this.phase='finished';this.reason='Out of time.'}
    }
  }
  const trail=[[0,0],[380,0],[530,65],[640,140],[720,null],[840,60],[1000,0],[1200,0],[1430,100],[1580,0],[1800,0],[1940,90],[2070,165],[2170,null],[2260,70],[2430,0],[2660,0],[2850,70],[3000,0],[3180,0],[3330,110],[3410,null],[3520,30],[3670,0],[3900,0]];
  function ground(x){
    if(x<0)return 0;if(x>=3900)return 0;
    for(let i=0;i<trail.length-1;i++){const a=trail[i],b=trail[i+1];if(x>=a[0]&&x<=b[0]){if(a[1]===null||b[1]===null)return null;return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}}
    return 0;
  }
  function slope(x){const a=ground(x-2),b=ground(x+2);return a===null||b===null?0:Math.atan2(b-a,4)}
  class TrailRun{
    constructor(){Object.assign(this,{phase:'ready',x:115,y:27,vx:0,vy:0,angle:0,omega:0,wheelbase:58,wheelR:12,airborne:false,recovering:false,airSpin:0,stuntScore:0,combo:0,distance:0,score:0,airtime:0,landFlash:0,cameraY:0,event:'',eventTime:0,flips:0})}
    start(){if(this.phase==='ready'){this.phase='running';this.vx=190}}
    pause(){if(this.phase==='running')this.phase='paused'}
    resume(){if(this.phase==='paused')this.phase='running'}
    finish(reason,won=false){this.phase='finished';this.reason=reason;this.won=won}
    step(dt,input={}){
      if(this.phase!=='running')return;dt=clamp(dt,0,.02);
      this.eventTime=Math.max(0,this.eventTime-dt);this.landFlash=Math.max(0,this.landFlash-dt*2);
      const previousX=this.x,previousY=this.y,previousAngle=this.angle;
      const target=input.brake?115:input.gas?345:255;
      if(!this.airborne)this.vx+=clamp(target-this.vx,-240*dt,160*dt);
      this.x+=this.vx*dt;
      const terrain=ground(this.x);
      if(this.recovering){
        // Keep the planted tire on the surface while the rider balances the frame.
        this.angle+=(norm(slope(this.x)-this.angle)*5+clamp(input.lean||0,-1,1)*3)*dt;
        const supports=[-29,29].map(lx=>{const wx=this.x+lx*Math.cos(this.angle)+15*Math.sin(this.angle),gy=ground(wx);return gy===null?null:gy-lx*Math.sin(this.angle)+15*Math.cos(this.angle)+12}).filter(y=>y!==null);
        if(supports.length){this.y=Math.max(...supports);this.omega=0;this.vy=0;if(Math.abs(norm(this.angle-slope(this.x)))<.12)this.recovering=false}
        else{this.recovering=false;this.airborne=true;this.vy=0;this.airSpin=0;this.airtime=0}
      }else if(!this.airborne){
        const tangent=slope(previousX);
        const projected=this.y+Math.tan(tangent)*this.vx*dt;
        if(terrain===null||(terrain+27<projected-1.2&&tangent>.08)){
          this.airborne=true;this.vy=Math.max(120,Math.tan(tangent)*this.vx);this.airSpin=0;this.airtime=0;
        }else{this.y=terrain+27;this.angle+=norm(slope(this.x)-this.angle)*Math.min(1,dt*16);this.omega=0}
      }
      if(this.airborne){
        this.airtime+=dt;this.vy-=640*dt;this.y+=this.vy*dt;
        const lean=clamp(input.lean||0,-1,1);
        if(lean)this.omega+=lean*32*dt;
        else{this.omega+=norm(-this.angle)*3.2*dt;this.omega*=Math.exp(-6*dt)}
        this.omega=clamp(this.omega,-12,12);const rotation=this.omega*dt;this.angle+=rotation;this.airSpin+=rotation;
        const contacts=[-29,29].map(lx=>{
          const wx=this.x+lx*Math.cos(this.angle)+15*Math.sin(this.angle),gy=ground(wx);
          const bottom=this.y+lx*Math.sin(this.angle)-15*Math.cos(this.angle)-12;
          const oldBottom=previousY+lx*Math.sin(previousAngle)-15*Math.cos(previousAngle)-12;
          return {gy,bottom,oldBottom,depth:gy===null?0:gy-bottom};
        }).filter(w=>w.gy!==null&&w.depth>=0);
        if(contacts.length&&this.vy<0){
          // A wheel can catch a landing at any speed or angle. A cliff face cannot.
          if(contacts.some(w=>w.oldBottom<w.gy-8)){this.finish('Mind the far edge.');return}
          this.y+=Math.max(...contacts.map(w=>w.depth));
          const error=Math.abs(norm(this.angle-slope(this.x)));
          const flips=Math.floor((Math.abs(this.airSpin)+.25)/(Math.PI*2));
          this.flips+=flips;this.combo++;const points=Math.round(this.airtime*100)+flips*500*this.combo+(error<.3?150:50);
          this.stuntScore+=points;this.event=(flips?flips+'× FLIP':error>.3?'WHEEL SAVE':'CLEAN LANDING')+' +'+points;this.eventTime=2;this.landFlash=1;
          this.omega=0;this.vy=0;this.airborne=false;this.recovering=true;
        }
      }
      // Crash geometry follows the frame and helmet, never an arbitrary angle cutoff.
      for(const [lx,ly,radius] of [[0,0,7],[3,34,7]]){
        const wx=this.x+lx*Math.cos(this.angle)-ly*Math.sin(this.angle),gy=ground(wx);
        const bottom=this.y+lx*Math.sin(this.angle)+ly*Math.cos(this.angle)-radius;
        if(gy!==null&&bottom<gy-2){this.finish('Frame or rider down.');return}
      }
      this.cameraY+=(Math.max(0,this.y-70)-this.cameraY)*Math.min(1,dt*3);
      if(this.y< -230){this.finish('Mind the gap.');return}
      this.distance=Math.max(0,(this.x-115)/10);this.score=Math.floor(this.distance*9)+this.stuntScore;
      if(this.x>=3800){this.finish('Trail conquered.',true);this.score+=1000}
    }
  }
  const api={RoadRun,TrailRun,cars,curveAt,ground,slope,norm,clamp};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GaragePhysics=api;
})(typeof window!=='undefined'?window:this);
