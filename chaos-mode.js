// CHAOS MODE — Experimental Builder Edition
// Drop this file into any site you CONTROL (local/dev recommended)
// Blend of Raw Builder, Cynical Hacker, Dry Architect, and Trickster Broadcaster voices
//
// Usage:
//   <script src="chaos-mode.js"></script>
//
// Controls:
//   Ctrl+Alt+C  -> Toggle control panel
//   Ctrl+Alt+X  -> Enable/Disable ALL toggles
//
// Safety:
//   window.Chaos.disable() to stop and clean up
//   Panic: reload page

(() => {
  const Chaos = (window.Chaos = window.Chaos || {});
  if (Chaos.__active) return;

  Chaos.__active = true;
  const state = {
    enabled: false,
    toggles: { layoutMayhem:false, mutationStorm:false, resourceGremlin:false, latencyLag:false, typographyStress:false, a11yStrip:false, glitchOverlay:false },
    intervals: new Set(), listeners: new Set(), styles: new Set(), ui:null
  };

  const addStyle=(css,id)=>{const s=document.createElement('style');s.type='text/css';if(id)s.dataset.chaosId=id;s.appendChild(document.createTextNode(css));document.documentElement.appendChild(s);state.styles.add(s);return s;};
  const removeStyleById=(id)=>{document.querySelectorAll('style[data-chaos-id="'+id+'"]').forEach(n=>{n.remove();state.styles.delete(n);});};
  const every=(ms,fn)=>{const h=setInterval(fn,ms);state.intervals.add(h);return()=>{clearInterval(h);state.intervals.delete(h);};};
  const on=(t,type,h,opts)=>{t.addEventListener(type,h,opts);state.listeners.add(()=>t.removeEventListener(type,h,opts));return()=>t.removeEventListener(type,h,opts);};
  const rand=(a,b)=>Math.random()*(b-a)+a;const sample=arr=>arr[Math.floor(Math.random()*arr.length)];const safeNodes=()=>Array.from(document.querySelectorAll('body *:not([data-chaos-ui])'));

  const layoutMayhem={id:'layoutMayhem',enable(){addStyle(`*{box-sizing:content-box!important;}html,body{overflow:auto!important;}main,section,article,[role="main"]{width:500vw!important;}*{min-width:0!important;min-height:0!important;}`, 'layout-mayhem');},disable(){removeStyleById('layout-mayhem');}};
  const mutationStorm={id:'mutationStorm',stop:null,enable(){this.stop=every(800,()=>{const nodes=safeNodes();for(let i=0;i<Math.min(50,nodes.length);i++){const el=sample(nodes);if(!el)continue;if(Math.random()<0.02){el.style.transform=`scale(${(0.5+Math.random()*1.5).toFixed(3)}) rotate(${(rand(-3,3)).toFixed(3)}deg)`;el.style.transition='transform 0.3s';}if(Math.random()<0.01&&el.parentElement){el.parentElement.removeChild(el);}}});},disable(){if(this.stop)this.stop();}};
  const resourceGremlin={id:'resourceGremlin',stop:null,enable(){const g=()=>{document.querySelectorAll('img').forEach(i=>{if(!i.dataset._cg&&Math.random()<0.25){i.dataset._cg=1;i.src='about:blank';}});};g();this.stop=every(2000+Math.random()*2000,g);},disable(){if(this.stop)this.stop();}};
  const latencyLag={id:'latencyLag',removeFns:[],enable(){['click','input','submit','pointerdown','change'].forEach(type=>{const off=on(document,type,async e=>{e.stopImmediatePropagation();await new Promise(r=>setTimeout(r,400));},true);this.removeFns.push(off);});},disable(){this.removeFns.forEach(fn=>fn());this.removeFns=[];}};
  const typographyStress={id:'typographyStress',enable(){addStyle(`html{font-size:112.5%!important;}body{line-height:.95!important;letter-spacing:.02em!important;}`,'typography-stress');},disable(){removeStyleById('typography-stress');}};
  const a11yStrip={id:'a11yStrip',removed:[],enable(){const nodes=document.querySelectorAll('[role],header,main,nav,footer,aside');nodes.forEach(n=>{const r=n.getAttribute('role');if(r!==null)n.removeAttribute('role');this.removed.push({n,role:r});});},disable(){this.removed.forEach(({n,role})=>{if(role!==null)n.setAttribute('role',role);});this.removed=[];}};
  const glitchOverlay={id:'glitchOverlay',enable(){addStyle(`body::after{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent 0 2px,rgba(0,0,0,.05) 2px 3px);animation:chaos-desync .8s infinite;z-index:2147483640;}@keyframes chaos-desync{50%{transform:translateY(1px);opacity:.9;}}.chaos-glitch{position:relative;display:inline-block;filter:contrast(1.2)saturate(1.05);}.chaos-glitch::before,.chaos-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;mix-blend-mode:screen;animation:chaos-shiver 2s infinite steps(20);pointer-events:none;}.chaos-glitch::before{transform:translate(2px,0);}.chaos-glitch::after{transform:translate(-2px,0);}@keyframes chaos-shiver{10%{clip-path:inset(10% 0 40% 0);transform:translate(-2px,-1px);}20%{clip-path:inset(80% 0 5% 0);transform:translate(2px,1px);}30%{clip-path:inset(40% 0 20% 0);}}`,'glitch-overlay');},disable(){removeStyleById('glitch-overlay');}};

  const TOGGLES={layoutMayhem,mutationStorm,resourceGremlin,latencyLag,typographyStress,a11yStrip,glitchOverlay};

  const createUI=()=>{const w=document.createElement('div');w.setAttribute('data-chaos-ui','1');w.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483647;font:13px/1.2 system-ui,sans-serif;color:#111;background:#fff;border:1px solid #000;padding:10px 12px;box-shadow:3px 3px 0 #000;user-select:none;width:260px;';w.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Chaos Mode</strong><button data-chaos-ui="toggleAll">Toggle All</button></div>';document.body.appendChild(w);state.ui=w;return w;};

  Chaos.enable=()=>{if(state.enabled)return;state.enabled=true;createUI();console.log('%cChaos Mode ready','padding:2px 6px;border:1px solid #000;background:#fff;color:#000;');};
  Chaos.disable=()=>{Object.values(TOGGLES).forEach(m=>{try{m.disable();}catch{}});state.intervals.forEach(clearInterval);state.listeners.forEach(fn=>fn());state.styles.forEach(s=>s.remove());if(state.ui)state.ui.remove();state.enabled=false;console.log('[Chaos] disabled');};

  Chaos.enable();
})();
