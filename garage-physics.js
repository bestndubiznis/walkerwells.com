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
  const courses=[
    {id:'ridgeline',name:'Ridgeline',description:'Pine hills, forgiving jumps, and three ravines.',points:trail,end:3800,signs:[530,1940,3230],sky:['#111e2a','#657b78','#344d42'],mountains:['#4a6564','#334f49','#243e34'],soil:'#253129',edge:'#c5b28b'},
    {id:'canyon',name:'Red Rock Canyon',description:'Long desert launches and rolling sandstone mesas.',points:[[0,0],[420,0],[620,110],[770,185],[870,null],[980,55],[1210,0],[1490,0],[1700,100],[1880,175],[1990,null],[2100,55],[2320,0],[2600,0],[2810,130],[2950,190],[3040,null],[3150,50],[3390,0],[3600,0],[3840,120],[4030,0],[4300,0]],end:4200,signs:[620,1700,2810],sky:['#38253d','#ce9270','#9c6049'],mountains:['#a76957','#815042','#58392f'],soil:'#603b2b',edge:'#efba7e'},
    {id:'alpine',name:'Alpine Afterglow',description:'A longer mountain run with four high-altitude gaps.',points:[[0,0],[380,0],[570,90],[740,165],[830,null],[940,65],[1150,0],[1390,0],[1590,130],[1750,200],[1850,null],[1960,75],[2200,0],[2460,0],[2650,110],[2830,190],[2930,null],[3040,60],[3290,0],[3540,0],[3740,130],[3900,210],[4000,null],[4110,70],[4370,0],[4660,0]],end:4550,signs:[570,1590,2650,3740],sky:['#181d43','#8b88b4','#536d87'],mountains:['#778ca7','#526c88','#304962'],soil:'#293e50',edge:'#dce9ed'}
  ];
  function ground(x,course=courses[0]){
    const points=course.points;
    if(x<0||x>=points.at(-1)[0])return 0;
    for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1];if(x>=a[0]&&x<=b[0]){if(a[1]===null||b[1]===null)return null;return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])}}
    return 0;
  }
  function slope(x,course=courses[0]){const a=ground(x-2,course),b=ground(x+2,course);return a===null||b===null?0:Math.atan2(b-a,4)}
  // Bank completed turns immediately; counter-steering must not erase a full flip.
  class FlipTracker{
    constructor(){this.partial=0;this.back=0;this.front=0}
    add(rotation){this.partial+=rotation;const turn=Math.PI*2;
      while(this.partial>=turn-1e-9){this.back++;this.partial-=turn}
      while(this.partial<=-turn+1e-9){this.front++;this.partial+=turn}
    }
    get total(){return this.back+this.front}
  }
  class TrailRun{
    constructor(courseId='ridgeline'){this.course=courses.find(c=>c.id===courseId)||courses[0];this.trick=new FlipTracker();Object.assign(this,{phase:'ready',x:115,y:27,vx:0,vy:0,angle:0,omega:0,wheelbase:58,wheelR:12,airborne:false,recovering:false,airSpin:0,stuntScore:0,combo:0,distance:0,score:0,airtime:0,landFlash:0,cameraY:0,event:'',eventTime:0,flips:0})}
    ground(x){return ground(x,this.course)}
    slope(x){return slope(x,this.course)}
    start(){if(this.phase==='ready'){this.phase='running';this.vx=190}}
    pause(){if(this.phase==='running')this.phase='paused'}
    resume(){if(this.phase==='paused')this.phase='running'}
    finish(reason,won=false){this.phase='finished';this.reason=reason;this.won=won}
    step(dt,input={}){
      if(this.phase!=='running')return;dt=clamp(dt,0,.02);
      this.eventTime=Math.max(0,this.eventTime-dt);this.landFlash=Math.max(0,this.landFlash-dt*2);
      let landing=null;
      const previousX=this.x,previousY=this.y,previousAngle=this.angle;
      const target=input.brake?115:input.gas?345:255;
      if(!this.airborne)this.vx+=clamp(target-this.vx,-240*dt,160*dt);
      this.x+=this.vx*dt;
      const terrain=this.ground(this.x);
      if(this.recovering){
        // Keep the planted tire on the surface while the rider balances the frame.
        this.angle+=(norm(this.slope(this.x)-this.angle)*5+clamp(input.lean||0,-1,1)*3)*dt;
        const supports=[-29,29].map(lx=>{const wx=this.x+lx*Math.cos(this.angle)+15*Math.sin(this.angle),gy=this.ground(wx);return gy===null?null:gy-lx*Math.sin(this.angle)+15*Math.cos(this.angle)+12}).filter(y=>y!==null);
        if(supports.length){this.y=Math.max(...supports);this.omega=0;this.vy=0;if(Math.abs(norm(this.angle-this.slope(this.x)))<.12)this.recovering=false}
        else{this.recovering=false;this.airborne=true;this.vy=0;this.airSpin=0;this.trick=new FlipTracker();this.airtime=0}
      }else if(!this.airborne){
        const tangent=this.slope(previousX);
        const projected=this.y+Math.tan(tangent)*this.vx*dt;
        if(terrain===null||(terrain+27<projected-1.2&&tangent>.08)){
          this.airborne=true;this.vy=Math.max(120,Math.tan(tangent)*this.vx);this.airSpin=0;this.trick=new FlipTracker();this.airtime=0;
        }else{this.y=terrain+27;this.angle+=norm(this.slope(this.x)-this.angle)*Math.min(1,dt*16);this.omega=0}
      }
      if(this.airborne){
        this.airtime+=dt;this.vy-=640*dt;this.y+=this.vy*dt;
        const lean=clamp(input.lean||0,-1,1);
        if(lean)this.omega+=lean*32*dt;
        else{this.omega+=norm(-this.angle)*3.2*dt;this.omega*=Math.exp(-6*dt)}
        this.omega=clamp(this.omega,-12,12);const rotation=this.omega*dt;this.angle+=rotation;this.airSpin+=rotation;this.trick.add(rotation);
        const contacts=[-29,29].map(lx=>{
          const wx=this.x+lx*Math.cos(this.angle)+15*Math.sin(this.angle),gy=this.ground(wx);
          const bottom=this.y+lx*Math.sin(this.angle)-15*Math.cos(this.angle)-12;
          const oldBottom=previousY+lx*Math.sin(previousAngle)-15*Math.cos(previousAngle)-12;
          return {gy,bottom,oldBottom,depth:gy===null?0:gy-bottom};
        }).filter(w=>w.gy!==null&&w.depth>=0);
        if(contacts.length&&this.vy<0){
          // A wheel can catch a landing at any speed or angle. A cliff face cannot.
          if(contacts.some(w=>w.oldBottom<w.gy-8)){this.finish('Mind the far edge.');return}
          this.y+=Math.max(...contacts.map(w=>w.depth));
          const error=Math.abs(norm(this.angle-this.slope(this.x)));
          const flips=this.trick.total;
          landing={flips,error,airtime:this.airtime};
          this.omega=0;this.vy=0;this.airborne=false;this.recovering=true;
        }
      }
      // Crash geometry follows the frame and helmet, never an arbitrary angle cutoff.
      for(const [lx,ly,radius] of [[0,0,7],[3,34,7]]){
        const wx=this.x+lx*Math.cos(this.angle)-ly*Math.sin(this.angle),gy=this.ground(wx);
        const bottom=this.y+lx*Math.sin(this.angle)+ly*Math.cos(this.angle)-radius;
        if(gy!==null&&bottom<gy-2){this.finish('Frame or rider down.');return}
      }
      if(landing){
        const {flips,error,airtime}=landing;this.flips+=flips;this.combo++;
        const points=Math.round(airtime*100)+flips*500*this.combo+(error<.3?150:50);
        this.stuntScore+=points;this.event=(flips?this.trick.back+' BACK / '+this.trick.front+' FRONT':error>.3?'WHEEL SAVE':'CLEAN LANDING')+' +'+points;this.eventTime=2;this.landFlash=1;
      }
      this.cameraY+=(Math.max(0,this.y-70)-this.cameraY)*Math.min(1,dt*3);
      if(this.y< -230){this.finish('Mind the gap.');return}
      this.distance=Math.max(0,(this.x-115)/10);this.score=Math.floor(this.distance*9)+this.stuntScore;
      if(this.x>=this.course.end){this.finish('Trail conquered.',true);this.score+=1000}
    }
  }
  const api={RoadRun,TrailRun,FlipTracker,courses,cars,curveAt,ground,slope,norm,clamp};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GaragePhysics=api;
})(typeof window!=='undefined'?window:this);
