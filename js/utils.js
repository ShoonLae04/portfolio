// Small helpers shared by every other file.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Things several files need to know while the page runs.
const state = {mobile:false };
// little pop-up reply message at the bottom
let toastTimer;
function toast(message, iconName){
    let t=$('.toast');
    if (!t){
        t=document.createElement('div');
        t.className='toast';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);

    }
    t.replaceChildren(message);                  // the words
    if (iconName) t.append(icon(iconName));      // + the icon, if you gave one
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=> (t.hidden=true), 2000);
}
// make text safe to put inside HTML (a < in your text can't break the page)
const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
}[c]));

// like esc, but [text in square brackets] becomes a yellow "to fill in" mark
const fmt = (text) => esc(text).replace(/\[([^\]]+)\]/g, '<span class="todo">$1</span>');