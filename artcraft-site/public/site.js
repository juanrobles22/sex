(()=>{'use strict';
const TAU=Math.PI*2,FOCUS=2,$=(s,r=document)=>r.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE=document.documentElement.dataset.page||'home';
const DEFAULTS={speed:1,boost:1,streaks:40,streakSpeed:1,size:100,radius:100,reverse:false};
const AC=window.AC={PAGE,state:null,live:false};
const isDark=()=>{const c=(getComputedStyle(document.body).backgroundColor.match(/\d+/g)||[0,0,0]);return(.299*c[0]+.587*c[1]+.114*c[2])<128};

/* ================= swirl (home page) ================= */
function startSwirl(){
let S=AC.state.swirl.settings,items=AC.state.swirl.items,objs=[];
/* ---- DOM ---- */
document.body.insertAdjacentHTML('beforeend','<canvas id="swStreaks"></canvas><div id="swStage"></div>');
const stage=$('#swStage'),cv=$('#swStreaks'),cx2=cv.getContext('2d');
function create(it,i){
  const el=document.createElement('div');el.className='sw-item';
  const card=document.createElement('div');card.className='sw-card';
  let m;if(it.type==='video'){m=document.createElement('video');m.muted=m.loop=m.autoplay=m.playsInline=true;}else{m=document.createElement('img');m.alt=''}
  m.draggable=false;m.src=it.src;card.append(m);el.append(card);stage.append(el);
  if(it.type==='video')m.play().catch(()=>{});
  const o={it,el,phase:0,tp:0,lane:.5,tl:.5,acc:Math.random()*TAU,rs:.9+Math.random()*.2,w:Math.random()*TAU,k:1,sc:.8,nx:0,ny:0,hov:false,focus:false,z:'',op:''};
  el.addEventListener('pointerenter',()=>o.hov=true);el.addEventListener('pointerleave',()=>o.hov=false);
  el.addEventListener('click',e=>{e.stopPropagation();setFocus(o.focus?null:o)});
  m.addEventListener('error',()=>el.style.display='none');
  return o}
function sync(){
  const old=new Map(objs.map(o=>[o.it.id,o]));
  objs=items.map(it=>{const o=old.get(it.id);if(o){old.delete(it.id);return o}const n=create(it);n.fresh=true;return n});
  old.forEach(o=>o.el.remove());
  objs.forEach((o,i)=>{o.tp=i/objs.length*TAU;o.tl=(i*.618)%1;if(o.fresh){o.phase=o.tp;o.lane=o.tl;o.fresh=false}});
  // keep angles continuous across the wrap so nothing jumps
  objs.forEach(o=>{while(o.phase-o.tp>Math.PI)o.phase-=TAU;while(o.tp-o.phase>Math.PI)o.phase+=TAU});
}
function setFocus(o){objs.forEach(x=>{const f=x===o;x.focus=f;x.el.classList.toggle('focus',f)});focusY=scrollY}
let focusY=0;
document.addEventListener('click',e=>{if(!e.target.closest('#swAdmin,#swGear'))setFocus(null)});
addEventListener('keydown',e=>{if(e.key==='Escape')setFocus(null)});

/* ---- streaks ---- */
let streaks=[];
const mkStreak=()=>({r:.98+Math.random()*.8,a:Math.random()*TAU,w:.25+Math.random()*.7,len:.7+Math.random()*1.6,h:Math.random()*360,lw:1.5+Math.random()*3.5,ph:Math.random()*TAU,e:Math.random()<.5?1:1.12});
let dark=true;const checkDark=()=>{const c=(getComputedStyle(document.body).backgroundColor.match(/\d+/g)||[0,0,0]);dark=(.299*c[0]+.587*c[1]+.114*c[2])<128};
function drawStreaks(dt,T,cx,cy,rx,ry,rot,Rf,boost,fade,dir){
  const dpr=Math.min(devicePixelRatio||1,2),W=innerWidth,H=innerHeight;
  if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr}
  cx2.setTransform(dpr,0,0,dpr,0,0);cx2.clearRect(0,0,W,H);
  while(streaks.length<S.streaks)streaks.push(mkStreak());streaks.length=Math.min(streaks.length,S.streaks);
  if(fade<=.01)return;
  const cR=Math.cos(rot),sR=Math.sin(rot),SEG=24,sp=S.streakSpeed*(1+boost*1.2)*dir*(reduce?.3:1);
  cx2.lineCap='butt';cx2.globalCompositeOperation=dark?'lighter':'source-over';
  for(const s of streaks){
    s.a+=s.w*sp*dt*.8;const hue=(s.h+T*22)%360,L=dark?62:50;
    for(let pass=0;pass<2;pass++){
      for(let k=0;k<SEG;k++){
        const t0=k/SEG,t1=(k+1)/SEG;
        const pt=t=>{const ang=s.a-s.len*t,rr=s.r*(1-.16*t)*(1+.1*Math.sin(ang*2+s.ph+T*.5))*Rf*S.radius/100;
          const ex=Math.cos(ang)*rx*rr,ey=Math.sin(ang)*ry*rr*s.e;return[cx+ex*cR-ey*sR,cy+ex*sR+ey*cR]};
        const[a0,b0]=pt(t0),[a1,b1]=pt(t1);
        const al=Math.pow(1-t0,1.6)*(dark?.8:.62)*fade;
        cx2.strokeStyle=`hsla(${(hue+t0*50)%360},95%,${L}%,${pass?al:al*.18})`;
        cx2.lineWidth=(pass?s.lw:s.lw*3.2)*(1-t0*.7);
        cx2.beginPath();cx2.moveTo(a0,b0);cx2.lineTo(a1,b1);cx2.stroke();
      }
    }
  }
  cx2.globalCompositeOperation='source-over'}

/* ---- main loop ---- */
let last=performance.now(),T=0,lastY=scrollY,vs=0,frames=0,lastW=0;
const hero=$('#hero [data-reveal-group]');
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min((now-last)/1000||.016,.05);last=now;T+=dt;frames++;
  if(frames%30===1)checkDark();
  const vw=innerWidth,vh=innerHeight,y=scrollY;
  vs+=(Math.abs(y-lastY)/Math.max(dt,.001)-vs)*Math.min(1,dt*5);lastY=y;
  const boost=reduce?0:Math.min(vs/450,14)*S.boost;           // scroll speed -> swirl speed
  const p=Math.min(y/(vh*.9),1.6),fade=Math.max(0,Math.min(1,1-(p-.55)/.85));
  const Rf=1+.75*p+Math.min(boost,10)*.015;                   // swirl flares outward as you scroll
  if(objs.some(o=>o.focus)&&Math.abs(y-focusY)>90)setFocus(null);
  const W=Math.round((vw<700?125:190)*S.size/100);if(W!==lastW){stage.style.setProperty('--sw',W+'px');lastW=W}
  let cx=vw/2,cy=vh/2,hw=0,hh=0;
  if(hero){const r=hero.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;hw=r.width/2;hh=r.height/2}
  const rx=Math.min(Math.max(vw*.38,hw+W*.65),vw*.58),ry=Math.max(vh*.32,hh+W*.38);
  const rot=.22*Math.sin(T*.18),cR=Math.cos(rot),sR=Math.sin(rot);
  const dir=S.reverse?-1:1,om=.28*S.speed*(1+boost)*dir*(reduce?.3:1);
  for(const o of objs){
    const e=Math.min(1,dt*2);o.phase+=(o.tp-o.phase)*e;o.lane+=(o.tl-o.lane)*e;
    const want=o.focus?0:(o.hov?.12:1);o.k+=(want-o.k)*Math.min(1,dt*6);
    o.acc+=om*dt*o.it.speed*o.k*o.rs;
    const th=o.phase+o.acc,f=(.8+.5*o.lane)*S.radius/100*Rf,wob=1+.1*Math.sin(2*th+o.w+T*.4);
    const ex=Math.cos(th)*rx*f*wob,ey=Math.sin(th)*ry*f*wob,dep=(Math.sin(th)+1)/2;
    const x=cx+ex*cR-ey*sR,yy=cy+ex*sR+ey*cR;
    o.sc+=((o.focus?1:.7+.4*dep)-o.sc)*Math.min(1,dt*8);
    let tx=0,ty=0;
    if(o.focus){const w=o.el.offsetWidth*o.sc*FOCUS/2,h=o.el.offsetHeight*o.sc*FOCUS/2;
      tx=w*2<vw?Math.min(Math.max(x,w+14),vw-w-14)-x:0;ty=h*2<vh-60?Math.min(Math.max(yy,h+60),vh-h-14)-yy:0}
    o.nx+=(tx-o.nx)*Math.min(1,dt*8);o.ny+=(ty-o.ny)*Math.min(1,dt*8);
    o.el.style.transform=`translate3d(${(x+o.nx).toFixed(1)}px,${(yy+o.ny).toFixed(1)}px,0) translate(-50%,-50%) scale(${o.sc.toFixed(3)})`;
    const op=o.focus?1:((.72+.28*dep)*fade).toFixed(3),z=o.focus?1000:10+Math.round(dep*30);
    if(op!==o.op){o.el.style.opacity=op;o.op=op}if(z!==o.z){o.el.style.zIndex=z;o.z=z}
    o.el.style.pointerEvents=(fade<.05&&!o.focus)?'none':'auto';
  }
  drawStreaks(dt,T,cx,cy,rx,ry,rot,Rf,boost,fade,dir);
}

AC.syncSwirl=()=>{S=AC.state.swirl.settings;items=AC.state.swirl.items;sync()};
checkDark();sync();requestAnimationFrame(frame);
}

