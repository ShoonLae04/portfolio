// The About me Notepad in the middle of the desk, filled in from content.js
function initAbout(){
  $('#about').innerHTML = `
  <p> Hi! I'm <b>${ME.name}</b></p>
  ${ME.about.map((para) => `<p>${fmt(para)}</p>`).join('')}
  <p class="notepad-hint"> click a sticker to see more<span class="caret"></span></p>
  `;
}
// Stickers: clicking one opens its window 
function initStickers() {
  $$('.sticker').forEach((sticker) => {
    sticker.addEventListener('click', () => openWin(sticker.dataset.open));
  });
}