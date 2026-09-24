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

  function openStars(){
    const shapes=[
      {
        name:'SWORD',
        subtitle:'A proper blade this time.',
        points:[
          {x:50,y:8},{x:54,y:54},{x:72,y:62},{x:58,y:66},{x:57,y:77},
          {x:50,y:91},{x:43,y:77},{x:42,y:66},{x:28,y:62},{x:46,y:54}
        ]
      },
      {
        name:'SAILBOAT',
        subtitle:'Mast, sail, hull.',
        points:[
          {x:50,y:13},{x:50,y:28},{x:50,y:48},{x:50,y:66},
          {x:70,y:66},{x:61,y:48},{x:52,y:31},{x:48,y:67},
          {x:28,y:67},{x:39,y:81},{x:64,y:81},{x:78,y:67}
        ]
      },
      {
        name:'SHARK',
        subtitle:'Nose, fin, tail.',
        points:[
          {x:16,y:52},{x:34,y:40},{x:56,y:41},{x:66,y:25},{x:69,y:43},
          {x:86,y:35},{x:80,y:52},{x:87,y:68},{x:67,y:59},{x:55,y:72},
          {x:37,y:65},{x:18,y:55}
        ]
      },
      {
        name:'SKIER',
        subtitle:'Downhill, obviously.',
        points:[
          {x:49,y:18},{x:49,y:31},{x:37,y:42},{x:57,y:43},{x:68,y:55},
          {x:53,y:54},{x:44,y:70},{x:29,y:83},{x:47,y:75},{x:63,y:84},
          {x:52,y:67},{x:59,y:52}
        ]
      },
      {
        name:'MOTORCYCLE',
        subtitle:'Two wheels and a bad idea.',
        points:[
          {x:24,y:69},{x:17,y:78},{x:24,y:86},{x:33,y:78},{x:26,y:71},
          {x:44,y:68},{x:54,y:55},{x:66,y:60},{x:73,y:69},{x:83,y:78},
          {x:76,y:86},{x:67,y:78},{x:75,y:71},{x:56,y:72},{x:45,y:70}
        ]
      }
    ];
    let round=0,path=[],locked=false;

    info(
      'THE SKY',
      'Constellation Run',
      '<p class="game-note">Trace each constellation in order. Start with the largest star; each next star is slightly smaller.</p>'+
      '<div class="constellation-meta"><strong id="constellationName"></strong><span id="constellationCount"></span></div>'+
      '<div class="constellation-progress" id="constellationProgress"></div>'+
      '<div class="star-field" id="starField"><svg class="star-lines" id="starLines" viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div>'+
      '<div class="constellation-sub" id="constellationSub"></div>'
    );

    const draw=()=>{
      const shape=shapes[round],field=$q('#starField'),svg=$q('#starLines');
      path=[];locked=false;
      $q('#constellationName').textContent=shape.name;
      $q('#constellationCount').textContent=(round+1)+' / '+shapes.length;
      $q('#constellationSub').textContent=shape.subtitle;
      $q('#constellationProgress').innerHTML=shapes.map((_,i)=>'<i class="'+(i<round?'done':i===round?'current':'')+'"></i>').join('');
      field.querySelectorAll('.star-node,.ambient-star').forEach(x=>x.remove());
      svg.innerHTML='';

      // Dim background stars make this feel like a sky rather than a diagram.
      for(let i=0;i<24;i++){
        const a=document.createElement('i');
        a.className='ambient-star';
        a.style.left=(6+((i*37)%89))+'%';
        a.style.top=(7+((i*53)%84))+'%';
        a.style.opacity=(.18+(i%4)*.08).toFixed(2);
        field.appendChild(a);
      }

      shape.points.forEach((s,i)=>{
        const b=document.createElement('button');
        b.className='star-node';
        b.dataset.star=i;
        b.style.left=s.x+'%';b.style.top=s.y+'%';
        const size=Math.max(8,19-i*.7);
        b.style.width=size+'px';b.style.height=size+'px';
        b.style.zIndex=3;
        b.setAttribute('aria-label',shape.name+' star '+(i+1));
        field.appendChild(b);
      });

      const redrawLines=()=>{
        svg.innerHTML='';
        for(let i=1;i<path.length;i++){
          const a=shape.points[path[i-1]],b=shape.points[path[i]];
          const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
          ln.setAttribute('x1',a.x);ln.setAttribute('y1',a.y);
          ln.setAttribute('x2',b.x);ln.setAttribute('y2',b.y);
          svg.appendChild(ln);
        }
      };

      $$q('[data-star]').forEach(b=>b.onclick=()=>{
        if(locked)return;
        const n=+b.dataset.star,expected=path.length;
        if(n!==expected){
          toast('CONSTELLATION LOST — START AGAIN');
          path=[];$$q('[data-star]').forEach(x=>x.classList.remove('used'));redrawLines();
          return;
        }
        path.push(n);b.classList.add('used');redrawLines();
        if(path.length===shape.points.length){
          locked=true;
          $q('#constellationProgress').children[round].classList.add('done');
          toast(shape.name+' FOUND');
          if(round<shapes.length-1){
            round++;
            later(draw,700);
          }else{
            collect('star-map');
            later(()=>info(
              'THE SKY',
              'Sky chart complete.',
              '<p><strong>Sword · Sailboat · Shark · Skier · Motorcycle.</strong></p><p>Five unofficial constellations. All considerably more useful than the real ones.</p>'
            ),700);
          }
        }
      });
    };
    draw();
  }

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
    race:{label:'FERRARI',mode:'ESTATE RUN',title:"Don't hit anything.",base:72,max:155,handling:52,spawn:980},
    aston:{label:'ASTON MARTIN',mode:'MIDNIGHT RUN',title:'Keep it clean after dark.',base:66,max:142,handling:47,spawn:1040},
    rover:{label:'RANGE ROVER',mode:'COUNTRY RUN',title:'Thread the gaps.',base:58,max:126,handling:42,spawn:1100}
  };
  let driveRAF=0,driveLast=0,driveSpawnAt=0,driveRunning=false,driveMode='race';
  let driveObstacles=[],driveElapsed=0,drivePoints=0,driveLevel=1;
  const driveKeys={left:false,right:false};

  function driveCfg(){return DRIVE[driveMode]||DRIVE.race}
  function clearDriveObjects(){
    driveObstacles.forEach(o=>o.el.remove());driveObstacles=[];
    $q('#driveObstacles').innerHTML='';
  }
  function roadLaneX(){
    return [37,43.5,50,56.5,63][Math.floor(Math.random()*5)];
  }
  function rectsOverlap(a,b,pad=0){
    return a.left+pad < b.right-pad &&
           a.right-pad > b.left+pad &&
           a.top+pad < b.bottom-pad &&
           a.bottom-pad > b.top+pad;
  }
  function spawnObstacle(now){
    const cfg=driveCfg();
    const count=Math.random()<Math.min(.34,.12+driveElapsed*.004)?2:1;
    const xs=[];
    while(xs.length<count){
      const x=roadLaneX();
      if(xs.every(v=>Math.abs(v-x)>=11))xs.push(x);
    }
    xs.forEach(x=>{
      const el=document.createElement('div');
      const kind=Math.random()<.22?'van':'car';
      el.className='drive-obstacle traffic-'+kind;
      el.style.left=x+'%';el.style.top='-14%';
      $q('#driveObstacles').appendChild(el);
      driveObstacles.push({el,x,y:-14});
    });
    const speedFactor=state.speed/cfg.base;
    const baseGap=Math.max(520,cfg.spawn-(driveElapsed*7));
    driveSpawnAt=now+(baseGap/speedFactor)*(.85+Math.random()*.38);
  }
  function updateDriveHud(){
    $q('#driveTimer').textContent=driveElapsed.toFixed(1);
    $q('#driveScore').textContent=Math.floor(drivePoints);
    $q('#driveBest').textContent=Number(localStorage.getItem('wells.driveBest')||0);
    $q('#driveSpeed').textContent=Math.round(state.speed);
    $q('#driveSpeedSmall').textContent=Math.round(state.speed);
    $q('#driveLevel').textContent=driveLevel;
  }
  function finishDrive(){
    if(!driveRunning)return;
    driveRunning=false;cancelAnimationFrame(driveRAF);
    const score=Math.floor(drivePoints),secs=driveElapsed.toFixed(1);
    const best=Math.max(score,Number(localStorage.getItem('wells.driveBest')||0));
    localStorage.setItem('wells.driveBest',String(best));
    $q('#driveOverlay').classList.add('hit');
    later(()=>$q('#driveOverlay').classList.remove('hit'),300);
    later(()=>{
      $q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true');
      clearDriveObjects();
      info('GARAGE / ESTATE RUN','CRASHED',`<p><strong>${secs} seconds</strong> alive · <strong>${score}</strong> points.</p><p>Best: <strong>${best}</strong>. The only rule is simple: if the cars do not touch, you live.</p>`);
    },360);
  }
  function driveLoop(now){
    if(!driveRunning)return;
    const cfg=driveCfg(),dt=Math.min(40,now-driveLast||16);driveLast=now;
    driveElapsed+=dt/1000;
    driveLevel=1+Math.floor(driveElapsed/12);
    const targetSpeed=Math.min(cfg.max,cfg.base+driveElapsed*1.45);
    state.speed+=Math.min(targetSpeed-state.speed,18*dt/1000);
    drivePoints+=(dt/1000)*(state.speed/cfg.base)*10;

    const steer=(driveKeys.right?1:0)-(driveKeys.left?1:0);
    if(steer){
      state.driveX=Math.max(32,Math.min(68,state.driveX+steer*cfg.handling*dt/1000));
      $q('#driveLaneCar').style.left=state.driveX+'%';
    }

    if(now>driveSpawnAt)spawnObstacle(now);
    const vy=(state.speed/72)*(.060*dt);
    const carRect=$q('#driveLaneCar').getBoundingClientRect();

    for(const o of driveObstacles){
      o.y+=vy;o.el.style.top=o.y+'%';
      if(o.y>68&&o.y<102){
        const obstacleRect=o.el.getBoundingClientRect();
        if(rectsOverlap(carRect,obstacleRect,5)){finishDrive();return}
      }
      if(o.y>114){o.el.remove();o.done=true}
    }
    driveObstacles=driveObstacles.filter(o=>!o.done);
    updateDriveHud();
    if(driveRunning)driveRAF=requestAnimationFrame(driveLoop);
  }
  function setDriveKey(k,v){if(k in driveKeys)driveKeys[k]=v}
  startDrive=function(type){
    driveRunning=false;cancelAnimationFrame(driveRAF);clearDriveObjects();
    driveMode=type==='aston'?'aston':type==='rover'?'rover':'race';
    const cfg=driveCfg();
    state.driveX=50;state.speed=cfg.base;driveElapsed=0;drivePoints=0;driveLevel=1;
    driveLast=performance.now();driveSpawnAt=driveLast+650;
    Object.keys(driveKeys).forEach(k=>driveKeys[k]=false);
    $q('#driveCarLabel').textContent=cfg.label;$q('#driveModeLabel').textContent=cfg.mode;$q('#driveTitle').textContent=cfg.title;
    $q('#driveMission').textContent='STAY ALIVE';$q('#driveLaneCar').style.left='50%';
    $q('#driveOverlay').classList.add('open');$q('#driveOverlay').setAttribute('aria-hidden','false');
    updateDriveHud();collect('road-key');driveRunning=true;driveRAF=requestAnimationFrame(driveLoop);
  };
  $q('#driveExit').onclick=()=>{driveRunning=false;cancelAnimationFrame(driveRAF);clearDriveObjects();$q('#driveOverlay').classList.remove('open');$q('#driveOverlay').setAttribute('aria-hidden','true')};

  const bindHold=(el,key)=>{
    if(!el)return;
    const on=e=>{e.preventDefault();setDriveKey(key,true)},off=e=>{e.preventDefault();setDriveKey(key,false)};
    el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off);
  };
  bindHold($q('#driveLeft'),'left');bindHold($q('#driveRight'),'right');

  addEventListener('keydown',e=>{
    if(!driveRunning)return;const k=e.key.toLowerCase();
    if(['arrowleft','arrowright','a','d'].includes(k))e.preventDefault();
    if(k==='a'||k==='arrowleft')setDriveKey('left',true);
    if(k==='d'||k==='arrowright')setDriveKey('right',true);
  });
  addEventListener('keyup',e=>{
    if(!driveRunning)return;const k=e.key.toLowerCase();
    if(k==='a'||k==='arrowleft')setDriveKey('left',false);
    if(k==='d'||k==='arrowright')setDriveKey('right',false);
  });

  document.body.dataset.scene=state.scene;renderHotspots(scenes[state.scene]);renderProps(scenes[state.scene]);$q('#sceneBg').style.backgroundPosition=bgPos(scenes[state.scene]);
})();