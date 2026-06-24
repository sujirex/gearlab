/* ===== GearLab — Shared Nav & Utilities ===== */

/* ---- Theme ---- */
function initTheme() {
  const saved = localStorage.getItem('gearlab-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', cur);
  localStorage.setItem('gearlab-theme', cur);
}
initTheme();

/* ---- Nav definition ---- */
const NAV = [
  { key:'dashboard',    href:'index.html',         icon:'home',     label:'Dashboard' },
  { key:'spur-gear',    href:'spur-gear.html',      icon:'gear',     label:'Spur Gear' },
  { key:'helical-gear', href:'helical-gear.html',   icon:'helical',  label:'Helical Gear',  soon:true },
  { key:'power-torque', href:'power-torque.html',   icon:'power',    label:'Power & Torque' },
  { key:'gear-ratio',   href:'gear-ratio.html',     icon:'ratio',    label:'Gear Ratio' },
  { key:'stress',       href:'stress.html',         icon:'stress',   label:'Stress Analysis', soon:true },
  { key:'service',      href:'service-factor.html', icon:'factor',   label:'Service Factor',  soon:true },
  { key:'unit-conv',    href:'unit-converter.html', icon:'convert',  label:'Unit Converter' },
  { key:'guide',        href:'guide.html',          icon:'guide',    label:'Guide' },
];

/* ---- SVG Icons ---- */
function navIcon(type) {
  const icons = {
    home:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 7v8h4v-4h6v4h4V7L8 1z"/></svg>',
    gear:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.1 0l-.4 1.6a5.5 5.5 0 00-1.4.6L3.8 1.4 1.4 3.8l.8 1.5a5.5 5.5 0 00-.6 1.4L0 7.1v1.8l1.6.4c.2.5.4.9.6 1.4l-.8 1.5 2.4 2.4 1.5-.8c.4.2.9.4 1.4.6l.4 1.6h1.8l.4-1.6c.5-.2.9-.4 1.4-.6l1.5.8 2.4-2.4-.8-1.5c.2-.4.4-.9.6-1.4l1.6-.4V7.1l-1.6-.4a5.5 5.5 0 00-.6-1.4l.8-1.5L12.2 1.4l-1.5.8A5.5 5.5 0 009.3 1.6L8.9 0H7.1zM8 5.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"/></svg>',
    helical: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 13L6 3h2L4 13H2zm6 0l4-10h2L10 13H8z"/></svg>',
    power:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 1L2 9h4l-1 6 7-9H8l2-5H6z"/></svg>',
    ratio:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="4" cy="8" r="3"/><circle cx="12" cy="8" r="2"/><line x1="7" y1="8" x2="10" y2="8" stroke="currentColor" stroke-width="1.5"/></svg>',
    stress:  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1v14M4 4l4-3 4 3M4 12l4 3 4-3"/></svg>',
    factor:  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="2" rx="1"/><rect x="1" y="7" width="10" height="2" rx="1"/><rect x="1" y="11" width="12" height="2" rx="1"/></svg>',
    convert: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2l3 3-3 3V6H5V4h6V2zM5 14l-3-3 3-3v2h6v2H5v2z"/></svg>',
    guide:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h10a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1zm1 3v1h8V4H4zm0 3v1h8V7H4zm0 3v1h5v-1H4z"/></svg>',
    moon:    '<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M2.9 0.5C1.8 2.2 1.2 4.1 1.2 6c0 3.7 2.3 6.9 5.6 8.2.4.2.8-.2.7-.7C6.8 12.1 6.5 10.5 6.5 9c0-4.1 3-7.5 7-7.9.5 0 .7-.6.4-1C12.4.5 11.2 0 10 0 6.7 0 4 1.8 2.9.5z"/></svg>',
    sun:     '<svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><circle cx="7.5" cy="7.5" r="3"/><path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3 3l1.5 1.5M10.5 10.5L12 12M3 12l1.5-1.5M10.5 4.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };
  return icons[type] || '';
}

/* ---- Gear logo SVG (8-tooth gear on neon blue) ---- */
const GEAR_LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#00BFFF"/>
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M 22.78,14.25 L 26.89,14.47 L 26.89,17.53 L 22.78,17.75 L 22.03,19.55 L 24.78,22.62 L 22.62,24.78 L 19.55,22.03 L 17.75,22.78 L 17.53,26.89 L 14.47,26.89 L 14.25,22.78 L 12.45,22.03 L 9.38,24.78 L 7.22,22.62 L 9.97,19.55 L 9.22,17.75 L 5.11,17.53 L 5.11,14.47 L 9.22,14.25 L 9.97,12.45 L 7.22,9.38 L 9.38,7.22 L 12.45,9.97 L 14.25,9.22 L 14.47,5.11 L 17.53,5.11 L 17.75,9.22 L 19.55,9.97 L 22.62,7.22 L 24.78,9.38 L 22.03,12.45 Z
    M 19.00,16.00 A 3,3 0 1 0 13.00,16.00 A 3,3 0 1 0 19.00,16.00 Z"
    fill="#0a0a0a"/>
</svg>`;

/* ---- Build nav ---- */
function buildNav(activeKey) {
  const pageName = NAV.find(n => n.key === activeKey)?.label || 'GearLab';
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const navHtml = NAV.map(n => {
    const soonBadge = n.soon ? '<span class="nav-badge-soon">Soon</span>' : '';
    const cls = `nav-item ${activeKey === n.key ? 'active' : ''} ${n.soon ? 'soon' : ''}`;
    const href = n.soon ? '#' : n.href;
    const onclick = n.soon ? 'onclick="return false"' : '';
    return `<a href="${href}" ${onclick} class="${cls}">
      <span class="nav-icon">${navIcon(n.icon)}</span>${n.label}${soonBadge}
    </a>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="sidebar">
      <div class="sidebar-logo">
        ${GEAR_LOGO_SVG}
        <div class="sidebar-logo-text"><span>Gear</span>Lab</div>
      </div>
      <div class="sidebar-section">Calculators</div>
      ${navHtml}
      <div class="sidebar-bottom">
        <div class="sidebar-credit">Built by Suji Kumar C</div>
        <a class="nav-item" onclick="toggleTheme();return false;" href="#">
          <span class="nav-icon">${navIcon('moon')}</span>Toggle Theme
        </a>
      </div>
    </nav>
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">GearLab &nbsp;/&nbsp; <strong>${pageName}</strong></div>
      </div>
      <div class="topbar-actions">
        <span style="font-size:11px;color:var(--primary);background:var(--neon-bg);padding:3px 10px;border:1px solid rgba(0,191,255,.25);border-radius:20px;font-weight:700">gearlab.sujikumar.com</span>
        <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">${navIcon('moon')}</button>
      </div>
    </div>
  `);
  document.getElementById('toast-container') ||
    document.body.insertAdjacentHTML('beforeend', '<div id="toast-container"></div>');
}

/* ---- Math helpers ---- */
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;
const round = (v, d = 3) => isNaN(v) || !isFinite(v) ? null : Math.round(v * 10**d) / 10**d;
const fmt = (v, d = 3) => v === null || v === undefined ? '—' : round(v, d);

/* ---- Toast ---- */
function toast(msg, type = 'pass') {
  const c = document.getElementById('toast-container'); if (!c) return;
  const el = document.createElement('div'); el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el); setTimeout(() => el.remove(), 3000);
}

/* ---- Set result ---- */
function setResult(id, value, decimals = 3) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    el.textContent = '—';
    el.classList.add('result-empty');
  } else {
    el.textContent = fmt(value, decimals);
    el.classList.remove('result-empty');
  }
}
