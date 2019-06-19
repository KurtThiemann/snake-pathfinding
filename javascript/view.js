function View(game) {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const tileSizeInPixel = 15;

    function init() {
        canvas.width = game.gameWidth * tileSizeInPixel;
        canvas.height = game.gameHeight * tileSizeInPixel;
    }

    init();

    this.refreshScreen = function () {
        clearCanvas();
        redrawFood();
        redrawSnake();
        redrawScore();
        redrawHighScore();
    };

    function clearCanvas() {
        context.fillStyle = "rgb(200, 200, 200)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "black";
        context.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function redrawSnake() {
        if (game.snakePositions === undefined || game.snakePositions === null) return;
        for (let i = 0; i < game.snakePositions.length; i++) {
            const snakeTile = game.snakePositions[i];
            if (i === 0) {
                context.fillStyle = "black";
                context.strokeStyle = "darkgreen";
            } else {
                context.fillStyle = "green";
                context.strokeStyle = "darkgreen";
            }
            context.fillRect(snakeTile.x * tileSizeInPixel, snakeTile.y * tileSizeInPixel, tileSizeInPixel, tileSizeInPixel);
            context.strokeRect(snakeTile.x * tileSizeInPixel, snakeTile.y * tileSizeInPixel, tileSizeInPixel, tileSizeInPixel);
        }
    }

    function redrawScore() {
        context.font = "18px Arial";
        context.fillStyle = "black";
        context.fillText("Score: " + game.score, tileSizeInPixel, 2 * tileSizeInPixel);
    }

    function redrawHighScore() {
        context.font = "18px Arial";
        context.fillStyle = "black";
        context.fillText("HighScore: " + game.highScore, canvas.width - 150, 2 * tileSizeInPixel);
    }

    function redrawFood() {
        if (game.foodPosition === undefined || game.foodPosition === null) return;
        context.fillStyle = "red";
        context.strokeStyle = "darkred";
        context.fillRect(game.foodPosition.x * tileSizeInPixel, game.foodPosition.y * tileSizeInPixel, tileSizeInPixel, tileSizeInPixel);
        context.strokeRect(game.foodPosition.x * tileSizeInPixel, game.foodPosition.y * tileSizeInPixel, tileSizeInPixel, tileSizeInPixel);
    }
}
