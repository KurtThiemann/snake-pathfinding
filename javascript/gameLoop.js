function gameLoop(game, userInput) {
    game.snake.direction = Direction[userInput.getDirection()];
    game.snake.update();

    if(game.score > game.highScore){
        game.highScore = game.score;
        localStorage.setItem('highscore', game.score);
    }
}
