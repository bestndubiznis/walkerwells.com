/* Shared dialog behavior and navigation controls for the estate. */
(() => {
  const selector='.panel,.estate-system-overlay,.drive-overlay,.moto-overlay';
  let active=null,returnTo=null;
  const masked=new Map();
  const q=s=>document.querySelector(s);
  const visible=el=>el?.isConnected&&!el.closest('[inert],[hidden]')&&el.getClientRects().length>0;
  const focusables=el=>[...el.querySelectorAll('button,a[href],input,textarea,select,[tabindex]')]
    .filter(node=>!node.disabled&&node.tabIndex>=0&&visible(node));
  function unmask(){for(const [el,wasInert] of masked)el.inert=wasInert;masked.clear()}
  function maskOutside(el){
    for(let node=el;node&&node!==document.body;node=node.parentElement){
      for(const sibling of node.parentElement.children){
        if(sibling===node||['SCRIPT','STYLE','LINK'].includes(sibling.tagName))continue;
        masked.set(sibling,sibling.inert);sibling.inert=true;
      }
    }
  }
  function prepare(el){
    if(el.dataset.dialogReady)return;
    el.dataset.dialogReady='true';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.tabIndex=-1;
    const title=el.querySelector('h1,h2,h3');
    if(title){title.id||=el.id+'Title';el.setAttribute('aria-labelledby',title.id)}
    else el.setAttribute('aria-label',el.id==='driveOverlay'?'Estate driving game':'Estate controls');
    el.querySelectorAll('.panel-close').forEach(b=>b.setAttribute('aria-label','Close'));
    el.inert=true;el.setAttribute('aria-hidden','true');
  }
  function activate(el){
    if(active===el)return;
    const opener=active?returnTo:document.activeElement;
    if(active){active.classList.remove('open');active.inert=true;active.setAttribute('aria-hidden','true')}
    unmask();prepare(el);active=el;returnTo=opener;
    el.inert=false;el.setAttribute('aria-hidden','false');maskOutside(el);
    const focus=()=> (focusables(el)[0]||el).focus({preventScroll:true});
    focus();
    requestAnimationFrame(()=>{if(active===el&&!el.contains(document.activeElement))focus()});
  }
  function deactivate(el){
    if(active===el){
      active=null;unmask();el.inert=true;
      const target=visible(returnTo)?returnTo:visible(q('#controlsBtn'))?q('#controlsBtn'):q('#sceneTitle');
      target?.focus({preventScroll:true});returnTo=null;
    }
    el.inert=true;el.setAttribute('aria-hidden','true');
  }
  window.WellsUI={
    open(el){if(!el)return;prepare(el);el.classList.add('open');activate(el)},
    close(el){if(!el)return;el.classList.remove('open');deactivate(el)}
  };
  addEventListener('keydown',e=>{
    if(!active)return;
    if(e.key==='Escape'&&active.id!=='boot'){
      e.preventDefault();e.stopImmediatePropagation();
      const exit=active.querySelector('[data-close],[data-journal-close],[data-system-close],#driveExit,#motoClose,[data-ui-close]');
      if(exit)exit.click();else WellsUI.close(active);
    }else if(e.key==='Tab'){
      const list=focusables(active),first=list[0],last=list.at(-1);
      if(!first){e.preventDefault();active.focus();return}
      if(e.shiftKey&&(document.activeElement===first||!list.includes(document.activeElement))){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&(document.activeElement===last||!list.includes(document.activeElement))){e.preventDefault();first.focus()}
    }
  },true);
  document.addEventListener('DOMContentLoaded',()=>{
    q('#world').inert=false;
    function panel(id,title){
      const el=document.createElement('section');el.id=id;el.className='panel navigation-panel';
      const close=document.createElement('button');close.className='panel-close';close.dataset.uiClose='';close.textContent='×';
      close.onclick=()=>WellsUI.close(el);
      const heading=document.createElement('h3');heading.textContent=title;
      el.append(close,heading);q('#world').append(el);return el;
    }
    const controls=panel('controlsPanel','Estate controls.');
    const rooms=panel('roomsPanel','Pick a direction.');
    const roomGrid=document.createElement('div');roomGrid.className='room-grid';rooms.append(roomGrid);
    q('.rail').querySelectorAll('[data-nav]').forEach(source=>{
      const button=source.cloneNode(true);button.onclick=()=>sceneTo(button.dataset.nav);roomGrid.append(button);
    });
    const settings=document.createElement('button');settings.className='glass-btn';settings.textContent='SETTINGS & CREDITS';
    settings.onclick=()=>openPanel('settings');controls.append(settings);
    q('#controlsBtn').onclick=()=>WellsUI.open(controls);
    q('#roomsBtn').onclick=()=>WellsUI.open(rooms);
    const actions=q('.top-actions'),header=q('.topbar'),mobile=matchMedia('(max-width:880px)');
    function responsive(){
      if(active===controls||active===rooms)WellsUI.close(active);
      if(mobile.matches)controls.insertBefore(actions,settings);else header.append(actions);
      syncHotspots();
    }
    function syncHotspots(){
      document.querySelectorAll('.hotspot,.scene-prop').forEach(el=>{
        el.tabIndex=mobile.matches?-1:0;
        el.setAttribute('aria-hidden',String(mobile.matches));
        el.onfocus=()=>{
          if(mobile.matches)return;
          const rect=el.getBoundingClientRect();
          showRoomCard({clientX:rect.x+rect.width/2,clientY:rect.y+rect.height/2},{label:el.getAttribute('aria-label'),sub:'Press Enter to explore'});
        };
        el.onblur=hideRoomCard;
      });
    }
    mobile.addEventListener('change',responsive);
    addEventListener('resize',syncHotspots);responsive();
    // Class changes from older game modules use the same dialog lifecycle.
    document.querySelectorAll(selector).forEach(prepare);
    new MutationObserver(records=>{
      const changed=new Set();
      for(const record of records){
        if(record.type==='attributes'&&record.target.matches(selector))changed.add(record.target);
        if(record.type==='childList')for(const node of record.addedNodes){
          if(node.nodeType!==1)continue;
          if(node.matches(selector))changed.add(node);
          node.querySelectorAll(selector).forEach(el=>changed.add(el));
        }
      }
      for(const el of changed){
        prepare(el);
        if(el.classList.contains('open'))activate(el);else deactivate(el);
      }
    }).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    activate(q('#boot'));

    let followingHistory=false;
    function route(){
      const name=location.hash.slice(1);
      return Object.hasOwn(scenes,name)?name:'estate';
    }
    addEventListener('estate:before-scene',({detail:{name,instant}})=>{
      if(!followingHistory&&!instant&&location.hash!=='#'+name)history.pushState(null,'','#'+name);
    });
    addEventListener('estate:scene',({detail:{name}})=>{
      const title=scenes[name].title;
      q('#currentRoom').textContent=title;
      q('#roomsBtn').setAttribute('aria-label','Choose a room. Current room: '+title);
      q('#roomAnnouncement').textContent=title;
      document.title='WELLS — '+title.replace(/\.$/,'');
      if(!q('#boot')&&(!visible(document.activeElement)||document.activeElement===document.body))q('#sceneTitle').focus({preventScroll:true});
      syncHotspots();
    });
    addEventListener('popstate',()=>{
      followingHistory=true;sceneTo(route());followingHistory=false;
    });
    // Hash links pasted into the address bar also route without a reload.
    addEventListener('hashchange',()=>{
      if(route()===state.scene)return;
      followingHistory=true;sceneTo(route());followingHistory=false;
    });
    const initial=route();
    history.replaceState(null,'','#'+initial);
    followingHistory=true;sceneTo(initial,true);followingHistory=false;
    q('#enterBtn').addEventListener('click',()=>{
      if(initial!=='estate')return;
      const door=[...q('#hotspotLayer').children].find(el=>el.getAttribute('aria-label')==='FRONT DOOR');
      door?.classList.add('first-discovery');
      setTimeout(()=>door?.classList.remove('first-discovery'),8000);
    });
  });
})();
