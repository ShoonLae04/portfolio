initAbout();
drawIcons();
initClock();
initMusic();
initStickers();
initWeather();
setInterval(initWeather, 30 * 60 * 1000);   // NEA updates every 30 minutes
initStartMenu();