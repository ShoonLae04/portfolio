// The About me Notepad in the middle of the desk, filled in from content.js
function initAbout(){
  $('#about').innerHTML = `
  <p> Hi! I'm <b>${ME.name}</b></p>
  ${ME.about.map((para) => `<p>${fmt(para)}</p>`).join('')}
  <p class="notepad-hint"> click a sticker to see more<span class="caret"></span></p>
  `;
}
//live Singapore weather (data.gov.sg , from NEA)
const DEFAULT_AREA = 'Tampines';
let weatherData = null;
async function initWeather(){
  const box = $('#weather');
  try {
    const forecastRes = await fetch ('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast');
    const tempRes = await fetch('https://api-open.data.gov.sg/v2/real-time/api/air-temperature');
    const forecastJson = await forecastRes.json();
    const tempJson = await tempRes.json();

    weatherData = {
      forecasts : forecastJson.data?.items?.[0]?.forecasts?? [],
      areas: forecastJson.data?.area_metadata?? [],
      stations: tempJson.data?.stations?? [],
      readings: tempJson.data?.readings?.[0]?.data?? [],
    }
    if (!weatherData.forecasts.length ) throw new Error('No forecast data');
    showWeather(savedArea());
  }
  catch (err) {
    console.warn('Weather not available', err);
    box.querySelector('.weather-text').textContent = 'weather is taking a nap';
  }
}
//draw the widget for one area 
function showWeather(areaName){
  const box = $('#weather');
  const forecasts = weatherData.forecasts;
  const mine = forecasts.find((f) => f.area == areaName )?? forecasts[0];
  box.innerHTML = ` 
  <p class="weather-title">Singapore weather</p>
  <p class="weather-now"><i data-icon="${weatherIcon(mine.forecast)}"></i>${areaTemp(mine.area)}&deg;C</p>
  <p class="weather-text">${esc(mine.forecast)}</p>
  <select class="weather-area" id="weatherArea" aria-label="Choose an area">
    ${forecasts.map((f)=> `
      <option ${f.area === mine.area ? 'selected' : ' '  }>${esc(f.area)}</option>

      `).join('')}
  </select>
  `;
  drawIcons(box);
  
  const select = $('#weatherArea');
  select.addEventListener('change' , () => {
    saveArea(select.value);
    showWeather(select.value);
    $('#weatherArea').focus();
  });

}
function areaTemp(areaName){
  const {areas, stations , readings} = weatherData;
  const area = areas.find((a) => a.name === areaName);
  if (!area) return '??';

  let nearest = null; 
  let bestDistance = Infinity;
  stations.forEach((s)=> {
    const reading = readings.find((r) => r.stationId === s.id);
    if (!reading) return;

    const dLat = s.location.latitude  - area.label_location.latitude;
    const dLon = s.location.longitude - area.label_location.longitude;
    const distance = dLat * dLat + dLon * dLon;

    if (distance < bestDistance) {
      bestDistance = distance;
      nearest = reading;
    }
  });

  return nearest ? Math.round(nearest.value) : '--';
  

}
function savedArea() {
  try { return localStorage.getItem('weatherArea') || DEFAULT_AREA; }
  catch { return DEFAULT_AREA; }
}

function saveArea(area) {
  try { localStorage.setItem('weatherArea', area); } catch {}
}
function weatherIcon(text) {
  const t = text.toLowerCase();
  if (t.includes('rain') || t.includes('shower') || t.includes('thunder')) return 'rain';
  if (t.includes('fair') && t.includes('night')) return 'moon';
  if (t.includes('fair')) return 'sun';
  return 'cloud';
}

// Stickers: clicking one opens its window 
function initStickers() {
  $$('.sticker').forEach((sticker) => {
    sticker.addEventListener('click', () => openWin(sticker.dataset.open));
  });
}