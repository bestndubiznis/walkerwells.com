const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));

const IMG={
  estate:"https://images.unsplash.com/photo-1761767274100-b7bad43be8cf?auto=format&fit=crop&w=2400&q=88",
  manor:"https://images.unsplash.com/photo-1757524784105-cf1d1938abc7?auto=format&fit=crop&w=2400&q=88",
  garage:"/assets/scenes/garage-hq.webp?v=garage2",
  study:"https://images.unsplash.com/photo-1761116182930-8c82e7e9d873?auto=format&fit=crop&w=2400&q=88",
  wardrobe:"/assets/scenes/wardrobe-hq.webp?v=wardrobe2",
  archive:"/assets/scenes/archive-hq.webp?v=archive2",
  map:"/assets/scenes/map-room-hq.webp?v=map2",
  nyc:"https://images.unsplash.com/photo-1616486788371-62d930495c44?auto=format&fit=crop&w=2400&q=88",
  armory:"https://images.unsplash.com/photo-1755194357377-a5b59ab01e1f?auto=format&fit=crop&w=2400&q=88",
  camp:"/assets/scenes/camp-hq.webp?v=camp2"
};

const scenes={
  estate:{
    title:"The estate.",eye:"WELLS / ESTATE",copy:"A place made out of future stories.",
    hint:"Move across the architecture. Hold D if you want the world to give up its secrets.",
    bg:IMG.estate,
    hotspots:[
      {x:50,y:80,w:16,h:24,label:"FRONT DOOR",sub:"Enter the manor",go:"manor"},
      {x:43,y:76,w:10,h:22,label:"WEST WING",sub:"Relics / capability archive",go:"archive"},
      {x:58,y:76,w:10,h:22,label:"EAST WING",sub:"Maps / routes / next destinations",go:"map"},
      {x:14,y:72,w:24,h:36,label:"THE GROVE",sub:"A path disappears into the trees",go:"camp"},
      {x:88,y:78,w:20,h:34,label:"EAST DRIVE",sub:"The garage is around the bend",go:"garage"},
      {x:51,y:69,w:7,h:10,label:"A LIT WINDOW",sub:"Someone left something upstairs",action:"estate-window"},
      {x:9,y:87,w:13,h:14,label:"OLD GATE PLAQUE",sub:"Worn brass / almost unreadable",action:"estate-gate"}
    ],
    collectibles:[{x:90,y:76,id:"road-key",icon:"◆"}]
  },
  manor:{
    title:"The manor.",eye:"WELLS / MANOR",copy:"A real room now: fireplace, piano, doors, and things that should not quite be there.",
    hint:"Click the piano, fireplace, doors, desk objects, or anything that looks deliberately placed.",
    bg:IMG.manor,
    hotspots:[
      {x:16,y:52,w:18,h:32,label:"STUDY DOOR",sub:"Plans / bad ideas",go:"study"},
      {x:84,y:52,w:18,h:32,label:"DRESSING ROOM",sub:"Choose the genre",go:"wardrobe"},
      {x:48,y:43,w:22,h:24,label:"FIREPLACE",sub:"Five knocks. Not one.",action:"fireplace"},
      {x:64,y:68,w:30,h:28,label:"GRAND PIANO",sub:"Four-note sequence",action:"piano"},
      {x:48,y:21,w:22,h:18,label:"MANTEL / PAINTING",sub:"Something is carved behind the frame",action:"portrait"},
      {x:91,y:46,w:11,h:26,label:"OLD LIFT",sub:"New York / December",go:"nyc"}
    ],
    collectibles:[]
  },
  study:{
    title:"The study.",eye:"WELLS / STUDY",copy:"Old books, a real writing desk, a lamp, and an unreasonable number of future plans.",
    hint:"The desk itself is the game board.",
    bg:IMG.study,
    hotspots:[
      {x:52,y:62,w:48,h:34,label:"DESK / BAD IDEAS",sub:"Change the status of every bad idea",action:"ideas"},
      {x:34,y:51,w:18,h:18,label:"OPEN BOOK",sub:"Field notes",action:"fieldnotes"},
      {x:55,y:54,w:18,h:18,label:"MAP / PAPERS",sub:"A route that should not exist",action:"study-map"},
      {x:43,y:77,w:18,h:16,label:"DESK DRAWER",sub:"It sticks halfway",action:"study-drawer"},
      {x:72,y:42,w:16,h:22,label:"LAMP",sub:"Turn it down and something appears",action:"study-lamp"},
      {x:14,y:57,w:15,h:38,label:"LIBRARY SHELVES",sub:"A title is out of order",action:"study-shelf"}
    ],
    collectibles:[]
  },
  wardrobe:{
    title:"The dressing room.",eye:"WELLS / DRESSING ROOM",copy:"Not formalwear. Loadouts.",
    hint:"Click the actual outfit cases: web suit, ski kit, field operative, cowboy, race suit, or dive rig.",
    bg:IMG.wardrobe,
    bgPos:"center center",
    bgPosMobile:"center center",
    hotspots:[
      {x:10,y:40,w:14,h:54,label:"WEB SUIT",sub:"Red / white masked acrobat rig",action:"suit-web"},
      {x:24,y:40,w:14,h:54,label:"SKI KIT",sub:"Alpine storm gear",action:"suit-ski"},
      {x:36,y:35,w:11,h:42,label:"FIELD OPERATIVE",sub:"Black-tie espionage loadout",action:"suit-operative"},
      {x:64,y:38,w:12,h:46,label:"COWBOY RIG",sub:"Frontier chapter",action:"suit-cowboy"},
      {x:78,y:40,w:13,h:52,label:"RACE SUIT",sub:"Track mode",action:"suit-race"},
      {x:92,y:40,w:13,h:54,label:"DIVE RIG",sub:"Open water / scuba",action:"suit-dive"},
      {x:50,y:58,w:16,h:13,label:"WATCH CASE",sub:"Mechanical / small / expensive-looking",action:"wardrobe-watch"},
      {x:50,y:33,w:13,h:24,label:"HALL / MANOR",sub:"Back to the house",go:"manor"}
    ],
    collectibles:[]
  },
  garage:{
    title:"The garage.",eye:"WELLS / GARAGE",copy:"Four machines, one wall of gear, and several extremely defensible reasons to leave the house.",
    hint:"Click the actual cars, dirt bike, helmet rack, or tool wall.",
    bg:IMG.garage,
    hotspots:[
      {x:28,y:58,w:48,h:40,label:"FERRARI",sub:"Track mode / start it, then drive",action:"drive-race"},
      {x:78,y:56,w:35,h:36,label:"ASTON MARTIN",sub:"Green grand tourer / night-drive branch",action:"drive-aston"},
      {x:63,y:40,w:21,h:18,label:"PORSCHE 911",sub:"Back bay / precision over drama",action:"garage-porsche"},
      {x:45,y:40,w:13,h:25,label:"DIRT BIKE",sub:"Red bike / open-country branch",action:"moto"},
      {x:8,y:30,w:16,h:39,label:"HELMET RACK",sub:"Race-school token inside",action:"helmet"},
      {x:32,y:34,w:18,h:19,label:"TOOL WALL",sub:"Track notes / progression",action:"track-map"}
    ],
    collectibles:[]
  },
  archive:{
    title:"The archive.",eye:"WELLS / ARCHIVE",copy:"Not a résumé. The things that actually earned wall space.",
    hint:"Click the specific relics: Yale, Santa Cruz 70.3, the ski backflip, Ponte Vedra Beach, or the archive index.",
    bg:IMG.archive,
    hotspots:[
      {x:41,y:23,w:15,h:22,label:"YALE DIPLOMA",sub:"Education / one frame",action:"archive-yale"},
      {x:57,y:24,w:16,h:23,label:"IRONMAN 70.3",sub:"Santa Cruz / 5:29",action:"santa-relic"},
      {x:16,y:28,w:18,h:35,label:"SKI BACKFLIP",sub:"Unlocked / make it boring",action:"ski-relic"},
      {x:78,y:23,w:20,h:24,label:"PONTE VEDRA BEACH",sub:"A place that belongs on the wall",action:"archive-pontevedra"},
      {x:61,y:42,w:11,h:18,label:"FINISH LINE",sub:"The day behind the medal",action:"archive-finish"},
      {x:52,y:74,w:36,h:20,label:"ARCHIVE INDEX",sub:"Boss fights / adventures / skill unlocks",action:"archive-index"}
    ],
    collectibles:[]
  },
  map:{
    title:"The map room.",eye:"WELLS / MAP ROOM",copy:"Where I came from, where I disappeared to, and what is next.",
    hint:"Click the framed trips, map pins, and travel books. The room is the itinerary.",
    bg:IMG.map,
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
  },
  camp:{
    title:"The campfire.",eye:"WELLS / CAMPFIRE",copy:"Mountain air, firelight, Brevard memories, and a sky worth staying awake for.",
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
  },
  nyc:{
    title:"New York. December.",eye:"WELLS / NYC",copy:"A real New York interior with an actual Christmas tree. No palm trees. No G-Wagen.",
    hint:"The tree, windows, room, and mission terminal are all active.",
    bg:IMG.nyc,
    hotspots:[
      {x:50,y:52,w:30,h:44,label:"CHRISTMAS TREE",sub:"One ornament is wrong",action:"tree"},
      {x:22,y:56,w:28,h:42,label:"MISSION TERMINAL",sub:"Open dossier",action:"mission"},
      {x:77,y:54,w:30,h:48,label:"WINDOW / CITY",sub:"New York / December",action:"windows"},
      {x:84,y:78,w:18,h:16,label:"DINNER JACKET",sub:"Suit up",action:"suit"},
      {x:10,y:33,w:14,h:26,label:"OLD LIFT",sub:"Return to manor",go:"manor"},
      {x:62,y:76,w:14,h:16,label:"SNOW GLOBE",sub:"Shake it",action:"snowglobe"}
    ],
    collectibles:[]
  },
  armory:{
    title:"The armory.",eye:"WELLS / HIDDEN ROOM",copy:"Armor and steel instead of another menu.",
    hint:"The racks, helmets, and forge marks are interactive.",
    bg:IMG.armory,
    hotspots:[
      {x:35,y:52,w:28,h:58,label:"ARMOR RACK",sub:"Old steel / no cosplay explanation",action:"armor-rack"},
      {x:68,y:52,w:30,h:58,label:"WEAPON WALL",sub:"Sword / craft / history",action:"weapon-wall"},
      {x:50,y:80,w:24,h:15,label:"FORGE MARK",sub:"Timing challenge",action:"forge"},
      {x:8,y:46,w:12,h:35,label:"SECRET DOOR",sub:"Back to manor",go:"manor"}
    ],
    collectibles:[]
  }
};

