/* WELLS Dirt Bike — one-button stunt physics */
(() => {
  const q=s=>document.querySelector(s);
  const BEST_KEY='wells.motoBest';
  let raf=0,game=null,bound=false;

  const pattern=[
    [0,0],[420,0],[560,20],[700,115],[820,null],[930,45],[1080,0],
    [1260,0],[1380,45],[1490,0],[1660,0],[1800,95],[1880,145],
    [2020,null],[2160,55],[2320,0],[2520,0],[2650,35],[2760,80],[2880,0],
    [3040,0],[3170,120],[3290,null],[3430,65],[3590,0],[3800,0],
    [3920,30],[4040,0],[4240,0],[4370,80],[4470,125],[4580,null],
    [4700,50],[4860,0],[5100,0]
  ];
  const PERIOD=5100;

  function ground(x){
    const cycle=Math.floor(Math.max(0,x)/PERIOD);
    const lx=((x%PERIOD)+PERIOD)%PERIOD;
    for(let i=0;i<pattern.length-1;i++){
      const a=pattern[i],b=pattern[i+1];
      if(lx<a[0]||lx>b[0]) continue;
      if(a[1]===null||b[1]===null) return null;
      const t=(lx-a[0])/(b[0]-a[0]||1);
      const base=cycle%3===1?12:cycle%3===2?-8:0;
      return a[1]+(b[1]-a[1])*t+base;
    }
    return 0;
  }
  function slope(x){
    const a=ground(x-7),b=ground(x+7);
    if(a===null||b===null)return 0;
    return Math.atan2(b-a,14);
  }
  function norm(a){
    while(a>Math.PI)a-=Math.PI*2;
    while(a<-Math.PI)a+=Math.PI*2;
    return a;
  }
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}

  function overlay(){
    let el=q('#motoOverlay');
    if(el)return el;
    el=document.createElement('section');
    el.id='motoOverlay';
    el.className='moto-overlay';
    el.setAttribute('aria-hidden','true');
    el.innerHTML=
      '<div class="moto-hud moto-hud-left"><small>TRAIL / STUNT RUN</small><strong id="motoScore">000000</strong><span>SCORE</span></div>'+
      '<div class="moto-hud moto-hud-center"><strong id="motoCombo">READY</strong><span id="motoStatus">HOLD TO THROTTLE</span></div>'+
      '<div class="moto-hud moto-hud-right"><small>BEST</small><strong id="motoBest">000000</strong><span><b id="motoDistance">0</b> M</span></div>'+
      '<button id="motoClose" class="moto-close" type="button">EXIT RUN</button>'+
      '<canvas id="motoCanvas" class="moto-canvas" aria-label="Dirt bike stunt game"></canvas>'+
      '<div id="motoStart" class="moto-start"><small>GARAGE / DIRT BIKE</small><h2>Stunt Run.</h2><p>One control. Hold to throttle. When only the rear wheel is planted — or while airborne — holding rotates the bike backward. Land full flips cleanly for points.</p><button id="motoStartBtn" type="button">START RUN</button><span>SPACE / ↑ / MOUSE / TOUCH</span></div>'+
      '<div id="motoCrash" class="moto-crash" hidden><small>RUN OVER</small><h2 id="motoCrashTitle">That was ambitious.</h2><div><span>SCORE <b id="motoFinalScore">0</b></span><span>BEST <b id="motoFinalBest">0</b></span></div><button id="motoRetry" type="button">RUN IT AGAIN</button><button id="motoExitCrash" type="button">BACK TO GARAGE</button></div>'+
      '<div class="moto-control-hint"><i></i><span>HOLD ANYWHERE — THROTTLE / ROTATE</span></div>';
    document.body.appendChild(el);
    bind(el);
    return el;
  }

  function bind(el){
    if(bound)return;
    bound=true;
    const canvas=el.querySelector('#motoCanvas');
    const hold=v=>{if(game&&game.running)game.hold=v};
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture?.(e.pointerId);hold(true)});
    canvas.addEventListener('pointerup',e=>{e.preventDefault();hold(false)});
    canvas.addEventListener('pointercancel',()=>hold(false));
    canvas.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hold(false)});
    el.querySelector('#motoStartBtn').onclick=reset;
    el.querySelector('#motoRetry').onclick=reset;
    el.querySelector('#motoClose').onclick=close;
    el.querySelector('#motoExitCrash').onclick=close;
    addEventListener('resize',()=>{if(el.classList.contains('open'))resize()});
    addEventListener('keydown',e=>{
      if(!el.classList.contains('open'))return;
      if(e.key==='Escape'){e.preventDefault();close();return}
      if((e.code==='Space'||e.code==='ArrowUp')&&!e.repeat){
        e.preventDefault();
        if(game&&game.running)game.hold=true;
        else if(!q('#motoStart').hidden)reset();
      }
    });
    addEventListener('keyup',e=>{
      if(!el.classList.contains('open'))return;
      if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();if(game)game.hold=false}
    });
  }

  function open(){
    const el=overlay();
    if(typeof closePanels==='function')closePanels();
    cancelAnimationFrame(raf);
    game=null;
    el.classList.add('open');
    el.setAttribute('aria-hidden','false');
    document.body.classList.add('moto-playing');
    q('#motoStart').hidden=false;
    q('#motoCrash').hidden=true;
    q('#motoBest').textContent=String(Number(localStorage.getItem(BEST_KEY)||0)).padStart(6,'0');
    q('#motoScore').textContent='000000';
    q('#motoDistance').textContent='0';
    q('#motoCombo').textContent='READY';
    q('#motoStatus').textContent='HOLD TO THROTTLE';
    resize();
    idle();
    if(typeof collect==='function')collect('race-token');
  }

  function close(){
    cancelAnimationFrame(raf);
    raf=0;
    if(game)game.running=false;
    const el=q('#motoOverlay');
    if(el){el.classList.remove('open');el.setAttribute('aria-hidden','true')}
    document.body.classList.remove('moto-playing');
  }

  function resize(){
    const canvas=q('#motoCanvas');if(!canvas)return;
    const dpr=Math.min(2,devicePixelRatio||1),r=canvas.getBoundingClientRect();
    canvas.width=Math.max(1,Math.round(r.width*dpr));
    canvas.height=Math.max(1,Math.round(r.height*dpr));
    canvas._dpr=dpr;
  }

  function wheel(g,lx){
    const ly=-15,c=Math.cos(g.angle),s=Math.sin(g.angle);
    return {x:g.x+lx*c-ly*s,y:g.y+lx*s+ly*c};
  }
  function contacts(g){
    const rear=wheel(g,-g.wheelbase/2),front=wheel(g,g.wheelbase/2);
    const rh=ground(rear.x),fh=ground(front.x);
    return {
      rear,front,rh,fh,
      rearOn:rh!==null&&rear.y-g.wheelR<=rh+3,
      frontOn:fh!==null&&front.y-g.wheelR<=fh+3
    };
  }

  function reset(){
    cancelAnimationFrame(raf);
    q('#motoStart').hidden=true;
    q('#motoCrash').hidden=true;
    const g={
      running:true,hold:false,last:performance.now(),x:115,y:0,vx:92,vy:0,
      angle:0,omega:0,wheelbase:58,wheelR:12,
      airborne:false,airSpin:0,lastAngle:0,stuntScore:0,combo:0,
      best:Number(localStorage.getItem(BEST_KEY)||0),distance:0,score:0,
      dust:[],landFlash:0
    };
    g.y=(ground(g.x)||0)+g.wheelR+15;
    game=g;
    q('#motoCombo').textContent='GO';
    q('#motoStatus').textContent='HOLD TO THROTTLE';
    raf=requestAnimationFrame(tick);
  }

  function tick(now){
    const g=game;if(!g||!g.running)return;
    const dt=Math.min(.022,(now-g.last)/1000||.016);g.last=now;
    step(g,dt*.5);
    if(g.running)step(g,dt*.5);
    render(g);
    if(g.running)raf=requestAnimationFrame(tick);
  }

  function step(g,dt){
    let pre=contacts(g),wasGround=pre.rearOn||pre.frontOn;

    if(g.hold&&wasGround){
      g.vx+=(pre.rearOn?255:95)*dt;
      if(pre.rearOn&&!pre.frontOn)g.omega+=4.7*dt;
      if(pre.frontOn&&!pre.rearOn)g.omega-=1.4*dt;
    }else if(wasGround){
      g.vx-=70*dt;
    }
    g.vx=clamp(g.vx,58,330);
    g.vx*=Math.pow(wasGround?.9988:.9996,dt*60);

    if(!wasGround){
      g.vy-=1120*dt;
      if(g.hold)g.omega+=2.5*dt;
      else g.omega-=.42*dt;
      g.omega*=Math.pow(.997,dt*60);
    }

    g.x+=g.vx*dt;
    g.y+=g.vy*dt;
    g.angle+=g.omega*dt;

    let c=contacts(g),pen=[];
    if(c.rearOn)pen.push(c.rh-(c.rear.y-g.wheelR));
    if(c.frontOn)pen.push(c.fh-(c.front.y-g.wheelR));
    if(pen.length){
      g.y+=Math.max(0,...pen)+.4;
      if(g.vy<0)g.vy=0;
      c=contacts(g);
    }

    const onGround=c.rearOn||c.frontOn;
    if(c.rearOn&&c.frontOn){
      const target=Math.atan2((c.fh||0)-(c.rh||0),Math.max(1,c.front.x-c.rear.x));
      const diff=norm(target-g.angle);
      g.angle+=diff*Math.min(1,dt*9.5);
      g.omega+=diff*20*dt;
      g.omega*=Math.pow(.78,dt*60);
    }else if(c.rearOn){
      g.omega+=(g.hold?5.5:-1.0)*dt;
    }else if(c.frontOn){
      g.omega-=2.3*dt;
    }

    if(!onGround&&!g.airborne){
      g.airborne=true;g.airSpin=0;g.lastAngle=g.angle;
      q('#motoStatus').textContent='AIRBORNE — HOLD TO ROTATE';
    }else if(!onGround&&g.airborne){
      g.airSpin+=norm(g.angle-g.lastAngle);g.lastAngle=g.angle;
    }else if(onGround&&g.airborne){
      const flips=Math.floor((Math.abs(g.airSpin)+.45)/(Math.PI*2));
      const error=Math.abs(norm(g.angle-slope(g.x)));
      if(error>1.18||Math.abs(g.omega)>5.8){crash('MISSED THE LANDING');return}
      if(flips>0){
        g.combo++;
        const pts=flips*500*g.combo;
        g.stuntScore+=pts;g.landFlash=1;
        q('#motoCombo').textContent=(flips>1?flips+'× BACKFLIP':'BACKFLIP')+'  +'+pts;
        q('#motoStatus').textContent='CLEAN LANDING · COMBO ×'+g.combo;
      }else{
        g.combo=Math.max(0,g.combo-1);
        q('#motoCombo').textContent=g.combo>1?'COMBO ×'+g.combo:'KEEP MOVING';
        q('#motoStatus').textContent='HOLD TO THROTTLE';
      }
      g.airborne=false;g.airSpin=0;
    }

    const bodyGround=ground(g.x);
    if(bodyGround!==null&&g.y-12<bodyGround){crash('FRAME DOWN');return}
    if(onGround&&Math.abs(norm(g.angle-slope(g.x)))>1.42){crash('RIDER DOWN');return}

    if(onGround&&Math.random()<.2){
      g.dust.push({x:g.x-28,y:(ground(g.x-28)||0)+3,life:1,size:2+Math.random()*5});
      if(g.dust.length>24)g.dust.shift();
    }
    g.dust.forEach(p=>p.life-=dt*1.8);
    g.dust=g.dust.filter(p=>p.life>0);
    g.landFlash=Math.max(0,g.landFlash-dt*2.4);

    g.distance=Math.max(0,(g.x-115)/10);
    g.score=Math.floor(g.distance*9)+g.stuntScore;
    q('#motoScore').textContent=String(g.score).padStart(6,'0');
    q('#motoDistance').textContent=Math.floor(g.distance);
  }

  function crash(reason){
    const g=game;if(!g||!g.running)return;
    g.running=false;g.hold=false;
    const canvas=q('#motoCanvas');
    canvas.classList.add('crashed');
    setTimeout(()=>canvas.classList.remove('crashed'),280);
    const score=g.score||0,best=Math.max(g.best||0,score);
    if(best>(g.best||0))localStorage.setItem(BEST_KEY,String(best));
    q('#motoBest').textContent=String(best).padStart(6,'0');
    q('#motoFinalScore').textContent=score;
    q('#motoFinalBest').textContent=best;
    const titles=['That was ambitious.','Physics remains undefeated.','Almost looked intentional.','The bike disagreed.'];
    q('#motoCrashTitle').textContent=reason==='MISSED THE LANDING'?'Almost stuck it.':titles[(score+Math.floor(g.x))%titles.length];
    q('#motoCombo').textContent=reason;
    q('#motoStatus').textContent='RUN OVER';
    q('#motoCrash').hidden=false;
    if(typeof toast==='function')toast('DIRT BIKE — '+reason);
  }

  function context(){
    const canvas=q('#motoCanvas');if(!canvas)return null;
    const ctx=canvas.getContext('2d'),dpr=canvas._dpr||1;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return {ctx,w:canvas.width/dpr,h:canvas.height/dpr};
  }
  function sy(worldY,h,anchor){return h*.75-(worldY-anchor)}

  function idle(){
    const o=context();if(!o)return;
    o.ctx.clearRect(0,0,o.w,o.h);
    background(o.ctx,o.w,o.h,0);
    terrain(o.ctx,o.w,o.h,0,115);
    bike(o.ctx,o.w,o.h,{x:115,y:(ground(115)||0)+27,angle:0,wheelbase:58,wheelR:12,hold:false},115);
  }

  function render(g){
    const o=context();if(!o)return;
    o.ctx.clearRect(0,0,o.w,o.h);
    const camX=Math.max(0,g.x-o.w*.29);
    background(o.ctx,o.w,o.h,g.x);
    terrain(o.ctx,o.w,o.h,camX,g.x);
    dust(o.ctx,o.w,o.h,g,camX);
    bike(o.ctx,o.w,o.h,g,camX);
    if(g.airborne)spinMeter(o.ctx,o.w,Math.floor(Math.abs(g.airSpin)/(Math.PI*2)),Math.abs(g.airSpin)%(Math.PI*2));
    if(g.landFlash>0){
      o.ctx.save();o.ctx.globalAlpha=g.landFlash*.16;o.ctx.fillStyle='#e5c46f';o.ctx.fillRect(0,0,o.w,o.h);o.ctx.restore();
    }
  }

  function background(ctx,w,h,x){
    const grad=ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#090d0c');grad.addColorStop(.55,'#101512');grad.addColorStop(1,'#070908');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.globalAlpha=.12;ctx.strokeStyle='#c9b277';ctx.lineWidth=1;
    const horizon=h*.69;
    for(let i=-1;i<9;i++){
      const px=((i*220-(x*.055)%220)+w)%(w+220)-110;
      ctx.beginPath();ctx.moveTo(px-120,horizon);ctx.lineTo(px,horizon-72-(i%3)*25);ctx.lineTo(px+120,horizon);ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle='rgba(225,205,155,.04)';
    for(let i=0;i<18;i++){
      const px=(i*173+x*.03)%(w+80)-40,py=45+(i*67)%Math.max(80,h*.5);
      ctx.fillRect(px,py,1.3,1.3);
    }
  }

  function terrain(ctx,w,h,camX,bikeX){
    const anchor=ground(bikeX)||0;
    ctx.save();ctx.strokeStyle='#e3d4aa';ctx.lineWidth=2.25;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.shadowColor='rgba(224,201,142,.2)';ctx.shadowBlur=7;ctx.beginPath();
    let drawing=false;
    for(let sx=-24;sx<=w+24;sx+=5){
      const gy=ground(camX+sx);
      if(gy===null){drawing=false;continue}
      const y=sy(gy,h,anchor);
      if(!drawing){ctx.moveTo(sx,y);drawing=true}else ctx.lineTo(sx,y);
    }
    ctx.stroke();ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(227,212,170,.17)';ctx.lineWidth=1;
    const first=Math.floor(camX/320)*320;
    for(let wx=first;wx<camX+w+320;wx+=320){
      const gy=ground(wx);if(gy===null)continue;
      const x=wx-camX,y=sy(gy,h,anchor);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+18);ctx.stroke();
    }
    ctx.restore();
  }

  function dust(ctx,w,h,g,camX){
    const anchor=ground(g.x)||0;
    ctx.save();
    g.dust.forEach(p=>{
      ctx.globalAlpha=Math.max(0,p.life)*.23;ctx.fillStyle='#d6c49b';
      ctx.beginPath();ctx.arc(p.x-camX,sy(p.y,h,anchor),p.size*(1.3-p.life*.3),0,Math.PI*2);ctx.fill();
    });
    ctx.restore();
  }

  function bike(ctx,w,h,g,camX){
    const anchor=ground(g.x)||0,x=g.x-camX,y=sy(g.y,h,anchor);
    const scale=clamp(w/1000,.9,1.15);
    ctx.save();ctx.translate(x,y);ctx.scale(scale,-scale);ctx.rotate(g.angle);
    const wb=g.wheelbase,r=g.wheelR;
    ctx.strokeStyle='#d9cfb3';ctx.lineWidth=2.2;
    [-wb/2,wb/2].forEach(wx=>{
      ctx.beginPath();ctx.arc(wx,-15,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='rgba(217,207,179,.28)';ctx.lineWidth=1;
      for(let a=0;a<Math.PI;a+=Math.PI/3){
        ctx.beginPath();ctx.moveTo(wx-Math.cos(a)*r,-15-Math.sin(a)*r);ctx.lineTo(wx+Math.cos(a)*r,-15+Math.sin(a)*r);ctx.stroke();
      }
      ctx.strokeStyle='#d9cfb3';ctx.lineWidth=2.2;
    });
    ctx.strokeStyle='#d47a43';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(-wb/2,-15);ctx.lineTo(-5,5);ctx.lineTo(15,-14);ctx.lineTo(-18,-12);ctx.lineTo(-5,5);ctx.lineTo(24,7);ctx.lineTo(wb/2,-15);ctx.stroke();
    ctx.strokeStyle='#d9cfb3';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(wb/2,-15);ctx.lineTo(24,9);ctx.lineTo(33,13);ctx.moveTo(24,9);ctx.lineTo(17,17);ctx.stroke();
    ctx.strokeStyle='#1e2420';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-17,8);ctx.lineTo(2,9);ctx.stroke();
    ctx.strokeStyle='#eee0bd';ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(-7,11);ctx.lineTo(2,27);ctx.lineTo(20,15);ctx.moveTo(2,26);ctx.lineTo(-13,18);ctx.moveTo(-7,11);ctx.lineTo(-20,-8);ctx.moveTo(-7,11);ctx.lineTo(11,-9);ctx.stroke();
    ctx.fillStyle='#eee0bd';ctx.beginPath();ctx.arc(3,34,6,0,Math.PI*2);ctx.fill();
    if(g.hold){ctx.fillStyle='rgba(224,158,73,.8)';ctx.beginPath();ctx.arc(-wb/2-r-4,-15,3,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  }

  function spinMeter(ctx,w,turns,partial){
    const x=w/2,y=94,r=24,pct=partial/(Math.PI*2);
    ctx.save();ctx.strokeStyle='rgba(230,216,180,.16)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#d5b45f';ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+pct*Math.PI*2);ctx.stroke();
    ctx.fillStyle='#eadfbe';ctx.textAlign='center';ctx.font='600 10px ui-monospace, monospace';
    ctx.fillText(turns?turns+' FLIP'+(turns>1?'S':''):'ROTATE',x,y+4);ctx.restore();
  }

  const baseDo=window.doAction;
  window.doAction=function(a){
    if(a==='moto'){open();return}
    return baseDo(a);
  };
})();