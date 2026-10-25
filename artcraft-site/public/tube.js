(()=>{const AC=window.AC;if(!AC||AC.PAGE!=='tube')return;
const $=s=>document.querySelector(s);let cat='All',q='';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
  const T=AC.state.tube,V=T.videos||[],C=T.categories||[],tabs=['All',...C];if(!tabs.includes(cat))cat='All';
  $('#tubeTabs').innerHTML=tabs.map(c=>`<button role="tab" class="${c===cat?'on':''}" data-c="${esc(c)}">${esc(c)}<i>${c==='All'?V.length:V.filter(v=>v.category===c).length}</i></button>`).join('');
  const list=V.filter(v=>(cat==='All'||v.category===cat)&&(!q||((v.title||'')+' '+(v.desc||'')+' '+(v.category||'')).toLowerCase().includes(q))).sort((a,b)=>(b.added||0)-(a.added||0));
  $('#tubeGrid').innerHTML=list.map(v=>`<article class="tc" data-id="${esc(v.id)}" tabindex="0"><div class="tc-th"><video muted playsinline preload="metadata" src="${esc(v.src)}#t=0.6"></video><span class="tc-play">▶</span></div><h3>${esc(v.title)}</h3><p>${esc(v.category||'')}</p></article>`).join('');
  const em=$('#tubeEmpty');em.hidden=list.length>0;em.textContent=V.length?'No videos match your search.':'No videos yet — check back soon.'}
function open(id){const v=(AC.state.tube.videos||[]).find(x=>x.id===id);if(!v)return;
  $('#tmV').src=v.src;$('#tmT').textContent=v.title;$('#tmD').textContent=v.desc||'';$('#tubeModal').hidden=false;$('#tmV').play().catch(()=>{});history.replaceState(null,'','#v='+id)}
function close(){const m=$('#tubeModal');if(m.hidden)return;m.hidden=true;const v=$('#tmV');v.pause();v.removeAttribute('src');v.load();history.replaceState(null,'',location.pathname)}
AC.renderTube=render;
window.addEventListener('ac-ready',()=>{
  $('#tubeTabs').onclick=e=>{const b=e.target.closest('button[data-c]');if(b){cat=b.dataset.c;render()}};
  $('#tubeQ').oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
  $('#tubeGrid').onclick=e=>{const c=e.target.closest('.tc');if(c)open(c.dataset.id)};
  $('#tubeGrid').onkeydown=e=>{if(e.key==='Enter'){const c=e.target.closest('.tc');if(c)open(c.dataset.id)}};
  $('#tmX').onclick=close;$('#tubeModal').onclick=e=>{if(e.target.id==='tubeModal')close()};
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  render();const m=/#v=([\w-]+)/.exec(location.hash);if(m)open(m[1])});
})();
