const gameController = new GameController();

/**
 * Main script that controls the state of a game. It connects the GUI (view.js) with the game's logic (game.js)
 * and manages the game loop (gameLoop.js). It is comparable to a simple 'game engine'.
 * Provides methods to start/restart a game and to stop/clear a running game.
 * @constructor
 */
function GameController() {

    const userInput = new UserInput();

    this.gameIntervalInMsec = parseInt(gameSpeedInput.value);

    this.game = null;
    this.gameLoopInterval = null;

    /**
     * Start a new game / restart a running game.
     * It stops the current running gameLoopInterval.
     */
    this.start = async function () {
        if (this.gameLoopInterval !== null) {
            this.clear();
        }
        this.game = new Game();
        const view = new View(this.game);
        userInput.resetDirection();
        userInput.resetLastDirection();

        console.log("new game started");

        while (!this.game.isGameStopped){
            gameLoop(this.game, userInput);
            view.refreshScreen();
            userInput.updateLastDirection();
            await sleep(this.gameIntervalInMsec);
        }

        /*this.gameLoopInterval = setInterval(() => {
            gameLoop(this.game, userInput);
            if (!this.game.isGameStopped) {
                view.refreshScreen();
                userInput.updateLastDirection();
            } else {
                this.clear();
            }
        }, gameIntervalInMsec);*/
    };

    /**
     * Stops the current running game completely: the gameLoopInterval will be stopped and the connection to the
     * high-score listener will be canceled.
     */
    this.clear = function () {
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.game = null;
        console.log("game has been stopped");
    };
}

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
