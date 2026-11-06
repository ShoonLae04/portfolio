// Bottom taskbar: the  clock and the music button.


function initClock() {
  const clock = $('#clock');
  const fmt = new Intl.DateTimeFormat('en-SG', {
    timeZone: 'Asia/Singapore', hour: 'numeric', minute: '2-digit',
  });
  let timer;

  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now).toLowerCase() + ' SGT';
    clock.dateTime = now.toISOString();

    // wait until the next minute starts (+50ms margin), so the clock never lags
    clearTimeout(timer);
    timer = setTimeout(tick, 60000 - (now.getTime() % 60000) + 50);
  };

  tick();
  // hidden tabs pause timers, so refresh when the tab comes back
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tick();
  });
}

function initMusic() {
  const btn = $('#musicBtn');
  let playing = false;

  btn.addEventListener('click', () => {
    playing = !playing;
    const label = playing ? 'pause' : 'play';
    btn.replaceChildren(icon(label), label);
    btn.classList.toggle('on', playing);
    
  });
}
function initStartMenu() {
  const btn = $('#startBtn');
  const menu = $('#menu');

  const setOpen = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open);
  };

  // start button opens / closes the menu
  btn.addEventListener('click', (e) => {
    e.stopPropagation();   // stop the "click anywhere" below from closing it again
    setOpen(menu.hidden);
  });

  // a menu item opens its window
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-open]');
    if (!item) return;
    openWin(item.dataset.open);
    setOpen(false);
  });

  // click anywhere else closes the menu
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target)) setOpen(false);
  });

  // Esc closes the menu first, then the top window
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) return setOpen(false);
    const top = topWindow();
    if (top) closeWin(top[0]);
  });
}