const items=[
  ["spider-mask","SPIDER MASK","◒"],["watch","WATCH","◉"],["gold-bar","GOLD BAR","▰"],
  ["playing-card","PLAYING CARD","♠"],["compass","COMPASS","✥"],["road-key","ROAD KEY","◆"],
  ["ski-pass","SKI PASS","▣"],["shark-tooth","SHARK TOOTH","▽"],["star-map","STAR MAP","✦"],
  ["iron-key","FORGE MARK","⚒"],["pirate-coin","PIRATE COIN","◉"],["ornament","ORNAMENT","●"],
  ["race-token","RACE TOKEN","◫"],["pilot-pin","PILOT PIN","◆"],["map-pin","MAP PIN","•"],["vault-seal","VAULT SEAL","◇"]
];
const ideas=["70.3 Worlds / Kona pursuit","3-day expedition race","Mongolia moto","Pilot license","St. Moritz winter","BVI sailing passage","Via Ferrata","Blacksmith a blade","Adventure race","Backcountry ski tour","Track race license","Liveaboard wreck diving"];
const suits=[["DINNER JACKET","♟"],["RACE SUIT","◫"],["SKI KIT","⛷"],["WETSUIT","◉"],["WESTERN","♞"],["SPIDER SUIT","◒"]];

const state={
  scene:"estate",
  found:new Set(JSON.parse(localStorage.getItem("wells.collection")||"[]")),
  ideas:JSON.parse(localStorage.getItem("wells.ideas")||"{}"),
  suit:localStorage.getItem("wells.outfit")||"DINNER JACKET",
  season:localStorage.getItem("wells.season")||"autumn",
  storm:localStorage.getItem("wells.storm")==="true",
  sound:false,
  reduce:localStorage.getItem("wells.reduceMotion")==="true",
  driveX:50,
  speed:72
};

