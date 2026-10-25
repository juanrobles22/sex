(()=>{'use strict';const CSS="/* ===== admin ===== */\n#swGear{position:fixed;left:14px;bottom:14px;z-index:90;width:40px;height:40px;border:1px solid var(--line-strong);background:var(--bg-raised);color:var(--ink);font-size:18px;cursor:pointer}\n#swGear:hover{background:var(--invert-bg);color:var(--invert-fg)}\n#swAdmin{position:fixed;left:14px;bottom:62px;z-index:91;width:min(340px,calc(100vw - 28px));max-height:min(78vh,640px);overflow:auto;\n  background:var(--bg-raised);color:var(--ink);border:1px solid var(--line-strong);box-shadow:0 20px 60px -10px rgba(0,0,0,.5);font-size:13px}\n#swAdmin[hidden]{display:none}\n#swAdmin header{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg-raised);border-bottom:1px solid var(--line);z-index:1}\n#swAdmin h4{font-family:var(--font-mono);font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin:0;font-weight:600}\n#swAdmin .sa-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}\n#swAdmin .sa-sec{font-family:var(--font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--faint);margin-top:4px}\n#swAdmin button,#swAdmin .sa-btn{font:600 11px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;padding:8px 10px;border:1px solid var(--line-strong);background:transparent;color:var(--ink);cursor:pointer;text-align:center}\n#swAdmin button:hover,#swAdmin .sa-btn:hover{background:var(--invert-bg);color:var(--invert-fg)}\n#swAdmin input[type=text]{flex:1;min-width:0;padding:8px;border:1px solid var(--line-strong);background:var(--bg);color:var(--ink);font:12px var(--font-mono)}\n#swAdmin input[type=range]{width:100%;accent-color:var(--accent)}\n#swAdmin .row{display:flex;gap:6px;align-items:center}\n#swAdmin ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}\n#swAdmin li{display:grid;grid-template-columns:48px 1fr 26px;gap:8px;align-items:center;padding:6px;border:1px solid var(--line)}\n#swAdmin li .th{width:48px;height:36px;object-fit:cover;background:var(--bg-sunken)}\n#swAdmin li .nm{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#swAdmin li .x{padding:2px 0;font-size:14px}\n#swAdmin .lab{display:flex;justify-content:space-between;font-size:11px;color:var(--muted)}\n#swAdmin .empty{color:var(--faint);font-size:12px;padding:8px 0}\n\n#swAdmin [hidden]{display:none!important}\n#swAdmin input[type=text]{width:100%;box-sizing:border-box}\n\n/* ===== site editor ===== */\n#swAdmin .tabs button.on{background:var(--invert-bg);color:var(--invert-fg)}\n#swAdmin .hint{font-size:11.5px;color:var(--muted);line-height:1.45;margin:0}\n.ac-edit #swStage .sw-item{pointer-events:none!important}\n.ac-edit #hero *{pointer-events:auto!important}\n.ac-edit [contenteditable]{cursor:text;outline:1px dashed transparent;outline-offset:3px}\n.ac-edit [contenteditable]:hover{outline-color:var(--accent)}\n.ac-edit [contenteditable]:focus{outline:2px solid var(--accent)}\n.ac-edit a[href],.ac-edit img{cursor:pointer}\n.ac-edit img:hover{outline:2px dashed var(--accent);outline-offset:2px}\n#acTb{position:fixed;z-index:95;width:min(440px,calc(100vw - 20px));background:var(--bg-raised);color:var(--ink);border:1px solid var(--line-strong);box-shadow:0 16px 50px -8px rgba(0,0,0,.5);padding:10px;display:flex;flex-direction:column;gap:8px;font-size:12px}\n#acTb[hidden],#acTb .r[hidden]{display:none}\n#acTb .r{display:flex;gap:6px;align-items:center}\n#acTb .r>span{font:600 10px var(--font-mono);letter-spacing:.15em;text-transform:uppercase;color:var(--faint);width:44px;flex:none}\n#acTb input[type=text]{flex:1;min-width:0;padding:7px;border:1px solid var(--line-strong);background:var(--bg);color:var(--ink);font:12px var(--font-mono)}\n#acTb button,#acTb .sa-btn{font:600 10px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;padding:7px 9px;border:1px solid var(--line-strong);background:transparent;color:var(--ink);cursor:pointer;white-space:nowrap}\n#acTb button:hover,#acTb .sa-btn:hover{background:var(--invert-bg);color:var(--invert-fg)}\n#acTb label{display:flex;gap:4px;align-items:center;white-space:nowrap;color:var(--muted)}\n\n#acBox{position:fixed;z-index:94;pointer-events:none;border:2px dashed var(--accent);background:rgba(45,129,255,.08)}\n#acBox[hidden]{display:none}\n#acTb .del{border-color:#d33;color:#d33}#acTb .del:hover{background:#d33;color:#fff}\n#acTb #tbTag{flex:1;min-width:0;font:11px var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#acTb button:disabled{opacity:.35;pointer-events:none}\n#swAdmin #saStat{font:10px var(--font-mono);color:var(--muted);margin-left:auto;margin-right:10px}\n#swAdmin header h4{white-space:nowrap}\n#swAdmin .tabs{gap:4px}#swAdmin .tabs button{flex:1;padding:8px 4px}\n#swAdmin .tabs button.on{background:var(--invert-bg);color:var(--invert-fg)}\n#swAdmin select{flex:1;min-width:0;padding:7px;border:1px solid var(--line-strong);background:var(--bg);color:var(--ink);font:12px var(--font-mono)}\n#swAdmin .chips{display:flex;flex-wrap:wrap;gap:6px}\n#swAdmin .chip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line-strong);padding:3px 4px 3px 8px;font:11px var(--font-mono)}\n#swAdmin .chip button{padding:0 5px;border:0;font-size:12px}\n#swAdmin li.vid{grid-template-columns:64px 1fr 26px;align-items:start}\n#swAdmin li.vid .th{width:64px;height:44px}\n#swAdmin li.vid input[type=text]{padding:5px 6px;font-size:11px}\n#swAdmin li.vid select{padding:4px;font-size:11px}\n#swAdmin button:disabled{opacity:.4}\n";
const AC=window.AC;if(!AC||AC.adminOn)return;AC.adminOn=true;
const $=(s,r=document)=>r.querySelector(s),PAGE=AC.PAGE,st=AC.state;
const uid=()=>'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const kind=u=>/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(u)?'video':'image';
const ftype=f=>f.type.startsWith('video')||kind(f.name)==='video'?'video':'image';
document.head.insertAdjacentHTML('beforeend','<style id="acAdminCss">'+CSS+'</style>');

/* ---------- server calls ---------- */
const api=(method,url,body)=>fetch(url,{method,headers:{'X-AC':'1','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)})
  .then(async r=>{const j=await r.json().catch(()=>({}));if(r.status===401){setStatus('Session expired — press Ctrl+Shift+A to log in',true);throw new Error('Not logged in')}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j});
const upload=(file,onp)=>new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open('POST','/api/upload?name='+encodeURIComponent(file.name));x.setRequestHeader('X-AC','1');
  x.upload.onprogress=e=>onp&&e.lengthComputable&&onp(e.loaded/e.total);
  x.onload=()=>{let j={};try{j=JSON.parse(x.responseText)}catch(e){}x.status<300?ok(j):no(new Error(j.error||('HTTP '+x.status)))};x.onerror=()=>no(new Error('Network error'));x.send(file)});
const delFile=src=>{if(typeof src==='string'&&src.startsWith('/uploads/'))api('POST','/api/delete-file',{src}).catch(()=>{})};
const pend=new Set();let tm;
function setStatus(t,err){const b=$('#saStat');if(b){b.textContent=t;b.style.color=err?'#d33':''}}
function save(sec){pend.add(sec);setStatus('Saving…');clearTimeout(tm);tm=setTimeout(flush,300)}
async function flush(){try{for(const s of[...pend]){pend.delete(s);await api('PUT','/api/state/'+s,st[s])}setStatus('Saved ✓')}catch(e){setStatus('Save failed: '+e.message,true)}}
async function uploadMany(files,el,done){let n=0;for(const f of files){n++;
  try{const r=await upload(f,p=>el.textContent='Uploading '+n+'/'+files.length+' · '+f.name+' · '+Math.round(p*100)+'%');await done(f,r)}
  catch(e){el.textContent='Failed: '+f.name+' — '+e.message;await new Promise(r=>setTimeout(r,2500))}}el.textContent=''}

/* ---------- panel ---------- */
document.body.insertAdjacentHTML('beforeend',`<button id="swGear" aria-label="Admin" title="Admin">⚙</button>
<aside id="swAdmin" hidden><header><h4>Admin</h4><span id="saStat"></span><button data-x aria-label="Close">✕</button></header><div class="sa-body">
<div class="row tabs"><button data-tab="swirl">Swirl</button><button data-tab="site">Site</button><button data-tab="audio">Audio</button><button data-tab="tube">Tube</button></div>

<div class="pane" data-pane="swirl"><div class="sa-sec">Media floating around the title</div><ul id="saList"></ul><div id="saUp" class="hint"></div>
<div class="row"><label class="sa-btn">+ Upload<input id="saFile" type="file" multiple accept="image/*,video/*" hidden></label><input id="saUrl" type="text" placeholder="…or paste an image/video URL"><button id="saUrlBtn">Add</button></div>
<div class="sa-sec">Motion</div><div id="saSl"></div><label class="row" style="font-size:12px"><input id="saRev" type="checkbox"> Reverse direction</label>
<button id="saReset">Reset swirl to default</button></div>

<div class="pane" data-pane="site" hidden><div class="sa-sec">Edit this page (${PAGE==='tube'?'video tube':'home'})</div>
<label class="row" style="font-size:12px"><input id="saEdit" type="checkbox"> <b>Edit mode</b></label>
<p class="hint">Click anything: type to change text. The bar that pops up lets you change a link's address, swap a logo/image, select the parent block (↑) or delete it. Everything saves to the server instantly and shows for every visitor.</p>
<div class="row"><button id="saUndo" style="flex:1">Undo last delete</button><button id="saRestore" style="flex:1">Restore all (0)</button></div>
<div class="sa-sec">Big hero title</div><div class="row"><input id="saTitle" type="text"><button id="saTitleBtn">Set</button></div>
<div class="sa-sec">Hero logo mark</div><div class="row"><label class="sa-btn" style="flex:1">Upload logo<input id="saMarkFile" type="file" accept="image/*" hidden></label><button id="saMarkOff">Remove</button><button id="saMarkRst">Reset</button></div>
<div class="sa-sec">Browser tab title</div><div class="row"><input id="saTab" type="text"><button id="saTabBtn">Set</button></div>
<div class="sa-sec">Tab icon</div><div class="row"><label class="sa-btn" style="flex:1">Upload icon<input id="saFavFile" type="file" accept="image/*" hidden></label><button id="saFavRst">Reset</button></div>
<button id="saSiteReset">Reset all edits on this page</button></div>

<div class="pane" data-pane="audio" hidden><div class="sa-sec">Background audio (home page)</div><div id="saAudInfo" class="hint"></div><div id="saAudUp" class="hint"></div>
<div class="row"><label class="sa-btn" style="flex:1">Upload audio or video<input id="saAudFile" type="file" accept="audio/*,video/*" hidden></label><button id="saAudRm">Remove</button></div>
<div class="lab"><span>Volume</span><span id="saVolV"></span></div><input id="saVol" type="range" min="0" max="1" step=".01">
<label class="row" style="font-size:12px"><input id="saAudOn" type="checkbox"> Play it on the home page</label>
<p class="hint">Starts when the page opens, repeats forever, and fades out as visitors scroll down. Browsers block sound until a visitor clicks, taps or presses a key, so it begins at their first interaction. They also get a Sound on/off button. You can upload a video file and its soundtrack plays.</p></div>

<div class="pane" data-pane="tube" hidden><div class="sa-sec">Tabs (categories)</div><div id="saCats" class="chips"></div>
<div class="row"><input id="saCatIn" type="text" placeholder="New tab name, e.g. Tutorials"><button id="saCatAdd">Add</button></div>
<div class="sa-sec">Upload videos</div><div class="row"><span class="lab" style="flex:none">Into tab</span><select id="saVidCat"></select></div>
<div id="saVidUp" class="hint"></div>
<div class="row"><label class="sa-btn" style="flex:1">Upload videos (select many)<input id="saVidFile" type="file" multiple accept="video/*" hidden></label></div>
<div class="row"><input id="saVidUrl" type="text" placeholder="…or paste a video URL"><button id="saVidUrlBtn">Add</button></div>
<div class="sa-sec">Videos <span id="saVidCount"></span></div><ul id="saVids"></ul></div>

<button id="saLogout">Log out</button></div></aside>`);
const panel=$('#swAdmin'),gear=$('#swGear');
gear.onclick=()=>panel.hidden=!panel.hidden;$('[data-x]',panel).onclick=()=>panel.hidden=true;
AC.togglePanel=()=>panel.hidden=!panel.hidden;panel.hidden=!AC.justLoggedIn;
function tab(n){panel.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===n));panel.querySelectorAll('.pane').forEach(p=>p.hidden=p.dataset.pane!==n)}
panel.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));tab(PAGE==='tube'?'tube':'swirl');
$('#saLogout').onclick=async()=>{await api('POST','/api/logout').catch(()=>{});location.reload()};
const resync=()=>{AC.syncSwirl&&AC.syncSwirl()};

