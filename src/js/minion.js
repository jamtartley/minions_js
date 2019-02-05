import Vector2D from "./vector_2d.js";

export default class MinionController {
    constructor(initialMinionCount) {
        this.minions = [];

        for (let i = 0; i < initialMinionCount; i++) {
            this.minions.push(new Minion(new Vector2D(500, 500)));
        }
    }

    update(dt) {
        for (let m of this.minions) {
            m.update(dt);
        }
    }

    draw(context) {
        for (let m of this.minions) {
            m.draw(context);
        }
    }
}

class Minion {
    constructor(position) {
        this.position = position;
        this.velocity = new Vector2D(0.1, 0.02);
    }

    update(dt) {
        let dv = new Vector2D(this.velocity.x * dt, this.velocity.y * dt);
        this.position.add(dv);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb(150, 150, 150)";
        context.fill();
    }
}
