var APP_VER_DEFAULT = '10.0.0.166';

var PALETTES = {
  'Soft Black Pink': {bg:'#141016', card:'#211a24', border:'#5a3a52', accent:'#ff9ccf', text:'#f6ecf3', soft:'#b9a3b3'},
  'Midnight Violet': {bg:'#17121f', card:'#241b33', border:'#4b3a6b', accent:'#c9a7ff', text:'#f1eaff', soft:'#a99bc4'},
  'Navy Rose':       {bg:'#0f1724', card:'#182235', border:'#3a4a6b', accent:'#ff8fab', text:'#eef2fb', soft:'#9fb0cf'},
  'Crimson Noir':    {bg:'#120b0d', card:'#1e1215', border:'#5a2430', accent:'#ff4d5e', text:'#f7e9ea', soft:'#b79a9d'},
  'Forest Moss':     {bg:'#0f1a15', card:'#172a21', border:'#2f5a45', accent:'#8fe3b0', text:'#e9f5ee', soft:'#9cbfaa'},
  'Sky Glass':       {bg:'#0e1a26', card:'#162838', border:'#2f5c80', accent:'#7fd0ff', text:'#e8f4fc', soft:'#9bb9cf'},
  'Paper Cream':     {bg:'#f3ead9', card:'#fffaf0', border:'#d8c7a5', accent:'#a4572b', text:'#2b2118', soft:'#7a6a55'}
};
var FONTS = {
  'Serif': 'Georgia,serif',
  'Clean sans': 'system-ui,sans-serif',
  'Typewriter': 'Courier,monospace',
  'Rounded': 'Trebuchet MS,sans-serif',
  'Classic': 'Palatino Linotype,Palatino,serif',
  'Handwritten': 'Brush Script MT,cursive',
  'Bold': 'Impact,Haettenschweiler,sans-serif'
};
var ROLES = [['bg','Page'],['card','Boxes'],['border','Lines'],['accent','Accent'],['text','Text'],['soft','Soft text']];
var SIDES = [['none','No border'],['full','Full box'],['left','Left'],['right','Right'],['top','Top'],['bottom','Under']];
var BCOLS = [['border','Lines'],['accent','Accent'],['soft','Soft'],['text','Text']];

