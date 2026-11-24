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
    width: 700,
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
        
      </div>
    `,
  },

  projects: {
    title: 'projects.cd',
    icon: 'album',
    width: 700,
    render: () => `
      <h2 class="win-heading">Tracklist</h2>
      <p>${PROJECTS.length} project${PROJECTS.length === 1 ? '' : 's'} Pick a track to see how it works.</p>

      <div class="filters" role="group" aria-label="Filter projects">
        ${FILTERS.map(([id, label], i) => `<button data-filter="${id}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('')}
      </div>

      <ol class="tracks">
        ${PROJECTS.map((p, i) => `
          <li data-cat="${p.cat.join(' ')}">
            <button class="track" data-open="project-${i}">
              <span class="track-no">${String(i + 1).padStart(2, '0')}</span>
              <span class="track-title">${esc(p.title)}<small>${esc(p.tags.slice(0, 3).join(' · '))}</small></span>
              <span class="track-type">${esc(p.type)}</span>
            </button>
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

  //Experience window
  experience:{
    title: 'experience.exe',
    icon: 'briefcase',
    render: () => `
      <p class="track-no">${esc(EXPERIENCE.company)}. ${fmt(EXPERIENCE.dates)}</p>
      <h2 class="win-heading small">${esc(EXPERIENCE.role)}</h2>
      <p>${fmt(EXPERIENCE.summary)}</p>
      <div class="tabs" role="tablist" aria-label="My work at ${esc(EXPERIENCE.company)}">
        ${EXPERIENCE.work.map((w,i)=>`
          <button role="tab" data-tab=${i} aria-selected="${i ===0}">
            <small>${esc(w.kind)}</small> ${esc(w.name)}
          </button>

          `).join('')}
          </div>
          <div class="tab-panel" role="tabpanel">${workPanel(0)}</div>
          `,
    init(win){
      const tabs= $$('[data-tab]', win);
      tabs.forEach((tab)=> tab.addEventListener('click', ()=>
      {
        tabs.forEach((t)=> t.setAttribute('aria-selected', t === tab ));
        $('.tab-panel', win).innerHTML = workPanel(Number(tab.dataset.tab));
        drawIcons(win);
      }));
    },


  },

  contact:{
    title: 'contact',
    icon: 'phone',
    width: 700,
    render: () =>`
      <h2 class="win-heading">Contact Me</h2>
      ${CONTACT.map((c,i)=> `
        <div class="crow">
        <span class="ci">${esc(c.short)}</span>
        <div class="crow-text"><b>${esc(c.label)}</b><span> ${fmt(c.value)} </span></div>
        ${c.copy? `<button class="btn" data-copy="${i}">copy</button>` : ''}
        ${c.href? `<a class="btn" href="${esc(c.href)}" target="_blank" rel="noopener">open</a> ` : ''}
        </div>
        `).join('')}
    `,
    init(win){
      $$('[data-copy]',win).forEach((btn)=> btn.addEventListener('click', ()=>{
        const value = CONTACT[Number(btn.dataset.copy)].value;
        navigator.clipboard.writeText(value).then(()=> toast ('copied', 'heart'));


      }));
  
    },
  }
};
// ---------- one window per project ----------
// adds 'project-0', 'project-1', … to WINDOWS, one for each project in content.js
PROJECTS.forEach((p,i)=>{
  WINDOWS[`project-${i}`]={
    title: p.title,
    icon: 'album',
    width: 540,
    render: ()=>`
      <div class="win-row">
        ${p.link ? `<a class="btn solid" href="${esc(p.link)}" target="_blank" rel="noopener">open project</a>` : ''}
        <button class="btn" data-open="projects">back to tracklist</button>
      </div>
      <p class="track-no">track ${String(i+1).padStart(2,'0')} . ${esc(p.type)}</p>
      <h2 class="win-heading small">${esc(p.title)}</h2>
      
      ${p.images.length
      ? p.images.map((src) => `<img class="shot" src="${esc(src)}" alt="Screenshot of ${esc(p.title)}">`).join('')
      : `<div class="shot shot-empty">${fmt('')}</div>`}
      <ul class="chips">${p.tags.map((tag)=> `<li>${esc(tag)}</li>`).join('')}
      </ul>
      <p class="project-summary">${fmt(p.summary)}</p>
      <h3 class="win-label">how it works</h3>
      <ul class="points">${p.points.map((points)=> `<li>${fmt(points)}</li>`).join('')}
      </ul>
      <h3 class="win-label">my part</h3>
      <p>${fmt(p.myPart)}</p>
     
      `,
  };
});



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
  
  $('#wins').appendChild(win);
  drawIcons(win);
  
  // each new window opens a little lower and to the right of the last one
  const n= Object.keys(openWindows).length % 4;
  win.style.left = `calc(20% + ${n * 28}px)`;
  win.style.top = `calc(10% + ${n * 28}px)`;


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
// ---------- photos: used by projects, experience, achievements and activities ----------
function photo(src, alt){
  return src 
  ? `<img class="photo" src="${esc(src)}" alt="Photo: ${esc(alt)}">`
  :`<div class="photo photo-empty">${fmt('[photo]')}</div>`;

}
// a row of photos that has scroll sideways
function gallery(images,alt){
  return `<div class="gallery">${(images.length ? images : ['']).map((src)=> photo(src, alt )).join('')}</div>`;

}
// one role, for a tab in the Experience window
function workPanel(i){
  const w = EXPERIENCE.work[i];
  return `
    <p class="track-no">${esc(w.role)} . ${esc(w.dates)}</p>
    ${w.images?.length ? gallery(w.images, w.name) : ''}
    <p>${fmt(w.about)}</p>
    ${w.steps.length ? `
      <h3 class="win-label">how it works</h3>
      <ol class="steps">${w.steps.map((s)=> `<li> ${fmt(s)}</li>`).join('')}</ol>`: '' } 
    
    <h3 class="win-label">what I did</h3>
    <ul class="checks">
      ${w.did.map((d) => `<li><i data-icon="check"></i><span>${fmt(d)}</span></li>`).join('')}
    </ul>

    <h3 class="win-label">tech</h3>
    <ul class="chips">${w.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  `;
}


