/* ============================================================
   SUFIYAN AI CHATBOT — Portfolio Assistant
   Add before </body>:  <script src="sufiyan-chatbot.js"></script>
   ============================================================ */

(function () {

  /* ── CHANGE THIS after deploying api/chat.js to Vercel ── */
  const API_URL = '/api/chat';

  const style = document.createElement('style');
  style.textContent = `
    #sm-chat-toggle {
      position: fixed; bottom: 32px; right: 32px;
      width: 56px; height: 56px; background: var(--accent, #5700ef);
      border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      z-index: 999; cursor: none; box-shadow: 0 4px 24px rgba(87,0,239,0.35);
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, background 0.3s;
    }
    #sm-chat-toggle:hover { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 32px rgba(87,0,239,0.5); background: var(--accent-hover, #4400cc); }
    #sm-chat-toggle.open svg.icon-chat { display: none; }
    #sm-chat-toggle.open svg.icon-close { display: block !important; }
    #sm-chat-toggle .icon-close { display: none; }
    #sm-chat-toggle::before { content:''; position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(87,0,239,0.35); animation:smPulseRing 2.5s ease-out infinite; }
    @keyframes smPulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.5);opacity:0} }
    #sm-chat-toggle.open::before { display: none; }
    #sm-chat-badge { position:absolute; top:-3px; right:-3px; width:16px; height:16px; background:#ff6b35; border-radius:50%; border:2px solid var(--bg,#f8f7ff); font-size:9px; font-weight:700; color:#fff; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    #sm-chat-badge.hidden { transform: scale(0); }
    #sm-chat-window { position:fixed; bottom:100px; left:32px; width:380px; height:560px; background:var(--bg,#f8f7ff); border:1px solid var(--border,#ddd8f8); border-radius:20px; display:flex; flex-direction:column; z-index:998; box-shadow:0 20px 60px rgba(87,0,239,0.15),0 4px 20px rgba(0,0,0,0.08); overflow:hidden; transform:translateY(20px) scale(0.95); opacity:0; pointer-events:none; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.35s ease; transform-origin:bottom left; }
    #sm-chat-window.open { transform:translateY(0) scale(1); opacity:1; pointer-events:all; }
    #sm-chat-header { background:var(--accent,#5700ef); padding:18px 20px 16px; display:flex; align-items:center; gap:12px; flex-shrink:0; }
    .sm-avatar { width:38px; height:38px; background:rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:16px; color:#fff; flex-shrink:0; border:1.5px solid rgba(255,255,255,0.3); }
    .sm-header-name { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:#fff; }
    .sm-header-status { font-family:'DM Sans',sans-serif; font-size:11px; color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:5px; margin-top:2px; }
    .sm-status-dot { width:6px; height:6px; background:#22c55e; border-radius:50%; animation:smPulse 2s infinite; flex-shrink:0; }
    @keyframes smPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
    .sm-header-close { background:rgba(255,255,255,0.15); border:none; width:28px; height:28px; border-radius:50%; color:rgba(255,255,255,0.8); font-size:13px; cursor:none; display:flex; align-items:center; justify-content:center; transition:background 0.2s; flex-shrink:0; margin-left:auto; }
    .sm-header-close:hover { background: rgba(255,255,255,0.25); }
    #sm-chat-messages { flex:1; overflow-y:auto; padding:20px 16px; display:flex; flex-direction:column; gap:14px; scroll-behavior:smooth; }
    #sm-chat-messages::-webkit-scrollbar { width:4px; }
    #sm-chat-messages::-webkit-scrollbar-thumb { background:var(--border,#ddd8f8); border-radius:4px; }
    .sm-msg { display:flex; gap:8px; align-items:flex-end; animation:smMsgIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
    @keyframes smMsgIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .sm-msg.user { flex-direction: row-reverse; }
    .sm-msg-avatar { width:28px; height:28px; border-radius:50%; background:var(--accent-light,#ede8ff); border:1.5px solid rgba(87,0,239,0.2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:var(--accent,#5700ef); flex-shrink:0; font-family:'DM Sans',sans-serif; }
    .sm-msg.user .sm-msg-avatar { background:var(--accent,#5700ef); color:#fff; border-color:transparent; }
    .sm-msg-bubble { max-width:78%; padding:11px 15px; border-radius:16px; font-family:'DM Sans',sans-serif; font-size:13.5px; line-height:1.65; font-weight:300; }
    .sm-msg.bot .sm-msg-bubble { background:var(--card,#ffffff); border:1px solid var(--border,#ddd8f8); color:var(--text,#0d0a1a); border-bottom-left-radius:4px; }
    .sm-msg.user .sm-msg-bubble { background:var(--accent,#5700ef); color:#fff; border-bottom-right-radius:4px; }
    .sm-msg-bubble a { color:var(--accent,#5700ef); text-decoration:underline; }
    .sm-msg.user .sm-msg-bubble a { color:rgba(255,255,255,0.85); }
    .sm-typing { display:flex; gap:4px; align-items:center; padding:12px 15px; }
    .sm-typing span { width:6px; height:6px; background:var(--muted,#7a6f9a); border-radius:50%; animation:smTyping 1.2s ease-in-out infinite; }
    .sm-typing span:nth-child(2){animation-delay:.2s} .sm-typing span:nth-child(3){animation-delay:.4s}
    @keyframes smTyping { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-5px);opacity:1} }
    #sm-quick-replies { padding:0 16px 12px; display:flex; flex-wrap:wrap; gap:7px; flex-shrink:0; }
    .sm-quick-btn { background:var(--accent-light,#ede8ff); border:1px solid rgba(87,0,239,0.2); color:var(--accent,#5700ef); padding:7px 13px; border-radius:100px; font-size:12px; font-weight:500; cursor:none; font-family:'DM Sans',sans-serif; transition:background 0.2s,transform 0.2s; white-space:nowrap; }
    .sm-quick-btn:hover { background:var(--accent,#5700ef); color:#fff; transform:translateY(-1px); }
    #sm-chat-input-area { padding:12px 16px 16px; border-top:1px solid var(--border,#ddd8f8); display:flex; gap:10px; align-items:flex-end; flex-shrink:0; background:var(--bg,#f8f7ff); }
    #sm-chat-input { flex:1; border:1.5px solid var(--border,#ddd8f8); border-radius:12px; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:300; color:var(--text,#0d0a1a); background:var(--card,#ffffff); resize:none; outline:none; transition:border-color 0.25s; max-height:100px; overflow-y:auto; line-height:1.5; cursor:text; }
    #sm-chat-input:focus { border-color:var(--accent,#5700ef); }
    #sm-chat-input::placeholder { color:var(--muted,#7a6f9a); }
    #sm-chat-send { width:38px; height:38px; background:var(--accent,#5700ef); border:none; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:none; flex-shrink:0; transition:background 0.25s,transform 0.2s; }
    #sm-chat-send:hover { background:var(--accent-hover,#4400cc); transform:scale(1.05); }
    #sm-chat-send:disabled { opacity:0.4; transform:none; }
    html.dark #sm-chat-window { background:var(--bg); border-color:var(--border); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
    html.dark .sm-msg.bot .sm-msg-bubble { background:var(--card); border-color:var(--border); color:var(--text); }
    html.dark #sm-chat-input { background:var(--card); color:var(--text); border-color:var(--border); }
    html.dark #sm-chat-input-area { background:var(--bg); }
    html.dark .sm-quick-btn { background:var(--accent-light); }
    html.dark #sm-chat-badge { border-color:var(--bg); }
    @media(max-width:900px){
      #sm-chat-window{left:12px;right:12px;width:auto;bottom:90px;height:70vh;max-height:500px;border-radius:16px;}
      #sm-chat-toggle{left:16px;bottom:24px;}
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button id="sm-chat-toggle" aria-label="Open portfolio assistant">
      <div id="sm-chat-badge" class="hidden">1</div>
      <svg class="icon-chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="icon-close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="sm-chat-window" role="dialog" aria-label="Portfolio Assistant">
      <div id="sm-chat-header">
        <div class="sm-avatar">SM</div>
        <div>
          <div class="sm-header-name">Sufiyan's Assistant</div>
          <div class="sm-header-status"><div class="sm-status-dot"></div>AI · Always online</div>
        </div>
        <button class="sm-header-close" id="sm-close-btn" aria-label="Close">✕</button>
      </div>
      <div id="sm-chat-messages"></div>
      <div id="sm-quick-replies"></div>
      <div id="sm-chat-input-area">
        <textarea id="sm-chat-input" rows="1" placeholder="Ask me anything…" maxlength="500"></textarea>
        <button id="sm-chat-send" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  let isOpen = false, isLoading = false;
  const history = [];
  const toggleBtn  = document.getElementById('sm-chat-toggle');
  const chatWindow = document.getElementById('sm-chat-window');
  const messagesEl = document.getElementById('sm-chat-messages');
  const inputEl    = document.getElementById('sm-chat-input');
  const sendBtn    = document.getElementById('sm-chat-send');
  const quickEl    = document.getElementById('sm-quick-replies');
  const badge      = document.getElementById('sm-chat-badge');
  const closeBtn   = document.getElementById('sm-close-btn');

  function toggleChat() {
    isOpen = !isOpen;
    toggleBtn.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen) { badge.classList.add('hidden'); if (!messagesEl.children.length) initChat(); setTimeout(() => inputEl.focus(), 400); }
  }
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  function initChat() {
    addMsg('bot', `Hi there! 👋 I'm Sufiyan's AI assistant. Ask me anything about his <strong>design services</strong>, <strong>process</strong>, <strong>projects</strong>, or <strong>availability</strong>.`);
    setQuick(['🎨 Services', '⚙️ Process', '💼 Projects', '⏱ Timeline', '📬 Contact']);
  }

  function addMsg(role, html) {
    const el = document.createElement('div');
    el.className = `sm-msg ${role}`;
    el.innerHTML = `<div class="sm-msg-avatar">${role==='bot'?'SM':'You'}</div><div class="sm-msg-bubble">${html}</div>`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'sm-msg bot'; el.id = 'sm-typing';
    el.innerHTML = `<div class="sm-msg-avatar">SM</div><div class="sm-msg-bubble"><div class="sm-typing"><span></span><span></span><span></span></div></div>`;
    messagesEl.appendChild(el); messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() { const t=document.getElementById('sm-typing'); if(t) t.remove(); }

  function setQuick(items) {
    quickEl.innerHTML = '';
    items.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'sm-quick-btn'; btn.textContent = text;
      btn.addEventListener('click', () => sendMessage(text));
      quickEl.appendChild(btn);
    });
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text || isLoading) return;
    quickEl.innerHTML = '';
    addMsg('user', text.replace(/</g,'&lt;'));
    history.push({ role:'user', content:text });
    inputEl.value = ''; autoResize();
    isLoading = true; sendBtn.disabled = true;
    showTyping();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      hideTyping();
      const reply = data.content?.[0]?.text || "Please email Sufiyan at sufiyanchhipa2600@gmail.com!";
      const fmt = reply.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
      addMsg('bot', fmt);
      history.push({ role:'assistant', content:reply });
      const low = text.toLowerCase();
      if (low.includes('service')||low.includes('offer')) setQuick(['⏱ Timeline','🛠 Tools','🤝 How to Start']);
      else if (low.includes('process')||low.includes('work')) setQuick(['💼 Projects','🤝 Start a Project','⏱ Timeline']);
      else if (low.includes('contact')||low.includes('hire')||low.includes('start')) setQuick(['📧 Email Sufiyan','💬 WhatsApp']);
      else setQuick(['🤝 Start a Project','💼 Projects','⚙️ Process']);
      document.querySelectorAll('.sm-quick-btn').forEach(btn => {
        if (btn.textContent==='📧 Email Sufiyan') btn.onclick=()=>{ window.location.href='mailto:sufiyanchhipa2600@gmail.com'; };
        if (btn.textContent==='💬 WhatsApp') btn.onclick=()=>{ window.open('https://wa.me/919726503619','_blank'); };
        if (btn.textContent==='💼 Projects') btn.onclick=()=>{ toggleChat(); document.getElementById('projects')?.scrollIntoView({behavior:'smooth'}); };
      });
    } catch(err) {
      hideTyping();
      addMsg('bot', `Connection error. Reach Sufiyan at <a href="mailto:sufiyanchhipa2600@gmail.com">sufiyanchhipa2600@gmail.com</a> or <a href="https://wa.me/919726503619" target="_blank">WhatsApp</a>.`);
    }
    isLoading = false; sendBtn.disabled = false;
  }

  inputEl.addEventListener('keydown', e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(inputEl.value);} });
  inputEl.addEventListener('input', autoResize);
  sendBtn.addEventListener('click', ()=>sendMessage(inputEl.value));
  function autoResize(){ inputEl.style.height='auto'; inputEl.style.height=Math.min(inputEl.scrollHeight,100)+'px'; }
  setTimeout(()=>{ if(!isOpen) badge.classList.remove('hidden'); }, 3000);
})();
