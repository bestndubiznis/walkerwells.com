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
    copy:"The heart of the estate: firelight, old wood, books, armor, and a grand piano.",
    hint:"Explore the fireplace, piano, armor, painting, study doorway, and center table.",
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
    copy:"A quiet clearing in the mountains, built around Brevard memories, firelight, and a very good night sky.",
    hint:"Explore the tent, fire, compass, carved tree, or trace a constellation overhead.",
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
    copy:"A Manhattan apartment in December: Christmas tree lit, snow outside, and the city waiting downstairs.",
    hint:"Explore the tree, mission desk, view, dinner jacket, fireplace, bar cart, and snow globe.",
    bg:IMG.nyc,
    bgPos:"center center",
    hotspots:[
      {x:35,y:37,w:25,h:48,label:"CHRISTMAS TREE",sub:"A brass ornament is tucked inside",action:"tree"},
      {x:61,y:49,w:30,h:26,label:"MISSION DESK",sub:"Tonight’s plan and current outfit",action:"mission"},
      {x:70,y:25,w:45,h:38,label:"THE VIEW",sub:"Snowy brick buildings across the street",action:"windows"},
      {x:92,y:44,w:13,h:30,label:"DINNER JACKET",sub:"Suit up",action:"suit"},
      {x:7,y:46,w:14,h:34,label:"FIREPLACE",sub:"Warm room / cold city",action:"nyc-fireplace"},
      {x:91,y:61,w:12,h:23,label:"BAR CART",sub:"One last stop before heading out",action:"nyc-bar"}
    ],
    props:[{x:57,y:70,type:"snowglobe",action:"snowglobe",label:"SNOW GLOBE"}]
  };
  scenes.archive={
    title:"The archive.",
    eye:"WELLS / ARCHIVE",
    copy:"A room for things that became real: education, races, places, and skills worth keeping on the wall.",
    hint:"Open the framed stories, then use the archive index to browse what comes next.",
    bg:IMG.archive,
    bgPos:"center center",
    hotspots:[
      {x:41,y:23,w:15,h:22,label:"YALE DIPLOMA",sub:"Education / one frame",action:"archive-yale"},
      {x:57,y:24,w:16,h:23,label:"IRONMAN 70.3",sub:"Santa Cruz / 5:29",action:"santa-relic"},
      {x:16,y:28,w:18,h:35,label:"SKI BACKFLIP",sub:"First backflip / next progression",action:"ski-relic"},
      {x:78,y:23,w:20,h:24,label:"PONTE VEDRA BEACH",sub:"A place that belongs on the wall",action:"archive-pontevedra"},
      {x:61,y:42,w:11,h:18,label:"FINISH LINE",sub:"The day behind the medal",action:"archive-finish"},
      {x:52,y:74,w:36,h:20,label:"ARCHIVE INDEX",sub:"Boss fights / adventures / skill unlocks",action:"archive-index"}
    ],
    collectibles:[]
  };
  scenes.map={
    title:"The map room.",
    eye:"WELLS / MAP ROOM",
    copy:"A map of where the story started, where it wandered, and where it is heading next.",
    hint:"Open the photographs and pins for the trips behind them, or use the travel books to plot the next route.",
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
      ...(s.props||[]).map(p=>({label:p.label,sub:'Explore this object',action:p.action}))
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
  addEventListener('resize',()=>{const s=scenes[state.scene];if(s){$q('#sceneBg').style.backgroundPosition=bgPos(s);renderHotspots(s)}});

  function playTone(note,duration=.28){try{const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)()),freq={C:261.63,D:293.66,E:329.63,F:349.23,G:392,A:440,B:493.88}[note]||330,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.12,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+duration);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+duration+.03)}catch(e){}}

  function openPiano(){info('MANOR / PIANO','Repeat the phrase',`<p class="game-note">Hear the four-note phrase, then play it back. The crest gives away the answer if you inspect it first.</p><button id="pianoListen" class="mini-action">HEAR THE PHRASE</button><div class="piano-progress" id="pianoProgress"><i></i><i></i><i></i><i></i></div><div class="piano-keys">${['C','D','E','F','G','A','B'].map((n,i)=>`<button class="piano-key ${i%3===1?'blackish':''}" data-note="${n}">${n}</button>`).join('')}</div>`);const target=['C','E','G','B'];let entered=[],locked=false;const flash=n=>{const k=$q(`[data-note="${n}"]`);if(!k)return;k.classList.add('active');playTone(n);later(()=>k.classList.remove('active'),250)};const render=()=>$$q('#pianoProgress i').forEach((d,i)=>d.classList.toggle('on',i<entered.length));const listen=()=>{locked=true;entered=[];render();target.forEach((n,i)=>later(()=>flash(n),i*410));later(()=>{locked=false;toast('YOUR TURN')},target.length*410+100)};$q('#pianoListen').onclick=listen;$$q('[data-note]').forEach(k=>k.onclick=()=>{if(locked)return;const n=k.dataset.note;flash(n);entered.push(n);render();const i=entered.length-1;if(n!==target[i]){toast('WRONG NOTE — RESET');entered=[];render();return}if(entered.length===target.length){collect('watch');locked=true;later(()=>info('MANOR / PIANO','Sequence accepted.','<p>A small drawer under the keyboard clicks open.</p><p><strong>Inside: the estate watch.</strong></p>'),250)}});listen()}

  function openForge(){info('ARMORY / FORGE','Strike. Then quench.',`<p class="game-note">Two clean timing windows. Miss and the steel goes back in the fire.</p><div class="timing-game"><div id="timingLabel" class="timing-meta"><span>PHASE 1 / STRIKE</span><span>GOLD ZONE</span></div><div id="timingTrack" class="timing-track"><span class="zone"></span><i id="timingMarker" class="marker"></i></div><button id="timingHit" class="mini-action">STRIKE</button></div>`);let phase=1,pos=0,dir=1,t;const start=()=>{clearInterval(t);pos=0;dir=1;t=setInterval(()=>{const m=$q('#timingMarker');if(!m){clearInterval(t);return}pos+=dir*(phase===1?2.9:3.5);if(pos>=96||pos<=0)dir*=-1;m.style.left=pos+'%'},24)};start();$q('#timingHit').onclick=()=>{const good=phase===1?(pos>43&&pos<57):(pos>61&&pos<71);if(!good){toast(phase===1?'MISS — BACK IN THE FIRE':'TOO EARLY — STEAM EVERYWHERE');phase=1;$q('#timingTrack').classList.remove('quench');$q('#timingLabel').innerHTML='<span>PHASE 1 / STRIKE</span><span>GOLD ZONE</span>';$q('#timingHit').textContent='STRIKE';start();return}if(phase===1){toast('CLEAN STRIKE');phase=2;$q('#timingTrack').classList.add('quench');$q('#timingLabel').innerHTML='<span>PHASE 2 / QUENCH</span><span>BLUE ZONE</span>';$q('#timingHit').textContent='QUENCH';start()}else{clearInterval(t);collect('iron-key');info('ARMORY / FORGE','FORGE MARK — UNLOCKED','<p>Clean strike. Clean quench.</p><p>The mark goes into the collection.</p>')}}}

  function openVault(){info('ARCHIVE / VAULT','Three-number combination',`<p class="vault-clue">The combination is already in the archive. One completed boss fight has the answer.</p><div class="vault-dials">${[0,1,2].map(i=>`<div class="dial"><button data-dial="${i}" data-dir="1">▲</button><strong id="dial${i}">0</strong><button data-dial="${i}" data-dir="-1">▼</button></div>`).join('')}</div><button id="vaultOpen" class="mini-action">OPEN VAULT</button>`);const vals=[0,0,0];$$q('[data-dial]').forEach(b=>b.onclick=()=>{const i=+b.dataset.dial;vals[i]=(vals[i]+(+b.dataset.dir)+10)%10;$q('#dial'+i).textContent=vals[i]});$q('#vaultOpen').onclick=()=>{if(vals.join('')==='529'){collect('vault-seal');info('VAULT / OPEN','IRONMAN 70.3 — SANTA CRUZ','<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p><p>First 70.3 completed. The next question is what gets harder from here.</p>')}else toast('THE LOCK DOES NOT MOVE')}}

  function openRoute(){info('MAP ROOM / ROUTE','Plot the improbable year',`<p class="game-note">Clue: Pacific → cold north → Alps → islands → steppe.</p><div class="route-game">${['CALIFORNIA','ALASKA','ST. MORITZ','BVI','MONGOLIA','THAILAND'].map(n=>`<button data-route="${n}">${n}</button>`).join('')}</div><div id="routePath" class="route-path">START →</div>`);const target=['CALIFORNIA','ALASKA','ST. MORITZ','BVI','MONGOLIA'];let route=[];$$q('[data-route]').forEach(b=>b.onclick=()=>{const n=b.dataset.route;if(n!==target[route.length]){toast('ROUTE BREAKS — START AGAIN');route=[];$$q('[data-route]').forEach(x=>x.classList.remove('done'));$q('#routePath').textContent='START →';return}route.push(n);b.classList.add('done');$q('#routePath').textContent='START → '+route.join(' → ');if(route.length===target.length){collect('map-pin');later(()=>info('MAP ROOM / ROUTE','Route accepted.','<p>It makes almost no logistical sense.</p><p><strong>Perfect.</strong></p>'),350)}})}

  function openStars(){
    const shapes=[
      {
        name:'SWORD',
        subtitle:'Blade, guard, grip, and pommel.',
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
        subtitle:'A skier dropping into the fall line.',
        points:[
          {x:49,y:18},{x:49,y:31},{x:37,y:42},{x:57,y:43},{x:68,y:55},
          {x:53,y:54},{x:44,y:70},{x:29,y:83},{x:47,y:75},{x:63,y:84},
          {x:52,y:67},{x:59,y:52}
        ]
      },
      {
        name:'MOTORCYCLE',
        subtitle:'Two wheels, frame, and handlebars.',
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
              '<p><strong>Sword · Sailboat · Shark · Skier · Motorcycle.</strong></p><p>Five constellations traced from the same sky, each tied to something elsewhere in the estate.</p>'
            ),700);
          }
        }
      });
    };
    draw();
  }

  function openWatch(){info('DRESSING ROOM / WATCH','Wind the movement','<p class="game-note">Ten turns. The second hand will tell you when it is alive.</p><div class="watch-game"><div class="watch-face"><i id="watchHand" class="watch-hand"></i></div><button id="windCrown" class="wind-crown">↻</button><div class="wind-meter"><i id="windFill"></i></div><div id="windLabel" class="game-note">0 / 10 TURNS</div></div>');let turns=0;$q('#windCrown').onclick=()=>{turns=Math.min(10,turns+1);$q('#watchHand').style.transform='rotate('+(turns*108)+'deg)';$q('#windFill').style.width=(turns*10)+'%';$q('#windLabel').textContent=turns+' / 10 TURNS';playTone('E',.1);if(turns===10){collect('watch');later(()=>info('DRESSING ROOM / WATCH','Running.','<p>Mechanical, wound, and now yours.</p>'),350)}}}

  function openSnowGlobe(){info('NYC / SNOW GLOBE','Shake it','<p class="game-note">Drag the globe hard from side to side, or use the button.</p><div class="snowglobe-game"><div id="globeBig" class="globe-big"></div><div class="shake-meter"><i id="shakeFill"></i></div><button id="shakeButton" class="mini-action">SHAKE</button></div>');let energy=0,lastX=null,down=false,globe=$q('#globeBig');const snow=()=>{for(let i=0;i<12;i++){const f=document.createElement('i');f.className='snowflake';f.textContent='•';f.style.left=(10+Math.random()*80)+'%';f.style.top=(Math.random()*25)+'%';globe.appendChild(f);later(()=>f.remove(),800)}};const add=n=>{energy=Math.min(100,energy+n);$q('#shakeFill').style.width=energy+'%';snow();if(energy>=100&&!globe.classList.contains('revealed')){globe.classList.add('revealed');toast('SOMETHING IS INSIDE THE BASE');later(()=>{const b=document.createElement('button');b.className='mini-action';b.textContent='OPEN THE BASE';b.onclick=()=>{collect('ornament');info('NYC / FOUND','A tiny brass W','<p>A small brass W, brought from the estate and hidden in the tree.</p>')};$q('#infoBody').appendChild(b)},300)}};globe.onpointerdown=e=>{down=true;lastX=e.clientX;globe.setPointerCapture(e.pointerId)};globe.onpointermove=e=>{if(!down)return;const d=Math.abs(e.clientX-lastX);if(d>18){add(Math.min(18,d/2));lastX=e.clientX}};globe.onpointerup=()=>{down=false;lastX=null};$q('#shakeButton').onclick=()=>add(20)}

  function bindPopupChoices(items,onPick){
    later(()=>{
      items.forEach(([id])=>{
        const el=$q('#'+id);
        if(el)el.onclick=()=>onPick(id,el);
      });
    },0);
  }

  function openManorPainting(){
    info('MANOR / PAINTING','The frame has a secret','<p>The portrait looks ordinary until you notice the frame sits slightly proud of the wall.</p><button id="liftFrame" class="mini-action">LIFT THE FRAME</button><div id="paintingReveal" class="popup-reveal"></div>');
    bindPopupChoices([['liftFrame']],()=>{
      $q('#paintingReveal').innerHTML='<p>Four letters are carved into the wood:</p><div class="reveal-code">C · E · G · B</div><p>They match four notes on the grand piano across the room.</p>';
      $q('#liftFrame').disabled=true;
      toast('PIANO CLUE FOUND');
    });
  }

  function openArmorInspect(){
    info('MANOR / ARMOR','A well-used display','<p>The armor is decorative now, but the details point toward older skills scattered around the estate.</p><div class="popup-choice-grid"><button id="armorVisor" class="mini-action">LIFT VISOR</button><button id="armorGauntlet" class="mini-action">CHECK GAUNTLET</button><button id="armorShield" class="mini-action">LOOK BEHIND SHIELD</button></div><div id="armorReveal" class="popup-reveal"></div>');
    bindPopupChoices([['armorVisor'],['armorGauntlet'],['armorShield']],id=>{
      const copy={
        armorVisor:'<p><strong>Archery.</strong> A worn leather finger tab has been tucked inside the helmet.</p>',
        armorGauntlet:'<p><strong>Blacksmithing.</strong> The knuckles are darkened with old forge soot.</p>',
        armorShield:'<p><strong>Hidden-room clue.</strong> Scratched into the wall behind the shield: <em>five knocks at the fire.</em></p>'
      };
      $q('#armorReveal').innerHTML=copy[id];
    });
  }

  function openManorTable(){
    info('MANOR / TABLE','The three-part rule','<p>The notebook on the table reduces the whole philosophy to three kinds of objectives.</p><div class="popup-choice-grid three"><button id="ruleBoss" class="mini-action">BOSS FIGHT</button><button id="ruleAdventure" class="mini-action">ADVENTURE</button><button id="ruleSkill" class="mini-action">SKILL UNLOCK</button></div><div id="ruleReveal" class="popup-reveal"><p>Pick one.</p></div>');
    bindPopupChoices([['ruleBoss'],['ruleAdventure'],['ruleSkill']],id=>{
      const copy={
        ruleBoss:'<p><strong>Boss Fight:</strong> a goal with a clean finish line. An Ironman, an expedition race, a major competition.</p>',
        ruleAdventure:'<p><strong>Adventure:</strong> something worth doing because the story is better afterward. A sailing passage, a moto trip, a strange route somewhere new.</p>',
        ruleSkill:'<p><strong>Skill Unlock:</strong> a capability that compounds. Flying, navigation, backcountry skiing, racing, diving, blacksmithing.</p>'
      };
      $q('#ruleReveal').innerHTML=copy[id];
    });
  }

  function openArchiveIndex(){
    info('ARCHIVE / INDEX','How the archive is organized','<p>The estate sorts future plans into three shelves.</p><div class="popup-choice-grid three"><button id="indexBoss" class="mini-action">BOSS FIGHTS</button><button id="indexAdventure" class="mini-action">ADVENTURES</button><button id="indexSkill" class="mini-action">SKILL UNLOCKS</button></div><div id="indexReveal" class="popup-reveal"><p>Choose a shelf.</p></div>');
    bindPopupChoices([['indexBoss'],['indexAdventure'],['indexSkill']],id=>{
      const copy={
        indexBoss:'<p><strong>Boss Fights</strong></p><p>Major objectives with an unmistakable finish line: long-course racing, expedition events, difficult competitions.</p>',
        indexAdventure:'<p><strong>Adventures</strong></p><p>Trips that exist mostly because they would make a great story: dirt-bike expeditions, sailing passages, big mountain days, unusual routes.</p>',
        indexSkill:'<p><strong>Skill Unlocks</strong></p><p>Abilities worth earning for their own sake: pilot training, navigation, racing, diving, ski touring, forging, and more.</p>'
      };
      $q('#indexReveal').innerHTML=copy[id];
    });
  }

  function openNYCView(){
    info('NYC / VIEW','December in Manhattan','<p>Snow on the fire escapes, warm windows across the street, and the city glowing below.</p><button id="dimNYC" class="mini-action">DIM THE ROOM</button><div id="nycReveal" class="popup-reveal"><p>The view gets better when the glass stops reflecting the room.</p></div>');
    bindPopupChoices([['dimNYC']],()=>{
      const bg=$q('#sceneBg');
      if(bg)bg.animate([{filter:'brightness(1)'},{filter:'brightness(.72) saturate(.92)'},{filter:'brightness(1)'}],{duration:1400});
      $q('#nycReveal').innerHTML='<p>For a second the apartment disappears from the glass and the whole window becomes New York.</p>';
      toast('ROOM LIGHTS DOWN');
    });
  }

  function openCampfire(){
    info('THE CLEARING','Stay by the fire','<p>No timer, no score. Just a fire that could use another log.</p><button id="addLog" class="mini-action">ADD A LOG</button><div id="fireReveal" class="popup-reveal"><p>Fire level: <strong>1 / 4</strong></p></div>');
    later(()=>{
      let level=1;
      const btn=$q('#addLog'),out=$q('#fireReveal');
      if(!btn||!out)return;
      btn.onclick=()=>{
        level=Math.min(4,level+1);
        const lines=[
          '',
          '',
          '<p>Fire level: <strong>2 / 4</strong></p><p>The coals catch and the clearing gets a little warmer.</p>',
          '<p>Fire level: <strong>3 / 4</strong></p><p>Now it is the kind of fire people stop talking around for a minute.</p>',
          '<p>Fire level: <strong>4 / 4</strong></p><p>Perfect. Leave it there.</p>'
        ];
        out.innerHTML=lines[level];
        if(level===4){btn.disabled=true;toast('FIRE — PERFECT');}
      };
    },0);
  }

  function openFieldNotes(){
    const pages=[
      ['NAVIGATION','Maps, route finding, wilderness judgment, and being harder to lose.'],
      ['FLIGHT','Private pilot training and enough competence to make the sky feel accessible.'],
      ['MOUNTAINS','Ski touring, backcountry travel, bigger terrain, and better judgment in places where mistakes matter.'],
      ['WATER','Scuba, open-water confidence, sailing, and the skills that make islands more interesting.'],
      ['MACHINES','Track driving, motorcycles, dirt, and learning what the machine is actually telling you.'],
      ['ENDURANCE','Long-course racing, adventure events, and building an engine that makes very long days feel possible.'],
      ['SKIING','Backflip first. Then 360s, bigger lines, touring, deep snow, and eventually the mountains that require a plane to reach.'],
      ['DIRT BIKES','Trail riding, camping off the bike, desert, multi-day expeditions, and the confidence to keep going when the road disappears.'],
      ['SAILING','Navigation, weather, seamanship, living aboard for a while, and eventually making passages instead of just renting boats.'],
      ['DIVING','Better buoyancy, deeper training, wrecks, liveaboards, and enough time underwater that it stops feeling foreign.'],
      ['SURF / FOIL','Surfing, wingfoiling, wind, balance, and learning to move through water without brute-forcing it.'],
      ['HORSES','Riding well enough that a horse feels like a partner instead of transportation. Ranch days, open country, and eventually real competence.'],
      ['RACING','Karting, coaching, track days, racecraft, and earning the right to drive quickly around other people who are also trying to drive quickly.'],
      ['WILDERNESS','Navigation, campcraft, weather, first aid, cold, heat, and knowing what to do when the plan stops being useful.'],
      ['STRENGTH','Enough strength, mobility, and body control to make every other skill easier: lifting, carrying, climbing over things, landing well.'],
      ['RACQUET SPORTS','Tennis, golf, and the lifetime sports that are still fun when the more ridiculous ideas need a rest day.'],
      ['CRAFT','Blacksmithing, leather, wood, mechanical objects, and learning how beautiful things are actually made.'],
      ['ARCHERY','A quiet skill built on repetition, control, and getting the same movement right enough times that the result becomes boring.'],
      ['MARKSMANSHIP','Sport shooting as a discipline: safety, control, consistency, and performing cleanly under pressure.'],
      ['MOTO EXPEDITION','The long version of dirt biking: luggage, navigation, bad roads, remote camps, and enough mechanical sense to keep the trip moving.'],
      ['ADVENTURE RACING','Navigation, running, biking, paddling, problem-solving, and continuing to make decisions after everyone is tired.'],
      ['PILOTING','Not just getting a license. Weather judgment, planning, radio confidence, cross-country flying, and making aviation genuinely useful.'],
      ['OCEAN','Cold water, currents, long swims, boats, diving, surfing, and becoming much more comfortable with a part of the world that covers most of it.'],
      ['WINTER','Avalanche education, touring, cold-weather systems, mountain travel, and turning winter from a season into terrain.'],
      ['ROAD BIKE','Long climbs, descending well, better bike fitness, and eventually being the kind of cyclist who does not treat the bike leg as damage control.'],
      ['RUNNING','Keep the speed from disappearing while building the durability to run well after doing something difficult first.'],
      ['EXPEDITION FITNESS','Carry weight. Move for hours. Sleep badly. Get up and do it again. Fitness that survives the removal of ideal conditions.'],
      ['DRIVING','Car control, braking, vision, race lines, wet conditions, and knowing the difference between speed and competence.'],
      ['FIELDCRAFT','Packing light, fixing small problems, choosing routes, reading weather, making camp, and generally needing fewer things to go right.'],
      ['THE RULE','One boss fight. One adventure. One skill unlock. Repeat until the stories are better than the plans.']
    ];

    info(
      'STUDY / FIELD NOTES',
      'Capabilities worth collecting',
      '<p>The notebook is less a bucket list than a running inventory of things worth learning.</p><button id="randomFieldPage" class="mini-action">OPEN A RANDOM PAGE</button><div id="fieldReveal" class="popup-reveal"></div>'
    );

    later(()=>{
      const btn=$q('#randomFieldPage'),out=$q('#fieldReveal');
      if(!btn||!out)return;
      let last=-1,seen=[];
      btn.onclick=()=>{
        if(seen.length>=pages.length)seen=[];
        const available=pages.map((_,i)=>i).filter(i=>i!==last&&!seen.includes(i));
        let i=available[Math.floor(Math.random()*available.length)];
        if(i===undefined)i=(last+1)%pages.length;
        last=i;seen.push(i);
        out.innerHTML='<p><strong>'+pages[i][0]+'</strong></p><p>'+pages[i][1]+'</p>';
      };
      btn.click();
    },0);
  }


  function openStudyMap(){
    info('STUDY / GLOBE','Spin it until somewhere wins','<p>The globe beside the window has four routes marked in faint red pencil: half plan, half provocation.</p><div class="popup-choice-grid"><button id="mapNorth" class="mini-action">ALASKA</button><button id="mapAlps" class="mini-action">ST. MORITZ</button><button id="mapIslands" class="mini-action">BVI</button><button id="mapSteppe" class="mini-action">MONGOLIA</button></div><div id="studyMapReveal" class="popup-reveal"><p>Choose a destination.</p></div>');
    bindPopupChoices([['mapNorth'],['mapAlps'],['mapIslands'],['mapSteppe']],id=>{
      const copy={
        mapNorth:'<p><strong>Alaska.</strong> Big terrain, cold water, long days, and the kind of logistics that make a trip feel earned before it even starts.</p>',
        mapAlps:'<p><strong>St. Moritz.</strong> Winter machinery, clean mountain lines, good coats, and enough snow to justify traveling for it.</p>',
        mapIslands:'<p><strong>BVI.</strong> Sailing, diving, moving water, and islands close enough together to make the route itself part of the day.</p>',
        mapSteppe:'<p><strong>Mongolia.</strong> Dirt bikes, open country, remote camps, navigation, and a road that stops pretending to be a road.</p>'
      };
      $q('#studyMapReveal').innerHTML=copy[id];
    });
  }

  function openStudyDrawer(){
    info('STUDY / DRAWER','The drawer sticks halfway','<p>It opens about six inches and stops.</p><button id="pullDrawer" class="mini-action">PULL HARDER</button><div id="drawerReveal" class="popup-reveal"><p>Something is caught behind it.</p></div>');
    bindPopupChoices([['pullDrawer']],()=>{
      collect('playing-card');
      $q('#drawerReveal').innerHTML='<p>The drawer comes free with a scrape. Behind it is a single playing card and a folded scrap of paper.</p><p><em>Keep one thing in reserve.</em></p>';
      $q('#pullDrawer').disabled=true;
      toast('FOUND — PLAYING CARD');
    });
  }

  function openStudyLamp(){
    info('STUDY / LAMP','Turn the lamp down','<p>The page beneath it looks blank at full brightness.</p><button id="dimStudyLamp" class="mini-action">DIM THE LAMP</button><div id="lampReveal" class="popup-reveal"><p>The paper has faint pencil pressure marks.</p></div>');
    bindPopupChoices([['dimStudyLamp']],()=>{
      const bg=$q('#sceneBg');
      if(bg)bg.animate([{filter:'brightness(1)'},{filter:'brightness(.62) saturate(.9)'},{filter:'brightness(.86)'}],{duration:1150,fill:'forwards'});
      $q('#lampReveal').innerHTML='<p>As the room darkens, the indentations become readable:</p><p><strong>One boss fight. One adventure. One skill unlock.</strong></p>';
      $q('#dimStudyLamp').disabled=true;
      toast('MARGIN NOTE FOUND');
    });
  }

  function openStudyShelf(){
    info('STUDY / SHELVES','One book is facing the wrong way','<p>Most of the shelf is exactly where it belongs. Three books are worth checking.</p><div class="popup-choice-grid three"><button id="shelfAtlas" class="mini-action">ATLAS</button><button id="shelfHistory" class="mini-action">HISTORY</button><button id="shelfReverse" class="mini-action">BACKWARDS BOOK</button></div><div id="shelfReveal" class="popup-reveal"><p>Pick one.</p></div>');
    bindPopupChoices([['shelfAtlas'],['shelfHistory'],['shelfReverse']],id=>{
      if(id==='shelfReverse'){
        collect('playing-card');
        $q('#shelfReveal').innerHTML='<p>The backwards book is hollow. Inside: a playing card and a penciled list of routes that have not happened yet.</p>';
        toast('HIDDEN COMPARTMENT');
      }else if(id==='shelfAtlas'){
        $q('#shelfReveal').innerHTML='<p>The atlas is heavily marked around coastlines, mountain ranges, and places that require more than one flight to reach.</p>';
      }else{
        $q('#shelfReveal').innerHTML='<p>The history book falls open to explorers, pilots, sailors, and people who kept choosing the longer route.</p>';
      }
    });
  }

  function openGaragePorsche(){
    info('GARAGE / PORSCHE','911','<p>The smaller car in the back bay: less theater, more precision.</p><div class="popup-choice-grid three"><button id="porscheCoast" class="mini-action">COAST ROAD</button><button id="porscheTrack" class="mini-action">TRACK</button><button id="porscheNight" class="mini-action">NIGHT DRIVE</button></div><div id="porscheReveal" class="popup-reveal"><p>Pick the road.</p></div>');
    bindPopupChoices([['porscheCoast'],['porscheTrack'],['porscheNight']],id=>{
      const copy={
        porscheCoast:'<p><strong>Coast road.</strong> Early morning, cold air, empty turns, and no reason to arrive quickly.</p>',
        porscheTrack:'<p><strong>Track.</strong> Braking points, clean inputs, repeatable laps, and finding speed by removing drama.</p>',
        porscheNight:'<p><strong>Night drive.</strong> City lights, quiet roads, and the kind of car that feels better the less attention it gets.</p>'
      };
      $q('#porscheReveal').innerHTML=copy[id];
    });
  }

  function openTrackMap(){
    info('GARAGE / TRACK WALL','The progression board','<p>The wall map is less about one track than the order of operations.</p><div class="popup-choice-grid"><button id="trackKart" class="mini-action">1 · KARTING</button><button id="trackCoach" class="mini-action">2 · COACHING</button><button id="trackHpde" class="mini-action">3 · HPDE</button><button id="trackRace" class="mini-action">4 · RACE LICENSE</button></div><div id="trackReveal" class="popup-reveal"><p>Choose a stage.</p></div>');
    bindPopupChoices([['trackKart'],['trackCoach'],['trackHpde'],['trackRace']],id=>{
      const copy={
        trackKart:'<p><strong>Karting:</strong> learn vision, lines, racecraft, and how obvious every mistake becomes when there is nowhere for the car to hide it.</p>',
        trackCoach:'<p><strong>Coaching:</strong> replace instinct with repeatable technique. Braking, turn-in, balance, and data.</p>',
        trackHpde:'<p><strong>HPDE:</strong> put the technique into a real car at real speed, with enough structure to learn without pretending it is a race.</p>',
        trackRace:'<p><strong>Race license:</strong> the point where speed is no longer enough. Starts, traffic, passing, defending, judgment, consistency.</p>'
      };
      $q('#trackReveal').innerHTML=copy[id];
    });
  }

  function openCompass(){
    info('CLEARING / COMPASS','Still works','<p>The brass compass has been sitting on the log long enough to collect ash.</p><button id="spinCompass" class="mini-action">SPIN IT</button><div id="compassReveal" class="popup-reveal"><p>The needle is steady.</p></div>');
    later(()=>{
      const btn=$q('#spinCompass'),out=$q('#compassReveal');
      if(!btn||!out)return;
      let spins=0;
      btn.onclick=()=>{
        spins++;
        const options=[
          'The needle swings, overshoots, and settles north.',
          'North again. Annoyingly dependable.',
          'Still north. At this point the compass is making a point.'
        ];
        out.innerHTML='<p>'+options[Math.min(spins-1,options.length-1)]+'</p>';
        collect('compass');
        if(spins>=3)btn.textContent='STILL NORTH';
      };
    },0);
  }

  function openTreeCarving(){
    info('CLEARING / TREE','Something under the moss','<p>The carving is shallow enough that weather has almost erased it.</p><button id="brushCarving" class="mini-action">BRUSH AWAY MOSS</button><div id="treeReveal" class="popup-reveal"><p>Only a few cuts are visible.</p></div>');
    bindPopupChoices([['brushCarving']],()=>{
      $q('#treeReveal').innerHTML='<p>Three small trees. A mountain line. One date.</p><p>No explanation was carved with it, which is probably why it belongs here.</p>';
      $q('#brushCarving').disabled=true;
    });
  }

  const baseDoAction=doAction;
  doAction=function(a){
    if(a==='piano'){openPiano();return}
    if(a==='forge'){openForge();return}
    if(a==='vault-game'){openVault();return}
    if(a==='map-route'){openRoute();return}
    if(a==='stars-game'){openStars();return}
    if(a==='wardrobe-watch'){openWatch();return}
    if(a==='suit-web'){state.suit='WEB SUIT';save();toast('EQUIPPED — WEB SUIT');info('WEB SUIT','Urban acrobat loadout.','<p>A red-and-white masked suit built for vertical movement, quick reactions, and pure comic-book energy.</p><p>Less disguise, more alter ego.</p>');return}
    if(a==='suit-ski'){state.suit='SKI KIT';save();toast('EQUIPPED — SKI KIT');info('SKI KIT','Alpine storm gear.','<p>Technical shell, helmet, goggles and boots for the mountain chapter.</p><p>Ski days, cold air, backflips, touring, and eventually much bigger mountains.</p>');return}
    if(a==='suit-operative'){state.suit='FIELD OPERATIVE';save();toast('EQUIPPED — FIELD OPERATIVE');info('FIELD OPERATIVE','Black-tie espionage loadout.','<p>A dinner-jacket setup for casinos, impossible plans, old hotels and pretending everything is completely under control.</p><p>British field-agent energy without requiring an explanation.</p>');return}
    if(a==='suit-cowboy'){state.suit='COWBOY RIG';save();toast('EQUIPPED — COWBOY RIG');info('COWBOY RIG','Frontier chapter.','<p>Boots, denim, hat, leather and the version of the estate that owns a horse and has somewhere to ride it.</p><p>Western myth, ranch skills, open country and a few questionable decisions.</p>');return}
    if(a==='suit-race'){state.suit='RACE SUIT';save();toast('EQUIPPED — RACE SUIT');info('RACE SUIT','Track mode.','<p>Helmet, gloves and a full motorsport suit for race school, track days and the garage branch of the estate.</p><p>Apexes, braking points and machines that are much faster than necessary.</p>');return}
    if(a==='suit-dive'){state.suit='DIVE RIG';save();toast('EQUIPPED — DIVE RIG');info('DIVE RIG','Open water / scuba.','<p>Wetsuit, mask, fins and dive gear for the underwater chapter.</p><p>Open-water swimming, scuba progression, boats, reefs and whatever is below the surface.</p>');return}
    if(a==='snowglobe'){openSnowGlobe();return}
    if(a==='portrait'){openManorPainting();return}
    if(a==='armor-display'){openArmorInspect();return}
    if(a==='manor-table'){openManorTable();return}
    if(a==='nyc-fireplace'){info('NYC / FIREPLACE','Firelight in December','<p>The apartment is warm, the street is cold, and the city is close enough to hear through the windows.</p><p>This is the part of winter in New York worth keeping.</p>');return}
    if(a==='nyc-bar'){info('NYC / BAR CART','Before going out','<p>Glassware and old bottles set beside the dinner jacket. It is the last stop in the room before heading out into the city.</p>');return}
    if(a==='archive-yale'){info('ARCHIVE / EDUCATION','Yale University','<p><strong>Statistics & Data Science.</strong></p><p>The diploma marks one finished chapter; the rest of the room is for what came after it.</p>');return}
    if(a==='archive-pontevedra'){info('ARCHIVE / PLACE','Ponte Vedra Beach','<p>Northeast Florida and one of the places that feels foundational enough to show up twice in the estate: here in the archive, and again on the map.</p>');return}
    if(a==='archive-finish'){info('ARCHIVE / FINISH LINE','Santa Cruz 70.3','<p><strong>5:29 total.</strong></p><p>The finish-line photograph from the first 70.3: the moment the training block became something finished.</p>');return}
    if(a==='archive-index'){openArchiveIndex();return}
    if(a==='tree'){info('NYC / TREE','One ornament is different','<p>A tiny brass W is tucked deeper in the branches, clearly not part of the original ornament set.</p><button id="takeOrnament" class="mini-action">TAKE IT</button>');later(()=>{$q('#takeOrnament').onclick=()=>{collect('ornament');toast('FOUND — BRASS W ORNAMENT')}},0);return}
    if(a==='santa-relic'){info('RELIC / COMPLETED','IRONMAN 70.3 — SANTA CRUZ','<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p>');return}
    if(a==='windows'){openNYCView();return}
    if(a==='campfire'){openCampfire();return}
    if(a==='fieldnotes'){openFieldNotes();return}
    if(a==='study-map'){openStudyMap();return}
    if(a==='study-drawer'){openStudyDrawer();return}
    if(a==='study-lamp'){openStudyLamp();return}
    if(a==='study-shelf'){openStudyShelf();return}
    if(a==='garage-porsche'){openGaragePorsche();return}
    if(a==='track-map'){openTrackMap();return}
    if(a==='camp-compass'){openCompass();return}
    if(a==='tree-carving'){openTreeCarving();return}
    return baseDoAction(a)
  };

  const DRIVE={
    race:{label:'FERRARI',mode:'ESTATE RUN',title:"Don't hit anything.",base:72,max:155,handling:52,spawn:980},
    aston:{label:'ASTON MARTIN',mode:'MIDNIGHT RUN',title:'Keep it clean after dark.',base:66,max:142,handling:47,spawn:1040},
    rover:{label:'RANGE ROVER',mode:'COUNTRY RUN',title:'Thread the gaps.',base:58,max:126,handling:42,spawn:1100}
  };
  let driveRAF=0,driveLast=0,driveSpawnAt=0,driveRunning=false,driveMode='race';
  let driveObstacles=[],driveElapsed=0,drivePoints=0,driveLevel=1,drivePrevCarRect=null;
  const driveKeys={left:false,right:false};

  function driveCfg(){return DRIVE[driveMode]||DRIVE.race}
  function clearDriveObjects(){
    driveObstacles.forEach(o=>o.el.remove());driveObstacles=[];
    drivePrevCarRect=null;
    $q('#driveObstacles').innerHTML='';
  }
  function roadLaneX(){
    return [37,43.5,50,56.5,63][Math.floor(Math.random()*5)];
  }
  function rectsOverlap(a,b,expand=0){
    return a.left-expand < b.right+expand &&
           a.right+expand > b.left-expand &&
           a.top-expand < b.bottom+expand &&
           a.bottom+expand > b.top-expand;
  }
  function unionRect(a,b){
    return {
      left:Math.min(a.left,b.left),
      right:Math.max(a.right,b.right),
      top:Math.min(a.top,b.top),
      bottom:Math.max(a.bottom,b.bottom)
    };
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
      driveObstacles.push({el,x,y:-14,prevRect:null});
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
    const carSweep=drivePrevCarRect?unionRect(drivePrevCarRect,carRect):carRect;

    for(const o of driveObstacles){
      o.y+=vy;o.el.style.top=o.y+'%';
      const obstacleRect=o.el.getBoundingClientRect();
      const obstacleSweep=o.prevRect?unionRect(o.prevRect,obstacleRect):obstacleRect;
      if(o.y>58&&o.y<110 && rectsOverlap(carSweep,obstacleSweep,2)){
        finishDrive();return
      }
      o.prevRect=obstacleRect;
      if(o.y>114){o.el.remove();o.done=true}
    }
    drivePrevCarRect=carRect;
    driveObstacles=driveObstacles.filter(o=>!o.done);
    updateDriveHud();
    if(driveRunning)driveRAF=requestAnimationFrame(driveLoop);
  }
  function setDriveKey(k,v){if(k in driveKeys)driveKeys[k]=v}
  startDrive=function(type){
    driveRunning=false;cancelAnimationFrame(driveRAF);clearDriveObjects();
    driveMode=type==='aston'?'aston':type==='rover'?'rover':'race';
    const cfg=driveCfg();
    state.driveX=50;state.speed=cfg.base;driveElapsed=0;drivePoints=0;driveLevel=1;drivePrevCarRect=null;
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