/* ================= saved site edits (apply for everyone) ================= */
const SKIP='#swAdmin,#swGear,#acTb,#acBox,#acLogin,#acAudio,#swStage,#swStreaks,#tubeApp,[role=img],svg,script,style,noscript,video';
const UI='#swAdmin,#swGear,#acTb,#acBox,#acLogin,#acAudio,#swStage,#swStreaks';
let cT=[],cL=[],cI=[],markURL=null;
const sig=s=>s.length+':'+s.slice(-24);
const siteE=AC.siteE=()=>{const E=(AC.state.site[PAGE]=AC.state.site[PAGE]||{});E.t=E.t||{};E.l=E.l||{};E.i=E.i||{};E.d=E.d||[];return E};
const byP=AC.byP=p=>p.split('/').slice(1).reduce((e,i)=>e&&e.children[+i],document.body);
AC.nodes=()=>({cT,cL,cI});
function scan(){
  (function walk(el,p){[...el.children].forEach((c,i)=>{if(c.matches(UI))return;c._p=p+'/'+i;c._g=c.tagName+':'+c.textContent.trim().slice(0,30);walk(c,c._p)})})(document.body,'');
  cT=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT,{acceptNode:n=>n.matches(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let n;while((n=w.nextNode())){if([...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())&&!(cT.length&&cT[cT.length-1].contains(n)))cT.push(n)}
  cL=[...document.querySelectorAll('a[href]')].filter(a=>!a.closest(SKIP));
  cI=[...document.querySelectorAll('img')].filter(a=>!a.closest(SKIP));
  cT.forEach(e=>e._o=e.textContent.trim().slice(0,40));cL.forEach(a=>a._o=a.getAttribute('href'));
  cI.forEach(im=>{const s=im.getAttribute('src')||'';im._o=sig(s);im._s0=s;im._tl=im.classList.contains('themed-logo')})}
const setImg=AC.setImg=(im,u)=>{im.removeAttribute('srcset');im.src=u;im.classList.remove('themed-logo')};
const setFav=AC.setFav=u=>{let l=$('link[rel=icon]');if(!l){l=document.createElement('link');l.rel='icon';document.head.append(l)}l.href=u};
function setTitle(t){const wm=$('#hero [role=img]');if(!wm||!t)return;
  if(!wm._logo){wm._logo=wm.children[0].cloneNode(true);wm._txt=wm.children[1].cloneNode(false)}
  const m=siteE().mark||{},custom=!!(m.img&&markURL),glyph=!custom&&!m.off&&/^a/i.test(t);
  wm.textContent='';
  if(custom){const s=wm._logo.cloneNode(false);s.innerHTML='<img alt="" style="display:inline-block;height:.7em;width:auto;vertical-align:-.006em;margin-right:.08em">';s.firstChild.src=markURL;wm.append(s)}
  [...t].forEach((ch,i)=>{let s;if(i===0&&glyph)s=wm._logo.cloneNode(true);else{s=wm._txt.cloneNode(false);s.textContent=ch}wm.append(s)});
  wm.setAttribute('aria-label',t);wm.style.setProperty('font-size','min(calc(100cqi / '+((t.length+(custom?1.2:0))*.884).toFixed(2)+'), 140px)','important')}
AC.refreshTitle=()=>{const E=siteE(),wm=$('#hero [role=img]');markURL=(E.mark&&E.mark.img)||null;
  if(PAGE==='home'&&wm&&(E.title||E.mark||wm._logo))setTitle(E.title||'ARTCRAFT')};
function applySite(){
  const E=siteE();
  for(const[i,v]of Object.entries(E.t)){const e=cT[i];if(e&&e._o===v.o)e.innerHTML=v.h}
  for(const[i,v]of Object.entries(E.l)){const a=cL[i];if(a&&a._o===v.o){a.setAttribute('href',v.h);if(v.n){a.target='_blank';a.rel='noopener'}else a.removeAttribute('target')}}
  for(const[i,v]of Object.entries(E.i)){const im=cI[i];if(im&&im._o===v.o)setImg(im,v.h)}
  AC.refreshTitle();if(E.tab)document.title=E.tab;if(E.fav)setFav(E.fav);
  E.d.forEach(d=>{const el=byP(d.p);if(el&&el._g===d.g)el.setAttribute('data-ac-del','')})}

/* ================= background audio (home page): loops, fades as you scroll ================= */
function startAudio(){
  const btn=document.createElement('button');btn.id='acAudio';btn.type='button';btn.hidden=true;document.body.append(btn);
  const el=document.createElement('video');el.loop=true;el.playsInline=true;el.preload='auto';el.setAttribute('aria-hidden','true');
  el.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none';document.body.append(el);
  let ctx=null,gain=null,muted=localStorage.getItem('ac_mute')==='1';
  const A=()=>AC.state.audio,on=()=>!!A().src&&A().enabled!==false;
  const level=()=>muted?0:Math.max(0,1-scrollY/(innerHeight*1.15))*Math.min(1,Math.max(0,+A().volume||0));
  function setLevel(){const v=level();if(gain)gain.gain.setTargetAtTime(v,ctx.currentTime,.12);else el.volume=v}
  function ensureCtx(){const AX=window.AudioContext||window.webkitAudioContext;if(ctx||!AX)return;
    try{ctx=new AX();const s=ctx.createMediaElementSource(el);gain=ctx.createGain();gain.gain.value=level();s.connect(gain);gain.connect(ctx.destination)}catch(e){ctx=null;gain=null}}
  const label=()=>{btn.textContent=muted?'♪ Sound off':'♪ Sound on';btn.classList.toggle('off',muted)};
  async function play(){if(!on())return;ensureCtx();setLevel();try{await el.play()}catch(e){}if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{})}
  function load(){if(!on()){el.pause();el.removeAttribute('src');el.load();btn.hidden=true;return}
    btn.hidden=false;label();if(el.getAttribute('src')!==A().src){el.setAttribute('src',A().src);el.load()}play()}
  // browsers only allow sound after the visitor interacts: start on the first click / tap / key press
  const kick=()=>{if(!on())return;if(el.paused||(ctx&&ctx.state!=='running')){ensureCtx();ctx&&ctx.resume().catch(()=>{});el.play().catch(()=>{});setLevel()}};
  ['pointerdown','keydown','touchend','click'].forEach(t=>addEventListener(t,kick,true));
  btn.onclick=()=>{muted=!muted;localStorage.setItem('ac_mute',muted?'1':'0');label();setLevel();if(!muted)kick()};
  addEventListener('scroll',setLevel,{passive:true});
  AC.applyAudio=load;AC.audioInfo=()=>({src:el.getAttribute('src'),paused:el.paused,level:+level().toFixed(3),gain:gain?+gain.gain.value.toFixed(3):null,ctx:ctx&&ctx.state});
  load()}

/* ================= theme toggle + feature videos ================= */
function misc(){
  const th=localStorage.getItem('ac_theme');if(th)document.documentElement.dataset.theme=th;
  document.querySelectorAll('button[aria-label^="Switch to"]').forEach(b=>b.onclick=()=>{const now=isDark()?'light':'dark';document.documentElement.dataset.theme=now;localStorage.setItem('ac_theme',now)});
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.25});
  document.querySelectorAll('main video').forEach(v=>{if(!v.closest('#tubeApp'))io.observe(v)})}

