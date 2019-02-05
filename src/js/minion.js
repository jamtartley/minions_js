import * as Utils from "./utils.js";
import Vector2D from "./vector_2d.js";

export default class MinionController {
    constructor(initialMinionCount) {
        this.minions = [];

        for (let i = 0; i < initialMinionCount; i++) {
            let x = Utils.getRandInt(0, window.innerWidth);
            let y = Utils.getRandInt(0, window.innerHeight);
            this.minions.push(new Minion(new Vector2D(x, y)));
        }
    }

    update(dt, mousePos) {
        for (let m of this.minions) {
            m.update(dt, mousePos);
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
        this.velocity = new Vector2D(0, 0);
    }

    getSeekVel(target) {
        let seekVel = Vector2D.getSubtractionVector(target, this.position).getNormalisedClone();
        seekVel.multiplyScalar(0.5);
        return Vector2D.getSubtractionVector(seekVel, this.velocity);
    }

    update(dt, mousePos) {
        let seekVel = this.getSeekVel(mousePos);
        const maxForce = 0.5;

        seekVel.x = Utils.clamp(seekVel.x, -maxForce, maxForce);
        seekVel.y = Utils.clamp(seekVel.y, -maxForce, maxForce);

        const maxSpeed = 1;
        let desiredVel = new Vector2D((this.velocity.x + seekVel.x) * dt, (this.velocity.y + seekVel.y) * dt);
        let dv = new Vector2D(Utils.clamp(desiredVel.x, -maxSpeed, maxSpeed), Utils.clamp(desiredVel.y, -maxSpeed, maxSpeed));

        this.position.add(dv);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb(150, 150, 150)";
        context.fill();
    }
}
