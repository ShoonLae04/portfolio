// Pixel icons, drawn on a 24 x 24 grid.
// The drawings come from Pixelarticons (free, MIT licence): https://pixelarticons.com
const ICONS = {
  'star': '<path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/>',
  'play': '<path d="M15 11h-2V9h2zm0 4h-2v-2h2zm-2 2h-2v-2h2zm0-8h-2V7h2zm-2-2H9V5h2zM9 21H7V3h2zm6-8h2v-2h-2zm-6 4h2v2H9z"/>',
  'pause': '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
   'music': '<path d="M8 20H4v-2h4v2Zm10 0h-4v-2h4v2ZM4 18H2v-4h2v4Zm6 0H8v-4H4v-2h4V6h2v12Zm4 0h-2v-4h2v4Zm6 0h-2v-4h-4v-2h4V6h2v12ZM18 6h-8V4h8v2Z"/>',


};// make one <svg> icon by name
function icon(name) {
  if (!ICONS[name]) console.warn(`No pixel icon named "${name}"`);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name] || '';
  return svg;
}

// swap every <i data-icon="…"> inside root for its <svg>
function drawIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach((i) => i.replaceWith(icon(i.dataset.icon)));
}