/* ================= hidden admin login (Ctrl+Shift+A or add #admin to the URL) ================= */
let adminLoaded=false;
function loadAdmin(){const s=document.createElement('script');s.src='/admin.js?'+Date.now();s.onload=()=>adminLoaded=true;s.onerror=()=>login();document.body.append(s)}
function login(){
  if($('#acLogin'))return;
  document.body.insertAdjacentHTML('beforeend','<div id="acLogin"><form><h4>Admin</h4><input type="password" autocomplete="current-password" placeholder="Admin code" aria-label="Admin code"><div class="err"></div><div class="r"><button type="submit">Unlock</button><button type="button" data-c>Cancel</button></div></form></div>');
  const box=$('#acLogin'),f=$('form',box),inp=$('input',box),err=$('.err',box);inp.focus();
  $('[data-c]',box).onclick=()=>box.remove();box.onclick=e=>{if(e.target===box)box.remove()};
  f.onsubmit=async e=>{e.preventDefault();err.textContent='';
    try{const r=await fetch('/api/login',{method:'POST',headers:{'X-AC':'1','Content-Type':'application/json'},body:JSON.stringify({code:inp.value})});const j=await r.json().catch(()=>({}));
      if(!r.ok){err.textContent=j.error||'Wrong code';inp.select();return}
      box.remove();AC.justLoggedIn=true;loadAdmin()}catch(x){err.textContent='Could not reach the server'}}}
