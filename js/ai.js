/* ===== GearLab — FORGE AI Widget ===== */
/* Floating engineering AI assistant. Injected by common.js on every page. */
/* Calls /api/gear-ai (Cloudflare Pages Function) with page context.       */

(function () {
  'use strict';

  // ── Page-specific suggested questions ─────────────────────────────────────
  var PAGE_QUESTIONS = {
    'dashboard':     ['⚙ How do I start a gear design?', '📐 Which module should I use for 50 kW?', '📋 Spur vs helical — when to choose?'],
    'spur-gear':     ['📐 What contact ratio is acceptable?', '⚙ Minimum teeth to avoid undercut?', '🔩 How does module affect gear size?'],
    'helical-gear':  ['📐 Best helix angle for smooth running?', '⚙ How do I convert normal to transverse module?', '🔩 Why do helical gears produce axial thrust?'],
    'bevel-gear':    ['📐 How is pitch cone angle calculated?', '⚙ What face width is recommended?', '🔩 When to use spiral vs straight bevel?'],
    'worm-gear':     ['📐 How do I check for self-locking?', '⚙ Why is worm gear efficiency so low?', '🔩 What lead angle gives best efficiency?'],
    'rack-pinion':   ['📐 How do I size a rack for a given force?', '⚙ What module for a precision linear drive?', '🔩 How to calculate stroke time?'],
    'profile-shift': ['📐 When must I use positive profile shift?', '⚙ How does profile shift affect backlash?', '🔩 What x value prevents undercut at z=14?'],
    'power-torque':  ['📐 How is tangential force related to torque?', '⚙ What is pitch-line velocity and why does it matter?', '🔩 How do I calculate axial force on helical gears?'],
    'gear-ratio':    ['📐 Maximum ratio per stage for spur gears?', '⚙ How to split ratio across multiple stages?', '🔩 Why does ratio affect efficiency?'],
    'stress':        ['📐 My bending stress is too high — fix?', '⚙ What KA value for a marine gearbox?', '🔩 Lewis vs ISO 6336 — what is the difference?'],
    'service':       ['📐 KA for ship auxiliary drives?', '⚙ What daily hours affect service factor?', '🔩 How does shock loading change KA?'],
  };

  var DEFAULT_QUESTIONS = ['⚙ How do I choose the right module?', '📐 What is the minimum teeth for no undercut?', '🔩 Which material for a marine gearbox?'];

  // ── Styles ─────────────────────────────────────────────────────────────────
  var CSS = `
    #forge-trigger {
      position: fixed; bottom: 24px; right: 20px; z-index: 9000;
      display: flex; align-items: center;
    }
    #forge-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 0 20px 0 16px; height: 48px; border-radius: 28px; border: none;
      background: linear-gradient(135deg, #00BFFF 0%, #0080FF 55%, #006699 100%);
      color: #fff; font-size: 13.5px; font-weight: 700; letter-spacing: 0.4px;
      cursor: pointer; white-space: nowrap;
      box-shadow: 0 6px 28px rgba(0,191,255,0.45), 0 10px 48px rgba(0,128,255,0.3);
      transition: all 0.3s cubic-bezier(0.34,1.4,0.64,1);
      font-family: inherit;
    }
    #forge-btn.open {
      padding: 0 18px; gap: 8px;
      background: rgba(10, 18, 30, 0.92);
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      border: 1px solid rgba(0,191,255,0.3);
    }
    #forge-ring1, #forge-ring2 {
      position: absolute; inset: -10px; border-radius: 40px; pointer-events: none;
      border: 2px solid rgba(0,191,255,0.4);
      animation: forgeRing 2.8s ease-out infinite;
    }
    #forge-ring2 { border-color: rgba(0,128,255,0.25); animation-delay: 1.4s; }

    #forge-panel {
      position: fixed; bottom: 88px; right: 20px; z-index: 8999;
      width: min(390px, calc(100vw - 32px)); height: 530px;
      display: flex; flex-direction: column;
      background: rgba(6, 10, 22, 0.92);
      backdrop-filter: blur(40px) saturate(200%);
      -webkit-backdrop-filter: blur(40px) saturate(200%);
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.75),
                  0 0 0 1px rgba(0,191,255,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.06);
      animation: forgePanelIn 0.35s cubic-bezier(0.34,1.4,0.64,1);
    }
    #forge-panel-border {
      position: absolute; inset: 0; border-radius: 20px; pointer-events: none;
      background: linear-gradient(135deg, rgba(0,191,255,0.4) 0%, rgba(0,128,255,0.3) 50%, rgba(0,102,153,0.2) 100%);
      padding: 1px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      z-index: 2;
    }

    #forge-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; flex-shrink: 0;
      background: rgba(10, 18, 35, 0.7);
      border-bottom: 1px solid rgba(0,191,255,0.12);
    }
    #forge-header-left { display: flex; align-items: center; gap: 11px; }
    #forge-avatar {
      width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #00BFFF 0%, #0080FF 60%, #006699 100%);
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      box-shadow: 0 4px 18px rgba(0,191,255,0.4);
    }
    #forge-name {
      font-size: 15px; font-weight: 800; letter-spacing: 0.6px;
      background: linear-gradient(90deg, #00BFFF 0%, #40D4FF 60%, #80DFFF 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; line-height: 1.2;
    }
    #forge-subtitle { font-size: 10.5px; color: #40D4FF; opacity: 0.75; font-weight: 500; }
    #forge-header-right { display: flex; align-items: center; gap: 8px; }
    #forge-online {
      display: flex; align-items: center; gap: 5px;
      font-size: 10px; color: #10B981; font-weight: 600;
    }
    #forge-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #10B981;
      box-shadow: 0 0 8px rgba(16,185,129,0.9);
      animation: forgeGreenPulse 2s ease-in-out infinite;
    }
    #forge-close {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: #94A3B8; cursor: pointer; font-size: 15px;
      width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-family: inherit;
    }

    #forge-messages {
      flex: 1; overflow-y: auto; padding: 14px 13px 0;
      display: flex; flex-direction: column; gap: 11px;
    }
    .forge-row { display: flex; align-items: flex-end; gap: 8px; }
    .forge-row.user { flex-direction: row-reverse; }
    .forge-mini-avatar {
      width: 27px; height: 27px; border-radius: 9px; flex-shrink: 0;
      background: linear-gradient(135deg, #00BFFF, #0080FF);
      display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .forge-bubble {
      max-width: 80%; padding: 10px 14px; font-size: 13px; line-height: 1.6;
      word-break: break-word; color: #EEF2FF;
    }
    .forge-bubble.user {
      border-radius: 15px 15px 3px 15px;
      background: linear-gradient(135deg, #00BFFF 0%, #0080FF 100%);
      box-shadow: 0 4px 18px rgba(0,191,255,0.28);
    }
    .forge-bubble.assistant {
      border-radius: 15px 15px 15px 3px;
      background: rgba(20, 35, 65, 0.8);
      border: 1px solid rgba(0,191,255,0.15);
      backdrop-filter: blur(6px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .forge-bullet { display: flex; gap: 8px; align-items: flex-start; margin-top: 5px; }
    .forge-bullet-marker { color: #00BFFF; flex-shrink: 0; line-height: 1.5; font-size: 14px; margin-top: 1px; }
    .forge-para { margin-top: 6px; }
    .forge-para:first-child { margin-top: 0; }
    .forge-bold { color: #00BFFF; font-weight: 700; }
    .forge-link { color: #40D4FF; text-decoration: underline; word-break: break-all; }
    .forge-code { font-family: monospace; background: rgba(0,191,255,0.12); padding: 1px 5px; border-radius: 4px; font-size: 12px; color: #80DFFF; }

    .forge-typing {
      display: flex; align-items: center; gap: 5px; padding: 11px 14px;
      background: rgba(20,35,65,0.8); border: 1px solid rgba(0,191,255,0.15);
      border-radius: 15px 15px 15px 3px;
    }
    .forge-dot-bounce {
      width: 7px; height: 7px; border-radius: 50%;
      background: linear-gradient(135deg, #00BFFF, #0080FF);
      animation: forgeBounce 1.2s ease-in-out infinite;
    }

    .forge-suggestions { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .forge-suggest-btn {
      background: rgba(0,191,255,0.08); border: 1px solid rgba(0,191,255,0.22);
      border-radius: 10px; padding: 8px 13px; color: #40D4FF;
      font-size: 12.5px; font-weight: 500; cursor: pointer; text-align: left;
      font-family: inherit; transition: all 0.15s;
    }
    .forge-suggest-btn:hover { background: rgba(0,191,255,0.16); }

    #forge-input-bar {
      display: flex; gap: 8px; padding: 12px 13px; flex-shrink: 0;
      background: rgba(8, 14, 28, 0.85);
      border-top: 1px solid rgba(0,191,255,0.12);
    }
    #forge-input {
      flex: 1; background: rgba(15, 25, 50, 0.85);
      border: 1px solid rgba(0,191,255,0.22); border-radius: 10px;
      padding: 9px 13px; color: #EEF2FF; font-size: 13px;
      outline: none; font-family: inherit;
    }
    #forge-input::placeholder { color: #4B6080; }
    #forge-send {
      width: 40px; height: 40px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #00BFFF, #0080FF);
      color: #fff; font-size: 17px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,191,255,0.35); flex-shrink: 0;
      transition: all 0.2s; font-family: inherit;
    }
    #forge-send:disabled { background: rgba(25,40,80,0.7); box-shadow: none; cursor: not-allowed; }

    @keyframes forgeRing {
      0%   { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.55); opacity: 0; }
    }
    @keyframes forgePanelIn {
      from { transform: translateY(16px) scale(0.95); opacity: 0; }
      to   { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes forgeBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
      40%            { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes forgeGreenPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `;

  // ── Markdown renderer ──────────────────────────────────────────────────────
  function parseInline(text) {
    // Split on **bold**, `code`, and URLs
    var parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/\S+)/g);
    return parts.map(function(part) {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        var span = document.createElement('strong');
        span.className = 'forge-bold';
        span.textContent = part.slice(2, -2);
        return span;
      }
      if (/^`[^`]+`$/.test(part)) {
        var code = document.createElement('code');
        code.className = 'forge-code';
        code.textContent = part.slice(1, -1);
        return code;
      }
      if (/^https?:\/\//.test(part)) {
        var a = document.createElement('a');
        a.className = 'forge-link';
        a.href = part; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = part;
        return a;
      }
      return document.createTextNode(part);
    });
  }

  function renderMessage(text, container) {
    var lines = text.split('\n');
    var first = true;
    lines.forEach(function(raw) {
      var trimmed = raw.trim();
      if (!trimmed) return;
      var isBullet = /^[\*\-•]\s+/.test(trimmed);
      if (isBullet) {
        var content = trimmed.replace(/^[\*\-•]\s+/, '');
        var row = document.createElement('div');
        row.className = 'forge-bullet';
        var marker = document.createElement('span');
        marker.className = 'forge-bullet-marker';
        marker.textContent = '›';
        var body = document.createElement('span');
        parseInline(content).forEach(function(n) { body.appendChild(n); });
        row.appendChild(marker);
        row.appendChild(body);
        container.appendChild(row);
      } else {
        var p = document.createElement('div');
        p.className = 'forge-para' + (first ? ' forge-para-first' : '');
        parseInline(trimmed).forEach(function(n) { p.appendChild(n); });
        container.appendChild(p);
      }
      first = false;
    });
  }

  // ── State ──────────────────────────────────────────────────────────────────
  var messages = [];
  var isOpen = false;
  var isLoading = false;
  var showSuggestions = true;

  // DOM refs
  var panel, msgList, inputEl, sendBtn, triggerRing1, triggerRing2, forgeBtn;
  var scrollAnchor;

  function getPageInfo() {
    var key = (window.GEARLAB_PAGE && window.GEARLAB_PAGE.key) || 'dashboard';
    var label = (window.GEARLAB_PAGE && window.GEARLAB_PAGE.label) || 'Dashboard';
    return { key: key, label: label };
  }

  function getQuestions() {
    var key = getPageInfo().key;
    return PAGE_QUESTIONS[key] || DEFAULT_QUESTIONS;
  }

  // ── Scroll ─────────────────────────────────────────────────────────────────
  function scrollBottom() {
    if (scrollAnchor) setTimeout(function() { scrollAnchor.scrollIntoView({ behavior: 'smooth' }); }, 30);
  }

  // ── Add message to UI ──────────────────────────────────────────────────────
  function addMessage(role, text) {
    var row = document.createElement('div');
    row.className = 'forge-row ' + role;

    if (role === 'assistant') {
      var avatar = document.createElement('div');
      avatar.className = 'forge-mini-avatar';
      avatar.textContent = '⚙';
      row.appendChild(avatar);
    }

    var bubble = document.createElement('div');
    bubble.className = 'forge-bubble ' + role;

    if (role === 'assistant') {
      renderMessage(text, bubble);
    } else {
      bubble.textContent = text;
    }

    row.appendChild(bubble);
    msgList.insertBefore(row, scrollAnchor);
    scrollBottom();
    return bubble;
  }

  // ── Typing indicator ───────────────────────────────────────────────────────
  var typingRow;
  function showTyping() {
    typingRow = document.createElement('div');
    typingRow.className = 'forge-row assistant';
    var avatar = document.createElement('div');
    avatar.className = 'forge-mini-avatar';
    avatar.textContent = '⚙';
    var indicator = document.createElement('div');
    indicator.className = 'forge-typing';
    [0, 1, 2].forEach(function(i) {
      var dot = document.createElement('span');
      dot.className = 'forge-dot-bounce';
      dot.style.animationDelay = (i * 0.2) + 's';
      indicator.appendChild(dot);
    });
    typingRow.appendChild(avatar);
    typingRow.appendChild(indicator);
    msgList.insertBefore(typingRow, scrollAnchor);
    scrollBottom();
  }
  function hideTyping() {
    if (typingRow && typingRow.parentNode) typingRow.parentNode.removeChild(typingRow);
    typingRow = null;
  }

  // ── Suggestions ────────────────────────────────────────────────────────────
  var suggestEl;
  function addSuggestions() {
    suggestEl = document.createElement('div');
    suggestEl.className = 'forge-suggestions';
    getQuestions().forEach(function(q) {
      var btn = document.createElement('button');
      btn.className = 'forge-suggest-btn';
      btn.textContent = q;
      btn.onclick = function() { send(q); };
      suggestEl.appendChild(btn);
    });
    msgList.insertBefore(suggestEl, scrollAnchor);
  }
  function removeSuggestions() {
    if (suggestEl && suggestEl.parentNode) suggestEl.parentNode.removeChild(suggestEl);
    suggestEl = null;
    showSuggestions = false;
  }

  // ── Send ───────────────────────────────────────────────────────────────────
  function send(text) {
    text = (text || inputEl.value).trim();
    if (!text || isLoading) return;
    inputEl.value = '';
    removeSuggestions();

    messages.push({ role: 'user', content: text });
    addMessage('user', text);

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    var page = getPageInfo();

    fetch('/api/gear-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.slice(), page: page }),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        hideTyping();
        var reply = data.reply || 'Sorry, something went wrong.';
        messages.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
      })
      .catch(function() {
        hideTyping();
        addMessage('assistant', 'Connection error. Please try again.');
      })
      .finally(function() {
        isLoading = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  // ── Toggle panel ───────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.style.display = 'flex';
    forgeBtn.classList.add('open');
    forgeBtn.innerHTML = '<span style="font-size:16px">✕</span><span>Close</span>';
    if (triggerRing1) { triggerRing1.style.display = 'none'; triggerRing2.style.display = 'none'; }
    setTimeout(function() { inputEl.focus(); }, 150);
  }

  function closePanel() {
    isOpen = false;
    panel.style.display = 'none';
    forgeBtn.classList.remove('open');
    forgeBtn.innerHTML = '<span style="font-size:18px">⚙</span><span>Ask FORGE</span>';
    if (triggerRing1) { triggerRing1.style.display = ''; triggerRing2.style.display = ''; }
  }

  // ── Build UI ───────────────────────────────────────────────────────────────
  function build() {
    // Inject styles
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Panel
    panel = document.createElement('div');
    panel.id = 'forge-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'FORGE — GearLab Engineering AI');
    panel.style.display = 'none';

    // Border ring
    var border = document.createElement('div');
    border.id = 'forge-panel-border';
    panel.appendChild(border);

    // Header
    var header = document.createElement('div');
    header.id = 'forge-header';

    var headerLeft = document.createElement('div');
    headerLeft.id = 'forge-header-left';

    var avatar = document.createElement('div');
    avatar.id = 'forge-avatar';
    avatar.textContent = '⚙';

    var nameWrap = document.createElement('div');
    var nameEl = document.createElement('div');
    nameEl.id = 'forge-name';
    nameEl.textContent = 'FORGE';
    var subEl = document.createElement('div');
    subEl.id = 'forge-subtitle';
    subEl.textContent = 'GearLab Engineering AI';
    nameWrap.appendChild(nameEl);
    nameWrap.appendChild(subEl);

    headerLeft.appendChild(avatar);
    headerLeft.appendChild(nameWrap);

    var headerRight = document.createElement('div');
    headerRight.id = 'forge-header-right';

    var onlineDiv = document.createElement('div');
    onlineDiv.id = 'forge-online';
    var dot = document.createElement('div');
    dot.id = 'forge-dot';
    onlineDiv.appendChild(dot);
    onlineDiv.appendChild(document.createTextNode('Online'));

    var closeBtn = document.createElement('button');
    closeBtn.id = 'forge-close';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close FORGE');
    closeBtn.onclick = closePanel;

    headerRight.appendChild(onlineDiv);
    headerRight.appendChild(closeBtn);

    header.appendChild(headerLeft);
    header.appendChild(headerRight);
    panel.appendChild(header);

    // Messages list
    msgList = document.createElement('div');
    msgList.id = 'forge-messages';
    scrollAnchor = document.createElement('div');
    scrollAnchor.style.height = '10px';
    msgList.appendChild(scrollAnchor);
    panel.appendChild(msgList);

    // Input bar
    var inputBar = document.createElement('div');
    inputBar.id = 'forge-input-bar';

    inputEl = document.createElement('input');
    inputEl.id = 'forge-input';
    inputEl.type = 'text';
    inputEl.placeholder = 'Ask FORGE anything…';
    inputEl.setAttribute('aria-label', 'Engineering question');
    inputEl.onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    sendBtn = document.createElement('button');
    sendBtn.id = 'forge-send';
    sendBtn.setAttribute('aria-label', 'Send');
    sendBtn.textContent = '↑';
    sendBtn.onclick = function() { send(); };

    inputBar.appendChild(inputEl);
    inputBar.appendChild(sendBtn);
    panel.appendChild(inputBar);

    document.body.appendChild(panel);

    // Floating trigger
    var trigger = document.createElement('div');
    trigger.id = 'forge-trigger';

    triggerRing1 = document.createElement('div');
    triggerRing1.id = 'forge-ring1';
    triggerRing2 = document.createElement('div');
    triggerRing2.id = 'forge-ring2';

    forgeBtn = document.createElement('button');
    forgeBtn.id = 'forge-btn';
    forgeBtn.setAttribute('aria-label', 'Open FORGE — GearLab AI');
    forgeBtn.innerHTML = '<span style="font-size:18px">⚙</span><span>Ask FORGE</span>';
    forgeBtn.onclick = function() { isOpen ? closePanel() : openPanel(); };

    trigger.appendChild(triggerRing1);
    trigger.appendChild(triggerRing2);
    trigger.appendChild(forgeBtn);
    document.body.appendChild(trigger);

    // Welcome message + suggestions
    addMessage('assistant', 'Hey! I\'m FORGE — GearLab\'s engineering AI. I know ISO 6336, AGMA 2001, gear formulas, materials, and service factors inside out. Ask me anything about your design. ⚙️');
    addSuggestions();
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

})();
