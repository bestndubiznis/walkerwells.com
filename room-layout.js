/* Keep scenery, props, effects and hit targets on one authored canvas. */
(() => {
  const scene=document.querySelector('#scene');
  const viewport=document.createElement('div');viewport.id='roomViewport';
  scene.before(viewport);viewport.append(scene);
  const controls=document.createElement('div');controls.className='room-view-controls';
  controls.innerHTML='<button id="roomZoom" aria-pressed="false">ENLARGE ROOM</button><span id="roomViewHint">Full room · use Explore below</span>';
  viewport.after(controls);
  const button=controls.querySelector('button'),hint=controls.querySelector('span');
  let enlarged=innerWidth>880;
  function layout(){
    const mobile=matchMedia('(max-width:880px)').matches;
    const width=viewport.clientWidth,height=viewport.clientHeight,ratio=16/9;
    const scale=!enlarged?Math.min(width/ratio,height):Math.max(width/ratio,height);
    const roomWidth=scale*ratio,roomHeight=scale;
    Object.assign(scene.style,{width:roomWidth+'px',height:roomHeight+'px',left:(mobile&&enlarged?0:(width-roomWidth)/2)+'px',top:(height-roomHeight)/2+'px',right:'auto',bottom:'auto'});
    viewport.classList.toggle('pannable',mobile&&enlarged);
    button.setAttribute('aria-pressed',String(enlarged));button.textContent=enlarged?'SHOW WHOLE ROOM':'ENLARGE ROOM';
    hint.textContent=enlarged?'Swipe the room sideways · Explore below':'Full room · use Explore below';
    viewport.scrollLeft=mobile&&enlarged?(roomWidth-width)/2:0;
  }
  button.onclick=()=>{enlarged=!enlarged;layout()};
  new ResizeObserver(layout).observe(viewport);
  addEventListener('resize',layout);
  addEventListener('estate:scene',()=>{enlarged=innerWidth>880;layout()});
  layout();
})();