async function adminBoot(){
  if(!AC.live)return;
  addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='a'){e.preventDefault();adminLoaded&&AC.togglePanel?AC.togglePanel():login()}});
  try{const j=await(await fetch('/api/me',{cache:'no-store'})).json();if(j.admin)return loadAdmin()}catch(e){}
  if(location.hash==='#admin')login()}

/* ================= boot ================= */
function norm(s){s=s||{};s.swirl=s.swirl||{};s.swirl.settings={...DEFAULTS,...(s.swirl.settings||{})};
  s.swirl.items=(s.swirl.items||[]).map(i=>({speed:1,...i}));s.site=s.site||{};
  s.audio={src:null,name:'',volume:.6,enabled:true,...(s.audio||{})};s.tube={categories:[],videos:[],...(s.tube||{})};return s}
const FALLBACK={swirl:{settings:{},items:[{id:'d1',name:'1.svg',type:'image',src:'media/1.svg'},{id:'d2',name:'2.svg',type:'image',src:'media/2.svg'}]}};
(async()=>{
  let s;try{const r=await fetch('/api/state',{cache:'no-store'});if(!r.ok)throw 0;s=await r.json();AC.live=true}catch(e){s=FALLBACK}
  AC.state=norm(s);scan();applySite();misc();
  if(PAGE==='home'&&$('#hero')){startSwirl();startAudio()}
  window.dispatchEvent(new Event('ac-ready'));adminBoot()})();
})();
