function UserInput() {

    let direction = "none";
    let lastDirection = "none";

    this.getDirection = function () {
        return direction;
    };

    this.resetDirection = function () {
        direction = "none";
    };

    document.addEventListener("keydown", function (event) {

        const key = event.key;

        if (key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown") {
            event.preventDefault();
        }

        if (key === "ArrowLeft" && lastDirection !== "right") {
            direction = "left";
        } else if (key === "ArrowUp" && lastDirection !== "down") {
            direction = "up";
        } else if (key === "ArrowRight" && lastDirection !== "left") {
            direction = "right";
        } else if (key === "ArrowDown" && lastDirection !== "up") {
            direction = "down";
        }
    });

    this.updateLastDirection = function () {
        lastDirection = direction;
    };

    this.resetLastDirection = function () {
        lastDirection = "none";
    }
}
