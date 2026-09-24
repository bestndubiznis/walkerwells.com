/* WELLS Living Estate v1 — world state, memory, atmosphere, physical reactions */
(() => {
  const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
  const MEM_KEY='wells.living.v1';
  const SESSION_KEY='wells.living.session';
  const now=new Date();

  function readJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}
  }
  function saveMemory(){try{localStorage.setItem(MEM_KEY,JSON.stringify(memory))}catch(e){}}
  function hash(str){
    let h=2166136261;
    for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    return h>>>0;
  }
  function unit(seed){return (hash(seed)%100000)/100000}
  function weighted(seed,choices){
    const total=choices.reduce((n,c)=>n+c[1],0);
    let r=unit(seed)*total;
    for(const c of choices){r-=c[1];if(r<=0)return c[0]}
    return choices[choices.length-1][0];
  }
  function seasonFor(d){
    const m=d.getMonth()+1;
    if(m>=3&&m<=5)return 'spring';
    if(m>=6&&m<=8)return 'summer';
    if(m>=9&&m<=11)return 'autumn';
    return 'winter';
  }
  function daypartFor(d){
    const h=d.getHours()+d.getMinutes()/60;
    if(h>=5&&h<8)return 'dawn';
    if(h>=8&&h<17)return 'day';
    if(h>=17&&h<20)return 'dusk';
    return 'night';
  }
  function phaseOfMonth(d){
    const day=d.getDate();
    return day<=10?'EARLY':day<=20?'MID':'LATE';
  }
  function dateKey(d){
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function clock(d=new Date()){
    return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  }
  function dayLabel(d){
    return d.toLocaleDateString(undefined,{month:'long',day:'numeric'}).toUpperCase();
  }
  function elapsedLabel(iso){
    if(!iso)return '';
    const diff=Date.now()-Date.parse(iso);
    if(!Number.isFinite(diff)||diff<0)return '';
    const mins=Math.round(diff/60000);
    if(mins<60)return mins<=2?'MOMENTS AGO':mins+' MIN AGO';
    const hrs=Math.round(mins/60);
    if(hrs<24)return hrs+' HOUR'+(hrs===1?'':'S')+' AGO';
    const days=Math.round(hrs/24);
    return days+' DAY'+(days===1?'':'S')+' AGO';
  }

  const season=seasonFor(now);
  const daypart=daypartFor(now);
  const weatherTable={
    spring:[['clear',24],['showers',27],['mist',18],['overcast',18],['wind',13]],
    summer:[['clear',42],['haze',22],['wind',15],['overcast',11],['storm',10]],
    autumn:[['clear',22],['rain',27],['fog',20],['overcast',18],['wind',13]],
    winter:[['clear',23],['frost',23],['snow',20],['overcast',18],['fog',10],['flurries',6]]
  };
  const weatherNames={
    clear:'CLEAR',showers:'PASSING SHOWERS',mist:'MIST',overcast:'OVERCAST',
    wind:'WINDY',haze:'HAZY',storm:'THUNDERSTORM',rain:'LIGHT RAIN',fog:'LOW FOG',
    frost:'FROST',snow:'SNOW',flurries:'LIGHT FLURRIES'
  };
  const today=dateKey(now);
  const weatherKey=weighted(today+'|'+season+'|weather',weatherTable[season]);
  const world={season,daypart,weather:weatherKey,weatherLabel:weatherNames[weatherKey]||weatherKey.toUpperCase()};

  const memory=readJSON(MEM_KEY,{
    firstSeen:now.toISOString(),lastSeen:null,visits:0,sceneVisits:{},actions:{},objectStates:{},ravenSightings:0
  });
  memory.sceneVisits=memory.sceneVisits||{};
  memory.actions=memory.actions||{};
  memory.objectStates=memory.objectStates||{};
  memory.firstSeen=memory.firstSeen||now.toISOString();
  const priorLastSeen=memory.lastSeen;
  const gap=priorLastSeen?Date.now()-Date.parse(priorLastSeen):Infinity;
  const sessionFresh=!sessionStorage.getItem(SESSION_KEY)&&gap>30*60*1000;
  if(sessionFresh||!memory.visits){
    memory.visits=(memory.visits||0)+1;
    try{sessionStorage.setItem(SESSION_KEY,today)}catch(e){}
  }
  memory.lastSeen=now.toISOString();
  saveMemory();

  // The estate follows the visitor's local clock but never asks for or reveals location.
  state.season=season;
  state.storm=weatherKey==='storm';
  document.body.dataset.daypart=daypart;
  document.body.dataset.worldWeather=weatherKey;
  document.body.dataset.season=season;
  document.body.dataset.storm=String(state.storm);
  applyWeather();

  const boot=q('#boot');
  const bootTime=q('#bootTime'),bootDate=q('#bootDate'),bootSeason=q('#bootSeason'),bootWeather=q('#bootWeather');
  if(bootTime)bootTime.textContent=clock(now);
  if(bootDate)bootDate.textContent=dayLabel(now);
  if(bootSeason)bootSeason.textContent=season.toUpperCase()+' / '+phaseOfMonth(now)+' '+now.toLocaleDateString(undefined,{month:'long'}).toUpperCase();
  if(bootWeather)bootWeather.textContent=world.weatherLabel;
  const bootLead=q('#bootLead');
  if(bootLead){
    const lines={
      dawn:'The grounds are waking up.',
      day:'The estate is open.',
      dusk:'The house lights are coming on.',
      night:'Most of the house is asleep.'
    };
    let line=lines[daypart];
    if(weatherKey==='storm')line='Power may be unreliable.';
    else if(['rain','showers'].includes(weatherKey)&&daypart==='night')line='Rain on the east windows.';
    else if(weatherKey==='fog')line='Visibility is poor beyond the gates.';
    if(memory.visits>1&&daypart==='night'&&unit(today+'return')>.42)line='The house remembers you.';
    bootLead.textContent=line;
  }
  const returnLine=q('#bootReturn');
  if(returnLine){
    const ago=elapsedLabel(priorLastSeen);
    returnLine.textContent=memory.visits>1&&ago?'RETURN VISIT '+memory.visits+' · LAST ENTRY '+ago:'FIRST ENTRY';
  }

  const worldStatus=q('#worldStatus');
  function currentWeatherLabel(){
    return state.storm?'STORM FRONT':world.weatherLabel;
  }
  function updateStatus(){
    document.body.dataset.season=state.season;
    if(bootTime)bootTime.textContent=clock(new Date());
    if(worldStatus){
      worldStatus.innerHTML='<span>'+clock(new Date())+'</span><i></i><span>LOCATION — UNDISCLOSED</span><i></i><span>'+String(state.season).toUpperCase()+'</span><i></i><span>'+currentWeatherLabel()+'</span>';
    }
    const wr=q('#worldWeatherReadout');
    if(wr)wr.innerHTML='<strong>'+currentWeatherLabel()+'</strong><span>'+clock(new Date())+' · '+String(state.season).toUpperCase()+' · LOCATION UNDISCLOSED</span>';
  }
  updateStatus();
  setInterval(updateStatus,30000);

  const weatherPanel=q('#weatherPanel');
  if(weatherPanel&&!q('#worldWeatherReadout')){
    const readout=document.createElement('div');
    readout.id='worldWeatherReadout';readout.className='world-weather-readout';
    const grid=weatherPanel.querySelector('.weather-grid');
    weatherPanel.insertBefore(readout,grid||null);
    updateStatus();
  }

  const baseApplyWeather=applyWeather;
  applyWeather=function(){
    baseApplyWeather();
    document.body.dataset.daypart=daypart;
    document.body.dataset.worldWeather=world.weather;
    updateStatus();
    renderLiving(state.scene);
  };

  const living=q('#livingLayer');
  const ambientTimers=[];
  function clearAmbientTimers(){while(ambientTimers.length)clearTimeout(ambientTimers.pop())}
  function ambientLater(fn,ms){const t=setTimeout(fn,ms);ambientTimers.push(t);return t}
  function el(tag,cls,attrs={}){
    const node=document.createElement(tag);node.className=cls;
    Object.entries(attrs).forEach(([k,v])=>k==='text'?node.textContent=v:node.setAttribute(k,v));
    return node;
  }
  function place(node,x,y){
    node.style.left=x+'%';node.style.top=y+'%';return node;
  }
  function addGlow(cls,x,y){
    const node=place(el('i','living-glow '+cls),x,y);living.appendChild(node);return node;
  }
  function addMotes(count=9){
    for(let i=0;i<count;i++){
      const n=el('i','living-mote');
      n.style.left=(8+((hash(state.scene+'mote-x'+i)%840)/10))+'%';
      n.style.top=(10+((hash(today+'mote-y'+i)%650)/10))+'%';
      n.style.animationDelay=-(hash('delay'+i)%70)/10+'s';
      n.style.animationDuration=(6+(hash('dur'+i)%60)/10)+'s';
      living.appendChild(n);
    }
  }
  function addLeaves(count=7){
    for(let i=0;i<count;i++){
      const n=el('i','living-leaf');
      n.style.top=(12+(hash(today+'leaf-y'+i)%700)/10)+'%';
      n.style.animationDelay=-(hash('leaf-delay'+i)%100)/10+'s';
      n.style.animationDuration=(7+(hash('leaf-dur'+i)%50)/10)+'s';
      living.appendChild(n);
    }
  }
  function addFire(x,y,kind='fire'){
    const f=place(el('div','living-fire '+kind),x,y);
    f.innerHTML='<i></i><i></i><i></i>';
    living.appendChild(f);return f;
  }
  function addArmor(){
    const a=place(el('div','armor-actor',{'aria-hidden':'true'}),30,39);
    a.innerHTML='<i class="armor-shoulder"></i><i class="armor-arm"><b class="armor-sword"></b></i>';
    if(memory.objectStates.armorRaised)a.classList.add('remembered');
    living.appendChild(a);
  }
  function addDrawer(){
    const d=place(el('div','physical-drawer'),43,77);
    if(memory.objectStates.drawerOpen)d.classList.add('open');
    living.appendChild(d);
  }
  function addRaven(sceneName){
    if(sessionStorage.getItem('wells.raven.gone'))return;
    const dailyScene=(hash(today+'|raven')%2===0)?'estate':'camp';
    if(sceneName!==dailyScene)return;
    const pos=sceneName==='estate'?[73,42]:[81,36];
    const r=place(el('button','estate-raven',{type:'button','aria-label':'A raven perched nearby'}),pos[0],pos[1]);
    r.innerHTML='<i class="raven-wing"></i><b></b>';
    r.onclick=()=>{
      memory.ravenSightings=(memory.ravenSightings||0)+1;saveMemory();
      try{sessionStorage.setItem('wells.raven.gone','1')}catch(e){}
      r.classList.add('depart');
      const msg=memory.ravenSightings===1?'THE RAVEN DOES NOT WAIT.':memory.ravenSightings===2?'IT HAS BEEN HERE BEFORE.':'A BLACK FEATHER IS LEFT BEHIND.';
      toast(msg);
      if(memory.ravenSightings>=3){
        ambientLater(()=>{
          if(!living.isConnected)return;
          const feather=place(el('button','raven-feather',{type:'button','aria-label':'Black feather'}),pos[0]+2,pos[1]+8);
          feather.onclick=()=>info('ESTATE / FOUND','A black feather','<p>It is too clean to have been here long.</p><p>The raven keeps returning to the estate. It never seems surprised to see you.</p>');
          living.appendChild(feather);
        },850);
      }
    };
    living.appendChild(r);
  }
  function scheduleRoomEvent(sceneName){
    if(state.reduce)return;
    if(sceneName==='manor'&&(daypart==='night'||daypart==='dusk')&&!sessionStorage.getItem('wells.event.manor')){
      ambientLater(()=>{
        try{sessionStorage.setItem('wells.event.manor','1')}catch(e){}
        const layer=q('#livingLayer');if(!layer||state.scene!=='manor')return;
        layer.classList.add('power-flicker');
        ambientLater(()=>layer.classList.remove('power-flicker'),1500);
      },9000+(hash(today+'manor-event')%5000));
    }
    if(sceneName==='estate'&&daypart==='night'&&!sessionStorage.getItem('wells.event.window')){
      ambientLater(()=>{
        try{sessionStorage.setItem('wells.event.window','1')}catch(e){}
        const w=q('.estate-window-glow');if(!w||state.scene!=='estate')return;
        w.classList.add('blink');
        ambientLater(()=>w.classList.remove('blink'),1900);
      },7000+(hash(today+'window-event')%5500));
    }
  }
  function renderLiving(sceneName){
    if(!living)return;
    clearAmbientTimers();
    living.innerHTML='';
    living.className='living-layer';
    living.dataset.scene=sceneName||'estate';

    const outside=['estate','camp'].includes(sceneName);
    if(outside&&state.season==='autumn'&&['wind','clear','overcast'].includes(world.weather))addLeaves(7);
    if(['manor','study','archive','map','wardrobe'].includes(sceneName))addMotes(sceneName==='study'?13:8);

    if(sceneName==='estate'){
      addGlow('estate-window-glow',53,58);
      addGlow('estate-door-glow',53,69);
      const smoke=place(el('i','chimney-smoke'),43,31);living.appendChild(smoke);
      addRaven(sceneName);
    }
    if(sceneName==='manor'){
      addFire(49,52,'manor-fire');
      addGlow('manor-window-light',74,31);
      addArmor();
    }
    if(sceneName==='study'){
      addGlow('study-lamp-glow'+(memory.objectStates.studyLampDim?' dim':''),72,42);
      addDrawer();
    }
    if(sceneName==='garage'){
      addGlow('garage-headlight ferrari-light',28,62);
      addGlow('garage-headlight aston-light',78,60);
    }
    if(sceneName==='camp'){
      addFire(47,66,'camp-fire');
      addRaven(sceneName);
      for(let i=0;i<6;i++){
        const s=place(el('i','fire-spark'),46+(i%3)*1.1,63+(i%2));
        s.style.animationDelay=-(i*.42)+'s';living.appendChild(s);
      }
    }
    if(sceneName==='nyc')addGlow('nyc-window-light',70,27);
    scheduleRoomEvent(sceneName);
  }

  function markScene(name){
    memory.sceneVisits[name]=(memory.sceneVisits[name]||0)+1;
    saveMemory();
  }
  function transitionMode(from,to){
    if(to==='manor'||from==='manor')return 'door';
    if(to==='garage')return 'garage';
    if(to==='camp')return 'woods';
    return 'fade';
  }
  function syncRememberedCopy(){
    const drawer=scenes.study?.hotspots?.find(h=>h.action==='study-drawer');
    const lamp=scenes.study?.hotspots?.find(h=>h.action==='study-lamp');
    const armor=scenes.manor?.hotspots?.find(h=>h.action==='armor-display');
    if(drawer)drawer.sub=memory.objectStates.drawerOpen?'Open now / you already found what was caught behind it':'It sticks halfway';
    if(lamp)lamp.sub=memory.objectStates.studyLampDim?'Still dim from your last visit':'Turn it down and something appears';
    if(armor&&memory.objectStates.armorRaised)armor.sub='It moved the last time you touched it';
  }
  syncRememberedCopy();

  const baseSceneTo=sceneTo;
  sceneTo=function(name,instant=false){
    const from=state.scene;
    syncRememberedCopy();
    if(instant){
      baseSceneTo(name,true);
      markScene(name);renderLiving(name);
      return;
    }
    const tr=q('#transition');
    const mode=transitionMode(from,name);
    if(tr){
      tr.dataset.mode=mode;
      tr.dataset.label=(scenes[name]?.eye||name).replace('WELLS / ','');
      tr.classList.add('living-travel');
    }
    if(!state.reduce){
      const scene=q('#scene');
      scene?.animate(
        mode==='woods'
          ?[{transform:'scale(1)'},{transform:'scale(1.018) translateX(-.5%)'}]
          :[{transform:'scale(1)'},{transform:'scale(1.022)'}],
        {duration:470,easing:'cubic-bezier(.2,.7,.2,1)'}
      );
    }
    baseSceneTo(name,false);
    ambientLater(()=>{markScene(name);renderLiving(name)},470);
    ambientLater(()=>tr?.classList.remove('living-travel'),760);
  };

  function rememberAction(name){
    memory.actions[name]=(memory.actions[name]||0)+1;saveMemory();
  }
  function flashGarage(which){
    const light=q(which==='aston'?'.aston-light':'.ferrari-light');
    if(light){light.classList.add('ignite');ambientLater(()=>light.classList.remove('ignite'),900)}
  }
  const baseDoAction=doAction;
  doAction=function(a){
    if(!a)return;
    rememberAction(a);

    if(a==='armor-display'){
      const actor=q('.armor-actor');
      if(actor){
        actor.classList.remove('raise');
        void actor.offsetWidth;
        actor.classList.add('raise');
        memory.objectStates.armorRaised=true;saveMemory();syncRememberedCopy();
      }
      ambientLater(()=>baseDoAction(a),650);
      return;
    }
    if(a==='fireplace'){
      const fire=q('.manor-fire');
      if(fire){fire.classList.remove('flare');void fire.offsetWidth;fire.classList.add('flare')}
      baseDoAction(a);return;
    }
    if(a==='study-lamp'){
      memory.objectStates.studyLampDim=!memory.objectStates.studyLampDim;
      saveMemory();syncRememberedCopy();renderLiving('study');
      if(memory.objectStates.studyLampDim){
        q('#sceneBg')?.animate([{filter:'brightness(1)'},{filter:'brightness(.72)'}],{duration:620,fill:'forwards'});
        ambientLater(()=>info('STUDY / LAMP','Writing in the margin','<p>As the lamp drops low, pencil pressure marks emerge on the page.</p><p><strong>One boss fight. One adventure. One skill unlock.</strong></p><p>The lamp will still be dim when you come back.</p>'),360);
      }else{
        q('#sceneBg')?.animate([{filter:'brightness(.75)'},{filter:'brightness(1)'}],{duration:520});
        toast('LAMP — FULL');
      }
      return;
    }
    if(a==='study-drawer'){
      baseDoAction(a);
      setTimeout(()=>{
        const btn=q('#pullDrawer');
        if(btn)btn.addEventListener('click',()=>{
          memory.objectStates.drawerOpen=true;saveMemory();syncRememberedCopy();
          const drawer=q('.physical-drawer');if(drawer)drawer.classList.add('open');
        },{once:true});
      },0);
      return;
    }
    if(a==='portrait'){
      living?.classList.add('painting-shift');
      ambientLater(()=>living?.classList.remove('painting-shift'),1000);
      baseDoAction(a);return;
    }
    if(a==='campfire'){
      const fire=q('.camp-fire');if(fire){fire.classList.add('flare');ambientLater(()=>fire.classList.remove('flare'),850)}
      baseDoAction(a);return;
    }
    if(a==='drive-race'||a==='drive-aston'){
      flashGarage(a==='drive-aston'?'aston':'race');
      const car=a==='drive-aston'?'ASTON MARTIN':'FERRARI';
      toast(car+' — IGNITION');
      ambientLater(()=>baseDoAction(a),520);
      return;
    }
    return baseDoAction(a);
  };

  const resetBtn=q('#resetBtn');
  if(resetBtn)resetBtn.onclick=()=>{
    ['wells.collection','wells.ideas','wells.outfit','wells.season','wells.storm','wells.reduceMotion',MEM_KEY,'wells.driveBest']
      .forEach(k=>localStorage.removeItem(k));
    try{sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem('wells.raven.gone');sessionStorage.removeItem('wells.event.manor');sessionStorage.removeItem('wells.event.window')}catch(e){}
    location.reload();
  };

  // Existing hotspot handlers resolve sceneTo/doAction at click time, so the living wrappers above
  // apply without rebuilding the current scene. Render the first atmospheric frame now.
  renderLiving(state.scene);
  updateStatus();

  // Make the boot feel like a briefing rather than a generic splash.
  if(boot){
    boot.dataset.weather=world.weather;
    boot.dataset.daypart=daypart;
    boot.addEventListener('click',e=>{
      if(e.target.closest('#enterBtn'))document.body.classList.add('estate-entered');
    });
  }
})();