/* ---------- SWIRL ---------- */
const SL=[['speed','Swirl speed',0,4,.05],['boost','Scroll speed-up',0,3,.05],['size','Media size %',50,180,5],['radius','Swirl radius %',60,140,5],['streaks','Streak amount',0,120,1],['streakSpeed','Streak speed',0,4,.05]];
function renderList(){const list=$('#saList');list.innerHTML='';const items=st.swirl.items;
  if(!items.length)list.innerHTML='<div class="empty">Nothing in the swirl yet. Upload an image or video.</div>';
  items.forEach(it=>{const li=document.createElement('li'),th=document.createElement(it.type==='video'?'video':'img');th.className='th';th.src=it.src;if(it.type==='video'){th.muted=true;th.preload='metadata'}
    const mid=document.createElement('div'),nm=document.createElement('div');nm.className='nm';nm.textContent=it.name;nm.title=it.name;
    const lab=document.createElement('div');lab.className='lab';const sp=document.createElement('span');sp.textContent='Speed ×'+(+it.speed).toFixed(1);lab.append(sp);
    const r=document.createElement('input');r.type='range';r.min=0;r.max=3;r.step=.1;r.value=it.speed;r.oninput=()=>{it.speed=+r.value;sp.textContent='Speed ×'+it.speed.toFixed(1);save('swirl')};
    mid.append(nm,lab,r);const x=document.createElement('button');x.className='x';x.textContent='✕';x.title='Remove';
    x.onclick=()=>{st.swirl.items=items.filter(i=>i!==it);delFile(it.src);resync();save('swirl');renderList()};
    li.append(th,mid,x);list.append(li)})}