function save(){
  localStorage.setItem("wells.collection",JSON.stringify([...state.found]));
  localStorage.setItem("wells.ideas",JSON.stringify(state.ideas));
  localStorage.setItem("wells.outfit",state.suit);
  localStorage.setItem("wells.season",state.season);
  localStorage.setItem("wells.storm",String(state.storm));
  localStorage.setItem("wells.reduceMotion",String(state.reduce));
}

function toast(t){
  const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1800);
}
function closePanels(){$$(".panel").forEach(p=>p.classList.remove("open"))}
function openPanel(id){closePanels();$("#"+id+"Panel").classList.add("open")}
function info(eye,title,html){$("#infoEyebrow").textContent=eye;$("#infoTitle").textContent=title;$("#infoBody").innerHTML=html;openPanel("info")}

function collect(id){
  if(state.found.has(id))return;
  state.found.add(id);save();renderCollection();
  const item=items.find(x=>x[0]===id);toast("FOUND — "+(item?item[1]:id.toUpperCase()));
}
function renderCollection(){
  $("#collectionCount").textContent=state.found.size;
  $("#collectionGrid").innerHTML=items.map(([id,n,ic])=>state.found.has(id)
    ?'<div class="slot found"><div><b>'+ic+'</b>'+n+'</div></div>'
    :'<div class="slot">—</div>').join("");
}
function renderIdeas(){
  const statuses=["IDEA","APPROVED","ACTIVE","DONE"];
  $("#ideasGrid").innerHTML=ideas.map((n,i)=>{
    const s=state.ideas[n]||"IDEA";
    return '<button class="idea" data-idea="'+n.replace(/"/g,"&quot;")+'" style="transform:rotate('+(i%2?1.1:-1.1)+'deg)"><strong>'+n+'</strong><span class="stamp">'+s+'</span></button>'
  }).join("");
  $$("[data-idea]").forEach(b=>b.onclick=()=>{
    const n=b.dataset.idea,cur=state.ideas[n]||"IDEA",next=statuses[(statuses.indexOf(cur)+1)%statuses.length];
    state.ideas[n]=next;save();renderIdeas();toast(n+" — "+next);
  });
}
function renderSuits(){
  $("#currentSuit").textContent="CURRENT: "+state.suit;
  $("#suitGrid").innerHTML=suits.map(([n,ic])=>'<button class="suit '+(state.suit===n?"on":"")+'" data-suit="'+n+'"><div class="icon">'+ic+'</div><strong>'+n+'</strong></button>').join("");
  $$("[data-suit]").forEach(b=>b.onclick=()=>{state.suit=b.dataset.suit;save();renderSuits();toast("SUITED — "+state.suit);if(state.suit==="SPIDER SUIT")collect("spider-mask")});
}

function sceneTo(name,instant=false){
  const s=scenes[name];if(!s)return;
  closePanels();
  const go=()=>{
    state.scene=name;
    $("#sceneBg").style.backgroundImage='url("'+s.bg+'")';
    $("#sceneEyebrow").textContent=s.eye;
    $("#sceneTitle").textContent=s.title;
    $("#sceneCopy").textContent=s.copy;
    $("#sceneHint").textContent=s.hint;
    $$("[data-nav]").forEach(b=>b.classList.toggle("active",b.dataset.nav===name));
    renderHotspots(s);
    document.body.dataset.season=state.season;
    document.body.dataset.storm=String(state.storm);
    setTimeout(()=>$("#transition").classList.remove("on"),60);
  };
  if(instant){go();return}
  $("#transition").classList.add("on");setTimeout(go,420);
}
function renderHotspots(s){
  $("#hotspotLayer").innerHTML=s.hotspots.map((h,i)=>'<button class="hotspot" data-hot="'+i+'" style="left:'+h.x+'%;top:'+h.y+'%;width:'+(h.w||10)+'%;height:'+(h.h||12)+'%" aria-label="'+h.label+'"></button>').join("");
  $("#collectibleLayer").innerHTML="";
  $$("[data-hot]").forEach(b=>{
    const h=s.hotspots[+b.dataset.hot];
    b.onmouseenter=e=>{$("#scene").classList.add("interacting");showRoomCard(e,h)};
    b.onmousemove=e=>moveRoomCard(e);
    b.onmouseleave=()=>{$("#scene").classList.remove("interacting");hideRoomCard()};
    b.onclick=()=>h.go?sceneTo(h.go):doAction(h.action);
  });
  $$("[data-collect]").forEach(b=>b.onclick=()=>collect(b.dataset.collect));
}
function showRoomCard(e,h){$("#roomCardTitle").textContent=h.label;$("#roomCardSub").textContent=h.sub||"";$("#roomCard").classList.add("show");moveRoomCard(e)}
function moveRoomCard(e){$("#roomCard").style.left=Math.min(innerWidth-230,e.clientX+16)+"px";$("#roomCard").style.top=Math.min(innerHeight-90,e.clientY+16)+"px"}
function hideRoomCard(){$("#roomCard").classList.remove("show")}

let fireplaceKnocks=0, fireplaceTimer=null, pianoSequence=[];
function doAction(a){
  if(!a)return;
  if(a==="ideas"){openPanel("ideas");return}
  if(a==="suit"){openPanel("suit");return}
  if(a==="mirror"){info("DRESSING ROOM","Current loadout","<p>"+state.suit+". That is apparently the answer.</p>");return}
  if(a==="fieldnotes"){info("FIELD NOTES","A portfolio of capabilities","<p>Navigation. Pilot. Sailing. Ski touring. Racing. Diving. Moto. Strength. Craft.</p><p>The exact list is allowed to change.</p>");return}
  if(a==="armory"){collect("iron-key");info("HIDDEN ROOM / I","The armory","<p>Armor, blades, blacksmithing, craft. A room for learning things older than the house.</p><span class='tag'>FORGE</span><span class='tag'>SWORD</span><span class='tag'>CRAFT</span>");return}
  if(a==="estate-window"){info("ESTATE / FOUND","A lit window","<p>A folded note is trapped behind the old latch:</p><p><em>Capability &gt; hobby. Stories &gt; stats.</em></p>");return}
  if(a==="estate-gate"){info("ESTATE / FOUND","The gate plaque","<p>The brass is worn almost smooth. The only readable words are:</p><p><strong>DISCIPLINE · ADVENTURE · GOOD COMPANY</strong></p>");return}
  if(a==="portrait"){info("MANOR / FOUND","No plaque.","<p>The frame is older than the painting. Four tiny season marks are carved into the back.</p>");return}
  if(a==="fireplace"){
    fireplaceKnocks++;clearTimeout(fireplaceTimer);fireplaceTimer=setTimeout(()=>fireplaceKnocks=0,1600);
    if(fireplaceKnocks>=5){fireplaceKnocks=0;collect("iron-key");toast("STONE MOVING...");setTimeout(()=>sceneTo("armory"),420)}
    else toast((5-fireplaceKnocks)+" KNOCK"+(5-fireplaceKnocks===1?"":"S")+" REMAIN");
    return
  }
  if(a==="piano"){
    info("MANOR / PIANO","Four notes.","<p>Play the sequence hidden in the house.</p><div class='piano-mini'><button data-note='C'>C</button><button data-note='E'>E</button><button data-note='G'>G</button><button data-note='B'>B</button></div>");
    setTimeout(()=>$("[data-note]").forEach(b=>b.onclick=()=>{pianoSequence.push(b.dataset.note);if(pianoSequence.slice(-4).join("")==="CEGB"){collect("watch");toast("CHORD ACCEPTED — DRAWER RELEASED");pianoSequence=[]}else if(pianoSequence.length>8)pianoSequence=[]}),0);
    return
  }
  if(a==="study-map"){info("STUDY / MAP","Red thread.","<p>California → Alaska → St. Moritz → BVI → Mongolia. No sane itinerary connects them. Good.</p>");return}
  if(a==="study-drawer"){collect("playing-card");info("STUDY / DRAWER","Not very locked.","<p>A single playing card. No note.</p>");return}
  if(a==="typewriter"){info("STUDY / TYPEWRITER","One unfinished sentence","<p><em>Learn enough things to become difficult to...</em></p>");return}
  if(a==="study-lamp"){toast("LAMP — LOW");document.querySelector(".scene-bg").animate([{filter:"brightness(.95)"},{filter:"brightness(.68)"},{filter:"brightness(.95)"}],{duration:900});info("STUDY / FOUND","Pencil marks in the margin","<p>Someone wrote: <em>One boss fight. One adventure. One skill unlock.</em></p>");return}
  if(a==="study-shelf"){collect("playing-card");info("STUDY / SHELF","One book is backwards.","<p>Behind it: a playing card and a folded note.</p>");return}
  if(a==="armor-rack"){info("ARMORY / RACK","The older skills","<p>Blacksmithing. Archery. Blades. Craft. Things that reward patience instead of scrolling.</p>");return}
  if(a==="weapon-wall"){info("ARMORY / WALL","A sword with no plaque","<p>The point is not owning it. The point is knowing how it was made.</p>");return}
  if(a==="forge"){
    info("ARMORY / FORGE","Strike when the marker is centered","<div class='forge-game'><div class='forge-track'><i id='forgeMarker'></i><span></span></div><button id='forgeStrike'>STRIKE</button></div>");
    setTimeout(()=>{let pos=0,dir=1,t=setInterval(()=>{const m=$("#forgeMarker");if(!m){clearInterval(t);return}pos+=dir*3;if(pos>=96||pos<=0)dir*=-1;m.style.left=pos+"%"},30);$("#forgeStrike").onclick=()=>{clearInterval(t);if(pos>43&&pos<57){collect("iron-key");toast("CLEAN STRIKE — FORGE MARK FOUND")}else toast("MISS — TRY AGAIN")}},0);return}
  if(a==="wardrobe-watch"){collect("watch");toast("FOUND — WATCH");return}
  if(a==="wardrobe-mask"){collect("spider-mask");info("WARDROBE / FOUND","This does not belong with the tuxedos.","<p>Correct.</p>");return}
  if(a==="helmet"){collect("race-token");info("GARAGE / FOUND","Helmet shelf","<p>Inside the helmet: an old race-school token and a note that says TRACK ONLY.</p>");return}
  if(a==="track-map"){info("GARAGE / WALL","Track map","<p>Kart → coaching → HPDE → time trial → race license → wheel-to-wheel.</p>");return}
  if(a==="archive-yale"){info("ARCHIVE / EDUCATION","Yale University","<p>Statistics & Data Science.</p><p>Some chapters fit in a frame. Most of the useful parts do not.</p>");return}
  if(a==="archive-pontevedra"){info("ARCHIVE / PLACE","Ponte Vedra Beach","<p>A place important enough to earn permanent wall space.</p>");return}
  if(a==="archive-finish"){info("ARCHIVE / FINISH LINE","Santa Cruz","<p><strong>5:29 total.</strong></p><p>The photograph behind the medal.</p>");return}
  if(a==="archive-index"){info("ARCHIVE / INDEX","The system behind the wall","<p><strong>Boss Fights</strong> — major objectives with clean finish lines.</p><p><strong>Adventures</strong> — worth doing because the story is better afterwards.</p><p><strong>Skill Unlocks</strong> — capabilities that compound.</p>");return}
  if(a==="garage-porsche"){info("GARAGE / PORSCHE","911","<p>The back-bay car. Smaller, sharper, and deliberately less theatrical.</p><p>Its own drive branch can come later. For now, it stays parked.</p>");return}
  if(a==="santa-relic"){collect("vault-seal");info("RELIC / COMPLETED","IRONMAN 70.3 — SANTA CRUZ","<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p>");return}
  if(a==="ski-relic"){collect("ski-pass");info("RELIC / UNLOCKED","SKI BACKFLIP","<p>Unlocked. Next objective: make it boring.</p>");return}
  if(a==="locked-drawer"){info("ARCHIVE / ???","Unmarked drawer","<p>It does not open. Yet.</p>");return}
  if(a==="compass-case"){collect("compass");toast("FOUND — COMPASS");return}
  if(a==="map-route"){info("MAP ROOM / ROUTE","A pencil line across the ocean","<p>The route begins in California and ends somewhere that does not have a direct flight home.</p>");return}
  if(a==="camp-compass"){collect("compass");info("CLEARING / FOUND","Old compass","<p>Still points north. Annoyingly practical.</p>");return}
  if(a==="tree-carving"){info("CLEARING / TREE","Three letters. One date.","<p>No explanation. Some lore should stay lore.</p>");return}
  if(a==="tree"){collect("ornament");info("NYC / TREE","The wrong ornament","<p>A tiny brass W. It definitely came from the estate.</p>");return}
  if(a==="snowglobe"){toast("SNOW GLOBE — SHAKEN");$("#weatherFx").animate([{opacity:.35},{opacity:.9},{opacity:.35}],{duration:900});return}
  if(a==="pirate"){collect("pirate-coin");info("HIDDEN ROOM / II","The chart room","<p>Pirates, passages, nautical charts, navigation tools, and routes that look better on paper.</p>");return}
  if(a==="boss"){info("ARCHIVE / 01","Boss Fights","<p>Major objectives with clean finish lines.</p><span class='tag'>IRON DISTANCE</span><span class='tag'>EXPEDITION RACE</span><span class='tag'>SPARTAN ULTRA</span>");return}
  if(a==="adventure"){info("ARCHIVE / 02","Adventures","<p>Worth doing because the story is better afterwards.</p><span class='tag'>ALCATRAZ</span><span class='tag'>MONGOLIA</span><span class='tag'>SAILING PASSAGE</span>");return}
  if(a==="skill"){info("ARCHIVE / 03","Skill Unlocks","<p>Capabilities that compound.</p><span class='tag'>BACKFLIP</span><span class='tag'>PILOT</span><span class='tag'>NAVIGATION</span><span class='tag'>WINGFOIL</span>");return}
  if(a==="relic"){collect("vault-seal");info("RELIC / COMPLETED","IRONMAN 70.3 — SANTA CRUZ","<p><strong>5:29 total.</strong></p><p>Swim 37:55 · Bike 2:57:05 · Run 1:44:55.</p><p>No speech. Put the proof in the case and keep moving.</p>");return}
  if(a.startsWith("place-")){
    const k=a.slice(6);
    const titles={
      sf:"SAN FRANCISCO",banff:"BANFF",santamonica:"SANTA MONICA",peru:"PERU",costarica:"COSTA RICA",
      london:"LONDON",europe:"EUROPE",japan:"JAPAN",vail:"VAIL, COLORADO",seasia:"SOUTHEAST ASIA",
      southafrica:"SOUTH AFRICA",pontevedra:"PONTE VEDRA / NORTHEAST FLORIDA",ct:"CONNECTICUT",
      bahamas:"BAHAMAS",jamaica:"JAMAICA",california:"CALIFORNIA",stmoritz:"ST. MORITZ",
      mongolia:"MONGOLIA",bvi:"BVI",thailand:"THAILAND"
    };
    const copy={
      sf:"Home base now — Pacific water, hills, bikes, and the place the estate is being imagined from.",
      banff:"One of the mountain pins. Banff belongs in the room.",
      santamonica:"A California pin on the western edge of the map.",
      peru:"A South America pin that earned a permanent place on the wall.",
      costarica:"Six weeks in Costa Rica.",
      london:"Born in London. The map starts here before it goes anywhere else.",
      europe:"During my gap year, I backpacked around Europe solo for four months.",
      japan:"Coming soon: Japan in 2027.",
      vail:"Vail, Colorado — another mountain pin in the collection.",
      seasia:"Southeast Asia — a trip with friends.",
      southafrica:"South Africa — a childhood safari trip.",
      pontevedra:"Ponte Vedra Beach / Northeast Florida — one of the places that feels foundational enough to show up in both the archive and the map room.",
      ct:"Connecticut — another Northeast chapter.",
      bahamas:"The Bahamas — many New Years spent here.",
      jamaica:"Jamaica — where I learned to scuba dive.",
      california:"Cliffs, bikes, long roads, dry hills, cold Pacific water.",
      stmoritz:"Snow, clean lines, winter machinery, good coats.",
      mongolia:"Dirt bikes. Open country. Nine days.",
      bvi:"Sailing, diving, moving water, islands close enough for lunch.",
      thailand:"Warm rain, diving, islands, scooters."
    };
    collect("map-pin");info("MAP PIN",titles[k]||k.toUpperCase(),"<p>"+(copy[k]||"Pinned.")+"</p>");return
  }
  if(a==="mission"){info("MISSION TERMINAL","OPERATION: WINTER FORMAL","<div class='dossier'>LOCATION: NEW YORK<br>TIME: 20:40<br>ATTIRE: "+state.suit+"<br>VEHICLE: BLACK GRAND TOURER<br>WEATHER: SNOW<br><br>OBJECTIVE:<br>LEAVE THE APARTMENT LOOKING LIKE YOU KNOW WHERE YOU ARE GOING.<br><br>SECONDARY OBJECTIVE:<br>DO SOMETHING WORTH RETELLING.</div>");return}
  if(a==="windows"){info("NYC / DECEMBER","Best version of the city.","<p>Snow outside. Fire inside. Somewhere to be later.</p>");return}
  if(a==="campfire"){info("THE CLEARING","No scoreboard.","<p>Some things do not need to become metrics.</p>");return}
  if(a==="stars"){collect("star-map");info("THE SKY","Unofficial constellations","<p>Motorcycle. Sailboat. Shark. Skier. Sword.</p>");return}
  if(a==="tent"){info("BREVARD / NORTH CAROLINA","Camp country.","<p><strong>Brevard, North Carolina.</strong> One of those places that feels permanently tied to summer and being outside.</p><p>Camp Carolina. Dolly\'s ice cream. Sliding Rock. The Blue Ridge Parkway. The Appalachian Trail.</p><p>Mountains, campfires, cold water, long roads through the Blue Ridge, and the kind of memories that make a tent belong in the estate.</p>");return}
  if(a==="moto"){collect("race-token");info("GARAGE / DIRT","Mongolia starts here.","<p>Trail riding → camping → desert → multi-day expedition.</p>");return}
  if(a==="bike"){info("GARAGE / CARBON","The engine is the problem.","<p>Road. Mountain. Long climbs. Bad ideas measured in watts.</p>");return}
  if(a.startsWith("drive-")){startDrive(a.slice(6));return}
}

function startDrive(type){
  const map={race:["RED / TRACK","Redline after dark.",112],aston:["BLACK / GRAND TOURER","Somewhere after rain.",72],rover:["ESTATE / RANGE","Rain belongs on the windshield.",54]};
  const d=map[type]||map.aston;state.driveX=50;state.speed=d[2];
  $("#driveCarLabel").textContent=d[0];$("#driveTitle").textContent=d[1];$("#driveSpeed").textContent=state.speed;$("#driveLaneCar").style.left="50%";
  $("#driveOverlay").classList.add("open");collect("road-key");
}

function applyWeather(){
  document.body.dataset.season=state.season;document.body.dataset.storm=String(state.storm);
  $("#stormBtn").textContent="STORM MODE — "+(state.storm?"ON":"OFF");save();
}
function toggleSound(){
  if(state.sound){try{state.audio?.stop()}catch(e){}state.sound=false;$("#soundBtn").textContent="SOUND — OFF";return}
  try{
    const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)());
    const buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.06;
    const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();
    filter.type="lowpass";filter.frequency.value=760;gain.gain.value=.11;src.buffer=buf;src.loop=true;src.connect(filter);filter.connect(gain);gain.connect(ac.destination);src.start();
    state.sound=true;state.audio=src;$("#soundBtn").textContent="SOUND — ON";
  }catch(e){}
}

