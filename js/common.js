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
  { key:'dashboard',        href:'index.html',            icon:'home',    label:'Dashboard' },
  // Gear Geometry
  { key:'spur-gear',        href:'spur-gear.html',         icon:'gear',    label:'Spur Gear',            section:'Gear Geometry' },
  { key:'helical-gear',     href:'helical-gear.html',      icon:'helical', label:'Helical Gear' },
  { key:'bevel-gear',       href:'bevel-gear.html',        icon:'bevel',   label:'Bevel Gear' },
  { key:'worm-gear',        href:'worm-gear.html',         icon:'worm',    label:'Worm Gear' },
  { key:'rack-pinion',      href:'rack-pinion.html',       icon:'rack',    label:'Rack & Pinion' },
  { key:'profile-shift',    href:'profile-shift.html',     icon:'shift',   label:'Profile Shift' },
  // Power & Drive
  { key:'power-torque',     href:'power-torque.html',      icon:'power',   label:'Power & Torque',       section:'Power & Drive' },
  { key:'gear-ratio',       href:'gear-ratio.html',        icon:'ratio',   label:'Gear Ratio' },
  // Design & Analysis
  { key:'stress',           href:'stress.html',            icon:'stress',  label:'Stress Analysis',      section:'Design & Analysis' },
  { key:'service',          href:'service-factor.html',    icon:'factor',  label:'Service Factor' },
  // Lubrication
  { key:'oil-viscosity',    href:'#', icon:'oil',     label:'Oil Viscosity',        section:'Lubrication', soon:true },
  { key:'thermal-rating',   href:'#', icon:'thermo',  label:'Thermal Rating',       soon:true },
  { key:'oil-volume',       href:'#', icon:'drum',    label:'Oil Volume',           soon:true },
  { key:'churning-loss',    href:'#', icon:'churn',   label:'Churning Loss',        soon:true },
  // Bearings
  { key:'bearing-life',     href:'#', icon:'bearing', label:'Bearing Life L10',     section:'Bearings',    soon:true },
  { key:'bearing-load',     href:'#', icon:'load',    label:'Bearing Load Analysis',soon:true },
  { key:'shaft-align',      href:'#', icon:'align',   label:'Shaft Alignment',      soon:true },
  // Shafts & Keys
  { key:'shaft-design',     href:'#', icon:'shaft',   label:'Shaft Design',         section:'Shafts & Keys',soon:true },
  { key:'critical-speed',   href:'#', icon:'vibrate', label:'Critical Speed',       soon:true },
  { key:'keyway-stress',    href:'#', icon:'key',     label:'Keyway Stress',        soon:true },
  { key:'torsional-stiff',  href:'#', icon:'twist',   label:'Torsional Stiffness',  soon:true },
  // Materials
  { key:'material-sel',     href:'#', icon:'material',label:'Material Selector',    section:'Materials',   soon:true },
  { key:'hardness-conv',    href:'#', icon:'hardness',label:'Hardness Converter',   soon:true },
  // Tools
  { key:'unit-conv',        href:'unit-converter.html',    icon:'convert', label:'Unit Converter',       section:'Tools' },
  { key:'guide',            href:'guide.html',             icon:'guide',   label:'Guide' },
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
    bevel:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 15V7.5L6.5 1H8L6 15H1zm7-11h1.5L15 8v7h-5L8 4z"/></svg>',
    worm:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 10C1 5.6 15 5.6 15 10v1H1v-1zm1 2h12v1c0 1.1-2.7 2-6 2S2 14.1 2 13v-1z"/></svg>',
    rack:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="10" width="16" height="4" rx="1"/><rect x="1" y="7" width="2" height="3"/><rect x="5" y="6" width="2" height="4"/><rect x="9" y="7" width="2" height="3"/><rect x="13" y="6" width="2" height="4"/></svg>',
    shift:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5 14V8H2l6-7 6 7h-3v6H5z"/><rect x="1" y="14" width="14" height="2" rx="1"/></svg>',
    oil:     '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l3 5H5L8 1zm-5 6h10l1 7H2L3 7z"/></svg>',
    thermo:  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="6" y="1" width="4" height="8" rx="2"/><circle cx="8" cy="12" r="3"/><rect x="7" y="5" width="2" height="5"/></svg>',
    drum:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="4" rx="6" ry="2"/><rect x="2" y="4" width="12" height="8"/><ellipse cx="8" cy="12" rx="6" ry="2"/></svg>',
    churn:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 2a4 4 0 110 8 4 4 0 010-8z"/><path d="M8 5v3l2 2"/></svg>',
    bearing: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="2" r="1.2"/><circle cx="8" cy="14" r="1.2"/><circle cx="2" cy="8" r="1.2"/><circle cx="14" cy="8" r="1.2"/></svg>',
    load:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 12h10M8 4v8M5 7l3-3 3 3"/></svg>',
    align:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="7" width="14" height="2" rx="1"/><circle cx="4" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    shaft:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="6" width="16" height="4" rx="2"/><rect x="1" y="4" width="4" height="8" rx="1"/><rect x="11" y="4" width="4" height="8" rx="1"/></svg>',
    vibrate: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 8h2M13 8h2M3 4l2 4-2 4M13 4l-2 4 2 4M6 2l2 12M8 2l2 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    key:     '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 9l6 5M11 11l1 2"/></svg>',
    twist:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5C2 5 4 3 8 3s6 2 6 2M2 11C2 11 4 13 8 13s6-2 6-2M5 3v10M11 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    material:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1" opacity=".6"/><rect x="1" y="9" width="6" height="6" rx="1" opacity=".6"/><rect x="9" y="9" width="6" height="6" rx="1" opacity=".3"/></svg>',
    hardness:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><polygon points="8,1 15,13 1,13"/><circle cx="8" cy="10" r="2"/></svg>',
  };
  return icons[type] || '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
}

