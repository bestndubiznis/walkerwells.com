/* WELLS gameplay pass — loaded after app.js */
(() => {
  const $q=s=>document.querySelector(s), $$q=s=>Array.from(document.querySelectorAll(s));
  const timers=[];
  const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};

  IMG.manor="/assets/scenes/manor-cinematic-hq.webp?v=hq2";
  IMG.nyc="/assets/scenes/nyc-christmas-hq.webp?v=hq2";
  IMG.archive="/assets/scenes/archive-hq.webp?v=archive2";
  IMG.map="/assets/scenes/map-room-hq.webp?v=map2";
  IMG.camp="/assets/scenes/camp-hq.webp?v=camp2";
  [IMG.manor,IMG.nyc,IMG.archive,IMG.map,IMG.camp].forEach(src=>{const im=new Image();im.src=src});

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
  scenes.camp={
    title:"The campfire.",
    eye:"WELLS / CAMPFIRE",
    copy:"Mountain air, firelight, Brevard memories, and a sky worth staying awake for.",
    hint:"Click the actual tent, fire, compass, carved tree, or the night sky.",
    bg:IMG.camp,
    bgPos:"center center",
    bgPosMobile:"26% center",
    hotspots:[
      {x:17,y:42,w:28,h:40,label:"THE TENT",sub:"Brevard / Camp Carolina",action:"tent"},
      {x:47,y:65,w:24,h:38,label:"THE FIRE",sub:"Stay a minute",action:"campfire"},
      {x:12,y:75,w:18,h:22,label:"OLD COMPASS",sub:"Left on the log",action:"camp-compass"},
      {x:93,y:35,w:9,h:22,label:"TREE CARVING",sub:"Three trees / mountain mark",action:"tree-carving"},
      {x:60,y:17,w:55,h:34,label:"THE SKY",sub:"Trace the hidden constellation",action:"stars-game"}
    ],
    collectibles:[]
  };
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
  scenes.archive={
    title:"The archive.",
    eye:"WELLS / ARCHIVE",
    copy:"Not a résumé. The things that actually earned wall space.",
    hint:"Click the specific relics: Yale, Santa Cruz 70.3, the ski backflip, Ponte Vedra Beach, or the archive index.",
    bg:IMG.archive,
    bgPos:"center center",
    hotspots:[
      {x:41,y:23,w:15,h:22,label:"YALE DIPLOMA",sub:"Education / one frame",action:"archive-yale"},
      {x:57,y:24,w:16,h:23,label:"IRONMAN 70.3",sub:"Santa Cruz / 5:29",action:"santa-relic"},
      {x:16,y:28,w:18,h:35,label:"SKI BACKFLIP",sub:"Unlocked / make it boring",action:"ski-relic"},
      {x:78,y:23,w:20,h:24,label:"PONTE VEDRA BEACH",sub:"A place that belongs on the wall",action:"archive-pontevedra"},
      {x:61,y:42,w:11,h:18,label:"FINISH LINE",sub:"The day behind the medal",action:"archive-finish"},
      {x:52,y:74,w:36,h:20,label:"ARCHIVE INDEX",sub:"Boss fights / adventures / skill unlocks",action:"archive-index"}
    ],
    collectibles:[]
  };
  scenes.map={
    title:"The map room.",
    eye:"WELLS / MAP ROOM",
    copy:"Where I came from, where I disappeared to, and what is next.",
    hint:"Click the framed trips, map pins, and travel books. The room is the itinerary.",
    bg:IMG.map,
    bgPos:"center center",
    hotspots:[
      {x:13,y:8,w:17,h:12,label:"SAN FRANCISCO",sub:"Home base",action:"place-sf"},
      {x:13,y:20,w:17,h:12,label:"BANFF",sub:"Canadian Rockies",action:"place-banff"},
      {x:13,y:33,w:17,h:12,label:"SANTA MONICA",sub:"California",action:"place-santamonica"},
      {x:13,y:46,w:17,h:12,label:"PERU",sub:"South America",action:"place-peru"},
      {x:13,y:58,w:17,h:12,label:"COSTA RICA",sub:"Six weeks",action:"place-costarica"},
      {x:84,y:9,w:17,h:12,label:"LONDON",sub:"Born here",action:"place-london"},
      {x:79,y:24,w:11,h:13,label:"EUROPE",sub:"Four months solo / gap year",action:"place-europe"},
      {x:85,y:36,w:17,h:13,label:"JAPAN",sub:"Coming soon / 2027",action:"place-japan"},
      {x:84,y:51,w:17,h:12,label:"VAIL, COLORADO",sub:"Mountain chapter",action:"place-vail"},
      {x:84,y:63,w:17,h:12,label:"SOUTHEAST ASIA",sub:"Trip with friends",action:"place-seasia"},
      {x:84,y:75,w:17,h:12,label:"SOUTH AFRICA",sub:"Childhood safari",action:"place-southafrica"},
      {x:39,y:27,w:8,h:8,label:"PONTE VEDRA",sub:"Northeast Florida",action:"place-pontevedra"},
      {x:40,y:22,w:8,h:8,label:"CONNECTICUT",sub:"Northeast chapter",action:"place-ct"},
      {x:39,y:33,w:8,h:8,label:"BAHAMAS",sub:"Many New Years",action:"place-bahamas"},
      {x:40,y:38,w:8,h:8,label:"JAMAICA",sub:"Learned to scuba dive",action:"place-jamaica"},
      {x:29,y:68,w:22,h:13,label:"TRAVEL BOOKS",sub:"Plot the next route",action:"map-route"}
    ],
    collectibles:[]
  };

  function bgPos(s){return innerWidth<=880?(s.bgPosMobile||s.bgPos||"center center"):(s.bgPos||"center center")}

  const baseRenderHotspots=renderHotspots;
  const isMobileWorld=()=>window.matchMedia('(max-width:880px)').matches;
  function renderMobileInteractions(s){
    const tray=$q('#mobileInteractions');if(!tray)return;
    const items=[
      ...(s.hotspots||[]).map(h=>({label:h.label,sub:h.sub||'',go:h.go,action:h.action})),
      ...(s.props||[]).map(p=>({label:p.label,sub:'Object interaction',action:p.action}))
    ];
    tray.innerHTML='<div class="mobile-interaction-kicker">EXPLORE</div><div class="mobile-interaction-scroll">'+
      items.map((h,i)=>'<button class="mobile-interaction" data-mobile-hot="'+i+'"><strong>'+h.label+'</strong>'+(h.sub?'<span>'+h.sub+'</span>':'')+'</button>').join('')+
      '</div>';
    $$q('[data-mobile-hot]').forEach(b=>{
      const h=items[+b.dataset.mobileHot];
      b.onclick=()=>h.go?sceneTo(h.go):doAction(h.action);
    });
    tray.classList.toggle('active',isMobileWorld()&&items.length>0);
  }
  renderHotspots=function(s){
    baseRenderHotspots(s);
    renderMobileInteractions(s);
  };
  function renderProps(s){const layer=$q('#propLayer');if(!layer)return;layer.innerHTML=(s.props||[]).map((p,i)=>`<button class="scene-prop ${p.type}" data-prop="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="${p.label}"></button>`).join('');$$q('[data-prop]').forEach(b=>{const p=s.props[+b.dataset.prop];b.onmouseenter=e=>showRoomCard(e,{label:p.label,sub:"Click to interact"});b.onmouseleave=hideRoomCard;b.onclick=()=>doAction(p.action)})}

  sceneTo=function(name,instant=false){const s=scenes[name];if(!s)return;closePanels();const go=()=>{state.scene=name;document.body.dataset.scene=name;$q('#sceneBg').style.backgroundImage=`url("${s.bg}")`;$q('#sceneBg').style.backgroundPosition=bgPos(s);$q('#sceneEyebrow').textContent=s.eye;$q('#sceneTitle').textContent=s.title;$q('#sceneCopy').textContent=s.copy;$q('#sceneHint').textContent=s.hint;$$q('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));renderHotspots(s);renderProps(s);document.body.dataset.season=state.season;document.body.dataset.storm=String(state.storm);later(()=>$q('#transition').classList.remove('on'),60)};if(instant){go();return}$q('#transition').classList.add('on');later(go,420)};
  addEventListener('resize',()=>{const s=scenes[state.scene];if(s){$q('#sceneBg').style.backgroundPosition=bgPos(s);renderMobileInteractions(s)}});

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
    if(a==='archive-yale'){info('ARCHIVE / EDUCATION','Yale University','<p>Statistics & Data Science.</p><p>Some chapters fit in a frame. Most of the useful parts do not.</p>');return}
    if(a==='archive-pontevedra'){info('ARCHIVE / PLACE','Ponte Vedra Beach','<p>A place important enough to earn permanent wall space.</p>');return}
    if(a==='archive-finish'){info('ARCHIVE / FINISH LINE','Santa Cruz','<p><strong>5:29 total.</strong></p><p>The photograph behind the medal.</p>');return}
    if(a==='archive-index'){info('ARCHIVE / INDEX','The system behind the wall','<p><strong>Boss Fights</strong> — major objectives with clean finish lines.</p><p><strong>Adventures</strong> — worth doing because the story is better afterwards.</p><p><strong>Skill Unlocks</strong> — capabilities that compound.</p>');return}
    if(a==='tree'){info('NYC / TREE','One ornament is different','<p>A tiny brass W is hanging deeper in the branches.</p><button id="takeOrnament" class="mini-action">TAKE IT</button>');later(()=>{$q('#takeOrnament').onclick=()=>{collect('ornament');toast('THE ESTATE HAS FOLLOWED YOU TO NEW YORK')}},0);return}
    if(a==='santa-relic'){info('RELIC / COMPLETED','IRONMAN 70.3 — SANTA CRUZ','<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p>');return}
    return baseDoAction(a)
  };

  const DRIVE={
    race:{label:'FERRARI',mode:'ESTATE EXPRESS',title:'Redline. No excuses.',base:72,max:132,accel:48,brake:72,handling:47,traffic:720},
    aston:{label:'ASTON MARTIN',mode:'MIDNIGHT EXPRESS',title:'Fast, composed, expensive.',base:64,max:116,accel:38,brake:64,handling:42,traffic:820},
    rover:{label:'RANGE ROVER',mode:'COUNTRY EXPRESS',title:'Mud is just another lane.',base:52,max:92,accel:30,brake:58,handling:34,traffic:900}
  };
  const DRIVE_STOPS=['THE MANOR','PRIVATE AIRSTRIP','MARINA','CITY CLUB','ALPINE LODGE','THE RANGE','OLD TOWN','TRACK PADDOCK'];
  let driveRAF=0,driveLast=0,driveSpawnAt=0,drivePickupAt=0,driveRunning=false,driveMode='race';
  let driveObstacles=[],drivePickups=[],driveDestination=null,driveDistance=0,driveScore=0,driveCash=0,driveStreak=0,driveTimer=45,drivePassenger=false,driveFareStart=0,driveFareTarget=0,driveDestinationLane=50;
  const driveKeys={left:false,right:false,gas:false,brake:false};

  function driveCfg(){return DRIVE[driveMode]||DRIVE.race}
  function laneX(){return [38,46,54,62][Math.floor(Math.random()*4)]}
  function clearDriveObjects(){
    driveObstacles.forEach(o=>o.el.remove());driveObstacles=[];
    drivePickups.forEach(o=>o.el.remove());drivePickups=[];
    if(driveDestination){driveDestination.remove();driveDestination=null}
    $q('#driveObstacles').innerHTML='';$q('#drivePickups').innerHTML='';$q('#driveDestination').innerHTML='';
  }
  function updateDriveHud(){
    $q('#driveTimer').textContent=Math.max(0,driveTimer).toFixed(1);
    $q('#driveCash').textContent=Math.round(driveCash);
    $q('#driveStreak').textContent=driveStreak;
    $q('#driveDistance').textContent=driveDistance.toFixed(2);
    $q('#driveScore').textContent=driveScore;
    $q('#driveSpeed').textContent=Math.round(state.speed);
  }
  function spawnTraffic(now){
    const el=document.createElement('div'),x=laneX(),kind=Math.random()<.18?'van':'car';
    el.className='drive-obstacle traffic-'+kind;el.style.left=x+'%';el.style.top='-12%';
    $q('#driveObstacles').appendChild(el);driveObstacles.push({el,x,y:-12,near:false,hit:false});
    driveSpawnAt=now+driveCfg().traffic*(.72+Math.random()*.62);
  }
  function spawnPassenger(now){
    if(drivePassenger||drivePickups.length)return;
    const el=document.createElement('div'),x=laneX();
    el.className='drive-passenger';el.style.left=x+'%';el.style.top='-10%';
    el.innerHTML='<b>RIDE</b><span>!</span>';
    $q('#drivePickups').appendChild(el);drivePickups.push({el,x,y:-10});
    drivePickupAt=now+5200+Math.random()*3500;
  }
  function beginFare(){
    drivePassenger=true;driveStreak=Math.max(1,driveStreak);
    driveFareStart=driveDistance;driveFareTarget=.42+Math.random()*.46;
    driveDestinationLane=laneX();
    const stop=DRIVE_STOPS[Math.floor(Math.random()*DRIVE_STOPS.length)];
    $q('#driveMission').textContent='DROP OFF';
    $q('#driveDestinationLabel').textContent=stop;
    toast('PASSENGER IN — '+stop);
  }
  function spawnDestinationGate(){
    if(!drivePassenger||driveDestination)return;
    const el=document.createElement('div');el.className='drive-gate';el.style.left=driveDestinationLane+'%';el.style.top='-8%';
    el.innerHTML='<span>DROP</span>';
    $q('#driveDestination').appendChild(el);driveDestination=el;
  }
  function completeFare(){
    const remaining=Math.max(0,driveTimer),bonus=Math.round(120+remaining*8+driveStreak*55);
    driveCash+=bonus;driveTimer=Math.min(60,driveTimer+9);driveStreak++;
    drivePassenger=false;driveDestination?.remove();driveDestination=null;
    $q('#driveMission').textContent='FIND A PASSENGER';$q('#driveDestinationLabel').textContent='NO FARE';
    toast('FARE +$'+bonus+' · +9 SEC');
    drivePickupAt=performance.now()+900;
  }
  function crash(){
    driveStreak=0;driveTimer=Math.max(0,driveTimer-4.5);state.speed=Math.max(34,state.speed-32);
    $q('#driveOverlay').classList.add('hit');later(()=>$q('#driveOverlay').classList.remove('hit'),260);
    toast('TRAFFIC — 4.5 SEC LOST');
  }
  function finishDrive(){
    if(!driveRunning)return;driveRunning=false;cancelAnimationFrame(driveRAF);
    const cash=Math.round(driveCash),fares=Math.max(0,driveStreak-1),dist=driveDistance.toFixed(2),near=driveScore;
    later(()=>{$q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true');clearDriveObjects();
      info('GARAGE / ESTATE EXPRESS','SHIFT OVER',`<p><strong>$${cash}</strong> earned · ${dist} mi · ${near} near misses.</p><p>The point is not to drive clean. The point is to make the clock nervous.</p>`);
    },180);
  }
  function driveLoop(now){
    if(!driveRunning)return;
    const cfg=driveCfg(),dt=Math.min(42,now-driveLast||16);driveLast=now;
    driveTimer-=dt/1000;if(driveTimer<=0){driveTimer=0;updateDriveHud();finishDrive();return}
    if(driveKeys.gas)state.speed=Math.min(cfg.max,state.speed+cfg.accel*dt/1000);
    else state.speed=Math.max(cfg.base,state.speed-10*dt/1000);
    if(driveKeys.brake)state.speed=Math.max(26,state.speed-cfg.brake*dt/1000);
    const steer=(driveKeys.right?1:0)-(driveKeys.left?1:0);
    if(steer){state.driveX=Math.max(34,Math.min(66,state.driveX+steer*cfg.handling*dt/1000));$q('#driveLaneCar').style.left=state.driveX+'%'}
    if(now>driveSpawnAt)spawnTraffic(now);
    if(now>drivePickupAt)spawnPassenger(now);

    driveDistance+=state.speed*(dt/3600000)*4.8;
    const vy=(state.speed/74)*(.062*dt);

    driveObstacles.forEach(o=>{
      o.y+=vy;o.el.style.top=o.y+'%';
      const dx=Math.abs(o.x-state.driveX);
      if(!o.hit&&o.y>76&&o.y<91&&dx<6.2){o.hit=true;crash();o.el.remove();o.done=true}
      else if(!o.near&&o.y>82&&o.y<94&&dx>=6.2&&dx<10.5){o.near=true;driveScore++;driveCash+=15+driveStreak*3;toast('NEAR MISS +$'+(15+driveStreak*3))}
      if(o.y>112){o.el.remove();o.done=true}
    });
    driveObstacles=driveObstacles.filter(o=>!o.done);

    drivePickups.forEach(p=>{
      p.y+=vy*.9;p.el.style.top=p.y+'%';
      if(p.y>76&&p.y<92&&Math.abs(p.x-state.driveX)<7.5){p.el.remove();p.done=true;beginFare()}
      else if(p.y>108){p.el.remove();p.done=true}
    });
    drivePickups=drivePickups.filter(p=>!p.done);

    if(drivePassenger&&!driveDestination&&driveDistance-driveFareStart>=driveFareTarget)spawnDestinationGate();
    if(driveDestination){
      const y=parseFloat(driveDestination.style.top)||-8,ny=y+vy*.92;driveDestination.style.top=ny+'%';
      if(ny>77&&ny<93){
        if(Math.abs(driveDestinationLane-state.driveX)<8){completeFare()}
      }else if(ny>108){
        driveDestination.remove();driveDestination=null;driveStreak=0;driveTimer=Math.max(0,driveTimer-6);
        drivePassenger=false;$q('#driveMission').textContent='FIND A PASSENGER';$q('#driveDestinationLabel').textContent='MISSED DROP';
        toast('MISSED DROP — 6 SEC LOST');drivePickupAt=now+1000;
      }
    }
    updateDriveHud();
    if(driveRunning)driveRAF=requestAnimationFrame(driveLoop);
  }
  function setDriveKey(k,v){if(k in driveKeys)driveKeys[k]=v}
  startDrive=function(type){
    driveRunning=false;cancelAnimationFrame(driveRAF);clearDriveObjects();
    driveMode=type==='aston'?'aston':type==='rover'?'rover':'race';
    const cfg=driveCfg();state.driveX=50;state.speed=cfg.base;driveDistance=0;driveScore=0;driveCash=0;driveStreak=0;driveTimer=45;drivePassenger=false;driveDestination=null;
    driveLast=performance.now();driveSpawnAt=driveLast+500;drivePickupAt=driveLast+700;
    Object.keys(driveKeys).forEach(k=>driveKeys[k]=false);
    $q('#driveCarLabel').textContent=cfg.label;$q('#driveModeLabel').textContent=cfg.mode;$q('#driveTitle').textContent=cfg.title;
    $q('#driveMission').textContent='FIND A PASSENGER';$q('#driveDestinationLabel').textContent='NO FARE';
    $q('#driveLaneCar').style.left='50%';$q('#driveOverlay').classList.add('open');$q('#driveOverlay').setAttribute('aria-hidden','false');
    updateDriveHud();collect('road-key');driveRunning=true;driveRAF=requestAnimationFrame(driveLoop);
  };
  $q('#driveExit').onclick=()=>{driveRunning=false;cancelAnimationFrame(driveRAF);clearDriveObjects();$q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true')};

  const bindHold=(el,key)=>{
    if(!el)return;
    const on=e=>{e.preventDefault();setDriveKey(key,true)},off=e=>{e.preventDefault();setDriveKey(key,false)};
    el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off);
  };
  bindHold($q('#driveLeft'),'left');bindHold($q('#driveRight'),'right');bindHold($q('#driveGas'),'gas');bindHold($q('#driveBrake'),'brake');

  addEventListener('keydown',e=>{
    if(!driveRunning)return;const k=e.key.toLowerCase();
    if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].includes(k))e.preventDefault();
    if(k==='a'||k==='arrowleft')setDriveKey('left',true);
    if(k==='d'||k==='arrowright')setDriveKey('right',true);
    if(k==='w'||k==='arrowup')setDriveKey('gas',true);
    if(k==='s'||k==='arrowdown')setDriveKey('brake',true);
  });
  addEventListener('keyup',e=>{
    if(!driveRunning)return;const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft')setDriveKey('left',false);
    if(k==='d'||k==='arrowright')setDriveKey('right',false);
    if(k==='w'||k==='arrowup')setDriveKey('gas',false);
    if(k==='s'||k==='arrowdown')setDriveKey('brake',false);
  });

  document.body.dataset.scene=state.scene;renderHotspots(scenes[state.scene]);renderProps(scenes[state.scene]);$q('#sceneBg').style.backgroundPosition=bgPos(scenes[state.scene]);
})();