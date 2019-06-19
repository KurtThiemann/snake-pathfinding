const gameSpeedInput = document.getElementById('gameSpeed');
gameSpeedInput.addEventListener('change', function () {
    gameController.gameIntervalInMsec = parseInt(gameSpeedInput.value);
});
