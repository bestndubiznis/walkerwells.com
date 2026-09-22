import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={
 scene:'estate',
 found:new Set(JSON.parse(localStorage.getItem('wells.collection')||'[]')),
 statuses:JSON.parse(localStorage.getItem('wells.ideas')||'{}'),
 outfit:localStorage.getItem('wells.outfit')||'DINNER JACKET',
 season:localStorage.getItem('wells.season')||'autumn',
 storm:localStorage.getItem('wells.storm')==='true',
 sound:false,
 targetYaw:0,targetPitch:0,
 hovered:null
};
const items=[['spider-mask','SPIDER MASK','◒'],['watch','WATCH','◉'],['gold-bar','GOLD BAR','▰'],['playing-card','PLAYING CARD','♠'],['compass','COMPASS','✥'],['road-key','ROAD KEY','◆'],['ski-pass','SKI PASS','▣'],['shark-tooth','SHARK TOOTH','▽'],['star-map','STAR MAP','✦'],['iron-key','FORGE MARK','⚒'],['pirate-coin','PIRATE COIN','◉'],['ornament','ORNAMENT','●'],['race-token','RACE TOKEN','◫'],['pilot-pin','PILOT PIN','◆'],['map-pin','MAP PIN','•'],['vault-seal','VAULT SEAL','◇']];
const ideas=['70.3 Worlds / Kona pursuit','3-day expedition race','Mongolia moto','Pilot license','St. Moritz winter','BVI sailing passage','Via Ferrata','Blacksmith a blade','Adventure race','Backcountry ski tour','Track race license','Liveaboard wreck diving'];
const outfits=[['DINNER JACKET','♟'],['RACE SUIT','◫'],['SKI KIT','⛷'],['WETSUIT','◉'],['WESTERN','♞'],['SPIDER SUIT','◒']];
const relics=[
['BOSS FIGHT','IRONMAN 70.3 — SANTA CRUZ','5:29 total. Finished.','COMPLETED'],
['BOSS FIGHT','FULL IRON DISTANCE','A clean finish line somewhere in the future.','LOCKED'],
['BOSS FIGHT','EXPEDITION RACE','Navigation + MTB + paddling + teamwork.','LOCKED'],
['ADVENTURE','ALCATRAZ CROSSING','Cold water. Clean objective. Excellent story.','LOCKED'],
['ADVENTURE','MONGOLIA MOTO','Nine days. Dirt. Open country.','LOCKED'],
['ADVENTURE','HUT-TO-HUT WINTER','Touring competence before scenery.','LOCKED'],
['SKILL UNLOCK','SKI BACKFLIP','Unlocked. Goal: make it automatic.','UNLOCKED'],
['SKILL UNLOCK','PRIVATE PILOT','Serious skill. Different branch entirely.','LOCKED'],
['SKILL UNLOCK','NAVIGATION','Become harder to strand.','LOCKED']
];

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.outputColorSpace=THREE.SRGBColorSpace;
$('#world').appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x0a1010);
scene.fog=new THREE.FogExp2(0x0b1110,.018);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,1000);
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.55,.72,.9);
composer.addPass(bloom);