function esc(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '”').replace(/'/g, '’')
    .replace(/\r?\n/g, '<br>');
}
function cleanUrl(u) {
  u = String(u || '').trim().replace(/['"<>\s]/g, '');
  return /^https?:\/\//i.test(u) ? u : '';
}
function lines(t) {
  return String(t || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
}
function pair(line) {
  var i = line.indexOf(':');
  if (i < 0) return [line, ''];
  return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
}
/* Custom HTML must follow the editor rules: single quotes only, no script/style/iframe, no classes. */
function cleanCustom(t) {
  var s = String(t == null ? '' : t).replace(/\r\n?/g, '\n');
  s = s.replace(/<\s*(script|style|iframe)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
       .replace(/<\s*\/?\s*(script|style|iframe)\b[^>]*>/gi, '')
       .replace(/<!--[\s\S]*?-->/g, '')
       .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
       .replace(/\sclass\s*=\s*("[^"]*"|'[^']*')/gi, '');
  s = s.replace(/(\s[\w:-]+)\s*=\s*"([^"]*)"/g, function (m, a, v) { return a + "='" + v.replace(/'/g, '&#39;') + "'"; });
  s = s.replace(/"/g, '&quot;');
  return s.trim();
}
/* ---- icon set (SVG, takes the text colour) ---- */
var ICONS = {
  'blocks': "<rect x='3.5' y='3.5' width='7' height='7' rx='2'/><rect x='13.5' y='3.5' width='7' height='7' rx='2'/><rect x='3.5' y='13.5' width='7' height='7' rx='2'/><path d='M17 13.5v7M13.5 17h7'/>",
  'check': "<path d='M5 12.5 10 17.5 19 7.5'/>",
  'close': "<path d='M6 6l12 12M18 6 6 18'/>",
  'code': "<path d='M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5.5l-3 13'/>",
  'copy': "<rect x='8.5' y='8.5' width='11' height='11' rx='2.5'/><path d='M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2'/>",
  'design': "<path d='M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 2-.9 2-1.9 0-1.5-1.2-1.7-1.2-2.9 0-1 .8-1.7 1.9-1.7h2.2a3.5 3.5 0 0 0 3.5-3.5C20.4 6.8 16.9 3.5 12 3.5z'/><circle cx='7.6' cy='11.6' r='1' fill='currentColor' stroke='none'/><circle cx='10' cy='7.6' r='1' fill='currentColor' stroke='none'/><circle cx='14.6' cy='7.4' r='1' fill='currentColor' stroke='none'/>",
  'down': "<path d='M12 5v14M6 13l6 6 6-6'/>",
  'download': "<path d='M12 4v11.5M7.6 11.1 12 15.5l4.4-4.4M4 18v.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V18'/>",
  'external': "<path d='M9 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V15M13 5h6v6M19 5l-8 8'/>",
  'guide': "<path d='M4 5.6A1.6 1.6 0 0 1 5.6 4H11v15H5.6A1.6 1.6 0 0 0 4 20.6V5.6zM20 5.6A1.6 1.6 0 0 0 18.4 4H13v15h5.4a1.6 1.6 0 0 1 1.6 1.6V5.6z'/>",
  'heart': "<path d='M12 20s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.3C19.5 15.4 12 20 12 20z'/>",
  'load-file': "<path d='M13.5 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z'/><path d='M13.5 3.5V9H19M12 17v-5M9.6 14.4 12 12l2.4 2.4'/>",
  'plus': "<path d='M12 5v14M5 12h14'/>",
  'preview': "<path d='M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z'/><circle cx='12' cy='12' r='3'/>",
  'publish': "<path d='M12 15.5V4M7.6 8.4 12 4l4.4 4.4M4 14.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5'/>",
  'sparkle': "<path d='M12 3.5Q13 11 20.5 12 13 13 12 20.5 11 13 3.5 12 11 11 12 3.5z'/>",
  'swipe': "<rect x='2.5' y='7' width='8' height='10' rx='2'/><rect x='13.5' y='7' width='8' height='10' rx='2'/><path d='M12 12h.01'/>",
  'trash': "<path d='M4.5 7h15M10 4h4M6.5 7l.8 11a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8l.8-11M10 11v5M14 11v5'/>",
  'up': "<path d='M12 19V5M6 11l6-6 6 6'/>"
};
function svgEl(name, size) {
  var w = document.createElement('span');
  w.className = 'ico';
  w.setAttribute('aria-hidden', 'true');
  w.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='" + size + "' height='" + size + "' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>" + (ICONS[name] || '') + '</svg>';
  return w;
}
/* ---- code colours for the Html view ---- */
function hlEsc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function hlStyle(v) { return hlEsc(v).replace(/([\w-]+)(\s*:)(?!\/\/)/g, '<span class="hl-p">$1</span>$2'); }
function hlTag(tag) {
  if (/^<!--/.test(tag) || /^<!/.test(tag)) return '<span class="hl-c">' + hlEsc(tag) + '</span>';
  var m = tag.match(/^(<\/?)([a-zA-Z][\w:-]*)([\s\S]*?)(\/?>)$/);
  if (!m) return hlEsc(tag);
  var out = '<span class="hl-x">' + hlEsc(m[1]) + '</span><span class="hl-t">' + hlEsc(m[2]) + '</span>';
  var rest = m[3], re = /(\s+)([^\s=\/>"']+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?/g, last = 0, a;
  while ((a = re.exec(rest))) {
    out += hlEsc(rest.slice(last, a.index)) + a[1] + '<span class="hl-a">' + hlEsc(a[2]) + '</span>';
    if (a[3] != null) {
      out += '<span class="hl-x">' + hlEsc(a[3]) + '</span>';
      var val = a[4], q = val.charAt(0);
      if ((q === '"' || q === "'") && /^style$/i.test(a[2])) out += '<span class="hl-v">' + q + hlStyle(val.slice(1, -1)) + q + '</span>';
      else out += '<span class="hl-v">' + hlEsc(val) + '</span>';
    }
    last = a.index + a[0].length;
  }
  out += hlEsc(rest.slice(last)) + '<span class="hl-x">' + hlEsc(m[4]) + '</span>';
  return out;
}
function highlightHtml(src) {
  var re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?[a-zA-Z][^>]*>/gi, out = '', last = 0, m;
  src = String(src);
  while ((m = re.exec(src))) { out += hlEsc(src.slice(last, m.index)) + hlTag(m[0]); last = m.index + m[0].length; }
  return out + hlEsc(src.slice(last));
}
function col(c, d) { return /^#[0-9a-fA-F]{6}$/.test(c) ? c : d; }
function fixColors(c) {
  var base = PALETTES['Soft Black Pink'], out = {};
  ROLES.forEach(function (r) { out[r[0]] = col(c && c[r[0]], base[r[0]]); });
  return out;
}
function fixRadius(r) { r = parseInt(r, 10); return isNaN(r) ? 14 : Math.max(0, Math.min(32, r)); }

/* ---- per-block style: font, border side, thickness, colour, rotation ---- */
var STYLE_DEF = {
  title:     {bside: 'full',   bw: 1, bcol: 'border'},
  story:     {bside: 'left',   bw: 4, bcol: 'accent'},
  character: {bside: 'top',    bw: 4, bcol: 'accent'},
  tap:       {bside: 'full',   bw: 1, bcol: 'border'},
  swipe:     {bside: 'full',   bw: 1, bcol: 'border'},
  image:     {bside: 'none',   bw: 2, bcol: 'accent'},
  quote:     {bside: 'left',   bw: 4, bcol: 'accent'},
  chips:     {bside: 'none',   bw: 1, bcol: 'border'},
  divider:   {bside: 'full',   bw: 1, bcol: 'border'},
  note:      {bside: 'none',   bw: 1, bcol: 'border'}
};
function defStyle(type) {
  var d = STYLE_DEF[type] || STYLE_DEF.note;
  return {font: '', bside: d.bside, bw: d.bw, bcol: d.bcol, rot: 0};
}
function fixStyle(s, type) {
  var d = defStyle(type), o = {}, w, rr;
  s = s || {};
  o.font = FONTS[s.font] ? s.font : '';
  o.bside = SIDES.some(function (x) { return x[0] === s.bside; }) ? s.bside : d.bside;
  w = parseInt(s.bw, 10); o.bw = isNaN(w) ? d.bw : Math.max(1, Math.min(8, w));
  o.bcol = BCOLS.some(function (x) { return x[0] === s.bcol; }) ? s.bcol : d.bcol;
  rr = parseFloat(s.rot); o.rot = isNaN(rr) ? 0 : Math.max(-10, Math.min(10, rr));
  return o;
}
/* css pieces shared by every block (border, font, rotation) */
function sx(o, p) {
  var s = o.st, parts = [], c = p[s.bcol] || p.border;
  if (s.bside === 'none') parts.push('border:0');
  else if (s.bside === 'full') parts.push('border:' + s.bw + 'px solid ' + c);
  else parts.push('border:0;border-' + s.bside + ':' + s.bw + 'px solid ' + c);
  if (s.font && FONTS[s.font]) parts.push('font-family:' + FONTS[s.font]);
  if (s.rot) {
    parts.push('transform:rotate(' + s.rot + 'deg)');
    if (!o.row) parts.push('width:94%;box-sizing:border-box;margin-left:auto;margin-right:auto');
  }
  return parts.join(';');
}

var BLOCKS = {
  title: {
    label: 'Title header',
    fields: [
      {k: 'kicker', l: 'Small line on top', d: 'a story about'},
      {k: 'name', l: 'Name or title', d: 'Character Name'},
      {k: 'tagline', l: 'Tagline', d: 'One line that sets the mood'}
    ],
    html: function (f, p, r, o) {
      return [
        "<div style='text-align:center;padding:22px 12px;margin:0 0 12px;border-radius:" + r + "px;background:" + p.card + ";" + sx(o, p) + "'>",
        "<div style='font-size:11px;letter-spacing:3px;text-transform:uppercase;color:" + p.soft + "'>" + esc(f.kicker) + "</div>",
        "<div style='font-size:28px;font-weight:bold;color:" + p.accent + ";margin:6px 0'>" + esc(f.name) + "</div>",
        "<div style='font-size:14px;color:" + p.soft + "'>" + esc(f.tagline) + "</div>",
        "</div>"
      ];
    }
  },
  story: {
    label: 'Story box',
    fields: [
      {k: 'title', l: 'Box title', d: 'The story'},
      {k: 'text', l: 'Text', d: 'Write the setup here. Who is this character, where does the story start, and what does the reader walk into?', m: 1}
    ],
    html: function (f, p, r, o) {
      return [
        "<div style='margin:" + (o.row ? '0' : '12px 0') + ";padding:14px;border-radius:" + r + "px;background:" + p.card + ";" + sx(o, p) + "'>",
        "<div style='font-size:12px;letter-spacing:2px;text-transform:uppercase;color:" + p.accent + "'>" + esc(f.title) + "</div>",
        "<div style='margin-top:8px'>" + esc(f.text) + "</div>",
        "</div>"
      ];
    }
  },
  character: {
    label: 'Character facts',
    multi: true,
    fields: [
      {k: 'title', l: 'Box title', d: 'Character'},
      {k: 'img', l: 'Picture (optional, direct image link)', d: ''},
      {k: 'rows', l: 'Rows (one per line, Label: value)', d: 'Name: Character Name\nAge: 18\nRole: Student\nLikes: Quiet places\nDislikes: Being rushed', m: 1}
    ],
    html: function (f, p, r, o) {
      var u = cleanUrl(f.img);
      var out = [
        "<div style='margin:" + (o.row ? '0' : '12px 0') + ";padding:14px;border-radius:" + r + "px;background:" + p.card + ";" + sx(o, p) + "'>",
        "<div style='font-size:12px;letter-spacing:2px;text-transform:uppercase;color:" + p.accent + ";margin-bottom:6px'>" + esc(f.title) + "</div>"
      ];
      if (u) out.push("<img src='" + u + "' style='width:100%;height:auto;display:block;border-radius:" + Math.max(0, r - 4) + "px;margin:4px 0 8px'>");
      lines(f.rows).forEach(function (ln) {
        var a = pair(ln);
        out.push("<div style='display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-top:1px solid " + p.border + "'><span style='color:" + p.soft + "'>" + esc(a[0]) + "</span><span style='text-align:right'>" + esc(a[1]) + "</span></div>");
      });
      out.push("</div>");
      return out;
    }
  },
  tap: {
    label: 'Tap-to-open',
    multi: true,
    fields: [
      {k: 'title', l: 'Button text', d: 'Tap to open'},
      {k: 'text', l: 'Hidden text', d: 'Anything long goes here: a scene, a secret, a note from the character.', m: 1}
    ],
    html: function (f, p, r, o) {
      return [
        "<details style='margin:" + (o.row ? '0' : '10px 0') + ";padding:12px 14px;border-radius:" + r + "px;background:" + p.card + ";" + sx(o, p) + "'>",
        "<summary style='cursor:pointer;font-weight:bold;color:" + p.accent + "'>" + esc(f.title) + "</summary>",
        "<div style='margin-top:8px'>" + esc(f.text) + "</div>",
        "</details>"
      ];
    }
  },
  swipe: {
    label: 'Swipe row of cards',
    fields: [
      {k: 'cards', l: 'Cards (one per line, Title: text)', d: 'Scene one: A short line about the first opening.\nScene two: A different place, a different mood.\nScene three: Something unexpected happens.', m: 1}
    ],
    html: function (f, p, r, o) {
      var out = ["<div style='display:flex;gap:10px;overflow-x:auto;padding:10px 4px 14px;margin:12px 0'>"];
      var co = {st: o.st, row: true};
      lines(f.cards).forEach(function (ln) {
        var a = pair(ln);
        out.push("<div style='flex:0 0 78%;box-sizing:border-box;padding:12px;border-radius:" + r + "px;background:" + p.card + ";" + sx(co, p) + "'>");
        out.push("<div style='font-weight:bold;color:" + p.accent + "'>" + esc(a[0]) + "</div>");
        out.push("<div style='margin-top:6px;font-size:14px'>" + esc(a[1]) + "</div>");
        out.push("</div>");
      });
      out.push("</div>");
      return out;
    }
  },
  image: {
    label: 'Image',
    multi: true,
    fields: [
      {k: 'url', l: 'Direct image link (starts with https)', d: ''},
      {k: 'caption', l: 'Caption (optional)', d: ''}
    ],
    hint: 'Paste a direct image link to see it here.',
    html: function (f, p, r, o) {
      var u = cleanUrl(f.url);
      if (!u) return [];
      var out = ["<img src='" + u + "' style='width:100%;height:auto;display:block;border-radius:" + r + "px;margin:" + (o.row ? '0 0 4px' : '12px 0 4px') + ";" + sx(o, p) + "'>"];
      if (String(f.caption || '').trim()) out.push("<div style='text-align:center;font-size:12px;color:" + p.soft + ";margin-bottom:8px'>" + esc(f.caption) + "</div>");
      return out;
    }
  },
  quote: {
    label: 'Quote',
    fields: [
      {k: 'text', l: 'Quote', d: 'A line the character would actually say.', m: 1},
      {k: 'who', l: 'Said by', d: 'Character Name'}
    ],
    html: function (f, p, r, o) {
      return [
        "<div style='margin:" + (o.row ? '0' : '12px 0') + ";padding:14px 16px;background:" + p.card + ";border-radius:" + r + "px;font-style:italic;" + sx(o, p) + "'>",
        "<div>" + esc(f.text) + "</div>",
        "<div style='margin-top:6px;font-size:13px;font-style:normal;color:" + p.soft + "'>" + esc(f.who) + "</div>",
        "</div>"
      ];
    }
  },
  chips: {
    label: 'Tag chips',
    fields: [
      {k: 'tags', l: 'Tags (separate with commas)', d: 'slowburn, school life, romance, drama'}
    ],
    html: function (f, p, r, o) {
      var out = ["<div style='margin:" + (o.row ? '0' : '12px 0') + ";padding:6px;border-radius:" + r + "px;text-align:center;" + sx(o, p) + "'>"];
      String(f.tags || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (t) {
        out.push("<span style='display:inline-block;margin:3px;padding:4px 12px;border-radius:999px;border:1px solid " + p.border + ";background:" + p.card + ";font-size:12px;color:" + p.accent + "'>" + esc(t) + "</span>");
      });
      out.push("</div>");
      return out;
    }
  },
  divider: {
    label: 'Divider',
    fields: [],
    styleOpts: ['bw', 'bcol', 'rot'],
    html: function (f, p, r, o) {
      var s = o.st, c = p[s.bcol] || p.border;
      return ["<hr style='border:0;border-top:" + s.bw + "px solid " + c + ";margin:16px 0" + (s.rot ? ';transform:rotate(' + s.rot + 'deg)' : '') + "'>"];
    }
  },
  note: {
    label: 'Small note or credits',
    fields: [
      {k: 'text', l: 'Text', d: 'Made with care. Image credits go here.', m: 1}
    ],
    html: function (f, p, r, o) {
      return ["<div style='margin:10px 0 2px;padding:4px;text-align:center;font-size:12px;color:" + p.soft + ";" + sx(o, p) + "'>" + esc(f.text) + "</div>"];
    }
  },
  custom: {
    label: 'Custom HTML block',
    styleOpts: [],
    fields: [
      {k: 'html', l: 'Paste your HTML (double quotes are converted to single quotes; script, style and iframe tags are removed)', d: "<div style='padding:16px;border-radius:14px;background:#182235;color:#eef2fb;text-align:center;'>Your custom content</div>", m: 1}
    ],
    html: function (f) {
      var s = cleanCustom(f.html);
      return s ? s.split('\n') : [];
    }
  }
};

/* ---- items: a block with one or more cells (more than one cell = swipe row) ---- */
function defaults(type) {
  var f = {};
  BLOCKS[type].fields.forEach(function (x) { f[x.k] = x.d; });
  return f;
}
function newItem(type) {
  return {type: type, cells: [defaults(type)], style: defStyle(type)};
}
function normItem(it) {
  if (!it || !BLOCKS[it.type]) return null;
  var b = BLOCKS[it.type];
  var cells = (it.cells && it.cells.length) ? it.cells : [it.f || defaults(it.type)];
  if (!b.multi) cells = [cells[0]];
  return {type: it.type, cells: cells, style: fixStyle(it.style, it.type)};
}
function starterItems() {
  return ['title', 'story', 'character', 'tap', 'swipe', 'quote', 'chips', 'divider', 'note'].map(newItem);
}
function wrapperOpen(state) {
  var p = fixColors(state.colors), r = fixRadius(state.radius);
  var font = FONTS[state.font] || FONTS['Serif'];
  return "<div style='padding:14px;background:" + p.bg + ";color:" + p.text + ";border-radius:" + (r + 4) + "px;font-family:" + font + ";line-height:1.6;font-size:15px'>";
}
function buildItem(item, state) {
  var b = BLOCKS[item.type];
  if (!b) return [];
  var p = fixColors(state.colors), r = fixRadius(state.radius), st = fixStyle(item.style, item.type);
  var cells = (item.cells && item.cells.length) ? item.cells : [{}];
  if (!b.multi || cells.length < 2) return b.html(cells[0] || {}, p, r, {st: st, row: false});
  var outs = [], first = null;
  cells.forEach(function (c) {
    var l = b.html(c, p, r, {st: st, row: true});
    if (l.length) { outs.push(l); if (!first) first = c; }
  });
  if (!outs.length) return [];
  if (outs.length === 1) return b.html(first, p, r, {st: st, row: false});
  var out = ["<div style='display:flex;gap:10px;" + (item.type === 'tap' ? 'align-items:flex-start;' : '') + "overflow-x:auto;padding:10px 4px 14px;margin:12px 0'>"];
  outs.forEach(function (l) {
    out.push("<div style='flex:0 0 78%;min-width:0'>");
    out = out.concat(l);
    out.push('</div>');
  });
  out.push('</div>');
  return out;
}
function buildPage(state) {
  var out = [wrapperOpen(state)];
  state.items.forEach(function (it) { out = out.concat(buildItem(it, state)); });
  out.push('</div>');
  return out.join('\n');
}

/* ---- splitting into parts on line boundaries ---- */
function splitParts(text, n, lastFrac) {
  var ls = text.match(/[^\n]*\n|[^\n]+$/g) || [];
  if (ls.length < n) n = Math.max(1, ls.length);
  var parts = [], idx = 0, p, per, cur, size;
  if (n === 1) return [text];
  per = (lastFrac == null) ? text.length / n : text.length * (1 - lastFrac) / (n - 1);
  for (p = 0; p < n - 1; p++) {
    cur = []; size = 0;
    while (idx < ls.length && (ls.length - idx) > (n - 1 - p)) {
      cur.push(ls[idx]); size += ls[idx].length; idx++;
      if (size >= per) break;
    }
    parts.push(cur.join(''));
  }
  parts.push(ls.slice(idx).join(''));
  if (parts.join('') !== text) throw new Error('split check failed');
  return parts;
}

/* ---- JAI Bio Publisher (console) parts, built from the character link ---- */
function parseCharId(s) {
  var m = String(s || '').match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return m ? m[0].toLowerCase() : '';
}
function fixAppVer(v) {
  v = String(v || '').trim();
  return /^[0-9A-Za-z._-]{1,30}$/.test(v) ? v : APP_VER_DEFAULT;
}
var PUB_CODE = String.raw`(async () => {
  const BASE    = "https://janitorai.com/hampter";
  const APP_VER = "%%APPVER%%";
  const SITEKEY = "0x4AAAAAAE0K8d5zr3n9VR9Q";
  const ACTION  = "character-save";
  const ID      = "%%ID%%";
  const HTML    = (window.__jai || []).join("");
  const HTML_LEN = %%LEN%%;
  const say = (m) => console.log("[JAI Bio Publisher] " + m);

  if (HTML.length !== HTML_LEN) {
    console.error("[JAI Bio Publisher] The bio is incomplete: got " + HTML.length + " of " + HTML_LEN +
      " characters. %%REPASTE%%");
    return;
  }

  function accessTokenFromCookies() {
    const jar = {};
    document.cookie.split("; ").forEach((c) => {
      const i = c.indexOf("=");
      if (i > 0) jar[c.slice(0, i)] = c.slice(i + 1);
    });
    const found = Object.keys(jar).find((k) => /^sb-.*-auth-token(\.\d+)?$/.test(k));
    if (!found) return null;
    const base = found.replace(/\.\d+$/, "");
    let raw = "";
    for (let i = 0; jar[base + "." + i] !== undefined; i++) raw += jar[base + "." + i];
    if (!raw) raw = jar[base] || "";
    if (!raw) return null;
    try {
      let payload;
      if (raw.startsWith("base64-")) {
        let b64 = raw.slice(7).replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4) b64 += "=";
        payload = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
      } else {
        payload = decodeURIComponent(raw);
      }
      return JSON.parse(payload).access_token || null;
    } catch (e) {
      return null;
    }
  }

  async function loadTurnstile() {
    if (window.turnstile) return window.turnstile;
    const tag = document.createElement("script");
    tag.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    tag.async = true;
    document.head.appendChild(tag);
    const started = Date.now();
    while (!window.turnstile) {
      if (Date.now() - started > 15000) throw new Error("The Cloudflare widget would not load. Reload janitorai.com and paste all parts again.");
      await new Promise((r) => setTimeout(r, 150));
    }
    return window.turnstile;
  }

  async function turnstileToken() {
    const turnstile = await loadTurnstile();
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);min-width:300px;min-height:80px;z-index:2147483647;background:#fff;padding:10px;border:3px solid #e8b56a;border-radius:12px;";
    document.body.appendChild(host);
    say("Solving the Cloudflare check. If a box appears in the middle of the screen, tap it.");
    try {
      return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timed out waiting for the check. Try again.")), 60000);
        turnstile.render(host, {
          sitekey: SITEKEY,
          action: ACTION,
          appearance: "always",
          callback: (t) => { clearTimeout(timer); resolve(t); },
          "error-callback": (e) => { clearTimeout(timer); reject(new Error("The check failed: " + e)); },
        });
      });
    } finally {
      host.remove();
    }
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "x-app-version": APP_VER,
      "x-character-turnstile-token": await turnstileToken(),
    };
    const token = accessTokenFromCookies();
    if (token) headers["Authorization"] = "Bearer " + token;
    say("Uploading the bio...");
    const res = await fetch(BASE + "/characters/" + ID, {
      method: "PATCH",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({ description: HTML }),
    });
    const text = await res.text();
    if (res.ok) {
      say("Published. Reload the character page (Ctrl+F5 or pull to refresh) to see it.");
    } else {
      console.error("[JAI Bio Publisher] HTTP " + res.status, text.slice(0, 600));
      say("JAI rejected it with HTTP " + res.status + " (see the line above).");
    }
  } catch (err) {
    console.error(err);
    say("Could not finish: " + err.message);
  }
})();
`;

function storeSnippet(piece, idx, n) {
  return (idx === 0 || n === 1 ? 'window.__jai = [];' : 'window.__jai = window.__jai || [];') + '\n' +
    'window.__jai[' + idx + '] = ' + JSON.stringify(piece) + ';\n' +
    'console.log("[JAI part ' + (idx + 1) + '/' + n + '] OK: stored", window.__jai[' + idx + '].length, "bio characters (expected ' + piece.length + ')");';
}
function repasteText(n) {
  if (n <= 1) return 'Paste this part again.';
  if (n === 2) return 'Paste part 1 again (same page, no reload), then paste this part.';
  var a = [], i;
  for (i = 1; i < n; i++) a.push(i);
  return 'Paste parts ' + a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] + ' again (same page, no reload), then paste this part.';
}
function publisherCode(id, len, n, appVer) {
  return PUB_CODE.split('%%APPVER%%').join(appVer).split('%%ID%%').join(id)
    .split('%%LEN%%').join(String(len)).split('%%REPASTE%%').join(repasteText(n));
}
function consoleParts(html, id, n, appVer) {
  n = Math.max(1, Math.min(100, parseInt(n, 10) || 1));
  appVer = fixAppVer(appVer);
  var ovStore = 330, pubLen = publisherCode(id, html.length, n, appVer).length + 700;
  var lastFrac = null, pieces, i, out = [];
  if (n > 1) {
    var T = (html.length + pubLen + n * ovStore) / n;
    lastFrac = Math.max(0.05, Math.min(0.5, (T - pubLen - ovStore) / html.length));
  }
  pieces = splitParts(html, n, lastFrac);
  n = pieces.length;
  for (i = 0; i < n - 1; i++) {
    out.push(
      '// JAI Bio Publisher - PART ' + (i + 1) + ' of ' + n + ' (stores a piece of the bio)\n' +
      '// Paste in the Console on your janitorai.com page (signed in), then press Enter.\n' +
      '// Keep the same page open (no reload) and paste the parts in order, 1 to ' + n + '.\n' +
      storeSnippet(pieces[i], i, n) + '\n');
  }
  out.push(
    '// JAI Bio Publisher - PART ' + n + ' of ' + n + ' (stores the last piece, then publishes the whole bio)\n' +
    '// Target: character ' + id + '\n' +
    '//\n' +
    '// What it does: joins the ' + n + ' stored piece' + (n === 1 ? '' : 's') + ', solves the site\'s own Cloudflare check in a small\n' +
    '// visible box (tap it if it asks), then sends ONE request to janitorai.com that replaces this\n' +
    '// character\'s bio (description). Your login is read from your own cookies for that one request\n' +
    '// and is not stored or sent anywhere else.\n' +
    '// If Chrome jumps to a "Paused in debugger" screen, just press Resume (F8); the upload carries on.\n' +
    storeSnippet(pieces[n - 1], n - 1, n) + '\n' +
    publisherCode(id, html.length, n, appVer));
  return out;
}

(function () {
  var KEY = 'jai-bio-kit-v2', OLD_KEY = 'jai-bio-kit-v1';
  var state = null, justAdded = -1, justCell = -1, popIdx = -1, pendingIdx = -1;

  function norm(o) {
    var items = (o.items || []).map(normItem).filter(Boolean);
    return {
      pal: o.pal || 'Soft Black Pink',
      colors: fixColors(o.colors),
      radius: fixRadius(o.radius),
      font: FONTS[o.font] ? o.font : 'Serif',
      items: items,
      link: typeof o.link === 'string' ? o.link : '',
      nparts: Math.max(1, Math.min(100, parseInt(o.nparts, 10) || 4)),
      appVer: fixAppVer(o.appVer),
      mode: (o.mode === 'html' && typeof o.raw === 'string' && o.raw) ? 'html' : 'editor',
      raw: (o.mode === 'html' && typeof o.raw === 'string') ? o.raw : '',
      rawDirty: !!o.rawDirty
    };
  }
  function load() {
    var k, s;
    try {
      for (k = 0; k < 2; k++) {
        s = localStorage.getItem(k === 0 ? KEY : OLD_KEY);
        if (s) {
          var o = JSON.parse(s);
          if (o && o.items && o.colors) return norm(o);
        }
      }
    } catch (e) {}
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  state = load() || norm({items: starterItems(), colors: PALETTES['Soft Black Pink']});

  /* ---- fill these in when your links are ready ---- */
  var VIDEO_LINKS = {android: 'https://youtu.be/38jj2heCAyk?is=_p5xdYwFEae215rl', pc: ''};
  var SOCIAL = {
    tiktok: 'https://www.tiktok.com/@maharthiha_thuranaing',
    jai: 'https://janitorai.com/profiles/0d03da2c-1220-4a4a-a62c-67f5ed94d023_profile-of-zeiam'
  };

  /* the bio that gets previewed, exported and published */
  /* minified code is one long line and cannot be split for pasting, so break after block-level closing tags (whitespace between blocks is invisible) */
  function breakBlocks(t) { return t.replace(/(<\/(?:div|details|summary|section|p|ul|ol|li|table|thead|tbody|tr|td|th|h[1-6]|blockquote|figure)>)[ \t]*(?=<)/gi, '$1\n'); }
  function getBio() { return state.mode === 'html' ? breakBlocks(cleanCustom(state.raw)) : buildPage(state); }

  function h(tag, props, kids) {
    var e = document.createElement(tag), k;
    props = props || {};
    for (k in props) {
      if (k === 'text') e.textContent = props[k];
      else if (k.slice(0, 2) === 'on') e[k] = props[k];
      else e.setAttribute(k, props[k]);
    }
    (kids || []).forEach(function (c) {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 1500);
  }
  function copyText(text, label) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { ta.setSelectionRange(0, text.length); document.execCommand('copy'); toast('Copied ' + label); }
      catch (e) { toast('Copy failed: long-press the code box'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast('Copied ' + label); }, fallback);
    } else fallback();
  }

  var app = document.getElementById('app');
  var tabs = h('nav', {'class':'studio-tabs', 'aria-label':'Studio navigation'});
  var workspace = h('div', {'class':'workspace floating-menu', id:'workspaceMenu', hidden:''});
  app.appendChild(tabs); app.appendChild(workspace);

  var panelDesign = h('div', {'class':'workspace-panel', 'data-panel':'design'});
  var panelBlocks = h('div', {'class':'workspace-panel', 'data-panel':'blocks'});
  var panelPublish = h('div', {'class':'workspace-panel', 'data-panel':'publish'});
  var panelLinks = h('div', {'class':'workspace-panel', 'data-panel':'menu'});
  [panelDesign,panelBlocks,panelPublish,panelLinks].forEach(function(p){ workspace.appendChild(p); });

  var secStyle = h('section'), secAdd = h('section'), secPage = h('section'), secCode = h('section'), secPreview = h('section');
  panelDesign.appendChild(secStyle);
  panelBlocks.appendChild(secAdd);
  panelPublish.appendChild(secCode);
  secPreview.className = 'preview-workspace';
  secPreview.hidden = true;
  app.appendChild(secPreview);
  /* The page editor is the permanent main workspace, outside the popup menu. */
  secPage.className = 'persistent-page-editor';
  app.appendChild(secPage);
  var panelLinksBuilt = false;

  var tabDefs = [
    ['design','design','Design','Colors & type'],
    ['blocks','blocks','Add Blocks','Build your bio'],
    ['publish','publish','Publish','Export & publish'],
    ['preview','preview','Preview','View your page'],
    ['menu','guide','Menu','Guide & links']
  ];
  var openTab = null, previewMode = false, hideTimer = null, resizeTimer = null;
  var tabEls = {};
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
  function tabIndex(key){ for (var i = 0; i < tabDefs.length; i++) if (tabDefs[i][0] === key) return i; return -1; }

  var glider = h('span', {'class':'tab-glider', 'aria-hidden':'true'});
  tabs.appendChild(glider);
  var scrim = h('div', {'class':'scrim'});
  /* inside the app shell, so it sits under the dock and popup (they share that stacking layer) */
  (document.querySelector('.app-shell') || document.body).appendChild(scrim);

  var menuTitle = h('strong'), menuSub = h('small');
  var menuHead = h('div', {'class':'menu-head'}, [
    h('div', {'class':'menu-head-copy'}, [menuTitle, menuSub]),
    h('button', {'class':'menu-close', type:'button', 'aria-label':'Close menu', onclick:function(){ closeMenu(true); }}, [svgEl('close',18)])
  ]);
  /* no header bar: tap the tab again, tap outside, or press Escape to close */
  workspace.setAttribute('role', 'dialog');
  workspace.setAttribute('aria-label', 'Studio menu');
  workspace.tabIndex = -1;

  function currentKey(){ return previewMode ? 'preview' : openTab; }
  function placeGlider(key){
    var el = key ? tabEls[key] : null;
    if (!el) { glider.classList.remove('on'); return; }
    var first = !glider.classList.contains('on');
    if (first) glider.style.transition = 'none';
    glider.style.width = el.offsetWidth + 'px';
    glider.style.height = el.offsetHeight + 'px';
    glider.style.top = el.offsetTop + 'px';
    glider.style.transform = 'translateX(' + el.offsetLeft + 'px)';
    if (first) { void glider.offsetWidth; glider.style.transition = ''; glider.classList.add('on'); }
  }
  function setActiveTab(key){
    Array.prototype.forEach.call(tabs.querySelectorAll('[data-tab]'), function(b){
      var active = b.getAttribute('data-tab') === key;
      b.classList.toggle('active', active);
      b.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    placeGlider(key);
  }
  window.addEventListener('resize', function(){ placeGlider(currentKey()); });

  function closeMenu(returnFocus, keepActive){
    var prevKey = openTab;
    openTab = null;
    scrim.classList.remove('on');
    workspace.classList.remove('is-open');
    clearTimeout(hideTimer);
    if (reduceMotion.matches) workspace.hidden = true;
    else hideTimer = setTimeout(function(){ if (openTab === null) workspace.hidden = true; }, 210);
    if (!previewMode && !keepActive) setActiveTab(null);
    if (prevKey) {
      if (returnFocus && tabEls[prevKey]) { try { tabEls[prevKey].focus({preventScroll:true}); } catch (e) {} }
      if (pendingIdx >= 0) {
        var idx = pendingIdx; pendingIdx = -1;
        setTimeout(function(){
          var el = secPage.querySelectorAll('.item')[idx];
          if (!el || secPage.hidden) return;
          el.scrollIntoView({behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center'});
          el.classList.add('item-flash');
          setTimeout(function(){ el.classList.remove('item-flash'); }, 1400);
        }, 160);
      }
    }
  }
  function smoothResize(from){
    clearTimeout(resizeTimer);
    workspace.classList.remove('is-resizing');
    workspace.style.height = '';
    var to = workspace.offsetHeight;
    if (!from || Math.abs(from - to) < 4 || reduceMotion.matches) return;
    workspace.style.height = from + 'px';
    void workspace.offsetHeight;
    workspace.classList.add('is-resizing');
    workspace.style.height = to + 'px';
    resizeTimer = setTimeout(function(){ workspace.classList.remove('is-resizing'); workspace.style.height = ''; }, 360);
  }
  function toggleMenu(key){
    if (key === 'preview') {
      if (previewMode) {
        previewMode = false;
        secPreview.hidden = true;
        secPage.hidden = false;
        setActiveTab(null);
        return;
      }
      closeMenu(false, true);
      previewMode = true;
      secPage.hidden = true;
      secPreview.hidden = false;
      setActiveTab('preview');
      window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
      return;
    }
    if (previewMode) {
      previewMode = false;
      secPreview.hidden = true;
      secPage.hidden = false;
    }
    if (openTab === key) { closeMenu(true); return; }
    var prevKey = openTab, wasOpen = prevKey !== null;
    var from = wasOpen ? workspace.offsetHeight : 0;
    openTab = key;
    clearTimeout(hideTimer);
    workspace.style.setProperty('--dir', wasOpen ? (tabIndex(key) > tabIndex(prevKey) ? 1 : -1) : 0);
    var def = tabDefs[tabIndex(key)];
    menuTitle.textContent = def[2]; menuSub.textContent = def[3];
    workspace.setAttribute('aria-label', def[2] + ' menu');
    Array.prototype.forEach.call(workspace.children, function(p){
      if (!p.hasAttribute('data-panel')) return;
      p.hidden = p.getAttribute('data-panel') !== key;
    });
    workspace.scrollTop = 0;
    setActiveTab(key);
    workspace.hidden = false;
    var tr = tabEls[key].getBoundingClientRect();
    var left = workspace.offsetLeft - workspace.offsetWidth / 2;
    workspace.style.setProperty('--ox', Math.max(28, Math.min(workspace.offsetWidth - 28, tr.left + tr.width / 2 - left)) + 'px');
    scrim.classList.add('on');
    if (wasOpen) smoothResize(from);
    requestAnimationFrame(function(){ workspace.classList.add('is-open'); });
    if (!wasOpen) { try { workspace.focus({preventScroll:true}); } catch (e) {} }
  }
  tabDefs.forEach(function(d){
    var btn = h('button', {'class':'studio-tab','type':'button','data-tab':d[0],'aria-expanded':'false',onclick:function(){toggleMenu(d[0]);}},[
      h('span',{'class':'tab-icon'},[svgEl(d[1],20)]),
      h('span',{'class':'tab-copy'},[h('strong',{text:d[2]}),h('small',{text:d[3]})])
    ]);
    tabEls[d[0]] = btn;
    tabs.appendChild(btn);
  });
  document.addEventListener('click',function(ev){
    if (openTab && !workspace.contains(ev.target) && !tabs.contains(ev.target) && !(ev.target.closest && ev.target.closest('.modal-back'))) closeMenu();
  });
  document.addEventListener('keydown',function(ev){
    if (ev.key === 'Escape' && !document.querySelector('.modal-back')) closeMenu(true);
  });

  /* ---- banner: visible for a few seconds, then folds away ---- */
  var hero = document.getElementById('hero');
  function hideHero(){
    if (!hero || hero.getAttribute('data-gone')) return;
    hero.setAttribute('data-gone', '1');
    if (reduceMotion.matches) { hero.style.display = 'none'; return; }
    hero.style.height = hero.offsetHeight + 'px';
    void hero.offsetHeight;
    hero.classList.add('is-leaving');
    setTimeout(function(){ hero.style.display = 'none'; }, 560);
  }
  if (hero) {
    setTimeout(hideHero, 4500);
    hero.addEventListener('click', hideHero);
  }
  document.body.classList.add('booting');
  setTimeout(function(){ document.body.classList.remove('booting'); }, 1300);

  /* ---- confirm pop-up ---- */
  function confirmBox(title, msg, okText, onOk){
    var back = h('div', {'class':'modal-back'});
    var cancel = h('button', {type:'button', text:'Cancel'});
    var ok = h('button', {type:'button', 'class':'danger', text:okText});
    var box = h('div', {'class':'modal', role:'alertdialog', 'aria-modal':'true', 'aria-label':title}, [
      h('h3', {text:title}), h('p', {text:msg}), h('div', {'class':'modal-actions'}, [cancel, ok])
    ]);
    back.appendChild(box);
    document.body.appendChild(back);
    function close(){
      document.removeEventListener('keydown', onKey, true);
      back.classList.remove('on');
      setTimeout(function(){ if (back.parentNode) back.parentNode.removeChild(back); }, reduceMotion.matches ? 0 : 240);
    }
    function onKey(ev){ if (ev.key === 'Escape') { ev.stopPropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    cancel.onclick = close;
    ok.onclick = function(){ close(); onOk(); };
    back.addEventListener('click', function(ev){ if (ev.target === back) close(); });
    requestAnimationFrame(function(){ back.classList.add('on'); try { cancel.focus({preventScroll:true}); } catch (e) {} });
  }

  /* ---- Menu tab: guide, videos, follow, credits ---- */
  var GUIDE = {
    android: [
      ['Open Kiwi Browser', 'Install Kiwi Browser from the Play Store, open janitorai.com and log in.'],
      ['Copy your character link', 'Open the character you want to update (it has to be one of yours) and copy the link from the address bar.'],
      ['Paste it in Publish', 'Come back to this studio, open Publish and paste the link into "Character link". It should say "Character id found".'],
      ['Copy the parts', 'Choose how many parts you want. Android can\'t copy and paste too much text at once, so if a paste gets cut off, add more parts. Then tap "Copy part 1".'],
      ['Open the Console', 'Go back to the character page in Kiwi. Open the menu (the three dots), choose Developer tools, then open the Console.'],
      ['Paste each part in order', 'Paste part 1 into the Console and press Enter (the arrow key at the bottom right of your keyboard). Then come back, copy part 2, paste it and press Enter. Keep going until the last part. Do not reload the page in between. (With Gboard you can skip the back and forth, see Good to know below.)'],
      ['Wait for Sources, then pass the human check', 'After you paste and run the last part, DevTools jumps from Console to the Sources tab. That is normal. Go back to the character page, and a small "verify you are human" box appears in the middle of the screen. Tap it and wait a few seconds until it finishes. If nothing seems to happen, go back to Sources and tap Resume.'],
      ['Refresh and check', 'Refresh the character page. Your new bio is live. Done!']
    ],
    pc: [
      ['Open your character', 'On janitorai.com, signed in, open the character you want to update (it has to be one of yours) and copy the link from the address bar.'],
      ['Paste it in Publish', 'Come back to this studio, open Publish and paste the link into "Character link". It should say "Character id found".'],
      ['Copy the code', 'One part is fine on a computer. Set the parts to 1 and tap "Copy part 1".'],
      ['Open the Console', 'On the character page press F12 (or Ctrl+Shift+J) and click the Console tab.'],
      ['Allow pasting if asked', 'If the browser warns you about pasting code, type allow pasting and press Enter first.'],
      ['Paste and run', 'Paste the code and press Enter. The browser may jump from Console to the Sources tab; if it says Paused in debugger, press Resume (F8). A small "verify you are human" box appears on the page. Click it and wait until the Console says Published.'],
      ['Refresh and check', 'Refresh the character page. Your new bio is live. Done!']
    ]
  };
  function guideList(steps) {
    var ol = h('ol', {'class': 'guide-steps'});
    steps.forEach(function (st) { ol.appendChild(h('li', {}, [h('strong', {text: st[0]}), h('span', {text: st[1]})])); });
    return ol;
  }
  function linkBtn(href, icon, title, sub) {
    var url = cleanUrl(href);
    var kids = [h('span', {'class': 'link-ico', 'aria-hidden': 'true'}, [svgEl(icon, 20)]), h('span', {'class': 'link-copy'}, [h('strong', {text: title}), h('small', {text: sub})])];
    if (!url) { kids.push(h('span', {'class': 'link-go', text: 'Soon'})); return h('span', {'class': 'link-btn is-soon', 'aria-disabled': 'true'}, kids); }
    kids.push(h('span', {'class': 'link-go', 'aria-hidden': 'true'}, [svgEl('external', 18)]));
    return h('a', {'class': 'link-btn', href: url, target: '_blank', rel: 'noopener noreferrer'}, kids);
  }
  function renderMenuPanel() {
    panelLinks.innerHTML = '';
    var guideBody = h('div'), listHolder = h('div');
    var segA = h('button', {type: 'button', text: 'Android'}), segP = h('button', {type: 'button', text: 'Computer'});
    var seg = h('div', {'class': 'seg', role: 'group', 'aria-label': 'Choose your device'}, [segA, segP]);
    function show(which) {
      segA.className = which === 'android' ? 'on' : ''; segP.className = which === 'pc' ? 'on' : '';
      segA.setAttribute('aria-pressed', which === 'android' ? 'true' : 'false'); segP.setAttribute('aria-pressed', which === 'pc' ? 'true' : 'false');
      listHolder.innerHTML = '';
      listHolder.appendChild(guideList(GUIDE[which]));
      if (workspace.classList.contains('is-open')) smoothResize(workspace.offsetHeight);
    }
    segA.onclick = function () { show('android'); };
    segP.onclick = function () { show('pc'); };
    guideBody.appendChild(h('p', {'class': 'hint', style: 'margin:0 0 4px', text: 'Publish your bio straight to your character, step by step.'}));
    guideBody.appendChild(seg);
    guideBody.appendChild(listHolder);
    guideBody.appendChild(h('div', {'class': 'guide-tips'}, [
      h('strong', {text: 'Good to know'}),
      h('ul', {}, [
        h('li', {text: 'Gboard (the Google keyboard) remembers your recent copies. Tap Copy on each part first, then in the Console open the keyboard clipboard and paste them one after another in order, so you do not have to go back and forth. Make sure Clipboard is turned on in Gboard. Other keyboards may work differently.'}),
        h('li', {text: 'If the Console says the bio is incomplete, paste all the parts again in order, on the same page without reloading.'}),
        h('li', {text: 'You can only update characters that belong to your own account.'}),
        h('li', {text: 'Only paste code you copied from this studio. Never paste code someone else sends you, because it runs with your login.'})
      ])
    ]));
    show('android');
    var guide = h('details', {'class': 'menu-card', open: ''}, [h('summary', {text: 'Step-by-step guide'}), guideBody]);
    var video = h('details', {'class': 'menu-card'}, [
      h('summary', {text: 'Video guides'}),
      h('div', {'class': 'link-list'}, [
        linkBtn(VIDEO_LINKS.android, 'preview', 'Android video guide', 'Watch the steps on a phone'),
        linkBtn(VIDEO_LINKS.pc, 'preview', 'Computer video guide', 'Watch the steps on a computer')
      ])
    ]);
    var follow = h('details', {'class': 'menu-card', open: ''}, [
      h('summary', {text: 'Follow me'}),
      h('p', {'class': 'hint', style: 'margin:0 0 10px', text: 'If this studio helped you, a follow really means a lot. Thank you!'}),
      h('div', {'class': 'link-list'}, [
        linkBtn(SOCIAL.tiktok, 'heart', 'TikTok', '@maharthiha_thuranaing'),
        linkBtn(SOCIAL.jai, 'sparkle', 'Janitor AI', 'Zeiam')
      ])
    ]);
    var credit = h('p', {'class': 'credit', text: 'Made by Zeiam with Claude (Anthropic) and ChatGPT (OpenAI).'});
    var sec = h('section', {}, [guide, video, follow, credit]);
    panelLinks.appendChild(sec);
  }

  function renderStyle() {
    secStyle.innerHTML = '';
    secStyle.appendChild(h('h2', {text: 'Look'}));
    secStyle.appendChild(h('p', {'class': 'mode-note', text: 'You are in Html mode, so the design options are paused. Switch back to Editor to use them.'}));
    var row = h('div', {'class': 'row'});
    Object.keys(PALETTES).forEach(function (name) {
      var p = PALETTES[name];
      var sw = h('span', {'class': 'sw'}, [p.bg, p.card, p.accent, p.text].map(function (c) { return h('i', {style: 'background:' + c}); }));
      row.appendChild(h('button', {
        'class': 'pal' + (state.pal === name ? ' on' : ''),
        onclick: function () {
          state.pal = name; state.colors = JSON.parse(JSON.stringify(PALETTES[name]));
          save(); renderStyle(); refresh();
        }
      }, [sw, name]));
    });
    var paletteMenu = h('details', {'class':'menu-card palette-menu'});
    paletteMenu.open = true;
    paletteMenu.appendChild(h('summary', {text:'Color palette library'}));
    paletteMenu.appendChild(h('p', {'class':'menu-hint', text:'Choose a preset or customize every color below.'}));
    paletteMenu.appendChild(row);
    secStyle.appendChild(paletteMenu);

    var grid = h('div', {'class': 'colors'});
    ROLES.forEach(function (r) {
      var inp = h('input', {type: 'color', value: fixColors(state.colors)[r[0]]});
      inp.oninput = function () { state.colors[r[0]] = inp.value; state.pal = 'Custom'; save(); refresh(); };
      grid.appendChild(h('div', {}, [h('label', {text: r[1]}), inp]));
    });
    var customMenu = h('details', {'class':'menu-card'});
    customMenu.appendChild(h('summary', {text:'Custom colors & page styling'}));
    customMenu.appendChild(grid);

    var rl = h('label', {text: 'Corner roundness: ' + fixRadius(state.radius) + 'px'});
    customMenu.appendChild(rl);
    var rng = h('input', {type: 'range', min: '0', max: '32', value: String(fixRadius(state.radius))});
    rng.oninput = function () { state.radius = parseInt(rng.value, 10); rl.textContent = 'Corner roundness: ' + state.radius + 'px'; save(); refresh(); };
    customMenu.appendChild(rng);

    customMenu.appendChild(h('label', {text: 'Page font'}));
    var sel = h('select');
    Object.keys(FONTS).forEach(function (f) {
      var o = h('option', {value: f, text: f});
      if (state.font === f) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = function () { state.font = sel.value; save(); refresh(); };
    customMenu.appendChild(sel);
    customMenu.appendChild(h('p', {'class': 'hint', text: 'Each block can also get its own font, border and rotation under its Style panel.'}));
    secStyle.appendChild(customMenu);
  }

  function renderAdd() {
    secAdd.innerHTML = '';
    secAdd.appendChild(h('h2', {text: 'Add Blocks'}));
    secAdd.appendChild(h('p', {'class': 'mode-note', text: 'You are in Html mode, so blocks are paused. Switch back to Editor to use them. You can still load a file.'}));
    var row = h('div', {'class': 'block-library needs-editor'});
    Object.keys(BLOCKS).forEach(function (t) {
      row.appendChild(h('button', {
        'class':'block-option', text: '+ ' + BLOCKS[t].label,
        onclick: function () {
          state.items.push(newItem(t));
          justAdded = state.items.length - 1; justCell = -1;
          popIdx = pendingIdx = justAdded;
          save(); renderItems(); refresh();
          toast('Added ' + BLOCKS[t].label);
        }
      }));
    });
    secAdd.appendChild(row);
    var fileInp = h('input', {type: 'file', accept: '.html,.htm,.txt,text/html,text/plain', 'class': 'file-hidden', tabindex: '-1', 'aria-hidden': 'true'});
    fileInp.onchange = function () {
      var f = fileInp.files && fileInp.files[0];
      if (!f) return;
      if (f.size > 1.5 * 1024 * 1024) { toast('That file is too big (1.5 MB max)'); fileInp.value = ''; return; }
      var rd = new FileReader();
      rd.onload = function () { var t = String(rd.result || ''); fileInp.value = ''; loadHtml(t, f.name); };
      rd.onerror = function () { toast('Could not read that file'); fileInp.value = ''; };
      rd.readAsText(f);
    };
    secAdd.appendChild(fileInp);
    var row2 = h('div', {'class': 'row', style: 'margin-top:12px'});
    row2.appendChild(h('button', {'class': 'small needs-editor', text: 'Start from sample page', onclick: function () {
      state.items = starterItems(); justAdded = -1; pendingIdx = -1; save(); renderItems(); refresh();
    }}));
    row2.appendChild(h('button', {'class': 'small', type: 'button', title: 'Open your own .html file to edit its code', text: 'Load HTML', onclick: function () { fileInp.click(); }}));
    row2.appendChild(h('button', {'class': 'small needs-editor', text: 'Clear page', onclick: function () {
      confirmBox('Clear the page?', 'Every block on your page will be removed. This cannot be undone.', 'Clear page', function(){ state.items = []; popIdx = pendingIdx = -1; save(); renderItems(); refresh(); toast('Page cleared'); });
    }}));
    secAdd.appendChild(row2);
  }

  var pvEls = [];

  function styleUI(it, b) {
    var st = it.style = fixStyle(it.style, it.type);
    var opts = b.styleOpts || ['font', 'bside', 'bw', 'bcol', 'rot'];
    if (!opts.length) return h('span');
    function has(k) { return opts.indexOf(k) >= 0; }
    function upd() { save(); refresh(); }
    var det = h('details');
    det.appendChild(h('summary', {text: 'Style (font, border, rotation)'}));
    if (has('font')) {
      det.appendChild(h('label', {text: 'Font for this block'}));
      var fs = h('select');
      fs.appendChild(h('option', {value: '', text: 'Same as page'}));
      Object.keys(FONTS).forEach(function (f) { fs.appendChild(h('option', {value: f, text: f})); });
      fs.value = st.font;
      fs.onchange = function () { st.font = fs.value; upd(); };
      det.appendChild(fs);
    }
    if (has('bside')) {
      det.appendChild(h('label', {text: 'Border'}));
      var bs = h('select');
      SIDES.forEach(function (x) { bs.appendChild(h('option', {value: x[0], text: x[1]})); });
      bs.value = st.bside;
      bs.onchange = function () { st.bside = bs.value; upd(); };
      det.appendChild(bs);
    }
    if (has('bw')) {
      var wl = h('label', {text: 'Border thickness: ' + st.bw + 'px'});
      det.appendChild(wl);
      var wr = h('input', {type: 'range', min: '1', max: '8', step: '1', value: String(st.bw)});
      wr.oninput = function () { st.bw = parseInt(wr.value, 10); wl.textContent = 'Border thickness: ' + st.bw + 'px'; upd(); };
      det.appendChild(wr);
    }
    if (has('bcol')) {
      det.appendChild(h('label', {text: 'Border colour'}));
      var cs = h('select');
      BCOLS.forEach(function (x) { cs.appendChild(h('option', {value: x[0], text: x[1]})); });
      cs.value = st.bcol;
      cs.onchange = function () { st.bcol = cs.value; upd(); };
      det.appendChild(cs);
    }
    if (has('rot')) {
      var rl = h('label', {text: 'Rotation: ' + st.rot + ' degrees'});
      det.appendChild(rl);
      var rr = h('input', {type: 'range', min: '-10', max: '10', step: '0.5', value: String(st.rot)});
      rr.oninput = function () { st.rot = parseFloat(rr.value); rl.textContent = 'Rotation: ' + st.rot + ' degrees'; upd(); };
      det.appendChild(rr);
    }
    det.appendChild(h('div', {style: 'margin-top:10px'}, [
      h('button', {'class': 'small', text: 'Reset this block’s style', onclick: function () {
        it.style = defStyle(it.type); save(); renderItems(); refresh();
      }})
    ]));
    return det;
  }

  /* ---- Editor <-> Html switch ---- */
  function modeBar() {
    var isHtml = state.mode === 'html';
    var sw = h('button', {type: 'button', 'class': 'mode-switch' + (isHtml ? ' on' : ''), role: 'switch', 'aria-checked': isHtml ? 'true' : 'false', 'aria-label': 'Switch between Editor and Html'}, [h('span', {'class': 'mode-knob'})]);
    sw.onclick = function () { setMode(isHtml ? 'editor' : 'html'); };
    return h('div', {'class': 'mode-bar'}, [
      h('button', {type: 'button', 'class': 'mode-label' + (isHtml ? '' : ' active'), text: 'Editor', onclick: function () { setMode('editor'); }}),
      sw,
      h('button', {type: 'button', 'class': 'mode-label' + (isHtml ? ' active' : ''), text: 'Html', onclick: function () { setMode('html'); }})
    ]);
  }
  function applyModeUI() {
    var isHtml = state.mode === 'html';
    document.body.classList.toggle('html-mode', isHtml);
    Array.prototype.forEach.call(secStyle.children, function (c) {
      if (c.tagName === 'H2' || c.classList.contains('mode-note')) return;
      c.classList.add('needs-editor');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.needs-editor'), function (el) { el.inert = isHtml; });
  }
  function rebuildAll() {
    renderStyle(); renderAdd(); renderItems(); refresh(); applyModeUI();
  }
  function setMode(m) {
    if (m === state.mode) return;
    function go() {
      if (m === 'html') { state.raw = buildPage(state); state.rawDirty = false; state.mode = 'html'; }
      else { state.mode = 'editor'; state.raw = ''; state.rawDirty = false; }
      save(); rebuildAll();
      window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
    }
    if (m === 'editor' && state.rawDirty) {
      confirmBox('Back to the editor?', 'The code you changed in Html stays out of the block editor, so those changes will be discarded.', 'Discard code', go);
    } else go();
  }
  function renderHtmlView() {
    var info = h('p', {'class': 'hint', style: 'margin:0', text: 'Full page HTML. Write or paste your own code. When you preview or publish, double quotes in attributes become single quotes, and script, style and iframe tags and classes are removed because the Janitor bio editor does not accept them.'});
    var warn = h('p', {'class': 'bad', style: 'margin:0'});
    var count = h('div', {'class': 'stat', style: 'margin:0'});
    var ta = h('textarea', {'class': 'html-editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'soft', 'aria-label': 'Full page HTML'});
    var pre = h('pre', {'class': 'code-hl', 'aria-hidden': 'true'});
    var wrap = h('div', {'class': 'code-wrap'}, [pre, ta]);
    ta.value = state.raw;
    function paint() { pre.innerHTML = (state.raw.length > 250000 ? hlEsc(state.raw) : highlightHtml(state.raw)) + '\n'; }
    function note() {
      var risky = /<\s*(script|style|iframe)\b/i.test(state.raw) || /\sclass\s*=/i.test(state.raw);
      warn.textContent = risky ? 'Heads up: this code has script, style or iframe tags, or classes. They are removed in the preview and when publishing.' : '';
      warn.hidden = !risky;
      count.textContent = state.raw.length + ' characters';
    }
    ta.oninput = function () { state.raw = ta.value; state.rawDirty = true; save(); paint(); note(); refreshCode(); };
    paint();
    note();
    secPage.appendChild(h('div', {'class': 'html-view'}, [info, warn, wrap, count]));
  }
  function loadHtml(text, name) {
    var m = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    text = (m ? m[1] : text.replace(/<!doctype[^>]*>/i, '').replace(/<head[\s\S]*?<\/head>/i, '').replace(/<\/?html[^>]*>/gi, '')).trim();
    if (!text) { toast('That file is empty'); return; }
    function go() {
      state.raw = text; state.rawDirty = true; state.mode = 'html';
      save(); rebuildAll(); closeMenu();
      window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
      toast('Loaded ' + (name || 'file'));
    }
    if (state.mode === 'html' && state.rawDirty) confirmBox('Replace your code?', 'The code in the Html view will be replaced by this file.', 'Replace', go);
    else go();
  }

  function renderItems() {
    secPage.innerHTML = '';
    pvEls = [];
    secPage.appendChild(modeBar());
    if (state.mode === 'html') { renderHtmlView(); popIdx = -1; return; }
    if (!state.items.length) secPage.appendChild(h('p', {'class': 'hint', text: 'Nothing here yet. Add a block above.'}));
    state.items.forEach(function (it, i) {
      var b = BLOCKS[it.type];
      if (!b) return;
      var head = h('div', {'class': 'item-head'}, [h('b', {text: (i + 1) + '. ' + b.label + (it.cells.length > 1 ? ' (swipe row of ' + it.cells.length + ')' : '')})]);
      if (b.multi) {
        head.appendChild(h('button', {'class': 'small', title: 'Add another one beside this (makes a swipe row)', 'aria-label': 'Add another beside this', onclick: function () {
          it.cells.push(defaults(it.type));
          justAdded = i; justCell = it.cells.length - 1;
          popIdx = pendingIdx = i;
          save(); renderItems(); refresh();
          toast('Added beside: swipe row');
        }}, [svgEl('plus',18)]));
      }
      head.appendChild(h('button', {'class': 'small', 'aria-label': 'Move up', onclick: function () { move(i, -1); }}, [svgEl('up', 18)]));
      head.appendChild(h('button', {'class': 'small', 'aria-label': 'Move down', onclick: function () { move(i, 1); }}, [svgEl('down', 18)]));
      head.appendChild(h('button', {'class': 'small', 'aria-label': 'Remove this block', onclick: function () { state.items.splice(i, 1); pendingIdx = -1; save(); renderItems(); refresh(); }}, [svgEl('close', 18)]));
      var card = h('div', {'class': 'item' + (i === popIdx ? ' item-new' : '')}, [head]);

      if (b.fields.length) {
        it.cells.forEach(function (c, ci) {
          var multi = it.cells.length > 1;
          var holder = multi ? h('div', {'class': 'cell'}) : card;
          var det = h('details');
          if (i === justAdded && (justCell < 0 || justCell === ci)) det.setAttribute('open', '');
          det.appendChild(h('summary', {text: multi ? 'Edit card ' + (ci + 1) : 'Edit text'}));
          b.fields.forEach(function (fd) {
            det.appendChild(h('label', {text: fd.l}));
            var inp = fd.m ? h('textarea') : h('input', {type: 'text'});
            inp.value = c[fd.k] == null ? '' : c[fd.k];
            inp.oninput = function () { c[fd.k] = inp.value; save(); refresh(); };
            det.appendChild(inp);
          });
          if (multi) {
            det.appendChild(h('div', {style: 'margin-top:10px'}, [
              h('button', {'class': 'small', text: 'Remove card ' + (ci + 1), onclick: function () {
                it.cells.splice(ci, 1); justAdded = -1; pendingIdx = -1; save(); renderItems(); refresh();
              }})
            ]));
          }
          holder.appendChild(det);
          if (multi) card.appendChild(holder);
        });
      }
      card.appendChild(styleUI(it, b));
      var pv = h('div', {'class': 'pv'});
      pvEls.push(pv);
      card.appendChild(pv);
      secPage.appendChild(card);
    });
    popIdx = -1;
  }
  function move(i, d) {
    var j = i + d;
    if (j < 0 || j >= state.items.length) return;
    var t = state.items[i]; state.items[i] = state.items[j]; state.items[j] = t;
    justAdded = -1; pendingIdx = -1;
    save(); renderItems(); refresh();
  }

  var statEl, partsRow, phoneEl, idEl, partCountEl;
  function renderCodeShell() {
    secCode.innerHTML = '';
    secCode.appendChild(h('h2', {text: 'Publish'}));

    secCode.appendChild(h('label', {style: 'margin-top:0', text: 'Character link (the address of the character page)'}));
    var link = h('input', {type: 'text', placeholder: 'https://janitorai.com/characters/...'});
    link.value = state.link;
    link.oninput = function () { state.link = link.value; save(); refreshCode(); };
    secCode.appendChild(link);
    idEl = h('div');
    secCode.appendChild(idEl);

    secCode.appendChild(h('label', {text: 'How many parts'}));
    var partControl = h('div', {'class':'part-stepper'});
    var minusPart = h('button', {'class':'small', type:'button', text:'−', 'aria-label':'Decrease number of parts'});
    partCountEl = h('strong', {'class':'part-count', text:String(state.nparts)});
    var plusPart = h('button', {'class':'small', type:'button', text:'+', 'aria-label':'Increase number of parts'});
    minusPart.onclick = function () { state.nparts = Math.max(1, state.nparts - 1); save(); partCountEl.textContent = state.nparts; refreshCode(); };
    plusPart.onclick = function () { state.nparts = Math.min(100, state.nparts + 1); save(); partCountEl.textContent = state.nparts; refreshCode(); };
    partControl.appendChild(minusPart); partControl.appendChild(partCountEl); partControl.appendChild(plusPart);
    secCode.appendChild(partControl);

    var adv = h('details');
    adv.appendChild(h('summary', {text: 'Advanced'}));
    adv.appendChild(h('label', {text: 'Site app version (only change this if publishing stops working and you know the new value)'}));
    var av = h('input', {type: 'text'});
    av.value = state.appVer;
    av.oninput = function () { state.appVer = fixAppVer(av.value); save(); refreshCode(); };
    adv.appendChild(av);
    secCode.appendChild(adv);

    statEl = h('div', {'class': 'stat', style: 'margin-top:12px'});
    secCode.appendChild(statEl);
    partsRow = h('div', {'class': 'row'});
    secCode.appendChild(partsRow);

    var plain = h('details', {'class':'formatted-export'});
    plain.appendChild(h('summary', {text: 'Formatted HTML export'}));
    var r1 = h('div', {'class': 'row export-actions'});
    r1.appendChild(h('button', {text: 'Copy all HTML', onclick: function () { copyText(getBio(), 'all HTML'); }}));
    r1.appendChild(h('button', {'class':'main', text: 'Download file', onclick: function () {
      var blob = new Blob([getBio()], {type: 'text/html'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'jai-bio-studio.html';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }}));
    plain.appendChild(r1);
    secCode.appendChild(plain);

    secPreview.appendChild(h('h2', {text:'Page Preview'}));
    secPreview.appendChild(h('p', {'class':'hint', text:'Your bio at phone width, exactly as it will be published.'}));
    phoneEl = h('div', {'class': 'phone'});
    secPreview.appendChild(phoneEl);
  }

  function refreshCode() {
    var code = getBio(), id = parseCharId(state.link);
    statEl.textContent = 'Bio: ' + code.length + ' characters, ' + code.split('\n').length + ' lines';
    if (id) { idEl.className = 'ok'; idEl.textContent = 'Character id found: ' + id; }
    else {
      idEl.className = state.link.trim() ? 'bad' : 'hint';
      idEl.textContent = state.link.trim() ? 'Could not detect a character ID in that URL.' : ''; 
    }
    partsRow.innerHTML = '';
    if (!id) {
      partsRow.appendChild(h('span', {'class': 'hint', text: 'The publish parts show up here once the link has a character id.'}));
    } else {
      try {
        var cp = consoleParts(code, id, state.nparts, state.appVer);
        if (cp.length < state.nparts) {
          partsRow.appendChild(h('p', {'class': 'hint', style: 'width:100%;margin:0', text: 'Your bio only has ' + cp.length + ' lines to cut on, so it was split into ' + cp.length + ' parts, not ' + state.nparts + '. Write one element per line or add blocks to get more parts.'}));
        }
        cp.forEach(function (txt, k) {
          partsRow.appendChild(h('button', {text: 'Copy part ' + (k + 1) + ' of ' + cp.length + ' · ' + txt.length + ' to paste', onclick: function () { copyText(txt, 'part ' + (k + 1) + ' of ' + cp.length); }}));
        });
        var bioPieces = cp.map(function (t, k) { var m = /window\.__jai\[\d+\] = (".*");\n/.exec(t); try { return m ? JSON.parse(m[1]).length : 0; } catch (e2) { return 0; } });
        partsRow.appendChild(h('p', {'class': 'hint', style: 'width:100%;margin:0', text: 'The number on each button is how much text you paste. The Console reports only the bio inside it: ' + bioPieces.join(' + ') + ' = ' + code.length + ' characters. The last part also holds the publisher code, so it is the biggest paste.'}));
      } catch (e) { partsRow.appendChild(h('span', {'class': 'bad', text: 'Could not build the parts: ' + e.message})); }
    }
    phoneEl.innerHTML = code;
  }

  function refresh() {
    var i, wrap = wrapperOpen(state);
    for (i = 0; i < state.items.length; i++) {
      if (!pvEls[i]) continue;
      var ls = buildItem(state.items[i], state);
      var b = BLOCKS[state.items[i].type];
      pvEls[i].innerHTML = ls.length ? wrap + ls.join('\n') + '</div>' : '<div class="hint" style="padding:6px 2px">' + (b.hint || 'Nothing to show yet.') + '</div>';
    }
    refreshCode();
  }

  renderStyle(); renderAdd(); renderItems(); renderCodeShell(); renderMenuPanel(); refresh(); applyModeUI();
})();
