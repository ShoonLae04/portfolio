function initFriendMessage(){
    const msg = $('#msg');

    // every button in the message closes it; two of them also reply
    $$('[data-msg]', msg).forEach((btn) => {
        btn.addEventListener('click', () => {
        msg.hidden = true;
        if (btn.textContent === 'omg ily') toast('ily too', 'heart');
        if (btn.textContent === 'thanks!') toast('anytime', 'star');
        });
    });
}
// Stickers: clicking one opens its window 
function initStickers() {
  $$('.sticker').forEach((sticker) => {
    sticker.addEventListener('click', () => openWin(sticker.dataset.open));
  });
}