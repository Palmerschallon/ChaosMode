// CHAOS MODE — working panel + modules
(() => {
  const Chaos = (window.Chaos = window.Chaos || {});
  if (Chaos.__active) return;
  Chaos.__active = true;

  const S = { intervals:new Set(), listeners:new Set(), styles:new Set(), ui:null, toggles:{} };

  const addStyle = (css,id) => {
    const s = document.createElement('style'); s.type='text/css';
    if (id) s.dataset.chaosId = id;
    s.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(s);
    S.styles.add(s); return s;
  };
  const rmStyle = id => document.querySelectorAll(`style[data-chaos-id="${id}"]`).forEach(n => { n.remove(); S.styles.delete(n); });
  const every = (ms,fn) => { const h=setInterval(fn,ms); S.intervals.add(h); return () => { clearInterval(h); S.intervals.delete(h); }; };
  const on = (t,ev,fn,opt) => { t.addEventListener(ev,fn,opt); const off=()=>t.removeEventListener(ev,fn,opt); S.listeners.add(off); return off; };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const safeNodes = () => Array.from(document.querySelectorAll('body *:not([data-chaos-ui])'));

  // ---- Modules ------------------------------------------------------
  const layoutMayhem = {
    enable(){ addStyle(`
      *{box-sizing:content-box!important; min-width:0!important; min-height:0!important}
      html,body{overflow:auto!important}
      main,section,article,[role="main"]{width:500vw!important}
    `,'cm-layout'); },
    disable(){ rmStyle('cm-layout'); }
  };

  const mutationStorm = {
    stop:null,
    enable(){ this.stop = every(800, () => {
      const nodes = safeNodes(); for (let i=0;i<Math.min(60,nodes.length);i++){
        const el = pick(nodes); if (!el) continue;
        if (Math.random() < 0.02){ el.style.transform = `scale(${(0.6+Math.random()*1.4).toFixed(2)}) rotate(${(Math.random()*6-3).toFixed(2)}deg)`; el.style.transition='transform .25s'; }
        if (Math.random() < 0.008 && el.parentElement){ el.parentElement.removeChild(el); }
      }
    }); },
    disable(){ this.stop && this.stop(); }
  };

  const resourceGremlin = {
    stop:null,
    enable(){ const g=()=>{
      document.querySelectorAll('img').forEach(i=>{ if(!i.dataset._cg && Math.random()<0.25){ i.dataset._cg=1; i.src='about:blank'; } });
    }; g(); this.stop = every(2000+Math.random()*2000, g); },
    disable(){ this.stop && this.stop(); }
  };

  const latencyLag = {
    offs:[],
    enable(){ ['click','input','submit','pointerdown','change'].forEach(t=>{
      const off = on(document,t, async e => { e.stopImmediatePropagation(); await new Promise(r=>setTimeout(r,400)); }, true);
      this.offs.push(off);
    }); },
    disable(){ this.offs.forEach(fn=>fn()); this.offs=[]; }
  };

  const typographyStress = {
    enable(){ addStyle(`html{font-size:112.5%!important} body{line-height:.95!important;letter-spacing:.02em!important}`, 'cm-typo'); },
    disable(){ rmStyle('cm-typo'); }
  };

  const a11yStrip = {
    removed:[],
    enable(){ document.querySelectorAll('[role],header,main,nav,footer,aside').forEach(n=>{
      const r=n.getAttribute('role'); if(r!==null) n.removeAttribute('role'); this.removed.push({n,role:r});
    }); },
    disable(){ this.removed.forEach(({n,role})=>{ if(role!==null) n.setAttribute('role',role); }); this.removed=[]; }
  };

  const glitchOverlay = {
    enable(){ addStyle(`
      [data-chaos-ui]{all:initial}
      body::after{
        content:""; position:fixed; inset:0; pointer-events:none;
        background:repeating-linear-gradient(transparent 0 2px, rgba(0,0,0,.06) 2px 3px);
        animation:cm-scan .8s infinite linear; z-index:2147483640;
      }
      @keyframes cm-scan{50%{transform:translateY(1px);opacity:.9}}
      .chaos-glitch{position:relative; display:inline-block; filter:contrast(1.15) saturate(1.05)}
      .chaos-glitch::before,.chaos-glitch::after{
        content:attr(data-text); position:absolute; left:0; top:0; pointer-events:none;
        mix-blend-mode:screen; animation:cm-jitter 2s steps(20) infinite;
      }
      .chaos-glitch::before{transform:translate(2px,0)}
      .chaos-glitch::after {transform:translate(-2px,0)}
      @keyframes cm-jitter{
        10%{clip-path:inset(10% 0 40% 0); transform:translate(-2px,-1px)}
        20%{clip-path:inset(80% 0  5% 0); transform:translate( 2px, 1px)}
        30%{clip-path:inset(40% 0 20% 0)}
      }
    `,'cm-glitch'); },
    disable(){ rmStyle('cm-glitch'); }
  };

  const modules = { layoutMayhem, mutationStorm, resourceGremlin, latencyLag, typographyStress, a11yStrip, glitchOverlay };

  // ---- UI -----------------------------------------------------------
  function buildUI(){
    const box = document.createElement('div');
    box.setAttribute('data-chaos-ui','1');
    box.style.cssText = `
      position:fixed; right:16px; bottom:16px; z-index:2147483647;
      font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      color:#111;background:#fff;border:1px solid #000;padding:10px 12px;
      box-shadow:3px 3px 0 #000; user-select:none; width:260px;
    `;
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong>Chaos Mode</strong>
        <button data-act="all" style="border:1px solid #000;background:#f2f2f2;padding:2px 6px;cursor:pointer">Toggle All</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center">
        <label><input type="checkbox" data-key="layoutMayhem"> Layout Mayhem</label><span>Layout</span>
        <label><input type="checkbox" data-key="mutationStorm"> Mutation Storm</label><span>DOM</span>
        <label><input type="checkbox" data-key="resourceGremlin"> Resource Gremlin</label><span>Assets</span>
        <label><input type="checkbox" data-key="latencyLag"> Latency Lag</label><span>Delay</span>
        <label><input type="checkbox" data-key="typographyStress"> Typography Stress</label><span>Type</span>
        <label><input type="checkbox" data-key="a11yStrip"> A11y Strip</label><span>Semantics</span>
        <label><input type="checkbox" data-key="glitchOverlay"> Glitch Overlay</label><span>FX</span>
      </div>
      <div style="margin-top:8px;border-top:1px solid #000;padding-top:8px">
        <div><code>Ctrl+Alt+C</code> panel · <code>Ctrl+Alt+X</code> all</div>
        <div style="margin-top:6px">Use <code>class="chaos-glitch" data-text="TEXT"</code> for titles.</div>
      </div>
    `;
    document.body.appendChild(box);
    S.ui = box;

    const apply = (k,on) => { S.toggles[k]=on; try{ on?modules[k].enable():modules[k].disable(); }catch(e){ console.error('[Chaos]',e); } };

    box.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change',()=> apply(cb.dataset.key, cb.checked));
    });

    // Toggle All button (exposed as [data-act="all"] for mobile controls)
    box.querySelector('[data-act="all"]').addEventListener('click', ()=>{
      const anyOff = Object.keys(modules).some(k => !S.toggles[k]);
      box.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = anyOff; apply(cb.dataset.key, anyOff); });
    });

    // keyboard shortcuts
    on(document,'keydown',(e)=>{
      if (e.ctrlKey && e.altKey && e.code==='KeyC'){ box.style.display = box.style.display==='none' ? '' : 'none'; }
      if (e.ctrlKey && e.altKey && e.code==='KeyX'){ box.querySelector('[data-act="all"]').click(); }
    },false);
  }

  // ---- Public API ---------------------------------------------------
  Chaos.enable = () => { if (S.ui) return; buildUI(); console.log('%cChaos Mode ready','padding:2px 6px;border:1px solid #000;background:#fff;color:#000;'); };
  Chaos.disable = () => {
    Object.keys(modules).forEach(k=>{ try{ modules[k].disable(); }catch{} S.toggles[k]=false; });
    S.intervals.forEach(clearInterval); S.listeners.forEach(fn=>{ try{ fn(); }catch{} });
    S.styles.forEach(s=>s.remove()); if (S.ui) S.ui.remove();
    S.intervals.clear(); S.listeners.clear(); S.styles.clear(); S.ui=null;
    console.log('[Chaos] disabled');
  };

  // auto-mount
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Chaos.enable, { once:true });
  else Chaos.enable();
})();
