/* WELLS gameplay pass — loaded after app.js */
(() => {
  const $q=s=>document.querySelector(s), $$q=s=>Array.from(document.querySelectorAll(s));
  const timers=[];
  const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};

  IMG.manor="/assets/scenes/manor-cinematic.webp";
  IMG.nyc="/assets/scenes/nyc-christmas.webp";
  [IMG.manor,IMG.nyc].forEach(src=>{const im=new Image();im.src=src});

  scenes.manor={
    title:"The manor.",
    eye:"WELLS / MANOR",
    copy:"Firelight, old wood, armor, books, and a grand piano. This is the room we meant.",
    hint:"The visible objects are the interactions: fireplace, piano, armor, painting, study doorway and center table.",
    bg:IMG.manor,
    bgPos:"center center",
    hotspots:[
      {x:49,y:45,w:20,h:31,label:"FIREPLACE",sub:"Five knocks. Not one.",action:"fireplace"},
      {x:84,y:48,w:27,h:33,label:"GRAND PIANO",sub:"Hear it. Repeat it.",action:"piano"},
      {x:30,y:38,w:12,h:30,label:"SUIT OF ARMOR",sub:"Older skills / hidden passage clue",action:"armor-display"},
      {x:49,y:16,w:27,h:23,label:"THE PAINTING",sub:"Look behind the frame",action:"portrait"},
      {x:9,y:32,w:17,h:34,label:"STUDY DOORWAY",sub:"Books, maps and bad ideas",go:"study"},
      {x:61,y:72,w:31,h:20,label:"CENTER TABLE",sub:"Books, notes, one unfinished plan",action:"manor-table"}
    ]
  };
  scenes.camp.bgPos="center 82%";
  scenes.camp.bgPosMobile="center 58%";
  scenes.camp.hotspots=[
    {x:51,y:66,w:26,h:28,label:"THE FIRE",sub:"Stay a minute",action:"campfire"},
    {x:72,y:18,w:50,h:26,label:"THE SKY",sub:"Trace the hidden constellation",action:"stars-game"},
    {x:20,y:60,w:26,h:36,label:"THE TENT",sub:"No agenda",action:"tent"},
    {x:34,y:78,w:15,h:14,label:"OLD COMPASS",sub:"Left beside a log",action:"camp-compass"},
    {x:82,y:67,w:16,h:18,label:"TREE CARVING",sub:"Three letters / one date",action:"tree-carving"}
  ];
  scenes.nyc={
    title:"New York. December.",
    eye:"WELLS / NYC",
    copy:"Christmas inside. Snow and brick buildings across the street. This is the Manhattan room we meant.",
    hint:"Click the objects you can actually see: tree, desk, windows, tuxedo, fireplace and bar cart.",
    bg:IMG.nyc,
    bgPos:"center center",
    hotspots:[
      {x:35,y:37,w:25,h:48,label:"CHRISTMAS TREE",sub:"One ornament is different",action:"tree"},
      {x:61,y:49,w:30,h:26,label:"MISSION DESK",sub:"Dossiers & next moves",action:"mission"},
      {x:70,y:25,w:45,h:38,label:"THE VIEW",sub:"Snowy brick buildings across the street",action:"windows"},
      {x:92,y:44,w:13,h:30,label:"DINNER JACKET",sub:"Suit up",action:"suit"},
      {x:7,y:46,w:14,h:34,label:"FIREPLACE",sub:"Warm room / cold city",action:"nyc-fireplace"},
      {x:91,y:61,w:12,h:23,label:"BAR CART",sub:"Inspect the setup",action:"nyc-bar"}
    ],
    props:[{x:57,y:70,type:"snowglobe",action:"snowglobe",label:"SNOW GLOBE"}]
  };
  scenes.archive.hotspots=[
    {x:27,y:50,w:20,h:27,label:"BOSS FIGHTS",sub:"Clean finish lines",action:"boss"},
    {x:51,y:45,w:20,h:27,label:"ADVENTURES",sub:"Worth it for the story",action:"adventure"},
    {x:73,y:52,w:20,h:27,label:"SKILL UNLOCKS",sub:"Capabilities that compound",action:"skill"},
    {x:88,y:42,w:15,h:26,label:"VAULT",sub:"Three-number combination",action:"vault-game"},
    {x:42,y:71,w:14,h:17,label:"RACE RELIC",sub:"Santa Cruz / 5:29",action:"santa-relic"},
    {x:66,y:70,w:14,h:17,label:"SKI PASS",sub:"Backflip — unlocked",action:"ski-relic"},
    {x:18,y:76,w:15,h:16,label:"UNMARKED DRAWER",sub:"No category",action:"locked-drawer"}
  ];
  scenes.map.hotspots=scenes.map.hotspots.map(h=>h.action==="map-route"?{...h,sub:"Plot it correctly"}:h);

  function bgPos(s){return innerWidth<=880?(s.bgPosMobile||s.bgPos||"center center"):(s.bgPos||"center center")}
  function renderProps(s){const layer=$q('#propLayer');if(!layer)return;layer.innerHTML=(s.props||[]).map((p,i)=>`<button class="scene-prop ${p.type}" data-prop="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="${p.label}"></button>`).join('');$$q('[data-prop]').forEach(b=>{const p=s.props[+b.dataset.prop];b.onmouseenter=e=>showRoomCard(e,{label:p.label,sub:"Click to interact"});b.onmouseleave=hideRoomCard;b.onclick=()=>doAction(p.action)})}

  sceneTo=function(name,instant=false){const s=scenes[name];if(!s)return;closePanels();const go=()=>{state.scene=name;$q('#sceneBg').style.backgroundImage=`url("${s.bg}")`;$q('#sceneBg').style.backgroundPosition=bgPos(s);$q('#sceneEyebrow').textContent=s.eye;$q('#sceneTitle').textContent=s.title;$q('#sceneCopy').textContent=s.copy;$q('#sceneHint').textContent=s.hint;$$q('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));renderHotspots(s);renderProps(s);document.body.dataset.season=state.season;document.body.dataset.storm=String(state.storm);later(()=>$q('#transition').classList.remove('on'),60)};if(instant){go();return}$q('#transition').classList.add('on');later(go,420)};
  addEventListener('resize',()=>{const s=scenes[state.scene];if(s)$q('#sceneBg').style.backgroundPosition=bgPos(s)});

  function playTone(note,duration=.28){try{const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)()),freq={C:261.63,D:293.66,E:329.63,F:349.23,G:392,A:440,B:493.88}[note]||330,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.12,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+duration+.03)}catch(e){}}

  function openPiano(){info('MANOR / PIANO','Repeat the phrase',`<p class="game-note">Hear the four-note phrase, then play it back. The crest gives away the answer if you inspect it first.</p><button id="pianoListen" class="mini-action">HEAR THE PHRASE</button><div class="piano-progress" id="pianoProgress"><i></i><i></i><i></i><i></i></div><div class="piano-keys">${['C','D','E','F','G','A','B'].map((n,i)=>`<button class="piano-key ${i%3===1?'blackish':''}" data-note="${n}">${n}</button>`).join('')}</div>`);const target=['C','E','G','B'];let entered=[],locked=false;const flash=n=>{const k=$q(`[data-note="${n}"]`);if(!k)return;k.classList.add('active');playTone(n);later(()=>k.classList.remove('active'),250)};const render=()=>$$q('#pianoProgress i').forEach((d,i)=>d.classList.toggle('on',i<entered.length));const listen=()=>{locked=true;entered=[];render();target.forEach((n,i)=>later(()=>flash(n),i*410));later(()=>{locked=false;toast('YOUR TURN')},target.length*410+100)};$q('#pianoListen').onclick=listen;$$q('[data-note]').forEach(k=>k.onclick=()=>{if(locked)return;const n=k.dataset.note;flash(n);entered.push(n);render();const i=entered.length-1;if(n!==target[i]){toast('WRONG NOTE — RESET');entered=[];render();return}if(entered.length===target.length){collect('watch');locked=true;later(()=>info('MANOR / PIANO','Sequence accepted.','<p>A small drawer under the keyboard clicks open.</p><p><strong>Inside: the estate watch.</strong></p>'),250)}});listen()}

  function openForge(){info('ARMORY / FORGE','Strike. Then quench.',`<p class="game-note">Two clean timing windows. Miss and the steel goes back in the fire.</p><div class="timing-game"><div id="timingLabel" class="timing-meta"><span>PHASE 1 / STRIKE</span><span>GOLD ZONE</span></div><div id="timingTrack" class="timing-track"><span class="zone"></span><i id="timingMarker" class="marker"></i></div><button id="timingHit" class="mini-action">STRIKE</button></div>`);let phase=1,pos=0,dir=1,t;const start=()=>{clearInterval(t);pos=0;dir=1;t=setInterval(()=>{const m=$q('#timingMarker');if(!m){clearInterval(t);return}pos+=dir*(phase===1?2.9:3.5);if(pos>=96||pos<=0)dir*=-1;m.style.left=pos+'%'},24)};start();$q('#timingHit').onclick=()=>{const good=phase===1?(pos>43&&pos<57):(pos>61&&pos<71);if(!good){toast(phase===1?'MISS — BACK IN THE FIRE':'TOO EARLY — STEAM EVERYWHERE');phase=1;$q('#timingTrack').classList.remove('quench');$q('#timingLabel').innerHTML='<span>PHASE 1 / STRIKE</span><span>GOLD ZONE</span>';$q('#timingHit').textContent='STRIKE';start();return}if(phase===1){toast('CLEAN STRIKE');phase=2;$q('#timingTrack').classList.add('quench');$q('#timingLabel').innerHTML='<span>PHASE 2 / QUENCH</span><span>BLUE ZONE</span>';$q('#timingHit').textContent='QUENCH';start()}else{clearInterval(t);collect('iron-key');info('ARMORY / FORGE','FORGE MARK — UNLOCKED','<p>Clean strike. Clean quench.</p><p>The mark goes into the collection.</p>')}}}

  function openVault(){info('ARCHIVE / VAULT','Three-number combination',`<p class="vault-clue">The combination is already in the archive. One completed boss fight has the answer.</p><div class="vault-dials">${[0,1,2].map(i=>`<div class="dial"><button data-dial="${i}" data-dir="1">▲</button><strong id="dial${i}">0</strong><button data-dial="${i}" data-dir="-1">▼</button></div>`).join('')}</div><button id="vaultOpen" class="mini-action">OPEN VAULT</button>`);const vals=[0,0,0];$$q('[data-dial]').forEach(b=>b.onclick=()=>{const i=+b.dataset.dial;vals[i]=(vals[i]+(+b.dataset.dir)+10)%10;$q('#dial'+i).textContent=vals[i]});$q('#vaultOpen').onclick=()=>{if(vals.join('')==='529'){collect('vault-seal');info('VAULT / OPEN','IRONMAN 70.3 — SANTA CRUZ','<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p><p>No speech. Put the proof in the case and keep moving.</p>')}else toast('THE LOCK DOES NOT MOVE')}}

  function openRoute(){info('MAP ROOM / ROUTE','Plot the improbable year',`<p class="game-note">Clue: Pacific → cold north → Alps → islands → steppe.</p><div class="route-game">${['CALIFORNIA','ALASKA','ST. MORITZ','BVI','MONGOLIA','THAILAND'].map(n=>`<button data-route="${n}">${n}</button>`).join('')}</div><div id="routePath" class="route-path">START →</div>`);const target=['CALIFORNIA','ALASKA','ST. MORITZ','BVI','MONGOLIA'];let route=[];$$q('[data-route]').forEach(b=>b.onclick=()=>{const n=b.dataset.route;if(n!==target[route.length]){toast('ROUTE BREAKS — START AGAIN');route=[];$$q('[data-route]').forEach(x=>x.classList.remove('done'));$q('#routePath').textContent='START →';return}route.push(n);b.classList.add('done');$q('#routePath').textContent='START → '+route.join(' → ');if(route.length===target.length){collect('map-pin');later(()=>info('MAP ROOM / ROUTE','Route accepted.','<p>It makes almost no logistical sense.</p><p><strong>Perfect.</strong></p>'),350)}})}

  function openStars(){info('THE SKY','Trace the Sword','<p class="game-note">Start with the brightest star. Then keep choosing the next brightest.</p><div class="star-field" id="starField"><svg class="star-lines" id="starLines" viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div>');const stars=[{x:18,y:22,s:22},{x:74,y:18,s:8},{x:48,y:38,s:19},{x:82,y:65,s:10},{x:35,y:70,s:16},{x:58,y:84,s:13}],order=[0,2,4,5,3,1],field=$q('#starField');stars.forEach((s,i)=>{const b=document.createElement('button');b.className='star-node';b.dataset.star=i;b.style.left=s.x+'%';b.style.top=s.y+'%';b.style.width=s.s+'px';b.style.height=s.s+'px';b.setAttribute('aria-label','Star '+(i+1));field.appendChild(b)});let path=[];const lines=()=>{const svg=$q('#starLines');svg.innerHTML='';for(let i=1;i<path.length;i++){const a=stars[path[i-1]],b=stars[path[i]],ln=document.createElementNS('http://www.w3.org/2000/svg','line');ln.setAttribute('x1',a.x);ln.setAttribute('y1',a.y);ln.setAttribute('x2',b.x);ln.setAttribute('y2',b.y);svg.appendChild(ln)}};$$q('[data-star]').forEach(b=>b.onclick=()=>{const n=+b.dataset.star;if(n!==order[path.length]){toast('CONSTELLATION LOST — START AGAIN');path=[];$$q('[data-star]').forEach(x=>x.classList.remove('used'));lines();return}path.push(n);b.classList.add('used');lines();if(path.length===order.length){collect('star-map');later(()=>info('THE SKY','Sword found.','<p>Unofficial constellation #1.</p><p>The others are a motorcycle, sailboat, shark and skier.</p>'),400)}})}

  function openWatch(){info('DRESSING ROOM / WATCH','Wind the movement','<p class="game-note">Ten turns. The second hand will tell you when it is alive.</p><div class="watch-game"><div class="watch-face"><i id="watchHand" class="watch-hand"></i></div><button id="windCrown" class="wind-crown">↻</button><div class="wind-meter"><i id="windFill"></i></div><div id="windLabel" class="game-note">0 / 10 TURNS</div></div>');let turns=0;$q('#windCrown').onclick=()=>{turns=Math.min(10,turns+1);$q('#watchHand').style.transform='rotate('+(turns*108)+'deg)';$q('#windFill').style.width=(turns*10)+'%';$q('#windLabel').textContent=turns+' / 10 TURNS';playTone('E',.1);if(turns===10){collect('watch');later(()=>info('DRESSING ROOM / WATCH','Running.','<p>Mechanical, wound, and now yours.</p>'),350)}}}

  function openSnowGlobe(){info('NYC / SNOW GLOBE','Shake it','<p class="game-note">Drag the globe hard from side to side, or use the button.</p><div class="snowglobe-game"><div id="globeBig" class="globe-big"></div><div class="shake-meter"><i id="shakeFill"></i></div><button id="shakeButton" class="mini-action">SHAKE</button></div>');let energy=0,lastX=null,down=false,globe=$q('#globeBig');const snow=()=>{for(let i=0;i<12;i++){const f=document.createElement('i');f.className='snowflake';f.textContent='•';f.style.left=(10+Math.random()*80)+'%';f.style.top=(Math.random()*25)+'%';globe.appendChild(f);later(()=>f.remove(),800)}};const add=n=>{energy=Math.min(100,energy+n);$q('#shakeFill').style.width=energy+'%';snow();if(energy>=100&&!globe.classList.contains('revealed')){globe.classList.add('revealed');toast('SOMETHING IS INSIDE THE BASE');later(()=>{const b=document.createElement('button');b.className='mini-action';b.textContent='OPEN THE BASE';b.onclick=()=>{collect('ornament');info('NYC / FOUND','A tiny brass W','<p>The estate has apparently followed you to New York.</p>')};$q('#infoBody').appendChild(b)},300)}};globe.onpointerdown=e=>{down=true;lastX=e.clientX;globe.setPointerCapture(e.pointerId)};globe.onpointermove=e=>{if(!down)return;const d=Math.abs(e.clientX-lastX);if(d>18){add(Math.min(18,d/2));lastX=e.clientX}};globe.onpointerup=()=>{down=false;lastX=null};$q('#shakeButton').onclick=()=>add(20)}

  const baseDoAction=doAction;
  doAction=function(a){
    if(a==='piano'){openPiano();return}
    if(a==='forge'){openForge();return}
    if(a==='vault-game'){openVault();return}
    if(a==='map-route'){openRoute();return}
    if(a==='stars-game'){openStars();return}
    if(a==='wardrobe-watch'){openWatch();return}
    if(a==='snowglobe'){openSnowGlobe();return}
    if(a==='portrait'){info('MANOR / PAINTING','Four letters behind the frame','<p><strong>C · E · G · B</strong></p><p>Probably unrelated to the grand piano twenty feet away.</p>');return}
    if(a==='armor-display'){info('MANOR / ARMOR','Older skills','<p>Blacksmithing. Archery. Blades. Craft.</p><p>The armor is not the entrance. The fireplace is.</p>');return}
    if(a==='manor-table'){info('MANOR / TABLE','A life well lived','<p>One boss fight. One adventure. One skill unlock. Repeat until the stories are better than the plans.</p>');return}
    if(a==='nyc-fireplace'){info('NYC / FIREPLACE','Inside / outside','<p>Fire inside. Snow outside. Brick across the street. Somewhere to be later.</p>');return}
    if(a==='nyc-bar'){info('NYC / BAR CART','Before going out','<p>Glassware, old bottles, and a dinner jacket waiting nearby.</p><p>The actual mission is still on the desk.</p>');return}
    if(a==='tree'){info('NYC / TREE','One ornament is different','<p>A tiny brass W is hanging deeper in the branches.</p><button id="takeOrnament" class="mini-action">TAKE IT</button>');later(()=>{$q('#takeOrnament').onclick=()=>{collect('ornament');toast('THE ESTATE HAS FOLLOWED YOU TO NEW YORK')}},0);return}
    if(a==='santa-relic'){info('RELIC / COMPLETED','IRONMAN 70.3 — SANTA CRUZ','<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p>');return}
    return baseDoAction(a)
  };

  const DRIVE={race:{label:'FERRARI / TRACK',mode:'APEX RUN',title:'Late apex. Clean hands.',speed:112,goal:1.8,lives:2,spawn:650,kind:'cone'},aston:{label:'ASTON / NIGHT',mode:'NIGHT DRIVE',title:'Somewhere after rain.',speed:78,goal:1.45,lives:3,spawn:850,kind:'traffic'},rover:{label:'RANGE / ESTATE',mode:'WET ESTATE ROAD',title:'Rain belongs on the windshield.',speed:56,goal:1.05,lives:3,spawn:750,kind:'mud'}};
  let driveRAF=0,driveLast=0,driveSpawnAt=0,driveRunning=false,driveObstacles=[],driveMode='aston',driveDistance=0,driveScore=0,driveLives=3;
  function spawnObstacle(now){const cfg=DRIVE[driveMode]||DRIVE.aston,lanes=[38,50,62],lane=lanes[Math.floor(Math.random()*lanes.length)],el=document.createElement('div');el.className='drive-obstacle '+(cfg.kind==='traffic'?'':cfg.kind);el.style.left=lane+'%';el.style.top='-8%';$q('#roadObstacles').appendChild(el);driveObstacles.push({el,x:lane,y:-8,hit:false});driveSpawnAt=now+cfg.spawn*(.8+Math.random()*.55)}
  function finishDrive(success,msg){if(!driveRunning)return;driveRunning=false;cancelAnimationFrame(driveRAF);const dist=driveDistance.toFixed(2),score=driveScore,lives=driveLives;later(()=>{$q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true');info('GARAGE / DRIVE',success?'RUN COMPLETE':'RUN ENDED',`<p>${msg}</p><p><strong>${dist} mi</strong> · ${score} obstacles avoided · ${lives} composure remaining.</p>`)},220)}
  function driveLoop(now){if(!driveRunning)return;const cfg=DRIVE[driveMode]||DRIVE.aston,dt=Math.min(48,now-driveLast||16);driveLast=now;if(now>driveSpawnAt)spawnObstacle(now);driveDistance+=state.speed*(dt/3600000)*4.2;$q('#driveDistance').textContent=driveDistance.toFixed(2);const vy=(state.speed/72)*(.055*dt);driveObstacles.forEach(o=>{o.y+=vy;o.el.style.top=o.y+'%';if(!o.hit&&o.y>77&&o.y<91&&Math.abs(o.x-state.driveX)<7.5){o.hit=true;driveLives--;$q('#driveLives').textContent=driveLives;$q('#driveOverlay').classList.add('hit');later(()=>$q('#driveOverlay').classList.remove('hit'),260);state.speed=Math.max(38,state.speed-18);$q('#driveSpeed').textContent=Math.round(state.speed);toast(driveMode==='race'?'CONE — LOST TIME':driveMode==='rover'?'MUD HOLE — COMPOSURE -1':'TRAFFIC — COMPOSURE -1');o.el.remove();o.done=true;if(driveLives<=0)finishDrive(false,'Too many mistakes. The estate suggests another run.')}else if(o.y>108){o.el.remove();o.done=true;driveScore++;$q('#driveScore').textContent=driveScore}});driveObstacles=driveObstacles.filter(o=>!o.done);if(driveDistance>=cfg.goal){finishDrive(true,'Clean run. Put the key back before somebody notices.');return}if(driveRunning)driveRAF=requestAnimationFrame(driveLoop)}
  function steer(d){if(!driveRunning)return;state.driveX=Math.max(36,Math.min(64,state.driveX+d));$q('#driveLaneCar').style.left=state.driveX+'%'}
  startDrive=function(type){driveRunning=false;cancelAnimationFrame(driveRAF);const cfg=DRIVE[type]||DRIVE.aston;driveMode=type;state.driveX=50;state.speed=cfg.speed;driveDistance=0;driveScore=0;driveLives=cfg.lives;driveObstacles=[];driveRunning=true;driveLast=performance.now();driveSpawnAt=driveLast+700;$q('#driveCarLabel').textContent=cfg.label;$q('#driveModeLabel').textContent=cfg.mode;$q('#driveTitle').textContent=cfg.title;$q('#driveMission').textContent=cfg.goal.toFixed(2)+' MI CLEAN';$q('#driveSpeed').textContent=state.speed;$q('#driveDistance').textContent='0.00';$q('#driveScore').textContent='0';$q('#driveLives').textContent=driveLives;$q('#driveLaneCar').style.left='50%';$q('#roadObstacles').innerHTML='';$q('#driveOverlay').classList.add('open');$q('#driveOverlay').setAttribute('aria-hidden','false');collect('road-key');driveRAF=requestAnimationFrame(driveLoop)};
  $q('#driveExit').onclick=()=>{driveRunning=false;cancelAnimationFrame(driveRAF);$q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true');$q('#roadObstacles').innerHTML=''};
  $q('#driveLeft').onclick=()=>steer(-4);$q('#driveRight').onclick=()=>steer(4);
  addEventListener('keydown',e=>{if(!driveRunning)return;const k=e.key.toLowerCase();if(k==='a'||e.key==='ArrowLeft')steer(-4);if(k==='d'||e.key==='ArrowRight')steer(4)});

  renderHotspots(scenes[state.scene]);renderProps(scenes[state.scene]);$q('#sceneBg').style.backgroundPosition=bgPos(scenes[state.scene]);
})();