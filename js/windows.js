// Pop-up windows: what each one shows, and how they open, close and move.


// ---------- what each window shows ----------
// title  = text in the title bar and taskbar
// icon   = pixel icon name from icons.js
// width  = how wide the window opens, in px
// render = returns the HTML inside the window (built from content.js)
// init   = (optional) wires up buttons inside the window after it opens

const WINDOWS = {
  about: {
    title: 'about_me.txt',
    icon: 'pencil',
    width: 440,
    render: () => `
      <p class="win-hello">hi! I'm ${esc(ME.name)} <i data-icon="heart"></i></p>
      <div class="lined">
        ${ME.about.map((para) => `<p>${fmt(para)}</p>`).join('')}
      </div>
      <h3 class="win-label">languages I use</h3>
      <ul class="chips">
        ${ME.languages.map((lang) => `<li>${esc(lang)}</li>`).join('')}
      </ul>
      <div class="win-row">
        <button class="btn solid" data-open="projects">see my projects</button>
        <button class="btn" data-open="contact">say hi</button>
      </div>
    `,
  },

  projects: {
    title: 'projects.cd',
    icon: 'album',
    width: 500,
    render: () => `
      <h2 class="win-heading">Tracklist</h2>
      <p>${PROJECTS.length} project${PROJECTS.length === 1 ? '' : 's'} from my Computer Engineering journey. Pick a track to see how it works.</p>

      <div class="filters" role="group" aria-label="Filter projects">
        ${FILTERS.map(([id, label], i) => `<button data-filter="${id}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('')}
      </div>

      <ol class="tracks">
        ${PROJECTS.map((p, i) => `
          <li data-cat="${p.cat.join(' ')}">
            <details class="track">
              <summary>
                <span class="track-no">${String(i + 1).padStart(2, '0')}</span>
                <span class="track-title">${esc(p.title)}<small>${esc(p.tags.slice(0, 3).join(' · '))}</small></span>
                <span class="track-type">${esc(p.type)}</span>
              </summary>
              <div class="track-body">
                <ul class="chips">${p.tags.map((tag) => `<li>${esc(tag)}</li>`).join('')}</ul>
                <p>${fmt(p.summary)}</p>
                <h3 class="win-label">how it works</h3>
                <ul>${p.points.map((point) => `<li>${fmt(point)}</li>`).join('')}</ul>
                <h3 class="win-label">my part</h3>
                <p>${fmt(p.myPart)}</p>
                ${p.link ? `<a class="btn solid" href="${esc(p.link)}" target="_blank" rel="noopener">open project</a>` : ''}
              </div>
            </details>
          </li>
        `).join('')}
      </ol>
    `,
    // filter buttons: show only the projects whose cat list has that id
    init(win) {
      const buttons = $$('[data-filter]', win);
      buttons.forEach((btn) => btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn));
        const id = btn.dataset.filter;
        $$('.tracks > li', win).forEach((li) => {
          li.hidden = id !== 'all' && !li.dataset.cat.split(' ').includes(id);
        });
      }));
    },
  },
};


// ---------- opening, closing, stacking ----------

const openWindows = {};   // id -> the <section> on the page
let topZ = 100;           // highest z-index so far

function openWin(id) {
  const def = WINDOWS[id];
  if (!def) return toast('coming soon', 'heart');  

  // already open? show it and bring it to the front
  if (openWindows[id]) {
    openWindows[id].hidden = false;
    focusWin(openWindows[id]);
    return;
  }

  const win = document.createElement('section');
  win.className = 'win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', def.title);
  win.innerHTML = `
    <div class="win-top">
      <span class="win-name"><i data-icon="${def.icon}"></i>${esc(def.title)}</span>
      <span class="win-buttons">
        <button data-min aria-label="Minimise"><i data-icon="minus"></i></button>
        <button data-close aria-label="Close"><i data-icon="close"></i></button>
      </span>
    </div>
    <div class="win-body">${def.render()}</div>
  `;
  win.style.width = `min(${def.width}px, calc(100vw - 32px))`;
  $('#wins').appendChild(win);
  drawIcons(win);

  // open in the middle of the screen; each extra window a little lower and to the right
  const n = Object.keys(openWindows).length;
  const space = $('#wins').clientHeight;
  const middle = (space - win.offsetHeight) / 2;
  win.style.left = Math.max(16, innerWidth / 2 - win.offsetWidth / 2 + n * 28) + 'px';
  win.style.top = Math.max(16, Math.min(middle + n * 28, space - win.offsetHeight - 16)) + 'px';

  // buttons inside the window
  win.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeWin(id);
    else if (e.target.closest('[data-min]')) { win.hidden = true; updateTasks(); }
    else if (e.target.closest('[data-open]')) openWin(e.target.closest('[data-open]').dataset.open);
  });
  win.addEventListener('pointerdown', () => focusWin(win));
  makeDraggable(win);
  def.init?.(win);   // ?. = only if this window has an init

  openWindows[id] = win;
  focusWin(win);
}

function closeWin(id) {
  openWindows[id]?.remove();
  delete openWindows[id];
  updateTasks();
}

// put a window on top of the others
function focusWin(win) {
  win.style.zIndex = ++topZ;
  updateTasks();
}

// the visible window that is on top (or undefined)
function topWindow() {
  return Object.entries(openWindows)
    .filter(([, win]) => !win.hidden)
    .sort((a, b) => b[1].style.zIndex - a[1].style.zIndex)[0];
}

// drag a window by its title bar (not on phones: there, fingers scroll)
function makeDraggable(win) {
  const bar = win.querySelector('.win-top');
  let start = null;

  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || matchMedia('(max-width: 720px)').matches) return;
    start = { x: e.clientX, y: e.clientY, left: win.offsetLeft, top: win.offsetTop };
    bar.setPointerCapture(e.pointerId);
  });

  bar.addEventListener('pointermove', (e) => {
    if (!start) return;
    const left = start.left + e.clientX - start.x;
    const top = start.top + e.clientY - start.y;
    // keep at least part of the window on screen
    win.style.left = Math.max(-win.offsetWidth + 80, Math.min(innerWidth - 80, left)) + 'px';
    win.style.top = Math.max(0, Math.min($('#wins').clientHeight - 40, top)) + 'px';
  });

  bar.addEventListener('pointerup', () => (start = null));
  bar.addEventListener('pointercancel', () => (start = null));
}

// one taskbar button per open window
function updateTasks() {
  const top = topWindow()?.[0];
  $('#tasks').replaceChildren(...Object.entries(openWindows).map(([id, win]) => {
    const btn = document.createElement('button');
    btn.className = 'task' + (id === top ? ' on' : '');
    btn.textContent = WINDOWS[id].title;
    btn.addEventListener('click', () => {
      if (!win.hidden && id === top) { win.hidden = true; updateTasks(); }   // click again = minimise
      else { win.hidden = false; focusWin(win); }
    });
    return btn;
  }));
}