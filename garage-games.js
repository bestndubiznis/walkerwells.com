/* The garage: a road trip and a trail, with shared input, pause, and replay controls. */
(() => {
  const P=GaragePhysics,q=s=>document.querySelector(s),KEY='wells.garage.v2';
  let session=null;
  const savedRecords=WellsStorage.readJSON(KEY,{});
  const records=savedRecords&&typeof savedRecords==='object'&&!Array.isArray(savedRecords)?savedRecords:{};
  function saveBest(s){const key=s.kind==='road'?s.mode:'trail';records[key]=Math.max(Number(records[key])||0,Math.floor(s.game.score));WellsStorage.setItem(KEY,JSON.stringify(records));return records[key]}
  function silence(s){if(s.engine){try{s.engine.osc.stop();s.engine.gain.disconnect()}catch{}s.engine=null}}
  function engine(s){
    if(!state.sound||s.engine)return;
    try{const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)());ac.resume();const osc=ac.createOscillator(),gain=ac.createGain();osc.type='sawtooth';gain.gain.value=.012;osc.connect(gain);gain.connect(ac.destination);osc.start();s.engine={osc,gain,ac}}catch{}
  }
  function clearInput(s){s.keys.clear();s.pointers.clear();s.el.querySelectorAll('[data-input]').forEach(b=>b.classList.remove('held'))}
  function close(){if(!session)return;const s=session;session=null;cancelAnimationFrame(s.raf);s.resize.disconnect();silence(s);clearInput(s);WellsUI.close(s.el);s.el.remove()}
  function open(kind,mode='race'){
    close();closePanels();
    const cfg=P.cars[mode]||P.cars.race;
    const el=document.createElement('section');el.className=(kind==='road'?'drive-overlay':'moto-overlay')+' garage-run';el.id='garageRun';
    el.innerHTML=`<canvas class="garage-canvas" tabindex="0" aria-label="${kind==='road'?'Road driving':'Dirt bike'} game. Controls are described in the instructions."></canvas>
      <header class="run-header"><div><small>W / GARAGE</small><strong>${kind==='road'?cfg.name:'DIRT BIKE'}</strong></div><nav><button data-sound>SOUND — ${state.sound?'ON':'OFF'}</button><button data-pause disabled>PAUSE</button><button data-ui-close>EXIT ×</button></nav></header>
      <div class="run-hud"><div><small>SCORE</small><strong data-score>000000</strong></div><div class="run-progress"><div><span>${kind==='road'?cfg.route:'RIDGELINE TRAIL'}</span><b data-distance>0 / ${kind==='road'?'3,000':'369'} M</b></div><i><em></em></i></div><div><small>${kind==='road'?'TIME LEFT':'BEST'}</small><strong data-clock>—</strong></div></div>
      <div class="run-callout" role="status" aria-live="polite"></div>
      <div class="run-dashboard"><div class="run-speed"><strong data-speed>0</strong><small>${kind==='road'?'MPH':'KM/H'}</small></div><div class="run-condition"><span data-condition></span><small data-tip></small></div></div>
      <div class="run-controls">${kind==='road'?'<div><button data-input="left" aria-label="Steer left">←<small>A / ←</small></button><button data-input="right" aria-label="Steer right">→<small>D / →</small></button></div><div><button data-input="brake">BRAKE<small>S / ↓</small></button><button data-input="gas" class="gas">GAS<small>W / ↑</small></button></div>':'<div><button data-input="left" aria-label="Lean back">↶<small>LEAN BACK</small></button><button data-input="right" aria-label="Lean forward">↷<small>LEAN FORWARD</small></button></div><div><button data-input="brake">BRAKE<small>S / ↓</small></button><button data-input="gas" class="gas">GAS<small>SPACE / ↑</small></button></div>'}</div>
      <div class="run-card"><small data-card-kicker></small><h2></h2><p data-card-copy></p><div class="run-stats" hidden></div><button class="run-primary" data-start>START ENGINE →</button><button data-retry hidden>NEW RUN</button><p class="run-keyboard">${kind==='road'?'A / D or ← / → steer · W / ↑ gas · S / ↓ brake':'A / ← lean back · D / → lean forward · SPACE / ↑ gas · S / ↓ brake'}<br>P pauses · Escape returns to the garage</p></div>`;
    document.body.append(el);
    const s={el,kind,mode,cfg,canvas:el.querySelector('canvas'),game:kind==='road'?new P.RoadRun(mode):new P.TrailRun(),keys:new Set(),pointers:new Map(),raf:0,last:0,accumulator:0,engine:null,w:0,h:0};session=s;
    s.ctx=s.canvas.getContext('2d');
    s.resize=new ResizeObserver(()=>{const r=s.canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);s.w=r.width;s.h=r.height;s.canvas.width=r.width*dpr;s.canvas.height=r.height*dpr;s.ctx.setTransform(dpr,0,0,dpr,0,0);render(s)});s.resize.observe(s.canvas);
    el.querySelector('[data-ui-close]').onclick=close;
    el.querySelector('[data-sound]').onclick=e=>{toggleSound();e.currentTarget.textContent='SOUND — '+(state.sound?'ON':'OFF');if(state.sound&&s.game.phase==='running')engine(s);else silence(s)};
    el.querySelector('[data-pause]').onclick=()=>pause(s);
    el.querySelector('[data-start]').onclick=()=>{
      if(s.game.phase==='paused')s.game.resume();else{if(s.game.phase==='finished')s.game=kind==='road'?new P.RoadRun(mode):new P.TrailRun();s.game.start()}
      clearInput(s);s.last=0;s.accumulator=0;card(s);s.canvas.focus();engine(s);
      collect(kind==='road'?'road-key':'race-token');
    };
    el.querySelector('[data-retry]').onclick=()=>{s.game=kind==='road'?new P.RoadRun(mode):new P.TrailRun();clearInput(s);silence(s);card(s)};
    el.querySelectorAll('[data-input]').forEach(button=>{
      button.onpointerdown=e=>{if(s.game.phase!=='running')return;e.preventDefault();button.setPointerCapture(e.pointerId);s.pointers.set(e.pointerId,button.dataset.input);button.classList.add('held')};
      const release=e=>{s.pointers.delete(e.pointerId);button.classList.remove('held')};button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;
    });
    WellsUI.open(el);card(s);el.querySelector('[data-start]').focus();
    function tick(now){
      if(session!==s)return;
      const dt=s.last?Math.min(.1,(now-s.last)/1000):0;s.last=now;
      const wasRunning=s.game.phase==='running';
      if(wasRunning){
        const held=k=>[...s.keys].some(code=>bindings[code]===k)||[...s.pointers.values()].includes(k);
        const input={steer:Number(held('right'))-Number(held('left')),lean:Number(held('left'))-Number(held('right')),gas:held('gas'),brake:held('brake')};
        s.input=input;s.accumulator+=dt;
        while(s.accumulator>=1/120&&s.game.phase==='running'){s.game.step(1/120,input);s.accumulator-=1/120}
        if(s.engine)s.engine.osc.frequency.setTargetAtTime(38+(kind==='road'?s.game.speed:s.game.vx*.3)*1.15,s.engine.ac.currentTime,.08);
        if(s.game.phase==='finished'){saveBest(s);silence(s);clearInput(s);card(s);el.querySelector('[data-start]').focus()}
      }
      if(wasRunning){render(s);hud(s)}s.raf=requestAnimationFrame(tick);
    }
    s.raf=requestAnimationFrame(tick);
  }
  function pause(s){if(s.game.phase!=='running')return;s.game.pause();clearInput(s);silence(s);card(s);s.el.querySelector('[data-start]').focus()}
  function card(s){
    const el=s.el,g=s.game,phase=g.phase,box=el.querySelector('.run-card');box.hidden=phase==='running';el.dataset.phase=phase;
    el.querySelector('[data-pause]').disabled=phase!=='running';
    if(phase==='running')return;
    el.querySelector('[data-card-kicker]').textContent=phase==='paused'?'TAKE YOUR TIME':phase==='finished'?(g.won?'ROUTE COMPLETE':'RUN OVER'):s.kind==='road'?'THREE KILOMETRES / YOUR OWN PACE':'A LITTLE AIR / A LITTLE BALANCE';
    el.querySelector('h2').textContent=phase==='paused'?'Parked for a moment.':phase==='finished'?g.reason:s.kind==='road'?s.cfg.title:'Find your flow.';
    el.querySelector('[data-card-copy]').textContent=phase==='paused'?'Your run is right where you left it.':phase==='finished'?(g.won?'One more run? There is always a cleaner line.':s.kind==='road'?'Try a cleaner line. Brake early, look ahead, and give yourself room.':'Keep the gas on approaching gaps. Release lean before touchdown to steady the bike.'):s.kind==='road'?'Cruise automatically, hold gas to push harder, and brake for traffic. Follow the bends. Close passes build a score multiplier. Checkpoints add time; three contacts end the run.':'The bike cruises for you. Hold gas for the gaps. Lean back or forward in the air; release both to steady the bike. Land on your wheels, link jumps, and bring it home. Flips are optional.';
    el.querySelector('[data-start]').textContent=phase==='paused'?'RESUME RUN →':phase==='finished'?'RUN IT AGAIN →':s.kind==='road'?'START ENGINE →':'HIT THE TRAIL →';
    el.querySelector('[data-retry]').hidden=phase!=='paused';
    const stats=el.querySelector('.run-stats');stats.hidden=phase!=='finished';
    hud(s);render(s);
    if(phase==='finished')stats.innerHTML=`<span>SCORE<b>${Math.floor(g.score).toLocaleString()}</b></span><span>BEST<b>${Number(records[s.kind==='road'?s.mode:'trail']||0).toLocaleString()}</b></span><span>${s.kind==='road'?'CLOSE PASSES':'FLIPS'}<b>${s.kind==='road'?g.near:g.flips}</b></span>`;
  }
  function hud(s){
    const g=s.game,el=s.el,isRoad=s.kind==='road',distance=isRoad?g.distance:g.distance;
    el.querySelector('[data-score]').textContent=String(Math.floor(g.score)).padStart(6,'0');
    el.querySelector('[data-distance]').textContent=(isRoad?Math.floor(distance):Math.round(distance)).toLocaleString()+' / '+(isRoad?'3,000':'369')+' M';
    el.querySelector('.run-progress em').style.width=Math.min(100,distance/(isRoad?3000:368.5)*100)+'%';
    el.querySelector('[data-clock]').textContent=isRoad?Math.ceil(g.time)+'s':String(records.trail||0).padStart(4,'0');
    el.querySelector('[data-speed]').textContent=Math.round(isRoad?g.speed:g.vx*.12);
    el.querySelector('[data-condition]').textContent=isRoad?'●'.repeat(g.health)+'○'.repeat(3-g.health):g.airborne?'AIRBORNE':'ON THE TRAIL';
    el.querySelector('[data-tip]').textContent=isRoad?(Math.abs(g.x)>.91?'SHOULDER · LOSING SPEED':s.input?.brake?'BRAKING':s.input?.gas?'ON THE THROTTLE':'CRUISE · HOLD GAS TO PUSH'):g.airborne?'LEAN TO BALANCE · RELEASE TO STEADY':'GAS FOR GAPS · LEAN FOR FLIPS';
    const message=el.querySelector('.run-callout'),text=g.eventTime>0&&g.phase==='running'?g.event:'';if(message.textContent!==text)message.textContent=text;
  }
  function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
  function car(c,x,y,width,color,brake=false,steer=0){
    c.save();c.translate(x,y);c.rotate(steer*.04);const w=width,h=w*.59;
    c.fillStyle='#03080b99';c.beginPath();c.ellipse(0,4,w*.63,h*.22,0,0,Math.PI*2);c.fill();
    c.fillStyle='#0c1014';c.fillRect(-w*.5,-h*.45,w*.15,h*.53);c.fillRect(w*.35,-h*.45,w*.15,h*.53);
    poly(c,[[-w*.48,0],[-w*.5,-h*.5],[-w*.31,-h*.9],[w*.31,-h*.9],[w*.5,-h*.5],[w*.48,0]],color);
    poly(c,[[-w*.28,-h*.8],[w*.28,-h*.8],[w*.38,-h*.49],[-w*.38,-h*.49]],'#0c2430');
    c.strokeStyle='#dae1d44d';c.lineWidth=1;c.beginPath();c.moveTo(-w*.35,-h*.47);c.lineTo(w*.35,-h*.47);c.stroke();
    c.fillStyle=brake?'#ff755b':'#d34335';c.shadowColor='#ff3a1d';c.shadowBlur=brake?15:4;c.fillRect(-w*.43,-h*.29,w*.23,h*.095);c.fillRect(w*.2,-h*.29,w*.23,h*.095);c.shadowBlur=0;
    c.fillStyle='#ded4ac';c.fillRect(-w*.1,-h*.17,w*.2,h*.08);c.fillStyle='#131a1c';c.fillRect(-w*.41,-h*.055,w*.82,h*.08);c.restore();
  }
  function road(s){
    const c=s.ctx,w=s.w,h=s.h,g=s.game,cfg=s.cfg,horizon=h*.36,bottom=h*.83;
    const sky=c.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,cfg.sky[0]);sky.addColorStop(1,cfg.sky[1]);c.fillStyle=sky;c.fillRect(0,0,w,h);
    c.fillStyle=s.mode==='aston'?'#e0d9b5':'#eec5a0';c.beginPath();c.arc(w*.76,h*.22,s.mode==='aston'?13:23,0,Math.PI*2);c.fill();
    for(let layer=0;layer<3;layer++){const points=[[0,horizon+20]];for(let x=0;x<=w+30;x+=30)points.push([x,horizon-25-layer*12-Math.sin(x/w*10+layer*2+g.distance*.0001)*22-Math.sin(x/w*24+layer)*12]);points.push([w,horizon+20]);poly(c,points,['#445251','#314340','#253b36'][layer])}
    c.fillStyle=cfg.grass;c.fillRect(0,horizon,w,h-horizon);
    function project(z){const p=1/(1+Math.max(0,z)/65);return {x:w*.5-g.x*w*.43*p+P.curveAt(g.distance+Math.min(z,400)*.4)*w*.55*(1-p)*(1-p),y:horizon+(bottom-horizon)*p,half:w*.43*p,p}}
    for(let z=1200;z>0;z-=8){const far=project(z),near=project(Math.max(0,z-8)),stripe=Math.floor((g.distance+z)/12)%2;
      poly(c,[[far.x-far.half*1.08,far.y],[far.x+far.half*1.08,far.y],[near.x+near.half*1.08,near.y],[near.x-near.half*1.08,near.y]],stripe?'#d0c5a4':'#985546');
      poly(c,[[far.x-far.half,far.y],[far.x+far.half,far.y],[near.x+near.half,near.y],[near.x-near.half,near.y]],stripe?'#303c40':'#323e42');
      if(Math.floor((g.distance+z)/16)%2)for(const lane of [-1/3,1/3])poly(c,[[far.x+far.half*(lane-.008),far.y],[far.x+far.half*(lane+.008),far.y],[near.x+near.half*(lane+.008),near.y],[near.x+near.half*(lane-.008),near.y]],'#c4bfa3');
    }
    const foot=project(0),behind={x:w*.5-g.x*w*.72,half:w*.72,y:h+20};
    poly(c,[[foot.x-foot.half*1.08,foot.y],[foot.x+foot.half*1.08,foot.y],[behind.x+behind.half*1.08,behind.y],[behind.x-behind.half*1.08,behind.y]],'#b4a68b');
    poly(c,[[foot.x-foot.half,foot.y],[foot.x+foot.half,foot.y],[behind.x+behind.half,behind.y],[behind.x-behind.half,behind.y]],'#303c40');
    // Roadside markers and pines supply a steady sense of speed without camera shake.
    for(let z=1100-(g.distance%35);z>8;z-=35){const p=project(z);for(const side of [-1,1]){const x=p.x+side*p.half*1.18;c.fillStyle='#bdc4ae';c.fillRect(x,p.y-30*p.p,3*p.p,30*p.p);c.fillStyle='#e3b877';c.fillRect(x,p.y-29*p.p,3*p.p,7*p.p);if(Math.floor((z+g.distance)/35)%3===0){const tx=p.x+side*p.half*1.55;poly(c,[[tx-24*p.p,p.y],[tx,p.y-115*p.p],[tx+24*p.p,p.y]],'#152c29')}}}
    [...g.traffic].sort((a,b)=>b.z-a.z).forEach(v=>{if(v.z< -3)return;const p=project(v.z);car(c,p.x+v.x*p.half,p.y,p.half*.28,v.color)});
    const player=project(0);if(g.invincible<=0||Math.floor(g.invincible*8)%2===0||state.reduce)car(c,w*.5,player.y,Math.min(w*.12,152),cfg.color,s.input?.brake,g.steer);
    if(g.invincible>1.9&&!state.reduce){c.fillStyle='#c5513222';c.fillRect(0,0,w,h)}
    const shade=c.createLinearGradient(0,bottom-20,0,h);shade.addColorStop(0,'#07111600');shade.addColorStop(1,'#071116');c.fillStyle=shade;c.fillRect(0,bottom-20,w,h-bottom+20);
    if(g.distance>200&&g.phase==='running'){c.fillStyle='#e2d6b2';c.font='11px "DM Sans",sans-serif';c.textAlign='center';const bend=P.curveAt(g.distance+100);c.fillText(Math.abs(bend)<.2?'OPEN ROAD':bend>0?'BEND AHEAD  ↗':'↖  BEND AHEAD',w*.5,horizon-22)}
  }
  function trail(s){
    const c=s.ctx,w=s.w,h=s.h,g=s.game,scale=P.clamp(w/950,.65,1.1),camX=g.x-w*.28/scale,anchor=g.cameraY;
    const sy=y=>h*.72-(y-anchor)*scale,sx=x=>(x-camX)*scale;
    const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#111e2a');sky.addColorStop(.7,'#657b78');sky.addColorStop(1,'#344d42');c.fillStyle=sky;c.fillRect(0,0,w,h);
    c.fillStyle='#e4cfa2';c.beginPath();c.arc(w*.78,h*.24,22,0,Math.PI*2);c.fill();
    for(let layer=0;layer<3;layer++){const pts=[[0,h]];for(let x=-20;x<=w+30;x+=25)pts.push([x,h*(.47+layer*.09)-Math.sin(x/w*8+layer+g.x*.00012)*h*.065-Math.sin(x/w*19+layer)*h*.025]);pts.push([w,h]);poly(c,pts,['#4a6564','#334f49','#243e34'][layer])}
    let points=[];const finish=()=>{if(points.length>1){poly(c,[...points,[points.at(-1)[0],h+10],[points[0][0],h+10]],'#253129');c.strokeStyle='#c5b28b';c.lineWidth=3;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}points=[]};
    for(let x=-10;x<=w+10;x+=4){const y=P.ground(camX+x/scale);if(y===null)finish();else points.push([x,sy(y)])}finish();
    for(const x of [530,1940,3230]){if(sx(x)>-60&&sx(x)<w+60){const y=sy(P.ground(x));c.fillStyle='#ccb77d';c.fillRect(sx(x),y-45,2,45);c.fillRect(sx(x)-22,y-62,46,22);c.fillStyle='#24352b';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText('GAS ↗',sx(x),y-47)}}
    const end=sx(3800),ey=sy(0);if(end<w+80){c.fillStyle='#d9cdaa';c.fillRect(end,ey-110,3,110);c.fillStyle='#b89c62';c.fillRect(end,ey-110,60,28);c.fillStyle='#15291e';c.font='10px sans-serif';c.fillText('HOME',end+30,ey-91)}
    c.save();c.translate(sx(g.x),sy(g.y));c.scale(scale,-scale);c.rotate(g.angle);
    const wb=58,r=12;c.lineWidth=3;
    for(const x of [-29,29]){c.fillStyle='#152220';c.strokeStyle='#cbc7ae';c.beginPath();c.arc(x,-15,r,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#737f70';c.lineWidth=1;for(let a=0;a<Math.PI;a+=Math.PI/3){const angle=a+g.x/12;c.beginPath();c.moveTo(x-Math.cos(angle)*r,-15-Math.sin(angle)*r);c.lineTo(x+Math.cos(angle)*r,-15+Math.sin(angle)*r);c.stroke()}}
    c.strokeStyle='#df9051';c.lineWidth=5;c.lineJoin='round';c.lineCap='round';c.beginPath();c.moveTo(-29,-15);c.lineTo(-5,5);c.lineTo(15,-14);c.lineTo(-18,-12);c.lineTo(-5,5);c.lineTo(24,7);c.lineTo(29,-15);c.stroke();
    c.strokeStyle='#ddd5b7';c.lineWidth=3;c.beginPath();c.moveTo(29,-15);c.lineTo(24,9);c.lineTo(33,13);c.moveTo(24,9);c.lineTo(17,17);c.stroke();
    c.strokeStyle='#142b29';c.lineWidth=6;c.beginPath();c.moveTo(-17,8);c.lineTo(2,9);c.stroke();
    c.strokeStyle='#ebdec1';c.lineWidth=4;c.beginPath();c.moveTo(-7,11);c.lineTo(2,27);c.lineTo(20,15);c.moveTo(2,26);c.lineTo(-13,18);c.moveTo(-7,11);c.lineTo(-20,-8);c.moveTo(-7,11);c.lineTo(11,-9);c.stroke();c.fillStyle='#df9051';c.beginPath();c.arc(3,34,7,0,Math.PI*2);c.fill();c.fillStyle='#182d2b';c.fillRect(2,34,8,3);c.restore();
    if(g.airborne){c.fillStyle='#f0dab0';c.textAlign='center';c.font='12px "DM Sans",sans-serif';c.fillText('AIR '+g.airtime.toFixed(1)+'s  /  '+Math.floor(Math.abs(g.airSpin)/(Math.PI*2))+' FLIPS',w*.5,h*.4)}
    if(g.landFlash>0&&!state.reduce){c.fillStyle=`rgba(239,204,140,${g.landFlash*.08})`;c.fillRect(0,0,w,h)}
  }
  function render(s){if(!s.w||!s.h)return;s.ctx.clearRect(0,0,s.w,s.h);if(s.kind==='road')road(s);else trail(s)}
  const bindings={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'gas',KeyW:'gas',Space:'gas',ArrowDown:'brake',KeyS:'brake'};
  addEventListener('keydown',e=>{const s=session;if(!s||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='KeyP'&&!e.repeat){e.preventDefault();if(s.game.phase==='paused')s.el.querySelector('[data-start]').click();else pause(s);return}const key=bindings[e.code];if(key&&s.game.phase==='running'){e.preventDefault();s.keys.add(e.code)}});
  addEventListener('keyup',e=>{const s=session;if(!s)return;const key=bindings[e.code];if(key){s.keys.delete(e.code);if(s.game.phase==='running')e.preventDefault()}});
  addEventListener('blur',()=>{if(session)pause(session)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&session)pause(session)});
  addEventListener('estate:before-scene',close);
  startDrive=type=>open('road',type);
  const previous=doAction;doAction=function(action){if(action==='moto'){open('trail');return}return previous(action)};
})();
