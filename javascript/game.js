/**
 * Hier werden die erforderlichen Datenstrukturen angelegt und die Spielelogik programmiert.
 * Die hier definierten Funktionen werden in der 'gameLoop.js' benötigt und von dort aus aufgerufen.
 */
let globalGame = null;
class Game{
    constructor(){
        this.size = new Vector2(70,35);
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highscore') || 0);
        this.isGameStopped = false;
        this.foodPosition = new Vector2(0, 0);
        this.snake = new Snake(this);
        this.updateFood();

        /**
         * Beendet das Spiel und zeigt die erreichte Punktzahl an
         **/
        this.gameOver = function () {
            this.isGameStopped = true;
            console.log('Game ended');
            alert("Game Over... \"Du\" hast folgende Punktzahl erreicht: " + this.score);
            //gameController.start();
        };
        globalGame = this;
    }

    get gameWidth(){
        return this.size.x;
    }

    get gameHeight(){
        return this.size.y;
    }

    get snakePositions(){
        return this.snake.tiles;
    }

    getFieldType(pos, snake = this.snake.tiles){
        if(pos.x < 0 || pos.x >= this.gameWidth || pos.y < 0 || pos.y >= this.gameHeight){
            return Field.none;
        }
        if(pos.inArray(snake)){
            return Field.snake;
        }
        if(pos.equals(this.foodPosition)){
            return Field.food;
        }
        return Field.empty;
    }

    updateFood(){
        this.foodPosition = this.getRandomFreeField();
    }

    getRandomFreeField(){
        let newPos = new Vector2(radnomInt(0, this.gameWidth), radnomInt(0, this.gameHeight));
        while(this.getFieldType(newPos) !== Field.empty){
            newPos.x = radnomInt(0, this.gameWidth);
            newPos.y = radnomInt(0, this.gameHeight);
        }
        return newPos;
    }

    findPath(start, dest, panic, baseSnakeTiles = this.snake.tiles){
        const game = this;
        let fields = [];
        function find(path, snakeTiles = baseSnakeTiles, openFields = []){
            let pos = path[path.length - 1];
            let diff = new Vector2(dest.x - pos.x, dest.y - pos.y);
            let directions = [];
            directions.push([(diff.y ? 2 : 0) + (diff.y <= 0 ? 1 : 0), Direction.up]);
            directions.push([(diff.y ? 2 : 0) + (diff.y > 0 ? 1 : 0), Direction.down]);
            directions.push([(diff.x ? 2 : 0) + (diff.x <= 0 ? 1 : 0), Direction.left]);
            directions.push([(diff.x ? 2 : 0) + (diff.x > 0 ? 1 : 0), Direction.right]);
            directions.sort(function(a, b){
                return (b[0] - a[0]) * (panic ? -1 : 1);
            });
            fields.push(pos);
            if(pos.equals(dest)){
                return path;
            }
            for(let dir of directions){
                dir = dir[1];
                let newPath = path.slice();
                let newSnakeTiles = snakeTiles.slice();
                let newField = (new Vector2(path[path.length - 1])).add(dir).overflow(game.size); //allow crossing game borders
                //let newField = (new Vector2(path[path.length - 1])).add(dir); //don't allow crossing game borders
                if(!newField.inArray(openFields) && newField.inArray(fields)){
                    continue;
                }
                let fieldType = game.getFieldType(newField, newSnakeTiles);
                if(fieldType !== Field.empty && fieldType !== Field.food){
                    continue
                }
                newSnakeTiles.unshift(newField);
                if(newSnakeTiles.length){
                    openFields.push(newSnakeTiles.pop());
                }
                newPath.push(newField);
                if(newPath.length > game.size.x * game.size.y){
                    console.log('path length');
                    continue;
                }
                let p = find(newPath, newSnakeTiles, openFields);
                if(p){
                    return p;
                }
            }
            return false;
        }
        return find([start])
    }
}

class Vector2{
    constructor(x, y){
        if(x && x instanceof Vector2){
            this.x = x.x;
            this.y = x.y;
        }else{
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    add(val){
        this.x += val.x;
        this.y += val.y;
        return this;
    }

    overflow(max){
        this.x = this.x % max.x;
        this.y = this.y % max.y;
        this.x = this.x < 0 ? max.x + this.x : this.x;
        this.y = this.y < 0 ? max.y + this.y : this.y;
        return this;
    }

    inArray(arr){
        for(let elem of arr){
            if(!(elem instanceof Vector2)){
                continue;
            }
            if(elem.x === this.x && elem.y === this.y){
                return elem;
            }
        }
        return null;
    }

    equals(val){
        return (val.x === this.x && val.y === this.y)
    }
}

const Field = {
    none: -1,
    empty: 0,
    snake: 1,
    food: 2,
};

const Direction = {
    up: new Vector2(0, -1),
    down: new Vector2(0, 1),
    left: new Vector2(-1, 0),
    right: new Vector2(1, 0),
    none: new Vector2(0, 0)
};

class Snake{
    constructor(game){
        this.game = game;
        this.length = 3;
        this.tiles = [
            new Vector2(Math.round(this.game.gameWidth / 2), Math.round(this.game.gameHeight / 2))
        ];
        this.direction = Direction.up;
        this.panic = false;
        this.path = null;
        this.auto = true;
        this.foodPath = null;
    }

    get position(){
        return new Vector2(this.tiles[0] || 0);
    }

    findPath(pos){
        if(this.foodPath && this.foodPath.length){
            return this.foodPath.shift();
        }
        console.log('new path');
        let path = this.game.findPath(this.position, pos);
        if(!path){
            path = this.game.findPath(this.position, pos, true);
        }
        if(!path){
            this.game.gameOver();
            return false;
        }
        path.shift();
        this.foodPath = path;
        return this.foodPath.shift();
    }

    startPanic(pos){//currently not used
        console.log('PANIC level 2');
        let snakeTiles = this.tiles.slice();
        let dest;
        let success = false;
        while (snakeTiles.length) {
            dest = snakeTiles.pop();
            console.log(snakeTiles.length);
            if(this.game.findPath(this.position, pos, false, snakeTiles)){
                console.log('success');
                success = true;
                break;
            }
        }
        if(!success){
            console.log('unable to find path');
            this.game.gameOver();
            return false;
        }

        this.path = this.game.findPath(this.position, dest, true);
        if(!this.path){
            console.log('no path');
            this.game.gameOver();
            return false;
        }
        this.path.shift();
        return this.path.shift();
    }

    update(){
        if(this.direction.equals(Direction.none) && !this.auto){
            return;
        }
        let newPos;
        if(this.auto){
            newPos = this.findPath(this.game.foodPosition);
            if(!newPos){
                return;
            }
        }else{
            newPos = this.position.add(this.direction).overflow(this.game.size);
        }
        while(this.tiles.length+1 > this.length){
            this.tiles.pop();
        }
        let fieldType = this.game.getFieldType(newPos);
        if(fieldType !== Field.empty && fieldType !== Field.food){
            this.game.gameOver();
            return;
        }
        if(fieldType === Field.food){
            this.length++;
            this.game.score++;
            this.game.updateFood();
        }
        this.tiles.unshift(newPos);
    }
}

function radnomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
