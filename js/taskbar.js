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
btn.addEventListener('click', ()=> {
  playing = !playing;
  const label = playing ? 'pause' : 'play';
  btn.replaceChildren(icon(label), label);
  btn.classList.toggle('on', playing);
  toast(playing ? 'now playing ♪' : 'music paused');
})