function parallax(e){
  if(state.reduce)return;
  const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
  $("#sceneBg").style.transform="scale(1.065) translate("+(-x*10)+"px,"+(-y*7)+"px)";
  $(".depth-a").style.transform="translate("+(x*8)+"px,"+(y*5)+"px)";
  $(".depth-b").style.transform="translate("+(-x*5)+"px,"+(-y*3)+"px)";
}

$("#enterBtn").onclick=()=>{$("#boot").classList.add("hide");setTimeout(()=>$("#boot").remove(),950)}
$("#brandBtn").onclick=()=>sceneTo("estate");
$$("[data-nav]").forEach(b=>b.onclick=()=>sceneTo(b.dataset.nav));
$("#soundBtn").onclick=toggleSound;
$("#ideasBtn").onclick=()=>openPanel("ideas");
$("#suitBtn").onclick=()=>openPanel("suit");
$("#weatherBtn").onclick=()=>openPanel("weather");
$("#collectionBtn").onclick=()=>openPanel("collection");
$("#settingsBtn").onclick=()=>openPanel("settings");
$$("[data-close]").forEach(b=>b.onclick=closePanels);
Array.from(document.querySelectorAll("#weatherPanel [data-season]")).forEach(b=>b.onclick=e=>{e.stopPropagation();state.season=b.dataset.season;applyWeather();toast("SEASON — "+state.season.toUpperCase())});
$("#stormBtn").onclick=()=>{state.storm=!state.storm;applyWeather();toast(state.storm?"STORM FRONT MOVING IN":"STORM CLEARED")};
$("#reduceMotionBtn").onclick=()=>{state.reduce=!state.reduce;document.body.classList.toggle("reduce-motion",state.reduce);$("#reduceMotionBtn").textContent="MOTION — "+(state.reduce?"REDUCED":"FULL");save()};
$("#resetBtn").onclick=()=>{["wells.collection","wells.ideas","wells.outfit","wells.season","wells.storm","wells.reduceMotion"].forEach(k=>localStorage.removeItem(k));location.reload()};
$("#revealBtn").onpointerdown=()=>document.body.classList.add("discover");
$("#revealBtn").onpointerup=$("#revealBtn").onpointerleave=()=>document.body.classList.remove("discover");
$("#driveExit").onclick=()=>$("#driveOverlay").classList.remove("open");
addEventListener("mousemove",parallax);
addEventListener("keydown",e=>{
  if(e.key.toLowerCase()==="d" && !$("#driveOverlay").classList.contains("open"))document.body.classList.add("discover");
  if(!$("#driveOverlay").classList.contains("open"))return;
  const k=e.key.toLowerCase();
  if(k==="a"||e.key==="ArrowLeft")state.driveX=Math.max(34,state.driveX-3);
  if(k==="d"||e.key==="ArrowRight")state.driveX=Math.min(66,state.driveX+3);
  if(k==="w"||e.key==="ArrowUp")state.speed=Math.min(140,state.speed+2);
  if(k==="s"||e.key==="ArrowDown")state.speed=Math.max(35,state.speed-2);
  $("#driveLaneCar").style.left=state.driveX+"%";$("#driveSpeed").textContent=state.speed;
});

renderCollection();renderIdeas();renderSuits();applyWeather();
document.body.classList.toggle("reduce-motion",state.reduce);
$("#reduceMotionBtn").textContent="MOTION — "+(state.reduce?"REDUCED":"FULL");
sceneTo("estate",true);
addEventListener("keyup",e=>{if(e.key.toLowerCase()==="d")document.body.classList.remove("discover")});