function renderSliders(){const box=$('#saSl');box.innerHTML='';const S=st.swirl.settings;
  SL.forEach(([k,l,mn,mx,stp])=>{const w=document.createElement('div'),lab=document.createElement('div');lab.className='lab';const v=document.createElement('span');v.textContent=(+S[k]).toFixed(stp<1?2:0);lab.append(l,v);
    const r=document.createElement('input');r.type='range';r.min=mn;r.max=mx;r.step=stp;r.value=S[k];r.oninput=()=>{S[k]=+r.value;v.textContent=(+r.value).toFixed(stp<1?2:0);save('swirl')};w.append(lab,r);box.append(w)});
  $('#saRev').checked=!!S.reverse}
$('#saRev').onchange=e=>{st.swirl.settings.reverse=e.target.checked;save('swirl')};
$('#saFile').onchange=async e=>{const fs=[...e.target.files];e.target.value='';
  await uploadMany(fs,$('#saUp'),(f,r)=>{st.swirl.items.push({id:uid(),name:f.name,type:ftype(f),src:r.src,speed:1});resync();renderList();save('swirl')})};
const addUrl=()=>{const i=$('#saUrl'),u=i.value.trim();if(!u)return;st.swirl.items.push({id:uid(),name:u.split('/').pop().split('?')[0]||u,type:kind(u),src:u,speed:1});i.value='';resync();renderList();save('swirl')};
$('#saUrlBtn').onclick=addUrl;$('#saUrl').onkeydown=e=>{if(e.key==='Enter')addUrl()};
$('#saReset').onclick=()=>{if(!confirm('Remove all swirl media and restore the default images and settings?'))return;
  st.swirl.items.forEach(i=>delFile(i.src));
  st.swirl={settings:{speed:1,boost:1,streaks:40,streakSpeed:1,size:100,radius:100,reverse:false},items:[{id:uid(),name:'1.svg',type:'image',src:'/media/1.svg',speed:1},{id:uid(),name:'2.svg',type:'image',src:'/media/2.svg',speed:1}]};
  resync();renderList();renderSliders();save('swirl')};