const clock=new THREE.Clock();
let worldRoot=new THREE.Group(), interactives=[], rain=null, snow=null, fireLights=[], cityLights=[];
scene.add(worldRoot);
const raycaster=new THREE.Raycaster(), mouse=new THREE.Vector2();
const camTargets={
 estate:{p:[0,8,25],look:[0,4,0],title:'The estate.',eye:'WELLS / 01',copy:'A place made out of future stories. Click the architecture, not the labels.'},
 manor:{p:[0,5.5,14],look:[0,4,0],title:'The manor.',eye:'WELLS / 02',copy:'Walnut. Stone. Fire. Doors that lead into entirely different genres.'},
 garage:{p:[0,4.8,16],look:[0,2.8,0],title:'The garage.',eye:'WELLS / 03',copy:'Machines with consequences. Click a bay.'},
 archive:{p:[0,5.2,15],look:[0,3.6,0],title:'The capability archive.',eye:'WELLS / 04',copy:'Proof, plans, and locked drawers. Boss fights. Adventures. Skill unlocks.'},
 map:{p:[0,6.2,16],look:[0,3.8,0],title:'The map room.',eye:'WELLS / 05',copy:'Some pins are memories. Some are future stories. The map declines to clarify.'},
 nyc:{p:[0,4.6,14],look:[0,3.4,0],title:'New York. December.',eye:'WELLS / 06',copy:'Upper East Side. After dark. Snow outside. Mission terminal inside.'},
 camp:{p:[0,5.6,15],look:[0,3.5,0],title:'The clearing.',eye:'WELLS / 07',copy:'No scoreboard. Fire, stars, and a few thoughts worth keeping.'}
};
const cameraGoal=new THREE.Vector3(), lookGoal=new THREE.Vector3(), lookNow=new THREE.Vector3();
function setCam(sceneName,instant=false){
 const c=camTargets[sceneName]; cameraGoal.set(...c.p); lookGoal.set(...c.look);
 if(instant){camera.position.copy(cameraGoal);lookNow.copy(lookGoal)}
 $('#heroEye').textContent=c.eye;$('#heroTitle').textContent=c.title;$('#heroCopy').textContent=c.copy;
 $$('.scene-nav button').forEach(b=>b.classList.toggle('active',b.dataset.scene===sceneName));
}
function clearWorld(){
 scene.remove(worldRoot);worldRoot.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});
 worldRoot=new THREE.Group();scene.add(worldRoot);interactives=[];rain=null;snow=null;fireLights=[];cityLights=[];
}
function mat(color,rough=.6,metal=.0,emissive=0x000000,ei=0){
 return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,emissive,emissiveIntensity:ei});
}
function box(w,h,d,m,x=0,y=0,z=0){
 const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;worldRoot.add(o);return o;
}
function plane(w,h,m,x=0,y=0,z=0,rx=-Math.PI/2){
 const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.x=rx;o.receiveShadow=true;worldRoot.add(o);return o;
}
function sphere(r,m,x=0,y=0,z=0){
 const o=new THREE.Mesh(new THREE.SphereGeometry(r,32,18),m);o.position.set(x,y,z);o.castShadow=true;worldRoot.add(o);return o;
}
function light(type,color,intensity,pos,dist=0){
 let l=type==='point'?new THREE.PointLight(color,intensity,dist):new THREE.DirectionalLight(color,intensity);l.position.set(...pos);l.castShadow=true;if(type!=='point'){l.shadow.mapSize.set(2048,2048);l.shadow.camera.left=-25;l.shadow.camera.right=25;l.shadow.camera.top=25;l.shadow.camera.bottom=-25}worldRoot.add(l);return l;
}
function clickable(o,action,label){o.userData.action=action;o.userData.label=label;o.traverse(c=>{c.userData.action=action;c.userData.label=label});interactives.push(o);return o}
function makeTextPanel(text,w=4,h=1.4){
 const c=document.createElement('canvas');c.width=1024;c.height=350;const x=c.getContext('2d');x.fillStyle='#0b0d0b';x.fillRect(0,0,c.width,c.height);x.strokeStyle='#a98f59';x.lineWidth=5;x.strokeRect(12,12,c.width-24,c.height-24);x.fillStyle='#d7c7a6';x.font='44px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));
}
function windowGlow(x,y,z,w=1.1,h=1.6){
 const m=box(w,h,.08,mat(0xd79b50,.4,0,0xd27d34,4),x,y,z);return m;
}
function tree(x,z,s=1){
 const trunk=box(.35*s,2.1*s,.35*s,mat(0x302117,1),x,1.05*s,z);
 const crown=new THREE.Mesh(new THREE.ConeGeometry(1.6*s,5.2*s,8),mat(0x101b14,.95));crown.position.set(x,4.2*s,z);crown.castShadow=true;worldRoot.add(crown);
}
function particles(type='rain',count=2200){
 const g=new THREE.BufferGeometry(),p=new Float32Array(count*3),v=new Float32Array(count);
 for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*70;p[i*3+1]=Math.random()*30;p[i*3+2]=(Math.random()-.5)*55;v[i]=.4+Math.random()*.8}
 g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('speed',new THREE.BufferAttribute(v,1));
 const m=new THREE.PointsMaterial({color:type==='snow'?0xe8eeeb:0xaebfc1,size:type==='snow'?.08:.035,transparent:true,opacity:type==='snow'?.78:.45,depthWrite:false});
 const pts=new THREE.Points(g,m);worldRoot.add(pts);if(type==='snow')snow=pts;else rain=pts;
}
function estate(){
 clearWorld();scene.background=new THREE.Color(state.storm?0x070b0d:0x101a1c);scene.fog.color.set(state.storm?0x080b0d:0x0d1616);scene.fog.density=.018;
 plane(90,70,mat(state.season==='winter'?0xc3c9c5:0x16231a,1),0,-.1,0);
 plane(70,22,new THREE.MeshPhysicalMaterial({color:0x122424,roughness:.18,metalness:.08,transparent:true,opacity:.9}),0,.05,18);
 // manor body
 box(20,6,4.8,mat(0x4b4942,.95),0,3,-2);
 box(7,5.1,5.5,mat(0x403e39,.95),-12,2.55,-1.8);box(7,5.1,5.5,mat(0x403e39,.95),12,2.55,-1.8);
 const roofMat=mat(0x171918,.92);
 let roof=new THREE.Mesh(new THREE.ConeGeometry(11.2,4,4),roofMat);roof.scale.z=.31;roof.rotation.y=Math.PI/4;roof.position.set(0,7.8,-2);worldRoot.add(roof);
 [-12,12].forEach(x=>{let r=new THREE.Mesh(new THREE.ConeGeometry(4.8,3,4),roofMat);r.scale.z=.55;r.rotation.y=Math.PI/4;r.position.set(x,6.6,-1.8);worldRoot.add(r)});
 // entrance
 box(4.8,1,.9,mat(0x514e47,.9),0,.5,1);box(3.7,4,.35,mat(0x261d16,.78),0,2.2,.48);
 for(let i=0;i<4;i++) box(.38,4,.38,mat(0xd1cbc0,.8),-2.1+i*1.4,2.4,.9);
 for(const x of [-8,-5,-2.8,2.8,5,8]){windowGlow(x,4.5,.44);windowGlow(x,2.2,.44,.95,1.35)}
 [-14,-11,11,14].forEach(x=>windowGlow(x,3.2,1.0,.9,1.5));
 // paths
 const path=plane(6,31,mat(0x6a6152,1),0,.02,12); path.rotation.z=.02;
 for(let i=0;i<38;i++)tree(-30+Math.random()*60,-10+Math.random()*35,.65+Math.random()*.6);
 // moon
 const moon=sphere(2.2,new THREE.MeshBasicMaterial({color:0xded6bf}),18,18,-22);clickable(moon,'weather','weather controls');
 const garage=box(9,3.5,6,mat(0x1b1e1c,.86),-19,1.75,4);garage.userData.baseColor=0x1b1e1c;clickable(garage,'garage','garage');
 const archive=box(8,4,6,mat(0x292a25,.92),19,2,3);clickable(archive,'archive','capability archive');
 const camp=new THREE.Group();for(let i=0;i<7;i++){const l=box(2.4,.22,.22,mat(0x3b2618,1),-22,0.35,-12);l.rotation.y=i*Math.PI/7}clickable(box(2.5,.2,2.5,mat(0x442716,1),-22,.25,-12),'camp','campfire');
 clickable(box(1.2,7,.2,new THREE.MeshBasicMaterial({transparent:true,opacity:0}),0,3.5,.7),'manor','manor entrance');
 light('directional',0x8da6af,1.8,[10,18,12]);light('point',0xf2a65b,55,[0,4,2],18);
 particles('rain',state.storm?3200:1900);
 clickable(makeTextPanel('MAP ROOM',3.6,1.15),'map','map room').position.set(15,1.2,7);
}
function manor(){
 clearWorld();scene.background=new THREE.Color(0x0a0908);scene.fog.color.set(0x0a0908);scene.fog.density=.025;
 plane(30,26,mat(0x2b2119,.72),0,0,0);
 box(30,10,.4,mat(0x2c241d,.9),0,5,-8);box(.4,10,18,mat(0x2d251e,.9),-15,5,0);box(.4,10,18,mat(0x2d251e,.9),15,5,0);
 // wood paneling
 for(let x=-13;x<=13;x+=2.2){box(1.9,2,.18,mat(0x4b321f,.7),x,1.2,-7.75)}
 // fireplace
 box(7,5,.8,mat(0x3b342d,1),0,2.5,-7.4);box(4.6,3.5,.7,mat(0x14110e,1),0,1.9,-6.95);
 const flame=sphere(1.0,new THREE.MeshBasicMaterial({color:0xff8a3d}),0,1.25,-6.45);flame.scale.set(1.5,1.8,.4);fireLights.push(flame);light('point',0xff8a4d,95,[0,2,-5.6],15);
 // stairs
 for(let i=0;i<8;i++)box(10-i*.7,.24,1.2,mat(0x514232,.75),0,.12+i*.25,-2-i*.9);
 // chandelier
 const ch=new THREE.Group();const stem=box(.12,4,.12,mat(0x9d824c,.3,.8),0,8,-1);for(let a=0;a<6;a++){const ang=a/6*Math.PI*2;const b=sphere(.14,new THREE.MeshBasicMaterial({color:0xffd592}),Math.cos(ang)*1.8,6.1,Math.sin(ang)*1.8-1);fireLights.push(b)}light('point',0xffcb87,55,[0,6,-1],16);
 // doors
 const doorData=[[-10,-6,'study','STUDY'],[10,-6,'wardrobe','DRESSING ROOM'],[-12,3,'archive','ARCHIVE'],[12,3,'map','MAP ROOM']];
 doorData.forEach(([x,z,a,l])=>{const d=box(3.2,5.6,.35,mat(0x3a2418,.72),x,2.8,z);clickable(d,a,l)});
 clickable(box(2.2,4,.5,mat(0x3d372e,.88),-4,2,-7.2),'armory','old armor');
 clickable(makeTextPanel('OLD LIFT',3.5,1.2),'nyc','old lift').position.set(8,2,-7.15);
 light('directional',0x718087,.8,[5,12,8]);light('point',0xa67842,20,[-10,4,-3],8);light('point',0xa67842,20,[10,4,-3],8);
}
function car(x,z,color,label,action){
 const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(4.8,.9,2),mat(color,.25,.65));body.position.y=.9;body.castShadow=true;g.add(body);
 const cab=new THREE.Mesh(new THREE.BoxGeometry(2.5,.8,1.7),new THREE.MeshPhysicalMaterial({color:0x1b1f20,roughness:.15,metalness:.3,transmission:.15,transparent:true,opacity:.9}));cab.position.set(.3,1.55,0);g.add(cab);
 for(const sx of [-1.6,1.6])for(const sz of [-.88,.88]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.34,20),mat(0x090909,.8,.2));w.rotation.x=Math.PI/2;w.position.set(sx,.45,sz);g.add(w)}
 g.position.set(x,0,z);worldRoot.add(g);clickable(g,action,label);return g;
}
function garage(){
 clearWorld();scene.background=new THREE.Color(0x070909);scene.fog.color.set(0x070909);scene.fog.density=.018;
 plane(34,26,new THREE.MeshPhysicalMaterial({color:0x111413,roughness:.24,metalness:.38}),0,0,0);
 box(34,9,.5,mat(0x171a18,.82),0,4.5,-8);box(.5,9,20,mat(0x151715,.85),-17,4.5,0);box(.5,9,20,mat(0x151715,.85),17,4.5,0);
 for(let x=-14;x<=14;x+=7)box(4.4,.12,1.1,new THREE.MeshBasicMaterial({color:0xe9e3cf}),x,7,-2);
 car(-9,-3,0x7d1717,'Ferrari / track','ride-race');car(0,-3,0x111313,'Aston / night','ride-aston');car(9,-3,0x1f3626,'Range Rover / estate','ride-rover');
 const moto=new THREE.Group();const frame=box(2.7,.35,.35,mat(0xc26424,.32,.45),-6,.9,4);const w1=sphere(.55,mat(0x090909,.85),-7.1,.55,4);w1.scale.z=.25;const w2=sphere(.55,mat(0x090909,.85),-4.9,.55,4);w2.scale.z=.25;clickable(frame,'moto','dirt bike');
 clickable(makeTextPanel('ROAD / CARBON',3.7,1.25),'bike','road bike').position.set(2,1.6,4);
 clickable(makeTextPanel('KART / SCHOOL',3.7,1.25),'kart','kart').position.set(9,1.6,4);
 light('directional',0x78868b,1.4,[5,14,10]);light('point',0xffffff,26,[-9,5,-2],9);light('point',0xffffff,26,[0,5,-2],9);light('point',0xffffff,26,[9,5,-2],9);
}
function archive(){
 clearWorld();scene.background=new THREE.Color(0x090b09);scene.fog.color.set(0x090b09);scene.fog.density=.024;
 plane(30,24,mat(0x151814,.72,.15),0,0,0);box(30,9,.4,mat(0x1a1c18,.84),0,4.5,-8);
 // vault
 const ring=new THREE.Mesh(new THREE.TorusGeometry(3.2,.45,24,64),mat(0x635f50,.34,.75));ring.position.set(-8,4,-7.5);worldRoot.add(ring);const disk=sphere(3,mat(0x242722,.45,.58),-8,4,-7.7);disk.scale.z=.12;
 for(let a=0;a<8;a++){const ang=a/8*Math.PI*2;box(.2,2.2,.2,mat(0x8f7a4c,.3,.8),-8+Math.cos(ang)*1.2,4+Math.sin(ang)*1.2,-7.1).rotation.z=-ang}
 for(let i=0;i<9;i++){const col=i%3,row=Math.floor(i/3);const x=-1+col*5.2,z=-4+row*4.2;const ped=box(4.3,1.1,3.2,mat(0x20251e,.55,.25),x,.55,z);const top=box(3.4,.22,2.4,mat(i===0||i===6?0x6e5e35:0x32362f,.35,.42),x,1.2,z);clickable(top,'relic-'+i,relics[i][1])}
 light('directional',0x6f7c74,.85,[8,12,6]);light('point',0xc7a45d,40,[-8,5,-3],10);
}
function mapRoom(){
 clearWorld();scene.background=new THREE.Color(0x0e0e0b);scene.fog.color.set(0x0e0e0b);scene.fog.density=.02;
 plane(32,25,mat(0x2b2118,.82),0,0,0);box(32,9,.4,mat(0x241e17,.9),0,4.5,-8);
 const table=box(16,.7,9,mat(0x513923,.58),0,1.8,0);box(1,1.8,1,mat(0x382719,.8),-6.8,.9,-3);box(1,1.8,1,mat(0x382719,.8),6.8,.9,-3);box(1,1.8,1,mat(0x382719,.8),-6.8,.9,3);box(1,1.8,1,mat(0x382719,.8),6.8,.9,3);
 const map=plane(13,7,new THREE.MeshStandardMaterial({color:0xb7a27a,roughness:.94}),0,2.17,0, -Math.PI/2);
 const coords=[[-4,-1,'nyc'],[-6,1,'california'],[-6.3,-1.8,'alaska'],[-6,2.6,'hawaii'],[1.5,-1.4,'stmoritz'],[4,1.7,'mongolia'],[5.5,2.7,'thailand'],[-1.5,2.1,'bvi']];
 coords.forEach(([x,z,a])=>{const pin=sphere(.16,new THREE.MeshBasicMaterial({color:0x8b201b}),x,2.42,z);clickable(pin,'place-'+a,a)});
 const globe=sphere(1.8,mat(0x263e3b,.55,.18),10,3,-3);clickable(globe,'chartroom','chart room');
 light('directional',0x7c8174,.7,[6,12,8]);light('point',0xe0bb75,45,[0,7,0],18);
}
function nyc(){
 clearWorld();scene.background=new THREE.Color(0x0d1320);scene.fog.color.set(0x0d1320);scene.fog.density=.012;
 plane(30,24,mat(0x251c15,.55),0,0,0);box(30,9,.4,mat(0x2b2119,.72),0,4.5,-8);
 // window
 box(15,7,.3,mat(0x111315,.3,.65),-5,4,-7.7);
 for(let i=0;i<34;i++){const w=.4+Math.random()*.8,h=2+Math.random()*7,x=-17+Math.random()*34,z=-17-Math.random()*18;const b=box(w,h,w,mat(0x10141a,.65,.12),x,h/2,z);for(let k=0;k<2;k++){if(Math.random()>.45)windowGlow(x,h*.45+k*1.2,z+w/2+.01,.14,.18)}}
 // room furniture
 box(7,.6,3.6,mat(0x3d2a1b,.5),6,.3,1);box(5,1.5,2.2,mat(0x18201b,.75),7,.75,-3);
 const term=makeTextPanel('MISSION TERMINAL',4.8,1.7);term.position.set(6,2.3,-6.9);clickable(term,'mission','mission terminal');
 // tree
 const trunk=box(.35,2,.35,mat(0x382516,1),-8,1,1);for(let i=0;i<3;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(2.2-i*.45,3.2,18),mat(0x17321d,.85));t.position.set(-8,2+i*1.35,1);worldRoot.add(t)}for(let i=0;i<28;i++){const l=sphere(.06,new THREE.MeshBasicMaterial({color:i%2?0xffd47a:0xb9312d}),-8+(Math.random()-.5)*3.1,1.5+Math.random()*4.3,1+(Math.random()-.5)*2);cityLights.push(l)}
 clickable(sphere(.24,mat(0xc9ad63,.25,.7),-7.6,4.6,1.6),'collect-ornament','ornament');
 particles('snow',1200);
 light('point',0xffbd75,55,[5,5,-1],15);light('directional',0x7a8aa1,.8,[-6,10,8]);
}
function camp(){
 clearWorld();scene.background=new THREE.Color(0x040708);scene.fog.color.set(0x040708);scene.fog.density=.03;
 plane(36,28,mat(0x0f1b13,1),0,0,0);for(let i=0;i<30;i++)tree(-17+Math.random()*34,-11+Math.random()*22,.7+Math.random()*.65);
 for(let i=0;i<7;i++){const a=i*Math.PI/7;const log=box(2.5,.3,.3,mat(0x3d281a,1),Math.cos(a)*.4,.25,Math.sin(a)*.4);log.rotation.y=a}
 const f=sphere(.8,new THREE.MeshBasicMaterial({color:0xff8436}),0,.9,0);f.scale.set(1,1.9,1);fireLights.push(f);light('point',0xff8b42,115,[0,2,0],16);
 for(let i=0;i<22;i++){const star=sphere(i<5?.09:.04,new THREE.MeshBasicMaterial({color:0xe3e9e4}),-12+Math.random()*24,8+Math.random()*7,-10-Math.random()*9);if(i<5)clickable(star,'camp-star-'+i,'bright star')}
}
function build(name){
 state.scene=name;
 if(name==='estate')estate();if(name==='manor')manor();if(name==='garage')garage();if(name==='archive')archive();if(name==='map')mapRoom();if(name==='nyc')nyc();if(name==='camp')camp();
 setCam(name);fadeIn();
}
function fadeIn(){const f=$('#fade');f.classList.remove('clear');setTimeout(()=>f.classList.add('clear'),60)}
function transition(name){const f=$('#fade');f.classList.remove('clear');setTimeout(()=>build(name),520)}
function action(a){
 if(!a)return;
 if(['estate','manor','garage','archive','map','nyc','camp'].includes(a)){transition(a);return}
 if(a==='weather'){openPanel('weather');return}
 if(a==='study'){openPanel('ideas');return}
 if(a==='wardrobe'){openPanel('wardrobe');return}
 if(a==='armory'){collect('iron-key');openInfo('HIDDEN ROOM','The armory.','Knights. Swords. Blacksmithing. Craftsmanship. A room for skills older than the house.');return}
 if(a==='chartroom'){collect('pirate-coin');openInfo('HIDDEN ROOM','The chart room.','Pirates, passages, boats, islands, and routes that look better on paper.');return}
 if(a.startsWith('ride-')){collect('road-key');openInfo('NIGHT DRIVE',a==='ride-race'?'Track after dark.':a==='ride-rover'?'Estate road in rain.':'Grand tourer after rain.','The full driving sequence is becoming its own scene. For now: engine on, road wet, destination intentionally vague.');return}
 if(a==='moto'){collect('race-token');openInfo('DIRT / DESERT','Mongolia starts here.','Trail riding → camping → backcountry → desert → Mongolia.');return}
 if(a==='bike'){openInfo('GARAGE / CARBON','The engine is the problem.','Road. Mountain. Long climbs. Bad ideas measured in watts.');return}
 if(a==='kart'){collect('race-token');openInfo('GARAGE / KART','Race school.','Karting → coaching → track craft → race license → wheel-to-wheel.');return}
 if(a.startsWith('relic-')){const r=relics[+a.split('-')[1]];if(r[1].includes('SANTA CRUZ'))collect('vault-seal');openInfo(r[0],r[1],r[2]+' '+r[3]+'.');return}
 if(a.startsWith('place-')){const p=a.slice(6);if(p==='nyc'){collect('map-pin');transition('nyc');return}collect('map-pin');openInfo('MAP PIN',p.toUpperCase(),{california:'Cliffs, bikes, long roads, dry hills, cold Pacific water.',alaska:'The map gets less detailed the farther north it goes.',hawaii:'Warm water, mountains, surf, diving, long days.',stmoritz:'Winter machinery, clean snow, and very good coats.',bvi:'Sailboat, moving water, and islands close enough for lunch.',mongolia:'Dirt bikes. Open country. A trail too long for a caption.',thailand:'Warm rain, diving, islands, scooters, impossible water color.'}[p]||'Pinned.');return}
 if(a==='mission'){openPanel('mission');return}
 if(a==='collect-ornament'){collect('ornament');return}
 if(a.startsWith('camp-star-')){const q=['Family before mythology.','Capability > hobby.','Stories > stats.','A good plan can still contain chaos.','Learn enough things to become difficult to categorize.'][+a.split('-')[2]];openInfo('CAMPFIRE',q,'No scoreboard here.');if(a.endsWith('4'))collect('star-map')}
}
function collect(id){if(state.found.has(id))return;state.found.add(id);localStorage.setItem('wells.collection',JSON.stringify([...state.found]));renderCollection();toast('FOUND — '+(items.find(x=>x[0]===id)?.[1]||id.toUpperCase()))}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('show'),1800)}
function closePanels(){$$('.panel').forEach(p=>p.classList.remove('open'))}
function openPanel(id){closePanels();$('#'+id+'Panel').classList.add('open')}
function openInfo(eye,title,body){$('#infoEye').textContent=eye;$('#infoTitle').textContent=title;$('#infoBody').innerHTML='<p>'+body+'</p>';openPanel('info')}
function renderCollection(){$('#collectionCount').textContent=state.found.size;$('#collectionGrid').innerHTML=items.map(i=>state.found.has(i[0])?'<div class="slot found"><div><b>'+i[2]+'</b>'+i[1]+'</div></div>':'<div class="slot">—</div>').join('')}
function renderIdeas(){const ss=['IDEA','APPROVED','ACTIVE','DONE'];$('#badGrid').innerHTML=ideas.map(n=>'<button class="bad" data-idea="'+n.replace(/"/g,'&quot;')+'"><strong>'+n+'</strong><span class="stamp">'+(state.statuses[n]||'IDEA')+'</span></button>').join('');$$('[data-idea]').forEach(b=>b.onclick=()=>{const n=b.dataset.idea,c=state.statuses[n]||'IDEA',next=ss[(ss.indexOf(c)+1)%ss.length];state.statuses[n]=next;localStorage.setItem('wells.ideas',JSON.stringify(state.statuses));renderIdeas()})}
function renderWardrobe(){$('#wardrobeGrid').innerHTML=outfits.map(o=>'<button class="outfit '+(state.outfit===o[0]?'on':'')+'" data-outfit="'+o[0]+'"><div class="sil">'+o[1]+'</div><strong>'+o[0]+'</strong></button>').join('');$$('[data-outfit]').forEach(b=>b.onclick=()=>{state.outfit=b.dataset.outfit;localStorage.setItem('wells.outfit',state.outfit);renderWardrobe();toast('SUITED — '+state.outfit);if(state.outfit==='SPIDER SUIT')collect('spider-mask')})}
function setSeason(v){state.season=v;localStorage.setItem('wells.season',v);build(state.scene);toast('SEASON — '+v.toUpperCase())}
function soundOn(){if(state.sound)return;try{const ac=window._ac||(window._ac=new AudioContext()),buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.075;const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();f.type='lowpass';f.frequency.value=760;g.gain.value=.13;src.buffer=buf;src.loop=true;src.connect(f);f.connect(g);g.connect(ac.destination);src.start();state.sound=true;state.audioNode=src;$('#soundBtn').textContent='SOUND — ON'}catch(e){}}
function soundOff(){try{state.audioNode?.stop()}catch(e){}state.sound=false;state.audioNode=null;$('#soundBtn').textContent='SOUND — OFF'}

renderer.domElement.addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;state.targetYaw=(e.clientX/innerWidth-.5)*.06;state.targetPitch=(e.clientY/innerHeight-.5)*.035});
renderer.domElement.addEventListener('click',()=>{raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObjects(interactives,true).find(h=>h.object.userData.action);if(hit)action(hit.object.userData.action)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
$('#enter').onclick=()=>{$('#loader').style.opacity='0';$('#loader').style.pointerEvents='none';setTimeout(()=>$('#loader').remove(),850);$('#fade').classList.add('clear')};
$('#brand').onclick=()=>transition('estate');$$('.scene-nav button').forEach(b=>b.onclick=()=>transition(b.dataset.scene));$$('[data-close]').forEach(b=>b.onclick=closePanels);
$('#collectionBtn').onclick=()=>openPanel('collection');$('#ideasBtn').onclick=()=>openPanel('ideas');$('#wardrobeBtn').onclick=()=>openPanel('wardrobe');$('#weatherBtn').onclick=()=>openPanel('weather');$('#soundBtn').onclick=()=>state.sound?soundOff():soundOn();
$$('[data-season]').forEach(b=>b.onclick=()=>setSeason(b.dataset.season));$('#stormBtn').onclick=()=>{state.storm=!state.storm;localStorage.setItem('wells.storm',String(state.storm));$('#stormBtn').textContent='STORM MODE — '+(state.storm?'ON':'OFF');build(state.scene)};
$('#missionPanel .dossier').innerHTML='LOCATION: NEW YORK<br>TIME: 20:40<br>ATTIRE: <span id="missionSuit"></span><br>VEHICLE: BLACK GRAND TOURER<br>WEATHER: SNOW<br><br>OBJECTIVE:<br>LEAVE THE APARTMENT LOOKING LIKE YOU KNOW WHERE YOU ARE GOING.<br><br>SECONDARY OBJECTIVE:<br>DO SOMETHING WORTH RETELLING.';
new MutationObserver(()=>{const m=$('#missionSuit');if(m)m.textContent=state.outfit}).observe($('#missionPanel'),{attributes:true});

function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 camera.position.lerp(cameraGoal,.055);lookNow.lerp(lookGoal,.07);
 const p=lookNow.clone();p.x+=state.targetYaw*8;p.y-=state.targetPitch*5;camera.lookAt(p);
 if(rain){const a=rain.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]-=.28*(state.storm?2.1:1);a[i]+=.03;if(a[i+1]<0)a[i+1]=28}rain.geometry.attributes.position.needsUpdate=true}
 if(snow){const a=snow.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]-=.025;a[i]+=.006*Math.sin(t+a[i+1]);if(a[i+1]<0)a[i+1]=28}snow.geometry.attributes.position.needsUpdate=true}
 fireLights.forEach((o,i)=>{o.scale.y=1.55+Math.sin(t*7+i)*.18;o.scale.x=.95+Math.sin(t*5+i)*.05});
 cityLights.forEach((o,i)=>o.material.color.setHex((Math.sin(t*2+i)>.4)?0xffd47a:0xb9312d));
 raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObjects(interactives,true).find(h=>h.object.userData.action);const label=hit?.object.userData.label||'';$('#hint').textContent=label.toUpperCase();$('#hint').classList.toggle('show',!!hit);renderer.domElement.style.cursor=hit?'pointer':'default';
 composer.render();
}
renderCollection();renderIdeas();renderWardrobe();$('#stormBtn').textContent='STORM MODE — '+(state.storm?'ON':'OFF');build('estate');setCam('estate',true);animate();
