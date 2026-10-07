/* Objects with consequences: the sentinel, a wandering compass, and a fire worth tending. */
(() => {
  const q=s=>document.querySelector(s);
  const saved=WellsStorage.readJSON('wells.encounters.v1',{});
  const memory={sentinel:!!saved.sentinel,compass:!!saved.compass,fire:Math.max(1,Math.min(4,Number(saved.fire)||1))};
  const save=()=>WellsStorage.setItem('wells.encounters.v1',JSON.stringify(memory));
  let current=null;
  const sword=`<svg viewBox="0 0 100 390" aria-hidden="true"><defs><linearGradient id="playerSteel"><stop stop-color="#4d5556"/><stop offset=".42" stop-color="#d5e0dc"/><stop offset=".5" stop-color="#fff3ce"/><stop offset=".55" stop-color="#8faaa9"/><stop offset="1" stop-color="#283537"/></linearGradient></defs><path d="M50 6 65 43 61 280 39 280 35 43Z" fill="url(#playerSteel)" stroke="#a9b6b0"/><path d="M50 18V278" stroke="#f4e4b8" opacity=".65"/><path d="M12 285Q50 269 88 285L84 296Q50 286 16 296Z" fill="#b59a61" stroke="#efdaa2"/><path d="M43 293H57L59 357 50 370 41 357Z" fill="#342920" stroke="#b39968"/><path d="M43 301 57 307M43 312 57 318M43 323 57 329M43 334 57 340" stroke="#806442"/><circle cx="50" cy="371" r="12" fill="#b39a65" stroke="#efd7a1"/><path d="m50 364 4 7-4 7-4-7Z" fill="#414734"/></svg>`;
  const knight=`<svg class="sentinel-figure" viewBox="0 0 420 560" aria-hidden="true">
    <defs><linearGradient id="knightSteel"><stop stop-color="#202c30"/><stop offset=".3" stop-color="#657579"/><stop offset=".48" stop-color="#bdc4ba"/><stop offset=".55" stop-color="#89958f"/><stop offset=".8" stop-color="#354446"/><stop offset="1" stop-color="#111d22"/></linearGradient><linearGradient id="knightDark"><stop stop-color="#142125"/><stop offset=".45" stop-color="#677572"/><stop offset="1" stop-color="#1c2a2d"/></linearGradient><linearGradient id="knightGold"><stop stop-color="#6c512f"/><stop offset=".5" stop-color="#dcc591"/><stop offset="1" stop-color="#80603b"/></linearGradient></defs>
    <ellipse cx="210" cy="523" rx="123" ry="18" fill="#000" opacity=".6"/>
    <path d="M155 155Q110 251 120 463L168 488 199 422 246 490 292 467Q299 284 267 156Z" fill="#261e1b" stroke="#493a2e"/>
    <g fill="url(#knightDark)" stroke="#a5a99b" stroke-width="1.4"><path d="m163 329 42 5-10 89-17 77-38 6 14-94Z"/><path d="m215 334 44-5 16 83 10 94-39-6-19-76Z"/><path d="m139 498 38-6 7 18-15 12-53-2 3-12Z"/><path d="m245 493 39 6 19 13-2 10-54-1-11-12Z"/></g>
    <g fill="url(#knightSteel)" stroke="#a4afa5" stroke-width="1.6"><path d="m149 170 32-29 60 0 31 29-13 108-19 22-65-3-19-29Z"/><path d="m159 284 98 0 16 48-31 20-37-8-37 8-26-22Z"/><path d="m145 181-27 30-12 79 25 11 30-78Z"/><path d="m157 367 36 3 0 34-20 15-24-20Z"/><path d="m229 370 35-3 9 31-25 21-19-15Z"/></g>
    <path d="M211 149V285M160 276Q210 290 260 276M157 294Q211 309 264 294M151 313Q209 329 270 313" fill="none" stroke="#b9a877" stroke-width="2"/>
    <path d="m185 184 25-15 25 15-5 38-20 20-20-20Z" fill="#253637" stroke="url(#knightGold)" stroke-width="3"/><path d="m193 191 8 29 9-20 9 20 8-29" fill="none" stroke="#c1ab77" stroke-width="3"/>
    <g class="sentinel-head"><path d="m181 77 28-13 30 13 12 53-20 23-40-1-22-24Z" fill="url(#knightSteel)" stroke="#bac1b2" stroke-width="1.6"/><path d="m173 105 36 8 38-8-6 24-30 15-31-15Z" fill="url(#knightDark)" stroke="#abb5a6"/><path d="m177 108 30 5m6 0 28-5" stroke="#090f11" stroke-width="6"/><path class="sentinel-eyes" d="m181 109 23 4m12 0 21-4" stroke="#ebc777" stroke-width="2"/><path d="M209 69v37M211 118v22M185 124l12 4m28 0 11-4" stroke="#c9ba98" stroke-width="1.5"/><path d="m184 73 25-31 29 32-26-12Z" fill="url(#knightDark)" stroke="#a6aa96"/></g>
    <g class="sentinel-sword-arm"><path d="m264 168 32 9 16 38 13 52-21 10-21-53-29-20Z" fill="url(#knightSteel)" stroke="#a9b2a5" stroke-width="2"/><path d="m272 165 29 13-8 22-35-3Z" fill="url(#knightDark)" stroke="#bfb28a"/><path d="m309 256 18-4 11 19-6 25-17 1-15-19Z" fill="url(#knightSteel)" stroke="#a9b2a5"/><g transform="translate(322 265) rotate(15)"><path d="M-9-22-12-186 0-224 12-186 9-22Z" fill="url(#knightSteel)" stroke="#cbd0bd"/><path d="M0-212V-24" stroke="#ede2bd"/><path d="M-31-17Q0-32 31-17L30-9Q0-17-30-9Z" fill="url(#knightGold)" stroke="#d7bd81"/><path d="M-6-11H6V39H-6Z" fill="#30271f" stroke="#bfa26a"/><circle cy="42" r="9" fill="url(#knightGold)"/></g></g>
    <g class="sentinel-shield"><path d="m91 239 49-17 49 17-5 77q-13 43-44 63-35-26-46-63Z" fill="url(#knightDark)" stroke="url(#knightGold)" stroke-width="5"/><path d="m105 250 35-13 35 13-5 61q-10 32-30 47-24-19-32-47Z" fill="#1b2b2d" stroke="#827857"/><path d="m123 269 9 45 9-29 9 29 9-45" fill="none" stroke="#cab17b" stroke-width="5"/><circle cx="140" cy="247" r="3" fill="#e2ca91"/></g>
  </svg>`;
  function sound(kind){
    if(!state.sound)return;
    try{
      const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)());ac.resume();
      const frequencies=kind==='clash'?[370,913,1637]:kind==='reward'?[261.63,329.63,392]:[110,173,251];
      frequencies.forEach((frequency,i)=>{
        const o=ac.createOscillator(),g=ac.createGain(),at=ac.currentTime+(kind==='reward'?i*.11:0);
        o.type=kind==='clash'?'triangle':'sine';o.frequency.value=frequency;
        g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(.07/(i+1),at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+.5);
        o.connect(g);g.connect(ac.destination);o.start(at);o.stop(at+.55);
      });
    }catch{}
  }
  function close(){
    if(!current)return;
    const old=current;current=null;cancelAnimationFrame(old.raf);old.dispose?.();WellsUI.close(old.el);old.el.remove();
  }
  function shell(kind,kicker,title,description){
    close();closePanels();
    const el=document.createElement('section');el.className='estate-system-overlay object-experience '+kind;el.id='objectExperience';
    el.innerHTML=`<div class="object-backdrop"></div><header class="object-header"><span>W / OBJECTS WITH A LIFE OF THEIR OWN</span><div><button class="object-sound" type="button">SOUND — ${state.sound?'ON':'OFF'}</button><button class="object-exit" data-ui-close type="button">CLOSE <span>×</span></button></div></header><div class="object-layout"><div class="object-story"><span class="object-kicker">${kicker}</span><h2>${title}</h2><p class="object-description">${description}</p><div class="object-progress"></div><p class="object-message" role="status" aria-live="polite"></p><div class="object-options"></div></div><div class="object-workbench"></div></div>`;
    document.body.append(el);
    current={el,raf:0,kind,dispose:null};
    el.querySelector('[data-ui-close]').onclick=close;
    el.querySelector('.object-sound').onclick=e=>{toggleSound();e.currentTarget.textContent='SOUND — '+(state.sound?'ON':'OFF')};
    return current;
  }
  function launch(ctx){WellsUI.open(ctx.el)}
  function message(ctx,text){const el=ctx.el.querySelector('.object-message');if(el.textContent!==text)el.textContent=text}
  function loop(ctx,draw){
    let previous=0,elapsed=0;
    function frame(now){
      if(current!==ctx)return;
      const dt=document.hidden?0:Math.min(40,previous?now-previous:0);previous=now;elapsed+=dt;
      if(!document.hidden)draw(elapsed,dt/1000);
      ctx.raf=requestAnimationFrame(frame);
    }
    ctx.raf=requestAnimationFrame(frame);
  }
  function particles(canvas){
    const ctx=canvas.getContext('2d');let dots=[];
    function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=box.width*dpr;canvas.height=box.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    const observer=new ResizeObserver(resize);observer.observe(canvas);
    return {
      ctx,
      burst(x,y,count=25){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=45+Math.random()*150;dots.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-70,life:.5+Math.random()*.65})}dots=dots.slice(-160)},
      draw(dt,gravity=100){const {width,height}=canvas.getBoundingClientRect();ctx.clearRect(0,0,width,height);dots=dots.filter(p=>p.life>0);for(const p of dots){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=gravity*dt;ctx.globalAlpha=Math.min(1,p.life*2);ctx.strokeStyle='#f7d28d';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);ctx.stroke()}ctx.globalAlpha=1},
      dispose(){observer.disconnect();dots=[]}
    };
  }
  function openSentinel(){
    const ctx=shell('sentinel-experience','THE MANOR / AN OLD AGREEMENT','The sentinel<br> stirs.','Three strikes. Read the raised blade and meet it with your own. The house rewards a steady hand.');
    const el=ctx.el,bench=el.querySelector('.object-workbench');
    const game=new EstateEncounters.Sentinel(state.reduce);let clock=0,lastPhase='',lastRound=-1;
    bench.innerHTML=`<div class="duel-stage"><div class="sentinel-halo"></div><div class="sentinel-body">${knight}</div><div class="incoming-mark incoming-left">LEFT</div><div class="incoming-mark incoming-high">HIGH</div><div class="incoming-mark incoming-right">RIGHT</div><canvas class="duel-sparks" aria-hidden="true"></canvas><div class="player-sword">${sword}</div><div class="strike-track"><i></i></div></div><div class="guard-controls" aria-label="Sword guard"><button data-guard="left"><span>↖</span>LEFT <small>← / 1</small></button><button data-guard="high"><span>↑</span>HIGH <small>↑ / 2</small></button><button data-guard="right"><span>↗</span>RIGHT <small>→ / 3</small></button></div><p class="object-gesture">Move your blade with the pointer, drag on touch, or choose a guard.</p>`;
    el.querySelector('.object-progress').innerHTML='<div class="oath-marks" aria-label="Three parries"><i></i><i></i><i></i></div><span class="oath-count">0 / 3 PARRIES</span>';
    el.querySelector('.object-options').innerHTML=`<button class="object-primary" id="wakeSentinel">${memory.sentinel?'SPAR AGAIN':'WAKE THE SENTINEL'}</button><label class="unhurried-option"><input type="checkbox" ${state.reduce?'checked':''}> UNHURRIED MODE <span>Each guard advances the duel. No timer.</span></label><button class="object-secondary armory-reward" ${memory.sentinel?'':'hidden'}>ENTER THE ARMORY →</button>`;
    const stage=el.querySelector('.duel-stage'),blade=el.querySelector('.player-sword'),sparks=particles(el.querySelector('canvas'));
    const start=el.querySelector('#wakeSentinel'),relaxed=el.querySelector('input'),reward=el.querySelector('.armory-reward');
    message(ctx,memory.sentinel?'A familiar presence. The sentinel remembers your last bout.':'Something shifts behind the visor. It is waiting for you.');
    const guard=lane=>{
      if(game.phase!=='windup')return;
      game.choose(lane,clock);el.dataset.guard=lane;sound('guard');
      el.querySelectorAll('[data-guard]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guard===lane)));
    };
    start.onclick=()=>{
      game.unhurried=relaxed.checked;game.start(clock);el.dataset.phase='windup';start.hidden=true;reward.hidden=true;relaxed.disabled=true;lastPhase='';
      el.querySelector('[data-guard="high"]').focus();sound('guard');
    };
    reward.onclick=()=>{close();sceneTo('armory')};
    el.querySelectorAll('[data-guard]').forEach(b=>b.onclick=()=>guard(b.dataset.guard));
    function move(e){
      if(e.pointerType==='touch'&&e.buttons===0)return;
      const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
      blade.style.setProperty('--blade-x',Math.max(-38,Math.min(38,(x-.5)*80))+'px');
      const lane=x<.37?'left':x>.63?'right':'high';
      if(game.guard!==lane&&game.phase==='windup')guard(lane);
    }
    stage.onpointerdown=e=>{stage.setPointerCapture(e.pointerId);move(e)};stage.onpointermove=move;
    const key=e=>{
      if(current!==ctx||e.target.matches('input')||e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
      const lane={ArrowLeft:'left',ArrowUp:'high',ArrowRight:'right','1':'left','2':'high','3':'right'}[e.key];
      if(lane){e.preventDefault();guard(lane)}
    };
    addEventListener('keydown',key);
    ctx.dispose=()=>{sparks.dispose();removeEventListener('keydown',key)};
    launch(ctx);
    loop(ctx,(time,dt)=>{
      clock=time;game.advance(clock);
      const phase=game.phase;
      if(phase!==lastPhase||game.round!==lastRound){
        el.dataset.phase=phase;
        if(phase==='windup'){
          el.dataset.incoming=game.lane;
          delete el.dataset.result;
          if(game.guard)el.dataset.guard=game.guard;else delete el.dataset.guard;
          el.querySelectorAll('[data-guard]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guard===game.guard)));
          message(ctx,`${game.lane.toUpperCase()} STRIKE — ${game.unhurried?'choose the matching guard.':'hold your blade to meet it.'}`);
        }
        if(phase==='recovery'||phase==='won'){
          el.dataset.result=game.result;
          const box=stage.getBoundingClientRect();sparks.burst(box.width*.52,box.height*.48,state.reduce?7:38);sound(game.result==='parry'?'clash':'guard');
          message(ctx,game.result==='parry'?'Steel meets steel. Well held.':'A tap on your guard. Watch the raised blade and try that strike again.');
        }
        el.querySelectorAll('.oath-marks i').forEach((mark,i)=>mark.classList.toggle('earned',i<game.round));
        el.querySelector('.oath-count').textContent=game.round+' / 3 PARRIES';
        if(phase==='won'){
          memory.sentinel=true;save();collect('iron-key');sound('reward');
          message(ctx,'The sentinel bows. A forge mark drops into your palm. The armory is yours.');
          start.hidden=false;start.textContent='SPAR AGAIN';reward.hidden=false;relaxed.disabled=false;reward.focus();
        }
        lastPhase=phase;lastRound=game.round;
      }
      const remaining=game.phase==='windup'?(game.unhurried?1:Math.max(0,(game.deadline-clock)/(game.round===0?1900:1700))):0;
      stage.querySelector('.strike-track i').style.transform=`scaleX(${Math.min(1,remaining)})`;
      sparks.draw(dt);
    });
  }
  function openCompass(){
    const ctx=shell('compass-experience','THE CLEARING / A QUIET DETOUR','North is only<br> the beginning.','Turn the brass ring. Set each bearing, then take it. Three directions make a route the old compass remembers.');
    const el=ctx.el,route=new EstateEncounters.CompassRoute();
    const ticks=Array.from({length:72},(_,i)=>`<path d="M220 ${i%6===0?35:43}V${i%6===0?58:53}" transform="rotate(${i*5} 220 220)" stroke="${i%6===0?'#ead19b':'#877249'}" stroke-width="${i%6===0?2:1}"/>`).join('');
    el.querySelector('.object-workbench').innerHTML=`<div class="compass-dial" aria-hidden="true"><svg viewBox="0 0 440 440"><defs><radialGradient id="compassFace"><stop stop-color="#39403a"/><stop offset=".7" stop-color="#172422"/><stop offset="1" stop-color="#0c1415"/></radialGradient><linearGradient id="compassBrass"><stop stop-color="#4c3a22"/><stop offset=".25" stop-color="#c3a363"/><stop offset=".5" stop-color="#f0d9a0"/><stop offset=".75" stop-color="#9d7840"/><stop offset="1" stop-color="#49371f"/></linearGradient></defs><circle cx="220" cy="220" r="211" fill="url(#compassBrass)"/><circle cx="220" cy="220" r="197" fill="url(#compassFace)" stroke="#e2c990"/><circle cx="220" cy="220" r="167" fill="none" stroke="#5c614a"/>${ticks}<g fill="#dcca9f" font-family="Georgia,serif" font-size="23" text-anchor="middle"><text x="220" y="88">N</text><text x="363" y="227">E</text><text x="220" y="369">S</text><text x="77" y="227">W</text></g><g stroke="#6b7159" fill="#27332e"><path d="m220 102 22 96 96 22-96 22-22 96-22-96-96-22 96-22Z"/><path d="m139 139 81 58 81-58-58 81 58 81-81-58-81 58 58-81Z"/></g><g class="compass-needle"><path d="m220 102 14 118-14 14-14-14Z" fill="#d5b36e" stroke="#fff0bd"/><path d="m220 338 14-118-14-14-14 14Z" fill="#667f7a" stroke="#a7b4a6"/></g><circle cx="220" cy="220" r="15" fill="url(#compassBrass)"/><circle cx="220" cy="220" r="6" fill="#252c25"/></svg><span class="compass-index"></span></div><div class="bearing-display"><span>YOUR BEARING</span><strong>000°</strong><span class="bearing-lock">TURN TO ALIGN</span></div><label class="bearing-slider">TURN THE RING<input type="range" min="0" max="359" step="1" value="0" aria-label="Compass bearing"></label><div class="compass-controls"><button class="object-secondary" data-turn="-15" aria-label="Turn compass left 15 degrees">↶ 15°</button><button class="object-primary" id="takeBearing" disabled>TAKE BEARING</button><button class="object-secondary" data-turn="15" aria-label="Turn compass right 15 degrees">15° ↷</button></div>`;
    el.querySelector('.object-progress').innerHTML='<ol class="bearing-route"><li><span>01</span> RIDGELINE <b>315° NW</b></li><li><span>02</span> FIRST LIGHT <b>090° E</b></li><li><span>03</span> HOMEWARD <b>225° SW</b></li></ol>';
    el.querySelector('.object-options').innerHTML='<button class="object-secondary compass-reward" hidden>FOLLOW IT TO THE MAP ROOM →</button>';
    const dial=el.querySelector('.compass-dial'),slider=el.querySelector('input'),take=el.querySelector('#takeBearing');
    function render(){
      const previous=Number(el.dataset.rotation||0);
      const rotation=previous+((route.angle-previous+540)%360+360)%360-180;
      el.dataset.rotation=rotation;el.style.setProperty('--bearing',rotation+'deg');slider.value=route.angle;
      el.querySelector('.bearing-display strong').textContent=String(Math.round(route.angle)).padStart(3,'0')+'°';
      el.classList.toggle('bearing-aligned',route.aligned||route.complete);
      el.querySelector('.bearing-lock').textContent=route.complete?'ROUTE CHARTED':route.aligned?'ALIGNED · TAKE BEARING':'TURN TO ALIGN';
      take.disabled=!route.aligned;
      el.querySelectorAll('.bearing-route li').forEach((li,i)=>{li.classList.toggle('current',i===route.step);li.classList.toggle('charted',i<route.step)});
      message(ctx,route.complete?'Ridgeline. First light. Homeward. A compass earned, and a route to carry with you.':['Find the ridgeline: 315° northwest.','Now face the first light: 090° east.','One last turn homeward: 225° southwest.'][route.step]);
    }
    function turn(value){route.turn(value);render()}
    slider.oninput=e=>turn(Number(e.target.value));
    el.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>turn(route.angle+Number(b.dataset.turn)));
    function drag(e){const r=dial.getBoundingClientRect();turn(Math.round(Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI))}
    dial.onpointerdown=e=>{dial.setPointerCapture(e.pointerId);drag(e)};
    dial.onpointermove=e=>{if(dial.hasPointerCapture(e.pointerId))drag(e)};
    take.onclick=()=>{
      if(!route.confirm())return;sound('clash');render();
      if(route.complete){memory.compass=true;save();collect('compass');sound('reward');el.querySelector('.compass-reward').hidden=false;el.querySelector('.compass-reward').focus()}
    };
    el.querySelector('.compass-reward').onclick=()=>{close();sceneTo('map')};render();launch(ctx);
  }
  function applyFire(){
    document.documentElement.style.setProperty('--tended-fire',String(memory.fire));
  }
  function openFire(){
    const ctx=shell('fire-experience','THE CLEARING / AFTER DARK','Make yourself<br> at home.','A little wood. A little air. Drag a log into the fire, or tap one to add it. There is nowhere else you need to be.');
    const el=ctx.el;let heat=memory.fire,clock=0,breeze=0,stir=0;
    el.querySelector('.object-workbench').innerHTML=`<div class="hearth-stage"><canvas class="hearth-canvas" aria-hidden="true"></canvas><div class="fire-drop-zone">DROP A LOG HERE</div><div class="hearth-stones" aria-hidden="true"></div><div class="carried-log" hidden></div></div><div class="log-rack" aria-label="Firewood">${[1,2,3].map(i=>`<button class="fire-log" data-log="${i}" aria-label="Add log ${i} to the fire"><i></i><span>LOG ${i}</span></button>`).join('')}</div><div class="fire-controls"><button class="object-secondary" id="stirEmbers">STIR THE EMBERS</button><button class="object-secondary" id="settleFire">LET IT SETTLE</button></div>`;
    el.querySelector('.object-progress').innerHTML='<div class="fire-warmth"><span>THE CLEARING</span><div><i></i><i></i><i></i><i></i></div><strong></strong></div>';
    const canvas=el.querySelector('canvas'),stage=el.querySelector('.hearth-stage'),brush=canvas.getContext('2d');let width=0,height=0;
    const embers=[];
    function resize(){const r=stage.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;brush.setTransform(dpr,0,0,dpr,0,0)}
    const observer=new ResizeObserver(resize);observer.observe(stage);ctx.dispose=()=>observer.disconnect();
    function update(){
      el.querySelectorAll('.fire-warmth i').forEach((i,n)=>i.classList.toggle('warm',n<heat));
      el.querySelector('.fire-warmth strong').textContent=['','A FEW COALS','CATCHING','GOOD COMPANY','STAY A WHILE'][heat];
      message(ctx,['','The coals are still alive. Give them something to work with.','The wood catches. A little warmth finds its way into the clearing.','That is a proper fire. The kind that makes a story take longer.','Perfect. Stir the embers and watch what the night gives back.'][heat]);
      memory.fire=heat;save();applyFire();
    }
    function burst(count){for(let i=0;i<count;i++)embers.push({x:width*(.4+Math.random()*.2),y:height*.7,vx:(Math.random()-.5)*55,vy:-45-Math.random()*100,life:1+Math.random()*2});if(embers.length>130)embers.splice(0,embers.length-130)}
    function feed(button){
      if(button.disabled)return;button.disabled=true;button.classList.add('spent');heat=Math.min(4,heat+1);stir=1;burst(state.reduce?6:42);sound('guard');update();
      el.querySelector('#stirEmbers').focus({preventScroll:true});
    }
    el.querySelectorAll('[data-log]').forEach(button=>{
      let origin=null,moved=false;
      button.onclick=e=>{if(!moved||e.detail===0)feed(button);moved=false};
      button.onpointerdown=e=>{
        if(button.disabled)return;origin={x:e.clientX,y:e.clientY};moved=false;button.setPointerCapture(e.pointerId);
      };
      button.onpointermove=e=>{
        if(!origin)return;
        if(Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>8)moved=true;
        if(!moved)return;
        const ghost=el.querySelector('.carried-log'),r=stage.getBoundingClientRect();ghost.hidden=false;ghost.style.left=(e.clientX-r.left)+'px';ghost.style.top=(e.clientY-r.top)+'px';stage.classList.add('awaiting-log');
      };
      button.onpointerup=e=>{
        if(!origin)return;origin=null;el.querySelector('.carried-log').hidden=true;stage.classList.remove('awaiting-log');
        const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        if(moved&&x>.2&&x<.8&&y>.2&&y<.94)feed(button);
        else if(moved)message(ctx,'Bring the log over the glowing coals and let go.');
      };
      button.onpointercancel=()=>{origin=null;moved=false;el.querySelector('.carried-log').hidden=true;stage.classList.remove('awaiting-log')};
    });
    el.querySelector('#stirEmbers').onclick=()=>{stir=1;burst(state.reduce?7:55);sound('guard');message(ctx,'A thousand small stars, for a second. Then quiet again.')};
    el.querySelector('#settleFire').onclick=()=>{heat=1;el.querySelectorAll('[data-log]').forEach(b=>{b.disabled=false;b.classList.remove('spent')});update()};
    stage.onpointermove=e=>{const r=stage.getBoundingClientRect();breeze=((e.clientX-r.left)/r.width-.5)*50};
    stage.onpointerleave=()=>{breeze=0};
    update();launch(ctx);
    loop(ctx,(time,dt)=>{
      clock=time/1000;stir=Math.max(0,stir-dt*.8);brush.clearRect(0,0,width,height);
      const cx=width*.5,cy=height*.76,flameHeight=height*(.17+heat*.05),sway=state.reduce?0:Math.sin(clock*2)*9;
      const glow=brush.createRadialGradient(cx,cy-30,5,cx,cy-30,width*.47);glow.addColorStop(0,`rgba(236,127,35,${.18+heat*.035})`);glow.addColorStop(1,'rgba(226,96,12,0)');brush.fillStyle=glow;brush.fillRect(0,0,width,height);
      brush.save();brush.translate(cx,cy);for(const [x,y,rot] of [[-25,7,-.22],[20,10,.25],[0,-2,-.05]]){brush.save();brush.translate(x,y);brush.rotate(rot);brush.fillStyle='#302218';brush.strokeStyle='#785033';brush.lineWidth=2;brush.beginPath();brush.roundRect(-width*.17,-10,width*.34,23,10);brush.fill();brush.stroke();brush.strokeStyle='#bb6530';brush.beginPath();brush.moveTo(-width*.12,0);brush.lineTo(width*.12,4);brush.stroke();brush.restore()}brush.restore();
      for(let i=0;i<9;i++){
        const offset=(i-4)*width*.024,h=flameHeight*(.58+.36*Math.sin(i*2.4+1)),w=width*(.035+(i%3)*.008),f=state.reduce?0:Math.sin(clock*(2.5+i*.13)+i)*16;
        const x=cx+offset,y=cy-3,tipX=x+sway+f+breeze*.25,tipY=y-h-stir*height*.05;
        const gradient=brush.createLinearGradient(x,y,x,tipY);gradient.addColorStop(0,'#ffd781');gradient.addColorStop(.35,i%2?'#e99736':'#ffc965');gradient.addColorStop(1,'rgba(209,72,19,0)');brush.fillStyle=gradient;
        brush.beginPath();brush.moveTo(x-w,y);brush.bezierCurveTo(x-w*1.8,y-h*.4,tipX-w,tipY+h*.28,tipX,tipY);brush.bezierCurveTo(tipX+w*.3,tipY+h*.5,x+w*1.9,y-h*.24,x+w,y);brush.closePath();brush.fill();
      }
      if(!state.reduce&&Math.random()<dt*(4+heat*2))burst(1);
      for(let i=embers.length-1;i>=0;i--){const p=embers[i];p.life-=dt;if(p.life<=0){embers.splice(i,1);continue}p.x+=(p.vx+breeze*.3)*dt;p.y+=p.vy*dt;p.vy*=.995;brush.fillStyle=`rgba(255,204,112,${Math.min(1,p.life)})`;brush.beginPath();brush.arc(p.x,p.y,1.3,0,Math.PI*2);brush.fill()}
    });
  }
  // Route these objects before the old text-only handlers and decorative sword overlay.
  const baseAction=doAction;
  doAction=function(action){
    if(action==='armor-display'){openSentinel();return}
    if(action==='camp-compass'||action==='compass-case'){openCompass();return}
    if(action==='campfire'){openFire();return}
    return baseAction(action);
  };
  const armor=scenes.manor.hotspots.find(h=>h.action==='armor-display');if(armor)armor.sub='Wake the sentinel / three parries';
  const compass=scenes.camp.hotspots.find(h=>h.action==='camp-compass');if(compass)compass.sub='Turn the brass ring / follow a bearing';
  const fire=scenes.camp.hotspots.find(h=>h.action==='campfire');if(fire)fire.sub='Feed the fire / stir the embers';
  addEventListener('estate:before-scene',close);
  addEventListener('estate:scene',applyFire);
  applyFire();
})();