/* ---------- AUDIO ---------- */
function renderAudio(){const a=st.audio;$('#saAudInfo').textContent=a.src?'Current: '+(a.name||a.src):'No audio uploaded yet.';
  $('#saVol').value=a.volume;$('#saVolV').textContent=Math.round(a.volume*100)+'%';$('#saAudOn').checked=a.enabled!==false}
$('#saAudFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  await uploadMany([f],$('#saAudUp'),(f,r)=>{delFile(st.audio.src);st.audio.src=r.src;st.audio.name=f.name;AC.applyAudio&&AC.applyAudio();renderAudio();save('audio')})};
$('#saAudRm').onclick=()=>{if(!st.audio.src||!confirm('Remove the background audio?'))return;delFile(st.audio.src);st.audio.src=null;st.audio.name='';AC.applyAudio&&AC.applyAudio();renderAudio();save('audio')};
$('#saVol').oninput=e=>{st.audio.volume=+e.target.value;$('#saVolV').textContent=Math.round(st.audio.volume*100)+'%';window.dispatchEvent(new Event('scroll'));save('audio')};
$('#saAudOn').onchange=e=>{st.audio.enabled=e.target.checked;AC.applyAudio&&AC.applyAudio();save('audio')};

/* ---------- TUBE ---------- */
const reTube=()=>{AC.renderTube&&AC.renderTube()};
function renderTube(){const T=st.tube,cats=$('#saCats');cats.innerHTML='';
  T.categories.forEach(c=>{const s=document.createElement('span');s.className='chip';s.textContent=c+' ';const x=document.createElement('button');x.textContent='✕';x.title='Delete tab (videos are kept, just untabbed)';
    x.onclick=()=>{if(!confirm('Delete the tab "'+c+'"? Its videos stay in All.'))return;T.categories=T.categories.filter(k=>k!==c);T.videos.forEach(v=>{if(v.category===c)v.category=''});save('tube');renderTube();reTube()};s.append(x);cats.append(s)});
  if(!T.categories.length)cats.innerHTML='<div class="empty">No tabs yet. Visitors see “All”.</div>';
  const sel=$('#saVidCat'),cur=sel.value;sel.innerHTML='<option value="">(no tab)</option>'+T.categories.map(c=>'<option></option>').join('');
  [...sel.options].slice(1).forEach((o,i)=>{o.value=o.textContent=T.categories[i]});sel.value=T.categories.includes(cur)?cur:'';
  $('#saVidCount').textContent='('+T.videos.length+')';
  const ul=$('#saVids');ul.innerHTML='';if(!T.videos.length)ul.innerHTML='<div class="empty">No videos yet.</div>';
  [...T.videos].sort((a,b)=>(b.added||0)-(a.added||0)).forEach(v=>{const li=document.createElement('li');li.className='vid';
    const th=document.createElement('video');th.className='th';th.muted=true;th.preload='metadata';th.src=v.src+'#t=0.5';
    const mid=document.createElement('div');mid.style.cssText='display:flex;flex-direction:column;gap:4px;min-width:0';
    const ti=document.createElement('input');ti.type='text';ti.value=v.title;ti.oninput=()=>{v.title=ti.value;save('tube');reTube()};
    const de=document.createElement('input');de.type='text';de.placeholder='Description (optional)';de.value=v.desc||'';de.oninput=()=>{v.desc=de.value;save('tube');reTube()};
    const ca=document.createElement('select');ca.innerHTML='<option value="">(no tab)</option>'+T.categories.map(()=>'<option></option>').join('');[...ca.options].slice(1).forEach((o,i)=>{o.value=o.textContent=T.categories[i]});ca.value=v.category||'';
    ca.onchange=()=>{v.category=ca.value;save('tube');renderTube();reTube()};
    mid.append(ti,de,ca);const x=document.createElement('button');x.className='x';x.textContent='✕';x.title='Delete video';
    x.onclick=()=>{if(!confirm('Delete "'+v.title+'" permanently?'))return;delFile(v.src);T.videos=T.videos.filter(k=>k!==v);save('tube');renderTube();reTube()};
    li.append(th,mid,x);ul.append(li)})}
const addCat=()=>{const i=$('#saCatIn'),c=i.value.trim();if(!c||c.toLowerCase()==='all'||st.tube.categories.includes(c))return;st.tube.categories.push(c);i.value='';save('tube');renderTube();reTube()};
$('#saCatAdd').onclick=addCat;$('#saCatIn').onkeydown=e=>{if(e.key==='Enter')addCat()};
const pretty=n=>n.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim();
$('#saVidFile').onchange=async e=>{const fs=[...e.target.files];e.target.value='';const cat=$('#saVidCat').value;
  await uploadMany(fs,$('#saVidUp'),(f,r)=>{st.tube.videos.push({id:uid(),title:pretty(f.name)||'Untitled',desc:'',category:cat,src:r.src,added:Date.now()});save('tube');renderTube();reTube()})};
$('#saVidUrlBtn').onclick=()=>{const i=$('#saVidUrl'),u=i.value.trim();if(!u)return;st.tube.videos.push({id:uid(),title:pretty(u.split('/').pop().split('?')[0])||'Untitled',desc:'',category:$('#saVidCat').value,src:u,added:Date.now()});i.value='';save('tube');renderTube();reTube()};

/* ---------- SITE EDITOR (text, links, logos, delete) ---------- */
const E=()=>AC.siteE(),N=()=>AC.nodes();let edit=false,tA=null,tI=null,tE=null;
document.body.insertAdjacentHTML('beforeend',`<div id="acBox" hidden></div><div id="acTb" hidden>
<div class="r" data-k="e"><span>Item</span><b id="tbTag"></b><button id="tbUp" title="Select the block around this">↑ Parent</button><button id="tbDel" class="del">Delete</button></div>
<div class="r" data-k="l"><span>Link</span><input type="text" id="tbHref" placeholder="https://… or /page or #section"><label><input type="checkbox" id="tbNew">new tab</label><button id="tbApply">Apply</button><button id="tbLRst" title="Restore original link">↺</button></div>
<div class="r" data-k="i"><span>Image</span><label class="sa-btn">Upload<input type="file" id="tbFile" accept="image/*" hidden></label><input type="text" id="tbSrc" placeholder="…or image URL"><button id="tbSet">Set</button><button id="tbRst" title="Restore original image">↺</button></div></div>`);
const tb=$('#acTb'),box=$('#acBox'),edBox=$('#saEdit');
function setEdit(on){edit=on;document.documentElement.classList.toggle('ac-edit',on);edBox.checked=on;
  N().cT.forEach(e=>{if(on){e.contentEditable='true';e.spellcheck=false}else{e.removeAttribute('contenteditable');e.removeAttribute('spellcheck')}});if(!on)hideUI()}
edBox.onchange=()=>setEdit(edBox.checked);
function hideUI(){tb.hidden=true;box.hidden=true;tE=tA=tI=null}
let es;const saveSoon=()=>{clearTimeout(es);es=setTimeout(()=>save('site'),350)};
document.addEventListener('input',e=>{if(!edit)return;const el=e.target.closest&&e.target.closest('[contenteditable]'),i=N().cT.indexOf(el);if(i>-1){E().t[i]={o:el._o,h:el.innerHTML};saveSoon()}},true);
document.addEventListener('keydown',e=>{if(!edit||!e.target.isContentEditable)return;
  if(e.key===' '&&e.target.closest('button')){e.preventDefault();document.execCommand('insertText',false,' ')}
  else if(e.key==='Enter'){e.preventDefault();document.execCommand('insertLineBreak')}},true);
document.addEventListener('paste',e=>{if(!edit||!e.target.isContentEditable)return;e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))},true);
function pick(el){
  tE=el&&el._p?el:null;if(!tE){hideUI();return}
  const a=tE.closest('a[href]');tA=a&&N().cL.includes(a)?a:null;tI=tE.tagName==='IMG'&&N().cI.includes(tE)?tE:null;
  $('[data-k=l]',tb).hidden=!tA;$('[data-k=i]',tb).hidden=!tI;
  $('#tbTag').textContent='<'+tE.tagName.toLowerCase()+'> '+(tE.textContent.trim().slice(0,28)||'');
  const p=tE.parentElement;$('#tbUp').disabled=!(p&&p._p&&!['BODY','MAIN','HTML'].includes(p.tagName));
  if(tA){$('#tbHref').value=tA.getAttribute('href');$('#tbNew').checked=tA.target==='_blank'}if(tI)$('#tbSrc').value='';
  const r=tE.getBoundingClientRect();box.hidden=false;Object.assign(box.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  tb.hidden=false;const h=tb.offsetHeight;tb.style.left=Math.max(10,Math.min(r.left,innerWidth-tb.offsetWidth-10))+'px';
  tb.style.top=(r.bottom+h+16<innerHeight?r.bottom+8:Math.max(56,r.top-h-8))+'px'}
document.addEventListener('click',e=>{
  if(!edit||e.target.closest('#swAdmin,#swGear,#acTb'))return;
  const a=e.target.closest('a[href]'),bt=e.target.closest('button'),im=e.target.closest('img'),wm=e.target.closest('[role=img]');
  if(a||bt){e.preventDefault();e.stopPropagation()}
  pick(im||(a||bt)||wm||e.target.closest('svg')||e.target)},true);
addEventListener('scroll',hideUI,{passive:true});
$('#tbUp').onclick=()=>{if(tE&&tE.parentElement)pick(tE.parentElement)};
const cnt=()=>{$('#saRestore').textContent='Restore all ('+E().d.length+')'};
$('#tbDel').onclick=()=>{if(!tE)return;if(document.activeElement)document.activeElement.blur();tE.setAttribute('data-ac-del','');E().d.push({p:tE._p,g:tE._g});save('site');cnt();hideUI()};
$('#saUndo').onclick=()=>{const d=E().d.pop();if(!d)return;const el=AC.byP(d.p);el&&el.removeAttribute('data-ac-del');save('site');cnt()};
$('#saRestore').onclick=()=>{E().d.forEach(d=>{const el=AC.byP(d.p);el&&el.removeAttribute('data-ac-del')});E().d=[];save('site');cnt()};
const flash=b=>{const t=b.textContent;b.textContent='✓';setTimeout(()=>b.textContent=t,900)};
$('#tbApply').onclick=e=>{const h=$('#tbHref').value.trim();if(!tA||!h)return;tA.setAttribute('href',h);
  if($('#tbNew').checked){tA.target='_blank';tA.rel='noopener'}else tA.removeAttribute('target');
  E().l[N().cL.indexOf(tA)]={o:tA._o,h,n:$('#tbNew').checked};save('site');flash(e.target)};
$('#tbLRst').onclick=e=>{if(!tA)return;tA.setAttribute('href',tA._o);tA.removeAttribute('target');$('#tbHref').value=tA._o;delete E().l[N().cL.indexOf(tA)];save('site');flash(e.target)};
$('#tbFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!tI)return;
  try{const r=await upload(f),im=tI;AC.setImg(im,r.src);E().i[N().cI.indexOf(im)]={o:im._o,h:r.src};save('site')}catch(x){alert('Upload failed: '+x.message)}};
$('#tbSet').onclick=e=>{const u=$('#tbSrc').value.trim();if(!tI||!u)return;AC.setImg(tI,u);E().i[N().cI.indexOf(tI)]={o:tI._o,h:u};save('site');flash(e.target)};
$('#tbRst').onclick=e=>{if(!tI)return;tI.src=tI._s0;if(tI._tl)tI.classList.add('themed-logo');delete E().i[N().cI.indexOf(tI)];save('site');flash(e.target)};
$('#saTitle').value=E().title||'ARTCRAFT';$('#saTab').value=E().tab||document.title;
const setT=()=>{const t=$('#saTitle').value.trim();if(!t)return;E().title=t;AC.refreshTitle();save('site')};
$('#saTitleBtn').onclick=setT;$('#saTitle').onkeydown=e=>{if(e.key==='Enter')setT()};
const setTab=()=>{const t=$('#saTab').value.trim();if(!t)return;E().tab=t;document.title=t;save('site')};
$('#saTabBtn').onclick=setTab;$('#saTab').onkeydown=e=>{if(e.key==='Enter')setTab()};
const pickImg=(id,fn)=>{$(id).onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{const r=await upload(f);fn(r.src);save('site')}catch(x){alert('Upload failed: '+x.message)}}};
pickImg('#saMarkFile',u=>{E().mark={img:u};AC.refreshTitle()});
$('#saMarkOff').onclick=()=>{E().mark={off:true};AC.refreshTitle();save('site')};
$('#saMarkRst').onclick=()=>{E().mark=null;AC.refreshTitle();save('site')};
pickImg('#saFavFile',u=>{E().fav=u;AC.setFav(u)});
$('#saFavRst').onclick=async()=>{E().fav=null;await api('PUT','/api/state/site',st.site).catch(()=>{});location.reload()};
$('#saSiteReset').onclick=async()=>{if(!confirm('Discard every text, link, image, title and delete edit on this page?'))return;st.site[PAGE]={};await api('PUT','/api/state/site',st.site).catch(()=>{});location.reload()};
if(PAGE!=='home'){['saTitle','saTitleBtn','saMarkFile','saMarkOff','saMarkRst'].forEach(i=>{const r=$('#'+i).closest('.row');r.style.display='none';if(r.previousElementSibling)r.previousElementSibling.style.display='none'})}

renderList();renderSliders();renderAudio();renderTube();cnt();setStatus('Ready');
})();
