// Small helpers shared by every other file.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Things several files need to know while the page runs.
const state = {mobile:false };
// little pop-up reply message at the bottom
let toastTimer;
function toast(message){
    let t=$('.toast');
    if (!t){
        t=document.createElement('div');
        t.className='toast';
        document.body.appendChild(t);

    }
    t.textContext=message;
    t.hidden=false;
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=> (t.hidden=true), 2000);
}