const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));

const IMG={
  estate:"https://images.unsplash.com/photo-1761767274100-b7bad43be8cf?auto=format&fit=crop&w=2400&q=88",
  manor:"https://images.unsplash.com/photo-1760372056041-11e0fc48042e?auto=format&fit=crop&w=2400&q=88",
  garage:"https://images.unsplash.com/photo-1760714148513-a4d42621f97d?auto=format&fit=crop&w=2400&q=88",
  study:"https://images.unsplash.com/photo-1739918069081-78dddf3240a6?auto=format&fit=crop&w=2400&q=88",
  wardrobe:"https://images.unsplash.com/photo-1765766600589-ddad380d6534?auto=format&fit=crop&w=2400&q=88",
  archive:"https://images.unsplash.com/photo-1759774311106-630dbcc45b70?auto=format&fit=crop&w=2400&q=88",
  map:"https://images.unsplash.com/photo-1521920592574-49e0b121c964?auto=format&fit=crop&w=2400&q=88",
  nyc:"https://images.unsplash.com/photo-1782392454932-35a85377d02c?auto=format&fit=crop&w=2400&q=88",
  camp:"https://images.unsplash.com/photo-1538135901208-b7bc0a074a56?auto=format&fit=crop&w=2400&q=88"
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
    title:"The manor.",eye:"WELLS / MANOR",copy:"Old stone, warm wood, and rooms with different rules.",
    hint:"Doors work. So do fireplaces, paintings, instruments, and bad instincts.",
    bg:IMG.manor,
    hotspots:[
      {x:23,y:55,w:18,h:34,label:"STUDY DOOR",sub:"Plans / bad ideas",go:"study"},
      {x:78,y:55,w:18,h:34,label:"DRESSING ROOM",sub:"Choose the genre",go:"wardrobe"},
      {x:51,y:50,w:14,h:28,label:"ARCHIVE DOOR",sub:"Proof / locked drawers",go:"archive"},
      {x:88,y:45,w:13,h:26,label:"OLD LIFT",sub:"New York / December",go:"nyc"},
      {x:49,y:70,w:19,h:24,label:"FIREPLACE",sub:"The stone sounds hollow",action:"fireplace"},
      {x:13,y:36,w:16,h:24,label:"PORTRAIT",sub:"No plaque",action:"portrait"},
      {x:34,y:73,w:23,h:19,label:"PIANO",sub:"Four notes open something",action:"piano"},
      {x:7,y:58,w:11,h:31,label:"SUIT OF ARMOR",sub:"Older than everything else in here",action:"armory"}
    ],
    collectibles:[{x:84,y:78,id:"spider-mask",icon:"◒"},{x:63,y:79,id:"watch",icon:"◉"}]
  },
  study:{
    title:"The study.",eye:"WELLS / STUDY",copy:"Plans, maps, questions, and things that probably sounded better after midnight.",
    hint:"Nothing on the desk is decorative.",
    bg:IMG.study,
    hotspots:[
      {x:73,y:45,w:34,h:42,label:"BAD IDEAS BOARD",sub:"Idea → approved → active → done",action:"ideas"},
      {x:45,y:62,w:20,h:22,label:"FIELD NOTES",sub:"Things worth learning",action:"fieldnotes"},
      {x:25,y:36,w:22,h:24,label:"PINNED MAP",sub:"Red thread / unnecessary ambition",action:"study-map"},
      {x:34,y:76,w:18,h:16,label:"LOCKED DRAWER",sub:"It is, obviously, not locked well",action:"study-drawer"},
      {x:58,y:72,w:17,h:18,label:"TYPEWRITER",sub:"One unfinished sentence",action:"typewriter"},
      {x:13,y:55,w:13,h:32,label:"HALL DOOR",sub:"Back to manor",go:"manor"}
    ],
    collectibles:[{x:61,y:72,id:"playing-card",icon:"♠"}]
  },
  wardrobe:{
    title:"The dressing room.",eye:"WELLS / WARDROBE",copy:"Choose the genre before choosing the destination.",
    hint:"Open cabinets. Check shelves. One outfit is much less sensible than the others.",
    bg:IMG.wardrobe,
    hotspots:[
      {x:62,y:50,w:45,h:58,label:"WARDROBE",sub:"Dinner / race / snow / water / western / spider",action:"suit"},
      {x:15,y:50,w:22,h:58,label:"MIRROR",sub:"Current loadout",action:"mirror"},
      {x:52,y:72,w:15,h:16,label:"WATCH CASE",sub:"Mechanical / small / expensive-looking",action:"wardrobe-watch"},
      {x:83,y:30,w:16,h:23,label:"TOP SHELF",sub:"Something red is tucked behind a hat box",action:"wardrobe-mask"},
      {x:30,y:80,w:20,h:14,label:"HALL DOOR",sub:"Back to manor",go:"manor"}
    ],
    collectibles:[{x:55,y:65,id:"watch",icon:"◉"}]
  },
  garage:{
    title:"The garage.",eye:"WELLS / GARAGE",copy:"Machines with consequences.",
    hint:"Cars start. Shelves hide things. The wall map is not decoration.",
    bg:IMG.garage,
    hotspots:[
      {x:30,y:58,w:25,h:33,label:"RED / TRACK",sub:"Performance branch",action:"drive-race"},
      {x:55,y:56,w:24,h:32,label:"BLACK / GRAND TOURER",sub:"Night-drive branch",action:"drive-aston"},
      {x:77,y:56,w:22,h:32,label:"ESTATE / RANGE",sub:"Rain looks correct on it",action:"drive-rover"},
      {x:10,y:72,w:16,h:26,label:"DIRT BIKE",sub:"Desert → Mongolia",action:"moto"},
      {x:91,y:70,w:15,h:28,label:"CARBON BIKE",sub:"Long climbs / watts",action:"bike"},
      {x:19,y:28,w:14,h:16,label:"HELMET SHELF",sub:"A race-school token is tucked inside one",action:"helmet"},
      {x:88,y:28,w:16,h:17,label:"TRACK MAP",sub:"A line through corners / no explanation",action:"track-map"}
    ],
    collectibles:[{x:87,y:24,id:"race-token",icon:"◫"}]
  },
  archive:{
    title:"The capability archive.",eye:"WELLS / ARCHIVE",copy:"Proof, plans, and locked drawers.",
    hint:"The objects are the biography. The labels are secondary.",
    bg:IMG.archive,
    hotspots:[
      {x:27,y:50,w:20,h:27,label:"BOSS FIGHTS",sub:"Clean finish lines",action:"boss"},
      {x:51,y:45,w:20,h:27,label:"ADVENTURES",sub:"Worth it for the story",action:"adventure"},
      {x:73,y:52,w:20,h:27,label:"SKILL UNLOCKS",sub:"Capabilities that compound",action:"skill"},
      {x:88,y:42,w:15,h:26,label:"VAULT",sub:"Open relic case",action:"relic"},
      {x:42,y:71,w:14,h:17,label:"RACE RELIC",sub:"Santa Cruz / 5:29",action:"santa-relic"},
      {x:66,y:70,w:14,h:17,label:"SKI PASS",sub:"Backflip — unlocked",action:"ski-relic"},
      {x:18,y:76,w:15,h:16,label:"UNMARKED DRAWER",sub:"No category",action:"locked-drawer"}
    ],
    collectibles:[{x:63,y:74,id:"gold-bar",icon:"▰"},{x:84,y:69,id:"vault-seal",icon:"◇"},{x:67,y:72,id:"ski-pass",icon:"▣"}]
  },
  map:{
    title:"The map room.",eye:"WELLS / MAP ROOM",copy:"Some pins are memories. Some are future stories.",
    hint:"The map declines to clarify which is which.",
    bg:IMG.map,
    hotspots:[
      {x:27,y:52,w:12,h:12,label:"CALIFORNIA",sub:"Home base",action:"place-california"},
      {x:45,y:46,w:12,h:12,label:"NEW YORK",sub:"December",go:"nyc"},
      {x:58,y:40,w:12,h:12,label:"ST. MORITZ",sub:"Winter branch",action:"place-stmoritz"},
      {x:64,y:58,w:12,h:12,label:"MONGOLIA",sub:"Nine days / dirt",action:"place-mongolia"},
      {x:74,y:66,w:12,h:12,label:"BVI",sub:"Sail / dive",action:"place-bvi"},
      {x:86,y:51,w:12,h:12,label:"THAILAND",sub:"Islands / water",action:"place-thailand"},
      {x:13,y:63,w:17,h:28,label:"SHIP'S WHEEL",sub:"It moves when it should not",action:"pirate"},
      {x:71,y:30,w:12,h:14,label:"BRASS COMPASS",sub:"Needle points somewhere inconvenient",action:"compass-case"},
      {x:36,y:68,w:20,h:15,label:"PENCIL ROUTE",sub:"Someone has drawn a line across the ocean",action:"map-route"}
    ],
    collectibles:[{x:70,y:29,id:"compass",icon:"✥"},{x:78,y:77,id:"map-pin",icon:"•"}]
  },
  camp:{
    title:"The clearing.",eye:"WELLS / CAMPFIRE",copy:"No scoreboard.",
    hint:"The fire, the tent, and the sky all have something to say.",
    bg:IMG.camp,
    hotspots:[
      {x:51,y:59,w:26,h:28,label:"THE FIRE",sub:"Stay a minute",action:"campfire"},
      {x:72,y:18,w:50,h:26,label:"THE SKY",sub:"Five unofficial constellations",action:"stars"},
      {x:20,y:52,w:26,h:40,label:"THE TENT",sub:"No agenda",action:"tent"},
      {x:34,y:73,w:15,h:15,label:"OLD COMPASS",sub:"Left beside a log",action:"camp-compass"},
      {x:82,y:63,w:16,h:19,label:"TREE CARVING",sub:"Three letters / one date",action:"tree-carving"}
    ],
    collectibles:[{x:83,y:18,id:"star-map",icon:"✦"}]
  },
  nyc:{
    title:"New York. December.",eye:"WELLS / NYC",copy:"Upper East Side. After dark.",
    hint:"The apartment is a side quest. Treat it accordingly.",
    bg:IMG.nyc,
    hotspots:[
      {x:26,y:53,w:26,h:40,label:"MISSION TERMINAL",sub:"Open dossier",action:"mission"},
      {x:57,y:48,w:35,h:55,label:"WINDOWS",sub:"Central Park / snow",action:"windows"},
      {x:77,y:65,w:17,h:35,label:"DINNER JACKET",sub:"Suit up",action:"suit"},
      {x:88,y:34,w:15,h:26,label:"OLD LIFT",sub:"Return to manor",go:"manor"},
      {x:44,y:43,w:18,h:42,label:"CHRISTMAS TREE",sub:"One ornament does not match",action:"tree"},
      {x:61,y:72,w:12,h:16,label:"SNOW GLOBE",sub:"Shake it",action:"snowglobe"}
    ],
    collectibles:[{x:44,y:35,id:"ornament",icon:"●"}]
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
  $("#collectibleLayer").innerHTML=(s.collectibles||[]).map(c=>'<button class="collectible" data-collect="'+c.id+'" style="left:'+c.x+'%;top:'+c.y+'%">'+c.icon+'</button>').join("");
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
    if(fireplaceKnocks>=5){fireplaceKnocks=0;collect("iron-key");info("HIDDEN ROOM","Stone moving...","<p>Five knocks. The left side of the fireplace shifts just enough to reveal the armory passage.</p><p><strong>ARMORY — UNLOCKED</strong></p>")}
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
  if(a==="wardrobe-watch"){collect("watch");toast("FOUND — WATCH");return}
  if(a==="wardrobe-mask"){collect("spider-mask");info("WARDROBE / FOUND","This does not belong with the tuxedos.","<p>Correct.</p>");return}
  if(a==="helmet"){collect("race-token");info("GARAGE / FOUND","Helmet shelf","<p>Inside the helmet: an old race-school token and a note that says TRACK ONLY.</p>");return}
  if(a==="track-map"){info("GARAGE / WALL","Track map","<p>Kart → coaching → HPDE → time trial → race license → wheel-to-wheel.</p>");return}
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
    const k=a.slice(6),copy={california:"Cliffs, bikes, long roads, dry hills, cold Pacific water.",stmoritz:"Snow, clean lines, winter machinery, good coats.",mongolia:"Dirt bikes. Open country. Nine days.",bvi:"Sailing, diving, moving water, islands close enough for lunch.",thailand:"Warm rain, diving, islands, scooters."};
    collect("map-pin");info("MAP PIN",k.toUpperCase(),"<p>"+(copy[k]||"Pinned.")+"</p>");return
  }
  if(a==="mission"){info("MISSION TERMINAL","OPERATION: WINTER FORMAL","<div class='dossier'>LOCATION: NEW YORK<br>TIME: 20:40<br>ATTIRE: "+state.suit+"<br>VEHICLE: BLACK GRAND TOURER<br>WEATHER: SNOW<br><br>OBJECTIVE:<br>LEAVE THE APARTMENT LOOKING LIKE YOU KNOW WHERE YOU ARE GOING.<br><br>SECONDARY OBJECTIVE:<br>DO SOMETHING WORTH RETELLING.</div>");return}
  if(a==="windows"){info("NYC / DECEMBER","Best version of the city.","<p>Snow outside. Fire inside. Somewhere to be later.</p>");return}
  if(a==="campfire"){info("THE CLEARING","No scoreboard.","<p>Some things do not need to become metrics.</p>");return}
  if(a==="stars"){collect("star-map");info("THE SKY","Unofficial constellations","<p>Motorcycle. Sailboat. Shark. Skier. Sword.</p>");return}
  if(a==="tent"){info("THE CLEARING","No agenda.","<p>Stay until the fire gets low.</p>");return}
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
$$("[data-season]").forEach(b=>b.onclick=()=>{state.season=b.dataset.season;applyWeather();toast("SEASON — "+state.season.toUpperCase())});
$("#stormBtn").onclick=()=>{state.storm=!state.storm;applyWeather();toast(state.storm?"STORM FRONT MOVING IN":"STORM CLEARED")};
$("#reduceMotionBtn").onclick=()=>{state.reduce=!state.reduce;document.body.classList.toggle("reduce-motion",state.reduce);$("#reduceMotionBtn").textContent="MOTION — "+(state.reduce?"REDUCED":"FULL");save()};
$("#resetBtn").onclick=()=>{["wells.collection","wells.ideas","wells.outfit","wells.season","wells.storm","wells.reduceMotion"].forEach(k=>localStorage.removeItem(k));location.reload()};
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