/* ---- Gear logo SVG (8-tooth gear on teal bg) ---- */
const GEAR_LOGO_SVG = (function() {
  var s = '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">';
  s += '<rect width="32" height="32" rx="8" fill="#0DC8C8"/>';
  s += '<path fill-rule="evenodd" clip-rule="evenodd" d="';
  s += 'M 22.78,14.25 L 26.89,14.47 L 26.89,17.53 L 22.78,17.75 L 22.03,19.55 ';
  s += 'L 24.78,22.62 L 22.62,24.78 L 19.55,22.03 L 17.75,22.78 L 17.53,26.89 ';
  s += 'L 14.47,26.89 L 14.25,22.78 L 12.45,22.03 L 9.38,24.78 L 7.22,22.62 ';
  s += 'L 9.97,19.55 L 9.22,17.75 L 5.11,17.53 L 5.11,14.47 L 9.22,14.25 ';
  s += 'L 9.97,12.45 L 7.22,9.38 L 9.38,7.22 L 12.45,9.97 L 14.25,9.22 ';
  s += 'L 14.47,5.11 L 17.53,5.11 L 17.75,9.22 L 19.55,9.97 ';
  s += 'L 22.62,7.22 L 24.78,9.38 L 22.03,12.45 Z ';
  s += 'M 19.00,16.00 A 3,3 0 1 0 13.00,16.00 A 3,3 0 1 0 19.00,16.00 Z"';
  s += ' fill="#0a0a0a"/>';
  s += '</svg>';
  return s;
}());

/* ---- Build nav ---- */
function buildNav(activeKey) {
  var match = NAV.find(function(n) { return n.key === activeKey; });
  var pageName = match ? match.label : 'GearLab';

  var navHtml = NAV.map(function(n) {
    var sec = n.section ? '<div class="sidebar-section">' + n.section + '</div>' : '';
    var soonBadge = n.soon ? '<span class="nav-badge-soon">Soon</span>' : '';
    var cls = 'nav-item' + (activeKey === n.key ? ' active' : '') + (n.soon ? ' soon' : '');
    var href = n.soon ? '#' : n.href;
    var oc = n.soon ? ' onclick="return false"' : '';
    return sec
      + '<a href="' + href + '"' + oc + ' class="' + cls + '">'
      + '<span class="nav-icon">' + navIcon(n.icon) + '</span>'
      + n.label + soonBadge + '</a>';
  }).join('');

  var sidebar = '<nav class="sidebar">'
    + '<div class="sidebar-logo">' + GEAR_LOGO_SVG
    + '<div class="sidebar-logo-text"><span>Gear</span>Lab</div></div>'
    + navHtml
    + '<div class="sidebar-bottom">'
    + '<div class="sidebar-credit">Built by Suji Kumar C</div>'
    + '<a class="nav-item" onclick="toggleTheme();return false;" href="#">'
    + '<span class="nav-icon">' + navIcon('moon') + '</span>Toggle Theme</a>'
    + '</div></nav>';

  var topbar = '<div class="topbar">'
    + '<div class="topbar-left"><div class="topbar-breadcrumb">GearLab'
    + ' &nbsp;/&nbsp; <strong>' + pageName + '</strong></div></div>'
    + '<div class="topbar-actions">'
    + '<button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">'
    + navIcon('moon') + '</button></div></div>';

  document.body.insertAdjacentHTML('afterbegin', sidebar + topbar);
  if (!document.getElementById('toast-container')) {
    document.body.insertAdjacentHTML('beforeend', '<div id="toast-container"></div>');
  }
}

/* ---- Math helpers ---- */
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;
const round = (v, d = 3) => isNaN(v) || !isFinite(v) ? null : Math.round(v * 10**d) / 10**d;
const fmt = (v, d = 3) => v === null || v === undefined ? '—' : round(v, d);

/* ---- Toast ---- */
function toast(msg, type) {
  if (!type) type = 'pass';
  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

/* ---- Set result ---- */
function setResult(id, value, decimals) {
  if (decimals === undefined) decimals = 3;
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
