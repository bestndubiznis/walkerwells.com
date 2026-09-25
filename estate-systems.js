/* WELLS Estate Systems v2 — lighting, map table, observatory, clock, notebook */
(() => {
  const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
  const KEY='wells.systems.v2';
  const SESSION='wells.systems.session';
  const today=()=>{
    const d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  };
  const nowISO=()=>new Date().toISOString();
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch(e){return {}}};
  const sys=Object.assign({lights:{},customPins:[],journal:[],moonWins:[],clockChimes:0,pinOverrides:{},hiddenPins:[]},read());
  sys.lights=sys.lights||{};sys.customPins=sys.customPins||[];sys.journal=sys.journal||[];sys.moonWins=sys.moonWins||[];
  sys.pinOverrides=sys.pinOverrides||{};sys.hiddenPins=sys.hiddenPins||[];
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(sys))}catch(e){}};
  const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function log(type,title,detail=''){
    const ts=Date.now();
    const last=sys.journal[sys.journal.length-1];
    if(last&&last.type===type&&last.title===title&&ts-Date.parse(last.at)<90000)return;
    sys.journal.push({at:new Date(ts).toISOString(),type,title,detail});
    if(sys.journal.length>240)sys.journal=sys.journal.slice(-240);
    save();
  }
  if(!sessionStorage.getItem(SESSION)){
    log(sys.journal.length?'return':'arrival',sys.journal.length?'Returned to the estate':'First arrival at the estate',document.querySelector('#bootWeather')?.textContent||'');
    try{sessionStorage.setItem(SESSION,today())}catch(e){}
  }

  const corePins=[
    {id:'sf',name:'San Francisco',lat:37.7749,lon:-122.4194,desc:'Home base.'},
    {id:'banff',name:'Banff',lat:51.1784,lon:-115.5708,desc:'Canadian Rockies.'},
    {id:'santamonica',name:'Santa Monica',lat:34.0195,lon:-118.4912,desc:'California / Pacific.'},
    {id:'peru',name:'Peru',lat:-9.19,lon:-75.0152,desc:'South America.'},
    {id:'costarica',name:'Costa Rica',lat:9.7489,lon:-83.7534,desc:'Six weeks.'},
    {id:'london',name:'London',lat:51.5074,lon:-0.1278,desc:'Born here.'},
    {id:'europe',name:'Europe',lat:50.1,lon:10.0,desc:'Four months solo / gap year.'},
    {id:'japan',name:'Japan',lat:36.2048,lon:138.2529,desc:'Coming soon / 2027.'},
    {id:'vail',name:'Vail, Colorado',lat:39.6403,lon:-106.3742,desc:'Mountain chapter.'},
    {id:'seasia',name:'Southeast Asia',lat:13.7563,lon:100.5018,desc:'Trip with friends.'},
    {id:'southafrica',name:'South Africa',lat:-30.5595,lon:22.9375,desc:'Childhood safari.'},
    {id:'pontevedra',name:'Ponte Vedra',lat:30.2397,lon:-81.3856,desc:'Northeast Florida.'},
    {id:'ct',name:'New Haven, Connecticut',lat:41.3083,lon:-72.9279,desc:'Northeast chapter.'},
    {id:'bahamas',name:'Bahamas',lat:25.0343,lon:-77.3963,desc:'Many New Years.'},
    {id:'jamaica',name:'Jamaica',lat:18.1096,lon:-77.2975,desc:'Learned to scuba dive.'}
  ];
  const xy=p=>({x:(p.lon+180)/360*100,y:(90-p.lat)/180*100});
  const ll=(x,y)=>({lon:x/100*360-180,lat:90-y/100*180});

  function ensureHotspot(scene,spot){
    if(!scenes[scene])return;
    scenes[scene].hotspots=scenes[scene].hotspots||[];
    if(!scenes[scene].hotspots.some(h=>h.action===spot.action))scenes[scene].hotspots.push(spot);
  }
  ensureHotspot('map',{x:52,y:53,w:35,h:33,label:'PHYSICAL MAP TABLE',sub:'Pins / routes / add a place',action:'map-table'});
  ensureHotspot('study',{x:88,y:48,w:17,h:46,label:'BRASS TELESCOPE',sub:'Observatory / lunar scan',action:'observatory'});
  ensureHotspot('study',{x:58,y:62,w:16,h:11,label:'VISITOR NOTEBOOK',sub:'The estate keeps a dated record',action:'visitor-notebook'});

  const systemLayer=document.createElement('div');
  systemLayer.id='systemsLayer';systemLayer.className='systems-layer';
  q('#scene')?.appendChild(systemLayer);

  const journalBtn=document.createElement('button');
  journalBtn.id='journalBtn';journalBtn.className='glass-btn';journalBtn.textContent='JOURNAL';
  const actions=q('.top-actions');if(actions)actions.insertBefore(journalBtn,q('#weatherBtn')||null);

  function shell(id,cls,html){
    let el=q('#'+id);if(el)return el;
    el=document.createElement('section');el.id=id;el.className=cls;el.setAttribute('aria-hidden','true');el.innerHTML=html;
    q('#world')?.appendChild(el);return el;
  }

  const mapOverlay=shell('mapTableOverlay','estate-system-overlay map-table-overlay',`
    <button class="system-exit" data-system-close="map">CLOSE TABLE</button>
    <div class="map-table-shell">
      <header class="system-head"><div><small>MAP ROOM / TABLE I</small><h2>The world, in pins.</h2></div><span id="mapPinCount"></span></header>
      <div class="map-table-layout">
        <div class="physical-world-map" id="physicalWorldMap" aria-label="World map table">
          <div id="leafletWorldMap" class="leaflet-world-map"></div>
          <div id="manualPinGuide" class="manual-pin-guide">CLICK THE REAL MAP TO PLACE THIS LOCATION</div>
        </div>
        <aside class="map-ledger">
          <div id="mapSelection" class="map-selection"><small>PIN LEDGER</small><h3>Select a pin.</h3><p>Every original map-room location is already here. New pins are stored in this browser.</p></div>
          <button id="addMapLocation" class="system-action">+ ADD LOCATION</button>
          <form id="mapAddForm" class="map-add-form" hidden>
            <label>PLACE<input id="mapPlaceInput" autocomplete="off" maxlength="90" placeholder="Kyoto, Japan" required></label>
            <label>DESCRIPTION<textarea id="mapDescInput" maxlength="240" placeholder="Why it belongs on the map"></textarea></label>
            <button class="system-action" type="submit">FIND & PIN</button>
            <button id="mapManualBtn" class="system-action secondary" type="button">PLACE MANUALLY</button>
            <p id="mapFormStatus" class="system-status"></p>
          </form>
          <div class="map-attribution">Geocoding when available: © OpenStreetMap contributors.</div>
        </aside>
      </div>
    </div>`);

  const obs=shell('observatoryOverlay','estate-system-overlay observatory-overlay',`
    <button class="system-exit" data-system-close="observatory">LEAVE OBSERVATORY</button>
    <div class="observatory-chrome">
      <div class="observatory-meta"><small>WELLS / OBSERVATORY</small><h2>Lunar watch.</h2><p id="moonMeta"></p></div>
      <div class="telescope-view" id="telescopeView">
        <div class="starfield" id="observatoryStars"></div>
        <div class="moon-wrap">
          <div id="moon" class="moon">
            <div class="moon-phase-mask" id="moonPhaseMask"></div>
            <div id="moonCraters" class="moon-craters"></div>
          </div>
          <div class="scan-reticle"></div>
          <div id="alienCraft" class="alien-craft"><i></i></div>
        </div>
      </div>
      <div class="observatory-console">
        <div class="focus-control"><label for="focusWheel">FOCUS</label><input id="focusWheel" type="range" min="0" max="100" value="42"><span id="focusValue">42</span></div>
        <div class="signal-readout"><small>LUNAR ANOMALY PROTOCOL</small><strong id="signalReadout">Bring the optics into focus.</strong><div id="signalPips"><i></i><i></i><i></i></div></div>
        <button id="resetMoonScan" class="system-action secondary">RESET SCAN</button>
      </div>
    </div>`);

  const journal=shell('journalPanel','panel journal-panel',`
    <button class="panel-close" data-journal-close>×</button>
    <div class="panel-kicker">THE STUDY / VISITOR NOTEBOOK</div>
    <h3>Estate log.</h3>
    <div class="journal-book">
      <div class="journal-date" id="journalDate"></div>
      <div id="journalEntries" class="journal-entries"></div>
      <div class="journal-nav"><button id="journalPrev">← EARLIER</button><span id="journalPage"></span><button id="journalNext">LATER →</button></div>
    </div>
    <form id="journalNoteForm" class="journal-note-form"><label>LEAVE A NOTE<textarea id="journalNote" maxlength="280" placeholder="Something worth remembering..."></textarea></label><button class="system-action" type="submit">WRITE IT DOWN</button></form>
  `);

  function openOverlay(el){
    closePanels();
    el.classList.add('open');el.setAttribute('aria-hidden','false');
  }
  function closeOverlay(el){el.classList.remove('open');el.setAttribute('aria-hidden','true')}
  qa('[data-system-close]').forEach(b=>b.onclick=()=>closeOverlay(b.dataset.systemClose==='map'?mapOverlay:obs));

  // ── Interactive room lighting ─────────────────────────────────────────
  const lightRooms=new Set(['manor','study','garage','map','archive','wardrobe','nyc']);
  const lightLabels=['FULL','LOW','OFF'];
  function roomLightLevel(room){return Number.isFinite(+sys.lights[room])?+sys.lights[room]:0}
  function applyLights(){
    const room=state.scene,level=lightRooms.has(room)?roomLightLevel(room):0;
    document.body.dataset.roomLights=String(level);
    document.body.dataset.lightRoom=room;
    const grade=q('#roomLightGrade');if(grade)grade.dataset.level=String(level);
    const knob=q('#roomDimmer');
    if(knob){
      knob.dataset.level=String(level);
      knob.setAttribute('aria-label','Lighting '+lightLabels[level]);
      const txt=knob.querySelector('span');if(txt)txt.textContent=lightLabels[level];
    }
  }
  function cycleLights(){
    const room=state.scene;if(!lightRooms.has(room))return;
    const next=(roomLightLevel(room)+1)%3;sys.lights[room]=next;save();applyLights();
    log('lighting',room.toUpperCase()+' lights — '+lightLabels[next]);
    toast('LIGHTS — '+lightLabels[next]);
  }

  // ── True clock ────────────────────────────────────────────────────────
  function hands(){
    const d=new Date(),sec=d.getSeconds(),min=d.getMinutes()+sec/60,hr=(d.getHours()%12)+min/60;
    const h=q('#estateHour'),m=q('#estateMinute'),s=q('#estateSecond'),face=q('#estateClock');
    if(h)h.style.transform='translateX(-50%) rotate('+(hr*30)+'deg)';
    if(m)m.style.transform='translateX(-50%) rotate('+(min*6)+'deg)';
    if(s)s.style.transform='translateX(-50%) rotate('+(sec*6)+'deg)';
    if(face)face.setAttribute('aria-label','Estate clock — '+d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}));
    const key=today()+'-'+d.getHours();
    if(d.getMinutes()===0&&d.getSeconds()<2&&sessionStorage.getItem('wells.clock.chime')!==key){
      sessionStorage.setItem('wells.clock.chime',key);face?.classList.add('chiming');setTimeout(()=>face?.classList.remove('chiming'),1700);
      if(state.sound)playClockChime();
      log('clock','The manor clock struck '+d.toLocaleTimeString([],{hour:'numeric'}));
    }
  }
  function playClockChime(){
    try{
      const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)());
      [0,430,860].forEach((delay,i)=>setTimeout(()=>{
        const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=[523.25,659.25,783.99][i];
        g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.07,ac.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.8);
        o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.9);
      },delay));
    }catch(e){}
  }
  function openClock(){
    const d=new Date();
    playClockChime();sys.clockChimes=(sys.clockChimes||0)+1;save();
    info('MANOR / CLOCK','The house keeps your time.',`<div class="clock-readout"><strong>${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'})}</strong><span>${d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</span></div><p>The clock follows the visitor's local time. On the hour, if sound is enabled, the manor chimes.</p>`);
    log('clock','Wound the manor clock');
  }
  setInterval(hands,1000);

  // ── Scene furniture / tangible controls ───────────────────────────────
  function renderSystems(){
    if(!systemLayer)return;
    systemLayer.innerHTML='<div id="roomLightGrade" class="room-light-grade"></div>';
    const room=state.scene;
    if(lightRooms.has(room)){
      const dim=document.createElement('button');dim.id='roomDimmer';dim.className='room-dimmer';dim.type='button';
      dim.innerHTML='<i></i><small>LIGHTS</small><span></span>';dim.onclick=cycleLights;systemLayer.appendChild(dim);
    }
    if(room==='manor'){
      const clock=document.createElement('button');clock.id='estateClock';clock.className='estate-clock';clock.type='button';
      clock.innerHTML='<span class="clock-face"><i id="estateHour" class="clock-hand hour"></i><i id="estateMinute" class="clock-hand minute"></i><i id="estateSecond" class="clock-hand second"></i><b></b></span><em></em>';
      clock.onclick=openClock;systemLayer.appendChild(clock);hands();
    }
    if(room==='study'){
      // The telescope and notebook are now painted into the Study backplate.
      // Their aligned hotspot zones open the observatory and visitor notebook.
    }
    if(room==='map'){
      const table=document.createElement('button');table.className='map-table-object';table.type='button';table.setAttribute('aria-label','Open physical map table');
      table.innerHTML='<i></i><b>OPEN TABLE</b>';table.onclick=openMapTable;systemLayer.appendChild(table);
    }
    applyLights();
  }

  // ── Physical map table / real world geography ───────────────────────
  let selectedPin=null,manualDraft=null,leafletMap=null,markerLayer=null;
  const markerById=new Map();
  function allPins(){
    const builtIns=corePins
      .filter(p=>!sys.hiddenPins.includes(p.id))
      .map(p=>Object.assign({},p,sys.pinOverrides[p.id]||{}, {custom:false}));
    return [...builtIns,...sys.customPins];
  }
  function persistPinPosition(p){
    if(p.custom)return save();
    sys.pinOverrides[p.id]=Object.assign({},sys.pinOverrides[p.id]||{},{lat:p.lat,lon:p.lon});
    save();
  }
  function persistPinNote(p){
    if(p.custom)return save();
    sys.pinOverrides[p.id]=Object.assign({},sys.pinOverrides[p.id]||{},{desc:p.desc});
    save();
  }

  function mapMarkerIcon(p){
    return L.divIcon({
      className:'wells-map-marker '+(p.custom?'custom':'estate'),
      html:'<i></i>',
      iconSize:[28,34],
      iconAnchor:[14,31],
      tooltipAnchor:[0,-27]
    });
  }
  function ensureLeafletMap(){
    if(leafletMap)return true;
    if(!window.L){
      q('#mapFormStatus').textContent='The geographic map library did not load. Refresh to retry.';
      return false;
    }
    leafletMap=L.map('leafletWorldMap',{
      center:[18,0],zoom:1.75,zoomSnap:.25,zoomDelta:.5,minZoom:1.5,maxZoom:9,
      worldCopyJump:false,maxBounds:[[-85,-180],[85,180]],maxBoundsViscosity:.92,
      zoomControl:true,attributionControl:true
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,noWrap:true,bounds:[[-85,-180],[85,180]],
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);
    markerLayer=L.layerGroup().addTo(leafletMap);
    leafletMap.on('click',e=>{
      if(!manualDraft)return;
      addCustomPin(manualDraft.name,manualDraft.desc,e.latlng.lat,e.latlng.lng,'manual');
    });
    return true;
  }
  function renderPins(){
    if(!ensureLeafletMap())return;
    markerLayer.clearLayers();markerById.clear();
    allPins().forEach(p=>{
      const marker=L.marker([p.lat,p.lon],{
        icon:mapMarkerIcon(p),draggable:true,keyboard:true,title:p.name,
        alt:p.name
      }).addTo(markerLayer);
      marker.bindTooltip(esc(p.name),{direction:'top',offset:[0,-20],opacity:.95,className:'wells-map-tooltip'});
      marker.on('click',()=>selectPin(p));
      marker.on('dragstart',()=>marker.getElement()?.classList.add('dragging'));
      marker.on('dragend',()=>{
        marker.getElement()?.classList.remove('dragging');
        const ll=marker.getLatLng();p.lat=ll.lat;p.lon=ll.lng;persistPinPosition(p);selectPin(p);
        log('map','Moved '+p.name+' on the map');
      });
      markerById.set(p.id,marker);
    });
    q('#mapPinCount').textContent=allPins().length+' PINS';
    if(selectedPin&&markerById.has(selectedPin.id))markSelectedPin(selectedPin.id);
  }
  function markSelectedPin(id){
    markerById.forEach((m,key)=>m.getElement()?.classList.toggle('selected',key===id));
  }
  function selectPin(p){
    selectedPin=p;markSelectedPin(p.id);
    const custom=!!p.custom;
    q('#mapSelection').innerHTML=`<small>${custom?'YOUR PIN':'ESTATE PIN'}</small><h3>${esc(p.name)}</h3><p>${esc(p.desc||'No description yet.')}</p><div class="pin-coords">${Math.abs(p.lat).toFixed(2)}° ${p.lat>=0?'N':'S'} · ${Math.abs(p.lon).toFixed(2)}° ${p.lon>=0?'E':'W'}</div><div class="pin-actions"><button id="editPinDesc">EDIT NOTE</button><button id="deletePin">REMOVE PIN</button></div><div class="pin-nudge"><span>FINE POSITION</span><button data-nudge="0,.35">↑</button><button data-nudge="-.35,0">←</button><button data-nudge=".35,0">→</button><button data-nudge="0,-.35">↓</button></div>${!custom&&sys.pinOverrides[p.id]?'<button id="resetPin" class="pin-reset">RESET DEFAULT POSITION</button>':''}`;
    markerById.get(p.id)?.openTooltip();

    q('#deletePin').onclick=()=>{
      if(custom)sys.customPins=sys.customPins.filter(x=>x.id!==p.id);
      else if(!sys.hiddenPins.includes(p.id))sys.hiddenPins.push(p.id);
      save();selectedPin=null;renderPins();
      q('#mapSelection').innerHTML='<small>PIN REMOVED</small><h3>The table closes the gap.</h3><p>You can restore the estate defaults with Reset Local Progress.</p>';
      log('map','Removed '+p.name+' from the map');
    };

    q('#editPinDesc').onclick=()=>{
      q('#mapSelection').innerHTML=`<small>EDIT PIN NOTE</small><h3>${esc(p.name)}</h3><textarea id="inlinePinNote" class="inline-pin-note" maxlength="240">${esc(p.desc||'')}</textarea><div class="pin-actions"><button id="savePinNote">SAVE NOTE</button><button id="cancelPinNote">CANCEL</button></div>`;
      q('#inlinePinNote').focus();
      q('#savePinNote').onclick=()=>{
        p.desc=q('#inlinePinNote').value.trim().slice(0,240);persistPinNote(p);selectPin(p);log('map','Updated '+p.name+' on the map');
      };
      q('#cancelPinNote').onclick=()=>selectPin(p);
    };

    qa('[data-nudge]').forEach(btn=>btn.onclick=()=>{
      const [dLon,dLat]=btn.dataset.nudge.split(',').map(Number);
      p.lon=clamp(p.lon+dLon,-179.8,179.8);p.lat=clamp(p.lat+dLat,-84.8,84.8);persistPinPosition(p);
      markerById.get(p.id)?.setLatLng([p.lat,p.lon]);selectPin(p);log('map','Fine-tuned '+p.name+' on the map');
    });

    const reset=q('#resetPin');
    if(reset)reset.onclick=()=>{
      delete sys.pinOverrides[p.id];save();renderPins();
      const fresh=allPins().find(x=>x.id===p.id);if(fresh)selectPin(fresh);
      log('map','Reset '+p.name+' to its default position');
    };
  }
  function openMapTable(){
    openOverlay(mapOverlay);q('#mapAddForm').hidden=true;q('#manualPinGuide').classList.remove('show');manualDraft=null;
    requestAnimationFrame(()=>{
      if(!ensureLeafletMap())return;
      leafletMap.invalidateSize();
      if(!leafletMap._wellsOpened){
        leafletMap.fitBounds([[-58,-168],[72,168]],{padding:[18,18]});
        leafletMap._wellsOpened=true;
      }
      renderPins();
    });
    log('map','Opened the physical map table');
  }
  q('#addMapLocation').onclick=()=>{q('#mapAddForm').hidden=false;q('#mapFormStatus').textContent='';manualDraft=null;q('#manualPinGuide').classList.remove('show');q('#mapPlaceInput').focus()};
  q('#mapManualBtn').onclick=()=>beginManual();
  function beginManual(){
    const name=q('#mapPlaceInput').value.trim(),desc=q('#mapDescInput').value.trim();
    if(!name){q('#mapFormStatus').textContent='Name the place first.';return}
    manualDraft={name,desc};q('#manualPinGuide').classList.add('show');q('#mapFormStatus').textContent='Pan or zoom if needed, then click the correct place on the map.';
  }
  q('#mapAddForm').onsubmit=async e=>{
    e.preventDefault();
    const name=q('#mapPlaceInput').value.trim(),desc=q('#mapDescInput').value.trim(),status=q('#mapFormStatus');
    if(!name)return;
    status.textContent='Locating '+name+'…';
    try{
      const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q='+encodeURIComponent(name);
      const res=await fetch(url,{headers:{'Accept':'application/json'}});
      if(!res.ok)throw new Error('lookup');
      const data=await res.json();
      if(!data.length){status.textContent='No match. Click the map to place it manually.';manualDraft={name,desc};q('#manualPinGuide').classList.add('show');return}
      addCustomPin(name,desc,Number(data[0].lat),Number(data[0].lon),'geocoded');
      status.textContent='Pinned '+name+'. Drag the pin if you want to fine-tune it.';
    }catch(err){
      status.textContent='Map lookup unavailable. Click the map to place it manually.';
      manualDraft={name,desc};q('#manualPinGuide').classList.add('show');
    }
  };
  function addCustomPin(name,desc,lat,lon,source){
    manualDraft=null;q('#manualPinGuide').classList.remove('show');
    const p={id:'custom-'+Date.now().toString(36),name:name.slice(0,90),desc:desc.slice(0,240),lat:clamp(+lat,-85,85),lon:clamp(+lon,-180,180),custom:true,source};
    sys.customPins.push(p);save();renderPins();selectPin(p);
    markerById.get(p.id)?.openTooltip();leafletMap?.panTo([p.lat,p.lon],{animate:true,duration:.55});
    q('#mapAddForm').reset();q('#mapAddForm').hidden=true;log('map','Pinned '+p.name,p.desc);toast('MAP PIN — '+p.name.toUpperCase());
  }

  // ── Observatory + lunar anomaly game ─────────────────────────────────
  const craterPos=[[22,28],[41,20],[65,27],[31,47],[54,44],[74,51],[38,68],[59,72],[77,67]];
  let moonFound=new Set();
  function moonPhase(){
    const syn=29.53058867,known=Date.UTC(2000,0,6,18,14),days=(Date.now()-known)/86400000,age=((days%syn)+syn)%syn,frac=age/syn;
    const names=['NEW MOON','WAXING CRESCENT','FIRST QUARTER','WAXING GIBBOUS','FULL MOON','WANING GIBBOUS','LAST QUARTER','WANING CRESCENT'];
    return {age,frac,name:names[Math.round(frac*8)%8],illum:(1-Math.cos(frac*Math.PI*2))/2};
  }
  function moonTargets(){
    const scored=craterPos.map((_,i)=>({i,s:hash(today()+'|moon|'+i)})).sort((a,b)=>a.s-b.s);
    return new Set(scored.slice(0,3).map(x=>x.i));
  }
  const moonTargetSet=moonTargets();
  function populateStars(){
    const s=q('#observatoryStars');if(!s)return;s.innerHTML='';
    for(let i=0;i<80;i++){const star=document.createElement('i');star.style.left=(hash('sx'+i)%10000)/100+'%';star.style.top=(hash('sy'+today()+i)%10000)/100+'%';star.style.opacity=.2+(hash('so'+i)%70)/100;star.style.animationDelay=-(hash('sd'+i)%80)/10+'s';s.appendChild(star)}
  }
  function renderCraters(){
    const layer=q('#moonCraters'),already=sys.moonWins.includes(today());if(!layer)return;
    layer.innerHTML=craterPos.map((p,i)=>`<button class="moon-crater ${moonFound.has(i)?'signal':''}" data-crater="${i}" style="left:${p[0]}%;top:${p[1]}%" aria-label="Scan lunar crater ${i+1}"></button>`).join('');
    qa('.moon-crater').forEach(b=>b.onclick=()=>scanCrater(+b.dataset.crater,b));
    if(already){moonFound=new Set([...moonTargetSet]);qa('.moon-crater').forEach(b=>b.classList.toggle('signal',moonTargetSet.has(+b.dataset.crater)));q('#signalReadout').textContent='Three anomalous transmissions logged today.';q('#alienCraft').classList.add('revealed')}
    updatePips();
  }
  function scanCrater(i,btn){
    const focus=+q('#focusWheel').value;
    if(focus<65||focus>84){q('#signalReadout').textContent='Image too soft. Adjust focus first.';q('#telescopeView').classList.add('scan-static');setTimeout(()=>q('#telescopeView').classList.remove('scan-static'),420);return}
    if(moonFound.has(i))return;
    if(moonTargetSet.has(i)){
      moonFound.add(i);btn.classList.add('signal');q('#signalReadout').textContent='ANOMALOUS NARROWBAND SIGNAL — '+moonFound.size+'/3';ping(880);updatePips();
      if(moonFound.size===3)completeMoonGame();
    }else{
      btn.classList.add('dead');q('#signalReadout').textContent='Geology. Probably.';ping(180);setTimeout(()=>btn.classList.remove('dead'),700);
    }
  }
  function updatePips(){qa('#signalPips i').forEach((x,i)=>x.classList.toggle('on',i<moonFound.size))}
  function ping(freq){
    try{const ac=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)()),o=ac.createOscillator(),g=ac.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.07,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.18);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.2)}catch(e){}
  }
  function completeMoonGame(){
    if(!sys.moonWins.includes(today()))sys.moonWins.push(today());save();
    q('#signalReadout').textContent='THREE SIGNALS. SAME SOURCE VECTOR.';
    q('#alienCraft').classList.add('revealed');toast('LUNAR ANOMALY — LOGGED');log('observatory','Logged three lunar anomalies','The third signal shared the same source vector.');
  }
  function openObservatory(){
    openOverlay(obs);populateStars();moonFound=new Set();
    const ph=moonPhase();q('#moonMeta').textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})+' · '+ph.name+' · '+Math.round(ph.illum*100)+'% illuminated';
    q('#moonPhaseMask').style.opacity=String(clamp((1-ph.illum)*.88,.04,.82));
    q('#focusWheel').value='42';q('#focusValue').textContent='42';q('#moon').style.filter='blur(3.8px)';
    q('#signalReadout').textContent=sys.moonWins.includes(today())?'Three anomalous transmissions logged today.':'Bring the optics into focus.';
    q('#alienCraft').classList.toggle('revealed',sys.moonWins.includes(today()));renderCraters();log('observatory','Opened the observatory');
  }
  q('#focusWheel').oninput=e=>{
    const v=+e.target.value;q('#focusValue').textContent=v;
    const blur=Math.abs(v-74)/10;q('#moon').style.filter='blur('+Math.min(5,blur)+'px)';
    if(v>=65&&v<=84)q('#signalReadout').textContent=moonFound.size?'Continue scanning the crater field.':'FOCUS LOCK. Scan suspicious craters.';
  };
  q('#resetMoonScan').onclick=()=>{moonFound=new Set();q('#alienCraft').classList.remove('revealed');q('#signalReadout').textContent='Scan reset. Focus remains locked.';renderCraters()};

  // ── Visitor notebook ─────────────────────────────────────────────────
  let journalPage=0;
  function groupedJournal(){
    const groups={};
    sys.journal.forEach(e=>{const d=new Date(e.at),k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');(groups[k]||(groups[k]=[])).push(e)});
    return Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0]));
  }
  function renderJournal(){
    const groups=groupedJournal();
    if(!groups.length){q('#journalDate').textContent='NO ENTRIES YET';q('#journalEntries').innerHTML='<p class="journal-empty">The first page is waiting.</p>';return}
    journalPage=clamp(journalPage,0,groups.length-1);
    const [key,entries]=groups[journalPage],d=new Date(key+'T12:00:00');
    q('#journalDate').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
    q('#journalEntries').innerHTML=entries.map(e=>`<article><time>${new Date(e.at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</time><div><strong>${esc(e.title)}</strong>${e.detail?'<p>'+esc(e.detail)+'</p>':''}</div></article>`).join('');
    q('#journalPage').textContent=(journalPage+1)+' / '+groups.length;
    q('#journalPrev').disabled=journalPage===0;q('#journalNext').disabled=journalPage===groups.length-1;
  }
  function openJournal(){
    closePanels();journal.classList.add('open');journalPage=Math.max(0,groupedJournal().length-1);renderJournal();
  }
  journalBtn.onclick=openJournal;
  q('[data-journal-close]').onclick=()=>journal.classList.remove('open');
  q('#journalPrev').onclick=()=>{journalPage--;renderJournal()};
  q('#journalNext').onclick=()=>{journalPage++;renderJournal()};
  q('#journalNoteForm').onsubmit=e=>{e.preventDefault();const t=q('#journalNote').value.trim();if(!t)return;log('note','Visitor note',t);q('#journalNote').value='';journalPage=Math.max(0,groupedJournal().length-1);renderJournal();toast('NOTEBOOK — ENTRY SAVED')};

  // ── Integrate with existing world actions ────────────────────────────
  const actionNames={
    ideas:'Opened the Bad Ideas Board',piano:'Played the grand piano',fireplace:'Knocked at the manor fireplace',
    'armor-display':'Inspected the suit of armor','study-drawer':'Opened the study drawer','study-lamp':'Changed the study lamp',
    'study-shelf':'Inspected the library shelves','fieldnotes':'Read the field notes','track-map':'Studied the driving progression',
    'campfire':'Sat by the campfire','camp-compass':'Spun the camp compass','tree-carving':'Inspected the tree carving',
    'santa-relic':'Opened the Santa Cruz 70.3 relic','ski-relic':'Opened the ski backflip relic'
  };
  const baseCollect=collect;
  collect=function(id){
    const had=state.found.has(id);
    baseCollect(id);
    if(!had&&state.found.has(id)){
      const item=items.find(x=>x[0]===id);
      log('found','Found '+(item?item[1]:String(id).toUpperCase()));
    }
  };

  const baseDo=doAction;
  doAction=function(a){
    if(a==='map-table'){openMapTable();return}
    if(a==='observatory'){openObservatory();return}
    if(a==='visitor-notebook'){openJournal();return}
    if(a==='room-lights'){cycleLights();return}
    if(actionNames[a])log('interaction',actionNames[a]);
    return baseDo(a);
  };
  const baseScene=sceneTo;
  sceneTo=function(name,instant=false){
    closeOverlay(mapOverlay);closeOverlay(obs);journal.classList.remove('open');
    baseScene(name,instant);
    setTimeout(()=>{renderSystems();if(!instant)log('room','Entered '+(scenes[name]?.title||name).replace(/\.$/,''))},instant?0:470);
  };

  // Current scene was rendered before this script loaded.
  renderSystems();
  if(typeof renderHotspots==='function')renderHotspots(scenes[state.scene]);

  const reset=q('#resetBtn');
  if(reset)reset.onclick=()=>{
    ['wells.collection','wells.ideas','wells.outfit','wells.season','wells.storm','wells.reduceMotion','wells.living.v1','wells.driveBest',KEY]
      .forEach(k=>localStorage.removeItem(k));
    try{sessionStorage.clear()}catch(e){}
    location.reload();
  };

  q('#ideasGrid')?.addEventListener('click',e=>{
    const card=e.target.closest('[data-idea]');if(!card)return;
    setTimeout(()=>log('idea',card.dataset.idea+' — '+(state.ideas[card.dataset.idea]||'IDEA')),0);
  });
  q('#suitGrid')?.addEventListener('click',e=>{
    const card=e.target.closest('[data-suit]');if(!card)return;
    setTimeout(()=>log('wardrobe','Equipped '+state.suit),0);
  });

  addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    closeOverlay(mapOverlay);closeOverlay(obs);journal.classList.remove('open');
  });
})();